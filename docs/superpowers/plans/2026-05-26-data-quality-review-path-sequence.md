# Data Quality Review Path Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data quality review path sequence to the existing data quality overview.

**Architecture:** Extend `lib/data-quality.ts` with a pure summary function that combines existing priority, issue, field, date, person, and cause summaries into ordered view steps. Render the result as one compact card in `app/data-quality/page.tsx`, reusing existing UI components and no new dependencies.

**Tech Stack:** Next.js App Router, TypeScript, React, existing shadcn-style UI components, Node test runner.

---

### Task 1: Seed Harness State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] **Step 1: Add F386/Q104 ready state**

Use `US542-US544`, `R558-R561`, `F386`, and `Q104`.

- [ ] **Step 2: Run state check**

Run: `bash scripts/check-state.sh --strict`

Expected: `check-state passed in strict mode.`

### Task 2: Write Failing Tests

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add import**

Add `summarizeDataQualityReviewPathSequence` to the existing import from `../../lib/data-quality.ts`.

- [ ] **Step 2: Add model tests**

Add tests that assert:

- fallback headline is `先看 DQ-202605-010，再按字段、日期、人员和原因展开`
- there are five ordered steps
- first step is the priority issue with href `/data-quality/DQ-202605-010`
- step types include `issue`, `field`, `date`, `person`, and `cause`
- field step mentions `status_log.status_start_at/status_end_at`
- date step mentions `2026-05-11`
- person step mentions `A-1002`
- cause step mentions `status_overlap`
- deferred actions keep the slice read-only
- empty input returns an empty-state headline and no steps

- [ ] **Step 3: Add page source assertions**

Assert `app/data-quality/page.tsx` contains:

- `summarizeDataQualityReviewPathSequence`
- `复核路径顺序`
- `查看路径步骤`

- [ ] **Step 4: Verify red**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: fail because `summarizeDataQualityReviewPathSequence` is not exported.

### Task 3: Implement Model

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] **Step 1: Add types**

Add `DataQualityReviewPathStep` and `DataQualityReviewPathSequence`.

- [ ] **Step 2: Add summary function**

Implement `summarizeDataQualityReviewPathSequence(rows)` by combining existing local summaries into ordered view steps.

- [ ] **Step 3: Verify green**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 4: Implement UI

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] **Step 1: Import and compute path sequence**

Import `summarizeDataQualityReviewPathSequence` and compute `reviewPathSequence`.

- [ ] **Step 2: Add card**

Add a `复核路径顺序` card near existing data-quality review cards.

- [ ] **Step 3: Verify model/source tests**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all tests pass.

### Task 5: Verify and Close

**Files:**
- Modify: traceability and audit files under `docs/**`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Run page smoke**

Start dev server and request `/data-quality`. Confirm HTML contains:

- `复核路径顺序`
- `先看 DQ-202605-010`
- `status_log.status_start_at/status_end_at`
- `2026-05-11`
- `A-1002`
- `status_overlap`
- `查看路径步骤`
- `无真实数据修复`
- `无导出或批量处理`

- [ ] **Step 2: Close current state**

Set current queue and active tasks back to empty. Mark F386/Q104 and US542-US544 done in traceability files.

- [ ] **Step 3: Final verification**

Run:

```bash
node --test scripts/tests/data-quality.test.mjs
node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs
bash scripts/check-state.sh --strict
git diff --check
bash scripts/check.sh
```

Expected: every command exits 0.

- [ ] **Step 4: Commit**

```bash
git add app/data-quality/page.tsx lib/data-quality.ts scripts/tests/data-quality.test.mjs docs/PROJECT_STATE.md docs/audit-report.md docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/current/STORY_QUEUE.yaml docs/dev/branch-log.md docs/raw-requirements.md docs/registry/TRACE_INDEX.yaml docs/task-log.md docs/user-stories.md tasks/backlog.yaml docs/superpowers/plans/2026-05-26-data-quality-review-path-sequence.md docs/superpowers/specs/2026-05-26-data-quality-review-path-sequence-design.md
git commit -m "F386-Q104 add data quality review path sequence"
```
