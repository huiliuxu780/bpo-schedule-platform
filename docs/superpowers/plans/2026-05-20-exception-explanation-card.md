# Exception Explanation Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add inline exception explanation cards to the existing personal single-day fulfillment detail.

**Architecture:** Keep the feature inside the existing `/person-timeline/[employeeId]` route. Extend the local person-timeline model with typed exception explanations derived from the existing schedule, login, status, and anomaly data; render cards below the existing three-track timeline. Do not add routes, sidebar entries, dependencies, backend contracts, database work, approvals, or processing submissions.

**Tech Stack:** Next.js App Router, TypeScript, existing shadcn/ui components, local `lib/person-timeline.ts`, Node test runner, in-app browser smoke.

---

### Task 1: Harness Current State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [x] Mark `US239-US241` and `F178-F180` ready for the confirmed Gate.
- [x] Add matching current story queue entries and active task entries.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: RED Model Test

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`

- [x] Add assertions that `getPersonTimelineDailyView(A-1001, 2026-05-11)` exposes `exceptionExplanations`.
- [x] Assert the first explanation includes type, time range, tracks, impact hours, evidence, supervisor action, and priority.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm the test fails because `exceptionExplanations` is missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/person-timeline.ts`

- [x] Add a `TimelineExceptionExplanation` type.
- [x] Add `exceptionExplanations` to `PersonTimelineDailyView`.
- [x] Build explanations from the employee's dated anomalies and daily track comparison.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm the model test passes.

### Task 4: UI Implementation

**Files:**
- Modify: `app/person-timeline/[employeeId]/page.tsx`

- [x] Replace the old simple anomaly list with exception explanation cards.
- [x] Render business fields: time range, involved tracks, impact hours, evidence, supervisor action, and priority.
- [x] Keep the cards below the three-track timeline.
- [x] Run `npm run lint` and `npm run typecheck`.

### Task 5: Matrix Entry And Browser Smoke

**Files:**
- Modify: `app/person-timeline/page.tsx` if a link label or query needs tightening.

- [x] Verify the existing small-group daily matrix anomaly marker still links to personal daily detail.
- [x] Browser smoke `/person-timeline?team=...&group=...&date=2026-05-11` to personal detail and confirm cards are visible.
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

- [x] Mark `US239-US241/F178-F180` done in legacy docs.
- [x] Clear current story queue and active tasks.
- [x] Append task, branch, and audit evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check.sh`.
- [x] Commit the verified scope locally.
