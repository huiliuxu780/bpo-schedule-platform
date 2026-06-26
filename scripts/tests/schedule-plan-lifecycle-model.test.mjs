import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  getSchedulePlanLifecycleAction,
  summarizeSchedulePlanLifecycleFeedback,
} from "../../lib/schedule-plans.ts";

test("draft status returns submit_review action with correct label and nextStatus", () => {
  const action = getSchedulePlanLifecycleAction("draft");

  assert.notEqual(action, null);
  assert.equal(action?.key, "submit_review");
  assert.equal(action?.label, "提交复核");
  assert.equal(action?.nextStatus, "review_ready");
});

test("review_ready status returns publish action with correct label and nextStatus", () => {
  const action = getSchedulePlanLifecycleAction("review_ready");

  assert.notEqual(action, null);
  assert.equal(action?.key, "publish");
  assert.equal(action?.label, "发布计划");
  assert.equal(action?.nextStatus, "published");
});

test("published status returns null (no next action)", () => {
  const action = getSchedulePlanLifecycleAction("published");

  assert.equal(action, null);
});

test("submit_review_success feedback has correct title and tone", () => {
  const feedback = summarizeSchedulePlanLifecycleFeedback("submit_review_success");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "已提交复核");
  assert.equal(feedback?.tone, "success");
});

test("submit_review_failed feedback has correct title and tone", () => {
  const feedback = summarizeSchedulePlanLifecycleFeedback("submit_review_failed");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "提交复核失败");
  assert.equal(feedback?.tone, "error");
});

test("publish_success feedback has correct title and tone", () => {
  const feedback = summarizeSchedulePlanLifecycleFeedback("publish_success");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "已发布计划");
  assert.equal(feedback?.tone, "success");
});

test("publish_failed feedback has correct title and tone", () => {
  const feedback = summarizeSchedulePlanLifecycleFeedback("publish_failed");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.title, "发布计划失败");
  assert.equal(feedback?.tone, "error");
});

test("unknown feedback value returns null", () => {
  const feedback = summarizeSchedulePlanLifecycleFeedback("unknown_value");

  assert.equal(feedback, null);
});

test("null/undefined feedback returns null", () => {
  assert.equal(summarizeSchedulePlanLifecycleFeedback(null), null);
  assert.equal(summarizeSchedulePlanLifecycleFeedback(undefined), null);
  assert.equal(summarizeSchedulePlanLifecycleFeedback(""), null);
});

test("detail page does not expose internal terminology", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM248"];

  for (const term of forbiddenTerms) {
    assert.equal(
      pageContent.includes(term),
      false,
      `Page contains forbidden term: ${term}`
    );
  }
});

test("detail page imports both lifecycle actions", () => {
  const pagePath = join(
    process.cwd(),
    "app/schedule-plans/[planId]/page.tsx"
  );
  const pageContent = readFileSync(pagePath, "utf-8");

  assert.equal(
    pageContent.includes("submitReviewAction"),
    true,
    "Page must import submitReviewAction"
  );
  assert.equal(
    pageContent.includes("publishSchedulePlanAction"),
    true,
    "Page must import publishSchedulePlanAction"
  );
});
