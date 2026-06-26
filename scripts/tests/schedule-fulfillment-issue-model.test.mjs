import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  getScheduleRiskActions,
  summarizeSchedulePlanFulfillmentIssues,
  summarizeScheduleRiskActionFeedback,
} from "../../lib/schedule-plans.ts";

import {
  getUnavailabilityAction,
  summarizeUnavailabilityActionFeedback,
} from "../../lib/unavailability.ts";

const planDetail = {
  summary: {
    id: "plan-a",
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
  ],
};

// ── Schedule Risk Actions ──

test("open risk actions include confirm and resolve", () => {
  const actions = getScheduleRiskActions("open");

  assert.equal(actions.length, 2);
  assert.equal(actions[0].key, "confirm");
  assert.equal(actions[0].label, "确认风险");
  assert.equal(actions[1].key, "resolve");
  assert.equal(actions[1].label, "标记已处理");
});

test("confirmed risk actions include only resolve", () => {
  const actions = getScheduleRiskActions("confirmed");

  assert.equal(actions.length, 1);
  assert.equal(actions[0].key, "resolve");
  assert.equal(actions[0].label, "标记已处理");
});

test("resolved risk actions return empty array", () => {
  const actions = getScheduleRiskActions("resolved");

  assert.equal(actions.length, 0);
  assert.deepEqual(actions, []);
});

test("schedule plan fulfillment summary counts related risks and overlapping unavailability only", () => {
  const summary = summarizeSchedulePlanFulfillmentIssues(
    planDetail,
    [
      {
        risk_id: "risk-a-open",
        plan_id: "plan-a",
        plan_date: "2026-05-11",
        project_name: "博西客服",
        site_name: "上海职场",
        interval_start: "09:00",
        interval_end: "09:30",
        risk_level: "high",
        gap_agents: 2,
        affected_unavailability: 1,
        reason: "缺口",
        recommendation: "处理",
        risk_status: "open",
      },
      {
        risk_id: "risk-a-confirmed",
        plan_id: "plan-a",
        plan_date: "2026-05-11",
        project_name: "博西客服",
        site_name: "上海职场",
        interval_start: "09:30",
        interval_end: "10:00",
        risk_level: "medium",
        gap_agents: 1,
        affected_unavailability: 0,
        reason: "缺口",
        recommendation: "处理",
        risk_status: "confirmed",
      },
      {
        risk_id: "risk-a-resolved",
        plan_id: "plan-a",
        plan_date: "2026-05-11",
        project_name: "博西客服",
        site_name: "上海职场",
        interval_start: "10:00",
        interval_end: "10:30",
        risk_level: "low",
        gap_agents: 0,
        affected_unavailability: 1,
        reason: "不可用",
        recommendation: "处理",
        risk_status: "resolved",
      },
      {
        risk_id: "risk-b-open",
        plan_id: "plan-b",
        plan_date: "2026-05-11",
        project_name: "博西客服",
        site_name: "上海职场",
        interval_start: "09:00",
        interval_end: "09:30",
        risk_level: "high",
        gap_agents: 2,
        affected_unavailability: 1,
        reason: "其他计划",
        recommendation: "忽略",
        risk_status: "open",
      },
    ],
    [
      {
        unavailability_id: "unavail-active",
        staff_name: "张敏",
        team_name: "A 组",
        project_name: "博西客服",
        site_name: "上海职场",
        unavailable_date: "2026-05-11",
        start_time: "09:10",
        end_time: "09:40",
        reason: "请假",
        status: "active",
        affected_intervals: 2,
        note: "重叠",
      },
      {
        unavailability_id: "unavail-resolved",
        staff_name: "王宁",
        team_name: "B 组",
        project_name: "博西客服",
        site_name: "上海职场",
        unavailable_date: "2026-05-11",
        start_time: "09:30",
        end_time: "10:00",
        reason: "培训",
        status: "resolved",
        affected_intervals: 1,
        note: "已处理",
      },
      {
        unavailability_id: "unavail-other-site",
        staff_name: "李想",
        team_name: "C 组",
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
    ]
  );

  assert.deepEqual(summary, {
    riskTotal: 3,
    riskOpen: 1,
    riskConfirmed: 1,
    riskResolved: 1,
    unavailabilityActive: 1,
    unavailabilityResolved: 1,
  });
});

// ── Schedule Risk Feedback ──

test("risk confirm_success feedback has correct title and tone", () => {
  const feedback = summarizeScheduleRiskActionFeedback("confirm_success");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "已确认风险");
  assert.equal(feedback?.tone, "success");
});

