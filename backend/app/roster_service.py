from dataclasses import dataclass, replace
from datetime import date
from typing import Any

from backend.app.roster_drafts import (
    EditLockDecision,
    RosterAssignment,
    RosterEditLockResult,
    RosterPublishIssue,
    RosterPublishValidationResult,
    RosterValidationContext,
    RosterVersion,
    RosterVersionAction,
    RosterVersionStatus,
    acquire_edit_lock,
    build_publish_diff,
    transition_roster_version,
    validate_roster_publish,
)
from backend.app.roster_persistence import (
    RosterChangeConfirmationRecord,
    RosterPersistenceRepository,
    RosterRequestIntentRecord,
    RosterVersionDetail,
)


@dataclass(frozen=True)
class RosterActivationResult:
    activated_version_ids: list[str]
    failed_version_ids: list[str]


REQUEST_INTENT_ACTIONS = {"leave", "swap", "exception_fix", "site_adjustment"}
REQUEST_INTENT_ROLES = {"frontline", "team_lead"}
REQUEST_INTENT_STATUSES = {"open", "in_progress", "resolved"}
REQUEST_INTENT_RESULT_TYPES = {"adjusted", "rejected", "closed"}
REQUEST_INTENT_ACTION_LABELS = {
    "leave": "请假",
    "swap": "换班",
    "exception_fix": "异常修复",
    "site_adjustment": "现场调配",
}


