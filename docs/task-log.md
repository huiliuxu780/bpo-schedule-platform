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

### 2026-05-26

- task_id: `F383/Q101`
- source_ids:
  - `R546-R549`
- story_ids:
  - `US533-US535`
- action: 完成数据质量履约日期查看顺序。
- status: `done`
- notes: 数据质量总览页现在展示“履约日期查看顺序”，按受影响业务日期聚合质量原因、履约异常和人员，并展示代表原因、代表问题、履约日期入口、下一查看提示和暂缓能力；模型基于现有本地 affectedObjects、impactLinks、日期文本和异常影响聚合只读推导。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F382/Q100`
- source_ids:
  - `R542-R545`
- story_ids:
  - `US530-US532`
- action: 完成数据质量人员履约查看顺序。
- status: `done`
- notes: 数据质量总览页现在展示“人员履约查看顺序”，按受影响人员聚合质量原因和履约异常，并展示代表原因、代表问题、个人履约入口、下一查看提示和暂缓能力；模型基于现有本地 affectedObjects、impactLinks 和异常原因汇总只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F381/Q099`
- source_ids:
  - `R538-R541`
- story_ids:
  - `US527-US529`
- action: 完成数据质量异常影响原因汇总。
- status: `done`
- notes: 数据质量总览页现在展示“异常影响原因汇总”，按错误码、字段和来源聚合影响履约异常的数据质量原因，并展示影响异常、影响人员、阻断行、代表问题、下一查看入口和暂缓能力；模型基于现有本地 affectedObjects、impactLinks、errorCode、sourceField 与 source 只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F380/Q098`
- source_ids:
  - `R534-R537`
- story_ids:
  - `US524-US526`
- action: 完成数据质量详情异常影响拆解。
- status: `done`
- notes: 数据质量详情页现在展示“影响异常拆解”，从单个质量问题反查影响异常、影响人员、首要异常、影响对象、下一查看入口和暂缓能力；模型基于现有本地 affectedObjects 与 impactLinks 只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F379/Q097`
- source_ids:
  - `R530-R533`
- story_ids:
  - `US521-US523`
- action: 完成数据质量影响异常 Top 聚合。
- status: `done`
- notes: 数据质量总览页现在展示“影响异常 Top”，按影响异常数、影响人员、阻断行和严重度对质量问题排序，并提供下一查看提示和问题详情入口；模型基于现有本地 affectedObjects 与 impactLinks 只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F378/Q096`
- source_ids:
  - `R526-R529`
- story_ids:
  - `US518-US520`
- action: 完成周度闭环准备趋势原因拆解。
- status: `done`
- notes: 履约日历小组周视图的“闭环准备趋势”现在展示每日变化原因、主阻塞、材料/主管判断/数据核对拆分和下一查看提示；模型基于现有本地异常队列与闭环准备趋势只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F377/Q095`
- source_ids:
  - `R522-R525`
- story_ids:
  - `US515-US517`
- action: 完成数据质量影响导入批次反向聚合。
- status: `done`
- notes: 数据质量详情页现在展示“影响导入批次”，从单个质量问题反查相关导入批次、失败行、匹配字段、影响对象、查看建议和批次详情入口；模型基于现有本地数据质量问题与导入批次 fallback 数据只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F376/Q094`
- source_ids:
  - `R518-R521`
- story_ids:
  - `US512-US514`
- action: 完成导入批次复核结论预览。
- status: `done`
- notes: 导入批次详情页现在在修正材料预览后展示复核结论预览，包含结论状态、建议结论、置信度、证据摘要、风险提示、下一查看点和暂缓能力；模型基于现有失败原因、质量影响、修正准备摘要和修正材料预览只读整理。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F375/Q093`
- source_ids:
  - `R514-R517`
- story_ids:
  - `US509-US511`
- action: 完成导入批次修正材料预览。
- status: `done`
- notes: 导入批次详情页现在在修正准备摘要后展示修正材料预览，包含材料状态、材料摘要、字段材料、失败行样本、相关质量问题、沟通要点和暂缓能力；模型基于现有失败原因、质量影响和本地 data-quality rows 只读整理。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F374/Q092`
- source_ids:
  - `R510-R513`
- story_ids:
  - `US506-US508`
- action: 完成导入批次修正准备摘要。
- status: `done`
- notes: 导入批次详情页现在在质量影响聚合后展示修正准备摘要，包含准备等级、首要字段、需确认对象、风险提示、建议查看顺序和暂缓能力；模型基于现有失败原因、质量影响和本地 data-quality rows 只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F373/Q091`
- source_ids:
  - `R506-R509`
- story_ids:
  - `US503-US505`
- action: 完成导入失败原因质量影响聚合。
- status: `done`
- notes: 导入批次详情页现在在失败原因汇总后展示质量影响聚合，包含关联问题数、覆盖字段、未关联原因、首要问题、影响对象和建议查看顺序；模型基于现有 `failureRows`、`qualityIssueIds` 和本地 data-quality rows 只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `F372/Q090`
- source_ids:
  - `R502-R505`
- story_ids:
  - `US500-US502`
- action: 完成导入批次详情失败原因汇总。
- status: `done`
- notes: 导入批次详情页现在在失败行明细前展示按字段和错误码聚合的失败原因汇总，包含原因数、失败行、首要字段、首要错误码、代表行、代表原值、影响对象和修正提示；模型基于现有 `failureRows` 与 `affectedObjects` 本地只读聚合。本次不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `B013/F371/Q089`
- source_ids:
  - `R498-R501`
- story_ids:
  - `US497-US499`
- action: 完成导入批次列表接入本地进程内结果。
- status: `done`
- notes: 新增 `GET /api/v1/import-batches` 读取 FastAPI 进程内 CSV 导入批次并按上传时间与批次号倒序返回；前端导入批次列表优先展示接口结果并保留现有 fallback 样例。本次不新增依赖，不改 package/lockfile，不新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-26

- task_id: `B012/F370/Q088`
- source_ids:
  - `R494-R497`
- story_ids:
  - `US494-US496`
- action: 完成状态日志 CSV 本地上传导入纵切。
- status: `done`
- notes: 新增 `POST /api/v1/import-batches/status-log`，复用 `GET /api/v1/import-batches/{batch_id}`，使用 Python 标准库解析 CSV 并将批次结果保存在 FastAPI 进程内存；上传页支持状态日志模式，批次详情展示成功行、失败行、错误码和失败行明细。本次不新增依赖，不改 package/lockfile，不新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `B011/F369/Q087`
- source_ids:
  - `R490-R493`
- story_ids:
  - `US491-US493`
