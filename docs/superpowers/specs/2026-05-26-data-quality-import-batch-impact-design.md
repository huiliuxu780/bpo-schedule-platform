# Data Quality Import Batch Impact Design

## Goal

Add a local read-only reverse aggregation on data quality detail pages so supervisors can see which import batches are affected by the current quality issue.

## Scope

- Add a data-quality model summary that matches a quality issue to existing import batches.
- Use local `fallbackImportBatches` on the detail page.
- Match batches through `qualityIssueIds`, failure impact `relatedIssueIds`, and matching failure rows by field or error code when present.
- Show batch count, failed rows, matched fields, affected objects, batch entry links, and review hints.

## Out Of Scope

- No backend interface.
- No database, ORM, migration, persistence, or file storage.
- No real external integration.
- No quality repair submission, approval, export, batch operation, or production workflow state.
- No production status dictionary, scheduling formula, settlement rule, charge factor, or production formula.

## Model Contract

`summarizeDataQualityImportBatchImpact(issue, batches)` returns:

- `totalBatchCount`: matched import batch count.
- `totalFailedRows`: failed rows or related impact rows across matched batches.
- `matchedFields`: unique matched fields.
- `affectedObjects`: unique affected objects.
- `items`: per-batch rows with batch id, template, source file, status, failed rows, matched fields, affected objects, href, and review hint.
- `deferredActions`: no-action boundaries.

## Page Contract

The data quality detail page shows “影响导入批次” after the impact object/link cards. The card includes summary metrics and a per-batch list with links to import batch detail pages.

## Acceptance

- Model tests cover linked fallback batches, field/error-row matching, and empty state.
- Page smoke sees the new card and boundary text on `/data-quality/DQ-202605-004`.
- Final `bash scripts/check.sh` passes.
