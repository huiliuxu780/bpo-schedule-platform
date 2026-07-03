from dataclasses import dataclass, replace
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
    RosterPersistenceRepository,
    RosterVersionDetail,
)


@dataclass(frozen=True)
class RosterActivationResult:
    activated_version_ids: list[str]
    failed_version_ids: list[str]


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
                replace(cell, roster_cell_id=f"{new_version_id}-{cell.sequence}")
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
