# Audit Report

本文件记录 Harness 闭环审计结果、风险、阻塞和建议。

## Current Audit

### 2026-06-01 - IM050 shadcn/ui 自动化验证链路

#### 审计结论

- `IM050/US670` 已将 shadcn/ui 本地约束检查接入 `bash scripts/check.sh`。
- 新增 `scripts/check-shadcn-ui.mjs`，检查 `components.json` 项目基线、禁止项目代码新增 `space-x/space-y`、禁止硬编码 Tailwind 色阶、禁止任意半径。
- 新增 `scripts/tests/check-shadcn-ui.test.mjs` 覆盖通过、失败和 baseline 场景。
- 新增 `scripts/shadcn-ui-baseline.json` 记录当前 5 个历史色阶违例；本轮不改产品 UI，后续新增违例会被 check 阻断。
- 本轮不新增依赖，不修改 package/lockfile，不调用远程 shadcn CLI 作为硬依赖，不做产品 UI、后端、schema/migration、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前自动化覆盖 shadcn 规则中稳定可静态化的部分；更复杂的组件组合语义和图标嵌套仍需要 code review 配合。
- baseline 中的 5 个历史色阶违例应后续单独治理，不应在新功能任务里继续扩张。

#### 验证

- TDD 红灯：`node --test scripts/tests/check-shadcn-ui.test.mjs` 因缺少 `scripts/check-shadcn-ui.mjs` 失败。
- `node --test scripts/tests/check-shadcn-ui.test.mjs`：通过，3 个 shadcn checker 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，识别 5 个已记录 baseline 违例，无新增违例。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、shadcn checker 测试、真实 shadcn 项目扫描、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM049 数据质量到异常反向聚合 drilldown

#### 审计结论

- `IM049/US669` 已在 `/data-quality/[batchId]` 的“结果追踪”页签增加质量影响聚合区。
- 聚合按导入失败/警告行的错误字段和错误原因分组，展示问题行数、失败/警告构成、下游影响候选、证据和下一步。
- 聚合关联当前业务日已有 comparison-runs 与 review-cases，说明复核案例、未关闭复核和对比结果候选。
- 无批次明细或无行级质量问题时展示只读空态，不新增写入按钮。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前是只读“影响候选”聚合，尚未建立行级质量问题到具体复核案例的数据库级真实映射。
- 后续如继续深化，应优先做复核结论预览，不要混入真实关闭写入、审批、导出、批量或权限。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportQualityImpactAggregation` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，34 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快查：触达前端文件范围未发现 `space-x/space-y`、硬编码灰阶色阶或新的非语义色彩类。
- in-app browser smoke：浏览器通道返回 route unavailable；本轮改用生产构建 HTTP smoke 补证。临时启动 `npm run start -- -p 3022` 后，`curl http://127.0.0.1:3022/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 返回页面 HTML，包含 `质量影响聚合`、`首要问题`、`source_key · REQUIRED_FIELD_MISSING`、`1 行问题 · 0 个复核案例 · 0 条对比结果` 和 `查看失败行修正`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM048 批次详情下游结果追踪 drilldown

#### 审计结论

- `IM048/US668` 已在 `/data-quality/[batchId]` 的“结果追踪”页签增加下游结果判断区。
- 页面现在按当前批次应用状态、准备度、业务日、对比结果和复核案例判断：需处理、等待结果或可追踪。
- 未应用或准备度阻塞时，优先引导处理失败行和应用准备度；已有结果时，优先展示未关闭复核案例或关联对比运行。
- 对比结果表和复核案例表仍保留在详情页结果追踪工作区下方，没有回流到列表页。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前只做只读 drilldown 和已有 API 入口，不创建复核结论，也不触发对比计算或批次应用写入。
- 后续如继续深化，应优先做数据质量问题到下游异常影响的反向聚合，不要混入审批、导出、批量、权限或生产规则。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportDownstreamResultDrilldown` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，32 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快查：触达前端文件范围未发现 `space-x/space-y`、硬编码灰阶色阶或新的非语义色彩类。
- in-app browser smoke：`/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 的“结果追踪”Tab 包含“下游结果判断”“先处理导入阻塞”“优先对比线索”“优先复核线索”“判断证据”；console error 为空。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM047 应用准备度问题分组

#### 审计结论

- `IM047/US667` 已在 `/data-quality/[batchId]` 的“状态检查”区域增加准备度问题分组。
- 问题组覆盖失败行、行级必填字段、导入版本缺口、已应用状态、批次级阻塞和 ready/unknown 兜底状态。
- 每组展示数量、影响说明、下一步和关键证据，帮助先处理主要阻塞。
- 原始 blockers 和 row blockers 明细仍保留下方，方便追溯。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、应用写入、批量处理、审批、导出、权限、生产公式、结算或收费因子。

#### 风险

- 当前只做准备度问题可见性，不提供应用写入入口，也不改变后端 readiness 判定。
- 后续如继续深化，应优先做下游对比/复核结果 drilldown，不要混入审批、导出、批量或生产规则。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportReadinessIssueGroups` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，30 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快查：触达前端文件范围未发现 `space-x/space-y`、硬编码灰阶/琥珀/绿色色阶、旧左右分栏文案、`分层详情` 或 `选中批次状态检查器`。
- in-app browser smoke：`/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 包含“准备度问题分组”“失败行阻塞”“批次级阻塞”和数量证据；console error 为空。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM046 字段映射模板适配详情

#### 审计结论

- `IM046/US666` 已在 `/data-quality/[batchId]` 的“导入与模板”页签增加当前批次文件类型的模板适配详情。
- 页面现在展示推荐模板、同类型启用/停用数量、推荐映射字段数、建议字段缺口、已覆盖标准字段和缺口字段。
- 模板卡片展示 source -> standard 映射表格，不再只依赖一行映射摘要。
- 无启用模板或模板读取失败时保留只读兜底提示，说明可继续手填字段映射 JSON。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、模板 CRUD 写入、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前只做模板适配可见性，不创建、不更新、不停用模板，也不把模板选择结果写回批次处理状态。
- 后续如继续深化，应优先做应用准备度问题分组或结果追踪 drilldown，仍不要混入审批、导出、批量和生产规则。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportTemplateFitDetail` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，29 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快查：触达前端文件范围未发现 `space-x/space-y`、硬编码灰阶/琥珀/绿色色阶、旧左右分栏文案、`分层详情` 或 `选中批次状态检查器`。
- in-app browser smoke：`/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 的“导入与模板”Tab 唯一可点；页面包含“模板适配”“推荐”“已覆盖标准字段”“建议补齐字段”“来源字段”“标准字段”；console error 为空。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM045 数据质量批次详情单列处理流重设计

#### 审计结论

- `IM045/US665` 已把 `/data-quality/[batchId]` 从左右分栏改为单列处理流程。
- 页面现在按批次头部、处理总览、全宽批次处理 Tabs 组织；状态检查作为默认 Tab，不再作为左侧栏。
- 页面文案不再使用“分层详情”或“选中批次状态检查器”，改为业务化的“批次处理”和“状态检查”。
- `correction=success&row=1` 的修正结果反馈提升到批次处理工作区上方，默认状态检查 Tab 下也不会丢失当前处理反馈。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前是详情页信息架构和展示层级修正，不是应用写入、批量修正、权限隔离或审批流程。
- 后续如继续深化，应优先做模板/字段映射管理深度或准备度问题分组，不要混入生产规则和外部集成。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因 `summarizeImportPageHierarchy` 仍返回旧分层详情和 `row-correction` 默认 Tab 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，28 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快查：触达前端文件范围未发现 `space-x/space-y`、硬编码灰阶色、旧左右分栏类名、`分层详情` 或 `选中批次状态检查器`。
- in-app browser smoke：`/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 包含处理总览、`批次处理`、`状态检查`、`失败行修正`、`批次明细`、`结果追踪`、`导入与模板` 和 `第 1 行已修正`；不包含 `分层详情` 或 `选中批次状态检查器`；console error 为空。
- 截图证据：`/private/tmp/im045-data-quality-single-column-detail.png`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM044 数据质量批次二级详情导航修正

#### 审计结论

- `IM044/US664` 已把具体批次处理入口调整为 `/data-quality/[batchId]`，让详情页成为数据质量下的二级页面。
- `/data-quality` 只保留批次概览、筛选和列表，不再放置“选中批次状态检查器”。
- 详情页保留状态检查器、分层详情、失败行修正、结果追踪和导入模板；旧 `/data-quality/import-batches/[batchId]` 保留为兼容跳转，避免旧链接断开。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前是前端页面层级与导航修正，不是批次应用写入、批量处理、权限隔离或审批流。
- 后续若继续深化生产可用性，建议拆成模板/字段映射管理深度、准备度问题分组或结果详情钻取，不要混入外部集成和生产规则。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因 `buildImportBatchProcessingHref` 仍返回旧 `/data-quality/import-batches/[batchId]` 路径失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，28 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快查：触达前端文件范围未发现 `space-x/space-y` 或硬编码灰阶色。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- in-app browser smoke：`/data-quality?batch=BATCH-IM026-SMOKE-004` 不包含 `选中批次状态检查器` 和 `分层详情`，处理链接指向 `/data-quality/[batchId]`；`/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 包含 `批次处理详情`、`返回批次列表`、`选中批次状态检查器`、`分层详情` 和 `第 1 行已修正`；旧 `/data-quality/import-batches/BATCH-IM026-SMOKE-004?correction=success&row=1` 跳转到新二级路径；console error 为空。
- 截图证据：`/private/tmp/im044-data-quality-second-level-detail.png`。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM040 导入中心应用结果到下游结果导航

