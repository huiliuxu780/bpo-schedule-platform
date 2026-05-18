import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackDataQualityIssues,
  filterDataQualityIssues,
  getDataQualityIssue,
  summarizeDataQualityIssues,
} from "../../lib/data-quality.ts";

test("data quality summary counts local issue coverage", () => {
  const summary = summarizeDataQualityIssues(fallbackDataQualityIssues);

  assert.equal(summary.total, 10);
  assert.equal(summary.open, 6);
  assert.equal(summary.highSeverity, 3);
  assert.equal(summary.blockedRows, 221);
  assert.deepEqual(summary.sourceCounts.master_data, 4);
  assert.deepEqual(summary.sourceCounts.personnel_schedule, 3);
});

test("data quality filters support source, status, severity, and query", () => {
  const rows = filterDataQualityIssues(fallbackDataQualityIssues, {
    source: "status_log",
    status: "open",
    severity: "high",
    query: "重叠",
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].code, "status_overlap");
});

test("data quality issue lookup exposes recommendation and deferred actions", () => {
  const row = getDataQualityIssue("DQ-202605-004");
  const summary = summarizeDataQualityIssues(fallbackDataQualityIssues);

  assert.equal(row?.entity, "agent_binding");
  assert.equal(row?.fieldName, "employee_id");
  assert.equal(row?.recommendation.includes("补齐"), true);
  assert.equal(summary.deferredActions.includes("无真实数据修复"), true);
});
