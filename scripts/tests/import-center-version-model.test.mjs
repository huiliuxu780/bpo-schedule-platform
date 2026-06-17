import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportAppliedVersionResultContext,
  summarizeImportLatestComparisonRunCallback,
  summarizeImportVersionComparisonTrigger,
  summarizeImportVersionComparisonTriggerNotice,
  summarizeImportVersionWorkbench,
  summarizeImportVersionWorkbenchComparisonResultReview,
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

test("import center version comparison trigger only opens when source versions are clear", () => {
  assert.deepEqual(
    summarizeImportVersionComparisonTrigger({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM086-SCH-001",
        file_type: "personnel_schedule",
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "SCH-VERSION-001",
        applied_record_count: 36,
      },
      readiness: {
        batch_id: "BATCH-IM086-SCH-001",
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
          run_id: "RUN-IM086-SA-001",
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
          run_id: "RUN-IM086-FS-001",
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
    }),
    {
      tone: "ready",
      canSubmit: true,
      title: "可在当前版本语境发起比对运行",
      detail: "将按 排班实际 和已定位版本组合重新生成一次对比运行。",
      actionLabel: "发起比对运行",
      nextAction: "提交后留在当前结果页查看反馈，再进入新运行详情或回看比对运行列表。",
      comparisonTypeLabel: "排班实际",
      versionPairLabel: "SCH-VERSION-001 / STATUS-VERSION-001",
      businessDateLabel: "2026-05-01 ~ 2026-05-01",
      evidence: [
        "来源批次 BATCH-业务-SCH-001",
        "业务日 2026-05-01",
        "版本 SCH-VERSION-001",
        "对比口径 排班实际",
        "复用运行 RUN-IM086-SA-001",
      ],
      request: {
        comparisonType: "schedule_vs_actual",
        forecastVersionId: null,
        scheduleVersionId: "SCH-VERSION-001",
        actualImportVersionId: "STATUS-VERSION-001",
        businessDateFrom: "2026-05-01",
        businessDateTo: "2026-05-01",
      },
    },
  );

  assert.deepEqual(
    summarizeImportVersionComparisonTrigger({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM086-MD-001",
        file_type: "master_data",
        application_status: "applied",
        application_target: "master_data",
        import_version_id: "MD-VERSION-001",
        applied_record_count: 10,
      },
      readiness: {
        batch_id: "BATCH-IM086-MD-001",
        file_type: "master_data",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 10,
        success_rows: 10,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "applied",
        application_target: "master_data",
        import_version_id: "MD-VERSION-001",
        applied_record_count: 10,
      },
      comparisonRuns: [],
    }),
    {
      tone: "blocked",
      canSubmit: false,
      title: "当前版本暂无可复用的比对入口",
      detail: "当前 主数据 版本 MD-VERSION-001 没有比对口径；先核对版本记录和下游结果追踪。",
      actionLabel: "发起比对运行",
      nextAction: "仅在人员排班、需求预测、状态日志且已定位对比版本时才展示操作入口。",
      comparisonTypeLabel: "未支持",
      versionPairLabel: "MD-VERSION-001",
      businessDateLabel: "2026-05-01",
      evidence: [
        "来源批次 BATCH-业务-MD-001",
        "业务日 2026-05-01",
        "版本 MD-VERSION-001",
      ],
      request: null,
    },
  );
});

test("import center version comparison trigger notice links new run and result list", () => {
  assert.deepEqual(
    summarizeImportVersionComparisonTriggerNotice({
      status: "success",
      runId: "CALC-SA-20260501-LOCAL-001",
    }),
    {
      tone: "success",
      title: "比对运行已生成",
      detail:
        "当前版本语境已生成新的对比运行 CALC-SA-20260501-LOCAL-001，可直接进入详情或回看当前比对运行列表。",
      runLabel: "CALC-SA-20260501-LOCAL-001",
      primaryActionLabel: "查看新对比运行",
      primaryHref: "/data-quality/comparison-runs/CALC-SA-20260501-LOCAL-001",
      secondaryActionLabel: "查看比对运行列表",
      secondaryHref: "#comparison-runs-list",
    },
  );

  assert.deepEqual(
    summarizeImportVersionComparisonTriggerNotice({
      status: "failed",
      reason: "api_400",
    }),
    {
      tone: "failed",
      title: "比对未提交",
      detail: "比对提交返回 400，请先核对来源版本和业务日。",
      runLabel: "未生成运行",
      primaryActionLabel: "查看比对运行列表",
      primaryHref: "#comparison-runs-list",
      secondaryActionLabel: "留在当前版本语境",
      secondaryHref: "#import-result-trace",
    },
  );
});