#### 审计结论

- `IM040/US660` 已在 `/data-quality` 的应用准备度区域增加“下游结果导航”。
- 模型层新增 `summarizeImportDownstreamResultNavigation`，根据应用状态、文件类型、版本、失败行和记录数输出对比结果、复核案例或前置修正路径。
- 页面使用现有 shadcn `Card`、`Badge`、`Button` 组合展示只读导航，并把对比结果和复核案例链接指向现有本地 API 结果列表路径。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前是前端只读导航，不是对比结果列表 UI、复核案例列表 UI、复核结论写入、审批、导出或批量处理。
- 后续若要把 `/api/v1/comparison-runs` 和 `/api/v1/review-cases` 做成业务列表页，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportDownstreamResultNavigation` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，25 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快查：新增文件范围未发现 `space-x/space-y` 或硬编码灰阶色。
- 页面 smoke：`http://127.0.0.1:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 返回 200，包含 `下游结果导航` 和行动入口。
- In-app browser：`http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1#import-apply-readiness` 可见 `下游结果导航`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM039 导入中心数据质量到履约异常追踪可见性

#### 审计结论

- `IM039/US659` 已在 `/data-quality` 的批次明细增加“履约异常影响追踪”。
- 模型层新增 `summarizeImportQualityExceptionTrace`，按文件类型、失败行、警告行和版本记录输出下游异常影响范围。
- 页面展示影响链路、质量证据、下一步建议和只读追踪标识。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。

#### 风险

- 当前是前端只读影响追踪，不是真实异常查询、异常关闭、复核写入、导出或批量处理。
- 后续若要把追踪接到 DB007/DB008 真实结果列表或复核闭环，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportQualityExceptionTrace` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，24 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- 页面 smoke：`http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 返回页面，包含 `履约异常影响追踪`、`影响链路`、`质量证据` 和 `只读追踪`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM038 导入中心批次明细可读性增强

#### 审计结论

- `IM038/US658` 已在 `/data-quality` 的批次明细增加“处理摘要”。
- 模型层新增 `summarizeImportBatchDetailReadability` 和 `formatImportRowErrorField`，根据失败行、警告行、版本记录和总行数输出只读复核焦点。
- 页面在批次明细中展示下一步建议、错误字段摘要，并在全部行结果表中直接展示错误字段。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。

#### 风险

- 当前是前端只读可读性增强，不是批量修正、导出、审批或应用写入。
- 后续若要做行结果筛选、分页、导出、批量修正或服务端审计，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `formatImportRowErrorField` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，23 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- 页面 smoke：`http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 返回页面，包含 `处理摘要`、`错误字段` 和 `下一步`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM037 导入中心应用状态概览

#### 审计结论

- `IM037/US657` 已在 `/data-quality` 增加“应用状态概览”。
- 模型层新增 `summarizeImportApplicationVisibility`，根据已应用、未应用且可复核、未应用且阻塞、准备度未知输出只读状态口径。
- 页面在选中批次的应用准备度区域展示应用状态、应用目标、导入版本、已应用记录数和下一步建议。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。

#### 风险

- 当前是前端只读状态概览，不是应用写入、应用发布、批量处理或审批流程。
- 后续若要做真实 apply 按钮、权限隔离、批量处理、导出或服务端审计，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportApplicationVisibility` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，22 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。
- 页面 smoke：`http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 返回页面，包含 `应用状态概览`、`应用目标`、`导入版本` 和 `已应用记录`。

### 2026-06-01 - IM036 导入中心选中批次处理导览

#### 审计结论

- `IM036/US656` 已在 `/data-quality` 增加“批次处理导览”。
- 模型层新增 `summarizeImportBatchReviewGuide`，根据失败行、警告、应用状态和 readiness 输出下一步定位建议。
- 页面新增到批次明细、失败行修正和应用准备度的锚点定位；批次行点击默认定位到批次明细。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。

#### 风险

- 当前是前端只读导览和页面内定位，不是应用写入、批量修正、导出或审批流程。
- 后续若要做真实 apply 按钮、权限隔离、批量处理或服务端审计，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportBatchReviewGuide` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，21 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。
- 页面 smoke：`http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 返回页面，包含 `批次处理导览`、`查看失败行`、`import-row-correction`、`import-batch-detail` 和 `import-apply-readiness`；筛选后的批次链接包含 `#import-batch-detail`。

### 2026-05-31 - IM030 导入中心字段映射模板只读管理可见性

#### 审计结论

- `US650/IM030/R730` 已完成导入中心字段映射模板只读管理可见性。
- `/data-quality` 展示字段映射模板只读管理面板。
- 面板展示模板总数、启用/停用数量、覆盖文件类型数量和映射字段数量。
- 每个模板展示文件类型、状态、创建人、创建时间和字段映射摘要。
- 模板 API 异常或无模板时展示空/错误状态，不新增静态业务样例。
- 本轮不新增依赖，不修改 package/lockfile，不做模板新增/编辑/停用按钮、后端、schema/migration、审批、导出、权限、批量、外部集成、生产公式、结算或收费因子。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做只读可见性；不提供模板创建、更新、停用或批量维护操作。
- 本轮依赖现有 field-mapping template API；若本地 FastAPI 未启动，页面展示模板读取失败并保留上传表单手填 JSON 路径。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- TDD 红灯：`node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs` 先因缺少 `summarizeImportFieldMappingTemplates` export 失败。
- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，15 个模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS 'http://127.0.0.1:8000/api/v1/import-field-mapping-templates'`：通过，本地 API 返回 `TPL-IM027-SMOKE-001`。
- `curl -fsS 'http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1'`：返回 `200`，页面 HTML 包含字段映射模板、只读查看模板库存、启用模板、停用模板、覆盖类型、映射字段和 `TPL-IM027-SMOKE-001`。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend build 和 backend unittest。

### 2026-05-31 - IM029 导入中心失败行修正结果反馈打磨

#### 审计结论

- `US649/IM029/R729` 已完成导入中心失败行修正结果反馈打磨。
- `/data-quality` 在单行修正成功后展示可读结果摘要。
- 结果摘要展示修正行号、剩余失败行数量和下一步处理提示。
- 修正失败时把 `invalid_json`、`missing_required_fields` 和 `api_*` 等常见原因翻译成业务可读说明。
- 本轮不新增依赖，不修改 package/lockfile，不做后端、schema/migration、批量修正、apply 写按钮、模板 CRUD、审批、导出、权限、外部集成、生产公式、结算或收费因子。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只改善已有单行修正后的反馈展示；不新增批量修正、自动应用或关闭异常能力。
- 本轮依赖现有 persisted detail API 和 row correction API；若本地 FastAPI 未启动，页面仍会展示读取失败或修正失败状态。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，14 个模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS 'http://127.0.0.1:8000/api/v1/import-batches'`：通过，本地 API 返回 smoke 批次。
- `curl -fsS 'http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1'`：返回 `200`，页面 HTML 包含第 1 行已修正和剩余失败行提示。
- `curl -fsS 'http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=failed&reason=invalid_json&row=1'`：返回 `200`，页面 HTML 包含修正失败和标准字段不是合法 JSON 对象。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend build 和 backend unittest。

### 2026-05-29 - IM028 导入中心批次明细 drilldown 第一刀

#### 审计结论

