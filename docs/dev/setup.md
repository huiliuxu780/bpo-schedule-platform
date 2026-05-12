# Development Setup

## Runtime

本项目固定使用 Node.js 22 作为本地开发与交付验证运行时。

原因：

- 当前 Next.js / Tailwind / lightningcss 工具链在本机默认 Node.js 24 下可能触发 macOS 原生 `.node` 包 code-signing 加载失败。
- Homebrew `node@22` 已在本机验证可完整通过 `lint`、`typecheck`、`build` 和 Harness check。
- `.nvmrc` 与 `.node-version` 均声明为 `22`，方便 nvm、fnm、mise、asdf 等工具识别。

## First-Time Setup

在 macOS 上推荐使用 Homebrew 安装 Node.js 22：

```bash
brew install node@22
```

如果当前 shell 默认不是 Node.js 22，可以临时切换：

```bash
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
```

安装依赖：

```bash
npm install
```

## Local Development

启动开发服务：

```bash
npm run dev
```

`npm run dev` 不再直接裸跑 `next dev`。它会先：

- 优先切到 Homebrew Node.js 22
- 预检 `lightningcss` 和 Next.js compiler 原生包是否可加载
- 再以 webpack dev server 启动 Next.js

如果你直接手动执行 `next dev`，仍然可能绕过项目保护并重新踩到本机 Node.js 24 的原生包签名问题。

默认访问：

```txt
http://localhost:3000/dashboard
```

排班计划纵切页面：

```txt
http://localhost:3000/schedule-plans
```

启动第一条前后端纵切联调：

```bash
bash scripts/dev.sh
```

该脚本会：

- 优先使用 Homebrew Node.js 22
- 调用与 `npm run dev` 相同的前端 native preflight 和 webpack dev 入口
- 检查 `fastapi`、`uvicorn`、`pydantic`
- 默认使用 `BPO_API_BASE_URL=http://127.0.0.1:8000`
- 同时启动 FastAPI 和 Next.js dev server

如需覆盖 API base：

```bash
BPO_API_BASE_URL=http://127.0.0.1:8000 bash scripts/dev.sh
```

## Delivery Check

交付前运行：

```bash
bash scripts/check.sh
```

`scripts/check.sh` 会优先使用 `/opt/homebrew/opt/node@22/bin` 下的 Node.js 22。如果本机缺少 Node.js 22，脚本会提前失败并给出安装提示。

该检查包含：

- Harness 必需文件检查
- frontend scaffold 必需文件检查
- 前端工具链检查：`eslint`、`tsc`、`next`
- `npm run verify:dev-runtime`
- `npm run test:dev-runtime`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `bash -n scripts/dev.sh`
- `bash -n scripts/run-next-dev.sh`
- backend unittest

## Scope Boundary

H007/H008 只固化开发环境、交付验证入口和本地联调启动方式。

它不授权：

- 新增业务功能
- 新增依赖
- 修改 `package.json` 或 lockfile
- 接入后端、数据库、真实 API、真实 CORN 或真实 Excel
- 修改指标公式、状态码、结算公式或收费因子
