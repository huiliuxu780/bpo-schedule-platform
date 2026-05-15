# Release Readiness

## 测试环境发布检查清单

| 检查项 | 当前状态 | 证据 | 是否阻塞测试环境发布 | 修复建议 |
| --- | --- | --- | --- | --- |
| 当前 git 分支清晰 | 已完成 | `codex/f073-review-checklist-h032`，ahead 4 | 否 | 发布前先 push 或合并到目标测试分支。 |
| 工作区干净 | 已完成 | `git status --short --branch` 无未提交文件 | 否 | 保持发布前 clean working tree。 |
| AGENTS.md 存在 | 已完成 | `AGENTS.md` | 否 | 保留硬规则摘要即可。 |
| docs/ 存在 | 已完成 | `docs/**` | 否 | 后续避免把执行入口放回大型 legacy 文档。 |
| 一键检查脚本 | 已完成 | `bash scripts/check.sh` | 否 | 继续作为本地发布前 gate。 |
| `scripts/start-demo.sh` | 未完成 | `test -f scripts/start-demo.sh` 失败 | 是 | 新增轻量脚本或明确改验收口径为 `scripts/dev.sh`。 |
| 前端可本地启动 | 已完成 | `npm run dev` 提权后 Next.js 16.1.7 ready at `http://localhost:3000` | 否 | 测试环境仍需固定 Node.js 22。 |
| 前端 build | 已完成 | `bash scripts/check.sh` 内 `npm run build` 通过 | 否 | 发布时复用同一 Node.js 22 runtime。 |
| 后端存在 | 已完成 | `backend/app/main.py`、`backend/tests/test_schedule_plans.py` | 否 | 保持 FastAPI local MVP 边界。 |
| 后端可导入 | 已完成 | `/Users/mac/.local/bin/python3 -c 'from backend.app.main import app'` 输出 `BPO Schedule Platform API` | 否 | 可作为轻量健康检查的一部分。 |
| 后端真实监听启动 | 不确定 | 沙箱内 uvicorn bind `127.0.0.1:8017` 被 EPERM；提权审批超时 | 是 | 在真实机器或 CI runner 上补一次 uvicorn smoke。 |
| 后端测试 | 已完成 | `bash scripts/check.sh` 内 19 个 unittest 通过 | 否 | 测试环境前保留。 |
| 核心页面 | 已完成 | `/dashboard`、`/demand-plans`、`/schedule-plans`、`/schedule-risks`、`/shift-details`、`/unavailability` 等 | 否 | 发布 smoke 需要覆盖核心页 200。 |
| 核心 demo 路径 | 部分完成 | 页面和 helper 已有，`dashboard-table-model.test.mjs` 52 个测试覆盖 helper/源码断言 | 是 | 补浏览器级 smoke/e2e，验证真实点击链路。 |
| 测试数据/seed 数据 | 已完成 | `backend/app/seed_data.py`、`app/dashboard/data.ts` | 否 | 测试环境说明里标注 seed 数据边界。 |
| 测试环境部署说明 | 未完成 | 未发现 deployment/staging runbook | 是 | 新增最小部署说明，不需要复杂平台化。 |
| 环境变量说明 | 部分完成 | README 提到 `BPO_API_BASE_URL` | 是 | 明确前端/后端测试环境 env 和默认值。 |
| e2e 或核心路径验证 | 未完成 | 未发现 Playwright/e2e；当前主要是 unit/source assertion/build | 是 | 增加手动或自动 smoke，先轻量覆盖核心路径。 |
| task log / branch log | 已完成 | `docs/task-log.md`、`docs/dev/branch-log.md` | 否 | 后续建议窗口化，避免无限增长。 |
| known issues / blockers | 部分完成 | `docs/current/BLOCKERS.md` 无 active blockers；audit 中有风险说明 | 否 | 测试环境前整理一份短 known issues。 |

## 结论

当前不建议直接发布测试环境。

原因不是业务页面不可用，而是测试环境交付面还缺三个最小件：部署/启动 runbook、真实服务启动 smoke、浏览器级核心路径验证。

## 如果不可以，还差哪几个最小任务

1. 补 `docs/deploy-test-env.md` 或等价测试环境 runbook：Node/Python 版本、install、build、启动、env、健康检查。
2. 补 `scripts/start-demo.sh` 或正式声明 `scripts/dev.sh` 为 demo 启动入口，并验证前后端一起启动。
3. 补核心路径 smoke/e2e：至少覆盖排班计划列表、详情、风险、班次、不可用和返回链路。

## 优先做哪 3 件事

1. 先补测试环境 runbook。
2. 再补 demo 启动脚本/健康检查。
3. 最后补核心路径 smoke/e2e。
