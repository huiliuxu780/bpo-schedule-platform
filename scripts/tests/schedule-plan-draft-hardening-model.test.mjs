import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  summarizeSchedulePlanDraftFeedback,
} from "../../lib/schedule-plans.ts";

// ── Draft feedback helper ──

test("create_success feedback has success tone and correct title", () => {
  const feedback = summarizeSchedulePlanDraftFeedback("create_success");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.tone, "success");
  assert.equal(feedback?.title, "草稿已创建");
});

test("create_failed feedback has error tone and correct title", () => {
  const feedback = summarizeSchedulePlanDraftFeedback("create_failed");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.tone, "error");
  assert.equal(feedback?.title, "创建草稿失败");
});

test("update_success feedback has success tone and correct title", () => {
  const feedback = summarizeSchedulePlanDraftFeedback("update_success");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.tone, "success");
  assert.equal(feedback?.title, "草稿已保存");
});

test("update_failed feedback has error tone and correct title", () => {
  const feedback = summarizeSchedulePlanDraftFeedback("update_failed");

  assert.notEqual(feedback, null);
  assert.equal(feedback?.tone, "error");
  assert.equal(feedback?.title, "保存草稿失败");
});

test("unknown feedback value returns null", () => {
  assert.equal(summarizeSchedulePlanDraftFeedback("unknown_value"), null);
});

test("null/undefined/empty feedback returns null", () => {
  assert.equal(summarizeSchedulePlanDraftFeedback(null), null);
  assert.equal(summarizeSchedulePlanDraftFeedback(undefined), null);
  assert.equal(summarizeSchedulePlanDraftFeedback(""), null);
});

// ── New page ──

test("new page renders create failure feedback and uses create action", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/page.tsx"),
    "utf-8"
  );

  assert.ok(content.includes("createDraftAction"), "new page must use createDraftAction");
  assert.ok(content.includes("draftFeedback"), "new page must render draft feedback");
  assert.ok(
    content.includes("summarizeSchedulePlanDraftFeedback"),
    "new page must call summarizeSchedulePlanDraftFeedback"
  );
});

test("new page includes interval_count hidden field", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/page.tsx"),
    "utf-8"
  );

  assert.ok(
    content.includes('name="interval_count"'),
    "new page form must include interval_count hidden field"
  );
});

// ── Edit page ──

test("edit page uses getSchedulePlanResult and ReadinessBanner", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );

  assert.ok(
    content.includes("getSchedulePlanResult"),
    "edit page must use getSchedulePlanResult"
  );
  assert.ok(
    content.includes("ReadinessBanner"),
    "edit page must render ReadinessBanner"
  );
  assert.ok(
    content.includes("result.message"),
    "edit page must pass result.message to banner"
  );
});

test("edit page preserves non-draft blocker", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );

  assert.ok(content.includes("当前计划不可编辑"), "edit page must show non-draft blocker");
  assert.ok(content.includes("isDraft"), "edit page must check isDraft status");
  assert.ok(content.includes("!isDraft"), "edit page must conditionally block non-draft plans");
});

test("edit page renders draft feedback card", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );

  assert.ok(content.includes("draftFeedback"), "edit page must render draft feedback");
  assert.ok(
    content.includes("summarizeSchedulePlanDraftFeedback"),
    "edit page must call summarizeSchedulePlanDraftFeedback"
  );
});

// ── Detail page ──

test("detail page renders draft feedback separately from lifecycle feedback", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/page.tsx"),
    "utf-8"
  );

  assert.ok(content.includes("draftFeedback"), "detail page must render draft feedback");
  assert.ok(
    content.includes("summarizeSchedulePlanDraftFeedback"),
    "detail page must call summarizeSchedulePlanDraftFeedback"
  );
  assert.ok(
    content.includes("lifecycleFeedback"),
    "detail page must still render lifecycle feedback"
  );

  // Both feedback cards are rendered independently
  const lifecycleMatch = content.match(/\{lifecycleFeedback \?/g);
  const draftMatch = content.match(/\{draftFeedback \?/g);

  assert.equal(lifecycleMatch?.length, 1, "lifecycle feedback card must appear once");
  assert.equal(draftMatch?.length, 1, "draft feedback card must appear once");
});

