# Audit Report

本文件记录 Harness 闭环审计结果、风险、阻塞和建议。

## Current Audit

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
