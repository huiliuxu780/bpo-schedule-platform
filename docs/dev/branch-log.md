# Branch Log

## 2026-05-10

### Clean Harness Initialization

- Archived the previous project workspace to `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`.
- Created a clean project root at `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform/`.
- Initialized minimal Harness files only.
- No business code, frontend page, backend service, mock data, dependency, package file, or lockfile was added.

### Frontend Rules Added

- Added shadcn/ui-based frontend design and development rules to `AGENTS.md`.
- Recorded the frontend direction in `docs/PROJECT_STATE.md`: professional B2B SaaS admin console, shadcn dashboard baseline, New York style, and dark / light theme support.
- Added backlog item `H002` for this documentation-only Harness rule update.
- No business code, frontend page, mock data, dependency, package file, or lockfile was added.

## 2026-05-11

### Lightweight Harness Documentation Upgrade

- Added backlog item `H003` for the documentation-first Lightweight Harness upgrade.
- Added `docs/harness/lightweight-harness.md` to define the project flow from raw requirement to user story, DAG/dependency check, Gate Plan, scoped execution, Done Report, and audit.
- Added raw requirement, user-story, task-log, decision-log, audit-report, and Subagent prompt template document entries.
- Recorded that charting remains a future PM-confirmed decision and must not default to Recharts.
- No business code, frontend page, backend service, mock data, dependency, package file, or lockfile was added by this task.

### Directory Audit And Skill Mapping

- Audited the current project directory and found untracked frontend engineering files that conflict with the clean Harness state.
- Noted that the untracked frontend files include BPO/CORN mock data and a `recharts` dependency, which need a separate PM decision.
- Replaced placeholder prompt skills such as `user_story`, `dag_scheduler`, `code_generation`, `ui_design`, and `testing` with current Codex skill names.
- Recorded the mismatch and recommended a separate clean Harness deviation handling Gate.

### F001 shadcn Dashboard Static Prototype

- Added backlog item `F001` for the PM-confirmed static frontend dashboard scaffold.
- Implemented the BPO WFM dashboard using a shadcn dashboard-style component structure: `AppSidebar`, `SiteHeader`, `SectionCards`, `ChartAreaInteractive`, `DataTable`, `BpoHeatmap`, `DataSyncStatus`, and `ThemeToggle`.
- Added local mock data for BPO WFM metrics, fulfillment trends, time-slot staffing gaps, anomaly rows, and data sync status.
- Updated `docs/PROJECT_STATE.md` to move the project from clean Harness initialization to frontend dashboard scaffold.
- Updated `scripts/check.sh` so the Harness check validates the confirmed frontend scaffold instead of rejecting package and app files.
- No backend service, real Excel import, real CORN API, database, authentication, permission system, export pipeline, intelligent scheduling algorithm, or lab archive migration was added.
- Verified the dashboard with local browser QA in dark mode, light mode, and a narrow mobile viewport.
- Reinstalled frontend dependencies with Homebrew `node@22` after the previous Node binary caused native package code-signing failures on macOS.
- Removed the Recharts development-time container warning by loading the trend chart client-side only.
- Marked backlog item `F001` as done after lint, typecheck, build, and Harness check passed.

### F002 Sidebar Navigation Refinement

- Added backlog item `F002` for PM-observed sidebar navigation refinements.
- Removed second-level sidebar icons to reduce visual noise while keeping first-level lucide icons.
- Added desktop sidebar collapse / expand behavior with a narrow icon rail state.
- Changed default first-level behavior so only the current group is expanded initially; other groups are collapsed and clickable.
- Updated `docs/PROJECT_STATE.md` with the current navigation decision so it overrides the earlier F001 two-level-icon requirement.

### F003 Sidebar Official-Ratio And Scroll Fixes

