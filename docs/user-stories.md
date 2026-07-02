# User Stories - Compact Current Stub

本文件不再保存历史用户故事全文。历史故事在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧故事时使用 Git history。

## Current Story Anchors

### US869 - 排班师月班表字段映射与需求追踪

```yaml
id: US869
requirement_ids:
  - R949
module: "BPO WFM 三条主线"
role: "产品经理"
story: "作为产品经理，我希望先把真实 202607 班表、排班师主流程、系统内生成月班表、后续小组长/一线员工需求和明确不做项统一沉淀成可追踪产品契约，以便后续开发不漏需求、不误把 Excel 导入或自动排班当作第一版目标。"
task_type: "harness"
priority: "P0"
acceptance:
  - "文档覆盖真实 Excel 的 Primary Duty、Actual Duty、班种信息、班表标注、Forecast/Arranged/Actual 人头统计和外部链接风险。"
  - "文档明确第一版主角色是排班师，Excel 只用于初始化/校准/历史导入，上线后由系统内生成和维护月班表。"
  - "文档明确第一版源数据是 员工 + 日期 + 班种，复制上一月/上一周员工个人日期-班种模式生成初稿。"
  - "文档明确人员变动处理：只复制仍在同一小组/项目有效的员工，新人进入待排队列，离职/转组/无效员工不复制。"
  - "文档明确第一版差异校验沿用 Forecast agents vs Arranged/Actual agents 人头口径，不引入标准人力。"
  - "文档保留小组长调配/审批和一线员工申请需求为后续流程，不能遗漏但不能混入第一版范围。"
  - "文档明确不授权自动排班、预测模型、标准人力试算、审批、权限、通知、导出、批量、外部集成、数据库 schema/migration 或生产规则。"
status: "draft"
notes: "IM279 文档/建模任务；目标产物为 docs/design/scheduler-monthly-roster-field-mapping-and-model.md。"
```

### US870 - 班种定义与月班表生成底座产品契约

```yaml
id: US870
requirement_ids:
  - R950
module: "BPO WFM 三条主线"
role: "产品经理"
story: "作为产品经理，我希望把班种定义、月班表草稿生成、复制上一月/上一周、待排队列、版本发布和 Primary/Actual 分层沉淀成产品契约，以便后续开发先修正确底座，不把预测模型、标准人力或自动排班混入第一版。"
task_type: "harness"
priority: "P0"
acceptance:
  - "契约明确第一版生成人员级日班种草稿，而不是只生成班种人数或半小时覆盖。"
  - "契约明确班种定义第一版只用工作时段参与半小时覆盖展开。"
  - "契约明确复制上一月/上一周时只继承稳定班种，不继承一次性标注。"
  - "契约明确新人、转组、来源缺失人员进入待排队列，不做推荐班种。"
  - "契约明确状态流转为 draft -> published，不做审批。"
  - "契约明确 Primary Duty 是计划班表，Actual Duty 是实际/调整后履约版本。"
  - "契约明确预测模型、标准人力、自动排班、审批、权限、通知、导出、批量、外部集成和生产规则均延后。"
status: "draft"
notes: "IM282 文档/产品契约任务；目标产物为 docs/design/scheduler-shift-type-monthly-roster-generation-contract.md。"
```

### US871 - ShiftType 班种解析与半小时覆盖展开

```yaml
id: US871
requirement_ids:
  - R951
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望系统能够基于可配置班种的工作时段生成半小时覆盖，以便后续月班表草稿、覆盖人数和缺口校验建立在稳定班种底座上。"
task_type: "backend-mvp"
priority: "P0"
acceptance:
  - "后端纯领域服务支持 ShiftType 工作时段解析，不新增 API、数据库、migration 或 UI。"
  - "支持单段、两段、半点和跨天班种，验收样例包括 Z1、A5、T1、T4、N、A12。"
  - "跨天班归属排班业务日，但覆盖时间戳可延伸到次日。"
  - "无法解析班种进入异常清单，不阻断其他可解析班种的覆盖展开。"
  - "用餐/休息、哺乳假、特殊激励、适用人头备注只记录在班种配置上，不参与第一版覆盖计算。"
status: "draft"
notes: "IM283 backend pure domain service and focused unittest."
```

### US872 - 人员级月班表草稿纯领域模型

