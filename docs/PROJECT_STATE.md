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
