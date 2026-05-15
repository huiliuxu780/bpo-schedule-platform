# Harness Operating Model

## H001 / H002

H001 keeps the Harness useful while reducing default context. H002 keeps `TRACE_INDEX.yaml` windowed so the index stays below warning budget. These are docs-only state-hygiene tasks: no business code, UI, E2E, dependencies, database, integrations, auth, approval, export, production formulas, settlement rules, or charge factors.

## Goal

Harness exists to answer three questions with low context cost:

- What is the current executable work?
- What files and gates are allowed for that work?
- What evidence proves the work is complete?

## Default Read Set

Every non-trivial task starts from exactly six files:

1. `AGENTS.md`
2. `docs/current/PROJECT_CONTEXT.md`
3. `docs/current/STORY_QUEUE.yaml`
4. `docs/current/ACTIVE_TASKS.yaml`
5. `docs/current/BLOCKERS.md`
6. `docs/quality/GATE_REGISTRY.md`

Task-specific files are read only after the current task contract names them.

## On-Demand Planning References

Read `docs/requirements-inventory.md` and `docs/roadmap.md` only for:

- planning
- requirements inventory
- choosing the next stage task
- release or test-environment preparation
- PM status questions such as "现在做到哪里"
- PM readiness questions such as "还差什么能验收/发布"

## Legacy And Reference Files

These files are reference material, not startup context and not executable queues:

- `docs/task-log.md`
- `docs/dev/branch-log.md`
- `docs/audit-report.md`
- `docs/user-stories.md`
- `docs/raw-requirements.md`
- `tasks/backlog.yaml`
- archive or historical documents

Read them only through `docs/registry/TRACE_INDEX.yaml` and exact sections when current state is insufficient.

## Recording Rules

Small tasks record only the current story/task contract, minimal trace/index entry, final verification, and commit evidence.

Large tasks or coherent batches may add a compact current batch contract and a short closeout summary. Do not copy full acceptance text, audit text, or branch-log prose into current files.

Update `docs/registry/TRACE_INDEX.yaml` when a current story, task, requirement, archive reference, or lookup path changes. Keep entries ID-based and compact.

`TRACE_INDEX.yaml` keeps only the current/recent execution window. Historical trace remains in legacy/reference documents and is read on demand through exact legacy sections. Small tasks use short evidence entries only; do not append long closeout, acceptance, audit, or branch-log prose to trace.

Use a short log only when the task does not change current execution state, registry relationships, or historical lookup paths.

## Checks

Run `bash scripts/check-state.sh --strict --diff=working` after any `docs/current/**` or `docs/registry/**` change.

Run `bash scripts/check.sh` before reporting completion or committing completed work.

## Anti-Bloat Rules

- Keep `docs/current/**` as the current window only.
- Clear finished work from current after closeout.
- Keep `PROJECT_CONTEXT.md` as a summary, not a history log.
- Keep `TRACE_INDEX.yaml` as an index, not an audit report.
- Keep requirements inventory and roadmap on demand, not default.
