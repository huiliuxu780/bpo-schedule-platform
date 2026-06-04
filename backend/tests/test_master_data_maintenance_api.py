import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, maintain_master_data_employee
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    MasterDataEmployeeMaintenanceRequest,
)


class MasterDataMaintenanceApiTest(unittest.TestCase):
    def test_master_data_employee_maintenance_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/master-data/employees/{employee_id}/maintenance", "POST"),
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


if __name__ == "__main__":
    unittest.main()
