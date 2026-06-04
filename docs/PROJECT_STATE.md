# Project State

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

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
- A PM-confirmed database Gate with import persistence, master data persistence, personnel schedule persistence, demand forecast persistence, login/status log persistence, comparison result persistence, and review closure record persistence foundation slices.
- A first import-center CSV upload API vertical that parses `text/csv` request bodies, applies field mapping, persists import batches, row results, failed rows, and generated import versions through the existing import persistence foundation.
- A master-data import application slice that reads persisted `master_data` CSV success rows and writes suppliers, workplaces, projects, skills, employees, and bindings into the DB003 master data repositories.
- A personnel-schedule import application slice that reads persisted `personnel_schedule` CSV success rows and writes schedule versions, shift types, schedule details, and 0.5h intervals into the DB004 personnel schedule repositories.
- A demand-forecast import application slice that reads persisted `demand_forecast` CSV success rows and writes forecast versions, 0.5h forecast intervals, and optional change records into the DB005 forecast repositories.
- A login/status-log import application slice that reads persisted `login_log` and `status_log` CSV success rows and writes login/logout events, status dictionary entries, and status intervals into the DB006 actual log repositories.
- A local comparison calculation slice that writes forecast-vs-schedule and schedule-vs-actual results into the DB007 comparison repositories.
- A review closure write API slice that writes review cases, evidence, conclusions, and closure records into the DB008 review repositories.
- A persisted result query API slice that reads DB007 comparison run details and DB008 review case details without adding schema or migration changes.
- A persisted result list query API slice that adds read-only filters over DB007 comparison runs and DB008 review cases without adding schema or migration changes.
- An idempotent rerun protection slice for duplicate comparison calculate and review closure write requests without adding schema or migration changes.
- A master-data import apply idempotency slice for duplicate master_data batch applications without adding schema or migration changes.
- A personnel-schedule import apply idempotency slice for duplicate personnel_schedule batch applications without adding schema or migration changes.
- A demand-forecast import apply idempotency slice for duplicate demand_forecast batch applications without adding schema or migration changes.
- An actual-log import apply idempotency slice for duplicate login_log/status_log batch applications without adding schema or migration changes.
- A read-only import batch application summary API slice that derives batch application state from existing import and domain repositories without schema or migration changes.
- A persisted import field-mapping template slice that allows reusable upload mappings by `template_id`.
- A field-mapping template update/deactivate slice that supports template correction and soft deactivation without schema or migration changes.
- A failed import row correction slice that updates failed rows in place and recalculates import batch row counts without schema or migration changes.
- A read-only import batch list/status query slice that lists upload result counts, version counts, and derived application state without schema or migration changes.
- A read-only import apply-readiness validation slice that blocks apply when failed rows, no success rows, missing versions, already-applied state, or row-level required-field gaps are detected.
- Apply-before-write readiness safety gates for all four import apply routes that return stable not-ready errors while preserving duplicate already-applied idempotency.
- A read-only import-center frontend API wiring slice that adds `/data-quality`, reads local import batch and apply-readiness APIs, and links data/import sidebar entries to the real page.
- A CSV upload form slice on `/data-quality` that reads a local CSV file in a Next server action and calls the existing local `upload-csv` API without adding backend changes or new dependencies.
- A failed-row correction UI slice on `/data-quality` that reads persisted batch detail, shows failed rows, and submits single-row corrections through the existing local row correction API without adding backend changes or new dependencies.
- A field-mapping template selection slice on `/data-quality` that reads existing mapping templates, shows template summaries, and submits `template_id` to the existing `upload-csv` API while keeping manual JSON mapping as fallback.
- A selected-batch detail drilldown slice on `/data-quality` that shows persisted versions, all row results, row status distribution, and standard field previews without adding backend changes or new dependencies.
- A failed-row correction result feedback slice on `/data-quality` that summarizes correction success/failure, remaining failed rows, and next action guidance without adding backend changes or new dependencies.
- A field-mapping template read-only management visibility slice on `/data-quality` that shows template inventory, status, covered file types, and mapping summaries without adding backend changes or new dependencies.
- An upload-before-template fit hint slice on `/data-quality` that shows per-file-type template coverage, recommended-template guidance, and JSON fallback while removing the route loading fallback that hid main content in the in-app browser.
- An apply-before action guidance slice on `/data-quality` that translates readiness, failed rows, row-level blockers, version state, and already-applied state into next-step guidance without adding write actions.
- Local detail drilldowns for scheduling risks and unavailability impact.
- Display-only TanStack Table parity slices across the current schedule-plan, demand-plan, shift-detail, risk, and unavailability views.
- Dashboard anomaly detail table parity, including local TanStack Table sorting, filtering, pagination, column visibility, and page-size controls.
- Dashboard local operational polish for anomaly filters, data sync status table parity, and heatmap deficit summaries.
- A documentation-first Lightweight Harness with current/registry state governance.

The project does not contain:

- Real external API integration.
- Broad production persistence beyond the DB002 import foundation, DB003 master data, DB004 personnel schedule, DB005 demand forecast, DB006 login/status log, DB007 comparison result, DB008 review closure record, IM001 import-center CSV upload slice, IM002-IM005 import application slices, IM006 comparison calculation trigger, IM007 review closure write API, IM008 persisted result query API, IM009 persisted result list query API, IM010 idempotent rerun protection slice, IM011 master-data apply idempotency slice, IM012 personnel-schedule apply idempotency slice, IM013 demand-forecast apply idempotency slice, IM014 actual-log apply idempotency slice, IM015 read-only import application summary slice, IM016 field-mapping template slice, IM017 failed-row correction slice, IM018 read-only import batch list/status query slice, IM019 field-mapping template update/deactivate slice, IM020 read-only import apply-readiness validation slice, IM021 row-level required-field readiness precheck slice, IM022 master_data/demand_forecast apply safety gate slice, and IM023 personnel_schedule/actual-log apply safety gate slice.
- Authentication or production permission boundaries.
- Multipart upload, real Excel import, or real CORN integration.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code finalization, formulas, settlement rules, or charge factors.

## Database Gate Mode

PM originally confirmed on 2026-05-12 that the local MVP should not connect a database before the local feature chain was developed and verified. PM later confirmed on 2026-05-28 that the project may enter a controlled database Gate.

Current allowed database scope:

