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

### R950 - 班种定义与月班表生成底座产品契约

```yaml
id: R950
module: "BPO WFM 三条主线"
description: "PM confirmed the first roster-generation foundation: the system generates personnel-level daily roster assignments (employee + date + shift/annotation), while daily shift counts, half-hour coverage, and Forecast vs Arranged/Actual headcount gaps are derived views. Shift types first calculate only work-segment coverage; meal/break, lactation, special incentive, and applicability notes are recorded but not calculated. Copying previous month/week inherits only stable shifts, not one-off leave, training, meeting, support, or termination annotations. New, transferred, and missing-source employees enter a pending roster queue without shift recommendation. Version flow is draft -> published without approval. Primary Duty is planned roster; Actual Duty is actual/adjusted roster."
source: "PM clarification on 2026-07-01 after decisions for roster generation foundation"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Product contract source for docs/design/scheduler-shift-type-monthly-roster-generation-contract.md. Does not authorize forecasting model, standard-capacity model, auto-scheduling, approval, permissions, external integrations, database schema/migration, export, batch operations, settlement, or charge-factor work."
```

### R951 - ShiftType 班种解析与半小时覆盖展开

```yaml
id: R951
module: "BPO WFM 三条主线"
description: "First development slice for the roster-generation foundation: implement a backend pure domain service that parses configurable ShiftType work time expressions and expands them to half-hour coverage intervals. It must support representative real Excel shift types Z1, A5, T1, T4, N, and A12, keep cross-day shifts under the roster business date while coverage timestamps extend to the next calendar day, and return non-blocking exceptions for invalid shift definitions. This slice must not add API routes, database schema/migration, Excel upload/import, UI, forecasting model, standard-capacity model, auto-scheduling, approval, permissions, export, batch operations, settlement, or charge-factor work."
source: "PM-confirmed development drill on 2026-07-01"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Backend pure domain implementation only; tests use representative shift types from 202607班表.xlsx."
```

### R952 - 人员级月班表草稿纯领域模型

```yaml
id: R952
module: "BPO WFM 三条主线"
description: "Implement the backend pure domain model for personnel-level monthly roster drafts. The model supports RosterVersion with draft/published/archived states, RosterAssignment with multiple same-employee same-day records, medium-grain assignment kinds, shift-only coverage participation, non-overlapping multi-shift validation, reference-snapshot validation for employee/project/team consistency, and separate month-level PendingRosterEmployee records. This slice must not add API routes, database schema/migration, Excel upload/import, UI, copy generation, forecasting model, standard-capacity model, auto-scheduling, approval, permissions, export, batch operations, settlement, or charge-factor work."
source: "PM-confirmed development drill on 2026-07-01"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Backend pure domain implementation only; preserves complex same-day roster events without counting non-shift events as coverage."
```

### R953 - 月班表草稿生成演示闭环

```yaml
id: R953
module: "BPO WFM 三条主线"
description: "Build a visible roster-draft demo loop for the scheduler role: use local configurable fixture data for one project and multiple teams, choose a target month, generate a personnel-level monthly roster draft from previous-week same-weekday stable shifts, and show month view, week view, pending employees, read-only exceptions, filtered non-shift annotations, and coverage summary. The first version keeps the future same_date/same_weekday configurability as a design direction but implements only previous_week_same_weekday. This slice must not add API routes, database persistence, Excel upload/import, save/publish, approval, permissions, forecasting model, standard-capacity model, auto-fill scheduling, external integrations, export, batch operations, settlement, or charge-factor work."
source: "PM-confirmed IM285 drill on 2026-07-01"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Frontend TypeScript demo loop and local fixture only; intended to restore visible product momentum after backend foundation slices."
```

## History Policy

- Do not append completed historical requirements here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
