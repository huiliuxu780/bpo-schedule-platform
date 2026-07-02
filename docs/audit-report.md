# Audit Report - Compact Current Stub

本文件不再保存历史审计全文。历史审计记录在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧记录时使用 Git history。

## Current Audit

### 2026-07-02 - IM293 月班表 Draft/Published 持久化产品契约

#### 审计结论

- 新增 `docs/design/roster-draft-publish-persistence-contract.md`，定义月班表草稿、排定发布、未来生效、撤回、修订和下游可见的产品契约。
- 契约明确一个 `RosterVersion` 只属于一个 `project + workplace + team + rosterMonth`，并约束同范围同月份只能有一个 active draft、一个 scheduled_published 和一个 current published。
- 契约明确状态机：`draft`、`scheduled_published`、`published`、`superseded`、`voided`、`activation_failed`。
- 契约明确 `effectiveAt` 精确到分钟、不能早于当前时间、默认目标月 1 日 00:00、按职场时区解释，且不得晚于目标月结束。
- 契约明确 scheduled_published 到点自动生效、失败进入 activation_failed、保留旧 current、排班师可重试或撤回。
- 契约明确领域对象字段草案：`RosterVersion`、`RosterCell`、`RosterVersionEvent`、`RosterCellChangeLog`、`PublishedRosterSnapshot`。
- 契约明确硬错误、软风险、发布前差异摘要、编辑锁、作废草稿、版本 lineage 和格子 `sourceCellId`。
- 本轮只做文档和 Harness 追踪；不新增 DB 表、ORM、migration、API、前端发布动作、权限、审批、通知、导出、批量、Excel 导入、预测模型、标准人力、自动排班、生产公式、结算或收费因子。

#### 验证

- `git diff --cached --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- final: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过；Node 测试 867 pass / 1 skip，Python 测试 249 tests OK，shadcn/ui convention check、lint、typecheck、build 和 project Harness check 通过。

### 2026-07-02 - IM292 月班表缺口处理闭环 v1

#### 审计结论

- `/roster-drafts` 在 IM291 缺口工作台基础上增加手动缺口处理闭环。
- 缺口行展示同日期、同半小时 slot 的相关覆盖格子，包含员工、小组、班种、覆盖时段和已调整标记。
- 点击相关覆盖格子后切回右侧抽屉的格子详情页，并定位到周视图对应员工/日期，复用既有班种选择器。
- Arranged 为 0 的缺口展示“当前无覆盖人员”空态，只提供“定位当天”，不展示候选推荐。
- 缺口相关格子来自 edited effective cells，调整 copied 草稿格子后继续驱动缺口重算。
- 本轮不新增自动推荐、自动排班、处理状态、真实发布持久化、API、数据库、Excel 上传/导入、审批、权限、导出、批量、生产公式、结算或收费因子。

#### 验证

- red: `node scripts/tests/roster-draft-workbench-structure.test.mjs` 先失败在缺少 `type RosterGapRelatedCell`。
- focused: `node --experimental-strip-types scripts/tests/roster-draft-generation-model.test.mjs && node scripts/tests/roster-draft-workbench-structure.test.mjs` 通过，19 个测试。
- `npm run lint`: 通过。
- `npx shadcn@latest info --json`: 确认项目为 Next.js、Tailwind v4、`radix-nova`，已安装 `button`、`tabs`、`drawer`、`badge`。
- shadcn review scan: `rg -n "(bg|text|border)-(red|blue|green|yellow|orange|purple|slate|gray|zinc|neutral|stone|emerald|rose|amber)-|space-y-|space-x-" components/roster-draft-workbench.tsx app/roster-drafts/page.tsx` 无命中。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`: 通过。
- `npm run typecheck`: build 前因旧 `.next/types` 缺失文件失败；build 重新生成 `.next/types` 后复跑通过。
- 浏览器 smoke: 通过。`http://localhost:3003/roster-drafts?month=2026-08` 中缺口抽屉展示相关覆盖格子和无覆盖空态；点击相关覆盖格子后切回 `Alice Chen / 2026-08-03` 周视图格子详情，班种选择器可见。
- final: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过；Node 测试 867 pass / 1 skip，Python 测试 249 tests OK，shadcn/ui convention check、lint、typecheck、build 和 project Harness check 通过。