- action: 完成登录日志 CSV 本地上传导入纵切。
- status: `done`
- notes: 新增 `POST /api/v1/import-batches/login-log`，复用 `GET /api/v1/import-batches/{batch_id}`，使用 Python 标准库解析 CSV 并将批次结果保存在 FastAPI 进程内存；上传页支持登录日志模式，批次详情展示成功行、失败行、错误码和失败行明细。本次不新增依赖，不改 package/lockfile，不新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `B010/F368/Q086`
- source_ids:
  - `R486-R489`
- story_ids:
  - `US488-US490`
- action: 完成人员级排班 CSV 本地上传导入纵切。
- status: `done`
- notes: 新增 `POST /api/v1/import-batches/personnel-schedule`，复用 `GET /api/v1/import-batches/{batch_id}`，使用 Python 标准库解析 CSV 并将批次结果保存在 FastAPI 进程内存；上传页支持人员级排班模式，批次详情展示成功行、失败行、错误码和失败行明细。本次不新增依赖，不改 package/lockfile，不新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `B009/F367/Q085`
- source_ids:
  - `R482-R485`
- story_ids:
  - `US485-US487`
- action: 完成需求预测 CSV 本地上传导入纵切。
- status: `done`
- notes: 新增 `POST /api/v1/import-batches/demand-forecast` 和 `GET /api/v1/import-batches/{batch_id}`，使用 Python 标准库解析 CSV 并将批次结果保存在 FastAPI 进程内存；新增 `/import-batches/new` 上传入口，批次详情展示成功行、失败行、错误码和失败行明细。本次不新增依赖，不改 package/lockfile，不新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、自动排班、结算、收费因子或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F365-F366/Q084`
- source_ids:
  - `R478-R481`
- story_ids:
  - `US482-US484`
- action: 在小组周视图侧栏增加周度查看边界核查。
- status: `done`
- notes: 团队周视图现在包含 `weeklyQaBoundarySummary`；页面展示覆盖看板数、边界事项数、开放风险、升级压力、首要边界、关联看板和边界原因。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、关闭异常、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F363-F364/Q083`
- source_ids:
  - `R474-R477`
- story_ids:
  - `US479-US481`
- action: 在小组周视图侧栏增加周度闭环收口摘要。
- status: `done`
- notes: 团队周视图现在包含 `weeklyClosureCloseoutSummary`；页面展示可推进日、未就绪日、待补材料、待主管判断、开放风险、关键收口项和下钻建议。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、关闭异常、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F361-F362/Q082`
- source_ids:
  - `R470-R473`
- story_ids:
  - `US476-US478`
- action: 在小组周视图侧栏增加周度复核对比摘要。
- status: `done`
- notes: 团队周视图现在包含 `weeklyReviewComparisonSummary`；页面展示对比维度、升级压力、未就绪日、开放风险、关键对比项、影响说明和下钻建议。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F359-F360/Q081`
- source_ids:
  - `R466-R469`
- story_ids:
  - `US473-US475`
- action: 在小组周视图侧栏增加周度来源压力。
- status: `done`
- notes: 团队周视图现在包含 `weeklySourcePressureSummary`；页面展示来源轨道、异常数、高优数、升级数、阻塞证据数、影响人员、影响日期、影响时长和下钻建议。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F357-F358/Q080`
- source_ids:
  - `R462-R465`
- story_ids:
  - `US470-US472`
- action: 在小组周视图侧栏增加周度责任压力。
- status: `done`
- notes: 团队周视图现在包含 `weeklyOwnerPressureSummary`；页面展示负责角色、异常数、高优数、升级数、阻塞证据数、影响人员、影响日期、影响时长和下钻建议。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F355-F356/Q079`
- source_ids:
  - `R458-R461`
- story_ids:
  - `US467-US469`
- action: 在小组周视图侧栏增加周度质量影响汇总。
- status: `done`
- notes: 团队周视图现在包含 `weeklyDataQualitySummary`；页面展示影响异常数、影响人员、影响日期、影响时长、严重度、阻塞证据、下钻路径和业务原因。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F353-F354/Q078`
- source_ids:
  - `R454-R457`
- story_ids:
  - `US464-US466`
- action: 在小组成员单日矩阵异常侧栏增加数据质量影响排序。
- status: `done`
- notes: 小组矩阵现在包含 `dataQualityImpactRanking`；页面展示影响分、严重度、阻塞证据、影响人员、影响异常数、业务原因和建议查看路径。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F351-F352/Q077`
- source_ids:
  - `R450-R453`
- story_ids:
  - `US461-US463`
- action: 在小组成员单日矩阵异常侧栏增加闭环复核摘要。
- status: `done`
- notes: 小组矩阵现在包含 `closureReviewSummary`；页面展示可闭环、待复核、阻塞数量、首个复核对象、建议结论、证据摘要、风险摘要、下一步和来源依据。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、关闭异常、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F349-F350/Q076`
- source_ids:
  - `R446-R449`
- story_ids:
  - `US458-US460`
- action: 在小组周视图侧栏增加周度决策摘要。
- status: `done`
- notes: 小组周视图现在包含 `supervisorWeeklyDecisionDigest`；页面展示建议判断、信心、证据摘要、开放风险、下一查看点和来源依据。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F346-F348/Q075`
- source_ids:
  - `R442-R445`
- story_ids:
  - `US454-US457`
- action: 在小组成员单日矩阵异常侧栏增加闭环风险解释。
- status: `done`
- notes: 小组矩阵现在包含 `closureRiskExplanation`；页面展示不能闭环原因、业务影响、待补证据、负责角色、下一查看步骤和风险项。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F343-F345/Q074`
- source_ids:
  - `R438-R441`
- story_ids:
  - `US450-US453`
- action: 在小组成员单日矩阵异常侧栏增加主管决策摘要。
- status: `done`
- notes: 小组矩阵现在包含 `supervisorDecisionDigest`；页面展示建议判断、可信度、证据引用、开放风险、下一复核点和摘要项。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F340-F342/Q073`
- source_ids:
  - `R434-R437`
- story_ids:
  - `US446-US449`
- action: 在小组成员单日矩阵异常侧栏增加处理准备叙事。
- status: `done`
- notes: 小组矩阵现在包含 `handlingReadinessNarrative`；页面展示处理准备主线、已齐项、待补项、证据状态、准备步骤、影响范围和叙事项。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F337-F339/Q072`
- source_ids:
  - `R430-R433`
- story_ids:
  - `US442-US445`
- action: 在小组成员单日矩阵异常侧栏增加主管优先级总览。
- status: `done`
- notes: 小组矩阵现在包含 `supervisorPrioritySummary`；页面展示首要查看对象、优先原因、高优项、阻塞项、升级项、影响时长、影响范围和查看顺序。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F334-F336/Q071`
- source_ids:
  - `R426-R429`
- story_ids:
  - `US438-US441`
