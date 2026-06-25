# MainTableShell Structure Guard

task_id: IM205
date: 2026-06-17
workflow: frontend-audit
status: docs-test-guard
scope: no UI implementation

## Purpose

This guard locks the boundary from `main-table-shell-boundary-spec.md` before a `MainTableShell` component exists. IM205 must not create or wire a `MainTableShell` implementation.

## Allowed Shell Responsibilities

A future `MainTableShell` may own only structural table concerns:

- toolbar layout slots
- column visibility menu
- summary strip slot
- shared table render loop
- empty row structure
- pagination controls

## Forbidden Shell Responsibilities

A future `MainTableShell` must not own domain or product behavior:

- domain column definitions
- domain filter state names
- row actions
- route hrefs
- server query parameters
- business status meanings
- business copy

## Candidate Order

1. `components/schedule-plan-table.tsx`
2. `components/unavailability-table.tsx`
3. Defer `components/data-table.tsx`

## Guard Rule

The structure test must fail if this document is removed, if the ownership boundary is weakened, if `components/main-table-shell.tsx` is introduced in IM205, or if candidate tables import or render `MainTableShell` before their implementation slices.
