# Task Log

本文件记录需求、用户故事和执行任务之间的过程状态。

## Schema

```yaml
- date: "YYYY-MM-DD"
  task_id: "H003"
  source_ids: []
  story_ids: []
  action: "执行动作"
  status: "done"
  owner: "Codex"
  notes: "过程说明"
```

## Log

### 2026-05-12

- task_id: `F018`
- source_ids:
  - `R020`
  - `R021`
  - `R025`
- story_ids:
  - `US038`
- action: 完成风险提示表局部 table parity 迁移。
- status: `done`
- notes: 新增 `components/schedule-risk-table.tsx`，使用 TanStack Table 管理风险提示表列和排序；保留明细/班次动作；未新增依赖、未改 package/lockfile、未启用批量、拖拽、审批、导出或生产动作。

### 2026-05-12

- task_id: `F017`
- source_ids:
  - `R018`
  - `R019`
  - `R024`
- story_ids:
  - `US037`
- action: 新增不可用影响定位。
- status: `done`
- notes: 不可用记录行新增“影响”入口；新增 `/unavailability/[unavailabilityId]`，展示不可用记录、重叠班次、关联风险和跳转入口；未新增依赖、后端接口、真实数据、审批、批量或生产公式能力。

### 2026-05-12

- task_id: `F016`
- source_ids:
  - `R019`
  - `R023`
- story_ids:
  - `US036`
- action: 新增风险明细钻取入口。
- status: `done`
- notes: 排班计划页风险提示行新增“明细”入口；新增 `/schedule-risks/[riskId]`，展示风险等级、计划、时段、缺口、不可用影响、原因、建议、关联班次和重叠不可用记录；未新增依赖、后端接口、真实数据、审批、批量或生产公式能力。

### 2026-05-12

- task_id: `H016`
- source_ids:
  - `R022`
- story_ids:
  - `US035`
- action: 修复 Harness Gate 体系审计反馈。
- status: `done`
- notes: 已建立 required_workflow 到 Gate 的矩阵，更新 AGENTS/PROJECT_STATE 阶段名，将旧 clean-Harness 审计结论改为历史快照，并预置 `US036/F016` 为下一条 ready Story Runner 入口。

### 2026-05-12

- task_id: `F015`
- source_ids:
  - `R021`
- story_ids:
  - `US034`
- action: 收口 shadcn 依赖与组件接入。
- status: `done`
- notes: 已接受 PM 确认的 package/lockfile 依赖变更和新增 shadcn UI 组件；修复 `hooks/use-mobile.ts` 的 React hooks lint 问题；核对 dashboard、排班计划搜索、新建草稿和编辑草稿页面冒烟通过。

### 2026-05-11

- task_id: `H003`
- action: 建立 Lightweight Harness 文档型升级结构。
- status: `done`
- notes: 只更新 Harness 文档、提示词模板和追溯文件，不进入业务实现。

### 2026-05-11

- task_id: `H003`
- action: 审计当前目录并校准 Subagent prompt 中的 Skill 名称。
- status: `done`
- notes: 发现工作区存在未跟踪前端工程文件、业务 mock 数据和 `recharts` 依赖，导致 clean Harness check 被 `package.json` 拦截；已将 prompt 中的占位式 Skill 名称替换为当前可用 Skill。

### 2026-05-11

- task_id: `H004`
- action: 细化 Subagent Prompt Contract。
- status: `done`
- notes: 新增统一 dispatch packet、结构化返回状态、停止条件、实现/评审链路，并细化 PM、UI/UX、Frontend、Backend、QA、Doc Agent 合同。

### 2026-05-11

- task_id: `H005`
- action: 接入 shadcn skill 使用规则。
- status: `done`
- notes: 明确 `/Users/mac/.codex/skills/shadcn/SKILL.md` 主要给 UI/UX Agent、Frontend Agent、Implementer 和 Code Quality Reviewer 使用；QA Agent 仅作 UI 验收参考；PM、Backend、Doc Agent 默认不使用。

### 2026-05-11

- task_id: `H006`
- source_ids: [`R001`, `R002`]
- story_ids: [`US001`, `US002`, `US003`, `US004`, `US005`]
- action: 开发前 Harness 收口。
- status: `done_with_verification_blocker`
- notes: 对齐项目阶段、补齐 F001 追溯、增加文件所有权矩阵和 dispatch 示例、formalize Recharts 例外，并将 `scripts/check.sh` 增强为真实验证前端工具链；当前阻塞为 `eslint`、`tsc`、`next` 缺失。

### 2026-05-11

- task_id: `H007`
- source_ids: []
- story_ids: []
- action: 固化开发环境与交付验证入口。
- status: `done`
- notes: 将项目运行时声明为 Node.js 22，补充本地 setup 文档，更新 README，并让 `scripts/check.sh` 在本机自动优先使用 Homebrew `node@22` 完成交付验证。

### 2026-05-11

- task_id: `M001`
- source_ids: [`R003`, `R004`, `R005`, `R006`, `R007`, `R008`, `R009`, `R010`]
- story_ids: [`US006`, `US007`, `US008`, `US009`, `US010`, `US011`, `US012`, `US013`, `US014`, `US015`, `US016`]
- action: 拆解正式 MVP 需求并定义排班计划第一条前后端纵切。
- status: `done`
- notes: 第一条纵切确定为排班计划列表、排班计划详情、FastAPI 只读接口和本地种子数据；后续实现任务拆为 B001、F005 和 Q001。

### 2026-05-11

- task_id: `B001`
- source_ids: [`R007`, `R008`]
- story_ids: [`US010`, `US011`, `US013`, `US014`]
- action: 创建 FastAPI 排班计划只读接口纵切。
- status: `done`
- notes: 新增 `backend/**`，提供 `GET /api/v1/schedule-plans` 和 `GET /api/v1/schedule-plans/{plan_id}`；使用本地种子数据和标准库 unittest 验证，不接数据库、认证、真实 Excel 或真实 CORN。

