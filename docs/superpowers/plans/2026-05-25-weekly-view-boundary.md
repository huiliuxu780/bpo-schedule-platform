# Weekly View Boundary Check Plan

## Scope

- Add a local frontend-only weekly view boundary check to the existing fulfillment calendar group-week sidebar.
- Keep the slice inside `app/person-timeline/page.tsx`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`.
- Do not add routes, sidebar entries, dependencies, backend code, database code, real integrations, auth, permission, approval, export, batch, automatic scheduling, settlement, charge-factor, or production formula work.

## Steps

1. Add a failing model and page-source test for `weeklyQaBoundarySummary` and the `WeeklyQaBoundaryPanel` placement.
2. Add the `weeklyQaBoundarySummary` model with covered panels, boundary count, open risk, escalation pressure, top boundary, related panel, and reason.
3. Render the weekly view boundary panel after weekly closure closeout and before the weekly review queue.
4. Update traceability docs and the current project context.
5. Verify with targeted tests, state check, product copy audit, navigation audit, lint, typecheck, browser smoke, whitespace check, and final `bash scripts/check.sh`.
