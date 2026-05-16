# User Stories

本文件记录由原始需求拆分出来的用户故事、最小交付单元、依赖关系和验收标准。

## Schema

```yaml
- id: US001
  requirement_ids:
    - R001
  module: "模块名称"
  role: "用户角色"
  story: "作为某类用户，我希望完成某个动作，以便获得某个业务价值。"
  task_type: "product"
  priority: "P0"
  acceptance:
    - "验收标准 1"
    - "验收标准 2"
  dependencies: []
  status: "draft"
```

## DAG Rules

- 每条用户故事必须关联至少一条原始需求。
- `dependencies` 只能引用已经存在的用户故事、决策或口径确认项。
- 若发现循环依赖，相关故事必须标记为 `blocked`。
- 涉及结算公式、状态码、权限、导出、批量操作或真实数据来源时，必须先生成 PM 确认问题。

## Stories

### US130 - Unavailability impact shift-table scoped plan-link closure

```yaml
id: US130
requirement_ids:
  - R118
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望不可用影响定位页里的影响班次表在继续查看计划时也保留当前 review scope 和来源页，这样我不会从关联班次表格动作里丢失上下文。"
task_type: "feature"
priority: "P1"
acceptance:
  - "不可用影响定位页的影响班次表里，计划行级动作保留当前 scope 和来源页。"
  - "影响班次表不再使用裸计划详情链接。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US176 - Adherence monitoring reads imported records

```yaml
id: US176
requirement_ids:
  - R164
module: "履约监控"
role: "演示人员"
story: "作为演示人员，我希望实时遵守率页能展示本机导入的状态和登录 records 覆盖，这样可以演示该入口已经接入导入处理结果。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/adherence-monitoring` 页面。"
  - "页面读取 processed records 中的 status_log 和 login_log，并展示 `遵守率预览 records` 摘要。"
  - "页面展示状态数据行数、登录数据行数、本机预览状态和样本 records。"
  - "不做生产遵守率公式、不接实时流、不固化状态码、不写回状态、不接数据库、不做真实集成、审批、导出、批量或结算。"
status: "done"
```

### US179 - Data quality reads imported records

```yaml
id: US179
requirement_ids:
  - R167
module: "数据与集成"
role: "演示人员"
story: "作为演示人员，我希望数据质量页能展示本机导入的主数据、状态和登录 records 覆盖，这样可以演示导入结果已经进入数据治理入口。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/data-quality` 页面。"
  - "页面读取 processed records 中的 staff_master、status_log 和 login_log，并展示 `数据质量 records` 摘要。"
  - "页面展示三类数据行数、样本覆盖、最近批次和本机质量预览状态。"
  - "不做生产数据质量规则、自动修复、字段映射写回、真实接口检查、跨系统对账、不接数据库、不做真实集成、审批、导出、批量或结算。"
status: "done"
```

### US180 - Data quality navigation entry

```yaml
id: US180
requirement_ids:
  - R168
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏数据质量成为可点击入口，这样数据与集成导航不再保留该占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`数据与集成 > 数据质量` 链接到 `/data-quality`。"
  - "页面和文案明确这是本机 records 质量预览，不是生产数据质量规则或真实接口检查。"
  - "导航 active 状态能识别 `/data-quality`。"
status: "done"
```

### US181 - Data quality imported records QA

```yaml
id: US181
requirement_ids:
  - R169
module: "数据与集成验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入三类 CSV 后进入数据质量页，这样能证明该入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席主数据、状态数据和登录数据后，data-quality 出现 `数据质量 records` 摘要。"
  - "E2E 确认数据质量是可点击 link。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-production-quality-rule、no-auto-fix、no-field-mapping-writeback。"
status: "done"
```

### US177 - Adherence monitoring navigation entry

```yaml
id: US177
requirement_ids:
  - R165
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏实时遵守率成为可点击入口，这样履约监控导航不再保留该占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`履约监控 > 实时遵守率` 链接到 `/adherence-monitoring`。"
  - "页面和文案明确这是本机 records 预览，不是生产实时遵守率公式。"
  - "导航 active 状态能识别 `/adherence-monitoring`。"
status: "done"
```

### US178 - Adherence monitoring imported records QA

```yaml
id: US178
requirement_ids:
  - R166
module: "履约监控验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入状态和登录数据后进入实时遵守率页，这样能证明该入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席状态和登录数据后，adherence-monitoring 出现 `遵守率预览 records` 摘要。"
  - "E2E 确认实时遵守率是可点击 link。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-production-adherence-formula、no-realtime-stream、no-status-writeback。"
status: "done"
```

### US173 - Exception review reads imported records

```yaml
id: US173
requirement_ids:
  - R161
module: "履约监控"
role: "演示人员"
story: "作为演示人员，我希望异常复核页能只读展示本机导入的状态和登录 records，这样可以演示复核入口基于现有导入处理结果。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/exception-review` 页面。"
  - "页面读取 processed records 中的 status_log 和 login_log，并展示 `复核队列 records` 摘要。"
  - "页面展示只读复核队列、状态数据行数、登录数据行数和样本 records。"
  - "不做审批动作、不写回状态、不做实时流、不做生产异常判定或遵守率公式、不接数据库、不做真实集成、导出、批量或结算。"
status: "done"
```

### US174 - Exception review navigation entry

```yaml
id: US174
requirement_ids:
  - R162
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏异常复核成为可点击入口，这样履约监控的复核入口不再只是占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`履约监控 > 异常复核` 链接到 `/exception-review`。"
  - "实时遵守率继续显示 `开发中` 且不可点击。"
  - "导航 active 状态能识别 `/exception-review`。"
status: "done"
```

### US175 - Exception review imported records QA

```yaml
id: US175
requirement_ids:
  - R163
module: "履约监控验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入状态和登录数据后进入异常复核页，这样能证明异常复核入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席状态和登录数据后，exception-review 出现 `复核队列 records` 摘要。"
  - "E2E 确认异常复核是可点击 link，实时遵守率仍是 `开发中`。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-approval、no-status-writeback、no-production-exception-rule。"
status: "done"
```

### US129 - Plan-origin row-action context closure

```yaml
id: US129
requirement_ids:
  - R117
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望计划详情时段表和班次明细表里的行级动作继续保留 plan-origin review context，这样从表格继续钻取时不会丢失当前计划的复核上下文。"
task_type: "feature"
priority: "P1"
acceptance:
  - "计划详情时段表里的 风险 / 班次 / 不可用 行级动作保留 schedule-plans 来源页。"
  - "班次明细表里的 计划 / 风险 行级动作保留当前 scope 和来源页，而不是回到宽泛列表。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US170 - Fulfillment exceptions reads imported records

```yaml
id: US170
requirement_ids:
  - R158
module: "履约监控"
role: "演示人员"
story: "作为演示人员，我希望异常管理页能展示本机导入的状态和登录 records，这样可以演示异常线索来自现有导入处理结果。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/fulfillment-exceptions` 页面。"
  - "页面读取 processed records 中的 status_log 和 login_log，并展示 `异常线索 records` 摘要。"
  - "页面展示状态数据行数、登录数据行数、线索状态和样本 records。"
  - "不做实时流、不做生产异常判定或遵守率公式、不接数据库、不做真实集成、审批、导出、批量或结算。"
status: "done"
```

### US171 - Fulfillment exceptions navigation entry

```yaml
id: US171
requirement_ids:
  - R159
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏异常管理成为可点击入口，这样履约监控的第三个模块不再只是占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`履约监控 > 异常管理` 链接到 `/fulfillment-exceptions`。"
  - "实时遵守率和异常复核继续显示 `开发中` 且不可点击。"
  - "导航 active 状态能识别 `/fulfillment-exceptions`。"
status: "done"
```

### US172 - Fulfillment exceptions imported records QA

```yaml
id: US172
requirement_ids:
  - R160
module: "履约监控验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入状态和登录数据后进入异常管理页，这样能证明异常管理入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席状态和登录数据后，fulfillment-exceptions 出现 `异常线索 records` 摘要。"
  - "E2E 确认异常管理是可点击 link，实时遵守率仍是 `开发中`。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-production-formula、no-production-exception-rule。"
status: "done"
```

### US001 - 运营负责人查看 Dashboard 总览

```yaml
id: US001
requirement_ids:
  - R001
  - R002
module: "运营工作台"
role: "运营负责人"
story: "作为运营负责人，我希望在首页查看预测需求、BPO 排班、实际有效工时和异常工时概览，以便快速判断当日履约风险。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "首页展示四个 shadcn Card 风格指标卡。"
  - "业务文案使用中文。"
  - "支持 light/dark theme。"
dependencies:
  - "F001"
status: "done"
```

### US128 - Plan-origin review back-link closure

```yaml
id: US128
requirement_ids:
  - R116
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望从计划详情进入班次、风险和不可用后仍能返回当前计划详情，这样我不会在 review drilldown 中丢失计划上下文。"
task_type: "feature"
priority: "P1"
acceptance:
  - "schedule-plans 作为来源页时，risk / unavailability detail 的返回动作回到当前计划详情。"
  - "shift-details 从计划详情进入后，页面和后续动作继续保留 plan-origin review context。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US073-US082 - Dashboard 本地 parity 连续增强

```yaml
stories:
  - id: US073
    requirement_ids: [R061]
    story: "作为运营负责人，我希望 dashboard 异常明细表支持本地状态与严重度筛选。"
    status: "done"
  - id: US074
    requirement_ids: [R062]
    story: "作为运营负责人，我希望 dashboard 异常明细表显示筛选摘要并可一键重置。"
    status: "done"
  - id: US075
    requirement_ids: [R063]
    story: "作为运营负责人，我希望 dashboard 异常明细表显示分页范围并支持首页/末页。"
    status: "done"
  - id: US076
    requirement_ids: [R064]
    story: "作为项目执行者，我希望 dashboard 数据接入状态模型有本地测试覆盖。"
    status: "done"
  - id: US077
    requirement_ids: [R065]
    story: "作为运营负责人，我希望 dashboard 数据接入状态使用 TanStack Table 展示。"
    status: "done"
  - id: US078
    requirement_ids: [R066]
    story: "作为运营负责人，我希望 dashboard 数据接入状态支持本地状态筛选和摘要。"
    status: "done"
  - id: US079
    requirement_ids: [R067]
    story: "作为项目执行者，我希望 dashboard 热力图缺口统计有本地测试覆盖。"
    status: "done"
  - id: US080
    requirement_ids: [R068]
    story: "作为运营负责人，我希望 dashboard 热力图显示缺口总览、严重时段和峰值缺口。"
    status: "done"
  - id: US081
    requirement_ids: [R069]
    story: "作为运营负责人，我希望 dashboard 热力图格子有更清晰的可访问标签和聚焦状态。"
    status: "done"
  - id: US082
    requirement_ids: [R070]
    story: "作为 QA，我希望 F032-F040 dashboard 连续开发块完成后有验收收口。"
    status: "done"
acceptance:
  - "只做本地展示层增强，不新增依赖、不改后端契约、不接数据库。"
  - "不启用真实同步、审批、导出、批量、权限或生产公式。"
  - "`bash scripts/check.sh` 通过。"
```

### US002 - 运营查看履约趋势与时段缺口

```yaml
id: US002
requirement_ids:
  - R001
  - R002
module: "履约监控"
role: "运营负责人"
story: "作为运营负责人，我希望查看排班实现率、排班拟合度、排班遵守率趋势和时段缺口热力图，以便识别履约波动。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "趋势图展示排班实现率、排班拟合度、排班遵守率。"
  - "热力图展示按日期和时段聚合的缺口。"
  - "F001 中的 Recharts 仅作为 shadcn chart structure 的静态 prototype 例外。"
dependencies:
  - "US001"
  - "D005"
status: "done"
```

### US003 - 运营复核异常工时列表

```yaml
id: US003
requirement_ids:
  - R001
module: "异常管理"
role: "运营专员"
story: "作为运营专员，我希望查看异常工时列表、严重程度、状态和影响工时，以便进行后续复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "异常表格展示异常编号、类型、项目、团队、时段、人数、影响工时、严重程度和状态。"
  - "支持搜索、状态 badge、分页和行操作。"
  - "不提供真实审批、导出、批量处理或结算确认能力。"
dependencies:
  - "US001"
status: "done"
```

### US004 - 运营查看数据同步状态

```yaml
id: US004
requirement_ids:
  - R001
module: "数据与集成"
role: "运营负责人"
story: "作为运营负责人，我希望查看 CORN 登录数据、CORN 状态日志、BPO 排班数据和预测需求数据的同步状态，以便识别数据接入风险。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "展示数据源、批次、同步状态和同步时间。"
  - "仅展示静态 mock 状态，不接入真实 API。"
dependencies:
  - "US001"
status: "done"
```

### US005 - 用户切换 light/dark 主题

```yaml
id: US005
requirement_ids:
  - R002
module: "前端体验"
role: "平台用户"
story: "作为平台用户，我希望在 light 和 dark theme 之间切换，以便在不同使用环境下保持可读性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "提供 ThemeToggle。"
  - "核心 dashboard 区域在 light/dark theme 下均可读。"
  - "优先使用 shadcn / Tailwind semantic tokens。"
dependencies:
  - "US001"
status: "done"
```

