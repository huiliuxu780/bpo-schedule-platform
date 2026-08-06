import assert from "node:assert/strict";
import test from "node:test";

import {
  summarizeActualLogImportDialog,
  summarizeActualLogProcessingDetail,
  summarizeActualLogProductionWorkbench,
} from "../../components/actual-log-production-model.ts";

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

test("actual log import dialog summary supports execution host route prefix", () => {
  const loginDialog = summarizeActualLogImportDialog({
    logType: "login",
    batches: [],
    templates: [],
    routePrefix: "/execution",
  });
  const statusDialog = summarizeActualLogImportDialog({
    logType: "status",
    batches: [],
    templates: [],
    routePrefix: "/execution",
  });

  assert.equal(loginDialog.openHref, "/execution?import_dialog=1&log_type=login");
  assert.equal(statusDialog.openHref, "/execution?import_dialog=1&log_type=status");
  assert.equal(loginDialog.closeHref, "/execution");
  assert.equal(statusDialog.closeHref, "/execution");
  assert.equal(loginDialog.resultRedirectTo, "/execution?import_dialog=1&log_type=login");
  assert.equal(statusDialog.resultRedirectTo, "/execution?import_dialog=1&log_type=status");
});

test("actual log processing detail explains cross-day status interval rows", () => {
  const detail = summarizeActualLogProcessingDetail(
    [baseStatusBatch],
    "BATCH-STATUS-001",
    {
      batch: {
        batch_id: "BATCH-STATUS-001",
        file_name: "status-log.csv",
        file_type: "status_log",
        uploaded_by: "operator",
        uploaded_at: "2026-06-04T08:30:00+08:00",
        business_date_from: "2026-06-04",
        business_date_to: "2026-06-05",
        processing_status: "completed",
        total_rows: 2,
        success_rows: 2,
        failed_rows: 0,
        warning_rows: 0,
      },
      versions: [
        {
          version_id: "BATCH-STATUS-001::v1",
          batch_id: "BATCH-STATUS-001",
          version_type: "status_log",
          business_date_from: "2026-06-04",
          business_date_to: "2026-06-05",
          created_at: "2026-06-04T08:31:00+08:00",
        },
      ],
      rows: [
        {
          row_id: 1,
          batch_id: "BATCH-STATUS-001",
          row_number: 1,
          row_status: "success",
          source_key: "READY",
          error_field: null,
          error_code: null,
          error_message: null,
          raw_data: {
            standard_fields: {
              record_type: "status_dictionary",
              external_status_code: "READY",
              normalized_status: "ready",
              category: "available",
              is_productive: "true",
            },
          },
        },
        {
          row_id: 2,
          batch_id: "BATCH-STATUS-001",
          row_number: 2,
          row_status: "success",
          source_key: "STATUS-001",
          error_field: null,
          error_code: null,
          error_message: null,
          raw_data: {
            standard_fields: {
              record_type: "status_interval",
              interval_id: "STATUS-001",
              employee_id: "A-1001",
              external_status_code: "READY",
              start_at: "2026-06-04T23:30:00",
              end_at: "2026-06-05T00:30:00",
              timezone: "Asia/Shanghai",
            },
          },
        },
      ],
      failed_rows: [],
    }
  );

  assert.equal(detail.title, "状态日志处理解释已定位");
  assert.deepEqual(detail.workspaceTabs, [
    { key: "overview", label: "总览" },
    { key: "time", label: "时区与业务日" },
    { key: "exceptions", label: "字典与异常" },
    { key: "rows", label: "逐行明细" },
  ]);
  assert.equal(detail.statusDictionaryCount, 1);
  assert.equal(detail.statusIntervalCount, 1);
  assert.equal(detail.crossDayIntervalCount, 1);
  assert.equal(detail.nonShanghaiTimezoneCount, 0);
  assert.equal(detail.timezoneCheckLabel, "2 行明细均为 Asia/Shanghai 或字典行");
  assert.equal(detail.businessDayLabel, "业务日覆盖 2026-06-04 至 2026-06-05");
  assert.equal(detail.crossDaySplitLabel, "发现 1 条跨天状态区间；按业务日切分");
  assert.equal(detail.rows[1].businessDayLabel, "2026-06-04 至 2026-06-05");
  assert.equal(detail.rows[1].crossDayLabel, "跨天区间：按业务日 2026-06-04 / 2026-06-05 切分解释");
  assert.equal(detail.rows[1].timezoneLabel, "Asia/Shanghai 已确认");
});