- `US648/IM028/R728` 已完成导入中心批次明细 drilldown 第一刀。
- `/data-quality` 对选中批次展示 persisted detail drilldown。
- 明细展示批次行状态分布、版本列表、全部行结果和 `standard_fields`/`raw_data` 预览。
- 明细 API 异常或无批次时展示空/错误状态，不新增静态业务样例。
- 本轮只读展示，不新增 apply 写按钮、批量修正、模板 CRUD、后端、schema/migration、导出、权限、审批、外部集成、生产公式、结算或收费因子。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮依赖现有 persisted detail API；若本地 FastAPI 未启动，页面展示批次明细读取失败或空状态。
- 本轮只显示当前 API 返回的行结果和版本，不做分页、导出或批量操作。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，12 个模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS 'http://127.0.0.1:8000/api/v1/import-batches'`：通过，本地 API 返回 smoke 批次。
- `curl -fsS 'http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004'`：返回 `200`，页面 HTML 包含批次明细、版本记录、全部行结果、`BATCH-IM026-SMOKE-004` 和 `REQUIRED_FIELD_MISSING`。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend build 和 160 个 backend unittest。

### 2026-05-29 - IM027 导入中心字段映射模板选择第一刀

#### 审计结论

- `US647/IM027/R727` 已完成导入中心字段映射模板选择第一刀。
- `/data-quality` 读取现有 field mapping templates，并在 CSV 上传表单展示模板选择。
- 上传表单选择模板后提交 `template_id` 到现有 `upload-csv` API。
- 无模板或模板 API 异常时仍保留手填 `field_mapping` JSON 上传路径。
- 模板列表展示模板名称、类型和映射摘要，未新增静态业务样例。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做上传表单模板选择和模板摘要展示；不做模板 CRUD UI、不新增后端 API、不新增 schema/migration。
- 本轮依赖现有 field-mapping template API；若本地 FastAPI 未启动，页面展示模板读取失败并保留手填 JSON。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，10 个模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS -X POST ... /api/v1/import-field-mapping-templates ...`：通过，创建本地模板 `TPL-IM027-SMOKE-001`。
- `curl -fsS -X POST ... /api/v1/import-batches/upload-csv ... template_id=TPL-IM027-SMOKE-001`：通过，生成本地批次 `BATCH-IM027-SMOKE-001`。
- `curl -fsS 'http://localhost:3022/data-quality?batch=BATCH-IM027-SMOKE-001'`：返回 `200`，页面 HTML 包含字段映射模板下拉、模板摘要和 smoke 批次。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend build 和 160 个 backend unittest。

### 2026-05-29 - IM026 导入中心失败行列表与单行修正 UI 第一刀

#### 审计结论

- `US646/IM026/R726` 已完成导入中心失败行列表与单行修正 UI 第一刀。
- `/data-quality` 会读取选中批次的 persisted detail，并展示 `failed_rows`。
- 每条失败行展示行号、错误字段、错误码、错误说明和标准字段摘要。
- 每条失败行提供单行修正表单，通过 Next server action 调用现有 row correction API。
- 修正后回到当前 batch，并继续复用批次列表和 apply-readiness 读取。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做单行修正 UI；不做批量修正、不做 apply 写按钮、不新增后端 API、不新增 schema/migration。
- 本轮依赖现有 row correction API；若本地 FastAPI 未启动，页面展示 API 错误或修正失败状态。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，7 个模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS -X POST ... /api/v1/import-batches/upload-csv ...`：通过，生成含失败行的本地批次 `BATCH-IM026-SMOKE-003` 和 `BATCH-IM026-SMOKE-004`。
- `curl -fsS -X POST ... /api/v1/import-batches/BATCH-IM026-SMOKE-003/rows/1/correct ...`：通过，失败行被修正为 success，批次计数变为 `success_rows=1`、`failed_rows=0`。
- `curl -fsS -o /tmp/data-quality-im026.html -w "%{http_code}" 'http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004'`：返回 `200`，页面 HTML 包含失败行修正面板、错误码和提交修正按钮。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 160 个 backend unittest。

### 2026-05-29 - IM025 导入中心 CSV 上传表单第一刀

#### 审计结论

- `US645/IM025/R725` 已完成导入中心 CSV 上传表单第一刀。
- `/data-quality` 页面新增 CSV 上传表单，可提交 batch_id、file_name、file_type、uploaded_by、业务日期和 field_mapping JSON。
- 新增 Next server action 读取本地 CSV 文件内容，并调用现有 `POST /api/v1/import-batches/upload-csv`。
- 上传成功后跳转到新 batch，页面继续复用现有批次列表和 apply-readiness 读取。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做 CSV 文本上传到现有本地 API；不做 Excel/multipart、不新增依赖、不新增后端 API。
- 本轮不做 apply 写按钮、批量导入、审批、导出或权限边界。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，5 个模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS -X POST ... /api/v1/import-batches/upload-csv ...`：通过，生成本地批次 `BATCH-IM025-SMOKE-001`。
- `curl -fsS 'http://127.0.0.1:8000/api/v1/import-batches?uploaded_by=local-operator'`：通过，能读回 `BATCH-IM025-SMOKE-001`。
- `curl -fsS -o /tmp/data-quality-im025.html -w "%{http_code}" 'http://127.0.0.1:3021/data-quality?batch=BATCH-IM025-SMOKE-001'`：返回 `200`。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 160 个 backend unittest。

### 2026-05-29 - IM024 导入中心前端 API 接入第一刀

#### 审计结论

- `US644/IM024/R724` 已完成导入中心前端 API 接入第一刀。
- 新增 `/data-quality` 页面，通过服务端读取本地 `GET /api/v1/import-batches`，避免浏览器跨端口 CORS 阻断。
- 页面按选中批次读取 `GET /api/v1/import-batches/{batch_id}/apply-readiness`，展示 readiness、批次阻塞和行级阻塞。
- 侧边栏数据与集成下的文件导入、接入批次、数据质量入口已指向 `/data-quality`。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做只读前端 API 接入；不做上传表单、apply 写按钮、失败行修正写入、审批、导出或批量能力。
- 本轮页面读取本地 API；若 FastAPI 未启动，页面展示 API 错误状态，不回退为静态业务样例。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，4 个模型测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `NODE_ENV=development npm run dev` + `curl -fsS -o /tmp/data-quality.html -w "%{http_code}" http://127.0.0.1:3000/data-quality`：返回 `200`。
- `curl -fsS http://127.0.0.1:8000/api/v1/import-batches`：返回 `{"items":[]}`，页面验证基于真实空 API 状态。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 160 个 backend unittest；首次沙箱运行因 `next/font` DNS 被拦截失败，授权网络重跑后通过。

### 2026-05-29 - IM023 人员排班与实际日志应用前 readiness 安全闸第一刀

#### 审计结论

- `US643/IM023/R723` 已完成人员排班与实际日志应用前 readiness 安全闸第一刀。
- `apply-personnel-schedule` 和 `apply-actual-logs` 在写入前复用 apply-readiness 判断。
- 未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY`，错误体包含 readiness 详情。
- 已应用批次继续返回既有 `already_applied` 幂等响应，不被 readiness 安全闸改成错误。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做应用前字段/版本/批次状态类安全闸，不做深度主数据引用存在性之外的新业务规则。
- 本轮不新增 schema/migration，不自动触发 apply，也不新增审批流、导出或批量能力。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_personnel_schedule_import_api backend.tests.test_actual_log_import_api -v`：通过，10 个 personnel/actual apply API 测试通过。
- `.venv/bin/python -m unittest backend.tests.test_master_data_import_api backend.tests.test_forecast_import_api backend.tests.test_personnel_schedule_import_api backend.tests.test_actual_log_import_api backend.tests.test_import_readiness_api -v`：通过，27 个四类 apply/readiness 回归测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 160 个 backend unittest。

### 2026-05-29 - IM022 导入应用前 readiness 安全闸第一刀

#### 审计结论

