# Data Quality Import Batch Impact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add local read-only data-quality to import-batch reverse aggregation.

**Architecture:** Extend `lib/data-quality.ts` with a pure summary function that accepts a data quality issue and import batches. Render that summary on the existing data quality detail route using existing card, badge, and button components.

**Tech Stack:** Next.js app route, TypeScript summary helpers, Node test runner, shadcn/ui cards and badges.

---

### Task 1: State And Traceability

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] Add `US515-US517`, `F377/Q095`, and `R522-R525`.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Expected: current queue has ready stories with matching active tasks.

### Task 2: Red Test

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Import `summarizeDataQualityImportBatchImpact` and `fallbackImportBatches`.
- [ ] Add tests for linked fallback batches, direct failure-row field matching, and empty state.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.
- [ ] Expected: fail because the export does not exist.

### Task 3: Model

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] Add import-batch impact types and deferred action constants.
- [ ] Implement `summarizeDataQualityImportBatchImpact(issue, batches)`.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.
- [ ] Expected: all data quality model tests pass.

### Task 4: Page

**Files:**
- Modify: `app/data-quality/[issueId]/page.tsx`

- [ ] Import `fallbackImportBatches` and the new summary function.
- [ ] Render “影响导入批次” after impact objects and impact links.
- [ ] Show summary metrics, per-batch items, review hints, and deferred actions.
- [ ] Run product copy/navigation tests and typecheck.

### Task 5: QA And Closeout

**Files:**
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] Smoke `/data-quality/DQ-202605-004` through local HTML.
- [ ] Clear current queue and active tasks after completion.
- [ ] Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit with `F377-Q095 add data quality import batch impact`.
