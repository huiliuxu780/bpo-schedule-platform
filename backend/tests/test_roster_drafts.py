import unittest

from backend.app.roster_drafts import (
    AssignmentKind,
    EditLockDecision,
    EmployeeRosterSnapshot,
    PendingRosterEmployee,
    RosterAssignment,
    RosterEditLock,
    RosterPublishHardErrorCode,
    RosterPublishSoftRiskCode,
    RosterValidationContext,
    RosterVersion,
    RosterVersionAction,
    RosterVersionStatus,
    PendingReason,
    acquire_edit_lock,
    build_publish_diff,
    derive_arranged_coverage,
    transition_roster_version,
    validate_roster_publish,
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

    def test_publish_readiness_blocks_complete_hard_error_set(self) -> None:
        assignments = [
            RosterAssignment(
                assignment_id="BAD-SHIFT",
                employee_id="EMP-001",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="BAD",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="MISSING-EMPLOYEE",
                employee_id="EMP-404",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="FROZEN-EMPLOYEE",
                employee_id="EMP-FROZEN",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="LEFT-EMPLOYEE",
                employee_id="EMP-LEFT",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="WRONG-SNAPSHOT",
                employee_id="EMP-003",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="OVERLAP-1",
                employee_id="EMP-002",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A2",
                interval_start_at="2026-07-01T07:30",
                interval_end_at="2026-07-01T12:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
            RosterAssignment(
                assignment_id="OVERLAP-2",
                employee_id="EMP-002",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
        ]

        result = validate_roster_publish(
            _draft_version(),
            assignments,
            _publish_context(
                required_employee_dates={("EMP-001", "2026-07-02")},
                regenerate_conflict_cell_ids=["CELL-CONFLICT"],
                regenerate_conflicts_confirmed=False,
                base_snapshot_stale=True,
                base_snapshot_confirmed=False,
            ),
        )

        self.assertEqual(
            {
                error.code
                for error in result.hard_errors
            },
            {
                RosterPublishHardErrorCode.INVALID_SHIFT_TYPE,
                RosterPublishHardErrorCode.EMPLOYEE_MISSING,
                RosterPublishHardErrorCode.EMPLOYEE_FROZEN,
                RosterPublishHardErrorCode.EMPLOYEE_LEFT,
                RosterPublishHardErrorCode.EMPLOYEE_OUT_OF_SCOPE,
                RosterPublishHardErrorCode.OVERLAPPING_SHIFT,
                RosterPublishHardErrorCode.REQUIRED_ASSIGNMENT_MISSING,
                RosterPublishHardErrorCode.UNCONFIRMED_REGENERATE_CONFLICT,
                RosterPublishHardErrorCode.STALE_BASE_SNAPSHOT,
            },
        )
        self.assertFalse(result.can_publish)

    def test_soft_risks_are_reported_without_blocking_publish(self) -> None:
        assignments = [
            RosterAssignment(
                assignment_id="A-1",
                roster_cell_id="CELL-A-1",
                employee_id="EMP-001",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T09:00",
                interval_end_at="2026-07-01T14:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                manually_adjusted=True,
            )
        ]

        result = validate_roster_publish(
            _draft_version(),
            assignments,
            _publish_context(required_coverage_slots={"2026-07-01T14:30"}),
            pending_employees=[
                PendingRosterEmployee(
                    employee_id="EMP-NEW",
                    business_month="2026-07",
                    reason=PendingReason.NEW_EMPLOYEE,
                    project_id="BOSCH-CS",
                    team_id="G1",
                )
            ],
        )

        self.assertTrue(result.can_publish)
        self.assertEqual(result.hard_errors, [])
        self.assertEqual(
            [risk.code for risk in result.soft_risks],
            [
                RosterPublishSoftRiskCode.PENDING_EMPLOYEE,
                RosterPublishSoftRiskCode.MANUAL_ADJUSTED_CELL,
                RosterPublishSoftRiskCode.NO_COVERAGE_HALF_HOUR,
            ],
        )

    def test_transition_roster_version_handles_scheduled_activation_withdraw_retry_and_revision(self) -> None:
        version = _draft_version(business_month="2026-08")
        scheduled = transition_roster_version(
            version,
            RosterVersionAction.SCHEDULE_PUBLISH,
            actor_id="scheduler-1",
            occurred_at="2026-07-02T10:00",
            effective_at="2026-08-01T00:00",
            note="publish next month",
        ).version
        self.assertEqual(scheduled.status, RosterVersionStatus.SCHEDULED_PUBLISHED)

        activated = transition_roster_version(
            scheduled,
            RosterVersionAction.ACTIVATE,
            actor_id="system",
            occurred_at="2026-08-01T00:00",
        ).version
        self.assertEqual(activated.status, RosterVersionStatus.PUBLISHED)

        failed = transition_roster_version(
            scheduled,
            RosterVersionAction.FAIL_ACTIVATION,
            actor_id="system",
            occurred_at="2026-08-01T00:00",
            failure_reason="snapshot changed",
        ).version
        self.assertEqual(failed.status, RosterVersionStatus.ACTIVATION_FAILED)

        retried = transition_roster_version(
            failed,
            RosterVersionAction.RETRY_ACTIVATION,
            actor_id="scheduler-1",
            occurred_at="2026-08-01T00:05",
        ).version
        self.assertEqual(retried.status, RosterVersionStatus.SCHEDULED_PUBLISHED)

        withdrawn = transition_roster_version(
            scheduled,
            RosterVersionAction.WITHDRAW,
            actor_id="scheduler-1",
            occurred_at="2026-07-20T09:00",
        ).version
        self.assertEqual(withdrawn.status, RosterVersionStatus.VOIDED)

        revision = transition_roster_version(
            activated,
            RosterVersionAction.CREATE_REVISION_DRAFT,
            actor_id="scheduler-1",
            occurred_at="2026-08-02T09:00",
            new_version_id="ROSTER-202608-REV-1",
        ).version
        self.assertEqual(revision.status, RosterVersionStatus.DRAFT)
        self.assertEqual(revision.parent_version_id, activated.roster_version_id)

    def test_scheduled_publish_rejects_past_or_month_end_effective_time(self) -> None:
        past = transition_roster_version(
            _draft_version(),
            RosterVersionAction.SCHEDULE_PUBLISH,
            actor_id="scheduler-1",
            occurred_at="2026-07-02T10:00",
            effective_at="2026-07-02T09:59",
        )
        after_month = transition_roster_version(
            _draft_version(),
            RosterVersionAction.SCHEDULE_PUBLISH,
            actor_id="scheduler-1",
            occurred_at="2026-07-02T10:00",
            effective_at="2026-08-01T00:00",
        )

        self.assertEqual(past.errors, ["effectiveAt cannot be earlier than current time"])
        self.assertEqual(after_month.errors, ["effectiveAt cannot be after roster month end"])

    def test_arranged_half_hour_coverage_and_publish_diff_are_derived_from_shift_cells(self) -> None:
        baseline = [
            RosterAssignment(
                assignment_id="BASE-A",
                roster_cell_id="CELL-A",
                employee_id="EMP-001",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A2",
                interval_start_at="2026-07-01T07:30",
                interval_end_at="2026-07-01T08:30",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )
        ]
        candidate = [
            baseline[0],
            RosterAssignment(
                assignment_id="NEW-B",
                roster_cell_id="CELL-B",
                employee_id="EMP-002",
                business_date="2026-07-01",
                assignment_kind=AssignmentKind.SHIFT,
                shift_code="A5",
                interval_start_at="2026-07-01T08:00",
                interval_end_at="2026-07-01T09:00",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
        ]

        coverage = derive_arranged_coverage(candidate)
        diff = build_publish_diff(baseline, candidate)

        self.assertEqual(
            [(slot.slot_start_at, slot.arranged_count) for slot in coverage],
            [
                ("2026-07-01T07:30", 1),
                ("2026-07-01T08:00", 2),
                ("2026-07-01T08:30", 1),
            ],
        )
        self.assertEqual(diff.added_cell_ids, ["CELL-B"])
        self.assertEqual(
            [(delta.slot_start_at, delta.baseline_count, delta.candidate_count, delta.delta) for delta in diff.coverage_deltas],
            [
                ("2026-07-01T08:00", 1, 2, 1),
                ("2026-07-01T08:30", 0, 1, 1),
            ],
        )

    def test_edit_lock_allows_single_editor_renew_release_force_release_and_expiry(self) -> None:
        first = acquire_edit_lock(
            existing_lock=None,
            roster_version_id="ROSTER-202607-DRAFT",
            actor_id="scheduler-1",
            now="2026-07-02T10:00",
        )
        denied = acquire_edit_lock(
            existing_lock=first.lock,
            roster_version_id="ROSTER-202607-DRAFT",
            actor_id="scheduler-2",
            now="2026-07-02T10:10",
        )
        renewed = acquire_edit_lock(
            existing_lock=first.lock,
            roster_version_id="ROSTER-202607-DRAFT",
            actor_id="scheduler-1",
            now="2026-07-02T10:20",
        )
        expired_reacquire = acquire_edit_lock(
            existing_lock=renewed.lock,
            roster_version_id="ROSTER-202607-DRAFT",
            actor_id="scheduler-2",
            now="2026-07-02T10:51",
        )
        released = acquire_edit_lock(
            existing_lock=expired_reacquire.lock,
            roster_version_id="ROSTER-202607-DRAFT",
            actor_id="scheduler-2",
            now="2026-07-02T10:52",
            decision=EditLockDecision.RELEASE,
        )
        forced = acquire_edit_lock(
            existing_lock=first.lock,
            roster_version_id="ROSTER-202607-DRAFT",
            actor_id="manager-1",
            now="2026-07-02T10:12",
            decision=EditLockDecision.FORCE_RELEASE,
        )

        self.assertTrue(first.acquired)
        self.assertFalse(denied.acquired)
        self.assertTrue(denied.read_only)
        self.assertEqual(renewed.lock.expires_at, "2026-07-02T10:50")
        self.assertEqual(expired_reacquire.lock.actor_id, "scheduler-2")
        self.assertIsNone(released.lock)
        self.assertIsNone(forced.lock)


def _draft_version(business_month: str = "2026-07") -> RosterVersion:
    return RosterVersion(
        roster_version_id="ROSTER-202607-DRAFT",
        business_month=business_month,
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


def _publish_context(
    required_employee_dates: set[tuple[str, str]] | None = None,
    regenerate_conflict_cell_ids: list[str] | None = None,
    regenerate_conflicts_confirmed: bool = True,
    base_snapshot_stale: bool = False,
    base_snapshot_confirmed: bool = True,
    required_coverage_slots: set[str] | None = None,
) -> RosterValidationContext:
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
            "EMP-003": EmployeeRosterSnapshot(
                employee_id="EMP-003",
                active=True,
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G2",
            ),
            "EMP-FROZEN": EmployeeRosterSnapshot(
                employee_id="EMP-FROZEN",
                active=False,
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                status="frozen",
            ),
            "EMP-LEFT": EmployeeRosterSnapshot(
                employee_id="EMP-LEFT",
                active=False,
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
                status="left",
            ),
            "EMP-NEW": EmployeeRosterSnapshot(
                employee_id="EMP-NEW",
                active=True,
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            ),
        },
        valid_shift_codes={"A2", "A5"},
        required_employee_dates=required_employee_dates or set(),
        regenerate_conflict_cell_ids=regenerate_conflict_cell_ids or [],
        regenerate_conflicts_confirmed=regenerate_conflicts_confirmed,
        base_snapshot_stale=base_snapshot_stale,
        base_snapshot_confirmed=base_snapshot_confirmed,
        required_coverage_slots=required_coverage_slots or set(),
    )
