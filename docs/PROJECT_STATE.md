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

The latest product anchor is IM279 / R949 / US869: scheduler-first monthly roster modeling based on the real `202607班表.xlsx`.

Confirmed bottom-layer direction:

- 排班师是第一版主角色。
- Excel 只用于初始化、校准、历史导入。
- 上线后班表在系统内生成和维护。
- 第一版生成方式是复制上一月/上一周员工个人日期-班种模式，再由排班师人工维护。
- 源数据粒度是员工 + 日期 + 班种。
- 半小时差异校验沿用 Forecast agents vs Arranged/Actual agents 人头口径。
- 标准人力、自动排班、审批、权限、通知、导出、批量、外部集成、生产公式、结算和收费因子延后。

## History Policy

Historical project state before IM279 was intentionally removed from this compact file on 2026-07-01. Use Git history when older state is needed for audit or rollback.
