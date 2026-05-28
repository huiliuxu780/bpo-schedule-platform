from datetime import datetime, timezone

from sqlalchemy import ForeignKey, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.actual_log_persistence import ActualStatusIntervalEntity
from backend.app.forecast_persistence import ForecastIntervalEntity, ForecastVersionEntity
from backend.app.import_persistence import Base, ImportVersionEntity, build_engine
from backend.app.models import (
    ComparisonRunDetail,
    ComparisonRunRecord,
    ComparisonRunRequest,
    ComparisonRunStatus,
    ComparisonType,
    ForecastScheduleComparisonResultInput,
    ForecastScheduleComparisonResultRecord,
    ScheduleActualComparisonResultInput,
    ScheduleActualComparisonResultRecord,
)
from backend.app.personnel_schedule_persistence import (
    PersonnelScheduleDetailEntity,
    PersonnelScheduleVersionEntity,
)


class ComparisonRunEntity(Base):
    __tablename__ = "comparison_runs"

    run_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    comparison_type: Mapped[str] = mapped_column(String(40), nullable=False)
    forecast_version_id: Mapped[str | None] = mapped_column(
        ForeignKey("forecast_versions.forecast_version_id"),
        nullable=True,
        index=True,
    )
    schedule_version_id: Mapped[str | None] = mapped_column(
        ForeignKey("personnel_schedule_versions.schedule_version_id"),
        nullable=True,
        index=True,
    )
    actual_import_version_id: Mapped[str | None] = mapped_column(
        ForeignKey("import_versions.version_id"),
        nullable=True,
        index=True,
    )
    business_date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    business_date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False)
    total_results: Mapped[int] = mapped_column(nullable=False)
    total_gap_agents: Mapped[int | None] = mapped_column(nullable=True)
    total_late_minutes: Mapped[int | None] = mapped_column(nullable=True)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)


class ForecastScheduleComparisonResultEntity(Base):
    __tablename__ = "forecast_schedule_comparison_results"

    result_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    run_id: Mapped[str] = mapped_column(
        ForeignKey("comparison_runs.run_id"),
        nullable=False,
        index=True,
    )
    forecast_version_id: Mapped[str] = mapped_column(
        ForeignKey("forecast_versions.forecast_version_id"),
        nullable=False,
        index=True,
    )
    schedule_version_id: Mapped[str] = mapped_column(
        ForeignKey("personnel_schedule_versions.schedule_version_id"),
        nullable=False,
        index=True,
    )
    forecast_interval_id: Mapped[str | None] = mapped_column(
        ForeignKey("forecast_intervals.forecast_interval_id"),
        nullable=True,
        index=True,
    )
    schedule_detail_id: Mapped[str | None] = mapped_column(
        ForeignKey("personnel_schedule_details.schedule_detail_id"),
        nullable=True,
        index=True,
    )
    business_date: Mapped[str] = mapped_column(String(20), nullable=False)
    workplace_id: Mapped[str] = mapped_column(String(80), nullable=False)
    project_id: Mapped[str] = mapped_column(String(80), nullable=False)
    skill_id: Mapped[str] = mapped_column(String(80), nullable=False)
    interval_start: Mapped[str] = mapped_column(String(5), nullable=False)
    interval_end: Mapped[str] = mapped_column(String(5), nullable=False)
    forecast_agents: Mapped[int] = mapped_column(nullable=False)
    scheduled_agents: Mapped[int] = mapped_column(nullable=False)
    gap_agents: Mapped[int] = mapped_column(nullable=False)
    result_status: Mapped[str] = mapped_column(String(40), nullable=False)


