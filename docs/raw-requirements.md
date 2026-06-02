# Raw Requirements

本文件记录 PM 输入的原始需求。原始需求不等同于开发任务，必须先经过用户故事拆分、依赖检查和 Gate Plan。

## Schema

```yaml
- id: R001
  module: "模块名称"
  description: "PM 原始需求描述"
  source: "PM / 访谈 / 文档 / 会议"
  submitted_at: "YYYY-MM-DD"
  version: "1.0"
  status: "draft"
  notes: "补充说明"
```

### R762 - 复核案例关闭写入入口

```yaml
id: R762
module: "导入中心"
description: "复核案例详情页已经能展示证据、结论和关闭状态链路，但主管仍不能对证据和结论齐全的 open 案例形成真实关闭记录。现有 closure API 对已存在案例会直接返回 existing detail，无法关闭当前 open 案例。需要修正为可对现有 open 案例写入 closure，并在详情页提供受控关闭入口。"
source: "After IM061 evidence/conclusion chain and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成 existing open case 的受控 closure 写入和复核案例详情页关闭入口；页面只在证据和结论齐全且未关闭时展示提交按钮，已关闭、读取失败或材料缺失时只展示阻塞原因；不新增 schema/migration，不新增依赖，不接真实外部接口，不做证据补录、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R763 - 复核案例证据补录写入入口

```yaml
id: R763
module: "导入中心"
description: "复核案例详情页已经能关闭证据和结论齐全的 open 案例，但材料不足时仍不能补充证据。需要先提供受控证据补录写入入口，让主管能对未关闭案例新增 evidence，再进入后续关闭。"
source: "After IM062 controlled closure entry and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成本地 evidence 写入 API 和详情页受控提交入口；open case 可补充一条证据，closed case 或 case_id 不匹配会阻塞；不新增 schema/migration，不新增依赖，不接真实外部接口，不做结论新增、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R764 - 复核案例结论补充写入入口

```yaml
id: R764
module: "导入中心"
description: "复核案例详情页已经能补充证据，但证据齐全后仍不能补充复核结论，导致关闭前处理链路不完整。需要提供受控结论补充写入入口，让主管能对未关闭案例新增 conclusion，再进入后续关闭。"
source: "After IM063 controlled evidence entry and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "split"
status: "done"
notes: "本轮已完成本地 conclusion 写入 API 和详情页受控提交入口；open case 可补充一条结论，closed case、case_id 不匹配或重复 conclusion_id 会阻塞；不新增 schema/migration，不新增依赖，不接真实外部接口，不做审批、导出、批量、权限、生产公式、结算或收费因子。"
```

## Requirements

### R697-R700 - Q127 数据库基础 QA 收口

```yaml
requirements:
  - id: R697
    description: "数据库基础需要一次 QA 收口，确认 DB002-DB008 的 Alembic head 能创建所有基础表。"
  - id: R698
    description: "数据库基础需要一次最小端到端持久化验证，覆盖 import、master data、schedule、forecast、actual、comparison 和 review closure 链路。"
  - id: R699
    description: "QA 收口需要生成可追溯结论，明确已完成、未完成和仍禁止混入的范围。"
  - id: R700
    description: "Q127 不应修改产品行为、数据库 schema、repository 实现、权限、审批、导出、批量、生产公式、结算或收费因子。"
source: "DB008 review closure foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "只做 QA 验证、测试和追溯；不改生产实现、不接真实外部接口、不新增依赖。"
```

### R693-R696 - DB008 复核闭环记录持久化基础

```yaml
requirements:
  - id: R693
    description: "系统需要持久化主管复核 case，并引用 DB007 的 forecast-vs-schedule 或 schedule-vs-actual 对比结果。"
  - id: R694
    description: "系统需要持久化复核证据记录，包括证据类型、证据位置、提交人、提交时间和备注。"
  - id: R695
    description: "系统需要持久化复核结论和关闭记录，保留结论类型、风险等级、处理人、关闭状态和关闭备注。"
  - id: R696
    description: "DB008 不应扩展到审批流、权限、批量关闭、导出、真实外部证据服务、生产状态码、结算或收费因子。"
source: "DB007 comparison result foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "只做复核闭环记录持久化基础；不接真实外部接口、不新增依赖、不改前端、不做审批权限。"
```

### R689-R692 - DB007 对比结果持久化基础

```yaml
requirements:
  - id: R689
    description: "系统需要持久化 forecast-vs-schedule 对比结果，保留 forecast version、schedule version 和来源 interval/detail 引用。"
  - id: R690
    description: "系统需要持久化 schedule-vs-actual 对比结果，保留 schedule version、actual import version 和来源 schedule/status 引用。"
  - id: R691
    description: "对比结果持久化需要支持结果状态、差异数值和可复跑 run 标识，方便后续异常引擎读取。"
  - id: R692
    description: "DB007 不应扩展到真实计算调度、异常复核写入、审批、权限、导出、批量、生产公式、结算或收费因子。"
source: "DB006 actual log foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "只做对比结果持久化基础；不接真实外部接口、不新增依赖、不改前端、不做异常闭环动作。"
```

### R685-R688 - DB006 登录/状态日志持久化基础

```yaml
requirements:
  - id: R685
    module: "生产持久化"
    description: "登录日志需要落库登录、登出事件，并关联 DB002 导入版本和 DB003 主数据员工。"
  - id: R686
    module: "生产持久化"
    description: "状态日志需要落库状态区间，支持跨天切分、业务日和时区校验。"
  - id: R687
    module: "生产持久化"
    description: "状态日志需要状态字典映射，将外部状态码映射为内部状态分类。"
  - id: R688
    module: "生产持久化"
    description: "DB006 不应扩展到排班对比、预测对比、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB005 demand forecast foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权登录/状态日志持久化基础：login events, logout events, status intervals, business-day normalization, timezone checks, and status dictionary mapping."
```

### R681-R684 - DB005 需求预测持久化基础

```yaml
requirements:
  - id: R681
    module: "生产持久化"
    description: "需求预测需要落库预测版本，并关联 DB002 导入版本。"
  - id: R682
    module: "生产持久化"
    description: "需求预测需要按日期、0.5h 时段、职场、项目、技能和等级保存预测人数。"
  - id: R683
    module: "生产持久化"
    description: "需求预测需要校验主数据职场、项目和技能引用，并记录版本变更来源。"
  - id: R684
    module: "生产持久化"
    description: "DB005 不应扩展到登录状态、对比计算、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB004 personnel schedule foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权需求预测持久化基础：forecast versions, forecast interval rows, workplace/project/skill/level demand alignment, import source references, and version change tracking."
```

### R677-R680 - DB004 人员级排班持久化基础

```yaml
requirements:
  - id: R677
    module: "生产持久化"
    description: "人员级排班需要先落库排班版本和人员排班明细，并关联 DB002 导入版本。"
  - id: R678
    module: "生产持久化"
    description: "人员排班明细需要引用主数据员工、项目、职场和技能，并校验引用存在、未冻结且有效。"
  - id: R679
    module: "生产持久化"
    description: "人员排班需要引用班次类型，并把排班明细展开为 0.5h 区间记录。"
  - id: R680
    module: "生产持久化"
    description: "DB004 不应扩展到需求预测、登录状态、对比计算、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB003 master data foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权人员级排班持久化基础：schedule versions, personnel schedule details, shift types, half-hour expansion, and import/master-data reference checks."
```

### R673-R676 - DB003 主数据持久化基础

```yaml
requirements:
  - id: R673
    module: "生产持久化"
    description: "主数据需要先落库坐席、职场、供应商、项目和技能，作为后续人员排班、预测对齐和日志对比的引用基础。"
  - id: R674
    module: "生产持久化"
    description: "主数据绑定关系需要记录坐席与供应商、职场、项目、技能之间的有效关系，并支持有效期校验。"
  - id: R675
    module: "生产持久化"
    description: "主数据需要支持冻结状态，冻结或不存在的引用不能被绑定关系误用。"
  - id: R676
    module: "生产持久化"
    description: "DB003 不应扩展到人员排班、预测、登录状态、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB002 database foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权主数据持久化基础：employees, suppliers, workplaces, projects, skills, bindings, effective dates, freeze status, and reference checks."
```

### R669-R672 - DB002 导入持久化基础前置确认

