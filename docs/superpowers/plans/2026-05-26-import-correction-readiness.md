# Import Correction Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only correction readiness summary to import batch detail pages.

**Architecture:** Extend `lib/import-batch-history.ts` with a pure helper that composes failure reason and quality impact summaries into supervisor-facing readiness text. Render the result in the existing import batch detail page without backend changes.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Node test runner, existing shadcn/ui components.

---

### Task 1: Model Contract

**Files:**
- Modify: `scripts/tests/import-batch-history.test.mjs`
- Modify: `lib/import-batch-history.ts`

- [ ] **Step 1: Write failing tests**

Add tests for `summarizeImportBatchCorrectionReadiness(batch, fallbackDataQualityIssues)` covering readiness level, primary field, confirmation objects, risk note, review steps, deferred actions, and clean empty state.

- [ ] **Step 2: Verify red**

Run: `node --test scripts/tests/import-batch-history.test.mjs`

Expected: FAIL because `summarizeImportBatchCorrectionReadiness` is not exported.

- [ ] **Step 3: Implement minimal helper**

Add exported types and a pure helper in `lib/import-batch-history.ts`. Use existing `summarizeImportBatchFailureReasons()` and `summarizeImportBatchQualityImpact()` to derive a compact read-only summary.

- [ ] **Step 4: Verify green**

Run: `node --test scripts/tests/import-batch-history.test.mjs`

Expected: PASS.

### Task 2: Detail Page UI

**Files:**
- Modify: `app/import-batches/[batchId]/page.tsx`

- [ ] **Step 1: Import and compute summary**

Use `summarizeImportBatchCorrectionReadiness(batch, fallbackDataQualityIssues)` next to the existing import batch summaries.

- [ ] **Step 2: Render summary card**

Place “修正准备摘要” after “质量影响聚合”. Show metrics, confirmation objects, risk note, review steps, and deferred action boundaries. Keep the UI read-only.

- [ ] **Step 3: Verify UI checks**

Run: `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs` and `npm run typecheck`.

Expected: PASS.

### Task 3: Traceability And Verification

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Complete current state**

Mark `US506-US508` and `F374/Q092` done in legacy traceability files, clear current queue and active tasks, and update project context.

- [ ] **Step 2: Final verification**

Run:

```bash
bash scripts/check-state.sh --strict
node --test scripts/tests/import-batch-history.test.mjs
node --test scripts/tests/product-ui-copy-audit.test.mjs
node --test scripts/tests/product-navigation-business-only.test.mjs
npm run typecheck
git diff --check
bash scripts/check.sh
```

Expected: all commands PASS.

- [ ] **Step 3: Commit**

Stage only scoped files and commit:

```bash
git commit -m "F374-Q092 add import correction readiness summary"
```
