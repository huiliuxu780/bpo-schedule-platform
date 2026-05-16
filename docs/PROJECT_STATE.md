# Project State

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness.

For current execution context, default next step, active queue, active tasks, and blockers, read:

- `docs/current/PROJECT_CONTEXT.md`
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`

This file is now long-term project state only. It must not maintain the ready queue or a running list of completed stories.

## Active Scope

The project contains:

- A PM-confirmed shadcn/ui-style BPO WFM dashboard scaffold.
- Local scheduling-plan MVP verticals backed by local FastAPI seed/process-memory contracts and frontend fallback contracts.
- No Database MVP Mode.
- Local detail drilldowns for scheduling risks and unavailability impact.
- Display-only TanStack Table parity slices across the current schedule-plan, demand-plan, shift-detail, risk, and unavailability views.
- Dashboard anomaly detail table parity, including local TanStack Table sorting, filtering, pagination, column visibility, and page-size controls.
- Dashboard local operational polish for anomaly filters, data sync status table parity, and heatmap deficit summaries.
- A documentation-first Lightweight Harness with current/registry state governance.
- Sidebar navigation now distinguishes opened modules from planned modules: unopened entries are marked `开发中` instead of linking to dashboard placeholders.
- Local imported staff/status/login/schedule-plan rows are exposed as processed records and consumed by existing dashboard, schedule plans, shift-details, schedule-risks, unavailability, fulfillment monitoring, agent status trace, fulfillment exceptions, exception review, adherence monitoring, data quality, CORN status log, field mapping, organization people, today fulfillment, anomaly alerts, vendor management, rule configuration, and monthly settlement module pages.

The project does not contain:

- Real external API integration.
- Database persistence or production persistence setup.
- Authentication or production permission boundaries.
- Real Excel import or real CORN integration.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code finalization, formulas, settlement rules, or charge factors.

## No Database MVP Mode

PM confirmed on 2026-05-12 that the project should not connect a database before the local MVP feature chain is developed and verified, because there is currently no database environment.

Allowed local MVP data modes:

- Local FastAPI endpoints backed by seed data or process memory.
- Frontend API-client fallback data that matches the same contract.
- Read-only or draft-only local verification flows.
- Documentation and audit records that keep database work out of scope.

Hard stop until a later PM-confirmed Gate:

- Database connection setup.
- ORM models, repositories, or adapters.
- Migration files.
- Schema implementation as engineering work.
- Production persistence configuration.
- Real external data-source integration.

## State Governance Direction

The project now uses a current/registry/archive state model:

- `docs/current/**` is the default execution state.
- `docs/registry/**` is the lookup layer.
- Legacy and future archive files are historical sources, not execution queues.

Detailed rules live in `docs/quality/STATE_MANAGEMENT.md`.

Current invariants:

- Story Runner starts from `docs/current/STORY_QUEUE.yaml`.
- Active task scope comes from `docs/current/ACTIVE_TASKS.yaml`.
- `docs/registry/TRACE_INDEX.yaml` stores IDs, paths, and relationships only; it must not store status.
- Archive files are not executable.
- The main Worker is the single writer for `docs/current/**` and `docs/registry/**`.
- `scripts/check-state.sh` validates current status enums, active-task minimum contract fields, gate existence, registry path/budget rules, archive non-executable rules, and active diff scope while work is in progress.
- `bash scripts/check.sh` runs strict state checks and the state-check regression suite by default; if strict fails, only `state-repair` work may proceed until state is green again.
- `H024/US065` completed the first real current-queue smoke task: a ready story and matching active task passed strict state checks before execution, then current returned to an empty active queue after completion.
- `H025/US066` added state-check coverage that rejects done history in current story/task files, keeping current limited to ready, in-progress, and blocked work.
- `H026/US067` changed standard verification to strict state checks by default, with explicit `BPO_STATE_CHECK_MODE=repair-scope` and `BPO_STATE_CHECK_MODE=warning` overrides for repair and diagnostics.
- `H027/US068` extended state checks to validate `TRACE_INDEX.yaml` current file paths and reduce duplicate registry path output.
- `H028/US069` fixed the Codex Plan boundary: the Plan panel is only a session projection and must never override Harness current/registry state.
- `H029/US103` closed the current-state governance loop: `AGENTS.md`, `GATE_REGISTRY.md`, `PROJECT_CONTEXT.md`, and `lightweight-harness.md` now align on the current-layer read set, `ACTIVE_TASKS.yaml` is explicitly a lightweight execution contract, and strict failure now forces `state-repair`.
- `F041-F059/Q014` completed a 20-task local frontend parity block across schedule plans, schedule risks, and unavailability tables, then returned current queue and active tasks to empty.
- `F060/US104` added a dedicated `/schedule-risks` workbench route, aligned sidebar and cross-page risk links, and kept the whole workflow inside the local no-database contract.
- `Q015/US105` closed QA on the risk workbench chain, verified the cross-page drilldown loop on a local server, and returned current queue and active tasks to empty.
- `F061-F064/Q016` deepened the risk review chain with scoped drilldown filters, a wide-screen right rail on `/schedule-risks`, and aligned context links across plan, risk, shift, and unavailability pages, then returned current queue and active tasks to empty.
- `F065-F068/Q017` extended the review chain again: `班次明细` and `不可用管理` now have wide-screen right-side review rails, plan interval rows can continue into scoped risk/shift/unavailability views, unavailability-impact risk rows can continue into risk/shift/plan views, and current queue returned to empty after QA closeout.
- `F069-F072/Q018` completed the next review slice: `排班计划详情`、`风险明细`、`不可用影响定位` 三个 detail 页 now have wide-screen right-side review rails, and the detail-level review actions continue to share the same local navigation helper, then current queue returned to empty after QA closeout.
- `H030/US121` aligned Harness rule sources and hook guardrails on top of the active product branch: SoT priority now points at `ACTIVE_TASKS/STORY_QUEUE/BLOCKERS`, `check-state` validates diff mode, batch, branch, acceptance_ref, and closeout transitions, repo-local hooks are installed, and `check.sh` clears stale `.next` route types before plain typecheck.
- `H031/US122` closed the remaining registry budget warning: `TRACE_INDEX` was compacted back under budget, registry windowing rules now require compaction before archive migration, and strict state check returns to green without registry warnings.
- `H032/US123` closed the remaining post-closeout traceability gap: branch-log-only commit-SHA backfills can now pass strict staged state checks after current returns to empty, while other no-active-task diffs still fail; recent missing branch-log commit SHAs were backfilled.
- `H033/US125` closed the startup-state self-lock: a new product batch can now seed limited current/registry startup diff and pass strict state checks before business code starts, without reopening current/registry writes for ordinary product edits.
- `H034/US126` closed the last product closeout self-lock: same-commit product closeout now passes both strict state checks and commit-message validation, so a verified frontend batch can return current to empty and still commit with its active task id.
- `F073-F076/Q019/US124` replaced duplicated right-side review cards across risk/plan/shift/unavailability pages with one shared `ReviewChecklistRail`, keeping summary metrics, current/next steps, scoped actions, and stable back links aligned while staying inside the no-database local review workflow.
- `F077-F079/Q020/US127` completed the next review slice: risk, unavailability, and related-risk drilldown tables now preserve scoped detail URLs; plan/risk/unavailability detail pages use scoped back-link logic and keep related-plan navigation inside the same review context; current queue returned to empty after QA closeout.
- `F080-F082/Q021/US128` closed the remaining plan-origin gap: when review drilldown starts from plan detail, shift/risk/unavailability pages now preserve `schedule-plans` as the source page and return to the current plan detail instead of broad lists; current queue returned to empty after QA closeout.
- `F083-F084/Q022/US129` closed the last plan-origin row-action gap: plan-detail interval-table actions now preserve `schedule-plans`, and shift-details table actions now use review helpers instead of raw hrefs so row-level drilldown keeps the same plan-origin context; current queue returned to empty after QA closeout.
- `F085/Q023/US130` closed the remaining scoped plan-link gap inside the unavailability impact shift table: impacted-shift row actions now preserve the same unavailability review source and scope instead of dropping to a bare plan detail route; current queue returned to empty after QA closeout.
- `F086-F087/Q024/US131` closed the remaining risk-detail auxiliary-table gap: related shift and unavailability tables inside risk detail now expose scoped continuation actions so continuation drilldown can keep moving inside the same local review context; current queue returned to empty after QA closeout.
- `F088-F089/Q025/US132` closed the remaining review list row-action parity gap: risk and unavailability list rows now expose the same local continuation surface as the surrounding review rail, so users can keep drilling down without detouring through broader pages first; current queue returned to empty after QA closeout.
- `F090-F091/Q026/US133` closed the remaining schedule-plan list parity gap: plan list rows now expose direct continuation actions into risk, shift, and unavailability drilldown, so the plan list can also serve as a stable local review-chain entry point; current queue returned to empty after QA closeout.
- `F092-F093/Q027/US134` closed the remaining schedule-plan draft workflow context gap: plan-list `new` and plan-detail `edit` now preserve list filters, source page, cancel/back actions, and post-submit return targets, so draft work no longer breaks the local review chain; current queue returned to empty after QA closeout.
- `F094-F095/Q028/US135` closed the remaining schedule-plan draft failure-feedback gap: when local draft create/save fails and redirects back with `draft=failed`, the plan list and plan detail now surface visible feedback instead of leaving the signal hidden in the URL; current queue returned to empty after QA closeout.
- `F096-F097/Q029/US136` closed the remaining schedule-plan draft success-feedback gap: when local draft create/save succeeds, plan detail now surfaces visible created/updated feedback instead of relying on route change alone; current queue returned to empty after QA closeout.
- `F098-F099/Q030/US137` closed the remaining schedule-plan list detail-context gap: the plan-list `查看` action now preserves `query`、`status` and `from=schedule-plans`, so users can return from detail to the same filtered list instead of falling back to a bare list route; current queue returned to empty after QA closeout.
- `F100-F101/Q031/US138` closed the remaining schedule-plan list-origin review return gap: plan-list `风险 / 班次 / 不可用` actions now preserve `query`、`status` and a distinct `schedule-plans-list` source, so the destination pages return to the same filtered plan list instead of behaving like plan-detail-origin drilldown; current queue returned to empty after QA closeout.
- `F102-F103/Q032/US139` closed the remaining schedule-plan risk-entry context gap: the schedule-plans risk summary entry and embedded risk preview table now preserve `schedule-plans-list`、`query` and `status`, so the risk workbench and downstream continuation actions return to the same filtered plan list instead of dropping into a generic risk route; current queue returned to empty after QA closeout.
- `F104-F105/Q033/US140` closed the remaining schedule-plans summary CTA context gap: the local MVP flow summary on the schedule-plans page now uses helper-driven cross-page links instead of hardcoded routes, and risk/unavailability/shift summary CTA now preserve `schedule-plans-list`、`query` and `status`, so summary-level drilldown stays inside the same filtered review context; current queue returned to empty after QA closeout.
- `F106-F107/Q034/US141` closed the remaining risk-workbench CTA context gap that still affected the schedule-plans review chain: the risk-workbench header `不可用管理` action now preserves active review context instead of using a bare route, and the no-source default back-link fallback now stays inside the risk workbench instead of misrouting to schedule-plans; current queue returned to empty after QA closeout.
- `F108/Q035/US142` closed the remaining demand-plan to schedule-plan CTA gap: the demand-plans page header CTA now preserves the current demand query before entering schedule-plans, so users do not lose the active demand filter at the handoff into the schedule review flow; current queue returned to empty after QA closeout.
- `F109/Q036/US143` closed the remaining risk-workbench clear-scope CTA gap: when the risk workbench clears plan/date/site drilldown, it now preserves the active query/status context instead of dropping back to a completely bare risk page; current queue returned to empty after QA closeout.
- `F110-F111/Q037/US144` closed the remaining clear CTA context gaps on `shift-details` and `unavailability`: scoped clear actions now drop only drilldown parameters, while list-level clear actions reset local filters without dropping the active review source; current queue returned to empty after QA closeout.
- `F112/Q038/US145` closed the remaining schedule-plans draft feedback context gap: list-level search, status switching, and clear-filter actions now preserve local draft feedback until the user leaves the page; current queue returned to empty after QA closeout.
- `F113/Q039/US146` closed the remaining schedule-plans same-page dismiss gap: the local draft failure banner now exposes a `关闭` action that removes only `draft` and preserves the active query/status list context; current queue returned to empty after QA closeout.
- `F114/Q040/US147` closed the remaining demand-plans clear CTA consistency gap: the local `清空` action now routes through `buildDemandPlansHref()` instead of a bare `/demand-plans` link; current queue returned to empty after QA closeout.
- `F115/Q041/US148-US149` closed the local P1 E2E reinforcement slice: core smoke now covers filtered schedule-plan list table controls, draft detail entry, draft edit route, and cancel/back context; current queue returned to empty after QA closeout.
- `B008/F116/Q042/US150-US152` closed the localhost-only demo import and placeholder cleanup slice: staff master/status/login CSV import now has a local entry point and batch status, visible sidebar/data-source/action placeholders route to explainable local demo surfaces, and current queue returned to empty after QA closeout.
- `F117/Q043/US153-US154` closed the local dashboard KPI filter slice: dashboard top filters now preserve demo context through query params, imported demo batches drive a local KPI preview, and current queue returned to empty after QA closeout.
- `F118/Q044/US155-US157` closed the navigation truthfulness slice: unopened sidebar modules now show `开发中` and cannot silently route to dashboard placeholders, while opened modules remain navigable.
- `B009/Q045/US158-US160` closed the processed records handoff slice: local imported staff/status/login rows are exposed through a localhost-only API and consumed by dashboard and shift-details.
- `F119/Q046/US161-US163` extended processed records consumption into risk and unavailability pages: schedule-risks and unavailability now show records summaries after local import, and current queue returned to empty after QA closeout.
- `F120/Q047/US164-US166` opened the first fulfillment monitoring slice: `工时核验` now links to `/fulfillment-monitoring`, which reads local status/login records and shows履约核验 coverage without production formulas; current queue returned to empty after QA closeout.
- `F121/Q048/US167-US169` opened the坐席状态轨迹 slice: `坐席状态轨迹` now links to `/agent-status-trace`, which reads local status_log records and shows状态覆盖、状态分布和样本轨迹 without realtime streams or production adherence formulas; current queue returned to empty after QA closeout.
- `F122/Q049/US170-US172` opened the异常管理 slice: `异常管理` now links to `/fulfillment-exceptions`, which reads local status/login records and shows本机异常线索 without realtime streams, production exception rules, or adherence formulas; current queue returned to empty after QA closeout.
- `F123/Q050/US173-US175` opened the异常复核 slice: `异常复核` now links to `/exception-review`, which reads local status/login records and shows a read-only review queue without approval actions, status writeback, realtime streams, production exception rules, or adherence formulas; current queue returned to empty after QA closeout.
- `F124/Q051/US176-US178` opened the实时遵守率 slice: `实时遵守率` now links to `/adherence-monitoring`, which reads local status/login records and shows本机遵守率预览 without realtime streams, production adherence formulas, status-code finalization, status writeback, database, or real integrations; current queue returned to empty after QA closeout.
- `F125/Q052/US179-US181` opened the数据质量 slice: `数据质量` now links to `/data-quality`, which reads local staff/status/login records and shows本机质量预览 without production data-quality rules, auto-fix, field-mapping writeback, database, or real integrations; current queue returned to empty after QA closeout.
- `F126/Q053/US182-US184` opened theCORN 状态日志 slice: `CORN 状态日志` now links to `/corn-status-log`, which reads local status_log records and shows本机状态日志覆盖、状态分布和样本 without real CORN integration, realtime streams, production status-code finalization, status writeback, database, or real interface checks; current queue returned to empty after QA closeout.
- `F127/Q054/US185-US187` opened the字段映射 slice: `字段映射` now links to `/field-mapping`, which reads local staff/status/login sample fields and shows本机字段覆盖、缺失字段和额外字段 without field-mapping writeback, saved config, real interface checks, cross-system reconciliation, database, or real integrations; current queue returned to empty after QA closeout.
- `F128/Q055/US188-US190` opened the组织与人员 slice: `组织与人员` now links to `/organization-people`, which reads local staff_master records and shows人员样本、团队/职场/供应商分布 without account login, permission management, organization maintenance, staff writeback, database, real integrations, or production audit; current queue returned to empty after QA closeout.
- `F129/Q056/US191-US196` opened the运营工作台与系统管理预览 slice: `今日履约`、`异常预警`、`时段缺口热力图`、`供应商管理` and `规则配置` now link to local read-only pages that consume existing processed records or dashboard seed data without backend contract changes, database, real integrations, auth/permission, approval/export/batch, supplier writeback, rule publishing, settlement, production formulas, or charge factors; current queue returned to empty after QA closeout.
- `F130/Q057/US197-US198` opened the排班数据导入 slice: `schedule_plan` CSV can be imported through the localhost demo import contract and `/schedule-plans` now reads schedule_plan processed records to show排班数据 records、计划样本、时段行 and samples without writing production schedule lists, automatic scheduling, database, real integrations, approval/export/batch, settlement, production formulas, or charge factors; current queue returned to empty after QA closeout.
- `F131/Q058/US199-US200` opened the月度结算只读复盘 slice: `结算复盘 > 月度结算` now links to `/monthly-settlement`, which reads local processed records to show结算复盘 records、主数据/履约/排班复盘信号 and samples without settlement formulas, charge factors, bill amount, lock, approval, export, batch, database, or real integrations; current queue returned to empty after QA closeout.
- `F132-F133/Q059/US201-US203` opened the报表中心与供应商复盘只读汇总 slice: `结算复盘 > 报表中心` and `结算复盘 > 供应商复盘` now link to `/report-center` and `/supplier-review`, which read local processed records to show report/vendor review records, imported-source coverage, module outcomes, supplier coverage, fulfillment coverage, and schedule coverage without production report generation, export, settlement formulas, charge factors, bill amount, lock, approval, batch, database, real integrations, or supplier writeback; current queue returned to empty after QA closeout.

## Product Direction

Near-term product work should remain inside the no-database local MVP boundary.

PM clarified on 2026-05-16 that the demo should be based on existing product modules, not a separate demo center. The operating product loop is:

```txt
import local CSV -> backend validates and normalizes -> local process-memory store -> existing module APIs/pages read the result -> dashboard/scheduling/monitoring pages show business outcomes
```

Recommended order after F132-F133/Q059:

1. **继续补齐未开放入口:** keep unopened modules clearly marked `开发中`, and only open them when they can read local imported records or existing seed outcomes.
2. **Draft edit and review depth:** continue dynamic interval editing, review feedback, and submit/review preparation only as local MVP flows, without approval or production workflow capability.
3. **本机验收广度补强:** extend route smoke and table parity only for opened modules, prioritizing paths that PM will use in local demos.

Temporarily not recommended: database setup, real CORN/HR/WFM integrations, auth/permissions, approval, export, batch operations, automatic scheduling, production KPI formulas, settlement rules, and charge factors. These still require separate PM-confirmed Gates.

## Frontend Direction

Future frontend work is constrained to a professional shadcn/ui-based B2B SaaS admin console for BPO Workforce Management / BPO 人力计划与履约管理平台.

The frontend baseline is shadcn/ui v4 dashboard examples, dashboard-01 block, New York style, semantic theme tokens, dark/light theme behavior, and the project frontend rules in `docs/quality/FRONTEND_RULES.md`.

This direction is a rule for confirmed frontend tasks; it does not authorize new frontend implementation, dependency installation, package changes, mock data, or business code outside a confirmed Gate.

## Lightweight Harness Direction

The Harness flow is:

```txt
raw requirement -> user story -> current story queue -> active task -> Gate Plan -> branch -> scoped execution -> state check -> final check -> traceability/audit -> local commit -> Done Report -> PM push decision when applicable
```

Key documents:

- `AGENTS.md`
- `docs/quality/STATE_MANAGEMENT.md`
- `docs/quality/GATE_REGISTRY.md`
- `docs/quality/GIT_BRANCH_WORKFLOW.md`
- `docs/harness/lightweight-harness.md`
- `docs/quality/FRONTEND_RULES.md`
- `docs/quality/DONE_REPORT_TEMPLATE.md`

## Runtime Environment

The project uses Node.js 22 for frontend development and delivery verification. `scripts/check.sh` and `npm run dev` use guarded runtime paths to avoid the local Node.js 24 native addon issue previously observed with Next.js/lightningcss on macOS.

The project uses Python 3.12 for backend development and verification. `scripts/verify-backend-runtime.sh` validates the backend interpreter and required modules.

Runtime files:

- `.nvmrc`
- `.node-version`
- `.python-version`
- `docs/dev/setup.md`
- `scripts/verify-frontend-native-runtime.mjs`
- `scripts/verify-backend-runtime.sh`

## Archive Boundary

The previous project workspace is archived outside this clean root:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

That archive is reference material only. Do not import from it, wire it into build/lint/check flows, or copy large modules into active source without a confirmed migration task.
