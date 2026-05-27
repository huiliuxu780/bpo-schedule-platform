# Audit Report

本文件记录 Harness 闭环审计结果、风险、阻塞和建议。

## Current Audit

### 2026-05-27 - G001 demand forecast import

#### 结论

- `F409/US596/R636-R637` 已完成 G001 需求预测导入。
- 后端需求预测 CSV 导入现在会把成功行写入 process-memory 需求预测业务记录，字段包含业务日、职场、项目、0.5h 时段、技能组、等级、预测人数、来源批次和预测版本。
- 无效职场、项目、技能组、等级或预测人数会进入失败行，不进入需求预测业务记录。
- 需求计划读取会优先返回导入预测行，并保留来源批次和版本追溯；前端预测排班对齐模型也保留导入来源批次和版本。
- current queue 与 active tasks 已切到 `US596/F410`。

#### 风险

- 当前需求预测仍是 no-database process-memory，不是生产预测版本库或可审计持久化。
- 新版本覆盖旧版本的变更追踪仍归 `F410`；预测 vs 排班对齐和异常生成仍归 `F411`。

#### 验证

- TDD red：后端 unittest 首次失败于成功行未进入需求预测业务记录、未知技能组未阻断；前端 node test 首次失败于对齐模型未保留来源批次/版本。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，47 个后端测试通过。
- `node --test scripts/tests/demand-supply-alignment.test.mjs scripts/tests/demand-forecast-contract.test.mjs scripts/tests/import-batch-history.test.mjs`：通过，31 个前端/契约测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已切到 `US596/F410`。

### 2026-05-27 - G001 personnel schedule foundation QA

#### 结论

- `Q120/US595/R635` 已完成 G001 人员级排班基础 QA。
- 已验收 `F407` 的人员级排班导入、来源批次、排班版本、班次引用和失败行阻断，以及 `F408` 的 0.5h 展开、员工/排班明细追溯和个人履约链接。
- current queue 与 active tasks 已移除 `US595/Q120`，当前队列为空；下一步建议解除 `US596/F409` 阻塞并进入需求预测导入。
- 本 QA 没有新增或修改产品代码、数据库、ORM、migration、真实外部接口、依赖、权限、审批、导出、批量、文件存储、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 人员级排班基础仍是 no-database process-memory，不是生产排班版本库、审批发布、冻结或供应商隔离口径。
- 需求预测导入、预测版本、预测 vs 排班对齐、登录/状态日志处理和真实异常写入闭环仍未完成。

#### 验证

- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，46 个后端测试通过。
- `node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，45 个前端/契约测试通过。
- 页面 smoke：`http://localhost:3021/schedule-plans` 可渲染 `0.5h 展开`、`来源批次`、`排班版本` 和 `履约链接`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-27 - G001 personnel schedule 0.5h expansion

#### 结论

- `F408/US594/R633-R634` 已完成 G001 人员级排班 0.5h 展开与履约链接。
- 后端人员级排班 CSV 成功行现在会生成 process-memory `interval_schedule` 汇总，按排班版本、业务日、职场、项目、技能组、等级和 0.5h 时段聚合。
- 每个 0.5h 汇总保留员工、排班明细、来源批次、来源版本和 trace 状态；非法时间和未知班次仍进入失败行，不生成正常展开结果。
- 前端排班计划页展示 `0.5h 展开`、来源批次、排班版本、明细追溯和个人履约链接。
- current queue 与 active tasks 已移除 `US594/F408`，下一项为 `US595/Q120`。

#### 风险

- 当前 0.5h 展开仍是 no-database process-memory 和前端本地聚合，不是生产排班版本库、发布冻结口径或数据库持久化结果。
- 跨天排班、真实人员主数据强校验、预测对比、登录/状态对比和异常写入闭环仍归后续任务；本批不做自动排班、审批发布、导出、批量或生产公式。

#### 验证

- TDD red：后端 unittest 首次失败于缺少 `list_personnel_schedule_interval_records`；前端 node test 首次失败于缺少 `buildPersonnelScheduleIntervalExpansion`。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，46 个后端测试通过。
- `node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，45 个前端/契约测试通过。
- 页面 smoke：`http://localhost:3021/schedule-plans` 可渲染 `0.5h 展开`、`来源批次`、`排班版本` 和 `履约链接`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已移除 `US594/F408`，下一项为 `US595/Q120`。

### 2026-05-27 - G001 personnel schedule import references and version

#### 结论

- `F407/US593/R630-R632` 已完成 G001 人员级排班导入班次引用与版本。
- 后端人员级排班 CSV 导入现在会保留 process-memory 人员排班业务记录，包含来源批次、排班版本、班次引用状态和人员排班业务字段。
- 未知班次类型会进入失败行并返回 `shift_type_missing`，不会进入人员排班业务记录。
- 前端排班计划页展示人员排班导入、来源批次、排班版本和班次引用。
- current queue 与 active tasks 已移除 `US593/F407`，下一项为 `US594/F408`。

#### 风险

- 当前人员排班记录仍是 no-database process-memory，不是生产排班版本库或发布冻结口径。
- 0.5h 展开、跨天质量问题和履约链接仍归 `F408`，本批不做自动排班、审批发布、导出、批量或生产公式。

#### 验证

- TDD red：后端 unittest 首次失败于缺少 `list_imported_personnel_schedule_records`；前端 node test 首次失败于缺少 `mapImportedPersonnelScheduleRecord`。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，46 个后端测试通过。
- `node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，44 个前端/契约测试通过。

### 2026-05-27 - G001 master data foundation QA

#### 结论

- `Q119/US592/R629` 已完成 G001 主数据基础 QA。
- 已验收 `F405` 的主数据 CSV 导入、失败行、来源批次、导入版本和主数据页展示，以及 `F406` 的新增/修改、冻结、解冻、有效期和引用校验。
- current queue 与 active tasks 已移除 `US592/Q119`，下一项为 `US593/F407`。
- 本 QA 没有新增或修改产品代码、数据库、ORM、migration、真实外部接口、依赖、权限、审批、导出、批量、文件存储、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 主数据能力仍是 no-database process-memory，不是生产持久化、供应商隔离、权限控制或审批发布。
- 人员级排班导入、班次引用、排班版本和 0.5h 展开仍归 `F407/F408/Q120`。

#### 验证

- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，45 个后端测试通过。
- `node --test scripts/tests/master-data-relations.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，40 个前端/契约测试通过。
- API smoke：主数据新增、冻结、引用校验阻断和解冻恢复均通过。
- 页面 smoke：`/master-data-relations` 可渲染维护状态、新增或修改、冻结、解冻、引用校验和导入员工记录。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已移除 `US592/Q119`，下一项为 `US593/F407`。

### 2026-05-27 - G001 master data maintenance and reference check

#### 结论

- `F406/US591/R625-R627` 已完成 G001 主数据维护状态、有效期与引用校验。
- 后端新增主数据 process-memory 新增/修改、冻结、解冻和引用校验接口；冻结、停用、过期、缺失或绑定不一致会返回阻断状态和数据质量式错误码。
- 前端主数据关系页新增维护状态区，展示新增或修改、冻结、解冻、引用校验、阻断引用和暂不做审批/权限/导出的边界。
- current queue 与 active tasks 已移除 `US591/F406`，下一项为 `US592/Q119`。

#### 风险

- 当前维护能力仍是 process-memory，不是生产数据库 CRUD，服务重启后不会保留维护结果。
- 引用校验只覆盖主数据有效期、冻结/停用、缺失和绑定不一致；排班、预测、登录和状态导入的真实引用落地仍归后续任务。

#### 验证

- TDD red：后端 unittest 首次失败于缺少 `upsert_master_data_record`，前端 node test 首次失败于缺少 `summarizeMasterDataMaintenance`。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，45 个后端测试通过。
- `node --test scripts/tests/master-data-relations.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，40 个前端/契约测试通过。
- API smoke：新增 `E-991` 返回 `ready`；冻结后引用校验返回 `blocked master_data_frozen`；解冻后恢复 `active ready`。
- 页面 smoke：`/master-data-relations` 可渲染 `E-991`，并包含“维护状态”“新增或修改”“冻结”“解冻”“引用校验”。

### 2026-05-27 - G001 master data import and view

#### 结论

- `F405/US590/R624/R628` 已完成 G001 主数据导入与查看。
- 后端新增主数据 CSV 提交接口、process-memory 批次记录、失败行记录、导入版本和导入后员工绑定记录查询。
- 前端主数据导入页现在可提交主数据 CSV；主数据关系页读取导入记录并展示来源批次、导入版本和引用状态。
- current queue 与 active tasks 已移除 `US590/F405`，下一项为 `US591/F406`。

#### 风险

- 当前仍是 no-database process-memory，服务重启后不会保留生产主数据。
- 有效期、冻结/解冻、引用校验和维护动作仍归后续 `F406`，本批不做权限、审批、导出、批量或生产持久化。

#### 验证

- TDD red：后端 unittest 首次失败于缺少 `import_master_data_csv`；前端 node test 首次失败于缺少主数据导入映射和导入记录映射函数。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，42 个后端测试通过。
- `node --test scripts/tests/csv-import-preview.test.mjs scripts/tests/master-data-relations.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，42 个前端/契约测试通过。
- 页面 smoke：`/master-data-relations` 和 `/import-batches/new?type=master-data` 返回 200；Playwright 快照显示主数据页包含“来源批次”“导入版本”“引用状态”，导入页包含主数据 CSV 预览和提交按钮。
- API smoke：`POST /api/v1/import-batches/master-data` 返回 `master_data completed 1 1`，`GET /api/v1/master-data/imported-records` 可查到导入员工 `E-990`，前端主数据页可渲染该员工。

### 2026-05-27 - G001 import center foundation QA

#### 结论

- `Q118/US589/R623` 已完成 G001 导入中心基础 QA。
- 已验收 `F403` 的 CSV 上传/字段映射预览和 `F404` 的导入批次、失败行、业务日期、导入版本记录。
- current queue 与 active tasks 已移除 `US589/Q118`，下一项为 `US590/F405`。
- 本 QA 没有新增或修改产品代码、数据库、ORM、migration、真实外部接口、依赖、权限、审批、导出、批量、文件存储、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 导入中心仍是 no-database process-memory 能力，服务重启后不会保留生产数据。
- 主数据真实导入与维护、人员级排班版本流、预测和登录/状态生产处理仍在后续任务中。

#### 验证

- `node --test scripts/tests/csv-import-preview.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，34 个测试通过。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，40 个后端测试通过。
- 页面 smoke：通过，`/import-batches/new?type=master-data` 展示主数据 CSV 预览、五类导入类型、字段映射预览和禁用的主数据提交；`/import-batches/BATCH-20260519-003` 展示业务日期。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已移除 `US589/Q118`，下一项为 `US590/F405`。

### 2026-05-27 - G001 import batch version records

#### 结论

- `F404/US588/R620-R622` 已完成 G001 导入批次失败行与版本记录。
- 后端 `ImportBatchResult` 新增业务日期范围和 `version_records`，成功行生成导入版本记录，失败行继续保留行号、字段、错误码、错误原因和原始值。
- 前端批次模型映射业务日期范围和导入版本，批次详情页新增“业务日期”和“导入版本”展示。
- 本批没有新增数据库、ORM、migration、真实外部接口、依赖、权限、审批、导出、批量、文件存储、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 版本记录仍随当前进程内存存在，不是生产数据库版本、文件存储版本或审批发布版本。
- 主数据真实导入处理仍归后续 `F405`，本批只增强已有 CSV 导入结果的可追溯结构。

#### 验证

- TDD red：`node --test scripts/tests/import-batch-history.test.mjs` 首次失败于缺少 `businessDateRange`、`localVersions` 和详情页版本区块；后端 unittest 首次失败于缺少 `business_date_start`。
- `node --test scripts/tests/csv-import-preview.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，34 个测试通过。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，40 个后端测试通过。
- 页面 smoke：通过，`/import-batches/BATCH-20260519-003` 展示“业务日期”和成功行范围。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已移除 `US588/F404`，下一项为 `US589/Q118`。

### 2026-05-27 - G001 CSV upload and field-mapping preview

#### 结论

- `F403/US587/R618-R619` 已完成 G001 导入中心 CSV 上传与字段映射预览。
- `/import-batches/new` 支持选择主数据、人员级排班、需求预测、登录日志和状态日志 CSV 类型，并在提交导入前预览字段映射、行数、缺失必填字段、未识别字段和待校验字段。
- 后端新增本地预览契约 `/api/v1/import-batches/preview`，使用 Python `csv` 解析上传内容并返回同类字段映射摘要。
- 主数据本次只开放上传预览，不执行真实业务导入；主数据导入处理仍归后续 `F405`。
- 本批没有新增数据库、ORM、migration、真实外部接口、依赖、权限、审批、导出、批量、文件存储、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 预览结果只基于 CSV 表头和行数，不代表字段值、主数据引用、业务日期、跨天状态或排班规则已经完成生产级校验。
- 已有需求预测、人员排班、登录日志和状态日志提交仍走本地 process-memory 导入；主数据提交将在后续任务开放。

#### 验证

- TDD red：`node --test scripts/tests/csv-import-preview.test.mjs` 首次失败于缺少 `lib/csv-import-preview.ts`；后端 unittest 首次失败于缺少 `preview_csv_import`。
- `node --test scripts/tests/csv-import-preview.test.mjs scripts/tests/import-batch-history.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，33 个测试通过。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans`：通过，40 个后端测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已移除 `US587/F403`，下一项为 `US588/F404`。

### 2026-05-27 - G001 production import closure planning split

#### 结论

- `G001/R618-R652/US587-US604/F403-Q123` 已完成长期执行拆分。
- 第一批 ready current queue 原为 `US587/F403 -> US595/Q120`；`US587/F403` 已完成后，当前队列从 `US588/F404` 继续，覆盖导入批次/失败行/本地版本、主数据导入与维护、人员级排班导入与 0.5h 展开。
- 需求预测波次 `US596-US598/F409-F411/Q121`、登录/状态波次 `US599-US603/F412-F415/Q122` 和全链边界 QA `US604/Q123` 已进入 backlog blocked，等待前置 ready 波次完成后释放。
- 本批只拆需求、用户故事、任务队列、current queue 与计划文档，不新增产品代码、数据库、ORM、migration、真实外部接口、依赖、权限、审批、导出、批量、文件存储、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- G001 是生产雏形拆分，不代表真实持久化、外部系统对接、权限隔离、审批发布、导出报表或生产级批量处理已经实现。
- 后续若要进入数据库、文件存储、Excel xlsx、权限、审批、导出或真实集成，需要单独 Gate Plan 和 PM 确认。

#### 验证

- `bash scripts/check-state.sh --strict`：通过，ready stories 与 active tasks 一一对应，current 文档行数预算通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过。

### 2026-05-27 - Supervisor exception local handling write loop

#### 结论

- `F400-F402/US584-US586` 已完成主管异常处理本地写入闭环。
- `lib/person-timeline.ts` 新增主管异常处理 process-memory：复核结论、证据补充、关闭记录和状态查询。
- 人员履约时间线异常面板新增“处理闭环”，支持提交复核结论、补充证据、在结论和证据满足后关闭异常，并展示最新处理状态。
- 本批没有新增数据库、ORM、migration、真实外部接口、依赖、权限、审批、导出、批量、文件存储、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 处理记录只存在于当前 Next.js 进程内存，刷新服务或多进程部署不会保留；这不是生产持久化、权限控制、审批流或批量处理。
- 关闭条件只校验本地结论和证据是否已提交，不代表生产级证据验真、状态字典、结算、考核或 SLA 规则已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `getSupervisorExceptionReviewState` 未导出，证明测试先覆盖新增处理状态契约。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，15 个模型/页面源码测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，6 个产品文案/导航边界测试通过。
- 页面 smoke：通过，人员履约时间线页面包含“处理闭环”“提交复核结论”“补充证据”“关闭异常”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality handoff risk import-batch impact

#### 结论

- `F399/Q117/US581-US583` 已完成数据质量交接风险关联导入批次影响。
- 前端分组模型新增 `summarizeDataQualityGroupStepOwnerHandoffImportImpact()`，基于本地 owner 交接风险和 fallback 导入批次生成批次/失败行影响摘要。
- 数据质量总览页新增“交接风险关联导入批次影响”卡片，展示 owner、代表问题、关联批次、失败行、字段、影响对象、质量问题入口、批次入口、人员履约入口和“查看风险批次”入口。
- 本批没有新增真实上传、后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 交接风险关联导入批次影响只基于本地 fallback 数据质量问题、owner 交接风险和 fallback 导入批次，不代表真实上传、解析、失败行落库、审批、权限、导出、批量或生产持久化已经实现。
- 批次影响用于主管只读追溯风险来源，不是生产级数据修复、SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupStepOwnerHandoffImportImpact` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupStepOwnerHandoffImportImpact`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，13 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“交接风险关联导入批次影响”“数据管理员”“DQ-202605-004”“A-9931”“BATCH-20260519-001”“employee_id”“人员排班”“查看风险批次”“查看风险问题”“查看风险人员”“无真实数据修复”“无批量重导”。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，6 个产品文案/导航边界测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality group step owner handoff risk summary

#### 结论

- `F398/Q116/US578-US580` 已完成数据质量分组步骤 owner 交接风险摘要。
- 前端分组模型新增 `summarizeDataQualityGroupStepOwnerHandoffRiskSummary()`，基于本地 owner 交接摘要生成主管可读阻塞原因。
- 数据质量总览页新增“分组步骤 owner 交接风险摘要”卡片，展示 owner、代表问题、代表人员、关联分组、阻塞原因、质量问题入口、人员履约入口和“查看风险问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 分组步骤 owner 交接风险摘要只基于本地 fallback 分组、数据质量问题和 owner 交接摘要，不代表真实复核任务、异常闭环写入、审批、权限、导出、批量或生产持久化已经实现。
- 阻塞原因用于主管只读提前说明风险，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupStepOwnerHandoffRiskSummary` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupStepOwnerHandoffRiskSummary`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，12 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“分组步骤 owner 交接风险摘要”“运营负责人”“DQ-202605-010”“A-1002”“时间有效性”“查看风险问题”“查看风险人员”“阻塞原因”“交接风险”“无真实数据修复”“无批量重导”。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，6 个产品文案/导航边界测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality group step owner handoff brief

#### 结论

- `F397/Q115/US575-US577` 已完成数据质量分组步骤 owner 交接摘要。
- 前端分组模型新增 `summarizeDataQualityGroupStepOwnerHandoffBrief()`，基于本地 owner 复核队列生成主管交接口径。
- 数据质量总览页新增“分组步骤 owner 交接摘要”卡片，展示 owner、代表问题、代表人员、关联分组、交接要点、质量问题入口、人员履约入口和“查看交接问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 分组步骤 owner 交接摘要只基于本地 fallback 分组、数据质量问题和 owner 复核队列，不代表真实复核任务、异常闭环写入、审批、权限、导出、批量或生产持久化已经实现。
- 交接口径用于主管只读说明先看什么，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupStepOwnerHandoffBrief` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupStepOwnerHandoffBrief`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，11 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“分组步骤 owner 交接摘要”“运营负责人”“DQ-202605-010”“A-1002”“时间有效性”“查看交接问题”“查看交接人员”“交接 运营负责人”“无真实数据修复”“无批量重导”。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，6 个产品文案/导航边界测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality group step owner review queue

#### 结论

- `F396/Q114/US572-US574` 已完成数据质量分组步骤 owner 复核队列。
- 前端分组模型新增 `summarizeDataQualityGroupStepOwnerReviewQueue()`，基于本地分组步骤 owner/人员负载生成 owner 复核队列。
- 数据质量总览页新增“分组步骤 owner 复核队列”卡片，展示 rank、owner、代表问题、代表人员、关联分组、队列理由、质量问题入口、人员履约入口和“查看队列问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 分组步骤 owner 复核队列只基于本地 fallback 分组、数据质量问题和 owner/人员负载，不代表真实复核任务、异常闭环写入、审批、权限、导出、批量或生产持久化已经实现。
- 队列用于主管只读查看顺序，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupStepOwnerReviewQueue` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupStepOwnerReviewQueue`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，10 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“分组步骤 owner 复核队列”“运营负责人”“DQ-202605-010”“A-1002”“时间有效性”“查看队列问题”“查看队列人员”“第 1 位”“无真实数据修复”“无批量重导”。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，6 个产品文案/导航边界测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality group step owner/person load

#### 结论

- `F395/Q113/US569-US571` 已完成数据质量分组步骤 owner/人员负载摘要。
- 前端分组模型新增 `summarizeDataQualityGroupStepOwnerLoad()`，基于本地分组步骤影响对象把复核步骤汇总到 owner 与影响人员。
- 数据质量总览页新增“分组步骤 owner/人员负载”卡片，展示 owner、步骤数、影响人员、关联分组、代表问题、质量问题入口、人员履约入口和“查看 owner 负载”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 分组步骤 owner/人员负载摘要只基于本地 fallback 分组、数据质量问题和分组步骤影响对象，不代表真实复核任务、异常闭环写入、审批、权限、导出、批量或生产持久化已经实现。
- 摘要用于主管只读协调责任人与人员影响，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupStepOwnerLoad` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupStepOwnerLoad`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，9 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“分组步骤 owner/人员负载”“运营负责人”“DQ-202605-010”“A-1002”“时间有效性”“查看 owner 负载”“无真实数据修复”“无批量重导”。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，6 个产品文案/导航边界测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality group step impact drilldown

#### 结论

- `F394/Q112/US566-US568` 已完成数据质量分组步骤影响对象摘要。
- 前端分组模型新增 `summarizeDataQualityGroupStepImpactDrilldown()`，基于本地分组复核顺序和代表问题生成影响对象摘要。
- 数据质量总览页新增“分组步骤影响对象”卡片，展示分组步骤、代表问题、影响人员、影响对象、质量问题入口、人员履约入口和“查看影响对象”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 分组步骤影响对象摘要只基于本地 fallback 分组、数据质量问题和复核顺序，不代表真实复核任务、异常闭环写入、审批、权限、导出、批量或生产持久化已经实现。
- 摘要用于主管只读追溯，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupStepImpactDrilldown` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupStepImpactDrilldown`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，8 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“分组步骤影响对象”“DQ-202605-010”“A-1002”“小组成员矩阵异常”“查看影响对象”“查看人员履约”“无真实数据修复”“无批量重导”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality group review sequence

#### 结论

- `F393/Q111/US563-US565` 已完成数据质量分组复核顺序摘要。
- 前端分组模型新增 `summarizeDataQualityGroupReviewSequence()`，基于本地质量分组异常影响覆盖生成主管复核步骤。
- 数据质量总览页新增“质量分组复核顺序”卡片，展示首要步骤、owner、风险、代表问题、影响异常、影响人员、阻断行、下一查看提示和“查看分组步骤”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 分组复核顺序只基于本地 fallback 分组和异常影响覆盖，不代表真实复核任务、异常闭环写入、审批、权限、导出、批量或生产持久化已经实现。
- 摘要用于主管只读查看顺序，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupReviewSequence` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupReviewSequence`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，7 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“质量分组复核顺序”“先看 时间有效性”“运营负责人”“DQ-202605-010”“查看分组步骤”“第 1 步：时间有效性”“无真实数据修复”“无批量重导”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality group exception coverage

#### 结论

- `F392/Q110/US560-US562` 已完成数据质量分组异常影响覆盖摘要。
- 前端分组模型新增 `summarizeDataQualityGroupExceptionCoverage()`，基于本地质量分组和数据质量问题反查影响履约异常的分组。
- 数据质量总览页新增“质量分组异常影响覆盖”卡片，展示影响分组、影响异常、影响人员、阻断行、首要分组、代表问题、模板、字段、影响对象和“查看影响分组”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 分组异常影响覆盖只基于本地 fallback 分组和数据质量问题，不代表真实质量分组落库、异常闭环写入、审批、权限、导出、批量或生产持久化已经实现。
- 摘要用于主管只读追溯，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityGroupExceptionCoverage` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityGroupExceptionCoverage`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，6 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“质量分组异常影响覆盖”“时间有效性”“运营负责人”“DQ-202605-010”“小组成员矩阵异常”“A-1002”“查看影响分组”“无真实数据修复”“无批量重导”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality review group link

#### 结论

- `F391/Q109/US557-US559` 已完成数据质量复核建议质量分组摘要。
- 前端分组模型新增 `summarizeDataQualityReviewGroupLink()`，基于下一轮复核建议代表问题关联本地质量分组。
- 数据质量总览页新增“复核建议质量分组”卡片，展示建议问题、匹配分组、未分组、分组问题、风险、owner、模板、字段和“查看质量分组”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 质量分组摘要只基于本地 fallback 分组和下一轮复核建议，不代表真实质量分组落库、数据修复、审批、权限、导出、批量或生产持久化已经实现。
- 摘要用于主管只读追溯，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality-groups.test.mjs` 首次失败于 `summarizeDataQualityReviewGroupLink` 未导出；`node --test scripts/tests/data-quality.test.mjs` 首次失败于页面未引用 `summarizeDataQualityReviewGroupLink`，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/data-quality-groups.test.mjs`：通过，4 个数据质量分组模型测试通过。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“复核建议质量分组”“身份与主键完整性”“DQ-202605-004”“数据管理员”“高风险”“TPL-MASTER-DATA”“agent_binding.employee_id”“查看质量分组”“无真实数据修复”“无批量重导”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality review import batch impact

#### 结论

- `F390/Q108/US554-US556` 已完成数据质量复核建议导入批次影响摘要。
- 前端模型新增 `summarizeDataQualityReviewImportBatchImpact()`，基于下一轮复核建议代表问题关联本地导入批次影响。
- 数据质量总览页新增“复核建议导入批次影响”卡片，展示建议问题、关联批次、失败行、匹配字段、影响对象和“查看关联批次”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 导入批次影响摘要只基于本地 fallback 批次和质量问题，不代表真实批次落库、修复写入、审批、权限、导出、批量或生产持久化已经实现。
- 摘要用于主管只读追溯，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityReviewImportBatchImpact` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，33 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“复核建议导入批次影响”“DQ-202605-004”“BATCH-20260519-001”“employee_id”“人员排班”“查看关联批次”“无真实数据修复”“无导出或批量处理”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality next review recommendation

#### 结论

- `F389/Q107/US551-US553` 已完成数据质量缺口下一轮复核建议摘要。
- 前端模型新增 `summarizeDataQualityNextReviewRecommendation()`，基于 owner/来源压力生成三步只读查看建议。
- 数据质量总览页新增“缺口下一轮复核建议”卡片，展示建议标题、首要 owner、首要来源、代表问题、影响异常、影响人员和“查看建议问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 下一轮复核建议只基于本地现有聚合结果，不代表真实复核结论写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 建议步骤用于主管查看顺序，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityNextReviewRecommendation` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，31 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“缺口下一轮复核建议”“建议下一轮先复核 DQ-202605-004”“查看建议问题”“查看代表问题”“核对 owner/来源”“回到复核路径”“无真实数据修复”“无导出或批量处理”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality gap owner source pressure

#### 结论

