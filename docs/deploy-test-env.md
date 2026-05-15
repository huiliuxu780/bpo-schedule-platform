# Test Environment Readiness

## 当前结论

当前项目已具备本地验收能力，但尚未完成云测试环境部署。

本文件是测试环境准备说明，不是云部署完成说明。

R006 已完成云测试环境方案选择：第一选择是 `Vercel frontend + Render/Railway/Fly.io backend`，备选是单 VPS 或企业内部服务器。R006 不代表已经 Cloud Staging Ready；实际部署应由 R007 执行。

## 当前状态

| 项目 | 状态 |
| --- | --- |
| 本地 demo 启动 | 已完成 |
| 后端 health check | 已完成 |
| 前端本地访问 | 已完成 |
| 本地 smoke | 已完成 |
| 核心路径 E2E baseline | 已完成 |
| 云测试环境 | 未完成 |
| 远程域名或固定地址 | 未完成 |
| 远程环境变量管理 | 未完成 |

## 推荐测试环境最小要求

- Node.js 22。
- Python 3.12。
- 可运行 Next.js frontend。
- 可运行 FastAPI backend。
- 可配置前端访问后端的 base URL。
- 可暴露 backend `/health`。
- 可从测试机访问 frontend URL。

## 前端启动方式

本地开发启动：

```bash
npm run dev
```

生产构建验证：

```bash
npm run build
```

云测试环境的实际启动命令需在选定平台后确认。

## 后端启动方式

本地 demo 入口：

```bash
bash scripts/start-demo.sh
```

该脚本会启动 FastAPI backend 和 Next.js frontend。云测试环境是否拆分为两个服务，需要在选定平台后确认。

## 环境变量

当前本地验收相关变量：

| 变量 | 用途 | 默认值 |
| --- | --- | --- |
| `BPO_API_PORT` | demo backend 端口 | `8000` |
| `BPO_WEB_PORT` | demo frontend 端口 | `3000` |
| `BPO_API_BASE_URL` | smoke backend URL | `http://127.0.0.1:8000` |
| `BPO_WEB_URL` | smoke/E2E frontend URL | `http://localhost:3000` |
| `PLAYWRIGHT_CHANNEL` | Playwright 浏览器 channel | `chrome` |

云测试环境后续至少需要明确 frontend URL、backend URL 和 health URL。

## Health Check

```txt
GET /health
```

预期返回：

```json
{
  "project": "bpo-schedule-platform",
  "status": "ok"
}
```

## Smoke Check

本地：

```bash
bash scripts/smoke-demo.sh
```

指定地址：

```bash
BPO_API_BASE_URL=http://127.0.0.1:8010 BPO_WEB_URL=http://localhost:3015 bash scripts/smoke-demo.sh
```

## E2E Check

本地：

```bash
BPO_WEB_URL=http://localhost:3000 npm run e2e:smoke
```

指定地址：

```bash
BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke
```

## 未来云部署待定项

- PM 确认 R007 的具体平台：Vercel + Render/Railway/Fly.io、单 VPS、或企业内部服务器。
- 确认前后端是否同平台部署。
- 确认 backend URL 如何暴露给 frontend。
- 确认远程 health check 地址。
- 确认远程 smoke/E2E 在哪里执行。
- 确认日志查看方式。
- 确认是否需要 staging-only 配置文件。

## 上云前 Blocker

- 已有推荐方案，但尚未确认和实施云测试环境平台。
- 未配置远程 frontend/backend 地址。
- 未配置远程环境变量。
- 未验证远程 `/health`。
- 未验证远程 smoke。
- 未验证远程核心路径 E2E。
- 当前不允许引入数据库、真实外部集成、auth、permission、approval、export、batch operation、生产公式、结算规则或收费因子。
