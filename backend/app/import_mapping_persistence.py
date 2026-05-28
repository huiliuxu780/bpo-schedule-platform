from datetime import datetime, timezone

from sqlalchemy import Boolean, String, select
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker
from sqlalchemy.types import JSON

from backend.app.import_persistence import Base, build_engine
from backend.app.models import (
    ImportFieldMappingTemplateCreateRequest,
    ImportFieldMappingTemplateRecord,
    ImportFieldMappingTemplateUpdateRequest,
    ImportFileType,
)


class ImportFieldMappingTemplateEntity(Base):
    __tablename__ = "import_field_mapping_templates"

    template_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    template_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    field_mapping: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_by: Mapped[str] = mapped_column(String(120), nullable=False)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class ImportMappingPersistenceRepository:
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

    def create_field_mapping_template(
        self,
        request: ImportFieldMappingTemplateCreateRequest,
    ) -> ImportFieldMappingTemplateRecord:
        created_at = _now_iso()
        with self.session_factory.begin() as session:
            existing = session.get(ImportFieldMappingTemplateEntity, request.template_id)
            if existing is not None:
                raise ValueError(
                    f"import field mapping template already exists: {request.template_id}"
                )
            entity = ImportFieldMappingTemplateEntity(
                template_id=request.template_id,
                template_name=request.template_name,
                file_type=request.file_type,
                field_mapping=dict(request.field_mapping),
                created_by=request.created_by,
                created_at=created_at,
                is_active=True,
            )
            session.add(entity)

        stored = self.get_field_mapping_template(request.template_id)
        if stored is None:
            raise RuntimeError("created import field mapping template could not be read back")
        return stored

    def get_field_mapping_template(
        self,
        template_id: str,
    ) -> ImportFieldMappingTemplateRecord | None:
        with self.session_factory() as session:
            entity = session.get(ImportFieldMappingTemplateEntity, template_id)
            if entity is None or not entity.is_active:
                return None
            return _template_record(entity)

    def update_field_mapping_template(
        self,
        template_id: str,
        request: ImportFieldMappingTemplateUpdateRequest,
    ) -> ImportFieldMappingTemplateRecord:
        with self.session_factory.begin() as session:
            entity = session.get(ImportFieldMappingTemplateEntity, template_id)
            if entity is None or not entity.is_active:
                raise ValueError(
                    f"import field mapping template does not exist: {template_id}"
                )
            entity.template_name = request.template_name
            entity.field_mapping = dict(request.field_mapping)
            session.flush()
            return _template_record(entity)

    def deactivate_field_mapping_template(
        self,
        template_id: str,
    ) -> ImportFieldMappingTemplateRecord:
        with self.session_factory.begin() as session:
            entity = session.get(ImportFieldMappingTemplateEntity, template_id)
            if entity is None or not entity.is_active:
                raise ValueError(
                    f"import field mapping template does not exist: {template_id}"
                )
            entity.is_active = False
            session.flush()
            return _template_record(entity)

    def list_field_mapping_templates(
        self,
        file_type: ImportFileType | None = None,
    ) -> list[ImportFieldMappingTemplateRecord]:
        with self.session_factory() as session:
            statement = (
                select(ImportFieldMappingTemplateEntity)
                .where(ImportFieldMappingTemplateEntity.is_active.is_(True))
                .order_by(
                    ImportFieldMappingTemplateEntity.file_type,
                    ImportFieldMappingTemplateEntity.template_id,
                )
            )
            if file_type is not None:
                statement = statement.where(
                    ImportFieldMappingTemplateEntity.file_type == file_type
                )
            entities = list(session.scalars(statement))
        return [_template_record(entity) for entity in entities]


def _template_record(
    entity: ImportFieldMappingTemplateEntity,
) -> ImportFieldMappingTemplateRecord:
    return ImportFieldMappingTemplateRecord(
        template_id=entity.template_id,
        template_name=entity.template_name,
        file_type=entity.file_type,
        field_mapping=dict(entity.field_mapping),
        created_by=entity.created_by,
        created_at=entity.created_at,
        is_active=entity.is_active,
    )


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


_default_repository: ImportMappingPersistenceRepository | None = None


def get_import_mapping_persistence_repository() -> ImportMappingPersistenceRepository:
    global _default_repository
    if _default_repository is None:
        _default_repository = ImportMappingPersistenceRepository()
        _default_repository.init_schema()
    return _default_repository