- Added backlog item `F003` for PM-observed sidebar proportion and behavior fixes.
- Reduced first-level sidebar item height and font size to better match the shadcn dashboard sidebar rhythm.
- Moved the sidebar collapse / expand trigger from the sidebar brand area into `SiteHeader`.
- Lifted sidebar collapsed state into the dashboard page shell so content and sidebar react together.
- Changed the page shell to fixed viewport height with independent main-content scrolling, so the sidebar no longer moves with page scroll.
- Prevented page-level horizontal scrolling and kept table overflow inside the table card.

### F004 Official Icon Alignment

- Added backlog item `F004` for dashboard brand and theme icon alignment.
- Replaced the theme toggle glyph with the exact PM-provided official dashboard SVG path: circle, vertical split, and three diagonal strokes.
- Replaced the sidebar brand mark with the same official glyph path so the top-left identity matches the reference icon shape.
- No new icon dependency was added; the SVG path is embedded locally to avoid package churn.

### Subagent Prompt Contract

- Added `docs/prompts/README.md` with the required dispatch packet, structured return format, universal stop conditions, and review chain.
- Reworked PM, UI/UX, Frontend, Backend, QA, and Doc Agent prompts into explicit contracts with inputs, outputs, rules, and stop conditions.
- Added generic Implementer, Spec Reviewer, and Code Quality Reviewer prompt contracts for future implementation workflows.
- Recorded the original conservative subagent rule, which was later superseded by H010 Story Runner Mode for continuous story delivery.

### shadcn Skill Assignment

- Added backlog item `H005` for mapping `/Users/mac/.codex/skills/shadcn/SKILL.md` into the Subagent Prompt Contract.
- Assigned the shadcn skill to UI/UX Agent, Frontend Agent, Implementer, and Code Quality Reviewer for shadcn-specific frontend work.
- Recorded QA Agent as a secondary/reference user for UI acceptance checks only.
- Recorded that PM, Backend, and Doc Agent do not use the shadcn skill by default.
- Clarified that the skill does not authorize shadcn CLI writes, preset changes, dependency installation, package changes, or component overwrites without a confirmed Gate.

### H006 Pre-Coding Harness Closure

- Added backlog item `H006` for pre-coding Harness closure.
- Aligned `AGENTS.md` with the current frontend dashboard scaffold stage.
- Added F001 traceability into `docs/raw-requirements.md` and `docs/user-stories.md`.
- Added `docs/prompts/file_ownership_matrix.md` and sample dispatch packets under `docs/prompts/examples/`.
- Formalized the F001-only Recharts exception in `docs/decision-log.md`.
- Strengthened `scripts/check.sh` so frontend toolchain gaps are surfaced before coding claims are made.

### H007 Development Environment Hardening

- Added backlog item `H007` for development runtime and delivery verification hardening.
- Added `.nvmrc` and `.node-version` to declare Node.js 22 as the project runtime.
- Added `docs/dev/setup.md` with local install, startup, delivery check, and scope boundary instructions.
- Updated `README.md` from the old clean Harness wording to the current frontend dashboard scaffold state.
- Updated `scripts/check.sh` so it prefers Homebrew `node@22` when the current shell is not already using Node.js 22.
- Recorded the Node.js 22 environment decision in `docs/PROJECT_STATE.md`, `docs/decision-log.md`, `docs/task-log.md`, and `docs/audit-report.md`.

### M001 MVP Scheduling Vertical Design

- Added raw requirements `R003` through `R010` for formal MVP setup and the scheduling-plan vertical.
- Added user stories `US006` through `US016` covering MVP scope confirmation, schedule plan list/detail, FastAPI read APIs, seed data, API contract, MVP status/formula boundary, and QA verification.
- Added `docs/superpowers/specs/2026-05-11-mvp-scheduling-vertical-design.md` to record the selected vertical, data model draft, API draft, scope exclusions, risks, and acceptance.
- Added backlog items `M001`, `B001`, `F005`, and `Q001`.
- Recorded `D008` to confirm the first formal MVP vertical as scheduling plan read-only delivery.

### B001 FastAPI Schedule Read API

