import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  getScheduleRiskResult,
  getShiftDetailsResult,
} from "../../lib/schedule-plans.ts";
import {
  getUnavailabilityRecordResult,
} from "../../lib/unavailability.ts";

// ── Shared mock helper ──

async function withMockedFetch(mockFetch, callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;

  try {
    return await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// ── Fixtures ──

const shiftDetailRow = {
  id: "shift-1",
  plan_id: "plan-20260511-shanghai-bosch-v1",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "上海职场",
  interval_start: "09:00",
  interval_end: "09:30",
  forecast_agents: 10,
  scheduled_agents: 8,
  gap_agents: 2,
  status: "published",
  note: "缺口 2 人",
};

const riskRow = {
  risk_id: "risk-test-1",
  plan_id: "plan-20260511-shanghai-bosch-v1",
  plan_date: "2026-05-11",
  project_name: "博西客服",
  site_name: "上海职场",
  interval_start: "09:00",
  interval_end: "09:30",
  risk_level: "high",
  gap_agents: 3,
  affected_unavailability: 1,
  reason: "缺口 3 人",
  recommendation: "复核",
  risk_status: "open",
};

const unavailRow = {
  unavailability_id: "unavail-test-1",
  staff_name: "张敏",
  team_name: "一线客服 A 组",
  project_name: "博西客服",
  site_name: "上海职场",
  unavailable_date: "2026-05-11",
  start_time: "09:00",
  end_time: "10:00",
  reason: "临时请假",
  status: "active",
  affected_intervals: 2,
  note: "需补 2 个 0.5h 时段",
};

// ── getShiftDetailsResult ──

test("getShiftDetailsResult returns api source with data", async () => {
  await withMockedFetch(async () => ({
    ok: true,
    json: async () => ({ items: [shiftDetailRow] }),
  }), async () => {
    const result = await getShiftDetailsResult();
    assert.equal(result.source, "api");
    assert.equal(result.failed, false);
    assert.equal(result.items.length, 1);
    assert.ok(result.message.includes("后端 API"));
  });
});

test("getShiftDetailsResult returns fallback when API fails", async () => {
  await withMockedFetch(async () => ({
    ok: false,
    status: 500,
    json: async () => ({}),
  }), async () => {
    const result = await getShiftDetailsResult();
    assert.equal(result.source, "fallback");
    assert.equal(result.failed, true);
    assert.ok(result.items.length > 0);
    assert.ok(result.message.includes("示例数据") || result.message.includes("API 请求失败"));
  });
});

test("getShiftDetailsResult returns api_empty when API returns empty", async () => {
  await withMockedFetch(async () => ({
    ok: true,
    json: async () => ({ items: [] }),
  }), async () => {
    const result = await getShiftDetailsResult();
    assert.equal(result.source, "api_empty");
    assert.equal(result.failed, false);
    assert.equal(result.items.length, 0);
  });
});

// ── getScheduleRiskResult ──

test("getScheduleRiskResult returns api source when risk found", async () => {
  await withMockedFetch(async () => ({
    ok: true,
    json: async () => ({ items: [riskRow] }),
  }), async () => {
    const result = await getScheduleRiskResult("risk-test-1");
    assert.equal(result.source, "api");
    assert.equal(result.failed, false);
    assert.ok(result.item);
    assert.equal(result.item.risk_id, "risk-test-1");
  });
});

test("getScheduleRiskResult returns missing when API returns data but risk not found", async () => {
  await withMockedFetch(async () => ({
    ok: true,
    json: async () => ({ items: [] }),
  }), async () => {
    const result = await getScheduleRiskResult("nonexistent");
    assert.equal(result.source, "missing");
    assert.equal(result.failed, false);
    assert.equal(result.item, null);
    assert.ok(result.message.includes("未找到"));
  });
});

test("getScheduleRiskResult returns fallback when API fails and risk in fallback", async () => {
  await withMockedFetch(async () => ({
    ok: false,
    status: 500,
    json: async () => ({}),
  }), async () => {
    const result = await getScheduleRiskResult("risk-plan-20260511-shanghai-bosch-v1-09:30");
    assert.equal(result.source, "fallback");
    assert.equal(result.failed, true);
    assert.ok(result.item);
  });
});

test("getScheduleRiskResult returns fallback with null item when API fails and risk not in fallback", async () => {
  await withMockedFetch(async () => ({
    ok: false,
    status: 500,
    json: async () => ({}),
  }), async () => {
    const result = await getScheduleRiskResult("nonexistent-risk");
    assert.equal(result.source, "fallback");
    assert.equal(result.failed, true);
    assert.equal(result.item, null);
  });
});

// ── getUnavailabilityRecordResult ──

test("getUnavailabilityRecordResult returns api source when record found", async () => {
  await withMockedFetch(async () => ({
    ok: true,
    json: async () => ({ items: [unavailRow] }),
  }), async () => {
    const result = await getUnavailabilityRecordResult("unavail-test-1");
    assert.equal(result.source, "api");
    assert.equal(result.failed, false);
    assert.ok(result.item);
    assert.equal(result.item.unavailability_id, "unavail-test-1");
  });
});

test("getUnavailabilityRecordResult returns missing when record not found", async () => {
  await withMockedFetch(async () => ({
    ok: true,
    json: async () => ({ items: [] }),
  }), async () => {
    const result = await getUnavailabilityRecordResult("nonexistent");
    assert.equal(result.source, "missing");
    assert.equal(result.failed, false);
    assert.equal(result.item, null);
    assert.ok(result.message.includes("未找到"));
  });
});

test("getUnavailabilityRecordResult returns fallback when API fails and record in fallback", async () => {
  await withMockedFetch(async () => ({
    ok: false,
    status: 500,
    json: async () => ({}),
  }), async () => {
    const result = await getUnavailabilityRecordResult("unavail-20260511-001");
    assert.equal(result.source, "fallback");
    assert.equal(result.failed, true);
    assert.ok(result.item);
  });
});

test("getUnavailabilityResult distinguishes filtered empty from source empty", async () => {
  const { getUnavailabilityResult } = await import("../../lib/unavailability.ts");

  await withMockedFetch(async () => ({
    ok: true,
    json: async () => ({ items: [] }),
  }), async () => {
    const filtered = await getUnavailabilityResult({ query: "no-match" });
    assert.equal(filtered.source, "api_empty");
    assert.ok(filtered.message.includes("当前筛选没有匹配"));

    const unfiltered = await getUnavailabilityResult();
    assert.equal(unfiltered.source, "api_empty");
    assert.ok(unfiltered.message.includes("当前暂无不可用记录"));
  });
});

// ── Page source consistency checks ──

test("all four operational pages import ReadinessBanner", () => {
  const pages = [
    "app/schedule-risks/[riskId]/page.tsx",
    "app/unavailability/page.tsx",
    "app/unavailability/[unavailabilityId]/page.tsx",
    "app/shift-details/page.tsx",
  ];

  const rootDir = join(import.meta.dirname, "..", "..");

  for (const page of pages) {
    const content = readFileSync(join(rootDir, page), "utf-8");
    assert.ok(
      content.includes("ReadinessBanner"),
      `${page} must import and render ReadinessBanner`
    );
    assert.ok(
      content.includes("<ReadinessBanner"),
      `${page} must render <ReadinessBanner /> JSX element`
    );
  }
});

test("list pages use result-style readers instead of plain fetchers", () => {
  const rootDir = join(import.meta.dirname, "..", "..");

  const unavailabilityPage = readFileSync(
    join(rootDir, "app/unavailability/page.tsx"),
    "utf-8"
  );
  assert.ok(
    unavailabilityPage.includes("getUnavailabilityResult"),
    "/unavailability must use getUnavailabilityResult"
  );
  assert.ok(
    !unavailabilityPage.match(/\bawait\s+getUnavailability\s*\(/),
    "/unavailability must not call plain getUnavailability()"
  );

  const shiftDetailsPage = readFileSync(
    join(rootDir, "app/shift-details/page.tsx"),
    "utf-8"
  );
  assert.ok(
    shiftDetailsPage.includes("getShiftDetailsResult"),
    "/shift-details must use getShiftDetailsResult"
  );
  assert.ok(
    !shiftDetailsPage.match(/\bawait\s+getShiftDetails\s*\(/),
    "/shift-details must not call plain getShiftDetails()"
  );
});

test("list pages pass source-aware empty messages to tables", () => {
  const rootDir = join(import.meta.dirname, "..", "..");

  const unavailabilityPage = readFileSync(
    join(rootDir, "app/unavailability/page.tsx"),
    "utf-8"
  );
  assert.ok(
    unavailabilityPage.includes("暂无不可用记录"),
    "/unavailability must expose source-empty wording"
  );
  assert.ok(
    unavailabilityPage.includes("暂无符合条件的不可用记录"),
    "/unavailability must expose filtered-empty wording"
  );

  const shiftDetailsPage = readFileSync(
    join(rootDir, "app/shift-details/page.tsx"),
    "utf-8"
  );
  assert.ok(
    shiftDetailsPage.includes("暂无班次明细数据"),
    "/shift-details must expose source-empty wording"
  );
  assert.ok(
    shiftDetailsPage.includes("暂无符合条件的班次明细"),
    "/shift-details must expose filtered-empty wording"
  );
});

test("detail pages use result-style readers and map source correctly", () => {
  const rootDir = join(import.meta.dirname, "..", "..");

  const riskDetailPage = readFileSync(
    join(rootDir, "app/schedule-risks/[riskId]/page.tsx"),
    "utf-8"
  );
  assert.ok(
    riskDetailPage.includes("getScheduleRiskResult"),
    "/schedule-risks/[riskId] must use getScheduleRiskResult"
  );
  assert.ok(
    !riskDetailPage.includes("getScheduleRisk("),
    "/schedule-risks/[riskId] must not call plain getScheduleRisk()"
  );

  const unavailabilityDetailPage = readFileSync(
    join(rootDir, "app/unavailability/[unavailabilityId]/page.tsx"),
    "utf-8"
  );
  assert.ok(
    unavailabilityDetailPage.includes("getUnavailabilityRecordResult"),
    "/unavailability/[id] must use getUnavailabilityRecordResult"
  );
  assert.ok(
    !unavailabilityDetailPage.includes("getUnavailabilityRecord("),
    "/unavailability/[id] must not call plain getUnavailabilityRecord()"
  );
  assert.ok(
    unavailabilityDetailPage.includes('result.source === "missing" ? "api_empty" : result.source'),
    "/unavailability/[id] must explicitly map missing source for ReadinessBanner"
  );
});

test("detail pages preserve notFound behavior for missing records", () => {
  const rootDir = join(import.meta.dirname, "..", "..");

  const riskDetailPage = readFileSync(
    join(rootDir, "app/schedule-risks/[riskId]/page.tsx"),
    "utf-8"
  );
  assert.ok(
    riskDetailPage.includes("notFound()"),
    "/schedule-risks/[riskId] must call notFound() when record is missing"
  );

  const unavailabilityDetailPage = readFileSync(
    join(rootDir, "app/unavailability/[unavailabilityId]/page.tsx"),
    "utf-8"
  );
  assert.ok(
    unavailabilityDetailPage.includes("notFound()"),
    "/unavailability/[id] must call notFound() when record is missing"
  );
});

test("no operational page uses forbidden auto-fix or production-realtime wording", () => {
  const rootDir = join(import.meta.dirname, "..", "..");
  const forbidden = [
    "自动修复",
    "自动排班",
    "auto-fix",
    "auto-reschedule",
    "实时数据",
    "real-time data",
    "Gate",
    "PM",
    "Harness",
    "Codex",
    "Qoder",
  ];

  const pages = [
    "app/schedule-risks/[riskId]/page.tsx",
    "app/unavailability/page.tsx",
    "app/unavailability/[unavailabilityId]/page.tsx",
    "app/shift-details/page.tsx",
  ];

  for (const page of pages) {
    const content = readFileSync(join(rootDir, page), "utf-8");
    for (const word of forbidden) {
      assert.ok(
        !content.includes(word),
        `${page} must not contain forbidden wording: ${word}`
      );
    }
  }
});
