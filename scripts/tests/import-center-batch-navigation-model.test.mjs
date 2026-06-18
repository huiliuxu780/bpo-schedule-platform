import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportBatchProcessingHref,
  summarizeImportBatchReviewGuide,
  summarizeImportPageHierarchy,
} = jiti("../../components/import-center-model.ts");

const baseBatch = {
  batch_id: "BATCH-MD-001",
  file_name: "master.csv",
  file_type: "master_data",
  uploaded_by: "ops",
  uploaded_at: "2026-05-29T09:00:00+08:00",
  business_date_from: "2026-05-01",
  business_date_to: "2026-05-31",
  processing_status: "completed",
  total_rows: 10,
  success_rows: 10,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "not_applied",
  application_target: "master_data",
  import_version_id: "BATCH-MD-001::v1",
  applied_record_count: 0,
};

test("import center batch review guide directs selected batch follow-up", () => {
  assert.deepEqual(
    summarizeImportBatchReviewGuide({
      batch: {
        ...baseBatch,
        failed_rows: 2,
        warning_rows: 1,
        application_status: "not_applied",
      },
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "blocked",
        blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
        row_blockers: [],
        total_rows: 10,
        success_rows: 8,
        failed_rows: 2,
        warning_rows: 1,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
    }),
    {
      tone: "blocked",
      title: "先处理失败行",
      detail: "当前批次有 2 行失败、1 行警告，应用前需要先修正失败行并复核警告。",
      primaryActionLabel: "查看失败行",
      primaryAnchor: "#import-row-correction",
      secondaryAnchor: "#import-batch-detail",
    },
  );

  assert.deepEqual(
    summarizeImportBatchReviewGuide({
      batch: {
        ...baseBatch,
        application_status: "applied",
        applied_record_count: 10,
      },
      readiness: null,
    }),
    {
      tone: "done",
      title: "批次已应用",
      detail: "当前批次已应用 10 条记录，可查看批次明细和版本记录确认结果。",
      primaryActionLabel: "查看批次明细",
      primaryAnchor: "#import-batch-detail",
      secondaryAnchor: "#import-apply-readiness",
    },
  );

  assert.deepEqual(
    summarizeImportBatchReviewGuide({
      batch: baseBatch,
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 10,
        success_rows: 10,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
    }),
    {
      tone: "ready",
      title: "可进入应用前复核",
      detail: "当前批次没有失败行，准备度为可应用；继续查看应用准备度和版本范围。",
      primaryActionLabel: "查看应用准备度",
      primaryAnchor: "#import-apply-readiness",
      secondaryAnchor: "#import-batch-detail",
    },
  );
});

test("import center batch processing href routes concrete work to detail page", () => {
  assert.equal(
    buildImportBatchProcessingHref("BATCH-IM026-SMOKE-004"),
    "/data-quality/BATCH-IM026-SMOKE-004",
  );

  assert.equal(
    buildImportBatchProcessingHref("BATCH/CSV 001", {
      correction: "success",
      row: "1",
    }),
    "/data-quality/BATCH%2FCSV%20001?correction=success&row=1",
  );

  assert.equal(
    buildImportBatchProcessingHref("BATCH-IM084-001", {
      apply: "success",
      tab: "result-trace",
    }),
    "/data-quality/BATCH-IM084-001?apply=success&tab=result-trace",
  );
});

test("import center page hierarchy keeps utilities out of the primary workflow", () => {
  assert.deepEqual(
    summarizeImportPageHierarchy({
      selectedBatch: {
        ...baseBatch,
        batch_id: "BATCH-SCH-001",
        file_type: "personnel_schedule",
        failed_rows: 2,
        warning_rows: 1,
      },
      readiness: {
        batch_id: "BATCH-SCH-001",
        file_type: "personnel_schedule",
        readiness_status: "blocked",
        blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
        row_blockers: [],
        total_rows: 10,
        success_rows: 8,
        failed_rows: 2,
        warning_rows: 1,
        version_count: 1,
        application_status: "not_applied",
        application_target: "personnel_schedule",
        import_version_id: "BATCH-SCH-001::v1",
        applied_record_count: 0,
      },
      hasBatchDetail: true,
      hasUploadTools: true,
    }),
    {
      primaryRegion: "导入批次",
      inspectorRegion: "状态检查",
      detailTabs: ["状态检查", "失败行修正", "批次明细", "结果追踪", "导入与模板"],
      defaultDetailTab: "status-check",
      utilityPlacement: "导入与模板作为批次处理辅助入口",
      layoutIntent: "先看处理总览，再进入批次明细。",
    },
  );

  assert.equal(
    summarizeImportPageHierarchy({
      selectedBatch: baseBatch,
      readiness: null,
      hasBatchDetail: true,
      hasUploadTools: true,
    }).defaultDetailTab,
    "status-check",
  );
});
