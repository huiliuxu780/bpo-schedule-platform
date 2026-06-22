# Dashboard Anomaly Chain Closeout

## Conclusion

The dashboard anomaly chain is closed after IM209, IM210, and IM211.

`/dashboard` remains the business overview surface. It may summarize operational risk and, in a future confirmed task, link to an existing downstream workspace when a stable downstream ID is present. It should not become the primary exception handling, review, comparison, import-quality, actual-log, or schedule-production workspace.

## Closed Decisions

- IM209 confirmed `components/data-table.tsx` belongs to `/dashboard` as a local anomaly overview widget, not a MainTableShell candidate.
- IM210 defined future dashboard anomaly entries as summary-to-workspace links only.
- IM211 changed rows without stable downstream IDs to the disabled `等待下游定位` state.
- Current static dashboard rows must not be patched with fabricated `caseId`, `runId`, `batchId`, processing status, review conclusion, or production action data.

## Next Product Priority

1. Review-case workspace: highest exception-handling value because it owns evidence, conclusion, owner/stage context, and closure-adjacent navigation.
2. Comparison-run workspace: useful when the PM wants result evidence, source versions, and difference review before review-case action.
3. Data-quality result trace: useful for import-administration continuity and batch-to-result explainability.

## Not Recommended Now

- Add mock downstream IDs to static dashboard anomaly rows.
- Add new dashboard routes, query parameters, or list contracts.
- Add review writes, case closure, comparison execution, batch application, production actions, permissions, approval, export, automatic scheduling, production formulas, settlement rules, or charge factors from dashboard.
- Continue table abstraction work on `components/data-table.tsx` without a new product owner and workflow decision.

## Product Baseline Note

The project understanding document frames Dashboard as the operating overview and separates the real business domains into planning, data quality, logs, and master data. That baseline supports stopping dashboard expansion here and returning implementation attention to real downstream workspaces.