### 2026-05-11

- task_id: `F005`
- source_ids: [`R005`, `R006`, `R007`, `R008`, `R009`]
- story_ids: [`US007`, `US008`, `US009`, `US012`, `US013`]
- action: 创建排班计划列表与详情前端纵切。
- status: `done`
- notes: 新增 `/schedule-plans` 和 `/schedule-plans/[planId]`，通过 `lib/schedule-plans.ts` 集中读取 B001 契约；页面仅展示只读计划、0.5h 时段、缺口和覆盖率，不提供新增、编辑、发布、审批、导出或批量操作。

### 2026-05-11

- task_id: `Q001`
- source_ids: [`R005`, `R006`, `R007`, `R008`, `R009`, `R010`]
- story_ids: [`US007`, `US008`, `US009`, `US010`, `US011`, `US012`, `US013`, `US014`, `US015`, `US016`]
- action: 验收排班计划第一条前后端只读纵切。
- status: `done`
- notes: 已验证 B001 后端 unittest、F005 前端 lint/typecheck/build、Harness check、路由生成、列表/详情 HTTP 200、接口字段追溯和 shadcn theme token 使用；未发现新增依赖、真实外部系统或越界业务能力。

### 2026-05-11

- task_id: `H008`
- source_ids: []
- story_ids: []
- action: 固化本地前后端联调启动入口。
- status: `done`
- notes: 新增 `scripts/dev.sh`，统一启动 FastAPI 与 Next.js dev server，默认 `BPO_API_BASE_URL=http://127.0.0.1:8000`；同步更新 README、backend README、setup 文档和 Harness check。

### 2026-05-11

- task_id: `H009`
- source_ids: []
- story_ids: []
- action: 优化连续交付提交流程。
- status: `done`
- notes: 已在 `AGENTS.md` 增加 Continuous Delivery Mode：用户显式要求连续执行或一口气交付时，绿色验证后直接提交；保留依赖、真实数据、数据库、认证、审批、导出、批量、生产公式和失败验证等停止条件。

### 2026-05-11

- task_id: `B002`
- source_ids: [`R011`]
- story_ids: [`US017`, `US018`]
- action: 创建 FastAPI 排班计划草稿创建与更新接口。
- status: `done`
- notes: 先写失败测试，再新增 `SchedulePlanDraftRequest`、草稿创建接口和草稿更新接口；仅使用本地内存数据，只允许更新 draft 计划，不接数据库、认证、真实 Excel、真实 CORN、发布、审批、导出或批量操作。

### 2026-05-11

- task_id: `H010`
- source_ids: [`R014`]
- story_ids: [`US021`]
- action: 将默认开发节奏改为 Story Runner 连续用户故事交付。
- status: `done`
- notes: 已在 AGENTS、Harness、Subagent Prompt Contract 和 Project State 中明确：goal 先拆最小用户故事，按依赖顺序自动执行、验证、提交并进入下一个 ready story；同一 story 内的 UI 反馈不再拆成多个小任务；Story Runner Mode 下允许 bounded subagents。

### 2026-05-11

- task_id: `F006`
- source_ids: [`R012`, `R011`]
- story_ids: [`US019`, `US017`]
- action: 创建前端排班计划草稿入口。
- status: `done`
- notes: 新增 `/schedule-plans/new` 和 server action，从列表进入新建草稿，提交后调用 B002 并跳转到详情页；不做完整编辑器、发布、审批、导出、批量、权限或数据库持久化。

### 2026-05-11

- task_id: `F007`
- source_ids: [`R013`, `R011`]
- story_ids: [`US020`, `US018`]
- action: 创建前端排班计划草稿更新入口。
- status: `done`
- notes: draft 详情页新增编辑入口，新增 `/schedule-plans/[planId]/edit` 和 server action，提交后调用 B002 PUT 并跳转回详情；非 draft 不展示编辑入口。

### 2026-05-11

- task_id: `Q002`
- source_ids: [`R011`, `R012`, `R013`]
- story_ids: [`US017`, `US018`, `US019`, `US020`]
- action: 验收排班计划草稿创建与更新纵切。
- status: `done`
- notes: 已验证 B002 后端 unittest、F006/F007 前端 lint/typecheck/build、Harness check、本地新建页 200、编辑页 200、POST 创建草稿和 PUT 更新草稿；仍不包含数据库、认证、权限、发布、审批、导出或批量。

### 2026-05-11

- task_id: `H011`
- source_ids: []
- story_ids: []
- action: 修复 Harness gate review 中发现的 backend Python、项目状态、侧边栏规则和审计结论不一致问题。
- status: `done`
- notes: `scripts/check.sh` 与 `scripts/dev.sh` 已显式选择可导入 FastAPI/Pydantic 的 backend Python；PROJECT_STATE 已同步当前前端脚手架 + 本地排班计划纵切阶段；AGENTS 二级导航规则已与 F002 对齐；audit-report 已标记过期结论。

### 2026-05-11

- task_id: `B003`
- source_ids: [`R015`]
- story_ids: [`US022`]
- action: 增加排班计划列表后端筛选。
- status: `done`
- notes: FastAPI 列表接口新增 `status` 和 `query` 查询参数；repository 支持按状态和关键词筛选；后端 unittest 新增 2 个筛选用例。

### 2026-05-11

- task_id: `F008`
- source_ids: [`R015`]
- story_ids: [`US023`]
- action: 增加排班计划列表前端筛选。
- status: `done`
- notes: `/schedule-plans` 读取 URL 中的 `query` / `status`，页面提供搜索、状态切换、清空筛选、筛选后汇总和空结果状态；表格保留排序。

### 2026-05-11

- task_id: `B004`
- source_ids: [`R016`]
- story_ids: [`US024`]
- action: 增加班次明细后端列表。
- status: `done`
- notes: FastAPI 新增 `GET /api/v1/shift-details`，将排班计划 intervals 展平成 0.5h 明细行；支持 `status` 和 `query`；后端 unittest 增加字段和关键词筛选覆盖。

