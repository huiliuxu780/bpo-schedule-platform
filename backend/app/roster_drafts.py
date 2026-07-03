from calendar import monthrange
from dataclasses import dataclass, field, replace
from datetime import datetime, timedelta
from enum import StrEnum


class AssignmentKind(StrEnum):
    SHIFT = "shift"
    LEAVE = "leave"
    REST = "rest"
    TRAINING = "training"
    MEETING = "meeting"
    SUPPORT = "support"
    WORK_FROM_HOME = "work_from_home"
    ANNOTATION = "annotation"
    UNASSIGNED = "unassigned"


class RosterVersionStatus(StrEnum):
    DRAFT = "draft"
    SCHEDULED_PUBLISHED = "scheduled_published"
    PUBLISHED = "published"
    SUPERSEDED = "superseded"
    VOIDED = "voided"
    ACTIVATION_FAILED = "activation_failed"
    ARCHIVED = "archived"


class RosterVersionAction(StrEnum):
    SCHEDULE_PUBLISH = "schedule_publish"
    ACTIVATE = "activate"
    FAIL_ACTIVATION = "fail_activation"
    RETRY_ACTIVATION = "retry_activation"
    WITHDRAW = "withdraw"
    CREATE_REVISION_DRAFT = "create_revision_draft"


class RosterPublishHardErrorCode(StrEnum):
    INVALID_SHIFT_TYPE = "invalid_shift_type"
    EMPLOYEE_MISSING = "employee_missing"
    EMPLOYEE_FROZEN = "employee_frozen"
    EMPLOYEE_LEFT = "employee_left"
    EMPLOYEE_OUT_OF_SCOPE = "employee_out_of_scope"
    OVERLAPPING_SHIFT = "overlapping_shift"
    REQUIRED_ASSIGNMENT_MISSING = "required_assignment_missing"
    UNCONFIRMED_REGENERATE_CONFLICT = "unconfirmed_regenerate_conflict"
    STALE_BASE_SNAPSHOT = "stale_base_snapshot"


class RosterPublishSoftRiskCode(StrEnum):
    PENDING_EMPLOYEE = "pending_employee"
    MANUAL_ADJUSTED_CELL = "manual_adjusted_cell"
    NO_COVERAGE_HALF_HOUR = "no_coverage_half_hour"


class EditLockDecision(StrEnum):
    ACQUIRE = "acquire"
    RELEASE = "release"
    FORCE_RELEASE = "force_release"


class PendingReason(StrEnum):
    NEW_EMPLOYEE = "new_employee"
    TEAM_CHANGED = "team_changed"
    MISSING_SOURCE_PATTERN = "missing_source_pattern"
    INVALID_SHIFT_TYPE = "invalid_shift_type"
    INVALID_EMPLOYEE_STATUS = "invalid_employee_status"


@dataclass(frozen=True)
class RosterVersion:
    roster_version_id: str
    business_month: str
    status: RosterVersionStatus
    version_type: str
    project_id: str | None = None
    workplace_id: str | None = None
    team_id: str | None = None
    effective_at: str | None = None
    parent_version_id: str | None = None
    supersedes_version_id: str | None = None
    activated_at: str | None = None
    activation_failed_reason: str | None = None


@dataclass(frozen=True)
class RosterAssignment:
    assignment_id: str
    employee_id: str
    business_date: str
    assignment_kind: AssignmentKind
    project_id: str
    team_id: str
    sequence: int = 1
    workplace_id: str | None = None
    shift_code: str | None = None
    annotation_code: str | None = None
    interval_start_at: str | None = None
    interval_end_at: str | None = None
    roster_cell_id: str | None = None
    source_cell_id: str | None = None
    manually_adjusted: bool = False


@dataclass(frozen=True)
class PendingRosterEmployee:
    employee_id: str
    business_month: str
    reason: PendingReason
    project_id: str
    team_id: str
    note: str | None = None


