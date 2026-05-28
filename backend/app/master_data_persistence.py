from typing import TypeVar

from sqlalchemy import ForeignKey, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.import_persistence import Base, build_engine
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeBindingRecord,
    EmployeeMasterDataInput,
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

    def get_employee_binding(self, binding_id: str) -> EmployeeBindingRecord | None:
        with self.session_factory() as session:
            binding = session.get(EmployeeBindingEntity, binding_id)
            if binding is None:
                return None
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
