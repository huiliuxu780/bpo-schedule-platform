from dataclasses import dataclass
from datetime import datetime
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
    PUBLISHED = "published"
    ARCHIVED = "archived"


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


@dataclass(frozen=True)
class RosterAssignment:
    assignment_id: str
    employee_id: str
    business_date: str
    assignment_kind: AssignmentKind
    project_id: str
    team_id: str
    shift_code: str | None = None
    annotation_code: str | None = None
    interval_start_at: str | None = None
    interval_end_at: str | None = None


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


@dataclass(frozen=True)
class RosterValidationContext:
    employees: dict[str, EmployeeRosterSnapshot]


@dataclass(frozen=True)
class RosterValidationError:
    assignment_id: str | None
    message: str


@dataclass(frozen=True)
class RosterValidationResult:
    errors: list[RosterValidationError]
    coverage_assignment_ids: list[str]
    pending_employee_ids: list[str]


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


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)