@dataclass(frozen=True)
class EmployeeRosterSnapshot:
    employee_id: str
    active: bool
    project_id: str
    team_id: str
    workplace_id: str | None = None
    status: str = "active"


@dataclass(frozen=True)
class RosterValidationContext:
    employees: dict[str, EmployeeRosterSnapshot]
    valid_shift_codes: set[str] = field(default_factory=set)
    required_employee_dates: set[tuple[str, str]] = field(default_factory=set)
    regenerate_conflict_cell_ids: list[str] = field(default_factory=list)
    regenerate_conflicts_confirmed: bool = True
    base_snapshot_stale: bool = False
    base_snapshot_confirmed: bool = True
    required_coverage_slots: set[str] = field(default_factory=set)


@dataclass(frozen=True)
class RosterValidationError:
    assignment_id: str | None
    message: str


@dataclass(frozen=True)
class RosterValidationResult:
    errors: list[RosterValidationError]
    coverage_assignment_ids: list[str]
    pending_employee_ids: list[str]


@dataclass(frozen=True)
class RosterPublishIssue:
    code: RosterPublishHardErrorCode | RosterPublishSoftRiskCode
    assignment_id: str | None
    message: str


@dataclass(frozen=True)
class ArrangedCoverageSlot:
    slot_start_at: str
    arranged_count: int
    assignment_ids: list[str]


@dataclass(frozen=True)
class CoverageDelta:
    slot_start_at: str
    baseline_count: int
    candidate_count: int
    delta: int


@dataclass(frozen=True)
class PublishDiffSummary:
    added_cell_ids: list[str]
    deleted_cell_ids: list[str]
    changed_cell_ids: list[str]
    coverage_deltas: list[CoverageDelta]


@dataclass(frozen=True)
class RosterPublishValidationResult:
    can_publish: bool
    hard_errors: list[RosterPublishIssue]
    soft_risks: list[RosterPublishIssue]
    arranged_coverage: list[ArrangedCoverageSlot]


@dataclass(frozen=True)
class RosterVersionEvent:
    roster_version_id: str
    action: RosterVersionAction
    actor_id: str
    occurred_at: str
    note: str | None = None


@dataclass(frozen=True)
class RosterTransitionResult:
    version: RosterVersion
    events: list[RosterVersionEvent]
    errors: list[str]


@dataclass(frozen=True)
class RosterEditLock:
    roster_version_id: str
    actor_id: str
    acquired_at: str
    expires_at: str


@dataclass(frozen=True)
class RosterEditLockResult:
    acquired: bool
    read_only: bool
    lock: RosterEditLock | None
    message: str


def validate_roster_draft(
    version: RosterVersion,
    assignments: list[RosterAssignment],
    pending_employees: list[PendingRosterEmployee],
    context: RosterValidationContext,
) -> RosterValidationResult:
    errors: list[RosterValidationError] = []
    coverage_assignment_ids: list[str] = []

    if version.status != RosterVersionStatus.DRAFT:
        errors.append(
            RosterValidationError(
                assignment_id=None,
                message="only draft roster versions are editable",
            )
        )

    for assignment in assignments:
        errors.extend(_validate_employee_reference(assignment, context))
        if assignment.assignment_kind == AssignmentKind.UNASSIGNED:
            errors.append(
                RosterValidationError(
                    assignment_id=assignment.assignment_id,
                    message="unassigned must be represented as a pending roster employee",
                )
            )
        if assignment.assignment_kind == AssignmentKind.SHIFT:
            coverage_assignment_ids.append(assignment.assignment_id)
            errors.extend(_validate_shift_interval(assignment))

    errors.extend(_validate_shift_overlap(assignments))
    errors.extend(_validate_pending_employees(pending_employees, context))

    return RosterValidationResult(
        errors=errors,
        coverage_assignment_ids=coverage_assignment_ids,
        pending_employee_ids=[pending.employee_id for pending in pending_employees],
    )