class ScheduleActualComparisonResultEntity(Base):
    __tablename__ = "schedule_actual_comparison_results"

    result_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    run_id: Mapped[str] = mapped_column(
        ForeignKey("comparison_runs.run_id"),
        nullable=False,
        index=True,
    )
    schedule_version_id: Mapped[str] = mapped_column(
        ForeignKey("personnel_schedule_versions.schedule_version_id"),
        nullable=False,
        index=True,
    )
    actual_import_version_id: Mapped[str] = mapped_column(
        ForeignKey("import_versions.version_id"),
        nullable=False,
        index=True,
    )
    schedule_detail_id: Mapped[str | None] = mapped_column(
        ForeignKey("personnel_schedule_details.schedule_detail_id"),
        nullable=True,
        index=True,
    )
    actual_status_interval_row_id: Mapped[int | None] = mapped_column(
        ForeignKey("actual_status_intervals.interval_row_id"),
        nullable=True,
        index=True,
    )
    business_date: Mapped[str] = mapped_column(String(20), nullable=False)
    employee_id: Mapped[str] = mapped_column(String(80), nullable=False)
    interval_start: Mapped[str] = mapped_column(String(5), nullable=False)
    interval_end: Mapped[str] = mapped_column(String(5), nullable=False)
    scheduled_minutes: Mapped[int] = mapped_column(nullable=False)
    actual_productive_minutes: Mapped[int] = mapped_column(nullable=False)
    late_minutes: Mapped[int] = mapped_column(nullable=False)
    result_status: Mapped[str] = mapped_column(String(40), nullable=False)