### US006 - PM 确认 MVP 第一条纵切范围

```yaml
id: US006
requirement_ids:
  - R003
module: "MVP 范围"
role: "PM"
story: "作为 PM，我希望先确认第一条前后端纵切范围，以便团队在正式开发前知道第一批只做排班计划列表、详情、FastAPI 只读接口和本地种子数据。"
task_type: "product"
priority: "P0"
acceptance:
  - "第一条纵切明确为排班计划。"
  - "明确本阶段不做新增、编辑、发布、审批、导出、批量操作、认证、数据库或真实集成。"
  - "明确后续实现拆为 B001、F005 和 Q001。"
dependencies:
  - "H007"
status: "done"
```

### US007 - 排班人员查看排班计划列表

```yaml
id: US007
requirement_ids:
  - R003
  - R005
module: "计划与排班"
role: "排班人员"
story: "作为排班人员，我希望查看排班计划列表，以便按日期、项目、职场、版本、状态和缺口风险找到需要处理的计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表展示计划编号、日期、项目、职场、版本、状态、预测人数、已排人数、缺口人数和更新时间。"
  - "列表支持按关键词搜索计划编号、项目或职场。"
  - "状态展示仅使用 draft、review_ready、published 三个 MVP 展示状态。"
dependencies:
  - "US006"
  - "US010"
status: "done"
```

### US008 - 排班人员打开排班计划详情

```yaml
id: US008
requirement_ids:
  - R003
  - R006
module: "计划与排班"
role: "排班人员"
story: "作为排班人员，我希望打开单个排班计划详情，以便查看计划摘要、时段明细、缺口和备注。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "详情展示计划基础信息、版本、状态、覆盖率和缺口汇总。"
  - "详情展示 0.5h 时段级预测人数、已排人数、缺口人数和备注。"
  - "详情仅只读展示，不提供人员级编辑、拖拽、发布或审批操作。"
dependencies:
  - "US007"
  - "US011"
status: "done"
```

### US009 - 运营负责人查看排班覆盖风险

```yaml
id: US009
requirement_ids:
  - R005
  - R006
  - R009
module: "计划与排班"
role: "运营负责人"
story: "作为运营负责人，我希望在计划列表和详情中看到覆盖率、缺口人数和风险标记，以便判断哪天或哪个职场需要优先复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表和详情均展示 forecast_agents、scheduled_agents、gap_agents 和 coverage_rate。"
  - "coverage_rate 在 MVP 中按 scheduled_agents / forecast_agents 展示。"
  - "当 gap_agents 大于 0 时展示风险标记，但不触发真实告警、审批或通知。"
dependencies:
  - "US007"
  - "US008"
status: "done"
```

### US010 - 后端提供排班计划列表接口

```yaml
id: US010
requirement_ids:
  - R007
  - R008
module: "后端服务"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 排班计划列表接口，以便从后端读取本地种子数据并渲染计划列表。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-plans。"
  - "响应包含 items 数组，每项包含 id、plan_date、project_name、site_name、version、status、forecast_agents、scheduled_agents、gap_agents、coverage_rate、updated_at。"
  - "接口从本地种子数据读取，不接数据库、认证或真实外部系统。"
dependencies:
  - "US006"
status: "done"
```

### US011 - 后端提供排班计划详情接口

```yaml
id: US011
requirement_ids:
  - R007
  - R008
module: "后端服务"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 排班计划详情接口，以便读取单个计划的摘要和 0.5h 时段明细。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-plans/{plan_id}。"
  - "响应包含 summary 和 intervals。"
  - "intervals 每项包含 interval_start、interval_end、forecast_agents、scheduled_agents、gap_agents、coverage_rate、note。"
  - "当 plan_id 不存在时返回 404 和 machine-readable error code。"
dependencies:
  - "US010"
status: "done"
```

### US012 - 前端从 FastAPI 读取排班计划数据

```yaml
id: US012
requirement_ids:
  - R007
  - R008
module: "接口契约"
role: "前端应用"
story: "作为前端应用，我希望使用统一 API client 读取排班计划列表和详情，以便后续从静态 mock 过渡到后端数据。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "前端使用集中封装的 API client 调用排班接口。"
  - "接口失败时展示可读错误状态。"
  - "不把 FastAPI URL 和字段映射散落在多个组件里。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US013 - 后端本地种子数据表达预测需求

```yaml
id: US013
requirement_ids:
  - R004
  - R007
module: "博西预测需求"
role: "后端服务"
story: "作为后端服务，我希望用本地种子数据表达预测需求，以便第一条纵切能在不接真实 Excel 的情况下展示计划输入。"
task_type: "backend"
priority: "P0"
acceptance:
  - "种子数据包含日期、项目、职场、0.5h 时段和预测人数。"
  - "种子数据与排班计划详情中的 intervals 可追溯。"
  - "不实现上传、解析 Excel 或外部预测系统接入。"
dependencies:
  - "US006"
status: "done"
```

### US014 - 后端本地种子数据表达排班计划

```yaml
id: US014
requirement_ids:
  - R005
  - R006
  - R007
module: "计划与排班"
role: "后端服务"
story: "作为后端服务，我希望用本地种子数据表达排班计划，以便列表和详情接口能返回稳定、可验收的数据。"
task_type: "backend"
priority: "P0"
acceptance:
  - "种子数据包含至少 3 个排班计划。"
  - "每个计划包含至少 8 个 0.5h 时段明细。"
  - "字段使用 English keys，业务展示值可使用中文。"
dependencies:
  - "US013"
status: "done"
```

### US015 - PM 确认 MVP 状态与公式展示口径

```yaml
id: US015
requirement_ids:
  - R009
module: "业务口径"
role: "PM"
story: "作为 PM，我希望确认第一条纵切中的状态和公式只是 MVP 展示口径，以便不把它误认为生产最终规则。"
task_type: "product"
priority: "P0"
acceptance:
  - "计划状态暂定为 draft、review_ready、published。"
  - "coverage_rate 暂按 scheduled_agents / forecast_agents 展示。"
  - "结算公式、排班拟合度、排班遵守率和生产状态码不在第一条纵切中固化。"
dependencies:
  - "US006"
status: "done"
```

### US016 - QA 验证第一条纵切交付

```yaml
id: US016
requirement_ids:
  - R010
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望验证第一条纵切的前端、后端、接口契约和 Harness check，以便确认它可以作为正式开发基线。"
task_type: "qa"
priority: "P0"
acceptance:
  - "前端 lint、typecheck、build 通过。"
  - "后端测试通过。"
  - "接口返回字段满足 user stories 中的契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US007"
  - "US008"
  - "US010"
  - "US011"
  - "US012"
status: "done"
```

### US017 - 后端创建排班计划草稿

```yaml
id: US017
requirement_ids:
  - R011
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 创建排班计划草稿，以便本地 MVP 可以生成 draft 状态的计划并返回计算后的摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 POST /api/v1/schedule-plans/drafts。"
  - "请求包含 plan_date、project_name、site_name、version 和 intervals。"
  - "服务端计算 forecast_agents、scheduled_agents、gap_agents、coverage_rate 和 updated_at。"
  - "新建计划状态固定为 draft。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US018 - 后端更新排班计划草稿

```yaml
id: US018
requirement_ids:
  - R011
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望更新 draft 状态的排班计划，以便本地 MVP 可以调整 0.5h 时段并重新计算摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 PUT /api/v1/schedule-plans/{plan_id}/draft。"
  - "仅允许更新 status 为 draft 的计划。"
  - "更新后重新计算 forecast_agents、scheduled_agents、gap_agents 和 coverage_rate。"
  - "当计划不存在时返回 404。"
  - "当计划不是 draft 时返回 409 和 machine-readable error code。"
  - "不实现发布、审批、导出、批量操作、权限或数据库持久化。"
dependencies:
  - "US017"
status: "done"
```

### US019 - 前端创建排班计划草稿

```yaml
id: US019
requirement_ids:
  - R012
  - R011
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从排班计划列表进入新建草稿页面并提交草稿，以便快速创建本地 MVP 排班计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划列表提供新建草稿入口。"
  - "新建页面包含日期、项目、职场、版本和核心 0.5h 时段输入。"
  - "提交时通过 Next server action 调用 B002 创建草稿接口。"
  - "创建成功后跳转到新草稿详情。"
  - "不实现完整编辑器、发布、审批、导出、批量操作、权限或数据库持久化。"
dependencies:
  - "US017"
status: "done"
```

### US020 - 前端更新排班计划草稿

```yaml
id: US020
requirement_ids:
  - R013
  - R011
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从 draft 计划详情进入编辑页面并保存草稿，以便调整本地 MVP 排班计划的时段信息。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "draft 计划详情页展示编辑草稿入口。"
  - "非 draft 计划不展示编辑入口。"
  - "编辑页预填计划信息和现有 0.5h 时段。"
  - "提交时通过 Next server action 调用 B002 PUT 草稿更新接口。"
  - "保存成功后跳转回计划详情页。"
  - "不实现发布、审批、导出、批量操作、权限、数据库持久化或人员级排班。"
dependencies:
  - "US018"
  - "US019"
status: "done"
```

### US021 - Codex 按用户故事连续交付

```yaml
id: US021
requirement_ids:
  - R014
module: "Harness 流程"
role: "PM"
story: "作为 PM，我希望 Codex 从 goal 拆出最小用户故事后，能够按依赖顺序自动开发、测试、提交，并在安全时启动 subagent 并行处理，以便项目快速进入连续交付节奏。"
task_type: "docs"
priority: "P0"
acceptance:
  - "AGENTS.md 定义 Story Runner Mode。"
  - "Story Runner Mode 明确用户故事是默认执行单位，UI 细节反馈归入当前 story。"
  - "Story Runner Mode 允许在写入范围不冲突时默认启动 bounded subagents。"
  - "docs/harness/lightweight-harness.md 和 docs/prompts/README.md 同步该规则。"
  - "已完成用户故事状态与 backlog/task-log/audit 状态对齐。"
dependencies:
  - "H009"
status: "done"
```

### US022 - 后端排班计划列表筛选

```yaml
id: US022
requirement_ids:
  - R015
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 排班计划列表支持 status 和 query 查询参数，以便列表页可以按状态和关键词读取计划摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "GET /api/v1/schedule-plans 支持 status 查询参数。"
  - "GET /api/v1/schedule-plans 支持 query 查询参数，覆盖编号、日期、项目、职场、版本和状态。"
  - "后端 unittest 覆盖按状态筛选和按关键词筛选。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US023 - 前端排班计划列表筛选

```yaml
id: US023
requirement_ids:
  - R015
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划列表按关键词搜索并切换草稿、待复核、已发布状态，以便快速找到要处理的计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表页读取 URL query 和 status 参数。"
  - "页面提供关键词搜索框、状态切换和清空筛选。"
  - "筛选后指标卡和表格基于当前结果重新汇总。"
  - "表格保留排序能力并展示空结果状态。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US022"
status: "done"
```

### US024 - 后端班次明细列表

```yaml
id: US024
requirement_ids:
  - R016
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供班次明细列表接口，以便页面可以按 0.5h 时段读取计划、预测、已排、缺口和备注。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/shift-details。"
  - "返回字段包含 plan_id、plan_date、project_name、site_name、version、status、interval_start、interval_end、forecast_agents、scheduled_agents、gap_agents、coverage_rate 和 note。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖明细字段和关键词筛选。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US025 - 前端班次明细页面

```yaml
id: US025
requirement_ids:
  - R016
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开班次明细页面并按关键词或状态筛选，以便定位具体时段缺口。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏班次明细进入真实页面。"
  - "页面展示班次数量、缺口班次、最大缺口和整体覆盖率。"
  - "页面展示 0.5h 明细表并可跳回对应排班计划。"
  - "页面支持关键词、状态和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US024"
status: "done"
```

### US026 - 后端需求计划列表

```yaml
id: US026
requirement_ids:
  - R017
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供预测需求列表接口，以便页面可以读取日期、时段、职场和预测人数。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/demand-plans。"
  - "返回字段包含 demand_id、plan_date、project_name、site_name、interval_start、interval_end、forecast_agents、source 和 status。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖字段契约和关键词筛选。"
  - "不接真实 Excel、数据库、认证、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US027 - 前端需求计划页面

```yaml
id: US027
requirement_ids:
  - R017
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开需求计划页面查看预测需求并按关键词搜索，以便快速定位某个日期、职场或时段的需求输入。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏需求计划进入真实页面。"
  - "页面展示需求时段、预测人次、覆盖职场和峰值需求。"
  - "页面展示预测需求表。"
  - "页面支持关键词搜索和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US026"
status: "done"
```

### US028 - 后端不可用记录列表

```yaml
id: US028
requirement_ids:
  - R018
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供不可用记录列表接口，以便页面可以读取人员、团队、时段、原因、状态和影响时段。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/unavailability。"
  - "返回字段包含 unavailability_id、staff_name、team_name、project_name、site_name、unavailable_date、start_time、end_time、reason、status、affected_intervals 和 note。"
  - "支持 status 和 query 查询参数。"
  - "后端 unittest 覆盖字段契约、状态筛选和关键词筛选。"
  - "不接数据库、认证、人事系统、真实请假审批或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US029 - 前端不可用管理页面