def validate_roster_publish(
    version: RosterVersion,
    assignments: list[RosterAssignment],
    context: RosterValidationContext,
    pending_employees: list[PendingRosterEmployee] | None = None,
) -> RosterPublishValidationResult:
    hard_errors: list[RosterPublishIssue] = []
    soft_risks: list[RosterPublishIssue] = []

    for pending in pending_employees or []:
        soft_risks.append(
            RosterPublishIssue(
                code=RosterPublishSoftRiskCode.PENDING_EMPLOYEE,
                assignment_id=None,
                message=f"pending employee {pending.employee_id} remains unresolved",
            )
        )

    for assignment in assignments:
        if assignment.assignment_kind != AssignmentKind.SHIFT:
            continue
        if context.valid_shift_codes and assignment.shift_code not in context.valid_shift_codes:
            hard_errors.append(
                RosterPublishIssue(
                    code=RosterPublishHardErrorCode.INVALID_SHIFT_TYPE,
                    assignment_id=assignment.assignment_id,
                    message=f"shift code {assignment.shift_code} is not valid",
                )
            )
        hard_errors.extend(_validate_publish_employee_reference(assignment, context))
        if assignment.manually_adjusted:
            soft_risks.append(
                RosterPublishIssue(
                    code=RosterPublishSoftRiskCode.MANUAL_ADJUSTED_CELL,
                    assignment_id=assignment.assignment_id,
                    message=f"cell {_cell_id(assignment)} was manually adjusted",
                )
            )

    hard_errors.extend(_validate_publish_shift_overlap(assignments))
    hard_errors.extend(_validate_required_employee_dates(assignments, context))
    hard_errors.extend(_validate_publish_generation_state(context))

    arranged_coverage = derive_arranged_coverage(assignments)
    covered_slots = {slot.slot_start_at for slot in arranged_coverage}
    for slot_start_at in sorted(context.required_coverage_slots - covered_slots):
        soft_risks.append(
            RosterPublishIssue(
                code=RosterPublishSoftRiskCode.NO_COVERAGE_HALF_HOUR,
                assignment_id=None,
                message=f"no arranged coverage at {slot_start_at}",
            )
        )

    return RosterPublishValidationResult(
        can_publish=len(hard_errors) == 0,
        hard_errors=hard_errors,
        soft_risks=soft_risks,
        arranged_coverage=arranged_coverage,
    )


def derive_arranged_coverage(
    assignments: list[RosterAssignment],
) -> list[ArrangedCoverageSlot]:
    slot_assignments: dict[str, list[str]] = {}
    for assignment in assignments:
        if assignment.assignment_kind != AssignmentKind.SHIFT:
            continue
        if assignment.interval_start_at is None or assignment.interval_end_at is None:
            continue
        cursor = _parse_datetime(assignment.interval_start_at)
        end = _parse_datetime(assignment.interval_end_at)
        while cursor < end:
            slot_start_at = _format_datetime(cursor)
            slot_assignments.setdefault(slot_start_at, []).append(assignment.assignment_id)
            cursor += timedelta(minutes=30)

    return [
        ArrangedCoverageSlot(
            slot_start_at=slot_start_at,
            arranged_count=len(assignment_ids),
            assignment_ids=assignment_ids,
        )
        for slot_start_at, assignment_ids in sorted(slot_assignments.items())
    ]


