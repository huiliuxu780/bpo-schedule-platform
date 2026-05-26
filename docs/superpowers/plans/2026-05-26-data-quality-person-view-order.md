# Data Quality Person View Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a local read-only impacted-person view order on the data quality overview page.

**Architecture:** Reuse existing data quality impact helpers and person IDs extracted from affected objects and impact links. Add one summary helper for person-level view order, then render the top people on the existing overview route.

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

- [x] **Step 1: Register `US530-US532`, `F382/Q100`, and `R542-R545`**

Use ready current entries for `US530-US532`, matching active tasks `F382/Q100`, and legacy traceability entries.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: current queue and active tasks are consistent.

### Task 2: Red Test

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add failing tests for `summarizeDataQualityPersonViewOrder()`**

Expected assertions:
- Summary has two impacted people from fallback data.
- Top person is `A-1002`.
- Top person has representative cause `status_overlap`, representative issue `DQ-202605-010`, href `/person-timeline/A-1002?date=2026-05-11`, and next view hint containing `个人履约`.
- Empty summary returns zero counts and no items.
- Page source contains `人员履约查看顺序`.

- [ ] **Step 2: Verify red**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: fail because `summarizeDataQualityPersonViewOrder` is not exported.

### Task 3: Model And Page

**Files:**
- Modify: `lib/data-quality.ts`
- Modify: `app/data-quality/page.tsx`

- [ ] **Step 1: Implement model helper**

Add `DataQualityPersonViewOrderSummary`, `DataQualityPersonViewOrderItem`, and `summarizeDataQualityPersonViewOrder(rows)`.

- [ ] **Step 2: Render overview card**

Show impacted people, causes, exceptions, representative cause, representative issue, next view hint, and personal fulfillment link.

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

Expected HTML contains `人员履约查看顺序`, `A-1002`, `status_overlap`, `DQ-202605-010`, `查看个人履约`, and deferred-action text.

- [ ] **Step 2: Mark F382/Q100 done and clear current queue**

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
- `git commit -m "F382-Q100 add data quality person view order"`
