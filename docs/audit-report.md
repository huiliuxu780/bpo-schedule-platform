# Audit Report

本文件记录 Harness 闭环审计结果、风险、阻塞和建议。

## Current Audit

### 2026-06-24 - IM239 复核案例阶段 Seed Matrix

#### 审计结论

- `IM239/US858/R938` 已补齐 review-case live runtime smoke 前需要的本地 seed 阶段矩阵。
- `seed_review_case_demo()` 保持既有 `CASE-QUERY-001` 行为；新增 `seed_review_case_stage_matrix()` 显式创建四个目标案例。
- 四个案例覆盖：`CASE-SEED-ME-001` 缺证据、`CASE-SEED-MC-001` 缺结论、`CASE-QUERY-001` 可关闭、`CASE-SEED-CL-001` closure-backed 已关闭。
- closed 阶段由 closure 记录支撑，`review_cases.status` 保持既有 open 语义；前端 processing-stage 推导已按 `status === "closed" || closure !== null` 处理。
- 本轮未启动 runtime，未新增 API route，未修改 persistence/service/main route、schema/migration、前端、依赖、package/lockfile、权限、审批、导出、批量、公式、结算或收费因子。

#### 风险

- IM239 只提供 seed 数据基线，不代表 `/data-quality/review-cases` live runtime smoke 已通过。
- 后续 smoke 仍需 PM 明确允许使用 backend `127.0.0.1:8000` 和 frontend `127.0.0.1:3000`。
- 如果后续希望用 `python -m backend.app.review_demo_seed` 直接创建四阶段矩阵，需要另行确认 CLI 行为；当前完整矩阵通过显式 `seed_review_case_stage_matrix()` 调用生成。

#### 验证

- Focused seed unittest：`backend_python=$(bash scripts/verify-backend-runtime.sh --print-path); "$backend_python" -m unittest backend.tests.test_review_demo_seed -v` 通过，8 tests OK。
- `bash scripts/check-state.sh --strict`：通过。
- `bash scripts/check-state.sh --repair-scope`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、433 个 Node script subtests（432 pass、1 skip）、shadcn check、lint、typecheck、Next build、backend 221 unittest OK，最终输出 `project Harness check passed`。

### 2026-06-24 - IM238 复核案例 Live Runtime 验收准备

#### 审计结论

- `IM238/US857/R937` 已作为当前唯一 ready task 入队，目标是 live runtime 验收前置准备，不是业务功能开发。
- Qoder 交回的 runtime 入口梳理已落到 `docs/design/review-case-live-runtime-acceptance-preflight.md`，覆盖 `/data-quality/review-cases`、详情页、5 个 review-case API、`CASE-QUERY-001` seed、PM 手工验收清单和自动化 smoke 候选。
- 本轮明确区分 3000-only 可完成的页面壳/错误态/model contract 检查，以及必须等待 8000 runtime 的 seeded list/detail/action deck/stage filter 验收。
- `CASE-QUERY-001` 当前 seed 是 `ready_to_close` 案例：有证据和结论，但没有 closure 记录；如需 live 验收 `missing_evidence`、`missing_conclusion` 或 `closed` 阶段，需要后续单独确认 seed 扩展或显式关闭动作。
- Packet D 已补充未来 seed extension Gate 草案：仅作为设计决策材料，不是确认任务；未来实现建议限定在 `backend/app/review_demo_seed.py` 与 `backend/tests/test_review_demo_seed.py`，且不得修改 persistence/service/main route、前端、check.sh、依赖、schema/migration 或自动启动 seed。
- Qoder 后续只能执行 bounded packets，且不得直接写 `docs/current/**` 或 `docs/registry/**`。

#### 风险

- 启动 backend 8000、执行 seed、或做 live smoke 都属于 Gate 后动作；本轮未启动服务。
- 如果直接在未合并的 PR #2 分支上验收，报告必须明确基线是 `codex/im237-harness-review-case-integration`，不是 `main`。
- 如果不扩展 seed 或执行显式关闭动作，`missing_evidence`、`missing_conclusion` 和 `closed` 阶段只能靠现有模型/contract 测试覆盖，不能声称 live seeded UI 已覆盖全部阶段。
- PM 需要在三个路径中选择：先做当前 seed 可覆盖的部分 runtime smoke；先确认 seed extension 后做完整四阶段 live acceptance；或无限期 defer seed extension 并接受 live evidence 只覆盖 `ready_to_close`。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `bash scripts/check-state.sh --repair-scope`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、433 个 Node script subtests（432 pass、1 skip）、shadcn check、lint、typecheck、Next build、backend 215 unittest OK，最终输出 `project Harness check passed`。

### 2026-06-22 - IM237 Harness 与 Review Case 集成

#### 审计结论

- `IM237` 已将 `codex/harness-state-hygiene` 与 `codex/review-case-acceptance-block` 集成到同一分支基线。
- 集成保留新 Harness 的精简 `docs/current/PROJECT_CONTEXT.md`、空队列不得猜任务规则、`check-state` current-context history guard，以及 `scripts/check.sh` 动态运行全部 `scripts/tests/*.test.mjs` 的门禁。
- 集成同时保留 IM220-IM236 产品与测试门禁链，包括 IM236 复核案例处理路径。
- 冲突只发生在 `docs/current/PROJECT_CONTEXT.md`、`docs/dev/branch-log.md`、`scripts/check.sh`，已按“新 Harness 规则优先、产品成果保留”的原则解决。
- 本轮没有新增业务能力、后端、数据库、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 风险

- 本轮是分支集成，不代表 live review-case UI/API 验收完成；真实 runtime 验收仍需要 PM 允许可达的 API/runtime 环境。
- 集成分支包含 IM220-IM236 的大量既有文件变更；后续合并时应以 `codex/im237-harness-review-case-integration` 作为统一基线，避免再分别合并两条并行分支。

#### 验证

- 冲突解决后 `bash scripts/check-state.sh --strict` 通过。
- 冲突解决后 `git diff --check` 通过。
- 冲突解决后 `bash scripts/check-state.sh --repair-scope` 通过。
- 冲突解决后 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过。
- 追踪更新后再次复跑 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 dynamic Node script tests、shadcn check、lint、typecheck、Next build、backend 215 tests OK，最终输出 `project Harness check passed`。

### 2026-06-22 - IM236 复核案例处理路径收口

#### 审计结论

- `IM236/US856` 已将复核案例列表和详情页的分散信息收成运营人员可用的处理路径。
- `/data-quality/review-cases` 新增队列处理路径，展示处理阶段分布、优先处理入口和读取/空队列状态。
- `/data-quality/review-cases/[caseId]` 总览新增单案例处理路径，展示来源、证据、结论、关闭和续办五步状态。
- 本轮明确修正了过去把 Codex 思路、Gate、PM 验收矩阵和停机条件写成页面内容的错误：页面只保留运营处理语言，项目治理语言留在规格、测试和报告中。
- 这次没有新增后端、数据库、schema/migration、依赖、package/lockfile、页面路由、审批、权限、导出、批量、生产公式、结算或收费因子。

#### 风险

- 本轮不是 live UI/API 验收；如需真实 seeded 数据渲染验收，仍需要 PM 允许可达的 `127.0.0.1:8000` review-case API runtime。
- 页面新增的是处理路径提示，不代表新增审批、转派、重开、导出、批量关闭或生产工作流能力。

#### 验证

- TDD RED：`node --test scripts/tests/import-center-review-case-acceptance-model.test.mjs` 先因新摘要函数缺失失败。
- GREEN：`node --test scripts/tests/import-center-review-case-acceptance-model.test.mjs` 通过，4/4 tests pass。
- 结构 RED：`node --test scripts/tests/product-structure-review-case-processing-path.test.mjs` 先因页面未渲染处理路径失败。
- GREEN：`node --test scripts/tests/product-structure-review-case-processing-path.test.mjs` 通过，2/2 tests pass，并确认页面源码不暴露 Gate/PM 验收/停机条件/审批/导出/批量/权限等治理语言。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、lint、typecheck、Next build、backend 215 tests OK。
- 现有 `127.0.0.1:3000` 在 3 秒内未返回；遵守 PM 指令未启动新的测试环境，因此不声称完成 browser smoke。

### 2026-06-22 - IM235 结构与主数据中等门禁继续拆分

#### 审计结论

- `IM235/US855` 已将 product-structure app-shell/master-data 与 master-data maintenance agent-list/workplace-detail 四组偏长测试门禁拆成 8 个中等粒度子门禁。
- 四个旧测试文件现在只是 import 薄入口，分别导入对应子门禁，避免默认入口空跑。
- Qoder 并行执行三组受控拆分但均返回 max-turns；Codex 审查实际 diff 后确认只保留 in-scope 测试拆分产物，并由 Codex 接入 `scripts/check.sh` 与 Harness。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增 product-structure 或 master-data maintenance 业务能力。
- IM235 分支叠在尚未合并的 IM234 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 -> IM229 -> IM230 -> IM231 -> IM232 -> IM233 -> IM234 -> IM235 顺序处理。

#### 验证

- `node --test` focused run 覆盖 4 个旧入口和 8 个新子门禁：通过，36/36 entry-plus-child tests pass；8 个子门禁单独运行通过，18/18 tests pass。
- Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、结构/主数据子门禁、lint、typecheck、Next build、backend 215 tests OK。

### 2026-06-18 - IM234 import-center 中等门禁继续拆分

#### 审计结论

- `IM234/US854` 已将 import-center review-case preview/gap、version workbench、batch apply action 三组偏长测试门禁拆成 6 个中等粒度子门禁。
- 三个旧测试文件现在只是 import 薄入口，分别导入对应子门禁，避免默认入口空跑。
- 新增门禁覆盖 review conclusion preview/evidence gap、version workbench list-filter/result-link、batch apply url-guidance/submit-feedback。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增导入中心业务能力。
- IM234 分支叠在尚未合并的 IM233 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 -> IM229 -> IM230 -> IM231 -> IM232 -> IM233 -> IM234 顺序处理。

#### 验证

- `node --test` focused run 覆盖 3 个旧入口和 6 个新子门禁：通过，22/22 entry-plus-child tests pass；6 个子门禁单独运行通过，11/11 tests pass。
- Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、import-center 子门禁、lint、typecheck、Next build、backend 215 tests OK。

### 2026-06-18 - IM233 复核案例中等门禁继续拆分

#### 审计结论

- `IM233/US853` 已将 import-center review-case workspace owner、action deck、action write 三组偏长测试门禁拆成 6 个中等粒度子门禁。
- 三个旧测试文件现在只是 import 薄入口，分别导入对应子门禁，避免默认入口空跑。
- 新增门禁覆盖 workspace-owner matrix/detail、action deck summary/feedback-navigation、action write closure/supplement。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- Qoder 本轮返回 max-turns，Codex 只复用其已完成且 in-scope 的 workspace-owner 拆分，并直接补齐 action-deck/action-write 拆分。
- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增复核案例业务能力。
- IM233 分支叠在尚未合并的 IM232 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 -> IM229 -> IM230 -> IM231 -> IM232 -> IM233 顺序处理。

#### 验证

- `node --test` focused run 覆盖 3 个旧入口和 6 个新子门禁：通过，20/20 entry-plus-child tests pass；6 个子门禁单独运行通过，10/10 tests pass。
- Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、review-case 子门禁、lint、typecheck、Next build、backend 215 tests OK。

### 2026-06-18 - IM232 中等粒度测试门禁拆分

#### 审计结论

- `IM232/US852` 已将 dashboard model、import-center batch detail、product-structure master-data detail context 三组测试门禁拆成 10 个中等粒度子门禁。
- 三个旧测试文件现在只是 import 薄入口，分别导入对应子门禁，避免默认入口空跑。
- 新增门禁覆盖 dashboard anomaly/sync-heatmap/schedule-plan/risk-unavailability、batch detail URL-row/summary/correction、master-data detail terminology/workplace-vendor/agent-reference-detail。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- dashboard model 旧入口之前不在 `scripts/check.sh` 中，本轮将拆分后的四个 dashboard 子门禁纳入默认门禁，提升覆盖但可能增加少量门禁耗时。
- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增 dashboard、导入中心或主数据业务能力。
- IM232 分支叠在尚未合并的 IM231 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 -> IM229 -> IM230 -> IM231 -> IM232 顺序处理。

#### 验证

- `node --test` focused run 覆盖 3 个旧入口和 10 个新子门禁：通过，48/48 entry-plus-child tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、dashboard/batch-detail/product-structure 子门禁、lint、typecheck、Next build、backend 215 tests OK。

### 2026-06-18 - IM231 import-center 长门禁继续子拆分

#### 审计结论

- `IM231/US851` 已将 import-center comparison、version action/comparison、result trace、exception 五个偏长测试门禁拆成 17 个小门禁。
- 五个旧测试文件现在只是薄入口，分别导入对应子门禁，避免默认入口空跑。
- 新增门禁覆盖 comparison detail/return/review-case、version candidate/direct-entry/result-context/trigger/submit-notice/run-callback/result-review、result trace navigation/list/drilldown、exception impact/trace/guidance。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- Qoder 初始产物把 comparison、result-trace、exception 三个旧入口改成 0-test 注释入口，Codex review 后已修正为 import 薄入口。
- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增导入中心业务能力。
- IM231 分支叠在尚未合并的 IM230 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 -> IM229 -> IM230 -> IM231 顺序处理。

#### 验证

- `node --test` focused run 覆盖 5 个旧入口和 17 个新子门禁：通过，36/36 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、split import-center 长门禁、lint、typecheck、Next build、backend 215 tests OK。

### 2026-06-18 - IM230 import-center 剩余大门禁子拆分

#### 审计结论

- `IM230/US850` 已将 import-center template、batch list、review-case detail 三个偏大的测试门禁拆成 9 个小门禁。
- 三个旧测试文件现在只是薄入口，分别导入对应子门禁，避免默认入口空跑。
- 新增门禁覆盖 template URL/action/fit、batch summary/filter/navigation、review-case detail context/evidence/timeline。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- Qoder 初始产物把旧入口改成 0-test 注释入口，Codex review 后已修正为 import 薄入口。
- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增导入中心业务能力。
- IM230 分支叠在尚未合并的 IM229 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 -> IM229 -> IM230 顺序处理。

#### 验证

- `node --test scripts/tests/import-center-template-model.test.mjs scripts/tests/import-center-template-url-model.test.mjs scripts/tests/import-center-template-action-model.test.mjs scripts/tests/import-center-template-fit-model.test.mjs scripts/tests/import-center-batch-list-model.test.mjs scripts/tests/import-center-batch-summary-model.test.mjs scripts/tests/import-center-batch-filter-model.test.mjs scripts/tests/import-center-batch-navigation-model.test.mjs scripts/tests/import-center-review-case-detail-model.test.mjs scripts/tests/import-center-review-case-detail-context-model.test.mjs scripts/tests/import-center-review-case-detail-evidence-model.test.mjs scripts/tests/import-center-review-case-detail-timeline-model.test.mjs`：通过，34/34 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、split import-center 子门禁、lint、typecheck、Next build、backend 215 tests OK。

### 2026-06-18 - IM229 master-data reference 门禁子拆分

#### 审计结论

- `IM229/US849` 已将偏大的 master-data reference 测试门禁拆成 3 个小门禁。
- `scripts/tests/master-data-maintenance-reference-model.test.mjs` 现在只是薄入口，导入 list、action、detail 三个子门禁。
- 新增门禁覆盖引用对象列表/入口、组织/技能/供应商维护 payload、组织/技能详情归属。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增主数据维护能力。
- IM229 分支叠在尚未合并的 IM228 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 -> IM229 顺序处理。

#### 验证

- `node --test scripts/tests/master-data-maintenance-reference-model.test.mjs scripts/tests/master-data-maintenance-reference-list-model.test.mjs scripts/tests/master-data-maintenance-reference-action-model.test.mjs scripts/tests/master-data-maintenance-reference-detail-model.test.mjs`：通过，16/16 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、master-data reference 子门禁、lint、typecheck、Next build、backend 215 tests OK。

### 2026-06-18 - IM228 master-data agent 门禁子拆分

#### 审计结论

- `IM228/US848` 已将偏大的 master-data agent 测试门禁拆成 4 个小门禁。
- `scripts/tests/master-data-maintenance-agent-model.test.mjs` 现在只是薄入口，导入 list、detail、import、action 四个子门禁。
- 新增门禁覆盖客服人员列表/筛选、人员详情服务团队上下文、客服人员导入弹窗、维护 payload 与反馈。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增主数据维护能力。
- IM228 分支叠在尚未合并的 IM227 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 -> IM228 顺序处理。

#### 验证

- `node --test scripts/tests/master-data-maintenance-agent-model.test.mjs scripts/tests/master-data-maintenance-agent-list-model.test.mjs scripts/tests/master-data-maintenance-agent-detail-model.test.mjs scripts/tests/master-data-maintenance-agent-import-model.test.mjs scripts/tests/master-data-maintenance-agent-action-model.test.mjs`：通过，16/16 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM227 import-center batch apply 门禁子拆分

#### 审计结论

- `IM227/US847` 已将偏大的 import-center batch apply 测试门禁拆成 3 个小门禁。
- `scripts/tests/import-center-batch-apply-model.test.mjs` 现在只是薄入口，导入 action、applied-result、readiness 三个子门禁。
- 新增门禁覆盖批次应用 URL/action guidance/submit feedback、applied result card、readiness issue groups。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 本轮解决的是测试文件结构和默认门禁粒度，不代表新增导入应用能力。
- IM227 分支叠在尚未合并的 IM226 分支之后；PR/merge 时需要按 IM225 -> IM226 -> IM227 顺序处理。

#### 验证

- `node --test scripts/tests/import-center-batch-apply-model.test.mjs scripts/tests/import-center-batch-apply-action-model.test.mjs scripts/tests/import-center-batch-applied-result-model.test.mjs scripts/tests/import-center-batch-readiness-model.test.mjs`：通过，12/12 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM226 product-structure 过期断言重定向与最终拆分

#### 审计结论

- `IM226/US846` 已将 IM225 后剩余的 product-structure 断言从旧 monolith 源码位置重定向到真实模块，并拆成 7 个可执行门禁。
- `scripts/tests/product-structure.test.mjs` 现在只是薄入口，导入 7 个子门禁，不再保留失败审计基线。
- 新增门禁覆盖 production wording、global shell、master-data detail context、master-data maintenance actions、master-data agent workflow、business import、result chain。
- 这次没有修改业务 UI、路由、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 本轮解决的是测试表达过期和门禁结构问题，不代表新增产品能力。
- IM226 分支叠在尚未合并的 IM225 分支之后；PR/merge 时需要按 IM225 -> IM226 顺序处理。

#### 验证

- `node --test scripts/tests/product-structure.test.mjs scripts/tests/product-structure-production-wording.test.mjs scripts/tests/product-structure-global-shell.test.mjs scripts/tests/product-structure-master-data-detail-context.test.mjs scripts/tests/product-structure-master-data-maintenance-actions.test.mjs scripts/tests/product-structure-master-data-agent-workflow.test.mjs scripts/tests/product-structure-business-import.test.mjs scripts/tests/product-structure-result-chain.test.mjs`：通过，46/46 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM225 product-structure 绿色安全子集拆分

#### 审计结论

- `IM225/US845` 已将 product-structure 中可验证为绿色的安全结构子集拆出并接入默认 `scripts/check.sh`。
- `scripts/tests/product-structure-app-shell.test.mjs` 覆盖 app-shell/global wording/page identity 结构守卫，6/6 tests pass。
- `scripts/tests/product-structure-master-data.test.mjs` 覆盖 master-data 入口、对象边界、breadcrumb 与重复标题结构守卫，6/6 tests pass。
- 原 `scripts/tests/product-structure.test.mjs` 保留 23 个非默认审计 tests，其中当前 9/23 pass、14/23 fail；失败均为拆分前已有断言偏差或需要产品/实现校准的边界，不接入默认门禁。
- 本轮不启动额外测试环境，不修改 UI、路由、数据读取、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这不是 product-structure 全量修复，只是把绿色安全子集变成默认门禁。
- 剩余 business-import、result-chain 和部分 master-data drift 断言需要单独评审；直接机械拆或接入 `scripts/check.sh` 会让默认门禁失败。

#### 验证

- `node --test scripts/tests/product-structure-app-shell.test.mjs`：通过，6/6 tests pass。
- `node --test scripts/tests/product-structure-master-data.test.mjs`：通过，6/6 tests pass。
- `node --test scripts/tests/product-structure.test.mjs`：当前 9/23 pass、14/23 fail，保留为非默认审计基线。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM224 production model gate 子拆分

#### 审计结论

- `IM224/US844` 已接管 Qoder 的 production model gate 拆分结果，并将新文件接入默认 `scripts/check.sh`。
- 原 `scripts/tests/actual-log-production-model.test.mjs` 的 10 个 tests 拆为 workbench 5 tests、detail status 2 tests、detail login 3 tests。
- 原 `scripts/tests/personnel-schedule-production-model.test.mjs` 的 10 个 tests 拆为 workbench 5 tests、detail 2 tests、reference blocker 3 tests。
- 原 `scripts/tests/demand-forecast-production-model.test.mjs` 的 11 个 tests 拆为 workbench 5 tests、detail 3 tests、change trace 3 tests。
- 旧通用 production 测试文件已完全迁出并删除；`scripts/check.sh` 已改为显式运行 9 个拆分后的 production model gates。
- product-structure 只读分析未产生文件变更；其 business-import 与 data-quality-result 分组需要产品评审后再决定是否拆分。
- 本轮不启动额外测试环境，不修改 UI、路由、数据读取、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁维护，不等同于新增 actual-log、personnel-schedule、demand-forecast 生产处理能力。
- `product-structure.test.mjs` 仍是最大单文件，但其中 business-import/result-chain 断言承载产品所有权边界，不应直接机械拆分。

#### 验证

- `node --test scripts/tests/actual-log-production-workbench-model.test.mjs scripts/tests/actual-log-production-detail-status-model.test.mjs scripts/tests/actual-log-production-detail-login-model.test.mjs`：通过，10/10 tests pass。
- `node --test scripts/tests/personnel-schedule-production-workbench-model.test.mjs scripts/tests/personnel-schedule-production-detail-model.test.mjs scripts/tests/personnel-schedule-production-reference-blocker-model.test.mjs`：通过，10/10 tests pass。
- `node --test scripts/tests/demand-forecast-production-workbench-model.test.mjs scripts/tests/demand-forecast-production-detail-model.test.mjs scripts/tests/demand-forecast-production-change-trace-model.test.mjs`：通过，11/11 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM223 Qoder 拆分结果接入与剩余大门禁细分

#### 审计结论

- `IM223/US843` 已接管 Qoder 的测试拆分结果，并继续细分剩余较大的 import-center 与 master-data model gates。
- 原 `scripts/tests/import-center-core-model.test.mjs` 的 16 个 tests 拆为 format/url 6 tests、batch list 6 tests、result trace 4 tests。
- 原 review-case workspace/action 14 个 tests 拆为 workspace list 2 tests、workspace owner 3 tests、workspace grouping 2 tests、action deck 4 tests、action write 3 tests。
- 原 master-data maintenance detail/payload 7 个 tests 拆为 workplace detail 3 tests、service-team detail 1 test、vendor detail 2 tests、workplace payload 1 test。
- 旧通用测试文件已完全迁出并删除；`scripts/check.sh` 已改为显式运行拆分后的新 model gates。
- 本轮不启动额外测试环境，不修改 UI、路由、数据读取、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁维护，不等同于新增导入中心、复核案例或主数据维护业务能力。
- Qoder 本轮只允许机械拆分；Codex 保留 diff 审查、门禁接入、Harness、最终验证和提交责任。

#### 验证

