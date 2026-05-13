import assert from "node:assert/strict";
import test from "node:test";

import {
  clampDashboardPageIndex,
  dashboardAnomalyMatchesQuery,
  filterDashboardAnomalies,
  filterSchedulePlanRows,
  filterScheduleRiskRows,
  filterSyncStatusRows,
  filterUnavailabilityRows,
  getDashboardPaginationRange,
  summarizeHeatmapRows,
  summarizeSchedulePlanRows,
  summarizeScheduleRiskRows,
  summarizeSyncStatusRows,
  summarizeUnavailabilityRows,
} from "../../components/data-table-model.ts";
import {
  filterScheduleRiskRowsByScope,
  scheduleRiskLevelLabel,
} from "../../lib/schedule-plans.ts";

const anomaly = {
  id: "ANM-202605-001",
  type: "实际有效在线不足",
  project: "Bosch CC",
  team: "华东一组",
  shiftTime: "05-11 12:00-14:00",
  headcount: 6,
  impactedHours: "18.0h",
  severity: "高",
  status: "待复核",
};

test("dashboard anomaly search matches all visible table fields", () => {
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "bosch"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "华东"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "待复核"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "12:00"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "missing"), false);
});

test("dashboard page index is clamped after filter or page-size changes", () => {
  assert.equal(clampDashboardPageIndex({ pageIndex: 3, pageSize: 5, rowCount: 6 }), 1);
  assert.equal(clampDashboardPageIndex({ pageIndex: -2, pageSize: 5, rowCount: 6 }), 0);
  assert.equal(clampDashboardPageIndex({ pageIndex: 4, pageSize: 10, rowCount: 0 }), 0);
});

test("dashboard anomaly filters combine query, severity, and status", () => {
  const rows = [
    anomaly,
    { ...anomaly, id: "ANM-2", severity: "中", status: "已确认", team: "华南二组" },
    { ...anomaly, id: "ANM-3", severity: "低", status: "已忽略", team: "西区支援组" },
  ];

  assert.deepEqual(
    filterDashboardAnomalies(rows, { query: "华", severity: "中", status: "已确认" }).map((row) => row.id),
    ["ANM-2"],
  );
  assert.deepEqual(
    filterDashboardAnomalies(rows, { query: "", severity: "all", status: "待复核" }).map((row) => row.id),
    ["ANM-202605-001"],
  );
});

test("dashboard pagination range reports visible row bounds", () => {
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 0, pageSize: 5, rowCount: 12 }), {
    from: 1,
    to: 5,
  });
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 2, pageSize: 5, rowCount: 12 }), {
    from: 11,
    to: 12,
  });
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 0, pageSize: 5, rowCount: 0 }), {
    from: 0,
    to: 0,
  });
});

test("sync status helpers filter rows and summarize state counts", () => {
  const rows = [
    { source: "CORN 登录数据", batch: "A", status: "已同步", syncedAt: "今日 08:36" },
    { source: "CORN 状态日志", batch: "B", status: "处理中", syncedAt: "今日 09:04" },
    { source: "预测需求数据", batch: "C", status: "需关注", syncedAt: "昨日 18:42" },
  ];

  assert.deepEqual(filterSyncStatusRows(rows, "需关注").map((row) => row.source), ["预测需求数据"]);
  assert.deepEqual(summarizeSyncStatusRows(rows), {
    total: 3,
    synced: 1,
    processing: 1,
    attention: 1,
  });
});

test("heatmap summary reports total deficit, severe slots, and peak shortage", () => {
  const summary = summarizeHeatmapRows([
    { day: "周一", slots: [-1, -6, 0] },
    { day: "周二", slots: [-3, -8, 1] },
  ], ["09:00", "10:00", "11:00"]);

  assert.deepEqual(summary, {
    totalDeficit: 18,
    severeSlotCount: 2,
    normalSlotCount: 2,
    peak: {
      day: "周二",
      slot: "10:00",
      value: -8,
    },
  });
});

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

test("schedule risk helpers filter rows and summarize risk exposure", () => {
  const rows = [
    {
      risk_id: "risk-a",
      plan_id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      interval_start: "09:30",
      interval_end: "10:00",
      risk_level: "high",
      gap_agents: 2,
      affected_unavailability: 1,
      reason: "缺口 2 人",
      recommendation: "优先复核",
    },
    {
      risk_id: "risk-b",
      plan_id: "plan-b",
      plan_date: "2026-05-12",
      project_name: "博西客服",
      site_name: "苏州职场",
      interval_start: "10:00",
      interval_end: "10:30",
      risk_level: "medium",
      gap_agents: 1,
      affected_unavailability: 0,
      reason: "排班缺口",
      recommendation: "检查草稿",
    },
  ];

  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "上海", level: "high" }).map((row) => row.risk_id),
    ["risk-a"],
  );
  assert.deepEqual(summarizeScheduleRiskRows(rows), {
    total: 2,
    high: 1,
    medium: 1,
    low: 0,
    totalGap: 3,
    affectedUnavailability: 1,
  });
});

test("schedule risk scope filters preserve upstream drilldown context", () => {
  const rows = [
    {
      risk_id: "risk-a",
      plan_id: "plan-a",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      interval_start: "09:30",
      interval_end: "10:00",
      risk_level: "high",
      gap_agents: 2,
      affected_unavailability: 1,
      reason: "缺口 2 人",
      recommendation: "优先复核",
    },
    {
      risk_id: "risk-b",
      plan_id: "plan-b",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "苏州职场",
      interval_start: "09:30",
      interval_end: "10:00",
      risk_level: "medium",
      gap_agents: 1,
      affected_unavailability: 0,
      reason: "排班缺口",
      recommendation: "检查草稿",
    },
  ];

  assert.equal(scheduleRiskLevelLabel("high"), "高风险");
  assert.deepEqual(
    filterScheduleRiskRowsByScope(rows, {
      planId: "plan-a",
      planDate: "2026-05-11",
      siteName: "上海职场",
      query: "优先",
    }).map((row) => row.risk_id),
    ["risk-a"],
  );
});

test("unavailability helpers filter rows and summarize active impact", () => {
  const rows = [
    {
      unavailability_id: "unavail-a",
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
      note: "需补班",
    },
    {
      unavailability_id: "unavail-b",
      staff_name: "王宁",
      team_name: "外包夜班组",
      project_name: "博西客服",
      site_name: "苏州职场",
      unavailable_date: "2026-05-12",
      start_time: "12:00",
      end_time: "13:00",
      reason: "不可用申请",
      status: "resolved",
      affected_intervals: 2,
      note: "已调整",
    },
  ];

  assert.deepEqual(
    filterUnavailabilityRows(rows, { query: "张敏", status: "active" }).map((row) => row.unavailability_id),
    ["unavail-a"],
  );
  assert.deepEqual(summarizeUnavailabilityRows(rows), {
    total: 2,
    active: 1,
    resolved: 1,
    affectedIntervals: 4,
    teamCount: 2,
    siteCount: 2,
  });
});
