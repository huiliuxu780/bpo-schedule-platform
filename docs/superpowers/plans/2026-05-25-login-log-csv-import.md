# Login Log CSV Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add local login log CSV upload/import using the existing import batch process-memory pattern.

**Architecture:** Extend the current CSV import pattern with a `login_log` entity, endpoint, mapper, upload mode, and detail rendering. Keep parsing and validation in the backend repository with standard-library CSV, and keep frontend API access inside `lib/import-batch-history.ts` plus the existing import-batch route group.

**Tech Stack:** FastAPI, Pydantic, Python `csv.DictReader`, Next.js App Router server actions, TypeScript model tests, existing shadcn/ui components.

---

### Task 1: Backend RED

**Files:**
- Modify: `backend/tests/test_schedule_plans.py`

- [ ] Add route, valid import, missing required field, and invalid time range tests for `POST /api/v1/import-batches/login-log`.
- [ ] Run `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v`.
- [ ] Expected: fail because `LoginLogCsvImportRequest` and `import_login_log_csv` do not exist yet.

### Task 2: Backend GREEN

**Files:**
- Modify: `backend/app/models.py`
- Modify: `backend/app/repository.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_schedule_plans.py`

- [ ] Add `LoginLogCsvImportRequest`.
- [ ] Add required field list and row validation for login log CSV.
- [ ] Add `import_login_log_csv` using the shared `ImportBatchResult` shape.
- [ ] Register `POST /api/v1/import-batches/login-log`.
- [ ] Run the backend unittest command until it passes.

### Task 3: Frontend RED

**Files:**
- Modify: `scripts/tests/import-batch-history.test.mjs`

- [ ] Add a model test that maps a `login_log` import result to the login log template and affected objects.
- [ ] Add a test for `createLoginLogImportBatch` using the same payload shape.
- [ ] Run `node --test scripts/tests/import-batch-history.test.mjs`.
- [ ] Expected: fail because the login log mapper/helper do not exist yet.

### Task 4: Frontend GREEN

**Files:**
- Modify: `lib/import-batch-history.ts`
- Modify: `app/import-batches/new/actions.ts`
- Modify: `app/import-batches/new/page.tsx`
- Modify: `app/import-batches/page.tsx`
- Test: `scripts/tests/import-batch-history.test.mjs`

- [ ] Add `LoginLogCsvImportPayload` and `createLoginLogImportBatch`.
- [ ] Update `mapImportBatchResult` for `login_log`.
- [ ] Add login log upload mode and required fields to `/import-batches/new`.
- [ ] Keep demand forecast and personnel schedule upload working.
- [ ] Run the frontend import-batch model test until it passes.

### Task 5: Verification And Traceability

**Files:**
- Modify: `docs/current/**`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/task-log.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] Run backend, frontend, copy, navigation, state, API/browser smoke, `git diff --check`, and final `bash scripts/check.sh`.
- [ ] Mark `US491-US493`, `B011/F369/Q087`, and trace docs done.
- [ ] Clear current queue and active tasks.
- [ ] Commit with `B011-F369 add login log csv import`.
