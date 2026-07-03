from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Boolean, ForeignKey, Index, String, UniqueConstraint, select, text
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker
from sqlalchemy.types import JSON

from backend.app.import_persistence import Base, build_engine
from backend.app.roster_drafts import (
    AssignmentKind,
    RosterAssignment,
    RosterEditLock,
    RosterVersion,
    RosterVersionAction,
    RosterVersionEvent,
    RosterVersionStatus,
)


@dataclass(frozen=True)
class RosterPublishedSnapshotRecord:
    roster_version_id: str
    shift_counts: dict[str, int]
    arranged_coverage: list[dict[str, Any]]
    hard_errors: list[dict[str, Any]]
    soft_risks: list[dict[str, Any]]
    diff_summary: dict[str, Any]
    created_at: str


@dataclass(frozen=True)
class RosterCellChangeLogRecord:
    change_id: int
    roster_version_id: str
    roster_cell_id: str | None
    actor_id: str
    occurred_at: str
    change_type: str
    before_data: dict[str, Any] | None
    after_data: dict[str, Any] | None


@dataclass(frozen=True)
class RosterVersionDetail:
    version: RosterVersion
    cells: list[RosterAssignment]
    events: list[RosterVersionEvent]
    change_logs: list[RosterCellChangeLogRecord]
    published_snapshot: RosterPublishedSnapshotRecord | None = None
    edit_lock: RosterEditLock | None = None


class RosterVersionEntity(Base):
    __tablename__ = "roster_versions"
    __table_args__ = (
        Index(
            "uq_roster_versions_active_draft_scope_month",
            "business_month",
            "project_id",
            "workplace_id",
            "team_id",
            unique=True,
            sqlite_where=text("status = 'draft'"),
        ),
        Index(
            "uq_roster_versions_current_published_scope_month",
            "business_month",
            "project_id",
            "workplace_id",
            "team_id",
            unique=True,
            sqlite_where=text("status = 'published'"),
        ),
        Index(
            "uq_roster_versions_scheduled_published_scope_month",
            "business_month",
            "project_id",
            "workplace_id",
            "team_id",
            unique=True,
            sqlite_where=text("status = 'scheduled_published'"),
        ),
    )

    roster_version_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    business_month: Mapped[str] = mapped_column(String(7), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    version_type: Mapped[str] = mapped_column(String(40), nullable=False)
    project_id: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    workplace_id: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    team_id: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    effective_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    parent_version_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    supersedes_version_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    activated_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    activation_failed_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(40), nullable=False)


class RosterCellEntity(Base):
    __tablename__ = "roster_cells"
    __table_args__ = (
        UniqueConstraint(
            "roster_version_id",
            "employee_id",
            "business_date",
            "sequence",
            name="uq_roster_cells_version_employee_date_sequence",
        ),
    )

    roster_cell_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    roster_version_id: Mapped[str] = mapped_column(
        ForeignKey("roster_versions.roster_version_id"),
        nullable=False,
        index=True,
    )
    assignment_id: Mapped[str] = mapped_column(String(160), nullable=False)
    employee_id: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    business_date: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    sequence: Mapped[int] = mapped_column(nullable=False)
    assignment_kind: Mapped[str] = mapped_column(String(40), nullable=False)
    project_id: Mapped[str] = mapped_column(String(120), nullable=False)
    workplace_id: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    team_id: Mapped[str] = mapped_column(String(120), nullable=False)
    shift_code: Mapped[str | None] = mapped_column(String(80), nullable=True)
    annotation_code: Mapped[str | None] = mapped_column(String(120), nullable=True)
    interval_start_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    interval_end_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    source_cell_id: Mapped[str | None] = mapped_column(String(160), nullable=True)
    manually_adjusted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class RosterVersionEventEntity(Base):
    __tablename__ = "roster_version_events"

    event_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    roster_version_id: Mapped[str] = mapped_column(
        ForeignKey("roster_versions.roster_version_id"),
        nullable=False,
        index=True,
    )
    action: Mapped[str] = mapped_column(String(80), nullable=False)
    actor_id: Mapped[str] = mapped_column(String(120), nullable=False)
    occurred_at: Mapped[str] = mapped_column(String(40), nullable=False)
    note: Mapped[str | None] = mapped_column(String(1000), nullable=True)


