import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportApiUrl,
  buildImportBatchProcessingHref,
  buildImportComparisonRunCalculateUrl,
  buildImportComparisonRunsUrl,
  buildImportReviewCasesUrl,
  buildImportUploadUrl,
  filterImportBatches,
  formatImportBatchDisplayLabel,
  formatImportBatchFileDisplayName,
  summarizeImportApplicationVisibility,
  summarizeImportDownstreamResultNavigation,
  summarizeImportDownstreamResultDrilldown,
  summarizeImportQualityImpactAggregation,
  summarizeImportComparisonRunDetail,
  summarizeImportComparisonRunReturnLinks,
  summarizeImportComparisonRunReviewCases,
  summarizeImportResultTrace,
  summarizeImportPageHierarchy,
  summarizeImportExceptionGuidance,
  summarizeImportBatchReviewGuide,
  summarizeImportQualityExceptionTrace,
  formatImportFileType,
  getImportBatchHealth,
  summarizeImportBatches,
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

test("import center model formats file types for business-facing UI", () => {
  assert.equal(formatImportFileType("master_data"), "主数据");
  assert.equal(formatImportFileType("personnel_schedule"), "人员排班");
  assert.equal(formatImportFileType("demand_forecast"), "需求预测");
  assert.equal(formatImportFileType("login_log"), "登录日志");
  assert.equal(formatImportFileType("status_log"), "状态日志");
});

test("import center display labels hide task-coded local smoke identifiers", () => {
  assert.equal(
    formatImportBatchDisplayLabel("BATCH-IM083-SMOKE-002"),
    "BATCH-业务-002",
  );
  assert.equal(
    formatImportBatchFileDisplayName("im083-smoke-ready.csv"),
    "业务-ready.csv",
  );
  assert.equal(
    formatImportBatchFileDisplayName("template-upload.csv"),
    "template-upload.csv",
  );
});

test("import center summary uses live batch rows without sample data", () => {
  const summary = summarizeImportBatches([
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-001",
      file_type: "personnel_schedule",
      failed_rows: 2,
      warning_rows: 1,
      application_status: "applied",
      applied_record_count: 8,
    },
  ]);

  assert.deepEqual(summary, {
    totalBatches: 2,
    totalRows: 20,
    failedRows: 2,
    warningRows: 1,
    appliedBatches: 1,
    notAppliedBatches: 1,
  });
});

test("import center batch filters narrow upload history locally", () => {
  const batches = [
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-001",
      file_name: "schedule-may.csv",
      file_type: "personnel_schedule",
      uploaded_by: "planner",
      processing_status: "completed_with_errors",
      failed_rows: 2,
      application_status: "not_applied",
    },
    {
      ...baseBatch,
      batch_id: "BATCH-LOGIN-001",
      file_name: "login-log.csv",
      file_type: "login_log",
      uploaded_by: "ops",
      processing_status: "completed",
      application_status: "applied",
      applied_record_count: 10,
    },
  ];

  assert.deepEqual(
    filterImportBatches(batches, {
      query: "planner",
      fileType: "personnel_schedule",
      processingStatus: "completed_with_errors",
      applicationStatus: "not_applied",
    }).map((batch) => batch.batch_id),
    ["BATCH-SCH-001"],
  );

  assert.deepEqual(
    filterImportBatches(batches, {
      query: "login",
      fileType: "all",
      processingStatus: "all",
      applicationStatus: "applied",
    }).map((batch) => batch.batch_id),
    ["BATCH-LOGIN-001"],
  );

  assert.deepEqual(
    filterImportBatches(batches, {
      query: "missing",
      fileType: "all",
      processingStatus: "all",
      applicationStatus: "all",
    }),
    [],
  );
});

test("import center batch review guide directs selected batch follow-up", () => {
  assert.deepEqual(
    summarizeImportBatchReviewGuide({
      batch: {
        ...baseBatch,
        failed_rows: 2,
        warning_rows: 1,
        application_status: "not_applied",
      },
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "blocked",
        blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
        row_blockers: [],
        total_rows: 10,
        success_rows: 8,
        failed_rows: 2,
        warning_rows: 1,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
    }),
    {
      tone: "blocked",
      title: "先处理失败行",
      detail: "当前批次有 2 行失败、1 行警告，应用前需要先修正失败行并复核警告。",
      primaryActionLabel: "查看失败行",
      primaryAnchor: "#import-row-correction",
      secondaryAnchor: "#import-batch-detail",
    },
  );

  assert.deepEqual(
    summarizeImportBatchReviewGuide({
      batch: {
        ...baseBatch,
        application_status: "applied",
        applied_record_count: 10,
      },
      readiness: null,
    }),
    {
      tone: "done",
      title: "批次已应用",
      detail: "当前批次已应用 10 条记录，可查看批次明细和版本记录确认结果。",
      primaryActionLabel: "查看批次明细",
      primaryAnchor: "#import-batch-detail",
      secondaryAnchor: "#import-apply-readiness",
    },
  );

  assert.deepEqual(
    summarizeImportBatchReviewGuide({
      batch: baseBatch,
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 10,
        success_rows: 10,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
    }),
    {
      tone: "ready",
      title: "可进入应用前复核",
      detail: "当前批次没有失败行，准备度为可应用；继续查看应用准备度和版本范围。",
      primaryActionLabel: "查看应用准备度",
      primaryAnchor: "#import-apply-readiness",
      secondaryAnchor: "#import-batch-detail",
    },
  );
});

