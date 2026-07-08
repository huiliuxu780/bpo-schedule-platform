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

### R964 - 排班师月班表发布工作台 v1

```yaml
id: R964
module: "BPO WFM 三条主线"
description: "将 IM295 本地持久化 service 接入窄范围本地 API 和 `/roster-drafts` 排班师工作台，形成可演示的草稿发布闭环。排班师在当前 2026-08 本地草稿样例上发布当前草稿，系统先做轻量编辑锁检查，再用 hard errors 阻断、soft risks 记录的口径发布；发布成功后同一工作台切换为已发布快照，读回 current published 和 snapshot 固化的班次数、半小时覆盖、soft risk 和 diff 摘要，并阻止继续编辑当前已发布版本。此任务必须是一个中等闭环包，不能拆成 API-only、UI-only 或 lock-only 小片。"
source: "PM-confirmed IM296 drill on 2026-07-06"
submitted_at: "2026-07-06"
version: "1.0"
status: "done"
notes: "Completed local API + frontend workbench publish loop only; no scheduled publish UI, full revision editing, Forecast vs published persistence gap, forecasting model, standard-capacity model, Excel import, permissions, approval, notification, export, batch, automatic scheduling, production formula, settlement, or charge-factor work."
```

### R965 - 已发布月班表修订草稿闭环 v1

```yaml
id: R965
module: "BPO WFM 三条主线"
description: "在 IM296 已发布班表工作台之上，补齐发布后发现问题的修订闭环。排班师在 current published 仍然生效的前提下创建修订草稿，修订草稿从当前正式版复制并保留 parent/version lineage；排班师只复用现有格子受控编辑修改现有人员日期格的班种和备注，不新增/删除人员或日期格；重新发布修订草稿时立即替换 current published，并将上一版作为 previous-version source 展示。本轮只在当前工作台展示当前正式版、上一版来源和本次修改摘要，不做完整版本历史页。"
source: "PM-confirmed IM297 drill on 2026-07-06"
submitted_at: "2026-07-06"
version: "1.0"
status: "done"
notes: "Revision draft loop only; no scheduled publish UI, future effective-time selection, full version history page, bulk revision, approval workflow, notification, export, batch, auth, permissions, automatic scheduling, forecasting model, standard-capacity model, Excel import, production formula, settlement, or charge-factor work."
```

### R966 - Published Forecast vs Arranged/Actual 缺口闭环 v1

```yaml
id: R966
module: "BPO WFM 三条主线"
description: "在 IM297 已发布班表修订闭环之上，补齐正式班表缺口发现到修订发布的最小业务闭环。排班师在 `/roster-drafts?month=2026-08` 查看基于 current published 的 Forecast vs Arranged/Actual 缺口；Forecast/Actual 继续使用当前本地样例口径，Arranged 必须从 current published cells/snapshot 派生，而不是未发布草稿；点击缺口行只定位相关日期/人员格子，不自动创建修订、不自动推荐处理动作；定位上下文必须能进入既有创建修订草稿、格子受控编辑和重新发布修订流程；重发布后缺口基于新的 current published 刷新。"
source: "PM-confirmed IM298 drill on 2026-07-06"
submitted_at: "2026-07-06"
version: "1.0"
status: "done"
notes: "Published gap closed loop only; no real forecasting model, standard-capacity model, Excel import, permissions, approval, export, batch, automatic scheduling, new gap page, full version history page, production formula, settlement, or charge-factor work."
```

### R967 - 下游正式班表查看 v1

```yaml
id: R967
module: "BPO WFM 三条主线"
description: "在 IM298 正式班表缺口闭环之后，为小组长和一线补齐当前正式班表的只读消费入口。新增独立 `正式班表` 导航入口和 `/published-roster?month=2026-08` 页面；页面只读取现有 current published API，不展示 draft、revision draft 或 upcoming；小组长用本地固定团队样例查看团队月/周班表，一线用本地人员切换器查看个人月/周班表；点击格子查看只读详情，包含人员、日期、班次、时间、来源正式版和轻风险提示；请假、换班、异常修复只作为不可提交入口占位。"
source: "PM-confirmed IM299 drill on 2026-07-06"
submitted_at: "2026-07-06"
version: "1.0"
status: "done"
notes: "Downstream read-only formal roster viewer only; no auth, permissions, organization hierarchy, approval, request submission, export, batch, forecasting model, standard-capacity model, Excel import, new persistence, scheduled publish UI, full version history, production formula, settlement, or charge-factor work."
```

