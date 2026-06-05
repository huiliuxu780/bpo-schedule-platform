# Frontend Rules

本文件记录 BPO WFM 前端设计与开发规则。`AGENTS.md` 保留短版入口；具体 UI 约束以本文为准，且仍受 backlog task Gate、`allowed_files`、`forbidden_files` 和 stop conditions 控制。

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

## Frontend Gate Boundary

These rules are mandatory for future frontend tasks, but they do not authorize new frontend implementation outside a confirmed Gate. Any frontend page, dependency, package change, mock data, or business implementation still requires an explicit backlog task and PM confirmation when required by the Gate.

## Frontend Golden Rule

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

## Required UI Baseline

For dashboard and admin pages, use the official shadcn dashboard examples as the implementation baseline.

Primary references:

- shadcn/ui v4 Examples Dashboard
- shadcn dashboard-01 block
- shadcn New York style
- shadcn dark / light theme system

The goal is not to loosely "take inspiration". The goal is to preserve the official shadcn layout, spacing, hierarchy, component rhythm, and theme behavior, then replace the content with BPO WFM business data.

## Do Not Hand-Roll UI

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

## Use shadcn Theme Tokens

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

## Dark / Light Mode Is Mandatory

All frontend pages must support both dark and light themes.

Use the existing shadcn / next-themes setup if available. If theme support is missing, add `next-themes`, `ThemeProvider`, and `ThemeToggle` only inside a confirmed frontend task that allows dependency and package changes.

Do not build pages that only look correct in one theme.

Every component must be checked in:

- light mode
- dark mode

## Sidebar Rules

The app must use a professional two-level sidebar.

Primary navigation:

- 运营工作台
- 计划与排班
- 履约监控
- 结算复盘
- 数据与集成
- 系统管理

Primary navigation must have icons.

Secondary navigation should not use icons by default. Keep second-level items text-first with optional badge or tag states, unless a later confirmed frontend Gate explicitly restores secondary icons.

Every sidebar item must align by fixed columns:

- icon column
- label column
- badge / tag column
- chevron / action column if needed

Do not use emoji icons.

Use `lucide-react` icons or the project's existing icon system for places where icons are required.

Current active item must have a clear selected state.

## Dashboard Structure

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
  theme-toggle.tsx
```
