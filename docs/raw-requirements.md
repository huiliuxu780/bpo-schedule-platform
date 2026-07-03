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

### R954 - 月班表草稿排班工作台重构

```yaml
id: R954
module: "BPO WFM 三条主线"
description: "Redesign the visible /roster-drafts surface from a report-style result page into a scheduler workbench inspired by mature scheduling products such as Homebase, Deputy, and When I Work. The workbench keeps the existing local fixture and TypeScript generation logic, but reorganizes the UI around a toolbar, compressed employee-by-date month scan grid, expanded employee-by-week handling grid, read-only selected-cell inspector, and right-side queues for exceptions, pending employees, and filtered annotations that locate into the grid. This slice must not add API routes, database persistence, Excel upload/import, save/publish, approval, permissions, forecasting model, standard-capacity model, auto-fill scheduling, external integrations, export, batch operations, settlement, or charge-factor work."
source: "PM-confirmed IM286 redesign drill on 2026-07-01"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Frontend information-architecture redesign only; keep IM285 generation model and local fixture."
```

### R955 - 全站导航瘦身与 icon rail 对齐

```yaml
id: R955
module: "BPO WFM 全站框架"
description: "After reviewing the roster workbench UI, PM confirmed the global navigation itself is a major blocker: the expanded sidebar is too wide, the collapsed icon rail is visually misaligned, and grid-heavy workbench pages need more horizontal room. Redesign the global shell so the sidebar defaults to a 64px icon rail, expands to 240px by explicit click, hides group titles when collapsed, keeps icons on a 32px centered grid, preserves the user's manual expanded/collapsed preference, and keeps a thin 48px header. This slice is global navigation infrastructure only and must not modify roster workbench business content, create new pages, add dependencies, or add backend/API/database/auth/approval/export/batch capabilities."
source: "PM-confirmed navigation drill on 2026-07-01 after IM286 UI review"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Frontend shell/navigation refactor before the next roster workbench full-screen redesign."
```

### R956 - 月班表草稿全屏排班工作台体验

```yaml
id: R956
module: "BPO WFM 三条主线"
description: "After PM confirmed not to repeat prior drill decisions, continue the /roster-drafts scheduler workbench from the IM287 navigation foundation into a full-screen, grid-first scheduling surface. The page should remove explanatory header copy, default to month scan, keep month/week switching inside the workbench, make the grid the primary canvas, and move selected-cell detail plus exception/pending/annotation queues into an on-demand right drawer instead of a fixed side panel. This slice keeps the existing local fixture and TypeScript generator and must not add editing, save/publish, API routes, database persistence, Excel upload/import, approval, permissions, forecasting model, standard-capacity model, auto-fill scheduling, external integrations, export, batch operations, settlement, or charge-factor work."
source: "PM-confirmed continuation after IM287 push on 2026-07-01"
submitted_at: "2026-07-01"
version: "1.0"
status: "draft"
notes: "Frontend workbench experience refinement only; keep IM285/IM286 generation model and local fixture."
```

### R957 - 月班表草稿格子受控编辑能力

```yaml
id: R957
module: "BPO WFM 三条主线"
description: "Continue from the IM288 full-screen roster workbench and add the first controlled editing capability for generated roster draft cells. Scheduler users can select a copied/generated cell, adjust its shift code within the current local draft preview, add an adjustment note, see edited markers and counts in the grid/workbench, and restore the generated value. Exception, pending, and filtered-annotation cells remain read-only in this slice and continue through the queue. This slice must not add draft publishing, API routes, database persistence, Excel upload/import, approval, permissions, forecasting model, standard-capacity model, automatic scheduling, external integrations, export, batch operations, production formulas, settlement, or charge-factor work."
source: "PM-confirmed continuation on 2026-07-02"
submitted_at: "2026-07-02"
version: "1.0"
status: "draft"
notes: "Frontend local state editing layer only; no production save or persistence."
```

### R958 - 月班表草稿发布预览与覆盖派生

```yaml
id: R958
module: "BPO WFM 三条主线"
description: "Continue from the controlled roster draft editing slice and add frontend-only draft -> published state expression as a local release preview. Scheduler users can see current draft vs release-preview state, derive shift-code counts and half-hour coverage from the edited effective draft cells, and inspect the derived distribution in the drawer before the future persistence/publish slice. This slice must not add real publish persistence, API routes, database work, Excel upload/import, approval, permissions, forecasting model, standard-capacity model, automatic scheduling, external integrations, export, batch operations, production formulas, settlement, or charge-factor work."
source: "PM-confirmed continuation on 2026-07-02"
submitted_at: "2026-07-02"
version: "1.0"
status: "draft"
notes: "Frontend local release-preview and derived coverage layer only; no production save or persistence."
```

### R959 - 月班表 Forecast vs Arranged/Actual 缺口工作台

