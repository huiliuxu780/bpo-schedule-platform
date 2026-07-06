import os
import tempfile
import unittest
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from fastapi import HTTPException

from backend.app.main import (
    acquire_roster_draft_lock,
    app,
    get_current_roster_published_snapshot,
    _get_roster_service,
    publish_roster_draft,
    release_roster_draft_lock,
)


class RosterPublishApiTest(unittest.TestCase):
    def test_roster_publish_routes_are_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/roster-drafts/current-published", "GET"), routes)
        self.assertIn(("/api/v1/roster-drafts/publish", "POST"), routes)
        self.assertIn(("/api/v1/roster-drafts/locks/acquire", "POST"), routes)
        self.assertIn(("/api/v1/roster-drafts/locks/release", "POST"), routes)

    def test_local_roster_publish_api_allows_browser_preflight(self) -> None:
        middleware_names = {middleware.cls.__name__ for middleware in app.user_middleware}

        self.assertIn("CORSMiddleware", middleware_names)

    def test_roster_service_schema_initialization_is_concurrency_safe(self) -> None:
        with _isolated_database():
            with ThreadPoolExecutor(max_workers=2) as executor:
                services = list(executor.map(lambda _: _get_roster_service(), range(2)))

        self.assertEqual(len(services), 2)

    def test_publish_current_draft_returns_current_published_snapshot(self) -> None:
        with _isolated_database():
            publish_response = publish_roster_draft(_publish_request())
            current_response = get_current_roster_published_snapshot(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

        self.assertEqual(publish_response["status"], "published")
        self.assertEqual(publish_response["published"]["status"], "published")
        self.assertEqual(current_response["published"]["version_id"], "ROSTER-2026-08-DRAFT")
        self.assertEqual(current_response["snapshot"]["shift_counts"], {"A5": 1, "T1": 1})
        self.assertIn(
            {
                "code": "manual_adjusted_cell",
                "assignment_id": "ASSIGN-002",
                "message": "cell CELL-002 was manually adjusted",
            },
            current_response["snapshot"]["soft_risks"],
        )
        self.assertGreaterEqual(len(current_response["snapshot"]["arranged_coverage"]), 2)
        self.assertEqual(len(current_response["cells"]), 2)
        self.assertEqual(current_response["cells"][0]["employee_id"], "EMP-001")

    def test_current_published_missing_response_has_stable_cells_contract(self) -> None:
        with _isolated_database():
            current_response = get_current_roster_published_snapshot(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

        self.assertEqual(current_response["status"], "missing")
        self.assertIsNone(current_response["published"])
        self.assertIsNone(current_response["snapshot"])
        self.assertEqual(current_response["cells"], [])

    def test_lock_held_by_other_actor_blocks_publish_until_released(self) -> None:
        with _isolated_database():
            acquire_roster_draft_lock(
                {
                    "version_id": "ROSTER-2026-08-DRAFT",
                    "actor_id": "scheduler-2",
                    "now": "2026-07-06T09:00",
                }
            )

            with self.assertRaises(HTTPException) as raised:
                publish_roster_draft(
                    _publish_request(
                        actor_id="scheduler-1",
                        occurred_at="2026-07-06T09:10",
                    )
                )

            release_response = release_roster_draft_lock(
                {
                    "version_id": "ROSTER-2026-08-DRAFT",
                    "actor_id": "scheduler-2",
                    "now": "2026-07-06T09:10",
                }
            )
            publish_response = publish_roster_draft(_publish_request(actor_id="scheduler-1"))

        self.assertEqual(raised.exception.status_code, 409)
        self.assertEqual(raised.exception.detail["error"]["code"], "ROSTER_DRAFT_LOCKED")
        self.assertFalse(release_response["read_only"])
        self.assertEqual(publish_response["status"], "published")


def _isolated_database():
    class IsolatedDatabase:
        def __enter__(self):
            self.directory = tempfile.TemporaryDirectory()
            self.previous = os.environ.get("BPO_DATABASE_URL")
            os.environ["BPO_DATABASE_URL"] = (
                f"sqlite+pysqlite:///{Path(self.directory.name) / 'roster-api.db'}"
            )
            return self

        def __exit__(self, exc_type, exc, tb):
            if self.previous is None:
                os.environ.pop("BPO_DATABASE_URL", None)
            else:
                os.environ["BPO_DATABASE_URL"] = self.previous
            self.directory.cleanup()

    return IsolatedDatabase()


def _publish_request(
    version_id: str = "ROSTER-2026-08-DRAFT",
    actor_id: str = "scheduler-1",
    occurred_at: str = "2026-07-06T09:30",
) -> dict:
    return {
        "version_id": version_id,
        "actor_id": actor_id,
        "occurred_at": occurred_at,
        "business_month": "2026-08",
        "project_id": "BOSCH-CS",
        "workplace_id": "SHANGHAI",
        "team_id": "G1",
        "valid_shift_codes": ["A5", "T1"],
        "required_coverage_slots": ["2026-08-01T09:00"],
        "cells": [
            {
                "cell_id": "CELL-001",
                "assignment_id": "ASSIGN-001",
                "employee_id": "EMP-001",
                "business_date": "2026-08-01",
                "shift_code": "A5",
                "interval_start_at": "2026-08-01T09:00",
                "interval_end_at": "2026-08-01T10:00",
                "manually_adjusted": False,
            },
            {
                "cell_id": "CELL-002",
                "assignment_id": "ASSIGN-002",
                "employee_id": "EMP-002",
                "business_date": "2026-08-01",
                "shift_code": "T1",
                "interval_start_at": "2026-08-01T10:00",
                "interval_end_at": "2026-08-01T11:00",
                "manually_adjusted": True,
            },
        ],
        "employees": [
            {
                "employee_id": "EMP-001",
                "active": True,
                "project_id": "BOSCH-CS",
                "workplace_id": "SHANGHAI",
                "team_id": "G1",
                "status": "active",
            },
            {
                "employee_id": "EMP-002",
                "active": True,
                "project_id": "BOSCH-CS",
                "workplace_id": "SHANGHAI",
                "team_id": "G1",
                "status": "active",
            },
        ],
    }