- `node --test scripts/tests/import-center-format-url-model.test.mjs scripts/tests/import-center-batch-list-model.test.mjs scripts/tests/import-center-result-trace-model.test.mjs`：通过，16/16 tests pass。
- `node --test scripts/tests/import-center-review-case-model.test.mjs scripts/tests/import-center-review-case-workspace-list-model.test.mjs scripts/tests/import-center-review-case-workspace-owner-model.test.mjs scripts/tests/import-center-review-case-workspace-grouping-model.test.mjs scripts/tests/import-center-review-case-detail-model.test.mjs scripts/tests/import-center-review-case-action-deck-model.test.mjs scripts/tests/import-center-review-case-action-write-model.test.mjs`：通过，21/21 tests pass。
- `node --test scripts/tests/master-data-maintenance-model.test.mjs scripts/tests/master-data-maintenance-agent-model.test.mjs scripts/tests/master-data-maintenance-reference-model.test.mjs scripts/tests/master-data-maintenance-workplace-detail-model.test.mjs scripts/tests/master-data-maintenance-service-team-detail-model.test.mjs scripts/tests/master-data-maintenance-vendor-detail-model.test.mjs scripts/tests/master-data-maintenance-workplace-payload-model.test.mjs`：通过，31/31 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM222 import-center version gate 子拆分

#### 审计结论

- `IM222/US842` 已继续拆分 import-center version model gate。
- 原 `scripts/tests/import-center-version-model.test.mjs` 的 10 个 tests 拆为 version workbench 3 tests、version action/applied context 3 tests、version comparison 4 tests。
- 旧 `scripts/tests/import-center-version-model.test.mjs` 已完全迁出并删除；`scripts/check.sh` 改为显式运行三个更细的 version model gate。
- 本轮不启动额外测试环境，不修改 UI、路由、数据读取、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁维护，不等同于新增业务版本、应用版本定位或本地比对业务能力。

#### 验证

- `node --test scripts/tests/import-center-version-workbench-model.test.mjs scripts/tests/import-center-version-action-model.test.mjs scripts/tests/import-center-version-comparison-model.test.mjs`：通过，10/10 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM221 import-center batch/template gate 子拆分

#### 审计结论

- `IM221/US841` 已继续拆分 import-center batch/template model gate。
- 原 `scripts/tests/import-center-batch-template-model.test.mjs` 的 27 个 tests 拆为 batch apply/readiness/result 6 tests、template inventory/detail/fit 8 tests、upload workspace/prefill/result 6 tests、batch detail/row correction 7 tests。
- 旧 `scripts/tests/import-center-batch-template-model.test.mjs` 已完全迁出并删除；`scripts/check.sh` 改为显式运行四个更细的 batch/template model gate。
- `product-structure.test.mjs` 原始基线当前为 21/35 tests pass，失败集中在已漂移的 master-data/product-structure 断言；本轮未将其接入默认门禁。
- 本轮不启动额外测试环境，不修改 UI、路由、数据读取、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁维护，不等同于新增导入、模板、上传或批次应用业务能力。
- `product-structure.test.mjs` 后续需要单独审计和产品校准；不应作为绿色机械拆分候选直接接入 `scripts/check.sh`。

#### 验证

- `node --test scripts/tests/import-center-batch-apply-model.test.mjs scripts/tests/import-center-template-model.test.mjs scripts/tests/import-center-upload-model.test.mjs scripts/tests/import-center-batch-detail-model.test.mjs`：通过，27/27 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM220 import-center model gate 最终子拆分

#### 审计结论

- `IM220/US840` 已继续拆分 import-center model gate，Qoder 执行低风险机械拆分，Codex 审查 diff 与验证。
- review-case gate 拆为 conclusion/evidence 4 tests、workspace/list/owner 7 tests、detail/context/chain/timeline 3 tests、action/feedback/retry/write 7 tests。
- 原 core/comparison/exception gate 拆为 core 16 tests、comparison 3 tests、exception 4 tests。
- 旧 `scripts/tests/import-center-model.test.mjs` 已完全迁出并删除；`scripts/check.sh` 改为显式运行 7 个更细的 import-center model gate，并保留 version 与 batch/template gate。
- product-structure 只读分析未产生文件变更；其结论是建议未来拆为 global-shell、master-data-entity、agent-workflow、reference-maintenance、business-import 五组，其中 business-import/result-chain 需要产品评审后再拆。
- 本轮不启动额外测试环境，不修改 UI、路由、数据读取、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁覆盖维护，不等同于新增导入中心或复核案例业务能力。
- `product-structure.test.mjs` 后续不应直接机械拆 business-import/result-chain 组，需要先确认产品语义边界。

#### 验证

- `node --test scripts/tests/import-center-core-model.test.mjs scripts/tests/import-center-comparison-model.test.mjs scripts/tests/import-center-exception-model.test.mjs scripts/tests/import-center-review-case-model.test.mjs scripts/tests/import-center-review-case-workspace-model.test.mjs scripts/tests/import-center-review-case-detail-model.test.mjs scripts/tests/import-center-review-case-action-model.test.mjs`：通过，44/44 tests pass。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过。

### 2026-06-18 - IM219 master-data maintenance model gate 拆分接入

#### 审计结论

- `IM219/US839` 已把 master-data maintenance model 断言从单个大测试文件拆成四个业务边界门禁。
- `scripts/tests/master-data-maintenance-model.test.mjs` 保留 core/workbench/source-context 8 个 tests。
- `scripts/tests/master-data-maintenance-agent-model.test.mjs` 新增 8 个 agent 相关 tests，覆盖员工列表、坐席管理、坐席详情、筛选、导入弹窗、坐席 payload、技能替换 payload 和反馈。
- `scripts/tests/master-data-maintenance-reference-model.test.mjs` 新增 8 个 reference/organization/skill/vendor tests。
- `scripts/tests/master-data-maintenance-detail-model.test.mjs` 新增 7 个 workplace/service-team/vendor detail 和 workplace payload tests。
- `scripts/check.sh` 已显式运行四个拆分后的 master-data maintenance model 测试文件。
- 本轮不启动额外测试环境，不修改 UI、路由、数据读取、组件实现、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁覆盖改进，不等同于新增主数据维护业务能力。
- 后续若继续拆 `product-structure.test.mjs`，需要先按产品结构职责分组，避免只按文件长度机械拆分。

#### 验证

- `node --test scripts/tests/master-data-maintenance-model.test.mjs scripts/tests/master-data-maintenance-agent-model.test.mjs scripts/tests/master-data-maintenance-reference-model.test.mjs scripts/tests/master-data-maintenance-detail-model.test.mjs scripts/tests/master-data-model-split.test.mjs scripts/tests/master-data-workbench-split.test.mjs`：通过，33/33 tests pass。
- `npm run lint`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、import-center model gates、master-data maintenance model gates、split guards、shadcn gate、lint、typecheck、Next build 和后端 215 个测试。

### 2026-06-18 - IM218 import-center model gate 业务边界拆分

#### 审计结论

- `IM218/US838` 已继续按业务边界拆分 import-center model gate。
- `scripts/tests/import-center-version-model.test.mjs` 新增 10 个 version/workbench assertions，覆盖版本台账、应用版本定位、本地比对触发、触发反馈、最新运行回看和业务版本列表结果回看。
- `scripts/tests/import-center-batch-template-model.test.mjs` 新增 27 个 batch/template/apply assertions，覆盖批次应用 URL、字段映射模板、上传预填、模板 fit、失败行、批次详情、准备度分组、应用入口和上传结果反馈。
- 原 `scripts/tests/import-center-model.test.mjs` 保留 23 个 core/comparison/exception assertions，包括基础格式、批次筛选、downstream navigation/drilldown、quality impact、comparison-run detail、page hierarchy、API/upload URL 和 exception guidance。
- `scripts/check.sh` 已接入新增两个测试文件，并把既有 `import-center-model-first-split`、`import-center-summary-split`、`master-data-model-split`、`master-data-workbench-split` 四个 split guard 纳入正式门禁。
- Qoder 只执行受控测试拆分，未提交、未推送；Codex 审查 diff、补 Harness、负责最终验证与本地提交。
- 本轮不启动 `127.0.0.1:8000`，不修改 UI、路由、数据读取、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁维护，不等同于新增导入中心业务能力，也不等同于 live UI/API smoke。
- 后续若继续拆 `product-structure.test.mjs`，需要先做只读产品语义分组，不能按文件长度机械移动。

#### 验证

- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，23/23 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-version-model.test.mjs`：通过，10/10 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-batch-template-model.test.mjs`：通过，27/27 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model-first-split.test.mjs scripts/tests/import-center-summary-split.test.mjs scripts/tests/master-data-model-split.test.mjs scripts/tests/master-data-workbench-split.test.mjs`：通过，4/4 tests pass。
- `npm run lint`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、四个 import-center model gate、四个 split guard、shadcn gate、lint、typecheck、Next build 和后端 215 个测试。

### 2026-06-17 - IM217 复核案例 model test 拆分

#### 审计结论

- `IM217/US837` 已把复核案例相关 21 个 model assertions 从通用 `scripts/tests/import-center-model.test.mjs` 拆到 `scripts/tests/import-center-review-case-model.test.mjs`。
- 原 `scripts/tests/import-center-model.test.mjs` 保留 60 个导入中心、业务版本和 comparison-run assertions；`import center comparison run detail links related review cases` 仍留在原文件，因为它验证的是 comparison-run 结果结构如何聚合复核案例链接。
- `scripts/check.sh` 现在同时运行两个 import-center model 测试文件，保持 IM216 的正式门禁覆盖，同时降低单文件维护成本。
- Qoder 只执行受控拆分，未提交、未推送；Codex 审查 diff、清理拆分后残留 import，并负责最终验证与本地提交。
- 本轮不启动 `127.0.0.1:8000`，不修改 UI、路由、数据读取、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是测试结构和门禁维护，不等同于新增复核业务能力，也不等同于 live seeded UI/API smoke。
- 后续若继续拆分其他 import-center model tests，需要按业务边界切分，避免只按文件长度机械拆分。

#### 验证

- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：通过，60/60 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-review-case-model.test.mjs`：通过，21/21 tests pass。
- `npm run lint`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、两个 import-center model gate、shadcn gate、lint、typecheck、Next build 和后端 215 个测试。

### 2026-06-17 - IM216 复核案例 model test 运行器硬化

#### 审计结论

- `IM216/US836` 已把 `scripts/tests/import-center-model.test.mjs` 从加载失败状态修复为正式可执行测试。
- 根因是 direct Node ESM resolver 不解析 import-center barrel 内部的 extensionless TS imports；测试文件改用现有 `jiti` 加载 `components/import-center-model.ts`，不改业务组件源码。
- 该测试已接入 `scripts/check.sh`，现在会覆盖 import-center model 的 81 个断言，包括复核案例处理阶段、owner 矩阵、详情上下文、动作区、失败重试、关闭后续办，以及导入/版本/对比相关模型契约。
- 本轮不启动 `127.0.0.1:8000`，不修改 UI、路由、数据读取、后端、schema/migration、依赖、package/lockfile、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 这是 model/contract gate hardening，不等同于 live seeded UI/API smoke；真实页面数据验收仍需要已批准的 8000/API runtime。
- `jiti` 当前来自既有安装树；本轮未新增依赖或修改 package/lockfile。若未来依赖树收紧，应单独确认是否把测试加载器变成显式 devDependency。

#### 验证

- RED：`BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs` 在修复前失败，报 `ERR_MODULE_NOT_FOUND`，缺失 `components/import-center-formatters`。
- GREEN：同一命令修复后通过，81/81 tests pass。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含新增 import-center model test、strict state、shadcn gate、lint、typecheck、Next build 和后端 215 个测试。

### 2026-06-17 - IM215 复核案例 model/contract-only 验收收口

#### 审计结论

- `IM215/US835` 已按 PM 继续指令收口为 no-new-env model/contract-only QA 记录。
- 本轮不启动 `127.0.0.1:8000` 或其他测试环境，不修改复核案例 UI、路由、数据读取、后端、依赖或 package/lockfile。
- live smoke 结论保持克制：3000 route shell 和反馈参数部分可达，但 seeded case 数据没有通过 live UI/API 验收。
- 现有覆盖盘点显示：共享 API/error helper、共享 empty-state、处理阶段、owner 矩阵、详情上下文、动作区、失败重试、关闭后续办均有代码级测试或结构覆盖来源；其中 `import-center-model.test.mjs` 目前不能直接作为通过证据，因为 direct Node 执行被既有 TS/ESM import resolution 问题挡住。

#### 风险

- 后续若需要真实验收，仍必须提供已批准的 `127.0.0.1:8000` review-case API 或等效运行端点。
- 直接把本次收口理解成“live seeded review-case 已可用”会误导后续优先级。
- 如果要把复核案例 model assertions 纳入硬门禁，需要单独修复测试运行器或把相关断言迁入当前正式 `scripts/check.sh` 可执行路径。

#### 验证

- `node --test scripts/tests/frontend-api-utilities.test.mjs`：通过。
- `node --test scripts/tests/shared-empty-state.test.mjs`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin /opt/homebrew/opt/node@22/bin/node --test scripts/tests/import-center-model.test.mjs`：加载阶段失败，原因是既有 TS/ESM extensionless import resolution；不作为 IM215 pass evidence。
- `node --test scripts/tests/product-structure.test.mjs scripts/tests/frontend-api-utilities.test.mjs scripts/tests/shared-empty-state.test.mjs`：失败，失败来自 unrelated historical master-data structure assertions；不作为 IM215 pass evidence。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict`：通过，current queue / active tasks 已清空。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、lint、typecheck、Next build 和后端 215 个测试。

### 2026-06-17 - IM215 复核案例验收 smoke

#### 审计结论

- `IM215/US835` 已尝试使用当前已运行的 `127.0.0.1:3000` 做复核案例验收 smoke。
- 复核案例列表、处理阶段筛选、`CASE-QUERY-001` 详情、失败反馈参数和关闭成功反馈参数的前端 URL 均返回 200。
- 但页面实际状态为 `复核案例读取失败 / fetch failed`，因为 `127.0.0.1:8000` review-case API 当前不可达。
- PM 已明确不要启动其他测试环境，因此本轮不能完成 seeded case 状态矩阵验收。

#### 风险

- 如果只看 3000 HTTP 200，容易误判复核案例工作区已通过验收；真实状态数据仍未加载。
- 在 API 未运行时继续做文案或空态修复，可能掩盖环境问题。

#### 验证

- `curl` 访问 3000 复核案例列表、阶段筛选、详情和反馈 URL：均返回 200。
- `curl` 访问 8000 review-case API：连接失败。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict`：blocked current queue / active tasks 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、lint、typecheck、Next build 和后端 215 个测试。

### 2026-06-17 - IM214 复核案例工作区现状校准

#### 审计结论

- `IM214/US834` 已新增复核案例工作区校准文档。
- 当前 `/data-quality/review-cases` 是复核案例 triage 列表，覆盖业务日、owner、状态、严重度、来源类型、处理阶段和关键词筛选，并提供 owner x 阶段负载和首个待处理入口。
- 当前 `/data-quality/review-cases/[caseId]` 是单案例处理工作区，覆盖来源上下文、来源链路、证据/结论链路、处理时间线、动作区、Owner 上下文和续办导航。
- 当前动作区支持受控本地证据补充、结论补充和关闭；关闭仍受证据/结论完整性和已关闭状态约束。
- 本轮不修改 UI、路由、数据读取、后端、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 风险

- 复核案例工作区容易被误读为已经具备生产审批、权限、批量关闭或导出能力；这些仍需新 Gate。
- 如果后续从 dashboard 行跳转复核案例，必须先确认稳定 `caseId` 或明确查询契约，不能伪造 downstream ID。

#### 验证

- `bash scripts/check-state.sh --strict`：执行态通过。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict`：完成态 current queue / active tasks 清空后通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、lint、typecheck、Next build 和后端 215 个测试。

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

### 2026-06-01 - IM051 复核结论预览只读 drilldown

#### 审计结论

- `IM051/US671` 已在 `/data-quality/[batchId]` 结果追踪页签增加“复核结论预览”。
- 模型层新增只读结论摘要，按读取错误、复核案例、对比结果和质量影响生成建议结论、关键证据、残余风险和下一步。
- 页面保留现有结果追踪层级，并在质量影响聚合之后展示结论预览；“查看复核案例”仅作为只读下游入口，不提交、不关闭、不审批、不导出、不批量处理。
- 本轮未新增依赖，未修改 package/lockfile，未触碰后端、schema/migration、真实外部接口、权限、生产公式、结算或收费因子。

#### 风险

- 当前是主管阅读用的结论预览，不是复核关闭写入、证据补录或审批流。
- 如果后续要真正提交复核结论或关闭异常，必须另开受控任务并明确权限、审计、幂等和回滚边界。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportReviewConclusionPreview` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，36 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过；直接用全局 Node 24 构建会触发已知 native addon 问题，项目校验以 Node 22 为准。
- page smoke：内置浏览器本地 URL 被 client 拦截；临时生产服务 `http://127.0.0.1:3023/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 的 HTTP smoke 命中 `复核结论预览`、`结论依据`、`残余风险`、`查看复核案例`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM052 复核证据缺口只读 drilldown

#### 审计结论

- `IM052/US672` 已在 `/data-quality/[batchId]` 结果追踪页签增加“复核证据缺口”。
- 模型层新增只读缺口摘要，按读取错误、未关闭复核案例、质量问题和对比结果生成风险等级、owner、需补证据、质量问题线索、对比结果线索和下一步。
- 页面把证据缺口作为独立区块放在质量影响聚合与复核结论预览之间，避免继续把所有判断堆进一个超长页面段落。
- 本轮未新增依赖，未修改 package/lockfile，未触碰后端、schema/migration、真实外部接口、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前是主管阅读用的证据缺口提示，不是证据补录表单、附件上传、复核关闭或审批流。
- 如果后续要做真实补证据或关闭异常，必须另开受控任务并明确权限、审计、幂等和回滚边界。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 因缺少 `summarizeImportReviewEvidenceGapDrilldown` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，38 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- page smoke：临时生产服务 `http://127.0.0.1:3023/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 的 HTTP smoke 命中 `复核证据缺口`、`暂无证据缺口`、`责任人`、`查看复核案例`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM053 复核案例工作台二级页

#### 审计结论

- `IM053/US673` 已新增 `/data-quality/review-cases` 只读复核案例工作台。
- 工作台展示摘要卡、筛选区、owner/状态/严重度/来源分组和案例列表，避免继续把复核查看堆在批次详情页内。
- 批次详情页中的“查看复核案例”入口改为跳转到二级工作台，并带入业务日或未关闭状态筛选。
- 本轮未新增依赖，未修改 package/lockfile，未触碰后端、schema/migration、真实外部接口、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前是主管查看和定位工作台，不是复核案例写入、证据上传、关闭异常或审批流。
- 如果后续要做真实处理动作，必须另开受控任务并明确权限、审计、幂等、回滚和批量边界。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 因缺少 `buildImportReviewCasesWorkspaceHref` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，40 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过，产物包含 `/data-quality/review-cases` 动态路由。
- page smoke：临时 FastAPI + Next production 服务下，`http://127.0.0.1:3023/data-quality/review-cases?businessDate=2026-05-11&status=open` 命中 `复核案例工作台`、`筛选复核案例`、`分组情况`、`复核案例列表`、`返回数据质量`；批次详情页 smoke 命中 `/data-quality/review-cases`、`复核证据缺口`、`复核结论预览`。
- 临时 8000/3023 服务已停止。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-01 - IM054 质量问题到复核案例聚焦

#### 审计结论

- `IM054/US674` 已在 `/data-quality/[batchId]` 的“质量影响聚合”问题组中增加“查看相关复核案例”入口。
- 入口跳转到 `/data-quality/review-cases`，并带入业务日、未关闭状态、来源类型和质量关键词焦点。
- `/data-quality/review-cases` 在页头展示当前焦点，筛选区说明从质量问题进入时关键词作为只读焦点保留。
- 本轮未新增依赖，未修改 package/lockfile，未触碰 app 路由、后端、schema/migration、真实外部接口、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前质量关键词是只读焦点上下文，不是复核案例与质量行的生产级关联写入。
- 如果后续要做真实证据补录、复核关闭、质量问题归因落库或批量处理，必须另开受控任务并明确权限、审计、幂等和回滚边界。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 因缺少 `buildImportQualityIssueReviewCasesHref` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，40 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- page smoke：重启后的 production 服务 `http://127.0.0.1:3021/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` 命中 `质量影响聚合`、`查看相关复核案例` 和 `/data-quality/review-cases?...query=source_key+%C2%B7+REQUIRED_FIELD_MISSING`；`http://127.0.0.1:3021/data-quality/review-cases?businessDate=2026-05-01&status=open&sourceResultType=schedule_actual&query=source_key+%C2%B7+REQUIRED_FIELD_MISSING` 命中 `复核案例工作台`、`焦点 source_key · REQUIRED_FIELD_MISSING` 和筛选说明。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-02 - IM055 复核案例二级详情页

#### 审计结论

- `IM055/US675` 已新增 `/data-quality/review-cases/[caseId]` 只读复核案例详情页。
- 复核案例工作台列表中的详情入口从后端 API 链接改为前端二级详情页，避免把单个案例处理信息继续堆在列表页。
- 详情页展示案例摘要、来源结果、owner、证据状态、质量焦点、证据缺口、下一步建议、证据记录、结论记录和只读处理边界。
- 本轮未新增依赖，未修改 package/lockfile，未触碰后端、schema/migration、真实外部接口、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前是二级详情查看页，不是复核关闭、证据补录、异常处理写入或审批流。
- 当前运行中的本地后端复核案例列表为空，因此浏览器 smoke 覆盖的是二级路由和只读 API 404 错误态；正常详情态由模型测试覆盖，后续若要演示正常态，需要先准备当前本地后端的复核案例数据。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 因缺少 `buildImportReviewCaseDetailApiUrl` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，41 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/next/dist/bin/next build --webpack`：通过，产物包含 `/data-quality/review-cases/[caseId]` 动态路由；默认 Codex App 签名 Node 会触发 macOS native addon Team ID 校验，验证使用工作区备用 Node 运行时。
- page smoke：生产服务 `http://127.0.0.1:3021/data-quality/review-cases/CASE-QUERY-001` 命中 `复核案例详情`、`返回复核案例`、`证据缺口`、`处理边界` 和详情 API 地址；当前后端 `CASE-QUERY-001` 返回 404，所以页面展示只读错误态。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 160 个后端 unittest。

### 2026-06-02 - IM056 复核案例详情正常态数据准备

#### 审计结论

- `IM056/US676` 已新增 `backend.app.review_demo_seed.seed_review_case_demo()`。
- helper 复用现有 DB007/DB008 repository 和模型，在本地 sqlite 库中生成 `CASE-QUERY-001`、来源 forecast-vs-schedule 对比结果、证据和结论。
- helper 幂等：如果 `CASE-QUERY-001` 已存在，直接返回已有 `ReviewCaseDetail`，不重复写入证据、结论或关闭记录。
- 本轮未新增依赖，未修改 package/lockfile，未新增 schema/migration，未新增生产 API，未触碰真实外部接口、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前是本地 smoke 数据准备能力，不是生产复核处理流程、证据上传入口、审批流或批量初始化功能。
- helper 使用固定 demo ID，仅用于本地验收 `CASE-QUERY-001` 正常态；未来生产数据生成仍应通过受控导入、对比计算和复核写入链路。

#### 验证

- TDD 红灯：`.venv/bin/python -m unittest backend.tests.test_review_demo_seed -v` 因缺少 `backend.app.review_demo_seed` 失败。
- `.venv/bin/python -m unittest backend.tests.test_review_demo_seed -v`：通过，2 个测试覆盖创建和幂等。
- `.venv/bin/python -m backend.app.review_demo_seed`：通过，在当前本地 `.local` 数据库生成 `CASE-QUERY-001`。
- page smoke：生产服务 `http://127.0.0.1:3021/data-quality/review-cases/CASE-QUERY-001` 命中 `CASE-QUERY-001 · 高 · 未关闭`、`证据 1 条 · 结论 1 条 · 未关闭`、`预测排班 #1` 和 `证据 EVD-QUERY-001 · note · supervisor-01`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 backend unittest。

