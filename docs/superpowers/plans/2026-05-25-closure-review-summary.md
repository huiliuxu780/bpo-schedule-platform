# Closure Review Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only supervisor closure review summary to the fulfillment calendar group-day exception panel.

**Architecture:** Extend `FulfillmentGroupMatrix` with `closureReviewSummary`, derived from the current exception queue, review outcome preview, closure checklist, evidence summary, and open risk fields. Render it in the existing group-day sidebar after closure risk explanation and before risk trend, without adding routes, navigation, backend contracts, persistence, or write actions.

**Tech Stack:** Next.js app router, React server components, TypeScript local model helpers, Node test runner.

---

### Task 1: Closure Review Summary Model And Panel

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`
- Modify: `app/person-timeline/page.tsx`

- [x] **Step 1: Write the failing test**

Add a source-order assertion for `<ClosureReviewSummaryPanel summary={matrix.closureReviewSummary} />` between closure risk explanation and risk trend, and add a deep model assertion for `matrix.closureReviewSummary`.

- [x] **Step 2: Run test to verify it fails**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: FAIL because `closureReviewSummary` is `undefined` and the component is missing from the page source.

- [x] **Step 3: Write minimal implementation**

Add `FulfillmentClosureReviewSummary` types, derive the summary from existing exception queue fields, and render a read-only `ClosureReviewSummaryPanel`.

- [x] **Step 4: Run test to verify it passes**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: PASS with 13 tests.

### Task 2: Harness Traceability And Verification

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`

- [x] **Step 1: Seed current executable state**

Add `US461-US463` and `F351-F352/Q077` as in-progress local frontend/QA work.

- [x] **Step 2: Record completed traceability**

Add `R450-R453`, `US461-US463`, `F351-F352/Q077`, trace index entries, task log, audit report, branch log, and project context updates.

- [x] **Step 3: Clear current executable state**

Restore `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml` to empty after implementation.

- [x] **Step 4: Run final verification**

Run: `bash scripts/check-state.sh --strict`, browser smoke for the group-day page, and `bash scripts/check.sh`.

Expected: all checks pass before local commit.
