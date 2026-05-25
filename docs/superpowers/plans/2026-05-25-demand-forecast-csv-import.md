# Demand Forecast CSV Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a demand forecast CSV local upload/import vertical with FastAPI process-memory batch results and frontend batch detail review.

**Architecture:** FastAPI owns CSV parsing, validation, batch id generation, failure-row records, and process-memory storage. Next server actions read the selected file text and call the local API using the existing `BPO_API_BASE_URL` pattern. Existing import-batch pages render a combined list of fallback batches and process-memory/import API results when available.

**Tech Stack:** Python 3.12, FastAPI, Pydantic, Python standard-library `csv`, Next.js server actions, React Server Components, TypeScript, shadcn/ui.

---

### Task 1: Backend CSV Import Contract

**Files:**
- Modify: `backend/app/models.py`
- Modify: `backend/app/repository.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_schedule_plans.py`

- [ ] **Step 1: Write failing backend tests**

Add tests that assert:

```python
self.assertIn(("/api/v1/import-batches/demand-forecast", "POST"), routes)
self.assertIn(("/api/v1/import-batches/{batch_id}", "GET"), routes)
```

Add a valid CSV test:

```python
response = import_demand_forecast_csv(
    DemandForecastCsvImportRequest(
        file_name="demand_forecast_test.csv",
        uploaded_by="数据管理员",
        csv_content=(
            "business_date,workplace_id,project_id,interval_start,interval_end,forecast_agents\n"
            "2026-05-26,WP-SH,P-BOSCH,09:00,09:30,18\n"
            "2026-05-26,WP-SH,P-BOSCH,09:30,10:00,20\n"
        ),
    )
)
self.assertEqual(response.status, "completed")
self.assertEqual(response.total_rows, 2)
self.assertEqual(response.success_rows, 2)
self.assertEqual(response.failed_rows, 0)
```

Add an invalid CSV test with missing `forecast_agents` and assert `failed_rows == 1`, `error_code == "missing_required_field"`, and `failed_row_number == 2`.

- [ ] **Step 2: Run backend tests and verify red**

Run:

```bash
/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v
```

Expected: tests fail because import request/response models and routes do not exist.

- [ ] **Step 3: Implement backend models and repository**

Add Pydantic models for `DemandForecastCsvImportRequest`, `ImportBatchFailureRow`, and `ImportBatchResult`. Add repository functions `import_demand_forecast_csv`, `get_import_batch_result`, and `list_process_import_batches`. Parse CSV with `csv.DictReader`; validate required headers and rows; store results in a module-level dictionary.

- [ ] **Step 4: Add FastAPI routes**

Add:

```python
@app.post("/api/v1/import-batches/demand-forecast", response_model=ImportBatchResult)
def import_demand_forecast_csv_route(request: DemandForecastCsvImportRequest) -> ImportBatchResult:
    return import_demand_forecast_csv(request)

@app.get("/api/v1/import-batches/{batch_id}", response_model=ImportBatchResult)
def get_import_batch_result_route(batch_id: str) -> ImportBatchResult:
    result = get_import_batch_result(batch_id)
    if result is None:
        raise HTTPException(status_code=404, detail={"error": {"code": "IMPORT_BATCH_NOT_FOUND", "message": "导入批次不存在"}})
    return result
```

- [ ] **Step 5: Run backend tests and verify green**

Run:

```bash
/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v
```

Expected: all backend tests pass.

### Task 2: Frontend API Client and Upload Page

**Files:**
- Modify: `lib/import-batch-history.ts`
- Create: `app/import-batches/new/actions.ts`
- Create: `app/import-batches/new/page.tsx`
- Modify: `app/import-batches/page.tsx`
- Modify: `app/import-batches/[batchId]/page.tsx`
- Test: `scripts/tests/import-batch-history.test.mjs`

- [ ] **Step 1: Write failing frontend model tests**

Add tests that map an `ImportBatchResult` into `ImportBatch`, preserve failure row details, and summarize a new process-memory batch with the fallback list.

- [ ] **Step 2: Run frontend model tests and verify red**

Run:

```bash
node --test scripts/tests/import-batch-history.test.mjs
```

Expected: tests fail because mapping helpers and failure row fields do not exist.

- [ ] **Step 3: Implement client helpers**

Add `ImportBatchFailureRow`, `ImportBatchResult`, `mapImportBatchResult`, `getImportBatches`, `getImportBatch`, and `createDemandForecastImportBatch`. Use `BPO_API_BASE_URL` with fallback behavior.

- [ ] **Step 4: Add upload page and action**

Create `/import-batches/new` with a file input accepting `.csv`. The server action reads `File.text()`, calls `createDemandForecastImportBatch`, and redirects to `/import-batches/{batchId}`.

- [ ] **Step 5: Update list and detail pages**

List page shows an upload button and uses `getImportBatches()`. Detail page uses `getImportBatch(batchId)` and renders failure row details when present.

- [ ] **Step 6: Run frontend model tests and verify green**

Run:

```bash
node --test scripts/tests/import-batch-history.test.mjs
```

Expected: tests pass.

### Task 3: Verification and Traceability

**Files:**
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `tasks/backlog.yaml`

- [ ] **Step 1: Run strict state check**

Run:

```bash
bash scripts/check-state.sh --strict
```

Expected: strict state passes while stories/tasks are active.

- [ ] **Step 2: Run focused checks**

Run:

```bash
/Users/mac/.local/bin/python3 -m unittest discover -s backend/tests -v
node --test scripts/tests/import-batch-history.test.mjs
npm run lint
npm run typecheck
```

Expected: all checks pass.

- [ ] **Step 3: Browser smoke**

Run `bash scripts/dev.sh`, open `/import-batches/new`, upload a CSV with one valid row and one invalid row, verify redirect to batch detail, and confirm success/failed rows and failure-row message render.

- [ ] **Step 4: Close current state and audit docs**

Clear `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml`, record completion in audit, task log, branch log, and project state.

- [ ] **Step 5: Final verification and commit**

Run:

```bash
git diff --check
bash scripts/check.sh
git add <scoped files>
git commit -m "B009-F367 add demand forecast csv import"
```

Expected: final check passes and local commit contains only scoped files.
