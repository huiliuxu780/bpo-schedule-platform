# Formal Roster Request Boundaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the formal roster detail action placeholders into local request-boundary shells for leave, swap, and exception-fix without submitting anything.

**Architecture:** Keep `/published-roster` read-only over the current formal roster API. Extend `lib/published-roster-view.ts` request-action metadata with required information, next handler, and boundary-only status; render those actions in `components/published-roster-viewer.tsx` as selectable buttons that reveal a local boundary panel inside the existing detail drawer.

**Tech Stack:** Next.js app router, React client component, existing shadcn/ui primitives, Node structure/model tests, local Harness trace files.

---

### Task 1: Request Boundary Model

**Files:**
- Modify: `lib/published-roster-view.ts`
- Modify: `scripts/tests/published-roster-view-model.test.mjs`

- [ ] Step 1: Add failing tests that each formal roster cell detail exposes leave, swap, and exception-fix request boundaries with required fields, owner labels, and `boundary_only` submission state.
- [ ] Step 2: Run `node --test scripts/tests/published-roster-view-model.test.mjs` and confirm the new test fails against the old disabled placeholders.
- [ ] Step 3: Replace disabled-only request actions with boundary metadata while keeping no persistence/API fields.
- [ ] Step 4: Re-run the model test and confirm it passes.

### Task 2: Detail Drawer Boundary UI

**Files:**
- Modify: `components/published-roster-viewer.tsx`
- Modify: `scripts/tests/published-roster-viewer-structure.test.mjs`

- [ ] Step 1: Add failing structure tests that require `data-slot="published-roster-request-boundary"`, a `RequestBoundaryPanel`, and no submission/approval copy.
- [ ] Step 2: Run `node --test scripts/tests/published-roster-viewer-structure.test.mjs` and confirm it fails before implementation.
- [ ] Step 3: Make the three action buttons selectable and show a compact boundary panel for the selected action.
- [ ] Step 4: Keep the detail drawer read-only: no forms, no submit button, no API calls, no approval status.
- [ ] Step 5: Run the focused published-roster tests plus typecheck.

### Task 3: Trace, Browser, Full Gate

**Files:**
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/registry/DECISION_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`

- [ ] Step 1: Register IM301 as the confirmed formal-roster request-boundary story, then clear current queue after implementation.
- [ ] Step 2: Browser-smoke `/published-roster?month=2026-08`: open a formal cell, click leave/swap/exception-fix, verify the boundary panel changes and no submission capability appears.
- [ ] Step 3: Run `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` after trace updates.
- [ ] Step 4: Commit the verified scope locally.
