# Audit Report - Compact Current Stub

本文件不再保存历史审计全文。历史审计记录在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧记录时使用 Git history。

## Current Audit

### 2026-07-01 - IM281 主追踪链瘦身

#### 审计结论

- `tasks/backlog.yaml`、`docs/raw-requirements.md`、`docs/user-stories.md`、`docs/audit-report.md`、`docs/task-log.md`、`docs/dev/branch-log.md`、`docs/PROJECT_STATE.md` 和 `docs/registry/TRACE_INDEX.yaml` 从历史堆积文件压缩为 compact current stubs。
- 当前执行源仍然是 `docs/current/**`。
- 历史详情不再进入默认上下文，需要时通过 Git history 查询。
- 保留 `F001` 作为 `scripts/check.sh` 所需的历史例外锚点。
- 保留 `R949/US869/IM279` 作为当前真实班表和排班师月班表底层口径锚点。
- 本轮不修改业务代码、前端、后端、数据库、脚本逻辑、依赖、package/lockfile、外部集成、自动排班、审批、权限、导出、批量、生产公式、结算或收费因子。

#### 验证

- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、845 Node assertions、lint、typecheck、Next build、241 backend tests 和 project Harness check。

## History Policy

- Do not append full historical audit records here.
- Record only the current compact audit and last meaningful state-transition anchor.
- Use Git history for previous audit details.