class ComparisonPersistenceRepository:
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

    def create_comparison_run(self, request: ComparisonRunRequest) -> ComparisonRunDetail:
        with self.session_factory.begin() as session:
            if session.get(ComparisonRunEntity, request.run_id) is not None:
                raise ValueError(f"comparison run already exists: {request.run_id}")
            if request.comparison_type == "forecast_vs_schedule":
                self._validate_forecast_schedule_run(session, request)
                run = self._run_entity(request)
                session.add(run)
                session.flush()
                for result in request.forecast_schedule_results:
                    self._validate_forecast_schedule_result(session, request, result)
                    session.add(_forecast_schedule_result_entity(request, result))
            else:
                self._validate_schedule_actual_run(session, request)
                run = self._run_entity(request)
                session.add(run)
                session.flush()
                for result in request.schedule_actual_results:
                    self._validate_schedule_actual_result(session, request, result)
                    session.add(_schedule_actual_result_entity(request, result))

        stored = self.get_comparison_run(request.run_id)
        if stored is None:
            raise RuntimeError("created comparison run could not be read back")
        return stored

    def get_comparison_run(self, run_id: str) -> ComparisonRunDetail | None:
        with self.session_factory() as session:
            run = session.get(ComparisonRunEntity, run_id)
            if run is None:
                return None
            forecast_schedule_results = list(
                session.scalars(
                    select(ForecastScheduleComparisonResultEntity)
                    .where(ForecastScheduleComparisonResultEntity.run_id == run_id)
                    .order_by(ForecastScheduleComparisonResultEntity.result_id)
                )
            )
            schedule_actual_results = list(
                session.scalars(
                    select(ScheduleActualComparisonResultEntity)
                    .where(ScheduleActualComparisonResultEntity.run_id == run_id)
                    .order_by(ScheduleActualComparisonResultEntity.result_id)
                )
            )
        return ComparisonRunDetail(
            run=_run_record(run),
            forecast_schedule_results=[
                _forecast_schedule_result_record(result)
                for result in forecast_schedule_results
            ],
            schedule_actual_results=[
                _schedule_actual_result_record(result)
                for result in schedule_actual_results
            ],
        )

    def list_comparison_runs(
        self,
        comparison_type: ComparisonType | None = None,
        status: ComparisonRunStatus | None = None,
        business_date: str | None = None,
    ) -> list[ComparisonRunRecord]:
        statement = select(ComparisonRunEntity)
        if comparison_type is not None:
            statement = statement.where(
                ComparisonRunEntity.comparison_type == comparison_type
            )
        if status is not None:
            statement = statement.where(ComparisonRunEntity.status == status)
        if business_date is not None:
            statement = statement.where(
                ComparisonRunEntity.business_date_from <= business_date,
                ComparisonRunEntity.business_date_to >= business_date,
            )
        statement = statement.order_by(
            ComparisonRunEntity.business_date_from,
            ComparisonRunEntity.run_id,
        )
        with self.session_factory() as session:
            return [_run_record(row) for row in session.scalars(statement)]

    def _run_entity(self, request: ComparisonRunRequest) -> ComparisonRunEntity:
        return ComparisonRunEntity(
            run_id=request.run_id,
            comparison_type=request.comparison_type,
            forecast_version_id=request.forecast_version_id,
            schedule_version_id=request.schedule_version_id,
            actual_import_version_id=request.actual_import_version_id,
            business_date_from=request.business_date_from,
            business_date_to=request.business_date_to,
            status=request.status,
            total_results=_total_results(request),
            total_gap_agents=_total_gap_agents(request),
            total_late_minutes=_total_late_minutes(request),
            created_at=_now_iso(),
        )

    def _validate_forecast_schedule_run(
        self,
        session: Session,
        request: ComparisonRunRequest,
    ) -> None:
        if request.forecast_version_id is None or request.schedule_version_id is None:
            raise ValueError(
                "forecast_vs_schedule requires forecast_version_id and schedule_version_id"
            )
        if session.get(ForecastVersionEntity, request.forecast_version_id) is None:
            raise ValueError(
                f"forecast_version_id {request.forecast_version_id} does not exist"
            )
        if session.get(PersonnelScheduleVersionEntity, request.schedule_version_id) is None:
            raise ValueError(
                f"schedule_version_id {request.schedule_version_id} does not exist"
            )
        if request.schedule_actual_results:
            raise ValueError("forecast_vs_schedule cannot include schedule_actual_results")

    def _validate_schedule_actual_run(
        self,
        session: Session,
        request: ComparisonRunRequest,
    ) -> None:
        if request.schedule_version_id is None or request.actual_import_version_id is None:
            raise ValueError(
                "schedule_vs_actual requires schedule_version_id and actual_import_version_id"
            )
        if session.get(PersonnelScheduleVersionEntity, request.schedule_version_id) is None:
            raise ValueError(
                f"schedule_version_id {request.schedule_version_id} does not exist"
            )
        actual_version = session.get(ImportVersionEntity, request.actual_import_version_id)
        if actual_version is None:
            raise ValueError(
                f"actual_import_version_id {request.actual_import_version_id} does not exist"
            )
        if actual_version.version_type != "status_log":
            raise ValueError(
                f"actual_import_version_id {request.actual_import_version_id} is not status_log"
            )
        if request.forecast_schedule_results:
            raise ValueError("schedule_vs_actual cannot include forecast_schedule_results")

    def _validate_forecast_schedule_result(
        self,
        session: Session,
        request: ComparisonRunRequest,
        result: ForecastScheduleComparisonResultInput,
    ) -> None:
        _validate_business_date(request, result.business_date)
        if result.forecast_interval_id is not None:
            interval = session.get(ForecastIntervalEntity, result.forecast_interval_id)
            if interval is None:
                raise ValueError(
                    f"forecast_interval_id {result.forecast_interval_id} does not exist"
                )
            if interval.forecast_version_id != request.forecast_version_id:
                raise ValueError(
                    f"forecast_interval_id {result.forecast_interval_id} does not belong to "
                    f"forecast_version_id {request.forecast_version_id}"
                )
            if (
                interval.forecast_date != result.business_date
                or interval.interval_start != result.interval_start
                or interval.interval_end != result.interval_end
                or interval.workplace_id != result.workplace_id
                or interval.project_id != result.project_id
                or interval.skill_id != result.skill_id
            ):
                raise ValueError(
                    f"forecast_interval_id {result.forecast_interval_id} does not match result dimensions"
                )
        if result.schedule_detail_id is not None:
            detail = session.get(PersonnelScheduleDetailEntity, result.schedule_detail_id)
            if detail is None:
                raise ValueError(
                    f"schedule_detail_id {result.schedule_detail_id} does not exist"
                )
            if detail.schedule_version_id != request.schedule_version_id:
                raise ValueError(
                    f"schedule_detail_id {result.schedule_detail_id} does not belong to "
                    f"schedule_version_id {request.schedule_version_id}"
                )
            if (
                detail.schedule_date != result.business_date
                or detail.workplace_id != result.workplace_id
                or detail.project_id != result.project_id
                or detail.skill_id != result.skill_id
                or result.interval_start < detail.start_time
                or result.interval_end > detail.end_time
            ):
                raise ValueError(
                    f"schedule_detail_id {result.schedule_detail_id} does not match result dimensions"
                )

    def _validate_schedule_actual_result(
        self,
        session: Session,
        request: ComparisonRunRequest,
        result: ScheduleActualComparisonResultInput,
    ) -> None:
        _validate_business_date(request, result.business_date)
        if result.schedule_detail_id is not None:
            detail = session.get(PersonnelScheduleDetailEntity, result.schedule_detail_id)
            if detail is None:
                raise ValueError(
                    f"schedule_detail_id {result.schedule_detail_id} does not exist"
                )
            if detail.schedule_version_id != request.schedule_version_id:
                raise ValueError(
                    f"schedule_detail_id {result.schedule_detail_id} does not belong to "
                    f"schedule_version_id {request.schedule_version_id}"
                )
            if (
                detail.schedule_date != result.business_date
                or detail.employee_id != result.employee_id
                or result.interval_start < detail.start_time
                or result.interval_end > detail.end_time
            ):
                raise ValueError(
                    f"schedule_detail_id {result.schedule_detail_id} does not match result dimensions"
                )
        if result.actual_status_interval_row_id is not None:
            interval = session.get(
                ActualStatusIntervalEntity,
                result.actual_status_interval_row_id,
            )
            if interval is None:
                raise ValueError(
                    "actual_status_interval_row_id "
                    f"{result.actual_status_interval_row_id} does not exist"
                )
            if interval.import_version_id != request.actual_import_version_id:
                raise ValueError(
                    "actual_status_interval_row_id "
                    f"{result.actual_status_interval_row_id} does not belong to "
                    f"actual_import_version_id {request.actual_import_version_id}"
                )
            if (
                interval.business_date != result.business_date
                or interval.employee_id != result.employee_id
                or interval.interval_start != result.interval_start
                or interval.interval_end != result.interval_end
            ):
                raise ValueError(
                    "actual_status_interval_row_id "
                    f"{result.actual_status_interval_row_id} does not match result dimensions"
                )