- action: 在小组成员单日矩阵异常侧栏增加异常影响范围优先级汇总。
- status: `done`
- notes: 小组矩阵现在包含 `exceptionImpactPriority`；页面展示优先异常、影响对象、影响对比、影响时长、闭环阻塞、排序说明和代表异常。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F331-F333/Q070`
- source_ids:
  - `R422-R425`
- story_ids:
  - `US434-US437`
- action: 在小组成员单日矩阵异常侧栏增加数据质量到履约异常的反向聚合。
- status: `done`
- notes: 小组矩阵现在包含 `dataQualityExceptionImpact`；页面展示主要质量问题、关联异常数、影响人员、影响时长、代表异常和质量详情入口。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F328-F330/Q069`
- source_ids:
  - `R418-R421`
- story_ids:
  - `US430-US433`
- action: 在小组成员单日矩阵异常侧栏增加复核结论预览。
- status: `done`
- notes: 异常队列项现在包含 `reviewOutcomePreview`；页面展示建议结论、可信度、证据摘要、来源引用、准备度、开放风险和下一复核点。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F325-F327/Q068`
- source_ids:
  - `R414-R417`
- story_ids:
  - `US426-US429`
- action: 在团队下钻后的小组周视图增加周度闭环准备趋势。
- status: `done`
- notes: 团队周模型现在包含 `closureReadinessTrend`；小组周视图右侧展示每日闭环准备方向、准备/阻塞天数、主要阻塞、下一优先回看日期和小组日期下钻入口。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F322-F324/Q067`
- source_ids:
  - `R410-R413`
- story_ids:
  - `US422-US425`
- action: 在团队下钻后的小组周视图增加团队级证据缺口分布。
- status: `done`
- notes: 团队周模型现在包含 `teamEvidenceGapDistribution`；小组周视图右侧展示证据缺口项数、涉及人员、主要缺口类型、负责角色、代表人员和建议下钻项。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F319-F321/Q066`
- source_ids:
  - `R406-R409`
- story_ids:
  - `US418-US421`
- action: 在团队下钻后的小组周视图增加周度主管交接摘要。
- status: `done`
- notes: 团队周模型现在包含 `supervisorWeeklyHandoffSummary`；小组周视图右侧展示交接项、开放问题、升级项、主要交接对象、下一触点和小组日期下钻入口。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F316-F318/Q065`
- source_ids:
  - `R402-R405`
- story_ids:
  - `US414-US417`
- action: 在小组成员单日矩阵的闭环准备度中增加证据下钻解释。
- status: `done`
- notes: 闭环准备度阻塞项现在展示证据项、人员、负责角色、当前状态、已有证据来源、下一查看位置，并链接到已有个人单日三轨详情。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F313-F315/Q064`
- source_ids:
  - `R398-R401`
- story_ids:
  - `US410-US413`
- action: 在团队下钻后的小组周视图增加主管本周复核队列。
- status: `done`
- notes: 团队周模型现在包含 `supervisorWeeklyReviewQueue`；小组周视图右侧展示待看组合、高优组合、缺口人数、异常人数、小组日期、建议先看对象、复核原因和下钻入口。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、派单、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-25

- task_id: `F310-F312/Q063`
- source_ids:
  - `R394-R397`
- story_ids:
  - `US406-US409`
- action: 在小组成员单日矩阵异常侧栏增加闭环准备度摘要。
- status: `done`
- notes: 小组矩阵现在包含 `exceptionClosureReadinessSummary`；右侧异常详情在复核工作量前展示可闭环、未就绪、待补材料、待主管判断、待数据核对、下一候选异常和阻塞原因。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-24

- task_id: `F307-F309/Q062`
- source_ids:
  - `R390-R393`
- story_ids:
  - `US402-US405`
- action: 在小组成员单日矩阵异常侧栏增加本周延续关注。
- status: `done`
- notes: 小组矩阵现在包含 `teamWeekCarryoverOverview`；右侧异常详情展示后续关注日期、缺口人数、异常人数、建议回看对象、延续原因和查看顺序。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-24

- task_id: `F304-F306/Q061`
- source_ids:
  - `R386-R389`
- story_ids:
  - `US398-US401`
- action: 在小组成员单日矩阵异常侧栏增加小组风险原因拆分。
- status: `done`
- notes: 小组矩阵现在包含 `groupRiskCauseSplit`；右侧异常详情展示风险原因标题、总影响时长、原因占比、异常项数、涉及人数、代表异常和主管关注点。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-24

- task_id: `F301-F303/Q060`
- source_ids:
  - `R382-R385`
- story_ids:
  - `US394-US397`
- action: 在小组成员单日矩阵异常侧栏增加次日关注清单。
- status: `done`
- notes: 异常队列项现在包含 `nextDayWatchlist`；右侧异常详情展示次日日期、关注说明、员工、优先级、责任角色、来源异常、关注原因和查看顺序。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F286-F288/Q055`
- source_ids:
  - `R362-R365`
- story_ids:
  - `US374-US377`
- action: 在小组成员单日矩阵异常详情中增加主管跟进时间线。
- status: `done`
- notes: 异常队列项现在包含 `followUpTimeline`；右侧异常详情展示识别、已跟进、当前卡点和下一复核节点。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F283-F285/Q054`
- source_ids:
  - `R358-R361`
- story_ids:
  - `US370-US373`
- action: 在小组成员单日矩阵异常详情中增加主管沟通上下文。
- status: `done`
- notes: 异常队列项现在包含 `communicationContext`；右侧异常详情展示沟通对象、沟通目的、关键说明、引用证据、待确认问题和下一沟通点。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F280-F282/Q053`
- source_ids:
  - `R354-R357`
- story_ids:
  - `US366-US369`