```yaml
requirements:
  - id: R669
    module: "生产持久化"
    description: "DB002 开始前必须确认数据库引擎和本地运行方式，避免在未知环境下创建连接和 migration。"
  - id: R670
    module: "生产持久化"
    description: "DB002 开始前必须确认是否允许修改 package/lockfile 以引入数据库、ORM 或 migration 依赖。"
  - id: R671
    module: "生产持久化"
    description: "DB002 开始前必须确认 migration 工具和测试数据库方案，确保导入批次持久化可验证。"
  - id: R672
    module: "生产持久化"
    description: "DB002 的首批实现范围限定为导入批次、导入行结果、失败行明细和导入生成版本记录。"
source: "DB001 database Gate follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "PM 已确认 PostgreSQL、SQLAlchemy、Alembic、依赖变更和本地隔离测试库口径；DB002 已按该范围实现导入批次、行结果、失败行明细和导入生成版本记录持久化。"
```

### R665-R668 - 数据库 Gate 规划与首批落库拆解

```yaml
requirements:
  - id: R665
    module: "生产持久化"
    description: "PM 已确认进入数据库 Gate，需要先明确数据库落库边界、禁止混入的生产能力和首批可执行范围。"
  - id: R666
    module: "生产持久化"
    description: "数据库 Gate 需要先按业务依赖顺序拆分：导入批次、失败行、版本记录、主数据、人员排班、预测、登录状态、异常、复核记录。"
  - id: R667
    module: "生产持久化"
    description: "首批落库建议从导入批次、成功/失败行和版本记录开始，因为后续主数据、排班、预测、登录状态和异常都依赖导入来源。"
  - id: R668
    module: "质量与交付"
    description: "数据库 Gate 规划需要有明确验收方式：本轮只交付文档、Harness 任务和实施计划，不创建数据库连接、ORM、migration、schema 或生产配置。"
source: "PM confirmed database Gate after local supervisor handling-record chain on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只做数据库 Gate 规划和执行拆解，不实施数据库持久化；下一步 DB002 开始前必须再次确认具体数据库环境、依赖和 migration 策略。"
```

### R001 - BPO WFM Dashboard 静态首页

```yaml
id: R001
module: "运营工作台"
description: "基于 shadcn 官方 dashboard-01 结构，实现 BPO Workforce Management 静态首页，用于展示排班履约、异常工时、趋势、热力图和数据同步状态。"
source: "PM confirmed F001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "仅限静态前端 prototype；不接入后端、真实 Excel、真实 CORN API、权限系统、登录认证、数据库、导出、审批或智能排班算法。"
```

### R002 - shadcn 风格与主题约束

```yaml
id: R002
module: "前端体验"
description: "Dashboard 需遵循 shadcn/ui v4 dashboard examples、dashboard-01 block、New York style 和 dark/light theme system。"
source: "PM confirmed frontend direction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "F001 允许按官方 shadcn chart structure 使用 Recharts；正式图表层未来需单独 Gate。"
```

### R003 - 正式 MVP 第一条前后端纵切

```yaml
id: R003
module: "MVP 范围"
description: "正式系统搭建采用前后端一条纵切方式启动，第一条纵切确定为排班计划列表、排班计划详情、FastAPI 只读接口和本地种子数据。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只定义 MVP 第一条纵切范围，不直接授权后端工程创建、依赖安装、数据库接入或真实数据接入；这些需要后续 B001/F005 Gate。"
```

### R004 - 预测需求作为排班计划输入

```yaml
id: R004
module: "博西预测需求"
description: "排班计划纵切需要展示预测需求作为计划输入，包括日期、职场、业务线、0.5h 时段和预测所需人数。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "MVP 阶段使用本地种子数据表达预测需求，不接真实 Excel、真实预测系统或上传导入。"
```

### R005 - BPO 排班计划列表

```yaml
id: R005
module: "计划与排班"
description: "运营排班人员需要查看排班计划列表，按日期、项目、职场、版本、状态、覆盖人数和缺口风险识别需要处理的计划。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "MVP 第一条纵切只做只读列表；新增、编辑、发布、审批和批量操作不在第一条纵切内。"
```

### R006 - BPO 排班计划详情

```yaml
id: R006
module: "计划与排班"
description: "运营排班人员需要打开单个排班计划详情，查看 0.5h 时段级预测需求、已排人数、缺口、覆盖率和备注。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "详情页仅展示只读计划明细和基础汇总，不做拖拽排班、人员级编辑或智能排班算法。"
```

### R007 - FastAPI 后端只读接口

```yaml
id: R007
module: "后端服务"
description: "第一条纵切需要 Python + FastAPI 提供排班计划列表和详情只读接口，供前端从本地种子数据读取。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "B001 才能创建 backend 工程、依赖和接口；M001 只定义接口边界。数据库、认证和真实集成不在第一条纵切内。"
```

### R008 - 前后端接口契约

```yaml
id: R008
module: "接口契约"
description: "第一条纵切需要明确前端与 FastAPI 后端之间的字段契约，包括计划摘要、计划详情、时段明细和错误响应。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "接口字段使用 English keys；业务展示值可使用中文。错误响应先采用最小只读查询错误，不定义生产级权限或审计错误码。"
```

### R009 - MVP 阶段状态与公式边界

```yaml
id: R009
module: "业务口径"
description: "第一条纵切需要明确哪些状态、指标和公式只是 MVP 展示口径，哪些必须在后续 Gate 中由 PM 再确认。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "计划状态建议先限于 draft、review_ready、published 三个展示状态；排班覆盖率建议为 scheduled_agents / forecast_agents。该建议用于 M001 设计，不代表生产最终口径。"
```

### R010 - 第一条纵切验证与交付

```yaml
id: R010
module: "质量与交付"
description: "第一条纵切需要具备可验证交付标准，包括前端构建、后端测试、接口契约检查、Harness check 和 Done Report。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "Q001 后续定义具体验证命令；M001 只定义验收方向，不引入测试依赖。"
```

### R011 - 本地排班计划草稿创建与更新

```yaml
id: R011
module: "计划与排班"
description: "运营排班人员需要在本地 MVP 中创建排班计划草稿，并在草稿状态下更新 0.5h 时段的预测人数、已排人数和备注，以便系统从只读查看推进到受控编辑闭环。"
source: "PM continuous delivery instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只允许本地内存数据和 draft 草稿更新；不接数据库、认证、真实 Excel、真实 CORN、发布、审批、导出、批量操作或生产公式。"
```

### R012 - 前端排班计划草稿创建入口

```yaml
id: R012
module: "计划与排班"
description: "运营排班人员需要在排班计划列表中进入新建草稿页面，填写计划信息和核心 0.5h 时段后创建 draft 排班计划。"
source: "PM continuous delivery instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "F006 只做最小创建入口，通过 Next server action 调用 B002；不做完整编辑器、发布、审批、导出、批量、数据库或权限。"
```

### R013 - 前端排班计划草稿更新入口

```yaml
id: R013
module: "计划与排班"
description: "运营排班人员需要从 draft 排班计划详情进入编辑页面，更新计划信息和 0.5h 时段后保存草稿。"
source: "PM continuous delivery instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "F007 只允许编辑 draft 状态计划，通过 Next server action 调用 B002 PUT；不做发布、审批、导出、批量、权限、数据库或人员级排班。"
```

### R014 - Story Runner 连续用户故事交付流程

```yaml
id: R014
module: "Harness 流程"
description: "PM 期望 Codex 按 goal 拆出最小用户故事后，能够自动按依赖顺序开发、测试、提交，并在写入范围不冲突时启动 subagent 并行处理，而不是频繁把小 UI 反馈切成独立任务。"
source: "PM harness optimization feedback"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "该需求优化执行流程，不授权新增依赖、真实数据、数据库、认证、权限、审批、导出、批量或生产公式。"
```

### R015 - 排班计划列表筛选

```yaml
id: R015
module: "计划与排班"
description: "运营排班人员需要在排班计划列表中按关键词和计划状态筛选，以便快速定位草稿、待复核或已发布计划。"
source: "PM continuous development instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只做本地 FastAPI 列表查询和前端 URL 筛选；不做权限、审批、发布、批量、数据库、真实 Excel、真实 CORN 或生产状态口径变更。"
```

### R016 - 班次明细查看

```yaml
id: R016
module: "计划与排班"
description: "运营排班人员需要从计划与排班中查看 0.5h 班次明细，包含计划、日期、时段、预测人数、已排人数、缺口、覆盖率和备注。"
source: "PM continuous development instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只做本地只读明细查看和筛选；不做人员级排班、拖拽排班、审批、发布、批量、数据库、真实 Excel 或真实 CORN。"
```

### R017 - 需求计划查看

```yaml
id: R017
module: "计划与排班"
description: "运营排班人员需要查看预测需求计划，按日期、项目、职场和 0.5h 时段了解预测人数，作为排班计划输入。"
source: "PM continuous development instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只做本地只读预测需求查看和搜索；不做真实 Excel 导入、字段映射、数据库、审批、发布、批量或生产预测算法。"
```

### R018 - 不可用管理查看

