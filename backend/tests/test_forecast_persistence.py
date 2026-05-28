import tempfile
import unittest
from pathlib import Path

from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    ForecastIntervalInput,
    ForecastVersionRequest,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
)


class ForecastPersistenceTest(unittest.TestCase):
    def test_forecast_intervals_and_change_record_survive_new_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'forecast.db'}"
            _seed_import_and_master_data(database_url)
            writer = ForecastPersistenceRepository(database_url)
            writer.init_schema()

            writer.create_forecast_version(
                ForecastVersionRequest(
                    forecast_version_id="FC-20260511-V2",
                    import_version_id="IMPORT-FC-20260511",
                    compared_from_version_id="FC-20260511-V1",
                    change_reason="客户更新峰值需求",
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
                            required_agents=12,
                        ),
                        ForecastIntervalInput(
                            forecast_interval_id="FC-INT-002",
                            forecast_date="2026-05-11",
                            interval_start="09:30",
                            interval_end="10:00",
                            workplace_id="SH-01",
                            project_id="BOSCH-CS",
                            skill_id="L1-CN",
                            demand_level="L1",
                            required_agents=14,
                        ),
                    ],
                )
            )

            reader = ForecastPersistenceRepository(database_url)
            loaded = reader.get_forecast_version("FC-20260511-V2")

            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.version.forecast_version_id, "FC-20260511-V2")
            self.assertEqual(loaded.version.total_required_agents, 26)
            self.assertEqual([row.required_agents for row in loaded.intervals], [12, 14])
            self.assertEqual(loaded.changes[0].compared_from_version_id, "FC-20260511-V1")
            self.assertEqual(loaded.changes[0].change_reason, "客户更新峰值需求")

    def test_forecast_rejects_frozen_skill_reference(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'forecast.db'}"
            _seed_import_and_master_data(database_url, skill_status="frozen")
            repository = ForecastPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "skill_id L1-CN is frozen"):
                repository.create_forecast_version(
                    ForecastVersionRequest(
                        forecast_version_id="FC-20260511-FROZEN",
                        import_version_id="IMPORT-FC-20260511",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        intervals=[
                            ForecastIntervalInput(
                                forecast_interval_id="FC-INT-FROZEN",
                                forecast_date="2026-05-11",
                                interval_start="09:00",
                                interval_end="09:30",
                                workplace_id="SH-01",
                                project_id="BOSCH-CS",
                                skill_id="L1-CN",
                                demand_level="L1",
                                required_agents=12,
                            )
                        ],
                    )
                )

    def test_forecast_rejects_non_half_hour_interval(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'forecast.db'}"
            _seed_import_and_master_data(database_url)
            repository = ForecastPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(ValueError, "forecast interval must be exactly 30 minutes"):
                repository.create_forecast_version(
                    ForecastVersionRequest(
                        forecast_version_id="FC-20260511-BAD",
                        import_version_id="IMPORT-FC-20260511",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                        intervals=[
                            ForecastIntervalInput(
                                forecast_interval_id="FC-INT-BAD",
                                forecast_date="2026-05-11",
                                interval_start="09:00",
                                interval_end="10:00",
                                workplace_id="SH-01",
                                project_id="BOSCH-CS",
                                skill_id="L1-CN",
                                demand_level="L1",
                                required_agents=12,
                            )
                        ],
                    )
                )


def _seed_import_and_master_data(database_url: str, skill_status: str = "active") -> None:
    import_repository = ImportPersistenceRepository(database_url)
    import_repository.init_schema()
    import_repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id="BATCH-FC-20260511",
            file_name="demand_forecast_20260511.csv",
            file_type="demand_forecast",
            uploaded_by="数据管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="SH-01|BOSCH-CS|09:00",
                    raw_data={"required_agents": 12},
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-FC-20260511",
                    version_type="demand_forecast",
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
            batch_id="BATCH-FC-20260511",
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
                    status=skill_status,
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
        )
    )


if __name__ == "__main__":
    unittest.main()