test("import center application visibility summarizes selected batch status", () => {
  assert.deepEqual(
    summarizeImportApplicationVisibility({
      batch: {
        ...baseBatch,
        application_status: "applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 10,
      },
      readiness: null,
    }),
    {
      tone: "done",
      statusLabel: "已应用",
      targetLabel: "主数据",
      versionLabel: "BATCH-MD-001::v1",
      appliedRecordLabel: "10 条",
      title: "应用结果已生成",
      detail: "当前批次已应用到主数据，共 10 条记录；继续查看版本记录或下游对比结果。",
      nextAction: "查看批次明细中的版本记录，确认业务日期范围和记录数。",
    },
  );

  assert.deepEqual(
    summarizeImportApplicationVisibility({
      batch: baseBatch,
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 10,
        success_rows: 10,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
    }),
    {
      tone: "ready",
      statusLabel: "未应用",
      targetLabel: "主数据",
      versionLabel: "BATCH-MD-001::v1",
      appliedRecordLabel: "0 条",
      title: "可进入应用前复核",
      detail: "当前批次准备度为可应用。",
      nextAction: "复核应用目标、版本和批次明细。",
    },
  );

  assert.deepEqual(
    summarizeImportApplicationVisibility({
      batch: { ...baseBatch, failed_rows: 1 },
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "blocked",
        blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
        row_blockers: [],
        total_rows: 10,
        success_rows: 9,
        failed_rows: 1,
        warning_rows: 0,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
    }).tone,
    "blocked",
  );

  assert.equal(
    summarizeImportApplicationVisibility({ batch: baseBatch, readiness: null }).tone,
    "unknown",
  );
});

test("import center downstream navigation explains next result path", () => {
  assert.deepEqual(
    summarizeImportDownstreamResultNavigation({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-SCH-001",
        file_type: "personnel_schedule",
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "BATCH-SCH-001::v1",
        applied_record_count: 36,
      },
      readiness: null,
    }),
    {
      tone: "done",
      title: "可进入排班履约对比",
      detail:
        "人员排班已应用 36 条记录，可继续查看预测 vs 排班或排班 vs 实际登录/状态的结果列表。",
      comparisonLabel: "对比结果：排班版本 BATCH-SCH-001::v1",
      reviewLabel: "复核案例：按履约异常结果继续追踪",
      primaryActionLabel: "查看对比结果",
      primaryHref: "/data-quality/versions?businessDate=2026-05-01",
      secondaryActionLabel: "查看复核案例",
      secondaryHref: "/data-quality/review-cases?businessDate=2026-05-01",
      evidenceLabel: "已应用 36 条 · 版本 BATCH-SCH-001::v1",
    },
  );

  assert.deepEqual(
    summarizeImportDownstreamResultNavigation({
      batch: {
        ...baseBatch,
        failed_rows: 2,
        warning_rows: 1,
      },
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "blocked",
        blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
        row_blockers: [],
        total_rows: 10,
        success_rows: 8,
        failed_rows: 2,
        warning_rows: 1,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
    }),
    {
      tone: "blocked",
      title: "先修正导入阻塞",
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响对比与复核判断。",
      comparisonLabel: "对比结果：等待应用版本",
      reviewLabel: "复核案例：等待质量问题清理",
      primaryActionLabel: "查看失败行",
      primaryHref: "#import-row-correction",
      secondaryActionLabel: "查看应用准备度",
      secondaryHref: "#import-apply-readiness",
      evidenceLabel: "失败 2 行 · 警告 1 行",
    },
  );
});

