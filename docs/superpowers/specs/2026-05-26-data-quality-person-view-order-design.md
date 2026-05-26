# Data Quality Person View Order Design

## Goal

Add a local read-only person view order to the data quality overview so supervisors can jump from data-quality causes to impacted personal fulfillment pages.

## Scope

- Add a frontend model helper in `lib/data-quality.ts`.
- Add a card to `app/data-quality/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness current state, traceability, audit, and branch evidence.

## Behavior

- Build person-level view items from impacted data-quality issues.
- Each item shows employee ID, impacted cause count, impacted exception count, representative cause, representative issue, personal fulfillment URL, and next view hint.
- Sort people by impacted exception count, cause count, blocked rows, and employee ID.
- Empty state says there are no matched impacted people.

## Boundaries

- No backend endpoint, dependency, database, ORM, migration, real external integration, auth, permission, approval, export, batch, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge-factor, or production formula work.
