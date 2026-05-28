import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, correct_import_batch_failed_row
from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowCorrectionRequest,
    ImportBatchRowResultInput,
)


class ImportRowCorrectionApiTest(unittest.TestCase):
    def test_correct_import_row_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/import-batches/{batch_id}/rows/{row_number}/correct", "POST"),
            routes,
        )

    def test_correct_import_batch_failed_row_returns_updated_batch_detail(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'correction-api.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()
            _create_failed_batch(repository, "BATCH-CORRECTION-API-001")

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=repository,
            ):
                detail = correct_import_batch_failed_row(
                    "BATCH-CORRECTION-API-001",
                    2,
                    ImportBatchRowCorrectionRequest(
                        row_number=999,
                        standard_fields={
                            "source_key": "A-1002",
                            "employee_id": "A-1002",
                        },
                    ),
                )

        self.assertEqual(detail.batch.success_rows, 2)
        self.assertEqual(detail.batch.failed_rows, 0)
        self.assertEqual(detail.rows[1].row_status, "success")
        self.assertEqual(detail.rows[1].source_key, "A-1002")

    def test_correct_import_batch_failed_row_returns_404_for_missing_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'correction-api.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    correct_import_batch_failed_row(
                        "missing",
                        1,
                        ImportBatchRowCorrectionRequest(
                            row_number=1,
                            standard_fields={"source_key": "A-1001"},
                        ),
                    )

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(raised.exception.detail["error"]["code"], "IMPORT_BATCH_NOT_FOUND")

    def test_correct_import_batch_failed_row_returns_400_for_non_failed_row(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'correction-api.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()
            _create_failed_batch(repository, "BATCH-CORRECTION-API-002")

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    correct_import_batch_failed_row(
                        "BATCH-CORRECTION-API-002",
                        1,
                        ImportBatchRowCorrectionRequest(
                            row_number=1,
                            standard_fields={"source_key": "A-1001"},
                        ),
                    )

        self.assertEqual(raised.exception.status_code, 400)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "IMPORT_ROW_CORRECTION_INVALID",
        )


def _create_failed_batch(
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


if __name__ == "__main__":
    unittest.main()
