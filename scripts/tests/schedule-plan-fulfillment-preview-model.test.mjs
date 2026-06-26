import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  buildSchedulePlanFulfillmentPreview,
  scheduleRiskLevelLabel,
  scheduleRiskStatusLabel,
} from "../../lib/schedule-plans.ts";

import { unavailabilityStatusLabel } from "../../lib/unavailability.ts";

// ── Test Fixtures ──

const planDetail = {
  summary: {
    id: "plan-test",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    version: "v1",
    status: "published",
    forecast_agents: 20,
    scheduled_agents: 18,
    gap_agents: 2,
    coverage_rate: 0.9,
    updated_at: "2026-05-11T10:00:00+08:00",
  },
  intervals: [
    {
      interval_start: "09:00",
      interval_end: "09:30",
      forecast_agents: 10,
      scheduled_agents: 8,
      gap_agents: 2,
      coverage_rate: 0.8,
      note: "缺口",
    },
    {
      interval_start: "09:30",
      interval_end: "10:00",
      forecast_agents: 10,
      scheduled_agents: 10,
      gap_agents: 0,
      coverage_rate: 1,
      note: "正常",
    },
    {
      interval_start: "10:00",
      interval_end: "10:30",
      forecast_agents: 10,
      scheduled_agents: 9,
      gap_agents: 1,
      coverage_rate: 0.9,
      note: "轻微缺口",
    },
  ],
};

const testRisks = [
  {
    risk_id: "risk-plan-test-09:00-high-open",
    plan_id: "plan-test",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "09:00",
    interval_end: "09:30",
    risk_level: "high",
    gap_agents: 2,
    affected_unavailability: 1,
    reason: "缺口 2 人",
    recommendation: "优先处理",
    risk_status: "open",
  },
  {
    risk_id: "risk-plan-test-09:30-medium-confirmed",
    plan_id: "plan-test",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "09:30",
    interval_end: "10:00",
    risk_level: "medium",
    gap_agents: 1,
    affected_unavailability: 0,
    reason: "缺口 1 人",
    recommendation: "确认处理",
    risk_status: "confirmed",
  },
  {
    risk_id: "risk-plan-test-10:00-low-resolved",
    plan_id: "plan-test",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "10:00",
    interval_end: "10:30",
    risk_level: "low",
    gap_agents: 1,
    affected_unavailability: 0,
    reason: "小缺口",
    recommendation: "已处理",
    risk_status: "resolved",
  },
  {
    risk_id: "risk-other-plan-09:00-high-open",
    plan_id: "plan-other",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "09:00",
    interval_end: "09:30",
    risk_level: "high",
    gap_agents: 2,
    affected_unavailability: 0,
    reason: "其他计划风险",
    recommendation: "忽略",
    risk_status: "open",
  },
];

const testUnavailability = [
  {
    unavailability_id: "unavail-active-09:10",
    staff_name: "张敏",
    team_name: "A 组",
    project_name: "博西客服",
    site_name: "上海职场",
    unavailable_date: "2026-05-11",
    start_time: "09:10",
    end_time: "09:40",
    reason: "临时请假",
    status: "active",
    affected_intervals: 2,
    note: "影响早班",
  },
  {
    unavailability_id: "unavail-active-10:00",
    staff_name: "李想",
    team_name: "B 组",
    project_name: "博西客服",
    site_name: "上海职场",
    unavailable_date: "2026-05-11",
    start_time: "10:00",
    end_time: "10:30",
    reason: "培训",
    status: "active",
    affected_intervals: 1,
    note: "培训占用",
  },
  {
    unavailability_id: "unavail-resolved-09:30",
    staff_name: "王宁",
    team_name: "C 组",
    project_name: "博西客服",
    site_name: "上海职场",
    unavailable_date: "2026-05-11",
    start_time: "09:30",
    end_time: "10:00",
    reason: "已调整",
    status: "resolved",
    affected_intervals: 1,
    note: "已处理",
  },
  {
    unavailability_id: "unavail-other-site",
    staff_name: "赵六",
    team_name: "D 组",
    project_name: "博西客服",
    site_name: "苏州职场",
    unavailable_date: "2026-05-11",
    start_time: "09:00",
    end_time: "09:30",
    reason: "其他职场",
    status: "active",
    affected_intervals: 1,
    note: "忽略",
  },
];

