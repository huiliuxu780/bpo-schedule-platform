import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// ── Shared form component tests ──

test("shared draft form component exists", () => {
  const formSource = readFileSync(
    join(import.meta.dirname, "../../components/schedule-plan-draft-form.tsx"),
    "utf-8"
  );
  
  assert.ok(formSource.includes("SchedulePlanDraftForm"));
  assert.ok(formSource.includes("mode:"));
  assert.ok(formSource.includes("planFields:"));
  assert.ok(formSource.includes("intervals:"));
});

test("new page uses shared form component", () => {
  const newPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/page.tsx"),
    "utf-8"
  );
  
  assert.ok(newPageSource.includes("SchedulePlanDraftForm"));
  assert.ok(newPageSource.includes("import") && newPageSource.includes("schedule-plan-draft-form"));
});

test("new page binds create server action at the page-level form", () => {
  const newPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/page.tsx"),
    "utf-8"
  );

  assert.ok(newPageSource.includes("<form action={createDraftAction}"));
  assert.ok(!newPageSource.includes("action={createDraftAction}\n          planFields"));
});

test("edit page uses shared form component", () => {
  const editPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );
  
  assert.ok(editPageSource.includes("SchedulePlanDraftForm"));
  assert.ok(editPageSource.includes("import") && editPageSource.includes("schedule-plan-draft-form"));
});

test("edit page binds update server action at the page-level form", () => {
  const editPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );

  assert.ok(editPageSource.includes("<form action={updateDraftAction}"));
  assert.ok(!editPageSource.includes("action={updateDraftAction}\n              planFields"));
});

test("shared form preserves field names expected by server actions", () => {
  const formSource = readFileSync(
    join(import.meta.dirname, "../../components/schedule-plan-draft-form.tsx"),
    "utf-8"
  );
  
  assert.ok(formSource.includes('name="plan_id"'));
  assert.ok(formSource.includes('name="interval_count"'));
  assert.ok(formSource.includes('name="plan_date"'));
  assert.ok(formSource.includes('name="project_name"'));
  assert.ok(formSource.includes('name="site_name"'));
  assert.ok(formSource.includes('name="version"'));
  assert.ok(formSource.includes("interval_start_"));
  assert.ok(formSource.includes("interval_end_"));
  assert.ok(formSource.includes("forecast_agents_"));
  assert.ok(formSource.includes("scheduled_agents_"));
  assert.ok(formSource.includes("note_"));
});

test("shared draft form does not own the server action form element", () => {
  const formSource = readFileSync(
    join(import.meta.dirname, "../../components/schedule-plan-draft-form.tsx"),
    "utf-8"
  );

  assert.ok(!formSource.includes("<form action={action}"));
  assert.ok(!formSource.includes("action: (formData: FormData) => Promise<void>"));
});

test("new page no longer duplicates interval form markup", () => {
  const newPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/page.tsx"),
    "utf-8"
  );
  
  assert.ok(!newPageSource.includes("interval_start_"));
  assert.ok(!newPageSource.includes("interval_end_"));
  assert.ok(!newPageSource.includes("forecast_agents_"));
  assert.ok(!newPageSource.includes("scheduled_agents_"));
  assert.ok(!newPageSource.includes('name="note_'));
  assert.ok(newPageSource.includes("SchedulePlanDraftForm"));
});

test("edit page no longer duplicates interval form markup", () => {
  const editPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );
  
  assert.ok(!editPageSource.includes("interval_start_"));
  assert.ok(!editPageSource.includes("interval_end_"));
  assert.ok(!editPageSource.includes("forecast_agents_"));
  assert.ok(!editPageSource.includes("scheduled_agents_"));
  assert.ok(!editPageSource.includes('name="note_'));
  assert.ok(editPageSource.includes("SchedulePlanDraftForm"));
});

// ── Draft summary component tests ──

test("draft summary component exists", () => {
  const summarySource = readFileSync(
    join(import.meta.dirname, "../../components/schedule-plan-draft-summary.tsx"),
    "utf-8"
  );
  
  assert.ok(summarySource.includes("SchedulePlanDraftSummary"));
  assert.ok(summarySource.includes("intervalCount"));
  assert.ok(summarySource.includes("totalForecast"));
  assert.ok(summarySource.includes("totalScheduled"));
  assert.ok(summarySource.includes("totalGap"));
  assert.ok(summarySource.includes("coverageRate"));
  assert.ok(summarySource.includes("草稿口径"));
});

test("draft summary uses non-negative gap totals", () => {
  const summarySource = readFileSync(
    join(import.meta.dirname, "../../components/schedule-plan-draft-summary.tsx"),
    "utf-8"
  );

  assert.ok(summarySource.includes("Math.max"));
});

test("new page does not use external draft summary component", () => {
  const newPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/page.tsx"),
    "utf-8"
  );
  
  assert.ok(!newPageSource.includes("SchedulePlanDraftSummary"), "New page must not render external summary");
  assert.ok(!newPageSource.includes("schedule-plan-draft-summary"), "New page must not import summary component");
});

