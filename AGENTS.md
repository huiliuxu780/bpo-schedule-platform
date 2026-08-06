# AGENTS.md

## 产品目标

BPO 坐席人力排班平台：帮助 BPO 交付团队完成「需求预测 → 排班 → 履约对比 → 异常复核」闭环。

开发任何功能前，先读 `PRODUCT.md` 和 `ROADMAP.md`。

## 技术栈

- 前端：Next.js 16（app router）+ React 19 + Tailwind 4 + shadcn/ui
- 后端：FastAPI + Pydantic + SQLite（Alembic 迁移），代码在 `backend/`
- 运行环境：Node 22 / Python 3.12（见 `.node-version` / `.python-version`）
- 本地联调启动：`bash scripts/dev.sh`（前端 3000，后端 8000）

## 开发规则（仅 5 条）

1. 每个功能开始前，先用一句话说明「它为哪个角色、在业务闭环的哪一步、解决什么问题」。说不清就不做。
2. 纵切交付：一个功能必须前后端打通、能在浏览器里实际操作演示；不接受孤立的纯前端或纯后端微功能。
3. 完成标准：`bash scripts/check.sh` 通过，且在浏览器中实际走通主流程。
4. 新增依赖、修改数据库 schema、涉及认证权限，必须先征得用户确认。
5. 代码标识符、commit message 用英文；UI 文案与沟通用中文。

## 禁止事项

- 不做「只读解释页」「安全壳」「禁用按钮占位」这类只解释"为什么不能做"的功能。
- 不为流程写流程：不新增 gate、registry、trace index、done report 等流程文档。
- 不拆分出几十个微任务逐个做；按 `ROADMAP.md` 的里程碑整体推进。
- `archive/` 目录是历史资料，默认不读、不从中派生任务。

## 联调日志与诊断

- 后端应用日志写到运行 `bash scripts/dev.sh` 的终端（stderr，logger 名 `backend.app.*`），每行带 `request_id=<关联标识>`；HTTP 响应头 `X-Request-ID` 回显同一标识，客户端也可用该请求头自带标识。
- 串联一次失败：从响应头拿到 `request_id`，在 dev.sh 终端 `grep` 该标识，即可同时看到请求行（method/path/status）与服务层决策行（导入批次版本选择、行校验失败，均含 batch_id）。
- 聚焦复现路由：
  - 行校验失败：`POST /api/v1/import-batches/upload-csv`，CSV 某行缺少 `source_key` 映射列值 → 该行记为 failed 并打一行 WARNING。
  - 版本选择：`POST /api/v1/import-batches/{batch_id}/apply-forecast`（或 apply-personnel-schedule / apply-actual-logs）→ 打一行所选 import version 的 INFO。

## 验证

```bash
bash scripts/check.sh   # 全量：lint + typecheck + build + 前端模型测试 + 后端测试 + E2E 行为检查（交付标准）
```

小改动迭代时用聚焦模式，只跑所选层：

```bash
bash scripts/check.sh --fast              # 跳过 next build 与 E2E，跑其余四层
bash scripts/check.sh --lint --typecheck  # 只跑所选层：--model-tests/--lint/--typecheck/--build/--backend/--e2e 可自由组合
```

各层独立命令：

```bash
node --experimental-strip-types --test scripts/tests/*.test.mjs  # 前端模型测试
npm run lint                                                     # ESLint
npm run typecheck                                                # tsc --noEmit
npm run build                                                    # next build
"$(bash scripts/verify-backend-runtime.sh --print-path)" -m unittest discover -s backend/tests  # 后端测试
bash scripts/e2e.sh                                                        # E2E 行为检查（需先 npm run build；自备独立数据库与端口 8810/3310）
```

推送 main 时由 pre-push 钩子机械执行全量验证；首次克隆后启用一次：

```bash
ln -sf ../../scripts/git-hooks/pre-push .git/hooks/pre-push
```
