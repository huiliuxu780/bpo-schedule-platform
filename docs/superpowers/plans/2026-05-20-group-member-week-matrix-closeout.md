# Group Member Week Matrix Closeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the group member week matrix into a usable drilldown surface with correct return paths, day-level drilldown, and business summary.

**Architecture:** Keep all behavior under existing `/person-timeline` and `/person-timeline/[employeeId]` routes. Use query shape to distinguish group week matrix, group day matrix, personal week calendar, and personal day detail. Add summary fields to the local fulfillment model and render them in the existing group member week matrix.

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

- [ ] Add `R221-R223`, `US233-US235`, and `F172-F174`.
- [ ] Set current queue and active tasks to `ready`.
- [ ] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Tests

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [ ] Add assertions for group member week summary totals.
- [ ] Add assertions for business-risk sorting.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm failure before implementation.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [ ] Add group member week summary fields.
- [ ] Ensure member risk sorting is deterministic and test-backed.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`.

### Task 4: UI Implementation

**Files:**
- Modify: `app/person-timeline/page.tsx`
- Modify: `app/person-timeline/[employeeId]/page.tsx`

- [ ] Personal week calendar returns to group week matrix when there is no `returnDate`.
- [ ] Personal week calendar returns to group day matrix when `returnDate` exists.
- [ ] Group member week matrix day headers link to group day matrix.
- [ ] Group member week matrix renders business summary.

### Task 5: Verification And Closeout

**Files:**
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/task-log.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] Browser smoke return path and day-header drilldown.
- [ ] Mark `US233-US235/F172-F174` done and clear current queue.
- [ ] Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit the verified scope locally.
