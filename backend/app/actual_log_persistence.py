from datetime import datetime, time, timedelta

from sqlalchemy import Boolean, ForeignKey, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.import_persistence import Base, ImportVersionEntity, build_engine
from backend.app.master_data_persistence import EmployeeEntity
from backend.app.models import (
    ActualLoginEventInput,
    ActualLoginEventRecord,
    ActualStatusDictionaryInput,
    ActualStatusDictionaryRecord,
    ActualStatusIntervalImportRequest,
    ActualStatusIntervalInput,
    ActualStatusIntervalRecord,
)


SUPPORTED_TIMEZONE = "Asia/Shanghai"


class ActualLoginEventEntity(Base):
    __tablename__ = "actual_login_events"

    event_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    import_version_id: Mapped[str] = mapped_column(
        ForeignKey("import_versions.version_id"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_employees.employee_id"),
        nullable=False,
        index=True,
    )
    event_type: Mapped[str] = mapped_column(String(20), nullable=False)
    event_at: Mapped[str] = mapped_column(String(40), nullable=False)
    timezone: Mapped[str] = mapped_column(String(40), nullable=False)


class ActualStatusDictionaryEntity(Base):
    __tablename__ = "actual_status_dictionary"

    external_status_code: Mapped[str] = mapped_column(String(80), primary_key=True)
    normalized_status: Mapped[str] = mapped_column(String(80), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    is_productive: Mapped[bool] = mapped_column(Boolean, nullable=False)


class ActualStatusIntervalEntity(Base):
    __tablename__ = "actual_status_intervals"

    interval_row_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    source_interval_id: Mapped[str] = mapped_column(String(160), nullable=False)
    import_version_id: Mapped[str] = mapped_column(
        ForeignKey("import_versions.version_id"),
        nullable=False,
        index=True,
    )
    employee_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_employees.employee_id"),
        nullable=False,
        index=True,
    )
    business_date: Mapped[str] = mapped_column(String(20), nullable=False)
    interval_start: Mapped[str] = mapped_column(String(5), nullable=False)
    interval_end: Mapped[str] = mapped_column(String(5), nullable=False)
    timezone: Mapped[str] = mapped_column(String(40), nullable=False)
    external_status_code: Mapped[str] = mapped_column(
        ForeignKey("actual_status_dictionary.external_status_code"),
        nullable=False,
        index=True,
    )
    normalized_status: Mapped[str] = mapped_column(String(80), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    is_productive: Mapped[bool] = mapped_column(Boolean, nullable=False)


class ActualLogPersistenceRepository:
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

    def create_login_events(self, events: list[ActualLoginEventInput]) -> None:
        with self.session_factory.begin() as session:
            for event in events:
                _validate_timezone(event.timezone)
                self._validate_import_version(
                    session,
                    event.import_version_id,
                    expected_type="login_log",
                )
                self._validate_employee(session, event.employee_id)
                session.merge(
                    ActualLoginEventEntity(
                        event_id=event.event_id,
                        import_version_id=event.import_version_id,
                        employee_id=event.employee_id,
                        event_type=event.event_type,
                        event_at=event.event_at,
                        timezone=event.timezone,
                    )
                )

    def get_login_events(self, import_version_id: str) -> list[ActualLoginEventRecord]:
        with self.session_factory() as session:
            events = list(
                session.scalars(
                    select(ActualLoginEventEntity)
                    .where(ActualLoginEventEntity.import_version_id == import_version_id)
                    .order_by(
                        ActualLoginEventEntity.event_at,
                        ActualLoginEventEntity.event_id,
                    )
                )
            )
        return [_login_event_record(event) for event in events]

    def upsert_status_dictionary(
        self,
        entries: list[ActualStatusDictionaryInput],
    ) -> None:
        with self.session_factory.begin() as session:
            for entry in entries:
                session.merge(
                    ActualStatusDictionaryEntity(
                        external_status_code=entry.external_status_code,
                        normalized_status=entry.normalized_status,
                        category=entry.category,
                        is_productive=entry.is_productive,
                    )
                )

    def get_status_dictionary(self) -> list[ActualStatusDictionaryRecord]:
        with self.session_factory() as session:
            entries = list(
                session.scalars(
                    select(ActualStatusDictionaryEntity).order_by(
                        ActualStatusDictionaryEntity.external_status_code
                    )
                )
            )
        return [_status_dictionary_record(entry) for entry in entries]

    def create_status_intervals(
        self,
        request: ActualStatusIntervalImportRequest,
    ) -> None:
        with self.session_factory.begin() as session:
            import_version = self._validate_import_version(
                session,
                request.import_version_id,
                expected_type="status_log",
            )
            for interval in request.intervals:
                _validate_timezone(interval.timezone)
                employee = self._validate_employee(session, interval.employee_id)
                status = self._validate_status_dictionary(
                    session,
                    interval.external_status_code,
                )
                for segment in _split_business_day_segments(interval):
                    business_date = segment[0]
                    if (
                        business_date < import_version.business_date_from
                        or business_date > import_version.business_date_to
                    ):
                        raise ValueError(
                            "status interval is outside import version business dates"
                        )
                    if (
                        business_date < employee.effective_from
                        or business_date > employee.effective_to
                    ):
                        raise ValueError(
                            f"employee_id {interval.employee_id} is outside effective dates"
                        )
                    session.add(
                        ActualStatusIntervalEntity(
                            source_interval_id=interval.interval_id,
                            import_version_id=request.import_version_id,
                            employee_id=interval.employee_id,
                            business_date=business_date,
                            interval_start=segment[1],
                            interval_end=segment[2],
                            timezone=interval.timezone,
                            external_status_code=status.external_status_code,
                            normalized_status=status.normalized_status,
                            category=status.category,
                            is_productive=status.is_productive,
                        )
                    )

    def get_status_intervals(
        self,
        import_version_id: str,
    ) -> list[ActualStatusIntervalRecord]:
        with self.session_factory() as session:
            intervals = list(
                session.scalars(
                    select(ActualStatusIntervalEntity)
                    .where(ActualStatusIntervalEntity.import_version_id == import_version_id)
                    .order_by(
                        ActualStatusIntervalEntity.employee_id,
                        ActualStatusIntervalEntity.business_date,
                        ActualStatusIntervalEntity.interval_start,
                        ActualStatusIntervalEntity.interval_row_id,
                    )
                )
            )
        return [_status_interval_record(interval) for interval in intervals]

    def has_actual_import_version(
        self,
        import_version_id: str,
        *,
        file_type: str,
    ) -> bool:
        with self.session_factory() as session:
            if file_type == "login_log":
                return (
                    session.scalar(
                        select(ActualLoginEventEntity.event_id).where(
                            ActualLoginEventEntity.import_version_id == import_version_id
                        )
                    )
                    is not None
                )
            if file_type == "status_log":
                return (
                    session.scalar(
                        select(ActualStatusIntervalEntity.interval_row_id).where(
                            ActualStatusIntervalEntity.import_version_id
                            == import_version_id
                        )
                    )
                    is not None
                )
        raise ValueError(f"file_type {file_type} is not an actual log type")

    def _validate_import_version(
        self,
        session: Session,
        import_version_id: str,
        expected_type: str,
    ) -> ImportVersionEntity:
        version = session.get(ImportVersionEntity, import_version_id)
        if version is None:
            raise ValueError(f"import_version_id {import_version_id} does not exist")
        if version.version_type != expected_type:
            raise ValueError(f"import_version_id {import_version_id} is not {expected_type}")
        return version

    def _validate_employee(self, session: Session, employee_id: str) -> EmployeeEntity:
        employee = session.get(EmployeeEntity, employee_id)
        if employee is None:
            raise ValueError(f"employee_id {employee_id} does not exist")
        if employee.status == "frozen":
            raise ValueError(f"employee_id {employee_id} is frozen")
        if employee.status != "active":
            raise ValueError(f"employee_id {employee_id} is not active")
        return employee

    def _validate_status_dictionary(
        self,
        session: Session,
        external_status_code: str,
    ) -> ActualStatusDictionaryEntity:
        status = session.get(ActualStatusDictionaryEntity, external_status_code)
        if status is None:
            raise ValueError(f"external_status_code {external_status_code} does not exist")
        return status


def _login_event_record(entity: ActualLoginEventEntity) -> ActualLoginEventRecord:
    return ActualLoginEventRecord(
        event_id=entity.event_id,
        import_version_id=entity.import_version_id,
        employee_id=entity.employee_id,
        event_type=entity.event_type,
        event_at=entity.event_at,
        timezone=entity.timezone,
    )


def _status_dictionary_record(
    entity: ActualStatusDictionaryEntity,
) -> ActualStatusDictionaryRecord:
    return ActualStatusDictionaryRecord(
        external_status_code=entity.external_status_code,
        normalized_status=entity.normalized_status,
        category=entity.category,
        is_productive=entity.is_productive,
    )


def _status_interval_record(
    entity: ActualStatusIntervalEntity,
) -> ActualStatusIntervalRecord:
    return ActualStatusIntervalRecord(
        interval_row_id=entity.interval_row_id,
        source_interval_id=entity.source_interval_id,
        import_version_id=entity.import_version_id,
        employee_id=entity.employee_id,
        business_date=entity.business_date,
        interval_start=entity.interval_start,
        interval_end=entity.interval_end,
        timezone=entity.timezone,
        external_status_code=entity.external_status_code,
        normalized_status=entity.normalized_status,
        category=entity.category,
        is_productive=entity.is_productive,
    )


def _validate_timezone(value: str) -> None:
    if value != SUPPORTED_TIMEZONE:
        raise ValueError("timezone must be Asia/Shanghai")


def _split_business_day_segments(
    interval: ActualStatusIntervalInput,
) -> list[tuple[str, str, str]]:
    start = _parse_local_datetime(interval.start_at)
    end = _parse_local_datetime(interval.end_at)
    if end <= start:
        raise ValueError("end_at must be after start_at")

    current = start
    segments: list[tuple[str, str, str]] = []
    while current < end:
        next_midnight = datetime.combine(current.date() + timedelta(days=1), time.min)
        segment_end = min(end, next_midnight)
        segments.append(
            (
                current.date().isoformat(),
                current.strftime("%H:%M"),
                "24:00" if segment_end == next_midnight else segment_end.strftime("%H:%M"),
            )
        )
        current = segment_end
    return segments


def _parse_local_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)
