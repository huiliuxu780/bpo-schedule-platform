# Data Quality Owner Handoff Risk Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only owner handoff risk summary to the data quality overview.

**Architecture:** Reuse the existing data-quality group model chain. The new helper derives risk items from `summarizeDataQualityGroupStepOwnerHandoffBrief()` and the page renders one card with links and deferred actions.

**Tech Stack:** Next.js App Router, TypeScript, React Server Components, shadcn/ui components, Node test runner.

---

### Task 1: Add Failing Model And Page Tests

**Files:**
- Modify: `scripts/tests/data-quality-groups.test.mjs`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Add a model test that imports `summarizeDataQualityGroupStepOwnerHandoffRiskSummary`, expects `riskCount` to be `2`, top owner to be `运营负责人`, representative issue to be `DQ-202605-010`, primary person to be `A-1002`, and at least one risk reason to include `阻塞`.
- [ ] Add a page source test assertion for `summarizeDataQualityGroupStepOwnerHandoffRiskSummary`, `分组步骤 owner 交接风险摘要`, and `查看风险问题`.
- [ ] Run `node --test scripts/tests/data-quality-groups.test.mjs` and confirm it fails because the helper is not exported.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs` and confirm it fails because the page does not reference the helper.

### Task 2: Implement The Model Helper

**Files:**
- Modify: `lib/data-quality-groups.ts`

- [ ] Add `DataQualityGroupStepOwnerHandoffRiskItem` and `DataQualityGroupStepOwnerHandoffRiskSummary` types.
- [ ] Add `summarizeDataQualityGroupStepOwnerHandoffRiskSummary()` after the handoff brief helper.
- [ ] Derive `riskReasons` from existing local fields only: representative issue, primary person, related groups, impacted people, and handoff points.
- [ ] Return `riskCount`, `totalImpactedPeopleCount`, `topRisk`, `items`, `nextViewHint`, and `deferredActions`.
- [ ] Run `node --test scripts/tests/data-quality-groups.test.mjs` and confirm it passes.

### Task 3: Render The Page Card

**Files:**
- Modify: `app/data-quality/page.tsx`

- [ ] Import `summarizeDataQualityGroupStepOwnerHandoffRiskSummary`.
- [ ] Create `groupStepOwnerHandoffRiskSummary` next to the handoff brief summary.
- [ ] Add a card after “分组步骤 owner 交接摘要”.
- [ ] Render count metrics, top risk, risk reasons, `查看风险问题`, optional `查看风险人员`, next-view hints, and deferred actions.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs` and confirm it passes.

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
- [ ] Mark `F398/Q116` and `US578-US580` done in legacy traceability files.
- [ ] Add project-state, task-log, branch-log, and audit-report closeout notes.
- [ ] Run target tests, product copy/navigation tests, local HTML smoke, `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit with `F398-Q116 add data quality owner handoff risk summary`.
