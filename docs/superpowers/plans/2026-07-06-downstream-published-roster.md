# Downstream Published Roster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a downstream read-only published roster entry where team leads and frontline staff can consume the latest formal monthly roster after the scheduler publishes or republishes it.

**Architecture:** Keep the source of truth as the existing current published roster API from IM296-IM298. Add a small pure view-model helper for converting published cells plus the existing roster fixture month calendar into downstream team and personal month/week rows, then render a client viewer under a new `/published-roster` route. The page is read-only and role-facing; it does not add auth, permissions, approval, request submission, export, batch, forecasting, standard capacity, Excel import, or new persistence.

**Tech Stack:** Next.js App Router, React client component, existing shadcn/ui primitives, existing local roster fixture/generator, existing roster current-published API, Node structure/model tests, existing Harness checks.

---

### Task 1: Current Task State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Create: `docs/superpowers/plans/2026-07-06-downstream-published-roster.md`

- [x] **Step 1: Write current story and active task**

Record R967 / US887 / IM299 as the current in-progress story and task, including allowed files, forbidden files, and role-facing acceptance.

### Task 2: View Model Tests And Helper

**Files:**
- Create: `scripts/tests/published-roster-view-model.test.mjs`
- Create: `lib/published-roster-view.ts`

- [ ] **Step 1: Write failing view-model tests**

Run: `node --test scripts/tests/published-roster-view-model.test.mjs`

Expected first failure: `lib/published-roster-view.ts` is missing.

- [ ] **Step 2: Implement minimal view-model helper**

Implement typed helpers that:
- accept existing generated roster month/weeks and current published cells
- build team-lead rows for the fixed local team
- build frontline rows for one selected employee
- keep empty state when no current formal roster exists
- expose cell details with shift code, interval, employee, date, team, version, and non-submittable request actions

- [ ] **Step 3: Re-run model tests**

Run: `node --test scripts/tests/published-roster-view-model.test.mjs`

Expected: pass.

### Task 3: Page, Navigation, And Structure Tests

**Files:**
- Create: `scripts/tests/published-roster-viewer-structure.test.mjs`
- Create: `app/published-roster/page.tsx`
- Create: `components/published-roster-viewer.tsx`
- Modify: `components/app-sidebar.tsx`

- [ ] **Step 1: Write failing structure tests**

Run: `node --test scripts/tests/published-roster-viewer-structure.test.mjs`

Expected first failure: page/component files or required labels are missing.

- [ ] **Step 2: Implement route, viewer, and navigation**

Implement:
- `/published-roster?month=2026-08`
- sidebar item named `正式班表`
- local role switch for `小组长` and `一线`
- fixed team sample for team lead
- person selector for frontline
- month/week switch
- read-only detail drawer or panel
- disabled request action placeholders: `请假`, `换班`, `异常修复`
- formal-roster empty state when the API returns missing

- [ ] **Step 3: Re-run structure tests**

Run: `node --test scripts/tests/published-roster-viewer-structure.test.mjs`

Expected: pass.

### Task 4: Verification, Browser Smoke, Traceability, Commit

**Files:**
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/registry/DECISION_INDEX.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`

- [ ] **Step 1: Run focused checks**

Run:
- `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs`
- `npm run typecheck`
- `git diff --check`
- `bash scripts/check-state.sh --strict`

- [ ] **Step 2: Browser smoke**

Run local backend/frontend if needed and verify:
- no formal roster shows the formal empty state
- after scheduler publish/republish, `/published-roster?month=2026-08` shows the formal roster
- team lead can switch month/week and open read-only detail
- frontline can select a person and see only that person's roster
- request actions are visible but disabled

- [ ] **Step 3: Traceability and final gate**

Record completion evidence, clear current queue, update registry indexes, then run:

`BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`

- [ ] **Step 4: Commit**

Commit message: `feat: add downstream published roster view`

---

## Self-Review

- Spec coverage: covers all confirmed IM299 decisions: independent formal roster entry, team-lead and frontline role views, current-formal-only source, month/week views, read-only detail, disabled request placeholders, navigation, and explicit non-goals.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: new view helper and viewer use the `published-roster` naming family; API source remains the existing roster current-published endpoint.
