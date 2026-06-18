import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportQualityImpactAggregation,
  summarizeImportExceptionGuidance,
  summarizeImportQualityExceptionTrace,
} = jiti("../../components/import-center-model.ts");

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
