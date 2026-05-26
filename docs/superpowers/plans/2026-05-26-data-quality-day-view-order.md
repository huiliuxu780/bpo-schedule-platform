# Data Quality Day View Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data quality impacted-day view order to the existing data quality overview.

**Architecture:** Extend `lib/data-quality.ts` with a pure summary function that groups impacted quality issues by business date. Render the result as a compact card in `app/data-quality/page.tsx`, using existing UI components and no new dependencies.

**Tech Stack:** Next.js App Router, TypeScript, React, existing shadcn-style UI components, Node test runner.

---

### Task 1: Seed Harness State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] **Step 1: Add F383/Q101 ready state**

Use `US533-US535`, `R546-R549`, `F383`, and `Q101`.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: `check-state passed in strict mode.`

### Task 2: Write Failing Tests

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add import**

Add `summarizeDataQualityDayViewOrder` to the existing import from `../../lib/data-quality.ts`.

- [ ] **Step 2: Add model tests**

Add tests that assert:

- fallback summary has one date, `2026-05-11`
- total impacted exceptions is `2`
- total impacted people is `2`
- top date representative issue is `DQ-202605-010`
- top date representative cause is `status_overlap`
- top date href is `/person-timeline/A-1002?date=2026-05-11`
- empty input returns zero counts and empty items

- [ ] **Step 3: Add page source assertions**

Assert `app/data-quality/page.tsx` contains:

- `summarizeDataQualityDayViewOrder`
- `履约日期查看顺序`
- `查看履约日期`

- [ ] **Step 4: Verify red**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: fail because `summarizeDataQualityDayViewOrder` is not exported.

### Task 3: Implement Model

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] **Step 1: Add types**

Add `DataQualityDayViewOrderItem` and `DataQualityDayViewOrderSummary`.

- [ ] **Step 2: Add summary function**

Implement `summarizeDataQualityDayViewOrder(rows)` by grouping issues with impacted exceptions by business date.

- [ ] **Step 3: Add helpers**

Add date extraction helpers using `date=YYYY-MM-DD`, labels containing `YYYY-MM-DD`, and affected-object IDs containing `YYYY-MM-DD`.

- [ ] **Step 4: Verify green**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 4: Implement UI

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] **Step 1: Import and compute summary**

Import `summarizeDataQualityDayViewOrder` and compute `dayViewOrderSummary`.

- [ ] **Step 2: Add card**

Add a `履约日期查看顺序` card near existing data-quality impact cards.

- [ ] **Step 3: Verify model/source tests**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 5: Verify and Close

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Run page smoke**

Start dev server and request `/data-quality`. Confirm HTML contains:

- `履约日期查看顺序`
- `2026-05-11`
- `DQ-202605-010`
- `status_overlap`
- `查看履约日期`
- `无真实数据修复`
- `无导出或批量处理`

- [ ] **Step 2: Close current state**

Set current queue and active tasks back to empty. Mark F383/Q101 and US533-US535 done in legacy traceability files.

- [ ] **Step 3: Final verification**

Run:

```bash
node --test scripts/tests/data-quality.test.mjs
node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs
bash scripts/check-state.sh --strict
git diff --check
bash scripts/check.sh
```

Expected: every command exits 0.

- [ ] **Step 4: Commit**

```bash
git add app/data-quality/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs/PROJECT_STATE.md docs/audit-report.md docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/current/STORY_QUEUE.yaml docs/dev/branch-log.md docs/raw-requirements.md docs/registry/TRACE_INDEX.yaml docs/task-log.md docs/user-stories.md tasks/backlog.yaml docs/superpowers/plans/2026-05-26-data-quality-day-view-order.md docs/superpowers/specs/2026-05-26-data-quality-day-view-order-design.md
git commit -m "F383-Q101 add data quality day view order"
```
