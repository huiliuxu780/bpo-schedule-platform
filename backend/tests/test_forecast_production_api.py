import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, get_demand_forecast_production_detail
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


class ForecastProductionApiTest(unittest.TestCase):
    def test_demand_forecast_production_detail_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(
            ("/api/v1/demand-forecast/production/{batch_id}", "GET"),
            routes,
        )

    def test_get_demand_forecast_production_detail_returns_version_rows(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'forecast-production.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_import_and_master_data(database_url)
            forecast_repository = ForecastPersistenceRepository(database_url)
            forecast_repository.init_schema()
            _seed_forecast_version(forecast_repository)

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.ForecastPersistenceRepository",
                    return_value=forecast_repository,
                ),
            ):
                response = get_demand_forecast_production_detail("BATCH-FC-PROD-001")

        self.assertEqual(response.batch.batch_id, "BATCH-FC-PROD-001")
        self.assertEqual(response.batch.file_type, "demand_forecast")
        self.assertEqual(response.version.forecast_version_id, "FC-PROD-001")
        self.assertEqual(response.version.import_version_id, "IMPORT-FC-PROD-001")
        self.assertEqual(response.version.business_date_from, "2026-05-11")
        self.assertEqual(response.version.total_required_agents, 26)
        self.assertEqual(
            [interval.interval_start for interval in response.intervals],
            ["09:00", "09:30"],
        )
        self.assertEqual(response.intervals[0].workplace_id, "SH-01")
        self.assertEqual(response.intervals[0].project_id, "BOSCH-CS")
        self.assertEqual(response.intervals[0].skill_id, "L1-CN")
        self.assertEqual(response.changes[0].compared_from_version_id, "FC-PREV-001")
        self.assertEqual(response.changes[0].change_reason, "客户更新峰值需求")

    def test_get_demand_forecast_production_detail_returns_404_when_not_applied(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'forecast-production.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_import_and_master_data(database_url)
            forecast_repository = ForecastPersistenceRepository(database_url)
            forecast_repository.init_schema()

            with (
                patch(
                    "backend.app.main.get_import_persistence_repository",
                    return_value=import_repository,
                ),
                patch(
                    "backend.app.main.ForecastPersistenceRepository",
                    return_value=forecast_repository,
                ),
            ):
                with self.assertRaises(HTTPException) as raised:
                    get_demand_forecast_production_detail("BATCH-FC-PROD-001")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "DEMAND_FORECAST_VERSION_NOT_FOUND",
        )


def _seed_import_and_master_data(database_url: str) -> None:
    import_repository = ImportPersistenceRepository(database_url)
    import_repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id="BATCH-FC-PROD-001",
            file_name="demand_forecast_prod.csv",
            file_type="demand_forecast",
            uploaded_by="计划主管",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="SH-01|BOSCH-CS|L1-CN|09:00",
                    raw_data={"required_agents": 12},
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-FC-PROD-001",
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
            batch_id="BATCH-FC-PROD-001",
            workplaces=[
                _reference("SH-01", "上海职场"),
            ],
            projects=[
                _reference("BOSCH-CS", "博西客服"),
            ],
            skills=[
                _reference("L1-CN", "中文一线"),
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


def _seed_forecast_version(repository: ForecastPersistenceRepository) -> None:
    repository.create_forecast_version(
        ForecastVersionRequest(
            forecast_version_id="FC-PROD-001",
            import_version_id="IMPORT-FC-PROD-001",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            compared_from_version_id="FC-PREV-001",
            change_reason="客户更新峰值需求",
            intervals=[
                ForecastIntervalInput(
                    forecast_interval_id="FC-PROD-INT-001",
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
                    forecast_interval_id="FC-PROD-INT-002",
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
