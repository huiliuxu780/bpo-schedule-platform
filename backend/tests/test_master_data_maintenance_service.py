import tempfile
import unittest
from pathlib import Path

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_maintenance import maintain_employee
from backend.app.master_data_maintenance import maintain_employee_binding
from backend.app.master_data_maintenance import maintain_employee_skills
from backend.app.master_data_maintenance import maintain_reference
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    EmployeeBindingInput,
    EmployeeSkillInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    MasterDataEmployeeSkillMaintenanceRequest,
    MasterDataEmployeeMaintenanceRequest,
    MasterDataBindingMaintenanceRequest,
    MasterDataOrganizationInput,
    MasterDataReferenceInput,
    MasterDataReferenceMaintenanceRequest,
    MasterDataSnapshotRequest,
)


class MasterDataMaintenanceServiceTest(unittest.TestCase):
    def test_create_employee_writes_single_agent_record(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-001")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            response = maintain_employee(
                "A-2001",
                MasterDataEmployeeMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-001",
                    employee_name="赵一",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.employee.employee_id, "A-2001")
            self.assertEqual(response.employee.employee_name, "赵一")
            self.assertEqual(response.employee.status, "active")
            self.assertEqual(response.employee.batch_id, "BATCH-MD-MAINT-001")

    def test_freeze_employee_preserves_name_and_effective_period(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-002")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-002",
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2002",
                            employee_name="钱二",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2002",
                MasterDataEmployeeMaintenanceRequest(
                    action="freeze",
                    source_batch_id="BATCH-MD-MAINT-002",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "frozen")
            self.assertEqual(response.employee.employee_name, "钱二")
            self.assertEqual(response.employee.status, "frozen")
            self.assertEqual(response.employee.effective_from, "2026-06-01")
            self.assertEqual(response.employee.effective_to, "2026-12-31")

    def test_edit_employee_updates_name_and_status(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-003")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-003",
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2003",
                            employee_name="李三",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2003",
                MasterDataEmployeeMaintenanceRequest(
                    action="edit",
                    source_batch_id="BATCH-MD-MAINT-003",
                    employee_name="李三-修正",
                    status="inactive",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "updated")
            self.assertEqual(response.employee.employee_name, "李三-修正")
            self.assertEqual(response.employee.status, "inactive")
            self.assertEqual(response.employee.effective_from, "2026-06-01")

    def test_edit_employee_updates_type_organization_and_workplace(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-010")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-010",
                    workplaces=[
                        MasterDataReferenceInput(
                            reference_id="NJ-01",
                            reference_name="南京职场",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SH-01",
                            reference_name="上海职场",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                    organizations=[
                        MasterDataOrganizationInput(
                            organization_id="ORG-RETURN",
                            organization_name="集中退换小组",
                            organization_level=1,
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataOrganizationInput(
                            organization_id="ORG-SUPPORT",
                            organization_name="在线支持小组",
                            organization_level=1,
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2010",
                            employee_name="刘晓晓",
                            status="active",
                            employee_type="internal",
                            organization_id="ORG-RETURN",
                            workplace_id="NJ-01",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2010",
                MasterDataEmployeeMaintenanceRequest(
                    action="edit",
                    source_batch_id="BATCH-MD-MAINT-010",
                    employee_name="刘晓晓-修正",
                    status="inactive",
                    employee_type="outsourced",
                    organization_id="ORG-SUPPORT",
                    workplace_id="SH-01",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "updated")
            self.assertEqual(response.employee.employee_name, "刘晓晓-修正")
            self.assertEqual(response.employee.status, "inactive")
            self.assertEqual(response.employee.employee_type, "outsourced")
            self.assertEqual(response.employee.organization_id, "ORG-SUPPORT")
            self.assertEqual(response.employee.workplace_id, "SH-01")

    def test_replace_employee_skills_updates_skill_set(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-011")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-011",
                    skills=[
                        MasterDataReferenceInput(
                            reference_id="SKILL-RETURN-TICKET",
                            reference_name="集中退换工单",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="ticket",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SKILL-RETURN-CALL",
                            reference_name="集中退换外呼",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="hotline",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SKILL-GENERAL",
                            reference_name="通用技能组",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="online",
                        ),
                    ],
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2011",
                            employee_name="刘晓晓",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                    employee_skills=[
                        EmployeeSkillInput(
                            employee_id="A-2011",
                            skill_id="SKILL-RETURN-TICKET",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                )
            )

            response = maintain_employee_skills(
                "A-2011",
                MasterDataEmployeeSkillMaintenanceRequest(
                    action="replace",
                    source_batch_id="BATCH-MD-MAINT-011",
                    skill_ids=["SKILL-RETURN-CALL", "SKILL-GENERAL"],
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "replaced")
            self.assertEqual(response.employee_id, "A-2011")
            self.assertEqual(
                [(skill.skill_id, skill.skill_category) for skill in response.skills],
                [
                    ("SKILL-GENERAL", "online"),
                    ("SKILL-RETURN-CALL", "hotline"),
                ],
            )
            self.assertEqual(
                [skill.skill_id for skill in repository.list_employee_skills("A-2011")],
                ["SKILL-GENERAL", "SKILL-RETURN-CALL"],
            )

    def test_effective_period_updates_dates_only(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-004")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-004",
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2004",
                            employee_name="周四",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_employee(
                "A-2004",
                MasterDataEmployeeMaintenanceRequest(
                    action="effective_period",
                    source_batch_id="BATCH-MD-MAINT-004",
                    effective_from="2026-07-01",
                    effective_to="2026-10-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "effective_period_updated")
            self.assertEqual(response.employee.employee_name, "周四")
            self.assertEqual(response.employee.status, "active")
            self.assertEqual(response.employee.effective_from, "2026-07-01")
            self.assertEqual(response.employee.effective_to, "2026-10-31")

    def test_edit_missing_employee_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-005")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "EMPLOYEE_NOT_FOUND"):
                maintain_employee(
                    "A-MISSING",
                    MasterDataEmployeeMaintenanceRequest(
                        action="edit",
                        source_batch_id="BATCH-MD-MAINT-005",
                        employee_name="不存在",
                    ),
                    repository,
                )

    def test_create_reference_writes_workplace_record(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-006")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            response = maintain_reference(
                "workplaces",
                "SITE-001",
                MasterDataReferenceMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-006",
                    reference_name="上海职场",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.reference.reference_id, "SITE-001")
            self.assertEqual(response.reference.reference_name, "上海职场")
            self.assertEqual(response.reference.status, "active")
            self.assertEqual(response.reference.batch_id, "BATCH-MD-MAINT-006")

    def test_create_skill_reference_writes_skill_category(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-SKILL")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            response = maintain_reference(
                "skills",
                "SKILL-ONLINE-001",
                MasterDataReferenceMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-SKILL",
                    reference_name="在线接待",
                    skill_category="online",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.reference.reference_id, "SKILL-ONLINE-001")
            self.assertEqual(response.reference.skill_category, "online")

    def test_freeze_reference_preserves_project_name_and_effective_period(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-007")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-MAINT-007",
                    projects=[
                        MasterDataReferenceInput(
                            reference_id="PROJ-001",
                            reference_name="热线项目",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            response = maintain_reference(
                "projects",
                "PROJ-001",
                MasterDataReferenceMaintenanceRequest(
                    action="freeze",
                    source_batch_id="BATCH-MD-MAINT-007",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "frozen")
            self.assertEqual(response.reference.reference_name, "热线项目")
            self.assertEqual(response.reference.status, "frozen")
            self.assertEqual(response.reference.effective_from, "2026-06-01")

    def test_create_binding_rejects_frozen_supplier_reference(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-008")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            _seed_binding_references(repository, "BATCH-MD-MAINT-008", supplier_status="frozen")

            with self.assertRaisesRegex(ValueError, "supplier_id SUP-001 is frozen"):
                maintain_employee_binding(
                    "BIND-001",
                    MasterDataBindingMaintenanceRequest(
                        action="create",
                        source_batch_id="BATCH-MD-MAINT-008",
                        employee_id="A-4001",
                        supplier_id="SUP-001",
                        workplace_id="SITE-001",
                        project_id="PROJ-001",
                        skill_id="SKILL-001",
                        effective_from="2026-06-01",
                        effective_to="2026-12-31",
                    ),
                    repository,
                )

    def test_create_binding_writes_validated_relationship(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance.db'}"
            _create_import_batch(database_url, "BATCH-MD-MAINT-009")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            _seed_binding_references(repository, "BATCH-MD-MAINT-009")

            response = maintain_employee_binding(
                "BIND-002",
                MasterDataBindingMaintenanceRequest(
                    action="create",
                    source_batch_id="BATCH-MD-MAINT-009",
                    employee_id="A-4001",
                    supplier_id="SUP-001",
                    workplace_id="SITE-001",
                    project_id="PROJ-001",
                    skill_id="SKILL-001",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                repository,
            )

            self.assertEqual(response.action_status, "created")
            self.assertEqual(response.binding.binding_id, "BIND-002")
            self.assertEqual(response.binding.employee_id, "A-4001")
            self.assertEqual(response.binding.supplier_id, "SUP-001")


def _create_import_batch(database_url: str, batch_id: str) -> None:
    repository = ImportPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name=f"{batch_id}.csv",
            file_type="master_data",
            uploaded_by="数据管理员",
            business_date_from="2026-06-01",
            business_date_to="2026-12-31",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key=batch_id,
                    raw_data={"batch_id": batch_id},
                )
            ],
        )
    )


def _seed_binding_references(
    repository: MasterDataPersistenceRepository,
    batch_id: str,
    supplier_status: str = "active",
) -> None:
    repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id=batch_id,
            suppliers=[
                MasterDataReferenceInput(
                    reference_id="SUP-001",
                    reference_name="供应商一",
                    status=supplier_status,
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            workplaces=[
                MasterDataReferenceInput(
                    reference_id="SITE-001",
                    reference_name="上海职场",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            projects=[
                MasterDataReferenceInput(
                    reference_id="PROJ-001",
                    reference_name="热线项目",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            skills=[
                MasterDataReferenceInput(
                    reference_id="SKILL-001",
                    reference_name="普通话",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-4001",
                    employee_name="吴五",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
