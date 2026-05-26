import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  fallbackDataQualityIssues,
  filterDataQualityIssues,
  getDataQualityIssue,
  summarizeDataQualityExceptionImpact,
  summarizeDataQualityExceptionTop,
  summarizeDataQualityImportBatchImpact,
  summarizeDataQualityIssues,
} from "../../lib/data-quality.ts";
import {
  fallbackImportBatches,
  mapImportBatchResult,
} from "../../lib/import-batch-history.ts";

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

test("data quality import batch impact summarizes linked fallback batches", () => {
  const issue = getDataQualityIssue("DQ-202605-004");
  assert.ok(issue);

  const summary = summarizeDataQualityImportBatchImpact(issue, fallbackImportBatches);

  assert.equal(summary.totalBatchCount, 1);
  assert.equal(summary.totalFailedRows, 19);
  assert.ok(summary.matchedFields.includes("employee_id"));
  assert.ok(summary.affectedObjects.includes("人员排班"));
  assert.equal(summary.items[0].batchId, "BATCH-20260519-001");
  assert.equal(summary.items[0].href, "/import-batches/BATCH-20260519-001");
  assert.ok(summary.items[0].reviewHint.includes("员工"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality import batch impact matches direct failure rows", () => {
  const issue = getDataQualityIssue("DQ-202605-010");
  assert.ok(issue);
  const batch = mapImportBatchResult({
    batch_id: "BATCH-SL-20260526-101",
    entity: "status_log",
    file_name: "status_log_overlap.csv",
    uploaded_by: "现场主管",
    uploaded_at: "2026-05-26T23:00:00+08:00",
    status: "completed_with_errors",
    total_rows: 2,
    success_rows: 1,
    failed_rows: 1,
    warning_rows: 0,
    error_codes: ["status_overlap"],
    failure_rows: [
      {
        batch_id: "BATCH-SL-20260526-101",
        entity: "status_log",
        failed_row_number: 2,
        field_name: "status_start_at",
        error_code: "status_overlap",
        error_message: "状态时间段重叠",
        raw_value: "11:00-11:30",
      },
    ],
  });

  const summary = summarizeDataQualityImportBatchImpact(issue, [batch]);

  assert.equal(summary.totalBatchCount, 1);
  assert.equal(summary.totalFailedRows, 1);
  assert.ok(summary.matchedFields.includes("status_start_at"));
  assert.ok(summary.affectedObjects.includes("状态日志"));
  assert.ok(summary.items[0].reviewHint.includes("失败行"));
});

test("data quality import batch impact exposes empty state", () => {
  const issue = getDataQualityIssue("DQ-202605-009");
  assert.ok(issue);

  const summary = summarizeDataQualityImportBatchImpact(issue, []);

  assert.equal(summary.totalBatchCount, 0);
  assert.equal(summary.totalFailedRows, 0);
  assert.deepEqual(summary.matchedFields, []);
  assert.deepEqual(summary.affectedObjects, []);
  assert.deepEqual(summary.items, []);
});

test("data quality exception top summarizes impacted anomalies", () => {
  const summary = summarizeDataQualityExceptionTop(fallbackDataQualityIssues);

  assert.equal(summary.totalIssueCount, 2);
  assert.equal(summary.totalImpactedExceptionCount, 2);
  assert.equal(summary.totalImpactedPeopleCount, 2);
  assert.equal(summary.topIssue?.issueId, "DQ-202605-010");
  assert.equal(summary.topIssue?.href, "/data-quality/DQ-202605-010");
  assert.equal(summary.topIssue?.impactedExceptionCount, 1);
  assert.ok(summary.topIssue?.impactedPeople.includes("A-1002"));
  assert.ok(summary.topIssue?.affectedObjects.includes("小组成员矩阵异常"));
  assert.ok(summary.topIssue?.nextViewHint.includes("个人履约"));
  assert.ok(summary.items.some((item) => item.issueId === "DQ-202605-004"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality exception top exposes empty state", () => {
  const summary = summarizeDataQualityExceptionTop([]);

  assert.equal(summary.totalIssueCount, 0);
  assert.equal(summary.totalImpactedExceptionCount, 0);
  assert.equal(summary.totalImpactedPeopleCount, 0);
  assert.equal(summary.topIssue, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality issue exception impact summarizes one issue", () => {
  const issue = getDataQualityIssue("DQ-202605-010");
  assert.ok(issue);

  const summary = summarizeDataQualityExceptionImpact(issue);

  assert.equal(summary.impactedExceptionCount, 1);
  assert.equal(summary.impactedPeopleCount, 1);
  assert.ok(summary.impactedPeople.includes("A-1002"));
  assert.equal(summary.primaryException?.label, "小组成员矩阵异常");
  assert.equal(summary.primaryException?.objectId, "late_login");
  assert.ok(summary.affectedObjects.includes("A-1002 2026-05-11 状态轨道"));
  assert.ok(summary.nextViewHint.includes("个人履约"));
  assert.ok(summary.deferredActions.includes("无真实数据修复"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality issue exception impact exposes no-impact state", () => {
  const issue = getDataQualityIssue("DQ-202605-009");
  assert.ok(issue);

  const summary = summarizeDataQualityExceptionImpact(issue);

  assert.equal(summary.impactedExceptionCount, 0);
  assert.equal(summary.impactedPeopleCount, 0);
  assert.equal(summary.primaryException, undefined);
  assert.deepEqual(summary.items, []);
});

test("data quality page renders exception top summary", () => {
  const pageSource = readFileSync(new URL("../../app/data-quality/page.tsx", import.meta.url), "utf8");

  assert.ok(pageSource.includes("summarizeDataQualityExceptionTop"));
  assert.ok(pageSource.includes("影响异常 Top"));
  assert.ok(pageSource.includes("影响异常"));
  assert.ok(pageSource.includes("影响人员"));
  assert.ok(pageSource.includes("下一查看"));
});

test("data quality issue page renders exception impact drilldown", () => {
  const pageSource = readFileSync(new URL("../../app/data-quality/[issueId]/page.tsx", import.meta.url), "utf8");

  assert.ok(pageSource.includes("summarizeDataQualityExceptionImpact"));
  assert.ok(pageSource.includes("影响异常拆解"));
  assert.ok(pageSource.includes("首要异常"));
  assert.ok(pageSource.includes("影响人员"));
  assert.ok(pageSource.includes("下一查看"));
});
