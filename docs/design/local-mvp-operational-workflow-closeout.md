# Local MVP Operational Workflow Closeout

## 1. Executive Summary

After IM250-IM256, the local MVP operational workflow is a complete operator-facing read-and-act loop across four domains: **经营总览 (Dashboard)**, **排班计划 (Schedule Plans)**, **履约风险 (Schedule Risks)**, and **不可用记录 (Unavailability)**. An operator can now:

1. View an aggregated operational overview built from real local schedule plan, risk, and unavailability data.
2. Browse, search, and filter schedule plans by status (draft / review_ready / published).
3. View plan detail with 0.5h interval breakdowns, related risk previews, and overlapping unavailability previews.
4. Submit a draft plan for review, then publish it through lifecycle actions.
5. Browse, search, and filter all fulfillment risks by status and severity from a dedicated list workbench.
6. View risk detail with related shift and unavailability context, then confirm or resolve risks.
7. Browse, search, and filter unavailability records, then resolve them.
8. Navigate between dashboard, plans, shift details, risks, and unavailability through encoded downstream links without known route dead ends.

This is **not production-ready**. It is a locally verifiable operator workbench that demonstrates the planned BPO WFM operational flow using API-first data access with local fallback seed data.

## 2. Completed Workflow Map

### Step 1: Dashboard (经营总览)

| Attribute | Detail |
|---|---|
| Route | `/dashboard` |
| Main user job | See operational health at a glance: plan count, coverage rate, open risks, active unavailability |
| Key data shown | 4 KPI metric cards, time-slot staffing deficit heatmap, anomaly table with drill-down links |
| Available action / drilldown | Anomaly table links to `/schedule-risks/{id}`, `/schedule-plans/{id}`, `/unavailability/{id}` |
| Current limitation | Global filter bar is static (no real filtering). Trend chart uses static data. No date-range or team filtering logic. |

### Step 2: Schedule Plans List (排班计划)

| Attribute | Detail |
|---|---|
| Route | `/schedule-plans` |
| Main user job | Browse all plans, search by plan ID / project / site, filter by status |
| Key data shown | Plan count, forecast agents, scheduled agents, coverage rate; table with date, project, site, status, gap, coverage, version |
| Available action / drilldown | "新建草稿" button → `/schedule-plans/new`; row "查看" → `/schedule-plans/{planId}` |
| Current limitation | Create/edit forms exist, but still need runtime acceptance and richer form hardening before production use. |

### Step 3: Schedule Plan Detail (排班计划详情)

| Attribute | Detail |
|---|---|
| Route | `/schedule-plans/{planId}` |
| Main user job | Review plan intervals, fulfillment health, related risks and unavailability |
| Key data shown | 4 detail cards (status, forecast, scheduled, coverage), interval table (0.5h granularity), fulfillment issue summary, up to 3 risk previews + 3 unavailability previews |
| Available action / drilldown | "提交复核" (draft → review_ready), "发布计划" (review_ready → published); "编辑草稿" (draft only); risk previews → `/schedule-risks/{id}`; unavailability previews → `/unavailability/{id}` |
| Current limitation | Edit draft page exists for draft plans only, but needs runtime acceptance and form validation hardening. Fulfillment preview shows max 3 items each with remaining count. |

### Step 4: Schedule Risks List (履约风险)

| Attribute | Detail |
|---|---|
| Route | `/schedule-risks` |
| Main user job | Browse all risks, search across 8 fields, filter by status and level |
| Key data shown | 4 metric cards (total, open, high, affected unavailability); table with date, interval, project, site, level, status, gap, unavailability impact, reason |
| Available action / drilldown | Row "查看" → `/schedule-risks/{riskId}`; row "计划" → `/schedule-plans/{planId}` |
| Current limitation | No batch confirm/resolve. No export. |

### Step 5: Schedule Risk Detail (履约风险详情)

| Attribute | Detail |
|---|---|
| Route | `/schedule-risks/{riskId}` |
| Main user job | Review risk context with related shifts and unavailability, then confirm or resolve |
| Key data shown | 4 metric cards (status, level, gap, affected unavailability), reason, recommendation, related shift table, related unavailability table |
| Available action / drilldown | "确认风险" (open → confirmed), "处理风险" (open/confirmed → resolved); "计划详情" → `/schedule-plans/{planId}` |
| Current limitation | Actions are server-side POST but depend on backend API availability. No bulk operations. |

### Step 6: Unavailability List (不可用记录)

