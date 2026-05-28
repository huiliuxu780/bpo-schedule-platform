import os
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import ForeignKey, String, create_engine, select
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker
from sqlalchemy.types import JSON

from backend.app.models import (
    ImportBatchCreateRequest,
    ImportFileType,
    ImportBatchPersistenceDetail,
    ImportBatchRecord,
    ImportBatchRowCorrectionRequest,
    ImportBatchRowResultRecord,
    ImportBatchVersionRecord,
    ImportProcessingStatus,
)


DEFAULT_DATABASE_URL = "sqlite+pysqlite:///./.local/bpo_schedule_platform.db"


class Base(DeclarativeBase):
    pass


class ImportBatchEntity(Base):
    __tablename__ = "import_batches"

    batch_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(80), nullable=False)
    uploaded_by: Mapped[str] = mapped_column(String(120), nullable=False)
    uploaded_at: Mapped[str] = mapped_column(String(40), nullable=False)
    business_date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    business_date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    processing_status: Mapped[str] = mapped_column(String(40), nullable=False)
    total_rows: Mapped[int] = mapped_column(nullable=False)
    success_rows: Mapped[int] = mapped_column(nullable=False)
    failed_rows: Mapped[int] = mapped_column(nullable=False)
    warning_rows: Mapped[int] = mapped_column(nullable=False)

    rows: Mapped[list["ImportRowResultEntity"]] = relationship(
        back_populates="batch",
        cascade="all, delete-orphan",
    )
    versions: Mapped[list["ImportVersionEntity"]] = relationship(
        back_populates="batch",
        cascade="all, delete-orphan",
    )


class ImportRowResultEntity(Base):
    __tablename__ = "import_row_results"

    row_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
        index=True,
    )
    row_number: Mapped[int] = mapped_column(nullable=False)
    row_status: Mapped[str] = mapped_column(String(20), nullable=False)
    source_key: Mapped[str | None] = mapped_column(String(255))
    error_field: Mapped[str | None] = mapped_column(String(120))
    error_code: Mapped[str | None] = mapped_column(String(120))
    error_message: Mapped[str | None] = mapped_column(String(500))
    raw_data: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    batch: Mapped[ImportBatchEntity] = relationship(back_populates="rows")


class ImportVersionEntity(Base):
    __tablename__ = "import_versions"

    version_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
        index=True,
    )
    version_type: Mapped[str] = mapped_column(String(80), nullable=False)
    business_date_from: Mapped[str] = mapped_column(String(20), nullable=False)
    business_date_to: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)

    batch: Mapped[ImportBatchEntity] = relationship(back_populates="versions")


def database_url_from_env() -> str:
    return os.environ.get("BPO_DATABASE_URL", DEFAULT_DATABASE_URL)


def build_engine(database_url: str | None = None) -> Engine:
    resolved_url = database_url or database_url_from_env()
    if resolved_url.startswith("sqlite"):
        Path(".local").mkdir(exist_ok=True)
        return create_engine(
            resolved_url,
            connect_args={"check_same_thread": False},
            future=True,
        )
    return create_engine(resolved_url, future=True)


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


