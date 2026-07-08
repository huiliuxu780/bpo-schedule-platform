# Task Log - Compact Current Stub

本文件不再保存历史任务流水。历史任务日志在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧任务时使用 Git history。

## Current Log

### 2026-07-07

- task_id: `IM306`
- source_ids:
  - `R974`
- story_ids:
  - `US894`
- action: 班务变更申请与月班表调整承接前端原型。
- status: `done`
- notes: `/roster-change-governance?month=2026-08` 的可见页面和导航从 `班表变更中心` 改为 `班务变更申请`；页面主对象改为班长/一线提交的请假、换班、异常修复、现场调配申请；提供 `待处理 / 跟进中 / 已处理 / 按员工`、右侧详情抽屉、`同意 / 拒绝 / 现场跟进`、`去调整班表`、`保存调整`、`返回申请`、`处理下一条`。新增产品基线 `docs/superpowers/specs/2026-07-07-duty-change-request-design.md`。本轮未新增后端持久化、审批、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。
- verification: red/green `node --test scripts/tests/roster-change-governance-structure.test.mjs`；`npm run typecheck` 通过；final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过。

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

- task_id: `IM296`
- source_ids:
  - `R964`
- story_ids:
  - `US884`
- action: 排班师月班表发布工作台 v1 Gate。
- status: `done`
- notes: 完成排班师月班表发布工作台 v1：`/roster-drafts?month=2026-08` 通过本地 API 发布当前系统生成/本地调整草稿，读回 current published snapshot，展示发布后班次数、半小时 Arranged 覆盖、soft risks、diff summary，并在已发布版本上进入只读态。锁被其他排班师持有时 API 返回阻断，当前 actor 可释放自己的锁。未进入预测模型、标准人力、Excel 导入、权限审批、导出批量、自动排班、完整修订编辑或 Forecast vs published persistence gap。
- focused verification: `.venv/bin/python -m unittest backend.tests.test_roster_publish_api backend.tests.test_roster_service` 通过 9 tests，含并发 schema 初始化回归；`node --test scripts/tests/roster-draft-workbench-structure.test.mjs scripts/tests/roster-draft-generation-model.test.mjs` 通过 20 tests；`npm run typecheck` 通过。
- browser smoke: local backend `127.0.0.1:8001` + frontend `localhost:3005`；发布前 `发布当前草稿` 可用；点击后出现 `已发布快照`、`当前正式班表`、`班次数`、`半小时覆盖`，发布按钮 disabled；切到格子详情后显示 `当前版本只读` 和修订草稿提示。

- task_id: `IM297`
- source_ids:
  - `R965`
- story_ids:
  - `US885`
- action: 已发布月班表修订草稿闭环 v1 Gate。
- status: `ready`
- notes: 将下一步开发收束为一个排班师可演示闭环：current published 保持生效，排班师从当前正式版创建修订草稿，复用现有格子受控编辑修改班种/备注，立即重新发布替换 current published，并在同一工作台展示上一版来源和本次修改摘要。明确不进入 scheduled publish UI、future effective time、完整版本历史、预测模型、标准人力、Excel 导入、权限审批、导出批量、自动排班、生产公式、结算或计费规则。

- task_id: `IM297`
- source_ids:
  - `R965`
- story_ids:
  - `US885`
