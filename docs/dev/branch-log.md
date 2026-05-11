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
- Recorded that subagents must not start automatically; they require explicit PM/user permission, a confirmed Gate Plan, and non-overlapping write scopes.

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
