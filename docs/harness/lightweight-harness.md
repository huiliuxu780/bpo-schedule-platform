# Lightweight Harness 项目版

## 1. 定位

本文件把外部讨论稿中的 Lightweight Harness 思路，转成 `bpo-schedule-platform` 当前 frontend dashboard scaffold + local scheduling-plan MVP vertical 阶段可执行的项目规则。

当前阶段的目标不是扩展生产业务能力，而是在已确认的 F001 静态前端脚手架和本地排班计划 MVP 纵切基础上，建立一套可追溯、可审计、可分阶段执行的需求闭环：

```txt
current context -> current story queue -> active task -> Gate Plan -> 执行 -> state check -> final check -> 绿色检查后本地提交 -> 继续/审计复盘
```

## 2. 当前边界

### 允许

- 维护 Harness 规则。
- 维护原始需求、用户故事、任务日志、决策日志和审计记录。
- 编写 Subagent 提示词模板。
- 拆分未来前端、后端、QA、文档任务。
- 明确依赖关系、优先级、阻塞项和验收标准。

### 禁止

除非 PM 后续明确批准进入新的工程初始化或业务开发 Gate，否则不得：

- 创建超出 F001/F005/F006/F007 或后续确认 Gate 的真实业务页面。
- 创建超出 B001/B002 或后续确认 Gate 的生产后端服务。
- 接入真实 API、数据库或生产权限。
- 新增超出已确认前端脚手架和本地纵切范围的 mock 业务数据。
- 安装依赖。
- 修改 `package.json` 或 lockfile。
- 从 lab archive 搬运代码。
- 修改业务指标、状态码、结算公式或收费因子。

## 3. 项目核心信息

- 项目名称：`bpo-schedule-platform`
- 当前阶段：frontend dashboard scaffold + local scheduling-plan MVP vertical + documentation-first Harness
- 项目目标：为 BPO 人力计划、排班履约、异常工时和结算复盘建立可审计的产品与工程闭环。
- 前端方向：Next.js / React / TypeScript / shadcn/ui / Tailwind / Lucide 已用于当前 dashboard scaffold 和排班计划纵切；新增页面或 package 变化仍需 Gate。
- 后端方向：Python / FastAPI 本地 read/draft API 已用于排班计划纵切；数据库、ORM、认证和生产权限仍需另行 Gate。
- 图表方向：F001 允许 Recharts 作为静态 prototype 的 shadcn dashboard chart 例外；未来图表层替换仍需另行 Gate。
- 工具方向：`scripts/check.sh` 已覆盖 frontend lint/typecheck/build 与 backend unittest；E2E 和 CI 仍需分阶段引入。

## 4. 文档结构

```txt
docs/
  current/
    PROJECT_CONTEXT.md
    STORY_QUEUE.yaml
    ACTIVE_TASKS.yaml
    BLOCKERS.md
  registry/
    TRACE_INDEX.yaml
    DECISION_INDEX.yaml
  harness/
    lightweight-harness.md
  raw-requirements.md
  user-stories.md
  task-log.md
  decision-log.md
  audit-report.md
  prompts/
    README.md
    pm_agent_prompts.md
    uiux_agent_prompts.md
    frontend_agent_prompts.md
    backend_agent_prompts.md
    qa_agent_prompts.md
    doc_agent_prompts.md
    implementer_prompt.md
    spec_reviewer_prompt.md
    code_quality_reviewer_prompt.md
```

说明：

- `docs/current/PROJECT_CONTEXT.md` 记录当前阶段、边界、默认下一步和禁止事项。
- `docs/current/STORY_QUEUE.yaml` 是 Story Runner 的默认 story 队列，只保留 `ready`、`in_progress`、`blocked`。
- `docs/current/ACTIVE_TASKS.yaml` 是当前可执行 task 的唯一执行入口。
- `docs/current/BLOCKERS.md` 只记录当前有效阻塞。
- `docs/registry/TRACE_INDEX.yaml` 只记录 ID、路径和关联关系，禁止记录状态。
- `docs/registry/DECISION_INDEX.yaml` 只索引关键决策，不复制决策全文。
- `raw-requirements.md` 记录 PM 原始需求，不做过度加工。
- `user-stories.md` 将原始需求拆成可验收的最小交付单元。
- `task-log.md` 记录任务执行过程、状态和阻塞。
- `decision-log.md` 记录重要产品、技术、范围决策。
- `audit-report.md` 记录追溯、风险、阻塞和闭环检查。
- `docs/prompts/` 保存各类 Agent 的提示词模板。

