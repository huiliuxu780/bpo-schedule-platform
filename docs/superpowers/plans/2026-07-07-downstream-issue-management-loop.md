# IM303 Downstream Issue Management Loop

## Goal

Deliver a demonstrable downstream issue management loop for the published roster:

- frontline/team lead can register a local issue from a published roster cell
- downstream users can see own/team issue status without polluting the roster grid
- scheduler can triage open/resolved downstream issues in the roster draft workbench
- scheduler can close an issue with a resolution note and linked revision version
- resolved issue status can be read back by downstream users

## Non-goals

- approval workflow, permission engine, notifications, export, batch actions
- forecast model, standard capacity, Excel import, automatic scheduling
- full version history comparison and production settlement/formula logic

## Implementation Plan

1. Add current Harness trace for R971 / US891 / IM303.
2. Write failing tests for request detail, filters, summary, resolution note, and the two UI workspaces.
3. Extend request-intent persistence, service, and API with:
   - status/action/employee/requester filters
   - detail endpoint
   - summary endpoint grouped by cell/action/status
   - `scheduler_resolution_note` on resolve
4. Update `/published-roster` with an issue status drawer and cell open-issue hint.
5. Update `/roster-drafts` with a dedicated downstream issue workspace, filters, detail, and resolution note input.
6. Run focused checks, update trace/audit, run final `bash scripts/check.sh`, commit locally.

