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
  assert.equal(detail.title, "日志版本未定位");
  assert.equal(detail.detail, "当前日志版本不在日志版本列表中，无法展示处理解释。");
  assert.equal(detail.workbenchLabel, "返回日志版本列表");
  assert.equal(detail.blockerSummary, "请返回日志版本列表选择已应用版本");
});
