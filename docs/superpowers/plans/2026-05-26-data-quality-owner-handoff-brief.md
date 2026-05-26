# Data Quality Owner Handoff Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data-quality owner handoff brief derived from the owner review queue.

**Architecture:** Reuse `summarizeDataQualityGroupStepOwnerReviewQueue()` as the upstream source. Add a narrow handoff summary helper in `lib/data-quality-groups.ts`, render one card in the existing `/data-quality` page, and keep all state in Harness docs.

**Tech Stack:** Next.js App Router, TypeScript frontend model helpers, Node test runner, existing shadcn/ui components.

---

### Task 1: Seed Tests

**Files:**
- Modify: `scripts/tests/data-quality-groups.test.mjs`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add a failing model test**

Add a test for `summarizeDataQualityGroupStepOwnerHandoffBrief(fallbackDataQualityIssues)` that expects two handoff items, first owner `运营负责人`, representative issue `DQ-202605-010`, primary person `A-1002`, group title `时间有效性`, issue and person links, handoff points containing `交接`, next-view hint containing `owner 交接`, and deferred action `无真实数据修复`.

- [ ] **Step 2: Add a failing page-source test**

Assert that `app/data-quality/page.tsx` contains `summarizeDataQualityGroupStepOwnerHandoffBrief`, `分组步骤 owner 交接摘要`, and `查看交接问题`.

- [ ] **Step 3: Verify red**

Run `node --test scripts/tests/data-quality-groups.test.mjs` and `node --test scripts/tests/data-quality.test.mjs`. The group test should fail on the missing export and the page test should fail on the missing page reference.

### Task 2: Implement Model

**Files:**
- Modify: `lib/data-quality-groups.ts`
- Test: `scripts/tests/data-quality-groups.test.mjs`

- [ ] **Step 1: Add handoff types and helper**

Add `DataQualityGroupStepOwnerHandoffBriefItem`, `DataQualityGroupStepOwnerHandoffBriefSummary`, and `summarizeDataQualityGroupStepOwnerHandoffBrief()`.

- [ ] **Step 2: Verify model green**

Run `node --test scripts/tests/data-quality-groups.test.mjs`. All data-quality group model tests should pass.

### Task 3: Render Page Card

**Files:**
- Modify: `app/data-quality/page.tsx`
- Test: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Import and call helper**

Import `summarizeDataQualityGroupStepOwnerHandoffBrief` and derive `groupStepOwnerHandoffBrief` next to `groupStepOwnerReviewQueue`.

- [ ] **Step 2: Add the card**

Render title `分组步骤 owner 交接摘要`, handoff metrics, first owner summary, handoff items, issue/person links, handoff points, next-view hint, and deferred actions.

- [ ] **Step 3: Verify page green**

Run `node --test scripts/tests/data-quality.test.mjs`. All data-quality tests should pass.

### Task 4: Close Out

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Mark F397/Q115 done and clear current state**

Set current queue and active tasks to empty. Mark `F397`, `Q115`, and `US575-US577` done in legacy traceability files.

- [ ] **Step 2: Run verification**

Run target tests, smoke `/data-quality`, `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.

- [ ] **Step 3: Commit**

Commit the scoped changes with message `F397-Q115 add data quality owner handoff brief`.