- action: 已发布月班表修订草稿闭环 v1 Implementation。
- status: `done`
- notes: 完成排班师可演示闭环：`/roster-drafts?month=2026-08` 可从 current published 创建修订草稿，current published 在修订期间保持生效；修订草稿复用现有格子受控编辑能力，仅修改已有 copied 格子的班种/备注；重新发布修订后立即替换 current published，并保留 parent/supersedes lineage、source_cell_id、上一版来源和本次修改摘要。未进入 scheduled publish UI、future effective time、完整版本历史、预测模型、标准人力、Excel 导入、权限审批、导出批量、自动排班、生产公式、结算或计费规则。
- focused verification: `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_revision_api backend.tests.test_roster_publish_api backend.tests.test_roster_drafts backend.tests.test_roster_persistence` 通过 28 tests；`node --test scripts/tests/roster-draft-workbench-structure.test.mjs` 通过 15 tests；`npm run typecheck` 通过。
- browser smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003`；已发布态显示 `创建修订草稿`；创建后进入 `修订草稿`，显示 `重新发布修订`、`上一版来源`、`本次修改摘要`，且不出现 `版本历史页` 或 `未来生效`。
- final verification: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state check、870 Node tests（869 pass / 1 skip）、lint、typecheck、Next build、271 backend tests 和 project Harness check。

- task_id: `IM298`
- source_ids:
  - `R966`
- story_ids:
  - `US886`
- action: Published Forecast vs Arranged/Actual 缺口闭环 v1 Gate。
- status: `ready`
- notes: 将下一步收束为一个正式班表缺口发现到修订重发布的排班师闭环：current published 存在时展示基于正式版的 Forecast/Arranged/Actual 缺口；缺口定位相关日期/人员格子；定位上下文进入既有修订草稿、受控编辑和重新发布流程；重新发布后缺口刷新。未进入真实预测模型、标准人力、Excel 导入、权限审批、导出批量、自动推荐、自动排班、新缺口页、完整版本历史页、生产公式、结算或计费规则。

- task_id: `IM298`
- source_ids:
  - `R966`
- story_ids:
  - `US886`
- action: Published Forecast vs Arranged/Actual 缺口闭环 v1 Implementation。
- status: `done`
- notes: 完成正式班表缺口闭环：`/roster-drafts?month=2026-08` 在 current published 存在后显示“正式班表缺口”，Forecast/Actual 仍为本地样例口径，Arranged 从 current published cells/snapshot 派生；缺口可定位到周视图相关人员/日期；定位上下文保留创建修订草稿、受控编辑和重新发布修订入口；重发布后缺口基于新的当前正式版刷新。未进入真实预测模型、标准人力、Excel 导入、权限审批、导出批量、自动推荐、自动排班、新缺口页、完整版本历史页、生产公式、结算或计费规则。
- focused verification: red `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` 失败在缺少 `publishedGapRows`；red `.venv/bin/python -m unittest backend.tests.test_roster_publish_api` 失败在 missing current-published response 缺少 `cells`; green 后两项均通过，且 `npm run typecheck` 通过。
- browser smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003` with `NEXT_PUBLIC_BPO_API_BASE_URL=http://127.0.0.1:8001`；发布后显示已发布快照和创建修订入口；缺口 tab 显示“正式班表缺口”、Forecast/Arranged/Actual、Arranged 从正式版派生且无 `current published` 文案泄漏；定位缺口切到周度处理相关人员/日期；创建修订草稿后出现上一版来源/本次修改摘要；重新发布后回到已发布态，缺口仍按正式版刷新。

- task_id: `IM299`
- source_ids:
  - `R967`
- story_ids:
  - `US887`
- action: 下游正式班表查看 v1 Implementation。
- status: `done`
- notes: 完成下游正式班表消费闭环：新增 `正式班表` 导航和 `/published-roster?month=2026-08`；页面只读取 current published API，不读取 active draft、revision draft 或 upcoming；小组长使用本地固定 G1 团队查看团队月/周正式班表；一线使用本地人员切换器查看个人月/周正式班表；格子详情为只读，展示正式版本、班次、时间和提示；请假、换班、异常修复只作为 disabled 入口占位。未新增认证、权限、组织架构、审批、申请提交、导出、批量、预测模型、标准人力、Excel 导入、新持久化、生产公式、结算或计费规则。
- focused verification: red `node --test scripts/tests/published-roster-view-model.test.mjs` 失败在缺少 `lib/published-roster-view.ts`；red `node --test scripts/tests/published-roster-viewer-structure.test.mjs` 失败在缺少 `/published-roster` 页面、viewer 和导航；green 后 `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` 通过 24 tests；`npm run typecheck`、`git diff --check`、`bash scripts/check-state.sh --strict` 均通过。
- browser smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003`；API 已有 2026-08 正式版；`/published-roster?month=2026-08` 展示正式班表入口、G1 小组长团队视图、一线个人视图；一线周视图只显示 `EMP-001` 一行和 7 天；格子详情显示只读详情、A5、正式版号，且请假/换班/异常修复按钮全部 disabled；页面未出现 `current published`、`Published Roster` 或 `revision draft`。

- task_id: `IM300`
- source_ids:
  - `R968`
- story_ids:
  - `US888`
- action: 正式班表月历概览 + 周明细联动 Implementation。
- status: `done`
- notes: 完成下游正式班表月视图体验修正：`/published-roster?month=2026-08` 的月视图从人员 x 31 天超长横向网格改为 7 列月历概览；小组长日格展示团队上班/休息/主要班种/调整提示；一线日格只展示所选人员自己的班种和时间；点击月历日期切到对应周明细，周明细保留人员 x 7 天正式班表和只读详情抽屉。未新增请假/换班/异常修复提交、审批、认证、权限、导出、批量、预测模型、标准人力、Excel 导入、后端 API、数据库、新持久化、生产公式、结算或计费规则。
- focused verification: red `node --test scripts/tests/published-roster-view-model.test.mjs` 失败在缺少 `monthCalendarDays`；red `node --test scripts/tests/published-roster-viewer-structure.test.mjs` 失败在缺少月历 slot 和仍使用月表网格；green 后 `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` 通过 27 tests；`npm run typecheck`、`git diff --check` 均通过。
- browser smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003`；组长月历存在 31 个日期按钮且没有旧人员全月横向网格；点击 `2026-08-03` 切到 `1日-7日` 周明细并显示 G1 两个人和 8 月 3 日格子；一线月历只显示所选人员 `A5` 和一次 `09:00-14:30`，不显示团队汇总；页面未出现 `current published`、`Published Roster` 或 `revision draft`。
- final verification: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state check、882 Node tests（881 pass / 1 skip）、shadcn convention check、lint、typecheck、Next build、272 backend tests 和 project Harness check。

