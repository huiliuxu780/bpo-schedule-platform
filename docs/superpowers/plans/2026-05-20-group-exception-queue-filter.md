# Group Exception Queue Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add supervisor-facing summary metrics and display filters to the existing group exception queue.

**Architecture:** Keep the feature inside the existing `/person-timeline?team=...&group=...&date=...` route. Add matrix-level queue summary data in `lib/person-timeline.ts`, then render summary metrics and query-driven filters in the existing right-side exception panel. Filtering changes only the displayed queue and selected explanation; it does not create handling, approval, or persistence.

**Tech Stack:** Next.js App Router, TypeScript, existing shadcn/ui components, local `lib/person-timeline.ts`, Node test runner, in-app browser smoke.

---

### Task 1: Harness State

**Files:**
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [x] Add `R236-R238`, `US248-US250`, and `F187-F189`.
- [x] Set current story queue and active tasks to ready.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Model Test

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [x] Assert that `getFulfillmentMatrix(..., 2026-05-11)` exposes `exceptionQueueSummary`.
- [x] Assert summary includes total count, high priority count, login gap count, status mismatch count, and total impact hours.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm the test fails because `exceptionQueueSummary` is missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [x] Add `FulfillmentMatrixExceptionQueueSummary`.
- [x] Add `exceptionQueueSummary` to `FulfillmentGroupMatrix`.
- [x] Build summary from `exceptionQueue`.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm tests pass.

### Task 4: UI Summary And Filters

**Files:**
- Modify: `app/person-timeline/page.tsx`

- [x] Parse `queue` query parameter as `all`, `high`, `login`, or `status`.
- [x] Filter queue items before selecting the current exception.
- [x] Render summary metrics above the queue.
- [x] Render filter buttons and keep selection query links stable.
- [x] Run `npm run lint` and `npm run typecheck`.

### Task 5: Browser Smoke

**Files:**
- No additional files unless a visible copy issue is found.

- [x] Open group single-day matrix with `queue=high`.
- [x] Confirm summary metrics, filter buttons, filtered queue, selected explanation, and personal detail link.
- [x] Confirm switching to `queue=status` shows the status mismatch item.
- [x] Confirm product UI does not show internal process words.

### Task 6: Closeout

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/audit-report.md`

- [x] Mark `US248-US250/F187-F189` done in legacy docs.
- [x] Clear current story queue and active tasks.
- [x] Append task, branch, and audit evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check.sh`.
- [x] Commit the verified scope locally.