## 5. 原始需求管理

每条原始需求必须具备：

- `id`：例如 `R001`。
- `module`：业务模块。
- `description`：PM 原始描述。
- `source`：需求来源。
- `submitted_at`：提交日期。
- `version`：版本号。
- `status`：`draft` / `confirmed` / `split` / `blocked` / `done`。
- `notes`：补充说明。

新增需求时，先进入 `raw-requirements.md`，不得直接跳到开发。

## 6. 用户故事拆分

每条用户故事必须具备：

- `id`：例如 `US001`。
- `requirement_ids`：关联的原始需求。
- `module`：业务模块。
- `role`：用户角色。
- `story`：用户故事描述。
- `task_type`：`product` / `uiux` / `frontend` / `backend` / `qa` / `docs`。
- `priority`：`P0` / `P1` / `P2`。
- `acceptance`：验收标准。
- `dependencies`：前置用户故事或决策。
- `status`：`draft` / `ready` / `blocked` / `in_progress` / `done`。

用户故事必须能追溯回至少一条原始需求。

## 7. DAG 与优先级管理

当前 DAG 以文档方式维护，不引入脚本或依赖。

新增用户故事时必须检查：

- 是否依赖未确认的业务口径。
- 是否依赖未确认的权限范围。
- 是否依赖未确认的数据来源。
- 是否依赖其他用户故事。
- 是否存在循环依赖。

若存在循环依赖或关键口径未确认，任务状态必须标记为 `blocked`，并在 `audit-report.md` 中记录。

## 8. Story Runner Mode

当 PM 明确要求“开始”“继续”“自动走完”“按用户故事开发”“挨个开发完测试完提交完”时，项目进入 Story Runner Mode。

Story Runner Mode 的主规则：

- 用户故事是默认执行单位，backlog 任务只是 story 的实现载体。
- Codex 必须先把 goal 拆成最小可验收用户故事，并按依赖顺序写入 `docs/current/STORY_QUEUE.yaml`。
- 每条可执行 story 必须在 `docs/current/ACTIVE_TASKS.yaml` 有对应 task。
- 一个用户故事内的 UI 细节反馈、验收修正、视觉微调和小 bug 修复，应归入当前 story，不再为每个小改动新建独立 `F00x`。
- 当一个 story 通过验证后，若未触发停止条件，Codex 应自动进入下一个 ready story。
- 每个 story 或任务通过 `bash scripts/check.sh` 后，应直接提交到本地 Git 仓库；阶段、模块块或连续开发块完成后再询问 PM 是否 push。
- `docs/current/STORY_QUEUE.yaml`、`docs/current/ACTIVE_TASKS.yaml` 和 `docs/registry/TRACE_INDEX.yaml` 必须保持一致。
- 过渡期仍可更新 `docs/user-stories.md`、`tasks/backlog.yaml`、`docs/task-log.md` 和 `docs/audit-report.md` 作为历史追溯，但它们不再是默认执行入口。
- current 或 registry 变化后必须运行 `bash scripts/check-state.sh`。

Story Runner Mode 的停止条件：

- 需求或验收标准不清楚。
- 需要新增依赖、修改 package 或 lockfile。
- 需要真实外部数据、数据库、认证、权限、审批、导出、批量或生产工作流。
- 需要确认生产状态码、公式、结算规则或收费因子。
- subagent 写入范围可能冲突。
- 验证失败。
- 需要破坏性 Git 或文件操作。

## 8A. 状态治理

项目使用 current/registry/archive 三层状态模型：

- current：只存当前可执行状态。
- registry：只存 ID、路径和关系索引。
- archive/legacy：只作为历史来源，不作为执行入口。

默认读取集：

```txt
AGENTS.md
docs/current/PROJECT_CONTEXT.md
docs/current/STORY_QUEUE.yaml
docs/current/ACTIVE_TASKS.yaml
docs/current/BLOCKERS.md
docs/quality/GATE_REGISTRY.md
当前任务涉及的具体文件
```

默认不读取：

```txt
tasks/backlog.yaml
docs/user-stories.md
docs/raw-requirements.md
docs/audit-report.md
docs/task-log.md
docs/dev/branch-log.md
docs/archive/**
```

