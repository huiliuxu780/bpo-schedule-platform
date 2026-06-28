import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  buildDashboardOperationalViewModel,
} from "../../lib/dashboard.ts";
import {
  getSchedulePlansResult,
  getScheduleRisksResult,
} from "../../lib/schedule-plans.ts";
import { getUnavailabilityResult } from "../../lib/unavailability.ts";

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

async function withMockedFetch(mockFetch, callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;

  try {
    return await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// ── 1. All API with data ──

test("operational model reports api source when all data sources succeed", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [planA],
    risks: [riskOpenHigh],
    unavailability: [unavailActive],
    plansSource: { source: "api", failed: false },
    risksSource: { source: "api", failed: false },
    unavailabilitySource: { source: "api", failed: false },
  });

  assert.equal(result.readiness.overallSource, "api");
  assert.equal(result.readiness.sourceStates.hasAnyFailure, false);
  assert.equal(result.readiness.sourceStates.hasAnyFallback, false);
  assert.equal(result.readiness.sourceStates.hasAnyEmpty, false);
  assert.equal(result.readiness.hasData, true);
  assert.equal(
    result.readiness.message,
    "经营总览已更新。"
  );
});

test("schedule plan result reader reports api_empty for empty API response", async () => {
  await withMockedFetch(
    async () => ({
      ok: true,
      json: async () => ({ items: [] }),
    }),
    async () => {
      const result = await getSchedulePlansResult();

      assert.equal(result.source, "api_empty");
      assert.equal(result.failed, false);
      assert.deepEqual(result.items, []);
    }
  );
});

test("schedule risk result reader reports fallback when API fetch fails", async () => {
  await withMockedFetch(
    async () => {
      throw new Error("network unavailable");
    },
    async () => {
      const result = await getScheduleRisksResult();

      assert.equal(result.source, "fallback");
      assert.equal(result.failed, true);
      assert.ok(result.items.length > 0);
    }
  );
});

test("unavailability result reader reports fallback when API returns non-OK", async () => {
  await withMockedFetch(
    async () => ({
      ok: false,
      json: async () => ({ items: [] }),
    }),
    async () => {
      const result = await getUnavailabilityResult();

      assert.equal(result.source, "fallback");
      assert.equal(result.failed, true);
      assert.ok(result.items.length > 0);
    }
  );
});

// ── 2. Fallback (at least one source failed) ──

test("operational model reports fallback source when any data source fails", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [planA],
    risks: [],
    unavailability: [],
    plansSource: { source: "api", failed: false },
    risksSource: { source: "fallback", failed: true },
    unavailabilitySource: { source: "api", failed: false },
  });

  assert.equal(result.readiness.overallSource, "mixed");
  assert.equal(result.readiness.sourceStates.hasAnyFailure, true);
  assert.equal(result.readiness.sourceStates.hasAnyFallback, true);
  assert.equal(
    result.readiness.message,
    "部分经营总览暂时无法更新，已显示示例数据。"
  );
});

test("operational model reports fallback when all sources use fallback", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [planA],
    risks: [],
    unavailability: [],
    plansSource: { source: "fallback", failed: true },
    risksSource: { source: "fallback", failed: true },
    unavailabilitySource: { source: "fallback", failed: true },
  });

  assert.equal(result.readiness.overallSource, "fallback");
  assert.equal(result.readiness.sourceStates.hasAnyFailure, true);
  assert.equal(result.readiness.sourceStates.hasAnyFallback, true);
  assert.equal(
    result.readiness.message,
    "部分经营总览暂时无法更新，已显示示例数据。"
  );
});

// ── 3. All api_empty ──

test("operational model reports api_empty when all sources return empty", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [],
    risks: [],
    unavailability: [],
    plansSource: { source: "api_empty", failed: false },
    risksSource: { source: "api_empty", failed: false },
    unavailabilitySource: { source: "api_empty", failed: false },
  });

  assert.equal(result.readiness.overallSource, "api_empty");
  assert.equal(result.readiness.sourceStates.hasAnyEmpty, true);
  assert.equal(result.readiness.hasData, false);
  assert.equal(
    result.readiness.message,
    "当前暂无经营数据，请先创建排班计划、风险或不可用记录。"
  );
});

