import tempfile
import unittest
from pathlib import Path

from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    ActualStatusDictionaryInput,
    ActualStatusIntervalImportRequest,
    ActualStatusIntervalInput,
    ComparisonRunRequest,
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    ForecastIntervalInput,
    ForecastScheduleComparisonResultInput,
    ForecastVersionRequest,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
    PersonnelScheduleDetailInput,
    PersonnelScheduleVersionRequest,
    ScheduleActualComparisonResultInput,
    ShiftTypeInput,
)
from backend.app.personnel_schedule_persistence import (
    PersonnelSchedulePersistenceRepository,
)


class ComparisonPersistenceTest(unittest.TestCase):
    def test_comparison_runs_and_results_survive_new_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison.db'}"
            _seed_comparison_sources(database_url)
            writer = ComparisonPersistenceRepository(database_url)
            writer.init_schema()

            writer.create_comparison_run(
                ComparisonRunRequest(
                    run_id="RUN-FS-20260511",
                    comparison_type="forecast_vs_schedule",
                    forecast_version_id="FC-20260511-V1",
                    schedule_version_id="SCH-20260511-V1",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    status="completed",
                    total_results=1,
                    total_gap_agents=2,
                    forecast_schedule_results=[
                        ForecastScheduleComparisonResultInput(
                            forecast_interval_id="FC-INT-001",
                            schedule_detail_id="DETAIL-A-1001-20260511",
                            business_date="2026-05-11",
                            workplace_id="SH-01",
                            project_id="BOSCH-CS",
                            skill_id="L1-CN",
                            interval_start="09:00",
                            interval_end="09:30",
                            forecast_agents=3,
                            scheduled_agents=1,
                            gap_agents=2,
                            result_status="gap",
                        )
                    ],
                )
            )
            writer.create_comparison_run(
                ComparisonRunRequest(
                    run_id="RUN-SA-20260511",
                    comparison_type="schedule_vs_actual",
                    schedule_version_id="SCH-20260511-V1",
                    actual_import_version_id="IMPORT-STATUS-20260511",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    status="completed",
                    total_results=1,
                    total_late_minutes=15,
                    schedule_actual_results=[
                        ScheduleActualComparisonResultInput(
                            schedule_detail_id="DETAIL-A-1001-20260511",
                            actual_status_interval_row_id=1,
                            business_date="2026-05-11",
                            employee_id="A-1001",
                            interval_start="09:00",
                            interval_end="09:30",
                            scheduled_minutes=30,
                            actual_productive_minutes=15,
                            late_minutes=15,
                            result_status="late",
                        )
                    ],
                )
            )

            reader = ComparisonPersistenceRepository(database_url)
            forecast_run = reader.get_comparison_run("RUN-FS-20260511")
            actual_run = reader.get_comparison_run("RUN-SA-20260511")

            self.assertIsNotNone(forecast_run)
            self.assertEqual(forecast_run.run.comparison_type, "forecast_vs_schedule")
            self.assertEqual(forecast_run.run.total_results, 1)
            self.assertEqual(forecast_run.forecast_schedule_results[0].gap_agents, 2)
            self.assertEqual(
                forecast_run.forecast_schedule_results[0].forecast_version_id,
                "FC-20260511-V1",
            )
            self.assertIsNotNone(actual_run)
            self.assertEqual(actual_run.run.comparison_type, "schedule_vs_actual")
            self.assertEqual(actual_run.run.total_late_minutes, 15)
            self.assertEqual(
                actual_run.schedule_actual_results[0].actual_import_version_id,
                "IMPORT-STATUS-20260511",
            )

    def test_forecast_schedule_run_rejects_missing_source_version(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison.db'}"
            _seed_comparison_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "forecast_vs_schedule requires forecast_version_id and schedule_version_id",
            ):
                repository.create_comparison_run(
                    ComparisonRunRequest(
                        run_id="RUN-FS-MISSING",
                        comparison_type="forecast_vs_schedule",
                        schedule_version_id="SCH-20260511-V1",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        status="failed",
                    )
                )

    def test_schedule_actual_rejects_non_status_log_import_version(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison.db'}"
            _seed_comparison_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "actual_import_version_id IMPORT-LOGIN-20260511 is not status_log",
            ):
                repository.create_comparison_run(
                    ComparisonRunRequest(
                        run_id="RUN-SA-BAD-TYPE",
                        comparison_type="schedule_vs_actual",
                        schedule_version_id="SCH-20260511-V1",
                        actual_import_version_id="IMPORT-LOGIN-20260511",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        status="failed",
                    )
                )

    def test_forecast_schedule_rejects_detail_from_different_schedule_version(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison.db'}"
            _seed_comparison_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "schedule_detail_id DETAIL-A-1002-20260511 does not belong to schedule_version_id SCH-20260511-V1",
            ):
                repository.create_comparison_run(
                    ComparisonRunRequest(
                        run_id="RUN-FS-CROSS-SCHEDULE",
                        comparison_type="forecast_vs_schedule",
                        forecast_version_id="FC-20260511-V1",
                        schedule_version_id="SCH-20260511-V1",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        status="failed",
                        forecast_schedule_results=[
                            ForecastScheduleComparisonResultInput(
                                forecast_interval_id="FC-INT-001",
                                schedule_detail_id="DETAIL-A-1002-20260511",
                                business_date="2026-05-11",
                                workplace_id="SH-01",
                                project_id="BOSCH-CS",
                                skill_id="L1-CN",
                                interval_start="09:00",
                                interval_end="09:30",
                                forecast_agents=3,
                                scheduled_agents=1,
                                gap_agents=2,
                                result_status="gap",
                            )
                        ],
                    )
                )

    def test_schedule_actual_rejects_status_interval_from_different_import(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison.db'}"
            _seed_comparison_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "actual_status_interval_row_id 2 does not belong to actual_import_version_id IMPORT-STATUS-20260511",
            ):
                repository.create_comparison_run(
                    ComparisonRunRequest(
                        run_id="RUN-SA-CROSS-ACTUAL",
                        comparison_type="schedule_vs_actual",
                        schedule_version_id="SCH-20260511-V1",
                        actual_import_version_id="IMPORT-STATUS-20260511",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        status="failed",
                        schedule_actual_results=[
                            ScheduleActualComparisonResultInput(
                                schedule_detail_id="DETAIL-A-1001-20260511",
                                actual_status_interval_row_id=2,
                                business_date="2026-05-11",
                                employee_id="A-1001",
                                interval_start="09:00",
                                interval_end="09:30",
                                scheduled_minutes=30,
                                actual_productive_minutes=15,
                                late_minutes=15,
                                result_status="late",
                            )
                        ],
                    )
                )

    def test_forecast_schedule_rejects_mismatched_forecast_interval_dimensions(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison.db'}"
            _seed_comparison_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "forecast_interval_id FC-INT-001 does not match result dimensions",
            ):
                repository.create_comparison_run(
                    ComparisonRunRequest(
                        run_id="RUN-FS-MISMATCH-FC",
                        comparison_type="forecast_vs_schedule",
                        forecast_version_id="FC-20260511-V1",
                        schedule_version_id="SCH-20260511-V1",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        status="failed",
                        forecast_schedule_results=[
                            ForecastScheduleComparisonResultInput(
                                forecast_interval_id="FC-INT-001",
                                schedule_detail_id="DETAIL-A-1001-20260511",
                                business_date="2026-05-11",
                                workplace_id="SH-01",
                                project_id="BOSCH-CS",
                                skill_id="L1-CN",
                                interval_start="09:30",
                                interval_end="10:00",
                                forecast_agents=3,
                                scheduled_agents=1,
                                gap_agents=2,
                                result_status="gap",
                            )
                        ],
                    )
                )

    def test_schedule_actual_rejects_mismatched_status_interval_dimensions(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison.db'}"
            _seed_comparison_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "actual_status_interval_row_id 1 does not match result dimensions",
            ):
                repository.create_comparison_run(
                    ComparisonRunRequest(
                        run_id="RUN-SA-MISMATCH-ACTUAL",
                        comparison_type="schedule_vs_actual",
                        schedule_version_id="SCH-20260511-V1",
                        actual_import_version_id="IMPORT-STATUS-20260511",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        status="failed",
                        schedule_actual_results=[
                            ScheduleActualComparisonResultInput(
                                schedule_detail_id="DETAIL-A-1001-20260511",
                                actual_status_interval_row_id=1,
                                business_date="2026-05-11",
                                employee_id="A-1001",
                                interval_start="09:30",
                                interval_end="10:00",
                                scheduled_minutes=30,
                                actual_productive_minutes=15,
                                late_minutes=15,
                                result_status="late",
                            )
                        ],
                    )
                )


