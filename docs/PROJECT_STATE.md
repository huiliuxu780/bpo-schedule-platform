# Project State

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical.

## Active Scope

The project now contains a PM-confirmed frontend dashboard scaffold and the first local scheduling-plan MVP vertical. The active implementation scope includes the shadcn/ui-style dashboard shell, local mock data, dark / light theme support, BPO WFM navigation/content replacement, and a minimal Python + FastAPI read/draft API for local schedule-plan verification.

The project still does not contain real external API integration, database persistence, authentication, real Excel import, real CORN integration, production permissions, approval flows, export pipelines, batch operations, production scheduling algorithms, production status-code finalization, settlement formulas, or charge factors.

## No Database MVP Mode

PM confirmed on 2026-05-12 that the project should not connect a database before the local MVP feature chain is developed and verified, because there is currently no database environment.

Current allowed local-MVP data modes:

- local FastAPI endpoints backed by seed data or process memory
- frontend API-client fallback data that matches the same contract
- read-only or draft-only local verification flows
- documentation and audit records that keep database work out of scope

Hard stop until a later PM-confirmed Gate:

- database connection setup
- ORM models or adapters
- migration files
- schema design as implementation work
- production persistence configuration
- real external data source integration

This mode does not block continued frontend/business-chain development when the story can reuse existing local contracts. It does block any attempt to turn the MVP into a database-backed system before PM confirms the database plan and environment.

## MVP Build Direction

The first formal MVP vertical is now defined as scheduling plan read-only delivery:

- 排班计划列表
- 排班计划详情
- Python + FastAPI read-only API
- local seed data
- frontend API client
- delivery verification

The first implementation tasks are `B001` for the FastAPI read-only backend, `F005` for the frontend schedule plan list/detail, and `Q001` for vertical acceptance.

The first vertical intentionally excludes create/edit/publish workflow, approval, export, batch operations, authentication, database persistence, real Excel import, real CORN integration, intelligent scheduling, production status-code finalization, settlement formulas, and charge factors.

`B001` is now implemented as a minimal Python + FastAPI read-only backend under `backend/**`. It provides schedule plan list/detail endpoints from local seed data and is covered by standard-library `unittest` tests.

`F005` is now implemented as the frontend read-only scheduling-plan list/detail vertical. It adds `/schedule-plans` and `/schedule-plans/[planId]`, uses a centralized frontend API client in `lib/schedule-plans.ts`, and keeps the shadcn dashboard shell, sidebar, table, cards, and dark / light theme behavior.

`Q001` has accepted the first scheduling-plan read-only vertical based on backend unit tests, frontend lint/typecheck/build, Harness check, route generation, local HTTP 200 validation, API contract review, and shadcn theme-token review.

`H008` adds `scripts/dev.sh` as the local frontend + backend vertical startup entry. It starts FastAPI on `127.0.0.1:8000`, starts Next.js on `localhost:3000`, and defaults frontend server-side reads to `BPO_API_BASE_URL=http://127.0.0.1:8000`.

`B002` adds local in-memory draft creation and draft update API endpoints. It lets the backend create `draft` schedule plans and update only draft plans while recalculating summary fields.

`F006` adds `/schedule-plans/new` as the frontend draft creation entry. It uses a Next server action to call the B002 draft API and redirects to the created draft detail page after success.

`F007` adds `/schedule-plans/[planId]/edit` as the frontend draft update entry. Draft detail pages can navigate to the edit page, which uses a Next server action to call the B002 draft update API.

`B003` adds status and keyword filtering to the local FastAPI schedule plan list endpoint.

`F008` adds URL-based keyword/status filtering to `/schedule-plans`, with filtered summary cards, sortable results, and an empty-result state.

`B004` adds a local FastAPI shift-detail list endpoint that flattens schedule-plan intervals into 0.5h rows.

`F009` adds `/shift-details` and wires the sidebar "班次明细" item to a real page with keyword/status filters, summary cards, and plan links.

`B005` adds a local FastAPI demand-plan list endpoint based on existing forecast demand data.

`F010` adds `/demand-plans` and wires the sidebar "需求计划" item to a real page with search, summary cards, and a forecast-demand table.

`B006` adds a local FastAPI unavailability list endpoint for staff unavailable intervals, status filtering, and keyword search.

`F011` adds `/unavailability` and wires the sidebar "不可用管理" item to a real page with search, status filters, summary cards, and an unavailable-interval table.

`B007` adds a local FastAPI schedule-risk list endpoint that combines schedule interval gaps with active unavailability records for MVP risk hints.

`F012` adds a schedule-risk hint section to `/schedule-plans`, showing risk level, affected interval, gap, unavailable count, reason, recommendation, and shift-detail navigation.

