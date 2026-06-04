import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, maintain_master_data_employee
from backend.app.main import maintain_master_data_binding
from backend.app.main import maintain_master_data_reference
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    MasterDataReferenceInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    MasterDataBindingMaintenanceRequest,
    MasterDataEmployeeMaintenanceRequest,
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
                        effective_from="2026-06-01",
                        effective_to="2026-12-31",
                    ),
                )

        self.assertEqual(response.action_status, "created")
        self.assertEqual(response.reference.reference_id, "SKILL-API-001")
        self.assertEqual(response.reference.reference_name, "粤语")

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
