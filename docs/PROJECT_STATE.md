# Project State - Compact Current Stub

## Current State

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

The active execution source is `docs/current/**`. This file is a compact compatibility anchor for project-level state and for `scripts/check.sh`.

## Active Boundary

- Current story queue: empty.
- Current active tasks: empty.
- Next product slice must be defined before implementation.
- Do not execute from historical backlog, raw requirements, user stories, audit report, task log, or branch log.

## Durable Product Anchor

The latest product anchor is IM285 / R953 / US873: visible frontend demo loop for generating personnel-level monthly roster drafts from local configurable data.

Confirmed bottom-layer direction:

- 排班师是第一版主角色。
- Excel 只用于初始化、校准、历史导入。
- 上线后班表在系统内生成和维护。
- 第一版生成人员级日班种草稿：员工 + 日期 + 班种/标注。
- 班种定义第一版只用工作时段做半小时覆盖展开；用餐/休息、哺乳假、特殊激励先记录不计算。
- 复制上一月/上一周时只继承稳定班种，不继承一次性请假、培训、会议、支援、离职等标注。
- 新人、转组和来源缺失人员进入待排队列，不推荐班种。
- 状态流转为 draft -> published，不做审批。
- Primary Duty 是计划班表；Actual Duty 是实际班表或调整后履约版本。
- 半小时差异校验沿用 Forecast agents vs Arranged/Actual agents 人头口径，是派生视图。
- IM283 已确认第一刀开发落在后端纯领域服务，不新增 API、数据库、migration、Excel 上传、UI、预测模型、标准人力或自动排班。
- IM284 已确认人员级月班表草稿先做后端纯领域模型：同日多记录、shift-only 覆盖、多 shift 重叠校验、引用快照校验、独立待排人员和 draft-only 可编辑。
- IM285 已完成可见演示闭环：`/roster-drafts` 选择目标月份，用上一周同星期稳定班种生成月班表草稿，并展示月视图、周视图、待排人员、只读异常清单和已过滤非班务标注。
- 标准人力、自动排班、审批、权限、通知、导出、批量、外部集成、生产公式、结算和收费因子延后。

## History Policy

Historical project state before IM279 was intentionally removed from this compact file on 2026-07-01. Use Git history when older state is needed for audit or rollback.