### 2026-07-02 - IM291 月班表 Forecast vs Arranged/Actual 缺口工作台

#### 审计结论

- `/roster-drafts` 在 IM290 发布预览与覆盖派生基础上增加本地缺口工作台。
- `lib/roster-drafts.ts` 的 view model 暴露本地 Forecast interval 和 Actual interval 样例；`lib/roster-draft-fixtures.ts` 提供 2026-08 半小时需求/实际到岗样例。
- 前端 `buildRosterGapPreview` 从 edited effective cells 派生 Arranged，而不是只看原始生成结果。
- 右侧抽屉新增缺口队列页，按日期 + 半小时点展示 Forecast、Arranged、Actual、Forecast-Arranged 和 Arranged-Actual 差异。
- 缺口行保留 related employee ids，点击定位缺口可回到周视图对应员工/日期格子。
- 编辑生成格子的班种后，缺口队列即时重算；不新增真实预测模型、标准人力、API、数据库、Excel 上传/导入、审批、权限、自动排班、导出、批量、生产公式、结算或收费因子。

#### 验证

- red: `node --experimental-strip-types scripts/tests/roster-draft-generation-model.test.mjs && node scripts/tests/roster-draft-workbench-structure.test.mjs` 先失败在缺少 `forecastIntervals`。
- focused: `node --experimental-strip-types scripts/tests/roster-draft-generation-model.test.mjs && node scripts/tests/roster-draft-workbench-structure.test.mjs` 通过，18 个测试。
- `npm run typecheck`: 通过。
- `npm run lint`: 通过。
- shadcn review: `npx shadcn@latest info --json` 确认 `radix-nova`；硬编码色阶和 `space-*` 扫描无命中。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`: 通过。
- 浏览器 smoke: 通过。`http://localhost:3003/roster-drafts?month=2026-08` 中缺口指标、右侧抽屉缺口队列、Forecast/Arranged/Actual 行和定位缺口可见；点击第一条缺口定位到周视图 `EMP-001|2026-08-03`；将该格从 A5 调为 A10 后，09:00 缺口行从 Arranged 2 / F-A 2 重算为 Arranged 1 / F-A 3，14:30 缺口行从 Arranged 0 重算为 Arranged 1。
- final: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过；Node 测试 866 pass / 1 skip，Python 测试 249 tests OK，shadcn/ui convention check、lint、typecheck、build 和 project Harness check 通过。

### 2026-07-02 - IM290 月班表草稿发布预览与覆盖派生

#### 审计结论

- `/roster-drafts` 在 IM289 受控编辑层基础上增加本地草稿/发布预览状态表达。
- toolbar/statusbar 展示当前状态、班次数和半小时覆盖摘要。
- 右侧抽屉新增发布预览页，展示基于 effective cells 的班种分布和半小时覆盖高峰。
- 编辑格子会让状态回到草稿，重新生成发布预览前可继续修正。
- 派生结果基于本地已编辑草稿预览；不新增真实发布持久化、API、数据库、Excel 上传/导入、审批、权限、预测模型、标准人力、自动排班、导出、批量、生产公式、结算或收费因子。

#### 验证

