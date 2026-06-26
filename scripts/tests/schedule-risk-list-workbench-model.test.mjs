import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import {
  filterScheduleRiskRows,
  summarizeScheduleRiskRows,
} from "../../components/data-table-model.ts";

const rows = [
  {
    risk_id: "risk-plan-20260511-suzhou-bosch-v1-10:00",
    plan_id: "plan-20260511-suzhou-bosch-v1",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "苏州职场",
    interval_start: "10:00",
    interval_end: "10:30",
    risk_level: "high",
    risk_status: "open",
    gap_agents: 2,
    affected_unavailability: 1,
    reason: "缺口 2 人，且存在 1 条生效中不可用记录",
    recommendation: "优先复核",
  },
  {
    risk_id: "risk-plan-20260512-shanghai-acme-v1-14:00",
    plan_id: "plan-20260512-shanghai-acme-v1",
    plan_date: "2026-05-12",
    project_name: "Acme 客服",
    site_name: "上海职场",
    interval_start: "14:00",
    interval_end: "14:30",
    risk_level: "medium",
    risk_status: "confirmed",
    gap_agents: 1,
    affected_unavailability: 0,
    reason: "排班缺口",
    recommendation: "检查草稿",
  },
  {
    risk_id: "risk-plan-20260513-suzhou-bosch-v1-09:00",
    plan_id: "plan-20260513-suzhou-bosch-v1",
    plan_date: "2026-05-13",
    project_name: "博西客服",
    site_name: "苏州职场",
    interval_start: "09:00",
    interval_end: "09:30",
    risk_level: "low",
    risk_status: "resolved",
    gap_agents: 0,
    affected_unavailability: 0,
    reason: "已补充人员",
    recommendation: "无需处理",
  },
  {
    risk_id: "risk-plan-20260514-shanghai-acme-v1-16:00",
    plan_id: "plan-20260514-shanghai-acme-v1",
    plan_date: "2026-05-14",
    project_name: "Acme 客服",
    site_name: "上海职场",
    interval_start: "16:00",
    interval_end: "16:30",
    risk_level: "high",
    risk_status: "open",
    gap_agents: 3,
    affected_unavailability: 2,
    reason: "缺口 3 人，且存在 2 条生效中不可用记录",
    recommendation: "紧急复核",
  },
];

test("filterScheduleRiskRows matches query across risk id, plan id, project, site, date, interval, reason, recommendation", () => {
  // risk id
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "risk-plan-20260511" }).map((r) => r.risk_id),
    ["risk-plan-20260511-suzhou-bosch-v1-10:00"],
  );

  // plan id
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "plan-20260512" }).map((r) => r.risk_id),
    ["risk-plan-20260512-shanghai-acme-v1-14:00"],
  );

  // project
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "博西" }).map((r) => r.risk_id),
    [
      "risk-plan-20260511-suzhou-bosch-v1-10:00",
      "risk-plan-20260513-suzhou-bosch-v1-09:00",
    ],
  );

  // site
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "上海" }).map((r) => r.risk_id),
    [
      "risk-plan-20260512-shanghai-acme-v1-14:00",
      "risk-plan-20260514-shanghai-acme-v1-16:00",
    ],
  );

  // date
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "2026-05-13" }).map((r) => r.risk_id),
    ["risk-plan-20260513-suzhou-bosch-v1-09:00"],
  );

  // interval
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "14:00" }).map((r) => r.risk_id),
    ["risk-plan-20260512-shanghai-acme-v1-14:00"],
  );

  // reason
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "已补充" }).map((r) => r.risk_id),
    ["risk-plan-20260513-suzhou-bosch-v1-09:00"],
  );

  // recommendation
  assert.deepEqual(
    filterScheduleRiskRows(rows, { query: "紧急复核" }).map((r) => r.risk_id),
    ["risk-plan-20260514-shanghai-acme-v1-16:00"],
  );
});

test("filterScheduleRiskRows status filter works for open, confirmed, resolved, and all", () => {
  assert.deepEqual(
    filterScheduleRiskRows(rows, { status: "open" }).map((r) => r.risk_id),
    [
      "risk-plan-20260511-suzhou-bosch-v1-10:00",
      "risk-plan-20260514-shanghai-acme-v1-16:00",
    ],
  );
  assert.deepEqual(
    filterScheduleRiskRows(rows, { status: "confirmed" }).map((r) => r.risk_id),
    ["risk-plan-20260512-shanghai-acme-v1-14:00"],
  );
  assert.deepEqual(
    filterScheduleRiskRows(rows, { status: "resolved" }).map((r) => r.risk_id),
    ["risk-plan-20260513-suzhou-bosch-v1-09:00"],
  );
  assert.equal(
    filterScheduleRiskRows(rows, { status: "all" }).length,
    4,
  );
});

test("filterScheduleRiskRows level filter works for high, medium, low, and all", () => {
  assert.deepEqual(
    filterScheduleRiskRows(rows, { level: "high" }).map((r) => r.risk_id),
    [
      "risk-plan-20260511-suzhou-bosch-v1-10:00",
      "risk-plan-20260514-shanghai-acme-v1-16:00",
    ],
  );
  assert.deepEqual(
    filterScheduleRiskRows(rows, { level: "medium" }).map((r) => r.risk_id),
    ["risk-plan-20260512-shanghai-acme-v1-14:00"],
  );
  assert.deepEqual(
    filterScheduleRiskRows(rows, { level: "low" }).map((r) => r.risk_id),
    ["risk-plan-20260513-suzhou-bosch-v1-09:00"],
  );
  assert.equal(
    filterScheduleRiskRows(rows, { level: "all" }).length,
    4,
  );
});

