# B001 FastAPI Schedule Read API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development while implementing. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first backend vertical: a minimal Python + FastAPI read-only API for schedule plan list and detail data.

**Architecture:** Keep backend code under `backend/app`. Seed data lives in a repository module, API response contracts live in Pydantic models, and FastAPI routes live in `main.py`. Tests use Python `unittest` so B001 does not need extra test dependencies.

**Tech Stack:** Python 3.12, FastAPI, Pydantic, standard-library unittest.

---

### Task 1: Contract Tests

**Files:**
- Create: `backend/tests/test_schedule_plans.py`

- [ ] **Step 1: Write failing tests**

Write tests that import the future app and assert:

- `GET /api/v1/schedule-plans` route exists.
- `list_schedule_plans()` returns at least 3 plans.
- plan summaries include the required contract fields.
- `get_schedule_plan("missing")` raises 404 with code `SCHEDULE_PLAN_NOT_FOUND`.

- [ ] **Step 2: Run tests and verify RED**

Run: `python3 -m unittest discover -s backend/tests -v`

Expected: FAIL because `backend.app.main` does not exist yet.

### Task 2: Minimal Backend Implementation

**Files:**
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Create: `backend/app/models.py`
- Create: `backend/app/repository.py`
- Create: `backend/app/seed_data.py`
- Create: `backend/requirements.txt`
- Create: `backend/README.md`

- [ ] **Step 1: Implement models**

Create Pydantic response models for `SchedulePlanSummary`, `SchedulePlanInterval`, `SchedulePlanDetail`, `SchedulePlanListResponse`, and `ApiErrorResponse`.

- [ ] **Step 2: Implement seed data and repository**

Create at least three plan summaries and at least eight 0.5h intervals per plan.

- [ ] **Step 3: Implement FastAPI routes**

Create:

- `GET /api/v1/schedule-plans`
- `GET /api/v1/schedule-plans/{plan_id}`

- [ ] **Step 4: Run tests and verify GREEN**

Run: `python3 -m unittest discover -s backend/tests -v`

Expected: PASS.

### Task 3: Harness Integration

**Files:**
- Modify: `scripts/check.sh`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`

- [ ] **Step 1: Extend check script**

Add backend required-file checks and run `python3 -m unittest discover -s backend/tests -v` when `backend/tests` exists.

- [ ] **Step 2: Update Harness docs**

Mark `B001` as done and record the backend vertical in project logs.

- [ ] **Step 3: Run full verification**

Run:

- `git diff --check`
- `python3 -m unittest discover -s backend/tests -v`
- `bash scripts/check.sh`

Expected: all pass.
