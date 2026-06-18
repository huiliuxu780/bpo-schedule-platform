import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportComparisonRunCalculateUrl,
  buildImportComparisonRunsUrl,
  buildImportReviewCasesUrl,
  summarizeImportDownstreamResultDrilldown,
  summarizeImportDownstreamResultNavigation,
  summarizeImportResultTrace,
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
