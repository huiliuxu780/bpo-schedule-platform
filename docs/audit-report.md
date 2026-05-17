# Audit Report

本文件记录 Harness 闭环审计结果、风险、阻塞和建议。

## Current Audit

### 2026-05-16 - Organization People Imported Records

#### 审计结论

- `F128/Q055` 已新增 `/organization-people` 本机只读预览页，读取 localhost-only `staff_master` processed records。
- 侧边栏 `系统管理 > 组织与人员` 已从 `开发中` 改为真实入口；供应商管理、规则配置、权限管理和操作审计继续标注 `开发中`。
- 页面展示 `组织与人员 records`、人员样本、团队/职场/供应商分布和最近批次，不提供账号、权限、组织维护或主数据写回动作。

#### 风险

- 当前只证明导入坐席主数据能进入系统管理页面，不代表账号登录、权限、组织架构维护、生产审计或主数据治理已经完成。

#### 建议

- 后续如果要做权限管理、用户账号、组织维护、操作审计或主数据写回，必须先开独立 Gate；当前阶段继续优先补本机只读产品页面。

### 2026-05-16 - Field Mapping Imported Records

#### 审计结论

- `F127/Q054` 已新增 `/field-mapping` 本机只读预览页，读取 localhost-only `staff_master`、`status_log` 和 `login_log` processed records 样本字段。
- 侧边栏 `数据与集成 > 字段映射` 已从 `开发中` 改为真实入口；`接口集成` 继续标注 `开发中`。
- 页面展示 `字段映射 records`、三类数据源的已识别字段、缺失字段、额外字段和最近批次，不提供保存、发布或写回动作。

#### 风险

- 当前只证明导入样本字段能进入字段映射页面，不代表字段映射配置、写回、真实接口检查或跨系统对账已经完成。

#### 建议

- 后续如果要做可编辑字段映射、接口检查或跨系统对账，必须先开独立 Gate；当前阶段继续优先补本机只读产品页面。

### 2026-05-16 - CORN Status Log Imported Records

#### 审计结论

- `F126/Q053` 已新增 `/corn-status-log` 本机预览页，读取 localhost-only `status_log` processed records。
- 侧边栏 `数据与集成 > CORN 状态日志` 已从 `开发中` 改为真实入口；`字段映射` 和 `接口集成` 继续标注 `开发中`。
- 页面展示 `CORN 状态日志 records`、状态数据行数、最近批次、状态分布和样本，不声称真实 CORN 集成。

#### 风险

- 当前仅证明导入后状态日志 records 能进入产品页面，不代表真实 CORN 接口、实时状态流或生产状态码已经完成。

#### 建议

- 后续继续补齐数据与集成页面时，优先做本机只读预览；字段映射、接口集成、状态写回、真实接口检查和生产状态码仍需独立 Gate。

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

### 2026-05-13 - current-state governance closeout

#### 审计结论

- `H029/US103` 已对齐 `AGENTS.md`、`docs/quality/GATE_REGISTRY.md`、`docs/quality/STATE_MANAGEMENT.md`、`docs/harness/lightweight-harness.md` 和 `docs/current/PROJECT_CONTEXT.md` 的默认读集与 SoT 口径。
- `docs/current/ACTIVE_TASKS.yaml` 已明确为轻量执行合同，只保留 `id / story_ids / status / gate / branch / allowed_files / forbidden_files / stop_conditions / acceptance_ref / verification / evidence_expected`。
- `scripts/check-state.sh` 已新增 current 状态枚举、active task 最小字段、gate 存在性、registry 路径与预算、archive 不可执行、inline trace entry 和 active diff scope 校验。
- `strict` 失败后的行为已固化为 `state-repair only`；普通开发不能在状态失败时继续推进。
- `H029` 完成后 current queue 与 active tasks 已恢复为空，不保留 done 历史。

#### 风险

- `TRACE_INDEX.yaml`、legacy backlog 和审计日志仍会继续增长；当前已经加了 line budget 和 lookup-only 规则，但后续仍需要按窗口做归档治理。
- active diff scope 校验依赖任务执行期间 current active task 仍在场；完成后清空 current 属于预期，因此要保证任务关闭前至少跑过一次 active 状态下的 strict check。

#### 验证

- `bash scripts/check-state.sh --strict`：通过。
- `bash scripts/check-state.sh --repair-scope`：通过。
- `node --test scripts/tests/check-state.test.mjs`：通过，15 个 state-check 回归测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、15 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - 风险提示独立工作台

#### 审计结论

- `F060/US104` 已新增 `/schedule-risks` 工作台页，集中展示本地风险列表、摘要和复核入口。
- 侧边栏新增稳定 `风险提示` 导航入口；计划详情与不可用影响定位页面已统一跳到风险工作台上下文，而不是间接回到计划页或只落单条详情。
- 风险明细页已补 `返回风险列表` 入口，保持计划详情和风险工作台之间的来回复核链路。
- 新页面和跳转全部复用本地风险契约与现有 TanStack Table 行为；没有引入数据库、依赖、后端契约变更、审批、导出、批量或生产公式。

#### 风险

- 当前工作台的上下文过滤是前端本地过滤，不等同于后端查询契约；未来若引入真实数据或分页，需要单独 Gate。
- `next-env.d.ts` 会随 Next 路由类型生成变化，因此已纳入当前任务允许范围；后续新增路由时也要注意这类生成文件。

#### 验证

- Safari smoke：`http://localhost:3016/schedule-risks` 正常显示 3 条风险；按计划上下文 URL 过滤后正常收敛到 1 条。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，10 个测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、15 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - 风险工作台 QA 收口

#### 审计结论

- `Q015/US105` 已完成对风险工作台链路的 QA 收口，确认 `/schedule-risks` 独立页、按计划上下文筛选页、计划详情、风险明细和不可用明细之间的风险复核链路可访问、可追溯。
- sidebar 的 `风险提示` 入口、计划详情页的 `查看风险`、风险明细页的 `返回风险列表`、不可用明细页的 `查看风险列表` 已形成一致的 no-database 本地 MVP 导航闭环。
- QA 收口没有引入新的业务实现范围，只回写了 current state 和 traceability；数据库、依赖、后端契约、审批、导出、批量、权限和生产公式边界保持不变。

#### 风险

- 当前验收仍基于本地 seed 数据和 SSR 页面内容；未来若切到真实后端分页或服务端过滤，需要单独 Gate 重新验收。
- 风险工作台目前是主内容区表格，不存在独立右侧任务 rail；如果要固定右侧待办视图，需要作为新故事单独设计和实现。

#### 验证

- 本地 prod smoke：`http://localhost:3014/schedule-risks`、按计划上下文筛选的 `/schedule-risks?...`、`/schedule-plans/plan-20260511-shanghai-bosch-v1`、`/schedule-risks/risk-plan-20260511-shanghai-bosch-v1-09%3A30`、`/unavailability/unavail-20260511-001` 均返回预期页面关键文案，风险链路完整。
- `bash scripts/check-state.sh --strict`：通过。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，10 个测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、15 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - scoped drilldown 与右侧 rail 连续块

#### 审计结论