test("filterScheduleRiskRows combined query + status + level filters work", () => {
  const result = filterScheduleRiskRows(rows, {
    query: "博西",
    status: "open",
    level: "high",
  });
  assert.deepEqual(result.map((r) => r.risk_id), [
    "risk-plan-20260511-suzhou-bosch-v1-10:00",
  ]);

  // query matches but status doesn't
  assert.deepEqual(
    filterScheduleRiskRows(rows, {
      query: "博西",
      status: "confirmed",
      level: "high",
    }).length,
    0,
  );
});

test("summarizeScheduleRiskRows returns total/open/confirmed/resolved/high/medium/low/affectedUnavailability", () => {
  const summary = summarizeScheduleRiskRows(rows);
  assert.equal(summary.total, 4);
  assert.equal(summary.open, 2);
  assert.equal(summary.confirmed, 1);
  assert.equal(summary.resolved, 1);
  assert.equal(summary.high, 2);
  assert.equal(summary.medium, 1);
  assert.equal(summary.low, 1);
  assert.equal(summary.totalGap, 6);
  assert.equal(summary.affectedUnavailability, 3);
});

test("summarizeScheduleRiskRows handles empty input", () => {
  const summary = summarizeScheduleRiskRows([]);
  assert.equal(summary.total, 0);
  assert.equal(summary.open, 0);
  assert.equal(summary.confirmed, 0);
  assert.equal(summary.resolved, 0);
  assert.equal(summary.high, 0);
  assert.equal(summary.medium, 0);
  assert.equal(summary.low, 0);
  assert.equal(summary.totalGap, 0);
  assert.equal(summary.affectedUnavailability, 0);
});

// UI structure tests

test("/schedule-risks/page.tsx imports and calls getScheduleRisksResult", async () => {
  const content = await readFile("app/schedule-risks/page.tsx", "utf-8");
  assert.ok(content.includes("getScheduleRisksResult"), "page imports getScheduleRisksResult");
  assert.ok(content.includes("getScheduleRisksResult("), "page calls getScheduleRisksResult");
});

test("/schedule-risks/page.tsx renders SearchInputBar", async () => {
  const content = await readFile("app/schedule-risks/page.tsx", "utf-8");
  assert.ok(content.includes("SearchInputBar"), "page uses SearchInputBar");
});

test("/schedule-risks/page.tsx renders status and level filters", async () => {
  const content = await readFile("app/schedule-risks/page.tsx", "utf-8");
  assert.ok(content.includes("StatusFilterPills"), "page uses StatusFilterPills");
  assert.ok(content.includes('"open"'), "page has open status option");
  assert.ok(content.includes('"confirmed"'), "page has confirmed status option");
  assert.ok(content.includes('"resolved"'), "page has resolved status option");
  assert.ok(content.includes('"high"'), "page has high level option");
  assert.ok(content.includes('"medium"'), "page has medium level option");
  assert.ok(content.includes('"low"'), "page has low level option");
});

test("components/schedule-risk-table.tsx uses MainTableShell", async () => {
  const content = await readFile("components/schedule-risk-table.tsx", "utf-8");
  assert.ok(content.includes("MainTableShell"), "table uses MainTableShell");
});

test("schedule-risk-table links to /schedule-risks/${encodeURIComponent(risk_id)}", async () => {
  const content = await readFile("components/schedule-risk-table.tsx", "utf-8");
  assert.ok(
    content.includes("/schedule-risks/${encodeURIComponent("),
    "table links to risk detail with encoded risk_id",
  );
});

test("schedule-risk-table links to /schedule-plans/${encodeURIComponent(plan_id)}", async () => {
  const content = await readFile("components/schedule-risk-table.tsx", "utf-8");
  assert.ok(
    content.includes("/schedule-plans/${encodeURIComponent("),
    "table links to plan detail with encoded plan_id",
  );
});

test("UI files do not contain internal terms", async () => {
  const page = await readFile("app/schedule-risks/page.tsx", "utf-8");
  const table = await readFile("components/schedule-risk-table.tsx", "utf-8");
  const combined = page + table;

  const forbidden = ["Gate", "PM", "Harness", "Codex", "Qoder"];
  for (const term of forbidden) {
    // Only check for standalone terms in user-facing strings, not in code identifiers
    const regex = new RegExp(`["'\`]${term}["'\`]`);
    assert.ok(!regex.test(combined), `UI does not contain internal term: ${term}`);
  }
});

test("UI files do not contain forbidden capability wording", async () => {
  const page = await readFile("app/schedule-risks/page.tsx", "utf-8");
  const table = await readFile("components/schedule-risk-table.tsx", "utf-8");
  const combined = page + table;

  const forbidden = ["自动排班", "自动修复", "审批", "导出", "批量操作", "结算", "收费"];
  for (const term of forbidden) {
    assert.ok(!combined.includes(term), `UI does not contain forbidden wording: ${term}`);
  }
});
