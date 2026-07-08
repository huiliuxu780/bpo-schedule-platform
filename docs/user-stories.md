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

### US883 - 月班表 Draft/Published 本地持久化闭环

```yaml
id: US883
requirement_ids:
  - R963
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望系统能把月班表草稿、排定发布、正式发布、撤回、修订、发布快照和编辑锁稳定保存到本地数据库，并按 active draft/current/upcoming 口径读回，以便后续 API 和前端发布动作接入时不会丢状态、丢审计或读错版本。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "Alembic migration 创建 RosterVersion、RosterCell、RosterVersionEvent、RosterCellChangeLog、PublishedSnapshot、EditLock 所需本地表。"
  - "Repository/service 支持 draft 保存读回、发布校验、排定发布、到点生效、撤回、修订草稿、active draft/current/upcoming 读取。"
  - "PublishedSnapshot 在发布时固化班次数、半小时覆盖和发布摘要引用，不依赖未来规则实时重算历史结果。"
  - "service 层和 DB 层共同保证同 scope/month 只有一个 active draft、current published、scheduled published。"
  - "EditLock 真实落库并保护 saveDraft，覆盖 acquire、renew、release、forceRelease 和非持有者只读。"
  - "RosterCell 支持同员工同日多 sequence 记录，shift/leave/training/meeting/annotation 都能保存，coverage 只统计 shift。"
  - "后端测试覆盖核心闭环和关键失败路径：唯一性、snapshot 固化、activation、withdraw、revision、edit lock、hard error、soft risk、migration head。"
  - "本轮不新增 API route、前端发布动作、权限、审批、通知、导出、批量、Excel 导入、Forecast/Actual 数据源、预测模型、标准人力、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM295 database-persistence slice after IM294 pure domain rules."
```

### US884 - 排班师月班表发布工作台 v1

```yaml
id: US884
requirement_ids:
  - R964
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在月班表工作台里把当前系统生成并已人工调整的草稿直接发布为当前正式班表，并在同一界面读回已发布快照，以便我能确认发布结果、软风险、班次数和半小时覆盖，而不是只看到本地预览或后端持久化能力。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "`/roster-drafts?month=2026-08` 使用当前本地草稿样例作为验收 fixture，排班师可从工作台触发发布当前草稿。"
  - "页面通过本地 API 访问 IM295 service；前端不得直接调用 service 或绕过 API。"
  - "发布前先 acquire/check edit lock；被其他 actor 锁定时页面只读且发布被阻断，当前 actor 可释放自己的锁。"
  - "hard errors 阻断发布并在工作台展示；soft risks 不阻断，但必须进入发布预览和发布后快照。"
  - "发布成功后同一右侧抽屉或发布预览区域切换为已发布快照，读回 current published 和 snapshot。"
  - "已发布快照固化并展示班次数、半小时 Arranged 覆盖、soft risk 摘要和 diff 摘要，不依赖前端重新实时推导历史结果。"
  - "当前草稿发布后不可继续编辑；工作台默认展示已发布快照，并提供未来 create revision draft 的入口占位但不实现完整修订编辑。"
  - "浏览器验收覆盖发布前草稿、锁定只读、发布阻断/成功、发布后快照和刷新读回。"
  - "本轮不新增预测模型、标准人力模型、Excel 导入、权限、审批、通知、导出、批量、自动排班、scheduled publish UI、完整 revision editing、Forecast vs published persistence gap、生产公式、结算或计费规则。"
status: "done"
notes: "IM296 completed local API + frontend scheduler workbench publish loop after IM295 local persistence service."
```

### US885 - 已发布月班表修订草稿闭环 v1

