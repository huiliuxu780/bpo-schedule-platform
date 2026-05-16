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

## Requirements

### R001 - BPO WFM Dashboard 静态首页

```yaml
id: R001
module: "运营工作台"
description: "基于 shadcn 官方 dashboard-01 结构，实现 BPO Workforce Management 静态首页，用于展示排班履约、异常工时、趋势、热力图和数据同步状态。"
source: "PM confirmed F001"
submitted_at: "2026-05-11"
version: "1.0"
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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
status: "done"
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

### R091 - current-state governance closeout

```yaml
id: R091
module: "Harness"
description: "统一 current-state 执行 SoT、ACTIVE_TASKS 最小合同、History-On-Demand 路径和 state-check 严格规则，避免在继续堆功能前出现状态漂移。"
source: "Harness governance closeout on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改状态治理、state-check、测试和追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R092 - 风险提示独立工作台

```yaml
id: R092
module: "前端设计"
description: "为风险提示提供独立的工作台页和稳定入口，统一从排班计划详情、不可用影响定位等页面进入风险列表复核，而不是只落到单条明细或间接回到计划页。"
source: "Story Runner continuation after H029 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做前端页、现有本地契约和跨页跳转对齐；不新增依赖、不改 package/lockfile、不接数据库、不做审批、导出、批量或生产公式。"
```

### R093 - 风险工作台 QA 收口

```yaml
id: R093
module: "质量与交付"
description: "对 F060 风险工作台链路做一轮 QA 收口，确认独立页、导航入口、计划详情和不可用影响定位的风险跳转都在 no-database 边界内可验证、可追溯。"
source: "Story Runner continuation after F060 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做验收、必要的轻微修正和追溯更新；不新增依赖、不改 package/lockfile、不接数据库、不做审批、导出、批量或生产公式。"
```

### R094 - 班次明细精确上下文过滤

```yaml
id: R094
module: "排班复核"
description: "让班次明细页支持 plan/date/project/site/interval 级别的精确上下文过滤，避免从计划、风险或不可用链路跳回宽泛列表。"
source: "Story Runner continuation after Q015 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做前端本地过滤、列表文案和跨页链接；不新增依赖、不接数据库。"
```

### R095 - 不可用列表精确上下文过滤

```yaml
id: R095
module: "排班复核"
description: "让不可用列表页支持 project/site/date/time 级别的精确上下文过滤，使计划和风险页能落到相关不可用范围。"
source: "Story Runner continuation after Q015 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做前端本地过滤、列表文案和跨页链接；不新增依赖、不接数据库。"
```

### R096 - 风险工作台右侧复核 rail

```yaml
id: R096
module: "排班复核"
description: "为风险工作台增加宽屏右侧复核 rail，展示当前范围、建议动作和跨页入口，让复核任务不只停在主表格区域。"
source: "Story Runner continuation after Q015 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做前端布局和本地指标展示；不引入审批、任务系统、数据库或新依赖。"
```

### R097 - 四页上下文链路对齐

```yaml
id: R097
module: "排班复核"
description: "统一计划、风险、班次和不可用四页的上下文链接，让用户可以沿着同一范围持续复核，而不是频繁回到宽泛列表。"
source: "Story Runner continuation after Q015 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地页面和链接对齐；不改后端契约、不接数据库。"
```

### R098 - scoped drilldown QA 收口

```yaml
id: R098
module: "质量与交付"
description: "对 F061-F064 这组 scoped drilldown 和右侧 rail 改动做 QA 收口，确认链路、布局和 no-database 边界可验证、可追溯。"
source: "Story Runner continuation after Q015 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做验收、必要轻微修正和追溯更新；不新增依赖、不接数据库。"
```

### R099 - 班次明细右侧复核 rail

```yaml
id: R099
module: "排班与风险联动"
description: "班次明细页需要在宽屏下提供右侧复核 rail，显示当前上下文、关键指标和继续复核入口，避免页面只剩主表格。"
source: "Story Runner continuation after Q016 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地前端布局和上下文入口，不接数据库。"
```

### R100 - 不可用列表右侧复核 rail

```yaml
id: R100
module: "排班与风险联动"
description: "不可用列表页需要在宽屏下提供右侧复核 rail，显示当前范围、影响摘要和继续复核入口。"
source: "Story Runner continuation after Q016 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地前端布局和上下文入口，不接数据库。"
```

### R101 - 计划时段明细 continuation actions

```yaml
id: R101
module: "排班与风险联动"
description: "计划详情里的 0.5h 时段明细需要直接提供风险、班次和不可用 continuation actions，并保留计划、日期、职场和时段上下文。"
source: "Story Runner continuation after Q016 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地表格操作链和链接拼装，不改后端契约。"
```

### R102 - 不可用影响表 continuation actions

```yaml
id: R102
module: "排班与风险联动"
description: "不可用影响页里的关联风险表需要继续跳到同范围的风险、班次和计划详情，保证 detail-to-detail 的复核链路不断开。"
source: "Story Runner continuation after Q016 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地页面和链接对齐；不改后端契约、不接数据库。"
```

### R103 - review rail + continuation action QA 收口

```yaml
id: R103
module: "质量与交付"
description: "对 F065-F068 这组 review rail 和 continuation action 改动做 QA 收口，确认链路、布局和 no-database 边界可验证、可追溯。"
source: "Story Runner continuation after Q016 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做验收、必要轻微修正和追溯更新；不新增依赖、不接数据库。"
```

### R104 - 排班计划详情右侧复核 rail

