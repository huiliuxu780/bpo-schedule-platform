# Review Case Acceptance Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an operator-facing review-case processing path on the existing list and detail workspaces while keeping PM/Gate language out of visible UI.

**Architecture:** Add pure model summaries in `components/import-center-review-model.ts`, export them through `components/import-center-model.ts`, render compact path cards in existing review-case workspace components, and guard the UI language with structure tests.

**Tech Stack:** Next.js RSC, TypeScript, existing shadcn/ui primitives, lucide icons, Node test runner with `jiti`.

---

## File Structure

- Modify `docs/superpowers/specs/2026-06-22-review-case-acceptance-block-design.md`: keep the strict UI language boundary.
- Create `scripts/tests/import-center-review-case-acceptance-model.test.mjs`: RED/GREEN model tests for list and detail processing summaries.
- Create `scripts/tests/product-structure-review-case-processing-path.test.mjs`: structure test that checks path UI is present and Gate/PM acceptance language is absent from visible components.
- Modify `components/import-center-types.ts`: add processing-path summary types.
- Modify `components/import-center-review-model.ts`: add pure summary functions.
- Modify `components/import-center-model.ts`: export the new functions.
- Modify `components/import-center-review-cases-workspace.tsx`: render the list processing path.
- Modify `components/import-center-review-case-detail-workspace.tsx`: render the detail processing path.
- Modify `scripts/check.sh`: add the two new gates.
- Update Harness traceability files for `US856/IM236`.

## Task 1: Model RED Tests

**Files:**
- Create: `scripts/tests/import-center-review-case-acceptance-model.test.mjs`

- [x] **Step 1: Write failing model tests**

Create tests that import:

```js
const {
  summarizeImportReviewCaseAcceptanceBlock,
  summarizeImportReviewCaseDetailAcceptance,
  summarizeImportReviewOwnerNavigation,
} = jiti("../../components/import-center-model.ts");
```

Expected list behavior:

- normal queue returns title `队列处理路径`
- counts `missing_evidence`, `missing_conclusion`, `ready_to_close`, `closed`, `unknown`
- primary action chooses the earliest high-risk open actionable case
- error returns title `复核案例读取受阻`
- empty queue returns title `暂无复核案例`

Expected detail behavior:

- missing evidence primary action is `补充复核证据`
- missing conclusion primary action is `补充复核结论`
- ready-to-close primary action is `关闭复核案例`
- closed primary action is `回看关闭依据`
- no next owner item is not blocked and reads as queue cleared
- error returns `复核案例读取受阻`

- [x] **Step 2: Run RED**

Run:

```bash
node --test scripts/tests/import-center-review-case-acceptance-model.test.mjs
```

Expected: FAIL because the two summary functions are not exported yet.

## Task 2: Model GREEN

**Files:**
- Modify: `components/import-center-types.ts`
- Modify: `components/import-center-review-model.ts`
- Modify: `components/import-center-model.ts`

- [x] **Step 1: Add types**

Add summary types for list and detail processing path, using existing `ImportReviewCaseDetailTone` and `ImportReviewCaseProcessingStageKey`.

- [x] **Step 2: Implement list summary**

Implement `summarizeImportReviewCaseAcceptanceBlock` with operator-facing labels:

- `队列处理路径`
- `复核案例读取受阻`
- `暂无复核案例`
- `优先处理`
- `返回复核列表`

No visible copy should use `Gate`, `验收`, `PM`, `审批`, `导出`, `批量`, `权限`, `停机条件`.

- [x] **Step 3: Implement detail summary**

Implement `summarizeImportReviewCaseDetailAcceptance` with five steps:

- source
- evidence
- conclusion
- closure
- continuation

Use owner navigation for continuation. Treat no next item as queue cleared, not as an error.

- [x] **Step 4: Run GREEN**

Run:

```bash
node --test scripts/tests/import-center-review-case-acceptance-model.test.mjs
```

Expected: PASS.

## Task 3: UI RED/GREEN

**Files:**
- Modify: `components/import-center-review-cases-workspace.tsx`
- Modify: `components/import-center-review-case-detail-workspace.tsx`
- Create: `scripts/tests/product-structure-review-case-processing-path.test.mjs`

- [x] **Step 1: Write failing structure test**

Assert both components contain:

- `队列处理路径`
- `单案例处理路径`
- calls to the new summary functions

Assert both components do not contain these visible governance phrases:

- `Gate`
- `验收矩阵`
- `PM 验收`
- `停机条件`
- `审批`
- `导出`
- `批量`
- `权限`

- [x] **Step 2: Run RED**

Run:

```bash
node --test scripts/tests/product-structure-review-case-processing-path.test.mjs
```

Expected: FAIL because the UI is not rendered yet.

- [x] **Step 3: Render compact path cards**

Use existing shadcn/ui components only:

- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `Badge`
- `Button`

Use lucide icons already allowed by project conventions.

- [x] **Step 4: Run GREEN**

Run:

```bash
node --test scripts/tests/product-structure-review-case-processing-path.test.mjs
node --test scripts/tests/import-center-review-case-acceptance-model.test.mjs
```

Expected: PASS.

## Task 4: Gate Wiring And Harness

**Files:**
- Modify: `scripts/check.sh`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/dev/branch-log.md`

- [x] **Step 1: Add check gates**

Add:

```bash
node --test scripts/tests/import-center-review-case-acceptance-model.test.mjs
node --test scripts/tests/product-structure-review-case-processing-path.test.mjs
```

near the existing review-case gates.

- [x] **Step 2: Add traceability**

Create `R936/US856/IM236` entries for the review-case processing-path block.

- [x] **Step 3: Run state and diff checks**

Run:

```bash
bash scripts/check-state.sh --strict
git diff --check
```

Expected: PASS.

## Task 5: Final Verification And Commit

- [x] **Step 1: Run focused review-case gates**

Run:

```bash
node --test scripts/tests/import-center-review-case-acceptance-model.test.mjs
node --test scripts/tests/product-structure-review-case-processing-path.test.mjs
```

Expected: PASS.

- [x] **Step 2: Run full gate**

Run:

```bash
BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh
```

Expected: PASS.

- [ ] **Step 3: Stage only intended files**

Run:

```bash
git status --short
git add <intended files only>
git diff --cached --name-only
```

Expected: staged files match this plan, without `.local/`, `.qoder/`, package files, backend, or unrelated design docs.

- [ ] **Step 4: Commit**

Run:

```bash
git commit -m "feat: add review case processing path"
```

Expected: local commit succeeds; push remains PM-controlled.

## Self Review

- Spec coverage: covers strict UI language boundary, list path, detail path, tests, Harness, and verification.
- Placeholder scan: no placeholder work remains.
- Type consistency: function names match the spec and planned imports.
- Product boundary: visible UI uses operator processing language only; Gate/PM acceptance language stays in tests and docs.
