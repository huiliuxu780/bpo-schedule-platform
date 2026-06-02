import tempfile
import unittest
from pathlib import Path

from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewEvidenceInput,
)
from backend.app.review_evidence import write_review_evidence
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ReviewEvidenceServiceTest(unittest.TestCase):
    def test_write_review_evidence_adds_evidence_to_open_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-evidence.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-EVIDENCE-OPEN",
                    source_result_type="schedule_actual",
                    source_result_id=source_ids["schedule_actual"],
                    business_date="2026-05-11",
                    owner_id="supervisor-02",
                    severity="medium",
                    status="open",
                )
            )

            detail = write_review_evidence(
                "CASE-EVIDENCE-OPEN",
                ReviewEvidenceInput(
                    evidence_id="EVD-EVIDENCE-OPEN-001",
                    case_id="CASE-EVIDENCE-OPEN",
                    evidence_type="status_log",
                    evidence_uri="local://review/CASE-EVIDENCE-OPEN/status-log",
                    submitted_by="supervisor-02",
                    note="补充状态日志证据",
                ),
                repository,
            )

        self.assertEqual(detail.case.case_id, "CASE-EVIDENCE-OPEN")
        self.assertEqual(len(detail.evidence), 1)
        self.assertEqual(detail.evidence[0].evidence_id, "EVD-EVIDENCE-OPEN-001")
        self.assertIsNone(detail.closure)

    def test_write_review_evidence_rejects_case_id_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-evidence.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-EVIDENCE-MATCH",
                    source_result_type="forecast_schedule",
                    source_result_id=source_ids["forecast_schedule"],
                    business_date="2026-05-11",
                    owner_id="supervisor-01",
                    severity="high",
                    status="open",
                )
            )

            with self.assertRaisesRegex(ValueError, "case_id mismatch"):
                write_review_evidence(
                    "CASE-EVIDENCE-MATCH",
                    ReviewEvidenceInput(
                        evidence_id="EVD-EVIDENCE-MISMATCH-001",
                        case_id="CASE-OTHER",
                        evidence_type="note",
                        evidence_uri="local://review/CASE-OTHER/note",
                        submitted_by="supervisor-01",
                        note="错误案例号",
                    ),
                    repository,
                )

    def test_write_review_evidence_rejects_closed_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-evidence.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-EVIDENCE-CLOSED",
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
                    closure_id="CLO-EVIDENCE-CLOSED",
                    case_id="CASE-EVIDENCE-CLOSED",
                    closure_status="closed",
                    closed_by="ops-lead-02",
                    closure_note="已关闭",
                )
            )

            with self.assertRaisesRegex(ValueError, "already closed"):
                write_review_evidence(
                    "CASE-EVIDENCE-CLOSED",
                    ReviewEvidenceInput(
                        evidence_id="EVD-EVIDENCE-CLOSED-001",
                        case_id="CASE-EVIDENCE-CLOSED",
                        evidence_type="note",
                        evidence_uri="local://review/CASE-EVIDENCE-CLOSED/note",
                        submitted_by="supervisor-02",
                        note="关闭后补证据",
                    ),
                    repository,
                )


if __name__ == "__main__":
    unittest.main()
