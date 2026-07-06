import os
import tempfile
import unittest
from pathlib import Path

from fastapi import HTTPException

from backend.app import main as main_app
from backend.tests.test_roster_publish_api import _publish_request


class RosterRevisionApiTest(unittest.TestCase):
    def test_roster_revision_routes_are_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in main_app.app.routes}

        self.assertIn(("/api/v1/roster-drafts/revisions/create", "POST"), routes)
        self.assertIn(("/api/v1/roster-drafts/active-draft", "GET"), routes)

    def test_create_revision_draft_keeps_current_published_effective(self) -> None:
        with _isolated_database():
            main_app.publish_roster_draft(_publish_request())
            revision = main_app.create_roster_revision_draft(
                {
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "team_id": "G1",
                    "actor_id": "scheduler-1",
                    "occurred_at": "2026-07-06T10:00",
                    "revision_version_id": "ROSTER-2026-08-REV-1",
                }
            )
            current = main_app.get_current_roster_published_snapshot(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
            active_draft = main_app.get_active_roster_revision_draft(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

        self.assertEqual(current["published"]["version_id"], "ROSTER-2026-08-DRAFT")
        self.assertEqual(current["status"], "published")
        self.assertEqual(revision["version"]["version_id"], "ROSTER-2026-08-REV-1")
        self.assertEqual(revision["version"]["status"], "draft")
        self.assertEqual(revision["version"]["parent_version_id"], "ROSTER-2026-08-DRAFT")
        self.assertEqual(active_draft["version"]["version_id"], "ROSTER-2026-08-REV-1")
        self.assertEqual(len(active_draft["cells"]), 2)

    def test_create_revision_draft_requires_occurred_at(self) -> None:
        with self.assertRaises(HTTPException) as context:
            main_app.create_roster_revision_draft(
                {
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "actor_id": "scheduler-1",
                    "revision_version_id": "ROSTER-2026-08-REV-1",
                }
            )
        self.assertEqual(context.exception.status_code, 400)

    def test_republish_revision_replaces_current_published_with_parent_source(self) -> None:
        with _isolated_database():
            main_app.publish_roster_draft(_publish_request())
            main_app.create_roster_revision_draft(
                {
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "team_id": "G1",
                    "actor_id": "scheduler-1",
                    "occurred_at": "2026-07-06T10:00",
                    "revision_version_id": "ROSTER-2026-08-REV-1",
                }
            )
            active_draft = main_app.get_active_roster_revision_draft(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
            request = _publish_request(
                version_id="ROSTER-2026-08-REV-1",
                occurred_at="2026-07-06T10:30",
            )
            for index, cell in enumerate(active_draft["cells"]):
                request["cells"][index]["cell_id"] = cell["cell_id"]
                request["cells"][index]["source_cell_id"] = cell["source_cell_id"]
                request["cells"][index]["manually_adjusted"] = False
            request["cells"][0]["shift_code"] = "T1"
            request["cells"][0]["manually_adjusted"] = True

            published = main_app.publish_roster_draft(request)
            current = main_app.get_current_roster_published_snapshot(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

        self.assertEqual(published["published"]["version_id"], "ROSTER-2026-08-REV-1")
        self.assertEqual(current["published"]["version_id"], "ROSTER-2026-08-REV-1")
        self.assertEqual(current["published"]["parent_version_id"], "ROSTER-2026-08-DRAFT")
        self.assertEqual(current["published"]["supersedes_version_id"], "ROSTER-2026-08-DRAFT")
        self.assertIn("CELL-001", current["snapshot"]["diff_summary"]["changed_cell_ids"])
        self.assertIn(
            {
                "code": "manual_adjusted_cell",
                "assignment_id": "ASSIGN-001",
                "message": "cell ROSTER-2026-08-REV-1-CELL-001 was manually adjusted",
            },
            current["snapshot"]["soft_risks"],
        )
        self.assertEqual(len(current["snapshot"]["soft_risks"]), 1)


def _isolated_database():
    class IsolatedDatabase:
        def __enter__(self):
            self.directory = tempfile.TemporaryDirectory()
            self.previous = os.environ.get("BPO_DATABASE_URL")
            os.environ["BPO_DATABASE_URL"] = (
                f"sqlite+pysqlite:///{Path(self.directory.name) / 'roster-revision-api.db'}"
            )
            return self

        def __exit__(self, exc_type, exc, tb):
            if self.previous is None:
                os.environ.pop("BPO_DATABASE_URL", None)
            else:
                os.environ["BPO_DATABASE_URL"] = self.previous
            self.directory.cleanup()

    return IsolatedDatabase()
