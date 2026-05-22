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
- `scripts/check-state.sh` validates state consistency and is warning-only during the initial rollout.
- `bash scripts/check.sh` runs `check-state` and its regression tests so state drift is visible in the standard verification path without self-locking ordinary tasks.
- `H024/US065` completed the first real current-queue smoke task: a ready story and matching active task passed strict state checks before execution, then current returned to an empty active queue after completion.
- `H025/US066` added state-check coverage that rejects done history in current story/task files, keeping current limited to ready, in-progress, and blocked work.
- `H026/US067` changed standard verification to strict state checks by default, with explicit `BPO_STATE_CHECK_MODE=repair-scope` and `BPO_STATE_CHECK_MODE=warning` overrides for repair and diagnostics.
- `H027/US068` extended state checks to validate `TRACE_INDEX.yaml` current file paths and reduce duplicate registry path output.
- `H028/US069` fixed the Codex Plan boundary: the Plan panel is only a session projection and must never override Harness current/registry state.
- `F041-F059/Q014` completed a 20-task local frontend parity block across schedule plans, schedule risks, and unavailability tables, then returned current queue and active tasks to empty.
- `F061-F063/Q016` completed a production MVP contract demo slice: local contract client, model test, `/production-mvp` page, sidebar entry, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F064-F066/Q017` completed an anomaly review read-only slice: local anomaly review model, model test, `/anomaly-review` page, sidebar entry, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F067-F075/Q018` completed an import-contract drilldown and data-quality center slice: three production MVP contract drilldown pages, local data-quality model, `/data-quality`, `/data-quality/[issueId]`, sidebar entry, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F076-F084/Q019` completed a personnel timeline, demand forecast contract, and master-data relationship slice: local model tests, `/person-timeline`, `/person-timeline/[employeeId]`, `/production-mvp/demand-forecast`, `/master-data-relations`, sidebar entries, route smoke, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F085-F093/Q020` completed a shift type, import template, and anomaly source slice: local model tests, `/shift-types`, `/import-templates`, `/anomaly-review/sources`, `/anomaly-review/sources/[sourceId]`, sidebar entries, anomaly review source link, route smoke, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F094-F102/Q021` completed an import batch history, field mapping preview, and review status timeline slice: local model tests, `/import-batches`, `/import-batches/[batchId]`, `/field-mapping`, `/anomaly-review/timeline`, sidebar entries, anomaly review timeline link, route smoke, and QA closeout. It remained local/frontend only and returned current queue and active tasks to empty.
- `F216-F220/Q033` completed an import quality traceability slice: import batch details link to related data quality issues, issue details show source template, source field, original value, error code, affected objects, and impact links, and batch details show failure-row business impact summaries. It remained local/frontend only and returned current queue and active tasks to empty.
- `F221-F225/Q034` completed a master-data relationship closure slice: employee bindings show supplier, workplace, project, skills, validity, status, anomaly/data-quality references, and reverse lookup links; shift types show meal/rest windows and counting policy. It remained local/frontend only and returned current queue and active tasks to empty.
- `F226-F228/Q035` completed a supervisor exception handling read-only closure slice: fulfillment calendar exception items show handling suggestions, three-track evidence summaries, and read-only handling records. It remained local/frontend only and returned current queue and active tasks to empty.
- `F229-F231/Q036` completed a supervisor exception handoff read-only closure slice: fulfillment calendar exception items show handling outcome categories, handoff summaries, and data-check readiness hints. It remained local/frontend only and returned current queue and active tasks to empty.
- `F232-F234/Q037` completed a data-quality repair-prep read-only slice: fulfillment calendar exception items show data-owner intervention judgment, repair preparation materials, and data-quality impact scope. It remained local/frontend only and returned current queue and active tasks to empty.
- `F235-F237/Q038` completed a supervisor follow-up summary read-only slice: fulfillment calendar exception items show supervisor follow-up status, follow-up gap lists, and group follow-up rollups. It remained local/frontend only and returned current queue and active tasks to empty.
- `F238-F240/Q039` completed a product semantic cleanup slice: visible product UI no longer exposes local-MVP wording, task IDs, read-only process labels, sidebar priority/new tags, or sample-language labels. It remained local/frontend only and returned current queue and active tasks to empty.
- `F241-F243/Q040` completed a schedule draft personnel-linkage slice: the schedule draft edit page shows personnel-level schedule linkage per 0.5h interval, including summary count, linked people count, difference, status, and linked people. It remained local/frontend only and returned current queue and active tasks to empty.
- `F244-F246/Q041` completed a schedule draft fulfillment-calendar drilldown slice: linked people in the schedule draft edit page route to the matching fulfillment calendar personal daily three-track detail with date, team, and group context preserved. It remained local/frontend only and returned current queue and active tasks to empty.
- `F247-F249/Q042` completed a personal schedule-source drillback slice: the fulfillment calendar personal daily three-track detail shows schedule draft source, plan/draft links, shift window, schedule detail ID, and related 0.5h interval count differences. It remained local/frontend only and returned current queue and active tasks to empty.
- `F250-F252/Q043` completed a supervisor resolution-draft slice: the fulfillment calendar group-day exception panel shows suggested conclusion, required evidence, communication target, owner role, next review point, and open-risk text for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F253-F255/Q044` completed a supervisor closure-checklist slice: the fulfillment calendar group-day exception panel shows a closure checklist with ready and missing material counts, item status, owner role, judgment impact, and current judgment for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F256-F258/Q045` completed a supervisor exception-queue grouping slice: the fulfillment calendar group-day exception panel groups and filters queue items by missing material, supervisor judgment, and data check, with group counts in the queue summary. It remained local/frontend only and returned current queue and active tasks to empty.
- `F259-F261/Q046` completed a personal-detail review-context slice: the fulfillment calendar personal daily three-track detail shows the selected exception review group, current judgment, and closure checklist when opened from the group-day exception queue. It remained local/frontend only and returned current queue and active tasks to empty.
- `F262-F264/Q047` completed a group review-load summary slice: the fulfillment calendar group-day exception panel shows review load, top review group, next priority item, and group-level ready/missing material counts. It remained local/frontend only and returned current queue and active tasks to empty.
- `F265-F267/Q048` completed an exception evidence to data-quality link slice: the fulfillment calendar group-day exception panel shows related data quality issues, matched records, check fields, link reasons, recommendations, and quality detail links for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F268-F270/Q049` completed an exception aging and priority escalation slice: the fulfillment calendar group-day exception panel shows waiting duration, aging level, escalation reason, escalation target, next review window, and group-level aging/escalation counts. It remained local/frontend only and returned current queue and active tasks to empty.
- `F271-F273/Q050` completed a supervisor daily workload summary slice: the fulfillment calendar group-day exception panel shows daily focus item count, high-priority count, aging/escalation pressure, busiest owner role, owner workloads, and next focus item. It remained local/frontend only and returned current queue and active tasks to empty.
- `F274-F276/Q051` completed an exception source consolidation slice: the fulfillment calendar group-day exception panel shows primary exception source, next priority source, source distribution, source impact hours, and source-level high-priority/aging/escalation counts. It remained local/frontend only and returned current queue and active tasks to empty.
- `F277-F279/Q052` completed a supervisor handoff overview slice: the fulfillment calendar group-day exception panel shows handoff item count, open question count, escalation count, top recipient, next handoff item, and recipient-level handoff distribution. It remained local/frontend only and returned current queue and active tasks to empty.
- `F280-F282/Q053` completed a team-day risk digest slice: the fulfillment calendar group-day exception panel shows day risk level, risk score, headline, primary risk, next focus item, and risk signals. It remained local/frontend only and returned current queue and active tasks to empty.
- `F283-F285/Q054` completed a supervisor exception communication context slice: the fulfillment calendar group-day exception panel shows communication audience, purpose, key messages, referenced evidence, open questions, and next conversation point for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F286-F288/Q055` completed a supervisor follow-up timeline slice: the fulfillment calendar group-day exception panel shows detection, completed follow-up, current blocker, and next review nodes for the selected exception. It remained local/frontend only and returned current queue and active tasks to empty.
- `F289-F291/Q056` completed a team-day risk trend slice: the fulfillment calendar group-day exception panel shows risk direction, highest-risk day, current-day comparison, trend points, and next focus. It remained local/frontend only and returned current queue and active tasks to empty.
- `F292-F294/Q057` completed a supervisor exception comparison slice: the fulfillment calendar group-day exception panel shows selected exception rank, priority reason, compared exception, main difference, and focus order. It remained local/frontend only and returned current queue and active tasks to empty.

## Product Direction

Near-term product work should remain inside the no-database local MVP boundary.

`docs/production-mvp-prd.md` records the product definition for the next production MVP shape. It is a planning document only: it does not seed the current queue, does not authorize implementation, and does not override No Database MVP Mode or the stop conditions in `AGENTS.md`.

Recommended order after state governance:

1. Seed the next ready story in current state before execution.
2. Continue frontend/local-contract work only when it avoids database, real integrations, auth, permissions, approval, export, batch, production formulas, settlement rules, and charge factors.
3. Continue table parity only in small display-only slices unless PM confirms a broader component-interaction Gate.

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
