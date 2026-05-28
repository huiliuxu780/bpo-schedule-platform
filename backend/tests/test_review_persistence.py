import tempfile
import unittest
from pathlib import Path

from backend.app.comparison_persistence import ComparisonPersistenceRepository
from backend.app.models import (
    ComparisonRunRequest,
    ForecastScheduleComparisonResultInput,
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewConclusionInput,
    ReviewEvidenceInput,
    ScheduleActualComparisonResultInput,
)
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_comparison_persistence import _seed_comparison_sources


class ReviewPersistenceTest(unittest.TestCase):
    def test_review_closure_records_survive_new_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review.db'}"
            source_ids = _seed_review_sources(database_url)
            writer = ReviewPersistenceRepository(database_url)
            writer.init_schema()

            writer.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-FS-001",
                    source_result_type="forecast_schedule",
                    source_result_id=source_ids["forecast_schedule"],
                    business_date="2026-05-11",
                    owner_id="supervisor-01",
                    severity="high",
                    status="open",
                )
            )
            writer.add_evidence(
                ReviewEvidenceInput(
                    evidence_id="EVD-001",
                    case_id="CASE-FS-001",
                    evidence_type="screenshot",
                    evidence_uri="local://review/CASE-FS-001/screenshot-1",
                    submitted_by="supervisor-01",
                    note="排班缺口截图",
                )
            )
            writer.add_conclusion(
                ReviewConclusionInput(
                    conclusion_id="CON-001",
                    case_id="CASE-FS-001",
                    conclusion_type="confirmed_gap",
                    risk_level="high",
                    conclusion_text="确认 09:00-09:30 存在人力缺口。",
                    decided_by="ops-lead-01",
                )
            )
            writer.close_case(
                ReviewClosureInput(
                    closure_id="CLO-001",
                    case_id="CASE-FS-001",
                    closure_status="closed",
                    closed_by="ops-lead-01",
                    closure_note="已记录复核结论，等待后续业务流程处理。",
                )
            )

            reader = ReviewPersistenceRepository(database_url)
            stored = reader.get_review_case("CASE-FS-001")

            self.assertIsNotNone(stored)
            self.assertEqual(stored.case.case_id, "CASE-FS-001")
            self.assertEqual(stored.case.source_result_type, "forecast_schedule")
            self.assertEqual(stored.case.source_result_id, source_ids["forecast_schedule"])
            self.assertEqual(stored.evidence[0].evidence_uri, "local://review/CASE-FS-001/screenshot-1")
            self.assertEqual(stored.conclusions[0].risk_level, "high")
            self.assertEqual(stored.closure.closure_status, "closed")

    def test_review_case_accepts_schedule_actual_source_result(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            stored = repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-SA-001",
                    source_result_type="schedule_actual",
                    source_result_id=source_ids["schedule_actual"],
                    business_date="2026-05-11",
                    owner_id="supervisor-02",
                    severity="medium",
                    status="open",
                )
            )

            self.assertEqual(stored.case.source_result_type, "schedule_actual")
            self.assertEqual(stored.case.source_result_id, source_ids["schedule_actual"])

    def test_review_case_rejects_missing_source_result(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review.db'}"
            _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "forecast_schedule source_result_id 9999 does not exist",
            ):
                repository.create_review_case(
                    ReviewCaseCreateRequest(
                        case_id="CASE-MISSING",
                        source_result_type="forecast_schedule",
                        source_result_id=9999,
                        business_date="2026-05-11",
                        owner_id="supervisor-01",
                        severity="high",
                        status="open",
                    )
                )

    def test_review_case_rejects_source_type_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "schedule_actual source_result_id .* does not exist",
            ):
                repository.create_review_case(
                    ReviewCaseCreateRequest(
                        case_id="CASE-MISMATCH",
                        source_result_type="schedule_actual",
                        source_result_id=source_ids["forecast_schedule_only"],
                        business_date="2026-05-11",
                        owner_id="supervisor-01",
                        severity="high",
                        status="open",
                    )
                )

    def test_review_case_rejects_source_business_date_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()

            with self.assertRaisesRegex(
                ValueError,
                "forecast_schedule source_result_id .* does not match review case business_date",
            ):
                repository.create_review_case(
                    ReviewCaseCreateRequest(
                        case_id="CASE-BAD-DATE",
                        source_result_type="forecast_schedule",
                        source_result_id=source_ids["forecast_schedule"],
                        business_date="2026-05-12",
                        owner_id="supervisor-01",
                        severity="high",
                        status="open",
                    )
                )

    def test_review_closure_rejects_duplicate_closure_for_case(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'review.db'}"
            source_ids = _seed_review_sources(database_url)
            repository = ReviewPersistenceRepository(database_url)
            repository.init_schema()
            repository.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-DUP-CLOSE",
                    source_result_type="forecast_schedule",
                    source_result_id=source_ids["forecast_schedule"],
                    business_date="2026-05-11",
                    owner_id="supervisor-01",
                    severity="high",
                    status="open",
                )
            )
            repository.close_case(
                ReviewClosureInput(
                    closure_id="CLO-DUP-001",
                    case_id="CASE-DUP-CLOSE",
                    closure_status="closed",
                    closed_by="ops-lead-01",
                    closure_note="首次关闭",
                )
            )

            with self.assertRaisesRegex(
                ValueError,
                "review case CASE-DUP-CLOSE is already closed",
            ):
                repository.close_case(
                    ReviewClosureInput(
                        closure_id="CLO-DUP-002",
                        case_id="CASE-DUP-CLOSE",
                        closure_status="closed",
                        closed_by="ops-lead-02",
                        closure_note="重复关闭",
                    )
                )