- `US642/IM022/R722` 已完成导入应用前 readiness 安全闸第一刀。
- `apply-master-data` 和 `apply-forecast` 在写入前复用 apply-readiness 判断。
- 未就绪批次返回稳定 `IMPORT_APPLY_NOT_READY`，错误体包含 readiness 详情。
- 已应用批次继续返回既有 `already_applied` 幂等响应，不被 readiness 安全闸改成错误。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只接入 master_data 与 demand_forecast apply 路由；personnel_schedule 和 login/status-log apply 的同类安全闸仍需下一刀补齐。
- 本轮不新增 schema/migration，不自动触发 apply，也不新增审批流、导出或批量能力。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_master_data_import_api backend.tests.test_forecast_import_api -v`：通过，10 个 master_data/forecast apply API 测试通过。
- `.venv/bin/python -m unittest backend.tests.test_master_data_import_api backend.tests.test_forecast_import_api backend.tests.test_personnel_schedule_import_api backend.tests.test_actual_log_import_api backend.tests.test_import_readiness_api -v`：通过，25 个导入 apply/readiness 回归测试通过。
- `.venv/bin/python -m unittest backend.tests.test_import_application_summary_api backend.tests.test_master_data_import_api backend.tests.test_forecast_import_api -v`：通过，14 个 application-summary/master_data/forecast 回归测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 158 个 backend unittest。

### 2026-05-29 - IM021 导入批次应用前行级字段预检第一刀

#### 审计结论

- `US641/IM021/R721` 已完成导入批次应用前行级字段预检第一刀。
- `GET /api/v1/import-batches/{batch_id}/apply-readiness` 响应新增 `row_blockers`。
- 成功行缺少当前 `file_type` 或 `record_type` 应用所需标准字段时返回 `blocked`。
- 行级阻塞包含 `row_number`、`code`、`field_name` 和 `message`。
- 干净批次继续返回 `ready` 且 `row_blockers` 为空。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做字段级只读预检，不做主数据引用存在性、班次规则、时区、跨天等深度业务校验。
- 本轮不自动触发 apply，也不新增 apply 任务表、审批流、导出或批量能力。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_readiness_api -v`：通过，7 个 apply-readiness API 测试通过。
- `.venv/bin/python -m unittest backend.tests.test_import_readiness_api backend.tests.test_import_batch_list_api backend.tests.test_import_application_summary_api backend.tests.test_import_row_correction_api backend.tests.test_import_mapping_api backend.tests.test_import_upload_api -v`：通过，32 个相邻导入 API 回归测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 156 个 backend unittest。

### 2026-05-29 - IM020 导入批次应用前就绪校验第一刀

#### 审计结论

- `US640/IM020/R720` 已完成导入批次应用前就绪校验第一刀。
- 新增只读 `GET /api/v1/import-batches/{batch_id}/apply-readiness`。
- 返回 `batch_id`、`file_type`、`readiness_status`、阻塞原因、行数、版本数和应用状态摘要。
- 批次存在失败行、无成功行、无导入版本或已应用时返回 `blocked`。
- 查询不存在 batch 返回稳定 `IMPORT_BATCH_NOT_FOUND`。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做浅层应用前判断，不做主数据引用、班次规则、时区、跨天等深度业务校验。
- 本轮不自动触发 apply，也不产生 apply 任务表或审批流。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_readiness_api -v`：通过，5 个 apply-readiness API 测试通过。
- `.venv/bin/python -m unittest backend.tests.test_import_batch_list_api backend.tests.test_import_application_summary_api backend.tests.test_import_row_correction_api backend.tests.test_import_mapping_api backend.tests.test_import_upload_api -v`：通过，25 个相邻导入 API 回归测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 154 个 backend unittest。

### 2026-05-29 - IM019 字段映射模板更新与停用第一刀

#### 审计结论

- `US639/IM019/R719` 已完成字段映射模板更新与停用第一刀。
- 新增 `PATCH /api/v1/import-field-mapping-templates/{template_id}`，可更新 `template_name` 和 `field_mapping`。
- 新增 `POST /api/v1/import-field-mapping-templates/{template_id}/deactivate`，将模板软停用。
- 停用模板不再被列表、单查或 `upload-csv` 按 `template_id` 复用返回。
- 不存在或已停用模板返回稳定 `IMPORT_FIELD_MAPPING_TEMPLATE_NOT_FOUND`。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮是软停用，不做物理删除或模板版本历史。
- 本轮不做前端模板管理页；页面接入需单独 frontend Gate。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_mapping_persistence backend.tests.test_import_mapping_api backend.tests.test_import_upload_api -v`：通过，19 个模板维护和上传复用测试通过。
- `.venv/bin/python -m unittest backend.tests.test_import_batch_list_api backend.tests.test_import_application_summary_api backend.tests.test_import_row_correction_api -v`：通过，11 个相邻导入 API 回归测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 149 个 backend unittest。

### 2026-05-29 - IM018 导入批次列表与应用状态查询第一刀

#### 审计结论

- `US638/IM018/R718` 已完成导入批次列表与应用状态查询第一刀。
- 新增只读 `GET /api/v1/import-batches`。
- 列表行返回批次基础信息、成功/失败/警告计数、版本数、应用状态、应用目标、导入版本和已应用记录数。
- 支持按 `file_type`、`processing_status`、`uploaded_by` 和 `application_status` 过滤。
- 复用现有 import batch、version 和 application-summary 能力，不新增 schema/migration。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮不做分页；批次数量增长后需要单独分页/排序任务。
- 本轮应用状态是即时派生，不新增 application task 表或异步处理记录。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_batch_list_api -v`：通过，3 个导入批次列表 API 测试通过。
- `.venv/bin/python -m unittest backend.tests.test_import_application_summary_api backend.tests.test_import_row_correction_api backend.tests.test_import_upload_api backend.tests.test_import_mapping_api -v`：通过，18 个相邻导入 API 回归测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 143 个 backend unittest。

### 2026-05-29 - IM017 导入失败行修正第一刀

#### 审计结论

- `US637/IM017/R717` 已完成导入失败行修正第一刀。
- 新增 `POST /api/v1/import-batches/{batch_id}/rows/{row_number}/correct`。
- 修正 failed row 时写入 corrected `standard_fields`，将 `row_status` 改为 `success`，清空错误字段，并设置 `source_key`。
- 修正后重算 import batch 的 `success_rows`、`failed_rows`、`warning_rows` 和 `processing_status`。
- 不存在 batch、row 或修正非 failed row 时返回稳定错误码。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮为单行原地修正；未新增修正历史表或审计轨迹表。
- 本轮不自动触发 apply；修正后仍需要后续 apply API 显式应用批次。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_persistence backend.tests.test_import_row_correction_api -v`：通过，7 个失败行修正测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 140 个 backend unittest。

### 2026-05-29 - IM016 字段映射模板持久化第一刀

#### 审计结论

- `US636/IM016/R716` 已完成字段映射模板持久化第一刀。
- 新增 `import_field_mapping_templates` 表和 `20260529_0008` Alembic migration。
- 新增字段映射模板 repository，支持创建、按 id 单查、按 file_type 列表过滤。
- 新增 `POST /api/v1/import-field-mapping-templates`、`GET /api/v1/import-field-mapping-templates`、`GET /api/v1/import-field-mapping-templates/{template_id}`。
- `POST /api/v1/import-batches/upload-csv` 支持 `template_id` 复用已保存字段映射，并保留直接 `field_mapping` JSON 上传。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做模板创建、列表、单查和上传复用；未做模板更新、停用、删除、前端管理页面或批量能力。
- 本轮仍是 `text/csv` 请求体；未做 Excel/multipart、大文件、异步处理或文件存储。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_database_foundation_closeout backend.tests.test_import_mapping_persistence backend.tests.test_import_mapping_api backend.tests.test_import_upload_api -v`：通过，15 个目标和相邻导入测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 134 个 backend unittest。

### 2026-05-28 - IM015 导入批次应用结果查询摘要第一刀

#### 审计结论

- `US635/IM015/R715` 已完成导入批次应用结果查询摘要第一刀。
- 新增只读 `GET /api/v1/import-batches/{batch_id}/application-summary`。
- 返回 `batch_id`、`file_type`、`application_status`、`application_target`、`import_version_id` 和 `applied_record_count`。
- 对 `master_data`、`personnel_schedule`、`demand_forecast`、`login_log`、`status_log` 复用现有 repository 判断已应用状态。
- 查询不存在的 batch 返回 `IMPORT_BATCH_NOT_FOUND`。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做只读摘要，不新增应用状态表或幂等任务表。
- `applied_record_count` 基于现有落库结果可判断的记录计数；如果后续引入自定义 application target 或异步任务，需要单独 schema 任务补充更精确的运行记录。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_application_summary_api -v`：通过，4 个 application-summary API 测试通过。
- `.venv/bin/python -m unittest backend.tests.test_master_data_import_api backend.tests.test_personnel_schedule_import_api backend.tests.test_forecast_import_api backend.tests.test_actual_log_import_api backend.tests.test_import_upload_api -v`：通过，19 个相邻导入 API 回归测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 124 个 backend unittest。

### 2026-05-28 - IM014 实际日志导入应用幂等重跑保护第一刀

#### 审计结论