```yaml
id: US872
requirement_ids:
  - R952
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望系统底层能表达同一员工同一天的多个班表记录、只把正式班种计入覆盖、并校验多班种不重叠和人员归属，以便后续生成月班表草稿时不压扁真实业务。"
task_type: "backend-mvp"
priority: "P0"
acceptance:
  - "后端纯领域模型定义 RosterVersion、RosterAssignment、PendingRosterEmployee 和引用校验上下文，不新增 API、数据库、migration 或 UI。"
  - "同一员工同一天允许多条记录，只有 assignment_kind=shift 参与覆盖。"
  - "assignment_kind 支持 shift、leave、rest、training、meeting、support、work_from_home、annotation、unassigned。"
  - "同一员工同一天允许多条 shift，但时间重叠必须返回校验错误。"
  - "员工有效性和项目/小组归属通过调用方传入快照校验，不查数据库。"
  - "待排人员使用独立 PendingRosterEmployee，保持人月维度。"
  - "RosterVersion 只支持 draft、published、archived，且只有 draft 可编辑。"
status: "draft"
notes: "IM284 backend pure domain model and focused unittest."
```

### US873 - 月班表草稿生成演示闭环

```yaml
id: US873
requirement_ids:
  - R953
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在系统页面中选择目标月份并生成月班表草稿，看到整月人员 x 日期总览、单周明细、待排人员和异常清单，以便确认系统已经能基于配置和历史稳定班种生成下月班表草稿。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增 /roster-drafts 页面，支持目标月份选择和生成草稿入口。"
  - "本地 fixture 覆盖单项目、多小组、稳定班种、新员工、换组人员、缺少来源、无效班种和非 shift 标注。"
  - "生成策略第一版为 previous_week_same_weekday，只复制稳定 shift 班种。"
  - "月视图展示整月人员 x 日期表格，首列员工固定，单元格显示班种代码和状态标记。"
  - "周视图展示选中周的时间段、来源日期、状态和原因。"
  - "状态标记包含复制生成、待确认、异常、非班务标注已过滤。"
  - "待排人员、异常清单和已过滤标注均只读，不保存、不审批、不发布。"
  - "不新增 API、数据库、Excel 上传/导入、预测模型、标准人力、自动补班、权限、导出或批量能力。"
status: "draft"
notes: "IM285 visible frontend demo loop using TypeScript local generator and fixture."
```

### US874 - 月班表草稿排班工作台重构

```yaml
id: US874
requirement_ids:
  - R954
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望月班表草稿页面像成熟排班工作台一样支持月度扫盘、周度处理和右侧异常队列定位，以便我能快速找到需要人工确认的员工和日期，而不是阅读分散的报表卡片。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "页面采用 Homebase 主参考、Deputy / When I Work 交叉校验后的排班工作台结构，但视觉保持现有 shadcn B2B 控制台风格。"
  - "顶部 toolbar 呈现项目/职场、小组范围、目标月份、当前周、生成策略、视图切换和状态摘要。"
  - "月视图是员工 x 日期压缩月网格，用于扫整月班种节奏和异常密度。"
  - "周视图是员工 x 7 天展开网格，用班次块展示班种、时间段、来源和状态，不再使用明细报表表格。"
  - "右侧面板展示选中格子的只读详情，并提供异常、待排、过滤标注统一队列。"
  - "队列项可定位到对应员工/日期格子并更新右侧详情。"
  - "首版不提供编辑、保存、发布、审批、权限、Excel 导入、预测模型、标准人力、自动排班、导出或批量能力。"
status: "draft"
notes: "IM286 frontend IA redesign over existing IM285 local generator."
```

### US875 - 全站导航瘦身与 icon rail 对齐

```yaml
id: US875
requirement_ids:
  - R955
module: "BPO WFM 全站框架"
role: "排班师 / 运营后台用户"
story: "作为需要长时间处理网格和表格的后台用户，我希望全站导航默认是稳定窄 rail，并且展开/收起对齐、可记忆，以便核心工作区不再被宽导航挤压。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "全站 AppShell 默认进入 64px icon rail，展开后为 240px。"
  - "展开/收起由点击固定切换，不使用 hover 改变布局。"
  - "收起态隐藏分组标题和文案，只保留居中 icon；所有可见导航入口使用 32px 命中区并对齐在同一栅格。"
  - "展开态显示品牌、分组标题、导航文案和本地用户菜单。"
  - "用户手动展开/收起状态在站内页面切换时保持，并使用 localStorage/cookie/in-memory 兜底保存 UI 偏好。"
  - "全站 header 高度压到 48px，不新增搜索、通知、审批、权限、导出或批量能力。"
  - "浏览器验收覆盖 /dashboard、/roster-drafts 和 /schedule-plans。"
status: "draft"
notes: "IM287 global shell/navigation infrastructure before the roster workbench full-screen redesign."
```

