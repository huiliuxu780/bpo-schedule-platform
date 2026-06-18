import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeActualLogImportDialog,
  summarizeActualLogProductionWorkbench,
} = jiti("../../components/actual-log-production-model.ts");

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
  assert.equal(summary.rows[0].detailHref, "/actual-logs/production/BATCH-STATUS-001");
  assert.equal(summary.rows[0].businessDateLabel, "2026-06-04 至 2026-06-05");
  assert.equal(summary.rows[0].timezoneCheckLabel, "Asia/Shanghai 时区校验可查看");
  assert.equal(summary.rows[0].crossDayCheckLabel, "跨天区间按业务日切分");
  assert.equal(summary.rows[0].processingStatusLabel, "状态区间已应用 48 条记录");
  assert.equal(summary.rows[0].blockerSummary, "无阻塞");
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
  assert.equal(summary.rows[0].processingStatusLabel, "等待应用后生成状态区间");
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
  assert.equal(summary.rows[0].processingStatusLabel, "缺少业务版本，不能解释登录事件");
  assert.equal(summary.rows[0].timezoneCheckLabel, "暂无逐行时区明细");
  assert.equal(summary.rows[0].crossDayCheckLabel, "暂无逐行起止时间");
  assert.equal(summary.rows[0].blockerSummary, "缺少实际日志业务版本");
});

test("actual log import dialog summary keeps login and status upload flows in actual-log page context", () => {
  const loginDialog = summarizeActualLogImportDialog({
    logType: "login",
    batches: [
      {
        ...baseLoginBatch,
        batch_id: "BATCH-LOGIN-IMPORT-001",
        total_rows: 8,
        success_rows: 7,
        failed_rows: 1,
        application_status: "not_applied",
        import_version_id: "BATCH-LOGIN-IMPORT-001::v1",
        applied_record_count: 0,
      },
    ],
    templates: [
      {
        template_id: "TPL-LOGIN-001",
        template_name: "登录日志模板",
        file_type: "login_log",
        field_mapping: { event_time: "event_time" },
        required_fields: ["event_time"],
        is_active: true,
        updated_at: "2026-06-12T09:00:00+08:00",
      },
      {
        template_id: "TPL-STATUS-001",
        template_name: "状态日志模板",
        file_type: "status_log",
        field_mapping: { start_at: "start_at" },
        required_fields: ["start_at"],
        is_active: true,
        updated_at: "2026-06-12T09:00:00+08:00",
      },
    ],
    uploadStatus: "success",
    uploadBatchId: "BATCH-LOGIN-IMPORT-001",
  });
  const statusDialog = summarizeActualLogImportDialog({
    logType: "status",
    batches: [],
    templates: [
      {
        template_id: "TPL-STATUS-001",
        template_name: "状态日志模板",
        file_type: "status_log",
        field_mapping: { start_at: "start_at" },
        required_fields: ["start_at"],
        is_active: true,
        updated_at: "2026-06-12T09:00:00+08:00",
      },
    ],
  });

  assert.equal(loginDialog.openHref, "/actual-logs/production?import_dialog=1&log_type=login");
  assert.equal(statusDialog.openHref, "/actual-logs/production?import_dialog=1&log_type=status");
  assert.equal(loginDialog.closeHref, "/actual-logs/production");
  assert.equal(loginDialog.resultRedirectTo, "/actual-logs/production?import_dialog=1&log_type=login");
  assert.equal(statusDialog.resultRedirectTo, "/actual-logs/production?import_dialog=1&log_type=status");
  assert.equal(loginDialog.fileType, "login_log");
  assert.equal(statusDialog.fileType, "status_log");
  assert.equal(loginDialog.templateDownloadName, "login-log-template.csv");
  assert.equal(statusDialog.templateDownloadName, "status-log-template.csv");
  assert.equal(loginDialog.templateDownloadHref.startsWith("data:text/csv;charset=utf-8,"), true);
  assert.deepEqual(loginDialog.steps.map((step) => step.key), ["upload", "mapping", "result"]);
  assert.deepEqual(loginDialog.activeTemplates.map((template) => template.template_id), ["TPL-LOGIN-001"]);
  assert.equal(loginDialog.result?.tone, "success");
  assert.equal(loginDialog.result?.title, "导入已提交");
  assert.equal(loginDialog.result?.rowSummary, "成功 7 行 / 失败 1 行");
  assert.equal(loginDialog.result?.batchHref, "/data-quality/import-batches/BATCH-LOGIN-IMPORT-001");
});
