# Import Review Conclusion Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only import batch review conclusion preview.

**Architecture:** Extend the existing `lib/import-batch-history.ts` summary layer and render the result in the existing import batch detail page. The model composes existing failure reason, quality impact, readiness, and material summaries rather than creating new data sources.

**Tech Stack:** Next.js app route, TypeScript model helpers, Node test runner, shadcn/ui cards and badges.

---

### Task 1: State And Traceability

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] Add `US512-US514`, `F376/Q094`, and `R518-R521`.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Expected: current queue has ready stories with matching active tasks.

### Task 2: Red Test

**Files:**
- Modify: `scripts/tests/import-batch-history.test.mjs`

- [ ] Import `summarizeImportBatchReviewConclusion`.
- [ ] Add tests for quality-linked, field-only, and no-failure review conclusion previews.
- [ ] Run `node --test scripts/tests/import-batch-history.test.mjs`.
- [ ] Expected: fail because the export does not exist.

### Task 3: Model

**Files:**
- Modify: `lib/import-batch-history.ts`

- [ ] Add review conclusion types and deferred action constants.
- [ ] Implement `summarizeImportBatchReviewConclusion(batch, issueRows)`.
- [ ] Run `node --test scripts/tests/import-batch-history.test.mjs`.
- [ ] Expected: all import batch model tests pass.

### Task 4: Page

**Files:**
- Modify: `app/import-batches/[batchId]/page.tsx`

- [ ] Render “复核结论预览” after “修正材料预览”.
- [ ] Show status, confidence, evidence count, risk count, suggested conclusion, evidence summary, risk summary, next review point, and deferred actions.
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

- [ ] Smoke the page through local API and frontend HTML.
- [ ] Clear current queue and active tasks after completion.
- [ ] Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit with `F376-Q094 add import review conclusion preview`.
