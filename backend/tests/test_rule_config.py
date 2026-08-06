"""Tests for scheduling rule configuration with scope, effective period and
built-in default annotation (chapter 8.3 / 16)."""

import tempfile
import unittest
from pathlib import Path

from backend.app.models import RuleConfigPutRequest
from backend.app.rule_config import (
    BUILT_IN_DEFAULT_RULES,
    BUILT_IN_DEFAULT_SOURCE,
    USER_CONFIGURED_SOURCE,
    RuleConfigRepository,
    get_rule_config_list,
)


class RuleConfigTest(unittest.TestCase):
    def setUp(self) -> None:
        self._directory = tempfile.TemporaryDirectory()
        database_url = f"sqlite+pysqlite:///{Path(self._directory.name) / 'rules.db'}"
        self.repository = RuleConfigRepository(database_url)
        self.repository.init_schema()

    def tearDown(self) -> None:
        self._directory.cleanup()

    def test_empty_storage_returns_annotated_built_in_defaults(self) -> None:
        for category in ("scheduling", "attendance", "publish"):
            response = get_rule_config_list(self.repository, category)
            self.assertEqual(response.category, category)
            self.assertEqual(len(response.items), 1)
            record = response.items[0]
            self.assertEqual(record.rule_id, f"built-in-{category}")
            self.assertEqual(record.scope_type, "global")
            self.assertEqual(record.fields, BUILT_IN_DEFAULT_RULES[category])
            # 显式标注默认值来源（第16章阈值未确认）
            self.assertIn("built_in_default", record.default_source)
            self.assertEqual(record.default_source, BUILT_IN_DEFAULT_SOURCE)

    def test_upsert_global_rule_and_resolve_merged_fields(self) -> None:
        stored = self.repository.upsert_rule(
            "scheduling",
            RuleConfigPutRequest(
                scope_type="global",
                fields={"max_hours_per_day": 10, "max_consecutive_days": 5},
                effective_from="2026-06-01",
                effective_to="2026-12-31",
            ),
        )
        self.assertEqual(stored.rule_id, "rule-scheduling-global-all")
        self.assertEqual(stored.default_source, USER_CONFIGURED_SOURCE)

        # resolve：全局规则覆盖内置默认，未配置字段保留默认值
        resolved = self.repository.resolve_rule_fields("scheduling")
        self.assertEqual(resolved["max_hours_per_day"], 10)
        self.assertEqual(resolved["max_consecutive_days"], 5)
        self.assertEqual(
            resolved["min_rest_between_shifts_minutes"],
            BUILT_IN_DEFAULT_RULES["scheduling"]["min_rest_between_shifts_minutes"],
        )

        # 再次 PUT 同一 scope 为 upsert，不产生重复记录
        self.repository.upsert_rule(
            "scheduling",
            RuleConfigPutRequest(scope_type="global", fields={"max_hours_per_day": 9}),
        )
        response = get_rule_config_list(self.repository, "scheduling")
        self.assertEqual(len(response.items), 1)
        self.assertEqual(response.items[0].fields, {"max_hours_per_day": 9})

    def test_dept_scope_rule_requires_scope_id_and_keeps_storage(self) -> None:
        with self.assertRaises(ValueError) as caught:
            self.repository.upsert_rule(
                "scheduling",
                RuleConfigPutRequest(scope_type="dept", fields={"max_hours_per_day": 9}),
            )
        self.assertTrue(str(caught.exception).startswith("RULE_SCOPE_REQUIRED"))

        stored = self.repository.upsert_rule(
            "attendance",
            RuleConfigPutRequest(
                scope_type="team",
                scope_id="TEAM-01",
                fields={"late_threshold_minutes": 10},
            ),
        )
        self.assertEqual(stored.rule_id, "rule-attendance-team-TEAM-01")
        # dept/team 规则入库但不影响一期全局 resolve 口径
        resolved = self.repository.resolve_rule_fields("attendance")
        self.assertEqual(resolved["late_threshold_minutes"], 5)

    def test_upsert_validation_errors(self) -> None:
        with self.assertRaises(ValueError) as caught:
            self.repository.upsert_rule(
                "scheduling",
                RuleConfigPutRequest(
                    scope_type="global",
                    fields={"max_hours_per_day": 9},
                    effective_from="2026-12-31",
                    effective_to="2026-06-01",
                ),
            )
        self.assertTrue(str(caught.exception).startswith("INVALID_EFFECTIVE_PERIOD"))

        with self.assertRaises(ValueError) as caught:
            self.repository.upsert_rule(
                "scheduling", RuleConfigPutRequest(scope_type="global", fields={})
            )
        self.assertTrue(str(caught.exception).startswith("RULE_FIELDS_REQUIRED"))


if __name__ == "__main__":
    unittest.main()