- red: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` 先失败在缺少发布预览与覆盖派生结构。
- focused: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` 通过，11 个测试。
- `npm run typecheck`: 通过。
- `npm run lint`: 通过。
- shadcn review: `npx shadcn@latest info --json` 确认 `radix-nova`；硬编码色阶和 `space-*` 扫描无命中。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`: 通过。
- 浏览器 smoke: 通过。`http://localhost:3003/roster-drafts?month=2026-08` 中发布预览切换、抽屉发布预览页、班种分布、覆盖高峰、编辑后回到草稿和 A10 派生分布均可见。
- final: `git diff --check && bash scripts/check-state.sh --strict && BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过；Node 测试 864 pass / 1 skip，Python 测试 249 tests OK，shadcn/ui convention check、lint、typecheck、build 通过。

### 2026-07-02 - IM289 月班表草稿格子受控编辑能力

#### 审计结论

- `/roster-drafts` 在 IM288 全屏工作台基础上增加 copied 生成格子的本地受控编辑层。
- 右侧抽屉详情页新增格子调整面板，支持班种选择、调整备注和恢复生成值。
- 月视图和周视图格子使用本地 effective cell 显示调整后的班种，并展示 `改` / `已调整` 标记。
- toolbar/statusbar 展示已调整格子数量；恢复生成值后本地调整和计数清零。
- 异常、待确认和已过滤标注格子仍保持只读，不在本轮编辑。
- 保留 IM285/IM286/IM288 本地 fixture 和 TypeScript 生成器；不新增 draft 发布、API、数据库、Excel 上传/导入、审批、权限、预测模型、标准人力、自动排班、导出、批量、生产公式、结算或收费因子。

#### 验证

- red: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` 先失败在缺少 controlled local editing 结构。
- focused: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` 通过，10 个测试。
- `npm run typecheck`: 通过。
- `npm run lint`: 通过。
- shadcn review: `npx shadcn@latest info --json` 确认 `radix-nova`、Tailwind v4、input/drawer/select/tabs/button/badge 已安装；硬编码色阶和 `space-*` 扫描无命中。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`: 通过。
- 浏览器 smoke: 通过。`http://localhost:3003/roster-drafts?month=2026-08` 中 `EMP-001 / 2026-08-03` copied 格子打开受控编辑面板，班种从 A5 调整为 A10 后网格显示 `A10改` 且已调整计数为 1；点击恢复生成值后格子回到 A5 且计数清零；`EMP-001 / 2026-08-01` 异常格子仍显示只读边界且无班种选择器。
- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- final: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过；Node 测试 863 pass / 1 skip，Python 测试 249 tests OK，shadcn/ui convention check、lint、typecheck、build 通过。

### 2026-07-01 - IM288 月班表草稿全屏排班工作台体验

#### 审计结论

- `/roster-drafts` 外层改为 header 下方全屏工作区，移除解释性 `WorkbenchPageHeader` 和页面外层滚动。
- 工作台默认进入月视图，月/周切换保留在工作台内部。
- 顶部 toolbar 收敛为项目/职场、小组范围、目标月份、当前周、详情与队列、生成草稿。
- 月视图和周视图网格占据主画布，表头和员工列保留定位能力。
- 格子详情、异常、待排和已过滤标注统一进入右侧抽屉，不再常驻固定右侧面板。
- 保留 IM285/IM286 本地 fixture 和 TypeScript 生成器；不新增编辑、保存发布、API、数据库、Excel 上传/导入、审批、权限、预测模型、标准人力、自动排班、导出、批量、生产公式、结算或收费因子。

#### 验证

- focused: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` 通过，9 个测试。
- `npm run typecheck`: 通过。
- `npm run lint`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- shadcn review: `npx shadcn@latest info --json` 确认 `radix-nova`、Tailwind v4、drawer/select/tabs/button/badge 已安装；硬编码色阶和 `space-*` 扫描无命中。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`: 通过。
- 浏览器 smoke: 通过。`http://localhost:3003/roster-drafts?month=2026-08` 默认选中月视图，旧解释 header 和固定 `aside` 均不存在，workbench shell 为 1376x852，主画布高度 685；点击格子打开右侧 `详情与队列` 抽屉，队列在抽屉内可见，周视图切换仍可用。
- `git diff --check`: 通过。
- final: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` 通过；Node 测试 862 pass / 1 skip，Python 测试 249 tests OK，shadcn/ui convention check、lint、typecheck、build 通过。

### 2026-07-01 - IM287 全站导航瘦身与 icon rail 对齐

#### 审计结论

- 全站 AppShell 默认收起为 64px icon rail，展开后为 240px，header 高度为 48px。
- 收起态隐藏分组标题，所有可见导航入口保持 32px 命中区并在 rail 中居中对齐。
- 展开/收起通过点击固定切换，不做 hover 展开；站内页面切换保持用户手动状态，并用 localStorage/cookie/in-memory 兜底保存 UI 偏好。
- 保留现有 shadcn sidebar/header primitives、品牌入口、业务导航和本地用户主题菜单；PM 返修后移除全局导航里的“快速新建”和“待处理风险”快捷入口，避免收起态孤立 icon 噪声。
- PM 返修后收起态品牌区只保留一个品牌 icon，品牌文字完全隐藏；经营总览、排班计划、月班表草稿等可见导航入口使用不同 lucide icon，避免可见 icon 重复。
- 本轮不修改排班工作台业务内容，不新增页面、依赖、API、数据库、权限、审批、导出、批量、生产公式、结算或收费因子。

#### 验证

- `node --test scripts/tests/product-structure-global-shell.test.mjs scripts/tests/dashboard-shadcn-baseline-alignment.test.mjs`: 通过，12 个测试。
- `npm run typecheck`: 通过。
- `npm run lint`: 通过。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`: 通过。
- 浏览器 smoke: 通过。`http://localhost:3003/dashboard` 首次进入为 64px rail，首个按钮 32px 且 x=16；点击 header trigger 后展开为 240px；站内点击进入 `/roster-drafts` 后保持展开；再次收起后点击进入 `/schedule-plans` 保持 64px rail。
- PM 返修浏览器 smoke: 通过。`http://localhost:3003/dashboard` 收起态 CSS rail 变量为 64px，品牌文字 `display: none`，全局导航无 `/schedule-plans/new` 和 `/schedule-risks?status=open` 快捷入口，可见文字标签为空，可见 icon 13 个且无重复。

