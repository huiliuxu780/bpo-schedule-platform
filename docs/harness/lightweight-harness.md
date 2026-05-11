# Lightweight Harness 项目版

## 1. 定位

本文件把外部讨论稿中的 Lightweight Harness 思路，转成 `bpo-schedule-platform` 当前 frontend dashboard scaffold 阶段可执行的项目规则。

当前阶段的目标不是扩展真实业务能力，而是在已确认的 F001 静态前端脚手架基础上，建立一套可追溯、可审计、可分阶段执行的需求闭环：

```txt
原始需求 -> 用户故事 -> DAG 依赖排序 -> Gate Plan -> PM 确认 -> 小步执行 -> Done Report -> 审计复盘
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

- 创建超出 F001 或后续确认 Gate 的真实业务页面。
- 创建真实后端服务。
- 接入真实 API、数据库或生产权限。
- 新增 mock 业务数据。
- 安装依赖。
- 修改 `package.json` 或 lockfile。
- 从 lab archive 搬运代码。
- 修改业务指标、状态码、结算公式或收费因子。

## 3. 项目核心信息

- 项目名称：`bpo-schedule-platform`
- 当前阶段：frontend dashboard scaffold + documentation-first Harness
- 项目目标：为 BPO 人力计划、排班履约、异常工时和结算复盘建立可审计的产品与工程闭环。
- 前端方向：Next.js / React / TypeScript / shadcn/ui / Tailwind / Lucide，实际工程初始化需另行 Gate。
- 后端方向：Python / FastAPI，数据库与 ORM 选择需另行 Gate。
- 图表方向：图表库待 PM 确认；不得默认使用 Recharts。
- 工具方向：检查脚本、测试、E2E 和 CI 均需分阶段引入，不在 clean Harness 阶段一次性落地。

## 4. 文档结构

```txt
docs/
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

## 8. Subagent 提示词管理

提示词模板放在 `docs/prompts/`。

当前阶段只建立模板，不自动启用多 Agent 并行执行。若后续需要使用 Subagent，必须满足：

- 任务已拆分清楚。
- 写入范围互不冲突。
- 已通过 Gate Plan。
- PM 已确认允许多 Agent 或并行执行。
- 用户明确允许 subagent、delegation 或 parallel agent work。
- 主 Worker 提供 dispatch packet，包括 `task_id`、目标、输入文件、允许文件、禁止文件、停止条件和验收标准。
- 每个 Subagent 必须按 `docs/prompts/README.md` 返回结构化状态。

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

## 9. 主 Worker 闭环

每次需求进入项目后，主 Worker 应按以下顺序执行：

1. 读取 `AGENTS.md`、`docs/PROJECT_STATE.md`、`tasks/backlog.yaml`、`docs/quality/GATE_REGISTRY.md`。
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

## 10. 审计规则

审计关注四件事：

- 每条用户故事是否能追溯到原始需求。
- 每个开发任务是否有明确 Gate 和验收标准。
- 每个阻塞项是否有记录和建议处理方式。
- 每次完成是否更新日志并执行检查。

审计结果写入 `docs/audit-report.md`。

## 11. 分阶段升级路线

### 阶段 1：文档型 Harness

已完成。建立规则、模板和追溯文档。

### 阶段 2：静态前端脚手架 Harness

当前阶段。F001 允许静态 dashboard scaffold、前端 package 文件、local mock data 和 shadcn/ui 风格组件。

### 阶段 3：工程初始化扩展 Harness

需 PM 另行确认。可能包括：

- 前端工程初始化。
- 后端工程初始化。
- 基础 lint / build / test。
- E2E 框架。
- CI 或本地检查增强。

### 阶段 4：业务实现 Harness

需按模块逐个进入 Gate。每个模块必须先完成：

- 原始需求登记。
- 用户故事拆分。
- 依赖排序。
- 验收标准确认。
- 风险审计。