class RosterCellChangeLogEntity(Base):
    __tablename__ = "roster_cell_change_logs"

    change_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    roster_version_id: Mapped[str] = mapped_column(
        ForeignKey("roster_versions.roster_version_id"),
        nullable=False,
        index=True,
    )
    roster_cell_id: Mapped[str | None] = mapped_column(String(160), nullable=True)
    actor_id: Mapped[str] = mapped_column(String(120), nullable=False)
    occurred_at: Mapped[str] = mapped_column(String(40), nullable=False)
    change_type: Mapped[str] = mapped_column(String(80), nullable=False)
    before_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    after_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)


class RosterPublishedSnapshotEntity(Base):
    __tablename__ = "roster_published_snapshots"

    roster_version_id: Mapped[str] = mapped_column(
        ForeignKey("roster_versions.roster_version_id"),
        primary_key=True,
    )
    shift_counts: Mapped[dict[str, int]] = mapped_column(JSON, nullable=False)
    arranged_coverage: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False)
    hard_errors: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False)
    soft_risks: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False)
    diff_summary: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)


class RosterEditLockEntity(Base):
    __tablename__ = "roster_edit_locks"

    roster_version_id: Mapped[str] = mapped_column(
        ForeignKey("roster_versions.roster_version_id"),
        primary_key=True,
    )
    actor_id: Mapped[str] = mapped_column(String(120), nullable=False)
    acquired_at: Mapped[str] = mapped_column(String(40), nullable=False)
    expires_at: Mapped[str] = mapped_column(String(40), nullable=False)


