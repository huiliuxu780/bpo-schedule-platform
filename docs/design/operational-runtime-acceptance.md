# IM252 Operational Runtime Acceptance

## Status

Done on 2026-06-26.

This is a QA acceptance block for the local MVP operational workflow. It does not add product behavior.

## Scope

Validated runtime behavior for:

- `/dashboard`
- `/schedule-plans/plan-20260511-suzhou-bosch-v1`
- `/schedule-risks/risk-plan-20260511-shanghai-bosch-v1-09%3A30`
- `/unavailability/unavail-20260511-001`

The runtime used:

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:3000`
- Command: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/dev.sh`
- Data source: local in-process seed data from `backend/app/seed_data.py` and `backend/app/repository.py`

## Preconditions

Port checks before startup:

- `3000`: no listener
- `8000`: no listener

Runtime startup result:

- Backend started with the project Python virtual environment.
- Frontend started on Node.js 22 through `scripts/run-next-dev.sh`.
- No `.local` runtime database was needed because this slice uses local in-process schedule seed data.

## Acceptance Results

### Dashboard

Result: passed.

Evidence:

- `/dashboard` returned HTTP 200.
- Browser snapshot showed readiness message: `经营总览数据来自当前本地排班计划、风险和不可用状态。`
- Initial summary displayed:
  - `排班计划总数`: `3`
  - `1 个已发布`
  - `待处理风险`: `10`
  - `生效不可用`: `2`
- Heatmap rendered visible缺口 cells.
- Anomaly table rendered downstream links to risk detail and unavailability detail pages.

After runtime actions, dashboard refreshed to:

- `排班计划总数`: `3`
- `2 个已发布`
- `待处理风险`: `8`
- `生效不可用`: `1`
- Anomaly table reduced to `5` rows.

### Schedule Plan Lifecycle

Result: passed.

Validated plan:

- `plan-20260511-suzhou-bosch-v1`

Flow:

1. Opened the draft plan detail page.
2. Verified `编辑草稿` and `提交复核` were visible.
3. Clicked `提交复核`.
4. Verified redirect to `?lifecycle=submit_review_success`.
5. Verified feedback title `已提交复核`.
6. Verified status changed to `待复核`.
7. Verified `发布计划` became the only lifecycle action.
8. Clicked `发布计划`.
9. Verified redirect to `?lifecycle=publish_success`.
10. Verified feedback title `已发布计划`.
11. Verified status changed to `已发布`.
12. Verified lifecycle action buttons were no longer visible.

API readback:

- `GET /api/v1/schedule-plans/plan-20260511-suzhou-bosch-v1`
- Result status: `published`

### Schedule Risk Handling

Result: passed.

Validated risk:

- `risk-plan-20260511-shanghai-bosch-v1-09:30`

Flow:

1. Opened risk detail page.
2. Verified `确认风险` and `标记已处理` were visible in `待处理` state.
3. Clicked `确认风险`.
4. Verified redirect to `?riskAction=confirm_success`.
5. Verified feedback title `已确认风险`.
6. Verified status changed to `已确认`.
7. Verified only `标记已处理` remained.
8. Clicked `标记已处理`.
9. Verified redirect to `?riskAction=resolve_success`.
10. Verified feedback title `已处理风险`.
11. Verified status changed to `已处理`.
12. Verified risk action buttons were no longer visible.

API readback:

- `GET /api/v1/schedule-risks`
- Result for target risk:
  - `risk_status`: `resolved`
  - `affected_unavailability`: `0` after the related unavailability record was resolved

### Unavailability Handling

Result: passed.

Validated record:

- `unavail-20260511-001`

Flow:

1. Opened unavailability detail page.
2. Verified `标记已处理` was visible in `生效中` state.
3. Verified related shifts and related risks were visible.
4. Clicked `标记已处理`.
5. Verified redirect to `?unavailabilityAction=resolve_success`.
6. Verified feedback title `已处理不可用`.
7. Verified status changed to `已处理`.
8. Verified handling action button was no longer visible.
9. Verified related risk count changed from `2` to `1`.

API readback:

- `GET /api/v1/unavailability`
- Result for target record:
  - `status`: `resolved`
- Remaining active record:
  - `unavail-20260511-002`

## UI Language Boundary

Visible-text scan excluded `script`, `style`, `template`, and `svg` content, then checked the accepted pages for internal or overclaiming terms.

Checked terms:

- `Gate`
- `PM`
- `Harness`
- `Codex`
- `自动排班`
- `自动修复`
- `生产实时`
- `real-time`

Result: no visible UI hits.

## Console And Runtime Notes

Playwright browser snapshots reported:

- Console errors: `0`
- Console warnings: dev-only warnings were present.

Non-blocking warning observed on dashboard:

- Recharts reported width/height `-1` during dev rendering.
- The chart was still visible in the browser snapshot.
- This does not block IM252 acceptance, but it is a candidate for a future dashboard visual-polish pass if it appears in production build/runtime.

Other warnings:

- React DevTools suggestion.
- HMR and Next.js dev preload warnings.

## Non-Goals

This acceptance did not:

- add backend APIs
- add product behavior
- add browser automation test files
- install Playwright or any project dependency
- modify `package.json` or lockfiles
- add database schema, migration, or persistence configuration
- add auth, permissions, approval, export, batch operation, automatic scheduling, production formulas, settlement rules, or charge factors

