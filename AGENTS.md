# AGENTS.md

## Project Identity

- Project name: `bpo-schedule-platform`
- Current stage: frontend dashboard scaffold
- Current development mode: Story Runner first, Gate Plan controlled, continuous delivery when explicitly requested
- Goal: provide an auditable Harness while iterating on a PM-confirmed static BPO WFM dashboard scaffold.

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

## Continuous Delivery Mode

When the PM explicitly asks for continuous execution, such as "别一直停下", "通过就继续下一步", "一口气做完", or "做完测完验证完提交完", Codex should use Continuous Delivery Mode for the current development chain.

In Continuous Delivery Mode, Codex should:

1. Continue to the next already-scoped logical task after a green gate.
2. Run the required verification before reporting completion.
3. Commit the completed, verified scope without asking again.
4. Use a clear English commit message.
5. Continue to respect all stop conditions and forbidden scopes.

Continuous Delivery Mode does not bypass PM confirmation for new risky scope. Codex must still stop when the next step requires:

- new dependencies
- package or lockfile changes
- real external data sources or integrations
- database persistence
- authentication or permission boundaries
- approval, export, or batch-operation capabilities
- production status codes, formulas, settlement rules, or charge factors
- ambiguous destructive Git operations
- failed verification

## Story Runner Mode

When the PM asks to "开始", "继续", "自动走完", "按用户故事开发", "挨个开发完测试完提交完", or otherwise clearly requests continuous delivery from a goal, Codex must use Story Runner Mode.

Story Runner Mode is the default execution model for confirmed product development chains.

In Story Runner Mode, Codex must:

1. Treat the user story as the primary execution unit.
2. Convert the goal into raw requirements and the smallest useful user stories before implementation.
3. Build a Story Execution Queue ordered by dependency and priority.
4. Execute each ready story through implementation, verification, documentation update, and commit when `commit_after_done` or Continuous Delivery Mode allows it.
5. Continue to the next ready story after a green gate without asking again.
6. Keep UI feedback, small visual fixes, and acceptance corrections inside the current story instead of creating a new backlog task for every small adjustment.
7. Update `docs/user-stories.md`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml` so story state remains the source of truth.

Subagents are not automatic in Story Runner Mode. Codex may use subagents only when the PM explicitly authorizes subagents, delegation, or parallel agent work, and only when the work can be split into independent, non-overlapping write scopes. The main Codex worker remains responsible for dispatch design, integration, final verification, commits, and Done Report.

Codex should only pause in Story Runner Mode when:

- the next story is blocked by PM/product ambiguity
- the next step needs new dependencies, package or lockfile changes
- the next step needs real external data, database persistence, authentication, permissions, approval, export, batch operation, or production workflow capability
- the next step changes production status codes, formulas, settlement rules, or charge factors
- subagent write scopes would overlap or conflict
- verification fails
- the requested action is destructive or ambiguous

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

## Project Stage Rule

The project started as a clean Harness workspace, but `F001` is now the confirmed exception that allows a static frontend dashboard scaffold.

The confirmed F001 scope allows:

- frontend package files
- shadcn/ui-style dashboard UI files
- local static mock data for the dashboard prototype
- dark / light theme support
- BPO WFM navigation and content replacement

Outside confirmed tasks such as F001, any future product work must first enter the backlog, pass the appropriate Gate Plan, and receive PM confirmation when required.

## Lightweight Harness Workflow

This project uses a documentation-first Lightweight Harness during the frontend dashboard scaffold stage.

The required flow for new product or module requests is:

```txt
raw requirement -> user story -> DAG / dependency check -> Gate Plan -> PM confirmation when required -> scoped execution -> check -> Done Report -> audit
```

### Raw Requirements

New module requests and PM-provided requirement points must first be recorded in `docs/raw-requirements.md`.

Each raw requirement should include:

- stable ID, such as `R001`
- module
- original description
- source
- submitted date
- version
- status
- notes

Do not convert a raw requirement directly into implementation before user-story splitting and Gate review.

### User Stories

Raw requirements should be split into user stories in `docs/user-stories.md`.

Each user story should include:

- stable ID, such as `US001`
- linked raw requirement IDs
- module
- user role
- story description
- task type
- priority
- acceptance criteria
- dependencies
- status

Every user story must trace back to at least one raw requirement.

### DAG And Dependency Rules

The Harness must check dependencies before implementation planning.

Block and record the task when:

- business formulas are not confirmed
- status codes are not confirmed
- permission boundaries are not confirmed
- export, approval, or batch-operation rules are not confirmed
- real data sources or integrations are not confirmed
- user-story dependencies form a cycle

DAG tracking is documentation-based unless a future confirmed task introduces scripts or dependencies.

### Subagent Prompt Templates

Subagent prompt templates live under `docs/prompts/`.

The templates cover:

- PM Agent
- UI/UX Agent
- Frontend Agent
- Backend Agent
- QA Agent
- Doc Agent

These templates do not authorize automatic multi-agent execution. Subagents may only be used when the task is clearly split, write scopes do not conflict, and PM confirmation allows that execution mode.

### Logs And Audit

Task progress and decisions must be traceable through:

- `docs/task-log.md`
- `docs/decision-log.md`
- `docs/audit-report.md`
- `docs/dev/branch-log.md`

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

These rules are mandatory for future frontend tasks, but they do not authorize new frontend implementation outside a confirmed Gate. Any frontend page, dependency, package change, mock data, or business implementation still requires an explicit backlog task and PM confirmation when required by the gate.

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
  theme-toggle.tsx
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
