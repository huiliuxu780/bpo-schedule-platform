# Data Quality Owner Review Queue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only data-quality owner review queue derived from group step owner/person load.

**Architecture:** Reuse `summarizeDataQualityGroupStepOwnerLoad()` as the upstream source. Add a narrow queue summary helper in `lib/data-quality-groups.ts`, render one card in the existing `/data-quality` page, and keep all state in Harness docs.

**Tech Stack:** Next.js App Router, TypeScript frontend model helpers, Node test runner, existing shadcn/ui components.

---

### Task 1: Seed Tests

**Files:**
- Modify: `scripts/tests/data-quality-groups.test.mjs`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Add a failing model test**

```js
test("data quality group step owner review queue orders owner follow-up", () => {
  const summary = summarizeDataQualityGroupStepOwnerReviewQueue(fallbackDataQualityIssues)

  assert.equal(summary.queueCount, 2)
  assert.equal(summary.totalStepCount, 2)
  assert.equal(summary.totalImpactedPeopleCount, 2)
  assert.equal(summary.firstItem?.rank, 1)
  assert.equal(summary.firstItem?.owner, "运营负责人")
  assert.equal(summary.firstItem?.representativeIssueId, "DQ-202605-010")
  assert.equal(summary.firstItem?.primaryPerson, "A-1002")
  assert.equal(summary.firstItem?.issueHref, "/data-quality/DQ-202605-010")
  assert.equal(summary.firstItem?.personHref, "/person-timeline/A-1002?date=2026-05-11")
  assert.ok(summary.firstItem?.groupTitles.includes("时间有效性"))
  assert.ok(summary.firstItem?.queueReason.includes("第 1 位"))
  assert.ok(summary.items.some((item) => item.owner === "数据管理员"))
  assert.ok(summary.nextViewHint.includes("owner 复核队列"))
  assert.ok(summary.deferredActions.includes("无真实数据修复"))
})
```

- [ ] **Step 2: Add a failing page-source test**

```js
assert.ok(pageSource.includes("summarizeDataQualityGroupStepOwnerReviewQueue"));
assert.ok(pageSource.includes("分组步骤 owner 复核队列"));
assert.ok(pageSource.includes("查看队列问题"));
```

- [ ] **Step 3: Verify red**

Run: `node --test scripts/tests/data-quality-groups.test.mjs` and `node --test scripts/tests/data-quality.test.mjs`

Expected: the group test fails because `summarizeDataQualityGroupStepOwnerReviewQueue` is missing; the page-source test fails because the page does not reference the helper/card yet.

### Task 2: Implement Model

**Files:**
- Modify: `lib/data-quality-groups.ts`
- Test: `scripts/tests/data-quality-groups.test.mjs`

- [ ] **Step 1: Add queue types and helper**

Add `DataQualityGroupStepOwnerReviewQueueItem`, `DataQualityGroupStepOwnerReviewQueueSummary`, and `summarizeDataQualityGroupStepOwnerReviewQueue()`.

- [ ] **Step 2: Verify model green**

Run: `node --test scripts/tests/data-quality-groups.test.mjs`

Expected: all data-quality group model tests pass.

### Task 3: Render Page Card

**Files:**
- Modify: `app/data-quality/page.tsx`
- Test: `scripts/tests/data-quality.test.mjs`

- [ ] **Step 1: Import and call helper**

Import `summarizeDataQualityGroupStepOwnerReviewQueue` and derive `groupStepOwnerReviewQueue` next to `groupStepOwnerLoad`.

- [ ] **Step 2: Add the card**

Render title `分组步骤 owner 复核队列`, queue metrics, first owner summary, queue items, issue/person links, queue reasons, next-view hint, and deferred actions.

- [ ] **Step 3: Verify page green**

Run: `node --test scripts/tests/data-quality.test.mjs`

Expected: all data-quality tests pass.

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

- [ ] **Step 1: Mark F396/Q114 done and clear current state**

Set current queue and active tasks to empty. Mark `F396`, `Q114`, and `US572-US574` done in legacy traceability files.

- [ ] **Step 2: Run verification**

Run target tests, smoke `/data-quality`, `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.

- [ ] **Step 3: Commit**

Commit the scoped changes with message `F396-Q114 add data quality owner review queue`.
