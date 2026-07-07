# IM304 Formal Roster Change Governance Loop

## Goal

Deliver a demonstrable post-publish change governance loop for the formal roster:

- scheduler can open an independent change-governance workbench
- the workbench shows the formal roster version timeline for the current scope
- selecting a revision shows personnel-date before/after diff rows
- diff rows explain linked downstream resolved issues and scheduler notes
- downstream resolved issue entries can jump to the exact governance diff row

## Non-goals

- approval, permission engine, notification, export, or batch workflow
- forecasting model, standard capacity, Excel import, or automatic scheduling
- new diff table, production formula, settlement, or charge-factor work

## Implementation Plan

1. Add current Harness trace for R972 / US892 / IM304.
2. Write failing backend tests for version timeline, source-cell diff, linked issue matching, and visibility filters.
3. Write failing frontend structure tests for route, sidebar item, workbench slots, aggregate API fetch, and resolved issue jump links.
4. Implement aggregate governance API from existing roster versions, cells, published snapshots, and request intents.
5. Add `/roster-change-governance` workbench with version timeline, diff list, and linked issue explanation panel.
6. Add resolved issue jump links from downstream status and scheduler issue workspaces.
7. Run focused checks, state checks, final `bash scripts/check.sh`, and commit locally.
