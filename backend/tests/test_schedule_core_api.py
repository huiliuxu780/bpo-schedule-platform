"""API-level tests for the schedule core endpoints (route registration + HTTP mapping)."""

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.main import (
    app,
    get_schedule_period_matrix,
    revise_shift_definition,
    update_employee_restrictions,
    update_schedule_period_matrix_batch,
)
from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeRestrictionsUpdateRequest,
    MatrixCellChange,
    MatrixSegment,
    ScheduleMatrixBatchUpdateRequest,
    ShiftActivitySegment,
    ShiftDefinitionCreateRequest,
)
from backend.app.schedule_period import (
    ScheduleMatrixCellEntity,
    SchedulePeriodEntity,
    SchedulePeriodRepository,
    build_period_weeks,
)

NOW = "2026-06-01T00:00:00+00:00"
PERIOD_ID = "PERIOD-2026-07"


def _seed(database_url: str) -> SchedulePeriodRepository:
    repository = SchedulePeriodRepository(database_url)
    repository.init_schema()
    period = SchedulePeriodEntity(
        period_id=PERIOD_ID,
        month="2026-07",
        status="draft",
        date_from="2026-07-01",
        date_to="2026-07-07",
        version=0,
        weeks_json=[
            week.model_dump() for week in build_period_weeks("2026-07-01", "2026-07-07")
        ],
        created_at=NOW,
        updated_at=NOW,
    )
    cell = ScheduleMatrixCellEntity(
        period_id=PERIOD_ID,
        employee_id="E1",
        schedule_date="2026-07-01",
        segments_json=[
            MatrixSegment(start_time="09:00", end_time="12:00").model_dump()
        ],
        locked=False,
        updated_at=NOW,
    )
    repository.insert_period_with_cells(period, [cell])
    return repository


class ScheduleCoreApiTest(unittest.TestCase):
    def test_schedule_core_routes_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}
        for expected in (
            ("/api/v1/schedule-periods", "GET"),
            ("/api/v1/schedule-periods", "POST"),
            ("/api/v1/schedule-periods/{period_id}/matrix", "GET"),
            ("/api/v1/schedule-periods/{period_id}/matrix/batch", "PATCH"),
            ("/api/v1/schedule-periods/{period_id}/coverage/recalculate", "POST"),
            ("/api/v1/schedule-periods/{period_id}/validate", "POST"),
            ("/api/v1/schedule-periods/{period_id}/publish", "POST"),
            ("/api/v1/schedule-periods/{period_id}/versions", "GET"),
            ("/api/v1/schedule-periods/{period_id}/versions/{version_id}/diff", "GET"),
            ("/api/v1/shift-definitions", "GET"),
            ("/api/v1/shift-definitions", "POST"),
            ("/api/v1/shift-definitions/{shift_code}", "PUT"),
            ("/api/v1/rules/{category}", "GET"),
            ("/api/v1/rules/{category}", "PUT"),
            ("/api/v1/status-mappings", "GET"),
            ("/api/v1/status-mappings", "PUT"),
            ("/api/v1/master-data/employees/{employee_id}/restrictions", "PATCH"),
        ):
            self.assertIn(expected, routes)

    def test_matrix_route_maps_not_found_to_404(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'api-core.db'}"
            repository = _seed(database_url)
            with patch(
                "backend.app.main.SchedulePeriodRepository", return_value=repository
            ):
                with self.assertRaises(HTTPException) as raised:
                    get_schedule_period_matrix("PERIOD-MISSING")
                self.assertEqual(raised.exception.status_code, 404)
                self.assertEqual(
                    raised.exception.detail["error"]["code"],
                    "SCHEDULE_PERIOD_NOT_FOUND",
                )

                response = get_schedule_period_matrix(PERIOD_ID, week="W1")
                self.assertEqual(response.total, 1)

    def test_matrix_batch_route_returns_409_conflict_payload(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'api-conflict.db'}"
            repository = _seed(database_url)
            forecast_repository = ForecastPersistenceRepository(database_url)
            request = ScheduleMatrixBatchUpdateRequest(
                base_version=99,
                changes=[
                    MatrixCellChange(
                        employee_id="E1",
                        schedule_date="2026-07-02",
                        segments=[MatrixSegment(start_time="10:00", end_time="11:00")],
                    )
                ],
            )
            with patch(
                "backend.app.main.SchedulePeriodRepository", return_value=repository
            ), patch(
                "backend.app.main.ForecastPersistenceRepository",
                return_value=forecast_repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    update_schedule_period_matrix_batch(PERIOD_ID, request)
            error = raised.exception
            self.assertEqual(error.status_code, 409)
            detail = error.detail["error"]
            self.assertEqual(detail["code"], "SCHEDULE_MATRIX_VERSION_CONFLICT")
            self.assertEqual(detail["current_version"], 0)
            self.assertEqual(
                [
                    (conflict["employee_id"], conflict["reason"])
                    for conflict in detail["conflicts"]
                ],
                [("E1", "BASE_VERSION_STALE")],
            )

    def test_revise_shift_definition_rejects_code_mismatch(self) -> None:
        request = ShiftDefinitionCreateRequest(
            shift_code="SHIFT-B",
            shift_name="晚班",
            effective_from="2026-06-01",
            effective_to="2026-12-31",
            segments=[
                ShiftActivitySegment(activity_type="work", start_time="14:00", end_time="22:00")
            ],
        )
        with self.assertRaises(HTTPException) as raised:
            revise_shift_definition("SHIFT-A", request)
        self.assertEqual(raised.exception.status_code, 400)
        self.assertEqual(
            raised.exception.detail["error"]["code"], "SHIFT_CODE_MISMATCH"
        )

    def test_employee_restrictions_route_maps_missing_employee_to_404(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = (
                f"sqlite+pysqlite:///{Path(directory) / 'api-restrictions.db'}"
            )
            repository = MasterDataPersistenceRepository(database_url)
            repository.init_schema()
            with patch(
                "backend.app.main.MasterDataPersistenceRepository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    update_employee_restrictions(
                        "E-MISSING",
                        EmployeeRestrictionsUpdateRequest(night_shift_allowed=False),
                    )
                self.assertEqual(raised.exception.status_code, 404)
                self.assertEqual(
                    raised.exception.detail["error"]["code"], "EMPLOYEE_NOT_FOUND"
                )


if __name__ == "__main__":
    unittest.main()