def _seed_comparison_sources(database_url: str) -> None:
    _seed_import_versions(database_url)
    _seed_master_data(database_url)
    _seed_forecast_version(database_url)
    _seed_schedule_versions(database_url)
    _seed_actual_status_intervals(database_url)


def _seed_import_versions(database_url: str) -> None:
    repository = ImportPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id="BATCH-DB007-20260511",
            file_name="db007_sources.csv",
            file_type="master_data",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="DB007",
                    raw_data={"scope": "comparison"},
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-FC-20260511",
                    version_type="demand_forecast",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
                ImportBatchVersionInput(
                    version_id="IMPORT-SCH-20260511",
                    version_type="personnel_schedule",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
                ImportBatchVersionInput(
                    version_id="IMPORT-LOGIN-20260511",
                    version_type="login_log",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
                ImportBatchVersionInput(
                    version_id="IMPORT-STATUS-20260511",
                    version_type="status_log",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
                ImportBatchVersionInput(
                    version_id="IMPORT-STATUS-OTHER",
                    version_type="status_log",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
            ],
        )
    )


def _seed_master_data(database_url: str) -> None:
    repository = MasterDataPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id="BATCH-DB007-20260511",
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
                ),
                EmployeeMasterDataInput(
                    employee_id="A-1002",
                    employee_name="李四",
                    status="active",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                ),
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
                ),
                EmployeeBindingInput(
                    binding_id="BIND-A-1002",
                    employee_id="A-1002",
                    supplier_id="SUP-A",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    effective_from="2026-05-01",
                    effective_to="2026-12-31",
                ),
            ],
        )
    )


