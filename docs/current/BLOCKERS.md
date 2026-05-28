# Current Blockers

## Active Blockers

None.

## Standing Constraints

- Database work is allowed only inside a PM-confirmed database-persistence task and its named entity slice.
- Do not expand completed review closure persistence into approval workflow, permissions, export, batch operations, external evidence storage, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors without a new task.
- No real external data integration.
- No approval, export, batch operation, auth, permission, production formula, settlement, or charge-factor work.
- No archive execution.
