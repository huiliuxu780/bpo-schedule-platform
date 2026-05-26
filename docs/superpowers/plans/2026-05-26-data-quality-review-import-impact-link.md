# Data Quality Review Import Impact Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only import-batch impact summary for the current data-quality next-review recommendation.

**Architecture:** Build a helper that resolves the representative recommendation issue, then reuses the existing import-batch impact summary. Render the result in the existing data-quality overview.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript model helpers, Node test runner.

---

### Task 1: Red Test

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Add failing import and tests for `summarizeDataQualityReviewImportBatchImpact`.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.
- [ ] Confirm failure is the missing export.

### Task 2: Model

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] Add review import batch impact summary type.
- [ ] Implement `summarizeDataQualityReviewImportBatchImpact(rows, batches)` using existing next-review and import-batch impact helpers.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.

### Task 3: Page

**Files:**
- Modify: `app/data-quality/page.tsx`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Import `fallbackImportBatches` and the new summary helper.
- [ ] Render “复核建议导入批次影响” after the next-review recommendation card.
- [ ] Add page source assertions for the helper, card title, and “查看关联批次”.

### Task 4: Verification And Closeout

**Files:**
- Modify: `docs/current/**`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] Smoke `/data-quality` for new card text and no-action boundaries.
- [ ] Clear current queue and active tasks.
- [ ] Mark legacy stories/tasks done.
- [ ] Run target tests, UI copy/navigation tests, strict state check, diff check, and full `bash scripts/check.sh`.
- [ ] Commit with `F390-Q108 add data quality review import impact link`.
