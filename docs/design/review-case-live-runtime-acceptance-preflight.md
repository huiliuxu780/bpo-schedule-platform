# IM238 Review Case Live Runtime Acceptance Preflight

Date: 2026-06-24
Requirement: R937
Story: US857
Task: IM238
Status: Preflight — ready for Gate Plan confirmation, not live-accepted

## 1. Acceptance Goal

Verify that the review-case workspace (list + detail + action deck) renders real seeded data through the live frontend (port 3000) and live backend API (port 8000), completing the acceptance that IM215 could not finish because the backend was unavailable.

This is a **runtime read-acceptance** task. It does not add new features, fix code, or change business logic. It confirms that the existing review-case surface works end-to-end when both runtimes are reachable.

## 2. Page Paths

| Path | Responsibility | Server-rendered |
| --- | --- | --- |
| `/data-quality/review-cases` | List workspace: triage, filters, processing-stage derivation, owner workload | Yes (`force-dynamic`) |
| `/data-quality/review-cases?processingStage=missing_evidence` | Filtered list: missing evidence | Yes |
| `/data-quality/review-cases?processingStage=missing_conclusion` | Filtered list: missing conclusion | Yes |
| `/data-quality/review-cases?processingStage=ready_to_close` | Filtered list: ready to close | Yes |
| `/data-quality/review-cases?processingStage=closed` | Filtered list: closed cases | Yes |
| `/data-quality/review-cases/CASE-QUERY-001` | Detail workspace: overview, evidence, conclusion, closure, owner context, timeline | Yes |
| `/data-quality/review-cases/CASE-QUERY-001?evidence=failed` | Failed evidence submit feedback | Yes |
| `/data-quality/review-cases/CASE-QUERY-001?closure=success` | Closure success handoff feedback | Yes |
| `/data-quality/review-cases/CASE-QUERY-001?conclusion=failed` | Failed conclusion submit feedback | Yes |

## 3. API / Runtime Prerequisites