class RosterPersistenceRepository:
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

    def save_draft(
        self,
        version: RosterVersion,
        cells: list[RosterAssignment],
        *,
        actor_id: str,
        occurred_at: str,
    ) -> RosterVersionDetail:
        if version.status != RosterVersionStatus.DRAFT:
            raise ValueError("save_draft only accepts draft roster versions")
        with self.session_factory.begin() as session:
            self._assert_unique_active_version(session, version)
            session.merge(_version_entity(version, occurred_at))
            existing_cells = {
                cell.roster_cell_id: cell
                for cell in session.scalars(
                    select(RosterCellEntity).where(
                        RosterCellEntity.roster_version_id == version.roster_version_id
                    )
                )
            }
            incoming_cell_ids = {_cell_id(cell) for cell in cells}
            for removed in sorted(set(existing_cells) - incoming_cell_ids):
                session.delete(existing_cells[removed])
                session.add(
                    _change_log_entity(
                        version.roster_version_id,
                        removed,
                        actor_id,
                        occurred_at,
                        "delete_cell",
                        _cell_json(existing_cells[removed]),
                        None,
                    )
                )
            session.flush()
            for cell in cells:
                cell_id = _cell_id(cell)
                before = existing_cells.get(cell_id)
                session.merge(_cell_entity(cell, version.roster_version_id))
                session.add(
                    _change_log_entity(
                        version.roster_version_id,
                        cell_id,
                        actor_id,
                        occurred_at,
                        "save_cell" if before is None else "update_cell",
                        _cell_json(before) if before is not None else None,
                        _assignment_json(cell),
                    )
                )
        stored = self.get_version(version.roster_version_id)
        if stored is None:
            raise RuntimeError("saved roster draft could not be read back")
        return stored

    def upsert_version(self, version: RosterVersion, occurred_at: str) -> None:
        with self.session_factory.begin() as session:
            self._assert_unique_active_version(session, version)
            session.merge(_version_entity(version, occurred_at))

    def update_version_status(
        self,
        version: RosterVersion,
        *,
        actor_id: str,
        occurred_at: str,
        action: RosterVersionAction,
        note: str | None = None,
    ) -> RosterVersion:
        with self.session_factory.begin() as session:
            self._assert_unique_active_version(session, version)
            session.merge(_version_entity(version, occurred_at))
            session.add(
                _event_entity(
                    RosterVersionEvent(
                        roster_version_id=version.roster_version_id,
                        action=action,
                        actor_id=actor_id,
                        occurred_at=occurred_at,
                        note=note,
                    )
                )
            )
        return version

    def append_event(self, event: RosterVersionEvent) -> None:
        with self.session_factory.begin() as session:
            if session.get(RosterVersionEntity, event.roster_version_id) is None:
                raise ValueError(f"roster version does not exist: {event.roster_version_id}")
            session.add(_event_entity(event))

    def save_published_snapshot(
        self,
        *,
        roster_version_id: str,
        shift_counts: dict[str, int],
        arranged_coverage: list[dict[str, Any]],
        hard_errors: list[dict[str, Any]],
        soft_risks: list[dict[str, Any]],
        diff_summary: dict[str, Any],
        created_at: str | None = None,
    ) -> RosterPublishedSnapshotRecord:
        created = created_at or _now_iso()
        with self.session_factory.begin() as session:
            if session.get(RosterVersionEntity, roster_version_id) is None:
                raise ValueError(f"roster version does not exist: {roster_version_id}")
            session.merge(
                RosterPublishedSnapshotEntity(
                    roster_version_id=roster_version_id,
                    shift_counts=shift_counts,
                    arranged_coverage=arranged_coverage,
                    hard_errors=hard_errors,
                    soft_risks=soft_risks,
                    diff_summary=diff_summary,
                    created_at=created,
                )
            )
        snapshot = self._get_snapshot(roster_version_id)
        if snapshot is None:
            raise RuntimeError("published snapshot could not be read back")
        return snapshot

    def save_edit_lock(self, lock: RosterEditLock | None) -> None:
        with self.session_factory.begin() as session:
            if lock is None:
                return
            session.merge(
                RosterEditLockEntity(
                    roster_version_id=lock.roster_version_id,
                    actor_id=lock.actor_id,
                    acquired_at=lock.acquired_at,
                    expires_at=lock.expires_at,
                )
            )

    def clear_edit_lock(self, roster_version_id: str) -> None:
        with self.session_factory.begin() as session:
            entity = session.get(RosterEditLockEntity, roster_version_id)
            if entity is not None:
                session.delete(entity)

    def get_edit_lock(self, roster_version_id: str) -> RosterEditLock | None:
        with self.session_factory() as session:
            entity = session.get(RosterEditLockEntity, roster_version_id)
            return _edit_lock_record(entity) if entity is not None else None

    def get_version(self, roster_version_id: str) -> RosterVersionDetail | None:
        with self.session_factory() as session:
            version = session.get(RosterVersionEntity, roster_version_id)
            if version is None:
                return None
            cells = list(
                session.scalars(
                    select(RosterCellEntity)
                    .where(RosterCellEntity.roster_version_id == roster_version_id)
                    .order_by(
                        RosterCellEntity.business_date,
                        RosterCellEntity.employee_id,
                        RosterCellEntity.sequence,
                    )
                )
            )
            events = list(
                session.scalars(
                    select(RosterVersionEventEntity)
                    .where(RosterVersionEventEntity.roster_version_id == roster_version_id)
                    .order_by(RosterVersionEventEntity.event_id)
                )
            )
            change_logs = list(
                session.scalars(
                    select(RosterCellChangeLogEntity)
                    .where(
                        RosterCellChangeLogEntity.roster_version_id == roster_version_id
                    )
                    .order_by(RosterCellChangeLogEntity.change_id)
                )
            )
            snapshot = session.get(RosterPublishedSnapshotEntity, roster_version_id)
            edit_lock = session.get(RosterEditLockEntity, roster_version_id)
        return RosterVersionDetail(
            version=_version_record(version),
            cells=[_cell_record(cell) for cell in cells],
            events=[_event_record(event) for event in events],
            change_logs=[_change_log_record(row) for row in change_logs],
            published_snapshot=(
                _snapshot_record(snapshot) if snapshot is not None else None
            ),
            edit_lock=_edit_lock_record(edit_lock) if edit_lock is not None else None,
        )

    def get_active_draft(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
    ) -> RosterVersionDetail | None:
        return self._get_one_by_scope(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            status=RosterVersionStatus.DRAFT,
        )

    def get_current_published(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
    ) -> RosterVersionDetail | None:
        return self._get_one_by_scope(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            status=RosterVersionStatus.PUBLISHED,
        )

    def get_upcoming_published(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
    ) -> RosterVersionDetail | None:
        return self._get_one_by_scope(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            status=RosterVersionStatus.SCHEDULED_PUBLISHED,
        )

    def list_due_scheduled(self, now: str) -> list[RosterVersionDetail]:
        with self.session_factory() as session:
            version_ids = list(
                session.scalars(
                    select(RosterVersionEntity.roster_version_id)
                    .where(
                        RosterVersionEntity.status
                        == RosterVersionStatus.SCHEDULED_PUBLISHED.value,
                        RosterVersionEntity.effective_at <= now,
                    )
                    .order_by(RosterVersionEntity.effective_at, RosterVersionEntity.roster_version_id)
                )
            )
        return [
            detail
            for version_id in version_ids
            if (detail := self.get_version(version_id)) is not None
        ]

    def _get_one_by_scope(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
        status: RosterVersionStatus,
    ) -> RosterVersionDetail | None:
        with self.session_factory() as session:
            version_id = session.scalar(
                select(RosterVersionEntity.roster_version_id)
                .where(
                    RosterVersionEntity.business_month == business_month,
                    RosterVersionEntity.project_id == _scope_value(project_id),
                    RosterVersionEntity.workplace_id == _scope_value(workplace_id),
                    RosterVersionEntity.team_id == _scope_value(team_id),
                    RosterVersionEntity.status == status.value,
                )
                .order_by(RosterVersionEntity.roster_version_id)
            )
        if version_id is None:
            return None
        return self.get_version(version_id)

    def _assert_unique_active_version(
        self,
        session: Session,
        version: RosterVersion,
    ) -> None:
        labels = {
            RosterVersionStatus.DRAFT: "active draft already exists",
            RosterVersionStatus.PUBLISHED: "current published already exists",
            RosterVersionStatus.SCHEDULED_PUBLISHED: "scheduled published already exists",
        }
        label = labels.get(version.status)
        if label is None:
            return
        existing_id = session.scalar(
            select(RosterVersionEntity.roster_version_id).where(
                RosterVersionEntity.business_month == version.business_month,
                RosterVersionEntity.project_id == _scope_value(version.project_id),
                RosterVersionEntity.workplace_id == _scope_value(version.workplace_id),
                RosterVersionEntity.team_id == _scope_value(version.team_id),
                RosterVersionEntity.status == version.status.value,
                RosterVersionEntity.roster_version_id != version.roster_version_id,
            )
        )
        if existing_id is not None:
            raise ValueError(f"{label}: {existing_id}")

    def _get_snapshot(self, roster_version_id: str) -> RosterPublishedSnapshotRecord | None:
        with self.session_factory() as session:
            snapshot = session.get(RosterPublishedSnapshotEntity, roster_version_id)
            return _snapshot_record(snapshot) if snapshot is not None else None