`Q002` has accepted the local schedule-plan draft creation/update vertical based on backend unittest coverage, frontend lint/typecheck/build, Harness check, local new/edit page HTTP checks, and direct POST/PUT API verification.

The project still does not contain database persistence, authentication, real Excel import, real CORN integration, production permissions, approval flows, export pipelines, batch operations, intelligent scheduling algorithms, production status-code finalization, settlement formulas, or charge factors.

## Lab Archive

The previous working project was archived as:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

That archive is read-only reference material for future audits or explicitly approved migration planning.

## Current Rules

- No business implementation without a confirmed task.
- No dependency installation without PM confirmation.
- No package or lockfile changes without PM confirmation.
- No real API, database, or production integration by default.
- Every task must pass `bash scripts/check.sh`.
- Every completed task that passes `bash scripts/check.sh` must be committed to the local Git repository without an extra confirmation pause.
- Push remains PM-controlled: after a stage, module block, or coherent feature set is complete, Codex should ask whether to push to the remote repository.
- F001 is the confirmed exception that allows frontend package files, local mock data, and dashboard UI files for a static prototype only.
- Continuous Delivery Mode is active when the PM explicitly asks to continue through green gates or to finish, test, verify, and commit in one pass. It controls whether Codex continues into the next scoped task automatically; the local commit after a green check is now the default for every completed task.
- Story Runner Mode is now the preferred product-development flow: goals are split into minimal user stories, ready stories are executed in dependency order, small UI corrections stay inside the active story, and verified stories continue automatically until a stop condition is reached.
- Story Runner Mode authorizes bounded subagents by default when write scopes are independent and non-overlapping; the main Codex worker remains responsible for dispatch design, integration, final verification, commits, and Done Report.
- Stage Completion Planning is mandatory: after each stage, module block, or coherent feature set, the main worker must report what was completed, whether verification passed, what remains, the next 2-3 recommended steps, why that order is recommended, what is not recommended yet, and the default next item if PM does not object.
- Stage completion should also include the push decision point: ask PM whether to push the locally committed work to the remote repository.
- Direct development on `main` is forbidden. Tasks use `codex/<task-id>-<short-name>` branches created from fast-forward-synced `main`.
- Branch/worktree/integration/push details live in `docs/quality/GIT_BRANCH_WORKFLOW.md`; `AGENTS.md` stays as the short mandatory rule entry.
- Detailed frontend UI rules live in `docs/quality/FRONTEND_RULES.md`; `AGENTS.md` keeps only the frontend summary and Gate boundary.
- Done Reports now include branch, base commit, scope diff, final check, local commit, integration, and push-decision evidence fields.

## Development Environment

The project uses Node.js 22 for local development and delivery verification.
The project uses Python 3.12 for backend development and verification.

Current environment artifacts:

- `.nvmrc`
- `.node-version`
- `.python-version`
- `docs/dev/setup.md`

`scripts/check.sh` automatically prefers `/opt/homebrew/opt/node@22/bin` when the current shell is not already using Node.js 22. This avoids the local Node.js 24 native package loading issue observed with Next.js / lightningcss on macOS.

`npm run dev` is now a hardened frontend entrypoint. It selects Node.js 22, runs a native-addon preflight for `lightningcss` and Next.js SWC, and starts Next.js dev with webpack so the development path matches the accepted production build chain more closely. `scripts/dev.sh` reuses the same protected frontend entrypoint for local frontend + backend startup.

Backend runtime selection is now also hardened. `scripts/verify-backend-runtime.sh` only accepts Python 3.12 plus the required backend modules, so PATH order or a system Python 3.9 installation cannot silently become the project backend runtime.

This environment decision does not authorize dependency changes, package or lockfile edits, business implementation, backend work, real API integration, database work, permission systems, export pipelines, approval flows, or batch operations outside a confirmed Gate.

## Frontend Direction

Future frontend work is constrained to a professional shadcn/ui-based B2B SaaS admin console for BPO Workforce Management / BPO 人力计划与履约管理平台.

The frontend baseline is shadcn/ui v4 dashboard examples, dashboard-01 block, New York style, and the shadcn dark / light theme system. This direction is a rule for confirmed frontend tasks; it does not authorize new frontend implementation, dependency installation, package changes, mock data, or business code outside a confirmed Gate.

Current dashboard navigation decision: keep icons on first-level sidebar groups only; second-level items use text with badge/tag states to reduce visual noise. The sidebar supports a desktop collapsed rail state, and only the current first-level group is expanded by default.

Current sidebar interaction decision: the collapse / expand trigger belongs in `SiteHeader` as a page-level sidebar control. The sidebar itself stays fixed while the dashboard content scrolls independently.

## Lightweight Harness Direction

The project now uses a documentation-first Lightweight Harness flow for future module requests:

`raw requirement -> user story -> Story Execution Queue -> Gate Plan for risky scope -> implementation -> verification -> local commit after green check -> next ready story -> audit`