### Backend API Endpoints Required

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/review-cases` (with query filters) | List page data source |
| GET | `/api/v1/review-cases/{case_id}` | Detail page data source + processing-stage snapshots |
| POST | `/api/v1/review-cases/{case_id}/evidence` | Evidence write (action deck) |
| POST | `/api/v1/review-cases/{case_id}/conclusion` | Conclusion write (action deck) |
| POST | `/api/v1/review-cases/write-closure` | Closure write (action deck) |

### Seed Data

- Base seed function: `backend/app/review_demo_seed.py :: seed_review_case_demo()`
- Stage matrix seed function: `backend/app/review_demo_seed.py :: seed_review_case_stage_matrix()` (added by IM239)
- Seed case ID: `CASE-QUERY-001`
- Seed is **idempotent** (returns existing if already created)
- Seed is **NOT auto-run** at backend startup — no `lifespan`, `on_event("startup")`, or similar hook exists in `backend/app/main.py`
- Seed creates upstream dependencies: import batch, master data snapshot, forecast version, schedule version, comparison run, then the review case with evidence + conclusion
- Seed does **NOT** close the case — `ReviewClosureWriteRequest.closure` defaults to `None`, so `write_review_closure()` skips `repository.close_case()`. The seeded case remains `status="open"` with evidence + conclusion but no closure record, yielding processing stage `ready_to_close`

### Runtime Conditions

| Condition | Value |
| --- | --- |
| Frontend port | `127.0.0.1:3000` (Next.js dev server) |
| Backend port | `127.0.0.1:8000` (FastAPI/uvicorn) |
| Database | SQLite (default local path configured by backend) |
| Seed invocation | Manual only. Base seed: `python -m backend.app.review_demo_seed`; full stage matrix: call `seed_review_case_stage_matrix()` explicitly before runtime smoke. |
| Node.js | 22.x via `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin` |

### Seed Stage Coverage (After IM239)

Processing stage derivation logic (`summarizeImportReviewCaseProcessingStage` in `import-center-review-model.ts`):

1. `case.status === "closed"` OR `closure !== null` → `closed`
2. Detail snapshot unavailable → `unknown`
3. `evidenceCount === 0` → `missing_evidence`
4. `conclusionCount === 0` → `missing_conclusion`
5. Otherwise → `ready_to_close`

| Processing Stage | Covered by Stage Matrix Seed? | Reason |
| --- | --- | --- |
| `missing_evidence` | **Yes** | `CASE-SEED-ME-001`: status=open, 0 evidence, 0 conclusions, no closure record |
| `missing_conclusion` | **Yes** | `CASE-SEED-MC-001`: status=open, 1 evidence, 0 conclusions, no closure record |
| `ready_to_close` | **Yes** | `CASE-QUERY-001`: status=open, 1 evidence, 1 conclusion, no closure record |
| `closed` | **Yes** | `CASE-SEED-CL-001`: status=open with evidence, conclusion, and closure record; frontend treats closure-backed cases as closed |

### Seed Extension Implementation (IM239)

IM239 adds **3 additional cases** through a new explicit `seed_review_case_stage_matrix()` function. It uses existing `ReviewCaseCreateRequest`, `ReviewEvidenceInput`, `ReviewConclusionInput`, and `ReviewClosureInput` models only.

| Case ID | Target Stage | Records |
| --- | --- | --- |
| `CASE-SEED-ME-001` | `missing_evidence` | Case only (status=open, no evidence, no conclusion). Needs a valid `source_result_id` from a comparison run. |
| `CASE-SEED-MC-001` | `missing_conclusion` | Case + 1 evidence (status=open, 1 evidence, no conclusion). |
| `CASE-SEED-CL-001` | `closed` | Case + 1 evidence + 1 conclusion + `ReviewClosureInput(closure_id, case_id, closure_status="closed", closed_by)`. `review_cases.status` remains open; closure record is the closed signal. |

All three cases can share the same upstream `source_result_id` from the existing `_ensure_forecast_schedule_result()` helper, since it returns a valid `result_id` and is idempotent.

Implementation note: IM239 did not change `ReviewPersistenceRepository`, `write_review_closure()`, API endpoints, schema, dependencies, startup hooks, or frontend code.

## 4. PM Manual Acceptance Checklist

These checks can be performed by PM in a browser after both runtimes are running and seed data is loaded:

- [ ] `/data-quality/review-cases` renders a non-empty list with `CASE-QUERY-001`
- [ ] List shows correct summary cards: totals, open count, high-risk open count, owner count
- [ ] Processing-stage filters return expected subsets: current seed should appear under `ready_to_close`; `missing_evidence`, `missing_conclusion`, and `closed` require additional seed data or explicit closure action before they can be non-empty live checks
- [ ] `/data-quality/review-cases/CASE-QUERY-001` renders full detail: overview tab, evidence records, conclusion records, closure state, owner context, processing timeline
- [ ] Action deck shows correct state for `CASE-QUERY-001` (which has evidence + conclusion but no closure — should show `ready_to_close` state, not closed)
- [ ] `?evidence=failed` URL parameter produces visible failed feedback
- [ ] `?closure=success` URL parameter produces visible success feedback
- [ ] `?conclusion=failed` URL parameter produces visible failed feedback
- [ ] Owner context panel shows same-owner cases and pending navigation
- [ ] Breadcrumb navigation: detail → list works correctly

## 5. Automated Smoke Candidates

These are candidates for future automation, not part of this preflight:

| Candidate | Type | Current Status |
| --- | --- | --- |
| `frontend-api-utilities.test.mjs` | Unit | Already passing — confirms review-case URLs use shared helpers |
| `shared-empty-state.test.mjs` | Unit | Already passing — confirms shared empty-state component |
| `import-center-review-case-*.test.mjs` (17 files) | Unit | Already passing in `check.sh` — model/contract coverage |
| `backend/tests/test_review_demo_seed.py` | Unit | Already passing — base seed + stage matrix idempotency and coverage |
| `backend/tests/test_review_evidence_api.py` | Unit | Already passing — evidence write route + response |
| `backend/tests/test_review_conclusion_api.py` | Unit | Already passing — conclusion write route + response |
| Live route HTTP smoke | Integration | Not yet automated — would require running backend + frontend |
| Live detail page data render | Integration | Not yet automated — would require seed + backend + frontend |

## 6. Future Live Runtime Smoke Sequence (Design Only, Not Implemented)

> **Every step below requires a PM-confirmed live runtime.** No step may be executed without explicit PM approval to start backend on `127.0.0.1:8000` and frontend on `127.0.0.1:3000`. This sequence is a design document, not an executable script.

### Prerequisites (Must Pass Before Step 1)

- PM has confirmed both runtimes may be started.
- Stage matrix seed (Section 3, `CASE-SEED-ME-001`, `CASE-SEED-MC-001`, `CASE-SEED-CL-001`) has been invoked explicitly before Steps 5b–5d.
- `bash scripts/check.sh` has passed on the current branch before any runtime is started.

### Step 1 — Backend Health

**Target:** `GET http://127.0.0.1:8000/docs` (FastAPI auto-generated OpenAPI page)

**Expected:** HTTP 200, HTML response containing API documentation.

**Hard stop if:** connection refused, timeout, or non-200 status. Do not proceed to Step 2.

**PM gate:** backend runtime must be running before this step.

### Step 2 — Seed Invocation

**Target:** Manual execution of the stage matrix seed, for example by calling `seed_review_case_stage_matrix()` from `backend.app.review_demo_seed`.

**Expected:** Process exits 0 and creates `CASE-QUERY-001`, `CASE-SEED-ME-001`, `CASE-SEED-MC-001`, and `CASE-SEED-CL-001`.

