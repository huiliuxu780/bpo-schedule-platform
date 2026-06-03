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

### US701 - 独立 CSV 上传工作区

```yaml
id: US701
requirement_ids:
  - R781
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望有独立的 CSV 上传工作区，以便不依赖某个已存在批次也能发起真实导入。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/uploads/new` 展示独立 CSV 上传工作区，复用现有上传表单、模板列表和模板适配提示。"
  - "数据质量列表页提供进入上传工作区的入口，避免上传入口只藏在批次详情页。"
  - "模板详情页在没有来源批次时也能进入上传工作区并携带 `templateId` 预选。"
  - "上传工作区读取 `templateId` 查询参数，默认选中可用模板并提示不可用模板。"
  - "复用现有 `uploadImportCsvAction` 和模板 API，不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US700"
status: "done"
```

### US702 - 独立上传结果回流

```yaml
id: US702
requirement_ids:
  - R782
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望独立上传页在上传后保留结果反馈和新批次入口，以便上传完成后立即进入批次处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "独立上传页提交后成功或失败都回到 `/data-quality/uploads/new`，而不是默认回到数据质量列表页。"
  - "成功反馈展示新批次号，并提供进入该批次处理详情的入口。"
  - "失败反馈保留错误原因和可继续上传的表单。"
  - "批次详情页内原有 CSV 上传表单继续回到数据质量列表页或批次语境，不被独立上传页回流逻辑破坏。"
  - "复用现有 `uploadImportCsvAction`、上传表单和结果反馈模型，不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US701"
status: "done"
```

### US703 - 单批次导入应用写入入口

```yaml
id: US703
requirement_ids:
  - R783
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在批次处理详情页对准备度通过的单个批次执行应用写入，以便上传和修正完成后能进入真实业务数据闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 在准备度 ready 且未应用时展示单批次应用入口。"
  - "应用入口按 file_type 调用现有 apply API：master_data、personnel_schedule、demand_forecast、login_log/status_log。"
  - "应用成功后留在当前批次详情页并展示成功反馈和下一步下游结果提示。"
  - "准备度阻塞、已应用、准备度读取失败或未知文件类型时只展示原因，不提供写入按钮。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US702"
status: "done"
```

### US704 - 批次应用成功结果卡片和下一步入口

```yaml
id: US704
requirement_ids:
  - R784
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在批次应用成功后立刻看到生成的业务版本结果卡片和下一步入口，以便明确当前批次已经落到了哪里、下一步该看什么。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 在应用成功后的当前批次语境展示结果卡片，明确应用目标、生成版本、应用时间或当前可见写入状态。"
  - "结果卡片根据 file_type 给出下一步入口，能继续进入已有下游结果追踪、结果列表或复核工作区，而不是只停留在通用成功提示。"
  - "未应用、应用失败、readiness 阻塞或应用摘要缺失时维持只读说明，不误报为已生成业务版本。"
  - "复用现有批次详情、应用摘要、readiness 和下游结果查询能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US703"
status: "done"
```

### US705 - 已应用批次版本结果定位链路

```yaml
id: US705
requirement_ids:
  - R785
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望从已应用批次直接进入对应版本的结果上下文，以便继续查看该版本已有的对比结果、复核案例和空态。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "已应用批次可从当前批次页进入对应版本详情或结果列表，不需要手动拼接 API 或回到其他页面重新检索。"
  - "版本结果视图明确当前版本 ID、来源批次、应用目标和已有下游结果状态。"
  - "无结果、结果读取失败或版本上下文不完整时展示清晰空态/阻塞态，不误导为已有计算结论。"
  - "优先复用现有 comparison runs、review cases 和批次详情能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US704"
status: "done"
```

### US706 - 版本结果页本地比对计算受控入口

```yaml
id: US706
requirement_ids:
  - R786
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在版本结果页受控地发起一次本地比对计算，以便不用离开当前版本语境也能生成新的对比结果。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本结果页只在来源版本和 comparison_type 足够明确时展示受控 `发起本地比对` 入口。"
  - "提交后在当前版本结果语境展示成功/失败反馈，并提供进入新 comparison run 详情或结果列表的入口。"
  - "来源版本缺失、类型不支持或现有上下文不足时只展示阻塞原因，不展示写入按钮。"
  - "复用现有 comparison calculate API 和结果查询能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算、自动排班或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US705"
status: "done"
```

### US707 - 业务版本工作台只读台账页

```yaml
id: US707
requirement_ids:
  - R787
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在数据质量下有一个只读业务版本台账页，以便不逐个打开批次也能扫描主数据、排班、预测和登录/状态日志当前各自的版本上下文。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/versions` 展示只读业务版本台账，至少覆盖主数据、人员排班、需求预测和登录/状态日志四类业务域。"
  - "每行至少展示数据域、当前版本、来源批次、当前可见时间、状态和阻塞摘要，并给出基础下一步入口。"
  - "无当前版本、未应用或信息不完整时展示明确 empty/blocked 状态，不假装已有版本。"
  - "数据质量导航提供进入版本工作台的入口；本轮不新增稳定 comparison run / review case 深链，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US706"
status: "done"
```

### US708 - 业务版本工作台稳定跳转链路

```yaml
id: US708
requirement_ids:
  - R788
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望从版本工作台的当前版本行直接进入批次详情、结果追踪或对应对比运行，以便继续处理而不是回列表重新检索。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本工作台对已定位上下文的行提供稳定的批次详情、结果追踪或 comparison run 跳转。"
  - "上下文不足时只展示阻塞说明，不提供误导性深链。"
  - "复用现有 data-quality 页面和本地查询能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US707"
status: "done"
```

### US709 - 业务版本工作台下游影响摘要

```yaml
id: US709
requirement_ids:
  - R789
module: "导入中心"
role: "运营复核负责人"
story: "作为运营复核负责人，我希望在版本工作台一眼看到当前版本已经影响了多少对比运行和复核案例，以便判断下一步该去哪里继续追踪。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本工作台为当前版本行补 comparison run / review case 的只读影响摘要。"
  - "没有下游结果或上下文不完整时展示明确空态或阻塞态。"
  - "复用现有 comparison runs、review cases 和批次上下文能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US708"
status: "done"
```

### US710 - 结果追踪中的最新运行回看卡片

```yaml
id: US710
requirement_ids:
  - R790
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在当前批次的结果追踪里直接看到刚刚生成的最新一次本地比对运行摘要，以便不用立刻跳页也能先判断这次运行是否值得继续看。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "本地比对成功回跳到结果追踪后，页面展示当前版本语境下的最新运行结果卡片。"
  - "卡片至少展示运行 ID、对比口径、结果规模、关键差异和进入 comparison run detail / 结果列表的入口。"
  - "运行暂未回显时展示明确阻塞态，不假装已经拿到完整结果。"
  - "复用现有 comparison run 列表和成功回跳 query 参数，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US709"
status: "done"
```

### US711 - comparison run detail 结果回看主页强化

```yaml
id: US711
requirement_ids:
  - R791
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望进入 comparison run detail 后能明确知道这就是当前版本语境下的完整结果回看页，以便放心在这里继续检查结果明细。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从结果追踪进入 comparison run detail 时，页面明确这是当前版本语境下的完整结果回看主页。"
  - "页面强化来源版本、业务日和回看语义，不要求新增写入动作。"
  - "复用现有 comparison run detail 查询与页面结构，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US710"
status: "done"
```

### US712 - comparison run detail 回跳闭环

```yaml
id: US712
requirement_ids:
  - R792
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在 comparison run detail 看完完整结果后能稳定回到来源批次的结果追踪或版本工作台，以便这条链路形成真正闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "comparison run detail 提供回到来源批次结果追踪和版本工作台的稳定返回入口。"
  - "来源批次或版本语境不足时展示清晰阻塞态，不伪造回跳。"
  - "复用现有批次、版本工作台和 comparison run detail 页面，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US711"
status: "done"
```

### US700 - 字段映射模板上传预选链路

```yaml
id: US700
requirement_ids:
  - R780
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望从字段映射模板详情页直接带着该模板进入上传工具，以便创建或维护模板后能马上用于 CSV 上传。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "模板详情页对启用模板提供 `用此模板上传` 入口，跳转到批次处理页的导入与模板工具区。"
  - "批次处理页读取 `templateId` 查询参数，并传入 CSV 上传表单。"
  - "CSV 上传表单默认选中该模板，并展示预选模板提示；停用或不存在的模板不误报为可用。"
  - "复用现有 `template_id` 上传能力，不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US699"
status: "done"
```

### US682 - 复核案例关闭写入入口

```yaml
id: US682
requirement_ids:
  - R762
module: "导入中心"
role: "主管"
story: "作为主管，我希望能在复核案例详情页对已具备证据和结论的 open 案例执行受控关闭写入，以便形成真实处理记录，而不是只停留在只读预览。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`POST /api/v1/review-cases/write-closure` 能对已存在且未关闭的复核案例写入 closure，并返回带 closure 的详情。"
  - "重复提交同一已关闭案例返回已有 closed detail，不重复写入 closure。"
  - "`/data-quality/review-cases/[caseId]` 对有证据、有结论且未关闭的案例展示受控关闭入口。"
  - "关闭入口提交当前案例、已有证据、已有结论和 closure payload 到现有本地 API，成功后在页面显示已关闭状态。"
  - "读取失败、已关闭、缺少证据或缺少结论时不展示可提交关闭按钮，只展示阻塞原因。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做证据补录、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US681"
status: "done"
```

### US684 - 复核案例结论补充写入入口

