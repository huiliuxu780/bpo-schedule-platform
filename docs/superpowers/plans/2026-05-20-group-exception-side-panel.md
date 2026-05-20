# Group Exception Side Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a supervisor-facing exception explanation side panel to the existing group member single-day matrix.

**Architecture:** Keep all behavior inside the existing `/person-timeline?team=...&group=...&date=...` route. Reuse the personal daily exception explanation model, expose those explanations on group matrix members, and render a right-side panel driven by an `exception` query parameter with a sensible default. Do not add routes, sidebar entries, dependencies, backend contracts, database work, approvals, or processing submissions.

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

- [x] Add `R230-R232`, `US242-US244`, and `F181-F183`.
- [x] Set current queue and active tasks to ready.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Model Test

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [x] Assert that `getFulfillmentMatrix(..., 2026-05-11)` exposes member `exceptionExplanations`.
- [x] Assert the `A-1001/no_login` explanation is available to the group matrix.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm the test fails because group matrix members do not expose explanations yet.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [x] Add `exceptionExplanations` to `FulfillmentMatrixMember`.
- [x] Populate it from `getPersonTimelineDailyView`.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm tests pass.

### Task 4: UI Side Panel

**Files:**
- Modify: `app/person-timeline/page.tsx`

- [x] Parse `exception` query parameter for group single-day matrix.
- [x] Render a right-side exception explanation panel in `MemberMatrixSection`.
- [x] Make anomaly marker buttons update the current matrix URL with `exception=employeeId::anomalyCode`.
- [x] Include a personal detail link in the side panel.
- [x] Run `npm run lint` and `npm run typecheck`.

### Task 5: Browser Smoke

**Files:**
- No additional files unless a visible copy issue is found.

- [x] Open group single-day matrix with `exception=A-1001::no_login`.
- [x] Confirm the side panel shows time range, type, tracks, impact hours, evidence, supervisor action, priority, and personal detail link.
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

- [x] Mark `US242-US244/F181-F183` done in legacy docs.
- [x] Clear current story queue and active tasks.
- [x] Append task, branch, and audit evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check.sh`.
- [ ] Commit the verified scope locally.
