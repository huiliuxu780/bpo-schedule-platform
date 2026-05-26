# Data Quality Handoff Risk Import Impact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only card that connects data quality owner handoff risks to import batch failures.

**Architecture:** Reuse the existing data-quality group helper chain and existing local import batch shape. The helper derives item-level batch impact from representative issue ids and `fallbackImportBatches`, then the page renders one summary card with issue and batch links.

**Tech Stack:** Next.js App Router, TypeScript, React Server Components, shadcn/ui components, Node test runner.

---

### Task 1: Add Failing Model And Page Tests

**Files:**
- Modify: `scripts/tests/data-quality-groups.test.mjs`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Add a model test importing `summarizeDataQualityGroupStepOwnerHandoffImportImpact`.
- [ ] Assert the summary returns two items, top owner `运营负责人`, representative issue `DQ-202605-010`, at least one related batch, failed rows greater than zero, issue link `/data-quality/DQ-202605-010`, and a batch link under `/import-batches/`.
- [ ] Add page source assertions for `summarizeDataQualityGroupStepOwnerHandoffImportImpact`, `交接风险关联导入批次影响`, and `查看风险批次`.
- [ ] Run both target tests and confirm they fail for missing helper/page reference.

### Task 2: Implement The Model Helper

**Files:**
- Modify: `lib/data-quality-groups.ts`

- [ ] Import `DataQualityImportBatchLike` and `summarizeDataQualityImportBatchImpact` from `./data-quality`.
- [ ] Add summary and item types.
- [ ] Add `summarizeDataQualityGroupStepOwnerHandoffImportImpact(issues, batches, groups)`.
- [ ] For each risk item, find the representative issue, summarize import batch impact, and return batch count, failed rows, matched fields, affected objects, first batch link, issue/person links, next-view hint, and deferred actions.
- [ ] Run `node --test scripts/tests/data-quality-groups.test.mjs`.

### Task 3: Render The Page Card

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] Import and call the helper with `rows`, `fallbackImportBatches`, and `fallbackDataQualityGroups`.
- [ ] Add the card after “分组步骤 owner 交接风险摘要”.
- [ ] Render metrics, top item, item list, issue/person/batch links, next-view hint, and deferred actions.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.

### Task 4: Close Harness And Verify

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/user-stories.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/audit-report.md`

- [ ] Clear current story queue and active tasks after implementation.
- [ ] Mark `F399/Q117` and `US581-US583` done in legacy traceability files.
- [ ] Add project-state, task-log, branch-log, and audit-report closeout notes.
- [ ] Run target tests, product copy/navigation tests, local HTML smoke, `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit with `F399-Q117 add data quality handoff risk import impact`.
