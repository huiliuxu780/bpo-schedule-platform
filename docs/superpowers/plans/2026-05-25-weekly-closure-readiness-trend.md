# Weekly Closure Readiness Trend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local, display-only weekly closure readiness trend to the existing fulfillment calendar group-week view.

**Architecture:** Extend `lib/person-timeline.ts` with a weekly aggregate derived from existing exception queues, then render one card in `app/person-timeline/page.tsx` between the weekly evidence gap distribution and group risk summary. Keep all behavior local/frontend-only and preserve the no-action boundary.

**Tech Stack:** Next.js App Router, TypeScript, existing shadcn/ui components, Node test runner.

---

### Task 1: Seed Harness State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] Add `US426-US429` and `F325-F327/Q068` as the current ready execution chain.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Expected: strict state check passes with ready stories matched to active tasks.

### Task 2: Weekly Trend Model

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [ ] Add a failing test that expects `team.closureReadinessTrend` to expose a headline, improving/declining/stable day counts, top blocker, next review day, and seven daily trend points.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing `closureReadinessTrend`.
- [ ] Add a `FulfillmentTeamClosureReadinessTrend` type and build the trend from each group/day matrix exception queue.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected GREEN.

### Task 3: Weekly Trend Card

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `app/person-timeline/page.tsx`

- [ ] Add a failing source-order test that expects `<ClosureReadinessTrendPanel team={team} />` after `<TeamEvidenceGapDistributionPanel team={team} />` and before `<GroupRiskSummaryPanel team={team} />`.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected RED from missing panel.
- [ ] Render a compact card with headline, ready/blocked trend, top blocker, next review day, daily points, and drilldown link.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`; expected GREEN.

### Task 4: QA Closeout

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`

- [ ] Clear current story queue and active tasks after implementation verification.
- [ ] Record the completed scope, no-action boundaries, branch evidence, and verification evidence.
- [ ] Run `node --test scripts/tests/person-timeline.test.mjs`.
- [ ] Run `node --test scripts/tests/product-ui-copy-audit.test.mjs`.
- [ ] Run `node --test scripts/tests/product-navigation-business-only.test.mjs`.
- [ ] Run `git diff --check`.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Run `bash scripts/check.sh`.
- [ ] Commit with message `F325-F327 add weekly closure readiness trend`.