test("risk confirm_failed feedback has correct title and tone", () => {
  const feedback = summarizeScheduleRiskActionFeedback("confirm_failed");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "确认风险失败");
  assert.equal(feedback?.tone, "error");
});

test("risk resolve_success feedback has correct title and description includes 不会自动重算", () => {
  const feedback = summarizeScheduleRiskActionFeedback("resolve_success");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "已处理风险");
  assert.equal(feedback?.tone, "success");
  assert.equal(
    feedback?.description.includes("不会自动重算"),
    true,
    "resolve_success description must contain '不会自动重算'"
  );
});

test("risk resolve_failed feedback has correct title and tone", () => {
  const feedback = summarizeScheduleRiskActionFeedback("resolve_failed");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "处理风险失败");
  assert.equal(feedback?.tone, "error");
});

// ── Unavailability Actions ──

test("active unavailability action returns resolve", () => {
  const action = getUnavailabilityAction("active");

  assert.notEqual(action, null);
  assert.equal(action?.key, "resolve");
  assert.equal(action?.label, "标记已处理");
});

test("resolved unavailability action returns null", () => {
  const action = getUnavailabilityAction("resolved");

  assert.equal(action, null);
});

// ── Unavailability Feedback ──

test("unavailability resolve_success feedback has correct title", () => {
  const feedback = summarizeUnavailabilityActionFeedback("resolve_success");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "已处理不可用");
  assert.equal(feedback?.tone, "success");
});

test("unavailability resolve_failed feedback has correct title", () => {
  const feedback = summarizeUnavailabilityActionFeedback("resolve_failed");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "处理不可用失败");
  assert.equal(feedback?.tone, "error");
});

// ── Unknown / null feedback ──

test("unknown/null risk feedback returns null", () => {
  assert.equal(summarizeScheduleRiskActionFeedback(null), null);
  assert.equal(summarizeScheduleRiskActionFeedback(undefined), null);
  assert.equal(summarizeScheduleRiskActionFeedback(""), null);
  assert.equal(summarizeScheduleRiskActionFeedback("unknown_value"), null);
});

test("unknown/null unavailability feedback returns null", () => {
  assert.equal(summarizeUnavailabilityActionFeedback(null), null);
  assert.equal(summarizeUnavailabilityActionFeedback(undefined), null);
  assert.equal(summarizeUnavailabilityActionFeedback(""), null);
  assert.equal(summarizeUnavailabilityActionFeedback("unknown_value"), null);
});

// ── Forbidden terminology ──

test("schedule risk detail page does not expose internal terminology", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-risks/[riskId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM249"];

  for (const term of forbiddenTerms) {
    assert.equal(
      pageContent.includes(term),
      false,
      `Page contains forbidden term: ${term}`
    );
  }
});

test("unavailability detail page does not expose internal terminology", () => {
  const pagePath = join(
    process.cwd(),
    "app/unavailability/[unavailabilityId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM249"];

  for (const term of forbiddenTerms) {
    assert.equal(
      pageContent.includes(term),
      false,
      `Page contains forbidden term: ${term}`
    );
  }
});

// ── Page imports ──

test("schedule risk detail page imports confirmScheduleRiskAction and resolveScheduleRiskAction", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-risks/[riskId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("confirmScheduleRiskAction"),
    true,
    "Page must import confirmScheduleRiskAction"
  );
  assert.equal(
    pageContent.includes("resolveScheduleRiskAction"),
    true,
    "Page must import resolveScheduleRiskAction"
  );
});

test("unavailability detail page imports resolveUnavailabilityAction", () => {
  const pagePath = join(
    process.cwd(),
    "app/unavailability/[unavailabilityId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("resolveUnavailabilityAction"),
    true,
    "Page must import resolveUnavailabilityAction"
  );
});

test("schedule plan detail page summarizes fulfillment issue state without auto-fix wording", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(pageContent.includes("summarizeSchedulePlanFulfillmentIssues"), true);
  assert.equal(pageContent.includes("履约处理摘要"), true);
  assert.equal(pageContent.includes("自动修复"), false);
  assert.equal(pageContent.includes("缺口已消除"), false);
});
