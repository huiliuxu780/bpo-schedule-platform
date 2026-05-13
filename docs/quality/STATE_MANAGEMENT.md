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

Current execution state source of truth is limited to:

- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`

Legacy files may still record history and traceability, but they must not override current execution state.

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

## Active Task Contract

`docs/current/ACTIVE_TASKS.yaml` is the execution source of truth for current task contracts. Keep it lightweight and limited to the minimum execution contract:

- `id`
- `story_ids`
- `status`
- `gate`
- `branch`
- `allowed_files`
- `forbidden_files`
- `stop_conditions`
- `acceptance_ref`
- `verification`
- `evidence_expected`

Do not copy full historical acceptance, large audit text, or done-history detail into current active tasks.

## Current State Transitions

Current state changes must stay within these paths:

- `ready -> in_progress -> removed from current + written to history`
- `ready -> blocked`
- `in_progress -> blocked`

Current files must not retain long-lived `done` entries. Completion is recorded by removing the story/task from current files and writing evidence to legacy or archive traceability files.

## Codex Plan Boundary

Codex Plan is not a source of truth.

Role split:

- Harness current files own state.
- Registry files own lookup and trace relationships.
- Codex Plan is only a projection for the current execution turn.

Rules:

- Generate Codex Plan from `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml` when those files exist.
- If Codex Plan and Harness state conflict, Harness state wins.
- Do not use Codex Plan to decide whether a story is ready, in progress, blocked, done, archived, or restored.
- Do not use Codex Plan as audit evidence.
- Do not use Codex Plan as the source for allowed files, stop conditions, verification results, commit SHA, archive status, or Done Report fields.
- After execution, write real state changes back to Harness files, registry indexes, audit records, branch logs, task logs, commits, and Done Reports.

Acceptable use:

- Display the current step checklist for this session.
- Track immediate execution progress.
- Summarize work-in-progress while commands or verification are running.

Forbidden use:

- Treating an old Plan as project memory.
- Reconstructing current queue from Plan when Harness current files disagree.
- Marking project tasks done because the Plan panel says they are done.

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

`scripts/check-state.sh` supports warning, strict, and repair-scope modes. The standard `bash scripts/check.sh` path runs strict state checks by default and runs regression tests for strict failure cases.

Mode overrides:

- Default: `bash scripts/check.sh` runs `bash scripts/check-state.sh --strict`.
- State repair: `BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh`.
- Temporary diagnostics: `BPO_STATE_CHECK_MODE=warning bash scripts/check.sh`.

Current checks:

- Story IDs in `STORY_QUEUE.yaml` are unique.
- Task IDs in `ACTIVE_TASKS.yaml` are unique.
- Story and task statuses in current files are limited to `ready`, `in_progress`, or `blocked`.
- Every ready or in-progress story has a matching active task.
- Every active task references an existing current story.
- Every active task has the minimum execution contract fields.
- Every active task `gate` exists in `docs/quality/GATE_REGISTRY.md`.
- `TRACE_INDEX.yaml` does not contain `status`.
- Registry `file:` paths exist.
- Registry `current_files` paths exist.
- Current story/task IDs referenced by execution state exist in `TRACE_INDEX.yaml`.
- Current queue entries do not point to archive files as execution sources.
- Current files stay under line-count budgets.
- `TRACE_INDEX.yaml` stays under its registry budget and remains a lookup index instead of a new default context dump.
- Strict mode fails when current git changes violate active-task `allowed_files` or `forbidden_files`.

Regression coverage:

- Consistent current state passes strict mode.
- Missing active task for a ready story warns without self-locking warning mode.
- Missing active task fails strict mode.
- Lifecycle state in `TRACE_INDEX.yaml` fails strict mode.
- Done story history in current queue warns in warning mode and fails strict mode.
- Done task history in active tasks fails strict mode.
- Missing `TRACE_INDEX.yaml` current file paths fail strict mode.

First live smoke result:

- `H024/US065` was seeded into current queue, matched to an active task, verified with `bash scripts/check-state.sh --strict`, then removed from current after completion so done history stayed out of current files.
- `H025/US066` added a concrete invariant that current story/task files must not retain `status: done`, with regression coverage for warning-only and strict modes.
- `H026/US067` promoted standard `bash scripts/check.sh` to strict state checking by default while preserving explicit repair-scope and warning-only overrides.
- `H027/US068` added strict validation for `TRACE_INDEX.yaml` current file paths and de-duplicated registry path output.

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

If `bash scripts/check-state.sh --strict` fails, normal development must stop. Only `state-repair` work may proceed until strict state checks pass again.

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
