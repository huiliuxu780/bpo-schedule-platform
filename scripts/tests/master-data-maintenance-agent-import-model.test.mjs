import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataAgentImportDialog } = jiti("../../components/master-data-maintenance-model.ts");

const baseBatch = {
  batch_id: "BATCH-MD-001",
  file_name: "master.csv",
  file_type: "master_data",
  uploaded_by: "ops",
  uploaded_at: "2026-06-03T09:00:00+08:00",
  business_date_from: "2026-06-01",
  business_date_to: "2026-06-30",
  processing_status: "completed",
  total_rows: 18,
  success_rows: 18,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "master_data",
  import_version_id: "BATCH-MD-001::v1",
  applied_record_count: 18,
};

test("agent import dialog summary keeps upload flow in the agent list context", () => {
  const summary = summarizeMasterDataAgentImportDialog({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-MD-IMPORT-001",
        uploaded_at: "2026-06-05T09:00:00+08:00",
        total_rows: 3,
        success_rows: 2,
        failed_rows: 1,
        application_status: "not_applied",
        import_version_id: "BATCH-MD-IMPORT-001::v1",
        applied_record_count: 0,
      },
    ],
    templates: [
      {
        template_id: "TPL-MD-AGENT",
        template_name: "客服人员字段映射",
        file_type: "master_data",
        field_mapping: {
          record_type: "record_type",
          employee_id: "employee_id",
          employee_name: "employee_name",
        },
        is_active: true,
        created_by: "ops",
        created_at: "2026-06-05T09:00:00+08:00",
        updated_at: "2026-06-05T09:00:00+08:00",
      },
    ],
    uploadStatus: "success",
    uploadBatchId: "BATCH-MD-IMPORT-001",
  });

  assert.equal(summary.openHref, "/master-data/agents?import_dialog=1");
  assert.equal(summary.closeHref, "/master-data/agents");
  assert.equal(summary.resultRedirectTo, "/master-data/agents?import_dialog=1");
  assert.equal(summary.fileType, "master_data");
  assert.deepEqual(
    summary.steps.map((step) => step.title),
    ["上传文件", "字段映射", "导入结果"],
  );
  assert.equal(summary.mappingModes[0].label, "选择映射模板");
  assert.equal(summary.mappingModes[1].label, "手动映射字段");
  assert.equal(summary.activeTemplates.length, 1);
  assert.equal(summary.result?.batchHref, "/data-quality/import-batches/BATCH-MD-IMPORT-001");
  assert.equal(summary.result?.rowSummary, "成功 2 行 / 失败 1 行");
  assert.equal(summary.result?.nextActionLabel, "查看批次详情");
});
