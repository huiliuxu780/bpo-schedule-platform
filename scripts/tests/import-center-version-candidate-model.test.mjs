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

test("version workbench exposes local comparison candidates with controlled submit requests", () => {
  const summary = summarizeImportVersionWorkbench({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-SCH-CANDIDATE",
        file_type: "personnel_schedule",
        application_status: "applied",
        import_version_id: "SCH-VERSION-001",
        business_date_from: "2026-05-12",
        business_date_to: "2026-05-12",
        uploaded_at: "2026-06-03T10:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-STATUS-CANDIDATE",
        file_type: "status_log",
        application_status: "applied",
        application_target: "actual_logs",
        import_version_id: "STATUS-VERSION-001",
        business_date_from: "2026-05-12",
        business_date_to: "2026-05-12",
        uploaded_at: "2026-06-03T11:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-MD-CANDIDATE",
        file_type: "master_data",
        application_status: "applied",
        import_version_id: "MD-VERSION-001",
        business_date_from: "2026-05-12",
        business_date_to: "2026-05-12",
        uploaded_at: "2026-06-03T12:00:00+08:00",
      },
    ],
    comparisonRuns: [],
    filters: {},
  });

  const scheduleRow = summary.rows.find((row) => row.domainKey === "personnel_schedule");
  assert.deepEqual(scheduleRow?.comparisonCandidate, {
    tone: "ready",
    canSubmit: true,
    title: "可发起比对运行",
    detail: "当前版本可按 排班实际 和已定位来源版本组合提交一次比对；重复提交由后端幂等返回已有运行。",
    comparisonTypeLabel: "排班实际",
    versionPairLabel: "SCH-VERSION-001 / STATUS-VERSION-001",
    businessDateLabel: "2026-05-12 ~ 2026-05-12",
    actionLabel: "发起比对运行",
    href: "/data-quality/BATCH-SCH-CANDIDATE?tab=result-trace",
    sourceBatchId: "BATCH-SCH-CANDIDATE",
    request: {
      comparisonType: "schedule_vs_actual",
      forecastVersionId: null,
      scheduleVersionId: "SCH-VERSION-001",
      actualImportVersionId: "STATUS-VERSION-001",
      businessDateFrom: "2026-05-12",
      businessDateTo: "2026-05-12",
    },
  });

  const masterRow = summary.rows.find((row) => row.domainKey === "master_data");
  assert.deepEqual(masterRow?.comparisonCandidate, {
    tone: "blocked",
    canSubmit: false,
    title: "暂无比对候选",
    detail: "主数据当前没有可直接发起的预测排班或排班实际比对口径。",
    comparisonTypeLabel: "不支持",
    versionPairLabel: "MD-VERSION-001",
    businessDateLabel: "2026-05-12 ~ 2026-05-12",
    actionLabel: "不可触发",
    href: null,
    sourceBatchId: "BATCH-MD-CANDIDATE",
    request: null,
  });
});
