# shadcn dashboard-01 视觉差距审计

## 审计范围

- task_id: `F013`
- requirement_id: `R020`
- story_id: `US032`
- reference_spec: `/Users/mac/Documents/Codex/2026-05-10/computeruse-https-ui-shadcn-com/docs/design/shadcn-dashboard-01-replica-spec.md`
- audit_date: `2026-05-12`

本审计只读当前前端结构，不修改 UI，不安装依赖，不改 `package.json` 或 lockfile。

已检查文件：

- `components.json`
- `package.json`
- `app/globals.css`
- `app/layout.tsx`
- `app/dashboard/page.tsx`
- `components/app-sidebar.tsx`
- `components/site-header.tsx`
- `components/section-cards.tsx`
- `components/chart-area-interactive.tsx`
- `components/data-table.tsx`
- `components/ui/*`

## 当前结论

当前项目已经具备 shadcn 风格的 BPO dashboard 骨架，包括 sidebar、header、metric cards、chart、table、dark/light theme 和业务路由。但它还不是 `dashboard-01` 的 measured-values 复刻。

最关键差距有三类：

1. 主题 token 与官方 New York v4 dashboard 不一致。
2. Sidebar、cards、chart、table 组件结构是项目自研近似版，不是官方 dashboard-01 的组件层级和交互。
3. 若追求接近 1:1，必须确认是否允许新增或变更依赖，例如 `@tabler/icons-react`、TanStack Table、DnD、Select、Tabs、Dropdown、ToggleGroup、Chart 等 shadcn 组件。

## P0 差距

### P0-1 主题 token 未对齐 spec 的 OKLCH/New York v4 变量

当前 `app/globals.css` 使用 HSL 变量，例如 `--background: 0 0% 100%`，并且缺少 `--sidebar`、`--sidebar-accent`、`--sidebar-foreground` 等 dashboard-01 关键 sidebar token。

spec 要求 light/dark 使用 OKLCH token，并通过 `bg-sidebar`、`bg-sidebar-accent`、`border-border` 等语义 token 驱动。当前实现虽然使用了 shadcn 类名，但 token 体系还不是官方 dashboard-01 基线。

影响：

- light/dark 质感会接近普通 shadcn 默认主题，而不是官方 dashboard-01。
- sidebar hover/active、card、border、muted text 在浅色和深色下的灰阶会偏。

是否需要 package/lockfile：不需要。

### P0-2 Sidebar 尺寸与官方结构不一致

spec 目标 sidebar 宽度约 `288px`，当前 `AppSidebar` 展开宽度为 `w-64`，即约 `256px`。当前使用 `bg-background`，不是 `bg-sidebar`。当前 sidebar 结构也不是官方 Acme Inc. + Quick Create + Documents + user menu 的结构，而是项目业务二级导航。

考虑到 PM 之前已确认 BPO 业务导航必须保留，后续实施不应替换业务导航为 Acme demo，而应只对齐尺寸、token、行高、active/hover 质感和折叠行为。

影响：

- 与 dashboard-01 的第一视觉比例差异明显。
- 当前导航项高度 `h-7`，spec sidebar button 约 `32px`，当前略矮。

是否需要 package/lockfile：不需要，除非决定改用官方 shadcn `Sidebar` 组件。

### P0-3 Metric cards 未达到 spec 的尺寸和组件层级

当前 `SectionCards` 使用 `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`，card 自然高度由内容撑开。spec 要求桌面 card 约 `262 x 204`，并使用 `CardHeader / CardTitle / CardAction / CardFooter` 结构，指标值 `30px / 36px / 600`。

当前指标值为 `text-2xl`，约 `24px`，小于 spec；card 未使用 `CardFooter` 或 `CardAction`，也未使用官方 card gradient 处理。

影响：

- 第一屏信息密度和高级感偏弱。
- 在中宽容器下，当前用 viewport 断点，不是官方 container query。

是否需要 package/lockfile：不需要。

### P0-4 dashboard-01 响应式 container query 未实现

spec 明确要求 metric cards 按容器宽度切换：小容器 1 列、`@xl/main` 2 列、`@5xl/main` 4 列。当前实现使用 `sm:grid-cols-2 lg:grid-cols-4`。

影响：

- 在 `1314px` 等边界宽度下，可能不会复现官方 4 列到 2 列的切换。
- 页面在嵌套布局和 sidebar 收起时的 card 宽度行为不稳定。

是否需要 package/lockfile：不需要，Tailwind v4 已支持 container query 语法时可直接改 class。

## P1 差距

### P1-1 图标体系与 1:1 复刻要求冲突

当前 `components.json` 的 `iconLibrary` 是 `lucide`，项目依赖为 `lucide-react`。spec 明确：追求 1:1 应使用 `@tabler/icons-react`，否则图标形态和视觉重心不同。

考虑到 PM 之前要求用 shadcn 官方图标形态还原 theme toggle，当前 ThemeToggle 已手写官方 glyph。下一步若全站 icon 迁移到 Tabler，需要新增依赖并改多处 imports。

是否需要 package/lockfile：需要，如果改用 Tabler。

### P1-2 shadcn 组件缺口较多

当前 `components/ui` 只有：

- `badge`
- `button`
- `card`
- `input`
- `separator`
- `table`

spec 对 dashboard-01 的完整体验需要：

- `checkbox`
- `dropdown-menu`
- `select`
- `sidebar`
- `tabs`
- `toggle-group`
- `chart`

