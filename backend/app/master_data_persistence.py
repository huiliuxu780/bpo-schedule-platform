from typing import TypeVar

from sqlalchemy import ForeignKey, String, delete, inspect as inspect_schema, select, text
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.import_persistence import Base, ImportBatchEntity, build_engine
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeBindingRecord,
    EmployeeMasterDataInput,
    EmployeeSkillInput,
    EmployeeSkillRecord,
    MasterDataEmployeeListRow,
    MasterDataEmployeeRecord,
    MasterDataOrganizationInput,
    MasterDataOrganizationRecord,
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
    skill_category: Mapped[str | None] = mapped_column(String(30), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


class OrganizationEntity(Base):
    __tablename__ = "master_data_organizations"

    organization_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    organization_name: Mapped[str] = mapped_column(String(255), nullable=False)
    organization_level: Mapped[int] = mapped_column(nullable=False)
    parent_organization_id: Mapped[str | None] = mapped_column(
        ForeignKey("master_data_organizations.organization_id"),
        nullable=True,
        index=True,
    )
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
    employee_type: Mapped[str] = mapped_column(String(30), nullable=False, default="internal")
    organization_id: Mapped[str | None] = mapped_column(
        ForeignKey("master_data_organizations.organization_id"),
        nullable=True,
        index=True,
    )
    workplace_id: Mapped[str | None] = mapped_column(
        ForeignKey("master_data_workplaces.workplace_id"),
        nullable=True,
        index=True,
    )
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    batch_id: Mapped[str] = mapped_column(
        ForeignKey("import_batches.batch_id"),
        nullable=False,
    )


class EmployeeSkillEntity(Base):
    __tablename__ = "master_data_employee_skills"

    employee_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_employees.employee_id"),
        primary_key=True,
    )
    skill_id: Mapped[str] = mapped_column(
        ForeignKey("master_data_skills.skill_id"),
        primary_key=True,
    )
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
            for organization in request.organizations:
                self._validate_organization(session, organization)
                session.merge(_organization_entity(organization, request.batch_id))
                session.flush()

            for employee in request.employees:
                self._validate_employee(session, employee)
                session.merge(_employee_entity(employee, request.batch_id))
            session.flush()

            for employee_skill in request.employee_skills:
                self._validate_employee_skill(session, employee_skill)
                session.merge(_employee_skill_entity(employee_skill, request.batch_id))
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
                select(OrganizationEntity.organization_id).where(
                    OrganizationEntity.batch_id == batch_id
                ),
                select(EmployeeEntity.employee_id).where(EmployeeEntity.batch_id == batch_id),
                select(EmployeeSkillEntity.employee_id).where(
                    EmployeeSkillEntity.batch_id == batch_id
                ),
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

    def get_organization(
        self,
        organization_id: str,
    ) -> MasterDataOrganizationRecord | None:
        with self.session_factory() as session:
            if not _has_table(session, "master_data_organizations"):
                return None
            organization = session.get(OrganizationEntity, organization_id)
            if organization is None:
                return None
            return _organization_record(session, organization)

    def list_organizations(self) -> list[MasterDataOrganizationRecord]:
        with self.session_factory() as session:
            if not _has_table(session, "master_data_organizations"):
                return []
            rows = session.scalars(
                select(OrganizationEntity).order_by(
                    OrganizationEntity.organization_level,
                    OrganizationEntity.organization_id,
                )
            ).all()
            return [_organization_record(session, row) for row in rows]

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

    def list_references(
        self,
        reference_type: MasterDataReferenceType,
    ) -> list[MasterDataReferenceRecord]:
        entity_class, id_field, name_field = _reference_config(reference_type)
        with self.session_factory() as session:
            if entity_class is SkillEntity and not _has_skill_category_schema(session):
                return _legacy_skill_reference_rows(session)
            rows = session.scalars(
                select(entity_class).order_by(getattr(entity_class, id_field))
            ).all()
            return [_reference_record(row, id_field, name_field) for row in rows]

    def upsert_reference(
        self,
        reference_type: MasterDataReferenceType,
        reference: MasterDataReferenceInput,
        batch_id: str,
    ) -> MasterDataReferenceRecord:
        entity_class, id_field, name_field = _reference_config(reference_type)
        with self.session_factory.begin() as session:
            values = {
                id_field: reference.reference_id,
                name_field: reference.reference_name,
                "status": reference.status,
                "effective_from": reference.effective_from,
                "effective_to": reference.effective_to,
                "batch_id": batch_id,
            }
            if entity_class is SkillEntity:
                values["skill_category"] = reference.skill_category
            session.merge(
                entity_class(**values)
            )
            session.flush()
            stored = session.get(entity_class, reference.reference_id)
            if stored is None:
                raise ValueError(f"REFERENCE_WRITE_FAILED: {reference.reference_id}")
            return _reference_record(stored, id_field, name_field)

    def upsert_organization(
        self,
        organization: MasterDataOrganizationInput,
        batch_id: str,
    ) -> MasterDataOrganizationRecord:
        with self.session_factory.begin() as session:
            self._validate_organization(session, organization)
            session.merge(_organization_entity(organization, batch_id))
            session.flush()
            stored = session.get(OrganizationEntity, organization.organization_id)
            if stored is None:
                raise ValueError(
                    f"ORGANIZATION_WRITE_FAILED: {organization.organization_id}"
                )
            return _organization_record(session, stored)

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

    def replace_employee_skills(
        self,
        employee_id: str,
        skill_ids: list[str],
        effective_from: str,
        effective_to: str,
        batch_id: str,
    ) -> list[EmployeeSkillRecord]:
        inputs = [
            EmployeeSkillInput(
                employee_id=employee_id,
                skill_id=skill_id,
                effective_from=effective_from,
                effective_to=effective_to,
            )
            for skill_id in dict.fromkeys(skill_ids)
        ]
        with self.session_factory.begin() as session:
            for employee_skill in inputs:
                self._validate_employee_skill(session, employee_skill)
            session.execute(
                delete(EmployeeSkillEntity).where(
                    EmployeeSkillEntity.employee_id == employee_id
                )
            )
            for employee_skill in inputs:
                session.merge(_employee_skill_entity(employee_skill, batch_id))
            session.flush()
            rows = session.execute(
                select(EmployeeSkillEntity, SkillEntity)
                .join(SkillEntity, EmployeeSkillEntity.skill_id == SkillEntity.skill_id)
                .where(EmployeeSkillEntity.employee_id == employee_id)
                .order_by(SkillEntity.skill_name, EmployeeSkillEntity.skill_id)
            ).all()
            return [_employee_skill_record(row[0], row[1]) for row in rows]

    def get_employee_binding(self, binding_id: str) -> EmployeeBindingRecord | None:
        with self.session_factory() as session:
            binding = session.get(EmployeeBindingEntity, binding_id)
            if binding is None:
                return None
            return _binding_record(binding)

    def list_employee_bindings(self) -> list[EmployeeBindingRecord]:
        with self.session_factory() as session:
            rows = session.scalars(
                select(EmployeeBindingEntity).order_by(EmployeeBindingEntity.binding_id)
            ).all()
            return [_binding_record(row) for row in rows]

    def list_employees(self) -> list[MasterDataEmployeeListRow]:
        with self.session_factory() as session:
            if not _has_enriched_employee_list_schema(session):
                return _legacy_employee_list_rows(session)

            rows = session.execute(
                select(EmployeeEntity, OrganizationEntity, WorkplaceEntity)
                .outerjoin(
                    OrganizationEntity,
                    EmployeeEntity.organization_id == OrganizationEntity.organization_id,
                )
                .outerjoin(
                    WorkplaceEntity,
                    EmployeeEntity.workplace_id == WorkplaceEntity.workplace_id,
                )
                .order_by(EmployeeEntity.employee_id)
            ).all()
            employee_ids = [row[0].employee_id for row in rows]
            skills_by_employee: dict[str, list[EmployeeSkillRecord]] = {
                employee_id: [] for employee_id in employee_ids
            }

            if employee_ids:
                skill_rows = session.execute(
                    select(EmployeeSkillEntity, SkillEntity)
                    .join(SkillEntity, EmployeeSkillEntity.skill_id == SkillEntity.skill_id)
                    .where(EmployeeSkillEntity.employee_id.in_(employee_ids))
                    .order_by(
                        EmployeeSkillEntity.employee_id,
                        SkillEntity.skill_name,
                        EmployeeSkillEntity.skill_id,
                    )
                ).all()
                for employee_skill, skill in skill_rows:
                    skills_by_employee.setdefault(employee_skill.employee_id, []).append(
                        _employee_skill_record(employee_skill, skill)
                    )

            return [
                _employee_list_row(
                    session,
                    row[0],
                    row[1],
                    row[2],
                    skills_by_employee.get(row[0].employee_id, []),
                )
                for row in rows
            ]

    def list_employee_skills(self, employee_id: str) -> list[EmployeeSkillRecord]:
        with self.session_factory() as session:
            rows = session.execute(
                select(EmployeeSkillEntity, SkillEntity)
                .join(SkillEntity, EmployeeSkillEntity.skill_id == SkillEntity.skill_id)
                .where(EmployeeSkillEntity.employee_id == employee_id)
                .order_by(SkillEntity.skill_name, EmployeeSkillEntity.skill_id)
            ).all()
            return [_employee_skill_record(row[0], row[1]) for row in rows]

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
            values = {
                id_field: reference.reference_id,
                name_field: reference.reference_name,
                "status": reference.status,
                "effective_from": reference.effective_from,
                "effective_to": reference.effective_to,
                "batch_id": batch_id,
            }
            if entity_class is SkillEntity:
                values["skill_category"] = reference.skill_category
            session.merge(entity_class(**values))
        session.flush()

    def _validate_organization(
        self,
        session: Session,
        organization: MasterDataOrganizationInput,
    ) -> None:
        if organization.parent_organization_id is None:
            return
        parent = session.get(OrganizationEntity, organization.parent_organization_id)
        if parent is None:
            raise ValueError(
                f"parent_organization_id {organization.parent_organization_id} does not exist"
            )
        if parent.status == "frozen":
            raise ValueError(
                f"parent_organization_id {organization.parent_organization_id} is frozen"
            )
        if parent.status != "active":
            raise ValueError(
                f"parent_organization_id {organization.parent_organization_id} is not active"
            )
        if (
            organization.effective_from < parent.effective_from
            or organization.effective_to > parent.effective_to
        ):
            raise ValueError(
                f"parent_organization_id {organization.parent_organization_id} is outside effective dates"
            )

    def _validate_employee(
        self,
        session: Session,
        employee: EmployeeMasterDataInput,
    ) -> None:
        if employee.organization_id is not None:
            self._validate_optional_employee_reference(
                session,
                "organization_id",
                employee.organization_id,
                OrganizationEntity,
                employee.effective_from,
                employee.effective_to,
            )
        if employee.workplace_id is not None:
            self._validate_optional_employee_reference(
                session,
                "workplace_id",
                employee.workplace_id,
                WorkplaceEntity,
                employee.effective_from,
                employee.effective_to,
            )

    def _validate_optional_employee_reference(
        self,
        session: Session,
        field_name: str,
        reference_id: str,
        entity_class: type[OrganizationEntity] | type[WorkplaceEntity],
        effective_from: str,
        effective_to: str,
    ) -> None:
        entity = session.get(entity_class, reference_id)
        if entity is None:
            raise ValueError(f"{field_name} {reference_id} does not exist")
        if entity.status == "frozen":
            raise ValueError(f"{field_name} {reference_id} is frozen")
        if entity.status != "active":
            raise ValueError(f"{field_name} {reference_id} is not active")
        if effective_from < entity.effective_from or effective_to > entity.effective_to:
            raise ValueError(f"{field_name} {reference_id} is outside effective dates")

    def _validate_employee_skill(
        self,
        session: Session,
        employee_skill: EmployeeSkillInput,
    ) -> None:
        checks = [
            ("employee_id", employee_skill.employee_id, EmployeeEntity),
            ("skill_id", employee_skill.skill_id, SkillEntity),
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
                employee_skill.effective_from < entity.effective_from
                or employee_skill.effective_to > entity.effective_to
            ):
                raise ValueError(f"{field_name} {reference_id} is outside effective dates")

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
        employee_type=employee.employee_type,
        organization_id=employee.organization_id,
        workplace_id=employee.workplace_id,
        effective_from=employee.effective_from,
        effective_to=employee.effective_to,
        batch_id=batch_id,
    )


