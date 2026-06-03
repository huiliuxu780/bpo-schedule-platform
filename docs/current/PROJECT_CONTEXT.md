# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

## Active Boundary

The project has entered a PM-confirmed database Gate. Database work may continue only through small, confirmed tasks. Implemented database slices now cover import batches, master data, personnel schedules, demand forecasts, login/status logs, comparison results, review closure records, the first import-center CSV upload API vertical, master-data import application into DB003 repositories, personnel-schedule import application into DB004 repositories, demand-forecast import application into DB005 repositories, actual-log import application into DB006 repositories, local comparison calculation into DB007 repositories, review closure write API into DB008 repositories, persisted result query APIs over DB007/DB008 repositories, read-only list filters over persisted comparison runs and review cases, idempotent return behavior for duplicate comparison calculate and review closure write requests, controlled closure write for existing open review cases, master_data apply idempotent return behavior, personnel_schedule apply idempotent return behavior, demand_forecast apply idempotent return behavior, actual_logs apply idempotent return behavior, a read-only import batch application summary API, persisted import field-mapping templates, failed import row correction, a read-only import batch list/status query API, field-mapping template update/deactivate controls, read-only import apply-readiness validation, row-level required-field readiness precheck, apply-before-write readiness safety gates for all four import apply routes, local review-case smoke data preparation, review-case source result context, and import-center frontend slices for real batch/readiness viewing, CSV upload, failed-row correction, field-mapping template selection, selected-batch detail drilldown, failed-row correction result feedback, read-only template management visibility, upload-before-template fit hints, apply-before action guidance, exception-state guidance, upload result batch-entry guidance, access-batch local filtering, selected-batch review navigation, read-only application status visibility, batch-detail readability polish, data-quality-to-exception trace visibility, data-quality page hierarchy, read-only downstream result trace lists, a split batch processing detail page, true second-level data-quality batch detail navigation, single-column batch detail processing workflow, field-mapping template fit detail, apply-readiness issue grouping, downstream result drilldown, quality-to-exception reverse aggregation, read-only review conclusion preview, read-only review evidence gap drilldown, a read-only second-level review-case workspace, a read-only second-level review-case detail page, controlled review-case closure/supplement entries, and same-owner review-case detail navigation. Q127 database foundation QA closeout has verified the local migration-backed foundation.

## Default Next Step

Current story queue is empty and active tasks are empty.

`US690/IM070` completed the read-only same-owner first pending entry on the review-case workspace, then current queue returned to empty.

`US693/IM073` completed the review-case submit continuation navigation, then current queue returned to empty.

`US694/IM074` completed the review-case failed-submit retry targeting, then current queue returned to empty.

`US695/IM075` completed the review-case successful-submit current-case continuation priority, then current queue returned to empty.

`US696/IM076` completed the review-case closure-success queue handoff guidance, then current queue returned to empty.

`US697/IM077` completed the review-case continuation return-list open-status focus, then current queue returned to empty.

`US698/IM078` completed the field-mapping template maintenance detail page, then current queue returned to empty.

`US699/IM079` completed the field-mapping template creation page, then current queue returned to empty.

`US700/IM080` completed the field-mapping template upload prefill chain, then current queue returned to empty.

`US701/IM081` completed the independent CSV upload workspace, then current queue returned to empty.

`US692/IM072` completed the review-case action submit feedback, then current queue returned to empty.

`US691/IM071` completed the review-case detail processing action deck, then current queue returned to empty.

`US689/IM069` completed the read-only same-owner pending navigation on the second-level review-case detail page, then current queue returned to empty.

`US688/IM068` completed the read-only same-owner processing context on the second-level review-case detail page, then current queue returned to empty.

`US687/IM067` completed the read-only review-case owner-stage workload matrix on the second-level review-case workspace, then current queue returned to empty.

`US686/IM066` completed read-only review-case processing-stage filters on the second-level review-case workspace, then current queue returned to empty.

`US685/IM065` completed the read-only review-case processing timeline on the second-level review-case detail page, then current queue returned to empty.

`US684/IM064` completed the controlled review-case conclusion supplement write path for existing open cases and the detail-page conclusion entry, then current queue returned to empty.

`US683/IM063` completed the controlled review-case evidence supplement write path for existing open cases and the detail-page evidence entry, then current queue returned to empty.

`US682/IM062` completed the controlled review-case closure write path for existing open cases and the detail-page close entry, then current queue returned to empty.

`US681/IM061` completed the read-only evidence/conclusion chain on the review-case detail page, then current queue returned to empty.

`US680/IM060` completed read-only linked review-case positioning on the comparison-run detail page, then current queue returned to empty.

`US679/IM059` completed the read-only comparison-run detail page and frontend links from review-case source trace, then current queue returned to empty.

`US678/IM058` completed read-only review-case source trace context for calculation runs, versions, and related import batches, then current queue returned to empty.

`US677/IM057` completed read-only review-case source result context for API and detail page, then current queue returned to empty.

`US676/IM056` completed local review-case smoke data preparation for `CASE-QUERY-001` and current queue returned to empty.

`US675/IM055` completed the read-only second-level review-case detail page and current queue returned to empty.

`US674/IM054` completed the quality-issue to review-case focus links and current queue returned to empty.

`US673/IM053` completed the read-only second-level review-case workspace and current queue returned to empty.

`US672/IM052` completed the read-only review evidence gap drilldown and current queue returned to empty.

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

Recommended next product step is to continue only with small, confirmed slices that move the import/review workflow toward real production use without mixing in approval, export, batch operations, auth, permissions, automatic scheduling, production formulas, settlement rules, or charge factors.