```yaml
id: US684
requirement_ids:
  - R764
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页对未关闭案例补充复核结论，以便证据补齐后能形成可关闭的处理链路。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`POST /api/v1/review-cases/{case_id}/conclusion` 能对已存在且未关闭的复核案例新增一条 conclusion，并返回带最新 conclusion 列表的详情。"
  - "已关闭案例、case_id 不匹配或重复 conclusion_id 时返回明确错误，不写入新结论。"
  - "`/data-quality/review-cases/[caseId]` 对未关闭案例展示受控结论补充入口。"
  - "结论补充入口提交 conclusion_type、risk_level、conclusion_text 和 decided_by 到本地 API，成功后回到当前详情页并显示最新结论。"
  - "读取失败或已关闭时不展示可提交结论按钮，只展示阻塞原因。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US683"
status: "done"
```

### US683 - 复核案例证据补录写入入口

```yaml
id: US683
requirement_ids:
  - R763
module: "导入中心"
role: "主管"
story: "作为主管，我希望能在复核案例详情页对未关闭案例补充一条证据，以便材料不足时先补齐处理依据，再进入关闭。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`POST /api/v1/review-cases/{case_id}/evidence` 能对已存在且未关闭的复核案例新增一条 evidence，并返回带最新 evidence 列表的详情。"
  - "已关闭案例、case_id 不匹配或重复 evidence_id 时返回明确错误，不写入新证据。"
  - "`/data-quality/review-cases/[caseId]` 对未关闭案例展示受控证据补录入口。"
  - "证据补录入口提交 evidence_type、evidence_uri、submitted_by 和 note 到现有本地 API，成功后回到当前详情页并显示最新证据。"
  - "读取失败或已关闭时不展示可提交补录按钮，只展示阻塞原因。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做结论新增、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US682"
status: "done"
```

## DAG Rules

- 每条用户故事必须关联至少一条原始需求。
- `dependencies` 只能引用已经存在的用户故事、决策或口径确认项。
- 若发现循环依赖，相关故事必须标记为 `blocked`。
- 涉及结算公式、状态码、权限、导出、批量操作或真实数据来源时，必须先生成 PM 确认问题。

## Stories

### US620 - Q127 数据库基础 QA 收口

```yaml
id: US620
requirement_ids:
  - R697
  - R698
  - R699
  - R700
task_ids:
  - Q127
module: "质量与交付"
role: "PM"
story: "作为 PM，我希望 DB002-DB008 的数据库基础经过一次 QA 收口，以便确认生产持久化雏形已形成可迁移、可读回、可追溯的闭环。"
task_type: "qa"
priority: "P0"
acceptance:
  - "验证 Alembic head 能创建 DB002-DB008 全部基础表。"
  - "验证最小端到端链路可从导入批次走到复核关闭记录。"
  - "输出 QA 结论，明确已完成、未完成和仍禁止混入范围。"
  - "不修改产品行为、数据库 schema、repository 实现、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB008
status: "done"
completed_scope:
  - "新增 database foundation QA closeout 测试。"
  - "验证 Alembic head 能创建 DB002-DB008 全部基础表。"
  - "验证最小端到端链路可从导入/版本记录走到复核关闭记录。"
  - "输出数据库基础 QA 收口结论文档。"
```

### US619 - DB008 复核闭环记录持久化基础

```yaml
id: US619
requirement_ids:
  - R693
  - R694
  - R695
  - R696
task_ids:
  - DB008
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望主管复核 case、证据、结论和关闭记录可以持久化并引用对比结果，以便后续异常闭环从只读判断进入可追溯处理记录。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 review cases、review evidence、review conclusions 和 review closures。"
  - "校验来源 comparison result 类型和 result id 引用。"
  - "测试覆盖证据、结论、关闭记录读取、缺失来源拒绝、来源类型不匹配拒绝和重复关闭拒绝。"
  - "不实现审批流、权限、批量关闭、导出、真实外部证据服务、生产状态码、结算或收费因子。"
dependencies:
  - DB007
status: "done"
completed_scope:
  - "持久化 review cases、review evidence、review conclusions 和 review closures。"
  - "校验 forecast_schedule/schedule_actual 来源 result id、来源类型和业务日一致性。"
  - "测试覆盖证据、结论、关闭记录读取、缺失来源拒绝、来源类型不匹配拒绝、业务日不一致拒绝和重复关闭拒绝。"
```

### US618 - DB007 对比结果持久化基础

```yaml
id: US618
requirement_ids:
  - R689
  - R690
  - R691
  - R692
task_ids:
  - DB007
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望预测 vs 排班、排班 vs 实际的结果可以持久化并保留来源引用，以便后续异常生成和复核闭环有可复跑基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 comparison runs、forecast-vs-schedule results 和 schedule-vs-actual results。"
  - "校验 forecast version、schedule version、actual import version 和来源记录引用。"
  - "测试覆盖结果状态、差异数值、来源引用、缺失引用拒绝和重复 run 读取。"
  - "不实现真实计算调度、异常复核写入、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB006
status: "done"
completed_scope:
  - "持久化 comparison runs、forecast-vs-schedule results 和 schedule-vs-actual results。"
  - "校验 forecast version、schedule version、actual status import version 和来源记录版本归属。"
  - "测试覆盖结果读取、缺失源版本拒绝、非 status_log 拒绝、跨版本来源拒绝和来源维度不一致拒绝。"
```

### US617 - DB006 登录/状态日志持久化基础

```yaml
id: US617
requirement_ids:
  - R685
  - R686
  - R687
  - R688
task_ids:
  - DB006
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望登录和状态日志完成事件、区间、业务日和状态字典持久化，以便后续排班 vs 实际状态对比有稳定实际基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 login events、status dictionary 和 status intervals。"
  - "校验 import version、employee 和状态字典引用。"
  - "测试覆盖跨天区间切分、业务日、时区校验和未知状态拒绝。"
  - "不实现预测/排班对比、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB005
status: "done"
completed_scope:
  - "持久化 login events、status dictionary 和 status intervals。"
  - "校验 login_log/status_log import version、employee 和状态字典引用。"
  - "测试覆盖跨天业务日切分、Asia/Shanghai 时区校验、冻结员工拒绝和未知状态拒绝。"
```

### US616 - DB005 需求预测持久化基础

```yaml
id: US616
requirement_ids:
  - R681
  - R682
  - R683
  - R684
task_ids:
  - DB005
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望需求预测完成版本、0.5h 预测行和技能等级需求持久化，以便后续预测 vs 排班对比有稳定需求基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 forecast versions、forecast interval rows 和 version change records。"
  - "校验 import version、workplace、project 和 skill 引用。"
  - "测试覆盖 0.5h 时段、技能等级需求、版本变更追踪、冻结/缺失引用拒绝和无效时间范围拒绝。"
  - "不实现登录/状态日志、对比结果、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB004
status: "done"
completed_scope:
  - "持久化 forecast versions、forecast interval rows 和 version change records。"
  - "校验 import version、workplace、project 和 skill 引用。"
  - "测试覆盖 0.5h 时段、技能等级需求、版本变更追踪、冻结技能拒绝和非 0.5h 时段拒绝。"
```

### US615 - DB004 人员级排班持久化基础

```yaml
id: US615
requirement_ids:
  - R677
  - R678
  - R679
  - R680
task_ids:
  - DB004
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望人员级排班完成版本、明细、班次引用和 0.5h 展开持久化，以便后续预测对比和登录状态对比有稳定排班基线。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 schedule versions、shift types、personnel schedule details 和 half-hour intervals。"
  - "校验 import version、employee、workplace、project、skill 和 shift type 引用。"
  - "测试覆盖 0.5h 展开、冻结/缺失引用拒绝和无效时间范围拒绝。"
  - "不实现需求预测、登录/状态日志、对比结果、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB003
status: "done"
completed_scope:
  - "持久化 schedule versions、shift types、personnel schedule details 和 half-hour intervals。"
  - "校验 import version、employee、workplace、project、skill、employee binding 和 shift type 引用。"
  - "测试覆盖 0.5h 展开、冻结班次类型拒绝和无效时间范围拒绝。"
```

### US614 - DB003 主数据持久化基础

```yaml
id: US614
requirement_ids:
  - R673
  - R674
  - R675
  - R676
task_ids:
  - DB003
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望主数据先完成坐席、职场、供应商、项目、技能和绑定关系的持久化，以便后续人员排班、预测和日志对比都能引用稳定主数据。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "持久化 employees, suppliers, workplaces, projects, skills。"
  - "持久化 employee bindings，覆盖 employee/supplier/workplace/project/skill 引用。"
  - "支持有效期、冻结状态和引用校验。"
  - "不实现人员排班、预测、登录/状态日志、异常复核、权限、审批、导出、批量、生产公式、结算或收费因子。"
dependencies:
  - DB002
status: "done"
completed_scope:
  - "持久化 employees, suppliers, workplaces, projects, skills。"
  - "持久化 employee bindings。"
  - "测试覆盖新 repository 读取、冻结状态拒绝和 import batch 来源引用。"
```

### US613 - DB002 导入持久化基础

```yaml
id: US613
requirement_ids:
  - R669
  - R670
  - R671
  - R672
task_ids:
  - DB002
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望使用已确认的 PostgreSQL/SQLAlchemy/Alembic 口径实现导入批次持久化基础，以便后续主数据、排班、预测和状态日志都有可追溯的导入来源。"
task_type: "database-persistence"
priority: "P0"
acceptance:
  - "明确数据库引擎。"
  - "明确是否允许 package/lockfile 变更。"
  - "明确 ORM、migration 工具和测试数据库方案。"
  - "实现范围只包含导入批次、导入行结果、失败行明细和导入生成版本记录。"
dependencies:
  - DB001
status: "done"
confirmed_database_engine: "PostgreSQL"
confirmed_orm: "SQLAlchemy"
confirmed_migration_tool: "Alembic"
confirmed_test_database: "isolated local test database"
package_change_allowed: true
completed_scope:
  - "导入批次记录。"
  - "导入行结果、失败行明细和错误原因。"
  - "导入生成版本记录。"
  - "Alembic migration 和 backend persistence tests。"
```

