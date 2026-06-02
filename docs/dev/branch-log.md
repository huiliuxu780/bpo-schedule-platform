# Branch Log

## 2026-06-01

### IM050 shadcn/ui Automated Verification Gate

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 21 before IM050`
- scope: add local shadcn/ui convention checker, baseline file, Node tests, `bash scripts/check.sh` integration, and traceability records.
- allowed_files_check: `scripts/check.sh`, `scripts/check-shadcn-ui.mjs`, `scripts/shadcn-ui-baseline.json`, `scripts/tests/check-shadcn-ui.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no product UI, backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: shadcn checker script, checker tests, baseline file, check.sh wiring, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `scripts/check-shadcn-ui.mjs` was missing; target checker tests passed with 3 tests; real project checker passed with 5 documented baseline violations and no new violations; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, shadcn checker tests, real shadcn project scan, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM047 Apply Readiness Issue Grouping

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 18 before IM047`
- scope: add read-only apply-readiness issue grouping on `/data-quality/[batchId]`, including failed-row, row-required-field, version, application, batch-blocker, ready, and unknown groups, model test coverage, browser smoke, and traceability records.
- allowed_files_check: `components/import-center-batch-inspector-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: readiness issue grouping helper, status-check panel grouping cards, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: TDD red test failed first because `summarizeImportReadinessIssueGroups` was missing; target model test passed with 30 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no hardcoded color drift or old split-layout copy in touched frontend files; in-app browser smoke passed for readiness issue grouping labels and empty console errors; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM046 Field Mapping Template Fit Detail

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 17 before IM046`
- scope: add read-only field-mapping template fit detail on `/data-quality/[batchId]`, including recommended template, current file-type coverage, suggested standard-field gaps, source-to-standard mapping rows, model test coverage, and traceability records.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-template-management-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-template-management-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `summarizeImportTemplateFitDetail` was missing; target model test passed with 29 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no `space-x/space-y`, hardcoded grayscale/amber/emerald classes, old split-layout copy, `分层详情`, or `选中批次状态检查器` in touched frontend files; in-app browser smoke passed for the template fit tab, coverage/gap labels, mapping table labels, and empty console errors; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

## 2026-05-31

### IM030 Import Center Template Visibility

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `d3ce9a7`
- remote_status: `continuing from local ahead commit on codex/import-center-api-vertical`
- scope: Add read-only field-mapping template management visibility on `/data-quality`: template inventory summary, active/inactive counts, covered file type count, mapped-field count, template cards, model summary helper/tests, page smoke, current queue cleanup, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-model.ts`, `components/import-center-template-management-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend files, dependency files, lockfiles, schema/migration files, template create/update/deactivate buttons, external integration, auth, permission, approval, export, batch operation, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `/data-quality` template panel wiring, new read-only import-center template management panel, import-center template inventory summary helper, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import-center model test first failed because `summarizeImportFieldMappingTemplates` did not exist; after implementation target model tests passed with 15 tests; `npm run lint` passed; `npm run typecheck` passed; local template API smoke returned `TPL-IM027-SMOKE-001`; `/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` smoke returned `200` and contained template inventory text and template id; final `bash scripts/check.sh` passed with strict state check, frontend build, and backend unittest.
- local_commit_sha: reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM confirmation`
- blocked_reason: `N/A`