- task_id: `IM301`
- source_ids:
  - `R969`
- story_ids:
  - `US889`
- action: 正式班表变更申请边界 v1 Implementation。
- status: `done`
- notes: 完成下游正式班表申请边界壳：`/published-roster?month=2026-08` 格子详情中的请假、换班、异常修复动作可点击并切换本地边界面板；三类面板分别展示所需信息、后续处理角色和暂不写入系统边界。未新增真实申请提交、审批、认证、权限、后端 API、数据库、新持久化、通知、导出、批量、预测模型、标准人力、Excel 导入、生产公式、结算或计费规则。
- focused verification: red `node --test scripts/tests/published-roster-view-model.test.mjs` 失败在缺少 `ownerLabel` / `submissionState` / `requiredFields`；red `node --test scripts/tests/published-roster-viewer-structure.test.mjs` 失败在缺少 `RequestBoundaryPanel`；green 后 `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` 通过 28 tests；`npm run typecheck`、`git diff --check` 均通过。
- browser smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003`；打开 `/published-roster?month=2026-08`，点击 `2026-08-03` 与 `EMP-001` 周明细格子，详情内请假、换班、异常修复分别切换到对应边界面板；面板展示小组长初核/小组长协调/排班师处理与各自所需字段；页面未出现 `提交申请`、`提交审批` 或 `current published`。
- final verification: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state check、883 Node tests（882 pass / 1 skip）、shadcn convention check、lint、typecheck、Next build、272 backend tests 和 project Harness check。

- task_id: `IM302`
- source_ids:
  - `R970`
- story_ids:
  - `US890`
- action: 正式班表下游处理意图闭环 v1 Implementation。
- status: `done`
- notes: 完成一个本地 DB-backed 的下游处理闭环：小组长/一线在 `/published-roster?month=2026-08` 正式班表格子详情登记请假、换班、异常修复或现场调配处理意图；处理意图绑定 current published version、roster cell、employee、date、role 和 note；排班师在 `/roster-drafts?month=2026-08` 下游处理队列查看 open 意图、定位到人员/日期格子，并通过既有修订草稿/重新发布上下文关闭意图。未新增真实审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。
- focused verification: red `.venv/bin/python -m unittest backend.tests.test_roster_service` 失败在缺少 `create_request_intent`；red `.venv/bin/python -m unittest backend.tests.test_roster_publish_api` 失败在缺少 request-intent API；red `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` 失败在缺少 intent-ready UI 和下游队列；green 后 29 Node tests、`npm run typecheck`、16 backend tests、`git diff --check` 均通过。
- runtime smoke: local backend `127.0.0.1:8001` + frontend `127.0.0.1:3003`；正式班表页读到 `ROSTER-2026-08-DRAFT-G1-SH`，月历显示 8 月 3 日 `A5/REST`，周明细打开 Alice Chen 的 `A5 09:00-14:30` 只读格子和 `登记处理意图` 面板；浏览器插件随后超时，使用同一后端 API 完成意图创建、修订草稿创建和 resolve 闭环：`REQ-IM302-BROWSER-SMOKE` 从 `open` 变为 `resolved` 并挂到 `ROSTER-2026-08-REV-IM302-SMOKE`。
- final verification: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state check、884 Node tests（883 pass / 1 skip）、shadcn convention check、lint、typecheck、Next build、275 backend tests 和 project Harness check。

- task_id: `IM303`
- source_ids:
  - `R971`
- story_ids:
  - `US891`
- action: 正式班表下游问题管理闭环 v1 Implementation。
- status: `done`
- notes: 完成 IM302 之上的本地问题管理闭环：下游正式班表提供我的/团队问题状态抽屉，open/resolved 都可回看；格子详情显示同格待处理提示且允许继续登记；排班师在 `/roster-drafts?month=2026-08` 的独立下游问题工作区按状态、动作、人员筛选问题，查看详情、定位正式班表格子，并关闭问题时记录 `scheduler_resolution_note` 和 linked revision version。未新增真实审批、认证、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。
- focused verification: red `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api` 失败在缺少 `list_request_intents` / detail API；red `node --test scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` 失败在缺少状态抽屉和下游问题工作区；green 后 14 backend tests、24 Node structure tests、`npm run typecheck`、`git diff --check` 均通过。
- runtime smoke: local backend `127.0.0.1:8001` + frontend `127.0.0.1:3003`；发布 2026-08 G1 正式班表后创建两条下游问题，创建修订草稿并关闭 `REQ-IM303-SMOKE-1`；summary 返回 open=1/resolved=1，resolved 列表返回 `scheduler_resolution_note` 与 `ROSTER-2026-08-REV-IM303-SMOKE`；`/published-roster?month=2026-08` 和 `/roster-drafts?month=2026-08` 均返回 200。
- final verification: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state check、885 Node tests（884 pass / 1 skip）、shadcn convention check、lint、typecheck、Next build、275 backend tests 和 project Harness check。

- task_id: `IM304`
- source_ids:
  - `R972`
- story_ids:
  - `US892`
- action: 正式班表变更治理闭环 v1 Implementation。
- status: `done`
- notes: 完成正式班表发布后的变更治理闭环：新增计划与排班下 `/roster-change-governance?month=2026-08` 独立工作台；后端聚合 API 从已有正式版本链、格子、source_cell_id 和 resolved request intents 运行时派生版本时间线、人员-日期修订前/后差异、关联下游问题和排班师处理说明；下游已处理问题和排班师下游问题工作区可跳转到对应修订差异。未新增 diff 持久表、审批、权限、通知、导出、批量、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。
- focused verification: red `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api` 失败在缺少 `get_roster_change_governance` 与 `/api/v1/roster-change-governance`；red `node --test scripts/tests/roster-change-governance-structure.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` 失败在缺少新页面、导航和跳转入口；green 后后端 16 tests、前端结构 27 tests、`npm run typecheck`、`git diff --check`、`bash scripts/check-state.sh --strict` 均通过。
- runtime smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003`，SQLite `/tmp/bpo-im304-smoke.db`；seed 当前正式版、请假问题、修订发布和 resolved 问题后，聚合 API 返回最新修订 `ROSTER-2026-08-REV-IM304-SMOKE`，时间线 2 个版本、1 个变更格子、1 个关联问题；浏览器打开 `/roster-change-governance?month=2026-08`，可见版本时间线、人员-日期差异、`source_cell_id：CELL-001`、修订前 A5、修订后 rest、`REQ-IM304-SMOKE-1` 和处理说明，控制台无 error/warn。
- final verification: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state check、888 Node tests（887 pass / 1 skip）、shadcn convention check、lint、typecheck、Next build、277 backend tests 和 project Harness check。

