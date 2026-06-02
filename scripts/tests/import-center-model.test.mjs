import assert from "node:assert/strict";
import test from "node:test";

import {
  buildImportApiUrl,
  buildImportBatchDetailUrl,
  buildImportBatchProcessingHref,
  buildImportComparisonRunsUrl,
  buildImportQualityIssueReviewCasesHref,
  buildImportReviewCaseDetailApiUrl,
  buildImportReviewCaseDetailWorkspaceHref,
  buildImportReviewCasesWorkspaceHref,
  buildImportFieldMappingTemplatesUrl,
  buildImportReviewCasesUrl,
  buildImportRowCorrectionUrl,
  buildImportUploadUrl,
  filterImportBatches,
  formatFieldMappingTemplateSummary,
  formatImportRowErrorField,
  formatImportRowStatus,
  summarizeImportApplyActionGuidance,
  summarizeImportApplicationVisibility,
  summarizeImportDownstreamResultNavigation,
  summarizeImportDownstreamResultDrilldown,
  summarizeImportQualityImpactAggregation,
  summarizeImportReviewConclusionPreview,
  summarizeImportReviewCaseDetail,
  summarizeImportReviewEvidenceGapDrilldown,
  summarizeImportReviewCasesWorkspace,
  filterImportReviewCases,
  summarizeImportResultTrace,
  summarizeImportPageHierarchy,
  summarizeImportReadinessIssueGroups,
  summarizeImportBatchDetailReadability,
  summarizeImportExceptionGuidance,
  summarizeImportBatchReviewGuide,
  summarizeImportQualityExceptionTrace,
  summarizeImportRowCorrectionNotice,
  summarizeImportTemplateFitHint,
  summarizeImportTemplateFitDetail,
  summarizeImportUploadResultGuidance,
  summarizeImportFieldMappingTemplates,
  summarizeImportBatchDetail,
  getImportRowStandardFieldsPreview,
  formatImportFileType,
  getImportBatchHealth,
  summarizeImportBatches,
} from "../../components/import-center-model.ts";

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
      detail: "当前批次准备度为可应用，但本页仍只展示状态，不提供应用写入按钮。",
      nextAction: "复核应用目标、版本和批次明细；真正应用写入需要单独受控任务。",
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
        "人员排班已应用 36 条记录，可继续查看预测 vs 排班或排班 vs 实际登录/状态的本地结果列表。",
      comparisonLabel: "对比结果：排班版本 BATCH-SCH-001::v1",
      reviewLabel: "复核案例：按履约异常结果继续追踪",
      primaryActionLabel: "查看对比结果 API",
      primaryHref: "/api/v1/comparison-runs?business_date=2026-05-01",
      secondaryActionLabel: "查看复核案例 API",
      secondaryHref: "/api/v1/review-cases?business_date=2026-05-01",
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
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响后续对比与复核判断。",
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
    "http://127.0.0.1:8000/api/v1/comparison-runs?business_date=2026-05-11",
  );
  assert.equal(
    buildImportReviewCasesUrl("2026-05-11"),
    "http://127.0.0.1:8000/api/v1/review-cases?business_date=2026-05-11",
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
      nextAction: "先确认本地结果查询 API 状态；读取失败时不要把当前批次判断为无下游结果。",
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
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响后续对比与复核判断。",
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
      primaryHref: "http://127.0.0.1:8000/api/v1/review-cases/CASE-001",
      secondaryActionLabel: "查看关联对比运行",
      secondaryHref: "http://127.0.0.1:8000/api/v1/comparison-runs/RUN-001",
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

test("import center review conclusion preview summarizes open review cases and evidence", () => {
  assert.deepEqual(
    summarizeImportReviewConclusionPreview({
      businessDate: "2026-05-11",
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
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 45,
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
      qualityImpact: {
        tone: "blocked",
        title: "质量问题正在影响下游判断",
        detail: "当前批次有 3 行质量问题。",
        downstreamLabel: "复核案例 2 个 · 未关闭 1 个 · 对比结果 18 条",
        topIssueLabel: "employee_id · REQUIRED_FIELD_MISSING",
        nextAction: "先处理质量问题行数最多的问题组，再回看未关闭复核案例和对比结果。",
        groups: [
          {
            key: "employee_id::REQUIRED_FIELD_MISSING",
            title: "employee_id · REQUIRED_FIELD_MISSING",
            rowCount: 3,
            failedRows: 2,
            warningRows: 1,
            affectedReviewCases: 2,
            openReviewCases: 1,
            comparisonResults: 18,
            impactLabel: "3 行问题 · 2 个复核案例 · 18 条对比结果",
            evidence: ["行 2 失败", "source_key A2"],
            nextAction: "先修正 employee_id 的 REQUIRED_FIELD_MISSING，再回看未关闭复核案例。",
          },
        ],
      },
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "建议暂缓关闭复核",
      suggestedConclusion: "当前有 1 个未关闭复核案例，且首要质量问题为 employee_id · REQUIRED_FIELD_MISSING；建议先补齐证据后再关闭。",
      evidenceSummary: "复核 CASE-001 · high · supervisor-01；对比 RUN-001 · 排班 vs 实际 · 18 条结果；质量 employee_id · REQUIRED_FIELD_MISSING",
      residualRisk: "仍有 1 个未关闭复核案例和 3 行质量问题；直接关闭会留下证据缺口。",
      nextAction: "先处理首要质量问题和未关闭复核案例，确认补证后再进入受控关闭流程。",
      evidence: [
        "业务日 2026-05-11",
        "复核案例 2 个",
        "未关闭 1 个",
        "对比结果 18 条",
      ],
    },
  );
});

test("import center review conclusion preview handles empty and read-error states", () => {
  assert.deepEqual(
    summarizeImportReviewConclusionPreview({
      businessDate: null,
      comparisonRuns: [],
      reviewCases: [],
      qualityImpact: {
        tone: "empty",
        title: "等待批次明细",
        detail: "还没有可聚合的行级质量结果。",
        downstreamLabel: "复核案例 0 个 · 未关闭 0 个 · 对比结果 0 条",
        topIssueLabel: "暂无质量问题",
        nextAction: "先确认批次明细是否读取成功，再查看质量影响聚合。",
        groups: [],
      },
      comparisonError: null,
      reviewError: "复核 API 返回 500",
    }),
    {
      tone: "blocked",
      title: "暂不能生成结论预览",
      suggestedConclusion: "复核案例读取失败，当前结论预览只能作为占位，不能用于关闭判断。",
      evidenceSummary: "复核案例读取失败；对比结果 0 条；质量 暂无质量问题",
      residualRisk: "下游结果读取不完整，可能漏掉未关闭异常或证据缺口。",
      nextAction: "先恢复下游结果读取，再生成复核结论预览。",
      evidence: [
        "业务日 未选择",
        "复核读取失败",
        "复核案例 0 个",
        "对比结果 0 条",
      ],
    },
  );
});

test("import center review evidence gap drilldown ranks open cases with quality context", () => {
  assert.deepEqual(
    summarizeImportReviewEvidenceGapDrilldown({
      businessDate: "2026-05-11",
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
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 45,
          created_at: "2026-05-11T10:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-LOW",
          source_result_type: "schedule_actual",
          source_result_id: 11,
          business_date: "2026-05-11",
          owner_id: "supervisor-02",
          severity: "medium",
          status: "open",
          created_at: "2026-05-11T12:00:00+08:00",
        },
        {
          case_id: "CASE-HIGH",
          source_result_type: "schedule_actual",
          source_result_id: 10,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T11:00:00+08:00",
        },
        {
          case_id: "CASE-CLOSED",
          source_result_type: "schedule_actual",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-03",
          severity: "low",
          status: "closed",
          created_at: "2026-05-11T13:00:00+08:00",
        },
      ],
      qualityImpact: {
        tone: "blocked",
        title: "质量问题正在影响下游判断",
        detail: "当前批次有 3 行质量问题。",
        downstreamLabel: "复核案例 3 个 · 未关闭 2 个 · 对比结果 18 条",
        topIssueLabel: "employee_id · REQUIRED_FIELD_MISSING",
        nextAction: "先处理质量问题行数最多的问题组，再回看未关闭复核案例和对比结果。",
        groups: [
          {
            key: "employee_id::REQUIRED_FIELD_MISSING",
            title: "employee_id · REQUIRED_FIELD_MISSING",
            rowCount: 3,
            failedRows: 2,
            warningRows: 1,
            affectedReviewCases: 3,
            openReviewCases: 2,
            comparisonResults: 18,
            impactLabel: "3 行问题 · 3 个复核案例 · 18 条对比结果",
            evidence: ["行 2 失败", "source_key A2"],
            nextAction: "先修正 employee_id 的 REQUIRED_FIELD_MISSING，再回看未关闭复核案例。",
          },
        ],
      },
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "blocked",
      title: "证据缺口需要先处理",
      summary: "当前 2 个未关闭复核案例需要补齐证据；首要缺口为 CASE-HIGH，关联 employee_id · REQUIRED_FIELD_MISSING。",
      ownerSummary: "owner supervisor-01、supervisor-02",
      nextAction: "先按高风险缺口补齐证据，再回看复核结论预览。",
      gaps: [
        {
          key: "CASE-HIGH",
          title: "CASE-HIGH · high",
          ownerId: "supervisor-01",
          riskTone: "blocked",
          evidenceNeed: "补充登录/状态明细、排班版本引用和质量修正记录。",
          relatedQualityIssue: "employee_id · REQUIRED_FIELD_MISSING",
          relatedComparison: "RUN-001 · 排班 vs 实际 · 18 条结果",
          riskLabel: "高风险 · 质量问题 3 行 · 对比结果 18 条",
          nextAction: "owner supervisor-01 先补齐 CASE-HIGH 的关键证据，再进入关闭前复核。",
          evidence: ["业务日 2026-05-11", "来源 schedule_actual#10", "状态 open"],
        },
        {
          key: "CASE-LOW",
          title: "CASE-LOW · medium",
          ownerId: "supervisor-02",
          riskTone: "warning",
          evidenceNeed: "补充登录/状态明细、排班版本引用和质量修正记录。",
          relatedQualityIssue: "employee_id · REQUIRED_FIELD_MISSING",
          relatedComparison: "RUN-001 · 排班 vs 实际 · 18 条结果",
          riskLabel: "中风险 · 质量问题 3 行 · 对比结果 18 条",
          nextAction: "owner supervisor-02 先补齐 CASE-LOW 的关键证据，再进入关闭前复核。",
          evidence: ["业务日 2026-05-11", "来源 schedule_actual#11", "状态 open"],
        },
      ],
    },
  );
});

test("import center review evidence gap drilldown handles empty and read-error states", () => {
  assert.deepEqual(
    summarizeImportReviewEvidenceGapDrilldown({
      businessDate: null,
      comparisonRuns: [],
      reviewCases: [],
      qualityImpact: {
        tone: "empty",
        title: "等待批次明细",
        detail: "还没有可聚合的行级质量结果。",
        downstreamLabel: "复核案例 0 个 · 未关闭 0 个 · 对比结果 0 条",
        topIssueLabel: "暂无质量问题",
        nextAction: "先确认批次明细是否读取成功，再查看质量影响聚合。",
        groups: [],
      },
      comparisonError: null,
      reviewError: "复核 API 返回 500",
    }),
    {
      tone: "blocked",
      title: "暂不能判断证据缺口",
      summary: "复核案例读取失败，当前缺口列表只能作为占位。",
      ownerSummary: "owner 暂不可用",
      nextAction: "先恢复复核案例读取，再判断证据缺口。",
      gaps: [],
    },
  );

  assert.deepEqual(
    summarizeImportReviewEvidenceGapDrilldown({
      businessDate: "2026-05-11",
      comparisonRuns: [],
      reviewCases: [],
      qualityImpact: {
        tone: "ready",
        title: "暂无行级质量问题",
        detail: "当前批次没有失败行或警告行。",
        downstreamLabel: "复核案例 0 个 · 未关闭 0 个 · 对比结果 0 条",
        topIssueLabel: "暂无质量问题",
        nextAction: "继续查看下游结果判断。",
        groups: [],
      },
      comparisonError: null,
      reviewError: null,
    }),
    {
      tone: "empty",
      title: "暂无证据缺口",
      summary: "当前业务日没有未关闭复核案例，暂不形成证据缺口列表。",
      ownerSummary: "owner 无",
      nextAction: "继续查看对比结果和复核结论预览。",
      gaps: [],
    },
  );
});

test("import center review cases workspace builds page href and filters cases", () => {
  assert.equal(
    buildImportQualityIssueReviewCasesHref({
      businessDate: "2026-05-11",
      sourceResultType: "schedule_actual",
      issueTitle: "employee_id · REQUIRED_FIELD_MISSING",
    }),
    "/data-quality/review-cases?businessDate=2026-05-11&status=open&sourceResultType=schedule_actual&query=employee_id+%C2%B7+REQUIRED_FIELD_MISSING"
  );

  assert.equal(
    buildImportReviewCasesWorkspaceHref({
      businessDate: "2026-05-11",
      ownerId: "OWNER-A",
      status: "open",
      severity: "high",
      sourceResultType: "schedule_actual",
      query: "late",
    }),
    "/data-quality/review-cases?businessDate=2026-05-11&ownerId=OWNER-A&status=open&severity=high&sourceResultType=schedule_actual&query=late"
  );

  const cases = [
    {
      case_id: "CASE-LATE-001",
      source_result_type: "schedule_actual",
      source_result_id: 18,
      business_date: "2026-05-11",
      owner_id: "OWNER-A",
      severity: "high",
      status: "open",
      created_at: "2026-05-11T10:00:00+08:00",
    },
    {
      case_id: "CASE-CLOSED-001",
      source_result_type: "forecast_schedule",
      source_result_id: 8,
      business_date: "2026-05-11",
      owner_id: "OWNER-B",
      severity: "low",
      status: "closed",
      created_at: "2026-05-11T11:00:00+08:00",
    },
  ];

  assert.deepEqual(
    filterImportReviewCases(cases, {
      businessDate: "2026-05-11",
      ownerId: "OWNER-A",
      status: "open",
      severity: "high",
      sourceResultType: "schedule_actual",
      query: "late",
    }),
    [cases[0]]
  );

  assert.deepEqual(
    filterImportReviewCases(cases, {
      businessDate: "2026-05-11",
      status: "open",
      sourceResultType: "schedule_actual",
      query: "employee_id · REQUIRED_FIELD_MISSING",
    }),
    [cases[0]]
  );
});

test("import center review cases workspace summarizes groups and next action", () => {
  const summary = summarizeImportReviewCasesWorkspace({
    cases: [
      {
        case_id: "CASE-HIGH-001",
        source_result_type: "schedule_actual",
        source_result_id: 18,
        business_date: "2026-05-11",
        owner_id: "OWNER-A",
        severity: "high",
        status: "open",
        created_at: "2026-05-11T10:00:00+08:00",
      },
      {
        case_id: "CASE-MEDIUM-001",
        source_result_type: "forecast_schedule",
        source_result_id: 12,
        business_date: "2026-05-11",
        owner_id: "OWNER-A",
        severity: "medium",
        status: "open",
        created_at: "2026-05-11T10:20:00+08:00",
      },
      {
        case_id: "CASE-CLOSED-001",
        source_result_type: "schedule_actual",
        source_result_id: 20,
        business_date: "2026-05-11",
        owner_id: "OWNER-B",
        severity: "low",
        status: "closed",
        created_at: "2026-05-11T11:00:00+08:00",
      },
    ],
    filters: {
      businessDate: "2026-05-11",
      status: "all",
      severity: "all",
      sourceResultType: "all",
    },
    error: null,
  });

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.title, "复核案例 3 个");
  assert.equal(summary.openCount, 2);
  assert.equal(summary.closedCount, 1);
  assert.equal(summary.ownerGroups[0].ownerId, "OWNER-A");
  assert.equal(summary.ownerGroups[0].openCount, 2);
  assert.equal(summary.statusGroups[0].label, "未关闭");
  assert.equal(summary.statusGroups[0].count, 2);
  assert.equal(summary.sourceGroups[0].label, "排班实际");
  assert.equal(summary.sourceGroups[0].count, 2);
  assert.equal(
    summary.nextAction,
    "先处理 OWNER-A 名下 2 个未关闭复核案例，再回看高风险来源和证据缺口。"
  );
});

