# Supervisor Priority Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local-only supervisor priority summary to the existing fulfillment calendar group-day exception panel.

**Architecture:** Extend the existing `FulfillmentGroupMatrix` model with a derived `supervisorPrioritySummary` built from the current exception queue. Render one new compact card in `app/person-timeline/page.tsx` near the other supervisor decision summaries, preserving the no-action boundary and existing route.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript model helpers, Node test runner, existing shadcn/ui-style primitives.

---

### Task 1: Seed Harness State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [x] Add `US442-US445` and `F337-F339/Q072` as the current ready execution chain.
- [x] Keep the scope local frontend only: existing route, existing data, no page, no navigation, no backend, no database, no real integration, no permission, no approval, no export, no batch, no automatic scheduling, no production formula.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: Model TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [x] Add a failing assertion for `matrix.supervisorPrioritySummary`.
- [x] Expected model fields: headline, topFocus, totalImpactHours, highPriorityCount, blockedCount, escalationCount, focusReasons, and orderedItems.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because `supervisorPrioritySummary` is missing.
- [x] Add `FulfillmentSupervisorPrioritySummary` types and `summarizeSupervisorPrioritySummary(queue)`.
- [x] Sort ordered items by high priority, escalation, blocker count, impact hours, impacted comparison count, and employee id.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 3: UI TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [x] Add a failing source-order assertion that `SupervisorPrioritySummaryPanel` appears after `ExceptionImpactPriorityPanel` and before `TeamDayRiskTrendPanel`.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because the card is missing.
- [x] Add `SupervisorPrioritySummaryPanel` with title `主管优先级总览`.
- [x] Show headline, top focus, high-priority count, blocked count, escalation count, total impact hours, focus reasons, and top two ordered items.
- [x] Do not render action buttons or write-oriented copy.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 4: Copy, QA, and Closeout

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/user-stories.md`

- [x] Run `node --test scripts/tests/product-ui-copy-audit.test.mjs`.
- [x] Run `node --test scripts/tests/product-navigation-business-only.test.mjs`.
- [x] Run `npm run typecheck`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run browser smoke on `/person-timeline` group-day matrix and verify the card title, headline, counts, top focus, and placement before risk trend.
- [x] Clear current story queue and active tasks after implementation verification.
- [x] Mark `F337-F339/Q072` and `US442-US445` done in backlog and user stories.
- [x] Record completed scope, no-action boundaries, branch evidence, and verification evidence.
- [x] Run final `bash scripts/check.sh`.
- [x] Commit with message `F337-F339 add supervisor priority summary`.
