import os
import tempfile
import unittest
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from fastapi import HTTPException

from backend.app.main import (
    acquire_roster_draft_lock,
    app,
    create_roster_request_intent,
    confirm_roster_change_event,
    get_roster_request_intent,
    get_roster_change_governance,
    list_roster_request_intents,
    summarize_roster_request_intents,
    get_current_roster_published_snapshot,
    _get_roster_service,
    publish_roster_draft,
    release_roster_draft_lock,
    resolve_roster_request_intent,
)


class RosterPublishApiTest(unittest.TestCase):
    def test_roster_publish_routes_are_registered(self) -> None:
        routes = {(route.path, ",".join(sorted(route.methods))) for route in app.routes}

        self.assertIn(("/api/v1/roster-drafts/current-published", "GET"), routes)
        self.assertIn(("/api/v1/roster-drafts/publish", "POST"), routes)
        self.assertIn(("/api/v1/roster-drafts/locks/acquire", "POST"), routes)
        self.assertIn(("/api/v1/roster-drafts/locks/release", "POST"), routes)
        self.assertIn(("/api/v1/roster-requests", "GET"), routes)
        self.assertIn(("/api/v1/roster-requests", "POST"), routes)
        self.assertIn(("/api/v1/roster-requests/summary", "GET"), routes)
        self.assertIn(("/api/v1/roster-requests/{request_id}", "GET"), routes)
        self.assertIn(("/api/v1/roster-requests/{request_id}/resolve", "POST"), routes)
        self.assertIn(("/api/v1/roster-change-governance", "GET"), routes)
        self.assertIn(
            ("/api/v1/roster-change-governance/events/{change_event_id}/confirm", "POST"),
            routes,
        )

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

    def test_roster_request_intent_api_lists_details_summarizes_and_resolves(self) -> None:
        with _isolated_database():
            publish_roster_draft(_publish_request())
            create_response = create_roster_request_intent(
                {
                    "request_id": "REQ-001",
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "team_id": "G1",
                    "roster_cell_id": "CELL-001",
                    "action_type": "leave",
                    "requester_role": "frontline",
                    "requester_id": "EMP-001",
                    "note": "8 月 1 日上午请假，需要排班师修订正式班表。",
                    "occurred_at": "2026-08-01T08:00",
                }
            )
            create_roster_request_intent(
                {
                    "request_id": "REQ-002",
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "team_id": "G1",
                    "roster_cell_id": "CELL-002",
                    "action_type": "swap",
                    "requester_role": "team_lead",
                    "requester_id": "LEAD-G1",
                    "note": "现场换班待排班师确认。",
                    "occurred_at": "2026-08-01T08:05",
                }
            )
            list_response = list_roster_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                status="open",
                action_type="leave",
            )
            detail_response = get_roster_request_intent("REQ-001")
            summary_before = summarize_roster_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
            service = _get_roster_service()
            service.create_revision(
                "ROSTER-2026-08-DRAFT",
                new_version_id="ROSTER-2026-08-REV-1",
                actor_id="scheduler-1",
                occurred_at="2026-08-01T08:30",
            )
            resolve_response = resolve_roster_request_intent(
                "REQ-001",
                {
                    "resolver_id": "scheduler-1",
                    "resolved_at": "2026-08-01T09:00",
                    "linked_revision_version_id": "ROSTER-2026-08-REV-1",
                    "scheduler_resolution_note": "已完成请假修订并发布。",
                },
            )
            list_after_resolve = list_roster_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                status="open",
            )
            resolved_response = list_roster_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                status="resolved",
            )

        self.assertEqual(create_response["status"], "open")
        self.assertEqual(create_response["roster_cell_id"], "CELL-001")
        self.assertEqual(create_response["employee_id"], "EMP-001")
        self.assertEqual(create_response["business_date"], "2026-08-01")
        self.assertEqual([item["request_id"] for item in list_response["items"]], ["REQ-001"])
        self.assertEqual(detail_response["request_id"], "REQ-001")
        self.assertEqual(summary_before["totals"], {"open": 2, "resolved": 0})
        self.assertEqual(summary_before["by_cell"]["CELL-001"]["open"], 1)
        self.assertEqual(resolve_response["status"], "resolved")
        self.assertEqual(resolve_response["linked_revision_version_id"], "ROSTER-2026-08-REV-1")
        self.assertEqual(resolve_response["scheduler_resolution_note"], "已完成请假修订并发布。")
        self.assertEqual([item["request_id"] for item in list_after_resolve["items"]], ["REQ-002"])
        self.assertEqual([item["request_id"] for item in resolved_response["items"]], ["REQ-001"])

    def test_roster_change_governance_api_returns_revision_diff_and_linked_issue(self) -> None:
        with _isolated_database():
            publish_roster_draft(_publish_request())
            create_roster_request_intent(
                {
                    "request_id": "REQ-001",
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "team_id": "G1",
                    "roster_cell_id": "CELL-001",
                    "action_type": "leave",
                    "requester_role": "frontline",
                    "requester_id": "EMP-001",
                    "note": "8 月 1 日上午请假，需要排班师修订正式班表。",
                    "occurred_at": "2026-08-01T08:00",
                }
            )
            service = _get_roster_service()
            service.create_revision(
                "ROSTER-2026-08-DRAFT",
                new_version_id="ROSTER-2026-08-REV-1",
                actor_id="scheduler-1",
                occurred_at="2026-08-01T08:30",
            )
            publish_roster_draft(
                _publish_request(
                    version_id="ROSTER-2026-08-REV-1",
                    occurred_at="2026-08-01T09:00",
                )
                | {
                    "cells": [
                        {
                            "cell_id": "ROSTER-2026-08-REV-1-CELL-001",
                            "assignment_id": "ASSIGN-001",
                            "employee_id": "EMP-001",
                            "business_date": "2026-08-01",
                            "assignment_kind": "rest",
                            "source_cell_id": "CELL-001",
                            "manually_adjusted": True,
                        },
                        {
                            "cell_id": "ROSTER-2026-08-REV-1-CELL-002",
                            "assignment_id": "ASSIGN-002",
                            "employee_id": "EMP-002",
                            "business_date": "2026-08-01",
                            "shift_code": "T1",
                            "interval_start_at": "2026-08-01T10:00",
                            "interval_end_at": "2026-08-01T11:00",
                            "source_cell_id": "CELL-002",
                            "manually_adjusted": True,
                        },
                    ]
                }
            )
            resolve_roster_request_intent(
                "REQ-001",
                {
                    "resolver_id": "scheduler-1",
                    "resolved_at": "2026-08-01T09:10",
                    "linked_revision_version_id": "ROSTER-2026-08-REV-1",
                    "scheduler_resolution_note": "已按请假登记完成修订，8 月 1 日上午改为休息。",
                },
            )

            response = get_roster_change_governance(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                visibility="scheduler",
                revision_id=None,
                cell_id=None,
                issue_id=None,
                employee_id=None,
                requester_id=None,
            )

        self.assertEqual(response["selected_revision_id"], "ROSTER-2026-08-REV-1")
        self.assertEqual(response["timeline"][0]["version_id"], "ROSTER-2026-08-REV-1")
        self.assertEqual(response["timeline"][0]["changed_cell_count"], 1)
        self.assertEqual(response["timeline"][0]["linked_issue_count"], 1)
        self.assertEqual(response["diff_rows"][0]["source_cell_id"], "CELL-001")
        self.assertEqual(response["diff_rows"][0]["before"]["shift_code"], "A5")
        self.assertEqual(response["diff_rows"][0]["after"]["assignment_kind"], "rest")
        self.assertEqual(response["diff_rows"][0]["linked_issues"][0]["request_id"], "REQ-001")
        self.assertEqual(response["summary"]["pending_count"], 1)
        self.assertEqual(response["change_events"][0]["change_event_id"], "ROSTER-2026-08-REV-1:CELL-001")
        self.assertNotIn("source_cell_id", response["change_events"][0])

    def test_roster_change_event_confirm_api_persists_internal_note(self) -> None:
        with _isolated_database():
            publish_roster_draft(_publish_request())
            create_roster_request_intent(
                {
                    "request_id": "REQ-001",
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "team_id": "G1",
                    "roster_cell_id": "CELL-001",
                    "action_type": "leave",
                    "requester_role": "frontline",
                    "requester_id": "EMP-001",
                    "note": "8 月 1 日上午请假，需要排班师修订正式班表。",
                    "occurred_at": "2026-08-01T08:00",
                }
            )
            service = _get_roster_service()
            service.create_revision(
                "ROSTER-2026-08-DRAFT",
                new_version_id="ROSTER-2026-08-REV-1",
                actor_id="scheduler-1",
                occurred_at="2026-08-01T08:30",
            )
            publish_roster_draft(
                _publish_request(
                    version_id="ROSTER-2026-08-REV-1",
                    occurred_at="2026-08-01T09:00",
                )
                | {
                    "cells": [
                        {
                            "cell_id": "ROSTER-2026-08-REV-1-CELL-001",
                            "assignment_id": "ASSIGN-001",
                            "employee_id": "EMP-001",
                            "business_date": "2026-08-01",
                            "assignment_kind": "rest",
                            "source_cell_id": "CELL-001",
                            "manually_adjusted": True,
                        },
                        {
                            "cell_id": "ROSTER-2026-08-REV-1-CELL-002",
                            "assignment_id": "ASSIGN-002",
                            "employee_id": "EMP-002",
                            "business_date": "2026-08-01",
                            "shift_code": "T1",
                            "interval_start_at": "2026-08-01T10:00",
                            "interval_end_at": "2026-08-01T11:00",
                            "source_cell_id": "CELL-002",
                            "manually_adjusted": True,
                        },
                    ]
                }
            )
            resolve_roster_request_intent(
                "REQ-001",
                {
                    "resolver_id": "scheduler-1",
                    "resolved_at": "2026-08-01T09:10",
                    "linked_revision_version_id": "ROSTER-2026-08-REV-1",
                    "scheduler_resolution_note": "已按请假登记完成修订，8 月 1 日上午改为休息。",
                },
            )

            confirmed = confirm_roster_change_event(
                "ROSTER-2026-08-REV-1:CELL-001",
                {
                    "business_month": "2026-08",
                    "project_id": "BOSCH-CS",
                    "workplace_id": "SHANGHAI",
                    "team_id": "G1",
                    "actor_id": "scheduler-1",
                    "confirmed_at": "2026-08-01T10:00",
                    "internal_confirmation_note": "已核对正式班表和下游问题，现场无需再处理。",
                },
            )
            after_confirm = get_roster_change_governance(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                visibility="scheduler",
                revision_id=None,
                cell_id=None,
                issue_id=None,
                employee_id=None,
                requester_id=None,
            )

        self.assertEqual(confirmed["confirmation"]["status"], "confirmed")
        self.assertEqual(
            confirmed["confirmation"]["internal_confirmation_note"],
            "已核对正式班表和下游问题，现场无需再处理。",
        )
        self.assertEqual(after_confirm["summary"]["pending_count"], 0)
        self.assertEqual(after_confirm["summary"]["confirmed_count"], 1)


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
