# Git Branch Workflow

本文件是任务分支、worktree、验证、提交、集成和推送确认的命令级 runbook。最高规则仍以 `AGENTS.md` 为准；单任务 `allowed_files`、`forbidden_files` 和 `stop_conditions` 优先生效。

## 1. Task Start

每个非 trivial 任务开始前必须读取：

- `AGENTS.md`
- `docs/current/PROJECT_CONTEXT.md`
- `docs/current/STORY_QUEUE.yaml`
- `docs/current/ACTIVE_TASKS.yaml`
- `docs/current/BLOCKERS.md`
- `docs/quality/GATE_REGISTRY.md`
- 当前任务文件

Legacy 文件如 `docs/PROJECT_STATE.md`、`tasks/backlog.yaml`、`docs/task-log.md`、`docs/dev/branch-log.md` 只在 History-On-Demand、审计、迁移、修复、或当前 Gate 明确需要 traceability 时读取。

如果任务不在 current queue、scope 不清、或没有明确 allowed/forbidden 文件，先输出 Gate Plan，不直接开发。ready queue 为空时，不得自动猜下一步；必须先补候选 requirement/story/Gate。

## 2. Branch Creation

禁止在 `main` 直接开发。

创建任务分支前：

1. 确认当前工作区是否干净：`git status --short --branch`
2. 如果当前不在 `main`，确认当前分支没有未提交工作；无法安全切换时标记 blocked。
3. 同步远端：`git fetch origin`
4. 切到 `main`
5. 快进同步：`git pull --ff-only origin main`
6. 记录 `base_main_commit`：`git rev-parse main`
7. 创建任务分支：`git switch -c codex/<task-id>-<short-name>`

如果 `git pull --ff-only` 失败，不自动 merge 或 rebase `main`；记录 blocked，由 PM 决定处理方式。

如果没有远端或没有 `origin/main`，记录 `remote_status: unavailable`，以本地 `main` 当前 commit 作为 `base_main_commit`。该场景不能 push，除非 PM 后续确认远端策略。

## 3. Story Runner Branch Scope

默认一个 backlog task 对应一个 task branch。

Story Runner 下，同一模块块、同一风险等级、同一 allowed_files 范围内的多个 ready stories 可以共用一个任务分支。

以下情况必须新分支：

- 跨模块 work
- 高风险 story
- 新依赖或 package/lockfile 变更
- 真实数据、数据库、认证、权限、审批、导出、批量能力
- 生产状态码、公式、结算规则、收费因子
- allowed_files 明显变化

ready queue 为空时，不得自动猜下一步；必须先补 ready 项。

## 4. Worktree Rules

同时满足以下条件才启用 `git worktree`：

- 存在 2 个以上可并行 ready 任务
- 写入范围不重叠
- 任务之间没有依赖关系
- 任务不是当前主链路阻塞项
- 每个 worktree 可以独立运行 `bash scripts/check.sh`

每个 worktree 只对应一个任务分支。子任务完成后，由主 worker 复核 diff、集成结果并运行最终验证。子 agent 不单独 push；除非 dispatch packet 明确允许，也不单独 commit。

## 5. Development Loop

只修改当前任务 `allowed_files`。默认允许在任务完成时更新以下 traceability 文件，除非任务显式禁止：

- `docs/task-log.md`
- `docs/dev/branch-log.md`
- `docs/audit-report.md`
- `docs/current/**` 和 `docs/registry/**`，仅限当前任务确实改变执行状态或索引关系时

开发过程中可以运行局部预检，但最终完成前必须运行全量：

```bash
bash scripts/check.sh
```

如果触发 hard stop condition，暂停并向 PM 确认。

## 6. Final Verification And Commit

完成实现后：

1. 运行 `bash scripts/check.sh`
2. 更新 task log、branch log、audit report，以及必要的 current state、registry index 或 project state
3. 运行最终 `git diff --check`
4. 再次运行最终 `bash scripts/check.sh`
5. 检查 scope diff
6. 只 stage 当前任务范围文件
7. 本地 commit
8. 输出 Done Report

scope diff 检查：

```bash
git status --short
git diff --name-only --cached
```

对照当前任务 `allowed_files`。如果 staged 文件越界，取消该文件 staging 或标记 blocked；不得提交越界文件。

自动提交失败时，不能输出完成态 Done Report。记录 `blocked_reason: local_commit_failed`，保留工作区，等待修复或 PM 指示。

## 7. Integration

普通单任务完成后可以记录：

```yaml
integration_status: not_started
integration_method: N/A
```

只有阶段、模块块或 coherent feature-set 完成时才做集成。

默认集成策略：

- 默认使用 `rebase origin/main`
- 多人协作、需要保留分支历史、或 rebase 风险更高时使用 `merge origin/main`
- 集成后必须再次运行 `bash scripts/check.sh`
- 合并到 `main` 前必须确认无越界文件

rebase/merge 冲突处理：

1. 解决冲突
2. 运行 `git diff --check`
3. 运行 `bash scripts/check.sh`
4. 更新 audit evidence
5. 再 commit 或继续集成

## 8. Push

本地 commit 自动化，远端 push 非自动化。

只有阶段、模块块或 coherent feature-set 完成后，才询问 PM 是否 push。未获 PM 明确确认，不得 push。

禁止 `--force` push。任何破坏性 Git 操作都必须先获得明确授权。

## 9. Exception Handling

Dirty workspace:

- 如果无关改动可以安全分离，忽略或仅 stage 当前任务文件。
- 如果无法安全分离，标记 blocked，不提交完成态。

Hotfix:

- 允许快速创建 hotfix 分支。
- 仍必须执行 Gate、check、audit、local commit 和 PM push 确认。

Task cancellation:

- 不做破坏性清理。
- 在 `docs/dev/branch-log.md` 记录 `abandoned + reason`。
- 是否删除分支由 PM 明确确认。

## 10. Minimal Audit Evidence

每个任务至少记录：

```yaml
task_id:
story_ids:
branch_name:
base_main_commit:
remote_status:
allowed_files_check:
scope_diff_check:
check_result:
local_commit_sha:
integration_status: not_started | integrated | skipped | blocked
integration_method: rebase | merge | N/A
integration_commit_sha:
merge_to_main_commit:
push_decision: pending | approved | rejected | not_applicable
blocked_reason:
```

未发生的字段使用 `N/A`，不要留空。
