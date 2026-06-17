# Dashboard Anomaly Table Ownership Audit

task_id: IM209
date: 2026-06-17
workflow: frontend-audit
scope: read-only product/design audit

## Conclusion

Keep `components/data-table.tsx` out of the MainTableShell migration queue for now.

The dashboard anomaly table is currently a local overview widget under `/dashboard`, backed by static `app/dashboard/data.ts` rows and historical F030/F031 table-parity tasks. It is not yet the primary workspace for review-case handling, comparison-run investigation, import quality triage, or production exception closure.

## Evidence

- `/dashboard` renders `DataTable` as the final overview section after global filters, metrics, trend chart, and heatmap.
- `components/data-table.tsx` imports local `anomalies` from `app/dashboard/data.ts`.
- The row action is still a local placeholder button, not a route into review cases or comparison runs.
- Historical R058-R060 and US070-US072 framed this table as local dashboard table parity.
- Later exception workflow work moved real investigation context into data-quality, comparison-run, review-case, import-batch, and actual-log production pages.

## Product Ownership

Current owner: `运营工作台 / 经营总览`.

Current responsibility:

- summarize current operational risk on the homepage
- provide local filtering and scanning of sample anomaly rows
- preserve dashboard-01 style table parity

Not current responsibility:

- review-case queue ownership
- comparison-run detail ownership
- import quality issue triage ownership
- approval, export, batch operations, automatic scheduling, settlement, or charge-factor workflows

## Recommended Next Paths

### Path A: Keep As Overview Widget

Recommended default.

Keep `DataTable` as a dashboard summary table and avoid more abstraction work unless the dashboard itself is redesigned. This protects product focus and avoids treating demo/local parity code as core workflow debt.

### Path B: Promote To Exception Triage Entry

Only consider this after a confirmed product task defines where each anomaly row should go:

- comparison run detail
- review case detail
- import batch quality trace
- actual log production detail

This path would require route semantics and acceptance checks before any UI implementation.

### Path C: Replace With Real Downstream Summary

Use when the dashboard should show aggregated links into existing real workspaces instead of local anomaly rows. This is a product redesign task, not a table refactor.

## Stop Conditions

Stop for PM confirmation if future work requires:

- new routes or changed navigation semantics
- backend/API/database changes
- real exception query integration
- review-case writes or closure actions
- approval, export, batch operations, permissions, automatic scheduling, formulas, settlement rules, or charge factors

## Decision

Do not migrate `components/data-table.tsx` to `MainTableShell` only because it still owns a TanStack render loop.

The next useful work should be a product slice with a clear workflow owner, not another generic table abstraction slice.
