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

The latest product anchor is IM282 / R950 / US870: ShiftType and monthly roster generation foundation, building on IM279's real `202607班表.xlsx` analysis.

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
- 标准人力、自动排班、审批、权限、通知、导出、批量、外部集成、生产公式、结算和收费因子延后。

## History Policy

Historical project state before IM279 was intentionally removed from this compact file on 2026-07-01. Use Git history when older state is needed for audit or rollback.