- `US634/IM014/R714` 已完成实际日志导入应用幂等重跑保护第一刀。
- `POST /api/v1/import-batches/{batch_id}/apply-actual-logs` 首次应用返回 `applied_status=applied`。
- 同一 `login_log` 或 `status_log` batch 已应用后再次调用返回 `applied_status=already_applied`。
- 重复调用不再执行 login event、status dictionary 或 status interval 写入。
- 非 actual log 批次、缺失字段、导入版本、时区和主数据引用校验保留。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只保护已有 DB006 落库痕迹可判断的 login/status apply；未新增幂等表或批处理任务状态。
- 本轮不新增 schema/migration；纯 status dictionary-only 批次没有 import_version 落库痕迹，后续如要精确追踪需单独 schema 任务。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产状态码规则、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_actual_log_import_api backend.tests.test_actual_log_import_service -v`：通过，13 个 actual log import apply 测试通过，其中 3 个覆盖重复请求幂等返回和 no-write guard。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 120 个 backend unittest。

### 2026-05-28 - IM013 需求预测导入应用幂等重跑保护第一刀

#### 审计结论

- `US633/IM013/R713` 已完成需求预测导入应用幂等重跑保护第一刀。
- `POST /api/v1/import-batches/{batch_id}/apply-forecast` 首次应用返回 `applied_status=applied`。
- 同一 `demand_forecast` batch 已应用后再次调用返回 `applied_status=already_applied`。
- 重复调用不再执行 forecast version、forecast interval 或 forecast change 写入。
- 非 `demand_forecast` 批次、缺失字段、导入版本和主数据引用校验保留。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只保护 `demand_forecast` apply，不等于 `login_log` 或 `status_log` apply 已具备幂等。
- 本轮不新增 schema/migration；后续实际日志导入类型需要按导入版本和业务键单独处理。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_forecast_import_api backend.tests.test_forecast_import_service -v`：通过，11 个需求预测 import apply 测试通过，其中 2 个覆盖重复请求幂等返回和 no-write guard。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 117 个 backend unittest。

### 2026-05-28 - IM012 人员排班导入应用幂等重跑保护第一刀

#### 审计结论

- `US632/IM012/R712` 已完成人员排班导入应用幂等重跑保护第一刀。
- `POST /api/v1/import-batches/{batch_id}/apply-personnel-schedule` 首次应用返回 `applied_status=applied`。
- 同一 `personnel_schedule` batch 已应用后再次调用返回 `applied_status=already_applied`。
- 重复调用不再执行 schedule version、shift type、schedule detail 或 0.5h interval 写入。
- 非 `personnel_schedule` 批次、缺失字段、导入版本和主数据引用校验保留。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只保护 `personnel_schedule` apply，不等于 `demand_forecast`、`login_log` 或 `status_log` apply 已具备幂等。
- 本轮不新增 schema/migration；后续其他导入类型需要按版本、明细主键和业务键逐类处理。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_personnel_schedule_import_api backend.tests.test_personnel_schedule_import_service -v`：通过，9 个人员排班 import apply 测试通过，其中 2 个覆盖重复请求幂等返回和 no-write guard。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 115 个 backend unittest。

### 2026-05-28 - IM011 主数据导入应用幂等重跑保护第一刀

#### 审计结论

- `US631/IM011/R711` 已完成主数据导入应用幂等重跑保护第一刀。
- `POST /api/v1/import-batches/{batch_id}/apply-master-data` 首次应用返回 `applied_status=applied`。
- 同一 `master_data` batch 已应用后再次调用返回 `applied_status=already_applied`。
- 重复调用不再执行 master data snapshot 写入。
- 非 `master_data` 批次、缺失字段和引用校验保留。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只保护 `master_data` apply，不等于 `personnel_schedule`、`demand_forecast`、`login_log` 或 `status_log` apply 已具备幂等。
- 本轮不新增 schema/migration；后续其他导入类型需要按版本、明细主键和业务键逐类处理。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_master_data_import_api backend.tests.test_master_data_import_service -v`：通过，9 个 master_data import apply 测试通过，其中 2 个覆盖重复请求幂等返回和 no-write guard。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 113 个 backend unittest。

### 2026-05-28 - IM010 计算与复核写入幂等重跑保护第一刀

#### 审计结论

- `US630/IM010/R710` 已完成计算与复核写入幂等重跑保护第一刀。
- `POST /api/v1/comparison-runs/calculate` 在 `run_id` 已存在时返回已有 `ComparisonRunDetail`，不重复计算写入。
- `POST /api/v1/review-cases/write-closure` 在 `case_id` 已存在时返回已有 `ReviewCaseDetail`，不重复写入证据、结论或关闭记录。
- 原有缺失引用和非法请求校验保留。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只保护天然业务键明确的 calculate 和 write-closure，不等于导入 apply、模板保存、异步任务、任务队列或批量操作已具备幂等。
- 本轮不新增 schema/migration；后续导入 apply 重跑需要按 master data、personnel schedule、forecast、actual logs 的版本/业务键逐类处理。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_comparison_calculation_api backend.tests.test_review_closure_api -v`：通过，6 个 API 测试通过，其中 2 个覆盖重复请求幂等返回。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 111 个 backend unittest。

### 2026-05-28 - IM009 持久化结果列表筛选 API 第一刀

#### 审计结论

- `US629/IM009/R709` 已完成持久化结果列表筛选 API 第一刀。
- 新增 `/api/v1/comparison-runs`，返回 DB007 `ComparisonRunRecord` 轻量列表。
- comparison runs 支持 `comparison_type`、`status`、`business_date` 筛选。
- 新增 `/api/v1/review-cases`，返回 DB008 `ReviewCaseRecord` 轻量列表。
- review cases 支持 `business_date`、`owner_id`、`status`、`severity`、`source_result_type` 筛选。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做只读 summary 列表，不等于分页、排序参数、全文搜索、模板持久化、前端接入、权限、审批、导出或批量处理已完成。
- 本轮不新增 schema/migration；后续如需大列表分页、索引优化、查询审计或跨对象聚合，需要单独任务。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_result_list_query_api -v`：通过，6 个持久化结果列表筛选测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 109 个 backend unittest。

### 2026-05-28 - IM008 持久化结果查询 API 收口

#### 审计结论

- `US628/IM008/R708` 已完成持久化结果查询 API 收口。
- 新增 `/api/v1/comparison-runs/{run_id}`，按 run_id 返回 DB007 `ComparisonRunDetail`。
- 新增 `/api/v1/review-cases/{case_id}`，按 case_id 返回 DB008 `ReviewCaseDetail`。
- 查询不存在时返回 404，并使用稳定错误码 `COMPARISON_RUN_NOT_FOUND` 或 `REVIEW_CASE_NOT_FOUND`。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做现有 DB007/DB008 repository 的只读 API，不等于模板持久化、列表筛选、前端接入、权限、审批、导出或批量处理已完成。
- 本轮不新增 schema/migration；后续如需查询分页、列表汇总、幂等重跑查询、模板保存或审计搜索，需要单独任务。
- Auth、权限、供应商隔离、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_result_query_api -v`：通过，6 个持久化结果查询 API 测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 103 个 backend unittest。

### 2026-05-28 - IM007 复核闭环写入到 DB008 repository

#### 审计结论

- `US627/IM007/R707` 已完成本地复核闭环写入第一刀。
- 新增 `/api/v1/review-cases/write-closure`，接收 case、可选 evidence、可选 conclusion、可选 closure。
- 写入顺序为 case -> evidence -> conclusion -> closure，并返回完整 `ReviewCaseDetail`。
- case 来源必须引用 DB007 `forecast_schedule` 或 `schedule_actual` result。
- 应用后复用 DB008 来源结果、业务日、case 存在性和重复关闭校验。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做本地写入闭环，不等于审批流、权限、批量关闭、导出报表、外部证据服务或供应商隔离已完成。
- 本轮不新增 schema/migration；后续如需幂等策略、状态流转约束、修改/撤销结论或复核任务分派，需要单独任务。
- Auth、权限、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_review_closure_service backend.tests.test_review_closure_api -v`：通过，4 个复核闭环写入测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 97 个 backend unittest。

### 2026-05-28 - IM006 对比计算触发到 DB007 repository

#### 审计结论

