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

- Seed function: `backend/app/review_demo_seed.py :: seed_review_case_demo()`
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
| Seed invocation | Manual: `python -m backend.app.review_demo_seed` or equivalent before/during backend startup |
| Node.js | 22.x via `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin` |

### Seed Stage Coverage (Current)

Processing stage derivation logic (`summarizeImportReviewCaseProcessingStage` in `import-center-review-model.ts`):

1. `case.status === "closed"` OR `closure !== null` → `closed`
2. Detail snapshot unavailable → `unknown`
3. `evidenceCount === 0` → `missing_evidence`
4. `conclusionCount === 0` → `missing_conclusion`
5. Otherwise → `ready_to_close`

| Processing Stage | Covered by Current Seed? | Reason |
| --- | --- | --- |
| `missing_evidence` | No | Seed creates case + evidence + conclusion; no case exists with zero evidence |
| `missing_conclusion` | No | Seed creates case + evidence + conclusion; no case exists with evidence but zero conclusions |
| `ready_to_close` | **Yes** | `CASE-QUERY-001`: status=open, 1 evidence, 1 conclusion, no closure record |
| `closed` | No | Seed does not pass `ReviewClosureInput`; no closure record exists |

### Seed Extension Recommendation (Future, Not Implemented)

To cover all four stages in live acceptance, **3 additional cases** are needed. No backend implementation changes are required — only new seed fixture entries using existing `ReviewCaseCreateRequest`, `ReviewEvidenceInput`, `ReviewConclusionInput`, and `ReviewClosureInput` models.

| New Case ID | Target Stage | Minimum Records Needed |
| --- | --- | --- |
| `CASE-SEED-ME-001` | `missing_evidence` | Case only (status=open, no evidence, no conclusion). Needs a valid `source_result_id` from a comparison run. |
| `CASE-SEED-MC-001` | `missing_conclusion` | Case + 1 evidence (status=open, 1 evidence, no conclusion). |
| `CASE-SEED-CL-001` | `closed` | Case + 1 evidence + 1 conclusion + `ReviewClosureInput(closure_id, case_id, closure_status="closed", closed_by)`. Can reuse `write_review_closure()` with the `closure` parameter populated. |

All three cases can share the same upstream `source_result_id` from the existing `_ensure_forecast_schedule_result()` helper, since it returns a valid `result_id` and is idempotent.

Implementation note: the extension would be a new function in `review_demo_seed.py` (e.g. `seed_review_case_stage_matrix()`) that creates the three additional cases. No changes to `ReviewPersistenceRepository`, `write_review_closure()`, or any API endpoint are needed.

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
| `backend/tests/test_review_demo_seed.py` | Unit | Already passing — seed idempotency + detail creation |
| `backend/tests/test_review_evidence_api.py` | Unit | Already passing — evidence write route + response |
| `backend/tests/test_review_conclusion_api.py` | Unit | Already passing — conclusion write route + response |
| Live route HTTP smoke | Integration | Not yet automated — would require running backend + frontend |
| Live detail page data render | Integration | Not yet automated — would require seed + backend + frontend |

## 6. Future Live Runtime Smoke Sequence (Design Only, Not Implemented)

> **Every step below requires a PM-confirmed live runtime.** No step may be executed without explicit PM approval to start backend on `127.0.0.1:8000` and frontend on `127.0.0.1:3000`. This sequence is a design document, not an executable script.

### Prerequisites (Must Pass Before Step 1)

- PM has confirmed both runtimes may be started.
- Seed extension (Section 3, `CASE-SEED-ME-001`, `CASE-SEED-MC-001`, `CASE-SEED-CL-001`) is either implemented or explicitly deferred. If deferred, Steps 5b–5d are skipped.
- `bash scripts/check.sh` has passed on the current branch before any runtime is started.

### Step 1 — Backend Health

**Target:** `GET http://127.0.0.1:8000/docs` (FastAPI auto-generated OpenAPI page)

**Expected:** HTTP 200, HTML response containing API documentation.

