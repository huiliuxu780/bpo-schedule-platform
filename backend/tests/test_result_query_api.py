import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.main import app, get_comparison_run_api, get_review_case_api
from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewConclusionInput,
    ReviewEvidenceInput,
)
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ResultQueryApiTest(unittest.TestCase):
    def test_get_comparison_run_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/comparison-runs/{run_id}", "GET"), routes)

    def test_get_comparison_run_api_returns_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-query.db'}"
            _seed_review_sources(database_url)
            repository = ComparisonPersistenceRepository(database_url)

            with patch(
                "backend.app.main.ComparisonPersistenceRepository",
                return_value=repository,
            ):
                detail = get_comparison_run_api("RUN-DB008-FS")

        self.assertEqual(detail.run.run_id, "RUN-DB008-FS")
        self.assertEqual(detail.run.comparison_type, "forecast_vs_schedule")
        self.assertEqual(detail.forecast_schedule_results[0].result_status, "gap")

    def test_get_comparison_run_api_returns_404_for_missing_run(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-query.db'}"
            repository = ComparisonPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.ComparisonPersistenceRepository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    get_comparison_run_api("RUN-MISSING")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "COMPARISON_RUN_NOT_FOUND",
        )

    def test_get_review_case_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/review-cases/{case_id}", "GET"), routes)

    def test_get_review_case_api_returns_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-query.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-QUERY-001",
                    source_result_type="forecast_schedule",
                    source_result_id=source_ids["forecast_schedule"],
                    business_date="2026-05-11",
                    owner_id="supervisor-01",
                    severity="high",
                    status="open",
                )
            )
            repository.add_evidence(
                ReviewEvidenceInput(
                    evidence_id="EVD-QUERY-001",
                    case_id="CASE-QUERY-001",
                    evidence_type="note",
                    evidence_uri="local://review/CASE-QUERY-001/note",
                    submitted_by="supervisor-01",
                    note="复核说明",
                )
            )
            repository.add_conclusion(
                ReviewConclusionInput(
                    conclusion_id="CON-QUERY-001",
                    case_id="CASE-QUERY-001",
                    conclusion_type="confirmed_gap",
                    risk_level="high",
                    conclusion_text="确认预测与排班缺口。",
                    decided_by="ops-lead-01",
                )
            )
            repository.close_case(
                ReviewClosureInput(
                    closure_id="CLO-QUERY-001",
                    case_id="CASE-QUERY-001",
                    closure_status="closed",
                    closed_by="ops-lead-01",
                    closure_note="已记录复核结论。",
                )
            )

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                detail = get_review_case_api("CASE-QUERY-001")

        self.assertEqual(detail.case.case_id, "CASE-QUERY-001")
        self.assertEqual(detail.evidence[0].evidence_id, "EVD-QUERY-001")
        self.assertEqual(detail.conclusions[0].risk_level, "high")
        self.assertEqual(detail.closure.closure_id, "CLO-QUERY-001")
        self.assertIsNotNone(detail.source_result)
        self.assertEqual(detail.source_result.source_result_type, "forecast_schedule")
        self.assertEqual(detail.source_result.result_id, source_ids["forecast_schedule"])
        self.assertEqual(detail.source_result.run_id, "RUN-DB008-FS")
        self.assertEqual(detail.source_result.business_date, "2026-05-11")
        self.assertEqual(detail.source_result.interval_start, "09:00")
        self.assertEqual(detail.source_result.interval_end, "09:30")
        self.assertEqual(detail.source_result.workplace_id, "SH-01")
        self.assertEqual(detail.source_result.project_id, "BOSCH-CS")
        self.assertEqual(detail.source_result.skill_id, "L1-CN")
        self.assertEqual(detail.source_result.forecast_agents, 3)
        self.assertEqual(detail.source_result.scheduled_agents, 1)
        self.assertEqual(detail.source_result.gap_agents, 2)
        self.assertEqual(detail.source_result.result_status, "gap")

    def test_get_review_case_api_returns_schedule_actual_source_context(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-query.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-QUERY-SA-001",
                    source_result_type="schedule_actual",
                    source_result_id=source_ids["schedule_actual"],
                    business_date="2026-05-11",
                    owner_id="supervisor-02",
                    severity="medium",
                    status="open",
                )
            )

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                detail = get_review_case_api("CASE-QUERY-SA-001")

        self.assertIsNotNone(detail.source_result)
        self.assertEqual(detail.source_result.source_result_type, "schedule_actual")
        self.assertEqual(detail.source_result.result_id, source_ids["schedule_actual"])
        self.assertEqual(detail.source_result.run_id, "RUN-DB008-SA")
        self.assertEqual(detail.source_result.business_date, "2026-05-11")
        self.assertEqual(detail.source_result.interval_start, "09:00")
        self.assertEqual(detail.source_result.interval_end, "09:30")
        self.assertEqual(detail.source_result.employee_id, "A-1001")
        self.assertEqual(detail.source_result.scheduled_minutes, 30)
        self.assertEqual(detail.source_result.actual_productive_minutes, 15)
        self.assertEqual(detail.source_result.late_minutes, 15)
        self.assertEqual(detail.source_result.result_status, "late")

    def test_get_review_case_api_returns_404_for_missing_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'result-query.db'}"
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as raised:
                    get_review_case_api("CASE-MISSING")

        self.assertEqual(raised.exception.status_code, 404)
        self.assertEqual(
            raised.exception.detail["error"]["code"],
            "REVIEW_CASE_NOT_FOUND",
        )


if __name__ == "__main__":
    unittest.main()