```yaml
id: R104
module: "排班与风险联动"
description: "排班计划详情页需要在宽屏下提供右侧复核 rail，显示当前范围、关键指标和继续复核入口。"
source: "Story Runner continuation after Q017 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地前端布局和 review 入口，不接数据库。"
```

### R105 - 风险明细右侧复核 rail

```yaml
id: R105
module: "排班与风险联动"
description: "风险明细页需要在宽屏下提供右侧复核 rail，显示当前范围、关键指标和继续复核入口。"
source: "Story Runner continuation after Q017 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地前端布局和 review 入口，不接数据库。"
```

### R106 - 不可用影响定位右侧复核 rail

```yaml
id: R106
module: "排班与风险联动"
description: "不可用影响定位页需要在宽屏下提供右侧复核 rail，显示当前范围、关键指标和继续复核入口。"
source: "Story Runner continuation after Q017 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地前端布局和 review 入口，不接数据库。"
```

### R107 - detail 页复核入口统一 helper

```yaml
id: R107
module: "排班与风险联动"
description: "计划详情、风险明细和不可用影响定位的复核入口需要继续统一到同一套本地 helper，避免 URL 组装再次漂移。"
source: "Story Runner continuation after Q017 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地 helper 收敛和 detail 页入口对齐，不改后端契约。"
```

### R108 - detail 页右侧 rail QA 收口

```yaml
id: R108
module: "质量与交付"
description: "对 F069-F072 这组 detail 页右侧 rail 改动做 QA 收口，确认链路、布局和 no-database 边界可验证、可追溯。"
source: "Story Runner continuation after Q017 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做验收、必要轻微修正和追溯更新；不新增依赖、不接数据库。"
```

### R109 - Harness 文档一致性与 Hook 守门

```yaml
id: R109
module: "Harness"
description: "统一 Harness 规则源与 SoT 优先级，收紧 ACTIVE_TASKS 最小合同，增强 check-state 与 Git hooks，让状态、范围、提交和推送前验证都可校验。"
source: "PM supplied full Harness consistency and hook-guard plan on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改治理文档、状态校验、hook 脚本和追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R110 - TRACE_INDEX 预算治理与窗口化

```yaml
id: R110
module: "Harness"
description: "把 TRACE_INDEX 收回 warning 预算内，并明确 registry 的窗口化与减重规则，避免 registry 成为新的默认大上下文入口。"
source: "Governance continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做 current/registry/quality/traceability 文档治理；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R111 - Traceability closeout 守门与提交后证据回写

```yaml
id: R111
module: "Harness"
description: "允许严格限定的 post-closeout traceability-only diff 在 current 已清空后继续通过 state check，并把最近几条 branch-log 的 local_commit_sha 补齐成真实证据。"
source: "Governance continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改 current/registry/quality/traceability 文档、状态校验和测试；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R112 - 统一 review checklist 与右侧任务结构

```yaml
id: R112
module: "排班与风险联动"
description: "risk/plan/shift/unavailability 页面右侧重复的复核任务块需要统一成共享的本地 review checklist，显示当前步骤、下一步和范围内跳转，不接数据库。"
source: "Story Runner continuation after Q018 on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改前端页面、共享组件、轻量 helper、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R113 - startup seed strict-state 守门

```yaml
id: R113
module: "Harness"
description: "当新产品 batch 从 idle seed 到 active 时，strict state check 需要允许严格限定的 current/registry/traceability startup diff，否则 Story Runner 会在实现前自锁。"
source: "Governance repair during US124 startup on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改 current/registry/quality 文档、状态校验和测试；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R114 - product closeout guard for strict state and commit message

```yaml
id: R114
module: "Harness"
description: "当产品 batch 在同一提交里完成 current closeout 时，strict state check 和 commit-message 校验都必须识别这种合法 closeout，否则已验证的产品任务仍无法合法提交。"
source: "Governance repair during US124 closeout on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改 current/registry/quality 文档、状态校验、commit-message 校验和测试；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R115 - scoped detail navigation across review drilldown

```yaml
id: R115
module: "排班与风险联动"
description: "review drilldown 从风险表、不可用表和关联表进入 detail 页时，需要保留当前 scope 和来源页；detail 页里的返回和相关计划跳转也不能掉回全量列表。"
source: "Story Runner continuation after US124 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 route、navigation helper、表格链接、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R116 - plan-origin review back-link closure

```yaml
id: R116
module: "排班与风险联动"
description: "从计划详情进入班次、风险、不可用 drilldown 后，返回动作和后续页面动作仍需认得 schedule-plans 是来源页，避免掉回全量列表。"
source: "Story Runner continuation after US127 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 route、review helper、页面返回动作、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R117 - plan-origin row-action context closure

```yaml
id: R117
module: "排班与风险联动"
description: "计划详情时段表和班次明细表里的行级动作仍可能丢失 schedule-plans 来源页，需要继续透传 plan-origin review context，避免从表格动作掉回宽泛列表或无来源状态。"
source: "Story Runner continuation after US128 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 table action、review helper、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R118 - unavailability impact shift-table scoped plan-link closure

```yaml
id: R118
module: "排班与风险联动"
description: "不可用影响定位页中的影响班次表仍使用裸计划链接，需要保留当前 review scope 和来源页，避免从关联班次行动作跳到无上下文的计划详情。"
source: "Story Runner continuation after US129 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 table action、调用页传参、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R119 - risk detail auxiliary-table continuation closure