```yaml
id: US029
requirement_ids:
  - R018
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开不可用管理页面并按关键词或状态筛选，以便快速识别可能影响排班覆盖的不可用时段。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏不可用管理进入真实页面。"
  - "页面展示不可用记录、生效中、影响时段和涉及团队。"
  - "页面展示不可用记录表并可跳转到班次明细。"
  - "页面支持关键词、状态和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US028"
status: "done"
```

### US030 - 后端排班风险提示列表

```yaml
id: US030
requirement_ids:
  - R019
  - R015
  - R018
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供排班风险提示列表，将时段缺口和生效中不可用记录合并为本地风险提示，以便排班计划页展示优先复核项。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-risks。"
  - "返回字段包含 risk_id、plan_id、plan_date、project_name、site_name、interval_start、interval_end、risk_level、gap_agents、affected_unavailability、reason 和 recommendation。"
  - "高风险包含同一日期、项目、职场、时段下同时存在缺口和生效中不可用记录的情况。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖字段契约、高风险合并和关键词筛选。"
dependencies:
  - "US022"
  - "US028"
status: "done"
```

### US031 - 前端排班风险提示区

```yaml
id: US031
requirement_ids:
  - R019
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划页看到风险提示区，按风险等级查看缺口和不可用影响，并能跳转到班次明细继续处理。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划页展示排班风险提示区。"
  - "风险提示区展示风险等级、日期、时段、项目、职场、缺口、不可用、原因和建议。"
  - "风险提示区高风险数量清晰可见。"
  - "风险行可以跳转到班次明细。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US030"
status: "done"
```

### US032 - shadcn dashboard-01 视觉差距审计

```yaml
id: US032
requirement_ids:
  - R020
module: "前端设计"
role: "PM"
story: "作为 PM，我希望先对当前前端和 shadcn dashboard-01 复刻规格做差距审计，以便确认哪些差异必须改、哪些差异可以接受。"
task_type: "frontend-audit"
priority: "P0"
acceptance:
  - "阅读项目当前 components、app 页面、global CSS、components.json 和 shadcn 相关配置。"
  - "基于 spec 检查 token、字体、圆角、sidebar/header 尺寸、card 尺寸、chart/table 结构、响应式行为和 light/dark 模式。"
  - "输出差距清单，按 P0/P1/P2 标注。"
  - "明确哪些差距需要新增依赖或 package/lockfile 变更。"
  - "不直接改 UI，不安装依赖。"
dependencies:
  - "F012"
status: "done"
```

### US033 - shadcn dashboard-01 视觉对齐实施

```yaml
id: US033
requirement_ids:
  - R020
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望当前 BPO WFM 后台页面在保留业务数据、接口和路由的前提下，对齐 shadcn dashboard-01 的 token、尺寸、组件结构和响应式质感，以便界面更专业稳定。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "保留现有业务字段、接口、路由和中文业务文案。"
  - "按 spec 对齐 light/dark token、字体、圆角、sidebar/header、metric cards、chart/table 和响应式行为。"
  - "优先使用 shadcn token，不硬编码颜色。"
  - "浏览器验证 1440x900 深色、1440x900 浅色、1314px、移动端。"
  - "列出与官方 dashboard-01 仍存在的差异。"
dependencies:
  - "US032"
status: "done"
```

### US034 - shadcn 依赖与组件接入收口

```yaml
id: US034
requirement_ids:
  - R021
module: "前端设计"
role: "前端应用"
story: "作为前端应用，我希望已确认的 shadcn dashboard parity 依赖和组件先被纳入受控工程范围并通过验证，以便后续表格交互、Drawer 和 Tabler 图标迁移可以在稳定基线上继续。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "package.json 和 package-lock.json 记录 PM 已确认的依赖变更。"
  - "新增 shadcn UI 组件文件和 hooks/use-mobile.ts 纳入受控范围。"
  - "修复 use-mobile.ts 当前 lint 失败。"
  - "核对 Button、Input、Separator 上游替换不会破坏现有表单、筛选、导航和主题行为。"
  - "不开发新的业务页面或业务能力。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US033"
status: "done"
```

### US035 - Harness Gate 体系审计反馈修复

```yaml
id: US035
requirement_ids:
  - R022
module: "Harness"
role: "PM"
story: "作为 PM，我希望 Gate Registry、AGENTS 阶段名、audit-report 口径和 Story Runner 队列入口与当前项目真实范围一致，以便后续执行者不会误判 Gate 标准和下一步起点。"
task_type: "harness"
priority: "P0"
acceptance:
  - "GATE_REGISTRY.md 建立 required_workflow 到 Gate 的映射矩阵。"
  - "AGENTS.md 的 Current stage 与 PROJECT_STATE 当前范围一致。"
  - "audit-report 中旧 clean-Harness 结论被标记为历史审计快照，不再与当前结论并列。"
  - "backlog 至少有一条 `ready` 状态任务作为 Story Runner 下一步入口。"
  - "不修改业务实现、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US034"
status: "done"
```

### US036 - 前端风险明细钻取入口

```yaml
id: US036
requirement_ids:
  - R019
  - R023
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从排班计划页的风险提示进入风险明细，以便查看风险项关联的计划、时段缺口、不可用影响和人工复核建议。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "风险提示行提供稳定的明细入口。"
  - "明细展示风险等级、计划、日期、时段、项目、职场、缺口、不可用影响、原因和建议。"
  - "明细可继续跳转到排班计划详情、班次明细或不可用记录相关视图。"
  - "复用现有本地 MVP 数据契约，不新增真实数据源。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不提供审批、批量调班、自动排班或生产公式能力。"
dependencies:
  - "US031"
  - "US034"
status: "done"
```

### US037 - 前端不可用影响定位

```yaml
id: US037
requirement_ids:
  - R018
  - R019
  - R024
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从不可用记录进入影响定位，以便查看该不可用时段影响了哪些班次、缺口和风险提示。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "不可用记录行提供稳定的影响定位入口。"
  - "影响定位页展示人员、团队、项目、职场、日期、不可用时段、原因和状态。"
  - "影响定位页展示与不可用时间重叠的班次明细。"
  - "影响定位页展示与不可用时间重叠的风险提示。"
  - "页面可跳转到排班计划详情、班次明细、风险明细和不可用列表。"
  - "复用现有本地 MVP 数据契约，不新增真实数据源。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不提供审批、批量调班、自动排班或生产公式能力。"
dependencies:
  - "US029"
  - "US036"
status: "done"
```

### US038 - 风险提示表局部 table parity 迁移

```yaml
id: US038
requirement_ids:
  - R020
  - R021
  - R025
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划页的风险提示表先迁移到 TanStack Table 局部实现，以便后续逐步接近 shadcn dashboard table 交互。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "新增局部 ScheduleRiskTable 组件。"
  - "风险提示表由 TanStack Table 管理列和排序。"
  - "保留风险等级、日期、时段、项目、职场、缺口、不可用、原因、建议和明细/班次动作。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不启用批量选择、拖拽排序、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US036"
  - "US037"
status: "done"
```

### US039 - 开发服务器原生运行时硬化

```yaml
id: US039
requirement_ids:
  - R026
module: "Harness"
role: "前端开发者"
story: "作为前端开发者，我希望 `npm run dev` 和 `scripts/dev.sh` 在本机总是通过受控 Node.js 22 与受检原生包链路启动，以便不会再因为默认 Node 或 native addon 签名/缺失问题把错误拖到运行时 500。"
task_type: "harness"
priority: "P0"
acceptance:
  - "`npm run dev` 收口到项目受控开发入口，而不是裸 `next dev`。"
  - "开发入口会在启动前验证 `lightningcss` 和 Next.js compiler 原生包可加载。"
  - "开发入口与 build 统一使用 webpack 链路。"
  - "回归测试覆盖支持运行时成功和默认 Codex Node 失败可识别两类场景。"
  - "不新增依赖、不修改 lockfile、不改业务代码或后端契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US035"
status: "done"
```

### US040 - Python 3.12 开发运行时固化

```yaml
id: US040
requirement_ids:
  - R027
module: "Harness"
role: "前后端开发者"
story: "作为前后端开发者，我希望 backend dev/check 入口只接受 Python 3.12，并在启动前明确验证版本和依赖，以便不同 PATH 或系统 Python 不会悄悄改变项目运行时。"
task_type: "harness"
priority: "P0"
acceptance:
  - "项目根目录提供 `.python-version` 并声明 Python 3.12。"
  - "backend runtime 验证会拒绝系统 Python 3.9 等不受支持版本。"
  - "回归测试覆盖支持运行时成功、系统 Python 失败可识别两类场景。"
  - "README、setup、project state 和 backend README 明确 Python 3.12 约束。"
  - "不新增依赖、不修改业务代码或后端契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US039"
status: "done"
```

### US041 - Harness 标准化分支与验证工作流

```yaml
id: US041
requirement_ids:
  - R028
module: "Harness"
role: "PM"
story: "作为 PM，我希望 Codex 在每个任务中使用可审计的分支、worktree、验证、提交、集成和 push 确认流程，同时让 AGENTS.md 保持短版入口，以便后续开发既能连续推进又能控制风险。"
task_type: "harness"
priority: "P0"
acceptance:
  - "AGENTS.md 保留规则优先级、入口、分支红线、stop condition、Story Runner 和 push 控制等短版原则。"
  - "docs/quality/GIT_BRANCH_WORKFLOW.md 提供命令级 runbook。"
  - "docs/quality/FRONTEND_RULES.md 承接详细前端规则，避免 AGENTS.md 继续膨胀。"
  - "GATE_REGISTRY.md 映射分支、scope diff、最终验证和本地提交证据要求。"
  - "DONE_REPORT_TEMPLATE.md 增加分支、提交、集成和 push 决策证据字段。"
  - "H017 的 task-log、branch-log、decision-log 和 audit-report 留痕完整。"
  - "不修改业务实现、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US035"
status: "done"
```

### US042 - No Database MVP Mode 固化

```yaml
id: US042
requirement_ids:
  - R029
module: "MVP 范围"
role: "PM"
story: "作为 PM，我希望项目在功能开发完毕前明确保持 No Database MVP Mode，以便当前没有数据库环境时仍能继续验证本地业务链路。"
task_type: "harness"
priority: "P0"
acceptance:
  - "Project State、Gate Registry、Decision Log 和追踪日志明确 no-database 边界。"
  - "任何数据库连接、ORM、migration、schema、持久化配置或真实数据接入都被列为 hard stop。"
  - "允许继续使用本地接口、种子数据、进程内存和前端 fallback 完成本地 MVP 验证。"
  - "不修改 backend、package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US041"
status: "done"
```

### US043 - 本地 MVP 功能闭环入口

```yaml
id: US043
requirement_ids:
  - R030
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划页看到本地 MVP 链路入口，以便从需求计划、排班计划、风险明细、不可用影响和班次明细之间连续复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划页展示本地 MVP 链路面板。"
  - "链路面板可跳转到需求计划、排班计划、风险明细、不可用管理和班次明细。"
  - "链路面板明确当前为 No Database 本地 MVP。"
  - "不新增后端接口、不新增 mock 数据、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US042"
  - "US036"
  - "US037"
status: "done"
```

### US044 - 排班计划主表 table parity 局部迁移

```yaml
id: US044
requirement_ids:
  - R031
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划主表也使用 TanStack Table 管理列和排序，以便逐步接近 shadcn dashboard table 的实现方式。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "排班计划主表由 TanStack Table 管理列、行模型和排序。"
  - "保留日期、项目、职场、状态、缺口、覆盖率、版本、预测、已排和查看动作。"
  - "排序仍为展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US038"
  - "US043"
status: "done"
```

### US045 - 本地 MVP 验收审计

```yaml
id: US045
requirement_ids:
  - R032
module: "质量与交付"
role: "PM"
story: "作为 PM，我希望在本轮 no-database、功能闭环和 table parity 后看到一轮验收审计，以便确认下一步仍应围绕本地 MVP 而不是数据库展开。"
task_type: "qa"
priority: "P0"
acceptance:
  - "审计报告记录 No Database MVP Mode、功能闭环入口和 table parity 迁移结果。"
  - "明确当前仍不包含数据库、真实集成、权限、审批、导出、批量和生产口径。"
  - "记录最终 `bash scripts/check.sh` 验证结果。"
  - "给出下一阶段建议。"
dependencies:
  - "US042"
  - "US043"
  - "US044"
status: "done"
```

### US046 - 排班计划详情复核链路补强

```yaml
id: US046
requirement_ids:
  - R033
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划详情页直接看到班次、风险和不可用的复核入口与本地计数，以便更快完成同一计划的人工复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划详情页新增复核链路面板。"
  - "面板展示缺口时段、关联风险和生效中不可用的本地计数。"
  - "面板可跳转到班次明细、风险提示和不可用管理相关视图。"
  - "复用现有本地 MVP 契约，不新增后端接口、真实数据源、数据库或依赖。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US043"
  - "US045"
status: "done"
```

### US047 - 班次明细 table parity 第二条迁移

```yaml
id: US047
requirement_ids:
  - R034
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望班次明细页也使用 TanStack Table 管理列和排序，以便继续靠近 shadcn dashboard table 的展示体验。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "班次明细页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时段、项目、职场、状态、预测、已排、缺口、覆盖率、备注和计划动作。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US046"
  - "US044"
status: "done"
```

