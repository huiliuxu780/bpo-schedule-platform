import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportAppliedVersionResultContext,
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

test("import center applied version result context resolves direct version positioning", () => {
  assert.deepEqual(
    summarizeImportAppliedVersionResultContext({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM085-SCH-001",
        file_type: "personnel_schedule",
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "SCH-VERSION-001",
        applied_record_count: 36,
      },
      readiness: {
        batch_id: "BATCH-IM085-SCH-001",
        file_type: "personnel_schedule",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 36,
        success_rows: 36,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "SCH-VERSION-001",
        applied_record_count: 36,
      },
      comparisonRuns: [
        {
          run_id: "RUN-IM085-SA-001",
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
        {
          run_id: "RUN-IM085-FS-001",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-VERSION-001",
          schedule_version_id: "SCH-VERSION-001",
          actual_import_version_id: null,
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 12,
          total_gap_agents: 6,
          total_late_minutes: null,
          created_at: "2026-06-03T10:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-IM085-001",
          source_result_type: "schedule_actual",
          source_result_id: 101,
          business_date: "2026-05-01",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-06-03T11:30:00+08:00",
        },
      ],
    }),
    {
      tone: "ready",
      title: "已定位对应版本结果",
      detail:
        "当前批次版本 SCH-VERSION-001 已匹配到下游结果，可直接进入对应对比运行，并继续查看同业务日复核案例。",
      sourceBatchLabel: "BATCH-业务-SCH-001",
      versionLabel: "SCH-VERSION-001",
      targetLabel: "人员排班",
      downstreamStatusLabel: "匹配运行 2 个 · 未关闭复核 1 个",
      primaryActionLabel: "查看对应对比运行",
      primaryHref: "/data-quality/comparison-runs/RUN-IM085-SA-001",
      secondaryActionLabel: "查看复核案例",
      secondaryHref:
        "/data-quality/review-cases?businessDate=2026-05-01&sourceResultType=schedule_actual",
      evidence: [
        "来源批次 BATCH-业务-SCH-001",
        "业务日 2026-05-01",
        "应用目标 人员排班",
        "版本 SCH-VERSION-001",
      ],
    },
  );

  assert.deepEqual(
    summarizeImportAppliedVersionResultContext({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM085-MD-001",
        file_type: "master_data",
        application_status: "applied",
        application_target: "master_data",
        import_version_id: "MD-VERSION-001",
        applied_record_count: 10,
      },
      readiness: null,
      comparisonRuns: [],
      reviewCases: [],
    }),
    {
      tone: "empty",
      title: "当前版本暂无直接结果页",
      detail:
        "主数据版本 MD-VERSION-001 当前没有可直接进入的对比运行详情；先核对版本记录，再按业务日查看下游结果空态。",
      sourceBatchLabel: "BATCH-业务-MD-001",
      versionLabel: "MD-VERSION-001",
      targetLabel: "主数据",
      downstreamStatusLabel: "暂无可匹配运行",
      primaryActionLabel: "查看版本记录",
      primaryHref: "/data-quality/BATCH-IM085-MD-001?tab=batch-detail",
      secondaryActionLabel: "查看下游结果追踪",
      secondaryHref: "/data-quality/BATCH-IM085-MD-001?tab=result-trace",
      evidence: [
        "来源批次 BATCH-业务-MD-001",
        "业务日 2026-05-01",
        "应用目标 主数据",
        "版本 MD-VERSION-001",
      ],
    },
  );

  assert.deepEqual(
    summarizeImportAppliedVersionResultContext({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM119-LOGIN-001",
        file_type: "login_log",
        application_status: "applied",
        application_target: "actual_logs",
        import_version_id: "LOGIN-VERSION-001",
        applied_record_count: 42,
      },
      readiness: {
        batch_id: "BATCH-IM119-LOGIN-001",
        file_type: "login_log",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 42,
        success_rows: 42,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "applied",
        application_target: "actual_logs",
        import_version_id: "LOGIN-VERSION-001",
        applied_record_count: 42,
      },
      comparisonRuns: [
        {
          run_id: "RUN-IM119-SA-LOGIN-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-VERSION-001",
          actual_import_version_id: "LOGIN-VERSION-001",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 24,
          created_at: "2026-06-03T11:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-IM119-LOGIN-001",
          source_result_type: "schedule_actual",
          source_result_id: 101,
          business_date: "2026-05-01",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-06-03T11:30:00+08:00",
        },
      ],
    }),
    {
      tone: "ready",
      title: "已定位对应版本结果",
      detail:
        "当前批次版本 LOGIN-VERSION-001 已匹配到下游结果，可直接进入对应对比运行，并继续查看同业务日复核案例。",
      sourceBatchLabel: "BATCH-业务-LOGIN-001",
      versionLabel: "LOGIN-VERSION-001",
      targetLabel: "登录/状态日志",
      downstreamStatusLabel: "匹配运行 1 个 · 未关闭复核 1 个",
      primaryActionLabel: "查看对应对比运行",
      primaryHref: "/data-quality/comparison-runs/RUN-IM119-SA-LOGIN-001",
      secondaryActionLabel: "查看复核案例",
      secondaryHref:
        "/data-quality/review-cases?businessDate=2026-05-01&sourceResultType=schedule_actual",
      evidence: [
        "来源批次 BATCH-业务-LOGIN-001",
        "业务日 2026-05-01",
        "应用目标 登录/状态日志",
        "版本 LOGIN-VERSION-001",
      ],
    },
  );
});
