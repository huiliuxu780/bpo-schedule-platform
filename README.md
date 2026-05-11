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

项目根目录提供：

- `.nvmrc`
- `.node-version`
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

Dashboard:

```txt
http://localhost:3000/dashboard
```

排班计划：

```txt
http://localhost:3000/schedule-plans
```

启动第一条前后端纵切联调：

```bash
bash scripts/dev.sh
```

默认 API base：

```txt
http://127.0.0.1:8000
```

可通过 `BPO_API_BASE_URL` 覆盖。

## Verify

交付前运行：

```bash
bash scripts/check.sh
```

该脚本会优先使用 `/opt/homebrew/opt/node@22/bin`，并执行：

- Harness file checks
- frontend scaffold file checks
- frontend toolchain checks
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- backend read-only API tests

## Working Rule

任何新的产品模块、前端页面、依赖、package 变更、真实 API、后端能力、数据库、权限、导出、审批或批量能力，都必须先进入 backlog，并通过 Gate Plan。
