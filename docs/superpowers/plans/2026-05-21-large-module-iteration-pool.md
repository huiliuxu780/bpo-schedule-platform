# Large Module Iteration Pool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair current planning state drift and register a 36-story business module iteration pool without executing product code.

**Architecture:** This is a Harness/state-hygiene batch. It fixes stale legacy story/task statuses, adds a planned story pool to raw requirements, user stories, backlog, and trace registry, and keeps `docs/current/**` empty after closeout.

**Tech Stack:** Markdown/YAML Harness documents, strict state checker, existing project check script.

---

### Task 1: State Drift Repair

**Files:**
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [x] **Step 1: Mark old completed F085-F093/Q020 stories done**

Update `US137-US146` from `ready` to `done` because `docs/current/PROJECT_CONTEXT.md` records that slice as completed.

- [x] **Step 2: Mark old completed F085-F093/Q020 tasks done**

Update `F085-F093` and `Q020` from `ready` to `done` for the same reason.

### Task 2: Register 36-Story Pool

**Files:**
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [x] **Step 1: Add R245-R280**

Record 36 planned raw requirements across business UI cleanup, fulfillment calendar, personnel schedule traceability, forecast alignment, import/data-quality traceability, and master-data relationship closure.

- [x] **Step 2: Add US257-US292**

Add user stories with `status: planned` so they are not current executable work.

- [x] **Step 3: Add F196-F225 and Q029-Q034**

Add backlog tasks with `status: planned`, `auto_run: false`, and per-module allowed/forbidden files.

- [x] **Step 4: Add trace registry mappings**

Map all new requirements, stories, and tasks without lifecycle status in `TRACE_INDEX.yaml`.

### Task 3: Closeout

**Files:**
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`

- [x] **Step 1: Keep current empty**

Confirm no planned pool story is inserted into current/active.

- [x] **Step 2: Record H031 closeout**

Record the state repair and planning pool as a completed Harness batch.

- [x] **Step 3: Verify and commit**

Run:
`bash scripts/check-state.sh --strict`
`git diff --check`
`bash scripts/check.sh`

Commit message: `H031 plan large module iteration pool`