test("import center result trace summarizes persisted downstream lists", () => {
  assert.equal(
    buildImportComparisonRunsUrl("2026-05-11"),
    "/data-quality/versions?businessDate=2026-05-11",
  );
  assert.equal(
    buildImportComparisonRunCalculateUrl(),
    "http://127.0.0.1:8000/api/v1/comparison-runs/calculate",
  );
  assert.equal(
    buildImportReviewCasesUrl("2026-05-11"),
    "/data-quality/review-cases?businessDate=2026-05-11",
  );

  assert.deepEqual(
    summarizeImportResultTrace({
      businessDate: "2026-05-11",
      comparisonRuns: [
        {
          run_id: "RUN-001",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-001",
          schedule_version_id: "SCH-001",
          actual_import_version_id: null,
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 12,
          total_gap_agents: 3,
          total_late_minutes: null,
          created_at: "2026-05-11T10:00:00+08:00",
        },
        {
          run_id: "RUN-002",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-001",
          actual_import_version_id: "ACT-001",
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "failed",
          total_results: 4,
          total_gap_agents: null,
          total_late_minutes: 18,
          created_at: "2026-05-11T11:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-001",
          source_result_type: "forecast_schedule",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T12:00:00+08:00",
        },
        {
          case_id: "CASE-002",
          source_result_type: "schedule_actual",
          source_result_id: 14,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "closed",
          created_at: "2026-05-11T13:00:00+08:00",
        },
      ],
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "ready",
      title: "已找到下游结果",
      comparisonSummary: "对比结果 2 个 · 完成 1 个 · 失败 1 个",
      reviewSummary: "复核案例 2 个 · 未关闭 1 个",
      nextAction: "继续查看对比结果和复核案例明细，确认导入数据是否已进入业务闭环。",
    },
  );

  assert.deepEqual(
    summarizeImportResultTrace({
      businessDate: "2026-05-12",
      comparisonRuns: [],
      reviewCases: [],
      comparisonError: "对比结果 API 返回 500",
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "结果追踪读取受阻",
      comparisonSummary: "对比结果读取失败",
      reviewSummary: "复核案例 0 个 · 未关闭 0 个",
      nextAction: "先刷新结果追踪；读取失败时保留当前批次的下游判断。",
    },
  );
});

test("import center result drilldown blocks downstream review before batch application", () => {
  assert.deepEqual(
    summarizeImportDownstreamResultDrilldown({
      batch: {
        ...baseBatch,
        failed_rows: 2,
        success_rows: 8,
        application_status: "not_applied",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
      readiness: {
        batch_id: "BATCH-MD-001",
        file_type: "master_data",
        readiness_status: "blocked",
        blockers: [{ code: "IMPORT_FAILED_ROWS_PRESENT", message: "有失败行" }],
        row_blockers: [],
        total_rows: 10,
        success_rows: 8,
        failed_rows: 2,
        warning_rows: 0,
        version_count: 1,
        application_status: "not_applied",
        application_target: "master_data",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 0,
      },
      businessDate: "2026-05-11",
      comparisonRuns: [],
      reviewCases: [],
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "先处理导入阻塞",
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响对比与复核判断。",
      nextAction: "先完成失败行修正和应用准备度检查，再判断下游结果。",
      comparisonFocus: "等待应用版本",
      reviewFocus: "等待质量问题清理",
      primaryActionLabel: "处理失败行",
      primaryHref: "#import-row-correction",
      secondaryActionLabel: "查看应用准备度",
      secondaryHref: "#import-apply-readiness",
      evidence: ["应用状态 未应用", "失败 2 行", "准备度 阻塞", "业务日 2026-05-11"],
    },
  );
});

test("import center result drilldown selects the most actionable downstream record", () => {
  assert.deepEqual(
    summarizeImportDownstreamResultDrilldown({
      batch: {
        ...baseBatch,
        application_status: "applied",
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 10,
      },
      readiness: {
        batch_id: "BATCH-MD-001",
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
        import_version_id: "BATCH-MD-001::v1",
        applied_record_count: 10,
      },
      businessDate: "2026-05-11",
      comparisonRuns: [
        {
          run_id: "RUN-001",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-001",
          schedule_version_id: "SCH-001",
          actual_import_version_id: null,
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 12,
          total_gap_agents: 3,
          total_late_minutes: null,
          created_at: "2026-05-11T10:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-001",
          source_result_type: "forecast_schedule",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T12:00:00+08:00",
        },
      ],
      comparisonError: null,
      reviewError: null,
      businessDate: "2026-05-11",
    }),
    {
      tone: "ready",
      title: "下游闭环已有结果",
      detail: "当前批次已应用，并且业务日 2026-05-11 已有对比结果或复核案例；优先处理未关闭复核案例。",
      nextAction: "先查看未关闭复核案例，再回看关联对比运行和来源版本。",
      comparisonFocus: "RUN-001 · 预测 vs 排班 · 完成 · 12 条结果",
      reviewFocus: "CASE-001 · high · 未关闭 · supervisor-01",
      primaryActionLabel: "查看未关闭复核案例",
      primaryHref: "/data-quality/review-cases/CASE-001",
      secondaryActionLabel: "查看关联对比运行",
      secondaryHref: "/data-quality/comparison-runs/RUN-001",
      evidence: ["应用状态 已应用", "对比结果 1 个", "复核未关闭 1 个", "业务日 2026-05-11"],
    },
  );
});

test("import center quality impact aggregation ranks issue groups by downstream candidates", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-SCHEDULE-001",
      file_name: "schedule.csv",
      file_type: "personnel_schedule",
      uploaded_by: "planner",
      uploaded_at: "2026-05-29T11:00:00+08:00",
      business_date_from: "2026-05-11",
      business_date_to: "2026-05-11",
      processing_status: "completed_with_errors",
      total_rows: 4,
      success_rows: 1,
      failed_rows: 2,
      warning_rows: 1,
    },
    rows: [
      { row_id: 1, batch_id: "BATCH-SCHEDULE-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-SCHEDULE-001", row_number: 2, row_status: "failed", source_key: null, error_field: "employee_id", error_code: "REQUIRED_FIELD_MISSING", error_message: "missing employee", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-SCHEDULE-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: "employee_id", error_code: "REQUIRED_FIELD_MISSING", error_message: "empty employee", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-SCHEDULE-001", row_number: 4, row_status: "failed", source_key: "A4", error_field: "shift_type", error_code: "UNKNOWN_SHIFT", error_message: "unknown shift", raw_data: {} },
    ],
    failed_rows: [],
    versions: [],
  };

  assert.deepEqual(
    summarizeImportQualityImpactAggregation({
      detail,
      comparisonRuns: [
        {
          run_id: "RUN-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-001",
          actual_import_version_id: "ACT-001",
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 15,
          total_gap_agents: null,
          total_late_minutes: 32,
          created_at: "2026-05-11T10:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-001",
          source_result_type: "schedule_actual",
          source_result_id: 10,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T11:00:00+08:00",
        },
        {
          case_id: "CASE-002",
          source_result_type: "schedule_actual",
          source_result_id: 11,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "closed",
          created_at: "2026-05-11T12:00:00+08:00",
        },
      ],
      comparisonError: null,
      reviewError: null,
      businessDate: "2026-05-11",
    }),
    {
      tone: "blocked",
      title: "质量问题正在影响下游判断",
      detail: "当前批次有 3 行质量问题，当前业务日已有 2 个复核案例、15 条对比结果；先处理影响候选最高的问题组。",
      downstreamLabel: "复核案例 2 个 · 未关闭 1 个 · 对比结果 15 条",
      topIssueLabel: "employee_id · REQUIRED_FIELD_MISSING",
      nextAction: "先处理质量问题行数最多的问题组，再回看未关闭复核案例和对比结果。",
      groups: [
        {
          key: "employee_id::REQUIRED_FIELD_MISSING",
          title: "employee_id · REQUIRED_FIELD_MISSING",
          rowCount: 2,
          failedRows: 1,
          warningRows: 1,
          affectedReviewCases: 2,
          openReviewCases: 1,
          comparisonResults: 15,
          impactLabel: "2 行问题 · 2 个复核案例 · 15 条对比结果",
          reviewCasesHref: "/data-quality/review-cases?businessDate=2026-05-11&status=open&sourceResultType=schedule_actual&query=employee_id+%C2%B7+REQUIRED_FIELD_MISSING",
          reviewCasesActionLabel: "查看相关复核案例",
          reviewCasesFocus: "employee_id · REQUIRED_FIELD_MISSING",
          evidence: ["行 2 失败", "行 3 警告", "source_key A3"],
          nextAction: "先修正 employee_id 的 REQUIRED_FIELD_MISSING，再回看未关闭复核案例。",
        },
        {
          key: "shift_type::UNKNOWN_SHIFT",
          title: "shift_type · UNKNOWN_SHIFT",
          rowCount: 1,
          failedRows: 1,
          warningRows: 0,
          affectedReviewCases: 2,
          openReviewCases: 1,
          comparisonResults: 15,
          impactLabel: "1 行问题 · 2 个复核案例 · 15 条对比结果",
          reviewCasesHref: "/data-quality/review-cases?businessDate=2026-05-11&status=open&sourceResultType=schedule_actual&query=shift_type+%C2%B7+UNKNOWN_SHIFT",
          reviewCasesActionLabel: "查看相关复核案例",
          reviewCasesFocus: "shift_type · UNKNOWN_SHIFT",
          evidence: ["行 4 失败", "source_key A4"],
          nextAction: "先修正 shift_type 的 UNKNOWN_SHIFT，再回看未关闭复核案例。",
        },
      ],
    },
  );
});

test("import center quality impact aggregation handles clean or missing details", () => {
  assert.deepEqual(
    summarizeImportQualityImpactAggregation({
      detail: null,
      comparisonRuns: [],
      reviewCases: [],
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "empty",
      title: "等待批次明细",
      detail: "还没有可聚合的行级质量结果。",
      downstreamLabel: "复核案例 0 个 · 未关闭 0 个 · 对比结果 0 条",
      topIssueLabel: "暂无质量问题",
      nextAction: "先确认批次明细是否读取成功，再查看质量影响聚合。",
      groups: [],
    },
  );
});

test("import center comparison run detail summarizes result rows", () => {
  assert.deepEqual(
    summarizeImportComparisonRunDetail({
      detail: {
        run: {
          run_id: "RUN-DB008-FS",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-20260511-V1",
          schedule_version_id: "SCH-20260511-V1",
          actual_import_version_id: null,
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 2,
          total_gap_agents: 4,
          total_late_minutes: null,
          created_at: "2026-05-11T10:00:00+08:00",
        },
        forecast_schedule_results: [
          {
            result_id: 12,
            run_id: "RUN-DB008-FS",
            forecast_version_id: "FC-20260511-V1",
            schedule_version_id: "SCH-20260511-V1",
            forecast_interval_id: "FC-INT-001",
            schedule_detail_id: "DETAIL-A-1001-20260511",
            business_date: "2026-05-11",
            workplace_id: "SH-01",
            project_id: "BOSCH-CS",
            skill_id: "L1-CN",
            interval_start: "09:00",
            interval_end: "09:30",
            forecast_agents: 3,
            scheduled_agents: 1,
            gap_agents: 2,
            result_status: "gap",
          },
        ],
        schedule_actual_results: [],
      },
      error: null,
    }),
    {
      tone: "ready",
      title: "RUN-DB008-FS · 预测排班 · 完成",
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "source", label: "来源链路" },
        { key: "results", label: "结果明细" },
        { key: "reviews", label: "复核案例" },
      ],
      resultReviewContext: {
        title: "完整结果回看主页",
        detail:
          "当前页面展示 RUN-DB008-FS 的完整结果明细，来源版本为 预测 FC-20260511-V1 · 排班 SCH-20260511-V1，业务日 2026-05-11 至 2026-05-11。",
        scopeLabel: "当前版本语境 · 预测排班",
        sourceVersionLabel: "预测 FC-20260511-V1 · 排班 SCH-20260511-V1",
        businessDateLabel: "2026-05-11 ~ 2026-05-11",
        sourceExplanation:
          "预测排班口径使用预测版本 FC-20260511-V1 和排班版本 SCH-20260511-V1，按同一业务日区间比较 0.5h 人力缺口。",
        sourceBlocker: null,
        nextAction: "先核对来源版本和业务日，再按明细行检查异常结果。",
      },
      metricCards: [
        { label: "结果数", value: "2", detail: "计算结果" },
        { label: "缺口", value: "4 人", detail: "预测排班差异" },
        { label: "迟到", value: "0 分钟", detail: "排班实际差异" },
        { label: "业务日", value: "2026-05-11", detail: "至 2026-05-11" },
      ],
      versionLabel: "预测 FC-20260511-V1 · 排班 SCH-20260511-V1",
      detailHref: "/data-quality/comparison-runs/RUN-DB008-FS",
      resultRows: [
        {
          id: "forecast-12",
          source: "预测排班",
          dimension: "2026-05-11 · 09:00-09:30 · SH-01 · BOSCH-CS · L1-CN",
          metric: "预测 3 人 · 排班 1 人 · 缺口 2 人",
          status: "gap",
        },
      ],
    }
  );

  assert.deepEqual(
    summarizeImportComparisonRunDetail({
      detail: {
        run: {
          run_id: "RUN-DB008-SA",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-20260511-V1",
          actual_import_version_id: "LOGIN-20260511-V1",
          business_date_from: "2026-05-11",
          business_date_to: "2026-05-11",
          status: "completed",
          total_results: 1,
          total_gap_agents: null,
          total_late_minutes: 24,
          created_at: "2026-05-11T10:00:00+08:00",
        },
        forecast_schedule_results: [],
        schedule_actual_results: [
          {
            result_id: 42,
            run_id: "RUN-DB008-SA",
            schedule_version_id: "SCH-20260511-V1",
            actual_import_version_id: "LOGIN-20260511-V1",
            schedule_detail_id: "DETAIL-A-1001-20260511",
            actual_log_id: "LOGIN-A-1001-20260511",
            business_date: "2026-05-11",
            employee_id: "A-1001",
            interval_start: "09:00",
            interval_end: "09:30",
            scheduled_minutes: 30,
            actual_productive_minutes: 6,
            late_minutes: 24,
            result_status: "late",
          },
        ],
      },
      error: null,
    }),
    {
      tone: "ready",
      title: "RUN-DB008-SA · 排班实际 · 完成",
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "source", label: "来源链路" },
        { key: "results", label: "结果明细" },
        { key: "reviews", label: "复核案例" },
      ],
      resultReviewContext: {
        title: "完整结果回看主页",
        detail:
          "当前页面展示 RUN-DB008-SA 的完整结果明细，来源版本为 排班 SCH-20260511-V1 · 实际 LOGIN-20260511-V1，业务日 2026-05-11 至 2026-05-11。",
        scopeLabel: "当前版本语境 · 排班实际",
        sourceVersionLabel: "排班 SCH-20260511-V1 · 实际 LOGIN-20260511-V1",
        businessDateLabel: "2026-05-11 ~ 2026-05-11",
        sourceExplanation:
          "排班实际口径使用排班版本 SCH-20260511-V1 和实际日志版本 LOGIN-20260511-V1，按同一业务日区间比较坐席排班分钟、有效生产分钟和迟到分钟。",
        sourceBlocker: null,
        nextAction: "先核对来源版本和业务日，再按明细行检查异常结果。",
      },
      metricCards: [
        { label: "结果数", value: "1", detail: "计算结果" },
        { label: "缺口", value: "0 人", detail: "预测排班差异" },
        { label: "迟到", value: "24 分钟", detail: "排班实际差异" },
        { label: "业务日", value: "2026-05-11", detail: "至 2026-05-11" },
      ],
      versionLabel: "排班 SCH-20260511-V1 · 实际 LOGIN-20260511-V1",
      detailHref: "/data-quality/comparison-runs/RUN-DB008-SA",
      resultRows: [
        {
          id: "actual-42",
          source: "排班实际",
          dimension: "2026-05-11 · 09:00-09:30 · A-1001",
          metric: "排班 30 分钟 · 有效 6 分钟 · 迟到 24 分钟",
          status: "late",
        },
      ],
    }
  );
});

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

