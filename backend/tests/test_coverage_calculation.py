"""Golden test cases for the half-hour coverage calculation (chapter 13.3).

These cases are the shared source of truth between backend and the future
frontend model layer: exact overlap, partial overlap, cross-day segments,
multi-skill ratios and empty cells.
"""

import unittest

from backend.app.coverage_calculation import (
    CoverageSegment,
    DayCoverageInput,
    calculate_day_coverage,
    calculate_range_coverage,
    segment_interval_contributions,
)


def _row_by_interval(rows):
    return {(row.date, row.interval_start): row for row in rows}


class CoverageCalculationGoldenTest(unittest.TestCase):
    def test_golden_full_overlap_single_segment(self) -> None:
        """黄金用例 1：完全重叠 —— 09:00-09:30 一个 work 段恰好覆盖一个区间。"""
        rows = calculate_day_coverage(
            DayCoverageInput(
                schedule_date="2026-06-01",
                cells={
                    "E1": [
                        CoverageSegment(
                            activity_type="work",
                            start_time="09:00",
                            end_time="09:30",
                        )
                    ]
                },
                demand_by_interval={"09:00": 2.0},
            )
        )
        self.assertEqual(len(rows), 48)
        row = _row_by_interval(rows)[("2026-06-01", "09:00")]
        self.assertEqual(row.planned_headcount, 1.0)
        self.assertEqual(row.demand_headcount, 2.0)
        self.assertEqual(row.gap, 1.0)
        self.assertEqual(row.coverage_rate, 0.5)
        self.assertEqual(row.std_planned_headcount, 1.0)

    def test_golden_partial_overlap_boundary_interval(self) -> None:
        """黄金用例 2：部分重叠 —— 09:15-09:45 只覆盖两个区间各 15 分钟。"""
        contributions = segment_interval_contributions(
            "2026-06-01",
            CoverageSegment(
                activity_type="work",
                start_time="09:15",
                end_time="09:45",
            ),
        )
        self.assertEqual(
            [(item.interval_start, item.overlap_ratio) for item in contributions],
            [("09:00", 0.5), ("09:30", 0.5)],
        )
        rows = calculate_day_coverage(
            DayCoverageInput(
                schedule_date="2026-06-01",
                cells={
                    "E1": [
                        CoverageSegment(
                            activity_type="work",
                            start_time="09:15",
                            end_time="09:45",
                        )
                    ]
                },
            )
        )
        by_interval = _row_by_interval(rows)
        # 物理人数口径：员工在区间内即计 1 人
        self.assertEqual(by_interval[("2026-06-01", "09:00")].planned_headcount, 1.0)
        # 标准人力口径：按重叠比例 15/30
        self.assertEqual(
            by_interval[("2026-06-01", "09:00")].std_planned_headcount, 0.5
        )
        self.assertEqual(
            by_interval[("2026-06-01", "09:30")].std_planned_headcount, 0.5
        )

    def test_golden_cross_day_tail_belongs_to_next_date(self) -> None:
        """黄金用例 3：跨日 —— 22:00-02:00 的尾部计入次日，当日只计 22:00 起。"""
        rows = calculate_range_coverage(
            "2026-06-01",
            "2026-06-02",
            {
                "2026-06-01": {
                    "E1": [
                        CoverageSegment(
                            activity_type="work",
                            start_time="22:00",
                            end_time="02:00",
                            crosses_day=True,
                        )
                    ]
                }
            },
            {},
        )
        by_interval = _row_by_interval(rows)
        # 当日 22:00-23:30 共 4 个区间
        for interval in ("22:00", "22:30", "23:00", "23:30"):
            self.assertEqual(
                by_interval[("2026-06-01", interval)].planned_headcount, 1.0
            )
        # 次日 00:00-01:30 共 4 个区间（夜班归属开始日期但覆盖落在次日）
        for interval in ("00:00", "00:30", "01:00", "01:30"):
            self.assertEqual(
                by_interval[("2026-06-02", interval)].planned_headcount, 1.0
            )
        # 当日凌晨不被错误计入
        self.assertEqual(by_interval[("2026-06-01", "00:00")].planned_headcount, 0.0)
        self.assertEqual(by_interval[("2026-06-02", "02:00")].planned_headcount, 0.0)

    def test_golden_multi_skill_allocation_and_coefficient(self) -> None:
        """黄金用例 4：多技能比例 —— 13.3 公式四因子相乘。"""
        segment = CoverageSegment(
            activity_type="work",
            start_time="10:00",
            end_time="10:30",
            skill_id="SKILL-A",
            allocation_ratio=0.6,
            skill_coefficient=1.2,
            activity_coverage=0.9,
        )
        contributions = segment_interval_contributions("2026-06-01", segment)
        self.assertEqual(len(contributions), 1)
        # 1.0 × 0.6 × 1.2 × 0.9 = 0.648
        self.assertAlmostEqual(contributions[0].std_headcount, 0.648)

        rows = calculate_day_coverage(
            DayCoverageInput(
                schedule_date="2026-06-01",
                cells={"E1": [segment]},
            )
        )
        row = _row_by_interval(rows)[("2026-06-01", "10:00")]
        self.assertEqual(row.planned_headcount, 1.0)
        self.assertAlmostEqual(row.std_planned_headcount, 0.648)

    def test_golden_empty_cells_and_zero_demand(self) -> None:
        """黄金用例 5：空单元格 —— 48 行全零，需求为 0 时 coverage_rate=None。"""
        rows = calculate_day_coverage(
            DayCoverageInput(
                schedule_date="2026-06-01",
                cells={},
                demand_by_interval={"00:00": 0.0},
            )
        )
        self.assertEqual(len(rows), 48)
        for row in rows:
            self.assertEqual(row.planned_headcount, 0.0)
            self.assertEqual(row.std_planned_headcount, 0.0)
            self.assertIsNone(row.coverage_rate)
            self.assertLessEqual(row.gap, 0.0)

    def test_non_work_segments_do_not_count(self) -> None:
        rows = calculate_day_coverage(
            DayCoverageInput(
                schedule_date="2026-06-01",
                cells={
                    "E1": [
                        CoverageSegment(
                            activity_type="meal",
                            start_time="12:00",
                            end_time="13:00",
                        )
                    ]
                },
            )
        )
        row = _row_by_interval(rows)[("2026-06-01", "12:00")]
        self.assertEqual(row.planned_headcount, 0.0)
        self.assertEqual(row.std_planned_headcount, 0.0)

    def test_same_employee_overlapping_segments_count_once_physically(self) -> None:
        rows = calculate_day_coverage(
            DayCoverageInput(
                schedule_date="2026-06-01",
                cells={
                    "E1": [
                        CoverageSegment(
                            activity_type="work",
                            start_time="09:00",
                            end_time="10:00",
                        ),
                        CoverageSegment(
                            activity_type="work",
                            start_time="09:00",
                            end_time="10:00",
                        ),
                    ]
                },
            )
        )
        row = _row_by_interval(rows)[("2026-06-01", "09:00")]
        self.assertEqual(row.planned_headcount, 1.0)
        # 标准口径按分段累加
        self.assertEqual(row.std_planned_headcount, 2.0)

    def test_range_coverage_aggregates_multiple_employees(self) -> None:
        rows = calculate_range_coverage(
            "2026-06-01",
            "2026-06-01",
            {
                "2026-06-01": {
                    "E1": [
                        CoverageSegment(
                            activity_type="work",
                            start_time="09:00",
                            end_time="10:00",
                        )
                    ],
                    "E2": [
                        CoverageSegment(
                            activity_type="work",
                            start_time="09:30",
                            end_time="10:30",
                        )
                    ],
                }
            },
            {"2026-06-01": {"09:30": 2.0}},
        )
        by_interval = _row_by_interval(rows)
        self.assertEqual(by_interval[("2026-06-01", "09:00")].planned_headcount, 1.0)
        self.assertEqual(by_interval[("2026-06-01", "09:30")].planned_headcount, 2.0)
        self.assertEqual(by_interval[("2026-06-01", "09:30")].coverage_rate, 1.0)
        self.assertEqual(by_interval[("2026-06-01", "10:00")].planned_headcount, 1.0)


if __name__ == "__main__":
    unittest.main()