```yaml
id: US885
requirement_ids:
  - R965
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在正式班表发布后还能基于当前正式版创建修订草稿，只调整已有格子的班种和备注，并在确认后重新发布替换当前正式版，以便处理发布后发现的小范围排班问题，同时不影响一线继续查看当前有效班表。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "创建修订草稿时 current published 保持生效；一线/小组长概念上的当前正式班表不被草稿态覆盖。"
  - "修订草稿从 current published 创建，保留 parent_version_id / previous-version source。"
  - "修订草稿只允许复用现有格子受控编辑修改班种和备注，不新增/删除人员日格。"
  - "重新发布修订草稿时立即替换 current published，上一正式版进入被替换口径。"
  - "工作台展示当前正式版、上一版来源和本次修改摘要，不新增完整版本历史页。"
  - "本轮不新增 scheduled publish UI、future effective time、批量修订、审批、权限、通知、导出、批量、Excel 导入、预测模型、标准人力、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM297 revision draft loop after IM296 publish workbench."
```

### US886 - Published Forecast vs Arranged/Actual 缺口闭环 v1

```yaml
id: US886
requirement_ids:
  - R966
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望正式班表发布后能看到基于 current published 的 Forecast vs Arranged/Actual 缺口，并从缺口定位进入既有修订与重新发布流程，以便我能发现正式班表问题并闭环修正，而不是只看到一个缺口报表。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "存在 current published 时，`/roster-drafts?month=2026-08` 展示正式班表缺口队列。"
  - "缺口行展示日期、半小时、Forecast、Arranged、Actual、缺口类型和来源口径。"
  - "Arranged 从 current published cells/snapshot 派生；未发布草稿或修订草稿不能污染 current published 缺口。"
  - "点击缺口行只定位相关日期/人员格子，不自动创建修订、不自动推荐处理动作。"
  - "定位上下文能进入既有创建修订草稿、受控编辑和重新发布修订流程。"
  - "重新发布修订后，缺口队列基于新的 current published 刷新。"
  - "没有 current published 时，工作台提示先发布正式班表。"
  - "本轮不新增真实预测模型、标准人力、Excel 导入、权限审批、导出批量、自动排班、新缺口页、完整版本历史页、生产公式、结算或计费规则。"
status: "done"
notes: "IM298 published gap closed loop after IM297 revision workbench."
```

### US887 - 下游正式班表查看 v1

```yaml
id: US887
requirement_ids:
  - R967
module: "BPO WFM 三条主线"
role: "小组长 / 一线"
story: "作为小组长或一线员工，我希望在排班师发布正式班表后，通过独立入口只读查看当前正式班表的月视图、周视图和格子详情，以便我能确认团队或自己的班次，而不是进入排班师草稿工作台。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "左侧导航出现独立业务入口 `正式班表`，路由为 `/published-roster`。"
  - "`/published-roster?month=2026-08` 只读取 current published API；没有正式版时显示先发布正式班表的空态。"
  - "小组长视角使用本地固定团队样例，展示团队月视图、周视图和只读格子详情。"
  - "一线视角使用本地人员切换器，展示所选人员自己的月视图、周视图和只读格子详情。"
  - "格子详情展示人员、日期、班次、时间、来源正式版和轻风险提示。"
  - "请假、换班、异常修复入口可见但 disabled，不提交、不写数据、不进入审批。"
  - "页面不展示 draft、revision draft 或 upcoming，不暴露 internal published/current 英文口径。"
  - "本轮不新增认证、权限、组织架构、审批、申请提交、导出、批量、预测模型、标准人力、Excel 导入、新持久化、生产公式、结算或计费规则。"
status: "done"
notes: "IM299 downstream read-only formal roster viewer after IM298 formal gap loop."
```

### US888 - 正式班表月历概览 + 周明细联动

```yaml
id: US888
requirement_ids:
  - R968
module: "BPO WFM 三条主线"
role: "小组长 / 一线"
story: "作为小组长或一线员工，我希望正式班表的月视图像月历一样扫全月，再点日期进入对应周明细，以便我先判断哪几天需要关注，再查看人员级班表，而不是在一个超长横向表里找日期。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "`/published-roster?month=2026-08` 的月视图显示 7 列月历概览，不再显示人员 x 31 天横向网格。"
  - "小组长月历日格展示团队上班数、休息数、主要班种和调整提示。"
  - "一线月历日格只展示所选人员自己的班种和时间，不展示团队汇总。"
  - "点击月历日期切到对应周明细；周明细继续显示人员 x 7 天格子并可打开只读详情。"
  - "页面仍只读取当前正式班表，不展示 draft、revision draft 或 upcoming，不暴露 internal published/current 英文口径。"
  - "本轮不新增请假/换班/异常修复提交、审批、认证、权限、导出、批量、预测模型、标准人力、Excel 导入、后端 API、数据库、新持久化、生产公式、结算或计费规则。"
status: "done"
notes: "IM300 downstream formal roster month calendar correction after IM299 viewer."
```

