import assert from "node:assert/strict";
import test from "node:test";


import {
  filterScheduleRiskRows,
  filterUnavailabilityRows,
  summarizeScheduleRiskRows,
  summarizeUnavailabilityRows,
} from "../../components/data-table-model.ts";

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
    open: 0,
    confirmed: 0,
    resolved: 2,
    totalGap: 3,
    affectedUnavailability: 1,
  });
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
