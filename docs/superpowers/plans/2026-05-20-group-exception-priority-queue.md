# Group Exception Priority Queue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a supervisor-facing priority queue for all exceptions in the existing group member single-day matrix.

**Architecture:** Keep the feature inside the existing `/person-timeline?team=...&group=...&date=...` route. Expose a sorted matrix-level exception queue from `lib/person-timeline.ts`, then render that queue inside the existing right-side exception panel. Selection remains driven by the existing `exception=employeeId::anomalyCode` query parameter.

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

- [x] Add `R233-R235`, `US245-US247`, and `F184-F186`.
- [x] Set current story queue and active tasks to ready.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Model Test

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [x] Assert that `getFulfillmentMatrix(..., 2026-05-11)` exposes `exceptionQueue`.
- [x] Assert the queue item includes `key`, employee identity, time range, title, priority, impact hours, and personal detail target context.
- [x] Assert the queue is sorted by priority, impact hours, then employee ID.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm the test fails because `exceptionQueue` is missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [x] Add `FulfillmentMatrixExceptionQueueItem`.
- [x] Add `exceptionQueue` to `FulfillmentGroupMatrix`.
- [x] Build queue from members' `exceptionExplanations`.
- [x] Sort queue by priority rank, descending impact hours, then employee ID.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm tests pass.

### Task 4: UI Queue

**Files:**
- Modify: `app/person-timeline/page.tsx`

- [x] Use `matrix.exceptionQueue` to select the current exception.
- [x] Render a `待关注异常` queue above the current exception detail.
- [x] Highlight the selected queue item.
- [x] Keep the personal detail link.
- [x] Run `npm run lint` and `npm run typecheck`.

### Task 5: Browser Smoke

**Files:**
- No additional files unless a visible copy issue is found.

- [x] Open group single-day matrix with `exception=A-1001::no_login`.
- [x] Confirm the panel shows `待关注异常`, all queue item fields, selected highlight, current detail, and personal detail link.
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

- [x] Mark `US245-US247/F184-F186` done in legacy docs.
- [x] Clear current story queue and active tasks.
- [x] Append task, branch, and audit evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check.sh`.
- [x] Commit the verified scope locally.