Current Lightweight Harness artifacts:

- `docs/harness/lightweight-harness.md`
- `docs/raw-requirements.md`
- `docs/user-stories.md`
- `docs/task-log.md`
- `docs/decision-log.md`
- `docs/audit-report.md`
- `docs/prompts/*.md`

This upgrade is a Harness and documentation structure. It does not authorize new frontend/backend implementation, dependency installation, package changes, new business mock data, real API integration, database work, export capability, approval flows, or batch operations outside a confirmed Gate.

Charting remains a controlled frontend decision. For F001 only, PM confirmed that the dashboard trend chart should follow the official shadcn dashboard chart structure first, which permits Recharts in the static prototype. Any future replacement with ECharts or another charting layer must be handled by a separate confirmed Gate.

## Inserted Design Alignment Requirement

`R020` inserts `/Users/mac/Documents/Codex/2026-05-10/computeruse-https-ui-shadcn-com/docs/design/shadcn-dashboard-01-replica-spec.md` as the project-level shadcn dashboard-01 visual alignment source.

The inserted requirement does not immediately authorize UI rewrites, dependency installation, package or lockfile changes, Tabler icon migration, font changes, or shadcn component additions. The next safe step is `US032/F013`: a read-only visual gap audit against the spec. Any implementation step such as `US033/F014` must preserve existing BPO business routes, fields, interfaces, and Chinese copy, and must receive a separate Gate if it needs package or lockfile changes.

`US032/F013` is now complete. The gap audit lives at `docs/design/shadcn-dashboard-01-gap-audit.md`. The key recommendation is to split `F014` into a dependency-free visual baseline pass first, then separately confirm any package or lockfile changes for Tabler icons, additional shadcn components, TanStack Table, DnD, Drawer, or other official dashboard table interactions.

`US033/F014` is now complete as a dependency-free visual baseline pass. The implementation report lives at `docs/design/shadcn-dashboard-01-visual-alignment-report.md`. The project now uses OKLCH dashboard tokens, sidebar tokens, a 288px sidebar baseline, container-query metric cards, larger metric values, natural area curves, and denser table rows. Remaining 1:1 parity items such as Tabler icons, extra shadcn components, TanStack Table, DnD, and Drawer stay explicitly gated because they require package or component-surface changes.

`US034/F015` is now complete as the confirmed dependency and shadcn component intake pass. The PM-confirmed package and lockfile changes are accepted, the added shadcn UI components and `hooks/use-mobile.ts` are now in the controlled scope, and `useIsMobile` uses `useSyncExternalStore` so the project passes the current React hooks lint gate. This does not add new business pages, real data, database persistence, authentication, permissions, approval, export, batch operations, production formulas, status-code finalization, settlement rules, or charge factors.

`US035/H016` is now complete as a Harness audit-feedback repair. `docs/quality/GATE_REGISTRY.md` maps each current `required_workflow` value to an explicit Gate, `AGENTS.md` uses the same current-stage wording as this file, old clean-Harness audit statements are marked as historical snapshots, and the next Story Runner queue now has `US036/F016` in `ready` status.

Current Story Runner ready queue:

- Next recommended story after `US051/Q005`: 排班计划详情时段表 table parity 第五条迁移。

`US036/F016` is now complete as the frontend risk-detail drilldown. Schedule-risk rows link to `/schedule-risks/[riskId]`, and the detail view shows risk level, plan/date/interval context, gap, active unavailability impact, reason, recommendation, related shift details, and overlapping unavailable records. It reuses existing local MVP contracts and does not add backend endpoints, dependencies, real data, database persistence, auth, permissions, approval, export, batch operations, automatic scheduling, production formulas, status-code finalization, settlement rules, or charge factors.

`US037/F017` is now complete as the frontend unavailability impact locator. Unavailability rows link to `/unavailability/[unavailabilityId]`, and the detail view shows the unavailable staff/team/context, impacted shift details, overlapping risk hints, and navigation back to plans, shift details, risk details, and the unavailability list. It reuses existing local MVP contracts and does not add backend endpoints, dependencies, real data, database persistence, auth, permissions, approval, export, batch operations, automatic scheduling, production formulas, status-code finalization, settlement rules, or charge factors.

`US038/F018` is now complete as a local table parity migration. The schedule-plan risk-hint table has been extracted to `ScheduleRiskTable` and uses TanStack Table for columns and sorting while preserving existing fields and detail/shift actions. This is display-only and does not enable batch selection, drag sorting, approval, export, batch adjustment, automatic scheduling, production formulas, status-code finalization, settlement rules, or charge factors.