test("import center comparison run detail links related review cases", () => {
  const detail = {
    run: {
      run_id: "RUN-DB008-FS",
      comparison_type: "forecast_vs_schedule",
      forecast_version_id: "FC-20260511-V1",
      schedule_version_id: "SCH-20260511-V1",
      actual_import_version_id: null,
      business_date_from: "2026-05-11",
      business_date_to: "2026-05-11",
      status: "completed",
      total_results: 2,
      total_gap_agents: 4,
      total_late_minutes: null,
      created_at: "2026-05-11T10:00:00+08:00",
    },
    forecast_schedule_results: [
      {
        result_id: 12,
        run_id: "RUN-DB008-FS",
        forecast_version_id: "FC-20260511-V1",
        schedule_version_id: "SCH-20260511-V1",
        forecast_interval_id: "FC-INT-001",
        schedule_detail_id: "DETAIL-A-1001-20260511",
        business_date: "2026-05-11",
        workplace_id: "SH-01",
        project_id: "BOSCH-CS",
        skill_id: "L1-CN",
        interval_start: "09:00",
        interval_end: "09:30",
        forecast_agents: 3,
        scheduled_agents: 1,
        gap_agents: 2,
        result_status: "gap",
      },
    ],
    schedule_actual_results: [],
  };

  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail,
      reviewCases: [
        {
          case_id: "CASE-QUERY-001",
          source_result_type: "forecast_schedule",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T10:10:00+08:00",
        },
        {
          case_id: "CASE-OTHER-001",
          source_result_type: "schedule_actual",
          source_result_id: 99,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "open",
          created_at: "2026-05-11T11:00:00+08:00",
        },
      ],
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "关联复核案例 1 个",
      detail: "当前运行有 1 个结果已形成复核案例，其中 1 个仍未关闭。",
      nextAction: "先查看未关闭或高风险复核案例，再回看运行结果和证据。",
      cases: [
        {
          caseId: "CASE-QUERY-001",
          resultLabel: "预测排班 #12",
          ownerLabel: "supervisor-01",
          severityLabel: "高",
          statusLabel: "未关闭",
          href: "/data-quality/review-cases/CASE-QUERY-001",
        },
      ],
    }
  );

  assert.deepEqual(
    summarizeImportComparisonRunReviewCases({
      detail,
      reviewCases: [],
      reviewError: null,
    }),
    {
      tone: "empty",
      title: "暂无关联复核案例",
      detail: "当前运行结果尚未匹配到复核案例。",
      nextAction: "继续查看结果明细。",
      cases: [],
    }
  );
});

