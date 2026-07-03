import tempfile
import unittest
from pathlib import Path

from backend.app.roster_drafts import (
    AssignmentKind,
    RosterAssignment,
    RosterEditLock,
    RosterVersion,
    RosterVersionAction,
    RosterVersionEvent,
    RosterVersionStatus,
)
from backend.app.roster_persistence import RosterPersistenceRepository


class RosterPersistenceTest(unittest.TestCase):
    def test_draft_cells_events_locks_and_snapshot_survive_new_repository(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'roster.db'}"
            writer = RosterPersistenceRepository(database_url)
            writer.init_schema()

            version = _draft_version()
            writer.save_draft(
                version,
                [
                    _shift_assignment("CELL-001", "EMP-001", sequence=1),
                    _assignment(
                        "CELL-002",
                        "EMP-001",
                        AssignmentKind.MEETING,
                        sequence=2,
                        annotation_code="TEAM-MEETING",
                        start="2026-08-01T15:00",
                        end="2026-08-01T16:00",
                    ),
                    _assignment(
                        "CELL-003",
                        "EMP-001",
                        AssignmentKind.ANNOTATION,
                        sequence=3,
                        annotation_code="NOTE",
                        start=None,
                        end=None,
                    ),
                ],
                actor_id="scheduler-1",
                occurred_at="2026-07-04T09:00",
            )
            writer.append_event(
                RosterVersionEvent(
                    roster_version_id=version.roster_version_id,
                    action=RosterVersionAction.SCHEDULE_PUBLISH,
                    actor_id="scheduler-1",
                    occurred_at="2026-07-04T09:10",
                    note="ready for publish",
                )
            )
            writer.save_edit_lock(
                RosterEditLock(
                    roster_version_id=version.roster_version_id,
                    actor_id="scheduler-1",
                    acquired_at="2026-07-04T09:00",
                    expires_at="2026-07-04T09:30",
                )
            )
            writer.save_published_snapshot(
                roster_version_id=version.roster_version_id,
                shift_counts={"A5": 1},
                arranged_coverage=[
                    {
                        "slot_start_at": "2026-08-01T09:00",
                        "arranged_count": 1,
                        "assignment_ids": ["CELL-001"],
                    }
                ],
                hard_errors=[],
                soft_risks=[{"code": "manual_adjusted_cell", "assignment_id": "CELL-001"}],
                diff_summary={"added_cell_ids": ["CELL-001"]},
            )

            reader = RosterPersistenceRepository(database_url)
            loaded = reader.get_version(version.roster_version_id)

            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.version.business_month, "2026-08")
            self.assertEqual(
                [(cell.roster_cell_id, cell.sequence, cell.assignment_kind) for cell in loaded.cells],
                [
                    ("CELL-001", 1, AssignmentKind.SHIFT),
                    ("CELL-002", 2, AssignmentKind.MEETING),
                    ("CELL-003", 3, AssignmentKind.ANNOTATION),
                ],
            )
            self.assertEqual(loaded.events[0].action, RosterVersionAction.SCHEDULE_PUBLISH)
            self.assertEqual(loaded.edit_lock.actor_id, "scheduler-1")
            self.assertEqual(loaded.published_snapshot.shift_counts, {"A5": 1})
            self.assertEqual(
                loaded.published_snapshot.arranged_coverage[0]["slot_start_at"],
                "2026-08-01T09:00",
            )

    def test_active_version_lookup_and_uniqueness_are_scope_month_bound(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_url = f"sqlite+pysqlite:///{Path(directory) / 'roster.db'}"
            repository = RosterPersistenceRepository(database_url)
            repository.init_schema()

            repository.save_draft(
                _draft_version(roster_version_id="ROSTER-202608-DRAFT-A"),
                [_shift_assignment("CELL-A", "EMP-001")],
                actor_id="scheduler-1",
                occurred_at="2026-07-04T09:00",
            )
            with self.assertRaisesRegex(ValueError, "active draft already exists"):
                repository.save_draft(
                    _draft_version(roster_version_id="ROSTER-202608-DRAFT-B"),
                    [_shift_assignment("CELL-B", "EMP-002")],
                    actor_id="scheduler-1",
                    occurred_at="2026-07-04T09:05",
                )

            active = repository.get_active_draft(
                business_month="2026-08",
                project_id="BOSCH-CS",
                workplace_id="SHANGHAI",
                team_id="G1",
            )

            self.assertIsNotNone(active)
            self.assertEqual(active.version.roster_version_id, "ROSTER-202608-DRAFT-A")

            repository.upsert_version(
                RosterVersion(
                    roster_version_id="ROSTER-202608-SCHEDULED-A",
                    business_month="2026-08",
                    status=RosterVersionStatus.SCHEDULED_PUBLISHED,
                    version_type="primary",
                    project_id="BOSCH-CS",
                    workplace_id="SHANGHAI",
                    team_id="G1",
                    effective_at="2026-08-01T00:00",
                ),
                occurred_at="2026-07-04T10:00",
            )
            with self.assertRaisesRegex(ValueError, "scheduled published already exists"):
                repository.upsert_version(
                    RosterVersion(
                        roster_version_id="ROSTER-202608-SCHEDULED-B",
                        business_month="2026-08",
                        status=RosterVersionStatus.SCHEDULED_PUBLISHED,
                        version_type="primary",
                        project_id="BOSCH-CS",
                        workplace_id="SHANGHAI",
                        team_id="G1",
                        effective_at="2026-08-01T00:00",
                    ),
                    occurred_at="2026-07-04T10:05",
                )


def _draft_version(roster_version_id: str = "ROSTER-202608-DRAFT") -> RosterVersion:
    return RosterVersion(
        roster_version_id=roster_version_id,
        business_month="2026-08",
        status=RosterVersionStatus.DRAFT,
        version_type="primary",
        project_id="BOSCH-CS",
        workplace_id="SHANGHAI",
        team_id="G1",
    )


def _shift_assignment(
    roster_cell_id: str,
    employee_id: str,
    sequence: int = 1,
) -> RosterAssignment:
    return _assignment(
        roster_cell_id,
        employee_id,
        AssignmentKind.SHIFT,
        sequence=sequence,
        shift_code="A5",
        start="2026-08-01T09:00",
        end="2026-08-01T14:30",
    )


def _assignment(
    roster_cell_id: str,
    employee_id: str,
    assignment_kind: AssignmentKind,
    *,
    sequence: int,
    shift_code: str | None = None,
    annotation_code: str | None = None,
    start: str | None,
    end: str | None,
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


if __name__ == "__main__":
    unittest.main()