### US889 - 正式班表变更申请边界 v1

```yaml
id: US889
requirement_ids:
  - R969
module: "BPO WFM 三条主线"
role: "小组长 / 一线"
story: "作为小组长或一线员工，我希望在正式班表格子详情里点击请假、换班或异常修复时，能看到该路径需要准备什么信息以及后续由谁处理，以便我知道看到班表问题后该走哪条路径，而不是只看到不可点击按钮。"
task_type: "backend-vertical"
priority: "P0"
acceptance:
  - "`/published-roster?month=2026-08` 格子详情中的请假、换班、异常修复动作可点击并切换本地边界面板。"
  - "请假边界展示请假类型、开始时间、结束时间、原因说明，并标记小组长初核。"
  - "换班边界展示目标人员、目标日期、目标班次、双方确认情况，并标记小组长协调。"
  - "异常修复边界展示异常类型、实际发生时间、修复说明、证明材料，并标记排班师处理。"
  - "边界面板明确暂不写入系统；页面不出现提交申请、提交审批或审批状态。"
  - "本轮不新增真实申请提交、审批、认证、权限、后端 API、数据库、新持久化、通知、导出、批量、预测模型、标准人力、Excel 导入、生产公式、结算或计费规则。"
status: "done"
notes: "IM301 formal-roster request boundary shell after IM300 calendar month correction."
```

### US890 - 正式班表下游处理意图闭环 v1

```yaml
id: US890
requirement_ids:
  - R970
module: "BPO WFM 三条主线"
role: "小组长 / 一线 / 排班师"
story: "作为小组长或一线，我希望在正式班表格子上登记请假、换班、异常修复或现场调配的处理意图；作为排班师，我希望这些意图进入我的月班表工作台队列并能定位到格子、进入修订处理、最后关闭，以便正式班表发布后的现场问题能形成一个可追踪的本地处理闭环。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "`/published-roster?month=2026-08` 的格子详情动作可登记本地处理意图，成功后显示进入排班师本地处理队列。"
  - "处理意图持久化到本地 DB，并绑定 business month、project、workplace、team、current published version、roster cell、employee、date、action、requester role 和 note。"
  - "`/roster-drafts?month=2026-08` 展示下游处理队列，只列出 open 意图。"
  - "队列项能定位到相关员工/日期格子，不自动推荐、不自动排班。"
  - "排班师可从队列上下文进入既有创建修订草稿、受控编辑和重新发布修订流程。"
  - "队列项可关闭，并记录 resolver、resolved_at 和 linked revision version。"
  - "本轮不新增真实审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM302 local DB-backed downstream request intent loop after IM301 boundary shell."
```

### US891 - 正式班表下游问题管理闭环 v1

```yaml
id: US891
requirement_ids:
  - R971
module: "BPO WFM 三条主线"
role: "小组长 / 一线 / 排班师"
story: "作为小组长或一线，我希望登记后的正式班表问题能看到处理中和已处理状态；作为排班师，我希望这些下游问题进入独立工作区并能筛选、定位、记录处理说明后关闭，以便发布后的现场问题不只是一次性登记，而是能被追踪到处理结果。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "`/published-roster?month=2026-08` 保持正式班表主月/周视图干净，不把问题队列塞进主网格。"
  - "正式班表格子详情显示该格子的 open 问题提示；重复登记同格 open 问题时提示但仍允许登记。"
  - "正式班表提供独立状态抽屉：一线看本人相关问题，小组长看 G1 团队问题；open 与 resolved 都可查看。"
  - "resolved 问题展示处理时间、关联修订版本和排班师处理说明。"
  - "`/roster-drafts?month=2026-08` 提供独立下游问题工作区，不混入缺口/异常队列。"
  - "排班师可按状态、动作、人员筛选问题，查看详情，定位正式班表格子。"
  - "排班师关闭问题时必须记录 `scheduler_resolution_note`，并继续绑定 linked revision version。"
  - "后端支持轻量详情、汇总和列表筛选 API；不新增审批流 API。"
  - "本轮不新增真实审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM303 downstream issue management loop after IM302 local request intent persistence."
```