### US612 - 数据库 Gate 规划

```yaml
id: US612
requirement_ids:
  - R665
  - R666
  - R667
  - R668
task_ids:
  - DB001
module: "生产持久化"
role: "PM"
story: "作为 PM，我希望先确认数据库 Gate 的边界、首批落库顺序和实施计划，以便后续数据库开发不混入权限、审批、导出、批量和结算等生产能力。"
task_type: "database-planning"
priority: "P0"
acceptance:
  - "数据库 Gate 文档明确允许、禁止和硬停项。"
  - "首批落库顺序从导入批次、失败行和版本记录开始。"
  - "后续数据库实现拆成可逐步执行的 DB002+ 任务。"
  - "本轮不创建数据库连接、ORM、migration、schema、生产持久化配置或新依赖。"
dependencies: []
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

### US621 - 真实导入中心 CSV 上传 API 第一刀

```yaml
id: US621
requirement_ids:
  - R701
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望通过 API 上传 CSV 内容并配置字段映射，以便系统生成可追溯的导入批次、行级错误和 import version。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI CSV 上传入口，接收 text/csv 请求体和导入元数据。"
  - "字段映射能把源列映射为标准字段，并把每行原始数据写入导入行结果。"
  - "缺少必填字段的行会被标为 failed，并记录 error_field、error_code 和 error_message。"
  - "导入完成后生成 import batch、row results、failed rows 和 import version。"
  - "不新增依赖，不实现 multipart/Excel，不接外部系统，不做权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US620"
status: "done"
```

### US622 - 主数据导入应用到 DB003 repository

```yaml
id: US622
requirement_ids:
  - R702
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望把已上传的 master_data CSV 成功行应用到主数据 repository，以便员工、供应商、职场、项目、技能和绑定关系进入生产雏形数据链路。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 主数据导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 master_data 的批次应用到主数据。"
  - "成功行根据 record_type 写入 suppliers、workplaces、projects、skills、employees 和 bindings。"
  - "绑定关系继续复用 DB003 引用校验和冻结校验。"
  - "不新增 schema/migration，不做 CRUD UI、权限、审批、导出、批量或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US621"
status: "done"
```

### US623 - 人员排班导入应用到 DB004 repository

```yaml
id: US623
requirement_ids:
  - R703
module: "导入中心"
role: "排班管理员"
story: "作为排班管理员，我希望把已上传的 personnel_schedule CSV 成功行应用到人员排班 repository，以便生成可追溯的人员排班版本、班次类型、排班明细和 0.5h 区间。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 人员排班导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 personnel_schedule 的批次应用到人员排班。"
  - "成功行根据 record_type 写入 shift types 和 personnel schedule details。"
  - "应用后生成 schedule version，并复用 DB004 0.5h 展开、主数据引用、绑定和冻结校验。"
  - "不新增 schema/migration，不做排班维护 UI、发布/冻结、权限、审批、导出、批量调班或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US622"
status: "done"
```

### US624 - 需求预测导入应用到 DB005 repository

```yaml
id: US624
requirement_ids:
  - R704
module: "导入中心"
role: "计划管理员"
story: "作为计划管理员，我希望把已上传的 demand_forecast CSV 成功行应用到需求预测 repository，以便生成可追溯的预测版本、技能/等级需求和 0.5h 预测区间。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 需求预测导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 demand_forecast 的批次应用到需求预测。"
  - "成功行写入 forecast intervals，并生成 forecast version。"
  - "应用后复用 DB005 30 分钟区间、主数据引用、冻结和业务日期校验。"
  - "支持 compared_from_version_id 和 change_reason 形成版本变更记录。"
  - "不新增 schema/migration，不做预测算法、预测 UI、权限、审批、导出、批量或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US623"
status: "done"
```

### US625 - 登录/状态日志导入应用到 DB006 repository

```yaml
id: US625
requirement_ids:
  - R705
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望把已上传的 login_log/status_log CSV 成功行应用到实际日志 repository，以便登录/登出事件、状态字典和状态区间进入可追溯数据链路。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 实际日志导入应用入口，按 batch_id 读取已持久化导入批次。"
  - "仅允许 file_type 为 login_log 或 status_log 的批次应用到实际日志。"
  - "login_log 成功行写入 login/logout events，并复用 DB006 import version、employee 和时区校验。"
  - "status_log 成功行可根据 record_type 写入 status dictionary 或 status intervals，并复用 DB006 字典、跨天切分、业务日、employee 和时区校验。"
  - "不新增 schema/migration，不接 CORN/HR/WFM，不做状态码生产规则、权限、审批、导出、批量或外部集成。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US624"
status: "done"
```

### US626 - 对比计算触发到 DB007 repository

```yaml
id: US626
requirement_ids:
  - R706
module: "对比计算"
role: "运营负责人"
story: "作为运营负责人，我希望触发 forecast vs schedule 和 schedule vs actual 的本地对比计算，以便系统从已导入的预测、排班、实际状态生成可复核的异常结果。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 对比计算入口，接收 comparison_type 和来源版本。"
  - "forecast_vs_schedule 基于 DB005 forecast intervals 与 DB004 schedule intervals 聚合生成 gap 结果。"
  - "schedule_vs_actual 基于 DB004 schedule intervals 与 DB006 productive status intervals 生成 late/matched 结果。"
  - "计算结果写入 DB007 comparison run/results，并复用 DB007 来源版本和结果维度校验。"
  - "不新增 schema/migration，不接外部系统，不做生产状态码/公式定版、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US625"
status: "done"
```

### US627 - 复核闭环写入到 DB008 repository

```yaml
id: US627
requirement_ids:
  - R707
module: "复核闭环"
role: "主管"
story: "作为主管，我希望把对比结果的复核 case、证据、结论和关闭记录写入系统，以便异常处理形成可追溯闭环。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地 FastAPI 复核闭环写入入口，接收 case、可选 evidence、可选 conclusion、可选 closure。"
  - "case 来源必须引用 DB007 forecast_schedule 或 schedule_actual result。"
  - "写入顺序为 case -> evidence -> conclusion -> closure，并返回完整 ReviewCaseDetail。"
  - "复用 DB008 来源结果、业务日、case 存在性和重复关闭校验。"
  - "不新增 schema/migration，不做审批流、权限、批量关闭、导出或外部证据服务。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US626"
status: "done"
```

### US628 - 持久化结果查询 API 收口

```yaml
id: US628
requirement_ids:
  - R708
module: "结果查询"
role: "主管"
story: "作为主管，我希望按对比 run_id 或复核 case_id 读回已持久化的详情，以便后续页面和接口可以消费真实闭环结果，而不是只依赖写入响应。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增 GET /api/v1/comparison-runs/{run_id}，返回 DB007 ComparisonRunDetail。"
  - "新增 GET /api/v1/review-cases/{case_id}，返回 DB008 ReviewCaseDetail。"
  - "查询不存在时返回 404 和稳定错误码。"
  - "不新增 schema/migration，不做模板持久化、前端、外部集成、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US627"
status: "done"
```

### US629 - 持久化结果列表筛选 API 第一刀

```yaml
id: US629
requirement_ids:
  - R709
module: "结果查询"
role: "主管"
story: "作为主管，我希望按业务日、类型、状态和 owner 等条件列出已持久化的对比 run 与复核 case，以便从真实闭环记录中定位需要查看的对象。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增 GET /api/v1/comparison-runs，返回 DB007 ComparisonRunRecord 列表。"
  - "comparison runs 支持 comparison_type、status、business_date 筛选。"
  - "新增 GET /api/v1/review-cases，返回 DB008 ReviewCaseRecord 列表。"
  - "review cases 支持 business_date、owner_id、status、severity、source_result_type 筛选。"
  - "不新增 schema/migration，不做分页、前端、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US628"
status: "done"
```

### US630 - 计算与复核写入幂等重跑保护第一刀

```yaml
id: US630
requirement_ids:
  - R710
module: "结果写入"
role: "主管"
story: "作为主管，我希望重复触发相同对比计算或复核关闭写入时系统直接返回已有结果，以免重复点击造成重复写入或错误噪音。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "重复调用 POST /api/v1/comparison-runs/calculate 且 run_id 已存在时，返回已有 ComparisonRunDetail。"
  - "重复调用 POST /api/v1/review-cases/write-closure 且 case_id 已存在时，返回已有 ReviewCaseDetail。"
  - "重复请求不新增 comparison results、review evidence、review conclusions 或 review closures。"
  - "保留原有缺失引用和非法请求校验。"
  - "不新增 schema/migration，不做导入 apply 重跑、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US629"
status: "done"
```

### US631 - 主数据导入应用幂等重跑保护第一刀

```yaml
id: US631
requirement_ids:
  - R711
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望同一个 master_data 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复写入逻辑和操作噪音。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-master-data 返回 applied_status=applied。"
  - "同一 master_data batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 master data snapshot 写入。"
  - "保留非 master_data 批次、缺失字段和引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US630"
status: "done"
```

### US632 - 人员排班导入应用幂等重跑保护第一刀

```yaml
id: US632
requirement_ids:
  - R712
module: "导入中心"
role: "排班管理员"
story: "作为排班管理员，我希望同一个 personnel_schedule 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复版本、明细和 0.5h interval 写入。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-personnel-schedule 返回 applied_status=applied。"
  - "同一 personnel_schedule batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 schedule version、shift type、schedule detail 或 0.5h interval 写入。"
  - "保留非 personnel_schedule 批次、缺失字段、导入版本和主数据引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US631"
status: "done"
```

### US633 - 需求预测导入应用幂等重跑保护第一刀

```yaml
id: US633
requirement_ids:
  - R713
