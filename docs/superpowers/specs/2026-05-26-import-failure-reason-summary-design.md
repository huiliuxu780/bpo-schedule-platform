# Import Failure Reason Summary Design

## Goal

Add a local read-only failure reason summary to import batch details so supervisors can see the main failed fields and error codes before reading every failed row.

## Scope

- Aggregate existing `ImportBatch.failureRows` in the frontend model.
- Group by `errorCode` and `fieldName`.
- For each group, show failed row count, representative row number, representative raw value, error message, affected objects, and a short correction hint.
- Add a summary card before the existing failed-row details on `/import-batches/[batchId]`.
- Show a neutral empty state when a batch has no failed rows.

## Out Of Scope

- No backend route, database, ORM, migration, production persistence, file storage, new dependency, real external integration, auth, permission, approval, export, batch operation, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge factor, or production formula.

## Acceptance

- Model tests cover grouped failure reasons and empty-state summary.
- Detail page shows failure reason count, affected rows, top field, top error code, affected objects, and correction hints.
- Page copy stays read-only and does not expose repair, approval, export, or batch actions.