test("import center review case detail summarizes read-only case context", () => {
  assert.equal(
    buildImportReviewCaseDetailWorkspaceHref("CASE-QUERY-001"),
    "/data-quality/review-cases/CASE-QUERY-001"
  );
  assert.equal(
    buildImportReviewCaseDetailApiUrl("CASE-QUERY-001"),
    "http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001"
  );

  assert.deepEqual(
    summarizeImportReviewCaseDetail({
      detail: {
        case: {
          case_id: "CASE-QUERY-001",
          source_result_type: "forecast_schedule",
          source_result_id: 12,
          business_date: "2026-05-11",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-05-11T10:00:00+08:00",
        },
        evidence: [
          {
            evidence_id: "EVD-QUERY-001",
            case_id: "CASE-QUERY-001",
            evidence_type: "note",
            evidence_uri: "local://review/CASE-QUERY-001/note",
            submitted_by: "supervisor-01",
            submitted_at: "2026-05-11T10:20:00+08:00",
            note: "复核说明",
          },
        ],
        conclusions: [
          {
            conclusion_id: "CON-QUERY-001",
            case_id: "CASE-QUERY-001",
            conclusion_type: "confirmed_gap",
            risk_level: "high",
            conclusion_text: "确认预测与排班缺口。",
            decided_by: "ops-lead-01",
            decided_at: "2026-05-11T10:30:00+08:00",
          },
        ],
        closure: null,
      },
      error: null,
    }),
    {
      tone: "blocked",
      title: "CASE-QUERY-001 · 高 · 未关闭",
      sourceLabel: "预测排班 #12",
      ownerLabel: "supervisor-01",
      evidenceLabel: "证据 1 条 · 结论 1 条 · 未关闭",
      qualityFocus: "预测版本、排班版本和质量修正记录。",
      evidenceGap: "仍需确认预测版本、排班版本引用和质量修正记录。",
      nextAction: "owner supervisor-01 先复核 1 条证据和 1 条结论，再进入受控关闭流程。",
      detailHref: "http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001",
      listHref: "/data-quality/review-cases?businessDate=2026-05-11&ownerId=supervisor-01&status=open&severity=high&sourceResultType=forecast_schedule",
      evidence: [
        "业务日 2026-05-11",
        "来源 预测排班 #12",
        "证据 EVD-QUERY-001 · note · supervisor-01",
        "结论 CON-QUERY-001 · high · ops-lead-01",
      ],
    }
  );

  assert.deepEqual(
    summarizeImportReviewCaseDetail({
      detail: null,
      error: "复核案例 API 返回 404",
    }),
    {
      tone: "blocked",
      title: "复核案例读取失败",
      sourceLabel: "来源不可用",
      ownerLabel: "owner 不可用",
      evidenceLabel: "证据不可用",
      qualityFocus: "质量问题不可用",
      evidenceGap: "复核案例 API 返回 404",
      nextAction: "先恢复复核案例读取，再查看来源结果和证据缺口。",
      detailHref: "/data-quality/review-cases",
      listHref: "/data-quality/review-cases",
      evidence: ["读取失败"],
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
      primaryRegion: "接入批次工作台",
      inspectorRegion: "状态检查",
      detailTabs: ["状态检查", "失败行修正", "批次明细", "结果追踪", "导入与模板"],
      defaultDetailTab: "status-check",
      utilityPlacement: "导入与模板收纳到批次处理工作区",
      layoutIntent: "先看处理总览，再进入全宽批次处理工作区。",
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

test("import center mapping template URL builder supports all templates and file type filtering", () => {
  assert.equal(
    buildImportFieldMappingTemplatesUrl(undefined, "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates",
  );
  assert.equal(
    buildImportFieldMappingTemplatesUrl("master_data", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates?file_type=master_data",
  );
});

test("import center mapping template summary previews stable field pairs", () => {
  assert.equal(
    formatFieldMappingTemplateSummary({
      template_id: "TPL-MD-001",
      template_name: "主数据 source_key",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
        "工号": "employee_id",
        "城市": "worksite",
      },
      created_by: "ops",
      created_at: "2026-05-29T10:00:00+08:00",
      is_active: true,
    }),
    "source_key -> source_key, 姓名 -> employee_name, 工号 -> employee_id +1",
  );
});

test("import center detail and correction URL builders encode batch and row path", () => {
  assert.equal(
    buildImportBatchDetailUrl("BATCH/CSV 001", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/persisted/BATCH%2FCSV%20001",
  );
  assert.equal(
    buildImportRowCorrectionUrl("BATCH/CSV 001", 3, "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/BATCH%2FCSV%20001/rows/3/correct",
  );
});

test("import center failed row preview prefers standard fields over raw data", () => {
  assert.deepEqual(
    getImportRowStandardFieldsPreview({
      row_id: 1,
      batch_id: "B1",
      row_number: 2,
      row_status: "failed",
      source_key: null,
      error_field: "source_key",
      error_code: "MISSING_REQUIRED_FIELD",
      error_message: "source_key is required",
      raw_data: {
        source: "csv",
        standard_fields: {
          employee_id: "E001",
          employee_name: "张敏",
        },
      },
    }),
    '{"employee_id":"E001","employee_name":"张敏"}',
  );

  assert.deepEqual(
    getImportRowStandardFieldsPreview({
      row_id: 2,
      batch_id: "B1",
      row_number: 3,
      row_status: "failed",
      source_key: null,
      error_field: "source_key",
      error_code: "MISSING_REQUIRED_FIELD",
      error_message: "source_key is required",
      raw_data: {
        employee_id: "E002",
      },
    }),
    '{"employee_id":"E002"}',
  );
});

test("import center detail summary counts persisted row statuses", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-DETAIL-001",
      file_name: "detail.csv",
      file_type: "master_data",
      uploaded_by: "ops",
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
      { row_id: 1, batch_id: "BATCH-DETAIL-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-DETAIL-001", row_number: 2, row_status: "failed", source_key: null, error_field: "source_key", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-DETAIL-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: null, error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-DETAIL-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-DETAIL-001::v1",
        batch_id: "BATCH-DETAIL-001",
        version_type: "master_data",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportBatchDetail(detail), {
    totalRows: 4,
    successRows: 2,
    failedRows: 1,
    warningRows: 1,
    versionCount: 1,
  });
});

test("import center batch detail readability explains next review focus", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-DETAIL-001",
      file_name: "detail.csv",
      file_type: "master_data",
      uploaded_by: "ops",
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
      { row_id: 1, batch_id: "BATCH-DETAIL-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-DETAIL-001", row_number: 2, row_status: "failed", source_key: null, error_field: "source_key", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-DETAIL-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: "employee_id", error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-DETAIL-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-DETAIL-001::v1",
        batch_id: "BATCH-DETAIL-001",
        version_type: "master_data",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportBatchDetailReadability(detail), {
    tone: "blocked",
    title: "先处理失败行",
    detail: "当前批次共 4 行，1 行失败、1 行警告；失败行会阻塞后续应用。",
    nextAction: "先查看全部行结果中的错误字段和失败原因，再进入失败行修正。",
    focusLabel: "失败行",
    errorFieldSummary: "source_key、employee_id",
  });

  assert.deepEqual(
    summarizeImportBatchDetailReadability({
      ...detail,
      rows: detail.rows.filter((row) => row.row_status !== "failed"),
      versions: [],
    }),
    {
      tone: "warning",
      title: "缺少版本记录",
      detail: "当前批次有 3 行结果但还没有版本记录；需要先确认导入版本是否生成。",
      nextAction: "优先查看版本记录区域和应用准备度，确认是否存在版本缺口。",
      focusLabel: "版本记录",
      errorFieldSummary: "employee_id",
    },
  );

  assert.equal(formatImportRowErrorField({ ...detail.rows[1], error_field: "source_key" }), "source_key");
  assert.equal(formatImportRowErrorField({ ...detail.rows[0], error_field: null }), "无");
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
    title: "履约异常判断被数据质量阻塞",
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

test("import center row status formatter is stable for detail drilldown", () => {
  assert.equal(formatImportRowStatus("success"), "成功");
  assert.equal(formatImportRowStatus("failed"), "失败");
  assert.equal(formatImportRowStatus("warning"), "警告");
});

test("import center row correction notice summarizes success and remaining work", () => {
  assert.deepEqual(
    summarizeImportRowCorrectionNotice({
      status: "success",
      row: "3",
      remainingFailedRows: 2,
    }),
    {
      tone: "success",
      title: "第 3 行已修正",
      detail: "当前批次仍有 2 行待修正。",
      nextAction: "继续处理剩余失败行，完成后再查看批次准备度。",
    },
  );

  assert.deepEqual(
    summarizeImportRowCorrectionNotice({
      status: "success",
      row: "3",
      remainingFailedRows: 0,
    }),
    {
      tone: "success",
      title: "第 3 行已修正",
      detail: "当前批次已没有失败行。",
      nextAction: "查看上方批次准备度和批次明细，确认是否仍有阻塞原因。",
    },
  );
});

test("import center row correction notice explains failed correction reasons", () => {
  assert.deepEqual(
    summarizeImportRowCorrectionNotice({
      status: "failed",
      reason: "invalid_json",
      row: "2",
      remainingFailedRows: 1,
    }),
    {
      tone: "failed",
      title: "修正失败",
      detail: "标准字段不是合法 JSON 对象。",
      nextAction: "检查字段 JSON、行号和本地 API 状态后重新提交。",
    },
  );

  assert.equal(
    summarizeImportRowCorrectionNotice({
      status: "idle",
      remainingFailedRows: 1,
    }),
    null,
  );
});

test("import center field mapping template summary tracks inventory and coverage", () => {
  assert.deepEqual(
    summarizeImportFieldMappingTemplates([
      {
        template_id: "TPL-MD-001",
        template_name: "主数据 source_key",
        file_type: "master_data",
        field_mapping: {
          source_key: "source_key",
          "姓名": "employee_name",
        },
        created_by: "ops",
        created_at: "2026-05-29T10:00:00+08:00",
        is_active: true,
      },
      {
        template_id: "TPL-SCH-001",
        template_name: "排班基础模板",
        file_type: "personnel_schedule",
        field_mapping: {
          source_key: "source_key",
          "日期": "business_date",
          "开始": "start_time",
        },
        created_by: "planner",
        created_at: "2026-05-29T11:00:00+08:00",
        is_active: false,
      },
    ]),
    {
      totalTemplates: 2,
      activeTemplates: 1,
      inactiveTemplates: 1,
      coveredFileTypes: 2,
      totalMappedFields: 5,
    },
  );
});

test("import center template fit hint recommends active template by selected file type", () => {
  const templates = [
    {
      template_id: "TPL-MD-LOW",
      template_name: "主数据基础模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
      },
      created_by: "ops",
      created_at: "2026-05-29T10:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-MD-FULL",
      template_name: "主数据完整模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
        "工号": "employee_id",
      },
      created_by: "ops",
      created_at: "2026-05-29T11:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-SCHEDULE-OFF",
      template_name: "停用排班模板",
      file_type: "personnel_schedule",
      field_mapping: {
        source_key: "source_key",
      },
      created_by: "ops",
      created_at: "2026-05-29T12:00:00+08:00",
      is_active: false,
    },
  ];

  assert.deepEqual(summarizeImportTemplateFitHint("master_data", templates), {
    fileType: "master_data",
    status: "matched",
    matchingTemplates: 2,
    activeMatchingTemplates: 2,
    recommendedTemplateId: "TPL-MD-FULL",
    recommendedTemplateName: "主数据完整模板",
    mappedFieldCount: 3,
    detail: "已找到 2 个启用模板，推荐使用“主数据完整模板”。",
    nextAction: "选择同类型模板后上传；如 CSV 表头不一致，再改用手填字段映射 JSON。",
  });

  assert.deepEqual(summarizeImportTemplateFitHint("personnel_schedule", templates), {
    fileType: "personnel_schedule",
    status: "missing",
    matchingTemplates: 1,
    activeMatchingTemplates: 0,
    recommendedTemplateId: null,
    recommendedTemplateName: null,
    mappedFieldCount: 0,
    detail: "人员排班没有启用模板。",
    nextAction: "先使用手填字段映射 JSON 上传；模板维护在单独任务中处理。",
  });

  assert.deepEqual(
    summarizeImportTemplateFitHint("login_log", templates, "字段映射模板 API 返回 500"),
    {
      fileType: "login_log",
      status: "error",
      matchingTemplates: 0,
      activeMatchingTemplates: 0,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      mappedFieldCount: 0,
      detail: "字段映射模板读取失败：字段映射模板 API 返回 500",
      nextAction: "保留手填字段映射 JSON 上传，或稍后重试模板读取。",
    },
  );
});

test("import center template fit detail ranks matching templates and reports standard field gaps", () => {
  const templates = [
    {
      template_id: "TPL-MD-LOW",
      template_name: "主数据基础模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
      },
      created_by: "ops",
      created_at: "2026-05-29T10:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-MD-FULL",
      template_name: "主数据完整模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
        "工号": "employee_id",
        "项目": "project_id",
      },
      created_by: "ops",
      created_at: "2026-05-29T11:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-SCH",
      template_name: "排班模板",
      file_type: "personnel_schedule",
      field_mapping: {
        source_key: "source_key",
      },
      created_by: "planner",
      created_at: "2026-05-29T12:00:00+08:00",
      is_active: false,
    },
  ];

  assert.deepEqual(summarizeImportTemplateFitDetail("master_data", templates), {
    fileType: "master_data",
    status: "matched",
    matchingTemplates: 2,
    activeMatchingTemplates: 2,
    inactiveMatchingTemplates: 0,
    recommendedTemplateId: "TPL-MD-FULL",
    recommendedTemplateName: "主数据完整模板",
    recommendedMappedFieldCount: 4,
    mappedStandardFields: ["employee_id", "employee_name", "project_id", "source_key"],
    missingStandardFields: ["worksite_id", "supplier_id"],
    templateOptions: [
      {
        templateId: "TPL-MD-FULL",
        templateName: "主数据完整模板",
        isActive: true,
        mappedFieldCount: 4,
        mappedStandardFields: ["employee_id", "employee_name", "project_id", "source_key"],
        missingStandardFields: ["worksite_id", "supplier_id"],
        mappingPairs: [
          { sourceField: "source_key", standardField: "source_key" },
          { sourceField: "姓名", standardField: "employee_name" },
          { sourceField: "工号", standardField: "employee_id" },
          { sourceField: "项目", standardField: "project_id" },
        ],
      },
      {
        templateId: "TPL-MD-LOW",
        templateName: "主数据基础模板",
        isActive: true,
        mappedFieldCount: 2,
        mappedStandardFields: ["employee_name", "source_key"],
        missingStandardFields: [
          "employee_id",
          "worksite_id",
          "supplier_id",
          "project_id",
        ],
        mappingPairs: [
          { sourceField: "source_key", standardField: "source_key" },
          { sourceField: "姓名", standardField: "employee_name" },
        ],
      },
    ],
    title: "推荐使用主数据完整模板",
    detail: "当前主数据有 2 个启用模板；推荐模板覆盖 4 个字段，仍缺 2 个建议字段。",
    nextAction: "优先使用推荐模板；如果 CSV 表头不一致，继续用手填字段映射 JSON 兜底。",
  });

  assert.deepEqual(summarizeImportTemplateFitDetail("status_log", templates), {
    fileType: "status_log",
    status: "missing",
    matchingTemplates: 0,
    activeMatchingTemplates: 0,
    inactiveMatchingTemplates: 0,
    recommendedTemplateId: null,
    recommendedTemplateName: null,
    recommendedMappedFieldCount: 0,
    mappedStandardFields: [],
    missingStandardFields: [
      "source_key",
      "employee_id",
      "status_code",
      "start_time",
      "end_time",
    ],
    templateOptions: [],
    title: "暂无启用状态日志模板",
    detail: "当前状态日志没有启用模板；上传前需要手填字段映射 JSON。",
    nextAction: "先使用手填字段映射 JSON；模板新增或维护留到单独受控任务。",
  });
});

test("import center apply action guidance explains next step before write actions", () => {
  const readyReadiness = {
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
  };

  assert.deepEqual(summarizeImportApplyActionGuidance(readyReadiness), {
    tone: "ready",
    title: "可进入应用前复核",
    detail: "10 行成功、0 行失败，已生成 1 个版本。",
    nextAction: "复核版本和目标对象后，再由后续受控任务提供应用写入入口。",
  });

  assert.deepEqual(
    summarizeImportApplyActionGuidance({
      ...readyReadiness,
      readiness_status: "blocked",
      failed_rows: 2,
      blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "批次仍有失败行" }],
    }),
    {
      tone: "blocked",
      title: "先修正失败行",
      detail: "当前批次还有 2 行失败，不能进入应用写入。",
      nextAction: "在失败行修正区逐行补齐标准字段，完成后重新查看准备度。",
    },
  );

  assert.deepEqual(
    summarizeImportApplyActionGuidance({
      ...readyReadiness,
      readiness_status: "blocked",
      row_blockers: [
        {
          row_number: 3,
          code: "MISSING_REQUIRED_FIELD",
          field_name: "employee_id",
          message: "employee_id is required",
        },
        {
          row_number: 4,
          code: "MISSING_REQUIRED_FIELD",
          field_name: "shift_type",
          message: "shift_type is required",
        },
      ],
    }),
    {
      tone: "blocked",
      title: "先补齐行级必填字段",
      detail: "2 个行级阻塞正在影响应用准备度。",
      nextAction: "优先处理第 3 行 employee_id；补齐后重新查看准备度。",
    },
  );

  assert.deepEqual(
    summarizeImportApplyActionGuidance({
      ...readyReadiness,
      readiness_status: "blocked",
      application_status: "applied",
      applied_record_count: 10,
      blockers: [
        {
          code: "IMPORT_BATCH_ALREADY_APPLIED",
          message: "already applied",
        },
      ],
    }),
    {
      tone: "done",
      title: "批次已应用",
      detail: "已写入 10 条记录，不需要重复应用。",
      nextAction: "查看下游版本或结果列表，确认是否还需要复核异常。",
    },
  );

  assert.deepEqual(
    summarizeImportApplyActionGuidance(null, "准备度 API 返回 500"),
    {
      tone: "unknown",
      title: "准备度暂不可判断",
      detail: "准备度 API 返回 500",
      nextAction: "先确认本地 API 状态；不要在准备度未知时执行应用写入。",
    },
  );
});

test("import center readiness issue groups prioritize blockers by operational type", () => {
  assert.deepEqual(
    summarizeImportReadinessIssueGroups({
      batch_id: "BATCH-READINESS-001",
      file_type: "master_data",
      readiness_status: "blocked",
      blockers: [
        { code: "IMPORT_FAILED_ROWS_PRESENT", message: "导入批次仍存在失败行。" },
        { code: "IMPORT_NO_SUCCESS_ROWS", message: "导入批次没有可应用的成功行。" },
      ],
      row_blockers: [
        {
          row_number: 1,
          code: "REQUIRED_FIELD_MISSING",
          field_name: "source_key",
          message: "缺少必填字段 source_key",
        },
        {
          row_number: 2,
          code: "REQUIRED_FIELD_MISSING",
          field_name: "employee_id",
          message: "缺少必填字段 employee_id",
        },
      ],
      total_rows: 2,
      success_rows: 0,
      failed_rows: 1,
      warning_rows: 0,
      version_count: 0,
      application_status: "not_applied",
      application_target: "master_data_snapshot",
      import_version_id: null,
      applied_record_count: 0,
    }),
    [
      {
        key: "failed_rows",
        tone: "blocked",
        title: "失败行阻塞",
        count: 1,
        detail: "当前批次还有 1 行失败，应用写入前必须先修正。",
        nextAction: "先进入失败行修正，补齐标准字段并重新检查准备度。",
        evidence: ["失败 1 行", "成功 0 行", "警告 0 行"],
      },
      {
        key: "row_required_fields",
        tone: "blocked",
        title: "行级必填字段缺口",
        count: 2,
        detail: "2 个行级阻塞正在影响应用准备度。",
        nextAction: "优先处理第 1 行 source_key；补齐后重新查看准备度。",
        evidence: ["第 1 行 source_key", "第 2 行 employee_id"],
      },
      {
        key: "version",
        tone: "blocked",
        title: "导入版本缺口",
        count: 1,
        detail: "当前批次还没有可追溯导入版本。",
        nextAction: "检查上传解析结果和版本生成记录，确认版本存在后再进入应用前复核。",
        evidence: ["版本 0", "导入版本 未生成"],
      },
      {
        key: "batch_blockers",
        tone: "blocked",
        title: "批次级阻塞",
        count: 2,
        detail: "2 个批次级阻塞仍需处理。",
        nextAction: "按阻塞码处理批次问题后重新检查准备度。",
        evidence: ["IMPORT_FAILED_ROWS_PRESENT", "IMPORT_NO_SUCCESS_ROWS"],
      },
    ],
  );

  assert.deepEqual(
    summarizeImportReadinessIssueGroups({
      batch_id: "BATCH-READY-001",
      file_type: "master_data",
      readiness_status: "ready",
      blockers: [],
      row_blockers: [],
      total_rows: 3,
      success_rows: 3,
      failed_rows: 0,
      warning_rows: 0,
      version_count: 1,
      application_status: "not_applied",
      application_target: "master_data_snapshot",
      import_version_id: "BATCH-READY-001::v1",
      applied_record_count: 0,
    }),
    [
      {
        key: "ready",
        tone: "ready",
        title: "准备度已通过",
        count: 0,
        detail: "当前批次没有应用前阻塞，已生成可追溯导入版本。",
        nextAction: "继续复核应用目标和下游结果；真正应用写入仍需单独受控入口。",
        evidence: ["成功 3 行", "版本 BATCH-READY-001::v1"],
      },
    ],
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
        nextAction: "先确认本地 API 和 /api/v1/import-batches；批次不可读时不要继续判断准备度。",
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
        nextAction: "先恢复准备度接口；准备度未知时不要执行应用写入或下游复核。",
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
        nextAction: "本轮先使用手填字段映射 JSON；模板维护留到后续受控任务。",
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

test("import center upload result guidance links uploads back to batch review", () => {
  assert.deepEqual(
    summarizeImportUploadResultGuidance({
      status: "success",
      batchId: "BATCH-CSV-001",
      reason: null,
    }),
    {
      tone: "success",
      title: "CSV 上传成功",
      detail: "批次 BATCH-CSV-001 已提交并可在接入批次中查看。",
      batchHref: "/data-quality?batch=BATCH-CSV-001",
      primaryActionLabel: "查看批次",
      nextAction: "查看批次行结果、失败行和应用准备度；确认无阻塞后再进入后续受控应用流程。",
    },
  );

  assert.deepEqual(
    summarizeImportUploadResultGuidance({
      status: "failed",
      batchId: "BATCH/CSV 001",
      reason: "api_409",
    }),
    {
      tone: "failed",
      title: "CSV 上传失败",
      detail: "接口返回 409，可能是批次号重复或请求不满足接口校验。",
      batchHref: "/data-quality?batch=BATCH%2FCSV%20001",
      primaryActionLabel: "回看批次",
      nextAction: "检查批次号、字段映射 JSON、模板选择和 CSV 表头后重新上传；如果批次已存在，先查看原批次结果。",
    },
  );

  assert.deepEqual(
    summarizeImportUploadResultGuidance({
      status: "failed",
      batchId: null,
      reason: "missing_required_fields",
    }),
    {
      tone: "failed",
      title: "CSV 上传失败",
      detail: "缺少批次号、业务日期或 CSV 文件。",
      batchHref: null,
      primaryActionLabel: "补齐后重试",
      nextAction: "补齐必填字段、确认选择 CSV 文件后重新上传。",
    },
  );

  assert.equal(
    summarizeImportUploadResultGuidance({
      status: undefined,
      batchId: null,
      reason: null,
    }),
    null,
  );
});
