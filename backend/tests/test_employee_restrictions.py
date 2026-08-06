"""Tests for employee scheduling restrictions (PATCH restrictions endpoint)."""

import tempfile
import unittest
from pathlib import Path

from backend.app.master_data_persistence import (
    MasterDataPersistenceRepository,
)
from backend.app.models import EmployeeMasterDataInput


def _employee_input(employee_id: str) -> EmployeeMasterDataInput:
    return EmployeeMasterDataInput(
        employee_id=employee_id,
        employee_name=f"员工{employee_id}",
        status="active",
        effective_from="2026-01-01",
        effective_to="2026-12-31",
    )


class EmployeeRestrictionsTest(unittest.TestCase):
    def setUp(self) -> None:
        self._directory = tempfile.TemporaryDirectory()
        database_url = (
            f"sqlite+pysqlite:///{Path(self._directory.name) / 'restrictions.db'}"
        )
        self.repository = MasterDataPersistenceRepository(database_url)
        self.repository.init_schema()
        self.repository.upsert_employee(_employee_input("E1"), "BATCH-R1")

    def tearDown(self) -> None:
        self._directory.cleanup()

    def test_patch_restrictions_partial_update(self) -> None:
        record = self.repository.update_employee_restrictions(
            "E1", night_shift_allowed=False
        )
        self.assertFalse(record.night_shift_allowed)
        self.assertTrue(record.cross_day_allowed)
        self.assertEqual(record.unavailable_dates, [])

        record = self.repository.update_employee_restrictions(
            "E1", unavailable_dates=["2026-06-01", "2026-06-02"]
        )
        self.assertFalse(record.night_shift_allowed)
        self.assertEqual(record.unavailable_dates, ["2026-06-01", "2026-06-02"])

        # 列表接口同样输出限制字段
        rows = self.repository.list_employees()
        self.assertEqual(len(rows), 1)
        self.assertFalse(rows[0].night_shift_allowed)
        self.assertEqual(rows[0].unavailable_dates, ["2026-06-01", "2026-06-02"])

    def test_patch_missing_employee_raises(self) -> None:
        with self.assertRaises(ValueError) as caught:
            self.repository.update_employee_restrictions(
                "E-MISSING", night_shift_allowed=False
            )
        self.assertTrue(str(caught.exception).startswith("EMPLOYEE_NOT_FOUND"))

    def test_master_data_reimport_preserves_restrictions(self) -> None:
        self.repository.update_employee_restrictions(
            "E1",
            night_shift_allowed=False,
            cross_day_allowed=False,
            unavailable_dates=["2026-07-01"],
        )
        # 重新导入主数据不应重置排班限制
        self.repository.upsert_employee(_employee_input("E1"), "BATCH-R2")
        record = self.repository.get_employee("E1")
        assert record is not None
        self.assertFalse(record.night_shift_allowed)
        self.assertFalse(record.cross_day_allowed)
        self.assertEqual(record.unavailable_dates, ["2026-07-01"])


if __name__ == "__main__":
    unittest.main()
