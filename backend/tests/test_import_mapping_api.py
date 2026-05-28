import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_mapping_persistence import ImportMappingPersistenceRepository
from backend.app.main import (
    app,
    create_import_field_mapping_template,
    get_import_field_mapping_template,
    list_import_field_mapping_templates,
)
from backend.app.models import ImportFieldMappingTemplateCreateRequest


class ImportMappingApiTest(unittest.TestCase):
    def test_import_field_mapping_routes_are_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/import-field-mapping-templates", "POST"), routes)
        self.assertIn(("/api/v1/import-field-mapping-templates", "GET"), routes)
        self.assertIn(
            ("/api/v1/import-field-mapping-templates/{template_id}", "GET"),
            routes,
        )

    def test_create_and_get_import_field_mapping_template(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'mapping-api.db'}"
            repository = ImportMappingPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.get_import_mapping_persistence_repository",
                return_value=repository,
            ):
                created = create_import_field_mapping_template(
                    ImportFieldMappingTemplateCreateRequest(
                        template_id="TPL-API-001",
                        template_name="登录日志模板",
                        file_type="login_log",
                        field_mapping={"员工编号": "source_key", "事件": "event_type"},
                        created_by="数据管理员",
                    )
                )
                loaded = get_import_field_mapping_template("TPL-API-001")

        self.assertEqual(created.template_id, "TPL-API-001")
        self.assertEqual(loaded.file_type, "login_log")
        self.assertEqual(loaded.field_mapping["事件"], "event_type")

    def test_list_import_field_mapping_templates_filters_by_file_type(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'mapping-api.db'}"
            repository = ImportMappingPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.get_import_mapping_persistence_repository",
                return_value=repository,
            ):
                create_import_field_mapping_template(
                    ImportFieldMappingTemplateCreateRequest(
                        template_id="TPL-API-MD",
                        template_name="主数据模板",
                        file_type="master_data",
                        field_mapping={"员工编号": "source_key"},
                        created_by="数据管理员",
                    )
                )
                create_import_field_mapping_template(
                    ImportFieldMappingTemplateCreateRequest(
                        template_id="TPL-API-FC",
                        template_name="预测模板",
                        file_type="demand_forecast",
                        field_mapping={"日期": "forecast_date"},
                        created_by="计划管理员",
                    )
                )
                response = list_import_field_mapping_templates(file_type="master_data")

        self.assertEqual(len(response.items), 1)
        self.assertEqual(response.items[0].template_id, "TPL-API-MD")

    def test_create_import_field_mapping_template_returns_409_for_duplicate(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'mapping-api.db'}"
            repository = ImportMappingPersistenceRepository(database_url)
            repository.init_schema()
            request = ImportFieldMappingTemplateCreateRequest(
                template_id="TPL-API-DUP",
                template_name="重复模板",
                file_type="status_log",
                field_mapping={"状态": "external_status_code"},
                created_by="数据管理员",
            )

            with patch(
                "backend.app.main.get_import_mapping_persistence_repository",
                return_value=repository,
            ):
                create_import_field_mapping_template(request)
                with self.assertRaises(HTTPException) as raised:
                    create_import_field_mapping_template(request)

        self.assertEqual(raised.exception.status_code, 409)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "IMPORT_FIELD_MAPPING_TEMPLATE_ALREADY_EXISTS",
        )

    def test_get_import_field_mapping_template_returns_404_for_missing_template(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'mapping-api.db'}"
            repository = ImportMappingPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.get_import_mapping_persistence_repository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    get_import_field_mapping_template("missing")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "IMPORT_FIELD_MAPPING_TEMPLATE_NOT_FOUND",
        )


if __name__ == "__main__":
    unittest.main()