- `F388/Q106/US548-US550` 已完成数据质量缺口 owner/来源压力摘要。
- 前端模型新增 `summarizeDataQualityGapOwnerSourcePressure()`，基于复核覆盖缺口按 owner 和 source 聚合未覆盖问题压力。
- 数据质量总览页新增“缺口 owner/来源压力”卡片，展示缺口问题、影响异常、影响人员、首要 owner、首要来源、代表问题和“查看压力问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- owner/来源压力摘要只基于本地现有聚合结果，不代表真实复核结论写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 压力摘要用于主管查看顺序，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityGapOwnerSourcePressure` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，29 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“缺口 owner/来源压力”“数据管理员”“主数据”“DQ-202605-004”“查看压力问题”“无真实数据修复”“无导出或批量处理”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality review coverage gap

#### 结论

- `F387/Q105/US545-US547` 已完成数据质量复核覆盖缺口摘要。
- 前端模型新增 `summarizeDataQualityReviewCoverageGap()`，对比当前复核路径覆盖的问题和影响异常 Top 问题，识别未进入路径的质量问题。
- 数据质量总览页新增“复核覆盖缺口摘要”卡片，展示影响问题、已覆盖、未覆盖、缺口字段、缺口人员、首要缺口和“查看缺口问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 复核覆盖缺口摘要只基于本地现有聚合结果，不代表真实复核结论写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 缺口识别用于主管查看顺序，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityReviewCoverageGap` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，27 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“复核覆盖缺口摘要”“还有 1 个影响异常的数据质量问题未进入当前复核路径”“DQ-202605-004”“人员绑定缺失”“agent_binding.employee_id”“A-9931”“查看缺口问题”“无真实数据修复”“无导出或批量处理”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality review path sequence

#### 结论

- `F386/Q104/US542-US544` 已完成数据质量复核路径顺序。
- 前端模型新增 `summarizeDataQualityReviewPathSequence()`，把优先问题、字段、日期、人员和原因摘要汇成连续查看步骤。
- 数据质量总览页新增“复核路径顺序”卡片，展示路径步骤、首要步骤、首要入口、每步理由、影响异常、影响人员和“查看路径步骤”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 复核路径顺序只基于本地现有聚合结果，不代表真实复核结论写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 路径顺序用于主管查看导航，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityReviewPathSequence` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，25 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“复核路径顺序”“先看 DQ-202605-010”“status_log.status_start_at/status_end_at”“2026-05-11”“A-1002”“status_overlap”“查看路径步骤”“无真实数据修复”“无导出或批量处理”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality review priority rationale

#### 结论

- `F385/Q103/US539-US541` 已完成数据质量复核优先级说明。
- 前端模型新增 `summarizeDataQualityReviewPriorityRationale()`，把影响异常 Top、字段、日期、人员和原因摘要汇成主管可读的首要复核理由。
- 数据质量总览页新增“复核优先级说明”卡片，展示优先问题、首要字段、首要日期、首要人员、首要原因、理由列表、下一查看和“查看优先问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 复核优先级说明只基于本地现有聚合结果，不代表真实复核结论写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 优先级说明用于主管查看顺序，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityReviewPriorityRationale` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，23 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“复核优先级说明”“先复核 DQ-202605-010”“status_log.status_start_at/status_end_at”“2026-05-11”“A-1002”“查看优先问题”“无真实数据修复”“无导出或批量处理”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality field impact cross-summary

#### 结论

- `F384/Q102/US536-US538` 已完成数据质量字段影响交叉摘要。
- 前端模型新增 `summarizeDataQualityFieldImpactSummary()`，基于影响履约异常的数据质量问题，按来源字段和来源聚合影响日期、人员、异常和代表问题。
- 数据质量总览页新增“字段影响交叉摘要”卡片，展示字段、影响日期、影响人员、影响异常、代表原因、代表问题、下一查看和“查看字段问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 字段交叉摘要只基于本地现有 quality issue affectedObjects/impactLinks/sourceField/source，不代表真实异常闭环写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 字段排序用于主管查看优先级，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityFieldImpactSummary` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，21 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“字段影响交叉摘要”“status_log.status_start_at/status_end_at”“DQ-202605-010”“status_overlap”“查看字段问题”“无真实数据修复”“无导出或批量处理”“影响日期”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality impacted-day view order

#### 结论

- `F383/Q101/US533-US535` 已完成数据质量履约日期查看顺序。
- 前端模型新增 `summarizeDataQualityDayViewOrder()`，基于影响履约异常的数据质量问题，按业务日期聚合异常、人员和代表问题。
- 数据质量总览页新增“履约日期查看顺序”卡片，展示影响日期、影响异常、影响人员、代表原因、代表问题、下一查看和“查看履约日期”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 日期查看顺序只基于本地现有 quality issue affectedObjects/impactLinks/日期文本，不代表真实异常闭环写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 日期排序用于主管查看优先级，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityDayViewOrder` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，19 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“履约日期查看顺序”“2026-05-11”“DQ-202605-010”“status_overlap”“查看履约日期”“无真实数据修复”“无导出或批量处理”“影响日期”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality impacted-person view order

#### 结论

- `F382/Q100/US530-US532` 已完成数据质量人员履约查看顺序。
- 前端模型新增 `summarizeDataQualityPersonViewOrder()`，基于影响履约异常的数据质量问题，按受影响人员聚合原因、异常和代表问题。
- 数据质量总览页新增“人员履约查看顺序”卡片，展示影响人员、影响异常、首要人员、代表原因、代表问题、下一查看和“查看个人履约”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 人员查看顺序只基于本地现有 quality issue affectedObjects/impactLinks，不代表真实异常闭环写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 人员排序用于主管查看优先级，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityPersonViewOrder` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，17 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“人员履约查看顺序”“A-1002”“status_overlap”“DQ-202605-010”“查看个人履约”“无真实数据修复”“无导出或批量处理”“首要人员”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality impacted-exception cause summary

#### 结论

- `F381/Q099/US527-US529` 已完成数据质量异常影响原因汇总。
- 前端模型新增 `summarizeDataQualityExceptionCauses()`，基于影响履约异常的数据质量问题，按错误码、字段和来源聚合原因组。
- 数据质量总览页新增“异常影响原因汇总”卡片，展示原因类型、影响异常、影响人员、阻断行、代表问题、下一查看和暂缓能力。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 原因汇总只基于本地现有 quality issue affectedObjects/impactLinks/errorCode/sourceField/source，不代表真实异常闭环写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 原因排序用于主管查看优先级，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityExceptionCauses` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，15 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“异常影响原因汇总”“status_overlap”“status_log.status_start_at/status_end_at”“DQ-202605-010”“A-1002”“无真实数据修复”“无导出或批量处理”“查看代表问题”“原因类型”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality detail impacted-exception drilldown

#### 结论

- `F380/Q098/US524-US526` 已完成数据质量详情异常影响拆解。
- 前端模型新增 `summarizeDataQualityExceptionImpact()`，基于单个数据质量问题的影响对象和履约入口聚合影响异常数、影响人员、首要异常、影响对象、下一查看入口和暂缓能力。
- 数据质量详情页新增“影响异常拆解”卡片，展示影响异常、影响人员、影响对象、首要异常、异常条目、下一查看和暂缓能力。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 异常影响拆解只基于本地现有 quality issue affectedObjects/impactLinks，不代表真实异常闭环写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 影响拆解用于主管查看顺序，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityExceptionImpact` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，13 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality/DQ-202605-010` HTML 包含“影响异常拆解”“小组成员矩阵异常”“A-1002”“下一查看”“无真实数据修复”“无导出或批量处理”“首要异常”“打开入口”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality impacted-exception top aggregation

#### 结论

- `F379/Q097/US521-US523` 已完成数据质量影响异常 Top 聚合。
- 前端模型新增 `summarizeDataQualityExceptionTop()`，基于数据质量问题的影响对象和履约入口聚合影响异常数、影响人员、阻断行、首要查看入口和暂缓能力。
- 数据质量总览页新增“影响异常 Top”卡片，展示影响问题、影响异常、影响人员、排名问题、影响对象、下一查看和“查看问题”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- Top 聚合只基于本地现有 quality issue affectedObjects/impactLinks，不代表真实异常闭环写入、数据修复、证据补录、审批、权限、导出、批量或生产持久化已经实现。
- 影响排序用于主管查看优先级，不是生产级 SLA、结算、考核或收费公式。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityExceptionTop` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，10 个数据质量模型/页面源码测试通过。
- 页面 smoke：通过，`/data-quality` HTML 包含“影响异常 Top”“影响问题”“影响异常”“影响人员”“DQ-202605-010”“状态时间段重叠”“下一查看”“无真实数据修复”“无导出或批量处理”“查看问题”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Weekly closure readiness trend reason breakdown

#### 结论

- `F378/Q096/US518-US520` 已完成周度闭环准备趋势原因拆解。
- 前端模型扩展 `closureReadinessTrend.points`，为每日趋势增加变化原因、主阻塞、材料/主管判断/数据核对拆分和下一查看提示。
- 履约日历小组周视图的“闭环准备趋势”卡片新增“变化原因”区域，展示阻塞日和转好日的原因说明。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 原因拆解只基于本地现有异常队列和闭环材料状态，不代表真实证据补录、异常关闭、复核结论写入、审批、权限、导出、批量或生产持久化已经实现。
- 趋势点的变化原因是主管查看提示，不是生产级 SLA、结算或考核公式。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于页面缺少“变化原因”文案且趋势点缺少 `primaryBlocker` 等字段，证明测试覆盖新增模型和页面契约。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型/页面源码测试通过。
- 页面 smoke：通过，`/person-timeline?team=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA%7C%7C%E5%8D%9A%E8%A5%BF%E5%AE%A2%E6%9C%8D` HTML 包含“闭环准备趋势”“变化原因”“主阻塞”“下一查看”“首日基线”“较前一日转好”“待补材料”“待主管判断”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Data quality import batch impact aggregation

#### 结论

- `F377/Q095/US515-US517` 已完成数据质量影响导入批次反向聚合。
- 前端模型新增 `summarizeDataQualityImportBatchImpact()`，基于数据质量问题、导入批次关联 ID、失败行字段和错误码聚合相关批次、失败行、匹配字段、影响对象、查看建议和暂缓能力。
- 数据质量详情页新增“影响导入批次”卡片，展示相关批次、失败行、匹配字段、影响对象、批次状态、查看建议和“查看批次”入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 影响导入批次只做本地只读反向聚合，不代表真实失败行落库、真实数据修复、复核结论写入、证据补录、异常关闭、审批、权限、导出、批量或生产持久化已经实现。
- 页面聚合基于现有本地 fallback 数据；未匹配到导入批次时会展示只读空状态。

#### 验证

- TDD red：`node --test scripts/tests/data-quality.test.mjs` 首次失败于 `summarizeDataQualityImportBatchImpact` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/data-quality.test.mjs`：通过，7 个数据质量模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过。
- `npm run typecheck`：通过。
- 页面 smoke：通过，`/data-quality/DQ-202605-004` HTML 包含“影响导入批次”“相关批次”“匹配字段”“BATCH-20260519-001”“查看批次”“无真实数据修复”“无导出或批量处理”“employee_id”“人员排班”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Import review conclusion preview

#### 结论

- `F376/Q094/US512-US514` 已完成导入批次复核结论预览。
- 前端模型新增 `summarizeImportBatchReviewConclusion()`，基于失败原因汇总、质量影响聚合、修正准备摘要和修正材料预览生成结论状态、建议结论、置信度、证据摘要、风险提示、下一查看点和暂缓能力。
- 导入批次详情页在“修正材料预览”后展示“复核结论预览”，并保留“失败行明细”作为下一层定位信息。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 复核结论预览只做复核前口径整理，不代表真实复核结论写入、证据补录、异常关闭、审批、权限、导出、批量或生产持久化已经实现。
- in-app Browser 未能暴露可直接导航本地页面的控制接口；已用同一开发服务的本机 API 和 HTML 响应核对页面关键文本。

#### 验证

- TDD red：`node --test scripts/tests/import-batch-history.test.mjs` 首次失败于 `summarizeImportBatchReviewConclusion` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，23 个导入批次模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过。
- `npm run typecheck`：通过。
- 页面 smoke：通过，使用本地 API 创建 `BATCH-SL-20260526-001`，详情 HTML 包含“复核结论预览”“建议结论”“结论状态”“置信度”“证据摘要”“风险提示”“下一查看点”“暂缓能力”“无复核结论写入”“无补证据写入”“无关闭异常”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Import correction material preview

#### 结论

- `F375/Q093/US509-US511` 已完成导入批次修正材料预览。
- 前端模型新增 `summarizeImportBatchCorrectionMaterials()`，基于失败原因汇总、质量影响聚合和修正准备摘要整理材料状态、材料摘要、字段材料、失败行样本、相关质量问题、沟通要点和暂缓能力。
- 导入批次详情页在“修正准备摘要”后展示“修正材料预览”，并保留“失败行明细”作为下一层定位信息。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 修正材料预览只做复核前材料整理，不代表真实修正提交、证据补录、复核结论写入、审批、权限、导出、批量或生产持久化已经实现。
- in-app Browser 未能暴露可直接导航本地页面的控制接口；已用同一开发服务的本机 API 和 HTML 响应核对页面关键文本。

#### 验证

- TDD red：`node --test scripts/tests/import-batch-history.test.mjs` 首次失败于 `summarizeImportBatchCorrectionMaterials` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，20 个导入批次模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过。
- `npm run typecheck`：通过。
- 页面 smoke：通过，使用本地 API 创建 `BATCH-SL-20260526-001`，详情 HTML 包含“修正材料预览”“材料摘要”“字段材料”“失败行样本”“沟通要点”“暂缓能力”“无修正提交”“无补证据写入”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Import correction readiness summary

#### 结论

- `F374/Q092/US506-US508` 已完成导入批次修正准备摘要。
- 前端模型新增 `summarizeImportBatchCorrectionReadiness()`，基于失败原因汇总、质量影响聚合和本地数据质量问题生成准备等级、首要字段、需确认对象、风险提示、建议查看顺序和暂缓能力。
- 导入批次详情页在“质量影响聚合”后展示“修正准备摘要”，并保留“失败行明细”作为下一层定位信息。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 修正准备摘要只做查看顺序和复核材料准备口径，不代表真实修正提交、证据补录、复核结论写入、审批、权限、导出、批量或生产持久化已经实现。
- in-app Browser 未能直接访问本地端口；已用同一开发服务的本机 HTML 响应核对页面关键文本。

#### 验证

- TDD red：`node --test scripts/tests/import-batch-history.test.mjs` 首次失败于 `summarizeImportBatchCorrectionReadiness` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，17 个导入批次模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过。
- `npm run typecheck`：通过。
- 页面 smoke：通过，使用本地 API 创建 `BATCH-SL-20260526-001`，详情 HTML 包含“修正准备摘要”“准备等级”“首要字段”“确认对象”“风险提示”“建议查看顺序”“暂缓能力”“无修正提交”“无审批或批量”“失败行明细”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Import failure quality impact rollup

#### 结论

- `F373/Q091/US503-US505` 已完成导入失败原因质量影响聚合。
- 前端模型新增 `summarizeImportBatchQualityImpact()`，基于批次失败原因、`qualityIssueIds` 和本地数据质量问题聚合关联问题数、覆盖字段、未关联原因、影响对象、首要问题和查看顺序。
- 导入批次详情页在“失败原因汇总”后展示“质量影响聚合”，并保留已有数据质量问题详情入口。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 质量影响聚合只读取现有本地质量问题和当前批次失败行，不代表生产修复、真实质量闭环写入、审批、权限、导出或批量能力已经实现。
- 本地 process-memory CSV 批次没有 `qualityIssueIds` 时，页面会显示“无关联质量影响”的只读空状态。

#### 验证

- TDD red：`node --test scripts/tests/import-batch-history.test.mjs` 首次失败于 `summarizeImportBatchQualityImpact` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，14 个导入批次模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过。
- `npm run typecheck`：通过。
- 页面 smoke：通过，使用本地 API 创建 `BATCH-SL-20260526-001`，详情 HTML 包含“质量影响聚合”“关联问题”“覆盖字段”“未关联原因”“首要问题”“当前批次没有关联数据质量影响”“失败原因汇总”“失败行明细”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Import failure reason summary

#### 结论

- `F372/Q090/US500-US502` 已完成导入批次详情失败原因汇总。
- 前端模型新增 `summarizeImportBatchFailureReasons()`，按字段和错误码聚合现有失败行，返回失败原因数、失败行数、首要原因、代表行、代表原值、影响对象和修正提示。
- 导入批次详情页在失败行明细前展示“失败原因汇总”，帮助现场主管先看主要失败字段、错误码、影响对象和修正顺序。
- 本批没有新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 失败原因汇总只读取当前批次失败行并在前端本地聚合，不代表生产数据持久化、质量闭环写入、真实修复提交、审批或导出能力已经实现。
- 浏览器自动化访问本机前端端口被运行环境拦截；已用同一开发服务的本机 HTML 响应核对页面关键文本。

#### 验证

- TDD red：`node --test scripts/tests/import-batch-history.test.mjs` 首次失败于 `summarizeImportBatchFailureReasons` 未导出，证明测试覆盖新增模型契约。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，12 个导入批次模型测试通过。
- `npm run typecheck`：通过。
- 页面 smoke：通过，使用本地 API 创建 `BATCH-SL-20260526-001`，详情 HTML 包含“失败原因汇总”“原因数”“失败行”“end_at”“invalid_time_range”“status_type”“missing_required_field”“修正提示”“失败行明细”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Import batch list process-memory results

#### 结论

- `B013/F371/Q089/US497-US499` 已完成导入批次列表接入本地进程内结果。
- 后端新增 `GET /api/v1/import-batches`，从 FastAPI 进程内存读取 CSV 导入批次结果，并按 `uploaded_at` 与 `batch_id` 倒序返回。
- 前端 `getImportBatches()` 优先读取本地 API 结果，使用现有 `mapImportBatchResult()` 映射后放在 fallback 样例前；接口不可用或没有进程内结果时继续展示现有本地样例。
- 本批没有新增依赖、没有修改 package/lockfile，没有新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 列表读取的是 FastAPI 进程内存，服务重启后不会保留；这符合本 Gate 的 no-database 边界，不代表生产持久化、生产文件存储或审计留痕已完成。
- 当前只提供只读列表聚合，不提供批量处理、重新导入、导出、审批、权限或生产处理状态。

#### 验证

- TDD red：后端 unittest 首次失败于 `list_import_batches` 不存在；同秒导入排序测试先失败并推动排序改为 `uploaded_at + batch_id` 倒序；前端模型测试首次失败于 `getImportBatches()` 仍只返回 fallback。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v`：通过，38 个后端测试通过。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，10 个导入批次模型测试通过。
- Browser/API smoke：通过，API 生成 `BATCH-SL-20260526-001`，`GET /api/v1/import-batches` 返回该批次，浏览器 `/import-batches` 显示“BATCH-SL-20260526-001”“状态日志模板”“status_log_list_smoke.csv”“现场主管”“已完成”，并保留 fallback “主数据模板”。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-26 - Status log CSV local import

#### 结论

- `B012/F370/Q088/US494-US496` 已完成状态日志 CSV 本地上传导入纵切。
- 后端新增 `POST /api/v1/import-batches/status-log`，接收 `file_name`、`uploaded_by`、`csv_content`，用 Python 标准库 `csv.DictReader` 解析状态日志 CSV，并返回批次编号、成功行、失败行、错误码和失败行明细。
- 后端复用 `GET /api/v1/import-batches/{batch_id}`，从 FastAPI 进程内存读取刚生成的批次结果；不写入数据库。
- 前端 `/import-batches/new` 新增状态日志模式，导入批次页“上传 CSV”默认进入状态日志上传，批次详情页展示失败行号、字段、错误码、说明和原值。
- 本批没有新增依赖、没有修改 package/lockfile，没有新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班、结算、收费因子或生产公式。

#### 风险

- 批次结果保存在进程内存，服务重启后不会保留；这符合本 Gate 的 no-database 边界，不代表生产持久化、生产文件存储或审计留痕已完成。
- 本轮只校验必填字段和状态开始/结束时间顺序；跨天、时区、业务日切分、真实 CORN/HR/WFM 接入和生产状态字典仍需后续独立 Gate。

#### 验证

- TDD red：后端 unittest 首次失败于 `import_status_log_csv` 不存在；前端模型测试首次失败于 `createStatusLogImportBatch` 不存在。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v`：通过，37 个后端测试通过。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，8 个导入批次模型测试通过。
- Browser/API smoke：通过，CSV 生成 `BATCH-SL-20260526-001`，浏览器详情页显示“状态日志模板”“完成有错误”“失败行明细”“end_at”“invalid_time_range”“状态结束时间必须晚于开始时间”；上传页显示状态日志文件输入和必填字段。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Login log CSV local import

#### 结论

- `B011/F369/Q087/US491-US493` 已完成登录日志 CSV 本地上传导入纵切。
- 后端新增 `POST /api/v1/import-batches/login-log`，接收 `file_name`、`uploaded_by`、`csv_content`，用 Python 标准库 `csv.DictReader` 解析登录日志 CSV，并返回批次编号、成功行、失败行、错误码和失败行明细。
- 后端复用 `GET /api/v1/import-batches/{batch_id}`，从 FastAPI 进程内存读取刚生成的批次结果；不写入数据库。
- 前端 `/import-batches/new` 新增登录日志模式，导入批次页“上传 CSV”默认进入登录日志上传，批次详情页展示失败行号、字段、错误码、说明和原值。
- 本批没有新增依赖、没有修改 package/lockfile，没有新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 批次结果保存在进程内存，服务重启后不会保留；这符合本 Gate 的 no-database 边界，不代表生产持久化、生产文件存储或审计留痕已完成。
- 本轮只校验必填字段和登录/登出时间顺序；跨天、时区、业务日切分、真实 CORN/HR/WFM 接入和生产状态字典仍需后续独立 Gate。

#### 验证

- TDD red：后端 unittest 首次失败于 `import_login_log_csv` 不存在；前端模型测试首次失败于 `createLoginLogImportBatch` 不存在。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v`：通过，34 个后端测试通过。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，7 个导入批次模型测试通过。
- Browser/API smoke：通过，CSV 生成 `BATCH-LL-20260525-001`，浏览器详情页显示“登录日志模板”“完成有错误”“失败行明细”“logout_at”“invalid_time_range”“登出时间必须晚于登录时间”；上传页显示登录日志文件输入和必填字段。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Personnel schedule CSV local import

#### 结论

- `B010/F368/Q086/US488-US490` 已完成人员级排班 CSV 本地上传导入纵切。
- 后端新增 `POST /api/v1/import-batches/personnel-schedule`，接收 `file_name`、`uploaded_by`、`csv_content`，用 Python 标准库 `csv.DictReader` 解析人员级排班 CSV，并返回批次编号、成功行、失败行、错误码和失败行明细。
- 后端复用 `GET /api/v1/import-batches/{batch_id}`，从 FastAPI 进程内存读取刚生成的批次结果；不写入数据库。
- 前端 `/import-batches/new` 新增人员级排班模式，导入批次页“上传 CSV”默认进入人员级排班上传，批次详情页展示失败行号、字段、错误码、说明和原值。
- 本批没有新增依赖、没有修改 package/lockfile，没有新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 批次结果保存在进程内存，服务重启后不会保留；这符合本 Gate 的 no-database 边界，不代表生产持久化、生产文件存储或审计留痕已完成。
- 本轮只校验必填字段和起止时间顺序；员工、班次类型、供应商、职场和项目的真实主数据外键校验仍需后续主数据生产 Gate。

#### 验证

- TDD red：后端 unittest 首次失败于 `import_personnel_schedule_csv` 不存在；前端模型测试首次失败于 `createPersonnelScheduleImportBatch` 不存在。
- `/Users/mac/.local/bin/python3 -m unittest backend.tests.test_schedule_plans.SchedulePlansApiTest -v`：通过，31 个后端测试通过。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，6 个导入批次模型测试通过。
- Browser/API smoke：通过，CSV 生成 `BATCH-PS-20260525-001`，浏览器详情页显示“人员级排班模板”“完成有错误”“失败行明细”“end_at”“invalid_time_range”“排班结束时间必须晚于开始时间”；上传页显示人员级排班文件输入和必填字段。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Demand forecast CSV local import

#### 结论

- `B009/F367/Q085/US485-US487` 已完成需求预测 CSV 本地上传导入纵切。
- 后端新增 `POST /api/v1/import-batches/demand-forecast`，接收 `file_name`、`uploaded_by`、`csv_content`，用 Python 标准库 `csv.DictReader` 解析需求预测 CSV，并返回批次编号、成功行、失败行、错误码和失败行明细。
- 后端新增 `GET /api/v1/import-batches/{batch_id}`，从 FastAPI 进程内存读取刚生成的批次结果；不写入数据库。
- 前端新增 `/import-batches/new`，导入批次页提供“上传 CSV”入口，批次详情页展示失败行号、字段、错误码、说明和原值。
- 本批没有新增依赖、没有修改 package/lockfile，没有新增数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、自动排班、结算、收费因子或生产公式。

#### 风险

- 批次结果保存在进程内存，服务重启后不会保留；这符合本 Gate 的 no-database 边界，不代表生产持久化、生产文件存储或审计留痕已完成。
- 前端文件选择到 API 的真实表单提交已实现；受当前浏览器自动化能力限制，smoke 使用同一 CSV 文件直接调用本地 API 生成批次，再用浏览器验证上传页和批次详情渲染。

#### 验证

- TDD red：后端 unittest 首次失败于 `get_import_batch_result` / `DemandForecastCsvImportRequest` 不存在；前端模型测试首次失败于 `mapImportBatchResult` 不存在。
- `/Users/mac/.local/bin/python3 -m unittest discover -s backend/tests -v`：通过，28 个后端测试通过。
- `node --test scripts/tests/import-batch-history.test.mjs`：通过，5 个导入批次模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser/API smoke：通过，CSV 生成 `BATCH-DF-20260525-001`，浏览器详情页显示“需求预测模板”“完成有错误”“失败行明细”“forecast_agents”“missing_required_field”“需求预测导入必填字段为空”；上传页显示文件输入和必填字段。截图保存至 `/private/tmp/bpo-demand-forecast-import-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Weekly view boundary check

#### 结论

- `F365-F366/Q084/US482-US484` 已完成周度查看边界核查和 QA 收口。
- 团队周视图新增 `weeklyQaBoundarySummary`，基于周度决策摘要和周度来源压力派生覆盖看板数、边界事项数、开放风险、升级压力、首要边界、关联看板和边界原因。
- 页面在现有小组周视图侧栏展示“周度查看边界核查”，位于周度闭环收口摘要之后、本周复核队列之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、关闭异常、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看边界解释，不代表复核结论写入、证据上传、审批发布、报表权限、外部数据接入、处理记录写入或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `weeklyQaBoundarySummary` 为 `undefined`；页面源序测试同时失败于缺少“周度查看边界核查”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组周视图，页面显示“周度查看边界核查”“本周 7 个主管看板均为查看依据，6 类生产能力仍需单独确认。”“边界 6”“复核写入”“补充证据”“审批发布”，且周度查看边界核查位于周度闭环收口摘要之后、本周复核队列之前；截图保存至 `/private/tmp/bpo-weekly-view-boundary-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Weekly closure closeout

#### 结论

- `F363-F364/Q083/US479-US481` 已完成周度闭环收口摘要和 QA 收口。
- 团队周视图新增 `weeklyClosureCloseoutSummary`，基于本周闭环准备趋势、证据缺口分布和周度决策摘要派生可推进日、未就绪日、待补材料、待主管判断、开放风险、关键收口项和下钻建议。
- 页面在现有小组周视图侧栏展示“周度闭环收口摘要”，位于周度复核对比摘要之后、本周复核队列之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、关闭异常、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和闭环收口解释，不代表真实复核结论写入、异常关闭、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `weeklyClosureCloseoutSummary` 为 `undefined`；页面源序测试同时失败于缺少“周度闭环收口摘要”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组周视图，页面显示“周度闭环收口摘要”“本周 6 天可推进闭环，周一 05/11 仍有 2 项未就绪，先补待补材料。”“未就绪 1”“优先收口日”“证据缺口收口”“判断风险收口”，且周度闭环收口摘要位于周度复核对比摘要之后、本周复核队列之前；截图保存至 `/private/tmp/bpo-weekly-closure-closeout-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Weekly review comparison

