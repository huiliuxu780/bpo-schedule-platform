# Import Review Conclusion Preview Design

## Goal

Add a local read-only review conclusion preview to import batch detail pages so supervisors can read a suggested conclusion before review, without writing a review result or evidence.

## Scope

- Add a frontend model summary for import review conclusion preview.
- Reuse existing failure reason, quality impact, correction readiness, and correction material summaries.
- Show the preview after correction material preview on the import batch detail page.
- Keep no-action boundaries visible through deferred actions.

## Out Of Scope

- No backend interface.
- No database, ORM, migration, persistence, or file storage.
- No real external integration.
- No review result submission, evidence upload, exception close, approval, export, or batch operation.
- No production status dictionary, scheduling formula, settlement rule, charge factor, or production formula.

## Model Contract

`summarizeImportBatchReviewConclusion(batch, issueRows)` returns:

- `conclusionStatus`: `not_required`, `field_review`, or `quality_review`.
- `suggestedConclusion`: a readable conclusion for the supervisor.
- `confidence`: `none`, `medium`, or `high`.
- `evidenceSummary`: short evidence lines from field materials, failure-row samples, and quality references.
- `riskSummary`: short risk lines from linked quality issue or field-only review.
- `nextReviewPoint`: the next useful page-level review hint.
- `deferredActions`: no-action boundaries.

## Page Contract

The batch detail page shows “复核结论预览” after “修正材料预览”. The card includes conclusion status, confidence, evidence count, risk count, suggested conclusion, evidence summary, risk summary, next review point, and deferred actions.

## Acceptance

- Model tests cover linked quality issue, unlinked field-only batch, and no-failure empty state.
- Page smoke sees the new card and boundary text on a process-memory status-log batch.
- Final `bash scripts/check.sh` passes.