```yaml
id: R018
module: "计划与排班"
description: "运营排班人员需要查看人员不可用时段，按人员、团队、项目、职场、原因和状态定位不可用对排班覆盖的影响。"
source: "PM continuous development instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做本地只读不可用记录查看和筛选；不做人事系统接入、真实请假审批、数据库、权限、批量导入、排班自动冲突计算或生产状态口径。"
```

### R019 - 排班风险提示

```yaml
id: R019
module: "计划与排班"
description: "运营排班人员需要在排班计划中看到由时段缺口和生效中不可用记录共同形成的风险提示，以便优先复核高风险班次。"
source: "PM accepted recommended next stage"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做本地 MVP 风险提示和跳转查看；风险等级为展示口径，不代表生产风控公式。不做自动排班、真实审批、数据库、权限、批量调班或生产状态口径。"
```

### R020 - shadcn dashboard-01 前端视觉对齐

```yaml
id: R020
module: "前端设计"
description: "PM 要求将 `shadcn-dashboard-01-replica-spec.md` 插入项目需求，后续前端改造必须以 shadcn dashboard-01 measured values 为基准，优先对齐设计 token、组件结构、响应式行为、浅色/深色主题和浏览器验收场景。"
source: "/Users/mac/Documents/Codex/2026-05-10/computeruse-https-ui-shadcn-com/docs/design/shadcn-dashboard-01-replica-spec.md"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求本轮只插入需求和执行队列，不直接实施 UI。正式实施前必须先做差距审计；如追求 1:1 复刻，可能触发 Geist 字体、Tabler icons、shadcn 组件补齐、浏览器截图验证和 package/lockfile 变更，需要单独 Gate。"
```

### R021 - shadcn 依赖与组件接入收口

```yaml
id: R021
module: "前端设计"
description: "PM 已允许将已安装的 Tabler icons、TanStack Table、DnD、Drawer、Select、Tabs、Dropdown、ToggleGroup、Chart 等 shadcn dashboard-01 parity 依赖和生成组件纳入项目，并先完成接入收口与验证。"
source: "PM confirmation after F014"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只收口已确认的 package/lockfile、shadcn UI 组件和 lint/compatibility 修复；不开发新业务功能，不接入真实数据、数据库、认证、权限、审批、导出、批量操作，不固化生产公式、状态码、结算口径或收费因子。"
```

### R022 - Harness Gate 体系审计反馈修复

```yaml
id: R022
module: "Harness"
description: "审计反馈指出 Gate Registry 与 backlog required_workflow 脱节、AGENTS 阶段名滞后、audit-report 当前/历史口径混写、Story Runner 缺少 ready 队列入口，需要进行文档型修复。"
source: "PM audit feedback"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只修复 Harness 文档、Gate 映射、审计口径和下一步队列可观测性；不开发业务代码，不改 package/lockfile，不接入真实数据、数据库、认证、权限、审批、导出、批量操作或生产公式。"
```

### R023 - 风险明细钻取

```yaml
id: R023
module: "计划与排班"
description: "运营排班人员需要从排班风险提示进入风险明细，查看同一风险项关联的计划、时段缺口、不可用记录和建议动作，以便继续人工复核。"
source: "F015 Done Report recommended next stage"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求作为下一轮 Story Runner ready 入口预置；实现时应优先复用本地 `schedule-risks`、`schedule-plans`、`shift-details`、`unavailability` 数据，不做真实人事/CORN 集成、数据库、审批、批量调班、生产风险公式或状态码定稿。"
```

### R024 - 不可用影响定位

```yaml
id: R024
module: "计划与排班"
description: "运营排班人员需要从不可用记录定位其影响的班次和关联风险，以便判断是否需要人工复核排班覆盖。"
source: "PM requested development mainline after push"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做本地只读影响定位和跳转；不做人事/CORN 真实集成、数据库、权限、审批、导出、批量调班、自动排班、生产状态码、生产公式、结算规则或收费因子。"
```

### R025 - table parity 局部迁移

```yaml
id: R025
module: "前端设计"
description: "在已接入 TanStack Table 和 shadcn 组件的前提下，先选择一个低风险表格做局部迁移，提升官方 dashboard table parity，但不启用批量、拖拽、审批、导出或生产动作。"
source: "PM requested development mainline after push"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做展示层局部迁移；不新增依赖，不修改 package/lockfile，不改变业务字段、生产状态码、公式、结算规则或收费因子。"
```

### R026 - 开发服务器原生运行时硬化

```yaml
id: R026
module: "Harness"
description: "项目级修复开发服务器在本机原生包签名或缺失场景下返回 500 的问题，要求将前端开发入口收口到受控 Node.js 22 运行时、统一 dev/build 编译链，并在启动前显式预检 Next.js 与 lightningcss 原生包加载。"
source: "PM requested project-level repair on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只修复本地开发运行时、入口脚本、验证和文档说明；不新增依赖，不修改 lockfile，不改业务代码、后端契约、真实数据、数据库、认证、权限、审批、导出、批量能力或生产口径。"
```

### R027 - Python 3.12 开发运行时固化

```yaml
id: R027
module: "Harness"
description: "项目开发期固定使用 Python 3.12，并将 backend dev/check 入口从“任意可导入依赖的 Python”收口到受支持版本，避免换机器或 PATH 顺序变化导致后端运行时漂移。"
source: "PM requested runtime pinning on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只固化 Python 开发版本、验证脚本和文档说明；不新增依赖，不修改业务代码、后端契约、数据库、认证、权限、审批、导出、批量能力或生产口径。"
```

### R028 - 标准化分支与验证工作流

```yaml
id: R028
module: "Harness"
description: "PM 要求将取任务、分支/worktree、开发、验证、提交、集成、push 确认、异常处理和审计证据补齐为标准化工作流，同时避免 AGENTS.md 继续膨胀。"
source: "PM workflow governance confirmation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做 Harness 文档和审计模板治理；不修改业务代码，不新增依赖，不修改 package/lockfile，不接入真实数据、数据库、认证、权限、审批、导出、批量操作或生产公式。"
```

### R029 - No Database MVP Mode

```yaml
id: R029
module: "MVP 范围"
description: "PM 明确要求在功能开发完毕前先不要接数据库，因为当前没有数据库环境；MVP 阶段必须继续使用本地接口、种子数据、进程内存和前端 fallback 完成业务链路验证。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求固化 no-database 边界：不创建数据库连接、ORM、migration、schema、持久化配置或真实数据接入；后续任何数据库相关工作必须另开 Gate 并等待 PM 明确确认。"
```

### R030 - 本地 MVP 功能闭环入口

```yaml
id: R030
module: "计划与排班"
description: "PM 要求先回到业务开发主线，在不接数据库的前提下完成本地 MVP 功能闭环，让风险明细、不可用影响、班次明细和需求计划形成可导航链路。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只允许前端展示层和导航闭环，不新增后端接口、不新增依赖、不接数据库、不做真实数据、审批、导出、批量调班或生产公式。"
```

### R031 - 排班计划主表 table parity 局部迁移

```yaml
id: R031
module: "前端设计"
description: "在风险提示表已完成 TanStack Table 局部迁移后，继续选择排班计划主表做局部 table parity 展示迁移。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只迁移展示层排序和列渲染，不启用批量选择、拖拽、导出、审批、批量调班、生产状态码或结算口径。"
```

### R032 - 本地 MVP 验收审计

```yaml
id: R032
module: "质量与交付"
description: "完成 no-database 边界、本地 MVP 功能闭环和 table parity 局部迁移后，做一轮 MVP 验收审计，明确当前通过项、剩余项和暂不建议项。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做验收审计和验证记录；不新增业务能力、不接数据库、不修改依赖或 package/lockfile。"
```

### R033 - 排班计划详情复核链路补强

```yaml
id: R033
module: "计划与排班"
description: "在不接数据库的前提下，排班计划详情页需要直接给出班次、风险和不可用的复核入口，并展示本地关联计数，减少人工来回跳转。"
source: "PM continue mainline after no-database integration"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只复用现有本地 schedule-plans、schedule-risks、shift-details、unavailability 契约；不新增后端接口、真实数据、数据库、审批、导出、批量调班或生产公式。"
```

### R034 - 班次明细 table parity 第二条迁移

```yaml
id: R034
module: "前端设计"
description: "在风险提示表和排班计划主表之后，继续把班次明细页迁移到 TanStack Table，实现第二条展示层 table parity。"
source: "PM continue mainline after no-database integration"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只迁移展示层列和排序，不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R035 - 不可用记录 table parity 第三条迁移

```yaml
id: R035
module: "前端设计"
description: "在班次明细页完成 TanStack Table 迁移后，继续把不可用记录页迁移到同一展示层 table parity 模式。"
source: "Mainline follow-up after F021/F022"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只迁移展示层列和排序，不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R036 - F021-F023 本地链路 QA 验收收口