def _forecast_schedule_result_entity(
    request: ComparisonRunRequest,
    result: ForecastScheduleComparisonResultInput,
) -> ForecastScheduleComparisonResultEntity:
    if request.forecast_version_id is None or request.schedule_version_id is None:
        raise ValueError("forecast_vs_schedule source versions are required")
    return ForecastScheduleComparisonResultEntity(
        run_id=request.run_id,
        forecast_version_id=request.forecast_version_id,
        schedule_version_id=request.schedule_version_id,
        forecast_interval_id=result.forecast_interval_id,
        schedule_detail_id=result.schedule_detail_id,
        business_date=result.business_date,
        workplace_id=result.workplace_id,
        project_id=result.project_id,
        skill_id=result.skill_id,
        interval_start=result.interval_start,
        interval_end=result.interval_end,
        forecast_agents=result.forecast_agents,
        scheduled_agents=result.scheduled_agents,
        gap_agents=result.gap_agents,
        result_status=result.result_status,
    )


def _schedule_actual_result_entity(
    request: ComparisonRunRequest,
    result: ScheduleActualComparisonResultInput,
) -> ScheduleActualComparisonResultEntity:
    if request.schedule_version_id is None or request.actual_import_version_id is None:
        raise ValueError("schedule_vs_actual source versions are required")
    return ScheduleActualComparisonResultEntity(
        run_id=request.run_id,
        schedule_version_id=request.schedule_version_id,
        actual_import_version_id=request.actual_import_version_id,
        schedule_detail_id=result.schedule_detail_id,
        actual_status_interval_row_id=result.actual_status_interval_row_id,
        business_date=result.business_date,
        employee_id=result.employee_id,
        interval_start=result.interval_start,
        interval_end=result.interval_end,
        scheduled_minutes=result.scheduled_minutes,
        actual_productive_minutes=result.actual_productive_minutes,
        late_minutes=result.late_minutes,
        result_status=result.result_status,
    )


