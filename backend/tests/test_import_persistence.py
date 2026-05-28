import tempfile
import unittest
from pathlib import Path

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowCorrectionRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
)


class ImportPersistenceTest(unittest.TestCase):
    def test_import_batch_rows_failures_and_versions_survive_new_repository_instance(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'imports.db'}"
            writer = ImportPersistenceRepository(database_url)
            writer.init_schema()

            created = writer.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-DB002-001",
                    file_name="personnel_schedule_20260511.csv",
                    file_type="personnel_schedule",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    rows=[
                        ImportBatchRowResultInput(
                            row_number=1,
                            row_status="success",
                            source_key="A-1001|2026-05-11",
                            raw_data={"employee_id": "A-1001", "shift_type_id": "MORNING"},
                        ),
                        ImportBatchRowResultInput(
                            row_number=2,
                            row_status="failed",
                            source_key="A-404|2026-05-11",
                            error_field="employee_id",
                            error_code="UNKNOWN_EMPLOYEE",
                            error_message="员工不存在",
                            raw_data={"employee_id": "A-404", "shift_type_id": "MORNING"},
                        ),
                    ],
                    versions=[
                        ImportBatchVersionInput(
                            version_id="SCH-V-20260511-001",
                            version_type="personnel_schedule",
                            business_date_from="2026-05-11",
                            business_date_to="2026-05-11",
                        )
                    ],
                )
            )

            reader = ImportPersistenceRepository(database_url)
            loaded = reader.get_import_batch("BATCH-DB002-001")

            self.assertIsNotNone(loaded)
            self.assertEqual(created.batch.success_rows, 1)
            self.assertEqual(created.batch.failed_rows, 1)
            self.assertEqual(loaded.batch.batch_id, "BATCH-DB002-001")
            self.assertEqual(loaded.batch.total_rows, 2)
            self.assertEqual(loaded.rows[1].row_status, "failed")
            self.assertEqual(loaded.failed_rows[0].error_code, "UNKNOWN_EMPLOYEE")
            self.assertEqual(loaded.versions[0].version_id, "SCH-V-20260511-001")

    def test_correct_failed_import_row_updates_row_and_recalculates_batch_counts(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'imports.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()
            _create_batch_with_failed_row(repository, "BATCH-CORRECT-001")

            corrected = repository.correct_failed_row(
                "BATCH-CORRECT-001",
                ImportBatchRowCorrectionRequest(
                    row_number=2,
                    standard_fields={
                        "source_key": "A-1002|2026-05-11",
                        "employee_id": "A-1002",
                        "shift_type_id": "MORNING",
                    },
                ),
            )

            self.assertEqual(corrected.batch.success_rows, 2)
            self.assertEqual(corrected.batch.failed_rows, 0)
            self.assertEqual(corrected.batch.processing_status, "completed")
            self.assertEqual(corrected.rows[1].row_status, "success")
            self.assertEqual(corrected.rows[1].source_key, "A-1002|2026-05-11")
            self.assertIsNone(corrected.rows[1].error_code)
            self.assertEqual(
                corrected.rows[1].raw_data["standard_fields"]["employee_id"],
                "A-1002",
            )
            self.assertEqual(
                corrected.rows[1].raw_data["correction"]["previous_error_code"],
                "UNKNOWN_EMPLOYEE",
            )

    def test_correct_failed_import_row_rejects_non_failed_row(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'imports.db'}"
            repository = ImportPersistenceRepository(database_url)
            repository.init_schema()
            _create_batch_with_failed_row(repository, "BATCH-CORRECT-002")

            with self.assertRaisesRegex(ValueError, "is not failed"):
                repository.correct_failed_row(
                    "BATCH-CORRECT-002",
                    ImportBatchRowCorrectionRequest(
                        row_number=1,
                        standard_fields={"source_key": "A-1001|2026-05-11"},
                    ),
                )


def _create_batch_with_failed_row(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="personnel_schedule_20260511.csv",
            file_type="personnel_schedule",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="A-1001|2026-05-11",
                    raw_data={"standard_fields": {"source_key": "A-1001|2026-05-11"}},
                ),
                ImportBatchRowResultInput(
                    row_number=2,
                    row_status="failed",
                    source_key=None,
                    error_field="employee_id",
                    error_code="UNKNOWN_EMPLOYEE",
                    error_message="员工不存在",
                    raw_data={
                        "standard_fields": {
                            "source_key": "",
                            "employee_id": "A-404",
                        }
                    },
                ),
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id=f"{batch_id}::v1",
                    version_type="personnel_schedule",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