def build_publish_diff(
    baseline_assignments: list[RosterAssignment],
    candidate_assignments: list[RosterAssignment],
) -> PublishDiffSummary:
    baseline_by_cell = {_cell_id(item): item for item in baseline_assignments}
    candidate_by_cell = {_cell_id(item): item for item in candidate_assignments}

    added_cell_ids = sorted(set(candidate_by_cell) - set(baseline_by_cell))
    deleted_cell_ids = sorted(set(baseline_by_cell) - set(candidate_by_cell))
    changed_cell_ids = sorted(
        cell_id
        for cell_id in set(baseline_by_cell) & set(candidate_by_cell)
        if _assignment_signature(baseline_by_cell[cell_id])
        != _assignment_signature(candidate_by_cell[cell_id])
    )

    baseline_coverage = {
        slot.slot_start_at: slot.arranged_count
        for slot in derive_arranged_coverage(baseline_assignments)
    }
    candidate_coverage = {
        slot.slot_start_at: slot.arranged_count
        for slot in derive_arranged_coverage(candidate_assignments)
    }
    coverage_deltas = [
        CoverageDelta(
            slot_start_at=slot_start_at,
            baseline_count=baseline_coverage.get(slot_start_at, 0),
            candidate_count=candidate_coverage.get(slot_start_at, 0),
            delta=candidate_coverage.get(slot_start_at, 0)
            - baseline_coverage.get(slot_start_at, 0),
        )
        for slot_start_at in sorted(set(baseline_coverage) | set(candidate_coverage))
        if baseline_coverage.get(slot_start_at, 0)
        != candidate_coverage.get(slot_start_at, 0)
    ]

    return PublishDiffSummary(
        added_cell_ids=added_cell_ids,
        deleted_cell_ids=deleted_cell_ids,
        changed_cell_ids=changed_cell_ids,
        coverage_deltas=coverage_deltas,
    )


def transition_roster_version(
    version: RosterVersion,
    action: RosterVersionAction,
    actor_id: str,
    occurred_at: str,
    effective_at: str | None = None,
    note: str | None = None,
    failure_reason: str | None = None,
    new_version_id: str | None = None,
) -> RosterTransitionResult:
    errors = _validate_transition(version, action, occurred_at, effective_at)
    if errors:
        return RosterTransitionResult(version=version, events=[], errors=errors)

    event = RosterVersionEvent(
        roster_version_id=version.roster_version_id,
        action=action,
        actor_id=actor_id,
        occurred_at=occurred_at,
        note=note,
    )

    if action == RosterVersionAction.SCHEDULE_PUBLISH:
        updated = replace(
            version,
            status=RosterVersionStatus.SCHEDULED_PUBLISHED,
            effective_at=effective_at or occurred_at,
        )
    elif action == RosterVersionAction.ACTIVATE:
        updated = replace(
            version,
            status=RosterVersionStatus.PUBLISHED,
            activated_at=occurred_at,
            activation_failed_reason=None,
        )
    elif action == RosterVersionAction.FAIL_ACTIVATION:
        updated = replace(
            version,
            status=RosterVersionStatus.ACTIVATION_FAILED,
            activation_failed_reason=failure_reason,
        )
    elif action == RosterVersionAction.RETRY_ACTIVATION:
        updated = replace(
            version,
            status=RosterVersionStatus.SCHEDULED_PUBLISHED,
            activation_failed_reason=None,
        )
    elif action == RosterVersionAction.WITHDRAW:
        updated = replace(version, status=RosterVersionStatus.VOIDED)
    elif action == RosterVersionAction.CREATE_REVISION_DRAFT:
        updated = RosterVersion(
            roster_version_id=new_version_id or f"{version.roster_version_id}-REV",
            business_month=version.business_month,
            status=RosterVersionStatus.DRAFT,
            version_type=version.version_type,
            project_id=version.project_id,
            workplace_id=version.workplace_id,
            team_id=version.team_id,
            parent_version_id=version.roster_version_id,
            supersedes_version_id=version.roster_version_id,
        )
    else:
        updated = version

    return RosterTransitionResult(version=updated, events=[event], errors=[])