- action: 在小组成员单日矩阵异常侧栏增加团队日风险摘要。
- status: `done`
- notes: 小组矩阵模型现在包含 `teamDayRiskDigest`；右侧异常面板展示风险等级、风险分、当日风险标题、主要风险、下一优先查看和风险信号。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F277-F279/Q052`
- source_ids:
  - `R350-R353`
- story_ids:
  - `US362-US365`
- action: 在小组成员单日矩阵异常侧栏增加主管交接概览。
- status: `done`
- notes: 小组矩阵模型现在包含 `supervisorHandoffOverview`；右侧异常面板展示待交接项、待核对问题、建议升级、主要接收人、下一优先交接和接收人分布。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F238-F240-Q039`
- source_ids: [`R298`, `R299`, `R300`, `R301`]
- story_ids: [`US310`, `US311`, `US312`, `US313`]
- action: 完成产品语义清理和 QA 收口。
- status: `done`
- notes: 清理排班草稿、履约日历、异常来源、需求计划、班次类型、排班详情和侧边栏中的内部过程词与样例口径；产品 UI 回归测试新增禁止本地、后端、本地 MVP、任务编号、后续扩展、只读处理记录、不做人员级排班、示例异常和侧边栏新/P1 标签。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F235-F237-Q038`
- source_ids: [`R294`, `R295`, `R296`, `R297`]
- story_ids: [`US306`, `US307`, `US308`, `US309`]
- action: 完成主管跟进汇总只读视图和 QA 收口。
- status: `done`
- notes: 履约日历小组单日异常队列当前项现在展示跟进状态、跟进缺口和小组跟进汇总；跟进状态说明跟进人、当前状态、下一核对时间和当前重点；跟进缺口展示还缺的说明、记录和结论；小组汇总展示队列位置、待跟进数量和高优先数量。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F232-F234-Q037`
- source_ids: [`R290`, `R291`, `R292`, `R293`]
- story_ids: [`US302`, `US303`, `US304`, `US305`]
- action: 完成数据质量修复前置只读视图和 QA 收口。
- status: `done`
- notes: 履约日历小组单日异常队列当前项现在展示数据修复前置判断、准备材料和影响范围；前置判断说明是否需要数据管理员介入、优先级、介入原因和负责团队；准备材料展示记录、字段和说明材料；影响范围展示影响对象、影响对比和排除边界。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F229-F231-Q036`
- source_ids: [`R286`, `R287`, `R288`, `R289`]
- story_ids: [`US298`, `US299`, `US300`, `US301`]
- action: 完成主管异常交接只读闭环和 QA 收口。
- status: `done`
- notes: 履约日历小组单日异常队列当前项现在展示处理归类、交接摘要和数据核对提示；处理归类说明业务类别、归类原因、负责角色和复核重点；交接摘要说明交接对象、摘要、待核对问题和下一触点；数据核对提示展示相关记录、核对字段和风险提示。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F226-F228-Q035`
- source_ids: [`R282`, `R283`, `R284`, `R285`]
- story_ids: [`US294`, `US295`, `US296`, `US297`]
- action: 完成主管异常处理只读闭环和 QA 收口。
- status: `done`
- notes: 履约日历小组单日异常队列当前项现在展示处理建议分层、三轨证据汇总和只读处理记录；处理建议包含优先核对、需补信息、沟通对象和线下处理边界；证据汇总按排班、登录、状态分别说明命中事件；只读记录展示记录人、时间、结论和后续跟进。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F221-F225-Q034`
- source_ids: [`R275`, `R276`, `R277`, `R278`, `R279`, `R280`]
- story_ids: [`US287`, `US288`, `US289`, `US290`, `US291`, `US292`]
- action: 完成主数据关系闭环和 QA 收口。
- status: `done`
- notes: 主数据关系页现在按员工展示供应商、职场、项目、技能、有效期、状态、异常引用和质量问题引用；异常复核和数据质量详情可反查到对应员工主数据关系；班次类型页展示饭点、休息窗口、计入工时和计入口径。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F216-F220-Q033`
- source_ids: [`R269`, `R270`, `R271`, `R272`, `R273`, `R274`]
- story_ids: [`US281`, `US282`, `US283`, `US284`, `US285`, `US286`]
- action: 完成导入质量追溯闭环和 QA 收口。
- status: `done`
- notes: 导入批次详情现在能跳转到相关数据质量问题，并展示来源模板、错误码、来源字段和失败行业务影响摘要；数据质量详情展示来源模板、字段、原值、错误码、影响对象和影响链路；质量分组详情强化业务原因追溯和影响对象展示。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F211-F215-Q032`
- source_ids: [`R263`, `R264`, `R265`, `R266`, `R267`, `R268`]
- story_ids: [`US275`, `US276`, `US277`, `US278`, `US279`, `US280`]
- action: 完成需求预测多维展示与预测排班对齐 QA。
- status: `done`
- notes: 需求计划页现在按职场、项目、0.5h 时段、技能组和等级展示预测需求，并在同页展示预测 vs 排班对齐结果、缺口、超排、技能不匹配、预测版本、排班版本和排班人员明细下钻。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F209-F210-Q031`
- source_ids: [`R260`, `R261`, `R262`]
- story_ids: [`US272`, `US273`, `US274`]
- action: 完成人员级排班下钻、缺口人员班次说明和 QA 收口。
- status: `done`
- notes: 人员级排班明细现在提供“查看当天履约”下钻，链接保留团队、小组和返回日期上下文；排班计划详情和风险明细展示缺口涉及人员、对应班次、计划时间、技能和可复核班次；QA 已覆盖明细、汇总、风险页和履约下钻链接。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F206-F208`
- source_ids: [`R257`, `R258`, `R259`]
- story_ids: [`US269`, `US270`, `US271`]
- action: 补齐排班计划人员级明细和 0.5h 时段人员追溯。
- status: `done`
- notes: 排班计划详情现在展示人员级排班明细、人员字段完整度、员工/供应商/职场/项目/技能/班次/异常业务标签，以及每个 0.5h 时段对应的人员列表；班次明细页也能从时段追溯到对应人员、供应商、班次、技能和异常标签。本批不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `Q030`
- source_ids: [`R256`]
- story_ids: [`US268`]
- action: 完成履约日历主管处理链路 QA。
- status: `done`
- notes: 已验证履约日历团队层、小组周视图、小组成员周矩阵、单日异常队列和个人单日详情返回上下文；队列排序依据、三轨证据、待看清单、返回异常队列和原异常定位均可见且保留业务语义。产品 UI 未出现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。本批只做 QA 和文档状态收口，不改产品代码、不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F204-F205`
- source_ids: [`R254`, `R255`]
- story_ids: [`US266`, `US267`]
- action: 完成履约日历异常排序依据和个人详情返回队列上下文。
- status: `done`
- notes: 异常队列每项和当前异常解释现在展示排序依据，说明优先级、影响时长和员工编号；从异常队列进入个人单日详情时，详情页展示返回上下文，并保留队列筛选和异常定位，返回后仍落回原小组矩阵队列项。本批不新增路由、不新增导航入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F201-F203`
- source_ids: [`R251`, `R252`, `R253`]
- story_ids: [`US263`, `US264`, `US265`]
- action: 增强履约日历主管链路的小组风险摘要、周待看清单和异常三轨证据卡。
- status: `done`
- notes: 小组周视图新增风险摘要侧栏，展示最高风险小组、日期、成员、缺口人数和异常人数；小组成员周矩阵新增本周待看清单，便于主管按人和日期连续处理；异常队列新增三轨证据卡，直接展示命中的排班、登录、状态事件编号、标签和时间段。本批不新增路由、不新增导航入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `Q029`
- source_ids: [`R250`]
- story_ids: [`US262`]
- action: 完成业务界面收口 QA。
- status: `done`
- notes: 已验证经营总览、侧边栏和产品 UI 文案：经营总览展示业务指标、业务下钻和履约风险摘要；侧边栏只保留真实业务入口；产品 UI 未出现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。本批只做 QA 和文档状态收口，不改产品代码、不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F199-F200`
- source_ids: [`R248`, `R249`]
- story_ids: [`US260`, `US261`]
- action: 为经营总览增加业务下钻入口和履约风险摘要。
- status: `done`
- notes: 经营总览指标卡现在提供到履约日历、异常复核和数据质量的业务下钻；首页新增履约风险摘要，展示今日履约风险、本周履约风险、高风险小组和待看异常。新增回归测试覆盖指标下钻和风险摘要。本次不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F196-F198`
- source_ids: [`R245`, `R246`, `R247`]
- story_ids: [`US257`, `US258`, `US259`]
- action: 收口经营总览、侧边栏和产品 UI 内部过程词。
- status: `done`
- notes: 经营总览四个指标收口为计划覆盖率、登录履约率、供需缺口和质量风险；侧边栏移除所有跳 `/dashboard` 的伪业务入口，仅保留真实业务页面；产品 UI 审计新增对“数据接入状态”“占位”等内部或伪功能词的回归覆盖，并去掉异常表无业务动作的行操作列。本次不新增页面、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `H031`
- source_ids: [`R281`]
- story_ids: [`US293`]
- action: 修复大模块迭代池登记前的 Harness 状态漂移，并登记 36 个 planned 业务故事池。
- status: `done`
- notes: 已将历史已完成的 `US137-US146`、`F085-F093`、`Q020` 从遗留 ready 状态修正为 done；新增 `R245-R280`、`US257-US292`、`F196-F225`、`Q029-Q034` 作为连续大模块 planned 池，覆盖业务 UI 收口、履约日历主管链路、人员级排班追溯、预测排班对齐、导入质量追溯和主数据关系闭环。planned 池未写入 `docs/current/STORY_QUEUE.yaml` 或 `docs/current/ACTIVE_TASKS.yaml`，本批不实现产品代码、不新增页面、不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

### 2026-05-18

- task_id: `H029`
- source_ids: []
- story_ids: []
- action: 整理生产雏形大 PRD。
- status: `done`
- notes: 新增 `docs/production-mvp-prd.md`，将本地演示版到生产雏形的产品口径、数据对象、导入规则、排班粒度、对比口径、异常闭环、页面模块和后续生产化边界整理为单份大 PRD；本轮不拆用户故事、不改 current queue、不实现代码。

### 2026-05-18

- task_id: `H030`
- source_ids: [`R091`, `R092`, `R093`, `R094`, `R095`, `R096`]
- story_ids: [`US103`, `US104`, `US105`, `US106`, `US107`, `US108`]
- action: 安排生产雏形第一批需求。
- status: `done`
- notes: 从 `docs/production-mvp-prd.md` 拆出第一批生产雏形需求，并将 `US104/B006`、`US105/B007`、`US106/B008` 放入 current ready queue；后续执行保持 no-database/local MVP 边界，不授权真实集成、权限、审批、导出、批量、自动排班或生产公式。

### 2026-05-18

- task_id: `B006`
- source_ids: [`R092`]
- story_ids: [`US104`]
- action: 新增生产雏形主数据导入合同。
- status: `done`
- notes: 新增本地只读 `/api/v1/master-data/import-contract` 合同，覆盖坐席、职场、供应商、项目、绑定关系和班次类型的字段、主键、必填字段、外键、校验规则、批次字段、失败行字段和数据质量错误码；不做真实文件导入、不接数据库、不接真实外部系统。

### 2026-05-18

- task_id: `B007`
- source_ids: [`R093`]
- story_ids: [`US105`]
- action: 新增生产雏形人员级排班合同与 0.5h 展开口径。
- status: `done`
- notes: 新增本地只读 `/api/v1/personnel-schedules/import-contract` 合同，覆盖人员级排班字段、必填字段、生成字段、校验规则，以及从人员排班展开到 0.5h `interval_schedule` 的 group_by、目标字段和追溯字段；不做真实排班导入、不接数据库、不实现自动排班。

### 2026-05-18

- task_id: `B008`
- source_ids: [`R094`, `R095`]
- story_ids: [`US106`]
- action: 新增生产雏形预测、排班、登录和状态对比合同。
- status: `done`
- notes: 新增本地只读 `/api/v1/fulfillment-comparison/contract` 合同，覆盖需求预测、人员排班、登录日志、状态日志四类来源、对齐键、人员级键、状态字典字段、异常规则和复核字段；不做真实对比计算、不接数据库、不实现生产公式。

### 2026-05-18

- task_id: `F061-F063/Q016`
- source_ids: [`R097`, `R098`, `R099`, `R100`]
- story_ids: [`US109`, `US110`, `US111`, `US112`]
- action: 安排生产雏形合同前端演示入口连续任务。
- status: `in_progress`
- notes: 已将合同客户端、合同展示页、导航入口和 QA 收口放入 current ready queue；本批只做本地前端合同展示，不接真实数据、不改依赖、不接数据库。

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

### 2026-05-18

- task_id: `F061-F063`
- source_ids:
  - `R097-R099`
- story_ids:
  - `US109-US111`
- action: 完成生产雏形合同前端演示入口。
- status: `done`
- notes: 新增本地生产雏形合同客户端、fallback、摘要模型和模型测试；新增 `/production-mvp` 页面展示主数据、人员级排班、0.5h 时段汇总、预测/排班/登录/状态对比和延期生产能力边界；侧边栏已增加生产雏形入口。

### 2026-05-18

- task_id: `Q016`
- source_ids:
  - `R100`
- story_ids:
  - `US112`
- action: 执行生产雏形合同演示入口 QA 收口。
- status: `done`
- notes: targeted model test、lint、typecheck、strict state check、diff check 和标准 check 已纳入验收；本批未新增依赖、未改后端契约、未接数据库、未引入真实外部集成、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F064-F066/Q017`
- source_ids:
  - `R101-R104`