### 2026-06-02 - IM057 复核案例来源结果上下文

#### 审计结论

- `IM057/US677` 已在 `ReviewCaseDetail` 中增加只读 `source_result` 上下文。
- backend 复用现有 DB007 对比结果表：`forecast_schedule` 返回业务日、时段、职场、项目、技能、预测人数、排班人数、缺口和状态；`schedule_actual` 返回业务日、时段、坐席、排班分钟、有效分钟、迟到分钟和状态。
- `/data-quality/review-cases/[caseId]` 新增“来源结果明细”独立区块，按业务维度和差异指标分组展示，不再只显示来源编号。
- 本轮未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前是来源结果只读上下文，不是复核写入、证据补录、关闭异常、审批或批量处理。
- 页面 smoke 使用 8001 新后端和 3025 新前端临时服务；原 3021/8000 旧服务未被替换。

#### 验证

- TDD 红灯：后端目标测试因 `ReviewCaseDetail` 缺少 `source_result` 失败。
- TDD 红灯：前端模型测试因 summary 缺少 `sourceResultDimensions/sourceResultMetrics` 失败。
- `.venv/bin/python -m unittest backend.tests.test_result_query_api -v`：通过，7 个 result query API 测试覆盖两种来源。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，41 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm run build`：默认 Codex Node 命中已知 native addon 签名问题；使用工作区 Node 运行 `/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/next/dist/bin/next build --webpack` 通过。
- API smoke：`http://127.0.0.1:8001/api/v1/review-cases/CASE-QUERY-001` 返回 `source_result`，含 `SH-01`、`BOSCH-CS`、`L1-CN`、`forecast_agents=3`、`scheduled_agents=1`、`gap_agents=2`。
- page smoke：`http://127.0.0.1:3025/data-quality/review-cases/CASE-QUERY-001` 的 production HTML 命中 `来源结果明细`、`职场 SH-01`、`项目 BOSCH-CS`、`技能 L1-CN`、`缺口 2 人`。
- Playwright wrapper smoke 因 `npm exec playwright-cli` 卡住未完成，已终止该临时进程。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 163 个后端 unittest。

### 2026-06-02 - IM058 复核案例来源链路反查

#### 审计结论

- `IM058/US678` 已在 `ReviewCaseDetail` 中增加只读 `source_trace` 上下文。
- backend 复用现有 DB007/DB008 和导入版本表，按复核来源结果反查计算运行、业务版本、导入版本、导入批次和文件名。
- `/data-quality/review-cases/[caseId]` 新增“来源链路”独立区块，展示计算运行和版本/批次链路，避免把来源追踪继续塞回列表页或批次长页。
- 本轮未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前是只读来源链路查看，不是复核写入、证据补录、关闭异常、审批或批量处理。
- 页面 smoke 使用临时本地服务 8002/3026；原有 3021/3025 服务未被替换。

#### 验证

- TDD 红灯：后端目标测试因 `ReviewCaseDetail` 缺少 `source_trace` 失败。
- TDD 红灯：前端模型测试因 summary 缺少 `sourceTraceRun/sourceTraceVersions` 失败。
- `.venv/bin/python -m unittest backend.tests.test_result_query_api -v`：通过，7 个 result query API 测试覆盖 forecast_schedule 和 schedule_actual 来源链路。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，41 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- API smoke：`http://127.0.0.1:8002/api/v1/review-cases/CASE-QUERY-001` 返回 `source_trace`，含 `RUN-DEMO-FS-20260511`、`FC-DEMO-20260511-V1`、`IMPORT-DEMO-FC-20260511` 和 `BATCH-DEMO-REVIEW-20260511`。
- page smoke：`http://127.0.0.1:3026/data-quality/review-cases/CASE-QUERY-001` 命中 `来源链路`、`计算 RUN-DEMO-FS-20260511`、`预测版本 FC-DEMO-20260511-V1`、`IMPORT-DEMO-FC-20260511` 和 `BATCH-DEMO-REVIEW-20260511`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 backend unittest。

### 2026-06-02 - IM059 复核案例来源运行详情入口

#### 审计结论

- `IM059/US679` 已新增 `/data-quality/comparison-runs/[runId]` 只读二级详情页。
- 详情页使用现有 shadcn/ui `Card`、`Table`、`Badge`、`Button` 组合，按单列层级展示运行摘要、来源版本、结果明细和处理边界，不再把来源运行处理继续塞回复核案例长页。
- `/data-quality/review-cases/[caseId]` 的来源链路区块新增“查看运行详情”，跳转前端运行详情页。
- 批次详情中的对比运行 action 已改为 `/data-quality/comparison-runs/[runId]` 前端路由，不再优先打开 API JSON。
- 本轮未新增依赖，未修改 package/lockfile，未新增后端、schema/migration，未触碰真实外部接口、计算触发、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前是只读运行详情查看，不是重新计算、异常处理、证据补录、关闭异常、审批或批量处理。
- 当前本地 smoke 数据可以验证复核案例到运行详情的前端链路；批次详情中的对比运行链接以代码路径和模型测试覆盖为主，当前 demo 批次未暴露可点击的下游对比运行记录。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 先因缺少 `buildImportComparisonRunDetailApiUrl` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，42 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run typecheck`：通过。
- `npm run lint`：通过。
- in-app browser smoke：`http://localhost:3026/data-quality/comparison-runs/RUN-DEMO-FS-20260511` 命中 `对比运行详情`、`运行来源`、`结果明细` 和 `处理边界`，且不是 API JSON；截图保存在 `/private/tmp/im059-comparison-run-detail-smoke.png`。
- in-app browser smoke：`http://localhost:3026/data-quality/review-cases/CASE-QUERY-001` 的来源链路存在 1 个 `/data-quality/comparison-runs/RUN-DEMO-FS-20260511` 前端链接和 1 个 `查看运行详情` action。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 163 个后端 unittest。

### 2026-06-02 - IM060 对比运行关联复核案例定位

#### 审计结论

- `IM060/US680` 已在 `/data-quality/comparison-runs/[runId]` 增加“关联复核案例”只读区块。
- 页面复用已有 comparison-run detail API 和 review-cases list API，按当前运行的 `forecast_schedule_results`、`schedule_actual_results` 与复核案例的 `source_result_type + source_result_id` 匹配。
- 有关联案例时展示案例号、来源结果、owner、风险、状态，并提供 `/data-quality/review-cases/[caseId]` 前端详情入口。
- 无匹配案例或读取失败时展示只读空态/错误态，不触发写入。
- 本轮未新增依赖，未修改 package/lockfile，未新增后端、schema/migration，未触碰真实外部接口、计算触发、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前只定位到复核案例详情；证据补录、复核关闭、审批和批量处理仍未实现。
- 关联匹配依赖 review-cases list API 返回 `source_result_type` 与 `source_result_id`，不新增后端联表查询。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 先因缺少 `summarizeImportComparisonRunReviewCases` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，43 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/comparison-runs/RUN-DEMO-FS-20260511` 命中 `关联复核案例`、`CASE-QUERY-001`、`查看详情` 和 `/data-quality/review-cases/CASE-QUERY-001`，且没有 `Application error`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 163 个后端 unittest。

### 2026-06-02 - IM061 复核案例证据结论链路

#### 审计结论

- `IM061/US681` 已在 `/data-quality/review-cases/[caseId]` 增加“证据与结论链路”只读区块。
- 链路模型汇总证据数、结论数、关闭状态和下一步建议，并把 evidence、conclusions、closure 合并为按时间排序的链路条目。
- 复核案例详情主体已调整为单列分层：来源结果、来源链路、证据缺口、证据与结论链路、证据表、结论表、处理边界。
- 本轮未新增依赖，未修改 package/lockfile，未新增后端、schema/migration，未触碰真实外部接口、证据补录、复核关闭写入、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 风险

- 当前仍是只读展示，不是证据补录、复核结论提交、关闭异常、审批或批量处理。
- 浏览器截图通道两次超时；页面 smoke 已通过 DOM 文本和结构验证。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-center-model.test.mjs` 先因缺少 `summarizeImportReviewCaseEvidenceChain` export 失败。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，44 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/review-cases/CASE-QUERY-001` 命中 `证据与结论链路`、`EVD-QUERY-001`、`CON-QUERY-001`，主体 section class 为 `grid gap-4`。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 163 个后端 unittest。

### 2026-06-02 - IM062 复核案例关闭写入入口

#### 审计结论

- `IM062/US682` 已补齐复核案例详情页的受控关闭写入入口。
- `write_review_closure()` 对已存在且未关闭的 review case 会写入 request closure，并返回带 closure 的 detail；已关闭案例重复提交仍返回已有 detail，不重复写入。
- `/data-quality/review-cases/[caseId]` 新增“关闭复核案例”区块；仅当证据和结论均存在且案例未关闭时展示提交按钮。
- 关闭入口使用现有本地 `POST /api/v1/review-cases/write-closure`，提交当前案例、已有证据、已有结论和 closure payload；不提供证据补录、审批、导出、批量或权限能力。
- 本轮未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、生产公式、结算或收费因子。

#### 风险

- 当前只是受控关闭写入入口，不是证据补录、结论新增、审批流、批量处理或权限隔离。
- 浏览器当前 3026 页面依赖的 8002 后端进程曾未加载最新服务逻辑；使用 8003 临时最新后端完成 API smoke 后，同一 `.local` 数据库可被 3026 页面读出已关闭状态。

#### 验证

- TDD 红灯：后端 service/api 目标测试先因 existing open case 直接返回旧 detail、未写入 closure 失败。
- TDD 红灯：前端模型测试先因缺少 closure write helper export 失败。
- `.venv/bin/python -m unittest backend.tests.test_review_closure_service backend.tests.test_review_closure_api -v`：通过，7 个 review closure 测试通过。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，45 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- API smoke：临时最新后端 `http://127.0.0.1:8003/api/v1/review-cases/write-closure` 返回 `closure_id=CLO-CASE-QUERY-001`、`closure_status=closed`、`closed_by=ops-lead-01`。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/review-cases/CASE-QUERY-001` 刷新后命中 `已关闭` 和 `案例已关闭`，`关闭案例` 按钮数量为 0。
- `bash scripts/check-state.sh --strict`：通过，current 已推进到 `US717/IM097`，无 done history 残留。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 frontend build 和 backend 177 tests OK。

### 2026-06-02 - IM063 复核案例证据补录写入入口

#### 审计结论

- `IM063/US683` 已新增受控证据补录写入 API：`POST /api/v1/review-cases/{case_id}/evidence`。
- `write_review_evidence()` 对已存在且未关闭的 review case 写入一条 evidence，并返回带最新 evidence 列表的 detail。
- 服务层会阻止 path `case_id` 与 payload `case_id` 不一致、已关闭案例补证据、缺失 case 或重复 evidence_id。
- `/data-quality/review-cases/[caseId]` 新增“补充复核证据”独立 panel，位于证据链路之后、关闭入口之前。
- 本轮未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、结论新增、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前只支持单条 evidence 补录，不是结论新增、证据附件上传、审批流、批量处理或权限隔离。
- 页面 form 使用现有本地 API base；当前 3026/8002 开发进程如果未刷新后端代码，提交动作需要重启本地后端后才能直接点通。本轮用临时最新 8003 后端完成 API smoke。

#### 验证

- TDD 红灯：后端 service/api 目标测试先因缺少 `backend.app.review_evidence` 和 `write_review_evidence_api` 失败。
- TDD 红灯：前端模型测试先因缺少 evidence write helper export 失败。
- `.venv/bin/python -m unittest backend.tests.test_review_evidence_service backend.tests.test_review_evidence_api -v`：通过，6 个 review evidence 测试通过。
- `node --test scripts/tests/import-center-model.test.mjs`：通过，46 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- API smoke：临时最新后端 `http://127.0.0.1:8003/api/v1/review-cases/CASE-EVIDENCE-SMOKE-001/evidence` 返回 `evidence_count=1` 和 `last_evidence=EVD-CASE-EVIDENCE-SMOKE-001-001`。
- in-app browser smoke：`/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001` 命中 `补充复核证据`，`提交证据` 按钮数量为 1，并显示 `EVD-CASE-EVIDENCE-SMOKE-001-001`。
- in-app browser smoke：`/data-quality/review-cases/CASE-QUERY-001` 命中 `案例已关闭`，`提交证据` 按钮数量为 0。
- `bash scripts/check-state.sh --strict`：通过，current 队列已回到空。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 frontend build 和 backend 177 tests OK。

### 2026-06-02 - IM064 复核案例结论补充写入入口

#### 审计结论

- `IM064/US684` 已新增受控结论补充写入 API：`POST /api/v1/review-cases/{case_id}/conclusion`。
- `write_review_conclusion()` 对已存在且未关闭的 review case 写入一条 conclusion，并返回带最新 conclusions 列表的 detail。
- 服务层会阻止 path `case_id` 与 payload `case_id` 不一致、已关闭案例补结论、缺失 case 或重复 conclusion_id。
- `/data-quality/review-cases/[caseId]` 新增“补充复核结论”独立 panel，位于证据补录之后、关闭入口之前。
- 本轮未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前只支持单条 conclusion 补充，不是审批流、批量处理、权限隔离、结论模板管理或生产状态码最终口径。
- 页面 form 使用现有本地 API base；当前开发进程若未刷新后端代码，提交动作需要重启本地后端后才能直接点通。本轮用临时最新 8003 后端完成 API smoke。

#### 验证

- TDD 红灯：后端 service/api 目标测试先因缺少 `backend.app.review_conclusion` 和 `write_review_conclusion_api` 失败。
- TDD 红灯：前端模型测试先因缺少 conclusion write helper export 失败。
- `.venv/bin/python -m unittest backend.tests.test_review_conclusion_service backend.tests.test_review_conclusion_api`：通过，6 个 review conclusion 测试通过。
- `node scripts/tests/import-center-model.test.mjs`：通过，47 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node --test scripts/tests/check-shadcn-ui.test.mjs` 和 `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- API smoke：临时最新后端 `http://127.0.0.1:8003/api/v1/review-cases/CASE-CONCLUSION-SMOKE-001/conclusion` 返回 `CON-CASE-CONCLUSION-SMOKE-001-001`。
- SSR page smoke：`/data-quality/review-cases/CASE-CONCLUSION-SMOKE-001` 命中 `补充复核结论`、`CON-CASE-CONCLUSION-SMOKE-001-001` 和 `CASE-CONCLUSION-SMOKE-001`。
- SSR page smoke：`/data-quality/review-cases/CASE-QUERY-001` 命中 `补充复核结论` 和 `案例已关闭`，未命中 `提交结论`。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`：通过。直接 `npm run build` 会因本机默认 Node 24 触发 Next/lightningcss native addon 签名加载问题；项目标准 check 使用 Node 22 PATH。
- `bash scripts/check-state.sh --strict`：通过，current 队列已回到空。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 frontend build 和 backend 177 tests OK。

### 2026-06-02 - IM065 复核案例处理时间线

#### 审计结论

- `IM065/US685` 已在 `/data-quality/review-cases/[caseId]` 增加独立“处理时间线”区块。
- 时间线只读聚合现有 detail 中的 evidence、conclusions 和 closure，按时间排序展示处理阶段、处理人、时间、动作来源和说明。
- 时间线输出当前阶段、状态标签和下一步建议，避免主管在证据、结论、关闭入口之间手工拼接处理顺序。
- 本轮未新增后端 API，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、写入动作、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前时间线是只读聚合，不是审批流、处理 SLA、批量处理、权限隔离或操作日志持久化。
- 直接 `npm run build` 在本机默认 Node 24 下仍会触发既有 Next/lightningcss native addon 问题；项目标准 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 已通过。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewCaseProcessingTimeline` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，48 个 import-center model 测试通过。
- `node --test scripts/tests/check-shadcn-ui.test.mjs` 和 `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/review-cases/CASE-QUERY-001` 命中 `处理时间线`、`补充证据`、`补充结论`、`关闭案例` 和 `已关闭`。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state check、shadcn gate、frontend lint、typecheck、Next build 和 177 个 backend unittest。

### 2026-06-02 - IM066 复核案例处理阶段筛选

#### 审计结论

- `IM066/US686` 已在 `/data-quality/review-cases` 增加只读处理阶段筛选。
- 处理阶段支持缺证据、缺结论、可关闭、已关闭和阶段未知；阶段由现有 review-case detail API 的 evidence、conclusions 和 closure 记录派生。
- 列表页展示处理阶段、材料计数和阶段下一步；分组面板新增处理阶段分组。
- 本轮未新增后端 API，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、写入动作、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前阶段筛选通过列表页逐个读取现有详情 API 派生，适合当前本地 MVP；大规模生产分页和批量阶段统计仍需要后续后端查询优化任务。
- 读取详情失败的案例保留在列表中并标记阶段未知，不会误判为可关闭。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewCaseProcessingStage` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，49 个 import-center model 测试通过。
- `node --test scripts/tests/check-shadcn-ui.test.mjs` 和 `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/review-cases?processingStage=closed` 命中 `处理阶段`、`已关闭`、`复核案例列表`、`阶段` 和 `CASE-QUERY-001`。
- `bash scripts/check-state.sh --strict`：通过，current 队列只包含 `US719/IM099`，registry 无 lifecycle state 字段，current 文件行数均在预算内。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 frontend build 和 backend 177 tests OK。

### 2026-06-02 - IM067 复核 Owner 阶段负载矩阵

#### 审计结论

- `IM067/US687` 已在 `/data-quality/review-cases` 增加只读 `Owner 阶段负载` 矩阵。
- 矩阵按 owner 聚合缺证据、缺结论、可关闭、已关闭和阶段未知案例数，并展示待处理数量。
- 非零单元格使用现有列表路由进入对应 `ownerId + processingStage` 过滤结果，不新增后端 API。
- 本轮未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、写入动作、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前矩阵仍基于列表数据和逐详情派生的阶段快照，适合本地 MVP；生产大规模 owner 阶段统计需要后续后端聚合查询任务。
- 矩阵只用于定位工作量，不代表审批队列、批量分派或权限隔离。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewOwnerStageMatrix` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，50 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node --test scripts/tests/check-shadcn-ui.test.mjs` 和 `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/review-cases` 命中 `Owner 阶段负载`、`缺证据`、`缺结论`、`可关闭`、`已关闭`、`阶段未知` 和 `复核案例列表`。
- in-app browser href smoke：页面存在 `/data-quality/review-cases?ownerId=supervisor-01&processingStage=missing_conclusion`、`ready_to_close` 和 `closed` 链接。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 strict state、shadcn gate、lint、typecheck、Next build 和后端 209 tests OK。

### 2026-06-02 - IM068 复核详情同 Owner 处理上下文

#### 审计结论

- `IM068/US688` 已在 `/data-quality/review-cases/[caseId]` 增加只读 `同 Owner 处理上下文` 区块。
- 区块展示同 owner 同业务日的其他复核案例，包含处理阶段、证据/结论状态、风险、状态、创建时间和详情入口。
- 区块提供 `查看 Owner 列表` 和 `进入首要阶段` 链接，复用现有列表过滤参数。
- 本轮未新增后端 API，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、写入动作、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前上下文仍基于详情页读取现有 list API 和逐详情阶段快照，适合本地 MVP；生产大规模同 owner 上下文仍需要后续后端聚合查询任务。
- 该区块只是处理上下文，不是批量分派、审批队列、权限隔离或 SLA 规则。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewOwnerContext` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，51 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/review-cases/CASE-QUERY-001` 命中 `同 Owner 处理上下文`、`查看 Owner 列表`、`进入首要阶段`、`复核案例详情` 和 `处理时间线`。
- in-app browser href smoke：`查看 Owner 列表` 指向 `/data-quality/review-cases?businessDate=2026-05-11&ownerId=supervisor-01`；`进入首要阶段` 指向 `/data-quality/review-cases?businessDate=2026-05-11&ownerId=supervisor-01&processingStage=missing_conclusion`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-02 - IM069 复核详情同 Owner 待处理导航

#### 审计结论

- `IM069/US689` 已在 `/data-quality/review-cases/[caseId]` 的 `同 Owner 处理上下文` 内增加只读 `同 Owner 待处理导航`。
- 导航展示当前案例在同 owner 同业务日待处理序列中的位置，并提供上一条/下一条详情入口。
- 当前案例已关闭或不在待处理序列时，导航提供进入首条同 owner 待处理案例的入口。
- 本轮未新增后端 API，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、写入动作、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前导航仍基于详情页读取现有 list API 和逐详情阶段快照，适合本地 MVP；生产大规模连续处理仍需要后续后端聚合与分页优化任务。
- 该导航只是只读定位入口，不是批量分派、审批队列、权限隔离或 SLA 规则。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewOwnerNavigation` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，52 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3026/data-quality/review-cases/CASE-QUERY-001` 命中 `同 Owner 待处理导航`、`当前案例不在待处理序列`、`进入首条待处理` 和 `同 Owner 处理上下文`。
- in-app browser navigation smoke：点击 `进入首条待处理` 后进入 `CASE-EVIDENCE-SMOKE-001`，命中 `第 1 / 2 条` 和 `下一条待处理`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-02 - IM070 复核工作台同 Owner 首条待处理入口

#### 审计结论

- `IM070/US690` 已在 `/data-quality/review-cases` 的分组面板增加只读 `同 Owner 首条待处理` 区块。
- 区块按 owner 聚合当前筛选结果，展示待处理数量、首条待处理阶段、进入首条待处理详情入口和 owner 列表入口。
- 入口与 `IM069` 的详情页同 owner 待处理导航衔接，主管可从列表页直接进入连续处理链路。
- 本轮未新增后端 API，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、写入动作、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前入口仍基于列表页已有数据和阶段快照，适合本地 MVP；生产大规模 owner 首条待处理仍需要后续后端聚合和分页优化。
- 该入口只是只读导航，不是批量分派、审批队列、权限隔离或 SLA 规则。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewOwnerFirstPendingEntries` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，53 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3028/data-quality/review-cases?processingStage=missing_conclusion` 命中 `同 Owner 首条待处理`、`进入首条待处理`、`查看 Owner 列表` 和 `复核案例列表`。
- in-app browser navigation smoke：点击 `进入首条待处理` 后进入 `CASE-EVIDENCE-SMOKE-001`，命中 `同 Owner 待处理导航`、`第 1 / 2 条` 和 `下一条待处理`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-02 - IM071 复核详情处理动作区整合

#### 审计结论

- `IM071/US691` 已在 `/data-quality/review-cases/[caseId]` 增加统一 `处理动作区`。
- 动作区展示当前推荐动作、材料摘要、主入口状态，并用 shadcn Tabs 收纳 `补证据`、`补结论` 和 `关闭案例` 三个现有处理入口。
- 三个入口复用已有 evidence、conclusion 和 closure 本地 API；本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前处理动作区仍是本地 MVP 的单案例处理入口，不是审批流、权限隔离、批量处理或 SLA 队列。
- 生产规模下的处理动作状态仍建议后续由后端聚合接口返回，避免详情页多处派生。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewCaseActionDeck` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，54 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3029/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001` 命中 `处理动作区`、`当前推荐动作`、`补证据`、`补结论`、`关闭案例` 和 `处理边界`。
- in-app browser tab smoke：点击 `关闭案例` tab 后命中 `关闭复核案例`、`不可关闭` 和 `缺少复核结论`。
- in-app browser closed-case smoke：`http://127.0.0.1:3029/data-quality/review-cases/CASE-QUERY-001` 命中 `处理动作区`、`已关闭` 和 `案例已关闭；后续只读追溯处理动作、证据和结论`，且 `提交证据`、`提交结论`、`关闭案例` 按钮数量均为 0。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-02 - IM072 复核动作提交反馈统一化

#### 审计结论