// ── Create action ──

test("create action redirects success to detail with draft=create_success", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/actions.ts"),
    "utf-8"
  );

  assert.ok(
    content.includes("draft=create_success"),
    "create action must redirect with draft=create_success"
  );
});

test("create action redirects failure to new page with draft=create_failed", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/actions.ts"),
    "utf-8"
  );

  assert.ok(
    content.includes("draft=create_failed"),
    "create action must redirect with draft=create_failed"
  );
  assert.ok(
    content.includes("/schedule-plans/new?draft=create_failed"),
    "create action must redirect back to /schedule-plans/new"
  );
});

test("create action encodes dynamic plan ID", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/actions.ts"),
    "utf-8"
  );

  assert.ok(
    content.includes("encodeURIComponent"),
    "create action must encode dynamic plan ID"
  );
});

// ── Update action ──

test("update action redirects success to detail with draft=update_success", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/actions.ts"),
    "utf-8"
  );

  assert.ok(
    content.includes("draft=update_success"),
    "update action must redirect with draft=update_success"
  );
});

test("update action redirects failure to edit page with draft=update_failed", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/actions.ts"),
    "utf-8"
  );

  assert.ok(
    content.includes("draft=update_failed"),
    "update action must redirect with draft=update_failed"
  );
  assert.ok(
    content.includes("/edit?draft=update_failed"),
    "update action must redirect back to edit page"
  );
});

test("update action encodes dynamic plan ID", () => {
  const content = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/actions.ts"),
    "utf-8"
  );

  assert.ok(
    content.includes("encodeURIComponent"),
    "update action must encode dynamic plan ID"
  );
});

// ── Form robustness ──

test("create and update actions preserve 0 values in formNumber", () => {
  const createAction = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/actions.ts"),
    "utf-8"
  );
  const updateAction = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/actions.ts"),
    "utf-8"
  );

  // Both actions must use >= 0 not > 0
  assert.ok(
    createAction.includes(">= 0"),
    "create action must preserve 0 values with >= 0 check"
  );
  assert.ok(
    updateAction.includes(">= 0"),
    "update action must preserve 0 values with >= 0 check"
  );
});

test("create and update actions read interval_count from form data", () => {
  const createAction = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/actions.ts"),
    "utf-8"
  );
  const updateAction = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/actions.ts"),
    "utf-8"
  );

  assert.ok(
    createAction.includes('interval_count'),
    "create action must read interval_count"
  );
  assert.ok(
    updateAction.includes('interval_count'),
    "update action must read interval_count"
  );
});

// ── UI wording ──

test("no product source contains forbidden internal terminology", () => {
  const forbidden = [
    "Gate", "PM", "Harness", "Codex", "Qoder",
  ];

  const files = [
    "app/schedule-plans/new/page.tsx",
    "app/schedule-plans/new/actions.ts",
    "app/schedule-plans/[planId]/edit/page.tsx",
    "app/schedule-plans/[planId]/edit/actions.ts",
    "app/schedule-plans/[planId]/page.tsx",
  ];

  for (const file of files) {
    const content = readFileSync(join(import.meta.dirname, "../../" + file), "utf-8");
    for (const word of forbidden) {
      assert.ok(
        !content.includes(word),
        `${file} must not contain forbidden wording: ${word}`
      );
    }
  }
});

test("no UI copy contains forbidden business terminology", () => {
  const forbidden = [
    "自动排班", "自动修复", "审批", "导出", "批量", "结算", "收费",
  ];

  const files = [
    "app/schedule-plans/new/page.tsx",
    "app/schedule-plans/new/actions.ts",
    "app/schedule-plans/[planId]/edit/page.tsx",
    "app/schedule-plans/[planId]/edit/actions.ts",
    "app/schedule-plans/[planId]/page.tsx",
  ];

  for (const file of files) {
    const content = readFileSync(join(import.meta.dirname, "../../" + file), "utf-8");
    for (const word of forbidden) {
      assert.ok(
        !content.includes(word),
        `${file} must not contain forbidden business wording: ${word}`
      );
    }
  }
});
