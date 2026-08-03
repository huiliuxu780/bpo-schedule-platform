# shadcn dashboard-01 视觉对齐实施报告

## 实施范围

- task_id: `F014`
- requirement_id: `R020`
- story_id: `US033`
- implementation_date: `2026-05-12`

本轮执行的是无新增依赖版本的视觉基线对齐。未修改 `package.json` 或 lockfile，未引入 Tabler icons、TanStack Table、DnD、Drawer 或新的 shadcn 组件。

## 已完成对齐

### Token

- `app/globals.css` 从 HSL 默认变量切换为 dashboard-01 spec 对齐的 OKLCH token。
- 新增 sidebar token：`--sidebar`、`--sidebar-foreground`、`--sidebar-accent`、`--sidebar-accent-foreground`。
- `@theme inline` 改为直接使用 CSS variable，支持 OKLCH token。
- Recharts tooltip 和 area chart color 改为 `var(--token)`，避免 `hsl(var(...))` 与 OKLCH token 冲突。

### Sidebar

- 展开宽度从 `w-64` 调整为 `w-72`，接近 spec 的 `288px`。
- 背景从 `bg-background` 调整为 `bg-sidebar`。
- 一级和二级导航行高从约 `28px` 调整到约 `32px`。
- hover/active 使用 sidebar accent token。

### Header

- 保持 `48px` 高度。
- 标题字号从 `text-sm font-semibold` 调整为更接近官方 header 的 `text-base font-medium`。

### Metric cards

- `SectionCards` 改为 container query：小容器 1 列、`@xl/main` 2 列、`@5xl/main` 4 列。
- card 最小高度调整为 `204px`。
- 指标数字调整为 `30px / 36px / 600`。
- card 使用轻量 `bg-gradient-to-t`，更接近官方视觉层次。
- 补充 `CardFooter` 组件并把指标说明移到底部。

### Chart

- Area curve 从 `monotone` 调整为 `natural`。
- chart color 与 tooltip token 兼容 OKLCH。

### Table

- table header 增加 muted header background。
- table cell padding 从 `p-2` 调整到 `p-3`，提高 body row 高度，更接近 spec 的约 `53px` 行高。

## 仍存在差异

以下差异没有在本轮处理，因为会触发依赖、组件补齐或更大范围交互改造：

- 图标体系仍是 `lucide-react`，不是 spec 推荐的 `@tabler/icons-react`。
- 当前没有引入官方 `Sidebar` shadcn 组件，仍保留项目自有 `AppSidebar`。
- 图表 range control 仍是 Button 组，不是 `ToggleGroup` + 移动端 `Select`。
- DataTable 尚未补齐 TanStack Table、DnD、column dropdown、row selection、rows per page、drawer 等完整 dashboard-01 交互。
- 业务页面已经继承 token 和基础 shell，但部分 CRUD 页的卡片和表格结构还未逐页细调到 dashboard-01 measured values。

## 后续建议

1. 若继续追求更高复刻度，先确认是否允许新增 shadcn 组件：`toggle-group`、`select`、`dropdown-menu`、`tabs`、`checkbox`、`chart`。
2. 若要完整 table parity，再确认 TanStack Table、DnD 和 Drawer 相关依赖。
3. 若要接近 1:1 图标视觉，确认是否引入 `@tabler/icons-react` 并迁移 icon imports。
