# Import Quality Impact Rollup Design

## Context

`F372` added a local read-only failure reason summary on import batch detail pages. The next useful slice is to connect those failure reasons back to existing data-quality issues so a site supervisor can see which quality problems are most likely affected by the current failed import rows.

## Scope

- Add a frontend model helper that accepts an `ImportBatch` and data-quality issue rows.
- Match related quality issues by the batch's existing `qualityIssueIds`.
- Derive field coverage by comparing failure row fields with issue `fieldName` and `sourceField`.
- Surface impacted issue count, unmatched failure reason count, affected objects, top issue, and ordered issue items.
- Show the rollup on `app/import-batches/[batchId]/page.tsx` after the failure reason summary and before row-level details.

## Boundaries

- No new backend endpoint.
- No database, ORM, migration, or production persistence.
- No real external integration.
- No repair submission, approval, export, batch operation, permission, production status dictionary, settlement rule, charge factor, or production formula.
- No new dependencies or package/lockfile changes.

## UI Behavior

When related quality issues exist, the page shows a “质量影响聚合” card with:

- 关联问题数
- 覆盖字段数
- 未关联原因数
- 首要问题
- affected object badges
- ordered issue rows with severity/status, blocked rows, matched fields, recommendation, and link to issue detail

When no quality issues relate to the batch, the card shows a neutral empty state that says no linked quality impact is available for the current batch.

## Testing

- Add model tests for matched quality issues, field coverage, top issue ordering, affected object collection, and unmatched failure reason count.
- Add empty-state model coverage for a clean batch or a batch without `qualityIssueIds`.
- Keep product UI copy and navigation audits green.
- Verify detail-page HTML/smoke contains the new rollup labels and representative values.
