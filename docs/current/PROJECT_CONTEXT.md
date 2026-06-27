# Current Project Context

## Current Stage

Frontend dashboard scaffold + local scheduling-plan MVP vertical + state-governed Lightweight Harness + controlled database Gate + import center API vertical.

## Active Boundary

The project has entered a PM-confirmed database Gate. Database work may continue only through small, confirmed tasks. Implemented database slices cover local import batches, master data, personnel schedules, demand forecasts, login/status logs, comparison results, review closure records, import-center CSV upload/readiness/apply routes, persisted comparison/review queries, and related read-only frontend workbench flows.

The active product boundary remains local MVP and operator-facing workflow scaffolding. Permissions, approval, export, batch operations, external integrations, automatic scheduling, production formulas, settlement rules, and charge factors remain out of scope unless a new task explicitly confirms them.

## Current Queue

No executable story is currently queued. IM266 corrected the dashboard information hierarchy regression left by IM263: `/dashboard` no longer renders a top-level filter console above KPI cards. URL-driven project/site/plan-status filtering remains available for deep links, but the default page now prioritizes readiness messaging, KPI cards, chart, heatmap, and anomaly review instead of exposing a button wall. The next implementation should not assume missing routes without checking the current codebase; `/shift-details`, `/schedule-plans/new`, and `/schedule-plans/[planId]/edit` already exist and should be treated as acceptance/hardening candidates, not greenfield missing pages.

IM240 completed the PM-confirmed review-case live runtime smoke on the current branch using an isolated `.local/im240-runtime-smoke.db` runtime artifact. The smoke used backend `127.0.0.1:8000` and frontend `127.0.0.1:3002` because the existing `3000` BPO Next dev process was stale and unresponsive. It did not add product features or modify business UI/backend implementation beyond acceptance traceability.

IM241 completed the review-case write-action runtime smoke using `BPO_DATABASE_URL` and an isolated `.local/im241-review-case-action-smoke.db` database. It did not add new product behavior, implementation code, schema/migration, dependencies, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors.

IM242 completed the review-case form-click E2E feasibility decision. Current `qa` scope will not add Playwright or other browser automation dependencies; the remaining server-action submit glue is treated as low risk and should be covered by IM241 HTTP smoke plus PM manual browser walkthrough if PM wants final human acceptance evidence.

IM243 completed the PM-confirmed manual browser walkthrough for that remaining glue. It used `BPO_DATABASE_URL` and isolated `.local/im243-review-case-form-click-smoke.db`, ran only local backend/frontend runtimes, and recorded evidence without changing product UI, backend implementation, scripts, dependencies, or package/lockfiles.

## Recent State Summary