- `US626/IM006/R706` 已完成本地对比计算触发第一刀。
- 新增 `/api/v1/comparison-runs/calculate`，接收 comparison_type 和来源版本。
- `forecast_vs_schedule` 基于 DB005 forecast intervals 与 DB004 schedule intervals 聚合生成 gap 结果。
- `schedule_vs_actual` 基于 DB004 schedule intervals 与 DB006 productive status intervals 生成 matched/late 结果。
- 计算结果写入 DB007 comparison run/results，并复用 DB007 来源版本和结果维度校验。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只做本地可复跑计算触发，不等于生产状态码、最终业务公式、调度任务、外部 CORN/HR/WFM 接入或异常复核闭环已完成。
- 本轮不新增 schema/migration；后续如需幂等重跑、任务队列、计算审计表或异步调度，需要单独任务。
- Auth、权限、审批、导出、批量、自动排班、生产公式定版、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_comparison_calculation_service backend.tests.test_comparison_calculation_api -v`：通过，5 个对比计算触发测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 93 个 backend unittest。

### 2026-05-28 - IM005 登录/状态日志导入应用到 DB006 repository

#### 审计结论

- `US625/IM005/R705` 已完成登录/状态日志导入应用第一刀。
- 新增 `/api/v1/import-batches/{batch_id}/apply-actual-logs`，按 batch_id 读取已持久化导入批次。
- 仅允许 `file_type=login_log` 或 `file_type=status_log` 的批次应用到实际日志。
- `login_log` 成功行写入 login/logout events。
- `status_log` 成功行可按 `record_type` 写入 status dictionary 或 status intervals。
- 应用后复用 DB006 的 import version、employee、状态字典、跨天切分、业务日和时区校验。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只应用已上传的 login_log/status_log 成功行，不等于真实 CORN/HR/WFM 接入、状态码生产规则、排班 vs 实际对比任务或异常闭环已完成。
- 本轮不新增 schema/migration；后续如需导入应用审计表、重跑策略或幂等策略，需要单独任务。
- Auth、权限、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_actual_log_import_service backend.tests.test_actual_log_import_api -v`：通过，10 个登录/状态日志导入应用测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 88 个 backend unittest。

### 2026-05-28 - IM004 需求预测导入应用到 DB005 repository

#### 审计结论

- `US624/IM004/R704` 已完成需求预测导入应用第一刀。
- 新增 `/api/v1/import-batches/{batch_id}/apply-forecast`，按 batch_id 读取已持久化导入批次。
- 仅允许 `file_type=demand_forecast` 的批次应用到需求预测。
- 成功行写入 forecast intervals，并生成 forecast version。
- 支持 `compared_from_version_id` 和 `change_reason` 形成版本变更记录。
- 应用后复用 DB005 的 import version 校验、30 分钟区间校验、主数据引用校验、冻结和业务日期校验。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只应用已上传的 demand_forecast 成功行，不等于预测算法、预测 UI、版本审批或预测发布流程已完成。
- 本轮不新增 schema/migration；后续如需导入应用审计表、重跑策略或幂等策略，需要单独任务。
- 外部 CORN/HR/WFM 接入、auth、权限、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_forecast_import_service backend.tests.test_forecast_import_api -v`：通过，9 个需求预测导入应用测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 78 个 backend unittest。

### 2026-05-28 - IM003 人员排班导入应用到 DB004 repository

#### 审计结论

- `US623/IM003/R703` 已完成人员排班导入应用第一刀。
- 新增 `/api/v1/import-batches/{batch_id}/apply-personnel-schedule`，按 batch_id 读取已持久化导入批次。
- 仅允许 `file_type=personnel_schedule` 的批次应用到人员排班。
- 成功行按 `record_type` 写入 shift types 和 personnel schedule details。
- 应用后复用 DB004 的 import version 校验、主数据引用校验、人员绑定校验和 0.5h 展开。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只应用已上传的 personnel_schedule 成功行，不等于已完成排班维护 UI、发布/冻结流程、批量调班或排班审批。
- 本轮不新增 schema/migration；后续如需导入应用审计表、重跑策略或幂等策略，需要单独任务。
- 外部 CORN/HR/WFM 接入、auth、权限、审批、导出、批量、自动排班、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_personnel_schedule_import_service backend.tests.test_personnel_schedule_import_api -v`：通过，7 个人员排班导入应用测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 69 个 backend unittest。

### 2026-05-28 - IM002 主数据导入应用到 DB003 repository

#### 审计结论

- `US622/IM002/R702` 已完成主数据导入应用第一刀。
- 新增 `/api/v1/import-batches/{batch_id}/apply-master-data`，按 batch_id 读取已持久化导入批次。
- 仅允许 `file_type=master_data` 的批次应用到主数据。
- 成功行按 `record_type` 写入 suppliers、workplaces、projects、skills、employees 和 bindings。
- 绑定关系继续复用 DB003 repository 的引用存在性、冻结状态和有效期校验。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮只应用已上传的 master_data 成功行，不等于已完成完整主数据 CRUD UI、冻结/解冻界面或供应商隔离权限。
- 本轮不新增 schema/migration；后续如需导入应用审计表、重跑策略或幂等策略，需要单独任务。
- 外部 CORN/HR/WFM 接入、auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_master_data_import_service backend.tests.test_master_data_import_api -v`：通过，7 个主数据导入应用测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 62 个 backend unittest。

### 2026-05-28 - IM001 真实导入中心 CSV 上传 API 第一刀

#### 审计结论

- `US621/IM001/R701` 已完成第一条真实导入中心 CSV 上传 API 纵切。
- 新增 `/api/v1/import-batches/upload-csv`，通过 `text/csv` 原始请求体接收 CSV 内容和导入元数据。
- 新增 CSV 解析服务，支持字段映射、标准字段与原始列保留、缺少 `source_key` 的行级失败记录。
- 上传完成后通过现有 import persistence foundation 生成 import batch、row results、failed rows 和默认 import version。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- 本轮刻意不做 multipart 和 Excel，因为当前项目没有 `python-multipart`，新增依赖需要单独确认。
- 本轮只把 CSV 内容进入导入批次和版本，不等于主数据、排班、预测、登录日志或状态日志已经被应用到各自业务 repository。
- 外部 CORN/HR/WFM 接入、auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_upload_service backend.tests.test_import_upload_api -v`：通过，6 个导入上传测试通过。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，55 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 55 个 backend unittest。

### 2026-05-28 - Q127 数据库基础 QA 收口

#### 审计结论

- `US620/Q127/R697-R700` 已完成数据库基础 QA 收口。
- Alembic head 已验证能创建 DB002-DB008 全部基础表。
- 最小端到端持久化链路已验证可从导入/版本记录走到复核关闭记录。
- QA 结论已记录在 `docs/quality/DATABASE_FOUNDATION_QA_2026-05-28.md`。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- Q127 只验证本地 SQLite 上的迁移和 repository 闭环，不等于生产 PostgreSQL 部署、外部系统接入或权限审批能力已完成。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_database_foundation_closeout -v`：通过，2 个 QA closeout 测试通过。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，49 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 49 个 backend unittest。

### 2026-05-28 - DB008 复核闭环记录持久化基础

#### 审计结论

- `US619/DB008/R693-R696` 已完成复核闭环记录持久化基础。
- 新增 review SQLAlchemy repository 和 Alembic migration，覆盖 review cases、review evidence、review conclusions 和 review closures。
- 复核 case 会校验来源 comparison result 类型、来源 result id 存在性和业务日一致性。
- closure 对同一 case 只允许关闭一次。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- DB008 只提供复核记录落库，不等于审批流、权限、批量关闭、导出、真实外部证据服务或真实外部接口已完成。
- 默认运行仍使用本地 SQLite fallback；生产 PostgreSQL 部署、凭据和真实外部系统接入仍需后续任务确认。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_review_persistence -v`：通过，6 个 DB008 持久化测试通过。
- `BPO_DATABASE_URL=sqlite+pysqlite:///<tmp>/db008.db .venv/bin/alembic -c alembic.ini upgrade head`：通过，生成 import、master data、personnel schedule、forecast、actual log、comparison result 和 review closure 表。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，47 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 47 个 backend unittest。

### 2026-05-28 - DB007 对比结果持久化基础

#### 审计结论

- `US618/DB007/R689-R692` 已完成对比结果持久化基础。
- 新增 comparison SQLAlchemy repository 和 Alembic migration，覆盖 comparison runs、forecast-vs-schedule results 和 schedule-vs-actual results。
- 对比结果会校验 forecast version、schedule version、actual status import version、来源记录版本归属和结果维度一致性。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- DB007 只提供对比结果落库，不等于真实对比计算任务、异常生成、复核闭环或真实 CORN/HR/WFM 接入已完成。
- 默认运行仍使用本地 SQLite fallback；生产 PostgreSQL 部署、凭据和真实外部系统接入仍需后续任务确认。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_comparison_persistence -v`：通过，7 个 DB007 持久化测试通过。
- `BPO_DATABASE_URL=sqlite+pysqlite:///<tmp>/db007.db .venv/bin/alembic -c alembic.ini upgrade head`：通过，生成 import、master data、personnel schedule、forecast、actual log 和 comparison result 表。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，41 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 41 个 backend unittest。

