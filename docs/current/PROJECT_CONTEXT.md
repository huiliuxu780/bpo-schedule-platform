# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness.

## Active Boundary

The project is in No Database MVP Mode. Product work may continue only through confirmed local frontend stories, local FastAPI seed/process-memory contracts, and verification tasks. The project must not connect or prepare a production database before PM confirms a later database Gate and provides an environment.

## Default Next Step

Production MVP first-batch planning from `docs/production-mvp-prd.md` has completed its first local contract block. `US104/B006` completed the local master-data import contract, `US105/B007` completed the personnel schedule import contract with 0.5h interval expansion semantics, and `US106/B008` completed the demand forecast, personnel schedule, login log, and status log comparison contract. Current queue is empty again.

The last completed product chain was `US083/F041 -> ... -> US102/Q014`, which extended local table parity across schedule plans, schedule risks, and unavailability tables without database, package, backend contract, approval, export, batch, permission, or production formula work.

The H024 current-queue smoke task proved that a ready story plus matching active task can pass strict state checks before execution; after completion, current queue returned to empty so done history does not accumulate here.

The H025 invariant pass added strict checks and regression tests that reject `status: done` inside current story/task files.

The H026 rollout changed `bash scripts/check.sh` to use strict state checks by default. State Repair Mode can run `BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh`; temporary warning-only diagnostics can run `BPO_STATE_CHECK_MODE=warning bash scripts/check.sh`.

The H027 registry pass added strict validation for `TRACE_INDEX.yaml` current file paths and de-duplicated registry path output.

The H028 plan-boundary pass made Codex Plan a temporary projection only. Harness current and registry files remain the state source.

The F030-F031/Q012 product pass proved the current/active state model can drive a frontend table parity chain and return current to empty after completion.

The F032-F040/Q013 product pass proved the same model can run a 10-task frontend chain and return current to empty after completion.

The F041-F059/Q014 product pass proved the same model can run a 20-task frontend chain and return current to empty after completion.

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

- New dependencies or package/lockfile changes.
- Real external data sources or integrations.
- Database connection setup, ORM, migrations, schema implementation, or production persistence config.
- Authentication or permission boundaries.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code, formula, settlement-rule, or charge-factor changes.
- Destructive or ambiguous Git/file operations.
- Failed final verification.

## Current Recommendation

`US109/F061 -> US112/Q016` completed the production MVP contract demo slice: local frontend contract client, model test, `/production-mvp` page, sidebar entry, and QA closeout.

`US113/F064 -> US116/Q017` completed the anomaly review read-only slice: local anomaly review model, model test, `/anomaly-review` page, sidebar entry, and QA closeout. Current queue is empty again.

`US117/F067 -> US126/Q018` completed the import-contract drilldown and data-quality center slice: local drilldown model, data-quality model, three production MVP contract drilldown pages, `/data-quality`, `/data-quality/[issueId]`, sidebar entry, and QA closeout. Current queue is empty again.

`US127/F076 -> US136/Q019` completed the personnel timeline, demand forecast contract, and master-data relationship slice: local model tests, `/person-timeline`, `/person-timeline/[employeeId]`, `/production-mvp/demand-forecast`, `/master-data-relations`, sidebar entries, production MVP overview links, route smoke, and QA closeout. Current queue is empty again.

`US137/F085 -> US146/Q020` completed the shift type, import template, and anomaly source slice: local model tests, `/shift-types`, `/import-templates`, `/anomaly-review/sources`, `/anomaly-review/sources/[sourceId]`, sidebar entries, anomaly review source link, route smoke, and QA closeout. Current queue is empty again.

`US147/F094 -> US156/Q021` completed the import batch history, field mapping preview, and review status timeline slice: local model tests, `/import-batches`, `/import-batches/[batchId]`, `/field-mapping`, `/anomaly-review/timeline`, sidebar entries, anomaly review timeline link, route smoke, and QA closeout. Current queue is empty again.

Recommended next production MVP slice: pick 2-3 tightly related display-only tasks from data-quality issue grouping, import-batch to issue drilldown links, or production MVP acceptance checklist. Keep the next slice local/frontend only: no database, no real external integration, no auth/permission, no approval/export/batch, no automatic scheduling, and no production formula/settlement/charge-factor work.
