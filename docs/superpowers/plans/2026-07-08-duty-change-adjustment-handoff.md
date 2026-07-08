# Duty Change Adjustment Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build the IM308 same-page three-column duty-change request adjustment handoff.

**Architecture:** Keep the work inside `components/roster-change-governance-workbench.tsx`. The component already reads real requests and current published cells; this plan reshapes the UI into request queue, current-cell adjustment, and request handling panels, then reuses existing request follow-up/resolve endpoints for persistence.

**Tech Stack:** Next.js client component, React state, existing shadcn/ui primitives, current local FastAPI roster request endpoints, Node structure tests.

---

### Task 1: Lock Red Structure Test

**Files:**
- Modify: `scripts/tests/roster-change-governance-structure.test.mjs`

- [x] **Step 1: Add failing structural assertions**

Require the workbench to contain these strings:

```js
assert.ok(content.includes('data-slot="duty-change-adjustment-layout"'))
assert.ok(content.includes('data-slot="duty-change-request-queue"'))
assert.ok(content.includes('data-slot="duty-change-current-cell-adjustment"'))
assert.ok(content.includes('data-slot="duty-change-handling-panel"'))
assert.ok(content.includes("调整为"))
assert.ok(content.includes("轻量影响提示"))
assert.ok(content.includes("只调整当前员工/日期格"))
assert.ok(content.includes("selectNextPendingRequest"))
assert.ok(!content.includes('data-slot="duty-change-request-detail-drawer"'))
assert.ok(!content.includes("打开月班表调整页"))
```

- [x] **Step 2: Run the red test**

Run:

```bash
node --test scripts/tests/roster-change-governance-structure.test.mjs
```

Expected: fail on missing three-column slots.

### Task 2: Build Same-Page Handoff

**Files:**
- Modify: `components/roster-change-governance-workbench.tsx`

- [x] **Step 1: Replace drawer-centric interaction state**

Remove the detail `Sheet` interaction from the main flow. Keep selected request state, add:

```ts
const [targetShiftCode, setTargetShiftCode] = React.useState("休息")
const [adjustmentMode, setAdjustmentMode] = React.useState(false)
```

- [x] **Step 2: Render the three-column layout**

Use stable slots:

```tsx
<div data-slot="duty-change-adjustment-layout">
  <RequestQueue />
  <CurrentCellAdjustment />
  <HandlingPanel />
</div>
```

The left queue replaces tabs as the first visible work surface. The middle panel shows the selected current published roster cell and fixed shift dropdown. The right panel shows request detail, note, lightweight impact hints, and action buttons.

- [x] **Step 3: Add save continuity**

After successful save:

```ts
selectNextPendingRequest(updated.id)
setAdjustmentMode(false)
```

`selectNextPendingRequest` should choose the first remaining pending request excluding the updated request; if none remain, keep the updated processed request selected and switch to processed context.

### Task 3: Focused Verification

**Files:**
- Modify as needed from Task 1 and Task 2 only.

- [x] **Step 1: Run focused structure test**

```bash
node --test scripts/tests/roster-change-governance-structure.test.mjs
```

Expected: pass.

- [x] **Step 2: Run frontend checks**

```bash
npm run typecheck
npm run lint
git diff --check
```

Expected: all pass.

### Task 4: Traceability And Final Gate

**Files:**
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`

- [x] **Step 1: Mark IM308 done after implementation and browser smoke**

Record business result, focused verification, browser smoke, and final verification.

- [x] **Step 2: Run final gate**

```bash
BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh
```

Expected: pass.

- [x] **Step 3: Commit intended files only**

```bash
git add components/roster-change-governance-workbench.tsx scripts/tests/roster-change-governance-structure.test.mjs docs/current/ACTIVE_TASKS.yaml docs/current/STORY_QUEUE.yaml docs/current/PROJECT_CONTEXT.md docs/task-log.md docs/audit-report.md docs/dev/branch-log.md tasks/backlog.yaml docs/raw-requirements.md docs/user-stories.md docs/superpowers/plans/2026-07-08-duty-change-adjustment-handoff.md
git commit -m "feat: add duty adjustment handoff"
```
