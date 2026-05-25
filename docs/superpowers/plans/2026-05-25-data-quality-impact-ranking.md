# Data Quality Impact Ranking Plan

## Scope

- Add a local, read-only data-quality impact ranking to the existing fulfillment calendar group-day exception panel.
- Rank linked data-quality issues by impact score, severity, blocked evidence, affected people, and affected exceptions.
- Keep the panel explanatory only: no submit, save, approval, export, batch, real repair, or state-write capability.

## Implementation

1. Extend `lib/person-timeline.ts` with `FulfillmentDataQualityImpactRanking` and derive it from the local exception queue.
2. Add `DataQualityImpactRankingPanel` after the existing quality-impact aggregation card and before exception impact priority.
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
