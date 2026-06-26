import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  buildDashboardAnomalies,
  buildDashboardHeatmap,
  buildDashboardMetricCards,
  buildDashboardViewModel,
} from "../../lib/dashboard.ts";

// ── Fixtures ──

const planA = {
  id: "plan-a",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "上海职场",
  version: "v1",
  status: "published",
  forecast_agents: 100,
  scheduled_agents: 90,
  gap_agents: 10,
  coverage_rate: 0.9,
  updated_at: "2026-05-11T09:30:00+08:00",
};

const planB = {
  id: "plan-b",
  plan_date: "2026-05-12",
  project_name: "博西客服",
  site_name: "苏州职场",
  version: "v1",
  status: "draft",
  forecast_agents: 50,
  scheduled_agents: 50,
  gap_agents: 0,
  coverage_rate: 1,
  updated_at: "2026-05-12T08:00:00+08:00",
};

const planC = {
  id: "plan-c",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "苏州职场",
  version: "v1",
  status: "review_ready",
  forecast_agents: 40,
  scheduled_agents: 35,
  gap_agents: 5,
  coverage_rate: 0.875,
  updated_at: "2026-05-11T10:00:00+08:00",
};

const riskOpenHigh = {
  risk_id: "risk-open-high-1",
  plan_id: "plan-a",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "上海职场",
  interval_start: "10:00",
  interval_end: "10:30",
  risk_level: "high",
  gap_agents: 3,
  affected_unavailability: 1,
  reason: "缺口 3 人",
  recommendation: "复核",
  risk_status: "open",
};

const riskOpenMedium = {
  risk_id: "risk-open-medium-1",
  plan_id: "plan-a",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "上海职场",
  interval_start: "11:00",
  interval_end: "11:30",
  risk_level: "medium",
  gap_agents: 1,
  affected_unavailability: 0,
  reason: "轻微缺口",
  recommendation: "关注",
  risk_status: "open",
};

const riskConfirmed = {
  risk_id: "risk-confirmed-1",
  plan_id: "plan-a",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "上海职场",
  interval_start: "09:00",
  interval_end: "09:30",
  risk_level: "high",
  gap_agents: 2,
  affected_unavailability: 0,
  reason: "已确认缺口",
  recommendation: "复核",
  risk_status: "confirmed",
};

const riskResolved = {
  risk_id: "risk-resolved-1",
  plan_id: "plan-a",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "上海职场",
  interval_start: "14:00",
  interval_end: "14:30",
  risk_level: "high",
  gap_agents: 4,
  affected_unavailability: 0,
  reason: "已处理",
  recommendation: "无需操作",
  risk_status: "resolved",
};

const unavailActive = {
  unavailability_id: "unavail-active-1",
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
};

const unavailResolved = {
  unavailability_id: "unavail-resolved-1",
  staff_name: "王宁",
  team_name: "外包夜班组",
  project_name: "博西客服",
  site_name: "上海职场",
  unavailable_date: "2026-05-12",
  start_time: "12:00",
  end_time: "13:00",
  reason: "不可用申请",
  status: "resolved",
  affected_intervals: 2,
  note: "已调整",
};

const allPlans = [planA, planB, planC];
const allRisks = [riskOpenHigh, riskOpenMedium, riskConfirmed, riskResolved];
const allUnavailability = [unavailActive, unavailResolved];

// ── 1. Schedule plan summary -> metric cards ──

test("metric cards include total plans, coverage rate, open risks, active unavailability", () => {
  const cards = buildDashboardMetricCards(allPlans, allRisks, allUnavailability);

  assert.equal(cards.length, 4);

  assert.equal(cards[0].title, "排班计划总数");
  assert.equal(cards[0].value, "3");

  assert.equal(cards[1].title, "平均覆盖率");
  // (90 + 50 + 35) / (100 + 50 + 40) = 175 / 190 ≈ 0.921 → 92%
  assert.equal(cards[1].value, "92%");

  assert.equal(cards[2].title, "待处理风险");
  // open risks: riskOpenHigh + riskOpenMedium = 2
  assert.equal(cards[2].value, "2");

  assert.equal(cards[3].title, "生效不可用");
  // active unavailability: unavailActive = 1
  assert.equal(cards[3].value, "1");
});