- Added a minimal FastAPI backend under `backend/**`.
- Added read-only schedule plan endpoints: `GET /api/v1/schedule-plans` and `GET /api/v1/schedule-plans/{plan_id}`.
- Added local seed data for three schedule plans, each with 0.5h interval details.
- Added standard-library `unittest` coverage for route registration, list contract, detail contract, and 404 error payload.
- Updated `scripts/check.sh` to verify backend files, FastAPI/Pydantic availability, and backend tests as part of the Harness check.

### F005 Schedule Plan Frontend Vertical

- Added `/schedule-plans` as the read-only schedule plan list entry.
- Added `/schedule-plans/[planId]` as the read-only schedule plan detail entry.
- Added `lib/schedule-plans.ts` as the centralized frontend API client for the B001 schedule plan contract.
- Added `AppShell` and `SchedulePlanTable` to reuse the shadcn dashboard shell while keeping the page components scoped.
- Updated the sidebar to link into `/schedule-plans` and highlight only the active scheduling-plan item.
- Added button `asChild` support for link-style shadcn actions without introducing a new dependency.
- Verified the list route and detail route with local HTTP 200 responses after clearing a corrupted Next/Turbopack dev cache.

### Q001 Scheduling Vertical Acceptance

- Accepted the first read-only scheduling-plan vertical across backend, frontend, API contract, routing, and Harness verification.
- Re-ran backend unittest coverage for list/detail/404 route behavior.
- Confirmed `bash scripts/check.sh` passes with frontend lint/typecheck/build and backend tests.
- Confirmed `/schedule-plans` and `/schedule-plans/plan-20260511-shanghai-bosch-v1` returned local HTTP 200 during dev verification.
- Reviewed new frontend files for shadcn theme-token usage and found no newly introduced hardcoded color or arbitrary color classes.
- Kept production workflow capabilities out of scope: no edit, publish, approval, export, batch operation, authentication, database, real Excel, or real CORN integration.

### H008 Local Vertical Startup

- Added `scripts/dev.sh` to start the FastAPI backend and Next.js frontend together for local vertical verification.
- Defaulted `BPO_API_BASE_URL` to `http://127.0.0.1:8000` while allowing caller override.
- Added Node.js 22 selection and backend dependency checks to the local startup script.
- Added `bash -n scripts/dev.sh` to the Harness check.
- Updated README, backend README, and setup documentation with frontend-only and frontend + backend startup paths.

### H009 Continuous Delivery Commit Flow

- Added Continuous Delivery Mode to `AGENTS.md`.
- Recorded that explicit PM instructions such as "一口气做完" or "做完测完验证完提交完" authorize Codex to finish, verify, and commit without another commit confirmation pause.
- Kept high-risk stop conditions intact for dependencies, package changes, real data, database, authentication, approval, export, batch operations, production formulas, destructive Git actions, and failed verification.
- Updated `docs/PROJECT_STATE.md`, task log, audit report, and backlog with the new operating rule.

### B002 Schedule Plan Draft API

- Added draft request models for schedule plan interval input and draft payloads.
- Added `POST /api/v1/schedule-plans/drafts` for local in-memory draft creation.
- Added `PUT /api/v1/schedule-plans/{plan_id}/draft` for updating draft plans only.
- Added server-side recalculation for forecast totals, scheduled totals, gap, coverage rate, and update timestamp.
- Added backend unittest coverage for draft creation, draft update, non-draft rejection, and route registration.
- Kept persistence, authentication, permissions, publish, approval, export, batch operations, real Excel, and real CORN out of scope.

### F006 Schedule Plan Draft Creation UI

- Added a "新建草稿" action to the schedule plan list page.
- Added `/schedule-plans/new` as the minimal draft creation page.
- Added a server action that calls the B002 draft creation API from the Next.js server.
- Extended `lib/schedule-plans.ts` with draft payload types and write helpers.
- Kept the first UI version intentionally small: plan metadata plus four core 0.5h intervals.
- Kept full editing, publish, approval, export, batch operations, authentication, permissions, and persistence out of scope.

