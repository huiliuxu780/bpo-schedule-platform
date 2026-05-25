# Import Batches Process List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show current process-memory CSV import results in the import batch list.

**Architecture:** The backend exposes a read-only list route over existing `IMPORT_BATCH_RESULTS`. The frontend `getImportBatches()` first reads that route, maps results through the existing mapper, deduplicates against fallback rows, and falls back when the API is unavailable.

**Tech Stack:** FastAPI, Pydantic, Python unittest, Next.js server data utilities, TypeScript node tests.

---

## File Structure

- Modify `backend/app/models.py`: add `ImportBatchListResponse`.
- Modify `backend/app/main.py`: add `GET /api/v1/import-batches`.
- Modify `backend/tests/test_schedule_plans.py`: test route registration and list ordering.
- Modify `lib/import-batch-history.ts`: fetch and merge process-memory results in `getImportBatches()`.
- Modify `scripts/tests/import-batch-history.test.mjs`: test API merge and fallback behavior.
- Modify Harness docs and logs for traceability.

## Tasks

### Task 1: State And Trace

- [ ] Add `US497-US499` to `docs/current/STORY_QUEUE.yaml`.
- [ ] Add `B013/F371/Q089` to `docs/current/ACTIVE_TASKS.yaml`.
- [ ] Add requirements, stories, backlog entries, trace index mappings, spec, and plan.
- [ ] Run `bash scripts/check-state.sh --strict`.

### Task 2: Backend Red-Green

- [ ] Write failing tests for `GET /api/v1/import-batches` and list ordering after CSV import calls.
- [ ] Run `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v`; expected failure is missing list route/model/function.
- [ ] Add backend response model and route using `list_process_import_batches()`.
- [ ] Rerun backend unittest; expected pass.

### Task 3: Frontend Red-Green

- [ ] Write failing tests for `getImportBatches()` fetching API rows and fallback on fetch failure.
- [ ] Run `node --test scripts/tests/import-batch-history.test.mjs`; expected failure is old fallback-only behavior.
- [ ] Update `getImportBatches()` to fetch, map, dedupe, and fallback.
- [ ] Rerun model tests and `npm run typecheck`; expected pass.

### Task 4: Smoke And Closeout

- [ ] Start local dev stack with `bash scripts/dev.sh`.
- [ ] POST a status log CSV to create a process-memory batch.
- [ ] Open `/import-batches` and verify the new batch appears in the list.
- [ ] Update audit, task log, branch log, current queue cleanup, and project state.
- [ ] Run final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit locally with `B013-F371 show process import batches`.
