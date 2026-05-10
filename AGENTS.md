# AGENTS.md

## Project Identity

- Project name: `bpo-schedule-platform`
- Current stage: clean Harness initialization
- Current development mode: Gate Plan first, small checkpoints, no business code by default
- Goal: provide a minimal, auditable Harness before any product implementation starts.

## Project Root

- The project root is `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform/`.
- Codex must use this directory as the working directory for this clean project.

## Language Policy

This project uses a dual-language policy.

### Code-facing Language: English

Use English for file names, folder names, variable names, function names, class names, component names, type/interface names, API names, route names, branch names, commit messages, test names, and technical comments when comments are necessary.

Do not use Chinese pinyin for code identifiers.

### PM-facing Language: Chinese

Use Chinese for Gate Plan, Done Report, PRD explanation, PM confirmation questions, acceptance guides, branch-log summaries, product decisions, and business-facing UI copy.

### Machine-readable Files

For JSON/YAML/structured files, use English keys. Business-facing values may use Chinese.

Do not translate existing code identifiers, route names, file paths, package names, CLI commands, or API field names unless the PM explicitly asks.

## Harness Entry

Before every non-trivial task, Codex must read:

1. `AGENTS.md`
2. `docs/PROJECT_STATE.md`
3. `tasks/backlog.yaml`
4. `docs/quality/GATE_REGISTRY.md`

If the user gives only a task ID, Codex must find the task in `tasks/backlog.yaml` before acting.

## Execution Flow

Every non-trivial task must follow this order:

1. Read rules and task context.
2. Output a Chinese Gate Plan.
3. Stop for PM confirmation whenever the task requires confirmation.
4. Only modify files allowed by the confirmed scope.
5. Run `bash scripts/check.sh`.
6. Update `docs/dev/branch-log.md`.
7. Output a Chinese Done Report.
8. Suggest whether to commit, but do not commit unless the user explicitly asks.

## Default Scope Constraints

Unless the current user instruction explicitly allows it, Codex must not:

- develop business features
- create frontend pages
- create backend services or databases
- connect real APIs
- add mock business data
- install dependencies
- modify `package.json` or lockfiles
- import from archived or external legacy code
- create production permissions, approval, export, or batch-operation capabilities
- change business metrics, status codes, settlement formulas, or charge factors

## Clean Project Rule

This clean workspace intentionally contains no active business implementation. Any future product work must first enter the backlog, pass the appropriate Gate Plan, and receive PM confirmation when required.

## Product And Frontend Identity

This project is a BPO Workforce Management / BPO 人力计划与履约管理平台.

Future frontend work must be built as a professional B2B SaaS admin console.

Core business concepts include:

- 博西预测需求
- BPO 排班计划
- CORN 坐席状态变更日志
- 0.5h 时段标准化
- 排班实现率
- 排班拟合度
- 排班遵守率
- 异常工时
- 可结算工时

## Frontend Design And Development Rules

These rules are mandatory for future frontend tasks, but they do not authorize frontend implementation during clean Harness initialization. Any frontend page, dependency, package change, mock data, or business implementation still requires an explicit backlog task and PM confirmation when required by the gate.

### Frontend Golden Rule

All frontend UI development must strictly follow shadcn/ui conventions.

Do not invent a custom design system unless explicitly requested.

Use shadcn/ui as the primary source of truth for:

- layout
- sidebar
- header
- cards
- tables
- tabs
- dropdowns
- buttons
- forms
- dialogs
- sheets
- badges
- charts
- theme tokens
- dark / light mode

This project should look and behave like a professional shadcn-based SaaS admin platform, not a flashy dashboard or generic CRUD backend.

### Required UI Baseline

For dashboard and admin pages, use the official shadcn dashboard examples as the implementation baseline.

Primary references:

- shadcn/ui v4 Examples Dashboard
- shadcn dashboard-01 block
- shadcn New York style
- shadcn dark / light theme system

The goal is not to loosely "take inspiration". The goal is to preserve the official shadcn layout, spacing, hierarchy, component rhythm, and theme behavior, then replace the content with BPO WFM business data.

### Do Not Hand-Roll UI

Do not create one-off custom UI components when a shadcn/ui component exists.

Prefer existing shadcn/ui components:

- Button
- Card
- Badge
- Table
- Tabs
- DropdownMenu
- Select
- Dialog
- Sheet
- Sidebar
- Separator
- Tooltip
- Input
- Command
- Chart components if already available

Avoid:

- hand-written button styles
- custom table implementations
- custom dropdowns
- random CSS-only widgets
- giant single-file dashboard components
- large inline style objects
- hardcoded visual patterns that bypass the design system

### Use shadcn Theme Tokens

Do not hardcode large amounts of colors.

Use shadcn / Tailwind semantic tokens:

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-muted`
- `bg-primary`
- `text-primary-foreground`
- `bg-destructive`
- `text-destructive-foreground`

Avoid excessive use of:

- `bg-[#xxxxxx]`
- `text-[#xxxxxx]`
- arbitrary gradients
- one-off color systems
- large custom palettes

Only use specific colors for business status where necessary:

- success
- warning
- destructive
- info

### Dark / Light Mode Is Mandatory

All frontend pages must support both dark and light themes.

Use the existing shadcn / next-themes setup if available. If theme support is missing, add `next-themes`, `ThemeProvider`, and `ThemeToggle` only inside a confirmed frontend task that allows dependency and package changes.

Do not build pages that only look correct in one theme.

Every component must be checked in:

- light mode
- dark mode

### Sidebar Rules

The app must use a professional two-level sidebar.

Primary navigation:

- 运营工作台
- 计划与排班
- 履约监控
- 结算复盘
- 数据与集成
- 系统管理

Secondary navigation must have icons.

Every sidebar item must align by fixed columns:

- icon column
- label column
- badge / tag column
- chevron / action column if needed

Do not use emoji icons.

Use `lucide-react` icons or the project's existing icon system.

Current active item must have a clear selected state.

### Dashboard Structure

Dashboard pages should follow the shadcn dashboard layout pattern:

- `AppSidebar`
- `SiteHeader`
- `SectionCards`
- `ChartAreaInteractive`
- `DataTable`
- optional supporting panels

Do not implement dashboards as a single giant file.

Expected component structure:

```txt
components/
  app-sidebar.tsx
  site-header.tsx
  section-cards.tsx
  chart-area-interactive.tsx
  data-table.tsx
  bpo-heatmap.tsx
  data-sync-status.tsx
```

## Archive Boundary

The previous project workspace has been archived outside this clean root as:

- `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

The lab archive is reference material only. Codex must not import from it, wire it into build/lint/check flows, or copy large modules into active source without a confirmed migration task.

## Verification Requirement

- Every task must run `bash scripts/check.sh` before it is reported complete.
- Documentation-only changes also require check.
- If check fails, the Done Report must explain the failure and recommended next action.

## Documentation Rules

- Task progress must update `docs/dev/branch-log.md`.
- Important scope decisions must update `docs/PROJECT_STATE.md`.
- Done Reports should follow `docs/quality/DONE_REPORT_TEMPLATE.md`.
