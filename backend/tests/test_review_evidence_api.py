import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.main import app, write_review_evidence_api
from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewEvidenceInput,
)
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ReviewEvidenceApiTest(unittest.TestCase):
    def test_write_review_evidence_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/review-cases/{case_id}/evidence", "POST"), routes)

    def test_write_review_evidence_api_returns_updated_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-evidence.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-EVIDENCE-API-OPEN",
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
                detail = write_review_evidence_api(
                    "CASE-EVIDENCE-API-OPEN",
                    ReviewEvidenceInput(
                        evidence_id="EVD-EVIDENCE-API-001",
                        case_id="CASE-EVIDENCE-API-OPEN",
                        evidence_type="status_log",
                        evidence_uri="local://review/CASE-EVIDENCE-API-OPEN/status-log",
                        submitted_by="supervisor-01",
                        note="补充状态日志证据",
                    ),
                )

        self.assertEqual(detail.case.case_id, "CASE-EVIDENCE-API-OPEN")
        self.assertEqual(len(detail.evidence), 1)
        self.assertEqual(detail.evidence[0].evidence_id, "EVD-EVIDENCE-API-001")

    def test_write_review_evidence_api_rejects_closed_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-evidence.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-EVIDENCE-API-CLOSED",
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
                    closure_id="CLO-EVIDENCE-API-CLOSED",
                    case_id="CASE-EVIDENCE-API-CLOSED",
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
                    write_review_evidence_api(
                        "CASE-EVIDENCE-API-CLOSED",
                        ReviewEvidenceInput(
                            evidence_id="EVD-EVIDENCE-API-CLOSED-001",
                            case_id="CASE-EVIDENCE-API-CLOSED",
                            evidence_type="note",
                            evidence_uri="local://review/CASE-EVIDENCE-API-CLOSED/note",
                            submitted_by="supervisor-02",
                            note="关闭后补证据",
                        ),
                    )

        self.assertEqual(context.exception.status_code, 400)
        self.assertEqual(context.exception.detail["error"]["code"], "REVIEW_EVIDENCE_INVALID")


if __name__ == "__main__":
    unittest.main()
