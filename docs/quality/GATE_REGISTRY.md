# Gate Registry

## Default Gate

Use this gate for every non-trivial task.

Checks:

- Has Codex read `AGENTS.md`, `docs/PROJECT_STATE.md`, `tasks/backlog.yaml`, and this file?
- Is the requested task documented in the backlog or clearly specified by the PM?
- Are allowed files and forbidden files explicit?
- Does the task require PM confirmation?
- Does the task touch business code, package files, dependencies, real APIs, backend, database, metrics, status codes, settlement formulas, or archive material?
- Is acceptance verifiable?
- Will the task run on a task branch instead of `main`?
- Are branch, scope diff, check, commit, integration, and push evidence fields known for the Done Report?
- Will `bash scripts/check.sh` be run before Done Report?

Stop conditions:

- PM confirmation is required.
- Scope expands beyond the Gate Plan.
- The task needs dependencies, package or lockfile changes.
- The task needs real API, backend, database, or production capability.
- The task needs database connection setup, ORM, migrations, schema implementation, or production persistence configuration.
- The task changes business metrics, status codes, settlement formulas, or charge factors.
- The task imports from a lab/archive/reference source.
- `bash scripts/check.sh` fails.

Branch and verification rules:

- Direct development on `main` is forbidden.
- Each task must follow `docs/quality/GIT_BRANCH_WORKFLOW.md` unless a stricter task-level Gate overrides it.
- Final completion requires `bash scripts/check.sh` after traceability updates, not only an intermediate check.
- Local commit must include only files allowed by the current task scope.
- Remote push requires PM confirmation.

## Workflow Gate Matrix

Backlog `required_workflow` values must map to one of the gates below. If a task introduces a new workflow name, this registry must be updated in the same task before execution.

| required_workflow | Gate | Typical Scope | Extra Stop Conditions |
| --- | --- | --- | --- |
| `harness` | Harness Documentation Gate | Harness rules, backlog planning, project state, audit, branch log, check scripts | Business implementation, new dependencies, package/lockfile changes, real integrations, database, auth, permissions, approval, export, batch operations |
| `frontend-scaffold` | Frontend Scaffold Gate | Confirmed static/dashboard UI, local prototype pages, shadcn components, frontend-only local mock or API-client presentation work | New dependencies or package/lockfile changes without PM confirmation, real external data, auth, permissions, approval, export, batch operations, production formulas/status codes/settlement/charge factors |
| `frontend-audit` | Frontend Audit Gate | Read-only UI/design/code audit and gap reports | Direct UI edits, dependency/package changes, business implementation, copied external code |
| `backend` | Backend Local MVP Gate | Local FastAPI endpoints, local seed/in-memory data, backend tests, route contracts | Database persistence, real external integrations, auth, permissions, approval/export/batch workflows, production status codes/formulas/settlement/charge factors |
| `backend-mvp` | Backend Local MVP Gate | Same as `backend`, used for MVP-local backend tasks that explicitly avoid production workflow capability | Same as `backend` |
| `backend-vertical` | Backend Local MVP Gate | Backend portion of a confirmed vertical slice using local data and tests | Same as `backend` |
| `qa` | QA Acceptance Gate | Acceptance review, verification evidence, audit/report updates | Product behavior changes, implementation edits outside acceptance corrections, dependency/package changes |
| `state-hygiene` | State Hygiene Gate | Current/registry state model, state checks, default read set, archive boundary, trace indexes | Business implementation, dependency/package changes, database, real integrations, auth, permissions, approval, export, batch operations |
| `state-repair` | State Repair Gate | Repair inconsistent current/registry/archive index state | Business code, package/lockfile changes, new dependencies, database, real integrations, product feature work |

## No Database MVP Mode

PM confirmed on 2026-05-12 that database work should stay out of scope until the local MVP feature chain is developed and verified.

Allowed without a database Gate:

- local FastAPI seed data or process-memory state
- frontend fallback data that matches existing local contracts
- frontend-only navigation, drilldown, table parity, and acceptance audit work
- documentation that records database work as deferred

Hard stop until PM confirms a later database Gate:

- database connection setup
- ORM models, repositories, or adapters
- migration files
- schema implementation
- production persistence configuration
- real external data-source integration

This rule applies to `frontend-scaffold`, `backend`, `backend-mvp`, `backend-vertical`, and `qa` tasks. A task may mention future database needs in documentation, but it must not implement database persistence or prepare production persistence files unless a specific PM-confirmed database task allows it.

## Harness Documentation Gate

Use this gate for `required_workflow: harness` tasks after the project has moved beyond the initial clean Harness stage.

Allowed:

- Update Harness rules and workflow documentation.
- Update branch/worktree/integration workflow documentation.
- Update backlog, raw requirements, user stories, task log, decision log, audit report, branch log, and project state.
- Update check scripts only when the task explicitly concerns verification mechanics.

Forbidden unless explicitly confirmed by PM:

- Add or change frontend business implementation.
- Add or change backend business implementation.
- Add dependencies or modify package/lockfiles.
- Connect real APIs, database, auth, permissions, approval, export, or batch operations.
- Change production status codes, business formulas, settlement rules, or charge factors.

Required verification:

- `git diff --check`
- `bash scripts/check.sh`

Required Git evidence:

