# IM304 Formal Roster Change Governance Design

## Confirmed Product Contract

- Capability name: 正式班表变更治理.
- Navigation: independent second-level item under 计划与排班.
- Default entry: latest revision/current formal published chain for the selected month, project, workplace, and team.
- Core view: scheduler-facing version timeline plus personnel-date diff list.
- Diff rule: compare each revision cell by `source_cell_id` against the same source cell in its parent/superseded version.
- Linked issue rule: match resolved downstream issues by `linked_revision_version_id` and `roster_cell_id` or `source_cell_id`.
- Downstream readback: resolved issue can jump to the exact revision diff row and see before/after plus scheduler resolution note.
- API shape: one aggregate `GET /api/v1/roster-change-governance` endpoint; no new diff persistence table.
- Visibility:
  - `scheduler`: full scoped formal roster chain.
  - `team_lead`: current scoped team.
  - `frontline`: current employee or requester-related rows only.

## Explicit Non-goals

- Approval workflow, permission engine, notifications, export, batch actions.
- Forecasting model, standard capacity model, Excel import, automatic scheduling.
- Production settlement, formulas, charge factors, or new production status logic.
- New persisted diff table or historical Excel import path.
