# Exception Queue Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a display-only cursor to the fulfillment exception queue so supervisors can review selected exceptions one by one.

**Architecture:** Keep the behavior inside the existing fulfillment calendar model and `/person-timeline` matrix page. The model exposes a cursor derived from the visible queue and selected key; the page renders progress and previous/next links without adding workflow state.

**Tech Stack:** Next.js App Router, TypeScript model helpers, Node test runner, existing shadcn/ui components.

---

### Task 1: Harness Scope

**Files:**
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [x] **Step 1: Add R242-R244 raw requirements**

Record that supervisors need current queue progress, previous/next movement, and empty-filter messaging inside the existing matrix.

- [x] **Step 2: Add US254-US256 user stories**

Map each requirement to F193-F195 with frontend-scaffold scope and display-only acceptance.

- [x] **Step 3: Seed current queue and active tasks**

Add US254-US256 and F193-F195 as ready current work before implementation.

- [x] **Step 4: Run state check**

Run: `bash scripts/check-state.sh --strict`
Expected: PASS.

### Task 2: Model Cursor

**Files:**
- Modify: `scripts/tests/person-timeline.test.mjs`
- Modify: `lib/person-timeline.ts`

- [x] **Step 1: Write failing model test**

Add assertions that a filtered queue exposes selected item index, total, previous key, next key, and empty states.

- [x] **Step 2: Verify RED**

Run: `node --test scripts/tests/person-timeline.test.mjs`
Expected: FAIL because cursor helper is not exported yet.

- [x] **Step 3: Implement cursor helper**

Export a pure helper that accepts visible queue and selected exception key, returning selected item, one-based index, total, previous item, and next item.

- [x] **Step 4: Verify GREEN**

Run: `node --test scripts/tests/person-timeline.test.mjs`
Expected: PASS.

### Task 3: Matrix Panel Controls

**Files:**
- Modify: `app/person-timeline/page.tsx`

- [x] **Step 1: Render queue progress**

Show `处理进度 第 X / N 项` for the current visible queue.

- [x] **Step 2: Render previous/next controls**

Keep `team/group/date/queue` in links and only switch `exception`. Disabled buttons are display-only when there is no previous or next item.

- [x] **Step 3: Render empty filter copy**

When a filter produces no queue rows, show business copy that the current筛选没有待关注异常.

### Task 4: Verification And Closeout

**Files:**
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/superpowers/plans/2026-05-21-exception-queue-cursor.md`

- [x] **Step 1: Browser smoke**

Verify `/person-timeline?...&queue=all` displays progress and previous/next links, and `queue=status` empty or single-item behavior is readable.

- [x] **Step 2: Mark stories/tasks done and clear current**

Update legacy traceability, clear current queue, and record audit evidence.

- [x] **Step 3: Final verification**

Run:
`node --test scripts/tests/person-timeline.test.mjs`
`bash scripts/check-state.sh --strict`
`git diff --check`
`bash scripts/check.sh`

- [x] **Step 4: Commit**

Commit message: `F193-F195 add exception queue cursor`
