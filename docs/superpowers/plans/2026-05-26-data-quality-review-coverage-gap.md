# Data Quality Review Coverage Gap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data quality review coverage gap summary to the existing data quality overview.

**Architecture:** Extend `lib/data-quality.ts` with a pure summary function that compares existing review-path issue links with impacted-exception top issues. Render the result as one compact card in `app/data-quality/page.tsx`, reusing existing UI components and no new dependencies.

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

- [ ] **Step 1: Add F387/Q105 ready state**

Use `US545-US547`, `R562-R565`, `F387`, and `Q105`.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: `check-state passed in strict mode.`

### Task 2: Write Failing Tests

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add import**

Add `summarizeDataQualityReviewCoverageGap` to the existing import from `../../lib/data-quality.ts`.

- [ ] **Step 2: Add model tests**

Add tests that assert:

- fallback headline is `还有 1 个影响异常的数据质量问题未进入当前复核路径`
- total impacted issue count is `2`
- covered issue count is `1`
- gap issue count is `1`
- first gap is `DQ-202605-004 / 人员绑定缺失`
- first gap href is `/data-quality/DQ-202605-004`
- gap fields include `agent_binding.employee_id`
- gap people include `A-9931`
- deferred actions keep the slice read-only
- empty input returns an all-covered empty state

- [ ] **Step 3: Add page source assertions**

Assert `app/data-quality/page.tsx` contains:

- `summarizeDataQualityReviewCoverageGap`
- `复核覆盖缺口摘要`
- `查看缺口问题`

- [ ] **Step 4: Verify red**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: fail because `summarizeDataQualityReviewCoverageGap` is not exported.

### Task 3: Implement Model

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] **Step 1: Add types**

Add `DataQualityReviewCoverageGapItem` and `DataQualityReviewCoverageGapSummary`.

- [ ] **Step 2: Add summary function**

Implement `summarizeDataQualityReviewCoverageGap(rows)` by comparing review-path covered issue IDs with impacted-exception top issues.

- [ ] **Step 3: Verify green**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 4: Implement UI

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] **Step 1: Import and compute gap summary**

Import `summarizeDataQualityReviewCoverageGap` and compute `reviewCoverageGap`.

- [ ] **Step 2: Add card**

Add a `复核覆盖缺口摘要` card near existing data-quality review cards.

- [ ] **Step 3: Verify model/source tests**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 5: Verify and Close

**Files:**
- Modify: traceability and audit files under `docs/**`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Run page smoke**

Start dev server and request `/data-quality`. Confirm HTML contains:

- `复核覆盖缺口摘要`
- `还有 1 个影响异常的数据质量问题未进入当前复核路径`
- `DQ-202605-004`
- `人员绑定缺失`
- `agent_binding.employee_id`
- `A-9931`
- `查看缺口问题`
- `无真实数据修复`
- `无导出或批量处理`

- [ ] **Step 2: Close current state**

Set current queue and active tasks back to empty. Mark F387/Q105 and US545-US547 done in traceability files.

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
git add app/data-quality/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs/PROJECT_STATE.md docs/audit-report.md docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/current/STORY_QUEUE.yaml docs/dev/branch-log.md docs/raw-requirements.md docs/registry/TRACE_INDEX.yaml docs/task-log.md docs/user-stories.md tasks/backlog.yaml docs/superpowers/plans/2026-05-26-data-quality-review-coverage-gap.md docs/superpowers/specs/2026-05-26-data-quality-review-coverage-gap-design.md
git commit -m "F387-Q105 add data quality review coverage gap"
```
