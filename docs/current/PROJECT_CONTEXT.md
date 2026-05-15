# Current Project Context

```yaml
current_summary:
  queue_state: idle
  active_batch_id: null
  in_progress_task: null
  ready_tasks: []
```

## Current Stage

本地验收版准备期。项目已有前端 dashboard scaffold、本地 schedule-plan MVP vertical、local FastAPI/seed contract、state-governed Lightweight Harness；当前不接数据库。

## Current Core Capabilities

- Dashboard, demand plans, schedule plans, plan detail/edit, risks, shift details, unavailability, and review navigation use local/demo data and scoped review context.
- Frontend build/check path exists through `bash scripts/check.sh`.
- Backend local unittest path exists, but production API/database integration is not in scope.
- Harness current queue, active task contract, trace index, state check, and git hooks exist.

## Current P0 Gaps

- Test-environment deployment/runbook is not yet complete.
- Core demo path still needs a short release-smoke script or documented acceptance path.
- Known issues and local acceptance evidence need a lightweight current summary before test-environment release.

## Current P1 Gaps

- Table parity is only partially migrated.
- E2E/browser route smoke coverage is still limited.
- Release readiness and requirements inventory are available only as on-demand planning references.

## Current Forbidden Items

- Do not add database connection setup, ORM, migrations, schema implementation, or production persistence config.
- Do not add real external integrations, auth, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors.
- Do not modify package or lockfiles unless a PM-confirmed dependency Gate allows it.
- Do not execute from legacy or archive queues.

## Next Recommended Task

Prioritize the smallest local acceptance/release-prep task before adding more product scope. The likely next task is a compact test-environment readiness runbook plus core demo smoke path, without database work.

## Default Execution

- Start from the six default files: `AGENTS.md`, `PROJECT_CONTEXT.md`, `STORY_QUEUE.yaml`, `ACTIVE_TASKS.yaml`, `BLOCKERS.md`, and `GATE_REGISTRY.md`.
- Use `docs/requirements-inventory.md` and `docs/roadmap.md` only for planning, inventory, next-stage selection, release preparation, or PM status/readiness questions.
- Use legacy/reference files only through `docs/registry/TRACE_INDEX.yaml` and exact sections.
- Run `bash scripts/check-state.sh --strict --diff=working` after current or registry changes.
- Run `bash scripts/check.sh` before reporting completion.
