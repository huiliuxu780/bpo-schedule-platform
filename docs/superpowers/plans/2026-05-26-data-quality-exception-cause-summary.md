# Data Quality Exception Cause Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a local read-only impacted-exception cause summary on the data quality overview page.

**Architecture:** Reuse existing `DataQualityIssue` data plus the single-issue exception impact helper. Add a grouped summary helper that rolls impacted issues up by error code, source field, and source, then render the top groups on the existing overview route.

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

- [x] **Step 1: Register `US527-US529`, `F381/Q099`, and `R538-R541`**

Use ready current entries for `US527-US529`, matching active tasks `F381/Q099`, and legacy traceability entries.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: current queue and active tasks are consistent.

### Task 2: Red Test

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add failing tests for `summarizeDataQualityExceptionCauses()`**

Expected assertions:
- Summary has two cause groups from fallback data.
- Top cause is `status_overlap`.
- Top cause includes source `status_log`, source field `status_log.status_start_at/status_end_at`, `impactedExceptionCount = 1`, person `A-1002`, representative issue `DQ-202605-010`, and href `/data-quality/DQ-202605-010`.
- Empty summary returns zero counts and no items.
- Page source contains `异常影响原因汇总`.

- [ ] **Step 2: Verify red**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: fail because `summarizeDataQualityExceptionCauses` is not exported.

### Task 3: Model And Page

**Files:**
- Modify: `lib/data-quality.ts`
- Modify: `app/data-quality/page.tsx`

- [ ] **Step 1: Implement model helper**

Add `DataQualityExceptionCauseSummary`, `DataQualityExceptionCauseItem`, and `summarizeDataQualityExceptionCauses(rows)`.

- [ ] **Step 2: Render overview card**

Show total causes, impacted exceptions, impacted people, top cause, grouped issue rows, next view hint, and deferred actions.

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

- [ ] **Step 1: Smoke `/data-quality`**

Expected HTML contains `异常影响原因汇总`, `status_overlap`, `status_log.status_start_at/status_end_at`, `DQ-202605-010`, `A-1002`, and deferred-action text.

- [ ] **Step 2: Mark F381/Q099 done and clear current queue**

Set current `stories: []`, current `tasks: []`, and mark legacy entries done.

- [ ] **Step 3: Final verification**

Run:
- `bash scripts/check-state.sh --strict`
- `git diff --check`
- `bash scripts/check.sh`

Expected: all pass.

- [ ] **Step 4: Commit**

Run:
- `git add app/data-quality/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs/** tasks/backlog.yaml`
- `git commit -m "F381-Q099 add data quality exception cause summary"`
