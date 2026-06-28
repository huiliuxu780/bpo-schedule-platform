import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  buildDashboardOperationalViewModel,
  parseDashboardFilters,
} from "../../lib/dashboard.ts";

const root = process.cwd();

function readProject(relativePath) {
  return readFileSync(join(root, relativePath), "utf-8");
}

const dashboardPageSrc = readProject("app/dashboard/page.tsx");
const dashboardLibSrc = readProject("lib/dashboard.ts");
const chartAreaInteractiveSrc = readProject("components/chart-area-interactive.tsx");

const baseSource = { source: "api", failed: false };

const plans = [
  {
    id: "plan-shanghai-published",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    version: "v1",
    status: "published",
    forecast_agents: 20,
    scheduled_agents: 15,
    gap_agents: 5,
    coverage_rate: 0.75,
    updated_at: "2026-05-11T09:00:00+08:00",
  },
  {
    id: "plan-suzhou-draft",
    plan_date: "2026-05-12",
    project_name: "博西客服",
    site_name: "苏州职场",
    version: "v2",
    status: "draft",
    forecast_agents: 18,
    scheduled_agents: 15,
    gap_agents: 3,
    coverage_rate: 0.833,
    updated_at: "2026-05-12T09:00:00+08:00",
  },
];

const risks = [
  {
    risk_id: "risk-shanghai-open",
    plan_id: "plan-shanghai-published",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "09:00",
    interval_end: "09:30",
    risk_level: "high",
    gap_agents: 4,
    affected_unavailability: 1,
    reason: "缺口较高",
    recommendation: "复核",
    risk_status: "open",
  },
  {
    risk_id: "risk-suzhou-open",
    plan_id: "plan-suzhou-draft",
    plan_date: "2026-05-12",
    project_name: "博西客服",
    site_name: "苏州职场",
    interval_start: "11:00",
    interval_end: "11:30",
    risk_level: "high",
    gap_agents: 3,
    affected_unavailability: 0,
    reason: "草稿缺口",
    recommendation: "复核",
    risk_status: "open",
  },
];

const unavailability = [
  {
    unavailability_id: "unavail-active-shanghai",
    staff_name: "张敏",
    team_name: "一线客服 A 组",
    project_name: "博西客服",
    site_name: "上海职场",
    unavailable_date: "2026-05-11",
    start_time: "09:30",
    end_time: "10:30",
    reason: "临时请假",
    status: "active",
    affected_intervals: 2,
    note: "需补时段",
  },
  {
    unavailability_id: "unavail-resolved-suzhou",
    staff_name: "李想",
    team_name: "一线客服 B 组",
    project_name: "博西客服",
    site_name: "苏州职场",
    unavailable_date: "2026-05-12",
    start_time: "12:00",
    end_time: "13:00",
    reason: "培训占用",
    status: "resolved",
    affected_intervals: 2,
    note: "已处理",
  },
];

function buildModel(filters = {}) {
  return buildDashboardOperationalViewModel({
    plans,
    risks,
    unavailability,
    plansSource: baseSource,
    risksSource: baseSource,
    unavailabilitySource: baseSource,
    filters,
  });
}

test("dashboard page reads URL params through parseDashboardFilters", () => {
  assert.match(dashboardPageSrc, /searchParams/);
  assert.match(dashboardPageSrc, /parseDashboardFilters/);
});

test("parseDashboardFilters only accepts global dashboard dimensions", () => {
  assert.deepEqual(
    parseDashboardFilters({
      query: "上海",
      site: "  上海职场  ",
      project: "博西客服",
      planStatus: "published",
      riskLevel: "high",
      issueStatus: "待复核",
    }),
    {
      site: "上海职场",
      project: "博西客服",
      planStatus: "published",
    }
  );
});

test("dashboard does not render a filter console above the KPI cards", () => {
  assert.doesNotMatch(dashboardPageSrc, /GlobalFilterBar/);
  assert.doesNotMatch(dashboardPageSrc, /总览口径/);
  assert.match(dashboardPageSrc, /当前总览范围/);
  assert.match(dashboardPageSrc, /SectionCards/);
});

test("DashboardOperationalFilters does not include table-level filters", () => {
  assert.doesNotMatch(dashboardLibSrc, /query\?:/);
  assert.doesNotMatch(dashboardLibSrc, /riskLevel\?:/);
  assert.doesNotMatch(dashboardLibSrc, /issueStatus\?:/);
});

test("site filter limits plans, risks, and unavailability consistently", () => {
  const model = buildModel({ site: "苏州职场" });

  assert.equal(model.metricCards[0].value, "1");
  assert.equal(model.metricCards[2].value, "1");
  assert.equal(model.heatmapRows.length, 1);
  assert.equal(
    model.anomalies.every((item) => item.team.includes("苏州")),
    true
  );
});

test("project filter keeps dashboard cards, heatmap, and anomaly table aligned", () => {
  const model = buildModel({ project: "博西客服" });

  assert.equal(model.metricCards[0].value, "2");
  assert.equal(model.metricCards[2].value, "2");
  assert.equal(model.heatmapRows.length, 2);
  assert.equal(model.anomalies.length, 5);
});

test("planStatus filter applies to plan data and plan-linked risks", () => {
  const published = buildModel({ planStatus: "published" });
  const draft = buildModel({ planStatus: "draft" });

  assert.equal(published.metricCards[0].value, "1");
  assert.equal(published.metricCards[2].value, "1");
  assert.equal(published.anomalies.some((item) => item.team === "苏州职场"), false);
  assert.equal(draft.metricCards[0].value, "1");
  assert.equal(draft.metricCards[2].value, "1");
  assert.equal(draft.anomalies.some((item) => item.team === "上海职场"), false);
});

test("filtered empty state is distinguishable from source empty state", () => {
  const model = buildModel({ site: "不存在职场" });

  assert.equal(model.readiness.hasData, true);
  assert.equal(model.readiness.hasFilteredData, false);
  assert.equal(model.readiness.isFilteredEmpty, true);
  assert.match(model.readiness.message, /当前筛选条件下暂无数据/);
});

test("dashboard page passes one filtered model to cards, heatmap, and table", () => {
  assert.match(dashboardPageSrc, /viewModel\.metricCards/);
  assert.match(dashboardPageSrc, /viewModel\.heatmapRows/);
  assert.match(dashboardPageSrc, /viewModel\.anomalies/);
});

test("trend chart has explicit static boundary and no auto-capability wording", () => {
  assert.match(chartAreaInteractiveSrc, /本地样本|示例数据|暂未接入/);
  assert.doesNotMatch(
    chartAreaInteractiveSrc,
    /real-time|实时|自动预测|自动排班|自动修复/
  );
});

const forbiddenTerms = [
  "Gate",
  "Harness",
  "Codex",
  "Qoder",
  "mock",
  "real-time",
  "production ready",
  "自动排班",
  "自动修复",
  "审批",
  "导出",
  "批量",
  "结算",
  "收费",
];

test("touched dashboard product files do not expose forbidden terminology", () => {
  for (const src of [
    dashboardPageSrc,
    dashboardLibSrc,
    chartAreaInteractiveSrc,
  ]) {
    for (const term of forbiddenTerms) {
      assert.doesNotMatch(src, new RegExp(`\\b${term}\\b`, "i"));
    }
  }
});
