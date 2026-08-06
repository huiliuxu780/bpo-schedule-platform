import assert from "node:assert/strict";
import test from "node:test";

import { summarizeImportTaskDialog } from "../../lib/import-task-model.ts";

function batch(overrides = {}) {
  return {
    batch_id: "BATCH-TEST-001",
    file_name: "seed.csv",
    file_type: "personnel_schedule",
    uploaded_by: "planner",
    uploaded_at: "2026-08-06T03:00:00",
    business_date_from: "2026-06-01",
    business_date_to: "2026-06-30",
    processing_status: "completed",
    total_rows: 12,
    success_rows: 10,
    failed_rows: 2,
    warning_rows: 0,
    version_count: 1,
    application_status: "not_applied",
    application_target: "",
    import_version_id: null,
    applied_record_count: 0,
    ...overrides,
  };
}

function template(overrides = {}) {
  return {
    template_id: "TPL-001",
    template_name: "排班模板",
    file_type: "personnel_schedule",
    is_active: true,
    ...overrides,
  };
}

const emptyBatches = [];
const emptyTemplates = [];

test("schedule variant summarizes dialog content and open/close/result redirects", () => {
  const summary = summarizeImportTaskDialog({
    variant: "schedule",
    routePrefix: "/schedule-desk",
    batches: emptyBatches,
    templates: emptyTemplates,
  });

  assert.equal(summary.title, "排班导入");
  assert.equal(summary.fileType, "personnel_schedule");
  assert.equal(summary.variant, "schedule");
  assert.equal(summary.logType, null);
  assert.equal(summary.batchIdPlaceholder, "SCH-20260612-001");
  assert.equal(summary.uploaderDefault, "planner");
  assert.deepEqual(summary.defaultFieldMapping, {
    schedule_date: "schedule_date",
    employee_id: "employee_id",
    workplace_id: "workplace_id",
    supplier_id: "supplier_id",
    skill_id: "skill_id",
    shift_type_id: "shift_type_id",
    start_time: "start_time",
    end_time: "end_time",
  });
  assert.deepEqual(summary.steps.map((step) => step.key), [
    "upload",
    "mapping",
    "result",
  ]);
  assert.equal(summary.openHref, "/schedule-desk?import_dialog=1");
  assert.equal(summary.closeHref, "/schedule-desk");
  assert.equal(summary.resultRedirectTo, "/schedule-desk?import_dialog=1");
  assert.ok(summary.templateDownloadHref.startsWith("data:text/csv"));
  assert.equal(summary.templateDownloadName, "personnel-schedule-template.csv");
  assert.equal(summary.result, null);
});

test("actual-log variant distinguishes login and status sub variants", () => {
  const login = summarizeImportTaskDialog({
    variant: "actual-log",
    routePrefix: "/execution",
    logType: "login",
    batches: emptyBatches,
    templates: emptyTemplates,
  });
  const status = summarizeImportTaskDialog({
    variant: "actual-log",
    routePrefix: "/execution",
    logType: "status",
    batches: emptyBatches,
    templates: emptyTemplates,
  });

  assert.equal(login.title, "登录日志导入");
  assert.equal(login.fileType, "login_log");
  assert.equal(login.logType, "login");
  assert.equal(status.title, "状态日志导入");
  assert.equal(status.fileType, "status_log");
  assert.equal(status.logType, "status");
  assert.deepEqual(Object.keys(login.defaultFieldMapping).sort(), [
    "employee_id",
    "event_id",
    "event_time",
    "event_type",
    "timezone",
  ]);
  assert.deepEqual(Object.keys(status.defaultFieldMapping).sort(), [
    "category",
    "employee_id",
    "end_at",
    "external_status_code",
    "interval_id",
    "is_productive",
    "normalized_status",
    "record_type",
    "start_at",
    "timezone",
  ]);
  assert.equal(login.openHref, "/execution?import_dialog=1&log_type=login");
  assert.equal(status.openHref, "/execution?import_dialog=1&log_type=status");
});

test("master-data variant keeps host tab query in redirects", () => {
  const summary = summarizeImportTaskDialog({
    variant: "master-data",
    routePrefix: "/base-config?tab=employees",
    batches: emptyBatches,
    templates: emptyTemplates,
  });

  assert.equal(summary.title, "客服人员批量导入");
  assert.equal(summary.fileType, "master_data");
  assert.equal(summary.uploaderDefault, "operator");
  assert.equal(summary.openHref, "/base-config?tab=employees&import_dialog=1");
  assert.equal(summary.closeHref, "/base-config?tab=employees");
  assert.equal(summary.resultRedirectTo, "/base-config?tab=employees&import_dialog=1");
});

