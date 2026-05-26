# Data Quality Exception Top Design

## Goal

Add a local read-only Top aggregation on the data quality overview page so supervisors can see which data quality issues affect the most fulfillment exceptions.

## Scope

- Extend `lib/data-quality.ts` with a summary function that ranks issues by impacted exception count, impacted people count, blocked rows, and severity.
- Render a compact “影响异常 Top” card on `/data-quality`.
- Keep all behavior local and read-only.

## Out Of Scope

- No backend endpoint, database, ORM, migration, persistence, external integration, auth, permission, approval, export, batch operation, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge factor, or production formula work.
- No new route or sidebar entry.
- No production time or settlement calculation.

## Design

The model reads existing `DataQualityIssue` rows and derives each ranked item from `affectedObjects` and `impactLinks`.

Each item contains:

- issue id, title, severity, status, owner, and detail href
- impacted exception count
- impacted people
- blocked rows
- affected object labels
- next view hint

Ranking order is impacted exception count, impacted people count, blocked rows, severity, then issue id. The empty state returns zero totals and the deferred action boundary.

## Verification

- Add TDD coverage in `scripts/tests/data-quality.test.mjs`.
- Verify `/data-quality` HTML contains “影响异常 Top” and the ranked issue copy.
- Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