### 2026-05-11

- task_id: `F009`
- source_ids: [`R016`]
- story_ids: [`US025`]
- action: 增加班次明细前端页面。
- status: `done`
- notes: 新增 `/shift-details`，侧边栏班次明细指向真实页面；页面提供关键词/状态筛选、汇总卡、明细表和返回计划链接。

### 2026-05-11

- task_id: `B005`
- source_ids: [`R017`]
- story_ids: [`US026`]
- action: 增加需求计划后端列表。
- status: `done`
- notes: FastAPI 新增 `GET /api/v1/demand-plans`，从本地 forecast 数据生成预测需求行；支持 `query`；后端 unittest 增加字段和关键词筛选覆盖。

### 2026-05-11

- task_id: `F010`
- source_ids: [`R017`]
- story_ids: [`US027`]
- action: 增加需求计划前端页面。
- status: `done`
- notes: 新增 `/demand-plans`，侧边栏需求计划指向真实页面；页面提供关键词搜索、汇总卡和预测需求表。

### 2026-05-12

- task_id: `F014`
- source_ids:
  - `R020`
- story_ids:
  - `US033`
- action: 完成 shadcn dashboard-01 无依赖视觉基线对齐。
- status: `done`
- notes: 已对齐 OKLCH token、sidebar token、sidebar 宽度和行高、metric cards container query、指标字号、chart natural curve 和 table row density；未新增依赖、未改 package/lockfile，剩余 Tabler/TanStack/DnD/Drawer 等完整 parity 项继续 gated。

### 2026-05-12

- task_id: `F013`
- source_ids:
  - `R020`
- story_ids:
  - `US032`
- action: 完成 shadcn dashboard-01 视觉差距审计。
- status: `done`
- notes: 新增 `docs/design/shadcn-dashboard-01-gap-audit.md`，按 P0/P1/P2 归类 token、sidebar/header、metric cards、chart/table、响应式、light/dark 和依赖门禁差距；未改 UI、未安装依赖。

### 2026-05-12

- task_id: `H014`
- source_ids:
  - `R020`
- story_ids:
  - `US032`
  - `US033`
- action: 插入 shadcn dashboard-01 前端视觉对齐需求。
- status: `done`
- notes: 已基于外部 spec 插入前端设计需求，拆分为先审计差距、再实施视觉对齐；实施阶段若涉及依赖、package/lockfile、字体、Tabler icons 或 shadcn 组件补齐，需要单独 Gate。

### 2026-05-12

- task_id: `B007/F012`
- source_ids:
  - `R019`
- story_ids:
  - `US030`
  - `US031`
- action: 新增排班风险提示最小能力。
- status: `done`
- notes: 新增 `GET /api/v1/schedule-risks`，在 `/schedule-plans` 增加风险提示区，合并展示时段缺口和生效中不可用记录；风险等级仅为本地 MVP 展示口径。

### 2026-05-12

- task_id: `B006/F011`
- source_ids:
  - `R018`
- story_ids:
  - `US028`
  - `US029`
- action: 新增计划与排班模块的不可用管理最小只读能力。
- status: `done`
- notes: 新增 `GET /api/v1/unavailability`，增加 `/unavailability` 页面和侧边栏入口；支持关键词、状态筛选、汇总卡、不可用记录表和跳转班次明细。

### 2026-05-12

- task_id: `H013`
- source_ids: []
- story_ids: []
- action: 固化阶段完成后的后续计划输出规则。
- status: `done`
- notes: 已将阶段/模块块完成后的固定汇报结构写入 AGENTS、Lightweight Harness、Done Report Template 和 Project State；后续 Done Report 必须说明完成内容、验证、剩余事项、推荐下阶段 2-3 项、推荐理由、暂不建议事项和默认下一项。

### 2026-05-11

- task_id: `H012`
- source_ids: []
- story_ids: []
- action: 快速修复 Harness 文档一致性残留问题。
- status: `done`
- notes: 已同步 lightweight-harness 当前阶段与分阶段路线，修正 AGENTS 中 Story Runner subagent 授权残留文案，并将 audit-report 中旧的 clean Harness 偏差风险降级为历史结论。

### 2026-05-12

- task_id: `H015`
- source_ids: []
- story_ids: []
- action: 固化绿色检查后的自动本地提交规则。
- status: `done`
- notes: PM 已确认以后本项目每完成一个通过 `bash scripts/check.sh` 的任务就自动本地 commit；阶段、模块块或连续开发块完成后再询问是否 push。

### 2026-05-12

- task_id: `H019`
- source_ids:
  - `R026`
- story_ids:
  - `US039`
- action: 修复开发服务器原生运行时签名/缺失导致的本地 500 风险。
- status: `done`
- notes: 已将 `npm run dev` 收口到 `scripts/run-next-dev.sh`，强制使用 Node.js 22、先做 `lightningcss` / `@next/swc-darwin-arm64` native preflight，再以 webpack dev server 启动；`bash scripts/check.sh` 已通过，且回归测试覆盖了支持运行时成功、默认 Codex Node 失败可识别和 dev 入口受控三类场景。

### 2026-05-12

- task_id: `H020`
- source_ids:
  - `R027`
- story_ids:
  - `US040`
- action: 固化 Python 3.12 开发运行时。
- status: `done`
- notes: 已新增 `.python-version` 和 `scripts/verify-backend-runtime.sh`，backend dev/check 入口现在只接受 Python 3.12；回归测试已覆盖支持运行时成功与系统 Python 3.9 失败可识别场景，`bash scripts/check.sh` 已通过。

### 2026-05-12

- task_id: `H017`
- source_ids:
  - `R028`
- story_ids:
  - `US041`
