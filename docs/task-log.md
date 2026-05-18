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

- task_id: `F096-F097`
- source_ids:
  - `R124`
- story_ids:
  - `US136`
- action: 完成 schedule plan draft success feedback 收口，在计划详情补齐创建成功和保存成功提示。
- status: `done`
- notes: 本地新建草稿成功后，计划详情会显示“草稿已创建”；本地保存草稿成功后，计划详情会显示“草稿已保存”；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 38 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q029`
- source_ids:
  - `R124`
- story_ids:
  - `US136`
- action: 收口 schedule plan draft success feedback QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F098-F099`
- source_ids:
  - `R125`
- story_ids:
  - `US137`
- action: 完成 schedule plan list detail-context 收口，补齐计划列表进入 detail 的来源页与筛选上下文透传。
- status: `done`
- notes: 计划列表表格中的 `查看` 动作现在保留 `query`、`status` 和 `from=schedule-plans`；从该入口进入的计划详情返回动作会回到同一筛选列表，不再退化成裸详情或无筛选列表；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 39 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q030`
- source_ids:
  - `R125`
- story_ids:
  - `US137`
- action: 收口 schedule plan list detail-context QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F100-F101`
- source_ids:
  - `R126`
- story_ids:
  - `US138`
- action: 完成 schedule plan list-origin review return 收口，拆分计划列表来源页并稳定保留列表筛选回退目标。
- status: `done`
- notes: 计划列表中的 `风险`、`班次`、`不可用` 动作现在使用独立的 `schedule-plans-list` source，并保留当前 `query/status`；风险、班次、不可用页识别该来源后会回到同一筛选计划列表，而不是误判成计划详情 drilldown；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 41 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q031`
- source_ids:
  - `R126`
- story_ids:
  - `US138`
- action: 收口 schedule plan list-origin review return QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F102-F103`
- source_ids:
  - `R127`
- story_ids:
  - `US139`
- action: 完成 schedule plan risk-entry context 收口，补齐计划页风险总览入口和内嵌风险预览表的 plan-list review 上下文透传。
- status: `done`
- notes: 计划页风险总览卡片的 `查看全部` 动作现在保留 `from=schedule-plans-list`、`query` 和 `status`；计划页内嵌风险预览表的 row actions 也会保留同一 plan-list source 与筛选上下文；风险页识别该上下文后，后续 continuation actions 与回退目标会稳定指向当前筛选计划列表；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 44 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q032`
- source_ids:
  - `R127`
- story_ids:
  - `US139`
- action: 收口 schedule plan risk-entry context QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F104-F105`
- source_ids:
  - `R128`
- story_ids:
  - `US140`
- action: 完成 schedule plan summary CTA context 收口，补齐计划页本地 MVP flow summary 的 context-aware cross-page CTA。
- status: `done`
- notes: `MvpFlowSummary` 不再使用硬编码 risk detail 和裸跨页链接；计划页 summary CTA 进入需求、风险、不可用和班次页时，会使用与当前计划列表一致的 helper routing，其中风险、不可用和班次会保留 `schedule-plans-list`、`query` 和 `status`；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 45 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q033`
- source_ids:
  - `R128`
- story_ids:
  - `US140`
- action: 收口 schedule plan summary CTA context QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F106-F107`
- source_ids:
  - `R129`
- story_ids:
  - `US141`
- action: 完成 risk workbench unavailability CTA context 收口，补齐风险工作台头部跨页 CTA 与默认回退目标。
- status: `done`
- notes: 风险工作台头部 `不可用管理` 不再使用裸 `/unavailability`，而是复用 `unavailabilityHref` 保留当前来源页和范围上下文；当风险工作台无上游来源时，默认回退 CTA 现在留在风险工作台而不是跳回排班计划页；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 46 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q034`
- source_ids:
  - `R129`
- story_ids:
  - `US141`
- action: 收口 risk workbench CTA context QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F108`
- source_ids:
  - `R130`
- story_ids:
  - `US142`
