# Dashboard Downstream Entry Spec

task_id: IM210
date: 2026-06-17
workflow: frontend-audit
scope: product/design specification only

## Conclusion

Future dashboard anomaly entries should be summary-to-workspace links only.

`/dashboard` may surface operational risk, counts, priority, owner hints, and a stable link into an existing downstream workspace. It must not become the owner of investigation, review evidence, case closure, comparison computation, batch application, production actions, permissions, approval, export, settlement, formulas, or charge factors.

## Existing Workspace Targets

### Comparison Run Detail

Use when a dashboard row already has a stable comparison run ID.

- target: `/data-quality/comparison-runs/[runId]`
- source evidence: the existing page loads a comparison run detail workspace by `runId` and reads same-business-date review cases.
- allowed dashboard responsibility: show a concise anomaly summary and link label such as `查看对比运行`.
- not allowed: trigger or rerun comparison, infer a synthetic `runId`, or summarize a run that the downstream workspace cannot read.

### Review Case Detail

Use when a dashboard row already has a stable review case ID.

- target: `/data-quality/review-cases/[caseId]`
- source evidence: the existing page owns review-case detail, same-owner context, evidence/conclusion/closure feedback, and case processing state.
- allowed dashboard responsibility: show that an anomaly has an existing review case and link to it.
- not allowed: add evidence, add conclusion, close the case, or duplicate review-case status logic inside dashboard.

### Import Batch Result Trace

Use when a dashboard row is best explained by a known source batch or data-quality issue.

- target: `/data-quality/[batchId]?tab=result-trace`
- compatibility target: `/data-quality/import-batches/[batchId]` redirects to `/data-quality/[batchId]` and may preserve existing query parameters.
- source evidence: the batch detail page owns readiness, batch detail, row correction, result trace, comparison runs, review cases, and data tools tabs.
- allowed dashboard responsibility: link to the batch result-trace view when the row has a stable `batchId`.
- not allowed: invent row-correction state, apply readiness, downstream run counts, or result-trace conclusions without the batch workspace.

### Actual Log Production Detail

Use when the anomaly is about login/status logs, timezone, cross-day boundaries, dictionary mismatch, or source actual-log version quality.

- target: `/actual-logs/production/[batchId]`
- source evidence: the existing page loads source batches and actual-log detail by `batchId`.
- allowed dashboard responsibility: identify that the anomaly belongs to an actual-log version and provide a link to the detail workspace.
- not allowed: generate status intervals, normalize timezone results, or decide production log validity inside dashboard.

### Schedule Production Detail

Use when the anomaly is about an applied personnel schedule version, reference completeness, or generated 0.5h schedule rows.

- target: `/schedule-plans/production/[batchId]`
- source evidence: the existing page loads production schedule detail by `batchId`.
- allowed dashboard responsibility: link to the schedule version detail when the anomaly has a stable schedule production batch.
- not allowed: publish, freeze, unpublish, recompute, or change production schedule semantics from dashboard.

## Entry Decision Rules

1. Prefer the most specific stable downstream ID:
   `caseId` > `runId` > source `batchId` with known workspace type.
2. If only a business date, owner, or issue category is known, do not create a row-level detail link unless an existing list route and query contract are explicitly confirmed in a future task.
3. If multiple downstream IDs exist, dashboard may show one primary link plus one secondary text count, but the ranking rule must be confirmed by a separate product task before implementation.
4. If no stable downstream ID exists, keep the row as overview only and show a non-actionable state such as `等待下游定位` in the future implementation.
5. Dashboard row status must be display-only. The source of truth for review, closure, comparison, batch, and production status remains the downstream workspace.

## Ownership Boundary

Dashboard owns:

- summary counts and priority hints
- high-level anomaly row labels
- optional links to existing downstream workspaces
- empty or blocked entry states when no stable downstream ID exists

Downstream workspaces own:

- comparison-run detail and rerun semantics
- review-case evidence, conclusions, closure, and processing state
- import batch readiness, correction, result trace, and data tools
- actual-log timezone, cross-day, dictionary, interval, and source-version detail
- schedule production version detail, reference completeness, and disabled production action shells

## Future Implementation Gate

The smallest future implementation slice should be read-only and link-only:

- add stable downstream ID fields to dashboard data only after the data source is confirmed
- render links only for rows with existing downstream IDs
- keep row actions disabled or absent when the link target cannot be proven
- browser-smoke `/dashboard` and the target detail route for every enabled link type

Stop for PM confirmation if implementation would require new routes, new query parameter contracts, backend/API/database changes, real exception queries, review writes, case closure, comparison execution, batch apply, production actions, auth, permissions, approval, export, settlement, formulas, or charge factors.
