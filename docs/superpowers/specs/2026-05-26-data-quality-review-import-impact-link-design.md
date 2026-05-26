# Data Quality Review Import Impact Link Design

## Goal

在 `/data-quality` 总览页补一个本地只读的“复核建议导入批次影响”摘要，把下一轮复核建议里的代表问题继续串到导入批次、失败行、匹配字段和影响对象。

## Scope

- 复用 `summarizeDataQualityNextReviewRecommendation(rows)` 找到建议代表问题。
- 复用 `summarizeDataQualityImportBatchImpact(issue, batches)` 和 `fallbackImportBatches` 聚合批次影响。
- 只修改数据质量模型、现有数据质量总览页、目标测试和 Harness 追踪文档。
- 不新增上传、写入、修复、审批、导出、批量、数据库、ORM、migration、依赖或真实外部集成。

## Behavior

新增 `summarizeDataQualityReviewImportBatchImpact(rows, batches)`：

- 有建议代表问题时，返回代表问题、批次数、失败行、匹配字段、影响对象、首要批次、批次入口、查看提示和 deferred actions。
- 无建议代表问题或无匹配批次时，返回空状态。

## UI

在“缺口下一轮复核建议”之后新增卡片“复核建议导入批次影响”，展示建议问题、关联批次、失败行、影响对象、匹配字段、首要批次和“查看关联批次”入口。

## Tests

目标测试覆盖 fallback 下 `DQ-202605-004` 关联 `BATCH-20260519-001`、19 个失败行、`employee_id` 匹配字段、`人员排班` 影响对象和 no-action 边界；同时覆盖空状态。