module: "导入中心"
role: "计划管理员"
story: "作为计划管理员，我希望同一个 demand_forecast 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复预测版本、预测明细和变更记录写入。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-forecast 返回 applied_status=applied。"
  - "同一 demand_forecast batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 forecast version、forecast interval 或 forecast change 写入。"
  - "保留非 demand_forecast 批次、缺失字段、导入版本和主数据引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US632"
status: "done"
```

### US634 - 实际日志导入应用幂等重跑保护第一刀

```yaml
id: US634
requirement_ids:
  - R714
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望同一个 login_log 或 status_log 导入批次重复应用时系统直接返回已应用摘要，以免重复点击造成重复登录事件、状态字典和状态区间写入。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "首次调用 apply-actual-logs 返回 applied_status=applied。"
  - "同一 login_log 或 status_log batch 已应用后再次调用返回 applied_status=already_applied。"
  - "重复调用不再执行 login event、status dictionary 或 status interval 写入。"
  - "保留非 actual log 批次、缺失字段、导入版本、时区和主数据引用校验。"
  - "不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US633"
status: "done"
```

### US635 - 导入批次应用结果查询摘要第一刀

```yaml
id: US635
requirement_ids:
  - R715
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望按导入批次查询当前是否已经应用以及应用到了哪个目标，以便在真实上传/导入闭环中判断下一步动作，而不是只看上传批次本身。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增 GET /api/v1/import-batches/{batch_id}/application-summary。"
  - "返回 batch_id、file_type、application_status、application_target、import_version_id 和 applied_record_count。"
  - "对 master_data、personnel_schedule、demand_forecast、login_log、status_log 复用现有 repository 判断是否已应用。"
  - "查询不存在的 batch 返回 404 和稳定错误码。"
  - "不新增 schema/migration，不做模板持久化、字段映射 CRUD、前端、权限、审批、导出或批量操作。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US634"
status: "done"
```

### US636 - 字段映射模板持久化第一刀

```yaml
id: US636
requirement_ids:
  - R716
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望保存并复用导入字段映射模板，以便同类文件后续上传时不必重复手工传完整字段映射。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增字段映射模板持久化表和 Alembic migration。"
  - "新增创建、列表、单查字段映射模板 API。"
  - "模板包含 template_id、template_name、file_type、field_mapping、created_by、created_at 和 is_active。"
  - "upload-csv 支持 template_id 复用模板，同时保留直接 field_mapping JSON 上传。"
  - "缺失模板返回稳定错误码；重复模板 ID 返回稳定冲突错误码。"
  - "不做前端、Excel/multipart、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US635"
status: "done"
```

### US637 - 导入失败行修正第一刀

```yaml
id: US637
requirement_ids:
  - R717
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望修正导入批次中的单条失败行，以便不用重新上传整批文件也能把可修复数据推进到后续应用流程。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增失败行修正 API，可按 batch_id 和 row_number 修正 failed row。"
  - "修正请求写入 corrected standard_fields，将 row_status 改为 success，清空 error_field/error_code/error_message，并设置 source_key。"
  - "修正后重算 import batch success_rows、failed_rows、warning_rows 和 processing_status。"
  - "只允许修正 failed row；不存在 batch、row 或非 failed row 返回稳定错误码。"
  - "不新增 schema/migration，不做修正历史表、前端、批量修正、自动 apply、Excel/multipart、权限、审批、导出、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US636"
status: "done"
```

### US638 - 导入批次列表与应用状态查询第一刀

```yaml
id: US638
requirement_ids:
  - R718
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望看到导入批次列表中的上传结果、版本数量和应用状态，以便判断哪些批次还需要修正、应用或复核。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增导入批次列表查询 API。"
  - "列表行返回批次基础信息、成功/失败/警告计数、版本数和应用状态摘要。"
  - "支持按 file_type、processing_status、uploaded_by 和 application_status 进行只读过滤。"
  - "复用现有 import batch、version 和 application-summary 判断，不新增 schema/migration。"
  - "不做前端、分页、导出、批量、权限、审批、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US637"
status: "done"
```

### US639 - 字段映射模板更新与停用第一刀

```yaml
id: US639
requirement_ids:
  - R719
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望修正或停用字段映射模板，以便错误模板不会继续被上传流程复用。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增字段映射模板更新 API，可更新 template_name 和 field_mapping。"
  - "新增字段映射模板停用 API，将模板置为 inactive。"
  - "停用模板不再出现在列表/单查中，upload-csv 按 template_id 复用时返回缺失模板错误。"
  - "不存在模板时返回稳定错误码。"
  - "不新增 schema/migration，不做前端、物理删除、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US638"
status: "done"
```

### US640 - 导入批次应用前就绪校验第一刀

```yaml
id: US640
requirement_ids:
  - R720
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在应用导入批次前看到明确的就绪状态和阻塞原因，以便先处理失败行、缺失版本或已应用批次，而不是盲目点击应用。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增导入批次应用前只读就绪校验 API。"
  - "返回 batch_id、file_type、readiness_status、阻塞原因、失败行数、成功行数、版本数和应用状态摘要。"
  - "存在 failed rows、无成功行、无导入版本、已应用批次时返回 blocked。"
  - "不存在批次时返回稳定错误码。"
  - "不新增 schema/migration，不做自动 apply、前端、深度主数据校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US639"
status: "done"
```

### US641 - 导入批次应用前行级字段预检第一刀

```yaml
id: US641
requirement_ids:
  - R721
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入批次应用前看到成功行的字段级阻塞原因，以便先修正缺字段数据再执行应用。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "apply-readiness 返回 row_blockers 行级阻塞列表。"
  - "成功行缺少当前 file_type/record_type 所需标准字段时返回 blocked。"
  - "行级阻塞包含 row_number、code、field_name 和 message。"
  - "干净批次仍返回 ready 且 row_blockers 为空。"
  - "不新增 schema/migration，不做自动 apply、前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US640"
status: "done"
```

### US642 - 导入应用前 readiness 安全闸第一刀

```yaml
id: US642
requirement_ids:
  - R722
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望导入应用接口在写入前自动拦截未就绪批次，以便缺字段或缺版本的数据不会进入业务表。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "apply-master-data 与 apply-forecast 在写入前复用 apply-readiness 结果。"
  - "未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY` 错误，并包含 readiness 详情。"
  - "已应用批次继续返回现有 already_applied 幂等响应，不被 readiness 安全闸改成错误。"
  - "不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US641"
status: "done"
```

### US643 - 人员排班与实际日志应用前 readiness 安全闸第一刀

```yaml
id: US643
requirement_ids:
  - R723
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望人员排班和实际日志导入应用也在写入前自动拦截未就绪批次，以便四类导入应用口径一致。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "apply-personnel-schedule 与 apply-actual-logs 在写入前复用 apply-readiness 结果。"
  - "未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY` 错误，并包含 readiness 详情。"
  - "已应用批次继续返回现有 already_applied 幂等响应，不被 readiness 安全闸改成错误。"
  - "不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、后端测试、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US642"
status: "done"
```

### US644 - 导入中心前端 API 接入第一刀

```yaml
id: US644
requirement_ids:
  - R724
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在前端导入中心看到真实 API 返回的导入批次和应用准备度，以便不用只看本地静态展示就能判断批次是否需要修正或应用。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增或接通 `/data-quality` 前端页面，页面从本地 FastAPI `GET /api/v1/import-batches` 读取导入批次列表。"
  - "选中批次后只读调用 `GET /api/v1/import-batches/{batch_id}/apply-readiness`，展示 readiness、阻塞项和行级阻塞。"
  - "侧边栏数据与集成下的文件导入、接入批次、数据质量入口指向 `/data-quality` 并具备当前选中态。"
  - "页面具备加载、空数据和 API 错误状态，不使用新增静态业务样例代替 API 结果。"
  - "不新增依赖，不修改 package/lockfile，不做上传写入、apply 写操作、审批、导出、批量、权限、外部集成、schema/migration、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和浏览器 smoke 通过。"
dependencies:
  - "US643"
status: "done"
```

### US645 - 导入中心 CSV 上传表单第一刀

```yaml
id: US645
requirement_ids:
  - R725
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心页面选择本地 CSV 文件并提交到现有上传 API，以便真实生成导入批次而不是只看空列表。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 页面新增 CSV 上传表单，可提交 batch_id、file_name、file_type、uploaded_by、业务日期和 field_mapping JSON。"
  - "上传表单读取本地 CSV 文件内容，通过 Next server action 调用现有 `POST /api/v1/import-batches/upload-csv`，成功后跳转到新 batch。"
  - "上传失败返回 `/data-quality?upload=failed` 并展示错误状态，不吞掉 API 错误。"
  - "上传成功后仍复用现有批次列表和 apply-readiness 读取，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做 Excel/multipart、apply 写操作、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和本地上传 smoke 通过。"
dependencies:
  - "US644"
status: "done"
```

### US646 - 导入中心失败行列表与单行修正 UI 第一刀

```yaml
id: US646
requirement_ids:
  - R726
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心页面看到失败行明细并提交单行修正，以便上传后可以直接完成错误行闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 读取选中批次 detail，并展示 failed_rows 列表。"
  - "每条失败行展示 row_number、error_field、error_code、error_message 和 raw_data/standard_fields 摘要。"
  - "每条失败行提供单行修正表单，通过 Next server action 调用现有 `POST /api/v1/import-batches/{batch_id}/rows/{row_number}/correct`。"
  - "修正成功后回到当前 batch 并展示成功状态，继续复用批次列表和 apply-readiness。"
  - "不新增依赖，不修改 package/lockfile，不做批量修正、apply 写按钮、后端、schema/migration、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和本地修正 smoke 通过。"
dependencies:
  - "US645"
