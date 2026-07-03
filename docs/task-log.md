# Task Log - Compact Current Stub

本文件不再保存历史任务流水。历史任务日志在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧任务时使用 Git history。

## Current Log

### 2026-07-04

- task_id: `IM295`
- source_ids:
  - `R963`
- story_ids:
  - `US883`
- action: 月班表 Draft/Published 本地持久化闭环。
- status: `done`
- notes: 新增 roster 本地 migration、repository 和 application service，覆盖草稿保存读回、同员工同日多 sequence cell、发布校验、发布快照、班次数、半小时 Arranged 覆盖、scheduled activation、activation_failed、withdraw、revision draft、edit lock、active draft/current/upcoming 读取和唯一性保护；不新增 API、前端发布动作、权限、审批、通知、导出、批量、Excel 导入、Forecast/Actual 数据源、预测模型、标准人力、自动排班、生产公式、结算或计费规则。

### 2026-07-02

- task_id: `IM294`
- source_ids:
  - `R962`
- story_ids:
  - `US882`
- action: 月班表 Draft/Published 纯领域状态机与发布校验。
- status: `done`
- notes: 在后端纯领域模块中实现并测试 RosterVersion 发布生命周期、future effectiveAt 校验、activation failure/retry/withdraw/revision lineage、完整 hard-error 发布阻断、soft-risk 输出、Arranged 半小时覆盖派生、publish coverage diff 和纯编辑锁规则；本轮不新增 DB 表、ORM、migration、repository、API、前端发布动作、权限、审批、通知、导出、批量、Excel 导入、预测模型、标准人力、自动排班、生产公式、结算或收费因子。

- task_id: `IM293`
- source_ids:
  - `R961`
- story_ids:
  - `US881`
- action: 月班表 Draft/Published 持久化产品契约。
- status: `done`
- notes: 新增契约文档，定义 RosterVersion 状态机、active draft/current published/scheduled_published 唯一性、未来生效、自动生效失败、撤回、修订 lineage、稳定格子 ID、编辑锁、硬错误、软风险、发布快照和生命周期审计事件；本轮不新增 DB 表、ORM、migration、API、前端发布动作、权限、审批、通知、导出、Excel 导入、预测模型、标准人力或自动排班。

- task_id: `IM292`
- source_ids:
  - `R960`
- story_ids:
  - `US880`
- action: 月班表缺口处理闭环 v1。
- status: `done`
- notes: 在 `/roster-drafts` 缺口队列中展示同日期同半小时 slot 的相关覆盖格子，点击后回到周视图格子详情并复用班种选择器；Arranged 为 0 时展示当前无覆盖人员空态和定位当天；缺口继续基于 edited effective cells 重算；不新增自动推荐、自动排班、处理状态、真实发布持久化、API、数据库、Excel 导入、审批、权限、导出或批量。

- task_id: `IM291`
- source_ids:
  - `R959`
- story_ids:
  - `US879`
- action: 月班表 Forecast vs Arranged/Actual 缺口工作台。
- status: `done`
- notes: 在 `/roster-drafts` 增加本地 Forecast/Actual interval 样例，基于 edited effective cells 派生 Arranged，并在右侧抽屉提供缺口队列；缺口行展示 Forecast、Arranged、Actual 和差异，可定位回周视图格子；不进入真实预测模型、标准人力、API、数据库、Excel 导入、审批、权限、自动排班、导出或批量。

- task_id: `IM290`
- source_ids:
  - `R958`
- story_ids:
  - `US878`
- action: 月班表草稿发布预览与覆盖派生。
- status: `done`
- notes: 在 `/roster-drafts` 增加本地草稿/发布预览状态表达，并从 edited effective cells 派生班种次数和半小时覆盖；抽屉提供发布预览页查看班种分布和覆盖高峰；不进入真实发布持久化、API、数据库、Excel 导入、审批、权限、预测、标准人力、自动排班、导出或批量。

- task_id: `IM289`
- source_ids:
  - `R957`
- story_ids:
  - `US877`
- action: 月班表草稿格子受控编辑能力。
- status: `done`
- notes: 在 `/roster-drafts` 的 copied 生成格子上增加本地草稿编辑层，支持班种调整、调整备注、已调整标记/计数和恢复生成值；异常、待确认和已过滤标注仍只读；不进入发布、API、数据库、Excel 导入、审批、权限、预测、标准人力、自动排班、导出或批量。

### 2026-07-01

- task_id: `IM279`
- source_ids:
  - `R949`
