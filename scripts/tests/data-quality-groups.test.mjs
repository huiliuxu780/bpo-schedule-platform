import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackDataQualityGroups,
  getDataQualityGroup,
  summarizeDataQualityGroupExceptionCoverage,
  summarizeDataQualityGroupStepImpactDrilldown,
  summarizeDataQualityGroupReviewSequence,
  summarizeDataQualityReviewGroupLink,
  summarizeDataQualityGroups,
} from "../../lib/data-quality-groups.ts"
import { fallbackDataQualityIssues } from "../../lib/data-quality.ts"

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

test("data quality group exception coverage summarizes impacted groups", () => {
  const summary = summarizeDataQualityGroupExceptionCoverage(fallbackDataQualityIssues)

  assert.equal(summary.totalGroupCount, 4)
  assert.equal(summary.totalImpactedGroupCount, 2)
  assert.equal(summary.totalImpactedExceptionCount, 2)
  assert.equal(summary.totalImpactedPeopleCount, 2)
  assert.equal(summary.totalBlockedRows, 39)
  assert.equal(summary.topGroup?.groupId, "time-validity")
  assert.equal(summary.topGroup?.title, "时间有效性")
  assert.equal(summary.topGroup?.risk, "high")
  assert.equal(summary.topGroup?.owner, "运营负责人")
  assert.equal(summary.topGroup?.representativeIssueId, "DQ-202605-010")
  assert.equal(summary.topGroup?.href, "/data-quality/groups/time-validity")
  assert.ok(summary.topGroup?.impactedPeople.includes("A-1002"))
  assert.ok(summary.topGroup?.affectedObjects.includes("小组成员矩阵异常"))
  assert.ok(summary.items.some((item) => item.groupId === "identity-integrity"))
  assert.ok(summary.nextViewHint.includes("履约异常"))
  assert.ok(summary.deferredActions.includes("无真实数据修复"))
})

test("data quality group exception coverage exposes empty state", () => {
  const summary = summarizeDataQualityGroupExceptionCoverage([])

  assert.equal(summary.totalGroupCount, 4)
  assert.equal(summary.totalImpactedGroupCount, 0)
  assert.equal(summary.totalImpactedExceptionCount, 0)
  assert.equal(summary.totalImpactedPeopleCount, 0)
  assert.equal(summary.totalBlockedRows, 0)
  assert.equal(summary.topGroup, undefined)
  assert.deepEqual(summary.items, [])
})

test("data quality group review sequence orders impacted groups", () => {
  const summary = summarizeDataQualityGroupReviewSequence(fallbackDataQualityIssues)

  assert.equal(summary.stepCount, 2)
  assert.ok(summary.headline.includes("时间有效性"))
  assert.equal(summary.firstStep?.groupId, "time-validity")
  assert.equal(summary.firstStep?.sequence, 1)
  assert.equal(summary.firstStep?.owner, "运营负责人")
  assert.equal(summary.firstStep?.representativeIssueId, "DQ-202605-010")
  assert.equal(summary.firstStep?.href, "/data-quality/groups/time-validity")
  assert.ok(summary.firstStep?.impactedPeople.includes("A-1002"))
  assert.ok(summary.steps.some((step) => step.groupId === "identity-integrity"))
  assert.ok(summary.nextViewHint.includes("分组步骤"))
  assert.ok(summary.deferredActions.includes("无真实数据修复"))
})

test("data quality group step impact drilldown links steps to issues and people", () => {
  const summary = summarizeDataQualityGroupStepImpactDrilldown(
    fallbackDataQualityIssues
  )

  assert.equal(summary.stepCount, 2)
  assert.equal(summary.totalImpactedPeopleCount, 2)
  assert.equal(summary.firstItem?.sequence, 1)
  assert.equal(summary.firstItem?.groupId, "time-validity")
  assert.equal(summary.firstItem?.representativeIssueId, "DQ-202605-010")
  assert.equal(summary.firstItem?.issueHref, "/data-quality/DQ-202605-010")
  assert.equal(
    summary.firstItem?.personHref,
    "/person-timeline/A-1002?date=2026-05-11"
  )
  assert.ok(summary.firstItem?.impactedPeople.includes("A-1002"))
  assert.ok(summary.firstItem?.affectedObjects.includes("小组成员矩阵异常"))
  assert.ok(summary.items.some((item) => item.groupId === "identity-integrity"))
  assert.ok(summary.nextViewHint.includes("影响对象"))
  assert.ok(summary.deferredActions.includes("无批量重导"))
})
