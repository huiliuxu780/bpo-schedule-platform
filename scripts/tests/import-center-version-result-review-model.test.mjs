import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportVersionWorkbenchComparisonResultReview,
} = jiti("../../components/import-center-model.ts");

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
