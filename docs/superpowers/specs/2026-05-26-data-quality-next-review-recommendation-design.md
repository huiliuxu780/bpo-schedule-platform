# Data Quality Next Review Recommendation Design

## Goal

在 `/data-quality` 总览页补一个本地只读的“缺口下一轮复核建议”，把已有 owner/来源压力摘要转成主管可读的下一轮查看顺序。

## Scope

- 复用 `summarizeDataQualityGapOwnerSourcePressure(rows)` 的 top item、owner、source、代表问题、字段、人员和影响数。
- 只新增本地模型、现有页面卡片、目标测试和 Harness 追踪文档。
- 不新增后端接口、数据库、ORM、migration、依赖、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

## Behavior

新增 `summarizeDataQualityNextReviewRecommendation(rows)`：

- 有压力项时，返回 headline、topOwner、topSource、representativeIssueId、href、impactedExceptionCount、impactedPeopleCount、steps、deferredActions。
- steps 固定为三类只读查看建议：先看代表问题、再按 owner/source 核对字段和人员、最后回到复核路径确认是否仍有缺口。
- 无压力项时，返回“当前没有需要追加的缺口复核建议”，steps 为空。

## UI

在“缺口 owner/来源压力”之后新增卡片“缺口下一轮复核建议”，展示建议标题、首要 owner、首要来源、代表问题、影响异常、影响人员、建议步骤和“查看建议问题”入口。

## Tests

目标测试覆盖默认 fallback 下代表问题 `DQ-202605-004`、owner `数据管理员`、source `master_data`、三条建议步骤、查看入口和 no-action 边界；同时覆盖空状态。
