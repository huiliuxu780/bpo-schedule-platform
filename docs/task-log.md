# Task Log

本文件记录需求、用户故事和执行任务之间的过程状态。

## Schema

```yaml
- date: "YYYY-MM-DD"
  task_id: "H003"
  source_ids: []
  story_ids: []
  action: "执行动作"
  status: "done"
  owner: "Codex"
  notes: "过程说明"
```

## Log

### 2026-06-05

- task_id: `IM152`
- source_ids:
  - `R852`
- story_ids:
  - `US772`
- action: 清理主数据职场详情可见术语。
- status: `done`
- notes: 职场详情指标、区块标题和空态改为 `服务团队/职场服务团队`；主数据数据读取错误文案改为 `职场服务团队来源读取失败`；本轮不新增职场服务团队独立页面、CRUD 或导入入口，不删除 project_id 兼容字段，不改后端 route、schema/migration、依赖、供应商合同、结算比例、最低人力要求、权限、审批、导出、批量、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM151`
- source_ids:
  - `R851`
- story_ids:
  - `US771`
- action: 降级 data-quality 结果页可见父级抽象。
- status: `done`
- notes: 业务版本列表、对比运行详情、复核案例列表和复核案例详情不再把 `导入批次` 作为 Breadcrumb 父级；复核案例详情保留到复核列表的二级关系；批次处理、上传、字段映射模板页面继续保留兼容路由和批次/模板上下文；本轮不新增导航项，不删除 `/data-quality/**` 路由，不改后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM150`
- source_ids:
  - `R850`
- story_ids:
  - `US770`
- action: 收口导入入口业务归属。
- status: `done`
- notes: `/data-quality` 批次台账内容区不再显示通用 `上传 CSV` 主入口；预测、排班、登录/状态日志页面级导入动作进入 Header actions，内容区版本状态卡片不再承载导入按钮；本轮保留 `/data-quality/uploads/new` 作为内部兼容上传路由，不新增导入弹窗、后端 route/action、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-01

- task_id: `IM050`
- source_ids:
  - `R750`
- story_ids:
  - `US670`
- action: 将 shadcn/ui 约束并入自动化验证链路。
- status: `done`
- notes: IM050 新增 `scripts/check-shadcn-ui.mjs`、`scripts/tests/check-shadcn-ui.test.mjs` 和 `scripts/shadcn-ui-baseline.json`，并将脚本测试和真实项目扫描接入 `bash scripts/check.sh`。检查不依赖远程 shadcn CLI 或新增依赖；当前历史违例进入 baseline，后续新增 `space-x/space-y`、硬编码 Tailwind 色阶、任意半径或 shadcn config 漂移会失败。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-31

- task_id: `IM030`
- source_ids:
  - `R730`
- story_ids:
  - `US650`
- action: 实现导入中心字段映射模板只读管理可见性。
- status: `done`
- notes: IM030 在 `/data-quality` 新增字段映射模板只读管理面板，展示模板总数、启用/停用数量、覆盖文件类型、映射字段数，以及每个模板的状态、创建人、创建时间和映射摘要。未新增依赖，不做模板新增/编辑/停用按钮、后端、schema/migration、权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-31

- task_id: `IM029`
- source_ids:
  - `R729`
- story_ids:
  - `US649`
- action: 实现导入中心失败行修正结果反馈打磨。
- status: `done`
- notes: IM029 在 `/data-quality` 的失败行修正面板中新增修正结果摘要，成功时展示修正行号、剩余失败行数量和下一步提示，失败时把常见原因转成业务可读说明。未新增依赖，不做后端、schema/migration、批量修正、apply 写按钮、模板 CRUD、权限、审批、导出、外部集成、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM028`
- source_ids:
  - `R728`
- story_ids:
  - `US648`
- action: 实现导入中心批次明细 drilldown 第一刀。
- status: `done`
- notes: IM028 在 `/data-quality` 对选中批次展示 persisted detail drilldown，包含行状态分布、版本列表、全部行结果和 standard_fields/raw_data 预览。未新增依赖，不做 apply 写按钮、批量修正、模板 CRUD、后端、schema/migration、权限、审批、导出、外部集成、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM027`
- source_ids:
  - `R727`
- story_ids:
  - `US647`
- action: 实现导入中心字段映射模板选择第一刀。
- status: `done`
- notes: IM027 在 `/data-quality` 读取现有 field mapping templates，上传表单新增模板选择并把 `template_id` 传给现有 `upload-csv` API；页面展示模板名称、类型和映射摘要，同时保留手填 field_mapping JSON 兜底路径。未新增依赖，不做模板 CRUD UI、后端、schema/migration、权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM026`
- source_ids:
  - `R726`
- story_ids:
  - `US646`
- action: 实现导入中心失败行列表与单行修正 UI 第一刀。
- status: `done`
- notes: IM026 在 `/data-quality` 读取选中批次 persisted detail，展示 failed_rows 明细和单行修正表单；表单通过 Next server action 调用现有 `POST /api/v1/import-batches/{batch_id}/rows/{row_number}/correct`。未新增依赖，不做批量修正、apply 写按钮、后端、schema/migration、权限、审批、导出、外部集成、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM025`
- source_ids:
  - `R725`
- story_ids:
  - `US645`
- action: 实现导入中心 CSV 上传表单第一刀。
- status: `done`
- notes: IM025 在 `/data-quality` 新增 CSV 上传表单，通过 Next server action 读取本地 CSV 文件文本并调用现有 `POST /api/v1/import-batches/upload-csv`，成功后跳转到新 batch，失败时返回上传失败状态。未新增依赖，不做 Excel/multipart、apply 写操作、后端、schema/migration、权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM024`
- source_ids:
  - `R724`
- story_ids:
  - `US644`
- action: 实现导入中心前端 API 接入第一刀。
- status: `done`
- notes: IM024 新增 `/data-quality` 页面，从本地 FastAPI `GET /api/v1/import-batches` 读取批次列表，并按选中 batch 只读读取 `GET /api/v1/import-batches/{batch_id}/apply-readiness`，展示 readiness、批次阻塞和行级阻塞。侧边栏文件导入、接入批次、数据质量入口已指向 `/data-quality`。未新增依赖，不做上传写入、apply 写操作、后端、schema/migration、权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM023`
- source_ids:
  - `R723`
- story_ids:
  - `US643`
- action: 实现人员排班与实际日志应用前 readiness 安全闸第一刀。
- status: `done`
- notes: IM023 在 personnel_schedule 和 login/status-log apply 路由写入前复用 apply-readiness 判断，未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY` 并携带 readiness 详情；已应用批次继续返回 existing already_applied 幂等响应。未新增 schema/migration，不做前端、深度主数据引用校验、批量、外部集成、权限、审批、导出、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM022`
- source_ids:
  - `R722`
- story_ids:
  - `US642`
- action: 实现导入应用前 readiness 安全闸第一刀。
- status: `done`
- notes: IM022 在 master_data 和 demand_forecast apply 路由写入前复用 apply-readiness 判断，未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY` 并携带 readiness 详情；已应用批次继续返回 existing already_applied 幂等响应。未新增 schema/migration，不做前端、深度主数据引用校验、批量、外部集成、权限、审批、导出、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM021`
- source_ids:
  - `R721`
- story_ids:
  - `US641`
- action: 实现导入批次应用前行级字段预检第一刀。
- status: `done`
- notes: IM021 在只读 `GET /api/v1/import-batches/{batch_id}/apply-readiness` 响应中新增 `row_blockers`，对成功行按 file_type/record_type 检查应用所需标准字段，缺字段或未知 record_type 时返回 blocked。未新增 schema/migration，不做自动 apply、前端、深度主数据引用校验、批量、外部集成、权限、审批、导出、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM020`
- source_ids:
  - `R720`
- story_ids:
  - `US640`
- action: 实现导入批次应用前就绪校验第一刀。
- status: `done`
- notes: IM020 新增只读 `GET /api/v1/import-batches/{batch_id}/apply-readiness`，返回 ready/blocked、阻塞原因、失败/成功/警告行数、版本数和应用状态摘要。未新增 schema/migration，不做自动 apply、前端、深度主数据校验、批量、外部集成、权限、审批、导出、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM019`
- source_ids:
  - `R719`
- story_ids:
  - `US639`
- action: 实现字段映射模板更新与停用第一刀。
- status: `done`
- notes: IM019 新增字段映射模板更新和软停用 API，更新 template_name/field_mapping，停用后模板不再被列表、单查或 upload-csv 复用返回。未新增 schema/migration，不做前端、物理删除、批量、外部集成、权限、审批、导出、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM018`
- source_ids:
  - `R718`
- story_ids:
  - `US638`
- action: 实现导入批次列表与应用状态查询第一刀。
- status: `done`
- notes: IM018 新增只读 `GET /api/v1/import-batches`，返回批次基础信息、成功/失败/警告计数、版本数和应用状态摘要，并支持 file_type、processing_status、uploaded_by 与 application_status 过滤。未新增 schema/migration，不做前端、分页、导出、批量、外部集成、权限、审批、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM017`
- source_ids:
  - `R717`
- story_ids:
  - `US637`
- action: 实现导入失败行修正第一刀。
- status: `done`
- notes: IM017 新增 failed row 单行修正 API 和 repository 方法，修正后将行状态改为 success、清空错误字段、写入 corrected standard_fields，并重算批次成功/失败/警告计数和 processing_status。未新增 schema/migration，不做修正历史表、前端、批量修正、自动 apply、Excel/multipart、外部集成、权限、审批、导出、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-29

- task_id: `IM016`
- source_ids:
  - `R716`
- story_ids:
  - `US636`
- action: 实现字段映射模板持久化第一刀。
- status: `done`
- notes: IM016 新增字段映射模板表、migration、repository、创建/列表/单查 API，并支持 upload-csv 按 template_id 复用已保存映射。未新增依赖，不做前端、Excel/multipart、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM015`
- source_ids:
  - `R715`
- story_ids:
  - `US635`
- action: 实现导入批次应用结果查询摘要第一刀。
- status: `done`
- notes: IM015 新增只读 `GET /api/v1/import-batches/{batch_id}/application-summary`，按 batch 返回 file_type、application_status、application_target、import_version_id 和 applied_record_count；复用现有 repository 判断 master_data、personnel_schedule、demand_forecast、login_log、status_log 是否已应用。未新增依赖，未改 schema/migration，未做模板持久化、字段映射 CRUD、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM014`
- source_ids:
  - `R714`
- story_ids:
  - `US634`
- action: 实现实际日志导入应用幂等重跑保护第一刀。
- status: `done`
- notes: IM014 新增同一 login_log 或 status_log batch 重复调用 apply-actual-logs 时返回 already_applied 摘要，不再执行 login event、status dictionary 或 status interval 写入；首次应用返回 applied。不新增依赖，不改 schema/migration，不做 master_data、personnel_schedule、forecast 幂等，不做幂等表、任务队列、前端、外部集成、权限、审批、导出、批量、生产状态码规则、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM013`
- source_ids:
  - `R713`
- story_ids:
  - `US633`
- action: 实现需求预测导入应用幂等重跑保护第一刀。
- status: `done`
- notes: IM013 新增同一 demand_forecast batch 重复调用 apply-forecast 时返回 already_applied 摘要，不再执行 forecast version、forecast interval 或 forecast change 写入；首次应用返回 applied。不新增依赖，不改 schema/migration，不做 master_data、personnel_schedule、actual_logs 幂等，不做幂等表、任务队列、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM012`
- source_ids:
  - `R712`
- story_ids:
  - `US632`
- action: 实现人员排班导入应用幂等重跑保护第一刀。
- status: `done`
- notes: IM012 新增同一 personnel_schedule batch 重复调用 apply-personnel-schedule 时返回 already_applied 摘要，不再执行 schedule version、shift type、schedule detail 或 0.5h interval 写入；首次应用返回 applied。不新增依赖，不改 schema/migration，不做 master_data、forecast、actual_logs 幂等，不做幂等表、任务队列、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM011`
- source_ids:
  - `R711`
- story_ids:
  - `US631`
- action: 实现主数据导入应用幂等重跑保护第一刀。
- status: `done`
- notes: IM011 新增同一 master_data batch 重复调用 apply-master-data 时返回 already_applied 摘要，不再执行 master data snapshot 写入；首次应用返回 applied。不新增依赖，不改 schema/migration，不做 personnel_schedule、forecast、actual_logs 幂等，不做幂等表、任务队列、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM010`
- source_ids:
  - `R710`
- story_ids:
  - `US630`
- action: 实现计算与复核写入幂等重跑保护第一刀。
- status: `done`
- notes: IM010 新增相同 run_id 的 comparison calculate 重复请求返回已有 ComparisonRunDetail，相同 case_id 的 review closure write 重复请求返回已有 ReviewCaseDetail。重复请求不新增 comparison results、review evidence、review conclusions 或 review closures。不新增依赖，不改 schema/migration，不做导入 apply 重跑、幂等表、任务队列、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM009`
- source_ids:
  - `R709`
- story_ids:
  - `US629`
- action: 实现持久化结果列表筛选 API 第一刀。
- status: `done`
- notes: IM009 新增 DB007 comparison run 与 DB008 review case 的只读列表筛选 API，返回轻量 summary 列表。comparison runs 支持 comparison_type、status、business_date 筛选；review cases 支持 business_date、owner_id、status、severity、source_result_type 筛选。不新增依赖，不改 schema/migration，不做分页、模板持久化、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM008`
- source_ids:
  - `R708`
- story_ids:
  - `US628`
- action: 实现持久化结果查询 API 收口。
- status: `done`
- notes: IM008 新增 DB007 comparison run 与 DB008 review case 的只读查询 API，按 id 返回已持久化详情或稳定 404 错误码。不新增依赖，不改 schema/migration，不做模板持久化、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM007`
- source_ids:
  - `R707`
- story_ids:
  - `US627`
- action: 实现复核闭环写入到 DB008 repository。
- status: `done`
- notes: IM007 新增本地 review closure 写入服务和 API，把 case、evidence、conclusion 和 closure 依次写入 DB008，并返回完整 ReviewCaseDetail。复用 DB008 来源结果、业务日、case 存在性和重复关闭校验。未新增依赖，未改 schema/migration，未做前端、真实外部证据服务、审批流、权限、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM006`
- source_ids:
  - `R706`
- story_ids:
  - `US626`
- action: 实现对比计算触发到 DB007 repository。
- status: `done`
- notes: IM006 新增本地 comparison calculation 服务和 API，基于已有预测、排班和实际状态数据生成 forecast_vs_schedule 与 schedule_vs_actual comparison run/results，并复用 DB007 来源版本和结果维度校验。未新增依赖，未改 schema/migration，未做前端、真实外部集成、生产状态码/公式定版、权限、审批、导出、批量、自动排班、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM005`
- source_ids:
  - `R705`
- story_ids:
  - `US625`
- action: 实现登录/状态日志导入应用到 DB006 repository。
- status: `done`
- notes: IM005 新增 actual log 导入应用服务和 API，按 batch_id 读取已持久化 login_log/status_log 导入批次，只处理成功行，并写入 login/logout events、status dictionary 或 status intervals。应用后复用 DB006 的 import version、employee、状态字典、跨天切分、业务日和时区校验。未新增依赖，未改 schema/migration，未做真实外部集成、状态码生产规则、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM004`
- source_ids:
  - `R704`
- story_ids:
  - `US624`
- action: 实现需求预测导入应用到 DB005 repository。
- status: `done`
- notes: IM004 新增需求预测导入应用服务和 API，按 batch_id 读取已持久化 demand_forecast 导入批次，只处理成功行，并写入 forecast version、forecast intervals 和可选版本变更记录。应用后复用 DB005 的 import version 校验、30 分钟区间校验、主数据引用校验、冻结和业务日期校验。未新增依赖，未改 schema/migration，未做预测算法、预测 UI、外部集成、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM003`
- source_ids:
  - `R703`
- story_ids:
  - `US623`
- action: 实现人员排班导入应用到 DB004 repository。
- status: `done`
- notes: IM003 新增人员排班导入应用服务和 API，按 batch_id 读取已持久化 personnel_schedule 导入批次，只处理成功行，并按 record_type 写入 shift types 和 personnel schedule details。应用后复用 DB004 的 import version 校验、主数据引用校验、人员绑定校验和 0.5h 展开。未新增依赖，未改 schema/migration，未做排班维护 UI、发布/冻结、外部集成、权限、审批、导出、批量调班、自动排班、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM002`
- source_ids:
  - `R702`
- story_ids:
  - `US622`
- action: 实现主数据导入应用到 DB003 repository。
- status: `done`
- notes: IM002 新增主数据导入应用服务和 API，按 batch_id 读取已持久化 master_data 导入批次，只处理成功行，并按 record_type 写入 suppliers、workplaces、projects、skills、employees 和 bindings。绑定关系继续复用 DB003 引用校验和冻结校验。未新增依赖，未改 schema/migration，未做 CRUD UI、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `IM001`
- source_ids:
  - `R701`
- story_ids:
  - `US621`
- action: 实现真实导入中心 CSV 上传 API 第一刀。
- status: `done`
- notes: IM001 新增 `text/csv` 原始请求体上传入口、CSV 字段映射解析服务、行级成功/失败结果、失败字段与错误码、默认 import version 生成，并通过既有 import persistence repository 落库。未新增依赖，未实现 multipart/Excel，未接外部系统，未引入权限、审批、导出、批量、schema/migration 变更、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `Q127`
- source_ids:
  - `R697`
  - `R698`
  - `R699`
  - `R700`
- story_ids:
  - `US620`
- action: 执行数据库基础 QA 收口。
- status: `done`
- notes: Q127 新增 database foundation QA closeout 测试，覆盖 Alembic head 建表和从导入/版本记录到复核关闭记录的最小端到端持久化链路；输出 `docs/quality/DATABASE_FOUNDATION_QA_2026-05-28.md`。未修改产品行为、数据库 schema、repository 实现、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB008`
- source_ids:
  - `R693`
  - `R694`
  - `R695`
  - `R696`
- story_ids:
  - `US619`
- action: 实现复核闭环记录持久化基础。
- status: `done`
- notes: DB008 新增 review cases、review evidence、review conclusions 和 review closures 的持久化表、repository、Alembic migration 和 backend 测试；测试覆盖证据、结论、关闭记录读取、缺失来源拒绝、来源类型不匹配拒绝、业务日不一致拒绝和重复关闭拒绝。未扩展到审批流、权限、导出、批量、真实外部证据服务、外部接口、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB007`
- source_ids:
  - `R689`
  - `R690`
  - `R691`
  - `R692`
- story_ids:
  - `US618`
- action: 实现对比结果持久化基础。
- status: `done`
- notes: DB007 新增 comparison runs、forecast-vs-schedule results 和 schedule-vs-actual results 的持久化表、repository、Alembic migration 和 backend 测试；测试覆盖结果读取、缺失源版本拒绝、非 status_log 拒绝、跨版本来源拒绝和来源维度不一致拒绝。未扩展到真实计算调度、异常复核、外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB006`
- source_ids:
  - `R685`
  - `R686`
  - `R687`
  - `R688`
- story_ids:
  - `US617`
- action: 实现登录/状态日志持久化基础。
- status: `done`
- notes: DB006 新增 actual login events、actual status dictionary 和 actual status intervals 的持久化表、repository、Alembic migration 和 backend 测试；测试覆盖登录/登出事件读取、跨天业务日切分、Asia/Shanghai 时区校验、冻结员工拒绝和未知状态拒绝。未扩展到排班/预测对比、复核闭环、外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB005`
- source_ids:
  - `R681`
  - `R682`
  - `R683`
  - `R684`
- story_ids:
  - `US616`
- action: 实现需求预测持久化基础。
- status: `done`
- notes: DB005 新增 forecast versions、forecast interval rows 和 forecast version changes 的持久化表、repository、Alembic migration 和 backend 测试；测试覆盖 0.5h 时段、技能等级需求、版本变更追踪、冻结技能拒绝和非 0.5h 时段拒绝。未扩展到登录/状态日志、对比结果、复核闭环、外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB004`
- source_ids:
  - `R677`
  - `R678`
  - `R679`
  - `R680`
- story_ids:
  - `US615`
- action: 实现人员级排班持久化基础。
- status: `done`
- notes: DB004 新增 schedule versions、shift types、personnel schedule details 和 half-hour intervals 的持久化表、repository、Alembic migration 和 backend 测试；测试覆盖 0.5h 展开、跨 repository 读取、冻结班次类型拒绝和无效时间范围拒绝。未扩展到需求预测、登录/状态日志、对比结果、复核闭环、外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB003`
- source_ids:
  - `R673`
  - `R674`
  - `R675`
  - `R676`
- story_ids:
  - `US614`
- action: 实现主数据持久化基础。
- status: `done`
- notes: DB003 新增 employees、suppliers、workplaces、projects、skills 和 employee bindings 的持久化表、repository、Alembic migration 和 backend 测试；测试覆盖新 repository 读取、冻结引用拒绝和 DB002 import batch 来源引用。未扩展到人员排班、需求预测、登录/状态日志、对比结果、复核闭环、外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB002`
- source_ids:
  - `R669`
  - `R670`
  - `R671`
  - `R672`
- story_ids:
  - `US613`
- action: 实现导入批次持久化基础。
- status: `done`
- notes: DB002 使用 PM 确认的 PostgreSQL 生产口径、SQLAlchemy、Alembic、依赖变更授权和本地隔离测试库方案，新增导入批次、行结果、失败行明细和导入生成版本记录的 repository、migration、API 入口和 backend 测试；未扩展到主数据、人员排班、预测、登录状态、异常复核、真实外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。任务完成后 current queue 和 active tasks 已清空。

### 2026-05-28

- task_id: `DB002`
- source_ids:
  - `R669`
  - `R670`
  - `R671`
  - `R672`
- story_ids:
  - `US613`
- action: 写入 DB002 导入批次持久化基础的前置确认卡口。
- status: `blocked`
- notes: DB002 已加入 current queue 和 active tasks，但状态为 blocked；阻塞项为数据库引擎、依赖/package 变更授权、ORM/migration 工具和测试数据库方案未确认。本次只维护文档状态，不创建数据库连接、ORM、repository、migration、schema、生产持久化配置、新依赖、真实外部集成、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。该前置卡口已通过后续 PM 确认解除，并进入 DB002 实现。

### 2026-05-28

- task_id: `DB001`
- source_ids:
  - `R665`
  - `R666`
  - `R667`
  - `R668`
- story_ids:
  - `US612`
- action: 启动数据库 Gate 规划与首批落库拆解。
- status: `done`
- notes: PM 已确认进入数据库 Gate；DB001 已交付数据库 Gate 规划、database-planning/database-persistence workflow、首批导入持久化顺序、DB002 前置确认项和实施计划。本轮未创建数据库连接、ORM、repository、migration、schema、生产持久化配置、新依赖、真实外部集成、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-05-12

- task_id: `F018`
- source_ids:
  - `R020`
  - `R021`
  - `R025`
- story_ids:
  - `US038`
- action: 完成风险提示表局部 table parity 迁移。
- status: `done`
- notes: 新增 `components/schedule-risk-table.tsx`，使用 TanStack Table 管理风险提示表列和排序；保留明细/班次动作；未新增依赖、未改 package/lockfile、未启用批量、拖拽、审批、导出或生产动作。

### 2026-05-12

- task_id: `F017`
- source_ids:
  - `R018`
  - `R019`
  - `R024`
- story_ids:
  - `US037`
- action: 新增不可用影响定位。
- status: `done`
- notes: 不可用记录行新增“影响”入口；新增 `/unavailability/[unavailabilityId]`，展示不可用记录、重叠班次、关联风险和跳转入口；未新增依赖、后端接口、真实数据、审批、批量或生产公式能力。

### 2026-05-12

- task_id: `F016`
- source_ids:
  - `R019`
  - `R023`
- story_ids:
  - `US036`
- action: 新增风险明细钻取入口。
- status: `done`
- notes: 排班计划页风险提示行新增“明细”入口；新增 `/schedule-risks/[riskId]`，展示风险等级、计划、时段、缺口、不可用影响、原因、建议、关联班次和重叠不可用记录；未新增依赖、后端接口、真实数据、审批、批量或生产公式能力。

### 2026-05-12

- task_id: `H016`
- source_ids:
  - `R022`
- story_ids:
  - `US035`
- action: 修复 Harness Gate 体系审计反馈。
- status: `done`
- notes: 已建立 required_workflow 到 Gate 的矩阵，更新 AGENTS/PROJECT_STATE 阶段名，将旧 clean-Harness 审计结论改为历史快照，并预置 `US036/F016` 为下一条 ready Story Runner 入口。

### 2026-05-12

- task_id: `F015`
- source_ids:
  - `R021`
- story_ids:
  - `US034`
- action: 收口 shadcn 依赖与组件接入。
- status: `done`
- notes: 已接受 PM 确认的 package/lockfile 依赖变更和新增 shadcn UI 组件；修复 `hooks/use-mobile.ts` 的 React hooks lint 问题；核对 dashboard、排班计划搜索、新建草稿和编辑草稿页面冒烟通过。

### 2026-05-11

- task_id: `H003`
- action: 建立 Lightweight Harness 文档型升级结构。
- status: `done`
- notes: 只更新 Harness 文档、提示词模板和追溯文件，不进入业务实现。

### 2026-05-11

- task_id: `H003`
- action: 审计当前目录并校准 Subagent prompt 中的 Skill 名称。
- status: `done`
- notes: 发现工作区存在未跟踪前端工程文件、业务 mock 数据和 `recharts` 依赖，导致 clean Harness check 被 `package.json` 拦截；已将 prompt 中的占位式 Skill 名称替换为当前可用 Skill。

### 2026-05-11

- task_id: `H004`
- action: 细化 Subagent Prompt Contract。
- status: `done`
- notes: 新增统一 dispatch packet、结构化返回状态、停止条件、实现/评审链路，并细化 PM、UI/UX、Frontend、Backend、QA、Doc Agent 合同。

### 2026-05-11

- task_id: `H005`
- action: 接入 shadcn skill 使用规则。
- status: `done`
- notes: 明确 `/Users/mac/.codex/skills/shadcn/SKILL.md` 主要给 UI/UX Agent、Frontend Agent、Implementer 和 Code Quality Reviewer 使用；QA Agent 仅作 UI 验收参考；PM、Backend、Doc Agent 默认不使用。

### 2026-05-11

- task_id: `H006`
- source_ids: [`R001`, `R002`]
- story_ids: [`US001`, `US002`, `US003`, `US004`, `US005`]
- action: 开发前 Harness 收口。
- status: `done_with_verification_blocker`
- notes: 对齐项目阶段、补齐 F001 追溯、增加文件所有权矩阵和 dispatch 示例、formalize Recharts 例外，并将 `scripts/check.sh` 增强为真实验证前端工具链；当前阻塞为 `eslint`、`tsc`、`next` 缺失。

### 2026-05-11

- task_id: `H007`
- source_ids: []
- story_ids: []
- action: 固化开发环境与交付验证入口。
- status: `done`
- notes: 将项目运行时声明为 Node.js 22，补充本地 setup 文档，更新 README，并让 `scripts/check.sh` 在本机自动优先使用 Homebrew `node@22` 完成交付验证。

### 2026-05-11

- task_id: `M001`
- source_ids: [`R003`, `R004`, `R005`, `R006`, `R007`, `R008`, `R009`, `R010`]
- story_ids: [`US006`, `US007`, `US008`, `US009`, `US010`, `US011`, `US012`, `US013`, `US014`, `US015`, `US016`]
- action: 拆解正式 MVP 需求并定义排班计划第一条前后端纵切。
- status: `done`
- notes: 第一条纵切确定为排班计划列表、排班计划详情、FastAPI 只读接口和本地种子数据；后续实现任务拆为 B001、F005 和 Q001。

### 2026-05-11

- task_id: `B001`
- source_ids: [`R007`, `R008`]
- story_ids: [`US010`, `US011`, `US013`, `US014`]
- action: 创建 FastAPI 排班计划只读接口纵切。
- status: `done`
- notes: 新增 `backend/**`，提供 `GET /api/v1/schedule-plans` 和 `GET /api/v1/schedule-plans/{plan_id}`；使用本地种子数据和标准库 unittest 验证，不接数据库、认证、真实 Excel 或真实 CORN。

### 2026-05-11

- task_id: `F005`
- source_ids: [`R005`, `R006`, `R007`, `R008`, `R009`]
- story_ids: [`US007`, `US008`, `US009`, `US012`, `US013`]
- action: 创建排班计划列表与详情前端纵切。
- status: `done`
- notes: 新增 `/schedule-plans` 和 `/schedule-plans/[planId]`，通过 `lib/schedule-plans.ts` 集中读取 B001 契约；页面仅展示只读计划、0.5h 时段、缺口和覆盖率，不提供新增、编辑、发布、审批、导出或批量操作。

### 2026-05-11

- task_id: `Q001`
- source_ids: [`R005`, `R006`, `R007`, `R008`, `R009`, `R010`]
- story_ids: [`US007`, `US008`, `US009`, `US010`, `US011`, `US012`, `US013`, `US014`, `US015`, `US016`]
- action: 验收排班计划第一条前后端只读纵切。
- status: `done`
- notes: 已验证 B001 后端 unittest、F005 前端 lint/typecheck/build、Harness check、路由生成、列表/详情 HTTP 200、接口字段追溯和 shadcn theme token 使用；未发现新增依赖、真实外部系统或越界业务能力。

### 2026-05-11

- task_id: `H008`
- source_ids: []
- story_ids: []
- action: 固化本地前后端联调启动入口。
- status: `done`
- notes: 新增 `scripts/dev.sh`，统一启动 FastAPI 与 Next.js dev server，默认 `BPO_API_BASE_URL=http://127.0.0.1:8000`；同步更新 README、backend README、setup 文档和 Harness check。

### 2026-05-11

- task_id: `H009`
- source_ids: []
- story_ids: []
- action: 优化连续交付提交流程。
- status: `done`
- notes: 已在 `AGENTS.md` 增加 Continuous Delivery Mode：用户显式要求连续执行或一口气交付时，绿色验证后直接提交；保留依赖、真实数据、数据库、认证、审批、导出、批量、生产公式和失败验证等停止条件。

### 2026-05-11

- task_id: `B002`
- source_ids: [`R011`]
- story_ids: [`US017`, `US018`]
- action: 创建 FastAPI 排班计划草稿创建与更新接口。
- status: `done`
- notes: 先写失败测试，再新增 `SchedulePlanDraftRequest`、草稿创建接口和草稿更新接口；仅使用本地内存数据，只允许更新 draft 计划，不接数据库、认证、真实 Excel、真实 CORN、发布、审批、导出或批量操作。

### 2026-05-11

- task_id: `H010`
- source_ids: [`R014`]
- story_ids: [`US021`]
- action: 将默认开发节奏改为 Story Runner 连续用户故事交付。
- status: `done`
- notes: 已在 AGENTS、Harness、Subagent Prompt Contract 和 Project State 中明确：goal 先拆最小用户故事，按依赖顺序自动执行、验证、提交并进入下一个 ready story；同一 story 内的 UI 反馈不再拆成多个小任务；Story Runner Mode 下允许 bounded subagents。

### 2026-05-11

- task_id: `F006`
- source_ids: [`R012`, `R011`]
- story_ids: [`US019`, `US017`]
- action: 创建前端排班计划草稿入口。
- status: `done`
- notes: 新增 `/schedule-plans/new` 和 server action，从列表进入新建草稿，提交后调用 B002 并跳转到详情页；不做完整编辑器、发布、审批、导出、批量、权限或数据库持久化。

### 2026-05-11

- task_id: `F007`
- source_ids: [`R013`, `R011`]
- story_ids: [`US020`, `US018`]
- action: 创建前端排班计划草稿更新入口。
- status: `done`
- notes: draft 详情页新增编辑入口，新增 `/schedule-plans/[planId]/edit` 和 server action，提交后调用 B002 PUT 并跳转回详情；非 draft 不展示编辑入口。

### 2026-05-11

- task_id: `Q002`
- source_ids: [`R011`, `R012`, `R013`]
- story_ids: [`US017`, `US018`, `US019`, `US020`]
- action: 验收排班计划草稿创建与更新纵切。
- status: `done`
- notes: 已验证 B002 后端 unittest、F006/F007 前端 lint/typecheck/build、Harness check、本地新建页 200、编辑页 200、POST 创建草稿和 PUT 更新草稿；仍不包含数据库、认证、权限、发布、审批、导出或批量。

### 2026-05-11

- task_id: `H011`
- source_ids: []
- story_ids: []
- action: 修复 Harness gate review 中发现的 backend Python、项目状态、侧边栏规则和审计结论不一致问题。
- status: `done`
- notes: `scripts/check.sh` 与 `scripts/dev.sh` 已显式选择可导入 FastAPI/Pydantic 的 backend Python；PROJECT_STATE 已同步当前前端脚手架 + 本地排班计划纵切阶段；AGENTS 二级导航规则已与 F002 对齐；audit-report 已标记过期结论。

### 2026-05-11

- task_id: `B003`
- source_ids: [`R015`]
- story_ids: [`US022`]
- action: 增加排班计划列表后端筛选。
- status: `done`
- notes: FastAPI 列表接口新增 `status` 和 `query` 查询参数；repository 支持按状态和关键词筛选；后端 unittest 新增 2 个筛选用例。

### 2026-05-11

- task_id: `F008`
- source_ids: [`R015`]
- story_ids: [`US023`]
- action: 增加排班计划列表前端筛选。
- status: `done`
- notes: `/schedule-plans` 读取 URL 中的 `query` / `status`，页面提供搜索、状态切换、清空筛选、筛选后汇总和空结果状态；表格保留排序。

### 2026-05-11

- task_id: `B004`
- source_ids: [`R016`]
- story_ids: [`US024`]
- action: 增加班次明细后端列表。
- status: `done`
- notes: FastAPI 新增 `GET /api/v1/shift-details`，将排班计划 intervals 展平成 0.5h 明细行；支持 `status` 和 `query`；后端 unittest 增加字段和关键词筛选覆盖。

### 2026-05-11

- task_id: `F009`
- source_ids: [`R016`]
- story_ids: [`US025`]
- action: 增加班次明细前端页面。
- status: `done`
- notes: 新增 `/shift-details`，侧边栏班次明细指向真实页面；页面提供关键词/状态筛选、汇总卡、明细表和返回计划链接。

### 2026-05-11

- task_id: `B005`
- source_ids: [`R017`]
- story_ids: [`US026`]
- action: 增加需求计划后端列表。
- status: `done`
- notes: FastAPI 新增 `GET /api/v1/demand-plans`，从本地 forecast 数据生成预测需求行；支持 `query`；后端 unittest 增加字段和关键词筛选覆盖。

### 2026-05-11

- task_id: `F010`
- source_ids: [`R017`]
- story_ids: [`US027`]
- action: 增加需求计划前端页面。
- status: `done`
- notes: 新增 `/demand-plans`，侧边栏需求计划指向真实页面；页面提供关键词搜索、汇总卡和预测需求表。

### 2026-05-12

- task_id: `F014`
- source_ids:
  - `R020`
- story_ids:
  - `US033`
- action: 完成 shadcn dashboard-01 无依赖视觉基线对齐。
- status: `done`
- notes: 已对齐 OKLCH token、sidebar token、sidebar 宽度和行高、metric cards container query、指标字号、chart natural curve 和 table row density；未新增依赖、未改 package/lockfile，剩余 Tabler/TanStack/DnD/Drawer 等完整 parity 项继续 gated。

### 2026-05-12

- task_id: `F013`
- source_ids:
  - `R020`
- story_ids:
  - `US032`
- action: 完成 shadcn dashboard-01 视觉差距审计。
- status: `done`
- notes: 新增 `docs/design/shadcn-dashboard-01-gap-audit.md`，按 P0/P1/P2 归类 token、sidebar/header、metric cards、chart/table、响应式、light/dark 和依赖门禁差距；未改 UI、未安装依赖。

### 2026-05-12

- task_id: `H014`
- source_ids:
  - `R020`
- story_ids:
  - `US032`
  - `US033`
- action: 插入 shadcn dashboard-01 前端视觉对齐需求。
- status: `done`
- notes: 已基于外部 spec 插入前端设计需求，拆分为先审计差距、再实施视觉对齐；实施阶段若涉及依赖、package/lockfile、字体、Tabler icons 或 shadcn 组件补齐，需要单独 Gate。

### 2026-05-12

- task_id: `B007/F012`
- source_ids:
  - `R019`
- story_ids:
  - `US030`
  - `US031`
- action: 新增排班风险提示最小能力。
- status: `done`
- notes: 新增 `GET /api/v1/schedule-risks`，在 `/schedule-plans` 增加风险提示区，合并展示时段缺口和生效中不可用记录；风险等级仅为本地 MVP 展示口径。

### 2026-05-12

- task_id: `B006/F011`
- source_ids:
  - `R018`
- story_ids:
  - `US028`
  - `US029`
- action: 新增计划与排班模块的不可用管理最小只读能力。
- status: `done`
- notes: 新增 `GET /api/v1/unavailability`，增加 `/unavailability` 页面和侧边栏入口；支持关键词、状态筛选、汇总卡、不可用记录表和跳转班次明细。

### 2026-05-12

- task_id: `H013`
- source_ids: []
- story_ids: []
- action: 固化阶段完成后的后续计划输出规则。
- status: `done`
- notes: 已将阶段/模块块完成后的固定汇报结构写入 AGENTS、Lightweight Harness、Done Report Template 和 Project State；后续 Done Report 必须说明完成内容、验证、剩余事项、推荐下阶段 2-3 项、推荐理由、暂不建议事项和默认下一项。

### 2026-05-11

- task_id: `H012`
- source_ids: []
- story_ids: []
- action: 快速修复 Harness 文档一致性残留问题。
- status: `done`
- notes: 已同步 lightweight-harness 当前阶段与分阶段路线，修正 AGENTS 中 Story Runner subagent 授权残留文案，并将 audit-report 中旧的 clean Harness 偏差风险降级为历史结论。

### 2026-05-12

- task_id: `H015`
- source_ids: []
- story_ids: []
- action: 固化绿色检查后的自动本地提交规则。
- status: `done`
- notes: PM 已确认以后本项目每完成一个通过 `bash scripts/check.sh` 的任务就自动本地 commit；阶段、模块块或连续开发块完成后再询问是否 push。

### 2026-05-12

- task_id: `H019`
- source_ids:
  - `R026`
- story_ids:
  - `US039`
- action: 修复开发服务器原生运行时签名/缺失导致的本地 500 风险。
- status: `done`
- notes: 已将 `npm run dev` 收口到 `scripts/run-next-dev.sh`，强制使用 Node.js 22、先做 `lightningcss` / `@next/swc-darwin-arm64` native preflight，再以 webpack dev server 启动；`bash scripts/check.sh` 已通过，且回归测试覆盖了支持运行时成功、默认 Codex Node 失败可识别和 dev 入口受控三类场景。

### 2026-05-12

- task_id: `H020`
- source_ids:
  - `R027`
- story_ids:
  - `US040`
- action: 固化 Python 3.12 开发运行时。
- status: `done`
- notes: 已新增 `.python-version` 和 `scripts/verify-backend-runtime.sh`，backend dev/check 入口现在只接受 Python 3.12；回归测试已覆盖支持运行时成功与系统 Python 3.9 失败可识别场景，`bash scripts/check.sh` 已通过。

### 2026-05-12

- task_id: `H017`
- source_ids:
  - `R028`
- story_ids:
  - `US041`
- action: 标准化任务分支、worktree、验证、提交、集成和 push 确认工作流。
- status: `done`
- notes: 已将 `AGENTS.md` 压缩为短版强制入口，新增 `docs/quality/GIT_BRANCH_WORKFLOW.md` 作为命令级 runbook，新增 `docs/quality/FRONTEND_RULES.md` 承接详细前端规则，并补充 Gate Registry、Done Report Template、Project State、Decision Log、Audit Report 和 Branch Log 的证据规则；不修改业务代码、依赖、package 或 lockfile。

### 2026-05-12

- task_id: `H018`
- source_ids:
  - `R029`
- story_ids:
  - `US042`
- action: 固化 No Database MVP Mode。
- status: `done`
- notes: 已明确功能完备前不接数据库；数据库连接、ORM、migration、schema 实现和生产持久化配置均为 hard stop。继续允许本地 FastAPI seed/process-memory 数据和前端 fallback 契约验证。

### 2026-05-12

- task_id: `F019`
- source_ids:
  - `R030`
- story_ids:
  - `US043`
- action: 增加本地 MVP 功能闭环入口。
- status: `done`
- notes: `/schedule-plans` 新增 No Database MVP 链路面板，连通需求计划、排班计划、风险明细、不可用管理和班次明细；未新增后端接口、mock 数据、依赖、package 或 lockfile。

### 2026-05-12

- task_id: `F020`
- source_ids:
  - `R031`
- story_ids:
  - `US044`
- action: 迁移排班计划主表到 TanStack Table 局部 parity。
- status: `done`
- notes: `SchedulePlanTable` 由 TanStack Table 管理列、行模型和排序；保留原字段与查看动作，不启用批量、拖拽、审批、导出、批量调班或生产动作。

### 2026-05-12

- task_id: `Q003`
- source_ids:
  - `R032`
- story_ids:
  - `US045`
- action: 完成本地 MVP no-database 验收审计。
- status: `done`
- notes: 审计记录 no-database 边界、本地 MVP 链路入口、计划表 table parity 和最终验证结果；数据库、真实集成、权限、审批、导出、批量和生产口径继续 deferred。

### 2026-05-12

- task_id: `F021`
- source_ids:
  - `R033`
- story_ids:
  - `US046`
- action: 补强排班计划详情复核链路。
- status: `done`
- notes: 详情页新增本地复核链路面板，展示缺口时段、关联风险、生效不可用计数，并提供班次、风险、不可用入口；未新增后端接口、数据库、真实数据或依赖。

### 2026-05-12

- task_id: `F022`
- source_ids:
  - `R034`
- story_ids:
  - `US047`
- action: 迁移班次明细到 TanStack Table。
- status: `done`
- notes: 新增 `ShiftDetailsTable` 组件，由 TanStack Table 管理班次明细列和排序；保持 display-only，不启用批量、拖拽、审批、导出或批量调班。

### 2026-05-12

- task_id: `F023`
- source_ids:
  - `R035`
- story_ids:
  - `US048`
- action: 迁移不可用记录到 TanStack Table。
- status: `done`
- notes: 新增 `UnavailabilityTable` 组件，由 TanStack Table 管理不可用记录列和排序；保留影响/班次动作并保持 display-only，不启用批量、拖拽、审批、导出或批量调班。

### 2026-05-12

- task_id: `Q004`
- source_ids:
  - `R036`
- story_ids:
  - `US049`
- action: 执行 F021-F023 本地链路 QA 验收收口。
- status: `done`
- notes: 验证复核链路入口与关键计数、班次明细 TanStack 表和不可用记录 TanStack 表；同步新增下一条 parity 目标 `R037/US050/F024` 为 ready。

### 2026-05-12

- task_id: `F024`
- source_ids:
  - `R037`
- story_ids:
  - `US050`
- action: 迁移需求计划到 TanStack Table。
- status: `done`
- notes: 新增 `DemandPlanTable` 组件，由 TanStack Table 管理需求计划列和排序；保留日期、时段、项目、职场、预测人数、来源、状态字段并保持 display-only。

### 2026-05-12

- task_id: `Q005`
- source_ids:
  - `R038`
- story_ids:
  - `US051`
- action: 执行 F024 单故事 QA 验收收口。
- status: `done`
- notes: 验证需求计划 TanStack 表渲染和字段完整性；同步新增下一条 parity 目标 `R039/US052/F025` 为 ready。

### 2026-05-12

- task_id: `F025`
- source_ids:
  - `R039`
- story_ids:
  - `US052`
- action: 迁移排班计划详情时段表到 TanStack Table。
- status: `done`
- notes: 新增 `SchedulePlanIntervalTable` 组件，由 TanStack Table 管理时段明细列和排序；保留开始、结束、预测、已排、缺口、覆盖率、备注字段并保持 display-only。

### 2026-05-12

- task_id: `Q006`
- source_ids:
  - `R040`
- story_ids:
  - `US053`
- action: 执行 F025 单故事 QA 验收收口。
- status: `done`
- notes: 验证排班计划详情页时段明细已由独立 TanStack Table 组件渲染并保留关键字段；同步新增下一条 parity 目标 `R041/US054/F026` 为 ready。

### 2026-05-12

- task_id: `F026`
- source_ids:
  - `R041`
- story_ids:
  - `US054`
- action: 迁移风险明细受影响班次表到 TanStack Table。
- status: `done`
- notes: 新增 `ScheduleRiskShiftTable` 组件，由 TanStack Table 管理关联班次列和排序；保留计划、状态、时段、预测、已排、缺口、覆盖率、备注字段并保持 display-only。

### 2026-05-12

- task_id: `Q007`
- source_ids:
  - `R042`
- story_ids:
  - `US055`
- action: 执行 F026 单故事 QA 验收收口。
- status: `done`
- notes: 验证风险明细页关联班次已由独立 TanStack Table 组件渲染并保留关键字段；下一条连续开发入口为 `R043/US056/F027`。

### 2026-05-12

- task_id: `F027`
- source_ids:
  - `R043`
- story_ids:
  - `US056`
- action: 迁移风险明细不可用影响表到 TanStack Table。
- status: `done`
- notes: 新增 `ScheduleRiskUnavailabilityTable` 组件，由 TanStack Table 管理风险明细页重叠不可用记录列和排序；保留人员、团队、时间、原因、状态、影响时段、备注字段并保持 display-only。

### 2026-05-12

- task_id: `Q008`
- source_ids:
  - `R044`
- story_ids:
  - `US057`
- action: 执行 F027 单故事 QA 验收收口。
- status: `done`
- notes: 验证风险明细页不可用影响表已由独立 TanStack Table 组件渲染并保留关键字段。

### 2026-05-12

- task_id: `F028`
- source_ids:
  - `R045`
- story_ids:
  - `US058`
- action: 迁移不可用影响详情受影响班次表到 TanStack Table。
- status: `done`
- notes: 新增 `UnavailabilityImpactShiftTable` 组件，由 TanStack Table 管理不可用影响详情页受影响班次列和排序；保留计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作字段并保持 display-only。

### 2026-05-12

- task_id: `Q009`
- source_ids:
  - `R046`
- story_ids:
  - `US059`
- action: 执行 F028 单故事 QA 验收收口。
- status: `done`
- notes: 验证不可用影响详情页受影响班次表已由独立 TanStack Table 组件渲染并保留关键字段。

### 2026-05-12

- task_id: `F029`
- source_ids:
  - `R047`
- story_ids:
  - `US060`
- action: 迁移不可用影响详情关联风险表到 TanStack Table。
- status: `done`
- notes: 新增 `UnavailabilityImpactRiskTable` 组件，由 TanStack Table 管理不可用影响详情页关联风险列和排序；保留风险、时段、缺口、不可用、原因、建议和动作字段并保持 display-only。

### 2026-05-12

- task_id: `Q010`
- source_ids:
  - `R048`
- story_ids:
  - `US061`
- action: 执行 F029 单故事 QA 验收收口。
- status: `done`
- notes: 验证不可用影响详情页关联风险表已由独立 TanStack Table 组件渲染并保留关键字段。

### 2026-05-12

- task_id: `Q011`
- source_ids:
  - `R049`
- story_ids:
  - `US062`
- action: 执行详情页 table parity 连续开发块 QA 总收口。
- status: `done`
- notes: 验证风险明细两张表与不可用影响详情两张表均已迁移为独立 TanStack Table 组件，相关详情页动作入口保持可用；本条连续 parity 链已收口完毕。

### 2026-05-12

- task_id: `H022`
- source_ids:
  - `R051`
- story_ids:
  - `US063`
- action: 落地 Harness 状态治理 v3 第一轮。
- status: `done`
- notes: 新增 current/registry 状态层、`scripts/check-state.sh`、State Hygiene/Repair Gate、History-On-Demand、archive 不可执行和 single-writer 规则；不迁移大量 done 历史、不改业务代码、不改依赖、不接数据库。

### 2026-05-12

- task_id: `H023`
- source_ids:
  - `R052`
- story_ids:
  - `US064`
- action: 将 check-state 接入标准验证链路并补回归测试。
- status: `done`
- notes: `bash scripts/check.sh` 现在运行 warning-only state check 和 `scripts/tests/check-state.test.mjs`；回归覆盖一致状态、warning-only 不自锁、strict 缺 active task 失败和 TRACE_INDEX lifecycle state 失败。

### 2026-05-12

- task_id: `H024`
- source_ids:
  - `R053`
- story_ids:
  - `US065`
- action: 用 current queue 执行真实治理小任务冒烟。
- status: `done`
- notes: H024/US065 曾写入 `docs/current/STORY_QUEUE.yaml` 与 `docs/current/ACTIVE_TASKS.yaml` 并通过 `bash scripts/check-state.sh --strict`；完成后 current queue 已清空，历史定位保留在 registry 和 legacy traceability 中。

### 2026-05-12

- task_id: `H025`
- source_ids:
  - `R054`
- story_ids:
  - `US066`
- action: 补强 current done history 不变量检查。
- status: `done`
- notes: `scripts/check-state.sh` 现在会检测 current story/task 文件中的 `status: done`；warning-only 模式只告警，strict 模式失败，回归测试覆盖 done story 和 done task 场景。

### 2026-05-12

- task_id: `H026`
- source_ids:
  - `R055`
- story_ids:
  - `US067`
- action: 将标准 check-state 升级为 strict 默认阻断。
- status: `done`
- notes: `bash scripts/check.sh` 默认运行 `bash scripts/check-state.sh --strict`；State Repair Mode 可显式使用 `BPO_STATE_CHECK_MODE=repair-scope`，临时诊断可显式使用 `BPO_STATE_CHECK_MODE=warning`。

### 2026-05-13

- task_id: `H027`
- source_ids:
  - `R056`
- story_ids:
  - `US068`
- action: 补强 TRACE_INDEX current_files 路径校验。
- status: `done`
- notes: `scripts/check-state.sh` 现在会校验 `TRACE_INDEX.yaml` 中 `current_files` 的路径，并对重复 registry 路径输出去重；回归测试覆盖缺失 current file path 的 strict 失败。

### 2026-05-13

- task_id: `H028`
- source_ids:
  - `R057`
- story_ids:
  - `US069`
- action: 固化 Codex Plan 面板边界规则。
- status: `done`
- notes: `AGENTS.md` 和 `docs/quality/STATE_MANAGEMENT.md` 明确 Codex Plan 只是当前会话投影视图，不是状态源；若 Plan 与 Harness state 冲突，以 Harness state 为准。

### 2026-05-13

- task_id: `F030`
- source_ids:
  - `R058`
- story_ids:
  - `US070`
- action: 迁移 dashboard BPO 异常明细表到 TanStack Table。
- status: `done`
- notes: `components/data-table.tsx` 现在由 TanStack Table 管理本地排序、搜索过滤和分页；新增 `components/data-table-model.ts` 与无依赖模型测试覆盖搜索和页码夹紧。

### 2026-05-31

- task_id: `IM031`
- source_ids:
  - `R731`
- story_ids:
  - `US651`
- action: 增加导入中心上传前模板适配提示，并修复 data-quality 页面在 in-app browser 停留骨架屏的问题。
- status: `done`
- notes: `/data-quality` 上传区现在按文件类型展示启用模板数、推荐说明、映射字段数和手填 JSON 兜底；移除路由级 loading fallback，确保主内容可见。

### 2026-05-31

- task_id: `IM032`
- source_ids:
  - `R732`
- story_ids:
  - `US652`
- action: 增加导入中心应用前行动建议。
- status: `done`
- notes: `/data-quality` 应用准备度侧栏现在把 readiness、失败行、行级阻塞、版本和已应用状态转成下一步建议；保持只读，不新增 apply 写按钮。

### 2026-05-31

- task_id: `IM033`
- source_ids:
  - `R733`
- story_ids:
  - `US653`
- action: 增加导入中心异常态处理建议。
- status: `done`
- notes: `/data-quality` 现在把批次 API、准备度 API、模板 API、暂无批次和暂无模板收敛到同一只读建议区；保持只读，不新增 apply 写按钮、后端、数据库或生产流程能力。

### 2026-05-31

- task_id: `IM034`
- source_ids:
  - `R734`
- story_ids:
  - `US654`
- action: 增加导入中心上传结果批次入口。
- status: `done`
- notes: `/data-quality` 现在能根据 upload query 展示 CSV 上传成功/失败结果、批次入口和下一步复核路径；保持只读，不新增 apply 写按钮、后端、数据库或生产流程能力。

### 2026-06-01

- task_id: `IM035`
- source_ids:
  - `R735`
- story_ids:
  - `US655`
- action: 增加导入中心接入批次筛选。
- status: `done`
- notes: `/data-quality` 接入批次列表现在支持关键词、文件类型、处理状态和应用状态筛选，展示匹配数量、可点击批次行和无匹配空态；保持前端本地筛选，不新增后端查询、schema/migration、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM036`
- source_ids:
  - `R736`
- story_ids:
  - `US656`
- action: 增加导入中心选中批次处理导览。
- status: `done`
- notes: `/data-quality` 现在对选中批次展示只读处理导览，并提供到批次明细、失败行修正和应用准备度的锚点定位；保持前端只读导航，不新增后端、schema/migration、apply 写按钮、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM047`
- source_ids:
  - `R747`
- story_ids:
  - `US667`
- action: 增加应用准备度问题分组。
- status: `done`
- notes: `/data-quality/[batchId]` 的状态检查现在按失败行、行级必填字段、版本/应用状态和批次级阻塞展示准备度问题组，每组包含数量、影响说明、证据和下一步；保持只读展示，不新增应用写入、批量、审批、导出、权限、后端或生产流程能力。

### 2026-06-01

- task_id: `IM046`
- source_ids:
  - `R746`
- story_ids:
  - `US666`
- action: 增加字段映射模板适配详情。
- status: `done`
- notes: `/data-quality/[batchId]` 的导入与模板页签现在按当前批次文件类型展示模板适配、推荐模板、字段覆盖、建议缺口和 source -> standard 映射明细；保持只读展示，不新增模板 CRUD、依赖、后端、schema/migration、真实外部接口、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM045`
- source_ids:
  - `R745`
- story_ids:
  - `US665`
- action: 重设计数据质量批次详情页为单列处理流。
- status: `done`
- notes: `/data-quality/[batchId]` 现在按批次头部、处理总览和全宽批次处理 Tabs 组织；状态检查作为默认 Tab，不再使用左右分栏或“分层详情”文案；修正结果反馈在默认状态检查 Tab 下仍可见；不新增依赖、后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM044`
- source_ids:
  - `R744`
- story_ids:
  - `US664`
- action: 修正数据质量批次二级详情导航。
- status: `done`
- notes: `/data-quality` 现在只保留概览、筛选和批次列表；状态检查器、分层详情、失败行修正、结果追踪和导入模板集中在 `/data-quality/[batchId]`；旧 `/data-quality/import-batches/[batchId]` 保留兼容跳转；不新增依赖、后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM043`
- source_ids:
  - `R743`
- story_ids:
  - `US663`
- action: 拆分数据质量批次处理详情页。
- status: `done`
- notes: `/data-quality` 现在只保留批次概览、筛选、列表和选中批次状态摘要；批次明细、失败行修正、结果追踪和导入模板迁移到 `/data-quality/import-batches/[batchId]`；不新增依赖、后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM042`
- source_ids:
  - `R742`
- story_ids:
  - `US662`
- action: 增加数据质量页下游结果列表可见性。
- status: `done`
- notes: `/data-quality` 分层详情新增 `结果追踪` Tab，按选中批次业务日读取已有 comparison-runs 和 review-cases，并以只读摘要、列表、空态和 detail 链接口径展示；不新增依赖、后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM049`
- source_ids:
  - `R749`
- story_ids:
  - `US669`
- action: 增加数据质量到异常反向聚合。
- status: `done`
- notes: `/data-quality/[batchId]` 的结果追踪页签现在展示质量影响聚合，按错误字段和错误原因分组失败/警告行，并关联当前业务日复核案例、未关闭数量和对比结果候选。保持前端只读，不新增后端、schema/migration、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM048`
- source_ids:
  - `R748`
- story_ids:
  - `US668`
- action: 增加批次详情下游结果追踪 drilldown。
- status: `done`
- notes: `/data-quality/[batchId]` 的结果追踪页签现在展示下游结果判断、优先对比线索、优先复核线索、判断证据和只读入口；未应用或准备度阻塞时引导先处理导入阻塞。保持前端只读，不新增后端、schema/migration、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM037`
- source_ids:
  - `R737`
- story_ids:
  - `US657`
- action: 增加导入中心应用状态概览。
- status: `done`
- notes: `/data-quality` 现在对选中批次展示只读应用状态概览，汇总应用状态、应用目标、导入版本、已应用记录数和下一步判断；保持前端只读展示，不新增后端、schema/migration、apply 写按钮、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM038`
- source_ids:
  - `R738`
- story_ids:
  - `US658`
- action: 增强导入中心批次明细可读性。
- status: `done`
- notes: `/data-quality` 的批次明细现在展示处理摘要、下一步只读建议和错误字段摘要，全部行结果表也直接展示错误字段；保持前端只读展示，不新增后端、schema/migration、apply 写按钮、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM041A`
- source_ids:
  - `R741`
- story_ids:
  - `US661`
- action: 重构数据质量页信息架构。
- status: `done`
- notes: `/data-quality` 现在按顶部概览、接入批次工作台、选中批次状态检查器和分层详情 Tabs 组织；批次明细、失败行修正、导入与模板被收纳到分层详情，`ImportCenterApiPanel` 改为薄组合层；不新增依赖、业务能力、后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM040`
- source_ids:
  - `R740`
- story_ids:
  - `US660`
- action: 增加导入中心应用结果到下游结果导航。
- status: `done`
- notes: `/data-quality` 的应用准备度区域现在展示只读下游结果导航，按批次应用状态、文件类型、版本和质量状态提示对比结果 API、复核案例 API 或前置修正路径；不新增后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-06-01

- task_id: `IM039`
- source_ids:
  - `R739`
- story_ids:
  - `US659`
- action: 增加导入中心数据质量到履约异常追踪可见性。
- status: `done`
- notes: `/data-quality` 的批次明细现在展示只读履约异常影响追踪，按文件类型、失败行、警告行和版本记录解释可能影响的异常判断；不新增后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限或生产流程能力。

### 2026-05-13

- task_id: `F031`
- source_ids:
  - `R059`
- story_ids:
  - `US071`
- action: 补 dashboard 异常明细表本地列显示和分页大小控制。
- status: `done`
- notes: 列控制从占位按钮改为本地字段显示开关，分页大小可在 5/10/20 条之间切换；不触发后端写入、审批、导出、批量或生产动作。

### 2026-05-13

- task_id: `Q012`
- source_ids:
  - `R060`
- story_ids:
  - `US072`
- action: 执行 F030-F031 dashboard table parity QA 收口。
- status: `done`
- notes: 验证 dashboard 异常明细表已完成 TanStack Table parity 和本地交互收口；current queue 与 active tasks 已清空，不保留 done 历史。

### 2026-05-13

- task_id: `F032-F040`
- source_ids:
  - `R061-R069`
- story_ids:
  - `US073-US081`
- action: 连续完成 dashboard 本地 parity 和摘要增强。
- status: `done`
- notes: 异常明细表新增本地严重度/状态筛选、筛选摘要、重置、分页范围和首页/末页；数据接入状态迁移为 TanStack Table 并支持状态筛选和摘要；热力图新增缺口摘要、峰值缺口和可访问标签。

### 2026-05-13

- task_id: `Q013`
- source_ids:
  - `R070`
- story_ids:
  - `US082`
- action: 执行 F032-F040 dashboard 连续开发块 QA 收口。
- status: `done`
- notes: 10 个任务均保持 no-database、本地展示层边界；未新增依赖、未改后端契约、未引入真实同步、审批、导出、批量或生产公式；current queue 与 active tasks 已清空。

### 2026-05-13

- task_id: `F041-F059`
- source_ids:
  - `R071-R089`
- story_ids:
  - `US083-US101`
- action: 连续完成排班计划、风险提示、不可用三张表的本地 parity 增强。
- status: `done`
- notes: 排班计划表新增本地摘要、查询、状态/缺口筛选、重置、分页和列控制；风险提示表新增摘要、等级筛选、搜索、重置和分页；不可用表新增摘要、状态筛选、搜索、重置、分页和列控制。

### 2026-05-13

- task_id: `Q014`
- source_ids:
  - `R090`
- story_ids:
  - `US102`
- action: 执行 F041-F059 20-task table parity QA 收口。
- status: `done`
- notes: 模型测试覆盖三张表的本地筛选与统计；未新增依赖、未改后端契约、未接数据库、未引入审批、导出、批量、权限或生产公式；current queue 与 active tasks 已清空。

### 2026-06-01

- task_id: `IM051`
- source_ids:
  - `R751`
- story_ids:
  - `US671`
- action: 增加批次详情结果追踪的只读复核结论预览。
- status: `done`
- notes: `/data-quality/[batchId]` 结果追踪现在汇总建议结论、关键证据、残余风险和下一步；本轮不新增复核关闭写入、后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-01

- task_id: `IM052`
- source_ids:
  - `R752`
- story_ids:
  - `US672`
- action: 增加批次详情结果追踪的只读复核证据缺口 drilldown。
- status: `done`
- notes: `/data-quality/[batchId]` 结果追踪现在按未关闭复核案例展示缺口风险、owner、需补证据、质量问题线索、对比结果线索和下一步；本轮不新增证据补录、复核关闭写入、后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-01

- task_id: `IM053`
- source_ids:
  - `R753`
- story_ids:
  - `US673`
- action: 拆出复核案例工作台二级页。
- status: `done`
- notes: 新增 `/data-quality/review-cases` 只读工作台，支持业务日、owner、状态、严重度、来源和关键词筛选，展示摘要、分组和案例表；批次详情的复核入口跳转到二级页；本轮不新增证据补录、复核关闭写入、后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-01

- task_id: `IM054`
- source_ids:
  - `R754`
- story_ids:
  - `US674`
- action: 增加质量问题到复核案例工作台的只读聚焦跳转。
- status: `done`
- notes: `/data-quality/[batchId]` 质量影响聚合每个问题组现在提供“查看相关复核案例”，跳转到 `/data-quality/review-cases` 并带入业务日、未关闭状态、来源类型和质量关键词焦点；复核案例工作台展示焦点条件但不提供证据补录、复核关闭、审批、导出、批量、权限、后端、schema/migration、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM055`
- source_ids:
  - `R755`
- story_ids:
  - `US675`
- action: 增加复核案例只读二级详情页。
- status: `done`
- notes: 新增 `/data-quality/review-cases/[caseId]`，复核案例工作台列表可进入单个案例详情；详情页展示案例摘要、来源结果、质量焦点、证据缺口、证据/结论记录和只读处理边界；本轮不新增证据补录、复核关闭写入、审批、导出、批量、权限、后端、schema/migration、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM056`
- source_ids:
  - `R756`
- story_ids:
  - `US676`
- action: 增加复核案例详情正常态本地数据准备。
- status: `done`
- notes: 新增 `seed_review_case_demo()`，可在本地 sqlite 库中复用现有 DB007/DB008 repository 和 schema 生成 `CASE-QUERY-001`、来源对比结果、证据和结论，重复执行返回已存在案例；本轮不新增 schema/migration、依赖、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM057`
- source_ids:
  - `R757`
- story_ids:
  - `US677`
- action: 增加复核案例详情的只读来源结果上下文。
- status: `done`
- notes: `/api/v1/review-cases/{case_id}` 现在返回 `source_result`，详情页新增“来源结果明细”区块，展示业务日、时段、职场、项目、技能和差异指标；本轮不新增 schema/migration、依赖、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM058`
- source_ids:
  - `R758`
- story_ids:
  - `US678`
- action: 增加复核案例详情的只读来源链路反查。
- status: `done`
- notes: `/api/v1/review-cases/{case_id}` 现在返回 `source_trace`，详情页新增“来源链路”区块，展示计算运行、业务版本、导入版本和导入批次；本轮不新增 schema/migration、依赖、真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM059`
- source_ids:
  - `R759`
- story_ids:
  - `US679`
- action: 增加复核案例来源运行的只读前端详情入口。
- status: `done`
- notes: 新增 `/data-quality/comparison-runs/[runId]` 二级页，展示对比运行摘要、来源版本、结果明细和处理边界；复核案例来源链路提供“查看运行详情”，批次详情中的对比运行 action 改为前端详情路由；本轮不新增 schema/migration、依赖、真实外部接口、计算触发、证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM060`
- source_ids:
  - `R760`
- story_ids:
  - `US680`
- action: 增加对比运行详情页的关联复核案例定位。
- status: `done`
- notes: `/data-quality/comparison-runs/[runId]` 新增“关联复核案例”区块，按当前运行结果的 `source_result_type + source_result_id` 匹配同业务日复核案例，并提供 `/data-quality/review-cases/[caseId]` 前端详情入口；本轮不新增后端、schema/migration、依赖、真实外部接口、计算触发、证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM061`
- source_ids:
  - `R761`
- story_ids:
  - `US681`
- action: 增加复核案例详情页的只读证据与结论链路。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 新增“证据与结论链路”区块，汇总证据数、结论数、关闭状态和下一步建议，并按时间展示证据、结论和关闭记录；详情主体调整为单列分层，避免左右分栏和长页堆叠；本轮不新增后端、schema/migration、依赖、真实外部接口、证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM062`
- source_ids:
  - `R762`
- story_ids:
  - `US682`
- action: 增加复核案例详情页受控关闭写入入口。
- status: `done`
- notes: `POST /api/v1/review-cases/write-closure` 现在可对已存在且未关闭的复核案例写入 closure；`/data-quality/review-cases/[caseId]` 在证据和结论齐全时展示关闭入口，关闭后展示已关闭阻塞态且不再提供提交按钮；本轮不新增依赖、package/lockfile、schema/migration、真实外部接口、证据补录、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM063`
- source_ids:
  - `R763`
- story_ids:
  - `US683`
- action: 增加复核案例详情页受控证据补录入口。
- status: `done`
- notes: 新增 `POST /api/v1/review-cases/{case_id}/evidence`，可对已存在且未关闭的复核案例新增一条 evidence 并返回最新详情；详情页新增“补充复核证据”独立 panel，open case 展示提交入口，closed case 展示阻塞原因；本轮不新增依赖、package/lockfile、schema/migration、真实外部接口、结论新增、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM064`
- source_ids:
  - `R764`
- story_ids:
  - `US684`
- action: 增加复核案例详情页受控结论补充入口。
- status: `done`
- notes: 新增 `POST /api/v1/review-cases/{case_id}/conclusion`，可对已存在且未关闭的复核案例新增一条 conclusion 并返回最新详情；详情页新增“补充复核结论”独立 panel，位于证据补录之后、关闭入口之前；open case 展示提交入口，closed case 展示阻塞原因；本轮不新增依赖、package/lockfile、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM065`
- source_ids:
  - `R765`
- story_ids:
  - `US685`
- action: 增加复核案例详情页只读处理时间线。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 新增“处理时间线”独立区块，按时间聚合 evidence、conclusions 和 closure，展示阶段、处理人、时间、处理说明、当前阶段和下一步建议；本轮不新增后端、schema/migration、依赖、写入动作、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM066`
- source_ids:
  - `R766`
- story_ids:
  - `US686`
- action: 增加复核案例工作台只读处理阶段筛选。
- status: `done`
- notes: `/data-quality/review-cases` 新增处理阶段筛选和阶段列，支持缺证据、缺结论、可关闭、已关闭和阶段未知；阶段由现有详情 API 的 evidence、conclusions 和 closure 记录派生；本轮不新增后端、schema/migration、依赖、写入动作、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM067`
- source_ids:
  - `R767`
- story_ids:
  - `US687`
- action: 增加复核案例工作台只读 Owner 阶段负载矩阵。
- status: `done`
- notes: `/data-quality/review-cases` 新增 `Owner 阶段负载` 矩阵，按 owner 聚合缺证据、缺结论、可关闭、已关闭和阶段未知案例数；非零单元格进入对应 `ownerId + processingStage` 过滤列表；本轮不新增后端、schema/migration、依赖、写入动作、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM068`
- source_ids:
  - `R768`
- story_ids:
  - `US688`
- action: 增加复核案例详情页只读同 Owner 处理上下文。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 新增 `同 Owner 处理上下文` 区块，展示同 owner 同业务日的其他案例、处理阶段、证据/结论状态、严重度和详情入口；提供 `查看 Owner 列表` 和 `进入首要阶段` 链接；本轮不新增后端、schema/migration、依赖、写入动作、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM069`
- source_ids:
  - `R769`
- story_ids:
  - `US689`
- action: 增加复核案例详情页只读同 Owner 待处理导航。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 的 `同 Owner 处理上下文` 内新增 `同 Owner 待处理导航` 操作条，展示当前案例在同 owner 同业务日待处理序列中的位置，提供上一条/下一条入口；当前案例已关闭或不在待处理序列时提供进入首条待处理入口；本轮不新增后端、schema/migration、依赖、写入动作、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM070`
- source_ids:
  - `R770`
- story_ids:
  - `US690`
- action: 增加复核案例工作台只读同 Owner 首条待处理入口。
- status: `done`
- notes: `/data-quality/review-cases` 的分组面板新增 `同 Owner 首条待处理` 区块，按 owner 展示当前筛选结果中的待处理数量、首条待处理阶段、详情入口和 owner 列表入口；本轮不新增后端、schema/migration、依赖、写入动作、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM071`
- source_ids:
  - `R771`
- story_ids:
  - `US691`
- action: 整合复核案例详情页处理动作区。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 新增统一 `处理动作区`，展示当前推荐动作、证据/结论/关闭材料状态，并用 tab 收纳补证据、补结论和关闭案例三个现有受控入口；本轮不新增后端 route、schema/migration、依赖、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM072`
- source_ids:
  - `R772`
- story_ids:
  - `US692`
- action: 统一复核动作提交反馈。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 读取现有 `evidence`、`conclusion`、`closure` 提交结果参数，并在 `处理动作区` 顶部展示动作名称、写入结果和下一步建议；无提交结果参数时不展示反馈条；本轮不新增后端 route、schema/migration、依赖、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-02

- task_id: `IM073`
- source_ids:
  - `R773`
- story_ids:
  - `US693`
- action: 增加复核提交后的续办导航。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 在提交反馈出现时新增 `续办导航`，优先展示同 owner 下一条待处理案例入口，并提供返回同 owner 复核列表入口；复用现有 review-case list 数据和 detail 阶段快照；本轮不新增后端 route、schema/migration、依赖、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM074`
- source_ids:
  - `R774`
- story_ids:
  - `US694`
- action: 增加复核提交失败后的重试定位。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 在 `evidence=failed`、`conclusion=failed` 或 `closure=failed` 时新增 `重试定位` 提示，并默认打开对应动作 tab；成功或无反馈时不展示该提示；本轮不新增后端 route、schema/migration、依赖、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM075`
- source_ids:
  - `R775`
- story_ids:
  - `US695`
- action: 修正复核提交成功后的当前案例优先续办。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 在成功反馈出现时识别当前案例是否仍在同 owner 待处理序列中；当前案例仍缺下一步材料时，续办主入口优先展示 `继续处理当前案例` 并指向当前详情页，当前案例已关闭或不在待处理序列时再进入同 owner 下一条；本轮不新增后端 route、schema/migration、依赖、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM076`
- source_ids:
  - `R776`
- story_ids:
  - `US696`
- action: 增加复核关闭成功后的队列交接提示。
- status: `done`
- notes: `/data-quality/review-cases/[caseId]` 在 `closure=success` 且当前案例已离开待处理序列时，续办导航明确展示 `当前案例已关闭`，并将主入口标为 `关闭后处理下一条`；本轮不新增后端 route、schema/migration、依赖、页面路由、新 UI 组件、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM077`
- source_ids:
  - `R777`
- story_ids:
  - `US697`
- action: 让复核续办返回列表保留未关闭焦点。
- status: `done`
- notes: 同 Owner 待处理导航和提交后续办导航的 `返回同 Owner 列表` 链接现在带 `status=open`，主管从详情返回列表时仍停留在未关闭处理队列；本轮不新增后端 route、schema/migration、依赖、页面路由、新 UI 组件、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM078`
- source_ids:
  - `R778`
- story_ids:
  - `US698`
- action: 新增字段映射模板维护详情页。
- status: `done`
- notes: 新增 `/data-quality/field-mapping-templates/[templateId]` 二级页，展示字段映射模板详情、字段映射明细、更新表单和停用入口；批次详情页模板卡片新增 `维护模板` 入口；本轮复用现有模板 PATCH 和 deactivate API，不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM079`
- source_ids:
  - `R779`
- story_ids:
  - `US699`
- action: 新增字段映射模板新增页。
- status: `done`
- notes: 新增 `/data-quality/field-mapping-templates/new` 二级页，支持填写模板 ID、名称、文件类型、创建人和字段映射 JSON，提交后调用现有 create template API 并跳转对应模板详情页；字段映射模板管理区新增 `新增模板` 入口；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM080`
- source_ids:
  - `R780`
- story_ids:
  - `US700`
- action: 打通字段映射模板上传预选链路。
- status: `done`
- notes: 批次详情的模板维护入口会带来源 `batchId`，模板详情页对启用模板展示 `用此模板上传` 入口，返回批次处理页后默认打开 `导入与模板` tab，并在 CSV 上传表单中默认选中可用模板、提示停用或缺失模板不可用；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM081`
- source_ids:
  - `R781`
- story_ids:
  - `US701`
- action: 新增独立 CSV 上传工作区。
- status: `done`
- notes: 新增 `/data-quality/uploads/new` 二级页，复用现有 CSV 上传表单、上传 action 和字段映射模板 API；数据质量列表页提供 `上传 CSV` 入口，模板详情页在无来源批次时也可携带 `templateId` 进入独立上传页；上传页用 `上传 CSV` / `字段映射模板` tab 分层，避免继续堆叠到批次详情长页；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM082`
- source_ids:
  - `R782`
- story_ids:
  - `US702`
- action: 独立上传结果回流到上传工作区。
- status: `done`
- notes: 独立上传页的 CSV 表单现在携带受控 `result_redirect_to=/data-quality/uploads/new` 返回目标，上传成功或失败后回到独立上传页显示反馈；成功和带批次失败反馈入口直达 `/data-quality/{batchId}` 二级批次处理页；批次详情页上传表单不设置该返回目标，保持原有回流行为；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-03

- task_id: `IM083`
- source_ids:
  - `R783`
- story_ids:
  - `US703`
- action: 新增单批次导入应用写入入口。
- status: `done`
- notes: 批次处理详情页新增单批次应用区；readiness ready 且未应用时展示 `应用到业务数据` 提交入口，按 file_type 调用现有 apply API；应用成功或失败后回到当前批次详情页展示反馈；阻塞、已应用或准备度未知时只展示原因，不展示写入按钮；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-04

- task_id: `IM107`
- source_ids:
  - `R807`
- story_ids:
  - `US727`
- action: 增加状态字典与异常解释安全壳。
- status: `done`
- notes: `/actual-logs/production/[batchId]` 在处理解释页新增状态字典与异常解释安全壳，展示状态字典、未知状态、时区错误、跨天异常和冻结员工引用边界；字典变更、异常规则提交和实际工时重算动作均保持禁用；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM141`
- source_ids:
  - `R841`
- story_ids:
  - `US761`
- action: 新增职场详情页并把运营主体收敛到职场子页面。
- status: `done`
- notes: `/master-data/sites` 的职场列表行新增 `详情` 入口，进入 `/master-data/sites/[workplaceId]` 后展示职场基础信息和该职场下的运营主体；运营主体只从现有人员档案与绑定关系读取，不恢复 `职场运营主体` 或 `绑定关系` 独立导航/实体页；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算、供应商合同、最低人力或收费因子；current queue 与 active tasks 保持为空。

### 2026-06-05

- task_id: `IM142`
- source_ids:
  - `R842`
- story_ids:
  - `US762`
- action: 新增供应商详情页并把服务职场收敛到供应商子页面。
- status: `done`
- notes: `/master-data/vendors` 的供应商列表行新增 `详情` 入口，进入 `/master-data/vendors/[vendorId]` 后展示供应商基础信息和该供应商当前服务职场；服务职场可回链对应职场详情；侧边栏默认展开全部一级组，职场/供应商详情页继承父级高亮；本轮不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算、供应商合同、最低人力或收费因子；current queue 与 active tasks 保持为空。

### 2026-06-05

- task_id: `IM143`
- source_ids:
  - `R843`
- story_ids:
  - `US763`
- action: 在客服人员列表内新增批量导入大弹窗。
- status: `done`
- notes: `/master-data/agents` 右上角 `批量导入` 不再跳转独立上传工作区，而是在当前列表页打开三步大弹窗；第一步提供人员导入模板下载和 CSV 上传字段，第二步支持启用的主数据映射模板或手动字段映射 JSON，第三步展示本次导入摘要并提供 `查看批次详情` 和 `失败行修正` 入口；完整行结果、readiness、应用到业务数据和版本链路仍由批次详情页承载；本轮不新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM144`
- source_ids:
  - `R844`
- story_ids:
  - `US764`
- action: 统一全局 UI 组件规范并纠正客服人员导入弹窗。
- status: `done`
- notes: 全局布局改为 shadcn `SidebarProvider` / `Sidebar` / `SidebarInset`，`AppSidebar` 按 shadcn 文档使用 `Collapsible`、`SidebarMenuButton` 和 `SidebarMenuSub` 组织一级/二级导航，并在 Sidebar footer 使用 shadcn Avatar 和本地参考头像 `/shadcn-avatar.jpg`，增加本地用户菜单、明暗主题切换和登出入口；`SiteHeader` 统一承载单行 Breadcrumb，Breadcrumb 包含当前页，不再额外渲染第二行视觉 H1，并去掉无意义全局搜索、固定月份和通知占位，新增右侧页面级 actions 插槽；主数据列表、详情、新建、编辑页接入 `breadcrumbItems`；主数据内容区不再重复返回按钮、同名 H1 或页面级说明，页面身份由全局 Header 唯一承载；客服人员列表改为筛选卡片、列表操作栏、表格顺序，查询/重置位于筛选卡片右下，新建/批量导入进入 Header 右侧，列表操作栏只保留已选/批量动作；客服人员导入改为 shadcn Dialog 的 step-by-step 流程，上传、映射、结果 section 通过 `hidden` 隐藏但保持 DOM 挂载；页面级反馈、表单结果和导入结果摘要改用 Alert；本轮不新增排班、预测、登录/状态日志导入弹窗，不接入真实 auth，不修改 package/lockfile，不新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM145`
- source_ids:
  - `R845`
- story_ids:
  - `US765`
- action: 收口 Sidebar 一级导航信息架构。
- status: `done`
- notes: Sidebar 已移除 `预测生产`、`排班生产` 独立导航项；`需求计划` 使用 prefix active 覆盖 `/demand-plans/production/**`，`排班计划` 使用 prefix active 覆盖 `/schedule-plans/production/**`；结构测试已禁止 `预测生产`、`排班生产`、`导入中心`、`质量中心`、`数据质量` 作为 Sidebar 标题出现；本轮不改生产页标题、返回按钮、模型文案、导入弹窗、业务路由或后端能力；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM146`
- source_ids:
  - `R846`
- story_ids:
  - `US766`
- action: 清理生产文案与返回链路。
- status: `done`
- notes: `/demand-plans/production`、`/schedule-plans/production`、`/actual-logs/production` 保持兼容路由，但页面标题、列表标题、详情返回按钮和模型阻塞/就绪/缺批次提示改回预测版本、排班版本、登录/状态日志处理等业务对象视角；focused tests 和 Browser smoke 已覆盖不再展示旧生产模块文案；本轮不改路由结构、重复 H1、旧搜索 API、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM147`
- source_ids:
  - `R847`
- story_ids:
  - `US767`
- action: 统一 Header/Breadcrumb 与内容区标题层级。
- status: `done`
- notes: 需求计划、排班计划、预测版本、排班版本、登录/状态日志和 data-quality 兼容页统一传入 `breadcrumbItems`；内容区同名页面 H1 已删除或降级，页面身份由 `SiteHeader` / Breadcrumb 承载；保留筛选、工具栏、表格、详情分组和业务记录信息；本轮不删除旧 `searchPlaceholder` API，不改路由结构、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM148`
- source_ids:
  - `R848`
- story_ids:
  - `US768`
- action: 清理旧 Header 全局搜索参数。
- status: `done`
- notes: `AppShell` 和 `SiteHeader` 已删除 `searchPlaceholder` prop、默认值和透传；`app/**` 与 `components/**` 中不再向全局 Header 传入旧搜索占位参数；真正属于业务列表的筛选框仍保留在内容区；本轮不新增 Header 搜索 UI，不删除业务筛选，不改路由结构、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM149`
- source_ids:
  - `R849`
- story_ids:
  - `US769`
- action: 收口非客服人员主数据页面动作。
- status: `done`
- notes: 组织、职场、供应商、技能等非客服人员主数据列表内容区不再显示 `导入主数据` 或跳转独立上传工作区；客服人员已确认的新建和批量导入动作继续由 Header actions 承载；本轮不新增非客服人员 CRUD、导入弹窗、排班/预测/日志导入入口、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-05

- task_id: `IM153`
- source_ids:
  - `R853`
- story_ids:
  - `US773`
- action: 统一 B 端字体与控件密度基线。
- status: `done`
- notes: 移除 `app/globals.css` 中覆盖 shadcn 组件字号的 `button,input,select { font: inherit }`；`Button` 的 `sm/xs` 文本按钮回到 14px 基线，人员列表行内 `编辑/冻结` 文字按钮也统一为 14px/32px；`TableHead` 不再固定 12px，客服人员导入 Dialog 的步骤、说明、映射控件、textarea 和结果文案不再混用 12px；纯图标按钮保留图标密度；本轮不新增业务功能、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM154`
- source_ids:
  - `R854`
- story_ids:
  - `US774`
- action: 完成职场基础 CRUD 前端闭环。
- status: `done`
- notes: `/master-data/sites` Header actions 提供 `新建` 职场入口；职场列表行提供 `详情`、`编辑`、`冻结`，其中编辑进入 `/master-data/sites/[workplaceId]/edit` 子页面，冻结通过 Dialog 确认；新增进入 `/master-data/sites/new` 子页面并提交职场 ID、职场名称、状态和生效期；提交复用现有 workplace reference maintenance API，反馈回到职场列表并使用 Alert；本轮不新增职场服务团队绑定、供应商合同、结算、最低人力、审批、导出、批量、权限、后端 route、schema/migration、依赖、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM155`
- source_ids:
  - `R855`
- story_ids:
  - `US775`
- action: 完成供应商基础 CRUD 前端闭环。
- status: `done`
- notes: `/master-data/vendors` Header actions 提供 `新建` 供应商入口；供应商列表行提供 `详情`、`编辑`、`冻结`，其中编辑进入 `/master-data/vendors/[vendorId]/edit` 子页面，冻结通过 Dialog 确认；新增进入 `/master-data/vendors/new` 子页面并提交供应商 ID、供应商名称、状态和生效期；提交复用现有 supplier reference maintenance API，反馈回到供应商列表并使用 Alert；本轮不新增供应商合同、结算比例、最低人力、服务职场绑定、审批、导出、批量、权限、后端 route、schema/migration、依赖、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM156`
- source_ids:
  - `R856`
- story_ids:
  - `US776`
- action: 完成技能组基础 CRUD 前端闭环。
- status: `done`
- notes: `/master-data/skills` Header actions 提供 `新建` 技能组入口；技能组列表行提供 `编辑`、`冻结`，其中编辑进入 `/master-data/skills/[skillId]/edit` 子页面，冻结通过 Dialog 确认；新增进入 `/master-data/skills/new` 子页面并提交技能组 ID、技能组名称、归属属性、状态和生效期；提交复用现有 skills reference maintenance API，并补齐 `skill_category` 真实写入；本轮不新增人员技能绑定、排班技能引用、技能层级、审批、导出、批量、权限、新后端 route、schema/migration、依赖、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM157`
- source_ids:
  - `R857`
- story_ids:
  - `US777`
- action: 完成组织基础 CRUD 前端闭环。
- status: `done`
- notes: `/master-data/organizations` Header actions 提供 `新建` 组织入口；组织列表行提供 `编辑`、`冻结`，其中编辑进入 `/master-data/organizations/[organizationId]/edit` 子页面，冻结通过 Dialog 确认；新增进入 `/master-data/organizations/new` 子页面并提交组织 ID、组织名称、组织层级、上级组织、状态和生效期；本地后端新增窄组织维护 API 并复用既有组织表和父组织校验；本轮不新增组织架构图、人员调岗、供应商绑定、合同、结算、最低人力、审批、导出、批量、权限、schema/migration、依赖、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM158`
- source_ids:
  - `R858`
- story_ids:
  - `US778`
- action: 完成客服人员列表真实筛选。
- status: `done`
- notes: `/master-data/agents` 的技能组、组织、职场筛选下拉改为从当前人员列表数据生成；技能筛选使用技能 ID 作为稳定值并兼容技能名称/归属属性过滤，组织和职场筛选使用 ID 作为稳定值并兼容显示路径/名称过滤；既有姓名、账号、状态、人员类型筛选保持；页面结构仍是 Header 页面级动作、筛选卡片、列表操作栏、表格；本轮不新增导航、页面、后端 route、schema/migration、依赖、权限、审批、导出、批量操作、自动排班、生产公式、结算或收费因子；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM159`
- source_ids:
  - `R859`
- story_ids:
  - `US779`
- action: 完成本地旧主数据 schema 维护写入兼容。
- status: `done`
- notes: SQLite 本地主数据 repository 初始化/建表时会补齐已确认字段 `master_data_employees.employee_type`、`organization_id`、`workplace_id` 和 `master_data_skills.skill_category`，并创建缺失的本地主数据表，使旧 `.local` 库可继续执行人员、技能组和组织维护写入；本轮不新增迁移文件、生产数据库配置、业务字段、权限、审批、导出、批量操作、自动排班、生产公式、结算、合同、最低人力或收费因子；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM160`
- source_ids:
  - `R860`
- story_ids:
  - `US780`
- action: 完成职场详情只读服务团队关系。
- status: `done`
- notes: `/master-data/sites/[workplaceId]` 的服务团队表已按该职场自有人员组织聚合自有团队，按该职场供应商绑定聚合供应商团队，并读取供应商主数据名称；表格展示团队类型、服务团队、供应商、人员/绑定数、状态、有效期和来源批次；本轮不新增导航、表单、后端 route、schema/migration、合同、结算、最低人力、权限、审批、导出、批量操作或自动排班；current queue 与 active tasks 已清空。

### 2026-06-08

- task_id: `IM161`
- source_ids:
  - `R861`
- story_ids:
  - `US781`
- action: 完成职场服务团队本地维护对象。
- status: `done`
- notes: 新增 `master_data_workplace_service_teams` 本地表、迁移、repository、列表 API 和单条 create/edit/freeze 维护 API；`/master-data/sites/[workplaceId]` 优先展示本地服务团队记录，Header 提供 `新增服务团队`，行内提供编辑和冻结，新增/编辑进入职场详情下子页面，冻结使用 Dialog；本轮不新增独立导航、合同、结算比例、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

### 2026-06-11

- task_id: `IM162`
- source_ids:
  - `R862`
- story_ids:
  - `US782`
- action: 完成职场服务团队详情页。
- status: `done`
- notes: `/master-data/sites/[workplaceId]` 服务团队表新增 `查看` 入口；`/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]` 展示服务团队 ID、名称、类型、归属职场、组织或供应商来源、状态、生效期和来源批次；详情页提供编辑和冻结入口，编辑复用现有编辑子页面，冻结复用 Dialog；本轮不新增 Sidebar 导航、后端 route、schema/migration、关联人员列表、人员分配、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

- task_id: `IM163`
- source_ids:
  - `R863`
- story_ids:
  - `US783`
- action: 完成服务团队详情关联人员只读列表。
- status: `done`
- notes: `/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]` 增加只读关联人员区域；自有服务团队按同职场同组织匹配人员，供应商服务团队按同职场同供应商绑定匹配人员并去重；表格展示姓名、人员 ID、人员类型、组织、职场、技能、状态和匹配来源；无匹配人员显示明确空态；本轮不新增后端 route、schema/migration、人员分配、独立导航、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

- task_id: `IM164`
- source_ids:
  - `R864`
- story_ids:
  - `US784`
- action: 完成供应商详情服务团队只读链路。
- status: `done`
- notes: `/master-data/vendors/[vendorId]` 增加只读服务团队区域；只展示当前供应商绑定的职场服务团队，表格展示服务团队名称、归属职场、状态、生效期和来源批次，并通过 `查看团队` 进入既有职场服务团队详情页继续核对关联人员；无服务团队时显示明确空态；本轮不新增后端 route、schema/migration、供应商服务团队维护、人员分配、独立导航、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

- task_id: `IM165`
- source_ids:
  - `R865`
- story_ids:
  - `US785`
- action: 完成客服人员详情只读业务链路。
- status: `done`
- notes: `/master-data/agents` 列表行新增 `查看` 入口；`/master-data/agents/[employeeId]` 只读展示人员基础信息、技能集合和关联服务团队；关联服务团队通过 `查看团队` 进入既有职场服务团队详情页；无关联团队显示明确空态；本轮不新增后端 route、schema/migration、人员分配、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

- task_id: `IM166`
- source_ids:
  - `R866`
- story_ids:
  - `US786`
- action: 完成组织详情只读业务链路。
- status: `done`
- notes: `/master-data/organizations` 列表行新增 `查看` 入口；`/master-data/organizations/[organizationId]` 只读展示组织基础信息、直接下级组织和当前直接归属人员；归属人员通过 `查看人员` 进入既有客服人员详情页；无下级组织或归属人员显示明确空态；本轮不新增后端 route、schema/migration、人员调岗、组织树拖拽、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。

- task_id: `IM167`
- source_ids:
  - `R867`
- story_ids:
  - `US787`
- action: 完成技能组详情只读业务链路。
- status: `done`
- notes: `/master-data/skills` 列表行新增 `详情` 入口；`/master-data/skills/[skillId]` 只读展示技能组基础信息、归属属性和当前拥有该技能的客服人员；归属人员通过 `查看人员` 进入既有客服人员详情页；无归属人员显示明确空态；本轮不新增后端 route、schema/migration、技能层级、技能绑定维护、批量分配、排班技能规则、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子；current queue 与 active tasks 已清空。
