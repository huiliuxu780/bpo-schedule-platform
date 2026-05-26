# Data Quality Group Step Impact Drilldown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only group step impact drilldown summary to the data quality overview.

**Architecture:** Reuse the existing group review sequence as the ordered source, then enrich each step with representative issue and impacted object details from local data quality issues. Keep all UI in `/data-quality` and preserve no-action boundaries.

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

- [ ] Add `R590-R593`, `US566-US568`, `F394`, and `Q112`.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Expected: ready stories reference active tasks and registry paths exist.

### Task 2: Red Tests

**Files:**
- Modify: `scripts/tests/data-quality-groups.test.mjs`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Add a model test importing `summarizeDataQualityGroupStepImpactDrilldown`.
- [ ] Assert top item is step `1`, group `time-validity`, issue `DQ-202605-010`, person `A-1002`, issue href `/data-quality/DQ-202605-010`, person href `/person-timeline/A-1002?date=2026-05-11`, and affected object `小组成员矩阵异常`.
- [ ] Add page source assertions for `summarizeDataQualityGroupStepImpactDrilldown`, `分组步骤影响对象`, and `查看影响对象`.
- [ ] Run both targeted tests and confirm they fail because the helper and UI are missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/data-quality-groups.ts`

- [ ] Add drilldown item and summary types.
- [ ] Implement `summarizeDataQualityGroupStepImpactDrilldown()` using `summarizeDataQualityGroupReviewSequence()` and representative issues.
- [ ] Return empty state when no review step exists.
- [ ] Run `node --test scripts/tests/data-quality-groups.test.mjs`.

### Task 4: Page Implementation

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] Import and call `summarizeDataQualityGroupStepImpactDrilldown()`.
- [ ] Add the `分组步骤影响对象` card after `质量分组复核顺序`.
- [ ] Render metrics, first item, ordered item cards, quality issue link, person link, next-view hint, and no-action badges.
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
- [ ] Commit with `F394-Q112 add data quality group step impact drilldown`.