class ImportPersistenceRepository:
    def __init__(self, database_url: str | None = None, engine: Engine | None = None):
        self.engine = engine or build_engine(database_url)
        self.session_factory = sessionmaker(
            bind=self.engine,
            autoflush=False,
            expire_on_commit=False,
            future=True,
        )

    def init_schema(self) -> None:
        Base.metadata.create_all(self.engine)

    def create_import_batch(
        self,
        request: ImportBatchCreateRequest,
    ) -> ImportBatchPersistenceDetail:
        success_rows = sum(1 for row in request.rows if row.row_status == "success")
        failed_rows = sum(1 for row in request.rows if row.row_status == "failed")
        warning_rows = sum(1 for row in request.rows if row.row_status == "warning")
        processing_status = "completed_with_errors" if failed_rows else "completed"
        created_at = _now_iso()

        with self.session_factory.begin() as session:
            existing = session.get(ImportBatchEntity, request.batch_id)
            if existing is not None:
                raise ValueError(f"import batch already exists: {request.batch_id}")

            batch = ImportBatchEntity(
                batch_id=request.batch_id,
                file_name=request.file_name,
                file_type=request.file_type,
                uploaded_by=request.uploaded_by,
                uploaded_at=created_at,
                business_date_from=request.business_date_from,
                business_date_to=request.business_date_to,
                processing_status=processing_status,
                total_rows=len(request.rows),
                success_rows=success_rows,
                failed_rows=failed_rows,
                warning_rows=warning_rows,
            )
            batch.rows = [
                ImportRowResultEntity(
                    row_number=row.row_number,
                    row_status=row.row_status,
                    source_key=row.source_key,
                    error_field=row.error_field,
                    error_code=row.error_code,
                    error_message=row.error_message,
                    raw_data=row.raw_data,
                )
                for row in request.rows
            ]
            batch.versions = [
                ImportVersionEntity(
                    version_id=version.version_id,
                    version_type=version.version_type,
                    business_date_from=version.business_date_from,
                    business_date_to=version.business_date_to,
                    created_at=created_at,
                )
                for version in request.versions
            ]
            session.add(batch)

        stored = self.get_import_batch(request.batch_id)
        if stored is None:
            raise RuntimeError("created import batch could not be read back")
        return stored

    def get_import_batch(self, batch_id: str) -> ImportBatchPersistenceDetail | None:
        with self.session_factory() as session:
            batch = session.get(ImportBatchEntity, batch_id)
            if batch is None:
                return None
            rows = list(
                session.scalars(
                    select(ImportRowResultEntity)
                    .where(ImportRowResultEntity.batch_id == batch_id)
                    .order_by(ImportRowResultEntity.row_number)
                )
            )
            versions = list(
                session.scalars(
                    select(ImportVersionEntity)
                    .where(ImportVersionEntity.batch_id == batch_id)
                    .order_by(ImportVersionEntity.version_id)
                )
            )

        row_records = [_row_record(row) for row in rows]
        return ImportBatchPersistenceDetail(
            batch=_batch_record(batch),
            rows=row_records,
            failed_rows=[row for row in row_records if row.row_status == "failed"],
            versions=[_version_record(version) for version in versions],
        )

    def list_import_batches(
        self,
        *,
        file_type: ImportFileType | None = None,
        processing_status: ImportProcessingStatus | None = None,
        uploaded_by: str | None = None,
    ) -> list[ImportBatchPersistenceDetail]:
        statement = select(ImportBatchEntity)
        if file_type is not None:
            statement = statement.where(ImportBatchEntity.file_type == file_type)
        if processing_status is not None:
            statement = statement.where(
                ImportBatchEntity.processing_status == processing_status
            )
        if uploaded_by is not None:
            statement = statement.where(ImportBatchEntity.uploaded_by == uploaded_by)
        statement = statement.order_by(
            ImportBatchEntity.uploaded_at.desc(),
            ImportBatchEntity.batch_id,
        )

        with self.session_factory() as session:
            batch_ids = [batch.batch_id for batch in session.scalars(statement)]

        details: list[ImportBatchPersistenceDetail] = []
        for batch_id in batch_ids:
            detail = self.get_import_batch(batch_id)
            if detail is not None:
                details.append(detail)
        return details

    def correct_failed_row(
        self,
        batch_id: str,
        request: ImportBatchRowCorrectionRequest,
    ) -> ImportBatchPersistenceDetail:
        source_key = _required_source_key(request.standard_fields)
        with self.session_factory.begin() as session:
            batch = session.get(ImportBatchEntity, batch_id)
            if batch is None:
                raise ValueError(f"import batch does not exist: {batch_id}")

            row = session.scalars(
                select(ImportRowResultEntity).where(
                    ImportRowResultEntity.batch_id == batch_id,
                    ImportRowResultEntity.row_number == request.row_number,
                )
            ).first()
            if row is None:
                raise ValueError(
                    f"import row does not exist: batch_id={batch_id}, "
                    f"row_number={request.row_number}"
                )
            if row.row_status != "failed":
                raise ValueError(
                    f"import row is not failed: batch_id={batch_id}, "
                    f"row_number={request.row_number}"
                )

            raw_data = dict(row.raw_data)
            raw_data["standard_fields"] = dict(request.standard_fields)
            raw_data["correction"] = {
                "previous_error_field": row.error_field,
                "previous_error_code": row.error_code,
                "previous_error_message": row.error_message,
            }
            row.row_status = "success"
            row.source_key = source_key
            row.error_field = None
            row.error_code = None
            row.error_message = None
            row.raw_data = raw_data
            session.flush()

            rows = list(
                session.scalars(
                    select(ImportRowResultEntity).where(
                        ImportRowResultEntity.batch_id == batch_id
                    )
                )
            )
            batch.success_rows = sum(1 for item in rows if item.row_status == "success")
            batch.failed_rows = sum(1 for item in rows if item.row_status == "failed")
            batch.warning_rows = sum(1 for item in rows if item.row_status == "warning")
            batch.processing_status = (
                "completed_with_errors" if batch.failed_rows else "completed"
            )

        corrected = self.get_import_batch(batch_id)
        if corrected is None:
            raise RuntimeError("corrected import batch could not be read back")
        return corrected


def _batch_record(entity: ImportBatchEntity) -> ImportBatchRecord:
    return ImportBatchRecord(
        batch_id=entity.batch_id,
        file_name=entity.file_name,
        file_type=entity.file_type,
        uploaded_by=entity.uploaded_by,
        uploaded_at=entity.uploaded_at,
        business_date_from=entity.business_date_from,
        business_date_to=entity.business_date_to,
        processing_status=entity.processing_status,
        total_rows=entity.total_rows,
        success_rows=entity.success_rows,
        failed_rows=entity.failed_rows,
        warning_rows=entity.warning_rows,
    )


def _row_record(entity: ImportRowResultEntity) -> ImportBatchRowResultRecord:
    return ImportBatchRowResultRecord(
        row_id=entity.row_id,
        batch_id=entity.batch_id,
        row_number=entity.row_number,
        row_status=entity.row_status,
        source_key=entity.source_key,
        error_field=entity.error_field,
        error_code=entity.error_code,
        error_message=entity.error_message,
        raw_data=entity.raw_data,
    )


def _version_record(entity: ImportVersionEntity) -> ImportBatchVersionRecord:
    return ImportBatchVersionRecord(
        version_id=entity.version_id,
        batch_id=entity.batch_id,
        version_type=entity.version_type,
        business_date_from=entity.business_date_from,
        business_date_to=entity.business_date_to,
        created_at=entity.created_at,
    )


def _required_source_key(standard_fields: dict) -> str:
    source_key = standard_fields.get("source_key")
    if source_key is not None and str(source_key).strip():
        return str(source_key).strip()
    raise ValueError("corrected row missing required field: source_key")


_default_repository: ImportPersistenceRepository | None = None


def get_import_persistence_repository() -> ImportPersistenceRepository:
    global _default_repository
    if _default_repository is None:
        _default_repository = ImportPersistenceRepository()
        _default_repository.init_schema()
    return _default_repository
