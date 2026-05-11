# Audit Report

本文件记录 Harness 闭环审计结果、风险、阻塞和建议。

## Current Audit

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

- 当前项目目录不再是纯 clean Harness 形态；工作区存在未跟踪的 `app/`、`components/`、`hooks/`、`lib/`、`public/`、`package.json`、`tsconfig.json`、`next.config.mjs`、`eslint.config.mjs`、`postcss.config.mjs`、`components.json` 等前端工程文件。
- 上述未跟踪工程文件与 `docs/PROJECT_STATE.md` 中“无 active business code / frontend pages / package dependencies”的描述不一致。
- `app/dashboard/data.ts` 已包含 BPO、CORN、排班、异常工时、同步状态等业务 mock 数据。
- `package.json` 已声明 Next / React / Tailwind / shadcn 相关依赖，并包含 `recharts`，这与“图表库不默认使用 Recharts”的当前规则冲突。
- `bash scripts/check.sh` 当前会失败，直接原因是根目录存在 `package.json`。
- `docs/prompts/` 中原先的 `user_story`、`dag_scheduler`、`code_generation`、`ui_design`、`testing` 是占位式 Skill 名称，不是当前 Codex 环境中可直接引用的 Skill。

#### 已处理

- 已将 Subagent prompt 模板中的占位式 Skill 名称替换为当前可用的 Codex skill 名称。
- 已在 `docs/harness/lightweight-harness.md` 增加 Current Skill Mapping，避免后续继续引用不存在的 Skill。

#### 风险

- 如果这些未跟踪前端工程文件是 PM 有意保留的工作成果，当前 clean Harness 规则需要重新定级，并补齐前端工程初始化 Gate。
- 如果这些文件不是当前阶段要保留的成果，应另起清理 Gate，决定删除、归档或正式纳入工程初始化任务。
- 若决定保留当前前端工程，必须单独处理 `recharts` 是否继续存在的问题。

#### 建议

- 不要在当前任务中直接删除这些未跟踪文件。
- 下一步建议开一个单独 Gate：`H004 当前工作区 clean Harness 偏差处置`，在 PM 确认后选择“清理回纯 Harness”或“承认工程初始化已开始并重写项目状态”。

### 2026-05-11 - Lightweight Harness 文档型升级

#### 审计结论

- 原始需求、用户故事、DAG、提示词、任务日志、决策日志和审计报告已建立文档入口。
- 当前升级保持在 clean Harness 允许范围内。
- 未授权创建真实前端、后端、依赖、API、数据库或业务 mock 数据。

#### 风险

- 当前工作区存在未跟踪工程文件，可能导致 `bash scripts/check.sh` 在真实工作区失败。
- 后续若直接引入前端/后端工程，必须先通过工程初始化 Gate。

#### 建议

- 下一次新增业务模块需求时，先登记到 `docs/raw-requirements.md`。
- 再拆分到 `docs/user-stories.md`，并检查依赖、优先级和阻塞项。
- 涉及结算、权限、导出、批量操作、真实数据来源时，必须先 PM 确认。