class RosterService:
    def __init__(self, repository: RosterPersistenceRepository):
        self.repository = repository

    def save_draft(
        self,
        version: RosterVersion,
        cells: list[RosterAssignment],
        *,
        actor_id: str,
        occurred_at: str,
    ) -> RosterVersionDetail:
        self._assert_save_lock(version.roster_version_id, actor_id, occurred_at)
        return self.repository.save_draft(
            version,
            cells,
            actor_id=actor_id,
            occurred_at=occurred_at,
        )

    def validate_publish(
        self,
        roster_version_id: str,
        context: RosterValidationContext,
        pending_employees: list | None = None,
    ) -> RosterPublishValidationResult:
        detail = self._require_version(roster_version_id)
        return validate_roster_publish(
            detail.version,
            detail.cells,
            context,
            pending_employees,
        )

    def schedule_publish(
        self,
        roster_version_id: str,
        *,
        actor_id: str,
        occurred_at: str,
        effective_at: str,
        context: RosterValidationContext,
        pending_employees: list | None = None,
        baseline_version_id: str | None = None,
    ) -> RosterVersion:
        detail = self._require_version(roster_version_id)
        validation = validate_roster_publish(
            detail.version,
            detail.cells,
            context,
            pending_employees,
        )
        if validation.hard_errors:
            raise ValueError("publish blocked by hard errors")
        result = transition_roster_version(
            detail.version,
            RosterVersionAction.SCHEDULE_PUBLISH,
            actor_id=actor_id,
            occurred_at=occurred_at,
            effective_at=effective_at,
        )
        if result.errors:
            raise ValueError("; ".join(result.errors))
        baseline_cells = []
        if baseline_version_id is not None:
            baseline = self.repository.get_version(baseline_version_id)
            baseline_cells = baseline.cells if baseline is not None else []
        self.repository.update_version_status(
            result.version,
            actor_id=actor_id,
            occurred_at=occurred_at,
            action=RosterVersionAction.SCHEDULE_PUBLISH,
        )
        self.repository.save_published_snapshot(
            roster_version_id=roster_version_id,
            shift_counts=_shift_counts(detail.cells),
            arranged_coverage=[
                {
                    "slot_start_at": slot.slot_start_at,
                    "arranged_count": slot.arranged_count,
                    "assignment_ids": slot.assignment_ids,
                }
                for slot in validation.arranged_coverage
            ],
            hard_errors=[_issue_json(issue) for issue in validation.hard_errors],
            soft_risks=[_issue_json(issue) for issue in validation.soft_risks],
            diff_summary=_diff_json(build_publish_diff(baseline_cells, detail.cells)),
            created_at=occurred_at,
        )
        return result.version

    def activate_due_published(
        self,
        *,
        now: str,
        actor_id: str,
    ) -> RosterActivationResult:
        activated_ids: list[str] = []
        failed_ids: list[str] = []
        for detail in self.repository.list_due_scheduled(now):
            try:
                if detail.published_snapshot is None:
                    raise ValueError("published snapshot is missing")
                activated = transition_roster_version(
                    detail.version,
                    RosterVersionAction.ACTIVATE,
                    actor_id=actor_id,
                    occurred_at=now,
                )
                if activated.errors:
                    raise ValueError("; ".join(activated.errors))
                current = self.repository.get_current_published(
                    business_month=detail.version.business_month,
                    project_id=detail.version.project_id,
                    workplace_id=detail.version.workplace_id,
                    team_id=detail.version.team_id,
                )
                if current is not None:
                    superseded = replace(
                        current.version,
                        status=RosterVersionStatus.SUPERSEDED,
                    )
                    self.repository.update_version_status(
                        superseded,
                        actor_id=actor_id,
                        occurred_at=now,
                        action=RosterVersionAction.ACTIVATE,
                        note=f"superseded by {detail.version.roster_version_id}",
                    )
                self.repository.update_version_status(
                    activated.version,
                    actor_id=actor_id,
                    occurred_at=now,
                    action=RosterVersionAction.ACTIVATE,
                )
                activated_ids.append(detail.version.roster_version_id)
            except Exception as exc:
                failed = replace(
                    detail.version,
                    status=RosterVersionStatus.ACTIVATION_FAILED,
                    activation_failed_reason=str(exc),
                )
                self.repository.update_version_status(
                    failed,
                    actor_id=actor_id,
                    occurred_at=now,
                    action=RosterVersionAction.FAIL_ACTIVATION,
                    note=str(exc),
                )
                failed_ids.append(detail.version.roster_version_id)
        return RosterActivationResult(
            activated_version_ids=activated_ids,
            failed_version_ids=failed_ids,
        )

    def withdraw(
        self,
        roster_version_id: str,
        *,
        actor_id: str,
        occurred_at: str,
    ) -> RosterVersion:
        detail = self._require_version(roster_version_id)
        result = transition_roster_version(
            detail.version,
            RosterVersionAction.WITHDRAW,
            actor_id=actor_id,
            occurred_at=occurred_at,
        )
        if result.errors:
            raise ValueError("; ".join(result.errors))
        return self.repository.update_version_status(
            result.version,
            actor_id=actor_id,
            occurred_at=occurred_at,
            action=RosterVersionAction.WITHDRAW,
        )

    def create_revision(
        self,
        roster_version_id: str,
        *,
        new_version_id: str,
        actor_id: str,
        occurred_at: str,
    ) -> RosterVersion:
        detail = self._require_version(roster_version_id)
        result = transition_roster_version(
            detail.version,
            RosterVersionAction.CREATE_REVISION_DRAFT,
            actor_id=actor_id,
            occurred_at=occurred_at,
            new_version_id=new_version_id,
        )
        if result.errors:
            raise ValueError("; ".join(result.errors))
        self.repository.save_draft(
            result.version,
            [
                replace(
                    cell,
                    roster_cell_id=f"{new_version_id}-{cell.roster_cell_id}",
                    source_cell_id=cell.roster_cell_id,
                    manually_adjusted=False,
                )
                for cell in detail.cells
            ],
            actor_id=actor_id,
            occurred_at=occurred_at,
        )
        return result.version

    def get_active_draft(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
    ) -> RosterVersionDetail | None:
        return self.repository.get_active_draft(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
        )

    def get_current_published(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
    ) -> RosterVersionDetail | None:
        return self.repository.get_current_published(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
        )

    def get_upcoming_published(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
    ) -> RosterVersionDetail | None:
        return self.repository.get_upcoming_published(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
        )

    def acquire_edit_lock(
        self,
        roster_version_id: str,
        *,
        actor_id: str,
        now: str,
    ) -> RosterEditLockResult:
        return self._apply_edit_lock(roster_version_id, actor_id, now, EditLockDecision.ACQUIRE)

    def release_edit_lock(
        self,
        roster_version_id: str,
        *,
        actor_id: str,
        now: str,
    ) -> RosterEditLockResult:
        return self._apply_edit_lock(roster_version_id, actor_id, now, EditLockDecision.RELEASE)

    def force_release_edit_lock(
        self,
        roster_version_id: str,
        *,
        actor_id: str,
        now: str,
    ) -> RosterEditLockResult:
        return self._apply_edit_lock(
            roster_version_id,
            actor_id,
            now,
            EditLockDecision.FORCE_RELEASE,
        )

    def create_request_intent(
        self,
        *,
        request_id: str,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
        roster_cell_id: str,
        action_type: str,
        requester_role: str,
        requester_id: str,
        note: str,
        occurred_at: str,
    ) -> RosterRequestIntentRecord:
        if action_type not in REQUEST_INTENT_ACTIONS:
            raise ValueError(f"unsupported roster request action: {action_type}")
        if requester_role not in REQUEST_INTENT_ROLES:
            raise ValueError(f"unsupported roster requester role: {requester_role}")
        current = self.repository.get_current_published(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
        )
        if current is None:
            raise ValueError("current published roster cell not found")
        linked_cell = next(
            (cell for cell in current.cells if cell.roster_cell_id == roster_cell_id),
            None,
        )
        if linked_cell is None:
            raise ValueError("current published roster cell not found")
        return self.repository.create_request_intent(
            RosterRequestIntentRecord(
                request_id=request_id,
                business_month=business_month,
                project_id=project_id,
                workplace_id=workplace_id,
                team_id=team_id,
                roster_version_id=current.version.roster_version_id,
                roster_cell_id=roster_cell_id,
                employee_id=linked_cell.employee_id,
                business_date=linked_cell.business_date,
                action_type=action_type,
                requester_role=requester_role,
                requester_id=requester_id,
                note=note,
                status="open",
                created_at=occurred_at,
            )
        )

    def list_open_request_intents(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
    ) -> list[RosterRequestIntentRecord]:
        return self.repository.list_open_request_intents(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
        )

    def list_request_intents(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
        status: str | None = None,
        action_type: str | None = None,
        employee_id: str | None = None,
        requester_role: str | None = None,
        requester_id: str | None = None,
    ) -> list[RosterRequestIntentRecord]:
        if status is not None and status not in REQUEST_INTENT_STATUSES:
            raise ValueError(f"unsupported roster request status: {status}")
        if action_type is not None and action_type not in REQUEST_INTENT_ACTIONS:
            raise ValueError(f"unsupported roster request action: {action_type}")
        if requester_role is not None and requester_role not in REQUEST_INTENT_ROLES:
            raise ValueError(f"unsupported roster requester role: {requester_role}")
        return self.repository.list_request_intents(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            status=status,
            action_type=action_type,
            employee_id=employee_id,
            requester_role=requester_role,
            requester_id=requester_id,
        )

    def get_request_intent(self, request_id: str) -> RosterRequestIntentRecord:
        intent = self.repository.get_request_intent(request_id)
        if intent is None:
            raise ValueError(f"roster request intent does not exist: {request_id}")
        return intent

    def summarize_request_intents(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
        employee_id: str | None = None,
        requester_role: str | None = None,
        requester_id: str | None = None,
    ) -> dict[str, Any]:
        items = self.list_request_intents(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            employee_id=employee_id,
            requester_role=requester_role,
            requester_id=requester_id,
        )
        totals = {"open": 0, "in_progress": 0, "resolved": 0}
        by_result = {"adjusted": 0, "rejected": 0, "closed": 0}
        by_cell: dict[str, dict[str, int]] = {}
        by_action: dict[str, dict[str, int]] = {}
        by_employee: dict[str, dict[str, int]] = {}
        latest_by_cell: dict[str, str] = {}
        for item in items:
            if item.status in totals:
                totals[item.status] += 1
            for key, bucket in (
                (item.roster_cell_id, by_cell),
                (item.action_type, by_action),
                (item.employee_id, by_employee),
            ):
                if key not in bucket:
                    bucket[key] = {"open": 0, "in_progress": 0, "resolved": 0}
                if item.status in bucket[key]:
                    bucket[key][item.status] += 1
            if item.result_type in by_result:
                by_result[item.result_type] += 1
            current_latest = latest_by_cell.get(item.roster_cell_id)
            if current_latest is None or item.created_at > current_latest:
                latest_by_cell[item.roster_cell_id] = item.created_at
        for cell_id, latest in latest_by_cell.items():
            by_cell[cell_id]["latest_created_at"] = latest
        return {
            "totals": totals,
            "by_result": by_result,
            "by_cell": by_cell,
            "by_action": by_action,
            "by_employee": by_employee,
        }

    def start_request_intent_follow_up(
        self,
        request_id: str,
        *,
        actor_id: str,
        occurred_at: str,
        scheduler_resolution_note: str,
    ) -> RosterRequestIntentRecord:
        if not scheduler_resolution_note.strip():
            raise ValueError("scheduler resolution note is required")
        intent = self.get_request_intent(request_id)
        if intent.status == "resolved":
            raise ValueError("resolved roster request intent cannot return to follow-up")
        return self.repository.update_request_intent_status(
            request_id,
            status="in_progress",
            actor_id=actor_id,
            occurred_at=occurred_at,
            scheduler_resolution_note=scheduler_resolution_note.strip(),
        )

    def close_request_intent_without_revision(
        self,
        request_id: str,
        *,
        actor_id: str,
        resolved_at: str,
        result_type: str,
        scheduler_resolution_note: str,
    ) -> RosterRequestIntentRecord:
        if result_type not in {"rejected", "closed"}:
            raise ValueError(f"unsupported roster request close result: {result_type}")
        if not scheduler_resolution_note.strip():
            raise ValueError("scheduler resolution note is required")
        return self.repository.update_request_intent_status(
            request_id,
            status="resolved",
            actor_id=actor_id,
            occurred_at=resolved_at,
            result_type=result_type,
            scheduler_resolution_note=scheduler_resolution_note.strip(),
        )

    def resolve_request_intent(
        self,
        request_id: str,
        *,
        resolver_id: str,
        resolved_at: str,
        linked_revision_version_id: str,
        scheduler_resolution_note: str,
    ) -> RosterRequestIntentRecord:
        if self.repository.get_version(linked_revision_version_id) is None:
            raise ValueError(
                f"linked revision version does not exist: {linked_revision_version_id}"
            )
        if not scheduler_resolution_note.strip():
            raise ValueError("scheduler resolution note is required")
        return self.repository.resolve_request_intent(
            request_id,
            resolver_id=resolver_id,
            resolved_at=resolved_at,
            linked_revision_version_id=linked_revision_version_id,
            scheduler_resolution_note=scheduler_resolution_note.strip(),
            result_type="adjusted",
        )

    def get_roster_change_governance(
        self,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
        visibility: str,
        revision_id: str | None = None,
        cell_id: str | None = None,
        issue_id: str | None = None,
        employee_id: str | None = None,
        requester_id: str | None = None,
    ) -> dict[str, Any]:
        if visibility not in {"scheduler", "team_lead", "frontline"}:
            raise ValueError(f"unsupported roster change governance visibility: {visibility}")
        details = self.repository.list_versions_by_scope(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            statuses={RosterVersionStatus.PUBLISHED, RosterVersionStatus.SUPERSEDED},
        )
        details = sorted(
            details,
            key=lambda detail: (
                detail.version.activated_at or detail.version.effective_at or "",
                detail.version.roster_version_id,
            ),
            reverse=True,
        )
        detail_by_id = {detail.version.roster_version_id: detail for detail in details}
        selected = detail_by_id.get(revision_id or "") or (details[0] if details else None)
        resolved_issues = self.list_request_intents(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            status="resolved",
        )
        timeline = [
            self._change_governance_timeline_item(detail, detail_by_id, resolved_issues)
            for detail in details
        ]
        diff_rows = (
            self._change_governance_diff_rows(
                selected,
                detail_by_id,
                resolved_issues,
                visibility=visibility,
                cell_id=cell_id,
                issue_id=issue_id,
                employee_id=employee_id,
                requester_id=requester_id,
            )
            if selected is not None
            else []
        )
        selected_diff = next(
            (
                row
                for row in diff_rows
                if (
                    cell_id is not None
                    and cell_id in {row["roster_cell_id"], row["source_cell_id"]}
                )
                or (
                    issue_id is not None
                    and any(issue["request_id"] == issue_id for issue in row["linked_issues"])
                )
            ),
            diff_rows[0] if diff_rows else None,
        )
        confirmations = {
            confirmation.change_event_id: confirmation
            for confirmation in self.repository.list_change_confirmations(
                business_month=business_month,
                project_id=project_id,
                workplace_id=workplace_id,
                team_id=team_id,
            )
        }
        change_events = [
            _change_event_from_diff(row, confirmations.get(row["diff_id"]))
            for row in diff_rows
        ]
        selected_event = next(
            (
                event
                for event in change_events
                if selected_diff is not None
                and event["change_event_id"] == selected_diff["diff_id"]
            ),
            change_events[0] if change_events else None,
        )
        return {
            "scope": {
                "business_month": business_month,
                "project_id": project_id,
                "workplace_id": workplace_id,
                "team_id": team_id,
            },
            "visibility": visibility,
            "selected_revision_id": selected.version.roster_version_id if selected else None,
            "timeline": timeline,
            "diff_rows": diff_rows,
            "selected_diff": selected_diff,
            "summary": _change_event_summary(change_events),
            "change_events": change_events,
            "grouped_by_employee": _group_change_events_by_employee(change_events),
            "selected_event": selected_event,
        }

    def confirm_roster_change_event(
        self,
        change_event_id: str,
        *,
        business_month: str,
        project_id: str | None,
        workplace_id: str | None,
        team_id: str | None,
        actor_id: str,
        confirmed_at: str,
        internal_confirmation_note: str,
    ) -> dict[str, Any]:
        actor = actor_id.strip()
        note = internal_confirmation_note.strip()
        if not actor:
            raise ValueError("actor_id is required")
        if not confirmed_at.strip():
            raise ValueError("confirmed_at is required")
        if not note:
            raise ValueError("internal_confirmation_note is required")
        current = self.get_roster_change_governance(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            visibility="scheduler",
        )
        if not any(event["change_event_id"] == change_event_id for event in current["change_events"]):
            raise ValueError(f"roster change event does not exist: {change_event_id}")
        self.repository.save_change_confirmation(
            RosterChangeConfirmationRecord(
                change_event_id=change_event_id,
                business_month=business_month,
                project_id=project_id,
                workplace_id=workplace_id,
                team_id=team_id,
                confirmed_by=actor,
                confirmed_at=confirmed_at,
                internal_confirmation_note=note,
            )
        )
        updated = self.get_roster_change_governance(
            business_month=business_month,
            project_id=project_id,
            workplace_id=workplace_id,
            team_id=team_id,
            visibility="scheduler",
        )
        for event in updated["change_events"]:
            if event["change_event_id"] == change_event_id:
                return event
        raise RuntimeError("confirmed roster change event could not be read back")

    def _change_governance_timeline_item(
        self,
        detail: RosterVersionDetail,
        detail_by_id: dict[str, RosterVersionDetail],
        resolved_issues: list[RosterRequestIntentRecord],
    ) -> dict[str, Any]:
        rows = self._change_governance_diff_rows(
            detail,
            detail_by_id,
            resolved_issues,
            visibility="scheduler",
        )
        linked_issue_ids = {
            issue["request_id"]
            for row in rows
            for issue in row["linked_issues"]
        }
        return {
            "version_id": detail.version.roster_version_id,
            "published_at": detail.version.activated_at or detail.version.effective_at,
            "status": detail.version.status.value,
            "parent_version_id": detail.version.parent_version_id,
            "supersedes_version_id": detail.version.supersedes_version_id,
            "changed_cell_count": len(rows),
            "linked_issue_count": len(linked_issue_ids),
        }

    def _change_governance_diff_rows(
        self,
        detail: RosterVersionDetail,
        detail_by_id: dict[str, RosterVersionDetail],
        resolved_issues: list[RosterRequestIntentRecord],
        *,
        visibility: str,
        cell_id: str | None = None,
        issue_id: str | None = None,
        employee_id: str | None = None,
        requester_id: str | None = None,
    ) -> list[dict[str, Any]]:
        baseline_id = detail.version.parent_version_id or detail.version.supersedes_version_id
        baseline = detail_by_id.get(baseline_id or "")
        if baseline is None and baseline_id:
            baseline = self.repository.get_version(baseline_id)
        if baseline is None:
            return []
        baseline_cells = {cell.roster_cell_id: cell for cell in baseline.cells}
        rows: list[dict[str, Any]] = []
        for cell in detail.cells:
            source_cell_id = cell.source_cell_id or cell.roster_cell_id or ""
            before = baseline_cells.get(source_cell_id)
            if before is None or not _roster_cells_differ(before, cell):
                continue
            if cell_id is not None and cell_id not in {cell.roster_cell_id, source_cell_id}:
                continue
            linked = [
                issue
                for issue in resolved_issues
                if issue.linked_revision_version_id == detail.version.roster_version_id
                and issue.roster_cell_id in {cell.roster_cell_id, source_cell_id}
                and (issue_id is None or issue.request_id == issue_id)
            ]
            if issue_id is not None and not linked:
                continue
            if visibility == "frontline" and not _frontline_can_see_change(
                cell,
                linked,
                employee_id=employee_id,
                requester_id=requester_id,
            ):
                continue
            rows.append(
                {
                    "diff_id": f"{detail.version.roster_version_id}:{source_cell_id}",
                    "revision_version_id": detail.version.roster_version_id,
                    "parent_version_id": baseline.version.roster_version_id,
                    "roster_cell_id": cell.roster_cell_id,
                    "source_cell_id": source_cell_id,
                    "employee_id": cell.employee_id,
                    "business_date": cell.business_date,
                    "change_type": "changed",
                    "before": _roster_cell_snapshot(before),
                    "after": _roster_cell_snapshot(cell),
                    "linked_issues": [_request_intent_snapshot(issue) for issue in linked],
                }
            )
        return sorted(
            rows,
            key=lambda row: (
                row["business_date"],
                row["employee_id"],
                row["source_cell_id"],
            ),
        )

    def _apply_edit_lock(
        self,
        roster_version_id: str,
        actor_id: str,
        now: str,
        decision: EditLockDecision,
    ) -> RosterEditLockResult:
        existing = self.repository.get_edit_lock(roster_version_id)
        result = acquire_edit_lock(existing, roster_version_id, actor_id, now, decision)
        if result.lock is None:
            self.repository.clear_edit_lock(roster_version_id)
        else:
            self.repository.save_edit_lock(result.lock)
        return result

    def _assert_save_lock(
        self,
        roster_version_id: str,
        actor_id: str,
        now: str,
    ) -> None:
        lock = self.repository.get_edit_lock(roster_version_id)
        if lock is None:
            return
        result = acquire_edit_lock(lock, roster_version_id, actor_id, now)
        if result.read_only:
            raise ValueError(result.message)
        if result.lock is not None:
            self.repository.save_edit_lock(result.lock)

    def _require_version(self, roster_version_id: str) -> RosterVersionDetail:
        detail = self.repository.get_version(roster_version_id)
        if detail is None:
            raise ValueError(f"roster version does not exist: {roster_version_id}")
        return detail