`US039/H017` is now complete as the standardized branch/worktree/verification/integration workflow governance task. `AGENTS.md` has been compressed toward a short rule entry, `docs/quality/GIT_BRANCH_WORKFLOW.md` now owns command-level runbook details, `docs/quality/FRONTEND_RULES.md` now owns detailed frontend rules, `GATE_REGISTRY.md` maps branch and final-verification evidence expectations, and `DONE_REPORT_TEMPLATE.md` includes branch, scope diff, commit, integration, and push-decision fields. This does not modify business code, dependencies, package/lockfile files, real data, database persistence, auth, permissions, approval, export, batch operations, production formulas, status-code finalization, settlement rules, or charge factors.

`US042/H018` is now complete as the No Database MVP Mode governance task. Database connection setup, ORM, migrations, schema implementation, production persistence configuration, and real external data integration are hard stops until PM confirms a later database Gate. The allowed MVP path remains local FastAPI seed/process-memory data and frontend fallback contracts.

`US043/F019` is now complete as the local MVP flow entry. `/schedule-plans` now shows a No Database MVP chain panel that links demand plans, schedule plans, a representative risk detail, unavailability, and shift details while keeping all data local.

`US044/F020` is now complete as the second local table parity slice. `SchedulePlanTable` now uses TanStack Table for columns, row model, and sorting while preserving the existing schedule-plan fields and view action. It remains display-only and does not add batch selection, drag sorting, approval, export, batch adjustment, production workflow, formula, status-code, settlement-rule, or charge-factor behavior.

`US045/Q003` is now complete as the local MVP acceptance audit for this block. The current no-database MVP chain is suitable for continued feature development without database persistence; database planning should remain deferred until the local workflows are more complete and PM provides a database environment.

`US046/F021` is now complete as the schedule-plan detail review-chain strengthening pass. The detail page now exposes local review counts and direct links to shift details, risk hints, and active unavailability views for the same plan context, without adding backend endpoints, database work, real data, approval, export, batch operations, production formulas, status-code finalization, settlement rules, or charge factors.

`US047/F022` is now complete as the second follow-up table parity slice. `ShiftDetailsTable` now uses TanStack Table for columns, row model, and sorting while preserving the existing shift-detail fields and plan action. It remains display-only and does not add batch selection, drag sorting, approval, export, batch adjustment, production workflow, formula, status-code, settlement-rule, or charge-factor behavior.

`US048/F023` is now complete as the third follow-up table parity slice. `UnavailabilityTable` now uses TanStack Table for columns, row model, and sorting while preserving the existing unavailability fields plus the impact/shift actions. It remains display-only and does not add batch selection, drag sorting, approval, export, batch adjustment, production workflow, formula, status-code, settlement-rule, or charge-factor behavior.

`US049/Q004` is now complete as the local QA acceptance closure for the F021-F023 chain. The review-chain entry points and both parity tables were re-verified under the no-database MVP boundary, and traceability records were updated for continued Story Runner execution.

`US050/F024` is now complete as the fourth follow-up table parity slice. `DemandPlanTable` now uses TanStack Table for columns, row model, and sorting while preserving the demand-plan fields and display semantics. It remains display-only and does not add batch selection, drag sorting, approval, export, batch adjustment, production workflow, formula, status-code, settlement-rule, or charge-factor behavior.

`US051/Q005` is now complete as the local QA acceptance closure for F024. The demand-plans parity table and required fields were re-verified under the no-database MVP boundary, and traceability records were updated.

`US052/F025` is now the next `ready` frontend parity target, focused on migrating the schedule-plan detail interval table to a dedicated TanStack Table component while keeping display-only behavior and current contract boundaries.

## Subagent Prompt Contract Direction

Subagent prompt templates are now treated as contracts rather than loose role descriptions.

Subagent execution outside Story Runner Mode requires:

- explicit PM/user permission for subagents, delegation, or parallel agent work
- a confirmed Gate Plan
- a dispatch packet with input files, allowed files, forbidden files, stop conditions, acceptance criteria, and verification commands
- structured return status: `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`
- implementation review chain: Implementer -> Spec Reviewer -> Code Quality Reviewer -> Main Worker Integration

Story Runner Mode authorizes bounded subagent dispatch for independent write scopes. The main Codex worker remains responsible for integration, verification, task logs, audit records, commits, and Done Report.

## shadcn Skill Direction

The local skill `/Users/mac/.codex/skills/shadcn/SKILL.md` is the project reference for shadcn-specific frontend work.

Use it for:

- UI/UX Agent component selection and dashboard layout planning
- Frontend Agent implementation and component composition
- Implementer work that touches shadcn/ui files or `components.json`
- Code Quality Reviewer checks for shadcn composition, semantic tokens, accessibility, and anti-patterns
- QA Agent UI acceptance checks as a secondary reference

Do not use it as a default PM, Backend, or Doc Agent skill. It does not authorize shadcn CLI mutations, preset changes, package changes, dependency installation, or component overwrites without a confirmed Gate.
