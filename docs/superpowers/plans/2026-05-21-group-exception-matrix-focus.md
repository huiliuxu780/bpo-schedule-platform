# Group Exception Matrix Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the selected group exception visibly locate the related member row and timeline slices in the existing group member single-day matrix.

**Architecture:** Keep the feature inside the existing `/person-timeline?team=...&group=...&date=...` route. Add `focusEventIds` to each matrix exception queue item in `lib/person-timeline.ts`, derived from the selected employee's involved tracks and exception time range. Use those IDs in `app/person-timeline/page.tsx` to highlight the selected member row and matching schedule/login/status bars.

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

- [x] Add `R239-R241`, `US251-US253`, and `F190-F192`.
- [x] Set current story queue and active tasks to ready.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Model Test

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [x] Assert that queue item `A-1001::no_login` exposes focus event IDs for the matching schedule, login, and status slices.
- [x] Assert that queue item `A-1002::late_login` exposes focus event IDs for the schedule and login slices.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm the test fails because `focusEventIds` is missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [x] Add `focusEventIds` to `FulfillmentMatrixExceptionQueueItem`.
- [x] Build focus event IDs from the member's involved tracks and exception time range.
- [x] Treat touching boundary ranges as focusable so late-login highlights both the scheduled slice and the actual login start.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm tests pass.

### Task 4: UI Matrix Focus

**Files:**
- Modify: `app/person-timeline/page.tsx`

- [x] Pass the selected queue item into each member matrix row.
- [x] Highlight the selected employee row.
- [x] Highlight track bars whose event IDs are in `selected.focusEventIds`.
- [x] Show a small business label on the selected row indicating the current exception window.
- [x] Run `npm run lint` and `npm run typecheck`.

### Task 5: Browser Smoke

**Files:**
- No additional files unless a visible copy issue is found.

- [x] Open group single-day matrix with `queue=status`.
- [x] Confirm selected row and related track bars are visibly highlighted for `A-1001`.
- [x] Switch to `queue=high` and confirm selected row and related track bars move to `A-1002`.
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

- [x] Mark `US251-US253/F190-F192` done in legacy docs.
- [x] Clear current story queue and active tasks.
- [x] Append task, branch, and audit evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check.sh`.
- [x] Commit the verified scope locally.