// ── 2. Risk status open/confirmed/resolved -> dashboard counts ──

test("metric cards only count open risks, not confirmed or resolved", () => {
  const cards = buildDashboardMetricCards(allPlans, allRisks, allUnavailability);
  const riskCard = cards.find((c) => c.title === "待处理风险");

  assert.notEqual(riskCard, undefined);
  assert.equal(riskCard?.value, "2");
});

test("metric cards handle all confirmed risks", () => {
  const cards = buildDashboardMetricCards([], [riskConfirmed], []);
  const riskCard = cards.find((c) => c.title === "待处理风险");
  assert.equal(riskCard?.value, "0");
});

test("metric cards handle all resolved risks", () => {
  const cards = buildDashboardMetricCards([], [riskResolved], []);
  const riskCard = cards.find((c) => c.title === "待处理风险");
  assert.equal(riskCard?.value, "0");
});

// ── 3. Active/resolved unavailability -> dashboard counts ──

test("metric cards only count active unavailability", () => {
  const cards = buildDashboardMetricCards(allPlans, allRisks, allUnavailability);
  const unavailCard = cards.find((c) => c.title === "生效不可用");
  assert.equal(unavailCard?.value, "1");
});

test("metric cards handle only resolved unavailability", () => {
  const cards = buildDashboardMetricCards([], [], [unavailResolved]);
  const unavailCard = cards.find((c) => c.title === "生效不可用");
  assert.equal(unavailCard?.value, "0");
});

// ── 4. High-risk/open risk generates navigable anomaly ──

test("high-risk open schedule risk generates anomaly with schedule_risk downstreamEntry", () => {
  const anomalies = buildDashboardAnomalies([], [riskOpenHigh], []);

  assert.equal(anomalies.length, 1);
  assert.equal(anomalies[0].type, "排班风险");
  assert.equal(anomalies[0].severity, "高");
  assert.equal(anomalies[0].status, "待复核");
  assert.notEqual(anomalies[0].downstreamEntry, undefined);
  assert.equal(anomalies[0].downstreamEntry?.type, "schedule_risk");
  assert.equal(anomalies[0].downstreamEntry?.id, "risk-open-high-1");
});

test("medium-risk open risk does not generate high-risk anomaly", () => {
  const anomalies = buildDashboardAnomalies([], [riskOpenMedium], []);
  assert.equal(anomalies.length, 0);
});

test("confirmed high risk does not generate anomaly", () => {
  const anomalies = buildDashboardAnomalies([], [riskConfirmed], []);
  assert.equal(anomalies.length, 0);
});

test("resolved high risk does not generate anomaly", () => {
  const anomalies = buildDashboardAnomalies([], [riskResolved], []);
  assert.equal(anomalies.length, 0);
});

// ── 5. Active unavailability generates navigable anomaly ──

test("active unavailability generates anomaly with unavailability downstreamEntry", () => {
  const anomalies = buildDashboardAnomalies([], [], [unavailActive]);

  assert.equal(anomalies.length, 1);
  assert.equal(anomalies[0].type, "不可用记录");
  assert.equal(anomalies[0].severity, "中");
  assert.equal(anomalies[0].status, "待复核");
  assert.notEqual(anomalies[0].downstreamEntry, undefined);
  assert.equal(anomalies[0].downstreamEntry?.type, "unavailability");
  assert.equal(anomalies[0].downstreamEntry?.id, "unavail-active-1");
});

test("resolved unavailability does not generate anomaly", () => {
  const anomalies = buildDashboardAnomalies([], [], [unavailResolved]);
  assert.equal(anomalies.length, 0);
});

test("plan with significant gap generates anomaly with schedule_plan downstreamEntry", () => {
  const anomalies = buildDashboardAnomalies([planA], [], []);

  assert.equal(anomalies.length, 1);
  assert.equal(anomalies[0].type, "排班缺口");
  assert.notEqual(anomalies[0].downstreamEntry, undefined);
  assert.equal(anomalies[0].downstreamEntry?.type, "schedule_plan");
  assert.equal(anomalies[0].downstreamEntry?.id, "plan-a");
});

