# Data Quality Exception Drilldown Design

## Goal

Add a local read-only exception-impact drilldown to the data quality detail page so a supervisor can see which fulfillment exceptions, people, affected objects, and next viewing paths are impacted by one quality issue.

## Scope

- Add a frontend model helper in `lib/data-quality.ts` for one issue.
- Add a card to `app/data-quality/[issueId]/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness current state, traceability, audit, and branch evidence.

## Behavior

- The summary counts impacted exceptions from affected objects whose type or label points to fulfillment exceptions, and uses person-timeline links as a minimum signal.
- Impacted people are extracted from affected object IDs and link targets that match employee IDs.
- The page displays affected exception count, impacted people, primary exception, impacted objects, next view hint, and deferred actions.
- Empty state says the issue has no matched fulfillment exception impact.

## Boundaries

- No backend endpoint, dependency, database, ORM, migration, real external integration, auth, permission, approval, export, batch, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge-factor, or production formula work.
