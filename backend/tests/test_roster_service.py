import tempfile
import unittest
from dataclasses import replace
from pathlib import Path

from backend.app.roster_drafts import (
    AssignmentKind,
    EmployeeRosterSnapshot,
    PendingReason,
    PendingRosterEmployee,
    RosterAssignment,
    RosterPublishSoftRiskCode,
    RosterValidationContext,
    RosterVersion,
    RosterVersionStatus,
)
from backend.app.roster_persistence import RosterPersistenceRepository
from backend.app.roster_service import RosterService


class RosterServiceTest(unittest.TestCase):
    def test_save_draft_publish_snapshot_activate_and_revision_loop(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            draft = _draft_version("ROSTER-202608-DRAFT")
            cells = [
                _assignment("CELL-001", "EMP-001", sequence=1, shift_code="A5"),
                _assignment(
                    "CELL-002",
                    "EMP-001",
                    sequence=2,
                    assignment_kind=AssignmentKind.TRAINING,
                    annotation_code="TRAINING",
                    start="2026-08-01T15:00",
                    end="2026-08-01T16:00",
                ),
            ]

            service.save_draft(
                draft,
                cells,
                actor_id="scheduler-1",
                occurred_at="2026-07-04T09:00",
            )
            validation = service.validate_publish(draft.roster_version_id, _context())
            scheduled = service.schedule_publish(
                draft.roster_version_id,
                actor_id="scheduler-1",
                occurred_at="2026-07-04T10:00",
                effective_at="2026-08-01T00:00",
                context=_context(required_coverage_slots={"2026-08-01T14:30"}),
                pending_employees=[
                    PendingRosterEmployee(
                        employee_id="EMP-NEW",
                        business_month="2026-08",
                        reason=PendingReason.NEW_EMPLOYEE,
                        project_id="BOSCH-CS",
                        team_id="G1",
                    )
                ],
            )
            before_due = service.activate_due_published(
                now="2026-07-31T23:59",
                actor_id="system",
            )
            activated = service.activate_due_published(
                now="2026-08-01T00:00",
                actor_id="system",
            )
            current = service.get_current_published(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
            revision = service.create_revision(
                current.version.roster_version_id,
                new_version_id="ROSTER-202608-REV-1",
                actor_id="scheduler-1",
                occurred_at="2026-08-02T09:00",
            )

            self.assertTrue(validation.can_publish)
            self.assertEqual(scheduled.status, RosterVersionStatus.SCHEDULED_PUBLISHED)
            self.assertEqual(before_due.activated_version_ids, [])
            self.assertEqual(activated.activated_version_ids, ["ROSTER-202608-DRAFT"])
            self.assertEqual(current.version.status, RosterVersionStatus.PUBLISHED)
            self.assertEqual(current.published_snapshot.shift_counts, {"A5": 1})
            self.assertEqual(
                [
                    (slot["slot_start_at"], slot["arranged_count"])
                    for slot in current.published_snapshot.arranged_coverage
                ],
                [
                    ("2026-08-01T09:00", 1),
                    ("2026-08-01T09:30", 1),
                    ("2026-08-01T10:00", 1),
                    ("2026-08-01T10:30", 1),
                    ("2026-08-01T11:00", 1),
                    ("2026-08-01T11:30", 1),
                    ("2026-08-01T12:00", 1),
                    ("2026-08-01T12:30", 1),
                    ("2026-08-01T13:00", 1),
                    ("2026-08-01T13:30", 1),
                    ("2026-08-01T14:00", 1),
                ],
            )
            self.assertEqual(
                [risk["code"] for risk in current.published_snapshot.soft_risks],
                [
                    RosterPublishSoftRiskCode.PENDING_EMPLOYEE.value,
                    RosterPublishSoftRiskCode.NO_COVERAGE_HALF_HOUR.value,
                ],
            )
            self.assertEqual(revision.status, RosterVersionStatus.DRAFT)
            self.assertEqual(revision.parent_version_id, current.version.roster_version_id)

    def test_hard_errors_block_publish_and_edit_lock_blocks_non_holder_save(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            draft = _draft_version("ROSTER-202608-DRAFT")
            service.save_draft(
                draft,
                [_assignment("CELL-001", "EMP-001", shift_code="A5")],
                actor_id="scheduler-1",
                occurred_at="2026-07-04T09:00",
            )
            service.acquire_edit_lock(
                draft.roster_version_id,
                actor_id="scheduler-1",
                now="2026-07-04T09:05",
            )

            with self.assertRaisesRegex(ValueError, "locked by scheduler-1"):
                service.save_draft(
                    draft,
                    [_assignment("CELL-002", "EMP-002", shift_code="A5")],
                    actor_id="scheduler-2",
                    occurred_at="2026-07-04T09:10",
                )

            service.release_edit_lock(
                draft.roster_version_id,
                actor_id="scheduler-1",
                now="2026-07-04T09:12",
            )
            service.save_draft(
                draft,
                [_assignment("CELL-BAD", "EMP-001", shift_code="BAD")],
                actor_id="scheduler-2",
                occurred_at="2026-07-04T09:15",
            )

            with self.assertRaisesRegex(ValueError, "publish blocked by hard errors"):
                service.schedule_publish(
                    draft.roster_version_id,
                    actor_id="scheduler-2",
                    occurred_at="2026-07-04T10:00",
                    effective_at="2026-08-01T00:00",
                    context=_context(),
                )

    def test_create_revision_keeps_cell_ids_unique_for_same_day_multiple_employees(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            draft = _draft_version("ROSTER-202608-DRAFT")
            service.save_draft(
                draft,
                [
                    _assignment(
                        "CELL-EMP-001-2026-08-03",
                        "EMP-001",
                        sequence=3,
                        shift_code="A5",
                    ),
                    _assignment(
                        "CELL-EMP-002-2026-08-03",
                        "EMP-002",
                        sequence=3,
                        shift_code="A5",
                    ),
                ],
                actor_id="scheduler-1",
                occurred_at="2026-07-04T09:00",
            )
            service.schedule_publish(
                draft.roster_version_id,
                actor_id="scheduler-1",
                occurred_at="2026-07-04T10:00",
                effective_at="2026-07-04T10:00",
                context=_context(),
            )
            service.activate_due_published(
                now="2026-07-04T10:00",
                actor_id="system",
            )
            current = service.get_current_published(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

            service.create_revision(
                current.version.roster_version_id,
                new_version_id="ROSTER-202608-REV-1",
                actor_id="scheduler-1",
                occurred_at="2026-08-02T09:00",
            )
            active_draft = service.get_active_draft(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

            revision_cell_ids = [cell.roster_cell_id for cell in active_draft.cells]
            self.assertEqual(len(revision_cell_ids), len(set(revision_cell_ids)))
            self.assertEqual(
                sorted(cell.source_cell_id for cell in active_draft.cells),
                ["CELL-EMP-001-2026-08-03", "CELL-EMP-002-2026-08-03"],
            )

    def test_withdraw_scheduled_publish_and_read_upcoming(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            draft = _draft_version("ROSTER-202608-DRAFT")
            service.save_draft(
                draft,
                [_assignment("CELL-001", "EMP-001", shift_code="A5")],
                actor_id="scheduler-1",
                occurred_at="2026-07-04T09:00",
            )
            service.schedule_publish(
                draft.roster_version_id,
                actor_id="scheduler-1",
                occurred_at="2026-07-04T10:00",
                effective_at="2026-08-01T00:00",
                context=_context(),
            )

            upcoming = service.get_upcoming_published(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
            withdrawn = service.withdraw(
                draft.roster_version_id,
                actor_id="scheduler-1",
                occurred_at="2026-07-05T09:00",
            )

            self.assertEqual(upcoming.version.roster_version_id, draft.roster_version_id)
            self.assertEqual(withdrawn.status, RosterVersionStatus.VOIDED)
            self.assertIsNone(
                service.get_upcoming_published(
                    business_month="2026-08",
                    project_id="BOSCH-CS",
                    workplace_id="SHANGHAI",
                    team_id="G1",
                )
            )

    def test_activate_due_marks_scheduled_version_failed_when_snapshot_is_missing(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            scheduled = RosterVersion(
                roster_version_id="ROSTER-202608-SCHEDULED-NO-SNAPSHOT",
                business_month="2026-08",
                status=RosterVersionStatus.SCHEDULED_PUBLISHED,
                version_type="primary",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                effective_at="2026-08-01T00:00",
            )
            service.repository.upsert_version(
                scheduled,
                occurred_at="2026-07-04T10:00",
            )

            result = service.activate_due_published(
                now="2026-08-01T00:00",
                actor_id="system",
            )
            loaded = service.repository.get_version(scheduled.roster_version_id)

            self.assertEqual(result.activated_version_ids, [])
            self.assertEqual(
                result.failed_version_ids,
                ["ROSTER-202608-SCHEDULED-NO-SNAPSHOT"],
            )
            self.assertEqual(loaded.version.status, RosterVersionStatus.ACTIVATION_FAILED)
            self.assertEqual(
                loaded.version.activation_failed_reason,
                "published snapshot is missing",
            )

    def test_downstream_roster_request_intent_persists_filters_summarizes_and_resolves(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            _publish_current_roster(service)

            first = service.create_request_intent(
                request_id="REQ-001",
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                roster_cell_id="CELL-001",
                action_type="leave",
                requester_role="frontline",
                requester_id="EMP-001",
                note="8 月 1 日上午请假，需要排班师修订正式班表。",
                occurred_at="2026-08-01T08:00",
            )
            second = service.create_request_intent(
                request_id="REQ-002",
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                roster_cell_id="CELL-002",
                action_type="swap",
                requester_role="team_lead",
                requester_id="LEAD-G1",
                note="现场协调换班，需要排班师确认修订。",
                occurred_at="2026-08-01T08:05",
            )
            open_leave_items = service.list_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                status="open",
                action_type="leave",
            )
            employee_items = service.list_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                employee_id="EMP-002",
            )
            summary_before = service.summarize_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
            service.create_revision(
                "ROSTER-202608-DRAFT",
                new_version_id="ROSTER-202608-REV-1",
                actor_id="scheduler-1",
                occurred_at="2026-08-01T08:30",
            )
            resolved = service.resolve_request_intent(
                "REQ-001",
                resolver_id="scheduler-1",
                resolved_at="2026-08-01T09:00",
                linked_revision_version_id="ROSTER-202608-REV-1",
                scheduler_resolution_note="已按请假登记完成修订，8 月 1 日上午改为休息。",
            )
            detail = service.get_request_intent("REQ-001")
            resolved_items = service.list_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                status="resolved",
            )
            summary_after = service.summarize_request_intents(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

            self.assertEqual(first.status, "open")
            self.assertEqual(first.employee_id, "EMP-001")
            self.assertEqual(first.business_date, "2026-08-01")
            self.assertEqual(first.roster_version_id, "ROSTER-202608-DRAFT")
            self.assertEqual(second.employee_id, "EMP-002")
            self.assertEqual([item.request_id for item in open_leave_items], ["REQ-001"])
            self.assertEqual([item.request_id for item in employee_items], ["REQ-002"])
            self.assertEqual(summary_before["totals"], {"open": 2, "resolved": 0})
            self.assertEqual(summary_before["by_cell"]["CELL-001"]["open"], 1)
            self.assertEqual(resolved.status, "resolved")
            self.assertEqual(resolved.resolved_by, "scheduler-1")
            self.assertEqual(resolved.linked_revision_version_id, "ROSTER-202608-REV-1")
            self.assertEqual(
                resolved.scheduler_resolution_note,
                "已按请假登记完成修订，8 月 1 日上午改为休息。",
            )
            self.assertEqual(detail.scheduler_resolution_note, resolved.scheduler_resolution_note)
            self.assertEqual([item.request_id for item in resolved_items], ["REQ-001"])
            self.assertEqual(summary_after["totals"], {"open": 1, "resolved": 1})
            self.assertEqual(
                [
                    item.request_id
                    for item in service.list_open_request_intents(
                        business_month="2026-08",
                        project_id="BOSCH-CS",
                        workplace_id="SHANGHAI",
                        team_id="G1",
                    )
                ],
                ["REQ-002"],
            )
            self.assertEqual(
                service.list_open_request_intents(
                    business_month="2026-08",
                    project_id="BOSCH-CS",
                    workplace_id="SHANGHAI",
                    team_id="G2",
                ),
                [],
            )

    def test_downstream_roster_request_intent_requires_current_published_cell(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)

            with self.assertRaisesRegex(ValueError, "current published roster cell not found"):
                service.create_request_intent(
                    request_id="REQ-404",
                    business_month="2026-08",
                    project_id="BOSCH-CS",
                    workplace_id="SHANGHAI",
                    team_id="G1",
                    roster_cell_id="CELL-MISSING",
                    action_type="exception_fix",
                    requester_role="team_lead",
                    requester_id="LEAD-G1",
                    note="现场发现班表异常。",
                    occurred_at="2026-08-01T08:00",
                )

    def test_change_governance_derives_revision_diff_and_linked_issue(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            _publish_current_roster(service)
            service.create_request_intent(
                request_id="REQ-001",
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                roster_cell_id="CELL-001",
                action_type="leave",
                requester_role="frontline",
                requester_id="EMP-001",
                note="8 月 1 日上午请假，需要排班师修订正式班表。",
                occurred_at="2026-08-01T08:00",
            )
            revision = service.create_revision(
                "ROSTER-202608-DRAFT",
                new_version_id="ROSTER-202608-REV-1",
                actor_id="scheduler-1",
                occurred_at="2026-08-01T08:30",
            )
            active_draft = service.get_active_draft(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
            revised_cells = [
                (
                    replace(
                        cell,
                        assignment_kind=AssignmentKind.REST,
                        shift_code=None,
                        interval_start_at=None,
                        interval_end_at=None,
                        manually_adjusted=True,
                    )
                    if cell.source_cell_id == "CELL-001"
                    else cell
                )
                for cell in active_draft.cells
            ]
            service.save_draft(
                revision,
                revised_cells,
                actor_id="scheduler-1",
                occurred_at="2026-08-01T08:40",
            )
            service.schedule_publish(
                revision.roster_version_id,
                actor_id="scheduler-1",
                occurred_at="2026-08-01T09:00",
                effective_at="2026-08-01T09:00",
                context=_context(),
                baseline_version_id="ROSTER-202608-DRAFT",
            )
            service.activate_due_published(
                now="2026-08-01T09:00",
                actor_id="system",
            )
            service.resolve_request_intent(
                "REQ-001",
                resolver_id="scheduler-1",
                resolved_at="2026-08-01T09:10",
                linked_revision_version_id="ROSTER-202608-REV-1",
                scheduler_resolution_note="已按请假登记完成修订，8 月 1 日上午改为休息。",
            )

            governance = service.get_roster_change_governance(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                visibility="scheduler",
            )
            frontline = service.get_roster_change_governance(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                visibility="frontline",
                employee_id="EMP-001",
                issue_id="REQ-001",
            )
            unrelated_frontline = service.get_roster_change_governance(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                visibility="frontline",
                employee_id="EMP-002",
                issue_id="REQ-001",
            )

            self.assertEqual(governance["selected_revision_id"], "ROSTER-202608-REV-1")
            self.assertEqual(
                [item["version_id"] for item in governance["timeline"]],
                ["ROSTER-202608-REV-1", "ROSTER-202608-DRAFT"],
            )
            self.assertEqual(governance["timeline"][0]["changed_cell_count"], 1)
            self.assertEqual(governance["timeline"][0]["linked_issue_count"], 1)
            self.assertEqual(len(governance["diff_rows"]), 1)
            diff = governance["diff_rows"][0]
            self.assertEqual(diff["source_cell_id"], "CELL-001")
            self.assertEqual(diff["before"]["shift_code"], "A5")
            self.assertEqual(diff["after"]["assignment_kind"], "rest")
            self.assertEqual(diff["linked_issues"][0]["request_id"], "REQ-001")
            self.assertEqual(
                diff["linked_issues"][0]["scheduler_resolution_note"],
                "已按请假登记完成修订，8 月 1 日上午改为休息。",
            )
            self.assertEqual(frontline["diff_rows"][0]["source_cell_id"], "CELL-001")
            self.assertEqual(unrelated_frontline["diff_rows"], [])

    def test_change_center_returns_event_rows_and_persists_confirmation(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            service = _service(directory)
            _publish_leave_revision(service)

            change_center = service.get_roster_change_governance(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                visibility="scheduler",
            )

            self.assertEqual(change_center["summary"]["pending_count"], 1)
            self.assertEqual(change_center["summary"]["confirmed_count"], 0)
            self.assertEqual(change_center["summary"]["affected_employee_count"], 1)
            self.assertEqual(change_center["summary"]["linked_issue_count"], 1)
            self.assertEqual(len(change_center["change_events"]), 1)
            event = change_center["change_events"][0]
            self.assertEqual(event["change_event_id"], "ROSTER-202608-REV-1:CELL-001")
            self.assertEqual(event["employee_id"], "EMP-001")
            self.assertEqual(event["business_date"], "2026-08-01")
            self.assertEqual(event["change_type"], "modified")
            self.assertEqual(event["source_category"], "申请/异常")
            self.assertEqual(event["source_summary"], "请假 REQ-001")
            self.assertEqual(event["before"]["shift_code"], "A5")
            self.assertEqual(event["after"]["assignment_kind"], "rest")
            self.assertEqual(event["confirmation"]["status"], "pending")
            self.assertEqual(change_center["grouped_by_employee"][0]["employee_id"], "EMP-001")
            self.assertEqual(
                change_center["grouped_by_employee"][0]["events"],
                ["ROSTER-202608-REV-1:CELL-001"],
            )
            self.assertNotIn("source_cell_id", event)

            confirmed = service.confirm_roster_change_event(
                event["change_event_id"],
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                actor_id="scheduler-1",
                confirmed_at="2026-08-01T10:00",
                internal_confirmation_note="已核对正式班表和下游问题，现场无需再处理。",
            )

            self.assertEqual(confirmed["confirmation"]["status"], "confirmed")
            self.assertEqual(confirmed["confirmation"]["confirmed_by"], "scheduler-1")
            self.assertEqual(
                confirmed["confirmation"]["internal_confirmation_note"],
                "已核对正式班表和下游问题，现场无需再处理。",
            )

            after_confirm = service.get_roster_change_governance(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                visibility="scheduler",
            )

            self.assertEqual(after_confirm["summary"]["pending_count"], 0)
            self.assertEqual(after_confirm["summary"]["confirmed_count"], 1)
            self.assertEqual(
                after_confirm["change_events"][0]["confirmation"]["status"],
                "confirmed",
            )


def _service(directory: str) -> RosterService:
    database_url = f"sqlite+pysqlite:///{Path(directory) / 'roster.db'}"
    repository = RosterPersistenceRepository(database_url)
    repository.init_schema()
    return RosterService(repository)


def _draft_version(roster_version_id: str) -> RosterVersion:
    return RosterVersion(
        roster_version_id=roster_version_id,
        business_month="2026-08",
        status=RosterVersionStatus.DRAFT,
        version_type="primary",
        project_id="BOSCH-CS",
        workplace_id="SHANGHAI",
        team_id="G1",
    )


def _assignment(
    roster_cell_id: str,
    employee_id: str,
    *,
    sequence: int = 1,
    assignment_kind: AssignmentKind = AssignmentKind.SHIFT,
    shift_code: str | None = None,
    annotation_code: str | None = None,
    start: str | None = "2026-08-01T09:00",
    end: str | None = "2026-08-01T14:30",
) -> RosterAssignment:
    return RosterAssignment(
        assignment_id=roster_cell_id,
        roster_cell_id=roster_cell_id,
        employee_id=employee_id,
        business_date="2026-08-01",
        sequence=sequence,
        assignment_kind=assignment_kind,
        shift_code=shift_code,
        annotation_code=annotation_code,
        interval_start_at=start,
        interval_end_at=end,
        project_id="BOSCH-CS",
        workplace_id="SHANGHAI",
        team_id="G1",
    )


def _context(required_coverage_slots: set[str] | None = None) -> RosterValidationContext:
    return RosterValidationContext(
        employees={
            "EMP-001": EmployeeRosterSnapshot(
                employee_id="EMP-001",
                active=True,
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            "EMP-002": EmployeeRosterSnapshot(
                employee_id="EMP-002",
                active=True,
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            "EMP-NEW": EmployeeRosterSnapshot(
                employee_id="EMP-NEW",
                active=True,
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
        },
        valid_shift_codes={"A5"},
        required_coverage_slots=required_coverage_slots or set(),
    )


def _publish_current_roster(service: RosterService) -> None:
    draft = _draft_version("ROSTER-202608-DRAFT")
    service.save_draft(
        draft,
        [
            _assignment("CELL-001", "EMP-001", shift_code="A5"),
            _assignment("CELL-002", "EMP-002", shift_code="A5"),
        ],
        actor_id="scheduler-1",
        occurred_at="2026-07-04T09:00",
    )
    service.schedule_publish(
        draft.roster_version_id,
        actor_id="scheduler-1",
        occurred_at="2026-07-04T10:00",
        effective_at="2026-07-04T10:00",
        context=_context(),
    )
    service.activate_due_published(
        now="2026-07-04T10:00",
        actor_id="system",
    )


def _publish_leave_revision(service: RosterService) -> None:
    _publish_current_roster(service)
    service.create_request_intent(
        request_id="REQ-001",
        business_month="2026-08",
        project_id="BOSCH-CS",
        workplace_id="SHANGHAI",
        team_id="G1",
        roster_cell_id="CELL-001",
        action_type="leave",
        requester_role="frontline",
        requester_id="EMP-001",
        note="8 月 1 日上午请假，需要排班师修订正式班表。",
        occurred_at="2026-08-01T08:00",
    )
    revision = service.create_revision(
        "ROSTER-202608-DRAFT",
        new_version_id="ROSTER-202608-REV-1",
        actor_id="scheduler-1",
        occurred_at="2026-08-01T08:30",
    )
    active_draft = service.get_active_draft(
        business_month="2026-08",
        project_id="BOSCH-CS",
        workplace_id="SHANGHAI",
        team_id="G1",
    )
    revised_cells = [
        (
            replace(
                cell,
                assignment_kind=AssignmentKind.REST,
                shift_code=None,
                interval_start_at=None,
                interval_end_at=None,
                manually_adjusted=True,
            )
            if cell.source_cell_id == "CELL-001"
            else cell
        )
        for cell in active_draft.cells
    ]
    service.save_draft(
        revision,
        revised_cells,
        actor_id="scheduler-1",
        occurred_at="2026-08-01T08:40",
    )
    service.schedule_publish(
        revision.roster_version_id,
        actor_id="scheduler-1",
        occurred_at="2026-08-01T09:00",
        effective_at="2026-08-01T09:00",
        context=_context(),
        baseline_version_id="ROSTER-202608-DRAFT",
    )
    service.activate_due_published(
        now="2026-08-01T09:00",
        actor_id="system",
    )
    service.resolve_request_intent(
        "REQ-001",
        resolver_id="scheduler-1",
        resolved_at="2026-08-01T09:10",
        linked_revision_version_id="ROSTER-202608-REV-1",
        scheduler_resolution_note="已按请假登记完成修订，8 月 1 日上午改为休息。",
    )


if __name__ == "__main__":
    unittest.main()
