# Data Quality Group Exception Coverage Design

## Scope

Add a local read-only summary on the data quality overview that shows which quality groups currently cover issues affecting fulfillment exceptions.

## In Scope

- Use existing fallback quality groups and data quality issues.
- Aggregate impacted groups, impacted exceptions, impacted people, blocked rows, representative issue, source templates, trace keys, affected objects, and group links.
- Add model and page tests.
- Update Harness traceability.

## Out of Scope

- No backend endpoint.
- No database, ORM, migration, persistence, or production storage.
- No new dependency or package/lockfile change.
- No real external integration.
- No auth, permission, approval, export, batch operation, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge factor, or production formula.
