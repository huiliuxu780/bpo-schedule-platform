import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeActualLogProcessingDetail,
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
