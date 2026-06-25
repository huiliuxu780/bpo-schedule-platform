import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeImportReadinessIssueGroups } = jiti("../../components/import-center-model.ts");

test("import center readiness issue groups prioritize blockers by operational type", () => {
  assert.deepEqual(
    summarizeImportReadinessIssueGroups({
      batch_id: "BATCH-READINESS-001",
      file_type: "master_data",
      readiness_status: "blocked",
      blockers: [
        { code: "IMPORT_FAILED_ROWS_PRESENT", message: "导入批次仍存在失败行。" },
        { code: "IMPORT_NO_SUCCESS_ROWS", message: "导入批次没有可应用的成功行。" },
      ],
      row_blockers: [
        {
          row_number: 1,
          code: "REQUIRED_FIELD_MISSING",
          field_name: "source_key",
          message: "缺少必填字段 source_key",
        },
        {
          row_number: 2,
          code: "REQUIRED_FIELD_MISSING",
          field_name: "employee_id",
          message: "缺少必填字段 employee_id",
        },
      ],
      total_rows: 2,
      success_rows: 0,
      failed_rows: 1,
      warning_rows: 0,
      version_count: 0,
      application_status: "not_applied",
      application_target: "master_data_snapshot",
      import_version_id: null,
      applied_record_count: 0,
    }),
    [
      {
        key: "failed_rows",
        tone: "blocked",
        title: "失败行阻塞",
        count: 1,
        detail: "当前批次还有 1 行失败，应用写入前必须先修正。",
        nextAction: "先进入失败行修正，补齐标准字段并重新检查准备度。",
        evidence: ["失败 1 行", "成功 0 行", "警告 0 行"],
      },
      {
        key: "row_required_fields",
        tone: "blocked",
        title: "行级必填字段缺口",
        count: 2,
        detail: "2 个行级阻塞正在影响应用准备度。",
        nextAction: "优先处理第 1 行 source_key；补齐后重新查看准备度。",
        evidence: ["第 1 行 source_key", "第 2 行 employee_id"],
      },
      {
        key: "version",
        tone: "blocked",
        title: "导入版本缺口",
        count: 1,
        detail: "当前批次还没有可追溯导入版本。",
        nextAction: "检查上传解析结果和版本生成记录，确认版本存在后再进入应用前复核。",
        evidence: ["版本 0", "导入版本 未生成"],
      },
      {
        key: "batch_blockers",
        tone: "blocked",
        title: "批次级阻塞",
        count: 2,
        detail: "2 个批次级阻塞仍需处理。",
        nextAction: "按阻塞码处理批次问题后重新检查准备度。",
        evidence: ["IMPORT_FAILED_ROWS_PRESENT", "IMPORT_NO_SUCCESS_ROWS"],
      },
    ],
  );

  assert.deepEqual(
    summarizeImportReadinessIssueGroups({
      batch_id: "BATCH-READY-001",
      file_type: "master_data",
      readiness_status: "ready",
      blockers: [],
      row_blockers: [],
      total_rows: 3,
      success_rows: 3,
      failed_rows: 0,
      warning_rows: 0,
      version_count: 1,
      application_status: "not_applied",
      application_target: "master_data_snapshot",
      import_version_id: "BATCH-READY-001::v1",
      applied_record_count: 0,
    }),
    [
      {
        key: "ready",
        tone: "ready",
        title: "准备度已通过",
        count: 0,
        detail: "当前批次没有应用前阻塞，已生成可追溯导入版本。",
        nextAction: "继续复核应用目标和下游结果；可在应用入口完成写入。",
        evidence: ["成功 3 行", "版本 BATCH-READY-001::v1"],
      },
    ],
  );
});