- task_id: `IM304-REDESIGN`
- source_ids:
  - `R972`
- story_ids:
  - `US892`
- action: 班表变更中心 v2 Product Contract。
- status: `spec_ready_for_pm_review`
- notes: PM review rejected IM304 v1 的 version-first / raw diff / fixed detail column 页面形态。已将现行产品契约改为 operations-first 的 `班表变更中心`：一行代表一个员工-日期-班次变更事件，默认分组为 `待处理 / 全部变更 / 按员工`，发布后影响员工班次且未被排班师确认的事件进入待处理，排班师通过单条确认和内部备注关闭事件，详情用点击行后的右侧抽屉承载。确认备注仅排班师内部可见。下一步实现前必须确认本地确认记录和内部备注持久化边界；仍不包含审批、权限、通知、导出、批量、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。
- focused verification: spec self-review passed with no placeholders or non-goal conflicts; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 277 backend tests, and project Harness check.

- task_id: `IM305`
- source_ids:
  - `R973`
- story_ids:
  - `US893`
- action: 班表变更中心事件化与确认闭环 Implementation。
- status: `done`
- notes: 完成 IM304 的产品纠偏闭环：`/roster-change-governance?month=2026-08` 页面和导航改为 `班表变更中心`；后端继续复用运行时 diff 基础，但对前端输出员工-日期-班次变更事件、待处理/已确认统计和按员工分组；排班师点击事件行打开右侧详情抽屉，查看修订前/修订后、来源分类和关联问题，并单条确认填写内部备注；确认记录写入本地 `roster_change_confirmations`，事件离开 `待处理` 并在 `全部变更` 保留为 `已确认`。仍不包含审批、权限、通知、导出、批量、预测、标准人力、Excel、自动排班、生产公式、结算或计费规则。
- focused verification: red `.venv/bin/python -m unittest backend.tests.test_roster_service.RosterServiceTest.test_change_center_returns_event_rows_and_persists_confirmation -v` 失败在缺少 `summary`；green 后服务层确认持久化测试通过。red `.venv/bin/python -m unittest backend.tests.test_roster_publish_api.RosterPublishApiTest.test_roster_publish_routes_are_registered backend.tests.test_roster_publish_api.RosterPublishApiTest.test_roster_change_event_confirm_api_persists_internal_note -v` 失败在缺少确认 API；green 后通过。red `node --test scripts/tests/roster-change-governance-structure.test.mjs` 失败在旧页面缺少 `班表变更中心`、事件 API 和抽屉 slot；green 后通过。聚焦套件 `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api -v` 18 tests 通过；`node --test scripts/tests/roster-change-governance-structure.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` 27 tests 通过；`npm run typecheck` 通过。
- browser smoke: local backend `127.0.0.1:8002` + frontend `localhost:3003`，SQLite `.local/im305-roster-change-center-smoke.db`；seed 当前正式版、请假问题、修订发布和 resolved 问题后，页面显示 `班表变更中心`、`1 条待处理`、`EMP-001 / 2026-08-01`、`请假 REQ-001`；点击事件打开右侧抽屉，显示内部备注、确认变更、修订前/后和关联问题；提交内部备注后页面显示 `0 条待处理`、`已确认 1`，备注回显；390px 宽度检查无横向溢出。

