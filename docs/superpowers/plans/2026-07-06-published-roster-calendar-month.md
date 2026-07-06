# Published Roster Calendar Month Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the downstream formal roster month view from an employee-by-31-days grid into a calendar overview that drives the existing weekly detail view.

**Architecture:** Keep `/published-roster` read-only and reuse the current formal roster API. Add month calendar summaries in `lib/published-roster-view.ts`, then render a 7-column calendar overview in `components/published-roster-viewer.tsx`; week detail remains the personnel grid.

**Tech Stack:** Next.js app router, React client component, existing shadcn/ui components, Node test scripts, local Harness trace files.

---

### Task 1: Calendar View Model

**Files:**
- Modify: `lib/published-roster-view.ts`
- Modify: `scripts/tests/published-roster-view-model.test.mjs`

- [ ] Step 1: Add failing tests for team-lead day summary, frontline day summary, and week lookup from a calendar date.
- [ ] Step 2: Run `node --test scripts/tests/published-roster-view-model.test.mjs` and confirm the tests fail because calendar fields are missing.
- [ ] Step 3: Add calendar-day and calendar-week structures derived from existing month days, weeks, and visible rows.
- [ ] Step 4: Re-run the model test and confirm it passes.

### Task 2: Calendar UI

**Files:**
- Modify: `components/published-roster-viewer.tsx`
- Modify: `scripts/tests/published-roster-viewer-structure.test.mjs`

- [ ] Step 1: Add failing structure tests that require `data-slot="published-roster-month-calendar"` and forbid the month mode from feeding all month days into `RosterGrid`.
- [ ] Step 2: Run `node --test scripts/tests/published-roster-viewer-structure.test.mjs` and confirm the tests fail.
- [ ] Step 3: Render the month mode as a 7-column calendar overview with day summaries; clicking a day selects its week and opens week detail.
- [ ] Step 4: Keep the week mode as the existing person/date grid and keep drawer detail read-only.
- [ ] Step 5: Run the focused published-roster tests plus typecheck.

### Task 3: Trace, Browser, Full Gate

**Files:**
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/registry/DECISION_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`

- [ ] Step 1: Register IM300 as the confirmed month-calendar correction, then clear current queue after implementation.
- [ ] Step 2: Browser-smoke `/published-roster?month=2026-08` on the local runtime and verify month view is calendar overview, week detail remains usable, and no internal English status leaks.
- [ ] Step 3: Run `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`.
- [ ] Step 4: Commit the verified scope locally.
