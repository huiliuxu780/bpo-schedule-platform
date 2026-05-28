import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.main import app, list_comparison_runs_api, list_review_cases_api
from backend.app.models import ReviewCaseCreateRequest
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ResultListQueryApiTest(unittest.TestCase):
    def test_list_comparison_runs_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/comparison-runs", "GET"), routes)

    def test_list_comparison_runs_filters_by_type_status_and_business_date(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-list.db'}"
            _seed_review_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)

            filtered = repository.list_comparison_runs(
                comparison_type="forecast_vs_schedule",
                status="completed",
                business_date="2026-05-11",
            )
            empty = repository.list_comparison_runs(
                comparison_type="forecast_vs_schedule",
                business_date="2026-05-12",
            )

        self.assertEqual([run.run_id for run in filtered], ["RUN-DB008-FS"])
        self.assertEqual(empty, [])

    def test_list_comparison_runs_api_returns_filtered_items(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-list.db'}"
            _seed_review_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)

            with patch(
                "backend.app.main.ComparisonPersistenceRepository",
                return_value=repository,
            ):
                response = list_comparison_runs_api(comparison_type="schedule_vs_actual")

        self.assertEqual(len(response.items), 1)
        self.assertEqual(response.items[0].run_id, "RUN-DB008-SA")
        self.assertEqual(response.items[0].comparison_type, "schedule_vs_actual")

    def test_list_review_cases_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/review-cases", "GET"), routes)

    def test_list_review_cases_filters_by_owner_status_and_source(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-list.db'}"
            repository = _seed_review_cases(database_url)

            filtered = repository.list_review_cases(
                business_date="2026-05-11",
                owner_id="supervisor-01",
                status="open",
                severity="high",
                source_result_type="forecast_schedule",
            )
            empty = repository.list_review_cases(
                business_date="2026-05-11",
                owner_id="supervisor-01",
                status="closed",
            )

        self.assertEqual([case.case_id for case in filtered], ["CASE-LIST-001"])
        self.assertEqual(empty, [])

    def test_list_review_cases_api_returns_filtered_items(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-list.db'}"
            repository = _seed_review_cases(database_url)

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                response = list_review_cases_api(owner_id="supervisor-02")

        self.assertEqual(len(response.items), 1)
        self.assertEqual(response.items[0].case_id, "CASE-LIST-002")
        self.assertEqual(response.items[0].status, "closed")


def _seed_review_cases(database_url: str) -> ReviewPersistenceRepository:
    source_ids = _seed_review_sources(database_url)
    repository = ReviewPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_review_case(
        ReviewCaseCreateRequest(
            case_id="CASE-LIST-001",
            source_result_type="forecast_schedule",
            source_result_id=source_ids["forecast_schedule"],
            business_date="2026-05-11",
            owner_id="supervisor-01",
            severity="high",
            status="open",
        )
    )
    repository.create_review_case(
        ReviewCaseCreateRequest(
            case_id="CASE-LIST-002",
            source_result_type="schedule_actual",
            source_result_id=source_ids["schedule_actual"],
            business_date="2026-05-11",
            owner_id="supervisor-02",
            severity="medium",
            status="closed",
        )
    )
    return repository


if __name__ == "__main__":
    unittest.main()
