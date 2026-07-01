# 排班师月班表字段映射与对象模型 v0.1

## 1. 文档定位

本文记录真实 `202607班表.xlsx` 与系统第一版排班师月班表能力之间的需求追踪、字段映射、对象模型和延期边界。

本文只授权文档建模，不授权开发、不授权数据库 schema/migration、不授权 Excel 上传解析实现、不授权真实外部系统集成、不授权自动排班、审批、权限、通知、导出、批量、生产公式、结算或收费因子。

## 2. 已确认产品决策

| 决策项 | 已确认口径 | 本期处理 |
| --- | --- | --- |
| 主角色 | 排班师负责从预测参考到月班表，再细化到每个人 | 本期主流程 |
| Excel 定位 | Excel 只用于初始化、校准、历史导入；上线后不长期依赖 Excel | 本期记录初始化边界 |
| 正式班表来源 | 系统内生成和维护 | 本期定义生成口径 |
| 第一版生成方式 | 排班师复制上一月/上一周规律生成初稿，再人工调整 | 本期定义规则 |
| 自动排班 | 预测源头和预测模型未定，第一版不做自动排班 | 延后 |
| 复制粒度 | 员工个人的 `员工 + 日期 + 班种` 模式 | 本期源数据 |
| 人员变动 | 只复制仍在同一小组/项目有效的员工；新人进待排队列；离职、转组、无效员工不复制 | 本期定义 |
| 差异校验 | 沿用 Excel 的 `Forecast agents` vs `Arranged/Actual agents` 人头口径 | 本期定义 |
| 标准人力 | 是系统未来引入的增强概念，不是现有 Excel 原生字段 | 延后 |
| 小组长 | 查看细化情况，发起或审批调配、请假换班、数据修正 | 后续流程 |
| 一线员工 | 查看个人班表和状态，发起异常修复、请假、换班、调班申请 | 后续流程 |

## 3. 真实 Excel 事实层

源文件：`/Users/mac/Downloads/202607班表.xlsx`

### 3.1 工作表

| Sheet | 观察到的用途 | 系统映射 |
| --- | --- | --- |
| `Primary Duty` | 计划月班表。员工按行，7 月 1-31 日按列，单元格填班种代码或请假/标注代码 | 初始化导入 `RosterAssignment` |
| `Actual Duty` | 实际调整后的月班表，结构与 `Primary Duty` 一致 | 初始化导入 `RosterAssignment` 的 actual 版本或版本差异 |
| `班种信息` | 班种代码、上下班时间、班时、用餐/休息、特殊激励、两段班、跨天班 | 初始化导入 `ShiftType` |
| `班表标注` | 请假、休息、代换班、培训、活动、会议、居家、离职、支援等标注说明 | 初始化导入 `RosterAnnotationType` |
| `Sheet1` | 空表 | 不导入 |

### 3.2 主表结构

`Primary Duty` 与 `Actual Duty` 的上半区是人员级月历：

| Excel 字段/区域 | 含义 | 第一版系统字段 |
| --- | --- | --- |
| `A` 小组 | 小组名称或分组标题，部分行也承载人数/分割线 | `team_name`，导入时需识别分组行与员工行 |
| `B` 区域 | 职场/区域，例如 `CD`、`NJ` | `workplace_code` |
| `C` SAP | 员工 SAP 或外部员工号 | `employee_external_id` |
| `D` Level | 员工层级或特殊人员类别 | `employee_level` |
| `E` Name | 员工姓名 | `employee_name` |
| `F` 地铁站 | 通勤信息 | `commute_station`，后续约束参考 |
| `G` 拼车/组合 | 拼车或组合信息 | `commute_group`，后续约束参考 |
| `H` 打车/费用 | 打车或费用区间 | `commute_cost_band`，后续约束参考 |
| `I` 是否坐班车 | 班车约束 | `takes_shuttle` |
| `J` 是否居家/两段等 | 居家或可排两段班信息 | `work_arrangement_note` |
| `K` 特殊/备注 | 个人排班限制，例如不排指定早晚班 | `employee_roster_constraint_note` |
| `M:AQ` 每日班种 | 2026-07-01 至 2026-07-31 的日班种、休假或标注 | `RosterAssignment.shift_code` 或 `annotation_code` |
| `AR:IK` 汇总/公式区 | 班种计数、工时、统计、外部信息引用 | 派生统计，不作为第一版源数据 |

### 3.3 后半区统计块

| Excel 区块 | 观察到的内容 | 系统映射 |
| --- | --- | --- |
| `Actual-Forecast - Agents` | 半小时实际/已排与预测人头差异 | `RosterGapInterval` |
| `Shifts agents` | 按班种统计每天人数，例如 `F3`、`T1`、`Z1` | `ShiftDailyCount`，派生 |
| `Arranged agents` | 半小时已排人头 | `RosterCoverageInterval` |
| `Forecast agents` | 半小时预测需要人头 | `ForecastAgentInterval` |
| `Forecast calls` | 半小时预测话量 | `ForecastCallInterval` |