- story_ids:
  - `US113-US116`
- action: 安排异常复核只读入口连续开发批次。
- status: `done`
- notes: 新增本地异常复核模型、fallback、筛选/摘要测试、`/anomaly-review` 只读页和侧边栏入口；本批不做真实异常计算、复核提交、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F067-F075/Q018`
- source_ids:
  - `R105-R114`
- story_ids:
  - `US117-US126`
- action: 连续完成导入合同 drilldown 与数据质量中心 10-task 展示批次。
- status: `done`
- notes: 新增导入合同 drilldown 模型与测试、数据质量模型与测试、三个生产雏形合同 drilldown 页面、`/data-quality`、`/data-quality/[issueId]` 和侧边栏数据质量入口；本批不做真实导入、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F076-F084/Q019`
- source_ids:
  - `R115-R124`
- story_ids:
  - `US127-US136`
- action: 连续完成人员时间轴、需求预测合同和主数据关系 10-task 展示批次。
- status: `done`
- notes: 新增人员双时间轴模型与测试、需求预测合同模型与测试、主数据关系模型与测试、`/person-timeline`、`/person-timeline/[employeeId]`、`/production-mvp/demand-forecast`、`/master-data-relations` 和侧边栏入口；本批不做真实导入、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F085-F093/Q020`
- source_ids:
  - `R125-R134`
- story_ids:
  - `US137-US146`
- action: 连续完成班次类型、导入模板和异常来源 10-task 展示批次。
- status: `done`
- notes: 新增班次类型模型与测试、导入模板模型与测试、异常来源模型与测试、`/shift-types`、`/import-templates`、`/anomaly-review/sources`、`/anomaly-review/sources/[sourceId]` 和侧边栏入口；本批不做真实导入、数据库、主数据 CRUD、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F094-F102/Q021`
- source_ids:
  - `R135-R144`
