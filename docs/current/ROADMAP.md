# ROADMAP

updated_at: 2026-06-28
owner: PM + Codex
source_of_truth: docs/current/ROADMAP.md
feishu_base: https://bsh-group.feishu.cn/base/SfHQbFp2iayfiCsMypccBz7Knwb?table=tblo03qLQkgtNoYa&view=vewGvE45jR

## 1. Product Direction

本项目要做的是 BPO Workforce Management / BPO 人力计划与履约管理平台。

产品主线不是通用 Dashboard，也不是单纯导入工具，而是一个可审计的本地 MVP 到生产能力演进链路：

1. 用主数据、需求预测、排班、登录/状态日志形成可追溯的数据基础。
2. 用导入中心、版本、比对结果和复核案例支撑数据质量与异常处理。
3. 用经营总览、排班计划、履约风险、不可用记录和班次明细支撑运营人员日常履约管理。
4. 逐步补齐生产级权限、审批、导出、批量操作、外部系统集成、自动排班、业务公式、结算和收费因子，但这些都必须单独确认 Gate。

当前阶段仍是 local MVP + operator-facing scaffold。项目可以继续做可验证的本地工作流，但不能把本地能力包装成生产就绪。

## 2. Current Baseline

| Area | Current State | Boundary |
| --- | --- | --- |
| Global shell / dashboard | IM267 已按 shadcn dashboard-01 基线重整 sidebar、header、KPI、chart、tabs table | 不再把总览首屏做成顶部筛选控制台 |
| Local operational workflow | IM248-IM267 已形成 dashboard -> plan -> risk -> unavailability -> shift detail 的本地链路 | 仍是本地 MVP，不含权限、审批、批量、导出、自动排班 |
| Schedule plan lifecycle | draft -> review_ready -> published 已有本地 API、页面动作和反馈 | 没有生产审批流、回滚、审计轨迹 |
| Fulfillment handling | 风险确认/处理、不可用处理已有单条本地动作 | 没有批量处理、通知、权限 |
| Import center / review case | 导入、readiness、apply、比对、复核案例已有较多本地持久化与前端工作台 | 外部 CORN/HR/WFM/Excel 集成仍禁用 |
| Master data | 人员、组织、职场、供应商、技能、服务团队已有本地维护/只读链路 | 没有生产权限、数据隔离、合同/结算对象 |
| Harness | 当前层可执行队列为空，历史记录庞大 | 缺少常驻 Roadmap/Task Board/GAP Matrix 已由 IM269 修复 |

## 3. Roadmap Horizons

### Horizon 0 - Governance Rebaseline

Goal: 先把项目不再跑偏。

Deliverables:

- `ROADMAP.md`: 项目未来方向和阶段顺序。
- `TASK_BOARD.md`: 当前需求池、用户故事和任务池，区分能做、不能做、待确认。
- `GAP_MATRIX.md`: 真功能、假功能、缺失能力和生产阻塞。
- Feishu Base 同步摘要，后续每次执行需要更新。

Done criteria:

- 三份 current 文档存在且被 `AGENTS.md` 纳入默认治理。
- 当前队列为空时，不再凭记忆猜下一个开发任务。
- Feishu Base 至少能看到本次 Roadmap / Task Board / GAP Matrix 的同步摘要。

### Horizon 1 - Operator Local MVP Hardening

Goal: 把已经存在的本地运营链路变成稳定、可验收、少跑偏的操作工作台。

Recommended order:

1. Schedule-plan / risk / unavailability workbench shadcn baseline alignment.
2. Schedule-plan interval editing usability improvement.
3. Dashboard trend data definition and local data boundary cleanup.
4. Runtime acceptance pass for the latest IM267 + IM268 baseline.

Allowed scope:

- Frontend scaffold and local MVP hardening.
- Existing local backend/API routes only when a confirmed backend/local MVP task exists.
- Focused tests and browser smoke.

Not allowed by default:

- New dependencies or package/lockfile changes.
- Permission, approval, export, batch operations, external integrations, automatic scheduling, production formulas, settlement, charge factors.

### Horizon 2 - Data Quality And Review Operations

Goal: 让导入、版本、比对、复核案例形成清晰闭环，而不是分散页面堆叠。

Recommended order:

1. Review-case / comparison-run / import-batch trace board consolidation.
2. Review-case operator queue hardening and runtime evidence refresh.
3. Import apply/readiness exceptions: clarify what is actionable vs read-only.

Allowed scope:

- Existing local DB-backed import/review/comparison contracts.
- Read-only or single-record controlled actions already covered by prior Gates.

Needs new Gate:

- Any real Excel upload, multipart upload, external WFM/CORN/HR integration.
- Batch apply, batch review, approval, export, permission, production status semantics.

### Horizon 3 - Production Readiness Planning

Goal: 在产品链路稳定后，再设计生产边界。

Planning topics:

- Authentication and role-based access control.
- Tenant / supplier / project / site data isolation.
- Operation audit trail and action history.
- Approval workflows for schedule publish and exception closure.
- Export and reporting policy.
- External data integration contracts.
- Automatic scheduling strategy.
- Production formulas, settlement rules, and charge-factor model.

This horizon is planning-first. Implementation requires separate PM confirmation and dedicated Gate.

## 4. Default Next Recommendations

When PM says "继续" without a specific task, choose from this order unless a new blocker appears:

1. IM270 candidate: shadcn baseline alignment for schedule-plan and risk workbench pages.
2. IM271 candidate: schedule-plan interval editor usability hardening.
3. IM272 candidate: dashboard trend-data definition and sample-data boundary cleanup.

Do not start permissions, approval, export, batch, external integration, automatic scheduling, formulas, settlement, or charge factors from a generic "继续".

## 5. Feishu Sync Rule

The target Feishu Base is the PM-visible operating board:

https://bsh-group.feishu.cn/base/SfHQbFp2iayfiCsMypccBz7Knwb?table=tblo03qLQkgtNoYa&view=vewGvE45jR

Every non-trivial execution should refresh Feishu with:

- What changed in Roadmap, Task Board, or GAP Matrix.
- Current recommended next task.
- Whether the task is executable, blocked, or deferred.
- Verification result and local commit status when applicable.

If Feishu is unavailable, the Done Report must say so and list the local source files that remain authoritative.
