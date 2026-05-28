import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.app.main import app, write_review_closure_api
from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewClosureWriteRequest,
    ReviewConclusionInput,
    ReviewEvidenceInput,
)
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ReviewClosureApiTest(unittest.TestCase):
    def test_write_review_closure_route_is_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/review-cases/write-closure", "POST"), routes)

    def test_write_review_closure_api_returns_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-close.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            with patch(
                "backend.app.main.ReviewPersistenceRepository",
                return_value=repository,
            ):
                detail = write_review_closure_api(
                    ReviewClosureWriteRequest(
                        case=ReviewCaseCreateRequest(
                            case_id="CASE-WRITE-API-001",
                            source_result_type="schedule_actual",
                            source_result_id=source_ids["schedule_actual"],
                            business_date="2026-05-11",
                            owner_id="supervisor-02",
                            severity="medium",
                            status="open",
                        ),
                        evidence=[
                            ReviewEvidenceInput(
                                evidence_id="EVD-WRITE-API-001",
                                case_id="CASE-WRITE-API-001",
                                evidence_type="note",
                                evidence_uri="local://review/CASE-WRITE-API-001/note",
                                submitted_by="supervisor-02",
                                note="登录状态补充说明",
                            )
                        ],
                        conclusions=[
                            ReviewConclusionInput(
                                conclusion_id="CON-WRITE-API-001",
                                case_id="CASE-WRITE-API-001",
                                conclusion_type="confirmed_late",
                                risk_level="medium",
                                conclusion_text="确认存在迟到状态。",
                                decided_by="ops-lead-02",
                            )
                        ],
                        closure=ReviewClosureInput(
                            closure_id="CLO-WRITE-API-001",
                            case_id="CASE-WRITE-API-001",
                            closure_status="closed",
                            closed_by="ops-lead-02",
                            closure_note="已记录处理结论。",
                        ),
                    )
                )

        self.assertEqual(detail.case.case_id, "CASE-WRITE-API-001")
        self.assertEqual(detail.case.source_result_type, "schedule_actual")
        self.assertEqual(detail.evidence[0].evidence_id, "EVD-WRITE-API-001")
        self.assertEqual(detail.conclusions[0].conclusion_type, "confirmed_late")
        self.assertEqual(detail.closure.closure_id, "CLO-WRITE-API-001")


if __name__ == "__main__":
    unittest.main()
