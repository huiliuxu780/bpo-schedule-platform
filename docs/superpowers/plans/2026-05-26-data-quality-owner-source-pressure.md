# Data Quality Owner Source Pressure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data-quality gap owner/source pressure summary to `/data-quality`.

**Architecture:** Reuse the existing data-quality review coverage gap model, then aggregate uncovered gap items by owner and source. Render the summary as a compact shadcn card on the existing data-quality overview page, with no write actions.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript model helpers, Node test runner.

---

### Task 1: Model Red Test

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add failing import and tests**

```js
import {
  summarizeDataQualityGapOwnerSourcePressure,
} from "../../lib/data-quality.ts";

test("data quality gap owner source pressure summarizes uncovered review gaps", () => {
  const summary = summarizeDataQualityGapOwnerSourcePressure(fallbackDataQualityIssues);

  assert.equal(summary.gapIssueCount, 1);
  assert.equal(summary.impactedExceptionCount, 1);
  assert.equal(summary.impactedPeopleCount, 1);
  assert.equal(summary.topOwner, "数据管理员");
  assert.equal(summary.topSource, "master_data");
  assert.equal(summary.topItem?.representativeIssueId, "DQ-202605-004");
  assert.ok(summary.topItem?.sourceFields.includes("agent_binding.employee_id"));
  assert.ok(summary.topItem?.impactedPeople.includes("A-9931"));
  assert.ok(summary.topItem?.href.includes("DQ-202605-004"));
  assert.ok(summary.deferredActions.includes("无导出或批量处理"));
});

test("data quality gap owner source pressure exposes empty state", () => {
  const summary = summarizeDataQualityGapOwnerSourcePressure([]);

  assert.equal(summary.gapIssueCount, 0);
  assert.equal(summary.impactedExceptionCount, 0);
  assert.equal(summary.impactedPeopleCount, 0);
  assert.equal(summary.topOwner, undefined);
  assert.equal(summary.topSource, undefined);
  assert.deepEqual(summary.items, []);
});
```

- [ ] **Step 2: Run test to verify RED**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: FAIL because `summarizeDataQualityGapOwnerSourcePressure` is not exported.

### Task 2: Model Implementation

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] **Step 1: Add types and function**

Add `DataQualityGapOwnerSourcePressureItem`, `DataQualityGapOwnerSourcePressureSummary`, and `summarizeDataQualityGapOwnerSourcePressure(rows)`.

- [ ] **Step 2: Use existing coverage gap**

Call `summarizeDataQualityReviewCoverageGap(rows)`, find the original issue for each gap item, group by `owner|source`, and sort by impacted exceptions, people, issue count, then owner.

- [ ] **Step 3: Run model tests**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: PASS.

### Task 3: UI Card

**Files:**
- Modify: `app/data-quality/page.tsx`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Import and compute summary**

Import `summarizeDataQualityGapOwnerSourcePressure` and compute `gapOwnerSourcePressure`.

- [ ] **Step 2: Render card**

Add a card titled `缺口 owner/来源压力` after `复核覆盖缺口摘要`, showing total pressure metrics, top owner/source, pressure items, `查看压力问题`, and deferred actions.

- [ ] **Step 3: Add page source assertions**

Assert the page source includes `summarizeDataQualityGapOwnerSourcePressure`, `缺口 owner/来源压力`, and `查看压力问题`.

- [ ] **Step 4: Run target tests**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: PASS.

### Task 4: Verification And Closeout

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Browser smoke**

Run dev server and fetch `/data-quality`. Confirm `缺口 owner/来源压力`, `数据管理员`, `主数据`, `DQ-202605-004`, and no-action boundary text are present.

- [ ] **Step 2: Clear current files**

Set current `stories: []` and `tasks: []` after the task is complete.

- [ ] **Step 3: Mark legacy stories/tasks done**

Mark `US548-US550`, `F388`, and `Q106` as done in legacy traceability docs.

- [ ] **Step 4: Run final verification**

Run:

```bash
node --test scripts/tests/data-quality.test.mjs
node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs
bash scripts/check-state.sh --strict
git diff --check
bash scripts/check.sh
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add app/data-quality/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs/PROJECT_STATE.md docs/audit-report.md docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/current/STORY_QUEUE.yaml docs/dev/branch-log.md docs/raw-requirements.md docs/registry/TRACE_INDEX.yaml docs/task-log.md docs/user-stories.md tasks/backlog.yaml docs/superpowers/plans/2026-05-26-data-quality-owner-source-pressure.md docs/superpowers/specs/2026-05-26-data-quality-owner-source-pressure-design.md
git commit -m "F388-Q106 add data quality owner source pressure"
```
