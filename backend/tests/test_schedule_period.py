"""Service tests for schedule periods, matrix editing, publish and versions."""

import tempfile
import unittest
from pathlib import Path

from backend.app.master_data_persistence import (
    EmployeeEntity,
    MasterDataPersistenceRepository,
)
from backend.app.models import (
    CoverageRecalculateRequest,
    MatrixCellChange,
    MatrixCellTarget,
    MatrixCopyOperation,
    MatrixLockOperation,
    MatrixSegment,
    ScheduleMatrixBatchUpdateRequest,
    SchedulePeriodCreateRequest,
    SchedulePublishRequest,
    ScheduleValidateRequest,
)
from backend.app.schedule_period import (
    MatrixVersionConflictError,
    ScheduleMatrixCellEntity,
    SchedulePeriodEntity,
    SchedulePeriodRepository,
    apply_matrix_batch,
    build_period_weeks,
    create_schedule_period_from_batch,
    get_schedule_matrix,
    get_skill_snapshot_records,
    get_version_diff,
    list_period_versions,
    publish_schedule_period,
    recalculate_coverage,
    validate_schedule_period,
)

PERIOD_ID = "PERIOD-2026-06"
NOW = "2026-06-01T00:00:00+00:00"


def _segment(start: str, end: str, **kwargs) -> MatrixSegment:
    return MatrixSegment(start_time=start, end_time=end, **kwargs)


def _segment_rows(*segments: MatrixSegment) -> list[dict]:
    return [segment.model_dump() for segment in segments]


def _make_period_entity(date_from="2026-06-01", date_to="2026-06-07") -> SchedulePeriodEntity:
    return SchedulePeriodEntity(
        period_id=PERIOD_ID,
        month="2026-06",
        status="draft",
        date_from=date_from,
        date_to=date_to,
        version=0,
        weeks_json=[week.model_dump() for week in build_period_weeks(date_from, date_to)],
        created_at=NOW,
        updated_at=NOW,
    )


def _seed_employee(master_repository, employee_id, **overrides) -> None:
    fields = {
        "employee_id": employee_id,
        "employee_name": f"员工{employee_id}",
        "status": "active",
        "employee_type": "internal",
        "organization_id": None,
        "workplace_id": None,
        "effective_from": "2026-01-01",
        "effective_to": "2026-12-31",
        "night_shift_allowed": True,
        "cross_day_allowed": True,
        "unavailable_dates": [],
        "batch_id": "BATCH-TEST",
    }
    fields.update(overrides)
    with master_repository.session_factory.begin() as session:
        session.add(EmployeeEntity(**fields))