// ── Preview Model Tests ──

test("buildSchedulePlanFulfillmentPreview filters risks by plan_id", () => {
  const preview = buildSchedulePlanFulfillmentPreview(
    planDetail,
    testRisks,
    testUnavailability
  );

  assert.equal(preview.riskPreviews.length, 3, "Should include 3 risks from plan-test");
  assert.equal(
    preview.riskPreviews.every((r) => r.risk_id.startsWith("risk-plan-test-")),
    true,
    "All risk previews should be from plan-test"
  );
  assert.equal(
    preview.riskPreviews.some((r) => r.risk_id === "risk-other-plan-09:00-high-open"),
    false,
    "Should not include risk from plan-other"
  );
});

test("buildSchedulePlanFulfillmentPreview filters unavailability by site/project/date/interval overlap", () => {
  const preview = buildSchedulePlanFulfillmentPreview(
    planDetail,
    testRisks,
    testUnavailability
  );

  assert.equal(
    preview.unavailabilityPreviews.length,
    3,
    "Should include 3 unavailability records matching overlap criteria"
  );
  assert.equal(
    preview.unavailabilityPreviews.every(
      (u) => u.unavailability_id !== "unavail-other-site"
    ),
    true,
    "Should not include unavailability from other site"
  );
});

test("buildSchedulePlanFulfillmentPreview sorts risks: open high before confirmed/resolved lower priority", () => {
  const preview = buildSchedulePlanFulfillmentPreview(
    planDetail,
    testRisks,
    testUnavailability
  );

  assert.equal(preview.riskPreviews[0].risk_status, "open", "First risk should be open");
  assert.equal(
    preview.riskPreviews[0].risk_level,
    "high",
    "First open risk should be high priority"
  );
  assert.equal(
    preview.riskPreviews[1].risk_status,
    "confirmed",
    "Second risk should be confirmed"
  );
  assert.equal(
    preview.riskPreviews[2].risk_status,
    "resolved",
    "Third risk should be resolved"
  );
});

test("buildSchedulePlanFulfillmentPreview sorts unavailability: active before resolved and by start_time", () => {
  const preview = buildSchedulePlanFulfillmentPreview(
    planDetail,
    testRisks,
    testUnavailability
  );

  const activeCount = preview.unavailabilityPreviews.filter(
    (u) => u.status === "active"
  ).length;
  assert.ok(activeCount >= 2, "Should have at least 2 active records in preview");

  if (preview.unavailabilityPreviews.length >= 2) {
    const firstActive = preview.unavailabilityPreviews.find((u) => u.status === "active");
    const secondActive = preview.unavailabilityPreviews.filter(
      (u) => u.status === "active"
    )[1];
    if (firstActive && secondActive) {
      assert.ok(
        firstActive.start_time <= secondActive.start_time,
        "Active records should be sorted by start_time"
      );
    }
  }
});

test("buildSchedulePlanFulfillmentPreview caps preview arrays at 3 and exposes remaining counts", () => {
  const manyRisks = [
    ...testRisks,
    {
      risk_id: "risk-plan-test-extra-1",
      plan_id: "plan-test",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      interval_start: "11:00",
      interval_end: "11:30",
      risk_level: "low",
      gap_agents: 0,
      affected_unavailability: 0,
      reason: "额外风险 1",
      recommendation: "处理",
      risk_status: "open",
    },
    {
      risk_id: "risk-plan-test-extra-2",
      plan_id: "plan-test",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      interval_start: "12:00",
      interval_end: "12:30",
      risk_level: "low",
      gap_agents: 0,
      affected_unavailability: 0,
      reason: "额外风险 2",
      recommendation: "处理",
      risk_status: "open",
    },
  ];

  const preview = buildSchedulePlanFulfillmentPreview(
    planDetail,
    manyRisks,
    testUnavailability
  );

  assert.equal(
    preview.riskPreviews.length,
    3,
    "Risk preview should be capped at 3"
  );
  assert.equal(
    preview.remainingRisks,
    2,
    "Should report 2 remaining risks"
  );
});

