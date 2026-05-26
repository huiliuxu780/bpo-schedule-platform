# Weekly Closure Trend Reasons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add read-only reason breakdowns to the existing weekly closure readiness trend.

**Architecture:** Extend the existing person-timeline model type and builder, then render the new fields in the current weekly trend panel. Keep the feature inside the existing fulfillment calendar route.

**Tech Stack:** TypeScript, Next.js App Router, existing shadcn/ui primitives, Node test runner.

---

### Task 1: Model Contract

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [ ] **Step 1: Write the failing model assertion**

Add expected `changeReason`, `primaryBlocker`, `breakdown`, and `nextViewHint` fields to the existing `shanghaiTeam.closureReadinessTrend` assertion.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: FAIL because the trend point reason fields do not exist yet.

- [ ] **Step 3: Implement minimal model fields**

Update `FulfillmentTeamClosureReadinessTrendPoint` and `buildTeamClosureReadinessTrend()` to derive the reason fields from existing daily counts.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: PASS.

### Task 2: Weekly Panel Display

**Files:**
- Modify: `app/person-timeline/page.tsx`
- Modify: `scripts/tests/person-timeline.test.mjs`

- [ ] **Step 1: Write the failing UI source assertion**

Assert the weekly trend panel includes the reason breakdown labels and point fields.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: FAIL until the page renders the new fields.

- [ ] **Step 3: Render reason breakdown**

Add a compact reason list below the seven-day grid showing daily reason, primary blocker, breakdown rows, and next view hint.

- [ ] **Step 4: Run target tests**

Run: `node --test scripts/tests/person-timeline.test.mjs`

Expected: PASS.

### Task 3: Verification And Closeout

**Files:**
- Modify: `docs/**`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Run route smoke**

Start the dev server, fetch the weekly route HTML, and confirm it contains the reason breakdown copy.

- [ ] **Step 2: Complete docs**

Move current story/task state to done history, update audit/task/branch/project state, and keep current queue empty.

- [ ] **Step 3: Run final verification**

Run:

```bash
bash scripts/check-state.sh --strict
git diff --check
bash scripts/check.sh
```

Expected: all commands pass.

- [ ] **Step 4: Commit**

Run:

```bash
git add app/person-timeline/page.tsx lib/person-timeline.ts scripts/tests/person-timeline.test.mjs docs tasks/backlog.yaml
git commit -m "F378-Q096 add weekly closure trend reasons"
```