```yaml
id: R119
module: "排班与风险联动"
description: "风险明细页里的关联班次表和不可用表仍缺少 scoped continuation actions，需要补齐到计划、班次和影响页的稳定钻取，避免复核停留在只读 detail 辅表。"
source: "Story Runner continuation after US130 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 table action、风险明细调用页、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R120 - review list row-action parity closure

```yaml
id: R120
module: "排班与风险联动"
description: "风险列表和不可用列表的行级动作仍少于周边 review rail 提供的 continuation surface，需要补齐 scoped row actions，避免从列表复核时被迫绕行。"
source: "Story Runner continuation after US131 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 table action、轻量 helper、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R121 - schedule plan list review parity closure

```yaml
id: R121
module: "排班与风险联动"
description: "排班计划列表的行级动作仍只有单一 detail 入口，需要补齐到风险、班次和不可用的本地 continuation surface，避免计划列表成为 review chain 的断点。"
source: "Story Runner continuation after US132 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 table action、轻量 helper、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R122 - schedule plan draft flow context closure

```yaml
id: R122
module: "排班与风险联动"
description: "从排班计划列表或计划详情进入新建/编辑草稿时，需要保留当前列表筛选、来源页和返回目标；提交后的回跳也不能退化成裸列表或无上下文详情。"
source: "Story Runner continuation after US133 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 route、server action、轻量 helper、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R123 - schedule plan draft failure feedback closure

```yaml
id: R123
module: "排班与风险联动"
description: "当新建或编辑草稿失败并带着 `draft=failed` 回跳时，计划列表或计划详情需要给出可见提示，不能把失败信号只留在 URL 参数里。"
source: "Story Runner continuation after US134 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端页面、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R124 - schedule plan draft success feedback closure

```yaml
id: R124
module: "排班与风险联动"
description: "当本地新建或保存草稿成功并跳回计划详情时，页面需要给出可见成功提示，不能让用户只靠路由变化推断操作结果。"
source: "Story Runner continuation after US135 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端页面、server action、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R125 - schedule plan list detail-context closure

```yaml
id: R125
module: "排班与风险联动"
description: "排班计划列表表格中的 `查看` 仍使用裸详情链接，需要保留当前 query、status 和来源页上下文，避免用户从 detail 返回时掉回无筛选状态。"
source: "Story Runner continuation after US136 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端列表页、表格链接、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R126 - schedule plan list-origin review return closure

```yaml
id: R126
module: "排班与风险联动"
description: "排班计划列表中的 `风险`、`班次`、`不可用` 动作仍把 schedule-plans 统一当作计划详情来源，导致返回目标不稳定；需要把计划列表来源单独建模，保留当前筛选列表作为回退目标。"
source: "Story Runner continuation after US137 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端 helper、列表动作、workbench 返回态、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R127 - schedule plan risk-entry context closure

```yaml
id: R127
module: "排班与风险联动"
description: "排班计划页中的风险总览入口和内嵌风险预览表仍会把用户带到泛化的风险工作台，缺少 plan-list source、query 和 status 的稳定透传；需要把这条入口补成完整的计划列表发起 review chain。"
source: "Story Runner continuation after US138 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "done"
notes: "只改本地前端 helper、计划页、风险页、风险表、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R128 - schedule plan summary CTA context closure

```yaml
id: R128
module: "排班与风险联动"
description: "排班计划页里的本地 MVP flow summary 仍使用裸跨页链接和硬编码 risk detail，缺少与当前计划列表 query/status/source 一致的上下文透传；需要把 summary CTA 层补成与当前 review chain 一致的入口。"
source: "Story Runner continuation after US139 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "done"
notes: "只改本地前端 summary 组件、计划页、轻量 helper、测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R129 - risk workbench unavailability CTA context closure

```yaml
id: R129
module: "排班与风险联动"
description: "风险工作台头部的 `不可用管理` 仍使用裸跳转，且无来源时的默认回退目标也指向了错误页面；需要把这两个 CTA 收口到与当前 review chain 一致的上下文 helper routing。"
source: "Story Runner continuation after US140 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "done"
notes: "只改本地前端风险页、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R130 - demand plan to schedule plan CTA context closure

```yaml
id: R130
module: "需求与排班联动"
description: "需求计划页头部的 `查看排班计划` 仍使用裸 `/schedule-plans`，会在用户带着 demand query 进入排班计划链路前丢失当前搜索上下文；需要把它补成 helper-driven handoff。"
source: "Story Runner continuation after US141 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "done"
notes: "只改本地前端需求页、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R131 - risk workbench clear-scope CTA context closure

```yaml
id: R131
module: "排班与风险联动"
description: "风险工作台在带有 plan/date/site drilldown 与 query/status 上下文时，`查看全部` 仍使用裸 `/schedule-risks`，会把 query/status 一起清掉；需要让它只清 scope，不清当前列表上下文。"
source: "Story Runner continuation after US142 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "done"
notes: "只改本地前端风险页、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R132 - shift and unavailability clear CTA context closure

```yaml
id: R132
module: "排班与风险联动"
description: "班次明细与不可用管理页里的 `清空范围` 和 `清空` 仍使用裸列表链接，scope drilldown 与上游 review source 容易一起丢失；需要把这组 CTA 收口到 helper-driven clear 行为：清范围只去掉 drilldown，清空筛选只清本页列表过滤。"
source: "Story Runner continuation after US143 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "done"
notes: "只改本地前端班次页、不可用页、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R133 - schedule plan draft feedback context persistence

