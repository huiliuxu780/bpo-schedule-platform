import tempfile
import unittest
from pathlib import Path

from backend.app.review_demo_seed import (
    seed_review_case_demo,
    seed_review_case_stage_matrix,
)
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


class ReviewStageMatrixSeedTest(unittest.TestCase):
    def test_stage_matrix_creates_all_four_cases(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'stage-matrix.db'}"

            details = seed_review_case_stage_matrix(database_url)

        case_ids = [d.case.case_id for d in details]
        self.assertEqual(len(case_ids), 4)
        self.assertIn("CASE-QUERY-001", case_ids)
        self.assertIn("CASE-SEED-ME-001", case_ids)
        self.assertIn("CASE-SEED-MC-001", case_ids)
        self.assertIn("CASE-SEED-CL-001", case_ids)

    def test_stage_matrix_missing_evidence_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'stage-matrix.db'}"

            seed_review_case_stage_matrix(database_url)
            repository = ReviewPersistenceRepository(database_url)
            case = repository.get_review_case("CASE-SEED-ME-001")

        self.assertIsNotNone(case)
        self.assertEqual(case.case.status, "open")
        self.assertEqual(len(case.evidence), 0)
        self.assertEqual(len(case.conclusions), 0)
        self.assertIsNone(case.closure)

    def test_stage_matrix_missing_conclusion_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'stage-matrix.db'}"

            seed_review_case_stage_matrix(database_url)
            repository = ReviewPersistenceRepository(database_url)
            case = repository.get_review_case("CASE-SEED-MC-001")

        self.assertIsNotNone(case)
        self.assertEqual(case.case.status, "open")
        self.assertEqual(len(case.evidence), 1)
        self.assertEqual(case.evidence[0].evidence_id, "EVD-SEED-MC-001")
        self.assertEqual(len(case.conclusions), 0)
        self.assertIsNone(case.closure)

    def test_stage_matrix_closed_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'stage-matrix.db'}"

            seed_review_case_stage_matrix(database_url)
            repository = ReviewPersistenceRepository(database_url)
            case = repository.get_review_case("CASE-SEED-CL-001")

        self.assertIsNotNone(case)
        self.assertEqual(case.case.status, "open")
        self.assertEqual(len(case.evidence), 1)
        self.assertEqual(case.evidence[0].evidence_id, "EVD-SEED-CL-001")
        self.assertEqual(len(case.conclusions), 1)
        self.assertEqual(case.conclusions[0].conclusion_id, "CON-SEED-CL-001")
        self.assertIsNotNone(case.closure)
        self.assertEqual(case.closure.closure_id, "CLO-SEED-CL-001")
        self.assertEqual(case.closure.closure_status, "closed")

    def test_stage_matrix_preserves_demo_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'stage-matrix.db'}"

            seed_review_case_stage_matrix(database_url)
            repository = ReviewPersistenceRepository(database_url)
            case = repository.get_review_case("CASE-QUERY-001")

        self.assertIsNotNone(case)
        self.assertEqual(case.case.status, "open")
        self.assertEqual(len(case.evidence), 1)
        self.assertEqual(case.evidence[0].evidence_id, "EVD-QUERY-001")
        self.assertEqual(len(case.conclusions), 1)
        self.assertIsNone(case.closure)

    def test_stage_matrix_is_idempotent(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'stage-matrix.db'}"

            first = seed_review_case_stage_matrix(database_url)
            second = seed_review_case_stage_matrix(database_url)

        first_ids = sorted(d.case.case_id for d in first)
        second_ids = sorted(d.case.case_id for d in second)
        self.assertEqual(first_ids, second_ids)
        self.assertEqual(
            {detail.case.case_id: detail.case.created_at for detail in second},
            {detail.case.case_id: detail.case.created_at for detail in first},
        )

        for detail in second:
            if detail.case.case_id == "CASE-QUERY-001":
                self.assertEqual(len(detail.evidence), 1)
                self.assertEqual(len(detail.conclusions), 1)
                self.assertIsNone(detail.closure)
            elif detail.case.case_id == "CASE-SEED-ME-001":
                self.assertEqual(len(detail.evidence), 0)
                self.assertEqual(len(detail.conclusions), 0)
            elif detail.case.case_id == "CASE-SEED-MC-001":
                self.assertEqual(len(detail.evidence), 1)
                self.assertEqual(len(detail.conclusions), 0)
            elif detail.case.case_id == "CASE-SEED-CL-001":
                self.assertEqual(len(detail.evidence), 1)
                self.assertEqual(len(detail.conclusions), 1)
                self.assertIsNotNone(detail.closure)


if __name__ == "__main__":
    unittest.main()