| Attribute | Detail |
|---|---|
| Route | `/unavailability` |
| Main user job | Browse unavailability records, search by name/team/project/site, filter by status |
| Key data shown | Table with date, time, staff, team, project, site, reason, status, affected intervals; client-side summary |
| Available action / drilldown | Row "影响" → `/unavailability/{unavailabilityId}`; row "班次" → `/shift-details?query={site}` |
| Current limitation | No `ReadinessBanner` on this page (unlike other list pages). No data source messaging. |

### Step 6a: Shift Details (班次明细)

| Attribute | Detail |
|---|---|
| Route | `/shift-details` |
| Main user job | Drill into 0.5h shift-level forecast, scheduled agents, gap, coverage, and notes |
| Key data shown | Filterable shift table, plan status filter, search, 4 metric cards for row count, gap rows, max gap, coverage rate |
| Available action / drilldown | Status filter links, query reset, return to `/schedule-plans` |
| Current limitation | API/fallback source messaging is not aligned with schedule plan and risk pages. No dedicated runtime acceptance evidence in this closeout. |

### Step 7: Unavailability Detail (不可用详情)

| Attribute | Detail |
|---|---|
| Route | `/unavailability/{unavailabilityId}` |
| Main user job | Review unavailability impact on shifts and related risks, then resolve |
| Key data shown | 4 metric cards (status, impacted shifts, related risks, total gap), staff/team/project/site info, impacted shift table, related risk table |
| Available action / drilldown | "标记已处理" (active → resolved); risk links → `/schedule-risks/{id}`; shift links → `/schedule-plans/{planId}` |
| Current limitation | No data source messaging. No `ReadinessBanner`. |

## 3. Page Capability Matrix

| Page | Route | Data Source | Main Capability | Empty/Fallback | Downstream Links | Runtime Acceptance |
|---|---|---|---|---|---|---|
| Dashboard | `/dashboard` | API-first, 3 endpoints, local fallback | Operational overview with KPIs, heatmap, anomalies | ReadinessBanner distinguishes api/fallback/mixed/api_empty; "当前无可展示数据" when empty | Anomaly table → risks, plans, unavailability | ✅ IM252 validated |
| Schedule Plans | `/schedule-plans` | API-first, local fallback | Plan list with search, status filter, metrics | ReadinessBanner; "暂无排班计划数据" / "暂无符合条件的排班计划" | → `/schedule-plans/{id}`, `/schedule-plans/new` | ✅ IM253 validated |
| Plan Detail | `/schedule-plans/{planId}` | API-first, local fallback | Interval table, fulfillment preview, lifecycle actions | 404 for missing; ReadinessBanner; "当前计划暂无关联风险" / "当前计划暂无重叠不可用记录" | → `/schedule-risks/{id}`, `/unavailability/{id}`, `/schedule-risks?query={site}`, `/unavailability?query={site}` | ✅ IM252, IM255 validated |
| Schedule Risks | `/schedule-risks` | API-first, local fallback | Risk list with search, status filter, level filter, metrics | ReadinessBanner; "暂无履约风险数据" / "暂无符合条件的履约风险" | → `/schedule-risks/{id}`, `/schedule-plans/{id}` | ✅ IM256 model tests |
| Risk Detail | `/schedule-risks/{riskId}` | API-first, local fallback | Risk context, related shifts/unavailability, confirm/resolve actions | 404 for missing; "暂无匹配的班次明细" / "当前风险时段暂无重叠的生效中不可用记录" | → `/schedule-plans/{id}`, `/shift-details`, `/unavailability` | ✅ IM252 validated |
| Shift Details | `/shift-details` | API-first through schedule plan helper, local fallback | Shift-level list with search, status filter, metrics | Table-level empty state | → `/schedule-plans` | ⚠️ Needs current runtime acceptance and source messaging |
| Unavailability | `/unavailability` | API-first, local fallback | Unavailability list with search, status filter | "暂无符合条件的不可用记录" (table level only) | → `/unavailability/{id}`, `/shift-details`, `/schedule-plans` | ⚠️ No ReadinessBanner |
| Unavailability Detail | `/unavailability/{unavailabilityId}` | API-first, local fallback | Impact shifts, related risks, resolve action | 404 for missing; "当前不可用时段暂无关联风险提示" / "当前不可用时段暂无匹配班次" | → `/schedule-risks/{id}`, `/schedule-plans/{id}`, `/shift-details` | ⚠️ No ReadinessBanner |

## 4. Supported Actions