### US048 - 不可用记录 table parity 第三条迁移

```yaml
id: US048
requirement_ids:
  - R035
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用记录页也使用 TanStack Table 管理列和排序，以便本地 MVP 的主要列表都收口到一致的 table parity 体验。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用记录页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时间、人员、团队、项目、职场、原因、状态、影响时段、备注和影响/班次动作。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US047"
status: "done"
```

### US049 - F021-F023 本地链路 QA 验收收口

```yaml
id: US049
requirement_ids:
  - R036
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F021-F023 进行一次集中验收，确认复核链路和两条 table parity 在 no-database 模式下可验证、可追溯、可持续交付。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "验证排班计划详情可见复核链路入口和关键计数。"
  - "验证班次明细和不可用记录均由独立 TanStack Table 组件渲染并保留既有动作入口。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US046"
  - "US047"
  - "US048"
status: "done"
```

### US050 - 需求计划 table parity 第四条迁移

```yaml
id: US050
requirement_ids:
  - R037
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望需求计划页也使用 TanStack Table 管理列和排序，以便本地 MVP 的主要表格保持一致交互节奏。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "需求计划页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时段、项目、职场、预测人数、来源、状态字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US048"
status: "done"
```

### US051 - F024 单故事 QA 验收收口

```yaml
id: US051
requirement_ids:
  - R038
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F024 做单故事验收收口，确认需求计划 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "验证需求计划页面由独立 TanStack Table 组件渲染且关键字段仍保留。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US050"
status: "done"
```

### US052 - 排班计划详情时段表 table parity 第五条迁移

```yaml
id: US052
requirement_ids:
  - R039
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划详情页的 0.5h 时段表也使用 TanStack Table 管理列和排序，以保持主要表格一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "排班计划详情时段表由独立 TanStack Table 组件渲染。"
  - "保留开始、结束、预测、已排、缺口、覆盖率、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US050"
status: "done"
```

### US053 - F025 单故事 QA 验收收口

```yaml
id: US053
requirement_ids:
  - R040
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F025 做单故事验收收口，确认排班计划详情时段表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "排班计划详情页 0.5h 时段表由独立 TanStack Table 组件渲染。"
  - "时段表字段保留：开始、结束、预测、已排、缺口、覆盖率、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US052"
status: "done"
```

### US054 - 风险明细受影响班次表 table parity 第六条迁移

```yaml
id: US054
requirement_ids:
  - R041
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望风险明细页的受影响班次表也使用 TanStack Table 管理列和排序，以继续收口关键详情视图的一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "风险明细页受影响班次表由独立 TanStack Table 组件渲染。"
  - "保留计划、状态、时段、预测、已排、缺口、覆盖率、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US052"
status: "done"
```

### US055 - F026 单故事 QA 验收收口

```yaml
id: US055
requirement_ids:
  - R042
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F026 做单故事验收收口，确认风险明细受影响班次表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细页受影响班次表由独立 TanStack Table 组件渲染。"
  - "受影响班次表字段保留：计划、状态、时段、预测、已排、缺口、覆盖率、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US054"
status: "done"
```

### US056 - 风险明细不可用影响表 table parity 第七条迁移

```yaml
id: US056
requirement_ids:
  - R043
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望风险明细页的不可用影响表也使用 TanStack Table 管理列和排序，以统一详情页的表格交互。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "风险明细页不可用影响表由独立 TanStack Table 组件渲染。"
  - "保留人员、团队、时间、原因、状态、影响时段、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US054"
status: "done"
```

### US057 - F027 单故事 QA 验收收口

```yaml
id: US057
requirement_ids:
  - R044
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F027 做单故事验收收口，确认风险明细不可用影响表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细页不可用影响表由独立 TanStack Table 组件渲染。"
  - "不可用影响表字段保留：人员、团队、时间、原因、状态、影响时段、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US056"
status: "done"
```

### US058 - 不可用影响详情受影响班次表 table parity 第八条迁移

```yaml
id: US058
requirement_ids:
  - R045
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用影响详情页的受影响班次表也使用 TanStack Table 管理列和排序，以继续收口详情视图的一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用影响详情页受影响班次表由独立 TanStack Table 组件渲染。"
  - "保留计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US056"
status: "done"
```

### US059 - F028 单故事 QA 验收收口

```yaml
id: US059
requirement_ids:
  - R046
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F028 做单故事验收收口，确认不可用影响详情受影响班次表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "不可用影响详情页受影响班次表由独立 TanStack Table 组件渲染。"
  - "受影响班次表字段保留：计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US058"
status: "done"
```

### US060 - 不可用影响详情关联风险表 table parity 第九条迁移

```yaml
id: US060
requirement_ids:
  - R047
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用影响详情页的关联风险表也使用 TanStack Table 管理列和排序，以完成这组详情页 parity 闭环。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用影响详情页关联风险表由独立 TanStack Table 组件渲染。"
  - "保留风险、时段、缺口、不可用、原因、建议和动作字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US058"
status: "done"
```

### US061 - F029 单故事 QA 验收收口

```yaml
id: US061
requirement_ids:
  - R048
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F029 做单故事验收收口，确认不可用影响详情关联风险表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "不可用影响详情页关联风险表由独立 TanStack Table 组件渲染。"
  - "关联风险表字段保留：风险、时段、缺口、不可用、原因、建议和动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US060"
status: "done"
```

### US062 - 详情页 table parity 连续开发块 QA 总收口

```yaml
id: US062
requirement_ids:
  - R049
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望在 F026-F029 完成后，对风险明细和不可用影响详情这组详情页 table parity 做一次总收口，确认连续开发块可验证、可追溯、可持续交付。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细两张表与不可用影响详情两张表均已迁移为独立 TanStack Table 组件。"
  - "相关详情页动作入口保持可用，未引入审批、导出、批量调班或生产动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US055"
  - "US057"
  - "US059"
  - "US061"
status: "done"
```

### US063 - Harness 状态治理 v3 第一轮落地

```yaml
id: US063
requirement_ids:
  - R051
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望默认启动上下文从大 backlog/user stories 切到 current 状态层，并能通过 registry 和 check-state 发现状态漂移，以便后续开发不再依赖读取超大历史文件。"
task_type: "harness"
priority: "P1"
acceptance:
  - "新增 `docs/current/PROJECT_CONTEXT.md`、`docs/current/STORY_QUEUE.yaml`、`docs/current/ACTIVE_TASKS.yaml` 和 `docs/current/BLOCKERS.md`。"
  - "新增 `docs/registry/TRACE_INDEX.yaml` 和 `docs/registry/DECISION_INDEX.yaml`，且 `TRACE_INDEX.yaml` 不记录 status。"
  - "新增 `scripts/check-state.sh`，默认 warning-only，并支持 `--repair-scope` 和 `--strict`。"
  - "AGENTS、Lightweight Harness、Gate Registry、Done Report Template 和 Project State 已对齐 current/registry/archive、History-On-Demand、archive 不可执行、single writer 和 State Repair Mode。"
  - "不迁移大量 done 历史，不改业务代码，不改 package/lockfile，不接数据库。"
  - "`bash scripts/check-state.sh` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US062"
status: "done"
```

### US064 - check-state 标准验证链路接入

```yaml
id: US064
requirement_ids:
  - R052
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望标准检查能自动暴露 current/registry 状态漂移，并用回归测试证明 warning-only 不会让普通任务自锁。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 运行 `bash scripts/check-state.sh`。"
  - "新增 `scripts/tests/check-state.test.mjs`，覆盖一致状态、warning-only 不自锁、strict 缺 active task 失败、TRACE_INDEX lifecycle state 失败。"
  - "`scripts/check-state.sh` 支持测试通过 `BPO_STATE_ROOT` 注入临时状态根目录。"
  - "不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US063"
status: "done"
```

### US065 - current queue 真实任务冒烟

```yaml
id: US065
requirement_ids:
  - R053
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望用 current queue 执行一条真实治理小任务，验证下一轮任务可以从 current 层启动而不是读取大 backlog。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`docs/current/STORY_QUEUE.yaml` 曾提供 ready story，`docs/current/ACTIVE_TASKS.yaml` 曾提供匹配 active task。"
  - "`bash scripts/check-state.sh --strict` 在 current entry 存在时通过。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "TRACE_INDEX 记录 US065/H024 的历史定位，但不记录 lifecycle state。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US064"
status: "done"
```

### US066 - current done history 不变量检查

```yaml
id: US066
requirement_ids:
  - R054
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 state check 能发现 current 文件中的 done 历史，避免 current 层重新膨胀成历史日志。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`STORY_QUEUE.yaml` 出现 `status: done` 时 warning-only mode 告警，strict mode 失败。"
  - "`ACTIVE_TASKS.yaml` 出现 `status: done` 时 strict mode 失败。"
  - "state-check 回归测试覆盖 done story/task in current。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US065"
status: "done"
```

### US067 - check-state strict 默认阻断

```yaml
id: US067
requirement_ids:
  - R055
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望普通任务的标准检查默认阻断状态漂移，同时 state-repair 任务仍有明确旁路。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 默认运行 `bash scripts/check-state.sh --strict`。"
  - "`BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh` 可用于 State Repair Mode。"
  - "`BPO_STATE_CHECK_MODE=warning bash scripts/check.sh` 可用于临时诊断。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US066"
status: "done"
```

### US068 - TRACE_INDEX current_files 路径校验

```yaml
id: US068
requirement_ids:
  - R056
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 check-state 校验 TRACE_INDEX 的 current_files 路径，避免 registry 指向缺失 current 文件。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`TRACE_INDEX.yaml` 的 `current_files` 路径会被 check-state 校验。"
  - "重复 registry 路径不会产生重复输出。"
  - "回归测试覆盖 missing current_files path strict 失败。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US067"
status: "done"
```

### US069 - Codex Plan 面板边界规则

```yaml
id: US069
requirement_ids:
  - R057
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 Codex Plan 面板只作为当前会话投影视图，避免它被误用成项目状态源。"
task_type: "harness"
priority: "P1"
acceptance:
  - "AGENTS.md 明确 Codex Plan is not a source of truth。"
  - "STATE_MANAGEMENT.md 明确 Plan 必须从 Harness current queue 派生。"
  - "当 Codex Plan 与 Harness state 冲突时，Harness state wins。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US068"
status: "done"
```

### US070 - Dashboard 异常明细表 TanStack Table parity

```yaml
id: US070
requirement_ids:
  - R058
module: "前端设计"
role: "运营负责人"
story: "作为运营负责人，我希望 dashboard 的 BPO 异常明细表也使用 TanStack Table 管理排序和分页，以便首页表格与其他 MVP 表格保持一致。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "Dashboard 异常明细表由 TanStack Table 管理列、排序和分页。"
  - "保留异常编号、异常类型、团队、人数、影响工时、严重度、状态、项目、班次时间和操作字段。"
  - "搜索、排序和分页仍为本地展示行为，不改变数据来源或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US069"
status: "done"
```

### US071 - Dashboard 异常明细表本地列显示与分页控制

```yaml
id: US071
requirement_ids:
  - R059
module: "前端设计"
role: "运营负责人"
story: "作为运营负责人，我希望 dashboard 异常明细表的列控制和分页大小是可用的本地交互，以便快速聚焦异常字段。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "列控制按钮可打开本地列显示开关。"
  - "分页大小可在本地切换，并保持当前筛选结果下的页码有效。"
  - "交互只改变本地表格展示，不触发真实动作或后端写入。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US070"
status: "done"
```

### US072 - F030-F031 dashboard table parity QA 收口

```yaml
id: US072
requirement_ids:
  - R060
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F030-F031 做验收收口，确认 dashboard table parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "Dashboard 异常明细表使用 TanStack Table 管理排序和分页。"
  - "列显示与分页大小控制可用，且未引入审批、导出、批量或生产动作。"
  - "完成审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US071"
status: "done"
```

### US083-US102 - 排班/风险/不可用表格本地 parity 连续增强