**Idempotency check:** Run seed a second time; must exit 0 and return the same cases without duplicating records.

**Hard stop if:** seed exits non-zero, prints an error, or any of the four expected case IDs is absent from the subsequent `GET /api/v1/review-cases` response. Do not proceed to Step 3.

### Step 3 — List Page

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases`

**Expected:**

- HTTP 200.
- Response body contains `CASE-QUERY-001` (case ID visible in rendered HTML or JSON payload).
- Response body does **not** contain `复核案例读取失败` or `fetch failed` (these indicate backend unreachable).

**PM gate:** frontend runtime must be running before this step.

**Hard stop if:** HTTP non-200, page body contains fetch failure text, or `CASE-QUERY-001` is absent. Do not proceed to Step 4.

### Step 4 — Detail Page

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001`

**Expected:**

- HTTP 200.
- Response body contains evidence ID `EVD-QUERY-001` and conclusion ID `CON-QUERY-001`.
- Response body does **not** contain `复核案例读取失败`.

**Hard stop if:** HTTP non-200, fetch failure text present, or expected IDs absent. Do not proceed to Step 5.

### Step 5 — Processing-Stage Filters

Each sub-step below targets a different `processingStage` filter. Steps 5b–5d require the IM239 stage matrix seed to be invoked before runtime smoke.

#### 5a. `ready_to_close`

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=ready_to_close`

**Expected:** HTTP 200, body contains `CASE-QUERY-001`.

#### 5b. `missing_evidence` (requires `CASE-SEED-ME-001`)

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=missing_evidence`

**Expected:** HTTP 200, body contains `CASE-SEED-ME-001`.

**Hard stop if:** stage matrix seed was not invoked before this check.

#### 5c. `missing_conclusion` (requires `CASE-SEED-MC-001`)

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=missing_conclusion`

**Expected:** HTTP 200, body contains `CASE-SEED-MC-001`.

**Hard stop if:** stage matrix seed was not invoked before this check.

#### 5d. `closed` (requires `CASE-SEED-CL-001`)

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=closed`

**Expected:** HTTP 200, body contains `CASE-SEED-CL-001`.

**Hard stop if:** stage matrix seed was not invoked before this check.

### Step 6 — URL Feedback Parameters

These steps verify that the detail page renders action-feedback UI from URL search parameters. They do **not** exercise real write APIs (no POST to evidence/conclusion/closure endpoints).

#### 6a. Evidence failed feedback

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001?evidence=failed`

**Expected:** HTTP 200, body contains evidence-failed feedback text (e.g. `补证据提交失败`).

#### 6b. Conclusion failed feedback

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001?conclusion=failed`

**Expected:** HTTP 200, body contains conclusion-failed feedback text.