History-On-Demand 只在当前信息不足、用户要求查历史、任务依赖历史决策、文档冲突、审计、复盘、回滚、事故定位或复用旧接口/模式时使用。普通开发最多读取 3 个历史文件，审计最多读取 8 个历史文件。

`docs/current/**` 和 `docs/registry/**` 只能由主 Worker 写入。Subagent 可以返回建议，但不能直接写 current/registry。

Archive 不可执行。恢复历史任务时必须新建 current task，并重新写明恢复原因和新的验收标准。

State Repair Mode 用于修复 queue/task/index 不一致、路径缺失、归档半完成或 `check-state` 阻断普通任务启动的问题。修复时不得改业务代码、package/lockfile、依赖、数据库或生产能力。

## 9. 阶段完成后的后续计划

每完成一个阶段、模块块或连续开发块，主 Agent 必须在 Done Report 中固定输出后续计划，避免 PM 无法判断项目推进方向。

输出结构必须包含：

1. 本阶段完成了什么
2. 验证是否通过
3. 当前还剩什么
4. 推荐下一阶段做哪 2-3 个
5. 为什么推荐这个顺序
6. 哪些事情暂时不建议做
7. 如果 PM 不反对，默认从推荐第 1 项继续开发

推荐顺序必须基于：

- 业务链路依赖
- 用户可见价值
- 当前实现风险
- 是否会触发新增依赖、数据库、认证、真实集成、审批、导出、批量、生产状态码、公式、结算规则或收费因子等停止条件

若推荐第 1 项不触发停止条件，Story Runner Mode 可以在 PM 未反对时继续执行；若触发停止条件，必须先停下说明原因。

阶段、模块块或连续开发块完成后，主 Agent 还必须询问 PM 是否 push 到远端；本地 commit 已由绿色检查后的自动提交规则处理。

## 10. Subagent 提示词管理

提示词模板放在 `docs/prompts/`。

Story Runner Mode 默认授权主 Worker 启动 bounded subagents，但必须满足：

- 任务已拆分清楚。
- 写入范围互不冲突。
- 已通过 Gate Plan。
- 主 Worker 提供 dispatch packet，包括 `task_id`、目标、输入文件、允许文件、禁止文件、停止条件和验收标准。
- 每个 Subagent 必须按 `docs/prompts/README.md` 返回结构化状态。

若不在 Story Runner Mode，subagent 启动仍需要 PM 明确授权 subagents、delegation 或 parallel agent work。

### Subagent Contract Files

- `docs/prompts/README.md`：统一 dispatch packet、状态码、停止条件和评审链路。
- `docs/prompts/pm_agent_prompts.md`：原始需求、用户故事、DAG 和歧义问题。
- `docs/prompts/uiux_agent_prompts.md`：页面结构、组件清单、交互状态和设计风险。
- `docs/prompts/frontend_agent_prompts.md`：前端执行或计划合同。
- `docs/prompts/backend_agent_prompts.md`：后端执行或计划合同。
- `docs/prompts/qa_agent_prompts.md`：验收矩阵、测试计划和验证风险。
- `docs/prompts/doc_agent_prompts.md`：追溯、任务日志、决策日志和审计报告。
- `docs/prompts/implementer_prompt.md`：通用实现子 Agent 合同。
- `docs/prompts/spec_reviewer_prompt.md`：范围与需求符合性评审合同。
- `docs/prompts/code_quality_reviewer_prompt.md`：代码质量、测试和维护性评审合同。

### Implementation Review Chain

When implementation is explicitly approved, the default review chain is:

```txt
Implementer -> Spec Reviewer -> Code Quality Reviewer -> Main Worker Integration -> Verification -> Done Report
```

Reviewer agents are read-only. They must return findings instead of modifying files.

### Current Skill Mapping

Prompt templates must reference skills that are actually available in the current Codex environment.

Do not use placeholder skill names such as:

- `user_story`
- `dag_scheduler`
- `code_generation`
- `ui_design`
- `testing`

Use current available skills such as:

- `superpowers:brainstorming`
- `superpowers:writing-plans`
- `superpowers:test-driven-development`
- `superpowers:systematic-debugging`
- `superpowers:verification-before-completion`
- `superpowers:dispatching-parallel-agents`
- `superpowers:subagent-driven-development`
- `superpowers:requesting-code-review`
- `browser-use:browser`
- `figma`
- `figma-implement-design`
- `figma-create-design-system-rules`
- `shadcn` via `/Users/mac/.codex/skills/shadcn/SKILL.md`
- `imagegen`
- `doc`
- `documents:documents`
- `pdf`
- `spreadsheets:Spreadsheets`