```yaml
id: R959
module: "BPO WFM 三条主线"
description: "Continue from the local roster release-preview slice and add a frontend-only Forecast vs Arranged/Actual gap workbench for the edited roster draft preview. Scheduler users can inspect local demand/actual interval examples, derive Arranged from edited effective roster cells, see date + half-hour gap rows, compare Forecast, Arranged, and Actual headcounts, and locate a gap row back to the relevant weekly roster grid cell. This slice must not add a real forecasting model, standard-capacity model, API routes, database persistence, Excel upload/import, approval, permissions, automatic scheduling, export, batch operations, production formulas, settlement, or charge-factor work."
source: "PM-confirmed continuation on 2026-07-02"
submitted_at: "2026-07-02"
version: "1.0"
status: "draft"
notes: "Frontend local gap-preview layer only; demand/actual rows are local examples and Arranged is derived from edited draft cells."
```

### R960 - 月班表缺口处理闭环 v1

```yaml
id: R960
module: "BPO WFM 三条主线"
description: "Continue from the local Forecast vs Arranged/Actual gap workbench and add the first manual gap-resolution loop inside the generated roster draft. Scheduler users can open a gap row, see only the related covered draft cells for the same date and half-hour slot, click a related cell to return to the existing cell-detail shift selector, and use the edited effective draft cells to recompute the gap queue. If Arranged is 0, the gap row shows a no-coverage empty state and only supports locating the date in week view. This slice must not add automatic recommendations, automatic scheduling, processing statuses, real publish persistence, API routes, database work, Excel upload/import, approval, permissions, export, batch operations, production formulas, settlement, or charge-factor work."
source: "PM-confirmed continuation on 2026-07-02"
submitted_at: "2026-07-02"
version: "1.0"
status: "draft"
notes: "Frontend local manual gap-resolution loop only; reuse existing controlled cell editing and derived gap preview."
```

### R961 - 月班表 Draft/Published 持久化产品契约

```yaml
id: R961
module: "BPO WFM 三条主线"
description: "Define the product contract for roster draft/published persistence before any real API or database implementation. The contract must cover RosterVersion state transitions, one active draft/current published/scheduled published per project-workplace-team-month, future effective time by workplace timezone, scheduled activation, activation failure handling, withdrawal, revision draft lineage, stable roster cell IDs, manual save, edit lock, hard-error publish blockers, soft-risk publish records, published derived snapshots, and lifecycle audit events. This task must remain documentation-only and must not add database tables, ORM, migrations, API routes, frontend publish actions, permissions, approval, notifications, export, batch operations, Excel import, forecasting model, standard-capacity model, automatic scheduling, production formulas, settlement, or charge-factor work."
source: "PM-confirmed persistence contract drill on 2026-07-02"
submitted_at: "2026-07-02"
version: "1.0"
status: "draft"
notes: "Documentation/product-contract task only; prepares future DB/API design without implementing persistence."
```

### R962 - 月班表 Draft/Published 纯领域状态机与发布校验

```yaml
id: R962
module: "BPO WFM 三条主线"
description: "将 IM293 的 Draft/Published 持久化产品契约落成后端纯领域层能力。第一实现切片必须覆盖版本状态机、future effectiveAt 校验、scheduled activation、withdraw、retry、revision lineage、完整 hard-error 发布阻断、soft-risk 发布记录、publish diff summary、Arranged 半小时覆盖派生，以及纯领域编辑锁。输入使用纯领域 fixture 与 reference snapshot，不接真实 DB、repository、API 或前端。Forecast/Actual 数据源、预测模型、标准人力模型、Excel 导入、权限、审批、导出、批量、自动排班、生产公式、结算和计费规则都不在本轮。"
source: "PM-confirmed IM294 drill on 2026-07-02"
submitted_at: "2026-07-02"
version: "1.0"
status: "draft"
notes: "Backend pure domain implementation only; follow IM293 product contract before any persistence/API slice."
```

### R963 - 月班表 Draft/Published 本地持久化闭环

```yaml
id: R963
module: "BPO WFM 三条主线"
description: "将 IM294 的月班表 Draft/Published 纯领域规则接入本地 DB persistence 和 application service，形成后端持久化闭环。范围包含 RosterVersion、RosterCell、RosterVersionEvent、RosterCellChangeLog、PublishedSnapshot、EditLock 的 Alembic migration、repository 和 service；service 支持 saveDraft、validatePublish、schedulePublish、activateDuePublished、withdraw、createRevision、getActiveDraft、getCurrentPublished、getUpcomingPublished；PublishedSnapshot 在发布时固化班次数、半小时覆盖、hard/soft/diff 摘要引用；service 层和 DB 层共同保证 active draft/current published/scheduled published 唯一性；activateDuePublished 只作为 service 方法，不新增 job/cron/worker；EditLock 真实落库并保护草稿保存；RosterCell 支持同员工同日多 sequence 记录，coverage 只统计 shift。"
source: "PM-confirmed IM295 drill on 2026-07-02"
submitted_at: "2026-07-02"
version: "1.0"
status: "done"
notes: "Database-persistence slice only; no API route, frontend publish action, permission, approval, notification, export, batch, Excel import, Forecast/Actual source, forecasting model, standard-capacity model, automatic scheduling, production formula, settlement, or charge-factor work."
```

## History Policy

- Do not append completed historical requirements here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
