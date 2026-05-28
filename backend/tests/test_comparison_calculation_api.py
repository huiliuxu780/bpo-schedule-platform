import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.main import app, calculate_comparison_run_api
from backend.app.models import ComparisonCalculationRequest
from backend.app.personnel_schedule_persistence import (
    PersonnelSchedulePersistenceRepository,
)
from backend.tests.test_comparison_persistence import _seed_comparison_sources


class ComparisonCalculationApiTest(unittest.TestCase):
    def test_calculate_comparison_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/comparison-runs/calculate", "POST"), routes)

    def test_calculate_comparison_run_api_returns_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison-calc.db'}"
            _seed_comparison_sources(database_url)

            with (
                patch(
                    "backend.app.main.ComparisonPersistenceRepository",
                    return_value=ComparisonPersistenceRepository(database_url),
                ),
                patch(
                    "backend.app.main.ForecastPersistenceRepository",
                    return_value=ForecastPersistenceRepository(database_url),
                ),
                patch(
                    "backend.app.main.PersonnelSchedulePersistenceRepository",
                    return_value=PersonnelSchedulePersistenceRepository(database_url),
                ),
                patch(
                    "backend.app.main.ActualLogPersistenceRepository",
                    return_value=ActualLogPersistenceRepository(database_url),
                ),
            ):
                response = calculate_comparison_run_api(
                    ComparisonCalculationRequest(
                        run_id="CALC-FS-API-20260511",
                        comparison_type="forecast_vs_schedule",
                        forecast_version_id="FC-20260511-V1",
                        schedule_version_id="SCH-20260511-V1",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                    )
                )

        self.assertEqual(response.run.run_id, "CALC-FS-API-20260511")
        self.assertEqual(response.run.total_gap_agents, 2)
        self.assertEqual(len(response.forecast_schedule_results), 1)

    def test_calculate_comparison_run_api_returns_existing_run_on_duplicate_request(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison-calc.db'}"
            _seed_comparison_sources(database_url)

            with (
                patch(
                    "backend.app.main.ComparisonPersistenceRepository",
                    return_value=ComparisonPersistenceRepository(database_url),
                ),
                patch(
                    "backend.app.main.ForecastPersistenceRepository",
                    return_value=ForecastPersistenceRepository(database_url),
                ),
                patch(
                    "backend.app.main.PersonnelSchedulePersistenceRepository",
                    return_value=PersonnelSchedulePersistenceRepository(database_url),
                ),
                patch(
                    "backend.app.main.ActualLogPersistenceRepository",
                    return_value=ActualLogPersistenceRepository(database_url),
                ),
            ):
                request = ComparisonCalculationRequest(
                    run_id="CALC-FS-API-IDEMPOTENT",
                    comparison_type="forecast_vs_schedule",
                    forecast_version_id="FC-20260511-V1",
                    schedule_version_id="SCH-20260511-V1",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                )
                first = calculate_comparison_run_api(request)
                second = calculate_comparison_run_api(request)

        self.assertEqual(second.run.run_id, first.run.run_id)
        self.assertEqual(second.run.created_at, first.run.created_at)
        self.assertEqual(len(second.forecast_schedule_results), 1)


if __name__ == "__main__":
    unittest.main()