- The current integration branch combines the compact Harness state-governance pass with the review-case processing-path branch so future work can start from one baseline.
- The latest product work added operator-facing review-case processing paths without exposing Codex/Gate/PM acceptance language in product pages.
- IM240 has live-smoked the review-case list/detail, four processing-stage filters, and three URL feedback states against the IM239 stage matrix seed. IM241 extended that evidence to the existing evidence/conclusion/closure write endpoints without changing implementation code.
- IM242 decided not to automate form-click E2E inside the current `qa` gate because the repo has no Playwright infrastructure and adding one would require a separate dependency Gate.
- IM243 completed the final manual browser path for the three review-case write forms: evidence, conclusion, and closure.
- IM244 completed a documentation-only QA closeout so the review-case acceptance block can be handed off without overstating production readiness.
- IM245 completed the PR readiness decision: split review into three stacked PRs before continuing with new product development on top of the branch.
- IM246 completed the comparison-run review-case loop: explicit related-case counts, open-first/high-risk ordering, strengthened review tab expression, and expanded model coverage, without adding backend APIs, persistence, dependencies, permissions, approval, export, batch operations, production formulas, settlement rules, or charge factors.
- IM247 completed review-case source tracing to original import batches using existing source_trace version fields and existing import-center batch route helpers.
- IM248 completed the local MVP schedule plan lifecycle: backend lifecycle endpoints, frontend detail-page actions, feedback handling, and focused coverage for `draft -> review_ready -> published`.
- IM249 completed local MVP fulfillment issue handling: schedule risk confirmation/resolution, unavailability resolution, detail-page feedback actions, and schedule-plan detail summaries for related risk/unavailability handling state.
- IM250 completed dashboard real-data linkage: `/dashboard` now builds its operating summary from existing local schedule plan, schedule risk, and unavailability data clients while preserving static fallbacks and existing table interactions.
- IM251 completed dashboard operational readiness: `/dashboard` now distinguishes API data, empty API data, fallback data, and mixed source states; it shows operator-facing readiness messaging and stable empty states without claiming production real-time behavior.
- IM252 completed runtime acceptance for the local operational workflow: `/dashboard`, schedule plan lifecycle, schedule risk handling, and unavailability handling were browser-checked on local runtime with API readback evidence and no visible internal terminology leaks.
- IM253 completed schedule-plan list/detail readiness: `/schedule-plans` and `/schedule-plans/[planId]` now expose operator-facing data-source messaging, distinguish source empty from filtered empty states, preserve 404 behavior, and add read-only downstream entries to related risks and unavailability records.
- IM254 completed dashboard visual polish: the chart area now has stable Recharts initial dimensions without forcing narrow-screen overflow, and the anomaly table now defaults to review-priority ordering with filtered summary counts for high severity, pending review, and drillable rows.
- IM255 completed schedule-plan fulfillment preview: `/schedule-plans/[planId]` now shows bounded previews for related schedule risks and overlapping unavailability records using existing local data, encoded detail links, explicit empty states, and no automatic recalculation behavior.
- IM256 completed schedule-risk list workbench: `/schedule-risks` now provides the missing operator list between dashboard/schedule-plan previews and risk detail pages, with search, status/level filters, summary cards, encoded risk/plan links, data-source messaging, and empty-state distinction.
- IM257 completed the local MVP operational workflow closeout. Codex corrected Qoder's initial closeout findings where already-existing routes (`/shift-details`, `/schedule-plans/new`, `/schedule-plans/[planId]/edit`) had been incorrectly described as missing; the current remaining gaps are runtime acceptance, data-source consistency, and draft-form hardening rather than route creation from zero.
- IM258 completed local MVP runtime acceptance on the IM257 baseline. Qoder violated the no-commit/no-push instruction, but Codex reviewed the pushed branch and corrected the evidence document. Runtime acceptance confirmed the corrected IM257 baseline and added one consistency gap: `/schedule-risks/[riskId]` also lacks data-source messaging.
- IM259 completed operational source consistency: `/schedule-risks/[riskId]`, `/unavailability`, `/unavailability/[unavailabilityId]`, and `/shift-details` now use result-style readers and `ReadinessBanner`; Codex also tightened list empty-state wording for source-empty vs filtered-empty cases.
- IM260 completed schedule-plan draft hardening: create/edit draft flows now use explicit draft feedback, encoded redirect targets, dynamic interval counts, 0-preserving numeric parsing, edit-page data-source messaging, and non-draft edit blockers.
- IM261 completed browser acceptance documentation for IM259-IM260. IM259 source banners passed; IM260 visible feedback and non-draft blockers passed; real create-submit and draft edit-submit flows remain observations because the runtime did not provide a draft plan or recorded newly created draft ID.
- IM262 completed schedule-plan draft workflow UI closeout: new/edit pages now share a single draft form component and show a save-before-review draft summary with non-negative gap totals. Real create-submit and draft edit-submit browser chains remain observations until a runtime draft plan is available.
- IM263 completed dashboard operational filter console: dashboard global filters are now URL-driven and limited to project, site, and plan status. Codex corrected the initial over-scoped implementation that mixed table-level filters into the dashboard header; risk level and issue status remain anomaly-table controls, while dashboard cards, heatmap, and anomaly rows share one global view-model filter.
- IM264 completed dashboard drilldown consistency: dashboard metric cards now link to schedule plans, shift details, open schedule risks, and active unavailability; the heatmap now links once to shift details. Compatible filter context is carried through existing query/status parameters, while anomaly-table links stay unchanged and no extra dashboard-level filters were added.
- IM265 completed dashboard and draft workflow acceptance: dashboard filter/drilldown behavior was verified in the browser; draft create/edit server-action POST paths returned the expected 303 redirects and feedback pages rendered correctly. Codex also moved draft form action binding to the page level to make the create/edit submit chain more explicit and stable.
- IM266 corrected the dashboard UI hierarchy after PM review: the top-level dashboard filter console was removed from the default page, the deleted `GlobalFilterBar` is now covered by a regression test that prevents reintroducing a filter console above KPI cards, and filtered deep-link state is shown only as a compact current-scope strip when URL filters are already active.
- Harness state optimization is now the active maintenance concern: current context must stay compact, default reads must use the current layer, and history must be queried on demand through registry/legacy references.

## Current Execution Rules

- Read current files by default, not historical archive files.
- Treat `docs/current/**` as the execution queue source.
- Treat `docs/registry/**` as lookup indexes only.
- Do not execute from archive files.
- Keep subagents read-only for `docs/current/**` and `docs/registry/**`; the main Worker is the single writer.
- Keep old large files as historical sources during the transition.
- Run `bash scripts/check-state.sh` for state changes.
- `bash scripts/check.sh` runs strict state checks by default.
- Run `bash scripts/check.sh` before reporting a task complete.

## Current Stop Conditions

- Real external data sources or integrations.
- Database QA closeout or additional persistence unless a matching task is active.
- Unconfirmed new dependencies or package/lockfile changes.
- Authentication or permission boundaries.
- Approval, export, batch-operation, automatic scheduling, or production workflow capabilities.
- Production status-code, formula, settlement-rule, or charge-factor changes.
- Destructive or ambiguous Git/file operations.
- Failed final verification.

## Current Recommendation

Recommended next medium-sized candidates are: (1) schedule-plan interval editing usability improvements if the current dense row editor is not enough, (2) schedule-plan draft lifecycle browser acceptance after submitting the created draft for review, or (3) dashboard trend data definition if PM wants to replace the current local sample trend boundary. Do not add another dashboard top-level filter console, claim production readiness, install E2E dependencies, or expand into permissions, approval, export, batch operations, formulas, settlement rules, or charge factors unless a new task is defined.