- `base_main_commit`
- `branch_name`
- `scope_diff_check`
- `check_result`
- `local_commit_sha` when final check passes and local commit succeeds
- `push_decision` for stage/module/coherent feature-set completion

## Frontend Scaffold Gate

Use this gate for `required_workflow: frontend-scaffold` tasks.

Allowed when the task is confirmed:

- Modify `app/**`, `components/**`, `hooks/**`, `lib/**`, and `public/**` within the task's allowed file list.
- Use existing shadcn/ui components and semantic theme tokens.
- Use local mock/seed/API-client data only when already authorized by the task.
- Update Harness traceability documents.

Forbidden unless explicitly confirmed by PM:

- New dependencies or package/lockfile changes.
- Real external data sources, database persistence, auth, permissions, approval, export, or batch operations.
- Production formulas, status-code finalization, settlement rules, or charge factors.
- Importing from the lab archive or external legacy code.

Required verification:

- Frontend lint/typecheck/build through `bash scripts/check.sh`.
- Browser smoke verification when the task changes visible UI, layout, forms, navigation, or interaction behavior.

## Frontend Audit Gate

Use this gate for `required_workflow: frontend-audit` tasks.

Allowed:

- Read current frontend files, docs, design specs, and generated reports.
- Update `docs/**` and `tasks/backlog.yaml` when the audit task allows it.

Forbidden:

- Direct UI/code changes under `app/**`, `components/**`, `hooks/**`, `lib/**`, or `backend/**`.
- Dependency installation, package/lockfile changes, or copied external source.

Required verification:

- `git diff --check`
- `bash scripts/check.sh`

## Backend Local MVP Gate

Use this gate for `required_workflow: backend`, `backend-mvp`, and `backend-vertical` tasks.

Allowed when the task is confirmed:

- Add or modify local FastAPI routes, services, schemas, seed/in-memory data, and backend tests within the task's allowed file list.
- Update frontend clients only when the specific vertical task allows it.
- Update Harness traceability documents.

Forbidden unless explicitly confirmed by PM:

- Database persistence.
- Real Excel, CORN, HR, WFM, or third-party integrations.
- Auth, permissions, approval, export, batch operations, or production workflow state changes.
- Production status-code finalization, formulas, settlement rules, or charge factors.

Required verification:

- Backend unittest through `bash scripts/check.sh`.
- Frontend lint/typecheck/build through `bash scripts/check.sh` when frontend clients or pages are touched.

## QA Acceptance Gate

Use this gate for `required_workflow: qa` tasks.

Allowed:

- Run verification commands.
- Inspect local routes and contracts.
- Update acceptance reports, audit records, task logs, branch logs, project state, and backlog status.

Forbidden unless explicitly confirmed by PM:

- New implementation work outside narrow acceptance corrections already scoped by the active story.
- Dependency/package changes.
- Real integrations, database, auth, permissions, approval, export, batch operations, production formulas, status codes, settlement rules, or charge factors.

Required verification:

- `bash scripts/check.sh`
- Any story-specific browser, API, or contract checks listed in the task acceptance.

## State Hygiene Gate

Use this gate for `required_workflow: state-hygiene` tasks.

Allowed:

- Add or update `docs/current/**`.
- Add or update `docs/registry/**`.
- Update `AGENTS.md`, `docs/quality/STATE_MANAGEMENT.md`, `docs/quality/GATE_REGISTRY.md`, `docs/quality/DONE_REPORT_TEMPLATE.md`, `docs/harness/lightweight-harness.md`, and `docs/PROJECT_STATE.md` for state-governance rules.
- Add or update `scripts/check-state.sh`.
- Update legacy traceability files only when the active transition task requires it.

Forbidden unless explicitly confirmed by PM:

- Business implementation under `app/**`, `components/**`, `hooks/**`, `lib/**`, or `backend/**`.
- New dependencies or package/lockfile changes.
- Real integrations, database, auth, permissions, approval, export, batch operations, production formulas, status codes, settlement rules, or charge factors.
- Large history migration or archive deletion outside a confirmed archive transaction.

Required verification:

- `bash scripts/check-state.sh`
- `bash scripts/check-state.sh --repair-scope`
- `git diff --check`
- `bash scripts/check.sh`

## State Repair Gate

Use this gate for `required_workflow: state-repair` tasks.

Allowed:

- Repair inconsistencies in `docs/current/**`.
- Repair missing or incorrect pointers in `docs/registry/**`.
- Update necessary archive index references when a migration is partially complete.
- Update audit notes that explain the repair.

Forbidden:

- Business code changes.
- Package or lockfile changes.
- New dependencies.
- Database, real integrations, auth, permissions, approval, export, batch operations, production formulas, status codes, settlement rules, or charge factors.
- Replaying archived tasks as current work without creating a new current task.

Required verification:

- `bash scripts/check-state.sh --repair-scope`
- `bash scripts/check-state.sh`
- `git diff --check`
- `bash scripts/check.sh`

## Clean Harness Gate

Use this gate while the project is still Harness-only.

Allowed:

- Update Harness rules.
- Update backlog planning.
- Update project state and branch log.
- Update check scripts that validate Harness integrity.

Forbidden unless explicitly confirmed by PM:

- Add frontend business implementation.
- Add backend implementation.
- Add business mock data.
- Add dependencies.
- Modify package or lockfiles.
- Connect real APIs.
- Migrate code from the lab archive.
