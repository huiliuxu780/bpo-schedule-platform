# Data Quality Review Group Link Design

## Scope

Add a local read-only summary on the data quality overview that links the next review recommendation representative issue to existing quality groups.

## In Scope

- Use the representative issue from the existing next-review recommendation.
- Match that issue against existing fallback quality groups.
- Show matched group count, ungrouped issue count, top group, risk, owner, templates, trace keys, group link, next-view hint, and deferred actions.
- Add model and page tests.
- Update Harness traceability.

## Out of Scope

- No backend endpoint.
- No database, ORM, migration, persistence, or production storage.
- No new dependency or package/lockfile change.
- No real external integration.
- No auth, permission, approval, export, batch operation, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge factor, or production formula.
