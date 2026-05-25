# Data Quality Exception Impact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add a local, display-only aggregation showing which data quality issues affect the most fulfillment exceptions.

**Architecture:** Extend the existing fulfillment group-day matrix with `dataQualityExceptionImpact`, derived from the current local exception queue and its existing `dataQualityLinks`. Render one compact card in the existing group-day exception panel without adding routes, dependencies, backend contracts, writes, or real repair actions.

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

- [x] Add `US434-US437` and `F331-F333/Q070` as the current ready execution chain.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Expected: strict state check passes with ready stories matched to active tasks.

### Task 2: Data Quality Impact Model

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [x] Add a failing test that expects `matrix.dataQualityExceptionImpact` to aggregate quality issue, impacted exception count, people, impact hours, representative exceptions, reason, and quality detail href.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing `dataQualityExceptionImpact`.
- [x] Add the type and builder using existing `exceptionQueue[].dataQualityLinks` only.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`; expected GREEN.

### Task 3: Data Quality Impact Card

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [x] Add a failing source-order test that expects `<DataQualityExceptionImpactPanel impact={matrix.dataQualityExceptionImpact} />` before the selected exception detail block and before summary panels.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing card.
- [x] Render a display-only card with primary issue, impacted exceptions, impacted people, impact hours, representative exceptions, reason, and quality detail link.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`; expected GREEN.

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
- [x] Mark `F331-F333/Q070` and `US434-US437` done in backlog and user stories.
- [x] Record completed scope, no-action boundaries, branch evidence, and verification evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `node --test scripts/tests/product-ui-copy-audit.test.mjs`.
- [x] Run `node --test scripts/tests/product-navigation-business-only.test.mjs`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run browser smoke on the existing group-day matrix route.
- [x] Run `bash scripts/check.sh`.
- [x] Commit with message `F331-F333 add data quality exception impact`.