test("import center batch processing href routes concrete work to detail page", () => {
  assert.equal(
    buildImportBatchProcessingHref("BATCH-IM026-SMOKE-004"),
    "/data-quality/BATCH-IM026-SMOKE-004",
  );

  assert.equal(
    buildImportBatchProcessingHref("BATCH/CSV 001", {
      correction: "success",
      row: "1",
    }),
    "/data-quality/BATCH%2FCSV%20001?correction=success&row=1",
  );

  assert.equal(
    buildImportBatchProcessingHref("BATCH-IM084-001", {
      apply: "success",
      tab: "result-trace",
    }),
    "/data-quality/BATCH-IM084-001?apply=success&tab=result-trace",
  );
});

test("import center page hierarchy keeps utilities out of the primary workflow", () => {
  assert.deepEqual(
    summarizeImportPageHierarchy({
      selectedBatch: {
        ...baseBatch,
        batch_id: "BATCH-SCH-001",
        file_type: "personnel_schedule",
        failed_rows: 2,
        warning_rows: 1,
      },
      readiness: {
        batch_id: "BATCH-SCH-001",
        file_type: "personnel_schedule",
        readiness_status: "blocked",
        blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
        row_blockers: [],
        total_rows: 10,
        success_rows: 8,
        failed_rows: 2,
        warning_rows: 1,
        version_count: 1,
        application_status: "not_applied",
        application_target: "personnel_schedule",
        import_version_id: "BATCH-SCH-001::v1",
        applied_record_count: 0,
      },
      hasBatchDetail: true,
      hasUploadTools: true,
    }),
    {
      primaryRegion: "导入批次",
      inspectorRegion: "状态检查",
      detailTabs: ["状态检查", "失败行修正", "批次明细", "结果追踪", "导入与模板"],
      defaultDetailTab: "status-check",
      utilityPlacement: "导入与模板作为批次处理辅助入口",
      layoutIntent: "先看处理总览，再进入批次明细。",
    },
  );

  assert.equal(
    summarizeImportPageHierarchy({
      selectedBatch: baseBatch,
      readiness: null,
      hasBatchDetail: true,
      hasUploadTools: true,
    }).defaultDetailTab,
    "status-check",
  );
});

