import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException
from sqlalchemy import text

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, list_master_data_bindings, list_master_data_employees
from backend.app.main import list_master_data_organizations
from backend.app.main import list_master_data_references, maintain_master_data_employee
from backend.app.main import maintain_master_data_binding
from backend.app.main import maintain_master_data_employee_skills
from backend.app.main import maintain_master_data_organization
from backend.app.main import maintain_master_data_reference
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    EmployeeSkillInput,
    MasterDataReferenceInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    MasterDataEmployeeSkillMaintenanceRequest,
    MasterDataBindingMaintenanceRequest,
    MasterDataEmployeeMaintenanceRequest,
    MasterDataOrganizationInput,
    MasterDataOrganizationMaintenanceRequest,
    MasterDataReferenceMaintenanceRequest,
    MasterDataSnapshotRequest,
)


class MasterDataMaintenanceApiTest(unittest.TestCase):
    def test_master_data_employee_maintenance_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/master-data/employees/{employee_id}/maintenance", "POST"),
            routes,
        )
        self.assertIn(
            (
                "/api/v1/master-data/{reference_type}/{reference_id}/maintenance",
                "POST",
            ),
            routes,
        )
        self.assertIn(
            ("/api/v1/master-data/bindings/{binding_id}/maintenance", "POST"),
            routes,
        )
        self.assertIn(
            ("/api/v1/master-data/employees", "GET"),
            routes,
        )
        self.assertIn(
            ("/api/v1/master-data/bindings", "GET"),
            routes,
        )
        self.assertIn(
            ("/api/v1/master-data/organizations", "GET"),
            routes,
        )
        self.assertIn(
            (
                "/api/v1/master-data/organizations/{organization_id}/maintenance",
                "POST",
            ),
            routes,
        )
        self.assertIn(
            ("/api/v1/master-data/{reference_type}", "GET"),
            routes,
        )
        self.assertIn(
            (
                "/api/v1/master-data/employees/{employee_id}/skills/maintenance",
                "POST",
            ),
            routes,
        )

    def test_maintain_organization_endpoint_updates_hierarchy_record(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'organization-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-ORG-API")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-ORG-API",
                    organizations=[
                        MasterDataOrganizationInput(
                            organization_id="ORG-CC",
                            organization_name="CC",
                            organization_level=1,
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = maintain_master_data_organization(
                    "ORG-CCO",
                    MasterDataOrganizationMaintenanceRequest(
                        action="create",
                        source_batch_id="BATCH-MD-ORG-API",
                        organization_name="CCO",
                        organization_level=2,
                        parent_organization_id="ORG-CC",
                        effective_from="2026-06-01",
                        effective_to="2026-12-31",
                    ),
                )

        self.assertEqual(response.action_status, "created")
        self.assertEqual(response.organization.organization_id, "ORG-CCO")
        self.assertEqual(response.organization.organization_path, "CC / CCO")

    def test_list_organizations_returns_hierarchy_rows(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'organization-list.db'}"
            _create_import_batch(database_url, "BATCH-MD-ORG-LIST")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-ORG-LIST",
                    organizations=[
                        MasterDataOrganizationInput(
                            organization_id="ORG-CC",
                            organization_name="CC",
                            organization_level=1,
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataOrganizationInput(
                            organization_id="ORG-CCO",
                            organization_name="CCO",
                            organization_level=2,
                            parent_organization_id="ORG-CC",
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                )
            )

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = list_master_data_organizations()

        self.assertEqual(
            [(row.organization_id, row.organization_path) for row in response.items],
            [
                ("ORG-CC", "CC"),
                ("ORG-CCO", "CC / CCO"),
            ],
        )

    def test_list_employees_returns_org_workplace_and_skill_context(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-API-LIST")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-API-LIST",
                    workplaces=[
                        MasterDataReferenceInput(
                            reference_id="NJ-01",
                            reference_name="南京职场",
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        )
                    ],
                    organizations=[
                        MasterDataOrganizationInput(
                            organization_id="ORG-CC",
                            organization_name="CC",
                            organization_level=1,
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataOrganizationInput(
                            organization_id="ORG-CCO",
                            organization_name="CCO",
                            organization_level=2,
                            parent_organization_id="ORG-CC",
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                        MasterDataOrganizationInput(
                            organization_id="ORG-RETURN",
                            organization_name="集中退换小组",
                            organization_level=3,
                            parent_organization_id="ORG-CCO",
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                    skills=[
                        MasterDataReferenceInput(
                            reference_id="SKILL-RETURN-TICKET",
                            reference_name="集中退换工单",
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                            skill_category="ticket",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SKILL-RETURN-CALL",
                            reference_name="集中退换外呼",
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                            skill_category="hotline",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SKILL-GENERAL",
                            reference_name="通用技能组",
                            status="active",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                            skill_category="online",
                        ),
                    ],
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-2001",
                            employee_name="刘晓晓",
                            status="active",
                            employee_type="internal",
                            organization_id="ORG-RETURN",
                            workplace_id="NJ-01",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        )
                    ],
                    employee_skills=[
                        EmployeeSkillInput(
                            employee_id="A-2001",
                            skill_id="SKILL-RETURN-TICKET",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                        EmployeeSkillInput(
                            employee_id="A-2001",
                            skill_id="SKILL-RETURN-CALL",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                        EmployeeSkillInput(
                            employee_id="A-2001",
                            skill_id="SKILL-GENERAL",
                            effective_from="2026-05-01",
                            effective_to="2026-12-31",
                        ),
                    ],
                )
            )

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = list_master_data_employees()

        self.assertEqual(len(response.items), 1)
        employee = response.items[0]
        self.assertEqual(employee.employee_id, "A-2001")
        self.assertEqual(employee.employee_name, "刘晓晓")
        self.assertEqual(employee.employee_type, "internal")
        self.assertEqual(employee.organization_path, "CC / CCO / 集中退换小组")
        self.assertEqual(employee.workplace_name, "南京职场")
        self.assertEqual(
            [(skill.skill_name, skill.skill_category) for skill in employee.skills],
            [
                ("通用技能组", "online"),
                ("集中退换外呼", "hotline"),
                ("集中退换工单", "ticket"),
            ],
        )

    def test_list_employees_tolerates_legacy_local_schema_without_new_columns(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'legacy-local.db'}"
            repository = MasterDataPersistenceRepository(database_url)
            with repository.engine.begin() as connection:
                connection.execute(
                    text(
                        """
                        CREATE TABLE master_data_employees (
                            employee_id VARCHAR(80) NOT NULL PRIMARY KEY,
                            employee_name VARCHAR(255) NOT NULL,
                            status VARCHAR(20) NOT NULL,
                            effective_from VARCHAR(20) NOT NULL,
                            effective_to VARCHAR(20) NOT NULL,
                            batch_id VARCHAR(80) NOT NULL
                        )
                        """
                    )
                )
                connection.execute(
                    text(
                        """
                        CREATE TABLE master_data_skills (
                            skill_id VARCHAR(80) NOT NULL PRIMARY KEY,
                            skill_name VARCHAR(255) NOT NULL,
                            status VARCHAR(20) NOT NULL,
                            effective_from VARCHAR(20) NOT NULL,
                            effective_to VARCHAR(20) NOT NULL,
                            batch_id VARCHAR(80) NOT NULL
                        )
                        """
                    )
                )
                connection.execute(
                    text(
                        """
                        INSERT INTO master_data_employees (
                            employee_id,
                            employee_name,
                            status,
                            effective_from,
                            effective_to,
                            batch_id
                        )
                        VALUES (
                            'A-LEGACY',
                            '旧库员工',
                            'active',
                            '2026-05-01',
                            '2026-12-31',
                            'BATCH-LEGACY'
                        )
                        """
                    )
                )

            rows = repository.list_employees()

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0].employee_id, "A-LEGACY")
        self.assertEqual(rows[0].employee_type, "internal")
        self.assertIsNone(rows[0].organization_path)
        self.assertIsNone(rows[0].workplace_name)
        self.assertEqual(rows[0].skills, [])

    def test_list_skill_references_tolerates_legacy_local_schema_without_category(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'legacy-skills.db'}"
            repository = MasterDataPersistenceRepository(database_url)
            with repository.engine.begin() as connection:
                connection.execute(
                    text(
                        """
                        CREATE TABLE master_data_skills (
                            skill_id VARCHAR(80) NOT NULL PRIMARY KEY,
                            skill_name VARCHAR(255) NOT NULL,
                            status VARCHAR(20) NOT NULL,
                            effective_from VARCHAR(20) NOT NULL,
                            effective_to VARCHAR(20) NOT NULL,
                            batch_id VARCHAR(80) NOT NULL
                        )
                        """
                    )
                )
                connection.execute(
                    text(
                        """
                        INSERT INTO master_data_skills (
                            skill_id,
                            skill_name,
                            status,
                            effective_from,
                            effective_to,
                            batch_id
                        )
                        VALUES (
                            'L1-CN',
                            '中文一线',
                            'active',
                            '2026-05-01',
                            '2026-12-31',
                            'BATCH-LEGACY'
                        )
                        """
                    )
                )

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = list_master_data_references("skills")

        self.assertEqual(len(response.items), 1)
        self.assertEqual(response.items[0].reference_id, "L1-CN")
        self.assertEqual(response.items[0].reference_name, "中文一线")
        self.assertIsNone(response.items[0].skill_category)

    def test_create_employee_returns_maintenance_response(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-API-001")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = maintain_master_data_employee(
                    "A-3001",
                    MasterDataEmployeeMaintenanceRequest(
                        action="create",
                        source_batch_id="BATCH-MD-API-001",
                        employee_name="孙三",
                        effective_from="2026-06-01",
                        effective_to="2026-12-31",
                    ),
                )

        self.assertEqual(response.action_status, "created")
        self.assertEqual(response.employee.employee_id, "A-3001")
        self.assertEqual(response.employee.employee_name, "孙三")

    def test_replace_employee_skills_returns_skill_response(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-API-006")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_snapshot(
                MasterDataSnapshotRequest(
                    batch_id="BATCH-MD-API-006",
                    skills=[
                        MasterDataReferenceInput(
                            reference_id="SKILL-API-ONLINE",
                            reference_name="在线接待",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="online",
                        ),
                        MasterDataReferenceInput(
                            reference_id="SKILL-API-TICKET",
                            reference_name="工单处理",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                            skill_category="ticket",
                        ),
                    ],
                    employees=[
                        EmployeeMasterDataInput(
                            employee_id="A-3002",
                            employee_name="钱二",
                            status="active",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        )
                    ],
                )
            )

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = maintain_master_data_employee_skills(
                    "A-3002",
                    MasterDataEmployeeSkillMaintenanceRequest(
                        action="replace",
                        source_batch_id="BATCH-MD-API-006",
                        skill_ids=["SKILL-API-TICKET", "SKILL-API-ONLINE"],
                        effective_from="2026-06-01",
                        effective_to="2026-12-31",
                    ),
                )

        self.assertEqual(response.employee_id, "A-3002")
        self.assertEqual(response.action_status, "replaced")
        self.assertEqual(
            [(skill.skill_id, skill.skill_category) for skill in response.skills],
            [
                ("SKILL-API-ONLINE", "online"),
                ("SKILL-API-TICKET", "ticket"),
            ],
        )

    def test_edit_missing_employee_returns_404_error_code(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-API-002")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    maintain_master_data_employee(
                        "A-MISSING",
                        MasterDataEmployeeMaintenanceRequest(
                            action="edit",
                            source_batch_id="BATCH-MD-API-002",
                            employee_name="不存在",
                        ),
                    )

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(raised.exception.detail["error"]["code"], "EMPLOYEE_NOT_FOUND")

    def test_create_reference_returns_maintenance_response(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-API-003")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                response = maintain_master_data_reference(
                    "skills",
                    "SKILL-API-001",
                    MasterDataReferenceMaintenanceRequest(
                        action="create",
                        source_batch_id="BATCH-MD-API-003",
                        reference_name="粤语",
                        skill_category="hotline",
                        effective_from="2026-06-01",
                        effective_to="2026-12-31",
                    ),
                )

        self.assertEqual(response.action_status, "created")
        self.assertEqual(response.reference.reference_id, "SKILL-API-001")
        self.assertEqual(response.reference.reference_name, "粤语")
        self.assertEqual(response.reference.skill_category, "hotline")

    def test_list_references_and_bindings_return_master_data_rows(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-API-LIST-REF")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            _seed_binding_references(repository, "BATCH-MD-API-LIST-REF")
            repository.upsert_employee_binding(
                EmployeeBindingInput(
                    binding_id="BIND-API-001",
                    employee_id="A-5001",
                    supplier_id="SUP-API-001",
                    workplace_id="SITE-API-001",
                    project_id="PROJ-API-001",
                    skill_id="SKILL-API-001",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                ),
                "BATCH-MD-API-LIST-REF",
            )

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                references = list_master_data_references("skills")
                bindings = list_master_data_bindings()

        self.assertEqual(len(references.items), 1)
        self.assertEqual(references.items[0].reference_id, "SKILL-API-001")
        self.assertEqual(references.items[0].reference_name, "普通话")
        self.assertEqual(len(bindings.items), 1)
        self.assertEqual(bindings.items[0].binding_id, "BIND-API-001")
        self.assertEqual(bindings.items[0].employee_id, "A-5001")

    def test_create_binding_returns_400_for_frozen_reference(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'maintenance-api.db'}"
            _create_import_batch(database_url, "BATCH-MD-API-004")
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            _seed_binding_references(repository, "BATCH-MD-API-004", supplier_status="frozen")

            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    maintain_master_data_binding(
                        "BIND-API-001",
                        MasterDataBindingMaintenanceRequest(
                            action="create",
                            source_batch_id="BATCH-MD-API-004",
                            employee_id="A-5001",
                            supplier_id="SUP-API-001",
                            workplace_id="SITE-API-001",
                            project_id="PROJ-API-001",
                            skill_id="SKILL-API-001",
                            effective_from="2026-06-01",
                            effective_to="2026-12-31",
                        ),
                    )

        self.assertEqual(raised.exception.status_code, 400)
        self.assertEqual(raised.exception.detail["error"]["code"], "MASTER_DATA_REFERENCE_INVALID")


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
                    reference_id="SUP-API-001",
                    reference_name="供应商一",
                    status=supplier_status,
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            workplaces=[
                MasterDataReferenceInput(
                    reference_id="SITE-API-001",
                    reference_name="上海职场",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            projects=[
                MasterDataReferenceInput(
                    reference_id="PROJ-API-001",
                    reference_name="热线项目",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            skills=[
                MasterDataReferenceInput(
                    reference_id="SKILL-API-001",
                    reference_name="普通话",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-5001",
                    employee_name="郑六",
                    status="active",
                    effective_from="2026-06-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