### 2026-05-28 - DB006 登录/状态日志持久化基础

#### 审计结论

- `US617/DB006/R685-R688` 已完成登录/状态日志持久化基础。
- 新增 actual log SQLAlchemy repository 和 Alembic migration，覆盖 actual login events、actual status dictionary 和 actual status intervals。
- 状态区间会校验 `status_log` import version、employee、状态字典和 Asia/Shanghai 时区，并按业务日切分跨天区间。
- login event 会校验 `login_log` import version、employee 和 Asia/Shanghai 时区。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- DB006 只提供实际登录/状态日志落库，不等于排班 vs 实际对比、异常生成、复核闭环或真实 CORN 接入已完成。
- 默认运行仍使用本地 SQLite fallback；生产 PostgreSQL 部署、凭据和真实外部系统接入仍需后续任务确认。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_actual_log_persistence -v`：通过，6 个 DB006 持久化测试通过。
- `BPO_DATABASE_URL=sqlite+pysqlite:///<tmp>/db006.db .venv/bin/alembic -c alembic.ini upgrade head`：通过，生成 import、master data、personnel schedule、forecast 和 actual log 表。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，34 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 34 个 backend unittest。

### 2026-05-28 - DB005 需求预测持久化基础

#### 审计结论

- `US616/DB005/R681-R684` 已完成需求预测持久化基础。
- 新增 forecast SQLAlchemy repository 和 Alembic migration，覆盖 forecast versions、forecast interval rows 和 forecast version changes。
- 预测行会校验 import version、workplace、project 和 skill 引用，并限定预测时段为 0.5h。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- DB005 只提供需求预测落库和版本变更记录，不等于预测上传解析、预测算法、排班对比、登录状态对比或复核闭环已完成。
- 默认运行仍使用本地 SQLite fallback；生产 PostgreSQL 部署、凭据和真实外部系统接入仍需后续任务确认。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_forecast_persistence -v`：通过，3 个 DB005 持久化测试通过。
- `BPO_DATABASE_URL=sqlite+pysqlite:///<tmp>/db005.db .venv/bin/alembic -c alembic.ini upgrade head`：通过，生成 import、master data、personnel schedule 和 forecast 表。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，28 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 28 个 backend unittest。

### 2026-05-28 - DB004 人员级排班持久化基础

#### 审计结论

- `US615/DB004/R677-R680` 已完成人员级排班持久化基础。
- 新增 personnel schedule SQLAlchemy repository 和 Alembic migration，覆盖 schedule versions、shift types、personnel schedule details 和 half-hour intervals。
- 排班明细会校验 import version、employee、workplace、project、skill、employee binding 和 shift type 引用，并将排班时段展开为 0.5h 区间。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- DB004 只提供人员级排班落库和 0.5h 展开，不等于排班维护 UI、发布/冻结流程、预测对比、登录状态对比或真实导入流程已完成。
- 默认运行仍使用本地 SQLite fallback；生产 PostgreSQL 部署、凭据和真实外部系统接入仍需后续任务确认。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_personnel_schedule_persistence -v`：通过，3 个 DB004 持久化测试通过。
- `BPO_DATABASE_URL=sqlite+pysqlite:///<tmp>/db004.db .venv/bin/alembic -c alembic.ini upgrade head`：通过，生成 import persistence、master data 和 personnel schedule 表。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，25 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 25 个 backend unittest。

### 2026-05-28 - DB003 主数据持久化基础

#### 审计结论

- `US614/DB003/R673-R676` 已完成主数据持久化基础。
- 新增 master data SQLAlchemy repository 和 Alembic migration，覆盖 employees、suppliers、workplaces、projects、skills 和 employee bindings。
- 绑定关系会校验 employee/supplier/workplace/project/skill 引用存在、状态为 active、未 frozen，并处于有效期范围内。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- DB003 只提供主数据落库和引用校验，不等于主数据 CRUD 管理界面、真实上传导入、排班生产流或预测/日志处理已完成。
- 默认运行仍使用本地 SQLite fallback；生产 PostgreSQL 部署、凭据和真实外部系统接入仍需后续任务确认。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_master_data_persistence -v`：通过，2 个 DB003 持久化测试通过。
- `BPO_DATABASE_URL=sqlite+pysqlite:///<tmp>/db003.db .venv/bin/alembic -c alembic.ini upgrade head`：通过，生成 import persistence 和 master data 表。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，22 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 22 个 backend unittest。

### 2026-05-28 - DB002 导入持久化基础

#### 审计结论

- `US613/DB002/R669-R672` 已完成第一段数据库实现：导入批次、导入行结果、失败行明细和导入生成版本记录。
- 新增 SQLAlchemy repository、Alembic migration、FastAPI persistence endpoints 和 backend 持久化测试。
- 测试覆盖同一 SQLite 测试库在新 repository 实例中仍能读取已写入的批次、失败行错误原因和版本记录。
- current queue 和 active tasks 已清空，done history 不写入 current 文件。

#### 风险

- DB002 只提供导入来源和版本基础，不等于真实文件上传、字段映射、主数据、排班、预测、登录状态、对比计算或复核闭环已生产化。
- 默认运行仍使用本地 SQLite fallback；生产 PostgreSQL 连接、部署环境、凭据管理和真实外部数据接入仍需后续任务和环境确认。
- Auth、权限、审批、导出、批量、生产公式、结算和收费因子仍明确禁止混入。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_import_persistence -v`：通过，1 个 DB002 持久化测试通过。
- `BPO_DATABASE_URL=sqlite+pysqlite:///<tmp>/imports.db .venv/bin/alembic -c alembic.ini upgrade head`：通过，生成 `import_batches`、`import_row_results`、`import_versions`。
- `.venv/bin/python -m unittest discover -s backend/tests -v`：通过，20 个 backend unittest 通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、state-check 回归、frontend lint/typecheck/build 和 20 个 backend unittest。

### 2026-05-28 - DB002 前置确认卡口

#### 审计结论

- `US613/DB002/R669-R672` 已写入 current queue 和 active tasks，但状态为 `blocked`。
- 阻塞项是数据库引擎、依赖/package 变更授权、ORM/migration 工具和测试数据库方案未确认。
- DB002 的实现范围已限定为导入批次、导入行结果、失败行明细和导入生成版本记录。

#### 风险

- 在未解除阻塞前启动实现会违反数据库 Gate 和 package/lockfile stop condition。
- 本轮不创建数据库连接、ORM、repository、migration、schema、生产持久化配置或新依赖。

#### 验证

- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh`：通过，DB002 保持 blocked。

### 2026-05-28 - DB001 数据库 Gate 规划

#### 审计结论

- `US612/DB001/R665-R668` 已完成数据库 Gate 规划。
- 本轮新增 `database-planning` 与 `database-persistence` workflow 规则，明确 DB001 只做规划，DB002 之后才可能进入实现。
- 数据库 Gate 规划明确首批落库应先做导入批次、成功/失败行和版本记录，再推进主数据、人员排班、预测、登录状态、对比结果和复核记录。

#### 风险

- DB001 不包含数据库实现，不能被解读为已具备生产持久化。
- DB002 开始前仍需 PM 明确数据库引擎、依赖/package 修改授权、migration 工具和测试数据库方案。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check` 和最终 `bash scripts/check.sh`：通过。首次 full check 因 `.next` 跨分支生成缓存引用旧页面失败；清理 `.next` 后复跑通过。

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

## Historical Audit Snapshots

### 2026-06-01 - IM035 导入中心接入批次筛选

#### 审计结论

- `IM035/US655` 已在 `/data-quality` 接入批次列表增加关键词、文件类型、处理状态和应用状态筛选。
- 模型层新增 `filterImportBatches`，覆盖上传历史的本地筛选和无匹配结果。
- 页面展示匹配数量、可读空态，并在点击批次行时保留当前筛选条件；不新增后端查询参数、审批、导出、批量、权限或生产动作。

#### 风险

