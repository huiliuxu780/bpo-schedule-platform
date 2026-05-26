# Import Correction Material Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only correction material preview to import batch detail pages.

**Architecture:** Reuse the existing import batch aggregation helpers and add one frontend summary function. Render the resulting view model in the existing batch detail route after the correction readiness card.

**Tech Stack:** Next.js App Router, TypeScript, existing shadcn/ui card/badge/button components, Node test runner.

---

### Task 1: Register Harness State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Add ready stories and tasks**

Add `US509-US511`, `F375`, and `Q093` with allowed files limited to import batch frontend/model/tests and docs.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: strict state check passes with ready stories matched to active tasks.

### Task 2: Add Model Tests First

**Files:**
- Modify: `scripts/tests/import-batch-history.test.mjs`

- [ ] **Step 1: Import the missing function**

Add `summarizeImportBatchCorrectionMaterials` to the existing import list from `../../lib/import-batch-history.ts`.

- [ ] **Step 2: Add linked issue test**

Create a batch based on `BATCH-20260519-001` with failure rows for `employee_name`, `employee_id`, and `supplier_id`. Assert:

- `materialStatus` is `quality_material_ready`
- field materials include `employee_id`
- failure row samples include row `4`
- quality references include `DQ-202605-001`
- conversation points mention `DQ-202605-001`
- deferred actions include `无修正提交` and `无补证据写入`

- [ ] **Step 3: Add unlinked and clean tests**

Use `mapImportBatchResult()` for a status-log failure batch and a clean demand-forecast batch. Assert unlinked failure returns `field_material_ready`; clean batch returns `not_required`.

- [ ] **Step 4: Verify red**

Run: `node --test scripts/tests/import-batch-history.test.mjs`

Expected: fail because `summarizeImportBatchCorrectionMaterials` is not exported.

### Task 3: Implement Summary Model

**Files:**
- Modify: `lib/import-batch-history.ts`

- [ ] **Step 1: Add exported types**

Add `ImportBatchCorrectionMaterialStatus`, `ImportBatchCorrectionMaterialField`, `ImportBatchCorrectionMaterialQualityReference`, and `ImportBatchCorrectionMaterialSummary`.

- [ ] **Step 2: Add summary function**

Implement `summarizeImportBatchCorrectionMaterials(batch, issueRows)` using existing failure reason, quality impact, and readiness summaries.

- [ ] **Step 3: Verify model tests**

Run: `node --test scripts/tests/import-batch-history.test.mjs`

Expected: all import batch tests pass.

### Task 4: Render Detail Card

**Files:**
- Modify: `app/import-batches/[batchId]/page.tsx`

- [ ] **Step 1: Import and compute summary**

Import `summarizeImportBatchCorrectionMaterials` and compute `correctionMaterialSummary` beside the existing readiness summary.

- [ ] **Step 2: Add card**

Render `修正材料预览` after `修正准备摘要`. Include metrics, material summary, field materials, failed-row samples, quality references, conversation points, and deferred actions.

- [ ] **Step 3: Run UI checks**

Run: `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`

Expected: product copy and navigation tests pass.

### Task 5: Verify and Close

**Files:**
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: current state and legacy status files

- [ ] **Step 1: Route smoke**

Start `bash scripts/dev.sh`, create one local failed import batch, fetch its detail HTML, and assert it contains the new card text.

- [ ] **Step 2: Close Harness state**

Set `US509-US511`, `F375`, and `Q093` done in legacy files, clear current queue and active tasks, and update context.

- [ ] **Step 3: Final verification**

Run:

```bash
bash scripts/check-state.sh --strict
node --test scripts/tests/import-batch-history.test.mjs
node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs
npm run typecheck
git diff --check
bash scripts/check.sh
```

Expected: all commands pass.

- [ ] **Step 4: Commit**

Run:

```bash
git add app/import-batches/[batchId]/page.tsx lib/import-batch-history.ts scripts/tests/import-batch-history.test.mjs docs/PROJECT_STATE.md docs/audit-report.md docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/current/STORY_QUEUE.yaml docs/dev/branch-log.md docs/raw-requirements.md docs/registry/TRACE_INDEX.yaml docs/task-log.md docs/user-stories.md tasks/backlog.yaml docs/superpowers/plans/2026-05-26-import-correction-material-preview.md docs/superpowers/specs/2026-05-26-import-correction-material-preview-design.md
git commit -m "F375-Q093 add import correction material preview"
```
