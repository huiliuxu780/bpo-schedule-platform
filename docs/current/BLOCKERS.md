# Current Blockers

## Active Blockers

None.

## Standing Constraints

- Database work is allowed only inside a PM-confirmed database-persistence task and its named entity slice.
- Do not expand DB003 master data persistence into schedules, forecasts, login/status logs, comparison results, or review closure records without a new task.
- No real external data integration.
- No approval, export, batch operation, auth, permission, production formula, settlement, or charge-factor work.
- No archive execution.