def _seed_forecast_version(database_url: str) -> None:
    repository = ForecastPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_forecast_version(
        ForecastVersionRequest(
            forecast_version_id="FC-20260511-V1",
            import_version_id="IMPORT-FC-20260511",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            intervals=[
                ForecastIntervalInput(
                    forecast_interval_id="FC-INT-001",
                    forecast_date="2026-05-11",
                    interval_start="09:00",
                    interval_end="09:30",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    demand_level="L1",
                    required_agents=3,
                )
            ],
        )
    )


def _seed_schedule_versions(database_url: str) -> None:
    repository = PersonnelSchedulePersistenceRepository(database_url)
    repository.init_schema()
    shift_type = ShiftTypeInput(
        shift_type_id="MORNING-1H",
        shift_type_name="早班",
        status="active",
        start_time="09:00",
        end_time="10:00",
        effective_from="2026-05-01",
        effective_to="2026-12-31",
    )
    repository.create_schedule_version(
        PersonnelScheduleVersionRequest(
            schedule_version_id="SCH-20260511-V1",
            import_version_id="IMPORT-SCH-20260511",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            shift_types=[shift_type],
            details=[
                PersonnelScheduleDetailInput(
                    schedule_detail_id="DETAIL-A-1001-20260511",
                    employee_id="A-1001",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    shift_type_id="MORNING-1H",
                    schedule_date="2026-05-11",
                    start_time="09:00",
                    end_time="10:00",
                )
            ],
        )
    )
    repository.create_schedule_version(
        PersonnelScheduleVersionRequest(
            schedule_version_id="SCH-20260511-V2",
            import_version_id="IMPORT-SCH-20260511",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            shift_types=[shift_type],
            details=[
                PersonnelScheduleDetailInput(
                    schedule_detail_id="DETAIL-A-1002-20260511",
                    employee_id="A-1002",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    shift_type_id="MORNING-1H",
                    schedule_date="2026-05-11",
                    start_time="09:00",
                    end_time="10:00",
                )
            ],
        )
    )


def _seed_actual_status_intervals(database_url: str) -> None:
    repository = ActualLogPersistenceRepository(database_url)
    repository.init_schema()
    repository.upsert_status_dictionary(
        [
            ActualStatusDictionaryInput(
                external_status_code="READY",
                normalized_status="ready",
                category="available",
                is_productive=True,
            )
        ]
    )
    repository.create_status_intervals(
        ActualStatusIntervalImportRequest(
            import_version_id="IMPORT-STATUS-20260511",
            intervals=[
                ActualStatusIntervalInput(
                    interval_id="STATUS-001",
                    employee_id="A-1001",
                    external_status_code="READY",
                    start_at="2026-05-11T09:00:00",
                    end_at="2026-05-11T09:30:00",
                    timezone="Asia/Shanghai",
                )
            ],
        )
    )
    repository.create_status_intervals(
        ActualStatusIntervalImportRequest(
            import_version_id="IMPORT-STATUS-OTHER",
            intervals=[
                ActualStatusIntervalInput(
                    interval_id="STATUS-OTHER",
                    employee_id="A-1001",
                    external_status_code="READY",
                    start_at="2026-05-11T09:00:00",
                    end_at="2026-05-11T09:30:00",
                    timezone="Asia/Shanghai",
                )
            ],
        )
    )


if __name__ == "__main__":
    unittest.main()