### 4.1 Schedule Plan Submit Review

| Attribute | Detail |
|---|---|
| Entry page | `/schedule-plans/{planId}` (draft status only) |
| Server action | `submitReviewAction` in `app/schedule-plans/[planId]/actions.ts` |
| Backend call | `POST /api/v1/schedule-plans/{planId}/submit-review` |
| State transition | `draft` → `review_ready` |
| Feedback query param | `?lifecycle=submit_review_success` or `?lifecycle=submit_review_failed` |
| Current limitation | Depends on backend API. No rollback. No audit trail in UI. |

### 4.2 Schedule Plan Publish

| Attribute | Detail |
|---|---|
| Entry page | `/schedule-plans/{planId}` (review_ready status only) |
| Server action | `publishSchedulePlanAction` in `app/schedule-plans/[planId]/actions.ts` |
| Backend call | `POST /api/v1/schedule-plans/{planId}/publish` |
| State transition | `review_ready` → `published` |
| Feedback query param | `?lifecycle=publish_success` or `?lifecycle=publish_failed` |
| Current limitation | Depends on backend API. No rollback. No notification. |

### 4.3 Schedule Risk Confirm

| Attribute | Detail |
|---|---|
| Entry page | `/schedule-risks/{riskId}` (open status) |
| Server action | `confirmScheduleRiskAction` in `app/schedule-risks/[riskId]/actions.ts` |
| Backend call | `POST /api/v1/schedule-risks/{riskId}/confirm` |
| State transition | `open` → `confirmed` |
| Feedback query param | `?riskAction=confirm_success` or `?riskAction=confirm_failed` |
| Current limitation | Single risk only. No bulk confirm. |

### 4.4 Schedule Risk Resolve

| Attribute | Detail |
|---|---|
| Entry page | `/schedule-risks/{riskId}` (open or confirmed status) |
| Server action | `resolveScheduleRiskAction` in `app/schedule-risks/[riskId]/actions.ts` |
| Backend call | `POST /api/v1/schedule-risks/{riskId}/resolve` |
| State transition | `open`/`confirmed` → `resolved` |
| Feedback query param | `?riskAction=resolve_success` or `?riskAction=resolve_failed` |
| Current limitation | Single risk only. No bulk resolve. |

### 4.5 Unavailability Resolve

| Attribute | Detail |
|---|---|
| Entry page | `/unavailability/{unavailabilityId}` (active status only) |
| Server action | `resolveUnavailabilityAction` in `app/unavailability/[unavailabilityId]/actions.ts` |
| Backend call | `POST /api/v1/unavailability/{unavailabilityId}/resolve` |
| State transition | `active` → `resolved` |
| Feedback query param | `?unavailabilityAction=resolve_success` or `?unavailabilityAction=resolve_failed` |
| Current limitation | Single record only. No bulk resolve. |

## 5. Local MVP Boundaries

This workflow explicitly does **NOT** include:

- **No automatic scheduling** — plans are created externally; the UI only displays and transitions their lifecycle status.
- **No automatic repair** — risks are identified by external computation; the UI only confirms/resolves them.
- **No approval workflow** — plan lifecycle is submit-review → publish, not a multi-role approval chain.
- **No export** — no CSV, Excel, PDF, or print capabilities on any page.
- **No batch operation** — all confirm/resolve/publish actions are single-record only.
- **No permission model** — all pages and actions are accessible without authentication or role checks.
- **No production formula** — coverage rate is `scheduled / forecast`; gap is `forecast - scheduled`. No business-specific calculation engine.
- **No settlement / charge factors** — no billing, pricing, or financial computation of any kind.
- **No external integration** — the only external dependency is the local backend API at `127.0.0.1:8000`. No third-party services, no SSO, no message queues.
- **No production-grade draft editor** — draft create/edit routes exist, but they are still local MVP forms without production validation, permissions, audit trail, or runtime acceptance evidence in this closeout.

## 6. Evidence Summary

### 6.1 Test Coverage

