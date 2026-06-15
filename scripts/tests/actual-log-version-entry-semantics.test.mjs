import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  summarizeActualLogProcessingDetail,
  summarizeActualLogProductionWorkbench,
} from "../../components/actual-log-production-model.ts";

const workbenchPath = new URL(
  "../../components/actual-log-production-workbench.tsx",
  import.meta.url,
);
const detailPagePath = new URL(
  "../../app/actual-logs/production/[batchId]/page.tsx",
  import.meta.url,
);

const actualLogBatch = {
  batch_id: "BATCH-STATUS-001",
  file_name: "status-log.csv",
  file_type: "status_log",
  uploaded_by: "operator",
  uploaded_at: "2026-06-04T08:30:00+08:00",
  business_date_from: "2026-06-04",
  business_date_to: "2026-06-05",
  processing_status: "completed",
  total_rows: 12,
  success_rows: 12,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "actual_logs",
  import_version_id: "BATCH-STATUS-001::v1",
  applied_record_count: 48,
};

test("actual log version list row action uses version semantics", () => {
  const summary = summarizeActualLogProductionWorkbench([actualLogBatch]);

  assert.equal(summary.rows[0].nextActionLabel, "查看日志版本");
  assert.equal(summary.rows[0].detailHref, "/actual-logs/production/BATCH-STATUS-001");
});

test("actual log version detail model exposes a version-list return label", () => {
  const detail = summarizeActualLogProcessingDetail(
    [actualLogBatch],
    "BATCH-STATUS-001",
    null,
  );

  assert.equal(detail.workbenchHref, "/actual-logs/production");
  assert.equal(detail.workbenchLabel, "返回日志版本列表");
});

test("actual log version detail page copy does not fall back to source-batch processing semantics", async () => {
  const workbenchSource = await readFile(workbenchPath, "utf8");
  const detailPageSource = await readFile(detailPagePath, "utf8");

  assert.equal(workbenchSource.includes(">返回登录/状态日志<"), false);
  assert.equal(workbenchSource.includes("日志来源读取失败"), false);
  assert.equal(workbenchSource.includes("明细读取失败"), false);
  assert.equal(workbenchSource.includes("日志版本读取失败"), true);
  assert.equal(detailPageSource.includes("批次明细读取失败"), false);
  assert.equal(detailPageSource.includes("日志版本详情读取失败"), true);
  assert.equal(detailPageSource.includes("日志版本详情"), true);
});
