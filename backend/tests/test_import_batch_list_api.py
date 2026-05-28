import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.app import main
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, apply_master_data_import
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
)


class ImportBatchListApiTest(unittest.TestCase):
    def test_import_batch_list_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/import-batches", "GET"), routes)

    def test_list_import_batches_returns_batch_and_application_status(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'batch-list.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_master_data_batch(import_repository, "BATCH-LIST-001")

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
                apply_master_data_import("BATCH-LIST-001")
                response = main.list_import_batches()

        self.assertEqual(len(response.items), 1)
        item = response.items[0]
        self.assertEqual(item.batch_id, "BATCH-LIST-001")
        self.assertEqual(item.file_type, "master_data")
        self.assertEqual(item.processing_status, "completed")
        self.assertEqual(item.version_count, 1)
        self.assertEqual(item.application_status, "applied")
        self.assertEqual(item.application_target, "master_data_snapshot")
        self.assertEqual(item.import_version_id, "BATCH-LIST-001::master_data")
        self.assertEqual(item.applied_record_count, 6)

    def test_list_import_batches_filters_batch_fields_and_application_status(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'batch-list.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_master_data_batch(import_repository, "BATCH-LIST-002")
            _create_failed_login_batch(import_repository, "BATCH-LIST-003")

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
                response = main.list_import_batches(
                    file_type="login_log",
                    processing_status="completed_with_errors",
                    uploaded_by="数据管理员",
                    application_status="not_applied",
                )

        self.assertEqual(len(response.items), 1)
        item = response.items[0]
        self.assertEqual(item.batch_id, "BATCH-LIST-003")
        self.assertEqual(item.failed_rows, 1)
        self.assertEqual(item.application_status, "not_applied")


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


def _create_failed_login_batch(
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
                    source_key="A-1001",
                    raw_data={"standard_fields": {"source_key": "A-1001"}},
                ),
                ImportBatchRowResultInput(
                    row_number=2,
                    row_status="failed",
                    error_field="logged_in_at",
                    error_code="REQUIRED_FIELD_MISSING",
                    error_message="缺少必填字段 logged_in_at",
                    raw_data={"standard_fields": {"source_key": "A-1002"}},
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
