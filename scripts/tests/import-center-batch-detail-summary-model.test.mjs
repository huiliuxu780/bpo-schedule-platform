import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportBatchDetail,
  summarizeImportBatchDetailReadability,
  formatImportRowErrorField,
} = jiti("../../components/import-center-model.ts");

test("import center detail summary counts persisted row statuses", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-DETAIL-001",
      file_name: "detail.csv",
      file_type: "master_data",
      uploaded_by: "ops",
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
      { row_id: 1, batch_id: "BATCH-DETAIL-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-DETAIL-001", row_number: 2, row_status: "failed", source_key: null, error_field: "source_key", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-DETAIL-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: null, error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-DETAIL-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-DETAIL-001::v1",
        batch_id: "BATCH-DETAIL-001",
        version_type: "master_data",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportBatchDetail(detail), {
    totalRows: 4,
    successRows: 2,
    failedRows: 1,
    warningRows: 1,
    versionCount: 1,
    workspaceTabs: [
      { key: "overview", label: "总览" },
      { key: "processing", label: "处理摘要" },
      { key: "exception-trace", label: "异常追踪" },
      { key: "versions", label: "版本记录" },
      { key: "rows", label: "行结果" },
    ],
  });
});

test("import center batch detail readability explains next review focus", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-DETAIL-001",
      file_name: "detail.csv",
      file_type: "master_data",
      uploaded_by: "ops",
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
      { row_id: 1, batch_id: "BATCH-DETAIL-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-DETAIL-001", row_number: 2, row_status: "failed", source_key: null, error_field: "source_key", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-DETAIL-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: "employee_id", error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-DETAIL-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-DETAIL-001::v1",
        batch_id: "BATCH-DETAIL-001",
        version_type: "master_data",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportBatchDetailReadability(detail), {
    tone: "blocked",
    title: "先处理失败行",
    detail: "当前批次共 4 行，1 行失败、1 行警告；失败行会阻塞应用。",
    nextAction: "先查看全部行结果中的错误字段和失败原因，再进入失败行修正。",
    focusLabel: "失败行",
    errorFieldSummary: "source_key、employee_id",
  });

  assert.deepEqual(
    summarizeImportBatchDetailReadability({
      ...detail,
      rows: detail.rows.filter((row) => row.row_status !== "failed"),
      versions: [],
    }),
    {
      tone: "warning",
      title: "缺少版本记录",
      detail: "当前批次有 3 行结果但还没有版本记录；需要先确认导入版本是否生成。",
      nextAction: "优先查看版本记录区域和应用准备度，确认是否存在版本缺口。",
      focusLabel: "版本记录",
      errorFieldSummary: "employee_id",
    },
  );

  assert.equal(formatImportRowErrorField({ ...detail.rows[1], error_field: "source_key" }), "source_key");
  assert.equal(formatImportRowErrorField({ ...detail.rows[0], error_field: null }), "无");
});
