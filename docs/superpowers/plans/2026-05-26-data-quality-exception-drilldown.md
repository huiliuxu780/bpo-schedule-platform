# Data Quality Exception Drilldown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a local read-only impacted-exception drilldown on the data quality detail page.

**Architecture:** Reuse the existing `DataQualityIssue` affected objects and impact links. Add one model helper that summarizes a single issue, then render the summary in the existing detail route without adding routes or backend contracts.

**Tech Stack:** Next.js App Router, TypeScript frontend model helpers, Node test runner.

---

### Task 1: Harness Registration

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [x] **Step 1: Register `US524-US526`, `F380/Q098`, and `R534-R537`**

Use ready current entries for `US524-US526`, matching active tasks `F380/Q098`, and legacy traceability entries.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: current queue and active tasks are consistent.

### Task 2: Red Test

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add failing tests for `summarizeDataQualityExceptionImpact()`**

Expected assertions:
- `DQ-202605-010` returns `impactedExceptionCount = 1`.
- It includes person `A-1002`.
- It exposes primary exception `小组成员矩阵异常`.
- It includes a next view hint containing `个人履约`.
- Empty/no-impact issue returns zero counts and no items.
- Detail page source contains `影响异常拆解`.

- [ ] **Step 2: Verify red**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: fail because `summarizeDataQualityExceptionImpact` is not exported.

### Task 3: Model And Page

**Files:**
- Modify: `lib/data-quality.ts`
- Modify: `app/data-quality/[issueId]/page.tsx`

- [ ] **Step 1: Implement model helper**

Add `DataQualityExceptionImpactSummary`, `DataQualityExceptionImpactItem`, and `summarizeDataQualityExceptionImpact(issue)`.

- [ ] **Step 2: Render detail card**

Show metrics, primary exception, impacted people, affected objects, next view hint, and deferred actions.

- [ ] **Step 3: Verify green**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all data quality tests pass.

### Task 4: Smoke And Closeout

**Files:**
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: current files and backlog statuses

- [ ] **Step 1: Smoke `/data-quality/DQ-202605-010`**

Expected HTML contains `影响异常拆解`, `小组成员矩阵异常`, `A-1002`, `下一查看`, and deferred-action text.

- [ ] **Step 2: Mark F380/Q098 done and clear current queue**

Set current `stories: []`, current `tasks: []`, and mark legacy entries done.

- [ ] **Step 3: Final verification**

Run:
- `bash scripts/check-state.sh --strict`
- `git diff --check`
- `bash scripts/check.sh`

Expected: all pass.

- [ ] **Step 4: Commit**

Run:
- `git add app/data-quality/[issueId]/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs/** tasks/backlog.yaml`
- `git commit -m "F380-Q098 add data quality exception drilldown"`