#### 结论

- `F361-F362/Q082/US476-US478` 已完成周度复核对比摘要和 QA 收口。
- 团队周视图新增 `weeklyReviewComparisonSummary`，基于本周来源压力、责任压力、质量影响、闭环准备趋势、复核队列和决策摘要派生对比维度、升级压力、未就绪日、开放风险、关键对比项、影响说明和下钻建议。
- 页面在现有小组周视图侧栏展示“周度复核对比摘要”，位于周度来源压力之后、本周复核队列之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和复核对比解释，不代表真实数据修复、复核结论写入、异常关闭、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `weeklyReviewComparisonSummary` 为 `undefined`；页面源序测试同时失败于缺少“周度复核对比摘要”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组周视图，页面显示“周度复核对比摘要”“本周先对齐登录轨道 / 现场主管 / 状态时间段重叠，闭环阻塞集中在待补材料。”“对比 3”“来源与责任对比”“质量与闭环对比”“队列与判断对比”，且周度复核对比摘要位于周度来源压力之后、本周复核队列之前；截图保存至 `/private/tmp/bpo-weekly-review-comparison-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Weekly source pressure

#### 结论

- `F359-F360/Q081/US473-US475` 已完成周度来源压力和 QA 收口。
- 团队周视图新增 `weeklySourcePressureSummary`，基于本周各小组日期的本地异常队列派生来源轨道、异常数、高优数、升级数、阻塞证据数、影响人员、影响日期、影响时长和下钻建议。
- 页面在现有小组周视图侧栏展示“周度来源压力”，位于周度责任压力之后、本周复核队列之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和来源压力解释，不代表真实数据修复、复核结论写入、异常关闭、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `weeklySourcePressureSummary` 为 `undefined`；页面源序测试同时失败于缺少“周度来源压力”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组周视图，页面显示“周度来源压力”“本周登录轨道有 1 项异常、1 项升级，先看王敏 / 迟到 21 分钟。”“升级 1”“登录轨道”“状态轨道”“阻塞证据 3 项”，且周度来源压力位于周度责任压力之后、本周复核队列之前；截图保存至 `/private/tmp/bpo-weekly-source-pressure-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Weekly owner pressure

#### 结论

- `F357-F358/Q080/US470-US472` 已完成周度责任压力和 QA 收口。
- 团队周视图新增 `weeklyOwnerPressureSummary`，基于本周各小组日期的本地异常队列派生负责角色、异常数、高优数、升级数、阻塞证据数、影响人员、影响日期、影响时长和下钻建议。
- 页面在现有小组周视图侧栏展示“周度责任压力”，位于周度质量影响汇总之后、本周复核队列之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和责任压力解释，不代表真实派单、通知、复核结论写入、异常关闭、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `weeklyOwnerPressureSummary` 为 `undefined`；页面源序测试同时失败于缺少“周度责任压力”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组周视图，页面显示“周度责任压力”“本周现场主管承接 2 项异常、1 项升级，先看王敏 / 迟到 21 分钟。”“升级 1”“现场主管”“数据管理员”“阻塞证据 6 项”，且周度责任压力位于周度质量影响汇总之后、本周复核队列之前；截图保存至 `/private/tmp/bpo-weekly-owner-pressure-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Weekly data-quality summary

#### 结论

- `F355-F356/Q079/US467-US469` 已完成周度质量影响汇总和 QA 收口。
- 团队周视图新增 `weeklyDataQualitySummary`，基于本周各小组日期的本地异常队列和数据质量链接派生影响异常数、影响人员、影响日期、影响时长、严重度、阻塞证据、下钻路径和业务原因。
- 页面在现有小组周视图侧栏展示“周度质量影响汇总”，位于周度决策摘要之后、本周复核队列之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和周度质量影响解释，不代表真实数据质量修复、复核结论写入、异常关闭、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `weeklyDataQualitySummary` 为 `undefined`；页面源序测试同时失败于缺少“周度质量影响汇总”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组周视图，页面显示“周度质量影响汇总”“本周 2 个数据质量问题影响 2 项异常，先处理状态时间段重叠。”“高严重 1”“DQ-202605-010 / 状态时间段重叠”“培训安排说明”“在线要求确认”“主管复核结论”，且周度质量影响汇总位于周度决策摘要之后、本周复核队列之前；截图保存至 `/private/tmp/bpo-weekly-data-quality-summary-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Data-quality impact ranking

#### 结论

- `F353-F354/Q078/US464-US466` 已完成数据质量影响排序和 QA 收口。
- 小组矩阵新增 `dataQualityImpactRanking`，基于当前异常队列的数据质量链接、影响时长、严重度和处理指引派生影响分、阻塞证据和建议查看路径。
- 页面在现有小组当日异常侧栏展示“数据质量影响排序”，位于质量影响异常之后、影响范围优先级之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、真实修复、提交、保存、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和影响排序，不代表真实数据质量修复、复核结论写入、异常关闭、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `dataQualityImpactRanking` 为 `undefined`；页面源序测试同时失败于缺少“数据质量影响排序”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“数据质量影响排序”“优先处理 DQ-202605-010 状态时间段重叠，影响 5.00h 和 1 项异常。”“高严重 1”“阻塞证据 6 项”“影响分 561”“培训安排说明”“在线要求确认”“主管复核结论”，且数据质量影响排序位于质量影响异常之后、影响范围优先级之前；截图保存至 `/private/tmp/bpo-data-quality-impact-ranking-smoke.png`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Supervisor closure review summary

#### 结论

- `F351-F352/Q077/US461-US463` 已完成主管闭环复核摘要和 QA 收口。
- 小组矩阵新增 `closureReviewSummary`，基于当前异常队列已有复核分组、复核结论预览、闭环清单、证据摘要和开放风险派生闭环复核摘要。
- 页面在现有小组当日异常侧栏展示“闭环复核摘要”，位于闭环风险解释之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、提交、保存、关闭异常、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和复核摘要，不代表真实复核结论写入、异常关闭、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `closureReviewSummary` 为 `undefined`；页面源序测试同时失败于缺少“闭环复核摘要”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“闭环复核摘要”“当前 0 项可闭环、2 项待复核，先复核王敏 / 迟到 21 分钟。”“阻塞摘要”“风险摘要”“下一步”，且闭环复核摘要位于闭环风险解释之后、风险趋势之前。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Weekly decision digest

#### 结论

- `F349-F350/Q076/US458-US460` 已完成周度决策摘要和 QA 收口。
- 团队周视图新增 `supervisorWeeklyDecisionDigest`，基于本周复核队列、交接摘要、证据缺口分布和闭环准备趋势派生周度建议判断。
- 页面在现有小组周视图侧栏展示“周度决策摘要”，位于本周复核队列之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和周度判断摘要，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `supervisorWeeklyDecisionDigest` 为 `undefined`；页面源序测试同时失败于缺少“周度决策摘要”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组周视图，页面显示“周度决策摘要”“本周先判断供应商 A / 周一 05/11，当前 3 个复核组合、2 项异常交接需要主管确认。”“建议判断”“开放风险”“先复核供应商 A / 周一 05/11”“先补主管判断”“周一闭环暂缓”，且周度决策摘要位于本周复核队列之前。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，current queue 与 active tasks 已清空。

### 2026-05-25 - Closure risk explanation

#### 结论

- `F346-F348/Q075/US454-US457` 已完成闭环风险解释和 QA 收口。
- 小组矩阵新增 `closureRiskExplanation`，基于当前异常队列已有闭环清单、复核结论预览、质量影响范围、处理指引和证据引用派生闭环风险解释。
- 页面在现有小组当日异常侧栏展示“闭环风险解释”，位于主管决策摘要之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和闭环风险解释，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `closureRiskExplanation` 为 `undefined`；页面源序测试同时失败于缺少“闭环风险解释”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“闭环风险解释”“当前 2 项异常存在闭环风险，先解释王敏 / 迟到 21 分钟的 2 项阻塞。”“业务影响”“待补证据”“下一查看”，且闭环风险解释位于主管决策摘要之后、风险趋势之前。

### 2026-05-25 - Supervisor decision digest

#### 结论

- `F343-F345/Q074/US450-US453` 已完成主管决策摘要和 QA 收口。
- 小组矩阵新增 `supervisorDecisionDigest`，基于当前异常队列已有复核结论预览、闭环清单、证据引用、开放风险和下一复核点派生主管决策摘要。
- 页面在现有小组当日异常侧栏展示“主管决策摘要”，位于处理准备叙事之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和建议摘要，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `supervisorDecisionDigest` 为 `undefined`；页面源序测试随后失败于缺少“主管决策摘要”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run lint` 和 `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“主管决策摘要”“当前 2 项异常均有待确认判断，先看王敏 / 迟到 21 分钟。”“开放风险”“证据引用”“下一复核点”，且主管决策摘要位于风险趋势之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Handling readiness narrative

#### 结论

- `F340-F342/Q073/US446-US449` 已完成处理准备叙事和 QA 收口。
- 小组矩阵新增 `handlingReadinessNarrative`，基于当前异常队列已有处理指引、闭环清单、证据摘要和影响范围派生处理前置说明。
- 页面在现有小组当日异常侧栏展示“处理准备叙事”，位于主管优先级总览之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和处理准备说明，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `handlingReadinessNarrative` 为 `undefined`；页面源序测试随后失败于缺少“处理准备叙事”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“处理准备叙事”“王敏 / 迟到 21 分钟还缺到岗说明、迟到或漏登原因、现场主管确认口径，先补材料再判断。”“待补 4 项”“证据状态”“准备 1”，且处理准备叙事位于风险趋势之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Supervisor priority summary

#### 结论

- `F337-F339/Q072/US442-US445` 已完成主管优先级总览和 QA 收口。
- 小组矩阵新增 `supervisorPrioritySummary`，基于当前异常队列已有优先级、升级状态、闭环阻塞、影响时长和影响范围派生主管查看顺序。
- 页面在现有小组当日异常侧栏展示“主管优先级总览”，位于影响范围优先级之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和排序建议，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `supervisorPrioritySummary` 为 `undefined`；页面源序测试随后失败于缺少“主管优先级总览”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“主管优先级总览”“优先查看王敏 / 迟到 21 分钟：高优异常且需要升级，先补 2 项材料。”“高优 1 项”“阻塞 2 项”“升级 1 项”“A-1002 王敏 / 迟到 21 分钟”，且主管优先级总览位于风险趋势之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Exception impact priority

#### 结论

- `F334-F336/Q071/US438-US441` 已完成异常影响范围优先级汇总和 QA 收口。
- 小组矩阵新增 `exceptionImpactPriority`，基于当前异常队列已有影响范围、影响对比、影响时长、优先级、闭环阻塞和升级状态派生排序。
- 页面在现有小组当日异常侧栏展示“影响范围优先级”，位于质量影响异常之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班、真实处理或生产公式。

#### 风险

- 本轮只做主管查看和异常影响排序，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `exceptionImpactPriority` 为 `undefined`；页面源序测试随后失败于缺少“影响范围优先级”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“影响范围优先级”“优先查看刘晨 / 午后状态缺登录切片，影响 5.00h，涉及 3 个对象。”“2 项阻塞”“总影响”“5.35h”“A-1001 刘晨 / 午后状态缺登录切片”，且影响范围优先级位于风险趋势之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Data quality exception impact

#### 结论

- `F331-F333/Q070/US434-US437` 已完成数据质量到履约异常反向聚合和 QA 收口。
- 小组矩阵新增 `dataQualityExceptionImpact`，基于当前异常队列已有 `dataQualityLinks` 聚合质量问题、关联异常、影响人员、影响时长、代表异常和质量详情入口。
- 页面在现有小组当日异常侧栏展示“质量影响异常”，位于复核结论预览之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和质量影响定位，不代表真实质量修复、复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `dataQualityExceptionImpact` 为 `undefined`；页面源序测试随后失败于缺少“质量影响异常”卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“质量影响异常”“当前 2 个数据质量问题关联 2 项异常，先看状态时间段重叠。”“关联异常 2 项”“影响人员 2 人”“影响时长 5.35h”“DQ-202605-010 / 状态时间段重叠”“A-1001 刘晨 / 午后状态缺登录切片”，且质量影响异常位于风险趋势之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Review outcome preview

#### 结论

- `F328-F330/Q069/US430-US433` 已完成复核结论预览和 QA 收口。
- 异常队列项新增 `reviewOutcomePreview`，包含建议结论、可信度、证据摘要、来源引用、准备度、开放风险和下一复核点。
- 页面在现有小组当日异常侧栏展示“复核结论预览”，位于次日关注清单之后、风险趋势之前；不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和复核前口径整理，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `reviewOutcomePreview` 为 `undefined` 且页面缺少复核结论预览卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵并选中 `A-1002::late_login`，页面显示“复核结论预览”“待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。”“可信度 中”“已齐 2 项 / 待补 2 项”“DQ-202605-009”，且复核结论预览位于风险趋势之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Weekly closure readiness trend

#### 结论

- `F325-F327/Q068/US426-US429` 已完成周度闭环准备趋势和 QA 收口。
- 团队周模型新增 `closureReadinessTrend`，包含每日闭环准备方向、准备/阻塞天数、主要阻塞、下一优先回看日期和下钻入口。
- 页面在现有小组周视图右侧展示“闭环准备趋势”，不新增入口或页面；趋势项只下钻到现有小组日期矩阵。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和闭环判断准备，不代表真实复核结论写入、通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `closureReadinessTrend` 为 `undefined` 且页面缺少闭环准备趋势卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs` 和 `node --test scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开团队下钻页，新增卡片区域显示“闭环准备趋势”“本周闭环准备度周二 05/12 起转好，主要阻塞为待补材料。”“阻塞 1 天”“供应商 A / 周一 05/11”“待补材料阻塞 1 项，先看供应商 A / 周一 05/11。”，且页面未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、派单、提交、保存、审批、导出、批量或自动排班。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Team-level evidence gap distribution

#### 结论

- `F322-F324/Q067/US422-US425` 已完成团队级证据缺口分布和 QA 收口。
- 团队周模型新增 `teamEvidenceGapDistribution`，包含证据缺口项数、涉及人员数、主要缺口类型、负责角色、代表人员和建议下钻项。
- 页面在现有小组周视图右侧展示“证据缺口分布”，不新增入口或页面；缺口项只下钻到现有小组日期矩阵。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和证据定位，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `teamEvidenceGapDistribution` 为 `undefined` 且页面缺少证据缺口分布卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开团队下钻页，新增卡片区域显示“证据缺口分布”“本周证据缺口集中在主管判断，共 2 项，涉及 2 人。”“主管判断”“到岗说明”“培训安排说明”“A-1002 王敏”“A-1001 刘晨”“供应商 A”“周一 05/11”，且卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、派单、提交、保存、审批、导出、批量或自动排班。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Weekly supervisor handoff summary

#### 结论

- `F319-F321/Q066/US418-US421` 已完成周度主管交接摘要和 QA 收口。
- 团队周模型新增 `supervisorWeeklyHandoffSummary`，包含交接项数、开放问题数、升级项数、主要交接对象、下一查看项、交接触点和下钻线索。
- 页面在现有小组周视图右侧展示“本周交接摘要”，不新增入口或页面；交接项只下钻到现有小组日期矩阵。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和交接准备，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `supervisorWeeklyHandoffSummary` 为 `undefined` 且页面缺少本周交接摘要卡，证明测试覆盖新增模型和 UI 位置。
- TDD 过程中发现并修正周度聚合漏洞：周度交接聚合必须严格按日期过滤，不能使用个人日视图的可用日期回退，否则会把单日异常复制到无轨道日期。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开团队下钻页，新增卡片区域显示“本周交接摘要”“本周需要向现场主管交接 2 项异常，开放问题 4 个。”“交接项”“开放问题”“升级 1”“现场主管”“班前到岗核对记录”“供应商 A”“周一 05/11”“A-1002”“王敏”“迟到 21 分钟”，且卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、派单、提交、保存、审批、导出、批量或自动排班。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Closure evidence drill-in

#### 结论

- `F316-F318/Q065/US414-US417` 已完成闭环证据下钻解释和 QA 收口。
- 闭环准备度的阻塞项新增证据项，包含人员、负责角色、当前状态、已有证据来源和下一查看位置。
- 页面在现有小组当日异常面板中展示“闭环证据”，证据项链接到已有个人单日三轨详情，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和证据定位，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于闭环准备度缺少 `evidenceItems` 且页面闭环准备度卡未接收 `matrix` 生成下钻链接，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组当日矩阵，闭环准备度卡片区域显示“闭环证据”“A-1002 王敏 / 到岗说明”“已有关联证据：SCH-1002-1 / LOG-1002-1”“下一查看：查看王敏的个人单日三轨详情。”“A-1001 刘晨 / 培训安排说明”，并包含 `/person-timeline/A-1002` 与异常上下文链接；卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、派单、提交、保存、审批、导出、批量或自动排班。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Weekly supervisor review queue

#### 结论

- `F313-F315/Q064/US410-US413` 已完成主管本周复核队列和 QA 收口。
- 团队周模型新增 `supervisorWeeklyReviewQueue`，包含队列摘要、最高优先级项、小组、日期、优先级、缺口人数、异常人数、建议先看对象和复核原因。
- 页面在现有小组周视图右侧展示“本周复核队列”，不新增入口或页面；队列项只下钻到现有小组日期矩阵。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、派单、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看顺序和下钻线索，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `supervisorWeeklyReviewQueue` 为 `undefined` 且页面缺少本周复核队列卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开团队下钻页，新增卡片区域显示“本周复核队列”“本周优先复核供应商 A 的周一 05/11，缺口 2 人 / 异常 2 人。”“待看组合”“高优组合”“供应商 A / 周一 05/11”“建议先看：A-1002 王敏”“供应商 B / 周二 05/12”，且卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、派单、提交、保存、审批、导出、批量或自动排班。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-25 - Exception closure readiness summary

#### 结论

- `F310-F312/Q063/US406-US409` 已完成异常闭环准备度摘要和 QA 收口。
- 小组矩阵新增 `exceptionClosureReadinessSummary`，包含可闭环、未就绪、待补材料、待主管判断、待数据核对、下一候选异常和阻塞原因。
- 页面在现有右侧异常详情展示“闭环准备度”，位于“本周延续关注”和“复核工作量”之间，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和闭环前置判断，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `exceptionClosureReadinessSummary` 为 `undefined` 且页面缺少闭环准备度卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，新增卡片区域显示“闭环准备度”“当前 2 项异常均未达到闭环条件，优先补齐主管判断和到岗说明。”“可闭环”“未就绪”“待补材料”“待主管判断”“下一候选”“A-1002 王敏 / 迟到 21 分钟”，且卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-24 - Team-week carryover overview

#### 结论

- `F307-F309/Q062/US402-US405` 已完成本周延续关注和 QA 收口。
- 小组矩阵新增 `teamWeekCarryoverOverview`，包含后续关注日期、缺口人数、异常人数、建议回看对象、延续原因和查看顺序。
- 页面在现有右侧异常详情展示“本周延续关注”，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `teamWeekCarryoverOverview` 为 `undefined` 且页面缺少本周延续关注卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，新增卡片区域显示“本周延续关注”“周一未闭环后，周二仍有 1 人登录缺口需要延续查看。”“周二 05/12”“第 1 天”“缺口人数”“异常人数”“建议回看：A-1002 王敏”“延续原因：周二仍有 1 人登录缺口，需回看今日到岗问题是否连续。”，且卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-24 - Group-risk cause split

#### 结论

- `F304-F306/Q061/US398-US401` 已完成小组风险原因拆分和 QA 收口。
- 小组矩阵新增 `groupRiskCauseSplit`，包含风险原因标题、总影响时长、原因占比、异常项数、涉及人数、代表异常和主管关注点。
- 页面在现有右侧异常详情展示“风险原因拆分”，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和判断口径，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `groupRiskCauseSplit` 为 `undefined` 且页面缺少风险原因拆分卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，新增卡片区域显示“风险原因拆分”“当前小组风险主要来自状态安排不一致，其次是登录到岗偏差。”“影响 5.35h”“状态安排不一致”“93%”“代表异常：A-1001 刘晨 / 午后状态缺登录切片”“主管关注：先确认培训安排是否应计入在线要求。”“登录到岗偏差”“7%”“代表异常：A-1002 王敏 / 迟到 21 分钟”“主管关注：先核对到岗说明和原始登录开始时间。”，且卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-24 - Next-day watchlist

#### 结论

- `F301-F303/Q060/US394-US397` 已完成次日关注清单和 QA 收口。
- 异常队列项新增 `nextDayWatchlist`，包含次日日期、关注说明、员工、优先级、责任角色、来源异常、关注原因和查看顺序。
- 页面在现有右侧异常详情展示“次日关注清单”，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看顺序，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `nextDayWatchlist` 为 `undefined` 且页面缺少次日关注清单卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，新增卡片区域显示“次日关注清单”“明天先看周二 05/12 的登录缺口和今日未闭环异常。”“A-1002”“王敏”“第 1 项”“高优先级”“责任角色”“现场主管”“来源”“今日异常：迟到 21 分钟”“今日需要升级且明天仍有 0.1h 登录缺口，先确认到岗说明是否补齐。”以及“A-1001”“刘晨”，且卡片区域未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、通知、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor follow-up timeline

#### 结论

- `F286-F288/Q055/US374-US377` 已完成主管跟进时间线和 QA 收口。
- 异常队列项新增 `followUpTimeline`，包含识别、已跟进、当前卡点和下一复核节点。
- 页面在现有右侧异常详情展示“跟进时间线”，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看口径，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `followUpTimeline` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“跟进时间线”“2026-05-11 09:22 / 系统识别”“迟到 21 分钟，影响 0.35h。”“已联系员工确认到岗时间。等待补充迟到或漏登原因。”“当前卡点”“待补说明：需补到岗说明、迟到或漏登原因。”“下一复核”和“确认王敏实际到岗时间和迟到原因。”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、通知按钮、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor exception communication context

#### 结论

- `F283-F285/Q054/US370-US373` 已完成主管异常沟通上下文和 QA 收口。
- 异常队列项新增 `communicationContext`，包含沟通对象、沟通目的、关键说明、引用证据、待确认问题和下一沟通点。
- 页面在现有右侧异常详情展示“沟通上下文”，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看口径，不代表真实通知、派单、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `communicationContext` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“沟通上下文”“沟通对象：王敏 / 现场主管”“确认王敏 09:00-09:21 登录缺口的到岗事实和迟到原因。”“引用证据：排班 SCH-1002-1：早班 09:00-17:00 / 登录 LOG-1002-1：CORN 登录 09:21-17:00”“待确认：是否实际到岗但漏登 / 迟到原因是否已说明”和“下一沟通点：2026-05-11 10:00 前和现场主管确认到岗说明。”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、通知按钮、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Team day risk digest

#### 结论

- `F280-F282/Q053/US366-US369` 已完成团队日风险摘要和 QA 收口。
- 小组矩阵模型新增 `teamDayRiskDigest`，包含风险等级、风险分、当日风险标题、主要风险、下一优先查看和风险信号。
- 页面在现有右侧异常面板展示“当日风险”，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实派单、处理记录写入、通知、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `teamDayRiskDigest` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“当日风险”“当日高风险：登录轨道与状态轨道同时存在异常，先看王敏。”“高风险 86”“主要风险”“下一优先查看”“需要升级 / 登录轨道 / 2 个待核对问题”和“交接压力”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor handoff overview

#### 结论

- `F277-F279/Q052/US362-US365` 已完成主管交接概览和 QA 收口。
- 小组矩阵模型新增 `supervisorHandoffOverview`，包含待交接项、待核对问题、建议升级、主要接收人、下一优先交接和接收人分布。
- 页面在现有右侧异常面板展示“交接概览”，不新增入口或页面。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和提醒口径，不代表真实派单、处理记录写入、通知、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `supervisorHandoffOverview` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“交接概览”“待交接 2 项，待核对问题 4 个”“建议升级 1”“主要接收人”“下一优先交接”和“现场主管：需要升级 / 2 个待核对问题 / 班前到岗核对记录”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Product semantics cleanup

#### 结论

- `F238-F240/Q039/US310-US313` 已完成产品语义清理和 QA 收口。
- 排班草稿新建/编辑页不再暴露本地 MVP、任务编号、后端说明、后续扩展或不做人员级排班等过程词。
- 履约日历异常面板不再把记录区写成只读处理记录。
- 异常来源页不再使用示例异常或本地样例口径。
- 侧边栏不再展示新/P1 等项目管理标签。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只清理可见产品语义，不代表真实上传、审批、导出、批量、数据库、权限或真实接口已经实现。
- 后续新增页面或字段时仍需通过产品 UI 文案审计，避免 `deferredActions` 等内部边界字段被直接渲染到产品界面。

#### 验证

- 红灯验证：新增产品 UI 文案和导航回归后，能抓到 `本地 MVP`、`F007`、`只读处理记录`、`不做人员级排班`、`示例异常` 和侧边栏 `新/P1` 标签。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，6 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- Browser smoke：`/schedule-plans/new`、`/schedule-plans/plan-20260512-shanghai-bosch-draft/edit`、`/person-timeline?...&queue=high`、`/anomaly-review/sources` 均未命中本地、后端、本地 MVP、F007、后续再扩展、只读处理记录、不做人员级排班、示例异常或 P1。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-22 - Supervisor follow-up summary readonly slice

#### 结论

- `F235-F237/Q038/US306-US309` 已完成主管跟进汇总只读视图和 QA 收口。
- 履约日历小组单日异常队列当前项现在展示跟进状态、跟进缺口和小组跟进汇总。
- 跟进状态展示跟进人、状态、下一核对时间和当前重点。
- 跟进缺口展示还缺的说明、记录和结论。
- 小组跟进汇总展示队列位置、待跟进数量、高优先数量和小组风险说明。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和只读提示，不代表真实跟进提交、审批流、权限边界、数据库写回或状态写回已经实现。
- 跟进状态和缺口清单用于主管查看和线下跟进，不代表最终生产责任判定、结算规则或自动处理策略。

#### 验证

- 红灯验证：新增 `person-timeline` 目标测试后，能抓到缺少 `supervisorFollowUp`、`followUpGaps` 和 `groupFollowUpRollup` 字段的问题。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- Browser smoke：`/person-timeline?...&queue=high` 显示跟进状态、跟进人、状态、下一核对、当前重点、跟进缺口、说明、记录、小组跟进汇总、队列位置和供应商 A 小组风险说明；页面未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、审批、批量或提交。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Data quality repair-prep readonly slice

#### 结论

- `F232-F234/Q037/US302-US305` 已完成数据质量修复前置只读视图和 QA 收口。
- 履约日历小组单日异常队列当前项现在展示数据修复前置判断、准备材料和影响范围。
- 数据修复前置判断展示是否需要数据管理员介入、优先级、介入原因和负责团队。
- 准备材料展示相关记录、核对字段和说明材料。
- 影响范围展示影响对象、影响对比和排除边界。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和只读提示，不代表真实数据修复、审批流、权限边界、数据库写回或状态写回已经实现。
- 数据管理员介入判断用于主管查看和线下交接，不代表最终生产修复策略、责任判定或结算规则。