status: "done"
```

### US647 - 导入中心字段映射模板选择第一刀

```yaml
id: US647
requirement_ids:
  - R727
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望上传 CSV 时可以选择已有字段映射模板，以便复用稳定映射并减少每次手填 JSON 的错误。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 读取现有 field mapping templates 列表，并在 CSV 上传表单展示模板选择。"
  - "上传表单选择模板后提交 template_id 到现有 upload-csv API。"
  - "无模板或模板 API 异常时仍保留手填 field_mapping JSON 上传路径。"
  - "模板列表展示模板名称、类型和映射摘要，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做模板 CRUD UI、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和本地模板上传 smoke 通过。"
dependencies:
  - "US646"
status: "done"
```

### US648 - 导入中心批次明细 drilldown 第一刀

```yaml
id: US648
requirement_ids:
  - R728
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在选中导入批次后看到版本、全部行结果和字段预览，以便不用离开页面就能判断批次内容和下一步处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示 persisted detail drilldown。"
  - "明细展示批次行状态分布、版本列表、全部行结果和 standard_fields/raw_data 预览。"
  - "明细 API 异常或无批次时展示空/错误状态，不新增静态业务样例。"
  - "只读展示，不新增 apply 写按钮、批量修正、模板 CRUD、后端、schema/migration、导出、权限、审批、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US647"
status: "done"
```

### US649 - 导入中心失败行修正结果反馈打磨

```yaml
id: US649
requirement_ids:
  - R729
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望失败行修正后看到明确的成功/失败结果、剩余失败行数量和下一步提示，以便判断还要继续修正还是回到批次准备度检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 在单行修正成功后展示可读结果摘要。"
  - "结果摘要展示修正行号、剩余失败行数量和下一步处理提示。"
  - "修正失败时把常见失败原因翻译成业务可读说明。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、批量修正、apply 写按钮、模板 CRUD、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US648"
status: "done"
```

### US650 - 导入中心字段映射模板只读管理可见性

```yaml
id: US650
requirement_ids:
  - R730
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心看到字段映射模板库存、状态和覆盖范围，以便判断当前模板是否足够支撑不同文件类型的后续上传。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 展示字段映射模板只读管理面板。"
  - "面板展示模板总数、启用/停用数量、覆盖文件类型数量和映射字段数量。"
  - "每个模板展示文件类型、状态、创建人、创建时间和字段映射摘要。"
  - "模板 API 异常或无模板时展示空/错误状态，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做模板新增/编辑/停用按钮、后端、schema/migration、审批、导出、权限、批量、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US649"
status: "done"
```

### US651 - 导入中心上传前模板适配提示

```yaml
id: US651
requirement_ids:
  - R731
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望上传 CSV 前看到各文件类型的模板适配情况和兜底路径，以便选择正确模板或改用手填字段映射 JSON。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 上传区展示模板适配提示。"
  - "提示展示各文件类型的启用模板数、推荐模板说明、映射字段数量和手填 JSON 兜底。"
  - "无匹配模板或模板 API 异常时展示可读提示，不新增静态业务样例。"
  - "移除 `/data-quality` 路由级 loading fallback，避免 in-app browser 停在骨架屏看不到主内容。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、模板 CRUD、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US650"
status: "done"
```

### US652 - 导入中心应用前行动建议

```yaml
id: US652
requirement_ids:
  - R732
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在应用写入前看到明确行动建议，以便根据失败行、行级缺字段、版本和已应用状态决定下一步。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示应用前行动建议。"
  - "建议区根据 readiness、失败行、行级缺字段、版本和已应用状态输出下一步。"
  - "准备度 API 异常或无批次时展示可读兜底提示。"
  - "只读展示，不新增 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US651"
status: "done"
```

### US653 - 导入中心异常态处理建议

```yaml
id: US653
requirement_ids:
  - R733
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在导入中心看到批次、准备度和模板读取异常的统一处理建议，以便先处理前置问题再继续上传、修正或应用前复核。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 展示导入中心异常态处理建议。"
  - "建议区覆盖批次 API 异常、准备度 API 异常、模板 API 异常、暂无批次和暂无模板。"
  - "无异常时展示可继续处理的只读提示。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US652"
status: "done"
```

### US654 - 导入中心上传结果批次入口

```yaml
id: US654
requirement_ids:
  - R734
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望 CSV 上传成功或失败后看到明确的批次入口和下一步处理提示，以便上传后直接进入批次、失败行和准备度检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality?upload=success&batch=...` 展示上传成功后的批次入口和下一步。"
  - "`/data-quality?upload=failed&reason=...&batch=...` 展示失败原因、批次回看入口和重试建议。"
  - "结果提示能指向接入批次、失败行/批次明细和应用准备度，不新增真实 apply 写按钮。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US653"
status: "done"
```

### US655 - 导入中心接入批次筛选

```yaml
id: US655
requirement_ids:
  - R735
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在接入批次列表按文件类型、处理状态、应用状态和关键词筛选上传历史，以便快速定位需要复核或修正的批次。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 接入批次列表提供关键词、文件类型、处理状态和应用状态筛选。"
  - "筛选结果展示匹配数量，并保持批次行可点击进入详情。"
  - "无匹配结果时展示可读空态，不新增静态业务样例。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US654"
status: "done"
```

### US656 - 导入中心选中批次处理导览

```yaml
id: US656
requirement_ids:
  - R736
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望选中接入批次后看到批次处理导览，并能快速跳到批次明细、失败行修正和应用准备度，以便减少筛选后继续复核的断点。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示只读处理导览。"
  - "导览根据失败行、警告、应用状态和 readiness 输出下一步定位建议。"
  - "批次行点击和导览链接能定位到批次明细、失败行修正或应用准备度区域。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US655"
status: "done"
```

### US657 - 导入中心应用状态概览

```yaml
id: US657
requirement_ids:
  - R737
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望选中批次后看到只读应用状态概览，以便确认应用目标、导入版本、已应用记录数和下一步状态判断。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示只读应用状态概览。"
  - "概览展示应用状态、应用目标、导入版本和已应用记录数。"
  - "概览根据已应用、未应用且可复核、未应用且阻塞、准备度未知输出下一步口径。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US656"
status: "done"
```

### US658 - 导入中心批次明细可读性增强

```yaml
id: US658
requirement_ids:
  - R738
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次明细页能更清楚地解释当前批次处理结果和错误字段，以便不只看到行表，还能快速判断先看版本、失败行还是应用准备度。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 选中批次后，批次明细展示处理摘要和下一步只读建议。"
  - "摘要根据失败行、警告行、版本记录和总行数解释当前批次该先看哪里。"
  - "全部行结果表能直接看到错误字段，降低只看错误码和 JSON 预览的理解成本。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US657"
status: "done"
```

### US659 - 导入中心数据质量到履约异常追踪可见性

```yaml
id: US659
requirement_ids:
  - R739
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在批次明细中看到数据质量问题会影响哪些履约异常判断，以便先修正会阻塞异常闭环的数据问题。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 选中批次后，批次明细展示只读履约异常影响追踪。"
  - "追踪说明按文件类型、失败行、警告行和版本记录解释可能影响的异常判断。"
  - "追踪说明输出异常影响范围、数据问题摘要和下一步复核建议。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US658"
status: "done"
```

### US660 - 导入中心应用结果到下游结果导航

```yaml
id: US660
requirement_ids:
  - R740
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次应用结果能提示下游可查看的对比结果和复核案例入口，以便从导入中心继续追踪真实业务闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 对选中批次展示只读下游结果导航。"
  - "导航根据批次应用状态、文件类型、版本和记录数提示对比结果、复核案例或前置修正路径。"
  - "导航使用现有页面锚点或本地 API 结果路径口径，不新增写入按钮或后端能力。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US659"
status: "done"
```

### US661 - 数据质量页信息架构重构

```yaml
id: US661
requirement_ids:
  - R741
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望数据质量页按工作台、状态检查和分层详情组织，而不是把所有功能纵向堆叠，以便更快完成批次定位、阻塞处理和结果追踪。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 首屏按顶部概览、批次工作台、状态检查器组织，不再把上传、明细、修正全部平铺在主路径。"
  - "批次明细、失败行修正、导入与模板被收纳到分层详情 Tabs。"
  - "`ImportCenterApiPanel` 不再承载全部业务 UI，工作台、状态检查器、概览和详情 Tabs 拆成独立业务组件。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US660"
status: "done"
```

### US662 - 数据质量页下游结果列表可见性

```yaml
id: US662
requirement_ids:
  - R742
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望在数据质量页直接看到选中批次业务日关联的对比结果和复核案例列表，以便从导入批次继续追踪下游业务闭环。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 分层详情新增 `结果追踪` Tab。"
  - "结果追踪按选中批次 `business_date_from` 读取并展示已有 comparison-runs 和 review-cases 列表摘要。"
  - "列表展示只读状态、业务日、来源版本或 owner，并提供已有 API/detail 链接口径。"
  - "无数据或 API 异常时展示清晰空态，不新增写入按钮或后端能力。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US661"
status: "done"
```

### US663 - 数据质量批次处理详情页拆分

```yaml
id: US663
requirement_ids:
  - R743
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望数据质量页只负责定位批次，并把批次明细、失败行修正和结果追踪放到单独批次处理页，以便列表页不再变成长页面。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 只保留批次概览、筛选、批次列表和选中批次状态摘要，不再渲染批次明细、失败行修正、结果追踪和导入模板详情。"
  - "批次列表或状态检查器提供进入 `/data-quality/import-batches/[batchId]` 的详情处理入口。"
  - "新增批次详情页集中展示批次明细、失败行修正、结果追踪、导入与模板，并保留选中批次状态检查。"
  - "修正成功/失败 query 仍能在批次详情页展示，不丢失当前处理反馈。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US662"
status: "done"
```

### US664 - 数据质量批次二级详情导航修正

