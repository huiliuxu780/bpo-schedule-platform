# Decision Log

本文件记录影响项目范围、技术方向、产品口径和 Harness 流程的重要决策。

## Decisions

### 2026-05-11 - D001 - 采用文档型 Lightweight Harness 升级

- 决策：先采用方案 A，将 Lightweight Harness 思路落为文档、规则和提示词模板。
- 原因：项目仍处于 clean Harness initialization，不能直接创建真实前端、后端、依赖和 E2E 工程。
- 影响：新增原始需求、用户故事、DAG、Subagent prompt、任务日志、决策日志和审计报告的文档闭环。
- 限制：不修改业务代码，不安装依赖，不修改 package 或 lockfile。

### 2026-05-11 - D002 - 图表库默认不写死

- 决策：正式图表层保持待 PM 确认，不默认使用 Recharts。
- 原因：此前 PM 已表达不希望默认使用 Recharts，且当前阶段尚未进入前端工程实现。
- 影响：未来图表方案必须单独 Gate，并与 shadcn/ui 前端规则保持一致。
- 更新：D005 记录了 F001 静态 prototype 的 Recharts 例外，该例外不改变正式图表层默认不写死的原则。

### 2026-05-11 - D003 - Subagent prompt 采用合同化结构

- 决策：将 Subagent prompt 从角色说明升级为 Prompt Contract。
- 原因：未来开发可能涉及多 Agent 协作，必须提前约束输入、输出、允许文件、禁止文件、停止条件和评审链路。
- 影响：Subagent 不能凭角色自由发挥，必须接收 dispatch packet 并返回结构化状态。
- 限制：该决策不授权自动启动 subagent，也不授权新的业务能力开发。

### 2026-05-11 - D004 - shadcn skill 归属 UI/UX、Frontend、Implementer 和 Code Review

- 决策：将 `/Users/mac/.codex/skills/shadcn/SKILL.md` 作为 shadcn-specific frontend work 的本地 skill 参考。
- 原因：项目已采用 shadcn/ui dashboard 方向，未来组件选择、组合、主题 token、CLI 行为和反模式检查都需要统一规则。
- 影响：UI/UX Agent、Frontend Agent、Implementer、Code Quality Reviewer 应在相关任务中使用该 skill；QA Agent 仅作为 UI 验收参考；PM、Backend、Doc Agent 默认不使用。
- 限制：该决策不授权 shadcn CLI 写入、preset 变更、依赖安装、package 修改或组件覆盖。

### 2026-05-11 - D005 - F001 Recharts 例外仅限静态 prototype

- 决策：F001 允许跟随官方 shadcn dashboard chart structure 使用 Recharts。
- 原因：F001 的目标是静态 dashboard prototype，对齐 shadcn 官方 dashboard 结构优先于正式图表层选型。
- 影响：F001 可以保留 `recharts` 用于趋势图静态展示。
- 限制：该例外不代表正式图表层默认使用 Recharts；后续图表库替换、ECharts 评估或生产图表封装必须单独 Gate。

### 2026-05-11 - D006 - 开发前验证必须暴露前端工具链状态

- 决策：`scripts/check.sh` 必须检查 frontend scaffold 文件、F001 状态以及前端工具链可用性。
- 原因：仅检查文件存在会造成“看起来通过但无法 coding”的假阳性。
- 影响：若 `node_modules/.bin/eslint`、`tsc` 或 `next` 缺失，`scripts/check.sh` 应失败并提示需要单独依赖安装 Gate。
- 限制：H006 不安装依赖，也不修改 package 或 lockfile。

### 2026-05-11 - D007 - 本地开发与交付验证固定使用 Node.js 22

