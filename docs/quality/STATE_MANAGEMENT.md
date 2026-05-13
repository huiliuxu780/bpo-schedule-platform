# State Management

## Purpose

This project uses a current/registry/archive model so Story Runner can execute from a small active context while keeping history, traceability, and state repair auditable.

This file is the single detailed rule source for:

- current/registry/archive boundaries
- `ACTIVE_TASKS.yaml` execution contract
- batch rules
- diff-scope enforcement
- hook enforcement
- state-repair behavior

`AGENTS.md` keeps only the hard-rule summary.

## Layers

### Current

Default execution state lives in:

- `docs/current/PROJECT_CONTEXT.md`
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`

Current execution state source of truth is limited to:

- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`

Only `ready`, `in_progress`, and `blocked` belong in current files. Current files must not retain `done` history.

### Registry

Lookup indexes live in:

- `docs/registry/TRACE_INDEX.yaml`
- `docs/registry/DECISION_INDEX.yaml`

`TRACE_INDEX.yaml` stores IDs, paths, and relationships only. It must not store `status`.

### Archive And Legacy

Legacy files and archive files are historical ledgers only. They are not executable queues.

Non-default startup files:

- `tasks/backlog.yaml`
- `docs/user-stories.md`
- `docs/raw-requirements.md`
- `docs/audit-report.md`
- `docs/task-log.md`
- `docs/dev/branch-log.md`
- `docs/archive/**`

Use them only as `acceptance_ref`, historical evidence, or on-demand lookup.

## SoT And Priority

Rule priority is:

1. `AGENTS.md` hard rules
2. `docs/current/ACTIVE_TASKS.yaml` current task contract
3. `docs/current/STORY_QUEUE.yaml` current story queue
4. `docs/current/BLOCKERS.md` current blockers
5. `docs/quality/GATE_REGISTRY.md` workflow gates
6. legacy/backlog files only as `acceptance_ref` or historical evidence

Current execution must start only from:

- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`

Historical lookup order is:

`docs/current/** -> docs/registry/** -> exact legacy/archive section`

## Default Read Set

Before non-trivial execution, read:

1. `AGENTS.md`
2. `docs/current/PROJECT_CONTEXT.md`
3. `docs/current/STORY_QUEUE.yaml`
4. `docs/current/ACTIVE_TASKS.yaml`
5. `docs/current/BLOCKERS.md`
6. `docs/quality/GATE_REGISTRY.md`
7. current task files

## Single Writer Rule

Only the main Worker may write:

- `docs/current/**`
- `docs/registry/**`

Subagents may inspect and recommend, but must not directly modify current or registry files.

## PROJECT_CONTEXT Rule

`docs/current/PROJECT_CONTEXT.md` is a human summary, not machine SoT.

If a structured summary block is maintained, use only:

```yaml
current_summary:
  queue_state: active | idle | blocked
  active_batch_id: <batch-id-or-null>
  in_progress_task: <task-id-or-null>
  ready_tasks: [<task-id>, ...]
```

Rules:

- `queue_state` must match `STORY_QUEUE.yaml`.
- `in_progress_task` must match `ACTIVE_TASKS.yaml`.
- If the block is absent, `check-state` does not validate prose.
- Ready state must never be inferred from free text.

## ACTIVE_TASKS Contract

`docs/current/ACTIVE_TASKS.yaml` is the execution source of truth for current task contracts.

Minimum task contract:

- `id`
- `story_ids`
- `status`
- `gate`
- `branch`
- `allowed_files`
- `traceability_files`
- `forbidden_files`
- `stop_conditions`
- `acceptance_ref`
- `verification`
- `evidence_expected`

Keep it lightweight. Do not copy full acceptance history or audit prose into current.

### Single Task Mode

Without a `batch` block, diff validation uses only the `in_progress` task contract.

### Batch Mode

Batch shape:

```yaml
batch:
  id: BATCH-...
  branch: codex/<branch>
  task_ids: [F001, F002]
  scope_reason: "why one branch is valid"
  allowed_gate_combo: [frontend-scaffold, qa]
```

Rules:

- `id`, `branch`, `task_ids`, and `scope_reason` are required.
- Every batch task must exist in `tasks`.
- Every batch task `branch` must equal `batch.branch`.
- Diff scope is the union of each batch task's `allowed_files + traceability_files`.
- Batch is allowed only for same-scope, same-branch work.
- Default rule is same gate only.
- Mixed gates require explicit `allowed_gate_combo`.
- High-risk boundaries must not be batched: dependency/package changes, database, auth, permissions, approval, export, batch-operation features, production formulas, settlement rules, or charge factors.

## Current State Transitions

Allowed transitions:

- `ready -> in_progress -> removed from current + written to history`
- `ready -> blocked`
- `in_progress -> blocked`

Current files must not keep long-lived `done` entries.

## Codex Plan Boundary

Codex Plan is not a source of truth.

- It is a temporary session view only.
- It must be derived from the active Harness queue when available.
- If Plan and Harness disagree, Harness wins.
- Plan must not decide readiness, completion, archive state, allowed files, stop conditions, verification evidence, or commit evidence.

## History-On-Demand

Use historical files only when:

- current files are insufficient
- the user asks for history
- the task depends on a historical decision
- documents conflict
- the task is audit, rollback, incident investigation, migration, or state repair

Query budget:

- normal development: up to 3 history files, depth 2
- audit: up to 8 history files, depth 3

Do not read archive broadly just to feel safe.

## check-state

`scripts/check-state.sh` supports:

- `--strict --diff=working`
- `--strict --diff=staged`
- `--strict --diff=none`
- `--repair-scope`
- warning mode by default

Intended use:

- `--diff=working`: manual review and `bash scripts/check.sh`
- `--diff=staged`: `pre-commit`
- `--diff=none`: state repair or non-git test fixtures

Validation requirements:

- current files exist
- story/task IDs are unique
- status is only `ready`, `in_progress`, or `blocked`
- current files do not contain `done`
- every `ready`/`in_progress` story has a matching active task
- every active task references an existing current story
- every active task has the full minimum contract
- active task `gate` exists in `docs/quality/GATE_REGISTRY.md`
- current git branch matches the active task branch; batch mode matches the batch branch
- `acceptance_ref` file exists and the referenced ID exists
- without batch, diff may touch only the active `in_progress` task's `allowed_files + traceability_files`
- with batch, diff may touch only the batch union scope
- if there is diff but no `in_progress` task, strict mode fails
- touching `forbidden_files` fails strict mode
- product tasks must not touch `docs/current/**` or `docs/registry/**` unless the gate is `state-hygiene` or `state-repair`
- `TRACE_INDEX.yaml` contains no `status`
- current story/task IDs have trace entries
- `current_files`, `file`, and `archive_refs` paths exist
- `TRACE_INDEX.yaml` over 420 lines warns
- `TRACE_INDEX.yaml` over 480 lines fails strict mode
- current file line budgets remain enforced

If strict mode fails, normal development stops and only `state-repair` work may continue.

## Hook Enforcement

Hooks use repo-local `core.hooksPath`:

- `scripts/hooks/pre-commit`
- `scripts/hooks/commit-msg`
- `scripts/hooks/pre-push`

Install with `bash scripts/install-hooks.sh`.

Hook responsibilities:

- `pre-commit`: run `bash scripts/check-state.sh --strict --diff=staged` and `git diff --cached --check`
- `commit-msg`: validate commit subject against current active task or approved special prefixes
- `pre-push`: run `bash scripts/check.sh`

Rules:

- hooks only block inconsistency
- hooks do not auto-generate or auto-edit documentation
- `pre-push` is a technical gate only, not PM push confirmation

Allowed special commit prefixes:

- `state-repair:`
- `harness:`
- `audit:`

Ordinary development commits must reference a current active task ID, not a history-only task ID.

## State Repair

State Repair Mode triggers when:

- current queue and active tasks disagree
- registry paths are missing
- archive migration is partially complete
- strict state checks block normal task startup

Allowed in state repair:

- modify `docs/current/**`
- modify `docs/registry/**`
- modify necessary archive index pointers
- add minimal audit notes needed to explain the repair
- run `bash scripts/check-state.sh --repair-scope`

Forbidden in state repair:

- business code changes
- dependency or package/lockfile changes
- database, integration, auth, permissions, approval, export, batch, or production-rule work

## Archive Transactions

When archival is approved, use this order:

1. dry-run the move list
2. write archive content
3. update `TRACE_INDEX.yaml`
4. update `STORY_QUEUE.yaml`
5. update `ACTIVE_TASKS.yaml`
6. update `PROJECT_CONTEXT.md`
7. update current audit/task-log/branch-log window
8. run `bash scripts/check-state.sh`
9. run `bash scripts/check.sh`
10. commit after green verification

If any step fails, do not delete active entries and record `state_migration_blocked`.