### R968 - 正式班表月历概览 + 周明细联动

```yaml
id: R968
module: "BPO WFM 三条主线"
description: "修正 IM299 下游正式班表查看体验：`/published-roster?month=2026-08` 的月视图不再使用人员 x 全月日期的超长横向网格，而是使用 7 列月历概览；小组长月历日格展示团队上班数、休息数、主要班种和调整提示；一线月历日格只展示所选人员自己的班种和时间；点击月历日期定位到对应周明细，周明细继续展示人员 x 7 天正式班表并保留只读格子详情。"
source: "PM-selected option A after mature scheduling product reference review on 2026-07-06"
submitted_at: "2026-07-06"
version: "1.0"
status: "done"
notes: "Downstream formal roster display correction only; no leave/swap/exception request submission, approval, auth, permissions, export, batch, forecasting model, standard-capacity model, Excel import, backend API, database, new persistence, production formula, settlement, or charge-factor work."
```

### R969 - 正式班表变更申请边界 v1

```yaml
id: R969
module: "BPO WFM 三条主线"
description: "在 IM299/IM300 下游正式班表查看入口之上，为请假、换班、异常修复补齐本地申请边界说明。小组长/一线在正式班表格子详情中点击对应动作后，看到该动作需要补齐的信息、后续处理角色和当前暂不写入系统的边界；本轮不创建真实申请、不提交、不进入审批、不写后端或数据库。"
source: "PM-selected option A after IM300 on 2026-07-06"
submitted_at: "2026-07-06"
version: "1.0"
status: "done"
notes: "Request boundary shell only; no real request submission, approval, auth, permissions, backend API, database, new persistence, notification, export, batch, forecasting model, standard-capacity model, Excel import, production formula, settlement, or charge-factor work."
```

### R970 - 正式班表下游处理意图闭环 v1

```yaml
id: R970
module: "BPO WFM 三条主线"
description: "在 IM301 正式班表申请边界之上，补齐一个本地 DB-backed 的下游处理意图闭环。小组长或一线在 `/published-roster?month=2026-08` 的正式班表格子详情里选择请假、换班、异常修复或现场调配后，可以登记一条本地处理意图；系统把意图挂到当前正式班表版本、稳定 roster cell、人员和日期上；排班师在 `/roster-drafts?month=2026-08` 的队列中看到下游处理意图，能定位到对应人员/日期格子，并通过既有创建修订草稿、受控编辑、重新发布修订上下文关闭该意图。"
source: "PM confirmed DB-backed local persistence after IM301; user rejected tiny task split on 2026-07-06/2026-07-07"
submitted_at: "2026-07-07"
version: "1.0"
status: "done"
notes: "Local handling-intent loop only; no real approval workflow, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, or charge-factor work."
```

### R971 - 正式班表下游问题管理闭环 v1

```yaml
id: R971
module: "BPO WFM 三条主线"
description: "在 IM302 本地处理意图闭环之上，把正式班表发布后的下游意图升级为可追踪的问题管理闭环。小组长/一线在 `/published-roster?month=2026-08` 能从正式班表格子继续登记问题，并在独立状态抽屉查看我的/团队 open 与 resolved 问题、处理时间、关联修订版本和排班师处理说明；正式班表主月/周视图保持干净，只在格子详情显示待处理提示。排班师在 `/roster-drafts?month=2026-08` 拥有独立下游问题工作区，能按 open/resolved、动作、人员等筛选，查看详情、定位格子，并关闭问题时记录 scheduler_resolution_note 与 linked_revision_version_id。"
source: "PM confirmed bigger IM303 scope after rejecting tiny downstream tracking slice on 2026-07-07"
submitted_at: "2026-07-07"
version: "1.0"
status: "done"
notes: "Local issue management loop over existing roster request intents only; no real approval workflow, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, or charge-factor work."
```

### R972 - 正式班表变更治理闭环 v1