- 决策：项目通过 `.nvmrc`、`.node-version` 和 `scripts/check.sh` 固定使用 Node.js 22。
- 原因：本机默认 Node.js 24 会触发 Next.js / lightningcss 原生 `.node` 包加载问题；Homebrew `node@22` 已验证可以通过完整交付检查。
- 影响：`bash scripts/check.sh` 会优先使用 `/opt/homebrew/opt/node@22/bin`，新成员应按 `docs/dev/setup.md` 配置本地环境。
- 限制：该决策只处理本地运行时和验证入口，不授权新增依赖、修改 package 或 lockfile、开发业务功能、接入后端或真实数据源。

### 2026-05-11 - D008 - 正式 MVP 第一条纵切选择排班计划

- 决策：正式系统建设采用前后端一条纵切启动，第一条纵切为排班计划列表、排班计划详情、FastAPI 只读接口和本地种子数据。
- 原因：该路径能同时验证前端页面、后端接口、数据契约和交付流程，避免继续只做静态前端或提前铺开完整后端。
- 影响：后续 backlog 先进入 `B001`、`F005`、`Q001`，围绕排班计划纵切闭环。
- 限制：第一条纵切不做新增、编辑、发布、审批、导出、批量操作、认证、数据库、真实 Excel、真实 CORN、智能排班、生产状态码最终定稿、结算公式或收费因子。

### 2026-05-11 - D009 - B001 后端只读纵切采用本地种子数据

- 决策：B001 创建最小 Python + FastAPI 后端，只提供排班计划列表和详情只读接口，数据来自本地种子数据。
- 原因：第一条纵切需要验证前后端契约，但不应提前引入数据库、认证、真实 Excel、真实 CORN 或生产工作流。
- 影响：`scripts/check.sh` 现在会检查 backend 必需文件、FastAPI/Pydantic 可用性，并运行 `python3 -m unittest discover -s backend/tests -v`。
- 限制：B001 不提供新增、编辑、发布、审批、导出、批量操作、认证、数据库、真实外部集成、生产状态码最终定稿、结算公式或收费因子。

### 2026-05-11 - D010 - F005 前端通过集中 API client 读取排班计划

- 决策：F005 新增 `/schedule-plans` 列表页和 `/schedule-plans/[planId]` 详情页，通过 `lib/schedule-plans.ts` 统一读取 B001 数据契约。
- 原因：第一条纵切需要让前端页面、后端接口和数据结构闭环，而不是继续扩大 dashboard 内部静态 mock。
- 影响：排班计划 UI 现在具备可导航列表、详情、0.5h 时段表、计划状态、缺口和覆盖率展示；本地开发在后端未启动时使用同契约 fallback 数据保证 Next 构建可完成。
- 限制：F005 不新增依赖，不修改 package 或 lockfile，不提供新增、编辑、发布、审批、导出、批量操作、认证、数据库、真实 Excel、真实 CORN、生产状态码最终定稿、结算公式或收费因子。

### 2026-05-11 - D011 - B002 草稿能力仅限本地内存

- 决策：B002 在 FastAPI 中新增排班计划草稿创建与更新接口，数据仍保存在本地进程内存列表中。
- 原因：第二条纵切需要让系统从只读查看推进到受控草稿编辑，但还不能提前引入数据库、认证、权限或生产工作流。
- 影响：后端现在提供 `POST /api/v1/schedule-plans/drafts` 和 `PUT /api/v1/schedule-plans/{plan_id}/draft`，并由服务端计算汇总字段。
- 限制：B002 只允许更新 `draft` 状态计划；不提供发布、审批、导出、批量操作、权限、数据库持久化、真实 Excel、真实 CORN、生产状态码最终定稿、结算公式或收费因子。

### 2026-05-11 - D012 - 采用 Story Runner 作为默认连续交付模式

