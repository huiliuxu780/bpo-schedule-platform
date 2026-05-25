# Handling Readiness Narrative Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local-only handling readiness narrative to the existing fulfillment calendar group-day exception panel.

**Architecture:** Extend `FulfillmentGroupMatrix` with `handlingReadinessNarrative`, derived from the current exception queue's handling guide, closure checklist, evidence summary, and impact scope. Render one compact read-only card after the supervisor priority summary and before risk trend.

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

- [x] Add `US446-US449` and `F340-F342/Q073` as the current ready execution chain.
- [x] Keep the scope local frontend only: existing route, existing data, no page, no navigation, no backend, no database, no real integration, no permission, no approval, no export, no batch, no automatic scheduling, no production formula.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: Model TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [x] Add a failing assertion for `matrix.handlingReadinessNarrative`.
- [x] Expected model fields: headline, readyCount, blockedCount, evidenceLineCount, leadItem, preparationSteps, and items.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because `handlingReadinessNarrative` is missing.
- [x] Add `FulfillmentHandlingReadinessNarrative` types and `summarizeHandlingReadinessNarrative(queue)`.
- [x] Sort narrative items by blocker count, escalation, priority, impact hours, and employee id.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 3: UI TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [x] Add a failing source-order assertion that `HandlingReadinessNarrativePanel` appears after `SupervisorPrioritySummaryPanel` and before `TeamDayRiskTrendPanel`.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because the card is missing.
- [x] Add `HandlingReadinessNarrativePanel` with title `处理准备叙事`.
- [x] Show headline, lead item, preparation steps, evidence status, blocker reason, impact scope, and top two narrative items.
- [x] Do not render action buttons or write-oriented copy.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 4: QA and Closeout

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
- [x] Run browser smoke on `/person-timeline` group-day matrix and verify the card title, headline, lead item, preparation steps, and placement before risk trend.
- [x] Clear current story queue and active tasks after implementation verification.
- [x] Mark `F340-F342/Q073` and `US446-US449` done in backlog and user stories.
- [x] Record completed scope, no-action boundaries, branch evidence, and verification evidence.
- [x] Run final `bash scripts/check.sh`.
- [x] Commit with message `F340-F342 add handling readiness narrative`.
