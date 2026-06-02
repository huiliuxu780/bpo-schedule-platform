import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.main import app, write_review_conclusion_api
from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewConclusionInput,
)
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ReviewConclusionApiTest(unittest.TestCase):
    def test_write_review_conclusion_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/review-cases/{case_id}/conclusion", "POST"), routes)

    def test_write_review_conclusion_api_returns_updated_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-conclusion.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-CONCLUSION-API-OPEN",
                    source_result_type="forecast_schedule",
                    source_result_id=source_ids["forecast_schedule"],
                    business_date="2026-05-11",
                    owner_id="supervisor-01",
                    severity="high",
                    status="open",
                )
            )

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                detail = write_review_conclusion_api(
                    "CASE-CONCLUSION-API-OPEN",
                    ReviewConclusionInput(
                        conclusion_id="CON-CONCLUSION-API-001",
                        case_id="CASE-CONCLUSION-API-OPEN",
                        conclusion_type="confirmed_gap",
                        risk_level="high",
                        conclusion_text="确认预测和排班存在缺口。",
                        decided_by="ops-lead-01",
                    ),
                )

        self.assertEqual(detail.case.case_id, "CASE-CONCLUSION-API-OPEN")
        self.assertEqual(len(detail.conclusions), 1)
        self.assertEqual(detail.conclusions[0].conclusion_id, "CON-CONCLUSION-API-001")

    def test_write_review_conclusion_api_rejects_closed_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-conclusion.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-CONCLUSION-API-CLOSED",
                    source_result_type="schedule_actual",
                    source_result_id=source_ids["schedule_actual"],
                    business_date="2026-05-11",
                    owner_id="supervisor-02",
                    severity="medium",
                    status="open",
                )
            )
            repository.close_case(
                ReviewClosureInput(
                    closure_id="CLO-CONCLUSION-API-CLOSED",
                    case_id="CASE-CONCLUSION-API-CLOSED",
                    closure_status="closed",
                    closed_by="ops-lead-02",
                    closure_note="已关闭",
                )
            )

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                with self.assertRaises(HTTPException) as context:
                    write_review_conclusion_api(
                        "CASE-CONCLUSION-API-CLOSED",
                        ReviewConclusionInput(
                            conclusion_id="CON-CONCLUSION-API-CLOSED-001",
                            case_id="CASE-CONCLUSION-API-CLOSED",
                            conclusion_type="confirmed_gap",
                            risk_level="medium",
                            conclusion_text="关闭后补结论。",
                            decided_by="ops-lead-02",
                        ),
                    )

        self.assertEqual(context.exception.status_code, 400)
        self.assertEqual(
            context.exception.detail["error"]["code"],
            "REVIEW_CONCLUSION_INVALID",
        )


if __name__ == "__main__":
    unittest.main()