- action: 标准化任务分支、worktree、验证、提交、集成和 push 确认工作流。
- status: `done`
- notes: 已将 `AGENTS.md` 压缩为短版强制入口，新增 `docs/quality/GIT_BRANCH_WORKFLOW.md` 作为命令级 runbook，新增 `docs/quality/FRONTEND_RULES.md` 承接详细前端规则，并补充 Gate Registry、Done Report Template、Project State、Decision Log、Audit Report 和 Branch Log 的证据规则；不修改业务代码、依赖、package 或 lockfile。

### 2026-05-12

- task_id: `H018`
- source_ids:
  - `R029`
- story_ids:
  - `US042`
- action: 固化 No Database MVP Mode。
- status: `done`
- notes: 已明确功能完备前不接数据库；数据库连接、ORM、migration、schema 实现和生产持久化配置均为 hard stop。继续允许本地 FastAPI seed/process-memory 数据和前端 fallback 契约验证。

### 2026-05-12

- task_id: `F019`
- source_ids:
  - `R030`
- story_ids:
  - `US043`
- action: 增加本地 MVP 功能闭环入口。
- status: `done`
- notes: `/schedule-plans` 新增 No Database MVP 链路面板，连通需求计划、排班计划、风险明细、不可用管理和班次明细；未新增后端接口、mock 数据、依赖、package 或 lockfile。

### 2026-05-12

- task_id: `F020`
- source_ids:
  - `R031`
- story_ids:
  - `US044`
- action: 迁移排班计划主表到 TanStack Table 局部 parity。
- status: `done`
- notes: `SchedulePlanTable` 由 TanStack Table 管理列、行模型和排序；保留原字段与查看动作，不启用批量、拖拽、审批、导出、批量调班或生产动作。

### 2026-05-12

- task_id: `Q003`
- source_ids:
  - `R032`
- story_ids:
  - `US045`
- action: 完成本地 MVP no-database 验收审计。
- status: `done`
- notes: 审计记录 no-database 边界、本地 MVP 链路入口、计划表 table parity 和最终验证结果；数据库、真实集成、权限、审批、导出、批量和生产口径继续 deferred。

### 2026-05-12

- task_id: `F021`
- source_ids:
  - `R033`
- story_ids:
  - `US046`
- action: 补强排班计划详情复核链路。
- status: `done`
- notes: 详情页新增本地复核链路面板，展示缺口时段、关联风险、生效不可用计数，并提供班次、风险、不可用入口；未新增后端接口、数据库、真实数据或依赖。

### 2026-05-12

- task_id: `F022`
- source_ids:
  - `R034`
- story_ids:
  - `US047`
- action: 迁移班次明细到 TanStack Table。
- status: `done`
- notes: 新增 `ShiftDetailsTable` 组件，由 TanStack Table 管理班次明细列和排序；保持 display-only，不启用批量、拖拽、审批、导出或批量调班。

### 2026-05-12

- task_id: `F023`
- source_ids:
  - `R035`
- story_ids:
  - `US048`
- action: 迁移不可用记录到 TanStack Table。
- status: `done`
- notes: 新增 `UnavailabilityTable` 组件，由 TanStack Table 管理不可用记录列和排序；保留影响/班次动作并保持 display-only，不启用批量、拖拽、审批、导出或批量调班。

### 2026-05-12

- task_id: `Q004`
- source_ids:
  - `R036`
- story_ids:
  - `US049`
- action: 执行 F021-F023 本地链路 QA 验收收口。
- status: `done`
- notes: 验证复核链路入口与关键计数、班次明细 TanStack 表和不可用记录 TanStack 表；同步新增下一条 parity 目标 `R037/US050/F024` 为 ready。

### 2026-05-12

- task_id: `F024`
- source_ids:
  - `R037`
- story_ids:
  - `US050`
- action: 迁移需求计划到 TanStack Table。
- status: `done`
- notes: 新增 `DemandPlanTable` 组件，由 TanStack Table 管理需求计划列和排序；保留日期、时段、项目、职场、预测人数、来源、状态字段并保持 display-only。

### 2026-05-12

- task_id: `Q005`
- source_ids:
  - `R038`
- story_ids:
  - `US051`
- action: 执行 F024 单故事 QA 验收收口。
- status: `done`
- notes: 验证需求计划 TanStack 表渲染和字段完整性；同步新增下一条 parity 目标 `R039/US052/F025` 为 ready。

### 2026-05-12

- task_id: `F025`
- source_ids:
  - `R039`
- story_ids:
  - `US052`
- action: 迁移排班计划详情时段表到 TanStack Table。
- status: `done`
- notes: 新增 `SchedulePlanIntervalTable` 组件，由 TanStack Table 管理时段明细列和排序；保留开始、结束、预测、已排、缺口、覆盖率、备注字段并保持 display-only。

### 2026-05-12

- task_id: `Q006`
- source_ids:
  - `R040`
- story_ids:
  - `US053`
- action: 执行 F025 单故事 QA 验收收口。
- status: `done`
- notes: 验证排班计划详情页时段明细已由独立 TanStack Table 组件渲染并保留关键字段；同步新增下一条 parity 目标 `R041/US054/F026` 为 ready。

### 2026-05-12

- task_id: `F026`
- source_ids:
  - `R041`
- story_ids:
  - `US054`
- action: 迁移风险明细受影响班次表到 TanStack Table。
- status: `done`
- notes: 新增 `ScheduleRiskShiftTable` 组件，由 TanStack Table 管理关联班次列和排序；保留计划、状态、时段、预测、已排、缺口、覆盖率、备注字段并保持 display-only。

### 2026-05-12

- task_id: `Q007`
- source_ids:
  - `R042`
- story_ids:
  - `US055`
- action: 执行 F026 单故事 QA 验收收口。
- status: `done`
- notes: 验证风险明细页关联班次已由独立 TanStack Table 组件渲染并保留关键字段；下一条连续开发入口为 `R043/US056/F027`。

### 2026-05-12

- task_id: `F027`
- source_ids:
  - `R043`
- story_ids:
  - `US056`
