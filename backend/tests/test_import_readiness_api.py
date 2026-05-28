import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app import main
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, apply_master_data_import
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
)


class ImportReadinessApiTest(unittest.TestCase):
    def test_import_apply_readiness_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/import-batches/{batch_id}/apply-readiness", "GET"),
            routes,
        )

    def test_import_apply_readiness_returns_ready_for_clean_not_applied_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'readiness.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_master_data_batch(import_repository, "BATCH-READY-001")

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                response = main.get_import_apply_readiness("BATCH-READY-001")

        self.assertEqual(response.batch_id, "BATCH-READY-001")
        self.assertEqual(response.file_type, "master_data")
        self.assertEqual(response.readiness_status, "ready")
        self.assertEqual(response.blockers, [])
        self.assertEqual(response.success_rows, 6)
        self.assertEqual(response.failed_rows, 0)
        self.assertEqual(response.version_count, 1)
        self.assertEqual(response.application_status, "not_applied")

    def test_import_apply_readiness_blocks_failed_rows_and_missing_version(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'readiness.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_failed_batch_without_version(import_repository, "BATCH-READY-002")

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                response = main.get_import_apply_readiness("BATCH-READY-002")

        blocker_codes = [blocker.code for blocker in response.blockers]
        self.assertEqual(response.readiness_status, "blocked")
        self.assertEqual(response.failed_rows, 1)
        self.assertEqual(response.version_count, 0)
        self.assertIn("IMPORT_FAILED_ROWS_PRESENT", blocker_codes)
        self.assertIn("IMPORT_VERSION_MISSING", blocker_codes)

    def test_import_apply_readiness_blocks_already_applied_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'readiness.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_master_data_batch(import_repository, "BATCH-READY-003")

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.MasterDataPersistenceRepository",
                    return_value=master_data_repository,
                ),
            ):
                apply_master_data_import("BATCH-READY-003")
                response = main.get_import_apply_readiness("BATCH-READY-003")

        self.assertEqual(response.readiness_status, "blocked")
        self.assertEqual(response.application_status, "applied")
        self.assertIn(
            "IMPORT_BATCH_ALREADY_APPLIED",
            [blocker.code for blocker in response.blockers],
        )

    def test_import_apply_readiness_returns_404_for_missing_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'readiness.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=import_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    main.get_import_apply_readiness("missing")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(raised.exception.detail["error"]["code"], "IMPORT_BATCH_NOT_FOUND")


def _create_master_data_batch(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    def row(row_number: int, standard_fields: dict[str, str]) -> ImportBatchRowResultInput:
        return ImportBatchRowResultInput(
            row_number=row_number,
            row_status="success",
            source_key=(
                standard_fields.get("reference_id")
                or standard_fields.get("employee_id")
                or standard_fields.get("binding_id")
            ),
            raw_data={"standard_fields": standard_fields},
        )

    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="master_data.csv",
            file_type="master_data",
            uploaded_by="数据管理员",
            business_date_from="2026-05-01",
            business_date_to="2026-12-31",
            rows=[
                row(1, _reference("supplier", "SUP-A", "供应商 A")),
                row(2, _reference("workplace", "SH-01", "上海职场")),
                row(3, _reference("project", "BOSCH-CS", "博西客服")),
                row(4, _reference("skill", "L1-CN", "中文一线")),
                row(
                    5,
                    {
                        "record_type": "employee",
                        "employee_id": "A-1001",
                        "employee_name": "张三",
                        "status": "active",
                        "effective_from": "2026-05-01",
                        "effective_to": "2026-12-31",
                    },
                ),
                row(
                    6,
                    {
                        "record_type": "binding",
                        "binding_id": "BIND-A-1001",
                        "employee_id": "A-1001",
                        "supplier_id": "SUP-A",
                        "workplace_id": "SH-01",
                        "project_id": "BOSCH-CS",
                        "skill_id": "L1-CN",
                        "effective_from": "2026-05-11",
                        "effective_to": "2026-06-30",
                    },
                ),
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id=f"{batch_id}::master_data",
                    version_type="master_data",
                    business_date_from="2026-05-01",
                    business_date_to="2026-12-31",
                )
            ],
        )
    )


def _create_failed_batch_without_version(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="employees.csv",
            file_type="master_data",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="A-1001",
                    raw_data={"standard_fields": {"source_key": "A-1001"}},
                ),
                ImportBatchRowResultInput(
                    row_number=2,
                    row_status="failed",
                    error_field="source_key",
                    error_code="REQUIRED_FIELD_MISSING",
                    error_message="缺少必填字段 source_key",
                    raw_data={"standard_fields": {"source_key": ""}},
                ),
            ],
        )
    )


def _reference(record_type: str, reference_id: str, reference_name: str) -> dict[str, str]:
    return {
        "record_type": record_type,
        "reference_id": reference_id,
        "reference_name": reference_name,
        "status": "active",
        "effective_from": "2026-05-01",
        "effective_to": "2026-12-31",
    }


if __name__ == "__main__":
    unittest.main()
