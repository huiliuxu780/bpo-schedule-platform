# Current Blockers

## Active Blockers

- `IM215` review-case acceptance smoke cannot complete in the current live environment: `127.0.0.1:3000` routes are reachable, but the required review-case API on `127.0.0.1:8000` is not running. PM has instructed not to start other test environments. Unblock by allowing an approved backend/API runtime, providing a running API endpoint, or downgrading IM215 to model/contract-only acceptance.

## Active Scope Constraints

None.

## Standing Constraints

- Database work is allowed only inside a PM-confirmed database-persistence task and its named entity slice.
- Do not expand completed Q127 QA closeout into product behavior changes, database schema changes, repository implementation changes, approval workflow, permissions, export, batch operations, external integrations, production formulas, settlement rules, or charge factors without a new task.
- No real external data integration.
- No multipart or Excel upload until a separate dependency/package decision is confirmed.
- No approval, export, batch operation, auth, permission, production formula, settlement, or charge-factor work.
- No archive execution.