- action: 完成 demand plan to schedule plan CTA context 收口，补齐需求页进入排班页的 query 上下文透传。
- status: `done`
- notes: 需求计划页头部 `查看排班计划` 不再使用裸 `/schedule-plans`，而是通过 `buildSchedulePlansHref({ query })` 保留当前 demand query；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 47 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q035`
- source_ids:
  - `R130`
- story_ids:
  - `US142`
- action: 收口 demand plan CTA context QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F109`
- source_ids:
  - `R131`
- story_ids:
  - `US143`
- action: 完成 risk workbench clear-scope CTA context 收口，补齐风险工作台 `查看全部` 的 query/status 保留。
- status: `done`
- notes: 风险工作台在有 scope drilldown 时，`查看全部` 不再使用裸 `/schedule-risks`，而是通过 `buildScheduleRisksHref({ query, status })` 只清 scope、不清当前列表上下文；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 48 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q036`
- source_ids:
  - `R131`
- story_ids:
  - `US143`
- action: 收口 risk workbench clear-scope CTA QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F110-F111`
- source_ids:
  - `R132`
- story_ids:
  - `US144`
- action: 完成 shift-details 与 unavailability clear CTA context 收口，补齐 scoped `清空范围` 和列表 `清空` 的 source/query/status 保留规则。
- status: `done`
- notes: `shift-details` 与 `unavailability` 的 scoped `清空范围` 现在只清 drilldown 参数，同时保留当前 source、query 和 status；两页列表层 `清空` 现在清掉本页 query/status，但保留当前 source，避免 review chain 回退目标丢失；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 50 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q037`
- source_ids:
  - `R132`
- story_ids:
  - `US144`
- action: 收口 shift-details / unavailability clear CTA QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F112`
- source_ids:
  - `R133`
- story_ids:
  - `US145`
- action: 完成 schedule-plans draft feedback context 收口，补齐列表内搜索、状态切换和清空对 draft 反馈的保留。
- status: `done`
- notes: 排班计划页搜索表单、状态切换和 `清空` 现在都会保留 `draft` 参数，因此本地 draft 失败/成功提示不会在仍留在当前页面时被列表交互直接冲掉；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 51 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q038`
- source_ids:
  - `R133`
- story_ids:
  - `US145`
- action: 收口 schedule-plans draft feedback context QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F113`
- source_ids:
  - `R134`
- story_ids:
  - `US146`
- action: 完成 schedule-plans draft feedback dismiss 收口，补齐同页关闭动作并保留当前 query/status。
- status: `done`
- notes: 排班计划页的 draft failure 卡片现在提供显式 `关闭` 动作，通过 `buildSchedulePlansHref({ query, status })` 只移除 `draft`、不丢当前列表筛选；先验证失败测试，再通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 收口到 52 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q039`
- source_ids:
  - `R134`
- story_ids:
  - `US146`
- action: 收口 schedule-plans draft dismiss QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F114`
- source_ids:
  - `R135`
- story_ids:
  - `US147`
