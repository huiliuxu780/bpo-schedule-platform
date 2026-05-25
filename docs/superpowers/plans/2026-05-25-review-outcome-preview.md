# Review Outcome Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add a local, display-only supervisor review outcome preview to the existing fulfillment calendar group-day exception panel.

**Architecture:** Extend each existing `FulfillmentMatrixExceptionQueueItem` with a derived `reviewOutcomePreview` built from the selected exception's current judgment, evidence summary, closure checklist, data quality links, and risk context. Render one compact card in the existing selected-exception panel without adding write actions, routes, dependencies, or backend contracts.

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

- [x] Add `US430-US433` and `F328-F330/Q069` as the current ready execution chain.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Expected: strict state check passes with ready stories matched to active tasks.

### Task 2: Review Outcome Preview Model

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [x] Add a failing test that expects selected exceptions to expose `reviewOutcomePreview` with suggested outcome, evidence summary, open risk, confidence, next review point, and source references.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing `reviewOutcomePreview`.
- [x] Add the type and builder using existing local exception context only.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`; expected GREEN.

### Task 3: Review Outcome Preview Card

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [x] Add a failing source-order test that expects `<SelectedExceptionReviewOutcomePreviewCard selected={selected} />` before the existing closure checklist and after selected comparison cards.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing card.
- [x] Render a display-only card with suggested outcome, confidence, evidence summary, open risk, next review point, and source references.
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

- [x] Clear current story queue and active tasks after implementation verification.
- [x] Record completed scope, no-action boundaries, branch evidence, and verification evidence.
- [x] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [x] Run `node --test scripts/tests/product-ui-copy-audit.test.mjs`.
- [x] Run `node --test scripts/tests/product-navigation-business-only.test.mjs`.
- [x] Run `git diff --check`.
- [x] Run `bash scripts/check-state.sh --strict`.
- [x] Run `bash scripts/check.sh`.
- [x] Commit with message `F328-F330 add review outcome preview`.
