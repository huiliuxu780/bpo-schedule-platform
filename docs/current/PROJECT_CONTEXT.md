# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

## Active Boundary

The project has entered a PM-confirmed database Gate. Database work may continue only through small, confirmed tasks. Implemented database slices cover local import batches, master data, personnel schedules, demand forecasts, login/status logs, comparison results, review closure records, import-center CSV upload/readiness/apply routes, persisted comparison/review queries, and related read-only frontend workbench flows.

The active product boundary remains local MVP and operator-facing workflow scaffolding. Permissions, approval, export, batch operations, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors remain out of scope unless a new task explicitly confirms them.

## Current Queue

`US857 / IM238` is the only ready story/task in the current layer.

The task is a QA preflight for review-case live runtime acceptance. It may refine documentation and Harness traceability only. It must not start backend 8000, seed data, run live runtime acceptance, or modify business code until PM confirms the Gate Plan.

## Recent State Summary

- The current integration branch combines the compact Harness state-governance pass with the review-case processing-path branch so future work can start from one baseline.
- The latest product work added operator-facing review-case processing paths without exposing Codex/Gate/PM acceptance language in product pages.
- Future live review-case acceptance still requires an approved 8000/API runtime; IM238 prepares that acceptance boundary without claiming it has passed.
- Harness state optimization is now the active maintenance concern: current context must stay compact, default reads must use the current layer, and history must be queried on demand through registry/legacy references.

## Current Execution Rules

- Read current files by default, not historical archive files.
- Treat `docs/current/**` as the execution queue source.
- Treat `docs/registry/**` as lookup indexes only.
- Do not execute from archive files.
- Keep subagents read-only for `docs/current/**` and `docs/registry/**`; the main Worker is the single writer.
- Keep old large files as historical sources during the transition.
- Run `bash scripts/check-state.sh` for state changes.
- `bash scripts/check.sh` runs strict state checks by default.
- Run `bash scripts/check.sh` before reporting a task complete.

## Current Stop Conditions

- Real external data sources or integrations.
- Database QA closeout or additional persistence unless a matching task is active.
- Unconfirmed new dependencies or package/lockfile changes.
- Authentication or permission boundaries.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code, formula, settlement-rule, or charge-factor changes.
- Destructive or ambiguous Git/file operations.
- Failed final verification.

## Current Recommendation

Confirm the IM238 Gate Plan before any runtime action. Recommended order: finish preflight documentation and task packets, then decide whether PM or Codex will run manual live acceptance on `codex/im237-harness-review-case-integration`, then separately confirm any seed extension for intermediate processing stages.
