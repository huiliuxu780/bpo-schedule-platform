import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackDataQualityGroups,
  getDataQualityGroup,
  summarizeDataQualityGroups,
} from "../../lib/data-quality-groups.ts"

test("data quality groups summarize business causes and risk", () => {
  const summary = summarizeDataQualityGroups(fallbackDataQualityGroups)

  assert.equal(summary.totalGroups, 4)
  assert.equal(summary.totalIssues, 10)
  assert.equal(summary.highRiskGroups, 2)
  assert.equal(summary.sourceTemplateCount, 5)
  assert.ok(summary.deferredActions.includes("无真实数据修复"))
})

test("data quality group lookup exposes trace keys and issue links", () => {
  const group = getDataQualityGroup("time-validity")

  assert.ok(group)
  assert.equal(group.risk, "high")
  assert.ok(group.issueIds.includes("DQ-202605-005"))
  assert.ok(group.sourceTemplates.includes("TPL-STATUS-LOG"))
  assert.ok(group.traceKeys.includes("start_at/end_at"))
})
