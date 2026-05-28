import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, apply_actual_log_import
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataSnapshotRequest,
)


class ActualLogImportApiTest(unittest.TestCase):
    def test_apply_actual_log_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/import-batches/{batch_id}/apply-actual-logs", "POST"),
            routes,
        )

    def test_apply_actual_log_import_returns_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'actual-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_employee(database_url, "BATCH-LOGIN-API-001")
            _create_login_batch(import_repository, "BATCH-LOGIN-API-001")
            actual_repository = ActualLogPersistenceRepository(database_url)
            actual_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.ActualLogPersistenceRepository",
                    return_value=actual_repository,
                ),
            ):
                response = apply_actual_log_import("BATCH-LOGIN-API-001")

            self.assertEqual(response.batch_id, "BATCH-LOGIN-API-001")
            self.assertEqual(response.file_type, "login_log")
            self.assertEqual(response.applied_status, "applied")
            self.assertEqual(response.login_events, 1)
            self.assertEqual(response.skipped_rows, 0)

    def test_apply_actual_log_import_returns_already_applied_on_duplicate(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'actual-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_employee(database_url, "BATCH-LOGIN-API-002")
            _create_login_batch(import_repository, "BATCH-LOGIN-API-002")
            actual_repository = ActualLogPersistenceRepository(database_url)
            actual_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.ActualLogPersistenceRepository",
                    return_value=actual_repository,
                ),
            ):
                first_response = apply_actual_log_import("BATCH-LOGIN-API-002")
                second_response = apply_actual_log_import("BATCH-LOGIN-API-002")

        self.assertEqual(first_response.applied_status, "applied")
        self.assertEqual(second_response.applied_status, "already_applied")
        self.assertEqual(second_response.file_type, "login_log")
        self.assertEqual(second_response.login_events, 1)

    def test_apply_actual_log_import_returns_404_for_missing_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'actual-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=import_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    apply_actual_log_import("missing")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(raised.exception.detail["error"]["code"], "IMPORT_BATCH_NOT_FOUND")


def _create_login_batch(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="login_log.csv",
            file_type="login_log",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="LOGIN-API-001",
                    raw_data={
                        "standard_fields": {
                            "event_id": "LOGIN-API-001",
                            "employee_id": "A-1001",
                            "event_type": "login",
                            "event_at": "2026-05-11T09:00:00",
                            "timezone": "Asia/Shanghai",
                        }
                    },
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-LOGIN-API-001",
                    version_type="login_log",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
    )


def _seed_employee(database_url: str, batch_id: str) -> None:
    master_repository = MasterDataPersistenceRepository(database_url)
    master_repository.init_schema()
    master_repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id=batch_id,
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-1001",
                    employee_name="张三",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