### US876 - 月班表草稿全屏排班工作台体验

```yaml
id: US876
requirement_ids:
  - R956
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望月班表草稿页面成为全屏网格优先的排班工作台，默认先扫整月，再按需打开右侧抽屉查看格子详情和处理队列，以便主工作区不再被说明文案和常驻面板挤占。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "页面去掉解释性 WorkbenchPageHeader，主区域使用 header 下方可用高度并隐藏外层滚动。"
  - "工作台默认进入月视图，月/周切换保留在工作台内部。"
  - "顶部 toolbar 只保留项目/职场、小组范围、目标月份、当前周、详情与队列入口、生成草稿入口。"
  - "月视图和周视图网格占据主画布，表头与员工列保持定位能力。"
  - "格子详情、异常、待排和已过滤标注进入右侧抽屉，不再常驻为固定右侧面板。"
  - "点击格子或队列项能够打开抽屉并定位到对应员工/日期。"
  - "首版不提供编辑、保存、发布、审批、权限、Excel 导入、预测模型、标准人力、自动排班、导出或批量能力。"
status: "draft"
notes: "IM288 full-screen roster scheduler workbench refinement over IM286 and IM287."
```

### US877 - 月班表草稿格子受控编辑能力

```yaml
id: US877
requirement_ids:
  - R957
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在月班表草稿工作台中对已生成格子做受控调整，并能清楚看到哪些格子被改过、为什么改、以及如何恢复生成值，以便先完成草稿级人工修正，而不提前进入发布或生产保存。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "只有复制生成 copied 格子提供本地草稿编辑入口，异常、待确认和已过滤标注仍保持只读并走处理队列。"
  - "右侧抽屉详情页展示格子调整面板，支持班种选择、调整备注和恢复生成值。"
  - "编辑后月视图/周视图格子显示调整后的班种和已调整标记，toolbar/statusbar 展示已调整格子数量。"
  - "恢复生成值后移除本地调整标记和已调整计数。"
  - "页面明确该编辑仅为当前草稿预览，不写入生产数据。"
  - "本轮不新增发布、API、数据库、Excel 上传/导入、审批、权限、预测模型、标准人力、自动排班、导出或批量能力。"
status: "draft"
notes: "IM289 frontend local controlled-editing layer on top of IM288."
```

### US878 - 月班表草稿发布预览与覆盖派生

```yaml
id: US878
requirement_ids:
  - R958
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在调整草稿后看到草稿/发布预览状态、班种次数和半小时覆盖派生结果，以便在真正发布或接入缺口校验前先确认当前草稿的人员级安排口径。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "toolbar/statusbar 展示当前为草稿或发布预览状态，并展示班次数、半小时覆盖摘要。"
  - "用户可在本地切换生成发布预览和回到草稿，该动作不写入生产数据、不新增 API 或持久化。"
  - "派生班次数和半小时覆盖基于 edited effective cells，而不是只看原始生成结果。"
  - "右侧抽屉提供发布预览页，展示班种分布和半小时覆盖高峰。"
  - "编辑格子后状态回到草稿，重新生成发布预览前可继续修正。"
  - "本轮不新增真实发布、API、数据库、Excel 上传/导入、审批、权限、预测模型、标准人力、自动排班、导出或批量能力。"
status: "draft"
notes: "IM290 frontend local release-preview and derived coverage layer on top of IM289."
```

### US879 - 月班表 Forecast vs Arranged/Actual 缺口工作台

```yaml
id: US879
requirement_ids:
  - R959
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在调整月班表草稿后直接看到 Forecast、Arranged 和 Actual 的半小时人头缺口，并能从缺口行定位回具体周度排班格子，以便先在系统生成草稿内处理覆盖问题，而不提前进入预测模型或发布持久化。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "本地 fixture 提供 Forecast interval 和 Actual interval 样例，generator 在 view model 中暴露给前端。"
  - "缺口工作台的 Arranged 从 edited effective cells 派生，不只看原始生成结果。"
  - "右侧抽屉提供缺口队列，按日期 + 半小时点展示 Forecast、Arranged、Actual、Forecast-Arranged 和 Arranged-Actual 差异。"
  - "缺口行保留 related employee ids，并提供定位缺口动作回到周视图对应日期/员工格子。"
  - "编辑生成格子的班种后，缺口队列即时重算。"
  - "本轮不新增真实预测模型、标准人力、API、数据库、Excel 上传/导入、审批、权限、自动排班、导出或批量能力。"
status: "draft"
notes: "IM291 frontend local gap-preview layer on top of IM290."
```

