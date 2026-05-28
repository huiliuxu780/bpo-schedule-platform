import tempfile
import unittest
from pathlib import Path

from backend.app.import_persistence import ImportPersistenceRepository
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
from backend.app.personnel_schedule_import import apply_personnel_schedule_import_batch
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository


class PersonnelScheduleImportServiceTest(unittest.TestCase):
    def test_success_rows_are_applied_to_schedule_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'schedule-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_master_data(database_url, "BATCH-SCH-APPLY-001")
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-SCH-APPLY-001",
                    file_name="personnel_schedule.csv",
                    file_type="personnel_schedule",
                    uploaded_by="排班管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    rows=[
                        _success_row(
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
                        _success_row(
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
                        ImportBatchRowResultInput(
                            row_number=3,
                            row_status="failed",
                            source_key="IGNORED",
                            raw_data={
                                "standard_fields": {
                                    "record_type": "schedule_detail",
                                    "employee_id": "IGNORED",
                                }
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
            schedule_repository = PersonnelSchedulePersistenceRepository(database_url)
            schedule_repository.init_schema()

            summary = apply_personnel_schedule_import_batch(detail, schedule_repository)

            self.assertEqual(
                summary,
                {
                    "batch_id": "BATCH-SCH-APPLY-001",
                    "schedule_version_id": "BATCH-SCH-APPLY-001::schedule",
                    "shift_types": 1,
                    "details": 1,
                    "skipped_rows": 1,
                },
            )
            loaded = schedule_repository.get_schedule_version(
                "BATCH-SCH-APPLY-001::schedule"
            )
            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.version.import_version_id, "IMPORT-SCH-APPLY-001")
            self.assertEqual(
                loaded.details[0].schedule_detail_id,
                "A-1001|2026-05-11|09:00",
            )
            self.assertEqual(
                [interval.interval_start for interval in loaded.intervals],
                ["09:00", "09:30", "10:00", "10:30"],
            )

    def test_non_personnel_schedule_batch_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'schedule-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-MD-001",
                    file_name="master_data.csv",
                    file_type="master_data",
                    uploaded_by="数据管理员",
                    business_date_from="2026-05-01",
                    business_date_to="2026-12-31",
                    rows=[
                        _success_row(
                            1,
                            {
                                "record_type": "shift_type",
                                "shift_type_id": "MORNING-2H",
                            },
                        )
                    ],
                )
            )
            schedule_repository = PersonnelSchedulePersistenceRepository(database_url)
            schedule_repository.init_schema()

            with self.assertRaisesRegex(ValueError, "personnel_schedule"):
                apply_personnel_schedule_import_batch(detail, schedule_repository)

    def test_missing_personnel_schedule_import_version_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'schedule-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            detail = import_repository.create_import_batch(
                ImportBatchCreateRequest(
                    batch_id="BATCH-SCH-NO-VERSION",
                    file_name="personnel_schedule.csv",
                    file_type="personnel_schedule",
                    uploaded_by="排班管理员",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    rows=[
                        _success_row(
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
                        )
                    ],
                    versions=[],
                )
            )
            schedule_repository = PersonnelSchedulePersistenceRepository(database_url)
            schedule_repository.init_schema()

            with self.assertRaisesRegex(ValueError, "import version"):
                apply_personnel_schedule_import_batch(detail, schedule_repository)

    def test_missing_required_field_reports_row_number(self) -> None:
        detail = _detail_with_standard_fields(
            "BATCH-SCH-MISSING-FIELD",
            4,
            {
                "record_type": "schedule_detail",
                "employee_id": "A-1001",
                "workplace_id": "SH-01",
                "project_id": "BOSCH-CS",
                "skill_id": "L1-CN",
                "schedule_date": "2026-05-11",
                "start_time": "09:00",
                "end_time": "11:00",
            },
        )
        schedule_repository = PersonnelSchedulePersistenceRepository(
            "sqlite+pysqlite:///:memory:"
        )

        with self.assertRaisesRegex(ValueError, "row_number=4.*shift_type_id"):
            apply_personnel_schedule_import_batch(detail, schedule_repository)


def _success_row(
    row_number: int,
    standard_fields: dict[str, str],
) -> ImportBatchRowResultInput:
    return ImportBatchRowResultInput(
        row_number=row_number,
        row_status="success",
        source_key=standard_fields.get("shift_type_id")
        or standard_fields.get("schedule_detail_id")
        or standard_fields.get("employee_id"),
        raw_data={"standard_fields": standard_fields},
    )


def _detail_with_standard_fields(
    batch_id: str,
    row_number: int,
    standard_fields: dict[str, str],
):
    with tempfile.TemporaryDirectory() as directory:
        database_url = f"sqlite+pysqlite:///{Path(directory) / 'schedule-import.db'}"
        repository = ImportPersistenceRepository(database_url)
        repository.init_schema()
        return repository.create_import_batch(
            ImportBatchCreateRequest(
                batch_id=batch_id,
                file_name="personnel_schedule.csv",
                file_type="personnel_schedule",
                uploaded_by="排班管理员",
                business_date_from="2026-05-11",
                business_date_to="2026-05-11",
                rows=[_success_row(row_number, standard_fields)],
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