- `IM072/US692` 已在 `/data-quality/review-cases/[caseId]` 的统一 `处理动作区` 顶部增加提交反馈条。
- 页面解析现有 `evidence`、`conclusion`、`closure` URL 结果参数，展示动作名称、写入状态和下一步建议。
- 无提交结果参数时不展示反馈条，不影响原有动作区、tab 入口和处理边界。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前反馈只反映已有 server action redirect 参数，不代表生产级事件通知、权限审计或持久化消息中心。
- 生产化后建议由后端返回结构化 action result 或操作流水，避免多个页面各自解释 URL 参数。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewCaseActionFeedback` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，55 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3030/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001?evidence=success` 命中 `处理动作区`、`补证据提交成功`、`已写入` 和 `继续补充结论或复核关闭条件。`。
- in-app browser production smoke：`http://127.0.0.1:3030/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001?conclusion=failed` 命中 `处理动作区`、`补结论提交失败`、`写入失败` 和失败重试建议。
- in-app browser production smoke：`http://127.0.0.1:3030/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001?closure=success` 命中 `处理动作区`、`关闭案例提交成功`、`已关闭` 和关闭追溯建议。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-02 - IM073 复核提交后的续办导航

#### 审计结论

- `IM073/US693` 已在 `/data-quality/review-cases/[caseId]` 的统一 `处理动作区` 内增加 `续办导航`。
- 续办导航只在提交反馈出现时展示，复用现有同 owner 待处理序列，优先给出下一条待处理案例入口。
- 续办导航始终保留返回同 owner 复核列表入口，主管可继续处理或回到列表重新筛选。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前续办导航仍基于详情页已有 list API 和逐详情阶段快照，适合本地 MVP；生产大规模连续处理仍建议由后端返回结构化下一条任务。
- 该导航不是任务分派、审批队列、权限隔离或 SLA 规则。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewCaseActionContinuation` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，56 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3031/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001?evidence=success` 命中 `处理动作区`、`补证据提交成功`、`续办导航`、`继续处理下一条` 和 `返回同 Owner 列表`。
- in-app browser link smoke：`继续处理下一条` 指向 `/data-quality/review-cases/CASE-CONCLUSION-SMOKE-001`，`返回同 Owner 列表` 指向 `/data-quality/review-cases?businessDate=2026-05-11&ownerId=supervisor-01`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM074 复核提交失败后的重试定位

#### 审计结论

- `IM074/US694` 已在 `/data-quality/review-cases/[caseId]` 的统一 `处理动作区` 内增加失败后的 `重试定位`。
- 当 URL 返回 `evidence=failed`、`conclusion=failed` 或 `closure=failed` 时，动作区展示对应动作的重试提示，并默认打开对应 tab。
- 成功反馈或无反馈时不展示重试定位，仍按原推荐动作打开 tab。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前定位依据仍是现有 URL 参数，不是生产级操作流水；后续生产化建议由后端返回结构化 action result。
- 该能力只是单案例重试定位，不是任务分派、审批队列、权限隔离或批量重试。

#### 验证

- TDD 红灯：前端模型测试先因缺少 `summarizeImportReviewCaseActionRetry` export 失败。
- `node scripts/tests/import-center-model.test.mjs`：通过，57 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3032/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001?conclusion=failed` 命中 `处理动作区`、`补结论提交失败`、`重试定位`、`已定位到补结论`、`当前已打开补结论入口` 和 `补充复核结论`，且 active tab 为 `补结论`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM075 复核提交成功后的当前案例优先续办

#### 审计结论

- `IM075/US695` 已修正 `/data-quality/review-cases/[caseId]` 成功反馈后的续办优先级。
- 当当前案例仍在同 owner 待处理序列中，续办主入口显示 `继续处理当前案例`，避免补证据成功后误跳到其他案例。
- 当前案例已关闭或不在待处理序列时，续办导航仍回退到同 owner 下一条或首条待处理案例。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前优先级仍基于详情页已有 list API 和阶段快照，适合本地 MVP；生产连续处理仍建议由后端返回结构化队列游标。
- 该能力不是任务分派、审批队列、权限隔离或 SLA 规则。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧行为会把成功反馈续办主入口指向同 owner 下一条 `CASE-READY-CLOSE`。
- `node scripts/tests/import-center-model.test.mjs`：通过，57 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3033/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001?evidence=success` 命中 `补证据提交成功`、`续办导航`、`当前案例仍待处理` 和 `继续处理当前案例`，且主入口链接指向 `/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM076 复核关闭成功后的队列交接提示

#### 审计结论

- `IM076/US696` 已修正 `/data-quality/review-cases/[caseId]` 关闭成功后的续办导航语义。
- 当 URL 返回 `closure=success`，且当前案例已经不在同 owner 待处理序列中时，续办导航展示 `当前案例已关闭`。
- 存在下一条待处理案例时，主入口展示 `关闭后处理下一条` 并指向下一条详情页。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未新增页面路由或 UI 组件，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前交接提示仍基于 URL action result、现有 list API 和阶段快照；生产队列游标、权限隔离和 SLA 归属仍需后续独立任务。
- 该能力只是关闭成功后的前端交接说明，不是审批完成、任务分派或批量关闭。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧行为只显示普通 `继续处理下一条`，没有关闭交接语义。
- `node scripts/tests/import-center-model.test.mjs`：通过，57 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3034/data-quality/review-cases/CASE-QUERY-001?closure=success` 命中 `关闭案例提交成功`、`当前案例已关闭` 和 `关闭后处理下一条`，且主入口链接指向 `/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM077 复核续办返回列表保留未关闭焦点

#### 审计结论

- `IM077/US697` 已让复核详情同 Owner 列表入口保留未关闭焦点。
- 同 Owner 待处理导航的 listHref 现在包含 `status=open`。
- 提交成功、关闭成功和失败反馈下的续办导航返回同 Owner 列表入口复用该链接，避免回到列表后混入已关闭案例。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未新增页面路由或 UI 组件，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前只是前端链接焦点，不是权限过滤或后端任务队列游标。
- 如果后续要做生产队列，需要后端返回明确的 owner queue cursor 和权限范围。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧链接没有 `status=open`。
- `node scripts/tests/import-center-model.test.mjs`：通过，57 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3035/data-quality/review-cases/CASE-EVIDENCE-SMOKE-001?evidence=success` 命中 `续办导航`，且 `返回同 Owner 列表` 链接为 `/data-quality/review-cases?businessDate=2026-05-11&ownerId=supervisor-01&status=open`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM078 字段映射模板维护详情页

#### 审计结论

- `IM078/US698` 已新增独立二级页 `/data-quality/field-mapping-templates/[templateId]`，模板维护不再堆在批次详情长页中。
- 页面展示模板名称、模板 ID、启用状态、文件类型、创建信息、字段映射明细、更新表单和维护边界。
- 更新表单复用现有 `PATCH /api/v1/import-field-mapping-templates/{template_id}`；停用入口复用现有 deactivate API，停用模板不展示重复停用入口。
- 批次详情页的字段映射模板卡片新增 `维护模板` 入口，链接到独立详情页。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前只维护已有模板，不新增模板创建页；新增模板仍依赖已有后端 API 或后续独立任务。
- 停用是现有 API 的单模板动作，不是批量模板治理、审批或权限隔离。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧模型没有模板详情页 href、单模板 API URL、停用 API URL 和维护结果反馈摘要。
- `node scripts/tests/import-center-model.test.mjs`：通过，59 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过，新路由出现在 Next build route 表中。
- in-app browser production smoke：`http://127.0.0.1:3036/data-quality/field-mapping-templates/TPL-IM027-SMOKE-001` 命中 `模板维护`、`维护边界`、`保存模板` 和 `停用模板`；批次详情页 `导入与模板` tab 存在 `维护模板` 链接；无害更新提交后命中 `模板已更新` 成功反馈。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM079 字段映射模板新增页

#### 审计结论

- `IM079/US699` 已新增独立二级页 `/data-quality/field-mapping-templates/new`。
- 新增页包含模板 ID、模板名称、文件类型、创建人和字段映射 JSON 表单。
- 新增提交复用现有 `POST /api/v1/import-field-mapping-templates`，成功后跳转对应模板详情页并带 `template=success&action=create` 反馈参数。
- 字段映射模板管理区新增 `新增模板` 入口，指向独立新增页。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 浏览器插件本轮对按钮点击有 3 秒 CDP 超时，提交动作未作为浏览器点击证据；create API 行为由现有后端 unittest 和完整门禁覆盖，页面渲染和入口由 DOM smoke 与源码检查覆盖。
- 当前新增是单模板创建，不是模板批量导入、审批或权限隔离。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧模型没有 create API URL、新增页 href 和创建成功反馈。
- `node scripts/tests/import-center-model.test.mjs`：通过，59 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，沿用 5 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过，新路由出现在 Next build route 表中。
- in-app browser production smoke：`http://127.0.0.1:3037/data-quality/field-mapping-templates/new` 命中 `新增字段映射模板`、`模板 ID`、`模板名称`、`字段映射 JSON`、`创建模板` 和 `创建边界`。
- 静态入口检查：`components/import-center-template-management-panel.tsx` 存在 `新增模板` 链接，href 来源为 `buildImportFieldMappingTemplateNewWorkspaceHref()`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM080 字段映射模板上传预选链路

#### 审计结论

- `IM080/US700` 已把字段映射模板维护和 CSV 上传工具打通。
- 批次详情页的模板维护入口会携带来源 `batchId`，避免模板详情页丢失返回上传工具的上下文。
- 模板详情页对启用模板展示 `用此模板上传`，链接到 `/data-quality/{batchId}?templateId={templateId}#import-detail-workspace`。
- 批次处理页读取 `templateId` 查询参数后默认打开 `导入与模板` tab，并传给 CSV 上传表单。
- CSV 上传表单默认选中启用模板并展示预选提示；停用或缺失模板不会被默认使用，并展示不可用提示。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前链路仍依赖批次详情页作为上传工具承载页；后续若做独立上传中心，可以把预选逻辑迁移到专用上传页。
- 该能力是单模板预选，不是批量模板治理、审批、权限隔离或真实外部接入。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧模型没有模板上传 href、来源 batchId 透传和上传预选摘要。
- `node scripts/tests/import-center-model.test.mjs`：通过，62 个 import-center model 测试通过。
- shadcn 复核：本轮新增 UI 复用现有 Card/Button/Badge/Input，图标改用 `data-icon`，并把同文件旧硬编码提示色改为语义 token。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- in-app browser production smoke：`http://127.0.0.1:3038/data-quality/field-mapping-templates/TPL-IM027-SMOKE-001?batchId=BATCH-IM027-SMOKE-001` 命中 `用此模板上传`，href 为 `/data-quality/BATCH-IM027-SMOKE-001?templateId=TPL-IM027-SMOKE-001#import-detail-workspace`；继续打开该链接后，页面默认选中 `导入与模板` tab，CSV 上传表单存在，`template_id` 选中 `TPL-IM027-SMOKE-001`，并展示 `已预选字段映射模板`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM081 独立 CSV 上传工作区

#### 审计结论

- `IM081/US701` 已新增独立二级页 `/data-quality/uploads/new`，CSV 上传不再只能从已有批次详情页进入。
- 数据质量列表页新增 `上传 CSV` 入口，指向独立上传工作区。
- 字段映射模板详情页对启用模板仍保留 `用此模板上传`；有来源批次时回到批次处理页，无来源批次时进入独立上传页并携带 `templateId`。
- 独立上传页复用现有 `ImportCenterUploadForm`、`uploadImportCsvAction` 和字段映射模板 API，并通过 `上传 CSV` / `字段映射模板` tab 分层展示。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前上传仍是 CSV 单批上传，不支持 Excel、multipart 扩展、批量上传或上传审批。
- 上传成功后的写入和跳转继续沿用现有 action；生产级上传队列、权限隔离和审计流水仍需后续独立任务。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧模型没有独立上传工作区 href。
- `node scripts/tests/import-center-model.test.mjs`：通过，63 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过，新路由出现在 Next build route 表中。
- production DOM smoke：`http://127.0.0.1:3040/data-quality/uploads/new?templateId=TPL-IM027-SMOKE-001` 命中 `CSV 上传工作区`、`已预选字段映射模板`，且 `template_id` defaultValue 为 `TPL-IM027-SMOKE-001`；模板详情页命中 `/data-quality/uploads/new?templateId=TPL-IM027-SMOKE-001` 与 `用此模板上传`；数据质量列表页命中 `/data-quality/uploads/new` 与 `上传 CSV`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM082 独立上传结果回流

#### 审计结论

- `IM082/US702` 已让独立上传页提交后回到 `/data-quality/uploads/new` 显示结果反馈，而不是统一回到数据质量列表页。
- 独立上传表单通过隐藏字段设置固定返回目标；server action 只接受 `/data-quality/uploads/new` 这个受控目标，其他值走原有 `/data-quality` 行为。
- 成功反馈和带批次的失败反馈都链接到 `/data-quality/{batchId}` 二级批次处理页，方便上传后立即检查行结果、失败行和应用准备度。
- 批次详情页内的上传表单不设置独立页返回目标，原有批次语境不被破坏。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。

#### 风险

- 当前只是单次上传后的前端回流，不是上传队列、批量上传或审批发布流。
- 上传结果仍依赖现有 API 响应和 URL 参数；生产级审计流水、权限隔离和批量重试仍需后续独立任务。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧模型没有独立上传结果回流 href；随后结果反馈测试先失败，证明旧反馈入口仍指向列表页。
- `node scripts/tests/import-center-model.test.mjs`：通过，64 个 import-center model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- production DOM smoke：`http://127.0.0.1:3042/data-quality/uploads/new?upload=success&batch=BATCH-IM082-SMOKE-001` 命中 `CSV 上传成功`、`进入批次处理`、`/data-quality/BATCH-IM082-SMOKE-001` 和 `result_redirect_to`；失败页命中 `CSV 上传失败`、`api_409`、二级批次链接和 `result_redirect_to`；批次详情页未出现 `result_redirect_to`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM083 单批次导入应用写入入口

#### 审计结论

- `IM083/US703` 已在 `/data-quality/[batchId]` 二级批次处理详情页新增单批次应用区。
- readiness ready 且未应用的批次展示 `应用到业务数据` 提交入口，并通过 server action 按 file_type 调用现有 apply API。
- 应用结果通过 `apply=success|failed` 回到当前批次详情页展示反馈，不跳回列表，也不改变独立上传页回流逻辑。
- readiness 阻塞、已应用或准备度未知时只展示原因和下一步，不展示写入按钮。
- 本轮未新增后端 route，未新增依赖，未修改 package/lockfile，未新增 schema/migration，未触碰审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。

#### 风险

- 当前只支持单批次手动应用，不是批量应用、审批发布、权限隔离或任务队列。
- apply API 的写入和幂等仍由现有后端控制；前端只负责 ready 状态下的受控入口和结果反馈。

#### 验证

- TDD 红灯：前端模型测试先失败，证明旧模型没有 apply API URL builder、单批次应用摘要和应用结果反馈。
- `node scripts/tests/import-center-model.test.mjs`：通过，67 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run build`：通过。
- production DOM smoke：`BATCH-IM083-SMOKE-002` readiness 为 ready，`http://127.0.0.1:3043/data-quality/BATCH-IM083-SMOKE-002?apply=success` 命中 `批次应用成功`、`单批次应用已就绪`、`应用到业务数据` 和版本 `BATCH-IM083-SMOKE-002::v1`；blocked 批次 `BATCH-IM026-SMOKE-004` 命中 `应用前仍有阻塞`、`不可应用`、`暂不可应用`，且未命中 `应用到业务数据`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM094 版本工作台单次本地比对提交

#### 审计结论

- `IM094/US714` 已在 `/data-quality/versions` 将完整来源版本组合的 `本地比对` 候选升级为受控提交入口。
- 提交入口通过 server action 复用现有 `comparison-runs/calculate` API，不新增后端 route、schema/migration 或依赖。
- 成功或失败都回到版本工作台；成功文案明确为生成或复用一个本地对比运行，避免暗示重复提交会创建多条运行。
- 不支持业务域、未应用批次、缺 import version 或来源版本组合不完整时仍不展示提交按钮。
- 本轮未触碰审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 当前只是单版本、单次、本地提交入口，不是批量计算、自动计算或生产调度编排。
- 当前本地 smoke 数据没有完整配对版本，ready 提交按钮由模型测试覆盖；页面 smoke 覆盖成功/失败反馈和 blocked 状态。

#### 验证

- `node scripts/tests/import-center-model.test.mjs`：通过，77 个 import-center model 测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- HTTP smoke：`http://127.0.0.1:3000/data-quality/versions?compare=success&compareRun=RUN-IM094-SMOKE` 命中 `本地比对已提交`、`RUN-IM094-SMOKE` 和生成/复用说明。
- HTTP smoke：`http://127.0.0.1:3000/data-quality/versions?compare=failed&compareReason=missing_required_fields` 命中 `本地比对未提交` 和 `提交参数不完整`。
- `git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM095 版本工作台计算后结果回看

#### 审计结论

- `IM095/US715` 已增强 `/data-quality/versions` 的本地比对提交后结果回看卡片。
- 当提交返回的运行已在当前 comparison run 列表回显时，卡片展示运行 ID、对比口径、结果数、关键差异和业务日，并提供进入 comparison run detail 的入口。
- 当运行暂未回显时，卡片展示 `待回显` 指标和明确阻塞说明，不伪造结果规模或关键差异。
- 本轮复用现有 comparison run list 数据和 detail 路由，未新增后端 API、schema/migration 或依赖。
- 本轮未触碰审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 当前回看卡片只依赖页面可见的 comparison run 列表；若提交后列表尚未同步，会显示阻塞态而不是完整结果。
- 这是单次本地比对后的回看入口，不是批量计算、自动计算或生产调度编排。

#### 验证

- `node scripts/tests/import-center-model.test.mjs`：通过，78 个 import-center model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/data-quality/versions?businessDate=2026-05-11&compare=success&compareRun=RUN-DEMO-FS-20260511` 命中 `版本工作台本地比对结果`、`RUN-DEMO-FS-20260511`、`预测排班`、`结果数` 和 `缺口`。
- HTTP smoke：`http://127.0.0.1:3000/data-quality/versions?businessDate=2026-05-11&compare=success&compareRun=RUN-NOT-YET-IM095` 命中 `运行结果暂未回显`、`RUN-NOT-YET-IM095`、`不伪造结果规模或关键差异` 和 `待回显`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM096-IM098 主数据维护链路规划

#### 审计结论

- 已从空 current 状态拆出 `R796-R798 / US716-US718 / IM096-IM098`。
- 当前只将 `US716/IM096` 放入 `docs/current/**`，作为唯一 ready 任务。
- 推荐顺序为：主数据维护只读工作台入口、实体详情与引用影响、受控维护动作。
- 规划明确先不进入后端 API、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证

- `bash scripts/check-state.sh --strict`：通过，current 队列只包含 `US716/IM096`，registry 无 lifecycle state 字段，current 文件行数均在预算内。
- `git diff --check`：通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`：通过，包含 frontend build 和 backend 177 tests OK。

### 2026-06-03 - IM096 主数据维护工作台只读入口

#### 审计结论

- `IM096/US716` 已新增 `/master-data` 只读主数据维护工作台，并接入现有系统管理导航。
- 工作台按坐席、职场、供应商、项目、技能和绑定关系展示维护范围、引用影响、来源批次/版本、阻塞原因和后续入口状态。
- 页面复用现有 import-batches 查询，不新增后端 API、schema/migration、依赖或生产持久化配置。
- 本轮未开放新增、编辑、冻结、有效期调整、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- 当前状态已推进到 `US717/IM097`，用于后续实体详情和引用影响可视化。

#### 验证

- `node scripts/tests/master-data-maintenance-model.test.mjs`：通过，4 个 master-data maintenance model 测试通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- HTTP smoke：`http://127.0.0.1:3000/master-data` 命中 `主数据维护`、`只读工作台`、六类实体分组、系统管理导航选中态和 `维护动作待 IM098`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM097 主数据实体详情与引用影响

#### 审计结论

- `IM097/US717` 已从 `/master-data` 六类对象进入 `/master-data/[entityKey]` 详情页。
- 详情页展示来源批次/版本、实体级有效期空态、冻结状态空态和引用影响摘要。
- 引用影响覆盖排班、预测、登录/状态日志、比对与复核链路；缺少明细时展示 `不伪造数量`，不构造假影响。
- 非法实体 key 返回 404。
- 本轮未新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- 当前队列回到空，因为 `IM098` 是受控维护动作，需 PM 单独确认。

#### 验证

- `node scripts/tests/master-data-maintenance-model.test.mjs`：通过，7 个 master-data maintenance model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/master-data` 命中六个详情入口；`http://127.0.0.1:3000/master-data/bindings` 命中 `绑定关系详情与引用影响`、`有效期`、`冻结状态`、四类引用影响和 `不伪造数量`；`/master-data/missing` 返回 404。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM098 主数据受控维护动作安全壳

#### 审计结论

- `IM098/US718` 已在 `/master-data/[entityKey]` 详情页新增受控维护动作区域。
- 动作按新增、编辑、冻结、有效期调整拆分，且每个动作都限定为单实体范围，不混成批量能力。
- 每个动作展示引用校验要求和失败边界；本地来源阻塞时显示先处理来源批次。
- 提交按钮保持禁用并显示 `暂不提交`，未接入后端写入。
- 本轮未新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- 当前队列回到空。

#### 验证

