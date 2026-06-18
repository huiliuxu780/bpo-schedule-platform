import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportLatestComparisonRunCallback,
} = jiti("../../components/import-center-model.ts");

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
