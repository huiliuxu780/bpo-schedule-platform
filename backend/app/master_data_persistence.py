from typing import TypeVar

from sqlalchemy import ForeignKey, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.import_persistence import Base, ImportBatchEntity, build_engine
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeBindingRecord,
    EmployeeMasterDataInput,
    MasterDataEmployeeRecord,
    MasterDataReferenceRecord,
    MasterDataReferenceType,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
)


class SupplierEntity(Base):
    __tablename__ = "master_data_suppliers"

    supplier_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    supplier_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


class WorkplaceEntity(Base):
    __tablename__ = "master_data_workplaces"

    workplace_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    workplace_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


class ProjectEntity(Base):
    __tablename__ = "master_data_projects"

    project_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    project_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


class SkillEntity(Base):
    __tablename__ = "master_data_skills"

    skill_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    skill_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


class EmployeeEntity(Base):
    __tablename__ = "master_data_employees"

    employee_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    employee_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


class EmployeeBindingEntity(Base):
    __tablename__ = "master_data_employee_bindings"

    binding_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    employee_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_employees.employee_id"),
        nullable=False,
        index=True,
    )
    supplier_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_suppliers.supplier_id"),
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
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


ReferenceEntity = TypeVar(
    "ReferenceEntity",
    SupplierEntity,
    WorkplaceEntity,
    ProjectEntity,
    SkillEntity,
    EmployeeEntity,
)

ReferenceConfig = tuple[type[ReferenceEntity], str, str]

REFERENCE_CONFIGS: dict[MasterDataReferenceType, ReferenceConfig] = {
    "suppliers": (SupplierEntity, "supplier_id", "supplier_name"),
    "workplaces": (WorkplaceEntity, "workplace_id", "workplace_name"),
    "projects": (ProjectEntity, "project_id", "project_name"),
    "skills": (SkillEntity, "skill_id", "skill_name"),
}


class MasterDataPersistenceRepository:
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

    def create_snapshot(self, request: MasterDataSnapshotRequest) -> None:
        with self.session_factory.begin() as session:
            self._upsert_references(
                session,
                SupplierEntity,
                "supplier_id",
                "supplier_name",
                request.suppliers,
                request.batch_id,
            )
            self._upsert_references(
                session,
                WorkplaceEntity,
                "workplace_id",
                "workplace_name",
                request.workplaces,
                request.batch_id,
            )
            self._upsert_references(
                session,
                ProjectEntity,
                "project_id",
                "project_name",
                request.projects,
                request.batch_id,
            )
            self._upsert_references(
                session,
                SkillEntity,
                "skill_id",
                "skill_name",
                request.skills,
                request.batch_id,
            )
            for employee in request.employees:
                session.merge(_employee_entity(employee, request.batch_id))
            session.flush()

            for binding in request.bindings:
                self._validate_binding(session, binding)
                session.merge(_binding_entity(binding, request.batch_id))

    def has_snapshot_batch(self, batch_id: str) -> bool:
        with self.session_factory() as session:
            checks = [
                select(SupplierEntity.supplier_id).where(SupplierEntity.batch_id == batch_id),
                select(WorkplaceEntity.workplace_id).where(WorkplaceEntity.batch_id == batch_id),
                select(ProjectEntity.project_id).where(ProjectEntity.batch_id == batch_id),
                select(SkillEntity.skill_id).where(SkillEntity.batch_id == batch_id),
                select(EmployeeEntity.employee_id).where(EmployeeEntity.batch_id == batch_id),
                select(EmployeeBindingEntity.binding_id).where(
                    EmployeeBindingEntity.batch_id == batch_id
                ),
            ]
            return any(session.scalar(statement) is not None for statement in checks)

    def has_import_batch(self, batch_id: str) -> bool:
        with self.session_factory() as session:
            return session.get(ImportBatchEntity, batch_id) is not None

    def get_employee(self, employee_id: str) -> MasterDataEmployeeRecord | None:
        with self.session_factory() as session:
            employee = session.get(EmployeeEntity, employee_id)
            if employee is None:
                return None
            return _employee_record(employee)

    def get_reference(
        self,
        reference_type: MasterDataReferenceType,
        reference_id: str,
    ) -> MasterDataReferenceRecord | None:
        entity_class, id_field, name_field = _reference_config(reference_type)
        with self.session_factory() as session:
            reference = session.get(entity_class, reference_id)
            if reference is None:
                return None
            return _reference_record(reference, id_field, name_field)

    def upsert_reference(
        self,
        reference_type: MasterDataReferenceType,
        reference: MasterDataReferenceInput,
        batch_id: str,
    ) -> MasterDataReferenceRecord:
        entity_class, id_field, name_field = _reference_config(reference_type)
        with self.session_factory.begin() as session:
            session.merge(
                entity_class(
                    **{
                        id_field: reference.reference_id,
                        name_field: reference.reference_name,
                        "status": reference.status,
                        "effective_from": reference.effective_from,
                        "effective_to": reference.effective_to,
                        "batch_id": batch_id,
                    }
                )
            )
            session.flush()
            stored = session.get(entity_class, reference.reference_id)
            if stored is None:
                raise ValueError(f"REFERENCE_WRITE_FAILED: {reference.reference_id}")
            return _reference_record(stored, id_field, name_field)

    def upsert_employee(
        self,
        employee: EmployeeMasterDataInput,
        batch_id: str,
    ) -> MasterDataEmployeeRecord:
        with self.session_factory.begin() as session:
            entity = _employee_entity(employee, batch_id)
            session.merge(entity)
            session.flush()
            stored = session.get(EmployeeEntity, employee.employee_id)
            if stored is None:
                raise ValueError(f"EMPLOYEE_WRITE_FAILED: {employee.employee_id}")
            return _employee_record(stored)

    def upsert_employee_binding(
        self,
        binding: EmployeeBindingInput,
        batch_id: str,
    ) -> EmployeeBindingRecord:
        with self.session_factory.begin() as session:
            self._validate_binding(session, binding)
            session.merge(_binding_entity(binding, batch_id))
            session.flush()
            stored = session.get(EmployeeBindingEntity, binding.binding_id)
            if stored is None:
                raise ValueError(f"BINDING_WRITE_FAILED: {binding.binding_id}")
            return _binding_record(stored)

    def get_employee_binding(self, binding_id: str) -> EmployeeBindingRecord | None:
        with self.session_factory() as session:
            binding = session.get(EmployeeBindingEntity, binding_id)
            if binding is None:
                return None
            return _binding_record(binding)

    def _upsert_references(
        self,
        session: Session,
        entity_class: type[ReferenceEntity],
        id_field: str,
        name_field: str,
        references: list[MasterDataReferenceInput],
        batch_id: str,
    ) -> None:
        for reference in references:
            session.merge(
                entity_class(
                    **{
                        id_field: reference.reference_id,
                        name_field: reference.reference_name,
                        "status": reference.status,
                        "effective_from": reference.effective_from,
                        "effective_to": reference.effective_to,
                        "batch_id": batch_id,
                    }
                )
            )
        session.flush()

    def _validate_binding(
        self,
        session: Session,
        binding: EmployeeBindingInput,
    ) -> None:
        checks = [
            ("employee_id", binding.employee_id, EmployeeEntity),
            ("supplier_id", binding.supplier_id, SupplierEntity),
            ("workplace_id", binding.workplace_id, WorkplaceEntity),
            ("project_id", binding.project_id, ProjectEntity),
            ("skill_id", binding.skill_id, SkillEntity),
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
                binding.effective_from < entity.effective_from
                or binding.effective_to > entity.effective_to
            ):
                raise ValueError(f"{field_name} {reference_id} is outside effective dates")


