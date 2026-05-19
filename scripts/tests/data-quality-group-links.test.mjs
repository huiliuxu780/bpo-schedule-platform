import assert from "node:assert/strict"
import test from "node:test"

import { fallbackDataQualityIssues } from "../../lib/data-quality.ts"
import {
  fallbackDataQualityGroups,
  getDataQualityGroupsForIssue,
  getDataQualityIssueGroupCoverage,
  getUngroupedDataQualityIssueIds,
  summarizeDataQualityGroups,
} from "../../lib/data-quality-groups.ts"

test("data quality groups support issue-to-group reverse lookup", () => {
  const groups = getDataQualityGroupsForIssue("DQ-202605-005")

  assert.equal(groups.length, 1)
  assert.equal(groups[0].id, "time-validity")
  assert.equal(groups[0].risk, "high")
})

test("data quality group coverage maps every local issue", () => {
  const issueIds = fallbackDataQualityIssues.map((issue) => issue.id)
  const coverage = getDataQualityIssueGroupCoverage(issueIds)
  const ungrouped = getUngroupedDataQualityIssueIds(issueIds)

  assert.equal(coverage.length, 10)
  assert.equal(ungrouped.length, 0)
  assert.ok(coverage.every((row) => row.groups.length >= 1))
})

test("data quality group summary exposes grouped issue coverage", () => {
  const summary = summarizeDataQualityGroups(fallbackDataQualityGroups)

  assert.equal(summary.groupedIssueCount, 10)
  assert.equal(summary.groupedIssueCount, summary.totalIssues)
})
