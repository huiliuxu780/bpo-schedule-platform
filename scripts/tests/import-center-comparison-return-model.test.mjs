import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportComparisonRunReturnLinks,
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

test("import center comparison run detail returns to source batch and version workbench", () => {
  const detail = {
    run: {
      run_id: "RUN-IM092-SA-001",
      comparison_type: "schedule_vs_actual",
      forecast_version_id: null,
      schedule_version_id: "SCH-VERSION-001",
      actual_import_version_id: "STATUS-VERSION-001",
      business_date_from: "2026-05-01",
      business_date_to: "2026-05-01",
      status: "completed",
      total_results: 18,
      total_gap_agents: null,
      total_late_minutes: 24,
      created_at: "2026-06-03T11:00:00+08:00",
    },
    forecast_schedule_results: [],
    schedule_actual_results: [],
  };

  assert.deepEqual(
    summarizeImportComparisonRunReturnLinks({
      detail,
      error: null,
      batches: [
        {
          ...baseBatch,
          batch_id: "BATCH-IM092-SCH-001",
          file_type: "personnel_schedule",
          uploaded_at: "2026-06-03T10:00:00+08:00",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          application_status: "applied",
          application_target: "personnel_schedule",
          import_version_id: "SCH-VERSION-001",
          applied_record_count: 36,
        },
        {
          ...baseBatch,
          batch_id: "BATCH-IM092-STATUS-001",
          file_type: "status_log",
          uploaded_at: "2026-06-03T11:00:00+08:00",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          application_status: "applied",
          application_target: "actual_logs",
          import_version_id: "STATUS-VERSION-001",
          applied_record_count: 48,
        },
      ],
      batchError: null,
    }),
    {
      tone: "ready",
      title: "已形成回跳闭环",
      detail:
        "当前运行已匹配 2 个来源批次；可回到 BATCH-业务-STATUS-001 的结果追踪，或按业务日进入业务版本列表。",
      sourceBatchLabel: "BATCH-业务-STATUS-001 · BATCH-业务-SCH-001",
      versionWorkbenchLabel: "业务版本列表 · 2026-05-01",
      primaryActionLabel: "回到来源批次结果追踪",
      primaryHref: "/data-quality/BATCH-IM092-STATUS-001?tab=result-trace",
      secondaryActionLabel: "查看版本列表",
      secondaryHref: "/data-quality/versions?businessDate=2026-05-01&domain=actual_logs",
      evidence: [
        "来源版本 排班 SCH-VERSION-001",
        "来源版本 实际 STATUS-VERSION-001",
        "来源批次 BATCH-业务-STATUS-001",
        "来源批次 BATCH-业务-SCH-001",
      ],
    },
  );

  assert.deepEqual(
    summarizeImportComparisonRunReturnLinks({
      detail,
      error: null,
      batches: [],
      batchError: null,
    }),
    {
      tone: "blocked",
      title: "来源批次未定位",
      detail:
        "当前运行能识别版本语境，但未在导入批次列表中匹配到来源批次。",
      sourceBatchLabel: "未定位",
      versionWorkbenchLabel: "业务版本列表 · 2026-05-01",
      primaryActionLabel: "来源批次不可回跳",
      primaryHref: null,
      secondaryActionLabel: "查看版本列表",
      secondaryHref: "/data-quality/versions?businessDate=2026-05-01",
      evidence: [
        "来源版本 排班 SCH-VERSION-001",
        "来源版本 实际 STATUS-VERSION-001",
      ],
    },
  );
});
