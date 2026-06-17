# User Stories

本文件记录由原始需求拆分出来的用户故事、最小交付单元、依赖关系和验收标准。

## Schema

```yaml
- id: US001
  requirement_ids:
    - R001
  module: "模块名称"
  role: "用户角色"
  story: "作为某类用户，我希望完成某个动作，以便获得某个业务价值。"
  task_type: "product"
  priority: "P0"
  acceptance:
    - "验收标准 1"
    - "验收标准 2"
  dependencies: []
  status: "draft"
```

### US829 - Dashboard anomaly table 产品归属审计

```yaml
id: US829
requirement_ids:
  - R909
module: "运营工作台"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望审计 `/dashboard` anomaly table 的产品归属和后续方向，以便决定它应保留为总览摘要、迁入异常复核链路，还是继续作为本地展示表暂缓改造。"
task_type: "frontend-audit"
priority: "P1"
acceptance:
  - "读取 `/dashboard`、`components/data-table.tsx`、`app/dashboard/data.ts`、历史 dashboard parity 需求和当前 MainTableShell 收口文档。"
  - "明确 dashboard anomaly table 当前产品 owner、当前责任和不应承担的业务责任。"
  - "给出后续 2-3 条产品路径，并标明哪些路径需要新的产品 Gate。"
  - "不修改 `app/**`、`components/**`、`hooks/**`、`lib/**`、后端、依赖或 package/lockfile。"
  - "完成后 current queue 与 active tasks 回到空，不保留 done history。"
dependencies:
  - "US828"
status: "done"
notes: "IM209 已完成：dashboard anomaly table 当前保留为经营总览的本地 overview widget，不进入 MainTableShell 机械迁移队列。"
```

### US828 - MainTableShell 收口与 data-table 暂缓决策

```yaml
id: US828
requirement_ids:
  - R908
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望收口 SimpleTable 与 MainTableShell 表格抽象链路，以便确认 `data-table` 暂缓迁移并把下一阶段产品优先级从技术债切回业务价值。"
task_type: "frontend-audit"
priority: "P1"
acceptance:
  - "明确 IM197-IM207 已完成的表格抽象边界和当前收益。"
  - "明确 `components/data-table.tsx` 暂缓迁移的产品原因：它属于 `/dashboard` 异常演示表，产品 owner、路由责任和真实业务用途尚未重新确认。"
  - "更新 MainTableShell 边界文档，写清重新评估 `data-table` 的前置条件。"
  - "不修改 `app/**`、`components/**`、`hooks/**`、`lib/**`、后端、依赖或 package/lockfile。"
  - "完成后 current queue 与 active tasks 回到空，不保留 done history。"
dependencies:
  - "US827"
status: "done"
notes: "IM208 已完成：当前表格抽象链路收口，`data-table` 继续暂缓，下一阶段应回到业务价值更清晰的产品切片。"
```

### US827 - MainTableShell 第二刀迁移 unavailability-table

```yaml
id: US827
requirement_ids:
  - R907
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望把不可用管理主表迁移到 MainTableShell，以便复用主表布局、列显隐、分页和渲染壳层，同时保留不可用记录的业务筛选、摘要、影响入口和班次入口。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`components/main-table-shell.tsx` 支持 embedded 模式，避免在已有页面 Card 内再渲染一层 Card。"
  - "`components/unavailability-table.tsx` 改为传入列定义、筛选后的数据、摘要和 toolbar，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留不可用表搜索、状态筛选、列显隐、分页、排序、汇总、影响链接、班次链接、空状态文案和业务数据不变。"
  - "扩展结构测试，防止 `unavailability-table` 重新拥有主表渲染循环，并防止 `data-table` 在任务前提前接入 MainTableShell。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US826"
status: "done"
notes: "IM207 已完成：MainTableShell 第二刀只迁移不可用管理主表，页面外层 Card 与业务职责保持原位。"
```

### US826 - MainTableShell 首刀迁移 schedule-plan-table

```yaml
id: US826
requirement_ids:
  - R906
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望先把排班计划主表迁移到 MainTableShell，以便共享主表布局、列显隐、分页和渲染壳层，同时不把排班计划的业务筛选、摘要、列定义或详情入口抽进通用组件。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增 `components/main-table-shell.tsx`，拥有 TanStack Table 渲染、排序、列显隐、分页、empty row 和 toolbar/summary slot。"
  - "`components/schedule-plan-table.tsx` 改为传入列定义、筛选后的数据、摘要和 toolbar，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留排班计划搜索、状态筛选、缺口筛选、列显隐、分页、排序、汇总、详情链接、空状态文案和业务数据不变。"
  - "扩展结构测试，防止 `schedule-plan-table` 重新拥有主表渲染循环，并防止 `unavailability-table`/`data-table` 在各自任务前提前接入 MainTableShell。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US825"
status: "done"
notes: "IM206 已完成：MainTableShell 首刀只迁移排班计划主表，业务职责仍留在具体表格。"
```

### US825 - MainTableShell 结构护栏

```yaml
id: US825
requirement_ids:
  - R905
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望先用文档和结构测试锁住 MainTableShell 边界，以便未来实现主表壳层时不会提前混入业务列、动作、路由、查询参数或业务语义。"
task_type: "frontend-audit"
priority: "P1"
acceptance:
  - "新增 `docs/design/main-table-shell-structure-guard.md`，列出未来 shell 允许和禁止拥有的职责。"
  - "新增 `scripts/tests/main-table-shell-structure.test.mjs`，保护 IM204 的候选顺序、职责边界和 no-implementation 约束。"
  - "测试确认 IM205 不创建 `components/main-table-shell.tsx`，也不让候选表提前 import/render MainTableShell。"
  - "不修改 UI 代码、页面、路由、后端、依赖或 package/lockfile。"
dependencies:
  - "US824"
status: "done"
notes: "IM205 已完成：只新增 docs/test 结构护栏，未进入 UI 实现。"
```

### US824 - MainTableShell 边界规格

```yaml
id: US824
requirement_ids:
  - R904
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望在迁移主列表/工作台表格前先定义 MainTableShell 边界，以便避免把搜索、筛选、分页、动作和业务语义误塞进轻量 SimpleTable。"
task_type: "frontend-audit"
priority: "P1"
acceptance:
  - "新增 `docs/design/main-table-shell-boundary-spec.md`，说明为什么不继续机械迁移剩余 useReactTable。"
  - "规格明确 `SimpleTable` 只适用于轻量子表格，未来 `MainTableShell` 只拥有布局、列显隐、分页和渲染壳层。"
  - "规格给出 `schedule-plan-table`、`unavailability-table`、`data-table` 的候选优先级和暂缓理由。"
  - "不修改 UI 代码、页面、路由、后端、依赖或 package/lockfile。"
dependencies:
  - "US823"
status: "done"
notes: "IM204 已完成：先写边界规格，不进入主表实现。"
```

### US823 - SimpleTable 第七刀迁移 shift-details-table

```yaml
id: US823
requirement_ids:
  - R903
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望把班次明细表迁移到共享 SimpleTable，以便完成当前低风险轻量表格迁移链并在进入主列表抽象前停止复盘。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`components/shift-details-table.tsx` 只保留列定义和 `SimpleTable` 调用，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留班次明细表的列、计划链接、排序入口、默认 `plan_date` 排序、空状态文案和业务数据不变。"
  - "扩展结构测试覆盖 `shift-details-table`，防止重复渲染循环回流。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US822"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有表格视觉与交互，不做重设计。"
```

### US818 - SimpleTable 第二刀迁移 schedule-plan-interval-table

```yaml
id: US818
requirement_ids:
  - R898
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望把排班计划时段子表格迁移到共享 SimpleTable，以便在第二个低风险表格上验证轻量表格抽取模式。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`components/schedule-plan-interval-table.tsx` 只保留列定义和 `SimpleTable` 调用，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留排班计划时段表的列、排序入口、默认 `interval_start` 排序、空状态文案和业务数据不变。"
  - "扩展结构测试覆盖 `schedule-plan-interval-table`，防止重复渲染循环回流。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US817"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有表格视觉与交互，不做重设计。"
```

### US819 - SimpleTable 第三刀迁移 schedule-risk-shift-table

```yaml
id: US819
requirement_ids:
  - R899
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望把排班风险班次子表格迁移到共享 SimpleTable，以便继续压缩轻量子表格里的重复 TanStack 渲染循环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`components/schedule-risk-shift-table.tsx` 只保留列定义和 `SimpleTable` 调用，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留排班风险班次表的列、排序入口、默认 `plan_id` 排序、空状态文案和业务数据不变。"
  - "扩展结构测试覆盖 `schedule-risk-shift-table`，防止重复渲染循环回流。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US818"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有表格视觉与交互，不做重设计。"
```

### US820 - SimpleTable 第四刀迁移 schedule-risk-unavailability-table

```yaml
id: US820
requirement_ids:
  - R900
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望把排班风险不可用记录子表格迁移到共享 SimpleTable，以便继续压缩轻量子表格里的重复 TanStack 渲染循环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`components/schedule-risk-unavailability-table.tsx` 只保留列定义和 `SimpleTable` 调用，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留排班风险不可用记录表的列、排序入口、默认 `staff_name` 排序、空状态文案和业务数据不变。"
  - "扩展结构测试覆盖 `schedule-risk-unavailability-table`，防止重复渲染循环回流。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US819"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有表格视觉与交互，不做重设计。"
```

### US821 - SimpleTable 第五刀迁移 unavailability-impact-shift-table

```yaml
id: US821
requirement_ids:
  - R901
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望把不可用影响班次子表格迁移到共享 SimpleTable，以便继续压缩轻量子表格里的重复 TanStack 渲染循环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`components/unavailability-impact-shift-table.tsx` 只保留列定义和 `SimpleTable` 调用，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留不可用影响班次表的列、计划链接、排序入口、默认 `plan_id` 排序、空状态文案和业务数据不变。"
  - "扩展结构测试覆盖 `unavailability-impact-shift-table`，防止重复渲染循环回流。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US820"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有表格视觉与交互，不做重设计。"
```

### US822 - SimpleTable 第六刀迁移 unavailability-impact-risk-table

```yaml
id: US822
requirement_ids:
  - R902
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望把不可用影响风险子表格迁移到共享 SimpleTable，以便继续压缩轻量子表格里的重复 TanStack 渲染循环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`components/unavailability-impact-risk-table.tsx` 只保留列定义和 `SimpleTable` 调用，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留不可用影响风险表的列、明细链接、排序入口、默认 `risk_level` 排序、空状态文案和业务数据不变。"
  - "扩展结构测试覆盖 `unavailability-impact-risk-table`，防止重复渲染循环回流。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
dependencies:
  - "US821"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有表格视觉与交互，不做重设计。"
```

### US817 - SimpleTable 首刀迁移 demand-plan-table

```yaml
id: US817
requirement_ids:
  - R897
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望先把一个轻量子表格迁移到共享 SimpleTable，以便验证表格分层抽取方式后再扩展到更多表格。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增 `components/simple-table.tsx`，集中轻量表格的 TanStack Table 渲染、排序和空状态。"
  - "`components/demand-plan-table.tsx` 只保留列定义和 `SimpleTable` 调用，不再直接拥有 `useReactTable`、`flexRender` 或 shadcn Table 渲染循环。"
  - "保留预测需求表的列、排序入口、默认排序、空状态文案和业务数据不变。"
  - "不修改页面、路由、业务文案、后端、依赖或 package/lockfile。"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有表格视觉与交互，不做重设计。"
```

### US816 - 共享列表搜索与状态筛选控件

```yaml
id: US816
requirement_ids:
  - R896
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望四个旧列表页复用一致的搜索栏和状态筛选控件，以便列表筛选交互不继续复制局部 JSX。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增 `SearchInputBar` 和 `StatusFilterPills` 两个可组合控件，沿用现有 shadcn Button/Input 外观。"
  - "`/demand-plans`、`/schedule-plans`、`/shift-details`、`/unavailability` 不再保留重复搜索栏 JSX。"
  - "`/demand-plans` 只使用 `SearchInputBar`，不渲染状态筛选；其他三页保留现有状态筛选和清空能力。"
  - "不修改页面路由、查询参数、业务文案、后端、依赖或 package/lockfile。"
status: "done"
notes: "已完成。Product Design brief 已回放：保持现有列表筛选视觉与交互，不做重设计。"
```

### US780 - 职场详情只读服务团队关系

```yaml
id: US780
requirement_ids:
  - R860
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在职场详情页看到该职场下的自有服务团队和供应商服务团队，以便理解一个职场同时承载自有团队与供应商团队的关系，而不是进入单独的抽象模块。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "职场详情页服务团队表按该职场自有人员的 organization_id / organization_path 聚合自有团队。"
  - "职场详情页服务团队表按该职场 binding 的 supplier_id 聚合供应商团队，并展示供应商主数据名称。"
  - "服务团队表展示团队类型、服务团队、供应商、人员/绑定数、状态、有效期和来源批次。"
  - "空态仍为 `暂无该职场服务团队记录。`。"
  - "不新增导航、表单、后端 route、schema/migration、合同、结算、最低人力、权限、审批、导出、批量操作或自动排班。"
dependencies:
  - "US779"
status: "done"
notes: "IM160 已完成：职场详情页只读展示自有服务团队和供应商服务团队聚合关系，保持在职场详情上下文内，不新增独立模块或维护动作。"
```

### US781 - 职场服务团队本地维护对象

```yaml
id: US781
requirement_ids:
  - R861
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在职场详情页内维护该职场的服务团队对象，以便把自有团队和供应商团队关系落到明确记录，而不是继续依赖只读推导。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "/master-data/sites/[workplaceId] 的服务团队表读取本地职场服务团队对象，并保留在职场详情上下文内。"
  - "服务团队新增和编辑进入职场详情下的子页面，不在详情页或列表页塞表单。"
  - "服务团队冻结使用 Dialog 确认，不做批量冻结。"
  - "自有服务团队要求绑定组织，供应商服务团队要求绑定供应商主数据。"
  - "不新增 Sidebar 导航、合同、结算比例、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。"
dependencies:
  - "US780"
status: "done"
notes: "IM161 已完成：职场详情内的服务团队对象可本地维护，新建/编辑走子页面，冻结走 Dialog，并保持在职场详情上下文内。"
```

### US782 - 职场服务团队详情页

```yaml
id: US782
requirement_ids:
  - R862
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望从职场详情页进入单个服务团队详情页，以便在不离开职场上下文的情况下核对该服务团队的基础信息和归属来源。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/sites/[workplaceId] 的服务团队表提供查看详情入口。"
  - "/master-data/sites/[workplaceId]/service-teams/[serviceTeamId] 展示服务团队 ID、团队名称、团队类型、归属职场、组织或供应商来源、状态、生效期和来源批次。"
  - "详情页提供返回职场详情、编辑服务团队和冻结服务团队入口；编辑继续进入现有编辑子页面，冻结继续使用 Dialog。"
  - "未找到服务团队时显示明确空态，不跳到独立主数据模块。"
  - "不新增 Sidebar 导航、后端 route、schema/migration、关联人员列表、人员分配、合同、结算比例、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。"
dependencies:
  - "US781"
status: "done"
notes: "IM162 已完成：服务团队详情页保持在职场详情子路由内，展示基础信息和来源信息；关联人员只读列表留给 IM163。"
```

### US783 - 服务团队详情关联人员只读列表

```yaml
id: US783
requirement_ids:
  - R863
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在单个职场服务团队详情页看到该团队当前关联的人员，以便核对团队边界，而不是进入人员分配或新模块。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/sites/[workplaceId]/service-teams/[serviceTeamId] 增加只读关联人员区域。"
  - "自有服务团队按同职场且同 organization_id 的人员匹配。"
  - "供应商服务团队按同职场且同 supplier_id 的绑定关系匹配人员，并对同一人员去重。"
  - "关联人员区域展示姓名、人员 ID、人员类型、组织、职场、技能、状态和匹配来源。"
  - "无匹配人员时显示明确空态，不提供新增、分配、批量、导出或维护动作。"
  - "不新增 Sidebar 导航、后端 route、schema/migration、人员分配、合同、结算比例、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。"
dependencies:
  - "US782"
status: "done"
notes: "IM163 已完成：只在服务团队详情页补关联人员只读列表，不增加人员分配或新模块。"
```

### US784 - 供应商详情服务团队只读链路

```yaml
id: US784
requirement_ids:
  - R864
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在供应商详情页看到该供应商绑定的职场服务团队，并能进入对应服务团队详情继续核对关联人员。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/vendors/[vendorId] 增加只读服务团队区域。"
  - "服务团队区域只展示 supplier_id 等于当前供应商的职场服务团队记录。"
  - "每行展示服务团队名称、归属职场、状态、生效期、来源批次，并提供进入既有服务团队详情页的链接。"
  - "无服务团队时显示明确空态，不提供新增、分配、批量、导出或维护动作。"
  - "不新增 Sidebar 导航、后端 route、schema/migration、人员分配、合同、结算比例、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。"
dependencies:
  - "US783"
status: "done"
notes: "IM164 已完成：只在供应商详情页补服务团队只读链路，不新增维护动作或新模块。"
```

### US785 - 客服人员详情只读业务链路

```yaml
id: US785
requirement_ids:
  - R865
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望从客服人员列表进入单个人员详情页，以便核对该人员的基础信息、组织、职场、技能集合和服务团队关系。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/agents 列表行提供查看详情入口。"
  - "/master-data/agents/[employeeId] 展示人员基础信息、组织、职场、人员类型、状态、有效期和技能集合。"
  - "详情页只读展示该人员关联的职场服务团队，并链接到既有服务团队详情页。"
  - "无关联服务团队时显示明确空态，不提供人员分配、新增、批量或导出动作。"
  - "不新增 Sidebar 导航、后端 route、schema/migration、权限、审批、导出、批量操作、合同、结算、最低人力、自动排班、生产公式或收费因子。"
dependencies:
  - "US784"
status: "done"
notes: "IM165 已完成：客服人员列表新增行内查看详情入口，详情页只读展示人员基础信息、技能集合和关联服务团队。"
```

### US786 - 组织详情只读业务链路

```yaml
id: US786
requirement_ids:
  - R866
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望从组织列表进入单个组织详情页，以便核对该组织的基础信息、直接下级组织和当前归属人员。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/organizations 列表行提供查看详情入口。"
  - "/master-data/organizations/[organizationId] 展示组织基础信息、层级、上级组织、组织路径、状态、有效期和来源批次。"
  - "详情页只读展示直接下级组织和当前归属人员，并能进入人员详情页。"
  - "无下级组织或无归属人员时显示明确空态。"
  - "不新增 Sidebar 导航、后端 route、schema/migration、人员调岗、组织树拖拽、权限、审批、导出、批量操作、合同、结算、最低人力、自动排班、生产公式或收费因子。"
dependencies:
  - "US785"
status: "done"
notes: "IM166 已完成：组织列表新增行内查看详情入口，组织详情页只读展示组织信息、直接下级组织和归属人员，归属人员可进入既有客服人员详情页。"
```

### US787 - 技能组详情只读业务链路

```yaml
id: US787
requirement_ids:
  - R867
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望从技能组列表进入单个技能组详情页，以便核对该技能组的基础信息、归属属性和当前拥有该技能的客服人员。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/skills 列表行提供查看详情入口。"
  - "/master-data/skills/[skillId] 展示技能组基础信息、归属属性、状态、有效期和来源批次。"
  - "详情页只读展示当前拥有该技能的客服人员，并能进入人员详情页。"
  - "无归属人员时显示明确空态。"
  - "不新增 Sidebar 导航、后端 route、schema/migration、技能层级、技能绑定维护、批量分配、排班技能规则、权限、审批、导出、合同、结算、最低人力、自动排班、生产公式或收费因子。"
dependencies:
  - "US786"
status: "done"
notes: "IM167 已完成：技能组列表新增行内详情入口，技能组详情页只读展示技能组信息、归属属性和拥有该技能的客服人员，人员可进入既有客服人员详情页。"
```

### US788 - 主数据详情链路收尾检查

```yaml
id: US788
requirement_ids:
  - R868
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望主数据列表里进入详情的行内动作口径一致，以便在职场、供应商、技能组等对象之间切换时不被不同文案干扰。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "主数据 reference 列表进入详情的行内动作统一使用 `查看`。"
  - "动作仍进入既有详情页，不新增页面、导航或业务模块。"
  - "结构测试覆盖该口径，避免后续再次混用 `详情`。"
  - "不新增后端 route、schema/migration、导入、权限、审批、导出、批量、合同、结算、最低人力、自动排班、生产公式或收费因子。"
dependencies:
  - "US787"
status: "done"
notes: "IM168 已完成：技能组等主数据 reference 列表进入详情的行内动作统一为 `查看`，并新增结构测试防止回退。"
```

### US789 - 需求预测导入大弹窗

```yaml
id: US789
requirement_ids:
  - R869
module: "需求计划 / 业务导入"
role: "需求计划维护人员"
story: "作为需求计划维护人员，我希望在预测版本页直接打开需求预测导入弹窗，以便完成上传、映射和结果回看，而不是跳到独立 CSV 上传工作区。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/demand-plans/production Header 的 `导入预测` 打开当前页 Dialog。"
  - "Dialog 包含上传文件、字段映射、导入结果三步，且切换 step 时文件 input 不卸载。"
  - "上传结果回流当前预测版本页，并在 Dialog 结果 step 展示批次详情入口。"
  - "不扩展排班、登录/状态日志导入弹窗，不新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US788"
status: "done"
notes: "IM169 已完成：预测版本页 Header 的 `导入预测` 打开当前页 Dialog；Dialog 三步为上传文件、字段映射、导入结果，文件 input 在 step 切换时保持挂载；上传结果回流当前页并提供批次详情入口。排班和登录/状态日志导入后续单独拆。"
```

### US790 - 排班导入大弹窗

```yaml
id: US790
requirement_ids:
  - R870
module: "排班计划 / 业务导入"
role: "排班计划维护人员"
story: "作为排班计划维护人员，我希望在排班版本页直接打开排班导入弹窗，以便完成上传、映射和结果回看，而不是跳到独立 CSV 上传工作区。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/schedule-plans/production Header 的 `导入排班` 打开当前页 Dialog。"
  - "Dialog 包含上传文件、字段映射、导入结果三步，且切换 step 时文件 input 不卸载。"
  - "上传结果回流当前排班版本页，并在 Dialog 结果 step 展示批次详情入口。"
  - "不扩展登录/状态日志导入弹窗，不新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、发布/冻结、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US789"
status: "done"
notes: "IM170 已完成：排班版本页 Header 的 `导入排班` 打开当前页 Dialog；Dialog 三步为上传文件、字段映射、导入结果，文件 input 在 step 切换时保持挂载；上传结果回流当前页并提供批次详情入口。登录/状态日志导入后续单独拆。"
```

### US769 - 主数据非客服人员动作收口

```yaml
id: US769
requirement_ids:
  - R849
module: "主数据维护 / 页面动作"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望组织、职场、供应商、技能等非客服人员主数据页不要在内容区暴露未确认的导入动作，以便页面保持清爽的只读列表边界，已确认的页面级动作只出现在 Header actions。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "客服人员页面级动作继续只通过 Header actions 承载。"
  - "组织、职场、供应商、技能等非客服人员主数据列表内容区不再显示 `导入主数据`。"
  - "非客服人员主数据页不新增未确认 CRUD、导入弹窗或跳转独立上传工作区的快捷入口。"
  - "不迁移排班、预测、登录/状态日志导入入口，不改路由结构、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US768"
status: "done"
notes: "IM149 已完成：非客服人员主数据列表内容区的 `导入主数据` 旧入口已删除，客服人员 Header actions 保持不变。"
```

### US770 - 导入入口业务归位

```yaml
id: US770
requirement_ids:
  - R850
module: "业务导入 / 入口归属"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望导入动作出现在对应业务页面的页面级动作区，而不是在通用导入中心里找上传入口，以便按人员、排班、预测、登录/状态日志各自的业务上下文发起导入。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/data-quality` 只作为导入批次台账/处理记录，不再显示通用 `上传 CSV` 主按钮。"
  - "`预测版本`、`排班版本`、`登录/状态日志` 的导入动作由 AppShell Header actions 承载。"
  - "预测、排班、登录/状态日志内容区的 `版本状态` 卡片不再放导入按钮。"
  - "本轮不新增导入弹窗、不新增后端 route、不改上传 action、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US769"
status: "done"
notes: "IM150 已完成：通用批次台账不再暴露上传主入口，预测、排班、登录/状态日志导入动作已归入各自页面 Header actions。"
```

### US771 - data-quality 结果页抽象降级

```yaml
id: US771
requirement_ids:
  - R851
module: "结果链路 / 页面层级"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望业务版本、对比运行和复核案例页面不要继续表现为导入批次模块下的子页，以便这些结果链路像业务结果回看页面，而不是一个额外的质量中心或导入中心模块。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/data-quality/versions` Breadcrumb 不再把 `导入批次` 作为父级。"
  - "`/data-quality/comparison-runs/[runId]` Breadcrumb 不再把 `导入批次` 作为父级。"
  - "`/data-quality/review-cases` 和 `/data-quality/review-cases/[caseId]` Breadcrumb 不再把 `导入批次` 作为父级。"
  - "批次处理、上传、模板维护页面仍保留兼容路由和批次上下文，不在本轮拆路由。"
  - "本轮不新增导航项，不删除 `/data-quality/**` 路由，不改后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US770"
status: "done"
notes: "IM151 已完成：结果类页面不再显示 `导入批次` 父级，复核详情保留到复核列表的二级关系。"
```

### US772 - 主数据术语清理

```yaml
id: US772
requirement_ids:
  - R852
module: "主数据维护 / 术语"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望职场详情里的自有团队和供应商团队关系用 `服务团队` 这类业务语言呈现，而不是 `运营主体/职场运营主体`，以便主数据页面不继续制造未确认的新对象概念。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "主数据维护可见页面不再显示 `运营主体` 或 `职场运营主体`。"
  - "职场详情中的相关指标和表格标题改为 `服务团队`。"
  - "职场服务团队仍然作为职场详情下的内容，不新增独立导航、独立页面或 CRUD。"
  - "`项目` 不作为主数据维护对象回流；本轮不删除 project_id 兼容字段。"
  - "本轮不改后端 route、schema/migration、依赖、权限、审批、导出、批量、供应商合同、结算比例、最低人力要求、自动排班、生产公式或收费因子。"
dependencies:
  - "US771"
status: "done"
notes: "IM152 已完成：职场详情用 `服务团队` 表达自有团队和供应商团队关系，不再显示 `运营主体/职场运营主体`。"
```

### US768 - 旧全局搜索 API 清理

```yaml
id: US768
requirement_ids:
  - R848
module: "全局页面结构 / Header"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望 Header 不再保留无实际显示的全局搜索接口，以便页面级动作、Breadcrumb 和业务筛选各自归位，不再诱导后续把列表筛选塞回全局 Header。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "AppShell 和 SiteHeader 不再声明、默认或透传 searchPlaceholder。"
  - "app 与 components 源码不再向 AppShell/SiteHeader 传入 searchPlaceholder。"
  - "真正有意义的列表内筛选框保留在各业务内容区，不迁回 Header。"
  - "不新增 Header 全局搜索 UI，不删除业务列表内筛选框，不改路由结构、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US767"
status: "done"
notes: "IM148 已完成：旧 Header 搜索参数从 AppShell/SiteHeader 接口和 app/components 页面传参中移除；结构测试禁止该参数回流。"
```

### US765 - 导航信息架构收口

```yaml
id: US765
requirement_ids:
  - R845
module: "全局导航 / 计划与排班"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望一级导航只暴露业务对象入口，而不是预测生产、排班生产这类实现路径，以便从需求计划、排班计划和登录/状态日志进入对应版本和处理流程。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "Sidebar 不再暴露 `预测生产` 和 `排班生产` 作为一级导航项。"
  - "`需求计划` 导航项覆盖 `/demand-plans` 与 `/demand-plans/production/**` 的父级高亮。"
  - "`排班计划` 导航项覆盖 `/schedule-plans` 与 `/schedule-plans/production/**` 的父级高亮。"
  - "Sidebar 结构测试禁止 `预测生产`、`排班生产`、`导入中心`、`质量中心`、`数据质量` 作为导航标题出现。"
  - "本轮不改生产页标题、返回按钮、模型文案、导入弹窗、业务路由或后端能力。"
dependencies:
  - "US764"
status: "done"
notes: "IM145 已完成：一级导航移除 `预测生产`、`排班生产`，并让 `/demand-plans/production/**` 与 `/schedule-plans/production/**` 分别继承 `需求计划`、`排班计划` 导航高亮；生产文案、返回链路、重复标题和旧搜索 API 分别留给后续 IM146-IM148。"
```

### US766 - 生产文案与返回链路清理

```yaml
id: US766
requirement_ids:
  - R846
module: "全局文案 / 计划与排班"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望预测、排班和登录/状态日志页面按业务对象命名，而不是继续使用生产工作台/生产台账这类实现路径，以便我能从需求计划、排班计划和日志入口理解当前处理对象。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/demand-plans/production` 可见标题与台账文案改为预测版本视角，不再显示 `预测生产` 或 `需求预测生产台账`。"
  - "`/schedule-plans/production` 可见标题与台账文案改为排班版本视角，不再显示 `排班生产` 或 `人员排班生产台账`。"
  - "`/actual-logs/production` 可见标题与台账文案改为登录/状态日志处理视角，不再显示 `登录/状态日志生产` 或 `日志生产`。"
  - "三个生产详情/解释页的返回按钮改为返回对应业务入口：`返回需求计划`、`返回排班计划`、`返回登录/状态日志`。"
  - "模型阻塞、就绪、缺批次文案不再提示用户返回生产列表或建立生产台账。"
  - "不改路由结构、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US765"
status: "done"
notes: "IM146 已完成：`/demand-plans/production`、`/schedule-plans/production`、`/actual-logs/production` 的可见标题、列表标题、返回按钮和模型提示改为预测版本、排班版本、登录/状态日志处理视角；重复 H1、旧 searchPlaceholder、导入入口业务归位和 data-quality 降级留给后续 IM147-IM151。"
```

### US767 - Header/Breadcrumb 与内容区标题统一

```yaml
id: US767
requirement_ids:
  - R847
module: "全局页面结构 / Breadcrumb"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望业务列表、详情、新建和编辑页的页面身份由统一 Header/Breadcrumb 承载，内容区不再重复渲染同名 H1，以便页面层级清晰且不会出现上下两套标题。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "需求计划、排班计划、预测版本、排班版本、登录/状态日志和 data-quality 兼容页向 AppShell 传入 breadcrumbItems。"
  - "上述页面和工作区不再在内容区渲染同名 `<h1>`；必要信息降级为描述、区块标题或保留业务记录名称。"
  - "Breadcrumb 包含当前页，弹窗不新增 Breadcrumb。"
  - "不删除旧 searchPlaceholder API，不改路由结构、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US766"
status: "done"
notes: "IM147 已完成：目标业务页由 AppShell/SiteHeader 的 breadcrumbItems 承载页面身份，内容区不再重复页面级 H1；旧搜索 API 作为 IM148 单独处理。"
```

### US701 - 独立 CSV 上传工作区

```yaml
id: US701
requirement_ids:
  - R781
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望有独立的 CSV 上传工作区，以便不依赖某个已存在批次也能发起真实导入。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/uploads/new` 展示独立 CSV 上传工作区，复用现有上传表单、模板列表和模板适配提示。"
  - "数据质量列表页提供进入上传工作区的入口，避免上传入口只藏在批次详情页。"
  - "模板详情页在没有来源批次时也能进入上传工作区并携带 `templateId` 预选。"
  - "上传工作区读取 `templateId` 查询参数，默认选中可用模板并提示不可用模板。"
  - "复用现有 `uploadImportCsvAction` 和模板 API，不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US700"
status: "done"
```

### US702 - 独立上传结果回流

```yaml
id: US702
requirement_ids:
  - R782
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望独立上传页在上传后保留结果反馈和新批次入口，以便上传完成后立即进入批次处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "独立上传页提交后成功或失败都回到 `/data-quality/uploads/new`，而不是默认回到数据质量列表页。"
  - "成功反馈展示新批次号，并提供进入该批次处理详情的入口。"
  - "失败反馈保留错误原因和可继续上传的表单。"
  - "批次详情页内原有 CSV 上传表单继续回到数据质量列表页或批次语境，不被独立上传页回流逻辑破坏。"
  - "复用现有 `uploadImportCsvAction`、上传表单和结果反馈模型，不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US701"
status: "done"
```

### US703 - 单批次导入应用写入入口

```yaml
id: US703
requirement_ids:
  - R783
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在批次处理详情页对准备度通过的单个批次执行应用写入，以便上传和修正完成后能进入真实业务数据闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 在准备度 ready 且未应用时展示单批次应用入口。"
  - "应用入口按 file_type 调用现有 apply API：master_data、personnel_schedule、demand_forecast、login_log/status_log。"
  - "应用成功后留在当前批次详情页并展示成功反馈和下一步下游结果提示。"
  - "准备度阻塞、已应用、准备度读取失败或未知文件类型时只展示原因，不提供写入按钮。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US702"
status: "done"
```

### US704 - 批次应用成功结果卡片和下一步入口

```yaml
id: US704
requirement_ids:
  - R784
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在批次应用成功后立刻看到生成的业务版本结果卡片和下一步入口，以便明确当前批次已经落到了哪里、下一步该看什么。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 在应用成功后的当前批次语境展示结果卡片，明确应用目标、生成版本、应用时间或当前可见写入状态。"
  - "结果卡片根据 file_type 给出下一步入口，能继续进入已有下游结果追踪、结果列表或复核工作区，而不是只停留在通用成功提示。"
  - "未应用、应用失败、readiness 阻塞或应用摘要缺失时维持只读说明，不误报为已生成业务版本。"
  - "复用现有批次详情、应用摘要、readiness 和下游结果查询能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US703"
status: "done"
```

### US705 - 已应用批次版本结果定位链路

```yaml
id: US705
requirement_ids:
  - R785
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望从已应用批次直接进入对应版本的结果上下文，以便继续查看该版本已有的对比结果、复核案例和空态。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "已应用批次可从当前批次页进入对应版本详情或结果列表，不需要手动拼接 API 或回到其他页面重新检索。"
  - "版本结果视图明确当前版本 ID、来源批次、应用目标和已有下游结果状态。"
  - "无结果、结果读取失败或版本上下文不完整时展示清晰空态/阻塞态，不误导为已有计算结论。"
  - "优先复用现有 comparison runs、review cases 和批次详情能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US704"
status: "done"
```

### US706 - 版本结果页本地比对计算受控入口

```yaml
id: US706
requirement_ids:
  - R786
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在版本结果页受控地发起一次本地比对计算，以便不用离开当前版本语境也能生成新的对比结果。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本结果页只在来源版本和 comparison_type 足够明确时展示受控 `发起本地比对` 入口。"
  - "提交后在当前版本结果语境展示成功/失败反馈，并提供进入新 comparison run 详情或结果列表的入口。"
  - "来源版本缺失、类型不支持或现有上下文不足时只展示阻塞原因，不展示写入按钮。"
  - "复用现有 comparison calculate API 和结果查询能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算、自动排班或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US705"
status: "done"
```

### US707 - 业务版本工作台只读台账页

```yaml
id: US707
requirement_ids:
  - R787
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在数据质量下有一个只读业务版本台账页，以便不逐个打开批次也能扫描主数据、排班、预测和登录/状态日志当前各自的版本上下文。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/versions` 展示只读业务版本台账，至少覆盖主数据、人员排班、需求预测和登录/状态日志四类业务域。"
  - "每行至少展示数据域、当前版本、来源批次、当前可见时间、状态和阻塞摘要，并给出基础下一步入口。"
  - "无当前版本、未应用或信息不完整时展示明确 empty/blocked 状态，不假装已有版本。"
  - "数据质量导航提供进入版本工作台的入口；本轮不新增稳定 comparison run / review case 深链，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US706"
status: "done"
```

### US708 - 业务版本工作台稳定跳转链路

```yaml
id: US708
requirement_ids:
  - R788
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望从版本工作台的当前版本行直接进入批次详情、结果追踪或对应对比运行，以便继续处理而不是回列表重新检索。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本工作台对已定位上下文的行提供稳定的批次详情、结果追踪或 comparison run 跳转。"
  - "上下文不足时只展示阻塞说明，不提供误导性深链。"
  - "复用现有 data-quality 页面和本地查询能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US707"
status: "done"
```

### US709 - 业务版本工作台下游影响摘要

```yaml
id: US709
requirement_ids:
  - R789
module: "导入中心"
role: "运营复核负责人"
story: "作为运营复核负责人，我希望在版本工作台一眼看到当前版本已经影响了多少对比运行和复核案例，以便判断下一步该去哪里继续追踪。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本工作台为当前版本行补 comparison run / review case 的只读影响摘要。"
  - "没有下游结果或上下文不完整时展示明确空态或阻塞态。"
  - "复用现有 comparison runs、review cases 和批次上下文能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US708"
status: "done"
```

### US710 - 结果追踪中的最新运行回看卡片

```yaml
id: US710
requirement_ids:
  - R790
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在当前批次的结果追踪里直接看到刚刚生成的最新一次本地比对运行摘要，以便不用立刻跳页也能先判断这次运行是否值得继续看。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "本地比对成功回跳到结果追踪后，页面展示当前版本语境下的最新运行结果卡片。"
  - "卡片至少展示运行 ID、对比口径、结果规模、关键差异和进入 comparison run detail / 结果列表的入口。"
  - "运行暂未回显时展示明确阻塞态，不假装已经拿到完整结果。"
  - "复用现有 comparison run 列表和成功回跳 query 参数，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US709"
status: "done"
```

### US711 - comparison run detail 结果回看主页强化

```yaml
id: US711
requirement_ids:
  - R791
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望进入 comparison run detail 后能明确知道这就是当前版本语境下的完整结果回看页，以便放心在这里继续检查结果明细。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从结果追踪进入 comparison run detail 时，页面明确这是当前版本语境下的完整结果回看主页。"
  - "页面强化来源版本、业务日和回看语义，不要求新增写入动作。"
  - "复用现有 comparison run detail 查询与页面结构，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US710"
status: "done"
```

### US712 - comparison run detail 回跳闭环

```yaml
id: US712
requirement_ids:
  - R792
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在 comparison run detail 看完完整结果后能稳定回到来源批次的结果追踪或版本工作台，以便这条链路形成真正闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "comparison run detail 提供回到来源批次结果追踪和版本工作台的稳定返回入口。"
  - "来源批次或版本语境不足时展示清晰阻塞态，不伪造回跳。"
  - "复用现有批次、版本工作台和 comparison run detail 页面，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US711"
status: "done"
```

### US700 - 字段映射模板上传预选链路

```yaml
id: US700
requirement_ids:
  - R780
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望从字段映射模板详情页直接带着该模板进入上传工具，以便创建或维护模板后能马上用于 CSV 上传。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "模板详情页对启用模板提供 `用此模板上传` 入口，跳转到批次处理页的导入与模板工具区。"
  - "批次处理页读取 `templateId` 查询参数，并传入 CSV 上传表单。"
  - "CSV 上传表单默认选中该模板，并展示预选模板提示；停用或不存在的模板不误报为可用。"
  - "复用现有 `template_id` 上传能力，不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US699"
status: "done"
```

### US682 - 复核案例关闭写入入口

```yaml
id: US682
requirement_ids:
  - R762
module: "导入中心"
role: "主管"
story: "作为主管，我希望能在复核案例详情页对已具备证据和结论的 open 案例执行受控关闭写入，以便形成真实处理记录，而不是只停留在只读预览。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`POST /api/v1/review-cases/write-closure` 能对已存在且未关闭的复核案例写入 closure，并返回带 closure 的详情。"
  - "重复提交同一已关闭案例返回已有 closed detail，不重复写入 closure。"
  - "`/data-quality/review-cases/[caseId]` 对有证据、有结论且未关闭的案例展示受控关闭入口。"
  - "关闭入口提交当前案例、已有证据、已有结论和 closure payload 到现有本地 API，成功后在页面显示已关闭状态。"
  - "读取失败、已关闭、缺少证据或缺少结论时不展示可提交关闭按钮，只展示阻塞原因。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做证据补录、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US681"
status: "done"
```

### US684 - 复核案例结论补充写入入口

```yaml
id: US684
requirement_ids:
  - R764
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页对未关闭案例补充复核结论，以便证据补齐后能形成可关闭的处理链路。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`POST /api/v1/review-cases/{case_id}/conclusion` 能对已存在且未关闭的复核案例新增一条 conclusion，并返回带最新 conclusion 列表的详情。"
  - "已关闭案例、case_id 不匹配或重复 conclusion_id 时返回明确错误，不写入新结论。"
  - "`/data-quality/review-cases/[caseId]` 对未关闭案例展示受控结论补充入口。"
  - "结论补充入口提交 conclusion_type、risk_level、conclusion_text 和 decided_by 到本地 API，成功后回到当前详情页并显示最新结论。"
  - "读取失败或已关闭时不展示可提交结论按钮，只展示阻塞原因。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US683"
status: "done"
```

### US683 - 复核案例证据补录写入入口

```yaml
id: US683
requirement_ids:
  - R763
module: "导入中心"
role: "主管"
story: "作为主管，我希望能在复核案例详情页对未关闭案例补充一条证据，以便材料不足时先补齐处理依据，再进入关闭。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`POST /api/v1/review-cases/{case_id}/evidence` 能对已存在且未关闭的复核案例新增一条 evidence，并返回带最新 evidence 列表的详情。"
  - "已关闭案例、case_id 不匹配或重复 evidence_id 时返回明确错误，不写入新证据。"
  - "`/data-quality/review-cases/[caseId]` 对未关闭案例展示受控证据补录入口。"
  - "证据补录入口提交 evidence_type、evidence_uri、submitted_by 和 note 到现有本地 API，成功后回到当前详情页并显示最新证据。"
  - "读取失败或已关闭时不展示可提交补录按钮，只展示阻塞原因。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做结论新增、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US682"
status: "done"
```

## DAG Rules

- 每条用户故事必须关联至少一条原始需求。
- `dependencies` 只能引用已经存在的用户故事、决策或口径确认项。
- 若发现循环依赖，相关故事必须标记为 `blocked`。
- 涉及结算公式、状态码、权限、导出、批量操作或真实数据来源时，必须先生成 PM 确认问题。

## Stories

### US620 - Q127 数据库基础 QA 收口

```yaml
id: US620
requirement_ids:
  - R697
  - R698
  - R699
  - R700
task_ids:
  - Q127
module: "质量与交付"
role: "PM"
story: "作为 PM，我希望 DB002-DB008 的数据库基础经过一次 QA 收口，以便确认生产持久化雏形已形成可迁移、可读回、可追溯的闭环。"
task_type: "qa"
priority: "P0"
acceptance:
  - "验证 Alembic head 能创建 DB002-DB008 全部基础表。"
  - "验证最小端到端链路可从导入批次走到复核关闭记录。"
  - "输出 QA 结论，明确已完成、未完成和仍禁止混入范围。"
  - "不修改产品行为、数据库 schema、repository 实现、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB008
status: "done"
completed_scope:
  - "新增 database foundation QA closeout 测试。"
  - "验证 Alembic head 能创建 DB002-DB008 全部基础表。"
  - "验证最小端到端链路可从导入/版本记录走到复核关闭记录。"
  - "输出数据库基础 QA 收口结论文档。"
```

### US619 - DB008 复核闭环记录持久化基础

```yaml
id: US619
requirement_ids:
  - R693
  - R694
  - R695
  - R696
task_ids:
  - DB008
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望主管复核 case、证据、结论和关闭记录可以持久化并引用对比结果，以便后续异常闭环从只读判断进入可追溯处理记录。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 review cases、review evidence、review conclusions 和 review closures。"
  - "校验来源 comparison result 类型和 result id 引用。"
  - "测试覆盖证据、结论、关闭记录读取、缺失来源拒绝、来源类型不匹配拒绝和重复关闭拒绝。"
  - "不实现审批流、权限、批量关闭、导出、真实外部证据服务、生产状态码、结算或收费因子。"
dependencies:
  - DB007
status: "done"
completed_scope:
  - "持久化 review cases、review evidence、review conclusions 和 review closures。"
  - "校验 forecast_schedule/schedule_actual 来源 result id、来源类型和业务日一致性。"
  - "测试覆盖证据、结论、关闭记录读取、缺失来源拒绝、来源类型不匹配拒绝、业务日不一致拒绝和重复关闭拒绝。"
```

### US618 - DB007 对比结果持久化基础

```yaml
id: US618
requirement_ids:
  - R689
  - R690
  - R691
  - R692
task_ids:
  - DB007
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望预测 vs 排班、排班 vs 实际的结果可以持久化并保留来源引用，以便后续异常生成和复核闭环有可复跑基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 comparison runs、forecast-vs-schedule results 和 schedule-vs-actual results。"
  - "校验 forecast version、schedule version、actual import version 和来源记录引用。"
  - "测试覆盖结果状态、差异数值、来源引用、缺失引用拒绝和重复 run 读取。"
  - "不实现真实计算调度、异常复核写入、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB006
status: "done"
completed_scope:
  - "持久化 comparison runs、forecast-vs-schedule results 和 schedule-vs-actual results。"
  - "校验 forecast version、schedule version、actual status import version 和来源记录版本归属。"
  - "测试覆盖结果读取、缺失源版本拒绝、非 status_log 拒绝、跨版本来源拒绝和来源维度不一致拒绝。"
```

### US617 - DB006 登录/状态日志持久化基础

```yaml
id: US617
requirement_ids:
  - R685
  - R686
  - R687
  - R688
task_ids:
  - DB006
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望登录和状态日志完成事件、区间、业务日和状态字典持久化，以便后续排班 vs 实际状态对比有稳定实际基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 login events、status dictionary 和 status intervals。"
  - "校验 import version、employee 和状态字典引用。"
  - "测试覆盖跨天区间切分、业务日、时区校验和未知状态拒绝。"
  - "不实现预测/排班对比、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB005
status: "done"
completed_scope:
  - "持久化 login events、status dictionary 和 status intervals。"
  - "校验 login_log/status_log import version、employee 和状态字典引用。"
  - "测试覆盖跨天业务日切分、Asia/Shanghai 时区校验、冻结员工拒绝和未知状态拒绝。"
```

### US616 - DB005 需求预测持久化基础

```yaml
id: US616
requirement_ids:
  - R681
  - R682
  - R683
  - R684
task_ids:
  - DB005
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望需求预测完成版本、0.5h 预测行和技能等级需求持久化，以便后续预测 vs 排班对比有稳定需求基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 forecast versions、forecast interval rows 和 version change records。"
  - "校验 import version、workplace、project 和 skill 引用。"
  - "测试覆盖 0.5h 时段、技能等级需求、版本变更追踪、冻结/缺失引用拒绝和无效时间范围拒绝。"
  - "不实现登录/状态日志、对比结果、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB004
status: "done"
completed_scope:
  - "持久化 forecast versions、forecast interval rows 和 version change records。"
  - "校验 import version、workplace、project 和 skill 引用。"
  - "测试覆盖 0.5h 时段、技能等级需求、版本变更追踪、冻结技能拒绝和非 0.5h 时段拒绝。"
```

### US615 - DB004 人员级排班持久化基础

```yaml
id: US615
requirement_ids:
  - R677
  - R678
  - R679
  - R680
task_ids:
  - DB004
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望人员级排班完成版本、明细、班次引用和 0.5h 展开持久化，以便后续预测对比和登录状态对比有稳定排班基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 schedule versions、shift types、personnel schedule details 和 half-hour intervals。"
  - "校验 import version、employee、workplace、project、skill 和 shift type 引用。"
  - "测试覆盖 0.5h 展开、冻结/缺失引用拒绝和无效时间范围拒绝。"
  - "不实现需求预测、登录/状态日志、对比结果、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB003
status: "done"
completed_scope:
  - "持久化 schedule versions、shift types、personnel schedule details 和 half-hour intervals。"
  - "校验 import version、employee、workplace、project、skill、employee binding 和 shift type 引用。"
  - "测试覆盖 0.5h 展开、冻结班次类型拒绝和无效时间范围拒绝。"
```

### US614 - DB003 主数据持久化基础

```yaml
id: US614
requirement_ids:
  - R673
  - R674
  - R675
  - R676
task_ids:
  - DB003
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望主数据先完成坐席、职场、供应商、项目、技能和绑定关系的持久化，以便后续人员排班、预测和日志对比都能引用稳定主数据。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 employees, suppliers, workplaces, projects, skills。"
  - "持久化 employee bindings，覆盖 employee/supplier/workplace/project/skill 引用。"
  - "支持有效期、冻结状态和引用校验。"
  - "不实现人员排班、预测、登录/状态日志、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB002
status: "done"
completed_scope:
  - "持久化 employees, suppliers, workplaces, projects, skills。"
  - "持久化 employee bindings。"
  - "测试覆盖新 repository 读取、冻结状态拒绝和 import batch 来源引用。"
```

### US613 - DB002 导入持久化基础

```yaml
id: US613
requirement_ids:
  - R669
  - R670
  - R671
  - R672
task_ids:
  - DB002
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望使用已确认的 PostgreSQL/SQLAlchemy/Alembic 口径实现导入批次持久化基础，以便后续主数据、排班、预测和状态日志都有可追溯的导入来源。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "明确数据库引擎。"
  - "明确是否允许 package/lockfile 变更。"
  - "明确 ORM、migration 工具和测试数据库方案。"
  - "实现范围只包含导入批次、导入行结果、失败行明细和导入生成版本记录。"
dependencies:
  - DB001
status: "done"
confirmed_database_engine: "PostgreSQL"
confirmed_orm: "SQLAlchemy"
confirmed_migration_tool: "Alembic"
confirmed_test_database: "isolated local test database"
package_change_allowed: true
completed_scope:
  - "导入批次记录。"
  - "导入行结果、失败行明细和错误原因。"
  - "导入生成版本记录。"
  - "Alembic migration 和 backend persistence tests。"
```

### US612 - 数据库 Gate 规划

```yaml
id: US612
requirement_ids:
  - R665
  - R666
  - R667
  - R668
task_ids:
  - DB001
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望先确认数据库 Gate 的边界、首批落库顺序和实施计划，以便后续数据库开发不混入权限、审批、导出、批量和结算等生产能力。"
task_type: "database-planning"
priority: "P0"
acceptance:
  - "数据库 Gate 文档明确允许、禁止和硬停项。"
  - "首批落库顺序从导入批次、失败行和版本记录开始。"
  - "后续数据库实现拆成可逐步执行的 DB002+ 任务。"
  - "本轮不创建数据库连接、ORM、migration、schema、生产持久化配置或新依赖。"
dependencies: []
status: "done"
```

### US001 - 运营负责人查看 Dashboard 总览

```yaml
id: US001
requirement_ids:
  - R001
  - R002
module: "运营工作台"
role: "运营负责人"
story: "作为运营负责人，我希望在首页查看预测需求、BPO 排班、实际有效工时和异常工时概览，以便快速判断当日履约风险。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "首页展示四个 shadcn Card 风格指标卡。"
  - "业务文案使用中文。"
  - "支持 light/dark theme。"
dependencies:
  - "F001"
status: "done"
```

### US073-US082 - Dashboard 本地 parity 连续增强

```yaml
stories:
  - id: US073
    requirement_ids: [R061]
    story: "作为运营负责人，我希望 dashboard 异常明细表支持本地状态与严重度筛选。"
    status: "done"
  - id: US074
    requirement_ids: [R062]
    story: "作为运营负责人，我希望 dashboard 异常明细表显示筛选摘要并可一键重置。"
    status: "done"
  - id: US075
    requirement_ids: [R063]
    story: "作为运营负责人，我希望 dashboard 异常明细表显示分页范围并支持首页/末页。"
    status: "done"
  - id: US076
    requirement_ids: [R064]
    story: "作为项目执行者，我希望 dashboard 数据接入状态模型有本地测试覆盖。"
    status: "done"
  - id: US077
    requirement_ids: [R065]
    story: "作为运营负责人，我希望 dashboard 数据接入状态使用 TanStack Table 展示。"
    status: "done"
  - id: US078
    requirement_ids: [R066]
    story: "作为运营负责人，我希望 dashboard 数据接入状态支持本地状态筛选和摘要。"
    status: "done"
  - id: US079
    requirement_ids: [R067]
    story: "作为项目执行者，我希望 dashboard 热力图缺口统计有本地测试覆盖。"
    status: "done"
  - id: US080
    requirement_ids: [R068]
    story: "作为运营负责人，我希望 dashboard 热力图显示缺口总览、严重时段和峰值缺口。"
    status: "done"
  - id: US081
    requirement_ids: [R069]
    story: "作为运营负责人，我希望 dashboard 热力图格子有更清晰的可访问标签和聚焦状态。"
    status: "done"
  - id: US082
    requirement_ids: [R070]
    story: "作为 QA，我希望 F032-F040 dashboard 连续开发块完成后有验收收口。"
    status: "done"
acceptance:
  - "只做本地展示层增强，不新增依赖、不改后端契约、不接数据库。"
  - "不启用真实同步、审批、导出、批量、权限或生产公式。"
  - "`bash scripts/check.sh` 通过。"
```

### US002 - 运营查看履约趋势与时段缺口

```yaml
id: US002
requirement_ids:
  - R001
  - R002
module: "履约监控"
role: "运营负责人"
story: "作为运营负责人，我希望查看排班实现率、排班拟合度、排班遵守率趋势和时段缺口热力图，以便识别履约波动。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "趋势图展示排班实现率、排班拟合度、排班遵守率。"
  - "热力图展示按日期和时段聚合的缺口。"
  - "F001 中的 Recharts 仅作为 shadcn chart structure 的静态 prototype 例外。"
dependencies:
  - "US001"
  - "D005"
status: "done"
```

### US003 - 运营复核异常工时列表

```yaml
id: US003
requirement_ids:
  - R001
module: "异常管理"
role: "运营专员"
story: "作为运营专员，我希望查看异常工时列表、严重程度、状态和影响工时，以便进行后续复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "异常表格展示异常编号、类型、项目、团队、时段、人数、影响工时、严重程度和状态。"
  - "支持搜索、状态 badge、分页和行操作。"
  - "不提供真实审批、导出、批量处理或结算确认能力。"
dependencies:
  - "US001"
status: "done"
```

### US004 - 运营查看数据同步状态

```yaml
id: US004
requirement_ids:
  - R001
module: "数据与集成"
role: "运营负责人"
story: "作为运营负责人，我希望查看 CORN 登录数据、CORN 状态日志、BPO 排班数据和预测需求数据的同步状态，以便识别数据接入风险。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "展示数据源、批次、同步状态和同步时间。"
  - "仅展示静态 mock 状态，不接入真实 API。"
dependencies:
  - "US001"
status: "done"
```

### US005 - 用户切换 light/dark 主题

```yaml
id: US005
requirement_ids:
  - R002
module: "前端体验"
role: "平台用户"
story: "作为平台用户，我希望在 light 和 dark theme 之间切换，以便在不同使用环境下保持可读性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "提供 ThemeToggle。"
  - "核心 dashboard 区域在 light/dark theme 下均可读。"
  - "优先使用 shadcn / Tailwind semantic tokens。"
dependencies:
  - "US001"
status: "done"
```

### US006 - PM 确认 MVP 第一条纵切范围

```yaml
id: US006
requirement_ids:
  - R003
module: "MVP 范围"
role: "PM"
story: "作为 PM，我希望先确认第一条前后端纵切范围，以便团队在正式开发前知道第一批只做排班计划列表、详情、FastAPI 只读接口和本地种子数据。"
task_type: "product"
priority: "P0"
acceptance:
  - "第一条纵切明确为排班计划。"
  - "明确本阶段不做新增、编辑、发布、审批、导出、批量操作、认证、数据库或真实集成。"
  - "明确后续实现拆为 B001、F005 和 Q001。"
dependencies:
  - "H007"
status: "done"
```

### US007 - 排班人员查看排班计划列表

```yaml
id: US007
requirement_ids:
  - R003
  - R005
module: "计划与排班"
role: "排班人员"
story: "作为排班人员，我希望查看排班计划列表，以便按日期、项目、职场、版本、状态和缺口风险找到需要处理的计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表展示计划编号、日期、项目、职场、版本、状态、预测人数、已排人数、缺口人数和更新时间。"
  - "列表支持按关键词搜索计划编号、项目或职场。"
  - "状态展示仅使用 draft、review_ready、published 三个 MVP 展示状态。"
dependencies:
  - "US006"
  - "US010"
status: "done"
```

### US008 - 排班人员打开排班计划详情

```yaml
id: US008
requirement_ids:
  - R003
  - R006
module: "计划与排班"
role: "排班人员"
story: "作为排班人员，我希望打开单个排班计划详情，以便查看计划摘要、时段明细、缺口和备注。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "详情展示计划基础信息、版本、状态、覆盖率和缺口汇总。"
  - "详情展示 0.5h 时段级预测人数、已排人数、缺口人数和备注。"
  - "详情仅只读展示，不提供人员级编辑、拖拽、发布或审批操作。"
dependencies:
  - "US007"
  - "US011"
status: "done"
```

### US009 - 运营负责人查看排班覆盖风险

```yaml
id: US009
requirement_ids:
  - R005
  - R006
  - R009
module: "计划与排班"
role: "运营负责人"
story: "作为运营负责人，我希望在计划列表和详情中看到覆盖率、缺口人数和风险标记，以便判断哪天或哪个职场需要优先复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表和详情均展示 forecast_agents、scheduled_agents、gap_agents 和 coverage_rate。"
  - "coverage_rate 在 MVP 中按 scheduled_agents / forecast_agents 展示。"
  - "当 gap_agents 大于 0 时展示风险标记，但不触发真实告警、审批或通知。"
dependencies:
  - "US007"
  - "US008"
status: "done"
```

### US010 - 后端提供排班计划列表接口

```yaml
id: US010
requirement_ids:
  - R007
  - R008
module: "后端服务"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 排班计划列表接口，以便从后端读取本地种子数据并渲染计划列表。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-plans。"
  - "响应包含 items 数组，每项包含 id、plan_date、project_name、site_name、version、status、forecast_agents、scheduled_agents、gap_agents、coverage_rate、updated_at。"
  - "接口从本地种子数据读取，不接数据库、认证或真实外部系统。"
dependencies:
  - "US006"
status: "done"
```

### US011 - 后端提供排班计划详情接口

```yaml
id: US011
requirement_ids:
  - R007
  - R008
module: "后端服务"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 排班计划详情接口，以便读取单个计划的摘要和 0.5h 时段明细。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-plans/{plan_id}。"
  - "响应包含 summary 和 intervals。"
  - "intervals 每项包含 interval_start、interval_end、forecast_agents、scheduled_agents、gap_agents、coverage_rate、note。"
  - "当 plan_id 不存在时返回 404 和 machine-readable error code。"
dependencies:
  - "US010"
status: "done"
```

### US012 - 前端从 FastAPI 读取排班计划数据

```yaml
id: US012
requirement_ids:
  - R007
  - R008
module: "接口契约"
role: "前端应用"
story: "作为前端应用，我希望使用统一 API client 读取排班计划列表和详情，以便后续从静态 mock 过渡到后端数据。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "前端使用集中封装的 API client 调用排班接口。"
  - "接口失败时展示可读错误状态。"
  - "不把 FastAPI URL 和字段映射散落在多个组件里。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US013 - 后端本地种子数据表达预测需求

```yaml
id: US013
requirement_ids:
  - R004
  - R007
module: "博西预测需求"
role: "后端服务"
story: "作为后端服务，我希望用本地种子数据表达预测需求，以便第一条纵切能在不接真实 Excel 的情况下展示计划输入。"
task_type: "backend"
priority: "P0"
acceptance:
  - "种子数据包含日期、项目、职场、0.5h 时段和预测人数。"
  - "种子数据与排班计划详情中的 intervals 可追溯。"
  - "不实现上传、解析 Excel 或外部预测系统接入。"
dependencies:
  - "US006"
status: "done"
```

### US014 - 后端本地种子数据表达排班计划

```yaml
id: US014
requirement_ids:
  - R005
  - R006
  - R007
module: "计划与排班"
role: "后端服务"
story: "作为后端服务，我希望用本地种子数据表达排班计划，以便列表和详情接口能返回稳定、可验收的数据。"
task_type: "backend"
priority: "P0"
acceptance:
  - "种子数据包含至少 3 个排班计划。"
  - "每个计划包含至少 8 个 0.5h 时段明细。"
  - "字段使用 English keys，业务展示值可使用中文。"
dependencies:
  - "US013"
status: "done"
```

### US015 - PM 确认 MVP 状态与公式展示口径

```yaml
id: US015
requirement_ids:
  - R009
module: "业务口径"
role: "PM"
story: "作为 PM，我希望确认第一条纵切中的状态和公式只是 MVP 展示口径，以便不把它误认为生产最终规则。"
task_type: "product"
priority: "P0"
acceptance:
  - "计划状态暂定为 draft、review_ready、published。"
  - "coverage_rate 暂按 scheduled_agents / forecast_agents 展示。"
  - "结算公式、排班拟合度、排班遵守率和生产状态码不在第一条纵切中固化。"
dependencies:
  - "US006"
status: "done"
```

### US016 - QA 验证第一条纵切交付

```yaml
id: US016
requirement_ids:
  - R010
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望验证第一条纵切的前端、后端、接口契约和 Harness check，以便确认它可以作为正式开发基线。"
task_type: "qa"
priority: "P0"
acceptance:
  - "前端 lint、typecheck、build 通过。"
  - "后端测试通过。"
  - "接口返回字段满足 user stories 中的契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US007"
  - "US008"
  - "US010"
  - "US011"
  - "US012"
status: "done"
```

### US017 - 后端创建排班计划草稿

```yaml
id: US017
requirement_ids:
  - R011
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 创建排班计划草稿，以便本地 MVP 可以生成 draft 状态的计划并返回计算后的摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 POST /api/v1/schedule-plans/drafts。"
  - "请求包含 plan_date、project_name、site_name、version 和 intervals。"
  - "服务端计算 forecast_agents、scheduled_agents、gap_agents、coverage_rate 和 updated_at。"
  - "新建计划状态固定为 draft。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US018 - 后端更新排班计划草稿

```yaml
id: US018
requirement_ids:
  - R011
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望更新 draft 状态的排班计划，以便本地 MVP 可以调整 0.5h 时段并重新计算摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 PUT /api/v1/schedule-plans/{plan_id}/draft。"
  - "仅允许更新 status 为 draft 的计划。"
  - "更新后重新计算 forecast_agents、scheduled_agents、gap_agents 和 coverage_rate。"
  - "当计划不存在时返回 404。"
  - "当计划不是 draft 时返回 409 和 machine-readable error code。"
  - "不实现发布、审批、导出、批量操作、权限或数据库持久化。"
dependencies:
  - "US017"
status: "done"
```

### US019 - 前端创建排班计划草稿

```yaml
id: US019
requirement_ids:
  - R012
  - R011
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从排班计划列表进入新建草稿页面并提交草稿，以便快速创建本地 MVP 排班计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划列表提供新建草稿入口。"
  - "新建页面包含日期、项目、职场、版本和核心 0.5h 时段输入。"
  - "提交时通过 Next server action 调用 B002 创建草稿接口。"
  - "创建成功后跳转到新草稿详情。"
  - "不实现完整编辑器、发布、审批、导出、批量操作、权限或数据库持久化。"
dependencies:
  - "US017"
status: "done"
```

### US020 - 前端更新排班计划草稿

```yaml
id: US020
requirement_ids:
  - R013
  - R011
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从 draft 计划详情进入编辑页面并保存草稿，以便调整本地 MVP 排班计划的时段信息。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "draft 计划详情页展示编辑草稿入口。"
  - "非 draft 计划不展示编辑入口。"
  - "编辑页预填计划信息和现有 0.5h 时段。"
  - "提交时通过 Next server action 调用 B002 PUT 草稿更新接口。"
  - "保存成功后跳转回计划详情页。"
  - "不实现发布、审批、导出、批量操作、权限、数据库持久化或人员级排班。"
dependencies:
  - "US018"
  - "US019"
status: "done"
```

### US021 - Codex 按用户故事连续交付

```yaml
id: US021
requirement_ids:
  - R014
module: "Harness 流程"
role: "PM"
story: "作为 PM，我希望 Codex 从 goal 拆出最小用户故事后，能够按依赖顺序自动开发、测试、提交，并在安全时启动 subagent 并行处理，以便项目快速进入连续交付节奏。"
task_type: "docs"
priority: "P0"
acceptance:
  - "AGENTS.md 定义 Story Runner Mode。"
  - "Story Runner Mode 明确用户故事是默认执行单位，UI 细节反馈归入当前 story。"
  - "Story Runner Mode 允许在写入范围不冲突时默认启动 bounded subagents。"
  - "docs/harness/lightweight-harness.md 和 docs/prompts/README.md 同步该规则。"
  - "已完成用户故事状态与 backlog/task-log/audit 状态对齐。"
dependencies:
  - "H009"
status: "done"
```

### US022 - 后端排班计划列表筛选

```yaml
id: US022
requirement_ids:
  - R015
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 排班计划列表支持 status 和 query 查询参数，以便列表页可以按状态和关键词读取计划摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "GET /api/v1/schedule-plans 支持 status 查询参数。"
  - "GET /api/v1/schedule-plans 支持 query 查询参数，覆盖编号、日期、项目、职场、版本和状态。"
  - "后端 unittest 覆盖按状态筛选和按关键词筛选。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US023 - 前端排班计划列表筛选

```yaml
id: US023
requirement_ids:
  - R015
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划列表按关键词搜索并切换草稿、待复核、已发布状态，以便快速找到要处理的计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表页读取 URL query 和 status 参数。"
  - "页面提供关键词搜索框、状态切换和清空筛选。"
  - "筛选后指标卡和表格基于当前结果重新汇总。"
  - "表格保留排序能力并展示空结果状态。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US022"
status: "done"
```

### US024 - 后端班次明细列表

```yaml
id: US024
requirement_ids:
  - R016
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供班次明细列表接口，以便页面可以按 0.5h 时段读取计划、预测、已排、缺口和备注。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/shift-details。"
  - "返回字段包含 plan_id、plan_date、project_name、site_name、version、status、interval_start、interval_end、forecast_agents、scheduled_agents、gap_agents、coverage_rate 和 note。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖明细字段和关键词筛选。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US025 - 前端班次明细页面

```yaml
id: US025
requirement_ids:
  - R016
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开班次明细页面并按关键词或状态筛选，以便定位具体时段缺口。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏班次明细进入真实页面。"
  - "页面展示班次数量、缺口班次、最大缺口和整体覆盖率。"
  - "页面展示 0.5h 明细表并可跳回对应排班计划。"
  - "页面支持关键词、状态和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US024"
status: "done"
```

### US026 - 后端需求计划列表

```yaml
id: US026
requirement_ids:
  - R017
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供预测需求列表接口，以便页面可以读取日期、时段、职场和预测人数。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/demand-plans。"
  - "返回字段包含 demand_id、plan_date、project_name、site_name、interval_start、interval_end、forecast_agents、source 和 status。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖字段契约和关键词筛选。"
  - "不接真实 Excel、数据库、认证、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US027 - 前端需求计划页面

```yaml
id: US027
requirement_ids:
  - R017
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开需求计划页面查看预测需求并按关键词搜索，以便快速定位某个日期、职场或时段的需求输入。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏需求计划进入真实页面。"
  - "页面展示需求时段、预测人次、覆盖职场和峰值需求。"
  - "页面展示预测需求表。"
  - "页面支持关键词搜索和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US026"
status: "done"
```

### US028 - 后端不可用记录列表

```yaml
id: US028
requirement_ids:
  - R018
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供不可用记录列表接口，以便页面可以读取人员、团队、时段、原因、状态和影响时段。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/unavailability。"
  - "返回字段包含 unavailability_id、staff_name、team_name、project_name、site_name、unavailable_date、start_time、end_time、reason、status、affected_intervals 和 note。"
  - "支持 status 和 query 查询参数。"
  - "后端 unittest 覆盖字段契约、状态筛选和关键词筛选。"
  - "不接数据库、认证、人事系统、真实请假审批或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US029 - 前端不可用管理页面

```yaml
id: US029
requirement_ids:
  - R018
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开不可用管理页面并按关键词或状态筛选，以便快速识别可能影响排班覆盖的不可用时段。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏不可用管理进入真实页面。"
  - "页面展示不可用记录、生效中、影响时段和涉及团队。"
  - "页面展示不可用记录表并可跳转到班次明细。"
  - "页面支持关键词、状态和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US028"
status: "done"
```

### US030 - 后端排班风险提示列表

```yaml
id: US030
requirement_ids:
  - R019
  - R015
  - R018
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供排班风险提示列表，将时段缺口和生效中不可用记录合并为本地风险提示，以便排班计划页展示优先复核项。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-risks。"
  - "返回字段包含 risk_id、plan_id、plan_date、project_name、site_name、interval_start、interval_end、risk_level、gap_agents、affected_unavailability、reason 和 recommendation。"
  - "高风险包含同一日期、项目、职场、时段下同时存在缺口和生效中不可用记录的情况。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖字段契约、高风险合并和关键词筛选。"
dependencies:
  - "US022"
  - "US028"
status: "done"
```

### US031 - 前端排班风险提示区

```yaml
id: US031
requirement_ids:
  - R019
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划页看到风险提示区，按风险等级查看缺口和不可用影响，并能跳转到班次明细继续处理。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划页展示排班风险提示区。"
  - "风险提示区展示风险等级、日期、时段、项目、职场、缺口、不可用、原因和建议。"
  - "风险提示区高风险数量清晰可见。"
  - "风险行可以跳转到班次明细。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US030"
status: "done"
```

### US032 - shadcn dashboard-01 视觉差距审计

```yaml
id: US032
requirement_ids:
  - R020
module: "前端设计"
role: "PM"
story: "作为 PM，我希望先对当前前端和 shadcn dashboard-01 复刻规格做差距审计，以便确认哪些差异必须改、哪些差异可以接受。"
task_type: "frontend-audit"
priority: "P0"
acceptance:
  - "阅读项目当前 components、app 页面、global CSS、components.json 和 shadcn 相关配置。"
  - "基于 spec 检查 token、字体、圆角、sidebar/header 尺寸、card 尺寸、chart/table 结构、响应式行为和 light/dark 模式。"
  - "输出差距清单，按 P0/P1/P2 标注。"
  - "明确哪些差距需要新增依赖或 package/lockfile 变更。"
  - "不直接改 UI，不安装依赖。"
dependencies:
  - "F012"
status: "done"
```

### US033 - shadcn dashboard-01 视觉对齐实施

```yaml
id: US033
requirement_ids:
  - R020
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望当前 BPO WFM 后台页面在保留业务数据、接口和路由的前提下，对齐 shadcn dashboard-01 的 token、尺寸、组件结构和响应式质感，以便界面更专业稳定。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "保留现有业务字段、接口、路由和中文业务文案。"
  - "按 spec 对齐 light/dark token、字体、圆角、sidebar/header、metric cards、chart/table 和响应式行为。"
  - "优先使用 shadcn token，不硬编码颜色。"
  - "浏览器验证 1440x900 深色、1440x900 浅色、1314px、移动端。"
  - "列出与官方 dashboard-01 仍存在的差异。"
dependencies:
  - "US032"
status: "done"
```

### US034 - shadcn 依赖与组件接入收口

```yaml
id: US034
requirement_ids:
  - R021
module: "前端设计"
role: "前端应用"
story: "作为前端应用，我希望已确认的 shadcn dashboard parity 依赖和组件先被纳入受控工程范围并通过验证，以便后续表格交互、Drawer 和 Tabler 图标迁移可以在稳定基线上继续。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "package.json 和 package-lock.json 记录 PM 已确认的依赖变更。"
  - "新增 shadcn UI 组件文件和 hooks/use-mobile.ts 纳入受控范围。"
  - "修复 use-mobile.ts 当前 lint 失败。"
  - "核对 Button、Input、Separator 上游替换不会破坏现有表单、筛选、导航和主题行为。"
  - "不开发新的业务页面或业务能力。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US033"
status: "done"
```

### US035 - Harness Gate 体系审计反馈修复

```yaml
id: US035
requirement_ids:
  - R022
module: "Harness"
role: "PM"
story: "作为 PM，我希望 Gate Registry、AGENTS 阶段名、audit-report 口径和 Story Runner 队列入口与当前项目真实范围一致，以便后续执行者不会误判 Gate 标准和下一步起点。"
task_type: "harness"
priority: "P0"
acceptance:
  - "GATE_REGISTRY.md 建立 required_workflow 到 Gate 的映射矩阵。"
  - "AGENTS.md 的 Current stage 与 PROJECT_STATE 当前范围一致。"
  - "audit-report 中旧 clean-Harness 结论被标记为历史审计快照，不再与当前结论并列。"
  - "backlog 至少有一条 `ready` 状态任务作为 Story Runner 下一步入口。"
  - "不修改业务实现、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US034"
status: "done"
```

### US036 - 前端风险明细钻取入口

```yaml
id: US036
requirement_ids:
  - R019
  - R023
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从排班计划页的风险提示进入风险明细，以便查看风险项关联的计划、时段缺口、不可用影响和人工复核建议。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "风险提示行提供稳定的明细入口。"
  - "明细展示风险等级、计划、日期、时段、项目、职场、缺口、不可用影响、原因和建议。"
  - "明细可继续跳转到排班计划详情、班次明细或不可用记录相关视图。"
  - "复用现有本地 MVP 数据契约，不新增真实数据源。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不提供审批、批量调班、自动排班或生产公式能力。"
dependencies:
  - "US031"
  - "US034"
status: "done"
```

### US037 - 前端不可用影响定位

```yaml
id: US037
requirement_ids:
  - R018
  - R019
  - R024
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从不可用记录进入影响定位，以便查看该不可用时段影响了哪些班次、缺口和风险提示。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "不可用记录行提供稳定的影响定位入口。"
  - "影响定位页展示人员、团队、项目、职场、日期、不可用时段、原因和状态。"
  - "影响定位页展示与不可用时间重叠的班次明细。"
  - "影响定位页展示与不可用时间重叠的风险提示。"
  - "页面可跳转到排班计划详情、班次明细、风险明细和不可用列表。"
  - "复用现有本地 MVP 数据契约，不新增真实数据源。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不提供审批、批量调班、自动排班或生产公式能力。"
dependencies:
  - "US029"
  - "US036"
status: "done"
```

### US038 - 风险提示表局部 table parity 迁移

```yaml
id: US038
requirement_ids:
  - R020
  - R021
  - R025
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划页的风险提示表先迁移到 TanStack Table 局部实现，以便后续逐步接近 shadcn dashboard table 交互。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "新增局部 ScheduleRiskTable 组件。"
  - "风险提示表由 TanStack Table 管理列和排序。"
  - "保留风险等级、日期、时段、项目、职场、缺口、不可用、原因、建议和明细/班次动作。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不启用批量选择、拖拽排序、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US036"
  - "US037"
status: "done"
```

### US039 - 开发服务器原生运行时硬化

```yaml
id: US039
requirement_ids:
  - R026
module: "Harness"
role: "前端开发者"
story: "作为前端开发者，我希望 `npm run dev` 和 `scripts/dev.sh` 在本机总是通过受控 Node.js 22 与受检原生包链路启动，以便不会再因为默认 Node 或 native addon 签名/缺失问题把错误拖到运行时 500。"
task_type: "harness"
priority: "P0"
acceptance:
  - "`npm run dev` 收口到项目受控开发入口，而不是裸 `next dev`。"
  - "开发入口会在启动前验证 `lightningcss` 和 Next.js compiler 原生包可加载。"
  - "开发入口与 build 统一使用 webpack 链路。"
  - "回归测试覆盖支持运行时成功和默认 Codex Node 失败可识别两类场景。"
  - "不新增依赖、不修改 lockfile、不改业务代码或后端契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US035"
status: "done"
```

### US040 - Python 3.12 开发运行时固化

```yaml
id: US040
requirement_ids:
  - R027
module: "Harness"
role: "前后端开发者"
story: "作为前后端开发者，我希望 backend dev/check 入口只接受 Python 3.12，并在启动前明确验证版本和依赖，以便不同 PATH 或系统 Python 不会悄悄改变项目运行时。"
task_type: "harness"
priority: "P0"
acceptance:
  - "项目根目录提供 `.python-version` 并声明 Python 3.12。"
  - "backend runtime 验证会拒绝系统 Python 3.9 等不受支持版本。"
  - "回归测试覆盖支持运行时成功、系统 Python 失败可识别两类场景。"
  - "README、setup、project state 和 backend README 明确 Python 3.12 约束。"
  - "不新增依赖、不修改业务代码或后端契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US039"
status: "done"
```

### US041 - Harness 标准化分支与验证工作流

```yaml
id: US041
requirement_ids:
  - R028
module: "Harness"
role: "PM"
story: "作为 PM，我希望 Codex 在每个任务中使用可审计的分支、worktree、验证、提交、集成和 push 确认流程，同时让 AGENTS.md 保持短版入口，以便后续开发既能连续推进又能控制风险。"
task_type: "harness"
priority: "P0"
acceptance:
  - "AGENTS.md 保留规则优先级、入口、分支红线、stop condition、Story Runner 和 push 控制等短版原则。"
  - "docs/quality/GIT_BRANCH_WORKFLOW.md 提供命令级 runbook。"
  - "docs/quality/FRONTEND_RULES.md 承接详细前端规则，避免 AGENTS.md 继续膨胀。"
  - "GATE_REGISTRY.md 映射分支、scope diff、最终验证和本地提交证据要求。"
  - "DONE_REPORT_TEMPLATE.md 增加分支、提交、集成和 push 决策证据字段。"
  - "H017 的 task-log、branch-log、decision-log 和 audit-report 留痕完整。"
  - "不修改业务实现、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US035"
status: "done"
```

### US042 - No Database MVP Mode 固化

```yaml
id: US042
requirement_ids:
  - R029
module: "MVP 范围"
role: "PM"
story: "作为 PM，我希望项目在功能开发完毕前明确保持 No Database MVP Mode，以便当前没有数据库环境时仍能继续验证本地业务链路。"
task_type: "harness"
priority: "P0"
acceptance:
  - "Project State、Gate Registry、Decision Log 和追踪日志明确 no-database 边界。"
  - "任何数据库连接、ORM、migration、schema、持久化配置或真实数据接入都被列为 hard stop。"
  - "允许继续使用本地接口、种子数据、进程内存和前端 fallback 完成本地 MVP 验证。"
  - "不修改 backend、package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US041"
status: "done"
```

### US043 - 本地 MVP 功能闭环入口

```yaml
id: US043
requirement_ids:
  - R030
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划页看到本地 MVP 链路入口，以便从需求计划、排班计划、风险明细、不可用影响和班次明细之间连续复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划页展示本地 MVP 链路面板。"
  - "链路面板可跳转到需求计划、排班计划、风险明细、不可用管理和班次明细。"
  - "链路面板明确当前为 No Database 本地 MVP。"
  - "不新增后端接口、不新增 mock 数据、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US042"
  - "US036"
  - "US037"
status: "done"
```

### US044 - 排班计划主表 table parity 局部迁移

```yaml
id: US044
requirement_ids:
  - R031
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划主表也使用 TanStack Table 管理列和排序，以便逐步接近 shadcn dashboard table 的实现方式。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "排班计划主表由 TanStack Table 管理列、行模型和排序。"
  - "保留日期、项目、职场、状态、缺口、覆盖率、版本、预测、已排和查看动作。"
  - "排序仍为展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US038"
  - "US043"
status: "done"
```

### US045 - 本地 MVP 验收审计

```yaml
id: US045
requirement_ids:
  - R032
module: "质量与交付"
role: "PM"
story: "作为 PM，我希望在本轮 no-database、功能闭环和 table parity 后看到一轮验收审计，以便确认下一步仍应围绕本地 MVP 而不是数据库展开。"
task_type: "qa"
priority: "P0"
acceptance:
  - "审计报告记录 No Database MVP Mode、功能闭环入口和 table parity 迁移结果。"
  - "明确当前仍不包含数据库、真实集成、权限、审批、导出、批量和生产口径。"
  - "记录最终 `bash scripts/check.sh` 验证结果。"
  - "给出下一阶段建议。"
dependencies:
  - "US042"
  - "US043"
  - "US044"
status: "done"
```

### US046 - 排班计划详情复核链路补强

```yaml
id: US046
requirement_ids:
  - R033
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划详情页直接看到班次、风险和不可用的复核入口与本地计数，以便更快完成同一计划的人工复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划详情页新增复核链路面板。"
  - "面板展示缺口时段、关联风险和生效中不可用的本地计数。"
  - "面板可跳转到班次明细、风险提示和不可用管理相关视图。"
  - "复用现有本地 MVP 契约，不新增后端接口、真实数据源、数据库或依赖。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US043"
  - "US045"
status: "done"
```

### US047 - 班次明细 table parity 第二条迁移

```yaml
id: US047
requirement_ids:
  - R034
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望班次明细页也使用 TanStack Table 管理列和排序，以便继续靠近 shadcn dashboard table 的展示体验。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "班次明细页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时段、项目、职场、状态、预测、已排、缺口、覆盖率、备注和计划动作。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US046"
  - "US044"
status: "done"
```

### US048 - 不可用记录 table parity 第三条迁移

```yaml
id: US048
requirement_ids:
  - R035
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用记录页也使用 TanStack Table 管理列和排序，以便本地 MVP 的主要列表都收口到一致的 table parity 体验。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用记录页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时间、人员、团队、项目、职场、原因、状态、影响时段、备注和影响/班次动作。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US047"
status: "done"
```

### US049 - F021-F023 本地链路 QA 验收收口

```yaml
id: US049
requirement_ids:
  - R036
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F021-F023 进行一次集中验收，确认复核链路和两条 table parity 在 no-database 模式下可验证、可追溯、可持续交付。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "验证排班计划详情可见复核链路入口和关键计数。"
  - "验证班次明细和不可用记录均由独立 TanStack Table 组件渲染并保留既有动作入口。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US046"
  - "US047"
  - "US048"
status: "done"
```

### US050 - 需求计划 table parity 第四条迁移

```yaml
id: US050
requirement_ids:
  - R037
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望需求计划页也使用 TanStack Table 管理列和排序，以便本地 MVP 的主要表格保持一致交互节奏。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "需求计划页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时段、项目、职场、预测人数、来源、状态字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US048"
status: "done"
```

### US051 - F024 单故事 QA 验收收口

```yaml
id: US051
requirement_ids:
  - R038
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F024 做单故事验收收口，确认需求计划 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "验证需求计划页面由独立 TanStack Table 组件渲染且关键字段仍保留。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US050"
status: "done"
```

### US052 - 排班计划详情时段表 table parity 第五条迁移

```yaml
id: US052
requirement_ids:
  - R039
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划详情页的 0.5h 时段表也使用 TanStack Table 管理列和排序，以保持主要表格一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "排班计划详情时段表由独立 TanStack Table 组件渲染。"
  - "保留开始、结束、预测、已排、缺口、覆盖率、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US050"
status: "done"
```

### US053 - F025 单故事 QA 验收收口

```yaml
id: US053
requirement_ids:
  - R040
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F025 做单故事验收收口，确认排班计划详情时段表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "排班计划详情页 0.5h 时段表由独立 TanStack Table 组件渲染。"
  - "时段表字段保留：开始、结束、预测、已排、缺口、覆盖率、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US052"
status: "done"
```

### US054 - 风险明细受影响班次表 table parity 第六条迁移

```yaml
id: US054
requirement_ids:
  - R041
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望风险明细页的受影响班次表也使用 TanStack Table 管理列和排序，以继续收口关键详情视图的一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "风险明细页受影响班次表由独立 TanStack Table 组件渲染。"
  - "保留计划、状态、时段、预测、已排、缺口、覆盖率、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US052"
status: "done"
```

### US055 - F026 单故事 QA 验收收口

```yaml
id: US055
requirement_ids:
  - R042
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F026 做单故事验收收口，确认风险明细受影响班次表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细页受影响班次表由独立 TanStack Table 组件渲染。"
  - "受影响班次表字段保留：计划、状态、时段、预测、已排、缺口、覆盖率、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US054"
status: "done"
```

### US056 - 风险明细不可用影响表 table parity 第七条迁移

```yaml
id: US056
requirement_ids:
  - R043
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望风险明细页的不可用影响表也使用 TanStack Table 管理列和排序，以统一详情页的表格交互。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "风险明细页不可用影响表由独立 TanStack Table 组件渲染。"
  - "保留人员、团队、时间、原因、状态、影响时段、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US054"
status: "done"
```

### US057 - F027 单故事 QA 验收收口

```yaml
id: US057
requirement_ids:
  - R044
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F027 做单故事验收收口，确认风险明细不可用影响表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细页不可用影响表由独立 TanStack Table 组件渲染。"
  - "不可用影响表字段保留：人员、团队、时间、原因、状态、影响时段、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US056"
status: "done"
```

### US058 - 不可用影响详情受影响班次表 table parity 第八条迁移

```yaml
id: US058
requirement_ids:
  - R045
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用影响详情页的受影响班次表也使用 TanStack Table 管理列和排序，以继续收口详情视图的一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用影响详情页受影响班次表由独立 TanStack Table 组件渲染。"
  - "保留计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US056"
status: "done"
```

### US059 - F028 单故事 QA 验收收口

```yaml
id: US059
requirement_ids:
  - R046
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F028 做单故事验收收口，确认不可用影响详情受影响班次表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "不可用影响详情页受影响班次表由独立 TanStack Table 组件渲染。"
  - "受影响班次表字段保留：计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US058"
status: "done"
```

### US060 - 不可用影响详情关联风险表 table parity 第九条迁移

```yaml
id: US060
requirement_ids:
  - R047
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用影响详情页的关联风险表也使用 TanStack Table 管理列和排序，以完成这组详情页 parity 闭环。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用影响详情页关联风险表由独立 TanStack Table 组件渲染。"
  - "保留风险、时段、缺口、不可用、原因、建议和动作字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US058"
status: "done"
```

### US061 - F029 单故事 QA 验收收口

```yaml
id: US061
requirement_ids:
  - R048
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F029 做单故事验收收口，确认不可用影响详情关联风险表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "不可用影响详情页关联风险表由独立 TanStack Table 组件渲染。"
  - "关联风险表字段保留：风险、时段、缺口、不可用、原因、建议和动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US060"
status: "done"
```

### US062 - 详情页 table parity 连续开发块 QA 总收口

```yaml
id: US062
requirement_ids:
  - R049
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望在 F026-F029 完成后，对风险明细和不可用影响详情这组详情页 table parity 做一次总收口，确认连续开发块可验证、可追溯、可持续交付。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细两张表与不可用影响详情两张表均已迁移为独立 TanStack Table 组件。"
  - "相关详情页动作入口保持可用，未引入审批、导出、批量调班或生产动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US055"
  - "US057"
  - "US059"
  - "US061"
status: "done"
```

### US063 - Harness 状态治理 v3 第一轮落地

```yaml
id: US063
requirement_ids:
  - R051
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望默认启动上下文从大 backlog/user stories 切到 current 状态层，并能通过 registry 和 check-state 发现状态漂移，以便后续开发不再依赖读取超大历史文件。"
task_type: "harness"
priority: "P1"
acceptance:
  - "新增 `docs/current/PROJECT_CONTEXT.md`、`docs/current/STORY_QUEUE.yaml`、`docs/current/ACTIVE_TASKS.yaml` 和 `docs/current/BLOCKERS.md`。"
  - "新增 `docs/registry/TRACE_INDEX.yaml` 和 `docs/registry/DECISION_INDEX.yaml`，且 `TRACE_INDEX.yaml` 不记录 status。"
  - "新增 `scripts/check-state.sh`，默认 warning-only，并支持 `--repair-scope` 和 `--strict`。"
  - "AGENTS、Lightweight Harness、Gate Registry、Done Report Template 和 Project State 已对齐 current/registry/archive、History-On-Demand、archive 不可执行、single writer 和 State Repair Mode。"
  - "不迁移大量 done 历史，不改业务代码，不改 package/lockfile，不接数据库。"
  - "`bash scripts/check-state.sh` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US062"
status: "done"
```

### US064 - check-state 标准验证链路接入

```yaml
id: US064
requirement_ids:
  - R052
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望标准检查能自动暴露 current/registry 状态漂移，并用回归测试证明 warning-only 不会让普通任务自锁。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 运行 `bash scripts/check-state.sh`。"
  - "新增 `scripts/tests/check-state.test.mjs`，覆盖一致状态、warning-only 不自锁、strict 缺 active task 失败、TRACE_INDEX lifecycle state 失败。"
  - "`scripts/check-state.sh` 支持测试通过 `BPO_STATE_ROOT` 注入临时状态根目录。"
  - "不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US063"
status: "done"
```

### US065 - current queue 真实任务冒烟

```yaml
id: US065
requirement_ids:
  - R053
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望用 current queue 执行一条真实治理小任务，验证下一轮任务可以从 current 层启动而不是读取大 backlog。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`docs/current/STORY_QUEUE.yaml` 曾提供 ready story，`docs/current/ACTIVE_TASKS.yaml` 曾提供匹配 active task。"
  - "`bash scripts/check-state.sh --strict` 在 current entry 存在时通过。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "TRACE_INDEX 记录 US065/H024 的历史定位，但不记录 lifecycle state。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US064"
status: "done"
```

### US066 - current done history 不变量检查

```yaml
id: US066
requirement_ids:
  - R054
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 state check 能发现 current 文件中的 done 历史，避免 current 层重新膨胀成历史日志。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`STORY_QUEUE.yaml` 出现 `status: done` 时 warning-only mode 告警，strict mode 失败。"
  - "`ACTIVE_TASKS.yaml` 出现 `status: done` 时 strict mode 失败。"
  - "state-check 回归测试覆盖 done story/task in current。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US065"
status: "done"
```

### US067 - check-state strict 默认阻断

```yaml
id: US067
requirement_ids:
  - R055
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望普通任务的标准检查默认阻断状态漂移，同时 state-repair 任务仍有明确旁路。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 默认运行 `bash scripts/check-state.sh --strict`。"
  - "`BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh` 可用于 State Repair Mode。"
  - "`BPO_STATE_CHECK_MODE=warning bash scripts/check.sh` 可用于临时诊断。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US066"
status: "done"
```

### US068 - TRACE_INDEX current_files 路径校验

```yaml
id: US068
requirement_ids:
  - R056
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 check-state 校验 TRACE_INDEX 的 current_files 路径，避免 registry 指向缺失 current 文件。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`TRACE_INDEX.yaml` 的 `current_files` 路径会被 check-state 校验。"
  - "重复 registry 路径不会产生重复输出。"
  - "回归测试覆盖 missing current_files path strict 失败。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US067"
status: "done"
```

### US069 - Codex Plan 面板边界规则

```yaml
id: US069
requirement_ids:
  - R057
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 Codex Plan 面板只作为当前会话投影视图，避免它被误用成项目状态源。"
task_type: "harness"
priority: "P1"
acceptance:
  - "AGENTS.md 明确 Codex Plan is not a source of truth。"
  - "STATE_MANAGEMENT.md 明确 Plan 必须从 Harness current queue 派生。"
  - "当 Codex Plan 与 Harness state 冲突时，Harness state wins。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US068"
status: "done"
```

### US070 - Dashboard 异常明细表 TanStack Table parity

```yaml
id: US070
requirement_ids:
  - R058
module: "前端设计"
role: "运营负责人"
story: "作为运营负责人，我希望 dashboard 的 BPO 异常明细表也使用 TanStack Table 管理排序和分页，以便首页表格与其他 MVP 表格保持一致。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "Dashboard 异常明细表由 TanStack Table 管理列、排序和分页。"
  - "保留异常编号、异常类型、团队、人数、影响工时、严重度、状态、项目、班次时间和操作字段。"
  - "搜索、排序和分页仍为本地展示行为，不改变数据来源或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US069"
status: "done"
```

### US071 - Dashboard 异常明细表本地列显示与分页控制

```yaml
id: US071
requirement_ids:
  - R059
module: "前端设计"
role: "运营负责人"
story: "作为运营负责人，我希望 dashboard 异常明细表的列控制和分页大小是可用的本地交互，以便快速聚焦异常字段。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "列控制按钮可打开本地列显示开关。"
  - "分页大小可在本地切换，并保持当前筛选结果下的页码有效。"
  - "交互只改变本地表格展示，不触发真实动作或后端写入。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US070"
status: "done"
```

### US072 - F030-F031 dashboard table parity QA 收口

```yaml
id: US072
requirement_ids:
  - R060
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F030-F031 做验收收口，确认 dashboard table parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "Dashboard 异常明细表使用 TanStack Table 管理排序和分页。"
  - "列显示与分页大小控制可用，且未引入审批、导出、批量或生产动作。"
  - "完成审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US071"
status: "done"
```

### US083-US102 - 排班/风险/不可用表格本地 parity 连续增强

```yaml
stories:
  - {id: US083, requirement_ids: [R071], task_ids: [F041], status: done, story: "排班计划表需要本地筛选与统计模型测试。"}
  - {id: US084, requirement_ids: [R072], task_ids: [F042], status: done, story: "排班计划表需要本地摘要条。"}
  - {id: US085, requirement_ids: [R073], task_ids: [F043], status: done, story: "排班计划表需要本地查询、状态和缺口筛选。"}
  - {id: US086, requirement_ids: [R074], task_ids: [F044], status: done, story: "排班计划表需要重置筛选和空结果提示。"}
  - {id: US087, requirement_ids: [R075], task_ids: [F045], status: done, story: "排班计划表需要本地分页范围与翻页控制。"}
  - {id: US088, requirement_ids: [R076], task_ids: [F046], status: done, story: "排班计划表需要本地列显示控制。"}
  - {id: US089, requirement_ids: [R077], task_ids: [F047], status: done, story: "风险提示表需要本地筛选与统计模型测试。"}
  - {id: US090, requirement_ids: [R078], task_ids: [F048], status: done, story: "风险提示表需要本地摘要条。"}
  - {id: US091, requirement_ids: [R079], task_ids: [F049], status: done, story: "风险提示表需要风险等级筛选。"}
  - {id: US092, requirement_ids: [R080], task_ids: [F050], status: done, story: "风险提示表需要本地搜索。"}
  - {id: US093, requirement_ids: [R081], task_ids: [F051], status: done, story: "风险提示表需要本地分页范围与翻页控制。"}
  - {id: US094, requirement_ids: [R082], task_ids: [F052], status: done, story: "风险提示表需要重置筛选和空结果提示。"}
  - {id: US095, requirement_ids: [R083], task_ids: [F053], status: done, story: "不可用表需要本地筛选与统计模型测试。"}
  - {id: US096, requirement_ids: [R084], task_ids: [F054], status: done, story: "不可用表需要本地摘要条。"}
  - {id: US097, requirement_ids: [R085], task_ids: [F055], status: done, story: "不可用表需要状态筛选。"}
  - {id: US098, requirement_ids: [R086], task_ids: [F056], status: done, story: "不可用表需要本地搜索。"}
  - {id: US099, requirement_ids: [R087], task_ids: [F057], status: done, story: "不可用表需要本地分页范围与翻页控制。"}
  - {id: US100, requirement_ids: [R088], task_ids: [F058], status: done, story: "不可用表需要重置筛选和空结果提示。"}
  - {id: US101, requirement_ids: [R089], task_ids: [F059], status: done, story: "不可用表需要本地列显示控制。"}
  - {id: US102, requirement_ids: [R090], task_ids: [Q014], status: done, story: "F041-F059 完成后需要 QA 收口。"}
acceptance:
  - "三张本地表格均有筛选摘要、重置、分页范围和空结果提示。"
  - "排班计划表与不可用表具备列显示控制。"
  - "本地筛选和统计模型有回归测试覆盖。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
```

### US621 - 真实导入中心 CSV 上传 API 第一刀

```yaml
id: US621
requirement_ids:
  - R701
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望通过 API 上传 CSV 内容并配置字段映射，以便系统生成可追溯的导入批次、行级错误和 import version。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI CSV 上传入口，接收 text/csv 请求体和导入元数据。"
  - "字段映射能把源列映射为标准字段，并把每行原始数据写入导入行结果。"
  - "缺少必填字段的行会被标为 failed，并记录 error_field、error_code 和 error_message。"
  - "导入完成后生成 import batch、row results、failed rows 和 import version。"
  - "不新增依赖，不实现 multipart/Excel，不接外部系统，不做权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US620"
status: "done"
```

### US622 - 主数据导入应用到 DB003 repository

```yaml
id: US622
requirement_ids:
  - R702
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望把已上传的 master_data CSV 成功行应用到主数据 repository，以便员工、供应商、职场、项目、技能和绑定关系进入生产雏形数据链路。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 主数据导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 master_data 的批次应用到主数据。"
  - "成功行根据 record_type 写入 suppliers、workplaces、projects、skills、employees 和 bindings。"
  - "绑定关系继续复用 DB003 引用校验和冻结校验。"
  - "不新增 schema/migration，不做 CRUD UI、权限、审批、导出、批量或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US621"
status: "done"
```

### US623 - 人员排班导入应用到 DB004 repository

```yaml
id: US623
requirement_ids:
  - R703
module: "导入中心"
role: "排班管理员"
story: "作为排班管理员，我希望把已上传的 personnel_schedule CSV 成功行应用到人员排班 repository，以便生成可追溯的人员排班版本、班次类型、排班明细和 0.5h 区间。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 人员排班导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 personnel_schedule 的批次应用到人员排班。"
  - "成功行根据 record_type 写入 shift types 和 personnel schedule details。"
  - "应用后生成 schedule version，并复用 DB004 0.5h 展开、主数据引用、绑定和冻结校验。"
  - "不新增 schema/migration，不做排班维护 UI、发布/冻结、权限、审批、导出、批量调班或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US622"
status: "done"
```

### US624 - 需求预测导入应用到 DB005 repository

```yaml
id: US624
requirement_ids:
  - R704
module: "导入中心"
role: "计划管理员"
story: "作为计划管理员，我希望把已上传的 demand_forecast CSV 成功行应用到需求预测 repository，以便生成可追溯的预测版本、技能/等级需求和 0.5h 预测区间。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 需求预测导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 demand_forecast 的批次应用到需求预测。"
  - "成功行写入 forecast intervals，并生成 forecast version。"
  - "应用后复用 DB005 30 分钟区间、主数据引用、冻结和业务日期校验。"
  - "支持 compared_from_version_id 和 change_reason 形成版本变更记录。"
  - "不新增 schema/migration，不做预测算法、预测 UI、权限、审批、导出、批量或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US623"
status: "done"
```

### US625 - 登录/状态日志导入应用到 DB006 repository

```yaml
id: US625
requirement_ids:
  - R705
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望把已上传的 login_log/status_log CSV 成功行应用到实际日志 repository，以便登录/登出事件、状态字典和状态区间进入可追溯数据链路。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 实际日志导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 login_log 或 status_log 的批次应用到实际日志。"
  - "login_log 成功行写入 login/logout events，并复用 DB006 import version、employee 和时区校验。"
  - "status_log 成功行可根据 record_type 写入 status dictionary 或 status intervals，并复用 DB006 字典、跨天切分、业务日、employee 和时区校验。"
  - "不新增 schema/migration，不接 CORN/HR/WFM，不做状态码生产规则、权限、审批、导出、批量或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US624"
status: "done"
```

### US626 - 对比计算触发到 DB007 repository

```yaml
id: US626
requirement_ids:
  - R706
module: "对比计算"
role: "运营负责人"
story: "作为运营负责人，我希望触发 forecast vs schedule 和 schedule vs actual 的本地对比计算，以便系统从已导入的预测、排班、实际状态生成可复核的异常结果。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 对比计算入口，接收 comparison_type 和来源版本。"
  - "forecast_vs_schedule 基于 DB005 forecast intervals 与 DB004 schedule intervals 聚合生成 gap 结果。"
  - "schedule_vs_actual 基于 DB004 schedule intervals 与 DB006 productive status intervals 生成 late/matched 结果。"
  - "计算结果写入 DB007 comparison run/results，并复用 DB007 来源版本和结果维度校验。"
  - "不新增 schema/migration，不接外部系统，不做生产状态码/公式定版、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US625"
status: "done"
```

### US627 - 复核闭环写入到 DB008 repository

```yaml
id: US627
requirement_ids:
  - R707
module: "复核闭环"
role: "主管"
story: "作为主管，我希望把对比结果的复核 case、证据、结论和关闭记录写入系统，以便异常处理形成可追溯闭环。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 复核闭环写入入口，接收 case、可选 evidence、可选 conclusion、可选 closure。"
  - "case 来源必须引用 DB007 forecast_schedule 或 schedule_actual result。"
  - "写入顺序为 case -> evidence -> conclusion -> closure，并返回完整 ReviewCaseDetail。"
  - "复用 DB008 来源结果、业务日、case 存在性和重复关闭校验。"
  - "不新增 schema/migration，不做审批流、权限、批量关闭、导出或外部证据服务。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US626"
status: "done"
```

### US628 - 持久化结果查询 API 收口

```yaml
id: US628
requirement_ids:
  - R708
module: "结果查询"
role: "主管"
story: "作为主管，我希望按对比 run_id 或复核 case_id 读回已持久化的详情，以便后续页面和接口可以消费真实闭环结果，而不是只依赖写入响应。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增 GET /api/v1/comparison-runs/{run_id}，返回 DB007 ComparisonRunDetail。"
  - "新增 GET /api/v1/review-cases/{case_id}，返回 DB008 ReviewCaseDetail。"
  - "查询不存在时返回 404 和稳定错误码。"
  - "不新增 schema/migration，不做模板持久化、前端、外部集成、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US627"
status: "done"
```

### US629 - 持久化结果列表筛选 API 第一刀

```yaml
id: US629
requirement_ids:
  - R709
module: "结果查询"
role: "主管"
story: "作为主管，我希望按业务日、类型、状态和 owner 等条件列出已持久化的对比 run 与复核 case，以便从真实闭环记录中定位需要查看的对象。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增 GET /api/v1/comparison-runs，返回 DB007 ComparisonRunRecord 列表。"
  - "comparison runs 支持 comparison_type、status、business_date 筛选。"
  - "新增 GET /api/v1/review-cases，返回 DB008 ReviewCaseRecord 列表。"
  - "review cases 支持 business_date、owner_id、status、severity、source_result_type 筛选。"
  - "不新增 schema/migration，不做分页、前端、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US628"
status: "done"
```

### US630 - 计算与复核写入幂等重跑保护第一刀

```yaml
id: US630
requirement_ids:
  - R710
module: "结果写入"
role: "主管"
story: "作为主管，我希望重复触发相同对比计算或复核关闭写入时系统直接返回已有结果，以免重复点击造成重复写入或错误噪音。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "重复调用 POST /api/v1/comparison-runs/calculate 且 run_id 已存在时，返回已有 ComparisonRunDetail。"
  - "重复调用 POST /api/v1/review-cases/write-closure 且 case_id 已存在时，返回已有 ReviewCaseDetail。"
  - "重复请求不新增 comparison results、review evidence、review conclusions 或 review closures。"
  - "保留原有缺失引用和非法请求校验。"
  - "不新增 schema/migration，不做导入 apply 重跑、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US629"
status: "done"
```

### US631 - 主数据导入应用幂等重跑保护第一刀

```yaml
id: US631
requirement_ids:
  - R711
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望同一个 master_data 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复写入逻辑和操作噪音。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-master-data 返回 applied_status=applied。"
  - "同一 master_data batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 master data snapshot 写入。"
  - "保留非 master_data 批次、缺失字段和引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US630"
status: "done"
```

### US632 - 人员排班导入应用幂等重跑保护第一刀

```yaml
id: US632
requirement_ids:
  - R712
module: "导入中心"
role: "排班管理员"
story: "作为排班管理员，我希望同一个 personnel_schedule 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复版本、明细和 0.5h interval 写入。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-personnel-schedule 返回 applied_status=applied。"
  - "同一 personnel_schedule batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 schedule version、shift type、schedule detail 或 0.5h interval 写入。"
  - "保留非 personnel_schedule 批次、缺失字段、导入版本和主数据引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US631"
status: "done"
```

### US633 - 需求预测导入应用幂等重跑保护第一刀

```yaml
id: US633
requirement_ids:
  - R713
module: "导入中心"
role: "计划管理员"
story: "作为计划管理员，我希望同一个 demand_forecast 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复预测版本、预测明细和变更记录写入。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-forecast 返回 applied_status=applied。"
  - "同一 demand_forecast batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 forecast version、forecast interval 或 forecast change 写入。"
  - "保留非 demand_forecast 批次、缺失字段、导入版本和主数据引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US632"
status: "done"
```

### US634 - 实际日志导入应用幂等重跑保护第一刀

```yaml
id: US634
requirement_ids:
  - R714
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望同一个 login_log 或 status_log 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复登录事件、状态字典和状态区间写入。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-actual-logs 返回 applied_status=applied。"
  - "同一 login_log 或 status_log batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 login event、status dictionary 或 status interval 写入。"
  - "保留非 actual log 批次、缺失字段、导入版本、时区和主数据引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US633"
status: "done"
```

### US635 - 导入批次应用结果查询摘要第一刀

```yaml
id: US635
requirement_ids:
  - R715
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望按导入批次查询当前是否已经应用以及应用到了哪个目标，以便在真实上传/导入闭环中判断下一步动作，而不是只看上传批次本身。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增 GET /api/v1/import-batches/{batch_id}/application-summary。"
  - "返回 batch_id、file_type、application_status、application_target、import_version_id 和 applied_record_count。"
  - "对 master_data、personnel_schedule、demand_forecast、login_log、status_log 复用现有 repository 判断是否已应用。"
  - "查询不存在的 batch 返回 404 和稳定错误码。"
  - "不新增 schema/migration，不做模板持久化、字段映射 CRUD、前端、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US634"
status: "done"
```

### US636 - 字段映射模板持久化第一刀

```yaml
id: US636
requirement_ids:
  - R716
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望保存并复用导入字段映射模板，以便同类文件后续上传时不必重复手工传完整字段映射。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增字段映射模板持久化表和 Alembic migration。"
  - "新增创建、列表、单查字段映射模板 API。"
  - "模板包含 template_id、template_name、file_type、field_mapping、created_by、created_at 和 is_active。"
  - "upload-csv 支持 template_id 复用模板，同时保留直接 field_mapping JSON 上传。"
  - "缺失模板返回稳定错误码；重复模板 ID 返回稳定冲突错误码。"
  - "不做前端、Excel/multipart、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US635"
status: "done"
```

### US637 - 导入失败行修正第一刀

```yaml
id: US637
requirement_ids:
  - R717
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望修正导入批次中的单条失败行，以便不用重新上传整批文件也能把可修复数据推进到后续应用流程。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增失败行修正 API，可按 batch_id 和 row_number 修正 failed row。"
  - "修正请求写入 corrected standard_fields，将 row_status 改为 success，清空 error_field/error_code/error_message，并设置 source_key。"
  - "修正后重算 import batch success_rows、failed_rows、warning_rows 和 processing_status。"
  - "只允许修正 failed row；不存在 batch、row 或非 failed row 返回稳定错误码。"
  - "不新增 schema/migration，不做修正历史表、前端、批量修正、自动 apply、Excel/multipart、权限、审批、导出、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US636"
status: "done"
```

### US638 - 导入批次列表与应用状态查询第一刀

```yaml
id: US638
requirement_ids:
  - R718
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望看到导入批次列表中的上传结果、版本数量和应用状态，以便判断哪些批次还需要修正、应用或复核。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增导入批次列表查询 API。"
  - "列表行返回批次基础信息、成功/失败/警告计数、版本数和应用状态摘要。"
  - "支持按 file_type、processing_status、uploaded_by 和 application_status 进行只读过滤。"
  - "复用现有 import batch、version 和 application-summary 判断，不新增 schema/migration。"
  - "不做前端、分页、导出、批量、权限、审批、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US637"
status: "done"
```

### US639 - 字段映射模板更新与停用第一刀

```yaml
id: US639
requirement_ids:
  - R719
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望修正或停用字段映射模板，以便错误模板不会继续被上传流程复用。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增字段映射模板更新 API，可更新 template_name 和 field_mapping。"
  - "新增字段映射模板停用 API，将模板置为 inactive。"
  - "停用模板不再出现在列表/单查中，upload-csv 按 template_id 复用时返回缺失模板错误。"
  - "不存在模板时返回稳定错误码。"
  - "不新增 schema/migration，不做前端、物理删除、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US638"
status: "done"
```

### US640 - 导入批次应用前就绪校验第一刀

```yaml
id: US640
requirement_ids:
  - R720
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在应用导入批次前看到明确的就绪状态和阻塞原因，以便先处理失败行、缺失版本或已应用批次，而不是盲目点击应用。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增导入批次应用前只读就绪校验 API。"
  - "返回 batch_id、file_type、readiness_status、阻塞原因、失败行数、成功行数、版本数和应用状态摘要。"
  - "存在 failed rows、无成功行、无导入版本、已应用批次时返回 blocked。"
  - "不存在批次时返回稳定错误码。"
  - "不新增 schema/migration，不做自动 apply、前端、深度主数据校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US639"
status: "done"
```

### US641 - 导入批次应用前行级字段预检第一刀

```yaml
id: US641
requirement_ids:
  - R721
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入批次应用前看到成功行的字段级阻塞原因，以便先修正缺字段数据再执行应用。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "apply-readiness 返回 row_blockers 行级阻塞列表。"
  - "成功行缺少当前 file_type/record_type 所需标准字段时返回 blocked。"
  - "行级阻塞包含 row_number、code、field_name 和 message。"
  - "干净批次仍返回 ready 且 row_blockers 为空。"
  - "不新增 schema/migration，不做自动 apply、前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US640"
status: "done"
```

### US642 - 导入应用前 readiness 安全闸第一刀

```yaml
id: US642
requirement_ids:
  - R722
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望导入应用接口在写入前自动拦截未就绪批次，以便缺字段或缺版本的数据不会进入业务表。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "apply-master-data 与 apply-forecast 在写入前复用 apply-readiness 结果。"
  - "未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY` 错误，并包含 readiness 详情。"
  - "已应用批次继续返回现有 already_applied 幂等响应，不被 readiness 安全闸改成错误。"
  - "不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US641"
status: "done"
```

### US643 - 人员排班与实际日志应用前 readiness 安全闸第一刀

```yaml
id: US643
requirement_ids:
  - R723
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望人员排班和实际日志导入应用也在写入前自动拦截未就绪批次，以便四类导入应用口径一致。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "apply-personnel-schedule 与 apply-actual-logs 在写入前复用 apply-readiness 结果。"
  - "未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY` 错误，并包含 readiness 详情。"
  - "已应用批次继续返回现有 already_applied 幂等响应，不被 readiness 安全闸改成错误。"
  - "不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US642"
status: "done"
```

### US644 - 导入中心前端 API 接入第一刀

```yaml
id: US644
requirement_ids:
  - R724
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在前端导入中心看到真实 API 返回的导入批次和应用准备度，以便不用只看本地静态展示就能判断批次是否需要修正或应用。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增或接通 `/data-quality` 前端页面，页面从本地 FastAPI `GET /api/v1/import-batches` 读取导入批次列表。"
  - "选中批次后只读调用 `GET /api/v1/import-batches/{batch_id}/apply-readiness`，展示 readiness、阻塞项和行级阻塞。"
  - "侧边栏数据与集成下的文件导入、接入批次、数据质量入口指向 `/data-quality` 并具备当前选中态。"
  - "页面具备加载、空数据和 API 错误状态，不使用新增静态业务样例代替 API 结果。"
  - "不新增依赖，不修改 package/lockfile，不做上传写入、apply 写操作、审批、导出、批量、权限、外部集成、schema/migration、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和浏览器 smoke 通过。"
dependencies:
  - "US643"
status: "done"
```

### US645 - 导入中心 CSV 上传表单第一刀

```yaml
id: US645
requirement_ids:
  - R725
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心页面选择本地 CSV 文件并提交到现有上传 API，以便真实生成导入批次而不是只看空列表。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 页面新增 CSV 上传表单，可提交 batch_id、file_name、file_type、uploaded_by、业务日期和 field_mapping JSON。"
  - "上传表单读取本地 CSV 文件内容，通过 Next server action 调用现有 `POST /api/v1/import-batches/upload-csv`，成功后跳转到新 batch。"
  - "上传失败返回 `/data-quality?upload=failed` 并展示错误状态，不吞掉 API 错误。"
  - "上传成功后仍复用现有批次列表和 apply-readiness 读取，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做 Excel/multipart、apply 写操作、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和本地上传 smoke 通过。"
dependencies:
  - "US644"
status: "done"
```

### US646 - 导入中心失败行列表与单行修正 UI 第一刀

```yaml
id: US646
requirement_ids:
  - R726
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心页面看到失败行明细并提交单行修正，以便上传后可以直接完成错误行闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 读取选中批次 detail，并展示 failed_rows 列表。"
  - "每条失败行展示 row_number、error_field、error_code、error_message 和 raw_data/standard_fields 摘要。"
  - "每条失败行提供单行修正表单，通过 Next server action 调用现有 `POST /api/v1/import-batches/{batch_id}/rows/{row_number}/correct`。"
  - "修正成功后回到当前 batch 并展示成功状态，继续复用批次列表和 apply-readiness。"
  - "不新增依赖，不修改 package/lockfile，不做批量修正、apply 写按钮、后端、schema/migration、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和本地修正 smoke 通过。"
dependencies:
  - "US645"
status: "done"
```

### US647 - 导入中心字段映射模板选择第一刀

```yaml
id: US647
requirement_ids:
  - R727
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望上传 CSV 时可以选择已有字段映射模板，以便复用稳定映射并减少每次手填 JSON 的错误。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 读取现有 field mapping templates 列表，并在 CSV 上传表单展示模板选择。"
  - "上传表单选择模板后提交 template_id 到现有 upload-csv API。"
  - "无模板或模板 API 异常时仍保留手填 field_mapping JSON 上传路径。"
  - "模板列表展示模板名称、类型和映射摘要，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做模板 CRUD UI、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和本地模板上传 smoke 通过。"
dependencies:
  - "US646"
status: "done"
```

### US648 - 导入中心批次明细 drilldown 第一刀

```yaml
id: US648
requirement_ids:
  - R728
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在选中导入批次后看到版本、全部行结果和字段预览，以便不用离开页面就能判断批次内容和下一步处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示 persisted detail drilldown。"
  - "明细展示批次行状态分布、版本列表、全部行结果和 standard_fields/raw_data 预览。"
  - "明细 API 异常或无批次时展示空/错误状态，不新增静态业务样例。"
  - "只读展示，不新增 apply 写按钮、批量修正、模板 CRUD、后端、schema/migration、导出、权限、审批、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US647"
status: "done"
```

### US649 - 导入中心失败行修正结果反馈打磨

```yaml
id: US649
requirement_ids:
  - R729
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望失败行修正后看到明确的成功/失败结果、剩余失败行数量和下一步提示，以便判断还要继续修正还是回到批次准备度检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 在单行修正成功后展示可读结果摘要。"
  - "结果摘要展示修正行号、剩余失败行数量和下一步处理提示。"
  - "修正失败时把常见失败原因翻译成业务可读说明。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、批量修正、apply 写按钮、模板 CRUD、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US648"
status: "done"
```

### US650 - 导入中心字段映射模板只读管理可见性

```yaml
id: US650
requirement_ids:
  - R730
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心看到字段映射模板库存、状态和覆盖范围，以便判断当前模板是否足够支撑不同文件类型的后续上传。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 展示字段映射模板只读管理面板。"
  - "面板展示模板总数、启用/停用数量、覆盖文件类型数量和映射字段数量。"
  - "每个模板展示文件类型、状态、创建人、创建时间和字段映射摘要。"
  - "模板 API 异常或无模板时展示空/错误状态，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做模板新增/编辑/停用按钮、后端、schema/migration、审批、导出、权限、批量、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US649"
status: "done"
```

### US651 - 导入中心上传前模板适配提示

```yaml
id: US651
requirement_ids:
  - R731
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望上传 CSV 前看到各文件类型的模板适配情况和兜底路径，以便选择正确模板或改用手填字段映射 JSON。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 上传区展示模板适配提示。"
  - "提示展示各文件类型的启用模板数、推荐模板说明、映射字段数量和手填 JSON 兜底。"
  - "无匹配模板或模板 API 异常时展示可读提示，不新增静态业务样例。"
  - "移除 `/data-quality` 路由级 loading fallback，避免 in-app browser 停在骨架屏看不到主内容。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、模板 CRUD、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US650"
status: "done"
```

### US652 - 导入中心应用前行动建议

```yaml
id: US652
requirement_ids:
  - R732
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在应用写入前看到明确行动建议，以便根据失败行、行级缺字段、版本和已应用状态决定下一步。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示应用前行动建议。"
  - "建议区根据 readiness、失败行、行级缺字段、版本和已应用状态输出下一步。"
  - "准备度 API 异常或无批次时展示可读兜底提示。"
  - "只读展示，不新增 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US651"
status: "done"
```

### US653 - 导入中心异常态处理建议

```yaml
id: US653
requirement_ids:
  - R733
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心看到批次、准备度和模板读取异常的统一处理建议，以便先处理前置问题再继续上传、修正或应用前复核。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 展示导入中心异常态处理建议。"
  - "建议区覆盖批次 API 异常、准备度 API 异常、模板 API 异常、暂无批次和暂无模板。"
  - "无异常时展示可继续处理的只读提示。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US652"
status: "done"
```

### US654 - 导入中心上传结果批次入口

```yaml
id: US654
requirement_ids:
  - R734
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望 CSV 上传成功或失败后看到明确的批次入口和下一步处理提示，以便上传后直接进入批次、失败行和准备度检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality?upload=success&batch=...` 展示上传成功后的批次入口和下一步。"
  - "`/data-quality?upload=failed&reason=...&batch=...` 展示失败原因、批次回看入口和重试建议。"
  - "结果提示能指向接入批次、失败行/批次明细和应用准备度，不新增真实 apply 写按钮。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US653"
status: "done"
```

### US655 - 导入中心接入批次筛选

```yaml
id: US655
requirement_ids:
  - R735
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在接入批次列表按文件类型、处理状态、应用状态和关键词筛选上传历史，以便快速定位需要复核或修正的批次。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 接入批次列表提供关键词、文件类型、处理状态和应用状态筛选。"
  - "筛选结果展示匹配数量，并保持批次行可点击进入详情。"
  - "无匹配结果时展示可读空态，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US654"
status: "done"
```

### US656 - 导入中心选中批次处理导览

```yaml
id: US656
requirement_ids:
  - R736
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望选中接入批次后看到批次处理导览，并能快速跳到批次明细、失败行修正和应用准备度，以便减少筛选后继续复核的断点。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示只读处理导览。"
  - "导览根据失败行、警告、应用状态和 readiness 输出下一步定位建议。"
  - "批次行点击和导览链接能定位到批次明细、失败行修正或应用准备度区域。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US655"
status: "done"
```

### US657 - 导入中心应用状态概览

```yaml
id: US657
requirement_ids:
  - R737
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望选中批次后看到只读应用状态概览，以便确认应用目标、导入版本、已应用记录数和下一步状态判断。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示只读应用状态概览。"
  - "概览展示应用状态、应用目标、导入版本和已应用记录数。"
  - "概览根据已应用、未应用且可复核、未应用且阻塞、准备度未知输出下一步口径。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US656"
status: "done"
```

### US658 - 导入中心批次明细可读性增强

```yaml
id: US658
requirement_ids:
  - R738
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次明细页能更清楚地解释当前批次处理结果和错误字段，以便不只看到行表，还能快速判断先看版本、失败行还是应用准备度。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 选中批次后，批次明细展示处理摘要和下一步只读建议。"
  - "摘要根据失败行、警告行、版本记录和总行数解释当前批次该先看哪里。"
  - "全部行结果表能直接看到错误字段，降低只看错误码和 JSON 预览的理解成本。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US657"
status: "done"
```

### US659 - 导入中心数据质量到履约异常追踪可见性

```yaml
id: US659
requirement_ids:
  - R739
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在批次明细中看到数据质量问题会影响哪些履约异常判断，以便先修正会阻塞异常闭环的数据问题。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 选中批次后，批次明细展示只读履约异常影响追踪。"
  - "追踪说明按文件类型、失败行、警告行和版本记录解释可能影响的异常判断。"
  - "追踪说明输出异常影响范围、数据问题摘要和下一步复核建议。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US658"
status: "done"
```

### US660 - 导入中心应用结果到下游结果导航

```yaml
id: US660
requirement_ids:
  - R740
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次应用结果能提示下游可查看的对比结果和复核案例入口，以便从导入中心继续追踪真实业务闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示只读下游结果导航。"
  - "导航根据批次应用状态、文件类型、版本和记录数提示对比结果、复核案例或前置修正路径。"
  - "导航使用现有页面锚点或本地 API 结果路径口径，不新增写入按钮或后端能力。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US659"
status: "done"
```

### US661 - 数据质量页信息架构重构

```yaml
id: US661
requirement_ids:
  - R741
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望数据质量页按工作台、状态检查和分层详情组织，而不是把所有功能纵向堆叠，以便更快完成批次定位、阻塞处理和结果追踪。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 首屏按顶部概览、批次工作台、状态检查器组织，不再把上传、明细、修正全部平铺在主路径。"
  - "批次明细、失败行修正、导入与模板被收纳到分层详情 Tabs。"
  - "`ImportCenterApiPanel` 不再承载全部业务 UI，工作台、状态检查器、概览和详情 Tabs 拆成独立业务组件。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US660"
status: "done"
```

### US662 - 数据质量页下游结果列表可见性

```yaml
id: US662
requirement_ids:
  - R742
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在数据质量页直接看到选中批次业务日关联的对比结果和复核案例列表，以便从导入批次继续追踪下游业务闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 分层详情新增 `结果追踪` Tab。"
  - "结果追踪按选中批次 `business_date_from` 读取并展示已有 comparison-runs 和 review-cases 列表摘要。"
  - "列表展示只读状态、业务日、来源版本或 owner，并提供已有 API/detail 链接口径。"
  - "无数据或 API 异常时展示清晰空态，不新增写入按钮或后端能力。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US661"
status: "done"
```

### US663 - 数据质量批次处理详情页拆分

```yaml
id: US663
requirement_ids:
  - R743
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望数据质量页只负责定位批次，并把批次明细、失败行修正和结果追踪放到单独批次处理页，以便列表页不再变成长页面。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 只保留批次概览、筛选、批次列表和选中批次状态摘要，不再渲染批次明细、失败行修正、结果追踪和导入模板详情。"
  - "批次列表或状态检查器提供进入 `/data-quality/import-batches/[batchId]` 的详情处理入口。"
  - "新增批次详情页集中展示批次明细、失败行修正、结果追踪、导入与模板，并保留选中批次状态检查。"
  - "修正成功/失败 query 仍能在批次详情页展示，不丢失当前处理反馈。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US662"
status: "done"
```

### US664 - 数据质量批次二级详情导航修正

```yaml
id: US664
requirement_ids:
  - R744
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望数据质量列表页只用于定位批次，并通过真正的二级批次详情页处理状态检查、失败行和结果追踪，以便返回列表和继续处理都更顺滑。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 只展示概览、筛选和批次列表，不再渲染选中批次状态检查器。"
  - "批次处理入口进入 `/data-quality/[batchId]`，旧 `/data-quality/import-batches/[batchId]` 可兼容跳转到新二级详情页。"
  - "详情页保留选中批次状态检查器、分层详情、失败行修正、结果追踪和导入模板，并提供返回 `/data-quality?batch=<batchId>` 的列表入口。"
  - "修正成功/失败 query 仍能在二级详情页展示，不丢失当前处理反馈。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US663"
status: "done"
```

### US665 - 数据质量批次详情单列处理流重设计

```yaml
id: US665
requirement_ids:
  - R745
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页按单列处理流程组织，而不是左右分栏，以便状态检查、失败行修正和批次明细都能在全宽工作区内处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 不再使用状态检查器左栏和分层详情右栏的左右分栏。"
  - "详情页在批次头部下方展示处理总览，随后用全宽 Tabs 展示状态检查、失败行修正、批次明细、结果追踪、导入与模板。"
  - "状态检查作为默认工作区 Tab，不再以“选中批次状态检查器”侧栏出现，页面标题不再使用“分层详情”。"
  - "修正成功/失败 query 仍能在详情页展示，不丢失当前处理反馈。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US664"
status: "done"
```

### US666 - 字段映射模板适配详情

```yaml
id: US666
requirement_ids:
  - R746
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页能按当前文件类型说明字段映射模板的适配情况、推荐模板和字段缺口，以便上传和复核前能判断模板是否可用。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的导入与模板页签展示当前批次文件类型的模板适配摘要。"
  - "页面展示推荐启用模板、同类型启用/停用数量、映射字段数、已覆盖标准字段和缺口字段。"
  - "模板卡片展示 source -> standard 字段映射明细，而不是只展示一行摘要。"
  - "无同类型启用模板或模板读取失败时，页面提供只读提示并保留手填字段映射 JSON 作为兜底说明。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、模板 CRUD 写入、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US665"
status: "done"
```

### US667 - 应用准备度问题分组

```yaml
id: US667
requirement_ids:
  - R747
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次状态检查能把应用准备度阻塞按问题类型分组，以便先处理影响应用写入的主要问题。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的状态检查展示应用准备度问题分组。"
  - "问题组覆盖失败行、行级必填字段、版本/应用状态和其他批次阻塞。"
  - "每个问题组展示数量、影响说明、下一步和关键证据。"
  - "无阻塞或已应用状态下也能展示清晰的只读状态说明。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、应用写入、批量处理、审批、导出、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US666"
status: "done"
```

### US668 - 批次详情下游结果追踪 drilldown

```yaml
id: US668
requirement_ids:
  - R748
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页的结果追踪能判断当前批次是否已经进入对比和复核闭环，并给出优先查看的下游结果入口。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示下游结果判断。"
  - "未应用、准备度阻塞、无业务日或结果查询失败时，页面展示清晰阻塞原因和下一步入口。"
  - "已有 comparison-runs 或 review-cases 时，页面给出优先查看的对比运行或复核案例、证据和只读 API 入口。"
  - "对比结果和复核案例表保留在详情页结果追踪工作区下方，不回流到列表页。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US667"
status: "done"
```

### US669 - 数据质量到异常反向聚合 drilldown

```yaml
id: US669
requirement_ids:
  - R749
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页能把导入质量问题按字段和错误原因聚合，并关联当前业务日下游异常影响候选，以便先处理影响最大的质量问题。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示质量影响聚合。"
  - "聚合按导入失败/警告行的错误字段和错误原因分组，展示行数、失败/警告构成和主要证据。"
  - "聚合关联当前业务日的 comparison-runs 与 review-cases，说明影响候选、未关闭复核数量和下一步处理建议。"
  - "无质量问题、无批次明细或下游结果为空时展示清晰只读空态，不新增写入按钮。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US668"
status: "done"
```

### US670 - shadcn/ui 自动化验证链路

```yaml
id: US670
requirement_ids:
  - R750
module: "Harness"
role: "前端开发者"
story: "作为前端开发者，我希望 shadcn/ui 约束进入自动化验证链路，以便每次 check 都能阻止新增明显违背 shadcn 规则的 UI 写法。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 自动运行 shadcn/ui 本地约束检查。"
  - "检查不依赖远程 shadcn CLI、网络或新增 npm 依赖。"
  - "检查覆盖 `components.json` 基线、禁止 `space-x/space-y`、禁止项目代码硬编码 Tailwind 色阶、禁止项目代码任意半径。"
  - "历史已存在违例进入 baseline，新增违例会失败。"
  - "脚本自身有 Node test 覆盖通过、失败和 baseline 场景。"
  - "不修改产品 UI，不修改 package/lockfile，不做后端、schema/migration、审批、导出、批量、权限、生产公式、结算或收费因子。"
dependencies:
  - "US669"
status: "done"
```

### US671 - 复核结论预览只读 drilldown

```yaml
id: US671
requirement_ids:
  - R751
module: "导入中心"
role: "主管"
story: "作为主管，我希望批次详情页能把当前下游复核案例汇总成只读结论预览，以便先判断建议结论、证据和残余风险，再决定是否进入后续受控处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示复核结论预览。"
  - "预览根据未关闭复核案例、对比结果、质量问题和读取错误生成建议结论。"
  - "预览展示关键证据、残余风险和下一步，不提供提交、关闭、审批、导出或批量操作。"
  - "无复核案例、结果读取失败或批次未进入下游闭环时展示清晰只读空态。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US670"
status: "done"
```

### US672 - 复核证据缺口只读 drilldown

```yaml
id: US672
requirement_ids:
  - R752
module: "导入中心"
role: "主管"
story: "作为主管，我希望批次详情页能把复核案例的证据缺口按风险、owner 和质量问题展示出来，以便先补齐关键证据再进入后续受控处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示复核证据缺口 drilldown。"
  - "缺口根据未关闭复核案例、质量问题、对比结果和读取错误生成风险等级、缺口项、owner 提示和下一步。"
  - "页面展示缺口摘要、关键缺口列表和只读证据提示，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "无复核案例、无缺口或结果读取失败时展示清晰只读空态。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US671"
status: "done"
```

### US673 - 复核案例工作台二级页

```yaml
id: US673
requirement_ids:
  - R753
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例从批次详情页拆成独立二级工作台，以便按 owner、状态、严重度和来源筛选处理，而不是在一个超长详情页里查找。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增 `/data-quality/review-cases` 二级页面，展示复核案例工作台。"
  - "工作台支持业务日、owner、状态、严重度和来源筛选，并展示分组摘要。"
  - "批次详情页的复核证据缺口和结论预览入口跳转到复核案例工作台，而不是继续留在详情页内展开所有处理视图。"
  - "页面只读展示案例、证据缺口、质量线索和下一步，不提供提交、补证据、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US672"
status: "done"
```

### US674 - 质量问题到复核案例聚焦

```yaml
id: US674
requirement_ids:
  - R754
module: "导入中心"
role: "主管"
story: "作为主管，我希望从批次详情里的质量问题直接跳转并聚焦到复核案例工作台，以便快速查看哪些未关闭复核案例可能受该质量问题影响。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的质量影响聚合每个问题组提供查看相关复核案例入口。"
  - "入口跳转到 `/data-quality/review-cases`，并带入业务日、未关闭状态、来源类型和关键词焦点。"
  - "`/data-quality/review-cases` 展示当前焦点条件，让主管知道是从哪个质量问题进入。"
  - "页面只读展示，不提供提交、补证据、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US673"
status: "done"
```

### US675 - 复核案例详情页

```yaml
id: US675
requirement_ids:
  - R755
module: "导入中心"
role: "主管"
story: "作为主管，我希望从复核案例工作台进入单个复核案例详情页，以便只读查看来源结果、质量问题、证据缺口和下一步建议，而不是在列表页里塞满所有处理信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增 `/data-quality/review-cases/[caseId]` 二级详情页，展示单个复核案例详情。"
  - "复核案例工作台列表提供进入详情页的只读入口。"
  - "详情页展示案例摘要、来源结果线索、质量问题焦点、证据缺口和建议下一步。"
  - "页面只读展示，不提供提交、补证据、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US674"
status: "done"
```

### US676 - 复核案例详情正常态数据准备

```yaml
id: US676
requirement_ids:
  - R756
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页能通过本地准备数据展示真实正常态，以便验收从复核列表到单案详情的 DB008 读取链路，而不是只能看到 404 错误态。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地复核案例 smoke 数据准备 helper，可在空本地 sqlite 库中生成 `CASE-QUERY-001`。"
  - "生成的数据复用现有 DB007/DB008 repository、模型和 schema，不新增 migration/schema。"
  - "重复执行数据准备时返回已存在案例，不重复写入证据、结论或关闭记录。"
  - "准备后的 `/api/v1/review-cases/CASE-QUERY-001` 和 `/data-quality/review-cases/CASE-QUERY-001` 能展示正常详情态。"
  - "不新增依赖，不修改 package/lockfile，不接真实外部接口，不做权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US675"
status: "done"
```

### US677 - 复核案例来源结果上下文

```yaml
id: US677
requirement_ids:
  - R757
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页能展示来源对比结果的业务上下文，以便判断案例来自哪个业务日、时段、职场、项目、技能和差异，而不是只看到一个结果编号。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`/api/v1/review-cases/{case_id}` 返回只读 `source_result` 上下文，覆盖 forecast_schedule 和 schedule_actual 来源类型。"
  - "`/data-quality/review-cases/[caseId]` 在独立区块展示来源结果明细，包括业务日、时段、维度和关键差异指标。"
  - "页面保持只读，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US676"
status: "done"
```

### US678 - 复核案例来源链路反查

```yaml
id: US678
requirement_ids:
  - R758
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页继续反查来源计算运行、版本和导入批次，以便判断异常链路来自哪次计算、哪些版本和哪个导入来源。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`/api/v1/review-cases/{case_id}` 返回只读来源链路上下文，包含计算运行、版本和可关联导入批次。"
  - "`/data-quality/review-cases/[caseId]` 独立展示来源链路，不把内容塞回列表页或单页长卷。"
  - "页面保持只读，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US677"
status: "done"
```

### US679 - 复核案例来源运行详情入口

```yaml
id: US679
requirement_ids:
  - R759
module: "导入中心"
role: "主管"
story: "作为主管，我希望从复核案例详情页跳转到来源对比运行详情页，以便继续查看该运行的结果列表，而不是打开 API JSON。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 的来源链路区块提供前端运行详情入口。"
  - "新增 `/data-quality/comparison-runs/[runId]` 二级详情页，只读展示运行摘要和结果列表。"
  - "批次详情里的对比运行详情入口优先跳前端详情页，而不是 API JSON。"
  - "页面保持只读，不提供计算触发、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US678"
status: "done"
```

### US680 - 对比运行关联复核案例定位

```yaml
id: US680
requirement_ids:
  - R760
module: "导入中心"
role: "主管"
story: "作为主管，我希望在对比运行详情页看到该运行结果关联的复核案例，以便从计算结果继续定位到具体复核异常和证据页。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/comparison-runs/[runId]` 展示关联复核案例区块。"
  - "关联复核案例按当前运行结果的 `source_result_type + source_result_id` 匹配。"
  - "有匹配案例时提供 `/data-quality/review-cases/[caseId]` 前端详情入口。"
  - "无匹配案例或读取失败时展示只读空态/错误态，不触发写入。"
  - "页面保持只读，不提供计算触发、证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US679"
status: "done"
```

### US681 - 复核案例证据结论链路

```yaml
id: US681
requirement_ids:
  - R761
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页把证据、结论和关闭状态整理成只读链路，以便先判断处理材料是否齐全，而不是只看分散表格。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示 `证据与结论链路` 区块。"
  - "链路区块汇总证据数、结论数、关闭状态和下一步只读建议。"
  - "有证据、结论或关闭记录时展示按时间排序的链路条目。"
  - "无记录或读取失败时展示只读空态/错误态，不触发写入。"
  - "页面保持只读，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US680"
status: "done"
```

### US685 - 复核案例处理时间线

```yaml
id: US685
requirement_ids:
  - R765
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页把证据补录、结论补充和关闭记录整理成处理时间线，以便按处理顺序判断当前案例走到哪一步、下一步该做什么。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示独立的处理时间线区块。"
  - "时间线按处理顺序聚合 evidence、conclusion 和 closure，并展示阶段、责任人、时间和处理说明。"
  - "时间线给出当前阶段和下一步建议；读取失败或无记录时展示只读空态/错误态。"
  - "页面保持只读，不新增证据补录、结论补充、关闭、审批、导出、权限、批量或外部接口能力。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不做生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US684"
status: "done"
```

### US686 - 复核案例处理阶段筛选

```yaml
id: US686
requirement_ids:
  - R766
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例列表按处理阶段筛选缺证据、缺结论、可关闭和已关闭案例，以便不用逐个打开详情页就能安排处理顺序。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases` 支持处理阶段筛选：缺证据、缺结论、可关闭、已关闭。"
  - "处理阶段基于现有复核详情 API 的 evidence、conclusions 和 closure 计数派生，不新增后端 API 或 schema。"
  - "列表页展示每个案例的处理阶段和阶段分组统计。"
  - "读取详情失败时保留案例行，并展示阶段未知，不误判为可关闭。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不做写入动作、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US685"
status: "done"
```

### US687 - 复核 Owner 阶段负载矩阵

```yaml
id: US687
requirement_ids:
  - R767
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例工作台按 owner 和处理阶段看到负载矩阵，以便快速判断谁手上还有缺证据、缺结论、可关闭或已关闭案例。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases` 展示 owner × 处理阶段负载矩阵。"
  - "矩阵列包含缺证据、缺结论、可关闭、已关闭和阶段未知。"
  - "每个非零单元格跳转到对应 `ownerId + processingStage` 的列表过滤结果。"
  - "矩阵基于现有复核案例列表和详情阶段快照派生，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US686"
status: "done"
```

### US688 - 复核详情同 Owner 处理上下文

```yaml
id: US688
requirement_ids:
  - R768
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页看到同 owner 的其他待处理案例，以便从当前案例继续安排同责任人的缺证据、缺结论和可关闭工作。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示同 owner 处理上下文区块。"
  - "区块列出同 owner 的其他案例，展示处理阶段、证据/结论状态、严重度和详情入口。"
  - "区块提供回到同 owner 列表过滤的入口。"
  - "上下文基于现有 review-case list API 和 detail 阶段快照派生，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US687"
status: "done"
```

### US689 - 复核详情同 Owner 待处理导航

```yaml
id: US689
requirement_ids:
  - R769
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页直接跳转同 owner 的上一条或下一条待处理案例，以便不用回到列表也能连续处理同责任人的复核工作。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 的同 Owner 上下文内展示待处理导航。"
  - "导航展示当前案例在同 owner 同业务日待处理序列中的位置，并提供上一条/下一条入口。"
  - "当前案例已关闭或不在待处理序列时，引导进入首条同 owner 待处理案例。"
  - "导航基于现有 review-case list API 和 detail 阶段快照派生，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US688"
status: "done"
```

### US690 - 复核工作台同 Owner 首条待处理入口

```yaml
id: US690
requirement_ids:
  - R770
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例工作台按 owner 看到首条待处理入口，以便从列表页直接进入某个责任人的连续处理链路。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases` 展示同 owner 首条待处理入口。"
  - "入口按 owner 聚合当前筛选结果，展示待处理数量、首条待处理阶段和详情链接。"
  - "入口复用现有 review-case list 数据和 detail 阶段快照，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US689"
status: "done"
```

### US691 - 复核详情处理动作区整合

```yaml
id: US691
requirement_ids:
  - R771
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页先看到统一的处理动作区，以便不用在长页面里寻找补证据、补结论和关闭入口，就能按当前阶段完成下一步。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示统一的处理动作区。"
  - "动作区展示当前推荐动作、证据/结论/关闭材料状态和下一步说明。"
  - "补证据、补结论和关闭入口复用现有本地 API，不新增后端 route 或 schema。"
  - "关闭案例后动作区展示已关闭状态，不再显示可提交按钮。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US690"
status: "done"
```

### US692 - 复核动作提交反馈统一化

```yaml
id: US692
requirement_ids:
  - R772
module: "导入中心"
role: "主管"
story: "作为主管，我希望提交补证据、补结论或关闭案例后，在处理动作区直接看到提交结果和下一步建议，以便不用从 URL 参数或页面变化里猜测是否写入成功。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 读取 `evidence`、`conclusion`、`closure` 提交结果参数。"
  - "处理动作区顶部展示成功或失败反馈，包含动作名称、结果状态和下一步建议。"
  - "无提交结果参数时不展示反馈条，不影响原有动作区。"
  - "反馈只解析现有页面参数和现有写入结果，不新增后端 route、schema 或持久化。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US691"
status: "done"
```

### US693 - 复核提交后的续办导航

```yaml
id: US693
requirement_ids:
  - R773
module: "导入中心"
role: "主管"
story: "作为主管，我希望提交复核动作后直接看到下一条同 owner 待处理案例和返回列表入口，以便连续处理复核工作而不是重新查找。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在提交反馈出现时展示续办导航。"
  - "续办导航优先展示同 owner 下一条待处理案例；当前案例已关闭或不在序列中时展示首条待处理案例。"
  - "续办导航始终提供返回同 owner 复核列表的入口。"
  - "续办导航复用现有 review-case list 数据和 detail 阶段快照，不新增后端 API 或 schema。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US692"
status: "done"
```

### US694 - 复核提交失败后的重试定位

```yaml
id: US694
requirement_ids:
  - R774
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核动作提交失败后页面直接定位到对应处理入口，以便马上重试补证据、补结论或关闭案例。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在 `evidence=failed`、`conclusion=failed` 或 `closure=failed` 时展示重试定位提示。"
  - "失败反馈出现时，处理动作区默认打开对应动作 tab。"
  - "成功反馈或无反馈时不展示重试定位提示，仍按原推荐动作打开 tab。"
  - "重试定位只解析现有页面参数和现有动作区状态，不新增后端 API、schema 或持久化。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US693"
status: "done"
```

### US695 - 复核提交成功后的当前案例优先续办

```yaml
id: US695
requirement_ids:
  - R775
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核动作提交成功后，如果当前案例仍缺下一步材料，续办入口先让我继续当前案例，以便避免补完证据后误跳到其他案例。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在成功反馈出现时判断当前案例是否仍在待处理序列。"
  - "当前案例仍待处理时，续办主入口展示继续处理当前案例，并指向当前详情页。"
  - "当前案例已关闭或不在待处理序列时，续办主入口仍指向同 owner 下一条或首条待处理案例。"
  - "失败反馈仍交给重试定位，不改变 IM074 行为。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US694"
status: "done"
```

### US696 - 复核关闭成功后的队列交接提示

```yaml
id: US696
requirement_ids:
  - R776
module: "导入中心"
role: "主管"
story: "作为主管，我希望关闭案例成功后，续办导航明确告诉我当前案例已关闭，并直接引导处理下一条待处理案例，以便连续复核时不会误以为当前案例还需要动作。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在 `closure=success` 且当前案例不再待处理时展示关闭后的队列交接语义。"
  - "存在同 owner 下一条待处理时，续办主入口展示关闭后处理下一条，并指向下一条详情页。"
  - "非关闭成功反馈不受影响；失败反馈仍交给重试定位，当前案例仍待处理时仍优先当前案例。"
  - "复用现有 review-case list 数据和阶段快照，不新增后端 API、schema/migration 或页面路由。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US695"
status: "done"
```

### US697 - 复核续办返回列表保留未关闭焦点

```yaml
id: US697
requirement_ids:
  - R777
module: "导入中心"
role: "主管"
story: "作为主管，我希望从复核详情续办导航返回同 Owner 列表时仍停留在未关闭案例队列，以便连续处理时不被已关闭案例打断。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "同 Owner 待处理导航的列表入口包含 `status=open`。"
  - "提交成功、关闭成功和失败反馈下的续办导航返回同 Owner 列表入口均复用带 `status=open` 的列表链接。"
  - "下一条详情入口不受影响，仍指向具体复核案例详情页。"
  - "复用现有 review-case list filter，不新增后端 API、schema/migration 或页面路由。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US696"
status: "done"
```

### US698 - 字段映射模板维护详情页

```yaml
id: US698
requirement_ids:
  - R778
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在独立二级页面维护字段映射模板，以便修正模板名称或字段映射并停用不再使用的模板。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/field-mapping-templates/[templateId]` 展示模板详情、启用状态、文件类型、字段映射明细和返回入口。"
  - "模板详情页提供更新模板名称和字段映射 JSON 的表单，提交后调用现有 PATCH 模板 API。"
  - "启用模板可在详情页停用，提交后调用现有 deactivate API；停用模板不展示重复停用入口。"
  - "模板卡片提供进入详情页的入口，不再把维护动作堆在批次详情页。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US697"
status: "done"
```

### US699 - 字段映射模板新增页

```yaml
id: US699
requirement_ids:
  - R779
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在独立页面新增字段映射模板，以便把常用 CSV 表头映射保存为后续上传可复用的模板。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/field-mapping-templates/new` 展示新增模板表单，包含模板 ID、名称、文件类型、创建人和字段映射 JSON。"
  - "提交新增模板后调用现有 create template API，成功后进入对应模板详情页并展示创建成功反馈。"
  - "字段映射模板管理区提供进入新增模板页的入口。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US698"
status: "done"
```

### US713 - 版本工作台本地比对候选入口

```yaml
id: US713
requirement_ids:
  - R793
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在业务版本工作台看到当前版本能发起哪类本地比对，以便不用跳转多次也能判断下一步计算入口。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/versions` 在可定位来源版本的行展示本地比对候选入口。"
  - "候选入口明确对比口径、来源版本组合、业务日和触发前下一步。"
  - "来源版本不足、业务域不支持或未应用版本时展示清晰阻塞态，不渲染误导性提交按钮。"
  - "候选入口复用已有批次结果追踪/版本语境，不新增后端 API、schema/migration 或依赖。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US712"
status: "done"
notes: "IM093 已完成：/data-quality/versions 新增本地比对候选列，ready 候选链接回现有结果追踪语境，缺来源版本、未应用或不支持业务域保持阻塞态且不渲染提交按钮。"
```

### US714 - 版本工作台单次本地比对提交

```yaml
id: US714
requirement_ids:
  - R794
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在业务版本工作台对满足条件的单个版本发起一次本地比对，以便把版本检查和计算触发放在同一个工作流里。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/versions` 只在来源版本组合完整时提供单次本地比对提交入口。"
  - "提交入口复用现有本地 comparison calculate 能力，不新增后端 route 或 schema。"
  - "重复提交或后端返回 existing run 时保持幂等反馈，不暗示创建了多个运行。"
  - "不支持的业务域、缺来源版本或未应用版本不展示提交按钮。"
  - "不新增依赖，不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US713"
status: "done"
notes: "IM094 已完成：/data-quality/versions 对来源版本组合完整的行提供受控单次本地比对提交表单，复用现有 comparison calculate 能力；成功或失败回到版本工作台显示幂等反馈，未应用、缺来源版本或不支持业务域不展示提交按钮。"
```

### US715 - 版本工作台计算后结果回看

```yaml
id: US715
requirement_ids:
  - R795
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在版本工作台发起本地比对后直接看到运行回看入口，以便确认结果并进入 comparison run detail 继续检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本工作台在本地比对提交成功或复用已有运行后展示结果回看卡片。"
  - "回看卡片展示运行 ID、对比口径、结果规模、关键差异和进入 comparison run detail / 结果列表的入口。"
  - "运行暂未回显时展示明确阻塞态，不伪造完整结果。"
  - "复用现有 comparison run detail、结果列表和版本工作台，不新增后端 API、schema/migration 或依赖。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US714"
status: "done"
notes: "IM095 已完成：版本工作台在本地比对提交成功后展示结果回看卡片；运行已回显时展示对比口径、结果数、关键差异和业务日，运行暂未回显时展示阻塞态且不伪造结果。"
```

### US716 - 主数据维护工作台只读入口

```yaml
id: US716
requirement_ids:
  - R796
module: "主数据维护"
role: "运营管理员"
story: "作为运营管理员，我希望有一个主数据维护工作台入口，按坐席、职场、供应商、项目、技能和绑定关系查看当前维护范围，以便先确认主数据对象和维护边界。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "主数据维护入口在现有导航体系内可达，不创建新的首页或营销页。"
  - "工作台按坐席、职场、供应商、项目、技能和绑定关系分组展示只读维护范围。"
  - "页面明确当前只读边界、来源批次/版本口径和后续维护动作入口状态。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US715"
status: "done"
```

### US717 - 主数据实体详情与引用影响

```yaml
id: US717
requirement_ids:
  - R797
module: "主数据维护"
role: "运营管理员"
story: "作为运营管理员，我希望查看单个主数据实体或绑定关系的详情、有效期、冻结状态、来源批次和引用影响，以便维护前知道可能影响哪些业务数据。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从主数据维护工作台可进入实体或绑定关系详情。"
  - "详情页展示有效期、冻结状态、来源批次/版本和引用影响摘要。"
  - "缺少引用数据时展示明确空态或阻塞态，不伪造影响。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US716"
status: "done"
```

### US718 - 主数据受控维护动作

```yaml
id: US718
requirement_ids:
  - R798
module: "主数据维护"
role: "运营管理员"
story: "作为运营管理员，我希望在引用校验清楚后执行受控的主数据新增、编辑、冻结或有效期调整，以便维护基础对象时不会破坏已引用业务数据。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "维护动作必须先展示引用校验结果和失败反馈边界。"
  - "新增、编辑、冻结或有效期调整的范围需按实体类型拆分，不混成批量能力。"
  - "写入动作进入前需要单独确认，不默认扩展到后端/schema/migration。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US717"
status: "done"
```

### US719 - 人员排班生产工作台只读入口

```yaml
id: US719
requirement_ids:
  - R799
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望在计划与排班下查看人员级排班生产工作台，按排班版本、来源批次、应用状态和 0.5h 展开状态确认当前排班数据是否可用于后续履约比对。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "入口在现有计划与排班功能下可达，不创建新的首页或营销页。"
  - "工作台展示人员排班来源批次、业务版本、应用状态、0.5h 展开状态和阻塞原因。"
  - "页面明确当前只读边界和后续版本详情、发布/冻结动作状态。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US718"
status: "done"
notes: "IM099 已完成：`/schedule-plans/production` 在现有计划与排班导航下展示人员排班生产只读工作台，包含来源批次、业务版本、应用状态、0.5h 展开状态、阻塞原因和后续版本详情/发布冻结边界。"
```

### US720 - 人员排班版本详情与 0.5h 展开结果

```yaml
id: US720
requirement_ids:
  - R800
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望进入单个人员排班版本详情，查看班次引用、人员维度和 0.5h 展开结果，以便确认这个版本是否能进入比对和复核链路。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从人员排班生产工作台可进入排班版本详情。"
  - "详情页展示来源批次/版本、业务日范围、班次引用、人员范围和 0.5h 展开状态。"
  - "缺少展开结果时展示明确空态或阻塞态，不伪造人员级明细。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US719"
status: "done"
notes: "IM100 已完成：从 `/schedule-plans/production` 工作台进入 `/schedule-plans/production/[batchId]` 详情页，展示来源批次/版本、业务日、班次引用口径、人员范围不伪造说明和 0.5h 展开状态。"
```

### US721 - 人员排班发布冻结边界安全壳

```yaml
id: US721
requirement_ids:
  - R801
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望在发布或冻结排班版本前先看到校验条件、失败原因和当前未接入真实写入的边界，以便不误操作生产排班口径。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "发布、冻结或取消发布动作必须先展示来源版本、展开结果和引用校验边界。"
  - "动作按钮保持安全壳状态，不提交真实生产状态变化。"
  - "写入动作进入前需要单独确认，不默认扩展到后端/schema/migration。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US720"
status: "done"
notes: "IM101 已完成：排班版本详情页新增发布、冻结、取消发布三类生产动作边界安全壳，展示来源版本、展开校验、引用校验和失败边界，动作按钮保持禁用。"
```

### US722 - 需求预测生产工作台只读入口

```yaml
id: US722
requirement_ids:
  - R802
module: "需求预测生产"
role: "计划主管"
story: "作为计划主管，我希望在计划与排班下查看需求预测生产工作台，按预测版本、来源批次、应用状态和技能组/等级/时段对齐状态确认当前预测数据是否可用于后续排班和比对。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "入口在现有计划与排班功能下可达，不创建新的首页或营销页。"
  - "工作台展示需求预测来源批次、预测业务版本、应用状态、技能组/等级/时段对齐状态和阻塞原因。"
  - "页面明确当前只读边界和后续版本详情、变更追踪入口状态。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US721"
status: "done"
notes: "IM102 已完成：`/demand-plans/production` 在现有计划与排班导航下展示需求预测生产只读工作台，包含来源批次、预测版本、应用状态、技能组/等级/时段对齐状态、阻塞原因和后续 IM103/IM104 边界。"
```

### US723 - 需求预测版本详情与对齐结果

```yaml
id: US723
requirement_ids:
  - R803
module: "需求预测生产"
role: "计划主管"
story: "作为计划主管，我希望进入单个需求预测版本详情，查看业务日范围、技能组、等级、时段粒度和对齐结果，以便确认这个预测版本能否进入排班和履约比对链路。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从需求预测生产工作台可进入预测版本详情。"
  - "详情页展示来源批次/版本、业务日范围、技能组、等级、时段粒度和对齐状态。"
  - "缺少预测明细或对齐结果时展示明确空态或阻塞态，不伪造技能组/等级/时段明细。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US722"
status: "done"
notes: "IM103 已完成：从预测生产工作台进入 `/demand-plans/production/[batchId]` 详情页，展示来源批次/版本、业务日、技能组/等级/时段对齐边界、预测明细不伪造说明和阻塞状态。"
```

### US724 - 需求预测变更追踪边界安全壳

```yaml
id: US724
requirement_ids:
  - R804
module: "需求预测生产"
role: "计划主管"
story: "作为计划主管，我希望在追踪或调整需求预测前先看到来源、对齐和下游影响校验边界，以便不误操作预测生产口径。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "变更追踪入口必须先展示来源版本、技能组/等级/时段对齐和下游影响校验边界。"
  - "动作按钮保持安全壳状态，不提交真实预测变更或生产状态变化。"
  - "写入动作进入前需要单独确认，不默认扩展到后端/schema/migration。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US723"
status: "done"
notes: "IM104 已完成：`/demand-plans/production/[batchId]` 展示变更追踪边界安全壳，先呈现来源版本、技能组/等级/0.5h 时段、下游影响和失败边界校验，动作按钮全部禁用。"
```

### US725 - 登录/状态日志生产工作台只读入口

```yaml
id: US725
requirement_ids:
  - R805
module: "登录/状态日志生产"
role: "数据管理员"
story: "作为数据管理员，我希望在数据与集成下查看登录/状态日志生产工作台，以便确认来源批次、业务版本、业务日、时区和跨天处理边界。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "入口放在现有数据与集成功能下，不创建新的首页或营销页。"
  - "工作台展示登录/状态日志来源批次、业务版本、应用状态、业务日范围、时区和跨天处理边界。"
  - "页面明确当前只读，不改状态字典、不重算实际工时、不触发排班 vs 实际比对。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US724"
status: "done"
notes: "IM105 已完成：`/actual-logs/production` 在数据与集成下展示只读登录/状态日志生产工作台，包含来源批次、业务版本、应用状态、业务日、时区和跨天处理边界。"
```

### US726 - 登录/状态日志处理解释详情

```yaml
id: US726
requirement_ids:
  - R806
module: "登录/状态日志生产"
role: "数据管理员"
story: "作为数据管理员，我希望进入单个登录或状态日志批次的处理解释页，以便看清跨天、业务日、时区和状态区间处理口径。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从日志生产工作台可进入单批次处理解释页。"
  - "详情页展示跨天切分、业务日归属、Asia/Shanghai 时区校验和状态区间边界。"
  - "缺少明细时展示明确空态，不伪造登录事件或状态区间。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US725"
status: "done"
notes: "IM106 已完成：从 `/actual-logs/production` 可进入 `/actual-logs/production/[batchId]`，详情页解释业务日、时区、跨天切分、状态字典、状态区间和登录事件；缺少明细时保持明确空态。"
```

### US727 - 状态字典与异常解释安全壳

```yaml
id: US727
requirement_ids:
  - R807
module: "登录/状态日志生产"
role: "数据管理员"
story: "作为数据管理员，我希望先看到状态字典和日志异常解释边界，以便不误以为当前页面会直接改变生产状态规则。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "解释区展示状态字典、未知状态、时区错误、跨天异常和冻结员工引用边界。"
  - "动作按钮保持禁用安全壳，不提交状态字典变更或生产规则变更。"
  - "写入动作进入前需要单独确认，不默认扩展到后端/schema/migration。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US726"
status: "done"
notes: "IM107 已完成：`/actual-logs/production/[batchId]` 展示状态字典与异常解释安全壳，覆盖状态字典、未知状态、时区错误、跨天异常和冻结员工引用边界，动作按钮保持禁用。"
```

### US728 - 主数据坐席单实体维护 API 基础

```yaml
id: US728
requirement_ids:
  - R808
module: "主数据维护"
role: "数据管理员"
story: "作为数据管理员，我希望先通过后端 API 维护单个坐席的新增、编辑、冻结和有效期，以便后续前端表单能从安全壳升级到真实受控写入。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "提供坐席单实体 create/edit/freeze/effective_period 后端入口。"
  - "复用现有 master_data_employees 表和仓库，不新增 schema/migration。"
  - "返回成功后的坐席记录和明确失败错误码。"
  - "不扩展到职场、供应商、项目、技能或绑定关系。"
  - "不做权限、审批、导出、批量、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US718"
status: "done"
notes: "IM108 已完成：新增 `/api/v1/master-data/employees/{employee_id}/maintenance`，支持坐席 create/edit/freeze/effective_period；复用现有表和仓库，无 schema/migration。"
```

### US729 - 主数据坐席维护前端受控提交

```yaml
id: US729
requirement_ids:
  - R809
module: "主数据维护"
role: "数据管理员"
story: "作为数据管理员，我希望在坐席详情页提交单个坐席的维护动作并看到成功或失败反馈，以便确认维护是否真正进入本地主数据。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/master-data/agents` 详情页提供坐席新增、编辑、冻结、有效期调整的受控表单。"
  - "提交后展示成功记录或后端校验失败原因。"
  - "只接坐席 API，不扩展其他主数据对象。"
  - "不做权限、审批、导出、批量、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US728"
status: "done"
notes: "IM109 已完成：`/master-data/agents` 详情页提供坐席新增、编辑、冻结、有效期调整四个受控提交表单；提交走 server action 调 IM108 API，结果通过页面反馈展示。"
```

### US730 - 主数据维护扩展到其他对象与绑定关系

```yaml
id: US730
requirement_ids:
  - R810
module: "主数据维护"
role: "数据管理员"
story: "作为数据管理员，我希望在坐席维护闭环稳定后，把同一维护口径扩展到职场、供应商、项目、技能和绑定关系，以便主数据维护能力覆盖生产所需对象。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "职场、供应商、项目、技能复用单实体维护口径。"
  - "绑定关系维护展示并校验坐席、职场、供应商、项目、技能引用。"
  - "复用 IM108/IM109 的错误码和前端反馈口径。"
  - "不做权限、审批、导出、批量、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US729"
status: "done"
notes: "IM110 已完成：职场、供应商、项目、技能复用单实体维护口径；绑定关系维护展示并校验坐席、供应商、职场、项目和技能引用；前端复用受控提交和成功/失败反馈口径。"
```

### US731 - 人员排班版本详情只读 API

```yaml
id: US731
requirement_ids:
  - R811
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望人员排班生产详情能读取真实排班版本、班次引用和 0.5h 展开明细，以便后续页面能展示版本内到底生成了哪些排班区间。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "后端提供按 batch_id 查询人员排班生产版本详情的只读 API。"
  - "响应包含来源批次、schedule_version_id、业务日期范围、排班明细和 0.5h 展开区间。"
  - "明细保留员工、职场、项目、技能、班次类型引用字段，便于后续前端解释引用校验。"
  - "不做发布、冻结、取消发布、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US721"
status: "done"
notes: "IM111 已完成：后端提供按 batch_id 查询人员排班生产版本详情的只读 API，返回来源批次、版本、排班明细和 0.5h 展开区间；前端接入和生产状态变化仍未进入。"
```

### US732 - 人员排班生产详情前端接入真实 API

```yaml
id: US732
requirement_ids:
  - R812
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望排班生产详情页直接展示已应用版本中的排班明细和 0.5h 展开区间，以便确认批次应用后实际生成了哪些人员级排班结果。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/schedule-plans/production/[batchId]` 调用 IM111 只读 API。"
  - "页面展示真实 schedule_version_id、排班明细数量和 0.5h 展开区间数量。"
  - "页面展示至少一组排班明细/展开区间只读表格或列表。"
  - "未应用、缺 API 或找不到版本时保留明确阻塞/空态，不伪造明细。"
  - "不做发布、冻结、取消发布、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US731"
status: "done"
notes: "IM112 已完成：详情页接入 IM111 API，展示真实排班明细数量、0.5h 展开区间数量和只读明细表；未取到 API 明细时继续保持不伪造明细空态。"
```

### US733 - 人员排班详情行级引用解释

```yaml
id: US733
requirement_ids:
  - R813
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望在排班版本详情的每一行看到引用是否完整以及缺少哪些字段，以便判断该版本能否继续用于比对、复核或后续发布边界检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "排班明细行展示坐席、职场、供应商、项目、技能、班次引用完整性。"
  - "0.5h 展开区间行展示坐席、职场、供应商、项目、技能引用完整性。"
  - "缺少引用字段时显示行级阻塞说明，不伪造引用校验结果。"
  - "不做发布、冻结、取消发布、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US732"
status: "done"
notes: "IM113 已完成：详情页真实明细表新增引用状态和阻塞说明列，完整行显示无阻塞，缺字段行显示具体缺少哪些引用。"
```

### US734 - 需求预测版本详情只读 API

```yaml
id: US734
requirement_ids:
  - R814
module: "需求预测生产"
role: "计划主管"
story: "作为计划主管，我希望需求预测生产详情能读取真实预测版本、0.5h 预测区间和变更记录，以便后续页面能展示批次应用后生成了哪些预测结果。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "后端提供按 batch_id 查询需求预测生产版本详情的只读 API。"
  - "响应包含来源批次、forecast_version_id、业务日期范围、0.5h 预测区间和版本变更记录。"
  - "未应用或缺少预测版本时返回明确错误码，不伪造明细。"
  - "不做前端接入、schema/migration、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US724"
status: "done"
notes: "IM114 已完成：后端提供 `/api/v1/demand-forecast/production/{batch_id}` 只读 API，返回批次、预测版本、预测区间和变更记录；后续前端接入另拆。"
```

### US735 - 需求预测生产详情前端接入真实 API

```yaml
id: US735
requirement_ids:
  - R815
module: "需求预测生产"
role: "计划主管"
story: "作为计划主管，我希望预测生产详情页直接展示已应用版本中的 0.5h 预测区间和变更记录，以便确认批次应用后实际生成了哪些预测结果。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/demand-plans/production/[batchId]` 调用 IM114 只读 API。"
  - "页面展示真实 forecast_version_id、0.5h 预测区间数量和版本变更记录数量。"
  - "页面展示至少一组预测区间和变更记录只读表格或列表。"
  - "未应用、缺 API 或找不到版本时保留明确阻塞/空态，不伪造明细。"
  - "不做预测写入、schema/migration、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US734"
status: "done"
notes: "IM115 已完成：预测生产详情页读取 IM114 API，展示真实预测区间表和版本变更记录表；缺 API/未应用时保留明确空态。"
```

### US736 - 需求预测详情行级对齐和阻塞解释

```yaml
id: US736
requirement_ids:
  - R816
module: "需求预测生产"
role: "计划主管"
story: "作为计划主管，我希望在预测版本详情的每条 0.5h 预测区间上看到维度、等级、时段和需求值是否完整，以便判断该预测能否继续用于排班、比对或变更追踪边界检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "0.5h 预测区间行展示职场、项目、技能、等级、时段和需求值完整性。"
  - "缺少维度、等级、时段或需求值异常时显示行级阻塞说明。"
  - "完整行显示无阻塞，不伪造后端未返回的引用校验结果。"
  - "不做预测写入、schema/migration、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US735"
status: "done"
notes: "IM116 已完成：预测详情真实 0.5h 区间表新增对齐状态和阻塞说明列，行级解释职场、项目、技能、等级、时段和需求值完整性，后续计算触发另拆。"
```

### US737 - 生产详情进入本地比对入口

```yaml
id: US737
requirement_ids:
  - R817
module: "本地比对计算"
role: "计划主管"
story: "作为计划主管，我希望从排班或预测生产详情页直接进入已有业务版本工作台的同业务日比对入口，以便继续确认成对版本并发起受控本地比对。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "预测生产详情展示本地比对入口，按需求预测域、已应用状态和业务日跳转业务版本工作台。"
  - "排班生产详情展示本地比对入口，按人员排班域、已应用状态和业务日跳转业务版本工作台。"
  - "缺少版本或业务日时显示阻塞说明，并仍可查看对应域的业务版本工作台。"
  - "不新增后端、schema/migration、依赖、真实提交动作、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US736"
status: "done"
notes: "IM117 已完成：生产详情页只提供到既有业务版本工作台的过滤入口，不在详情页新增本地比对提交。"
```

### US738 - 业务版本工作台 applied 入口兼容

```yaml
id: US738
requirement_ids:
  - R818
module: "本地比对计算"
role: "计划主管"
story: "作为计划主管，我希望从生产详情带着已应用状态进入业务版本工作台时不会被筛为空，并能看到同业务日预测和排班版本组成的本地比对提交候选。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/versions?status=applied` 按已形成版本口径展示 ready 版本行。"
  - "同业务日已应用需求预测和人员排班版本在预测域下可形成 forecast_vs_schedule 提交请求。"
  - "缺少任一侧版本时保持阻塞说明，不伪造来源版本。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US737"
status: "done"
notes: "IM118 已完成：`status=applied` 入口兼容 ready 版本筛选，并覆盖同业务日预测+排班直接比对候选。"
```

### US739 - 登录日志版本结果链路一致性

```yaml
id: US739
requirement_ids:
  - R819
module: "本地比对计算"
role: "计划主管"
story: "作为计划主管，我希望登录日志应用后的业务版本也能像状态日志一样定位排班实际对比结果和复核入口，以便实际日志版本链路不会在应用后断掉。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "login_log 已应用批次的应用结果卡可匹配 actual_import_version_id 相同的 schedule_vs_actual 运行。"
  - "login_log 已应用批次的版本结果语境可进入对应对比运行详情。"
  - "login_log 和 status_log 的 actual_logs 中文展示保持一致，指向登录/状态日志。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US738"
status: "done"
notes: "IM119 已完成：登录日志版本纳入 actual_logs 直接结果链路，复用 schedule_vs_actual 运行匹配和复核案例入口。"
```

### US740 - 排班实际结果来源解释

```yaml
id: US740
requirement_ids:
  - R820
module: "本地比对计算"
role: "计划主管"
story: "作为计划主管，我希望在对比运行详情页直接看到排班实际结果使用了哪个排班版本、哪个实际日志版本以及如何计算迟到差异，以便复核结果时不用反复回跳推断来源。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "对比运行详情页展示来源解释，说明预测排班或排班实际口径使用的来源版本和业务日区间。"
  - "schedule_vs_actual 运行解释排班版本、实际日志版本、坐席排班分钟、有效生产分钟和迟到分钟。"
  - "缺少来源版本时显示来源不完整提示，不伪造版本。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US739"
status: "done"
notes: "IM120 已完成：对比运行详情页完整结果回看卡片新增来源解释和来源版本完整/缺失提示。"
```

### US741 - 对比运行详情工作区分层

```yaml
id: US741
requirement_ids:
  - R821
module: "本地比对计算"
role: "计划主管"
story: "作为计划主管，我希望对比运行详情按总览、来源链路、结果明细、复核案例和处理边界分区，而不是把所有内容堆成一个长页，以便我能按当前任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "对比运行详情页默认展示总览，只保留关键指标和完整结果回看语境。"
  - "来源链路、结果明细、复核案例和处理边界通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US740"
status: "done"
notes: "IM121 已完成：对比运行详情页从长页堆叠改为五个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US742 - 复核案例详情工作区分层

```yaml
id: US742
requirement_ids:
  - R822
module: "复核案例处理"
role: "计划主管"
story: "作为计划主管，我希望复核案例详情按总览、来源链路、证据结论、处理动作、Owner 导航和处理边界分区，而不是把所有处理内容堆成一个长页，以便我能按当前复核任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "复核案例详情页默认展示总览，只保留关键指标和证据缺口。"
  - "来源链路、证据结论、处理动作、Owner 导航和处理边界通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US741"
status: "done"
notes: "IM122 已完成：复核案例详情页从长页堆叠改为六个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US743 - 登录状态日志处理详情工作区分层

```yaml
id: US743
requirement_ids:
  - R823
module: "登录/状态日志生产"
role: "计划主管"
story: "作为计划主管，我希望登录/状态日志处理详情按总览、时区与业务日、字典与异常、逐行明细和处理边界分区，而不是把所有处理解释堆成一个长页，以便我能按当前核对任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "登录/状态日志处理详情页默认展示总览，只保留关键指标和来源概览。"
  - "时区与业务日、字典与异常、逐行明细和处理边界通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US742"
status: "done"
notes: "IM123 已完成：登录/状态日志处理详情页从长页堆叠改为五个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US744 - 人员排班生产详情工作区分层

```yaml
id: US744
requirement_ids:
  - R824
module: "人员排班生产"
role: "计划主管"
story: "作为计划主管，我希望人员排班生产详情按总览、来源与版本、真实明细、本地比对和发布冻结边界分区，而不是把所有生产详情堆成一个长页，以便我能按当前核对任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "人员排班生产详情页默认展示总览，只保留关键指标和版本定位语境。"
  - "来源与版本、真实明细、本地比对和发布冻结边界通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US743"
status: "done"
notes: "IM124 已完成：人员排班生产详情页从长页堆叠改为五个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US745 - 需求预测生产详情工作区分层

```yaml
id: US745
requirement_ids:
  - R825
module: "需求预测生产"
role: "计划主管"
story: "作为计划主管，我希望需求预测生产详情按总览、来源与对齐、预测明细、本地比对和变更边界分区，而不是把所有生产详情堆成一个长页，以便我能按当前核对任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "需求预测生产详情页默认展示总览，只保留关键指标和版本定位语境。"
  - "来源与对齐、预测明细、本地比对和变更边界通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US744"
status: "done"
notes: "IM125 已完成：需求预测生产详情页从长页堆叠改为五个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US746 - 主数据维护详情工作区分层

```yaml
id: US746
requirement_ids:
  - R826
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望主数据详情按总览、来源与引用、受控动作、提交表单和维护边界分区，而不是把所有维护信息堆成一个长页，以便我能按当前任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "主数据维护详情页默认展示总览，只保留关键指标和对象定位语境。"
  - "来源与引用、受控动作、提交表单和维护边界通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US745"
status: "done"
notes: "IM126 已完成：主数据维护详情页从长页堆叠改为五个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US747 - 导入批次明细二级工作区分层

```yaml
id: US747
requirement_ids:
  - R827
module: "导入中心"
role: "数据导入操作员"
story: "作为数据导入操作员，我希望导入批次明细内部按总览、处理摘要、异常追踪、版本记录和行结果分区，而不是把所有批次明细堆在一个面板里，以便我能按当前核对任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "批次明细面板默认展示总览，只保留成功、失败、警告、版本和批次定位语境。"
  - "处理摘要、异常追踪、版本记录和行结果通过明确二级 tab 入口进入。"
  - "二级 tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US746"
status: "done"
notes: "IM127 已完成：导入批次明细面板从单长面板改为五个二级 tab，默认总览，其余信息按入口查看。"
```

### US748 - 字段映射模板详情工作区分层

```yaml
id: US748
requirement_ids:
  - R828
module: "导入中心"
role: "数据导入操作员"
story: "作为数据导入操作员，我希望字段映射模板详情按总览、维护表单、字段明细和维护边界分区，而不是把所有模板详情堆在一个页面里，以便我能按当前维护任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "字段映射模板详情页默认展示总览，只保留模板状态、文件类型、字段数量和字段摘要。"
  - "维护表单、字段明细和维护边界通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US747"
status: "done"
notes: "IM128 已完成：字段映射模板详情页从长页堆叠改为四个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US749 - 字段映射模板管理面板工作区分层

```yaml
id: US749
requirement_ids:
  - R829
module: "导入中心"
role: "数据导入操作员"
story: "作为数据导入操作员，我希望字段映射模板管理面板按总览、模板适配和模板列表分区，而不是把库存指标、适配建议和模板卡片堆在一个长面板里，以便我能按当前任务快速进入对应信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "字段映射模板管理面板默认展示总览，只保留模板库存和字段覆盖指标。"
  - "模板适配和模板列表通过明确 tab 入口进入。"
  - "tab 入口来自模型摘要并有测试覆盖，避免后续继续无约束堆叠。"
  - "不新增后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US748"
status: "done"
notes: "IM129 已完成：字段映射模板管理面板从长 Card 改为三个 tab 工作区，默认总览，其余信息按入口查看。"
```

### US750 - 经营总览和导航收敛纠偏

```yaml
id: US750
requirement_ids:
  - R830
module: "产品结构"
role: "运营负责人"
story: "作为运营负责人，我希望经营总览只展示业务经营和履约结果，侧边栏只暴露真实可用或当前主线需要的入口，而不是看到数据接入状态、权限、结算、智能排班等未确认能力，以便我能按真实业务动作使用系统。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "经营总览不再展示或引用数据接入状态面板。"
  - "侧边栏移除纯占位、指向 dashboard 的伪入口，以及当前明确暂不做的权限、审批、导出、批量、智能排班、结算、接口集成等能力入口。"
  - "新增回归测试约束经营总览和侧边栏结构，防止后续重新暴露臆想入口。"
  - "不新增人员 CRUD、后端、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US749"
status: "done"
notes: "IM130 已完成：经营总览移除数据接入状态面板，侧边栏仅保留真实页面或当前主线入口，并用 product-structure 测试锁定。"
```

### US751 - 人员主数据组织和多技能模型底座

```yaml
id: US751
requirement_ids:
  - R831
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望人员主数据能表达自有/外包人员类型、CC/CCO/小组组织层级、职场归属和多个技能，并能区分在线、热线、工单技能组，以便后续人员列表和单人编辑能按真实组织和技能口径展示。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "数据库迁移 head 创建组织表、人员技能关系表，并在人员表和技能表补充必要字段。"
  - "主数据持久化支持组织层级路径、人员类型、人员组织/职场归属、技能类型和人员多技能。"
  - "master_data 导入应用支持 organization、employee_skill 记录，以及 employee_type、organization_id、workplace_id、skill_category 字段。"
  - "现有主数据导入、维护、readiness 和排班引用校验回归不破坏。"
  - "不新增前端大页面、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US750"
status: "done"
notes: "IM131 已完成：后端模型、迁移、导入解析和测试已支持人员组织层级、人员类型、技能类型和人员多技能。"
```

### US752 - 人员主数据真实列表展示

```yaml
id: US752
requirement_ids:
  - R832
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在坐席主数据页直接看到已应用到业务数据的真实人员列表，包括姓名、状态、人员类型、组织路径、职场和技能组类别，以便确认上传表格和应用结果是否正确进入人员维护口径。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "后端提供只读人员列表 API，返回员工基础字段、组织路径、职场名称和多技能列表。"
  - "/master-data/agents 总览展示人员总数、生效人员、自有员工、外包员工和真实人员表。"
  - "人员表展示姓名、状态、人员类型、组织/职场、技能组类别和有效期；无数据或 API 失败时显示明确空态/错误。"
  - "不新增批量维护、权限、审批、导出、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US751"
status: "done"
notes: "IM132 已完成：人员列表 API 和 /master-data/agents 总览真实人员表已接通。"
```

### US753 - 单个人员核心字段编辑

```yaml
id: US753
requirement_ids:
  - R833
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在单人坐席维护表单中编辑姓名、状态、人员类型、组织归属和职场归属，以便按真实人员档案修正单个员工，而不是只能改姓名和状态。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "编辑坐席表单展示并提交 employee_name、status、employee_type、organization_id、workplace_id。"
  - "新增坐席表单也可填写 employee_type、organization_id、workplace_id。"
  - "server action 和 payload builder 将这些字段传给现有单员工维护 API。"
  - "后端回归证明 edit 能更新人员类型、组织和职场。"
  - "不新增批量维护、权限、审批、导出、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US752"
status: "done"
notes: "IM133 已完成：单人员新增/编辑表单和 payload 已补齐人员类型、组织 ID、职场 ID。"
```

### US754 - 单个人员多技能维护

```yaml
id: US754
requirement_ids:
  - R834
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在单个坐席维护里覆盖该员工当前技能集合，以便把刘晓晓这类员工维护为集中退换工单、集中退换外呼、通用技能组等多个技能，而不是只能查看导入后的技能。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "后端提供单员工技能集合 replace 维护能力，复用既有员工、技能、有效期和来源批次校验。"
  - "API 返回替换后的技能列表，包含技能名称和技能组类别。"
  - "/master-data/agents 默认是客服人员管理列表，新建、编辑、技能维护进入子页面，冻结通过弹窗确认。"
  - "前端 payload builder 和 server action 调用新技能维护 API。"
  - "不新增批量维护、权限、审批、导出、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US753"
status: "done"
notes: "IM134 已完成：单人技能集合 replace 维护闭环已接入后端、server action；人员列表只承载入口，新建、编辑、技能维护拆为子页面，冻结拆为弹窗。"
```

### US755 - 人员管理列表 UI 细节纠偏

```yaml
id: US755
requirement_ids:
  - R835
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望人员管理列表的筛选下拉框、行内编辑/冻结/更多操作在尺寸和文字密度上保持一致，以便列表页看起来像正式 B 端管理页面，而不是临时拼装页面。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "人员筛选区下拉框与输入框保持一致高度、字号和宽度对齐。"
  - "下拉弹层宽度与触发器对齐，不出现窄弹层或错位。"
  - "表格行内编辑、冻结和更多操作使用一致的小尺寸操作样式。"
  - "列表页不再暴露内部未确认能力或“待拆分”文案。"
  - "不新增后端、数据库、权限、审批、导出、批量操作、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US754"
status: "done"
notes: "IM135 已完成：筛选下拉和表格行内操作尺寸已统一，并通过浏览器实际样式检查。"
```

### US761 - 职场详情页运营主体

```yaml
id: US761
requirement_ids:
  - R841
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望从职场列表进入单个职场详情，并在该详情页看到这个职场下的自有团队和供应商团队，以便理解上海职场这类地点当前由哪些运营主体承接，而不是在导航里看到脱离职场的抽象关系页。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/sites 的职场行提供详情入口，进入 /master-data/sites/[workplaceId]。"
  - "职场详情页展示职场基础信息、运营主体总数、自有团队数和供应商团队数。"
  - "运营主体只读展示在该职场详情内，来源限定为现有人员档案和人员归属记录。"
  - "不恢复独立职场运营主体或绑定关系导航/实体页。"
  - "不新增后端、数据库、权限、审批、导出、批量操作、自动排班、生产公式、结算、供应商合同、最低人力或收费因子。"
dependencies:
  - "US755"
status: "done"
notes: "IM141 已完成：职场列表详情入口和职场子详情页已接通，运营主体展示被收敛到职场详情内。"
```

### US762 - 供应商详情页服务职场

```yaml
id: US762
requirement_ids:
  - R842
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望从供应商列表进入单个供应商详情，并看到这个供应商当前服务的职场，以便理解供应商与上海职场、南京职场等地点的实际归属关系，而不是只停留在供应商列表编码。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/vendors 的供应商行提供详情入口，进入 /master-data/vendors/[vendorId]。"
  - "供应商详情页展示供应商基础信息、服务职场数和生效职场数。"
  - "服务职场只读展示在供应商详情内，并可跳转到对应职场详情。"
  - "不新增供应商合同、结算比例、最低人力、审批、导出、批量、权限、自动排班、生产公式或收费因子。"
dependencies:
  - "US761"
status: "done"
notes: "IM142 已完成：供应商列表详情入口和供应商子详情页已接通，服务职场展示被收敛到供应商详情内。"
```

### US763 - 客服人员批量导入大弹窗

```yaml
id: US763
requirement_ids:
  - R843
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在客服人员列表页通过大弹窗完成批量导入的上传、字段映射和导入结果摘要，以便从人员业务列表发起导入，并把完整批次详情、失败行修正和应用处理留在批次详情页。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/agents 右上角提供批量导入入口，点击后在当前页面打开大弹窗，而不是跳转独立上传工作区。"
  - "弹窗第一步提供人员导入模板下载和 CSV 上传字段。"
  - "弹窗第二步支持选择启用的主数据映射模板，也支持模板为空时手动填写字段映射 JSON。"
  - "弹窗第三步展示本次导入摘要、成功/失败行数，并提供查看批次详情和失败行修正入口。"
  - "完整批次详情、失败行修正、readiness、应用到业务数据和版本链路仍在批次详情页处理。"
  - "不新增后端、schema/migration、依赖、权限、审批、导出、批量应用、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US762"
status: "done"
notes: "IM143 已完成：客服人员列表内批量导入大弹窗已接入，上传结果回流当前弹窗；完整明细和修正仍由批次详情页承载。"
```

### US764 - 全局 UI 组件规范与客服人员导入弹窗纠偏

```yaml
id: US764
requirement_ids:
  - R844
module: "主数据维护 / 全局布局"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望侧边栏、面包屑、反馈提示和人员导入弹窗都遵循统一的 B 端组件规范，以便列表页、详情页、子页面和弹窗交互稳定一致，而不是混用手写外壳和一次性长表单。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "全局 AppShell 使用 shadcn SidebarProvider/SidebarInset，AppSidebar 使用 Collapsible、Sidebar/SidebarContent/SidebarGroup/SidebarMenu/SidebarMenuSub primitives，不再手写 aside。"
  - "保留现有菜单结构，不新增菜单；侧边栏默认全部展开，主数据详情页继承父级高亮。"
  - "SiteHeader 支持统一 breadcrumbItems，主数据列表、详情、新建、编辑页展示 Breadcrumb；弹窗不展示 Breadcrumb。"
  - "SiteHeader 使用单行导航结构，Breadcrumb 包含当前页，不再额外渲染第二行视觉 H1；H1 仅在需要时作为可访问性标题保留。"
  - "主数据列表、详情、新建、编辑、技能维护页由 SiteHeader 唯一承载 Breadcrumb、返回路径和页面 H1，内容区不得重复返回按钮、同名 H1 或页面级说明。"
  - "客服人员列表中，筛选卡片应位于列表操作栏上方，列表操作栏紧贴表格上方；新建/批量导入作为页面级动作进入 Header 右侧，列表操作栏只保留已选/批量动作，查询/重置位于筛选卡片右下。"
  - "SiteHeader 不保留无意义的全局搜索、固定月份和通知占位；Sidebar footer 使用 shadcn Avatar 显示本地参考头像，并提供本地用户菜单、明暗主题切换和登出入口，其中登出不接真实 auth。"
  - "客服人员导入弹窗使用 shadcn Dialog，并严格分为上传文件、字段映射、导入结果三步；切换 step 时文件 input 保持 DOM 挂载。"
  - "页面级反馈、表单提交结果、导入结果摘要和阻塞/告警说明使用 shadcn Alert。"
  - "不新增排班、预测、登录/状态日志导入弹窗，不修改 package/lockfile，不新增后端、schema/migration、依赖、权限、审批、导出、批量应用、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US763"
status: "done"
notes: "IM144 已完成：全局 Shell 与主数据页面 Breadcrumb 已统一，侧边栏按 shadcn Collapsible + SidebarMenuSub 结构实现，Sidebar footer 使用 shadcn Avatar 和本地参考头像 /shadcn-avatar.jpg，并增加本地用户菜单、明暗主题切换和登出入口；SiteHeader 改为单行导航，不再保留无意义搜索/日期/通知占位，并通过 actions 插槽承载页面级动作；Breadcrumb 包含当前页，主数据内容区不再重复全局标题/返回路径，客服人员列表按筛选卡片、列表操作栏、表格排序，新建/批量导入进入 Header 右侧，列表操作栏只保留已选/批量动作，客服人员导入改成 step-by-step Dialog，结果反馈改用 Alert。"
```

### US773 - 字体与控件密度统一

```yaml
id: US773
requirement_ids:
  - R853
module: "全局 UI 规范"
role: "B 端业务用户"
story: "作为 B 端业务用户，我希望页面级按钮、筛选控件、表格和导入弹窗使用统一的字号与控件密度，以便人员列表、详情页、结果列表和弹窗看起来像同一个产品，而不是不同页面临时拼出来的样式。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "全局 CSS 不再用 button/input/select 的 font inherit 覆盖组件自身字号。"
  - "Button 的小尺寸不再使用 12.8px 非标准字号，页面级和表格操作按钮回到一致的 14px 基线。"
  - "Table 表头与正文在字号上保持协调，不再固定 12px 表头。"
  - "客服人员导入 Dialog 的步骤标题、说明、映射方式、textarea 和结果区使用统一 14px 基线，不再大量混用 12px。"
  - "不新增业务功能、不修改后端、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US772"
status: "done"
notes: "IM153 已完成：页面级按钮、筛选按钮、表格表头/正文、人员列表行内文字按钮和客服人员导入弹窗正文/步骤/表单已回到一致 14px 基线；纯图标按钮保留图标密度。"
```

### US774 - 职场基础 CRUD 前端闭环

```yaml
id: US774
requirement_ids:
  - R854
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在职场列表中进入单个职场的新建、编辑和冻结流程，以便维护职场基础档案，而不是在列表页里展开一个大表单。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/sites Header 右侧提供新建职场入口。"
  - "职场列表行提供详情、编辑和冻结操作，其中详情进入现有职场详情页，编辑进入子页面，冻结打开确认弹窗。"
  - "/master-data/sites/new 使用子页面提交职场 ID、职场名称、状态、生效开始、生效结束。"
  - "/master-data/sites/[workplaceId]/edit 使用子页面编辑职场名称、状态和有效期，职场 ID 不作为可编辑字段。"
  - "提交成功或失败后回到职场列表并使用 Alert 显示反馈。"
  - "不新增职场服务团队绑定、供应商合同、结算比例、最低人力、审批、导出、批量、权限、自动排班、生产公式或收费因子。"
dependencies:
  - "US773"
status: "done"
notes: "IM154 已完成：职场新建/编辑走子页面，冻结走 Dialog，提交复用现有 workplace reference maintenance API。"
```

### US775 - 供应商基础 CRUD 前端闭环

```yaml
id: US775
requirement_ids:
  - R855
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在供应商列表中进入单个供应商的新建、编辑和冻结流程，以便维护供应商基础档案，而不是在列表页里展开一个大表单。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/vendors Header 右侧提供新建供应商入口。"
  - "供应商列表行提供详情、编辑和冻结操作，其中详情进入现有供应商详情页，编辑进入子页面，冻结打开确认弹窗。"
  - "/master-data/vendors/new 使用子页面提交供应商 ID、供应商名称、状态、生效开始、生效结束。"
  - "/master-data/vendors/[vendorId]/edit 使用子页面编辑供应商名称、状态和有效期，供应商 ID 不作为可编辑字段。"
  - "提交成功或失败后回到供应商列表并使用 Alert 显示反馈。"
  - "不新增供应商合同、结算比例、最低人力、服务职场绑定、审批、导出、批量、权限、自动排班、生产公式或收费因子。"
dependencies:
  - "US774"
status: "done"
notes: "IM155 已完成：供应商新建/编辑走子页面，冻结走 Dialog，提交复用现有 supplier reference maintenance API。"
```

### US776 - 技能组基础 CRUD 前端闭环

```yaml
id: US776
requirement_ids:
  - R856
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在技能组列表中进入单个技能组的新建、编辑和冻结流程，以便维护技能组基础档案，而不是在列表页里展开一个大表单。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/skills Header 右侧提供新建技能组入口。"
  - "技能组列表行提供编辑和冻结操作；编辑进入子页面，冻结打开确认弹窗。"
  - "/master-data/skills/new 使用子页面提交技能组 ID、技能组名称、归属属性、状态、生效开始、生效结束。"
  - "/master-data/skills/[skillId]/edit 使用子页面编辑技能组名称、归属属性、状态和有效期，技能组 ID 不作为可编辑字段。"
  - "提交成功或失败后回到技能组列表并使用 Alert 显示反馈。"
  - "不新增人员技能绑定、排班技能引用、技能层级、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US775"
status: "done"
notes: "IM156 已完成：技能组新建/编辑走子页面，冻结走 Dialog，提交复用现有 skills reference maintenance API 并真实写入归属属性。"
```

### US777 - 组织基础 CRUD 前端闭环

```yaml
id: US777
requirement_ids:
  - R857
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在组织列表中进入单个组织的新建、编辑和冻结流程，以便维护组织基础档案，而不是在列表页里展开一个大表单。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "/master-data/organizations Header 右侧提供新建组织入口。"
  - "组织列表行提供编辑和冻结操作；编辑进入子页面，冻结打开确认弹窗。"
  - "/master-data/organizations/new 使用子页面提交组织 ID、组织名称、组织层级、上级组织、状态、生效开始、生效结束。"
  - "/master-data/organizations/[organizationId]/edit 使用子页面编辑组织名称、组织层级、上级组织、状态和有效期，组织 ID 不作为可编辑字段。"
  - "提交成功或失败后回到组织列表并使用 Alert 显示反馈。"
  - "不新增组织架构图、人员调岗、供应商绑定、合同、结算、最低人力、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US776"
status: "done"
notes: "IM157 已完成：组织新建/编辑走子页面，冻结走 Dialog，并补齐本地组织维护 API。"
```

### US778 - 客服人员列表真实筛选

```yaml
id: US778
requirement_ids:
  - R858
module: "主数据维护"
role: "主数据维护人员"
story: "作为主数据维护人员，我希望在客服人员列表里按真实技能组、组织和职场筛选人员，以便确认导入和维护后的人员归属，而不是看到只有占位项的下拉框。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "/master-data/agents 的技能组、组织、职场筛选下拉来自当前真实人员列表数据。"
  - "URL 查询参数 employee_name、employee_id、status、employee_type、skill_group、organization、workplace 能真实过滤人员行。"
  - "重置入口回到 /master-data/agents。"
  - "页面结构保持现有 B 端列表模式：Header 放页面级动作，筛选卡片在列表操作栏上方，列表页不塞新增/编辑表单。"
  - "不新增导航、页面、后端 route、schema/migration、依赖、权限、审批、导出、批量操作、自动排班、生产公式、结算或收费因子。"
dependencies:
  - "US777"
status: "done"
notes: "IM158 已完成：客服人员列表筛选项和查询过滤已按真实人员数据收口，列表结构保持 Header actions、筛选卡片、列表操作栏、表格的 B 端模式。"
```

### US779 - 本地旧主数据 schema 维护写入兼容

```yaml
id: US779
requirement_ids:
  - R859
module: "主数据维护"
role: "主数据维护人员"
story: "作为正在本地试用主数据维护的用户，我希望旧本地 SQLite 数据库也能执行人员、技能组和组织维护，而不是因为缺少已确认字段直接看到 500。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "旧本地 SQLite 缺少 master_data_employees.employee_type、organization_id、workplace_id 时，人员 create/edit/freeze 不再 500。"
  - "旧本地 SQLite 缺少 master_data_skills.skill_category 时，技能组 create/edit/freeze 不再 500。"
  - "旧本地 SQLite 缺少 master_data_organizations 表时，组织维护路径可按已确认本地表结构创建表后写入。"
  - "不新增迁移文件、不新增业务字段、不改生产状态/公式/结算/合同/最低人力。"
  - "不新增权限、审批、导出、批量操作、自动排班或真实外部集成。"
dependencies:
  - "US778"
status: "done"
notes: "IM159 已完成：旧本地 SQLite schema 可执行人员、技能组和组织维护写入；本轮只做 SQLite 本地兼容补齐，不新增迁移文件、业务字段、权限、审批、导出、批量、结算或合同能力。"
```
### US791 - 登录/状态日志导入大弹窗

```yaml
id: US791
requirement_ids:
  - R871
status: "done"
as_a: "排班履约运营人员"
i_want: "在登录/状态日志业务页内完成日志 CSV 导入"
so_that: "我不需要跳转到抽象上传页，也能在当前业务语境里看到上传、映射和导入结果"
acceptance:
  - "/actual-logs/production Header 的 `导入登录日志`、`导入状态日志` 打开当前页 Dialog。"
  - "Dialog 分为 `上传文件`、`字段映射`、`导入结果` 三步，非当前 step 保持 DOM 挂载。"
  - "登录日志提交 `file_type=login_log`，状态日志提交 `file_type=status_log`。"
  - "上传结果回流 `/actual-logs/production?import_dialog=1` 并展示批次详情入口。"
  - "不新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、自动排班、生产公式、结算或收费因子。"
notes: "IM171 已完成：登录/状态日志页 Header 的两个导入入口打开当前页 Dialog；Dialog 三步为上传文件、字段映射、导入结果，文件 input 在 step 切换时保持挂载；登录日志提交 `login_log`，状态日志提交 `status_log`，上传结果回流当前页并提供批次详情入口。"
```

### US792 - 前端健康恢复计划固化

```yaml
id: US792
requirement_ids:
  - R872
module: "前端健康恢复"
role: "PM"
story: "作为 PM，我希望把前端健康恢复计划写入仓库、队列和追踪文件，以便上下文压缩后仍能按明确顺序继续执行，而不是靠聊天历史记忆。"
task_type: "harness"
priority: "P0"
acceptance:
  - "docs/frontend-health-recovery-plan.md 记录恢复入口、阶段顺序、Product Design 门禁、非目标和验收指标。"
  - "docs/superpowers/plans/2026-06-12-frontend-health-recovery.md 记录可执行细化计划。"
  - "docs/current/STORY_QUEUE.yaml 和 docs/current/ACTIVE_TASKS.yaml 只包含 US792/IM172。"
  - "TRACE_INDEX.yaml 建立 R872/US792/IM172 映射且不存储 lifecycle status。"
  - "本轮不修改 app、components、lib、backend、package 或 lockfile。"
status: "done"
notes: "IM172 已完成：计划和恢复入口已固化，current queue 已清空；后续前端/页面/功能设计任务必须先使用 Product Design 插件确认 brief；IM173+ 只在计划中列出，需要单独 seed。"
```

### US793 - 抽取前端 API 结果和错误工具

```yaml
id: US793
requirement_ids:
  - R873
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望前端页面共用同一套 API 结果类型和错误格式化函数，以便后续页面数据读取和错误展示不再复制粘贴同一段逻辑。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增共享 `ApiResult<T>` 类型，现有重复页面改为引用共享类型。"
  - "新增共享 `formatApiError` 函数，现有重复页面改为引用共享函数。"
  - "结构测试防止继续在目标页面内定义重复 `type ApiResult<T>` 或 `function formatApiError`。"
  - "不改变页面 UI、导航、fetch URL、返回数据结构、错误文案语义、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM173 已完成：共享 API result/error 工具已抽取，结构测试已防止目标文件重新定义本地 `ApiResult<T>` 或 `formatApiError`；`fetchImportBatches` 和 field-mapping fetch 去重仍留给 IM174。"
```

### US794 - 抽取导入批次和字段映射模板 fetch 工具

```yaml
id: US794
requirement_ids:
  - R874
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望导入批次和字段映射模板读取逻辑共用同一套工具，以便后续页面数据读取不再复制同一段 fetch、错误处理和空数组兜底。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增共享 `lib/import-api.ts`，提供 `fetchImportBatches` 和 `fetchImportFieldMappingTemplates`。"
  - "重复页面改为引用共享 fetch 工具，页面专属 fetch 函数继续留在页面内。"
  - "结构测试防止目标页面继续本地定义 `fetchImportBatches` 或 `fetchImportFieldMappingTemplates`。"
  - "不改变页面 UI、导航、fetch URL、返回数据结构、错误文案语义、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM174 已完成：共享 import fetch 工具已抽取，结构测试已防止目标文件重新定义本地 `fetchImportBatches` 或 `fetchImportFieldMappingTemplates`；Server Action runtime guards 仍留给 IM175。"
```

### US795 - 补充导入和比对 Server Action 运行时保护

```yaml
id: US795
requirement_ids:
  - R875
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望数据质量相关 Server Action 在运行时校验关键枚举和回跳目标，以便非法表单值不会进入 API 请求或成功回跳。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`uploadImportCsvAction` 对 `file_type` 和 `result_redirect_to` 做运行时白名单校验。"
  - "`createImportFieldMappingTemplateAction` 和 `applyImportBatchAction` 对 `file_type` 做运行时白名单校验。"
  - "本地比对触发 action 对 `comparison_type` 做共享 guard，非法值进入失败回跳，不构造成功请求。"
  - "不改变页面 UI、导航、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM175 已完成：上传、字段映射模板创建、批次应用、批次详情比对触发和版本工作台比对触发均先解析受控枚举或回跳目标；非法值进入失败回跳，不构造成功请求。error/loading 页面仍留给 IM176/IM177。"
```

### US796 - 提供全局页面异常恢复入口

```yaml
id: US796
requirement_ids:
  - R876
module: "前端健康恢复"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望页面异常时仍能看到统一的错误提示和恢复操作，以便可以重试或回到经营总览继续工作。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增 `app/error.tsx`，作为 Next.js app router 全局 error boundary。"
  - "错误页使用现有 AppShell、shadcn Alert/Button 和语义主题 token。"
  - "提供 `reset()` 重试按钮和返回 `/dashboard` 的安全入口。"
  - "不新增依赖，不改变业务页面、导航、后端、数据库、权限、审批、导出、批量、自动排班、公式、结算或收费因子。"
status: "done"
notes: "IM176 已完成：全局 error boundary 可恢复；route-local loading 仍留给 IM177。"
```

### US797 - 核心业务入口显示加载骨架屏

```yaml
id: US797
requirement_ids:
  - R877
module: "前端健康恢复"
role: "BPO 运营人员"
story: "作为 BPO 运营人员，我希望进入核心业务入口等待数据时看到与页面结构一致的加载骨架，以便知道页面正在加载而不是空白。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/dashboard`、`/master-data`、`/demand-plans`、`/schedule-plans`、`/actual-logs/production`、`/data-quality` 均有 route-local `loading.tsx`。"
  - "loading 使用现有 AppShell 和 shadcn Skeleton，保留对应页面标题或 Breadcrumb。"
  - "不写无意义的功能说明，不做 route-group 迁移，不修改现有业务页面。"
  - "不新增依赖，不改变后端、数据库、权限、审批、导出、批量、自动排班、公式、结算或收费因子。"
status: "done"
notes: "IM177 已完成：核心入口具备 route-local loading skeleton；长期 `(main)` route-group 迁移仍保持延期。"
```

### US798 - 保持导入中心模型入口兼容并拆出基础工具

```yaml
id: US798
requirement_ids:
  - R878
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望导入中心巨型 model 文件先拆出类型、格式化函数和导航 URL 构造函数，以便后续继续拆分汇总逻辑时不会破坏现有页面调用。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增 `components/import-center-types.ts`，承载原 model 中的导出类型定义。"
  - "新增 `components/import-center-formatters.ts`，承载批次显示、文件类型、处理状态、应用状态、就绪状态和行状态格式化函数。"
  - "新增 `components/import-center-navigation.ts`，承载导入中心 API URL 与页面 href 构造函数。"
  - "`components/import-center-model.ts` 继续 re-export 旧公开入口，现有调用方无需改 import path。"
  - "结构测试防止入口回退为继续本地定义核心类型、格式化函数或 URL 构造函数。"
  - "不改变可见 UI、导航、API URL 语义、返回数据结构、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM178 已完成：第一刀只做模型基础设施拆分；剩余业务 summarizer/builder 继续留给后续 IM。"
```

### US799 - 拆分导入中心剩余汇总构造逻辑

```yaml
id: US799
requirement_ids:
  - R879
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望导入中心剩余 summarizer 和 builder 按责任拆到独立文件，以便后续维护时不再集中修改单个巨型 model 文件。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增 list/version/review/batch/template/comparison 六个导入中心责任 model 文件。"
  - "`components/import-center-model.ts` 降为 thin compatibility entrypoint，只保留 re-export。"
  - "旧公开函数名和 import path 保持兼容，现有调用方无需改 import path。"
  - "结构测试防止主要 summarizer 回退到 `components/import-center-model.ts`。"
  - "不改变可见 UI、导航、API URL 语义、返回数据结构、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM179 已完成：导入中心剩余 summarizer/builder 已按责任拆分；可见 UI 和业务行为不变。"
```

### US800 - 拆分主数据维护 workbench 巨型文件

```yaml
id: US800
requirement_ids:
  - R880
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望主数据维护 workbench 按页面责任拆到独立文件，以便后续修人员、职场、供应商、组织和技能页面时不再集中修改单个巨型 UI 文件。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增 actions、agents、references、details、forms、fields 六个主数据维护责任文件。"
  - "`components/master-data-maintenance-workbench.tsx` 降为 thin compatibility entrypoint，只保留 re-export。"
  - "旧公开组件名和 import path 保持兼容，现有调用方无需改 import path。"
  - "结构测试防止主要页面组件和表单控件回退到旧巨型入口。"
  - "不改变可见 UI、路由、交互、业务语义、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM180 已完成：主数据维护 workbench 已按 actions/agents/references/details/forms/fields 拆分；旧入口保持兼容导出，可见 UI 和业务行为不变。"
```

### US801 - 拆分主数据维护 model 巨型文件

```yaml
id: US801
requirement_ids:
  - R881
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望主数据维护 model 按类型、实体、payload、人员、reference、详情、导入弹窗和格式化职责拆到独立文件，以便后续可见产品修复不会继续堆到单个巨型 model 文件。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增 types、entities、payloads、agent-model、reference-model、detail-model、import-dialog-model、formatters 八个责任文件。"
  - "`components/master-data-maintenance-model.ts` 降为 thin compatibility entrypoint，只保留 re-export。"
  - "旧公开类型、函数名和 import path 保持兼容，现有调用方无需改 import path。"
  - "结构测试防止主要 summarizer、payload builder 和 helper 回退到旧巨型入口。"
  - "不改变可见 UI、路由、交互、业务语义、API URL、返回数据结构、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM181 已完成：主数据维护 model 已按八个责任文件拆分；旧入口保持兼容导出，可见 UI、业务行为和数据契约不变。"
```

### US802 - 固化可见动作位置规则

```yaml
id: US802
requirement_ids:
  - R882
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望页面级、筛选区、列表级、行内和危险确认动作有稳定结构约束，以便后续页面开发不会再把动作混放到同一个区域。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`SiteHeader` 的页面级动作区域有稳定 `data-action-scope=\"page\"`。"
  - "客服人员筛选区只承载 `查询`、`重置`，并有稳定 `data-action-scope=\"filter\"`。"
  - "客服人员列表工具栏只承载选择态与批量/列表级占位动作，并有稳定 `data-action-scope=\"list\"`。"
  - "客服人员行内动作区域有稳定 `data-action-scope=\"row\"`。"
  - "冻结确认 Dialog 的危险确认区域有稳定 `data-action-scope=\"danger\"`。"
  - "结构测试防止页级动作、筛选动作和列表动作重新混放。"
  - "不新增按钮、业务能力、路由、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM182 已完成：动作区域已有结构标记和回归测试；页面级动作、筛选动作、列表动作、行内动作和危险确认动作边界被固化。"
```

### US803 - 复用统一空状态

```yaml
id: US803
requirement_ids:
  - R883
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望常见空列表、读取失败和无匹配结果使用统一空状态组件，以便页面不会因为局部实现不同而出现字体、间距、图标和动作位置漂移。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增共享 `components/empty-state.tsx`。"
  - "共享空状态使用语义 token、稳定 `data-slot`，并支持 compact 和外部传入动作区域。"
  - "替换已存在的同名本地 `EmptyState` 实现，保留原文案和原业务行为。"
  - "结构测试防止目标文件继续定义本地 `EmptyState`。"
  - "不新增业务按钮、路由、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM183 已完成：共享 EmptyState 已用于三个已有同名空状态位置；本轮没有扩大到所有 EmptyPanel/PanelState。"
```

### US804 - 统一主数据维护表单反馈

```yaml
id: US804
requirement_ids:
  - R884
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望主数据维护表单的必填提示、提交按钮和提交中反馈使用统一组件，以便后续人员、职场、供应商、组织和技能表单不会继续出现按钮字体、尺寸和反馈状态漂移。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "维护表单使用共享 submit 组件承载图标、按钮尺寸、禁用态和提交中文案。"
  - "必填字段使用统一视觉标识，但不改变现有 required 条件。"
  - "结构测试防止维护表单回退到散落的裸 submit Button。"
  - "不新增业务字段、按钮、路由、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM184 已完成：主数据维护表单已使用统一 submit pending 组件和必填视觉标识；本轮未新增业务字段、按钮、路由或后端能力。"
```

### US805 - 复核导航和 Breadcrumb 规则

```yaml
id: US805
requirement_ids:
  - R885
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望现有导航和 Breadcrumb 规则被结构化约束，以便详情、新建、编辑页能稳定高亮正确父级，并避免页面内容区重复堆标题或恢复未经确认的大模块入口。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "详情、新建、编辑页通过父级 path 规则高亮正确导航项。"
  - "Breadcrumb 入口由 shell/header 统一承载，页面内容区不重复造同级标题结构。"
  - "结构测试防止新增大模块导航或恢复禁用的 generic 数据质量/导入中心入口。"
  - "不新增业务导航模块、业务页面、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM185 已完成：导航/Breadcrumb 规则已由结构测试固化，详情/新建/编辑页父级高亮和 header breadcrumb slot 有回归保护。"
```

### US806 - 收口旧计划脚手架导航入口

```yaml
id: US806
requirement_ids:
  - R886
module: "前端健康恢复"
role: "产品与开发维护者"
story: "作为产品与开发维护者，我希望 Sidebar 不再暴露旧 demo 的班次明细和不可用管理入口，以便当前产品入口只呈现已确认业务模块。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "Sidebar 保留已确认的经营总览、需求计划、排班计划、登录/状态日志和主数据入口。"
  - "Sidebar 不再暴露 `班次明细`、`不可用管理`、`/shift-details`、`/unavailability` 入口。"
  - "旧路由文件不删除，避免扩大为路由清理或迁移任务。"
  - "结构测试防止旧 demo 入口回流。"
  - "不新增页面、业务能力、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM186 已完成：旧计划脚手架入口已从 Sidebar 收口，导航结构测试已覆盖。"
```

### US807 - 收口排班计划旧链路入口

```yaml
id: US807
requirement_ids:
  - R887
module: "前端健康恢复"
role: "排班计划使用者"
story: "作为排班计划使用者，我希望排班计划列表和详情页只停留在计划本身，不再把我带入旧 demo 的风险、班次明细或不可用页面。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/schedule-plans` 不再导入或渲染旧链路卡、旧风险表或旧 demo 路由链接。"
  - "`/schedule-plans/[planId]` 不再查询旧风险/不可用数据，也不再渲染旧复核链路按钮。"
  - "旧 `/schedule-risks`、`/shift-details`、`/unavailability` 路由保留，不扩大为路由删除任务。"
  - "结构测试防止当前排班计划入口重新链接到旧 demo 路由。"
  - "不新增页面、业务能力、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM187 已完成：当前排班计划入口已停止跳转旧 demo 路由，旧路由仍保留兼容。"
```

### US808 - 预测版本详情入口语义收口

```yaml
id: US808
requirement_ids:
  - R888
module: "业务版本流"
role: "需求预测使用者"
story: "作为需求预测使用者，我希望预测版本列表里的查看操作和详情页都明确围绕预测业务版本，而不是让我误以为进入的是导入批次处理页面。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/demand-plans/production` 列表行操作明确进入预测版本详情。"
  - "`/demand-plans/production/[batchId]` Breadcrumb、返回入口和页面说明保持预测版本语义。"
  - "结构测试防止预测版本详情入口退回来源批次处理语义。"
  - "不新增路由、业务能力、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM188 已完成：预测版本列表和详情页入口语义已收口为预测版本，不新增路由或写能力。"
```

### US809 - 排班版本详情入口语义收口

```yaml
id: US809
requirement_ids:
  - R889
module: "业务版本流"
role: "排班计划使用者"
story: "作为排班计划使用者，我希望排班版本列表里的查看操作和详情页都明确围绕排班业务版本，而不是让我误以为进入的是导入批次处理页面。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/schedule-plans/production` 列表行操作明确进入排班版本详情。"
  - "`/schedule-plans/production/[batchId]` Breadcrumb、返回入口和页面说明保持排班版本语义。"
  - "结构测试防止排班版本详情入口退回来源批次处理语义。"
  - "不新增路由、业务能力、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM189 已完成：排班版本列表和详情页入口语义已收口为排班版本，不新增路由或写能力。"
```

### US810 - 登录/状态日志版本详情入口语义收口

```yaml
id: US810
requirement_ids:
  - R890
module: "业务版本流"
role: "登录/状态日志使用者"
story: "作为登录/状态日志使用者，我希望日志版本列表里的查看操作和详情页都明确围绕实际日志业务版本，而不是让我误以为进入的是导入批次处理页面。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/actual-logs/production` 列表行操作明确进入日志版本详情。"
  - "`/actual-logs/production/[batchId]` Breadcrumb、返回入口和页面说明保持日志版本语义。"
  - "结构测试防止日志版本详情入口退回来源批次处理语义。"
  - "不新增路由、业务能力、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM190 已完成：登录/状态日志版本列表和详情页入口语义已收口为日志版本，不新增路由或写能力。"
```

### US811 - 对比运行详情结果回看入口语义收口

```yaml
id: US811
requirement_ids:
  - R891
module: "业务版本流"
role: "比对结果查看者"
story: "作为比对结果查看者，我希望对比运行详情页明确是业务版本语境下的结果回看页，而不是默认把我带回复核案例列表。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/data-quality/comparison-runs/[runId]` 顶部返回入口回到业务版本列表。"
  - "页面保留来源链路 tab 内的来源批次和复核案例入口，不把来源批次或复核案例设为详情页父级。"
  - "结构测试防止对比运行详情页主返回入口退回 `返回复核案例`。"
  - "不新增路由、业务能力、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM191 已完成：对比运行详情页主返回入口已收口为业务版本列表，不新增路由或写能力。"
```

### US812 - 业务版本列表本地比对动作语义收口

```yaml
id: US812
requirement_ids:
  - R892
module: "业务版本流"
role: "业务版本列表使用者"
story: "作为业务版本列表使用者，我希望列表里的本地比对动作和结果回看都明确表达为比对运行，以便我知道这是一次可追踪的计算运行，而不是普通页面跳转或泛泛结果入口。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/data-quality/versions` 的可提交比对入口使用 `比对运行` 语义。"
  - "比对提交后的成功/失败反馈和结果回看入口使用 `比对运行` 语义。"
  - "业务版本列表的结果回看标题使用 `比对运行结果` 语义。"
  - "结构测试防止文案退回 `发起一次比对`、`查看结果列表` 或泛泛 `比对结果`。"
  - "不新增路由、业务能力、后端、数据库、依赖或 package/lockfile。"
status: "done"
notes: "IM192 已完成：业务版本列表的本地比对入口、提交反馈和结果回看标题已收口为比对运行语义，不新增路由或写能力。"
```

### US813 - 共享 lib helper 回归护栏

```yaml
id: US813
requirement_ids:
  - R893
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望共享 API/import helper 的恢复成果有结构回归护栏，以便后续重构不会悄悄恢复重复定义。"
task_type: "harness"
priority: "P0"
acceptance:
  - "新增结构测试确认 `lib/api-result.ts`、`lib/api-error.ts`、`lib/import-api.ts` 存在。"
  - "结构测试确认共享 helper 的关键导出存在。"
  - "结构测试限制 `formatApiError`、`fetchImportBatches`、`fetchImportFieldMappingTemplates` 的重复函数定义回流。"
  - "不修改现有 `app/**`、`components/**`、`lib/**` 业务源码，不修改 package/lockfile 或 check 脚本。"
status: "done"
notes: "IM193 已完成：使用 Qoder 受控实现新增共享 lib helper 回归结构测试，Codex 审查与验证。"
```

### US814 - 共享 MetricCard 首刀

```yaml
id: US814
requirement_ids:
  - R894
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望完全同构的指标卡先收敛到共享 MetricCard，以便后续页面重构不继续复制局部卡片实现。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增共享 `components/metric-card.tsx`，使用既有 shadcn Card 组合和语义 token。"
  - "`app/demand-plans/page.tsx`、`app/schedule-plans/page.tsx`、`app/shift-details/page.tsx` 改为引用共享 MetricCard，不再保留本地同构指标卡函数。"
  - "新增结构测试防止这三处页面重新定义本地 `MetricCard` 或 `SummaryCard`。"
  - "不修改页面路由、数据读取、业务文案、后端、依赖或 package/lockfile。"
status: "done"
notes: "IM194 已完成：共享 MetricCard 首刀已迁移三处旧页面并补结构测试。"
```

### US815 - 旧风险不可用页共享 MetricCard 迁移

```yaml
id: US815
requirement_ids:
  - R895
module: "前端健康恢复"
role: "开发维护者"
story: "作为开发维护者，我希望旧排班风险和不可用页面也复用共享 MetricCard，以便相同指标卡形态不继续分散复制。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/unavailability`、`/unavailability/[unavailabilityId]`、`/schedule-risks/[riskId]` 改为引用共享 MetricCard。"
  - "三处页面不再保留本地同构 `MetricCard` 函数。"
  - "结构测试扩展覆盖这三处页面，防止重新定义本地 MetricCard。"
  - "不修改共享组件 API、页面路由、数据读取、业务文案、后端、依赖或 package/lockfile。"
status: "done"
notes: "已完成。继续沿用 Product Design brief：保持现有 Card 视觉、静态展示、不新增动作。"
```
