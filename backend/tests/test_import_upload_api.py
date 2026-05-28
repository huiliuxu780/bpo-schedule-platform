import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, upload_import_batch_csv


class ImportUploadApiTest(unittest.TestCase):
    def test_upload_csv_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/import-batches/upload-csv", "POST"), routes)

    def test_upload_csv_persists_batch_rows_failures_and_version(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'import-upload.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=repository,
            ):
                detail = upload_import_batch_csv(
                    batch_id="BATCH-UPLOAD-001",
                    file_name="employees.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    field_mapping=json.dumps(
                        {
                            "员工编号": "source_key",
                            "姓名": "employee_name",
                        }
                    ),
                    csv_body="员工编号,姓名\nA-1001,张三\n,李四\n",
                )

            self.assertEqual(detail.batch.batch_id, "BATCH-UPLOAD-001")
            self.assertEqual(detail.batch.total_rows, 2)
            self.assertEqual(detail.batch.success_rows, 1)
            self.assertEqual(detail.batch.failed_rows, 1)
            self.assertEqual(detail.batch.processing_status, "completed_with_errors")
            self.assertEqual(detail.rows[0].source_key, "A-1001")
            self.assertEqual(detail.failed_rows[0].error_field, "source_key")
            self.assertEqual(detail.failed_rows[0].error_code, "REQUIRED_FIELD_MISSING")
            self.assertEqual(detail.versions[0].version_id, "BATCH-UPLOAD-001::v1")
            self.assertEqual(detail.versions[0].version_type, "master_data")

    def test_upload_csv_rejects_invalid_field_mapping_json(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            upload_import_batch_csv(
                batch_id="BATCH-UPLOAD-002",
                file_name="employees.csv",
                file_type="master_data",
                uploaded_by="数据管理员",
                business_date_from="2026-05-11",
                business_date_to="2026-05-11",
                field_mapping="{not-json",
                csv_body="员工编号,姓名\nA-1001,张三\n",
            )

        self.assertEqual(raised.exception.status_code, 400)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "IMPORT_FIELD_MAPPING_INVALID",
        )


if __name__ == "__main__":
    unittest.main()