```yaml
id: R133
module: "排班与风险联动"
description: "排班计划页已经能显示本地 draft 失败/成功反馈，但当前搜索、状态切换和 `清空` 仍会直接丢掉 `draft` 参数；需要让这组列表交互在留在当前页面时继续保留反馈上下文。"
source: "Story Runner continuation after US144 closeout on 2026-05-14"
submitted_at: "2026-05-14"
version: "1.0"
status: "split"
notes: "只改本地前端排班计划页、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R134 - schedule plan draft feedback dismiss action

```yaml
id: R134
module: "排班与风险联动"
description: "排班计划页已经会在当前列表内保留本地 draft 失败/成功反馈，但用户还缺一个显式的同页关闭动作；需要新增 dismiss CTA，只去掉 `draft`，同时保留当前 `query/status` 列表上下文。"
source: "Story Runner continuation after US145 closeout on 2026-05-15"
submitted_at: "2026-05-15"
version: "1.0"
status: "split"
notes: "只改本地前端排班计划页、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R135 - demand plan clear CTA consistency

```yaml
id: R135
module: "排班与需求联动"
description: "demand-plans 页头 CTA 已经会保留 query 进入 schedule-plans，但当前列表 `清空` 仍使用裸 `/demand-plans`；需要把它收口到 helper-driven clear CTA，保持本地需求页路由一致性。"
source: "Story Runner continuation after US146 closeout on 2026-05-15"
submitted_at: "2026-05-15"
version: "1.0"
status: "split"
notes: "只改本地前端 demand-plans 页面、轻量测试和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R136 - schedule plan draft edit route E2E reinforcement

```yaml
id: R136
module: "本地验收与排班草稿"
description: "PM 要求继续下一批本地 P1，优先补 draft edit 路径的浏览器级 E2E，覆盖筛选后的排班计划列表进入 draft 计划详情、编辑页，并验证取消/返回仍保留当前上下文。"
source: "PM continuation request after pushing codex/f-batch-001-local-p0-p1 on 2026-05-15"
submitted_at: "2026-05-15"
version: "1.0"
status: "done"
notes: "只补本地 E2E/必要前端小修和追溯；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R137 - local table parity E2E QA reinforcement

```yaml
id: R137
module: "本地验收与 table parity"
description: "PM 要求继续 table parity 局部补强，在本地 E2E 中补充排班计划列表可见 table parity 控制的验收覆盖，并记录 no-database 边界。"
source: "PM continuation request after pushing codex/f-batch-001-local-p0-p1 on 2026-05-15"
submitted_at: "2026-05-15"
version: "1.0"
status: "done"
notes: "只补本地 E2E/QA 证据和必要轻量断言；不改依赖、不改 package/lockfile、不接数据库、不改后端契约。"
```

### R138 - local demo staff/status/login import loop

```yaml
id: R138
module: "本机演示数据导入"
description: "PM 明确当前只需要本机演示，不上云测试环境；为演示真实坐席主数据、状态数据和登录数据，需要提供一个本机导入口子，导入后驱动本地 dashboard 和数据接入状态。"
source: "PM clarification on 2026-05-16: only local demo, with real staff master/status/login data import entry"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已提供 localhost 本机演示导入闭环；不接数据库、不做 ORM/migration/schema、不接真实 CORN/HR/WFM API、不新增依赖、不改 package/lockfile。"
```

### R139 - local demo visible placeholder cleanup

```yaml
id: R139
module: "本机演示占位清零"
description: "页面上的文件导入、接入批次、数据接入状态、异常行操作等占位需要在本机演示中可点击、可解释，并优先关联本机导入数据，而不是继续指向 dashboard 或纯静态占位。"
source: "PM approval on 2026-05-16 to proceed with local demo placeholder cleanup"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已补本机演示路径和局部占位闭环；不做审批、导出、批量操作、权限、生产公式、结算规则或收费因子。"
```

### R140 - local demo import acceptance evidence

```yaml
id: R140
module: "本机演示验收"
description: "本机导入闭环和页面占位清零完成后，需要补充浏览器级 smoke/E2E 与审计证据，证明演示链路可点通且边界仍然是 no-database/no-real-integration。"
source: "PM-approved local demo import and placeholder cleanup batch on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "QA 已覆盖本机演示闭环，不扩大到云发布、数据库或生产化能力。"
```

### R141 - local dashboard filters and KPI preview

```yaml
id: R141
module: "本机 dashboard 演示筛选"
description: "PM 同意继续本机演示链路后，dashboard 顶部筛选和 KPI 需要从静态占位推进到本机可点击、可解释的 preview；导入批次可用于说明数据版本和覆盖量，但不固化生产 KPI 公式。"
source: "PM approval on 2026-05-16 after local demo import branch push"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已完成 localhost 本机 demo preview；不接数据库、不接真实 API、不新增依赖、不改 package/lockfile、不做生产公式、结算规则或收费因子。"
```

### R142 - local dashboard KPI preview acceptance evidence

```yaml
id: R142
module: "本机 dashboard KPI preview 验收"
description: "本机 dashboard 筛选和 imported-data KPI preview 完成后，需要补充浏览器级 smoke 和审计证据，证明演示链路可点通且仍然是 no-database/no-real-integration/no-production-formula。"
source: "PM-approved continuation after BATCH-B008-F116-Q042 on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "QA 已覆盖本机 dashboard demo preview，不扩大到云发布、数据库或生产化指标体系。"
```

### R143 - unavailable navigation development labeling

```yaml
id: R143
module: "导航可信度"
description: "PM 明确侧边栏中没有开放的功能需要标注 `开发中`，不能继续表现为已开放入口或误跳到 dashboard；已开放模块继续保持可点击。"
source: "PM clarification on 2026-05-16: 没有开放的标注开发中即可"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已把未开放导航项标为 `开发中` 且不再作为 Link 跳转；不开发新页面、不接数据库、不做权限/审批/导出/结算/生产公式。"
```