test("import center health prefers readiness blockers over row counts", () => {
  assert.equal(
    getImportBatchHealth(baseBatch, {
      batch_id: "BATCH-MD-001",
      file_type: "master_data",
      readiness_status: "blocked",
      blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
      row_blockers: [],
      total_rows: 10,
      success_rows: 9,
      failed_rows: 1,
      warning_rows: 0,
      version_count: 1,
      application_status: "not_applied",
      application_target: "master_data",
      import_version_id: "BATCH-MD-001::v1",
      applied_record_count: 0,
    }),
    "blocked",
  );
  assert.equal(getImportBatchHealth({ ...baseBatch, warning_rows: 1 }), "warning");
  assert.equal(getImportBatchHealth(baseBatch), "ready_candidate");
});

test("import center API URL builder keeps local API configurable", () => {
  assert.equal(
    buildImportApiUrl("/api/v1/import-batches", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches",
  );
  assert.equal(
    buildImportApiUrl("api/v1/import-batches/B1/apply-readiness", "http://127.0.0.1:8000/"),
    "http://127.0.0.1:8000/api/v1/import-batches/B1/apply-readiness",
  );
});

test("import center upload URL builder encodes CSV upload query", () => {
  const url = new URL(
    buildImportUploadUrl(
      {
        batchId: "BATCH-CSV-001",
        fileName: "主数据.csv",
        fileType: "master_data",
        uploadedBy: "ops",
        businessDateFrom: "2026-05-01",
        businessDateTo: "2026-05-31",
        fieldMapping: '{"source_key":"source_key","姓名":"employee_name"}',
      },
      "http://127.0.0.1:8000",
    ),
  );

  assert.equal(url.origin, "http://127.0.0.1:8000");
  assert.equal(url.pathname, "/api/v1/import-batches/upload-csv");
  assert.equal(url.searchParams.get("batch_id"), "BATCH-CSV-001");
  assert.equal(url.searchParams.get("file_name"), "主数据.csv");
  assert.equal(url.searchParams.get("file_type"), "master_data");
  assert.equal(url.searchParams.get("uploaded_by"), "ops");
  assert.equal(url.searchParams.get("business_date_from"), "2026-05-01");
  assert.equal(url.searchParams.get("business_date_to"), "2026-05-31");
  assert.equal(
    url.searchParams.get("field_mapping"),
    '{"source_key":"source_key","姓名":"employee_name"}',
  );
});

test("import center upload URL builder can submit a field mapping template id", () => {
  const url = new URL(
    buildImportUploadUrl(
      {
        batchId: "BATCH-TPL-001",
        fileName: "schedule.csv",
        fileType: "personnel_schedule",
        uploadedBy: "ops",
        businessDateFrom: "2026-05-01",
        businessDateTo: "2026-05-31",
        fieldMapping: '{"source_key":"source_key"}',
        templateId: "TPL-SCHEDULE-001",
      },
      "http://127.0.0.1:8000",
    ),
  );

  assert.equal(url.pathname, "/api/v1/import-batches/upload-csv");
  assert.equal(url.searchParams.get("template_id"), "TPL-SCHEDULE-001");
  assert.equal(url.searchParams.get("field_mapping"), '{"source_key":"source_key"}');
});

test("import center quality exception trace explains downstream impact", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-SCHEDULE-001",
      file_name: "schedule.csv",
      file_type: "personnel_schedule",
      uploaded_by: "planner",
      uploaded_at: "2026-05-29T11:00:00+08:00",
      business_date_from: "2026-05-01",
      business_date_to: "2026-05-31",
      processing_status: "completed_with_errors",
      total_rows: 4,
      success_rows: 2,
      failed_rows: 1,
      warning_rows: 1,
    },
    rows: [
      { row_id: 1, batch_id: "BATCH-SCHEDULE-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-SCHEDULE-001", row_number: 2, row_status: "failed", source_key: null, error_field: "employee_id", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-SCHEDULE-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: "shift_type", error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-SCHEDULE-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-SCHEDULE-001::v1",
        batch_id: "BATCH-SCHEDULE-001",
        version_type: "personnel_schedule",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportQualityExceptionTrace(detail), {
    tone: "blocked",
    title: "履约异常判断被导入数据阻塞",
    impactScope: "人员排班 -> 排班 vs 登录/状态异常",
    issueSummary: "1 行失败、1 行警告；失败行会影响迟到、缺勤、未按排班登录等异常判断。",
    nextAction: "先修正失败行并复核警告行，再查看应用准备度和下游对比结果。",
    evidenceLabel: "错误字段：employee_id、shift_type",
  });

  assert.deepEqual(
    summarizeImportQualityExceptionTrace({
      ...detail,
      batch: {
        ...detail.batch,
        file_type: "demand_forecast",
        processing_status: "completed",
      },
      rows: detail.rows.filter((row) => row.row_status === "success"),
      versions: [],
    }),
    {
      tone: "warning",
      title: "版本缺口影响异常引用",
      impactScope: "需求预测 -> 预测 vs 排班缺口异常",
      issueSummary: "2 行已解析但还没有版本记录；缺口异常无法稳定引用预测版本。",
      nextAction: "先确认导入版本生成，再进入预测 vs 排班对比复核。",
      evidenceLabel: "错误字段：无",
    },
  );
});

