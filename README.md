# bpo-schedule-platform

BPO Workforce Management / BPO 人力计划与履约管理平台。

当前阶段是 `frontend dashboard scaffold`：项目已经包含一个 PM 确认的静态 BPO WFM dashboard scaffold，用于后续受控迭代。

## Current Scope

当前允许范围：

- shadcn/ui-style dashboard shell
- local static mock data for the dashboard prototype
- read-only FastAPI schedule plan API vertical
- read-only schedule plan list/detail frontend vertical
- dark / light theme support
- BPO WFM navigation and content replacement
- Lightweight Harness 文档、Gate、日志和审计闭环

当前不包含：

- database persistence
- authentication
- real Excel import
- real CORN integration
- production permissions
- approval flows
- export pipelines
- intelligent scheduling algorithms

## Development Runtime

本项目固定使用 Node.js 22。
本项目固定使用 Python 3.12。

项目根目录提供：

- `.nvmrc`
- `.node-version`
- `.python-version`
- `docs/dev/setup.md`

本机推荐使用 Homebrew `node@22`：

```bash
brew install node@22
```

## Install

```bash
npm install
```

## Run Locally

启动前端：

```bash
npm run dev
```

`npm run dev` 会自动：

- 优先切到 Homebrew Node.js 22
- 先做 `lightningcss` / Next.js native addon 预检
- 使用 webpack dev server，而不是裸 `next dev`

Dashboard:

```txt
http://localhost:3000/dashboard
```

排班计划：

```txt
http://localhost:3000/schedule-plans
```

启动本地验收 demo：

```bash
bash scripts/start-demo.sh
```

默认地址：

```txt
Frontend: http://localhost:3000
Backend:  http://127.0.0.1:8000
Health:   http://127.0.0.1:8000/health
```

`scripts/start-demo.sh` 会检查 Node.js 22 和 Python 3.12 后端运行时，启动 FastAPI 和 Next.js，并输出本地访问地址。

运行轻量 smoke：

```bash
bash scripts/smoke-demo.sh
```

Smoke 只检查 backend health endpoint 和 frontend 端口可访问性；它不是完整 E2E。更多说明见 `docs/local-demo.md`。

运行核心路径 E2E baseline：

```bash
BPO_WEB_URL=http://localhost:3000 npm run e2e:smoke
```

E2E 覆盖 dashboard、demand plans、schedule plans、plan detail、risk、shift、unavailability 和返回上下文。更多说明见 `docs/e2e-smoke.md`。

## Local Acceptance

本地验收入口：

- `docs/local-demo.md`: demo 启动、health 和 smoke。
- `docs/e2e-smoke.md`: 核心路径 E2E baseline。
- `docs/local-acceptance.md`: 本地验收版交付说明。
- `docs/deploy-test-env.md`: 测试环境准备说明。
- `docs/cloud-staging-options.md`: 云测试环境方案选择和 R007 草案。
- `docs/known-issues.md`: 当前已知问题。

## Verify

交付前运行：

```bash
bash scripts/check.sh
```

该脚本会优先使用 `/opt/homebrew/opt/node@22/bin`，并执行：

- Harness file checks
- frontend scaffold file checks
- frontend toolchain checks
- frontend native runtime preflight
- frontend dev runtime regression test
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- backend read-only API tests

## Working Rule

任何新的产品模块、前端页面、依赖、package 变更、真实 API、后端能力、数据库、权限、导出、审批或批量能力，都必须先进入 backlog，并通过 Gate Plan。
