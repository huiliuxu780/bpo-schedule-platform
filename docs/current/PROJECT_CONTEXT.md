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

`US281/F216 -> US286/Q033` completed the import quality traceability slice: import batch details now drill into related data quality issues, issue details expose source template, source field, original value, error code, affected objects, impact links, and batch failure impact summaries. Current queue is empty again.

`US287/F221 -> US292/Q034` completed the master-data relationship closure: employee bindings now show supplier, workplace, project, skills, validity, status, anomaly/data-quality references, and reverse lookup links; shift types now explain meal/rest windows and counting policy. Current queue is empty again.

`US294/F226 -> US297/Q035` completed the supervisor exception handling read-only closure: fulfillment calendar exception items now show handling suggestions, three-track evidence summaries, and read-only handling records. Current queue is empty again.

`US298/F229 -> US301/Q036` completed the supervisor exception handoff read-only closure: fulfillment calendar exception items now show handling outcome categories, handoff summaries, and data-check readiness hints. Current queue is empty again.

`US302/F232 -> US305/Q037` completed the data-quality repair-prep read-only slice: fulfillment calendar exception items now show data-owner intervention judgment, repair preparation materials, and data-quality impact scope. Current queue is empty again.

`US306/F235 -> US309/Q038` completed the supervisor follow-up summary read-only slice: fulfillment calendar exception items now show supervisor follow-up status, follow-up gap lists, and group follow-up rollups. Current queue is empty again.

`US310/F238 -> US313/Q039` completed the product semantic cleanup slice: visible product UI no longer exposes local-MVP wording, task IDs, read-only process labels, sidebar priority/new tags, or sample-language labels. Current queue is empty again.

`US314/F241 -> US317/Q040` completed the schedule draft personnel-linkage slice: the schedule draft edit page now shows personnel-level schedule linkage for each 0.5h interval, including summary count, linked people count, difference, status, and linked people. Current queue is empty again.

`US318/F244 -> US321/Q041` completed the schedule draft fulfillment-calendar drilldown slice: linked people in the schedule draft edit page now route to the matching fulfillment calendar personal daily three-track detail with date, team, and group context preserved. Current queue is empty again.

`US322/F247 -> US325/Q042` completed the personal schedule-source drillback slice: the fulfillment calendar personal daily three-track detail now shows schedule draft source, plan/draft links, shift window, schedule detail ID, and related 0.5h interval count differences. Current queue is empty again.

`US326/F250 -> US329/Q043` completed the supervisor resolution-draft slice: the fulfillment calendar group-day exception panel now shows suggested conclusion, required evidence, communication target, owner role, next review point, and open-risk text for the selected exception. Current queue is empty again.

Recommended next production MVP slice: continue with supervisor closure checklist or local exception action-registration design, keeping it local/frontend-only unless PM confirms a separate production action Gate.
