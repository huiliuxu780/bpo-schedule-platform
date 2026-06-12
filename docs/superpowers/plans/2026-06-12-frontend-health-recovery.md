# Frontend Health Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the frontend audit response into a governed, recoverable IM sequence that can survive context compaction and guide later implementation safely.

**Architecture:** Keep the active Harness queue single-item. Store the whole recovery roadmap in `docs/frontend-health-recovery-plan.md`, keep this file as the detailed execution plan, and update current/registry/legacy trace files only for `IM172`. Future implementation IMs are planned here but must be seeded into current state one at a time.

**Tech Stack:** Lightweight Harness docs, YAML current state, Markdown traceability, `bash scripts/check-state.sh --strict`, `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`.

---

### Task 1: Write The Durable Recovery Plan

**Files:**
- Create: `docs/frontend-health-recovery-plan.md`
- Create: `docs/superpowers/plans/2026-06-12-frontend-health-recovery.md`

- [ ] **Step 1: Write the PM-facing recovery plan**

Create `docs/frontend-health-recovery-plan.md` with these required sections:

```markdown
# Frontend Health Recovery Plan

## Purpose

This plan makes the frontend recovery work durable across context compaction.

## Recovery Entry

After any context reset, read `AGENTS.md`, `docs/current/**`, this file, and the Superpowers plan.

## Product Boundary

Do not add permissions, approval, export, batch operations, automatic scheduling, settlement, contracts, minimum staffing, charge factors, production formulas, or revived generic quality/import centers.

## Product Design Gate

Any visible page, navigation, form, table, dialog, action placement, empty state, loading state, or error state requires Product Design plugin brief before implementation.
```

- [ ] **Step 2: Write the execution plan**

Create `docs/superpowers/plans/2026-06-12-frontend-health-recovery.md` with the mandatory Superpowers plan header, IM sequence, file responsibilities, checks, and stop conditions.

- [ ] **Step 3: Verify no implementation scope leaked**

Run:

```bash
git diff --name-only
```

Expected: only documentation and Harness files appear, plus pre-existing unrelated local noise if present.

### Task 2: Seed IM172 Into Current Harness State

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] **Step 1: Add exactly one current story**

`docs/current/STORY_QUEUE.yaml` must contain only `US792`:

```yaml
stories:
  - id: US792
    requirement_ids:
      - R872
    title: "前端健康恢复计划固化"
    status: ready
    priority: P0
    task_ids:
      - IM172
```

- [ ] **Step 2: Add exactly one active task**

`docs/current/ACTIVE_TASKS.yaml` must contain only `IM172`:

```yaml
tasks:
  - id: IM172
    story_id: US792
    title: "前端健康恢复计划固化"
    status: in_progress
    required_workflow: harness
```

- [ ] **Step 3: Update project context within line budget**

Append or replace the latest context line so it states that `IM172` is the active governance task and that future frontend health work must be seeded one IM at a time.

- [ ] **Step 4: Add trace index entries without lifecycle state**

Add `R872`, `US792`, and `IM172` to `docs/registry/TRACE_INDEX.yaml`. Do not add `status` in this file.

- [ ] **Step 5: Run strict state check**

Run:

```bash
bash scripts/check-state.sh --strict
```

Expected: `check-state passed in strict mode.`

### Task 3: Update Legacy Traceability Records

**Files:**
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/dev/branch-log.md`

- [ ] **Step 1: Add raw requirement R872**

Add a requirement describing the need to persist the frontend recovery plan and Product Design gate before implementation.

- [ ] **Step 2: Add user story US792**

Add a PM-facing story for recoverable execution after context compaction.

- [ ] **Step 3: Add backlog task IM172**

Use `required_workflow: harness`. Allow only docs/current, docs/registry, docs trace files, and recovery plan files. Forbid app, components, lib, backend, package files, and lockfiles.

- [ ] **Step 4: Add task-log, audit-report, project-state, and branch-log entries**

Record scope, exclusions, expected checks, and push decision as pending.

### Task 4: Verify And Commit IM172

**Files:**
- All files changed by Tasks 1-3.

- [ ] **Step 1: Run diff check**

Run:

```bash
git diff --check
```

Expected: no whitespace errors.

- [ ] **Step 2: Run final project check**

Run:

```bash
BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh
```

Expected: project Harness check passed.

- [ ] **Step 3: Stage only IM172 files**

Run:

```bash
git add docs/frontend-health-recovery-plan.md docs/superpowers/plans/2026-06-12-frontend-health-recovery.md docs/current/STORY_QUEUE.yaml docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/registry/TRACE_INDEX.yaml docs/raw-requirements.md docs/user-stories.md tasks/backlog.yaml docs/task-log.md docs/audit-report.md docs/PROJECT_STATE.md docs/dev/branch-log.md
```

Do not stage `.local/`, `.qoder/`, or unrelated `docs/design/**` changes.

- [ ] **Step 4: Commit**

Run:

```bash
git commit -m "docs: add frontend health recovery plan"
```

Expected: local commit succeeds on branch `codex/im172-frontend-health-recovery-plan`.
