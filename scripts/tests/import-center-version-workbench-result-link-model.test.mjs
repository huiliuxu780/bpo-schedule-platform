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

test("version workbench routes matched applied versions to run detail and applied blocked rows to result trace", () => {
  const summary = summarizeImportVersionWorkbench({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-FC-READY",
        file_type: "demand_forecast",
        application_status: "applied",
        import_version_id: "BATCH-FC-READY::v1",
        application_target: "forecast_version",
        business_date_from: "2026-05-12",
        business_date_to: "2026-05-12",
        uploaded_at: "2026-06-03T09:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-MD-BLOCKED",
        file_type: "master_data",
        application_status: "applied",
        import_version_id: null,
        uploaded_at: "2026-06-03T10:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-SCH-WAIT",
        file_type: "personnel_schedule",
        application_status: "not_applied",
        import_version_id: "BATCH-SCH-WAIT::v1",
        uploaded_at: "2026-06-03T11:00:00+08:00",
      },
    ],
    comparisonRuns: [
      {
        run_id: "RUN-FC-001",
        comparison_type: "forecast_vs_schedule",
        forecast_version_id: "BATCH-FC-READY::v1",
        schedule_version_id: "SCHEDULE-V1",
        actual_import_version_id: null,
        business_date_from: "2026-05-12",
        business_date_to: "2026-05-12",
        status: "completed",
        total_results: 24,
        total_gap_agents: 3,
        total_late_minutes: null,
        created_at: "2026-06-03T12:00:00+08:00",
      },
    ],
    reviewCases: [
      {
        case_id: "CASE-FC-001",
        source_result_type: "forecast_schedule",
        source_result_id: 101,
        business_date: "2026-05-12",
        owner_id: "owner-a",
        severity: "high",
        status: "open",
        created_at: "2026-06-03T13:00:00+08:00",
      },
      {
        case_id: "CASE-FC-002",
        source_result_type: "forecast_schedule",
        source_result_id: 102,
        business_date: "2026-05-12",
        owner_id: "owner-b",
        severity: "medium",
        status: "closed",
        created_at: "2026-06-03T13:30:00+08:00",
      },
      {
        case_id: "CASE-SA-IGNORE",
        source_result_type: "schedule_actual",
        source_result_id: 201,
        business_date: "2026-05-12",
        owner_id: "owner-c",
        severity: "low",
        status: "open",
        created_at: "2026-06-03T13:40:00+08:00",
      },
    ],
    filters: {},
  });

  assert.equal(
    summary.rows.find((row) => row.domainKey === "demand_forecast")?.secondaryActionHref,
    "/data-quality/comparison-runs/RUN-FC-001",
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "demand_forecast")?.secondaryActionLabel,
    "查看对应对比运行",
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "demand_forecast")?.downstreamSummary,
    "对比运行 1 个 · 复核案例 2 个",
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "demand_forecast")?.downstreamDetail,
    "按当前版本已匹配的对比运行和同业务日复核类型汇总；其中未关闭 1 个。",
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "master_data")?.secondaryActionHref,
    "/data-quality/BATCH-MD-BLOCKED?tab=result-trace",
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "master_data")?.downstreamSummary,
    "版本定位不完整",
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "personnel_schedule")?.secondaryActionHref,
    null,
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "personnel_schedule")?.downstreamSummary,
    "等待应用后汇总",
  );
});