### US880 - 月班表缺口处理闭环 v1

```yaml
id: US880
requirement_ids:
  - R960
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在缺口队列里直接看到当前半小时已覆盖的相关草稿格子，并能点击回格子详情调整班种，以便先用人工修正闭合缺口，而不提前进入自动推荐、审批或发布持久化。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "缺口行展示同日期、同半小时 slot 的相关覆盖格子，而不是全月候选人员或自动推荐。"
  - "点击相关覆盖格子后定位到周视图对应员工/日期，并切回既有格子详情页复用班种选择器。"
  - "相关覆盖格子显示员工、小组、班种、覆盖时段和已调整标记。"
  - "Arranged 为 0 的缺口展示当前无覆盖人员空态，只提供定位当天，不展示候选推荐。"
  - "调整 copied 草稿格子后，缺口队列继续基于 edited effective cells 即时重算。"
  - "本轮不新增自动推荐、自动排班、处理状态、真实发布持久化、API、数据库、Excel 上传/导入、审批、权限、导出或批量能力。"
status: "draft"
notes: "IM292 frontend local manual gap-resolution loop on top of IM291."
```

### US881 - 月班表 Draft/Published 持久化产品契约

```yaml
id: US881
requirement_ids:
  - R961
module: "BPO WFM 三条主线"
role: "排班师 / 小组长 / 一线员工"
story: "作为排班平台的产品负责人，我希望先定义月班表草稿、排定发布、未来生效、撤回、修订和下游可见的持久化产品契约，以便后续 DB/API 开发不会把发布状态、版本 lineage、格子 ID、审计和下游读取口径做错。"
task_type: "database-planning"
priority: "P0"
acceptance:
  - "契约明确一个 RosterVersion 覆盖一个 project + workplace + team + month，并定义 active draft、scheduled_published、current published 的唯一性。"
  - "契约明确状态机：draft、scheduled_published、published、superseded、voided、activation_failed。"
  - "契约明确 future effectiveAt 的合法范围、职场时区、自动生效、失败、重试和撤回规则。"
  - "契约明确 RosterVersion、RosterCell、VersionEvent、CellChangeLog、PublishedSnapshot 的业务字段草案。"
  - "契约明确硬错误、软风险、发布前差异摘要、编辑锁、作废草稿、版本 lineage 和格子 sourceCellId。"
  - "契约只预留请假/换班/异常申请引用关系，不实现审批、权限、通知、导出、Excel 导入、预测模型、标准人力或自动排班。"
  - "本轮不新增 DB 表、ORM、migration、API、前端发布动作或任何生产持久化实现。"
status: "draft"
notes: "IM293 docs-only persistence product contract after IM292 local roster gap-resolution loop."
```

### US882 - 月班表 Draft/Published 纯领域状态机与发布校验

```yaml
id: US882
requirement_ids:
  - R962
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望系统在真正持久化发布前先有可测试的月班表版本状态机、发布阻断、覆盖派生和编辑锁规则，以便后续保存、发布、生效、撤回和下游读取不会出现状态错乱或错误发布。"
task_type: "backend-mvp"
priority: "P0"
acceptance:
  - "纯领域模型支持 draft、scheduled_published、published、superseded、voided、activation_failed 的合法流转、future effectiveAt、activation、withdraw、retry 和 revision lineage。"
  - "完整覆盖 hard errors：无效班种、员工缺失/冻结/离职、不在项目/职场/团队快照、同员工同日班次重叠、必排日期/人员缺失、未确认再生成冲突、基准快照过期未确认。"
  - "soft risks 可随发布结果记录但不阻断发布。"
  - "从 roster cells 派生 Arranged 半小时覆盖和 publish diff coverage delta，不接 Forecast/Actual 数据源、预测模型或标准人力模型。"
  - "编辑锁规则以纯领域方式覆盖单编辑者、30 分钟过期、续期、自释放、管理员强制释放和非持有者只读。"
  - "本轮不新增 DB 表、ORM、migration、repository、API、前端发布动作、权限、审批、通知、导出、批量、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "draft"
notes: "IM294 backend pure domain slice after IM293 persistence contract."
```

## History Policy

- Do not append completed historical user stories here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