```yaml
id: US664
requirement_ids:
  - R744
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望数据质量列表页只用于定位批次，并通过真正的二级批次详情页处理状态检查、失败行和结果追踪，以便返回列表和继续处理都更顺滑。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality` 只展示概览、筛选和批次列表，不再渲染选中批次状态检查器。"
  - "批次处理入口进入 `/data-quality/[batchId]`，旧 `/data-quality/import-batches/[batchId]` 可兼容跳转到新二级详情页。"
  - "详情页保留选中批次状态检查器、分层详情、失败行修正、结果追踪和导入模板，并提供返回 `/data-quality?batch=<batchId>` 的列表入口。"
  - "修正成功/失败 query 仍能在二级详情页展示，不丢失当前处理反馈。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US663"
status: "done"
```

### US665 - 数据质量批次详情单列处理流重设计

```yaml
id: US665
requirement_ids:
  - R745
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页按单列处理流程组织，而不是左右分栏，以便状态检查、失败行修正和批次明细都能在全宽工作区内处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 不再使用状态检查器左栏和分层详情右栏的左右分栏。"
  - "详情页在批次头部下方展示处理总览，随后用全宽 Tabs 展示状态检查、失败行修正、批次明细、结果追踪、导入与模板。"
  - "状态检查作为默认工作区 Tab，不再以“选中批次状态检查器”侧栏出现，页面标题不再使用“分层详情”。"
  - "修正成功/失败 query 仍能在详情页展示，不丢失当前处理反馈。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US664"
status: "done"
```

### US666 - 字段映射模板适配详情

```yaml
id: US666
requirement_ids:
  - R746
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页能按当前文件类型说明字段映射模板的适配情况、推荐模板和字段缺口，以便上传和复核前能判断模板是否可用。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的导入与模板页签展示当前批次文件类型的模板适配摘要。"
  - "页面展示推荐启用模板、同类型启用/停用数量、映射字段数、已覆盖标准字段和缺口字段。"
  - "模板卡片展示 source -> standard 字段映射明细，而不是只展示一行摘要。"
  - "无同类型启用模板或模板读取失败时，页面提供只读提示并保留手填字段映射 JSON 作为兜底说明。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、模板 CRUD 写入、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US665"
status: "done"
```

### US667 - 应用准备度问题分组

```yaml
id: US667
requirement_ids:
  - R747
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次状态检查能把应用准备度阻塞按问题类型分组，以便先处理影响应用写入的主要问题。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的状态检查展示应用准备度问题分组。"
  - "问题组覆盖失败行、行级必填字段、版本/应用状态和其他批次阻塞。"
  - "每个问题组展示数量、影响说明、下一步和关键证据。"
  - "无阻塞或已应用状态下也能展示清晰的只读状态说明。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、应用写入、批量处理、审批、导出、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、`git diff --check`、`bash scripts/check.sh` 和页面 smoke 通过。"
dependencies:
  - "US666"
status: "done"
```

### US668 - 批次详情下游结果追踪 drilldown

```yaml
id: US668
requirement_ids:
  - R748
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页的结果追踪能判断当前批次是否已经进入对比和复核闭环，并给出优先查看的下游结果入口。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示下游结果判断。"
  - "未应用、准备度阻塞、无业务日或结果查询失败时，页面展示清晰阻塞原因和下一步入口。"
  - "已有 comparison-runs 或 review-cases 时，页面给出优先查看的对比运行或复核案例、证据和只读 API 入口。"
  - "对比结果和复核案例表保留在详情页结果追踪工作区下方，不回流到列表页。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US667"
status: "done"
```

### US669 - 数据质量到异常反向聚合 drilldown

```yaml
id: US669
requirement_ids:
  - R749
module: "导入中心"
role: "数据管理员"
story: "作为数据管理员，我希望批次详情页能把导入质量问题按字段和错误原因聚合，并关联当前业务日下游异常影响候选，以便先处理影响最大的质量问题。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示质量影响聚合。"
  - "聚合按导入失败/警告行的错误字段和错误原因分组，展示行数、失败/警告构成和主要证据。"
  - "聚合关联当前业务日的 comparison-runs 与 review-cases，说明影响候选、未关闭复核数量和下一步处理建议。"
  - "无质量问题、无批次明细或下游结果为空时展示清晰只读空态，不新增写入按钮。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US668"
status: "done"
```

### US670 - shadcn/ui 自动化验证链路

```yaml
id: US670
requirement_ids:
  - R750
module: "Harness"
role: "前端开发者"
story: "作为前端开发者，我希望 shadcn/ui 约束进入自动化验证链路，以便每次 check 都能阻止新增明显违背 shadcn 规则的 UI 写法。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 自动运行 shadcn/ui 本地约束检查。"
  - "检查不依赖远程 shadcn CLI、网络或新增 npm 依赖。"
  - "检查覆盖 `components.json` 基线、禁止 `space-x/space-y`、禁止项目代码硬编码 Tailwind 色阶、禁止项目代码任意半径。"
  - "历史已存在违例进入 baseline，新增违例会失败。"
  - "脚本自身有 Node test 覆盖通过、失败和 baseline 场景。"
  - "不修改产品 UI，不修改 package/lockfile，不做后端、schema/migration、审批、导出、批量、权限、生产公式、结算或收费因子。"
dependencies:
  - "US669"
status: "done"
```

### US671 - 复核结论预览只读 drilldown

```yaml
id: US671
requirement_ids:
  - R751
module: "导入中心"
role: "主管"
story: "作为主管，我希望批次详情页能把当前下游复核案例汇总成只读结论预览，以便先判断建议结论、证据和残余风险，再决定是否进入后续受控处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示复核结论预览。"
  - "预览根据未关闭复核案例、对比结果、质量问题和读取错误生成建议结论。"
  - "预览展示关键证据、残余风险和下一步，不提供提交、关闭、审批、导出或批量操作。"
  - "无复核案例、结果读取失败或批次未进入下游闭环时展示清晰只读空态。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US670"
status: "done"
```

### US672 - 复核证据缺口只读 drilldown

```yaml
id: US672
requirement_ids:
  - R752
module: "导入中心"
role: "主管"
story: "作为主管，我希望批次详情页能把复核案例的证据缺口按风险、owner 和质量问题展示出来，以便先补齐关键证据再进入后续受控处理。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的结果追踪页签展示复核证据缺口 drilldown。"
  - "缺口根据未关闭复核案例、质量问题、对比结果和读取错误生成风险等级、缺口项、owner 提示和下一步。"
  - "页面展示缺口摘要、关键缺口列表和只读证据提示，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "无复核案例、无缺口或结果读取失败时展示清晰只读空态。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US671"
status: "done"
```

### US673 - 复核案例工作台二级页

```yaml
id: US673
requirement_ids:
  - R753
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例从批次详情页拆成独立二级工作台，以便按 owner、状态、严重度和来源筛选处理，而不是在一个超长详情页里查找。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增 `/data-quality/review-cases` 二级页面，展示复核案例工作台。"
  - "工作台支持业务日、owner、状态、严重度和来源筛选，并展示分组摘要。"
  - "批次详情页的复核证据缺口和结论预览入口跳转到复核案例工作台，而不是继续留在详情页内展开所有处理视图。"
  - "页面只读展示案例、证据缺口、质量线索和下一步，不提供提交、补证据、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US672"
status: "done"
```

### US674 - 质量问题到复核案例聚焦

```yaml
id: US674
requirement_ids:
  - R754
module: "导入中心"
role: "主管"
story: "作为主管，我希望从批次详情里的质量问题直接跳转并聚焦到复核案例工作台，以便快速查看哪些未关闭复核案例可能受该质量问题影响。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/[batchId]` 的质量影响聚合每个问题组提供查看相关复核案例入口。"
  - "入口跳转到 `/data-quality/review-cases`，并带入业务日、未关闭状态、来源类型和关键词焦点。"
  - "`/data-quality/review-cases` 展示当前焦点条件，让主管知道是从哪个质量问题进入。"
  - "页面只读展示，不提供提交、补证据、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US673"
status: "done"
```

### US675 - 复核案例详情页

```yaml
id: US675
requirement_ids:
  - R755
module: "导入中心"
role: "主管"
story: "作为主管，我希望从复核案例工作台进入单个复核案例详情页，以便只读查看来源结果、质量问题、证据缺口和下一步建议，而不是在列表页里塞满所有处理信息。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "新增 `/data-quality/review-cases/[caseId]` 二级详情页，展示单个复核案例详情。"
  - "复核案例工作台列表提供进入详情页的只读入口。"
  - "详情页展示案例摘要、来源结果线索、质量问题焦点、证据缺口和建议下一步。"
  - "页面只读展示，不提供提交、补证据、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US674"
status: "done"
```

### US676 - 复核案例详情正常态数据准备

```yaml
id: US676
requirement_ids:
  - R756
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页能通过本地准备数据展示真实正常态，以便验收从复核列表到单案详情的 DB008 读取链路，而不是只能看到 404 错误态。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "新增本地复核案例 smoke 数据准备 helper，可在空本地 sqlite 库中生成 `CASE-QUERY-001`。"
  - "生成的数据复用现有 DB007/DB008 repository、模型和 schema，不新增 migration/schema。"
  - "重复执行数据准备时返回已存在案例，不重复写入证据、结论或关闭记录。"
  - "准备后的 `/api/v1/review-cases/CASE-QUERY-001` 和 `/data-quality/review-cases/CASE-QUERY-001` 能展示正常详情态。"
  - "不新增依赖，不修改 package/lockfile，不接真实外部接口，不做权限、审批、导出、批量、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US675"
status: "done"
```

### US677 - 复核案例来源结果上下文

```yaml
id: US677
requirement_ids:
  - R757
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页能展示来源对比结果的业务上下文，以便判断案例来自哪个业务日、时段、职场、项目、技能和差异，而不是只看到一个结果编号。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`/api/v1/review-cases/{case_id}` 返回只读 `source_result` 上下文，覆盖 forecast_schedule 和 schedule_actual 来源类型。"
  - "`/data-quality/review-cases/[caseId]` 在独立区块展示来源结果明细，包括业务日、时段、维度和关键差异指标。"
  - "页面保持只读，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US676"