def acquire_edit_lock(
    existing_lock: RosterEditLock | None,
    roster_version_id: str,
    actor_id: str,
    now: str,
    decision: EditLockDecision = EditLockDecision.ACQUIRE,
) -> RosterEditLockResult:
    if decision == EditLockDecision.FORCE_RELEASE:
        return RosterEditLockResult(
            acquired=True,
            read_only=False,
            lock=None,
            message="lock force released",
        )

    if decision == EditLockDecision.RELEASE:
        if existing_lock is not None and existing_lock.actor_id != actor_id:
            return RosterEditLockResult(
                acquired=False,
                read_only=True,
                lock=existing_lock,
                message="only lock holder can release",
            )
        return RosterEditLockResult(
            acquired=True,
            read_only=False,
            lock=None,
            message="lock released",
        )

    if existing_lock is not None and not _lock_expired(existing_lock, now):
        if existing_lock.actor_id != actor_id:
            return RosterEditLockResult(
                acquired=False,
                read_only=True,
                lock=existing_lock,
                message=f"roster version is locked by {existing_lock.actor_id}",
            )
        renewed = replace(
            existing_lock,
            expires_at=_format_datetime(_parse_datetime(now) + timedelta(minutes=30)),
        )
        return RosterEditLockResult(
            acquired=True,
            read_only=False,
            lock=renewed,
            message="lock renewed",
        )

    lock = RosterEditLock(
        roster_version_id=roster_version_id,
        actor_id=actor_id,
        acquired_at=now,
        expires_at=_format_datetime(_parse_datetime(now) + timedelta(minutes=30)),
    )
    return RosterEditLockResult(
        acquired=True,
        read_only=False,
        lock=lock,
        message="lock acquired",
    )


def _validate_employee_reference(
    assignment: RosterAssignment,
    context: RosterValidationContext,
) -> list[RosterValidationError]:
    employee = context.employees.get(assignment.employee_id)
    if employee is None or not employee.active:
        return [
            RosterValidationError(
                assignment_id=assignment.assignment_id,
                message=(
                    f"employee {assignment.employee_id} is not in the active roster snapshot"
                ),
            )
        ]
    if employee.project_id != assignment.project_id or employee.team_id != assignment.team_id:
        return [
            RosterValidationError(
                assignment_id=assignment.assignment_id,
                message=(
                    f"employee {assignment.employee_id} does not belong to "
                    f"{assignment.project_id}/{assignment.team_id}"
                ),
            )
        ]
    return []


def _validate_shift_interval(assignment: RosterAssignment) -> list[RosterValidationError]:
    if assignment.interval_start_at is None or assignment.interval_end_at is None:
        return [
            RosterValidationError(
                assignment_id=assignment.assignment_id,
                message=f"shift assignment {assignment.assignment_id} must have interval",
            )
        ]
    if _parse_datetime(assignment.interval_start_at) >= _parse_datetime(
        assignment.interval_end_at
    ):
        return [
            RosterValidationError(
                assignment_id=assignment.assignment_id,
                message=f"shift assignment {assignment.assignment_id} has invalid interval",
            )
        ]
    return []


def _validate_shift_overlap(
    assignments: list[RosterAssignment],
) -> list[RosterValidationError]:
    errors: list[RosterValidationError] = []
    shifts_by_employee_day: dict[tuple[str, str], list[RosterAssignment]] = {}
    for assignment in assignments:
        if assignment.assignment_kind != AssignmentKind.SHIFT:
            continue
        shifts_by_employee_day.setdefault(
            (assignment.employee_id, assignment.business_date),
            [],
        ).append(assignment)

    for (employee_id, business_date), shifts in shifts_by_employee_day.items():
        sorted_shifts = sorted(
            shifts,
            key=lambda item: item.interval_start_at or "",
        )
        for previous, current in zip(sorted_shifts, sorted_shifts[1:]):
            if previous.interval_end_at is None or current.interval_start_at is None:
                continue
            if _parse_datetime(previous.interval_end_at) > _parse_datetime(
                current.interval_start_at
            ):
                errors.append(
                    RosterValidationError(
                        assignment_id=current.assignment_id,
                        message=(
                            f"overlapping shift assignments for {employee_id} "
                            f"on {business_date}"
                        ),
                    )
                )
    return errors


