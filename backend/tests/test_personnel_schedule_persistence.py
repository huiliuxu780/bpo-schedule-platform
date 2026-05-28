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
    PersonnelScheduleDetailInput,
    PersonnelScheduleVersionRequest,
    ShiftTypeInput,
)
from backend.app.personnel_schedule_persistence import PersonnelSchedulePersistenceRepository


class PersonnelSchedulePersistenceTest(unittest.TestCase):
    def test_schedule_details_expand_to_half_hour_intervals_and_survive_new_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'schedule.db'}"
            _seed_import_and_master_data(database_url)
            writer = PersonnelSchedulePersistenceRepository(database_url)
            writer.init_schema()

            writer.create_schedule_version(
                PersonnelScheduleVersionRequest(
                    schedule_version_id="SCH-20260511-V1",
                    import_version_id="IMPORT-SCH-20260511",
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

            reader = PersonnelSchedulePersistenceRepository(database_url)
            loaded = reader.get_schedule_version("SCH-20260511-V1")

            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.version.schedule_version_id, "SCH-20260511-V1")
            self.assertEqual(loaded.details[0].employee_id, "A-1001")
            self.assertEqual(
                [interval.interval_start for interval in loaded.intervals],
                ["09:00", "09:30", "10:00", "10:30"],
            )

    def test_schedule_rejects_invalid_time_range(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'schedule.db'}"
            _seed_import_and_master_data(database_url)
            repository = PersonnelSchedulePersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "end_time must be after start_time"):
                repository.create_schedule_version(
                    PersonnelScheduleVersionRequest(
                        schedule_version_id="SCH-20260511-BAD",
                        import_version_id="IMPORT-SCH-20260511",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        shift_types=[
                            ShiftTypeInput(
                                shift_type_id="BAD",
                                shift_type_name="错误班次",
                                status="active",
                                start_time="11:00",
                                end_time="09:00",
                                effective_from="2026-05-01",
                                effective_to="2026-12-31",
                            )
                        ],
                        details=[],
                    )
                )

    def test_schedule_rejects_frozen_shift_type_reference(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'schedule.db'}"
            _seed_import_and_master_data(database_url)
            repository = PersonnelSchedulePersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "shift_type_id FROZEN is frozen"):
                repository.create_schedule_version(
                    PersonnelScheduleVersionRequest(
                        schedule_version_id="SCH-20260511-FROZEN",
                        import_version_id="IMPORT-SCH-20260511",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        shift_types=[
                            ShiftTypeInput(
                                shift_type_id="FROZEN",
                                shift_type_name="冻结班次",
                                status="frozen",
                                start_time="09:00",
                                end_time="11:00",
                                effective_from="2026-05-01",
                                effective_to="2026-12-31",
                            )
                        ],
                        details=[
                            PersonnelScheduleDetailInput(
                                schedule_detail_id="DETAIL-FROZEN",
                                employee_id="A-1001",
                                workplace_id="SH-01",
                                project_id="BOSCH-CS",
                                skill_id="L1-CN",
                                shift_type_id="FROZEN",
                                schedule_date="2026-05-11",
                                start_time="09:00",
                                end_time="11:00",
                            )
                        ],
                    )
                )


def _seed_import_and_master_data(database_url: str) -> None:
    import_repository = ImportPersistenceRepository(database_url)
    import_repository.init_schema()
    import_repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id="BATCH-SCH-20260511",
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
                    raw_data={"employee_id": "A-1001"},
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-SCH-20260511",
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
            batch_id="BATCH-SCH-20260511",
            suppliers=[
                MasterDataReferenceInput(
                    reference_id="SUP-A",
                    reference_name="供应商 A",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            workplaces=[
                MasterDataReferenceInput(
                    reference_id="SH-01",
                    reference_name="上海职场",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            projects=[
                MasterDataReferenceInput(
                    reference_id="BOSCH-CS",
                    reference_name="博西客服",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
            skills=[
                MasterDataReferenceInput(
                    reference_id="L1-CN",
                    reference_name="中文一线",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                )
            ],
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


if __name__ == "__main__":
    unittest.main()
