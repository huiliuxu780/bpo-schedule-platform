import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, apply_master_data_import
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
)


class MasterDataImportApiTest(unittest.TestCase):
    def test_apply_master_data_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/import-batches/{batch_id}/apply-master-data", "POST"), routes)

    def test_apply_master_data_import_returns_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'master-data-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_master_data_batch(import_repository, "BATCH-MD-APPLY-001")

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
                response = apply_master_data_import("BATCH-MD-APPLY-001")

            self.assertEqual(response.batch_id, "BATCH-MD-APPLY-001")
            self.assertEqual(response.suppliers, 1)
            self.assertEqual(response.workplaces, 1)
            self.assertEqual(response.projects, 1)
            self.assertEqual(response.skills, 1)
            self.assertEqual(response.employees, 1)
            self.assertEqual(response.bindings, 1)
            self.assertEqual(response.applied_status, "applied")

    def test_apply_master_data_import_returns_already_applied_on_duplicate_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'master-data-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_master_data_batch(import_repository, "BATCH-MD-APPLY-IDEMPOTENT")

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
                first = apply_master_data_import("BATCH-MD-APPLY-IDEMPOTENT")
                second = apply_master_data_import("BATCH-MD-APPLY-IDEMPOTENT")

        self.assertEqual(first.applied_status, "applied")
        self.assertEqual(second.applied_status, "already_applied")
        self.assertEqual(second.bindings, 1)

    def test_apply_master_data_import_returns_not_ready_for_row_field_gap(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'master-data-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            master_data_repository = MasterDataPersistenceRepository(database_url)
            master_data_repository.init_schema()
            _create_master_data_batch_missing_employee_name(
                import_repository,
                "BATCH-MD-APPLY-NOT-READY",
            )

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
                with self.assertRaises(HTTPException) as raised:
                    apply_master_data_import("BATCH-MD-APPLY-NOT-READY")

        self.assertEqual(raised.exception.status_code, 400)
        error = raised.exception.detail["error"]
        self.assertEqual(error["code"], "IMPORT_APPLY_NOT_READY")
        self.assertEqual(error["readiness"]["readiness_status"], "blocked")
        self.assertEqual(
            error["readiness"]["row_blockers"][0]["field_name"],
            "employee_name",
        )

    def test_apply_master_data_import_returns_404_for_missing_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'master-data-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=import_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    apply_master_data_import("missing")

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
            source_key=standard_fields.get("reference_id") or standard_fields.get("employee_id") or standard_fields.get("binding_id"),
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


def _create_master_data_batch_missing_employee_name(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="master_data.csv",
            file_type="master_data",
            uploaded_by="数据管理员",
            business_date_from="2026-05-01",
            business_date_to="2026-12-31",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="A-1001",
                    raw_data={
                        "standard_fields": {
                            "record_type": "employee",
                            "employee_id": "A-1001",
                            "status": "active",
                            "effective_from": "2026-05-01",
                            "effective_to": "2026-12-31",
                        }
                    },
                )
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
