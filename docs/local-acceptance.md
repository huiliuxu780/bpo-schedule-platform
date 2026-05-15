# Local Acceptance

## R005

R005 defines the local acceptance runbook for the current demo and E2E baseline. It does not add business features, UI changes, backend logic, scripts, dependencies, cloud deployment, database work, auth, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors.

## 当前项目阶段

本项目当前是 `Local Acceptance Candidate / 本地验收候选版`。

含义：

- 本地 demo 可以启动。
- 后端 health check 可检查。
- 前端核心页面可访问。
- 核心路径 E2E baseline 可运行。
- 完整工程检查可运行。

不代表：

- 已具备云测试环境。
- 已连接数据库或真实外部系统。
- 已完成生产级权限、审批、导出、批量调班、结算或收费能力。

## 本地验收版目标

让 PM、测试和其他开发者可以在本机完成一次可重复验收：

1. 安装依赖。
2. 启动前后端 demo。
3. 检查后端 health。
4. 运行 smoke。
5. 运行核心路径 E2E。
6. 运行完整工程检查。
7. 根据已知问题判断是否通过本地验收。

## 验收前置条件

- macOS 或兼容的本地开发环境。
- Node.js 22。推荐使用 Homebrew `node@22`。
- Python 3.12。
- 已安装项目依赖。
- 本机有可用 Chrome，或已安装 Playwright Chromium。
- 当前不需要数据库、云账号、真实 API 凭据或外部集成。

## 安装依赖

```bash
npm install
```

如需后端依赖，请使用项目指定的 Python 3.12 环境安装：

```bash
python3 -m pip install -r backend/requirements.txt
```

## 启动 Demo

默认启动：

```bash
bash scripts/start-demo.sh
```

默认地址：

```txt
Frontend: http://localhost:3000
Backend:  http://127.0.0.1:8000
Health:   http://127.0.0.1:8000/health
```

临时端口启动：

```bash
BPO_API_PORT=8010 BPO_WEB_PORT=3015 bash scripts/start-demo.sh
```

## 检查后端 Health

浏览器或终端访问：

```txt
http://127.0.0.1:8000/health
```

预期响应：

```json
{
  "project": "bpo-schedule-platform",
  "status": "ok"
}
```

## 运行 Smoke

demo 启动后，在另一个终端运行：

```bash
bash scripts/smoke-demo.sh
```

临时端口：

```bash
BPO_API_BASE_URL=http://127.0.0.1:8010 BPO_WEB_URL=http://localhost:3015 bash scripts/smoke-demo.sh
```

## 运行 E2E

demo 启动后运行：

```bash
BPO_WEB_URL=http://localhost:3000 npm run e2e:smoke
```

临时端口：

```bash
BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke
```

默认使用本机 Google Chrome。若使用 Playwright Chromium：

```bash
npx playwright install chromium
PLAYWRIGHT_CHANNEL=chromium BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke
```

## 运行完整 Check

```bash
bash scripts/check.sh
```

该命令会覆盖 Harness state check、runtime check、lint、typecheck、Next build 和后端 unittest。

## 核心验收路径

本地验收时至少检查：

1. `/dashboard` 可访问。
2. `/demand-plans` 可访问。
3. `/schedule-plans` 可访问。
4. 从 schedule plans 进入一个 plan detail。
5. 从 plan detail 进入 risk review，并返回 plan detail。
6. 从 plan detail 进入 shift detail，并返回 plan detail。
7. 从 plan detail 进入 unavailability detail，并能回到 plan detail。

## 当前已覆盖内容

- Dashboard、demand plans、schedule plans、plan detail/edit、schedule risks、shift details、unavailability 页面骨架。
- 本地 FastAPI health endpoint。
- 本地 demo 启动脚本。
- 后端 health + 前端可达性 smoke。
- 核心路径 E2E baseline。
- `bash scripts/check.sh` 完整工程检查。

## 当前未覆盖内容

- 云测试环境部署。
- 数据库持久化。
- 真实外部数据源或集成。
- 生产级 auth、permission、approval、export、batch operation。
- 生产公式、状态码、结算规则、收费因子。
- 全量表格交互 parity、跨浏览器矩阵、视觉回归。

## 已知问题

当前已知问题维护在 `docs/known-issues.md`。本地验收时重点关注：

- `KI-001`: 已在 F001 修复，unavailability detail 的页面内返回链接可回到对应 plan detail。
- `KI-002`: 云测试环境尚未配置。
- `KI-003`: `TRACE_INDEX.yaml` 已超过 warning budget，但未超过 strict fail。

## 验收通过标准

本地验收候选版通过需要满足：

- `bash scripts/check.sh` 通过。
- `bash scripts/start-demo.sh` 可启动前后端。
- `bash scripts/smoke-demo.sh` 通过。
- `npm run e2e:smoke` 通过。
- `/dashboard` 可访问。
- `/demand-plans` 可访问。
- `/schedule-plans` 主链路可点通。
- 已知问题不阻塞本地验收，并已记录后续处理阶段。
