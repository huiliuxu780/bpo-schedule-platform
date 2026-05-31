# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

## Active Boundary

The project has entered a PM-confirmed database Gate. Database work may continue only through small, confirmed tasks. Implemented database slices now cover import batches, master data, personnel schedules, demand forecasts, login/status logs, comparison results, review closure records, the first import-center CSV upload API vertical, master-data import application into DB003 repositories, personnel-schedule import application into DB004 repositories, demand-forecast import application into DB005 repositories, actual-log import application into DB006 repositories, local comparison calculation into DB007 repositories, review closure write API into DB008 repositories, persisted result query APIs over DB007/DB008 repositories, read-only list filters over persisted comparison runs and review cases, idempotent return behavior for duplicate comparison calculate and review closure write requests, master_data apply idempotent return behavior, personnel_schedule apply idempotent return behavior, demand_forecast apply idempotent return behavior, actual_logs apply idempotent return behavior, a read-only import batch application summary API, persisted import field-mapping templates, failed import row correction, a read-only import batch list/status query API, field-mapping template update/deactivate controls, read-only import apply-readiness validation, row-level required-field readiness precheck, apply-before-write readiness safety gates for all four import apply routes, and import-center frontend slices for real batch/readiness viewing, CSV upload, failed-row correction, field-mapping template selection, selected-batch detail drilldown, failed-row correction result feedback, and read-only template management visibility. Q127 database foundation QA closeout has verified the local migration-backed foundation.

## Default Next Step

Current queue is empty after `US650/IM030`: 导入中心字段映射模板只读管理可见性.

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

- Real external data sources or integrations.
- Database QA closeout or additional persistence unless a matching task is active.
- Unconfirmed new dependencies or package/lockfile changes.
- Authentication or permission boundaries.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code, formula, settlement-rule, or charge-factor changes.
- Destructive or ambiguous Git/file operations.
- Failed final verification.

## Current Recommendation

Recommended next step is import-center readiness/action guidance or template-to-upload fit hints. Keep apply write buttons, multipart/Excel, external integrations, auth, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, and charge factors out of scope until separate tasks.