| Test File | Coverage Area |
|---|---|
| `dashboard-operational-model.test.mjs` | Dashboard view model: metric cards, heatmap, anomalies, readiness |
| `dashboard-view-model.test.mjs` | Dashboard view model variants, edge cases |
| `dashboard-anomaly-table-model.test.mjs` | Anomaly filtering, sorting, pagination, entry state routing |
| `dashboard-table-scanability.test.mjs` | Anomaly table search, severity/status filters, summary counts |
| `dashboard-chart-stability.test.mjs` | Chart data stability, dimension handling |
| `dashboard-integration.test.mjs` | Dashboard integration across data sources |
| `dashboard-operational-integration.test.mjs` | End-to-end dashboard data flow |
| `dashboard-risk-unavailability-model.test.mjs` | Risk and unavailability filter/summary used in dashboard context |
| `dashboard-schedule-plan-model.test.mjs` | Plan filter/summary used in dashboard context |
| `dashboard-sync-heatmap-model.test.mjs` | Heatmap summary computation |
| `dashboard-table-model.test.mjs` | Table model helpers |
| `schedule-plan-lifecycle-model.test.mjs` | Plan lifecycle actions, feedback mapping, state transitions |
| `schedule-plan-readiness-model.test.mjs` | Plan list/detail readiness: source messaging, empty states, 404 |
| `schedule-plan-fulfillment-preview-model.test.mjs` | Fulfillment preview: risk/unavailability filtering, preview limits, sorting |
| `schedule-fulfillment-issue-model.test.mjs` | Fulfillment issue summary computation |
| `schedule-plan-legacy-entry-rules.test.mjs` | Ensures no orphaned legacy components remain |
| `schedule-risk-list-workbench-model.test.mjs` | Risk list: query across 8 fields, status/level filters, combined filters, summary, UI structure, forbidden terms |

The local MVP evidence is distributed across the focused suites above. Final completion evidence should use the project gate (`bash scripts/check.sh`) so the report does not understate or overstate the full repository test count.

### 6.2 Runtime Acceptance

`docs/design/operational-runtime-acceptance.md` (IM252, done 2026-06-26) validates:

- `/dashboard` — HTTP 200, readiness message displayed, 4 metric cards with correct initial values (3 plans, 1 published, 10 open risks, 2 active unavailability), heatmap visible with deficit cells, anomaly table with downstream links.
- `/schedule-plans/{planId}` — lifecycle actions: submit review and publish both confirmed with API readback.
- `/schedule-risks/{riskId}` — confirm and resolve actions confirmed with API readback.
- `/unavailability/{unavailabilityId}` — resolve action confirmed with API readback.
- Post-action state: 3 plans (2 published), 8 open risks, 1 active unavailability, 5 anomaly rows.
- UI language boundary: no internal terms (Gate, PM, Harness, Codex) or overclaiming terms (自动排班, 自动修复, 生产实时) found in visible UI text.

### 6.3 Type Safety

- `npm run typecheck` passes cleanly with no errors across all pages, components, and library files.

## 7. Gaps Before Production Readiness

### 7.1 Product Workflow Gaps

| Gap | Impact | Severity |
|---|---|---|
| Draft creation/editing UI needs hardening | Create/edit forms exist, but still need runtime acceptance, stronger validation, and clearer failure handling | Medium |
| No undo/rollback for lifecycle or handling actions | Operator mistakes require manual backend intervention | Medium |
| No audit trail visible in UI | Operators cannot see who performed actions or when | Medium |
| No notification or alerting when risks are created or status changes | Operators must manually check for new risks | Medium |
| Dashboard global filter bar is non-functional | Date range, supplier, team filters are decorative only | Low |
| Dashboard trend chart uses static data | Does not reflect actual plan/risk trends over time | Low |

### 7.2 Data / Integration Gaps

| Gap | Impact | Severity |
|---|---|---|
| Fallback seed data is hardcoded (3 plans, 3 risks, 3 unavailability) | Demo data is limited; real backend may have different shapes | High |
| No data refresh mechanism | Operators must reload pages to see updated data | Medium |
| API failure fallback is silent degradation | Operators may not realize they are viewing stale fallback data on some pages | Medium |
| `/unavailability` pages lack `ReadinessBanner` | Inconsistent data source transparency vs schedule plans and risks | Low |

### 7.3 Permission / Governance Gaps

| Gap | Impact | Severity |
|---|---|---|
| No authentication | Any user can access all pages and perform all actions | Critical for production |
| No role-based access control | No distinction between viewer, operator, and manager roles | Critical for production |
| No action authorization | Lifecycle and handling actions have no permission checks | High |
| No data isolation | All projects, sites, and teams are visible to all users | High |

### 7.4 Runtime / Acceptance Gaps

| Gap | Impact | Severity |
|---|---|---|
| No E2E test automation | Full workflow only validated by manual browser walkthrough (IM252/IM243) | Medium |
| No performance testing | Unknown behavior with large plan/risk datasets | Medium |
| No error boundary testing | Unknown UI behavior on partial API failures mid-page | Low |
| No accessibility audit | ARIA labels exist on heatmap but no formal WCAG compliance check | Low |

