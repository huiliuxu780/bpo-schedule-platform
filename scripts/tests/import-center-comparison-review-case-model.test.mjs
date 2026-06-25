import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportComparisonRunReviewCases,
} = jiti("../../components/import-center-model.ts");

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