- story_ids:
  - `US869`
- action: 排班师月班表字段映射与需求追踪。
- status: `done`
- notes: 根据真实 `202607班表.xlsx` 和 PM 澄清，沉淀排班师主流程、Excel 初始化边界、系统内生成月班表、人员变动复制规则、Forecast vs Arranged/Actual 人头差异口径、小组长/一线后续需求和不做项。

- task_id: `IM280`
- source_ids: []
- story_ids: []
- action: 文档历史清理第一刀。
- status: `done`
- notes: 删除无引用历史设计/计划文件并清理未跟踪本地草稿，commit `96fadff`。

- task_id: `IM281`
- source_ids: []
- story_ids: []
- action: 主追踪链瘦身。
- status: `done`
- notes: 将历史堆积追踪文件压缩为 compact current stubs；历史细节通过 Git history 查询。压缩范围包括 backlog、raw requirements、user stories、audit report、task log、branch log、project state 和 trace index。

- task_id: `IM282`
- source_ids:
  - `R950`
- story_ids:
  - `US870`
- action: 班种定义与月班表生成底座产品契约。
- status: `done`
- notes: 沉淀人员级日班种草稿、班种工作时段展开、稳定班种复制、待排队列、draft -> published 状态流转和 Primary/Actual 分层；不进入预测模型、标准人力、自动排班、审批、权限、外部集成或数据库实现。

- task_id: `IM286`
- source_ids:
  - `R954`
- story_ids:
  - `US874`
- action: 月班表草稿排班工作台重构。
- status: `done`
- notes: 基于 Homebase 主参考、Deputy / When I Work 交叉校验，将 `/roster-drafts` 从结果报表页改为排班师工作台；保留 IM285 本地生成器，不进入 API、数据库、Excel 导入、保存发布、审批、权限、预测、标准人力或自动排班。浏览器 smoke 已确认月度扫盘、周度处理、格子详情和队列定位。

- task_id: `IM287`
- source_ids:
  - `R955`
- story_ids:
  - `US875`
- action: 全站导航瘦身与 icon rail 对齐。
- status: `done`
- notes: 将全站导航底座改为默认 64px icon rail、点击展开 240px、收起态隐藏分组标题、32px icon 栅格居中、48px header 和站内展开/收起偏好保持；浏览器验收覆盖 `/dashboard`、`/roster-drafts`、`/schedule-plans`。不修改排班业务内容，不新增 API、数据库、权限、审批、导出或批量能力。

- task_id: `IM288`
- source_ids:
  - `R956`
- story_ids:
  - `US876`
- action: 月班表草稿全屏排班工作台体验。
- status: `done`
- notes: 将 `/roster-drafts` 推进为全屏、网格优先的排班师工作台：移除解释性页面 header，默认月视图扫盘，月/周切换留在工作台内，格子详情和异常/待排/过滤标注队列进入右侧抽屉；不新增编辑、保存发布、API、数据库、Excel 导入、审批、权限、预测、标准人力或自动排班。

- task_id: `IM283`
- source_ids:
  - `R951`
- story_ids:
  - `US871`
- action: ShiftType 班种解析与半小时覆盖展开。
- status: `done`
- notes: 新增后端纯领域服务解析可配置班种工作时段并展开半小时覆盖，覆盖 Z1、A5、T1、T4、N、A12 和坏班种异常清单；不新增 API、数据库、migration、Excel 上传、UI、预测模型、标准人力或自动排班。

- task_id: `IM284`
- source_ids:
  - `R952`
- story_ids:
  - `US872`
- action: 人员级月班表草稿纯领域模型。
- status: `done`
- notes: 新增后端纯领域模型表达 RosterVersion、RosterAssignment、PendingRosterEmployee、多记录同日、shift-only 覆盖、shift 重叠校验、引用快照校验和 draft-only 可编辑；不新增 API、数据库、migration、复制生成、Excel 上传、UI、预测模型、标准人力或自动排班。

- task_id: `IM285`
- source_ids:
  - `R953`
- story_ids:
  - `US873`
- action: 月班表草稿生成演示闭环。
- status: `done`
- notes: 新增 `/roster-drafts` 前端演示闭环、本地可配置 fixture 和 TypeScript 生成服务，支持目标月份选择、上一周同星期稳定班种复制、月视图、周视图、待排人员、只读异常清单、已过滤非班务标注和摘要；不新增 API、数据库、Excel 上传/导入、保存发布、预测模型、标准人力或自动补班。
