# Branch Log

## 2026-05-22

### F238-F240-Q039 Product Semantics Cleanup

- branch_name: `codex/f238-product-semantics-cleanup`
- base_main_commit: `c93f098`
- remote_status: `new stacked local branch from verified supervisor follow-up summary HEAD; not pushed`
- scope: frontend product semantics and QA closeout: remove visible local-MVP wording, task IDs, read-only process labels, sidebar new/priority tags, sample-language labels, and strengthen UI copy regression tests.
- allowed_files_check: `app/**`, `components/app-sidebar.tsx`, `components/schedule-plan-table.tsx`, `scripts/tests/product-ui-copy-audit.test.mjs`, `scripts/tests/product-navigation-business-only.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing page/sidebar copy and UI copy tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no dependency, no backend, no package or lockfile change.
- check_result: red product UI copy/navigation tests first caught local-MVP wording, F007, read-only label, sample anomaly copy, and sidebar tags; target tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F235-F237-Q038 Supervisor Followup Summary Readonly

- branch_name: `codex/f235-supervisor-followup-summary`
- base_main_commit: `33e36e6`
- remote_status: `new stacked local branch from verified data-quality repair-prep HEAD; not pushed`
- scope: frontend local business function and QA closeout: add supervisor follow-up status, follow-up gap lists, group follow-up rollups, and business-language verification to the fulfillment calendar exception queue.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar page/model/tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `person-timeline` target test first caught missing supervisor follow-up fields; target tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

## 2026-05-21

### F232-F234-Q037 Data Quality Repair Prep Readonly

- branch_name: `codex/f232-data-quality-repair-prep`
- base_main_commit: `e27f7a6`
- remote_status: `new stacked local branch from verified supervisor handoff readout HEAD; not pushed`
- scope: frontend local business function and QA closeout: add data-owner intervention judgment, repair preparation materials, data-quality impact scope, and business-language verification to the fulfillment calendar exception queue.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar page/model/tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `person-timeline` target test first caught missing data-quality repair-prep fields; target tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F229-F231-Q036 Supervisor Handoff Readonly

- branch_name: `codex/f229-supervisor-handoff-readonly`
- base_main_commit: `be1847e`
- remote_status: `new stacked local branch from verified supervisor handling readout HEAD; not pushed`
- scope: frontend local business function and QA closeout: add supervisor handling outcome categories, handoff summaries, data-check readiness hints, and business-language verification to the fulfillment calendar exception queue.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar page/model/tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `person-timeline` target test first caught missing handling outcome fields; target tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F226-F228-Q035 Supervisor Handling Readonly

- branch_name: `codex/f226-supervisor-handling-readonly`
- base_main_commit: `4dd8463`
- remote_status: `new stacked local branch from verified master-data relationship closure HEAD; not pushed`
- scope: frontend local business function and QA closeout: add supervisor handling suggestions, three-track evidence summaries, read-only handling records, and business-language verification to the fulfillment calendar exception queue.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar page/model/tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `person-timeline` target test first caught missing handling guide fields; target tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F221-F225-Q034 Master Data Relationship Closure

- branch_name: `codex/f221-master-data-relations-closure`
- base_main_commit: `5cb27cd`
- remote_status: `new stacked local branch from verified import quality traceability HEAD; not pushed`
- scope: frontend local business function and QA closeout: add employee-level master-data bindings, anomaly/data-quality reverse lookup to employee binding, shift type meal/rest/counting policy display, binding validity/status display, and master-data relationship QA.
- allowed_files_check: `app/master-data-relations/**`, `app/anomaly-review/**`, `app/data-quality/**`, `app/shift-types/**`, `lib/**`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing master-data, anomaly review, data-quality, and shift-type pages/models/tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red target tests first caught missing employee binding helpers, reverse lookup fields, data-quality target, and shift counting fields; target tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F216-F220-Q033 Import Quality Traceability

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `91f5700`
- remote_status: `continued on existing branch; branch already had four local commits ahead of origin when this batch started`
- scope: frontend local business function and QA closeout: connect import batch details to related data quality issues, expose source template/source field/original value/error code/affected objects/impact links, group issues by business reason, show failure-row business impact summaries, and close import quality traceability QA.
- allowed_files_check: `app/import-batches/**`, `app/data-quality/**`, `lib/**`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing import batch and data quality pages, local import/data-quality models/tests, current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red import/data-quality target tests first caught missing batch issue resolver, source-template fields, and impact chain fields; target import/data-quality tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F211-F215 Demand Supply Alignment

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `46def95`
- remote_status: `continued on existing branch; branch already had three local commits ahead of origin when this batch started`
- scope: frontend local business function and QA closeout: add demand forecast dimensions, forecast-vs-schedule shortage/overstaff comparison, unmatched skill warnings, forecast/schedule version explanation, and schedule personnel detail drilldown.
- allowed_files_check: `app/demand-plans/**`, `app/schedule-plans/**`, `lib/**`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing demand plan page, local schedule-plan model/tests, current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `demand-supply-alignment` tests first caught missing alignment helper; target demand tests, product UI copy/navigation tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F206-F208 Schedule Personnel Trace

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `2ef241b`
- remote_status: `continued on existing branch after Q030 local closeout; Q030 local commit was not pushed yet when this batch started`
- scope: frontend local business function: show personnel-level schedule detail, required business fields, anomaly labels, and 0.5h interval-to-person trace from schedule plan and shift detail pages.
- allowed_files_check: `app/schedule-plans/**`, `app/shift-details/**`, `lib/**`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing schedule plan detail page, existing shift detail page, local personnel schedule model/tests, current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `personnel-schedule-details` tests first caught missing interval trace helper; target personnel tests, product UI copy/navigation tests, lint, typecheck, and in-app browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F209-F210-Q031 Schedule Personnel Drilldown And Gap QA

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `f5f4ec4`
- remote_status: `continued on existing schedule personnel branch; branch already had two local commits ahead of origin when this batch started`
- scope: frontend local business function and QA closeout: add personnel schedule drilldown links to fulfillment calendar context, show gap-related people and shifts on schedule plan and risk detail pages, and close the personnel trace QA slice.
- allowed_files_check: `app/schedule-plans/**`, `app/person-timeline/**`, `app/schedule-risks/**`, `lib/**`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing schedule plan detail page, existing risk detail page, local personnel schedule model/tests, current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `personnel-schedule-details` tests first caught missing gap explanation helper; target personnel tests, product UI copy/navigation tests, lint, typecheck, and browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### Q030 Fulfillment Supervisor Flow QA

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `23537e9`
- remote_status: `continued on existing fulfillment supervisor branch to close the supervisor-flow QA slice`
- scope: QA acceptance only: verify fulfillment calendar supervisor drilldown, queue cursor, sort reason, three-track evidence, personal detail return context, and product UI business language; update current state, legacy story/task status, task log, branch log, and audit report.
- allowed_files_check: `docs/**` and `tasks/backlog.yaml`; no product code, frontend implementation, backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates current state closeout and traceability docs only; no `app/**`, `components/**`, `lib/**`, backend, package, or lockfile changes.
- check_result: target fulfillment and product semantic tests passed; full internal-copy scan over `app` and `components` found no banned UI terms; in-app browser smoke passed for team week, group week, member week matrix, selected exception queue, personal detail, and return URL context; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F204-F205 Fulfillment Queue Sort And Return Context

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `5ebe492`
- remote_status: `continued on existing fulfillment supervisor branch because this batch completes the same supervisor queue flow`
- scope: frontend local business function: show queue sort reasons in the fulfillment exception queue and preserve queue/exception return context from personal detail pages.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar page/detail page/model/tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `person-timeline` test first caught missing return-context URL helpers; target tests, product UI copy/navigation tests, lint, typecheck, and in-app browser smoke passed before traceability closeout; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F201-F203 Fulfillment Supervisor Risk Evidence

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `190e626`
- remote_status: `continued on existing fulfillment supervisor branch because this batch extends the same business chain without new routes or backend scope`
- scope: frontend local business function: add group-week risk summary, group member week watchlist, and selected exception three-track evidence cards in fulfillment calendar supervisor flow.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar page/model/tests plus current state closeout, legacy story/task status, and traceability docs only; no new route, no sidebar entry, no backend, no package or lockfile change.
- check_result: red `person-timeline` tests first caught missing risk summary, watchlist, and evidence cards; target tests passed after implementation; in-app browser smoke passed for group week, group member week, and selected exception evidence pages with no banned internal UI terms; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed after traceability closeout.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### Q029 Business UI Cleanup QA

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `9253f6e`
- remote_status: `continued on existing business UI cleanup branch to close the module QA slice`
- scope: QA acceptance only: verify dashboard, sidebar, and product UI copy after F196-F200; update current state, legacy story/task status, task log, branch log, and audit report.
- allowed_files_check: `docs/**` and `tasks/backlog.yaml`; no product code, frontend implementation, backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates current state closeout and traceability docs only; no `app/**`, `components/**`, `lib/**`, backend, package, or lockfile changes.
- check_result: target product semantic tests passed; full internal-copy scan over `app` and `components` found no banned UI terms; in-app browser smoke for `/dashboard` and expanded sidebar passed; final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` to be rerun after this log update.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F199-F200 Dashboard Business Drilldown And Risk Summary

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `621eb54`
- remote_status: `continued on existing business UI cleanup branch because this batch extends the cleaned dashboard into real business drilldown`
- scope: frontend local business function: add dashboard metric drilldown links to fulfillment calendar, anomaly review, and data quality; add a dashboard fulfillment risk summary for today and this week; add dashboard regression tests for drilldown and risk summary.
- allowed_files_check: `app/dashboard/**`, `components/section-cards.tsx`, `scripts/tests/dashboard-business-only.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing dashboard data/page/card rendering, dashboard business-only tests, current state closeout, legacy story/task status, and traceability docs only; no new route, no new page, no sidebar placeholder, no backend, no package or lockfile change.
- check_result: red tests first caught missing metric drilldown and risk summary; target tests passed after implementation; in-app browser smoke for `/dashboard` passed; `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed before traceability closeout and will be rerun after this log update.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F196-F198 Business UI Cleanup

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `df32bc8`
- remote_status: `continued on existing branch because this batch is the first planned business UI cleanup slice from the confirmed large module pool`
- scope: frontend local business function and UI-copy QA: clean `/dashboard` metric language, remove sidebar dashboard placeholder entries, remove visible internal/process copy, and add regression coverage for the product UI copy and navigation contract.
- allowed_files_check: `app/dashboard/**`, `components/app-sidebar.tsx`, `components/data-sync-status.tsx`, `components/data-table.tsx`, `scripts/tests/dashboard-business-only.test.mjs`, `scripts/tests/product-navigation-business-only.test.mjs`, `scripts/tests/product-ui-copy-audit.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing dashboard data/table copy, existing sidebar nav definitions, one dormant data-status component title, regression tests, current state closeout, and traceability docs only; no new route, no new page, no backend, no package or lockfile change.
- check_result: target red-green tests passed after implementation; in-app browser smoke for `/dashboard` passed after expanding sidebar groups; `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh` passed before traceability closeout and will be rerun after this log update.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### H031 Large Module Iteration Pool

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `705ca45`
- remote_status: `continued on the existing supervisor handling branch because this batch is Harness/state planning only and prepares the next coherent product iteration pool`
- scope: Harness state hygiene and planning only: repair stale legacy done/ready drift, register 36 planned business stories and their backlog/trace mappings, and keep current queue plus active tasks empty.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/raw-requirements.md`, `docs/user-stories.md`, `tasks/backlog.yaml`, `docs/task-log.md`, `docs/dev/branch-log.md`, `docs/audit-report.md`, and `docs/superpowers/plans/**`; no product code, frontend routes/components, backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates Harness planning, traceability, registry, and branch/audit records only; `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml` remain unchanged and empty after closeout.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

## 2026-05-18

### H029 Production MVP PRD

- branch_name: `codex/production-mvp-prd`
- base_main_commit: `a3a134c`
- remote_status: `main` was up to date with local `origin/main` before branch creation.
- scope: documentation-only production MVP PRD and minimal Harness traceability records.
- allowed_files_check: `docs/production-mvp-prd.md`, `docs/PROJECT_STATE.md`, `docs/task-log.md`, `docs/audit-report.md`, and `docs/dev/branch-log.md`; no current queue, frontend, backend, package, lockfile, database, permission, approval, export, batch, real integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `docs/production-mvp-prd.md`, `docs/PROJECT_STATE.md`, `docs/task-log.md`, `docs/audit-report.md`, and `docs/dev/branch-log.md`; no current queue, frontend, backend, package, lockfile, database, permission, approval, export, batch, real integration, production formula, settlement, or charge-factor files.
- check_result: `git diff --check` passed; `bash scripts/check-state.sh --strict` passed; `bash scripts/check.sh` passed after clearing ignored `.next` generated cache and rerunning with network access for Next font fetch.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H030 Production MVP First Batch Seeding

- branch_name: `codex/production-mvp-prd`
- base_main_commit: `a3a134c`
- remote_status: `codex/production-mvp-prd` pushed to origin before H030 continuation.
- scope: arrange production MVP first-batch raw requirements, user stories, backlog entries, current ready queue, active task contracts, TRACE_INDEX pointers, and traceability logs only.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/raw-requirements.md`, `docs/user-stories.md`, `tasks/backlog.yaml`, `docs/task-log.md`, `docs/audit-report.md`, and `docs/dev/branch-log.md`; no frontend, backend, package, lockfile, database, permission, approval, export, batch, real integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `docs/current/PROJECT_CONTEXT.md`, `docs/current/STORY_QUEUE.yaml`, `docs/current/ACTIVE_TASKS.yaml`, `docs/registry/TRACE_INDEX.yaml`, `docs/raw-requirements.md`, `docs/user-stories.md`, `tasks/backlog.yaml`, `docs/task-log.md`, `docs/audit-report.md`, and `docs/dev/branch-log.md`; no frontend, backend, package, lockfile, database, permission, approval, export, batch, real integration, production formula, settlement, or charge-factor files.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing; push after verified coherent block`
- blocked_reason: `N/A`

### B006 Master Data Import Contract

- branch_name: `codex/production-mvp-first-batch`
- base_main_commit: `5f391a2`
- remote_status: `local branch created from H030 production MVP first-batch seed commit`.
- scope: local backend contract endpoint, model/repository contract data, backend unittest, current queue cleanup, and traceability records for master-data import contract only.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/repository.py`, `backend/tests/test_schedule_plans.py`, `docs/current/**`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no package, lockfile, database, real integration, permission, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/repository.py`, `backend/tests/test_schedule_plans.py`, `docs/current/PROJECT_CONTEXT.md`, `docs/current/STORY_QUEUE.yaml`, `docs/current/ACTIVE_TASKS.yaml`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no package, lockfile, database, real integration, permission, approval, export, batch, production formula, settlement, or charge-factor files.
- check_result: `python -m unittest ...test_master_data_import_contract...` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `python -m unittest discover -s backend/tests -v` passed with 21 tests; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing; push after verified coherent block`
- blocked_reason: `N/A`

### B007 Personnel Schedule Import Contract

- branch_name: `codex/production-mvp-first-batch`
- base_main_commit: `f6ebf22`
- remote_status: `local continuation on production MVP first-batch branch`.
- scope: local backend contract endpoint, model/repository contract data, backend unittest, current queue cleanup, and traceability records for personnel schedule import and 0.5h interval expansion contract only.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/repository.py`, `backend/tests/test_schedule_plans.py`, `docs/current/**`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/repository.py`, `backend/tests/test_schedule_plans.py`, `docs/current/PROJECT_CONTEXT.md`, `docs/current/STORY_QUEUE.yaml`, `docs/current/ACTIVE_TASKS.yaml`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement, or charge-factor files.
- check_result: `python -m unittest ...test_personnel_schedule_import_contract...` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `python -m unittest discover -s backend/tests -v` passed with 23 tests; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing; push after verified coherent block`
- blocked_reason: `N/A`

### B008 Fulfillment Comparison Contract

- branch_name: `codex/production-mvp-first-batch`
- base_main_commit: `64388bc`
- remote_status: `local continuation on production MVP first-batch branch`.
- scope: local backend contract endpoint, model/repository contract data, backend unittest, current queue cleanup, and traceability records for forecast/schedule/login/status comparison contract only.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/repository.py`, `backend/tests/test_schedule_plans.py`, `docs/current/**`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/repository.py`, `backend/tests/test_schedule_plans.py`, `docs/current/PROJECT_CONTEXT.md`, `docs/current/STORY_QUEUE.yaml`, `docs/current/ACTIVE_TASKS.yaml`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement, or charge-factor files.
- check_result: `python -m unittest ...test_fulfillment_comparison_contract...` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `python -m unittest discover -s backend/tests -v` passed with 25 tests; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing; push after verified coherent block`
- blocked_reason: `N/A`

### F061-F063/Q016 Production MVP Contract Demo Batch

- branch_name: `codex/production-mvp-contract-demo`
- base_main_commit: `fc71b28`
- remote_status: `local branch created from pushed production MVP first-batch head`.
- scope: current queue seeding for frontend contract client, contract page, sidebar entry, and QA closeout.
- allowed_files_check: `app/**`, `components/**`, `lib/**`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `lib/production-mvp-contracts.ts`, `app/production-mvp/page.tsx`, `components/app-sidebar.tsx`, `scripts/tests/production-mvp-contracts.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, or production formula files.
- check_result: `node --experimental-strip-types --test scripts/tests/production-mvp-contracts.test.mjs` passed with 2 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing; push after verified coherent block`
- blocked_reason: `N/A`

## 2026-05-10

### Clean Harness Initialization

- Archived the previous project workspace to `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`.
- Created a clean project root at `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform/`.
- Initialized minimal Harness files only.
- No business code, frontend page, backend service, mock data, dependency, package file, or lockfile was added.

### Frontend Rules Added

- Added shadcn/ui-based frontend design and development rules to `AGENTS.md`.
- Recorded the frontend direction in `docs/PROJECT_STATE.md`: professional B2B SaaS admin console, shadcn dashboard baseline, New York style, and dark / light theme support.
- Added backlog item `H002` for this documentation-only Harness rule update.
- No business code, frontend page, mock data, dependency, package file, or lockfile was added.

## 2026-05-11

### Lightweight Harness Documentation Upgrade

- Added backlog item `H003` for the documentation-first Lightweight Harness upgrade.
- Added `docs/harness/lightweight-harness.md` to define the project flow from raw requirement to user story, DAG/dependency check, Gate Plan, scoped execution, Done Report, and audit.
- Added raw requirement, user-story, task-log, decision-log, audit-report, and Subagent prompt template document entries.
- Recorded that charting remains a future PM-confirmed decision and must not default to Recharts.
- No business code, frontend page, backend service, mock data, dependency, package file, or lockfile was added by this task.

### Directory Audit And Skill Mapping

- Audited the current project directory and found untracked frontend engineering files that conflict with the clean Harness state.
- Noted that the untracked frontend files include BPO/CORN mock data and a `recharts` dependency, which need a separate PM decision.
- Replaced placeholder prompt skills such as `user_story`, `dag_scheduler`, `code_generation`, `ui_design`, and `testing` with current Codex skill names.
- Recorded the mismatch and recommended a separate clean Harness deviation handling Gate.

### F001 shadcn Dashboard Static Prototype

- Added backlog item `F001` for the PM-confirmed static frontend dashboard scaffold.
- Implemented the BPO WFM dashboard using a shadcn dashboard-style component structure: `AppSidebar`, `SiteHeader`, `SectionCards`, `ChartAreaInteractive`, `DataTable`, `BpoHeatmap`, `DataSyncStatus`, and `ThemeToggle`.
- Added local mock data for BPO WFM metrics, fulfillment trends, time-slot staffing gaps, anomaly rows, and data sync status.
- Updated `docs/PROJECT_STATE.md` to move the project from clean Harness initialization to frontend dashboard scaffold.
- Updated `scripts/check.sh` so the Harness check validates the confirmed frontend scaffold instead of rejecting package and app files.
- No backend service, real Excel import, real CORN API, database, authentication, permission system, export pipeline, intelligent scheduling algorithm, or lab archive migration was added.
- Verified the dashboard with local browser QA in dark mode, light mode, and a narrow mobile viewport.
- Reinstalled frontend dependencies with Homebrew `node@22` after the previous Node binary caused native package code-signing failures on macOS.
- Removed the Recharts development-time container warning by loading the trend chart client-side only.
- Marked backlog item `F001` as done after lint, typecheck, build, and Harness check passed.

### F002 Sidebar Navigation Refinement

- Added backlog item `F002` for PM-observed sidebar navigation refinements.
- Removed second-level sidebar icons to reduce visual noise while keeping first-level lucide icons.
- Added desktop sidebar collapse / expand behavior with a narrow icon rail state.
- Changed default first-level behavior so only the current group is expanded initially; other groups are collapsed and clickable.
- Updated `docs/PROJECT_STATE.md` with the current navigation decision so it overrides the earlier F001 two-level-icon requirement.

### F003 Sidebar Official-Ratio And Scroll Fixes

- Added backlog item `F003` for PM-observed sidebar proportion and behavior fixes.
- Reduced first-level sidebar item height and font size to better match the shadcn dashboard sidebar rhythm.
- Moved the sidebar collapse / expand trigger from the sidebar brand area into `SiteHeader`.
- Lifted sidebar collapsed state into the dashboard page shell so content and sidebar react together.
- Changed the page shell to fixed viewport height with independent main-content scrolling, so the sidebar no longer moves with page scroll.
- Prevented page-level horizontal scrolling and kept table overflow inside the table card.

### F004 Official Icon Alignment

- Added backlog item `F004` for dashboard brand and theme icon alignment.
- Replaced the theme toggle glyph with the exact PM-provided official dashboard SVG path: circle, vertical split, and three diagonal strokes.
- Replaced the sidebar brand mark with the same official glyph path so the top-left identity matches the reference icon shape.
- No new icon dependency was added; the SVG path is embedded locally to avoid package churn.

### Subagent Prompt Contract

- Added `docs/prompts/README.md` with the required dispatch packet, structured return format, universal stop conditions, and review chain.
- Reworked PM, UI/UX, Frontend, Backend, QA, and Doc Agent prompts into explicit contracts with inputs, outputs, rules, and stop conditions.
- Added generic Implementer, Spec Reviewer, and Code Quality Reviewer prompt contracts for future implementation workflows.
- Recorded the original conservative subagent rule, which was later superseded by H010 Story Runner Mode for continuous story delivery.

### shadcn Skill Assignment

- Added backlog item `H005` for mapping `/Users/mac/.codex/skills/shadcn/SKILL.md` into the Subagent Prompt Contract.
- Assigned the shadcn skill to UI/UX Agent, Frontend Agent, Implementer, and Code Quality Reviewer for shadcn-specific frontend work.
- Recorded QA Agent as a secondary/reference user for UI acceptance checks only.
- Recorded that PM, Backend, and Doc Agent do not use the shadcn skill by default.
- Clarified that the skill does not authorize shadcn CLI writes, preset changes, dependency installation, package changes, or component overwrites without a confirmed Gate.

### H006 Pre-Coding Harness Closure

- Added backlog item `H006` for pre-coding Harness closure.
- Aligned `AGENTS.md` with the current frontend dashboard scaffold stage.
- Added F001 traceability into `docs/raw-requirements.md` and `docs/user-stories.md`.
- Added `docs/prompts/file_ownership_matrix.md` and sample dispatch packets under `docs/prompts/examples/`.
- Formalized the F001-only Recharts exception in `docs/decision-log.md`.
- Strengthened `scripts/check.sh` so frontend toolchain gaps are surfaced before coding claims are made.

### H007 Development Environment Hardening

- Added backlog item `H007` for development runtime and delivery verification hardening.
- Added `.nvmrc` and `.node-version` to declare Node.js 22 as the project runtime.
- Added `docs/dev/setup.md` with local install, startup, delivery check, and scope boundary instructions.
- Updated `README.md` from the old clean Harness wording to the current frontend dashboard scaffold state.
- Updated `scripts/check.sh` so it prefers Homebrew `node@22` when the current shell is not already using Node.js 22.
- Recorded the Node.js 22 environment decision in `docs/PROJECT_STATE.md`, `docs/decision-log.md`, `docs/task-log.md`, and `docs/audit-report.md`.

### M001 MVP Scheduling Vertical Design

- Added raw requirements `R003` through `R010` for formal MVP setup and the scheduling-plan vertical.
- Added user stories `US006` through `US016` covering MVP scope confirmation, schedule plan list/detail, FastAPI read APIs, seed data, API contract, MVP status/formula boundary, and QA verification.
- Added `docs/superpowers/specs/2026-05-11-mvp-scheduling-vertical-design.md` to record the selected vertical, data model draft, API draft, scope exclusions, risks, and acceptance.
- Added backlog items `M001`, `B001`, `F005`, and `Q001`.
- Recorded `D008` to confirm the first formal MVP vertical as scheduling plan read-only delivery.

### B001 FastAPI Schedule Read API

- Added a minimal FastAPI backend under `backend/**`.
- Added read-only schedule plan endpoints: `GET /api/v1/schedule-plans` and `GET /api/v1/schedule-plans/{plan_id}`.
- Added local seed data for three schedule plans, each with 0.5h interval details.
- Added standard-library `unittest` coverage for route registration, list contract, detail contract, and 404 error payload.
- Updated `scripts/check.sh` to verify backend files, FastAPI/Pydantic availability, and backend tests as part of the Harness check.

### F005 Schedule Plan Frontend Vertical

- Added `/schedule-plans` as the read-only schedule plan list entry.
- Added `/schedule-plans/[planId]` as the read-only schedule plan detail entry.
- Added `lib/schedule-plans.ts` as the centralized frontend API client for the B001 schedule plan contract.
- Added `AppShell` and `SchedulePlanTable` to reuse the shadcn dashboard shell while keeping the page components scoped.
- Updated the sidebar to link into `/schedule-plans` and highlight only the active scheduling-plan item.
- Added button `asChild` support for link-style shadcn actions without introducing a new dependency.
- Verified the list route and detail route with local HTTP 200 responses after clearing a corrupted Next/Turbopack dev cache.

### Q001 Scheduling Vertical Acceptance

- Accepted the first read-only scheduling-plan vertical across backend, frontend, API contract, routing, and Harness verification.
- Re-ran backend unittest coverage for list/detail/404 route behavior.
- Confirmed `bash scripts/check.sh` passes with frontend lint/typecheck/build and backend tests.
- Confirmed `/schedule-plans` and `/schedule-plans/plan-20260511-shanghai-bosch-v1` returned local HTTP 200 during dev verification.
- Reviewed new frontend files for shadcn theme-token usage and found no newly introduced hardcoded color or arbitrary color classes.
- Kept production workflow capabilities out of scope: no edit, publish, approval, export, batch operation, authentication, database, real Excel, or real CORN integration.

### H008 Local Vertical Startup

- Added `scripts/dev.sh` to start the FastAPI backend and Next.js frontend together for local vertical verification.
- Defaulted `BPO_API_BASE_URL` to `http://127.0.0.1:8000` while allowing caller override.
- Added Node.js 22 selection and backend dependency checks to the local startup script.
- Added `bash -n scripts/dev.sh` to the Harness check.
- Updated README, backend README, and setup documentation with frontend-only and frontend + backend startup paths.

### H009 Continuous Delivery Commit Flow

- Added Continuous Delivery Mode to `AGENTS.md`.
- Recorded that explicit PM instructions such as "一口气做完" or "做完测完验证完提交完" authorize Codex to finish, verify, and commit without another commit confirmation pause.
- Kept high-risk stop conditions intact for dependencies, package changes, real data, database, authentication, approval, export, batch operations, production formulas, destructive Git actions, and failed verification.
- Updated `docs/PROJECT_STATE.md`, task log, audit report, and backlog with the new operating rule.

### B002 Schedule Plan Draft API

- Added draft request models for schedule plan interval input and draft payloads.
- Added `POST /api/v1/schedule-plans/drafts` for local in-memory draft creation.
- Added `PUT /api/v1/schedule-plans/{plan_id}/draft` for updating draft plans only.
- Added server-side recalculation for forecast totals, scheduled totals, gap, coverage rate, and update timestamp.
- Added backend unittest coverage for draft creation, draft update, non-draft rejection, and route registration.
- Kept persistence, authentication, permissions, publish, approval, export, batch operations, real Excel, and real CORN out of scope.

### F006 Schedule Plan Draft Creation UI

- Added a "新建草稿" action to the schedule plan list page.
- Added `/schedule-plans/new` as the minimal draft creation page.
- Added a server action that calls the B002 draft creation API from the Next.js server.
- Extended `lib/schedule-plans.ts` with draft payload types and write helpers.
- Kept the first UI version intentionally small: plan metadata plus four core 0.5h intervals.
- Kept full editing, publish, approval, export, batch operations, authentication, permissions, and persistence out of scope.

### H010 Story Runner Delivery Flow

- Added raw requirement `R014` and user story `US021` for PM's Harness optimization feedback.
- Added Story Runner Mode to `AGENTS.md`: goal -> minimal user stories -> Story Execution Queue -> implementation -> verification -> commit -> next story.
- Updated `docs/harness/lightweight-harness.md` so story-first continuous delivery is the main development flow.
- Updated `docs/prompts/README.md` so bounded subagents can be used by default in Story Runner Mode when write scopes do not overlap.
- Synchronized completed user-story statuses with completed backlog/task-log/audit state.
- Recorded that small UI corrections stay inside the active story instead of becoming new `F00x` tasks unless scope changes.

### F007 Schedule Plan Draft Update UI

- Added an "编辑草稿" action on draft schedule plan detail pages.
- Added `/schedule-plans/[planId]/edit` as the draft update page.
- Added a server action that calls the B002 draft update API from the Next.js server.
- Kept non-draft plans read-only and hid the edit action outside draft status.
- Kept full personnel-level scheduling, publish, approval, export, batch operations, authentication, permissions, and persistence out of scope.

### Q002 Draft Create And Update Acceptance

- Accepted the local schedule-plan draft creation/update vertical across backend API, frontend create UI, frontend edit UI, and Harness verification.
- Confirmed `bash scripts/check.sh` passes with `/schedule-plans/new` and `/schedule-plans/[planId]/edit` in the build output.
- Confirmed local HTTP 200 for the new draft page and edit draft page.
- Confirmed direct POST draft creation and PUT draft update against the FastAPI service.
- Recorded that persistence, authentication, permissions, publish, approval, export, batch operations, real Excel, and real CORN remain out of scope.

### H011 Harness Gate Review Fixes

- Fixed backend Python selection in `scripts/check.sh` and `scripts/dev.sh` so local verification chooses a Python runtime that can import FastAPI/Pydantic instead of depending on whichever `python3` appears first in PATH.
- Reconciled `docs/PROJECT_STATE.md` so the active scope now reflects the frontend dashboard scaffold plus local scheduling-plan MVP vertical, while keeping real integrations, database, auth, permissions, export, approval, batch operations, production formulas, and charge factors out of scope.
- Reconciled sidebar rules so primary navigation keeps icons and secondary navigation stays text-first with badge/tag states unless a later Gate changes that decision.
- Marked stale audit conclusions as superseded: key frontend/backend files are tracked, and the current Gate risk is backend Python runtime selection rather than the presence of `package.json`.

### B003/F008 Schedule Plan Filters

- Added backend `status` and `query` filtering for `GET /api/v1/schedule-plans`.
- Added unittest coverage for backend status and keyword filtering.
- Added URL-based keyword search, status switching, clear filters, filtered summary cards, and empty-result messaging to `/schedule-plans`.
- Kept this story local-only: no new dependency, package change, database, auth, real Excel, real CORN, publish, approval, export, or batch operation.

### B004/F009 Shift Details

- Added `GET /api/v1/shift-details` to expose flattened 0.5h schedule-plan interval rows.
- Added backend tests for shift-detail contract fields and keyword filtering.
- Added `/shift-details` with summary cards, keyword/status filters, empty state, and links back to the source schedule plan.
- Updated the sidebar "班次明细" item to point at the new page.

### B005/F010 Demand Plans

- Added `GET /api/v1/demand-plans` to expose local forecast-demand rows.
- Added backend tests for demand-plan contract fields and keyword filtering.
- Added `/demand-plans` with summary cards, keyword search, empty state, and a forecast-demand table.
- Updated the sidebar "需求计划" item to point at the new page.

### H013 Stage Completion Planning

- Added a mandatory stage-completion planning section to `AGENTS.md`.
- Added the same rule to the Lightweight Harness workflow and Done Report template.
- Updated Project State so future main-worker reports include completed scope, verification, remaining work, recommended next 2-3 steps, reasoning, not-yet-recommended items, and the default next item when PM does not object.

### B006/F011 Unavailability Management

- Added `GET /api/v1/unavailability` to expose local staff unavailable-interval records.
- Added backend tests for unavailability route registration, field contract, status filtering, and keyword filtering.
- Added `/unavailability` with summary cards, keyword/status filters, empty state, and links into shift details by site.
- Updated the sidebar "不可用管理" item to point at the new page.

### B007/F012 Schedule Risk Hints

- Added `GET /api/v1/schedule-risks` to expose local MVP risk hints from schedule gaps plus active unavailability records.
- Added backend tests for risk route registration, field contract, combined high-risk detection, and keyword filtering.
- Added a risk-hint section to `/schedule-plans` with high-risk count, risk rows, reason, recommendation, and links into shift details.
- Kept the risk level as MVP display guidance only; no production formula, automatic scheduling, approval, or batch adjustment was added.

### H014 Insert shadcn Dashboard Replica Requirement

- Confirmed the previous development commits are present, including `1a8671f feat: add schedule risk hints`.
- Inserted `R020` from `/Users/mac/Documents/Codex/2026-05-10/computeruse-https-ui-shadcn-com/docs/design/shadcn-dashboard-01-replica-spec.md`.
- Split the inserted design requirement into `US032` visual gap audit and `US033` visual alignment implementation.
- Added `F013` and `F014` as the queued execution items, with `F014` explicitly gated if package, lockfile, font, icon, or shadcn component changes are needed.

### F013 shadcn Dashboard Replica Gap Audit

- Added `docs/design/shadcn-dashboard-01-gap-audit.md`.
- Audited current `components.json`, `package.json`, `app/globals.css`, layout, sidebar, header, cards, chart, table, and UI primitives against the inserted replica spec.
- Classified gaps as P0/P1/P2, including theme token mismatch, sidebar width/token mismatch, metric-card sizing, missing container queries, incomplete table interactions, and dependency-gated Tabler/TanStack/DnD work.
- Marked `US032/F013` done while leaving `US033/F014` as the gated implementation story.

### F014 shadcn Dashboard Replica Visual Baseline

- Aligned `app/globals.css` to OKLCH dashboard tokens and added sidebar semantic tokens.
- Adjusted sidebar width, background token, nav row height, header title scale, metric card height, metric value typography, and metric card container-query behavior.
- Updated chart token usage for OKLCH compatibility and switched area curves to `natural`.
- Increased table row density toward the measured dashboard-01 baseline.
- Added `docs/design/shadcn-dashboard-01-visual-alignment-report.md` with completed work and remaining gated parity items.

### H012 Harness Documentation Consistency Fixes

- Reconciled `docs/harness/lightweight-harness.md` with the current frontend dashboard scaffold plus local scheduling-plan MVP vertical state.
- Clarified that B001/B002/F005/F006/F007/Q001/Q002 are confirmed local vertical scope, while production database, auth, permissions, real integrations, approval, export, batch operations, formulas, and charge factors remain gated.
- Clarified `AGENTS.md` so Story Runner Mode can use bounded subagents by default, while subagent templates alone do not authorize automatic execution outside that mode.
- Reclassified old untracked-file and clean Harness deviation audit risks as historical conclusions superseded by H011/H012.

### H015 Auto Local Commit After Green Check

- Updated the project execution flow so every completed task that passes `bash scripts/check.sh` is committed to the local Git repository without another confirmation pause.
- Kept remote push PM-controlled: after a stage, module block, or coherent feature set is complete, Codex asks whether to push to `origin`.
- Synchronized `AGENTS.md`, Project State, Lightweight Harness, Done Report Template, backlog, task log, decision log, and audit report.

### F015 shadcn Dependency And Component Intake

- Added `R021`, `US034`, and backlog task `F015` for the PM-confirmed shadcn dependency and component intake pass.
- Accepted the package and lockfile changes for Tabler icons, TanStack Table, DnD, sonner, zod, class-variance-authority, radix-ui, vaul, and generated shadcn UI components.
- Fixed `hooks/use-mobile.ts` by replacing effect-driven state synchronization with `useSyncExternalStore`, resolving the React hooks lint failure.
- Browser-smoked dashboard rendering, schedule-plan filtering, new draft form, and edit draft form after the primitive updates.
- Kept this as scaffold intake only: no new business route, backend capability, real data, database, auth, approval, export, batch operation, production formula, status-code change, settlement rule, or charge factor was added.

### H016 Harness Gate Registry Alignment

- Added `R022`, `US035`, and backlog task `H016` for the audit-feedback repair.
- Expanded `docs/quality/GATE_REGISTRY.md` into a workflow-to-gate matrix covering `harness`, `frontend-scaffold`, `frontend-audit`, `backend`, `backend-mvp`, `backend-vertical`, and `qa`.
- Aligned `AGENTS.md` and `docs/PROJECT_STATE.md` to the same current stage: frontend dashboard scaffold + local scheduling-plan MVP vertical.
- Moved stale clean-Harness conclusions in `docs/audit-report.md` into a historical audit snapshot section.
- Added `R023`, `US036`, and `F016` as the next `ready` Story Runner entry for risk-detail drilldown without implementing it in this task.

### F016 Schedule Risk Detail Drilldown

- Added `/schedule-risks/[riskId]` as a frontend-only risk-detail drilldown.
- Added a stable "明细" action from the schedule-plan risk table to the risk detail page.
- Reused existing local MVP data contracts to show risk context, related shift detail rows, and overlapping active unavailability rows.
- Kept the page as manual review support only: no backend endpoint, dependency, real data source, database, auth, approval, export, batch adjustment, automatic scheduling, production formula, status-code change, settlement rule, or charge factor was added.

### F017 Unavailability Impact Locator

- Added `/unavailability/[unavailabilityId]` as a frontend-only impact locator for unavailable staff intervals.
- Added a stable "影响" action from the unavailability table to the impact locator page.
- Reused existing local MVP data contracts to show unavailable-staff context, impacted shift detail rows, and overlapping schedule risk rows.
- Kept the page as manual review support only: no backend endpoint, dependency, real data source, database, auth, approval, export, batch adjustment, automatic scheduling, production formula, status-code change, settlement rule, or charge factor was added.

### F018 Schedule Risk Table Parity Slice

- Added `components/schedule-risk-table.tsx` as a local TanStack Table slice for schedule risk hints.
- Replaced the inline risk table in `/schedule-plans` with `ScheduleRiskTable`.
- Added sortable risk level, date, gap, and unavailable-impact columns while preserving existing fields and detail/shift actions.
- Kept this as display-only table parity: no dependency change, batch selection, drag sorting, approval, export, batch adjustment, production workflow, formula, status-code change, settlement rule, or charge factor was added.

### H017 Standard Branch Workflow

- branch_name: `codex/H017-standard-workflow`
- base_main_commit: `1b8adb4c75ff670cebebb6d9420f0f9b54d4194b`
- remote_status: `origin/main available; main fast-forward synced before branch creation`
- scope: Harness workflow and frontend-rule documentation only; no business code, dependency, package, lockfile, backend, or frontend implementation changes.
- allowed_files_check: `AGENTS.md`, `docs/**`, and `tasks/backlog.yaml` only.
- scope_diff_check: `AGENTS.md`, `docs/**`, and `tasks/backlog.yaml` only; no app/backend/package/lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed with frontend lint, typecheck, Next build, and 19 backend unittest cases.
- local_commit_sha: `07fc4e09a961adaebf8384682855069389d76f4f`
- integration_status: `integrated`
- integration_method: `merge into main`
- integration_commit_sha: to be reported in Done Report after final integration commit creation.
- push_decision: `approved by PM after integration plan`

### H018/F019/F020/Q003 No Database MVP Completion Block

- branch_name: `codex/mvp-no-db-completion`
- base_main_commit: `1b8adb4c75ff670cebebb6d9420f0f9b54d4194b`
- upstream_governance_commit: `07fc4e09a961adaebf8384682855069389d76f4f`
- remote_status: `origin/main available; git fetch origin passed before branch work`
- scope: No Database MVP Mode governance, local MVP flow entry, schedule-plan table parity slice, and MVP acceptance audit.
- allowed_files_check: `AGENTS.md`, `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend or package/lockfile files.
- scope_diff_check: `AGENTS.md`, `app/schedule-plans/page.tsx`, `components/mvp-flow-summary.tsx`, `components/schedule-plan-table.tsx`, `docs/**`, and `tasks/backlog.yaml`; no backend or package/lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed once before final evidence update; final check to be reported in Done Report.
- local_commit_sha: `f59f821b8e744a015603280879ca45e3116e08dd`
- integration_status: `integrated`
- integration_method: `merge into main`
- integration_commit_sha: to be reported in Done Report after final integration commit creation.
- merge_to_main_commit: to be reported in Done Report after final integration commit creation.
- push_decision: `approved by PM after integration plan`
- blocked_reason: `N/A`

### H019 Dev Native Runtime Hardening

- Added `scripts/verify-frontend-native-runtime.mjs` to preflight the Node.js major version plus `lightningcss-darwin-arm64` and `@next/swc-darwin-arm64` native addon loading before starting the frontend.
- Added `scripts/run-next-dev.sh` as the hardened frontend dev entrypoint; it selects Homebrew `node@22`, runs the native preflight, supports a dry-run mode for regression tests, and starts `next dev --webpack`.
- Replaced the bare `next dev` package script with the hardened wrapper and updated `scripts/dev.sh` to reuse the same entrypoint for frontend + backend startup.
- Expanded `scripts/check.sh` to require the new runtime files, syntax-check the wrapper, run a native runtime preflight, and run `scripts/tests/verify-frontend-native-runtime.test.mjs`.
- Verified the exact root-cause pair on this machine: the default Codex Node 24 fails native addon loading with macOS code-signing errors, while Homebrew Node 22 passes the same checks and full project Harness verification.

### H020 Python 3.12 Runtime Pinning

- Added `.python-version` with `3.12` and documented Python 3.12 as the only supported backend development runtime.
- Added `scripts/verify-backend-runtime.sh` to validate the Python version plus required backend modules before selecting an interpreter.
- Updated `scripts/check.sh` and `scripts/dev.sh` to reuse the same backend runtime verifier instead of hand-rolled candidate logic.
- Added `scripts/tests/verify-backend-runtime.test.mjs` and integrated it into the main Harness check so supported Python 3.12 passes and system Python 3.9 fails clearly.
- Verified on this machine that `/Users/mac/.local/bin/python3` 3.12.13 is accepted and `/usr/bin/python3` 3.9.6 is rejected as unsupported.

### F021/F022 Local Detail Chain And Shift Table Parity

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; fetch passed and local main already matched origin/main`
- scope: schedule-plan detail review-chain strengthening, shift-details table parity, and traceability updates only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-plans/[planId]/page.tsx`, `app/shift-details/page.tsx`, `components/shift-details-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed; local dev smoke used `npm run dev` on `http://localhost:3002` and verified the updated schedule-plan detail, shift-details, and schedule-risk detail routes by local HTTP content checks because browser navigation tools were not exposed in this turn.
- local_commit_sha: `current HEAD on codex/f021-detail-chain; exact SHA recorded in the Done Report`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F023 Unavailability Table Parity

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: unavailability table parity migration and traceability updates only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/unavailability/page.tsx`, `components/unavailability-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: `3e023e4`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### Q004 QA Closure And F024 Ready Queue

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: QA acceptance closure for F021-F023 plus next parity target seeding only.
- allowed_files_check: `docs/**`, `tasks/backlog.yaml`, and read-only verification across `app/**` + `components/**`; no backend, lib, package, or lockfile files.
- scope_diff_check: `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/audit-report.md`, `docs/PROJECT_STATE.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed; local QA smoke confirmed `/schedule-plans/[planId]`, `/shift-details`, and `/unavailability` key labels/entry texts via local HTTP checks on `http://localhost:3002`.
- local_commit_sha: `2d2035b`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F024 Demand Table Parity And Q005 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: demand-plans table parity migration, F024 QA closure, and next parity target seeding only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/demand-plans/page.tsx`, `components/demand-plan-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green).
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F025 Detail Interval Table Parity And Q006 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: schedule-plan detail interval table parity migration, F025 QA closure, and next parity target seeding only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-plans/[planId]/page.tsx`, `components/schedule-plan-interval-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green); local smoke on `http://localhost:3011/schedule-plans/[planId]` confirmed table title/columns/sample interval values.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F026 Risk Detail Shift Table Parity And Q007 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: schedule-risk detail related-shifts table parity migration, F026 QA closure, and explicit remaining queue consolidation only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-risks/[riskId]/page.tsx`, `components/schedule-risk-shift-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green); local smoke on `http://localhost:3012/schedule-risks/[riskId]` confirmed related-shifts card title, table columns, and representative note content.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F027-F029 Detail Page Remaining Parity Chain And Q008-Q011 QA Closure

- branch_name: `codex/f021-detail-chain`
- base_main_commit: `86833e6b37a4b0c8a6423287517f920c6fd36d84`
- remote_status: `origin/main available; branch already tracks origin/codex/f021-detail-chain`
- scope: schedule-risk detail remaining table parity, unavailability-impact detail two-table parity, per-story QA closures, and final block-level QA closure only.
- allowed_files_check: `app/**`, `components/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- scope_diff_check: `app/schedule-risks/[riskId]/page.tsx`, `app/unavailability/[unavailabilityId]/page.tsx`, `components/schedule-risk-unavailability-table.tsx`, `components/unavailability-impact-shift-table.tsx`, `components/unavailability-impact-risk-table.tsx`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/task-log.md`, `docs/user-stories.md`, and `tasks/backlog.yaml`; no backend, lib, package, or lockfile files.
- check_result: `git diff --check` passed; `bash scripts/check.sh` passed (frontend lint/typecheck/build green; backend unittest 19/19 green); local smoke on `http://localhost:3013/schedule-risks/[riskId]` and `http://localhost:3013/unavailability/[unavailabilityId]` confirmed all three migrated detail tables render expected headings and columns.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H022 State Governance V3 Round 1

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/main available; local main already matched origin/main before branch creation`
- scope: state-governance documents, current/registry state entrypoints, state check script, and traceability updates only.
- allowed_files_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/quality/**`, `docs/harness/lightweight-harness.md`, `docs/PROJECT_STATE.md`, legacy traceability docs, `tasks/backlog.yaml`, and `scripts/check-state.sh`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/audit-report.md`, `docs/decision-log.md`, `docs/dev/branch-log.md`, `docs/harness/lightweight-harness.md`, `docs/quality/DONE_REPORT_TEMPLATE.md`, `docs/quality/GATE_REGISTRY.md`, `docs/quality/STATE_MANAGEMENT.md`, `docs/raw-requirements.md`, `docs/task-log.md`, `docs/user-stories.md`, `docs/current/**`, `docs/registry/**`, `tasks/backlog.yaml`, and `scripts/check-state.sh`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh` passed; `bash scripts/check-state.sh --repair-scope` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H023 Check-State Standard Verification Integration

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: state-check script hardening, standard check integration, regression tests, and traceability updates only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, `scripts/check.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/PROJECT_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/decision-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, `docs/registry/TRACE_INDEX.yaml`, `docs/registry/DECISION_INDEX.yaml`, `tasks/backlog.yaml`, `scripts/check-state.sh`, `scripts/check.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `node --test scripts/tests/check-state.test.mjs` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H024 Current Queue Live Smoke

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: current queue smoke, registry index update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/STORY_QUEUE.yaml`, `docs/current/ACTIVE_TASKS.yaml`, `docs/current/PROJECT_CONTEXT.md`, `docs/registry/TRACE_INDEX.yaml`, `docs/registry/DECISION_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed with H024 current entry; after completion `bash scripts/check-state.sh --strict` passed with empty current; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H025 Current Done History Invariant

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: state-check current done history invariant, regression tests, registry update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `node --test scripts/tests/check-state.test.mjs` passed with 7 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H026 Strict State Check Default

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: standard check state mode, current queue cleanup, registry update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, and `scripts/check.sh`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, and `scripts/check.sh`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with default strict state check; `BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H027 TRACE_INDEX Current Files Path Check

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: check-state registry path coverage, state-check regression test, current queue cleanup, registry update, and traceability records only.
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, `tasks/backlog.yaml`, `scripts/check-state.sh`, and `scripts/tests/check-state.test.mjs`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `node --test scripts/tests/check-state.test.mjs` passed with 8 tests; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### H028 Codex Plan Boundary

- branch_name: `codex/h022-state-governance-v3`
- base_main_commit: `242b1e9`
- remote_status: `origin/codex/h022-state-governance-v3` already exists; this task continues the same coherent state-governance branch.
- scope: Codex Plan boundary rules, current queue cleanup, registry update, and traceability records only.
- allowed_files_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- scope_diff_check: `AGENTS.md`, `docs/current/**`, `docs/registry/**`, `docs/PROJECT_STATE.md`, `docs/quality/STATE_MANAGEMENT.md`, legacy traceability docs, and `tasks/backlog.yaml`; no business code, backend, lib, package, or lockfile files.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### F030-F031 Dashboard Table Parity Block

- branch_name: `codex/f030-dashboard-table-parity`
- base_main_commit: `2ba7170`
- remote_status: `branch created from pushed state-governance head because main has not yet integrated H022-H028`
- scope: dashboard anomaly detail table parity, local column visibility, local page-size controls, QA traceability, and state cleanup.
- allowed_files_check: `app/dashboard/**`, `components/data-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- scope_diff_check: `components/data-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed; `npm run lint` passed; `npm run typecheck` passed; `curl -fsS http://127.0.0.1:3014/dashboard` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F112-F120 Quality Progress Drilldown Block

- branch_name: `codex/f112-quality-progress-drilldown`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed data quality group and acceptance checklist head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: data quality issue-to-group reverse lookup model, data quality issue group links, data quality group coverage summary, acceptance checklist item lookup and detail route, production MVP progress model and route, production MVP overview link, sidebar entry, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/data-quality-groups.ts`, `lib/production-mvp-acceptance.ts`, `lib/production-mvp-progress.ts`, `app/data-quality/**`, `app/production-mvp/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/data-quality-group-links.test.mjs` passed with 3 tests; `node --experimental-strip-types --test scripts/tests/production-mvp-acceptance.test.mjs` passed with 4 tests; `node --experimental-strip-types --test scripts/tests/production-mvp-progress.test.mjs` passed with 2 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check.sh` passed; Browser smoke opened `/data-quality/DQ-202605-005`, `/production-mvp/acceptance-checklist/upload-import`, `/production-mvp/progress`, and `/production-mvp`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F103-F111 Data Quality Group And Acceptance Checklist Block

- branch_name: `codex/f103-quality-group-acceptance-checklist`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed import batch field timeline head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: data quality group model and routes, data quality center group link, import batch quality issue drilldown links, production MVP acceptance checklist model and route, production MVP overview link, sidebar entry, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/data-quality-groups.ts`, `lib/production-mvp-acceptance.ts`, `app/data-quality/**`, `app/import-batches/[batchId]/page.tsx`, `app/production-mvp/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/data-quality-groups.test.mjs` passed with 2 tests; `node --experimental-strip-types --test scripts/tests/production-mvp-acceptance.test.mjs` passed with 3 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check.sh` passed; Browser smoke opened `/data-quality/groups`, `/data-quality/groups/time-validity`, `/import-batches/BATCH-20260519-002`, and `/production-mvp/acceptance-checklist`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F032-F040 Dashboard Continuation Block

- branch_name: `codex/f032-dashboard-continuation`
- base_main_commit: `f7b1ef1`
- remote_status: `branch created from prior pushed dashboard parity branch because main has not yet integrated H022-H028 and F030-F031`
- scope: 10-task dashboard local frontend continuation: anomaly filters/pagination, data sync table parity/filtering, heatmap summaries/accessibility, QA traceability, and state cleanup.
- allowed_files_check: `app/dashboard/**`, `components/**`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- scope_diff_check: `components/bpo-heatmap.tsx`, `components/data-sync-status.tsx`, `components/data-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/PROJECT_CONTEXT.md`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, lib contract, package, or lockfile files.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 6 tests; `npm run typecheck` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F041-F059 Table Parity Continuation Block

- branch_name: `codex/f041-dashboard-continuation-2`
- base_main_commit: `b0beab6`
- remote_status: `local branch created from prior pushed dashboard continuation branch because main has not yet integrated H022-H028, F030-F031, or F032-F040`
- scope: 20-task local frontend table parity continuation: schedule plan table filters/summary/pagination/columns, schedule risk filters/summary/pagination, unavailability filters/summary/pagination/columns, QA traceability, and state cleanup.
- allowed_files_check: `components/**`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- scope_diff_check: `components/schedule-plan-table.tsx`, `components/schedule-risk-table.tsx`, `components/unavailability-table.tsx`, `components/data-table-model.ts`, `scripts/tests/dashboard-table-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, or production formula files.
- check_result: `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs` passed with 9 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed; local HTTP smoke passed for `/schedule-plans` and `/unavailability` on `http://127.0.0.1:3015`.
- local_commit_sha: `462e3b4`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### F061-F063 Production MVP Contract Demo Block

- branch_name: `codex/production-mvp-contract-demo`
- base_main_commit: `fc71b28`
- remote_status: `local branch created from prior pushed production MVP first-batch head because main has not yet integrated the production MVP chain`
- scope: production MVP local frontend contract client, model test, `/production-mvp` page, sidebar entry, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, or production formula files.
- scope_diff_check: `lib/anomaly-review.ts`, `app/anomaly-review/page.tsx`, `components/app-sidebar.tsx`, `scripts/tests/anomaly-review.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, anomaly action submission, or production formula files.
- check_result: `node --experimental-strip-types --test scripts/tests/anomaly-review.test.mjs` passed with 3 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed; local HTTP smoke passed for `/anomaly-review`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F064-F066 Anomaly Review Entry Block

- branch_name: `codex/f064-anomaly-review-entry`
- base_main_commit: `b283414`
- remote_status: `local branch created from pushed production MVP contract demo head because main has not yet integrated the production MVP chain`
- scope: anomaly review local frontend model, model test, read-only `/anomaly-review` page, sidebar entry, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, anomaly action submission, or production formula files.
- scope_diff_check: pending final diff review.
- check_result: pending final verification.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F067-F075 Import Drilldown And Data Quality Block

- branch_name: `codex/f067-import-data-quality-drilldown`
- base_main_commit: `d881b5e`
- remote_status: `local branch created from pushed anomaly review entry head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: import contract drilldown model, three production MVP drilldown pages, production MVP overview links, data quality model, data quality center, data quality detail route, sidebar entry, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, data repair action, or production formula files.
- scope_diff_check: `lib/import-drilldown.ts`, `lib/data-quality.ts`, `app/production-mvp/**`, `app/data-quality/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, data repair action, or production formula files.
- check_result: `node --experimental-strip-types --test scripts/tests/import-drilldown.test.mjs` passed with 3 tests; `node --experimental-strip-types --test scripts/tests/data-quality.test.mjs` passed with 3 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check.sh` passed; local HTTP smoke returned 200 for `/production-mvp`, three drilldown pages, `/data-quality`, and `/data-quality/DQ-202605-004`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F076-F084 Personnel Timeline Demand Relations Block

- branch_name: `codex/f076-timeline-demand-relations`
- base_main_commit: `3d2a717`
- remote_status: `local branch created from pushed import drilldown and data quality head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: personnel timeline model and routes, demand forecast contract model and route, production MVP overview link, master-data relations model and route, sidebar entries, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/person-timeline.ts`, `lib/demand-forecast-contract.ts`, `lib/master-data-relations.ts`, `app/person-timeline/**`, `app/production-mvp/demand-forecast/**`, `app/master-data-relations/**`, `app/production-mvp/page.tsx`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/person-timeline.test.mjs` passed with 3 tests; `node --experimental-strip-types --test scripts/tests/demand-forecast-contract.test.mjs` passed with 2 tests; `node --experimental-strip-types --test scripts/tests/master-data-relations.test.mjs` passed with 2 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check.sh` passed; local HTTP smoke returned 200 for `/person-timeline`, `/person-timeline/A-1002`, `/production-mvp/demand-forecast`, `/master-data-relations`, and `/production-mvp`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F085-F093 Shift Template Anomaly Source Block

- branch_name: `codex/f085-shift-template-anomaly-source`
- base_main_commit: `f001871`
- remote_status: `local branch created from pushed personnel timeline demand relations head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: shift type model and route, import template model and route, anomaly source model and routes, sidebar entries, anomaly review source link, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/shift-type-catalog.ts`, `lib/import-template-guide.ts`, `lib/anomaly-source-drilldown.ts`, `app/shift-types/**`, `app/import-templates/**`, `app/anomaly-review/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/shift-type-catalog.test.mjs` passed with 3 tests; `node --experimental-strip-types --test scripts/tests/import-template-guide.test.mjs` passed with 3 tests; `node --experimental-strip-types --test scripts/tests/anomaly-source-drilldown.test.mjs` passed with 2 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check.sh` passed; local HTTP smoke returned 200 for `/shift-types`, `/import-templates`, `/anomaly-review/sources`, `/anomaly-review/sources/schedule_login`, and `/anomaly-review`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F094-F102 Import Batch Field Timeline Block

- branch_name: `codex/f094-import-batch-field-timeline`
- base_main_commit: `996e81e`
- remote_status: `local branch created from pushed shift template anomaly source head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: import batch history model and routes, field mapping preview model and route, review status timeline model and route, sidebar entries, anomaly review timeline link, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/import-batch-history.ts`, `lib/field-mapping-preview.ts`, `lib/review-status-timeline.ts`, `app/import-batches/**`, `app/field-mapping/**`, `app/anomaly-review/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/import-batch-history.test.mjs` passed with 2 tests; `node --experimental-strip-types --test scripts/tests/field-mapping-preview.test.mjs` passed with 2 tests; `node --experimental-strip-types --test scripts/tests/review-status-timeline.test.mjs` passed with 2 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check.sh` passed; local HTTP smoke returned 200 for `/import-batches`, `/import-batches/BATCH-20260519-002`, `/field-mapping`, `/anomaly-review/timeline`, and `/anomaly-review`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F121-F129 Gap Priority Roadmap Block

- branch_name: `codex/f121-gap-priority-roadmap`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed quality progress drilldown head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: production MVP gap priority model and tests, gap overview route, gap detail route, acceptance detail gap links, progress/overview/sidebar entries, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/production-mvp-gap-roadmap.ts`, `app/production-mvp/gaps/**`, `app/production-mvp/**`, `components/app-sidebar.tsx`, `scripts/tests/production-mvp-gap-roadmap.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/production-mvp-gap-roadmap.test.mjs` passed with 3 tests; `npm run typecheck` passed; Browser smoke passed for `/production-mvp/gaps`, `/production-mvp/gaps/upload-import-execution`, `/production-mvp/acceptance-checklist/upload-import`, and `/production-mvp`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/production-mvp/gaps` and `/production-mvp/gaps/[gapId]`, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F130-F138 Data Foundation Readiness Block

- branch_name: `codex/f130-data-foundation-readiness`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed gap priority roadmap head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: production MVP data foundation readiness model and tests, data foundation overview route, data foundation step detail route, acceptance detail links, gap roadmap/overview/progress/sidebar entries, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, upload/import execution, master-data CRUD, field-mapping persistence, freeze/unfreeze implementation, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/production-mvp-data-foundation.ts`, `app/production-mvp/data-foundation/**`, `app/production-mvp/**`, `components/app-sidebar.tsx`, `scripts/tests/production-mvp-data-foundation.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, upload/import execution, master-data CRUD, field-mapping persistence, freeze/unfreeze implementation, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/production-mvp-data-foundation.test.mjs` passed with 3 tests; `npm run typecheck` passed; Browser smoke passed for `/production-mvp/data-foundation`, `/production-mvp/data-foundation/import-execution-readiness`, `/production-mvp/acceptance-checklist/upload-import`, `/production-mvp/acceptance-checklist/master-data`, `/production-mvp/gaps`, and `/production-mvp`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/production-mvp/data-foundation` and `/production-mvp/data-foundation/[stepId]`, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F139-F147 Forecast Actual Alignment Readiness Block

- branch_name: `codex/f139-forecast-actual-alignment`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed data foundation readiness head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: production MVP forecast/actual alignment readiness model and tests, alignment overview route, alignment step detail route, acceptance detail links, gap roadmap/overview/progress/sidebar entries, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, forecast import, login/status interface, production status-code mapping, formula, approval, export, batch, permission, automatic scheduling, settlement rule, or charge-factor files.
- scope_diff_check: `lib/production-mvp-alignment-readiness.ts`, `app/production-mvp/alignment-readiness/**`, `app/production-mvp/**`, `components/app-sidebar.tsx`, `scripts/tests/production-mvp-alignment-readiness.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, forecast import, login/status interface, production status-code mapping, formula, approval, export, batch, permission, automatic scheduling, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/production-mvp-alignment-readiness.test.mjs` passed with 3 tests; `npm run typecheck` passed; Browser smoke passed for `/production-mvp/alignment-readiness`, `/production-mvp/alignment-readiness/forecast-version-readiness`, `/production-mvp/acceptance-checklist/demand-forecast`, `/production-mvp/acceptance-checklist/actual-status`, `/production-mvp/acceptance-checklist/comparison-anomaly`, `/production-mvp/gaps`, and `/production-mvp`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/production-mvp/alignment-readiness` and `/production-mvp/alignment-readiness/[stepId]`, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F148-F156 Anomaly Triage Readiness Block

- branch_name: `codex/f148-anomaly-triage-readiness`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed forecast actual alignment readiness head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: production MVP anomaly triage readiness model and tests, anomaly readiness overview route, anomaly readiness step detail route, acceptance detail link, anomaly review/source links, gap roadmap/overview/progress/sidebar entries, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, real anomaly rules engine, real review submission, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/production-mvp-anomaly-triage-readiness.ts`, `app/production-mvp/anomaly-triage-readiness/**`, `app/production-mvp/**`, `app/anomaly-review/**`, `components/app-sidebar.tsx`, `scripts/tests/production-mvp-anomaly-triage-readiness.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, real anomaly rules engine, real review submission, approval, export, batch, permission, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --experimental-strip-types --test scripts/tests/production-mvp-anomaly-triage-readiness.test.mjs` passed with 3 tests; `npm run typecheck` passed; local HTTP smoke passed for `/production-mvp/anomaly-triage-readiness`, `/production-mvp/anomaly-triage-readiness/anomaly-taxonomy-readiness`, `/production-mvp/acceptance-checklist/comparison-anomaly`, `/anomaly-review`, `/anomaly-review/sources`, `/production-mvp/gaps`, `/production-mvp`, and `/production-mvp/progress`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/production-mvp/anomaly-triage-readiness` and `/production-mvp/anomaly-triage-readiness/[stepId]`, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F157-F165 Governance Readiness Block

- branch_name: `codex/f157-governance-readiness`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed anomaly triage readiness head because main has not yet integrated the production MVP chain`
- scope: 10-task local frontend continuation: production MVP governance readiness model and tests, governance overview route, governance step detail route, gap detail links, acceptance detail links, gap roadmap/overview/progress/sidebar entries, QA traceability, and state cleanup.
- allowed_files_check: `lib/**`, `app/**`, `components/app-sidebar.tsx`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, real release, approval, permission implementation, audit writing, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `lib/production-mvp-governance-readiness.ts`, `app/production-mvp/governance-readiness/**`, `app/production-mvp/**`, `components/app-sidebar.tsx`, `scripts/tests/production-mvp-governance-readiness.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, real release, approval, permission implementation, audit writing, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `bash scripts/check.sh` passed; includes strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/production-mvp/governance-readiness` routes, and backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `continuous PM instruction to keep developing and push after verified coherent block`
- blocked_reason: `N/A`

### F166 Product UI Business-Only Regression Fix

- branch_name: `codex/f166-dashboard-business-only`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed governance readiness head because main has not yet integrated the production MVP chain`
- scope: urgent product UI semantics regression fix: remove `DataSyncStatus` and data-version filter from `/dashboard`, remove internal `/production-mvp/**` planning routes from product UI, route remaining links to real business pages, add business-only regression tests, and update traceability.
- allowed_files_check: `app/dashboard/page.tsx`, `components/app-sidebar.tsx`, `app/production-mvp/**`, selected business pages linking to internal planning routes, `lib/import-drilldown.ts`, internal production-mvp planning models/tests, `scripts/tests/*business-only*`, `scripts/tests/import-drilldown.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, `/demo-imports`, data-sync component deletion, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: removes `app/production-mvp/**` internal planning routes and planning-only model/test files; updates `/dashboard`, sidebar, anomaly/import/data-quality/shift/field-mapping UI copy, import drilldown business links, regression tests, and traceability docs; no backend, package, lockfile, database, `/demo-imports`, data-sync component deletion, real integration, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- check_result: target business-only tests, strict state check, diff whitespace check, Node 22 typecheck, Node 22 Next build, in-app browser smoke, and final `bash scripts/check.sh` passed; Next route list no longer contains `/production-mvp/**`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `PM escalation requires immediate verified fix; push after green local gate`
- blocked_reason: `N/A`

### F167 Product UI Copy And Person Timeline Fix

- branch_name: `codex/f167-product-ui-copy-timeline`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed dashboard business-only fix because main has not yet integrated the product UI cleanup chain`
- scope: urgent product UI cleanup: audit all existing product pages for internal execution language, remove internal/deferred-action cards and labels, redesign existing personnel timeline pages into personnel calendar and one-day three-track horizontal timeline, add regression tests, and update traceability.
- allowed_files_check: `app/**`, `components/**`, `lib/person-timeline.ts`, `scripts/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, production formula, settlement rule, charge-factor files, or new product pages.
- scope_diff_check: updates existing anomaly review, data quality, import batch, schedule plan, risk, unavailability, person timeline, and summary component UI copy; updates `lib/person-timeline.ts`; adds `scripts/tests/product-ui-copy-audit.test.mjs`; updates `scripts/tests/person-timeline.test.mjs`; updates current and legacy traceability docs; no `/production-mvp/**`, backend, package, lockfile, database, real integration, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- check_result: `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs` passed with 6 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed for `/dashboard`, `/anomaly-review`, `/person-timeline`, and `/person-timeline/A-1001?date=2026-05-11`; final `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `PM escalation requires immediate verified fix; push after green local gate`
- blocked_reason: `N/A`

### F168 Personnel Schedule Detail Closure

- branch_name: `codex/f168-personnel-schedule-detail`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from pushed F167 product UI cleanup head because main has not yet integrated the product chain`
- scope: frontend local business function: add personnel-level schedule detail model, table, tests, and mount it on existing schedule plan detail so interval summary can trace to employees and personal timeline.
- allowed_files_check: `app/schedule-plans/[planId]/page.tsx`, `components/personnel-schedule-detail-table.tsx`, `lib/personnel-schedule-details.ts`, `scripts/tests/personnel-schedule-details.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, charge-factor files, or new product pages.
- scope_diff_check: adds local personnel schedule detail model and table, updates existing schedule plan detail page, adds focused model test, updates current and legacy traceability docs; no `/production-mvp/**`, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target tests, product UI copy audit, lint, typecheck, in-app browser smoke, and final `bash scripts/check.sh` passed; final check included strict state check, state-check regression tests, frontend lint, typecheck, Next build, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F169 Fulfillment Calendar Drilldown

- branch_name: `codex/f169-fulfillment-calendar`
- base_main_commit: `a3a134c`
- remote_status: `local branch created from F168 personnel schedule detail head because main has not yet integrated the product chain`
- scope: frontend local business function: upgrade `/person-timeline` into fulfillment calendar, align sidebar navigation to the fulfillment calendar name, remove stale status-trace/dashboard placeholder entries, add local aggregation for team week, group week, member day matrix, keep drilldown as one visible layer at a time, preserve personal day three-track detail, and update focused tests and traceability.
- allowed_files_check: `app/person-timeline/**`, `components/app-sidebar.tsx`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `scripts/tests/product-ui-copy-audit.test.mjs`, `scripts/tests/product-navigation-business-only.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, aligns sidebar naming and fulfillment-monitoring entries, updates focused model/navigation/UI copy tests and traceability docs; no new `/production-mvp/**` routes, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target tests, product UI copy audit, strict state check, lint, typecheck, in-app browser smoke, and final `bash scripts/check.sh` passed; final check included strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/person-timeline` dynamic routes, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F170 Personal Week Calendar Layer

- branch_name: `codex/f169-fulfillment-calendar`
- base_main_commit: `a3a134c`
- remote_status: `continued on pushed F169 fulfillment calendar branch because this task extends the same drilldown chain and depends on F169 changes that main has not integrated`
- scope: frontend local business function: add a personal week calendar layer between group member matrix and personal single-day three-track detail, keep anomaly links direct to the day detail, add model test, browser smoke, and traceability.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --test scripts/tests/person-timeline.test.mjs` passed with 9 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed for group matrix -> personal week calendar -> personal day detail and anomaly direct day detail; final `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/person-timeline` dynamic routes, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F171 Group Member Week Matrix

- branch_name: `codex/f169-fulfillment-calendar`
- base_main_commit: `a3a134c`
- remote_status: `continued on pushed F169/F170 fulfillment calendar branch because this task extends the same drilldown chain and main has not integrated it`
- scope: frontend local business function: add a group member week matrix for `team+group` without `date`, preserve group member day matrix for `team+group+date`, link employee names to personal week calendar and week cells to personal day detail, add focused model test, browser smoke, and traceability.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --test scripts/tests/person-timeline.test.mjs` passed with 10 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed for group member week matrix, personal day detail, and existing group member day matrix; final `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/person-timeline` dynamic routes, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F172-F174 Group Member Week Matrix Closeout

- branch_name: `codex/f169-fulfillment-calendar`
- base_main_commit: `a3a134c`
- remote_status: `continued on pushed F169-F171 fulfillment calendar branch because this batch tightens the same drilldown chain and main has not integrated it`
- scope: coherent frontend closeout for group member week matrix: source-aware personal week return paths, day-header drilldown to group day matrix, group-level week summary, risk-priority ordering test, browser smoke, and traceability.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline routes and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: `node --test scripts/tests/person-timeline.test.mjs` passed with 10 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed for week summary, date-header day matrix drilldown, source-aware personal week return paths; final `bash scripts/check.sh` passed, including strict state check, state-check regression tests, frontend lint, typecheck, Next build with `/person-timeline` dynamic routes, and 25 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F175-F177 Fulfillment Risk Focus

- branch_name: `codex/f169-fulfillment-calendar`
- base_main_commit: `a3a134c`
- remote_status: `continued on pushed F169-F174 fulfillment calendar branch because this batch tightens the same drilldown chain and main has not integrated it`
- scope: coherent frontend enhancement for group member week matrix: add risk summary, all/gap/anomaly focus controls, matching risk-cell emphasis, browser smoke, and traceability.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, no new page route, no `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, lint, typecheck, in-app browser smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F178-F180 Exception Explanation Card Design

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `578d35f`
- remote_status: `local branch created from pushed fulfillment calendar branch because this design depends on the current履约日历 drilldown chain`
- scope: design and requirement split only for inline personal-day exception explanation cards, focused on supervisor handling context.
- allowed_files_check: `docs/**` and `tasks/backlog.yaml`; no frontend business code, backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: adds design spec plus draft raw requirements, draft user stories, draft backlog tasks, trace index mappings, and branch log entry; current story queue and active tasks remain empty pending PM Gate confirmation.
- check_result: strict state check, diff whitespace check, and final `bash scripts/check.sh` passed; current story queue and active tasks remained empty.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F178-F180 Exception Explanation Card Implementation

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `ff44369`
- remote_status: `continued from approved exception explanation card design branch`
- scope: frontend local business function: add typed exception explanations to personal daily view, render supervisor-facing exception explanation cards below the three-track timeline, and verify the small-group daily matrix anomaly marker enters the personal detail.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline model and existing personal detail route, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, no new page route, no `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, lint, typecheck, in-app browser smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F181-F183 Group Exception Side Panel

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `c3ca82e`
- remote_status: `continued on pushed exception explanation card branch because this batch completes the same supervisor handling chain`
- scope: frontend local business function: expose exception explanations on group single-day matrix members, render a supervisor-facing right-side explanation panel, select panel content from matrix anomaly markers, and keep personal detail drilldown.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, no new page route, no `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, lint, typecheck, in-app browser smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F184-F186 Group Exception Priority Queue

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `a7ed489`
- remote_status: `continued on pushed supervisor handling branch because this batch extends the same group single-day matrix panel`
- scope: frontend local business function: expose a sorted group-day exception queue, render a supervisor-facing queue in the existing right-side panel, allow queue item selection through the existing exception query parameter, and keep personal detail drilldown.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, no new page route, no `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, lint, typecheck, in-app browser smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F187-F189 Group Exception Queue Summary And Filter

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `64ed484`
- remote_status: `continued on pushed supervisor handling branch because this batch extends the same group exception queue panel`
- scope: frontend local business function: expose group-day exception queue summary, render summary metrics and display filters in the existing right-side panel, and keep current explanation plus personal detail drilldown synchronized with the selected filter.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, no new page route, no `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, lint, typecheck, in-app browser smoke for `queue=high` and `queue=status`, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F190-F192 Group Exception Matrix Focus

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `89bf8f1`
- remote_status: `continued on pushed supervisor handling branch because this batch extends the same group exception queue and matrix panel`
- scope: frontend local business function: expose focus event IDs on group exception queue items, highlight the selected member row, highlight related schedule/login/status track slices, and keep focus synchronized with queue filters and selected exception.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, no new page route, no `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, lint, typecheck, in-app browser smoke for `queue=status` and `queue=high`, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F193-F195 Exception Queue Cursor

- branch_name: `codex/f178-exception-explanation-card`
- base_main_commit: `3f9319b`
- remote_status: `continued on pushed supervisor handling branch because this batch extends the same group exception queue panel`
- scope: frontend local business function: expose a cursor for the visible group-day exception queue, render supervisor handling progress, previous/next queue movement, and a business empty state in the existing right-side panel.
- allowed_files_check: `app/person-timeline/**`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing person timeline route and model, focused model test, current and legacy traceability docs, and implementation plan; no new left sidebar entry, no new page route, no `/production-mvp/**` route, backend, package, lockfile, database, real integration, permission, approval, processing submission, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, SSR route smoke for `queue=all` and `queue=status`, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F241-F243 Schedule Draft Personnel Linkage

- branch_name: `codex/f241-personnel-schedule-draft-linkage`
- base_main_commit: `0c60fa5`
- remote_status: `not_pushed`
- scope: frontend local business function: connect personnel-level schedule rows to the schedule draft edit page, compute 0.5h interval linkage, and show summary count, linked people count, difference, status, and linked people.
- allowed_files_check: `app/schedule-plans/[planId]/edit/page.tsx`, `lib/personnel-schedule-details.ts`, `scripts/tests/personnel-schedule-details.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing schedule draft edit route and personnel schedule model/test plus current and legacy traceability docs; no new route, sidebar entry, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, product UI copy audit, typecheck, system Chrome smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F244-F246 Schedule Draft Timeline Links

- branch_name: `codex/f244-schedule-draft-timeline-links`
- base_main_commit: `d561eff`
- remote_status: `not_pushed`
- scope: frontend local business function: add fulfillment calendar personal-detail links to personnel interval trace people, render those links in the schedule draft edit page, and verify the drilldown preserves date, team, and group context.
- allowed_files_check: `app/schedule-plans/[planId]/edit/page.tsx`, `lib/personnel-schedule-details.ts`, `scripts/tests/personnel-schedule-details.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing schedule draft edit route and personnel schedule model/test plus current and legacy traceability docs; no new route, sidebar entry, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, product UI copy audit, browser smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F247-F249 Personal Schedule Source Drillback

- branch_name: `codex/f247-person-timeline-schedule-source`
- base_main_commit: `7204e24`
- remote_status: `not_pushed`
- scope: frontend local business function: show schedule draft source on fulfillment calendar personal daily detail, including plan and draft links, shift window, schedule detail ID, and related 0.5h interval count differences.
- allowed_files_check: `app/person-timeline/[employeeId]/page.tsx`, `lib/personnel-schedule-details.ts`, `scripts/tests/personnel-schedule-details.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing personal timeline route and personnel schedule model/test plus current and legacy traceability docs; no new route, sidebar entry, backend, package, lockfile, database, real integration, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, product UI copy audit, browser smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F250-F252 Supervisor Resolution Draft

- branch_name: `codex/f250-supervisor-resolution-draft`
- base_main_commit: `686e16d`
- remote_status: `not_pushed`
- scope: frontend local business function: add resolution-draft fields to fulfillment exception queue items and show suggested conclusion, required evidence, communication target, owner role, next review point, and open-risk text in the existing group-day exception panel.
- allowed_files_check: `app/person-timeline/page.tsx`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar route and model/test plus current and legacy traceability docs; no new route, sidebar entry, backend, package, lockfile, database, real integration, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, product UI copy audit, browser smoke, strict state check, diff whitespace check, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F253-F255 Supervisor Closure Checklist

- branch_name: `codex/f253-supervisor-closure-checklist`
- base_main_commit: `2a69f2a`
- remote_status: `not_pushed`
- scope: frontend local business function: add closure-checklist fields to fulfillment exception queue items and show ready/missing material counts, checklist item status, owner role, judgment impact, and current judgment in the existing group-day exception panel.
- allowed_files_check: `app/person-timeline/page.tsx`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar route and model/test plus current and legacy traceability docs; no new route, sidebar entry, backend, package, lockfile, database, real integration, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, product UI copy audit, browser smoke, strict state check, diff whitespace check, lint, typecheck, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F256-F258 Supervisor Queue Grouping

- branch_name: `codex/f256-supervisor-queue-grouping`
- base_main_commit: `5a4fb72`
- remote_status: `not_pushed`
- scope: frontend local business function: add supervisor review-group fields to fulfillment exception queue items, summarize missing-material/supervisor-judgment/data-check counts, and expose matching filters in the existing group-day exception panel.
- allowed_files_check: `app/person-timeline/page.tsx`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing fulfillment calendar route and model/test plus current and legacy traceability docs; no new route, sidebar entry, backend, package, lockfile, database, real integration, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model test, product UI copy audit, browser smoke, strict state check, diff whitespace check, lint, typecheck, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`

### F259-F261 Personal Detail Review Context

- branch_name: `codex/f259-person-detail-review-context`
- base_main_commit: `c475e91`
- remote_status: `not_pushed`
- scope: frontend local business function: expose daily review contexts on personal timeline views and show the selected exception review group, current judgment, and closure checklist on the existing personal daily three-track detail page.
- allowed_files_check: `app/person-timeline/[employeeId]/page.tsx`, `lib/person-timeline.ts`, `scripts/tests/person-timeline.test.mjs`, `docs/**`, and `tasks/backlog.yaml`; no backend, package, lockfile, database, real integration, auth, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: updates existing personal timeline detail route and person timeline model/test plus current and legacy traceability docs; no new route, sidebar entry, backend, package, lockfile, database, real integration, permission, submit/save action, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- check_result: target model tests, product UI copy audit, navigation regression, strict state check, diff whitespace check, typecheck, browser smoke, and final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
- blocked_reason: `N/A`