- Confirmed `database-persistence` tasks only.
- Named entity slices only.
- DB002 import persistence foundation: import batches, row results, failed row details, and import-generated version records.
- DB003 master data persistence foundation: employees, suppliers, workplaces, projects, skills, bindings, effective dates, freeze status, and reference checks.
- DB004 personnel schedule persistence foundation: schedule versions, shift types, personnel schedule details, half-hour intervals, and import/master-data reference checks.
- DB005 demand forecast persistence foundation: forecast versions, forecast interval rows, skill/level demand alignment, import source references, and version change tracking.
- DB006 login/status log persistence foundation: login/logout events, status dictionary, status intervals, business-day splitting, timezone checks, and import/master-data reference checks.
- DB007 comparison result persistence foundation: comparison runs, forecast-vs-schedule results, schedule-vs-actual results, source version/record reference checks, and result dimension checks.
- DB008 review closure record persistence foundation: review cases, evidence records, conclusions, closure records, source comparison result references, and business-date checks.
- IM001 import-center CSV upload vertical: `text/csv` upload API, field mapping, row-level success/failure results, and import version generation using existing import persistence.
- IM002 master-data import application vertical: persisted `master_data` success rows are applied to DB003 master data repositories, including binding reference/freeze validation.
- IM003 personnel-schedule import application vertical: persisted `personnel_schedule` success rows are applied to DB004 personnel schedule repositories, including 0.5h expansion and master-data binding validation.
- IM004 demand-forecast import application vertical: persisted `demand_forecast` success rows are applied to DB005 forecast repositories, including 30-minute interval validation, master-data reference validation, and optional change records.
- IM005 login/status-log import application vertical: persisted `login_log` and `status_log` success rows are applied to DB006 actual log repositories.
- IM006 local comparison calculation trigger: forecast-vs-schedule and schedule-vs-actual comparison runs are calculated and written to DB007 repositories.
- IM007 review closure write API: review cases, evidence, conclusions, and closures are written to DB008 repositories.
- IM008 persisted result query API: DB007 comparison runs and DB008 review cases may be read through local FastAPI routes.
- IM009 persisted result list query API: DB007 comparison runs and DB008 review cases may be listed with basic read-only filters.
- IM010 idempotent rerun protection: duplicate comparison calculate and review closure write requests return existing persisted results by natural business key.
- IM011 master-data apply idempotency: duplicate master_data batch applications return an already-applied summary instead of running snapshot writes again.
- IM012 personnel-schedule apply idempotency: duplicate personnel_schedule batch applications return an already-applied summary without repeating schedule repository writes.
- IM013 demand-forecast apply idempotency: duplicate demand_forecast batch applications return an already-applied summary without repeating forecast repository writes.
- IM014 actual-log apply idempotency: duplicate login_log/status_log batch applications return an already-applied summary without repeating actual log repository writes.
- IM015 import application summary: read-only batch application state is derived from existing import and domain repositories.
- IM016 import field-mapping templates: reusable upload field mappings may be persisted and reused by `upload-csv`.
- IM019 import field-mapping template maintenance: templates may be updated or softly deactivated without adding schema or migration changes.
- IM017 import failed-row correction: failed rows may be corrected in place and import batch row counts recalculated without adding schema or migration changes.
- IM018 import batch list/status query: import batches may be listed with upload result counts, version counts, and derived application state without adding schema or migration changes.
- IM020 import apply-readiness validation: batches may be checked before apply for failed rows, missing success rows, missing versions, and already-applied state without adding schema or migration changes.
- IM021 import row-level readiness precheck: apply-readiness may return row-level required-field blockers for success rows before apply without adding schema or migration changes.
- IM022 import apply safety gate: master_data and demand_forecast apply routes reject not-ready batches before writing while preserving already_applied idempotency without adding schema or migration changes.
- IM023 import apply safety gate completion: personnel_schedule and login/status-log apply routes now reject not-ready batches before writing while preserving already_applied idempotency without adding schema or migration changes.
- IM024 import-center frontend API wiring: `/data-quality` reads local import batch and apply-readiness APIs without adding write actions, dependencies, backend changes, or schema/migration changes.
- IM025 import-center CSV upload form: `/data-quality` can submit local CSV files through a Next server action to the existing `upload-csv` API without adding Excel/multipart, apply write actions, backend changes, dependencies, or schema/migration changes.
- IM026 import-center failed-row correction UI: `/data-quality` can read persisted batch detail, show failed rows, and submit single-row corrections through the existing row correction API without adding backend changes, dependencies, or schema/migration changes.
- IM027 import-center field-mapping template selection: `/data-quality` can read existing field-mapping templates and submit selected `template_id` to the existing `upload-csv` API while preserving manual JSON mapping fallback.
- IM028 import-center selected-batch detail drilldown: `/data-quality` can display persisted versions, all row results, row status distribution, and field previews for the selected import batch without adding backend changes, dependencies, or schema/migration changes.
- IM029 import-center failed-row correction result feedback: `/data-quality` can display correction success/failure summaries, remaining failed-row counts, and next-action guidance without adding backend changes, dependencies, or schema/migration changes.
- IM030 import-center field-mapping template read-only visibility: `/data-quality` can display template inventory, active/inactive counts, covered file types, mapped-field counts, and template summaries without adding backend changes, dependencies, or schema/migration changes.
- IM031 import-center upload template fit hints: `/data-quality` can display upload-before template fit guidance and avoid the route-level loading fallback that kept the page on skeleton content in the in-app browser, without adding backend changes, dependencies, or schema/migration changes.
- IM032 import-center apply-before action guidance: `/data-quality` can display next-step guidance from readiness, failed rows, row-level blockers, version state, and already-applied state without adding backend changes, dependencies, write buttons, or schema/migration changes.
- IM033 import-center exception-state guidance: `/data-quality` can consolidate batch API, readiness API, template API, empty-batch, and empty-template states into one read-only action panel without adding backend changes, dependencies, write buttons, or schema/migration changes.
- IM034 import-center upload result batch entry: `/data-quality` can display upload success/failure guidance with a batch link and next-step review path without adding backend changes, dependencies, write buttons, or schema/migration changes.
- IM035 import-center access-batch filtering: `/data-quality` can filter access batches by keyword, file type, processing status, and application status while keeping rows clickable and showing no-match empty state without backend changes, dependencies, write buttons, or schema/migration changes.
- IM036 import-center selected-batch review navigation: `/data-quality` can show a read-only batch review guide and anchor links to batch detail, failed-row correction, and apply-readiness areas without backend changes, dependencies, write buttons, or schema/migration changes.
- IM037 import-center application status visibility: `/data-quality` can show a read-only selected-batch application status overview with target, version, applied count, and next-step wording without backend changes, dependencies, write buttons, or schema/migration changes.
- IM038 import-center batch-detail readability: `/data-quality` can show a read-only batch detail processing summary, next-step guidance, and row-level error-field visibility without backend changes, dependencies, write buttons, or schema/migration changes.
- IM039 import-center data-quality-to-exception trace visibility: `/data-quality` can show read-only downstream exception impact scope, quality evidence, and next-step guidance from selected batch detail without backend changes, dependencies, write buttons, or schema/migration changes.
- IM040 import-center downstream result navigation: `/data-quality` can show read-only downstream comparison/review navigation from selected batch application status without backend changes, dependencies, write buttons, or schema/migration changes.
- SQLAlchemy, Alembic, and an isolated local test database for verification.

Hard stop until separate PM confirmation:

