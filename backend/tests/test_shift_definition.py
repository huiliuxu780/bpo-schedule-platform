"""Tests for versioned shift definitions (chapter 13.2: never overwrite history)."""

import tempfile
import unittest
from pathlib import Path

from backend.app.models import ShiftActivitySegment, ShiftDefinitionCreateRequest
from backend.app.shift_definition import ShiftDefinitionRepository


def _request(shift_code="SHIFT-A", shift_name="早班", segments=None) -> ShiftDefinitionCreateRequest:
    return ShiftDefinitionCreateRequest(
        shift_code=shift_code,
        shift_name=shift_name,
        effective_from="2026-06-01",
        effective_to="2026-12-31",
        segments=segments
        if segments is not None
        else [ShiftActivitySegment(activity_type="work", start_time="08:00", end_time="16:00")],
    )


class ShiftDefinitionTest(unittest.TestCase):
    def setUp(self) -> None:
        self._directory = tempfile.TemporaryDirectory()
        database_url = (
            f"sqlite+pysqlite:///{Path(self._directory.name) / 'shifts.db'}"
        )
        self.repository = ShiftDefinitionRepository(database_url)
        self.repository.init_schema()

    def tearDown(self) -> None:
        self._directory.cleanup()

    def test_create_and_revise_append_versions_without_overwrite(self) -> None:
        first = self.repository.create_shift_version(_request())
        self.assertEqual(first.shift_definition_id, "SHIFT-A-V1")
        self.assertEqual(first.version_number, 1)
        self.assertEqual(first.status, "active")

        second = self.repository.create_shift_version(
            _request(
                shift_name="早班（调整）",
                segments=[
                    ShiftActivitySegment(activity_type="work", start_time="08:00", end_time="12:00"),
                    ShiftActivitySegment(activity_type="meal", start_time="12:00", end_time="13:00"),
                    ShiftActivitySegment(activity_type="work", start_time="13:00", end_time="16:30"),
                ],
            )
        )
        self.assertEqual(second.shift_definition_id, "SHIFT-A-V2")
        self.assertEqual(second.version_number, 2)

        listing = self.repository.list_shift_definitions(shift_code="SHIFT-A")
        by_id = {item.shift_definition_id: item for item in listing.items}
        self.assertEqual(set(by_id), {"SHIFT-A-V1", "SHIFT-A-V2"})
        # 旧版本归档保留，历史不被覆写
        self.assertEqual(by_id["SHIFT-A-V1"].status, "archived")
        self.assertEqual(by_id["SHIFT-A-V1"].shift_name, "早班")
        self.assertEqual(len(by_id["SHIFT-A-V1"].segments), 1)
        self.assertEqual(by_id["SHIFT-A-V2"].status, "active")
        self.assertEqual(len(by_id["SHIFT-A-V2"].segments), 3)

    def test_cross_day_shift_template_allowed(self) -> None:
        record = self.repository.create_shift_version(
            ShiftDefinitionCreateRequest(
                shift_code="SHIFT-N",
                shift_name="夜班",
                effective_from="2026-06-01",
                effective_to="2026-12-31",
                segments=[
                    ShiftActivitySegment(activity_type="work", start_time="22:00", end_time="06:00")
                ],
                is_cross_day=True,
            )
        )
        self.assertTrue(record.is_cross_day)
        self.assertEqual(record.night_attribution, "start_date")

    def test_validation_errors(self) -> None:
        with self.assertRaises(ValueError) as caught:
            self.repository.create_shift_version(_request(shift_code=""))
        self.assertTrue(str(caught.exception).startswith("SHIFT_CODE_REQUIRED"))

        with self.assertRaises(ValueError) as caught:
            self.repository.create_shift_version(_request(segments=[]))
        self.assertTrue(str(caught.exception).startswith("SHIFT_SEGMENTS_REQUIRED"))

        with self.assertRaises(ValueError) as caught:
            self.repository.create_shift_version(
                _request(
                    segments=[
                        ShiftActivitySegment(
                            activity_type="meal", start_time="12:00", end_time="13:00"
                        )
                    ]
                )
            )
        self.assertTrue(str(caught.exception).startswith("SHIFT_WORK_SEGMENT_REQUIRED"))

        with self.assertRaises(ValueError) as caught:
            self.repository.create_shift_version(
                _request(
                    segments=[
                        ShiftActivitySegment(
                            activity_type="work", start_time="09:00", end_time="09:00"
                        )
                    ]
                )
            )
        self.assertTrue(str(caught.exception).startswith("SHIFT_SEGMENT_INVALID"))

        invalid_period = _request()
        invalid_period.effective_from = "2026-12-31"
        invalid_period.effective_to = "2026-06-01"
        with self.assertRaises(ValueError) as caught:
            self.repository.create_shift_version(invalid_period)
        self.assertTrue(str(caught.exception).startswith("INVALID_EFFECTIVE_PERIOD"))


if __name__ == "__main__":
    unittest.main()
