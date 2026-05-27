# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness.

## Active Boundary

The project is in No Database MVP Mode. Product work may continue only through confirmed local frontend stories, local FastAPI seed/process-memory contracts, and verification tasks. The project must not connect or prepare a production database before PM confirms a later database Gate and provides an environment.

## Default Next Step

Production MVP first-batch planning from `docs/production-mvp-prd.md` has completed its first local contract block. `US104/B006` completed the local master-data import contract, `US105/B007` completed the personnel schedule import contract with 0.5h interval expansion semantics, and `US106/B008` completed the demand forecast, personnel schedule, login log, and status log comparison contract. Current queue is empty.

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

`US330/F253 -> US333/Q044` completed the supervisor closure-checklist slice: the fulfillment calendar group-day exception panel now shows a closure checklist with ready and missing material counts, checklist item status, owner role, judgment impact, and current judgment for the selected exception. Current queue is empty again.

`US334/F256 -> US337/Q045` completed the supervisor exception-queue grouping slice: the fulfillment calendar group-day exception panel now groups and filters queue items by missing material, supervisor judgment, and data check, with group counts in the queue summary. Current queue is empty again.

`US338/F259 -> US341/Q046` completed the personal-detail review-context slice: the fulfillment calendar personal daily three-track detail now shows the selected exception review group, current judgment, and closure checklist when opened from the group-day exception queue. Current queue is empty again.

`US342/F262 -> US345/Q047` completed the group review-load summary slice: the fulfillment calendar group-day exception panel now shows review load, top review group, next priority item, and group-level ready/missing material counts. Current queue is empty again.

`US346/F265 -> US349/Q048` completed the exception evidence to data-quality link slice: the fulfillment calendar group-day exception panel now shows related data quality issues, matched records, check fields, link reasons, recommendations, and quality detail links for the selected exception. Current queue is empty again.

`US350/F268 -> US353/Q049` completed the exception aging and priority escalation slice: the fulfillment calendar group-day exception panel now shows waiting duration, aging level, escalation reason, escalation target, next review window, and group-level aging/escalation counts. Current queue is empty again.

`US354/F271 -> US357/Q050` completed the supervisor daily workload summary slice: the fulfillment calendar group-day exception panel now shows daily focus item count, high-priority count, aging/escalation pressure, busiest owner role, owner workloads, and next focus item. Current queue is empty again.

`US358/F274 -> US361/Q051` completed the exception source consolidation slice: the fulfillment calendar group-day exception panel now shows primary exception source, next priority source, source distribution, source impact hours, and source-level high-priority/aging/escalation counts. Current queue is empty again.

`US362/F277 -> US365/Q052` completed the supervisor handoff overview slice: the fulfillment calendar group-day exception panel now shows handoff item count, open question count, escalation count, top recipient, next handoff item, and recipient-level handoff distribution. Current queue is empty again.

`US366/F280 -> US369/Q053` completed the team-day risk digest slice: the fulfillment calendar group-day exception panel now shows day risk level, risk score, headline, primary risk, next focus item, and risk signals. Current queue is empty again.

`US370/F283 -> US373/Q054` completed the supervisor exception communication context slice: the fulfillment calendar group-day exception panel now shows communication audience, purpose, key messages, referenced evidence, open questions, and next conversation point for the selected exception. Current queue is empty again.

`US374/F286 -> US377/Q055` completed the supervisor follow-up timeline slice: the fulfillment calendar group-day exception panel now shows detection, completed follow-up, current blocker, and next review nodes for the selected exception. Current queue is empty again.

`US378/F289 -> US381/Q056` completed the team-day risk trend slice: the fulfillment calendar group-day exception panel now shows risk direction, highest-risk day, current-day comparison, trend points, and next focus. Current queue is empty again.

`US382/F292 -> US385/Q057` completed the supervisor exception comparison slice: the fulfillment calendar group-day exception panel now shows selected exception rank, priority reason, compared exception, main difference, and focus order. Current queue is empty again.

`US386/F295 -> US389/Q058` completed the team-week risk distribution slice: the fulfillment calendar team-week view now shows highest-risk day, weekly risk points, primary reason, recommended drilldown group/date, and team rank. Current queue is empty again.

`US390/F298 -> US393/Q059` completed the exception owner load comparison slice: the fulfillment calendar group-day exception panel now shows selected exception owner load, busiest owner, compared owner, load difference, and focus order. Current queue is empty again.

`US394/F301 -> US397/Q060` completed the next-day watchlist slice: the fulfillment calendar group-day exception panel now shows next-day date, headline, ordered watch items, source exceptions, owner roles, and watch reasons. Current queue is empty again.

`US398/F304 -> US401/Q061` completed the group-risk cause split slice: the fulfillment calendar group-day exception panel now shows group risk cause headline, total impact hours, cause shares, impacted people, representative exceptions, and supervisor focus points. Current queue is empty again.

