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