- task_id: `IM307`
- source_ids:
  - `R975`
- story_ids:
  - `US895`
- action: 班务变更申请真实三态处理闭环 Implementation。
- status: `done`
- notes: 完成 `班务变更申请` 从静态原型到真实本地申请链路的推进：`/roster-change-governance?month=2026-08` 读取真实 `roster_request_intents`；申请状态使用 `open / in_progress / resolved`，页面显示 `待处理 / 跟进中 / 已处理`；动作使用 `同意 / 拒绝 / 跟进`；已处理结果用短标签 `已调整 / 已拒绝 / 已关闭`；拒绝/关闭不要求 revision，已调整保留班表结果锚点。未新增审批、权限、通知、导出、批量、外部集成、预测模型、标准人力、Excel 导入、自动排班、生产公式、结算或计费规则。
- focused verification: 后端服务/API 红测先失败在缺少 follow-up/close 和 `result_type`；green 后 5 个聚焦 backend tests 通过。前端结构红测先失败在未接 `/api/v1/roster-requests` 和当前正式班表读取；green 后 `node --test scripts/tests/roster-change-governance-structure.test.mjs` 通过；`npm run typecheck`、`npm run lint`、`bash scripts/check-state.sh --strict`、`git diff --check` 通过。
- browser smoke: local backend `127.0.0.1:8002` + frontend `localhost:3003`，SQLite `.local/im307-duty-change-request-smoke.db`；页面显示 `班务变更申请`、`待处理 / 跟进中 / 已处理 / 按员工`、短按钮 `同意 / 拒绝 / 跟进`；同意后进入跟进中并出现月班表调整，保存调整后显示 `已调整` 且有 revision 锚点；拒绝后显示 `已拒绝` 且无 revision 锚点；当前班次读取正式班表 `A5 09:00-10:00`、`T1 10:00-11:00`，未出现 `班表变更中心`、`已完成班表调整` 或 `休息 -> 休息`。
- final verification: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state check、888 Node tests（887 pass / 1 skip）、shadcn convention check、lint、typecheck、Next build、281 backend tests 和 project Harness check。
