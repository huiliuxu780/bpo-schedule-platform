import tempfile
import unittest
from pathlib import Path

from backend.app.import_mapping_persistence import ImportMappingPersistenceRepository
from backend.app.models import ImportFieldMappingTemplateCreateRequest


class ImportMappingPersistenceTest(unittest.TestCase):
    def test_mapping_template_survives_new_repository_instance(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'mapping.db'}"
            writer = ImportMappingPersistenceRepository(database_url)
            writer.init_schema()

            created = writer.create_field_mapping_template(
                ImportFieldMappingTemplateCreateRequest(
                    template_id="TPL-MD-001",
                    template_name="主数据员工模板",
                    file_type="master_data",
                    field_mapping={"员工编号": "source_key", "姓名": "employee_name"},
                    created_by="数据管理员",
                )
            )

            reader = ImportMappingPersistenceRepository(database_url)
            loaded = reader.get_field_mapping_template("TPL-MD-001")

            self.assertEqual(created.template_id, "TPL-MD-001")
            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.template_name, "主数据员工模板")
            self.assertEqual(loaded.file_type, "master_data")
            self.assertEqual(
                loaded.field_mapping,
                {"员工编号": "source_key", "姓名": "employee_name"},
            )
            self.assertTrue(loaded.is_active)
            self.assertEqual(loaded.created_by, "数据管理员")

    def test_duplicate_template_id_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'mapping.db'}"
            repository = ImportMappingPersistenceRepository(database_url)
            repository.init_schema()
            request = ImportFieldMappingTemplateCreateRequest(
                template_id="TPL-DUP",
                template_name="重复模板",
                file_type="personnel_schedule",
                field_mapping={"员工编号": "source_key"},
                created_by="数据管理员",
            )

            repository.create_field_mapping_template(request)

            with self.assertRaisesRegex(ValueError, "already exists"):
                repository.create_field_mapping_template(request)

    def test_list_field_mapping_templates_filters_by_file_type(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'mapping.db'}"
            repository = ImportMappingPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_field_mapping_template(
                ImportFieldMappingTemplateCreateRequest(
                    template_id="TPL-MD",
                    template_name="主数据模板",
                    file_type="master_data",
                    field_mapping={"员工编号": "source_key"},
                    created_by="数据管理员",
                )
            )
            repository.create_field_mapping_template(
                ImportFieldMappingTemplateCreateRequest(
                    template_id="TPL-SCH",
                    template_name="排班模板",
                    file_type="personnel_schedule",
                    field_mapping={"员工编号": "source_key"},
                    created_by="数据管理员",
                )
            )

            templates = repository.list_field_mapping_templates(file_type="master_data")

            self.assertEqual([template.template_id for template in templates], ["TPL-MD"])


if __name__ == "__main__":
    unittest.main()
