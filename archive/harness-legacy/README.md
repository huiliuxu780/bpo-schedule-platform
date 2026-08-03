# Harness Legacy Archive

归档日期：2026-08-04

这里存放项目早期的重流程 harness 资料（Gate 体系、backlog、多角色提示词、状态治理、追踪索引等），仅作历史参考，**不再作为开发规则或执行队列**。

当前生效的开发规则只有三个文件（位于项目根目录）：

- `AGENTS.md` — 开发规则
- `PRODUCT.md` — 产品北极星
- `ROADMAP.md` — 里程碑路线

## 内容说明

| 内容 | 说明 |
|---|---|
| `backlog.yaml` | 264 个历史任务（IM001-IM171 等），全部已完成 |
| `docs/quality/` | Gate Plan / Registry / Done Report 模板体系 |
| `docs/prompts/` | PM/QA/UIUX 等多角色 agent 提示词 |
| `docs/harness/` | Lightweight Harness 流程说明 |
| `docs/current/` | 旧双层状态系统的 current 层 |
| `docs/registry/` | TRACE_INDEX / DECISION_INDEX |
| `docs/raw-requirements.md` | 原始需求（3,200 行，历史参考） |
| `docs/user-stories.md` | 用户故事全集（5,700 行，历史参考） |
| `scripts/` | check-state / shadcn 基线等 harness 检查脚本 |

如需追溯某个历史决策或需求原文，可在此目录检索；开发新功能时不要从这里派生任务。