def _employee_entity(
    employee: EmployeeMasterDataInput,
    batch_id: str,
) -> EmployeeEntity:
    return EmployeeEntity(
        employee_id=employee.employee_id,
        employee_name=employee.employee_name,
        status=employee.status,
        effective_from=employee.effective_from,
        effective_to=employee.effective_to,
        batch_id=batch_id,
    )


def _employee_record(employee: EmployeeEntity) -> MasterDataEmployeeRecord:
    return MasterDataEmployeeRecord(
        employee_id=employee.employee_id,
        employee_name=employee.employee_name,
        status=employee.status,
        effective_from=employee.effective_from,
        effective_to=employee.effective_to,
        batch_id=employee.batch_id,
    )


def _reference_config(reference_type: MasterDataReferenceType) -> ReferenceConfig:
    return REFERENCE_CONFIGS[reference_type]


def _reference_record(
    reference: ReferenceEntity,
    id_field: str,
    name_field: str,
) -> MasterDataReferenceRecord:
    return MasterDataReferenceRecord(
        reference_id=getattr(reference, id_field),
        reference_name=getattr(reference, name_field),
        status=reference.status,
        effective_from=reference.effective_from,
        effective_to=reference.effective_to,
        batch_id=reference.batch_id,
    )


def _binding_record(binding: EmployeeBindingEntity) -> EmployeeBindingRecord:
    return EmployeeBindingRecord(
        binding_id=binding.binding_id,
        employee_id=binding.employee_id,
        supplier_id=binding.supplier_id,
        workplace_id=binding.workplace_id,
        project_id=binding.project_id,
        skill_id=binding.skill_id,
        effective_from=binding.effective_from,
        effective_to=binding.effective_to,
        batch_id=binding.batch_id,
    )


def _binding_entity(
    binding: EmployeeBindingInput,
    batch_id: str,
) -> EmployeeBindingEntity:
    return EmployeeBindingEntity(
        binding_id=binding.binding_id,
        employee_id=binding.employee_id,
        supplier_id=binding.supplier_id,
        workplace_id=binding.workplace_id,
        project_id=binding.project_id,
        skill_id=binding.skill_id,
        effective_from=binding.effective_from,
        effective_to=binding.effective_to,
        batch_id=batch_id,
    )