### 3.4 外部链接与风险

真实文件存在外部链接，包含：

1. 当月/历史 `Duty_arrangement` 文件。
2. `CORN新平台员工账号信息汇总表.xlsx`。
3. `Duty forecast ... .xlsm` 预测文件。
4. 外部工作簿内的 `Monthly profile`、`Break Time`、`OT list`、`人力增减` 等引用。

第一版不得直接接入这些真实外部文件或网络路径。初始化导入时只能把已提供 Excel 中可见或缓存的数据转为系统数据；真实外部集成必须另开 Gate。

## 4. 第一版系统对象模型

### 4.1 `RosterVersion`

月班表版本。

| 字段 | 说明 |
| --- | --- |
| `roster_version_id` | 系统版本 ID |
| `business_month` | 业务月份，例如 `2026-07` |
| `version_type` | `primary`、`actual`、`draft` |
| `source_type` | `excel_initial_import`、`copied_previous_month`、`copied_previous_week`、`manual_edit` |
| `source_reference` | 初始化文件名或复制来源版本 |
| `status` | `draft`、`review_ready`、`published`、`archived` |
| `created_by_role` | 第一版主角色为 `scheduler` |

### 4.2 `RosterAssignment`

人员级日班种，是第一版源数据。

| 字段 | 说明 |
| --- | --- |
| `assignment_id` | 排班明细 ID |
| `roster_version_id` | 所属月班表版本 |
| `business_date` | 业务日期 |
| `employee_id` | 系统员工 ID |
| `employee_external_id` | SAP 或外部员工号 |
| `workplace_code` | 职场/区域 |
| `project_code` | 项目；若 Excel 无明确字段，初始化为待补映射 |
| `team_id` / `team_name` | 小组 |
| `shift_code` | 班种代码，例如 `F3`、`C5`、`T1` |
| `assignment_kind` | `shift`、`leave`、`rest`、`training`、`meeting`、`support`、`annotation_only` |
| `annotation_code` | 请假/培训/会议等标注代码 |
| `source_sheet` | `Primary Duty` 或 `Actual Duty` |
| `source_cell` | 仅用于导入追溯，不作为业务主键 |

### 4.3 `ShiftType`

班种模板。

| 字段 | 说明 |
| --- | --- |
| `shift_code` | 班种代码 |
| `shift_name` | 班种名称或分类 |
| `work_segments` | 一个或多个上班时间段，例如 `08:00-13:00` 与 `18:30-21:30` |
| `work_hours` | 班时 |
| `meal_or_break_rule` | 用餐/休息规则 |
| `crosses_day` | 是否跨天 |
| `special_incentive` | 是否特殊激励班或激励金额 |
| `applicable_note` | 管理岗用、仅适用特定人头等说明 |

### 4.4 `RosterAnnotationType`

班表标注字典。

| 字段 | 说明 |
| --- | --- |
| `annotation_code` | 例如 `AL`、`SL`、`PAL`、`ML` |
| `annotation_name` | 年假、病假、事假、产假等 |
| `annotation_category` | 请假、休息、代换班、培训、会议、居家、离职、支援 |
| `counts_as_work` | 是否计入已排人头，第一版可只记录不计算复杂审批口径 |
| `note` | Excel 标注说明 |

### 4.5 `ForecastAgentInterval`

半小时预测人头。

| 字段 | 说明 |
| --- | --- |
| `business_date` | 业务日期 |
| `interval_start` / `interval_end` | 半小时时段 |
| `forecast_agents` | 预测需要人头 |
| `source_type` | `excel_cached_forecast`、未来可扩展为预测系统 |
| `source_reference` | 来源版本或文件 |

### 4.6 `RosterCoverageInterval`

由 `RosterAssignment` 和 `ShiftType` 展开得到的半小时已排/实际人头。

| 字段 | 说明 |
| --- | --- |
| `roster_version_id` | 月班表版本 |
| `business_date` | 业务日期 |
| `interval_start` / `interval_end` | 半小时时段 |
| `arranged_agents` | 计划已排人头 |
| `actual_agents` | 实际调整后人头 |
| `source` | 由人员级日班种派生 |

### 4.7 `RosterGapInterval`

半小时人头差异。

| 字段 | 说明 |
| --- | --- |
| `business_date` | 业务日期 |
| `interval_start` / `interval_end` | 半小时时段 |
| `forecast_agents` | 预测人头 |
| `arranged_agents` | 已排人头 |
| `actual_agents` | 实际人头 |
| `arranged_gap` | `arranged_agents - forecast_agents` |
| `actual_gap` | `actual_agents - forecast_agents` |
| `gap_type` | `shortage`、`balanced`、`overstaffed` |

### 4.8 `PendingRosterEmployee`

复制上一月/上一周时产生的待排人员。