### US892 - 正式班表变更治理闭环 v1

```yaml
id: US892
requirement_ids:
  - R972
module: "BPO WFM 三条主线"
role: "排班师 / 小组长 / 一线"
story: "作为排班师，我希望正式班表每次修订发布后能看到版本链、人员日期差异和关联下游问题；作为小组长或一线，我希望已处理问题能回看到具体修订前后变化和处理说明，以便正式班表发布后的变更不是散落在问题队列里，而是有一个可追溯的治理入口。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "`/roster-change-governance?month=2026-08` 是计划与排班下的独立入口，不塞进下游问题抽屉。"
  - "页面默认展示当前正式班表发布链，按发布时间倒序列出版本、发布时间、变更格子数、关联问题数。"
  - "选择修订版本后，按人员-日期展示修订前/修订后差异，差异以 `source_cell_id` 对齐父版本同格。"
  - "已关闭下游问题按 `linked_revision_version_id` 和 `roster_cell_id/source_cell_id` 关联到差异行。"
  - "差异行展示问题编号、动作、登记人、关闭时间和 `scheduler_resolution_note`。"
  - "小组长/一线从已处理问题能跳转到对应修订和差异行；一线只看本人或本人发起的相关行。"
  - "聚合 API 运行时派生差异，不新增 diff 持久表。"
  - "本轮不新增审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM304 post-publish formal roster change-governance loop after IM303 downstream issue management."
```

### US893 - 班表变更中心事件化与确认闭环

```yaml
id: US893
requirement_ids:
  - R973
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望正式班表发布后看到的是待处理的员工班次变更事件，而不是版本 diff；我可以打开某一条变更查看前后班次、来源和关联问题，并用内部备注确认这条变更已经核对，以便发布后变更能形成可操作、可追溯的处理闭环。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "`/roster-change-governance?month=2026-08` 页面标题和导航为 `班表变更中心`。"
  - "默认视图为 `待处理`，主列表一行代表一个员工某一天的一次班次变更事件。"
  - "页面提供 `待处理 / 全部变更 / 按员工` 三个分组。"
  - "点击事件行打开右侧详情抽屉，抽屉展示前后班次、来源分类、关联问题和内部确认区。"
  - "排班师可对单条事件确认并填写内部备注，确认记录本地持久化。"
  - "确认后事件离开 `待处理`，并在 `全部变更` 中显示为 `已确认`。"
  - "正常业务 UI 不展示 `source_cell_id`、raw version id、revision/diff 工程术语。"
  - "本轮不新增审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM305 completed the event-first roster change center with local single-event confirmation and internal scheduler note persistence."
```

### US894 - 班务变更申请与月班表调整承接

```yaml
id: US894
requirement_ids:
  - R974
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望看到的是班长和一线提交的班务变更申请，而不是发布后的版本差异；我可以处理请假、换班、异常修复和现场调配申请，并在同意后直接进入月班表调整定位员工和日期，以便申请处理和班表调整形成一个可演示闭环。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/roster-change-governance?month=2026-08` 页面标题和导航显示为 `班务变更申请`。"
  - "页面第一屏展示 `待处理 / 跟进中 / 已处理 / 按员工`，主对象是一条班务变更申请。"
  - "待处理详情抽屉展示当前班次、申请内容、提示、处理说明，以及 `同意 / 拒绝 / 现场跟进`。"
  - "同意后进入 `跟进中`，下一步为 `去调整班表`，并展示月班表调整承接段。"
  - "月班表调整承接段包含当前处理申请、员工日期定位、`返回申请`、`保存调整`。"
  - "保存调整后申请进入 `已处理`，并展示处理结果和班表结果。"
  - "正常业务 UI 不展示版本时间线、差异行、`source_cell_id`、revision 或工程差异作为页面主对象。"
  - "本轮不新增审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM306 request-first frontend product prototype and wording correction over the existing route."