### R144 - remaining feature completion sequencing

```yaml
id: R144
module: "产品补全排期"
description: "PM 要求尽快安排补全剩余功能；后续补全应围绕现有功能页和真实导入数据流转，不再新增独立演示中心。"
source: "PM clarification on 2026-05-16: 尽快安排起来补全功能，补全剩下的功能"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已在项目状态记录后续补全顺序；后续功能仍逐批进入 Story Runner，不一次性扩大到数据库、真实集成或生产工作流。"
```

### R145 - navigation development labeling acceptance evidence

```yaml
id: R145
module: "导航可信度验收"
description: "未开放导航项改为 `开发中` 后，需要补充浏览器级 smoke 证据，证明用户不会从未开放菜单误跳到 dashboard。"
source: "F118 navigation development labeling batch on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "QA 已覆盖本地导航可信度，不扩大到新模块开发、数据库、真实集成、权限、审批、导出或结算。"
```

### R146 - local demo processed import records API

```yaml
id: R146
module: "本机演示数据导入"
description: "本机导入成功行需要被后端作为 processed records 暴露给现有模块读取，而不是只停留在导入页或 batch summary。"
source: "PM continuation on 2026-05-16 after navigation development labeling push"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已增加 localhost-only/process-memory 只读 API；不接数据库、不做 ORM/migration/schema、不接真实 CORN/HR/WFM API。"
```

### R147 - existing modules read imported records

```yaml
id: R147
module: "导入数据现有模块消费"
description: "dashboard 和班次明细等现有页面需要读取后端处理后的导入 records，并展示可解释的覆盖摘要或样本，证明导入结果进入业务模块。"
source: "PM direction on 2026-05-16: 演示基于现有功能，导入后在各模块页面展示结果"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "dashboard 与 shift-details 已读取 processed records 并展示首个模块级摘要；不新增演示中心、不做生产 KPI/公式。"
```

### R148 - imported records module-read QA evidence

```yaml
id: R148
module: "导入数据现有模块验收"
description: "导入 records 被现有模块读取后，需要补充后端 unittest 和浏览器 smoke 证据，证明导入后 dashboard 与 shift-details 能看到处理结果。"
source: "B009 imported records existing-module batch on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "QA 已覆盖本机导入数据进入现有模块的读取结果，不扩大到数据库、真实集成、权限、审批、导出、批量或结算。"
```

### R149 - schedule risks read imported records

```yaml
id: R149
module: "导入数据现有模块消费"
description: "风险提示页需要读取后端 processed records，并展示本机导入数据对风险复核的覆盖摘要，避免风险页仍像静态 seed 页面。"
source: "PM continuation on 2026-05-16 after imported records module-read push"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "schedule-risks 已读取 processed records 并展示 `风险复核 records` 摘要；不改后端契约、不接数据库、不做生产风险公式。"
```

### R150 - unavailability reads imported records

```yaml
id: R150
module: "导入数据现有模块消费"
description: "不可用管理页需要读取后端 processed records，并展示本机导入数据对人员不可用核对的覆盖摘要，继续让导入结果进入现有模块。"
source: "PM continuation on 2026-05-16 after imported records module-read push"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "unavailability 已读取 processed records 并展示 `不可用核对 records` 摘要；不改后端契约、不接数据库、不做权限、审批、导出或批量。"
```

### R151 - risk and unavailability imported records QA

```yaml
id: R151
module: "导入数据现有模块验收"
description: "风险提示和不可用管理读取 records 后，需要补充浏览器 smoke 证据，证明导入后两个现有页面都能看到处理结果。"
source: "F119 risk/unavailability imported records batch on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入后 schedule-risks 与 unavailability 出现 records 摘要；QA 不扩大到后端新契约、数据库、真实集成或生产工作流。"
```

### R152 - fulfillment monitoring reads status and login records

```yaml
id: R152
module: "履约监控"
description: "履约监控需要先做一个本机最小切片，读取已导入的坐席状态数据和登录数据 records，展示履约核验覆盖，而不是继续保持导航占位。"
source: "PM continuation on 2026-05-16: 持续补完功能，演示基于现有导入结果"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/fulfillment-monitoring`，读取状态和登录 processed records 并展示本机履约核验摘要；不做生产遵守率公式、数据库、真实集成、审批、导出、批量或结算。"
```

### R153 - work-hours verification navigation entry

```yaml
id: R153
module: "导航可信度"
description: "当履约监控最小页面完成后，侧边栏 `工时核验` 应从 `开发中` 改为真实可点击入口，其他未完成履约项继续标注 `开发中`。"
source: "F120 fulfillment monitoring minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "`工时核验` 已链接到 `/fulfillment-monitoring`；其他未实现履约入口继续显示 `开发中`。"
```

### R154 - fulfillment monitoring imported records QA

```yaml
id: R154
module: "履约监控验收"
description: "履约监控读取状态/登录 records 后，需要补充浏览器 smoke 证据，证明导入后现有履约入口能看到处理结果。"
source: "F120 fulfillment monitoring minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入状态和登录数据后履约监控出现 records 摘要；QA 不扩大到生产公式、数据库、真实集成或生产工作流。"
```

### R155 - agent status trace reads status records

```yaml
id: R155
module: "履约监控"
description: "坐席状态轨迹需要做本机最小切片，读取已导入的坐席状态数据 records，展示状态覆盖、状态分布和样本轨迹。"
source: "PM continuation on 2026-05-16: 继续补完履约监控功能"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/agent-status-trace` 页面读取 status_log records，展示状态覆盖、状态分布和样本轨迹；不做实时流、生产遵守率公式、数据库、真实集成、审批、导出、批量或结算。"
```