- `F061-F064/US106-US109` 已把风险复核链路从“宽泛列表跳转”收紧为“scoped drilldown”：班次明细与不可用列表页支持精确上下文过滤，计划详情、风险明细、风险工作台、不可用影响定位和表格操作入口都能保留同一复核范围。
- `/schedule-risks` 已新增宽屏右侧复核 rail，显示当前范围摘要、关键指标和跨页动作，不再只有中间主表格区。
- 这组改动仍然全部停留在本地页面、前端过滤和本地 seed 契约层，没有引入数据库、依赖、后端契约变更、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 scoped drilldown 仍是本地过滤逻辑；未来如果接真实后端分页、服务端过滤或持久化，需要重新定义参数契约并单独过 Gate。
- 右侧 rail 目前是本地复核辅助视图，不是任务系统，也不持久化用户状态；如果后续要变成真实任务面板，需要新故事单独定义。

#### 验证

- Safari smoke：验证了 scoped 风险工作台显示右侧 rail、scoped 班次明细页、scoped 不可用页，以及这些页之间的返回/继续复核入口。
- 本地 HTTP smoke：计划详情、风险明细、不可用详情的 HTML 中均包含 scoped 链接参数。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，12 个测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、15 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-13 - review rail 与 continuation action 连续块

#### 审计结论

- `F065-F068/US111-US114` 已把 review rail 从风险工作台扩展到 `班次明细` 和 `不可用管理` 两页，宽屏下右侧固定显示当前范围、关键指标和继续复核入口，页面不再只剩主表格区。
- `计划详情 -> 0.5h 时段明细` 现在可直接继续查看同范围的风险、班次和不可用；`不可用影响定位 -> 关联风险` 现在可直接继续查看风险、班次和计划详情，detail-to-detail 复核链路保持在同一上下文内。
- 本轮新增 `lib/review-navigation.ts` 统一 review 链路的本地 URL 拼装，减少多页重复 query 组装逻辑。
- 整个批次仍然停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约变更、审批、导出、批量、权限或生产公式。

#### 风险

- 这组 review rail 和 continuation actions 仍基于前端本地 query 参数与本地过滤，不等同于服务端查询契约；未来如果接入真实分页、服务端过滤或持久化，需要单独过 Gate。
- in-app browser runtime 在本轮 smoke 时两次连接超时，因此最终验收证据采用本地 dev server HTML smoke 和全量 `bash scripts/check.sh`；如果后续要补视觉级截图，应在 browser runtime 恢复后单独补一轮。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，16 个测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、15 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。
- 本地 dev server：`npm run dev -- --port 3014` 启动成功。
- 本地 HTTP smoke：`/shift-details`、`/unavailability`、`/schedule-plans/plan-20260511-shanghai-bosch-v1`、`/unavailability/unavail-20260511-001` 的 HTML 均包含本轮新增的 rail 或 continuation action 关键文案。

### 2026-05-13 - detail 页右侧 rail 连续块

#### 审计结论

- `F069-F072/US116-US119` 已把宽屏右侧复核 rail 补到 `排班计划详情`、`风险明细`、`不可用影响定位` 三个 detail 页，三页现在都能在主内容旁固定显示范围摘要、关键指标和继续复核入口。
- `计划详情 / 风险明细 / 不可用影响定位` 的 detail-level review actions 已继续收敛到 `lib/review-navigation.ts`，避免 query 拼装再次散落回页面内部。
- 整个批次仍然停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约变更、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 detail 页右侧 rail 仍是本地复核辅助视图，不持久化用户状态；如果后续要变成真实任务面板或带用户偏好，需要新故事单独定义。
- HTML smoke 能验证 rail 文案和入口存在，但不是视觉级截图验收；如果要补视觉截图，应在浏览器 runtime 稳定时单独补一轮。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，19 个测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state check、15 个 state-check 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。
- 本地 HTTP smoke：`/schedule-plans/plan-20260511-shanghai-bosch-v1`、`/schedule-risks/risk-plan-20260511-shanghai-bosch-v1-09%3A30`、`/unavailability/unavail-20260511-001` 的 HTML 均包含 `当前复核范围`、`复核任务` 和对应 `回到全部` 关键文案。

### 2026-05-13 - Harness 文档一致性与 Hook 守门

#### 审计结论

- `AGENTS.md`、`docs/quality/STATE_MANAGEMENT.md`、`docs/quality/GIT_BRANCH_WORKFLOW.md`、`docs/quality/GATE_REGISTRY.md` 和 `docs/harness/lightweight-harness.md` 已对齐 current-layer 启动入口、SoT 优先级和 hook 边界。
- `docs/current/ACTIVE_TASKS.yaml` 最小合同已包含 `traceability_files`，并在详细规则中定义了 batch 约束、gate 组合和 diff scope。
- `scripts/check-state.sh` 已支持 `--diff=working|staged|none`，并校验 branch、acceptance_ref、trace index 预算、product task state-boundary、batch gate combo 与 closeout diff。
- 已新增 `scripts/hooks/pre-commit`、`commit-msg`、`pre-push`、`scripts/install-hooks.sh` 和 `scripts/validate-commit-message.mjs`；hook 只拦截不一致，不自动生成或修改文档。
- `scripts/check.sh` 会在 `npm run typecheck` 前清理 stale `.next` route typings，避免跨分支生成物污染标准验证。

#### 风险

- `TRACE_INDEX.yaml` 仍低于 warning 和 strict 预算，但继续增长后需要再做窗口化收口。
- 当前 hook 守门依赖自写轻量 YAML 解析；如果 batch/contract 继续复杂化，后续应考虑单独的 Node 校验器。

#### 验证

- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `node --test scripts/tests/check-state.test.mjs`：通过，20 个测试通过。
- `node --test scripts/tests/validate-commit-message.test.mjs`：通过，5 个测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、两组 node 回归、lint、typecheck、Next build 和后端 19 个 unittest。
- `bash scripts/install-hooks.sh`：通过，repo-local hooks 已安装。

### 2026-05-13 - TRACE_INDEX 预算治理与窗口化

#### 审计结论

- `H031/US122` 已把 `TRACE_INDEX` 从 428 行压缩到 313 行，warning 预算信号已消失。
- registry 现在明确采用“先压缩再归档”的减重顺序，避免为轻度超预算触发大范围 archive transaction。
- 本轮只修改 current/registry/quality/traceability 文档，没有碰业务代码、依赖、package/lockfile、数据库、认证、权限、审批、导出、批量或生产公式。

#### 风险

- 这次减重主要依赖结构压缩；如果后续继续高速增长，仍然可能需要真正的 archive window 任务。
- 当前压缩保留了完整 ID 与关系，但可读性比多行块更紧凑；后续如要引入自动 formatter，需要确保不把 registry 再次膨胀回去。

#### 验证

- `wc -l docs/registry/TRACE_INDEX.yaml`：313 行。
- `bash scripts/check-state.sh --strict --diff=working`：通过，已无 registry budget warning。
- `git diff --check`：通过。

### 2026-05-13 - Traceability Closeout Guard

#### 审计结论