def _run_record(entity: ComparisonRunEntity) -> ComparisonRunRecord:
    return ComparisonRunRecord(
        run_id=entity.run_id,
        comparison_type=entity.comparison_type,
        forecast_version_id=entity.forecast_version_id,
        schedule_version_id=entity.schedule_version_id,
        actual_import_version_id=entity.actual_import_version_id,
        business_date_from=entity.business_date_from,
        business_date_to=entity.business_date_to,
        status=entity.status,
        total_results=entity.total_results,
        total_gap_agents=entity.total_gap_agents,
        total_late_minutes=entity.total_late_minutes,
        created_at=entity.created_at,
    )


def _forecast_schedule_result_record(
    entity: ForecastScheduleComparisonResultEntity,
) -> ForecastScheduleComparisonResultRecord:
    return ForecastScheduleComparisonResultRecord(
        result_id=entity.result_id,
        run_id=entity.run_id,
        forecast_version_id=entity.forecast_version_id,
        schedule_version_id=entity.schedule_version_id,
        forecast_interval_id=entity.forecast_interval_id,
        schedule_detail_id=entity.schedule_detail_id,
        business_date=entity.business_date,
        workplace_id=entity.workplace_id,
        project_id=entity.project_id,
        skill_id=entity.skill_id,
        interval_start=entity.interval_start,
        interval_end=entity.interval_end,
        forecast_agents=entity.forecast_agents,
        scheduled_agents=entity.scheduled_agents,
        gap_agents=entity.gap_agents,
        result_status=entity.result_status,
    )


def _schedule_actual_result_record(
    entity: ScheduleActualComparisonResultEntity,
) -> ScheduleActualComparisonResultRecord:
    return ScheduleActualComparisonResultRecord(
        result_id=entity.result_id,
        run_id=entity.run_id,
        schedule_version_id=entity.schedule_version_id,
        actual_import_version_id=entity.actual_import_version_id,
        schedule_detail_id=entity.schedule_detail_id,
        actual_status_interval_row_id=entity.actual_status_interval_row_id,
        business_date=entity.business_date,
        employee_id=entity.employee_id,
        interval_start=entity.interval_start,
        interval_end=entity.interval_end,
        scheduled_minutes=entity.scheduled_minutes,
        actual_productive_minutes=entity.actual_productive_minutes,
        late_minutes=entity.late_minutes,
        result_status=entity.result_status,
    )


def _total_results(request: ComparisonRunRequest) -> int:
    if request.total_results is not None:
        return request.total_results
    if request.comparison_type == "forecast_vs_schedule":
        return len(request.forecast_schedule_results)
    return len(request.schedule_actual_results)


def _total_gap_agents(request: ComparisonRunRequest) -> int | None:
    if request.total_gap_agents is not None:
        return request.total_gap_agents
    if request.comparison_type == "forecast_vs_schedule":
        return sum(result.gap_agents for result in request.forecast_schedule_results)
    return None


def _total_late_minutes(request: ComparisonRunRequest) -> int | None:
    if request.total_late_minutes is not None:
        return request.total_late_minutes
    if request.comparison_type == "schedule_vs_actual":
        return sum(result.late_minutes for result in request.schedule_actual_results)
    return None


def _validate_business_date(request: ComparisonRunRequest, business_date: str) -> None:
    if (
        business_date < request.business_date_from
        or business_date > request.business_date_to
    ):
        raise ValueError("result business_date is outside comparison run business dates")


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