- 决策：正式开发默认以用户故事为执行单位，而不是为每个小 UI 反馈或实现细节新建任务。
- 原因：PM 明确反馈此前 Codex 频繁切换小 Gate，导致用户故事主线被 backlog 执行项挤到旁边，影响开发节奏。
- 影响：当 PM 要求“开始”“继续”“自动走完”“按用户故事开发”“挨个开发完测试完提交完”时，Codex 应进入 Story Runner Mode，按依赖顺序自动实现、验证、提交并进入下一个 ready story。
- Subagent：Story Runner Mode 下允许主 Worker 默认启动 bounded subagents，前提是写入范围清晰且互不冲突；主 Worker 负责整合、最终验证、提交和 Done Report。
- 限制：该模式不绕过新增依赖、package/lockfile、真实数据、数据库、认证、权限、审批、导出、批量、生产状态码/公式/结算/收费因子、破坏性操作或失败验证等停止条件。

### 2026-05-12 - D013 - 绿色检查后自动本地提交

- 决策：以后本项目每完成一个通过 `bash scripts/check.sh` 的任务，Codex 必须自动提交到本地 Git 仓库；阶段、模块块或连续开发块完成后再询问 PM 是否 push。
- 原因：PM 希望代码仓库随任务完成持续留痕，但仍希望远端 push 保持确认点，避免把未检查或未确认范围推到 GitHub。
- 影响：普通任务不再停在“建议 commit”；Done Report 应报告本地 commit 状态和是否建议 push。
- 限制：检查失败、无法安全分离的无关改动、未确认依赖/package/真实集成/数据库/认证/权限/审批/导出/批量/生产口径、或破坏性 Git 操作时，仍必须暂停。

### 2026-05-12 - D014 - backlog workflow 必须映射到 Gate Registry

- 决策：`tasks/backlog.yaml` 中出现的每个 `required_workflow` 必须能在 `docs/quality/GATE_REGISTRY.md` 找到对应 Gate。
- 原因：此前 backlog 已使用 `frontend-scaffold`、`frontend-audit`、`backend`、`backend-mvp`、`backend-vertical`、`qa` 等 workflow，但 Gate Registry 只有默认 Gate 和 Clean Harness Gate，执行标准容易依赖个人解释。
- 影响：后续新增 workflow 名称时，必须在同一任务内补充 Gate Registry；Story Runner 选择下一条任务时也要先确认该 workflow 有 Gate 锚点。
- 限制：Gate 映射只定义执行约束，不授权新增业务代码、依赖、真实数据、数据库、认证、权限、审批、导出、批量、生产状态码、公式、结算规则或收费因子。

### 2026-05-12 - D015 - AGENTS 保持短入口，Git 工作流迁入 runbook

- 决策：`AGENTS.md` 只保留规则优先级、入口、分支红线、stop condition、Story Runner、push 控制和前端规则摘要等强制原则；命令级分支/worktree/集成/异常处理迁入 `docs/quality/GIT_BRANCH_WORKFLOW.md`，详细前端规则迁入 `docs/quality/FRONTEND_RULES.md`。
- 原因：`AGENTS.md` 已经接近操作手册体量，继续追加会增加规则重复和执行歧义；拆分后主入口更容易被每次任务读取和遵守。
- 影响：后续任务必须从 fast-forward 同步后的 `main` 创建任务分支，最终 check 后更新 traceability，再本地 commit；阶段/模块块完成后才进入集成和 PM push 决策。
- 限制：该决策只改变 Harness 执行流程和审计证据，不授权业务实现、依赖/package/lockfile、真实数据、数据库、认证、权限、审批、导出、批量或生产口径变更。

### 2026-05-12 - D016 - MVP 功能完备前保持 No Database Mode

- 决策：在当前没有数据库环境的情况下，本地 MVP 功能开发继续保持 No Database Mode，不创建数据库连接、ORM、migration、schema 实现或生产持久化配置。
- 原因：PM 明确希望在功能开发完毕前先不要接数据库，避免因环境缺失拖慢风险明细、不可用影响和 table parity 等主线交付。
- 影响：后续业务链路继续使用本地 FastAPI seed/process-memory 数据和前端 fallback 契约验证；任何数据库相关实现都必须另开 PM-confirmed Gate。
- 限制：该决策不禁止本地 MVP 业务页面、导航、只读/草稿链路和展示层迁移；但禁止真实数据接入、数据库持久化、认证、权限、审批、导出、批量、生产状态码/公式/结算/收费因子。