```yaml
id: R036
module: "质量与交付"
description: "在 F021、F022、F023 完成后，执行一条 qa 验收故事，对计划详情复核链路、班次明细 table parity、不可用记录 table parity 进行集中收口验证。"
source: "PM instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R037 - 需求计划 table parity 第四条迁移

```yaml
id: R037
module: "前端设计"
description: "在不可用记录 table parity 完成后，把需求计划页迁移到同一 TanStack Table 展示层 parity 模式，作为下一条前端一致性目标。"
source: "PM instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R038 - F024 单故事 QA 验收收口

```yaml
id: R038
module: "质量与交付"
description: "在 F024 完成后执行一条 qa 验收故事，确认需求计划 table parity 的展示与追溯收口。"
source: "PM instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R039 - 排班计划详情时段表 table parity 第五条迁移

```yaml
id: R039
module: "前端设计"
description: "在需求计划页完成 parity 后，把排班计划详情中的 0.5h 时段明细表迁移到独立 TanStack Table 组件。"
source: "Story Runner accelerated decomposition"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R040 - F025 单故事 QA 验收收口

```yaml
id: R040
module: "质量与交付"
description: "在 F025 完成后执行一条 qa 验收故事，确认排班计划详情时段表 parity 的展示与追溯收口。"
source: "Story Runner accelerated decomposition"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R041 - 风险明细受影响班次表 table parity 第六条迁移

```yaml
id: R041
module: "前端设计"
description: "在排班计划详情时段表完成 parity 后，继续把风险明细页中的受影响班次表迁移到独立 TanStack Table 组件。"
source: "Story Runner accelerated decomposition"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R042 - F026 单故事 QA 验收收口

```yaml
id: R042
module: "质量与交付"
description: "在 F026 完成后执行一条 qa 验收故事，确认风险明细受影响班次表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R043 - 风险明细不可用影响表 table parity 第七条迁移

```yaml
id: R043
module: "前端设计"
description: "在风险明细受影响班次表完成 parity 后，继续把风险明细页中的不可用影响表迁移到独立 TanStack Table 组件。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R044 - F027 单故事 QA 验收收口

```yaml
id: R044
module: "质量与交付"
description: "在 F027 完成后执行一条 qa 验收故事，确认风险明细不可用影响表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R045 - 不可用影响详情受影响班次表 table parity 第八条迁移

```yaml
id: R045
module: "前端设计"
description: "在风险明细两张详情表完成 parity 后，继续把不可用影响详情页中的受影响班次表迁移到独立 TanStack Table 组件。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R046 - F028 单故事 QA 验收收口

```yaml
id: R046
module: "质量与交付"
description: "在 F028 完成后执行一条 qa 验收故事，确认不可用影响详情受影响班次表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R047 - 不可用影响详情关联风险表 table parity 第九条迁移

```yaml
id: R047
module: "前端设计"
description: "在不可用影响详情受影响班次表完成 parity 后，继续把不可用影响详情页中的关联风险表迁移到独立 TanStack Table 组件。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R048 - F029 单故事 QA 验收收口

```yaml
id: R048
module: "质量与交付"
description: "在 F029 完成后执行一条 qa 验收故事，确认不可用影响详情关联风险表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R049 - 详情页 table parity 连续开发块 QA 总收口

```yaml
id: R049
module: "质量与交付"
description: "在 F026-F029 完成后，对风险明细和不可用影响详情两页的四张明细表做一次连续开发块 QA 总收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R050 - Harness current/archive 双层状态治理试点