def _employee_record(employee: EmployeeEntity) -> MasterDataEmployeeRecord:
    return MasterDataEmployeeRecord(
        employee_id=employee.employee_id,
        employee_name=employee.employee_name,
        status=employee.status,
        employee_type=employee.employee_type,
        organization_id=employee.organization_id,
        workplace_id=employee.workplace_id,
        effective_from=employee.effective_from,
        effective_to=employee.effective_to,
        batch_id=employee.batch_id,
    )


def _has_enriched_employee_list_schema(session: Session) -> bool:
    inspector = inspect_schema(session.bind)
    employee_columns = {
        column["name"] for column in inspector.get_columns("master_data_employees")
    }
    skill_columns = {
        column["name"] for column in inspector.get_columns("master_data_skills")
    }
    return {"employee_type", "organization_id", "workplace_id"}.issubset(
        employee_columns
    ) and "skill_category" in skill_columns


def _has_skill_category_schema(session: Session) -> bool:
    inspector = inspect_schema(session.bind)
    skill_columns = {
        column["name"] for column in inspector.get_columns("master_data_skills")
    }
    return "skill_category" in skill_columns


def _has_table(session: Session, table_name: str) -> bool:
    inspector = inspect_schema(session.bind)
    return table_name in inspector.get_table_names()


