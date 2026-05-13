# Current Project Context

```yaml
current_summary:
  queue_state: idle
  active_batch_id: null
  in_progress_task: null
  ready_tasks: []
```

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness.

## Active Boundary

The project is in No Database MVP Mode. Product work may continue only through confirmed local frontend stories, local FastAPI seed/process-memory contracts, and verification tasks. The project must not connect or prepare a production database before PM confirms a later database Gate and provides an environment.

## Default Next Step

No ready story is currently queued. The latest completed governance task was `US122/H031` on branch `codex/h031-risk-governance-reconcile`. It pulled `TRACE_INDEX` back under budget and codified the registry slimming rule without broad archive migration.

The latest completed governance pass was `US121/H030` on branch `codex/h030-harness-hook-guard`, which aligned the Harness rule sources, tightened the active-task contract, expanded `check-state`, added repo-local hooks, and made standard verification resilient to stale `.next` route typings across branches.

The H024 current-queue smoke task proved that a ready story plus matching active task can pass strict state checks before execution; after completion, current queue returned to empty so done history does not accumulate here.

The H025 invariant pass added strict checks and regression tests that reject `status: done` inside current story/task files.

The H026 rollout changed `bash scripts/check.sh` to use strict state checks by default. State Repair Mode can run `BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh`; temporary warning-only diagnostics can run `BPO_STATE_CHECK_MODE=warning bash scripts/check.sh`.

The H027 registry pass added strict validation for `TRACE_INDEX.yaml` current file paths and de-duplicated registry path output.

The H028 plan-boundary pass made Codex Plan a temporary projection only. Harness current and registry files remain the state source.

The F030-F031/Q012 product pass proved the current/active state model can drive a frontend table parity chain and return current to empty after completion.

The F032-F040/Q013 product pass proved the same model can run a 10-task frontend chain and return current to empty after completion.

The F041-F059/Q014 product pass proved the same model can run a 20-task frontend chain and return current to empty after completion.

## Current Execution Rules

- Read current files by default, not historical archive files.
- Treat `docs/current/**` as the execution queue source.
- Treat `docs/registry/**` as lookup indexes only.
- Do not execute from archive files.
- Keep subagents read-only for `docs/current/**` and `docs/registry/**`; the main Worker is the single writer.
- Keep old large files as historical sources during the transition.
- Run `bash scripts/check-state.sh` for state changes.
- `bash scripts/check.sh` runs strict state checks by default.
- Run `bash scripts/check.sh` before reporting a task complete.

## Current Stop Conditions

- New dependencies or package/lockfile changes.
- Real external data sources or integrations.
- Database connection setup, ORM, migrations, schema implementation, or production persistence config.
- Authentication or permission boundaries.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code, formula, settlement-rule, or charge-factor changes.
- Destructive or ambiguous Git/file operations.
- Failed final verification.

## Current Recommendation

Current has returned to empty again. Seed the next ready story explicitly before resuming product development. Database work stays deferred.
