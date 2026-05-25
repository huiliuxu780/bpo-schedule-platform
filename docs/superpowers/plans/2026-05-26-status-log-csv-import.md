# Status Log CSV Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the local-only status log CSV upload/import vertical.

**Architecture:** Reuse the existing process-memory import batch model and frontend import page. Add one backend route plus validation helper, then add one frontend import type and mapper branch.

**Tech Stack:** FastAPI, Pydantic, Python standard-library `csv`, Next.js server actions, TypeScript model tests, unittest.

---

## File Structure

- Modify `backend/app/models.py`: add `StatusLogCsvImportRequest`.
- Modify `backend/app/repository.py`: add required headers, import function, and row validator.
- Modify `backend/app/main.py`: register `POST /api/v1/import-batches/status-log`.
- Modify `backend/tests/test_schedule_plans.py`: add route, valid-row, missing-field, and invalid-time tests.
- Modify `lib/import-batch-history.ts`: map `status_log` and expose `createStatusLogImportBatch`.
- Modify `scripts/tests/import-batch-history.test.mjs`: add status-log mapper/helper test.
- Modify `app/import-batches/new/actions.ts`: add status-log server action.
- Modify `app/import-batches/new/page.tsx`: add status-log mode, copy, and fields.
- Modify Harness docs and logs for traceability.

## Tasks

### Task 1: State And Trace

- [ ] Add `US494-US496` to `docs/current/STORY_QUEUE.yaml`.
- [ ] Add `B012/F370/Q088` to `docs/current/ACTIVE_TASKS.yaml`.
- [ ] Add `R494-R497`, user stories, backlog entries, and trace index mappings.
- [ ] Run `bash scripts/check-state.sh --strict`.

### Task 2: Backend Red-Green

- [ ] Write failing tests importing `StatusLogCsvImportRequest` and `import_status_log_csv`.
- [ ] Run `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v`; expected failure is missing status-log request/function.
- [ ] Add backend model, repository function, validator, and route.
- [ ] Rerun backend unittest; expected pass.

### Task 3: Frontend Red-Green

- [ ] Write failing model test importing `createStatusLogImportBatch`.
- [ ] Run `node --test scripts/tests/import-batch-history.test.mjs`; expected failure is missing export.
- [ ] Add status-log entity mapping, helper, server action, and page mode.
- [ ] Rerun model test and `npm run typecheck`; expected pass.

### Task 4: Smoke And Closeout

- [ ] Start local dev stack with `bash scripts/dev.sh`.
- [ ] POST a mixed valid/invalid status-log CSV to `/api/v1/import-batches/status-log`.
- [ ] Open upload and batch detail pages in browser and verify visible status-log fields and failure row copy.
- [ ] Update audit, task log, branch log, current queue cleanup, and project state.
- [ ] Run final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit locally with `B012-F370 add status log csv import`.