def _validate_pending_employees(
    pending_employees: list[PendingRosterEmployee],
    context: RosterValidationContext,
) -> list[RosterValidationError]:
    errors: list[RosterValidationError] = []
    for pending in pending_employees:
        employee = context.employees.get(pending.employee_id)
        if employee is None or not employee.active:
            errors.append(
                RosterValidationError(
                    assignment_id=None,
                    message=(
                        f"pending employee {pending.employee_id} is not in the "
                        "active roster snapshot"
                    ),
                )
            )
            continue
        if employee.project_id != pending.project_id or employee.team_id != pending.team_id:
            errors.append(
                RosterValidationError(
                    assignment_id=None,
                    message=(
                        f"pending employee {pending.employee_id} does not belong to "
                        f"{pending.project_id}/{pending.team_id}"
                    ),
                )
            )
    return errors


def _validate_publish_employee_reference(
    assignment: RosterAssignment,
    context: RosterValidationContext,
) -> list[RosterPublishIssue]:
    employee = context.employees.get(assignment.employee_id)
    if employee is None:
        return [
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.EMPLOYEE_MISSING,
                assignment_id=assignment.assignment_id,
                message=f"employee {assignment.employee_id} is missing from snapshot",
            )
        ]
    if employee.status == "frozen":
        return [
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.EMPLOYEE_FROZEN,
                assignment_id=assignment.assignment_id,
                message=f"employee {assignment.employee_id} is frozen",
            )
        ]
    if employee.status == "left":
        return [
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.EMPLOYEE_LEFT,
                assignment_id=assignment.assignment_id,
                message=f"employee {assignment.employee_id} has left",
            )
        ]
    if not employee.active:
        return [
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.EMPLOYEE_MISSING,
                assignment_id=assignment.assignment_id,
                message=f"employee {assignment.employee_id} is not active",
            )
        ]

    workplace_mismatch = (
        assignment.workplace_id is not None
        and employee.workplace_id is not None
        and employee.workplace_id != assignment.workplace_id
    )
    if (
        employee.project_id != assignment.project_id
        or employee.team_id != assignment.team_id
        or workplace_mismatch
    ):
        return [
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.EMPLOYEE_OUT_OF_SCOPE,
                assignment_id=assignment.assignment_id,
                message=(
                    f"employee {assignment.employee_id} does not belong to "
                    f"{assignment.project_id}/{assignment.workplace_id}/{assignment.team_id}"
                ),
            )
        ]
    return []


def _validate_publish_shift_overlap(
    assignments: list[RosterAssignment],
) -> list[RosterPublishIssue]:
    errors: list[RosterPublishIssue] = []
    shifts_by_employee_day: dict[tuple[str, str], list[RosterAssignment]] = {}
    for assignment in assignments:
        if assignment.assignment_kind != AssignmentKind.SHIFT:
            continue
        shifts_by_employee_day.setdefault(
            (assignment.employee_id, assignment.business_date),
            [],
        ).append(assignment)

    for (employee_id, business_date), shifts in shifts_by_employee_day.items():
        sorted_shifts = sorted(shifts, key=lambda item: item.interval_start_at or "")
        for previous, current in zip(sorted_shifts, sorted_shifts[1:]):
            if previous.interval_end_at is None or current.interval_start_at is None:
                continue
            if _parse_datetime(previous.interval_end_at) > _parse_datetime(
                current.interval_start_at
            ):
                errors.append(
                    RosterPublishIssue(
                        code=RosterPublishHardErrorCode.OVERLAPPING_SHIFT,
                        assignment_id=current.assignment_id,
                        message=(
                            f"overlapping shift assignments for {employee_id} "
                            f"on {business_date}"
                        ),
                    )
                )
    return errors