### R156 - agent status trace navigation entry

```yaml
id: R156
module: "导航可信度"
description: "坐席状态轨迹页面完成后，侧边栏 `坐席状态轨迹` 应从 `开发中` 改为真实可点击入口，其他未完成履约项继续标注 `开发中`。"
source: "F121 agent status trace minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `坐席状态轨迹` 已链接到 `/agent-status-trace`；异常管理、实时遵守率和异常复核继续显示 `开发中`。"
```

### R157 - agent status trace imported records QA

```yaml
id: R157
module: "履约监控验收"
description: "坐席状态轨迹读取 status_log records 后，需要补充浏览器 smoke 证据，证明导入后现有履约入口能看到处理结果。"
source: "F121 agent status trace minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入状态数据后进入 agent-status-trace 并看到 records 摘要；QA 不扩大到实时流、生产公式、数据库、真实集成或生产工作流。"
```

### R158 - fulfillment exceptions reads imported records

```yaml
id: R158
module: "履约监控"
description: "异常管理需要做本机最小切片，读取已导入的坐席状态数据和登录数据 records，展示可复核的本机异常线索和样本。"
source: "PM continuation on 2026-05-16: 持续补完履约监控占位功能"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/fulfillment-exceptions` 页面读取 status_log/login_log records，展示本机异常线索、覆盖和样本；不做实时流、生产异常判定、遵守率公式、处罚规则、数据库、真实集成、审批、导出、批量或结算。"
```

### R159 - fulfillment exceptions navigation entry

```yaml
id: R159
module: "导航可信度"
description: "异常管理页面完成后，侧边栏 `异常管理` 应从 `开发中` 改为真实可点击入口，实时遵守率和异常复核继续标注 `开发中`。"
source: "F122 fulfillment exceptions minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `异常管理` 已链接到 `/fulfillment-exceptions`；实时遵守率和异常复核继续显示 `开发中`。"
```

### R160 - fulfillment exceptions imported records QA

```yaml
id: R160
module: "履约监控验收"
description: "异常管理读取 status_log/login_log records 后，需要补充浏览器 smoke 证据，证明导入后现有履约入口能看到处理结果。"
source: "F122 fulfillment exceptions minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入状态/登录数据后进入 fulfillment-exceptions 并看到 records 摘要；QA 不扩大到实时流、生产异常规则、数据库、真实集成或生产工作流。"
```

### R161 - exception review reads imported records

```yaml
id: R161
module: "履约监控"
description: "异常复核需要做本机只读最小切片，读取已导入的坐席状态数据和登录数据 records，展示待人工查看的复核队列和样本。"
source: "PM continuation on 2026-05-16: 持续补完履约监控占位功能"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/exception-review` 页面读取 status_log/login_log records，展示只读复核队列和样本；不做复核审批动作、状态写回、实时流、生产异常判定、遵守率公式、处罚规则、数据库、真实集成、导出、批量或结算。"
```

### R162 - exception review navigation entry

```yaml
id: R162
module: "导航可信度"
description: "异常复核页面完成后，侧边栏 `异常复核` 应从 `开发中` 改为真实可点击入口，实时遵守率继续标注 `开发中`。"
source: "F123 exception review minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `异常复核` 已链接到 `/exception-review`；实时遵守率继续显示 `开发中`。"
```

### R163 - exception review imported records QA

```yaml
id: R163
module: "履约监控验收"
description: "异常复核读取 status_log/login_log records 后，需要补充浏览器 smoke 证据，证明导入后现有履约入口能看到只读复核结果。"
source: "F123 exception review minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入状态/登录数据后进入 exception-review 并看到复核队列 records 摘要；QA 不扩大到审批、状态写回、实时流、生产异常规则、数据库或真实集成。"
```

### R164 - adherence monitoring reads imported records

```yaml
id: R164
module: "履约监控"
description: "实时遵守率需要做本机预览最小切片，读取已导入的坐席状态数据和登录数据 records，展示本机覆盖和样本，不计算生产遵守率。"
source: "PM continuation on 2026-05-16: 按规划补齐履约监控占位功能"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 adherence-monitoring 本机 records 预览页面，读取 status_log/login_log 并展示覆盖与样本；未做生产遵守率公式、实时流、状态码固化、状态写回、数据库、真实集成、审批、导出、批量或结算。"
```

### R165 - adherence monitoring navigation entry

```yaml
id: R165
module: "导航可信度"
description: "实时遵守率页面完成后，侧边栏 `实时遵守率` 应从 `开发中` 改为真实可点击入口。"
source: "F124 adherence monitoring minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `实时遵守率` 已链接到 `/adherence-monitoring`；页面文案明确只是本机 records 预览，不声称生产实时遵守率能力已经完成。"
```

### R166 - adherence monitoring imported records QA

```yaml
id: R166
module: "履约监控验收"
description: "实时遵守率本机预览读取 status_log/login_log records 后，需要补充浏览器 smoke 证据，证明导入后现有履约入口能看到 records 覆盖。"
source: "F124 adherence monitoring minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入状态/登录数据后进入 adherence-monitoring 并看到遵守率预览 records 摘要；QA 不扩大到生产公式、实时流、状态写回、数据库或真实集成。"
```

### R167 - data quality reads imported records