```yaml
stories:
  - {id: US083, requirement_ids: [R071], task_ids: [F041], status: done, story: "排班计划表需要本地筛选与统计模型测试。"}
  - {id: US084, requirement_ids: [R072], task_ids: [F042], status: done, story: "排班计划表需要本地摘要条。"}
  - {id: US085, requirement_ids: [R073], task_ids: [F043], status: done, story: "排班计划表需要本地查询、状态和缺口筛选。"}
  - {id: US086, requirement_ids: [R074], task_ids: [F044], status: done, story: "排班计划表需要重置筛选和空结果提示。"}
  - {id: US087, requirement_ids: [R075], task_ids: [F045], status: done, story: "排班计划表需要本地分页范围与翻页控制。"}
  - {id: US088, requirement_ids: [R076], task_ids: [F046], status: done, story: "排班计划表需要本地列显示控制。"}
  - {id: US089, requirement_ids: [R077], task_ids: [F047], status: done, story: "风险提示表需要本地筛选与统计模型测试。"}
  - {id: US090, requirement_ids: [R078], task_ids: [F048], status: done, story: "风险提示表需要本地摘要条。"}
  - {id: US091, requirement_ids: [R079], task_ids: [F049], status: done, story: "风险提示表需要风险等级筛选。"}
  - {id: US092, requirement_ids: [R080], task_ids: [F050], status: done, story: "风险提示表需要本地搜索。"}
  - {id: US093, requirement_ids: [R081], task_ids: [F051], status: done, story: "风险提示表需要本地分页范围与翻页控制。"}
  - {id: US094, requirement_ids: [R082], task_ids: [F052], status: done, story: "风险提示表需要重置筛选和空结果提示。"}
  - {id: US095, requirement_ids: [R083], task_ids: [F053], status: done, story: "不可用表需要本地筛选与统计模型测试。"}
  - {id: US096, requirement_ids: [R084], task_ids: [F054], status: done, story: "不可用表需要本地摘要条。"}
  - {id: US097, requirement_ids: [R085], task_ids: [F055], status: done, story: "不可用表需要状态筛选。"}
  - {id: US098, requirement_ids: [R086], task_ids: [F056], status: done, story: "不可用表需要本地搜索。"}
  - {id: US099, requirement_ids: [R087], task_ids: [F057], status: done, story: "不可用表需要本地分页范围与翻页控制。"}
  - {id: US100, requirement_ids: [R088], task_ids: [F058], status: done, story: "不可用表需要重置筛选和空结果提示。"}
  - {id: US101, requirement_ids: [R089], task_ids: [F059], status: done, story: "不可用表需要本地列显示控制。"}
  - {id: US102, requirement_ids: [R090], task_ids: [Q014], status: done, story: "F041-F059 完成后需要 QA 收口。"}
acceptance:
  - "三张本地表格均有筛选摘要、重置、分页范围和空结果提示。"
  - "排班计划表与不可用表具备列显示控制。"
  - "本地筛选和统计模型有回归测试覆盖。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
```

### US103 - current-state governance closeout

```yaml
id: US103
requirement_ids:
  - R091
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 current-state 的执行 SoT、最小 schema 和 state-check 规则收口一致，这样 Story Runner 在继续开发前不会被状态漂移误导。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`AGENTS.md`、`GATE_REGISTRY.md`、`PROJECT_CONTEXT.md` 的默认读集和 SoT 口径一致。"
  - "`ACTIVE_TASKS.yaml` 明确最小执行合同，不复制完整历史验收。"
  - "`check-state` 校验 current 状态枚举、gate 存在性、active task 最小字段、registry 预算和 archive 不可执行。"
  - "`check-state` strict 失败后，普通开发必须转入 `state-repair`。"
  - "`bash scripts/check-state.sh --strict`、`bash scripts/check-state.sh --repair-scope`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US102"
status: "done"
```

### US104 - 风险提示工作台页

```yaml
id: US104
requirement_ids:
  - R092
module: "前端设计"
role: "运营负责人"
story: "作为运营负责人，我希望有一个独立的风险提示工作台页，并从计划详情、不可用影响定位等页面稳定进入风险列表，以便统一复核风险、缺口和不可用影响。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "新增 `/schedule-risks` 页面，展示本地风险列表、摘要和复核入口。"
  - "风险列表复用现有本地 MVP 风险契约，不新增真实数据源。"
  - "排班计划详情、不可用影响定位和相关返回入口统一到风险工作台或风险明细，不再使用误导性的间接跳转。"
  - "导航提供稳定风险入口。"
  - "不新增依赖、不改 package 或 lockfile。"
  - "不提供审批、批量调班、自动排班或生产公式能力。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US103"
status: "done"
```

### US105 - 风险工作台 QA 收口

```yaml
id: US105
requirement_ids:
  - R093
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对风险工作台链路做验收收口，确认独立页、导航入口和跨页风险跳转已经形成可验证、可追溯的本地 MVP 复核链。"
task_type: "qa"
priority: "P0"
acceptance:
  - "`/schedule-risks` 独立页可访问，并显示本地风险摘要与列表。"
  - "按计划上下文筛选的风险工作台路由可访问，并正确收敛到对应风险。"
  - "计划详情、风险明细、不可用影响定位和 sidebar 风险入口链路一致。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US104"
status: "done"
```

### US106 - 班次明细 scoped drilldown

```yaml
id: US106
requirement_ids:
  - R094
module: "排班复核"
role: "排班复核专员"
story: "作为复核专员，我希望班次明细页能保留计划、风险或不可用带来的精确上下文，这样我打开班次后不用重新人工筛一遍。"
task_type: "feature"
priority: "P0"
acceptance:
  - "班次明细支持 plan/date/project/site/interval 级别的本地上下文过滤。"
  - "从计划详情、风险明细、不可用影响定位进入班次时，不再回到宽泛列表。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US107 - 不可用 scoped drilldown

```yaml
id: US107
requirement_ids:
  - R095
module: "排班复核"
role: "排班复核专员"
story: "作为复核专员，我希望不可用列表页能保留计划或风险带来的项目、职场、日期和时间范围，这样我能直接看到真正相关的不可用记录。"
task_type: "feature"
priority: "P0"
acceptance:
  - "不可用列表支持 project/site/date/time 级别的本地上下文过滤。"
  - "从计划详情和风险明细进入不可用页时，范围能正确收敛。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US108 - 风险工作台右侧 rail

```yaml
id: US108
requirement_ids:
  - R096
module: "排班复核"
role: "排班复核专员"
story: "作为复核专员，我希望风险工作台在宽屏下有稳定的右侧复核 rail，用来看到当前范围、建议动作和下一跳入口。"
task_type: "feature"
priority: "P0"
acceptance:
  - "风险工作台在宽屏布局显示右侧 rail，不与主表格重叠。"
  - "右侧 rail 展示当前上下文、建议动作和跨页入口。"
  - "不新增依赖、不接数据库、不引入审批或任务系统。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US109 - 四页上下文链路对齐

```yaml
id: US109
requirement_ids:
  - R097
module: "排班复核"
role: "排班复核专员"
story: "作为复核专员，我希望计划、风险、班次和不可用四页之间的链接都保留同一复核范围，这样我可以连续检查，不用在各页重复搜索。"
task_type: "feature"
priority: "P0"
acceptance:
  - "计划、风险、班次和不可用四页的主要链接都保留精确上下文。"
  - "同一链路下的返回入口不再退化成宽泛列表。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US110 - scoped drilldown QA 收口

```yaml
id: US110
requirement_ids:
  - R098
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F061-F064 的 scoped drilldown 和右侧 rail 做收口验收，确保链路、布局和 no-database 边界都可验证。"
task_type: "qa"
priority: "P0"
acceptance:
  - "风险工作台右侧 rail 在宽屏可见，主内容不遮挡。"
  - "计划、风险、班次和不可用四页的 scoped drilldown 都可访问且范围正确。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US111 - 班次明细右侧复核 rail

```yaml
id: US111
requirement_ids:
  - R099
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望班次明细页在宽屏下也有右侧复核 rail，这样我不会只剩一整块表格。"
task_type: "feature"
priority: "P0"
acceptance:
  - "班次明细页在宽屏下显示右侧复核 rail。"
  - "rail 显示当前上下文、关键指标和继续复核入口。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US112 - 不可用列表右侧复核 rail

```yaml
id: US112
requirement_ids:
  - R100
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望不可用列表页在宽屏下也有右侧复核 rail，这样我能在列表旁继续看范围和复核入口。"
task_type: "feature"
priority: "P0"
acceptance:
  - "不可用列表页在宽屏下显示右侧复核 rail。"
  - "rail 显示当前范围、影响摘要和继续复核入口。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US113 - 计划时段明细 continuation actions

```yaml
id: US113
requirement_ids:
  - R101
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望计划详情里的 0.5h 时段明细能直接继续查看风险、班次和不可用，这样复核链路不会中断。"
task_type: "feature"
priority: "P0"
acceptance:
  - "计划详情里的时段表提供风险、班次和不可用 continuation actions。"
  - "跳转保留计划、日期、职场和时段上下文。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US114 - 不可用影响表 continuation actions

```yaml
id: US114
requirement_ids:
  - R102
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望不可用影响页里的关联风险表能继续跳到同范围的风险、班次和计划，这样可以保持上下文继续复核。"
task_type: "feature"
priority: "P0"
acceptance:
  - "不可用影响页里的关联风险表提供风险、班次和计划 continuation actions。"
  - "detail 页之间不退回宽泛列表。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US115 - review rail + continuation action QA 收口

```yaml
id: US115
requirement_ids:
  - R103
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F065-F068 这组 review rail 和 continuation action 改动做收口验收，确保链路、布局和 no-database 边界都可验证。"
task_type: "qa"
priority: "P0"
acceptance:
  - "宽屏右侧 rail 在班次明细和不可用列表可见，主内容不遮挡。"
  - "计划详情和不可用影响页的 continuation actions 保留精确上下文。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US116 - 排班计划详情右侧复核 rail

```yaml
id: US116
requirement_ids:
  - R104
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望排班计划详情页在宽屏下也有右侧复核 rail，这样查看 0.5h 时段时不会只剩主内容。"
task_type: "feature"
priority: "P0"
acceptance:
  - "排班计划详情页在宽屏下显示右侧复核 rail。"
  - "rail 显示当前范围、关键指标和继续复核入口。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US117 - 风险明细右侧复核 rail

```yaml
id: US117
requirement_ids:
  - R105
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望风险明细页在宽屏下也有右侧复核 rail，这样查看关联班次和不可用时能保持复核姿态。"
task_type: "feature"
priority: "P0"
acceptance:
  - "风险明细页在宽屏下显示右侧复核 rail。"
  - "rail 显示当前范围、关键指标和继续复核入口。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US118 - 不可用影响定位右侧复核 rail

```yaml
id: US118
requirement_ids:
  - R106
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望不可用影响定位页在宽屏下也有右侧复核 rail，这样查看影响班次和关联风险时能保持复核姿态。"
task_type: "feature"
priority: "P0"
acceptance:
  - "不可用影响定位页在宽屏下显示右侧复核 rail。"
  - "rail 显示当前范围、关键指标和继续复核入口。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US119 - detail 页复核入口统一 helper

```yaml
id: US119
requirement_ids:
  - R107
module: "排班与风险联动"
role: "排班经理"
story: "作为排班经理，我希望 detail 页的复核入口继续统一到同一套本地 helper，这样跨页动作不会再次漂移。"
task_type: "feature"
priority: "P0"
acceptance:
  - "计划详情、风险明细和不可用影响定位的主要 review 入口统一使用同一套本地 helper。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US120 - detail 页右侧 rail QA 收口

```yaml
id: US120
requirement_ids:
  - R108
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F069-F072 这组 detail 页右侧 rail 改动做收口验收，确保链路、布局和 no-database 边界都可验证。"
task_type: "qa"
priority: "P0"
acceptance:
  - "计划详情、风险明细和不可用影响定位页在宽屏下均可见右侧 rail。"
  - "detail 页的 review 入口和范围摘要与现有列表页保持一致。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
  - "`bash scripts/check.sh` 通过。"
status: "done"
```

### US121 - Harness 文档一致性与 Hook 守门

```yaml
id: US121
requirement_ids:
  - R109
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 Harness 状态、文档、任务范围、提交和推送前验证都有一致的可校验合同，这样 Story Runner 和人工审计都不会被漂移状态误导。"
task_type: "harness"
priority: "P1"
acceptance:
  - "AGENTS.md、STATE_MANAGEMENT.md、GIT_BRANCH_WORKFLOW.md 和 GATE_REGISTRY.md 对齐同一套 SoT、优先级与 hook 边界。"
  - "ACTIVE_TASKS 最小合同包含 traceability_files，并定义 batch 约束与 diff scope 规则。"
  - "`check-state` 支持 `--diff=working|staged|none`，并校验 branch、acceptance_ref、diff scope、batch 和 registry 预算。"
  - "pre-commit、commit-msg、pre-push 与 install-hooks 脚本落地，hook 只拦截不一致，不自动改文档。"
  - "回归测试覆盖新的 strict failure 场景和 commit message 校验。"
  - "`bash scripts/check-state.sh --strict --diff=working`、`node --test scripts/tests/check-state.test.mjs`、`node --test scripts/tests/validate-commit-message.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US120"
status: "done"
```

### US122 - TRACE_INDEX 预算治理与窗口化

```yaml
id: US122
requirement_ids:
  - R110
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 TRACE_INDEX 保持在明确预算内并有稳定的减重规则，这样 current 之外的 lookup 层不会重新膨胀成默认上下文负担。"
task_type: "harness"
priority: "P1"
acceptance:
  - "TRACE_INDEX 回到 warning 预算内，strict state check 不再输出 registry budget warning。"
  - "STATE_MANAGEMENT 或同级规则文档明确 registry windowing / slimming 规则。"
  - "current queue、trace index 和 legacy traceability 对这条治理任务保持一致。"
  - "`bash scripts/check-state.sh --strict --diff=working`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US121"