def _version_entity(version: RosterVersion, occurred_at: str) -> RosterVersionEntity:
    return RosterVersionEntity(
        roster_version_id=version.roster_version_id,
        business_month=version.business_month,
        status=version.status.value,
        version_type=version.version_type,
        project_id=_scope_value(version.project_id),
        workplace_id=_scope_value(version.workplace_id),
        team_id=_scope_value(version.team_id),
        effective_at=version.effective_at,
        parent_version_id=version.parent_version_id,
        supersedes_version_id=version.supersedes_version_id,
        activated_at=version.activated_at,
        activation_failed_reason=version.activation_failed_reason,
        created_at=occurred_at,
        updated_at=occurred_at,
    )


def _cell_entity(
    assignment: RosterAssignment,
    roster_version_id: str,
) -> RosterCellEntity:
    return RosterCellEntity(
        roster_cell_id=_cell_id(assignment),
        roster_version_id=roster_version_id,
        assignment_id=assignment.assignment_id,
        employee_id=assignment.employee_id,
        business_date=assignment.business_date,
        sequence=assignment.sequence,
        assignment_kind=assignment.assignment_kind.value,
        project_id=assignment.project_id,
        workplace_id=_scope_value(assignment.workplace_id),
        team_id=assignment.team_id,
        shift_code=assignment.shift_code,
        annotation_code=assignment.annotation_code,
        interval_start_at=assignment.interval_start_at,
        interval_end_at=assignment.interval_end_at,
        source_cell_id=assignment.source_cell_id,
        manually_adjusted=assignment.manually_adjusted,
    )


def _event_entity(event: RosterVersionEvent) -> RosterVersionEventEntity:
    return RosterVersionEventEntity(
        roster_version_id=event.roster_version_id,
        action=event.action.value,
        actor_id=event.actor_id,
        occurred_at=event.occurred_at,
        note=event.note,
    )


def _change_log_entity(
    roster_version_id: str,
    roster_cell_id: str | None,
    actor_id: str,
    occurred_at: str,
    change_type: str,
    before_data: dict[str, Any] | None,
    after_data: dict[str, Any] | None,
) -> RosterCellChangeLogEntity:
    return RosterCellChangeLogEntity(
        roster_version_id=roster_version_id,
        roster_cell_id=roster_cell_id,
        actor_id=actor_id,
        occurred_at=occurred_at,
        change_type=change_type,
        before_data=before_data,
        after_data=after_data,
    )