### 7.5 UX / Detail Gaps

| Gap | Impact | Severity |
|---|---|---|
| `/shift-details` lacks source messaging and current acceptance evidence | Route exists, but is less transparent than schedule plan/risk pages | Medium |
| `/schedule-plans/new` form needs runtime acceptance | Route exists, but create flow needs browser/API verification in the current branch chain | Medium |
| `/schedule-plans/{id}/edit` form needs runtime acceptance and failure-state polish | Route exists, but draft-only edit behavior needs explicit acceptance evidence | Medium |
| No pagination on risk/unavailability server-side queries | All records loaded at once; may degrade with large datasets | Medium |
| Chart area uses static fallback data | Trend chart does not reflect real operational data | Low |

## 8. Recommended Next Product Blocks

### Block A: Operational Workflow Runtime Acceptance (本地运营链路运行时验收)

| Attribute | Detail |
|---|---|
| Name | 本地运营链路运行时验收 |
| Why it matters | IM250-IM256 added several connected pages and actions. Before building new capability, the current flow needs one browser-backed acceptance pass across dashboard, plan create/edit, shift details, risk handling, and unavailability handling. |
| User-facing outcome | PM can trust the local MVP demo path and know which screens are verified by browser/runtime evidence rather than only model tests. |
| Risk level | Low — QA/documentation-focused, no product code required unless defects are found. |
| Suggested Gate type | QA acceptance Gate. |
| Qoder delegation | Suitable for Qoder as read-only/browser acceptance packet if branch/runtime prerequisites are explicit. |

### Block B: Unavailability Data Source Consistency (不可用记录数据源一致性)

| Attribute | Detail |
|---|---|
| Name | 不可用记录数据源一致性 |
| Why it matters | `/unavailability` and `/unavailability/{id}` are the only pages without `ReadinessBanner` data source messaging, creating an inconsistent operator experience. |
| User-facing outcome | Operators see the same data source transparency on unavailability pages as on schedule plans and risks. |
| Risk level | Low — small scope, follows established ReadinessBanner pattern, no new data sources. |
| Suggested Gate type | Small maintenance Gate, could be bundled with Block A. |
| Qoder delegation | Suitable for Qoder — mechanical pattern application. |

### Block C: Draft Create/Edit Hardening (排班草稿创建与编辑强化)

| Attribute | Detail |
|---|---|
| Name | 排班草稿创建与编辑强化 |
| Why it matters | Create/edit routes already exist, so the next useful work is not building them from zero but validating and hardening the actual form flow, failure states, and source messaging. |
| User-facing outcome | Operators can create or edit a draft with clearer validation and reliable post-submit feedback before submitting it for review. |
| Risk level | Medium — touches server actions, API client paths, form validation, and runtime behavior. |
| Suggested Gate type | Standard implementation Gate after Block A acceptance identifies concrete issues. |
| Qoder delegation | Partially suitable for Qoder only after Codex defines exact validation rules and allowed files. |

## 9. Stop Conditions

The following must **stop** future implementation without PM confirmation:

1. **Real external data sources or integrations** — connecting to production APIs, third-party services, or message queues.
2. **Database persistence expansion** — new tables, ORM models, migrations, or schema changes beyond the existing PM-confirmed database Gate.
3. **Authentication or permission boundaries** — login, SSO, role-based access, or data isolation.
4. **Approval workflow** — multi-step approval chains, delegation, or escalation.
5. **Export capabilities** — CSV, Excel, PDF, print, or any data export mechanism.
6. **Batch operations** — bulk confirm, bulk resolve, bulk publish, or any multi-record action.
7. **Production formulas, settlement rules, or charge factors** — any business calculation beyond the current `coverage_rate = scheduled / forecast`.
8. **New dependencies or package changes** — adding libraries, frameworks, or tools not already in the project.
9. **Destructive or ambiguous Git/file operations** — rebasing, force-pushing, or modifying files outside confirmed scope.
10. **Failed final verification** — any task where `bash scripts/check.sh` does not pass.

## 10. Qoder Notes

- This was a read-only closeout review. No product code was changed.
- No `docs/current/**` or `docs/registry/**` Harness files were changed.
- The only new file is this document: `docs/design/local-mvp-operational-workflow-closeout.md`.
- No commit.
- No push.