### H010 Story Runner Delivery Flow

- Added raw requirement `R014` and user story `US021` for PM's Harness optimization feedback.
- Added Story Runner Mode to `AGENTS.md`: goal -> minimal user stories -> Story Execution Queue -> implementation -> verification -> commit -> next story.
- Updated `docs/harness/lightweight-harness.md` so story-first continuous delivery is the main development flow.
- Updated `docs/prompts/README.md` so bounded subagents can be used by default in Story Runner Mode when write scopes do not overlap.
- Synchronized completed user-story statuses with completed backlog/task-log/audit state.
- Recorded that small UI corrections stay inside the active story instead of becoming new `F00x` tasks unless scope changes.

### F007 Schedule Plan Draft Update UI

- Added an "编辑草稿" action on draft schedule plan detail pages.
- Added `/schedule-plans/[planId]/edit` as the draft update page.
- Added a server action that calls the B002 draft update API from the Next.js server.
- Kept non-draft plans read-only and hid the edit action outside draft status.
- Kept full personnel-level scheduling, publish, approval, export, batch operations, authentication, permissions, and persistence out of scope.

### Q002 Draft Create And Update Acceptance

- Accepted the local schedule-plan draft creation/update vertical across backend API, frontend create UI, frontend edit UI, and Harness verification.
- Confirmed `bash scripts/check.sh` passes with `/schedule-plans/new` and `/schedule-plans/[planId]/edit` in the build output.
- Confirmed local HTTP 200 for the new draft page and edit draft page.
- Confirmed direct POST draft creation and PUT draft update against the FastAPI service.
- Recorded that persistence, authentication, permissions, publish, approval, export, batch operations, real Excel, and real CORN remain out of scope.

### H011 Harness Gate Review Fixes

- Fixed backend Python selection in `scripts/check.sh` and `scripts/dev.sh` so local verification chooses a Python runtime that can import FastAPI/Pydantic instead of depending on whichever `python3` appears first in PATH.
- Reconciled `docs/PROJECT_STATE.md` so the active scope now reflects the frontend dashboard scaffold plus local scheduling-plan MVP vertical, while keeping real integrations, database, auth, permissions, export, approval, batch operations, production formulas, and charge factors out of scope.
- Reconciled sidebar rules so primary navigation keeps icons and secondary navigation stays text-first with badge/tag states unless a later Gate changes that decision.
- Marked stale audit conclusions as superseded: key frontend/backend files are tracked, and the current Gate risk is backend Python runtime selection rather than the presence of `package.json`.

### B003/F008 Schedule Plan Filters

- Added backend `status` and `query` filtering for `GET /api/v1/schedule-plans`.
- Added unittest coverage for backend status and keyword filtering.
- Added URL-based keyword search, status switching, clear filters, filtered summary cards, and empty-result messaging to `/schedule-plans`.
- Kept this story local-only: no new dependency, package change, database, auth, real Excel, real CORN, publish, approval, export, or batch operation.

### B004/F009 Shift Details

- Added `GET /api/v1/shift-details` to expose flattened 0.5h schedule-plan interval rows.
- Added backend tests for shift-detail contract fields and keyword filtering.
- Added `/shift-details` with summary cards, keyword/status filters, empty state, and links back to the source schedule plan.
- Updated the sidebar "班次明细" item to point at the new page.

### B005/F010 Demand Plans

- Added `GET /api/v1/demand-plans` to expose local forecast-demand rows.
- Added backend tests for demand-plan contract fields and keyword filtering.
- Added `/demand-plans` with summary cards, keyword search, empty state, and a forecast-demand table.
- Updated the sidebar "需求计划" item to point at the new page.

### H013 Stage Completion Planning

- Added a mandatory stage-completion planning section to `AGENTS.md`.
- Added the same rule to the Lightweight Harness workflow and Done Report template.
- Updated Project State so future main-worker reports include completed scope, verification, remaining work, recommended next 2-3 steps, reasoning, not-yet-recommended items, and the default next item when PM does not object.