- action: 迁移风险明细不可用影响表到 TanStack Table。
- status: `done`
- notes: 新增 `ScheduleRiskUnavailabilityTable` 组件，由 TanStack Table 管理风险明细页重叠不可用记录列和排序；保留人员、团队、时间、原因、状态、影响时段、备注字段并保持 display-only。

### 2026-05-12

- task_id: `Q008`
- source_ids:
  - `R044`
- story_ids:
  - `US057`
- action: 执行 F027 单故事 QA 验收收口。
- status: `done`
- notes: 验证风险明细页不可用影响表已由独立 TanStack Table 组件渲染并保留关键字段。

### 2026-05-12

- task_id: `F028`
- source_ids:
  - `R045`
- story_ids:
  - `US058`
- action: 迁移不可用影响详情受影响班次表到 TanStack Table。
- status: `done`
- notes: 新增 `UnavailabilityImpactShiftTable` 组件，由 TanStack Table 管理不可用影响详情页受影响班次列和排序；保留计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作字段并保持 display-only。

### 2026-05-12

- task_id: `Q009`
- source_ids:
  - `R046`
- story_ids:
  - `US059`
- action: 执行 F028 单故事 QA 验收收口。
- status: `done`
- notes: 验证不可用影响详情页受影响班次表已由独立 TanStack Table 组件渲染并保留关键字段。

### 2026-05-12

- task_id: `F029`
- source_ids:
  - `R047`
- story_ids:
  - `US060`
- action: 迁移不可用影响详情关联风险表到 TanStack Table。
- status: `done`
- notes: 新增 `UnavailabilityImpactRiskTable` 组件，由 TanStack Table 管理不可用影响详情页关联风险列和排序；保留风险、时段、缺口、不可用、原因、建议和动作字段并保持 display-only。

### 2026-05-12

- task_id: `Q010`
- source_ids:
  - `R048`
- story_ids:
  - `US061`
- action: 执行 F029 单故事 QA 验收收口。
- status: `done`
- notes: 验证不可用影响详情页关联风险表已由独立 TanStack Table 组件渲染并保留关键字段。

### 2026-05-12

- task_id: `Q011`
- source_ids:
  - `R049`
- story_ids:
  - `US062`
- action: 执行详情页 table parity 连续开发块 QA 总收口。
- status: `done`
- notes: 验证风险明细两张表与不可用影响详情两张表均已迁移为独立 TanStack Table 组件，相关详情页动作入口保持可用；本条连续 parity 链已收口完毕。

### 2026-05-12

- task_id: `H022`
- source_ids:
  - `R051`
- story_ids:
  - `US063`
- action: 落地 Harness 状态治理 v3 第一轮。
- status: `done`
- notes: 新增 current/registry 状态层、`scripts/check-state.sh`、State Hygiene/Repair Gate、History-On-Demand、archive 不可执行和 single-writer 规则；不迁移大量 done 历史、不改业务代码、不改依赖、不接数据库。

### 2026-05-12

- task_id: `H023`
- source_ids:
  - `R052`
- story_ids:
  - `US064`
- action: 将 check-state 接入标准验证链路并补回归测试。
- status: `done`
- notes: `bash scripts/check.sh` 现在运行 warning-only state check 和 `scripts/tests/check-state.test.mjs`；回归覆盖一致状态、warning-only 不自锁、strict 缺 active task 失败和 TRACE_INDEX lifecycle state 失败。

### 2026-05-12

- task_id: `H024`
- source_ids:
  - `R053`
- story_ids:
  - `US065`
- action: 用 current queue 执行真实治理小任务冒烟。
- status: `done`
- notes: H024/US065 曾写入 `docs/current/STORY_QUEUE.yaml` 与 `docs/current/ACTIVE_TASKS.yaml` 并通过 `bash scripts/check-state.sh --strict`；完成后 current queue 已清空，历史定位保留在 registry 和 legacy traceability 中。

### 2026-05-12

- task_id: `H025`
- source_ids:
  - `R054`
- story_ids:
  - `US066`
- action: 补强 current done history 不变量检查。
- status: `done`
- notes: `scripts/check-state.sh` 现在会检测 current story/task 文件中的 `status: done`；warning-only 模式只告警，strict 模式失败，回归测试覆盖 done story 和 done task 场景。

### 2026-05-12

- task_id: `H026`
- source_ids:
  - `R055`
- story_ids:
  - `US067`
- action: 将标准 check-state 升级为 strict 默认阻断。
- status: `done`
- notes: `bash scripts/check.sh` 默认运行 `bash scripts/check-state.sh --strict`；State Repair Mode 可显式使用 `BPO_STATE_CHECK_MODE=repair-scope`，临时诊断可显式使用 `BPO_STATE_CHECK_MODE=warning`。

### 2026-05-13

- task_id: `H027`
- source_ids:
  - `R056`
- story_ids:
  - `US068`
- action: 补强 TRACE_INDEX current_files 路径校验。
- status: `done`
- notes: `scripts/check-state.sh` 现在会校验 `TRACE_INDEX.yaml` 中 `current_files` 的路径，并对重复 registry 路径输出去重；回归测试覆盖缺失 current file path 的 strict 失败。

### 2026-05-13

- task_id: `H028`
- source_ids:
  - `R057`
- story_ids:
  - `US069`
- action: 固化 Codex Plan 面板边界规则。
- status: `done`
- notes: `AGENTS.md` 和 `docs/quality/STATE_MANAGEMENT.md` 明确 Codex Plan 只是当前会话投影视图，不是状态源；若 Plan 与 Harness state 冲突，以 Harness state 为准。

### 2026-05-13

- task_id: `F030`
- source_ids:
  - `R058`
- story_ids:
  - `US070`
- action: 迁移 dashboard BPO 异常明细表到 TanStack Table。
- status: `done`
- notes: `components/data-table.tsx` 现在由 TanStack Table 管理本地排序、搜索过滤和分页；新增 `components/data-table-model.ts` 与无依赖模型测试覆盖搜索和页码夹紧。