```

### US895 - 班务变更申请真实三态处理闭环

```yaml
id: US895
requirement_ids:
  - R975
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望 `班务变更申请` 读取真实下游申请，并能把申请从待处理推进到跟进中或已处理，以便请假、换班、异常修复和现场调配不是静态样例，而是可演示、可追踪的本地处理闭环。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "`/roster-change-governance?month=2026-08` 读取真实 `roster_request_intents`，不再以静态样例作为主数据。"
  - "页面展示 `待处理 / 跟进中 / 已处理 / 按员工`，状态来自 `open / in_progress / resolved`。"
  - "动作按钮使用短文案 `同意 / 拒绝 / 跟进`。"
  - "同意或跟进会把申请写为 `in_progress`。"
  - "拒绝会把申请写为 `resolved` + `rejected`，不要求 revision。"
  - "保存调整会把申请写为 `resolved` + `adjusted`，并保留班表结果锚点。"
  - "已处理结果用短标签 `已调整 / 已拒绝 / 已关闭`，详情再解释含义。"
  - "本轮不新增真实审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM307 real local three-state request handling over existing roster request intents."
```

### US896 - 班务变更申请月班表调整承接

```yaml
id: US896
requirement_ids:
  - R976
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望在 `班务变更申请` 同页看到申请队列、当前申请对应班表格子和处理面板；我同意申请后可以只调整当前员工/日期格，保存为 `已调整` 并继续处理下一条，以便申请处理和班表调整成为一个连续、可演示的工作流。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "`/roster-change-governance?month=2026-08` 使用同页三栏：申请队列、月班表调整区、申请与处理。"
  - "选中申请后，中栏定位当前申请对应员工/日期格。"
  - "点 `同意` 后进入当前格快速调整。"
  - "`调整为` 使用固定班次下拉。"
  - "保存前显示轻量影响提示。"
  - "保存调整后申请显示 `已调整`，保留 revision 锚点，并自动选中下一条待处理申请。"
  - "本轮不新增换班双人联动、完整工时/技能/覆盖校验、完整月班表编辑器、审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。"
status: "done"
notes: "IM308 delivered the same-page adjustment handoff: request queue, current-cell adjustment, handling panel, revision-anchor save, and next-request continuity."
```

### US897 - 班务申请中心结果追踪

```yaml
id: US897
requirement_ids:
  - R977
module: "BPO WFM 三条主线"
role: "一线员工 / 班长"
story: "作为一线员工或班长，我希望有一个独立的班务申请中心，可以查看我的申请或团队申请当前状态、处理说明和最终班表结果，并能跳回正式月班表对应位置，以便我不用依赖排班师口头反馈就能知道申请是否已经落到班表。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "新增 `/duty-requests?month=2026-08` 页面，标题和导航为 `班务申请中心`。"
  - "页面提供 `我的申请 / 团队申请` 两个角色视图。"
  - "状态筛选使用 `待处理 / 跟进中 / 已调整 / 已拒绝 / 已关闭`。"
  - "首屏为左侧申请列表 + 右侧申请详情。"
  - "申请详情展示原班表、申请内容、处理说明、最终班表结果、处理人和处理时间。"
  - "`查看月班表` 可跳回 `/published-roster` 并携带月份、员工和格子参数。"
  - "页面不提供新建申请、催办、撤回、审批、通知、评论或双人换班联动。"
  - "正常业务 UI 不展示 revision、publish、diff 等工程术语。"
status: "done"
notes: "IM309 delivered the downstream read-only request result center over existing roster request list API and formal-roster link."
```

## History Policy

- Do not append completed historical user stories here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
