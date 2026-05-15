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

### H017 Standard Branch Workflow

- branch_name: `codex/H017-standard-workflow`
- base_main_commit: `1b8adb4c75ff670cebebb6d9420f0f9b54d4194b`
- remote_status: `origin/main available; main fast-forward synced before branch creation`
- scope: Harness workflow and frontend-rule documentation only; no business code, dependency, package, lockfile, backend, or frontend implementation changes.
- allowed_files_check: `AGENTS.md`, `docs/**`, and `tasks/backlog.yaml` only.
- scope_diff_check: `AGENTS.md`, `docs/**`, and `tasks/backlog.yaml` only; no app/backend/package/lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed with frontend lint, typecheck, Next build, and 19 backend unittest cases.
- local_commit_sha: `07fc4e09a961adaebf8384682855069389d76f4f`
- integration_status: `integrated`
- integration_method: `merge into main`
- integration_commit_sha: to be reported in Done Report after final integration commit creation.
- push_decision: `approved by PM after integration plan`

### H018/F019/F020/Q003 No Database MVP Completion Block

- branch_name: `codex/mvp-no-db-completion`
- base_main_commit: `1b8adb4c75ff670cebebb6d9420f0f9b54d4194b`
- upstream_governance_commit: `07fc4e09a961adaebf8384682855069389d76f4f`
- remote_status: `origin/main available; git fetch origin passed before branch work`
- scope: No Database MVP Mode governance, local MVP flow entry, schedule-plan table parity slice, and MVP acceptance audit.
- allowed_files_check: `AGENTS.md`, `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend or package/lockfile files.
- scope_diff_check: `AGENTS.md`, `app/schedule-plans/page.tsx`, `components/mvp-flow-summary.tsx`, `components/schedule-plan-table.tsx`, `docs/**`, and `tasks/backlog.yaml`; no backend or package/lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed once before final evidence update; final check to be reported in Done Report.
- local_commit_sha: `f59f821b8e744a015603280879ca45e3116e08dd`
- integration_status: `integrated`
- integration_method: `merge into main`
- integration_commit_sha: to be reported in Done Report after final integration commit creation.
- merge_to_main_commit: to be reported in Done Report after final integration commit creation.
- push_decision: `approved by PM after integration plan`
- blocked_reason: `N/A`

### H019 Dev Native Runtime Hardening

- Added `scripts/verify-frontend-native-runtime.mjs` to preflight the Node.js major version plus `lightningcss-darwin-arm64` and `@next/swc-darwin-arm64` native addon loading before starting the frontend.
- Added `scripts/run-next-dev.sh` as the hardened frontend dev entrypoint; it selects Homebrew `node@22`, runs the native preflight, supports a dry-run mode for regression tests, and starts `next dev --webpack`.
- Replaced the bare `next dev` package script with the hardened wrapper and updated `scripts/dev.sh` to reuse the same entrypoint for frontend + backend startup.
- Expanded `scripts/check.sh` to require the new runtime files, syntax-check the wrapper, run a native runtime preflight, and run `scripts/tests/verify-frontend-native-runtime.test.mjs`.
- Verified the exact root-cause pair on this machine: the default Codex Node 24 fails native addon loading with macOS code-signing errors, while Homebrew Node 22 passes the same checks and full project Harness verification.

### H020 Python 3.12 Runtime Pinning

- Added `.python-version` with `3.12` and documented Python 3.12 as the only supported backend development runtime.
- Added `scripts/verify-backend-runtime.sh` to validate the Python version plus required backend modules before selecting an interpreter.
- Updated `scripts/check.sh` and `scripts/dev.sh` to reuse the same backend runtime verifier instead of hand-rolled candidate logic.
- Added `scripts/tests/verify-backend-runtime.test.mjs` and integrated it into the main Harness check so supported Python 3.12 passes and system Python 3.9 fails clearly.
- Verified on this machine that `/Users/mac/.local/bin/python3` 3.12.13 is accepted and `/usr/bin/python3` 3.9.6 is rejected as unsupported.

### F021/F022 Local Detail Chain And Shift Table Parity

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; fetch passed and local main already matched origin/main`
- scope: schedule-plan detail review-chain strengthening, shift-details table parity, and traceability updates only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-plans/[planId]/page.tsx`, `app/shift-details/page.tsx`, `components/shift-details-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed; local dev smoke used `npm run dev` on `http://localhost:3002` and verified the updated schedule-plan detail, shift-details, and schedule-risk detail routes by local HTTP content checks because browser navigation tools were not exposed in this turn.
- local_commit_sha: `current HEAD on codex/f021-detail-chain; exact SHA recorded in the Done Report`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F023 Unavailability Table Parity

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: unavailability table parity migration and traceability updates only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/unavailability/page.tsx`, `components/unavailability-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `3e023e4`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### Q004 QA Closure And F024 Ready Queue

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: QA acceptance closure for F021-F023 plus next parity target seeding only.
- allowed_files_check: `docs/**`, `tasks/backlog.yaml`, and read-only verification across `app/**` + `components/**`; no backend, lib, package, or lockfile files.
- scope_diff_check: `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/audit-report.md`, `docs/PROJECT_STATE.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed; local QA smoke confirmed `/schedule-plans/[planId]`, `/shift-details`, and `/unavailability` key labels/entry texts via local HTTP checks on `http://localhost:3002`.
- local_commit_sha: `2d2035b`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F024 Demand Table Parity And Q005 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: demand-plans table parity migration, F024 QA closure, and next parity target seeding only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/demand-plans/page.tsx`, `components/demand-plan-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green).
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F025 Detail Interval Table Parity And Q006 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: schedule-plan detail interval table parity migration, F025 QA closure, and next parity target seeding only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-plans/[planId]/page.tsx`, `components/schedule-plan-interval-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green); local smoke on `http://localhost:3011/schedule-plans/[planId]` confirmed table title/columns/sample interval values.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F026 Risk Detail Shift Table Parity And Q007 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: schedule-risk detail related-shifts table parity migration, F026 QA closure, and explicit remaining queue consolidation only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-risks/[riskId]/page.tsx`, `components/schedule-risk-shift-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green); local smoke on `http://localhost:3012/schedule-risks/[riskId]` confirmed related-shifts card title, table columns, and representative note content.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F027-F029 Detail Page Remaining Parity Chain And Q008-Q011 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: schedule-risk detail remaining table parity, unavailability-impact detail two-table parity, per-story QA closures, and final block-level QA closure only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-risks/[riskId]/page.tsx`, `app/unavailability/[unavailabilityId]/page.tsx`, `components/schedule-risk-unavailability-table.tsx`, `components/unavailability-impact-shift-table.tsx`, `components/unavailability-impact-risk-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green); local smoke on `http://localhost:3013/schedule-risks/[riskId]` and `http://localhost:3013/unavailability/[unavailabilityId]` confirmed all three migrated detail tables render expected headings and columns.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H022 State Governance V3 Round 1

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/main available; local main already matched origin/main before branch creation`
- scope: state-governance documents, current/registry state entrypoints, state check script, and traceability updates only.
- allowed_files_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/harness/lightweight-harness.md`, `docs/PROJECT_STATE.md`, legacy traceability docs, `tasks/backlog.yaml`, and `scripts/check-state.sh`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/decision-log.md`, `docs/dev/branch-log.md`, `docs/harness/lightweight-harness.md`, `docs/quality/DONE_REPORT_TEMPLATE.md`, `docs/quality/GATE_REGISTRY.md`, `docs/quality/STATE_MANAGEMENT.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, `docs/current/**`, `docs/registry/**`, `tasks/backlog.yaml`, and `scripts/check-state.sh`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh` passed; `bash scripts/check-state.sh --repair-scope` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H023 Check-State Standard Verification Integration

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: state-check script hardening, standard check integration, regression tests, and traceability updates only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, `scripts/check.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/PROJECT_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/decision-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/registry/TRACE_INDEX.yaml`, `docs/registry/DECISION_INDEX.yaml`, `tasks/backlog.yaml`, `scripts/check-state.sh`, `scripts/check.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `node --test scripts/tests/check-state.test.mjs` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H024 Current Queue Live Smoke

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: current queue smoke, registry index update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/STORY_QUEUE.yaml`, `docs/current/ACTIVE_TASKS.yaml`, `docs/current/PROJECT_CONTEXT.md`, `docs/registry/TRACE_INDEX.yaml`, `docs/registry/DECISION_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed with H024 current entry; after completion `bash scripts/check-state.sh --strict` passed with empty current; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H025 Current Done History Invariant

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: state-check current done history invariant, regression tests, registry update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `node --test scripts/tests/check-state.test.mjs` passed with 7 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H026 Strict State Check Default

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: standard check state mode, current queue cleanup, registry update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, and `scripts/check.sh`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, and `scripts/check.sh`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with default strict state check; `BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H027 TRACE_INDEX Current Files Path Check

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: check-state registry path coverage, state-check regression test, current queue cleanup, registry update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `node --test scripts/tests/check-state.test.mjs` passed with 8 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H028 Codex Plan Boundary

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: Codex Plan boundary rules, current queue cleanup, registry update, and traceability records only.
- allowed_files_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F030-F031 Dashboard Table Parity Block

- branch_name: `codex/f030-dashboard-table-parity`
- base_main_commit: `2ba7170`
- remote_status: `branch created from pushed state-governance head because main has not yet integrated H022-H028`
- scope: dashboard anomaly detail table parity, local column visibility, local page-size controls, QA traceability, and state cleanup.
- allowed_files_check: `app/dashboard/**`, `components/data-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- scope_diff_check: `components/data-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed; `npm run lint` passed; `npm run typecheck` passed; `curl -fsS http://127.0.0.1:3014/dashboard` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F032-F040 Dashboard Continuation Block

- branch_name: `codex/f032-dashboard-continuation`
- base_main_commit: `f7b1ef1`
- remote_status: `branch created from prior pushed dashboard parity branch because main has not yet integrated H022-H028 and F030-F031`
- scope: 10-task dashboard local frontend continuation: anomaly filters/pagination, data sync table parity/filtering, heatmap summaries/accessibility, QA traceability, and state cleanup.
- allowed_files_check: `app/dashboard/**`, `components/**`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- scope_diff_check: `components/bpo-heatmap.tsx`, `components/data-sync-status.tsx`, `components/data-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/PROJECT_CONTEXT.md`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 6 tests; `npm run typecheck` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F041-F059 Table Parity Continuation Block

- branch_name: `codex/f041-dashboard-continuation-2`
- base_main_commit: `b0beab6`
- remote_status: `local branch created from prior pushed dashboard continuation branch because main has not yet integrated H022-H028, F030-F031, or F032-F040`
- scope: 20-task local frontend table parity continuation: schedule plan table filters/summary/pagination/columns, schedule risk filters/summary/pagination, unavailability filters/summary/pagination/columns, QA traceability, and state cleanup.
- allowed_files_check: `components/**`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/schedule-plan-table.tsx`, `components/schedule-risk-table.tsx`, `components/unavailability-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 9 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed; local HTTP smoke passed for `/schedule-plans` and `/unavailability` on `http://127.0.0.1:3015`.
- local_commit_sha: `462e3b4`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### H029 Current-State Governance Closeout

- branch_name: `codex/h029-current-state-closeout`
- base_main_commit: `a3a134c`
- remote_status: `pushed to origin/codex/h029-current-state-closeout`
- scope: current-state governance closeout, strict state-check hardening, regression tests, and traceability updates only.
- allowed_files_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/harness/lightweight-harness.md`, `docs/PROJECT_STATE.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/harness/lightweight-harness.md`, `docs/PROJECT_STATE.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed while `H029` was active; `bash scripts/check-state.sh --repair-scope` passed; `node --test scripts/tests/check-state.test.mjs` passed with 15 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `dc54aa2`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### F060 Risk Workbench

- branch_name: `codex/f060-risk-workbench`
- base_main_commit: `a3a134c`
- remote_status: `branch pushed to origin/codex/f060-risk-workbench`
- scope: dedicated risk workspace route, sidebar entry, cross-page drilldown alignment, local risk filtering helper, tests, and traceability updates only.
- allowed_files_check: `app/schedule-risks/**`, `app/schedule-plans/**`, `app/unavailability/**`, `components/app-sidebar.tsx`, `components/schedule-risk-table.tsx`, `lib/schedule-plans.ts`, `next-env.d.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-risks/page.tsx`, `app/schedule-risks/[riskId]/page.tsx`, `app/schedule-plans/page.tsx`, `app/schedule-plans/[planId]/page.tsx`, `app/unavailability/[unavailabilityId]/page.tsx`, `components/app-sidebar.tsx`, `lib/schedule-plans.ts`, `next-env.d.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- check_result: Safari smoke passed for `http://localhost:3016/schedule-risks` and plan-context filtered risk workspace; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 10 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `808c181`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### Q015 Risk Workbench QA Closeout

- branch_name: `codex/f060-risk-workbench`
- base_main_commit: `a3a134c`
- remote_status: `QA closeout completed on the existing tracked branch`
- scope: QA closeout, smoke evidence, current-state cleanup, and traceability updates for the F060 risk workbench chain only.
- allowed_files_check: `app/schedule-risks/**`, `app/schedule-plans/**`, `app/unavailability/**`, `components/app-sidebar.tsx`, `lib/schedule-plans.ts`, `next-env.d.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `docs/current/**`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/PROJECT_STATE.md`, `docs/registry/TRACE_INDEX.yaml`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- check_result: `bash scripts/check-state.sh --strict`, `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`, `git diff --check`, and `bash scripts/check.sh` passed; prod smoke on port 3014 confirmed risk workspace, filtered workspace, schedule plan detail, risk detail, and unavailability detail chain.
- local_commit_sha: `550dea1`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### F061-F064 Scoped Drilldown Continuation

- branch_name: `codex/f060-risk-workbench`
- base_main_commit: `a3a134c`
- remote_status: `scoped drilldown block completed locally; follow-up push required after closeout commit`
- scope: scoped shift-detail and unavailability drilldown, risk workbench right rail, context-link alignment across plan/risk/shift/unavailability pages, focused tests, and traceability updates only.
- allowed_files_check: `app/shift-details/**`, `app/schedule-plans/**`, `app/schedule-risks/**`, `app/unavailability/**`, `components/**`, `lib/schedule-plans.ts`, `lib/unavailability.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: frontend routes/components, local helper filters, state/traceability docs, and backlog only; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 12 tests; `npm run lint` passed; `npm run typecheck` passed; `git diff --check` passed; `bash scripts/check.sh` passed; Safari and local HTTP smoke confirmed scoped drilldown and right rail behavior.
- local_commit_sha: `0c5b47c`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### F065-F068 Review Rail and Continuation Actions

- branch_name: `codex/f060-risk-workbench`
- base_main_commit: `a3a134c`
- remote_status: `active branch continuation after F061-F064/Q016 on the same tracked branch`
- scope: shift-details and unavailability wide-screen review rails, schedule-plan interval continuation actions, unavailability-impact risk continuation actions, local navigation helper, focused tests, and traceability updates only.
- allowed_files_check: `app/shift-details/**`, `app/schedule-plans/**`, `app/unavailability/**`, `components/**`, `lib/review-navigation.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/shift-details/page.tsx`, `app/unavailability/page.tsx`, `app/schedule-plans/[planId]/page.tsx`, `components/schedule-plan-interval-table.tsx`, `components/unavailability-impact-risk-table.tsx`, `lib/review-navigation.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- check_result: failing tests first verified missing rail/action strings; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` then passed with 16 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed; local dev server started on `http://localhost:3014`; local HTTP smoke confirmed `/shift-details`, `/unavailability`, schedule-plan detail, and unavailability-impact detail HTML contained the new rail/action text.
- local_commit_sha: `5be22c2`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### F069-F072 Detail Review Rails

- branch_name: `codex/f060-risk-workbench`
- base_main_commit: `a3a134c`
- remote_status: `branch continued after pushing 5be22c2`
- scope: schedule-plan detail, risk detail, and unavailability-impact detail right-side review rails; detail-page review helper alignment; focused tests; and traceability updates only.
- allowed_files_check: `app/schedule-plans/**`, `app/schedule-risks/**`, `app/unavailability/**`, `components/**`, `lib/review-navigation.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/[planId]/page.tsx`, `app/schedule-risks/[riskId]/page.tsx`, `app/unavailability/[unavailabilityId]/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- check_result: failing tests first verified missing detail-page rail strings; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` then passed with 19 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed; local HTML smoke on `http://localhost:3014` confirmed plan detail, risk detail, and unavailability impact pages contained `当前复核范围 / 复核任务 / 回到全部` text.
- local_commit_sha: `1c70ea8`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### H030 Harness Consistency And Hook Guard

- branch_name: `codex/h030-harness-hook-guard`
- base_main_commit: `a3a134c`
- remote_status: `pushed to origin/codex/h030-harness-hook-guard`
- scope: Harness rule-source alignment, active-task contract tightening, state-check expansion, repo-local hooks, closeout-diff handling, and traceability records only.
- allowed_files_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/harness/lightweight-harness.md`, `docs/PROJECT_STATE.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, `scripts/check.sh`, `scripts/install-hooks.sh`, `scripts/validate-commit-message.mjs`, `scripts/hooks/**`, and related tests; no business code, backend, package, or lockfile files.
- scope_diff_check: same as allowed scope; no business code, backend, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict --diff=working` passed; `node --test scripts/tests/check-state.test.mjs` passed with 20 tests; `node --test scripts/tests/validate-commit-message.test.mjs` passed with 5 tests; `git diff --check` passed; `bash scripts/check.sh` passed; `bash scripts/install-hooks.sh` succeeded.
- local_commit_sha: `fcc8e9e`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### H031 TRACE_INDEX Budget Governance

- branch_name: `codex/h031-risk-governance-reconcile`
- base_main_commit: `5a3a522`
- remote_status: `not_pushed`
- scope: current-state seeding for a state-hygiene task, TRACE_INDEX compaction, registry windowing rule update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/harness/lightweight-harness.md`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no business code, backend, package, or lockfile files.
- scope_diff_check: same as allowed scope; no business code, backend, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict --diff=working` passed with TRACE_INDEX back under budget; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `0b63408`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### H032 Traceability Closeout Guard

- branch_name: `codex/h032-traceability-closeout-guard`
- base_main_commit: `0b63408`
- remote_status: `not_pushed`
- scope: post-closeout traceability-only guard tightening, branch-log SHA backfill, state-check regression expansion, and governance traceability updates only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/harness/lightweight-harness.md`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/decision-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, package, or lockfile files.
- scope_diff_check: same as allowed scope; no business code, backend, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --repair-scope` passed; `node --test scripts/tests/check-state.test.mjs` passed with 23 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending next traceability closeout pass after H032 local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### H033 Startup Seed Strict-State Guard

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `5fd1a21^`
- remote_status: `not_pushed`
- scope: startup-seed state-check guard only; no business code, no dependency, no database, no real integration changes.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/quality/**`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no `app/**`, `components/**`, `lib/**`, `backend/**`, package, or lockfile files.
- scope_diff_check: current closeout/startup-state docs, state-check script, state-check tests, and traceability docs only.
- check_result: `bash scripts/check-state.sh --strict --diff=working` passed; `node --test scripts/tests/check-state.test.mjs` passed with 24 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `5fd1a21`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### H034 Product Closeout Guard

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `5fd1a21`
- remote_status: `pushed to origin/codex/f073-review-checklist-h032`
- scope: product closeout strict-state guard, commit-message closeout guard, current/traceability updates, and governance regression tests only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/decision-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/PROJECT_STATE.md`, `tasks/backlog.yaml`, `scripts/check-state.sh`, `scripts/validate-commit-message.mjs`, and related tests; no business code, backend, package, or lockfile files.
- scope_diff_check: same as allowed scope; no `app/**`, `components/**`, `hooks/**`, `lib/**`, `backend/**`, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict --diff=working` passed; `node --test scripts/tests/check-state.test.mjs` passed with 25 tests; `node --test scripts/tests/validate-commit-message.test.mjs` passed with 7 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `6af4131`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### F073-F076 Shared Review Checklist Rail

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `5fd1a21`
- remote_status: `pushed to origin/codex/f073-review-checklist-h032`
- scope: shared review rail component, page-level rail replacement across risk/plan/shift/unavailability routes, focused source regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/**`, `app/schedule-risks/**`, `app/shift-details/**`, `app/unavailability/**`, `components/**`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/review-checklist-rail.tsx`, the six review routes, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 21 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `8b4234f`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed on branch`
- blocked_reason: `N/A`

### F077-F079 Scoped Detail Navigation

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `8b4234f`
- remote_status: `active tracked branch continuation after pushing 8b4234f`
- scope: scoped detail href builders, drilldown table detail links, detail-page back-link preservation, focused source regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/**`, `app/schedule-risks/**`, `app/unavailability/**`, `components/**`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `lib/review-navigation.ts`, `components/schedule-risk-table.tsx`, `components/unavailability-table.tsx`, `components/unavailability-impact-risk-table.tsx`, `app/schedule-plans/[planId]/page.tsx`, `app/schedule-risks/page.tsx`, `app/schedule-risks/[riskId]/page.tsx`, `app/unavailability/[unavailabilityId]/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 24 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `4c4969cf234ae5aeabb42f3ae9eebbbb0901c9dc`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F080-F082 Plan-Origin Review Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `31de26c`
- remote_status: `active tracked branch continuation after pushing 31de26c`
- scope: schedule-plans source-aware back-link helper, plan-origin context propagation across shift/risk/unavailability pages, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/**`, `app/schedule-risks/**`, `app/shift-details/**`, `app/unavailability/**`, `components/**`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `lib/review-navigation.ts`, `app/schedule-risks/[riskId]/page.tsx`, `app/shift-details/page.tsx`, `app/unavailability/[unavailabilityId]/page.tsx`, `components/unavailability-impact-risk-table.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 26 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F083-F084 Plan-Origin Row-Action Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `f2ea69e`
- remote_status: `active tracked branch continuation after pushing 31de26c`
- scope: plan detail interval-table source propagation, shift-details row-action helper alignment, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `components/schedule-plan-interval-table.tsx`, `components/shift-details-table.tsx`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/schedule-plan-interval-table.tsx`, `components/shift-details-table.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified the missing `schedule-plans` row-action source and raw shift-details hrefs; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 28 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed. Local dev server started on `http://localhost:3014`, but cross-sandbox localhost smoke timed out on approval and was not used as final evidence.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F085 Unavailability Impact Shift-Table Scoped Plan-Link Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `5a21bec`
- remote_status: `push still pending local approval timeout; branch continues locally from the same verified line`
- scope: scoped plan-link preservation for the unavailability impact shift table, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/unavailability/[unavailabilityId]/page.tsx`, `components/unavailability-impact-shift-table.tsx`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/unavailability-impact-shift-table.tsx`, `app/unavailability/[unavailabilityId]/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified the missing helper-based plan link in `UnavailabilityImpactShiftTable`; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 29 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit; branch push is separately blocked by local approval timeout`
- blocked_reason: `git push escalation timed out twice locally; code path and verification remain green`

### F086-F087 Risk Detail Auxiliary-Table Continuation Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `fc81a94`
- remote_status: `push still pending local approval timeout; branch continues locally from the same verified line`
- scope: scoped continuation actions for risk detail related shift/unavailability tables, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-risks/[riskId]/page.tsx`, `components/schedule-risk-shift-table.tsx`, `components/schedule-risk-unavailability-table.tsx`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/schedule-risk-shift-table.tsx`, `components/schedule-risk-unavailability-table.tsx`, `app/schedule-risks/[riskId]/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified the missing helper-driven continuation actions in the two risk-detail auxiliary tables; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 31 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit; branch push is separately blocked by local approval timeout`
- blocked_reason: `git push escalation timed out locally; code path and verification remain green`

### F088-F089 Review List Row-Action Parity Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `05c3365`
- remote_status: `push still pending local approval timeout; branch continues locally from the same verified line`
- scope: scoped row-action parity for risk and unavailability list tables, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `components/schedule-risk-table.tsx`, `components/unavailability-table.tsx`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/schedule-risk-table.tsx`, `components/unavailability-table.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified the missing helper-driven row-action parity in the two list tables; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 33 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit; branch push is separately blocked by local approval timeout`
- blocked_reason: `git push escalation timed out locally; code path and verification remain green`

### F090-F091 Schedule Plan List Review Parity Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `4f68189`
- remote_status: `active tracked branch continuation after pushing 4f68189`
- scope: scoped row-action parity for the schedule plan list table, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `components/schedule-plan-table.tsx`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/schedule-plan-table.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified the missing helper-driven continuation actions in the plan list table; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 34 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F092-F093 Schedule Plan Draft Flow Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `5862def`
- remote_status: `active tracked branch continuation after pushing 4f68189`
- scope: schedule-plan list/detail/new/edit context preservation, helper-driven draft return targets, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/**`, `lib/**`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/page.tsx`, `app/schedule-plans/new/**`, `app/schedule-plans/[planId]/page.tsx`, `app/schedule-plans/[planId]/edit/**`, `lib/review-navigation.ts`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified the missing draft-flow helper exports and missing page/action context preservation; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 36 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F094-F095 Schedule Plan Draft Failure Feedback Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `b0c7981`
- remote_status: `active tracked branch continuation after pushing 4f68189`
- scope: visible draft-failure feedback on schedule-plan list/detail pages, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/page.tsx`, `app/schedule-plans/[planId]/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/page.tsx`, `app/schedule-plans/[planId]/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that draft-failure feedback was missing from both the list and detail pages; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 37 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F096-F097 Schedule Plan Draft Success Feedback Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `d869f0f`
- remote_status: `active tracked branch continuation after pushing d869f0f`
- scope: visible draft-success feedback on schedule-plan detail, create/update redirect parameters, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/[planId]/page.tsx`, `app/schedule-plans/new/actions.ts`, `app/schedule-plans/[planId]/edit/actions.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/[planId]/page.tsx`, `app/schedule-plans/new/actions.ts`, `app/schedule-plans/[planId]/edit/actions.ts`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that success feedback was missing from the plan detail page and success redirects lacked `draft=created/updated`; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 38 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F098-F099 Schedule Plan List Detail Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `b03b43b`
- remote_status: `active tracked branch continuation after pushing b03b43b`
- scope: schedule-plan list to detail context preservation, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/page.tsx`, `components/schedule-plan-table.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/page.tsx`, `components/schedule-plan-table.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that the plan-list `查看` action did not preserve list filter and source context; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 39 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F100-F101 Schedule Plan List-Origin Review Return Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `b7c0038`
- remote_status: `active tracked branch continuation after pushing b7c0038`
- scope: schedule-plan list-origin review return preservation across helper routing, list actions, workbench back links, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-risks/page.tsx`, `app/shift-details/page.tsx`, `app/unavailability/page.tsx`, `components/schedule-plan-table.tsx`, `lib/review-navigation.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-risks/page.tsx`, `app/shift-details/page.tsx`, `app/unavailability/page.tsx`, `components/schedule-plan-table.tsx`, `lib/review-navigation.ts`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: failing tests first verified that plan-list-origin actions still reused the plan-detail source and lacked a stable filtered-list return path; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 41 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F102-F103 Schedule Plan Risk-Entry Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `b7c0038`
- remote_status: `active tracked branch continuation after pushing b7c0038`
- scope: schedule-plans risk-summary entry context preservation, schedule-risk table plan-list review context, helper routing, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/page.tsx`, `app/schedule-risks/page.tsx`, `components/schedule-risk-table.tsx`, `lib/review-navigation.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/page.tsx`, `app/schedule-risks/page.tsx`, `components/schedule-risk-table.tsx`, `lib/review-navigation.ts`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that the schedule-plans risk summary entry, embedded risk preview table, and risk helper route did not preserve plan-list source and status context; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 44 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F104-F105 Schedule Plan Summary CTA Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `2aa426e`
- remote_status: `active tracked branch continuation after pushing 2aa426e`
- scope: schedule-plans summary CTA helper routing, cross-page context preservation, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/page.tsx`, `components/mvp-flow-summary.tsx`, `lib/review-navigation.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/page.tsx`, `components/mvp-flow-summary.tsx`, `lib/review-navigation.ts`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that `MvpFlowSummary` still used a hardcoded risk detail route and lacked helper-driven plan-list context preservation; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 45 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F106-F107 Risk Workbench CTA Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `8763df4`
- remote_status: `active tracked branch continuation after pushing 2aa426e`
- scope: risk-workbench header unavailability CTA context preservation, default back-link fallback correction, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-risks/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-risks/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that the risk-workbench header still used a bare `/unavailability` route and that the no-source fallback still pointed at `schedule-plans`; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 46 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F108 Demand Plan Schedule CTA Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `807c5e3`
- remote_status: `active tracked branch continuation after pushing 807c5e3`
- scope: demand-plan to schedule-plan CTA query preservation, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/demand-plans/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/demand-plans/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that the demand-plans CTA still used a bare `/schedule-plans` route and dropped the active query before handoff; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 47 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F109 Risk Workbench Clear-Scope CTA Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `65e0f6c`
- remote_status: `active tracked branch continuation after pushing 65e0f6c`
- scope: risk-workbench scoped `查看全部` query/status preservation, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-risks/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-risks/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that the scoped `查看全部` CTA still used a bare `/schedule-risks` route and dropped active query/status context when clearing drilldown scope; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 48 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F110-F111 Shift And Unavailability Clear CTA Context Closure

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `8ea7545`
- remote_status: `active tracked branch continuation after pushing 8ea7545`
- scope: shift-details and unavailability clear-scope plus clear-filter CTA context preservation, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/shift-details/page.tsx`, `app/unavailability/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/shift-details/page.tsx`, `app/unavailability/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that `shift-details` and `unavailability` still used bare clear CTAs and dropped source-aware list context; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 50 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F112 Schedule Plans Draft Feedback Context Persistence

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `92c9c99`
- remote_status: `active tracked branch continuation after local closeout commit 92c9c99`
- scope: schedule-plans draft feedback context preservation across list search, status switching, clear-filter actions, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that schedule-plans list interactions still dropped the local `draft` feedback parameter; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 51 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F113 Schedule Plans Draft Feedback Dismiss Action

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `61d5247`
- remote_status: `active tracked branch continuation after pushing 61d5247`
- scope: schedule-plans draft feedback dismiss CTA, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing tests first verified that the schedule-plans list still lacked a same-page dismiss action for local draft feedback; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 52 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F114 Demand Plans Clear CTA Consistency

- branch_name: `codex/f073-review-checklist-h032`
- base_main_commit: `5ddbbe4`
- remote_status: `active tracked branch continuation after local closeout commit 5ddbbe4`
- scope: demand-plans clear CTA helper routing, focused regression tests, current-state closeout, and traceability updates only.
- allowed_files_check: `app/demand-plans/page.tsx`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/demand-plans/page.tsx`, `scripts/tests/dashboard-table-model.test.mjs`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; focused regression verified the demand-plans page no longer uses a bare `/demand-plans` clear route; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 52 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `bash scripts/check-state.sh --strict --diff=staged` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### F115-Q041 Local P1 E2E Parity Reinforcement

- branch_name: `codex/f-batch-002-local-p1-e2e-parity-chain`
- base_main_commit: `d44e82a`
- remote_status: `continuation branch created from pushed codex/f-batch-001-local-p0-p1 because main has not integrated the local acceptance chain yet`
- scope: draft edit route E2E, schedule-plan table parity accessibility reinforcement, focused smoke coverage, current-state closeout, and traceability updates only.
- allowed_files_check: `app/schedule-plans/**`, `components/**`, `lib/**`, `tests/e2e/core-path.spec.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `app/schedule-plans/[planId]/page.tsx`, `components/schedule-plan-table.tsx`, `lib/review-navigation.ts`, `tests/e2e/core-path.spec.ts`, current-state closeout files, and traceability docs only.
- check_result: seed-only staged strict state check passed before product work; failing E2E first verified missing accessible names on schedule-plan table controls and then exposed list-origin draft-detail back-link labeling; `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke` passed with 3 tests; `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 52 tests; `bash scripts/check-state.sh --strict --diff=working` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`

### B008-F116-Q042 Local Demo Import And Placeholder Cleanup

- branch_name: `codex/f-batch-003-local-demo-import-placeholders`
- base_main_commit: `868f2b5aee02273c06be82be48b4e0815922ab1b`
- remote_status: `local continuation branch created from codex/f-batch-002-local-p1-e2e-parity-chain because PM asked to continue the local demo chain before push`
- scope: localhost-only staff master/status/login CSV import loop, local import batch status, visible placeholder cleanup for file import/data-source/sidebar/dashboard row actions, smoke coverage, and traceability updates.
- allowed_files_check: `backend/**`, `app/demo-imports/**`, `app/dashboard/**`, `components/**`, `lib/**`, `tests/e2e/core-path.spec.ts`, `scripts/tests/**`, `docs/**`, `tasks/backlog.yaml`, and `next-env.d.ts`; no package/lockfile, database, ORM, migration, schema, real integration, auth, permissions, approval, export, batch operation, production formula, settlement, or charge-factor files.
- scope_diff_check: pending product implementation after seed commit.
- check_result: pending seed strict-state check.
- local_commit_sha: `pending final local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after verified local commit`
- blocked_reason: `N/A`