### IM029 Import Center Row Correction Feedback

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `9e15bc9`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add failed-row correction result feedback on `/data-quality`: correction notice model helper, success/failure result panel, remaining failed-row guidance, business-readable failure reasons, model tests, page smoke, current queue cleanup, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-model.ts`, `components/import-center-row-correction-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend files, dependency files, lockfiles, schema/migration files, apply write buttons, batch correction, template CRUD, external integration, auth, permission, approval, export, batch operation, production formula, settlement rule, or charge-factor files.
- scope_diff_check: import-center correction notice helper, row correction panel result block, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import-center model tests passed with 14 tests; `npm run lint` passed; `npm run typecheck` passed; local API smoke returned persisted import batches; `/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` smoke returned `200` and contained correction success and remaining failed-row text; `/data-quality?batch=BATCH-IM026-SMOKE-004&correction=failed&reason=invalid_json&row=1` smoke returned `200` and contained business-readable invalid JSON failure text; final `bash scripts/check.sh` passed with strict state check, frontend build, and backend unittest.
- local_commit_sha: reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM confirmation`
- blocked_reason: `N/A`

## 2026-05-29

### IM028 Import Center Batch Detail Drilldown

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `0fbf690`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add first selected-batch detail drilldown slice on `/data-quality`: persisted detail summary, version list, all row results, standard field previews, import-center model summary helpers/tests, page smoke, current queue cleanup, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-batch-detail-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend files, dependency files, lockfiles, schema/migration files, apply write buttons, batch correction, template CRUD, external integration, auth, permission, approval, export, batch operation, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `/data-quality` detail panel wiring, new import-center batch detail panel, import-center detail summary/row status helpers, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import-center model tests passed with 12 tests; `npm run lint` passed; `npm run typecheck` passed; local API smoke returned persisted import batches; `/data-quality?batch=BATCH-IM026-SMOKE-004` smoke returned `200` and contained batch detail, version record, all row results, selected batch id, and `REQUIRED_FIELD_MISSING`; final `bash scripts/check.sh` passed with strict state check, frontend build, and 160 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM027 Import Center Field Mapping Template Selection

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `8aac380`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add first field-mapping template selection slice on `/data-quality`: fetch existing templates, show template selector and summaries in the CSV upload form, submit `template_id` through the existing upload server action, keep manual JSON fallback, add import-center model helpers/tests, local template upload smoke, current queue cleanup, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend files, dependency files, lockfiles, schema/migration files, template CRUD UI, external integration, auth, permission, approval, export, batch operation, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `/data-quality` template fetch and upload action parameter, import-center upload form template selector and template summaries, import-center template URL/summary helpers, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import-center model tests passed with 10 tests; `npm run lint` passed; `npm run typecheck` passed; local template API smoke created `TPL-IM027-SMOKE-001`; local upload API smoke created `BATCH-IM027-SMOKE-001` using `template_id`; production `/data-quality?batch=BATCH-IM027-SMOKE-001` smoke on temporary port 3022 returned `200`; final `bash scripts/check.sh` passed with strict state check, frontend build, and 160 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM026 Import Center Failed Row Correction UI

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `3cfd276`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add first failed-row correction UI slice on `/data-quality`: selected batch detail fetch, failed rows table, per-row correction server action, import-center model helpers/tests, local correction smoke, current queue cleanup, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `components/import-center-row-correction-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend files, dependency files, lockfiles, schema/migration files, batch correction, apply write actions, external integration, auth, permission, approval, export, batch operation, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `/data-quality` batch detail fetch and correction action, failed-row correction panel, import-center detail/correction URL helpers, failed-row preview helper, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import-center model tests passed with 7 tests; `npm run lint` passed; `npm run typecheck` passed; local upload API smoke created failed-row batches `BATCH-IM026-SMOKE-003` and `BATCH-IM026-SMOKE-004`; row correction API smoke corrected `BATCH-IM026-SMOKE-003` row 1; `/data-quality?batch=BATCH-IM026-SMOKE-004` HTTP smoke returned `200`; final `bash scripts/check.sh` passed with strict state check, frontend build, and 160 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM025 Import Center CSV Upload Form

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `260a97a`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add first CSV upload form slice on `/data-quality`: Next server action, upload form UI, import upload URL model helper, model tests, local upload smoke, current queue cleanup, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend files, dependency files, lockfiles, schema/migration files, Excel/multipart, apply write actions, external integration, auth, permission, approval, export, batch operation, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `/data-quality` upload action/form, import-center upload URL model, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import-center model tests passed with 5 tests; `npm run lint` passed; `npm run typecheck` passed; local upload API smoke created `BATCH-IM025-SMOKE-001`; `/data-quality?batch=BATCH-IM025-SMOKE-001` HTTP smoke returned `200`; final `bash scripts/check.sh` passed with strict state check, frontend build, and 160 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM024 Import Center Frontend API Wiring

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `7cbbad6`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add first read-only import-center frontend API wiring slice: `/data-quality` page, import batch/readiness API rendering, sidebar links, model tests, current queue cleanup, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/app-sidebar.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no backend files, dependency files, lockfiles, schema/migration files, upload write actions, apply write actions, external integration, auth, permission, approval, export, batch operation, production formula, settlement rule, or charge-factor files.
- scope_diff_check: `/data-quality` page, import-center API panel/model, sidebar data/import links, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import-center model tests passed with 4 tests; `npm run lint` passed; `npm run typecheck` passed; Node 22 `npm run build` passed; local API smoke returned `{"items":[]}`; `/data-quality` HTTP smoke returned `200`; final `bash scripts/check.sh` passed with strict state check, frontend build, and 160 backend unittest after rerun with network permission for `next/font`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM023 Personnel Actual Apply Readiness Guard

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `f5bfacd`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Extend apply-before-write readiness guard to personnel_schedule and actual-log import apply routes: route guard, API tests, current queue cleanup, and traceability records.
- allowed_files_check: `backend/app/main.py`, `backend/tests/test_personnel_schedule_import_api.py`, `backend/tests/test_actual_log_import_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, deep master-data reference validation, batch operation, external integration, auth, permission, approval, export, production formula, settlement rule, or charge-factor files.
- scope_diff_check: personnel_schedule/actual apply readiness guard, API tests for `IMPORT_APPLY_NOT_READY`, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target personnel/actual apply API tests passed with 10 tests; adjacent four-type apply/readiness regression passed with 27 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 160 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM022 Import Apply Readiness Guard

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `ac4e8e2`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add apply-before-write readiness guard for master_data and demand_forecast import apply routes: route guard, API tests, current queue cleanup, and traceability records.
- allowed_files_check: `backend/app/main.py`, `backend/tests/test_master_data_import_api.py`, `backend/tests/test_forecast_import_api.py`, `backend/tests/test_import_application_summary_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, deep master-data reference validation, batch operation, external integration, auth, permission, approval, export, production formula, settlement rule, or charge-factor files.
- scope_diff_check: master_data/forecast apply readiness guard, API tests for `IMPORT_APPLY_NOT_READY`, application-summary fixture version alignment, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target master_data/forecast apply API tests passed with 10 tests; adjacent apply/readiness regression passed with 25 tests; application-summary regression passed with 14 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 158 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM021 Import Row Readiness Precheck

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `f30ee22`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add row-level required-field precheck to the existing read-only import apply-readiness response: response model, readiness service validation, API tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_readiness.py`, `backend/app/models.py`, `backend/tests/test_import_readiness_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, auto-apply, deep master-data reference validation, batch operation, external integration, auth, permission, approval, export, production formula, settlement rule, or charge-factor files.
- scope_diff_check: import readiness row blocker response model, readiness service required-field precheck, readiness API tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import readiness tests passed with 7 tests; adjacent import API regression passed with 32 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 156 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM020 Import Apply Readiness

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `22ff9fd`
- remote_status: `continuing from pushed origin/codex/import-center-api-vertical`
- scope: Add first read-only import apply-readiness slice over existing import batch, row, version, and application-summary data: readiness service, API route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_readiness.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_import_readiness_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, auto-apply, deep master-data validation, batch operation, external integration, auth, permission, approval, export, production formula, settlement rule, or charge-factor files.
- scope_diff_check: import readiness response models, readiness service, API route, API tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import readiness tests passed with 5 tests; adjacent import API regression passed with 25 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 154 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM019 Import Mapping Template Update Deactivate

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `b74326f`
- remote_status: `continuing from local codex/import-center-api-vertical; branch is ahead of origin by IM018`
- scope: Add first field-mapping template update/deactivate slice over the existing template table: repository methods, API routes, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_mapping_persistence.py`, `backend/app/main.py`, `backend/app/models.py`, mapping/upload tests, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, physical delete, batch operation, external integration, auth, permission, approval, export, production formula, settlement rule, or charge-factor files.
- scope_diff_check: field-mapping template update request model, repository update/deactivate methods, update/deactivate API routes, mapping/upload tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target mapping/update/upload tests passed with 19 tests; adjacent import API regression passed with 11 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 149 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM018 Import Batch Status List

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `f73be51`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add read-only import batch list/status query over existing import batch, version, and application-summary data: repository list method, API route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_persistence.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_import_batch_list_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, pagination, export, batch operation, external integration, auth, permission, approval, production formula, settlement rule, or charge-factor files.
- scope_diff_check: import batch list response model, import repository list method, read-only API route, API tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import batch list tests passed with 3 tests; adjacent import API regression passed with 18 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 143 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM017 Import Failed Row Correction

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `33115b6`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add first failed import row correction slice over existing import batch and row-result tables: repository update method, API route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_persistence.py`, `backend/app/main.py`, `backend/app/models.py`, import persistence/correction API tests, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, correction-history table, batch correction, auto-apply, Excel/multipart, external integration, auth, permission, approval, export, production formula, settlement rule, or charge-factor files.
- scope_diff_check: import failed-row correction request model, repository method, API route, repository/API tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target failed-row correction tests passed with 7 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 140 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM016 Import Field Mapping Templates

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `3ad0cde`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add first persisted import field-mapping template slice: mapping template table/migration, repository, create/list/get APIs, upload-csv template reuse, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_mapping_persistence.py`, `backend/app/import_upload.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/migrations/versions/20260529_0008_import_mapping_templates.py`, mapping/upload/database tests, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, frontend files, Excel/multipart, external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: import mapping template repository/model/API/migration, upload-csv template reuse, mapping/upload/database tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target mapping/upload/database tests passed with 15 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 134 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

## 2026-05-28

### IM015 Import Application Summary

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `de5223b`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add read-only import batch application summary API over existing import and domain repositories, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_application_summary.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_import_application_summary_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, template persistence, field-mapping CRUD, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: read-only import application summary service/model/API route, application-summary API tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target application-summary API tests passed with 4 tests; adjacent import API regression passed with 19 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 124 backend unittest.
- local_commit_sha: pending.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM014 Actual Log Apply Idempotency

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `d1e7f0d`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add first import-apply idempotency guard for login_log and status_log batches: existing actual-log import-version detection, response status, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/actual_log_import.py`, `backend/app/actual_log_persistence.py`, `backend/app/models.py`, `backend/app/main.py`, `backend/tests/test_actual_log_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, idempotency table, task queue, other import apply type, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: actual_logs apply response status, DB006 login/status import-version applied detection, duplicate apply no-write guard, API/service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target actual log import apply tests passed with 13 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 120 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM013 Demand Forecast Apply Idempotency

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `a31adc0`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add first import-apply idempotency guard for demand_forecast batches: existing forecast import-version detection, response status, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/forecast_import.py`, `backend/app/forecast_persistence.py`, `backend/app/models.py`, `backend/app/main.py`, `backend/tests/test_forecast_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, idempotency table, task queue, other import apply type, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: demand_forecast apply response status, DB005 forecast import-version applied detection, duplicate apply no-write guard, API/service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target demand_forecast import apply tests passed with 11 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 117 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM012 Personnel Schedule Apply Idempotency

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `bcc6e27`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add first import-apply idempotency guard for personnel_schedule batches: existing schedule import-version detection, response status, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/personnel_schedule_import.py`, `backend/app/personnel_schedule_persistence.py`, `backend/app/models.py`, `backend/app/main.py`, `backend/tests/test_personnel_schedule_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, idempotency table, task queue, other import apply type, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: personnel_schedule apply response status, DB004 schedule import-version applied detection, duplicate apply no-write guard, API/service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target personnel_schedule import apply tests passed with 9 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 115 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM011 Master Data Apply Idempotency

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `360a4f9`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add first import-apply idempotency guard for master_data batches: existing-batch application detection, response status, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/master_data_import.py`, `backend/app/master_data_persistence.py`, `backend/app/models.py`, `backend/app/main.py`, `backend/tests/test_master_data_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, idempotency table, task queue, other import apply type, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: master_data apply response status, DB003 batch-applied detection, duplicate apply no-write guard, API/service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target master_data import apply tests passed with 9 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 113 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM010 Idempotent Rerun Guards

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `a2bf76c`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add first idempotent rerun guards for duplicate comparison calculate and review closure write requests: API/service behavior, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/main.py`, `backend/app/review_closure.py`, `backend/tests/test_comparison_calculation_api.py`, `backend/tests/test_review_closure_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, idempotency table, task queue, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: comparison calculate existing-run return guard, review closure existing-case return guard, idempotency API tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target idempotent rerun API tests passed with 6 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 111 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM009 Persisted Result List Query APIs

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `58be918`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add read-only list query filters for persisted DB007 comparison runs and DB008 review cases: repository filters, FastAPI routes, response models, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/comparison_persistence.py`, `backend/app/review_persistence.py`, `backend/tests/test_result_list_query_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: persisted result list response models, DB007/DB008 repository filters, FastAPI list routes, API/repository tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target persisted result list query tests passed with 6 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 109 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM008 Persisted Result Query APIs

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `f5948e8`
- remote_status: `continuing from origin/codex/import-center-api-vertical`
- scope: Add local read APIs for persisted DB007 comparison runs and DB008 review cases: FastAPI routes, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/main.py`, `backend/tests/test_result_query_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: persisted result query FastAPI read routes, API tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target persisted result query tests passed with 6 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 103 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM007 Review Closure Write API

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `f4dc45c`
- remote_status: `continuing pushed origin/codex/import-center-api-vertical`
- scope: Add local DB008 review closure write vertical: service orchestration, FastAPI route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/review_closure.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_review_closure*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external evidence service, auth, permission, approval workflow, export, batch, production formula, settlement rule, or charge-factor files.
- scope_diff_check: review closure write service, FastAPI write route, API and service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target review closure write tests passed with 4 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 97 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM006 Comparison Calculation Trigger

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `4fa5c49`
- remote_status: `continuing pushed origin/codex/import-center-api-vertical`
- scope: Add local comparison calculation trigger into DB007 for forecast-vs-schedule and schedule-vs-actual results: service calculation, FastAPI route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/comparison_calculation.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_comparison_calculation*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch, production status-code/formula finalization, automatic scheduling, settlement rule, or charge-factor files.
- scope_diff_check: comparison calculation service, FastAPI calculate route, API and service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target comparison calculation tests passed with 5 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 93 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM005 Actual Log Import Application

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `198ea45`
- remote_status: `continuing pushed origin/codex/import-center-api-vertical`
- scope: Apply persisted `login_log` and `status_log` CSV success rows into DB006 actual log repositories: service conversion, FastAPI apply route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/actual_log_import.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_actual_log_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch, status-code production rule, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: actual-log import application service, FastAPI apply route, API and service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target actual-log import application tests passed with 10 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 88 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM004 Demand Forecast Import Application

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `af10083`
- remote_status: `continuing pushed origin/codex/import-center-api-vertical`
- scope: Apply persisted `demand_forecast` CSV success rows into DB005 forecast repositories: service conversion, FastAPI apply route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/forecast_import.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_forecast_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: demand-forecast import application service, FastAPI apply route, API and service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target demand-forecast import application tests passed with 9 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 78 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM003 Personnel Schedule Import Application

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `f3d9895`
- remote_status: `continuing pushed origin/codex/import-center-api-vertical`
- scope: Apply persisted `personnel_schedule` CSV success rows into DB004 personnel schedule repositories: service conversion, FastAPI apply route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/personnel_schedule_import.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_personnel_schedule_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch rescheduling, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: personnel-schedule import application service, FastAPI apply route, API and service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target personnel-schedule import application tests passed with 7 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 69 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM002 Master Data Import Application

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `542c528`
- remote_status: `continuing pushed origin/codex/import-center-api-vertical`
- scope: Apply persisted `master_data` CSV success rows into DB003 master data repositories: service conversion, FastAPI apply route, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/master_data_import.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_master_data_import*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: master-data import application service, FastAPI apply route, API and service tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target master-data import application tests passed with 7 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed with 62 backend unittest.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### IM001 Import Center CSV Upload API Vertical

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `not_pushed`
- scope: Implement the first import-center CSV upload API vertical only: `text/csv` raw body parsing, field mapping, row-level success/failure results, default import version generation, persistence through the existing import repository, backend tests, and traceability cleanup.
- allowed_files_check: `backend/app/import_upload.py`, `backend/app/main.py`, `backend/app/models.py`, `backend/tests/test_import_upload*.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, legacy traceability docs, and `tasks/backlog.yaml`; no dependency files, migration files, frontend files, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: import upload service, FastAPI upload route, import upload backend tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log.
- check_result: target import upload tests passed with 6 tests; backend unittest discovery passed with 55 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending after verified local commit`
- blocked_reason: `N/A`

### Q127 Database Foundation QA

- branch_name: `codex/q127-database-foundation-qa`
- base_main_commit: `a3a134c`
- base_chain_commit: `138292d`
- remote_status: `pushed to origin/codex/q127-database-foundation-qa after PM confirmation`
- scope: Verify the DB002-DB008 database foundation only: Alembic head table coverage, minimum end-to-end persistence chain, QA report, and traceability cleanup.
- allowed_files_check: `backend/tests/**`, `docs/**`, and `tasks/backlog.yaml`; no `backend/app/**`, `backend/migrations/**`, `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend database foundation QA test, QA closeout report, current queue cleanup, registry trace index, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: target Q127 unittest passed; backend unittest discovery passed with 49 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `a86dc3d`
- integration_status: `ready_for_review`
- integration_method: `draft PR`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation; PR opened and marked ready for review at https://github.com/huiliuxu780/bpo-schedule-platform/pull/1`
- blocked_reason: `N/A`

### DB008 Review Closure Persistence

- branch_name: `codex/db008-review-closure-persistence`
- base_main_commit: `a3a134c`
- base_chain_commit: `20b3fa2`
- remote_status: `pushed to origin/codex/db008-review-closure-persistence after PM confirmation`
- scope: Implement the confirmed review closure persistence foundation only: review cases, evidence records, conclusions, closure records, comparison-result source references, Alembic migration, backend tests, and traceability cleanup.
- allowed_files_check: `backend/**`, `docs/**`, `tasks/backlog.yaml`, and `alembic.ini`; no `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend review models/repository/tests, Alembic migration files, current queue cleanup, registry trace index, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: worker subagent target DB008 unittest passed after RED failure; main worker added missing source business-date check; Alembic upgrade against isolated SQLite passed; backend unittest discovery passed with 47 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `138292d`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `N/A`

### DB007 Comparison Result Persistence

- branch_name: `codex/db007-comparison-result-persistence`
- base_main_commit: `a3a134c`
- base_chain_commit: `ec3a1f4`
- remote_status: `pushed to origin/codex/db007-comparison-result-persistence after PM confirmation`
- scope: Implement the confirmed comparison result persistence foundation only: comparison runs, forecast-vs-schedule result rows, schedule-vs-actual result rows, source version/record reference checks, Alembic migration, backend tests, and traceability cleanup.
- allowed_files_check: `backend/**`, `docs/**`, `tasks/backlog.yaml`, and `alembic.ini`; no `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend comparison models/repository/tests, Alembic migration files, current queue cleanup, registry trace index, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: worker subagent target DB007 unittest passed after RED failure; main worker added missing source-dimension checks; Alembic upgrade against isolated SQLite passed; backend unittest discovery passed with 41 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `20b3fa2`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `N/A`

### DB006 Actual Log Persistence

- branch_name: `codex/db006-actual-log-persistence`
- base_main_commit: `a3a134c`
- base_chain_commit: `e40d548`
- remote_status: `pushed to origin/codex/db006-actual-log-persistence after PM confirmation`
- scope: Implement the confirmed login/status log persistence foundation only: login/logout events, status dictionary, status intervals, business-day splitting, timezone checks, import/master-data reference checks, Alembic migration, backend tests, and traceability cleanup.
- allowed_files_check: `backend/**`, `docs/**`, `tasks/backlog.yaml`, and `alembic.ini`; no `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend actual log models/repository/tests, Alembic migration files, current queue cleanup, registry trace index, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: worker subagent target DB006 unittest passed after RED failure; main worker added missing login employee and unknown status checks; Alembic upgrade against isolated SQLite passed; backend unittest discovery passed with 34 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `ec3a1f4`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `N/A`

### DB005 Demand Forecast Persistence

- branch_name: `codex/db005-demand-forecast-persistence`
- base_main_commit: `a3a134c`
- base_chain_commit: `bc971ea`
- remote_status: `pushed to origin/codex/db005-demand-forecast-persistence after PM confirmation`
- scope: Implement the confirmed demand forecast persistence foundation only: forecast versions, forecast interval rows, skill/level demand alignment, import source references, version change records, Alembic migration, backend tests, and traceability cleanup.
- allowed_files_check: `backend/**`, `docs/**`, `tasks/backlog.yaml`, and `alembic.ini`; no `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend forecast models/repository/tests, Alembic migration files, current queue cleanup, registry trace index, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: target DB005 unittest passed after RED failure; Alembic upgrade against isolated SQLite passed; backend unittest discovery passed with 28 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `e40d548`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `N/A`

### DB004 Personnel Schedule Persistence

- branch_name: `codex/db004-personnel-schedule-persistence`
- base_main_commit: `a3a134c`
- base_chain_commit: `1686b19`
- remote_status: `pushed to origin/codex/db004-personnel-schedule-persistence after PM confirmation`
- scope: Implement the confirmed personnel schedule persistence foundation only: schedule versions, shift types, personnel schedule details, half-hour intervals, import/master-data reference checks, Alembic migration, backend tests, and traceability cleanup.
- allowed_files_check: `backend/**`, `docs/**`, `tasks/backlog.yaml`, and `alembic.ini`; no `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend personnel schedule models/repository/tests, Alembic migration files, current queue cleanup, registry trace index, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: target DB004 unittest passed after RED failure; Alembic upgrade against isolated SQLite passed; backend unittest discovery passed with 25 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `bc971ea`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `N/A`

### DB003 Master Data Persistence

- branch_name: `codex/db003-master-data-persistence`
- base_main_commit: `a3a134c`
- base_chain_commit: `d7fabc8`
- remote_status: `pushed to origin/codex/db003-master-data-persistence after PM confirmation`
- scope: Implement the confirmed master data persistence foundation only: employees, suppliers, workplaces, projects, skills, employee bindings, effective dates, freeze status, reference checks, Alembic migration, backend tests, and traceability cleanup.
- allowed_files_check: `backend/**`, `docs/**`, `tasks/backlog.yaml`, and `alembic.ini`; no `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend master data models/repository/tests, Alembic migration files, current queue cleanup, registry trace index, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: target DB003 unittest passed after RED failure; Alembic upgrade against isolated SQLite passed; backend unittest discovery passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `1686b19`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `N/A`

### DB002 Import Persistence Foundation

- branch_name: `codex/db001-database-gate-plan`
- base_main_commit: `a3a134c`
- base_chain_commit: `bc07c05`
- remote_status: `pushed to origin/codex/db001-database-gate-plan after PM confirmation`
- scope: Implement the confirmed import persistence foundation only: import batches, row results, failed row details, generated version records, SQLAlchemy repository, Alembic migration, FastAPI endpoints, backend tests, and traceability cleanup.
- allowed_files_check: `backend/**`, `docs/**`, `tasks/backlog.yaml`, and `alembic.ini`; no `app/**`, `components/**`, `lib/**`, JS package/lockfiles, real external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: backend import persistence models/repository/routes/tests, Alembic migration files, backend requirements, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, implementation plan, and branch log.
- check_result: target DB002 unittest passed; Alembic upgrade against isolated SQLite passed; backend unittest discovery passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `d7fabc8`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `N/A`

### DB002 Import Persistence Preflight

- branch_name: `codex/db001-database-gate-plan`
- base_main_commit: `a3a134c`
- base_chain_commit: `2b71bfe`
- remote_status: `db001_pushed`
- scope: Seed DB002 as a blocked current task with explicit PM confirmations required before database implementation starts.
- allowed_files_check: `docs/**` and `tasks/backlog.yaml`; no backend, app, components, lib, package, lockfile, migration, ORM, repository, schema, database connection, production persistence config, external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: current queue, active tasks, blockers, raw requirements, user stories, backlog, audit, task log, project context, and branch log.
- check_result: `bash scripts/check-state.sh --strict` passed with blocked DB002; `git diff --check` passed; final `bash scripts/check.sh` passed.
- local_commit_sha: `bc07c05`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed after PM confirmation`
- blocked_reason: `database engine, dependency/package-change allowance, ORM/migration tool, and test database setup are not confirmed`

### DB001 Database Gate Plan

- branch_name: `codex/db001-database-gate-plan`
- base_main_commit: `a3a134c`
- remote_status: `not_pushed`
- scope: Define database Gate planning and future persistence workflow boundaries without implementing database code.
- allowed_files_check: `docs/**` and `tasks/backlog.yaml`; no backend, app, components, lib, package, lockfile, migration, ORM, repository, schema, database connection, production persistence config, external integration, auth, permission, approval, export, batch, automatic scheduling, production formula, settlement rule, or charge-factor files.
- scope_diff_check: current queue, active tasks, raw requirements, user stories, backlog, Gate Registry, database Gate plan, implementation plan, audit, task log, project context, and branch log.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `bash scripts/check.sh` passed after clearing stale cross-branch `.next` generated types.
- local_commit_sha: `2b71bfe`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `ask PM after verified local commit`
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

### IM044 Data Quality Second-Level Detail Navigation

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 15 before IM044`
- scope: move batch processing entry to `/data-quality/[batchId]`, remove the status checker from `/data-quality`, keep old `/data-quality/import-batches/[batchId]` as a redirect, preserve correction query feedback, model test coverage, and traceability records.
- allowed_files_check: `app/data-quality/page.tsx`, `app/data-quality/[batchId]/page.tsx`, `app/data-quality/import-batches/[batchId]/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-batch-list-panel.tsx`, `components/import-center-batch-inspector-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `app/data-quality/import-batches/[batchId]/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `buildImportBatchProcessingHref` still returned `/data-quality/import-batches/[batchId]`; target model test passed with 28 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no `space-x/space-y` or hardcoded grayscale classes in touched frontend files; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; in-app browser smoke passed for list-only workbench, second-level detail page, legacy redirect, and empty console errors; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM045 Data Quality Single Column Detail Workflow

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 16 before IM045`
- scope: redesign `/data-quality/[batchId]` from left-right split to single-column batch processing flow, add processing overview cards, move status check into the first full-width tab, preserve correction query feedback, model test coverage, and traceability records.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-detail-tabs.tsx`, `components/import-center-batch-inspector-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-detail-tabs.tsx`, `components/import-center-batch-inspector-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `summarizeImportPageHierarchy` still returned old detail tabs and `row-correction` default; target model test passed with 28 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no `space-x/space-y`, hardcoded grayscale classes, old left-right split class, `分层详情`, or `选中批次状态检查器` in touched frontend files; in-app browser smoke passed for single-column processing flow, visible correction feedback, and empty console errors; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
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

### IM031 Import Center Template Fit Hints

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 2 before IM031`
- scope: upload-before template fit hints, `/data-quality` route loading fallback removal, model test coverage, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/loading.tsx`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: target model test passed with 16 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed after removing `/data-quality/loading.tsx`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM032 Import Center Apply Action Guidance

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 3 before IM032`
- scope: apply-before action guidance, model test coverage, `/data-quality` readiness-side UI, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: target model test passed with 17 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed for `应用前行动建议`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM033 Import Center Exception Guidance

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 4 before IM033`
- scope: exception-state action guidance, model test coverage, `/data-quality` read-only guidance panel, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: target model test passed with 18 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed for `异常态处理建议`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM041A Import Center Data Quality Page IA Refactor

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 12 before IM041A`
- scope: `/data-quality` information architecture, overview/workbench/inspector/detail-tabs component split, hierarchy model test coverage, page smoke, and traceability records.
- allowed_files_check: `app/data-quality/page.tsx`, `components/import-center-api-panel.tsx`, new import-center frontend component files, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: same as allowed scope; `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `summarizeImportPageHierarchy` was not exported; target model test passed with 26 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no `space-x/space-y` or hardcoded grayscale classes in the touched frontend files; page smoke passed on `http://127.0.0.1:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` for `接入批次工作台`, `选中批次状态检查器`, `分层详情`, and `导入与模板`; in-app browser verified the workbench no longer collapses before detail tabs and verified detail Tabs use column layout after PM screenshot exposed the row-layout overlap; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM043 Data Quality Batch Detail Page Split

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 14 before IM043`
- scope: split `/data-quality` batch workbench from `/data-quality/import-batches/[batchId]` processing detail page, add detail entry links, keep correction query feedback, model test coverage, and traceability records.
- allowed_files_check: `app/data-quality/page.tsx`, `app/data-quality/import-batches/[batchId]/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-batch-list-panel.tsx`, `components/import-center-batch-inspector-panel.tsx`, `components/import-center-detail-tabs.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/page.tsx`, `app/data-quality/import-batches/[batchId]/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-batch-list-panel.tsx`, `components/import-center-batch-inspector-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `buildImportBatchProcessingHref` was not exported; target model test passed with 28 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; in-app browser smoke passed for workbench/detail split and empty console errors; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM042 Import Center Result Trace Lists

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 13 before IM042`
- scope: selected-batch business-date comparison/review result list visibility, result trace tab, model test coverage, `/data-quality` detail UI, and traceability records.
- allowed_files_check: `app/data-quality/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-detail-tabs.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-detail-tabs.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `buildImportComparisonRunsUrl` was not exported; target model test passed with 27 tests; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests; in-app browser smoke passed for four detail tabs, result trace tab content, and empty browser console errors.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM034 Import Center Upload Result Batch Entry

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 5 before IM034`
- scope: upload result guidance, batch review link, model test coverage, `/data-quality` upload result UI, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/page.tsx`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: target model test passed with 19 tests; `npm run lint` passed; `npm run typecheck` passed; in-app browser smoke passed for upload success/failure result guidance; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM040 Import Center Downstream Result Navigation

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 11 before IM040`
- scope: selected-batch read-only downstream result navigation, comparison/review API path guidance, model test coverage, `/data-quality` readiness-side UI, and traceability records.
- allowed_files_check: `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `summarizeImportDownstreamResultNavigation` was not exported; target model test passed with 25 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no `space-x/space-y` or hardcoded grayscale classes in the touched frontend files; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests; page smoke passed on `http://127.0.0.1:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` for `下游结果导航`; in-app browser verified `#import-apply-readiness` shows the new panel.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM035 Import Center Access Batch Filters

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 6 before IM035`
- scope: access-batch keyword/file-type/processing-status/application-status filters, no-match empty state, model test coverage, `/data-quality` batch-list UI, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/page.tsx`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: target model test passed with 20 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests; in-app browser route was unavailable, so local HTTP smoke passed on `http://127.0.0.1:3023/data-quality` filter and no-match URLs.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM036 Import Center Selected Batch Review Navigation

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 7 before IM036`
- scope: selected-batch review guide, anchor navigation to batch detail/failed-row correction/apply-readiness, model test coverage, `/data-quality` guidance UI, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `components/import-center-batch-detail-panel.tsx`, `components/import-center-row-correction-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `components/import-center-batch-detail-panel.tsx`, `components/import-center-row-correction-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: target model test passed with 21 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests; page smoke passed on `http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` for `批次处理导览`, section anchors, and selected-batch link hash.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM037 Import Center Application Status Visibility

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 8 before IM037`
- scope: selected-batch read-only application status overview, model test coverage, `/data-quality` readiness-side UI, and traceability records.
- allowed_files_check: `app/data-quality/**`, `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-api-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `summarizeImportApplicationVisibility` was not exported; target model test passed with 22 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests; page smoke passed on `http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` for `应用状态概览`, `应用目标`, `导入版本`, and `已应用记录`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM038 Import Center Batch Detail Readability

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 9 before IM038`
- scope: batch-detail processing summary, next-step guidance, error-field summary, row-level error-field column, model test coverage, `/data-quality` detail UI, and traceability records.
- allowed_files_check: `components/import-center-batch-detail-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-batch-detail-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `formatImportRowErrorField` was not exported; target model test passed with 23 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests; page smoke passed on `http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` for `处理摘要`, `错误字段`, and `下一步`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM039 Import Center Data Quality To Exception Trace Visibility

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 10 before IM039`
- scope: selected-batch read-only downstream exception impact trace, quality evidence, next-step guidance, model test coverage, `/data-quality` detail UI, and traceability records.
- allowed_files_check: `components/import-center-batch-detail-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-batch-detail-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, external integration, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `summarizeImportQualityExceptionTrace` was not exported; target model test passed with 24 tests; `npm run lint` passed; `npm run typecheck` passed; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests; page smoke passed on `http://localhost:3021/data-quality?batch=BATCH-IM026-SMOKE-004&correction=success&row=1` for `履约异常影响追踪`, `影响链路`, `质量证据`, and `只读追踪`.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`
### IM048 Import Center Downstream Result Drilldown

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 19 before IM048`
- scope: read-only downstream result drilldown in `/data-quality/[batchId]`, model helper/test coverage, result trace panel hierarchy, and traceability records.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- check_result: TDD red test failed first because `summarizeImportDownstreamResultDrilldown` was not exported; target model test passed with 32 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no `space-x/space-y` or hardcoded grayscale classes in touched frontend files; page smoke passed on `http://localhost:3021/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` for `下游结果判断`, `先处理导入阻塞`, `优先对比线索`, `优先复核线索`, and `判断证据`; console error empty; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`
### IM049 Import Center Quality Impact Aggregation

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 20 before IM049`
- scope: read-only quality-to-exception reverse aggregation in `/data-quality/[batchId]`, model helper/test coverage, result trace panel UI, and traceability records.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `summarizeImportQualityImpactAggregation` was not exported; target model test passed with 34 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn quick check found no `space-x/space-y` or hardcoded grayscale classes in touched frontend files; in-app browser channel was unavailable, so production HTTP smoke passed on `http://127.0.0.1:3022/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` for `质量影响聚合`, `首要问题`, `source_key · REQUIRED_FIELD_MISSING`, and `查看失败行修正`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM051 Import Center Review Conclusion Preview

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 22 before IM051`
- scope: read-only review conclusion preview in `/data-quality/[batchId]`, model helper/test coverage, result trace panel UI, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-result-trace-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-result-trace-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `summarizeImportReviewConclusionPreview` was not exported; target model test passed with 36 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with documented baseline only; Node 22 production build passed; in-app browser local URL was blocked by client, so production HTTP smoke passed on `http://127.0.0.1:3023/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` for `复核结论预览`, `结论依据`, `残余风险`, and `查看复核案例`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM052 Import Center Review Evidence Gap Drilldown

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 23 before IM052`
- scope: read-only review evidence gap drilldown in `/data-quality/[batchId]`, model helper/test coverage, result trace panel UI, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-result-trace-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-result-trace-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `summarizeImportReviewEvidenceGapDrilldown` was not exported; target model test passed with 38 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with documented baseline only; Node 22 production build passed; production HTTP smoke passed on `http://127.0.0.1:3023/data-quality/BATCH-IM026-SMOKE-004?correction=success&row=1` for `复核证据缺口`, `暂无证据缺口`, `责任人`, and `查看复核案例`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM053 Import Center Review Cases Workspace

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical existed; local branch was aligned before IM053`
- scope: read-only `/data-quality/review-cases` second-level workspace, review-case workspace model helpers/tests, detail-page review-case links, and traceability records.
- allowed_files_check: `app/data-quality/review-cases/page.tsx`, `components/import-center-review-cases-workspace.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/review-cases/page.tsx`, `components/import-center-review-cases-workspace.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `buildImportReviewCasesWorkspaceHref` was not exported; target model test passed with 40 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with documented baseline only; Node 22 production build passed and included `/data-quality/review-cases`; temporary production smoke passed on `/data-quality/review-cases?businessDate=2026-05-11&status=open` for `复核案例工作台`, `筛选复核案例`, `分组情况`, `复核案例列表`, and `返回数据质量`; batch detail smoke confirmed `/data-quality/review-cases` links; temporary 8000/3023 services were stopped; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM054 Import Center Quality Issue Review Focus

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 1 before IM054 because IM053 is locally committed and not pushed.`
- scope: read-only quality-impact issue group links into `/data-quality/review-cases`, review-case workspace focus visibility, model helper/test coverage, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-result-trace-panel.tsx`, `components/import-center-review-cases-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-result-trace-panel.tsx`, `components/import-center-review-cases-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `buildImportQualityIssueReviewCasesHref` was not exported; target model test passed with 40 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with documented baseline only; production smoke passed on the batch detail page for `质量影响聚合`, `查看相关复核案例`, and review-case href, and on `/data-quality/review-cases?businessDate=2026-05-01&status=open&sourceResultType=schedule_actual&query=source_key+%C2%B7+REQUIRED_FIELD_MISSING` for `复核案例工作台`, `焦点 source_key · REQUIRED_FIELD_MISSING`, and focus explanation; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM055 Import Center Review Case Detail Page

- branch_name: `codex/import-center-api-vertical`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/import-center-api-vertical exists; local branch was ahead 2 before IM055 because IM053 and IM054 are locally committed and not pushed.`
- scope: read-only `/data-quality/review-cases/[caseId]` second-level detail page, review-case workspace list-to-detail link, model helper/test coverage, and traceability records.
- allowed_files_check: `app/data-quality/review-cases/[caseId]/page.tsx`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-cases-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/review-cases/[caseId]/page.tsx`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-cases-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `buildImportReviewCaseDetailApiUrl` was not exported; target model test passed with 41 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with documented baseline only; production build passed with the workspace bundled Node runtime and included `/data-quality/review-cases/[caseId]`; production smoke passed on `/data-quality/review-cases/CASE-QUERY-001` for `复核案例详情`, `返回复核案例`, `证据缺口`, and `处理边界`, with current backend data returning API 404 read-only error state; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 160 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM056 Import Center Review Demo Seed

- branch_name: `codex/im056-review-demo-seed`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/main is ancestor of current branch; current branch is based on pushed import-center vertical HEAD.`
- scope: local review-case smoke data preparation for `CASE-QUERY-001`, target backend test coverage, current/registry state updates, and traceability records.
- allowed_files_check: `backend/app/review_demo_seed.py`, `backend/tests/test_review_demo_seed.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, component, real integration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/review_demo_seed.py`, `backend/tests/test_review_demo_seed.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, component, real integration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red test failed first because `backend.app.review_demo_seed` did not exist; target backend unittest passed with 2 tests; local seed command generated `CASE-QUERY-001`; browser smoke passed on `/data-quality/review-cases/CASE-QUERY-001` for `CASE-QUERY-001 · 高 · 未关闭`, `证据 1 条 · 结论 1 条 · 未关闭`, `预测排班 #1`, and `证据 EVD-QUERY-001 · note · supervisor-01`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation.
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM057 Import Center Review Source Context

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `not pushed`
- scope: read-only source-result context enrichment for `/api/v1/review-cases/{case_id}` and `/data-quality/review-cases/[caseId]`, model helper/test coverage, and traceability records.
- allowed_files_check: `backend/app/models.py`, `backend/app/review_persistence.py`, `backend/tests/test_result_query_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real integration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/models.py`, `backend/app/review_persistence.py`, `backend/tests/test_result_query_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real integration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red backend test failed first because `ReviewCaseDetail` had no `source_result`; TDD red frontend model test failed first because summary lacked `sourceResultDimensions/sourceResultMetrics`; backend target test passed with 7 tests; import-center model test passed with 41 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; default `npm run build` hit the known Codex Node native-addon issue, while workspace Node build passed; API smoke on 8001 returned `source_result`; page HTML smoke on 3025 rendered `来源结果明细`, `职场 SH-01`, `项目 BOSCH-CS`, `技能 L1-CN`, and `缺口 2 人`; Playwright wrapper hung in `npm exec playwright-cli` and was terminated; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 163 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM058 Import Center Review Source Trace

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `not pushed`
- scope: read-only source-trace context enrichment for `/api/v1/review-cases/{case_id}` and `/data-quality/review-cases/[caseId]`, model helper/test coverage, and traceability records.
- allowed_files_check: `backend/app/models.py`, `backend/app/review_persistence.py`, `backend/tests/test_result_query_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real integration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/models.py`, `backend/app/review_persistence.py`, `backend/tests/test_result_query_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real integration, auth, permissions, approval, export, batch, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red backend test failed first because `ReviewCaseDetail` had no `source_trace`; TDD red frontend model test failed first because summary lacked `sourceTraceRun/sourceTraceVersions`; backend target test passed with 7 tests; import-center model test passed with 41 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; API smoke on 8002 returned `source_trace`; page smoke on 3026 rendered `来源链路`, `计算 RUN-DEMO-FS-20260511`, `预测版本 FC-DEMO-20260511-V1`, `IMPORT-DEMO-FC-20260511`, and `BATCH-DEMO-REVIEW-20260511`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM059 Import Center Comparison Run Detail Page

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context exists; branch was pushed before IM059 started.`
- scope: read-only `/data-quality/comparison-runs/[runId]` second-level detail page, review-case source trace frontend link, batch result trace frontend link, model helper/test coverage, and traceability records.
- allowed_files_check: `app/data-quality/comparison-runs/[runId]/page.tsx`, `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-result-trace-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, real integration, auth, permissions, approval, export, batch operation, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/comparison-runs/[runId]/page.tsx`, `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-result-trace-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, real integration, auth, permissions, approval, export, batch operation, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red frontend model test failed first because `buildImportComparisonRunDetailApiUrl` was not exported; target model test passed with 42 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; in-app browser smoke on 3026 rendered the comparison-run detail page for `RUN-DEMO-FS-20260511` with `对比运行详情`, `运行来源`, `结果明细`, and `处理边界`; review-case smoke found the `查看运行详情` frontend link; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 163 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`
