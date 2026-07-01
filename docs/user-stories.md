# User Stories - Compact Current Stub

本文件不再保存历史用户故事全文。历史故事在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧故事时使用 Git history。

## Current Story Anchors

### US869 - 排班师月班表字段映射与需求追踪

```yaml
id: US869
requirement_ids:
  - R949
module: "BPO WFM 三条主线"
role: "产品经理"
story: "作为产品经理，我希望先把真实 202607 班表、排班师主流程、系统内生成月班表、后续小组长/一线员工需求和明确不做项统一沉淀成可追踪产品契约，以便后续开发不漏需求、不误把 Excel 导入或自动排班当作第一版目标。"
task_type: "harness"
priority: "P0"
acceptance:
  - "文档覆盖真实 Excel 的 Primary Duty、Actual Duty、班种信息、班表标注、Forecast/Arranged/Actual 人头统计和外部链接风险。"
  - "文档明确第一版主角色是排班师，Excel 只用于初始化/校准/历史导入，上线后由系统内生成和维护月班表。"
  - "文档明确第一版源数据是 员工 + 日期 + 班种，复制上一月/上一周员工个人日期-班种模式生成初稿。"
  - "文档明确人员变动处理：只复制仍在同一小组/项目有效的员工，新人进入待排队列，离职/转组/无效员工不复制。"
  - "文档明确第一版差异校验沿用 Forecast agents vs Arranged/Actual agents 人头口径，不引入标准人力。"
  - "文档保留小组长调配/审批和一线员工申请需求为后续流程，不能遗漏但不能混入第一版范围。"
  - "文档明确不授权自动排班、预测模型、标准人力试算、审批、权限、通知、导出、批量、外部集成、数据库 schema/migration 或生产规则。"
status: "draft"
notes: "IM279 文档/建模任务；目标产物为 docs/design/scheduler-monthly-roster-field-mapping-and-model.md。"
```

## History Policy

- Do not append completed historical user stories here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