status: "done"
```

### US123 - Traceability closeout guard

```yaml
id: US123
requirement_ids:
  - R111
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望在任务验证完成并清空 current 后，仍能对极小范围的 traceability 证据回写继续提交，这样 branch-log 的 local_commit_sha 不会因为 hook 自锁而长期缺失。"
task_type: "harness"
priority: "P1"
acceptance:
  - "当 current 已清空且 staged diff 只包含允许的 traceability closeout 文件时，`check-state --strict --diff=staged` 通过。"
  - "无 active task 的普通 staged diff 仍然严格失败，不放宽到任意文档。"
  - "STATE_MANAGEMENT 与 GIT_BRANCH_WORKFLOW 明确 post-closeout traceability-only diff 的边界。"
  - "最近几条 branch-log 记录补齐真实 `local_commit_sha`。"
  - "`bash scripts/check-state.sh --strict --diff=working`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US122"
status: "done"
```

### US124 - Shared review checklist across local review pages

```yaml
id: US124
requirement_ids:
  - R112
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望计划、风险、班次和不可用页面右侧都使用同一套 review checklist，这样我能知道当前处于哪一步，并沿着同一上下文继续复核。"
task_type: "feature"
priority: "P1"
acceptance:
  - "risk/plan/shift/unavailability 相关页面右侧 `复核任务` 区块统一成共享 checklist 结构。"
  - "checklist 能显示当前步骤和下一步动作，不回退到宽泛列表。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US125 - startup seed strict-state guard