def _legacy_skill_reference_rows(session: Session) -> list[MasterDataReferenceRecord]:
    rows = session.execute(
        text(
            """
            SELECT skill_id, skill_name, status, effective_from, effective_to, batch_id
            FROM master_data_skills
            ORDER BY skill_id
            """
        )
    ).mappings()
    return [
        MasterDataReferenceRecord(
            reference_id=row["skill_id"],
            reference_name=row["skill_name"],
            status=row["status"],
            effective_from=row["effective_from"],
            effective_to=row["effective_to"],
            batch_id=row["batch_id"],
            skill_category=None,
        )
        for row in rows
    ]


def _legacy_employee_list_rows(session: Session) -> list[MasterDataEmployeeListRow]:
    rows = session.execute(
        text(
            """
            SELECT employee_id, employee_name, status, effective_from, effective_to, batch_id
            FROM master_data_employees
            ORDER BY employee_id
            """
        )
    ).mappings()
    return [
        MasterDataEmployeeListRow(
            employee_id=row["employee_id"],
            employee_name=row["employee_name"],
            status=row["status"],
            employee_type="internal",
            organization_id=None,
            organization_path=None,
            workplace_id=None,
            workplace_name=None,
            effective_from=row["effective_from"],
            effective_to=row["effective_to"],
            batch_id=row["batch_id"],
            skills=[],
        )
        for row in rows
    ]


