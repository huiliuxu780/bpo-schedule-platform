import tempfile
import unittest
from pathlib import Path

from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewClosureWriteRequest,
    ReviewConclusionInput,
    ReviewEvidenceInput,
)
from backend.app.review_closure import write_review_closure
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class ReviewClosureServiceTest(unittest.TestCase):
    def test_write_review_closure_persists_full_case_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-close.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            detail = write_review_closure(
                ReviewClosureWriteRequest(
                    case=ReviewCaseCreateRequest(
                        case_id="CASE-WRITE-FS-001",
                        source_result_type="forecast_schedule",
                        source_result_id=source_ids["forecast_schedule"],
                        business_date="2026-05-11",
                        owner_id="supervisor-01",
                        severity="high",
                        status="open",
                    ),
                    evidence=[
                        ReviewEvidenceInput(
                            evidence_id="EVD-WRITE-001",
                            case_id="CASE-WRITE-FS-001",
                            evidence_type="screenshot",
                            evidence_uri="local://review/CASE-WRITE-FS-001/screenshot",
                            submitted_by="supervisor-01",
                            note="复核截图",
                        )
                    ],
                    conclusions=[
                        ReviewConclusionInput(
                            conclusion_id="CON-WRITE-001",
                            case_id="CASE-WRITE-FS-001",
                            conclusion_type="confirmed_gap",
                            risk_level="high",
                            conclusion_text="确认 09:00 存在人力缺口。",
                            decided_by="ops-lead-01",
                        )
                    ],
                    closure=ReviewClosureInput(
                        closure_id="CLO-WRITE-001",
                        case_id="CASE-WRITE-FS-001",
                        closure_status="closed",
                        closed_by="ops-lead-01",
                        closure_note="复核完成并关闭。",
                    ),
                ),
                repository,
            )

            self.assertEqual(detail.case.case_id, "CASE-WRITE-FS-001")
            self.assertEqual(detail.evidence[0].evidence_id, "EVD-WRITE-001")
            self.assertEqual(detail.conclusions[0].risk_level, "high")
            self.assertEqual(detail.closure.closure_status, "closed")

            loaded = repository.get_review_case("CASE-WRITE-FS-001")
            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.closure.closure_id, "CLO-WRITE-001")

    def test_write_review_closure_rejects_missing_source_result(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-close.db'}"
            _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "forecast_schedule source_result_id 9999 does not exist",
            ):
                write_review_closure(
                    ReviewClosureWriteRequest(
                        case=ReviewCaseCreateRequest(
                            case_id="CASE-WRITE-MISSING",
                            source_result_type="forecast_schedule",
                            source_result_id=9999,
                            business_date="2026-05-11",
                            owner_id="supervisor-01",
                            severity="high",
                            status="open",
                        )
                    ),
                    repository,
                )


if __name__ == "__main__":
    unittest.main()