- `node scripts/tests/master-data-maintenance-model.test.mjs`：通过，7 个 master-data maintenance model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/master-data/bindings` 命中受控维护动作、新增/编辑/冻结/有效期调整、来源阻塞失败边界和 `暂不提交`；`/master-data/agents` 命中单坐席范围和非批量说明。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM099-IM101 人员排班生产链路规划

#### 审计结论

- 已从空 current 状态拆出 `R799-R801 / US719-US721 / IM099-IM101`。
- 当前只将 `US719/IM099` 放入 `docs/current/**`，作为唯一 ready 任务。
- 推荐顺序为：人员排班生产只读工作台、排班版本详情与 0.5h 展开结果、发布/冻结边界安全壳。
- 规划明确先不进入后端 API、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证

- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-03 - IM099 人员排班生产工作台只读入口

#### 审计结论

- `IM099/US719` 已新增 `/schedule-plans/production`，入口位于现有计划与排班导航下，不创建新的首页。
- 工作台复用现有导入批次列表，按人员排班批次展示来源批次、业务版本、业务日范围、应用状态、0.5h 展开状态和阻塞原因。
- 页面明确当前只读：版本详情待 IM100，发布/冻结边界待 IM101；本轮不发布、不冻结、不触发自动排班。
- 本轮未新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。
- 当前状态已推进到 `US720/IM100`，用于后续单版本详情和 0.5h 展开结果可视化。

#### 风险

- 当前 0.5h 展开只根据已应用版本和应用记录数判断可见状态，不展示人员级明细。
- 这是只读生产台账，不是发布、冻结、自动排班或生产状态写入。

#### 验证

- `node scripts/tests/personnel-schedule-production-model.test.mjs`：通过，4 个 personnel-schedule production model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/schedule-plans/production` 命中 `排班生产`、`只读工作台`、`人员排班生产台账`、`版本详情待 IM100` 和 `发布/冻结边界待 IM101`。
- in-app browser smoke：当前 URL 为 `/schedule-plans/production`，页面命中只读工作台、台账和 IM100 后续提示，侧边栏只有 `排班生产` 处于 active 状态。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM100 人员排班版本详情与 0.5h 展开结果

#### 审计结论

- `IM100/US720` 已新增 `/schedule-plans/production/[batchId]`，从排班生产工作台的版本行进入。
- 详情页展示来源批次/版本、业务日范围、应用状态、成功导入行、班次引用口径、人员范围说明、0.5h 展开状态和阻塞原因。
- 当前本地列表 API 没有人员清单、班次明细或逐 0.5h 明细，页面明确展示 `不伪造人员级明细`，不构造假数据。
- 工作台原有 `版本详情待 IM100` 文案已更新为版本详情可查看，发布/冻结边界仍待 IM101。
- 本轮未新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- 当前状态已推进到 `US721/IM101`，该任务涉及发布/冻结边界安全壳，进入实现前需要 PM 确认。

#### 风险

- 当前详情页只基于 import-batch list 的应用摘要展示，不展示真实人员名单、班次引用明细或半小时行明细。
- 本地 API 当前没有 personnel_schedule 批次，页面 smoke 覆盖未知批次/无展开记录阻塞态；已应用版本详情由模型测试覆盖。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `summarizePersonnelScheduleProductionDetail`。
- `node scripts/tests/personnel-schedule-production-model.test.mjs`：通过，7 个 personnel-schedule production model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/schedule-plans/production/BATCH-MISSING-IM100` 命中 `排班版本详情`、`排班版本未定位`、`不伪造人员级明细`、`暂未发现 0.5h 展开记录` 和 `返回排班生产`。
- in-app browser smoke：当前 URL 为 `/schedule-plans/production/BATCH-MISSING-IM100`，命中详情页、阻塞态、0.5h 阻塞、不伪造人员级明细和返回入口。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM101 人员排班发布冻结边界安全壳

#### 审计结论

- `IM101/US721` 已在 `/schedule-plans/production/[batchId]` 详情页新增发布、冻结、取消发布三类生产动作边界安全壳。
- 每类动作展示来源版本、0.5h 展开校验、引用校验和失败边界。
- 动作按钮分别显示 `暂不发布`、`暂不冻结`、`暂不取消发布`，均为禁用状态。
- 本轮没有新增表单、server action、后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- IM099-IM101 人员排班生产链路已闭合，当前队列回到空。

#### 风险

- 当前只是安全壳，不改变生产排班发布或冻结状态。
- 引用校验为前端边界说明，真实校验和写入需要后续单独确认后再拆任务。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `actionShellTitle` 和 `actionShells`。
- `node scripts/tests/personnel-schedule-production-model.test.mjs`：通过，7 个 personnel-schedule production model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/schedule-plans/production/BATCH-MISSING-IM101` 命中 `发布/冻结边界安全壳`、`发布版本`、`冻结版本`、`取消发布`、`暂不发布`、`暂不冻结`、`暂不取消发布` 和 `引用校验待接入`。
- in-app browser smoke：当前 URL 为 `/schedule-plans/production/BATCH-MISSING-IM101`，命中安全壳和三类动作，且三个按钮均为 disabled。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM102-IM104 需求预测生产链路规划

#### 审计结论

- 已从空 current 状态拆出 `R802-R804 / US722-US724 / IM102-IM104`。
- 当前只将 `US722/IM102` 放入 `docs/current/**`，作为唯一 ready 任务。
- 推荐顺序为：需求预测生产只读工作台、预测版本详情与对齐结果、变更追踪边界安全壳。
- 规划明确先不进入后端 API、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证

- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM102 需求预测生产工作台只读入口

#### 审计结论

- `IM102/US722` 已新增 `/demand-plans/production`，入口位于现有计划与排班导航下，不创建新的首页。
- 工作台复用现有导入批次列表，按需求预测批次展示来源批次、预测业务版本、业务日范围、应用状态、技能组/等级/时段对齐状态和阻塞原因。
- 页面明确当前只读：版本详情待 IM103，变更追踪边界待 IM104；本轮不调整预测、不写变更记录、不触发自动排班。
- 本轮未新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。
- 当前状态已推进到 `US723/IM103`，用于后续单版本详情和对齐结果可视化。

#### 风险

- 当前对齐状态只根据已应用版本和应用记录数判断，不展示技能组/等级/时段明细。
- 这是只读生产台账，不是预测调整、变更追踪写入或自动排班入口。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `summarizeDemandForecastProductionWorkbench`。
- `node scripts/tests/demand-forecast-production-model.test.mjs`：通过，4 个 demand-forecast production model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/demand-plans/production` 命中 `预测生产`、`只读工作台`、`需求预测生产台账`、`版本详情待 IM103` 和 `变更追踪边界待 IM104`。
- in-app browser smoke：当前 URL 为 `/demand-plans/production`，页面命中只读工作台、台账和 IM103/IM104 后续提示，侧边栏只有 `预测生产` 处于 active 状态。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM103 需求预测版本详情与对齐结果

#### 审计结论

- `IM103/US723` 已新增 `/demand-plans/production/[batchId]`，从预测生产工作台的版本行进入。
- 详情页展示来源批次/版本、业务日范围、应用状态、成功导入行、技能组/等级对齐边界、0.5h 时段口径、对齐结果和阻塞原因。
- 当前本地列表 API 没有技能组、等级或逐 0.5h 明细，页面明确展示 `不伪造技能组/等级/时段行`，不构造假数据。
- 工作台原有 `版本详情待 IM103` 文案已更新为版本详情可查看，变更追踪边界仍待 IM104。
- 本轮未新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- 当前状态已推进到 `US724/IM104`，该任务涉及变更追踪边界安全壳，进入实现前需要 PM 确认。

#### 风险

- 当前详情页只基于 import-batch list 的应用摘要展示，不展示真实技能组、等级或半小时预测明细。
- 本地 API 当前没有 demand_forecast 批次，页面 smoke 覆盖未知批次/无对齐记录阻塞态；已应用版本详情由模型测试覆盖。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `summarizeDemandForecastProductionDetail`。
- `node scripts/tests/demand-forecast-production-model.test.mjs`：通过，7 个 demand-forecast production model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- HTTP smoke：`http://127.0.0.1:3000/demand-plans/production/BATCH-MISSING-IM103` 命中 `预测版本详情`、`预测版本未定位`、`不伪造技能组/等级/时段行`、`暂未发现 0.5h 预测明细`、`变更追踪边界待 IM104` 和 `返回预测生产`。
- in-app browser smoke：当前 URL 为 `/demand-plans/production/BATCH-MISSING-IM103`，命中详情页、阻塞态、0.5h 阻塞、不伪造预测明细和返回入口，且侧边栏 `预测生产` 处于 active 状态。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM104 需求预测变更追踪边界安全壳

#### 审计结论

- `IM104/US724` 已在 `/demand-plans/production/[batchId]` 详情页新增变更追踪边界安全壳。
- 安全壳展示来源版本前置校验、技能组/等级/0.5h 时段校验、下游影响校验和失败边界。
- 动作按钮分别显示 `暂不写入`、`暂不提交`、`暂不变更`，均为禁用状态。
- 本轮没有新增表单、server action、后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- IM102-IM104 需求预测生产链路已闭合，当前队列回到空。

#### 风险

- 当前只是安全壳，不记录真实预测变更，不提交下游影响校验，不改变生产预测口径。
- 下游影响校验为前端边界说明，真实写入和影响计算需要后续单独确认后再拆任务。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `changeTracking`。
- `node scripts/tests/demand-forecast-production-model.test.mjs`：通过，8 个 demand-forecast production model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- in-app browser smoke：`http://127.0.0.1:3000/demand-plans/production/BATCH-MISSING-IM103` 命中 `变更追踪边界安全壳`、`来源版本未定位`、`下游影响校验阻塞`、`写入动作进入前需要单独确认`，且禁用按钮为 `暂不写入`、`暂不提交`、`暂不变更`。
- 本地 API 当前没有 demand_forecast 批次，已应用版本的安全壳路径由模型测试覆盖。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM105-IM107 登录/状态日志生产链路规划

#### 审计结论

- 已从空 current 状态拆出 `R805-R807 / US725-US727 / IM105-IM107`。
- 当前只将 `US725/IM105` 放入 `docs/current/**`，作为唯一 ready 任务。
- 推荐顺序为：登录/状态日志生产只读工作台、单批次处理解释详情、状态字典与异常解释安全壳。
- 入口归属为现有 `数据与集成` 下的 `CORN 状态日志`，不创建新的首页。
- 规划明确先不进入后端 API、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证

- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-04 - IM105 登录/状态日志生产工作台只读入口

#### 审计结论

- `IM105/US725` 已新增 `/actual-logs/production`，入口位于现有 `数据与集成` 下的 `CORN 状态日志`。
- 工作台复用现有导入批次列表，按 `login_log` / `status_log` 展示来源批次、实际日志业务版本、业务日范围、应用状态、时区边界、跨天处理边界和阻塞原因。
- 页面明确当前只读：不改状态字典、不重算实际工时、不触发排班 vs 实际比对。
- 本轮未新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。
- 当前状态已推进到 `US726/IM106`，用于后续单批次处理解释详情。

#### 风险

- 当前工作台只基于 import-batch list 的应用摘要展示，不展示逐行登录事件、状态区间或真实跨天切分明细。
- 本地 API 当前没有 login_log/status_log 批次，页面 smoke 覆盖空态与只读边界；已应用/阻塞版本路径由模型测试覆盖。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `actual-log-production-model.ts`。
- `node scripts/tests/actual-log-production-model.test.mjs`：通过，4 个 actual-log production model 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `node scripts/check-shadcn-ui.mjs`：通过，剩余 3 个 documented baseline finding，无新增 shadcn/ui 规则违例。
- in-app browser smoke：`http://127.0.0.1:3000/actual-logs/production` 命中 `CORN 状态日志生产`、`登录/状态日志生产台账`、`时区只读解释`、`跨天处理边界` 和 `当前不触发比对`，且 `CORN 状态日志` 导航项处于 active 状态。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM141 职场详情页运营主体收敛

#### 审计结论

- `IM141` 已新增 `/master-data/sites/[workplaceId]` 职场子详情页。
- `/master-data/sites` 仅对职场行提供 `详情` 入口，不恢复独立 `职场运营主体` 或 `绑定关系` 导航。
- 职场详情页展示职场信息和该职场下的运营主体，运营主体来源限定为现有人员档案与绑定关系读取。
- 本轮没有新增后端 route、schema/migration、依赖、权限、审批、导出、批量、真实外部接口、自动排班、生产公式、结算、供应商合同、最低人力或收费因子。

#### 风险

- 当前运营主体中的供应商团队只展示供应商 ID；供应商名称、合同、结算比例、最低人力要求需要后续供应商详情/合同任务单独确认。
- 当前详情页只读，不提供职场编辑或运营主体维护动作。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `summarizeMasterDataWorkplaceDetail`。
- TDD 红灯：产品结构测试先失败，证明旧代码没有 `/app/master-data/sites/[workplaceId]/page.tsx`。
- `node --experimental-strip-types --test scripts/tests/master-data-maintenance-model.test.mjs`：通过，17 个 master-data model 测试通过。
- `node --test scripts/tests/product-structure.test.mjs`：通过，6 个 product-structure 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3000/master-data/sites` 命中职场详情入口；`http://127.0.0.1:3000/master-data/sites/SH-01` 命中 `职场信息` 和 `运营主体`，且未出现独立运营主体/绑定关系入口、合同、结算或最低人力文案。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM142 供应商详情页服务职场收敛

#### 审计结论

- `IM142` 已新增 `/master-data/vendors/[vendorId]` 供应商子详情页。
- `/master-data/vendors` 仅对供应商行提供 `详情` 入口，不新增供应商合同、结算或最低人力入口。
- 供应商详情页展示供应商信息和该供应商服务职场，服务职场来源限定为现有人员归属记录，并可跳转回对应职场详情。
- 本轮没有新增后端 route、schema/migration、依赖、权限、审批、导出、批量、真实外部接口、自动排班、生产公式、结算、供应商合同、最低人力或收费因子。

#### 风险

- 当前服务职场只读展示，不维护供应商合同、结算比例、最低人力要求。
- 当前供应商详情依赖现有人员归属记录；如果本地没有对应记录，页面展示明确空态。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `summarizeMasterDataVendorDetail`。
- TDD 红灯：产品结构测试先失败，证明旧代码没有 `/app/master-data/vendors/[vendorId]/page.tsx`。
- `node --experimental-strip-types --test scripts/tests/master-data-maintenance-model.test.mjs`：通过，19 个 master-data model 测试通过。
- `node --test scripts/tests/product-structure.test.mjs`：通过，8 个 product-structure 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3000/master-data/vendors` 命中供应商详情入口；`http://127.0.0.1:3000/master-data/vendors/SUP-A` 命中 `供应商信息`、`服务职场` 和 `查看职场`，且未出现合同、结算或最低人力文案。详情页侧边栏默认展开全部一级组，并分别高亮 `供应商` 与 `职场` 父项。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM143 客服人员批量导入大弹窗

#### 审计结论

- `IM143` 已把 `/master-data/agents` 的人员导入入口收敛到客服人员列表内大弹窗。
- 弹窗按 PM 确认拆为 `上传文件`、`字段映射`、`导入结果` 三步；第一步提供人员 CSV 模板下载，第二步支持映射模板或手动 JSON，第三步只展示本次摘要和后续入口。
- 完整批次详情、失败行修正、readiness、应用到业务数据和业务版本链路仍由既有批次详情页承载，没有塞进弹窗。
- 本轮没有新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 当前只完成客服人员导入弹窗；排班、预测、登录/状态日志仍待后续按同一模式复用。
- 当前仍复用 CSV 上传能力；Excel/multipart 导入属于单独依赖和上传策略任务。

#### 验证

- TDD 红灯：模型测试先失败，证明旧模型没有 `summarizeMasterDataAgentImportDialog`。
- TDD 红灯：产品结构测试先失败，证明客服人员列表仍未渲染列表内导入弹窗。
- `node --experimental-strip-types --test scripts/tests/master-data-maintenance-model.test.mjs`：通过，20 个 master-data model 测试通过。
- `node --test scripts/tests/product-structure.test.mjs`：通过，9 个 product-structure 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3000/master-data/agents` 命中 `批量导入`，入口 href 为 `/master-data/agents?import_dialog=1`；`http://127.0.0.1:3000/master-data/agents?import_dialog=1&upload=success&batch=BATCH-MD-001` 命中 `客服人员批量导入`、`上传文件`、`字段映射`、`导入结果`、`下载导入模板`、`查看批次详情`、`失败行修正`，并确认 hidden `result_redirect_to=/master-data/agents?import_dialog=1` 和 `file_type=master_data`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM144 全局 UI 组件规范与客服人员导入弹窗纠偏

#### 审计结论

- `AppShell` 已改为 shadcn `SidebarProvider` + `SidebarInset`，并包裹 `TooltipProvider` 支撑 Sidebar tooltip。
- `AppSidebar` 已改为 shadcn `Collapsible` / `Sidebar` / `SidebarContent` / `SidebarGroup` / `SidebarMenu` / `SidebarMenuSub` primitives，不再手写 `<aside>`，也不再用缩进伪造二级菜单；现有菜单结构未新增，默认全部展开，主数据详情页仍继承父级高亮。
- `SiteHeader` 支持统一 `breadcrumbItems`，主数据列表、职场详情、供应商详情、客服人员新建/编辑/技能维护页都通过 `AppShell` 展示单行 Breadcrumb；Breadcrumb 包含当前页，不再额外渲染第二行视觉 H1；弹窗不展示 Breadcrumb。Header 已去掉无意义全局搜索、固定月份和通知占位，并通过右侧 `actions` 插槽承载页面级动作。
- `AppSidebar` footer 使用 shadcn Avatar 显示本地参考头像 `/shadcn-avatar.jpg`，并增加本地用户菜单、明暗主题切换和登出入口；登出入口不接真实 auth，避免在未确认鉴权任务前伪造退出能力。
- 主数据列表、详情、新建、编辑、技能维护页已移除内容区重复的返回按钮、同名 H1 和页面级说明，页面身份与返回路径由 `SiteHeader` / Breadcrumb 唯一承载，内容区只承载工具栏、筛选、表格、反馈 Alert 和业务分组。
- 客服人员列表按筛选卡片、列表操作栏、表格排序：`查询`、`重置` 位于筛选卡片右下；`新建`、`批量导入` 进入 Header 右侧页面级动作区；列表操作栏紧贴表格上方，只保留 `已选 0 项` 和批量动作。
- 客服人员导入已拆到 `components/master-data-agent-import-dialog.tsx`，使用 shadcn Dialog 严格分为上传、映射、结果三步，并通过 `hidden` 隐藏非当前 step 以保持文件 input 与字段映射 DOM 挂载。
- 页面级错误、表单反馈、模板错误和导入结果摘要使用 shadcn Alert；冻结确认也改为 shadcn Dialog，避免同页混用第二套手写弹窗。

#### 风险

- 本轮只修全局 UI 规范和客服人员导入弹窗；排班、预测、登录/状态日志导入入口仍需要后续单独复用同一模式。
- `Alert` 已覆盖反馈/错误/结果摘要；空状态仍保持原有轻量占位，后续如统一 Empty 需单独任务。

#### 验证

- `npx shadcn@latest add alert breadcrumb collapsible --dry-run` 确认只新增文件；`dialog` dry-run 会覆盖 Button，因此改为 CLI view 后只新增 `components/ui/dialog.tsx`；`npx shadcn@latest add avatar --dry-run` 确认只新增 `components/ui/avatar.tsx`；参考头像落到 `public/shadcn-avatar.jpg`，避免外链加载失败。 本轮未修改 package 或 lockfile。
- `node --test scripts/tests/product-structure.test.mjs`：通过，14 个 product-structure 测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- in-app browser smoke：`http://127.0.0.1:3000/master-data/sites/SH-01` 命中 shadcn Sidebar wrapper、CollapsibleTrigger/Content、SidebarMenuSub，二级 `职场` active，一级 `主数据` 在 `data-sidebar=menu-button` 上 active，Breadcrumb 正常且无运行时错误；`/master-data/agents` Header 命中 `新建`、`批量导入` 且没有全局搜索输入/搜索占位，筛选卡片在上，列表操作栏在中，表格在下，`查询/重置` 位于筛选卡片右下，列表操作栏不再包含 `新建/批量导入`，Sidebar footer 菜单可打开并包含 shadcn Avatar 头像、`切换为浅色/深色` 和 `退出登录`；`/master-data/sites/SH-01` 全页 H1 仅为 `上海职场`，内容区只保留 `职场信息`、`运营主体` 业务分组且无返回头块；`http://127.0.0.1:3000/master-data/agents/A-1001/edit` 可见 H1 仅由 `SiteHeader` 输出，内容区不再出现 `返回客服人员`，也不再重复页面标题卡片；`http://127.0.0.1:3000/master-data/agents?import_dialog=1` 命中 shadcn Dialog，上传 step 可见，映射/结果 step hidden 但 DOM 挂载，文件 input 和字段映射 textarea 均存在；`http://127.0.0.1:3000/master-data/agents?import_dialog=1&upload=failed&reason=missing_required_fields` 命中结果 step 和 Alert 失败摘要。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM145 导航信息架构收口

#### 审计结论

- `IM145` 已从 Sidebar 一级导航移除 `预测生产` 和 `排班生产`。
- `/demand-plans/production/**` 仍保留为既有子路由，但由 `需求计划` 导航项承担 active 高亮。
- `/schedule-plans/production/**` 仍保留为既有子路由，但由 `排班计划` 导航项承担 active 高亮。
- 结构测试已禁止 `预测生产`、`排班生产`、`导入中心`、`质量中心`、`数据质量` 作为 Sidebar 标题重新出现。
- 本轮没有修改生产页标题、返回按钮、模型文案、导入弹窗、业务路由、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 页面标题、返回链路和模型文案中仍有 `生产` 相关残留，按计划留给 `IM146`。
- 内容区重复 H1、旧 `searchPlaceholder` API、主数据非客服人员导入动作和 `/data-quality` 大抽象仍需后续任务继续处理。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明 Sidebar 仍暴露 `预测生产`。
- TDD 绿灯：移除独立生产导航并调整父级 active 后，`node --test scripts/tests/product-structure.test.mjs` 通过，14 个 product-structure 测试通过。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM146 生产文案与返回链路清理

#### 审计结论

- `/demand-plans/production` 的可见页面身份从 `预测生产` 改为 `预测版本`，列表标题从 `需求预测生产台账` 改为 `预测版本列表`。
- `/schedule-plans/production` 的可见页面身份从 `排班生产` 改为 `排班版本`，列表标题从 `人员排班生产台账` 改为 `排班版本列表`，描述中的 `生产版本` 改为 `排班版本`。
- `/actual-logs/production` 的可见页面身份从 `登录/状态日志生产` 改为 `登录/状态日志`，列表标题从 `登录/状态日志生产台账` 改为 `日志处理列表`。
- 详情/解释页返回按钮改为 `返回需求计划`、`返回排班计划`、`返回登录/状态日志`，不再提示返回生产列表。
- 预测、排班、登录/状态日志模型里的缺批次、阻塞、就绪和空态文案改为业务对象视角，不再建立生产台账或生产列表心智。
- 本轮没有改路由结构、重复 H1、旧 `searchPlaceholder` API、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 内容区重复 H1、旧 `searchPlaceholder` API、主数据非客服人员导入动作和 `/data-quality` 大抽象仍按计划留给 IM147-IM151。
- `/production` 路由名仍保留为内部兼容路径；本轮只清理用户可见文案和返回链路。

#### 验证

- TDD 红灯：`node --test scripts/tests/demand-forecast-production-model.test.mjs scripts/tests/personnel-schedule-production-model.test.mjs scripts/tests/actual-log-production-model.test.mjs scripts/tests/product-structure.test.mjs` 先失败 4 个测试，分别证明预测、排班、日志模型和生产子路由源码仍保留旧生产文案。
- TDD 绿灯：实现后同一 focused test 命令通过，43 个测试全部通过。
- Browser smoke：`http://127.0.0.1:3000/demand-plans/production`、`/schedule-plans/production`、`/actual-logs/production` 均不再出现旧生产标题/台账/返回文案，并命中 `预测版本列表`、`排班版本列表`、`日志处理列表`。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM147 Header/Breadcrumb 与内容区标题统一

#### 审计结论

- 需求计划、排班计划、预测版本、排班版本、登录/状态日志和 data-quality 兼容页已通过 `AppShell breadcrumbItems` 接入统一 Breadcrumb。
- 需求计划、排班计划、新建/编辑/详情、生产兼容 workbench、复核案例、复核案例详情、对比运行详情、业务版本列表的内容区同名 H1 已删除或降级。
- 页面身份由 `SiteHeader` / Breadcrumb 承载；内容区继续承载描述、筛选、工具栏、表格、详情分组和业务记录信息。
- 本轮没有删除旧 `searchPlaceholder` API，没有修改路由结构、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- `searchPlaceholder` 仍作为旧 API 留存，按计划进入 IM148。
- `/data-quality` 仍是兼容路由，按计划进入 IM151 做抽象降级。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明目标页面缺少 `breadcrumbItems` 且内容区仍有 `<h1>`。
- TDD 绿灯：实现后同一 focused test 通过，17 个 product-structure 测试通过。
- Browser smoke：`/demand-plans`、`/schedule-plans`、`/data-quality/versions` 均存在 Breadcrumb，页面 DOM 只有 `sr-only` H1，内容区没有重复页面身份 H1。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM148 旧全局搜索 API 清理

#### 审计结论

- `AppShell` 已删除 `searchPlaceholder` prop、默认值和向 `SiteHeader` 的透传。
- `SiteHeader` 已删除 `searchPlaceholder` prop 定义，Header 不再保留无显示效果的搜索接口。
- `app/**` 与 `components/**` 源码不再向共享 Header/Shell 传入 `searchPlaceholder`。
- 真正有意义的列表筛选仍保留在业务内容区，本轮没有把筛选迁回 Header，也没有新增全局搜索 UI。
- 本轮没有修改路由结构、导入弹窗、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 后续 IM149-IM151 仍需继续处理非客服人员主数据动作收口、导入入口业务归位和 `/data-quality` 抽象降级。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明 `AppShell` 仍保留旧搜索 API。
- TDD 绿灯：删除接口和页面传参后，同一 focused test 通过，18 个 product-structure 测试通过。
- `rg -n "searchPlaceholder" app components -S` 无结果。
- `bash scripts/check-state.sh --strict`、`git diff --check` 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM149 主数据非客服人员动作收口

#### 审计结论

- 组织、职场、供应商、技能等非客服人员主数据列表内容区不再显示 `导入主数据`。
- 非客服人员主数据页不再从内容区跳转 `/data-quality/uploads/new` 这类独立上传工作区。
- 客服人员已确认的 `新建` 和 `批量导入` 仍保留在 Header actions，客服人员三步导入弹窗不受影响。
- 本轮没有新增非客服人员 CRUD、导入弹窗、排班/预测/登录状态日志导入入口、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 组织、职场、供应商、技能导入入口仍需后续 IM150 以业务列表内 step-by-step dialog 方式单独设计，不能回退到独立上传页快捷入口。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明非客服人员内容区仍显示 `导入主数据`。
- TDD 绿灯：删除旧内容区动作后，同一 focused test 通过，19 个 product-structure 测试通过。
- `rg -n "导入主数据|buildImportUploadWorkspaceHref" components/master-data-maintenance-workbench.tsx app/master-data -S` 无业务源码匹配。
- Browser smoke 和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM150 导入入口业务归位

#### 审计结论

- `/data-quality` 批次台账内容区不再显示通用 `上传 CSV` 主按钮。
- `预测版本`、`排班版本`、`登录/状态日志` 页面级导入动作已进入 Header actions。
- 预测、排班、登录/状态日志内容区 `版本状态` 卡片不再承载导入按钮。
- `/data-quality/uploads/new` 保留为内部兼容上传路由，用于后续业务弹窗复用和既有回流，不作为通用主入口暴露。
- 本轮没有新增导入弹窗、后端 route/action、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 预测、排班、登录/状态日志后续仍应按业务对象补真正的 step-by-step dialog；本轮只是入口归属收口，不把新弹窗和上传流程混入同一刀。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明通用批次台账仍持有上传入口。
- TDD 绿灯：入口调整后，同一 focused test 通过，20 个 product-structure 测试通过。
- Browser smoke over `/data-quality`, `/demand-plans/production`, `/schedule-plans/production`, and `/actual-logs/production` confirmed generic upload is absent from the batch ledger, while business import links exist only in Header actions.
- 最终 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过，包含 strict state、shadcn gate、lint、typecheck、Next build 和后端 213 tests OK。

### 2026-06-05 - IM151 data-quality 结果页抽象降级

#### 审计结论

- `/data-quality/versions` Header/Breadcrumb 不再显示 `导入批次` 父级。
- `/data-quality/comparison-runs/[runId]` Header/Breadcrumb 不再显示 `导入批次` 父级。
- `/data-quality/review-cases` Header/Breadcrumb 不再显示 `导入批次` 父级。
- `/data-quality/review-cases/[caseId]` Header/Breadcrumb 不再显示 `导入批次` 父级，只保留到 `复核案例` 列表的二级关系。
- 批次处理、上传、字段映射模板页面继续保留批次/模板上下文；本轮没有删除或重构 `/data-quality/**` 兼容路由。
- 本轮没有新增 Sidebar 导航项、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 结果链路仍在 `/data-quality/**` 兼容路径下，后续若要彻底按业务入口拆路由，需要单独 Gate，不能在本轮顺手重构。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明业务版本页仍把 `导入批次` 作为 Breadcrumb 父级。
- TDD 绿灯：结果页 Breadcrumb 调整后，同一 focused test 通过，21 个 product-structure 测试通过。
- Browser smoke over `/data-quality/versions`, `/data-quality/comparison-runs/RUN-QUERY-001`, `/data-quality/review-cases`, and `/data-quality/review-cases/CASE-QUERY-001` confirmed result pages no longer show `导入批次` parent Breadcrumb.
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM152 主数据术语清理

#### 审计结论

- 职场详情指标、区块标题和空态不再显示 `运营主体` 或 `职场运营主体`。
- 职场详情用 `服务团队` 表达自有团队和供应商团队关系。
- 主数据数据读取错误文案从 `职场运营主体来源读取失败` 改为 `职场服务团队来源读取失败`。
- `项目` 没有作为主数据维护对象回流；本轮没有删除 `project_id` 兼容字段或内部兼容类型名。
- 本轮没有新增职场服务团队独立页面、CRUD、导入入口、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、供应商合同、结算比例、最低人力要求、自动排班、生产公式或收费因子。

#### 风险

- 内部代码类型仍保留 operator 命名作为兼容实现细节；后续如要重命名内部模型，应单独做重构任务，不应混入产品可见文案清理。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明主数据 workbench 仍有 `运营主体` 文案。
- TDD 绿灯：术语调整后，同一 focused test 通过，22 个 product-structure 测试通过。
- `rg -n "职场运营主体|运营主体" app/master-data components/master-data-maintenance-workbench.tsx -S` 无匹配。
- Browser smoke over `/master-data/sites/SH-01` confirmed the page shows `服务团队` and does not show `运营主体` or `职场运营主体`.
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-05 - IM153 字体与控件密度统一

#### 审计结论

- 全局 CSS 不再用 `button,input,select { font: inherit }` 覆盖组件自身字号。
- `Button` 的 `sm` 和 `xs` 文本按钮不再使用 12.8px 或 12px 字号。
- 客服人员列表行内 `编辑/冻结` 文字按钮与页面级按钮、筛选按钮统一为 14px/32px。
- `TableHead` 不再固定 `text-xs`，表头与正文统一到 14px 表格基线。
- 客服人员导入 Dialog 的正文、步骤说明、字段映射、textarea、结果文案和表单控件不再混用 12px。
- 纯图标按钮、checkbox 和 badge 的尺寸保留为组件语义密度，不作为文字按钮基线。
- 本轮没有新增业务功能、后端 route、schema/migration、依赖、权限、审批、导出、批量应用、真实外部接口、自动排班、生产公式、结算或收费因子。

#### 风险

- 项目中仍有其他历史页面存在小号元信息、badge 或代码标识文本；本轮只治理用户明确指出的按钮、表格、客服人员列表和人员导入弹窗，不做全站重排版。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明全局表单字体覆盖仍存在。
- TDD 绿灯：补齐组件与 dialog 修复后，同一 focused test 通过，23 个 product-structure 测试通过。
- Browser runtime style smoke over `/master-data/agents?import_dialog=1` confirmed visible text buttons are 14px, table headers are 14px/40px, table cells are 14px, dialog body/form controls are 14px, and row action text buttons are 14px/32px.
- `npm run lint`、`npm run typecheck` 和最终 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 已通过，包含 strict state、shadcn gate、Next build 和后端 209 tests OK。

### 2026-06-08 - IM154 职场基础 CRUD 前端闭环

#### 审计结论

- `/master-data/sites` Header actions 已提供职场 `新建` 入口，不在列表内容区塞表单。
- 职场列表行已提供 `详情`、`编辑`、`冻结`；详情进入既有职场详情页，编辑进入职场编辑子页面，冻结打开确认 Dialog。
- `/master-data/sites/new` 提交职场 ID、职场名称、状态、生效开始和生效结束。
- `/master-data/sites/[workplaceId]/edit` 编辑职场名称、状态和有效期，职场 ID 作为隐藏字段提交，不作为可编辑字段。
- 提交复用现有 `/api/v1/master-data/workplaces/{reference_id}/maintenance` 能力，提交结果回到职场列表并使用既有 Alert feedback。
- 本轮没有新增职场服务团队绑定、供应商合同、结算比例、最低人力、审批、导出、批量操作、权限、后端 route、schema/migration、依赖、自动排班、生产公式或收费因子。

#### 风险

- 职场和供应商的服务关系、合同、最低人力、结算规则属于后续独立对象/详情设计，本轮只覆盖基础 reference 字段。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少 `buildMasterDataWorkplaceMaintenanceApiPath`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明缺少 `/master-data/sites/new`。
- TDD 绿灯：补齐后 `master-data-maintenance-model.test.mjs` 21 tests OK，`product-structure.test.mjs` 24 tests OK。
- `npm run lint` 和 `npm run typecheck` 已通过。
- Browser smoke over `/master-data/sites`, `/master-data/sites/new`, `/master-data/sites/SH-01/edit`, and `/master-data/sites?freeze_workplace_id=SH-01` confirmed Header create action, no inline create form on the list, create/edit child pages, and the freeze Dialog.
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-08 - IM155 供应商基础 CRUD 前端闭环

#### 审计结论

- `/master-data/vendors` Header actions 已提供供应商 `新建` 入口，不在列表内容区塞表单。
- 供应商列表行已提供 `详情`、`编辑`、`冻结`；详情进入既有供应商详情页，编辑进入供应商编辑子页面，冻结打开确认 Dialog。
- `/master-data/vendors/new` 提交供应商 ID、供应商名称、状态、生效开始和生效结束。
- `/master-data/vendors/[vendorId]/edit` 编辑供应商名称、状态和有效期，供应商 ID 作为隐藏字段提交，不作为可编辑字段。
- 提交复用现有 `/api/v1/master-data/suppliers/{reference_id}/maintenance` 能力，提交结果回到供应商列表并使用既有 Alert feedback。
- 本轮没有新增供应商合同、结算比例、最低人力、服务职场绑定、审批、导出、批量操作、权限、后端 route、schema/migration、依赖、自动排班、生产公式或收费因子。

#### 风险

- 供应商和职场的服务关系、合同、最低人力、结算规则属于后续独立对象/详情设计，本轮只覆盖供应商基础 reference 字段。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少 `buildMasterDataVendorMaintenanceApiPath`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明缺少 `/master-data/vendors/new`。
- TDD 绿灯：补齐后 `master-data-maintenance-model.test.mjs` 22 tests OK，`product-structure.test.mjs` 25 tests OK。
- `npm run lint` 和 `npm run typecheck` 已通过。
- Browser smoke over `/master-data/vendors`, `/master-data/vendors/new`, `/master-data/vendors/SUP-A/edit`, and `/master-data/vendors?freeze_vendor_id=SUP-A` confirmed Header create action, no inline create form on the list, create/edit child pages, and the freeze Dialog.
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-08 - IM156 技能组基础 CRUD 前端闭环

#### 审计结论

- `/master-data/skills` Header actions 已提供技能组 `新建` 入口，不在列表内容区塞表单。
- 技能组列表行已提供 `编辑`、`冻结`；编辑进入技能组编辑子页面，冻结打开确认 Dialog。
- `/master-data/skills/new` 提交技能组 ID、技能组名称、归属属性、状态、生效开始和生效结束。
- `/master-data/skills/[skillId]/edit` 编辑技能组名称、归属属性、状态和有效期，技能组 ID 作为隐藏字段提交，不作为可编辑字段。
- 提交复用现有 `/api/v1/master-data/skills/{reference_id}/maintenance` 能力，并补齐 `skill_category` 维护请求透传，提交结果回到技能组列表并使用既有 Alert feedback。
- 本轮没有新增人员技能绑定、排班技能引用、技能层级、审批、导出、批量操作、权限、新后端 route、schema/migration、依赖、自动排班、生产公式、结算或收费因子。

#### 风险

- 当前只维护技能组基础档案；人员技能关系和排班侧技能引用仍属于独立后续任务。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少 `buildMasterDataSkillMaintenanceApiPath`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明缺少 `/master-data/skills/new`；后端 `unittest` 先失败，证明 `skill_category` 仍未写入。
- TDD 绿灯：补齐后 `master-data-maintenance-model.test.mjs` 23 tests OK，`product-structure.test.mjs` 26 tests OK，后端 master-data maintenance 定向 23 tests OK。
- `npm run lint` 和 `npm run typecheck` 已通过。
- Browser smoke over `/master-data/skills`, `/master-data/skills/new`, `/master-data/skills/L1-CN/edit`, and `/master-data/skills?freeze_skill_id=L1-CN` confirmed Header create action, no inline create form on the list, create/edit child pages, and the freeze Dialog.
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-08 - IM157 组织基础 CRUD 前端闭环

#### 审计结论

- `/master-data/organizations` Header actions 已提供组织 `新建` 入口，不在列表内容区塞表单。
- 组织列表行已提供 `编辑`、`冻结`；编辑进入组织编辑子页面，冻结打开确认 Dialog。
- `/master-data/organizations/new` 提交组织 ID、组织名称、组织层级、上级组织、状态、生效开始和生效结束。
- `/master-data/organizations/[organizationId]/edit` 编辑组织名称、组织层级、上级组织、状态和有效期，组织 ID 作为隐藏字段提交，不作为可编辑字段。
- 后端新增窄 `/api/v1/master-data/organizations/{organization_id}/maintenance`，复用既有组织表、父组织校验和导入批次来源校验，不新增 schema/migration。
- 本轮没有新增组织架构图、人员调岗、供应商绑定、合同、结算、最低人力、审批、导出、批量操作、权限、schema/migration、依赖、自动排班、生产公式或收费因子。

#### 风险

- 当前只维护组织基础档案；组织树可视化、人员调岗、供应商团队归属和合同/最低人力仍属于独立后续任务。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少 `buildMasterDataOrganizationMaintenanceApiPath`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明缺少 `/master-data/organizations/new`；后端 `unittest` 先失败，证明缺少 `maintain_organization` 和 route。
- TDD 绿灯：补齐后 `master-data-maintenance-model.test.mjs` 25 tests OK，`product-structure.test.mjs` 27 tests OK，后端 master-data maintenance 定向 25 tests OK。
- `npm run lint` 和 `npm run typecheck` 已通过。
- Browser smoke over `/master-data/organizations`, `/master-data/organizations/new`, `/master-data/organizations/ORG-CC/edit`, and `/master-data/organizations?freeze_organization_id=ORG-CC` confirmed Header create action, row edit/freeze links, create/edit child pages, and the freeze Dialog.
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-08 - IM158 客服人员列表真实筛选

#### 审计结论

- `/master-data/agents` 的技能组筛选下拉不再固定为在线/热线/工单归属属性，而是从当前人员技能集合生成真实技能组选项。
- `/master-data/agents` 的组织和职场筛选下拉不再只有“全部组织/全部职场”，而是从当前人员组织 ID/组织路径、职场 ID/职场名称生成真实选项。
- `skill_group` 查询参数支持技能 ID、技能名称和技能归属属性匹配；`organization` 查询参数支持组织 ID 和组织路径匹配；`workplace` 查询参数支持职场 ID 和职场名称匹配。
- 页面结构未扩展：Header 继续承载 `新建` 和 `批量导入`，筛选卡片在列表操作栏上方，列表页未塞新增/编辑表单。
- 本轮没有新增导航、页面、后端 route、schema/migration、依赖、权限、审批、导出、批量操作、自动排班、生产公式、结算或收费因子。

#### 风险

- 当前本地 `.local` SQLite 是旧 schema，缺少 `master_data_skills.skill_category` 和 `master_data_employees.employee_type` 列，无法通过维护 API 准备带组织/职场/技能的 smoke 人员；因此真实 option 的页面级验证以模型 RED/GREEN 测试覆盖，浏览器只验证现有 `张三` 数据的 URL 筛选和空态。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明技能组仍是固定归属属性选项，组织/职场没有真实选项。
- TDD 绿灯：补齐后 `master-data-maintenance-model.test.mjs` 26 tests OK。
- `node --test scripts/tests/product-structure.test.mjs` 27 tests OK。
- `npm run lint` 和 `npm run typecheck` 已通过。
- Browser smoke over `/master-data/agents?employee_name=张三` returned 1 row and Header `新建/批量导入`; `/master-data/agents?employee_name=不存在` showed `暂无符合条件的客服人员` without `张三`。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-08 - IM159 本地旧主数据 schema 维护写入兼容

#### 审计结论

- SQLite 本地 repository 初始化时会运行本地兼容补齐，旧 `master_data_employees` 缺少 `employee_type`、`organization_id`、`workplace_id` 时会添加已确认字段。
- 旧 `master_data_skills` 缺少 `skill_category` 时会添加已确认字段。
- 缺少 `master_data_organizations` 等本地主数据表时，仍通过既有 `Base.metadata.create_all` 创建当前模型表，使组织维护写入可以继续。
- 兼容逻辑仅在 `engine.dialect.name == "sqlite"` 时执行，不新增迁移文件、生产数据库配置、业务字段、权限、审批、导出、批量操作、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 风险

- 这是本地 SQLite 兼容补齐，不是生产数据库迁移策略；真实生产持久化仍需要后续独立确认。

#### 验证

- TDD 红灯：`.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service.MasterDataMaintenanceServiceTest.test_legacy_local_schema_allows_employee_skill_and_organization_maintenance -v` 先失败，错误为旧库缺少 `master_data_employees.employee_type`。
- TDD 绿灯：补齐后同一测试通过。
- `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service backend.tests.test_master_data_maintenance_api -v` 通过 26 tests。
- API smoke against local `.local` DB confirmed skill create, employee create, and employee skill replace all returned HTTP 200, then `/api/v1/master-data/employees` returned `IM159验证人员` with organization path, workplace, and skill context.
- Browser smoke over `/master-data/agents?skill_group=SKILL-IM159&organization=ORG-IM158&workplace=SITE-IM158` showed `IM159验证人员` and no empty state。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-08 - IM160 职场详情只读服务团队关系

#### 审计结论

- `/master-data/sites/[workplaceId]` 仍是职场详情上下文，不新增服务团队独立导航或抽象模块。
- 自有服务团队按该职场 `internal` 人员的 `organization_id / organization_path` 聚合，不再逐人员当作团队行。
- 供应商服务团队按该职场 binding 的 `supplier_id` 聚合，并通过供应商主数据展示供应商名称。
- 服务团队表展示团队类型、服务团队、供应商、人员/绑定数、状态、有效期、来源和来源批次。
- 本轮没有新增表单、后端 route、schema/migration、合同、结算、最低人力、权限、审批、导出、批量操作或自动排班。

#### 风险

- 当前仍是只读聚合展示；服务团队新增/编辑/冻结、人员归属服务团队、供应商合同、最低人力和结算规则需要后续独立任务确认。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，当前实现返回 3 行人员/绑定明细而不是 2 个服务团队聚合行。
- TDD 绿灯：补齐后 `node --test scripts/tests/master-data-maintenance-model.test.mjs scripts/tests/product-structure.test.mjs` 通过 54 tests。
- `npm run lint` 和 `npm run typecheck` 已通过。
- Browser smoke over `/master-data/sites/SH-01` confirmed supplier team `供应商 A` and `1 条绑定`; `/master-data/sites/SITE-IM158` confirmed internal team and `1 人`; both pages did not show 合同、结算、最低人力。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-08 - IM161 职场服务团队本地维护对象

#### 审计结论

- 新增本地 `master_data_workplace_service_teams` 表和 Alembic 迁移，字段限定为服务团队 ID、职场、团队类型、团队名称、组织、供应商、状态、生效期和来源批次。
- 新增 `/api/v1/master-data/workplace-service-teams` 列表 API 和 `/api/v1/master-data/workplace-service-teams/{service_team_id}/maintenance` 单条维护 API，支持 create/edit/freeze。
- 自有服务团队要求组织引用，供应商服务团队要求供应商引用；编辑切换团队类型时会清理另一类引用，避免混填。
- `/master-data/sites/[workplaceId]` 仍是唯一入口，不新增 Sidebar 导航或独立服务团队模块；页面优先展示本地服务团队记录，缺记录时保留 IM160 推导回退。
- 新增和编辑进入 `/master-data/sites/[workplaceId]/service-teams/new` 与 `/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]/edit` 子页面；冻结通过职场详情 Dialog。
- 本轮没有新增合同、结算比例、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：模型测试先失败，证明职场详情未读取 maintained serviceTeams；产品结构测试先失败，证明子页面不存在；后端 contract/API 测试先失败，证明缺少维护对象和 route。
- TDD 绿灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs scripts/tests/product-structure.test.mjs` 通过 55 tests；后端维护定向测试通过 28 tests。
- `npm run lint` 和 `npm run typecheck` 已通过。
- API smoke 创建 `TEAM-IM161-SMOKE` 返回 200；in-app browser smoke 确认 `/master-data/sites/SH-01` 显示服务团队记录来源、编辑/冻结入口，`/master-data/sites/SH-01/service-teams/new` 显示子页表单，`/service-teams/TEAM-IM161-SMOKE/edit` 回填字段；页面未出现合同、结算或最低人力。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-11 - IM162 职场服务团队详情页

#### 审计结论

- `/master-data/sites/[workplaceId]` 的服务团队表新增 `查看` 入口，只对 IM161 本地服务团队记录生成详情链接，不为旧推导行伪造详情页。
- 新增 `/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]`，仍在职场详情子路由上下文内，不新增 Sidebar 导航或独立服务团队模块。
- 详情页展示服务团队 ID、团队名称、团队类型、归属职场、组织或供应商来源、状态、生效期和来源批次。
- 详情页提供编辑和冻结入口；编辑复用既有编辑子页面，冻结复用 Dialog，取消后停留在详情页。
- 本轮没有新增后端 route、schema/migration、关联人员列表、人员分配、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明服务团队行缺少 `detailHref`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明详情页文件不存在。
- TDD 绿灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 通过 27 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 28 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认改动区域未引入硬编码色阶、`space-*`、重复 `h1/ArrowLeft/返回职场` 残留。
- in-app browser smoke 确认 `/master-data/sites/SH-01` 存在 `查看` 详情入口，`/master-data/sites/SH-01/service-teams/TEAM-IM161-SMOKE` 展示基础字段、编辑/冻结入口和来源信息，详情页冻结 Dialog 含标题、取消和确认冻结按钮；页面未出现合同、结算、最低人力、权限、审批、导出或批量。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-11 - IM163 服务团队详情关联人员只读列表

#### 审计结论

- `/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]` 增加只读 `关联人员` 区域，仍留在职场服务团队详情上下文内。
- 自有服务团队按同职场且同 `organization_id` 的人员匹配；供应商服务团队按同职场且同 `supplier_id` 的绑定关系匹配人员，并对同一人员去重。
- 关联人员表展示姓名、人员 ID、人员类型、组织、职场、技能、状态和匹配来源；无匹配人员时显示明确空态。
- 本轮没有新增后端 route、schema/migration、独立服务团队导航、人员分配、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少关联人员汇总函数；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明服务团队详情页尚未读取人员和绑定数据。
- TDD 绿灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 通过 28 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 28 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增区域使用既有 Table、Badge、Button/Dialog 组合和语义 token。
- in-app browser smoke 确认 `/master-data/sites/SH-01/service-teams/TEAM-IM161-SMOKE` 出现 `服务团队信息`、`关联人员`、编辑/冻结入口和关联人员匹配来源；页面未出现合同、结算、最低人力、权限、审批、导出、批量或人员分配。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-11 - IM164 供应商详情服务团队只读链路

#### 审计结论

- `/master-data/vendors/[vendorId]` 增加只读 `服务团队` 区域，仍留在供应商详情上下文内。
- 服务团队区域只展示 `supplier_id` 等于当前供应商的职场服务团队记录。
- 每行展示服务团队名称、归属职场、状态、生效期、来源批次，并通过 `查看团队` 链接到既有职场服务团队详情页。
- 本轮没有新增后端 route、schema/migration、供应商服务团队维护、人员分配、独立服务团队导航、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明供应商详情缺少服务团队行；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明供应商详情页尚未读取职场服务团队记录。
- TDD 绿灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 通过 28 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 28 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增区域使用既有 Table、Badge、Button 组合和语义 token。
- in-app browser smoke 确认 `/master-data/vendors/SUP-A` 出现 `服务团队`、`服务职场`、`查看团队` 链接，并指向 `/master-data/sites/SH-01/service-teams/TEAM-IM161-SMOKE`；页面未出现合同、结算、最低人力、权限、审批、导出、批量或人员分配。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-11 - IM165 客服人员详情只读业务链路

#### 审计结论

- `/master-data/agents` 列表行新增 `查看` 入口，进入 `/master-data/agents/[employeeId]` 单个人员详情页。
- 人员详情页只读展示人员基础信息、组织、职场、人员类型、状态、有效期、来源批次和技能集合。
- 详情页读取既有职场服务团队和职场绑定数据，推导当前人员关联的服务团队；自有团队按同职场同组织匹配，供应商团队按同职场同供应商绑定匹配。
- 关联服务团队表通过 `查看团队` 链接进入既有职场服务团队详情页；无关联团队显示明确空态。
- 本轮没有新增后端 route、schema/migration、人员分配、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少 `summarizeMasterDataAgentDetail`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明客服人员详情页文件不存在。
- TDD 绿灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 通过 29 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 29 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增区域使用既有 Table、Badge、Button 和语义 token，未引入硬编码色阶或 `space-*`。
- in-app browser smoke 确认 `/master-data/agents` 存在行内 `查看` 入口并指向 `/master-data/agents/A-1001`；`/master-data/agents/A-1001` 出现 `人员信息`、`技能集合`、`关联服务团队` 和 `查看团队` 链接，并指向 `/master-data/sites/SH-01/service-teams/TEAM-IM161-SMOKE`；页面未出现合同、结算、最低人力、权限、审批、导出、批量或自动排班。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-11 - IM166 组织详情只读业务链路

#### 审计结论

- `/master-data/organizations` 列表行新增 `查看` 入口，进入 `/master-data/organizations/[organizationId]` 单个组织详情页。
- 组织详情页只读展示组织名称、编码、层级、上级组织、组织路径、状态、生效期和来源批次。
- 详情页只读展示当前组织的直接下级组织，并通过 `查看组织` 链接继续进入下级组织详情页。
- 详情页只读展示当前组织直接归属人员，并通过 `查看人员` 链接进入既有客服人员详情页。
- 无直接下级组织或无归属人员时显示明确空态。
- 本轮没有新增后端 route、schema/migration、人员调岗、组织树拖拽、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少 `summarizeMasterDataOrganizationDetail`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明组织详情页文件不存在。
- TDD 绿灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 通过 30 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 30 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增区域使用既有 Table、Badge、Button 和语义 token，未引入硬编码色阶或 `space-*`。
- in-app browser smoke 确认 `/master-data/organizations` 存在行内 `查看` 入口并指向 `/master-data/organizations/ORG-CC`；`/master-data/organizations/ORG-CC` 出现 `组织信息`、`直接下级组织`、`归属人员` 和人员空态；`/master-data/organizations/ORG-IM158` 出现 `查看人员` 链接并指向 `/master-data/agents/A-IM159`；页面未出现合同、结算、最低人力、权限、审批、导出、批量或自动排班。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM167 技能组详情只读业务链路

#### 审计结论

- `/master-data/skills` 列表行新增 `详情` 入口，进入 `/master-data/skills/[skillId]` 单个技能组详情页。
- 技能组详情页只读展示技能组名称、编码、归属属性、状态、生效期和来源批次。
- 详情页只读展示当前拥有该技能的客服人员，并通过 `查看人员` 链接进入既有客服人员详情页。
- 无归属人员时显示明确空态。
- 本轮没有新增后端 route、schema/migration、技能层级、技能绑定维护、批量分配、排班技能规则、合同、结算、最低人力、权限、审批、导出、批量操作、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 先失败，证明缺少 `summarizeMasterDataSkillDetail`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明技能组详情页文件不存在。
- TDD 绿灯：`node --test scripts/tests/master-data-maintenance-model.test.mjs` 通过 31 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 31 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增区域使用既有 Table、Badge、Button 和语义 token，未引入硬编码色阶或 `space-*`。
- in-app browser smoke 确认 `/master-data/skills` 存在行内 `详情` 入口并指向 `/master-data/skills/L1-CN`；`/master-data/skills/L1-CN` 出现 `技能组信息`、`拥有该技能的客服人员` 和人员空态；`/master-data/skills/SKILL-IM159` 出现 `查看人员` 链接并指向 `/master-data/agents/A-IM159`；页面未出现合同、结算、最低人力、权限、审批、导出、批量或自动排班。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM168 主数据详情链路收尾检查

#### 审计结论

- 主数据 reference 列表进入详情的行内动作统一为 `查看`，修正 IM167 留下的技能组列表 `详情` 口径。
- 行内动作仍使用既有 `detailHref`，没有新增页面、导航或业务模块。
- 新增结构测试覆盖 `MasterDataReferenceManagementPage`，防止 reference 列表再次混用 `详情`。
- 本轮没有新增后端 route、schema/migration、导入、权限、审批、导出、批量操作、合同、结算、最低人力、自动排班、生产公式或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/product-structure.test.mjs` 先失败，证明 reference 列表仍包含 `>详情</Link>`。
- TDD 绿灯：`node --test scripts/tests/product-structure.test.mjs` 通过 32 tests。
- `node --test scripts/tests/master-data-maintenance-model.test.mjs` 通过 31 tests；`npm run lint` 和 `npm run typecheck` 已通过。
- shadcn 自查确认本轮没有引入硬编码色阶、`space-*` 或任意圆角，实际改动只替换既有 Link 文案。
- in-app browser smoke 确认 `/master-data/skills` 行内链接文本为 `查看/编辑/冻结`，`详情` 数量为 0；`/master-data/skills/L1-CN` 仍展示 `技能组信息` 和 `拥有该技能的客服人员`，且未出现合同、结算、最低人力、权限、审批、导出、批量或自动排班。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM169 需求预测导入大弹窗

#### 审计结论

- `/demand-plans/production` Header 的 `导入预测` 不再跳转独立 CSV 上传页，而是打开当前预测版本页 Dialog。
- Dialog 使用 `上传文件`、`字段映射`、`导入结果` 三步；非当前 step 通过 `hidden` 隐藏但保持 DOM 挂载，避免文件 input 在 step 切换时丢失选择。
- 上传继续复用现有 `uploadImportCsvAction` 和 `demand_forecast` file type；结果回流 `/demand-plans/production?import_dialog=1`，并在结果 step 提供批次详情入口。
- 本轮没有扩展排班、登录/状态日志导入弹窗，没有新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、自动排班、生产公式、结算或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/demand-forecast-production-model.test.mjs` 先失败，证明缺少 `summarizeDemandForecastImportDialog`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明预测版本页仍缺少页内 Dialog 流程。
- TDD 绿灯：`node --test scripts/tests/demand-forecast-production-model.test.mjs` 通过 11 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 33 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增 Dialog 使用既有 Dialog、Alert、Button、Input、Badge 和语义 token，未引入硬编码色阶或 `space-*`。
- in-app browser smoke 确认 `/demand-plans/production?import_dialog=1` 渲染 `需求预测导入` Dialog，三步标题均存在，文件 input 数量为 1，hidden section 数量为 2，旧独立上传链接数量为 0；`/demand-plans/production?import_dialog=1&upload=success&batch=BATCH-FC-001` 显示 `导入已提交` 并提供 `/data-quality/import-batches/BATCH-FC-001` 链接。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM170 排班导入大弹窗

#### 审计结论

- `/schedule-plans/production` Header 的 `导入排班` 不再跳转独立 CSV 上传页，而是打开当前排班版本页 Dialog。
- Dialog 使用 `上传文件`、`字段映射`、`导入结果` 三步；非当前 step 通过 `hidden` 隐藏但保持 DOM 挂载，避免文件 input 在 step 切换时丢失选择。
- 上传继续复用现有 `uploadImportCsvAction` 和 `personnel_schedule` file type；结果回流 `/schedule-plans/production?import_dialog=1`，并在结果 step 提供批次详情入口。
- 本轮没有扩展登录/状态日志导入弹窗，没有新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、发布/冻结、自动排班、生产公式、结算或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/personnel-schedule-production-model.test.mjs` 先失败，证明缺少 `summarizePersonnelScheduleImportDialog`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明排班版本页仍缺少页内 Dialog 流程。
- TDD 绿灯：`node --test scripts/tests/personnel-schedule-production-model.test.mjs` 通过 10 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 34 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增 Dialog 使用既有 Dialog、Alert、Button、Input、Badge 和语义 token，未引入硬编码色阶或 `space-*`。
- in-app browser smoke 确认 `/schedule-plans/production?import_dialog=1` 渲染 `排班导入` Dialog，三步标题均存在，文件 input 数量为 1，hidden section 数量为 2，旧独立上传链接数量为 0；`/schedule-plans/production?import_dialog=1&upload=success&batch=BATCH-SCH-001` 显示 `导入已提交` 并提供 `/data-quality/import-batches/BATCH-SCH-001` 链接。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM171 登录/状态日志导入大弹窗

#### 审计结论

- `/actual-logs/production` Header 的 `导入登录日志`、`导入状态日志` 不再跳转独立 CSV 上传页，而是打开当前登录/状态日志页 Dialog。
- Dialog 使用 `上传文件`、`字段映射`、`导入结果` 三步；非当前 step 通过 `hidden` 隐藏但保持 DOM 挂载，避免文件 input 在 step 切换时丢失选择。
- 登录日志提交 `file_type=login_log`，状态日志提交 `file_type=status_log`；上传继续复用现有 `uploadImportCsvAction`，结果回流 `/actual-logs/production?import_dialog=1&log_type=...`，并在结果 step 提供批次详情入口。
- 本轮没有扩展解析增强、状态字典配置维护，没有新增后端 route、schema/migration、依赖、权限、审批、导出、批量应用、自动排班、生产公式、结算或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/actual-log-production-model.test.mjs` 先失败，证明缺少 `summarizeActualLogImportDialog`；`node --test scripts/tests/product-structure.test.mjs` 先失败，证明登录/状态日志页仍缺少页内 Dialog 流程。
- TDD 绿灯：`node --test scripts/tests/actual-log-production-model.test.mjs` 通过 10 tests，`node --test scripts/tests/product-structure.test.mjs` 通过 35 tests。
- `npm run lint` 和 `npm run typecheck` 已通过；shadcn 自查确认新增 Dialog 使用既有 Dialog、Alert、Button、Input、Badge 和语义 token，未引入硬编码色阶或 `space-*`。
- in-app browser smoke 确认 `/actual-logs/production?import_dialog=1&log_type=login` 和 `log_type=status` 均渲染对应 Dialog；登录/状态两个标题各唯一，`CSV 文件` 字段可见，旧独立上传链接数量为 0；`/actual-logs/production?import_dialog=1&log_type=login&upload=success&batch=BATCH-LOGIN-001` 显示 `导入已提交` 并提供 `/data-quality/import-batches/BATCH-LOGIN-001` 链接。
- 最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM172 前端健康恢复计划固化

#### 审计结论

- 将第三方综合审计后的恢复策略固化到仓库，不再依赖聊天上下文保存执行顺序。
- `docs/frontend-health-recovery-plan.md` 记录恢复入口、Product Design 插件门禁、阶段拆分、验收指标和明确非目标。
- `docs/superpowers/plans/2026-06-12-frontend-health-recovery.md` 记录可执行计划，后续 worker 可按任务恢复。
- Current state 只包含 US792/IM172；后续 IM173+ 不直接进入 active queue，避免上下文压缩后误执行多个任务。
- 本轮不修改 app、components、lib、backend、package、lockfile，不新增业务功能、导航、权限、审批、导出、批量、自动排班、公式、结算或收费因子。

#### 验证

- 严格状态检查和最终 `bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM173 前端 API 结果和错误工具去重

#### 审计结论

- 按恢复计划 Stage 1 第一刀执行，只抽取共享 `ApiResult<T>` 与 `formatApiError`。
- 新增 `lib/api-result.ts` 和 `lib/api-error.ts`；目标前端数据读取文件不再本地定义 `ApiResult<T>` 或 `formatApiError`。
- `formatApiError` 支持 optional fallback，保留字段映射模板详情页原有 `api_unavailable` 兜底语义。
- `fetchImportBatches` / field-mapping fetch 去重仍留给 IM174，没有混入本轮。
- 本轮不改变页面 UI、导航、fetch URL、返回数据结构、错误文案语义、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/frontend-api-utilities.test.mjs` 先失败，证明缺少 `lib/api-result.ts`。
- TDD 绿灯：结构测试通过；`npm run typecheck` 和 `npm run lint` 已通过。
- strict state、`git diff --check` 和最终 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM174 导入 fetch 工具去重

#### 审计结论

- 按恢复计划 Stage 1 第二刀执行，只抽取导入批次与字段映射模板的共享 fetch 工具。
- 新增 `lib/import-api.ts`，提供共享 `fetchImportBatches` 和 `fetchImportFieldMappingTemplates`。
- 目标页面不再本地定义重复 fetch；`app/master-data/agents/data.ts` 通过 re-export 保持既有调用方兼容。
- 页面专属 detail/readiness/review/calculation fetch 继续 colocated，没有混入本轮抽象。
- 本轮不改变页面 UI、导航、fetch URL、返回数据结构、错误文案语义、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证

- TDD 红灯：`node --test scripts/tests/import-api-utilities.test.mjs` 先失败，证明缺少 `lib/import-api.ts`。
- TDD 绿灯：结构测试通过；`npm run typecheck` 和 `npm run lint` 已通过。
- strict state、`git diff --check` 和最终 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 结果见 Done Report。

### 2026-06-12 - IM175 导入和比对 Server Action 运行时保护

#### 审计计划

- 按恢复计划 Stage 1 第三刀执行，只补充 Server Action 入参 runtime guards。
- 保护范围限定为 `file_type`、`comparison_type`、`result_redirect_to`，不引入表单库，不改可见 UI。
- 本轮不改变页面 UI、导航、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 验证计划

- 先写结构测试并看到红灯，再实现 guard。
- 聚焦测试、strict state、`git diff --check` 和最终 `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 结果写入 Done Report。

#### 执行结果

- 已新增结构测试 `scripts/tests/data-quality-actions-guards.test.mjs`，先确认缺少 parser 时红灯，再实现运行时 guard。
- `uploadImportCsvAction` 现在先校验 `file_type` 和 `result_redirect_to`；非法值返回 `invalid_file_type` 或 `invalid_redirect_target`。
- `createImportFieldMappingTemplateAction` 与 `applyImportBatchAction` 现在先校验 `file_type`；非法值返回 `invalid_file_type`。
- `triggerLocalComparisonRunAction` 与 `triggerVersionWorkbenchLocalComparisonRunAction` 现在通过共享 `comparison_type` guard 拦截非法值并返回 `invalid_comparison_type`。
- 未改变可见 UI、导航、后端、数据库、依赖、package/lockfile、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

### 2026-06-12 - IM176 全局页面异常恢复边界

#### 审计计划

- 按恢复计划 Stage 2 第一刀执行，只新增全局 `app/error.tsx`。
- 使用现有 shadcn Alert/Button 和 AppShell，不新增依赖，不做 route-group 迁移。
- 本轮不改变业务页面、导航、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 已新增 `app/error.tsx` 作为 Next.js app router error boundary。
- 异常内容区使用 destructive Alert，提供 `reset()` 重试和 `/dashboard` 安全返回。
- 已新增结构测试 `scripts/tests/global-error-boundary.test.mjs`，先确认缺少 `app/error.tsx` 时红灯，再实现。

### 2026-06-12 - IM177 核心业务路由加载骨架屏

#### 审计计划

- 按恢复计划 Stage 2 第二刀执行，只新增 6 个核心入口的 route-local `loading.tsx`。
- 使用当前 AppShell 和 shadcn Skeleton；因为未做 shared layout/route-group 迁移，loading 文件按当前项目现实包含 AppShell。
- 本轮不修改现有业务页面、导航、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 已新增 `/dashboard`、`/master-data`、`/demand-plans`、`/schedule-plans`、`/actual-logs/production`、`/data-quality` 的 loading skeleton。
- 已新增结构测试 `scripts/tests/core-route-loading-states.test.mjs`，先确认 loading 文件缺失时红灯，再实现。

### 2026-06-13 - IM178 导入中心模型第一刀拆分

#### 审计计划

- 按恢复计划 Stage 3 第一刀执行，只拆分 `components/import-center-model.ts` 中的基础设施代码。
- 新文件限定为类型、格式化函数、URL/href 构造函数；旧入口继续 re-export，避免大范围改调用方。
- 本轮不改变可见 UI、导航、API URL 语义、返回数据结构、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 已新增 `components/import-center-types.ts`，承载原 model 中的导出类型定义。
- 已新增 `components/import-center-formatters.ts`，承载批次显示名、文件类型、处理状态、应用状态、就绪状态和行状态格式化函数。
- 已新增 `components/import-center-navigation.ts`，承载导入中心 API URL 与页面 href 构造函数。
- `components/import-center-model.ts` 继续 re-export 旧公开入口，并保留后续业务 summarizer/builder 逻辑。
- 已新增结构测试 `scripts/tests/import-center-model-first-split.test.mjs`，先确认缺少拆分文件时红灯，再实现兼容拆分。

### 2026-06-13 - IM179 导入中心剩余汇总构造逻辑拆分

#### 审计计划

- 按恢复计划 Stage 3 第二刀执行，只拆分导入中心剩余 summarizer/builder。
- 旧 `components/import-center-model.ts` 必须降为兼容 re-export 入口，现有调用方 import path 不变。
- 本轮不改变可见 UI、导航、API URL 语义、返回数据结构、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 已新增 list/version/review/batch/template/comparison 六个导入中心责任 model 文件。
- `components/import-center-model.ts` 只保留类型、格式化、导航和六个责任 model 的 re-export。
- 已新增结构测试 `scripts/tests/import-center-summary-split.test.mjs`，先确认缺少拆分文件时红灯，再实现拆分。

### 2026-06-13 - IM180 主数据维护 workbench 行为不变拆分

#### 审计计划

- 按恢复计划 Stage 3 第三刀执行，只拆分 `components/master-data-maintenance-workbench.tsx`。
- 旧入口必须降为兼容 re-export 入口，现有调用方 import path 不变。
- 本轮不改变可见 UI、路由、交互、业务语义、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 已新增 actions/agents/references/details/forms/fields 六个主数据维护责任文件。
- `components/master-data-maintenance-workbench.tsx` 只保留六个责任文件的 re-export。
- 已新增结构测试 `scripts/tests/master-data-workbench-split.test.mjs`，先确认缺少拆分文件时红灯，再实现拆分。

### 2026-06-13 - IM181 主数据维护 model 行为不变拆分

#### 审计计划

- 按恢复计划 Stage 3 第四刀执行，只拆分 `components/master-data-maintenance-model.ts`。
- 旧入口必须降为兼容 re-export 入口，现有调用方 import path 不变。
- 本轮不改变可见 UI、路由、交互、业务语义、API URL、返回数据结构、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 已新增 types/entities/payloads/agent/reference/detail/import-dialog/formatters 八个主数据维护 model 责任文件。
- `components/master-data-maintenance-model.ts` 只保留八个责任文件的 re-export。
- 已新增结构测试 `scripts/tests/master-data-model-split.test.mjs`，先确认缺少拆分文件时红灯，再实现拆分。

### 2026-06-13 - IM182 可见动作位置规则固化

#### 审计计划

- 按恢复计划 Stage 3 第五刀执行，只固化可见动作位置边界。
- 用结构标记区分页级、筛选、列表、行内和危险确认动作，防止后续重新混放。
- 本轮不新增按钮、业务动作、路由、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- `SiteHeader` 页级动作区已标记为 `data-action-scope="page"`。
- 客服人员筛选区、列表工具栏、行内动作和冻结 Dialog 危险确认区分别标记为 `filter`、`list`、`row`、`danger`。
- 已新增结构测试 `scripts/tests/action-placement-structure.test.mjs`，先确认缺少页级 action scope 时红灯，再实现标记。
- 浏览器烟测确认 `/master-data/agents` 上页级动作是 `新建/批量导入`，筛选动作是 `查询/重置`，列表工具栏和行内动作边界可读。

### 2026-06-14 - IM183 共享空状态模式

#### 审计计划

- 按恢复计划 Stage 4 第二刀执行，只引入共享空状态组件。
- 先替换已经存在的同名本地 EmptyState，不扩大到所有 EmptyPanel/PanelState。
- 本轮不新增业务按钮、业务动作、路由、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 新增 `components/empty-state.tsx`，使用 lucide 图标、语义 token、稳定 `data-slot`、compact 高度和外部动作 slot。
- 替换 `components/import-center-batch-list-panel.tsx`、`components/import-center-batch-inspector-panel.tsx`、`components/import-center-review-cases-workspace.tsx` 中的本地同名 EmptyState。
- 新增结构测试 `scripts/tests/shared-empty-state.test.mjs`，先确认缺少共享组件时红灯，再实现共享空状态。
- 浏览器烟测确认数据质量页无匹配筛选下渲染共享空状态节点、标题、详情和图标。

### 2026-06-14 - IM184 主数据维护表单反馈一致性

#### 审计计划

- 按恢复计划 Stage 4 执行，只统一主数据维护表单反馈。
- 使用共享 client submit 组件承载提交中状态，避免在 server 表单文件里直接使用 hook。
- 本轮不新增业务字段、按钮、路由、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- 新增 `components/maintenance-submit-button.tsx`，使用 `useFormStatus` 提供 pending 禁用态和提交中文案。
- `components/master-data-maintenance-fields.tsx` 新增统一 `MaintenanceFieldLabel` 和必填视觉标识。
- `components/master-data-maintenance-forms.tsx` 已替换散落的裸 submit Button。
- 新增结构测试 `scripts/tests/master-data-form-feedback.test.mjs`，先确认缺少共享组件、字段标识和表单引用时红灯，再实现统一反馈。
- 浏览器烟测确认 `/master-data/agents/new` 渲染共享 submit、7 个必填标识且控制台无 error。

### 2026-06-15 - IM185 导航和 Breadcrumb 规则复核

#### 审计计划

- 按恢复计划 Stage 4 最后一刀执行，只固化导航和 Breadcrumb 规则。
- 不恢复未经确认的 `质量中心`、`数据质量中心` 或 generic `导入中心` Sidebar 入口。
- 不追求所有详情/新建/编辑页的 Sidebar 覆盖，不新增业务导航模块。

#### 执行结果

- `components/app-sidebar.tsx` 中主数据 `组织`、`技能` 导航项改为 prefix 匹配，覆盖详情/新建/编辑子路由。
- `components/site-header.tsx` 增加稳定 `site-header`、`site-header-breadcrumb`、`site-header-title` slot。
- 新增结构测试 `scripts/tests/navigation-breadcrumb-rules.test.mjs`，先确认组织/技能 prefix 和 header slot 缺失时红灯，再实现规则。
- 浏览器烟测确认 `/master-data/organizations/new` 与 `/master-data/skills/new` 对应父级导航高亮、Breadcrumb slot 存在且控制台无 error。

### 2026-06-15 - IM186 收口旧计划脚手架导航入口

#### 审计计划

- 只从 Sidebar 收口旧 demo 入口 `班次明细` 和 `不可用管理`。
- 旧 `/shift-details`、`/unavailability` 路由保持兼容，不扩大为路由删除或模型改名。
- 本轮不新增页面、业务能力、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- `components/app-sidebar.tsx` 已移除旧 demo 入口。
- `scripts/tests/navigation-breadcrumb-rules.test.mjs` 新增结构测试，防止旧 demo 入口重新回到 Sidebar。
- 浏览器烟测确认本地 Sidebar 保留已确认入口，且不再显示 `班次明细`、`不可用管理`。

### 2026-06-15 - IM187 收口排班计划旧链路入口

#### 审计计划

- 只收口当前 `/schedule-plans` 和 `/schedule-plans/[planId]` 页面里的旧 demo 深链。
- 旧 `/schedule-risks`、`/shift-details`、`/unavailability` 路由保持兼容，不扩大为路由删除。
- 本轮不新增页面、业务能力、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。

#### 执行结果

- `/schedule-plans` 已移除旧链路卡和旧风险表。
- `/schedule-plans/[planId]` 已移除旧复核链路按钮和旧风险/不可用查询。
- 已删除两个不再使用的旧链路组件，并新增结构测试防止当前排班计划入口重新链接到旧 demo 路由。

### 2026-06-15 - IM188 预测版本详情入口语义收口

#### 审计计划

- 从恢复计划 Stage 5 回到业务版本流，先处理预测版本入口语义。
- 只使用现有 `/demand-plans/production` 与 `/demand-plans/production/[batchId]` 路由，不新增版本路由或后端接口。
- 本轮不新增发布、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 预测版本列表行操作改为 `查看预测版本`。
- 预测版本详情页返回入口改为 `返回预测版本列表`，说明文案聚焦预测业务版本。
- 新增结构测试 `scripts/tests/demand-forecast-version-entry-semantics.test.mjs`，防止详情入口退回来源批次处理语义。

### 2026-06-15 - IM189 排班版本详情入口语义收口

#### 审计计划

- 延续 IM188 的业务版本入口规则，对排班版本做同构收口。
- 只使用现有 `/schedule-plans/production` 与 `/schedule-plans/production/[batchId]` 路由，不新增版本路由或后端接口。
- 本轮不新增发布、冻结、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 排班版本列表行操作改为 `查看排班版本`。
- 排班版本详情页返回入口改为 `返回排班版本列表`，说明文案聚焦排班业务版本。
- 新增结构测试 `scripts/tests/personnel-schedule-version-entry-semantics.test.mjs`，防止详情入口退回来源批次处理语义。

### 2026-06-15 - IM190 登录/状态日志版本详情入口语义收口

#### 审计计划

- 延续 IM188/IM189 的业务版本入口规则，对登录/状态日志版本做同构收口。
- 只使用现有 `/actual-logs/production` 与 `/actual-logs/production/[batchId]` 路由，不新增版本路由或后端接口。
- 本轮不新增日志处理增强、状态字典配置维护、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 登录/状态日志版本列表行操作改为 `查看日志版本`。
- 日志版本详情页返回入口改为 `返回日志版本列表`，错误标题和详情说明聚焦日志版本。
- 新增结构测试 `scripts/tests/actual-log-version-entry-semantics.test.mjs`，防止详情入口退回来源批次处理语义。

### 2026-06-15 - IM191 对比运行详情结果回看入口语义收口

#### 审计计划

- 延续 Stage 5 的结果回看语义，对对比运行详情页做最小收口。
- 只修改详情页顶部主返回入口，不新增 comparison run 列表页、计算触发、后端接口或写能力。
- 本轮不新增审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 对比运行详情页顶部主返回入口改为 `返回业务版本列表`。
- 页内 `来源链路` 和 `复核案例` tab 保持原有功能，不把复核案例作为页面父级。
- 新增结构测试 `scripts/tests/comparison-result-entry-semantics.test.mjs`，防止主返回入口退回 `返回复核案例`。

### 2026-06-16 - IM192 业务版本列表本地比对动作语义收口

#### 审计计划

- 延续 Stage 5 的比对运行结果回看语义，对业务版本列表里的本地比对动作做最小收口。
- 只修改现有 `/data-quality/versions` 模型文案和测试，不新增 comparison run 列表路由、后端接口或计算能力。
- 本轮不新增审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 本地比对候选和当前版本触发入口改为 `可发起比对运行` / `发起比对运行`。
- 比对提交反馈和回看入口改为 `比对运行已生成`、`查看比对运行列表`、`最新一次比对运行结果`。
- 业务版本列表回看标题改为 `业务版本列表比对运行结果`。
- 新增结构测试 `scripts/tests/version-comparison-action-semantics.test.mjs`，防止退回泛化比对/结果列表文案。

### 2026-06-16 - IM193 共享 lib helper 回归护栏

#### 审计计划

- 使用 Qoder 执行一个低风险机械测试任务，Codex 负责 Harness、范围、diff 审查、验证、提交和推送控制。
- Qoder 只允许新增 `scripts/tests/lib-helpers-regression.test.mjs`，不允许修改业务源码、共享 lib 实现、后端、check 脚本或依赖。
- 本轮不新增 UI、导航、路由、后端接口、数据库、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- Qoder 以 `ultimate` 模型新增共享 helper 回归结构测试；虽然 Qoder 返回 max-turns 错误，Codex 审查确认实际 diff 只有允许的测试文件。
- 新测试确认 `lib/api-result.ts`、`lib/api-error.ts`、`lib/import-api.ts` 存在，关键导出仍存在。
- 新测试扫描 `app/`、`components/`、`lib/`，防止 `formatApiError`、`fetchImportBatches`、`fetchImportFieldMappingTemplates` 函数定义重复回流。

### 2026-06-16 - IM194 共享 MetricCard 首刀

#### 审计计划

- 按第三方重构方案 Task 1 做最小首刀，不一次性全站替换。
- Product Design brief 锁定为保留现有 shadcn Card 指标卡视觉、静态展示、无新增动作。
- Qoder 只允许新增共享 MetricCard、迁移 `/demand-plans`、`/schedule-plans`、`/shift-details` 三个完全同构页面，并补结构测试。
- 本轮不新增页面、路由、数据读取、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `components/metric-card.tsx`，沿用现有 Card/Header/Description/Title/Content 结构。
- 三个目标页面改为引用共享 MetricCard，并移除本地 `MetricCard` 或 `SummaryCard` 函数。
- 新增 `scripts/tests/shared-metric-card-structure.test.mjs`，防止三处页面重新定义本地指标卡函数。
- Qoder 两次返回 max-turns，Codex 按实际 diff 审查后确认没有越权修改。

### 2026-06-16 - IM195 共享 MetricCard 旧风险不可用页迁移

#### 审计计划

- 延续 IM194，只处理已经确认完全同构的旧风险/不可用指标卡，不扩展到生产工作台变体。
- Product Design brief 继续锁定为保留现有 shadcn Card 指标卡视觉、静态展示、无新增动作。
- Qoder 只允许修改三处页面；Codex 负责结构测试扩展、diff 审查、验证、提交和推送控制。
- 本轮不新增页面、路由、数据读取、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `/unavailability`、`/unavailability/[unavailabilityId]`、`/schedule-risks/[riskId]` 改为引用共享 `MetricCard`。
- 三处页面本地同构 `MetricCard` 函数已删除。
- `scripts/tests/shared-metric-card-structure.test.mjs` 扩展到 6 个页面，防止本地指标卡函数回流。
- Codex 审查确认 Qoder 只做机械迁移；HTTP smoke 覆盖列表页和两条详情页。

### 2026-06-16 - IM196 共享列表搜索与状态筛选控件

#### 审计计划

- 按第三方重构方案 Task 2 做最小组件抽取，不做单一泛型大组件。
- Product Design brief 锁定为保持现有 shadcn Button/Input 列表筛选视觉和完整搜索/筛选/清空交互。
- Qoder 只允许机械实现两个共享控件和四个页面替换；Codex 负责 diff 审查、验证、提交和推送控制。
- 本轮不新增页面、路由、查询语义、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `SearchInputBar`，集中搜索图标、query 输入、隐藏字段和搜索按钮。
- 新增 `StatusFilterPills`，集中状态筛选按钮组 active/outline 渲染。
- 四个旧列表页复用共享筛选控件；状态筛选页保留原有 status 值和 href 生成逻辑。
- 新增结构测试防止四页重新内联 Search/Input/status map。

### 2026-06-16 - IM197 SimpleTable 首刀迁移 demand-plan-table

#### 审计计划

- 按第三方重构方案 Task 3 做首刀验证，只迁移一个轻量子表格，不一次性迁移 11 个表格。
- Product Design brief 锁定为保持现有 shadcn Table 视觉、列定义、排序入口和空状态文案。
- Qoder 只允许新增 `SimpleTable` 和迁移 `demand-plan-table`；Codex 负责 diff 审查、验证、提交和推送控制。
- 本轮不新增页面、路由、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `SimpleTable`，集中轻量表格的 TanStack Table 渲染、排序状态、header/body render loop 和空状态。
- `demand-plan-table` 保留原列定义、状态 Badge、排序按钮和默认 `plan_date` 排序，渲染委托给 `SimpleTable`。
- 新增结构测试防止 `demand-plan-table` 重新拥有 `useReactTable`、`flexRender` 或 shadcn Table 循环。
- HTTP smoke 覆盖正常列表和空状态。

### 2026-06-17 - IM198 SimpleTable 第二刀迁移 schedule-plan-interval-table

#### 审计计划

- 延续第三方重构方案 Task 3 和 IM197 结果，只迁移第二个轻量子表格，不扩大到所有表格。
- Product Design brief 锁定为保持现有 shadcn Table 视觉、列定义、排序入口和空状态文案。
- 本轮只允许迁移 `schedule-plan-interval-table` 并扩展结构测试；不新增页面、路由、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `schedule-plan-interval-table` 保留原列定义、覆盖率格式化、排序按钮和默认 `interval_start` 排序，渲染委托给 `SimpleTable`。
- `scripts/tests/simple-table-structure.test.mjs` 扩展覆盖 `schedule-plan-interval-table`，防止该表重新拥有 `useReactTable`、`flexRender` 或 shadcn Table 循环。
- 当前队列和 active tasks 已在完成后清空，不保留 done history。

### 2026-06-17 - IM199 SimpleTable 第三刀迁移 schedule-risk-shift-table

#### 审计计划

- 延续第三方重构方案 Task 3、IM197 和 IM198 结果，只迁移第三个轻量子表格，不扩大到所有表格。
- Product Design brief 锁定为保持现有 shadcn Table 视觉、列定义、排序入口和空状态文案。
- 本轮只允许迁移 `schedule-risk-shift-table` 并扩展结构测试；不新增页面、路由、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `schedule-risk-shift-table` 保留原列定义、状态 Badge、覆盖率格式化、排序按钮和默认 `plan_id` 排序，渲染委托给 `SimpleTable`。
- `scripts/tests/simple-table-structure.test.mjs` 扩展覆盖 `schedule-risk-shift-table`，防止该表重新拥有 `useReactTable`、`flexRender` 或 shadcn Table 循环。
- 当前队列和 active tasks 已在完成后清空，不保留 done history。

### 2026-06-17 - IM200 SimpleTable 第四刀迁移 schedule-risk-unavailability-table

#### 审计计划

- 延续第三方重构方案 Task 3、IM197 到 IM199 结果，只迁移第四个轻量子表格，不扩大到所有表格。
- Product Design brief 锁定为保持现有 shadcn Table 视觉、列定义、排序入口和空状态文案。
- 本轮只允许迁移 `schedule-risk-unavailability-table` 并扩展结构测试；不新增页面、路由、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `schedule-risk-unavailability-table` 保留原列定义、状态 Badge、排序按钮和默认 `staff_name` 排序，渲染委托给 `SimpleTable`。
- `scripts/tests/simple-table-structure.test.mjs` 扩展覆盖 `schedule-risk-unavailability-table`，防止该表重新拥有 `useReactTable`、`flexRender` 或 shadcn Table 循环。
- 当前队列和 active tasks 已在完成后清空，不保留 done history。

### 2026-06-17 - IM201 SimpleTable 第五刀迁移 unavailability-impact-shift-table

#### 审计计划

- 延续第三方重构方案 Task 3、IM197 到 IM200 结果，只迁移第五个轻量子表格，不扩大到所有表格。
- Product Design brief 锁定为保持现有 shadcn Table 视觉、列定义、排序入口、计划链接和空状态文案。
- 本轮只允许迁移 `unavailability-impact-shift-table` 并扩展结构测试；不新增页面、路由、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `unavailability-impact-shift-table` 保留原列定义、状态 Badge、计划链接、覆盖率格式化、排序按钮和默认 `plan_id` 排序，渲染委托给 `SimpleTable`。
- `scripts/tests/simple-table-structure.test.mjs` 扩展覆盖 `unavailability-impact-shift-table`，防止该表重新拥有 `useReactTable`、`flexRender` 或 shadcn Table 循环。
- 浏览器烟测确认 `/unavailability/unavail-20260511-001` 的影响班次表表头、2 行数据和计划链接保持正常，空态未误显示。
- 当前队列和 active tasks 已在完成后清空，不保留 done history。

### 2026-06-17 - IM202 SimpleTable 第六刀迁移 unavailability-impact-risk-table

#### 审计计划

- 延续第三方重构方案 Task 3、IM197 到 IM201 结果，只迁移第六个轻量子表格，不扩大到所有表格。
- Product Design brief 锁定为保持现有 shadcn Table 视觉、列定义、排序入口、明细链接和空状态文案。
- 本轮只允许迁移 `unavailability-impact-risk-table` 并扩展结构测试；不新增页面、路由、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `unavailability-impact-risk-table` 保留原列定义、风险 Badge、明细链接、排序按钮和默认 `risk_level` 排序，渲染委托给 `SimpleTable`。
- `scripts/tests/simple-table-structure.test.mjs` 扩展覆盖 `unavailability-impact-risk-table`，防止该表重新拥有 `useReactTable`、`flexRender` 或 shadcn Table 循环。
- 浏览器烟测确认 `/unavailability/unavail-20260511-001` 的关联风险表表头、1 行数据和明细链接保持正常，空态未误显示。
- 当前队列和 active tasks 已在完成后清空，不保留 done history。

### 2026-06-17 - IM203 SimpleTable 第七刀迁移 shift-details-table

#### 审计计划

- 延续第三方重构方案 Task 3、IM197 到 IM202 结果，只迁移第七个轻量子表格，不扩大到主列表或工作台表格。
- Product Design brief 锁定为保持现有 shadcn Table 视觉、列定义、排序入口、计划链接和空状态文案。
- 本轮只允许迁移 `shift-details-table` 并扩展结构测试；不新增页面、路由、业务文案、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `shift-details-table` 保留原列定义、状态 Badge、计划链接、覆盖率格式化、排序按钮和默认 `plan_date` 排序，渲染委托给 `SimpleTable`。
- `scripts/tests/simple-table-structure.test.mjs` 扩展覆盖 `shift-details-table`，防止该表重新拥有 `useReactTable`、`flexRender` 或 shadcn Table 循环。
- HTTP smoke 确认 `/shift-details?query=suzhou` 的班次明细页标题、表头、计划链接保持正常，空态未误显示。
- 当前队列和 active tasks 已在完成后清空，不保留 done history。

### 2026-06-17 - IM204 MainTableShell 边界规格

#### 审计计划

- IM203 已完成七个低风险 SimpleTable 迁移；继续机械迁移剩余 `useReactTable` 会触碰主列表/工作台表格。
- 本轮只允许新增边界规格和 trace 记录，确认 `schedule-plan-table`、`unavailability-table`、`data-table` 的候选优先级。
- 本轮不修改 UI 代码、页面、路由、数据读取、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `docs/design/main-table-shell-boundary-spec.md`，明确 `SimpleTable` 只适用于轻量子表格。
- 规格定义未来 `MainTableShell` 只可拥有 toolbar slot、筛选布局 slot、列显隐、summary strip slot、表格 render loop、empty row 和分页控制。
- 规格明确业务列定义、状态语义、row action、route href、数据查询、页面指标和生产能力必须留在具体表格或页面内。
- 候选顺序建议先 `schedule-plan-table`，再 `unavailability-table`，暂缓 `data-table`。

### 2026-06-17 - IM205 MainTableShell 结构护栏

#### 审计计划

- 延续 IM204 边界规格，先用 docs/test-only 结构护栏锁住 MainTableShell 职责边界。
- TDD 红灯必须先证明缺少 guard 文档会失败，再补最小文档让测试通过。
- 本轮不创建 `components/main-table-shell.tsx`，不修改候选表、页面、路由、数据读取、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `scripts/tests/main-table-shell-structure.test.mjs`，红灯失败原因是缺少 `docs/design/main-table-shell-structure-guard.md`。
- 新增 `docs/design/main-table-shell-structure-guard.md`，记录允许职责、禁止职责和候选顺序。
- 结构测试确认本轮没有创建 `components/main-table-shell.tsx`，`schedule-plan-table`、`unavailability-table`、`data-table` 也没有提前 import/render MainTableShell。

### 2026-06-17 - IM206 MainTableShell 首刀迁移 schedule-plan-table

#### 审计计划

- 延续 IM204/IM205 边界，只把第一个主表候选 `schedule-plan-table` 迁移到 MainTableShell，不扩大到 `unavailability-table` 或 `data-table`。
- Product Design brief 锁定为保持当前 shadcn Card/Table/Select/Button/DropdownMenu 视觉，保留排班计划搜索、状态筛选、缺口筛选、列显隐、排序、分页、汇总、重置和详情入口。
- MainTableShell 只拥有主表壳层、toolbar/summary slot、列显隐、TanStack 渲染循环、排序状态、分页状态和空态结构；业务筛选、列定义、详情路由和业务文案继续留在 `schedule-plan-table`。
- 本轮不新增页面、路由、数据读取、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `components/main-table-shell.tsx`，提供共享主表壳层和分页/列显隐能力。
- `components/schedule-plan-table.tsx` 委托 MainTableShell 渲染主表，同时保留排班计划业务列、筛选状态、摘要、详情链接和文案。
- `scripts/tests/main-table-shell-structure.test.mjs` 扩展为实现护栏：确认 MainTableShell 拥有共享结构，排班计划主表不再直接拥有渲染循环，其他候选表未提前接入。
- 结构测试、typecheck、lint、shadcn/tokens review 和浏览器烟测覆盖排班计划列表；最终验证结果记录在 branch log。

### 2026-06-17 - IM207 MainTableShell 第二刀迁移 unavailability-table

#### 审计计划

- 延续 IM204/IM205 边界和 IM206 实现，只把第二个主表候选 `unavailability-table` 迁移到 MainTableShell，不扩大到 `data-table`。
- Product Design brief 锁定为保持当前 shadcn Card/Table/Select/Button/DropdownMenu 视觉，保留不可用管理搜索、状态筛选、列显隐、排序、分页、汇总、重置、影响入口和班次入口。
- 不可用页面已有外层业务 Card，因此 MainTableShell 需要 embedded 模式避免 card-in-card；业务筛选、列定义、影响/班次路由和业务文案继续留在 `unavailability-table`。
- 本轮不新增页面、路由、数据读取、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- `components/main-table-shell.tsx` 增加 embedded 模式，并把列显隐控制作为 toolbar context 暴露给嵌入式表格。
- `components/unavailability-table.tsx` 委托 MainTableShell 渲染主表，同时保留不可用业务列、筛选状态、摘要、影响/班次链接和文案。
- `scripts/tests/main-table-shell-structure.test.mjs` 扩展为第二个实现护栏：确认不可用主表不再直接拥有渲染循环，`data-table` 未提前接入。
- 结构测试、typecheck、lint、shadcn/tokens review 和浏览器烟测覆盖不可用管理列表；最终验证结果记录在 branch log。

### 2026-06-17 - IM208 MainTableShell 收口与 data-table 暂缓决策

#### 审计计划

- IM197-IM207 已完成七个轻量 SimpleTable 表格、MainTableShell 边界/护栏，以及排班计划和不可用管理两个主表迁移。
- 本轮只做文档和 Harness 收口，确认不把 `components/data-table.tsx` 作为下一刀机械迁移。
- `data-table` 属于 `/dashboard` anomaly/demo table；在产品 owner、路由责任和真实 BPO 工作流价值重新确认前，迁移它的产品收益不足。
- 本轮不修改 UI 组件、页面、路由、数据读取、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 R908/US828/IM208 记录，明确当前表格抽象链路收口。
- 更新 MainTableShell 边界规格，写清重新评估 `data-table` 的前置条件。
- `data-table` 暂缓迁移不代表技术债遗漏；它是产品归属未确认前的有意停止。
- 当前队列和 active tasks 已在完成后清空，不保留 done history。

### 2026-06-17 - IM209 Dashboard anomaly table 产品归属审计

#### 审计计划

- 延续 IM208 收口结论，只审计 `/dashboard` anomaly table 的产品归属，不做 UI 改造。
- 读取 `/dashboard` 页面、`components/data-table.tsx`、`app/dashboard/data.ts`、F030/F031/Q012 历史需求和 MainTableShell 收口文档。
- 判断 `DataTable` 是经营总览 summary widget、异常分诊入口，还是应替换为真实下游结果摘要。
- 本轮不修改 UI 组件、页面、路由、数据读取、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `docs/design/dashboard-anomaly-table-ownership-audit.md`。
- 结论：`DataTable` 当前归属 `/dashboard` 经营总览，是本地 anomaly overview widget。
- 证据：数据来自静态 `app/dashboard/data.ts`，行操作仍是占位；历史 R058-R060/US070-US072 定义的是 dashboard table parity；真实异常追踪上下文已经在 data-quality、comparison-run、review-case、import-batch 和 actual-log production 页面形成。
- 默认路径：保留 overview，不进入 MainTableShell 机械迁移队列。未来如要升级，先定义异常行路由到 comparison run、review case、import quality trace 或 actual-log production detail 的产品语义。

### 2026-06-17 - IM210 Dashboard 下游工作区入口规格

#### 审计计划

- 延续 IM209 结论，不做 dashboard UI 改造，只定义 future row entry semantics。
- 读取现有 comparison-run、review-case、import batch、actual-log production、schedule production 详情页面，确认可复用的真实下游工作区。
- 明确 dashboard 只能持有摘要和入口，不能拥有复核写入、关闭、对比计算、批次应用、生产动作或权限/审批/导出等能力。
- 本轮不修改 UI 组件、页面、路由、数据读取、后端、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- 新增 `docs/design/dashboard-downstream-entry-spec.md`。
- 结论：未来 dashboard anomaly entry 只能是 summary-to-workspace link。
- 允许目标限定为已有详情工作区：comparison run detail、review case detail、import batch result trace、actual-log production detail、schedule production detail。
- 缺少稳定 `caseId`、`runId` 或来源 `batchId` 时，未来实现不得伪造行级跳转、状态、复核结论或生产动作。

### 2026-06-17 - IM211 Dashboard anomaly row 下游入口阻塞态

#### 审计计划

- 延续 IM210 规格，只做 read-only/link-only 的最小前端实现。
- 当前静态 dashboard anomaly rows 没有稳定下游 ID，因此默认应显示 blocked entry，而不是泛化行操作按钮。
- TDD 先补模型测试，再改 `data-table-model` 和 `data-table`。
- 本轮不新增真实异常查询、新路由、新查询参数、后端、数据库、依赖、权限、审批、导出、批量、自动排班、生产公式、结算、合同、最低人力或收费因子。

#### 执行结果

- RED：`node --test scripts/tests/dashboard-table-model.test.mjs` 先因缺少 `buildDashboardAnomalyEntryState` export 失败。
- GREEN：新增 anomaly downstream entry 状态模型；无 `downstreamEntry` 返回 `等待下游定位` blocked 状态，有稳定 review case ID 时生成既有详情链接。
- `components/data-table.tsx` 的操作列不再显示泛化占位按钮；当前静态数据没有 stable downstream ID，因此显示 disabled 阻塞态。

### 2026-06-17 - IM212 Dashboard anomaly 链路收口与真实工作区回切

#### 审计计划

- 收口 IM209-IM211，不继续在 dashboard anomaly 静态行上扩展异常处理语义。
- 对照项目理解与需求基线：经营总览是 Dashboard，真实复核、对比、导入质量和生产处理应在下游业务域承载。
- 只新增 product/design 收口记录和 Harness 追踪，不修改 UI、路由、数据、后端或依赖。

#### 执行结果

- 新增 `docs/design/dashboard-anomaly-chain-closeout.md`。
- 结论：dashboard anomaly 链路已到停止点，当前只保留经营总览摘要、future summary-to-workspace 规格，以及缺少稳定下游 ID 时的 `等待下游定位`。
- 下一阶段推荐从真实复核案例工作区、对比运行工作区、导入质量结果追踪中选择，不再向静态 dashboard 行补伪 ID 或处理动作。

### 2026-06-17 - IM213 项目理解需求基线校准

#### 审计计划

- 对齐 2026-06-14 外部项目理解与需求文档和 2026-06-17 当前 Harness 状态。
- 只判断需求基线是否仍有效、哪些状态判断已过期、哪些事项需要新 Gate。
- 不把旧 P0/P1 清单直接转为开发任务，不修改 UI、路由、数据、后端或依赖。

#### 执行结果

- 新增 `docs/design/project-understanding-requirements-calibration.md`。
- 结论：外部文档的业务背景、核心概念、五大业务域、用户角色和目标 IA 仍可作为产品基线。
- 结论：外部文档中的当前状态和待实现排序必须按当前 Harness 重校准；错误边界、loading、Tab 化、空状态、数据质量和复核链路已有后续推进。
- 结论：认证、权限、审批、导出、批量、自动排班、生产公式、结算和收费因子仍是硬边界，需要单独 Gate。
