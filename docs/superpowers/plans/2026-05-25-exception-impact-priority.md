# Exception Impact Priority Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local, display-only prioritization summary for fulfillment exceptions with the broadest impact scope.

**Architecture:** Extend the existing fulfillment group-day matrix with `exceptionImpactPriority`, derived from current exception queue items, `dataQualityImpactScope`, impact hours, priority, aging, and closure blockers. Render one compact card in the existing group-day exception panel without adding routes, dependencies, backend contracts, writes, or real handling actions.

**Tech Stack:** Next.js App Router, TypeScript, existing shadcn/ui components, Node test runner.

---

### Task 1: Seed Harness State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [x] Add `US438-US441` and `F334-F336/Q071` as the current ready execution chain.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Expected: strict state check passes with ready stories matched to active tasks.

### Task 2: Exception Impact Priority Model

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [ ] Add a failing test that expects `matrix.exceptionImpactPriority` to include headline, total impact hours, top item, impacted objects, impacted comparisons, blocker count, priority reason, and ranked items.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing `exceptionImpactPriority`.
- [ ] Add the type and builder using existing exception queue fields only.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected GREEN.

### Task 3: Exception Impact Priority Card

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [ ] Add a failing source-order test that expects `<ExceptionImpactPriorityPanel priority={matrix.exceptionImpactPriority} />` after data quality impact and before risk trend.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing card.
- [ ] Render a display-only card with top exception, impacted objects, impacted comparisons, impact hours, blocker count, priority reason, and representative ranked items.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected GREEN.

### Task 4: QA Closeout

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

- [x] Clear current story queue and active tasks after implementation verification.
- [x] Mark `F334-F336/Q071` and `US438-US441` done in backlog and user stories.
- [x] Record completed scope, no-action boundaries, branch evidence, and verification evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `node --test scripts/tests/product-ui-copy-audit.test.mjs`.
- [x] Run `node --test scripts/tests/product-navigation-business-only.test.mjs`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run browser smoke on the existing group-day matrix route.
- [x] Run `bash scripts/check.sh`.
- [x] Commit with message `F334-F336 add exception impact priority`.