class SchedulePeriodRepositoryTest(unittest.TestCase):
    def setUp(self) -> None:
        self._directory = tempfile.TemporaryDirectory()
        self.database_url = (
            f"sqlite+pysqlite:///{Path(self._directory.name) / 'schedule-core.db'}"
        )
        self.repository = SchedulePeriodRepository(self.database_url)
        self.repository.init_schema()
        self.master_repository = MasterDataPersistenceRepository(self.database_url)
        self.master_repository.init_schema()

    def tearDown(self) -> None:
        self._directory.cleanup()

    def test_build_period_weeks_splits_monday_based_chunks(self) -> None:
        # 2026-06-01 是周一，2026-06-07 是周日 → 单周
        weeks = build_period_weeks("2026-06-01", "2026-06-07")
        self.assertEqual(len(weeks), 1)
        self.assertEqual(weeks[0].week_id, "W1")
        self.assertEqual((weeks[0].date_from, weeks[0].date_to), ("2026-06-01", "2026-06-07"))

        # 2026-06-01 至 2026-06-30 覆盖 5 个周块（最后一块截断到月末）
        weeks = build_period_weeks("2026-06-01", "2026-06-30")
        self.assertEqual(len(weeks), 5)
        self.assertEqual(weeks[-1].date_to, "2026-06-30")

    def test_insert_duplicate_period_rejected(self) -> None:
        self.repository.insert_period_with_cells(_make_period_entity(), [])
        with self.assertRaises(ValueError) as caught:
            self.repository.insert_period_with_cells(_make_period_entity(), [])
        self.assertTrue(str(caught.exception).startswith("SCHEDULE_PERIOD_ALREADY_EXISTS"))

    def test_create_period_from_batch_requires_personnel_schedule_batch(self) -> None:
        class StubBatch:
            def __init__(self, file_type):
                class _Batch:
                    pass

                self.batch = _Batch()
                self.batch.file_type = file_type
                self.versions = []

        class StubImportRepository:
            def __init__(self, batch):
                self._batch = batch

            def get_import_batch(self, batch_id):
                return self._batch

        request = SchedulePeriodCreateRequest(
            month="202606", source_batch_id="BATCH-X"
        )
        with self.assertRaises(ValueError) as caught:
            create_schedule_period_from_batch(
                request,
                self.repository,
                import_repository=StubImportRepository(None),
                schedule_repository=None,
            )
        self.assertTrue(str(caught.exception).startswith("MONTH_INVALID"))

        request = SchedulePeriodCreateRequest(
            month="2026-06", source_batch_id="BATCH-X"
        )
        with self.assertRaises(ValueError) as caught:
            create_schedule_period_from_batch(
                request,
                self.repository,
                import_repository=StubImportRepository(None),
                schedule_repository=None,
            )
        self.assertTrue(str(caught.exception).startswith("SOURCE_BATCH_NOT_FOUND"))

        with self.assertRaises(ValueError) as caught:
            create_schedule_period_from_batch(
                request,
                self.repository,
                import_repository=StubImportRepository(StubBatch("forecast")),
                schedule_repository=None,
            )
        self.assertTrue(
            str(caught.exception).startswith("SOURCE_BATCH_TYPE_INVALID")
        )

    def _seed_period_with_cell(self, employee_id="E1", schedule_date="2026-06-01"):
        cell = ScheduleMatrixCellEntity(
            period_id=PERIOD_ID,
            employee_id=employee_id,
            schedule_date=schedule_date,
            segments_json=_segment_rows(_segment("09:00", "12:00")),
            locked=False,
            updated_at=NOW,
        )
        self.repository.insert_period_with_cells(_make_period_entity(), [cell])

    def test_get_matrix_filters_week_and_paginates(self) -> None:
        cells = [
            ScheduleMatrixCellEntity(
                period_id=PERIOD_ID,
                employee_id=employee_id,
                schedule_date=schedule_date,
                segments_json=_segment_rows(_segment("09:00", "10:00")),
                locked=False,
                updated_at=NOW,
            )
            for employee_id, schedule_date in (
                ("E1", "2026-06-01"),
                ("E1", "2026-06-06"),
                ("E2", "2026-06-01"),
            )
        ]
        self.repository.insert_period_with_cells(_make_period_entity(), cells)

        response = get_schedule_matrix(self.repository, PERIOD_ID, week_id="W1")
        self.assertEqual(response.version, 0)
        self.assertEqual(response.date_from, "2026-06-01")
        self.assertEqual(response.date_to, "2026-06-07")
        self.assertEqual(response.total, 3)
        self.assertEqual(response.employees, ["E1", "E2"])

        first_page = get_schedule_matrix(
            self.repository, PERIOD_ID, week_id="W1", limit=2
        )
        self.assertEqual(len(first_page.cells), 2)
        self.assertEqual(first_page.total, 3)
        self.assertIsNotNone(first_page.next_cursor)
        second_page = get_schedule_matrix(
            self.repository,
            PERIOD_ID,
            week_id="W1",
            limit=2,
            cursor=first_page.next_cursor,
        )
        self.assertEqual(len(second_page.cells), 1)
        self.assertIsNone(second_page.next_cursor)

        with self.assertRaises(ValueError) as caught:
            get_schedule_matrix(self.repository, PERIOD_ID, week_id="W9")
        self.assertTrue(str(caught.exception).startswith("SCHEDULE_WEEK_NOT_FOUND"))

        with self.assertRaises(ValueError) as caught:
            get_schedule_matrix(self.repository, "PERIOD-MISSING")
        self.assertTrue(str(caught.exception).startswith("SCHEDULE_PERIOD_NOT_FOUND"))

    def test_matrix_batch_set_copy_clear_lock_and_version_bump(self) -> None:
        self._seed_period_with_cell()
        request = ScheduleMatrixBatchUpdateRequest(
            base_version=0,
            changes=[
                MatrixCellChange(
                    employee_id="E1",
                    schedule_date="2026-06-02",
                    segments=[_segment("13:00", "17:00")],
                )
            ],
            copies=[
                MatrixCopyOperation(
                    source_employee_id="E1",
                    source_date="2026-06-01",
                    targets=[MatrixCellTarget(employee_id="E2", schedule_date="2026-06-01")],
                )
            ],
        )
        response = apply_matrix_batch(self.repository, PERIOD_ID, request)
        self.assertEqual(response.version, 1)
        self.assertEqual(response.accepted, 2)
        self.assertEqual(response.conflicts, [])
        # coverage_delta：新增 13:00-16:30 覆盖
        changed = {(row.date, row.interval_start) for row in response.coverage_delta}
        self.assertIn(("2026-06-02", "13:00"), changed)

        # clear + lock
        clear_request = ScheduleMatrixBatchUpdateRequest(
            base_version=1,
            clears=[MatrixCellTarget(employee_id="E1", schedule_date="2026-06-02")],
            locks=[MatrixLockOperation(employee_id="E2", schedule_date="2026-06-01")],
        )
        response = apply_matrix_batch(self.repository, PERIOD_ID, clear_request)
        self.assertEqual(response.version, 2)
        self.assertEqual(response.accepted, 2)

        matrix = get_schedule_matrix(self.repository, PERIOD_ID)
        cells = {(cell.employee_id, cell.schedule_date): cell for cell in matrix.cells}
        self.assertNotIn(("E1", "2026-06-02"), cells)
        self.assertTrue(cells[("E2", "2026-06-01")].locked)

    def test_matrix_batch_stale_base_version_raises_conflict(self) -> None:
        self._seed_period_with_cell()
        first = apply_matrix_batch(
            self.repository,
            PERIOD_ID,
            ScheduleMatrixBatchUpdateRequest(
                base_version=0,
                changes=[
                    MatrixCellChange(
                        employee_id="E1",
                        schedule_date="2026-06-02",
                        segments=[_segment("10:00", "11:00")],
                    )
                ],
            ),
        )
        self.assertEqual(first.version, 1)

        with self.assertRaises(MatrixVersionConflictError) as caught:
            apply_matrix_batch(
                self.repository,
                PERIOD_ID,
                ScheduleMatrixBatchUpdateRequest(
                    base_version=0,
                    changes=[
                        MatrixCellChange(
                            employee_id="E1",
                            schedule_date="2026-06-03",
                            segments=[_segment("10:00", "11:00")],
                        )
                    ],
                ),
            )
        error = caught.exception
        self.assertEqual(error.current_version, 1)
        self.assertEqual(
            [(conflict.employee_id, conflict.reason) for conflict in error.conflicts],
            [("E1", "BASE_VERSION_STALE")],
        )

    def test_matrix_batch_locked_cell_and_copy_source_missing_conflicts(self) -> None:
        self._seed_period_with_cell()
        apply_matrix_batch(
            self.repository,
            PERIOD_ID,
            ScheduleMatrixBatchUpdateRequest(
                base_version=0,
                locks=[MatrixLockOperation(employee_id="E1", schedule_date="2026-06-01")],
            ),
        )
        response = apply_matrix_batch(
            self.repository,
            PERIOD_ID,
            ScheduleMatrixBatchUpdateRequest(
                base_version=1,
                changes=[
                    MatrixCellChange(
                        employee_id="E1",
                        schedule_date="2026-06-01",
                        segments=[_segment("20:00", "21:00")],
                    )
                ],
                copies=[
                    MatrixCopyOperation(
                        source_employee_id="E-GONE",
                        source_date="2026-06-01",
                        targets=[
                            MatrixCellTarget(employee_id="E2", schedule_date="2026-06-02")
                        ],
                    )
                ],
            ),
        )
        self.assertEqual(response.accepted, 0)
        reasons = {
            (conflict.employee_id, conflict.schedule_date): conflict.reason
            for conflict in response.conflicts
        }
        self.assertEqual(reasons[("E1", "2026-06-01")], "CELL_LOCKED")
        self.assertEqual(reasons[("E2", "2026-06-02")], "COPY_SOURCE_MISSING")

    def test_recalculate_coverage_returns_interval_table(self) -> None:
        self._seed_period_with_cell()
        response = recalculate_coverage(
            self.repository,
            PERIOD_ID,
            CoverageRecalculateRequest(date_from="2026-06-01", date_to="2026-06-01"),
        )
        self.assertEqual(len(response.intervals), 48)
        row = next(
            item for item in response.intervals if item.interval_start == "09:00"
        )
        self.assertEqual(row.planned_headcount, 1.0)
        # 一期 std 口径与物理口径一致（字段预留）
        self.assertEqual(row.std_planned_headcount, row.planned_headcount)
        self.assertEqual(row.std_gap, row.gap)

        with self.assertRaises(ValueError) as caught:
            recalculate_coverage(
                self.repository,
                PERIOD_ID,
                CoverageRecalculateRequest(date_from="2026-06-02", date_to="2026-06-01"),
            )
        self.assertTrue(str(caught.exception).startswith("DATE_RANGE_INVALID"))

    def test_validate_schedule_detects_rule_violations(self) -> None:
        _seed_employee(self.master_repository, "E1")
        _seed_employee(
            self.master_repository,
            "E2",
            night_shift_allowed=False,
            cross_day_allowed=False,
            unavailable_dates=["2026-06-01"],
        )
        cells = [
            # E2：不可排日期 + 时间重叠 + 超时长
            ScheduleMatrixCellEntity(
                period_id=PERIOD_ID,
                employee_id="E2",
                schedule_date="2026-06-01",
                segments_json=_segment_rows(
                    _segment("08:00", "14:00"),
                    _segment("13:00", "18:00"),
                ),
                locked=False,
                updated_at=NOW,
            ),
            # E2：跨日夜班但被禁止
            ScheduleMatrixCellEntity(
                period_id=PERIOD_ID,
                employee_id="E2",
                schedule_date="2026-06-02",
                segments_json=_segment_rows(_segment("22:00", "06:00", crosses_day=True)),
                locked=False,
                updated_at=NOW,
            ),
            # E1：连续 7 天超过 6 天上限（warning）
            *[
                ScheduleMatrixCellEntity(
                    period_id=PERIOD_ID,
                    employee_id="E1",
                    schedule_date=f"2026-06-{day:02d}",
                    segments_json=_segment_rows(_segment("09:00", "17:00")),
                    locked=False,
                    updated_at=NOW,
                )
                for day in range(1, 8)
            ],
        ]
        self.repository.insert_period_with_cells(_make_period_entity(), cells)

        response = validate_schedule_period(
            self.repository,
            self.master_repository,
            {"max_hours_per_day": 8, "max_consecutive_days": 6},
            PERIOD_ID,
            ScheduleValidateRequest(
                org_scope="*", date_from="2026-06-01", date_to="2026-06-07"
            ),
        )
        error_codes = {
            (issue.employee_id, issue.rule_code) for issue in response.errors
        }
        self.assertIn(("E2", "UNAVAILABLE_DATE"), error_codes)
        self.assertIn(("E2", "SEGMENT_OVERLAP"), error_codes)
        self.assertIn(("E2", "CROSS_DAY_FORBIDDEN"), error_codes)
        self.assertIn(("E2", "NIGHT_SHIFT_FORBIDDEN"), error_codes)
        self.assertNotIn(("E1", "SHIFT_MISSING"), error_codes)

        warning_codes = {
            (issue.employee_id, issue.rule_code) for issue in response.warnings
        }
        self.assertIn(("E1", "MAX_CONSECUTIVE_DAYS_EXCEEDED"), warning_codes)
        self.assertIn(("E2", "MAX_HOURS_EXCEEDED"), warning_codes)

    def test_validate_schedule_reports_missing_shift(self) -> None:
        _seed_employee(self.master_repository, "E1")
        self.repository.insert_period_with_cells(_make_period_entity(), [])
        response = validate_schedule_period(
            self.repository,
            self.master_repository,
            {"max_hours_per_day": 8, "max_consecutive_days": 6},
            PERIOD_ID,
            ScheduleValidateRequest(
                org_scope="*", date_from="2026-06-01", date_to="2026-06-07"
            ),
        )
        self.assertEqual(
            [(issue.employee_id, issue.rule_code) for issue in response.errors],
            [("E1", "SHIFT_MISSING")],
        )

    def test_publish_creates_snapshot_and_skill_coefficient_records(self) -> None:
        _seed_employee(self.master_repository, "E1")
        cells = [
            ScheduleMatrixCellEntity(
                period_id=PERIOD_ID,
                employee_id="E1",
                schedule_date="2026-06-01",
                segments_json=_segment_rows(
                    _segment("09:00", "12:00", skill_id="SKILL-A"),
                    _segment(
                        "13:00",
                        "17:00",
                        skill_id="SKILL-B",
                        skill_coefficient=1.25,
                    ),
                ),
                locked=False,
                updated_at=NOW,
            )
        ]
        self.repository.insert_period_with_cells(_make_period_entity(), cells)

        result = publish_schedule_period(
            self.repository,
            self.master_repository,
            PERIOD_ID,
            SchedulePublishRequest(
                org_scope="*", date_from="2026-06-01", date_to="2026-06-07", note="首发"
            ),
        )
        self.assertEqual(result.version_id, f"SPV-{PERIOD_ID}-V1")
        self.assertEqual(result.publication_id, f"PUB-{PERIOD_ID}-V1")

        period = self.repository.get_period(PERIOD_ID)
        assert period is not None
        self.assertEqual(period.status, "published")

        versions = list_period_versions(self.repository, PERIOD_ID)
        self.assertEqual(len(versions.items), 1)
        self.assertEqual(versions.items[0].cell_count, 1)
        self.assertEqual(versions.items[0].note, "首发")

        snapshots = get_skill_snapshot_records(self.repository, result.publication_id)
        snapshot_map = {
            (record.employee_id, record.skill_id): record for record in snapshots
        }
        self.assertEqual(
            snapshot_map[("E1", "SKILL-A")].coefficient, 1.0
        )
        self.assertIn("built_in_default", snapshot_map[("E1", "SKILL-A")].default_source)
        self.assertEqual(snapshot_map[("E1", "SKILL-B")].coefficient, 1.25)
        self.assertEqual(
            snapshot_map[("E1", "SKILL-B")].default_source, "schedule_segment_input"
        )

        # 第二次发布：修改后产生 V2，diff 列出变更单元格，不覆写 V1
        apply_matrix_batch(
            self.repository,
            PERIOD_ID,
            ScheduleMatrixBatchUpdateRequest(
                base_version=0,
                changes=[
                    MatrixCellChange(
                        employee_id="E1",
                        schedule_date="2026-06-01",
                        segments=[_segment("10:00", "14:00", skill_id="SKILL-A")],
                    )
                ],
            ),
        )
        second = publish_schedule_period(
            self.repository,
            self.master_repository,
            PERIOD_ID,
            SchedulePublishRequest(
                org_scope="*", date_from="2026-06-01", date_to="2026-06-07"
            ),
        )
        self.assertEqual(second.version_id, f"SPV-{PERIOD_ID}-V2")

        diff = get_version_diff(self.repository, PERIOD_ID, second.version_id)
        self.assertEqual(diff.compared_from_version_id, f"SPV-{PERIOD_ID}-V1")
        self.assertEqual(len(diff.changed_cells), 1)
        changed = diff.changed_cells[0]
        assert changed.before is not None and changed.after is not None
        self.assertEqual(changed.before[0].start_time, "09:00")
        self.assertEqual(changed.after[0].start_time, "10:00")

        # V1 快照保持不变
        v1_diff = get_version_diff(self.repository, PERIOD_ID, f"SPV-{PERIOD_ID}-V1")
        self.assertIsNone(v1_diff.compared_from_version_id)
        self.assertEqual(len(v1_diff.changed_cells), 1)
        self.assertIsNone(v1_diff.changed_cells[0].before)

        with self.assertRaises(ValueError) as caught:
            get_version_diff(self.repository, PERIOD_ID, "SPV-MISSING")
        self.assertTrue(str(caught.exception).startswith("SCHEDULE_VERSION_NOT_FOUND"))

    def test_publish_rejects_out_of_period_range(self) -> None:
        self.repository.insert_period_with_cells(_make_period_entity(), [])
        with self.assertRaises(ValueError) as caught:
            publish_schedule_period(
                self.repository,
                self.master_repository,
                PERIOD_ID,
                SchedulePublishRequest(
                    org_scope="*", date_from="2026-06-01", date_to="2026-06-30"
                ),
            )
        self.assertTrue(
            str(caught.exception).startswith("DATE_RANGE_OUT_OF_PERIOD")
        )


if __name__ == "__main__":
    unittest.main()
