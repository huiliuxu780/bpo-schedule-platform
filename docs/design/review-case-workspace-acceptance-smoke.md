# Review Case Workspace Acceptance Smoke

Date: 2026-06-17
Task: IM215

## Conclusion

The review-case acceptance smoke is blocked in the current live environment because the frontend is available on `127.0.0.1:3000`, but the backend API expected by the review-case pages is not available on `127.0.0.1:8000`.

Per PM instruction, no additional test environment was started. This report therefore does not claim that the seeded review-case state matrix is accepted. It records the partial evidence and the exact unblock condition.

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
| Missing evidence state | Backend unavailable, list shows fetch failure | Blocked |
| Missing conclusion state | Backend unavailable, list shows fetch failure | Blocked |
| Ready to close state | Backend unavailable, list shows fetch failure | Blocked |
| Closed state | Backend unavailable, list shows fetch failure | Blocked |
| Failed submit retry feedback | `?evidence=failed` produces failed feedback payload, but detail data is unavailable | Partial pass |
| Closure success handoff | `?closure=success` produces success feedback payload, but detail data is unavailable | Partial pass |

## Unblock Condition

To complete this acceptance smoke, PM must choose one of these paths:

1. allow Codex to use an already-approved backend/API runtime on `127.0.0.1:8000`
2. provide a currently running review-case API endpoint for the frontend to read
3. explicitly downgrade IM215 to model/contract-only acceptance using existing automated tests instead of live route smoke

Until then, IM215 should remain blocked and no review-case UI/code changes should be made.