### 2026-05-13

- task_id: `F031`
- source_ids:
  - `R059`
- story_ids:
  - `US071`
- action: 补 dashboard 异常明细表本地列显示和分页大小控制。
- status: `done`
- notes: 列控制从占位按钮改为本地字段显示开关，分页大小可在 5/10/20 条之间切换；不触发后端写入、审批、导出、批量或生产动作。

### 2026-05-13

- task_id: `Q012`
- source_ids:
  - `R060`
- story_ids:
  - `US072`
- action: 执行 F030-F031 dashboard table parity QA 收口。
- status: `done`
- notes: 验证 dashboard 异常明细表已完成 TanStack Table parity 和本地交互收口；current queue 与 active tasks 已清空，不保留 done 历史。

### 2026-05-13

- task_id: `F032-F040`
- source_ids:
  - `R061-R069`
- story_ids:
  - `US073-US081`
- action: 连续完成 dashboard 本地 parity 和摘要增强。
- status: `done`
- notes: 异常明细表新增本地严重度/状态筛选、筛选摘要、重置、分页范围和首页/末页；数据接入状态迁移为 TanStack Table 并支持状态筛选和摘要；热力图新增缺口摘要、峰值缺口和可访问标签。

### 2026-05-13

- task_id: `Q013`
- source_ids:
  - `R070`
- story_ids:
  - `US082`
- action: 执行 F032-F040 dashboard 连续开发块 QA 收口。
- status: `done`
- notes: 10 个任务均保持 no-database、本地展示层边界；未新增依赖、未改后端契约、未引入真实同步、审批、导出、批量或生产公式；current queue 与 active tasks 已清空。

### 2026-05-13

- task_id: `F041-F059`
- source_ids:
  - `R071-R089`
- story_ids:
  - `US083-US101`
- action: 连续完成排班计划、风险提示、不可用三张表的本地 parity 增强。
- status: `done`
- notes: 排班计划表新增本地摘要、查询、状态/缺口筛选、重置、分页和列控制；风险提示表新增摘要、等级筛选、搜索、重置和分页；不可用表新增摘要、状态筛选、搜索、重置、分页和列控制。

### 2026-05-13

- task_id: `Q014`
- source_ids:
  - `R090`
- story_ids:
  - `US102`
- action: 执行 F041-F059 20-task table parity QA 收口。
- status: `done`
- notes: 模型测试覆盖三张表的本地筛选与统计；未新增依赖、未改后端契约、未接数据库、未引入审批、导出、批量、权限或生产公式；current queue 与 active tasks 已清空。

### 2026-05-13

- task_id: `H029`
- source_ids:
  - `R091`
- story_ids:
  - `US103`
- action: 收口 current-state 治理规则、最小 active-task 合同和 strict state-repair 边界。
- status: `done`
- notes: 对齐 `AGENTS.md`、`docs/quality/GATE_REGISTRY.md`、`docs/quality/STATE_MANAGEMENT.md`、`docs/harness/lightweight-harness.md` 和 `docs/current/PROJECT_CONTEXT.md` 的默认读集与 SoT 口径；`scripts/check-state.sh` 新增 gate 存在性、最小字段、registry 预算、inline trace entry 和 active diff scope 校验；state-check 回归测试扩展到 15 个并通过；current queue 与 active tasks 已清空。

### 2026-05-13

- task_id: `F060`
- source_ids:
  - `R092`
- story_ids:
  - `US104`
- action: 新增独立风险提示工作台页，并对齐计划/不可用链路的风险入口。
- status: `done`
- notes: 新增 `/schedule-risks` 页面与 sidebar 导航入口；计划详情和不可用影响定位可带上下文跳到风险工作台，风险明细可返回到上下文列表；复用现有本地风险契约，不接数据库、不改依赖；Safari 在 `http://localhost:3016/schedule-risks` 和按计划上下文筛选页完成烟测。

- task_id: `Q015`
- source_ids:
  - `R093`
- story_ids:
  - `US105`
- action: 收口 F060 风险工作台 QA，验证独立页、上下文筛选、计划详情、风险明细和不可用影响定位的跨页链路。
- status: `done`
- notes: `bash scripts/check-state.sh --strict`、`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过；本地 prod server 在 `http://localhost:3014` 验证了 `/schedule-risks`、按计划上下文筛选页、计划详情页、风险明细页和不可用明细页的风险跳转链路；未引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

- task_id: `F061-F064`
- source_ids:
  - `R094`
  - `R095`
  - `R096`
  - `R097`
- story_ids:
  - `US106`
  - `US107`
  - `US108`
  - `US109`
- action: 完成 scoped drilldown 批次，补齐班次明细、不可用列表、风险工作台右侧 rail 和四页上下文链接。
- status: `done`
- notes: 班次明细和不可用列表新增 scope banner，本地过滤和保参搜索/tab；风险工作台新增宽屏右侧复核 rail；计划、风险、班次和不可用四页主要入口都改成精确 context link；保持 no-database、no-dependency 边界。

- task_id: `Q016`
- source_ids:
  - `R098`
- story_ids:
  - `US110`
- action: 收口 F061-F064 的 scoped drilldown 和右侧 rail QA。
- status: `done`
- notes: Safari 在 `http://localhost:3014` 验证了风险工作台右侧 rail、scoped `shift-details`、scoped `unavailability` 和跨页保参；`curl` 补充验证了计划详情、风险明细和不可用详情的 scoped 链接；`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。

- task_id: `F065-F068`
- source_ids:
  - `R099`
  - `R100`
  - `R101`
  - `R102`
- story_ids:
  - `US111`
  - `US112`
  - `US113`
  - `US114`
- action: 完成班次明细/不可用列表右侧复核 rail，并补齐计划时段明细、不可用影响表的 continuation actions。
- status: `done`
- notes: 新增 `lib/review-navigation.ts` 统一 review 链路 URL；`/shift-details` 和 `/unavailability` 在宽屏下新增右侧复核 rail；计划详情里的时段表可继续查看风险/班次/不可用；不可用影响页里的关联风险表可继续查看风险/班次/计划；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q017`
- source_ids:
  - `R103`