#### 验证

- 红灯验证：新增 `person-timeline` 目标测试后，能抓到缺少 `dataQualityRepairPrep`、准备材料和影响范围字段的问题。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- Browser smoke：`/person-timeline?...&queue=high` 显示数据修复前置判断、数据管理员介入、优先级、介入原因、准备材料、相关记录、字段、说明、影响范围、影响对象和影响对比；页面未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、审批、批量或修复提交。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Supervisor exception handoff readonly closure

#### 结论

- `F229-F231/Q036/US298-US301` 已完成主管异常交接只读闭环和 QA 收口。
- 履约日历小组单日异常队列当前项现在展示处理归类、交接摘要和数据核对提示。
- 处理归类展示业务类别、归类原因、负责角色和复核重点。
- 交接摘要展示交接对象、摘要、待核对问题和下一触点。
- 数据核对提示展示相关记录、核对字段和风险提示。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和只读提示，不代表真实处理提交、审批流、权限边界、质量修复或状态写回已经实现。
- 处理归类和交接摘要用于主管查看和线下交接，不代表最终生产责任判定、结算规则或自动处理策略。

#### 验证

- 红灯验证：新增 `person-timeline` 目标测试后，能抓到缺少 `handlingOutcome`、交接摘要和数据核对提示字段的问题。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- Browser smoke：`/person-timeline?...&queue=high` 显示处理归类、到岗核对、交接摘要、数据核对提示、相关记录、核对字段和复核重点；页面未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、审批或批量。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Supervisor exception handling readonly closure

#### 结论

- `F226-F228/Q035/US294-US297` 已完成主管异常处理只读闭环和 QA 收口。
- 履约日历小组单日异常队列当前项现在展示处理建议、证据汇总和只读处理记录。
- 处理建议展示优先核对、需补信息、沟通对象和线下处理边界。
- 证据汇总按排班、登录、状态分别展示命中事件，并给出主管判断结论。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和只读记录，不代表真实处理提交、审批流、权限边界或状态写回已经实现。
- 处理建议用于主管查看和线下跟进，不代表最终生产责任判定、结算规则或自动处理策略。

#### 验证

- 红灯验证：新增 `person-timeline` 目标测试后，能抓到缺少 `handlingGuide`、三轨证据汇总和只读处理记录字段的问题。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- Browser smoke：`/person-timeline?...&queue=high` 显示处理建议、证据汇总、只读处理记录、核对排班开始时间、到岗说明、排班证据、登录证据和线下处理边界；页面未出现 PRD、Gate、Story、验收清单、待实现、暂不实现或准备状态。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Master data relationship closure

#### 结论

- `F221-F225/Q034/US287-US292` 已完成主数据关系闭环和 QA 收口。
- 主数据关系页现在按员工展示供应商、职场、项目、技能、有效期、状态、异常引用和质量问题引用。
- 异常复核和数据质量详情可反查到对应员工主数据关系。
- 班次类型页展示饭点窗口、休息窗口、计入工时和计入口径。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据，不代表主数据 CRUD、冻结解冻、真实导入修复、权限、审批或生产主数据状态流已经实现。
- 班次计入口径用于页面解释，不代表最终生产公式、结算规则或收费因子。

#### 验证

- 红灯验证：新增 master-data/shift/anomaly/data-quality 目标测试后，能抓到缺少员工绑定 helper、异常反查字段、质量问题反查目标和班次计入口径字段的问题。
- `node --test scripts/tests/master-data-relations.test.mjs scripts/tests/shift-type-catalog.test.mjs scripts/tests/anomaly-review.test.mjs scripts/tests/data-quality.test.mjs`：通过，15 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- Browser smoke：`/master-data-relations` 显示员工绑定关系、`A-1001 张三`、供应商 A、博西客服、技能、有效期、待复核、即将到期和 `A-9931`；`/anomaly-review` 显示人员绑定缺失和反查主数据关系，链接到 `/master-data-relations#employee-A-9931`；`/data-quality/DQ-202605-004` 显示查看主数据关系和同一反查链接；`/shift-types` 显示饭点窗口、休息窗口、计入工时和计入口径；上述页面未出现待实现、验收清单、Gate、Story 或 PRD。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Import quality traceability

#### 结论

- `F216-F220/Q033/US281-US286` 已完成导入质量追溯闭环和 QA 收口。
- 导入批次详情现在能下钻到相关数据质量问题，并展示来源模板、错误码、来源字段和失败行业务影响摘要。
- 数据质量详情展示来源模板、来源字段、原值、错误码、影响对象和影响链路。
- 质量分组详情按业务原因展示来源模板、追溯键、关联质量问题和影响对象。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据，不代表真实上传、失败行写库、自动修复、重导提交或生产数据治理流程已经实现。
- 影响链路用于业务解释和下钻定位，不代表最终生产责任判定、结算规则、审批或权限边界。

#### 验证

- 红灯验证：新增 import/data-quality 目标测试后，能抓到缺少 `getImportBatchQualityIssues`、来源模板字段和影响链路字段的问题。
- `node --test scripts/tests/import-batch-history.test.mjs scripts/tests/data-quality.test.mjs scripts/tests/data-quality-groups.test.mjs scripts/tests/data-quality-group-links.test.mjs`：通过，12 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- Browser smoke：`/import-batches/BATCH-20260519-001` 显示相关质量问题、`DQ-202605-004 人员绑定缺失` 和失败行业务影响；`/data-quality/DQ-202605-004` 显示主数据模板、`TPL-MASTER-DATA`、`agent_binding.employee_id`、影响对象和影响链路；`/data-quality/groups/identity-integrity` 显示业务原因追溯、人员绑定缺失、主数据模板和影响对象；上述页面未出现待实现、验收清单、Gate、Story 或 PRD。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Demand supply alignment

#### 结论

- `F211-F215/Q032/US275-US280` 已完成需求预测多维展示与预测排班对齐 QA。
- 需求计划页现在按职场、项目、0.5h 时段、技能组和等级展示预测需求。
- 预测排班对齐区展示缺口、超排、技能不匹配、预测版本、排班版本和排班人员明细下钻。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和只读对齐口径，不代表真实预测导入、生产调剂、自动排班或处理提交已经实现。
- 技能不匹配用于定位供给结构问题，不代表最终生产技能规则、等级规则、结算规则或责任判定。

#### 验证

- 红灯验证：新增 `demand-supply-alignment` 目标测试后，能抓到缺少 `buildDemandSupplyAlignment` helper 的问题。
- `node --test scripts/tests/demand-supply-alignment.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，9 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- `rg` 扫描 `app` 与 `components`：未发现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹、B005 需求或行操作。
- Browser smoke：`/demand-plans` 显示需求计划、预测维度、职场/项目/0.5h 时段/技能组/等级、热线、工单、预测排班对齐、缺口、超排、技能不匹配、预测 v1、排班 v1 和查看排班人员明细；下钻链接指向 `/schedule-plans/plan-20260511-shanghai-bosch-v1#personnel-schedule-details`；禁用词均为 0 命中。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Schedule personnel drilldown and gap QA

#### 结论

- `F209-F210-Q031/US272-US274` 已完成人员级排班下钻、缺口人员班次说明和 QA 收口。
- 人员级排班明细现在提供“查看当天履约”下钻，链接保留团队、小组和返回日期上下文。
- 排班计划详情和风险明细均展示缺口涉及人员、对应班次、计划时间、技能和可复核班次。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据，不代表生产级排班缺口归因、补班推荐、审批或调剂提交已经实现。
- “可复核班次”用于主管判断补班方向，不代表自动排班、结算规则、责任判定或生产公式。

#### 验证

- 红灯验证：新增 `personnel-schedule-details` 目标测试后，能抓到缺少 `buildScheduleGapExplanation` helper 的问题。
- `node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，13 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- `rg` 扫描 `app` 与 `components`：未发现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹、B004 明细或行操作。
- Browser smoke：`/schedule-plans/plan-20260511-shanghai-bosch-v1` 显示人员级排班明细、查看当天履约、缺口涉及人员与班次、当前已排、可复核班次、刘晨、王敏、赵一、周航和 09:30-10:00；`/schedule-risks/risk-plan-20260511-shanghai-bosch-v1-09%3A30` 显示风险明细、缺口涉及人员与班次、当前已排、可复核班次、刘晨、王敏、赵一、看履约和 09:30-10:00；两个页面的履约链接均保留 `team`、`group` 和 `returnDate` 参数，禁用词均为 0 命中。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Schedule personnel trace

#### 结论

- `F206-F208/US269-US271` 已完成排班计划人员级明细和 0.5h 时段人员追溯。
- 排班计划详情展示人员级排班明细、人员字段完整度、员工/供应商/职场/项目/技能/班次和异常业务标签。
- 排班计划详情和班次明细页都能从 0.5h 时段追溯到对应人员、供应商、班次、技能和异常标签。
- 本批没有新增页面、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据，不代表生产级人员排班导入、数据库持久化或真实登录/状态日志已经接入。
- 异常标签用于前端解释和追溯，不代表最终生产异常规则、责任判定、审批或结算口径。

#### 验证

- 红灯验证：新增 `personnel-schedule-details` 目标测试后，能抓到缺少 `buildPersonnelIntervalTrace` helper 的问题。
- `node --test scripts/tests/personnel-schedule-details.test.mjs`：通过，6 个测试通过。
- `node --test scripts/tests/product-navigation-business-only.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs scripts/tests/personnel-schedule-details.test.mjs`：通过，24 个测试通过。
- `npm run typecheck`、`npm run lint`：通过。
- `rg` 扫描 `app` 与 `components`：未发现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹、B004 明细或行操作。
- In-app browser smoke：`/schedule-plans/plan-20260511-shanghai-bosch-v1` 显示人员级排班明细、人员明细字段、完整 4/4、刘晨、供应商 A、上海职场、博西客服、热线 / L2、早班 + 午后班、状态不一致、0.5h 时段人员追溯、09:30-10:00 和王敏；`/shift-details?query=plan-20260511-shanghai-bosch-v1` 显示时段人员追溯、09:30-10:00、刘晨、王敏、赵一、供应商 B 和 0.5h 时段；上述页面禁用词均为 0 命中。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Fulfillment supervisor flow QA

#### 结论

- `Q030/US268` 已完成履约日历主管处理链路 QA。
- 团队层、小组周视图、小组成员周矩阵、单日异常队列和个人单日详情返回上下文均已验证。
- 小组风险摘要、本周待看清单、异常队列处理进度、排序依据、三轨证据、返回异常队列和原异常定位均可见。
- 产品 UI 未出现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- 本批没有修改产品代码，没有新增页面，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮 QA 覆盖的是本地前端样例数据和 URL 上下文，不代表真实登录/状态日志接入、权限、审批或处理提交能力已经实现。
- 排序依据是当前本地队列解释，不代表最终生产优先级规则、结算规则或责任判定。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，18 个测试通过。
- `rg` 扫描 `app` 与 `components`：未发现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- In-app browser smoke：`/person-timeline` 显示团队周视图；团队页显示小组风险摘要；小组页显示小组成员周矩阵和本周待看清单；单日矩阵显示待关注异常、处理进度、当前异常解释、三轨证据和排序依据；个人详情显示返回异常队列、返回上下文、队列 high 和异常 A-1002::late_login；返回链接保留 `queue=high&exception=A-1002::late_login`。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Fulfillment queue sort and return context

#### 结论

- `F204-F205/US266-US267` 已完成履约日历主管队列收尾。
- 异常队列每项和当前异常解释新增排序依据，说明优先级、影响时长和员工编号。
- 从异常队列进入个人单日详情时，详情页展示返回上下文，并保留队列筛选和异常定位。
- 返回按钮在队列上下文下显示为“返回异常队列”，回到小组矩阵后仍保留 `queue` 和 `exception` 定位参数。
- 本批没有新增页面、没有新增导航入口、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和 URL 上下文，不代表生产级处理状态、审批流或权限边界。
- 排序依据解释的是当前本地队列排序，不代表最终生产异常优先级规则或结算规则。

#### 验证

- 红灯验证：新增 `person-timeline` 目标测试后，能抓到缺少返回上下文 URL helper 的问题。
- `node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，18 个测试通过。
- `npm run lint`、`npm run typecheck`：通过。
- `rg` 扫描 `app` 与 `components`：未发现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- In-app browser smoke：小组单日异常队列显示排序依据；个人单日详情显示返回异常队列、返回上下文、队列 high、异常 A-1002::late_login；返回链接保留 `queue=high&exception=A-1002::late_login`。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Fulfillment supervisor risk evidence

#### 结论

- `F201-F203/US263-US265` 已完成履约日历主管链路增强。
- 小组周视图新增风险摘要侧栏，主管可以看到最高风险小组、最高风险日期、最高风险成员、缺口人数和异常人数。
- 小组成员周矩阵新增本周待看清单，按成员和日期展示主管优先需要看的异常与缺口。
- 异常队列新增三轨证据卡，直接展示命中的排班、登录、状态事件编号、标签和时间段。
- 本批没有新增页面、没有新增导航入口、没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和既有履约日历路由，不代表真实组织主数据、状态日志接入或生产持久化已经实现。
- 三轨证据卡用于解释异常，不代表审批、处理提交、责任判定或结算口径。

#### 验证