### B006/F011 Unavailability Management

- Added `GET /api/v1/unavailability` to expose local staff unavailable-interval records.
- Added backend tests for unavailability route registration, field contract, status filtering, and keyword filtering.
- Added `/unavailability` with summary cards, keyword/status filters, empty state, and links into shift details by site.
- Updated the sidebar "不可用管理" item to point at the new page.

### B007/F012 Schedule Risk Hints

- Added `GET /api/v1/schedule-risks` to expose local MVP risk hints from schedule gaps plus active unavailability records.
- Added backend tests for risk route registration, field contract, combined high-risk detection, and keyword filtering.
- Added a risk-hint section to `/schedule-plans` with high-risk count, risk rows, reason, recommendation, and links into shift details.
- Kept the risk level as MVP display guidance only; no production formula, automatic scheduling, approval, or batch adjustment was added.

### H014 Insert shadcn Dashboard Replica Requirement

- Confirmed the previous development commits are present, including `1a8671f feat: add schedule risk hints`.
- Inserted `R020` from `/Users/mac/Documents/Codex/2026-05-10/computeruse-https-ui-shadcn-com/docs/design/shadcn-dashboard-01-replica-spec.md`.
- Split the inserted design requirement into `US032` visual gap audit and `US033` visual alignment implementation.
- Added `F013` and `F014` as the queued execution items, with `F014` explicitly gated if package, lockfile, font, icon, or shadcn component changes are needed.

### F013 shadcn Dashboard Replica Gap Audit

- Added `docs/design/shadcn-dashboard-01-gap-audit.md`.
- Audited current `components.json`, `package.json`, `app/globals.css`, layout, sidebar, header, cards, chart, table, and UI primitives against the inserted replica spec.
- Classified gaps as P0/P1/P2, including theme token mismatch, sidebar width/token mismatch, metric-card sizing, missing container queries, incomplete table interactions, and dependency-gated Tabler/TanStack/DnD work.
- Marked `US032/F013` done while leaving `US033/F014` as the gated implementation story.

### F014 shadcn Dashboard Replica Visual Baseline

- Aligned `app/globals.css` to OKLCH dashboard tokens and added sidebar semantic tokens.
- Adjusted sidebar width, background token, nav row height, header title scale, metric card height, metric value typography, and metric card container-query behavior.
- Updated chart token usage for OKLCH compatibility and switched area curves to `natural`.
- Increased table row density toward the measured dashboard-01 baseline.
- Added `docs/design/shadcn-dashboard-01-visual-alignment-report.md` with completed work and remaining gated parity items.

### H012 Harness Documentation Consistency Fixes

- Reconciled `docs/harness/lightweight-harness.md` with the current frontend dashboard scaffold plus local scheduling-plan MVP vertical state.
- Clarified that B001/B002/F005/F006/F007/Q001/Q002 are confirmed local vertical scope, while production database, auth, permissions, real integrations, approval, export, batch operations, formulas, and charge factors remain gated.
- Clarified `AGENTS.md` so Story Runner Mode can use bounded subagents by default, while subagent templates alone do not authorize automatic execution outside that mode.
- Reclassified old untracked-file and clean Harness deviation audit risks as historical conclusions superseded by H011/H012.

### H015 Auto Local Commit After Green Check

- Updated the project execution flow so every completed task that passes `bash scripts/check.sh` is committed to the local Git repository without another confirmation pause.
- Kept remote push PM-controlled: after a stage, module block, or coherent feature set is complete, Codex asks whether to push to `origin`.
- Synchronized `AGENTS.md`, Project State, Lightweight Harness, Done Report Template, backlog, task log, decision log, and audit report.

### F015 shadcn Dependency And Component Intake

