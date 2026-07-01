# Audit Report - Compact Current Stub

本文件不再保存历史审计全文。历史审计记录在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧记录时使用 Git history。

## Current Audit

### 2026-07-01 - IM283 ShiftType 班种解析与半小时覆盖展开

#### 审计结论

- 新增 `backend/app/shift_types.py` 后端纯领域服务。
- 新增 `backend/tests/test_shift_types.py`，以真实代表班种 `Z1`、`A5`、`T1`、`T4`、`N`、`A12` 验证单段、半点、两段、跨天和备注不参与计算。
- 跨天班保持 `business_date` 为排班业务日，覆盖时间戳可延伸到次日。
- 无法解析班种进入异常清单，不阻断其他班种展开。
- 本轮不新增 API、数据库、migration、Excel 上传/导入、UI、预测模型、标准人力、自动排班、审批、权限、通知、导出、批量、生产公式、结算或收费因子。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_shift_types`: 通过。
- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、845 Node assertions、lint、typecheck、Next build、243 backend tests 和 project Harness check。

### 2026-07-01 - IM282 班种定义与月班表生成底座产品契约

#### 审计结论

- 新增 `docs/design/scheduler-shift-type-monthly-roster-generation-contract.md`。
- 契约明确第一版生成人员级日班种草稿，派生每天班种人数、半小时覆盖和 Forecast vs Arranged/Actual 人头差异。
- 契约明确班种定义第一版只计算工作时段覆盖；用餐/休息、哺乳假、特殊激励和适用说明只记录不计算。
- 契约明确复制上一月/上一周时只继承稳定班种，不继承一次性标注。
- 契约明确待排队列不提供推荐班种，状态流转为 `draft -> published`，并区分 Primary 计划班表与 Actual 实际班表。
- 本轮只做文档契约和轻量追踪更新，不修改业务代码、前端、后端、数据库、脚本逻辑、依赖、package/lockfile、外部集成、自动排班、审批、权限、通知、导出、批量、预测模型、标准人力、生产公式、结算或收费因子。

#### 验证

- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、845 Node assertions、lint、typecheck、Next build、241 backend tests 和 project Harness check。

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
