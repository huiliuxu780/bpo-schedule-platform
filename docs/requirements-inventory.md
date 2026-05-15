# Requirements Inventory

## 当前判断

当前项目是本地验收版接近完成、测试环境准备不足的状态。业务主链路已经能在本地 seed/process-memory 数据上跑通，但测试环境发布所需的 demo 启动、核心路径 smoke/e2e、部署说明仍缺。

## 需求全集盘点

| 模块 | 页面/能力 | 当前状态 | 证据 | 缺口 | P0/P1 | 是否阻塞本地验收版 |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard | BPO WFM dashboard scaffold、指标卡、图表、异常表、heatmap、sync status | 已完成 | `app/dashboard/page.tsx`、`app/dashboard/data.ts`、`components/data-table.tsx`、`components/bpo-heatmap.tsx`、`scripts/tests/dashboard-table-model.test.mjs` | 仍是本地/静态展示，不接真实数据 | P1 | 否 |
| Demand Plans | 需求计划列表、搜索、进入排班计划 | 部分完成 | `app/demand-plans/page.tsx`、`backend/app/main.py` 的 `/api/v1/demand-plans`、`backend/app/seed_data.py` | 无真实 Excel/预测数据接入，无部署环境验证 | P1 | 否 |
| Schedule Plans | 排班计划列表、状态筛选、搜索、风险/班次/不可用入口 | 部分完成 | `app/schedule-plans/page.tsx`、`components/schedule-plan-table.tsx`、`backend/app/main.py` 的 `/api/v1/schedule-plans` | 无数据库持久化、发布、审批、权限、真实生产状态 | P0 | 否 |
| Schedule Plan Detail | 计划详情、0.5h 时段、风险/班次/不可用 drilldown、review rail | 已完成 | `app/schedule-plans/[planId]/page.tsx`、`components/schedule-plan-interval-table.tsx`、`components/review-checklist-rail.tsx` | 仍无人员级排班编辑、真实回写 | P0 | 否 |
| Schedule Plan Edit | draft 创建与编辑、返回态、失败/成功反馈 | 部分完成 | `app/schedule-plans/new/page.tsx`、`app/schedule-plans/new/actions.ts`、`app/schedule-plans/[planId]/edit/page.tsx`、`backend/app/main.py` 的 draft POST/PUT | 只支持本地 draft，不支持发布/审批/生产编辑流 | P1 | 否 |
| Schedule Risks | 风险工作台、风险明细、计划/班次/不可用继续钻取 | 部分完成 | `app/schedule-risks/page.tsx`、`app/schedule-risks/[riskId]/page.tsx`、`components/schedule-risk-table.tsx` | 风险公式和状态码未生产化，无真实数据源 | P0 | 否 |
| Shift Details | 班次明细列表、筛选、scoped drilldown、review rail | 部分完成 | `app/shift-details/page.tsx`、`components/shift-details-table.tsx`、backend `/api/v1/shift-details` | 无人员级排班、拖拽、调班或真实考勤源 | P1 | 否 |
| Unavailability | 不可用列表、不可用影响定位、关联风险/班次/计划 | 部分完成 | `app/unavailability/page.tsx`、`app/unavailability/[unavailabilityId]/page.tsx`、backend `/api/v1/unavailability` | 无真实不可用申请流、权限、审批、批量处理 | P0 | 否 |
| Review Navigation | 跨页面 source/scope/back link、右侧复核 rail | 已完成 | `lib/review-navigation.ts`、`components/review-checklist-rail.tsx`、`scripts/tests/dashboard-table-model.test.mjs` | 仅 URL query 级上下文，不是服务端用户态 | P0 | 否 |
| Backend API | FastAPI 本地 API、列表/详情/draft endpoints、unittest | 部分完成 | `backend/app/main.py`、`backend/app/models.py`、`backend/app/repository.py`、`backend/tests/test_schedule_plans.py` | 无数据库、auth、部署健康检查；本轮 uvicorn 端口绑定未能在沙箱确认 | P0 | 是 |
| Seed Data | 本地 seed/process-memory 数据 | 已完成 | `backend/app/seed_data.py`、`app/dashboard/data.ts` | 不是生产数据，不支持跨进程持久化 | P0 | 否 |
| Local Demo | 本地前端和前后端联调启动 | 部分完成 | `npm run dev`、`scripts/dev.sh`、`scripts/run-next-dev.sh` | 缺 `scripts/start-demo.sh`；缺统一 demo health check | P0 | 是 |
| E2E | 核心路径验证 | 未完成 | 目前只有 `scripts/tests/dashboard-table-model.test.mjs` 和 backend unittest | 缺浏览器级 smoke/e2e：计划列表 -> 详情 -> 风险/班次/不可用 -> 返回 | P0 | 是 |
| Harness | current queue、active task、state check、hooks、trace index | 部分完成 | `docs/current/**`、`docs/quality/GATE_REGISTRY.md`、`scripts/check-state.sh`、`scripts/hooks/**` | 有效但偏重；`TRACE_INDEX.yaml` 已超过 warning budget；legacy 文档很大 | P1 | 否 |
| Release Readiness | 测试环境发布准备 | 部分完成 | `README.md`、`scripts/check.sh`、`docs/release-readiness.md` | 缺测试环境部署 runbook、demo 启动脚本、真实服务 smoke/e2e | P0 | 是 |

## P0/P1 汇总

- P0 已覆盖：排班计划主链路、详情、风险、不可用、review navigation、本地 seed、基础后端 API。
- P0 缺口：后端真实启动 smoke、`scripts/start-demo.sh` 或等价 demo 入口、核心路径 e2e/smoke、测试环境部署说明。
- P1 缺口：需求计划真实数据接入、完整 draft 生产工作流、Harness 瘦身、dashboard 真实数据接入。