test("import center latest comparison run callback summarizes the newest generated run", () => {
  assert.deepEqual(
    summarizeImportLatestComparisonRunCallback({
      status: "success",
      runId: "CALC-SA-20260501-LOCAL-001",
      reason: null,
      comparisonRuns: [
        {
          run_id: "CALC-SA-20260501-LOCAL-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-20260501-V1",
          actual_import_version_id: "STATUS-20260501-V1",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 24,
          created_at: "2026-06-03T12:00:00+08:00",
        },
      ],
    }),
    {
      tone: "success",
      title: "最新一次比对运行结果",
      detail:
        "当前版本语境刚生成运行 CALC-SA-20260501-LOCAL-001，可在当前页先确认结果规模，再进入完整运行详情。",
      runLabel: "CALC-SA-20260501-LOCAL-001",
      metricCards: [
        { label: "对比口径", value: "排班实际", detail: "已完成" },
        { label: "结果数", value: "18", detail: "当前运行结果" },
        { label: "迟到", value: "24 分钟", detail: "排班实际差异" },
        { label: "业务日", value: "2026-05-01", detail: "至 2026-05-01" },
      ],
      primaryActionLabel: "查看新对比运行",
      primaryHref: "/data-quality/comparison-runs/CALC-SA-20260501-LOCAL-001",
      secondaryActionLabel: "查看比对运行列表",
      secondaryHref: "#comparison-runs-list",
    },
  );

  assert.deepEqual(
    summarizeImportLatestComparisonRunCallback({
      status: "success",
      runId: "CALC-MISSING-001",
      reason: null,
      comparisonRuns: [],
    }),
    {
      tone: "blocked",
      title: "最新运行结果未回显",
      detail:
        "当前页已收到运行 CALC-MISSING-001 的成功反馈，但比对运行列表还没有回显这次运行；先刷新当前结果追踪，再进入运行详情复核。",
      runLabel: "CALC-MISSING-001",
      metricCards: [
        { label: "对比口径", value: "待回显", detail: "比对运行列表尚未同步" },
        { label: "结果数", value: "待回显", detail: "当前运行结果" },
        { label: "关键差异", value: "待回显", detail: "等待比对运行列表同步" },
        { label: "业务日", value: "待回显", detail: "等待比对运行列表同步" },
      ],
      primaryActionLabel: "查看新对比运行",
      primaryHref: "/data-quality/comparison-runs/CALC-MISSING-001",
      secondaryActionLabel: "查看比对运行列表",
      secondaryHref: "#comparison-runs-list",
    },
  );
});

test("version workbench result review summarizes submitted comparison runs", () => {
  assert.deepEqual(
    summarizeImportVersionWorkbenchComparisonResultReview({
      status: "success",
      runId: "CALC-FS-20260502-LOCAL-001",
      comparisonRuns: [
        {
          run_id: "CALC-FS-20260502-LOCAL-001",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-20260502-V1",
          schedule_version_id: "SCH-20260502-V1",
          actual_import_version_id: null,
          business_date_from: "2026-05-02",
          business_date_to: "2026-05-02",
          status: "completed",
          total_results: 24,
          total_gap_agents: 6,
          total_late_minutes: null,
          created_at: "2026-06-03T12:30:00+08:00",
        },
      ],
    }),
    {
      tone: "success",
      title: "业务版本列表比对运行结果",
      detail:
        "运行 CALC-FS-20260502-LOCAL-001 已在业务版本列表回显；先确认结果规模和关键差异，再进入完整对比运行详情。",
      runLabel: "CALC-FS-20260502-LOCAL-001",
      metricCards: [
        { label: "对比口径", value: "预测排班", detail: "已完成" },
        { label: "结果数", value: "24", detail: "当前运行结果" },
        { label: "缺口", value: "6 人", detail: "预测排班差异" },
        { label: "业务日", value: "2026-05-02", detail: "至 2026-05-02" },
      ],
      primaryActionLabel: "查看对比运行",
      primaryHref: "/data-quality/comparison-runs/CALC-FS-20260502-LOCAL-001",
      secondaryActionLabel: "回到版本台账",
      secondaryHref: "#version-ledger",
    },
  );

  assert.deepEqual(
    summarizeImportVersionWorkbenchComparisonResultReview({
      status: "success",
      runId: "CALC-WAIT-001",
      comparisonRuns: [],
    }),
    {
      tone: "blocked",
      title: "运行结果未回显",
      detail:
        "业务版本列表已收到运行 CALC-WAIT-001 的成功反馈，但当前比对运行列表还没有回显这次运行。",
      runLabel: "CALC-WAIT-001",
      metricCards: [
        { label: "对比口径", value: "待回显", detail: "比对运行列表尚未同步" },
        { label: "结果数", value: "待回显", detail: "等待运行回显" },
        { label: "关键差异", value: "待回显", detail: "等待运行回显" },
        { label: "业务日", value: "待回显", detail: "等待运行回显" },
      ],
      primaryActionLabel: "查看对比运行",
      primaryHref: "/data-quality/comparison-runs/CALC-WAIT-001",
      secondaryActionLabel: "回到版本台账",
      secondaryHref: "#version-ledger",
    },
  );

  assert.equal(
    summarizeImportVersionWorkbenchComparisonResultReview({
      status: "failed",
      runId: "CALC-FAILED-001",
      comparisonRuns: [],
    }),
    null,
  );
});
