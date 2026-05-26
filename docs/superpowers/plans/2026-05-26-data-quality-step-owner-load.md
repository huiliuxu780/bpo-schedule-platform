# Data Quality Step Owner Load Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only owner and person load summary for data quality group review steps.

**Architecture:** Reuse the group step impact drilldown summary as the source and group it by owner. Render a compact card in `/data-quality` with links back to the representative issue and first person route.

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

- [ ] Add `R594-R597`, `US569-US571`, `F395`, and `Q113`.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Expected: ready stories reference active tasks and registry paths exist.

### Task 2: Red Tests

**Files:**
- Modify: `scripts/tests/data-quality-groups.test.mjs`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Add a model test importing `summarizeDataQualityGroupStepOwnerLoad`.
- [ ] Assert owner count `2`, total step count `2`, top owner `数据管理员` or `运营负责人` based on sort, representative issue, impacted people, and hrefs.
- [ ] Add page source assertions for `summarizeDataQualityGroupStepOwnerLoad`, `分组步骤 owner/人员负载`, and `查看 owner 负载`.
- [ ] Run both targeted tests and confirm they fail because the helper and UI are missing.

### Task 3: Model Implementation

**Files:**
- Modify: `lib/data-quality-groups.ts`

- [ ] Add owner-load item and summary types.
- [ ] Implement `summarizeDataQualityGroupStepOwnerLoad()` using `summarizeDataQualityGroupStepImpactDrilldown()`.
- [ ] Return empty state when no drilldown item exists.
- [ ] Run `node --test scripts/tests/data-quality-groups.test.mjs`.

### Task 4: Page Implementation

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] Import and call `summarizeDataQualityGroupStepOwnerLoad()`.
- [ ] Add the `分组步骤 owner/人员负载` card after `分组步骤影响对象`.
- [ ] Render metrics, top owner, owner cards, issue link, person link, next-view hint, and no-action badges.
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
- [ ] Commit with `F395-Q113 add data quality step owner load`.