test("edit page does not use external draft summary component", () => {
  const editPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );
  
  assert.ok(!editPageSource.includes("SchedulePlanDraftSummary"), "Edit page must not render external summary");
  assert.ok(!editPageSource.includes("schedule-plan-draft-summary"), "Edit page must not import summary component");
});

// ── Edit page blocker tests ──

test("edit page preserves non-draft blocker", () => {
  const editPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );
  
  assert.ok(editPageSource.includes("当前计划不可编辑"));
  assert.ok(editPageSource.includes("isDraft"));
  assert.ok(editPageSource.includes("notFound()"));
  assert.ok(editPageSource.includes("仅草稿计划可编辑"));
});

// ── Action redirect tests ──

test("create action redirects to detail with encoded plan id and draft=create_success", () => {
  const createActionSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/actions.ts"),
    "utf-8"
  );
  
  assert.ok(createActionSource.includes("encodeURIComponent"));
  assert.ok(createActionSource.includes("draft=create_success"));
  assert.ok(createActionSource.includes("/schedule-plans/"));
});

test("create action redirects to new page with draft=create_failed on failure", () => {
  const createActionSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/actions.ts"),
    "utf-8"
  );
  
  assert.ok(createActionSource.includes("draft=create_failed"));
  assert.ok(createActionSource.includes("/schedule-plans/new"));
});

test("update action redirects to detail with encoded plan id and draft=update_success", () => {
  const updateActionSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/actions.ts"),
    "utf-8"
  );
  
  assert.ok(updateActionSource.includes("encodeURIComponent"));
  assert.ok(updateActionSource.includes("draft=update_success"));
  assert.ok(updateActionSource.includes("/schedule-plans/"));
});

test("update action redirects to edit page with draft=update_failed on failure", () => {
  const updateActionSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/actions.ts"),
    "utf-8"
  );
  
  assert.ok(updateActionSource.includes("draft=update_failed"));
  assert.ok(updateActionSource.includes("/edit"));
});

// ── Detail page feedback tests ──

test("detail page still renders draft and lifecycle feedback separately", () => {
  const detailPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/page.tsx"),
    "utf-8"
  );
  
  assert.ok(detailPageSource.includes("lifecycleFeedback"));
  assert.ok(detailPageSource.includes("draftFeedback"));
  assert.ok(detailPageSource.includes("summarizeSchedulePlanLifecycleFeedback"));
  assert.ok(detailPageSource.includes("summarizeSchedulePlanDraftFeedback"));
  
  const lifecycleFeedbackCount = (detailPageSource.match(/\{lifecycleFeedback \?/g) || []).length;
  const draftFeedbackCount = (detailPageSource.match(/\{draftFeedback \?/g) || []).length;
  
  assert.equal(lifecycleFeedbackCount, 1, "lifecycle feedback card must appear once");
  assert.equal(draftFeedbackCount, 1, "draft feedback card must appear once");
});

// ── Forbidden terminology tests ──

const forbiddenTerms = [
  "Gate",
  "PM",
  "Harness",
  "Codex",
  "Qoder",
  "自动排班",
  "自动修复",
  "审批",
  "导出",
  "批量",
  "结算",
  "收费",
];

test("shared form does not contain forbidden terms", () => {
  const formSource = readFileSync(
    join(import.meta.dirname, "../../components/schedule-plan-draft-form.tsx"),
    "utf-8"
  );
  
  forbiddenTerms.forEach((term) => {
    assert.ok(!formSource.includes(term), `Form should not contain: ${term}`);
  });
});

test("draft summary does not contain forbidden terms", () => {
  const summarySource = readFileSync(
    join(import.meta.dirname, "../../components/schedule-plan-draft-summary.tsx"),
    "utf-8"
  );
  
  forbiddenTerms.forEach((term) => {
    assert.ok(!summarySource.includes(term), `Summary should not contain: ${term}`);
  });
});

test("new page does not contain forbidden terms", () => {
  const newPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/new/page.tsx"),
    "utf-8"
  );
  
  forbiddenTerms.forEach((term) => {
    assert.ok(!newPageSource.includes(term), `New page should not contain: ${term}`);
  });
});

test("edit page does not contain forbidden terms", () => {
  const editPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/edit/page.tsx"),
    "utf-8"
  );
  
  forbiddenTerms.forEach((term) => {
    assert.ok(!editPageSource.includes(term), `Edit page should not contain: ${term}`);
  });
});

test("detail page does not contain forbidden terms", () => {
  const detailPageSource = readFileSync(
    join(import.meta.dirname, "../../app/schedule-plans/[planId]/page.tsx"),
    "utf-8"
  );
  
  forbiddenTerms.forEach((term) => {
    assert.ok(!detailPageSource.includes(term), `Detail page should not contain: ${term}`);
  });
});
