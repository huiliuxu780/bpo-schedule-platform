import unittest

from backend.app.roster_drafts import (
    AssignmentKind,
    EmployeeRosterSnapshot,
    PendingRosterEmployee,
    RosterAssignment,
    RosterValidationContext,
    RosterVersion,
    RosterVersionStatus,
    PendingReason,
    validate_roster_draft,
)


class RosterDraftDomainModelTest(unittest.TestCase):
    def test_roster_draft_allows_complex_day_without_counting_non_shift_events(self) -> None:
        version = RosterVersion(
            roster_version_id="ROSTER-202607-DRAFT",
            business_month="2026-07",
            status=RosterVersionStatus.DRAFT,
            version_type="primary",
        )
        assignments = [
            RosterAssignment(
                assignment_id="A-1",
                employee_id="EMP-001",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="A-2",
                employee_id="EMP-001",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.MEETING,
                annotation_code="TEAM-MEETING",
                interval_start_at="2026-07-01T15:00",
                interval_end_at="2026-07-01T16:00",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="A-3",
                employee_id="EMP-001",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.ANNOTATION,
                annotation_code="NOTE",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="B-1",
                employee_id="EMP-002",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A2",
                interval_start_at="2026-07-01T07:30",
                interval_end_at="2026-07-01T12:30",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="B-2",
                employee_id="EMP-002",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A10",
                interval_start_at="2026-07-01T14:30",
                interval_end_at="2026-07-01T20:00",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
        ]

        result = validate_roster_draft(version, assignments, [], _context())

        self.assertEqual(result.errors, [])
        self.assertEqual(result.coverage_assignment_ids, ["A-1", "B-1", "B-2"])

    def test_overlapping_shift_assignments_for_same_employee_day_are_rejected(self) -> None:
        assignments = [
            RosterAssignment(
                assignment_id="B-1",
                employee_id="EMP-002",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A2",
                interval_start_at="2026-07-01T07:30",
                interval_end_at="2026-07-01T12:30",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="B-OVERLAP",
                employee_id="EMP-002",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
        ]

        result = validate_roster_draft(_draft_version(), assignments, [], _context())

        self.assertIn(
            "overlapping shift assignments for EMP-002 on 2026-07-01",
            [error.message for error in result.errors],
        )

    def test_reference_snapshot_validates_employee_status_and_team_membership(self) -> None:
        assignments = [
            RosterAssignment(
                assignment_id="BAD-EMPLOYEE",
                employee_id="EMP-404",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="BAD-TEAM",
                employee_id="EMP-003",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                team_id="G1",
            ),
        ]

        result = validate_roster_draft(_draft_version(), assignments, [], _context())

        messages = [error.message for error in result.errors]
        self.assertIn("employee EMP-404 is not in the active roster snapshot", messages)
        self.assertIn("employee EMP-003 does not belong to BOSCH-CS/G1", messages)

    def test_only_draft_roster_versions_are_editable(self) -> None:
        result = validate_roster_draft(
            RosterVersion(
                roster_version_id="ROSTER-202607-PUBLISHED",
                business_month="2026-07",
                status=RosterVersionStatus.PUBLISHED,
                version_type="primary",
            ),
            [],
            [],
            _context(),
        )

        self.assertEqual(result.errors[0].message, "only draft roster versions are editable")

    def test_pending_roster_employees_are_month_level_records(self) -> None:
        pending = PendingRosterEmployee(
            employee_id="EMP-NEW",
            business_month="2026-07",
            reason=PendingReason.NEW_EMPLOYEE,
            project_id="BOSCH-CS",
            team_id="G1",
        )

        result = validate_roster_draft(_draft_version(), [], [pending], _context())

        self.assertEqual(result.errors, [])
        self.assertEqual(result.pending_employee_ids, ["EMP-NEW"])

    def test_unassigned_is_not_allowed_as_daily_assignment(self) -> None:
        assignments = [
            RosterAssignment(
                assignment_id="UNASSIGNED-AS-DAILY-ROW",
                employee_id="EMP-NEW",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.UNASSIGNED,
                project_id="BOSCH-CS",
                team_id="G1",
            ),
        ]

        result = validate_roster_draft(_draft_version(), assignments, [], _context())

        self.assertIn(
            "unassigned must be represented as a pending roster employee",
            [error.message for error in result.errors],
        )


def _draft_version() -> RosterVersion:
    return RosterVersion(
        roster_version_id="ROSTER-202607-DRAFT",
        business_month="2026-07",
        status=RosterVersionStatus.DRAFT,
        version_type="primary",
    )


def _context() -> RosterValidationContext:
    return RosterValidationContext(
        employees={
            "EMP-001": EmployeeRosterSnapshot(
                employee_id="EMP-001",
                active=True,
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            "EMP-002": EmployeeRosterSnapshot(
                employee_id="EMP-002",
                active=True,
                project_id="BOSCH-CS",
                team_id="G1",
            ),
            "EMP-003": EmployeeRosterSnapshot(
                employee_id="EMP-003",
                active=True,
                project_id="BOSCH-CS",
                team_id="G2",
            ),
            "EMP-NEW": EmployeeRosterSnapshot(
                employee_id="EMP-NEW",
                active=True,
                project_id="BOSCH-CS",
                team_id="G1",
            ),
        }
    )