status: "done"
```

### US678 - 复核案例来源链路反查

```yaml
id: US678
requirement_ids:
  - R758
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页继续反查来源计算运行、版本和导入批次，以便判断异常链路来自哪次计算、哪些版本和哪个导入来源。"
task_type: "database-persistence"
priority: "P1"
acceptance:
  - "`/api/v1/review-cases/{case_id}` 返回只读来源链路上下文，包含计算运行、版本和可关联导入批次。"
  - "`/data-quality/review-cases/[caseId]` 独立展示来源链路，不把内容塞回列表页或单页长卷。"
  - "页面保持只读，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、目标 backend unittest、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US677"
status: "done"
```

### US679 - 复核案例来源运行详情入口

```yaml
id: US679
requirement_ids:
  - R759
module: "导入中心"
role: "主管"
story: "作为主管，我希望从复核案例详情页跳转到来源对比运行详情页，以便继续查看该运行的结果列表，而不是打开 API JSON。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 的来源链路区块提供前端运行详情入口。"
  - "新增 `/data-quality/comparison-runs/[runId]` 二级详情页，只读展示运行摘要和结果列表。"
  - "批次详情里的对比运行详情入口优先跳前端详情页，而不是 API JSON。"
  - "页面保持只读，不提供计算触发、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US678"
status: "done"
```

### US680 - 对比运行关联复核案例定位

```yaml
id: US680
requirement_ids:
  - R760
module: "导入中心"
role: "主管"
story: "作为主管，我希望在对比运行详情页看到该运行结果关联的复核案例，以便从计算结果继续定位到具体复核异常和证据页。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/comparison-runs/[runId]` 展示关联复核案例区块。"
  - "关联复核案例按当前运行结果的 `source_result_type + source_result_id` 匹配。"
  - "有匹配案例时提供 `/data-quality/review-cases/[caseId]` 前端详情入口。"
  - "无匹配案例或读取失败时展示只读空态/错误态，不触发写入。"
  - "页面保持只读，不提供计算触发、证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US679"
status: "done"
```

### US681 - 复核案例证据结论链路

```yaml
id: US681
requirement_ids:
  - R761
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页把证据、结论和关闭状态整理成只读链路，以便先判断处理材料是否齐全，而不是只看分散表格。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示 `证据与结论链路` 区块。"
  - "链路区块汇总证据数、结论数、关闭状态和下一步只读建议。"
  - "有证据、结论或关闭记录时展示按时间排序的链路条目。"
  - "无记录或读取失败时展示只读空态/错误态，不触发写入。"
  - "页面保持只读，不提供证据补录、提交、关闭、审批、导出或批量操作。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不接真实外部接口，不做权限、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US680"
status: "done"
```

### US685 - 复核案例处理时间线

```yaml
id: US685
requirement_ids:
  - R765
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核案例详情页把证据补录、结论补充和关闭记录整理成处理时间线，以便按处理顺序判断当前案例走到哪一步、下一步该做什么。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示独立的处理时间线区块。"
  - "时间线按处理顺序聚合 evidence、conclusion 和 closure，并展示阶段、责任人、时间和处理说明。"
  - "时间线给出当前阶段和下一步建议；读取失败或无记录时展示只读空态/错误态。"
  - "页面保持只读，不新增证据补录、结论补充、关闭、审批、导出、权限、批量或外部接口能力。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不做生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US684"
status: "done"
```

### US686 - 复核案例处理阶段筛选

```yaml
id: US686
requirement_ids:
  - R766
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例列表按处理阶段筛选缺证据、缺结论、可关闭和已关闭案例，以便不用逐个打开详情页就能安排处理顺序。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases` 支持处理阶段筛选：缺证据、缺结论、可关闭、已关闭。"
  - "处理阶段基于现有复核详情 API 的 evidence、conclusions 和 closure 计数派生，不新增后端 API 或 schema。"
  - "列表页展示每个案例的处理阶段和阶段分组统计。"
  - "读取详情失败时保留案例行，并展示阶段未知，不误判为可关闭。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不做写入动作、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US685"
status: "done"
```

### US687 - 复核 Owner 阶段负载矩阵

```yaml
id: US687
requirement_ids:
  - R767
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例工作台按 owner 和处理阶段看到负载矩阵，以便快速判断谁手上还有缺证据、缺结论、可关闭或已关闭案例。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases` 展示 owner × 处理阶段负载矩阵。"
  - "矩阵列包含缺证据、缺结论、可关闭、已关闭和阶段未知。"
  - "每个非零单元格跳转到对应 `ownerId + processingStage` 的列表过滤结果。"
  - "矩阵基于现有复核案例列表和详情阶段快照派生，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US686"
status: "done"
```

### US688 - 复核详情同 Owner 处理上下文

```yaml
id: US688
requirement_ids:
  - R768
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页看到同 owner 的其他待处理案例，以便从当前案例继续安排同责任人的缺证据、缺结论和可关闭工作。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示同 owner 处理上下文区块。"
  - "区块列出同 owner 的其他案例，展示处理阶段、证据/结论状态、严重度和详情入口。"
  - "区块提供回到同 owner 列表过滤的入口。"
  - "上下文基于现有 review-case list API 和 detail 阶段快照派生，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US687"
status: "done"
```

### US689 - 复核详情同 Owner 待处理导航

```yaml
id: US689
requirement_ids:
  - R769
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页直接跳转同 owner 的上一条或下一条待处理案例，以便不用回到列表也能连续处理同责任人的复核工作。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 的同 Owner 上下文内展示待处理导航。"
  - "导航展示当前案例在同 owner 同业务日待处理序列中的位置，并提供上一条/下一条入口。"
  - "当前案例已关闭或不在待处理序列时，引导进入首条同 owner 待处理案例。"
  - "导航基于现有 review-case list API 和 detail 阶段快照派生，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US688"
status: "done"
```

### US690 - 复核工作台同 Owner 首条待处理入口

```yaml
id: US690
requirement_ids:
  - R770
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例工作台按 owner 看到首条待处理入口，以便从列表页直接进入某个责任人的连续处理链路。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases` 展示同 owner 首条待处理入口。"
  - "入口按 owner 聚合当前筛选结果，展示待处理数量、首条待处理阶段和详情链接。"
  - "入口复用现有 review-case list 数据和 detail 阶段快照，不新增后端 API 或 schema。"
  - "页面保持只读，不新增写入、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US689"
status: "done"
```

### US691 - 复核详情处理动作区整合

```yaml
id: US691
requirement_ids:
  - R771
module: "导入中心"
role: "主管"
story: "作为主管，我希望在复核案例详情页先看到统一的处理动作区，以便不用在长页面里寻找补证据、补结论和关闭入口，就能按当前阶段完成下一步。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 展示统一的处理动作区。"
  - "动作区展示当前推荐动作、证据/结论/关闭材料状态和下一步说明。"
  - "补证据、补结论和关闭入口复用现有本地 API，不新增后端 route 或 schema。"
  - "关闭案例后动作区展示已关闭状态，不再显示可提交按钮。"
  - "不新增依赖，不修改 package/lockfile，不新增 schema/migration，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US690"
status: "done"
```

### US692 - 复核动作提交反馈统一化

```yaml
id: US692
requirement_ids:
  - R772
module: "导入中心"
role: "主管"
story: "作为主管，我希望提交补证据、补结论或关闭案例后，在处理动作区直接看到提交结果和下一步建议，以便不用从 URL 参数或页面变化里猜测是否写入成功。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 读取 `evidence`、`conclusion`、`closure` 提交结果参数。"
  - "处理动作区顶部展示成功或失败反馈，包含动作名称、结果状态和下一步建议。"
  - "无提交结果参数时不展示反馈条，不影响原有动作区。"
  - "反馈只解析现有页面参数和现有写入结果，不新增后端 route、schema 或持久化。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US691"
status: "done"
```

### US693 - 复核提交后的续办导航

```yaml
id: US693
requirement_ids:
  - R773
module: "导入中心"
role: "主管"
story: "作为主管，我希望提交复核动作后直接看到下一条同 owner 待处理案例和返回列表入口，以便连续处理复核工作而不是重新查找。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在提交反馈出现时展示续办导航。"
  - "续办导航优先展示同 owner 下一条待处理案例；当前案例已关闭或不在序列中时展示首条待处理案例。"
  - "续办导航始终提供返回同 owner 复核列表的入口。"
  - "续办导航复用现有 review-case list 数据和 detail 阶段快照，不新增后端 API 或 schema。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US692"
status: "done"
```

### US694 - 复核提交失败后的重试定位

```yaml
id: US694
requirement_ids:
  - R774
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核动作提交失败后页面直接定位到对应处理入口，以便马上重试补证据、补结论或关闭案例。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在 `evidence=failed`、`conclusion=failed` 或 `closure=failed` 时展示重试定位提示。"
  - "失败反馈出现时，处理动作区默认打开对应动作 tab。"
  - "成功反馈或无反馈时不展示重试定位提示，仍按原推荐动作打开 tab。"
  - "重试定位只解析现有页面参数和现有动作区状态，不新增后端 API、schema 或持久化。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US693"
status: "done"
```

### US695 - 复核提交成功后的当前案例优先续办

```yaml
id: US695
requirement_ids:
  - R775
module: "导入中心"
role: "主管"
story: "作为主管，我希望复核动作提交成功后，如果当前案例仍缺下一步材料，续办入口先让我继续当前案例，以便避免补完证据后误跳到其他案例。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在成功反馈出现时判断当前案例是否仍在待处理序列。"
  - "当前案例仍待处理时，续办主入口展示继续处理当前案例，并指向当前详情页。"
  - "当前案例已关闭或不在待处理序列时，续办主入口仍指向同 owner 下一条或首条待处理案例。"
  - "失败反馈仍交给重试定位，不改变 IM074 行为。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US694"
status: "done"
```

