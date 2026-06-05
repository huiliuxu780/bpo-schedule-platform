# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

## Active Boundary

The project has entered a PM-confirmed database Gate. Database work may continue only through small, confirmed tasks. Implemented database slices now cover import batches, master data, personnel schedules, demand forecasts, login/status logs, comparison results, review closure records, the first import-center CSV upload API vertical, master-data import application into DB003 repositories, personnel-schedule import application into DB004 repositories, demand-forecast import application into DB005 repositories, actual-log import application into DB006 repositories, comparison calculation into DB007 repositories, review closure write API into DB008 repositories, persisted result query APIs over DB007/DB008 repositories, read-only list filters over persisted comparison runs and review cases, idempotent return behavior for duplicate comparison calculate and review closure write requests, controlled closure write for existing open review cases, master_data apply idempotent return behavior, personnel_schedule apply idempotent return behavior, demand_forecast apply idempotent return behavior, actual_logs apply idempotent return behavior, a read-only import batch application summary API, persisted import field-mapping templates, failed import row correction, a read-only import batch list/status query API, field-mapping template update/deactivate controls, read-only import apply-readiness validation, row-level required-field readiness precheck, apply-before-write readiness safety gates for all four import apply routes, local review-case smoke data preparation, review-case source result context, and import-center frontend slices for real batch/readiness viewing, CSV upload, failed-row correction, field-mapping template selection, selected-batch detail drilldown, failed-row correction result feedback, read-only template management visibility, upload-before-template fit hints, apply-before action guidance, exception-state guidance, upload result batch-entry guidance, access-batch local filtering, selected-batch review navigation, read-only application status visibility, batch-detail readability polish, data-quality-to-exception trace visibility, data-quality page hierarchy, read-only downstream result trace lists, a split batch processing detail page, true second-level data-quality batch detail navigation, single-column batch detail processing workflow, field-mapping template fit detail, apply-readiness issue grouping, downstream result drilldown, quality-to-exception reverse aggregation, read-only review conclusion preview, read-only review evidence gap drilldown, a read-only second-level review-case workspace, a read-only second-level review-case detail page, controlled review-case closure/supplement entries, and same-owner review-case detail navigation. Q127 database foundation QA closeout has verified the local migration-backed foundation.

## Default Next Step

Current queue is empty after `US745/IM125`. Production-detail `status=applied` links now land on ready business-version rows, login/status log versions stay connected to schedule-vs-actual result links, and comparison-run, review-case, actual-log, personnel-schedule, and demand-forecast production details now use tabbed workspaces instead of long stacked pages.

The master-data chain now routes `/master-data` to `/master-data/agents`; agents keep single-person create/edit/skills child pages and a freeze dialog, while workplaces, suppliers, projects, skills, and binding relationships are direct list pages until their own child-page tasks are confirmed. Permissions, approval, export, batch operations, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors remain out of scope.

`US703/IM083` completed the single-batch import apply entry on the second-level batch detail page, then the next chain was reseeded from empty current state with `US704/IM084` only.

`US704/IM084` completed the applied-result visibility slice on the second-level batch detail page. The page now shows an applied result card with target/version-state metrics and next-step links, then current state advanced to `US705/IM085` only.

`US705/IM085` completed the applied-version positioning slice on the second-level batch detail page. The page now resolves direct version-result context from an applied batch, upgrades supported result-card entries to corresponding comparison-run detail links, and adds a version-context section inside result trace; unsupported or incomplete version cases stay in explicit empty/blocked state. Current state then advanced to `US706/IM086` only.

`US706/IM086` completed the comparison-trigger slice on the second-level batch detail page. The result-trace version-context section now shows a gated `发起一次比对` entry only when comparison type and source versions are clear from the positioned result context, keeps unsupported or incomplete cases blocked without a write button, and returns success/failure feedback plus new-run/result-list links back into the same version-result context. Current queue then returned to empty.

`US707/IM087` started the next chain from that empty state and is now complete. The first slice adds `/data-quality/versions` as a read-only version ledger page under the existing import-center path. It stays frontend-only, reuses current import-batch list data, and does not add backend APIs, schema or migration changes, dependencies, approval, export, batch operations, permissions, automatic scheduling, production formulas, settlement, or charge factors.

`US708/IM088` completed the second slice on the same route. Version ledger rows now keep `查看批次详情` as the primary entry and add a stable second-step link when the applied-version context is clear: supported rows resolve directly to the matched comparison run detail, while other applied rows fall back to the existing result-trace page. Rows without enough context or without an applied version remain blocked without misleading deep links.

`US709/IM089` completed the third slice on the same route. Version ledger rows now expose read-only downstream impact summaries for comparison runs and review cases when the current version can be matched, and they keep explicit blocked/empty explanations for no-batch, not-applied, missing-version, or no-direct-chain cases. Current queue returned to empty after this slice.

After that empty-state checkpoint, the next chain was reseeded for comparison-result callback closure. `US710/IM090` completed the first slice: keep the main entry inside the current batch `结果追踪` context, and add a latest-run callback card after comparison success before the user moves into the full `comparison run detail` page. Current state then advanced to `US711/IM091`.

`US711/IM091` completed the second slice on the existing `comparison run detail` page. The page now clearly identifies itself as the current version context's full result-review homepage, shows source versions, business date range, and read-only review guidance above the existing run source/result detail sections. Current state then advanced to `US712/IM092`.

