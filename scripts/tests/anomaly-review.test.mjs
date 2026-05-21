import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackAnomalyReviewCases,
  filterAnomalyReviewCases,
  summarizeAnomalyReviewCases,
} from "../../lib/anomaly-review.ts";

test("anomaly review summary counts status, severity, and source coverage", () => {
  const summary = summarizeAnomalyReviewCases(fallbackAnomalyReviewCases);

  assert.equal(summary.total, 8);
  assert.equal(summary.pending, 4);
  assert.equal(summary.confirmed, 2);
  assert.equal(summary.normalMarked, 2);
  assert.equal(summary.highSeverity, 3);
  assert.deepEqual(summary.sourceCounts, {
    forecast_schedule: 2,
    schedule_login: 3,
    schedule_status: 1,
    master_data: 1,
    data_quality: 1,
  });
});

test("anomaly review filters combine owner, root cause, status, and query", () => {
  const rows = filterAnomalyReviewCases(fallbackAnomalyReviewCases, {
    owner: "现场主管",
    rootCause: "人员问题",
    status: "pending",
    query: "迟到",
  });

  assert.deepEqual(rows.map((row) => row.id), ["AR-202605-004"]);
});

test("anomaly review summary keeps deferred action boundaries explicit", () => {
  const summary = summarizeAnomalyReviewCases(fallbackAnomalyReviewCases);

  assert.deepEqual(summary.deferredActions, [
    "无复核提交",
    "无审批流",
    "无权限隔离",
    "无导出或批量处理",
    "无真实异常计算",
  ]);
});

test("master data anomaly exposes reverse lookup target", () => {
  const row = fallbackAnomalyReviewCases.find((item) => item.id === "AR-202605-007");

  assert.equal(row?.relatedEmployeeId, "A-9931");
  assert.equal(row?.masterDataRelationTarget, "/master-data-relations#employee-A-9931");
});
