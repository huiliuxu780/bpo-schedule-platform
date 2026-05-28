# Project State

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate.

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
- Local detail drilldowns for scheduling risks and unavailability impact.
- Display-only TanStack Table parity slices across the current schedule-plan, demand-plan, shift-detail, risk, and unavailability views.
- Dashboard anomaly detail table parity, including local TanStack Table sorting, filtering, pagination, column visibility, and page-size controls.
- Dashboard local operational polish for anomaly filters, data sync status table parity, and heatmap deficit summaries.
- A documentation-first Lightweight Harness with current/registry state governance.

The project does not contain:

- Real external API integration.
- Broad production persistence beyond the DB002 import foundation, DB003 master data, DB004 personnel schedule, DB005 demand forecast, DB006 login/status log, DB007 comparison result, DB008 review closure record, and IM001 import-center CSV upload slices.
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

## Product Direction

Near-term product work should stay inside either confirmed local MVP frontend/backend slices or confirmed database-persistence slices.

Recommended order after state governance:

1. Plan the next slice explicitly: import template/mapping management or idempotent rerun safeguards for import/application/calculation flows.
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
