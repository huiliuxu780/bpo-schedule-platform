import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportQualityExceptionTrace,
} = jiti("../../components/import-center-model.ts");

test("import center quality exception trace explains downstream impact", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-SCHEDULE-001",
      file_name: "schedule.csv",
      file_type: "personnel_schedule",
      uploaded_by: "planner",
      uploaded_at: "2026-05-29T11:00:00+08:00",
      business_date_from: "2026-05-01",
      business_date_to: "2026-05-31",
      processing_status: "completed_with_errors",
      total_rows: 4,
      success_rows: 2,
      failed_rows: 1,
      warning_rows: 1,
    },
    rows: [
      { row_id: 1, batch_id: "BATCH-SCHEDULE-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-SCHEDULE-001", row_number: 2, row_status: "failed", source_key: null, error_field: "employee_id", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-SCHEDULE-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: "shift_type", error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-SCHEDULE-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-SCHEDULE-001::v1",
        batch_id: "BATCH-SCHEDULE-001",
        version_type: "personnel_schedule",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportQualityExceptionTrace(detail), {
    tone: "blocked",
    title: "履约异常判断被导入数据阻塞",
    impactScope: "人员排班 -> 排班 vs 登录/状态异常",
    issueSummary: "1 行失败、1 行警告；失败行会影响迟到、缺勤、未按排班登录等异常判断。",
    nextAction: "先修正失败行并复核警告行，再查看应用准备度和下游对比结果。",
    evidenceLabel: "错误字段：employee_id、shift_type",
  });

  assert.deepEqual(
    summarizeImportQualityExceptionTrace({
      ...detail,
      batch: {
        ...detail.batch,
        file_type: "demand_forecast",
        processing_status: "completed",
      },
      rows: detail.rows.filter((row) => row.row_status === "success"),
      versions: [],
    }),
    {
      tone: "warning",
      title: "版本缺口影响异常引用",
      impactScope: "需求预测 -> 预测 vs 排班缺口异常",
      issueSummary: "2 行已解析但还没有版本记录；缺口异常无法稳定引用预测版本。",
      nextAction: "先确认导入版本生成，再进入预测 vs 排班对比复核。",
      evidenceLabel: "错误字段：无",
    },
  );
});
