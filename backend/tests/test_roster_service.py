import tempfile
import unittest
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


if __name__ == "__main__":
    unittest.main()