def _employee_list_row(
    session: Session,
    employee: EmployeeEntity,
    organization: OrganizationEntity | None,
    workplace: WorkplaceEntity | None,
    skills: list[EmployeeSkillRecord],
) -> MasterDataEmployeeListRow:
    return MasterDataEmployeeListRow(
        employee_id=employee.employee_id,
        employee_name=employee.employee_name,
        status=employee.status,
        employee_type=employee.employee_type,
        organization_id=employee.organization_id,
        organization_path=_organization_path(session, organization)
        if organization is not None
        else None,
        workplace_id=employee.workplace_id,
        workplace_name=workplace.workplace_name if workplace is not None else None,
        effective_from=employee.effective_from,
        effective_to=employee.effective_to,
        batch_id=employee.batch_id,
        skills=skills,
    )


def _organization_entity(
    organization: MasterDataOrganizationInput,
    batch_id: str,
) -> OrganizationEntity:
    return OrganizationEntity(
        organization_id=organization.organization_id,
        organization_name=organization.organization_name,
        organization_level=organization.organization_level,
        parent_organization_id=organization.parent_organization_id,
        status=organization.status,
        effective_from=organization.effective_from,
        effective_to=organization.effective_to,
        batch_id=batch_id,
    )


def _organization_record(
    session: Session,
    organization: OrganizationEntity,
) -> MasterDataOrganizationRecord:
    return MasterDataOrganizationRecord(
        organization_id=organization.organization_id,
        organization_name=organization.organization_name,
        organization_level=organization.organization_level,
        parent_organization_id=organization.parent_organization_id,
        status=organization.status,
        effective_from=organization.effective_from,
        effective_to=organization.effective_to,
        batch_id=organization.batch_id,
        organization_path=_organization_path(session, organization),
    )


def _organization_path(
    session: Session,
    organization: OrganizationEntity,
) -> str:
    names = [organization.organization_name]
    current = organization
    while current.parent_organization_id:
        parent = session.get(OrganizationEntity, current.parent_organization_id)
        if parent is None:
            break
        names.append(parent.organization_name)
        current = parent
    return " / ".join(reversed(names))


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
        skill_category=reference.skill_category
        if isinstance(reference, SkillEntity)
        else None,
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


def _employee_skill_entity(
    employee_skill: EmployeeSkillInput,
    batch_id: str,
) -> EmployeeSkillEntity:
    return EmployeeSkillEntity(
        employee_id=employee_skill.employee_id,
        skill_id=employee_skill.skill_id,
        effective_from=employee_skill.effective_from,
        effective_to=employee_skill.effective_to,
        batch_id=batch_id,
    )


def _employee_skill_record(
    employee_skill: EmployeeSkillEntity,
    skill: SkillEntity,
) -> EmployeeSkillRecord:
    return EmployeeSkillRecord(
        employee_id=employee_skill.employee_id,
        skill_id=employee_skill.skill_id,
        skill_name=skill.skill_name,
        skill_category=skill.skill_category,
        effective_from=employee_skill.effective_from,
        effective_to=employee_skill.effective_to,
        batch_id=employee_skill.batch_id,
    )
