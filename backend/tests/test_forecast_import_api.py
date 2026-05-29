import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.import_persistence import ImportPersistenceRepository
from backend.app.main import app, apply_forecast_import
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
)


class ForecastImportApiTest(unittest.TestCase):
    def test_apply_forecast_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/import-batches/{batch_id}/apply-forecast", "POST"), routes)

    def test_apply_forecast_import_returns_summary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'forecast-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_master_data(database_url, "BATCH-FC-APPLY-001")
            _create_forecast_batch(import_repository, "BATCH-FC-APPLY-001")
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
                response = apply_forecast_import(
                    "BATCH-FC-APPLY-001",
                    compared_from_version_id="FC-OLD",
                    change_reason="客户更新峰值需求",
                )

            self.assertEqual(response.batch_id, "BATCH-FC-APPLY-001")
            self.assertEqual(response.forecast_version_id, "BATCH-FC-APPLY-001::forecast")
            self.assertEqual(response.applied_status, "applied")
            self.assertEqual(response.intervals, 2)
            self.assertEqual(response.total_required_agents, 26)

    def test_apply_forecast_import_returns_already_applied_on_duplicate(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'forecast-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            _seed_master_data(database_url, "BATCH-FC-APPLY-002")
            _create_forecast_batch(import_repository, "BATCH-FC-APPLY-002")
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
                first_response = apply_forecast_import(
                    "BATCH-FC-APPLY-002",
                    compared_from_version_id="FC-OLD",
                    change_reason="客户更新峰值需求",
                )
                second_response = apply_forecast_import(
                    "BATCH-FC-APPLY-002",
                    compared_from_version_id="FC-OLD",
                    change_reason="客户更新峰值需求",
                )

        self.assertEqual(first_response.applied_status, "applied")
        self.assertEqual(second_response.applied_status, "already_applied")
        self.assertEqual(second_response.forecast_version_id, "BATCH-FC-APPLY-002::forecast")
        self.assertEqual(second_response.intervals, 2)
        self.assertEqual(second_response.total_required_agents, 26)

    def test_apply_forecast_import_returns_not_ready_for_row_field_gap(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'forecast-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()
            forecast_repository = ForecastPersistenceRepository(database_url)
            forecast_repository.init_schema()
            _create_forecast_batch_missing_required_agents(
                import_repository,
                "BATCH-FC-APPLY-NOT-READY",
            )

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
                    apply_forecast_import("BATCH-FC-APPLY-NOT-READY")

        self.assertEqual(raised.exception.status_code, 400)
        error = raised.exception.detail["error"]
        self.assertEqual(error["code"], "IMPORT_APPLY_NOT_READY")
        self.assertEqual(error["readiness"]["readiness_status"], "blocked")
        self.assertEqual(
            error["readiness"]["row_blockers"][0]["field_name"],
            "required_agents",
        )

    def test_apply_forecast_import_returns_404_for_missing_batch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            database_url = f"sqlite+pysqlite:///{Path(tmp_dir) / 'forecast-import.db'}"
            import_repository = ImportPersistenceRepository(database_url)
            import_repository.init_schema()

            with patch(
                "backend.app.main.get_import_persistence_repository",
                return_value=import_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    apply_forecast_import("missing")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(raised.exception.detail["error"]["code"], "IMPORT_BATCH_NOT_FOUND")


def _create_forecast_batch(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="demand_forecast.csv",
            file_type="demand_forecast",
            uploaded_by="计划管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                _row(1, "09:00", "09:30", "12"),
                _row(2, "09:30", "10:00", "14"),
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id="IMPORT-FC-APPLY-001",
                    version_type="demand_forecast",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
    )


def _create_forecast_batch_missing_required_agents(
    repository: ImportPersistenceRepository,
    batch_id: str,
) -> None:
    repository.create_import_batch(
        ImportBatchCreateRequest(
            batch_id=batch_id,
            file_name="demand_forecast.csv",
            file_type="demand_forecast",
            uploaded_by="计划管理员",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            rows=[
                ImportBatchRowResultInput(
                    row_number=1,
                    row_status="success",
                    source_key="SH-01|BOSCH-CS|L1-CN|2026-05-11|09:00",
                    raw_data={
                        "standard_fields": {
                            "forecast_date": "2026-05-11",
                            "interval_start": "09:00",
                            "interval_end": "09:30",
                            "workplace_id": "SH-01",
                            "project_id": "BOSCH-CS",
                            "skill_id": "L1-CN",
                            "demand_level": "L1",
                        }
                    },
                )
            ],
            versions=[
                ImportBatchVersionInput(
                    version_id=f"{batch_id}::demand_forecast",
                    version_type="demand_forecast",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
            ],
        )
    )


def _row(
    row_number: int,
    interval_start: str,
    interval_end: str,
    required_agents: str,
) -> ImportBatchRowResultInput:
    return ImportBatchRowResultInput(
        row_number=row_number,
        row_status="success",
        source_key=f"SH-01|BOSCH-CS|L1-CN|2026-05-11|{interval_start}",
        raw_data={
            "standard_fields": {
                "forecast_date": "2026-05-11",
                "interval_start": interval_start,
                "interval_end": interval_end,
                "workplace_id": "SH-01",
                "project_id": "BOSCH-CS",
                "skill_id": "L1-CN",
                "demand_level": "L1",
                "required_agents": required_agents,
            }
        },
    )


def _seed_master_data(database_url: str, batch_id: str) -> None:
    master_repository = MasterDataPersistenceRepository(database_url)
    master_repository.init_schema()
    master_repository.create_snapshot(
        MasterDataSnapshotRequest(
            batch_id=batch_id,
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
