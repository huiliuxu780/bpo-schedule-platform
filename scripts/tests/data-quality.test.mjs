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
  assert.equal(row?.sourceTemplateId, "TPL-MASTER-DATA");
  assert.equal(row?.sourceField, "agent_binding.employee_id");
  assert.equal(row?.originalValue, "A-9931");
  assert.equal(row?.errorCode, "unknown_foreign_key");
  assert.ok(row?.affectedObjects.some((object) => object.type === "人员排班"));
  assert.ok(
    row?.impactLinks.some(
      (link) => link.target === "/master-data-relations#employee-A-9931"
    )
  );
  assert.equal(row?.recommendation.includes("补齐"), true);
  assert.equal(summary.deferredActions.includes("无真实数据修复"), true);
});

test("data quality issue detail exposes business impact chain", () => {
  const row = getDataQualityIssue("DQ-202605-010");

  assert.ok(row);
  assert.equal(row.sourceTemplateId, "TPL-STATUS-LOG");
  assert.equal(row.affectedObjects[0].objectId, "A-1002");
  assert.ok(row.impactLinks.some((link) => link.type === "status_log"));
  assert.ok(row.impactLinks.some((link) => link.label.includes("个人履约")));
});
