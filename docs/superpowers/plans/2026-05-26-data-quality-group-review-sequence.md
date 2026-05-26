# Data Quality Group Review Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data quality group review sequence summary to the data quality overview.

**Architecture:** Reuse the existing group exception coverage summary as the source of truth, then project it into ordered review steps. Keep UI rendering inside `/data-quality` and preserve current no-action boundaries.

**Tech Stack:** Next.js App Router, TypeScript local model helpers, Node test runner.

---

### Task 1: Harness Seed

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] Add `R586-R589`, `US563-US565`, `F393`, and `Q111`.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Expected: ready stories reference active tasks and registry paths exist.

### Task 2: Red Tests

**Files:**
- Modify: `scripts/tests/data-quality-groups.test.mjs`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Add a model test importing `summarizeDataQualityGroupReviewSequence`.
- [ ] Assert `stepCount` is `2`, first step is `time-validity`, owner is `运营负责人`, representative issue is `DQ-202605-010`, href is `/data-quality/groups/time-validity`, another step is `identity-integrity`, and deferred actions include `无真实数据修复`.
- [ ] Add page source assertions for `summarizeDataQualityGroupReviewSequence`, `质量分组复核顺序`, and `查看分组步骤`.
- [ ] Run both targeted tests and confirm they fail because the helper and UI are missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/data-quality-groups.ts`

- [ ] Add review sequence item and summary types.
- [ ] Implement `summarizeDataQualityGroupReviewSequence()` using `summarizeDataQualityGroupExceptionCoverage()`.
- [ ] Return empty state when no impacted group exists.
- [ ] Run `node --test scripts/tests/data-quality-groups.test.mjs`.

### Task 4: Page Implementation

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] Import and call `summarizeDataQualityGroupReviewSequence()`.
- [ ] Add the `质量分组复核顺序` card after `质量分组异常影响覆盖`.
- [ ] Render metrics, first step, ordered step cards, navigation link, next-view hint, and no-action badges.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.

### Task 5: QA Closeout

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/audit-report.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/user-stories.md`

- [ ] Mark legacy backlog/story entries done.
- [ ] Clear current queue and active tasks.
- [ ] Add branch, task, audit, and state notes.
- [ ] Run strict state check, targeted tests, page smoke, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit with `F393-Q111 add data quality group review sequence`.