- Broad schema implementation outside the active entity slice.
- Real external data-source integration.
- Authentication, permission boundaries, supplier isolation, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors.
- Additional persistence, production deployment, or integration unless a matching task is active.

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
- `DB001/US612` defined the database Gate and persistence order.
- `DB002/US613` added the first database slice for import batches, row results, failed rows, and import-generated version records, then returned current queue and active tasks to empty.
- `DB003/US614` added the master data slice for employees, suppliers, workplaces, projects, skills, bindings, effective dates, freeze status, and reference checks, then returned current queue and active tasks to empty.
- `DB004/US615` added the personnel schedule slice for schedule versions, shift types, personnel schedule details, half-hour intervals, and import/master-data reference checks, then returned current queue and active tasks to empty.
- `DB005/US616` added the demand forecast slice for forecast versions, interval rows, skill/level demand alignment, import source references, and version change tracking, then returned current queue and active tasks to empty.
- `DB006/US617` added the login/status log slice for login/logout events, status dictionary, status intervals, business-day splitting, timezone checks, and import/master-data reference checks, then returned current queue and active tasks to empty.
- `DB007/US618` added the comparison result slice for comparison runs, forecast-vs-schedule results, schedule-vs-actual results, source version/record reference checks, and result dimension checks, then returned current queue and active tasks to empty.
- `DB008/US619` added the review closure record slice for review cases, evidence records, conclusions, closure records, source comparison result references, and business-date checks, then returned current queue and active tasks to empty.
- `Q127/US620` verified the DB002-DB008 foundation with Alembic head table coverage and a minimum end-to-end persistence chain from import/version records to review closure records, then returned current queue and active tasks to empty.
- `IM001/US621` added the first import-center CSV upload API vertical without new dependencies, multipart/Excel, external integrations, auth/permissions, approval, export, batch operations, schema/migration changes, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM002/US622` added master-data import application from persisted CSV success rows into DB003 repositories without new dependencies, schema/migration changes, CRUD UI, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM003/US623` added personnel-schedule import application from persisted CSV success rows into DB004 repositories without new dependencies, schema/migration changes, schedule-maintenance UI, publish/freeze workflows, external integrations, auth/permissions, approval, export, batch rescheduling, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM004/US624` added demand-forecast import application from persisted CSV success rows into DB005 repositories without new dependencies, schema/migration changes, forecast algorithms, forecast UI, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM005/US625` added login/status log import application from persisted CSV success rows into DB006 repositories without new dependencies, schema/migration changes, real CORN/HR/WFM integrations, status-code production rules, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM006/US626` added a local comparison calculation trigger into DB007 without new dependencies, schema/migration changes, real CORN/HR/WFM integrations, production status-code/formula finalization, auth/permissions, approval, export, batch operations, automatic scheduling, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM007/US627` added a local review closure write API into DB008 without new dependencies, schema/migration changes, real external evidence services, auth/permissions, approval workflow, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM008/US628` added persisted result query APIs over existing DB007/DB008 repositories without new dependencies, schema/migration changes, template persistence, frontend, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM009/US629` added persisted result list query APIs over existing DB007/DB008 repositories without new dependencies, schema/migration changes, pagination, frontend, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM010/US630` added existing-result return behavior for duplicate comparison calculate and review closure write requests without new dependencies, schema/migration changes, idempotency tables, task queues, frontend, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM011/US631` added already-applied return behavior for duplicate master_data batch applications without new dependencies, schema/migration changes, idempotency tables, task queues, other import apply types, frontend, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM012/US632` added already-applied return behavior for duplicate personnel_schedule batch applications without new dependencies, schema/migration changes, idempotency tables, task queues, other import apply types, frontend, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM013/US633` added already-applied return behavior for duplicate demand_forecast batch applications without new dependencies, schema/migration changes, idempotency tables, task queues, other import apply types, frontend, external integrations, auth/permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM014/US634` added already-applied return behavior for duplicate login_log/status_log batch applications without new dependencies, schema/migration changes, idempotency tables, task queues, other import apply types, frontend, external integrations, auth/permissions, approval, export, batch operations, production status-code rules, formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM033/US653` added exception-state guidance across batch API, readiness API, template API, empty batch, and empty template states, then returned current queue and active tasks to empty.
- `IM034/US654` added upload result guidance with success/failure summaries, batch links, and next-step review paths, then returned current queue and active tasks to empty.
- `IM035/US655` added access-batch filtering by keyword, file type, processing status, and application status, then returned current queue and active tasks to empty.
- `IM036/US656` added selected-batch review guidance and anchor navigation across batch detail, failed-row correction, and apply-readiness regions, then returned current queue and active tasks to empty.
- `IM037/US657` added selected-batch read-only application status visibility for target, import version, applied record count, and next-step status wording, then returned current queue and active tasks to empty.
- `IM038/US658` added batch detail readability with processing summary, next-step guidance, error-field summary, and row-level error-field visibility, then returned current queue and active tasks to empty.
- `IM039/US659` added read-only data-quality-to-exception trace visibility for downstream exception impact scope, quality evidence, and next-step guidance, then returned current queue and active tasks to empty.
- `IM040/US660` added read-only downstream result navigation from selected-batch application status to comparison and review result paths, then returned current queue and active tasks to empty.
- `IM041A/US661` restructured `/data-quality` into overview, access-batch workbench, selected-batch status inspector, and layered detail tabs for batch detail, failed-row correction, and import/template tools, then returned current queue and active tasks to empty.
- `IM042/US662` added a read-only result trace tab on `/data-quality` that lists selected-batch business-date comparison runs and review cases from existing APIs, then returned current queue and active tasks to empty.
- `IM043/US663` split concrete batch viewing and handling into `/data-quality/import-batches/[batchId]`, leaving `/data-quality` as the batch workbench, then returned current queue and active tasks to empty.
- `IM044/US664` moved concrete batch processing to true second-level `/data-quality/[batchId]`, removed the status checker from the list page, kept old detail URLs as redirects, and returned current queue and active tasks to empty.
- `IM045/US665` redesigned `/data-quality/[batchId]` into a single-column processing flow with overview cards, full-width processing tabs, and status check as the default tab, then returned current queue and active tasks to empty.
- `IM046/US666` added read-only field-mapping template fit detail in `/data-quality/[batchId]`, including recommended template, field coverage, suggested field gaps, and source-to-standard mapping rows, then returned current queue and active tasks to empty.
- `IM047/US667` added read-only apply-readiness issue grouping in `/data-quality/[batchId]`, covering failed rows, row-level required fields, version gaps, application state, and batch-level blockers, then returned current queue and active tasks to empty.
- `IM048/US668` added read-only downstream result drilldown in `/data-quality/[batchId]`, showing whether the selected batch is blocked, waiting for downstream results, or already has actionable comparison/review records, then returned current queue and active tasks to empty.
- `IM049/US669` added read-only quality-to-exception reverse aggregation in `/data-quality/[batchId]`, grouping failed/warning import rows by error field and reason and relating them to same-business-date comparison/review candidates, then returned current queue and active tasks to empty.
- `IM050/US670` added a local shadcn/ui convention gate into `bash scripts/check.sh`, covering project shadcn config, `space-x/space-y`, hardcoded Tailwind color scales, arbitrary radius utilities, and documented baseline debt without adding dependencies or changing product UI.
- `IM051/US671` added read-only review conclusion preview in `/data-quality/[batchId]`, summarizing suggested conclusion, evidence, residual risk, and next action from existing comparison/review/quality context, then returned current queue and active tasks to empty.
- `IM052/US672` added read-only review evidence gap drilldown in `/data-quality/[batchId]`, ranking open review cases by risk and showing owner, evidence needs, quality issue context, comparison context, and next action, then returned current queue and active tasks to empty.
- `IM053/US673` split review-case viewing into `/data-quality/review-cases`, with read-only filters, summary cards, grouping, case table, and detail-page links into the second-level workspace, then returned current queue and active tasks to empty.
- `IM054/US674` linked quality-impact issue groups to `/data-quality/review-cases` with business date, open status, source type, and quality-focus keyword context, while keeping review handling read-only and returning current queue and active tasks to empty.
- `IM055/US675` added `/data-quality/review-cases/[caseId]` as a read-only second-level review-case detail page, with list-to-detail navigation, case summary, source line, quality focus, evidence gap, evidence/conclusion records, and processing-boundary guidance, then returned current queue and active tasks to empty.
- `IM056/US676` added local review-case smoke data preparation for `CASE-QUERY-001`, reusing existing DB007/DB008 repositories and schema so the review-case detail page can show a persisted normal state, then returned current queue and active tasks to empty.
- `IM057/US677` added read-only review-case source result context to `/api/v1/review-cases/{case_id}` and `/data-quality/review-cases/[caseId]`, showing business date, interval, dimensions, and key difference metrics from existing DB007/DB008 results, then returned current queue and active tasks to empty.
- `IM058/US678` added read-only review-case source trace context to `/api/v1/review-cases/{case_id}` and `/data-quality/review-cases/[caseId]`, showing the comparison run, business versions, import versions, and related import batch, then returned current queue and active tasks to empty.
- `IM059/US679` added `/data-quality/comparison-runs/[runId]` as a read-only second-level comparison-run detail page, linked review-case source trace and batch result trace actions to the frontend route instead of raw API JSON, then returned current queue and active tasks to empty.
- `IM060/US680` added read-only linked review-case positioning on `/data-quality/comparison-runs/[runId]`, matching current run results to review cases and linking to review-case detail pages, then returned current queue and active tasks to empty.
- `IM061/US681` added a read-only evidence/conclusion chain on `/data-quality/review-cases/[caseId]`, showing evidence, conclusions, optional closure, status, and next action in a single-column detail flow, then returned current queue and active tasks to empty.
- `IM062/US682` added controlled review-case closure write for existing open cases and a detail-page close entry that disappears after closure, then returned current queue and active tasks to empty.
- `IM063/US683` added controlled review-case evidence supplement write for existing open cases and a detail-page evidence entry that is blocked after closure, then returned current queue and active tasks to empty.
- `IM064/US684` added controlled review-case conclusion supplement write for existing open cases and a detail-page conclusion entry that is blocked after closure, then returned current queue and active tasks to empty.
- `IM065/US685` added a read-only review-case processing timeline on the second-level detail page, aggregating evidence, conclusions, and closure records by processing order without adding backend routes, schema/migration changes, dependencies, write actions, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM066/US686` added read-only processing-stage filters on the review-case workspace for missing evidence, missing conclusion, ready to close, closed, and unknown stages, deriving stage from existing detail API records without adding backend routes, schema/migration changes, dependencies, write actions, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM067/US687` added a read-only owner × processing-stage workload matrix on the review-case workspace, deriving counts from existing review-case list data and detail stage snapshots and linking nonzero cells into owner/stage filtered lists without adding backend routes, schema/migration changes, dependencies, write actions, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM068/US688` added a read-only same-owner processing context on the review-case detail page, deriving related cases from existing review-case list data and detail stage snapshots and linking to same-owner list and priority stage filters without adding backend routes, schema/migration changes, dependencies, write actions, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM069/US689` added read-only same-owner pending navigation inside the review-case detail owner context, deriving a same-owner same-business-date pending sequence from existing list data and detail stage snapshots, showing position plus previous/next links, and guiding closed cases to the first pending case without adding backend routes, schema/migration changes, dependencies, write actions, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM070/US690` added a read-only same-owner first pending entry on the review-case workspace, deriving owner-level first pending cases from the current filtered list and detail stage snapshots, and linking directly into the review-case detail continuation flow without adding backend routes, schema/migration changes, dependencies, write actions, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM071/US691` added a review-case detail processing action deck, consolidating existing evidence, conclusion, and closure entries into one shadcn-composed tabbed action region without adding backend routes, schema/migration changes, dependencies, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM072/US692` added review-case action submit feedback inside the processing action deck, parsing existing evidence/conclusion/closure URL result parameters and showing action name, result status, and next guidance without adding backend routes, schema/migration changes, dependencies, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM073/US693` added review-case submit continuation navigation inside the processing action deck, reusing the existing same-owner pending sequence to show the next pending case and same-owner list return link without adding backend routes, schema/migration changes, dependencies, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM074/US694` added failed-submit retry targeting inside the review-case processing action deck, automatically opening the failed action tab and showing retry guidance when evidence/conclusion/closure writes return failed URL parameters without adding backend routes, schema/migration changes, dependencies, approval, export, batch operations, permissions, external integrations, production formulas, settlement rules, or charge factors; it then returned current queue and active tasks to empty.
- `IM075/US695` corrected successful-submit continuation priority inside the review-case processing action deck, keeping the primary continuation on the current case when it still needs the next processing action and falling back to same-owner next pending only after the current case leaves the actionable sequence; it then returned current queue and active tasks to empty.
- `IM076/US696` added closure-success queue handoff wording inside the review-case processing action deck, making closed-case handoff explicit and labeling the primary continuation as closing-then-next when another same-owner pending case exists; it then returned current queue and active tasks to empty.
- `IM077/US697` kept review continuation return-list links focused on open cases by adding `status=open` to same-owner list links in the detail and action continuation flows; it then returned current queue and active tasks to empty.
- `IM078/US698` added a second-level field-mapping template maintenance page with detail, update, and deactivate actions over existing template APIs, then returned current queue and active tasks to empty.
- `IM079/US699` added a second-level field-mapping template creation page over the existing create template API, then returned current queue and active tasks to empty.
- `IM080/US700` added a field-mapping template upload prefill chain from batch template maintenance to template detail and back into the batch upload tools with the selected template prefilled; it then returned current queue and active tasks to empty.
- `IM081/US701` added an independent `/data-quality/uploads/new` CSV upload workspace with list-page entry, template-detail prefill entry, and tabbed upload/template hierarchy over existing upload and template APIs; it then returned current queue and active tasks to empty.
- `IM082/US702` added independent upload result return guidance so standalone uploads return to `/data-quality/uploads/new` with success/failure feedback and direct batch processing links while batch-detail uploads keep their original redirect behavior; it then returned current queue and active tasks to empty.

## Product Direction

Near-term product work should stay inside either confirmed local MVP frontend/backend slices or confirmed database-persistence slices.

Recommended order after state governance:

1. Plan the next slice explicitly: import template/mapping management depth or clearer apply-readiness issue grouping.
2. If continuing product work, keep each slice small and verified before adding external integrations or production workflow capabilities.
3. Do not mix auth, permissions, approval, export, batch, production formulas, settlement rules, or charge factors into the foundation without a separate task.

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

## 2026-06-03 IM083 Single-Batch Apply Entry

`US703/IM083` completed a controlled single-batch apply entry on the second-level import batch detail page. The page now shows an apply panel for readiness-ready, not-applied batches and routes the submit through existing apply APIs by file type. Blocked, already-applied, or readiness-unknown states remain read-only. No backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, production formula, settlement rule, or charge factor was added.

## 2026-06-03 IM084-IM086 Downstream Result Chain Planning

After `US703/IM083`, PM confirmed that the next import-center chain should start from "application success to downstream result trace" rather than expanding into permissions, approval, export, batch operations, automatic scheduling, or settlement rules.

The approved sequence is:

1. `US704/IM084`: show the generated business-version result card and next-step entry after a successful batch apply.
2. `US705/IM085`: let an applied batch enter the corresponding version/result context directly.
3. `US706/IM086`: add a controlled local comparison-calculate entry inside that version-result context.

To keep Story Runner state narrow, only `US704/IM084` was moved into `docs/current/**` as `ready`. `US705/IM085` and `US706/IM086` were added to the legacy planning layer and registry only, and must not enter current state until the prior slice is green.

## 2026-06-03 IM084 Applied Result Card And Next-Step Entry

`US704/IM084` completed the application-success result visibility slice on the second-level import batch detail page. After a batch apply succeeds, `/data-quality/[batchId]` now shows a dedicated applied-result card instead of relying only on generic success feedback. The card summarizes the apply target, generated-version state, and current visible write state, then exposes the next-step links for version records and downstream result trace based on the current batch context.

The implementation stayed inside the existing frontend/detail-page model layer. It reused current batch detail data, apply feedback, readiness state, and existing navigation helpers. No backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, production formula, settlement rule, or charge factor was added.

After `IM084` went green, current state advanced to `US705/IM085` as the only ready slice. `US706/IM086` remains outside `docs/current/**` until `IM085` completes.

## 2026-06-03 IM085 Applied Version Result Positioning

`US705/IM085` completed the next step after apply-result visibility. The second-level batch detail page now resolves a version-result context from an already applied batch: supported schedule, forecast, and status-log versions can match existing comparison runs and surface direct run-detail entry links, while the result-trace area now includes a dedicated version-positioning section that shows source batch, current version, apply target, and downstream status. Master-data or version-incomplete cases stay explicit as empty/blocked positioning states instead of pretending a direct result page exists.

The implementation remained frontend-only. It reused current batch detail data, persisted comparison-run lists, review-case lists, and existing workspace routes. No backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, production formula, settlement rule, or charge factor was added.

After `IM085` went green, current state advanced to `US706/IM086` as the only ready slice.

## 2026-06-03 IM086 Controlled Local Comparison Trigger

`US706/IM086` completed the third slice of the downstream-result chain. The second-level batch detail page now adds a controlled local comparison-calculate entry inside the positioned version-result context: when an applied version can clearly reuse a comparison type and its paired source versions from the existing positioned run context, the result-trace section shows `发起一次本地比对`; when the file type is unsupported, the import version is missing, or the paired versions are incomplete, the page stays blocked and does not render a write button. After submit, the page returns success or failure feedback into the same version-result context and links either to the newly created comparison-run detail or back to the current result list.

The implementation stayed frontend-only. It reused the existing comparison calculate API, result-trace positioning helpers, and batch-detail query context without adding backend routes, schema/migration changes, dependencies, approval, export, batch operation, permission, real external integration, production formula, settlement rule, or charge factor changes.

After `IM086` went green, current queue returned to empty. Any subsequent batch/version workspace slice must be reseeded explicitly before implementation.

## 2026-06-03 IM087-IM089 Version Workbench Planning

After `US706/IM086`, PM confirmed that the next slice should stay inside the existing `data-quality` product path and must not invent a new homepage. The approved route is `/data-quality/versions`, positioned as a read-only business-version ledger under the import-center chain.

The approved sequence is:

1. `US707/IM087`: add the read-only version ledger page and base navigation entry.
2. `US708/IM088`: add stable jumps from version rows into batch detail, result trace, or matched comparison run.
3. `US709/IM089`: add downstream impact summaries for comparison runs and review cases.

To keep Story Runner state narrow, only `US707/IM087` entered `docs/current/**` first. `US708/IM088` and `US709/IM089` stayed outside current state until `IM087` was green.

## 2026-06-03 IM087 Version Workbench Ledger

`US707/IM087` completed the first version-workbench slice. `/data-quality/versions` now provides a read-only business-version ledger page that groups the current context into four business domains: master data, personnel schedule, demand forecast, and login/status logs. Each row shows the current version label, source batch, business date, current visible time, state, blocker summary, and a base next-step entry.

The implementation remained frontend-only. It reused the existing import-batch list API, current import-center model helpers, and the data-quality navigation shell. The page explicitly keeps current visible time scoped to the uploaded batch record for now and does not claim publish/freeze/approval semantics. No backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor was added.

After `IM087` went green, current state advanced to `US708/IM088` as the only ready slice. `US709/IM089` remains outside `docs/current/**` until `IM088` completes.

## 2026-06-03 IM088 Version Workbench Stable Jumps

`US708/IM088` completed the second version-workbench slice on `/data-quality/versions`. The ledger now keeps batch detail as the stable primary action for every current-version row, then adds a second-step jump only when the applied-version context is defensible from existing frontend data.

For supported applied rows, the page now resolves the matched comparison run and deep-links directly into that run detail. For other applied rows without a matched run but with known import context, the page falls back to the existing batch result-trace route. Rows that are still blocked or have no applied version no longer expose a misleading deep link and instead remain in explicit blocked/empty state. The implementation stayed frontend-only, reused current import-batch and comparison-run query helpers, and introduced no backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor.

After `IM088` went green, current state advanced to `US709/IM089` as the only ready slice for downstream impact summaries.

## 2026-06-03 IM089 Version Workbench Downstream Impact Summary

`US709/IM089` completed the third version-workbench slice on `/data-quality/versions`. The ledger now exposes a dedicated downstream-impact column so operators can see, per current version row, whether the version already maps to comparison runs and how many review cases are attributable through the currently matched result type.

The implementation stayed frontend-only. It reused the existing import-batch list, comparison-run list, and review-case list queries, then applied conservative frontend attribution rules: matched versions show comparison-run counts and same-business-date review-case counts only when the current version already maps to concrete comparison runs; missing versions, unapplied batches, unsupported direct chains, and blank domains stay in explicit blocked or empty state instead of showing misleading counts.

After `IM089` went green, current queue returned to empty. The next phase must be reseeded into `docs/current/**` before more product development starts.

## 2026-06-03 IM090-IM092 Comparison Result Callback Planning

After the version-workbench chain completed, PM confirmed that the next slice should not invent a new page and should keep the main callback entry inside the existing batch `结果追踪` context. The approved structure is:

1. `US710/IM090`: show a latest-run callback card inside batch result trace immediately after local comparison success.
2. `US711/IM091`: reinforce `comparison run detail` as the full result-review page for the current version context.
3. `US712/IM092`: add stable return links from `comparison run detail` back to source batch result trace and version workbench.

To keep Story Runner state narrow, only `US710/IM090` entered `docs/current/**` first. `US711/IM091` and `US712/IM092` remain outside current state until `IM090` is green.

## 2026-06-03 IM090 Latest Comparison Run Callback Card

`US710/IM090` completed the first slice of the comparison-result callback chain inside the existing batch result-trace context. After local comparison success redirects back to `/data-quality/[batchId]?tab=result-trace`, the page now keeps the existing success notice and adds a dedicated latest-run callback card under the same version-result context.

When the new run already appears in the current comparison-run list, the card surfaces the run ID, comparison type, result count, key metric, and direct entries to the new run detail or current result list. When the success redirect arrives before the current page can see that run in the list, the card stays explicit about that lag and exposes a blocked-but-actionable fallback instead of pretending the result is already present. The implementation stayed frontend-only, reused existing search params and comparison-run list data, and introduced no backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor.

After `IM090` went green, current state advanced to `US711/IM091` as the only ready slice.

## 2026-06-03 IM091 Comparison Run Full Result Review Page

`US711/IM091` completed the second slice of the comparison-result callback chain on the existing `comparison run detail` route. The detail page now identifies itself as the `完整结果回看主页` for the current version context, with a read-only context card showing source versions, business date range, result-review scope, and the next step for checking detailed rows.

The implementation stayed frontend-only. It reused the existing comparison-run detail API contract, model summary, metric cards, run source section, result rows, and related review-case section. No backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor was added.

After `IM091` went green, current state advanced to `US712/IM092` as the only ready slice for stable return links from `comparison run detail` back to source batch result trace and the version workbench.

## 2026-06-03 IM092 Comparison Run Return Loop

`US712/IM092` completed the third slice of the comparison-result callback chain on the existing `comparison run detail` route. The page now reads the existing import-batch list and conservatively matches source batches by applied `import_version_id`, file type, and business-date overlap. When a match is defensible, the page shows a stable return entry back to the source batch `结果追踪` plus a filtered version-workbench entry; when no source batch is matched, it shows `来源批次未定位` and does not fabricate a batch link.

The implementation stayed frontend-only and reused existing import batch list, version workbench, and comparison-run detail contracts. No backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor was added.

After `IM092` went green, the `US710-US712 / IM090-IM092` callback chain returned current queue to empty. Any next product-development slice must be reseeded before implementation.

## 2026-06-03 IM093-IM095 Version Workbench Calculation Trigger Planning

After the comparison-result callback chain completed, the next calculation-trigger chain was split to stay inside existing `/data-quality/versions`, batch result-trace, and comparison-run detail routes:

1. `US713/IM093`: show local-comparison candidate entries on the business version workbench.
2. `US714/IM094`: add a controlled single-version local comparison submit entry on the version workbench.
3. `US715/IM095`: show result-review feedback after a version-workbench comparison submit.

To keep Story Runner state narrow, only `US713/IM093` entered `docs/current/**` as ready. `US714/IM094` and `US715/IM095` stay outside current state until the prior slice is green. This chain stays frontend-only and must not add backend routes, schema/migration changes, dependencies, approval, export, batch operations, permission, real external integrations, automatic scheduling, production formulas, settlement rules, or charge factors.

## 2026-06-03 IM093 Version Workbench Local Comparison Candidates

`US713/IM093` completed the first slice of the version-workbench calculation-trigger chain. `/data-quality/versions` now exposes a read-only `本地比对` column for each business-domain row. Applied versions with a defensible same-business-date source pair can point back into the existing batch `结果追踪` trigger context, while unsupported domains, unapplied rows, missing import-version IDs, and incomplete source-version combinations show an explicit blocked state with no submit button.

The model layer now summarizes comparison candidate tone, comparison type, source version pair, business date range, action label, and target href. The page renders that summary without introducing a new backend API, route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor.

After `IM093` completion, current state advanced to `US714/IM094` for the controlled single-version local comparison submit entry. `US715/IM095` remains outside current state until `IM094` is green.

## 2026-06-03 IM094 Version Workbench Single Comparison Submit

`US714/IM094` completed the controlled single-version local comparison submit slice on `/data-quality/versions`. The workbench now upgrades complete local-comparison candidates from read-only entries into a server-action form that submits one local comparison run through the existing `comparison-runs/calculate` API. The candidate model carries the comparison type, source version pair, business date range, source batch, and request payload so unsupported domains, unapplied rows, missing import versions, or incomplete source-version combinations still show blocked state without a submit button.

The submit action returns to the same version workbench with success or failure feedback, preserves active filters, and describes duplicate/existing-run behavior as `generated or reused` instead of implying multiple new runs. The implementation stayed frontend-only and introduced no backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor.

After `IM094` completion, current state advanced to `US715/IM095` for richer result-review feedback after a version-workbench comparison submit.

## 2026-06-03 IM095 Version Workbench Result Review Feedback

`US715/IM095` completed the result-review feedback slice on `/data-quality/versions`. After a version-workbench local comparison submit succeeds or reuses an existing run, the workbench now looks for the returned run in the current comparison-run list. When the run is visible, the feedback card shows the run ID, comparison type, status, result count, key metric, business date, and a direct entry to the comparison-run detail page. When the run is not yet visible, the card stays in an explicit blocked state with `待回显` metrics and keeps the detail entry without fabricating result size or key difference.

The implementation stayed frontend-only and reused existing comparison-run list data and comparison-run detail routes. No backend route, schema/migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement rule, or charge factor was added.

After `IM095` completion, the `US713-US715 / IM093-IM095` calculation-trigger chain returned current queue to empty. Any next product-development slice must be reseeded before implementation.

## 2026-06-03 IM096-IM098 Master Data Maintenance Planning

After the import-center apply, version-trace, and local-comparison trigger chains completed, the next product area was split into a master-data maintenance chain:

1. `US716/IM096`: add a read-only master-data maintenance workbench entry.
2. `US717/IM097`: add master-data entity detail and reference-impact visibility.
3. `US718/IM098`: plan controlled maintenance actions only after the read-only surface and reference context are clear.

To keep Story Runner state narrow, only `US716/IM096` entered `docs/current/**` as ready. `US717/IM097` and `US718/IM098` stay outside current state until the prior slice is green. This chain must not add backend routes, schema/migration changes, dependencies, approval, export, batch operations, permission, real external integrations, automatic scheduling, production formulas, settlement rules, or charge factors without a separate confirmed task.

## 2026-06-03 IM096 Master Data Maintenance Workbench

`IM096/US716` added `/master-data` as a read-only master-data maintenance workbench under the existing System Management navigation. The page reuses the existing import-batch list contract to show master-data source batch/version context and groups the maintenance surface by agents, sites, vendors, projects, skills, and bindings.

The workbench explicitly keeps write actions closed: no create/edit/freeze/effective-date update, approval, export, batch operation, permission boundary, backend route, schema/migration, dependency, real external integration, automatic scheduling, production formula, settlement rule, or charge-factor change was added. Current state advanced to `US717/IM097` for entity detail and reference-impact visibility.

## 2026-06-03 IM097 Master Data Entity Detail And Reference Impact

`IM097/US717` added `/master-data/[entityKey]` detail pages for agents, sites, vendors, projects, skills, and bindings. The workbench now links each row into its detail view; unknown entity keys return 404.

The detail view stays read-only: it shows source batch/version context, entity-level effective-period and freeze-status empty states, and reference-impact summaries for schedule, forecast, login/status logs, and comparison/review chains. Missing reference detail remains explicit as `不伪造数量`. Current queue returned to empty because `IM098` would introduce controlled write actions and requires separate PM confirmation.

## 2026-06-03 IM098 Master Data Controlled Action Shell

`IM098/US718` added a controlled maintenance-action shell to `/master-data/[entityKey]`. Each entity detail now shows four action categories: create, edit, freeze, and effective-period adjustment.

The shell is intentionally non-writing. Each action shows single-entity scope, reference-check requirements, failure boundaries, and a disabled `暂不提交` button. No backend write API, schema/migration, dependency, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement rule, or charge-factor work was added. Current queue returned to empty after the master-data read-only/action-boundary chain.

## 2026-06-03 IM099-IM101 Personnel Schedule Production Planning

After the master-data maintenance chain, the next recommended block is personnel-level schedule production. It starts with a read-only production workbench under the existing plan/schedule area, then can add version detail with 0.5h expansion visibility, and only after that can discuss publish/freeze boundaries.

Only `US719/IM099` entered current ready state. `US720/IM100` and `US721/IM101` stay outside current until the previous slice is green. The chain must not add backend routes, schema/migration changes, dependencies, approval, export, batch operations, permission, real external integrations, automatic scheduling, production formulas, settlement rules, or charge factors without a separate confirmed task.

## 2026-06-03 IM099 Personnel Schedule Production Workbench

`IM099/US719` added `/schedule-plans/production` under the existing plan/schedule navigation as a read-only personnel-schedule production workbench. The page reuses the current import-batch list contract and filters personnel-schedule batches into production rows with source batch, business version, business date range, application state, 0.5h expansion state, blocker summary, and next-step labels.

The slice intentionally does not publish, freeze, trigger automatic scheduling, or write production state. It adds no backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, real external integration, production formula, settlement rule, or charge-factor change. Current state advanced to `US720/IM100` for version detail and 0.5h expansion result visibility.

## 2026-06-04 IM100 Personnel Schedule Version Detail

`IM100/US720` added `/schedule-plans/production/[batchId]` as the read-only personnel-schedule version detail page reached from the production workbench. The detail page resolves the selected source batch from the existing import-batch list, then shows source batch/version, business date range, application state, successful source rows, shift-reference scope, personnel-scope no-fabrication notice, 0.5h expansion state, and blocker summary.

The page does not fabricate personnel names, shift detail rows, or interval rows because the current list API only exposes batch, version, and applied-record counts. No backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, automatic scheduling, production formula, settlement rule, or charge-factor work was added. Current state advanced to `US721/IM101`, which requires PM confirmation before any publish/freeze boundary shell implementation.

## 2026-06-04 IM101 Personnel Schedule Release Freeze Shell

`IM101/US721` added the publish/freeze boundary safety shell to the personnel-schedule version detail page. The detail now shows three disabled production-action cards: publish version, freeze version, and unpublish. Each card surfaces the selected source version, 0.5h expansion gate, reference-check gate, and failure boundary so users can see why the current page cannot change production state.

The implementation remains non-writing. It adds no form, server action, backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, automatic scheduling, production formula, settlement rule, or charge-factor work. After the IM099-IM101 personnel-schedule production chain, current queue returned to empty.

## 2026-06-04 IM102-IM104 Demand Forecast Production Planning

After the personnel-schedule production chain, the next recommended block is demand-forecast production. It starts with a read-only production workbench under the existing plan/schedule area, then can add forecast version detail with skill-group/level/time-bucket alignment visibility, and only after that can discuss change-tracking boundaries.

Only `US722/IM102` entered current ready state. `US723/IM103` and `US724/IM104` stay outside current until the previous slice is green. The chain must not add backend routes, schema/migration changes, dependencies, approval, export, batch operations, permission, real external integrations, automatic scheduling, production formulas, settlement rules, or charge factors without a separate confirmed task.

## 2026-06-04 IM102 Demand Forecast Production Workbench

`IM102/US722` added `/demand-plans/production` under the existing plan/schedule navigation as a read-only demand-forecast production workbench. The page reuses the current import-batch list contract and filters demand-forecast batches into production rows with source batch, forecast business version, business date range, application state, skill-group/level/time-bucket alignment state, blocker summary, and IM103/IM104 next-step labels.

The slice intentionally does not adjust forecasts, write change records, trigger automatic scheduling, or write production state. It adds no backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, real external integration, production formula, settlement rule, or charge-factor change. Current state advanced to `US723/IM103` for forecast version detail and alignment-result visibility.

## 2026-06-04 IM103 Demand Forecast Version Detail

`IM103/US723` added `/demand-plans/production/[batchId]` as the read-only demand-forecast version detail page reached from the production workbench. The detail page resolves the selected source batch from the existing import-batch list, then shows source batch/version, business date range, application state, successful source rows, skill-group and level alignment boundary, 0.5h time-bucket state, forecast-detail no-fabrication notice, alignment result, and blocker summary.

The page does not fabricate skill groups, levels, interval rows, or forecast detail rows because the current list API only exposes batch, version, and applied-record counts. No backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, automatic scheduling, production formula, settlement rule, or charge-factor work was added. Current state advanced to `US724/IM104`, which requires PM confirmation before any change-tracking boundary shell implementation.

## 2026-06-04 IM104 Demand Forecast Change Tracking Shell

`IM104/US724` added the change-tracking boundary safety shell to the demand-forecast version detail page. The detail now shows four precheck areas before any forecast change could be considered: source version, skill-group/level/0.5h time-bucket alignment, downstream impact, and failure boundary.

The shell is intentionally non-writing. It shows disabled action cards for recording forecast changes, checking downstream impact, and updating production scope. No form, server action, backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, automatic scheduling, production formula, settlement rule, or charge-factor work was added. After the IM102-IM104 demand-forecast production chain, current queue returned to empty.

## 2026-06-04 IM105-IM107 Actual Log Production Planning

After the demand-forecast production chain, the next approved block is login/status-log production handling under the existing Data & Integration navigation. The sequence is:

1. `US725/IM105`: add a read-only actual-log production workbench for login/status source batches, business versions, business dates, timezone, and cross-day boundaries.
2. `US726/IM106`: add a single-batch processing explanation detail page for cross-day splitting, business-day ownership, Asia/Shanghai timezone checks, and status intervals.
3. `US727/IM107`: add a status-dictionary and exception-explanation safety shell before any write-capability discussion.

Only `US725/IM105` entered current ready state. The chain must not add backend routes, schema/migration changes, dependencies, approval, export, batch operations, permission, real external integrations, automatic scheduling, production formulas, settlement rules, or charge factors without a separate confirmed task.

## 2026-06-04 IM105 Actual Log Production Workbench

`IM105/US725` added `/actual-logs/production` under the existing Data & Integration navigation as a read-only login/status-log production workbench. The page reuses the current import-batch list contract and filters login-log/status-log batches into production rows with source batch, actual-log business version, business date range, application state, timezone boundary, cross-day handling boundary, processing boundary, and blocker summary.

The slice intentionally does not update the status dictionary, recalculate actual productive time, trigger schedule-vs-actual comparison, or write production state. It adds no backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, real external integration, automatic scheduling, production formula, settlement rule, or charge-factor change. Current state advanced to `US726/IM106` for single-batch processing explanation.

## 2026-06-04 IM106 Actual Log Processing Explanation Detail

`IM106/US726` added `/actual-logs/production/[batchId]` as the read-only login/status-log processing explanation page reached from the production workbench. The detail page resolves the selected source batch from the current import-batch list and, when persisted row detail is available, explains business-day ownership, Asia/Shanghai timezone checks, cross-day status-interval splitting, status dictionary rows, status interval rows, and login-event rows.

The page does not fabricate login events, status intervals, status dictionary entries, timezone failures, or cross-day splits when the row detail API has no usable rows. No backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, automatic scheduling, production formula, settlement rule, or charge-factor work was added. Current state advanced to `US727/IM107` for the status-dictionary and exception-explanation safety shell.

## 2026-06-04 IM107 Actual Log Status Dictionary Exception Shell

`IM107/US727` added a status-dictionary and exception-explanation safety shell to `/actual-logs/production/[batchId]`. The detail page now summarizes status dictionary rows, unknown status intervals, non-Asia/Shanghai timezone rows, cross-day status intervals, and frozen-employee reference boundaries.

All actions are disabled safety shells: dictionary maintenance, exception-rule submission, and actual-work-hour recalculation are visible as future controlled actions only. No backend route, schema/migration, dependency, approval, export, batch operation, permission boundary, automatic scheduling, production formula, settlement rule, or charge-factor work was added. After the IM105-IM107 login/status-log production chain, current queue returned to empty.

## 2026-06-04 IM108-IM110 Master Data CRUD Planning

After the login/status-log production chain, the next approved block is master-data maintenance CRUD. The sequence intentionally starts from the smallest write surface:

1. `US728/IM108`: backend-only single-agent maintenance API for create, edit, freeze, and effective-period changes.
2. `US729/IM109`: connect `/master-data/agents` to the new controlled submit API and feedback.
3. `US730/IM110`: extend the stable maintenance pattern to workplaces, suppliers, projects, skills, and bindings.

`US728/IM108` is complete. It added a backend-only single-agent maintenance API for create, edit, freeze, and effective-period changes, reusing the existing `master_data_employees` table and repository without schema/migration changes.

`US729/IM109` is complete. `/master-data/agents` now exposes four controlled submit forms for agent create, edit, freeze, and effective-period changes. Submission is handled by a Next server action that calls the IM108 single-agent API, then redirects back to the detail page with success or backend error feedback. Non-agent master-data entities remain read-only safety shells.

`US730/IM110` is complete. Backend maintenance APIs now cover workplaces, suppliers, projects, skills, and binding relationships in addition to agents. Frontend detail pages for `/master-data/sites`, `/master-data/vendors`, `/master-data/projects`, `/master-data/skills`, and `/master-data/bindings` now expose controlled submit forms and reuse the same success/error feedback pattern. Binding maintenance validates employee, supplier, workplace, project, and skill references; freeze remains disabled for bindings because there is no binding status field.

Current queue returned to empty after IM110. The chain still avoids permissions, approval, export, batch operations, real external integrations, automatic scheduling, production formulas, settlement rules, and charge factors.

## 2026-06-04 IM111 Personnel Schedule Version Detail API

After master-data maintenance CRUD, the next slice returns to the personnel-schedule production flow. `US721/IM101` already added a publish/freeze boundary safety shell on `/schedule-plans/production/[batchId]`, but the detail page still cannot read real persisted schedule details or 0.5h expanded intervals from a backend production-detail API.

`US731/IM111` is complete. The backend now exposes `/api/v1/personnel-schedule/production/{batch_id}` as a read-only personnel-schedule production detail API. It resolves the source import batch, locates the applied schedule version by import_version_id, and returns source batch context, schedule_version_id, business date range, schedule detail rows, and 0.5h expanded intervals.

Current queue returned to empty after IM111. The task explicitly excluded frontend wiring, schema/migration, publish/freeze writes, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors.

## 2026-06-04 IM112 Personnel Schedule Production Detail UI

`US732/IM112` is complete. The existing `/schedule-plans/production/[batchId]` page now calls `/api/v1/personnel-schedule/production/{batch_id}` and replaces the previous no-fabrication placeholder with real schedule detail and 0.5h interval visibility when the API returns an applied version.

The task remained frontend-scaffold only. It did not modify backend code, schemas, migrations, dependencies, publish/freeze writes, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM112.

## 2026-06-04 IM113 Personnel Schedule Row Reference Explanations

`US733/IM113` is complete. The personnel-schedule production detail page now explains row-level reference completeness for schedule details and 0.5h intervals, including explicit blocker text when employee, workplace, supplier, project, skill, or shift references are missing.

The task remained frontend-scaffold only. It did not modify backend code, schemas, migrations, dependencies, publish/freeze writes, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM113.

## 2026-06-04 IM114 Demand Forecast Version Detail API

After IM113, the next slice returns to the demand-forecast production flow. `US724/IM104` already added the change-tracking boundary safety shell on `/demand-plans/production/[batchId]`, but the detail page still lacks a backend production-detail API that can return real forecast intervals and version change records.

`US734/IM114` is complete. The backend now exposes `/api/v1/demand-forecast/production/{batch_id}` as a read-only demand-forecast production detail API. It resolves the source import batch, locates the applied forecast version through the existing import version, and returns source batch context, forecast version, 0.5h forecast intervals, and version change records.

The task explicitly excluded frontend wiring, schema/migration, dependencies, forecast write/change submission, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors. Current queue returned to empty after IM114.

## 2026-06-04 IM115 Demand Forecast Production Detail UI

After IM114, the demand-forecast production detail page can now be wired to a real backend detail API. `US735/IM115` is complete. `/demand-plans/production/[batchId]` reads `/api/v1/demand-forecast/production/{batch_id}` and shows the returned forecast version, 0.5h forecast intervals, and version change records.

The task remained frontend-scaffold only. It excluded backend changes, schema/migration, dependencies, forecast write/change submission, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors. Current queue returned to empty after IM115.

## 2026-06-04 IM116 Demand Forecast Detail Row Explanations

After IM115, the demand-forecast production detail page shows real 0.5h forecast intervals. `US736/IM116` is complete. Forecast interval rows now show row-level alignment status and blocker explanations for workplace, project, skill, demand level, time bucket, and required-agent values.

The task remained frontend-scaffold only. It excludes backend changes, schema/migration, dependencies, forecast write/change submission, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors. Current queue returned to empty after IM116.

## 2026-06-04 IM117 Production Detail Comparison Entry

After IM116, production detail pages can show real schedule and forecast version rows, but users still needed a clear route into the existing local-comparison workflow. `US737/IM117` is complete. `/demand-plans/production/[batchId]` and `/schedule-plans/production/[batchId]` now show read-only local-comparison entry cards that link to `/data-quality/versions` with the corresponding version domain, applied status, and business date filter when available.

The task remained frontend-scaffold only. It did not add backend routes, schemas, migrations, dependencies, direct comparison submit actions on production details, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM117.

## 2026-06-04 IM118 Version Workbench Applied Entry Compatibility

After IM117, production detail pages linked into `/data-quality/versions` with `status=applied`, but the workbench status filter only recognized ready/blocked/empty. `US738/IM118` is complete. The version workbench now treats `status=applied` as an alias for ready rows, so production-detail entry links preserve the intended applied-version view and can still expose direct forecast-vs-schedule candidates when demand forecast and personnel schedule versions are both applied for the same business date.

The task remained frontend-scaffold only. It did not add backend routes, schemas, migrations, dependencies, new comparison APIs, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM118.

## 2026-06-04 IM119 Login Log Version Result Link Consistency

After IM118, actual-log comparison candidates already accepted both `login_log` and `status_log`, but direct applied-version result matching only recognized `status_log`. `US739/IM119` is complete. `login_log` now participates in the same actual_logs direct result context as `status_log`: applied result cards and version result context can match `schedule_vs_actual` runs through `actual_import_version_id`, and the downstream review-case entry stays on `schedule_actual`.

The task remained frontend-scaffold only. It did not add backend routes, schemas, migrations, dependencies, new comparison APIs, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM119.

## 2026-06-04 IM120 Comparison Run Source Explanation

After IM119, applied actual-log versions can stay connected to `schedule_vs_actual` runs, but the comparison-run detail page still required users to infer why a run belonged to a pair of source versions. `US740/IM120` is complete. The detail page's full result-review card now explains the source version pair, business date range, and metric scope for both `forecast_vs_schedule` and `schedule_vs_actual`; missing source versions are shown as explicit blockers instead of fabricated context.

The task remained frontend-scaffold only. It did not add backend routes, schemas, migrations, dependencies, new comparison APIs, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM120.

## 2026-06-04 IM121 Comparison Run Detail Workspace Tabs

After IM120, the comparison-run detail page had enough result-review context, but the page was still organized as one long stack of cards. `US741/IM121` is complete. The detail page now uses a tabbed workspace for `总览`, `来源链路`, `结果明细`, `复核案例`, and `处理边界`; the default view keeps the user on overview metrics and result-review context, while source links, result rows, review cases, and no-write boundaries move behind explicit entries.

The task remained frontend-scaffold only. It did not add backend routes, schemas, migrations, dependencies, new comparison APIs, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM121.

## 2026-06-04 IM122 Review Case Detail Workspace Tabs

After IM121 fixed the comparison-run detail page, the review-case detail page still stacked source context, evidence, conclusions, action forms, processing timeline, same-owner navigation, and boundaries in one long page. `US742/IM122` is complete. The review-case detail page now uses a tabbed workspace for `总览`, `来源链路`, `证据结论`, `处理动作`, `Owner 导航`, and `处理边界`; the default view keeps only key metrics and evidence gap context visible, while detailed source, evidence/conclusion records, controlled actions, owner navigation, and boundaries move behind explicit entries.

The task remained frontend-scaffold only. It did not add backend routes, schemas, migrations, dependencies, new review APIs, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, or charge factors. Current queue returned to empty after IM122.