- story_ids:
  - `US115`
- action: 收口 F065-F068 的 review rail 和 continuation action QA。
- status: `done`
- notes: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`npm run lint`、`npm run typecheck`、`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过；在 `http://localhost:3014` 启动本地 dev server 后，`curl` 命中了 `/shift-details`、`/unavailability`、计划详情和不可用影响定位页的关键 rail/action 文案；current queue 与 active tasks 已清空。

- task_id: `F069-F072`
- source_ids:
  - `R104`
  - `R105`
  - `R106`
  - `R107`
- story_ids:
  - `US116`
  - `US117`
  - `US118`
  - `US119`
- action: 完成计划详情、风险明细、不可用影响定位三张 detail 页的右侧复核 rail，并统一 detail 页 review helper 入口。
- status: `done`
- notes: 三个 detail 页在宽屏下新增右侧复核 rail；计划详情、风险明细和不可用影响定位均展示范围摘要、关键指标和继续复核入口；继续复用 `lib/review-navigation.ts`，没有引入数据库、依赖或后端契约变更。

- task_id: `Q018`
- source_ids:
  - `R108`
- story_ids:
  - `US120`
- action: 收口 F069-F072 的 detail 页右侧 rail QA。
- status: `done`
- notes: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`npm run lint`、`npm run typecheck`、`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过；本地 `http://localhost:3014` HTML smoke 命中了计划详情、风险明细和不可用影响定位页的 `当前复核范围 / 复核任务 / 回到全部` 关键文案；current queue 与 active tasks 已清空。

- task_id: `H030`
- source_ids:
  - `R109`
- story_ids:
  - `US121`
- action: 收口 Harness 文档一致性与 Hook 守门。
- status: `done`
- notes: 统一 AGENTS/STATE_MANAGEMENT/GIT_BRANCH_WORKFLOW/GATE_REGISTRY 的 SoT 与 hook 边界；`check-state` 新增 diff mode、batch、branch、acceptance_ref 和 closeout scope 校验；新增 repo-local hooks 与 commit message 校验；`check.sh` 会在 typecheck 前清理 stale `.next` route types；current queue 与 active tasks 已恢复为空。

- task_id: `H031`
- source_ids:
  - `R110`
- story_ids:
  - `US122`
- action: 治理 TRACE_INDEX 预算并补 registry 窗口化规则。
- status: `done`
- notes: `TRACE_INDEX` 从 428 行压到 313 行，strict state check 不再输出 registry budget warning；新增“先压缩再归档”的 registry slimming 规则；只改 current/registry/quality/traceability 文档，没有碰业务代码、依赖、package/lockfile 或数据库。

- task_id: `H032`
- source_ids:
  - `R111`
- story_ids:
  - `US123`
- action: 收口 post-closeout traceability guard，并回填最近 branch-log 缺失的 local commit sha。
- status: `done`
- notes: `check-state` 现在允许 branch-log-only 的 post-closeout staged diff 在 current 已清空后继续提交；无 active task 的其他 staged diff 仍严格失败；最近 `Q015`、`F061-F064`、`F065-F068`、`F069-F072` 和 `H031` 的 branch-log commit SHA 已回填。

- task_id: `H033`
- source_ids:
  - `R113`
- story_ids:
  - `US125`
- action: 收口 startup seed strict-state guard，并把 current 恢复到 idle。
- status: `done`
- notes: `check-state` 现在允许从 idle seed 到 active 的受限 startup diff，通过后产品任务仍不能继续修改 `docs/current/**` 或 `docs/registry/**`；`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。

- task_id: `H034`
- source_ids:
  - `R114`
- story_ids:
  - `US126`
- action: 收口 product closeout strict-state 与 commit-message 守门。
- status: `done`
- notes: `check-state` 现在允许 same-commit product closeout 合法修改 current 清空文件；`validate-commit-message` 会在 current 已清空但 staged diff 属于合法 closeout 时，从 `HEAD` 的 active task 合同识别 commit subject；`node --test scripts/tests/check-state.test.mjs`、`node --test scripts/tests/validate-commit-message.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。

- task_id: `F073-F076`
- source_ids:
  - `R112`
- story_ids:
  - `US124`
- action: 抽出共享 `ReviewChecklistRail`，统一 risk/plan/shift/unavailability 页面右侧复核 rail。
- status: `done`
- notes: 新增 `components/review-checklist-rail.tsx`；风险工作台、计划详情、班次明细、不可用列表、风险明细、不可用影响定位六个页面统一显示范围摘要、当前步骤、下一步、scoped actions 和稳定回退入口；`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。

- task_id: `Q019`
- source_ids:
  - `R112`
- story_ids:
  - `US124`
- action: 收口共享 review checklist rail 的 QA。
- status: `done`
- notes: 严格状态、状态回归、commit-message 回归、lint、typecheck、Next build 和后端 19 个 unittest 全部通过；current queue 与 active tasks 已清空。

- task_id: `F077-F079`
- source_ids:
  - `R115`
- story_ids:
  - `US127`
- action: 完成 scoped detail navigation 批次，统一 risk / unavailability / 关联风险表进入 detail 页的 scoped URL，并补齐 detail 页回退与相关计划跳转的保参逻辑。
- status: `done`
- notes: `lib/review-navigation.ts` 新增 scoped detail href builder 与回退 helper；风险表、不可用表、不可用影响关联风险表进入 detail 页时保留 scope 与来源页；计划详情、风险明细、不可用影响定位页的返回动作和相关计划跳转不再掉回全量列表；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q020`
- source_ids:
  - `R115`
- story_ids:
  - `US127`
