# Data Quality Exception Cause Summary Design

## Goal

Add a local read-only cause summary to the data quality overview so supervisors can see which data-quality reason groups are creating the most fulfillment-exception impact.

## Scope

- Add a frontend model helper in `lib/data-quality.ts`.
- Add a card to `app/data-quality/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness current state, traceability, audit, and branch evidence.

## Behavior

- Group impactful data-quality issues by `errorCode`, `sourceField`, and `source`.
- Each group shows impacted exception count, impacted people, blocked rows, issue count, representative issue, next view hint, and deferred actions.
- Groups are sorted by impacted exceptions, impacted people, blocked rows, issue count, and severity.
- Empty state says there is no matched fulfillment-exception impact.

## Boundaries

- No backend endpoint, dependency, database, ORM, migration, real external integration, auth, permission, approval, export, batch, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge-factor, or production formula work.
