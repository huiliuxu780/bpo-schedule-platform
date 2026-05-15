# Local Demo Import Placeholders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a localhost-only demo import loop for staff master, status log, and login log data, then wire visible dashboard/sidebar placeholders to that local demo state.

**Architecture:** Keep the backend as the source for local demo import state using standard-library CSV parsing and process/local-demo persistence only. The frontend adds a demo import page plus dashboard/status wiring through existing fetch helpers and shadcn-style components. The batch explicitly avoids database, ORM, migrations, real external integrations, auth, permissions, approval, export, batch operations, production formulas, and package changes.

**Tech Stack:** FastAPI, Pydantic, Python standard library `csv`, Next.js App Router, existing shadcn/ui components, Playwright smoke tests, existing `bash scripts/check.sh`.

---

### Task 1: Backend Local Demo Import Contract

**Files:**
- Modify: `backend/app/models.py`
- Create: `backend/app/demo_imports.py`
- Modify: `backend/app/main.py`
- Modify: `backend/tests/test_schedule_plans.py`

- [ ] Add Pydantic models for import kind, row errors, batch summary, import request, and import response.
- [ ] Implement CSV parsing with required columns:
  - `staff_master`: `staff_id,name,team,site,vendor,role,status`
  - `status_log`: `staff_id,date,start_time,end_time,status`
  - `login_log`: `staff_id,date,planned_login,actual_login,actual_logout,online_minutes`
- [ ] Add `POST /api/v1/demo-imports/{kind}` for CSV text submission.
- [ ] Add `GET /api/v1/demo-imports/batches` for latest batch summaries.
- [ ] Add backend tests that verify route registration, successful imports, row validation failures, and latest batch summaries.

### Task 2: Frontend Import Entry

**Files:**
- Create: `lib/demo-imports.ts`
- Create: `app/demo-imports/page.tsx`
- Modify: `components/app-sidebar.tsx`

- [ ] Add a small API client for demo import batch listing and CSV submission.
- [ ] Add a first-screen usable import page with three sections: 坐席主数据, 状态数据, 登录数据.
- [ ] Include visible CSV templates and paste textareas so the demo works without adding file parsing dependencies.
- [ ] Wire sidebar `文件导入`, `接入批次`, and `数据源管理` to `/demo-imports`.

### Task 3: Dashboard Placeholder Wiring

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `components/data-sync-status.tsx`
- Modify: `components/data-table.tsx`

- [ ] Fetch local demo import batch summaries on dashboard render.
- [ ] Render `坐席主数据`, `坐席状态数据`, and `登录数据` batch rows in 数据接入状态 when present.
- [ ] Replace dashboard anomaly row action placeholder with a local review/detail action label that is explainable in the demo.

### Task 4: Browser Smoke Coverage

**Files:**
- Modify: `tests/e2e/core-path.spec.ts`

- [ ] Add smoke coverage for `/demo-imports`.
- [ ] Verify the three import sections and batch/status surface are visible.
- [ ] Keep existing core path tests passing.

### Task 5: Traceability Closeout

**Files:**
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`

- [ ] Mark R138-R140, US150-US152, B008/F116/Q042 done after product verification.
- [ ] Record localhost-only, no-database, no-real-integration, no-package-change evidence.
- [ ] Run `bash scripts/check-state.sh --strict --diff=working`, `git diff --check`, `npm run e2e:smoke`, and `bash scripts/check.sh`.
- [ ] Commit the verified batch locally and ask PM before push.