### US696 - 复核关闭成功后的队列交接提示

```yaml
id: US696
requirement_ids:
  - R776
module: "导入中心"
role: "主管"
story: "作为主管，我希望关闭案例成功后，续办导航明确告诉我当前案例已关闭，并直接引导处理下一条待处理案例，以便连续复核时不会误以为当前案例还需要动作。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/review-cases/[caseId]` 在 `closure=success` 且当前案例不再待处理时展示关闭后的队列交接语义。"
  - "存在同 owner 下一条待处理时，续办主入口展示关闭后处理下一条，并指向下一条详情页。"
  - "非关闭成功反馈不受影响；失败反馈仍交给重试定位，当前案例仍待处理时仍优先当前案例。"
  - "复用现有 review-case list 数据和阶段快照，不新增后端 API、schema/migration 或页面路由。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US695"
status: "done"
```

### US697 - 复核续办返回列表保留未关闭焦点

```yaml
id: US697
requirement_ids:
  - R777
module: "导入中心"
role: "主管"
story: "作为主管，我希望从复核详情续办导航返回同 Owner 列表时仍停留在未关闭案例队列，以便连续处理时不被已关闭案例打断。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "同 Owner 待处理导航的列表入口包含 `status=open`。"
  - "提交成功、关闭成功和失败反馈下的续办导航返回同 Owner 列表入口均复用带 `status=open` 的列表链接。"
  - "下一条详情入口不受影响，仍指向具体复核案例详情页。"
  - "复用现有 review-case list filter，不新增后端 API、schema/migration 或页面路由。"
  - "不新增依赖，不修改 package/lockfile，不做审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US696"
status: "done"
```

### US698 - 字段映射模板维护详情页

```yaml
id: US698
requirement_ids:
  - R778
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在独立二级页面维护字段映射模板，以便修正模板名称或字段映射并停用不再使用的模板。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/field-mapping-templates/[templateId]` 展示模板详情、启用状态、文件类型、字段映射明细和返回入口。"
  - "模板详情页提供更新模板名称和字段映射 JSON 的表单，提交后调用现有 PATCH 模板 API。"
  - "启用模板可在详情页停用，提交后调用现有 deactivate API；停用模板不展示重复停用入口。"
  - "模板卡片提供进入详情页的入口，不再把维护动作堆在批次详情页。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US697"
status: "done"
```

### US699 - 字段映射模板新增页

```yaml
id: US699
requirement_ids:
  - R779
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在独立页面新增字段映射模板，以便把常用 CSV 表头映射保存为后续上传可复用的模板。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/field-mapping-templates/new` 展示新增模板表单，包含模板 ID、名称、文件类型、创建人和字段映射 JSON。"
  - "提交新增模板后调用现有 create template API，成功后进入对应模板详情页并展示创建成功反馈。"
  - "字段映射模板管理区提供进入新增模板页的入口。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、权限、批量、真实外部接口、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US698"
status: "done"
```

### US713 - 版本工作台本地比对候选入口

```yaml
id: US713
requirement_ids:
  - R793
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在业务版本工作台看到当前版本能发起哪类本地比对，以便不用跳转多次也能判断下一步计算入口。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/versions` 在可定位来源版本的行展示本地比对候选入口。"
  - "候选入口明确对比口径、来源版本组合、业务日和触发前下一步。"
  - "来源版本不足、业务域不支持或未应用版本时展示清晰阻塞态，不渲染误导性提交按钮。"
  - "候选入口复用已有批次结果追踪/版本语境，不新增后端 API、schema/migration 或依赖。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US712"
status: "done"
notes: "IM093 已完成：/data-quality/versions 新增本地比对候选列，ready 候选链接回现有结果追踪语境，缺来源版本、未应用或不支持业务域保持阻塞态且不渲染提交按钮。"
```

### US714 - 版本工作台单次本地比对提交

```yaml
id: US714
requirement_ids:
  - R794
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在业务版本工作台对满足条件的单个版本发起一次本地比对，以便把版本检查和计算触发放在同一个工作流里。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "`/data-quality/versions` 只在来源版本组合完整时提供单次本地比对提交入口。"
  - "提交入口复用现有本地 comparison calculate 能力，不新增后端 route 或 schema。"
  - "重复提交或后端返回 existing run 时保持幂等反馈，不暗示创建了多个运行。"
  - "不支持的业务域、缺来源版本或未应用版本不展示提交按钮。"
  - "不新增依赖，不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US713"
status: "done"
notes: "IM094 已完成：/data-quality/versions 对来源版本组合完整的行提供受控单次本地比对提交表单，复用现有 comparison calculate 能力；成功或失败回到版本工作台显示幂等反馈，未应用、缺来源版本或不支持业务域不展示提交按钮。"
```

### US715 - 版本工作台计算后结果回看

```yaml
id: US715
requirement_ids:
  - R795
module: "导入中心"
role: "导入管理员"
story: "作为导入管理员，我希望在版本工作台发起本地比对后直接看到运行回看入口，以便确认结果并进入 comparison run detail 继续检查。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "版本工作台在本地比对提交成功或复用已有运行后展示结果回看卡片。"
  - "回看卡片展示运行 ID、对比口径、结果规模、关键差异和进入 comparison run detail / 结果列表的入口。"
  - "运行暂未回显时展示明确阻塞态，不伪造完整结果。"
  - "复用现有 comparison run detail、结果列表和版本工作台，不新增后端 API、schema/migration 或依赖。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US714"
status: "done"
notes: "IM095 已完成：版本工作台在本地比对提交成功后展示结果回看卡片；运行已回显时展示对比口径、结果数、关键差异和业务日，运行暂未回显时展示阻塞态且不伪造结果。"
```

### US716 - 主数据维护工作台只读入口

```yaml
id: US716
requirement_ids:
  - R796
module: "主数据维护"
role: "运营管理员"
story: "作为运营管理员，我希望有一个主数据维护工作台入口，按坐席、职场、供应商、项目、技能和绑定关系查看当前维护范围，以便先确认主数据对象和维护边界。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "主数据维护入口在现有导航体系内可达，不创建新的首页或营销页。"
  - "工作台按坐席、职场、供应商、项目、技能和绑定关系分组展示只读维护范围。"
  - "页面明确当前只读边界、来源批次/版本口径和后续维护动作入口状态。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US715"
status: "done"
```

### US717 - 主数据实体详情与引用影响

```yaml
id: US717
requirement_ids:
  - R797
module: "主数据维护"
role: "运营管理员"
story: "作为运营管理员，我希望查看单个主数据实体或绑定关系的详情、有效期、冻结状态、来源批次和引用影响，以便维护前知道可能影响哪些业务数据。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从主数据维护工作台可进入实体或绑定关系详情。"
  - "详情页展示有效期、冻结状态、来源批次/版本和引用影响摘要。"
  - "缺少引用数据时展示明确空态或阻塞态，不伪造影响。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US716"
status: "done"
```

### US718 - 主数据受控维护动作

```yaml
id: US718
requirement_ids:
  - R798
module: "主数据维护"
role: "运营管理员"
story: "作为运营管理员，我希望在引用校验清楚后执行受控的主数据新增、编辑、冻结或有效期调整，以便维护基础对象时不会破坏已引用业务数据。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "维护动作必须先展示引用校验结果和失败反馈边界。"
  - "新增、编辑、冻结或有效期调整的范围需按实体类型拆分，不混成批量能力。"
  - "写入动作进入前需要单独确认，不默认扩展到后端/schema/migration。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US717"
status: "done"
```

### US719 - 人员排班生产工作台只读入口

```yaml
id: US719
requirement_ids:
  - R799
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望在计划与排班下查看人员级排班生产工作台，按排班版本、来源批次、应用状态和 0.5h 展开状态确认当前排班数据是否可用于后续履约比对。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "入口在现有计划与排班功能下可达，不创建新的首页或营销页。"
  - "工作台展示人员排班来源批次、业务版本、应用状态、0.5h 展开状态和阻塞原因。"
  - "页面明确当前只读边界和后续版本详情、发布/冻结动作状态。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US718"
status: "done"
notes: "IM099 已完成：`/schedule-plans/production` 在现有计划与排班导航下展示人员排班生产只读工作台，包含来源批次、业务版本、应用状态、0.5h 展开状态、阻塞原因和后续版本详情/发布冻结边界。"
```

### US720 - 人员排班版本详情与 0.5h 展开结果

```yaml
id: US720
requirement_ids:
  - R800
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望进入单个人员排班版本详情，查看班次引用、人员维度和 0.5h 展开结果，以便确认这个版本是否能进入比对和复核链路。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "从人员排班生产工作台可进入排班版本详情。"
  - "详情页展示来源批次/版本、业务日范围、班次引用、人员范围和 0.5h 展开状态。"
  - "缺少展开结果时展示明确空态或阻塞态，不伪造人员级明细。"
  - "不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US719"
status: "ready"
```

### US721 - 人员排班发布冻结边界安全壳

```yaml
id: US721
requirement_ids:
  - R801
module: "人员排班生产"
role: "排班主管"
story: "作为排班主管，我希望在发布或冻结排班版本前先看到校验条件、失败原因和当前未接入真实写入的边界，以便不误操作生产排班口径。"
task_type: "frontend-scaffold"
priority: "P1"
acceptance:
  - "发布、冻结或取消发布动作必须先展示来源版本、展开结果和引用校验边界。"
  - "动作按钮保持安全壳状态，不提交真实生产状态变化。"
  - "写入动作进入前需要单独确认，不默认扩展到后端/schema/migration。"
  - "不做审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
  - "`bash scripts/check-state.sh --strict`、前端模型测试、shadcn gate、页面 smoke、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US720"
status: "draft"
```
