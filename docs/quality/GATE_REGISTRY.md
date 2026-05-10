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
- Will `bash scripts/check.sh` be run before Done Report?

Stop conditions:

- PM confirmation is required.
- Scope expands beyond the Gate Plan.
- The task needs dependencies, package or lockfile changes.
- The task needs real API, backend, database, or production capability.
- The task changes business metrics, status codes, settlement formulas, or charge factors.
- The task imports from a lab/archive/reference source.
- `bash scripts/check.sh` fails.

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
