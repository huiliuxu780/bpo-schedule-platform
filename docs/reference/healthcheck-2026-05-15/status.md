# Project Status

## 项目名称

`bpo-schedule-platform`

## 当前阶段判断

当前处于「测试环境准备期」。

项目已经超过纯前端原型：已有 Next.js 前端、FastAPI 本地 API、seed/process-memory 数据、本地排班计划纵切、风险/不可用/班次 review 链路和完整本地检查脚本。但还没有测试环境部署说明、部署配置、稳定 demo 启动脚本命名，也没有浏览器级 e2e 核心路径验证。

## 当前分支

- 当前分支：`codex/f073-review-checklist-h032`
- 远端状态：相对 `origin/codex/f073-review-checklist-h032` ahead 4
- 工作区状态：检查时无未提交改动
- 最近本地提交：
  - `b95466a F114: align demand plan clear cta`
  - `427ba5d F114: seed demand plan clear cta batch`
  - `5ddbbe4 F113: add schedule plan draft dismiss`
  - `72be5dd F113: seed schedule plan draft dismiss batch`

## 最近完成的功能

- 排班计划 draft feedback 同页关闭动作：`关闭` 只移除 `draft`，保留 `query/status`。
- 需求计划页 `清空` CTA 改为 helper-driven route。
- 风险、不可用、班次、计划之间的本地 review drilldown 和返回上下文已连续收口。
- 右侧 review rail 已抽成共享组件并用于核心 review 页面。

## 当前已有页面

- `/`
- `/dashboard`
- `/demand-plans`
- `/schedule-plans`
- `/schedule-plans/new`
- `/schedule-plans/[planId]`
- `/schedule-plans/[planId]/edit`
- `/schedule-risks`
- `/schedule-risks/[riskId]`
- `/shift-details`
- `/unavailability`
- `/unavailability/[unavailabilityId]`

## 当前已有核心能力

- BPO WFM dashboard scaffold。
- 本地排班计划列表、筛选、详情、0.5h 时段明细。
- 本地 draft 创建和 draft 更新。
- 本地需求计划、班次明细、风险提示、不可用影响查看。
- 风险/计划/班次/不可用之间的 scoped review navigation。
- 本地 FastAPI API，使用 seed/process-memory 数据。
- Harness current-state queue、active task contract、trace index、strict state check、Git hooks。

## 当前可运行命令

- `npm run dev`
- `bash scripts/dev.sh`
- `bash scripts/check.sh`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`
- `/Users/mac/.local/bin/python3 -m unittest discover -s backend/tests -v`
- `/Users/mac/.local/bin/python3 -m uvicorn backend.app.main:app --reload`

## 当前不可运行或不确定的部分

- `scripts/start-demo.sh` 不存在。
- 测试环境部署说明未发现。
- Docker/Vercel/Render/Railway/Fly 等部署配置未发现。
- 浏览器级 e2e 或 Playwright 核心路径验证未发现。
- 后端 uvicorn 在本沙箱内端口绑定被拒绝；提权审批连续超时，所以本轮只能确认 app 可导入、后端 unittest 通过，不能把后端真实监听启动算作已验证。
- 当前 `TRACE_INDEX.yaml` 426 行，超过 warning budget 420，但低于 strict fail 480。

## 当前最重要的 3 个问题

1. 缺少测试环境发布 runbook 和部署配置，无法稳定交给测试环境。
2. 缺少一条明确的 demo 启动入口；README 写 `scripts/dev.sh`，检查范围要求的 `scripts/start-demo.sh` 不存在。
3. Harness 能保护流程，但历史文件和 trace/log 继续增长，已经出现上下文和预算压力。

## 下一步建议任务

1. 补最小测试环境发布说明：运行时、环境变量、启动命令、健康检查、回滚方式。
2. 补最小 demo 启动入口：确认是否把 `scripts/dev.sh` 作为标准，或新增轻量 `scripts/start-demo.sh` 包装它。
3. 补核心路径 smoke/e2e：至少覆盖 `/schedule-plans -> detail -> risk/shift/unavailability -> back`。
