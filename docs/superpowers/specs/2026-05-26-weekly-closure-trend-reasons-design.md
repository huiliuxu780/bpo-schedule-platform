# Weekly Closure Trend Reasons Design

## Goal

Add a local read-only reason breakdown to the existing weekly closure readiness trend so supervisors can see why each day is improving, declining, or stable.

## Scope

- Extend `FulfillmentTeamClosureReadinessTrendPoint` with reason-breakdown fields derived from existing local exception queues.
- Show the breakdown inside the existing `ClosureReadinessTrendPanel` on the group-week view.
- Keep all behavior local and read-only.

## Out Of Scope

- No backend endpoint, database, ORM, migration, persistence, external integration, auth, permission, approval, export, batch operation, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge factor, or production formula work.
- No new route or sidebar entry.

## Design

Each trend point keeps the existing counts and gains:

- `changeReason`: human-readable explanation of the direction compared with the previous day.
- `primaryBlocker`: the dominant blocker for the day, based on missing material, missing supervisor decision, or data check count.
- `breakdown`: ordered rows for material, supervisor decision, and data check blockers.
- `nextViewHint`: the next read-only place to inspect when the day is blocked.

The UI adds a compact reason section below the seven-day trend grid. It highlights the most important blocked day and lists the per-day reason snippets without adding any action buttons.

## Verification

- Add TDD coverage in `scripts/tests/person-timeline.test.mjs` for the Shanghai weekly trend reason fields.
- Run a route smoke for `/person-timeline?team=...` and check the HTML contains the reason breakdown copy.
- Run `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
