# GAP_MATRIX

updated_at: 2026-06-28
owner: PM + Codex
source_of_truth: docs/current/GAP_MATRIX.md
feishu_base: https://bsh-group.feishu.cn/base/SfHQbFp2iayfiCsMypccBz7Knwb?table=tblo03qLQkgtNoYa&view=vewGvE45jR

## 1. Classification

| Classification | Meaning |
| --- | --- |
| True Local Function | Works in the current local MVP with implemented UI/API/model behavior and verification evidence. |
| Controlled Local Function | Works only under explicit local Gate boundaries, usually single-record or read-only. |
| Visual / Static Function | UI exists, but behavior is static, sample-driven, or non-authoritative. |
| Planning / Doc Only | Product direction exists in docs, but no executable product behavior exists. |
| Missing | Product capability is not implemented. |
| Blocked Production Capability | Important for production, but forbidden until a dedicated Gate confirms scope and risk. |

## 2. Product Capability Matrix

| Capability | Classification | Evidence / Current Behavior | Gap | Recommended Action |
| --- | --- | --- | --- | --- |
| Global shell and sidebar | True Local Function | IM267 aligned with shadcn dashboard-01 style: inset shell, flat workbench nav, shared header rhythm. | Other workbench pages may still lag dashboard rhythm. | IM270-candidate. |
| Dashboard KPI cards | True Local Function | Built from local schedule plan, risk, and unavailability data clients with fallback handling. | Trend and sample boundaries still need clearer data definition. | IM272-candidate. |
| Dashboard anomaly table | True Local Function | Tabs/table structure, review-priority ordering, downstream links. | Still local MVP; no real-time refresh or owner assignment. | Keep; harden only if runtime regression appears. |
| Dashboard global filters | Controlled Local Function | URL-driven filters exist for deep links; default page no longer shows filter console. | If PM wants persistent filter UI, needs a better lower-workbench design. | Do not re-add top-level console. |
| Dashboard trend chart | Visual / Static Function | Current trend is local/sample boundary, not production trend. | Can mislead if presented as real trend. | Define or remove sample trend in IM272. |
| Schedule-plan list | True Local Function | Search, status filters, metrics, source states, links to detail/new. | Needs visual alignment with IM267 shell. | IM270-candidate. |
| Schedule-plan detail | True Local Function | Interval table, lifecycle actions, related risk/unavailability previews. | No audit trail, rollback, approval, or production publish governance. | Local hardening only; production governance later. |
| Schedule-plan create/edit draft | Controlled Local Function | Shared draft form, draft summary, create/update redirects and feedback. | Runtime draft edit chain depends on available draft data; editor UX can improve. | IM271-candidate. |
| Plan submit-review / publish | Controlled Local Function | Local API/server actions support draft -> review_ready -> published. | Not a production approval workflow. | Keep scoped; approval remains blocked. |
| Shift details | True Local Function | Shift-level list, search/status filter, source messaging after IM259. | Needs visual alignment and latest runtime acceptance. | IM270 or IM273. |
| Schedule-risk list | True Local Function | Search, status/level filters, summary, links to risk/plan. | No batch handling, owner queue, notification. | Align UI first; defer batch/permission. |
| Schedule-risk detail actions | Controlled Local Function | Confirm and resolve single risk with local server actions. | No batch, audit trail, authorization, rollback. | Keep local; production design later. |
| Unavailability list/detail | True Local Function | List/detail, source messaging, resolve action, risk/shift links. | No permission, batch resolve, notification, external HR source. | Align UI first; defer production. |
| Import batch list/detail | True Local Function | Local DB-backed batch/readiness/apply/result trace surfaces exist. | Some flows are complex and need better operator grouping. | Audit before new implementation. |
| CSV upload route | Controlled Local Function | Existing import-center CSV upload/readiness/apply local vertical. | Real Excel/multipart and external ingestion are blocked. | Do not expand without dependency/integration Gate. |
| Field mapping templates | Controlled Local Function | Persisted template visibility/update/deactivate exists locally. | No production ownership or permission model. | Defer production governance. |
| Comparison calculation | Controlled Local Function | Local comparison calculation and result query APIs exist. | Production formula ownership not confirmed. | Treat as local MVP, not production formula engine. |
| Review-case workspace | True Local Function | List/detail, processing stage, evidence/conclusion/closure actions, source trace, owner context. | Needs refreshed trace board and runtime acceptance if continuing this module. | IM274-candidate. |
| Review-case write actions | Controlled Local Function | Evidence, conclusion, and closure write paths validated locally. | No approval, permission, batch close, SLA, or production status policy. | Keep single-record local scope. |
| Master-data personnel | True Local Function | Personnel list/detail/create/edit/freeze/skill maintenance local loop exists. | No production RBAC, data isolation, audit. | Defer production governance. |
| Master-data organizations/sites/vendors/skills | Controlled Local Function | Local CRUD/read-only detail loops exist depending entity. | Business object ownership still needs product cleanup before production. | Audit before new breadth expansion. |
| Service team detail | Controlled Local Function | Workplace service-team local nested detail and maintenance exist. | Supplier contract, staffing minimum, charge factors missing. | Block finance/contract scope. |
| Authentication | Missing | No auth boundary in current app. | Production blocker. | Separate auth Gate only. |
| Role permissions | Missing | No RBAC or action authorization. | Production blocker. | Separate permission Gate only. |
| Approval workflow | Missing | Submit-review is local lifecycle, not approval. | Production blocker. | Separate approval Gate only. |
| Export | Missing | No confirmed CSV/Excel/PDF export. | Production and permission risk. | Separate export Gate only. |
| Batch operations | Missing | Single-record actions only. | Rollback/audit/permission risk. | Separate batch Gate only. |
| External integrations | Missing | No real CORN/HR/WFM integration. | Contract, credential, data-quality risk. | Separate integration Gate only. |
| Automatic scheduling | Missing | No scheduling algorithm. | Requires formula/constraint ownership and acceptance strategy. | Planning first, no direct implementation. |
| Production formulas | Blocked Production Capability | Local metrics use simple MVP calculations. | Business formula ownership unconfirmed. | Separate formula Gate only. |
| Settlement / charge factors | Blocked Production Capability | Not implemented. | Finance/product rule ownership unconfirmed. | Do not touch without PM confirmation. |

