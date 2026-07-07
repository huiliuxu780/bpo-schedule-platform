import os
import tempfile
import unittest
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect

from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewClosureInput,
    ReviewConclusionInput,
    ReviewEvidenceInput,
)
from backend.app.review_persistence import ReviewPersistenceRepository
from backend.tests.test_review_persistence import _seed_review_sources


class DatabaseFoundationCloseoutTest(unittest.TestCase):
    def test_migration_head_creates_database_foundation_tables(self) -> None:
        expected_tables = {
            "import_batches",
            "import_field_mapping_templates",
            "import_row_results",
            "import_versions",
            "master_data_employees",
            "master_data_suppliers",
            "master_data_workplaces",
            "master_data_projects",
            "master_data_skills",
            "master_data_organizations",
            "master_data_employee_bindings",
            "master_data_employee_skills",
            "schedule_shift_types",
            "personnel_schedule_versions",
            "personnel_schedule_details",
            "personnel_schedule_intervals",
            "forecast_versions",
            "forecast_intervals",
            "forecast_version_changes",
            "actual_login_events",
            "actual_status_dictionary",
            "actual_status_intervals",
            "comparison_runs",
            "forecast_schedule_comparison_results",
            "schedule_actual_comparison_results",
            "review_cases",
            "review_evidence",
            "review_conclusions",
            "review_closures",
            "roster_versions",
            "roster_cells",
            "roster_version_events",
            "roster_cell_change_logs",
            "roster_published_snapshots",
            "roster_edit_locks",
            "roster_request_intents",
        }
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'foundation.db'}"
            _upgrade_head(database_url)

            engine = create_engine(database_url)
            table_names = set(inspect(engine).get_table_names())

            self.assertTrue(expected_tables.issubset(table_names))
            inspector = inspect(engine)
            employee_columns = {
                column["name"] for column in inspector.get_columns("master_data_employees")
            }
            skill_columns = {
                column["name"] for column in inspector.get_columns("master_data_skills")
            }
            self.assertTrue(
                {
                    "employee_type",
                    "organization_id",
                    "workplace_id",
                }.issubset(employee_columns)
            )
            self.assertIn("skill_category", skill_columns)

    def test_minimum_database_foundation_chain_reaches_review_closure(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'foundation.db'}"
            source_ids = _seed_review_sources(database_url)
            writer = ReviewPersistenceRepository(database_url)
            writer.init_schema()

            writer.create_review_case(
                ReviewCaseCreateRequest(
                    case_id="CASE-Q127-CLOSEOUT",
                    source_result_type="schedule_actual",
                    source_result_id=source_ids["schedule_actual"],
                    business_date="2026-05-11",
                    owner_id="supervisor-q127",
                    severity="medium",
                    status="open",
                )
            )
            writer.add_evidence(
                ReviewEvidenceInput(
                    evidence_id="EVD-Q127",
                    case_id="CASE-Q127-CLOSEOUT",
                    evidence_type="audit_note",
                    evidence_uri="local://qa/q127/evidence",
                    submitted_by="qa",
                    note="Q127 minimum closure chain evidence.",
                )
            )
            writer.add_conclusion(
                ReviewConclusionInput(
                    conclusion_id="CON-Q127",
                    case_id="CASE-Q127-CLOSEOUT",
                    conclusion_type="verified",
                    risk_level="medium",
                    conclusion_text="Minimum database foundation closure chain verified.",
                    decided_by="qa",
                )
            )
            writer.close_case(
                ReviewClosureInput(
                    closure_id="CLO-Q127",
                    case_id="CASE-Q127-CLOSEOUT",
                    closure_status="closed",
                    closed_by="qa",
                    closure_note="Q127 closeout complete.",
                )
            )

            reader = ReviewPersistenceRepository(database_url)
            loaded = reader.get_review_case("CASE-Q127-CLOSEOUT")

            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.case.source_result_type, "schedule_actual")
            self.assertEqual(loaded.case.source_result_id, source_ids["schedule_actual"])
            self.assertEqual(loaded.evidence[0].evidence_type, "audit_note")
            self.assertEqual(loaded.conclusions[0].conclusion_type, "verified")
            self.assertEqual(loaded.closure.closure_status, "closed")


def _upgrade_head(database_url: str) -> None:
    root = Path(__file__).resolve().parents[2]
    config = Config(str(root / "alembic.ini"))
    config.set_main_option("path_separator", "os")
    previous_url = os.environ.get("BPO_DATABASE_URL")
    os.environ["BPO_DATABASE_URL"] = database_url
    try:
        command.upgrade(config, "head")
    finally:
        if previous_url is None:
            os.environ.pop("BPO_DATABASE_URL", None)
        else:
            os.environ["BPO_DATABASE_URL"] = previous_url


if __name__ == "__main__":
    unittest.main()
