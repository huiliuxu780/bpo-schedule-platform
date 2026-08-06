"""Schedule period, matrix editing, validation, publishing and versions.

Implements the CORN WFM V2.0 chapter 13 rules: monthly period edited per
week (13.1), activity-segment matrix cells, optimistic-lock batch save,
half-hour coverage recalculation (13.3), range-scoped publish with skill
coefficient snapshots, and published versions whose adjustments create new
versions instead of overwriting history.
"""

from __future__ import annotations

import re
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import ForeignKey, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker
from sqlalchemy.types import JSON

from backend.app.coverage_calculation import (
    WORK_ACTIVITY_TYPE,
    CoverageSegment,
    calculate_range_coverage,
    crosses_midnight,
    parse_time_to_minutes,
    segment_duration_minutes,
)
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_persistence import Base, build_engine
from backend.app.list_pagination import (
    ListPage,
    clamp_page_limit,
    paginate_sorted_rows,
)
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    CoverageDeltaRow,
    CoverageIntervalRow,
    CoverageRecalculateRequest,
    CoverageRecalculateResponse,
    MatrixSegment,
    ScheduleMatrixBatchUpdateRequest,
    ScheduleMatrixBatchUpdateResponse,
    ScheduleMatrixCell,
    ScheduleMatrixConflict,
    ScheduleMatrixResponse,
    SchedulePeriodCreateRequest,
    SchedulePeriodRecord,
    SchedulePeriodVersionListResponse,
    SchedulePeriodVersionRecord,
    SchedulePeriodWeek,
    SchedulePublishRequest,
    SchedulePublishResponse,
    ScheduleValidateRequest,
    ScheduleValidateResponse,
    ScheduleValidationIssue,
    ScheduleVersionCellDiff,
    ScheduleVersionDiffResponse,
    SkillCoefficientSnapshotRecord,
)
from backend.app.personnel_schedule_persistence import (
    PersonnelSchedulePersistenceRepository,
)

NIGHT_SHIFT_START_MINUTES = 22 * 60
DEFAULT_SKILL_COEFFICIENT = 1.0
SKILL_COEFFICIENT_DEFAULT_SOURCE = (
    "built_in_default（CORN WFM V2.0 第16章待确认：技能标准人力系数未入主数据，默认 1.0）"
)
SKILL_COEFFICIENT_SEGMENT_SOURCE = "schedule_segment_input"


class MatrixVersionConflictError(ValueError):
    """Raised when a batch save carries a stale ``base_version``."""

    def __init__(
        self,
        current_version: int,
        conflicts: list[ScheduleMatrixConflict],
    ) -> None:
        self.current_version = current_version
        self.conflicts = conflicts
        super().__init__(
            f"SCHEDULE_MATRIX_VERSION_CONFLICT: current version {current_version}"
        )


class SchedulePeriodEntity(Base):
    __tablename__ = "schedule_periods"

    period_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    month: Mapped[str] = mapped_column(String(7), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    version: Mapped[int] = mapped_column(nullable=False, default=0)
    weeks_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(40), nullable=False)


class ScheduleMatrixCellEntity(Base):
    __tablename__ = "schedule_matrix_cells"

    period_id: Mapped[str] = mapped_column(
        ForeignKey("schedule_periods.period_id"),
        primary_key=True,
    )
    employee_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    schedule_date: Mapped[str] = mapped_column(String(20), primary_key=True)
    segments_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    locked: Mapped[bool] = mapped_column(nullable=False, default=False)
    updated_at: Mapped[str] = mapped_column(String(40), nullable=False)


class SchedulePeriodVersionEntity(Base):
    __tablename__ = "schedule_period_versions"

    version_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    period_id: Mapped[str] = mapped_column(
        ForeignKey("schedule_periods.period_id"),
        nullable=False,
        index=True,
    )
    publication_id: Mapped[str] = mapped_column(String(160), nullable=False)
    org_scope: Mapped[str] = mapped_column(String(120), nullable=False)
    date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    published_at: Mapped[str] = mapped_column(String(40), nullable=False)
    cell_count: Mapped[int] = mapped_column(nullable=False)