- 红灯验证：新增 `person-timeline` 目标测试后，能抓到缺少小组风险摘要、本周待看清单和异常三轨证据卡。
- `node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，17 个测试通过。
- `npm run lint`：通过。
- `rg` 扫描 `app` 与 `components`：未发现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- In-app browser smoke：小组周视图显示小组风险摘要、供应商 A、2026-05-11、A-1002 王敏；小组成员周矩阵显示本周待看清单、王敏周一、刘晨周一和缺口/异常说明；单日异常页显示当前异常解释、三轨证据、SCH-1002-1、LOG-1002-1 和早班 09:00-17:00。
- `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`：通过。

### 2026-05-21 - Business UI cleanup QA

#### 结论

- `Q029/US262` 已完成业务界面收口 QA。
- 经营总览已验证只展示业务指标、业务下钻入口和履约风险摘要。
- 侧边栏已验证只保留真实业务入口，没有恢复跳 `/dashboard` 的伪业务入口。
- 产品 UI 已验证未出现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- 本批没有修改产品代码，没有新增页面，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮 QA 覆盖的是本地前端展示和现有路由，不代表真实数据接入、权限边界、审批或处理流已经实现。
- 后续恢复结算、系统管理、接口集成等导航前，仍必须有对应业务故事和 Gate。

#### 验证

- `node --test scripts/tests/dashboard-business-only.test.mjs scripts/tests/product-navigation-business-only.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs`：通过，21 个测试通过。
- `rg` 全量扫描 `app` 与 `components`：未发现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- In-app browser smoke：`/dashboard` 显示计划覆盖率、查看履约日历、登录履约率、查看登录异常、供需缺口、查看异常复核、质量风险、查看数据质量、履约风险摘要、今日履约风险、本周履约风险、高风险小组和待看异常；展开履约监控和数据与集成后显示经营总览、履约日历、异常复核、接入批次、字段映射、导入模板、数据质量和主数据关系；未出现上述内部词和伪功能词。
- 待执行最终 `bash scripts/check-state.sh --strict`、`git diff --check`、`bash scripts/check.sh`。

### 2026-05-21 - Dashboard business drilldown and risk summary

#### 结论

- `F199-F200/US260-US261` 已完成经营总览业务下钻入口和履约风险摘要。
- 指标卡现在能进入履约日历、异常复核和数据质量，不再只是静态指标或回跳经营总览自身。
- 首页新增履约风险摘要，展示今日履约风险、本周履约风险、高风险小组和待看异常。
- 新增 `dashboard-business-only` 回归覆盖，防止指标下钻缺失或风险摘要被删。
- 本次没有新增页面，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地前端样例数据和既有路由，不代表真实数据源或生产处理流已经接入。
- 风险摘要是主管扫描入口，不代表正式审批、处理提交、责任判定或结算口径。

#### 验证

- 红灯验证：新增目标测试后，`dashboard-business-only` 能抓到指标无下钻和缺少履约风险摘要。
- `node --test scripts/tests/dashboard-business-only.test.mjs scripts/tests/product-navigation-business-only.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs`：通过，21 个测试通过。
- In-app browser smoke：打开 `/dashboard` 后显示计划覆盖率、查看履约日历、查看登录异常、查看异常复核、查看数据质量、履约风险摘要、今日履约风险、本周履约风险、高风险小组和待看异常；未出现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-21 - Business UI cleanup

#### 结论

- `F196-F198/US257-US259` 已完成第一批业务界面收口。
- 经营总览四个指标已收口为计划覆盖率、登录履约率、供需缺口和质量风险，不再把数据接入、批次证据、实现状态或结算口径写进首页指标。
- 侧边栏已移除所有跳 `/dashboard` 的伪业务入口，仅保留经营总览和已存在真实页面入口。
- 产品 UI 审计新增对“数据接入状态”“占位”等内部或伪功能词的回归覆盖；异常表已移除无实际业务动作的行操作列。
- 本次没有新增页面，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮是前端本地展示收口，不代表真实数据源、数据库或生产权限边界已经实现。
- 侧边栏被压缩为真实页面入口后，结算、系统管理、接口集成等能力仍未进入产品导航；后续必须有明确业务故事和 Gate 后再恢复。

#### 验证

- 红灯验证：新增目标测试后，`dashboard-business-only`、`product-navigation-business-only`、`product-ui-copy-audit` 能抓到经营总览指标不收口、侧边栏 `/dashboard` 伪入口和“占位”文案。
- `node --test scripts/tests/dashboard-business-only.test.mjs scripts/tests/product-navigation-business-only.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs`：通过，19 个测试通过。
- In-app browser smoke：打开 `/dashboard` 并展开履约监控、数据与集成后，显示经营总览、计划覆盖率、登录履约率、供需缺口、质量风险、履约日历、异常复核、接入批次和数据质量；未出现数据接入状态、PRD、Gate、Story、验收清单、待实现、暂不实现、准备状态、占位、人员时间轴、坐席状态轨迹或行操作。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-21 - H031 Large module iteration pool

#### 结论

- `H031/US293` 已完成大模块迭代池登记前的 Harness 状态修复。
- 历史已完成的 `US137-US146`、`F085-F093`、`Q020` 已从遗留 `ready` 修正为 `done`，避免 Story Runner 误拿旧任务。
- 已登记 `R245-R280`、`US257-US292`、`F196-F225`、`Q029-Q034`，共 36 个 planned 业务故事，覆盖业务 UI 收口、履约日历主管链路、人员级排班追溯、预测排班对齐、导入质量追溯和主数据关系闭环。
- 新增规划池只作为后续 Gate 候选，不写入 `docs/current/STORY_QUEUE.yaml` 或 `docs/current/ACTIVE_TASKS.yaml`，不会被当作当前执行队列。
- 本批没有修改产品代码，没有新增页面，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- planned 池不是已确认执行范围；后续仍需按每批 1-3 个强相关故事输出 Gate Plan 并确认。
- 自动审批、处理提交、权限、导出、批量和生产规则仍属于硬停条件，不在本池登记动作中实现。

#### 验证

- `bash scripts/check-state.sh --strict`：通过，current queue 和 active tasks 未保留 done history，TRACE_INDEX 不含 lifecycle state。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 frontend runtime check、state-check 回归测试、strict state check、backend runtime check、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Fulfillment calendar drilldown

#### 审计结论

- `F169/US230` 已将 `/person-timeline` 升级为履约日历入口。
- 团队第一版按 `职场 + 项目` 映射，小组第一版按供应商映射，没有新增正式组织架构管理。
- 履约日历支持团队周视图、小组周视图、小组成员单日矩阵和个人单日三轨详情。
- 下钻采用单层展示：团队层、小组层、成员矩阵层不会堆叠在同一个页面上。
- 小组成员矩阵每个成员默认展示排班、登录、状态三条横向子轨，异常可以进入个人详情解释。
- 侧边栏履约监控入口已统一为“履约日历”，不再暴露“人员时间轴”或“坐席状态轨迹”作为独立入口。
- 履约监控下不再保留跳转 `/dashboard` 的伪业务入口；CORN 状态日志未作为 `/dashboard` 占位入口展示。
- 产品 UI 继续避免暴露 PRD、Gate、验收清单、暂不实现、准备状态、数据接入状态等内部执行口径。
- 本次没有新增依赖、后端、数据库、真实外部接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 团队和小组仍是本地前端样例映射，不代表正式组织主数据或权限边界已经上线。
- 周视图指标来自现有人员时间轴样例聚合，不代表真实数据接入或生产持久化。

#### 验证

- `node --test scripts/tests/product-navigation-business-only.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs`：通过，13 个测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- In-app browser smoke：`/person-timeline` 显示履约日历和团队周视图；`?team=上海职场||博西客服` 显示小组周视图；`?team=上海职场||博西客服&group=上海职场||博西客服||供应商 A&date=2026-05-11` 显示小组成员单日矩阵且不暴露旧导航名；`/person-timeline/A-1001?date=2026-05-11&team=...&group=...` 显示个人单日三轨详情和返回小组矩阵。

### 2026-05-18 - H029 生产雏形大 PRD 整理审计

#### 审计结论

- 已新增 `docs/production-mvp-prd.md`，作为从本地演示版升级到生产雏形的产品需求定义。
- 文档明确生产雏形第一阶段覆盖主数据导入、人员级排班、0.5h 时段汇总、需求预测、登录日志、状态日志、差异对比、异常识别和复核闭环。
- 文档将数据库、权限、审批、导出、批量、真实集成、生产公式、结算规则和收费因子标注为后续生产化能力，不作为本轮实现范围。
- 本轮未修改 `docs/current/**`，未拆 raw requirements 或 user stories，未修改前端、后端、依赖、package/lockfile、数据库或真实集成文件。

#### 风险

- 该 PRD 是规划文档，不是执行队列；后续开发前仍必须按 Harness 流程拆 raw requirements、user stories、Gate Plan 和 active tasks。
- 文档中描述的数据库、权限、审批、导出、批量和生产规则不能被理解为已授权实现。

#### 验证

- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `bash scripts/check.sh`：通过。首次受限网络环境下 Next build 无法访问 `fonts.googleapis.com`，授权网络后完整检查通过；过程中清理了 Git 忽略的 `.next` 生成缓存，移除跨分支残留类型。

### 2026-05-18 - H030 生产雏形第一批需求安排审计

#### 审计结论

- 已将 `docs/production-mvp-prd.md` 拆出 `R091-R096` 和 `US103-US108`。
- 已将 `US104/B006`、`US105/B007`、`US106/B008` 放入 current ready queue 和 active task contract。
- 第一批执行顺序为：主数据导入合同、人员级排班合同与 0.5h 展开、预测/排班/登录状态对比合同。
- 本轮只安排需求和 current 状态，不修改前端、后端、依赖、package/lockfile、数据库、真实集成、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- B006-B008 后续虽然允许本地 backend-mvp 合同或 seed/process-memory 工作，但不得进入数据库持久化、真实外部导入、权限、审批、导出、批量或生产公式。
- 如果实现过程中发现需要 package/lockfile、真实 Excel/CORN/HR/WFM 集成或生产 schema，必须停下来重新 Gate。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过。

### 2026-05-18 - B006 主数据导入合同审计

#### 审计结论

- 已新增本地只读 `/api/v1/master-data/import-contract` 合同端点。
- 合同覆盖 `agent`、`workplace`、`supplier`、`project`、`agent_binding` 和 `shift_type` 六类主数据。
- 合同明确每类实体的字段、主键、必填字段、外键和校验规则，并提供批次字段、失败行字段和数据质量错误码。
- 本轮只做本地合同能力，不做真实文件上传、真实外部导入、数据库持久化、ORM、迁移、权限、审批、导出、批量或生产公式。

#### 风险

- 该端点是生产雏形本地合同，不代表真实导入处理器或生产数据库 schema 已实现。
- 后续如果要处理真实 Excel/CORN/HR/WFM 数据，需要单独 Gate。

#### 验证

- `python -m unittest ...test_master_data_import_contract...`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `python -m unittest discover -s backend/tests -v`：通过，21 个后端测试通过。
- `bash scripts/check.sh`：通过。

### 2026-05-18 - B007 人员级排班合同与时段展开审计

#### 审计结论

- 已新增本地只读 `/api/v1/personnel-schedules/import-contract` 合同端点。
- 合同覆盖人员级排班字段、主键、必填字段、生成字段和校验规则。
- 合同明确人员级排班到 0.5h `interval_schedule` 的展开规则：30 分钟粒度、group_by 维度、目标字段和追溯字段。
- 本轮只做本地合同能力，不做真实排班导入、自动排班、数据库持久化、ORM、迁移、权限、审批、导出、批量或生产公式。

#### 风险

- 该端点是生产雏形本地合同，不代表真实排班导入处理器或可编辑人员排班界面已实现。
- 跨天、休息/饭点和业务日规则已进入合同口径，但实际计算仍需后续单独实现和测试。

#### 验证

- `python -m unittest ...test_personnel_schedule_import_contract...`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `python -m unittest discover -s backend/tests -v`：通过，23 个后端测试通过。
- `bash scripts/check.sh`：通过。

### 2026-05-18 - B008 预测排班登录状态对比合同审计

#### 审计结论

- 已新增本地只读 `/api/v1/fulfillment-comparison/contract` 合同端点。
- 合同覆盖 `demand_forecast`、`personnel_schedule`、`login_log`、`status_log` 四类来源。
- 合同明确时段级对齐键、人员级键、状态字典字段、异常规则和复核字段。
- 异常规则覆盖预测缺口、超排、未登录、迟到、早退、未排班登录和非有效产能。
- 本轮只做本地合同能力，不做真实对比计算、数据库持久化、ORM、迁移、权限、审批、导出、批量或生产公式。

#### 风险

- 该端点是生产雏形本地合同，不代表真实预测导入、登录/状态导入或异常计算器已实现。
- 状态字典和异常条件已经具备产品口径，但阈值配置、业务日切分和真实计算仍需后续单独实现。

#### 验证

- `python -m unittest ...test_fulfillment_comparison_contract...`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `python -m unittest discover -s backend/tests -v`：通过，25 个后端测试通过。
- `bash scripts/check.sh`：通过。

### 2026-05-18 - F061-F063/Q016 生产雏形合同演示入口安排审计

#### 审计结论

- 已新增 `R097-R100` 和 `US109-US112`，并将 F061-F063/Q016 放入 current ready queue。
- 本批范围是前端本地合同客户端、生产雏形合同页、侧边栏入口和 QA 收口。
- 本批不允许真实外部数据、数据库、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证

- 待最终验证：`bash scripts/check-state.sh --strict`。
- 待最终验证：`git diff --check`。
- 待最终验证：`bash scripts/check.sh`。

### 2026-05-12 - F018 风险提示表局部 table parity 迁移审计

#### 审计结论

- `US038/F018` 已新增 `components/schedule-risk-table.tsx`，将排班计划页风险提示表抽成局部 TanStack Table 组件。
- 表格保留风险等级、日期、时段、项目、职场、缺口、不可用、原因、建议和“明细/班次”动作。
- 当前仅启用列和排序管理，保持展示层增强，不启用批量选择、拖拽排序、审批、导出、批量调班或生产动作。
- 本轮未新增依赖、未修改 package/lockfile、未改后端、未接入真实数据、未加入数据库、认证、权限、生产公式、状态码、结算规则或收费因子。

#### 风险

- TanStack Table 会触发 React Compiler 对该 hook 的 incompatible-library 识别；组件内已对 `useReactTable` 加局部 eslint 说明，避免影响全局规则。
- 后续如果继续迁移主业务表，需要先明确是否允许批量选择、列配置、行拖拽或 Drawer 行详情，不能默认开启生产动作。

#### 建议

- 下一步 table parity 可以继续迁移排班计划表或不可用表，但仍应限制在展示交互，不触碰批量调班、审批、导出或生产状态流。

### 2026-05-12 - F017 不可用影响定位审计

#### 审计结论

- `US037/F017` 已新增前端不可用影响定位：不可用管理表格行提供“影响”入口，进入 `/unavailability/[unavailabilityId]`。
- 影响定位页展示人员、团队、项目、职场、日期、不可用时段、原因、状态、影响班次、关联风险和排班缺口汇总。
- 页面复用现有 `unavailability`、`shift-details` 和 `schedule-risks` 本地 MVP 契约，不新增后端接口。
- 本轮未新增依赖、未修改 package/lockfile、未接入真实数据、未加入数据库、认证、权限、审批、导出、批量调班、自动排班、生产公式、状态码、结算规则或收费因子。

#### 风险

- 当前影响定位基于本地 MVP 的时间重叠和职场/项目匹配，不代表生产员工级排班冲突算法。
- 未来接真实人事或 CORN 数据后，需要重新确认人员 ID、团队归属、权限边界和状态流转。

#### 建议

- 下一步再进入 table parity 局部迁移时，应只做展示层增强，不启用批量选择、批量调班或审批类动作。

### 2026-05-12 - F016 风险明细钻取入口审计

#### 审计结论

- `US036/F016` 已新增前端风险明细钻取：排班计划页风险提示行提供“明细”入口，进入 `/schedule-risks/[riskId]`。
- 风险明细展示风险等级、计划、日期、时段、项目、职场、缺口、不可用影响、原因和建议。
- 页面复用现有 `schedule-risks`、`shift-details` 和 `unavailability` 本地 MVP 契约，展示关联班次与同职场、同日期、同项目、同一风险时段重叠的生效中不可用记录。
- 本轮未新增依赖、未修改 package/lockfile、未改后端、未接入真实数据、未加入数据库、认证、权限、审批、导出、批量调班、自动排班、生产公式、状态码、结算规则或收费因子。

#### 风险

- 风险明细仍是本地展示与人工复核入口，不代表生产风控计算或自动处置。
- 不可用记录匹配使用 MVP 时段重叠和现有查询契约，未来接真实数据后需要重新确认员工级匹配、权限和生产状态流。

#### 建议

- 下一步可进入不可用影响定位，让不可用管理侧也能反查风险和班次影响。

### 2026-05-12 - H016 Harness Gate 体系审计反馈修复

#### 审计结论

- 已确认审计反馈成立：`docs/quality/GATE_REGISTRY.md` 只有默认 Gate 和 Clean Harness Gate，但 backlog 已使用多个 `required_workflow`。
- 已在 Gate Registry 增加 Workflow Gate Matrix，覆盖 `harness`、`frontend-scaffold`、`frontend-audit`、`backend`、`backend-mvp`、`backend-vertical` 和 `qa`。
- 已将 `AGENTS.md` 的 Current stage 对齐为 `frontend dashboard scaffold + local scheduling-plan MVP vertical`。
- 已将旧 clean-Harness 结论改写为历史审计快照，避免与当前项目状态并列。
- 已预置 `US036/F016` 为 `ready` 状态，作为 Story Runner 下一轮开发入口。

#### 风险

- `US036/F016` 只是 ready 队列入口，本轮未实现风险明细钻取。
- 后续执行 `F016` 时仍需遵守 stop conditions：不得新增依赖、真实数据、数据库、认证、权限、审批、导出、批量调班、自动排班、生产公式、状态码、结算规则或收费因子。

#### 建议

- 后续新增 `required_workflow` 名称时，必须同步更新 Gate Registry。
- 下一轮若 PM 说“继续”，默认从 `US036/F016` 开始，但遇到 stop conditions 仍需暂停确认。

### 2026-05-12 - F015 shadcn 依赖与组件接入收口审计

#### 审计结论

- `R021/US034/F015` 已将 PM 确认的 shadcn dashboard parity 依赖、package-lock 变更、新增 UI 组件和 `hooks/use-mobile.ts` 纳入受控范围。
- `hooks/use-mobile.ts` 的失败根因是生成版 hook 在 `useEffect` 内同步 `setState`，触发 `react-hooks/set-state-in-effect`；已改为 `useSyncExternalStore` 订阅 media query。
- 已核对 `Button`、`Input`、`Separator` 当前使用面，浏览器冒烟覆盖 dashboard、排班计划搜索、新建草稿表单和编辑草稿表单。
- 本轮没有新增业务页面、后端能力、真实数据、数据库、认证、权限、审批、导出、批量操作、生产公式、状态码、结算规则或收费因子。

#### 风险

- TanStack Table、DnD、Drawer、Tabler icons 等依赖本轮只完成接入收口，尚未迁移业务表格或完整复刻官方 table 交互。
- 后续如果要启用拖拽排序、Drawer 行详情、批量选择或表格列配置，需要独立用户故事和 Gate，避免把 UI 能力误升级为生产业务动作。

#### 建议

- 下一步可在稳定依赖基线上继续做业务链路，优先选择风险明细钻取或不可用影响定位；完整 table parity 应继续避免触碰审批、批量、生产状态码或公式。

### 2026-05-12 - H015 绿色检查后自动本地提交规则审计

#### 审计结论

- 已将 PM 确认的交付规则写入 `AGENTS.md`：每个完成且通过 `bash scripts/check.sh` 的任务自动本地 commit。
- 已明确 push 仍由 PM 控制：阶段、模块块或连续开发块完成后，Codex 需要询问是否推送远端。
- 已同步 `docs/PROJECT_STATE.md`、`docs/harness/lightweight-harness.md` 和 `docs/quality/DONE_REPORT_TEMPLATE.md`，避免 Done Report 继续停留在“建议 commit”的旧口径。
- 本次只改变 Harness 流程文档和追踪文件，不修改业务代码、前端、后端、依赖、package 或 lockfile。

#### 风险

- 自动本地提交要求 Codex 在每次提交前只 stage 当前任务范围，避免混入用户或其他任务的无关改动。
- 如果工作区出现无法安全分离的无关改动，应暂停并说明原因，而不是强行提交。

#### 建议

- 后续 Done Report 应报告已创建的本地 commit message，并在阶段完成时明确询问 PM 是否 push。

### 2026-05-11 - H012 Harness 文档一致性快速修复审计

#### 审计结论

- 已将 `docs/harness/lightweight-harness.md` 的当前阶段从旧的 clean/static Harness 描述更新为 frontend dashboard scaffold + local scheduling-plan MVP vertical。
- 已明确 B001/B002/F005/F006/F007/Q001/Q002 是已确认的本地纵切范围，同时继续阻止数据库、认证、权限、真实 Excel、真实 CORN、审批、导出、批量、生产公式和收费因子。
- 已将 `AGENTS.md` 中 Subagent 模板授权文案改为：模板本身不授权自动执行；Story Runner Mode 内按 Story Runner 规则允许 bounded subagents；Story Runner 外需要 PM/user 明确授权。
- 已将早期“未跟踪工程文件 / package.json 导致 check 失败”的旧风险标记为历史结论，避免继续误导后续 Gate。

#### 风险

- DAG、Skill 输入输出校验、回滚策略仍以文档规则为主，尚未升级为可执行脚本。

#### 建议

- 后续若要把 DAG 循环依赖检测或 Skill I/O 校验自动化，应新开独立 Harness 工具任务。

### 2026-05-11 - H010 Story Runner 连续用户故事交付流程审计

#### 审计结论

- 已新增 `R014` 和 `US021`，将 PM 的 Harness 优化反馈纳入需求与用户故事追溯。
- 已在 `AGENTS.md` 新增 Story Runner Mode，明确 goal -> minimal user stories -> Story Execution Queue -> implementation -> verification -> commit -> next story。
- 已更新 `docs/harness/lightweight-harness.md`，将 Harness 主流程从小 Gate 切换为 story-first continuous delivery。
- 已更新 `docs/prompts/README.md`，允许 Story Runner Mode 下默认启动 bounded subagents，前提是写入范围独立且不重叠。
- 已将已完成的用户故事状态与 backlog、task-log、audit 当前记录对齐。

#### 风险

- Story Runner 会减少中途确认，因此必须严格依赖清晰的 user story、stop conditions、write scope 和 `bash scripts/check.sh`。
- 若 PM 的 goal 跨越依赖、真实数据、数据库、认证、权限、审批、导出、批量或生产公式，仍必须暂停确认。
- Subagent 并行可以提升速度，但写入范围必须由主 Worker 先拆清楚，否则会产生集成冲突。

#### 建议

- 下一次正式开发应从 `docs/user-stories.md` 选择第一个 `ready` story，而不是临时创建零碎 `F00x`。
- UI 反馈应作为当前 story 的验收修正处理，除非范围变化。
- 主 Worker 可以将 Backend、Frontend、QA、Doc 分配给 subagents，但必须保留最终集成和验证责任。

### 2026-05-11 - Q002 排班计划草稿创建与更新纵切验收审计

#### 审计结论

- B002 后端草稿创建与更新已通过 unittest，覆盖 POST、PUT、非草稿 409 和路由注册。
- F006 新建草稿入口已通过 lint、typecheck、build 和本地 `/schedule-plans/new` HTTP 200 验证。
- F007 编辑草稿入口已通过 lint、typecheck、build 和本地 `/schedule-plans/plan-20260511-suzhou-bosch-v1/edit` HTTP 200 验证。
- 本地联调中 POST 创建草稿返回 `draft-20260515-001`。
- 本地联调中 PUT 更新草稿返回 `version=v2`、`gap_agents=0` 和更新后的备注。
- `bash scripts/check.sh` 已通过。

#### 风险

- 草稿创建和更新仍是本地内存能力，重启后不保留。
- 当前前端创建页只覆盖 4 个核心时段，编辑页保存整份明细，不做人员级排班或局部补丁。
- 未包含数据库、认证、权限、发布、审批、导出、批量、真实 Excel 或真实 CORN。

#### 建议

- 下一条真正有业务价值的纵切会触碰“持久化或完整编辑体验”的边界，需要先明确是继续做本地内存增强，还是进入数据库 Gate。

### 2026-05-11 - F007 前端排班计划草稿更新入口审计

#### 审计结论

- draft 计划详情页已新增“编辑草稿”入口。
- 非 draft 计划详情页不展示编辑入口。
- 已新增 `/schedule-plans/[planId]/edit` 页面，预填计划信息和 0.5h 时段。
- 已新增 Next server action，通过服务端调用 B002 `PUT /api/v1/schedule-plans/{plan_id}/draft`。
- 保存成功后会跳转回计划详情页。

#### 风险

- 当前编辑页保存整份草稿明细，不做人员级排班、拖拽排班或局部补丁更新。
- 编辑能力依赖本地 FastAPI 运行；后端不可用时会返回详情页失败状态。
- 仍无数据库持久化、认证、权限、发布、审批、导出或批量能力。

#### 建议

- 下一步进入 `Q002`，验收本地草稿创建/更新纵切。
- 完整排班编辑器、人员级排班和生产发布流必须单独 Gate。

### 2026-05-11 - F006 前端排班计划草稿创建入口审计

#### 审计结论

- 已在排班计划列表页新增“新建草稿”入口。
- 已新增 `/schedule-plans/new` 页面，包含计划日期、项目、职场、版本和 4 个核心 0.5h 时段输入。
- 已新增 Next server action，通过服务端调用 B002 `POST /api/v1/schedule-plans/drafts`。
- 创建成功后会跳转到新草稿详情页。
- 已扩展 `lib/schedule-plans.ts`，提供 draft payload 类型和 create/update client 函数。

#### 风险

- 当前页面是最小创建入口，不是完整排班编辑器；只覆盖 4 个核心时段。
- 创建能力依赖本地 FastAPI 运行；后端不可用时会返回列表页失败状态。
- 仍无数据库持久化、认证、权限、发布、审批、导出或批量能力。

#### 建议

- 下一步进入 `F007`，为 draft 详情页增加更新入口，复用 B002 PUT 接口。
- 完整时段编辑器、人员级排班、权限和发布流必须单独 Gate。

### 2026-05-11 - B002 FastAPI 排班计划草稿创建与更新审计

#### 审计结论

- 已新增 `SchedulePlanIntervalInput` 和 `SchedulePlanDraftRequest`，用于草稿创建/更新请求。
- 已新增 `POST /api/v1/schedule-plans/drafts`，创建 `draft` 状态排班计划。
- 已新增 `PUT /api/v1/schedule-plans/{plan_id}/draft`，只允许更新 `draft` 状态计划。
- 服务端会重新计算 forecast_agents、scheduled_agents、gap_agents、coverage_rate 和 updated_at。
- 已新增后端 unittest 覆盖草稿创建、草稿更新、非草稿更新 409 和路由注册。

#### 风险

- 草稿数据保存在本地进程内存中，重启后不会保留；这是 B002 的明确范围，不代表生产持久化。
- 当前没有用户、权限、审计、发布、审批、导出或批量操作能力。
- `draft`、`review_ready`、`published` 仍是 MVP 展示状态，不是生产最终状态码。

#### 建议

- 下一步进入 `F006`，在前端增加草稿创建/编辑入口，并通过现有 API client 调用 B002 接口。
- 数据库持久化、权限、发布审批和导出批量仍需单独 Gate。

### 2026-05-11 - H009 连续交付提交流程优化审计

#### 审计结论

- 已在 `AGENTS.md` 新增 Continuous Delivery Mode。
- 当 PM 明确要求“别一直停下”“通过就继续下一步”“一口气做完”或“做完测完验证完提交完”时，Codex 应在绿色验证后直接提交已完成范围。
- 该模式仍保留所有关键停止条件：新增依赖、package/lockfile、真实外部数据、数据库、认证、权限、审批、导出、批量、生产状态码/公式/结算/收费因子、破坏性 Git 操作和失败验证。
- `docs/PROJECT_STATE.md` 已记录当前连续交付提交规则。

#### 风险

- 连续提交会减少中途确认，但必须依赖清晰的 backlog scope 和 `bash scripts/check.sh` 结果。
- 若未来工作区存在用户未提交的无关改动，仍需只提交本轮范围，避免把无关文件打进同一个 commit。

#### 建议

- 后续正式开发默认采用“完成 -> 验证 -> 提交 -> 继续下一 scoped 任务”的节奏。
- 遇到停止条件时只暂停一次，并明确说明卡点和下一步选项。

### 2026-05-11 - H008 本地前后端联调启动入口审计

#### 审计结论

- 已新增 `scripts/dev.sh` 作为项目根目录的一键本地联调入口。
- 脚本会优先使用 Node.js 22，并检查 `fastapi`、`uvicorn`、`pydantic` 是否可用。
- 脚本默认设置 `BPO_API_BASE_URL=http://127.0.0.1:8000`，同时允许外部环境变量覆盖。
- 脚本会启动 FastAPI `backend.app.main:app` 和 Next.js dev server。
- `scripts/check.sh` 已加入 `bash -n scripts/dev.sh`，确保启动脚本语法进入交付检查。
- README、backend README 和 `docs/dev/setup.md` 已补充本地联调启动说明。

#### 风险

- `scripts/dev.sh` 不自动安装依赖；缺少后端依赖时会提示执行 `python3 -m pip install -r backend/requirements.txt`。
- 该脚本只服务本地开发联调，不代表生产部署脚本或进程管理方案。

#### 建议

- 后续如果要交付给非开发用户，应新增单独 Gate 处理打包、部署、环境变量模板和启动健康检查。

### 2026-05-11 - Q001 排班计划第一条纵切验收审计

#### 审计结论

- B001 后端接口已通过 `python3 -m unittest discover -s backend/tests -v`，覆盖列表、详情、404 和路由注册。
- F005 前端已通过 `npm run lint`、`npm run typecheck` 和 `bash scripts/check.sh`。
- `next build --webpack` 已生成 `/schedule-plans` 和 `/schedule-plans/[planId]` 路由。
- 本地 HTTP 验证中，`/schedule-plans` 和 `/schedule-plans/plan-20260511-shanghai-bosch-v1` 均返回 200。
- 接口契约字段已在 `backend/app/models.py`、`backend/app/seed_data.py` 和 `lib/schedule-plans.ts` 之间保持一致，包括计划摘要、状态、覆盖率、缺口数和 0.5h 时段明细。
- 新增前端文件未引入硬编码色值或任意色值，核心 UI 继续使用 shadcn theme token 与现有 dark / light 主题系统。

#### 风险

- 本次验收未引入真实浏览器截图归档；受当前本地浏览器自动化工具可用性限制，视觉验收以构建、HTML 路由、语义 token 和组件结构检查为主。
- 后端仍是本地种子数据，不代表生产数据源、权限、审批、发布、导出、批量处理、真实 Excel 或真实 CORN 已完成。

#### 建议

- 第一条只读纵切可以作为正式系统继续开发的基线。
- 下一步应新增一个只读前后端联调增强任务，处理 FastAPI 启动脚本、前端 API base 配置说明、以及本地一键启动体验。
- 编辑、发布、审批、导出、批量和真实数据接入仍需各自进入 Gate。

### 2026-05-11 - F005 排班计划列表与详情前端纵切审计

#### 审计结论

- 已新增 `/schedule-plans` 排班计划列表页。
- 已新增 `/schedule-plans/[planId]` 排班计划详情页。
- 已新增 `lib/schedule-plans.ts` 作为集中 API client，读取 B001 的排班计划列表/详情契约。
- 已新增只读列表表格、搜索、排序、状态 badge、详情跳转、摘要卡片和 0.5h 时段明细表。
- 已复用 shadcn 风格的 App shell、sidebar、header、card、table、badge、button 和 input 结构。
- 未新增依赖，未修改 package 或 lockfile，未实现新增、编辑、发布、审批、导出、批量操作、认证、数据库、真实 Excel 或真实 CORN。

#### 风险

- 本地开发在后端未启动时使用同契约 fallback 数据保证 Next 构建和页面预览稳定；这不是生产数据源。
- 计划状态和覆盖率展示仍是 MVP 纵切口径，不代表生产状态码、排班拟合度、遵守率、结算或收费公式最终确认。
- 真实浏览器像素验收受当前工具可用性限制，本次优先以 lint/typecheck/build、Harness check 和 HTTP 200 验证收口。

#### 建议

- 下一步进入 `Q001`，做第一条纵切验收记录，覆盖 B001 后端、F005 前端、接口契约和主题可读性。
- 后续若要做编辑、发布、审批、导出、批量操作或真实数据接入，必须新开 Gate。

### 2026-05-11 - B001 FastAPI 排班计划只读接口纵切审计

#### 审计结论

- 已新增最小 Python + FastAPI 后端工程到 `backend/**`。
- 已提供 `GET /api/v1/schedule-plans` 排班计划列表接口。
- 已提供 `GET /api/v1/schedule-plans/{plan_id}` 排班计划详情接口。
- 已使用本地种子数据表达排班计划摘要和 0.5h 时段明细。
- 已新增标准库 `unittest` 测试覆盖路由注册、列表字段、详情时段和 404 错误。
- `scripts/check.sh` 已扩展为同时验证前端 scaffold 和 B001 后端纵切。

#### 风险

- 当前后端使用本机已有 FastAPI/Pydantic 环境，未创建虚拟环境，也未执行依赖安装。
- 本地种子数据只服务第一条纵切验收，不代表生产数据来源。
- API 暂不包含认证、权限、数据库、审计日志、真实 Excel、真实 CORN、审批、导出或批量能力。

#### 建议

- 下一步进入 `F005`，让前端排班计划列表和详情通过 API client 读取 B001 接口。
- 在引入数据库或认证前单独开 Gate。

### 2026-05-11 - M001 正式 MVP 需求拆解与排班计划纵切审计

#### 审计结论

- 已新增正式 MVP 原始需求 `R003` 至 `R010`。
- 已新增用户故事 `US006` 至 `US016`，并追溯到对应 raw requirements。
- 第一条前后端纵切已确定为排班计划列表、排班计划详情、FastAPI 只读接口和本地种子数据。
- 已新增设计文档 `docs/superpowers/specs/2026-05-11-mvp-scheduling-vertical-design.md`。
- 已新增后续 backlog 任务 `B001`、`F005`、`Q001`，状态为 `draft`。
- 本次任务未新增业务代码、未创建后端工程、未修改 package 或 lockfile、未安装依赖。

#### 风险

- `draft`、`review_ready`、`published` 只是 MVP 展示状态，不是生产最终状态码。
- `coverage_rate = scheduled_agents / forecast_agents` 只是第一条纵切展示公式，不代表排班拟合度、排班遵守率、结算或收费规则。
- B001 会引入后端工程和可能的 Python 依赖，必须单独 Gate。

#### 建议

- 下一步先执行 B001，创建最小 FastAPI 只读接口和本地种子数据。
- B001 完成后再执行 F005，避免前端继续扩大静态 mock。
- Q001 应在 B001 和 F005 均完成后执行。

### 2026-05-11 - H007 开发环境与交付验证固化审计

#### 审计结论

- 已新增 `.nvmrc` 和 `.node-version`，项目运行时明确为 Node.js 22。
- 已新增 `docs/dev/setup.md`，说明本地安装、启动、验证命令和 H007 范围边界。
- `README.md` 已从 clean Harness 初始描述更新为 frontend dashboard scaffold 当前状态。
- `scripts/check.sh` 已支持在当前 shell 非 Node.js 22 时优先切换到 `/opt/homebrew/opt/node@22/bin`。
- 本次任务未新增依赖，未修改 `package.json` 或 lockfile，未开发业务页面，未接入后端、数据库或真实 API。

#### 风险

- 若新机器没有安装 Homebrew `node@22`，`scripts/check.sh` 会明确失败并提示安装或设置 `BPO_NODE22_BIN`。
- 若未来切换 Node.js 大版本，必须通过新的 Gate 更新 `.nvmrc`、`.node-version`、setup 文档和 check 脚本。

#### 建议

- 后续开发前统一执行 `bash scripts/check.sh`，不要绕过 Harness check。
- 新成员先阅读 `docs/dev/setup.md`，再启动本地开发。

### 2026-05-11 - H006 开发前 Harness 收口审计

#### 审计结论

- `AGENTS.md` 与 `docs/PROJECT_STATE.md` 已对齐到 frontend dashboard scaffold 阶段。
- F001 已通过 `R001`、`R002` 和 `US001` 至 `US005` 建立需求追溯。
- 已新增 `docs/prompts/file_ownership_matrix.md`，明确 subagent 默认写入/读取范围。
- 已新增 frontend 和 reviewer dispatch 示例。
- D005 已明确 F001 的 Recharts 例外只限静态 prototype。
- `scripts/check.sh` 已增强为检查前端工具链，而不只是检查文件存在。

#### 风险

- 当前未执行依赖安装；本次验证中 `bash scripts/check.sh` 已因 `eslint`、`tsc`、`next` 缺失而失败。
- H006 不解决依赖安装或 lockfile 问题；这应进入单独 Gate。

#### 建议

- 下一步建议新增 `H007/F002 Dependency Verification Gate`，专门处理依赖安装、lockfile、lint/typecheck/build 真实通过问题。
- 在 H007/F002 完成前，不建议启动写代码 subagent。

### 2026-05-11 - shadcn Skill 接入审计

#### 审计结论

- 已确认 `/Users/mac/.codex/skills/shadcn/SKILL.md` 适用于 shadcn/ui 组件选择、组合、样式、CLI 行为、主题 token、preset 和反模式检查。
- 已将 shadcn skill 分配给 UI/UX Agent、Frontend Agent、Implementer 和 Code Quality Reviewer。
- QA Agent 仅将 shadcn skill 作为 UI 验收参考，不作为主要执行 skill。
- PM Agent、Backend Agent、Doc Agent 默认不使用 shadcn skill。

#### 风险

- shadcn skill 允许的 CLI 能力较强，若没有 Gate 约束，可能导致组件覆盖、preset 变更或 package 间接变化。

#### 建议

- 任何 `npx shadcn@latest add`、`apply`、`init`、`preset`、`--overwrite`、`--diff` 相关动作都必须单独 Gate。
- 前端实现或评审任务只要触碰 `components/**`、`components.json`、theme tokens 或 shadcn component composition，就必须引用该 skill。

### 2026-05-11 - Subagent Prompt Contract 审计

#### 审计结论

- `docs/prompts/README.md` 已定义统一 dispatch packet、返回格式、状态码、停止条件和评审链路。
- 六类角色 Agent prompt 已从松散角色说明升级为包含输入、输出、权限边界和停止条件的合同。
- 已新增 `implementer_prompt.md`、`spec_reviewer_prompt.md`、`code_quality_reviewer_prompt.md`，用于未来实现与双层评审。
- 当前任务未启动 subagent，也未开发新的业务能力、后端工程、真实 API、数据库、权限、导出或批量能力。

#### 风险

- 若未来真实启动 subagent，必须先确认写入范围互不冲突，并处理当前工作区脏状态带来的集成风险。
- F001 已允许静态前端脚手架存在；后续 subagent prompt 必须区分“已确认的 F001 静态范围”和“未授权的新业务能力”。

#### 建议

- 未来模块开发前，先完成 H004 合同要求的 dispatch packet。
- 实现类任务默认使用 Implementer -> Spec Reviewer -> Code Quality Reviewer 的评审链路。
- Subagent 只处理边界清晰、写入范围不重叠的子任务；主 Worker 负责最终集成和 Done Report。

### 2026-05-11 - 当前项目目录与 Skill 映射审计

#### 审计结论

- 当前项目目录不再是纯 clean Harness 形态；`app/`、`components/`、`hooks/`、`lib/`、`public/`、`package.json`、`tsconfig.json`、`next.config.mjs`、`eslint.config.mjs`、`postcss.config.mjs`、`components.json` 等前端工程文件已由 F001/F005 等任务纳入当前工程范围。
- 早期“未跟踪工程文件”和 `docs/PROJECT_STATE.md` 中“无 active business code / frontend pages / package dependencies”的冲突结论已过期；当前真实阶段是 frontend dashboard scaffold + local scheduling-plan MVP vertical。
- `app/dashboard/data.ts` 已包含 BPO、CORN、排班、异常工时、同步状态等业务 mock 数据。
- `package.json` 已声明 Next / React / Tailwind / shadcn 相关依赖，并包含 `recharts`，这与“图表库不默认使用 Recharts”的当前规则冲突。
- 早期 `bash scripts/check.sh` 因根目录 `package.json` 失败的结论已过期；当前 Gate 关注前端 lint/typecheck/build、backend Python toolchain、backend unittest 和 Harness 文件一致性。
- `docs/prompts/` 中原先的 `user_story`、`dag_scheduler`、`code_generation`、`ui_design`、`testing` 是占位式 Skill 名称，不是当前 Codex 环境中可直接引用的 Skill。

#### 已处理

- 已将 Subagent prompt 模板中的占位式 Skill 名称替换为当前可用的 Codex skill 名称。
- 已在 `docs/harness/lightweight-harness.md` 增加 Current Skill Mapping，避免后续继续引用不存在的 Skill。

#### 历史风险（已被 H011/H012 复核更新取代）

- 早期风险曾认为当前目录存在未跟踪前端工程文件、clean Harness 规则需要重新定级、或需要另起 H004 处置。H011/H012 已确认关键前端/后端文件处于 tracked 状态，当前项目阶段已更新为 frontend dashboard scaffold + local scheduling-plan MVP vertical。
- Recharts 仍只作为 F001 静态 prototype 的 shadcn dashboard chart 例外；未来图表层替换仍需另行 Gate。

#### 当前建议

- 不需要再开旧的 H004 clean Harness 偏差处置任务。
- 后续继续以已确认的 frontend scaffold + local scheduling-plan MVP vertical 为当前基线。

#### 2026-05-11 复核更新

- `git ls-files package.json app/dashboard/page.tsx backend/app/main.py` 已确认这些关键工程文件处于 tracked 状态。
- 当前失败风险不再是 `package.json` 存在，而是 backend Python 运行时如果落到 `/usr/bin/python3` 会缺少 `fastapi` / `pydantic`。
- H011 已将 `scripts/check.sh` 和 `scripts/dev.sh` 改为显式选择可导入 backend 依赖的 Python，避免依赖调用者 PATH 的偶然状态。

### 2026-05-11 - 排班计划列表筛选审计

#### 审计结论

- `B003` 已为 `GET /api/v1/schedule-plans` 增加 `status` 和 `query` 本地筛选。
- `F008` 已在 `/schedule-plans` 增加 URL 可追踪的关键词搜索、状态切换和清空筛选。
- 筛选后的计划数量、预测人次、已排人次和覆盖率会随当前结果重新汇总。
- 未新增依赖，未修改 package 或 lockfile，未引入数据库、认证、真实 Excel、真实 CORN、审批、发布、导出或批量能力。

#### 风险

- `status` 仍为 MVP 展示状态，不代表生产最终状态流。
- `query` 为本地内存数据筛选，未来接数据库后需要重新设计索引、分页和权限边界。

### 2026-05-11 - 班次明细审计

#### 审计结论

- `B004` 已新增 `GET /api/v1/shift-details`，从本地排班计划 intervals 展平成 0.5h 明细。
- `F009` 已新增 `/shift-details`，并将侧边栏“班次明细”从占位链接改为真实页面。
- 页面支持关键词/状态筛选，展示班次数量、缺口班次、最大缺口、整体覆盖率和明细表。
- 未新增依赖，未修改 package 或 lockfile，未引入人员级排班、拖拽排班、数据库、认证、真实 Excel、真实 CORN、审批、发布、导出或批量能力。

#### 风险

- 班次明细仍基于本地内存数据；未来接数据库后需要补分页、权限和查询性能设计。
- 当前明细以计划时段为颗粒度，不包含员工级班表。

### 2026-05-11 - 需求计划审计

#### 审计结论

- `B005` 已新增 `GET /api/v1/demand-plans`，从本地 forecast 数据生成预测需求行。
- `F010` 已新增 `/demand-plans`，并将侧边栏“需求计划”从占位链接改为真实页面。
- 页面支持关键词搜索，展示需求时段、预测人次、覆盖职场、峰值需求和预测需求表。
- 未新增依赖，未修改 package 或 lockfile，未引入真实 Excel、字段映射、数据库、认证、真实 CORN、审批、发布、导出或批量能力。

#### 风险

- 需求计划仍来自本地种子数据，不代表真实预测系统导入结果。
- 未来接入 Excel 或预测系统时，需要重新定义字段映射、批次状态和数据质量校验。

### 2026-05-12 - 阶段完成后续计划规则审计

#### 审计结论

- `H013` 已将阶段完成后的后续计划输出结构固化到 `AGENTS.md`、`docs/harness/lightweight-harness.md`、`docs/quality/DONE_REPORT_TEMPLATE.md` 和 `docs/PROJECT_STATE.md`。
- 后续主 Agent 完成阶段、模块块或连续开发块时，必须说明完成内容、验证、剩余事项、推荐下阶段、推荐理由、暂不建议事项和默认下一项。
- 该规则只改变工作流程与报告格式，不新增业务能力、不新增依赖、不修改 package 或 lockfile。

#### 风险

- 如果后续报告未按该结构输出，应视为 Harness 执行偏差并在下一轮修正。

### 2026-05-12 - 不可用管理最小能力审计

#### 审计结论

- `B006/F011` 已将计划与排班模块的不可用管理推进到本地只读能力：后端接口、前端页面、侧边栏入口、测试和文档追踪均已落地。
- 能力范围保持在本地 mock / seed 数据和筛选查看，不接人事系统、真实请假审批、数据库、权限、批量导入或自动冲突算法。
- 该页面可用于下一步排班风险提示和不可用影响定位，但当前不会自动改排班，也不会形成生产状态口径。

#### 风险

- 不可用状态目前只有 `active` 和 `resolved` 两个 MVP 展示状态，生产状态流转需要后续 Gate 单独确认。
- 不可用记录与排班缺口目前是跳转查看关系，尚未做自动冲突计算或告警。

### 2026-05-12 - 排班风险提示最小能力审计

#### 审计结论

- `B007/F012` 已新增本地 MVP 排班风险提示能力：后端接口把时段缺口和生效中不可用记录合并为风险行，前端在排班计划页展示高风险数量、原因、建议和班次跳转。
- 后端测试覆盖路由注册、字段契约、高风险合并和关键词筛选。
- 该能力保持为本地展示提示，不会自动改排班、不生成审批、不做批量调班，也不固化生产风控公式。

#### 风险

- `high/medium/low` 风险等级当前只是 MVP 展示口径，生产分级、阈值和动作建议需要后续 Gate 单独确认。
- 风险提示目前基于本地 seed 数据和简单时段重叠判断，不代表真实人事、CORN 或排班系统联动结果。

### 2026-05-12 - shadcn dashboard-01 前端视觉对齐需求插入审计

#### 审计结论

- `H014` 已将 `/Users/mac/Documents/Codex/2026-05-10/computeruse-https-ui-shadcn-com/docs/design/shadcn-dashboard-01-replica-spec.md` 插入为 `R020`。
- `R020` 已拆为 `US032` 视觉差距审计和 `US033` 视觉对齐实施，避免直接从 spec 跳到 UI 大改。
- backlog 已加入 `F013` 和 `F014`，其中 `F014` 明确如果需要 Geist 字体、Tabler icons、shadcn 组件补齐或 package/lockfile 变更，必须另行 Gate。

#### 风险

- 该 spec 明确追求 1:1 时推荐 Tabler icons 和 Geist 字体，当前项目不应在未确认依赖变更前直接实施。
- 视觉对齐可能影响多个现有业务页面，建议先做差距审计和截图验收计划，再进入实现。

### 2026-05-12 - shadcn dashboard-01 视觉差距审计

#### 审计结论

- `F013/US032` 已完成，只读审计结果见 `docs/design/shadcn-dashboard-01-gap-audit.md`。
- 当前项目已有 dashboard 骨架和 shadcn 风格组件，但与 dashboard-01 measured-values 复刻仍有 P0 差距：OKLCH/sidebar token、sidebar 288px 体系、metric card 尺寸和 container query。
- P1 差距主要是 1:1 图标体系、缺失 shadcn 组件、图表 range 控件、DataTable 完整交互和 header 结构。
- 审计未改 UI、未安装依赖、未改 package 或 lockfile。

#### 风险

- 若直接实施完整 1:1，会触发依赖和锁文件风险。推荐先做无依赖视觉基线修正，再确认是否引入 Tabler、TanStack Table、DnD、Drawer、Select、Tabs、Dropdown、ToggleGroup、Chart 等。

### 2026-05-12 - shadcn dashboard-01 无依赖视觉基线对齐

#### 审计结论

- `F014/US033` 已完成无依赖视觉基线对齐，实施报告见 `docs/design/shadcn-dashboard-01-visual-alignment-report.md`。
- 本轮完成 OKLCH token、sidebar token、sidebar 288px 基线、导航行高、header 标题尺度、metric card 204px 基线、container query、指标字号、chart natural curve 和 table row density。
- 本轮未新增依赖、未修改 package 或 lockfile、未替换业务字段、接口、路由或中文文案。

#### 风险

- 完整 1:1 parity 仍需要单独确认：Tabler icons、额外 shadcn 组件、TanStack Table、DnD、Drawer、Select、Tabs、Dropdown、ToggleGroup、Chart 等。
- H012 已将本节旧风险降级为历史风险，并取消继续建议 H004 clean Harness 偏差处置。

### 2026-05-12 - 标准化分支与验证工作流审计

#### 审计结论

- `H017/US041` 已将分支、worktree、验证、提交、集成和 push 确认流程拆为短入口与 runbook 两层。
- `AGENTS.md` 保留强制原则：规则优先级、任务分支、禁止 main 开发、stop condition、Story Runner、自动本地 commit 和 PM 控制 push。
- `docs/quality/GIT_BRANCH_WORKFLOW.md` 记录命令级流程、dirty workspace、远端不可用、fast-forward 失败、worktree、scope diff、commit 失败、集成和任务取消处理。
- `docs/quality/FRONTEND_RULES.md` 承接详细前端设计与开发规则，避免 `AGENTS.md` 继续膨胀。
- `docs/quality/GATE_REGISTRY.md` 和 `docs/quality/DONE_REPORT_TEMPLATE.md` 已补充分支、scope diff、最终 check、local commit、integration 和 push decision 证据字段。
- 本轮只修改 Harness 文档、质量模板、backlog 和 traceability 记录；未修改业务实现、依赖、package/lockfile、真实数据、数据库、认证、权限、审批、导出、批量或生产口径。

#### 风险

- `local_commit_sha` 无法在同一个被提交的日志文件中预先写入最终 SHA；Done Report 必须报告实际本地 commit SHA。
- 后续若任务执行者跳过 `docs/quality/GIT_BRANCH_WORKFLOW.md`，会重新出现分支/集成证据不完整风险。

### 2026-05-12 - No Database MVP 与本地功能闭环审计

#### 审计结论

- `H018/US042` 已将 No Database MVP Mode 写入 Project State、Gate Registry、Decision Log 和追踪日志。
- 数据库连接、ORM、migration、schema 实现、生产持久化配置和真实外部数据源接入均被列为 hard stop，直到 PM 单独确认数据库 Gate。
- `F019/US043` 已在 `/schedule-plans` 增加本地 MVP 链路面板，可从需求计划、排班计划、风险明细、不可用管理和班次明细之间连续复核。
- `F020/US044` 已将 `SchedulePlanTable` 迁移到 TanStack Table 管理列、行模型和排序，保留原字段与查看动作。
- `Q003/US045` 记录本轮验收：当前主线可继续在 no-database 模式下开发前端和本地契约闭环。

#### 风险

- 当前仍没有数据库环境；任何数据库设计落地、ORM、migration 或持久化配置都会导致开发节奏偏离本地 MVP 验证目标。
- 当前 TanStack Table parity 仍是局部展示层迁移，不包含官方 dashboard table 的批量选择、拖拽、列显隐、分页、导出或 Drawer 交互。
- 风险等级、状态、建议动作仍是 MVP 展示口径，不代表生产状态码、生产公式、结算规则或收费因子。

#### 当前建议

- 下一步继续在本地契约内补计划详情/班次/不可用之间的验收链路和局部 table parity。
- 暂不建议做数据库、真实数据接入、审批、导出、批量调班、权限、生产状态码、生产公式、结算规则或收费因子。

#### 验证

- `bash scripts/check.sh`：已通过，包含 frontend lint、typecheck、Next build 和 19 个后端 unittest。
- 浏览器 smoke：production server `http://localhost:3100/schedule-plans` 返回页面，确认“本地 MVP 链路”“No Database”、需求计划入口、风险明细入口和表格行渲染存在。
- dev server 备注：默认 `next dev` / Turbopack 在本机原生包签名问题下失败，webpack dev server 又遇到 `lightningcss.darwin-arm64.node` 缺失；本轮以已通过 `next build` 的 production server 做 UI smoke。

### 2026-05-12 - 开发服务器原生运行时硬化

#### 审计结论

- `H019/US039` 已将前端开发入口从裸 `next dev` 收口到 `scripts/run-next-dev.sh`。
- 新入口会优先选择 Homebrew Node.js 22，先执行 `scripts/verify-frontend-native-runtime.mjs`，再以 `next dev --webpack` 启动。
- 原生运行时回归测试已加入 `bash scripts/check.sh`，覆盖支持运行时通过、默认 Codex Node 失败可识别、以及 `npm run dev` 走受控 wrapper 三类场景。
- 本轮 `bash scripts/check.sh` 已通过，包含新的 native runtime preflight/test、前端 lint/typecheck/build 和后端 19 个 unittest。

#### 风险

- 这次修复可以消除当前项目标准入口下的同类问题，但不能阻止开发者手动绕过项目入口去直接执行裸 `next dev` 或其他自定义 Node 运行方式。
- 如果未来升级 Next.js、Tailwind、SWC、lightningcss 或 Node 主版本，仍需要重新跑 native preflight 并复核本机兼容性，而不是假定新版本天然安全。

### 2026-05-12 - Python 3.12 开发运行时固化

#### 审计结论

- `H020/US040` 已将 backend 开发运行时固定为 Python 3.12，并新增 `.python-version`。
- `scripts/verify-backend-runtime.sh` 现在负责后端解释器选择与版本/依赖验证；`scripts/check.sh` 与 `scripts/dev.sh` 都复用了同一验证入口。
- 回归测试已覆盖支持运行时通过、系统 Python 3.9 失败可识别两类场景，并已纳入 `bash scripts/check.sh`。
- 本轮验证已确认 `/Users/mac/.local/bin/python3` 3.12.13 可通过检查，而 `/usr/bin/python3` 3.9.6 会被明确拒绝。

#### 风险

- 这次修复收口了开发期版本漂移，但如果未来要支持新的 Python 主版本，必须同步更新 `.python-version`、运行时验证脚本和回归测试，而不是只改文档口径。
- 如果开发者手动绕过项目脚本、直接调用其他 Python 解释器，仍然可能脱离项目保护链。

### 2026-05-12 - 计划详情复核链路与班次明细 table parity

#### 审计结论

- `F021/US046` 已在排班计划详情页增加本地复核链路面板，展示缺口时段、关联风险、生效中不可用计数，并直达班次、风险和不可用视图。
- `F022/US047` 已将班次明细页迁移到 `ShiftDetailsTable`，由 TanStack Table 管理列、行模型和排序。
- 两项实现均复用现有本地 `schedule-plans`、`schedule-risks`、`shift-details`、`unavailability` 契约，不新增后端接口、真实数据源、数据库或依赖。
- Story Runner 下一条 ready 已预置为 `F023`：不可用记录 table parity 第三条迁移。

#### 风险

- 风险和不可用入口目前仍基于本地 query 过滤，不是新的专用聚合路由；这符合 MVP 收敛原则，但后续如果要继续压缩人工筛选成本，可能需要单独的跨页面聚合视图。
- `ShiftDetailsTable` 目前仍是 display-only parity，不包含批量选择、列显隐、分页、拖拽、Drawer 或导出交互。

### 2026-05-12 - 不可用记录 table parity 第三条迁移

#### 审计结论

- `F023/US048` 已将不可用记录页迁移到 `UnavailabilityTable`，由 TanStack Table 管理列、行模型和排序。
- 已保留原有展示字段：日期、时间、人员、团队、项目、职场、原因、状态、影响时段、备注，以及“影响/班次”动作入口。
- 本轮仅做前端展示层 parity，不新增后端接口、依赖、真实数据源、数据库、认证、权限、审批、导出、批量调班或生产口径变更。
- Story Runner 当前已无 `ready` 任务，下一条需 PM 指定或新增 backlog 条目后继续。

#### 风险

- 当前 `UnavailabilityTable` 仍是 display-only parity，不包含批量选择、拖拽、审批、导出、列显隐、Drawer 或分页交互。
- 不可用记录与风险/班次仍是页面跳转复核链路，不是生产级自动冲突处理或执行动作。

### 2026-05-12 - F021-F023 本地链路 QA 验收收口

#### 审计结论

- `Q004/US049` 已完成对 `F021-F023` 的集中验收：排班计划详情复核链路、班次明细 parity、不可用记录 parity 均在本地 no-database 边界内可验证。
- `bash scripts/check.sh` 通过，前端 lint/typecheck/build 与后端 19 个 unittest 保持全绿。
- 追溯记录已更新到 backlog、user stories、task log、project state、audit report 和 branch log。
- 已新增下一条前端 parity 目标 `R037/US050/F024`，并置为 `ready`（需求计划 table parity 第四条迁移）。

#### 风险

- 当前 QA 收口仍是本地契约与页面链路验证，不包含真实数据源、数据库、审批、导出、批量调班、权限或生产口径能力。
- 下一条 parity 目标若要扩展到分页、列显隐、批量或 Drawer 交互，需单独 Gate 以避免 scope 膨胀。

### 2026-05-12 - 需求计划 table parity 第四条迁移与单故事 QA 收口

#### 审计结论

- `F024/US050` 已将需求计划页迁移到 `DemandPlanTable`，由 TanStack Table 管理列、行模型和排序。
- 已保留原有字段：日期、时段、项目、职场、预测人数、来源、状态。
- `Q005/US051` 已完成单故事验收收口，验证上述 parity 在 no-database 模式下可验证、可追溯。
- 已新增下一条 parity 目标 `R039/US052/F025`，并置为 `ready`（排班计划详情时段表迁移）。

#### 风险

- 当前 `DemandPlanTable` 仍是 display-only parity，不包含批量选择、拖拽、审批、导出、列显隐、Drawer 或分页交互。
- 本轮收口仍基于本地契约和页面验证，不涉及数据库、真实数据源、权限、审批或生产口径能力。

### 2026-05-12 - 排班计划详情时段表 table parity 第五条迁移与单故事 QA 收口

#### 审计结论

- `F025/US052` 已将排班计划详情页 `0.5h` 时段表迁移到 `SchedulePlanIntervalTable`，由 TanStack Table 管理列、行模型和排序。
- 已保留原有字段：开始、结束、预测、已排、缺口、覆盖率、备注。
- `Q006/US053` 已完成单故事验收收口，确认上述 parity 在 no-database 模式下可验证、可追溯。
- 已新增下一条 parity 目标 `R041/US054/F026`，并置为 `ready`（风险明细受影响班次表迁移）。

#### 风险

- 当前 `SchedulePlanIntervalTable` 仍是 display-only parity，不包含批量选择、拖拽、审批、导出、列显隐、Drawer 或分页交互。
- 本轮收口仍基于本地契约和页面验证，不涉及数据库、真实数据源、权限、审批或生产口径能力。

### 2026-05-12 - 风险明细受影响班次表 table parity 第六条迁移与单故事 QA 收口

#### 审计结论

- `F026/US054` 已将风险明细页“关联班次”迁移到 `ScheduleRiskShiftTable`，由 TanStack Table 管理列、行模型和排序。
- 已保留原有字段：计划、状态、时段、预测、已排、缺口、覆盖率、备注。
- `Q007/US055` 已完成单故事验收收口，确认上述 parity 在 no-database 模式下可验证、可追溯。
- 连续开发队列已显式展开到 `F027-Q011`，下一条 ready 为风险明细不可用影响表 parity。

#### 风险

- 当前 `ScheduleRiskShiftTable` 仍是 display-only parity，不包含批量选择、拖拽、审批、导出、列显隐、Drawer 或分页交互。
- 本轮收口仍基于本地契约和页面验证，不涉及数据库、真实数据源、权限、审批或生产口径能力。

### 2026-05-12 - 详情页剩余 table parity 链与块级 QA 收口

#### 审计结论

- `F027/US056` 已将风险明细页“不可用影响”迁移到 `ScheduleRiskUnavailabilityTable`，由 TanStack Table 管理列、行模型和排序。
- `F028/US058` 已将不可用影响详情页“影响班次”迁移到 `UnavailabilityImpactShiftTable`，由 TanStack Table 管理列、行模型和排序。
- `F029/US060` 已将不可用影响详情页“关联风险”迁移到 `UnavailabilityImpactRiskTable`，由 TanStack Table 管理列、行模型和排序。
- `Q008/US057`、`Q009/US059`、`Q010/US061` 已完成各自单故事 QA 收口。
- `Q011/US062` 已完成这组详情页 parity 连续开发块的总收口：风险明细两张表与不可用影响详情两张表均已收口为独立 TanStack Table 组件。

#### 风险

- 当前四张详情页 parity 表仍全部是 display-only，不包含批量选择、拖拽、审批、导出、列显隐、Drawer 或分页交互。
- 本轮收口仍基于本地契约和页面验证，不涉及数据库、真实数据源、权限、审批或生产口径能力。

### 2026-05-12 - Harness 状态治理 v3 第一轮

#### 审计结论

- `H022/US063` 已新增 `docs/current/PROJECT_CONTEXT.md`、`STORY_QUEUE.yaml`、`ACTIVE_TASKS.yaml` 和 `BLOCKERS.md`，作为后续默认执行状态入口。
- `docs/registry/TRACE_INDEX.yaml` 和 `DECISION_INDEX.yaml` 已建立索引层；`TRACE_INDEX.yaml` 只记录 ID、路径和关联关系，不记录 status。
- `scripts/check-state.sh` 已新增，默认 warning-only，并支持 `--repair-scope` 与 `--strict`，可检查 story/task 唯一性、ready story 与 active task 对应关系、registry 路径、archive 执行入口和 current 文件行数预算。
- `AGENTS.md`、`docs/harness/lightweight-harness.md`、`docs/quality/GATE_REGISTRY.md`、`docs/quality/DONE_REPORT_TEMPLATE.md`、`docs/quality/STATE_MANAGEMENT.md` 和 `docs/PROJECT_STATE.md` 已对齐 current/registry/archive、History-On-Demand、archive 不可执行、single-writer 和 State Repair Mode。

#### 风险

- 当前为第一轮落地，旧大文件仍作为历史来源和过渡期追溯文件存在；后续需要通过 1-2 个真实任务验证没有状态漂移。
- `check-state` 默认 warning-only，尚未接入普通任务硬阻断；需要跑稳后再升级。
- 当前 Story Runner 队列为空，下一轮产品开发前必须先显式 seed current story 和 active task。

#### 验证

- `bash scripts/check-state.sh`：通过。
- `bash scripts/check-state.sh --repair-scope`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-12 - check-state 标准验证链路接入

#### 审计结论

- `H023/US064` 已把 `bash scripts/check-state.sh` 接入标准 `bash scripts/check.sh`，当前仍为 warning-only，不会自锁普通任务。
- 新增 `scripts/tests/check-state.test.mjs`，通过临时 `BPO_STATE_ROOT` 验证状态检查脚本，不污染真实 current/registry 文件。
- 回归覆盖一致状态 strict 通过、ready story 缺 active task 在 warning-only 下只告警、同一问题在 strict 下失败、`TRACE_INDEX.yaml` 出现 lifecycle state 字段时 strict 失败。
- `scripts/check-state.sh` 已修复 YAML list item `- id:` 的解析，避免 ready story 或 active task ID 漏检。

#### 风险

- 当前仍是 warning-only 阶段；后续跑完真实任务并确认无状态漂移后，才建议在非 state-repair 任务中升级为阻断。
- 当前没有迁移大量 done 历史，也没有删除旧大文件；下一步治理应继续小步验证，不应直接做全量归档。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `node --test scripts/tests/check-state.test.mjs`：通过，4 个 state-check 回归测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 warning-only state check、state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-12 - current queue 真实任务冒烟

#### 审计结论

- `H024/US065` 已作为第一条真实 current-queue 冒烟任务执行。
- 执行前，`docs/current/STORY_QUEUE.yaml` 写入 `US065` ready story，`docs/current/ACTIVE_TASKS.yaml` 写入匹配的 `H024` active task。
- 带 current entry 的 `bash scripts/check-state.sh --strict` 已通过，证明 ready story 与 active task 能被匹配。
- 任务完成后，current queue 和 active task 已恢复为空，done 历史未累积在 current 文件中。
- `docs/registry/TRACE_INDEX.yaml` 已记录 `US065/H024/R053` 的定位关系，且不记录 lifecycle state。

#### 风险

- 这只是第一条 current queue 冒烟；还需要再跑至少一条真实产品或 QA 小任务，才能判断 current 层在业务开发中是否也无漂移。
- 当前仍未做大量历史归档；旧大文件仍作为过渡期历史来源存在。

#### 验证

- `bash scripts/check-state.sh --strict` 带 current entry：通过。
- `bash scripts/check-state.sh --strict` 完成后 empty current：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 warning-only state check、state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-12 - current done history 不变量检查

#### 审计结论

- `H025/US066` 已补强 `scripts/check-state.sh`，current story/task 文件出现 `status: done` 会被识别。
- warning-only mode 对 current done history 只告警，不会自锁普通任务。
- strict mode 对 current done story 和 current done task 均会失败。
- `scripts/tests/check-state.test.mjs` 已新增 done story/done task 场景，state-check 回归从 4 个扩展到 7 个。
- 任务完成后 current queue 和 active task 已恢复为空，done 历史仍只保留在 registry 和 legacy traceability 中。

#### 风险

- 当前标准 `bash scripts/check.sh` 仍运行 warning-only state check；strict 阻断尚未启用。
- 后续若要升级为阻断，应只在非 state-repair 任务中启用，并保留 State Repair Mode 旁路。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `node --test scripts/tests/check-state.test.mjs`：通过，7 个 state-check 回归测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 warning-only state check、7 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-12 - check-state strict 默认阻断

#### 审计结论

- `H026/US067` 已将 `bash scripts/check.sh` 的 state check 升级为 strict 默认阻断。
- 普通任务现在会在标准检查中阻断 queue/task/index 不一致、TRACE_INDEX lifecycle state、current done history 等状态漂移。
- State Repair Mode 保留显式旁路：`BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh`。
- 临时诊断保留 warning-only 显式旁路：`BPO_STATE_CHECK_MODE=warning bash scripts/check.sh`。
- 任务完成后 current queue 和 active task 已恢复为空，done 历史未累积在 current 文件中。

#### 风险

- strict 已成为默认路径；后续若状态文件不一致，普通任务会被阻断，必须进入 State Repair Mode 处理。
- 仍未做大量历史归档；旧大文件继续作为过渡期历史来源。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，默认 strict state check。
- `BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh`：通过，State Repair Mode 旁路可用。

### 2026-05-13 - TRACE_INDEX current_files 路径校验

#### 审计结论

- `H027/US068` 已补强 `scripts/check-state.sh`，会校验 `TRACE_INDEX.yaml` 中的 `current_files` 路径。
- registry path 输出已去重，避免相同 legacy/current 路径重复刷屏。
- `scripts/tests/check-state.test.mjs` 已新增 missing `TRACE_INDEX` current file path 的 strict 失败场景，state-check 回归从 7 个扩展到 8 个。
- 任务完成后 current queue 和 active task 已恢复为空，done 历史未累积在 current 文件中。

#### 风险

- 仍未做大量历史归档；旧大文件继续作为过渡期历史来源。
- 下一步若继续治理，建议进入 archive dry-run 事务，而不是直接移动历史。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `node --test scripts/tests/check-state.test.mjs`：通过，8 个 state-check 回归测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - Codex Plan 面板边界规则

#### 审计结论

- `H028/US069` 已在 `AGENTS.md` 和 `docs/quality/STATE_MANAGEMENT.md` 固化 Plan 边界。
- Codex Plan 明确不是 source of truth，只能作为当前会话的临时执行投影视图。
- 当 Codex Plan 与 Harness current/registry state 冲突时，以 Harness state 为准。
- Plan 不得作为 ready/done、归档、allowed files、stop conditions、commit SHA、验证结果或 Done Report 字段来源。
- 任务完成后 current queue 和 active task 已恢复为空，done 历史未累积在 current 文件中。

#### 风险

- 该规则依赖执行者遵守：每轮如果使用 Plan 面板，必须先从 current queue/active task 派生。
- 仍未做大量历史归档；旧大文件继续作为过渡期历史来源。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - Dashboard table parity 连续开发块

#### 审计结论

- `F030/US070` 已将 dashboard `BPO 异常明细` 从手写排序/分页迁移为 TanStack Table。
- `F031/US071` 已补齐本地列显示开关和分页大小控制；原 `列控制` 占位按钮已变为可用交互。
- `Q012/US072` 已完成本块 QA 收口，确认该表格仍只做本地展示层行为，不触发审批、导出、批量、后端写入、数据库或生产动作。
- 新增 `components/data-table-model.ts` 与 `scripts/tests/dashboard-table-model.test.mjs`，覆盖 dashboard 异常搜索字段和筛选/分页后页码夹紧。
- 任务完成后 current queue 和 active tasks 已恢复为空，done 历史未累积在 current 文件中。

#### 风险

- Playwright CLI wrapper 在本机本轮调用中卡住，已终止对应 `npm exec playwright-cli` 进程；本轮用本地 dev server + `curl` 页面响应作为轻量路由烟测，最终仍以 `bash scripts/check.sh` 为准。
- 该任务没有引入真实异常处理动作，行操作仍是占位按钮；后续若要做真实处理、审批、导出或批量，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，2 个 dashboard table model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS http://127.0.0.1:3014/dashboard`：通过，dev server 返回 dashboard 页面。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - Dashboard 10-task 连续增强块

#### 审计结论

- `F032-F034/US073-US075` 已增强 dashboard 异常明细表：本地状态/严重度筛选、筛选摘要、重置、分页范围和首页/末页。
- `F035-F037/US076-US078` 已补数据接入状态模型测试，并把数据接入状态迁移为 TanStack Table，支持本地状态筛选和摘要。
- `F038-F040/US079-US081` 已补热力图模型测试、缺口摘要、峰值缺口和可访问标签/聚焦样式。
- `Q013/US082` 已完成 10-task 连续块 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。

#### 风险

- 本轮仍只做本地 dashboard 展示层；没有引入真实同步、数据库、审批、导出、批量、权限或生产公式。
- 行操作仍保持占位性质，不能被理解为真实异常处理能力。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，6 个 dashboard model 测试通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - Table parity 20-task 连续增强块

#### 审计结论

- `F041-F046/US083-US088` 已增强排班计划表：模型测试、筛选摘要、本地查询、状态/缺口筛选、重置、分页范围、首页/末页和列显示控制。
- `F047-F052/US089-US094` 已增强风险提示表：模型测试、筛选摘要、风险等级筛选、本地搜索、重置、空态和分页控制。
- `F053-F059/US095-US101` 已增强不可用表：模型测试、筛选摘要、状态筛选、本地搜索、重置、空态、分页控制和列显示控制。
- `Q014/US102` 已完成 20-task 连续块 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。

#### 风险

- 本轮仍只做本地前端展示层 parity；没有引入真实同步、数据库、后端契约变更、审批、导出、批量、权限或生产公式。
- 表格筛选是客户端局部筛选，不替代服务端查询契约；真实数据接入和数据库仍需后续单独 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，9 个 table model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。
- `curl -fsS http://127.0.0.1:3015/schedule-plans`：通过，页面包含排班计划表和风险提示表关键文本。
- `curl -fsS http://127.0.0.1:3015/unavailability`：通过，页面包含不可用表关键文本。

### 2026-05-18 - Production MVP contract demo slice

#### 审计结论

- `F061/US109` 已新增本地生产雏形合同客户端、fallback 和摘要模型，页面展示不依赖真实外部数据。
- `F062/US110` 已新增 `/production-mvp` 页面，集中展示主数据导入、人员级排班、0.5h 时段汇总、预测/排班/登录/状态对比和延期生产能力边界。
- `F063/US111` 已在侧边栏新增生产雏形入口，并使用 `/production-mvp` exact active match。
- `Q016/US112` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。

#### 风险

- 本轮只做本地前端合同演示入口；合同数据来自本地 API 或前端 fallback，不代表真实生产数据库、真实导入、外部系统接入或自动计算能力。
- 权限、审批、导出、批量、自动排班、生产公式、结算规则和 charge factor 仍未实现，后续必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/production-mvp-contracts.test.mjs`：通过，2 个 production MVP contract model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-19 - Anomaly review read-only entry slice

#### 审计结论

- `F064/US113` 已新增本地异常复核模型、fallback、筛选和摘要测试。
- `F065/US114` 已新增 `/anomaly-review` 只读页面，展示异常总览、来源分布、待复核优先项、复核清单和暂不实现动作。
- `F066/US115` 已将侧边栏异常复核入口指向 `/anomaly-review` 并使用 exact active match。
- `Q017/US116` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实异常计算、复核提交、审批、权限、导出、批量或生产公式。

#### 风险

- 本轮只做本地只读入口；异常数据来自前端 fallback，不代表真实异常计算器、复核提交、审批流或权限边界。
- 后续如果要做真实复核动作、批量处理、导出、权限或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/anomaly-review.test.mjs`：通过，3 个 anomaly review model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- `curl -fsS http://127.0.0.1:3016/anomaly-review | rg ...`：通过，页面包含异常复核、只读演示、待复核优先项、无复核提交等关键文本，侧边栏异常复核入口高亮。

### 2026-05-19 - Import drilldown and data quality center slice

#### 审计结论

- `F067/US117` 已新增导入合同 drilldown 模型和测试，三个合同入口来自本地生产雏形合同。
- `F068-F071/US118-US121` 已新增主数据、人员级排班、履约对比三个生产雏形合同 drilldown 页面，并在 `/production-mvp` 总览页挂载入口。
- `F072-F074/US122-US124` 已新增数据质量模型、测试、`/data-quality` 中心页和 `/data-quality/[issueId]` 详情页。
- `F075/US125` 已将侧边栏数据质量入口指向 `/data-quality`，并让生产雏形和数据质量子路由保持高亮。
- `Q018/US126` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实导入、真实修复、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做本地只读入口；数据质量问题来自前端 fallback，不代表真实导入校验器、修复流、批量处理或权限边界。
- 后续如果要做真实导入、数据修复、审批、权限、导出、批量或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-drilldown.test.mjs`：通过，3 个 import drilldown model 测试通过。
- `node --experimental-strip-types --test scripts/tests/data-quality.test.mjs`：通过，3 个 data quality model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- 本地 HTTP smoke：`/production-mvp`、`/production-mvp/master-data`、`/production-mvp/personnel-schedules`、`/production-mvp/fulfillment-comparison`、`/data-quality`、`/data-quality/DQ-202605-004` 均返回 200。

### 2026-05-19 - Personnel timeline, demand forecast, and master-data relations slice

#### 审计结论

- `F076/US127` 已新增人员双时间轴本地模型和测试，覆盖人员级排班、登录、状态和异常事件汇总。
- `F077-F079/US128-US130` 已新增 `/person-timeline` 总览页、`/person-timeline/[employeeId]` 详情页和侧边栏入口。
- `F080-F082/US131-US133` 已新增需求预测合同模型、测试、`/production-mvp/demand-forecast` 页面，并在 `/production-mvp` 总览页挂载入口。
- `F083-F084/US134-US135` 已新增主数据关系模型、测试、`/master-data-relations` 页面和侧边栏入口。
- `Q019/US136` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实导入、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做本地只读入口；人员时间轴、需求预测和主数据关系来自前端本地模型，不代表真实导入校验、数据库关系、排班计算、复核提交或权限边界。
- 后续如果要做真实导入、主数据 CRUD、班次规则、审批、权限、导出、批量或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/person-timeline.test.mjs`：通过，3 个 personnel timeline model 测试通过。
- `node --experimental-strip-types --test scripts/tests/demand-forecast-contract.test.mjs`：通过，2 个 demand forecast contract model 测试通过。
- `node --experimental-strip-types --test scripts/tests/master-data-relations.test.mjs`：通过，2 个 master-data relations model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- 本地 HTTP smoke：`/person-timeline`、`/person-timeline/A-1002`、`/production-mvp/demand-forecast`、`/master-data-relations`、`/production-mvp` 均返回 200。

### 2026-05-19 - Shift type, import template, and anomaly source slice

#### 审计结论

- `F085/US137` 已新增班次类型本地模型和测试，覆盖班次代码、时长、休息/饭点、适用范围和状态。
- `F086-F087/US138-US139` 已新增 `/shift-types` 只读页面和侧边栏入口。
- `F088-F090/US140-US142` 已新增导入模板模型、测试、`/import-templates` 页面和侧边栏入口。
- `F091-F093/US143-US145` 已新增异常来源模型、测试、`/anomaly-review/sources` 总览页、`/anomaly-review/sources/[sourceId]` 详情页，并在异常复核页挂载来源入口。
- `Q020/US146` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实导入、数据库、主数据 CRUD、班次规则计算、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做本地只读入口；班次类型、导入模板和异常来源来自前端本地模型，不代表真实导入模板下载、导入校验器、数据库关系、班次规则引擎或异常计算器。
- 后续如果要做真实上传/导入、字段映射保存、主数据 CRUD、班次规则、审批、权限、导出、批量或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/shift-type-catalog.test.mjs`：通过，3 个 shift type catalog model 测试通过。
- `node --experimental-strip-types --test scripts/tests/import-template-guide.test.mjs`：通过，3 个 import template guide model 测试通过。
- `node --experimental-strip-types --test scripts/tests/anomaly-source-drilldown.test.mjs`：通过，2 个 anomaly source drilldown model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- 本地 HTTP smoke：`/shift-types`、`/import-templates`、`/anomaly-review/sources`、`/anomaly-review/sources/schedule_login`、`/anomaly-review` 均返回 200。

### 2026-05-19 - Import batch, field mapping, and review timeline slice

#### 审计结论

- `F094/US147` 已新增导入批次历史本地模型和测试，覆盖批次状态、成功/失败行、错误码、质量问题追溯和暂不实现动作。
- `F095-F096/US148-US149` 已新增 `/import-batches`、`/import-batches/[batchId]` 和侧边栏入口。
- `F097-F099/US150-US152` 已新增字段映射预览模型、测试、`/field-mapping` 页面和侧边栏入口。
- `F100-F102/US153-US155` 已新增异常复核状态时间线模型、测试、`/anomaly-review/timeline` 页面，并在异常复核页挂载时间线入口。
- `Q021/US156` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实上传/导入、字段映射保存、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做本地只读入口；导入批次、字段映射和复核时间线来自前端本地模型，不代表真实导入服务、字段转换器、状态写回、审批流或权限边界。
- 后续如果要做真实上传/导入、字段映射保存、失败行修复、审批、权限、导出、批量或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-batch-history.test.mjs`：通过，2 个 import batch history model 测试通过。
- `node --experimental-strip-types --test scripts/tests/field-mapping-preview.test.mjs`：通过，2 个 field mapping preview model 测试通过。
- `node --experimental-strip-types --test scripts/tests/review-status-timeline.test.mjs`：通过，2 个 review status timeline model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- 本地 HTTP smoke：`/import-batches`、`/import-batches/BATCH-20260519-002`、`/field-mapping`、`/anomaly-review/timeline`、`/anomaly-review` 均返回 200。

### 2026-05-19 - Data quality group and production MVP acceptance checklist slice

#### 审计结论

- `F103/US157` 已新增数据质量分组本地模型和测试，按身份与主键完整性、时间有效性、排班准备度、实际日志引用聚合同类问题。
- `F104-F106/US158-US160` 已新增 `/data-quality/groups`、`/data-quality/groups/[groupId]`，并在数据质量中心挂载分组入口。
- `F107/US161` 已把导入批次详情中的质量问题 ID 改为可钻取链接，进入 `/data-quality/[issueId]`。
- `F108-F111/US162-US165` 已新增生产雏形验收清单模型、测试、`/production-mvp/acceptance-checklist`、生产雏形总览入口和侧边栏入口。
- `Q022/US166` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实上传/导入、真实修复、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做本地只读入口；质量分组、批次钻取和验收清单来自前端本地模型，不代表真实数据质量规则引擎、导入服务、修复提交、审批流或权限边界。
- 后续如果要做真实上传/导入、失败行修复、主数据 CRUD、权限、审批、导出、批量、状态规则公式或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/data-quality-groups.test.mjs`：通过，2 个 data quality groups model 测试通过。
- `node --experimental-strip-types --test scripts/tests/production-mvp-acceptance.test.mjs`：通过，3 个 production MVP acceptance model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- Browser smoke：`/data-quality/groups`、`/data-quality/groups/time-validity`、`/import-batches/BATCH-20260519-002`、`/production-mvp/acceptance-checklist` 均能打开并显示预期主标题。

### 2026-05-19 - Quality reverse lookup and production MVP progress slice

#### 审计结论

- `F112/US167` 已新增质量问题到质量分组的反查模型和测试，覆盖 issueId 映射、覆盖率和未分组问题检查。
- `F113-F114/US168-US169` 已在 `/data-quality/[issueId]` 展示所属质量分组，并在 `/data-quality` 展示分组覆盖摘要。
- `F115-F117/US170-US172` 已扩展验收清单模型，新增单项详情页 `/production-mvp/acceptance-checklist/[itemId]`，总览可跳转到详情。
- `F118-F120/US173-US175` 已新增生产雏形总进度模型、测试、`/production-mvp/progress` 页面、生产雏形总览入口和侧边栏入口。
- `Q023/US176` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实上传/导入、真实修复、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做本地只读入口；质量分组反查、验收单项详情和总进度来自前端本地模型，不代表真实质量规则引擎、缺口管理系统、发布流程或生产进度管理。
- 后续如果要做真实缺口工单、上传导入、失败行修复、主数据 CRUD、权限、审批、导出、批量、状态规则公式或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/data-quality-group-links.test.mjs`：通过，3 个 data quality group links model 测试通过。
- `node --experimental-strip-types --test scripts/tests/production-mvp-acceptance.test.mjs`：通过，4 个 production MVP acceptance model 测试通过。
- `node --experimental-strip-types --test scripts/tests/production-mvp-progress.test.mjs`：通过，2 个 production MVP progress model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。
- Browser smoke：`/data-quality/DQ-202605-005`、`/production-mvp/acceptance-checklist/upload-import`、`/production-mvp/progress`、`/production-mvp` 均能打开并显示预期主标题。

### 2026-05-19 - Production MVP gap priority and roadmap slice

#### 审计结论

- `F121/US177` 已新增生产雏形缺口优先级本地模型和测试，覆盖 P0/P1/P2、风险、状态、验收关联和高风险缺口。
- `F122-F123/US178-US179` 已新增 `/production-mvp/gaps` 和 `/production-mvp/gaps/[gapId]`，展示缺口目的、优先级、风险、推荐批次、证据页、暂缓能力和硬边界。
- `F124/US180` 已在验收清单单项详情挂载关联生产缺口入口。
- `F125-F129/US181-US185` 已在生产雏形总进度、生产雏形总览和侧边栏挂载生产缺口入口。
- `F126-F127/US182-US183` 已新增后续批次路线图，推荐先做数据导入与主数据闭环，再做预测版本与实际日志对齐，最后进入发布、复核、导出与治理边界。
- `Q024/US186` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实缺口工单、真实上传/导入、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做路线图和只读入口；缺口优先级、推荐批次和验收关联来自前端本地模型，不代表真实缺口管理系统或生产任务已创建。
- 后续如果要做真实上传/导入、字段映射保存、主数据 CRUD、真实登录/状态接口、审批、权限、导出、批量、状态规则公式或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/production-mvp-gap-roadmap.test.mjs`：通过，3 个 production MVP gap roadmap model 测试通过。
- `npm run typecheck`：通过。
- Browser smoke：`/production-mvp/gaps`、`/production-mvp/gaps/upload-import-execution`、`/production-mvp/acceptance-checklist/upload-import`、`/production-mvp` 均能打开并显示预期主标题，未出现页面错误。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build（含 `/production-mvp/gaps` 和 `/production-mvp/gaps/[gapId]`）和 25 个后端 unittest。

### 2026-05-19 - Data foundation readiness slice

#### 审计结论

- `F130/US187` 已新增数据底座准备本地模型和测试，覆盖导入执行、字段映射、主数据维护、绑定关系冻结解冻和数据质量追溯准备步骤。
- `F131-F132/US188-US189` 已新增 `/production-mvp/data-foundation` 和 `/production-mvp/data-foundation/[stepId]`，展示输入对象、输出物、依赖、关联缺口、验收主线、证据页、暂缓能力和边界。
- `F133-F134/US190-US191` 已在上传/导入验收详情和主数据验收详情挂载相关数据底座准备步骤。
- `F135-F138/US192-US195` 已在缺口路线图、生产雏形总览、生产雏形总进度和侧边栏挂载数据底座准备入口。
- `Q025/US196` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实上传/导入、字段映射保存、主数据 CRUD、冻结解冻、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做准备视图；数据底座步骤来自前端本地模型，不代表真实上传服务、导入执行器、字段映射持久化、主数据维护或冻结解冻已经上线。
- 后续如果要做真实上传/导入、失败行修复、字段映射保存、主数据 CRUD、冻结解冻、数据库、权限、审批、导出、批量、状态规则公式或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/production-mvp-data-foundation.test.mjs`：通过，3 个 production MVP data foundation model 测试通过。
- `npm run typecheck`：通过。
- Browser smoke：`/production-mvp/data-foundation`、`/production-mvp/data-foundation/import-execution-readiness`、`/production-mvp/acceptance-checklist/upload-import`、`/production-mvp/acceptance-checklist/master-data`、`/production-mvp/gaps`、`/production-mvp` 均能打开并显示预期主标题，未出现页面错误。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build（含 `/production-mvp/data-foundation` 和 `/production-mvp/data-foundation/[stepId]`）和 25 个后端 unittest。

### 2026-05-20 - Forecast and actual alignment readiness slice

#### 审计结论

- `F139/US197` 已新增预测与实际对齐准备本地模型和测试，覆盖预测版本、登录日志、状态日志、状态码映射和对比基准准备步骤。
- `F140-F141/US198-US199` 已新增 `/production-mvp/alignment-readiness` 和 `/production-mvp/alignment-readiness/[stepId]`，展示输入对象、输出物、依赖、关联缺口、验收主线、证据页、暂缓能力和边界。
- `F142-F144/US200-US202` 已在需求预测、登录/状态、差异对比验收详情挂载相关对齐准备步骤。
- `F145-F147/US203-US205` 已在缺口路线图、生产雏形总览、总进度和侧边栏挂载预测与实际对齐准备入口。
- `Q026/US206` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实预测导入、真实登录/状态接口、状态码生产映射、数据库、审批、权限、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做准备视图；预测与实际对齐步骤来自前端本地模型，不代表真实预测导入、登录/状态系统接入、生产状态码映射或异常计算已经上线。
- 后续如果要做真实预测导入、真实登录/状态接口、状态码映射、状态规则公式、数据库、权限、审批、导出、批量或生产异常计算，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/production-mvp-alignment-readiness.test.mjs`：通过，3 个 production MVP alignment readiness model 测试通过。
- `npm run typecheck`：通过。
- Browser smoke：`/production-mvp/alignment-readiness`、`/production-mvp/alignment-readiness/forecast-version-readiness`、`/production-mvp/acceptance-checklist/demand-forecast`、`/production-mvp/acceptance-checklist/actual-status`、`/production-mvp/acceptance-checklist/comparison-anomaly`、`/production-mvp/gaps`、`/production-mvp` 均能打开并显示预期主标题，未出现页面错误。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build（含 `/production-mvp/alignment-readiness` 和 `/production-mvp/alignment-readiness/[stepId]`）和 25 个后端 unittest。

### 2026-05-20 - Anomaly triage readiness slice

#### 审计结论

- `F148/US207` 已新增异常识别与复核准备本地模型和测试，覆盖异常类型目录、来源证据、分派归因、复核工作流和关闭审计准备步骤。
- `F149-F150/US208-US209` 已新增 `/production-mvp/anomaly-triage-readiness` 和 `/production-mvp/anomaly-triage-readiness/[stepId]`，展示输入对象、输出物、触发口径、复核字段、依赖、关联缺口、验收主线、证据页、暂缓能力和边界。
- `F151-F153/US210-US212` 已在异常识别验收详情、异常复核总览和异常来源页挂载异常识别与复核准备入口。
- `F154-F156/US213-US215` 已在缺口路线图、生产雏形总览、总进度和侧边栏挂载异常识别与复核准备入口。
- `Q027/US216` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实规则引擎、真实复核提交、审批、权限、导出、批量、数据库、自动排班或生产公式。

#### 风险

- 本轮只做准备视图；异常识别与复核步骤来自前端本地模型，不代表真实异常规则引擎、复核工作流、审批权限或审计导出已经上线。
- 后续如果要做真实异常计算、真实复核提交、审批、权限、导出、批量、数据库、状态规则公式、结算规则或 charge factor，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/production-mvp-anomaly-triage-readiness.test.mjs`：通过，3 个 production MVP anomaly triage readiness model 测试通过。
- `npm run typecheck`：通过。
- Local HTTP smoke：`/production-mvp/anomaly-triage-readiness`、`/production-mvp/anomaly-triage-readiness/anomaly-taxonomy-readiness`、`/production-mvp/acceptance-checklist/comparison-anomaly`、`/anomaly-review`、`/anomaly-review/sources`、`/production-mvp/gaps`、`/production-mvp`、`/production-mvp/progress` 均返回 200 并显示预期文案，未出现页面错误。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build（含 `/production-mvp/anomaly-triage-readiness` 和 `/production-mvp/anomaly-triage-readiness/[stepId]`）和 25 个后端 unittest。

### 2026-05-20 - Governance readiness slice

#### 审计结论

- `F157/US217` 已新增发布冻结与权限审计边界准备本地模型和测试，覆盖排班发布态、冻结解冻、权限边界、审计留痕、导出批量暂缓准备步骤。
- `F158-F159/US218-US219` 已新增 `/production-mvp/governance-readiness` 和 `/production-mvp/governance-readiness/[stepId]`，展示输入对象、输出物、触发条件、控制字段、依赖、关联缺口、验收主线、证据页、暂缓能力和边界。
- `F160-F162/US220-US222` 已在排班发布审批缺口、权限审计缺口、人员排班验收和主数据验收详情挂载治理边界准备入口。
- `F163-F165/US223-US225` 已在缺口路线图、生产雏形总览、总进度和侧边栏挂载治理边界准备入口。
- `Q028/US226` 已完成 QA 收口，current queue 和 active tasks 已恢复为空，不保留 done 历史。
- 本批只允许本地前端展示层和模型测试，不实现真实发布、审批、权限、审计写入、导出、批量、数据库、自动排班或生产公式。

#### 风险

- 本轮只做准备视图；治理步骤来自前端本地模型，不代表真实发布流、审批流、权限体系、审计写入、导出或批量能力已经上线。
- 后续如果要做真实发布、审批、权限、审计写入、导出、批量、数据库、状态规则公式、结算规则或 charge factor，必须另开 Gate。

#### 验证

- `node --experimental-strip-types --test scripts/tests/production-mvp-governance-readiness.test.mjs`：通过，3 个 production MVP governance readiness model 测试通过。
- `npm run typecheck`：通过。
- Local HTTP smoke：`/production-mvp/governance-readiness`、`/production-mvp/governance-readiness/schedule-release-state-readiness`、`/production-mvp/gaps/schedule-publish-approval`、`/production-mvp/gaps/permission-audit-boundary`、`/production-mvp/acceptance-checklist/personnel-schedule`、`/production-mvp/acceptance-checklist/master-data`、`/production-mvp/gaps`、`/production-mvp`、`/production-mvp/progress` 均返回 200 并显示预期文案，未出现页面错误。
- `bash scripts/check.sh`：通过，包含 strict state check、8 个 state-check 回归测试、frontend lint、typecheck、Next build（含 `/production-mvp/governance-readiness` 和 `/production-mvp/governance-readiness/[stepId]`）和 25 个后端 unittest。

### 2026-05-20 - Product UI business-only regression fix

#### 审计结论

- `F166/US227` 已修复产品语义回归：`/dashboard` 不再 import 或渲染 `DataSyncStatus`。
- `/dashboard` 已移除“数据接入状态”面板和“数据版本”筛选，保留经营指标卡、趋势、热力图和异常表。
- 侧边栏已移除生产雏形、总进度、生产缺口、数据底座准备、预测实际对齐、异常识别准备、治理边界准备和验收清单等内部记录入口。
- 已删除 `/production-mvp/**` 内部规划页面路由；导入 drilldown、异常页等入口改回真实业务页面。
- 新增 `scripts/tests/dashboard-business-only.test.mjs`，防止经营总览再次出现数据接入证据面板。
- 新增 `scripts/tests/product-navigation-business-only.test.mjs`，防止产品导航再次暴露内部规划页面。
- 本次没有删除 `components/data-sync-status.tsx`，没有改 `/demo-imports`，没有实现真实数据接入、数据库、权限、审批、导出或批量。

#### 风险

- 这是产品界面语义修复，不代表数据接入专门页面、导入批次、字段映射、数据质量等业务页被删除。
- 后续若要重构数据接入中心、侧边栏数据源入口或真实接入流程，必须另开 Gate。

#### 验证

- `node --test scripts/tests/dashboard-business-only.test.mjs`：通过，1 个 dashboard business-only 回归测试通过。
- `node --test scripts/tests/product-navigation-business-only.test.mjs scripts/tests/import-drilldown.test.mjs`：通过，产品导航和业务链接回归测试通过。
- Local HTTP smoke：`/dashboard` 不包含“数据接入状态”、`DataSyncStatus`、“数据版本”、生产雏形、总进度、生产缺口、数据底座准备、预测实际对齐、异常识别准备、治理边界准备或验收清单；`/production-mvp` 返回 404。
- In-app browser smoke：已切到 `http://127.0.0.1:3020/dashboard`，可见页面不再暴露上述内部入口。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`：通过，Next route list 已不包含 `/production-mvp/**`。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build（路由列表不包含 `/production-mvp/**`）和 25 个后端 unittest。

### 2026-05-20 - Product UI copy and person timeline fix

#### 审计结论

- `F167/US228` 已完成全量产品页面文案审计，`app/**` 和 `components/**` 不再暴露暂不实现、待开发动作、本地只读、只读演示、无真实、PRD、验收、Gate、No Database 等内部执行口径。
- 已清理异常复核、异常来源、复核时间线、数据质量、质量分组、质量问题详情、导入批次详情、排班计划详情、风险详情、不可用详情和复核链路组件中的内部记录式文案。
- 人员时间轴列表已改为人员日历入口；人员详情页已改为某员工某天的排班、登录、状态三条横向甘特式轨道。
- 本次没有新增页面，没有改 `/production-mvp/**`，没有新增依赖、后端、数据库、真实外部数据接入、权限、审批、导出、批量或生产公式。

#### 风险

- 这次是产品语义和信息架构修复，不代表真实登录系统、状态系统、复核提交流程或生产异常规则已经上线。
- 后续新增页面必须先确认 UI 方案或由 PM 提供设计稿，再进入用户故事和 Gate。

#### 验证

- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs`：通过，6 个测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：`/dashboard`、`/anomaly-review`、`/person-timeline`、`/person-timeline/A-1001?date=2026-05-11` 均加载成功，未出现内部执行口径；人员详情页包含排班轨道、登录轨道和状态轨道。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Personnel schedule detail closure

#### 审计结论

- `F168/US229` 已在现有排班计划详情页挂载人员级排班明细。
- 新增本地模型 `lib/personnel-schedule-details.ts`，支持按计划查询人员明细、按 0.5h 时段反查人员、汇总人员/工时/异常/覆盖时段，并生成个人当天时间轴链接。
- 新增 `components/personnel-schedule-detail-table.tsx`，展示员工、供应商、职场、班次、计划时间、技能等级、0.5h 展开和异常标记。
- `/schedule-plans/plan-20260511-shanghai-bosch-v1` 可以从人员明细进入 `/person-timeline/A-1001?date=2026-05-11`。
- 本次没有新增页面，没有新增依赖，没有改后端、数据库、真实导入、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍是本地前端模型，不代表真实排班导入、真实排班生成或生产数据库持久化已经上线。
- 人员明细目前只覆盖已登记的本地样例计划；后续若要支持真实上传/导入或编辑保存，需要单独 Gate。

#### 验证

- `node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/product-ui-copy-audit.test.mjs`：通过，5 个测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：`/schedule-plans/plan-20260511-shanghai-bosch-v1` 显示人员级排班明细、刘晨、`09:00-09:30` 时段；点击个人时间轴进入 `/person-timeline/A-1001?date=2026-05-11` 并显示排班、登录、状态三条轨道。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Personal week calendar layer

#### 审计结论

- `F170/US231` 已在履约日历中增加个人周日历层。
- 小组成员矩阵点击员工姓名进入 `/person-timeline/[employeeId]` 的个人周日历，不再直接跳到某一天详情。
- 个人周日历展示一周七天、每日排班工时、登录工时、缺口工时和异常数量。
- 个人周日历点击某天进入个人单日三轨详情；小组矩阵中的异常标记仍可直达对应日期详情。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地样例数据和前端聚合，不代表真实登录/状态系统、正式组织层级或生产数据库已经上线。
- 后续如果要做真实周历筛选、跨周切换、权限隔离或真实状态日志接入，必须另开 Gate。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，9 个履约日历和个人时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：小组成员矩阵点击员工姓名进入个人周日历；个人周日历显示“个人履约日历”“个人周日历”和“缺口工时”；点击日期进入个人单日三轨详情并显示排班轨道、登录轨道、状态轨道；异常链接仍直达 `date=2026-05-11` 单日详情。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Group member week matrix

#### 审计结论

- `F171/US232` 已在履约日历中增加小组成员周矩阵。
- `/person-timeline?team=...&group=...` 展示小组成员周矩阵，按成员和周一至周日展示排班工时、登录工时、缺口工时和异常数量。
- `/person-timeline?team=...&group=...&date=...` 继续展示小组成员单日矩阵，没有破坏原有单日三轨下钻。
- 小组成员周矩阵中，员工姓名进入个人周日历，日期格进入个人单日三轨详情。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地样例数据和前端聚合，不代表真实班组组织、真实登录状态系统或生产数据库已经上线。
- 后续如果要做跨周切换、小组筛选、正式班组主数据或权限隔离，必须另开 Gate。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：`team+group` 显示“小组成员周矩阵”；`team+group+date` 仍显示“小组成员单日矩阵”；日期格进入个人单日三轨详情并显示排班轨道、登录轨道、状态轨道。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Group member week matrix closeout

#### 审计结论

- `F172-F174/US233-US235` 已收口小组成员周矩阵的来源返回、日期入口和业务摘要。
- 从小组成员周矩阵进入个人周日历时，返回按钮回到小组成员周矩阵。
- 从小组成员单日矩阵进入个人周日历时，返回按钮回到对应日期的小组成员单日矩阵。
- 小组成员周矩阵表头日期可进入该小组当天单日矩阵。
- 小组成员周矩阵展示成员数、计划人天、登录人天、缺口工时和异常数，并保持缺口/异常风险优先排序。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地样例数据和前端聚合；小组摘要不代表真实生产口径、正式状态码或结算口径。
- 后续若要做跨周切换、真实组织层级、权限隔离或生产级状态映射，必须另开 Gate。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：小组成员周矩阵显示成员 2 人、计划 4 人天、缺口 1.0h；日期表头进入 `date=2026-05-11` 单日矩阵；个人周日历从周矩阵进入时返回无 `date` 的周矩阵，从单日来源进入时返回带 `date=2026-05-11` 的单日矩阵。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Fulfillment risk focus

#### 审计结论

- `F175-F177/US236-US238` 已增强小组成员周矩阵的风险聚焦能力。
- 小组成员周矩阵展示风险成员数、最高缺口成员、最高异常成员和最高缺口日。
- 小组成员周矩阵支持全部、看缺口、看异常三个视角。
- 缺口视角强化缺口风险单元格，异常视角强化异常风险单元格，默认全部视角仍保留整体风险提示。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍使用本地样例数据和前端聚合；风险摘要不代表真实生产排班口径、正式状态码或结算口径。
- 后续若要做跨周切换、真实班组主数据、权限隔离或生产级状态映射，必须另开 Gate。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：小组成员周矩阵显示“风险成员 2 人”“最高缺口 A-1002 王敏”“最高异常 A-1001 刘晨”“最高缺口日 2026-05-11”；全部、看缺口、看异常三种视角均可打开，且未出现人员时间轴、坐席状态轨迹、验收清单、待实现、准备状态、暂不实现等内部词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Exception explanation cards

#### 审计结论

- `F178-F180/US239-US241` 已在个人单日三轨详情中增加主管视角异常解释卡。
- 个人单日详情模型新增 `exceptionExplanations`，每条解释包含异常类型、时间段、涉及轨道、影响时长、证据说明、建议主管动作和优先级。
- 个人单日三轨时间轴下方展示异常解释卡，主管可以直接判断异常来自排班、登录还是状态。
- 小组成员单日矩阵中的异常标记仍进入个人单日详情，并能看到对应日期异常解释。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍基于本地样例数据和前端聚合解释异常，不代表真实 CORN、HR、WFM 或生产数据库已经接入。
- 异常解释卡只辅助主管判断，不代表正式处理流、审批流、考勤定责或结算口径。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：从 `/person-timeline?team=...&group=...&date=2026-05-11` 的“小组成员单日矩阵”点击“午后状态缺登录切片”进入 `A-1001` 个人单日详情；页面显示“异常解释”“13:00-18:00 / 状态不一致”“涉及轨道：排班 / 登录 / 状态”“影响时长：5.0h”“中优先级”，且未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、处理提交、审批按钮等内部或越界词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Group exception side panel

#### 审计结论

- `F181-F183/US242-US244` 已在小组成员单日矩阵增加异常解释侧栏。
- 小组单日矩阵成员模型暴露 `exceptionExplanations`，主管不必进入个人页也能读取选中异常解释。
- 小组单日矩阵右侧展示当前异常解释，包含员工、时间段、异常类型、涉及轨道、影响时长、证据说明、建议主管动作和优先级。
- 小组矩阵中的异常标记会在当前页更新侧栏，侧栏保留“查看个人详情”入口。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍基于本地样例数据和前端聚合解释异常，不代表真实 CORN、HR、WFM 或生产数据库已经接入。
- 侧栏只辅助主管判断，不代表正式处理流、审批流、考勤定责或结算口径。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：打开 `/person-timeline?team=...&group=...&date=2026-05-11&exception=A-1001::no_login`，页面显示“小组成员单日矩阵”“当前异常解释”“A-1001 刘晨”“13:00-18:00 / 状态不一致”“涉及轨道：排班 / 登录 / 状态”“影响时长：5.0h”“中优先级”和“查看个人详情”，且未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、处理提交、审批按钮等内部或越界词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Group exception priority queue

#### 审计结论

- `F184-F186/US245-US247` 已在小组成员单日矩阵右侧增加待关注异常队列。
- 小组单日矩阵模型暴露 `exceptionQueue`，按优先级、影响时长、员工号稳定排序。
- 右侧面板展示全部待关注异常，队列项包含员工、优先级、时间段、异常标题和影响时长。
- 点击队列项会通过现有 `exception=员工::异常码` 切换当前异常解释，并保留个人详情下钻。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍基于本地样例数据和前端聚合解释异常，不代表真实 CORN、HR、WFM 或生产数据库已经接入。
- 异常队列只用于主管扫描和判断顺序，不代表正式处理流、审批流、考勤定责或结算口径。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：打开 `/person-timeline?team=...&group=...&date=2026-05-11&exception=A-1001::no_login`，页面显示“小组成员单日矩阵”“待关注异常”“2 项”“A-1002 王敏”“高优先级”“09:00-09:21 / 迟到 21 分钟”“影响 0.3h”“当前异常解释”“A-1001 刘晨”“13:00-18:00 / 状态不一致”和“查看个人详情”；点击“A-1002 王敏”后 URL 切换为 `exception=A-1002::late_login`，当前异常解释显示“A-1002 王敏”“09:00-09:21 / 登录缺口”“迟到 21 分钟”“高优先级”，且未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、处理提交、审批按钮等内部或越界词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-20 - Group exception queue summary and filter

#### 审计结论

- `F187-F189/US248-US250` 已在小组成员单日矩阵右侧增加异常队列汇总和显示筛选。
- 小组单日矩阵模型暴露 `exceptionQueueSummary`，包含异常总数、高优先级数、登录缺口数、状态不一致数和总影响时长。
- 右侧面板支持全部、高优先级、登录缺口、状态不一致筛选；筛选后待关注异常队列和当前异常解释同步变化。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍基于本地样例数据和前端聚合解释异常，不代表真实 CORN、HR、WFM 或生产数据库已经接入。
- 筛选只用于主管扫描和解释，不代表正式处理流、审批流、考勤定责或结算口径。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：打开 `queue=high` 时显示“待关注异常”“1 项”“A-1002 王敏”“高优先级”“09:00-09:21 / 登录缺口”“迟到 21 分钟”和“查看个人详情”；切换到 `queue=status` 时显示“待关注异常”“1 项”“A-1001 刘晨”“13:00-18:00 / 状态不一致”和“午后状态缺登录切片”，且未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、处理提交、审批按钮等内部或越界词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-21 - Group exception matrix focus

#### 审计结论

- `F190-F192/US251-US253` 已在小组成员单日矩阵增加选中异常定位联动。
- 异常队列项暴露 `focusEventIds`，用于定位相关排班、登录、状态轨道切片。
- 选中异常后，矩阵高亮对应成员行，并在该成员行显示异常时间窗。
- 选中异常后，相关排班、登录、状态切片会高亮；切换异常筛选或异常项后定位同步变化。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式。

### 2026-05-21 - Exception Queue Cursor

#### 结论

- `F193-F195/US254-US256` 已在小组成员单日矩阵右侧异常队列增加处理光标。
- 异常队列光标暴露当前选中项、当前位置、总数、上一项和下一项。
- 右侧面板显示 `处理进度`，并支持在当前筛选结果中上一项、下一项逐项核对。
- 上一项、下一项链接保留团队、小组、日期和筛选口径，只切换当前异常。
- 筛选为空时展示业务空态，不展示内部执行或开发过程语言。
- 本次没有新增左侧入口，没有新增页面路由，没有新增依赖，没有改后端、数据库、真实接口、权限、审批、处理提交、导出、批量、自动排班或生产公式。

#### 风险

- 本轮仍是本地样例数据上的只读主管处理路径，不代表正式处理流、审批流、责任判定或持久化状态已经实现。
- Playwright 浏览器缓存缺失，浏览器自动化改用本地 SSR 页面抓取验证页面内容和链接。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，11 个履约日历和人员时间轴模型测试通过。
- SSR route smoke：`queue=all` 第一项显示第 1/2 项和下一项，选中第二项显示第 2/2 项和上一项；`queue=status` 显示第 1/1 项；页面没有出现 PRD、Gate、Story、验收清单、待实现、暂不实现、处理提交、审批按钮等内部或越界词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

#### 风险

- 本轮仍基于本地样例数据和前端聚合解释异常，不代表真实 CORN、HR、WFM 或生产数据库已经接入。
- 定位高亮只用于主管扫描和解释，不代表正式处理流、审批流、考勤定责或结算口径。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，10 个履约日历和人员时间轴模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- In-app browser smoke：打开 `queue=status` 时 `A-1001` 成员行、`SCH-1001-2`、`LOG-1001-1`、`STA-1001-2` 被定位；切换到 `queue=high` 时 `A-1002` 成员行、`SCH-1002-1`、`LOG-1002-1` 被定位，且未出现 PRD、Gate、Story、验收清单、待实现、暂不实现、处理提交、审批按钮等内部或越界词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和 25 个后端 unittest。

### 2026-05-22 - Schedule draft personnel linkage

#### 结论

- `F241-F243/US314-US316` 已在排班草稿编辑页增加人员级排班联动核对。
- 联动模型按计划 0.5h 时段返回汇总人数、明细人数、差异、状态和关联人员。
- 草稿页展示关联人员数和需核对时段数，并在每个时段展示对应人员标签。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮联动仍基于现有本地数据模型，重点是让草稿页能核对人员明细是否支撑汇总人数，不代表正式排班发布、审批或生产持久化已经实现。

#### 验证

- `node --test scripts/tests/personnel-schedule-details.test.mjs`：通过，9 个人员排班明细和联动模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- `npm run typecheck`：通过。
- System Chrome smoke：打开 `/schedule-plans/plan-20260511-suzhou-bosch-v1/edit`，页面显示“编辑排班草稿”“人员级排班联动”“汇总 10 人”“明细 1 人”“差异 9 人”和“A-1003 张琳 / 供应商 B”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端等词。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Schedule draft fulfillment-calendar drilldown

#### 结论

- `F244-F246/US318-US320` 已在排班草稿人员联动中增加履约日历个人详情下钻。
- 人员排班时段追溯模型为每个关联人员提供 `timelineHref`。
- 草稿页关联人员入口可点击进入对应个人单日三轨详情，并保留日期、团队和小组上下文。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做查看链路下钻，不保存处理动作，不代表异常处理流、审批流、发布流或生产持久化已经实现。

#### 验证

- `node --test scripts/tests/personnel-schedule-details.test.mjs`：通过，9 个人员排班明细、时段追溯和履约日历链接测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：打开 `/schedule-plans/plan-20260511-suzhou-bosch-v1/edit`，A-1003 链接为 `/person-timeline/A-1003?date=2026-05-11&team=...&group=...&returnDate=2026-05-11`；点击后进入个人详情页，页面包含“排班轨道”“登录轨道”“状态轨道”。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Personal schedule-source drillback

#### 结论

- `F247-F249/US322-US324` 已在个人单日三轨详情中增加排班草稿来源反查。
- 个人详情页展示计划入口、草稿入口、班次窗口、技能、排班明细编号和需核对时段。
- 需核对时段展示汇总人数、明细人数和差异，用于从个人履约问题反查排班依据。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做个人详情的查看反查，不保存复核结论，不代表处理流、发布流、审批流或生产持久化已经实现。

#### 验证

- `node --test scripts/tests/personnel-schedule-details.test.mjs`：通过，10 个人员排班明细、时段追溯和排班来源测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：打开 `/person-timeline/A-1003?date=2026-05-11&team=...&group=...&returnDate=2026-05-11`，页面显示“排班草稿来源”“plan-20260511-suzhou-bosch-v1”“班次 晚班”“窗口 12:00-20:00”“明细 PSD-1003-20260511”“12:00-12:30”“汇总 10 人”“明细 1 人”“差异 9 人”，并存在计划入口和草稿入口。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor resolution draft

#### 结论

- `F250-F252/US326-US328` 已在小组成员单日矩阵异常侧栏增加处理结论建议。
- 异常队列项新增 `resolutionDraft`，包含建议结论、需核材料、沟通对象、负责角色、下一复核点和未闭环风险。
- 侧栏只展示业务建议，不提供提交、保存、审批、导出、批量或状态写入入口。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和判断辅助，不代表正式处理结论登记、审批流、发布流或生产持久化已经实现。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：打开 `/person-timeline?...&queue=high`，侧栏显示“处理结论建议”“待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。”“需核材料：员工到岗说明 / 迟到或漏登原因 / CORN 原始登录日志截图”“沟通对象：王敏 / 现场主管”“下一复核：2026-05-11 10:00”，且未出现提交、保存、审批、导出或批量入口。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor closure checklist

#### 结论

- `F253-F255/US330-US332` 已在小组成员单日矩阵异常侧栏增加主管复核清单。
- 异常队列项新增 `closureChecklist`，包含复核项、状态、负责角色、判断影响、已齐/待补数量和当前判断。
- 侧栏只展示业务复核信息，不提供提交、保存、审批、导出、批量或状态写入入口。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管复核清单查看，不代表正式处理结论登记、审批流、发布流或生产持久化已经实现。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：打开 `/person-timeline?...&queue=high`，侧栏显示“复核清单”“已齐 2 项 / 待补 2 项”“需补到岗说明后再判断当日登录缺口。”“排班记录”“登录记录”“到岗说明”“主管判断”，且未出现提交、保存、审批、导出或批量入口。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor queue grouping

#### 结论

- `F256-F258/US334-US336` 已在小组成员单日矩阵异常侧栏增加主管处理分组筛选。
- 异常队列项新增 `reviewGroup`，包含分组编码、分组名称和分组原因。
- 异常摘要新增需补材料、待主管判断和需数据核对数量；侧栏新增对应筛选入口，并在队列项展示处理分组。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管队列分组和查看筛选，不代表正式处理结论登记、审批流、发布流或生产持久化已经实现。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：打开 `/person-timeline?...&queue=missing_material` 和 `/person-timeline?...&queue=supervisor_judgment`，侧栏显示“需补材料”“待主管判断”“需数据核对”和对应“处理分组”原因，且未出现提交、保存、审批、导出或批量入口。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Personal detail review context

#### 结论

- `F259-F261/US338-US340` 已在个人单日三轨详情中同步异常复核口径。
- 个人日视图新增 `reviewContexts`，包含异常键、处理分组、当前判断和复核清单。
- 从小组异常队列下钻到个人详情时，页面展示“异常复核口径”、处理分组、当前判断和复核项。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做个人详情查看语境同步，不代表正式处理结论登记、审批流、发布流或生产持久化已经实现。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开带 `queue=supervisor_judgment` 和 `exception=A-1001::no_login` 的个人详情页，页面显示“异常复核口径”“待主管判断”“已齐 3 项 / 待补 2 项”、处理分组、当前判断和三轨内容，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Group review-load summary

#### 结论

- `F262-F264/US342-US344` 已在小组成员单日矩阵中增加复核负载汇总。
- 小组矩阵模型新增 `reviewLoadSummary`，包含总待复核、高优数量、已齐/待补材料数量、最高负载分组、下一优先查看和各分组负载。
- 页面在现有右侧异常队列面板展示“复核负载”“最高负载”“下一优先查看”和分组负载，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看视角的负载摘要，不代表正式处理结论登记、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `matrix.reviewLoadSummary` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵，页面显示“复核负载”“当前小组待复核 2 项，高优先 1 项”“最高负载”“下一优先查看”和处理分组负载，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Exception evidence data-quality links

#### 结论

- `F265-F267/US346-US348` 已在小组成员单日矩阵异常详情中增加关联数据质量查看链路。
- 异常队列模型新增 `dataQualityLinks`，包含数据质量问题、匹配记录、核对字段、关联原因、建议和详情链接。
- 页面在现有右侧异常详情展示“关联数据质量”，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做异常到数据质量的查看关联，不代表真实数据修复、处理结论登记、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `lateLogin.dataQualityLinks` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“关联数据质量”“DQ-202605-009 / 登录员工不在主数据”“匹配记录：LOG-1002-1”“查看质量详情”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Exception aging and escalation hints

#### 结论

- `F268-F270/US350-US352` 已在小组成员单日矩阵异常详情中增加超时与升级查看口径。
- 异常队列模型新增 `agingEscalation`，包含识别时间、等待时长、超时等级、升级原因、关注角色、下一复核窗口和队列提示。
- 队列摘要新增超时关注项和建议升级项数量。
- 页面在现有右侧异常详情展示“超时与升级”，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实处理、升级通知、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `exceptionQueueSummary` 缺少 `agingWatchCount` 和 `escalationCount`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“超时关注”“建议升级”“超时与升级”“识别时间：2026-05-11 09:22”“等待时长：5小时08分钟”“下一复核：2026-05-11 15:00 前”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor daily workload summary

#### 结论

- `F271-F273/US354-US356` 已在小组成员单日矩阵异常面板中增加主管日工作量汇总。
- 小组矩阵模型新增 `supervisorDailyWorkload`，包含待关注项、高优先项、超时关注、建议升级、最高负载角色、角色负载和下一优先查看。
- 页面在现有右侧异常面板展示“今日工作量”，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实派单、处理记录写入、通知、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `supervisorDailyWorkload` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“今日工作量”“待关注 2 项，影响 5.4h”“建议升级 1”“最高负载角色”“现场主管今日有 2 项待关注，其中 1 项建议升级。”“下一优先查看”和“数据管理员”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Exception source summary

#### 结论

- `F274-F276/US358-US360` 已在小组成员单日矩阵异常面板中增加异常来源聚合。
- 小组矩阵模型新增 `exceptionSourceSummary`，包含主要来源、下一优先来源、来源分布、影响时长、高优先、超时关注和建议升级数量。
- 页面在现有右侧异常面板展示“异常来源”，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实来源修复、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `exceptionSourceSummary` 为 `undefined`，证明测试覆盖新增模型能力。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，12 个履约日历模型测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs`：通过，产品 UI 未暴露内部执行词。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“异常来源”“来源 2 类，主要看 登录轨道”“主要来源”“登录轨道有 1 项异常，其中 1 项高优先，建议先核对原始登录记录。”“下一优先来源”“状态轨道”和“排班轨道”，且未出现 PRD、Gate、验收清单、暂不实现、数据接入状态、人员时间轴、坐席状态轨迹、本地、后端、提交、保存、审批、导出或批量。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-24 - Exception owner load comparison

#### 结论

- `F298-F300/US390-US393` 已在小组成员单日矩阵异常面板中增加异常责任人负载对比。
- 异常队列项新增 `ownerLoadComparison`，包含当前责任人、最高负载责任人、对比责任人、负载差异和处理顺序。
- 页面在现有右侧异常面板展示“责任人负载对比”，位于当日风险摘要之前，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实派单、通知、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `ownerLoadComparison` 为 `undefined` 且页面缺少责任人负载对比卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“责任人负载对比”“现场主管是当前最高负载角色，比数据管理员多 1 项，影响多 5.00h。”“对比角色：数据管理员”“处理顺序”，且未出现内部执行词或通知、提交、保存、审批、导出、批量入口。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-24 - Team week risk distribution

#### 结论

- `F295-F297/US386-US389` 已在履约日历团队周视图增加团队周风险分布。
- 团队周模型新增 `weekRiskDistribution`，包含最高风险日、风险分布点、主要风险原因、建议下钻日期、小组和团队排名。
- 页面在现有团队周视图展示“团队周风险分布”，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实预警、通知、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `weekRiskDistribution` 为 `undefined` 且页面缺少团队周风险分布面板，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开 `/person-timeline`，页面显示“团队周风险分布”“本周风险集中在周一 05/11，建议先下钻供应商 A。”“第 1 / 3 个团队”“建议下钻”，且未出现内部执行词或通知、提交、保存、审批、导出、批量入口。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Supervisor exception comparison

#### 结论

- `F292-F294/US382-US385` 已在小组成员单日矩阵异常面板中增加主管异常对比。
- 异常队列项新增 `exceptionComparison`，包含当前排名、优先原因、对比异常、主要差异和关注顺序。
- 页面在现有右侧异常面板展示“异常对比”，位于当日风险摘要之前，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序解释，不代表真实处理、通知、写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `exceptionComparison` 为 `undefined` 且页面缺少对比卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“异常对比”“王敏为高优先级，且已达到需要升级。”“第 1 / 2 项”“对比：刘晨 / 午后状态缺登录切片”，且异常对比位于当日风险摘要之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Team day risk trend

#### 结论

- `F289-F291/US378-US381` 已在小组成员单日矩阵异常面板中增加团队日风险趋势。
- 小组矩阵模型新增 `teamDayRiskTrend`，包含趋势方向、最高风险日、当前日对比、趋势点和下一关注点。
- 页面在现有右侧异常面板展示“风险趋势”，位于当日风险摘要之前，不新增入口或页面。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、通知、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只做主管查看和排序口径，不代表真实趋势预警、通知、处理记录写入、审批流、发布流或生产持久化已经实现。

#### 验证

- TDD red：`node --test scripts/tests/person-timeline.test.mjs` 首次失败于 `teamDayRiskTrend` 为 `undefined` 且页面缺少趋势卡，证明测试覆盖新增模型和 UI 位置。
- `node --test scripts/tests/person-timeline.test.mjs`：通过，13 个履约日历模型和源序测试通过。
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，产品 UI 未暴露内部执行词，导航未新增伪入口。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，页面显示“风险趋势”“本周风险从周一高位回落，当前日仍是最高风险日。”“较下一有排班日”“比周二高 80 分，缺口多 1 人，异常多 2 人。”，且风险趋势位于当日风险摘要之前。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

### 2026-05-22 - Follow-up timeline visibility correction

#### 结论

- 已修正 `F286-F288/US374-US377` 的可见性问题：选中异常后，“跟进时间线”现在位于小组成员单日矩阵右侧异常面板顶部。
- 页面首屏可直接看到识别、已跟进、当前卡点和下一复核，不需要先翻过当日风险、复核负载、工作量、来源、交接等汇总模块。
- 本次没有新增页面路由、左侧入口、依赖、后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。

#### 风险

- 本轮只调整查看优先级，不改变异常计算、处理记录口径、升级口径或任何真实动作能力。

#### 验证

- `node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`：通过，包含“跟进时间线必须位于汇总面板前”的回归测试。
- `npm run typecheck`：通过。
- Browser smoke：通过，打开小组单日矩阵并选中 `A-1002::late_login`，首屏文本包含“跟进时间线”“A-1002 王敏 / 迟到 21 分钟”“当前卡点”“下一复核”。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归测试、frontend lint、typecheck、Next build 和后端 unittest。

## Historical Audit Snapshots

### 2026-05-11 - Lightweight Harness 文档型升级（历史快照）

#### 审计结论

- 原始需求、用户故事、DAG、提示词、任务日志、决策日志和审计报告已建立文档入口。
- 历史当时的结论是：升级保持在 clean Harness 允许范围内。
- 历史当时的限制是：未授权创建真实前端、后端、依赖、API、数据库或业务 mock 数据。

#### 历史风险

- 当时曾记录“当前工作区存在未跟踪工程文件，可能导致 `bash scripts/check.sh` 在真实工作区失败”。
- 该风险已被后续 H011/H012/H016 复核取代；当前真实阶段是 frontend dashboard scaffold + local scheduling-plan MVP vertical，且关键工程文件已纳入 tracked 范围。
- 后续不应再按 clean-Harness-only 状态判断当前 Gate。

#### 历史建议

- 下一次新增业务模块需求时，先登记到 `docs/raw-requirements.md`。
- 再拆分到 `docs/user-stories.md`，并检查依赖、优先级和阻塞项。
- 涉及结算、权限、导出、批量操作、真实数据来源时，必须先 PM 确认。
