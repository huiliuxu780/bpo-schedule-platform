import unittest

from backend.app.shift_types import (
    ShiftTypeConfig,
    expand_shift_type_coverages,
)


class ShiftTypeCoverageTest(unittest.TestCase):
    def test_representative_excel_shift_types_expand_to_half_hour_coverage(self) -> None:
        result = expand_shift_type_coverages(
            business_date="2026-07-01",
            shift_types=[
                ShiftTypeConfig(shift_code="Z1", time_expression="07:00-15:00"),
                ShiftTypeConfig(shift_code="A5", time_expression="09:00-14:30"),
                ShiftTypeConfig(
                    shift_code="T1",
                    time_expression="06:30-11:30&22:00-24:00",
                ),
                ShiftTypeConfig(
                    shift_code="T4",
                    time_expression="8:00-12:00&16:30-19:30",
                ),
                ShiftTypeConfig(shift_code="N", time_expression="22:00-07:00"),
                ShiftTypeConfig(
                    shift_code="A12",
                    time_expression="15:30-21:00",
                    special_rule_note="仅适用F1人头",
                ),
            ],
        )

        self.assertEqual(result.exceptions, [])
        self.assertEqual(_count(result, "Z1"), 16)
        self.assertEqual(_count(result, "A5"), 11)
        self.assertEqual(_count(result, "T1"), 14)
        self.assertEqual(_count(result, "T4"), 14)
        self.assertEqual(_count(result, "N"), 18)
        self.assertEqual(_count(result, "A12"), 11)

        night = _intervals(result, "N")
        self.assertEqual(night[0].business_date, "2026-07-01")
        self.assertEqual(night[0].interval_start_at, "2026-07-01T22:00")
        self.assertEqual(night[-1].interval_end_at, "2026-07-02T07:00")

    def test_invalid_shift_type_enters_exception_list_without_blocking_valid_coverage(self) -> None:
        result = expand_shift_type_coverages(
            business_date="2026-07-01",
            shift_types=[
                ShiftTypeConfig(shift_code="Z1", time_expression="07:00-15:00"),
                ShiftTypeConfig(shift_code="BAD", time_expression="night shift"),
            ],
        )

        self.assertEqual(_count(result, "Z1"), 16)
        self.assertEqual(_count(result, "BAD"), 0)
        self.assertEqual(len(result.exceptions), 1)
        self.assertEqual(result.exceptions[0].shift_code, "BAD")
        self.assertIn("Cannot parse", result.exceptions[0].message)


def _intervals(result, shift_code: str):
    return [
        interval
        for interval in result.intervals
        if interval.shift_code == shift_code
    ]


def _count(result, shift_code: str) -> int:
    return len(_intervals(result, shift_code))