class ScheduleVersionCellEntity(Base):
    __tablename__ = "schedule_version_cells"

    cell_row_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    version_id: Mapped[str] = mapped_column(
        ForeignKey("schedule_period_versions.version_id"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[str] = mapped_column(String(80), nullable=False)
    schedule_date: Mapped[str] = mapped_column(String(20), nullable=False)
    segments_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    locked: Mapped[bool] = mapped_column(nullable=False, default=False)


class SchedulePublicationEntity(Base):
    __tablename__ = "schedule_publications"

    publication_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    period_id: Mapped[str] = mapped_column(
        ForeignKey("schedule_periods.period_id"),
        nullable=False,
        index=True,
    )
    version_id: Mapped[str] = mapped_column(String(160), nullable=False)
    org_scope: Mapped[str] = mapped_column(String(120), nullable=False)
    date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    published_at: Mapped[str] = mapped_column(String(40), nullable=False)


class ScheduleSkillCoefficientSnapshotEntity(Base):
    __tablename__ = "schedule_skill_coefficient_snapshots"

    snapshot_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    publication_id: Mapped[str] = mapped_column(
        ForeignKey("schedule_publications.publication_id"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[str] = mapped_column(String(80), nullable=False)
    skill_id: Mapped[str] = mapped_column(String(80), nullable=False)
    coefficient: Mapped[float] = mapped_column(nullable=False)
    default_source: Mapped[str] = mapped_column(String(255), nullable=False)


class SchedulePeriodRepository:
    def __init__(self, database_url: str | None = None):
        self.engine = build_engine(database_url)
        self.session_factory = sessionmaker(
            bind=self.engine,
            autoflush=False,
            expire_on_commit=False,
            future=True,
        )

    def init_schema(self) -> None:
        Base.metadata.create_all(self.engine)

    def get_period_entity(self, session: Session, period_id: str) -> SchedulePeriodEntity | None:
        return session.get(SchedulePeriodEntity, period_id)

    def insert_period_with_cells(
        self,
        period: SchedulePeriodEntity,
        cells: list[ScheduleMatrixCellEntity],
    ) -> None:
        with self.session_factory.begin() as session:
            existing = session.get(SchedulePeriodEntity, period.period_id)
            if existing is not None:
                raise ValueError(
                    f"SCHEDULE_PERIOD_ALREADY_EXISTS: {period.period_id}"
                )
            session.add(period)
            session.flush()
            for cell in cells:
                session.add(cell)

    def get_period(self, period_id: str) -> SchedulePeriodRecord | None:
        with self.session_factory() as session:
            entity = session.get(SchedulePeriodEntity, period_id)
            if entity is None:
                return None
            return _period_record(entity)

    def list_periods(self, month: str | None = None) -> list[SchedulePeriodRecord]:
        with self.session_factory() as session:
            query = select(SchedulePeriodEntity).order_by(SchedulePeriodEntity.month)
            if month:
                query = query.where(SchedulePeriodEntity.month == month)
            entities = list(session.scalars(query))
        return [_period_record(entity) for entity in entities]

    def load_cells(
        self,
        period_id: str,
        date_from: str | None = None,
        date_to: str | None = None,
    ) -> list[ScheduleMatrixCellEntity]:
        with self.session_factory() as session:
            query = select(ScheduleMatrixCellEntity).where(
                ScheduleMatrixCellEntity.period_id == period_id
            )
            if date_from is not None:
                query = query.where(ScheduleMatrixCellEntity.schedule_date >= date_from)
            if date_to is not None:
                query = query.where(ScheduleMatrixCellEntity.schedule_date <= date_to)
            query = query.order_by(
                ScheduleMatrixCellEntity.employee_id,
                ScheduleMatrixCellEntity.schedule_date,
            )
            return list(session.scalars(query))

    def load_version_cells(self, version_id: str) -> list[ScheduleVersionCellEntity]:
        with self.session_factory() as session:
            return list(
                session.scalars(
                    select(ScheduleVersionCellEntity)
                    .where(ScheduleVersionCellEntity.version_id == version_id)
                    .order_by(
                        ScheduleVersionCellEntity.employee_id,
                        ScheduleVersionCellEntity.schedule_date,
                    )
                )
            )

    def load_versions(self, period_id: str) -> list[SchedulePeriodVersionEntity]:
        with self.session_factory() as session:
            return list(
                session.scalars(
                    select(SchedulePeriodVersionEntity)
                    .where(SchedulePeriodVersionEntity.period_id == period_id)
                    .order_by(SchedulePeriodVersionEntity.published_at)
                )
            )

    def load_skill_snapshots(
        self, publication_id: str
    ) -> list[ScheduleSkillCoefficientSnapshotEntity]:
        with self.session_factory() as session:
            return list(
                session.scalars(
                    select(ScheduleSkillCoefficientSnapshotEntity)
                    .where(
                        ScheduleSkillCoefficientSnapshotEntity.publication_id
                        == publication_id
                    )
                    .order_by(
                        ScheduleSkillCoefficientSnapshotEntity.employee_id,
                        ScheduleSkillCoefficientSnapshotEntity.skill_id,
                    )
                )
            )


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _period_record(entity: SchedulePeriodEntity) -> SchedulePeriodRecord:
    return SchedulePeriodRecord(
        period_id=entity.period_id,
        month=entity.month,
        status=entity.status,
        date_from=entity.date_from,
        date_to=entity.date_to,
        version=entity.version,
        weeks=[SchedulePeriodWeek(**week) for week in (entity.weeks_json or [])],
    )


def _segment_model(entity_row: dict) -> MatrixSegment:
    return MatrixSegment(**entity_row)


def _cell_record(entity: ScheduleMatrixCellEntity) -> ScheduleMatrixCell:
    return ScheduleMatrixCell(
        employee_id=entity.employee_id,
        schedule_date=entity.schedule_date,
        locked=bool(entity.locked),
        segments=[_segment_model(row) for row in (entity.segments_json or [])],
    )


def build_period_weeks(date_from: str, date_to: str) -> list[SchedulePeriodWeek]:
    """Split the period into Monday-based week chunks."""
    start = date.fromisoformat(date_from)
    end = date.fromisoformat(date_to)
    weeks: list[SchedulePeriodWeek] = []
    chunk_start = start
    index = 1
    while chunk_start <= end:
        days_to_sunday = 6 - chunk_start.weekday()
        chunk_end = min(chunk_start + timedelta(days=days_to_sunday), end)
        weeks.append(
            SchedulePeriodWeek(
                week_id=f"W{index}",
                label=f"第{index}周",
                date_from=chunk_start.isoformat(),
                date_to=chunk_end.isoformat(),
            )
        )
        chunk_start = chunk_end + timedelta(days=1)
        index += 1
    return weeks


def to_coverage_segment(segment: MatrixSegment) -> CoverageSegment:
    return CoverageSegment(
        activity_type=segment.activity_type,
        start_time=segment.start_time,
        end_time=segment.end_time,
        crosses_day=segment.crosses_day,
        skill_id=segment.skill_id,
        allocation_ratio=segment.allocation_ratio,
        skill_coefficient=(
            segment.skill_coefficient
            if segment.skill_coefficient is not None
            else DEFAULT_SKILL_COEFFICIENT
        ),
        activity_coverage=segment.activity_coverage,
    )


def build_demand_by_date(
    forecast_repository: ForecastPersistenceRepository | None,
    date_from: str,
    date_to: str,
) -> dict[str, dict[str, float]]:
    """Aggregate the latest forecast version into per-date interval demand."""
    if forecast_repository is None:
        return {}
    detail = forecast_repository.get_latest_forecast_version()
    if detail is None:
        return {}
    demand: dict[str, dict[str, float]] = {}
    for interval in detail.intervals:
        if interval.forecast_date < date_from or interval.forecast_date > date_to:
            continue
        per_date = demand.setdefault(interval.forecast_date, {})
        per_date[interval.interval_start] = (
            per_date.get(interval.interval_start, 0.0) + interval.required_agents
        )
    return demand


def _cells_by_date(
    cells: list[ScheduleMatrixCellEntity],
) -> dict[str, dict[str, list[CoverageSegment]]]:
    grouped: dict[str, dict[str, list[CoverageSegment]]] = {}
    for cell in cells:
        per_date = grouped.setdefault(cell.schedule_date, {})
        per_date[cell.employee_id] = [
            to_coverage_segment(_segment_model(row))
            for row in (cell.segments_json or [])
        ]
    return grouped


def create_schedule_period_from_batch(
    request: SchedulePeriodCreateRequest,
    repository: SchedulePeriodRepository,
    *,
    import_repository,
    schedule_repository: PersonnelSchedulePersistenceRepository,
) -> SchedulePeriodRecord:
    """Derive a draft period matrix from an applied personnel schedule batch."""
    if not re.fullmatch(r"\d{4}-\d{2}", request.month):
        raise ValueError("MONTH_INVALID: month 必须为 YYYY-MM 格式")

    batch = import_repository.get_import_batch(request.source_batch_id)
    if batch is None:
        raise ValueError(f"SOURCE_BATCH_NOT_FOUND: {request.source_batch_id}")
    if batch.batch.file_type != "personnel_schedule":
        raise ValueError("SOURCE_BATCH_TYPE_INVALID: 来源批次不是人员排班类型")

    import_version_id = next(
        (
            version.version_id
            for version in batch.versions
            if version.version_type == "personnel_schedule"
        ),
        None,
    )
    if import_version_id is None:
        raise ValueError("SOURCE_BATCH_MISSING_SCHEDULE_VERSION: 批次缺少人员排班版本")
    detail = schedule_repository.get_schedule_version_by_import_version(
        import_version_id
    )
    if detail is None:
        raise ValueError("SOURCE_BATCH_NOT_APPLIED: 人员排班版本尚未应用")

    now = _now_iso()
    weeks = build_period_weeks(
        detail.version.business_date_from, detail.version.business_date_to
    )
    period = SchedulePeriodEntity(
        period_id=f"PERIOD-{request.month}",
        month=request.month,
        status="draft",
        date_from=detail.version.business_date_from,
        date_to=detail.version.business_date_to,
        version=0,
        weeks_json=[week.model_dump() for week in weeks],
        created_at=now,
        updated_at=now,
    )
    cells = [
        ScheduleMatrixCellEntity(
            period_id=period.period_id,
            employee_id=item.employee_id,
            schedule_date=item.schedule_date,
            segments_json=[
                MatrixSegment(
                    shift_code=item.shift_type_id,
                    activity_type="work",
                    start_time=item.start_time,
                    end_time=item.end_time,
                    skill_id=item.skill_id,
                    allocation_ratio=1.0,
                    skill_coefficient=None,
                    activity_coverage=1.0,
                ).model_dump()
            ],
            locked=False,
            updated_at=now,
        )
        for item in detail.details
    ]
    repository.insert_period_with_cells(period, cells)
    loaded = repository.get_period(period.period_id)
    assert loaded is not None
    return loaded


def get_schedule_matrix(
    repository: SchedulePeriodRepository,
    period_id: str,
    *,
    week_id: str | None = None,
    limit: int | None = None,
    cursor: str | None = None,
) -> ScheduleMatrixResponse:
    record = repository.get_period(period_id)
    if record is None:
        raise ValueError(f"SCHEDULE_PERIOD_NOT_FOUND: {period_id}")

    week: SchedulePeriodWeek | None = None
    range_from, range_to = record.date_from, record.date_to
    if week_id is not None:
        week = next((item for item in record.weeks if item.week_id == week_id), None)
        if week is None:
            raise ValueError(f"SCHEDULE_WEEK_NOT_FOUND: {week_id}")
        range_from, range_to = week.date_from, week.date_to

    cells = repository.load_cells(period_id, range_from, range_to)
    rows = [_cell_record(cell) for cell in cells]

    page_limit = clamp_page_limit(limit)
    next_cursor: str | None = None
    total = len(rows)
    if page_limit is not None:
        page: ListPage = paginate_sorted_rows(
            rows,
            limit=page_limit,
            cursor=cursor,
            sort_key=lambda row: (row.employee_id, row.schedule_date),
            directions=("asc", "asc"),
        )
        rows = list(page.items)
        total = page.total
        next_cursor = page.next_cursor

    return ScheduleMatrixResponse(
        period_id=period_id,
        version=record.version,
        date_from=range_from,
        date_to=range_to,
        week=week,
        employees=sorted({row.employee_id for row in rows}),
        cells=rows,
        total=total,
        next_cursor=next_cursor,
    )


def apply_matrix_batch(
    repository: SchedulePeriodRepository,
    period_id: str,
    request: ScheduleMatrixBatchUpdateRequest,
    *,
    forecast_repository: ForecastPersistenceRepository | None = None,
) -> ScheduleMatrixBatchUpdateResponse:
    """Apply set/copy/clear/lock operations with optimistic locking."""
    targeted = _targeted_cells(request)
    with repository.session_factory.begin() as session:
        period = session.get(SchedulePeriodEntity, period_id)
        if period is None:
            raise ValueError(f"SCHEDULE_PERIOD_NOT_FOUND: {period_id}")
        if period.version != request.base_version:
            raise MatrixVersionConflictError(
                period.version,
                [
                    ScheduleMatrixConflict(
                        employee_id=employee_id,
                        schedule_date=schedule_date,
                        reason="BASE_VERSION_STALE",
                    )
                    for employee_id, schedule_date in sorted(targeted)
                ],
            )

        affected_dates: set[str] = set()
        cell_map: dict[tuple[str, str], ScheduleMatrixCellEntity] = {
            (cell.employee_id, cell.schedule_date): cell
            for cell in _session_cells_for_keys(session, period_id, targeted)
        }
        demand_by_date = build_demand_by_date(
            forecast_repository, period.date_from, period.date_to
        )
        before_planned = _planned_by_interval(
            period_id,
            cell_map,
            sorted({schedule_date for _, schedule_date in targeted}),
            demand_by_date,
        )

        now = _now_iso()
        conflicts: list[ScheduleMatrixConflict] = []
        accepted = 0

        for change in request.changes:
            key = (change.employee_id, change.schedule_date)
            existing = cell_map.get(key)
            if existing is not None and existing.locked:
                conflicts.append(_conflict(key, "CELL_LOCKED"))
                continue
            _upsert_cell(session, period_id, key, change.segments, False, now)
            affected_dates.add(change.schedule_date)
            accepted += 1

        for copy in request.copies:
            source = cell_map.get((copy.source_employee_id, copy.source_date))
            if source is None:
                source = session.get(
                    ScheduleMatrixCellEntity,
                    (period_id, copy.source_employee_id, copy.source_date),
                )
            if source is None:
                for target in copy.targets:
                    conflicts.append(
                        ScheduleMatrixConflict(
                            employee_id=target.employee_id,
                            schedule_date=target.schedule_date,
                            reason="COPY_SOURCE_MISSING",
                        )
                    )
                continue
            source_segments = [
                _segment_model(row) for row in (source.segments_json or [])
            ]
            for target in copy.targets:
                key = (target.employee_id, target.schedule_date)
                existing = cell_map.get(key)
                if existing is not None and existing.locked:
                    conflicts.append(_conflict(key, "CELL_LOCKED"))
                    continue
                _upsert_cell(session, period_id, key, source_segments, False, now)
                affected_dates.add(target.schedule_date)
                accepted += 1

        for clear in request.clears:
            key = (clear.employee_id, clear.schedule_date)
            existing = cell_map.get(key)
            if existing is None:
                continue
            if existing.locked:
                conflicts.append(_conflict(key, "CELL_LOCKED"))
                continue
            session.delete(existing)
            cell_map.pop(key, None)
            affected_dates.add(clear.schedule_date)
            accepted += 1

        for lock in request.locks:
            key = (lock.employee_id, lock.schedule_date)
            existing = cell_map.get(key)
            if existing is None:
                session.add(
                    ScheduleMatrixCellEntity(
                        period_id=period_id,
                        employee_id=lock.employee_id,
                        schedule_date=lock.schedule_date,
                        segments_json=[],
                        locked=lock.locked,
                        updated_at=now,
                    )
                )
            else:
                existing.locked = lock.locked
                existing.updated_at = now
            accepted += 1

        period.version += 1
        period.updated_at = now
        new_version = period.version

        # Reload affected cells inside the same transaction for the after-state.
        # autoflush is disabled, so flush first to make merged cells queryable.
        session.flush()
        if affected_dates:
            refreshed = (
                session.scalars(
                    select(ScheduleMatrixCellEntity).where(
                        ScheduleMatrixCellEntity.period_id == period_id,
                        ScheduleMatrixCellEntity.schedule_date.in_(
                            sorted(affected_dates)
                        ),
                    )
                )
            )
            refreshed_map = {
                (cell.employee_id, cell.schedule_date): cell for cell in refreshed
            }
        else:
            refreshed_map = {}
        after_planned = _planned_by_interval(
            period_id,
            {**cell_map, **refreshed_map},
            sorted(affected_dates),
            demand_by_date,
        )

    coverage_delta = _coverage_delta(
        before_planned, after_planned, demand_by_date
    )
    return ScheduleMatrixBatchUpdateResponse(
        version=new_version,
        accepted=accepted,
        conflicts=conflicts,
        coverage_delta=coverage_delta,
    )


def _targeted_cells(
    request: ScheduleMatrixBatchUpdateRequest,
) -> set[tuple[str, str]]:
    targeted: set[tuple[str, str]] = set()
    for change in request.changes:
        targeted.add((change.employee_id, change.schedule_date))
    for copy in request.copies:
        targeted.add((copy.source_employee_id, copy.source_date))
        for target in copy.targets:
            targeted.add((target.employee_id, target.schedule_date))
    for clear in request.clears:
        targeted.add((clear.employee_id, clear.schedule_date))
    for lock in request.locks:
        targeted.add((lock.employee_id, lock.schedule_date))
    return targeted


def _conflict(key: tuple[str, str], reason: str) -> ScheduleMatrixConflict:
    return ScheduleMatrixConflict(
        employee_id=key[0],
        schedule_date=key[1],
        reason=reason,
    )


def _session_cells_for_keys(
    session: Session,
    period_id: str,
    keys: set[tuple[str, str]],
) -> list[ScheduleMatrixCellEntity]:
    if not keys:
        return []
    dates = sorted({schedule_date for _, schedule_date in keys})
    return list(
        session.scalars(
            select(ScheduleMatrixCellEntity).where(
                ScheduleMatrixCellEntity.period_id == period_id,
                ScheduleMatrixCellEntity.schedule_date.in_(dates),
            )
        )
    )


def _upsert_cell(
    session: Session,
    period_id: str,
    key: tuple[str, str],
    segments: list[MatrixSegment],
    locked: bool,
    updated_at: str,
) -> None:
    session.merge(
        ScheduleMatrixCellEntity(
            period_id=period_id,
            employee_id=key[0],
            schedule_date=key[1],
            segments_json=[segment.model_dump() for segment in segments],
            locked=locked,
            updated_at=updated_at,
        )
    )


def _planned_by_interval(
    period_id: str,
    cell_map: dict[tuple[str, str], ScheduleMatrixCellEntity],
    dates: list[str],
    demand_by_date: dict[str, dict[str, float]],
) -> dict[tuple[str, str], float]:
    if not dates:
        return {}
    date_from, date_to = dates[0], dates[-1]
    cells_by_date: dict[str, dict[str, list[CoverageSegment]]] = {}
    for (employee_id, schedule_date), cell in cell_map.items():
        if schedule_date < date_from or schedule_date > date_to:
            continue
        per_date = cells_by_date.setdefault(schedule_date, {})
        per_date[employee_id] = [
            to_coverage_segment(_segment_model(row))
            for row in (cell.segments_json or [])
        ]
    rows = calculate_range_coverage(
        date_from,
        date_to,
        cells_by_date,
        {day: demand_by_date.get(day, {}) for day in dates},
    )
    return {
        (row.date, row.interval_start): row.planned_headcount for row in rows
    }


def _coverage_delta(
    before: dict[tuple[str, str], float],
    after: dict[tuple[str, str], float],
    demand_by_date: dict[str, dict[str, float]],
) -> list[CoverageDeltaRow]:
    delta: list[CoverageDeltaRow] = []
    for key in sorted(set(before) | set(after)):
        previous = before.get(key)
        current = after.get(key)
        if previous == current:
            continue
        planned = current if current is not None else 0.0
        demand = float(demand_by_date.get(key[0], {}).get(key[1], 0.0))
        delta.append(
            CoverageDeltaRow(
                date=key[0],
                interval_start=key[1],
                planned_headcount=planned,
                gap=round(demand - planned, 6),
                coverage_rate=round(planned / demand, 6) if demand > 0 else None,
            )
        )
    return delta


def recalculate_coverage(
    repository: SchedulePeriodRepository,
    period_id: str,
    request: CoverageRecalculateRequest,
    *,
    forecast_repository: ForecastPersistenceRepository | None = None,
) -> CoverageRecalculateResponse:
    record = repository.get_period(period_id)
    if record is None:
        raise ValueError(f"SCHEDULE_PERIOD_NOT_FOUND: {period_id}")
    if request.date_to < request.date_from:
        raise ValueError("DATE_RANGE_INVALID: date_to 不能早于 date_from")

    cells = repository.load_cells(period_id, request.date_from, request.date_to)
    demand_by_date = build_demand_by_date(
        forecast_repository, request.date_from, request.date_to
    )
    rows = calculate_range_coverage(
        request.date_from,
        request.date_to,
        _cells_by_date(cells),
        demand_by_date,
    )
    intervals = [
        CoverageIntervalRow(
            date=row.date,
            interval_start=row.interval_start,
            demand_headcount=row.demand_headcount,
            planned_headcount=row.planned_headcount,
            gap=row.gap,
            coverage_rate=row.coverage_rate,
            # 一期标准人力口径与物理人数口径保持一致（字段预留）
            std_demand_headcount=row.demand_headcount,
            std_planned_headcount=row.planned_headcount,
            std_gap=row.gap,
            std_coverage_rate=row.coverage_rate,
        )
        for row in rows
    ]
    return CoverageRecalculateResponse(
        period_id=period_id,
        date_from=request.date_from,
        date_to=request.date_to,
        intervals=intervals,
    )


def validate_schedule_period(
    repository: SchedulePeriodRepository,
    master_repository: MasterDataPersistenceRepository,
    scheduling_fields: dict[str, float | bool | str],
    period_id: str,
    request: ScheduleValidateRequest,
) -> ScheduleValidateResponse:
    record = repository.get_period(period_id)
    if record is None:
        raise ValueError(f"SCHEDULE_PERIOD_NOT_FOUND: {period_id}")
    if request.date_to < request.date_from:
        raise ValueError("DATE_RANGE_INVALID: date_to 不能早于 date_from")

    cells = repository.load_cells(period_id, request.date_from, request.date_to)
    scoped_employees = _employees_in_scope(master_repository, request.org_scope)

    cells_by_employee: dict[str, dict[str, list[MatrixSegment]]] = {}
    for cell in cells:
        cells_by_employee.setdefault(cell.employee_id, {})[cell.schedule_date] = [
            _segment_model(row) for row in (cell.segments_json or [])
        ]

    max_hours = float(scheduling_fields.get("max_hours_per_day", 8))
    max_consecutive_days = int(scheduling_fields.get("max_consecutive_days", 6))

    errors: list[ScheduleValidationIssue] = []
    warnings: list[ScheduleValidationIssue] = []
    date_list = _date_list(request.date_from, request.date_to)

    for employee in scoped_employees:
        per_date = cells_by_employee.get(employee.employee_id, {})
        has_work = any(
            any(segment.activity_type == WORK_ACTIVITY_TYPE for segment in segments)
            for segments in per_date.values()
        )
        if not has_work:
            errors.append(
                ScheduleValidationIssue(
                    employee_id=employee.employee_id,
                    schedule_date=request.date_from,
                    segment_index=None,
                    rule_code="SHIFT_MISSING",
                    message=f"员工 {employee.employee_id} 在日期范围内没有任何班次",
                )
            )
            continue

        work_dates: list[str] = []
        for schedule_date in date_list:
            segments = per_date.get(schedule_date)
            if not segments:
                continue
            if any(
                segment.activity_type == WORK_ACTIVITY_TYPE for segment in segments
            ):
                work_dates.append(schedule_date)
            if schedule_date in (employee.unavailable_dates or []):
                errors.append(
                    ScheduleValidationIssue(
                        employee_id=employee.employee_id,
                        schedule_date=schedule_date,
                        segment_index=None,
                        rule_code="UNAVAILABLE_DATE",
                        message=f"员工 {employee.employee_id} 在不可排班日期 {schedule_date} 被排班",
                    )
                )

            work_minutes = 0
            absolute_ranges: list[tuple[int, int, int]] = []
            for index, segment in enumerate(segments):
                coverage_segment = to_coverage_segment(segment)
                start = parse_time_to_minutes(segment.start_time)
                duration = segment_duration_minutes(coverage_segment)
                if duration > 24 * 60:
                    errors.append(
                        ScheduleValidationIssue(
                            employee_id=employee.employee_id,
                            schedule_date=schedule_date,
                            segment_index=index,
                            rule_code="SEGMENT_INVALID",
                            message="活动分段时长不能超过 24 小时",
                        )
                    )
                absolute_ranges.append((start, start + duration, index))
                if segment.activity_type == WORK_ACTIVITY_TYPE:
                    work_minutes += duration
                if crosses_midnight(coverage_segment) and not employee.cross_day_allowed:
                    errors.append(
                        ScheduleValidationIssue(
                            employee_id=employee.employee_id,
                            schedule_date=schedule_date,
                            segment_index=index,
                            rule_code="CROSS_DAY_FORBIDDEN",
                            message=f"员工 {employee.employee_id} 不允许跨日班",
                        )
                    )
                is_night = (
                    crosses_midnight(coverage_segment)
                    or start >= NIGHT_SHIFT_START_MINUTES
                )
                if is_night and not employee.night_shift_allowed:
                    errors.append(
                        ScheduleValidationIssue(
                            employee_id=employee.employee_id,
                            schedule_date=schedule_date,
                            segment_index=index,
                            rule_code="NIGHT_SHIFT_FORBIDDEN",
                            message=f"员工 {employee.employee_id} 不允许夜班",
                        )
                    )

            sorted_ranges = sorted(absolute_ranges)
            for position in range(1, len(sorted_ranges)):
                _, previous_end, _ = sorted_ranges[position - 1]
                current_start, _, current_index = sorted_ranges[position]
                if current_start < previous_end:
                    errors.append(
                        ScheduleValidationIssue(
                            employee_id=employee.employee_id,
                            schedule_date=schedule_date,
                            segment_index=current_index,
                            rule_code="SEGMENT_OVERLAP",
                            message=(
                                f"员工 {employee.employee_id} 在 {schedule_date} "
                                f"的第 {current_index} 个分段与前面分段时间重叠"
                            ),
                        )
                    )

            if work_minutes / 60 > max_hours:
                warnings.append(
                    ScheduleValidationIssue(
                        employee_id=employee.employee_id,
                        schedule_date=schedule_date,
                        segment_index=None,
                        rule_code="MAX_HOURS_EXCEEDED",
                        message=(
                            f"员工 {employee.employee_id} 在 {schedule_date} "
                            f"工作 {work_minutes / 60:.1f} 小时，超过上限 {max_hours:g} 小时"
                        ),
                    )
                )

        consecutive = 0
        for position, schedule_date in enumerate(date_list):
            if schedule_date in work_dates:
                consecutive += 1
                if consecutive > max_consecutive_days:
                    warnings.append(
                        ScheduleValidationIssue(
                            employee_id=employee.employee_id,
                            schedule_date=schedule_date,
                            segment_index=None,
                            rule_code="MAX_CONSECUTIVE_DAYS_EXCEEDED",
                            message=(
                                f"员工 {employee.employee_id} 连续工作已达 "
                                f"{consecutive} 天，超过上限 {max_consecutive_days} 天"
                            ),
                        )
                    )
            else:
                consecutive = 0

    return ScheduleValidateResponse(errors=errors, warnings=warnings)


def _employees_in_scope(
    master_repository: MasterDataPersistenceRepository,
    org_scope: str,
):
    employees = [
        employee
        for employee in master_repository.list_employees()
        if employee.status == "active"
    ]
    if org_scope in ("", "*"):
        return employees
    return [
        employee
        for employee in employees
        if employee.organization_id == org_scope
        or employee.workplace_id == org_scope
    ]


def _date_list(date_from: str, date_to: str) -> list[str]:
    current = date.fromisoformat(date_from)
    last = date.fromisoformat(date_to)
    dates: list[str] = []
    while current <= last:
        dates.append(current.isoformat())
        current += timedelta(days=1)
    return dates


def publish_schedule_period(
    repository: SchedulePeriodRepository,
    master_repository: MasterDataPersistenceRepository,
    period_id: str,
    request: SchedulePublishRequest,
) -> SchedulePublishResponse:
    if request.date_to < request.date_from:
        raise ValueError("DATE_RANGE_INVALID: date_to 不能早于 date_from")

    with repository.session_factory.begin() as session:
        period = session.get(SchedulePeriodEntity, period_id)
        if period is None:
            raise ValueError(f"SCHEDULE_PERIOD_NOT_FOUND: {period_id}")
        if request.date_from < period.date_from or request.date_to > period.date_to:
            raise ValueError("DATE_RANGE_OUT_OF_PERIOD: 发布范围超出周期日期范围")

        scoped_ids = {
            employee.employee_id
            for employee in _employees_in_scope(master_repository, request.org_scope)
        }
        cells = list(
            session.scalars(
                select(ScheduleMatrixCellEntity).where(
                    ScheduleMatrixCellEntity.period_id == period_id,
                    ScheduleMatrixCellEntity.schedule_date >= request.date_from,
                    ScheduleMatrixCellEntity.schedule_date <= request.date_to,
                )
            )
        )
        snapshot_cells = [
            cell
            for cell in cells
            if request.org_scope in ("", "*") or cell.employee_id in scoped_ids
        ]

        existing_versions = list(
            session.scalars(
                select(SchedulePeriodVersionEntity).where(
                    SchedulePeriodVersionEntity.period_id == period_id
                )
            )
        )
        sequence = len(existing_versions) + 1
        published_at = _now_iso()
        version_id = f"SPV-{period_id}-V{sequence}"
        publication_id = f"PUB-{period_id}-V{sequence}"

        session.add(
            SchedulePeriodVersionEntity(
                version_id=version_id,
                period_id=period_id,
                publication_id=publication_id,
                org_scope=request.org_scope,
                date_from=request.date_from,
                date_to=request.date_to,
                note=request.note,
                published_at=published_at,
                cell_count=len(snapshot_cells),
            )
        )
        session.add(
            SchedulePublicationEntity(
                publication_id=publication_id,
                period_id=period_id,
                version_id=version_id,
                org_scope=request.org_scope,
                date_from=request.date_from,
                date_to=request.date_to,
                note=request.note,
                published_at=published_at,
            )
        )
        session.flush()

        for cell in snapshot_cells:
            session.add(
                ScheduleVersionCellEntity(
                    version_id=version_id,
                    employee_id=cell.employee_id,
                    schedule_date=cell.schedule_date,
                    segments_json=cell.segments_json,
                    locked=bool(cell.locked),
                )
            )

        # 发布时保存技能系数快照（CORN WFM V2.0 11.1 / 13.3）
        for employee_id, skill_id, coefficient, source in _skill_coefficient_snapshot(
            snapshot_cells
        ):
            session.add(
                ScheduleSkillCoefficientSnapshotEntity(
                    publication_id=publication_id,
                    employee_id=employee_id,
                    skill_id=skill_id,
                    coefficient=coefficient,
                    default_source=source,
                )
            )

        period.status = "published"
        period.updated_at = published_at

    return SchedulePublishResponse(
        publication_id=publication_id,
        version_id=version_id,
        published_at=published_at,
    )


def _skill_coefficient_snapshot(
    cells: list[ScheduleMatrixCellEntity],
) -> list[tuple[str, str, float, str]]:
    collected: dict[tuple[str, str], tuple[float, str]] = {}
    for cell in cells:
        for row in cell.segments_json or []:
            segment = _segment_model(row)
            if segment.activity_type != WORK_ACTIVITY_TYPE or segment.skill_id is None:
                continue
            key = (cell.employee_id, segment.skill_id)
            if segment.skill_coefficient is not None:
                collected[key] = (
                    segment.skill_coefficient,
                    SKILL_COEFFICIENT_SEGMENT_SOURCE,
                )
            else:
                collected.setdefault(
                    key, (DEFAULT_SKILL_COEFFICIENT, SKILL_COEFFICIENT_DEFAULT_SOURCE)
                )
    return [
        (employee_id, skill_id, coefficient, source)
        for (employee_id, skill_id), (coefficient, source) in sorted(collected.items())
    ]


def list_period_versions(
    repository: SchedulePeriodRepository,
    period_id: str,
) -> SchedulePeriodVersionListResponse:
    record = repository.get_period(period_id)
    if record is None:
        raise ValueError(f"SCHEDULE_PERIOD_NOT_FOUND: {period_id}")
    versions = repository.load_versions(period_id)
    return SchedulePeriodVersionListResponse(
        items=[
            SchedulePeriodVersionRecord(
                version_id=version.version_id,
                publication_id=version.publication_id,
                published_at=version.published_at,
                org_scope=version.org_scope,
                date_from=version.date_from,
                date_to=version.date_to,
                note=version.note,
                cell_count=version.cell_count,
            )
            for version in versions
        ]
    )


def get_version_diff(
    repository: SchedulePeriodRepository,
    period_id: str,
    version_id: str,
) -> ScheduleVersionDiffResponse:
    record = repository.get_period(period_id)
    if record is None:
        raise ValueError(f"SCHEDULE_PERIOD_NOT_FOUND: {period_id}")
    versions = repository.load_versions(period_id)
    current = next(
        (version for version in versions if version.version_id == version_id), None
    )
    if current is None:
        raise ValueError(f"SCHEDULE_VERSION_NOT_FOUND: {version_id}")

    previous: SchedulePeriodVersionEntity | None = None
    for position, version in enumerate(versions):
        if version.version_id == version_id and position > 0:
            previous = versions[position - 1]

    after_cells = {
        (cell.employee_id, cell.schedule_date): cell
        for cell in repository.load_version_cells(version_id)
    }
    before_cells = (
        {
            (cell.employee_id, cell.schedule_date): cell
            for cell in repository.load_version_cells(previous.version_id)
        }
        if previous is not None
        else {}
    )

    changed: list[ScheduleVersionCellDiff] = []
    for key in sorted(set(after_cells) | set(before_cells)):
        before = before_cells.get(key)
        after = after_cells.get(key)
        before_segments = (
            [_segment_model(row) for row in (before.segments_json or [])]
            if before is not None
            else None
        )
        after_segments = (
            [_segment_model(row) for row in (after.segments_json or [])]
            if after is not None
            else None
        )
        if before_segments == after_segments:
            continue
        changed.append(
            ScheduleVersionCellDiff(
                employee_id=key[0],
                schedule_date=key[1],
                before=before_segments,
                after=after_segments,
            )
        )

    return ScheduleVersionDiffResponse(
        version_id=version_id,
        compared_from_version_id=(
            previous.version_id if previous is not None else None
        ),
        changed_cells=changed,
    )


def get_skill_snapshot_records(
    repository: SchedulePeriodRepository,
    publication_id: str,
) -> list[SkillCoefficientSnapshotRecord]:
    return [
        SkillCoefficientSnapshotRecord(
            employee_id=entity.employee_id,
            skill_id=entity.skill_id,
            coefficient=entity.coefficient,
            default_source=entity.default_source,
        )
        for entity in repository.load_skill_snapshots(publication_id)
    ]