test("forecast variant is complete in the model layer", () => {
  const summary = summarizeImportTaskDialog({
    variant: "forecast",
    routePrefix: "/demand-plans/production",
    batches: emptyBatches,
    templates: emptyTemplates,
  });

  assert.equal(summary.title, "需求预测导入");
  assert.equal(summary.fileType, "demand_forecast");
  assert.equal(summary.templateDownloadName, "demand-forecast-template.csv");
  assert.deepEqual(summary.defaultFieldMapping, {
    forecast_date: "forecast_date",
    interval_start: "interval_start",
    interval_end: "interval_end",
    workplace_id: "workplace_id",
    skill_id: "skill_id",
    demand_level: "demand_level",
    required_agents: "required_agents",
  });
  assert.equal(summary.openHref, "/demand-plans/production?import_dialog=1");
});

test("activeTemplates filters by variant file type and active flag", () => {
  const summary = summarizeImportTaskDialog({
    variant: "schedule",
    routePrefix: "/schedule-desk",
    batches: emptyBatches,
    templates: [
      template({ template_id: "TPL-SCH-1", template_name: "排班模板A", file_type: "personnel_schedule" }),
      template({ template_id: "TPL-SCH-2", template_name: "排班模板B", file_type: "personnel_schedule" }),
      template({ template_id: "TPL-SCH-3", template_name: "停用排班模板", file_type: "personnel_schedule", is_active: false }),
      template({ template_id: "TPL-MD-1", template_name: "主数据模板", file_type: "master_data" }),
      template({ template_id: "TPL-LOG-1", template_name: "登录模板", file_type: "login_log" }),
    ],
  });

  assert.deepEqual(
    summary.activeTemplates.map((item) => item.template_id),
    ["TPL-SCH-1", "TPL-SCH-2"]
  );
});

test("result reports success rows with batch detail link", () => {
  const summary = summarizeImportTaskDialog({
    variant: "schedule",
    routePrefix: "/schedule-desk",
    batches: [batch({ batch_id: "BATCH-SCH-001", success_rows: 10, failed_rows: 2 })],
    templates: emptyTemplates,
    uploadStatus: "success",
    uploadBatchId: "BATCH-SCH-001",
  });

  assert.deepEqual(summary.result, {
    tone: "success",
    title: "导入已提交",
    detail: "排班导入批次 BATCH-SCH-001 已创建。",
    rowSummary: "成功 10 行 / 失败 2 行",
    batchHref: "/data-quality/import-batches/BATCH-SCH-001",
  });
});

test("result reports failure reason without a batch", () => {
  const summary = summarizeImportTaskDialog({
    variant: "actual-log",
    routePrefix: "/execution",
    logType: "login",
    batches: emptyBatches,
    templates: emptyTemplates,
    uploadStatus: "failed",
    uploadReason: "missing_required_fields",
  });

  assert.equal(summary.result?.tone, "failed");
  assert.equal(summary.result?.title, "导入未提交");
  assert.equal(summary.result?.detail, "失败原因：missing_required_fields");
  assert.equal(summary.result?.rowSummary, "未形成可处理的登录日志导入批次");
  assert.equal(summary.result?.batchHref, null);
});

test("upload params only surface in the matching actual-log sub variant", () => {
  const login = summarizeImportTaskDialog({
    variant: "actual-log",
    routePrefix: "/execution",
    logType: "login",
    batches: [batch({ batch_id: "BATCH-LOG-001" })],
    templates: emptyTemplates,
    uploadStatus: "success",
    uploadBatchId: "BATCH-LOG-001",
  });
  // 页面按 logType 归属 upload 参数：status 变体不携带 upload 时不得伪造结果。
  const status = summarizeImportTaskDialog({
    variant: "actual-log",
    routePrefix: "/execution",
    logType: "status",
    batches: [batch({ batch_id: "BATCH-LOG-001" })],
    templates: emptyTemplates,
    uploadStatus: undefined,
    uploadBatchId: undefined,
  });

  assert.ok(login.result);
  assert.equal(status.result, null);
});
