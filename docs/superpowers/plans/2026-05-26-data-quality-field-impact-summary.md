# Data Quality Field Impact Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data quality field impact cross-summary to the existing data quality overview.

**Architecture:** Extend `lib/data-quality.ts` with a pure summary function grouping impacted quality issues by `sourceField` and `source`. Render the result as one compact card in `app/data-quality/page.tsx`, reusing existing UI components and no new dependencies.

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

- [ ] **Step 1: Add F384/Q102 ready state**

Use `US536-US538`, `R550-R553`, `F384`, and `Q102`.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: `check-state passed in strict mode.`

### Task 2: Write Failing Tests

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add import**

Add `summarizeDataQualityFieldImpactSummary` to the existing import from `../../lib/data-quality.ts`.

- [ ] **Step 2: Add model tests**

Add tests that assert:

- fallback summary has two field groups
- total impacted exceptions is `2`
- total affected dates is `1`
- total affected people is `2`
- top field is `status_log.status_start_at/status_end_at`
- top source is `status_log`
- top representative issue is `DQ-202605-010`
- top representative cause is `status_overlap`
- top href is `/data-quality/DQ-202605-010`
- empty input returns zero counts and empty items

- [ ] **Step 3: Add page source assertions**

Assert `app/data-quality/page.tsx` contains:

- `summarizeDataQualityFieldImpactSummary`
- `字段影响交叉摘要`
- `查看字段问题`

- [ ] **Step 4: Verify red**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: fail because `summarizeDataQualityFieldImpactSummary` is not exported.

### Task 3: Implement Model

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] **Step 1: Add types**

Add `DataQualityFieldImpactSummaryItem` and `DataQualityFieldImpactSummary`.

- [ ] **Step 2: Add summary function**

Implement `summarizeDataQualityFieldImpactSummary(rows)` by grouping issues with impacted exceptions by `sourceField` and `source`.

- [ ] **Step 3: Verify green**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 4: Implement UI

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] **Step 1: Import and compute summary**

Import `summarizeDataQualityFieldImpactSummary` and compute `fieldImpactSummary`.

- [ ] **Step 2: Add card**

Add a `字段影响交叉摘要` card near existing data-quality impact cards.

- [ ] **Step 3: Verify model/source tests**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 5: Verify and Close

**Files:**
- Modify: traceability and audit files under `docs/**`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Run page smoke**

Start dev server and request `/data-quality`. Confirm HTML contains:

- `字段影响交叉摘要`
- `status_log.status_start_at/status_end_at`
- `DQ-202605-010`
- `status_overlap`
- `查看字段问题`
- `无真实数据修复`
- `无导出或批量处理`

- [ ] **Step 2: Close current state**

Set current queue and active tasks back to empty. Mark F384/Q102 and US536-US538 done in legacy traceability files.

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
git add app/data-quality/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs/PROJECT_STATE.md docs/audit-report.md docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/current/STORY_QUEUE.yaml docs/dev/branch-log.md docs/raw-requirements.md docs/registry/TRACE_INDEX.yaml docs/task-log.md docs/user-stories.md tasks/backlog.yaml docs/superpowers/plans/2026-05-26-data-quality-field-impact-summary.md docs/superpowers/specs/2026-05-26-data-quality-field-impact-summary-design.md
git commit -m "F384-Q102 add data quality field impact summary"
```