- 当前是前端本地筛选，不是服务端分页查询、权限隔离或生产审计筛选。
- 后续若要做服务端查询、导出、批量处理或权限隔离，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `filterImportBatches` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，20 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：当前 Codex in-app browser 路由不可用，未能通过该通道执行；已用本地 HTTP smoke 补充验证。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。
- 本地 HTTP smoke：`http://127.0.0.1:3023/data-quality?batchQuery=smoke&batchFileType=personnel_schedule&batchProcessingStatus=completed_with_errors&batchApplicationStatus=not_applied` 和 `http://127.0.0.1:3023/data-quality?batchQuery=__missing_im035__` 均返回页面，关键文本包含 `关键词`、`文件类型`、`处理状态`、`应用状态`、`0/4 批匹配`、`没有匹配批次` 和空态说明。

### 2026-05-31 - IM034 导入中心上传结果批次入口

#### 审计结论

- `IM034/US654` 已在 `/data-quality` 上传区增加上传结果导航提示。
- 模型层新增 `summarizeImportUploadResultGuidance`，覆盖上传成功、API 失败、缺少必填字段和无上传状态路径。
- 页面通过 query 参数展示成功/失败结果、批次入口和下一步复核路径，不新增 apply 写按钮，不触发后端写入、审批、导出、批量、权限或生产动作。

#### 风险

- 当前是上传结果后的前端导航提示，不是异步上传队列、文件存储、批量重试或生产审计流。
- 后续若要做真实批量处理、上传队列、权限隔离或导出，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportUploadResultGuidance` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，19 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`/data-quality?upload=success&batch=BATCH-IM026-SMOKE-004` 可见 `CSV 上传成功` 和 `查看批次`；`/data-quality?upload=failed&reason=api_409&batch=BATCH-IM026-SMOKE-004` 可见 `CSV 上传失败`、`接口返回 409` 和 `回看批次`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM043 数据质量批次详情页拆分

#### 审计结论

- `IM043/US663` 已把具体查看和处理从 `/data-quality` 拆到 `/data-quality/import-batches/[batchId]`。
- `/data-quality` 现在只保留批次概览、筛选、批次列表和选中批次状态摘要，并提供“处理/进入批次处理页”入口。
- 批次详情页集中承载批次明细、失败行修正、结果追踪、导入与模板，并保留修正成功/失败 query 反馈。

#### 风险

- 当前仍是前端信息架构拆分和已有 API 读取，不是新增业务写入、审批、导出、批量或权限能力。
- 后续若要做真实 apply 按钮、批量处理、权限隔离或外部集成，仍需单独 Gate。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 曾因缺少 `buildImportBatchProcessingHref` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，28 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快速检查：触达的 data-quality/import-center 文件未发现 `space-x/space-y`、硬编码色阶或任意半径类。
- in-app browser smoke：`/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 不再包含 `分层详情`；`/data-quality/import-batches/BATCH-IM026-SMOKE-004?correction=success&row=1` 包含 `批次处理详情`、`分层详情`、`批次明细`、`失败行修正`、`结果追踪`、`导入与模板` 和 `第 1 行已修正`；browser console error 为空。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM042 数据质量页下游结果列表可见性

#### 审计结论

- `IM042/US662` 已在 `/data-quality` 分层详情新增 `结果追踪` Tab。
- 页面按选中批次 `business_date_from` 读取已有 `/api/v1/comparison-runs` 和 `/api/v1/review-cases` 列表，并展示只读摘要、状态、业务日、来源版本、owner 与 detail 链接口径。
- 无下游结果或 API 异常时展示清晰空态/阻塞态；本轮不新增写入按钮、不新增后端能力。

#### 风险

- 当前仍是只读结果可见性，不是对比计算触发、复核写入或关闭异常。
- 后续若要做 apply 写入、批量处理、审批、导出、权限、外部集成或生产规则，仍需单独 Gate。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 曾因缺少 `buildImportComparisonRunsUrl` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，27 个 import-center model 测试通过。
- in-app browser smoke：`http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 可见 `批次明细`、`失败行修正`、`结果追踪`、`导入与模板` 四个详情 Tab；点击 `结果追踪` 后可见业务日、对比结果区和复核案例区；浏览器 console error 为空。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM041A 数据质量页信息架构重构

#### 审计结论

- `IM041A/US661` 已把 `/data-quality` 从单页纵向堆叠重构为顶部概览、接入批次工作台、选中批次状态检查器和分层详情 Tabs。
- `ImportCenterApiPanel` 不再承载全部业务 UI，概览、批次列表、状态检查器和详情 Tabs 已拆成独立业务组件。
- 批次明细、失败行修正、导入与模板被收纳进分层详情；本轮只调整展示层级和组件边界，不新增写入能力。
- 浏览器检查发现 flex column 下工作台区域曾被压缩到 0 高度，已改为 grid auto rows 并复验通过；PM 截图继续暴露 Tabs 默认横向 flex 导致详情内容挤到批次表右侧，已在详情 Tabs 显式改为 `flex-col` 并加分区边界。

#### 风险

- 当前仍是导入中心前端信息架构整理，不是新的导入处理能力。
- 后续若要新增 apply 写入、审批、导出、批量、权限、外部集成或生产规则，仍需单独 Gate。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportPageHierarchy` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，26 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- shadcn 快速检查：触达的 import-center 前端文件未发现 `space-x/space-y` 或硬编码灰阶色类。
- page smoke：`http://127.0.0.1:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 返回 200，并包含 `接入批次工作台`、`选中批次状态检查器`、`分层详情`、`导入与模板`。
- in-app browser smoke：同一页面可见新结构；布局矩形显示 `import-batch-workspace` 高度正常，`import-detail-workspace` 位于工作台之后；详情 Tabs computed `flex-direction` 为 `column`，活动内容与 TabsList 左侧对齐，不再挤到右侧覆盖批次表。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-05-31 - IM033 导入中心异常态处理建议

#### 审计结论

- `IM033/US653` 已在 `/data-quality` 增加“异常态处理建议”。
- 模型层新增 `summarizeImportExceptionGuidance`，覆盖批次 API 异常、准备度 API 异常、模板 API 异常、暂无批次、暂无模板和关键异常态已收敛。
- 页面只读展示前置异常处理建议，不新增 apply 写按钮，不触发后端写入、审批、导出、批量、权限或生产动作。

#### 风险

- 当前仍是前端提示和本地 API 状态汇总，不是生产级导入调度、重试队列或自动修复流程。
- 后续若要做真实上传重试、批量处理、权限隔离或数据库级审计，需要另开受控任务。

#### 验证

- TDD 红灯：`/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportExceptionGuidance` export 失败。
- `/opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，18 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 可见 `异常态处理建议` 和 `关键异常态已收敛`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-05-31 - IM032 导入中心应用前行动建议

#### 审计结论

- `IM032/US652` 已在 `/data-quality` 应用准备度侧栏增加“应用前行动建议”。
- 模型层新增 `summarizeImportApplyActionGuidance`，覆盖可复核、失败行阻塞、行级必填字段阻塞、已应用和准备度 API 异常路径。
- 页面仅展示下一步建议，不新增 apply 写按钮，不触发后端写入、审批、导出、批量、权限或生产动作。

#### 风险

- 当前仍是应用前判断和提示，不是应用写入入口。
- 后续若要真正应用导入批次，需要另开受控任务，明确权限、幂等、审计和回滚边界。

#### 验证

- TDD 红灯：`node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportApplyActionGuidance` export 失败。
- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，17 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 可见 `应用前行动建议`、当前批次号和应用前下一步口径。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-05-31 - IM031 导入中心上传前模板适配提示

#### 审计结论

- `IM031/US651` 已在 `/data-quality` 上传区增加模板适配提示，按文件类型展示启用模板数、推荐说明、映射字段数量和手填 JSON 兜底。
- 模型层新增 `summarizeImportTemplateFitHint`，覆盖推荐启用模板、无启用模板和模板 API 异常三种路径。
- 页面 smoke 发现 `/data-quality/loading.tsx` 会让 in-app browser 停在骨架屏，已移除该 route-level loading fallback，让主内容直接可见。
- 本轮未新增依赖、未修改 package/lockfile，未触碰后端、schema/migration、模板 CRUD、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。

#### 风险

- 当前仍是上传前提示和可见性增强，不是模板维护流程，也不是上传后的真实 apply 写操作。
- 文件类型和模板选择仍由用户确认，后续若要做强校验或自动应用，需要单独任务定义。

#### 验证

- TDD 红灯：`node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportTemplateFitHint` export 失败。
- `node --experimental-strip-types --test scripts/tests/import-center-model.test.mjs`：通过，16 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` 可见 `CSV 导入`、`模板适配提示`、`手填字段映射 JSON` 和当前批次号。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、frontend lint、typecheck、Next build 和 160 个后端 unittest。

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
