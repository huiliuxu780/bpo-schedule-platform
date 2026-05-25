# Closure Risk Explanation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local-only closure risk explanation card to the existing fulfillment calendar group-day exception panel.

**Architecture:** Extend `FulfillmentGroupMatrix` with `closureRiskExplanation`, derived from the existing exception queue, closure checklist, review outcome preview, data-quality impact scope, and handling guide. Render one read-only card after the supervisor decision digest and before risk trend.

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

- [x] Add `US454-US457` and `F346-F348/Q075` as the current ready execution chain.
- [x] Keep the scope local frontend only: existing route, existing data, no page, no navigation, no backend, no database, no real integration, no permission, no approval, no export, no batch, no automatic scheduling, no production formula.
- [x] Run `bash scripts/check-state.sh --strict`.

### Task 2: Model TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [x] Add a failing assertion for `matrix.closureRiskExplanation`.
- [x] Expected model fields: headline, totalRiskCount, highImpactRiskCount, nextRiskOwner, leadRisk, and risks.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because `closureRiskExplanation` is missing.
- [x] Add `FulfillmentClosureRiskExplanation` types and `summarizeClosureRiskExplanation(queue)`.
- [x] Sort risks by missing count, open risk, priority, impact hours, and employee id.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it passes.

### Task 3: UI TDD

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [x] Add a failing source-order assertion that `ClosureRiskExplanationPanel` appears after `SupervisorDecisionDigestPanel` and before `TeamDayRiskTrendPanel`.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs` and confirm it fails because the card is missing.
- [x] Add `ClosureRiskExplanationPanel` with title `闭环风险解释`.
- [x] Show headline, lead risk, cannot-close reason, business impact, missing evidence, owner role, next step, and top two risk items.
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
- [x] Run browser smoke on `/person-timeline` group-day matrix and verify the card title, headline, lead risk, missing evidence, owner role, next step, and placement before risk trend.
- [x] Clear current story queue and active tasks after implementation verification.
- [x] Mark `F346-F348/Q075` and `US454-US457` done in backlog and user stories.
- [x] Record completed scope, no-action boundaries, branch evidence, and verification evidence.
- [x] Run final `bash scripts/check.sh`.
- [x] Commit with message `F346-F348 add closure risk explanation`.