- story_ids:
  - `US147-US156`
- action: 连续完成导入批次、字段映射和复核时间线 10-task 展示批次。
- status: `done`
- notes: 新增导入批次历史模型与测试、字段映射预览模型与测试、异常复核状态时间线模型与测试、`/import-batches`、`/import-batches/[batchId]`、`/field-mapping`、`/anomaly-review/timeline` 和侧边栏入口；本批不做真实上传/导入、字段映射保存、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F103-F111/Q022`
- source_ids:
  - `R145-R154`
- story_ids:
  - `US157-US166`
- action: 连续完成数据质量分组、导入批次问题钻取和生产雏形验收清单 10-task 展示批次。
- status: `done`
- notes: 新增数据质量分组模型与测试、`/data-quality/groups`、`/data-quality/groups/[groupId]`、导入批次详情质量问题链接、生产雏形验收清单模型与测试、`/production-mvp/acceptance-checklist` 和侧边栏入口；本批不做真实上传/导入、真实修复、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F112-F120/Q023`
- source_ids:
  - `R155-R164`
- story_ids:
  - `US167-US176`
- action: 连续完成质量问题反查分组、验收清单单项详情和生产雏形总进度 10-task 展示批次。
- status: `done`
- notes: 新增质量问题到分组的反查模型与测试，数据质量详情展示所属分组，数据质量中心展示分组覆盖摘要；新增验收清单单项详情、生产雏形总进度模型与测试、`/production-mvp/progress` 和侧边栏入口；本批不做真实上传/导入、真实修复、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F121-F129/Q024`
- source_ids:
  - `R165-R174`
- story_ids:
  - `US177-US186`
- action: 连续完成生产雏形缺口优先级和后续批次路线图 10-task 展示批次。
- status: `done`
- notes: 新增生产雏形缺口优先级与批次路线图本地模型和测试，新增 `/production-mvp/gaps`、`/production-mvp/gaps/[gapId]`，并在验收清单详情、生产雏形总进度、生产雏形总览和侧边栏挂载缺口入口；本批不做真实缺口工单、真实上传/导入、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-19

- task_id: `F130-F138/Q025`
- source_ids:
  - `R175-R184`
- story_ids:
  - `US187-US196`
- action: 连续完成数据导入与主数据闭环准备 10-task 展示批次。
- status: `done`
- notes: 新增数据底座准备本地模型和测试，新增 `/production-mvp/data-foundation`、`/production-mvp/data-foundation/[stepId]`，并在上传/导入验收详情、主数据验收详情、缺口路线图、生产雏形总览、生产雏形总进度和侧边栏挂载入口；本批不做真实上传/导入、字段映射保存、主数据 CRUD、冻结解冻、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F139-F147/Q026`
- source_ids:
  - `R185-R194`
- story_ids:
  - `US197-US206`
- action: 连续完成预测版本与实际日志对齐准备 10-task 展示批次。
- status: `done`
- notes: 新增预测与实际对齐准备本地模型和测试，新增 `/production-mvp/alignment-readiness`、`/production-mvp/alignment-readiness/[stepId]`，并在需求预测、登录/状态、差异对比验收详情、缺口路线图、生产雏形总览、总进度和侧边栏挂载入口；本批不做真实预测导入、真实登录/状态接口、状态码生产映射、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F148-F156/Q027`
- source_ids:
  - `R195-R204`
- story_ids:
  - `US207-US216`
- action: 连续完成异常识别与复核准备 10-task 展示批次。
- status: `done`
- notes: 新增异常识别与复核准备本地模型和测试，新增 `/production-mvp/anomaly-triage-readiness`、`/production-mvp/anomaly-triage-readiness/[stepId]`，并在异常识别验收详情、异常复核总览、异常来源页、缺口路线图、生产雏形总览、总进度和侧边栏挂载入口；本批不做真实规则引擎、真实复核提交、审批、权限、导出、批量、数据库、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F157-F165/Q028`
- source_ids:
  - `R205-R214`
- story_ids:
  - `US217-US226`
