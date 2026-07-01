# Raw Requirements - Compact Current Stub

本文件不再保存历史需求全文。历史需求在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧需求时使用 Git history。

## Current Requirement Anchors

### R949 - 排班师月班表初始化与系统内生成底层口径

```yaml
id: R949
module: "BPO WFM 三条主线"
description: "PM 提供真实 202607 班表后确认：当前业务预测主要按话量/业务量粗预测，不是天然标准人力预测；标准人力/能力模型是系统未来引入的增强概念。真实业务中排班师负责从预测参考到月班表并细化到每个人；小组长负责查看细化情况并发起或审批调配、请假换班、数据修正；一线员工负责查看个人班表和状态，并发起异常修复、请假、换班、调班申请。第一版应以排班师为主，Excel 只做初始化、校准、历史导入；上线后班表在系统内生成。第一版不做自动排班，采用复制上一月/上一周员工个人日期-班种规律生成初稿，再由排班师维护；源数据为员工 + 日期 + 班种，半小时 Forecast agents vs Arranged/Actual agents 人头差异为派生校验。"
source: "PM clarification on 2026-07-01 after reviewing /Users/mac/Downloads/202607班表.xlsx"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Current source requirement for scheduler monthly roster modeling. Supersedes older WFM draft documents that framed first-pass scheduling around standard capacity."
```

## History Policy

- Do not append completed historical requirements here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
