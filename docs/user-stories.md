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

### US103-US108 - 生产雏形第一批需求

```yaml
stories:
  - id: US103
    requirement_ids: [R091]
    task_ids: [H030]
    module: "Harness"
    role: "PM"
    story: "作为 PM，我希望把生产雏形大 PRD 拆成第一批可执行需求和 current ready queue，以便后续开发不再停留在大文档层。"
    task_type: "harness"
    priority: "P0"
    status: "done"
  - id: US104
    requirement_ids: [R092]
    task_ids: [B006]
    module: "主数据"
    role: "数据管理员"
    story: "作为数据管理员，我希望先有主数据导入合同，明确坐席、职场、供应商、项目、绑定关系和班次类型的字段、主键、校验、批次和失败行口径。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US105
    requirement_ids: [R093]
    task_ids: [B007]
    module: "排班"
    role: "排班运营"
    story: "作为排班运营，我希望人员级排班合同能明确员工、日期、职场、供应商、班次、休息/饭点和 0.5h 展开结果，以便后续排班导入和时段汇总可以对齐。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US106
    requirement_ids: [R094, R095]
    task_ids: [B008]
    module: "预测与实际对比"
    role: "现场主管"
    story: "作为现场主管，我希望需求预测、人员排班、登录日志和状态日志有统一对比口径，以便识别缺口、未登录、迟到、早退和非有效产能。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US107
    requirement_ids: [R096]
    task_ids: [F060]
    module: "异常闭环"
    role: "运营负责人"
    story: "作为运营负责人，我希望异常识别和复核结果有统一字段和展示入口，以便把异常归因到排班、人员、主数据、导入、预测或状态源问题。"
    task_type: "frontend"
    priority: "P1"
    status: "planned"
  - id: US108
    requirement_ids: [R092, R093, R094, R095, R096]
    task_ids: [Q015]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对生产雏形第一批本地合同和展示入口做验收收口，确认 no-database 边界、PRD 追溯和验收口径一致。"
    task_type: "qa"
    priority: "P1"
    status: "planned"
acceptance:
  - "第一批 ready stories 必须有匹配 active task。"
  - "第一批只允许本地合同、seed/process-memory 或前端展示层；不接数据库、不接真实外部数据。"
  - "生产权限、审批、导出、批量、自动排班、生产公式、结算规则和收费因子继续作为后续能力。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
```

### US109-US112 - 生产雏形合同前端演示入口

```yaml
stories:
  - id: US109
    requirement_ids: [R097]
    task_ids: [F061]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望前端有生产雏形合同客户端和模型测试，能汇总三类合同覆盖范围，以便确认后续页面展示不是硬编码猜测。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US110
    requirement_ids: [R098]
    task_ids: [F062]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有一个生产雏形合同页，集中查看主数据、人员排班、预测/登录/状态对比合同和暂不实现边界。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US111
    requirement_ids: [R099]
    task_ids: [F063]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入生产雏形合同页，以便本地验收时不用记住 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US112
    requirement_ids: [R100]
    task_ids: [Q016]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对生产雏形合同演示入口做验收收口，确认页面可构建、导航可达、边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "页面展示来自本地合同客户端和 fallback，不接真实外部数据。"
  - "页面明确 no-database、无真实导入、无权限审批导出批量、无生产公式。"
  - "侧边栏有生产雏形入口并能高亮。"
  - "`node --experimental-strip-types --test scripts/tests/production-mvp-contracts.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US113-US116 - 异常复核只读入口

```yaml
stories:
  - id: US113
    requirement_ids: [R101]
    task_ids: [F064]
    module: "异常闭环"
    role: "运营负责人"
    story: "作为运营负责人，我希望前端有异常复核本地模型和测试，能统计异常数量、待复核数量、严重度、归因和负责人，以便页面不是硬编码堆文案。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US114
    requirement_ids: [R102]
    task_ids: [F065]
    module: "异常闭环"
    role: "现场主管"
    story: "作为现场主管，我希望有一个异常复核只读页，集中查看异常清单、来源、归因、复核建议和暂不处理边界。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US115
    requirement_ids: [R103]
    task_ids: [F066]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏异常复核入口进入新的只读页，以便本地验收时不用从 dashboard 间接查找。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US116
    requirement_ids: [R104]
    task_ids: [Q017]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对异常复核只读入口做验收收口，确认页面可构建、导航可达、边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "页面展示来自本地异常复核模型和 fallback，不接真实外部数据。"
  - "页面明确不做复核提交、审批、权限、导出、批量、真实异常计算或生产公式。"
  - "侧边栏异常复核入口能进入新页面并高亮。"
  - "`node --experimental-strip-types --test scripts/tests/anomaly-review.test.mjs` 和 `bash scripts/check.sh` 通过。"
```