**Hard stop if:** connection refused, timeout, or non-200 status. Do not proceed to Step 2.

**PM gate:** backend runtime must be running before this step.

### Step 2 — Seed Invocation

**Target:** Manual execution of `python -m backend.app.review_demo_seed` (or equivalent entry point).

**Expected:** Process exits 0, prints JSON containing `case_id: "CASE-QUERY-001"`.

**Idempotency check:** Run seed a second time; must exit 0 and return the same case without duplicating records.

**Hard stop if:** seed exits non-zero, prints an error, or `CASE-QUERY-001` is not present in the output. Do not proceed to Step 3.

**If seed extension is implemented:** also verify `CASE-SEED-ME-001`, `CASE-SEED-MC-001`, `CASE-SEED-CL-001` appear in subsequent `GET /api/v1/review-cases` response.

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

Each sub-step below targets a different `processingStage` filter. Steps 5b–5d require extended seed data; if seed extension is deferred, only Step 5a is executable.

#### 5a. `ready_to_close` (current seed)

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=ready_to_close`

**Expected:** HTTP 200, body contains `CASE-QUERY-001`.

#### 5b. `missing_evidence` (requires `CASE-SEED-ME-001`)

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=missing_evidence`

**Expected:** HTTP 200, body contains `CASE-SEED-ME-001`.

**Skip if:** seed extension not implemented.

