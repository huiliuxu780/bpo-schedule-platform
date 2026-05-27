# Project State

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness.

For current execution context, default next step, active queue, active tasks, and blockers, read:

- `docs/current/PROJECT_CONTEXT.md`
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`

This file is now long-term project state only. It must not maintain the ready queue or a running list of completed stories.

## Active Scope

The project contains:

- A PM-confirmed shadcn/ui-style BPO WFM dashboard scaffold.
- Local scheduling-plan MVP verticals backed by local FastAPI seed/process-memory contracts and frontend fallback contracts.
- No Database MVP Mode.
- Local detail drilldowns for scheduling risks and unavailability impact.
- Display-only TanStack Table parity slices across the current schedule-plan, demand-plan, shift-detail, risk, and unavailability views.
- Dashboard anomaly detail table parity, including local TanStack Table sorting, filtering, pagination, column visibility, and page-size controls.
- Dashboard local operational polish for anomaly filters, data sync status table parity, and heatmap deficit summaries.
- Fulfillment calendar supervisor-side local read-only panels for exception review, closure readiness, closure risk, closure review summary, weekly decision digest, data-quality impact ranking, weekly data-quality summary, weekly owner pressure, weekly source pressure, weekly review comparison, weekly closure closeout, and weekly view boundary check.
- A demand forecast CSV upload/import local vertical backed by FastAPI process-memory batch results and failure-row records.
- A personnel schedule CSV upload/import local vertical backed by FastAPI process-memory batch results and failure-row records.
- A login log CSV upload/import local vertical backed by FastAPI process-memory batch results and failure-row records.
- A status log CSV upload/import local vertical backed by FastAPI process-memory batch results and failure-row records.
- An import batch list that reads FastAPI process-memory CSV import results before falling back to local sample rows.
- A master-data CSV upload/import local vertical backed by FastAPI process-memory batch results, failure rows, generated import versions, imported employee binding records, and master-data page traceability for source batch, import version, and reference status.
- A master-data maintenance local vertical backed by FastAPI process-memory add/update, freeze/unfreeze, effective-date validation, binding reference checks, and data-quality-style blocked reference reasons.
- A personnel-schedule CSV upload/import local vertical backed by FastAPI process-memory imported personnel schedule rows, schedule versions, source batch traceability, and shift-type reference validation.
- `US530/F382 -> US532/Q100` completed a data-quality impacted-person view-order slice: the data quality overview now groups impacted people by quality causes and exceptions, showing representative causes, representative issues, personal fulfillment links, next viewing hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US533/F383 -> US535/Q101` completed a data-quality impacted-day view-order slice: the data quality overview now groups impacted fulfillment dates by quality causes, exceptions, and people, showing representative causes, representative issues, fulfillment date links, next viewing hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US536/F384 -> US538/Q102` completed a data-quality field impact cross-summary slice: the data quality overview now groups impacted source fields by fulfillment dates, people, and exceptions, showing source labels, representative causes, representative issues, field-detail links, next viewing hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US539/F385 -> US541/Q103` completed a data-quality review-priority rationale slice: the data quality overview now combines impacted issue, field, date, person, and cause summaries into a supervisor-readable first-review explanation with next viewing hints and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US542/F386 -> US544/Q104` completed a data-quality review-path sequence slice: the data quality overview now combines priority issue, field, date, person, and cause summaries into ordered supervisor view steps with links, reasons, impact counts, next viewing hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US545/F387 -> US547/Q105` completed a data-quality review-coverage gap slice: the data quality overview now compares current review-path issue coverage with impacted-exception top issues, showing uncovered issues, fields, people, gap reasons, next viewing hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US548/F388 -> US550/Q106` completed a data-quality gap owner/source pressure slice: the data quality overview now groups uncovered review gaps by responsible owner and data source, showing gap issues, impacted exceptions, impacted people, source fields, representative issue links, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US551/F389 -> US553/Q107` completed a data-quality gap next-review recommendation slice: the data quality overview now converts owner/source pressure into ordered read-only review steps with representative issue links, impacted exception counts, impacted people counts, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US554/F390 -> US556/Q108` completed a data-quality review import-batch impact slice: the data quality overview now links the next-review representative issue to local import batch impact, showing related batches, failed rows, matched fields, affected objects, batch links, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US557/F391 -> US559/Q109` completed a data-quality review group-link slice: the data quality overview now links the next-review representative issue to quality groups, showing matched groups, ungrouped count, grouped issue count, risk, owner, templates, trace keys, group links, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US560/F392 -> US562/Q110` completed a data-quality group exception coverage slice: the data quality overview now shows which quality groups affect fulfillment exceptions, including impacted groups, impacted exceptions, impacted people, blocked rows, representative issues, source templates, trace keys, affected objects, group links, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US563/F393 -> US565/Q111` completed a data-quality group review sequence slice: the data quality overview now turns impacted quality groups into ordered supervisor review steps, showing first step, owner, risk, representative issue, impacted exceptions, impacted people, blocked rows, group links, next-view hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US566/F394 -> US568/Q112` completed a data-quality group step impact drilldown slice: the data quality overview now connects each group review step to representative issues, impacted people, affected objects, quality issue links, person fulfillment links, next-view hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US569/F395 -> US571/Q113` completed a data-quality group step owner/person load slice: the data quality overview now rolls group review steps up by owner, showing step counts, impacted people, group titles, representative issues, issue links, person fulfillment links, next-view hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US572/F396 -> US574/Q114` completed a data-quality group step owner review queue slice: the data quality overview now converts owner/person load into ordered owner review queue items, showing rank, owner, representative issue, primary person, related groups, queue reasons, issue links, person links, next-view hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US575/F397 -> US577/Q115` completed a data-quality group step owner handoff brief slice: the data quality overview now converts owner review queue items into supervisor handoff wording, showing owner, representative issue, primary person, related groups, handoff points, issue links, person links, next-view hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US578/F398 -> US580/Q116` completed a data-quality group step owner handoff risk slice: the data quality overview now converts owner handoff brief items into supervisor risk wording, showing owner, representative issue, primary person, related groups, blocker reasons, issue links, person links, next-view hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US581/F399 -> US583/Q117` completed a data-quality handoff risk import-batch impact slice: the data quality overview now links owner handoff risks to local import batches and failure rows, showing owner, representative issue, related batches, failed rows, matched fields, affected objects, issue links, batch links, person links, next-view hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.
- `US584/F400 -> US586/F402` completed a supervisor exception handling write-loop slice: the person timeline exception panel now supports submitting a review conclusion, adding evidence, and closing an exception into a process-memory handling record. It remained local/process-memory only and returned current queue and active tasks to empty.
- `G001/R618 -> R652` has been split into a long-running production-prototype chain for real-like CSV upload/import, field mapping, batch/failure-row records, local version records, master-data maintenance, personnel schedule production flow, demand forecast production flow, and login/status log processing. `US587/F403 -> US595/Q120` is done through personnel schedule import records, shift-type validation, schedule version/source batch traceability, 0.5h expansion, person/schedule-detail trace links, and QA; current queue is in the demand forecast wave. Later forecast and login/status waves stay blocked until their dependencies pass. The scope remains no-database, no-ORM, no-migration, no-real-external-integration, no-auth/permission, no-approval/export/batch, no-file-storage, no-Excel-xlsx, no-automatic-scheduling, no-settlement, no-charge-factor, and no-production-formula.
- `US596/F409` is done for demand forecast CSV import: successful rows become process-memory forecast rows with business date, workplace, project, 0.5h interval, skill group, grade, forecast agents, source batch, and forecast version; invalid workplace/project/skill/grade or invalid forecast agents enter failure rows and do not enter demand rows. Current queue starts `US596/F410` for forecast version change tracking.
- `US596/F410` is done for demand forecast version change tracking: repeated imports for the same business date, workplace, project, 0.5h interval, skill group, and grade generate local change records with previous/new batch, version, forecast agents, and change type. Current queue starts `US597/F411` for forecast-vs-schedule alignment.
- `US597/F411` is done for demand forecast vs personnel schedule alignment: imported forecast rows are compared with personnel-schedule 0.5h interval records by business date, workplace, project, interval, skill group, and grade, producing shortage, overstaffed, balanced, or no-matching-schedule results with demand and schedule traceability. Current queue starts `US598/Q121` for demand forecast foundation QA.
- `US598/Q121` completed the G001 demand forecast foundation QA: demand forecast import, generated forecast versions, version-change records, forecast-vs-schedule alignment, target contract tests, product copy/navigation tests, strict state checks, whitespace checks, and full project checks passed. Current queue and active tasks are empty; next recommended wave is login/status processing from `US599/F412` and `US600/F413` after PM confirms unblocking.
- `US599/F412` is done for login log import and business-day normalization: successful login rows become process-memory login records with source batch/version, normalized business date, IANA timezone, normalized login/logout timestamps, cross-day flag, duration minutes, workplace, project, source system, and device traceability; invalid timezone or invalid time range rows fail. Current queue starts `US600/F413` for status log dictionary validation.
- `US600/F413` is done for status log import and status dictionary validation: successful status rows become process-memory status records with source batch/version, normalized business date, IANA timezone, normalized start/end timestamps, cross-day flag, duration minutes, fixed status label, productivity flag, and source status code; unknown status types fail. Current queue starts `US601/F414` for login/status 0.5h slicing and quality issues.
- `US601/F414` is done for login/status 0.5h slicing and quality issues: imported login and status records generate actual-log half-hour interval records with login minutes, status minutes, productive minutes, source log IDs, status types, and trace status; status gaps and overlaps generate process-memory quality issue records. Current queue starts `US602/F415` for schedule-vs-actual anomaly generation.
- `US602/F415` is done for schedule-vs-actual anomaly generation: personnel schedules, login records, status records, actual-log intervals, and quality issues now generate local anomalies for no login, late login, early logout, unscheduled login, non-productive status, status gap, and status overlap. Current queue starts `US603/Q122` for login/status processing QA.
- `US603/Q122` completed the G001 login/status processing QA: login import, status import, business-day normalization, status dictionary, actual-log 0.5h slicing, status gap/overlap quality issues, schedule-vs-actual anomalies, strict state checks, whitespace checks, and full project checks passed. Current queue starts `US604/Q123` for full-chain boundary QA.
- `US604/Q123` completed the G001 full-chain boundary QA: import center, master data, personnel schedule, demand forecast, login/status processing, actual-log slicing, schedule-vs-actual anomalies, and QA evidence remain local CSV/process-memory contracts with no database, ORM, migrations, real external integration, auth/permission, approval, export, batch operations, automatic scheduling, production formulas, settlement, or charge factors. Current queue and active tasks are empty.
- `US587/F403` completed the G001 CSV upload and field-mapping preview slice: the import page supports selecting master data, personnel schedule, demand forecast, login log, or status log CSV files, then previews detected fields, row counts, missing required fields, unknown fields, and pending validations before import. The backend exposes the same local preview contract at `/api/v1/import-batches/preview`. Current queue now starts at `US588/F404`.
- `US588/F404` completed the G001 import batch result and version-record slice: process-memory import results now include business date ranges and generated import version records for successful rows, while failed rows keep row number, field, raw value, error code, and message. Import batch details show the business date range and import versions. Current queue now starts at `US589/Q118`.
- `US589/Q118` completed the G001 import-center foundation QA: CSV upload/field mapping, import batch rows, failed-row traceability, generated import versions, no-database boundary, and page smoke were verified. Current queue now starts at `US590/F405`.
- A documentation-first Lightweight Harness with current/registry state governance.

