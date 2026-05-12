# State Management

## Purpose

This project uses a current/registry/archive state model to reduce default context size while keeping Story Runner execution traceable and repairable.

## Layers

### Current Layer

Default execution state lives in:

- `docs/current/PROJECT_CONTEXT.md`
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`

Only `ready`, `in_progress`, and `blocked` stories/tasks belong in current files. Done history must not accumulate here.

### Registry Layer

Lookup indexes live in:

- `docs/registry/TRACE_INDEX.yaml`
- `docs/registry/DECISION_INDEX.yaml`

`TRACE_INDEX.yaml` stores IDs, paths, and relationships only. It must not store `status`.

### Archive And Legacy Layer

Legacy files and future archive files are historical sources. They are not execution queues.

Default no-read files:

- `tasks/backlog.yaml`
- `docs/user-stories.md`
- `docs/raw-requirements.md`
- `docs/audit-report.md`
- `docs/task-log.md`
- `docs/dev/branch-log.md`
- `docs/archive/**`

These files may still be updated during the transition when the active Gate requires traceability, but they are not the default startup context once current files exist.

## Default Read Set

Before non-trivial execution, read:

1. `AGENTS.md`
2. `docs/current/PROJECT_CONTEXT.md`
3. `docs/current/STORY_QUEUE.yaml`
4. `docs/current/ACTIVE_TASKS.yaml`
5. `docs/current/BLOCKERS.md`
6. `docs/quality/GATE_REGISTRY.md`
7. Current task files

Use legacy files only when current state is missing, inconsistent, or the task is explicitly about migration, audit, repair, or historical lookup.

## Single Writer Rule

Only the main Worker may write:

- `docs/current/**`
- `docs/registry/**`

Subagents may inspect relevant files and return recommendations, but they must not directly modify current or registry state.

## History-On-Demand Rule

Archive and legacy history may be read only when:

- PM asks for historical lookup.
- The current task depends on a historical decision.
- Current files are insufficient.
- Documents conflict.
- The task is audit, review, rollback, incident investigation, or state repair.
- Old interfaces, patterns, or designs must be reused.

Query budget:

- Normal development: at most 3 historical files, depth 2.
- Audit: at most 8 historical files, depth 3.
- Incident or rollback: scope may expand, but the Worker must state the range and reason first.

Query order:

1. `docs/registry/TRACE_INDEX.yaml`
2. `docs/registry/DECISION_INDEX.yaml`
3. Specific archive or legacy files
4. Raw logs only when needed

Forbidden:

- Reading archive broadly for safety.
- Executing directly from archive.
- Treating historical `ready` as current `ready`.

## State Check

`scripts/check-state.sh` validates the current and registry layer.

Initial rollout mode is warning-only by default. `--strict` is available for later hard blocking after the workflow runs cleanly across real tasks.

Current checks:

- Story IDs in `STORY_QUEUE.yaml` are unique.
- Task IDs in `ACTIVE_TASKS.yaml` are unique.
- Every ready story has a matching active task.
- Every active task references an existing current story.
- `TRACE_INDEX.yaml` does not contain `status`.
- Registry `file:` paths exist.
- Current queue entries do not point to archive files as execution sources.
- Current files stay under line-count budgets.

## State Repair Mode

State Repair Mode triggers when:

- Current story queue and active tasks disagree.
- Registry paths point to missing files.
- Archive migration is partially complete.
- `check-state` failure blocks normal task startup.

Allowed in State Repair Mode:

- Modify `docs/current/**`.
- Modify `docs/registry/**`.
- Modify necessary archive index pointers.
- Run `bash scripts/check-state.sh --repair-scope`.
- Run full `bash scripts/check.sh` after repair.

Forbidden in State Repair Mode:

- Business code changes.
- Package or lockfile changes.
- New dependencies.
- Database, real integration, auth, permission, approval, export, batch, production formula, settlement, or charge-factor work.

## Archive Transaction Rule

When archiving is approved, use this order:

1. Dry-run the move list.
2. Write archive content.
3. Update `TRACE_INDEX.yaml`.
4. Update `STORY_QUEUE.yaml`.
5. Update `ACTIVE_TASKS.yaml`.
6. Update `PROJECT_CONTEXT.md`.
7. Update current audit/task-log/branch-log window when applicable.
8. Run `bash scripts/check-state.sh`.
9. Run `bash scripts/check.sh`.
10. Commit only after green verification.

Failure handling:

- Do not delete active entries after a failed step.
- Mark `state_migration_blocked`.
- Report the failed step in the Done Report.
- Do not leave archive-only state without matching index/current updates.

## Restoring Historical Tasks

Archive is not executable. To restore old work, create a new current task with:

```yaml
id: F0XX
status: ready
restored_from_archive:
  story_id: US0XX
  task_id: F0YY
  archive_file: docs/archive/2026-05/tasks.yaml
reason: "Why this is restored"
new_acceptance:
  - "New acceptance criteria"
gate: frontend-scaffold
```

Restored tasks run through current Gates and do not inherit historical readiness.