def _version_record(entity: RosterVersionEntity) -> RosterVersion:
    return RosterVersion(
        roster_version_id=entity.roster_version_id,
        business_month=entity.business_month,
        status=RosterVersionStatus(entity.status),
        version_type=entity.version_type,
        project_id=_empty_to_none(entity.project_id),
        workplace_id=_empty_to_none(entity.workplace_id),
        team_id=_empty_to_none(entity.team_id),
        effective_at=entity.effective_at,
        parent_version_id=entity.parent_version_id,
        supersedes_version_id=entity.supersedes_version_id,
        activated_at=entity.activated_at,
        activation_failed_reason=entity.activation_failed_reason,
    )


def _cell_record(entity: RosterCellEntity) -> RosterAssignment:
    return RosterAssignment(
        assignment_id=entity.assignment_id,
        roster_cell_id=entity.roster_cell_id,
        employee_id=entity.employee_id,
        business_date=entity.business_date,
        sequence=entity.sequence,
        assignment_kind=AssignmentKind(entity.assignment_kind),
        project_id=entity.project_id,
        workplace_id=_empty_to_none(entity.workplace_id),
        team_id=entity.team_id,
        shift_code=entity.shift_code,
        annotation_code=entity.annotation_code,
        interval_start_at=entity.interval_start_at,
        interval_end_at=entity.interval_end_at,
        source_cell_id=entity.source_cell_id,
        manually_adjusted=entity.manually_adjusted,
    )


def _event_record(entity: RosterVersionEventEntity) -> RosterVersionEvent:
    return RosterVersionEvent(
        roster_version_id=entity.roster_version_id,
        action=RosterVersionAction(entity.action),
        actor_id=entity.actor_id,
        occurred_at=entity.occurred_at,
        note=entity.note,
    )


def _change_log_record(entity: RosterCellChangeLogEntity) -> RosterCellChangeLogRecord:
    return RosterCellChangeLogRecord(
        change_id=entity.change_id,
        roster_version_id=entity.roster_version_id,
        roster_cell_id=entity.roster_cell_id,
        actor_id=entity.actor_id,
        occurred_at=entity.occurred_at,
        change_type=entity.change_type,
        before_data=entity.before_data,
        after_data=entity.after_data,
    )


def _snapshot_record(
    entity: RosterPublishedSnapshotEntity,
) -> RosterPublishedSnapshotRecord:
    return RosterPublishedSnapshotRecord(
        roster_version_id=entity.roster_version_id,
        shift_counts=entity.shift_counts,
        arranged_coverage=entity.arranged_coverage,
        hard_errors=entity.hard_errors,
        soft_risks=entity.soft_risks,
        diff_summary=entity.diff_summary,
        created_at=entity.created_at,
    )


def _edit_lock_record(entity: RosterEditLockEntity) -> RosterEditLock:
    return RosterEditLock(
        roster_version_id=entity.roster_version_id,
        actor_id=entity.actor_id,
        acquired_at=entity.acquired_at,
        expires_at=entity.expires_at,
    )


def _cell_json(entity: RosterCellEntity) -> dict[str, Any]:
    return _assignment_json(_cell_record(entity))


def _assignment_json(assignment: RosterAssignment) -> dict[str, Any]:
    return {
        "assignment_id": assignment.assignment_id,
        "roster_cell_id": _cell_id(assignment),
        "employee_id": assignment.employee_id,
        "business_date": assignment.business_date,
        "sequence": assignment.sequence,
        "assignment_kind": assignment.assignment_kind.value,
        "project_id": assignment.project_id,
        "workplace_id": assignment.workplace_id,
        "team_id": assignment.team_id,
        "shift_code": assignment.shift_code,
        "annotation_code": assignment.annotation_code,
        "interval_start_at": assignment.interval_start_at,
        "interval_end_at": assignment.interval_end_at,
        "source_cell_id": assignment.source_cell_id,
        "manually_adjusted": assignment.manually_adjusted,
    }


def _cell_id(assignment: RosterAssignment) -> str:
    return assignment.roster_cell_id or assignment.assignment_id


def _scope_value(value: str | None) -> str:
    return value or ""


def _empty_to_none(value: str) -> str | None:
    return value or None


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
