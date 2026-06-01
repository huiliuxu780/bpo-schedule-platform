# Current Blockers

## Active Blockers

None.

## Standing Constraints

- Database work is allowed only inside a PM-confirmed database-persistence task and its named entity slice.
- No active frontend/import-center queue is executing after `IM045` completion.
- Do not expand completed Q127 QA closeout into product behavior changes, database schema changes, repository implementation changes, approval workflow, permissions, export, batch operations, external integrations, production formulas, settlement rules, or charge factors without a new task.
- No real external data integration.
- No multipart or Excel upload until a separate dependency/package decision is confirmed.
- No approval, export, batch operation, auth, permission, production formula, settlement, or charge-factor work.
- No archive execution.
