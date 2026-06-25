import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportVersionWorkbench,
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

test("version workbench accepts applied status entry links for direct forecast schedule submit", () => {
  const summary = summarizeImportVersionWorkbench({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-FC-APPLIED-LINK",
        file_type: "demand_forecast",
        application_status: "applied",
        import_version_id: "FC-VERSION-APPLIED",
        business_date_from: "2026-05-18",
        business_date_to: "2026-05-18",
        uploaded_at: "2026-06-03T10:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-SCH-APPLIED-LINK",
        file_type: "personnel_schedule",
        application_status: "applied",
        import_version_id: "SCH-VERSION-APPLIED",
        business_date_from: "2026-05-18",
        business_date_to: "2026-05-18",
        uploaded_at: "2026-06-03T11:00:00+08:00",
      },
    ],
    comparisonRuns: [],
    filters: {
      businessDate: "2026-05-18",
      domain: "demand_forecast",
      status: "applied",
    },
  });

  assert.equal(summary.rows.length, 1);
  assert.equal(summary.rows[0].domainKey, "demand_forecast");
  assert.deepEqual(summary.rows[0].comparisonCandidate, {
    tone: "ready",
    canSubmit: true,
    title: "可发起比对运行",
    detail: "当前版本可按 预测排班 和已定位来源版本组合提交一次比对；重复提交由后端幂等返回已有运行。",
    comparisonTypeLabel: "预测排班",
    versionPairLabel: "FC-VERSION-APPLIED / SCH-VERSION-APPLIED",
    businessDateLabel: "2026-05-18 ~ 2026-05-18",
    actionLabel: "发起比对运行",
    href: "/data-quality/BATCH-FC-APPLIED-LINK?tab=result-trace",
    sourceBatchId: "BATCH-FC-APPLIED-LINK",
    request: {
      comparisonType: "forecast_vs_schedule",
      forecastVersionId: "FC-VERSION-APPLIED",
      scheduleVersionId: "SCH-VERSION-APPLIED",
      actualImportVersionId: null,
      businessDateFrom: "2026-05-18",
      businessDateTo: "2026-05-18",
    },
  });
});