`US402/F307 -> US405/Q062` completed the team-week carryover overview slice: the fulfillment calendar group-day exception panel now shows carryover days, later-week gap/anomaly people, review targets, carryover reasons, and view order. Current queue is empty again.

`US406/F310 -> US409/Q063` completed the exception closure readiness summary slice: the fulfillment calendar group-day exception panel now shows ready/blocked counts, missing material, missing decision, data-check counts, next candidate, and blocker reasons before the review-load summary. Current queue is empty again.

`US410/F313 -> US413/Q064` completed the weekly supervisor review queue slice: the fulfillment calendar group-week view now shows team-level weekly review queue items by group/date, risk priority, gap/anomaly counts, suggested review target, and drilldown link. Current queue is empty again.

`US414/F316 -> US417/Q065` completed the closure evidence drill-in slice: the fulfillment calendar group-day exception panel now expands closure blockers into evidence items with person, owner role, current status, linked source records, next-view hint, and existing personal three-track drilldown. Current queue is empty again.

`US418/F319 -> US421/Q066` completed the weekly supervisor handoff summary slice: the fulfillment calendar group-week view now shows weekly handoff item count, open questions, escalation items, top recipient, next touchpoint, and drilldown links while preserving no-action boundaries. Current queue is empty again.

`US422/F322 -> US425/Q067` completed the team-level evidence gap distribution slice: the fulfillment calendar group-week view now shows weekly evidence gap type distribution, affected people, owner roles, representative people, and drilldown links while preserving no-action boundaries. Current queue is empty again.

`US426/F325 -> US429/Q068` completed the weekly closure readiness trend slice: the fulfillment calendar group-week view now shows daily closure readiness direction, ready/blocked day counts, top blocker, next review day, and drilldown links while preserving no-action boundaries. Current queue is empty again.

`US430/F328 -> US433/Q069` completed the supervisor review outcome preview slice: the fulfillment calendar group-day exception panel now shows suggested outcome, confidence, evidence summary, source references, readiness, open risk, and next review point while preserving no-action boundaries. Current queue is empty again.

`US434/F331 -> US437/Q070` completed the data-quality-to-exception reverse aggregation slice: the fulfillment calendar group-day exception panel now shows which data quality issues affect current exceptions, impacted exception count, people, hours, representative exceptions, and quality detail links while preserving no-action boundaries. Current queue is empty again.

`US438/F334 -> US441/Q071` completed the exception impact scope priority slice: the fulfillment calendar group-day exception panel now shows impact-scope priority, top exception, impacted objects, impacted comparisons, impact hours, blocker count, and ranked items while preserving no-action boundaries. Current queue is empty again.

`US442/F337 -> US445/Q072` completed the supervisor priority summary slice: the fulfillment calendar group-day exception panel now shows top supervisor focus, priority reasons, high-priority count, blocked count, escalation count, impact hours, impact scope, and ordered review items while preserving no-action boundaries. Current queue is empty again.

`US446/F340 -> US449/Q073` completed the handling readiness narrative slice: the fulfillment calendar group-day exception panel now shows a handling-prep narrative, readiness counts, missing blockers, evidence status, preparation steps, impact scope, and narrative items while preserving no-action boundaries. Current queue is empty again.

`US450/F343 -> US453/Q074` completed the supervisor decision digest slice: the fulfillment calendar group-day exception panel now shows suggested decisions, confidence, source references, open risks, next review point, and digest items while preserving no-action boundaries. Current queue is empty again.

`US454/F346 -> US457/Q075` completed the closure risk explanation slice: the fulfillment calendar group-day exception panel now shows why selected exceptions cannot close yet, business impact, missing evidence, owner role, next viewing step, and risk items while preserving no-action boundaries. Current queue is empty again.

`US458/F349 -> US460/Q076` completed the weekly decision digest slice: the fulfillment calendar group-week view now shows suggested weekly decisions, confidence, evidence summary, open risks, next review point, and source references before the weekly review queue while preserving no-action boundaries. Current queue is empty again.

`US461/F351 -> US463/Q077` completed the supervisor closure review summary slice: the fulfillment calendar group-day exception panel now shows ready-to-close count, pending review count, blockers, lead review item, suggested conclusion, evidence summary, risk summary, next action, and source references while preserving no-action boundaries. Current queue is empty again.

`US587/F403 -> US590/F405` completed the first G001 import-center and master-data foundation: CSV preview across five import types, import batch failure rows/version records, master-data CSV submit, process-memory imported binding records, and master-data page source batch/import version/reference status. Current queue now starts `US591/F406 -> US595/Q120`; forecast and login/status waves remain blocked until dependencies pass. Continue to block database, ORM, migration, dependency, external integration, auth, permission, approval, export, batch, file storage, Excel xlsx parsing, automatic scheduling, settlement, charge-factor, and production formula work.