`US712/IM092` completed the third slice on the same `comparison run detail` page. The page now tries to resolve source import batches from existing applied import-version data, shows stable return entries back to source batch result trace and the version workbench when defensible, and shows an explicit blocked state when source batches cannot be matched. Current queue returned to empty.

After that empty-state checkpoint, the next chain was reseeded for calculation-trigger entry and result review. `US713/IM093` completed the first slice by adding local-comparison candidate entries on the business version workbench, including explicit blocked states for unsupported, unapplied, or incomplete source-version cases. `US714/IM094` then added a submit form for complete version pairs and returns success/failure feedback to the same workbench. `US715/IM095` added result-review feedback with matched-run metrics and no-fabrication blocked state when a submitted run is not yet visible. Current queue returned to empty.

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

`US702/IM082` completed independent upload result return guidance, then current queue returned to empty.

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

`US721/IM101` completed the personnel-schedule publish/freeze boundary safety shell. `/schedule-plans/production/[batchId]` now shows disabled publish, freeze, and unpublish action cards with source-version, 0.5h expansion, reference-check, and failure-boundary context.

`US725/IM105` completed the login/status-log production workbench under Data & Integration. `/actual-logs/production` now shows login/status source batches, actual-log business versions, business dates, timezone and cross-day boundaries, and read-only production constraints.

`US726/IM106` completed the single-batch login/status-log processing explanation detail. `/actual-logs/production/[batchId]` now shows source batch/version context, business-day ownership, Asia/Shanghai timezone checks, cross-day split explanation, status dictionary rows, status interval rows, login-event rows, and explicit no-detail empty states without fabricating events or intervals.

`US727/IM107` completed the status-dictionary and exception-explanation safety shell on the same detail page. The page now explains status dictionary rows, unknown statuses, timezone errors, cross-day intervals, and frozen-employee reference boundaries with disabled action shells. Current queue returned to empty after the login/status-log production chain.

`US728/IM108` completed the master-data CRUD backend base: `/api/v1/master-data/employees/{employee_id}/maintenance` now supports single-agent create, edit, freeze, and effective-period changes without schema/migration work.

`US729/IM109` completed the agent-only frontend loop: `/master-data/agents` now shows create, edit, freeze, and effective-period submit forms backed by a server action that calls IM108 and returns success/failure feedback.

`US730/IM110` completed the broader master-data maintenance backend loop: backend APIs support workplaces, suppliers, projects, skills, and binding relationship maintenance. The later IM136 correction removed non-agent submit forms from `/master-data/sites`, `/master-data/vendors`, `/master-data/projects`, `/master-data/skills`, and `/master-data/bindings`; those routes now stay as list pages until their own child-page tasks are confirmed. Current queue returned to empty after this slice.

`US733/IM113` completed row-level reference explanations for `/schedule-plans/production/[batchId]`. Schedule detail rows now explain employee, workplace, supplier, project, skill, and shift completeness; 0.5h interval rows explain employee, workplace, supplier, project, and skill completeness. Schema/migration, publish/freeze writes, approval, export, batch operations, permissions, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors remain out of scope.
`US734/IM114` completed the read-only demand-forecast production detail API. It returns source batch context, forecast version, 0.5h forecast intervals, and version change records from existing repositories without frontend wiring or production writes.
`US743/IM123` completed actual-log processing detail workspace organization. The detail page now exposes `总览`, `时区与业务日`, `字典与异常`, `逐行明细`, and `处理说明` tabs so timezone, cross-day, dictionary, exception, row, and boundary content no longer stack into one long page; backend writes, schema, migration, dependency, approval, export, batch, permission, automatic scheduling, formula, settlement, and charge-factor scope remain excluded.

`US750/IM130` corrected visible product structure: 经营总览不再挂载数据接入状态面板，侧边栏不再暴露占位 dashboard 链接或暂缓的权限、结算、接口集成、自动排班入口。`US751/IM131` completed the personnel master-data model base: organizations support hierarchy/path, employees support type plus organization/workplace links, skills support category, and employee multi-skill rows are persisted/importable。`US752/IM132` completed the real personnel list loop: `/api/v1/master-data/employees` returns employee rows with organization/workplace/skill context, and `/master-data/agents` is now a customer-service personnel management list. `US753/IM133` completed the single-agent core edit loop: create/edit forms submit employee type, organization ID, and workplace ID to the single-employee maintenance API. `US754/IM134` completed single-agent skill-set replace maintenance: create/edit/skill maintenance use separate personnel subpages, freeze uses a modal, and the list stays focused on table management. `US755/IM135` polished agent-list UI details. IM136 corrected business-first navigation, split non-agent master-data routes into list pages only, removed stale data-ingestion/CORN/task-code/operator-default/center-first copy residue, masked task-code batch labels in visible UI, and changed upload feedback away from center-first batch wording. IM137 keeps `/master-data/skills` readable against older local SQLite data and masks task-code/smoke identifiers. IM138 removes project as a master-data product object, adds `/master-data/organizations` as a read-only organization list, and hides the legacy project dimension from binding UI while keeping compatibility fields out of scope for deletion. Approval, export, batch operation, permission, automatic scheduling, formula, settlement, and charge-factor scope remain excluded.
