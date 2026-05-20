# Personal Week Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a personal week calendar layer between the group member matrix and the personal single-day three-track detail.

**Architecture:** Keep the existing `/person-timeline/[employeeId]` route. When `date` is absent, render a personal week calendar; when `date` is present, keep the current single-day three-track detail. Matrix employee-name links go to the week calendar, while anomaly links keep direct day-detail behavior.

**Tech Stack:** Next.js App Router, existing shadcn/ui components, local `lib/person-timeline.ts` fallback model, Node test runner.

---

### Task 1: Harness State

**Files:**
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] Add `R219`, `US231`, and `F170` for the personal week calendar layer.
- [ ] Set current queue and active task to `ready`.
- [ ] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Test

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [ ] Add a failing test proving `getPersonTimelineWeekView()` returns seven days, weekly totals, and a selected date.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm the new test fails because the function does not exist.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [ ] Add `PersonTimelineWeekView`.
- [ ] Add `getPersonTimelineWeekView(row, requestedDate?, weekStart?)`.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 4: UI Flow

**Files:**
- Modify: `app/person-timeline/page.tsx`
- Modify: `app/person-timeline/[employeeId]/page.tsx`

- [ ] Change matrix employee-name links to `/person-timeline/[employeeId]?team=...&group=...`.
- [ ] Keep anomaly links as `/person-timeline/[employeeId]?date=...&team=...&group=...`.
- [ ] Render personal week calendar when the detail route has no `date`.
- [ ] Keep single-day three-track detail when `date` exists.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`.

### Task 5: Verification And Closeout

**Files:**
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/task-log.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/user-stories.md`

- [ ] Run browser smoke for group matrix, personal week calendar, and personal day detail.
- [ ] Mark `F170` and `US231` done in legacy trace files and clear current queue.
- [ ] Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit the verified scope locally.