test("import center exception guidance consolidates API and empty-state blockers", () => {
  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: "导入批次 API 返回 500",
      readinessError: null,
      templateError: null,
      selectedBatchId: null,
      batchCount: 0,
      templateCount: 2,
    }),
    [
      {
        scope: "batch_api",
        tone: "blocked",
        title: "批次读取失败",
        detail: "导入批次 API 返回 500",
        nextAction: "先刷新批次列表；批次不可读时先不要继续判断准备度。",
      },
    ],
  );

  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: null,
      readinessError: "准备度 API 返回 404",
      templateError: "字段映射模板 API 返回 500",
      selectedBatchId: "BATCH-MD-001",
      batchCount: 1,
      templateCount: 0,
    }),
    [
      {
        scope: "readiness_api",
        tone: "blocked",
        title: "准备度读取失败",
        detail: "BATCH-MD-001：准备度 API 返回 404",
        nextAction: "先刷新准备度；准备度未知时先不要应用或进入复核。",
      },
      {
        scope: "template_api",
        tone: "warning",
        title: "模板读取失败",
        detail: "字段映射模板 API 返回 500",
        nextAction: "上传仍可使用手填字段映射 JSON；稍后再重试模板读取。",
      },
    ],
  );

  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: null,
      readinessError: null,
      templateError: null,
      selectedBatchId: null,
      batchCount: 0,
      templateCount: 0,
    }),
    [
      {
        scope: "empty_batches",
        tone: "warning",
        title: "暂无导入批次",
        detail: "当前没有可查看或复核的导入批次。",
        nextAction: "先上传 CSV，生成批次、行结果和导入版本后再继续检查准备度。",
      },
      {
        scope: "empty_templates",
        tone: "warning",
        title: "暂无字段映射模板",
        detail: "当前没有启用或停用模板可供选择。",
        nextAction: "可先手填字段映射 JSON，或新建字段映射模板。",
      },
    ],
  );

  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: null,
      readinessError: null,
      templateError: null,
      selectedBatchId: "BATCH-MD-001",
      batchCount: 1,
      templateCount: 2,
    }),
    [
      {
        scope: "ready",
        tone: "ready",
        title: "关键异常态已收敛",
        detail: "批次、准备度和字段映射模板均可读取。",
        nextAction: "继续处理失败行、检查应用前行动建议，或上传下一份文件。",
      },
    ],
  );
});