## 3. Highest-Risk False Signals

| False Signal | Why It Is Risky | Required Correction |
| --- | --- | --- |
| Treating local sample/fallback data as production data | Operators may think the dashboard is live or complete. | Keep visible copy business-safe; document fallback/sample boundaries. |
| Treating submit-review as approval | It has no roles, approvers, audit, SLA, or permission checks. | Always call it local lifecycle, not production approval. |
| Treating comparison calculation as final production formula | Current calculation is local MVP behavior, not signed business formula. | Keep formula work blocked until ownership is confirmed. |
| Treating review-case closure as production case governance | Current closure is local single-case write, not permissioned workflow. | Keep batch/approval/permission out of scope. |
| Treating route existence as feature completeness | Some routes exist but still need runtime acceptance, data-source consistency, or UX hardening. | Check code and behavior before declaring missing or done. |

## 4. Recommended Gap Closure Order

1. Close visible workbench consistency gaps first: schedule plans, risks, unavailability, shift details.
2. Close local write-loop usability gaps next: schedule-plan draft editor and action feedback.
3. Clarify dashboard trend/sample data boundary.
4. Revisit review-case trace board only after the current operational workbench baseline is stable.
5. Start production readiness planning only when PM explicitly opens an auth/permission/approval/export/batch/integration/formula Gate.

## 5. Update Rule

At the end of every non-trivial task:

- Move rows between classifications only when verified behavior changes.
- Add new gaps when acceptance finds a real missing behavior.
- Do not mark a production capability as true merely because a local MVP shell exists.
- Sync changed rows to Feishu when Feishu write is available and confirmed.
