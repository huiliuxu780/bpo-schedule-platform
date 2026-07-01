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

### US870 - 班种定义与月班表生成底座产品契约

```yaml
id: US870
requirement_ids:
  - R950
module: "BPO WFM 三条主线"
role: "产品经理"
story: "作为产品经理，我希望把班种定义、月班表草稿生成、复制上一月/上一周、待排队列、版本发布和 Primary/Actual 分层沉淀成产品契约，以便后续开发先修正确底座，不把预测模型、标准人力或自动排班混入第一版。"
task_type: "harness"
priority: "P0"
acceptance:
  - "契约明确第一版生成人员级日班种草稿，而不是只生成班种人数或半小时覆盖。"
  - "契约明确班种定义第一版只用工作时段参与半小时覆盖展开。"
  - "契约明确复制上一月/上一周时只继承稳定班种，不继承一次性标注。"
  - "契约明确新人、转组、来源缺失人员进入待排队列，不做推荐班种。"
  - "契约明确状态流转为 draft -> published，不做审批。"
  - "契约明确 Primary Duty 是计划班表，Actual Duty 是实际/调整后履约版本。"
  - "契约明确预测模型、标准人力、自动排班、审批、权限、通知、导出、批量、外部集成和生产规则均延后。"
status: "draft"
notes: "IM282 文档/产品契约任务；目标产物为 docs/design/scheduler-shift-type-monthly-roster-generation-contract.md。"
```

### US871 - ShiftType 班种解析与半小时覆盖展开

```yaml
id: US871
requirement_ids:
  - R951
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望系统能够基于可配置班种的工作时段生成半小时覆盖，以便后续月班表草稿、覆盖人数和缺口校验建立在稳定班种底座上。"
task_type: "backend-mvp"
priority: "P0"
acceptance:
  - "后端纯领域服务支持 ShiftType 工作时段解析，不新增 API、数据库、migration 或 UI。"
  - "支持单段、两段、半点和跨天班种，验收样例包括 Z1、A5、T1、T4、N、A12。"
  - "跨天班归属排班业务日，但覆盖时间戳可延伸到次日。"
  - "无法解析班种进入异常清单，不阻断其他可解析班种的覆盖展开。"
  - "用餐/休息、哺乳假、特殊激励、适用人头备注只记录在班种配置上，不参与第一版覆盖计算。"
status: "draft"
notes: "IM283 backend pure domain service and focused unittest."
```

### US872 - 人员级月班表草稿纯领域模型

```yaml
id: US872
requirement_ids:
  - R952
module: "BPO WFM 三条主线"
role: "排班师"
story: "作为排班师，我希望系统底层能表达同一员工同一天的多个班表记录、只把正式班种计入覆盖、并校验多班种不重叠和人员归属，以便后续生成月班表草稿时不压扁真实业务。"
task_type: "backend-mvp"
priority: "P0"
acceptance:
  - "后端纯领域模型定义 RosterVersion、RosterAssignment、PendingRosterEmployee 和引用校验上下文，不新增 API、数据库、migration 或 UI。"
  - "同一员工同一天允许多条记录，只有 assignment_kind=shift 参与覆盖。"
  - "assignment_kind 支持 shift、leave、rest、training、meeting、support、work_from_home、annotation、unassigned。"
  - "同一员工同一天允许多条 shift，但时间重叠必须返回校验错误。"
  - "员工有效性和项目/小组归属通过调用方传入快照校验，不查数据库。"
  - "待排人员使用独立 PendingRosterEmployee，保持人月维度。"
  - "RosterVersion 只支持 draft、published、archived，且只有 draft 可编辑。"
status: "draft"
notes: "IM284 backend pure domain model and focused unittest."
```

## History Policy

- Do not append completed historical user stories here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
