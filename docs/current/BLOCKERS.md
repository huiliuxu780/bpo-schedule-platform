# Current Blockers

## Active Blockers

None.

## Standing Constraints

- Database work is allowed only inside a PM-confirmed database-persistence task and its named entity slice.
- Do not expand completed comparison result persistence into review closure records, external integrations, auth, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors without a new task.
- No real external data integration.
- No approval, export, batch operation, auth, permission, production formula, settlement, or charge-factor work.
- No archive execution.