def _validate_required_employee_dates(
    assignments: list[RosterAssignment],
    context: RosterValidationContext,
) -> list[RosterPublishIssue]:
    covered_employee_dates = {
        (assignment.employee_id, assignment.business_date)
        for assignment in assignments
        if assignment.assignment_kind == AssignmentKind.SHIFT
    }
    errors: list[RosterPublishIssue] = []
    for employee_id, business_date in sorted(
        context.required_employee_dates - covered_employee_dates
    ):
        errors.append(
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.REQUIRED_ASSIGNMENT_MISSING,
                assignment_id=None,
                message=f"required roster cell missing for {employee_id} on {business_date}",
            )
        )
    return errors


def _validate_publish_generation_state(
    context: RosterValidationContext,
) -> list[RosterPublishIssue]:
    errors: list[RosterPublishIssue] = []
    if (
        context.regenerate_conflict_cell_ids
        and not context.regenerate_conflicts_confirmed
    ):
        errors.append(
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.UNCONFIRMED_REGENERATE_CONFLICT,
                assignment_id=None,
                message="regenerate conflicts must be confirmed before publish",
            )
        )
    if context.base_snapshot_stale and not context.base_snapshot_confirmed:
        errors.append(
            RosterPublishIssue(
                code=RosterPublishHardErrorCode.STALE_BASE_SNAPSHOT,
                assignment_id=None,
                message="base reference snapshot is stale and unconfirmed",
            )
        )
    return errors


def _validate_transition(
    version: RosterVersion,
    action: RosterVersionAction,
    occurred_at: str,
    effective_at: str | None,
) -> list[str]:
    allowed_actions = {
        RosterVersionStatus.DRAFT: {RosterVersionAction.SCHEDULE_PUBLISH},
        RosterVersionStatus.SCHEDULED_PUBLISHED: {
            RosterVersionAction.ACTIVATE,
            RosterVersionAction.FAIL_ACTIVATION,
            RosterVersionAction.WITHDRAW,
        },
        RosterVersionStatus.ACTIVATION_FAILED: {
            RosterVersionAction.RETRY_ACTIVATION,
            RosterVersionAction.WITHDRAW,
        },
        RosterVersionStatus.PUBLISHED: {
            RosterVersionAction.WITHDRAW,
            RosterVersionAction.CREATE_REVISION_DRAFT,
        },
    }
    if action not in allowed_actions.get(version.status, set()):
        return [f"cannot {action.value} roster version in {version.status.value} status"]

    if action == RosterVersionAction.SCHEDULE_PUBLISH:
        if effective_at is not None and _parse_datetime(effective_at) < _parse_datetime(
            occurred_at
        ):
            return ["effectiveAt cannot be earlier than current time"]
        if effective_at is not None and _parse_datetime(effective_at) > _month_end(
            version.business_month
        ):
            return ["effectiveAt cannot be after roster month end"]
    return []


def _assignment_signature(assignment: RosterAssignment) -> tuple[object, ...]:
    return (
        assignment.employee_id,
        assignment.business_date,
        assignment.assignment_kind,
        assignment.shift_code,
        assignment.annotation_code,
        assignment.interval_start_at,
        assignment.interval_end_at,
        assignment.project_id,
        assignment.workplace_id,
        assignment.team_id,
    )


def _cell_id(assignment: RosterAssignment) -> str:
    return assignment.roster_cell_id or assignment.assignment_id


def _lock_expired(lock: RosterEditLock, now: str) -> bool:
    return _parse_datetime(lock.expires_at) <= _parse_datetime(now)


def _month_end(business_month: str) -> datetime:
    year_text, month_text = business_month.split("-")
    year = int(year_text)
    month = int(month_text)
    last_day = monthrange(year, month)[1]
    return datetime(year, month, last_day, 23, 59, 59)


def _format_datetime(value: datetime) -> str:
    return value.isoformat(timespec="minutes")


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)
