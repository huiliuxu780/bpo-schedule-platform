# Roster Draft Demo Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visible `/roster-drafts` demo loop that generates a monthly roster draft from local configurable data, then shows month and week views plus pending employees, exceptions, filtered annotations, and coverage summary.

**Architecture:** Keep IM285 frontend-only: `lib/roster-drafts.ts` owns deterministic generation and view models, `lib/roster-draft-fixtures.ts` owns local configurable demo data, and `components/roster-draft-workbench.tsx` renders the interactive month/week experience. The Next page reads the selected month from URL search params and calls the TypeScript generator without API, DB, persistence, or Python bridging.

**Tech Stack:** Next.js App Router, React client component for month/week switching, existing shadcn/ui Card/Table/Tabs/Select/Badge/Button primitives, Node structure/model tests, existing Harness checks.

---

### Task 1: Generator Model And Fixture

**Files:**
- Create: `lib/roster-draft-fixtures.ts`
- Create: `lib/roster-drafts.ts`
- Create: `scripts/tests/roster-draft-generation-model.test.mjs`

- [ ] **Step 1: Write failing model tests**

Run: `node --test scripts/tests/roster-draft-generation-model.test.mjs`

Expected first failure: module or exported function is missing.

- [ ] **Step 2: Implement local fixture and generator**

Implement employees, teams, shift types, source roster assignments, target months, and `generateRosterDraftViewModel({ targetMonth })`.

Required behavior:
- uses previous-week same-weekday source rows first
- copies only stable `shift` assignments
- marks copied cells as `copied`
- puts new employees or missing source patterns into pending rows
- lists invalid shift codes and filtered non-shift annotations as read-only findings
- produces month days, weeks, week details, and coverage summary

- [ ] **Step 3: Re-run model tests**

Run: `node --test scripts/tests/roster-draft-generation-model.test.mjs`

Expected: pass.

### Task 2: Workbench UI

**Files:**
- Create: `components/roster-draft-workbench.tsx`
- Create: `app/roster-drafts/page.tsx`
- Modify: `components/app-sidebar.tsx`
- Create: `scripts/tests/roster-draft-workbench-structure.test.mjs`

- [ ] **Step 1: Write failing structure tests**

Run: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs`

Expected first failure: page/component files or required labels are missing.

- [ ] **Step 2: Implement page and client workbench**

Use existing `AppShell`, `WorkbenchPageHeader`, `MetricCard`, shadcn cards, table, select, tabs, badges, and buttons. Add `/roster-drafts` navigation under `计划与排班`.

Required UI:
- target month select and generate link/button
- month view table with sticky employee column and full target month columns
- cell content shows shift code plus status marker
- week tabs/selector and week detail rows with source date, interval, status, and reason
- read-only pending employee list
- read-only exception list
- read-only filtered annotation list
- coverage summary cards

- [ ] **Step 3: Re-run structure tests**

Run: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs`

Expected: pass.

### Task 3: Traceability And Final Verification

**Files:**
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`

- [ ] **Step 1: Record IM285 traceability**

Add R953 / US873 / IM285 anchors and audit evidence for the visible roster draft demo loop.

- [ ] **Step 2: Run focused verification**

Run:
- `node --test scripts/tests/roster-draft-generation-model.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs`
- `git diff --check`
- `bash scripts/check-state.sh --strict`

- [ ] **Step 3: Run full Gate**

Run: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`

Expected: strict state check, Node tests, lint, typecheck, Next build, backend tests, and Harness check pass.

- [ ] **Step 4: Browser smoke visible UI**

Run local dev server if needed, open `/roster-drafts`, and verify the page renders month view, week view, pending list, exception list, and filtered annotation list.

- [ ] **Step 5: Commit**

Commit message: `feat: add roster draft demo loop`.

---

## Self-Review

- Spec coverage: covers the confirmed IM285 decisions: local fixture, previous-week same-weekday copy, month/week views, status markers, read-only exception and pending lists, no API/DB/save.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: all planned files use the `roster-draft` naming family and one public generator entrypoint.
