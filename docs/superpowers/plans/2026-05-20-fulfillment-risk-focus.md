# Fulfillment Risk Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add risk summary and focus controls to the existing group member week matrix.

**Architecture:** Keep all behavior under `/person-timeline`. Extend the local group member week matrix model with risk summary fields. Render summary and query-based focus controls on the existing group member week matrix; do not add routes, dependencies, backend contracts, or navigation entries.

**Tech Stack:** Next.js App Router, existing shadcn/ui components, local `lib/person-timeline.ts`, Node test runner.

---

### Task 1: Harness State

**Files:**
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [x] Add `R224-R226`, `US236-US238`, and `F175-F177`.
- [x] Set current queue and active tasks to `ready`.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Tests

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [x] Add failing assertions for risk member count, highest gap member, highest anomaly member, and highest gap date.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm failure before implementation.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [x] Add `riskSummary` to `FulfillmentGroupMemberWeekMatrix`.
- [x] Compute risk summary from member weekly summaries and day cells.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.

### Task 4: UI Implementation

**Files:**
- Modify: `app/person-timeline/page.tsx`

- [x] Add `focus` query parsing for group member week matrix.
- [x] Render focus links for all, gap, and anomaly.
- [x] Render risk summary strip.
- [x] Visually emphasize cells according to focus.

### Task 5: Verification And Closeout

**Files:**
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/task-log.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [x] Browser smoke all/gap/anomaly focus and risk summary.
- [x] Mark `US236-US238/F175-F177` done and clear current queue.
- [x] Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [x] Commit the verified scope locally.
