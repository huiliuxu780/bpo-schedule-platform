import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, get_personnel_schedule_production_detail
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
    PersonnelScheduleDetailInput,
    PersonnelScheduleVersionRequest,
    ShiftTypeInput,
)
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository


class PersonnelScheduleProductionApiTest(unittest.TestCase):
    def test_personnel_schedule_production_detail_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/personnel-schedule/production/{batch_id}", "GET"),
            routes,
        )

    def test_get_personnel_schedule_production_detail_returns_version_rows(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'schedule-production.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_import_and_master_data(database_url)
            schedule_repository = PersonnelSchedulePersistenceRepository(database_url)
            schedule_repository.init_schema()
            _seed_schedule_version(schedule_repository)

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
                response = get_personnel_schedule_production_detail(
                    "BATCH-SCH-PROD-001"
                )

        self.assertEqual(response.batch.batch_id, "BATCH-SCH-PROD-001")
        self.assertEqual(response.batch.file_type, "personnel_schedule")
        self.assertEqual(response.version.schedule_version_id, "SCH-PROD-001")
        self.assertEqual(response.version.import_version_id, "IMPORT-SCH-PROD-001")
        self.assertEqual(response.version.business_date_from, "2026-05-11")
        self.assertEqual(response.details[0].employee_id, "A-1001")
        self.assertEqual(response.details[0].workplace_id, "SH-01")
        self.assertEqual(response.details[0].project_id, "BOSCH-CS")
        self.assertEqual(response.details[0].skill_id, "L1-CN")
        self.assertEqual(response.details[0].shift_type_id, "MORNING-2H")
        self.assertEqual(
            [interval.interval_start for interval in response.intervals],
            ["09:00", "09:30", "10:00", "10:30"],
        )

    def test_get_personnel_schedule_production_detail_returns_404_when_not_applied(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'schedule-production.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_import_and_master_data(database_url)
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
                with self.assertRaises(HTTPException) as raised:
                    get_personnel_schedule_production_detail("BATCH-SCH-PROD-001")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "PERSONNEL_SCHEDULE_VERSION_NOT_FOUND",
        )


def _seed_import_and_master_data(database_url: str) -> None:
    import_repository = ImportPersistenceRepository(database_url)
    import_repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id="BATCH-SCH-PROD-001",
            file_name="personnel_schedule_prod.csv",
            file_type="personnel_schedule",
            uploaded_by="排班管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="A-1001|2026-05-11",
                    raw_data={"employee_id": "A-1001"},
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-SCH-PROD-001",
                    version_type="personnel_schedule",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
    )
    master_repository = MasterDataPersistenceRepository(database_url)
    master_repository.init_schema()
    master_repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id="BATCH-SCH-PROD-001",
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


def _seed_schedule_version(repository: PersonnelSchedulePersistenceRepository) -> None:
    repository.create_schedule_version(
        PersonnelScheduleVersionRequest(
            schedule_version_id="SCH-PROD-001",
            import_version_id="IMPORT-SCH-PROD-001",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            shift_types=[
                ShiftTypeInput(
                    shift_type_id="MORNING-2H",
                    shift_type_name="早班",
                    status="active",
                    start_time="09:00",
                    end_time="11:00",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            details=[
                PersonnelScheduleDetailInput(
                    schedule_detail_id="DETAIL-A-1001-20260511",
                    employee_id="A-1001",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    shift_type_id="MORNING-2H",
                    schedule_date="2026-05-11",
                    start_time="09:00",
                    end_time="11:00",
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