```yaml
id: R167
module: "数据与集成"
description: "数据质量需要做本机预览最小切片，读取已导入的坐席主数据、坐席状态数据和登录数据 records，展示覆盖、样本和基础质量预览状态。"
source: "PM continuation on 2026-05-16: 持续补完未开放功能"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/data-quality` 页面读取 staff_master/status_log/login_log records，展示覆盖、样本和基础缺口提示；不做生产数据质量规则、自动修复、字段映射写回、真实接口检查、跨系统对账、数据库或真实集成。"
```

### R168 - data quality navigation entry

```yaml
id: R168
module: "导航可信度"
description: "数据质量页面完成后，侧边栏 `数据质量` 应从 `开发中` 改为真实可点击入口。"
source: "F125 data quality minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `数据质量` 已链接到 `/data-quality`；页面文案明确只是本机 records 质量预览，不声称生产数据质量规则、真实接口检查或跨系统对账能力已经完成。"
```

### R169 - data quality imported records QA

```yaml
id: R169
module: "数据与集成验收"
description: "数据质量本机预览读取 staff_master/status_log/login_log records 后，需要补充浏览器 smoke 证据，证明导入后现有数据与集成入口能看到 records 覆盖。"
source: "F125 data quality minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入三类 CSV 后进入 data-quality 并看到数据质量 records 摘要；QA 不扩大到生产质量规则、自动修复、字段映射写回、数据库或真实集成。"
```

### R170 - CORN status log reads imported records

```yaml
id: R170
module: "数据与集成"
description: "CORN 状态日志需要做本机预览最小切片，读取已导入的坐席状态数据 status_log records，展示状态覆盖、最近批次、状态分布和样本。"
source: "PM continuation on 2026-05-16: 持续补完未开放功能"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/corn-status-log` 页面读取 status_log records，展示状态覆盖、最近批次、状态分布和样本；未接真实 CORN API、实时流、生产状态码固化、状态写回、数据库或真实接口检查。"
```

### R171 - CORN status log navigation entry

```yaml
id: R171
module: "导航可信度"
description: "CORN 状态日志页面完成后，侧边栏 `CORN 状态日志` 应从 `开发中` 改为真实可点击入口。"
source: "F126 CORN status log minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `CORN 状态日志` 已链接到 `/corn-status-log`；页面文案明确只是本机 records 预览，不声称真实 CORN 接口集成已经完成。"
```

### R172 - CORN status log imported records QA

```yaml
id: R172
module: "数据与集成验收"
description: "CORN 状态日志本机预览读取 status_log records 后，需要补充浏览器 smoke 证据，证明导入后数据与集成入口能看到状态日志处理结果。"
source: "F126 CORN status log minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入状态 CSV 后进入 corn-status-log 并看到 CORN 状态日志 records 摘要；QA 不扩大到真实 CORN 集成、实时流、生产状态码、状态写回、数据库或真实接口检查。"
```

### R173 - field mapping reads imported sample fields

```yaml
id: R173
module: "数据与集成"
description: "字段映射需要做本机只读预览最小切片，读取已导入的 staff_master/status_log/login_log records 样本字段，展示字段覆盖、缺失字段和最近批次。"
source: "PM continuation on 2026-05-16: 功能全部不要遗漏"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/field-mapping` 页面读取 staff_master/status_log/login_log records 样本字段，展示字段覆盖、缺失字段和最近批次；未做字段映射写回、保存配置、真实接口检查、跨系统对账、数据库或真实集成。"
```

### R174 - field mapping navigation entry

```yaml
id: R174
module: "导航可信度"
description: "字段映射页面完成后，侧边栏 `字段映射` 应从 `开发中` 改为真实可点击入口。"
source: "F127 field mapping minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `字段映射` 已链接到 `/field-mapping`；页面文案明确只是本机只读字段覆盖预览，不代表字段映射配置保存或写回能力已经完成。"
```

### R175 - field mapping imported records QA

```yaml
id: R175
module: "数据与集成验收"
description: "字段映射只读预览读取三类 processed records 后，需要补充浏览器 smoke 证据，证明导入后数据与集成入口能看到字段覆盖结果。"
source: "F127 field mapping minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入三类 CSV 后进入 field-mapping 并看到字段映射 records 摘要；QA 不扩大到字段映射写回、保存配置、真实接口检查、跨系统对账、数据库或真实集成。"
```

### R176 - organization people reads staff master records

```yaml
id: R176
module: "系统管理"
description: "组织与人员需要做本机只读预览最小切片，读取已导入的 staff_master records，展示人员覆盖、团队/职场/供应商分布和样本。"
source: "PM continuation on 2026-05-16: 功能全部不要遗漏"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/organization-people` 页面读取 staff_master records，展示人员覆盖、团队/职场/供应商分布和样本；不做账号登录、权限、组织架构维护、主数据写回、数据库或真实 HR/CORN/WFM 集成。"
```

### R177 - organization people navigation entry

```yaml
id: R177
module: "导航可信度"
description: "组织与人员页面完成后，侧边栏 `系统管理 > 组织与人员` 应从 `开发中` 改为真实可点击入口，其他未实现系统管理项继续标注 `开发中`。"
source: "F128 organization people minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "侧边栏 `系统管理 > 组织与人员` 已链接到 `/organization-people`；供应商管理、规则配置、权限管理和操作审计仍保持开发中。"
```

### R178 - organization people imported records QA

```yaml
id: R178
module: "系统管理验收"
description: "组织与人员读取 staff_master records 后，需要补充浏览器 smoke 证据，证明导入后系统管理入口能看到人员主数据处理结果。"
source: "F128 organization people minimum slice on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入坐席主数据后进入 organization-people 并看到组织与人员 records 摘要；QA 不扩大到数据库、真实集成、登录账号、权限、组织架构维护、导出、批量或生产审计。"
```

