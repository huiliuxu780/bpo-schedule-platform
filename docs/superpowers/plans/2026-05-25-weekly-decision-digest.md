# Weekly Decision Digest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only weekly decision digest to the fulfillment calendar group-week view.

**Architecture:** Extend the existing `FulfillmentTeamWeek` model with `supervisorWeeklyDecisionDigest`, derived from the weekly review queue, weekly handoff summary, evidence gap distribution, and closure readiness trend. Render the digest in the existing group-week sidebar before the review queue, without adding routes, navigation, backend contracts, persistence, or write actions.

**Tech Stack:** Next.js app router, React server components, TypeScript local model helpers, Node test runner.

---

### Task 1: Weekly Digest Model And Panel

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`
- Modify: `app/person-timeline/page.tsx`

- [x] **Step 1: Write the failing test**

Add a source-order assertion for `<SupervisorWeeklyDecisionDigestPanel team={team} />` before `<SupervisorWeeklyReviewQueuePanel team={team} />`, and add a deep model assertion for `shanghaiTeam.supervisorWeeklyDecisionDigest`.

- [x] **Step 2: Run test to verify it fails**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: FAIL because `supervisorWeeklyDecisionDigest` is `undefined` and the component is missing from the page source.

- [x] **Step 3: Write minimal implementation**

Add `FulfillmentSupervisorWeeklyDecisionDigest` types, derive the digest from existing weekly summaries, and render a read-only `SupervisorWeeklyDecisionDigestPanel`.

- [x] **Step 4: Run test to verify it passes**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: PASS with 13 tests.

### Task 2: Harness Traceability And Verification

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`

- [x] **Step 1: Seed current executable state**

Add `US458-US460` and `F349-F350/Q076` as in-progress local frontend/QA work.

- [x] **Step 2: Record completed traceability**

Add `R446-R449`, `US458-US460`, `F349-F350/Q076`, trace index entries, task log, audit report, branch log, and project context updates.

- [x] **Step 3: Clear current executable state**

Restore `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml` to empty after implementation.

- [x] **Step 4: Run final verification**

Run: `bash scripts/check-state.sh --strict`, browser smoke for the group-week page, and `bash scripts/check.sh`.

Expected: all checks pass before local commit.