### 2026-07-01 - IM286 月班表草稿排班工作台重构

#### 审计结论

- 将 `/roster-drafts` 从报表式结果页重构为排班师工作台。
- 保留 IM285 本地 fixture 和 TypeScript 生成器，不改生成算法。
- 新版页面包含排班工作台 toolbar、月视图 / 月度扫盘、周视图 / 周度处理、员工 x 日期网格、只读格子详情、异常/待排/过滤标注统一处理队列。
- 队列项可定位到对应员工/日期格子，并更新右侧只读详情。
- 本轮不新增 API、数据库、Excel 上传/导入、保存发布、审批、权限、预测模型、标准人力、自动补班、外部集成、导出、批量、生产公式、结算或收费因子。

#### 验证

- `node --test scripts/tests/roster-draft-generation-model.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs`: 通过，12 个测试。
- `npm run typecheck`: 通过。
- `npm run lint`: 通过。
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build`: 通过，`/roster-drafts` 构建成功。
- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- 浏览器 smoke: 通过。`http://localhost:3003/roster-drafts?month=2026-08` 确认排班工作台、周度网格、月度扫盘、格子详情、处理队列和队列定位可见可用。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、857 Node tests、shadcn convention check、lint、typecheck、Next build、249 backend tests 和 project Harness check。

### 2026-07-01 - IM285 月班表草稿生成演示闭环

#### 审计结论

- 新增 `app/roster-drafts/page.tsx` 作为排班师月班表草稿演示入口。
- 新增 `components/roster-draft-workbench.tsx`，展示目标月份选择、生成入口、月视图、周视图、状态标记、待排人员、只读异常清单和已过滤非班务标注。
- 新增 `lib/roster-drafts.ts` 和 `lib/roster-draft-fixtures.ts`，用本地可配置数据和 TypeScript 生成服务实现上一周同星期稳定班种复制。
- 新增 `scripts/tests/roster-draft-generation-model.test.mjs` 和 `scripts/tests/roster-draft-workbench-structure.test.mjs`，覆盖生成策略、待排/异常/过滤标注、月/周视图结构和禁用能力文案。
- 本轮不新增 API、数据库、Excel 上传/导入、保存发布、审批、权限、预测模型、标准人力、自动补班、外部集成、导出、批量、生产公式、结算或收费因子。

#### 验证

- `node --test scripts/tests/roster-draft-generation-model.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs`: 通过，10 个测试。
- `npm run typecheck`: 通过。
- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、855 Node tests、shadcn convention check、lint、typecheck、Next build、249 backend tests 和 project Harness check。
- 浏览器 smoke: 通过。`http://localhost:3003/roster-drafts?month=2026-08` 确认页面导航、生成入口、月视图、周视图切换、待排人员、异常清单和已过滤标注可见。

### 2026-07-01 - IM284 人员级月班表草稿纯领域模型

#### 审计结论

