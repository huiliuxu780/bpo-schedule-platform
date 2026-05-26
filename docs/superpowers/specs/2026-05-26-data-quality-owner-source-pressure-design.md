# Data Quality Owner Source Pressure Design

## Goal

在 `/data-quality` 总览页补一个本地只读的“缺口 owner/来源压力摘要”，让现场主管在复核覆盖缺口之后，立刻知道未覆盖缺口主要压在哪个责任角色、哪个数据来源，以及首要查看入口。

## Scope

- 只基于现有 `fallbackDataQualityIssues`、`summarizeDataQualityReviewCoverageGap`、数据质量 source、owner、字段和影响人员聚合。
- 只改数据质量总览页、数据质量模型、对应 Node 测试和 Harness 追踪文档。
- 不新增后端接口、数据库、ORM、migration、依赖、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

## Model

新增 `summarizeDataQualityGapOwnerSourcePressure(rows)`：

- 先复用 `summarizeDataQualityReviewCoverageGap(rows)` 得到未覆盖缺口项。
- 按 `owner + source` 聚合压力项。
- 每个压力项返回 owner、source、缺口问题数、影响异常数、影响人员、来源字段、代表问题、查看入口和下一查看提示。
- 总览返回 headline、gapIssueCount、impactedExceptionCount、impactedPeopleCount、topOwner、topSource、topItem、items、deferredActions。
- 空缺口时返回“当前复核路径已覆盖影响异常的数据质量问题”，items 为空。

## UI

在“复核覆盖缺口摘要”之后新增卡片“缺口 owner/来源压力”：

- 顶部展示缺口问题、影响异常、影响人员。
- 摘要行展示首要 owner、首要来源和 headline。
- 列出 owner/source 压力项，展示影响字段、人员、代表问题和查看按钮。
- 继续展示 deferred actions，明确无修复、无审批、无导出或批量能力。

## Tests

- `scripts/tests/data-quality.test.mjs` 新增模型测试：默认 fallback 下首要压力为 `数据管理员 / 主数据`，代表缺口为 `DQ-202605-004`，字段包含 `agent_binding.employee_id`，人员包含 `A-9931`。
- 新增空状态测试，确认没有缺口时不产生压力项。
- 页面源码测试增加新函数和中文卡片文案断言。

## Acceptance

- 目标模型测试先红后绿。
- `/data-quality` smoke 能看到“缺口 owner/来源压力”、`数据管理员`、`主数据`、`DQ-202605-004`、`查看压力问题` 和 no-action 边界。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh` 通过。
