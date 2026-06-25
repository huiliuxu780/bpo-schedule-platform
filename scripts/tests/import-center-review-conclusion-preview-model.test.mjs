import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportReviewConclusionPreview,
} = jiti("../../components/import-center-model.ts");

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
      nextAction: "先处理首要质量问题和未关闭复核案例，确认补证后再进入关闭流程。",
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
      title: "无法生成结论预览",
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