```yaml
id: R972
module: "BPO WFM 三条主线"
description: "在 IM303 下游问题管理闭环之上，补齐正式班表发布后的变更治理工作台。新增计划与排班下的独立 `正式班表变更治理` 入口和 `/roster-change-governance?month=2026-08` 页面；页面默认读取当前月、项目、职场、团队的正式班表发布链，按发布时间倒序展示版本、发布时间、变更格子数和关联问题数；选择修订版本后，按人员-日期展示基于 `source_cell_id` 对齐父版本同格的修订前/修订后差异；已关闭下游问题通过 `linked_revision_version_id` 与 `roster_cell_id/source_cell_id` 关联到差异行，展示排班师处理说明；下游已处理问题可跳转到对应修订差异。"
source: "PM confirmed IM304 formal roster change-governance scope after mature product reference review on 2026-07-07"
submitted_at: "2026-07-07"
version: "1.0"
status: "done"
notes: "Runtime-derived governance loop over existing roster versions, cells, published snapshots, and request intents only; no new diff persistence table, approval, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, or charge-factor work."
```

### R973 - 班表变更中心事件化与确认闭环

```yaml
id: R973
module: "BPO WFM 三条主线"
description: "纠正 IM304 的 version-first 页面方向，把 `/roster-change-governance?month=2026-08` 重构为运营优先的 `班表变更中心`。页面默认以发布后员工班次变更事件为主对象，一行代表一个员工某一天的一次班次变更；提供 `待处理 / 全部变更 / 按员工` 分组；点击行打开右侧详情抽屉；排班师可对单条事件确认并填写内部备注，确认记录本地持久化，确认后离开待处理但保留在全部变更审计视图。"
source: "PM confirmed event-first A path and allowed local confirmation persistence on 2026-07-07"
submitted_at: "2026-07-07"
version: "1.0"
status: "done"
notes: "Completed local roster-change confirmation loop only; no approval, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, charge-factor work, or bulk confirmation."
```

### R974 - 班务变更申请与月班表调整承接

```yaml
id: R974
module: "BPO WFM 三条主线"
description: "将旧 `班表变更中心` UX 方向纠正为 `班务变更申请`：排班师处理班长和一线提交的请假、换班、异常修复、现场调配申请；页面主对象是一条下游申请，状态为待处理、跟进中、已处理；详情动作是同意、拒绝、现场跟进；同意后进入月班表调整，自动定位员工和日期，保存调整后回到已处理并展示处理结果和班表结果。"
source: "PM confirmed request-first product baseline after mature scheduling product comparison on 2026-07-07"
submitted_at: "2026-07-07"
version: "1.0"
status: "done"
notes: "Frontend product prototype and wording correction only in this pass; no new backend persistence, approval, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, or charge-factor work."
```

### R975 - 班务变更申请真实三态处理闭环

```yaml
id: R975
module: "BPO WFM 三条主线"
description: "在 IM306 `班务变更申请` 原型之上，接入真实 `roster_request_intents`，让排班师处理班长和一线提交的请假、换班、异常修复、现场调配申请。申请状态从本地 `open / in_progress / resolved` 显示为 `待处理 / 跟进中 / 已处理`；动作使用 `同意 / 拒绝 / 跟进`；已处理结果使用短标签 `已调整 / 已拒绝 / 已关闭`。`已调整` 继续关联班表结果，`已拒绝` 和 `已关闭` 不强制关联 revision。"
source: "PM confirmed option A real three-state request loop and short result labels on 2026-07-08"
submitted_at: "2026-07-08"
version: "1.0"
status: "done"
notes: "Local MVP request handling loop over existing roster request intents only; no real approval, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, or charge-factor work."
```

### R976 - 班务变更申请月班表调整承接

```yaml
id: R976
module: "BPO WFM 三条主线"
description: "在 IM307 真实申请三态闭环之上，把 `班务变更申请` 的同意后处理改成同页三栏承接：左侧申请队列，中间月班表当前格调整区，右侧申请与处理。排班师同意一条申请后，系统定位当前申请对应员工/日期格，排班师从固定班次下拉选择目标班次，保存前看到轻量影响提示，保存后申请显示 `已调整` 并保留 revision 锚点，同时队列自动选中下一条待处理申请。"
source: "PM confirmed visual option A + current-cell quick adjustment + fixed shift dropdown + lightweight impact hint + next-request continuity on 2026-07-08"
submitted_at: "2026-07-08"
version: "1.0"
status: "ready"
notes: "Frontend scaffold over existing local request and roster revision APIs where possible; no swap two-person linkage, full roster editor, complex validation, approval, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, charge-factor work, new dependency, backend migration, or new persistence field."
```

## History Policy

- Do not append completed historical requirements here.
- Add only current anchors that are still relevant to the next product slice.
- Use `docs/current/**` for executable work.
- Use Git history for older R/US/IM records.
