# Project State

## Current Stage

Frontend dashboard scaffold.

## Active Scope

The project now contains a PM-confirmed static frontend prototype for the BPO WFM dashboard. The active implementation scope is limited to a shadcn/ui-style dashboard shell, local mock data, dark / light theme support, and BPO WFM navigation/content replacement.

The project still does not contain backend services, real API integration, database work, authentication, real Excel import, real CORN integration, production permissions, approval flows, export pipelines, or intelligent scheduling algorithms.

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
- F001 is the confirmed exception that allows frontend package files, local mock data, and dashboard UI files for a static prototype only.
- Continuous Delivery Mode is active when the PM explicitly asks to continue through green gates or to finish, test, verify, and commit in one pass. In that mode, completed verified scope should be committed without an extra confirmation pause.

## Development Environment

The project uses Node.js 22 for local development and delivery verification.

Current environment artifacts:

- `.nvmrc`
- `.node-version`
- `docs/dev/setup.md`

`scripts/check.sh` automatically prefers `/opt/homebrew/opt/node@22/bin` when the current shell is not already using Node.js 22. This avoids the local Node.js 24 native package loading issue observed with Next.js / lightningcss on macOS.

This environment decision does not authorize dependency changes, package or lockfile edits, business implementation, backend work, real API integration, database work, permission systems, export pipelines, approval flows, or batch operations outside a confirmed Gate.

## Frontend Direction

Future frontend work is constrained to a professional shadcn/ui-based B2B SaaS admin console for BPO Workforce Management / BPO 人力计划与履约管理平台.

The frontend baseline is shadcn/ui v4 dashboard examples, dashboard-01 block, New York style, and the shadcn dark / light theme system. This direction is a rule for confirmed frontend tasks; it does not authorize new frontend implementation, dependency installation, package changes, mock data, or business code outside a confirmed Gate.

Current dashboard navigation decision: keep icons on first-level sidebar groups only; second-level items use text with badge/tag states to reduce visual noise. The sidebar supports a desktop collapsed rail state, and only the current first-level group is expanded by default.

Current sidebar interaction decision: the collapse / expand trigger belongs in `SiteHeader` as a page-level sidebar control. The sidebar itself stays fixed while the dashboard content scrolls independently.

## Lightweight Harness Direction

The project now uses a documentation-first Lightweight Harness flow for future module requests:

`raw requirement -> user story -> DAG / dependency check -> Gate Plan -> PM confirmation -> scoped execution -> Done Report -> audit`

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

## Subagent Prompt Contract Direction

Subagent prompt templates are now treated as contracts rather than loose role descriptions.

Future subagent execution requires:

- explicit PM/user permission for subagents, delegation, or parallel agent work
- a confirmed Gate Plan
- a dispatch packet with input files, allowed files, forbidden files, stop conditions, acceptance criteria, and verification commands
- structured return status: `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`
- implementation review chain: Implementer -> Spec Reviewer -> Code Quality Reviewer -> Main Worker Integration

This contract does not authorize automatic subagent startup. The main Codex worker remains responsible for integration, verification, task logs, audit records, and Done Report.

## shadcn Skill Direction

The local skill `/Users/mac/.codex/skills/shadcn/SKILL.md` is the project reference for shadcn-specific frontend work.

Use it for:

- UI/UX Agent component selection and dashboard layout planning
- Frontend Agent implementation and component composition
- Implementer work that touches shadcn/ui files or `components.json`
- Code Quality Reviewer checks for shadcn composition, semantic tokens, accessibility, and anti-patterns
- QA Agent UI acceptance checks as a secondary reference

Do not use it as a default PM, Backend, or Doc Agent skill. It does not authorize shadcn CLI mutations, preset changes, package changes, dependency installation, or component overwrites without a confirmed Gate.
