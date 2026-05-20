# Group Member Week Matrix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a group member week matrix between group week view and group member single-day matrix.

**Architecture:** Keep `/person-timeline` as the only fulfillment calendar entry. Query `team + group` without `date` renders the group member week matrix; query `team + group + date` keeps the existing group member day matrix. Employee names link to personal week calendar, and day cells link to personal single-day three-track detail.

**Tech Stack:** Next.js App Router, existing shadcn/ui components, local `lib/person-timeline.ts` model, Node test runner.

---

### Task 1: Harness State

**Files:**
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] Add `R220`, `US232`, and `F171`.
- [ ] Set current story and active task to `ready`.
- [ ] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Test

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [ ] Add a failing test for `getFulfillmentGroupMemberWeekMatrix()`.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm failure because the function is missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [ ] Add group member week matrix types.
- [ ] Implement `getFulfillmentGroupMemberWeekMatrix(teamId, groupId, rows, weekStart)`.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 4: UI Flow

**Files:**
- Modify: `app/person-timeline/page.tsx`

- [ ] Render group member week matrix for `team + group` without `date`.
- [ ] Keep existing member day matrix for `team + group + date`.
- [ ] Link employee name to personal week calendar.
- [ ] Link week matrix cells to personal single-day detail.

### Task 5: Verification And Closeout

**Files:**
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/task-log.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] Browser smoke group week -> group member week matrix -> day matrix -> personal detail.
- [ ] Mark `US232/F171` done and clear current queue.
- [ ] Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit the verified scope locally.