### 2026-05-12 - D017 - 开发服务器入口必须先过原生运行时预检

- 决策：`npm run dev` 与 `scripts/dev.sh` 必须通过受控 Node.js 22 入口启动，并在启动 Next.js 前显式预检 `lightningcss` 与 `@next/swc-darwin-arm64` 原生包加载。
- 原因：本机默认 Codex Node.js 24 会因 macOS code-signing 校验拒载 native addon，之前症状会拖到 dev server 启动后，表现为 500、模块缺失或 Turbopack/webpack 分叉问题。
- 影响：前端开发入口现在统一走 `scripts/run-next-dev.sh`，默认使用 webpack dev server，并把 native runtime 回归测试纳入 `bash scripts/check.sh`。
- 限制：该决策不新增依赖、不修改 lockfile、不授权业务代码、后端契约、真实数据、数据库、认证、权限、审批、导出、批量能力或生产口径变更。

### 2026-05-12 - D018 - backend 开发运行时固定为 Python 3.12

- 决策：backend 开发与验证入口固定使用 Python 3.12，并通过 `.python-version` 与 `scripts/verify-backend-runtime.sh` 显式验证版本和模块依赖。
- 原因：当前机器同时存在系统 Python 3.9.6 和项目可用 Python 3.12.13；如果继续按“谁先出现在 PATH 且能 import 依赖就用谁”的策略，换机器或环境变化时会产生隐性运行时漂移。
- 影响：`scripts/check.sh` 与 `scripts/dev.sh` 现在都通过统一后端运行时验证脚本选择解释器，系统 Python 3.9 不会再被误当作项目 backend runtime。
- 限制：该决策不新增依赖、不修改业务代码、后端契约、数据库、认证、权限、审批、导出、批量能力或生产口径。

### 2026-05-12 - D019 - 默认执行状态切到 current/registry 层

- 决策：项目默认启动上下文从 legacy backlog/user stories 大文件切换到 `docs/current/**`，并用 `docs/registry/**` 做历史定位索引。
- 原因：PM 希望降低默认上下文长度，同时避免拆文件后产生状态漂移、索引失真、check 自锁和并行写冲突。
- 影响：Story Runner 默认从 `docs/current/STORY_QUEUE.yaml` 找 story，从 `docs/current/ACTIVE_TASKS.yaml` 找 task；`TRACE_INDEX.yaml` 只存 ID、路径和关系，不存状态；`scripts/check-state.sh` 先以 warning-only 方式验证状态一致性。
- 限制：archive 和 legacy 文件不可直接作为执行队列；subagent 不得写 current/registry；本决策不授权业务代码、依赖、package/lockfile、数据库、真实集成、权限、审批、导出、批量或生产口径变更。

### 2026-05-12 - D020 - check-state 先进入标准检查但保持 warning-only

- 决策：`bash scripts/check.sh` 运行 `bash scripts/check-state.sh` 和 state-check 回归测试，但状态检查默认仍保持 warning-only。
- 原因：PM 要求治理继续推进，但 v3 方案明确前 1-2 个任务不应让状态系统自锁；先进入标准检查可以提升可观测性，同时用回归测试约束未来 strict 升级。
- 影响：普通检查会显示 current/registry 漂移；严格失败场景由 `scripts/tests/check-state.test.mjs` 覆盖，未来升级到阻断模式时有测试依据。
- 限制：该决策不迁移大量历史，不删除旧大文件，不授权业务代码、依赖、package/lockfile、数据库、真实集成、权限、审批、导出、批量或生产口径变更。