def _seed_review_sources(database_url: str) -> dict[str, int]:
    _seed_comparison_sources(database_url)
    repository = ComparisonPersistenceRepository(database_url)
    repository.init_schema()
    repository.create_comparison_run(
        ComparisonRunRequest(
            run_id="RUN-DB008-FS",
            comparison_type="forecast_vs_schedule",
            forecast_version_id="FC-20260511-V1",
            schedule_version_id="SCH-20260511-V1",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            status="completed",
            forecast_schedule_results=[
                ForecastScheduleComparisonResultInput(
                    forecast_interval_id="FC-INT-001",
                    schedule_detail_id="DETAIL-A-1001-20260511",
                    business_date="2026-05-11",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    interval_start="09:00",
                    interval_end="09:30",
                    forecast_agents=3,
                    scheduled_agents=1,
                    gap_agents=2,
                    result_status="gap",
                ),
                ForecastScheduleComparisonResultInput(
                    business_date="2026-05-11",
                    workplace_id="SH-01",
                    project_id="BOSCH-CS",
                    skill_id="L1-CN",
                    interval_start="09:30",
                    interval_end="10:00",
                    forecast_agents=4,
                    scheduled_agents=2,
                    gap_agents=2,
                    result_status="gap",
                )
            ],
        )
    )
    repository.create_comparison_run(
        ComparisonRunRequest(
            run_id="RUN-DB008-SA",
            comparison_type="schedule_vs_actual",
            schedule_version_id="SCH-20260511-V1",
            actual_import_version_id="IMPORT-STATUS-20260511",
            business_date_from="2026-05-11",
            business_date_to="2026-05-11",
            status="completed",
            schedule_actual_results=[
                ScheduleActualComparisonResultInput(
                    schedule_detail_id="DETAIL-A-1001-20260511",
                    actual_status_interval_row_id=1,
                    business_date="2026-05-11",
                    employee_id="A-1001",
                    interval_start="09:00",
                    interval_end="09:30",
                    scheduled_minutes=30,
                    actual_productive_minutes=15,
                    late_minutes=15,
                    result_status="late",
                )
            ],
        )
    )

    forecast_run = repository.get_comparison_run("RUN-DB008-FS")
    actual_run = repository.get_comparison_run("RUN-DB008-SA")
    if forecast_run is None or actual_run is None:
        raise RuntimeError("review source comparison results could not be seeded")
    return {
        "forecast_schedule": forecast_run.forecast_schedule_results[0].result_id,
        "forecast_schedule_only": forecast_run.forecast_schedule_results[1].result_id,
        "schedule_actual": actual_run.schedule_actual_results[0].result_id,
    }


if __name__ == "__main__":
    unittest.main()
