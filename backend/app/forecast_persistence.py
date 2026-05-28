from datetime import datetime, timedelta

from sqlalchemy import ForeignKey, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.import_persistence import Base, ImportVersionEntity, build_engine
from backend.app.master_data_persistence import ProjectEntity, SkillEntity, WorkplaceEntity
from backend.app.models import (
    ForecastIntervalInput,
    ForecastIntervalRecord,
    ForecastVersionChangeRecord,
    ForecastVersionDetail,
    ForecastVersionRecord,
    ForecastVersionRequest,
)


class ForecastVersionEntity(Base):
    __tablename__ = "forecast_versions"

    forecast_version_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    import_version_id: Mapped[str] = mapped_column(
        ForeignKey("import_versions.version_id"),
        nullable=False,
    )
    business_date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    business_date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    total_intervals: Mapped[int] = mapped_column(nullable=False)
    total_required_agents: Mapped[int] = mapped_column(nullable=False)


class ForecastIntervalEntity(Base):
    __tablename__ = "forecast_intervals"

    forecast_interval_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    forecast_version_id: Mapped[str] = mapped_column(
        ForeignKey("forecast_versions.forecast_version_id"),
        nullable=False,
        index=True,
    )
    forecast_date: Mapped[str] = mapped_column(String(20), nullable=False)
    interval_start: Mapped[str] = mapped_column(String(5), nullable=False)
    interval_end: Mapped[str] = mapped_column(String(5), nullable=False)
    workplace_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_workplaces.workplace_id"),
        nullable=False,
        index=True,
    )
    project_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_projects.project_id"),
        nullable=False,
        index=True,
    )
    skill_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_skills.skill_id"),
        nullable=False,
        index=True,
    )
    demand_level: Mapped[str] = mapped_column(String(40), nullable=False)
    required_agents: Mapped[int] = mapped_column(nullable=False)


class ForecastVersionChangeEntity(Base):
    __tablename__ = "forecast_version_changes"

    change_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    forecast_version_id: Mapped[str] = mapped_column(
        ForeignKey("forecast_versions.forecast_version_id"),
        nullable=False,
        index=True,
    )
    compared_from_version_id: Mapped[str | None] = mapped_column(String(120))
    change_reason: Mapped[str | None] = mapped_column(String(500))


