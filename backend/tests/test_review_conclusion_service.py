import tempfile
import unittest
from pathlib import Path

from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewConclusionInput,
)
from backend.app.review_conclusion import write_review_conclusion
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ReviewConclusionServiceTest(unittest.TestCase):
    def test_write_review_conclusion_adds_conclusion_to_open_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-conclusion.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-CONCLUSION-OPEN",
                    source_result_type="schedule_actual",
                    source_result_id=source_ids["schedule_actual"],
                    business_date="2026-05-11",
                    owner_id="supervisor-02",
                    severity="medium",
                    status="open",
                )
            )

            detail = write_review_conclusion(
                "CASE-CONCLUSION-OPEN",
                ReviewConclusionInput(
                    conclusion_id="CON-CONCLUSION-OPEN-001",
                    case_id="CASE-CONCLUSION-OPEN",
                    conclusion_type="confirmed_gap",
                    risk_level="medium",
                    conclusion_text="确认排班与实际状态存在差异。",
                    decided_by="ops-lead-02",
                ),
                repository,
            )

        self.assertEqual(detail.case.case_id, "CASE-CONCLUSION-OPEN")
        self.assertEqual(len(detail.conclusions), 1)
        self.assertEqual(detail.conclusions[0].conclusion_id, "CON-CONCLUSION-OPEN-001")
        self.assertIsNone(detail.closure)

    def test_write_review_conclusion_rejects_case_id_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-conclusion.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-CONCLUSION-MATCH",
                    source_result_type="forecast_schedule",
                    source_result_id=source_ids["forecast_schedule"],
                    business_date="2026-05-11",
                    owner_id="supervisor-01",
                    severity="high",
                    status="open",
                )
            )

            with self.assertRaisesRegex(ValueError, "case_id mismatch"):
                write_review_conclusion(
                    "CASE-CONCLUSION-MATCH",
                    ReviewConclusionInput(
                        conclusion_id="CON-CONCLUSION-MISMATCH-001",
                        case_id="CASE-OTHER",
                        conclusion_type="confirmed_gap",
                        risk_level="high",
                        conclusion_text="错误案例号。",
                        decided_by="ops-lead-01",
                    ),
                    repository,
                )

    def test_write_review_conclusion_rejects_closed_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-conclusion.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-CONCLUSION-CLOSED",
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
                    closure_id="CLO-CONCLUSION-CLOSED",
                    case_id="CASE-CONCLUSION-CLOSED",
                    closure_status="closed",
                    closed_by="ops-lead-02",
                    closure_note="已关闭",
                )
            )

            with self.assertRaisesRegex(ValueError, "already closed"):
                write_review_conclusion(
                    "CASE-CONCLUSION-CLOSED",
                    ReviewConclusionInput(
                        conclusion_id="CON-CONCLUSION-CLOSED-001",
                        case_id="CASE-CONCLUSION-CLOSED",
                        conclusion_type="confirmed_gap",
                        risk_level="medium",
                        conclusion_text="关闭后补结论。",
                        decided_by="ops-lead-02",
                    ),
                    repository,
                )


if __name__ == "__main__":
    unittest.main()
