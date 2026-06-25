import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportComparisonRunDetail,
} = jiti("../../components/import-center-model.ts");

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
