# Development Setup

## Runtime

本项目固定使用 Node.js 22 作为本地开发与交付验证运行时。
本项目固定使用 Python 3.12 作为 backend 开发与验证运行时。

原因：

- 当前 Next.js / Tailwind / lightningcss 工具链在本机默认 Node.js 24 下可能触发 macOS 原生 `.node` 包 code-signing 加载失败。
- Homebrew `node@22` 已在本机验证可完整通过 `lint`、`typecheck`、`build` 与全量交付验证（`bash scripts/check.sh`）。
- `.nvmrc` 与 `.node-version` 均声明为 `22`，方便 nvm、fnm、mise、asdf 等工具识别。
- backend 脚本现在只接受 Python 3.12；系统自带 Python 3.9 即使出现在 PATH 里，也不会被当作本项目运行时。

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

为 backend 准备 Python 3.12：

- 优先使用项目 `.venv/bin/python3`
- 或设置 `BPO_BACKEND_PYTHON` / `BPO_PYTHON312_BIN` 指向可用的 Python 3.12 解释器

backend 依赖安装示例：

```bash
<python-3.12> -m pip install -r backend/requirements.txt
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
- 只接受 Python 3.12 backend runtime
- 检查 `fastapi`、`uvicorn`、`pydantic`
- 默认使用 `BPO_API_BASE_URL=http://127.0.0.1:8000`
- 同时启动 FastAPI 和 Next.js dev server

如需覆盖 API base：

```bash
BPO_API_BASE_URL=http://127.0.0.1:8000 bash scripts/dev.sh
```

## 本地联调 API 地址约定

API base 一律按「运行时求值」解析，禁止依赖构建期内联的环境变量：

- 服务端读路径（`lib/schedule-desk.ts` 等）与客户端写路径 base 共用同一约定：
  优先读运行时变量 `BPO_API_BASE_URL`，其次 `NEXT_PUBLIC_BPO_API_BASE_URL`，
  最后回退默认 `http://127.0.0.1:8000`。
- 排班计划台的客户端写路径（矩阵编辑/校验/发布直连 API）不由客户端读取
  `process.env`：服务端组件在请求时求值上述 base，并以 prop 注入客户端组件。
  因此 `npm run build` 不需要预置任何 API 地址变量，构建产物与运行环境解耦。
- `NEXT_PUBLIC_BPO_API_BASE_URL` 只作为服务端回退来源之一（例如
  `scripts/e2e.sh` 只导出该变量），客户端代码不得直接引用它。

E2E 端口说明（`scripts/e2e.sh`）：

- 后端 API：`http://127.0.0.1:8810`（独立 sqlite 临时库，先跑复核演示种子）
- 前端站点：`http://localhost:3310`（基于 `npm run build` 产物启动）
- 后端 CORS 仅放行本地联调 origin（localhost / 127.0.0.1 的 3000 与 3310）。

## Delivery Check

交付前运行：

```bash
bash scripts/check.sh
```

`scripts/check.sh` 会优先使用 `/opt/homebrew/opt/node@22/bin` 下的 Node.js 22（可用 `BPO_NODE22_BIN` 指向包含 `node` 与 `npm` 的目录覆盖）。如果本机缺少 Node.js 22，或未执行 `npm install` 导致前端依赖缺失，脚本会提前失败并给出提示。

全量验证包含六层：

- 前端模型测试：`node --experimental-strip-types --test scripts/tests/*.test.mjs`
- ESLint：`npm run lint`
- TypeScript typecheck：`npm run typecheck`
- 生产构建：`npm run build`
- 后端测试：由 `scripts/verify-backend-runtime.sh` 解析出的 Python 3.12 执行 `unittest discover -s backend/tests`
- E2E 行为检查：`bash scripts/e2e.sh`（需先完成生产构建；自备独立数据库与端口 8810/3310）

小改动迭代时可用聚焦模式，只跑所选层：

```bash
bash scripts/check.sh --fast              # 跳过 next build 与 E2E，跑其余四层
bash scripts/check.sh --lint --typecheck  # 只跑所选层
```

可选层标志：`--model-tests` / `--lint` / `--typecheck` / `--build` / `--backend` / `--e2e`，可自由组合；`--fast` 不能与层标志组合。

各层独立命令：

```bash
node --experimental-strip-types --test scripts/tests/*.test.mjs  # 前端模型测试
npm run lint                                                     # ESLint
npm run typecheck                                                # tsc --noEmit
npm run build                                                    # next build
"$(bash scripts/verify-backend-runtime.sh --print-path)" -m unittest discover -s backend/tests  # 后端测试
bash scripts/e2e.sh                                              # E2E 行为检查（需先 npm run build）
```