class ForecastPersistenceRepository:
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

    def create_forecast_version(self, request: ForecastVersionRequest) -> None:
        with self.session_factory.begin() as session:
            self._validate_import_version(session, request.import_version_id)
            for interval in request.intervals:
                _validate_forecast_interval(interval.interval_start, interval.interval_end)
                self._validate_interval_references(session, request, interval)

            session.merge(
                ForecastVersionEntity(
                    forecast_version_id=request.forecast_version_id,
                    import_version_id=request.import_version_id,
                    business_date_from=request.business_date_from,
                    business_date_to=request.business_date_to,
                    total_intervals=len(request.intervals),
                    total_required_agents=sum(
                        interval.required_agents for interval in request.intervals
                    ),
                )
            )
            session.flush()
            for interval in request.intervals:
                session.merge(_interval_entity(interval, request.forecast_version_id))
            if request.compared_from_version_id or request.change_reason:
                session.add(
                    ForecastVersionChangeEntity(
                        forecast_version_id=request.forecast_version_id,
                        compared_from_version_id=request.compared_from_version_id,
                        change_reason=request.change_reason,
                    )
                )

    def get_forecast_version(
        self,
        forecast_version_id: str,
    ) -> ForecastVersionDetail | None:
        with self.session_factory() as session:
            version = session.get(ForecastVersionEntity, forecast_version_id)
            if version is None:
                return None
            intervals = list(
                session.scalars(
                    select(ForecastIntervalEntity)
                    .where(ForecastIntervalEntity.forecast_version_id == forecast_version_id)
                    .order_by(
                        ForecastIntervalEntity.forecast_date,
                        ForecastIntervalEntity.interval_start,
                        ForecastIntervalEntity.workplace_id,
                        ForecastIntervalEntity.project_id,
                        ForecastIntervalEntity.skill_id,
                    )
                )
            )
            changes = list(
                session.scalars(
                    select(ForecastVersionChangeEntity)
                    .where(
                        ForecastVersionChangeEntity.forecast_version_id
                        == forecast_version_id
                    )
                    .order_by(ForecastVersionChangeEntity.change_id)
                )
            )
        return ForecastVersionDetail(
            version=ForecastVersionRecord(
                forecast_version_id=version.forecast_version_id,
                import_version_id=version.import_version_id,
                business_date_from=version.business_date_from,
                business_date_to=version.business_date_to,
                total_intervals=version.total_intervals,
                total_required_agents=version.total_required_agents,
            ),
            intervals=[_interval_record(interval) for interval in intervals],
            changes=[_change_record(change) for change in changes],
        )

    def _validate_import_version(self, session: Session, import_version_id: str) -> None:
        version = session.get(ImportVersionEntity, import_version_id)
        if version is None:
            raise ValueError(f"import_version_id {import_version_id} does not exist")
        if version.version_type != "demand_forecast":
            raise ValueError(f"import_version_id {import_version_id} is not demand_forecast")

    def _validate_interval_references(
        self,
        session: Session,
        request: ForecastVersionRequest,
        interval: ForecastIntervalInput,
    ) -> None:
        if (
            interval.forecast_date < request.business_date_from
            or interval.forecast_date > request.business_date_to
        ):
            raise ValueError("forecast_date is outside forecast version business dates")
        checks = [
            ("workplace_id", interval.workplace_id, WorkplaceEntity),
            ("project_id", interval.project_id, ProjectEntity),
            ("skill_id", interval.skill_id, SkillEntity),
        ]
        for field_name, reference_id, entity_class in checks:
            entity = session.get(entity_class, reference_id)
            if entity is None:
                raise ValueError(f"{field_name} {reference_id} does not exist")
            if entity.status == "frozen":
                raise ValueError(f"{field_name} {reference_id} is frozen")
            if entity.status != "active":
                raise ValueError(f"{field_name} {reference_id} is not active")
            if (
                interval.forecast_date < entity.effective_from
                or interval.forecast_date > entity.effective_to
            ):
                raise ValueError(f"{field_name} {reference_id} is outside effective dates")


def _interval_entity(
    interval: ForecastIntervalInput,
    forecast_version_id: str,
) -> ForecastIntervalEntity:
    return ForecastIntervalEntity(
        forecast_interval_id=interval.forecast_interval_id,
        forecast_version_id=forecast_version_id,
        forecast_date=interval.forecast_date,
        interval_start=interval.interval_start,
        interval_end=interval.interval_end,
        workplace_id=interval.workplace_id,
        project_id=interval.project_id,
        skill_id=interval.skill_id,
        demand_level=interval.demand_level,
        required_agents=interval.required_agents,
    )


def _interval_record(entity: ForecastIntervalEntity) -> ForecastIntervalRecord:
    return ForecastIntervalRecord(
        forecast_interval_id=entity.forecast_interval_id,
        forecast_version_id=entity.forecast_version_id,
        forecast_date=entity.forecast_date,
        interval_start=entity.interval_start,
        interval_end=entity.interval_end,
        workplace_id=entity.workplace_id,
        project_id=entity.project_id,
        skill_id=entity.skill_id,
        demand_level=entity.demand_level,
        required_agents=entity.required_agents,
    )


def _change_record(entity: ForecastVersionChangeEntity) -> ForecastVersionChangeRecord:
    return ForecastVersionChangeRecord(
        change_id=entity.change_id,
        forecast_version_id=entity.forecast_version_id,
        compared_from_version_id=entity.compared_from_version_id,
        change_reason=entity.change_reason,
    )


def _validate_forecast_interval(start_time: str, end_time: str) -> None:
    start = _parse_time(start_time)
    end = _parse_time(end_time)
    if end - start != timedelta(minutes=30):
        raise ValueError("forecast interval must be exactly 30 minutes")


def _parse_time(value: str) -> datetime:
    return datetime.strptime(value, "%H:%M")