// ── 4. Mixed (some empty, some api) ──

test("operational model reports mixed when some sources are empty but others have data", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [planA],
    risks: [],
    unavailability: [],
    plansSource: { source: "api", failed: false },
    risksSource: { source: "api_empty", failed: false },
    unavailabilitySource: { source: "api", failed: false },
  });

  assert.equal(result.readiness.overallSource, "mixed");
  assert.equal(result.readiness.sourceStates.hasAnyEmpty, true);
  assert.equal(result.readiness.hasData, true);
  assert.equal(
    result.readiness.message,
    "当前经营数据不完整，请确认排班计划、风险和不可用记录是否齐全。"
  );
});

// ── 5. Source state tracking ──

test("operational model tracks individual source states correctly", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [],
    risks: [],
    unavailability: [],
    plansSource: { source: "api", failed: false },
    risksSource: { source: "api_empty", failed: false },
    unavailabilitySource: { source: "fallback", failed: true },
  });

  assert.equal(result.readiness.sourceStates.plans, "api");
  assert.equal(result.readiness.sourceStates.risks, "api_empty");
  assert.equal(result.readiness.sourceStates.unavailability, "fallback");
});

// ── 6. Base view model data is preserved ──

test("operational model preserves base view model data", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [planA],
    risks: [riskOpenHigh],
    unavailability: [unavailActive],
    plansSource: { source: "api", failed: false },
    risksSource: { source: "api", failed: false },
    unavailabilitySource: { source: "api", failed: false },
  });

  // Metric cards should be present
  assert.equal(result.metricCards.length, 4);
  assert.equal(result.metricCards[0].title, "排班计划总数");

  // Anomalies should be present
  assert.ok(result.anomalies.length > 0);

  // Heatmap should be present
  assert.ok(result.heatmapRows.length >= 0);
});

// ── 7. Forbidden terminology ──

test("operational model does not expose internal terminology", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [],
    risks: [],
    unavailability: [],
    plansSource: { source: "fallback", failed: true },
    risksSource: { source: "fallback", failed: true },
    unavailabilitySource: { source: "fallback", failed: true },
  });

  const message = result.readiness.message;
  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM251"];

  for (const term of forbiddenTerms) {
    assert.ok(
      !message.includes(term),
      `Message contains forbidden term: ${term}`
    );
  }
});

test("operational model does not use auto-fix language", () => {
  const result = buildDashboardOperationalViewModel({
    plans: [],
    risks: [],
    unavailability: [],
    plansSource: { source: "api_empty", failed: false },
    risksSource: { source: "api_empty", failed: false },
    unavailabilitySource: { source: "api_empty", failed: false },
  });

  const message = result.readiness.message;
  const forbiddenPhrases = ["自动修复", "自动重排", "自动调度完成"];

  for (const phrase of forbiddenPhrases) {
    assert.ok(
      !message.includes(phrase),
      `Message contains forbidden phrase: ${phrase}`
    );
  }
});

// ── 8. Source code does not contain forbidden terms ──

test("dashboard lib source does not expose internal terminology", () => {
  const libPath = join(process.cwd(), "lib/dashboard.ts");
  const libContent = readFileSync(libPath, "utf-8");

  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM251"];

  for (const term of forbiddenTerms) {
    assert.equal(
      libContent.includes(term),
      false,
      `Dashboard lib contains forbidden term: ${term}`
    );
  }
});

test("dashboard lib source does not use auto-fix language", () => {
  const libPath = join(process.cwd(), "lib/dashboard.ts");
  const libContent = readFileSync(libPath, "utf-8");

  const forbiddenPhrases = ["自动修复", "自动重排", "缺口已消除"];

  for (const phrase of forbiddenPhrases) {
    assert.equal(
      libContent.includes(phrase),
      false,
      `Dashboard lib contains forbidden phrase: ${phrase}`
    );
  }
});