The project does not contain:

- Real external API integration.
- Database persistence or production persistence setup.
- Authentication or production permission boundaries.
- Real Excel import or real CORN integration.
- Database-backed import persistence or production file storage.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code finalization, formulas, settlement rules, or charge factors.

## No Database MVP Mode

PM confirmed on 2026-05-12 that the project should not connect a database before the local MVP feature chain is developed and verified, because there is currently no database environment.

Allowed local MVP data modes:

- Local FastAPI endpoints backed by seed data or process memory.
- Frontend API-client fallback data that matches the same contract.
- Read-only or draft-only local verification flows.
- Documentation and audit records that keep database work out of scope.

Hard stop until a later PM-confirmed Gate:

- Database connection setup.
- ORM models, repositories, or adapters.
- Migration files.
- Schema implementation as engineering work.
- Production persistence configuration.
- Real external data-source integration.

## State Governance Direction

The project now uses a current/registry/archive state model:

- `docs/current/**` is the default execution state.
- `docs/registry/**` is the lookup layer.
- Legacy and future archive files are historical sources, not execution queues.

Detailed rules live in `docs/quality/STATE_MANAGEMENT.md`.

Current invariants:

- Story Runner starts from `docs/current/STORY_QUEUE.yaml`.
- Active task scope comes from `docs/current/ACTIVE_TASKS.yaml`.
- `docs/registry/TRACE_INDEX.yaml` stores IDs, paths, and relationships only; it must not store status.
- Archive files are not executable.
- The main Worker is the single writer for `docs/current/**` and `docs/registry/**`.
- `scripts/check-state.sh` validates state consistency and is warning-only during the initial rollout.
- `bash scripts/check.sh` runs `check-state` and its regression tests so state drift is visible in the standard verification path without self-locking ordinary tasks.
- `H024/US065` completed the first real current-queue smoke task: a ready story and matching active task passed strict state checks before execution, then current returned to an empty active queue after completion.
- `H025/US066` added state-check coverage that rejects done history in current story/task files, keeping current limited to ready, in-progress, and blocked work.
- `H026/US067` changed standard verification to strict state checks by default, with explicit `BPO_STATE_CHECK_MODE=repair-scope` and `BPO_STATE_CHECK_MODE=warning` overrides for repair and diagnostics.
- `H027/US068` extended state checks to validate `TRACE_INDEX.yaml` current file paths and reduce duplicate registry path output.
- `H028/US069` fixed the Codex Plan boundary: the Plan panel is only a session projection and must never override Harness current/registry state.
- `F041-F059/Q014` completed a 20-task local frontend parity block across schedule plans, schedule risks, and unavailability tables, then returned current queue and active tasks to empty.
- `F061-F063/Q016` completed a production MVP contract demo slice: local contract client, model test, `/production-mvp` page, sidebar entry, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F064-F066/Q017` completed an anomaly review read-only slice: local anomaly review model, model test, `/anomaly-review` page, sidebar entry, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F067-F075/Q018` completed an import-contract drilldown and data-quality center slice: three production MVP contract drilldown pages, local data-quality model, `/data-quality`, `/data-quality/[issueId]`, sidebar entry, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F076-F084/Q019` completed a personnel timeline, demand forecast contract, and master-data relationship slice: local model tests, `/person-timeline`, `/person-timeline/[employeeId]`, `/production-mvp/demand-forecast`, `/master-data-relations`, sidebar entries, route smoke, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F085-F093/Q020` completed a shift type, import template, and anomaly source slice: local model tests, `/shift-types`, `/import-templates`, `/anomaly-review/sources`, `/anomaly-review/sources/[sourceId]`, sidebar entries, anomaly review source link, route smoke, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F094-F102/Q021` completed an import batch history, field mapping preview, and review status timeline slice: local model tests, `/import-batches`, `/import-batches/[batchId]`, `/field-mapping`, `/anomaly-review/timeline`, sidebar entries, anomaly review timeline link, route smoke, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F216-F220/Q033` completed an import quality traceability slice: import batch details link to related data quality issues, issue details show source template, source field, original value, error code, affected objects, and impact links, and batch details show failure-row business impact summaries. It remained local/frontend only and returned current queue and active tasks to empty.
- `F221-F225/Q034` completed a master-data relationship closure slice: employee bindings show supplier, workplace, project, skills, validity, status, anomaly/data-quality references, and reverse lookup links; shift types show meal/rest windows and counting policy. It remained local/frontend only and returned current queue and active tasks to empty.
- `F226-F228/Q035` completed a supervisor exception handling read-only closure slice: fulfillment calendar exception items show handling suggestions, three-track evidence summaries, and read-only handling records. It remained local/frontend only and returned current queue and active tasks to empty.
- `F229-F231/Q036` completed a supervisor exception handoff read-only closure slice: fulfillment calendar exception items show handling outcome categories, handoff summaries, and data-check readiness hints. It remained local/frontend only and returned current queue and active tasks to empty.
- `F232-F234/Q037` completed a data-quality repair-prep read-only slice: fulfillment calendar exception items show data-owner intervention judgment, repair preparation materials, and data-quality impact scope. It remained local/frontend only and returned current queue and active tasks to empty.
- `F235-F237/Q038` completed a supervisor follow-up summary read-only slice: fulfillment calendar exception items show supervisor follow-up status, follow-up gap lists, and group follow-up rollups. It remained local/frontend only and returned current queue and active tasks to empty.
- `F238-F240/Q039` completed a product semantic cleanup slice: visible product UI no longer exposes local-MVP wording, task IDs, read-only process labels, sidebar priority/new tags, or sample-language labels. It remained local/frontend only and returned current queue and active tasks to empty.
- `F241-F243/Q040` completed a schedule draft personnel-linkage slice: the schedule draft edit page shows personnel-level schedule linkage per 0.5h interval, including summary count, linked people count, difference, status, and linked people. It remained local/frontend only and returned current queue and active tasks to empty.
- `F244-F246/Q041` completed a schedule draft fulfillment-calendar drilldown slice: linked people in the schedule draft edit page route to the matching fulfillment calendar personal daily three-track detail with date, team, and group context preserved. It remained local/frontend only and returned current queue and active tasks to empty.
- `F247-F249/Q042` completed a personal schedule-source drillback slice: the fulfillment calendar personal daily three-track detail shows schedule draft source, plan/draft links, shift window, schedule detail ID, and related 0.5h interval count differences. It remained local/frontend only and returned current queue and active tasks to empty.
- `F250-F252/Q043` completed a supervisor resolution-draft slice: the fulfillment calendar group-day exception panel shows suggested conclusion, required evidence, communication target, owner role, next review point, and open-risk text for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F253-F255/Q044` completed a supervisor closure-checklist slice: the fulfillment calendar group-day exception panel shows a closure checklist with ready and missing material counts, item status, owner role, judgment impact, and current judgment for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F256-F258/Q045` completed a supervisor exception-queue grouping slice: the fulfillment calendar group-day exception panel groups and filters queue items by missing material, supervisor judgment, and data check, with group counts in the queue summary. It remained local/frontend only and returned current queue and active tasks to empty.
- `F259-F261/Q046` completed a personal-detail review-context slice: the fulfillment calendar personal daily three-track detail shows the selected exception review group, current judgment, and closure checklist when opened from the group-day exception queue. It remained local/frontend only and returned current queue and active tasks to empty.
- `F262-F264/Q047` completed a group review-load summary slice: the fulfillment calendar group-day exception panel shows review load, top review group, next priority item, and group-level ready/missing material counts. It remained local/frontend only and returned current queue and active tasks to empty.
- `F265-F267/Q048` completed an exception evidence to data-quality link slice: the fulfillment calendar group-day exception panel shows related data quality issues, matched records, check fields, link reasons, recommendations, and quality detail links for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F268-F270/Q049` completed an exception aging and priority escalation slice: the fulfillment calendar group-day exception panel shows waiting duration, aging level, escalation reason, escalation target, next review window, and group-level aging/escalation counts. It remained local/frontend only and returned current queue and active tasks to empty.
- `F271-F273/Q050` completed a supervisor daily workload summary slice: the fulfillment calendar group-day exception panel shows daily focus item count, high-priority count, aging/escalation pressure, busiest owner role, owner workloads, and next focus item. It remained local/frontend only and returned current queue and active tasks to empty.
- `F274-F276/Q051` completed an exception source consolidation slice: the fulfillment calendar group-day exception panel shows primary exception source, next priority source, source distribution, source impact hours, and source-level high-priority/aging/escalation counts. It remained local/frontend only and returned current queue and active tasks to empty.
- `F277-F279/Q052` completed a supervisor handoff overview slice: the fulfillment calendar group-day exception panel shows handoff item count, open question count, escalation count, top recipient, next handoff item, and recipient-level handoff distribution. It remained local/frontend only and returned current queue and active tasks to empty.
- `F280-F282/Q053` completed a team-day risk digest slice: the fulfillment calendar group-day exception panel shows day risk level, risk score, headline, primary risk, next focus item, and risk signals. It remained local/frontend only and returned current queue and active tasks to empty.
- `F283-F285/Q054` completed a supervisor exception communication context slice: the fulfillment calendar group-day exception panel shows communication audience, purpose, key messages, referenced evidence, open questions, and next conversation point for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F286-F288/Q055` completed a supervisor follow-up timeline slice: the fulfillment calendar group-day exception panel shows detection, completed follow-up, current blocker, and next review nodes for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F289-F291/Q056` completed a team-day risk trend slice: the fulfillment calendar group-day exception panel shows risk direction, highest-risk day, current-day comparison, trend points, and next focus. It remained local/frontend only and returned current queue and active tasks to empty.
- `F292-F294/Q057` completed a supervisor exception comparison slice: the fulfillment calendar group-day exception panel shows selected exception rank, priority reason, compared exception, main difference, and focus order. It remained local/frontend only and returned current queue and active tasks to empty.
- `F295-F297/Q058` completed a team-week risk distribution slice: the fulfillment calendar team-week view shows highest-risk day, weekly risk points, primary reason, recommended drilldown group/date, and team rank. It remained local/frontend only and returned current queue and active tasks to empty.
- `F298-F300/Q059` completed an exception owner load comparison slice: the fulfillment calendar group-day exception panel shows selected exception owner load, busiest owner, compared owner, load difference, and focus order. It remained local/frontend only and returned current queue and active tasks to empty.
- `F301-F303/Q060` completed a next-day watchlist slice: the fulfillment calendar group-day exception panel shows next-day date, headline, ordered watch items, source exceptions, owner roles, and watch reasons. It remained local/frontend only and returned current queue and active tasks to empty.
- `F304-F306/Q061` completed a group-risk cause split slice: the fulfillment calendar group-day exception panel shows group risk cause headline, total impact hours, cause shares, impacted people, representative exceptions, and supervisor focus points. It remained local/frontend only and returned current queue and active tasks to empty.
- `F307-F309/Q062` completed a team-week carryover overview slice: the fulfillment calendar group-day exception panel shows carryover days, later-week gap/anomaly people, review targets, carryover reasons, and view order. It remained local/frontend only and returned current queue and active tasks to empty.
- `F310-F312/Q063` completed an exception closure readiness summary slice: the fulfillment calendar group-day exception panel shows ready/blocked counts, missing material, missing decision, data-check counts, next candidate, and blocker reasons. It remained local/frontend only and returned current queue and active tasks to empty.
- `F313-F315/Q064` completed a weekly supervisor review queue slice: the fulfillment calendar group-week view shows team-level weekly review queue items by group/date, risk priority, gap/anomaly counts, suggested review target, and drilldown link. It remained local/frontend only and returned current queue and active tasks to empty.
- `F316-F318/Q065` completed a closure evidence drill-in slice: the fulfillment calendar group-day exception panel expands closure blockers into evidence items with person, owner role, current status, linked source records, next-view hint, and existing personal three-track drilldown. It remained local/frontend only and returned current queue and active tasks to empty.
- `F319-F321/Q066` completed a weekly supervisor handoff summary slice: the fulfillment calendar group-week view shows weekly handoff item count, open questions, escalation items, top recipient, next touchpoint, and drilldown links. It remained local/frontend only and returned current queue and active tasks to empty.
- `F322-F324/Q067` completed a team-level evidence gap distribution slice: the fulfillment calendar group-week view shows weekly evidence gap type distribution, affected people, owner roles, representative people, and drilldown links. It remained local/frontend only and returned current queue and active tasks to empty.
- `F325-F327/Q068` completed a weekly closure readiness trend slice: the fulfillment calendar group-week view shows daily closure readiness direction, ready/blocked day counts, top blocker, next review day, and drilldown links. It remained local/frontend only and returned current queue and active tasks to empty.
- `F328-F330/Q069` completed a review outcome preview slice: the fulfillment calendar group-day exception panel shows suggested outcome, confidence, evidence summary, source references, readiness, open risk, and next review point. It remained local/frontend only and returned current queue and active tasks to empty.
- `F331-F333/Q070` completed a data quality exception impact slice: the fulfillment calendar group-day exception panel shows which data quality issues affect current exceptions, impacted exception count, people, hours, representative exceptions, and quality detail links. It remained local/frontend only and returned current queue and active tasks to empty.
- `F334-F336/Q071` completed an exception impact priority slice: the fulfillment calendar group-day exception panel shows top exception, impacted objects, impacted comparisons, impact hours, blocker count, priority reason, and ranked items. It remained local/frontend only and returned current queue and active tasks to empty.
- `F337-F339/Q072` completed a supervisor priority summary slice: the fulfillment calendar group-day exception panel shows top supervisor focus, priority reasons, high-priority count, blocked count, escalation count, impact hours, impact scope, and ordered review items. It remained local/frontend only and returned current queue and active tasks to empty.
- `F340-F342/Q073` completed a handling readiness narrative slice: the fulfillment calendar group-day exception panel shows a handling-prep narrative, readiness counts, missing blockers, evidence status, preparation steps, impact scope, and narrative items. It remained local/frontend only and returned current queue and active tasks to empty.
- `F343-F345/Q074` completed a supervisor decision digest slice: the fulfillment calendar group-day exception panel shows suggested decisions, confidence, source references, open risks, next review point, and digest items. It remained local/frontend only and returned current queue and active tasks to empty.
- `F346-F348/Q075` completed a closure risk explanation slice: the fulfillment calendar group-day exception panel shows why selected exceptions cannot close yet, business impact, missing evidence, owner role, next viewing step, and risk items. It remained local/frontend only and returned current queue and active tasks to empty.
- `F349-F350/Q076` completed a weekly decision digest slice: the fulfillment calendar group-week view shows suggested weekly decisions, confidence, evidence summary, open risks, next review point, and source references before the weekly review queue. It remained local/frontend only and returned current queue and active tasks to empty.
- `F351-F352/Q077` completed a supervisor closure review summary slice: the fulfillment calendar group-day exception panel shows ready-to-close count, pending review count, blockers, lead review item, suggested conclusion, evidence summary, risk summary, next action, and source references. It remained local/frontend only and returned current queue and active tasks to empty.
- `US500/F372 -> US502/Q090` completed an import failure reason summary slice: import batch detail pages now group failure rows by field and error code, show top reason, representative row, affected objects, and correction hint before row-level details. It remained local/read-only and returned current queue and active tasks to empty.
- `US503/F373 -> US505/Q091` completed an import failure quality impact rollup slice: import batch detail pages now connect failure reasons to linked data quality issues, show related issue count, covered fields, unmatched reasons, affected objects, top issue, and issue viewing order. It remained local/read-only and returned current queue and active tasks to empty.
- `US506/F374 -> US508/Q092` completed an import correction readiness summary slice: import batch detail pages now combine failure reasons and quality impact into readiness level, primary field, confirmation objects, risk prompt, review order, and deferred-action boundary. It remained local/read-only and returned current queue and active tasks to empty.
- `US509/F375 -> US511/Q093` completed an import correction material preview slice: import batch detail pages now organize correction materials into material status, material summary, field materials, failure-row samples, quality references, conversation points, and deferred-action boundary. It remained local/read-only and returned current queue and active tasks to empty.
- `US512/F376 -> US514/Q094` completed an import review conclusion preview slice: import batch detail pages now turn correction materials into conclusion status, suggested conclusion, confidence, evidence summary, risk summary, next review point, and deferred-action boundary. It remained local/read-only and returned current queue and active tasks to empty.
- `US515/F377 -> US517/Q095` completed a data-quality import-batch impact aggregation slice: data quality detail pages now reverse-link quality issues to related import batches, failed rows, matched fields, affected objects, review hints, and batch detail links. It remained local/read-only and returned current queue and active tasks to empty.
- `US518/F378 -> US520/Q096` completed a weekly closure readiness trend reason breakdown slice: the fulfillment calendar group-week trend now shows daily change reasons, primary blockers, blocker breakdowns, and next viewing hints. It remained local/read-only and returned current queue and active tasks to empty.
- `US521/F379 -> US523/Q097` completed a data-quality impacted-exception top aggregation slice: the data quality overview now ranks quality issues by impacted exceptions, impacted people, blocked rows, severity, and next viewing hints. It remained local/read-only and returned current queue and active tasks to empty.
- `US524/F380 -> US526/Q098` completed a data-quality detail impacted-exception drilldown slice: data quality detail pages now show impacted exceptions, impacted people, primary exception, affected objects, next viewing hints, and deferred actions for a single quality issue. It remained local/read-only and returned current queue and active tasks to empty.
- `US527/F381 -> US529/Q099` completed a data-quality impacted-exception cause summary slice: the data quality overview now groups impacted quality issues by error code, source field, and source, showing impacted exceptions, impacted people, blocked rows, representative issues, next viewing hints, and deferred actions. It remained local/read-only and returned current queue and active tasks to empty.

## Product Direction

Near-term product work should remain inside the no-database local MVP boundary.

`docs/production-mvp-prd.md` records the product definition for the next production MVP shape. It is a planning document only: it does not seed the current queue, does not authorize implementation, and does not override No Database MVP Mode or the stop conditions in `AGENTS.md`.

Recommended order after state governance:

1. Seed the next ready story in current state before execution.
2. Continue frontend/local-contract work only when it avoids database, real integrations, auth, permissions, approval, export, batch, production formulas, settlement rules, and charge factors.
3. Continue table parity only in small display-only slices unless PM confirms a broader component-interaction Gate.

## Frontend Direction

Future frontend work is constrained to a professional shadcn/ui-based B2B SaaS admin console for BPO Workforce Management / BPO 人力计划与履约管理平台.

The frontend baseline is shadcn/ui v4 dashboard examples, dashboard-01 block, New York style, semantic theme tokens, dark/light theme behavior, and the project frontend rules in `docs/quality/FRONTEND_RULES.md`.

This direction is a rule for confirmed frontend tasks; it does not authorize new frontend implementation, dependency installation, package changes, mock data, or business code outside a confirmed Gate.

## Lightweight Harness Direction

The Harness flow is:

```txt
raw requirement -> user story -> current story queue -> active task -> Gate Plan -> branch -> scoped execution -> state check -> final check -> traceability/audit -> local commit -> Done Report -> PM push decision when applicable
```

Key documents:

- `AGENTS.md`
- `docs/quality/STATE_MANAGEMENT.md`
- `docs/quality/GATE_REGISTRY.md`
- `docs/quality/GIT_BRANCH_WORKFLOW.md`
- `docs/harness/lightweight-harness.md`
- `docs/quality/FRONTEND_RULES.md`
- `docs/quality/DONE_REPORT_TEMPLATE.md`

## Runtime Environment

The project uses Node.js 22 for frontend development and delivery verification. `scripts/check.sh` and `npm run dev` use guarded runtime paths to avoid the local Node.js 24 native addon issue previously observed with Next.js/lightningcss on macOS.

The project uses Python 3.12 for backend development and verification. `scripts/verify-backend-runtime.sh` validates the backend interpreter and required modules.

Runtime files:

- `.nvmrc`
- `.node-version`
- `.python-version`
- `docs/dev/setup.md`
- `scripts/verify-frontend-native-runtime.mjs`
- `scripts/verify-backend-runtime.sh`

## Archive Boundary

The previous project workspace is archived outside this clean root:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

That archive is reference material only. Do not import from it, wire it into build/lint/check flows, or copy large modules into active source without a confirmed migration task.
