from datetime import datetime, timedelta

from sqlalchemy import ForeignKey, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.import_persistence import Base, ImportVersionEntity, build_engine
from backend.app.master_data_persistence import (
    EmployeeBindingEntity,
    EmployeeEntity,
    ProjectEntity,
    SkillEntity,
    WorkplaceEntity,
)
from backend.app.models import (
    PersonnelScheduleDetailInput,
    PersonnelScheduleDetailRecord,
    PersonnelScheduleIntervalRecord,
    PersonnelScheduleVersionDetail,
    PersonnelScheduleVersionRecord,
    PersonnelScheduleVersionRequest,
    ShiftTypeInput,
)


class ScheduleShiftTypeEntity(Base):
    __tablename__ = "schedule_shift_types"

    shift_type_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    shift_type_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    start_time: Mapped[str] = mapped_column(String(5), nullable=False)
    end_time: Mapped[str] = mapped_column(String(5), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    import_version_id: Mapped[str] = mapped_column(
        ForeignKey("import_versions.version_id"),
        nullable=False,
    )


class PersonnelScheduleVersionEntity(Base):
    __tablename__ = "personnel_schedule_versions"

    schedule_version_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    import_version_id: Mapped[str] = mapped_column(
        ForeignKey("import_versions.version_id"),
        nullable=False,
    )
    business_date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    business_date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    total_details: Mapped[int] = mapped_column(nullable=False)


class PersonnelScheduleDetailEntity(Base):
    __tablename__ = "personnel_schedule_details"

    schedule_detail_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    schedule_version_id: Mapped[str] = mapped_column(
        ForeignKey("personnel_schedule_versions.schedule_version_id"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_employees.employee_id"),
        nullable=False,
        index=True,
    )
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
    shift_type_id: Mapped[str] = mapped_column(
        ForeignKey("schedule_shift_types.shift_type_id"),
        nullable=False,
        index=True,
    )
    schedule_date: Mapped[str] = mapped_column(String(20), nullable=False)
    start_time: Mapped[str] = mapped_column(String(5), nullable=False)
    end_time: Mapped[str] = mapped_column(String(5), nullable=False)


class PersonnelScheduleIntervalEntity(Base):
    __tablename__ = "personnel_schedule_intervals"

    interval_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    schedule_detail_id: Mapped[str] = mapped_column(
        ForeignKey("personnel_schedule_details.schedule_detail_id"),
        nullable=False,
        index=True,
    )
    schedule_version_id: Mapped[str] = mapped_column(
        ForeignKey("personnel_schedule_versions.schedule_version_id"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_employees.employee_id"),
        nullable=False,
        index=True,
    )
    interval_date: Mapped[str] = mapped_column(String(20), nullable=False)
    interval_start: Mapped[str] = mapped_column(String(5), nullable=False)
    interval_end: Mapped[str] = mapped_column(String(5), nullable=False)


class PersonnelSchedulePersistenceRepository:
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

    def create_schedule_version(
        self,
        request: PersonnelScheduleVersionRequest,
    ) -> None:
        with self.session_factory.begin() as session:
            self._validate_import_version(session, request.import_version_id)
            for shift_type in request.shift_types:
                _validate_time_range(shift_type.start_time, shift_type.end_time)
                session.merge(_shift_type_entity(shift_type, request.import_version_id))
            session.flush()

            session.merge(
                PersonnelScheduleVersionEntity(
                    schedule_version_id=request.schedule_version_id,
                    import_version_id=request.import_version_id,
                    business_date_from=request.business_date_from,
                    business_date_to=request.business_date_to,
                    total_details=len(request.details),
                )
            )
            session.flush()

            for detail in request.details:
                _validate_time_range(detail.start_time, detail.end_time)
                self._validate_detail_references(session, request, detail)
                session.merge(_detail_entity(detail, request.schedule_version_id))
                session.flush()
                for interval_start, interval_end in _expand_half_hours(
                    detail.start_time,
                    detail.end_time,
                ):
                    session.add(
                        PersonnelScheduleIntervalEntity(
                            schedule_detail_id=detail.schedule_detail_id,
                            schedule_version_id=request.schedule_version_id,
                            employee_id=detail.employee_id,
                            interval_date=detail.schedule_date,
                            interval_start=interval_start,
                            interval_end=interval_end,
                        )
                    )

    def get_schedule_version(
        self,
        schedule_version_id: str,
    ) -> PersonnelScheduleVersionDetail | None:
        with self.session_factory() as session:
            version = session.get(PersonnelScheduleVersionEntity, schedule_version_id)
            if version is None:
                return None
            details = list(
                session.scalars(
                    select(PersonnelScheduleDetailEntity)
                    .where(
                        PersonnelScheduleDetailEntity.schedule_version_id
                        == schedule_version_id
                    )
                    .order_by(PersonnelScheduleDetailEntity.schedule_detail_id)
                )
            )
            intervals = list(
                session.scalars(
                    select(PersonnelScheduleIntervalEntity)
                    .where(
                        PersonnelScheduleIntervalEntity.schedule_version_id
                        == schedule_version_id
                    )
                    .order_by(
                        PersonnelScheduleIntervalEntity.employee_id,
                        PersonnelScheduleIntervalEntity.interval_date,
                        PersonnelScheduleIntervalEntity.interval_start,
                    )
                )
            )
        return PersonnelScheduleVersionDetail(
            version=PersonnelScheduleVersionRecord(
                schedule_version_id=version.schedule_version_id,
                import_version_id=version.import_version_id,
                business_date_from=version.business_date_from,
                business_date_to=version.business_date_to,
                total_details=version.total_details,
            ),
            details=[_detail_record(detail) for detail in details],
            intervals=[_interval_record(interval) for interval in intervals],
        )

    def get_schedule_version_by_import_version(
        self,
        import_version_id: str,
    ) -> PersonnelScheduleVersionDetail | None:
        with self.session_factory() as session:
            schedule_version_id = session.scalar(
                select(PersonnelScheduleVersionEntity.schedule_version_id)
                .where(
                    PersonnelScheduleVersionEntity.import_version_id
                    == import_version_id
                )
                .order_by(PersonnelScheduleVersionEntity.schedule_version_id)
            )
        if schedule_version_id is None:
            return None
        return self.get_schedule_version(schedule_version_id)

    def has_schedule_import_version(self, import_version_id: str) -> bool:
        with self.session_factory() as session:
            return (
                session.scalar(
                    select(PersonnelScheduleVersionEntity.schedule_version_id).where(
                        PersonnelScheduleVersionEntity.import_version_id == import_version_id
                    )
                )
                is not None
            )

    def _validate_import_version(self, session: Session, import_version_id: str) -> None:
        version = session.get(ImportVersionEntity, import_version_id)
        if version is None:
            raise ValueError(f"import_version_id {import_version_id} does not exist")
        if version.version_type != "personnel_schedule":
            raise ValueError(f"import_version_id {import_version_id} is not personnel_schedule")

    def _validate_detail_references(
        self,
        session: Session,
        request: PersonnelScheduleVersionRequest,
        detail: PersonnelScheduleDetailInput,
    ) -> None:
        if (
            detail.schedule_date < request.business_date_from
            or detail.schedule_date > request.business_date_to
        ):
            raise ValueError("schedule_date is outside schedule version business dates")

        checks = [
            ("employee_id", detail.employee_id, EmployeeEntity),
            ("workplace_id", detail.workplace_id, WorkplaceEntity),
            ("project_id", detail.project_id, ProjectEntity),
            ("skill_id", detail.skill_id, SkillEntity),
            ("shift_type_id", detail.shift_type_id, ScheduleShiftTypeEntity),
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
                detail.schedule_date < entity.effective_from
                or detail.schedule_date > entity.effective_to
            ):
                raise ValueError(f"{field_name} {reference_id} is outside effective dates")

        binding = session.scalars(
            select(EmployeeBindingEntity).where(
                EmployeeBindingEntity.employee_id == detail.employee_id,
                EmployeeBindingEntity.workplace_id == detail.workplace_id,
                EmployeeBindingEntity.project_id == detail.project_id,
                EmployeeBindingEntity.skill_id == detail.skill_id,
                EmployeeBindingEntity.effective_from <= detail.schedule_date,
                EmployeeBindingEntity.effective_to >= detail.schedule_date,
            )
        ).first()
        if binding is None:
            raise ValueError("employee binding does not cover schedule detail")


def _shift_type_entity(
    shift_type: ShiftTypeInput,
    import_version_id: str,
) -> ScheduleShiftTypeEntity:
    return ScheduleShiftTypeEntity(
        shift_type_id=shift_type.shift_type_id,
        shift_type_name=shift_type.shift_type_name,
        status=shift_type.status,
        start_time=shift_type.start_time,
        end_time=shift_type.end_time,
        effective_from=shift_type.effective_from,
        effective_to=shift_type.effective_to,
        import_version_id=import_version_id,
    )


def _detail_entity(
    detail: PersonnelScheduleDetailInput,
    schedule_version_id: str,
) -> PersonnelScheduleDetailEntity:
    return PersonnelScheduleDetailEntity(
        schedule_detail_id=detail.schedule_detail_id,
        schedule_version_id=schedule_version_id,
        employee_id=detail.employee_id,
        workplace_id=detail.workplace_id,
        project_id=detail.project_id,
        skill_id=detail.skill_id,
        shift_type_id=detail.shift_type_id,
        schedule_date=detail.schedule_date,
        start_time=detail.start_time,
        end_time=detail.end_time,
    )


def _detail_record(
    entity: PersonnelScheduleDetailEntity,
) -> PersonnelScheduleDetailRecord:
    return PersonnelScheduleDetailRecord(
        schedule_detail_id=entity.schedule_detail_id,
        schedule_version_id=entity.schedule_version_id,
        employee_id=entity.employee_id,
        workplace_id=entity.workplace_id,
        project_id=entity.project_id,
        skill_id=entity.skill_id,
        shift_type_id=entity.shift_type_id,
        schedule_date=entity.schedule_date,
        start_time=entity.start_time,
        end_time=entity.end_time,
    )


def _interval_record(
    entity: PersonnelScheduleIntervalEntity,
) -> PersonnelScheduleIntervalRecord:
    return PersonnelScheduleIntervalRecord(
        interval_id=entity.interval_id,
        schedule_detail_id=entity.schedule_detail_id,
        schedule_version_id=entity.schedule_version_id,
        employee_id=entity.employee_id,
        interval_date=entity.interval_date,
        interval_start=entity.interval_start,
        interval_end=entity.interval_end,
    )


def _validate_time_range(start_time: str, end_time: str) -> None:
    start = _parse_time(start_time)
    end = _parse_time(end_time)
    if end <= start:
        raise ValueError("end_time must be after start_time")
    if start.minute not in (0, 30) or end.minute not in (0, 30):
        raise ValueError("schedule time must align to half-hour boundaries")


def _expand_half_hours(start_time: str, end_time: str) -> list[tuple[str, str]]:
    current = _parse_time(start_time)
    end = _parse_time(end_time)
    intervals: list[tuple[str, str]] = []
    while current < end:
        next_time = current + timedelta(minutes=30)
        if next_time > end:
            raise ValueError("schedule time must align to half-hour boundaries")
        intervals.append((current.strftime("%H:%M"), next_time.strftime("%H:%M")))
        current = next_time
    return intervals


def _parse_time(value: str) -> datetime:
    return datetime.strptime(value, "%H:%M")
