# Harness Audit

## 维度判断

| 维度 | 判断 | 说明 |
| --- | --- | --- |
| 是否能让项目状态清晰 | 部分有效 | `docs/current/**` 很清楚，当前 queue/active/blocker 都是空；但 `PROJECT_CONTEXT.md` 已经有较长历史摘要。 |
| 是否能指导 Codex 下一步行动 | 有效 | `STORY_QUEUE.yaml`、`ACTIVE_TASKS.yaml`、`BLOCKERS.md` 能明确是否可执行。当前为空，能阻止乱猜任务。 |
| 是否能保护主分支 | 有效 | 规则要求非 main 开发，hooks/check-state/check.sh 能挡住无任务 diff、越界文件和坏状态。 |
| 是否有可执行检查命令 | 有效 | `bash scripts/check.sh`、`scripts/check-state.sh`、commit-msg validator、hooks 都存在。 |
| 是否有过度设计 | 存在 | legacy backlog/user-stories/audit/log 文件很大，trace index 已超过 warning budget；对小任务来说记录成本偏高。 |
| 是否让流程变慢 | 存在 | seed/closeout/traceability 对 1-2 行 UI 修复也需要多文件更新，执行成本明显。 |
| 是否存在文档很多但决策不清 | 部分存在 | 关键决策在 current 和 quality docs 清楚，但历史日志过长，读错入口会降低效率。 |

## 应该保留的 harness 文件/机制

- `AGENTS.md`：只保留硬规则、项目边界、默认入口。
- `docs/current/PROJECT_CONTEXT.md`：保留，但应继续压缩人类摘要。
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`
- `docs/quality/GATE_REGISTRY.md`
- `docs/quality/STATE_MANAGEMENT.md`
- `scripts/check.sh`
- `scripts/check-state.sh`
- `scripts/hooks/pre-commit`
- `scripts/hooks/commit-msg`
- `scripts/hooks/pre-push`
- `docs/registry/TRACE_INDEX.yaml`：保留为索引，但继续压缩。

## 应该删除或降级的机制

- 不建议删除 legacy 文件，但应降级为历史账本，不再默认读取：
  - `tasks/backlog.yaml`
  - `docs/user-stories.md`
  - `docs/raw-requirements.md`
  - `docs/audit-report.md`
  - `docs/task-log.md`
  - `docs/dev/branch-log.md`
- `PROJECT_CONTEXT.md` 不应继续追加每个小故事的长描述；只保留当前阶段、最新完成、下一步和禁区。
- 对小型 UI 修复，不建议要求过多自然语言日志；可以保留 task-log/audit 的短条目。
- `TRACE_INDEX.yaml` 已 426 行，超过 warning budget 420；应做窗口化或压缩，不要继续无限追加。

## 当前 harness 的一句话结论

当前 Harness 有效，但偏重；它能保护边界和主分支，但需要瘦身历史层和减少小任务 closeout 成本。

## 推荐的轻量 harness 结构

默认执行只读这组：

```txt
AGENTS.md
docs/current/PROJECT_CONTEXT.md
docs/current/STORY_QUEUE.yaml
docs/current/ACTIVE_TASKS.yaml
docs/current/BLOCKERS.md
docs/quality/GATE_REGISTRY.md
```

保留检查：

```txt
bash scripts/check-state.sh --strict --diff=working
bash scripts/check.sh
```

历史按需读取：

```txt
docs/registry/TRACE_INDEX.yaml -> exact legacy section
```

建议瘦身规则：

- current 只保留当前执行状态。
- trace index 只保留 active 和最近窗口，旧项压缩或归档。
- task-log/audit/branch-log 只写短证据，不复制长验收。
- 小修复允许批量 closeout，但仍需 clear allowed files 和 verification。
