import tempfile
import unittest
from pathlib import Path

from backend.app.review_demo_seed import seed_review_case_demo
from backend.app.review_persistence import ReviewPersistenceRepository


class ReviewDemoSeedTest(unittest.TestCase):
    def test_seed_review_case_demo_creates_case_detail(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-demo.db'}"

            detail = seed_review_case_demo(database_url)
            stored = ReviewPersistenceRepository(database_url).get_review_case(
                "CASE-QUERY-001"
            )

        self.assertEqual(detail.case.case_id, "CASE-QUERY-001")
        self.assertEqual(detail.case.source_result_type, "forecast_schedule")
        self.assertEqual(detail.case.business_date, "2026-05-11")
        self.assertEqual(detail.evidence[0].evidence_id, "EVD-QUERY-001")
        self.assertEqual(detail.conclusions[0].conclusion_id, "CON-QUERY-001")
        self.assertIsNotNone(stored)
        self.assertEqual(stored.case.case_id, detail.case.case_id)

    def test_seed_review_case_demo_is_idempotent(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review-demo.db'}"

            first = seed_review_case_demo(database_url)
            second = seed_review_case_demo(database_url)
            stored = ReviewPersistenceRepository(database_url).get_review_case(
                "CASE-QUERY-001"
            )

        self.assertEqual(second.case.created_at, first.case.created_at)
        self.assertEqual(len(stored.evidence), 1)
        self.assertEqual(len(stored.conclusions), 1)
        self.assertIsNone(stored.closure)


if __name__ == "__main__":
    unittest.main()