- action: 连续完成发布冻结与权限审计边界准备 10-task 展示批次。
- status: `done`
- notes: 新增发布冻结与权限审计边界准备本地模型和测试，新增 `/production-mvp/governance-readiness`、`/production-mvp/governance-readiness/[stepId]`，并在排班发布审批缺口、权限审计缺口、人员排班验收、主数据验收、缺口路线图、生产雏形总览、总进度和侧边栏挂载入口；本批不做真实发布、审批、权限、审计写入、导出、批量、数据库、自动排班、生产公式、结算规则或 charge factor；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F166`
- source_ids:
  - `R215`
- story_ids:
  - `US227`
- action: 修复产品语义回归，移除 `/dashboard` 上遗留的数据接入状态面板和数据版本筛选，并删除 `/production-mvp/**` 内部规划页面路由。
- status: `done`
- notes: 根因是需求治理记录被错误产品化：`/dashboard` 重新 import 并渲染 `DataSyncStatus`，侧边栏还暴露生产雏形、准备、缺口、验收等内部页面。已新增 `dashboard-business-only` 与 `product-navigation-business-only` 回归测试；本次不删除数据接入组件，不改 `/demo-imports`，不做真实数据接入、数据库、权限、审批、导出或批量。

### 2026-05-20

- task_id: `F167`
- source_ids:
  - `R216`
- story_ids:
  - `US228`
- action: 全量清理产品 UI 内部执行口径，并将人员时间轴重做为人员日历和单日三轨横向时间轴。
- status: `done`
- notes: 新增产品 UI 文案审计测试，覆盖 `app/**` 和 `components/**` 禁止出现暂不实现、待开发动作、本地只读、只读演示、无真实、PRD、验收、Gate、No Database 等内部口径；清理异常复核、异常来源、复核时间线、数据质量、导入批次、排班计划、风险、不可用和复核链路组件中的内部文案；人员时间轴列表改为人员日历入口，详情页按员工日期展示排班、登录、状态三条横向轨道；本次未新增页面、依赖、后端、数据库、权限、审批、导出或批量能力；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F168`
- source_ids:
  - `R217`
- story_ids:
  - `US229`
- action: 在现有排班计划详情挂载人员级排班明细，建立从 0.5h 时段汇总到员工明细再到个人当天时间轴的查看闭环。
- status: `done`
- notes: 新增人员级排班明细本地模型和测试，排班计划详情展示人员、供应商、职场、班次、计划时间、技能等级、0.5h 展开时段和异常标记，并提供个人时间轴链接；本次不新增页面，不新增依赖，不改后端、数据库、真实导入、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F169`
- source_ids:
  - `R218`
- story_ids:
  - `US230`
- action: 将人员时间轴升级为履约日历，建立团队周视图、小组周视图、小组成员单日矩阵和个人单日三轨详情的业务下钻链路。
- status: `done`
- notes: `/person-timeline` 现在作为履约日历入口，团队按职场+项目映射，小组按供应商映射；侧边栏履约监控统一到履约日历，不再暴露人员时间轴、坐席状态轨迹或跳 `/dashboard` 的履约伪入口；下钻时每次只展示当前层级，成员矩阵每人默认展示排班、登录、状态三条横向子轨，并保留进入个人单日三轨详情的链路。本次不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F170`
- source_ids:
  - `R219`
- story_ids:
  - `US231`
- action: 在履约日历小组成员矩阵和个人单日三轨详情之间增加个人周日历层。
- status: `done`
- notes: 小组成员矩阵点击员工姓名进入个人周日历，先展示该员工一周七天的排班工时、登录工时、缺口和异常；点击某天进入个人单日三轨详情，异常标记仍可从矩阵直达对应日期详情。本次不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F171`
- source_ids:
  - `R220`
- story_ids:
  - `US232`
- action: 在履约日历小组周视图和小组成员单日矩阵之间增加小组成员周矩阵。
- status: `done`
- notes: `/person-timeline?team=...&group=...` 现在展示小组成员周矩阵，按成员和周一至周日展示排班、登录、缺口和异常；`team+group+date` 仍展示小组成员单日矩阵；员工姓名进入个人周日历，日期格进入个人单日三轨详情。本次不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F172-F174`
- source_ids:
  - `R221-R223`
- story_ids:
  - `US233-US235`
- action: 收口小组成员周矩阵的来源返回、日期入口和小组业务摘要。
- status: `done`
- notes: 个人周日历现在按来源返回：从周矩阵进入返回周矩阵，从单日矩阵进入返回单日矩阵；小组成员周矩阵表头日期可进入该小组当天单日矩阵；周矩阵展示成员数、计划人天、登录人天、缺口工时和异常数，并按风险优先排序。本次不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F175-F177`
- source_ids:
  - `R224-R226`
- story_ids:
  - `US236-US238`
- action: 增强小组成员周矩阵的风险摘要、视图焦点和风险单元格强化。
- status: `done`
- notes: 小组成员周矩阵现在展示风险成员数、最高缺口成员、最高异常成员和最高缺口日；支持全部、看缺口、看异常三个视角，并在缺口或异常视角强化对应风险单元格。本次不新增左侧入口、不新增页面路由、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F178-F180`
- source_ids:
  - `R227-R229`
- story_ids:
  - `US239-US241`
- action: 在个人单日三轨详情下方增加主管视角异常解释卡，并保持小组单日矩阵异常标记下钻到个人详情。
- status: `done`
- notes: 个人单日详情模型新增异常解释列表，页面展示异常类型、时间段、涉及轨道、影响时长、证据说明、建议主管动作和优先级；小组成员单日矩阵异常标记可进入对应个人单日详情查看解释。本次不新增左侧入口、不新增页面路由、不新增依赖，不改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-21

- task_id: `F193-F195`
- source_ids:
  - `R242-R244`
- story_ids:
  - `US254-US256`
- action: 在小组成员单日矩阵右侧异常队列增加处理进度、上一项和下一项切换，以及筛选空态。
- status: `done`
- notes: 异常队列现在通过光标模型返回当前项、当前位置、上一项和下一项；右侧面板显示处理进度并支持在当前筛选队列内逐项切换，链接保留团队、小组、日期和筛选口径。筛选为空时显示业务空态。本次不新增左侧入口、不新增页面路由、不新增依赖，不改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

- task_id: `F190-F192`
- source_ids:
  - `R239-R241`
- story_ids:
  - `US251-US253`
- action: 在小组成员单日矩阵中增加选中异常到成员行和轨道切片的定位联动。
- status: `done`
- notes: 异常队列项现在暴露 `focusEventIds`；选中异常后矩阵高亮对应成员行，并高亮相关排班、登录、状态轨道切片。切换异常筛选或异常项后定位同步变化。本次不新增左侧入口、不新增页面路由、不新增依赖，不改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F187-F189`
- source_ids:
  - `R236-R238`
- story_ids:
  - `US248-US250`
- action: 在小组成员单日矩阵右侧增加异常队列汇总和显示筛选，使主管能按问题构成聚焦异常。
- status: `done`
- notes: 小组单日矩阵模型现在暴露 `exceptionQueueSummary`；右侧面板展示异常总数、高优先级数、登录缺口数、状态不一致数和总影响时长，并支持全部、高优先级、登录缺口、状态不一致筛选。筛选只影响显示队列和当前解释，不新增处理、审批或持久化。本次不新增左侧入口、不新增页面路由、不新增依赖，不改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F184-F186`
- source_ids:
  - `R233-R235`
- story_ids:
  - `US245-US247`
- action: 在小组成员单日矩阵右侧增加待关注异常队列，使主管能先按优先级扫描小组当天全部异常，再切换当前异常解释。
- status: `done`
- notes: 小组单日矩阵模型现在暴露 `exceptionQueue`，按优先级、影响时长、员工号稳定排序；右侧面板显示待关注异常队列，选中项高亮并同步当前异常解释，仍保留进入个人单日详情入口。本次不新增左侧入口、不新增页面路由、不新增依赖，不改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-20

- task_id: `F181-F183`
- source_ids:
  - `R230-R232`
- story_ids:
  - `US242-US244`
- action: 在小组成员单日矩阵增加异常解释侧栏，使主管在小组视角直接查看选中异常的证据和建议动作。
- status: `done`
- notes: 小组单日矩阵成员模型现在暴露异常解释；页面右侧显示当前异常解释，并通过 `exception=员工::异常码` 选中异常；异常标记可在当前页切换侧栏，侧栏保留进入个人单日详情入口。本次不新增左侧入口、不新增页面路由、不新增依赖，不改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F274-F276/Q051`
- source_ids:
  - `R346-R349`
- story_ids:
  - `US358-US361`
- action: 在小组成员单日矩阵异常面板中增加异常来源聚合。
- status: `done`
- notes: 小组矩阵模型现在包含 `exceptionSourceSummary`；右侧异常面板展示主要来源、下一优先来源、来源分布、影响时长、高优先、超时关注和建议升级数量。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F271-F273/Q050`
- source_ids:
  - `R342-R345`
- story_ids:
  - `US354-US357`
- action: 在小组成员单日矩阵异常面板中增加主管日工作量汇总。
- status: `done`
- notes: 小组矩阵模型现在包含 `supervisorDailyWorkload`；右侧异常面板展示今日待关注项、高优先项、超时关注、建议升级、最高负载角色、角色负载和下一优先查看。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F268-F270/Q049`
- source_ids:
  - `R338-R341`
- story_ids:
  - `US350-US353`
- action: 在小组成员单日矩阵异常详情中增加超时与升级查看口径。
- status: `done`
- notes: 异常队列项现在包含 `agingEscalation`；右侧异常详情展示识别时间、等待时长、超时等级、升级原因、关注角色和下一复核窗口，队列摘要展示超时关注项和建议升级项数量。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F265-F267/Q048`
- source_ids:
  - `R334-R337`
- story_ids:
  - `US346-US349`
- action: 在小组成员单日矩阵异常详情中增加关联数据质量查看链路。
- status: `done`
- notes: 异常队列项现在包含 `dataQualityLinks`；右侧异常详情展示关联数据质量问题、匹配记录、核对字段、关联原因、建议和质量详情链接。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-24

- task_id: `F298-F300/Q059`
- source_ids:
  - `R378-R381`
- story_ids:
  - `US390-US393`
- action: 在小组成员单日矩阵异常侧栏增加异常责任人负载对比。
- status: `done`
- notes: 异常队列项现在包含 `ownerLoadComparison`；页面展示当前责任人、最高负载责任人、对比责任人、负载差异和处理顺序。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-24

- task_id: `F295-F297/Q058`
- source_ids:
  - `R374-R377`
- story_ids:
  - `US386-US389`
- action: 在履约日历团队周视图增加团队周风险分布。
- status: `done`
- notes: 团队周模型现在包含 `weekRiskDistribution`；团队周视图展示最高风险日、风险分布点、主要风险原因、建议下钻日期、小组和团队排名。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F262-F264/Q047`
- source_ids:
  - `R330-R333`
- story_ids:
  - `US342-US345`
- action: 在小组成员单日矩阵中增加复核负载汇总。
- status: `done`
- notes: 小组矩阵模型现在包含 `reviewLoadSummary`；右侧异常队列面板展示复核负载、最高负载分组、下一优先查看、分组高优数量以及已齐/待补材料数量。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F259-F261/Q046`
- source_ids:
  - `R326-R329`
- story_ids:
  - `US338-US341`
- action: 在个人单日三轨详情中同步异常复核口径。
- status: `done`
- notes: 个人日视图现在包含 `reviewContexts`；从小组异常队列下钻到个人详情时，页面展示处理分组、当前判断和复核清单。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F256-F258/Q045`
- source_ids:
  - `R322-R325`
- story_ids:
  - `US334-US337`
- action: 在小组成员单日矩阵异常侧栏增加主管处理分组筛选。
- status: `done`
- notes: 异常队列项现在包含 `reviewGroup`，摘要统计需补材料、待主管判断和需数据核对数量；侧栏提供同组筛选并在队列项显示处理分组和原因。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F292-F294/Q057`
- source_ids:
  - `R370-R373`
- story_ids:
  - `US382-US385`
- action: 在小组成员单日矩阵异常侧栏增加主管异常对比。
- status: `done`
- notes: 异常队列项现在包含 `exceptionComparison`，页面展示当前排名、优先原因、对比异常、主要差异和关注顺序。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F289-F291/Q056`
- source_ids:
  - `R366-R369`
- story_ids:
  - `US378-US381`
- action: 在小组成员单日矩阵异常侧栏增加团队日风险趋势。
- status: `done`
- notes: 小组矩阵现在包含 `teamDayRiskTrend`，页面展示趋势方向、最高风险日、当前日对比、趋势点和下一关注点。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、通知、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F286-F288/Q055-visible-follow-up`
- source_ids:
  - `R362-R365`
- story_ids:
  - `US374-US377`
- action: 修正小组成员单日矩阵中选中异常的跟进时间线可见性。
- status: `done`
- notes: 将“跟进时间线”提升到右侧异常面板顶部，保证选中异常后先看到识别、已跟进、当前卡点和下一复核；详情下方不再重复展示同一模块。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式。

### 2026-05-22

- task_id: `F253-F255/Q044`
- source_ids:
  - `R318-R321`
- story_ids:
  - `US330-US333`
- action: 在小组成员单日矩阵异常侧栏增加主管复核清单。
- status: `done`
- notes: 异常队列项现在包含 `closureChecklist`，侧栏展示已齐/待补数量、复核项状态、负责角色、判断影响和当前判断。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F250-F252/Q043`
- source_ids:
  - `R314-R317`
- story_ids:
  - `US326-US329`
- action: 在小组成员单日矩阵异常侧栏增加处理结论建议。
- status: `done`
- notes: 异常队列项现在包含 `resolutionDraft`，侧栏展示建议结论、需核材料、沟通对象、负责角色、下一复核点和未闭环风险。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F247-F249/Q042`
- source_ids:
  - `R310-R313`
- story_ids:
  - `US322-US325`
- action: 在个人单日三轨详情中增加排班草稿来源反查。
- status: `done`
- notes: 个人三轨详情现在展示排班草稿来源卡，包含计划入口、草稿入口、班次窗口、技能、排班明细编号，以及该人员相关 0.5h 时段的汇总人数、明细人数和差异。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F244-F246/Q041`
- source_ids:
  - `R306-R309`
- story_ids:
  - `US318-US321`
- action: 在排班草稿人员联动中增加履约日历个人详情下钻。
- status: `done`
- notes: 人员排班时段追溯模型现在为关联人员提供 `timelineHref`；草稿页中的关联人员入口可进入对应个人单日三轨详情，并保留日期、团队和小组上下文。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。

### 2026-05-22

- task_id: `F241-F243/Q040`
- source_ids:
  - `R302-R305`
- story_ids:
  - `US314-US317`
- action: 在排班草稿编辑页增加人员级排班联动核对。
- status: `done`
- notes: 草稿页现在按 0.5h 时段展示汇总人数、明细人数、差异、状态和关联人员；模型提供联动行和摘要统计，用于定位需核对时段。本次不新增页面路由、不新增左侧入口、不新增依赖，不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式；current queue 与 active tasks 已清空。