test("buildSchedulePlanFulfillmentPreview returns empty arrays when no related records", () => {
  const emptyRisks = testRisks.filter((r) => r.plan_id === "nonexistent");
  const emptyUnavail = testUnavailability.filter(
    (u) => u.site_name === "nonexistent"
  );

  const preview = buildSchedulePlanFulfillmentPreview(
    planDetail,
    emptyRisks,
    emptyUnavail
  );

  assert.equal(preview.riskPreviews.length, 0, "No risk previews");
  assert.equal(preview.unavailabilityPreviews.length, 0, "No unavailability previews");
  assert.equal(preview.remainingRisks, 0, "No remaining risks");
  assert.equal(preview.remainingUnavailability, 0, "No remaining unavailability");
});

// ── Label Helper Tests ──

test("scheduleRiskLevelLabel returns correct Chinese labels", () => {
  assert.equal(scheduleRiskLevelLabel("high"), "高风险");
  assert.equal(scheduleRiskLevelLabel("medium"), "需关注");
  assert.equal(scheduleRiskLevelLabel("low"), "提醒");
});

test("scheduleRiskStatusLabel returns correct Chinese labels", () => {
  assert.equal(scheduleRiskStatusLabel("open"), "待处理");
  assert.equal(scheduleRiskStatusLabel("confirmed"), "已确认");
  assert.equal(scheduleRiskStatusLabel("resolved"), "已处理");
});

test("unavailabilityStatusLabel returns correct Chinese labels", () => {
  assert.equal(unavailabilityStatusLabel("active"), "生效中");
  assert.equal(unavailabilityStatusLabel("resolved"), "已处理");
});

// ── Page Source Tests ──

test("schedule plan detail page renders 关联风险预览 and 不可用记录预览", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("关联风险预览"),
    true,
    "Page must render '关联风险预览' heading"
  );
  assert.equal(
    pageContent.includes("不可用记录预览"),
    true,
    "Page must render '不可用记录预览' heading"
  );
});

test("schedule plan detail page has explicit empty states", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("当前计划暂无关联风险"),
    true,
    "Page must show empty state for no risks"
  );
  assert.equal(
    pageContent.includes("当前计划暂无重叠不可用记录"),
    true,
    "Page must show empty state for no unavailability"
  );
});

test("schedule plan detail page links to risk and unavailability routes", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("/schedule-risks/${encodeURIComponent(risk.risk_id)}"),
    true,
    "Page must link to encoded individual risk detail route"
  );
  assert.equal(
    pageContent.includes(
      "/unavailability/${encodeURIComponent(unavail.unavailability_id)}"
    ),
    true,
    "Page must link to encoded individual unavailability detail route"
  );
});

test("schedule plan detail page displays preview reason, recommendation, and note", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("{risk.reason}") &&
      pageContent.includes("{risk.recommendation}"),
    true,
    "Risk preview should show both reason and recommendation"
  );
  assert.equal(
    pageContent.includes("{unavail.reason}") &&
      pageContent.includes("{unavail.note}"),
    true,
    "Unavailability preview should show both reason and note"
  );
});

test("schedule plan detail page does not expose internal terminology", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM255"];

  for (const term of forbiddenTerms) {
    assert.equal(
      pageContent.includes(term),
      false,
      `Page contains forbidden term: ${term}`
    );
  }
});

test("schedule plan detail page does not use auto scheduling or auto fix wording", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("自动排班"),
    false,
    "Page must not contain '自动排班'"
  );
  assert.equal(
    pageContent.includes("自动修复"),
    false,
    "Page must not contain '自动修复'"
  );
  assert.equal(
    pageContent.includes("自动调整"),
    false,
    "Page must not contain '自动调整'"
  );
});

test("schedule plan detail page preserves existing 查看关联风险 and 查看不可用记录 buttons", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("查看关联风险"),
    true,
    "Page must preserve '查看关联风险' button"
  );
  assert.equal(
    pageContent.includes("查看不可用记录"),
    true,
    "Page must preserve '查看不可用记录' button"
  );
});
