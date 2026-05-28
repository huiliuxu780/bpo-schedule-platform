# Database Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move from local process-memory contracts toward production persistence in small, verifiable database slices.

**Architecture:** DB001 is documentation-only and creates the Gate. DB002 starts the implementation with import batch persistence, because every later entity needs durable source batches, row results, failed-row traceability, and version references. Later tasks layer master data, schedules, forecasts, actual logs, comparisons, and supervisor review closure records on top.

**Tech Stack:** FastAPI backend, Python tests, Next.js frontend where a vertical slice requires UI verification, database tooling to be selected and confirmed before DB002.

---

### Task 1: DB001 Database Gate Planning

**Files:**
- Modify: `docs/quality/GATE_REGISTRY.md`
- Create: `docs/quality/DATABASE_GATE_PLAN.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`

- [ ] **Step 1: Seed DB001 in current Harness**

Add `US612` to `docs/current/STORY_QUEUE.yaml` and `DB001` to `docs/current/ACTIVE_TASKS.yaml`.

- [ ] **Step 2: Define database workflows**

Update `docs/quality/GATE_REGISTRY.md` with `database-planning` and `database-persistence`.

- [ ] **Step 3: Write database Gate plan**

Create `docs/quality/DATABASE_GATE_PLAN.md` with allowed scope, forbidden scope, persistence order, first implementation slice, deferred capabilities, and confirmation required before DB002.

- [ ] **Step 4: Run state verification**

Run:

```bash
bash scripts/check-state.sh --strict
```

Expected: `check-state passed in strict mode.`

- [ ] **Step 5: Run final verification**

Run:

```bash
git diff --check
bash scripts/check.sh
```

Expected: both pass.

- [ ] **Step 6: Commit DB001**

Run:

```bash
git add docs/quality/GATE_REGISTRY.md docs/quality/DATABASE_GATE_PLAN.md docs/superpowers/plans/2026-05-28-database-gate-implementation-plan.md docs/raw-requirements.md docs/user-stories.md tasks/backlog.yaml docs/current/STORY_QUEUE.yaml docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/audit-report.md docs/task-log.md docs/dev/branch-log.md
git commit -m "DB001 define database gate plan"
```

### Task 2: DB002 Import Persistence Foundation

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `tasks/backlog.yaml`
- Implementation files: to be confirmed after PM selects database engine, dependency strategy, migration tool, and test database setup.

- [x] **Step 1: Confirm implementation prerequisites**

Ask PM to confirm database engine, migration tool, package-change allowance, local database runtime, and test database setup.

- [x] **Step 2: Write failing tests**

Write backend tests that require durable import batches, row results, failed rows, and generated version records to survive across request/service calls.

- [x] **Step 3: Implement only the import foundation slice**

Implement database connection, migration entry, schema, and repository methods only for import batches, row results, failed rows, and version records.

- [x] **Step 4: Verify**

Run the DB migration/check command defined by DB002, backend tests for import persistence, `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.

- [x] **Step 5: Commit DB002**

Commit only DB002 files with message:

```bash
git commit -m "DB002 add import persistence foundation"
```

### Task 3: DB003 Master Data Persistence

**Files:**
- Implementation files: to be confirmed after DB002 lands.
- Tests: backend persistence tests for employees, suppliers, workplaces, projects, skills, and bindings.

- [x] **Step 1: Write failing tests for master data upsert and reference checks**

Tests must cover effective dates, freeze status, missing references, and binding validity.

- [x] **Step 2: Implement master data persistence**

Persist employees, suppliers, workplaces, projects, skills, and employee-project-workplace bindings.

- [x] **Step 3: Verify and commit**

Run the DB task verification commands and commit with:

```bash
git commit -m "DB003 add master data persistence"
```

### Task 4: DB004 Personnel Schedule Persistence

**Files:**
- Implementation files: to be confirmed after DB003 lands.
- Tests: backend persistence tests for schedule versions, details, shift references, and half-hour expansion records.

- [x] **Step 1: Write failing tests for personnel schedule versions**

Tests must cover shift-type reference checks, invalid time ranges, generated half-hour intervals, and version references.

- [x] **Step 2: Implement personnel schedule persistence**

Persist schedule versions, schedule details, and half-hour expansion output.

- [x] **Step 3: Verify and commit**

Run the DB task verification commands and commit with:

```bash
git commit -m "DB004 add personnel schedule persistence"
```

### Task 5: DB005-DB008 Later Persistence Slices

**Files:**
- Implementation files: to be confirmed per task.
- Tests: backend persistence tests per entity group.

- [x] **Step 1: DB005 persist forecast versions and interval rows**

Keep this slice focused on forecast versions, forecast interval rows, and import source references.

- [x] **Step 2: DB006 persist login and status logs**

Keep this slice focused on login events, status intervals, business-day normalization, timezone checks, and status dictionary mapping.

- [ ] **Step 3: DB007 persist comparison results**

Keep this slice focused on forecast-vs-schedule and schedule-vs-actual result storage and source record references.

- [ ] **Step 4: DB008 persist review closure records**

Keep this slice focused on supervisor review conclusions, evidence records, closure records, and source references.

- [ ] **Step 5: Run QA closeout**

Create `Q127` to verify the database foundation without adding permissions, approval, export, batch operations, settlement, charge factors, production formulas, or real external integrations.

## Self-Review

- DB001 is docs-only and does not implement database code.
- DB002 is the first implementation task because import batches and version records are upstream dependencies for all later data.
- Auth, permissions, approval, export, batch operations, external integrations, formulas, settlement, and charge factors remain explicitly deferred.
- No task above authorizes broad schema implementation beyond its named slice.
