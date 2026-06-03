import assert from "node:assert/strict";
import test from "node:test";

import { summarizeActualLogProductionWorkbench } from "../../components/actual-log-production-model.ts";

const baseLoginBatch = {
  batch_id: "BATCH-LOGIN-001",
  file_name: "login-log.csv",
  file_type: "login_log",
  uploaded_by: "operator",
  uploaded_at: "2026-06-04T08:30:00+08:00",
  business_date_from: "2026-06-04",
  business_date_to: "2026-06-04",
  processing_status: "completed",
  total_rows: 12,
  success_rows: 12,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "actual_logs",
  import_version_id: "BATCH-LOGIN-001::v1",
  applied_record_count: 24,
};

const baseStatusBatch = {
  ...baseLoginBatch,
  batch_id: "BATCH-STATUS-001",
  file_name: "status-log.csv",
  file_type: "status_log",
  business_date_from: "2026-06-04",
  business_date_to: "2026-06-05",
  import_version_id: "BATCH-STATUS-001::v1",
  applied_record_count: 48,
};

test("actual log production workbench shows an empty state without login or status batches", () => {
  const summary = summarizeActualLogProductionWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalVersions, 0);
  assert.equal(summary.loginVersions, 0);
  assert.equal(summary.statusVersions, 0);
  assert.equal(summary.appliedVersions, 0);
  assert.equal(summary.blockedVersions, 0);
  assert.equal(summary.rows.length, 0);
  assert.equal(summary.title, "等待登录/状态日志来源批次");
});

test("actual log production workbench summarizes applied login and status batches", () => {
  const summary = summarizeActualLogProductionWorkbench([
    baseLoginBatch,
    baseStatusBatch,
    {
      ...baseLoginBatch,
      batch_id: "BATCH-MASTER-001",
      file_type: "master_data",
      import_version_id: "BATCH-MASTER-001::v1",
    },
  ]);

  assert.equal(summary.tone, "ready");
  assert.equal(summary.totalVersions, 2);
  assert.equal(summary.loginVersions, 1);
  assert.equal(summary.statusVersions, 1);
  assert.equal(summary.appliedVersions, 2);
  assert.equal(summary.blockedVersions, 0);
  assert.deepEqual(
    summary.rows.map((row) => row.batchId),
    ["BATCH-STATUS-001", "BATCH-LOGIN-001"]
  );
  assert.equal(summary.rows[0].fileTypeLabel, "状态日志");
  assert.equal(summary.rows[0].versionLabel, "BATCH-STATUS-001::v1");
  assert.equal(summary.rows[0].sourceBatchHref, "/data-quality/import-batches/BATCH-STATUS-001");
  assert.equal(summary.rows[0].businessDateLabel, "2026-06-04 至 2026-06-05");
  assert.equal(summary.rows[0].timezoneBoundaryLabel, "Asia/Shanghai 时区校验待处理详情页解释");
  assert.equal(summary.rows[0].crossDayBoundaryLabel, "跨天区间会按业务日切分，明细待 IM106");
  assert.equal(summary.rows[0].processingBoundaryLabel, "状态区间已应用 48 条记录");
  assert.equal(summary.rows[0].blockerSummary, "无阻塞；当前只读展示登录/状态日志生产口径");
});

test("actual log production workbench blocks unapplied actual log batches", () => {
  const summary = summarizeActualLogProductionWorkbench([
    {
      ...baseStatusBatch,
      application_status: "not_applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.appliedVersions, 0);
  assert.equal(summary.blockedVersions, 1);
  assert.equal(summary.rows[0].applicationLabel, "待应用");
  assert.equal(summary.rows[0].processingBoundaryLabel, "等待应用后生成状态区间");
  assert.equal(summary.rows[0].blockerSummary, "日志批次尚未应用到实际日志业务数据");
});

test("actual log production workbench blocks missing actual log version without fabricated processing", () => {
  const summary = summarizeActualLogProductionWorkbench([
    {
      ...baseLoginBatch,
      import_version_id: null,
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.rows[0].versionLabel, "暂无实际日志业务版本");
  assert.equal(summary.rows[0].processingBoundaryLabel, "缺少业务版本，不能解释登录事件");
  assert.equal(summary.rows[0].timezoneBoundaryLabel, "当前列表 API 未暴露逐行时区，不伪造时区异常");
  assert.equal(summary.rows[0].crossDayBoundaryLabel, "当前列表 API 未暴露逐行起止时间，不伪造跨天区间");
  assert.equal(summary.rows[0].blockerSummary, "缺少实际日志业务版本");
});