test("plan with small gap (<=2) does not generate anomaly", () => {
  const smallGapPlan = { ...planA, gap_agents: 2 };
  const anomalies = buildDashboardAnomalies([smallGapPlan], [], []);
  assert.equal(anomalies.length, 0);
});

// ── 6. Empty data returns stable empty state ──

test("empty data returns stable empty metric cards", () => {
  const cards = buildDashboardMetricCards([], [], []);

  assert.equal(cards.length, 4);
  assert.equal(cards[0].value, "0");
  assert.equal(cards[1].value, "0%");
  assert.equal(cards[2].value, "0");
  assert.equal(cards[3].value, "0");
});

test("empty data returns stable empty heatmap", () => {
  const { rows, slots } = buildDashboardHeatmap([]);
  assert.deepEqual(rows, []);
  assert.deepEqual(slots, []);
});

test("empty data returns stable empty anomalies", () => {
  const anomalies = buildDashboardAnomalies([], [], []);
  assert.deepEqual(anomalies, []);
});

test("empty data returns stable empty view model", () => {
  const model = buildDashboardViewModel([], [], []);

  assert.equal(model.metricCards.length, 4);
  assert.deepEqual(model.heatmapRows, []);
  assert.deepEqual(model.heatmapSlots, []);
  assert.deepEqual(model.anomalies, []);
});

// ── Heatmap with data ──

test("heatmap groups plans by date and shows gap as negative values", () => {
  const { rows, slots } = buildDashboardHeatmap(allPlans);

  assert.equal(slots.length, 1);
  assert.equal(slots[0], "全天");
  assert.equal(rows.length, 2); // 2 unique dates: 2026-05-11 and 2026-05-12

  // 2026-05-11: planA (gap 10) + planC (gap 5) = 15 → slot = -15
  const may11Row = rows.find((r) => r.day === "05-11");
  assert.notEqual(may11Row, undefined);
  assert.equal(may11Row?.slots[0], -15);

  // 2026-05-12: planB (gap 0) = 0 → slot = 0 (may be -0 due to negation)
  const may12Row = rows.find((r) => r.day === "05-12");
  assert.notEqual(may12Row, undefined);
  assert.equal(Math.abs(may12Row?.slots[0] ?? 0), 0);
});

// ── 7. Forbidden terminology ──

test("dashboard view model does not expose internal terminology", () => {
  const libPath = join(process.cwd(), "lib/dashboard.ts");
  const libContent = readFileSync(libPath, "utf-8");

  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM250"];

  for (const term of forbiddenTerms) {
    assert.equal(
      libContent.includes(term),
      false,
      `Dashboard model contains forbidden term: ${term}`
    );
  }
});

test("dashboard view model does not use auto-fix language", () => {
  const libPath = join(process.cwd(), "lib/dashboard.ts");
  const libContent = readFileSync(libPath, "utf-8");

  const forbiddenPhrases = ["自动修复", "自动重排", "缺口已消除"];

  for (const phrase of forbiddenPhrases) {
    assert.equal(
      libContent.includes(phrase),
      false,
      `Dashboard model contains forbidden phrase: ${phrase}`
    );
  }
});

// ── Combined anomaly ordering ──

test("combined anomalies include risks, unavailability, and plans in correct order", () => {
  const anomalies = buildDashboardAnomalies([planA], [riskOpenHigh], [unavailActive]);

  // Order: risks first, then unavailability, then plans
  assert.equal(anomalies.length, 3);
  assert.equal(anomalies[0].type, "排班风险");
  assert.equal(anomalies[1].type, "不可用记录");
  assert.equal(anomalies[2].type, "排班缺口");
});

test("buildDashboardViewModel integrates all sub-models", () => {
  const model = buildDashboardViewModel(allPlans, allRisks, allUnavailability);

  assert.equal(model.metricCards.length, 4);
  assert.equal(model.heatmapRows.length, 2);
  assert.equal(model.heatmapSlots.length, 1);

  // Anomalies: 1 high-risk open + 1 active unavail + 2 plans with gap > 2 (planA gap=10, planC gap=5)
  assert.equal(model.anomalies.length, 4);
});