### R179 - today fulfillment local preview

```yaml
id: R179
module: "运营工作台"
description: "今日履约需要做本机只读预览页，读取已导入的 status_log/login_log records 和本地排班上下文，展示今日履约覆盖、登录/状态样本和本机边界。"
source: "PM explicit continuation on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/today-fulfillment`，读取本机 staff/status/login processed records 并展示今日履约 records、状态/登录样本和 no-database/no-production-formula 边界。"
```

### R180 - anomaly alerts local preview

```yaml
id: R180
module: "运营工作台"
description: "异常预警需要做本机只读预览页，读取现有 dashboard 异常和导入 records 覆盖，展示预警数量、严重度分布和样本。"
source: "PM explicit continuation on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/anomaly-alerts`，读取 dashboard 本机 seed 异常和导入 records 覆盖并展示异常预警 records、严重度、待复核和只读边界。"
```

### R181 - deficit heatmap local preview

```yaml
id: R181
module: "运营工作台"
description: "时段缺口热力图需要做本机只读预览页，复用现有 dashboard heatmap 本地数据，展示缺口汇总、严重时段和热力图。"
source: "PM explicit continuation on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/deficit-heatmap`，复用 dashboard 本机 heatmap seed 展示时段缺口 records、严重时段清单和热力图边界。"
```

### R182 - vendor management local preview

```yaml
id: R182
module: "系统管理"
description: "供应商管理需要做本机只读预览页，读取已导入 staff_master records 中的 vendor/site/team 覆盖，展示供应商分布和样本。"
source: "PM explicit continuation on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/vendor-management`，读取 staff_master vendor/site/team 样本并展示供应商管理 records、供应商分布和 no-writeback/no-settlement 边界。"
```

### R183 - rule configuration local preview

```yaml
id: R183
module: "系统管理"
description: "规则配置需要做本机只读预览页，展示当前本机演示边界和规则项清单，说明哪些规则可预览、哪些生产规则仍未开放。"
source: "PM explicit continuation on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "已新增 `/rule-configuration`，展示规则配置 records、本机规则目录和开发中规则边界；不做规则编辑发布或生产公式。"
```

### R184 - ops and system preview pages QA

```yaml
id: R184
module: "本机预览验收"
description: "今日履约、异常预警、时段缺口热力图、供应商管理和规则配置开放后，需要补充 E2E 证据，证明导航可达且边界文案明确。"
source: "F129 ops/system preview batch on 2026-05-16"
submitted_at: "2026-05-16"
version: "1.0"
status: "done"
notes: "E2E 已覆盖五个新页面的标题、records 摘要、导航链接和开发中边界；QA 不扩大到数据库、真实集成、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### R185 - schedule plan CSV import records preview

```yaml
id: R185
module: "排班计划"
description: "排班数据需要支持本机 CSV 导入，并在排班计划页读取 processed records，展示导入后的计划/时段覆盖结果，演示基于现有模块而不是单独演示中心。"
source: "PM correction on 2026-05-17: 坐席主数据、考勤数据、排班数据都可以导入，并在各模块页面展示导入后数据跑的结果"
submitted_at: "2026-05-17"
version: "1.0"
status: "done"
notes: "已新增 schedule_plan 本机 CSV 导入契约和 `/schedule-plans` 排班数据 records 摘要；导入结果只作为 processed records 只读预览，不写入生产排班列表、不做自动排班、不接数据库、真实 WFM/CORN/HR 集成、审批、导出、批量、生产公式、结算或收费因子。"
```

### R186 - schedule plan import QA

```yaml
id: R186
module: "本机验收"
description: "排班数据导入后，需要补充 E2E 证据，证明用户可在文件导入页导入 schedule_plan CSV，并在排班计划页看到导入处理结果。"
source: "F130 schedule plan import records preview on 2026-05-17"
submitted_at: "2026-05-17"
version: "1.0"
status: "done"
notes: "E2E 已覆盖文件导入页排班数据入口、schedule_plan CSV 导入和排班计划页 `排班数据 records` 摘要；QA 不扩大到数据库、真实集成、自动排班、审批、导出、批量、生产公式、结算或收费因子。"
```

### R187 - monthly settlement local preview

```yaml
id: R187
module: "结算复盘"
description: "月度结算需要开放一个本机只读预览页，读取已导入 records 和本地排班/履约上下文，展示可复盘的数据覆盖和风险提示，但不计算生产结算。"
source: "PM approved continuation on 2026-05-17: 结算复盘只读预览边界"
submitted_at: "2026-05-17"
version: "1.0"
status: "done"
notes: "已新增 `/monthly-settlement` 本机只读复盘页，读取 processed records 并展示结算复盘 records、主数据/履约/排班复盘信号、最近批次和边界；不做结算公式、收费因子、锁账、账单金额、审批、导出、批量、数据库或真实集成。"
```

### R188 - monthly settlement preview QA

```yaml
id: R188
module: "本机验收"
description: "月度结算本机只读预览开放后，需要补充 E2E 证据，证明导航可达、records 摘要可见，并且其他结算复盘能力仍保持开发中。"
source: "F131 monthly settlement local preview on 2026-05-17"
submitted_at: "2026-05-17"
version: "1.0"
status: "done"
notes: "E2E 已覆盖导入本机 CSV 后 monthly-settlement 出现 `结算复盘 records` 摘要，并确认月度结算导航可点击、报表中心/供应商复盘/结算锁账仍为开发中；QA 不扩大到数据库、真实集成、审批、导出、批量、生产结算公式、锁账或收费因子。"
```