- action: 收口 scoped detail navigation QA。
- status: `done`
- notes: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`bash scripts/check-state.sh --strict --diff=working`、`git diff --check` 和 `bash scripts/check.sh` 通过；严格状态、state/commit-message 回归、lint、typecheck、Next build 和后端 19 个 unittest 继续通过；current queue 与 active tasks 已清空。

- task_id: `F080-F082`
- source_ids:
  - `R116`
- story_ids:
  - `US128`
- action: 完成 plan-origin review closure 批次，补齐从计划详情进入班次、风险、不可用后的返回闭环和来源页透传。
- status: `done`
- notes: `buildReviewBackLink` 现已支持 `schedule-plans`；风险明细、不可用影响定位和班次明细会把计划详情作为来源页透传到后续动作；不可用影响关联风险表里的继续查看动作也保留同一来源页；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q021`
- source_ids:
  - `R116`
- story_ids:
  - `US128`
- action: 收口 plan-origin review closure QA。
- status: `done`
- notes: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`bash scripts/check-state.sh --strict --diff=working`、`git diff --check` 和 `bash scripts/check.sh` 通过；严格状态、state/commit-message 回归、lint、typecheck、Next build 和后端 19 个 unittest 继续通过；current queue 与 active tasks 已清空。

- task_id: `F083-F084`
- source_ids:
  - `R117`
- story_ids:
  - `US129`
- action: 完成 plan-origin row-action context 批次，补齐计划详情时段表与班次明细表的行级动作保参。
- status: `done`
- notes: 计划详情时段表里的 风险 / 班次 / 不可用 行级动作现在显式透传 `from=schedule-plans`；班次明细表不再使用裸 href，而是通过 review helper 构造计划/风险链接并从 URL 读取来源页上下文；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q022`
- source_ids:
  - `R117`
- story_ids:
  - `US129`
- action: 收口 plan-origin row-action context QA。
- status: `done`
- notes: 先验证失败用例，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 28 个测试通过；`bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；本地 dev server 可在 `http://localhost:3014` 启动，但 cross-sandbox localhost smoke 因审批超时未追加为最终证据；current queue 与 active tasks 已清空。

- task_id: `F085`
- source_ids:
  - `R118`
- story_ids:
  - `US130`
- action: 完成 unavailability impact shift-table scoped plan-link 收口，补齐影响班次表的计划行级动作保参。
- status: `done`
- notes: `UnavailabilityImpactShiftTable` 现在使用 review helper 构造计划详情链接，并透传当前不可用页的来源页和 scope；不可用影响定位页把当前 project/site/date/start/end 显式传给表格组件；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q023`
- source_ids:
  - `R118`
- story_ids:
  - `US130`
- action: 收口 unavailability impact shift-table scoped plan-link QA。
- status: `done`
- notes: 先验证失败用例，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 29 个测试通过；`bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F086-F087`
- source_ids:
  - `R119`
- story_ids:
  - `US131`
- action: 完成风险明细辅表 continuation actions 收口，给关联班次表与不可用表补齐 scoped 行级动作。
- status: `done`
- notes: `ScheduleRiskShiftTable` 现在提供 helper 驱动的 计划 / 班次 动作，`ScheduleRiskUnavailabilityTable` 现在提供 helper 驱动的 影响 / 班次 动作；风险明细页把 `sourceFrom` 透传给两张辅表，因此 detail 页内继续钻取不再停在只读表；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q024`
- source_ids:
  - `R119`
- story_ids:
  - `US131`
- action: 收口风险明细辅表 continuation actions QA。
- status: `done`
- notes: 先验证失败用例，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 31 个测试通过；`bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F088-F089`
- source_ids:
  - `R120`
- story_ids:
  - `US132`
- action: 完成 review list row-action parity 收口，补齐风险列表与不可用列表的 scoped continuation actions。
- status: `done`
- notes: `ScheduleRiskTable` 现在补齐到 明细 / 班次 / 计划 / 不可用，`UnavailabilityTable` 现在补齐到 影响 / 班次 / 风险；row-level review 不再依赖先进入 detail 页才能继续下钻；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q025`
- source_ids:
  - `R120`
- story_ids:
  - `US132`
- action: 收口 review list row-action parity QA。
- status: `done`
- notes: 先验证失败用例，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 33 个测试通过；`bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F090-F091`
- source_ids:
  - `R121`
- story_ids:
  - `US133`
- action: 完成 schedule plan list review parity 收口，补齐计划列表的 scoped continuation actions。
- status: `done`
- notes: `SchedulePlanTable` 现在提供 查看 / 风险 / 班次 / 不可用 行级动作；计划列表可以直接沿当前项目、职场、日期维度进入本地 review chain，不再只剩单一 detail 入口；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q026`
- source_ids:
  - `R121`
- story_ids:
  - `US133`
- action: 收口 schedule plan list review parity QA。
- status: `done`
- notes: 先验证失败用例，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 34 个测试通过；`bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F092-F093`
- source_ids:
  - `R122`
- story_ids:
  - `US134`
- action: 完成 schedule plan draft flow context 收口，补齐计划列表、计划详情、new/edit 页面和 server action 的上下文回跳。
- status: `done`
- notes: 计划列表进入 `new` 时现在保留 `query/status`，计划详情进入 `edit` 时现在保留来源页和 scope；new/edit 页的返回、取消和提交后回跳统一走 review helper，不再退化成裸列表或无来源详情；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 36 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q027`
- source_ids:
  - `R122`
- story_ids:
  - `US134`
- action: 收口 schedule plan draft flow context QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F094-F095`
- source_ids:
  - `R123`
- story_ids:
  - `US135`
- action: 完成 schedule plan draft failure feedback 收口，在计划列表和计划详情补齐可见失败提示。
- status: `done`
- notes: 当 `draft=failed` 回跳到计划列表或计划详情时，页面现在会显示明确失败提示，不再把失败结果只留在 URL 参数里；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 37 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q028`
- source_ids:
  - `R123`
- story_ids:
  - `US135`
- action: 收口 schedule plan draft failure feedback QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。