- Added `R021`, `US034`, and backlog task `F015` for the PM-confirmed shadcn dependency and component intake pass.
- Accepted the package and lockfile changes for Tabler icons, TanStack Table, DnD, sonner, zod, class-variance-authority, radix-ui, vaul, and generated shadcn UI components.
- Fixed `hooks/use-mobile.ts` by replacing effect-driven state synchronization with `useSyncExternalStore`, resolving the React hooks lint failure.
- Browser-smoked dashboard rendering, schedule-plan filtering, new draft form, and edit draft form after the primitive updates.
- Kept this as scaffold intake only: no new business route, backend capability, real data, database, auth, approval, export, batch operation, production formula, status-code change, settlement rule, or charge factor was added.

### H016 Harness Gate Registry Alignment

- Added `R022`, `US035`, and backlog task `H016` for the audit-feedback repair.
- Expanded `docs/quality/GATE_REGISTRY.md` into a workflow-to-gate matrix covering `harness`, `frontend-scaffold`, `frontend-audit`, `backend`, `backend-mvp`, `backend-vertical`, and `qa`.
- Aligned `AGENTS.md` and `docs/PROJECT_STATE.md` to the same current stage: frontend dashboard scaffold + local scheduling-plan MVP vertical.
- Moved stale clean-Harness conclusions in `docs/audit-report.md` into a historical audit snapshot section.
- Added `R023`, `US036`, and `F016` as the next `ready` Story Runner entry for risk-detail drilldown without implementing it in this task.

### F016 Schedule Risk Detail Drilldown

- Added `/schedule-risks/[riskId]` as a frontend-only risk-detail drilldown.
- Added a stable "明细" action from the schedule-plan risk table to the risk detail page.
- Reused existing local MVP data contracts to show risk context, related shift detail rows, and overlapping active unavailability rows.
- Kept the page as manual review support only: no backend endpoint, dependency, real data source, database, auth, approval, export, batch adjustment, automatic scheduling, production formula, status-code change, settlement rule, or charge factor was added.

### F017 Unavailability Impact Locator

- Added `/unavailability/[unavailabilityId]` as a frontend-only impact locator for unavailable staff intervals.
- Added a stable "影响" action from the unavailability table to the impact locator page.
- Reused existing local MVP data contracts to show unavailable-staff context, impacted shift detail rows, and overlapping schedule risk rows.
- Kept the page as manual review support only: no backend endpoint, dependency, real data source, database, auth, approval, export, batch adjustment, automatic scheduling, production formula, status-code change, settlement rule, or charge factor was added.

### F018 Schedule Risk Table Parity Slice

- Added `components/schedule-risk-table.tsx` as a local TanStack Table slice for schedule risk hints.
- Replaced the inline risk table in `/schedule-plans` with `ScheduleRiskTable`.
- Added sortable risk level, date, gap, and unavailable-impact columns while preserving existing fields and detail/shift actions.
- Kept this as display-only table parity: no dependency change, batch selection, drag sorting, approval, export, batch adjustment, production workflow, formula, status-code change, settlement rule, or charge factor was added.

### H019 Dev Native Runtime Hardening

- Added `scripts/verify-frontend-native-runtime.mjs` to preflight the Node.js major version plus `lightningcss-darwin-arm64` and `@next/swc-darwin-arm64` native addon loading before starting the frontend.
- Added `scripts/run-next-dev.sh` as the hardened frontend dev entrypoint; it selects Homebrew `node@22`, runs the native preflight, supports a dry-run mode for regression tests, and starts `next dev --webpack`.
- Replaced the bare `next dev` package script with the hardened wrapper and updated `scripts/dev.sh` to reuse the same entrypoint for frontend + backend startup.
- Expanded `scripts/check.sh` to require the new runtime files, syntax-check the wrapper, run a native runtime preflight, and run `scripts/tests/verify-frontend-native-runtime.test.mjs`.
- Verified the exact root-cause pair on this machine: the default Codex Node 24 fails native addon loading with macOS code-signing errors, while Homebrew Node 22 passes the same checks and full project Harness verification.
