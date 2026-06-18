import assert from "node:assert/strict";
import test from "node:test";


import {
  filterSchedulePlanRows,
  summarizeSchedulePlanRows,
} from "../../components/data-table-model.ts";

test("schedule plan helpers filter rows and summarize plan coverage", () => {
  const rows = [
    {
      id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      version: "v1",
      status: "review_ready",
      forecast_agents: 20,
      scheduled_agents: 18,
      gap_agents: 2,
      coverage_rate: 0.9,
      updated_at: "2026-05-11T09:30:00+08:00",
    },
    {
      id: "plan-b",
      plan_date: "2026-05-12",
      project_name: "博西客服",
      site_name: "苏州职场",
      version: "v2",
      status: "published",
      forecast_agents: 10,
      scheduled_agents: 10,
      gap_agents: 0,
      coverage_rate: 1,
      updated_at: "2026-05-11T18:20:00+08:00",
    },
  ];

  assert.deepEqual(
    filterSchedulePlanRows(rows, { query: "上海", status: "review_ready", gap: "with_gap" }).map((row) => row.id),
    ["plan-a"],
  );
  assert.deepEqual(
    filterSchedulePlanRows(rows, { query: "", status: "all", gap: "covered" }).map((row) => row.id),
    ["plan-b"],
  );
  assert.deepEqual(summarizeSchedulePlanRows(rows), {
    total: 2,
    draft: 0,
    reviewReady: 1,
    published: 1,
    totalForecast: 30,
    totalScheduled: 28,
    totalGap: 2,
    coverageRate: 0.9333333333333333,
  });
});
