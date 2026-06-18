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
  summarizeImportResultTrace,
  summarizeImportPageHierarchy,
  summarizeImportBatchReviewGuide,
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
