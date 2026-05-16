# Current Project Context

```yaml
current_summary:
  queue_state: active
  active_batch_id: null
  in_progress_task: F134
  ready_tasks: [F135, Q060]
```

## Current Stage

本地验收候选版。项目已有前端 dashboard scaffold、本地 schedule-plan MVP vertical、local FastAPI/seed contract、demo startup、core E2E baseline、本地验收 runbook、state-governed Lightweight Harness；当前不接数据库。

## Current Core Capabilities

- Dashboard, demand plans, schedule plans, plan detail/edit, risks, shift details, unavailability, fulfillment monitoring, agent status trace, fulfillment exceptions, exception review, adherence monitoring, data quality, CORN status log, field mapping, organization people, today fulfillment, anomaly alerts, deficit heatmap, vendor management, rule configuration, monthly settlement, report center, supplier review, and review navigation use local/demo data and scoped review context.
- Frontend build/check path exists through `bash scripts/check.sh`.
- Backend local unittest path exists, and localhost-only demo import endpoints exist for staff master, staff status, login, and schedule-plan CSV data; production API/database integration is not in scope.
- Imported demo rows are exposed through localhost-only processed records and are now consumed by dashboard, schedule plans, shift-details, schedule-risks, unavailability, fulfillment monitoring, agent status trace, fulfillment exceptions, exception review, adherence monitoring, data quality, CORN status log, field mapping, organization people, today fulfillment, anomaly alerts, vendor management, rule configuration, monthly settlement, report center, and supplier review for module-level demo summaries.
- Harness current queue, active task contract, trace index, state check, and git hooks exist.

## Current P0 Gaps

- Cloud test-environment platform, remote URLs, and remote environment variables are not configured.
- Remote health/smoke/E2E have not been verified because no cloud environment exists.

## Current P1 Gaps

- Table parity is only partially migrated.
- E2E/browser route smoke coverage is still limited.
- Table parity is still partial and should be handled only after local acceptance or explicit PM priority.
- Dashboard top-level filters and imported-data KPI preview are local-demo capable; production KPI formulas remain deferred.
- Release readiness and requirements inventory remain on-demand planning references.

## Current Forbidden Items

- Do not add database connection setup, ORM, migrations, schema implementation, or production persistence config.
- Do not add real external integrations, auth, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors.
- Do not modify package or lockfiles unless a PM-confirmed dependency Gate allows it.
- Do not execute from legacy or archive queues.

## Next Recommended Task

Next recommended task should be chosen from local acceptance priorities after PM review. Keep it local-only unless a new Gate explicitly allows cloud, database, real integration, package/lockfile, auth, approval, export, batch, or production formula work.

## Default Execution

- Start from the six default files: `AGENTS.md`, `PROJECT_CONTEXT.md`, `STORY_QUEUE.yaml`, `ACTIVE_TASKS.yaml`, `BLOCKERS.md`, and `GATE_REGISTRY.md`.
- Use `docs/requirements-inventory.md` and `docs/roadmap.md` only for planning, inventory, next-stage selection, release preparation, or PM status/readiness questions.
- Use legacy/reference files only through `docs/registry/TRACE_INDEX.yaml` and exact sections.
- Run `bash scripts/check-state.sh --strict --diff=working` after current or registry changes.
- Run `bash scripts/check.sh` before reporting completion.