### shadcn Skill Usage

The local shadcn skill at `/Users/mac/.codex/skills/shadcn/SKILL.md` should be used when a task involves:

- adding, updating, composing, styling, fixing, or reviewing shadcn/ui components
- using `components.json`
- checking installed shadcn components
- consulting component docs, examples, registries, or presets
- applying dashboard, sidebar, table, card, chart, form, dialog, sheet, badge, tooltip, or theme-token patterns

Agent assignment:

- UI/UX Agent: use for component selection, layout composition, shadcn dashboard alignment, and design-system constraints.
- Frontend Agent: use for frontend implementation, component composition, shadcn CLI checks, theme-token usage, and avoiding hand-rolled UI.
- Implementer: use when the assigned task touches shadcn UI files or component composition.
- Code Quality Reviewer: use when reviewing frontend changes for shadcn correctness, semantic tokens, composition, accessibility, and anti-patterns.
- QA Agent: may use as a reference for UI acceptance checks, but should primarily focus on acceptance, verification, and risk.
- PM Agent, Backend Agent, and Doc Agent: do not use by default unless the task explicitly concerns frontend component rules or shadcn documentation.

The shadcn skill does not authorize dependency installation, package changes, preset application, component overwrite, or registry changes unless the confirmed Gate explicitly allows them.

## 10. 主 Worker 闭环

每次需求进入项目后，主 Worker 应按以下顺序执行：

1. 读取 `AGENTS.md`、`docs/current/PROJECT_CONTEXT.md`、`docs/current/STORY_QUEUE.yaml`、`docs/current/ACTIVE_TASKS.yaml`、`docs/current/BLOCKERS.md`、`docs/quality/GATE_REGISTRY.md`。
2. 将 PM 输入登记为原始需求。
3. 拆成用户故事。
4. 标记依赖、优先级和阻塞项。
5. 输出中文 Gate Plan。
6. 需要确认时等待 PM 确认。
7. 在允许范围内执行。
8. 运行 `bash scripts/check.sh`。
9. 更新 `docs/dev/branch-log.md`。
10. 输出中文 Done Report。

若任务进入 subagent 执行，主 Worker 仍然负责：

- 分派前确认写入范围互不冲突。
- 汇总 Subagent 输出。
- 处理 `BLOCKED`、`NEEDS_CONTEXT`、`DONE_WITH_CONCERNS`。
- 执行最终验证。
- 更新任务日志、审计报告和 Done Report。

## 11. 审计规则

审计关注四件事：

- 每条用户故事是否能追溯到原始需求。
- 每个开发任务是否有明确 Gate 和验收标准。
- 每个阻塞项是否有记录和建议处理方式。
- 每次完成是否更新日志并执行检查。

审计结果写入 `docs/audit-report.md`。

## 12. 分阶段升级路线

### 阶段 1：文档型 Harness

已完成。建立规则、模板和追溯文档。

### 阶段 2：静态前端脚手架 Harness

已完成并持续作为当前 UI 基线。F001 允许静态 dashboard scaffold、前端 package 文件、local mock data 和 shadcn/ui 风格组件。

### 阶段 3：本地排班计划纵切 Harness

当前阶段。B001/B002/F005/F006/F007/Q001/Q002 已允许并验收本地排班计划纵切，包括：

- Python + FastAPI read/draft API。
- 本地 seed / in-memory draft 数据。
- 排班计划列表、详情、新建草稿、编辑草稿入口。
- frontend lint/typecheck/build。
- backend unittest。
- `bash scripts/check.sh` 统一验证。

该阶段仍不包含数据库持久化、认证、权限、真实 Excel、真实 CORN、发布审批、导出、批量、生产公式或收费因子。

### 阶段 4：工程质量扩展 Harness

需 PM 另行确认。可能包括：

- E2E 框架。
- CI 或本地检查增强。
- 数据库与迁移方案。
- 认证、权限和审计日志。
- 部署、环境变量和健康检查。

### 阶段 5：业务实现 Harness

需按模块逐个进入 Gate。每个模块必须先完成：

- 原始需求登记。
- 用户故事拆分。
- 依赖排序。
- 验收标准确认。
- 风险审计。