| 字段 | 说明 |
| --- | --- |
| `employee_id` | 员工 |
| `business_month` | 目标月份 |
| `reason` | `new_employee`、`team_changed`、`project_missing`、`invalid_source_assignment` |
| `suggested_team` | 当前小组 |
| `note` | 排班师处理说明 |

## 5. 系统内生成月班表流程

### 5.1 初始化阶段

1. 排班师或项目管理员导入真实 Excel 作为初始化材料。
2. 系统解析员工、班种、标注、计划班表、实际班表、预测人头缓存。
3. 系统保留 Excel 来源文件、sheet、单元格作为追溯证据。
4. 初始化只为迁移和校准服务，不形成长期依赖。

### 5.2 正式月班表创建

1. 排班师选择目标月份。
2. 排班师选择复制来源：上一月或上一周规律。
3. 系统按员工个人 `日期 + 班种` 模式复制。
4. 系统只复制仍在同一小组/项目有效的员工。
5. 新员工进入待排队列。
6. 离职、转组、无效员工不复制。
7. 系统生成草稿版本。
8. 排班师在系统内调整班种、补待排人员、处理特殊班和标注。
9. 系统按半小时展示 `Forecast agents` vs `Arranged/Actual agents` 人头差异。

### 5.3 复制规则

| 场景 | 第一版处理 |
| --- | --- |
| 员工仍有效且同小组/项目 | 复制个人日期-班种模式 |
| 新员工 | 不自动套旧人班表，进入待排队列 |
| 离职员工 | 不复制 |
| 转组员工 | 不复制到原组；是否复制到新组留给排班师处理 |
| 项目缺失 | 不复制，进入待排队列或异常清单 |
| 休假/培训/会议标注 | 初始化保留；复制时是否继承需排班师确认，第一版默认不继承一次性标注 |
| 跨天/两段班 | 由班种模板展开，不拆成多个源排班 |

## 6. 需求追踪矩阵

| 需求 | 状态 | 本期处理 | 触发 Gate |
| --- | --- | --- | --- |
| 排班师作为主工作台角色 | 已确认 | 本期定义 | 文档/建模 Gate |
| Excel 初始化导入 | 已确认 | 本期定义字段映射，不实现上传解析 | 后续实现需 backend/database 或 frontend Gate |
| 系统内生成月班表 | 已确认 | 本期定义复制生成规则 | 后续实现需独立产品任务 |
| 复制上一月/上一周 | 已确认 | 本期定义规则 | 后续实现需独立产品任务 |
| 员工 + 日期 + 班种为源数据 | 已确认 | 本期定义对象模型 | 后续实现需数据模型任务 |
| 半小时人头差异校验 | 已确认 | 本期定义派生模型 | 后续实现需模型/前端任务 |
| 预测源头/模型 | 未定 | 只记录外部输入 | 另开预测模型 Gate |
| 标准人力/能力模型 | 未来增强 | 不进入第一版底层 | 另开标准人力 Gate |
| 小组长调配/审批 | 后续需求 | 记录但不纳入第一版 | 另开审批/协同 Gate |
| 一线员工申请 | 后续需求 | 记录但不纳入第一版 | 另开员工自助 Gate |
| 自动排班 | 延后 | 明确不做 | 另开自动排班 Gate |
| 权限/通知/导出/批量 | 延后 | 明确不做 | 另开生产能力 Gate |

## 7. 第一版验收口径

第一版文档建模通过的标准：

1. 真实 Excel 的主要 sheet、字段和统计块都有系统映射。
2. 所有已确认产品决策都有记录。
3. 排班师、小组长、一线员工三个角色的需求没有丢失，并明确本期/后续边界。
4. 第一版源数据明确为 `员工 + 日期 + 班种`。
5. 半小时人头差异明确为派生结果。
6. 自动排班、预测模型、标准人力、审批、权限、通知、员工申请全部被记录为延后项，而不是被遗漏。
7. 文档没有授权实现、数据库、外部集成或生产规则变更。

## 8. 推荐后续切片

推荐顺序：

1. `IM280` 班种定义与班种展开规则模型：先把 `ShiftType` 的单段、多段、跨天、休息扣减口径跑通。
2. `IM281` 月班表版本与人员级日班种草稿：支持系统内维护 `员工 + 日期 + 班种`。
3. `IM282` 复制上一月/上一周生成初稿：只复制有效员工，新人进入待排队列。
4. `IM283` Forecast vs Arranged/Actual 半小时人头差异：在不引入标准人力前提下复刻 Excel 校验口径。

暂不建议先做：

1. 自动排班。
2. 标准人力能力试算。
3. 小组长审批流。
4. 一线员工申请。
5. 真实外部预测或 CORN/HR/WFM 集成。

原因：如果人员级日班种、班种展开、复制规则和人头差异没有先跑通，后续所有自动化和协同流程都会建立在不稳定底层上。