#### 6c. Closure success feedback

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001?closure=success`

**Expected:** HTTP 200, body contains closure-success feedback text (e.g. `关闭案例提交成功`).

### Smoke Sequence Summary

| Step | Target | Stage Matrix Seed Sufficient? | PM Runtime Required? |
| --- | --- | --- | --- |
| 1. Backend health | `GET :8000/docs` | N/A | Yes |
| 2. Seed invocation | explicit `seed_review_case_stage_matrix()` call | Yes | Yes |
| 3. List page | `GET :3000/data-quality/review-cases` | Yes | Yes |
| 4. Detail page | `GET :3000/.../CASE-QUERY-001` | Yes | Yes |
| 5a. `ready_to_close` filter | `?processingStage=ready_to_close` | Yes | Yes |
| 5b. `missing_evidence` filter | `?processingStage=missing_evidence` | Yes — `CASE-SEED-ME-001` | Yes |
| 5c. `missing_conclusion` filter | `?processingStage=missing_conclusion` | Yes — `CASE-SEED-MC-001` | Yes |
| 5d. `closed` filter | `?processingStage=closed` | Yes — `CASE-SEED-CL-001` | Yes |
| 6a. `?evidence=failed` | Detail page + URL param | Yes | Yes |
| 6b. `?conclusion=failed` | Detail page + URL param | Yes | Yes |
| 6c. `?closure=success` | Detail page + URL param | Yes | Yes |

### Smoke Hard Stops

- Any step returning HTTP non-200 or connection refused.
- Seed exits non-zero or does not produce expected case.
- Page body contains `复核案例读取失败` or `fetch failed` (backend unreachable from frontend).
- Expected case IDs or feedback text absent from response body.
- Any step requires new dependencies, package changes, or database migration.
- Any step reveals a real backend error (500, unhandled exception) rather than a graceful empty state.

### What This Smoke Is Not

This smoke sequence is a **read-only acceptance check**. It does not:

- Create, modify, or delete any review-case records via live API.
- Implement approval, permission, export, batch operations, or any new business capability.
- Replace the existing automated unit test surface (17 frontend test files + backend test suite).
- Claim that the review-case workspace is production-ready.

## 7. What Can Be Verified Without Backend 8000 Runtime

| Check | Requires Backend? | Current Status |
| --- | --- | --- |
| Frontend route returns HTTP 200 | No (only Next.js needed) | Verified in IM215: all routes return 200 |
| Page renders error state gracefully | No | Verified in IM215: shows "复核案例读取失败" |
| URL feedback parameters produce feedback UI | No | Verified in IM215: `?evidence=failed` and `?closure=success` work |
| Model/contract unit tests | No | 17 review-case test files pass in `check.sh` |
| Seed function creates valid data | No (unit test) | `test_review_demo_seed.py` passes |
| Backend API routes are registered | No (unit test) | `test_review_evidence_api.py`, `test_review_conclusion_api.py` pass |
| **List page renders real seeded data** | **Yes** | **Not yet verified** |
| **Detail page renders real case detail** | **Yes** | **Not yet verified** |
| **Action deck shows correct processing stage** | **Yes** | **Not yet verified** |
| **Processing-stage filters return correct subsets** | **Yes** | **Not yet verified** |

## 8. Stop Conditions

Hard stops requiring PM confirmation:

- Backend runtime is not available or cannot be started in the current environment
- Seed function fails or produces unexpected data
- Frontend dev server cannot reach backend on `127.0.0.1:8000`
- Any review-case page shows a runtime error (not a graceful "fetch failed" empty state)
- Seeded data does not match expected case structure (missing evidence, conclusion, or closure records)
- New dependencies, package changes, database connection configuration, or migration required
- Any change to permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors

## 9. Non-Goals

This task does **not**:

- Implement new review-case features
- Add approval, permission, or role-based access control
- Add export, download, or batch operations
- Add reopen, reassign, escalate, SLA, or notification capabilities
- Connect to real external APIs or third-party evidence services
- Modify database schema, dependencies, or package files
- Change production status codes, formulas, settlement rules, or charge factors
- Modify business code during the live acceptance run
- Treat the current draft PR #2 as merged or the baseline as stable

## 10. Bounded Qoder Task Packets

These packets are for manual delegation. Qoder must not write `docs/current/**` or `docs/registry/**`; Codex remains the single writer for current state, final diff review, verification, commit, and push.

### Packet A — Preflight Document QA

Allowed files:

- `docs/design/review-case-live-runtime-acceptance-preflight.md`

Forbidden files:

- `docs/current/**`
- `docs/registry/**`
- `app/**`
- `components/**`
- `hooks/**`
- `lib/**`
- `backend/**`
- `scripts/check.sh`
- package or lock files

Task:

- Review this document for contradictions with the actual review-case frontend and backend code.
- Verify all page paths, API endpoint paths, query parameters, seed case ID, and runtime assumptions by reading source files only.
- Tighten wording where it could imply live runtime acceptance has already passed.
- Do not add product UI copy, implementation code, or runtime commands that auto-start services.

Return:

- Files changed.
- Source files read.
- Any corrected assumptions.
- Verification command result for `git diff --check`.

### Packet B — Runtime Smoke Script Design, No Implementation

Allowed files:

- `docs/design/review-case-live-runtime-acceptance-preflight.md`

Forbidden files:

- `scripts/**`
- `docs/current/**`
- `docs/registry/**`
- `app/**`
- `components/**`
- `backend/**`
- package or lock files

Task:

- Add a future automation section that describes the smoke sequence without implementing it.
- The sequence should cover backend health, seed invocation, list page HTTP, detail page HTTP, stage filter URLs, and feedback URL parameters.
- Mark every live call as requiring PM-confirmed runtime.
- Do not create scripts, tests, Playwright specs, or shell wrappers.

Return:

- Proposed smoke sequence.
- Hard stop list.
- Confirmation that no runtime was started.

### Packet C — Seed Coverage Gap Analysis, Read-Only

Allowed files:

- No writes by default. If a note is needed, write only `docs/design/review-case-live-runtime-acceptance-preflight.md`.

Forbidden files:

- `backend/**`
- `app/**`
- `components/**`
- `docs/current/**`
- `docs/registry/**`
- package or lock files

Task:

- Read `backend/app/review_demo_seed.py` and the review-case API/service tests.
- Confirm which processing stages the existing seed can and cannot support.
- Identify the smallest future seed extension needed to cover `missing_evidence`, `missing_conclusion`, and `closed`; existing `CASE-QUERY-001` already covers `ready_to_close`. Do not implement the extension.

Return:

- Stage coverage matrix.
- Future seed extension recommendation.
- Confirmation that no backend code was changed and no runtime was started.

## 11. Implemented Gate: Review Case Stage Seed Extension (IM239)

> This section records the IM239 seed extension implementation. It prepares live runtime acceptance data only; it does not start runtime services and does not claim live acceptance has passed.

### 11.1 Why Seed Extension Is Needed

The base `seed_review_case_demo()` creates a single case (`CASE-QUERY-001`) that covers only `ready_to_close`. The review-case list workspace supports four processing-stage filters (`missing_evidence`, `missing_conclusion`, `ready_to_close`, `closed`), so live runtime acceptance needs a seed matrix to verify all four.

Without the matrix, PM live acceptance of the other three stage filters would show empty results, which cannot distinguish between "filter works correctly and returns zero matches" and "filter is broken."

### 11.2 Target Coverage

| Processing Stage | IM239 Coverage | Evidence |
| --- | --- | --- |
| `missing_evidence` | Covered | `CASE-SEED-ME-001` has no evidence, no conclusion, no closure |
| `missing_conclusion` | Covered | `CASE-SEED-MC-001` has evidence, no conclusion, no closure |
| `ready_to_close` | Covered | `CASE-QUERY-001` has evidence and conclusion, no closure |
| `closed` | Covered | `CASE-SEED-CL-001` has a closure record |

### 11.3 Proposed Seed Extension Cases

| Case ID | Stage | Records | Construction |
| --- | --- | --- | --- |
| `CASE-SEED-ME-001` | `missing_evidence` | Case only (status=open, no evidence, no conclusion) | `repository.create_review_case(ReviewCaseCreateRequest(...))` with valid `source_result_id` from `_ensure_forecast_schedule_result()` |
| `CASE-SEED-MC-001` | `missing_conclusion` | Case + 1 evidence (status=open, 1 evidence, no conclusion) | `create_review_case()` + `add_evidence()` |
| `CASE-SEED-CL-001` | `closed` | Case + 1 evidence + 1 conclusion + closure record | `write_review_closure(ReviewClosureWriteRequest(case=..., evidence=[...], conclusions=[...], closure=ReviewClosureInput(...)))`; `review_cases.status` remains open |

All three cases share the same `source_result_id` from `_ensure_forecast_schedule_result()` (idempotent).

### 11.4 Implemented Files

- `backend/app/review_demo_seed.py` — added `seed_review_case_stage_matrix()`
- `backend/tests/test_review_demo_seed.py` — added unit tests for stage coverage, idempotency, and `created_at` stability

### 11.5 Forbidden Files and Behaviors Preserved

- No changes to `backend/app/review_persistence.py`, `review_closure.py`, `review_evidence.py`, `review_conclusion.py`, or `main.py`
- No changes to `app/**`, `components/**`, `hooks/**`, `lib/**`
- No changes to `scripts/check.sh` or test gate configuration
- No changes to `package.json`, lockfiles, or dependencies
- No database schema changes or migrations
- No approval, permission, export, batch operations, production formulas, settlement rules, or charge factors
- No auto-startup hooks (`lifespan`, `on_event("startup")`) that would run seed without explicit PM confirmation

### 11.6 Acceptance Commands

These commands remain the acceptance surface:

- `node --test scripts/tests/import-center-review-case-*.test.mjs` — frontend model tests (no runtime needed)
- `python -m unittest backend.tests.test_review_demo_seed -v` — seed unit tests (no runtime needed)
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` — full gate (no runtime needed)
- Smoke sequence from Section 6 — live runtime acceptance (PM-confirmed runtime required)

### 11.7 Stop Conditions For Next Runtime Task

- Seed extension fails to create expected cases or breaks existing `CASE-QUERY-001` idempotency.
- New seed function introduces side effects outside `review_demo_seed.py`.
- Backend unit tests fail after seed extension.
- `bash scripts/check.sh` fails after seed extension.
- PM does not confirm backend runtime availability for live acceptance.
- Any change requires new dependencies, database migration, or schema changes.

### 11.8 PM Decision Points

PM must decide:

1. **Run full runtime smoke**: Start the PM-confirmed backend/frontend runtime and execute Section 6 with the stage matrix seed.

2. **Defer runtime smoke**: Keep IM238/IM239 as preflight + seed evidence only, without claiming live seeded acceptance.

3. **Add automation before runtime**: Define a separate task for an executable smoke script; do not add it inside IM239.

## 12. Runtime Smoke Evidence (IM240)

This section records the PM-confirmed local runtime smoke. It is local runtime evidence only; it does not claim production readiness, write-action acceptance, permission coverage, PR merge readiness, or external integration readiness.

### 12.1 Runtime Setup

- Branch: `codex/im237-harness-review-case-integration`
- Database: isolated `.local/im240-runtime-smoke.db`
- Seed call: explicit `seed_review_case_stage_matrix()`
- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:3002`
- Port note: existing BPO Next dev on `3000` was stale and unresponsive while holding `.next/dev/lock`; it was stopped before starting frontend on `3002`. `3001` belonged to `wikinode-studio` and was left untouched.

### 12.2 Seed Evidence

| Case ID | Status | Evidence | Conclusions | Closure |
| --- | --- | ---: | ---: | --- |
| `CASE-QUERY-001` | `open` | 1 | 1 | false |
| `CASE-SEED-ME-001` | `open` | 0 | 0 | false |
| `CASE-SEED-MC-001` | `open` | 1 | 0 | false |
| `CASE-SEED-CL-001` | `open` | 1 | 1 | true |

### 12.3 Smoke Checks

| Check | Result |
| --- | --- |
| `GET /docs` | 200 |
| `GET /api/v1/review-cases` | 200 and contains all four seed case IDs |
| `/data-quality/review-cases` | 200 and contains all four seed case IDs |
| `/data-quality/review-cases/CASE-QUERY-001` | 200 and contains `CASE-QUERY-001` plus `可关闭` |
| `?processingStage=ready_to_close` | 200 and contains `CASE-QUERY-001` |
| `?processingStage=missing_evidence` | 200 and contains `CASE-SEED-ME-001` |
| `?processingStage=missing_conclusion` | 200 and contains `CASE-SEED-MC-001` |
| `?processingStage=closed` | 200 and contains `CASE-SEED-CL-001` |
| `?evidence=failed` | 200 and contains `补证据提交失败` |
| `?conclusion=failed` | 200 and contains `补结论提交失败` |
| `?closure=success` | 200 and contains `关闭案例提交成功` |

### 12.4 Non-Goals Preserved

- No POST write-action smoke.
- No product UI, backend implementation, API route, schema, dependency, or package/lockfile changes.
- No production readiness claim.
- No permission, approval, export, batch-operation, production formula, settlement, or charge-factor coverage.

## 13. Write Action Runtime Smoke Evidence (IM241)

This section records the PM-confirmed local write-action runtime smoke. It is local runtime evidence only; it does not claim production readiness, permission coverage, approval coverage, PR merge readiness, or external integration readiness.

### 13.1 Runtime Setup

- Branch: `codex/im237-harness-review-case-integration`
- Database: isolated `.local/im241-review-case-action-smoke.db`
- Database environment: `BPO_DATABASE_URL=sqlite+pysqlite:///./.local/im241-review-case-action-smoke.db`
- Seed call: explicit `seed_review_case_stage_matrix()`
- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:3002`

### 13.2 Seed Evidence

| Case ID | Status | Evidence | Conclusions | Closure |
| --- | --- | ---: | ---: | --- |
| `CASE-QUERY-001` | `open` | 1 | 1 | false |
| `CASE-SEED-ME-001` | `open` | 0 | 0 | false |
| `CASE-SEED-MC-001` | `open` | 1 | 0 | false |
| `CASE-SEED-CL-001` | `open` | 1 | 1 | true |

### 13.3 Smoke Checks

| Check | Result |
| --- | --- |
| `GET /docs` | 200 |
| `GET /api/v1/review-cases` | 200 and contains all four seed case IDs |
| `POST /api/v1/review-cases/CASE-SEED-ME-001/evidence` | 200 and returns `EVD-SMOKE-ME-001` |
| `GET /api/v1/review-cases/CASE-SEED-ME-001` | 200 and detail includes `IM241 smoke evidence` |
| `POST /api/v1/review-cases/CASE-SEED-MC-001/conclusion` | 200 and returns `CON-SMOKE-MC-001` |
| `GET /api/v1/review-cases/CASE-SEED-MC-001` | 200 and detail includes `IM241 smoke conclusion` |
| `POST /api/v1/review-cases/write-closure` for `CASE-QUERY-001` | 200 and returns `CLO-SMOKE-001` |
| `GET /api/v1/review-cases/CASE-QUERY-001` | 200 and closure remains visible without duplicating evidence/conclusions |
| `POST /api/v1/review-cases/CASE-SEED-CL-001/evidence` | 400 and returns `REVIEW_EVIDENCE_INVALID` |
| `POST /api/v1/review-cases/CASE-SEED-CL-001/conclusion` | 400 and returns `REVIEW_CONCLUSION_INVALID` |
| Repeated `POST /api/v1/review-cases/write-closure` for `CASE-SEED-CL-001` | 200 and keeps original `CLO-SEED-CL-001` |
| `?evidence=success` | 200 and contains `补证据提交成功` |
| `?conclusion=success` | 200 and contains `补结论提交成功` |
| `?closure=success` | 200 and contains `关闭案例提交成功` |
| `?evidence=failed` | 200 and contains `补证据提交失败` |

### 13.4 Non-Goals Preserved

- No product UI, backend implementation, API route, schema, dependency, or package/lockfile changes.
- No Playwright form-click E2E smoke.
- No production readiness claim.
- No permission, approval, export, batch-operation, production formula, settlement, or charge-factor coverage.

## 14. Unblock Path

If PM wants to proceed with this acceptance:

1. Confirm backend runtime can be started on `127.0.0.1:8000`
2. Confirm seed data should be loaded (manually or via startup hook)
3. Confirm whether acceptance is PM-driven (manual browser walk) or Codex-driven (HTTP smoke via curl/agent)
4. Decide whether PR #2 should be merged to `main` before this task starts, or whether acceptance runs on the feature branch

## 15. Form-Click E2E Feasibility Decision (IM242)

> This section records the IM242 decision on whether to automate browser-level form-click E2E for the three review-case write actions. It is a decision record only; it does not implement automation, install dependencies, or start runtime services.

### 15.1 Decision

**Not recommended for automated E2E in the current `qa` gate.**

Form-click E2E automation should not be pursued inside the current acceptance scope. The remaining verification gap is low-risk and is better served by HTTP smoke evidence (IM241) combined with a PM manual browser walkthrough.

### 15.2 Reasons

1. **No Playwright infrastructure exists.** `package.json` (both `dependencies` and `devDependencies`) does not include `@playwright/test`. `node_modules/@playwright/` is empty. No `playwright.config.ts` or E2E test directory exists in the repository.

2. **New dependencies violate the current `qa` gate.** The QA Acceptance Gate forbids dependency or package changes unless PM separately confirms them. Installing Playwright would require modifying `package.json` and `package-lock.json`, which are explicit forbidden files.

3. **Server action + redirect automation is costly.** All three form submit functions (`submitEvidence`, `submitConclusion`, `submitClosure`) are Next.js server actions declared with `"use server"`. After form submission, Next.js internally executes a `fetch()` to the backend API and then calls `redirect()`, which produces an HTTP 303 response. Automating this flow with Playwright requires handling cross-request redirects, which adds complexity disproportionate to the verification value.

4. **IM241 already covers backend write and read-back.** The HTTP smoke verified:
   - POST evidence, conclusion, and closure success (3 actions)
   - Detail API read-back after each write (3 GET checks)
   - Closed-case rejection for evidence and conclusion (2 checks)
   - Closure idempotency (1 check)

5. **IM240 already covers feedback URL rendering.** The live runtime smoke verified that `?evidence=failed`, `?conclusion=failed`, and `?closure=success` URL parameters produce visible feedback text on the detail page.

### 15.3 Remaining Gap

| Gap | Description | Risk Level |
| --- | --- | --- |
| Server action → fetch → redirect glue | The three panel `submitXxx()` functions construct a payload via `buildImportReview*WritePayload()`, call `fetch()` to the backend API, evaluate `response.ok`, and call `redirect()` with the appropriate `?xxx=success` or `?xxx=failed` suffix. This ~30-line glue layer per panel is the only code path not covered by automated checks. | **Low** |

Risk justification: payload construction functions are covered by 17 frontend model test files (`import-center-review-case-*.test.mjs`). The backend API endpoints are covered by `test_review_evidence_api.py`, `test_review_conclusion_api.py`, and `test_review_closure_api.py`. The redirect target pages are covered by IM240 feedback URL checks. The remaining glue is thin, linear, and has no branching logic beyond `response.ok`.

### 15.4 Recommended Alternative Gate

**HTTP smoke evidence (IM241):** retained as-is. All 15 curl checks in Section 13.3 provide backend write, read-back, rejection, and idempotency evidence.

**PM manual browser walkthrough (8 steps):**

| # | Action | Expected Result |
| --- | --- | --- |
| 1 | Visit `/data-quality/review-cases/CASE-SEED-ME-001` | Evidence panel shows a submittable form (可补充 status) |
| 2 | Fill the evidence form and click 提交证据 | Page redirects to the same caseId with `?evidence=success`; feedback text `补证据提交成功` is visible |
| 3 | Visit `/data-quality/review-cases/CASE-SEED-MC-001` | Conclusion panel shows a submittable form (可补充 status) |
| 4 | Fill the conclusion form and click 提交结论 | Page redirects to the same caseId with `?conclusion=success`; feedback text `补结论提交成功` is visible |
| 5 | Visit `/data-quality/review-cases/CASE-QUERY-001` | Closure panel shows a submittable form (可关闭 status: has evidence + conclusion, no closure) |
| 6 | Fill the closure form and click 关闭案例 | Page redirects to the same caseId with `?closure=success`; feedback text `关闭案例提交成功` is visible |
| 7 | Visit `/data-quality/review-cases/CASE-SEED-CL-001` | Evidence and conclusion panels show blocker text `案例已关闭`; closure panel shows `已关闭` |
| 8 | Click breadcrumb 复核案例 on CASE-SEED-CL-001 detail page | Returns to list page `/data-quality/review-cases` |

Prerequisites: backend on `127.0.0.1:8000`, frontend on `127.0.0.1:3002`, isolated database via `BPO_DATABASE_URL`, and `seed_review_case_stage_matrix()` invoked explicitly before the walkthrough.

### 15.5 Stop Conditions

- If PM decides to install Playwright → a separate dependency Gate must be opened; this is outside the current `qa` gate scope.
- If the manual walkthrough discovers that server action redirect does not work → a separate bug fix task must be opened; this is outside the current acceptance scope.
- If the manual walkthrough passes → no further E2E automation is required for the current review-case write-action acceptance.

### 15.6 Future Optional Automation

If Playwright is confirmed and installed under a future dependency Gate, the minimum viable E2E scope is:

1. **Test only 1 form**: evidence panel on `CASE-SEED-ME-001` (simplest case, no prerequisite evidence or conclusion).
2. **Verify only redirect URL**: confirm the page navigates to a URL containing `?evidence=success`.
3. **Verify only feedback text**: confirm `补证据提交成功` is visible after redirect.
4. **Do not re-verify backend DB writes**: already covered by IM241 HTTP smoke; E2E should not duplicate database-level assertions.

This minimum scope is sufficient because the three panels share identical code patterns (server action → `buildImportReview*WritePayload()` → `fetch()` → `response.ok` check → `redirect()`). One form validates the pattern; the other two differ only in payload shape, which is already covered by frontend model tests.

### 15.7 Non-Goals

- No Playwright, Cypress, Puppeteer, or Selenium installation.
- No `package.json` or `package-lock.json` changes.
- No new E2E test files or directories.
- No changes to `scripts/check.sh` or gate configuration.
- No production readiness claim.
- No permission, approval, export, batch-operation, production formula, settlement, or charge-factor coverage.

## 16. Manual Browser Walkthrough Evidence (IM243)

> This section records the IM243 local browser walkthrough for the three review-case write forms. It is acceptance evidence only; it does not add automation, modify product code, or claim production readiness.

### 16.1 Runtime Setup

| Item | Value |
| --- | --- |
| Database | `.local/im243-review-case-form-click-smoke.db` |
| Database routing | `BPO_DATABASE_URL=sqlite+pysqlite:///./.local/im243-review-case-form-click-smoke.db` |
| Seed function | `seed_review_case_stage_matrix()` |
| Backend | `127.0.0.1:8000` |
| Frontend | `127.0.0.1:3002` |
| API base | `NEXT_PUBLIC_BPO_API_BASE_URL=http://127.0.0.1:8000` and `BPO_API_BASE_URL=http://127.0.0.1:8000` |

Seed output before the walkthrough:

| Case ID | Status | Evidence | Conclusions | Closure |
| --- | --- | ---: | ---: | --- |
| `CASE-QUERY-001` | `open` | 1 | 1 | false |
| `CASE-SEED-ME-001` | `open` | 0 | 0 | false |
| `CASE-SEED-MC-001` | `open` | 1 | 0 | false |
| `CASE-SEED-CL-001` | `open` | 1 | 1 | true |

### 16.2 Browser Walkthrough Results

| Step | Result |
| --- | --- |
| Visit `CASE-SEED-ME-001`, open `处理动作`, submit evidence form | Redirected to `?evidence=success`; `补证据提交成功` was visible in the action tab |
| Read back `CASE-SEED-ME-001` detail API | Response included `evidence_uri=local://im243/browser-evidence` and `note=IM243 browser evidence` |
| Visit `CASE-SEED-MC-001`, open `处理动作`, submit conclusion form | Redirected to `?conclusion=success`; `补结论提交成功` was visible in the action tab |
| Read back `CASE-SEED-MC-001` detail API | Response included `conclusion_text=IM243 browser conclusion` |
| Visit `CASE-QUERY-001`, open `处理动作`, submit closure form | Redirected to `?closure=success`; `关闭案例提交成功` was visible in the action tab |
| Read back `CASE-QUERY-001` detail API | Response included `closure_status=closed` and `closure_note=IM243 browser closure` |
| Visit `CASE-SEED-CL-001`, open `处理动作` | Existing closure was visible; evidence and conclusion actions showed `案例已关闭` blocker text; closure panel showed closed state |
| Click breadcrumb `复核案例` | Returned to `/data-quality/review-cases` |

### 16.3 Observations

- The success feedback is rendered inside the `处理动作` tab. After a server-action redirect, the detail page may initially show another tab; opening `处理动作` displays the feedback notice.
- `CASE-SEED-CL-001` has `case.status=open` while `closure` is present. The action deck correctly treats the case as closed because closure presence is part of the frontend closed-state summary.
- No product code, backend code, scripts, dependency files, package/lockfiles, schema/migration, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors were changed.

### 16.4 Acceptance Decision

IM243 passes the intended local browser walkthrough:

1. Browser form submit triggers the existing Next server action.
2. The server action writes through the existing backend API.
3. The page redirects to the expected success URL.
4. The success feedback appears in the existing action deck.
5. Backend detail API read-back confirms persistence in the isolated local runtime database.

This closes the current review-case runtime acceptance block for local MVP evidence. It does not imply production readiness, permissions readiness, external integration readiness, or automated E2E coverage.
