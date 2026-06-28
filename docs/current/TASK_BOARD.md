# TASK_BOARD

updated_at: 2026-06-28
owner: PM + Codex
source_of_truth: docs/current/TASK_BOARD.md
feishu_base: https://bsh-group.feishu.cn/base/SfHQbFp2iayfiCsMypccBz7Knwb?table=tblo03qLQkgtNoYa&view=vewGvE45jR

## 1. Board Rules

`docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml` remain the executable queue.

This file is the PM-facing demand and task board:

- It may contain candidates, blocked ideas, and deferred production topics.
- It does not make a task executable by itself.
- A candidate becomes executable only after it is converted into a ready story and matching active task, with allowed files, forbidden files, workflow, acceptance, stop conditions, and Gate confirmation when required.
- When this board and executable queue disagree, executable queue wins for current execution; this board should then be repaired.

## 2. Current Executable Queue

| Queue | State |
| --- | --- |
| `docs/current/STORY_QUEUE.yaml` | empty |
| `docs/current/ACTIVE_TASKS.yaml` | empty |
| Current active blocker | none |
| Current maintenance concern | keep current context compact, prevent next-task guessing, refresh Roadmap/Task Board/GAP Matrix and Feishu |

Conclusion: no product-development task is currently executable until PM confirms a candidate and Codex creates a proper story/task Gate.

## 3. Ready-To-Shape Candidates

These are suitable next tasks, but still need conversion into proper story/task entries before implementation.

| Candidate ID | Title | User Story Draft | Workflow | Can Execute Now | Why / Condition |
| --- | --- | --- | --- | --- | --- |
| IM270-candidate | Schedule-plan and risk workbench shadcn baseline alignment | 作为运营人员，我希望排班计划、履约风险、不可用记录等工作台与当前 dashboard shell 保持一致，以便跨页面操作节奏稳定。 | frontend-scaffold | No | Needs PM confirmation, allowed files, focused visual/tests scope. |
| IM271-candidate | Schedule-plan interval editor usability hardening | 作为排班计划编辑人员，我希望草稿时段编辑更易读、更少误填，以便保存前确认预测、已排和缺口。 | frontend-scaffold | No | Existing draft form exists, but task must avoid formulas, approval, auto scheduling. |
| IM272-candidate | Dashboard trend-data definition | 作为运营负责人，我希望总览趋势图的样例边界和数据口径明确，以便不把静态样例误解为实时趋势。 | frontend-scaffold or frontend-audit | No | Can start as docs/audit first; implementation requires agreed data model. |
| IM273-candidate | Latest operational runtime acceptance | 作为产品经理，我希望 IM267/IM268 后的本地页面链路再次被浏览器验收，以便确认视觉调整没有破坏操作流。 | qa | No | Requires runtime/browser Gate and evidence file; no product expansion. |
| IM274-candidate | Review-case trace board consolidation | 作为复核处理人员，我希望从复核案例看到比对结果、来源版本和导入批次的稳定上下文，以便少跳转也能判断异常来源。 | frontend-scaffold | No | Must stay within existing APIs and avoid batch/approval/export. |
| IM275-candidate | Import readiness exception workbench audit | 作为运营人员，我希望导入 readiness 问题清楚地区分可修正、只读、阻塞，以便不误触发未确认的批量能力。 | frontend-audit | No | Recommended as audit first because apply/batch semantics are risky. |

## 4. Blocked Or Deferred Topics

These topics are product-relevant but must not be implemented from a generic continuation request.

| Topic | Status | Blocker / Required Gate |
| --- | --- | --- |
| Authentication | blocked | Requires auth/permission Gate and product role model. |
| Role-based permissions | blocked | Requires PM-confirmed permission boundary and data isolation model. |
| Approval workflow | blocked | Requires approval design, roles, audit, state machine, and stop-condition confirmation. |
| Export | blocked | Requires export policy, data scope, format, permission, and audit decision. |
| Batch operations | blocked | Requires batch semantics, rollback, audit, permissions, and explicit PM confirmation. |
| External CORN / HR / WFM integration | blocked | Requires integration Gate, credentials policy, contract, sandbox/prod split. |
| Real Excel / multipart import | blocked | Requires dependency/package decision and import contract. |
| Automatic scheduling | deferred | Requires algorithm scope, input completeness, constraints, formula governance, acceptance strategy. |
| Production formulas | blocked | Requires business formula ownership and production-status confirmation. |
| Settlement / charge factors | blocked | Requires finance/product rule ownership, audit, permissions, and separate Gate. |
| Tenant/supplier data isolation | blocked | Requires auth, permissions, and data model decision. |

## 5. Candidate Detail

### IM270-candidate - Workbench shadcn baseline alignment

Recommended next if PM wants visible product quality.

Allowed direction:

- Align schedule-plan list/detail, schedule-risk list/detail, unavailability list/detail, and shift details with the current dashboard shell rhythm.
- Keep dense B2B tables and operator workbench structure.
- Use existing shadcn/ui components and existing dependencies.

Forbidden direction:

- Do not rebuild pages as marketing cards.
- Do not add dependencies.
- Do not add new routes unless a route is proven missing and confirmed.
- Do not add approval/export/batch/permissions.

### IM271-candidate - Schedule-plan interval editor usability

Recommended next if PM wants the local MVP write loop stronger.

Allowed direction:

- Improve readability and validation of the existing draft form.
- Preserve existing server actions and backend contracts.
- Add focused model tests and browser acceptance when runtime is available.

Forbidden direction:

- Do not implement automatic scheduling.
- Do not finalize production formulas.
- Do not add role approval or publish governance.

### IM272-candidate - Dashboard trend data definition

Recommended next if PM worries dashboard still feels fake.

Allowed direction:

- Define what the trend chart should represent in local MVP.
- Decide whether current trend is sample-only, computed from local plans, or removed until data exists.
- Start as frontend-audit/docs if needed.

Forbidden direction:

- Do not claim real-time trends.
- Do not add external data or background refresh.

## 6. Execution Update Rule

At the end of every non-trivial task:

1. If task direction, candidate order, blocked status, or gap classification changed, update this file.
2. If it did not change, state "Task Board unchanged" in Done Report.
3. Sync the summary to the Feishu Base when Feishu write is available and confirmed.
