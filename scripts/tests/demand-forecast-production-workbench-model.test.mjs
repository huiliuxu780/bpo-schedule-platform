import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeDemandForecastImportDialog,
  summarizeDemandForecastProductionWorkbench,
} = jiti("../../components/demand-forecast-production-model.ts");

const baseBatch = {
  batch_id: "BATCH-FC-001",
  file_name: "forecast.csv",
  file_type: "demand_forecast",
  uploaded_by: "planner",
  uploaded_at: "2026-06-04T09:00:00+08:00",
  business_date_from: "2026-06-08",
  business_date_to: "2026-06-14",
  processing_status: "completed",
  total_rows: 24,
  success_rows: 24,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "demand_forecast",
  import_version_id: "BATCH-FC-001::v1",
  applied_record_count: 336,
};

test("demand forecast production workbench shows an empty state without forecast batches", () => {
  const summary = summarizeDemandForecastProductionWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalVersions, 0);
  assert.equal(summary.appliedVersions, 0);
  assert.equal(summary.alignedVersions, 0);
  assert.equal(summary.blockedVersions, 0);
  assert.equal(summary.rows.length, 0);
  assert.equal(summary.title, "等待需求预测来源批次");
});

test("demand forecast production workbench summarizes applied forecast versions", () => {
  const summary = summarizeDemandForecastProductionWorkbench([
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-001",
      file_type: "personnel_schedule",
      import_version_id: "BATCH-SCH-001::v1",
    },
  ]);

  assert.equal(summary.tone, "ready");
  assert.equal(summary.totalVersions, 1);
  assert.equal(summary.appliedVersions, 1);
  assert.equal(summary.alignedVersions, 1);
  assert.equal(summary.blockedVersions, 0);
  assert.equal(summary.rows[0].versionLabel, "BATCH-FC-001::v1");
  assert.equal(summary.rows[0].sourceBatchHref, "/data-quality/import-batches/BATCH-FC-001");
  assert.equal(summary.rows[0].detailHref, "/demand-plans/production/BATCH-FC-001");
  assert.equal(summary.rows[0].businessDateLabel, "2026-06-08 至 2026-06-14");
  assert.equal(summary.rows[0].applicationLabel, "已应用");
  assert.equal(summary.rows[0].alignmentLabel, "技能组/等级/时段已对齐");
  assert.equal(summary.rows[0].appliedRecordCountLabel, "336");
  assert.equal(summary.rows[0].blockerSummary, "无阻塞");
  assert.equal(summary.rows[0].nextActionLabel, "查看预测版本");
});

test("demand forecast production workbench blocks unapplied forecast versions", () => {
  const summary = summarizeDemandForecastProductionWorkbench([
    {
      ...baseBatch,
      batch_id: "BATCH-FC-002",
      application_status: "not_applied",
      import_version_id: "BATCH-FC-002::v1",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.appliedVersions, 0);
  assert.equal(summary.alignedVersions, 0);
  assert.equal(summary.blockedVersions, 1);
  assert.equal(summary.rows[0].applicationLabel, "待应用");
  assert.equal(summary.rows[0].alignmentLabel, "等待应用后对齐");
  assert.equal(summary.rows[0].blockerSummary, "预测批次尚未应用到业务数据");
});

test("demand forecast production workbench blocks missing import version", () => {
  const summary = summarizeDemandForecastProductionWorkbench([
    {
      ...baseBatch,
      import_version_id: null,
      application_status: "applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.rows[0].versionLabel, "暂无预测业务版本");
  assert.equal(summary.rows[0].alignmentLabel, "缺少版本无法对齐");
  assert.equal(summary.rows[0].blockerSummary, "缺少需求预测业务版本");
});

test("demand forecast import dialog summary keeps upload flow in forecast page context", () => {
  const summary = summarizeDemandForecastImportDialog({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-FC-IMPORT-001",
        uploaded_at: "2026-06-12T09:00:00+08:00",
        total_rows: 10,
        success_rows: 9,
        failed_rows: 1,
        application_status: "not_applied",
        import_version_id: "BATCH-FC-IMPORT-001::v1",
        applied_record_count: 0,
      },
    ],
    templates: [
      {
        template_id: "TPL-FC",
        template_name: "需求预测字段映射",
        file_type: "demand_forecast",
        field_mapping: {
          forecast_date: "forecast_date",
          interval_start: "interval_start",
          skill_id: "skill_id",
        },
        is_active: true,
        created_by: "planner",
        created_at: "2026-06-12T09:00:00+08:00",
        updated_at: "2026-06-12T09:00:00+08:00",
      },
    ],
    uploadStatus: "success",
    uploadBatchId: "BATCH-FC-IMPORT-001",
  });

  assert.equal(summary.openHref, "/demand-plans/production?import_dialog=1");
  assert.equal(summary.closeHref, "/demand-plans/production");
  assert.equal(summary.resultRedirectTo, "/demand-plans/production?import_dialog=1");
  assert.equal(summary.fileType, "demand_forecast");
  assert.deepEqual(
    summary.steps.map((step) => step.title),
    ["上传文件", "字段映射", "导入结果"],
  );
  assert.equal(summary.activeTemplates.length, 1);
  assert.equal(summary.result?.batchHref, "/data-quality/import-batches/BATCH-FC-IMPORT-001");
  assert.equal(summary.result?.rowSummary, "成功 9 行 / 失败 1 行");
});
