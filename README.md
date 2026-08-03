# bpo-schedule-platform

BPO Workforce Management / BPO 坐席人力计划与履约管理平台。

面向 BPO（客服外包）交付团队，完成「需求预测 → 排班 → 履约对比 → 异常复核」业务闭环。

产品目标见 [PRODUCT.md](./PRODUCT.md)，里程碑路线见 [ROADMAP.md](./ROADMAP.md)，开发规则见 [AGENTS.md](./AGENTS.md)。

## 功能现状

- 数据导入中心：CSV 上传、字段映射模板、批次/版本管理、失败行修正
- 主数据管理：坐席、组织、职场、供应商、技能、服务组
- 生产版本：需求预测、人员排班、登录/状态日志的导入应用与版本台账
- 对比计算：预测 vs 排班、排班 vs 实际
- 复核工单：证据、结论、关单闭环
- Dashboard 骨架（暗/亮主题）

暂未包含：排班生成算法、真实 Excel 导入、导出、登录认证、审批流、外部系统集成。

## 技术栈

- 前端：Next.js 16（app router）+ React 19 + Tailwind 4 + shadcn/ui
- 后端：FastAPI + Pydantic + SQLite（Alembic 迁移），代码在 `backend/`
- 运行环境：Node.js 22 / Python 3.12（见 `.node-version` / `.python-version`）

## Install

```bash
npm install
python3.12 -m pip install -r backend/requirements.txt
```

## Run Locally

前后端联调启动（推荐）：

```bash
bash scripts/dev.sh
```

- 前端：http://localhost:3000/dashboard
- 后端 API：http://127.0.0.1:8000（可用 `BPO_API_BASE_URL` 覆盖）

只启动前端：

```bash
npm run dev
```

## Verify

```bash
bash scripts/check.sh
```

执行：前端模型测试、`npm run lint`、`npm run typecheck`、`npm run build`、后端 unittest。

## 历史资料

早期重流程 harness（Gate 体系、backlog、多角色提示词等）已归档至 `archive/harness-legacy/`，仅作历史参考，不再是开发规则。
