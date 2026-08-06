"""Tests for status → business activity mappings (chapter 8.4)."""

import tempfile
import unittest
from pathlib import Path

from backend.app.models import StatusMappingPutRequest, StatusMappingRecord
from backend.app.status_mapping import StatusMappingRepository


class StatusMappingTest(unittest.TestCase):
    def setUp(self) -> None:
        self._directory = tempfile.TemporaryDirectory()
        database_url = (
            f"sqlite+pysqlite:///{Path(self._directory.name) / 'status.db'}"
        )
        self.repository = StatusMappingRepository(database_url)
        self.repository.init_schema()

    def tearDown(self) -> None:
        self._directory.cleanup()

    def test_list_empty_and_upsert_round_trip(self) -> None:
        self.assertEqual(self.repository.list_mappings().items, [])

        response = self.repository.upsert_mappings(
            StatusMappingPutRequest(
                items=[
                    StatusMappingRecord(
                        status="在岗",
                        sub_status="接线",
                        status_cd="CD-001",
                        activity_code="hotline_online",
                        activity_name="热线在线",
                        counts_attendance=True,
                        counts_valid_hours=True,
                        counts_production_hours=True,
                        counts_coverage=True,
                        counts_rest=False,
                        counts_punctuality=True,
                    ),
                    StatusMappingRecord(
                        status="在岗",
                        sub_status="小休",
                        status_cd="CD-002",
                        activity_code="short_break",
                        activity_name="小休",
                        counts_attendance=True,
                        counts_rest=True,
                    ),
                ]
            )
        )
        self.assertEqual(len(response.items), 2)
        first = response.items[0]
        self.assertEqual((first.status, first.sub_status), ("在岗", "小休"))
        self.assertTrue(first.counts_rest)
        self.assertFalse(first.counts_production_hours)

    def test_upsert_merges_by_composite_key(self) -> None:
        request = StatusMappingPutRequest(
            items=[
                StatusMappingRecord(
                    status="在岗",
                    sub_status="接线",
                    status_cd="CD-001",
                    activity_code="hotline_online",
                    activity_name="热线在线",
                    counts_attendance=True,
                )
            ]
        )
        self.repository.upsert_mappings(request)

        # 同复合主键再次 PUT：覆盖而不新增
        updated = self.repository.upsert_mappings(
            StatusMappingPutRequest(
                items=[
                    StatusMappingRecord(
                        status="在岗",
                        sub_status="接线",
                        status_cd="CD-001",
                        activity_code="online_service",
                        activity_name="在线服务",
                        counts_attendance=True,
                        counts_coverage=True,
                    )
                ]
            )
        )
        self.assertEqual(len(updated.items), 1)
        self.assertEqual(updated.items[0].activity_code, "online_service")
        self.assertTrue(updated.items[0].counts_coverage)


if __name__ == "__main__":
    unittest.main()
