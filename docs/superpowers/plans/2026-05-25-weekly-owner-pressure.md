# Weekly Owner Pressure Plan

## Scope

- Add a local, read-only weekly owner pressure summary to the existing fulfillment calendar group-week sidebar.
- Summarize weekly exception pressure by owner role, exception count, high-priority count, escalation count, blocked evidence, impacted people, impacted days, and drilldown path.
- Keep the panel explanatory only: no submit, save, dispatch, approval, export, batch, or state-write capability.

## Implementation

1. Extend `lib/person-timeline.ts` with `FulfillmentWeeklyOwnerPressureSummary` and derive it from local group-day exception queues.
2. Add `WeeklyOwnerPressurePanel` after weekly data-quality summary and before weekly review queue.
3. Cover model values and page ordering in `scripts/tests/person-timeline.test.mjs`.
4. Run target tests, browser smoke, state checks, and final project check before committing.

## Verification

- `node --test scripts/tests/person-timeline.test.mjs`
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`
- `node --test scripts/tests/product-navigation-business-only.test.mjs`
- `npm run lint`
- `npm run typecheck`
- `git diff --check`
- `bash scripts/check-state.sh --strict`
- `bash scripts/check.sh`