- action: 完成 demand-plans clear CTA 一致性收口，补齐 helper-driven `清空` 动作。
- status: `done`
- notes: 需求计划页的 `清空` 现在通过 `buildDemandPlansHref()` 回到同页空 query 状态，不再使用裸 `/demand-plans`；通过 `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 保持 52 个测试通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `Q040`
- source_ids:
  - `R135`
- story_ids:
  - `US147`
- action: 收口 demand-plans clear CTA QA。
- status: `done`
- notes: `bash scripts/check-state.sh --strict --diff=working`、`bash scripts/check-state.sh --strict --diff=staged`、`git diff --check` 和 `bash scripts/check.sh` 通过；current queue 与 active tasks 已清空。

- task_id: `F115`
- source_ids:
  - `R136`
- story_ids:
  - `US148`
- action: 完成 schedule-plan draft edit 路径 E2E 补强。
- status: `done`
- notes: 新增浏览器级 smoke 覆盖 `/schedule-plans?query=苏州&status=draft` 进入 draft 计划详情、编辑草稿页，并验证取消/返回保留来源、query/status 和计划详情上下文；同时修正计划详情从列表进入时的返回文案，避免误显示为“返回计划详情”。

- task_id: `Q041`
- source_ids:
  - `R137`
- story_ids:
  - `US149`
- action: 收口 table parity 本地 E2E QA 补强。
- status: `done`
- notes: E2E 已确认排班计划列表的列控制、状态筛选、缺口筛选和分页大小控制具备可访问名称；`npm run e2e:smoke` 3 条通过、`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` 52 条通过、`bash scripts/check.sh` 通过；保持 no-database、no-dependency、no-backend-contract 边界。

- task_id: `B008`
- source_ids:
  - `R138`
- story_ids:
  - `US150`
- action: 完成本机演示坐席主数据、状态数据和登录数据 CSV 导入闭环。
- status: `done`
- notes: 新增本机 demo import 服务与 `/api/v1/demo-imports/{kind}`、`/api/v1/demo-imports/batches` 路由，支持三类 CSV 文本/文件导入、字段校验、批次号、成功/失败行数和错误明细；导入状态只保存在本地进程内存中，不接数据库、ORM、migration、真实外部系统或新增依赖。

- task_id: `F116`
- source_ids:
  - `R139`
- story_ids:
  - `US151`
- action: 完成本机演示页面占位清零。
- status: `done`
- notes: 新增 `/demo-imports` 页面，侧边栏 `文件导入`、`接入批次`、`数据源管理` 均进入本机导入/批次状态页面；dashboard 数据接入状态可读取本机导入批次；异常明细行操作改为可解释的本机复核动作，不再是纯图标占位。

- task_id: `Q042`
- source_ids:
  - `R140`
- story_ids:
  - `US152`
- action: 收口本机导入演示闭环 QA。
- status: `done`
- notes: 已用后端 unittest、前端 lint/typecheck、源码模型测试和浏览器 smoke 覆盖导入入口、导入结果、dashboard 批次状态和行复核动作；本批保持 localhost-only、no-database、no-real-integration、no-package-change。

- task_id: `F117`
- source_ids:
  - `R141`
- story_ids:
  - `US153`
- action: 完成本机 dashboard 筛选和 imported-data KPI preview。
- status: `done`
- notes: dashboard 顶部日期、职场/团队、供应商、数据版本筛选已改为可提交控件并通过 URL/query 保留；导入批次现在汇总为本机 KPI Preview，展示导入覆盖行数、接入数据源数、最新批次和需关注状态；保持 no-database、no-real-integration、no-production-formula 边界。

- task_id: `Q043`
- source_ids:
  - `R142`
- story_ids:
  - `US154`
- action: 收口本机 dashboard KPI preview QA。
- status: `done`
- notes: E2E 覆盖 CSV 文件导入后进入 dashboard，确认本机 KPI Preview、导入覆盖行数、筛选控件可交互并保留 URL/query；模型断言覆盖 imported batch 到 KPI preview 的汇总；`npm run e2e:smoke` 4 条通过，模型测试 53 条通过。

- task_id: `F118`
- source_ids:
  - `R143`
  - `R144`
- story_ids:
  - `US155`
  - `US156`
- action: 完成未开放导航开发中标识与剩余功能补全顺序收口。
- status: `done`
- notes: 侧边栏未开放功能现在统一显示 `开发中` 且不再作为 Link 跳转到 dashboard；已开放入口继续保留真实链接；`docs/PROJECT_STATE.md` 已记录后续按 `导入 -> 现有模块读取 -> 结果展示/复核` 的补全顺序。

- task_id: `Q044`
- source_ids:
  - `R145`
- story_ids:
  - `US157`
- action: 收口未开放导航开发中标识 QA。
- status: `done`
- notes: E2E 覆盖 `工时核验` 显示 `开发中`、具备禁用态且不是 link，同时确认 `文件导入` 仍链接到 `/demo-imports`；保持 no-database、no-real-integration、no-auth、no-approval、no-export、no-batch、no-production-formula、no-settlement 边界。

- task_id: `B009`
- source_ids:
  - `R146`
  - `R147`
- story_ids:
  - `US158`
  - `US159`
- action: 完成本机导入 processed records API 与现有模块读取切片。
- status: `done`
- notes: 后端新增 `/api/v1/demo-imports/records`，按导入类型返回总行数、最近批次、更新时间和样本行；dashboard 与 shift-details 读取同一 processed records 结果并显示模块级摘要；保持 localhost-only、process-memory、no-database 边界。

- task_id: `Q045`
- source_ids:
  - `R148`
- story_ids:
  - `US160`
- action: 收口本机导入 records 现有模块读取 QA。
- status: `done`
- notes: 后端 unittest 覆盖 processed records API；E2E 覆盖导入坐席主数据后 dashboard 与 shift-details 均出现 records 摘要；模型测试覆盖 records 汇总逻辑。

- task_id: `F119`
- source_ids:
  - `R149`
  - `R150`
- story_ids:
  - `US161`
  - `US162`
- action: 完成风险提示与不可用管理读取本机导入 records。
- status: `done`
- notes: schedule-risks 与 unavailability 读取同一 processed records API，并分别展示 `风险复核 records`、`不可用核对 records` 摘要；保持 no-backend-contract-change、localhost-only、process-memory、no-database 边界。

- task_id: `Q046`
- source_ids:
  - `R151`
- story_ids:
  - `US163`
- action: 收口风险与不可用 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入坐席主数据后 dashboard、shift-details、schedule-risks 与 unavailability 均出现 records 摘要；模型测试 54 条通过，浏览器 smoke 5 条通过。

- task_id: `F120`
- source_ids:
  - `R152`
  - `R153`
- story_ids:
  - `US164`
  - `US165`
- action: 完成履约监控本机 records 最小切片。
- status: `done`
- notes: 新增 `/fulfillment-monitoring` 页面，读取本机状态数据和登录数据 processed records，展示 `履约核验 records`、状态/登录覆盖和样本；侧边栏 `工时核验` 改为真实入口，其他未实现履约项继续 `开发中`。

- task_id: `Q047`
- source_ids:
  - `R154`
- story_ids:
  - `US166`
- action: 收口履约监控 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入状态/登录数据后进入履约监控，确认 records 摘要、状态数据、登录数据和样本可见；模型测试 55 条通过，浏览器 smoke 5 条通过。

- task_id: `F121`
- source_ids:
  - `R155`
  - `R156`
- story_ids:
  - `US167`
  - `US168`
- action: 完成坐席状态轨迹本机 records 最小切片。
- status: `done`
- notes: 新增 `/agent-status-trace` 页面，读取本机 `status_log` processed records，展示 `状态轨迹 records`、状态数据、状态类型、状态分布和状态日志样本；侧边栏 `坐席状态轨迹` 改为真实入口，异常管理、实时遵守率、异常复核继续 `开发中`。

- task_id: `Q048`
- source_ids:
  - `R157`
- story_ids:
  - `US169`
- action: 收口坐席状态轨迹 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入状态数据后进入坐席状态轨迹，确认 records 摘要、状态数据、状态分布和样本可见；模型测试 56 条通过，浏览器 smoke 5 条通过。

- task_id: `F122`
- source_ids:
  - `R158`
  - `R159`
- story_ids:
  - `US170`
  - `US171`
- action: 完成异常管理本机 records 最小切片。
- status: `done`
- notes: 新增 `/fulfillment-exceptions` 页面，读取本机 `status_log` 与 `login_log` processed records，展示 `异常线索 records`、状态/登录覆盖、本机异常线索样本和登录数据样本；侧边栏 `异常管理` 改为真实入口，实时遵守率和异常复核继续 `开发中`。

- task_id: `Q049`
- source_ids:
  - `R160`
- story_ids:
  - `US172`
- action: 收口异常管理 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入状态/登录数据后进入异常管理，确认 records 摘要、状态数据、登录数据和本机异常线索样本可见；模型测试 57 条通过，浏览器 smoke 5 条通过。

- task_id: `F123`
- source_ids:
  - `R161`
  - `R162`
- story_ids:
  - `US173`
  - `US174`
- action: 完成异常复核本机 records 只读切片。
- status: `done`
- notes: 新增 `/exception-review` 页面，读取本机 `status_log` 与 `login_log` processed records，展示 `复核队列 records`、状态/登录覆盖和只读复核队列；侧边栏 `异常复核` 改为真实入口，实时遵守率继续 `开发中`。

- task_id: `Q050`
- source_ids:
  - `R163`
- story_ids:
  - `US175`
- action: 收口异常复核 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入状态/登录数据后进入异常复核，确认 records 摘要、状态数据、登录数据和只读复核队列可见；模型测试 58 条通过，浏览器 smoke 5 条通过。

- task_id: `F124`
- source_ids:
  - `R164`
  - `R165`
- story_ids:
  - `US176`
  - `US177`
- action: 完成实时遵守率本机 records 预览切片。
- status: `done`
- notes: 新增 `/adherence-monitoring` 页面，读取本机 `status_log` 与 `login_log` processed records，展示 `遵守率预览 records`、状态/登录覆盖、本机预览状态和样本；侧边栏 `实时遵守率` 改为真实入口。

- task_id: `Q051`
- source_ids:
  - `R166`
- story_ids:
  - `US178`
- action: 收口实时遵守率 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入状态/登录数据后进入实时遵守率，确认 records 摘要、状态数据、登录数据和本机遵守率预览样本可见；模型测试 59 条通过，浏览器 smoke 5 条通过。

- task_id: `F125`
- source_ids:
  - `R167`
  - `R168`
- story_ids:
  - `US179`
  - `US180`
- action: 完成数据质量本机 records 预览切片。
- status: `done`
- notes: 新增 `/data-quality` 页面，读取本机 `staff_master`、`status_log` 与 `login_log` processed records，展示 `数据质量 records`、三类数据覆盖、样本和本机质量预览状态；侧边栏 `数据质量` 改为真实入口。

- task_id: `Q052`
- source_ids:
  - `R169`
- story_ids:
  - `US181`
- action: 收口数据质量 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入三类 CSV 后进入数据质量，确认 records 摘要、主数据、状态数据、登录数据和本机质量预览明细可见；模型测试 60 条通过，浏览器 smoke 5 条通过。

- task_id: `F126`
- source_ids:
  - `R170`
  - `R171`
- story_ids:
  - `US182`
  - `US183`
- action: 完成 CORN 状态日志本机 records 预览切片。
- status: `done`
- notes: 新增 `/corn-status-log` 页面，读取本机 `status_log` processed records，展示 `CORN 状态日志 records`、状态覆盖、最近批次、状态分布和样本；侧边栏 `CORN 状态日志` 改为真实入口，字段映射和接口集成继续 `开发中`。

- task_id: `Q053`
- source_ids:
  - `R172`
- story_ids:
  - `US184`
- action: 收口 CORN 状态日志 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入状态 CSV 后进入 CORN 状态日志，确认 records 摘要、状态数据、状态日志分布和样本可见；模型测试 61 条通过，浏览器 smoke 5 条通过。

- task_id: `F127`
- source_ids:
  - `R173`
  - `R174`
- story_ids:
  - `US185`
  - `US186`
- action: 完成字段映射本机只读 records 预览切片。
- status: `done`
- notes: 新增 `/field-mapping` 页面，读取本机 `staff_master`、`status_log` 与 `login_log` processed records 样本字段，展示 `字段映射 records`、已识别字段、缺失字段、额外字段和最近批次；侧边栏 `字段映射` 改为真实入口，接口集成继续 `开发中`。

- task_id: `Q054`
- source_ids:
  - `R175`
- story_ids:
  - `US187`
- action: 收口字段映射 records 读取 QA。
- status: `done`
- notes: E2E 覆盖导入三类 CSV 后进入字段映射，确认 records 摘要、三类数据源和本机字段映射预览可见；模型测试 62 条通过，浏览器 smoke 5 条通过。

- task_id: `F128`
- source_ids:
  - `R176`
  - `R177`
- story_ids:
  - `US188`
  - `US189`
- action: 完成组织与人员本机 staff records 预览切片。
- status: `done`
- notes: 新增 `/organization-people` 页面，读取本机 `staff_master` processed records，展示 `组织与人员 records`、人员主数据样本、团队/职场/供应商分布和本机只读边界；侧边栏 `组织与人员` 改为真实入口，供应商管理、规则配置、权限管理和操作审计继续 `开发中`。

- task_id: `Q055`
- source_ids:
  - `R178`
- story_ids:
  - `US190`
- action: 收口组织与人员 records 读取 QA。
- status: `done`
- notes: E2E 覆盖本机导入 staff_master 后进入组织与人员，确认 records 摘要、人员样本、组织分布和系统管理边界可见；模型测试 63 条通过，浏览器 smoke 5 条通过。

- task_id: `F129`
- source_ids:
  - `R179`
  - `R180`
  - `R181`
  - `R182`
  - `R183`
- story_ids:
  - `US191`
  - `US192`
  - `US193`
  - `US194`
  - `US195`
- action: 完成运营工作台与系统管理本机预览页补位。
- status: `done`
- notes: 新增 `/today-fulfillment`、`/anomaly-alerts`、`/deficit-heatmap`、`/vendor-management`、`/rule-configuration` 五个只读预览页；侧边栏对应条目改为真实入口，智能排班、接口集成、权限管理、操作审计、结算复盘仍不开放。

- task_id: `Q056`
- source_ids:
  - `R184`
- story_ids:
  - `US196`
- action: 收口运营工作台与系统管理本机预览页 QA。
- status: `done`
- notes: E2E 覆盖本机导入三类 CSV 后进入五个新页面，确认 records 摘要、样本/热力图/供应商分布/规则目录可见；模型测试 67 条通过，浏览器 smoke 5 条通过，in-app browser 已打开 `/rule-configuration` 并确认关键文案。

- task_id: `F130`
- source_ids:
  - `R185`
- story_ids:
  - `US197`
- action: 完成排班数据本机导入与排班计划 records 摘要。
- status: `done`
- notes: 后端 demo import 新增 `schedule_plan` CSV 契约，`/demo-imports` 新增排班数据导入入口，`/schedule-plans` 读取本机 schedule_plan processed records 并展示 `排班数据 records`、计划样本、时段行、最近批次和样本时段；不写入生产排班列表，不做自动排班或数据库持久化。

- task_id: `Q057`
- source_ids:
  - `R186`
- story_ids:
  - `US198`
- action: 收口排班数据导入到排班计划页 QA。
- status: `done`
- notes: 后端 unittest 24 条通过，模型测试 68 条通过，typecheck/lint/build 通过，E2E smoke 5 条通过并覆盖 schedule_plan 导入后排班计划页 `排班数据 records` 摘要；in-app browser 已打开 `/schedule-plans` 并确认记录摘要可见。

- task_id: `F131`
- source_ids:
  - `R187`
- story_ids:
  - `US199`
- action: 完成月度结算本机只读复盘预览。
- status: `done`
- notes: 新增 `/monthly-settlement` 页面，读取本机 processed records，展示 `结算复盘 records`、导入覆盖、主数据/履约/排班复盘信号、最近批次和本机边界；侧边栏 `结算复盘 > 月度结算` 改为真实入口，报表中心、供应商复盘、结算锁账继续 `开发中`。

- task_id: `Q058`
- source_ids:
  - `R188`
- story_ids:
  - `US200`
- action: 收口月度结算本机只读复盘 QA。
- status: `done`
- notes: 模型测试 69 条通过，E2E smoke 5 条通过并覆盖导入本机 CSV 后 `/monthly-settlement` 的 `结算复盘 records` 摘要、月度结算导航链接和其他结算复盘条目的开发中边界；最终 check 通过。

- task_id: `F132`
- source_ids:
  - `R189`
- story_ids:
  - `US201`
- action: 完成报表中心本机只读汇总预览。
- status: `done`
- notes: 新增 `/report-center` 页面，读取本机 processed records，展示 `报表中心 records`、导入来源、报表分区、模块成果和最近批次；侧边栏 `结算复盘 > 报表中心` 改为真实入口，不生成生产报表或导出文件。

- task_id: `F133`
- source_ids:
  - `R190`
- story_ids:
  - `US202`
- action: 完成供应商复盘本机只读汇总预览。
- status: `done`
- notes: 新增 `/supplier-review` 页面，读取本机 processed records，展示 `供应商复盘 records`、供应商覆盖、履约覆盖、排班覆盖和供应商主数据样本；侧边栏 `结算复盘 > 供应商复盘` 改为真实入口，不做供应商考核写回、账单金额或锁账。

- task_id: `Q059`
- source_ids:
  - `R191`
- story_ids:
  - `US203`
- action: 收口报表中心与供应商复盘 QA。
- status: `done`
- notes: 模型测试 71 条通过，E2E smoke 5 条通过并覆盖导入本机 CSV 后 `/report-center` 与 `/supplier-review` 的 records 摘要、导航链接和 `结算锁账` 开发中边界；最终 check 通过。

- task_id: `F134`
- source_ids:
  - `R192`
- story_ids:
  - `US204`
- action: 完成智能排班本机只读建议预览。
- status: `done`
- notes: 新增 `/smart-scheduling` 页面，读取本机 processed records，展示 `智能排班 records`、建议信号、计划覆盖、排班计划样本和最近批次；侧边栏 `计划与排班 > 智能排班` 改为真实入口，不自动生成或发布排班。

- task_id: `F135`
- source_ids:
  - `R193`
- story_ids:
  - `US205`
- action: 完成接口集成本机只读接入状态预览。
- status: `done`
- notes: 新增 `/interface-integration` 页面，读取本机 processed records，展示 `接口集成 records`、字段 readiness、状态日志、来源覆盖和状态样本；侧边栏 `数据与集成 > 接口集成` 改为真实入口，不连接真实接口、不配置凭证、不写回外部系统。

- task_id: `Q060`
- source_ids:
  - `R194`
- story_ids:
  - `US206`
- action: 收口智能排班与接口集成 QA。
- status: `done`
- notes: 模型测试 73 条通过，E2E smoke 5 条通过并覆盖导入本机 CSV 后 `/smart-scheduling` 与 `/interface-integration` 的 records/readiness 摘要、导航链接和 `结算锁账`、`权限管理`、`操作审计` 开发中边界；最终 check 通过。

- task_id: `F136`
- source_ids:
  - `R195`
- story_ids:
  - `US207`
- action: 完成操作审计本机只读预览。
- status: `done`
- notes: 新增 `/operation-audit` 页面，读取本机 processed records，展示 `操作审计 records`、导入批次、模块证据、审计样本和最近批次；侧边栏 `系统管理 > 操作审计` 改为真实入口，不做账号登录、认证、权限或生产审计日志。

- task_id: `Q061`
- source_ids:
  - `R196`
- story_ids:
  - `US208`
- action: 收口操作审计本机预览 QA。
- status: `done`
- notes: 模型测试 74 条通过，E2E smoke 5 条通过并覆盖导入本机 CSV 后 `/operation-audit` 的 records 摘要、操作审计导航链接、`权限管理` 和 `结算锁账` 开发中边界；最终 check 通过。

- task_id: `F137`
- source_ids:
  - `R197`
- story_ids:
  - `US209`
- action: 完成排班草稿复核准备摘要。
- status: `done`
- notes: `/schedule-plans/[planId]` 已新增 `复核准备` 本机只读卡片，汇总当前草稿缺口时段、高风险和同日同职场生效不可用，并给出本机下一步复核建议；不提交审批、不发布排班、不自动排班、不生产写回。

- task_id: `Q062`
- source_ids:
  - `R198`
- story_ids:
  - `US210`
- action: 收口排班草稿复核准备 QA。
- status: `done`
- notes: 模型测试 75 条通过，E2E smoke 5 条通过并覆盖 draft 详情页 `复核准备` 摘要、缺口下一步建议和 no-approval/no-publish/no-auto-scheduling/no-production-writeback 边界；最终 `bash scripts/check.sh` 通过。

- task_id: `F138`
- source_ids:
  - `R199`
- story_ids:
  - `US211`
- action: 完成本机导入 records 摘要 parity。
- status: `done`
- notes: 共用 `ImportedRecordsSummary` 已展示坐席主数据、状态数据、登录数据和排班数据行数；模型 summary 新增 `scheduleRows`，让排班数据导入后能在已开放模块共用摘要中解释。

- task_id: `Q063`
- source_ids:
  - `R200`
- story_ids:
  - `US212`
- action: 收口本机导入 records 摘要 parity QA。
- status: `done`
- notes: 模型测试 75 条通过，E2E smoke 5 条通过并覆盖本机 CSV 导入后 dashboard 共用摘要展示 `排班数据` 行数；最终 `bash scripts/check.sh` 通过。

- task_id: `Q064`
- source_ids:
  - `R201`
- story_ids:
  - `US213`
- action: 收口已开放模块 route smoke 补强。
- status: `done`
- notes: E2E smoke 已增至 6 条，通过新增 `opened local module routes render real module pages` 用例覆盖今日履约、异常预警、时段缺口热力图、供应商管理、规则配置、报表中心、供应商复盘、操作审计、智能排班和接口集成 10 个模块，断言页面不是 dashboard 占位；最终 `bash scripts/check.sh` 通过。

- task_id: `F139`
- source_ids:
  - `R202`
- story_ids:
  - `US214`
- action: 完成本机导入 records 来源表格 parity。
- status: `done`
- notes: 共用 `ImportedRecordsSummary` 已新增来源表格和空态，展示 `数据源`、`行数`、`样本` 和 `最新批次`；模型层新增 `buildImportedRecordSourceRows`，按主数据、状态、登录、排班顺序汇总来源 rows。

- task_id: `Q065`
- source_ids:
  - `R203`
- story_ids:
  - `US215`
- action: 收口本机导入 records 来源表格 QA。
- status: `done`
- notes: 模型测试 76 条通过，E2E smoke 6 条通过并覆盖本机 CSV 导入后 dashboard 共用摘要表格列、`排班数据` 行和 `schedule_plan` 最新批次；Browser 可视化确认 dashboard 表格字段可见，最终 `bash scripts/check.sh` 通过。

- task_id: `F140`
- source_ids:
  - `R204`
- story_ids:
  - `US216`
- action: 完成文件导入页表格与空态 parity。
- status: `done`
- notes: `/demo-imports` 已新增 `最近导入批次` 表格和 `processed records 来源` 表格，分别展示数据源、状态、成功、失败、批次，以及数据源、行数、样本、最新批次；无数据时展示清晰空态，并继续标注本机运行态、不接数据库。

- task_id: `Q066`
- source_ids:
  - `R205`
- story_ids:
  - `US217`
- action: 收口文件导入页表格 parity QA。
- status: `done`
- notes: 模型测试 77 条通过，E2E smoke 6 条通过并覆盖本机 CSV 导入后 `/demo-imports` 最近导入批次表格、processed records 来源表格和 dashboard 读取结果；Browser 检查确认 `/demo-imports` 表格列、本机只读边界和桌面侧边栏可见，最终 `bash scripts/check.sh` 通过。

- task_id: `F141`
- source_ids:
  - `R206`
- story_ids:
  - `US218`
- action: 完成运营页面表格与空态 parity。
- status: `done`
- notes: `今日履约` 已新增 `今日履约输入表`，展示本机 processed records 的数据源、行数、最新批次和状态；`异常预警` 已从卡片队列调整为表格队列，展示异常、团队、时段、影响、级别和状态；两个页面均保留本机只读和 no-database 边界。

- task_id: `Q067`
- source_ids:
  - `R207`
- story_ids:
  - `US219`
- action: 收口运营页面表格 parity QA。
- status: `done`
- notes: 模型测试 79 条通过，E2E smoke 6 条通过并覆盖本机 CSV 导入后 `/today-fulfillment` 和 `/anomaly-alerts` 的表格字段、批次字段和 seed 异常队列；Browser 检查确认两个页面表格列、本机只读边界和桌面侧边栏可见，最终 `bash scripts/check.sh` 通过。
