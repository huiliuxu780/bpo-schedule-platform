# Review Case Workspace Acceptance Smoke

Date: 2026-06-17
Task: IM215

## Conclusion

The live review-case acceptance smoke is blocked in the current environment because the frontend is available on `127.0.0.1:3000`, but the backend API expected by the review-case pages is not available on `127.0.0.1:8000`.

Per PM instruction, no additional test environment was started. This report therefore does not claim that the seeded review-case state matrix is accepted in a live UI/API environment. It records partial live evidence, the model/contract coverage inventory, and the exact future live-smoke unblock condition.

## PM Continuation Closeout

After the live smoke blocker was recorded, PM continued without allowing a new runtime. IM215 is therefore closed as a no-new-env model/contract-only QA record, not as a live seeded UI acceptance.

Product meaning:

- accepted: current review-case routes, UI shells, API helper usage, empty-state ownership, processing-stage model coverage, action-deck model coverage, retry feedback, and continuation/closure handoff have documented or automated coverage in the existing project test surface.
- not accepted: seeded case data rendering through the live 3000 page, because it still depends on a reachable `127.0.0.1:8000` review-case API.
- follow-up: if PM wants true live acceptance, rerun this smoke after an approved backend/API runtime is available; do not treat this closeout as proof of live data loading.

Additional verification notes:

- `node --test scripts/tests/frontend-api-utilities.test.mjs` passed and confirms review-case routes use shared API result/error helpers instead of local utility drift.
- `node --test scripts/tests/shared-empty-state.test.mjs` passed and confirms the review-case workspace uses the shared empty-state component instead of local copies.
- `scripts/tests/import-center-model.test.mjs` contains the review-case processing-stage, owner matrix, detail context, action deck, failed retry, and continuation/closure handoff assertions, but direct Node execution is currently blocked by an existing TS/ESM extensionless import resolution issue before assertions run.
- `scripts/tests/product-structure.test.mjs` reads the review-case routes for result-chain breadcrumb checks, but the full file currently has unrelated historical master-data structure assertion failures, so it is not used as IM215 pass evidence.
- Full project verification remains `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`.

## Attempted Scope

Target flow:

- review-case list route
- missing-evidence filter
- missing-conclusion filter
- ready-to-close filter
- closed filter
- `CASE-QUERY-001` detail route
- failed submit retry feedback through `?evidence=failed`
- closure success feedback through `?closure=success`

Non-goals:

- no UI code edits
- no route/query contract changes
- no backend startup
- no database/schema/dependency/package changes
- no permissions, approval, export, batch, automatic scheduling, formula, settlement, or charge-factor work

## Evidence Collected

Frontend route reachability:

- `GET http://127.0.0.1:3000/data-quality/review-cases` returned `200`
- `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=missing_evidence` returned `200`
- `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=missing_conclusion` returned `200`
- `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=ready_to_close` returned `200`
- `GET http://127.0.0.1:3000/data-quality/review-cases?processingStage=closed` returned `200`
- `GET http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001` returned `200`
- `GET http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001?evidence=failed` returned `200`
- `GET http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001?closure=success` returned `200`

Observed page state:

- list page rendered a blocked summary: `复核案例读取失败` / `fetch failed`
- detail page rendered blocked detail content: `复核案例读取失败` / `fetch failed`
- failed evidence URL parameter still produced feedback payload: `补证据提交失败`
- closure success URL parameter still produced feedback payload: `关闭案例提交成功`

Backend reachability:

- `GET http://127.0.0.1:8000/api/v1/review-cases?status=all` failed to connect
- `GET http://127.0.0.1:8000/api/v1/review-cases/CASE-QUERY-001` failed to connect

## Acceptance Matrix

| Check | Current Result | Status |
| --- | --- | --- |
| List route reachable | 3000 route returns 200 | Partial pass |
| Detail route reachable | 3000 route returns 200 | Partial pass |
| Missing evidence state | Backend unavailable, list shows fetch failure; model assertion exists but direct model test runner is blocked | Not live-accepted |
| Missing conclusion state | Backend unavailable, list shows fetch failure; model assertion exists but direct model test runner is blocked | Not live-accepted |
| Ready to close state | Backend unavailable, list shows fetch failure; model assertion exists but direct model test runner is blocked | Not live-accepted |
| Closed state | Backend unavailable, list shows fetch failure; model assertion exists but direct model test runner is blocked | Not live-accepted |
| Failed submit retry feedback | `?evidence=failed` produces failed feedback payload, but detail data is unavailable | Partial pass |
| Closure success handoff | `?closure=success` produces success feedback payload, but detail data is unavailable | Partial pass |
| Shared API helper contract | `frontend-api-utilities.test.mjs` passed | Pass |
| Shared empty-state contract | `shared-empty-state.test.mjs` passed | Pass |

## Unblock Condition

To complete true live acceptance, PM must choose one of these paths:

1. allow Codex to use an already-approved backend/API runtime on `127.0.0.1:8000`
2. provide a currently running review-case API endpoint for the frontend to read
3. open a separate follow-up task to fix or route the direct frontend model test runner if PM wants model tests to become an executable gate

IM215 itself is closed under the no-new-env model/contract-only QA interpretation. No review-case UI/code changes were made.
