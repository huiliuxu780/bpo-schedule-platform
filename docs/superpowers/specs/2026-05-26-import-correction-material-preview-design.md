# Import Correction Material Preview Design

## Goal

Add a local read-only correction material preview to the import batch detail page. The preview helps a site supervisor turn import failures into a compact review packet before talking to data owners or preparing a review discussion.

## Scope

This slice extends the existing import batch detail surface only. It does not add a route, backend endpoint, database persistence, file export, evidence upload, approval, batch operation, or production workflow state.

## Model

`lib/import-batch-history.ts` will expose `summarizeImportBatchCorrectionMaterials(batch, issueRows)`.

The summary will reuse existing model helpers:

- `summarizeImportBatchFailureReasons(batch)`
- `summarizeImportBatchQualityImpact(batch, issueRows)`
- `summarizeImportBatchCorrectionReadiness(batch, issueRows)`

The returned data will include:

- `materialStatus`: `not_required`, `field_material_ready`, or `quality_material_ready`
- `summary`: one business-facing sentence describing what material is ready to review
- `fieldMaterials`: grouped field/error-code material rows with failed row count, representative row, sample raw value, and correction hint
- `failureRowSamples`: a capped list of failed-row samples for quick review
- `qualityReferences`: linked quality issue references with title, severity, owner, matched fields, blocked rows, and detail href
- `conversationPoints`: short read-only points for supervisor discussion
- `deferredActions`: explicit no-action boundary such as no correction submit, no evidence upload, no approval/export/batch

For batches without failed rows, the model returns `not_required` with empty arrays and a neutral summary.

## UI

`app/import-batches/[batchId]/page.tsx` will add a card named `修正材料预览` after `修正准备摘要` and before `失败行明细`.

The card will show:

- material status, field material count, failed-row sample count, related quality issue count
- material summary
- field material rows
- failed-row samples
- quality references when present
- conversation points and deferred actions

Visible copy must stay business-facing. The page must not expose task IDs, implementation workflow language, or action affordances for submit/save/approval/export/batch.

## Verification

Use TDD against `scripts/tests/import-batch-history.test.mjs`.

Expected checks:

- linked quality issue batch produces `quality_material_ready`, field material rows, failure-row samples, quality references, conversation points, and deferred actions
- unlinked process-memory batch produces `field_material_ready`
- clean batch produces `not_required`
- route HTML smoke shows `修正材料预览`, `材料摘要`, `字段材料`, `失败行样本`, `沟通要点`, and `暂缓能力`

Final verification remains `bash scripts/check.sh`.