def _shift_counts(cells: list[RosterAssignment]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for cell in cells:
        if cell.assignment_kind.value != "shift" or cell.shift_code is None:
            continue
        counts[cell.shift_code] = counts.get(cell.shift_code, 0) + 1
    return dict(sorted(counts.items()))


def _roster_cells_differ(before: RosterAssignment, after: RosterAssignment) -> bool:
    return _roster_cell_comparable_snapshot(before) != _roster_cell_comparable_snapshot(after)


def _roster_cell_comparable_snapshot(cell: RosterAssignment) -> dict[str, Any]:
    return {
        "employee_id": cell.employee_id,
        "business_date": cell.business_date,
        "assignment_kind": cell.assignment_kind.value,
        "shift_code": cell.shift_code,
        "annotation_code": cell.annotation_code,
        "interval_start_at": cell.interval_start_at,
        "interval_end_at": cell.interval_end_at,
        "manually_adjusted": cell.manually_adjusted,
    }


def _roster_cell_snapshot(cell: RosterAssignment) -> dict[str, Any]:
    return {
        "cell_id": cell.roster_cell_id,
        "assignment_id": cell.assignment_id,
        "employee_id": cell.employee_id,
        "business_date": cell.business_date,
        "assignment_kind": cell.assignment_kind.value,
        "project_id": cell.project_id,
        "workplace_id": cell.workplace_id,
        "team_id": cell.team_id,
        "shift_code": cell.shift_code,
        "annotation_code": cell.annotation_code,
        "interval_start_at": cell.interval_start_at,
        "interval_end_at": cell.interval_end_at,
        "manually_adjusted": cell.manually_adjusted,
    }


def _request_intent_snapshot(intent: RosterRequestIntentRecord) -> dict[str, Any]:
    return {
        "request_id": intent.request_id,
        "roster_cell_id": intent.roster_cell_id,
        "employee_id": intent.employee_id,
        "business_date": intent.business_date,
        "action_type": intent.action_type,
        "requester_role": intent.requester_role,
        "requester_id": intent.requester_id,
        "note": intent.note,
        "status": intent.status,
        "resolved_at": intent.resolved_at,
        "resolved_by": intent.resolved_by,
        "linked_revision_version_id": intent.linked_revision_version_id,
        "scheduler_resolution_note": intent.scheduler_resolution_note,
    }


def _change_event_from_diff(
    row: dict[str, Any],
    confirmation: RosterChangeConfirmationRecord | None,
) -> dict[str, Any]:
    linked_issues = row["linked_issues"]
    return {
        "change_event_id": row["diff_id"],
        "employee_id": row["employee_id"],
        "employee_name": row["employee_id"],
        "team_id": row["after"].get("team_id"),
        "business_date": row["business_date"],
        "weekday": _weekday_label(row["business_date"]),
        "change_type": "modified",
        "source_category": _change_source_category(row),
        "source_summary": _change_source_summary(linked_issues),
        "before": row["before"],
        "after": row["after"],
        "linked_issues": linked_issues,
        "confirmation": _change_confirmation_snapshot(confirmation),
    }


def _change_source_category(row: dict[str, Any]) -> str:
    if row["linked_issues"]:
        return "申请/异常"
    if row["after"].get("manually_adjusted"):
        return "排班师手工调整"
    return "系统派生修正"


def _change_source_summary(linked_issues: list[dict[str, Any]]) -> str:
    if not linked_issues:
        return "无关联申请"
    first = linked_issues[0]
    label = REQUEST_INTENT_ACTION_LABELS.get(first["action_type"], first["action_type"])
    if len(linked_issues) == 1:
        return f"{label} {first['request_id']}"
    return f"{label} {first['request_id']} 等 {len(linked_issues)} 个"


def _change_confirmation_snapshot(
    confirmation: RosterChangeConfirmationRecord | None,
) -> dict[str, Any]:
    if confirmation is None:
        return {
            "status": "pending",
            "confirmed_at": None,
            "confirmed_by": None,
            "internal_confirmation_note": None,
        }
    return {
        "status": "confirmed",
        "confirmed_at": confirmation.confirmed_at,
        "confirmed_by": confirmation.confirmed_by,
        "internal_confirmation_note": confirmation.internal_confirmation_note,
    }


def _change_event_summary(change_events: list[dict[str, Any]]) -> dict[str, int]:
    pending = [
        event
        for event in change_events
        if event["confirmation"]["status"] == "pending"
    ]
    confirmed = [
        event
        for event in change_events
        if event["confirmation"]["status"] == "confirmed"
    ]
    linked_issue_ids = {
        issue["request_id"]
        for event in change_events
        for issue in event["linked_issues"]
    }
    return {
        "pending_count": len(pending),
        "confirmed_count": len(confirmed),
        "affected_employee_count": len({event["employee_id"] for event in change_events}),
        "linked_issue_count": len(linked_issue_ids),
    }


def _group_change_events_by_employee(change_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[str, dict[str, Any]] = {}
    for event in change_events:
        employee_id = event["employee_id"]
        group = grouped.setdefault(
            employee_id,
            {
                "employee_id": employee_id,
                "employee_name": event["employee_name"],
                "pending_count": 0,
                "confirmed_count": 0,
                "events": [],
            },
        )
        if event["confirmation"]["status"] == "pending":
            group["pending_count"] += 1
        else:
            group["confirmed_count"] += 1
        group["events"].append(event["change_event_id"])
    return sorted(
        grouped.values(),
        key=lambda group: (
            -group["pending_count"],
            group["employee_id"],
        ),
    )


def _weekday_label(business_date: str) -> str:
    try:
        return date.fromisoformat(business_date).strftime("%a")
    except ValueError:
        return ""


def _frontline_can_see_change(
    cell: RosterAssignment,
    linked_issues: list[RosterRequestIntentRecord],
    *,
    employee_id: str | None,
    requester_id: str | None,
) -> bool:
    if employee_id is not None and cell.employee_id == employee_id:
        return True
    return any(
        (employee_id is not None and issue.employee_id == employee_id)
        or (requester_id is not None and issue.requester_id == requester_id)
        for issue in linked_issues
    )


def _issue_json(issue: RosterPublishIssue) -> dict[str, Any]:
    return {
        "code": issue.code.value,
        "assignment_id": issue.assignment_id,
        "message": issue.message,
    }


def _diff_json(diff) -> dict[str, Any]:
    return {
        "added_cell_ids": diff.added_cell_ids,
        "deleted_cell_ids": diff.deleted_cell_ids,
        "changed_cell_ids": diff.changed_cell_ids,
        "coverage_deltas": [
            {
                "slot_start_at": delta.slot_start_at,
                "baseline_count": delta.baseline_count,
                "candidate_count": delta.candidate_count,
                "delta": delta.delta,
            }
            for delta in diff.coverage_deltas
        ],
    }