test("actual log processing detail builds a status dictionary exception shell", () => {
  const detail = summarizeActualLogProcessingDetail(
    [baseStatusBatch],
    "BATCH-STATUS-001",
    {
      batch: {
        batch_id: "BATCH-STATUS-001",
        file_name: "status-log.csv",
        file_type: "status_log",
        uploaded_by: "operator",
        uploaded_at: "2026-06-04T08:30:00+08:00",
        business_date_from: "2026-06-04",
        business_date_to: "2026-06-05",
        processing_status: "completed",
        total_rows: 3,
        success_rows: 3,
        failed_rows: 0,
        warning_rows: 0,
      },
      versions: [],
      rows: [
        {
          row_id: 1,
          batch_id: "BATCH-STATUS-001",
          row_number: 1,
          row_status: "success",
          source_key: "READY",
          error_field: null,
          error_code: null,
          error_message: null,
          raw_data: {
            standard_fields: {
              record_type: "status_dictionary",
              external_status_code: "READY",
              normalized_status: "ready",
              category: "available",
              is_productive: "true",
            },
          },
        },
        {
          row_id: 2,
          batch_id: "BATCH-STATUS-001",
          row_number: 2,
          row_status: "success",
          source_key: "STATUS-UNKNOWN",
          error_field: null,
          error_code: null,
          error_message: null,
          raw_data: {
            standard_fields: {
              record_type: "status_interval",
              interval_id: "STATUS-UNKNOWN",
              employee_id: "A-1002",
              external_status_code: "UNKNOWN_STATUS",
              start_at: "2026-06-04T22:30:00",
              end_at: "2026-06-05T00:30:00",
              timezone: "Asia/Shanghai",
            },
          },
        },
        {
          row_id: 3,
          batch_id: "BATCH-STATUS-001",
          row_number: 3,
          row_status: "success",
          source_key: "STATUS-TZ",
          error_field: null,
          error_code: null,
          error_message: null,
          raw_data: {
            standard_fields: {
              record_type: "status_interval",
              interval_id: "STATUS-TZ",
              employee_id: "A-1003",
              external_status_code: "READY",
              start_at: "2026-06-04T10:00:00",
              end_at: "2026-06-04T11:00:00",
              timezone: "UTC",
            },
          },
        },
      ],
      failed_rows: [],
    }
  );

  assert.equal(detail.unknownStatusCount, 1);
  assert.equal(detail.nonShanghaiTimezoneCount, 1);
  assert.equal(detail.crossDayIntervalCount, 1);
  assert.equal(detail.exceptionShell.title, "状态字典与异常解释");
  assert.equal(detail.exceptionShell.statusDictionaryLabel, "已读取状态字典 1 行");
  assert.equal(detail.exceptionShell.unknownStatusLabel, "发现 1 条状态区间未命中字典");
  assert.equal(detail.exceptionShell.timezoneIssueLabel, "发现 1 行非 Asia/Shanghai 时区");
  assert.equal(detail.exceptionShell.crossDayExceptionLabel, "发现 1 条跨天状态区间");
  assert.equal(detail.exceptionShell.frozenEmployeeLabel, "员工状态需通过主数据引用校验");
});

test("actual log processing detail explains login event business day and timezone", () => {
  const detail = summarizeActualLogProcessingDetail(
    [baseLoginBatch],
    "BATCH-LOGIN-001",
    {
      batch: {
        batch_id: "BATCH-LOGIN-001",
        file_name: "login-log.csv",
        file_type: "login_log",
        uploaded_by: "operator",
        uploaded_at: "2026-06-04T08:30:00+08:00",
        business_date_from: "2026-06-04",
        business_date_to: "2026-06-04",
        processing_status: "completed",
        total_rows: 1,
        success_rows: 1,
        failed_rows: 0,
        warning_rows: 0,
      },
      versions: [],
      rows: [
        {
          row_id: 1,
          batch_id: "BATCH-LOGIN-001",
          row_number: 1,
          row_status: "success",
          source_key: "LOGIN-001",
          error_field: null,
          error_code: null,
          error_message: null,
          raw_data: {
            standard_fields: {
              event_id: "LOGIN-001",
              employee_id: "A-1001",
              event_type: "login",
              event_at: "2026-06-04T08:59:30",
              timezone: "Asia/Shanghai",
            },
          },
        },
      ],
      failed_rows: [],
    }
  );

  assert.equal(detail.loginEventCount, 1);
  assert.equal(detail.statusIntervalCount, 0);
  assert.equal(detail.businessDayLabel, "业务日覆盖 2026-06-04");
  assert.equal(detail.crossDaySplitLabel, "登录事件不产生跨天状态区间");
  assert.equal(detail.rows[0].recordLabel, "登录事件 login");
  assert.equal(detail.rows[0].businessDayLabel, "2026-06-04");
});

test("actual log processing detail keeps an explicit empty state without row detail", () => {
  const detail = summarizeActualLogProcessingDetail([baseStatusBatch], "BATCH-STATUS-001", null);

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.rows.length, 0);
  assert.equal(detail.detailEmptyLabel, "批次明细未读取，不能展示逐行登录事件或状态区间");
  assert.equal(detail.timezoneCheckLabel, "缺少逐行明细，未形成时区校验结果");
  assert.equal(detail.crossDaySplitLabel, "缺少状态区间明细，未形成跨天切分");
});

test("actual log processing detail points unknown batches back to the log entry", () => {
  const detail = summarizeActualLogProcessingDetail([baseStatusBatch], "BATCH-MISSING");

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.title, "日志处理批次未定位");
  assert.equal(detail.detail, "当前来源批次不在登录/状态日志列表中，无法展示处理解释。");
  assert.equal(detail.blockerSummary, "请返回登录/状态日志选择来源批次");
});