```yaml
id: R050
module: "Harness"
description: "为降低开发期上下文负担并提升状态一致性，项目需要从现有大文件驱动方式升级为 v2 双层状态治理：先建立 current 层做小范围试点，再加入 registry 与 state check，最后按阶段归档历史。"
source: "PM supplied compensation-fix proposal v2 on 2026-05-12"
submitted_at: "2026-05-12"
version: "2.0"
status: "split"
notes: "该需求暂不直接全量迁移 backlog、stories、audit；先以一个真实 ready story 试点 current 层。设计约束包括：1) 只迁移最小闭环，不全量拆历史；2) `STORY_QUEUE.yaml`、`ACTIVE_TASKS.yaml`、`TRACE_INDEX.yaml`、`PROJECT_CONTEXT.md` 之间必须满足状态一致性不变量；3) 增加 `scripts/check-state.sh` 作为自动状态检查；4) 每次归档必须按事务顺序执行并支持 blocked/回滚；5) 历史查询必须受预算限制，禁止全量打开 archive；6) 第一阶段保留旧大文件作为可回退过渡层；7) 试点验收必须证明 Agent 可只靠 current 层完成一次真实任务并通过 `check-state` 与 `bash scripts/check.sh`；8) 推荐拆为三阶段：A 只建 `docs/current/*`，B 加 `docs/registry/*` 与 state check，C 再按月或按块归档 done 历史。"
```

### R051 - Harness 状态治理 v3 第一轮落地

```yaml
id: R051
module: "Harness"
description: "按 PM 确认的 v3 方案落地第一轮状态治理：冻结 current/registry/archive 原则，新增 current 层、registry 层、warning-only state check、State Repair Mode、History-On-Demand Rule，并把默认读取集从大文件切到 current 层。"
source: "PM supplied state-governance proposal v3 on 2026-05-12"
submitted_at: "2026-05-12"
version: "3.0"
status: "split"
notes: "第一轮只做治理文件、current/registry 入口和状态检查，不迁移大量 done 历史、不改业务代码、不改依赖、不接数据库。旧大文件暂保留为历史来源和过渡期追溯。"
```

### R052 - check-state 标准验证链路接入

```yaml
id: R052
module: "Harness"
description: "在状态治理 v3 第一轮后，把 check-state 接入标准 `bash scripts/check.sh` 的 warning-only 路径，并补充无依赖回归测试，证明状态漂移能被发现且不会导致普通任务自锁。"
source: "PM requested continued governance on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只改 Harness 脚本、测试和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R053 - current queue 真实任务冒烟

```yaml
id: R053
module: "Harness"
description: "用 docs/current/STORY_QUEUE.yaml 和 docs/current/ACTIVE_TASKS.yaml 执行一条真实治理小任务，验证 current queue 能作为默认启动入口，并在任务完成后不保留 done 历史。"
source: "State governance continuation on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做 current queue 冒烟和治理记录；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R054 - current done history 不变量检查

```yaml
id: R054
module: "Harness"
description: "补强 check-state，明确 current story/task 文件不能保留 done 历史，并用回归测试覆盖 warning-only 与 strict 行为。"
source: "State governance continuation on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只改状态检查、回归测试和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R055 - check-state strict 默认阻断

```yaml
id: R055
module: "Harness"
description: "在 current queue 冒烟和 done-history 不变量跑稳后，将标准 `bash scripts/check.sh` 的 state check 从 warning-only 升级为 strict 默认阻断，并保留 state-repair 和 warning-only 显式旁路。"
source: "State governance continuation on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只改标准检查入口和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R056 - TRACE_INDEX current_files 路径校验

```yaml
id: R056
module: "Harness"
description: "补强 check-state，对 TRACE_INDEX.yaml 的 current_files 路径进行存在性校验，并对重复 registry path 输出去重。"
source: "State governance continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改状态检查、回归测试和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R057 - Codex Plan 面板边界规则

```yaml
id: R057
module: "Harness"
description: "明确 Codex Plan/进度面板只是当前会话投影视图，不是项目状态源；真实状态必须以 Harness current queue、active tasks 和 registry 为准。"
source: "PM supplied Codex Plan boundary rule on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改治理规则和追溯记录；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R058 - Dashboard 异常明细表 TanStack Table parity

```yaml
id: R058
module: "前端设计"
description: "Dashboard 首页的 BPO 异常明细表仍是手写排序和分页，需要迁移到 TanStack Table，以便与当前主链路表格 parity 保持一致。"
source: "Story Runner continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做 dashboard 本地静态异常表展示层迁移；不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量或生产动作。"
```

### R059 - Dashboard 异常明细表本地列显示与分页控制

```yaml
id: R059
module: "前端设计"
description: "Dashboard 异常明细表的列控制目前是占位按钮，需要补成本地列显示开关和分页大小控制，形成可用但不连接生产动作的 table parity 交互。"
source: "Story Runner continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地 UI 状态控制；不新增依赖、不改数据来源、不接数据库、不做导出、批量选择、拖拽或生产动作。"
```

### R060 - F030-F031 dashboard table parity QA 收口

```yaml
id: R060
module: "质量与交付"
description: "F030 和 F031 完成后，对 dashboard 异常明细表 parity 做一轮 QA 验收，确认迁移、交互、边界和追溯均可验证。"
source: "Story Runner continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做验收验证和追溯更新；不新增业务能力、不改依赖、不改后端契约、不接数据库。"
```

### R061-R070 - Dashboard 本地 parity 连续增强

```yaml
requirements:
  - id: R061
    description: "Dashboard 异常明细表需要本地状态与严重度筛选。"
  - id: R062
    description: "Dashboard 异常明细表需要筛选摘要和一键重置。"
  - id: R063
    description: "Dashboard 异常明细表需要分页范围、首页和末页控制。"
  - id: R064
    description: "Dashboard 数据接入状态需要模型测试覆盖本地筛选和状态统计。"
  - id: R065
    description: "Dashboard 数据接入状态需要迁移为 TanStack Table 展示层 parity。"
  - id: R066
    description: "Dashboard 数据接入状态需要本地状态筛选和摘要，不触发真实同步。"
  - id: R067
    description: "Dashboard 热力图需要模型测试覆盖缺口统计、严重时段和峰值缺口。"
  - id: R068
    description: "Dashboard 热力图需要显示本地缺口摘要。"
  - id: R069
    description: "Dashboard 热力图格子需要更明确的可访问标签和键盘聚焦样式。"
  - id: R070
    description: "F032-F040 完成后需要 QA 收口。"
source: "PM requested 10-task continuous development on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "本组只做 dashboard 本地展示层增强；不新增依赖、不改后端契约、不接数据库、不做真实同步、审批、导出、批量或生产公式。"
```

### R071-R090 - 排班/风险/不可用表格本地 parity 连续增强

```yaml
requirements:
  - {id: R071, description: "排班计划表需要本地筛选与统计模型测试。"}
  - {id: R072, description: "排班计划表需要本地摘要条。"}
  - {id: R073, description: "排班计划表需要本地查询、状态和缺口筛选。"}
  - {id: R074, description: "排班计划表需要重置筛选和空结果提示。"}
  - {id: R075, description: "排班计划表需要本地分页范围与翻页控制。"}
  - {id: R076, description: "排班计划表需要本地列显示控制。"}
  - {id: R077, description: "风险提示表需要本地筛选与统计模型测试。"}
  - {id: R078, description: "风险提示表需要本地摘要条。"}
  - {id: R079, description: "风险提示表需要风险等级筛选。"}
  - {id: R080, description: "风险提示表需要本地搜索。"}
  - {id: R081, description: "风险提示表需要本地分页范围与翻页控制。"}
  - {id: R082, description: "风险提示表需要重置筛选和空结果提示。"}
  - {id: R083, description: "不可用表需要本地筛选与统计模型测试。"}
  - {id: R084, description: "不可用表需要本地摘要条。"}
  - {id: R085, description: "不可用表需要状态筛选。"}
  - {id: R086, description: "不可用表需要本地搜索。"}
  - {id: R087, description: "不可用表需要本地分页范围与翻页控制。"}
  - {id: R088, description: "不可用表需要重置筛选和空结果提示。"}
  - {id: R089, description: "不可用表需要本地列显示控制。"}
  - {id: R090, description: "F041-F059 完成后需要 QA 收口。"}
source: "PM requested 20-task continuous development on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "本组只做本地前端表格展示层 parity；不新增依赖、不改后端契约、不接数据库、不做审批、导出、批量、权限或生产公式。"
```

### R701 - 真实导入中心 CSV 上传 API 第一刀

```yaml
id: R701
module: "导入中心"
description: "数据库底座合入 main 后，系统需要第一条真实 CSV 上传解析纵切：API 接收 CSV 内容、应用字段映射、生成导入批次、行级成功/失败结果和 import version，以便后续主数据、排班、预测、登录日志和状态日志可以从真实文件内容进入持久化链路。"
source: "PM requested merge main then continue with subagent development on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做无新增依赖的 text/csv 原始请求体上传和本地持久化 API；不做 multipart/Excel、外部 CORN/HR/WFM 接入、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### R702 - 主数据导入应用到 DB003 repository

```yaml
id: R702
module: "导入中心"
description: "CSV 上传批次已经能生成行级结果和 import version 后，系统需要把 master_data 批次中的成功行应用到 DB003 主数据 repository，生成员工、职场、供应商、项目、技能和绑定关系的可维护基础数据。"
source: "PM confirmed continuing import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 master_data CSV 成功行；不新增 schema/migration，不做 CRUD UI，不做权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。"
```

### R703 - 人员排班导入应用到 DB004 repository

```yaml
id: R703
module: "导入中心"
description: "主数据导入应用完成后，系统需要把 personnel_schedule 批次中的成功行应用到 DB004 人员排班 repository，生成排班版本、班次类型、人员排班明细和 0.5h 展开区间。"
source: "PM continued import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 personnel_schedule CSV 成功行；不新增 schema/migration，不做排班维护 UI、发布/冻结、权限、审批、导出、批量调班、外部集成、自动排班、生产公式、结算或收费因子。"
```

### R704 - 需求预测导入应用到 DB005 repository

```yaml
id: R704
module: "导入中心"
description: "人员排班导入应用完成后，系统需要把 demand_forecast 批次中的成功行应用到 DB005 需求预测 repository，生成 forecast version、0.5h forecast intervals 和版本变更记录。"
source: "PM continued import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 demand_forecast CSV 成功行；不新增 schema/migration，不做预测算法、预测 UI、权限、审批、导出、批量、外部集成、自动排班、生产公式、结算或收费因子。"
```

### R705 - 登录/状态日志导入应用到 DB006 repository

```yaml
id: R705
module: "导入中心"
description: "需求预测导入应用完成后，系统需要把 login_log 与 status_log 批次中的成功行应用到 DB006 实际日志 repository，生成登录/登出事件、状态字典和状态区间，为后续排班 vs 实际对比提供生产雏形输入。"
source: "PM continued import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 login_log/status_log CSV 成功行；不新增 schema/migration，不做 CORN/HR/WFM 外部接入、状态码生产规则、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### R706 - 对比计算触发到 DB007 repository

```yaml
id: R706
module: "对比计算"
description: "导入中心已经能把预测、排班和实际日志应用到各自 repository 后，系统需要一个本地可复跑的对比计算入口，把 forecast vs schedule 和 schedule vs actual 计算结果写入 DB007 comparison repository。"
source: "PM continued production-usefulness flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地计算触发和 DB007 结果写入；不新增 schema/migration，不做外部 CORN/HR/WFM 接入，不做生产状态码/公式定版、权限、审批、导出、批量、自动排班、结算或收费因子。"
```

### R707 - 复核闭环写入到 DB008 repository

```yaml
id: R707
module: "复核闭环"
description: "对比计算已经能生成 DB007 异常结果后，系统需要一个本地复核闭环写入 API，把主管复核 case、证据、结论和关闭记录写入 DB008 repository，形成可追溯处理记录。"
source: "PM approved continuing with IM007 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地 DB008 写入纵切；不新增 schema/migration，不做审批流、权限、批量关闭、导出、外部证据服务、生产公式、结算或收费因子。"
```

### R708 - 持久化结果查询 API 收口

```yaml
id: R708
module: "结果查询"
description: "对比计算和复核闭环已经能写入 DB007/DB008 后，系统需要只读 API 按 run_id/case_id 读回已持久化详情，支撑后续页面或接口消费真实闭环结果。"
source: "PM approved continuing with IM008 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地只读查询 API；不新增 schema/migration，不做模板持久化、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R709 - 持久化结果列表筛选 API 第一刀

```yaml
id: R709
module: "结果查询"
description: "单条持久化结果已经能按 id 读回后，系统需要列表和基础筛选能力，让主管可以按业务日、类型、状态、owner 等维度找到 DB007 对比 run 和 DB008 复核 case。"
source: "PM approved continuing with IM009 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地只读列表筛选 API；不新增 schema/migration，不做分页、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R710 - 计算与复核写入幂等重跑保护第一刀

```yaml
id: R710
module: "结果写入"
description: "对比计算和复核闭环已经具备写入、单查和列表后，需要先保护重复请求：相同 run_id 的计算、相同 case_id 的复核写入应直接返回已有结果，避免重复点击造成重复写入或错误噪音。"
source: "PM approved starting IM010 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 comparison calculate 与 review closure write 的天然业务键幂等；不新增 schema/migration，不做导入 apply 重跑、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R711 - 主数据导入应用幂等重跑保护第一刀

```yaml
id: R711
module: "导入中心"
description: "主数据导入应用已经能把 master_data 成功行写入 DB003 后，需要先保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写入逻辑和操作噪音。"
source: "PM approved continuing with IM011 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 master_data apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R712 - 人员排班导入应用幂等重跑保护第一刀

```yaml
id: R712
module: "导入中心"
description: "人员排班导入应用已经能把 personnel_schedule 成功行写入 DB004 后，需要保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写 schedule version、shift type、schedule detail 和 0.5h interval。"
source: "PM approved continuing with IM012 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 personnel_schedule apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R713 - 需求预测导入应用幂等重跑保护第一刀

```yaml
id: R713
module: "导入中心"
description: "需求预测导入应用已经能把 demand_forecast 成功行写入 DB005 后，需要保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写 forecast version、forecast interval 和 forecast change。"
source: "PM approved continuing with IM013 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 demand_forecast apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R714 - 实际日志导入应用幂等重跑保护第一刀

```yaml
id: R714
module: "导入中心"
description: "实际日志导入应用已经能把 login_log 和 status_log 成功行写入 DB006 后，需要保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写 login event、status dictionary 和 status interval。"
source: "PM approved continuing with IM014 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 login_log/status_log apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产状态码规则、结算或收费因子。"
```

### R715 - 导入批次应用结果查询摘要第一刀

```yaml
id: R715
module: "导入中心"
description: "导入应用链路已经能写入并具备幂等后，系统需要一个只读查询入口，按 batch_id 返回当前批次是否已应用、对应应用目标、导入版本和可判断的落库记录数，支撑后续页面展示真实应用状态。"
source: "PM approved continuing after IM014 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做只读应用摘要 API；不新增 schema/migration，不做模板持久化、字段映射 CRUD、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R716 - 字段映射模板持久化第一刀

```yaml
id: R716
module: "导入中心"
description: "导入中心已经支持一次性 field_mapping JSON 上传，但真实导入流程需要保存并复用字段映射模板，避免每次上传都手工传完整映射。"
source: "PM approved IM016 field-mapping template persistence on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做字段映射模板持久化、只读列表/单查和 upload-csv 按 template_id 复用；不做前端、Excel/multipart、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R717 - 导入失败行修正第一刀

```yaml
id: R717
module: "导入中心"
description: "导入中心已经能记录失败行和复用字段映射模板后，需要先支持单行失败数据修正，让数据管理员把错误行修正为可应用的成功行，而不是只能重新上传整批文件。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做 failed row 单行原地修正和批次计数重算；不新增 schema/migration，不做修正历史表、前端、批量修正、自动 apply、Excel/multipart、权限、审批、导出、外部集成、生产公式、结算或收费因子。"
```

### R718 - 导入批次列表与应用状态查询第一刀

```yaml
id: R718
module: "导入中心"
description: "导入中心已经具备上传、模板复用、失败行修正和单批次应用摘要后，需要一个批次列表查询入口，让数据管理员按批次查看上传结果、版本数量和是否已应用，支撑导入中心进入真实可用的日常查看闭环。"
source: "PM approved continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做只读批次列表和状态聚合；不新增 schema/migration，不做前端、分页、导出、批量、权限、审批、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R719 - 字段映射模板更新与停用第一刀

```yaml
id: R719
module: "导入中心"
description: "字段映射模板已经可以创建、列表、单查并被 upload-csv 复用后，需要支持修正模板名称/字段映射以及停用错误模板，避免数据管理员只能新建模板或继续误用旧模板。"
source: "PM approved continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做字段映射模板更新和软停用；不新增 schema/migration，不做前端、物理删除、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R720 - 导入批次应用前就绪校验第一刀

```yaml
id: R720
module: "导入中心"
description: "导入中心已经具备上传、失败行修正、批次状态列表、模板维护和应用摘要后，需要一个应用前只读就绪校验，明确哪些批次可以应用，哪些批次因为失败行、无成功行、缺导入版本或已应用而不应继续执行。"
source: "PM requested push then continue import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做应用前只读就绪判断；不新增 schema/migration，不做自动 apply、前端、深度主数据校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R721 - 导入批次应用前行级字段预检第一刀

```yaml
id: R721
module: "导入中心"
description: "导入中心已经具备批次级 apply-readiness 判断后，需要在应用前进一步暴露成功行的字段级阻塞原因，避免缺少标准字段的成功行进入 apply 时才失败。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做应用前只读行级字段预检；不新增 schema/migration，不做自动 apply、前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R722 - 导入应用前 readiness 安全闸第一刀

```yaml
id: R722
module: "导入中心"
description: "导入中心已经能只读判断批次 apply-readiness 后，需要让导入应用接口在写入业务仓储前复用该判断，阻止失败行、缺版本或字段缺口数据进入业务表。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做 apply 前 readiness 安全闸；保留已应用批次的 already_applied 幂等返回；不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R723 - 人员排班与实际日志应用前 readiness 安全闸第一刀

```yaml
id: R723
module: "导入中心"
description: "master_data 和 demand_forecast apply 已经具备写入前 readiness 安全闸后，需要把同样口径补到 personnel_schedule 和 login/status-log apply，形成四类导入应用的一致安全拦截。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做 personnel_schedule 与 login/status-log apply 前 readiness 安全闸；保留已应用批次的 already_applied 幂等返回；不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R724 - 导入中心前端 API 接入第一刀

```yaml
id: R724
module: "导入中心"
description: "导入中心后端已经具备批次列表、应用摘要、readiness 和 apply 安全闸后，需要先让前端导入中心页面读取真实本地 API，而不是继续停留在缺页或静态展示状态。"
source: "PM requested continuing production usability and visibility on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端只读 API 接入、导航入口和加载/空/错误状态；不新增依赖，不做上传写入、apply 写操作、后端、schema/migration、权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。"
```

### R725 - 导入中心 CSV 上传表单第一刀

```yaml
id: R725
module: "导入中心"
description: "导入中心前端已经能读取真实批次和 readiness 后，需要先接入现有 CSV 上传 API，让数据管理员可以从页面选择本地 CSV 文件并生成导入批次。"
source: "PM requested continuing production usability after IM024 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端 CSV 文件读取、Next server action 请求组合和现有 upload-csv API 调用；不新增依赖，不做 Excel/multipart、apply 写操作、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R726 - 导入中心失败行列表与单行修正 UI 第一刀

```yaml
id: R726
module: "导入中心"
description: "导入中心前端已经能上传 CSV 并读取批次/readiness 后，需要把失败行明细和现有单行修正 API 接到页面上，让数据管理员可以直接看到失败原因并提交一行修正。"
source: "PM requested continuing production usability after IM025 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端失败行列表、修正请求组合和现有 row correction API 调用；不新增依赖，不做批量修正、apply 写按钮、后端、schema/migration、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
```

### R727 - 导入中心字段映射模板选择第一刀

```yaml
id: R727
module: "导入中心"
description: "导入中心前端已经能上传 CSV 和修正失败行后，需要在上传时复用现有字段映射模板，让数据管理员不用每次手填 field_mapping JSON，也能继续保留手填路径作为模板缺失或 API 异常时的兜底。"
source: "PM requested continuing import-center production usability after IM026 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端读取字段映射模板、上传表单选择 template_id 和手填 JSON 兜底；不新增依赖，不做模板 CRUD UI、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R728 - 导入中心批次明细 drilldown 第一刀

```yaml
id: R728
module: "导入中心"
description: "导入中心前端已经能读取批次、上传 CSV、修正失败行并选择字段映射模板后，需要对选中批次展示更完整的只读明细，让数据管理员能直接查看版本、全部行结果和标准字段预览，减少只看汇总和失败行时的排查断点。"
source: "PM requested continuing import-center production usability after IM027 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端 persisted detail 只读 drilldown；不新增依赖，不做后端、schema/migration、apply 写按钮、批量修正、模板 CRUD、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
```

### R729 - 导入中心失败行修正结果反馈打磨

```yaml
id: R729
module: "导入中心"
description: "导入中心前端已经能展示失败行并提交单行修正后，需要把修正成功、修正失败、剩余失败行和下一步处理提示做成主管/数据管理员可读的结果摘要，减少修正后不知道是否还要继续处理的断点。"
source: "PM requested continuing import-center production usability after IM028 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端修正结果摘要和模型 helper；不新增依赖，不做后端、schema/migration、批量修正、apply 写按钮、模板 CRUD、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
```

### R730 - 导入中心字段映射模板只读管理可见性

```yaml
id: R730
module: "导入中心"
description: "导入中心前端已经能选择字段映射模板上传 CSV 后，需要把模板库存、启用状态、覆盖文件类型和映射字段摘要展示出来，让数据管理员知道当前可复用模板是否覆盖后续导入工作。"
source: "PM requested continuing import-center production usability after IM029 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端只读模板管理可见性；不新增依赖，不做模板新增/编辑/停用按钮、后端、schema/migration、审批、导出、权限、批量、外部集成、生产公式、结算或收费因子。"
```

### R731 - 导入中心上传前模板适配提示

```yaml
id: R731
module: "导入中心"
description: "导入中心前端已经能选择模板并查看模板库存后，需要在上传前提示不同文件类型的模板匹配情况、推荐模板和无模板兜底路径，避免数据管理员上传前不知道该选哪个模板。"
source: "PM requested continuing import-center production usability after IM030 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端上传前模板适配提示和 data-quality 可见性修复；不新增依赖，不做后端、schema/migration、模板 CRUD、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R732 - 导入中心应用前行动建议

```yaml
id: R732
module: "导入中心"
description: "导入中心前端已经能读取准备度、失败行、行级阻塞和版本状态后，需要把这些状态转成应用前行动建议，让数据管理员知道下一步应先修正、补字段、复核版本还是查看已应用结果。"
source: "PM requested continuing import-center production usability after IM031 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端只读行动建议和模型 helper；不新增依赖，不做 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R733 - 导入中心异常态处理建议

```yaml
id: R733
module: "导入中心"
description: "导入中心前端已经能上传、读取批次、读取模板、查看准备度和应用前建议后，需要把批次 API、准备度 API、模板 API、暂无批次、暂无模板这些前置异常收敛成同一组处理建议，减少数据管理员在多个区域之间排查的断点。"
source: "PM requested continuing import-center production usability after IM032 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端只读异常态处理建议和模型 helper；不新增依赖，不做 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R734 - 导入中心上传结果批次入口

```yaml
id: R734
module: "导入中心"
description: "导入中心前端已经能上传 CSV 并回到数据质量页后，需要把上传成功或失败的结果转成明确批次入口和下一步提示，让数据管理员能直接跳到接入批次、失败行、批次明细和应用准备度，而不是只看到一个状态徽标。"
source: "PM requested continuing import-center production usability after IM033 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端上传结果导航提示和模型 helper；不新增依赖，不做 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R735 - 导入中心接入批次筛选

```yaml
id: R735
module: "导入中心"
description: "导入中心前端已经能展示接入批次、上传结果、失败行和应用准备度后，需要在接入批次列表上提供文件类型、处理状态、应用状态和关键词筛选，让数据管理员能快速定位上传历史中的失败批次、未应用批次或特定上传人/文件。"
source: "PM requested continuing import-center production usability after IM034 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端本地批次筛选和模型 helper；不新增依赖，不做后端查询参数、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R736 - 导入中心选中批次处理导览

```yaml
id: R736
module: "导入中心"
description: "导入中心前端已经能筛选接入批次、查看批次明细、失败行和应用准备度后，需要在选中批次后给出只读处理导览，并提供到批次明细、失败行修正和应用准备度的快速定位，减少数据管理员在同一页内寻找下一步的断点。"
source: "PM requested continuing import-center production usability after IM035 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读批次处理导览、锚点定位和模型 helper；不新增依赖，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R737 - 导入中心应用状态概览

```yaml
id: R737
module: "导入中心"
description: "导入中心前端已经能查看选中批次、应用准备度和批次处理导览后，需要把应用状态、应用目标、导入版本和已应用记录数汇总成只读概览，让数据管理员不用在批次列表和准备度详情之间来回拼状态。"
source: "PM requested continuing import-center production usability after IM036 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读应用状态概览和模型 helper；不新增依赖，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R738 - 导入中心批次明细可读性增强

```yaml
id: R738
module: "导入中心"
description: "导入中心已经能展示批次明细、全部行结果和应用状态后，需要让批次明细先给出处理摘要、下一步建议，并在行表中直接暴露错误字段，减少数据管理员从 JSON 预览和错误码中反推问题的成本。"
source: "PM requested continuing import-center production usability after IM037 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读批次明细可读性增强和模型 helper；不新增依赖，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R739 - 导入中心数据质量到履约异常追踪可见性

```yaml
id: R739
module: "导入中心"
description: "导入中心已经能展示批次明细、错误字段和应用状态后，需要把当前批次的数据质量问题映射成会影响的履约异常判断范围，让数据管理员知道失败行、警告行或版本缺口会阻塞哪些后续异常闭环。"
source: "PM requested continuing import-center production usability after IM038 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读质量到异常影响追踪和模型 helper；不新增依赖，不做后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R740 - 导入中心应用结果到下游结果导航

```yaml
id: R740
module: "导入中心"
description: "导入中心已经能展示应用状态、批次明细和数据质量到履约异常的影响追踪后，需要把已应用或未应用批次转成下游对比结果、复核案例和前置修正的只读导航，让数据管理员知道导入完成后该继续追踪哪里。"
source: "PM requested continuing import-center production usability after IM039 and requested installing shadcn skills before continued frontend development on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读下游结果导航和模型 helper；不新增依赖，不做后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R741 - 数据质量页信息架构重构

```yaml
id: R741
module: "导入中心"
description: "数据质量页已经承载导入、模板、批次、准备度、应用状态、下游导航、批次明细和失败行修正后，页面变成纵向堆叠的长页面。需要把展示层级重构为批次工作台、状态检查器和分层详情，提升生产工具可读性。"
source: "PM criticized the long single-page layout and requested starting a UI/product structure correction on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端信息架构和组件边界重构；不新增依赖，不新增业务能力，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R742 - 数据质量页下游结果列表可见性

```yaml
id: R742
module: "导入中心"
description: "数据质量页已经有下游结果导航和分层详情后，需要把选中批次业务日关联的对比结果与复核案例列表直接展示出来，让数据管理员不用只点 API 链接，也能在页面内判断下游业务闭环是否已有结果。"
source: "PM requested continuing import-center production usability after IM041A on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端只读结果列表可见性和模型 helper；复用已有 comparison-runs/review-cases 列表 API，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R743 - 数据质量批次处理详情页拆分

```yaml
id: R743
module: "导入中心"
description: "数据质量页仍然把批次定位、状态摘要、批次明细、失败行修正、结果追踪和导入模板放在同一个长页面里。需要把具体查看和处理拆到单独批次处理详情页，让列表页只负责找批次和进入详情。"
source: "PM challenged long single-page data-quality layout and requested separate detail page on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端路由和信息架构拆分；复用已有组件和本地 API 客户端口径，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R744 - 数据质量批次二级详情导航修正

```yaml
id: R744
module: "导入中心"
description: "数据质量批次处理页拆分后，列表页仍保留状态检查器，且详情路径像三级页面，返回列表不够顺滑。需要把状态检查器完全移入批次详情页，并把具体处理页调整为 `/data-quality/[batchId]` 二级页面。"
source: "PM feedback that detail page is not a second-level page, returning to the list is not smooth, and status checker should not live on the list page on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端路由、页面层级和导航修正；保留旧详情路径兼容跳转，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R745 - 数据质量批次详情单列处理流重设计

```yaml
id: R745
module: "导入中心"
description: "数据质量批次详情页改成二级页面后，状态检查器和分层详情仍以左右分栏呈现，导致核心处理区域被压窄、层级概念不业务化。需要重设计为单列处理流程：顶部批次信息、处理总览、全宽批次处理工作区。"
source: "PM rejected the left-right split detail layout and requested redesign on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端页面布局和业务文案重构；使用现有 shadcn Card/Tabs/Badge/Button，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R746 - 字段映射模板适配详情

```yaml
id: R746
module: "导入中心"
description: "批次详情页的导入与模板区域仍主要展示模板库存，缺少按当前批次文件类型判断模板是否匹配、推荐哪个模板、覆盖哪些标准字段、缺哪些关键字段的业务化说明。需要在详情页内补充只读模板适配详情。"
source: "PM asked to continue production-usability work after batch detail page redesign on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读模板适配和字段映射详情展示；不新增模板 CRUD 写入，不新增依赖，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R747 - 应用准备度问题分组

```yaml
id: R747
module: "导入中心"
description: "批次详情页的状态检查仍把 blockers、row_blockers、版本和应用状态分散展示，主管难以判断先处理哪类问题。需要把应用准备度阻塞按失败行、行级必填字段、版本/应用状态和其他批次阻塞分组，并给出下一步。"
source: "Current recommendation after IM046 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读问题分组；不新增应用写入按钮、不做批量处理、审批、导出、权限、后端、schema/migration、真实外部接口、生产公式、结算或收费因子。"
```

### R748 - 批次详情下游结果追踪 drilldown

```yaml
id: R748
module: "导入中心"
description: "批次详情页已经能展示对比结果和复核案例列表，但还缺少对当前批次是否已经进入下游闭环、应该先看哪个结果、阻塞在哪里的判断。需要在结果追踪页签补充只读 drilldown 判断。"
source: "Current recommendation after IM047 and PM requested continuing development on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读下游结果 drilldown；不新增依赖，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R749 - 数据质量到异常反向聚合 drilldown

```yaml
id: R749
module: "导入中心"
description: "批次详情页已经能看到下游结果判断，但还缺少从异常影响反推导入质量问题的聚合视角。需要把失败/警告行按错误字段和错误原因分组，并关联当前业务日已有对比结果与复核案例，提示先处理影响候选最大的质量问题。"
source: "Current recommendation after IM048 and PM requested continuing development on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读质量影响聚合；不新增依赖，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R750 - shadcn/ui 自动化验证链路

```yaml
id: R750
module: "Harness"
description: "前端开发必须把 shadcn/ui 规则并入自动化验证链路，避免后续继续手写不符合 shadcn 约束的布局、颜色和半径样式。"
source: "PM requested merging shadcn skill checks into automated verification on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做本地验证脚本和 check.sh 集成；不新增依赖，不调用远程 shadcn CLI 作为硬依赖，不修改产品 UI、后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R751 - 复核结论预览只读 drilldown

```yaml
id: R751
module: "导入中心"
description: "批次详情页已有下游结果、质量影响和复核案例列表，但主管仍缺少可直接阅读的复核结论草案。需要在结果追踪页签补充只读结论预览，汇总建议结论、关键证据和残余风险。"
source: "PM agreed to continue with read-only review conclusion preview after IM050 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读复核结论预览；不新增复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R752 - 复核证据缺口只读 drilldown

```yaml
id: R752
module: "导入中心"
description: "批次详情页已经能生成复核结论预览，但主管仍缺少证据缺口视角，无法快速判断哪些未关闭复核案例缺少证据、缺口由谁处理、会影响哪些质量问题。需要在结果追踪页签补充只读证据缺口 drilldown。"
source: "PM asked to continue after IM051 and prior Done Report recommended review evidence gap drilldown on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读证据缺口展示；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R753 - 复核案例工作台二级页

```yaml
id: R753
module: "导入中心"
description: "批次详情页已经加入复核结论和证据缺口，但复核案例仍夹在详情页结果追踪中，容易继续形成超长单页。需要把复核案例查看和处理定位拆成独立二级工作台，支持筛选、分组和从批次详情页跳转。"
source: "PM agreed to split review-case detail and handling into a separate second-level page on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读复核案例工作台；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R754 - 质量问题到复核案例聚焦

```yaml
id: R754
module: "导入中心"
description: "复核案例已经拆到二级工作台，但批次详情里的质量影响聚合还只能提示回看复核案例，缺少直接跳转并聚焦相关复核案例的入口。需要让每个质量问题组生成到复核案例工作台的只读聚焦链接。"
source: "Current recommendation after IM053 and PM asked to continue on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读跳转聚焦；质量问题组可跳到复核案例二级工作台并带入业务日、未关闭状态、来源类型和关键词焦点；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R755 - 复核案例详情页

```yaml
id: R755
module: "导入中心"
description: "复核案例工作台已经拆成二级页，但单个复核案例仍缺少独立详情页。需要从列表进入只读详情，集中展示案例摘要、来源结果、质量问题焦点、证据缺口和下一步建议，避免把处理信息继续塞回列表页。"
source: "Current recommendation after IM054 and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读详情页和复核案例列表入口；详情页展示摘要、来源、质量焦点、证据缺口、证据/结论记录和只读处理边界；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R756 - 复核案例详情正常态数据准备

```yaml
id: R756
module: "导入中心"
description: "复核案例详情页已经拆成二级页，但当前本地数据库没有复核案例记录，页面只能展示 API 404 错误态。需要一个受控的本地 smoke 数据准备能力，复用现有 DB007/DB008 repository 和 schema 生成一条可查看的 CASE-QUERY-001，便于验收真实读取链路。"
source: "After IM055 page smoke found current backend has no review case data and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成本地 smoke 数据准备 helper 和测试；`seed_review_case_demo()` 可生成 `CASE-QUERY-001`、来源对比结果、证据和结论，重复执行返回已存在案例；不新增 schema/migration，不新增依赖，不接真实外部接口，不做权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R757 - 复核案例来源结果上下文

```yaml
id: R757
module: "导入中心"
description: "复核案例详情页已经能展示正常态数据，但来源结果仍只显示编号和类型，主管无法判断案例来自哪个业务日、时段、职场、项目、技能和差异指标。需要在详情 API 和页面中补齐只读来源结果上下文。"
source: "After IM056 normal-state smoke and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成现有 DB007/DB008 来源结果读取和前端只读展示；`ReviewCaseDetail` 返回 `source_result`，详情页展示来源结果明细；不新增 schema/migration，不新增依赖，不接真实外部接口，不做权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R758 - 复核案例来源链路反查

```yaml
id: R758
module: "导入中心"
description: "复核案例详情页已经能展示来源结果上下文，但主管仍无法继续判断该结果来自哪次对比计算、哪些版本以及关联哪个导入批次。需要在详情 API 和页面里补充只读来源链路反查。"
source: "After IM057 source result context and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成只读来源链路上下文；`ReviewCaseDetail` 返回 `source_trace`，详情页展示计算运行、版本和导入批次；不新增 schema/migration，不新增依赖，不接真实外部接口，不做证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R759 - 复核案例来源运行详情入口

```yaml
id: R759
module: "导入中心"
description: "复核案例详情页已经能展示来源运行、版本和导入批次，但运行 ID 仍不能进入可读的前端详情页，只能通过 API JSON 查看。需要从来源链路进入只读对比运行详情页，展示运行摘要和结果列表。"
source: "After IM058 source trace context and PM agreed to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读运行详情入口；复核案例来源链路可进入 `/data-quality/comparison-runs/[runId]`，运行详情页展示摘要、来源版本、结果明细和处理边界；不新增 schema/migration，不新增依赖，不接真实外部接口，不做计算触发、证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R760 - 对比运行关联复核案例定位

```yaml
id: R760
module: "导入中心"
description: "对比运行详情页已经能展示运行摘要和结果列表，但主管仍需要继续判断哪些结果已经形成复核案例，并从结果进入具体复核详情和证据查看。需要在运行详情页增加只读关联复核案例定位。"
source: "After IM059 comparison-run detail page and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读关联定位；运行详情页按当前运行结果匹配复核案例，并提供复核详情前端入口；复用已有 comparison-run detail 和 review-cases list API，不新增 schema/migration，不新增依赖，不接真实外部接口，不做计算触发、证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R761 - 复核案例证据结论链路

```yaml
id: R761
module: "导入中心"
description: "复核案例详情页已经能展示来源结果、来源链路、证据表和结论表，但主管仍需要先看到证据、结论、关闭状态的处理材料链路。需要新增只读证据与结论链路，避免只靠分散表格判断准备度。"
source: "After IM060 linked review-case positioning and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读链路展示；复核案例详情页新增 `证据与结论链路`，按时间展示 evidence、conclusions 和 closure，并把页面主体调整为单列分层；不新增 schema/migration，不新增依赖，不接真实外部接口，不做证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R765 - 复核案例处理时间线

```yaml
id: R765
module: "导入中心"
description: "复核案例详情页已经具备证据补录、结论补充和关闭入口，但主管仍需要一个按处理顺序组织的时间线，快速判断当前案例经历了哪些动作、由谁处理、下一步是什么，而不是在多个区块之间来回拼接。"
source: "After IM064 conclusion supplement entry and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读处理时间线；复核案例详情页新增 `处理时间线`，按时间聚合 evidence、conclusions 和 closure，展示阶段、处理人、时间、说明、当前阶段和下一步建议；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R766 - 复核案例处理阶段筛选

```yaml
id: R766
module: "导入中心"
description: "复核详情页已经具备证据、结论、关闭和时间线，但主管回到复核列表时仍无法按处理阶段安排工作。需要在复核案例工作台按缺证据、缺结论、可关闭和已关闭筛选案例。"
source: "After IM065 processing timeline and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读处理阶段筛选；复核案例工作台新增 processingStage 参数和处理阶段筛选，阶段由现有 review-case detail API 的 evidence、conclusions 和 closure 记录派生，列表展示阶段、材料计数和阶段分组；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R767 - 复核 Owner 阶段负载矩阵

```yaml
id: R767
module: "导入中心"
description: "复核案例工作台已经能按处理阶段筛选案例，但主管仍无法快速判断不同 owner 手上分别有多少缺证据、缺结论、可关闭或已关闭案例。需要新增只读 owner × 处理阶段负载矩阵，并支持从矩阵进入对应过滤列表。"
source: "After IM066 processing-stage filters and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读 owner 阶段负载矩阵；复核案例工作台按 owner 聚合缺证据、缺结论、可关闭、已关闭和阶段未知数量，并提供 ownerId + processingStage 过滤入口；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```