#### 5c. `missing_conclusion` (requires `CASE-SEED-MC-001`)

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=missing_conclusion`

**Expected:** HTTP 200, body contains `CASE-SEED-MC-001`.

**Skip if:** seed extension not implemented.

#### 5d. `closed` (requires `CASE-SEED-CL-001`)

**Target:** `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=closed`

**Expected:** HTTP 200, body contains `CASE-SEED-CL-001`.

**Skip if:** seed extension not implemented.

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

| Step | Target | Current Seed Sufficient? | PM Runtime Required? |
| --- | --- | --- | --- |
| 1. Backend health | `GET :8000/docs` | N/A | Yes |
| 2. Seed invocation | `python -m backend.app.review_demo_seed` | Yes (base) | Yes |
| 3. List page | `GET :3000/data-quality/review-cases` | Yes | Yes |
| 4. Detail page | `GET :3000/.../CASE-QUERY-001` | Yes | Yes |
| 5a. `ready_to_close` filter | `?processingStage=ready_to_close` | Yes | Yes |
| 5b. `missing_evidence` filter | `?processingStage=missing_evidence` | **No** — needs `CASE-SEED-ME-001` | Yes |
| 5c. `missing_conclusion` filter | `?processingStage=missing_conclusion` | **No** — needs `CASE-SEED-MC-001` | Yes |
| 5d. `closed` filter | `?processingStage=closed` | **No** — needs `CASE-SEED-CL-001` | Yes |
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

## 11. Future Gate: Review Case Stage Seed Extension (Draft, Not Confirmed)

> This section is a **design draft** for a potential future task. It is not a confirmed Gate, not in `docs/current/**`, and not in `tasks/backlog.yaml`. PM must explicitly confirm before any implementation begins.

### 11.1 Why Seed Extension Is Needed

The current `seed_review_case_demo()` creates a single case (`CASE-QUERY-001`) that covers only `ready_to_close`. The review-case list workspace supports four processing-stage filters (`missing_evidence`, `missing_conclusion`, `ready_to_close`, `closed`), but live runtime acceptance can only verify one of them with existing seed data.

Without extension, PM live acceptance of the other three stage filters will always show empty results, which cannot distinguish between "filter works correctly and returns zero matches" and "filter is broken."

### 11.2 Target Coverage

| Processing Stage | Current Coverage | Extension Needed? |
| --- | --- | --- |
| `missing_evidence` | No case exists with zero evidence | Yes — new case with case record only |
| `missing_conclusion` | No case exists with evidence but zero conclusions | Yes — new case with case + 1 evidence |
| `ready_to_close` | `CASE-QUERY-001` already covers this | No |
| `closed` | No case exists with a closure record | Yes — new case with full records + `ReviewClosureInput` |

### 11.3 Proposed Seed Extension Cases

| Case ID | Stage | Records | Construction |
| --- | --- | --- | --- |
| `CASE-SEED-ME-001` | `missing_evidence` | Case only (status=open, no evidence, no conclusion) | `repository.create_review_case(ReviewCaseCreateRequest(...))` with valid `source_result_id` from `_ensure_forecast_schedule_result()` |
| `CASE-SEED-MC-001` | `missing_conclusion` | Case + 1 evidence (status=open, 1 evidence, no conclusion) | `create_review_case()` + `add_evidence()` |
| `CASE-SEED-CL-001` | `closed` | Case + 1 evidence + 1 conclusion + closure record | `write_review_closure(ReviewClosureWriteRequest(case=..., evidence=[...], conclusions=[...], closure=ReviewClosureInput(...)))` |

All three cases share the same `source_result_id` from `_ensure_forecast_schedule_result()` (idempotent).

### 11.4 Allowed Files (When Implemented)

If PM confirms this task in the future:

- `backend/app/review_demo_seed.py` — add new seed function (e.g. `seed_review_case_stage_matrix()`)
- `backend/tests/test_review_demo_seed.py` — add tests for new seed function idempotency and stage coverage

### 11.5 Forbidden Files and Behaviors (When Implemented)

- No changes to `backend/app/review_persistence.py`, `review_closure.py`, `review_evidence.py`, `review_conclusion.py`, or `main.py`
- No changes to `app/**`, `components/**`, `hooks/**`, `lib/**`
- No changes to `scripts/check.sh` or test gate configuration
- No changes to `package.json`, lockfiles, or dependencies
- No database schema changes or migrations
- No approval, permission, export, batch operations, production formulas, settlement rules, or charge factors
- No auto-startup hooks (`lifespan`, `on_event("startup")`) that would run seed without explicit PM confirmation

### 11.6 Future Acceptance Commands (Candidates)

These are candidates for when the seed extension is implemented and a PM-confirmed runtime is available:

- `node --test scripts/tests/import-center-review-case-*.test.mjs` — frontend model tests (no runtime needed)
- `python -m unittest backend.tests.test_review_demo_seed -v` — seed unit tests (no runtime needed)
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` — full gate (no runtime needed)
- Smoke sequence from Section 6 — live runtime acceptance (PM-confirmed runtime required)

### 11.7 Stop Conditions

- Seed extension fails to create expected cases or breaks existing `CASE-QUERY-001` idempotency.
- New seed function introduces side effects outside `review_demo_seed.py`.
- Backend unit tests fail after seed extension.
- `bash scripts/check.sh` fails after seed extension.
- PM does not confirm backend runtime availability for live acceptance.
- Any change requires new dependencies, database migration, or schema changes.

### 11.8 PM Decision Points

PM must decide:

1. **Accept partial runtime smoke now**: Run only Steps 1-4 and Step 5a (Section 6) with the current seed. The three uncovered stage filters (`missing_evidence`, `missing_conclusion`, `closed`) remain unverified in live acceptance and are explicitly deferred.

2. **Extend seed first, then do full runtime acceptance**: Confirm the seed extension task, implement the three additional cases, re-run `bash scripts/check.sh`, then execute the full smoke sequence (Steps 1-6) including all stage filters.

3. **Defer seed extension indefinitely**: Accept that live runtime acceptance covers only `ready_to_close`, and rely on the existing automated unit test surface (17 frontend test files + backend test suite) for the other three stages.

## 12. Unblock Path

If PM wants to proceed with this acceptance:

1. Confirm backend runtime can be started on `127.0.0.1:8000`
2. Confirm seed data should be loaded (manually or via startup hook)
3. Confirm whether acceptance is PM-driven (manual browser walk) or Codex-driven (HTTP smoke via curl/agent)
4. Decide whether PR #2 should be merged to `main` before this task starts, or whether acceptance runs on the feature branch
