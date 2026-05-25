# Weekly Data Quality Summary Plan

## Scope

- Add a local, read-only weekly data-quality impact summary to the existing fulfillment calendar group-week sidebar.
- Summarize data-quality issues that affect weekly exceptions by impacted exceptions, people, days, groups, hours, severity, and blocked evidence.
- Keep the panel explanatory only: no submit, save, repair, approval, export, batch, or state-write capability.

## Implementation

1. Extend `lib/person-timeline.ts` with `FulfillmentWeeklyDataQualitySummary` and derive it from local group-day exception queues.
2. Add `WeeklyDataQualitySummaryPanel` after the weekly decision digest and before the weekly review queue.
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
