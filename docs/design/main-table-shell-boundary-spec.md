# MainTableShell Boundary Spec

task_id: IM204
date: 2026-06-17
workflow: frontend-audit
status: planning-boundary
scope: read-only design/specification

## Conclusion

Do not continue the `SimpleTable` migration mechanically into the remaining main/workbench tables.

`SimpleTable` is now proven for light child/detail tables that need only columns, data, sorting, and an empty state. The remaining table owners combine list search, status filters, column visibility, summaries, pagination, and row actions. They need a future `MainTableShell` boundary before any implementation slice starts.

## Context

IM197 through IM203 migrated seven low-risk light tables to `SimpleTable` without changing route behavior, business copy, data contracts, backend behavior, dependencies, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors.

The next candidate tables are larger product surfaces, not equivalent child/detail tables. Treating them as another `SimpleTable` pass would hide product responsibilities inside a generic component and increase regression risk.

## Candidate Matrix

| Candidate | Product surface | Priority | Current responsibilities | Recommendation |
| --- | --- | --- | --- | --- |
| `components/schedule-plan-table.tsx` | `/schedule-plans` | 1 | plan summary, keyword/status/gap filters, column visibility, pagination, summary strip, detail links | First future shell consumer after the shell boundary is tested. |
| `components/unavailability-table.tsx` | `/unavailability` | 2 | unavailability query/status filters, column visibility, pagination, summary strip, impact/shift links | Second future shell consumer; keep domain actions outside the shell. |
| `components/data-table.tsx` | `/dashboard` | defer | dashboard/anomaly demo table, column visibility, pagination, row action placeholder | Keep deferred after IM208; it needs a clearer dashboard anomaly owner, route responsibility, and real workflow value before migration. |

## SimpleTable Boundary

`SimpleTable` should remain limited to light table rendering:

- accepts column definitions, rows, optional default sorting, and empty message
- owns TanStack sorting state, header rendering, cell rendering, and empty row rendering
- does not own search, filters, column visibility, pagination, summary strips, row actions, route links, page metrics, or business copy

## Future MainTableShell Boundary

A future `MainTableShell` may own only layout and repeated table operations:

- toolbar layout slots for search, filters, and secondary controls
- search container primitives, without owning domain query names
- filter slot layout, without owning domain filter options
- column visibility menu behavior
- summary strip slot layout
- shared table render loop and empty row structure
- pagination controls, page-size controls, and page-index clamp behavior

It must not own:

- domain column definitions
- domain filter state names or options
- row actions, route hrefs, or navigation semantics
- `MetricCard` or page-level metrics
- server query parameters or data fetching
- business status meanings, production operations, permissions, approval, export, batch operations, formulas, settlement rules, charge factors, or business copy

## Recommended Implementation Order

1. IM205: add a docs/test-only shell structure guard for the future `MainTableShell` boundary, with no UI code change.
2. IM206: migrate `schedule-plan-table` to `MainTableShell` while preserving visible UI, filters, pagination, links, and copy.
3. IM207: migrate `unavailability-table` only after IM206 proves the shell boundary.

IM208 closes the current table-abstraction chain. Defer `components/data-table.tsx`
until the dashboard/anomaly table has:

- a confirmed product owner and route responsibility
- a clear role in the current BPO WFM workflow rather than only a dashboard demo role
- an acceptance path that proves migration improves maintainability without hiding row actions or anomaly semantics in the shell

Do not reopen table migration work only because `data-table` still imports TanStack Table directly.

## Future Acceptance Gates

Future implementation slices should prove the following before Done Report:

- focused structure test covers the shell boundary and prevents repeated render-loop regressions
- browser smoke covers `/schedule-plans` for IM206 and `/unavailability` for IM207
- no route, data, query-parameter, copy, backend, dependency, permission, approval, export, batch, formula, settlement, or charge-factor changes are introduced
- `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` pass after traceability updates

## Stop Conditions

Stop for PM confirmation if a future slice needs new dependencies, route changes, real APIs, backend changes, business status semantics, row action capability changes, authentication, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors.
