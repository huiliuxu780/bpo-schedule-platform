# Project State

## Current Stage

Frontend dashboard scaffold.

## Active Scope

The project now contains a PM-confirmed static frontend prototype for the BPO WFM dashboard. The active implementation scope is limited to a shadcn/ui-style dashboard shell, local mock data, dark / light theme support, and BPO WFM navigation/content replacement.

The project still does not contain backend services, real API integration, database work, authentication, real Excel import, real CORN integration, production permissions, approval flows, export pipelines, or intelligent scheduling algorithms.

## Lab Archive

The previous working project was archived as:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

That archive is read-only reference material for future audits or explicitly approved migration planning.

## Current Rules

- No business implementation without a confirmed task.
- No dependency installation without PM confirmation.
- No package or lockfile changes without PM confirmation.
- No real API, backend, database, or production integration by default.
- Every task must pass `bash scripts/check.sh`.
- F001 is the confirmed exception that allows frontend package files, local mock data, and dashboard UI files for a static prototype only.

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
