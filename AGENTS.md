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

## 验证

```bash
bash scripts/check.sh   # lint + typecheck + build + 前端模型测试 + 后端测试
```
