# Review Case Acceptance Block Design

Date: 2026-06-22
Branch: `codex/review-case-acceptance-block`

## Conclusion

复核案例工作区已经具备列表、详情、来源链路、证据、结论、关闭动作和同 owner 续办能力。当前最有价值的开发不是继续堆功能，而是把这些能力收成一条运营人员能直接使用的处理路径，同时让 PM 可以通过测试和 Done Report 验收该路径。

本模块块新增一个“复核处理路径”口径：在复核列表和复核详情中明确当前案例或筛选结果处于哪一步、下一步应该做什么、哪些证据支持处理判断。项目 Gate、验收矩阵、非目标和停机条件只进入规格、测试、审计和 Done Report，不进入产品页面。

## Problem

现有页面的问题不是缺少单点能力，而是处理路径分散：

- 列表页能筛选处理阶段、owner 和风险，但没有一个轻量入口直接告诉运营人员当前队列应该优先处理哪一类案例。
- 详情页能展示来源、证据、结论、时间线和动作区，但没有一个总览说明这条案例当前卡在“来源可追溯 -> 证据 -> 结论 -> 关闭 -> 续办”的哪一步。
- IM215 已记录 live UI/API 验收受 8000 API runtime 阻塞；在 PM 不允许启动其他环境时，页面不能冒充 live acceptance 已完成。

## Hard Product Boundary

Codex 曾经犯过的错误是把自己的思路、Gate Plan、验收矩阵、停机条件和边界说明写成页面内容。这次必须严格避免。

Visible product UI may show:

- queue state
- processing path
- evidence status
- source trace state
- next user action
- blocked data state

Visible product UI must not show:

- Gate Plan
- PM acceptance matrix
- implementation stop conditions
- "this is not approval/export/batch" style governance copy
- Codex reasoning or internal verification language

Those project-facing details belong in specs, model tests, structure tests, task logs, audit reports, branch logs, Done Report, and PR notes.

## Design

### Model Layer

新增纯模型摘要函数，复用现有 review-case 数据和阶段快照，不新增 API。模型名可以保留 acceptance 语义，因为它服务测试和 PM 验收；可见 UI 文案必须转换为运营处理语言。

- `summarizeImportReviewCaseAcceptanceBlock`
  - 输入：列表 cases、筛选条件、processingStages、列表读取错误。
  - 输出：处理状态、阶段覆盖、首要处理入口和阻塞提示。
  - 口径：优先展示未关闭和高风险案例；同时为测试保留缺证据、缺结论、可关闭、已关闭、阶段未知的覆盖。

- `summarizeImportReviewCaseDetailAcceptance`
  - 输入：单案例 detail、读取错误、owner 导航摘要。
  - 输出：单案例处理路径状态、来源/证据/结论/关闭/续办五步状态、主下一步和读取阻塞说明。
  - 口径：来源链路、证据、结论、关闭状态和续办导航必须分开判断；缺 API 时显示“读取阻塞”，不显示误导性完成。无下一条待办不是阻塞，应表达为当前 owner 队列已清空。

### List Workspace UI

在 `/data-quality/review-cases` 的顶部摘要区之后增加一个紧凑的“队列处理路径”条。

内容：

- 当前筛选结果的处理状态。
- 缺证据、缺结论、可关闭、已关闭、阶段未知的覆盖数量。
- 主入口：优先进入首个未关闭高风险案例，其次进入 owner 首条待处理案例。
- 阻塞说明：读取失败或无数据时给出明确原因和下一步。

不显示内部治理说明；不新增审批、权限、导出、批量、生产公式等能力提示。

### Detail Workspace UI

在 `/data-quality/review-cases/[caseId]` 的 overview tab 中，把“证据缺口”之前增加一个“单案例处理路径”条。

内容：

- 五步状态：来源、证据、结论、关闭、续办。
- 主下一步：补证据、补结论、关闭、回看已关闭依据或返回列表。
- 阻塞说明：读取失败、来源缺失、证据缺失、结论缺失要分开显示。
- 续办说明：有下一条则给出下一条入口；无下一条则说明当前 owner 队列已清空。

不重复动作区表单，不把 PM 验收解释写进页面。

## Boundaries

Allowed:

- 修改现有复核案例前端模型和现有复核案例页面组件。
- 新增模型测试和结构测试。
- 更新 `scripts/check.sh`、Harness 当前任务、backlog、需求、故事、审计和分支日志。
- 使用现有 shadcn/ui 组件、lucide 图标和语义 token。
- UI 文案只使用运营处理语言，不使用 Gate、验收、非目标、停机条件等项目治理语言。

Forbidden:

- 新增后端 route、数据库 schema、migration、依赖或 package/lockfile 修改。
- 启动新的 8000/API runtime 或其他测试环境。
- 新增审批、权限、导出、批量关闭、重开、转派、升级、SLA、通知、外部证据服务、自动排班、生产公式、结算规则或收费因子。
- 新增页面路由或改变 dashboard 到 review-case 的稳定契约。
- 把 Codex 思路、Gate Plan、PM 验收矩阵、停机条件或非目标说明写成可见产品页面内容。

## Acceptance

- 模型测试覆盖列表验收摘要：正常覆盖、读取失败、空列表、缺阶段快照。
- 模型测试覆盖详情验收摘要：缺证据、缺结论、可关闭、已关闭、读取失败。
- 页面结构测试确认列表页和详情页渲染新的处理路径区，并且不出现 Gate、验收、审批、导出、批量、权限、停机条件等页面文案入口。
- `bash scripts/check-state.sh --strict` 通过。
- `git diff --check` 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过。
- 如当前 3000 已有服务，可做只读 browser smoke；不会启动其他测试环境。

## Self Review

- Placeholder scan: no placeholder or deferred requirement remains.
- Scope check: the design stays in one review-case acceptance module block.
- Boundary check: no backend, database, dependency, package, approval, permission, export, batch, formula, settlement, or charge-factor scope is included.
- Runtime honesty: live UI/API acceptance remains blocked unless PM separately allows a reachable review-case API runtime.
- UI language boundary: PM/Gate language is kept out of product pages and must be tested structurally.
