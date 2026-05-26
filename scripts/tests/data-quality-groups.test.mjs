import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackDataQualityGroups,
  getDataQualityGroup,
  summarizeDataQualityReviewGroupLink,
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

test("data quality review group link summarizes recommendation group coverage", () => {
  const summary = summarizeDataQualityReviewGroupLink("DQ-202605-004")

  assert.equal(summary.representativeIssueId, "DQ-202605-004")
  assert.equal(summary.totalMatchedGroupCount, 1)
  assert.equal(summary.ungroupedIssueCount, 0)
  assert.equal(summary.topGroup?.groupId, "identity-integrity")
  assert.equal(summary.topGroup?.title, "身份与主键完整性")
  assert.equal(summary.topGroup?.risk, "high")
  assert.equal(summary.topGroup?.owner, "数据管理员")
  assert.equal(summary.topGroup?.issueCount, 3)
  assert.equal(summary.topGroup?.href, "/data-quality/groups/identity-integrity")
  assert.ok(summary.topGroup?.sourceTemplates.includes("TPL-MASTER-DATA"))
  assert.ok(summary.topGroup?.traceKeys.includes("agent_binding.employee_id"))
  assert.ok(summary.nextViewHint.includes("质量分组"))
  assert.ok(summary.deferredActions.includes("无批量重导"))
})

test("data quality review group link exposes empty and ungrouped states", () => {
  const empty = summarizeDataQualityReviewGroupLink(undefined)
  const ungrouped = summarizeDataQualityReviewGroupLink("DQ-NOT-GROUPED")

  assert.equal(empty.representativeIssueId, undefined)
  assert.equal(empty.totalMatchedGroupCount, 0)
  assert.equal(empty.ungroupedIssueCount, 0)
  assert.deepEqual(empty.items, [])
  assert.equal(ungrouped.representativeIssueId, "DQ-NOT-GROUPED")
  assert.equal(ungrouped.totalMatchedGroupCount, 0)
  assert.equal(ungrouped.ungroupedIssueCount, 1)
  assert.deepEqual(ungrouped.items, [])
})
