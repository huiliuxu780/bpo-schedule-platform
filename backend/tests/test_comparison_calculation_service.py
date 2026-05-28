import tempfile
import unittest
from pathlib import Path

from backend.app.actual_log_persistence import ActualLogPersistenceRepository
from backend.app.comparison_calculation import calculate_comparison_run
from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.forecast_persistence import ForecastPersistenceRepository
from backend.app.models import ComparisonCalculationRequest
from backend.app.personnel_schedule_persistence import (
    PersonnelSchedulePersistenceRepository,
)
from backend.tests.test_comparison_persistence import _seed_comparison_sources


class ComparisonCalculationServiceTest(unittest.TestCase):
    def test_forecast_vs_schedule_calculation_writes_gap_results(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison-calc.db'}"
            _seed_comparison_sources(database_url)

            detail = calculate_comparison_run(
                ComparisonCalculationRequest(
                    run_id="CALC-FS-20260511",
                    comparison_type="forecast_vs_schedule",
                    forecast_version_id="FC-20260511-V1",
                    schedule_version_id="SCH-20260511-V1",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
                comparison_repository=ComparisonPersistenceRepository(database_url),
                forecast_repository=ForecastPersistenceRepository(database_url),
                schedule_repository=PersonnelSchedulePersistenceRepository(database_url),
                actual_repository=ActualLogPersistenceRepository(database_url),
            )

            self.assertEqual(detail.run.run_id, "CALC-FS-20260511")
            self.assertEqual(detail.run.comparison_type, "forecast_vs_schedule")
            self.assertEqual(detail.run.total_results, 1)
            self.assertEqual(detail.run.total_gap_agents, 2)
            self.assertEqual(detail.forecast_schedule_results[0].forecast_agents, 3)
            self.assertEqual(detail.forecast_schedule_results[0].scheduled_agents, 1)
            self.assertEqual(detail.forecast_schedule_results[0].gap_agents, 2)
            self.assertEqual(detail.forecast_schedule_results[0].result_status, "gap")

    def test_schedule_vs_actual_calculation_writes_late_results(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison-calc.db'}"
            _seed_comparison_sources(database_url)

            detail = calculate_comparison_run(
                ComparisonCalculationRequest(
                    run_id="CALC-SA-20260511",
                    comparison_type="schedule_vs_actual",
                    schedule_version_id="SCH-20260511-V1",
                    actual_import_version_id="IMPORT-STATUS-20260511",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                ),
                comparison_repository=ComparisonPersistenceRepository(database_url),
                forecast_repository=ForecastPersistenceRepository(database_url),
                schedule_repository=PersonnelSchedulePersistenceRepository(database_url),
                actual_repository=ActualLogPersistenceRepository(database_url),
            )

            self.assertEqual(detail.run.run_id, "CALC-SA-20260511")
            self.assertEqual(detail.run.comparison_type, "schedule_vs_actual")
            self.assertEqual(detail.run.total_results, 2)
            self.assertEqual(detail.run.total_late_minutes, 30)
            self.assertEqual(
                [result.result_status for result in detail.schedule_actual_results],
                ["matched", "late"],
            )
            self.assertEqual(
                [result.late_minutes for result in detail.schedule_actual_results],
                [0, 30],
            )

    def test_missing_forecast_version_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'comparison-calc.db'}"
            _seed_comparison_sources(database_url)

            with self.assertRaisesRegex(ValueError, "forecast_version_id missing"):
                calculate_comparison_run(
                    ComparisonCalculationRequest(
                        run_id="CALC-FS-MISSING",
                        comparison_type="forecast_vs_schedule",
                        forecast_version_id="missing",
                        schedule_version_id="SCH-20260511-V1",
                        business_date_from="2026-05-11",
                        business_date_to="2026-05-11",
                    ),
                    comparison_repository=ComparisonPersistenceRepository(database_url),
                    forecast_repository=ForecastPersistenceRepository(database_url),
                    schedule_repository=PersonnelSchedulePersistenceRepository(
                        database_url
                    ),
                    actual_repository=ActualLogPersistenceRepository(database_url),
                )


if __name__ == "__main__":
    unittest.main()
