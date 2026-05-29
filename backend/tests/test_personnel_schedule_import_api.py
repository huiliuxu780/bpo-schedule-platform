import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, apply_personnel_schedule_import
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
)
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository


class PersonnelScheduleImportApiTest(unittest.TestCase):
    def test_apply_personnel_schedule_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/import-batches/{batch_id}/apply-personnel-schedule", "POST"),
            routes,
        )

    def test_apply_personnel_schedule_import_returns_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'schedule-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_master_data(database_url, "BATCH-SCH-APPLY-001")
            _create_schedule_batch(import_repository, "BATCH-SCH-APPLY-001")
            schedule_repository = PersonnelSchedulePersistenceRepository(database_url)
            schedule_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.PersonnelSchedulePersistenceRepository",
                    return_value=schedule_repository,
                ),
            ):
                response = apply_personnel_schedule_import("BATCH-SCH-APPLY-001")

            self.assertEqual(response.batch_id, "BATCH-SCH-APPLY-001")
            self.assertEqual(response.schedule_version_id, "BATCH-SCH-APPLY-001::schedule")
            self.assertEqual(response.applied_status, "applied")
            self.assertEqual(response.shift_types, 1)
            self.assertEqual(response.details, 1)

    def test_apply_personnel_schedule_import_returns_already_applied_on_duplicate(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'schedule-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_master_data(database_url, "BATCH-SCH-APPLY-002")
            _create_schedule_batch(import_repository, "BATCH-SCH-APPLY-002")
            schedule_repository = PersonnelSchedulePersistenceRepository(database_url)
            schedule_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.PersonnelSchedulePersistenceRepository",
                    return_value=schedule_repository,
                ),
            ):
                first_response = apply_personnel_schedule_import("BATCH-SCH-APPLY-002")
                second_response = apply_personnel_schedule_import("BATCH-SCH-APPLY-002")

        self.assertEqual(first_response.applied_status, "applied")
        self.assertEqual(second_response.applied_status, "already_applied")
        self.assertEqual(second_response.schedule_version_id, "BATCH-SCH-APPLY-002::schedule")
        self.assertEqual(second_response.shift_types, 1)
        self.assertEqual(second_response.details, 1)

    def test_apply_personnel_schedule_import_returns_not_ready_for_row_field_gap(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'schedule-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            schedule_repository = PersonnelSchedulePersistenceRepository(database_url)
            schedule_repository.init_schema()
            _create_schedule_batch_missing_shift_type_id(
                import_repository,
                "BATCH-SCH-APPLY-NOT-READY",
            )

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.PersonnelSchedulePersistenceRepository",
                    return_value=schedule_repository,
                ),
            ):
                with self.assertRaises(HTTPException) as raised:
                    apply_personnel_schedule_import("BATCH-SCH-APPLY-NOT-READY")

        self.assertEqual(raised.exception.status_code, 400)
        error = raised.exception.detail["error"]
        self.assertEqual(error["code"], "IMPORT_APPLY_NOT_READY")
        self.assertEqual(error["readiness"]["readiness_status"], "blocked")
        self.assertEqual(
            error["readiness"]["row_blockers"][0]["field_name"],
            "shift_type_id",
        )

    def test_apply_personnel_schedule_import_returns_404_for_missing_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'schedule-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=import_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    apply_personnel_schedule_import("missing")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(raised.exception.detail["error"]["code"], "IMPORT_BATCH_NOT_FOUND")


def _create_schedule_batch(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="personnel_schedule.csv",
            file_type="personnel_schedule",
            uploaded_by="排班管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                _row(
                    1,
                    {
                        "record_type": "shift_type",
                        "shift_type_id": "MORNING-2H",
                        "shift_type_name": "早班",
                        "status": "active",
                        "start_time": "09:00",
                        "end_time": "11:00",
                        "effective_from": "2026-05-01",
                        "effective_to": "2026-12-31",
                    },
                ),
                _row(
                    2,
                    {
                        "record_type": "schedule_detail",
                        "employee_id": "A-1001",
                        "workplace_id": "SH-01",
                        "project_id": "BOSCH-CS",
                        "skill_id": "L1-CN",
                        "shift_type_id": "MORNING-2H",
                        "schedule_date": "2026-05-11",
                        "start_time": "09:00",
                        "end_time": "11:00",
                    },
                ),
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-SCH-APPLY-001",
                    version_type="personnel_schedule",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
    )


def _create_schedule_batch_missing_shift_type_id(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="personnel_schedule.csv",
            file_type="personnel_schedule",
            uploaded_by="排班管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                _row(
                    1,
                    {
                        "record_type": "shift_type",
                        "shift_type_name": "早班",
                        "status": "active",
                        "start_time": "09:00",
                        "end_time": "11:00",
                        "effective_from": "2026-05-01",
                        "effective_to": "2026-12-31",
                    },
                ),
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id=f"{batch_id}::personnel_schedule",
                    version_type="personnel_schedule",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
    )


def _row(row_number: int, standard_fields: dict[str, str]) -> ImportBatchRowResultInput:
    return ImportBatchRowResultInput(
        row_number=row_number,
        row_status="success",
        source_key=standard_fields.get("shift_type_id") or standard_fields.get("employee_id"),
        raw_data={"standard_fields": standard_fields},
    )


def _seed_master_data(database_url: str, batch_id: str) -> None:
    master_repository = MasterDataPersistenceRepository(database_url)
    master_repository.init_schema()
    master_repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id=batch_id,
            suppliers=[_reference("SUP-A", "供应商 A")],
            workplaces=[_reference("SH-01", "上海职场")],
            projects=[_reference("BOSCH-CS", "博西客服")],
            skills=[_reference("L1-CN", "中文一线")],
            employees=[
                EmployeeMasterDataInput(
                    employee_id="A-1001",
                    employee_name="张三",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            bindings=[
                EmployeeBindingInput(
                    binding_id="BIND-A-1001",
                    employee_id="A-1001",
                    supplier_id="SUP-A",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
        )
    )


def _reference(reference_id: str, reference_name: str) -> MasterDataReferenceInput:
    return MasterDataReferenceInput(
        reference_id=reference_id,
        reference_name=reference_name,
        status="active",
        effective_from="2026-05-01",
        effective_to="2026-12-31",
    )


if __name__ == "__main__":
    unittest.main()