```yaml
id: US125
requirement_ids:
  - R113
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望产品 batch 在 seed current state 之后能先通过严格状态校验，再进入实现，这样 Story Runner 不会在第一步就被 current/registry startup diff 自锁。"
task_type: "harness"
priority: "P1"
acceptance:
  - "当 diff 只包含 startup seed 所需的 current/registry/traceability 文件时，`check-state --strict` 可以通过。"
  - "普通产品任务在 startup 之外仍不得修改 `docs/current/**` 或 `docs/registry/**`。"
  - "STATE_MANAGEMENT 明确 startup seed 例外边界。"
  - "`bash scripts/check-state.sh --strict --diff=working`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US126 - product closeout strict-state and commit-message guard

```yaml
id: US126
requirement_ids:
  - R114
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望产品 batch 在同一提交里完成 current closeout 时，strict state 和 commit-message 都能识别合法 closeout，这样已验证的产品任务可以正常提交而不会被 Harness 自锁。"
task_type: "harness"
priority: "P1"
acceptance:
  - "same-commit product closeout diff 在 `check-state --strict` 下可通过。"
  - "普通产品 closeout 提交可以继续使用当前任务 id 作为 commit subject。"
  - "普通无 active task 的无关提交仍然失败。"
  - "`bash scripts/check-state.sh --strict --diff=working`、`node --test scripts/tests/check-state.test.mjs`、`node --test scripts/tests/validate-commit-message.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US127 - Scoped detail navigation across review drilldown

```yaml
id: US127
requirement_ids:
  - R115
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望从风险、不可用和关联表进入 detail 页后还能保留当前 review scope 和返回路径，这样我不会在 drilldown 过程中掉回全量列表。"
task_type: "feature"
priority: "P1"
acceptance:
  - "risk / unavailability / 关联风险表进入 detail 页时，URL 保留当前 scope 和来源页。"
  - "plan / risk / unavailability detail 页里的返回动作和相关计划跳转保留 scoped review context。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US131 - Risk detail auxiliary-table continuation closure

```yaml
id: US131
requirement_ids:
  - R119
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望在风险明细页的关联班次表和不可用表里继续沿当前范围跳到计划、班次和影响页，这样我不用离开 detail 页就能完成后续复核动作。"
task_type: "feature"
priority: "P1"
acceptance:
  - "风险明细页的关联班次表提供 scoped continuation actions，不使用无上下文的只读表。"
  - "风险明细页的不可用表提供 scoped continuation actions，并保留当前风险来源页与范围。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US132 - Review list row-action parity closure

```yaml
id: US132
requirement_ids:
  - R120
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望在风险列表和不可用列表里就能继续跳到计划、班次、风险或影响页，这样我不必先进入 detail 页才能完成后续复核动作。"
task_type: "feature"
priority: "P1"
acceptance:
  - "风险列表行级动作补齐到与当前 review chain 相匹配的 scoped continuation surface。"
  - "不可用列表行级动作补齐到与当前 review chain 相匹配的 scoped continuation surface。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US133 - Schedule plan list review parity closure

```yaml
id: US133
requirement_ids:
  - R121
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望在排班计划列表行里就能继续进入风险、班次和不可用链路，这样计划列表也能直接作为 review chain 的起点。"
task_type: "feature"
priority: "P1"
acceptance:
  - "排班计划列表行级动作补齐到与当前 review chain 相匹配的 continuation surface。"
  - "新增动作保留当前计划维度下的本地 scope。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US134 - Schedule plan draft flow context closure

```yaml
id: US134
requirement_ids:
  - R122
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望从计划列表或计划详情进入新建/编辑草稿后仍能保留当前筛选和来源页，并在取消、返回或保存后回到正确的上下文，这样 draft 工作流不会打断当前复核链。"
task_type: "feature"
priority: "P1"
acceptance:
  - "计划列表进入新建草稿时保留当前 query/status 上下文。"
  - "计划详情进入编辑草稿时保留当前来源页和 scope。"
  - "新建/编辑页的返回、取消和提交后回跳保持稳定上下文，不退化成裸列表或无来源详情。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US135 - Schedule plan draft failure feedback closure

```yaml
id: US135
requirement_ids:
  - R123
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望当新建或编辑草稿失败后，回到计划列表或计划详情时能直接看到失败提示，这样我不用靠 URL 参数猜测刚才的操作结果。"
task_type: "feature"
priority: "P1"
acceptance:
  - "计划列表在 `draft=failed` 时显示可见失败提示。"
  - "计划详情在 `draft=failed` 时显示可见失败提示。"
  - "提示不引入数据库、依赖、后端契约或生产工作流能力。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US136 - Schedule plan draft success feedback closure

```yaml
id: US136
requirement_ids:
  - R124
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望当本地新建或保存草稿成功后，计划详情能直接显示成功提示，这样我不用靠页面跳转去猜测刚才的操作是否已经完成。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新建草稿成功回跳到计划详情时显示可见成功提示。"
  - "保存草稿成功回跳到计划详情时显示可见成功提示。"
  - "提示不引入数据库、依赖、后端契约或生产工作流能力。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US137 - Schedule plan list detail-context closure

```yaml
id: US137
requirement_ids:
  - R125
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望从排班计划列表点击 `查看` 进入详情时保留当前筛选和来源页，这样我完成 detail 内复核后还能回到同一个列表上下文。"
task_type: "feature"
priority: "P1"
acceptance:
  - "计划列表表格中的 `查看` 动作保留当前 query/status 和 `from=schedule-plans`。"
  - "从该入口进入的计划详情返回动作能回到同一筛选列表，而不是裸列表。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US138 - Schedule plan list-origin review return closure

```yaml
id: US138
requirement_ids:
  - R126
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望从计划列表直接进入风险、班次或不可用页后，仍能回到同一筛选计划列表，这样列表发起的 review chain 不会被误判成计划详情发起的 drilldown。"
task_type: "feature"
priority: "P1"
acceptance:
  - "计划列表中的 `风险`、`班次`、`不可用` 动作保留当前 query/status 和独立的 plan-list source。"
  - "风险、班次、不可用页识别该 source，并把返回目标稳定指向当前筛选计划列表。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US139 - Schedule plan risk-entry context closure

```yaml
id: US139
requirement_ids:
  - R127
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望从排班计划页的风险总览入口或内嵌风险预览表进入风险工作台后，仍能保留当前计划列表的 query、status 和来源页，这样我继续查看风险、班次和计划时不会丢掉原来的计划列表上下文。"
task_type: "feature"
priority: "P1"
acceptance:
  - "计划页风险总览卡片的 `查看全部` 动作保留当前 query、status 和 `from=schedule-plans-list`。"
  - "计划页内嵌风险预览表的 row actions 保留同一 plan-list source 和筛选上下文。"
  - "风险页识别该上下文，并把后续 continuation actions 与回退目标稳定指向当前筛选计划列表。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US140 - Schedule plan summary CTA context closure

```yaml
id: US140
requirement_ids:
  - R128
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望排班计划页里的 summary CTA 在跳到需求、风险、不可用和班次页时能保留当前计划列表上下文，这样我从 summary 层发起 review chain 时不会掉回硬编码或无来源的页面。"
task_type: "feature"
priority: "P1"
acceptance:
  - "计划页 summary CTA 不再使用硬编码 risk detail 或裸跨页链接。"
  - "从 summary CTA 进入风险、不可用和班次页时保留 `schedule-plans-list`、`query` 和 `status`。"
  - "计划页 summary CTA 与现有 plan-list review chain 的 helper routing 保持一致。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US141 - Risk workbench unavailability CTA context closure

```yaml
id: US141
requirement_ids:
  - R129
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望从计划列表链路进入风险工作台后，头部的 `不可用管理` 和默认回退 CTA 也保留同一 review context，这样我继续跨页检查时不会掉进裸列表或错误页面。"
task_type: "feature"
priority: "P1"
acceptance:
  - "风险工作台头部 `不可用管理` 不再使用裸 `/unavailability`，而是保留当前来源页和范围上下文。"
  - "风险工作台在无上游来源时，默认回退 CTA 仍停留在风险工作台，不跳回排班计划页。"
  - "改动只限本地前端风险页、轻量测试和追溯；不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US142 - Demand plan to schedule plan CTA context closure

```yaml
id: US142
requirement_ids:
  - R130
module: "需求与排班联动"
role: "复核人员"
story: "作为复核人员，我希望从需求计划页跳到排班计划页时能保留当前 demand query，这样我从需求入口切到排班 review flow 时不会丢掉正在看的筛选范围。"
task_type: "feature"
priority: "P1"
acceptance:
  - "需求计划页头部 `查看排班计划` 不再使用裸 `/schedule-plans`，而是保留当前 query。"
  - "改动只限本地前端需求页、轻量测试和追溯；不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US143 - Risk workbench clear-scope CTA context closure

```yaml
id: US143
requirement_ids:
  - R131
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望风险工作台里的 `查看全部` 在清掉 drilldown 范围时还能保留当前 query 和 status，这样我从局部范围回到风险列表时不会丢掉正在用的筛选上下文。"
task_type: "feature"
priority: "P1"
acceptance:
  - "风险工作台 scoped `查看全部` 不再使用裸 `/schedule-risks`，而是保留当前 query/status。"
  - "改动只限本地前端风险页、轻量测试和追溯；不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US144 - Shift and unavailability clear CTA context closure

```yaml
id: US144
requirement_ids:
  - R132
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望班次明细和不可用管理里的 `清空范围`、`清空` 只清掉当前层级该清的参数，而不是把来源页和正在用的列表上下文一起丢掉，这样我在 review chain 里切回列表态时仍然稳定。"
task_type: "feature"
priority: "P1"
acceptance:
  - "班次明细 scoped `清空范围` 清掉 drilldown 参数时，保留当前 source、query 和 status。"
  - "班次明细列表 `清空` 清掉 query/status 时，仍保留当前 source。"
  - "不可用管理 scoped `清空范围` 清掉 drilldown 参数时，保留当前 source、query 和 status。"
  - "不可用管理列表 `清空` 清掉 query/status 时，仍保留当前 source。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US145 - Schedule plan draft feedback context persistence

```yaml
id: US145
requirement_ids:
  - R133
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望排班计划页在我还停留在当前列表时继续保留本地 draft 失败/成功提示，这样我切换筛选、搜索或清空条件时不会把刚发生的结果提示直接冲掉。"
task_type: "feature"
priority: "P1"
acceptance:
  - "排班计划页搜索表单、状态切换和 `清空` 在仍停留当前页面时保留 `draft` 参数。"
  - "本地 draft 失败/成功提示不会因为列表内搜索或筛选动作立刻消失。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US146 - Schedule plan draft feedback dismiss action

```yaml
id: US146
requirement_ids:
  - R134
module: "排班与风险联动"
role: "复核人员"
story: "作为复核人员，我希望排班计划页上的本地 draft 失败/成功提示可以在同一页主动关闭，这样我清掉结果提示时仍然留在当前筛选后的计划列表。"
task_type: "feature"
priority: "P1"
acceptance:
  - "排班计划页 draft feedback 卡片提供显式 dismiss/关闭动作。"
  - "dismiss 只移除 `draft`，保留当前 `query` 和 `status`。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US147 - Demand plan clear CTA consistency

```yaml
id: US147
requirement_ids:
  - R135
module: "排班与需求联动"
role: "复核人员"
story: "作为复核人员，我希望需求计划页的 `清空` 动作也走 helper 驱动的同页路由，这样需求页和排班页的本地 CTA 行为能保持一致。"
task_type: "feature"
priority: "P2"
acceptance:
  - "需求计划页 `清空` 不再使用裸 `/demand-plans`。"
  - "`清空` 使用 helper-driven route，并保持同页 query reset 语义。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US148 - Schedule plan draft edit route E2E reinforcement

```yaml
id: US148
requirement_ids:
  - R136
module: "本地验收与排班草稿"
role: "复核人员"
story: "作为复核人员，我希望浏览器级 E2E 覆盖从筛选后的排班计划列表进入 draft 详情和编辑页，并确认取消/返回仍保留上下文，这样 draft edit 路径不只停留在源码断言层。"
task_type: "feature"
priority: "P1"
acceptance:
  - "E2E 从 `/schedule-plans?query=苏州&status=draft` 找到 draft 计划并进入详情。"
  - "详情页 `编辑草稿` 链接保留当前来源、query/status 和计划范围上下文。"
  - "编辑页 `取消` 或 `返回详情` 回到同一计划详情，并保留来源上下文。"
  - "不新增依赖、不改后端契约、不接数据库。"
  - "`npm run e2e:smoke`、`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US149 - Local table parity E2E QA reinforcement

```yaml
id: US149
requirement_ids:
  - R137
module: "本地验收与 table parity"
role: "QA"
story: "作为 QA，我希望核心 E2E 覆盖排班计划列表的可见 table parity 控制，这样本地验收能证明当前 schedule-plan table parity 不只是模型测试通过。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 在排班计划列表页面确认本地筛选、分页或列控制等 table parity 控制可见。"
  - "QA 记录明确本批只补本地浏览器级验收，不引入数据库、后端契约、依赖或生产工作流能力。"
  - "`npm run e2e:smoke`、`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US150 - Local demo staff/status/login import loop

```yaml
id: US150
requirement_ids:
  - R138
module: "本机演示数据导入"
role: "演示人员"
story: "作为演示人员，我希望能在本机导入真实坐席主数据、状态数据和登录数据，这样 dashboard 和数据接入状态可以基于我上传的演示数据说明业务流程。"
task_type: "feature"
priority: "P1"
acceptance:
  - "提供本机导入入口，支持坐席主数据、状态数据、登录数据三类 CSV 文本或文件输入。"
  - "导入后返回批次号、成功行数、失败行数和错误行明细。"
  - "导入状态保留在本机演示运行态或本地临时文件中，不使用数据库、ORM、migration 或生产持久化配置。"
  - "不新增依赖、不改 package/lockfile、不接真实 CORN/HR/WFM API。"
  - "`python3 -m unittest backend.tests.test_schedule_plans`、`npm run e2e:smoke`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US151 - Local demo visible placeholder cleanup

```yaml
id: US151
requirement_ids:
  - R139
module: "本机演示占位清零"
role: "演示人员"
story: "作为演示人员，我希望页面上的文件导入、接入批次、数据接入状态和关键行操作都能在本机演示中点通，这样演示时不会暴露明显占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "侧边栏 `文件导入`、`接入批次`、`数据源管理` 指向本机导入/批次状态页面，不再全部裸指 dashboard。"
  - "dashboard 数据接入状态显示坐席主数据、状态数据、登录数据的本机导入批次状态。"
  - "异常明细行操作不再只是图标占位，而是提供本机复核/详情上下文入口或可解释动作。"
  - "不做审批、导出、批量操作、权限、生产公式、结算规则或收费因子。"
  - "`npm run e2e:smoke`、`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US152 - Local demo import acceptance evidence

```yaml
id: US152
requirement_ids:
  - R140
module: "本机演示验收"
role: "QA"
story: "作为 QA，我希望本机导入入口、导入批次状态和占位清零入口有浏览器级 smoke 覆盖，这样能证明演示链路不是静态说明。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 覆盖进入本机导入入口、查看三类导入模板或输入区、查看导入批次状态。"
  - "E2E 或 smoke 覆盖 dashboard 数据接入状态中出现本机导入批次信息。"
  - "QA 记录明确本批仍是 localhost-only、no-database、no-real-integration、no-package-change。"
  - "`npm run e2e:smoke`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US153 - Local dashboard filters and KPI preview

```yaml
id: US153
requirement_ids:
  - R141
module: "本机 dashboard 演示筛选"
role: "演示人员"
story: "作为演示人员，我希望 dashboard 顶部筛选和数据版本提示可以在本机演示中点通，并能基于导入批次展示 KPI preview，这样演示时不会停留在纯静态指标。"
task_type: "feature"
priority: "P1"
acceptance:
  - "dashboard 顶部提供日期、职场/团队、供应商和数据版本等本机筛选控件。"
  - "筛选状态通过 URL/query 或本机页面状态保留，刷新后仍可解释当前筛选。"
  - "已导入批次能驱动本机 KPI preview 或导入覆盖说明；无导入时显示明确空态。"
  - "KPI preview 明确标注本机演示口径，不固化生产公式、状态码、结算规则或收费因子。"
  - "`npm run e2e:smoke`、`node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US154 - Local dashboard KPI preview acceptance evidence

```yaml
id: US154
requirement_ids:
  - R142
module: "本机 dashboard KPI preview 验收"
role: "QA"
story: "作为 QA，我希望浏览器级 smoke 覆盖 dashboard 本机筛选和导入批次 KPI preview，这样能证明当前 demo 不是静态说明。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 覆盖 dashboard 本机筛选控件可见、可交互，并保留当前筛选上下文。"
  - "E2E 覆盖导入批次后 dashboard KPI preview 或数据覆盖说明发生可见变化。"
  - "QA 记录明确本批仍是 localhost-only、no-database、no-real-integration、no-production-formula、no-package-change。"
  - "`npm run e2e:smoke`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US155 - Unavailable navigation development labeling

```yaml
id: US155
requirement_ids:
  - R143
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏里未开放的功能明确显示为 `开发中`，这样本机演示时不会让观众以为这些模块已经完成。"
task_type: "feature"
priority: "P1"
acceptance:
  - "未开放导航项不再作为可点击 Link 跳转到 `/dashboard` 或其他已开放页面。"
  - "未开放导航项显示 `开发中` 标识，并呈现禁用态。"
  - "已开放页面入口仍可点击，包括 dashboard、需求计划、排班计划、风险提示、班次明细、不可用管理和本机导入。"
  - "不新增依赖、不开发新页面、不接数据库、不接真实外部系统。"
  - "`npm run e2e:smoke`、`git diff --check`、`bash scripts/check-state.sh --strict --diff=working` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US156 - Remaining feature completion sequencing

```yaml
id: US156
requirement_ids:
  - R144
module: "产品补全排期"
role: "PM"
story: "作为 PM，我希望剩余功能补全按现有模块和导入数据流转来排序，这样每一批都能演示真实业务结果，而不是继续堆独立演示页。"
task_type: "feature"
priority: "P1"
acceptance:
  - "项目状态记录后续功能补全顺序。"
  - "优先级以 `导入 -> 现有模块读取 -> 结果展示/复核` 为主线。"
  - "数据库、真实集成、权限、审批、导出、批量、结算和生产公式继续列为后置 Gate。"
  - "不在本批开发新页面或后端新契约。"
status: "done"
```

### US157 - Navigation development labeling acceptance evidence

```yaml
id: US157
requirement_ids:
  - R145
module: "导航可信度验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖未开放菜单的 `开发中` 状态，这样可以防止后续导航再次误承诺未完成模块。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 确认至少一个未开放导航项显示 `开发中`。"
  - "E2E 确认该导航项不是可点击 link。"
  - "E2E 确认已开放的本机导入入口仍是可导航 link。"
  - "QA 记录明确本批不扩大到数据库、真实集成、权限、审批、导出、批量、结算或生产公式。"
status: "done"
```

### US158 - Local demo processed import records API

```yaml
id: US158
requirement_ids:
  - R146
module: "本机演示数据导入"
role: "演示人员"
story: "作为演示人员，我希望导入成功的坐席、状态和登录行能作为后端处理后的 records 被读取，这样模块页展示的是接口结果，而不是前端临时映射。"
task_type: "feature"
priority: "P1"
acceptance:
  - "后端提供 `/api/v1/demo-imports/records` 只读接口。"
  - "接口按导入类型返回总行数、最近批次、更新时间和样本行。"
  - "接口只读取本机进程内存，不使用数据库、ORM、migration、schema 或真实外部集成。"
  - "`python3 -m unittest backend.tests.test_schedule_plans` 和 `bash scripts/check.sh` 通过。"
status: "done"
```

### US159 - Existing modules read imported records

```yaml
id: US159
requirement_ids:
  - R147
module: "导入数据现有模块消费"
role: "演示人员"
story: "作为演示人员，我希望 dashboard 和班次明细能展示导入 records 的覆盖摘要，这样演示时可以说明数据已经进入现有业务模块。"
task_type: "feature"
priority: "P1"
acceptance:
  - "dashboard 读取 processed records，并展示导入 records 摘要。"
  - "shift-details 读取 processed records，并展示与班次核对相关的本机导入覆盖摘要。"
  - "没有导入 records 时页面显示明确空态，不伪造业务数据。"
  - "不新增演示中心、不固化生产 KPI/公式、不做审批、导出、批量或结算能力。"
status: "done"
```

### US160 - Imported records module-read acceptance evidence

```yaml
id: US160
requirement_ids:
  - R148
module: "导入数据现有模块验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入后 dashboard 和 shift-details 的 records 展示，这样能证明导入数据被现有模块读到了。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席主数据后，dashboard 出现 processed records 摘要。"
  - "E2E 进入 shift-details 后，能看到本机导入 records 覆盖摘要。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-production-formula。"
status: "done"
```

### US161 - Schedule risks read imported records

```yaml
id: US161
requirement_ids:
  - R149
module: "导入数据现有模块消费"
role: "演示人员"
story: "作为演示人员，我希望风险提示页能展示本机导入 records 的覆盖摘要，这样风险复核不是只看静态 seed 数据。"
task_type: "feature"
priority: "P1"
acceptance:
  - "schedule-risks 页面读取 processed records。"
  - "页面展示 `风险复核 records` 摘要，包含坐席主数据、状态数据和登录数据覆盖行数。"
  - "无导入 records 时显示等待导入空态，不伪造生产数据。"
  - "不改后端契约、不接数据库、不固化生产风险公式。"
status: "done"
```

### US162 - Unavailability reads imported records

```yaml
id: US162
requirement_ids:
  - R150
module: "导入数据现有模块消费"
role: "演示人员"
story: "作为演示人员，我希望不可用管理页能展示本机导入 records 的覆盖摘要，这样人员不可用核对也能说明导入数据已经进入模块。"
task_type: "feature"
priority: "P1"
acceptance:
  - "unavailability 页面读取 processed records。"
  - "页面展示 `不可用核对 records` 摘要，包含坐席主数据、状态数据和登录数据覆盖行数。"
  - "无导入 records 时显示等待导入空态，不伪造生产数据。"
  - "不改后端契约、不接数据库、不做权限、审批、导出或批量。"
status: "done"
```

### US163 - Risk and unavailability imported records QA

```yaml
id: US163
requirement_ids:
  - R151
module: "导入数据现有模块验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入后风险提示和不可用管理页的 records 摘要，这样能证明 records 正在继续进入现有模块。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席主数据后，schedule-risks 出现 `风险复核 records` 摘要。"
  - "E2E 导入坐席主数据后，unavailability 出现 `不可用核对 records` 摘要。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-production-formula。"
status: "done"
```

### US164 - Fulfillment monitoring reads status and login records

```yaml
id: US164
requirement_ids:
  - R152
module: "履约监控"
role: "演示人员"
story: "作为演示人员，我希望履约监控页能展示本机导入的状态和登录 records，这样可以演示坐席履约核验已经开始进入产品模块。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/fulfillment-monitoring` 页面。"
  - "页面读取 processed records，并展示 `履约核验 records` 摘要。"
  - "页面明确展示状态数据和登录数据覆盖行数。"
  - "不做生产遵守率公式、不接数据库、不做真实集成、审批、导出、批量或结算。"
status: "done"
```

### US165 - Work-hours verification navigation entry

```yaml
id: US165
requirement_ids:
  - R153
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏工时核验成为可点击入口，这样履约监控不再只是占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`履约监控 > 工时核验` 链接到 `/fulfillment-monitoring`。"
  - "其他未实现履约监控入口继续显示 `开发中` 且不可点击。"
  - "导航 active 状态能识别 `/fulfillment-monitoring`。"
status: "done"
```

### US166 - Fulfillment monitoring imported records QA

```yaml
id: US166
requirement_ids:
  - R154
module: "履约监控验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入状态和登录数据后进入履约监控页，这样能证明履约入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席状态数据和登录数据后，fulfillment-monitoring 出现 `履约核验 records` 摘要。"
  - "E2E 确认工时核验是可点击 link，坐席状态轨迹仍是 `开发中`。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-production-formula。"
status: "done"
```

### US167 - Agent status trace reads status records

```yaml
id: US167
requirement_ids:
  - R155
module: "履约监控"
role: "演示人员"
story: "作为演示人员，我希望坐席状态轨迹页能展示本机导入的状态 records，这样可以演示状态数据已经进入履约监控模块。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/agent-status-trace` 页面。"
  - "页面读取 processed records 中的 status_log，并展示 `状态轨迹 records` 摘要。"
  - "页面展示状态数据行数、状态分布和样本轨迹。"
  - "不做实时流、不做生产遵守率公式、不接数据库、不做真实集成、审批、导出、批量或结算。"
status: "done"
```

### US168 - Agent status trace navigation entry

```yaml
id: US168
requirement_ids:
  - R156
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏坐席状态轨迹成为可点击入口，这样履约监控的第二个模块不再只是占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`履约监控 > 坐席状态轨迹` 链接到 `/agent-status-trace`。"
  - "异常管理、实时遵守率和异常复核继续显示 `开发中` 且不可点击。"
  - "导航 active 状态能识别 `/agent-status-trace`。"
status: "done"
```

### US169 - Agent status trace imported records QA

```yaml
id: US169
requirement_ids:
  - R157
module: "履约监控验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入状态数据后进入坐席状态轨迹页，这样能证明状态轨迹入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席状态数据后，agent-status-trace 出现 `状态轨迹 records` 摘要。"
  - "E2E 确认坐席状态轨迹是可点击 link，异常管理仍是 `开发中`。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-production-formula。"
status: "done"
```

### US182 - CORN status log reads status records

```yaml
id: US182
requirement_ids:
  - R170
module: "数据与集成"
role: "演示人员"
story: "作为演示人员，我希望 CORN 状态日志页能展示本机导入的状态 records，这样可以演示状态日志数据已经进入数据与集成模块。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/corn-status-log` 页面。"
  - "页面读取 processed records 中的 status_log，并展示 `CORN 状态日志 records` 摘要。"
  - "页面展示状态数据行数、最近批次、状态分布和样本 records。"
  - "不接真实 CORN API、不做实时流、不做生产状态码固化、不接数据库、不做状态写回、真实接口检查、审批、导出、批量或结算。"
status: "done"
```

### US183 - CORN status log navigation entry

```yaml
id: US183
requirement_ids:
  - R171
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏 CORN 状态日志成为可点击入口，这样数据与集成模块不再只停留在导入和数据质量。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`数据与集成 > CORN 状态日志` 链接到 `/corn-status-log`。"
  - "字段映射和接口集成继续显示 `开发中` 且不可点击。"
  - "导航 active 状态能识别 `/corn-status-log`。"
status: "done"
```

### US184 - CORN status log imported records QA

```yaml
id: US184
requirement_ids:
  - R172
module: "数据与集成验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入状态数据后进入 CORN 状态日志页，这样能证明状态日志入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席状态数据后，corn-status-log 出现 `CORN 状态日志 records` 摘要。"
  - "E2E 覆盖 CORN 状态日志导航可点击，字段映射和接口集成仍是 `开发中`。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-corn-integration、no-realtime-stream、no-status-writeback、no-production-status-code。"
status: "done"
```

### US185 - Field mapping reads imported sample fields

```yaml
id: US185
requirement_ids:
  - R173
module: "数据与集成"
role: "演示人员"
story: "作为演示人员，我希望字段映射页能展示本机导入 records 的字段覆盖，这样可以说明导入数据被识别后如何进入产品字段。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/field-mapping` 页面。"
  - "页面读取 processed records 中的 staff_master/status_log/login_log 样本字段，并展示 `字段映射 records` 摘要。"
  - "页面展示三类数据的已识别字段、缺失字段、最近批次和本机只读状态。"
  - "不做字段映射写回、不保存配置、不做真实接口检查、不接数据库、不做跨系统对账、审批、导出、批量或结算。"
status: "done"
```

### US186 - Field mapping navigation entry

```yaml
id: US186
requirement_ids:
  - R174
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏字段映射成为可点击入口，这样数据与集成模块的导入后处理链路不再遗漏字段识别。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`数据与集成 > 字段映射` 链接到 `/field-mapping`。"
  - "接口集成继续显示 `开发中` 且不可点击。"
  - "导航 active 状态能识别 `/field-mapping`。"
status: "done"
```

### US187 - Field mapping imported records QA

```yaml
id: US187
requirement_ids:
  - R175
module: "数据与集成验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入三类数据后进入字段映射页，这样能证明字段映射入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入三类 CSV 后，field-mapping 出现 `字段映射 records` 摘要。"
  - "E2E 覆盖字段映射导航可点击，接口集成仍是 `开发中`。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-field-mapping-writeback、no-saved-config。"
status: "done"
```

### US188 - Organization people reads staff records

```yaml
id: US188
requirement_ids:
  - R176
module: "系统管理"
role: "演示人员"
story: "作为演示人员，我希望组织与人员页能展示本机导入的坐席主数据 records，这样可以演示系统管理入口已经能读取人员主数据。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/organization-people` 页面。"
  - "页面读取 processed records 中的 staff_master，并展示 `组织与人员 records` 摘要。"
  - "页面展示人员行数、最近批次、团队/职场/供应商分布和样本 records。"
  - "不做账号登录、权限、组织架构维护、主数据写回、数据库、真实 HR/CORN/WFM 集成、审批、导出、批量或生产审计。"
status: "done"
```

### US189 - Organization people navigation entry

```yaml
id: US189
requirement_ids:
  - R177
module: "导航可信度"
role: "演示人员"
story: "作为演示人员，我希望侧边栏组织与人员成为可点击入口，这样系统管理模块不再全部停留在占位。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`系统管理 > 组织与人员` 链接到 `/organization-people`。"
  - "供应商管理、规则配置、权限管理和操作审计继续显示 `开发中` 且不可点击。"
  - "导航 active 状态能识别 `/organization-people`。"
status: "done"
```

### US190 - Organization people imported records QA

```yaml
id: US190
requirement_ids:
  - R178
module: "系统管理验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入坐席主数据后进入组织与人员页，这样能证明系统管理入口读到了导入处理结果。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入坐席主数据后，organization-people 出现 `组织与人员 records` 摘要。"
  - "E2E 覆盖组织与人员导航可点击，权限管理和操作审计仍是 `开发中`。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-auth、no-permission、no-writeback。"
status: "done"
```

### US191 - Today fulfillment local preview

```yaml
id: US191
requirement_ids:
  - R179
module: "运营工作台"
role: "演示人员"
story: "作为演示人员，我希望今日履约页能展示本机导入的状态和登录 records，这样可以说明当天履约结果已经进入运营工作台。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/today-fulfillment` 页面。"
  - "页面展示 `今日履约 records`、状态/登录覆盖、样本和本机只读边界。"
  - "`运营工作台 > 今日履约` 链接到 `/today-fulfillment`。"
status: "done"
```

### US192 - Anomaly alerts local preview

```yaml
id: US192
requirement_ids:
  - R180
module: "运营工作台"
role: "演示人员"
story: "作为演示人员，我希望异常预警页能展示本机异常和导入覆盖，这样运营工作台不再只有经营总览。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/anomaly-alerts` 页面。"
  - "页面展示 `异常预警 records`、严重度分布和样本。"
  - "`运营工作台 > 异常预警` 链接到 `/anomaly-alerts`。"
status: "done"
```

### US193 - Deficit heatmap local preview

```yaml
id: US193
requirement_ids:
  - R181
module: "运营工作台"
role: "演示人员"
story: "作为演示人员，我希望时段缺口热力图成为独立页面，这样可以单独演示本机缺口分布。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/deficit-heatmap` 页面。"
  - "页面展示 `时段缺口 records`、总缺口、严重时段和热力图。"
  - "`运营工作台 > 时段缺口热力图` 链接到 `/deficit-heatmap`。"
status: "done"
```

### US194 - Vendor management local preview

```yaml
id: US194
requirement_ids:
  - R182
module: "系统管理"
role: "演示人员"
story: "作为演示人员，我希望供应商管理页能展示本机导入人员中的供应商覆盖，这样系统管理可以演示供应商视角。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/vendor-management` 页面。"
  - "页面读取 staff_master records 并展示 `供应商管理 records`、供应商分布和样本。"
  - "`系统管理 > 供应商管理` 链接到 `/vendor-management`。"
status: "done"
```

### US195 - Rule configuration local preview

```yaml
id: US195
requirement_ids:
  - R183
module: "系统管理"
role: "演示人员"
story: "作为演示人员，我希望规则配置页能展示本机只读规则清单，这样可以解释哪些规则仍未开放生产配置。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/rule-configuration` 页面。"
  - "页面展示 `规则配置 records`、本机预览规则清单和未开放边界。"
  - "`系统管理 > 规则配置` 链接到 `/rule-configuration`。"
status: "done"
```

### US196 - Ops and system preview pages QA

```yaml
id: US196
requirement_ids:
  - R184
module: "本机预览验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖五个新开放入口，这样能证明它们不是 dashboard 占位跳转。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 覆盖五个新页面标题、records 摘要和导航链接。"
  - "QA 记录明确本批仍是 localhost-only、process-memory、no-database、no-real-integration、no-auth、no-permission、no-settlement。"
status: "done"
```

### US197 - Schedule plan import records preview

```yaml
id: US197
requirement_ids:
  - R185
module: "排班计划"
role: "演示人员"
story: "作为演示人员，我希望可以导入排班数据 CSV，并在排班计划页看到导入后的 processed records 摘要，这样演示能基于现有排班模块完成。"
task_type: "feature"
priority: "P1"
acceptance:
  - "`/demo-imports` 新增 `排班数据` CSV 导入入口。"
  - "后端 localhost demo import 接受 `schedule_plan`，并在 processed records 返回 `排班数据`。"
  - "`/schedule-plans` 读取 schedule_plan records 并展示 `排班数据 records` 摘要、计划样本、时段行和最近批次。"
  - "本批不把导入结果写入生产排班列表、不做自动排班、不接数据库、真实 WFM/CORN/HR 集成、权限、审批、导出、批量、生产公式、结算规则或收费因子。"
status: "done"
```

### US198 - Schedule plan import QA

```yaml
id: US198
requirement_ids:
  - R186
module: "本机验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖导入 schedule_plan CSV 后进入排班计划页，这样能证明导入结果被现有模块读取。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 在文件导入页确认 `排班数据` 入口可见。"
  - "E2E 通过 localhost API 导入 schedule_plan CSV 后，排班计划页出现 `排班数据 records` 摘要。"
  - "QA 记录明确本批是 localhost-only、process-memory、no-database、no-real-integration、no-auto-scheduling。"
status: "done"
```

### US199 - Monthly settlement local preview

```yaml
id: US199
requirement_ids:
  - R187
module: "结算复盘"
role: "演示人员"
story: "作为演示人员，我希望月度结算页能展示本机导入 records 和排班/履约复盘摘要，这样可以演示结算复盘入口已基于现有数据链路打开。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/monthly-settlement` 页面。"
  - "页面读取 processed records，并展示 `结算复盘 records`、导入覆盖、计划/履约信号和本机边界。"
  - "`结算复盘 > 月度结算` 链接到 `/monthly-settlement`。"
  - "报表中心、供应商复盘、结算锁账继续显示 `开发中` 且不可点击。"
  - "本批不做结算公式、收费因子、锁账、账单金额、审批、导出、批量、数据库或真实集成。"
status: "done"
```

### US200 - Monthly settlement local preview QA

```yaml
id: US200
requirement_ids:
  - R188
module: "本机验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖月度结算入口和开发中边界，这样能证明结算复盘不是 dashboard 占位，也没有误开放生产结算能力。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入本机 CSV 后，monthly-settlement 出现 `结算复盘 records` 摘要。"
  - "E2E 覆盖月度结算导航可点击，报表中心、供应商复盘、结算锁账仍是 `开发中`。"
  - "QA 记录明确 localhost-only、process-memory、no-database、no-real-integration、no-settlement-formula、no-charge-factor、no-lock、no-export、no-batch。"
status: "done"
```

### US201 - Report center local preview

```yaml
id: US201
requirement_ids:
  - R189
module: "结算复盘"
role: "演示人员"
story: "作为演示人员，我希望报表中心能展示本机导入 records 和模块成果汇总，这样可以演示报表入口已基于现有数据链路打开。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/report-center` 页面。"
  - "页面读取 processed records，并展示 `报表中心 records`、导入覆盖、模块成果和本机边界。"
  - "`结算复盘 > 报表中心` 链接到 `/report-center`。"
  - "本批不做导出、生产报表、结算公式、收费因子、审批、批量、数据库或真实集成。"
status: "in_progress"
```

### US202 - Supplier review local preview

```yaml
id: US202
requirement_ids:
  - R190
module: "结算复盘"
role: "演示人员"
story: "作为演示人员，我希望供应商复盘页能展示本机供应商、履约和排班覆盖摘要，这样可以从供应商视角演示复盘入口。"
task_type: "feature"
priority: "P1"
acceptance:
  - "新增 `/supplier-review` 页面。"
  - "页面读取 processed records，并展示 `供应商复盘 records`、供应商覆盖、履约覆盖和排班覆盖。"
  - "`结算复盘 > 供应商复盘` 链接到 `/supplier-review`。"
  - "结算锁账继续显示 `开发中` 且不可点击。"
  - "本批不做供应商写回、账单金额、锁账、导出、审批、批量、数据库或真实集成。"
status: "ready"
```

### US203 - Report and supplier review QA

```yaml
id: US203
requirement_ids:
  - R191
module: "本机验收"
role: "QA"
story: "作为 QA，我希望 E2E 覆盖报表中心和供应商复盘入口及结算锁账边界，这样能证明新入口不是 dashboard 占位，也没有误开放生产结算能力。"
task_type: "qa"
priority: "P1"
acceptance:
  - "E2E 导入本机 CSV 后，report-center 和 supplier-review 出现 records 摘要。"
  - "E2E 覆盖报表中心、供应商复盘导航可点击，结算锁账仍是 `开发中`。"
  - "QA 记录明确 localhost-only、process-memory、no-database、no-real-integration、no-export、no-batch、no-lock、no-charge-factor。"
status: "ready"
```
