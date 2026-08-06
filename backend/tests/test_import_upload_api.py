import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_mapping_persistence import ImportMappingPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, upload_import_batch_csv
from backend.app.models import ImportFieldMappingTemplateCreateRequest


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

    def test_upload_csv_uses_saved_field_mapping_template(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'import-upload.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            mapping_repository = ImportMappingPersistenceRepository(database_url)
            mapping_repository.init_schema()
            mapping_repository.create_field_mapping_template(
                ImportFieldMappingTemplateCreateRequest(
                    template_id="TPL-UPLOAD-001",
                    template_name="员工主数据模板",
                    file_type="master_data",
                    field_mapping={"员工编号": "source_key", "姓名": "employee_name"},
                    created_by="数据管理员",
                )
            )

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.get_import_mapping_persistence_repository",
                    return_value=mapping_repository,
                ),
            ):
                detail = upload_import_batch_csv(
                    batch_id="BATCH-UPLOAD-TPL-001",
                    file_name="employees.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    field_mapping=None,
                    template_id="TPL-UPLOAD-001",
                    csv_body="员工编号,姓名\nA-1001,张三\n",
                )

        self.assertEqual(detail.batch.success_rows, 1)
        self.assertEqual(detail.rows[0].source_key, "A-1001")
        self.assertEqual(detail.rows[0].raw_data["standard_fields"]["employee_name"], "张三")

    def test_upload_csv_repeat_same_batch_returns_existing_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'import-upload.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=repository,
            ):
                first = upload_import_batch_csv(
                    batch_id="BATCH-UPLOAD-RETRY-001",
                    file_name="employees.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    field_mapping=json.dumps(
                        {"员工编号": "source_key", "姓名": "employee_name"}
                    ),
                    csv_body="员工编号,姓名\nA-1001,张三\n",
                )
                # 客户端重放/双击导致同一批次重复提交：关键属性一致时返回已有批次而非 409。
                retry = upload_import_batch_csv(
                    batch_id="BATCH-UPLOAD-RETRY-001",
                    file_name="employees.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    field_mapping=json.dumps(
                        {"员工编号": "source_key", "姓名": "employee_name"}
                    ),
                    csv_body="员工编号,姓名\nA-1001,张三\n",
                )

        self.assertEqual(first.batch.batch_id, retry.batch.batch_id)
        self.assertEqual(retry.batch.total_rows, 1)
        self.assertEqual(retry.batch.success_rows, 1)

    def test_upload_csv_same_batch_different_attributes_still_conflicts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'import-upload.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=repository,
            ):
                upload_import_batch_csv(
                    batch_id="BATCH-UPLOAD-CONFLICT-001",
                    file_name="employees.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    field_mapping=json.dumps(
                        {"员工编号": "source_key", "姓名": "employee_name"}
                    ),
                    csv_body="员工编号,姓名\nA-1001,张三\n",
                )

                with self.assertRaises(HTTPException) as raised:
                    upload_import_batch_csv(
                        batch_id="BATCH-UPLOAD-CONFLICT-001",
                        file_name="other-upload.csv",
                        file_type="master_data",
                        uploaded_by="其他用户",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        field_mapping=json.dumps(
                            {"员工编号": "source_key", "姓名": "employee_name"}
                        ),
                        csv_body="员工编号,姓名\nA-1001,张三\n",
                    )

        self.assertEqual(raised.exception.status_code, 409)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "IMPORT_BATCH_ALREADY_EXISTS",
        )

    def test_upload_csv_returns_404_for_missing_field_mapping_template(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'import-upload.db'}"
            mapping_repository = ImportMappingPersistenceRepository(database_url)
            mapping_repository.init_schema()

            with patch(
                "backend.app.main.get_import_mapping_persistence_repository",
                return_value=mapping_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    upload_import_batch_csv(
                        batch_id="BATCH-UPLOAD-TPL-404",
                        file_name="employees.csv",
                        file_type="master_data",
                        uploaded_by="数据管理员",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        field_mapping=None,
                        template_id="missing",
                        csv_body="员工编号,姓名\nA-1001,张三\n",
                    )

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "IMPORT_FIELD_MAPPING_TEMPLATE_NOT_FOUND",
        )

    def test_upload_csv_returns_404_for_deactivated_field_mapping_template(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'import-upload.db'}"
            mapping_repository = ImportMappingPersistenceRepository(database_url)
            mapping_repository.init_schema()
            mapping_repository.create_field_mapping_template(
                ImportFieldMappingTemplateCreateRequest(
                    template_id="TPL-UPLOAD-INACTIVE",
                    template_name="停用模板",
                    file_type="master_data",
                    field_mapping={"员工编号": "source_key"},
                    created_by="数据管理员",
                )
            )
            mapping_repository.deactivate_field_mapping_template("TPL-UPLOAD-INACTIVE")

            with patch(
                "backend.app.main.get_import_mapping_persistence_repository",
                return_value=mapping_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    upload_import_batch_csv(
                        batch_id="BATCH-UPLOAD-TPL-INACTIVE",
                        file_name="employees.csv",
                        file_type="master_data",
                        uploaded_by="数据管理员",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        field_mapping=None,
                        template_id="TPL-UPLOAD-INACTIVE",
                        csv_body="员工编号,姓名\nA-1001,张三\n",
                    )

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "IMPORT_FIELD_MAPPING_TEMPLATE_NOT_FOUND",
        )


if __name__ == "__main__":
    unittest.main()
