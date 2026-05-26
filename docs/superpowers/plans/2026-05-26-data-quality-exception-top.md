# Data Quality Exception Top Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only “影响异常 Top” aggregation to the data quality overview.

**Architecture:** Add a focused summary function in the existing data quality model, then render it in the current `/data-quality` route. The feature uses only existing local data fields.

**Tech Stack:** TypeScript, Next.js App Router, existing shadcn/ui primitives, Node test runner.

---

### Task 1: Model Contract

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`
- Modify: `lib/data-quality.ts`

- [ ] **Step 1: Write the failing model test**

Assert that `summarizeDataQualityExceptionTop(fallbackDataQualityIssues)` returns total impacted exception count, impacted people count, the top issue, ranked items, hrefs, and deferred actions.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: FAIL because the summary function is not exported.

- [ ] **Step 3: Implement the model**

Add types and `summarizeDataQualityExceptionTop()` in `lib/data-quality.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: PASS.

### Task 2: Page Display

**Files:**
- Modify: `app/data-quality/page.tsx`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add source assertion**

Assert that the page imports and renders the Top summary.

- [ ] **Step 2: Render the card**

Add an “影响异常 Top” card to `/data-quality` with totals, ranked issue rows, next view hint, and deferred actions.

- [ ] **Step 3: Run target tests**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: PASS.

### Task 3: Verification And Closeout

**Files:**
- Modify: `docs/**`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Run route smoke**

Start the dev server, fetch `/data-quality`, and confirm the HTML contains the Top summary copy.

- [ ] **Step 2: Complete docs**

Move current story/task state to done history, update audit/task/branch/project state, and keep current queue empty.

- [ ] **Step 3: Run final verification**

Run:

```bash
bash scripts/check-state.sh --strict
git diff --check
bash scripts/check.sh
```

Expected: all commands pass.

- [ ] **Step 4: Commit**

Run:

```bash
git add app/data-quality/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs tasks/backlog.yaml
git commit -m "F379-Q097 add data quality exception top"
```
