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

test("version workbench summarizes one current row per business domain", () => {
  const summary = summarizeImportVersionWorkbench({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-MD-APPLIED",
        file_type: "master_data",
        application_status: "applied",
        import_version_id: "BATCH-MD-APPLIED::v1",
        uploaded_at: "2026-06-03T09:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-SCH-PENDING",
        file_type: "personnel_schedule",
        application_status: "not_applied",
        import_version_id: "BATCH-SCH-PENDING::v1",
        uploaded_at: "2026-06-03T10:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-STATUS-APPLIED",
        file_type: "status_log",
        application_status: "applied",
        import_version_id: "BATCH-STATUS-APPLIED::v1",
        application_target: "actual_logs",
        uploaded_at: "2026-06-03T11:00:00+08:00",
      },
    ],
    comparisonRuns: [],
    filters: {},
  });

  assert.equal(summary.totalDomains, 4);
  assert.equal(summary.readyCount, 2);
  assert.equal(summary.blockedCount, 1);
  assert.equal(summary.emptyCount, 1);
  assert.deepEqual(
    summary.rows.map((row) => [row.domainKey, row.tone, row.primaryActionHref]),
    [
      ["master_data", "ready", "/data-quality/BATCH-MD-APPLIED?tab=batch-detail"],
      ["personnel_schedule", "blocked", "/data-quality/BATCH-SCH-PENDING?tab=batch-detail"],
      ["demand_forecast", "empty", "/data-quality"],
      ["actual_logs", "ready", "/data-quality/BATCH-STATUS-APPLIED?tab=batch-detail"],
    ],
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "master_data")?.secondaryActionHref,
    "/data-quality/BATCH-MD-APPLIED?tab=result-trace",
  );
  assert.equal(
    summary.rows.find((row) => row.domainKey === "master_data")?.downstreamSummary,
    "当前暂无直接下游结果链路",
  );
});

test("version workbench prefers latest applied batch and respects business-date and status filters", () => {
  const summary = summarizeImportVersionWorkbench({
    batches: [
      {
        ...baseBatch,
        batch_id: "BATCH-FC-OLD",
        file_type: "demand_forecast",
        application_status: "applied",
        import_version_id: "BATCH-FC-OLD::v1",
        business_date_from: "2026-05-11",
        business_date_to: "2026-05-11",
        uploaded_at: "2026-06-02T09:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-FC-NEW",
        file_type: "demand_forecast",
        application_status: "applied",
        import_version_id: "BATCH-FC-NEW::v1",
        business_date_from: "2026-05-12",
        business_date_to: "2026-05-12",
        uploaded_at: "2026-06-03T09:00:00+08:00",
      },
      {
        ...baseBatch,
        batch_id: "BATCH-LOGIN-PENDING",
        file_type: "login_log",
        application_status: "not_applied",
        import_version_id: "BATCH-LOGIN-PENDING::v1",
        application_target: "actual_logs",
        business_date_from: "2026-05-12",
        business_date_to: "2026-05-12",
        uploaded_at: "2026-06-03T10:00:00+08:00",
      },
    ],
    comparisonRuns: [],
    filters: {
      businessDate: "2026-05-12",
      status: "ready",
    },
  });

  assert.equal(summary.rows.length, 1);
  assert.equal(summary.rows[0].domainKey, "demand_forecast");
  assert.equal(summary.rows[0].versionLabel, "BATCH-FC-NEW::v1");
  assert.equal(summary.detail, "业务日 2026-05-12 · 当前筛出 1 / 4 个业务域");
});

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