以及可能的 TanStack Table、DnD、Drawer、Pagination、Sonner、Zod。

是否需要 package/lockfile：如果通过 shadcn CLI add 缺失组件，通常会改组件文件；如果新增 TanStack/DnD/Tabler，则会改 package/lockfile。

### P1-3 ChartAreaInteractive 不是官方 range 控件和曲线配置

当前图表使用 Recharts `AreaChart`，但 range 是手写 Button 组，不是 `ToggleGroup` + 小屏 `Select`。当前 `Area type="monotone"`，spec 要求 `type="natural"`；当前为三条 BPO 指标线，不是官方 desktop/mobile stacked area。

业务上保留三条 BPO 指标是合理的，但视觉对齐应改为官方控件结构、自然曲线、渐变 fill、无 vertical grid，并补移动端 range select。

是否需要 package/lockfile：需要补 `toggle-group`、`select`、`chart` shadcn 组件时可能需要 CLI 变更；Recharts 已存在。

### P1-4 DataTable 只是轻量表格，不是官方 dashboard table

当前 `DataTable` 具备搜索、排序、分页占位和行操作按钮，但不包含官方 tabs、column dropdown、checkbox selection、rows per page、TanStack Table、DnD、drawer 等。

spec 中的核心表格结构包括 Tabs、Customize Columns、Add Section、checkbox、drag handle、透明 input、分页 footer、row drawer 和 DnD。当前只满足较早 MVP 需求，不满足 dashboard-01 复刻要求。

是否需要 package/lockfile：完整复刻需要 TanStack Table、DnD、Dropdown、Tabs、Checkbox、Drawer 等依赖或 shadcn 组件。

### P1-5 Header 内容与官方结构不一致

当前 `SiteHeader` 包含搜索、月份按钮、通知、theme toggle。spec 目标为左侧 sidebar toggle、标题 `Documents`、右侧 `Quick Create`。项目保留 BPO 搜索和月份筛选是业务合理选择，但 dashboard-01 视觉对齐需校准 header 内部高度、标题字号、按钮样式和右侧操作密度。

是否需要 package/lockfile：不需要。

## P2 差距

### P2-1 Card radius 接近但未完全对齐

当前 `Card` 使用 `rounded-lg`，token `--radius: 0.625rem`。spec 目标 card 约 `14px`，普通按钮约 `8px`。当前按钮 `rounded-md`、card `rounded-lg` 基本接近，但 token 未用 OKLCH 官方变量，视觉仍会偏。

是否需要 package/lockfile：不需要。

### P2-2 shadcn skill 规则存在可改善点

当前部分 icon 在 Button 内使用显式 `className="size-4"`。本地 shadcn skill 建议 Button 内 icon 用 `data-icon`，避免手写尺寸。但这是项目既有写法，非 F013 实施范围。

是否需要 package/lockfile：不需要。

### P2-3 dashboard 与业务页面视觉不完全一致

`/dashboard` 已有完整 dashboard 骨架；`/schedule-plans`、`/demand-plans`、`/shift-details`、`/unavailability` 等业务页使用同一个 `AppShell`，但内容区 card/table 结构更偏 MVP CRUD 页面。若 F014 做视觉对齐，需要明确是先对 `/dashboard` 做 parity，还是同步拉齐全部业务页。

是否需要 package/lockfile：不需要。

## 需要新增依赖或 package/lockfile 变更的事项

以下事项需要 PM 单独确认：

- 使用 `@tabler/icons-react` 替换或补充 lucide icons。
- 安装 TanStack Table、DnD、Drawer、Sonner、Zod 等官方 dashboard 表格完整体验依赖。
- 使用 shadcn CLI 添加 `sidebar`、`tabs`、`select`、`dropdown-menu`、`checkbox`、`toggle-group`、`chart` 等缺失组件。
- 若通过 shadcn preset 或 CLI 改主题、字体或组件源文件，需要先预览 diff。

以下事项不需要依赖变更，可以作为第一批安全 UI 改造：

- 将 `app/globals.css` token 对齐 spec 的 OKLCH/New York v4 变量。
- 增加 sidebar token 映射。
- 将 sidebar 展开宽度从 `256px` 调整到接近 `288px`。
- 将 sidebar item 高度调整到 `32px`。
- 将 metric cards 改为 container query 布局。
- 将指标值字号调整到 `30px / 36px / 600`。
- 校准 card 高度、padding、header/footer 结构。

## 建议执行顺序

1. `F014-A`：无依赖视觉基线修正。只改 token、sidebar 尺寸、card 尺寸、container query、header 高度和表格行高。
2. `F014-B`：shadcn 组件补齐。确认后通过 CLI 补 `select`、`toggle-group`、`dropdown-menu`、`tabs`、`checkbox`、`chart`。
3. `F014-C`：官方表格交互补齐。确认是否引入 TanStack Table 和 DnD，再做 column controls、row selection、rows per page、drawer、drag sort。
4. `F014-D`：图标与字体 parity。确认是否引入 Tabler icons，并保持 Geist 字体策略。

## 审计结论

可以进入视觉对齐实施，但不建议直接做完整 1:1。推荐先做 `F014-A`，因为它不需要新增依赖，也能显著提升 dashboard-01 质感；之后再由 PM 确认是否接受 package/lockfile 变更，决定是否继续做 `F014-B/C/D`。
