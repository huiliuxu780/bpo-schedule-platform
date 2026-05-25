# Supervisor Decision Digest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local-only supervisor decision digest to the existing fulfillment calendar group-day exception panel.

**Architecture:** Extend `FulfillmentGroupMatrix` with `supervisorDecisionDigest`, derived from each queue item's review outcome preview, closure checklist, evidence references, open risk, and next review point. Render one read-only card after the handling readiness narrative and before risk trend.

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

- [x] Add `US450-US453` and `F343-F345/Q074` as the current ready execution chain.
- [x] Keep the scope local frontend only: existing route, existing data, no page, no navigation, no backend, no database, no real integration, no permission, no approval, no export, no batch, no automatic scheduling, no production formula.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: Model TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [x] Add a failing assertion for `matrix.supervisorDecisionDigest`.
- [x] Expected model fields: headline, totalDecisionCount, mediumConfidenceCount, openRiskCount, nextReviewPoint, leadDecision, and decisions.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because `supervisorDecisionDigest` is missing.
- [x] Add `FulfillmentSupervisorDecisionDigest` types and `summarizeSupervisorDecisionDigest(queue)`.
- [x] Sort decisions by open risk, confidence, missing count, priority, impact hours, and employee id.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 3: UI TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [x] Add a failing source-order assertion that `SupervisorDecisionDigestPanel` appears after `HandlingReadinessNarrativePanel` and before `TeamDayRiskTrendPanel`.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because the card is missing.
- [x] Add `SupervisorDecisionDigestPanel` with title `主管决策摘要`.
- [x] Show headline, lead decision, confidence, open risk, next review point, source references, and top two decisions.
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
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run browser smoke on `/person-timeline` group-day matrix and verify the card title, headline, lead decision, open risk, source references, and placement before risk trend.
- [x] Clear current story queue and active tasks after implementation verification.
- [x] Mark `F343-F345/Q074` and `US450-US453` done in backlog and user stories.
- [x] Record completed scope, no-action boundaries, branch evidence, and verification evidence.
- [x] Run final `bash scripts/check.sh`.
- [x] Commit with message `F343-F345 add supervisor decision digest`.