- 新增 `backend/app/roster_drafts.py` 后端纯领域模型。
- 新增 `backend/tests/test_roster_drafts.py`，覆盖复杂日多记录、shift-only 覆盖、多 shift 不重叠、重叠校验错误、员工/项目/小组引用快照校验、非 draft 不可编辑、独立待排人员对象和 `unassigned` 不允许作为日维度班表行。
- 同一员工同一天允许多条记录，只有 `assignment_kind=shift` 参与覆盖。
- 第一版不压扁真实业务，但不引入 API、数据库、migration、Excel 上传/导入、UI、复制生成、预测模型、标准人力、自动排班、审批、权限、通知、导出、批量、生产公式、结算或收费因子。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_roster_drafts`: 通过，6 个测试。
- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、845 Node assertions、lint、typecheck、Next build、249 backend tests 和 project Harness check。

### 2026-07-01 - IM283 ShiftType 班种解析与半小时覆盖展开

#### 审计结论

- 新增 `backend/app/shift_types.py` 后端纯领域服务。
- 新增 `backend/tests/test_shift_types.py`，以真实代表班种 `Z1`、`A5`、`T1`、`T4`、`N`、`A12` 验证单段、半点、两段、跨天和备注不参与计算。
- 跨天班保持 `business_date` 为排班业务日，覆盖时间戳可延伸到次日。
- 无法解析班种进入异常清单，不阻断其他班种展开。
- 本轮不新增 API、数据库、migration、Excel 上传/导入、UI、预测模型、标准人力、自动排班、审批、权限、通知、导出、批量、生产公式、结算或收费因子。

#### 验证

- `.venv/bin/python -m unittest backend.tests.test_shift_types`: 通过。
- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、845 Node assertions、lint、typecheck、Next build、243 backend tests 和 project Harness check。

### 2026-07-01 - IM282 班种定义与月班表生成底座产品契约

#### 审计结论

- 新增 `docs/design/scheduler-shift-type-monthly-roster-generation-contract.md`。
- 契约明确第一版生成人员级日班种草稿，派生每天班种人数、半小时覆盖和 Forecast vs Arranged/Actual 人头差异。
- 契约明确班种定义第一版只计算工作时段覆盖；用餐/休息、哺乳假、特殊激励和适用说明只记录不计算。
- 契约明确复制上一月/上一周时只继承稳定班种，不继承一次性标注。
- 契约明确待排队列不提供推荐班种，状态流转为 `draft -> published`，并区分 Primary 计划班表与 Actual 实际班表。
- 本轮只做文档契约和轻量追踪更新，不修改业务代码、前端、后端、数据库、脚本逻辑、依赖、package/lockfile、外部集成、自动排班、审批、权限、通知、导出、批量、预测模型、标准人力、生产公式、结算或收费因子。

#### 验证

- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、845 Node assertions、lint、typecheck、Next build、241 backend tests 和 project Harness check。

### 2026-07-01 - IM281 主追踪链瘦身

#### 审计结论

- `tasks/backlog.yaml`、`docs/raw-requirements.md`、`docs/user-stories.md`、`docs/audit-report.md`、`docs/task-log.md`、`docs/dev/branch-log.md`、`docs/PROJECT_STATE.md` 和 `docs/registry/TRACE_INDEX.yaml` 从历史堆积文件压缩为 compact current stubs。
- 当前执行源仍然是 `docs/current/**`。
- 历史详情不再进入默认上下文，需要时通过 Git history 查询。
- 保留 `F001` 作为 `scripts/check.sh` 所需的历史例外锚点。
- 保留 `R949/US869/IM279` 作为当前真实班表和排班师月班表底层口径锚点。
- 本轮不修改业务代码、前端、后端、数据库、脚本逻辑、依赖、package/lockfile、外部集成、自动排班、审批、权限、导出、批量、生产公式、结算或收费因子。

#### 验证

- `git diff --check`: 通过。
- `bash scripts/check-state.sh --strict`: 通过。
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 通过，包含 strict state check、845 Node assertions、lint、typecheck、Next build、241 backend tests 和 project Harness check。

## History Policy

- Do not append full historical audit records here.
- Record only the current compact audit and last meaningful state-transition anchor.
- Use Git history for previous audit details.