- `H032/US123` 收口了 current 已清空后的最后一个 traceability 自锁点：当 staged diff 只包含 `docs/dev/branch-log.md` 的 commit-SHA 证据回写时，strict staged state check 现在允许继续提交。
- 这个例外保持得很窄：branch-log-only 可以通过，但没有 active task 的其他 staged diff 仍然失败，没有把“无 active task 也能改文档”扩成通用能力。
- 最近缺失的 branch-log `local_commit_sha` 已补齐到真实提交：`Q015 -> 550dea1`，`F061-F064 -> 0c5b47c`，`F065-F068 -> 5be22c2`，`F069-F072 -> 1c70ea8`，`H031 -> 0b63408`。

#### 风险

- `H032` 自己的 `local_commit_sha` 仍然存在自引用问题，必须由下一次 traceability closeout pass 回填；这不是规则缺口，而是 Git commit SHA 生成顺序的天然限制。
- 当前放行范围刻意只到 `docs/dev/branch-log.md`；如果后续想扩到其他 traceability 文件，需要单独 state-hygiene 任务验证边界。

#### 验证

- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --repair-scope`：通过。
- `node --test scripts/tests/check-state.test.mjs`：通过，23 个测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state 回归、commit-message 回归、lint、typecheck、Next build 和后端 19 个 unittest。

### 2026-05-13 - Shared Review Checklist Rail

#### 审计结论

- `F073-F076/Q019/US124` 已把 risk/plan/shift/unavailability 相关页面右侧重复的 `复核任务` 区块收敛成共享 `ReviewChecklistRail` 组件。
- 这套共享 rail 统一展示范围摘要、关键指标、当前步骤、下一步、scoped continuation actions 和稳定回退入口，列表页与 detail 页不再各自维护分散的两张卡片。
- 本轮仍然保持 no-database、no-dependency、no-backend-contract、no-approval/export/batch/permission/production-formula 边界。

#### 风险

- 当前 rail 仍是本地静态复核辅助视图，不持久化用户级任务完成状态；如果后续要引入真实任务状态，需要新故事单独定义。
- 本轮验证以源码回归、strict state、lint/typecheck/build 和后端回归为主，没有补视觉截图审计。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，21 个测试通过。
- `bash scripts/check-state.sh --strict`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state 回归、commit-message 回归、lint、typecheck、Next build 和后端 19 个 unittest。
- 新增回归：branch-log-only post-closeout staged diff 通过；无 active task 的其他 staged diff 继续失败。

### 2026-05-13 - Product Closeout Guard

#### 审计结论

- `H034/US126` 收口了最后一个产品 closeout 自锁点：same-commit product closeout 现在同时通过 strict state 和 commit-message 守门。
- `check-state` 在合法 closeout transition 中，会允许清空 `docs/current/**` 所需的 current 文件修改，但不会放宽普通产品任务对 current/registry 的写权限。
- `validate-commit-message` 在 current 已清空但 staged diff 属于合法 closeout 时，会从 `HEAD` 的 active task 合同识别普通任务 id，因此产品提交仍可使用 `F0xx:` 形式。

#### 风险

- 这次放行刻意只限于“当前快照为空、`HEAD` 有 active task、staged diff 属于 same-commit closeout”的窄场景；如果后续出现新的 closeout 变体，需要单独 state-hygiene 任务验证。
- 轻量 YAML 解析和 HEAD 回看逻辑仍是 repo 内脚本实现；如果 contract 继续变复杂，后续应考虑更稳的 Node 校验器。

#### 验证

- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `node --test scripts/tests/check-state.test.mjs`：通过，25 个测试通过。
- `node --test scripts/tests/validate-commit-message.test.mjs`：通过，7 个测试通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、两组 node 回归、lint、typecheck、Next build 和后端 19 个 unittest。

### 2026-05-14 - Scoped Detail Navigation Across Review Drilldown

#### 审计结论

- `F077-F079/Q020/US127` 已把 risk / unavailability / 关联风险表进入 detail 页的 scoped 链路补齐到统一 helper：detail URL 现在保留当前 review scope 和来源页，不再回退到无 scope 的 detail 页面。
- `排班计划详情`、`风险明细`、`不可用影响定位` 三个 detail 页现在使用统一的 scoped back-link 逻辑；detail 页内的相关计划跳转也会保留来源页和当前 scope，不再把用户扔回全量列表。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 scoped navigation 仍然建立在本地 query 参数与本地过滤之上，不等同于服务端分页、服务端过滤或用户级持久化返回态；后续如果接入真实查询契约，需要单独过 Gate。
- 本轮验证以源码回归、strict state、lint/typecheck/build 和后端回归为主，没有补视觉截图审计；如果后续要补视觉级证据，应单独做 browser smoke。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，24 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Plan-Origin Review Back-Link Closure

#### 审计结论

- `F080-F082/Q021/US128` 已把 `schedule-plans` 补成一等来源页：从计划详情进入班次、风险、不可用后，返回动作不再掉回宽泛列表，而是回到当前计划详情。
- `班次明细` 现在识别计划来源页，并把该来源继续透传到风险和不可用动作；`不可用影响定位` 内部的关联风险表动作也会保留同一来源页。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前来源页闭环仍建立在本地 query 参数与本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮验证以源码回归、strict state、lint/typecheck/build 和后端回归为主，没有补视觉截图审计；若要补视觉级证据，应单独做 browser smoke。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，26 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Plan-Origin Row-Action Context Closure

#### 审计结论

- `F083-F084/Q022/US129` 已把剩余的 plan-origin 缺口从 detail 页继续收到了表格行级动作：计划详情时段表里的 风险 / 班次 / 不可用 按钮现在显式保留 `schedule-plans` 作为来源页。
- `班次明细表` 不再使用裸 href 拼接计划/风险链接，而是统一改为 review helper，并从当前 URL 读取来源页上下文；因此从计划详情进入班次明细后，再从表格行继续钻取，也不会丢失当前计划的复核来源。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮保参仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮已经成功启动本地 dev server，但 cross-sandbox localhost smoke 因审批超时未纳入最终证据；当前验收主要依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，28 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Unavailability Impact Shift-Table Scoped Plan-Link Closure

#### 审计结论

- `F085/Q023/US130` 已把剩余的 scoped plan-link 缺口收到了不可用影响定位页的影响班次表：表格里的 `计划` 行级动作现在会保留当前 review source 和不可用范围，而不是跳到无上下文的裸计划详情。
- `UnavailabilityImpactShiftTable` 已与其他 review tables 对齐到 helper 驱动的链接模式；调用页会显式传入 `sourceFrom + project/site/date/start/end`，因此从不可用详情继续查看计划时，返回链路不再丢上下文。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 这条保参仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加新的 browser smoke 证据；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，29 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Risk Detail Auxiliary-Table Continuation Closure

#### 审计结论

- `F086-F087/Q024/US131` 已把风险明细页剩余的两个只读辅表收成 continuation tables：关联班次表现在提供 `计划 / 班次` 行级动作，不可用表现在提供 `影响 / 班次` 行级动作。
- 风险明细页会把 `sourceFrom` 透传给两张辅表，因此从 risk detail 内部继续跳到计划、班次或不可用影响时，仍保留当前风险来源页和范围，不会掉回无上下文列表。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮 continuation actions 仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加新的 browser smoke；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，31 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Review List Row-Action Parity Closure

#### 审计结论

- `F088-F089/Q025/US132` 已把风险列表与不可用列表剩余的 row-action parity 缺口补齐：风险列表现在提供 `明细 / 班次 / 计划 / 不可用`，不可用列表现在提供 `影响 / 班次 / 风险`。
- 这让列表页 row-level review 和右侧 review rail 提供的 continuation surface 保持一致，用户不必先进入 detail 页才能继续计划、班次、风险或影响定位链路。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮 row-action parity 仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加新的 browser smoke；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，33 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan List Review Parity Closure

#### 审计结论

- `F090-F091/Q026/US133` 已把排班计划列表的最后一个 row-action parity 缺口补齐：计划列表现在提供 `查看 / 风险 / 班次 / 不可用` 四类 scoped continuation actions。
- 这让计划列表本身也能作为 review chain 的稳定入口，不必先进入计划详情再继续跳转到风险、班次或不可用链路。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮 row-action parity 仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加新的 browser smoke；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，34 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan Draft Flow Context Closure

#### 审计结论

- `F092-F093/Q027/US134` 已把排班计划 draft 工作流的剩余上下文缺口补齐：从计划列表进入 `新建草稿` 会保留当前 `query/status`，从计划详情进入 `编辑草稿` 会保留来源页与 review scope。
- `new/edit` 页的返回、取消和提交后回跳现在统一走 review helper，因此创建或保存 draft 后不会退化成裸列表或无来源计划详情。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮 draft-flow 上下文仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加新的 browser smoke；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，36 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan Draft Failure Feedback Closure

#### 审计结论

- `F094-F095/Q028/US135` 已把排班计划 draft 工作流剩余的失败反馈缺口补齐：当 `new/edit` 因本地失败带着 `draft=failed` 回跳时，计划列表和计划详情都会显示可见提示。
- 这让 draft 回跳不再把失败结果藏在 URL 参数里，用户在当前列表或详情上下文内就能立即知道刚才的本地操作没有完成。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮失败提示仍建立在本地 query 参数和本地页面文案之上，不等同于后端错误分类或持久化操作日志；后续若接入真实错误通道，需要单独过 Gate。
- 本轮没有追加新的 browser smoke；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，37 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan Draft Success Feedback Closure

#### 审计结论

- `F096-F097/Q029/US136` 已把排班计划 draft 工作流剩余的成功反馈缺口补齐：本地创建草稿成功后，计划详情会显示 `草稿已创建`；本地保存草稿成功后，计划详情会显示 `草稿已保存`。
- 这让 create/save 的成功结果不再只体现为路由跳转，用户在计划详情页就能直接知道刚才的本地操作已经完成。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮成功提示仍建立在本地 query 参数和本地页面文案之上，不等同于后端事务状态或持久化操作日志；后续若接入真实成功/失败通道，需要单独过 Gate。
- 本轮没有追加新的 browser smoke；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，38 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan List Detail Context Closure

#### 审计结论

- `F098-F099/Q030/US137` 已把排班计划列表进入 detail 的剩余上下文缺口补齐：计划列表表格中的 `查看` 动作现在会保留当前 `query`、`status` 和 `from=schedule-plans`。
- 这让用户从列表进入计划详情后，detail 页的返回动作可以稳定回到同一筛选列表，而不是掉回无筛选列表或裸详情路径。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮列表到 detail 的返回态仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加新的 browser smoke；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，39 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan List-Origin Review Return Closure

#### 审计结论

- `F100-F101/Q031/US138` 已把排班计划列表直达 `风险 / 班次 / 不可用` 的剩余来源页缺口补齐：计划列表行级动作现在使用独立的 `schedule-plans-list` source，而不是复用计划详情 drilldown 来源。
- 这让风险、班次、不可用页可以把返回目标稳定指向当前筛选计划列表，不再把列表发起的 review chain 误判成计划详情发起的 drilldown。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮 list-origin return 仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有再追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，41 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan Risk-Entry Context Closure

#### 审计结论

- `F102-F103/Q032/US139` 已把排班计划页风险总览入口和内嵌风险预览表的剩余上下文缺口补齐：计划页风险总览卡片的 `查看全部` 动作现在保留 `from=schedule-plans-list`、`query` 和 `status`，计划页内嵌风险预览表的 row actions 也会保留同一 plan-list review context。
- 这让用户从排班计划页进入风险工作台后，继续查看风险、班次、计划和回退时，都能稳定回到同一筛选计划列表，不再掉回泛化风险页或丢掉计划列表筛选状态。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮 risk-entry context 仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，44 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

### 2026-05-14 - Schedule Plan Summary CTA Context Closure

#### 审计结论

- `F104-F105/Q033/US140` 已把排班计划页本地 MVP flow summary 的剩余上下文缺口补齐：summary CTA 不再使用硬编码 risk detail 或裸跨页链接，而是统一走 context-aware helper routing。
- 这让用户从计划页 summary 层进入风险、不可用和班次页时，仍能保留 `schedule-plans-list`、`query` 和 `status`，后续回退和 continuation 也能保持在同一计划列表上下文内。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 本轮 summary CTA context 仍建立在本地 query 参数和本地 helper 之上，不等同于服务端 session 或用户级持久化返回态；后续若接入真实状态保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，45 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-14 - Risk Workbench CTA Context Closure

#### 审计结论

- `F106-F107/Q034/US141` 已把风险工作台头部剩余的 CTA 上下文缺口补齐：头部 `不可用管理` 不再使用裸跨页链接，默认回退 CTA 也不再把用户误导回排班计划页。
- 这让用户从 `schedule-plans-list` 链路进入风险工作台后，继续切到不可用页时仍会保留当前 review context；而直接进入风险工作台时，默认回退目标也会稳定留在风险工作台。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 CTA 上下文仍建立在 query 参数和本地 helper 之上，不等同于真实用户态持久化返回；若后续需要跨会话或服务端态保持，仍需单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，46 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-14 - Demand Plan Schedule CTA Context Closure

#### 审计结论

- `F108/Q035/US142` 已把需求计划页进入排班计划页的剩余 CTA 上下文缺口补齐：头部 `查看排班计划` 不再使用裸 `/schedule-plans`，而是保留当前 demand query。
- 这让用户从需求页带着搜索条件切到排班 review flow 时，不会在第一跳就丢掉正在看的需求范围。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 handoff 仍建立在 query 参数和本地 helper 之上，不等同于服务端态或用户级持久化返回；若后续需要跨会话保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，47 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-14 - Risk Workbench Clear-Scope CTA Context Closure

#### 审计结论

- `F109/Q036/US143` 已把风险工作台 scoped `查看全部` 的剩余上下文缺口补齐：清掉 plan/date/site drilldown 时，不再把 query/status 一起清空。
- 这让用户从局部风险范围回到风险列表时，仍能保留当前列表筛选，而不是退回完全裸的风险页。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 clear-scope 行为仍建立在 query 参数和本地 helper 之上，不等同于服务端态或用户级持久化返回；若后续需要跨会话保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，48 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-14 - Shift And Unavailability Clear CTA Context Closure

#### 审计结论

- `F110-F111/Q037/US144` 已把 `shift-details` 与 `unavailability` 剩余的 clear CTA 上下文缺口补齐：scoped `清空范围` 不再使用裸列表链接，列表层 `清空` 也不再把当前 review source 一起丢掉。
- 这让用户从 plan/risk/unavailability/shift drilldown 进入这两页后，既可以只清当前 scope 回到同一列表态，也可以清空本页筛选而不破坏上游回退目标。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 clear 行为仍建立在 query 参数和本地 helper 之上，不等同于服务端态或用户级持久化返回；若后续需要跨会话保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，50 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-14 - Schedule Plans Draft Feedback Context Persistence

#### 审计结论

- `F112/Q038/US145` 已把排班计划页剩余的 draft feedback 上下文缺口补齐：搜索、状态切换和 `清空` 不再把本地 draft 失败/成功反馈立刻冲掉。
- 这让用户在仍停留当前计划列表页面时，可以继续筛选和检查列表，同时保留刚发生的 draft 结果提示。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前反馈保持仍建立在 query 参数和本地 helper 之上，不等同于服务端态或用户级持久化返回；若后续需要跨会话保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，51 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-15 - Schedule Plans Draft Feedback Dismiss Action

#### 审计结论

- `F113/Q039/US146` 已把排班计划页剩余的同页关闭动作缺口补齐：本地 draft failure 提示现在提供显式 `关闭` CTA，只清掉 `draft`，不会把当前 `query/status` 一起冲掉。
- 这让用户在看完本地草稿失败反馈后，可以继续留在同一筛选后的计划列表，而不是只能通过离开页面来消掉提示。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 dismiss 仍建立在 query 参数和本地 helper 之上，不等同于服务端态或用户级持久化返回；若后续需要跨会话保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖失败测试先验、源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，52 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-15 - Demand Plans Clear CTA Consistency

#### 审计结论

- `F114/Q040/US147` 已把需求计划页剩余的 clear CTA 一致性缺口补齐：`清空` 不再使用裸 `/demand-plans`，而是改成 helper-driven 同页 clear。
- 这让需求计划页与排班计划页、风险页等本地列表页面在 CTA 语义上保持一致，避免同一条本地 review 链里出现一处特例。
- 本轮仍然只停留在本地前端和本地 seed 契约层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 当前 clear 行为仍建立在 query 参数和本地 helper 之上，不等同于服务端态或用户级持久化返回；若后续需要跨会话保持，需要单独过 Gate。
- 本轮没有追加浏览器交互自动化；当前验收依赖源码断言、strict state 和全量 `check.sh`。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，52 个测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check-state.sh --strict --diff=staged`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 19 个后端 unittest。

## 2026-05-15 - Local P1 E2E And Table Parity Reinforcement

#### 审计结论

- `F115/Q041/US148-US149` 已补浏览器级本地 smoke：从筛选后的排班计划列表进入 draft 计划详情和编辑页，并验证取消/返回仍保留当前 list context。
- 排班计划表的状态筛选、缺口筛选和分页大小 Select trigger 已补可访问名称，E2E 能通过 role/name 识别这些 table parity 控制。
- 计划详情页从列表进入时的返回入口现在显示为“返回列表”并保留当前 `query/status`，不再被误判为“返回计划详情”。
- 本轮仍然只停留在本地前端、E2E 和追溯证据层，没有引入数据库、依赖、后端契约、审批、导出、批量、权限或生产公式。

#### 风险

- 该 E2E 仍依赖本地 demo server 和本机 Chrome；远程测试环境、跨浏览器矩阵和视觉回归尚未纳入本批。
- draft 保存提交的成功/失败路径仍由既有本地 API/源码断言覆盖，本批 E2E 只覆盖 route/context，不扩大为生产草稿工作流。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，3 条 E2E 通过。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，52 个模型/源码断言测试通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、25 个 state-check 回归测试、7 个 commit-message 回归测试、frontend lint、typecheck、Next build 和 20 个后端 unittest。

## 2026-05-16 - Local Demo Import And Placeholder Cleanup

#### 审计结论

- `B008/F116/Q042/US150-US152` 已提供本机演示数据导入口：坐席主数据、坐席状态数据、登录数据支持 CSV 文本或文件输入，返回导入批次、成功/失败行数和错误明细。
- 侧边栏 `文件导入`、`接入批次`、`数据源管理` 已指向 `/demo-imports`，dashboard 数据接入状态能读取本机导入批次，异常明细行操作从纯图标占位改成本机复核动作。
- 本轮仍然只停留在 localhost 本机演示和进程内存状态层，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、生产公式、结算规则或收费因子。

#### 风险

- 导入数据是本机运行态进程内存，不是跨重启持久化；这符合当前本机演示边界，但不等同于生产数据接入。
- 当前 imported data 主要驱动导入批次状态和演示 traceability；dashboard 顶部筛选和 KPI 公式仍是下一批本地 demo preview 范围，不应被视为生产计算。

#### 验证

- `python3 -m unittest backend.tests.test_schedule_plans`：通过，22 个后端 unittest 通过。
- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，4 条 E2E 通过。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，52 个模型/源码断言测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check 回归、commit-message 回归、frontend lint、typecheck、Next build 和 22 个后端 unittest。

## 2026-05-16 - Local Dashboard KPI Filters

#### 审计结论

- `F117/Q043/US153-US154` 已把 dashboard 顶部筛选从静态按钮推进为本机可提交控件：日期、职场/团队、供应商和数据版本通过 URL/query 保留演示上下文。
- dashboard 新增 `本机 KPI Preview`，基于本机导入批次汇总导入覆盖行数、接入数据源数、最新批次和需关注批次数，用于演示数据覆盖，不作为生产 KPI 公式。
- 本轮仍然只停留在 localhost 本机演示和已有导入批次摘要层，没有引入数据库、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、生产公式、结算规则或收费因子。

#### 风险

- KPI preview 使用导入批次摘要，不等同于人员级排班实现率、结算或生产履约公式；后续如需生产计算必须单独过 Gate。
- 当前筛选只保留演示上下文和 URL 状态，不驱动真实跨系统查询或数据库筛选。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，4 条 E2E 通过。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，53 个模型/源码断言测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `git diff --check`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check 回归、commit-message 回归、frontend lint、typecheck、Next build 和 22 个后端 unittest。

## 2026-05-16 - Navigation Development Badges

#### 审计结论

- `F118/Q044/US155-US157` 已修正导航可信度：未开放功能统一显示 `开发中`，并从可点击 Link 改为禁用展示态，不再误跳 `/dashboard`。
- 已开放入口继续保持可导航，包括 dashboard、需求计划、排班计划、风险提示、班次明细、不可用管理和本机导入。
- 产品补全顺序已固化为围绕现有模块推进：本机导入数据先被处理并存入本地运行态，再由 dashboard、排班、班次、风险、不可用和后续履约页读取展示结果；不再新增独立演示中心。
- 本轮没有引入数据库、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、结算规则或收费因子。

#### 风险

- `开发中` 只是导航诚实性处理，不等同于这些模块已经实现；后续仍需逐批开发履约监控、结算复盘和系统管理等页面。
- 当前补全顺序仍保持 no-database local MVP 边界；如果后续需要生产持久化、真实集成或权限体系，必须单独过 Gate。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，53 个模型/源码断言测试通过。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。

## 2026-05-16 - Imported Records Existing Module Read

#### 审计结论

- `B009/Q045/US158-US160` 已把本机导入成功行从 batch summary 推进到 processed records：后端新增 `/api/v1/demo-imports/records`，返回每类导入数据的总行数、最近批次、更新时间和样本行。
- dashboard 与 shift-details 现在读取同一个 processed records 结果，并展示 `本机导入 records` / `班次核对 records` 摘要，证明导入结果进入现有模块页，而不是停留在独立导入页。
- 本轮仍然只使用 localhost 本机运行态和进程内存，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、结算规则或收费因子。

#### 风险

- processed records 是本机运行态结果，服务重启后会清空；这符合当前本机演示边界，不等同于生产数据存储。
- 当前只接入 dashboard 与 shift-details 两个现有模块；风险、不可用和后续履约监控页仍需后续批次继续消费 records。

#### 验证

- `python3 -m unittest backend.tests.test_schedule_plans`：通过，23 个后端 unittest 通过。
- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，54 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。

## 2026-05-16 - Risk And Unavailability Imported Records

#### 审计结论

- `F119/Q046/US161-US163` 已继续把本机导入 processed records 推进到现有模块：schedule-risks 展示 `风险复核 records`，unavailability 展示 `不可用核对 records`。
- 两个页面复用既有 `/api/v1/demo-imports/records` 读取结果，没有新增后端契约，没有修改 backend，也没有新增独立演示中心。
- 本轮仍然只使用 localhost 本机运行态和进程内存，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、结算规则或收费因子。

#### 风险

- records 摘要证明导入结果进入现有模块，但尚未把导入坐席/状态/登录数据纳入生产级风险计算或不可用规则；生产公式必须单独过 Gate。
- processed records 仍是本机运行态结果，服务重启后会清空；这符合当前本机演示边界。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖导入后 dashboard、shift-details、schedule-risks 和 unavailability records 摘要。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，54 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。

## 2026-05-16 - Fulfillment Monitoring Imported Records

#### 审计结论

- `F120/Q047/US164-US166` 已开放第一个履约监控最小切片：`履约监控 > 工时核验` 链接到 `/fulfillment-monitoring`，不再是占位。
- 新页面读取既有 processed records，并展示 `履约核验 records`、状态数据、登录数据、最近批次和样本行，证明状态/登录导入结果进入现有履约模块。
- 其他未实现履约入口仍显示 `开发中` 且不可点击，避免把未完成能力伪装为已开放。
- 本轮没有新增后端契约，没有修改 backend，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、结算规则或收费因子。

#### 风险

- 当前只是本机履约核验覆盖展示，不等同于生产遵守率、异常处罚、薪资结算或供应商考核。
- 状态/登录 records 仍来自本机进程内存，服务重启后清空；这符合当前本机演示边界。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖导入状态/登录数据后履约监控 records 摘要。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，55 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。

## 2026-05-16 - Agent Status Trace Imported Records

#### 审计结论

- `F121/Q048/US167-US169` 已开放第二个履约监控最小切片：`履约监控 > 坐席状态轨迹` 链接到 `/agent-status-trace`，不再是占位。
- 新页面读取既有 processed records 中的 `status_log`，并展示 `状态轨迹 records`、状态数据行数、状态类型、状态分布和样本轨迹，证明状态导入结果进入现有履约模块。
- 异常管理、实时遵守率和异常复核仍显示 `开发中` 且不可点击，避免把未完成能力伪装为已开放。
- 本轮没有新增后端契约，没有修改 backend，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、结算规则或收费因子。

#### 风险

- 当前只是本机状态轨迹覆盖展示，不等同于实时状态流、生产遵守率、异常处罚、薪资结算或供应商考核。
- status_log records 仍来自本机进程内存，服务重启后清空；这符合当前本机演示边界。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖导入状态数据后坐席状态轨迹 records 摘要。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，56 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- in-app browser 可视化检查：`http://localhost:3015/agent-status-trace` 打开成功，页面标题和 `状态轨迹 records` 可见。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check 回归、commit-message 回归、frontend lint、typecheck、Next build 和 23 个后端 unittest。

## 2026-05-16 - Fulfillment Exceptions Imported Records

#### 审计结论

- `F122/Q049/US170-US172` 已开放第三个履约监控最小切片：`履约监控 > 异常管理` 链接到 `/fulfillment-exceptions`，不再是占位。
- 新页面读取既有 processed records 中的 `status_log` 和 `login_log`，并展示 `异常线索 records`、状态数据、登录数据、线索状态和本机异常线索样本，证明状态/登录导入结果进入异常管理模块。
- 实时遵守率和异常复核仍显示 `开发中` 且不可点击，避免把未完成能力伪装为已开放。
- 本轮没有新增后端契约，没有修改 backend，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、生产异常判定、处罚规则、结算规则或收费因子。

#### 风险

- 当前只是本机异常线索覆盖展示，不等同于实时异常流、生产异常判定、遵守率、处罚、薪资结算或供应商考核。
- status_log/login_log records 仍来自本机进程内存，服务重启后清空；这符合当前本机演示边界。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖导入状态/登录数据后异常管理 records 摘要。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，57 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- in-app browser 可视化检查：`http://localhost:3015/fulfillment-exceptions` 打开成功，页面标题和 `异常线索 records` 可见。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check 回归、commit-message 回归、frontend lint、typecheck、Next build 和 23 个后端 unittest。

## 2026-05-16 - Exception Review Imported Records

#### 审计结论

- `F123/Q050/US173-US175` 已开放第四个履约监控最小切片：`履约监控 > 异常复核` 链接到 `/exception-review`，不再是占位。
- 新页面读取既有 processed records 中的 `status_log` 和 `login_log`，并展示 `复核队列 records`、状态数据、登录数据和只读复核队列，证明状态/登录导入结果进入异常复核模块。
- 实时遵守率仍显示 `开发中` 且不可点击，避免把生产公式类能力伪装为已开放。
- 本轮没有新增后端契约，没有修改 backend，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、复核审批动作、状态写回、生产异常判定、处罚规则、结算规则或收费因子。

#### 风险

- 当前只是本机只读复核队列，不等同于审批流、状态流转、生产异常判定、实时遵守率、处罚、薪资结算或供应商考核。
- status_log/login_log records 仍来自本机进程内存，服务重启后清空；这符合当前本机演示边界。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖导入状态/登录数据后异常复核 records 摘要。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，58 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- in-app browser 可视化检查：`http://localhost:3015/exception-review` 打开成功，页面标题和 `复核队列 records` 可见。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check 回归、commit-message 回归、frontend lint、typecheck、Next build 和 23 个后端 unittest。

## 2026-05-16 - Adherence Monitoring Imported Records

#### 审计结论

- `F124/Q051/US176-US178` 已开放第五个履约监控最小切片：`履约监控 > 实时遵守率` 链接到 `/adherence-monitoring`，不再是占位。
- 新页面读取既有 processed records 中的 `status_log` 和 `login_log`，并展示 `遵守率预览 records`、状态数据、登录数据、本机预览状态和样本，证明状态/登录导入结果进入实时遵守率入口。
- 页面文案明确当前是本机 records 预览，不计算生产遵守率，不接实时流。
- 本轮没有新增后端契约，没有修改 backend，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产遵守率公式、状态码固化、状态写回、结算规则或收费因子。

#### 风险

- 当前只是本机 records 覆盖预览，不等同于生产级实时遵守率、状态流、状态码体系、异常处罚、薪资结算或供应商考核。
- status_log/login_log records 仍来自本机进程内存，服务重启后清空；这符合当前本机演示边界。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖导入状态/登录数据后实时遵守率 records 摘要。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，59 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- in-app browser 检查：`http://localhost:3015/adherence-monitoring` 打开成功，页面标题、`遵守率预览 records`、`本机遵守率预览样本` 和本机边界文案可见；截图接口超时，未生成截图。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check 回归、commit-message 回归、frontend lint、typecheck、Next build 和 23 个后端 unittest。

## 2026-05-16 - Data Quality Imported Records

#### 审计结论

- `F125/Q052/US179-US181` 已开放第一个数据与集成治理切片：`数据与集成 > 数据质量` 链接到 `/data-quality`，不再是占位。
- 新页面读取既有 processed records 中的 `staff_master`、`status_log` 和 `login_log`，并展示 `数据质量 records`、三类数据行数、样本覆盖、最近批次和本机质量预览状态，证明导入结果进入数据质量入口。
- 页面文案明确当前是本机 records 质量预览，不执行生产数据质量规则、真实接口检查或跨系统对账。
- 本轮没有新增后端契约，没有修改 backend，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产数据质量规则、自动修复、字段映射写回、跨系统对账、结算规则或收费因子。

#### 风险

- 当前只是本机 records 覆盖和样本预览，不等同于生产级数据质量规则、真实接口检查、字段映射治理、自动修复或跨系统对账。
- processed records 仍来自本机进程内存，服务重启后清空；这符合当前本机演示边界。

#### 验证

- `BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖导入三类 CSV 后数据质量 records 摘要。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，60 个模型/源码断言测试通过。
- `npm run typecheck`：通过。
- in-app browser 检查：`http://localhost:3015/data-quality` 打开成功，页面标题、`数据质量 records`、`本机质量预览明细` 和 no-database/no-production-quality-rule 边界文案可见。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check 回归、commit-message 回归、frontend lint、typecheck、Next build 和 23 个后端 unittest。

## 2026-05-16 - Ops And System Preview Pages

#### 审计结论

- `F129/Q056/US191-US196` 已开放五个本机只读预览入口：`今日履约`、`异常预警`、`时段缺口热力图`、`供应商管理` 和 `规则配置` 不再是 dashboard 占位跳转。
- 新页面分别读取既有 processed records 或 dashboard seed：今日履约读取 staff/status/login，异常预警读取本机异常 seed 和导入覆盖，时段缺口热力图复用 heatmap seed，供应商管理读取 staff_master vendor 分布，规则配置展示本机规则目录。
- 侧边栏对应条目已变为真实链接；智能排班、接口集成、权限管理、操作审计和结算复盘仍保持未开放/开发中边界。
- 本轮没有新增后端契约，没有修改 backend，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量操作、自动排班、生产公式、规则发布、供应商写回、结算规则或收费因子。

#### 风险

- 当前仍是本机演示预览，不等同于生产今日履约计算、生产异常规则、真实排班缺口公式、供应商主数据维护或规则发布能力。
- processed records 仍来自本机进程内存，服务重启后清空；这符合当前本机演示边界。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，67 个模型/源码断言测试通过，包含新增预览 helper 的 RED/GREEN 证据。
- `npm run typecheck`：通过。
- `BPO_API_BASE_URL=http://127.0.0.1:8000 BPO_WEB_URL=http://localhost:3015 bash scripts/smoke-demo.sh`：通过，backend health 与 frontend reachable。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖五个新页面和 sidebar 链接。
- in-app browser 检查：`http://localhost:3015/rule-configuration` 打开成功，页面标题、`规则配置 records`、`本机规则目录` 和 `导入 records 只读展示` 可见。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check tests、commit-message tests、frontend lint、typecheck、Next build 和 23 个后端 unittest。

## 2026-05-17 - Schedule Plan Import Records Preview

#### 审计结论

- `F130/Q057/US197-US198` 已把排班数据纳入本机导入链路：localhost demo import 支持 `schedule_plan` CSV，`/demo-imports` 新增 `排班数据` 导入入口。
- `/schedule-plans` 读取 processed records 中的 `schedule_plan`，展示 `排班数据 records`、计划样本、时段行、最近批次和样本时段，演示基于现有排班模块完成，不再另建演示中心。
- 本轮没有把导入结果写入生产排班列表，没有新增数据库、ORM、migration、schema、真实 WFM/CORN/HR 集成、新依赖、package/lockfile、认证、权限、审批、导出、批量、自动排班、生产公式、结算规则或收费因子。

#### 风险

- 当前 schedule_plan rows 仍来自本机 process-memory；服务重启会清空，符合本机演示边界。
- 页面只展示导入 records 摘要，不等同于生产排班生效、自动排班、审批发布或排班公式固化。

#### 验证

- `python3 -m unittest backend.tests.test_schedule_plans -v`：通过，24 条后端 unittest 通过，包含 schedule_plan CSV 导入和 processed records 断言。
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，68 个模型/源码断言测试通过。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖排班数据入口、schedule_plan 导入和排班计划页 records 摘要。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 bash scripts/smoke-demo.sh`：通过，backend health 与 frontend reachable。
- in-app browser 检查：`http://localhost:3015/schedule-plans` 打开成功，`排班数据 records`、计划样本、时段行和样本计划可见。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check tests、commit-message tests、frontend lint、typecheck、Next build 和 24 个后端 unittest。

## 2026-05-17 - Monthly Settlement Local Preview

#### 审计结论

- `F131/Q058/US199-US200` 已开放 `结算复盘 > 月度结算`：侧边栏链接到 `/monthly-settlement`，不再是占位。
- 新页面读取本机 processed records，展示 `结算复盘 records`、导入来源数、主数据/履约/排班复盘信号、最近批次、排班样本、状态样本和登录样本。
- 报表中心、供应商复盘、结算锁账仍保持 `开发中` 且不可点击。
- 本轮没有修改 backend，没有新增后端契约，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量、自动排班、生产结算公式、收费因子、锁账、账单金额或供应商考核写回。

#### 风险

- 当前月度结算只是本机只读复盘入口，不等同于生产结算金额、账单生成、锁账或供应商结算能力。
- processed records 仍来自本机 process-memory；服务重启后清空，符合当前本机演示边界。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，69 个模型/源码断言测试通过，包含月度结算复盘 helper 的 RED/GREEN 证据。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖 monthly-settlement records 摘要、月度结算导航链接和其他结算复盘开发中边界。
- `BPO_WEB_URL=http://localhost:3015/dashboard BPO_API_BASE_URL=http://127.0.0.1:8000 bash scripts/smoke-demo.sh`：通过，backend health 与 dashboard reachable。
- `curl -fsS http://localhost:3015/monthly-settlement`：通过，新增页面可返回 HTML。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check tests、commit-message tests、frontend lint、typecheck、Next build 和 24 个后端 unittest。

## 2026-05-17 - Report Center And Supplier Review Local Preview

#### 审计结论

- `F132/F133/Q059/US201-US203` 已开放 `结算复盘 > 报表中心` 和 `结算复盘 > 供应商复盘`：侧边栏链接分别指向 `/report-center` 和 `/supplier-review`，不再是 dashboard 占位。
- `/report-center` 读取本机 processed records，展示 `报表中心 records`、导入来源、报表分区、模块成果和最近批次。
- `/supplier-review` 读取本机 processed records，展示 `供应商复盘 records`、供应商覆盖、履约覆盖、排班覆盖和供应商主数据样本。
- `结算锁账` 仍保持 `开发中` 且不可点击。
- 本轮没有修改 backend，没有新增后端契约，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量、自动排班、生产结算公式、收费因子、锁账、账单金额或供应商考核写回。

#### 风险

- 当前报表中心和供应商复盘只是本机只读预览入口，不等同于生产报表生成、导出、供应商考核写回、结算金额或锁账能力。
- processed records 仍来自本机 process-memory；服务重启后清空，符合当前本机演示边界。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，71 个模型/源码断言测试通过，包含报表中心和供应商复盘 helper 的 RED/GREEN 证据。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖 report-center/supplier-review records 摘要、两项导航链接和 `结算锁账` 开发中边界。
- `BPO_WEB_URL=http://localhost:3015/dashboard BPO_API_BASE_URL=http://127.0.0.1:8000 bash scripts/smoke-demo.sh`：通过，backend health 与 dashboard reachable。
- `curl -fsS http://localhost:3015/report-center`：通过，新增页面可返回 HTML。
- `curl -fsS http://localhost:3015/supplier-review`：通过，新增页面可返回 HTML。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check tests、commit-message tests、frontend lint、typecheck、Next build 和 24 个后端 unittest。

## 2026-05-17 - Smart Scheduling And Interface Integration Local Preview

#### 审计结论

- `F134/F135/Q060/US204-US206` 已开放 `计划与排班 > 智能排班` 和 `数据与集成 > 接口集成`：侧边栏链接分别指向 `/smart-scheduling` 和 `/interface-integration`，不再是 dashboard 占位。
- `/smart-scheduling` 读取本机 processed records，展示 `智能排班 records`、建议信号、计划覆盖、排班计划样本和最近批次。
- `/interface-integration` 读取本机 processed records，展示 `接口集成 records`、字段 readiness、状态日志、来源覆盖和状态样本。
- `结算锁账`、`权限管理`、`操作审计` 仍保持 `开发中` 且不可点击。
- 本轮没有修改 backend，没有新增后端契约，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量、自动排班、排班发布、人员级调班、生产写回、生产公式、结算规则、收费因子、锁账或真实接口凭证。

#### 风险

- 当前智能排班只是本机只读建议 readiness，不等同于自动排班、发布、生产写回或人员级调班能力。
- 当前接口集成只是本机 readiness 预览，不等同于真实 API 调用、接口凭证管理、外部系统写回或生产同步能力。
- processed records 仍来自本机 process-memory；服务重启后清空，符合当前本机演示边界。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，73 个模型/源码断言测试通过，包含智能排班和接口集成 helper 的 RED/GREEN 证据。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS http://127.0.0.1:8000/health`：通过。
- `curl -fsS http://localhost:3015/smart-scheduling`：通过，新增页面可返回 HTML。
- `curl -fsS http://localhost:3015/interface-integration`：通过，新增页面可返回 HTML。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖 smart-scheduling/interface-integration records 摘要、两项导航链接和高风险入口开发中边界。
- `BPO_WEB_URL=http://localhost:3015/dashboard BPO_API_BASE_URL=http://127.0.0.1:8000 bash scripts/smoke-demo.sh`：通过，backend health 与 dashboard reachable。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check tests、commit-message tests、frontend lint、typecheck、Next build 和 24 个后端 unittest。

## 2026-05-17 - Operation Audit Local Preview

#### 审计结论

- `F136/Q061/US207-US208` 已开放 `系统管理 > 操作审计`：侧边栏链接指向 `/operation-audit`，不再是 dashboard 占位。
- `/operation-audit` 读取本机 processed records，展示 `操作审计 records`、导入批次、模块证据、审计样本和最近批次。
- `权限管理` 和 `结算锁账` 仍保持 `开发中` 且不可点击。
- 本轮没有修改 backend，没有新增后端契约，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、账号登录、认证、权限、角色管理、审批、导出、批量、生产审计日志、不可篡改审计存储、生产公式、结算规则、收费因子或锁账。

#### 风险

- 当前操作审计只是本机只读证据预览，不等同于生产审计日志、权限审计、不可篡改审计存储或合规审计链路。
- processed records 仍来自本机 process-memory；服务重启后清空，符合当前本机演示边界。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，74 个模型/源码断言测试通过，包含操作审计 helper 的 RED/GREEN 证据。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS http://127.0.0.1:8000/health`：通过。
- `curl -fsS http://localhost:3015/operation-audit`：通过，新增页面可返回 HTML。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖 operation-audit records 摘要、操作审计导航链接和高风险入口开发中边界。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check tests、commit-message tests、frontend lint、typecheck、Next build 和 24 个后端 unittest。

## 2026-05-17 - Draft Review Readiness Summary

#### 审计结论

- `F137/Q062/US209-US210` 已在 `/schedule-plans/[planId]` 增加 `复核准备` 本机只读摘要。
- 详情页基于当前计划缺口时段、关联高风险和同日同职场生效不可用，给出本机下一步复核建议。
- 页面明确不提交审批、不发布排班、不做自动排班或生产写回。
- 本轮没有修改 backend，没有新增后端契约，没有引入数据库、ORM、migration、schema、真实外部集成、新依赖、package/lockfile、认证、权限、审批、导出、批量、排班发布、自动排班、生产写回、生产公式、结算规则、收费因子或锁账。

#### 风险

- 当前复核准备只是草稿详情的本机只读 readiness，不等同于审批流、发布流、自动排班、生产写回或正式复核工作流。
- 缺口、风险和不可用证据仍来自本机 demo/processed 数据与现有本地接口；符合当前本机演示边界。

#### 验证

- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`：通过，75 个模型/源码断言测试通过，包含 draft review readiness helper 的 RED/GREEN 证据。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `curl -fsS http://127.0.0.1:8000/health`：通过。
- `curl -fsS http://localhost:3015/schedule-plans/plan-20260511-suzhou-bosch-v1?from=schedule-plans&query=%E8%8B%8F%E5%B7%9E&status=draft`：通过，详情页返回 `复核准备` 内容。
- `BPO_WEB_URL=http://localhost:3015 BPO_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`：通过，5 条 E2E 通过，覆盖 draft 详情页 readiness 和生产动作边界。
- `git diff --check`：通过。
- `bash scripts/check-state.sh --strict --diff=working`：通过。
- `bash scripts/check.sh`：通过，包含 strict state、state-check tests、commit-message tests、frontend lint、typecheck、Next build 和 24 个后端 unittest。

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
