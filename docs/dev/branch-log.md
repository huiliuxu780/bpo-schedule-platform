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

### IM161 Workplace Service Team Maintenance

- branch_name: `codex/im161-workplace-service-team-maintenance`
- base_main_commit: `3060d9c`
- stacked_on: `d36e5cf feat: group workplace service teams`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed database-persistence slice. Add a local workplace service-team object/API and keep all actions under `/master-data/sites/[workplaceId]`: Header create action, nested create/edit child pages, and freeze Dialog. Keep standalone navigation, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/sites/[workplaceId]/page.tsx`, nested service-team pages/actions, `app/master-data/agents/data.ts`, master-data model/workbench components, backend master-data models/service/persistence/main route, one Alembic migration, focused frontend/backend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no package/lockfile changes, no Sidebar changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected service-team local table/API, service-team maintenance request/response models, create/edit/freeze service logic with internal-vs-supplier reference validation, workplace detail maintained-record display and actions, nested service-team form pages, focused tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because maintained `serviceTeams` were ignored; product-structure test first failed because nested service-team pages/actions did not exist; backend contract/API tests first failed because service-team models/repository/route were missing. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs scripts/tests/product-structure.test.mjs` passed with 55 tests, backend master-data maintenance tests passed with 28 tests, `npm run lint` passed, and `npm run typecheck` passed. API smoke created `TEAM-IM161-SMOKE` successfully, and in-app browser smoke confirmed workplace detail and service-team create/edit pages without contract/settlement/minimum-staffing copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM162 Workplace Service Team Detail Page

- branch_name: `codex/im162-service-team-detail`
- base_main_commit: `3060d9c`
- stacked_on: `36bf091 feat: add workplace service team maintenance`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of workplace service-team maintenance. Add a nested detail page for a single maintained service-team record under `/master-data/sites/[workplaceId]`, expose a row-level detail link from the workplace detail service-team table, and keep edit/freeze actions inside the same workplace child-route context. Keep backend routes, schema/migration, standalone navigation, associated-person lists, personnel assignment, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/sites/[workplaceId]/page.tsx`, `app/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]/page.tsx`, `app/master-data/agents/data.ts`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, Sidebar, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected service-team detail href in model rows, workplace-detail table `查看` entry, nested service-team detail route, detail component with read-only service-team fields, reuse of existing edit route and freeze Dialog, focused RED/GREEN tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because maintained service-team rows did not expose `detailHref`; product-structure test first failed because the nested service-team detail page did not exist. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 27 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 28 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/sites/SH-01` exposes the `查看` detail link and `/master-data/sites/SH-01/service-teams/TEAM-IM161-SMOKE` shows service-team fields plus edit/freeze actions without contract/settlement/minimum-staffing copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM163 Service Team Associated People

- branch_name: `codex/im163-service-team-people`
- base_main_commit: `3060d9c`
- stacked_on: `fe3c607 feat: add workplace service team detail page`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of workplace service-team detail. Add a read-only associated-person section to `/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]` using existing employee and workplace-binding data. Keep backend routes, schema/migration, standalone navigation, personnel assignment, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]/page.tsx`, `app/master-data/agents/data.ts`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, Sidebar, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected service-team people summary model, service-team detail route employee/binding reads, read-only associated people table, explicit empty state, focused RED/GREEN tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `summarizeMasterDataWorkplaceServiceTeamPeople` was missing; product-structure test first failed because the service-team detail page did not fetch employees or workplace bindings. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 28 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 28 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/sites/SH-01/service-teams/TEAM-IM161-SMOKE` shows service-team info, associated people, edit/freeze actions, and no contract/settlement/minimum-staffing/permission/approval/export/batch/personnel-assignment copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM164 Vendor Service Team Links

- branch_name: `codex/im164-vendor-service-team-links`
- base_main_commit: `3060d9c`
- stacked_on: `d06fc39 feat: show service team associated people`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of the master-data supplier/workplace chain. Add a read-only service-team section to `/master-data/vendors/[vendorId]` that links supplier-bound workplace service teams back to existing workplace service-team details. Keep backend routes, schema/migration, standalone navigation, supplier service-team maintenance, personnel assignment, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/vendors/[vendorId]/page.tsx`, `app/master-data/agents/data.ts`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, Sidebar, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected supplier-detail service-team summary rows, supplier-detail route service-team fetch, read-only service-team table, `查看团队` links to existing service-team detail pages, focused RED/GREEN tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because supplier detail lacked service-team rows; product-structure test first failed because the supplier detail route did not fetch maintained service teams. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 28 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 28 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/vendors/SUP-A` shows service teams, service workplaces, and `查看团队` links without contract/settlement/minimum-staffing/permission/approval/export/batch/personnel-assignment copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM165 Agent Detail Service Team Links

- branch_name: `codex/im165-agent-detail-links`
- base_main_commit: `3060d9c`
- stacked_on: `0d410e5 feat: link vendor service teams`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of the master-data personnel/service-team chain. Add a read-only customer-service personnel detail page under `/master-data/agents/[employeeId]`, expose row-level `查看` from the personnel list, and show associated service teams linked back to existing workplace service-team details. Keep backend routes, schema/migration, personnel assignment, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/agents/[employeeId]/page.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, Sidebar, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected agent detail summary model, personnel-list `查看` row action, customer-service personnel detail route, read-only personnel fields, skill set, associated service-team table, `查看团队` links to existing service-team detail pages, focused RED/GREEN tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `summarizeMasterDataAgentDetail` was missing; product-structure test first failed because `/master-data/agents/[employeeId]` did not exist. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 29 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 29 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/agents` has row-level `查看` linking to `/master-data/agents/A-1001`, and `/master-data/agents/A-1001` shows personnel info, skill set, associated service teams, and `查看团队` link without contract/settlement/minimum-staffing/permission/approval/export/batch/auto-scheduling copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM166 Organization Detail Links

- branch_name: `codex/im166-organization-detail-links`
- base_main_commit: `3060d9c`
- stacked_on: `78a2d98 feat: add agent detail service links`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of the master-data organization/personnel chain. Add a read-only organization detail page under `/master-data/organizations/[organizationId]`, expose row-level `查看` from the organization list, and show direct child organizations plus current directly assigned personnel linked to existing personnel detail pages. Keep backend routes, schema/migration, personnel reassignment, organization-tree drag, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/organizations/[organizationId]/page.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, Sidebar, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected organization detail summary model, organization-list `查看` row action, organization detail route, read-only organization fields, direct-child organization table, direct-personnel table, `查看人员` links to existing personnel detail pages, focused RED/GREEN tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `summarizeMasterDataOrganizationDetail` was missing; product-structure test first failed because `/master-data/organizations/[organizationId]` did not exist. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 30 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 30 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/organizations` has row-level `查看` linking to `/master-data/organizations/ORG-CC`; `/master-data/organizations/ORG-CC` shows organization info, direct child organizations, and personnel empty state; `/master-data/organizations/ORG-IM158` shows `归属人员` and `查看人员` linking to `/master-data/agents/A-IM159`, without contract/settlement/minimum-staffing/permission/approval/export/batch/auto-scheduling copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM167 Skill Detail Links

- branch_name: `codex/im167-skill-detail-links`
- base_main_commit: `3060d9c`
- stacked_on: `d3e10ce feat: add organization detail links`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of the master-data skill/personnel chain. Add a read-only skill detail page under `/master-data/skills/[skillId]`, expose row-level `详情` from the skill list, and show current personnel whose skill set includes the selected skill linked to existing personnel detail pages. Keep backend routes, schema/migration, skill hierarchy, skill binding maintenance, batch assignment, scheduling skill rules, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/skills/[skillId]/page.tsx`, `app/master-data/agents/data.ts`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, Sidebar, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected skill detail summary model, skill-list detail row action, skill detail route, read-only skill fields, current-personnel table, `查看人员` links to existing personnel detail pages, focused RED/GREEN tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `summarizeMasterDataSkillDetail` was missing; product-structure test first failed because `/master-data/skills/[skillId]` did not exist. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 31 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 31 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/skills` has row-level `详情` linking to `/master-data/skills/L1-CN`; `/master-data/skills/L1-CN` shows skill info, personnel section, and personnel empty state; `/master-data/skills/SKILL-IM159` shows `查看人员` linking to `/master-data/agents/A-IM159`, without contract/settlement/minimum-staffing/permission/approval/export/batch/auto-scheduling copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM160 Workplace Detail Service Teams

- branch_name: `codex/im160-workplace-service-teams`
- base_main_commit: `3060d9c`
- stacked_on: `8f4ee51 fix: tolerate legacy local master data schema`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of master-data maintenance. Keep service teams inside `/master-data/sites/[workplaceId]` and make the detail table read-only: self-owned teams grouped by internal employee organization, supplier teams grouped by workplace supplier bindings with supplier names resolved from supplier master data. Keep navigation, forms, backend routes, schema/migration, contracts, settlement, minimum staffing, permissions, approval, export, batch operations, automatic scheduling, formulas, and charge factors out of scope.
- allowed_files_check: `app/master-data/sites/[workplaceId]/page.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no sidebar, backend, package/lockfile, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected workplace detail supplier fetch, service-team grouping model, service-team table columns, focused RED/GREEN model and structure tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because workplace detail returned three people/binding rows instead of two grouped service-team rows. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs scripts/tests/product-structure.test.mjs` passed with 54 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/sites/SH-01` shows supplier team `供应商 A` with `1 条绑定`, and `/master-data/sites/SITE-IM158` shows an internal service team with `1 人`, with no contract, settlement, or minimum-staffing copy. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` result will be recorded after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM147 Header Breadcrumb And Content Title Cleanup

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `77eeb6a fix: align production route wording`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed Header/Breadcrumb and duplicate content-title cleanup. Add `breadcrumbItems` to demand, schedule, actual-log, and data-quality compatible pages, and remove/downgrade content-area page identity H1 headings. Keep old `searchPlaceholder` API cleanup, import entry relocation, data-quality abstraction downgrade, route restructuring, backend, schema/migration, dependency, permissions, approval, export, batch-operation, automatic scheduling, formula, settlement, and charge-factor changes out of this slice.
- allowed_files_check: target `app/demand-plans/**`, `app/schedule-plans/**`, `app/actual-logs/**`, `app/data-quality/**`, target production/import-center workspace components, product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes.
- scope_diff_check: expected breadcrumbItems additions, content h1 removals/downgrades, regression tests, Browser smoke evidence, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because target pages lacked `breadcrumbItems` and content surfaces still had `<h1>` page identity headings. After implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 17 tests. Browser smoke over `/demand-plans`, `/schedule-plans`, and `/data-quality/versions` confirmed Breadcrumb presence and no content-area duplicate H1. Final `check.sh` will run after this traceability update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM148 Legacy Header Search API Cleanup

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `ec873f9 fix: unify breadcrumb page headings`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed cleanup of the old global Header search API. Remove `searchPlaceholder` from `AppShell` and `SiteHeader`, remove all app/components passthroughs, and keep real business list filters in content areas.
- allowed_files_check: `app/**`, `components/app-shell.tsx`, `components/site-header.tsx`, focused product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes.
- scope_diff_check: expected shell/header prop deletion, page prop cleanup, regression test, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because `AppShell` still retained `searchPlaceholder`; after implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 18 tests, `rg -n "searchPlaceholder" app components -S` returned no matches, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM149 Non-Agent Master Data Action Cleanup

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `6237a3c fix: remove legacy header search api`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed master-data action cleanup. Remove unconfirmed content-area `导入主数据` shortcuts from organization/reference master-data list pages, keep confirmed agent actions in Header actions, and avoid adding non-agent CRUD or import dialogs.
- allowed_files_check: `components/master-data-maintenance-workbench.tsx`, `app/master-data/[entityKey]/page.tsx` as read context, focused product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes.
- scope_diff_check: expected removal of non-agent content import shortcut, import helper cleanup, regression test, Browser smoke evidence, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because non-agent master-data content still exposed `导入主数据`; after implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 19 tests, and `rg -n "导入主数据|buildImportUploadWorkspaceHref" components/master-data-maintenance-workbench.tsx app/master-data -S` returned no business-source matches. Browser smoke over `/master-data/organizations`, `/master-data/sites`, `/master-data/skills`, and `/master-data/agents` confirmed non-agent pages have no `导入主数据` or `/data-quality/uploads/new` links, while the agent page still has Header actions `新建` and `批量导入`. `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM150 Business Import Entry Ownership

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `e94d1a0 fix: remove unconfirmed master data import actions`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed import-entry ownership cleanup. Remove the generic upload action from the `/data-quality` import batch ledger, and move forecast, schedule, and actual-log import actions to their corresponding business page Header actions while keeping `/data-quality/uploads/new` as an internal compatibility route.
- allowed_files_check: `app/data-quality/page.tsx`, `components/import-center-batch-list-panel.tsx`, production list pages/workbenches for demand forecasts, personnel schedules, and actual logs, focused product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/action/schema/migration changes, no package/lockfile changes.
- scope_diff_check: expected generic upload action removal from import-batch ledger, Header action additions on business import pages, content-card import action removal, regression test, Browser smoke evidence, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because the generic import batch ledger still owned a CSV upload entry; after implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 20 tests, `bash scripts/check-state.sh --strict` passed, and `git diff --check` passed. Browser smoke over `/data-quality`, `/demand-plans/production`, `/schedule-plans/production`, and `/actual-logs/production` confirmed `/data-quality` has no generic upload action, while forecast, schedule, login-log, and status-log import links live in Header actions only. `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM151 Result Chain Abstraction Downgrade

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `c3fb857 fix: move import entries to business headers`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed visible hierarchy cleanup. Remove `导入批次` as the Breadcrumb parent from business version list, comparison-run detail, review-case list, and review-case detail pages while retaining compatible routes and batch/template contexts elsewhere.
- allowed_files_check: result-chain pages under `app/data-quality/versions`, `app/data-quality/comparison-runs/[runId]`, `app/data-quality/review-cases`, focused product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/action/schema/migration changes, no package/lockfile changes.
- scope_diff_check: expected Breadcrumb parent removal on result-chain pages, regression test, Browser smoke evidence, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because result-chain pages still presented `导入批次` as their Breadcrumb parent; after implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 21 tests, `bash scripts/check-state.sh --strict` passed, and `git diff --check` passed. Browser smoke over `/data-quality/versions`, `/data-quality/comparison-runs/RUN-QUERY-001`, `/data-quality/review-cases`, and `/data-quality/review-cases/CASE-QUERY-001` confirmed those result pages no longer show `导入批次` parent Breadcrumb. `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM152 Master Data Terminology Cleanup

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `f4f6c26 fix: downgrade result page breadcrumbs`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed master-data visible terminology cleanup. Replace visible `运营主体` / `职场运营主体` wording in workplace detail and master-data data-load error copy with service-team wording, without changing internal compatibility fields or backend contracts.
- allowed_files_check: `app/master-data/agents/data.ts`, `components/master-data-maintenance-workbench.tsx`, focused product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/action/schema/migration changes, no package/lockfile changes.
- scope_diff_check: expected visible workplace service-team terminology, regression test, Browser smoke evidence, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because master-data workbench still exposed `运营主体`; after implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 22 tests, `bash scripts/check-state.sh --strict` passed, `git diff --check` passed, and `rg -n "职场运营主体|运营主体" app/master-data components/master-data-maintenance-workbench.tsx -S` returned no matches. Browser smoke over `/master-data/sites/SH-01` confirmed the workplace detail page shows `服务团队` and does not show `运营主体` or `职场运营主体`. `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM146 Production Wording And Return Links

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `e8cbbdb fix: collapse production nav entries`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed follow-up after IM145. Keep existing production child routes compatible, but clean visible page titles, list titles, return actions, and model guidance so users see business object wording instead of production module wording. Keep duplicate h1 cleanup, old search API cleanup, import entry relocation, data-quality abstraction downgrade, route restructuring, backend, schema/migration, dependency, permissions, approval, export, batch-operation, automatic scheduling, formula, settlement, and charge-factor changes out of this slice.
- allowed_files_check: `app/demand-plans/production/page.tsx`, `app/schedule-plans/production/page.tsx`, `app/actual-logs/production/page.tsx`, the three production workbench components, the three production model files, focused model/product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes.
- scope_diff_check: expected wording-only production child route cleanup, return-label cleanup, model guidance cleanup, regression tests, Browser smoke evidence, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED focused test first failed 4 tests because demand, schedule, actual-log, and production child route structure still exposed old production wording. After implementation, focused tests passed with 43 tests. Browser smoke over `/demand-plans/production`, `/schedule-plans/production`, and `/actual-logs/production` confirmed no old production title/ledger/return wording and confirmed `预测版本列表`, `排班版本列表`, and `日志处理列表`. Final `check.sh` will run after this traceability update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM120 Comparison Run Source Explanation

- branch_name: `codex/im120-schedule-actual-result-explanation`
- base_main_commit: `ef52229`
- stacked_on: `9c4e557 fix: link login log version results`
- remote_status: `IM119 branch is pushed; IM120 implementation is local only until final check/commit/push.`
- scope: add read-only source explanation to the existing comparison-run detail page, covering forecast-vs-schedule and schedule-vs-actual source versions, business date range, key metric scope, and missing-source blockers.
- allowed_files_check: `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected comparison-run detail component/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed because `resultReviewContext` lacked source explanation and source blocker fields; after implementation `node --test scripts/tests/import-center-model.test.mjs` passed with 79 tests. `npm run lint`, `npm run typecheck`, and `bash scripts/check-state.sh --strict` passed. In-app browser smoke on `http://127.0.0.1:3000/data-quality/comparison-runs/RUN-DEMO-FS-20260511` matched `完整结果回看主页`, source explanation text, `来源版本完整`, and the read-only boundary. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM121 Comparison Run Detail Workspace Tabs

- branch_name: `codex/im121-comparison-detail-tabs`
- base_main_commit: `6ccd1b4`
- remote_status: `main includes merged IM120 comparison-run source explanation; IM121 implementation is local only until final check/commit/push.`
- scope: reorganize the existing comparison-run detail page from one long stacked page into a tabbed workspace with overview, source chain, result detail, review cases, and boundary entries; keep all content read-only and reuse existing shadcn tabs.
- allowed_files_check: `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected comparison-run detail component/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed because `summarizeImportComparisonRunDetail` did not expose `workspaceTabs`; after implementation `node --test scripts/tests/import-center-model.test.mjs` passed with 79 tests. `npm run lint` and `npm run typecheck` passed. Final state, browser, and full-check evidence will be reported in the Done Report after traceability verification.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM122 Review Case Detail Workspace Tabs

- branch_name: `codex/im122-review-case-detail-tabs`
- base_main_commit: `3059793`
- stacked_on: `3059793 refactor: split comparison detail workspace`
- remote_status: `IM121 branch is pushed; IM122 implementation is local only until final check/commit/push.`
- scope: reorganize the existing review-case detail page from one long stacked page into a tabbed workspace with overview, source chain, evidence/conclusions, processing actions, owner navigation, and boundary entries; keep existing controlled actions unchanged.
- allowed_files_check: `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected review-case detail component/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed because `summarizeImportReviewCaseDetail` did not expose `workspaceTabs`; after implementation `node --test scripts/tests/import-center-model.test.mjs` passed with 79 tests. `npm run lint`, `npm run typecheck`, `bash scripts/check-state.sh --strict`, and `git diff --check` passed. In-app browser smoke on `http://127.0.0.1:3000/data-quality/review-cases/CASE-QUERY-001` matched the six workspace tabs and verified source, evidence/conclusion, action, owner, and boundary panels. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM123 Actual Log Detail Workspace Tabs

- branch_name: `codex/im123-actual-log-detail-tabs`
- base_main_commit: `f471c1c`
- stacked_on: `f471c1c refactor: split review case detail workspace`
- remote_status: `IM122 branch is pushed; IM123 implementation is local only until final check/commit/push.`
- scope: reorganize `/actual-logs/production/[batchId]` from one long stacked processing explanation page into a tabbed workspace with overview, timezone/business-day, dictionary/exception, row detail, and boundary entries; keep all existing actual-log processing explanations read-only and keep disabled actions disabled.
- allowed_files_check: `components/actual-log-production-workbench.tsx`, `components/actual-log-production-model.ts`, `scripts/tests/actual-log-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected actual-log production component/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed because `summarizeActualLogProcessingDetail` did not expose `workspaceTabs`; after implementation `node --test scripts/tests/actual-log-production-model.test.mjs` passed with 8 tests. `npm run lint`, `npm run typecheck`, `bash scripts/check-state.sh --strict`, and `git diff --check` passed. shadcn self-review found no hardcoded color or spacing drift in the changed component. In-app browser smoke on `http://127.0.0.1:3000/actual-logs/production/BATCH-STATUS-001` matched the five workspace tabs and verified timezone/business-day, dictionary/exception, row-detail, and boundary panels. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM119 Login Log Version Result Link Consistency

- branch_name: `codex/im119-login-log-version-result-link`
- base_main_commit: `ef52229`
- stacked_on: `fc8d747 fix: keep applied version workbench entry`
- remote_status: `IM118 branch is pushed; IM119 implementation is local only until final check/commit/push.`
- scope: include `login_log` in the same actual_logs direct result-link path as `status_log`, so applied login-log versions can match `schedule_vs_actual` runs and review-case entries through `actual_import_version_id`.
- allowed_files_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected import-center model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed because `login_log` applied result cards and version result contexts fell back to generic actual-log empty/result-trace links instead of matching `schedule_vs_actual` runs; after implementation `node --test scripts/tests/import-center-model.test.mjs` passed with 79 tests. `npm run lint`, `npm run typecheck`, and `bash scripts/check-state.sh --strict` passed. In-app browser smoke on `http://127.0.0.1:3000/data-quality/versions?domain=actual_logs&status=applied` matched `业务版本工作台`, `登录/状态日志`, version ledger text, and the no-write boundary. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM113 Personnel Schedule Row Reference Explanations

- branch_name: `codex/im113-schedule-detail-reference-explanations`
- base_main_commit: `ef52229`
- stacked_on: `0de6223 feat: wire schedule production detail api`
- remote_status: `IM112 branch is local only; IM113 implementation is local only until final check/commit/push.`
- scope: add row-level reference completeness and blocker explanations to schedule detail and 0.5h interval rows on `/schedule-plans/production/[batchId]`.
- allowed_files_check: `app/schedule-plans/production/**`, `components/personnel-schedule-production-workbench.tsx`, `components/personnel-schedule-production-model.ts`, `scripts/tests/personnel-schedule-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM113 frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED target `node --test scripts/tests/personnel-schedule-production-model.test.mjs` first failed because row-level `referenceStatusLabel` and `blockerLabel` were missing; after implementation the same target test passed with 9 tests. `npm run lint`, `npm run typecheck`, and shadcn UI gate passed. `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 195 tests OK. In-app browser smoke on `http://127.0.0.1:3000/schedule-plans/production/BATCH-MISSING-IM113` matched `排班版本详情`, `排班版本未定位`, `当前不伪造明细`, and `返回排班生产`.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM114 Demand Forecast Version Detail API

- branch_name: `codex/im114-forecast-version-detail-api`
- base_main_commit: `ef52229`
- stacked_on: `a5fe006 feat: explain schedule row references`
- remote_status: `IM113 branch is pushed; IM114 implementation is local only until final check/commit/push.`
- scope: add a backend-only read-only demand-forecast production version detail API by batch ID; response covers source batch context, forecast_version_id, business date range, 0.5h forecast intervals, and version change records.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/forecast_persistence.py`, `backend/tests/test_forecast_persistence.py`, `backend/tests/test_forecast_production_api.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no frontend app/components/lib, package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM114 backend/API/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED `.venv/bin/python -m unittest backend.tests.test_forecast_persistence backend.tests.test_forecast_production_api -v` first failed because `ForecastPersistenceRepository.get_forecast_version_by_import_version` and `get_demand_forecast_production_detail` were missing; after implementation the same target passed with 7 tests. `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 199 tests OK.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM115 Demand Forecast Production Detail UI

- branch_name: `codex/im115-demand-forecast-detail-ui`
- base_main_commit: `ef52229`
- stacked_on: `cc78cec feat: add forecast production detail api`
- remote_status: `IM114 branch is pushed; IM115 implementation is local only until final check/commit/push.`
- scope: wire `/demand-plans/production/[batchId]` to the IM114 read-only demand-forecast production detail API and show real forecast version, 0.5h forecast intervals, and version change records.
- allowed_files_check: `app/demand-plans/production/**`, `components/demand-forecast-production-workbench.tsx`, `components/demand-forecast-production-model.ts`, `scripts/tests/demand-forecast-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM115 frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED `node --test scripts/tests/demand-forecast-production-model.test.mjs` first failed because the detail summary still used the import version instead of IM114 API detail; after implementation the same target passed with 9 tests. `npm run lint` and `npm run typecheck` passed. Browser smoke on `http://127.0.0.1:3000/demand-plans/production/BATCH-MISSING-IM115` matched `预测版本详情`, `0.5h 预测区间`, `版本变更记录`, `暂未读取到真实 0.5h 预测区间`, and `返回预测生产`. Direct `npm run build` with the default runtime failed on local native optional package loading, so final verification used the project harness runtime: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM116 Demand Forecast Detail Row Explanations

- branch_name: `codex/im116-forecast-detail-row-explanations`
- base_main_commit: `ef52229`
- stacked_on: `e68e94f feat: wire forecast production detail api`
- remote_status: `IM115 branch is pushed; IM116 implementation is local only until final check/commit/push.`
- scope: add row-level completeness and blocker explanations to the real forecast interval rows on `/demand-plans/production/[batchId]`, covering workplace, project, skill, demand level, time bucket, and required-agent values.
- allowed_files_check: `app/demand-plans/production/**`, `components/demand-forecast-production-workbench.tsx`, `components/demand-forecast-production-model.ts`, `scripts/tests/demand-forecast-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM116 frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed because interval rows did not expose `alignmentStatusLabel` or `blockerLabel`; after implementation `node --test scripts/tests/demand-forecast-production-model.test.mjs` passed with 10 tests. Shadcn review found no hardcoded color or component-fork drift in the changed table. `npm run lint`, `npm run typecheck`, `bash scripts/check-state.sh --strict`, and `git diff --check` passed. Browser smoke on `http://127.0.0.1:3000/demand-plans/production/BATCH-FC-001` matched `预测版本详情`, `0.5h 预测区间`, `对齐状态`, and `阻塞说明`; current local data had no forecast rows, so row values are covered by the model test. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM117 Production Detail Comparison Entry

- branch_name: `codex/im117-production-comparison-entry`
- base_main_commit: `ef52229`
- stacked_on: `a9ea528 feat: explain forecast interval blockers`
- remote_status: `IM116 branch is pushed; IM117 implementation is local only until final check/commit/push.`
- scope: add read-only local-comparison entry cards to demand-forecast and personnel-schedule production detail pages; link into the existing business version workbench filtered by version domain, applied status, and business date when available.
- allowed_files_check: `components/demand-forecast-production-workbench.tsx`, `components/demand-forecast-production-model.ts`, `components/personnel-schedule-production-workbench.tsx`, `components/personnel-schedule-production-model.ts`, target model tests, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, direct comparison submit action, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected production frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed because production detail summaries did not expose `comparisonEntry`; after implementation `node --test scripts/tests/demand-forecast-production-model.test.mjs` passed with 10 tests and `node --test scripts/tests/personnel-schedule-production-model.test.mjs` passed with 9 tests. `bash scripts/check-state.sh --strict`, `git diff --check`, `npm run lint`, and `npm run typecheck` passed. Browser smoke on `http://127.0.0.1:3000/demand-plans/production/BATCH-MISSING-IM117` and `http://127.0.0.1:3000/schedule-plans/production/BATCH-MISSING-IM117` matched `暂不能进入本地比对`, `入口状态`, blocked reasons, and domain-filtered `/data-quality/versions` links. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM118 Version Workbench Applied Entry Compatibility

- branch_name: `codex/im118-version-pair-comparison-submit`
- base_main_commit: `ef52229`
- stacked_on: `a4b8dff feat: link production details to comparison workbench`
- remote_status: `IM117 branch is pushed; IM118 implementation is local only until final check/commit/push.`
- scope: make `/data-quality/versions?status=applied` behave as the applied-version entry from production detail pages by mapping it to ready rows; verify that same-business-date demand forecast plus personnel schedule versions expose a direct `forecast_vs_schedule` controlled submit request.
- allowed_files_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected import-center model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED `node --test scripts/tests/import-center-model.test.mjs` first failed because `status=applied` produced 0 version rows; after implementation the same target passed with 79 tests. `bash scripts/check-state.sh --strict`, `git diff --check`, `npm run lint`, and `npm run typecheck` passed. Browser smoke on `http://127.0.0.1:3000/data-quality/versions?domain=demand_forecast&status=applied&businessDate=2026-05-18` loaded the business version workbench and local-comparison column without crashing; current local service has no matching 2026-05-18 batch rows, so direct candidate row values are covered by the model test. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM112 Personnel Schedule Production Detail UI

- branch_name: `codex/im112-schedule-production-detail-ui`
- base_main_commit: `ef52229`
- stacked_on: `cfea9d2 feat: add personnel schedule production detail api`
- remote_status: `IM111 branch is pushed; IM112 implementation is local only until final check/commit/push.`
- scope: wire `/schedule-plans/production/[batchId]` to the IM111 read-only personnel-schedule production detail API and show real schedule details plus 0.5h expanded intervals.
- allowed_files_check: `app/schedule-plans/production/**`, `components/personnel-schedule-production-workbench.tsx`, `components/personnel-schedule-production-model.ts`, `scripts/tests/personnel-schedule-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM112 frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED target `node --test scripts/tests/personnel-schedule-production-model.test.mjs` first failed because the detail model still returned `BATCH-SCH-001::v1` instead of real `SCH-PROD-001`; after implementation the same target test passed with 8 tests, `npm run lint` passed, `npm run typecheck` passed, and shadcn UI gate passed with 3 tests. `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 195 tests OK. In-app browser smoke on `http://127.0.0.1:3000/schedule-plans/production/BATCH-MISSING-IM112` matched `排班版本详情`, `排班版本未定位`, `当前不伪造明细`, and `返回排班生产`.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM086 Controlled Local Comparison Trigger

- date: `2026-06-03`
- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `5ac83f8`
- remote_status: `branch includes pushed IM083 baseline plus local IM084/IM085 commits; IM086 implementation is local only until PM asks to push.`
- scope: controlled local comparison-calculate entry in the result-trace version-context section, success/failure feedback returned to the same version-result context, model test coverage, and current-state reset from `IM086` back to empty queue.
- allowed_files_check: `app/data-quality/actions.ts`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/actions.ts`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test failed first because the new trigger summary referenced a missing version-pair helper; model test then passed with 71 tests. Chrome smoke on `http://localhost:3000/data-quality/BATCH-DEMO-REVIEW-20260511?apply=success&tab=result-trace` verified blocked-state no-button behavior for the current master-data demo batch, and a synthetic success query verified notice rendering plus new-run/result-list links inside the result-trace context. In-app Browser localhost smoke was attempted first but blocked by Browser Use localhost policy in this environment. `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required for completion.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM080 Import Center Field Mapping Template Upload Prefill

- branch_name: `codex/im080-template-upload-prefill`
- base_main_commit: `c4ae1b0`
- remote_status: `branch created locally from pushed codex/im079-template-create; not pushed yet.`
- scope: template detail to batch upload prefill chain, source batch context links from template cards, upload form prefill notice, model helper/test coverage, browser smoke evidence, and traceability records.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `app/data-quality/field-mapping-templates/[templateId]/page.tsx`, `components/import-center-model.ts`, `components/import-center-template-management-panel.tsx`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `app/data-quality/field-mapping-templates/[templateId]/page.tsx`, `components/import-center-model.ts`, `components/import-center-template-management-panel.tsx`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model tests failed first because upload href/preselect helpers and batchId-preserving template detail href were missing; target model test passed with 62 tests; shadcn gate passed with 3 documented baseline findings; lint, typecheck, and Node 22 build passed; in-app browser smoke on 3038 verified the template detail `用此模板上传` link and batch upload form preselected `TPL-IM027-SMOKE-001`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; first full `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests; final check rerun after branch-log evidence update before local commit.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM070 Import Center Review Owner First Pending Entry

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 through IM070 changes not pushed yet.`
- scope: read-only same-owner first pending entry on `/data-quality/review-cases`, model helper/test coverage, shadcn-composed owner entry block, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-review-cases-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-review-cases-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewOwnerFirstPendingEntries` was not exported; target model test passed with 53 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; production build passed; production browser smoke on 3028 rendered `同 Owner 首条待处理`, `进入首条待处理`, and `查看 Owner 列表`, then detail navigation rendered `同 Owner 待处理导航`, `第 1 / 2 条`, and `下一条待处理`; final `bash scripts/check.sh` result to be reported after final verification.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM071 Import Center Review Case Action Deck

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 through IM071 changes not pushed yet.`
- scope: consolidate review-case detail evidence, conclusion, and closure entries into one processing action deck, model helper/test coverage, shadcn Tabs composition, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, review-case action panel components, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-evidence-panel.tsx`, `components/import-center-review-case-conclusion-panel.tsx`, `components/import-center-review-case-closure-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewCaseActionDeck` was not exported; target model test passed with 54 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; production build passed; production browser smoke on 3029 rendered `处理动作区`, `当前推荐动作`, `补证据`, `补结论`, `关闭案例`, and `处理边界`; tab smoke rendered closure blockers; closed-case smoke rendered closed state and zero submit buttons; final `bash scripts/check.sh` result to be reported after final verification.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM072 Import Center Review Action Submit Feedback

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 through IM072 changes not pushed yet.`
- scope: unify review-case detail action submit feedback inside the processing action deck, parse existing evidence/conclusion/closure URL result parameters, add model helper/test coverage, and update traceability records.
- allowed_files_check: `app/data-quality/review-cases/[caseId]/page.tsx`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: detail page search params, review-case action feedback model helper, action deck feedback notice, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewCaseActionFeedback` was not exported; target model test passed with 55 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; production build passed; production browser smoke on 3030 rendered feedback for `evidence=success`, `conclusion=failed`, and `closure=success`; final `bash scripts/check.sh` result to be reported after final verification.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM073 Import Center Review Action Continuation Navigation

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM072 after push; local branch has IM073 changes not pushed yet.`
- scope: add continuation navigation after review-case action submit feedback, reuse same-owner pending navigation data, add model helper/test coverage, shadcn-composed action links, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: action continuation summary helper, action deck continuation panel, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewCaseActionContinuation` was not exported; target model test passed with 56 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; production build passed; production browser smoke on 3031 rendered `续办导航`, `继续处理下一条`, and `返回同 Owner 列表`; final `bash scripts/check.sh` result to be reported after final verification.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM074 Import Center Review Failed Action Retry Targeting

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM072 after push; local branch has IM073 and IM074 changes not pushed yet.`
- scope: add failed-submit retry targeting for review-case action deck, model helper/test coverage, shadcn-composed retry notice, failed-action default tab selection, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: failed action retry summary helper, action deck retry notice and failed-action tab defaulting, model tests, current queue cleanup, registry trace index, project state, raw requirements, user stories, backlog, audit, task log, and branch log. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewCaseActionRetry` was not exported; target model test passed with 57 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; production build passed; production browser smoke on 3032 rendered `重试定位` and defaulted active tab to `补结论`; final `bash scripts/check.sh` result to be reported after final verification.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM069 Import Center Review Owner Pending Navigation

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 through IM069 changes not pushed yet.`
- scope: read-only same-owner pending navigation inside `/data-quality/review-cases/[caseId]` owner context, model helper/test coverage, shadcn-composed navigation action bar, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-review-owner-context.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-review-owner-context.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewOwnerNavigation` was not exported; target model test passed with 52 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; in-app browser smoke on 3026 rendered `同 Owner 待处理导航`, `当前案例不在待处理序列`, `进入首条待处理`, `第 1 / 2 条`, and `下一条待处理`; final `bash scripts/check.sh` result to be reported after final verification.
- local_commit_sha: to be reported in Done Report after local commit creation
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

### IM060 Import Center Comparison Run Review Links

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM059; local branch has IM060 changes not pushed yet.`
- scope: read-only linked review-case positioning on `/data-quality/comparison-runs/[runId]`, existing review-cases list fetch, model helper/test coverage, and traceability records.
- allowed_files_check: `app/data-quality/comparison-runs/[runId]/page.tsx`, `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, real integration, auth, permissions, approval, export, batch operation, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/comparison-runs/[runId]/page.tsx`, `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, real integration, auth, permissions, approval, export, batch operation, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red frontend model test failed first because `summarizeImportComparisonRunReviewCases` was not exported; target model test passed with 43 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; in-app browser smoke on 3026 rendered `关联复核案例`, `CASE-QUERY-001`, `查看详情`, and one `/data-quality/review-cases/CASE-QUERY-001` link; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 163 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM061 Import Center Review Evidence Chain

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 changes not pushed yet.`
- scope: read-only evidence/conclusion/closure chain on `/data-quality/review-cases/[caseId]`, review-case detail page single-column hierarchy polish, model helper/test coverage, and traceability records.
- allowed_files_check: `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, real integration, auth, permissions, approval, export, batch operation, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, real integration, auth, permissions, approval, export, batch operation, production formula, settlement, or charge-factor files. `.local/` remains untracked and untouched.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewCaseEvidenceChain` was not exported; target model test passed with 44 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; in-app browser smoke on 3026 rendered `证据与结论链路`, `EVD-QUERY-001`, and `CON-QUERY-001`, with the main detail section using single-column `grid gap-4`; screenshot capture through the browser backend timed out twice and was not used as acceptance evidence; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 163 backend unittests.
- local_commit_sha: `current HEAD on codex/im057-review-source-context; exact SHA reported in Done Report`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM062 Import Center Review Closure Write Entry

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 and IM062 changes not pushed yet.`
- scope: controlled closure write for existing open review cases, detail-page closure entry, model helper/test coverage, target backend test coverage, and traceability records.
- allowed_files_check: `backend/app/review_closure.py`, `backend/tests/test_review_closure_service.py`, `backend/tests/test_review_closure_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-closure-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real external integration, evidence supplement, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/review_closure.py`, `backend/tests/test_review_closure_service.py`, `backend/tests/test_review_closure_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-closure-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real external integration, evidence supplement, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red backend tests failed first because existing open cases returned without closure; TDD red frontend model test failed first because closure write helpers were missing; target backend unittest passed with 7 tests; target model test passed with 45 tests; lint, typecheck, and shadcn gate passed; API smoke on temporary latest backend 8003 returned `CLO-CASE-QUERY-001`; in-app browser smoke on 3026 rendered closed state with no `关闭案例` button; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 165 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM063 Import Center Review Evidence Write Entry

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061, IM062, and IM063 changes not pushed yet.`
- scope: controlled evidence supplement write for existing open review cases, detail-page evidence entry, model helper/test coverage, target backend test coverage, and traceability records.
- allowed_files_check: `backend/app/main.py`, `backend/app/review_evidence.py`, `backend/tests/test_review_evidence_service.py`, `backend/tests/test_review_evidence_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-evidence-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real external integration, conclusion write, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/main.py`, `backend/app/review_evidence.py`, `backend/tests/test_review_evidence_service.py`, `backend/tests/test_review_evidence_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-evidence-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real external integration, conclusion write, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red backend tests failed first because evidence write service/API did not exist; TDD red frontend model test failed first because evidence write helpers were missing; target backend unittest passed with 6 tests; target model test passed with 46 tests; lint, typecheck, and shadcn gate passed; API smoke on temporary latest backend 8003 wrote `EVD-CASE-EVIDENCE-SMOKE-001-001`; in-app browser smoke on 3026 rendered the open-case evidence panel with one `提交证据` button and rendered the closed-case blocker with no `提交证据` button; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 171 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM064 Import Center Review Conclusion Write Entry

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061, IM062, IM063, and IM064 changes not pushed yet.`
- scope: controlled conclusion supplement write for existing open review cases, detail-page conclusion entry, model helper/test coverage, target backend test coverage, and traceability records.
- allowed_files_check: `backend/app/main.py`, `backend/app/review_conclusion.py`, `backend/tests/test_review_conclusion_service.py`, `backend/tests/test_review_conclusion_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-conclusion-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `backend/app/main.py`, `backend/app/review_conclusion.py`, `backend/tests/test_review_conclusion_service.py`, `backend/tests/test_review_conclusion_api.py`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-conclusion-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, app route, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red backend tests failed first because conclusion write service/API did not exist; TDD red frontend model test failed first because conclusion write helpers were missing; target backend unittest passed with 6 tests; target model test passed with 47 tests; lint, typecheck, build with Node 22 PATH, and shadcn gate passed; API smoke on temporary latest backend 8003 wrote `CON-CASE-CONCLUSION-SMOKE-001-001`; SSR page smoke on 3026 rendered the open-case conclusion panel and conclusion record, and rendered the closed-case blocker with no `提交结论`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM065 Import Center Review Processing Timeline

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061, IM062, IM063, IM064, and IM065 changes not pushed yet.`
- scope: read-only processing timeline on `/data-quality/review-cases/[caseId]`, model helper/test coverage, shadcn-composed timeline component, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-processing-timeline.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-case-processing-timeline.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewCaseProcessingTimeline` was not exported; target model test passed with 48 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; direct `npm run build` on default Node 24 failed due existing Next/lightningcss native addon issue; in-app browser smoke on 3026 rendered `处理时间线`, `补充证据`, `补充结论`, `关闭案例`, and `已关闭`; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM066 Import Center Review Processing Stage Filters

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 through IM066 changes not pushed yet.`
- scope: read-only processing-stage filters on `/data-quality/review-cases`, existing detail API stage derivation, model helper/test coverage, and traceability records.
- allowed_files_check: `app/data-quality/review-cases/page.tsx`, `components/import-center-model.ts`, `components/import-center-review-cases-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/review-cases/page.tsx`, `components/import-center-model.ts`, `components/import-center-review-cases-workspace.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewCaseProcessingStage` was not exported; target model test passed with 49 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; in-app browser smoke on 3026 rendered `processingStage=closed` with `处理阶段`, `已关闭`, `复核案例列表`, and `CASE-QUERY-001`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM067 Import Center Review Owner Stage Matrix

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 through IM067 changes not pushed yet.`
- scope: read-only owner × processing-stage workload matrix on `/data-quality/review-cases`, model helper/test coverage, shadcn-composed matrix component, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-review-cases-workspace.tsx`, `components/import-center-review-owner-stage-matrix.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `components/import-center-review-cases-workspace.tsx`, `components/import-center-review-owner-stage-matrix.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no app route, backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewOwnerStageMatrix` was not exported; target model test passed with 50 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; in-app browser smoke on 3026 rendered `Owner 阶段负载`, `缺证据`, `缺结论`, `可关闭`, `已关闭`, `阶段未知`, and `复核案例列表`; href smoke found owner/stage links for `missing_conclusion`, `ready_to_close`, and `closed`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM068 Import Center Review Owner Context

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM060 after push; local branch has IM061 through IM068 changes not pushed yet.`
- scope: read-only same-owner processing context on `/data-quality/review-cases/[caseId]`, detail-page list/stage data loading, model helper/test coverage, shadcn-composed context component, and traceability records.
- allowed_files_check: `app/data-quality/review-cases/[caseId]/page.tsx`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-owner-context.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/review-cases/[caseId]/page.tsx`, `components/import-center-model.ts`, `components/import-center-review-case-detail-workspace.tsx`, `components/import-center-review-owner-context.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, write action, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` remains untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `summarizeImportReviewOwnerContext` was not exported; target model test passed with 51 tests; shadcn gate passed with documented baseline only; lint and typecheck passed; in-app browser smoke on 3026 rendered `同 Owner 处理上下文`, `查看 Owner 列表`, `进入首要阶段`, `复核案例详情`, and `处理时间线`; href smoke found same-owner list and priority-stage links; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM075 Import Center Review Current Continuation Priority

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM072; local branch has IM073, IM074, and IM075 changes not pushed yet.`
- scope: successful-submit current-case continuation priority inside `/data-quality/review-cases/[caseId]`, model helper/test coverage, browser smoke evidence, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, new UI component, dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, new UI component, dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because successful feedback still pointed to same-owner next case; target model test passed with 57 tests; shadcn gate passed with documented baseline only; lint, typecheck, and Node 22 build passed; in-app browser smoke on 3033 rendered `当前案例仍待处理` and `继续处理当前案例` for `CASE-EVIDENCE-SMOKE-001?evidence=success`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM076 Import Center Review Closure Handoff

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM072; local branch has IM073, IM074, IM075, and IM076 changes not pushed yet.`
- scope: closure-success queue handoff wording in review-case continuation model, model test coverage, browser smoke evidence, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, new UI component, dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, new UI component, dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because closure success still showed ordinary next-case wording; target model test passed with 57 tests; shadcn gate passed with documented baseline only; lint, typecheck, and Node 22 build passed; in-app browser smoke on 3034 rendered `当前案例已关闭` and `关闭后处理下一条` for `CASE-QUERY-001?closure=success`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM077 Import Center Review Open List Focus

- branch_name: `codex/im057-review-source-context`
- base_main_commit: `c4ae1b0`
- remote_status: `origin/codex/im057-review-source-context includes IM072; local branch has IM073 through IM077 changes not pushed yet.`
- scope: same-owner review continuation list links with `status=open`, model test coverage, browser smoke evidence, and traceability records.
- allowed_files_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, new UI component, dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, new UI component, dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because same-owner list links lacked `status=open`; target model test passed with 57 tests; shadcn gate passed with documented baseline only; lint, typecheck, and Node 22 build passed; in-app browser smoke on 3035 found `返回同 Owner 列表` href with `status=open`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM078 Import Center Field Mapping Template Maintenance

- branch_name: `codex/im078-template-maintenance`
- base_main_commit: `a2b29d9`
- remote_status: `branch created locally from pushed codex/im057-review-source-context; not pushed yet.`
- scope: second-level field-mapping template maintenance page, update/deactivate server actions over existing APIs, template card detail links, model helper/test coverage, browser smoke evidence, and traceability records.
- allowed_files_check: `app/data-quality/actions.ts`, `app/data-quality/field-mapping-templates/[templateId]/page.tsx`, `components/import-center-model.ts`, `components/import-center-template-management-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/actions.ts`, `app/data-quality/field-mapping-templates/[templateId]/page.tsx`, `components/import-center-model.ts`, `components/import-center-template-management-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because template detail/deactivate URL helpers were missing; target model test passed with 59 tests; shadcn gate passed with documented baseline only; lint, typecheck, and Node 22 build passed; in-app browser smoke on 3036 rendered the template detail page, found the batch-detail `维护模板` entry link, and verified no-op update success feedback; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM079 Import Center Field Mapping Template Create

- branch_name: `codex/im079-template-create`
- base_main_commit: `3bf1388`
- remote_status: `branch created locally from pushed codex/im078-template-maintenance; not pushed yet.`
- scope: second-level field-mapping template creation page, create server action over existing API, template management entry link, model helper/test coverage, browser smoke evidence, and traceability records.
- allowed_files_check: `app/data-quality/actions.ts`, `app/data-quality/field-mapping-templates/new/page.tsx`, `components/import-center-model.ts`, `components/import-center-template-management-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/actions.ts`, `app/data-quality/field-mapping-templates/new/page.tsx`, `components/import-center-model.ts`, `components/import-center-template-management-panel.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/PROJECT_CONTEXT.md`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because create URL/new page href helpers were missing; target model test passed with 59 tests; shadcn gate passed with documented baseline only; lint, typecheck, and Node 22 build passed; in-app browser smoke on 3037 rendered the new template page; static entry check found `新增模板` linked by `buildImportFieldMappingTemplateNewWorkspaceHref()`; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; first full `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests; final check rerun after branch-log evidence update before local commit.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM081 Import Center Independent Upload Workspace

- branch_name: `codex/im081-upload-workspace`
- base_main_commit: `9c389e5`
- remote_status: `branch created locally from pushed codex/im080-template-upload-prefill; not pushed yet.`
- scope: independent `/data-quality/uploads/new` CSV upload workspace, data-quality list entry, template-detail independent upload prefill link, model helper/test coverage, production DOM smoke evidence, and traceability records.
- allowed_files_check: `app/data-quality/uploads/new/page.tsx`, `app/data-quality/field-mapping-templates/[templateId]/page.tsx`, `components/import-center-batch-list-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/uploads/new/page.tsx`, `app/data-quality/field-mapping-templates/[templateId]/page.tsx`, `components/import-center-batch-list-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `buildImportUploadWorkspaceHref` was not exported; target model test passed with 63 tests; shadcn gate passed with documented baseline only; lint, typecheck, and Node 22 build passed; production DOM smoke on 3040 rendered the independent upload page with template prefill, found template-detail independent upload href, and found the list-page upload entry; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; first full `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests; final check rerun after branch-log evidence update before local commit.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM082 Import Center Upload Result Return

- branch_name: `codex/im082-upload-result-return`
- base_main_commit: `58c8812`
- remote_status: `branch created locally from pushed codex/im081-upload-workspace; not pushed yet.`
- scope: independent upload result redirect target, upload result workspace href helper, direct batch processing links in upload result feedback, upload form hidden return target, production DOM smoke evidence, and traceability records.
- allowed_files_check: `app/data-quality/actions.ts`, `app/data-quality/uploads/new/page.tsx`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/actions.ts`, `app/data-quality/uploads/new/page.tsx`, `components/import-center-model.ts`, `components/import-center-upload-form.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `buildImportUploadWorkspaceResultHref` was not exported; a second red test proved upload result feedback still linked to list query instead of second-level batch processing; target model test passed with 64 tests; lint, typecheck, shadcn gate, and Node 22 build passed; production DOM smoke on 3042 verified success/failed upload result pages and confirmed batch detail upload did not include the independent return hidden input; `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM083 Import Center Single-Batch Apply Entry

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `235276f`
- remote_status: `branch created locally from IM082; not pushed yet.`
- scope: single-batch apply entry on `/data-quality/[batchId]`, apply server action over existing apply APIs, model helpers/test coverage, production DOM smoke evidence, and traceability records.
- allowed_files_check: `app/data-quality/actions.ts`, `app/data-quality/[batchId]/page.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/actions.ts`, `app/data-quality/[batchId]/page.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, legacy traceability docs, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, new dependency, real external integration, approval, export, batch operation, permissions, production formula, settlement, or charge-factor files. `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red frontend model test failed first because `buildImportBatchApplyUrl` was not exported; target model test passed with 67 tests; lint, typecheck, shadcn gate, and Node 22 build passed; production DOM smoke on 3043 verified ready apply entry, apply success feedback, and blocked-state no-submit behavior; `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM084-IM086 Downstream Result Chain Planning

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `c4ae1b0`
- remote_status: `IM083 branch already pushed; downstream result chain planning changes are local only.`
- scope: define `R784-R786`, `US704-US706`, and `IM084-IM086`; seed only `US704/IM084` into current ready state; update registry/project-state/branch trace for the approved next chain.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no app, backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after the planning/state update; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM084 Applied Result Card And Next-Step Entry

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `e1714cc`
- remote_status: `branch includes pushed IM083 baseline; IM084 implementation is local only until PM asks to push.`
- scope: applied-result card and next-step entry on `/data-quality/[batchId]`, model helper/test coverage, current-state advancement from `IM084` to `IM085`, and local production-page smoke evidence.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target frontend model test failed first because `summarizeImportAppliedResultCard` was missing; model test then passed with 68 tests; lint, typecheck, Node 22 build, `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required for completion; production browser smoke on `http://127.0.0.1:3000/data-quality/BATCH-DEMO-REVIEW-20260511?apply=success` verified the result card plus `查看版本记录` and `查看下游结果追踪` links, and verified navigation to `?tab=result-trace`.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM085 Applied Version Result Positioning

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `058fc9d`
- remote_status: `branch includes pushed IM083 baseline plus local IM084 commit; IM085 implementation is local only until PM asks to push.`
- scope: direct version-result positioning from applied batches on `/data-quality/[batchId]`, supported comparison-run deep links, result-trace version-context section, model test coverage, and current-state advancement from `IM085` to `IM086`.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, `tasks/backlog.yaml`, and `scripts/tests/import-center-model.test.mjs`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, `tasks/backlog.yaml`, and `scripts/tests/import-center-model.test.mjs`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target frontend model test failed first because `summarizeImportAppliedVersionResultContext` did not exist; model test then passed with 69 tests; lint, typecheck, and Node 22 build passed; production browser smoke on `http://127.0.0.1:3000/data-quality/BATCH-DEMO-REVIEW-20260511?apply=success&tab=result-trace` verified the new version-context section, blocked-state copy for missing version info, and scoped links to batch-detail/result-trace. `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required for completion.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM087-IM089 Version Workbench Planning

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `948f9da`
- remote_status: `branch includes pushed IM086 baseline; version-workbench planning/spec changes are local only.`
- scope: define `R787-R789`, `US707-US709`, and `IM087-IM089`; seed only `US707/IM087` into current ready state; add the version-workbench implementation plan and update registry/project-state/branch trace for the approved next chain.
- allowed_files_check: `docs/superpowers/plans/2026-06-03-version-workbench-implementation-plan.md`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no app, backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `docs/superpowers/plans/2026-06-03-version-workbench-implementation-plan.md`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict` passed with current queue `US731/IM111`; `git diff --check` passed. `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed for the planning/state update; full check included frontend build and backend 191 tests OK. A final check is required after this branch-log evidence update before local commit.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM087 Version Workbench Ledger

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `dbe5ac1`
- remote_status: `branch includes pushed IM086 baseline plus local version-workbench spec commit; IM087 implementation is local only until PM asks to push.`
- scope: `/data-quality/versions` read-only version ledger page, data-quality sidebar entry, import-center model summary helpers/test coverage, current-state advancement from `IM087` to `IM088`, and local production-page smoke evidence.
- allowed_files_check: `app/data-quality/versions/**`, `components/app-sidebar.tsx`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/superpowers/plans/2026-06-03-version-workbench-implementation-plan.md`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/versions/**`, `components/app-sidebar.tsx`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/superpowers/plans/2026-06-03-version-workbench-implementation-plan.md`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD red model test failed first because `summarizeImportVersionWorkbench` was not exported; target model test then passed with 73 tests. `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests. In-app browser smoke on `http://localhost:3000/data-quality/versions` verified the page title, table, sidebar entry, and current ledger rows.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM088 Version Workbench Stable Jumps

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `929108d`
- remote_status: `branch includes pushed IM086 baseline plus local version-workbench planning/spec and IM087 ledger commits; IM088 implementation is local only until PM asks to push.`
- scope: `/data-quality/versions` stable row-level navigation, version-row comparison-run positioning reuse, current-state advancement from `IM088` to `IM089`, and local route/link smoke evidence.
- allowed_files_check: `app/data-quality/versions/**`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/versions/**`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: model TDD first failed because version-workbench rows had no secondary stable-link fields; after implementation `node scripts/tests/import-center-model.test.mjs` passed with 74 tests. `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, frontend lint, typecheck, Next build, and 177 backend unittests. Local smoke on `http://localhost:3000/data-quality/versions` confirmed the route title plus `查看批次详情` and `查看下游结果追踪` links on the live ledger page; current demo data did not surface a direct comparison-run row, so that path remains covered by model tests.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM089 Version Workbench Downstream Impact Summary

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `40d0d28`
- remote_status: `branch includes pushed IM086 baseline plus local version-workbench planning/spec, IM087 ledger, and IM088 stable-link commits; IM089 implementation is local only until PM asks to push.`
- scope: `/data-quality/versions` downstream impact summaries, review-case query reuse, current-state return to empty after the IM087-IM089 chain, and local production-page smoke evidence.
- allowed_files_check: `app/data-quality/versions/**`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/versions/**`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: model TDD first failed because version-workbench rows had no downstream impact fields; after implementation `node scripts/tests/import-center-model.test.mjs` passed with 74 tests. Local smoke on `http://localhost:3000/data-quality/versions` confirmed the new `下游影响` column plus blocked/empty impact summaries on the live demo rows. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after current-state return-to-empty updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM090-IM092 Comparison Result Callback Planning

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `3d427b3`
- remote_status: `branch includes pushed IM086 baseline plus local version-workbench chain; callback-chain planning and implementation are local only until PM asks to push.`
- scope: define `R790-R792`, `US710-US712`, and `IM090-IM092`; seed only `US710/IM090` into current ready state; continue the main callback chain inside existing result-trace and comparison-run-detail routes.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, backend, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after the planning/state update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM090 Latest Comparison Run Callback Card

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `3d427b3`
- remote_status: `branch includes pushed IM086 baseline plus local version-workbench chain; IM090 implementation is local only until PM asks to push.`
- scope: batch result-trace latest-run callback card, model summary coverage, current-state advancement from `IM090` to `IM091`, and local batch-page smoke evidence.
- allowed_files_check: `app/data-quality/[batchId]/**`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/[batchId]/**`, `components/import-center-result-trace-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: model TDD first failed because `summarizeImportLatestComparisonRunCallback` did not exist; after implementation `node scripts/tests/import-center-model.test.mjs` passed with 75 tests. Browser smoke on `http://localhost:3000/data-quality/BATCH-DEMO-REVIEW-20260511?tab=result-trace&compare=success&compareRun=RUN-LOCAL-SMOKE-001` confirmed the callback card path and the explicit blocked fallback state when the target run is not yet in the live list. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM091 Comparison Run Full Result Review Page

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `253a0ac`
- remote_status: `branch includes pushed IM086 baseline plus local version-workbench chain and IM090 callback card; IM091 implementation is local only until PM asks to push.`
- scope: `comparison run detail` full result-review context card, model summary coverage, current-state advancement from `IM091` to `IM092`, and local detail-page smoke evidence.
- allowed_files_check: `app/data-quality/comparison-runs/[runId]/**`, `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: model TDD first failed because `summarizeImportComparisonRunDetail` did not return `resultReviewContext`; after implementation `node scripts/tests/import-center-model.test.mjs` passed with 75 tests. Browser smoke on `http://localhost:3000/data-quality/comparison-runs/RUN-DEMO-FS-20260511` confirmed `完整结果回看主页`, `当前版本语境`, source version, business date, and result detail visibility. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM092 Comparison Run Return Loop

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `48ebe6c`
- remote_status: `branch includes pushed IM086 baseline plus local version-workbench chain, IM090 callback card, and IM091 result-review page; IM092 implementation is local only until PM asks to push.`
- scope: `comparison run detail` source-batch return loop, import-batch list reuse, model summary coverage, current-state return to empty after the IM090-IM092 chain, and local detail-page smoke evidence.
- allowed_files_check: `app/data-quality/comparison-runs/[runId]/**`, `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `app/data-quality/comparison-runs/[runId]/page.tsx`, `components/import-center-comparison-run-detail-workspace.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: model TDD first failed because `summarizeImportComparisonRunReturnLinks` was not exported; after implementation `node scripts/tests/import-center-model.test.mjs` passed with 76 tests and `npm run typecheck` passed. Browser smoke on `http://localhost:3000/data-quality/comparison-runs/RUN-DEMO-FS-20260511` confirmed `来源批次未定位`, `版本台账`, `查看版本工作台`, and no fabricated source-batch link when demo data cannot match source batches. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM093-IM095 Version Workbench Calculation Trigger Planning

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `892e868`
- remote_status: `branch includes pushed IM092 return-loop baseline; IM093-IM095 planning/state changes are local only until PM asks to push.`
- scope: define `R793-R795`, `US713-US715`, and `IM093-IM095`; seed only `US713/IM093` into current ready state; continue the local comparison-trigger flow inside the existing version workbench, batch result-trace, and comparison-run-detail routes.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, backend, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after the planning/state update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM093 Version Workbench Local Comparison Candidates

- branch_name: `codex/im083-single-batch-apply-entry`
- base_main_commit: `892e868`
- remote_status: `branch includes pushed IM092 return-loop baseline; IM093 planning commit and implementation are local only until PM asks to push.`
- scope: add a read-only `本地比对` candidate column to `/data-quality/versions`; summarize candidate comparison type, source version pair, business date range, and existing result-trace target; keep unsupported, unapplied, missing-version, and incomplete-source rows blocked without submit buttons.
- allowed_files_check: `components/import-center-model.ts`, `components/import-center-version-workbench.tsx`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, backend, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `node scripts/tests/import-center-model.test.mjs`, `npm run typecheck`, browser smoke on `http://127.0.0.1:3000/data-quality/versions`, `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required before Done Report.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM094 Version Workbench Single Comparison Submit

- branch_name: `codex/im094-version-workbench-single-compare`
- base_main_commit: `763ec00`
- remote_status: `main includes merged IM083-IM093 baseline; IM094 implementation is local only until PM asks to push.`
- scope: add a controlled single-version local comparison submit form on `/data-quality/versions`, reuse the existing comparison calculate API through a server action, preserve version-workbench filters on submit feedback, keep incomplete or unsupported candidates blocked without submit buttons, advance current state from `IM094` to `IM095`, and record local smoke evidence.
- allowed_files_check: `app/data-quality/actions.ts`, `app/data-quality/versions/**`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 77 tests; `bash scripts/check-state.sh --strict` passed; shadcn gate passed with 3 documented baseline findings; `npm run lint` passed; `npm run typecheck` passed; HTTP smoke on `http://127.0.0.1:3000/data-quality/versions?compare=success&compareRun=RUN-IM094-SMOKE` and failed-submit query confirmed success/failure feedback. Final `git diff --check` and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM095 Version Workbench Result Review Feedback

- branch_name: `codex/im095-version-workbench-result-review`
- base_main_commit: `84799e2`
- remote_status: `main includes merged IM094 baseline; IM095 implementation is local only until final merge/push.`
- scope: enhance `/data-quality/versions` submit feedback with matched-run result-review metrics, preserve a no-fabrication blocked state when the submitted run is not yet visible, return current state to empty after the IM093-IM095 chain, and record local HTTP smoke evidence.
- allowed_files_check: `app/data-quality/versions/**`, `components/import-center-version-workbench.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 78 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke on `http://127.0.0.1:3000/data-quality/versions?businessDate=2026-05-11&compare=success&compareRun=RUN-DEMO-FS-20260511` confirmed matched-run metrics, and `RUN-NOT-YET-IM095` confirmed no-fabrication blocked state. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM096-IM098 Master Data Maintenance Planning

- branch_name: `codex/im096-master-data-maintenance-planning`
- base_main_commit: `0d64d02`
- remote_status: `main includes merged IM095 baseline; IM096-IM098 planning/state changes are local only until final merge/push.`
- scope: define `R796-R798`, `US716-US718`, and `IM096-IM098`; seed only `US716/IM096` into current ready state; start with a read-only master-data maintenance workbench before entity detail or controlled write actions.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no business code, backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: planning and current-state files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; current file line budgets are within limits (`PROJECT_CONTEXT.md` 142/160, `STORY_QUEUE.yaml` 27/200, `ACTIVE_TASKS.yaml` 51/220, `BLOCKERS.md` 18/120). Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM096 Master Data Maintenance Workbench

- branch_name: `codex/im096-master-data-maintenance-workbench`
- base_main_commit: `b08f52b`
- remote_status: `main includes merged IM096-IM098 planning baseline; IM096 implementation is local only until final merge/push.`
- scope: add `/master-data` as a read-only master-data maintenance workbench entry under System Management; group maintenance objects by agents, sites, vendors, projects, skills, and bindings; show source batch/version, blocker summary, and next-step state without write actions.
- allowed_files_check: `app/master-data/**`, `components/master-data-maintenance-workbench.tsx`, `components/master-data-maintenance-model.ts`, `components/app-sidebar.tsx`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 4 tests; shadcn gate passed with 3 documented baseline findings; `npm run lint` passed; `npm run typecheck` passed; HTTP smoke on `http://127.0.0.1:3000/master-data` matched page title, System Management navigation entry, six entity groups, read-only workbench state, and next-step labels. `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM097 Master Data Entity Detail And Reference Impact

- branch_name: `codex/im097-master-data-reference-detail`
- base_main_commit: `2610844`
- remote_status: `main includes merged IM096 workbench baseline; IM097 implementation is local only until final merge/push.`
- scope: add `/master-data/[entityKey]` read-only detail pages for master-data entities and bindings; link every workbench row to detail; show source batch/version, effective-period and freeze-status empty states, and reference-impact summaries without fabricating counts.
- allowed_files_check: `app/master-data/**`, `components/master-data-maintenance-workbench.tsx`, `components/master-data-maintenance-model.ts`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 7 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke confirmed six workbench detail hrefs, `/master-data/bindings` reference-impact content, no-fabrication count labels, and 404 for an unknown entity key. `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM098 Master Data Controlled Action Shell

- branch_name: `codex/im098-master-data-controlled-actions`
- base_main_commit: `8697f6f`
- remote_status: `main includes merged IM097 entity-detail baseline; IM098 implementation is local only until final merge/push.`
- scope: add a non-writing controlled maintenance-action shell to `/master-data/[entityKey]`, covering create, edit, freeze, and effective-period adjustment with single-entity scope, reference-check requirements, failure boundaries, and disabled submit state.
- allowed_files_check: `app/master-data/**`, `components/master-data-maintenance-workbench.tsx`, `components/master-data-maintenance-model.ts`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 7 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke confirmed controlled action shell, action labels, single-entity scope, blocked-source failure boundary, and disabled `暂不提交` buttons. `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM099-IM101 Personnel Schedule Production Planning

- branch_name: `codex/im099-personnel-schedule-production-planning`
- base_main_commit: `361be37`
- remote_status: `main includes merged IM098 master-data action-shell baseline; IM099-IM101 planning/state changes are local only until final merge/push.`
- scope: define `R799-R801`, `US719-US721`, and `IM099-IM101`; seed only `US719/IM099` into current ready state; start personnel-schedule production with a read-only workbench before version detail or publish/freeze boundaries.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no business code, backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: planning and current-state files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; current file line budgets are within limits (`PROJECT_CONTEXT.md` 144/160, `STORY_QUEUE.yaml` 27/200, `ACTIVE_TASKS.yaml` 51/220, `BLOCKERS.md` 18/120). Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM099 Personnel Schedule Production Workbench

- branch_name: `codex/im099-personnel-schedule-production-workbench`
- base_main_commit: `923c315`
- remote_status: `main includes merged IM099-IM101 planning baseline; IM099 implementation is local only until final merge/push.`
- scope: add `/schedule-plans/production` as a read-only personnel-schedule production workbench under existing plan/schedule navigation; show source batch, schedule business version, application status, 0.5h expansion state, blocker summary, read-only boundary, and IM100/IM101 next-step labels.
- allowed_files_check: `app/schedule-plans/production/**`, `components/personnel-schedule-production-workbench.tsx`, `components/personnel-schedule-production-model.ts`, `components/app-sidebar.tsx`, `scripts/tests/personnel-schedule-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 4 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke on `http://127.0.0.1:3000/schedule-plans/production` matched `排班生产`, `只读工作台`, `人员排班生产台账`, `版本详情待 IM100`, and `发布/冻结边界待 IM101`; in-app browser smoke confirmed route, page signals, and only `排班生产` as the active sidebar item. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM100 Personnel Schedule Version Detail

- branch_name: `codex/im100-personnel-schedule-version-detail`
- base_main_commit: `4573173`
- remote_status: `main includes merged IM099 personnel-schedule production workbench baseline; IM100 implementation is local only until final merge/push.`
- scope: add `/schedule-plans/production/[batchId]` read-only version detail from the production workbench; show source batch/version, business date range, application state, successful source rows, shift-reference scope, personnel-scope no-fabrication notice, 0.5h expansion state, blocker summary, and return links.
- allowed_files_check: `app/schedule-plans/production/**`, `components/personnel-schedule-production-workbench.tsx`, `components/personnel-schedule-production-model.ts`, `scripts/tests/personnel-schedule-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 7 tests after TDD red failed on missing `summarizePersonnelScheduleProductionDetail`; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke on `http://127.0.0.1:3000/schedule-plans/production/BATCH-MISSING-IM100` matched `排班版本详情`, `排班版本未定位`, `不伪造人员级明细`, `暂未发现 0.5h 展开记录`, and `返回排班生产`; in-app browser smoke confirmed the same blocked no-fabrication state. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM101 Personnel Schedule Release Freeze Shell

- branch_name: `codex/im101-personnel-schedule-release-freeze-shell`
- base_main_commit: `8a09cfa`
- remote_status: `main includes merged IM100 personnel-schedule version-detail baseline; IM101 implementation is local only until final merge/push.`
- scope: add disabled publish, freeze, and unpublish safety-shell action cards to `/schedule-plans/production/[batchId]`, each showing source version, 0.5h expansion gate, reference-check gate, failure boundary, and disabled action label without any form or write path.
- allowed_files_check: `app/schedule-plans/production/**`, `components/personnel-schedule-production-workbench.tsx`, `components/personnel-schedule-production-model.ts`, `scripts/tests/personnel-schedule-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `actionShellTitle` and `actionShells` were missing, then passed with 7 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke on `http://127.0.0.1:3000/schedule-plans/production/BATCH-MISSING-IM101` matched `发布/冻结边界安全壳`, `发布版本`, `冻结版本`, `取消发布`, `暂不发布`, `暂不冻结`, `暂不取消发布`, and `引用校验待接入`; in-app browser smoke confirmed the same shell and disabled buttons. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM102-IM104 Demand Forecast Production Planning

- branch_name: `codex/im102-demand-forecast-production-planning`
- base_main_commit: `0f70f24`
- remote_status: `main includes merged IM101 personnel-schedule release/freeze shell baseline; IM102-IM104 planning/state changes are local only until final merge/push.`
- scope: define `R802-R804`, `US722-US724`, and `IM102-IM104`; seed only `US722/IM102` into current ready state; start demand-forecast production with a read-only workbench before version detail or change-tracking boundaries.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no business code, backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: planning and current-state files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; current file line budgets are within limits (`PROJECT_CONTEXT.md` 144/160, `STORY_QUEUE.yaml` 23/200, `ACTIVE_TASKS.yaml` 53/220, `BLOCKERS.md` 18/120). Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM102 Demand Forecast Production Workbench

- branch_name: `codex/im102-demand-forecast-production-workbench`
- base_main_commit: `4abe198`
- remote_status: `main includes merged IM102-IM104 planning baseline; IM102 implementation is local only until final merge/push.`
- scope: add `/demand-plans/production` as a read-only demand-forecast production workbench under existing plan/schedule navigation; show source batch, forecast business version, application status, skill-group/level/time-bucket alignment state, blocker summary, read-only boundary, and IM103/IM104 next-step labels.
- allowed_files_check: `app/demand-plans/production/**`, `components/demand-forecast-production-workbench.tsx`, `components/demand-forecast-production-model.ts`, `components/app-sidebar.tsx`, `scripts/tests/demand-forecast-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 4 tests after TDD red failed on missing `demand-forecast-production-model.ts`; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke on `http://127.0.0.1:3000/demand-plans/production` matched `预测生产`, `只读工作台`, `需求预测生产台账`, `版本详情待 IM103`, and `变更追踪边界待 IM104`; in-app browser smoke confirmed route, page signals, and only `预测生产` as the active sidebar item. Final `bash scripts/check-state.sh --strict`, `git diff --check --cached`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM103 Demand Forecast Version Detail

- branch_name: `codex/im103-demand-forecast-version-detail`
- base_main_commit: `075bded`
- remote_status: `main includes merged IM102 demand-forecast production workbench baseline; IM103 implementation is local only until final merge/push.`
- scope: add `/demand-plans/production/[batchId]` read-only version detail from the production workbench; show source batch/version, business date range, application state, successful source rows, skill-group/level alignment boundary, 0.5h time-bucket state, forecast-detail no-fabrication notice, alignment result, blocker summary, and return links.
- allowed_files_check: `app/demand-plans/production/**`, `components/demand-forecast-production-workbench.tsx`, `components/demand-forecast-production-model.ts`, `components/app-sidebar.tsx`, `scripts/tests/demand-forecast-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 7 tests after TDD red failed on missing `summarizeDemandForecastProductionDetail`; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; HTTP smoke on `http://127.0.0.1:3000/demand-plans/production/BATCH-MISSING-IM103` matched `预测版本详情`, `预测版本未定位`, `不伪造技能组/等级/时段行`, `暂未发现 0.5h 预测明细`, `变更追踪边界待 IM104`, and `返回预测生产`; in-app browser smoke confirmed the same blocked no-fabrication state and active sidebar item `预测生产`. Final `bash scripts/check-state.sh --strict`, `git diff --check --cached`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM104 Demand Forecast Change Tracking Shell

- branch_name: `codex/im104-demand-forecast-change-boundary`
- base_main_commit: `2328295`
- remote_status: `main includes merged IM103 demand-forecast version-detail baseline; IM104 implementation is local only until final merge/push.`
- scope: add a non-writing change-tracking boundary safety shell to `/demand-plans/production/[batchId]`; show source-version precheck, skill-group/level/0.5h alignment precheck, downstream-impact precheck, failure boundary, and disabled action cards for recording forecast changes, checking downstream impact, and updating production scope.
- allowed_files_check: `app/demand-plans/production/**`, `components/demand-forecast-production-workbench.tsx`, `components/demand-forecast-production-model.ts`, `scripts/tests/demand-forecast-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `changeTracking` was missing, then passed with 8 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; in-app browser smoke on `http://127.0.0.1:3000/demand-plans/production/BATCH-MISSING-IM103` matched `变更追踪边界安全壳`, source-version blocked state, downstream-impact blocked state, failure-boundary copy, and disabled `暂不写入`/`暂不提交`/`暂不变更` buttons. Final `bash scripts/check-state.sh --strict`, `git diff --check --cached`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM105-IM107 Actual Log Production Planning

- branch_name: `codex/im105-actual-log-production-planning`
- base_main_commit: `75407dd`
- remote_status: `main includes merged IM104 demand-forecast change-tracking shell baseline; IM105-IM107 planning/state changes are local only until final merge/push.`
- scope: define `R805-R807`, `US725-US727`, and `IM105-IM107`; seed only `US725/IM105` into current ready state; start login/status-log production handling with a read-only workbench under existing Data & Integration navigation before processing detail or status-dictionary exception shells.
- allowed_files_check: `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no business code, backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: planning and current-state files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `bash scripts/check-state.sh --strict`, `git diff --check`, and final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` are required after the planning/state update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM105 Actual Log Production Workbench

- branch_name: `codex/im105-actual-log-production-workbench`
- base_main_commit: `e95bb67`
- remote_status: `main includes merged IM105-IM107 actual-log production planning baseline; IM105 implementation is local only until final merge/push.`
- scope: add `/actual-logs/production` as a read-only login/status-log production workbench under existing Data & Integration navigation; show source batch, actual-log business version, application state, business date range, timezone boundary, cross-day handling boundary, processing boundary, blocker summary, and IM106/IM107 next-step labels.
- allowed_files_check: `app/actual-logs/production/**`, `components/actual-log-production-workbench.tsx`, `components/actual-log-production-model.ts`, `components/app-sidebar.tsx`, `scripts/tests/actual-log-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 4 tests after TDD red failed on missing `actual-log-production-model.ts`; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; in-app browser smoke on `http://127.0.0.1:3000/actual-logs/production` matched title, production ledger, timezone boundary, cross-day boundary, no-compare boundary, and active `CORN 状态日志` navigation. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM106 Actual Log Processing Detail

- branch_name: `codex/im106-actual-log-processing-detail`
- base_main_commit: `9d7e305`
- remote_status: `main includes merged IM105 actual-log production workbench baseline; IM106 implementation is local only until final merge/push.`
- scope: add `/actual-logs/production/[batchId]` read-only processing explanation detail from the login/status-log production workbench; show source batch/version context, business-day ownership, Asia/Shanghai timezone checks, cross-day status-interval split explanation, status dictionary rows, status interval rows, login-event rows, and no-detail empty states.
- allowed_files_check: `app/actual-logs/production/**`, `components/actual-log-production-workbench.tsx`, `components/actual-log-production-model.ts`, `scripts/tests/actual-log-production-model.test.mjs`, `docs/current/**`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected implementation and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `summarizeActualLogProcessingDetail` was missing, then passed with 7 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; in-app browser smoke on `http://127.0.0.1:3000/actual-logs/production` matched title, ledger, empty state, and no-compare boundary; direct smoke on `http://127.0.0.1:3000/actual-logs/production/BATCH-NOT-FOUND` matched processing detail title, missing-batch state, no-fabrication empty state, timezone empty state, and cross-day empty state. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM107 Actual Log Status Dictionary Exception Shell

- branch_name: `codex/im107-actual-log-exception-shell`
- base_main_commit: `a4bbd23`
- remote_status: `main includes merged IM106 actual-log processing detail baseline; IM107 implementation is local only until final merge/push.`
- scope: add a non-writing status-dictionary and exception-explanation safety shell to `/actual-logs/production/[batchId]`; show status dictionary, unknown status, timezone error, cross-day interval, frozen-employee reference boundaries, and disabled future action buttons.
- allowed_files_check: `app/actual-logs/production/**`, `components/actual-log-production-workbench.tsx`, `components/actual-log-production-model.ts`, `scripts/tests/actual-log-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected actual-log frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `unknownStatusCount` and `exceptionShell` were missing, then passed with 8 tests; `npm run lint` passed; `npm run typecheck` passed; shadcn gate passed with 3 documented baseline findings; in-app browser smoke on `http://127.0.0.1:3000/actual-logs/production/BATCH-STATUS-001` matched `状态字典与异常解释安全壳`, disabled `暂不变更字典`/`暂不提交规则`/`暂不重算工时` buttons, `冻结员工引用`, and `逐行处理解释`. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 177 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM108-IM110 Master Data CRUD Planning

- branch_name: `codex/im108-master-data-maintenance-api`
- base_main_commit: `ef52229`
- remote_status: `main includes merged IM107 actual-log exception shell baseline; IM108 implementation and IM109 current-state handoff are local only until final merge/push.`
- scope: define `R808-R810`, `US728-US730`, and `IM108-IM110`; complete `US728/IM108` with a backend-only single-agent maintenance API before frontend forms or non-agent object expansion; advance current state to `US729/IM109`.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/master_data_persistence.py`, `backend/app/master_data_maintenance.py`, backend target tests, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, frontend form, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM108 backend/model/repository/service/test files plus traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed on missing `backend.app.master_data_maintenance` and missing `maintain_master_data_employee`; after implementation `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service backend.tests.test_master_data_maintenance_api -v` passed with 8 tests. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 185 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM109 Master Data Agent Controlled Submit

- branch_name: `codex/im109-master-data-agent-submit`
- base_main_commit: `ef52229`
- stacked_on: `d83b6e0 feat: add master data employee maintenance api`
- remote_status: `IM108 branch is pushed; IM109 implementation is local only until final merge/push.`
- scope: connect `/master-data/agents` to the IM108 single-agent maintenance API through a Next server action; show controlled submit forms for create, edit, freeze, and effective-period changes; show success and backend-error feedback; keep non-agent master-data entities as read-only safety shells.
- allowed_files_check: `app/master-data/**`, `components/master-data-maintenance-workbench.tsx`, `components/master-data-maintenance-model.ts`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, schema, migration, package, lockfile, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM109 frontend page/server-action/model/component/test files plus traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `buildMasterDataAgentMaintenanceApiPath` was not exported, then passed with 10 tests; `npm run lint` passed; `npm run typecheck` passed; Node 22 `npm run build` passed. In-app browser smoke on `http://127.0.0.1:3000/master-data/agents` matched `坐席受控提交`, `提交新增`, `提交编辑`, `提交冻结`, `提交有效期`, and `不进入其他主数据对象`; smoke on `/master-data/skills` confirmed no agent submit section and disabled `暂不提交` actions. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 185 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM110 Master Data Entities And Bindings Maintenance

- branch_name: `codex/im110-master-data-entities-bindings`
- base_main_commit: `ef52229`
- stacked_on: `c5c8928 feat: add master data agent submit flow`
- remote_status: `IM108 and IM109 branches are pushed; IM110 implementation is local only until final merge/push.`
- scope: extend master-data maintenance from agents to workplaces, suppliers, projects, skills, and binding relationships; expose controlled submit forms on the corresponding `/master-data/[entityKey]` detail pages; validate binding references for employee, supplier, workplace, project, and skill; keep binding freeze disabled because bindings have no status field.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/master_data_persistence.py`, `backend/app/master_data_maintenance.py`, backend target tests, `app/master-data/**`, `components/master-data-maintenance-workbench.tsx`, `components/master-data-maintenance-model.ts`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM110 backend/frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: backend RED first failed on missing `maintain_employee_binding` and `maintain_master_data_binding`; after implementation `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service backend.tests.test_master_data_maintenance_api -v` passed with 14 tests. Frontend RED first failed on missing `buildMasterDataBindingMaintenanceApiPath`; after implementation `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 12 tests. `npm run lint`, `npm run typecheck`, and Node 22 `npm run build` passed. In-app browser smoke on `http://127.0.0.1:3000/master-data/skills` matched `技能受控提交`, `提交新增`, `提交编辑`, `提交冻结`, and `提交有效期`; smoke on `/master-data/bindings` matched `绑定关系受控提交`, `提交新增`, `提交编辑`, `提交有效期`, and `冻结动作保持禁用`, with no `提交冻结`. Final `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 191 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM111 Personnel Schedule Version Detail API

- branch_name: `codex/im111-schedule-version-detail-api`
- base_main_commit: `ef52229`
- stacked_on: `eb41fe9 feat: extend master data maintenance entities`
- remote_status: `IM110 branch is pushed; IM111 implementation is local only until final check/commit/push.`
- scope: add a backend-only read-only personnel-schedule production version detail API by batch ID; response covers source batch context, schedule_version_id, business date range, schedule detail rows, and 0.5h expanded intervals.
- allowed_files_check: `backend/app/main.py`, `backend/app/models.py`, `backend/app/personnel_schedule_persistence.py`, `backend/tests/test_personnel_schedule_production_api.py`, `backend/tests/test_personnel_schedule_persistence.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no frontend app/components, package, lockfile, schema, migration, permission, approval, export, batch operation, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected IM111 backend/API/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target RED first failed on missing `get_schedule_version_by_import_version` and missing `get_personnel_schedule_production_detail`; after implementation `.venv/bin/python -m unittest backend.tests.test_personnel_schedule_persistence backend.tests.test_personnel_schedule_production_api -v` passed with 7 tests. `bash scripts/check-state.sh --strict`, `git diff --check`, and `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed after traceability updates; full check included frontend build and backend 195 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM124 Personnel Schedule Detail Workspace Tabs

- branch_name: `codex/im124-schedule-production-detail-tabs`
- base_main_commit: `ef52229`
- stacked_on: `751f53b refactor: split actual log detail workspace`
- remote_status: `IM123 branch is pushed; IM124 implementation is local only until final check/commit/push.`
- scope: split `/schedule-plans/production/[batchId]` from a long stacked detail page into tabbed workspaces for overview, source/version context, real rows, local comparison entry, and publish/freeze boundaries.
- allowed_files_check: `components/personnel-schedule-production-workbench.tsx`, `components/personnel-schedule-production-model.ts`, `scripts/tests/personnel-schedule-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected personnel-schedule frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `workspaceTabs` was missing, then passed with 9 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn self-review grep found no hardcoded neutral/gray/slate/zinc/stone colors, `space-x/y`, or `w-* h-*` drift in the changed component; in-app browser smoke on `http://127.0.0.1:3000/schedule-plans/production/BATCH-SCH-001` verified the five tabs `总览`, `来源与版本`, `真实明细`, `本地比对`, and `发布冻结边界` plus the no-fabrication blocked detail state; full `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed twice after traceability updates, with frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM125 Demand Forecast Detail Workspace Tabs

- branch_name: `codex/im125-demand-production-detail-tabs`
- base_main_commit: `ef52229`
- stacked_on: `f1f13a5 refactor: split schedule production detail workspace`
- remote_status: `IM124 branch is pushed; IM125 implementation is local only until final check/commit/push.`
- scope: split `/demand-plans/production/[batchId]` from a long stacked detail page into tabbed workspaces for overview, source/alignment context, forecast rows, local comparison entry, and change-tracking boundaries.
- allowed_files_check: `components/demand-forecast-production-workbench.tsx`, `components/demand-forecast-production-model.ts`, `scripts/tests/demand-forecast-production-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected demand-forecast frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `workspaceTabs` was missing, then passed with 10 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn self-review grep found no hardcoded neutral/gray/slate/zinc/stone colors, `space-x/y`, or `w-* h-*` drift in the changed component; in-app browser smoke on `http://127.0.0.1:3000/demand-plans/production/BATCH-FC-001` verified the five tabs `总览`, `来源与对齐`, `预测明细`, `本地比对`, and `变更边界` plus the no-fabrication blocked detail state; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM126 Master Data Detail Workspace Tabs

- branch_name: `codex/im126-master-data-detail-tabs`
- base_main_commit: `ef52229`
- stacked_on: `e092a39 refactor: split demand production detail workspace`
- remote_status: `IM125 branch is pushed; IM126 implementation is local only until final check/commit/push.`
- scope: split `/master-data/[entityKey]` from a long stacked detail page into tabbed workspaces for overview, source/reference context, controlled actions, submit forms, and maintenance boundaries.
- allowed_files_check: `components/master-data-maintenance-workbench.tsx`, `components/master-data-maintenance-model.ts`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected master-data frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `workspaceTabs` was missing, then passed with 12 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn self-review grep found no hardcoded neutral/gray/slate/zinc/stone colors, `space-x/y`, or `w-* h-*` drift in the changed component; in-app browser smoke on `http://127.0.0.1:3000/master-data/agents` verified the five tabs `总览`, `来源与引用`, `受控动作`, `提交表单`, and `维护边界`, plus submit-form content `坐席受控提交`/`提交新增`/`提交编辑`/`提交冻结`/`提交有效期` and boundary content `不进入批量维护`/`不伪造引用数量`; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM127 Import Batch Detail Subtabs

- branch_name: `codex/im127-import-batch-detail-subtabs`
- base_main_commit: `ef52229`
- stacked_on: `cd696f1 refactor: split master data detail workspace`
- remote_status: `IM126 branch is pushed; IM127 implementation is local only until final check/commit/push.`
- scope: split the `/data-quality/[batchId]` batch-detail panel into second-level tabs for overview, processing summary, exception trace, version records, and row results.
- allowed_files_check: `components/import-center-batch-detail-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected import-center frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `workspaceTabs` was missing from `summarizeImportBatchDetail`, then passed with 79 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn self-review found and fixed new hardcoded `amber-500` token drift, then `node scripts/check-shadcn-ui.mjs` passed with only the documented baseline finding; in-app browser smoke on `http://127.0.0.1:3000/data-quality/BATCH-IM083-SMOKE-002?tab=batch-detail` verified the second-level tabs `总览`, `处理摘要`, `异常追踪`, `版本记录`, and `行结果`, plus hidden-section content for error fields/next action, read-only trace, generated version, and row preview; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM128 Field Mapping Template Detail Workspace Tabs

- branch_name: `codex/im128-template-detail-workspace-tabs`
- base_main_commit: `ef52229`
- stacked_on: `3db8d5a refactor: split import batch detail subtabs`
- remote_status: `IM127 branch is pushed; IM128 implementation is local only until final check/commit/push.`
- scope: split `/data-quality/field-mapping-templates/[templateId]` into tabs for overview, maintenance form, mapping rows, and maintenance boundaries.
- allowed_files_check: `app/data-quality/field-mapping-templates/[templateId]/page.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected template-detail frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `summarizeImportFieldMappingTemplateDetail` was not exported, then passed with 80 tests; `npm run typecheck` passed; `npm run lint` passed; `node scripts/check-shadcn-ui.mjs` passed with only the documented baseline finding; in-app browser smoke on `http://127.0.0.1:3000/data-quality/field-mapping-templates/TPL-IM027-SMOKE-001` verified the tabs `总览`, `维护表单`, `字段明细`, and `维护边界`, plus hidden-section content for `模板维护`/`保存模板`, mapping rows with `source_key`, and `停用模板`; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM129 Field Mapping Template Management Tabs

- branch_name: `codex/im129-template-management-tabs`
- base_main_commit: `ef52229`
- stacked_on: `ad7541a refactor: split template detail workspace`
- remote_status: `IM128 branch is pushed; IM129 implementation is local only until final check/commit/push.`
- scope: split `ImportCenterTemplateManagementPanel` into tabs for overview, template fit guidance, and template list/cards.
- allowed_files_check: `components/import-center-template-management-panel.tsx`, `components/import-center-model.ts`, `scripts/tests/import-center-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected template-management frontend/model/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test first failed because `workspaceTabs` was missing from `summarizeImportFieldMappingTemplates`, then passed with 80 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn self-review grep found no hardcoded neutral/gray/slate/zinc/stone/amber colors, `space-x/y`, or `w-* h-*` drift in the changed component; in-app browser smoke on `http://127.0.0.1:3000/data-quality/BATCH-IM083-SMOKE-002?tab=data-tools` verified tabs `总览`, `模板适配`, and `模板列表`, plus hidden-section content for fit guidance and template list card `TPL-IM027-SMOKE-001`; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM130 Product Structure Correction

- branch_name: `codex/im130-product-structure-correction`
- base_main_commit: `6ccd1b4`
- stacked_on: `ecd46bb refactor: split template management workspace`
- remote_status: `IM129 branch is pushed; IM130 implementation is local only until final check/commit/push.`
- scope: remove the data-ingestion status panel from the business overview and remove placeholder or deferred-capability entries from `AppSidebar`.
- allowed_files_check: `app/dashboard/page.tsx`, `components/app-sidebar.tsx`, `scripts/tests/product-structure.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no personnel CRUD, backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected dashboard/sidebar frontend, product-structure test, and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target product-structure test first failed because `/dashboard` still mounted `DataSyncStatus` and the sidebar still exposed placeholder entries such as `今日履约`; after implementation `node --test scripts/tests/product-structure.test.mjs` passed with 2 tests. `npm run typecheck` passed. `npm run lint` passed. In-app browser smoke on `http://127.0.0.1:3000/dashboard` verified `经营总览`, business metric content, and anomaly table content remain visible while `数据接入状态` and the removed placeholder/deferred entries are not visible. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 199 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM131 Personnel Master Data Organization And Skill Model

- branch_name: `codex/im131-master-data-org-skill-model`
- base_main_commit: `6ccd1b4`
- stacked_on: `5bf22e8 fix: correct dashboard and sidebar product structure`
- remote_status: `IM130 branch is pushed; IM131 implementation is local only until final check/commit/push.`
- scope: extend local master-data persistence with organization hierarchy, employee type, employee organization/workplace links, skill category, employee multi-skill rows, import parsing, and Alembic migration coverage.
- allowed_files_check: `backend/app/models.py`, `backend/app/master_data_persistence.py`, `backend/app/master_data_import.py`, `backend/app/master_data_maintenance.py`, `backend/app/import_readiness.py`, `backend/migrations/versions/20260604_0009_master_data_org_skill_model.py`, `backend/tests/test_master_data_persistence.py`, `backend/tests/test_master_data_import_service.py`, `backend/tests/test_master_data_import_api.py`, `backend/tests/test_database_foundation_closeout.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, frontend page, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected backend model/persistence/import/readiness/migration/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target persistence test first failed because `EmployeeSkillInput` was missing, then failed because same-batch child organization validation could not see the parent before flush; after implementation `.venv/bin/python -m unittest backend.tests.test_master_data_persistence -v` passed with 3 tests. Migration closeout test first failed because `master_data_organizations` and `master_data_employee_skills` were missing from Alembic head, then `.venv/bin/python -m unittest backend.tests.test_database_foundation_closeout -v` passed with 2 tests. Main master-data import/maintenance/readiness regression `.venv/bin/python -m unittest backend.tests.test_master_data_import_service backend.tests.test_master_data_import_api backend.tests.test_master_data_maintenance_service backend.tests.test_master_data_maintenance_api backend.tests.test_import_readiness_api -v` passed with 32 tests. `npm run typecheck` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 201 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM132 Personnel Master Data Real List

- branch_name: `codex/im132-personnel-list-real-data`
- base_main_commit: `6ccd1b4`
- stacked_on: `3530ef1 feat: extend personnel master data model`
- remote_status: `IM131 branch is pushed; IM132 implementation is local only until final check/commit/push.`
- scope: add a read-only personnel master-data list API and show the resulting real employee rows on `/master-data/agents` overview with employee status, employee type, organization path, workplace name, and multi-skill labels.
- allowed_files_check: `backend/app/models.py`, `backend/app/master_data_persistence.py`, `backend/app/main.py`, `backend/tests/test_master_data_maintenance_api.py`, `app/master-data/[entityKey]/page.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, migration, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected backend read-only API/repository/model, existing agents page/model/component/test, and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target backend test first failed because `list_master_data_employees` was missing, then `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_api -v` passed with 7 tests including legacy local-schema fallback. Target frontend model test first failed because `summarizeMasterDataEmployeeList` was not exported, then passed with 13 tests. `npm run typecheck` passed. Browser smoke on `http://127.0.0.1:3000/master-data/agents` verified personnel totals, real employee row `张三`, columns `组织/职场`/`技能`/`有效期`, and no API 500. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 203 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM133 Agent Core Edit Fields

- branch_name: `codex/im133-agent-edit-core-fields`
- base_main_commit: `6ccd1b4`
- stacked_on: `c100c5b feat: show real personnel master data list`
- remote_status: `IM132 branch is pushed; IM133 implementation is local only until final check/commit/push.`
- scope: extend the existing single-agent create/edit form and server action payload to include employee type, organization ID, and workplace ID, with backend regression for single-agent edit.
- allowed_files_check: `app/master-data/[entityKey]/actions.ts`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, `scripts/tests/master-data-maintenance-model.test.mjs`, `backend/tests/test_master_data_maintenance_service.py`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, migration, batch maintenance, approval, export, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected existing agent actions/model/workbench/test and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target frontend model test first failed because agent payload omitted `employee_type`, `organization_id`, and `workplace_id`, then passed with 13 tests; backend service regression passed with 10 tests; `npm run typecheck` passed; `npm run lint` passed; in-app browser smoke on `http://127.0.0.1:3000/master-data/agents` verified the existing `提交表单` workspace shows `新增坐席`, `编辑坐席`, `人员类型`, `组织 ID`, `职场 ID`, `自有员工`, and `外包员工`; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 204 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM134 Agent Skill Set Maintenance

- branch_name: `codex/im134-agent-skills-single-edit`
- base_main_commit: `6ccd1b4`
- stacked_on: `48a0e13 feat: support core agent edit fields`
- remote_status: `origin/codex/im134-agent-skills-single-edit was pushed at 90d9aa0; current correction is local until final check/commit/push.`
- scope: add a controlled single-employee skill-set replace maintenance path, including backend service/API, frontend server action, a customer-service personnel management list, separate create/edit/skill-maintenance subpages, a freeze confirmation modal, model tests, and traceability.
- allowed_files_check: `backend/app/models.py`, `backend/app/master_data_persistence.py`, `backend/app/master_data_maintenance.py`, `backend/app/main.py`, `backend/tests/test_master_data_maintenance_service.py`, `backend/tests/test_master_data_maintenance_api.py`, `app/master-data/[entityKey]/actions.ts`, `app/master-data/[entityKey]/page.tsx`, `app/master-data/agents/**`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no package, lockfile, migration, batch maintenance, approval, export, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected backend maintenance/model/persistence/API, agents list/subpage/action/workbench/model/test, and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: backend RED failed because `maintain_employee_skills` and `maintain_master_data_employee_skills` were missing; after implementation service tests passed with 11 tests and API tests passed with 8 tests. Frontend RED failed because `buildMasterDataAgentSkillMaintenanceApiPath` was missing; after implementation model tests passed with 14 tests. First structure correction moved the skill form to a separate tab, but PM rejected the product shape because `/master-data/agents` should be a personnel management list. Second structure correction added a RED model contract for `客服人员` filters, bulk toolbar, table columns, and row-level actions; after correction `/master-data/agents` defaults to the management list, no longer renders the old long tab workspace by default, and opens single-person create/edit/freeze/skill forms only through explicit row/top actions. Third structure correction split actions by B2B page pattern: `新建` goes to `/master-data/agents/new`, `编辑` goes to `/master-data/agents/[employeeId]/edit`, skill replacement goes to `/master-data/agents/[employeeId]/skills/edit`, and freeze uses a confirmation modal on the list page. Target model tests passed with 15 tests. `npm run typecheck` passed. `npm run lint` passed. Local HTML smoke verified the list page exposes subpage links and no default inline form, and `/master-data/agents/new` renders `新建客服人员`, `人员信息`, `提交新增`, and `返回客服人员`. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 206 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM135 Agent Management UI Detail Polish

- branch_name: `codex/im135-master-data-ui-detail-polish`
- base_main_commit: `a4c4221`
- stacked_on: `a4c4221 fix: split agent management actions`
- remote_status: `main and IM134 were pushed before IM135; IM135 is local only until final check/commit/push.`
- scope: polish `/master-data/agents` filter dropdowns and row-level action sizing after PM UI feedback.
- allowed_files_check: `components/master-data-maintenance-workbench.tsx`, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/PROJECT_STATE.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend, app route, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor files.
- scope_diff_check: expected master-data workbench UI detail correction and traceability files only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target model test passed with 15 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn grep found no hardcoded neutral/gray/slate/zinc/stone colors, `space-x/y`, old `variant="link" className="h-auto p-0"` row buttons, or `有效期调整待拆分` text. In-app browser smoke on `http://127.0.0.1:3000/master-data/agents` measured 5 dropdown triggers at 32px height and 14px text, dropdown content width equal to trigger width, row edit/freeze actions at 24px height and 12px text, and more action at 24px height. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 206 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM135 UI Narrative Cleanup

- branch_name: `codex/im135-master-data-ui-detail-polish`
- base_main_commit: `5d70579`
- stacked_on: `5d70579 fix: polish agent management controls`
- remote_status: `local correction only until final check/commit/push.`
- scope: remove PM-rejected non-functional page descriptions, boundary/safety-shell cards, `MVP`/`No Database` labels, `IMxxx` references, and user-visible "what this page does not do" explanations from master data, production ledgers, import center, review-case, template, upload, and legacy schedule pages.
- allowed_files_check: `app/**`, `components/**`, and `docs/dev/branch-log.md` only for UI copy/card cleanup; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor changes.
- scope_diff_check: expected UI/model copy cleanup and branch-log only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: `rg` keyword scan for `MVP`, `IMxxx`, `边界`, `只读`, `安全壳`, `No Database`, `不接数据库`, `审批、导出`, `批量处理`, `自动排班`, `boundary`, and related development-boundary wording returned no matches in `app` and `components`; `git diff --check` passed; `npm run lint` passed; `npm run typecheck` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 206 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM135 UI Narrative Cleanup Follow-up

- branch_name: `codex/im135-master-data-ui-detail-polish`
- base_main_commit: `2a12e4c`
- stacked_on: `2a12e4c fix: remove internal boundary UI copy`
- remote_status: `2a12e4c was pushed; follow-up correction is local until final check/commit/push.`
- scope: second-pass omission audit after PM requested no misses; remove remaining user-visible `API`, `本地`, `受控`, `暂不能/暂不可/暂不`, `批量`, settlement wording, service-address links, `local://` prefill values, and `真实版本` development wording from app/component UI copy while preserving code identifiers such as `API_BASE_URL`.
- allowed_files_check: `app/**`, `components/**`, `lib/**`, and `docs/dev/branch-log.md` only for UI copy cleanup and code-identifier repair after mechanical replacement; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor changes.
- scope_diff_check: expected UI/model copy cleanup, service-error copy cleanup, and branch-log only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: second-pass `rg` scan for `No Database`, `MVP`, `IMxxx`, `DBxxx`, `安全壳`, `边界`, `只读`, `受控`, `本地`, `local://`, `/api/v1` page links, `真实版本`, `不接数据库`, `审批`, `导出`, `批量`, `权限`, `自动排班`, `结算`, `公式`, `API` with user-visible spacing, and related wording returns only environment/code constants `API_BASE_URL`, `BPO_API_BASE_URL`, and `NEXT_PUBLIC_BPO_API_BASE_URL`; `git diff --check` passed; `npm run lint` passed; `npm run typecheck` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with frontend build and backend 206 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM135 UI Narrative Cleanup Final Audit

- branch_name: `codex/im135-master-data-ui-detail-polish`
- base_main_commit: `e508067`
- stacked_on: `e508067 fix: clean remaining internal UI wording`
- remote_status: `e508067 was pushed; final audit correction is local until final check/commit/push.`
- scope: final PM-requested no-omission audit for remaining implementation-path wording in app/component UI, model summaries, focused model tests, and current project-state documentation. Product pages must use business state/action wording only; Harness stop conditions stay in Harness files rather than being rendered as page requirements.
- allowed_files_check: `app/**`, `components/**`, `scripts/tests/import-center-model.test.mjs`, `scripts/tests/master-data-maintenance-model.test.mjs`, `docs/current/PROJECT_CONTEXT.md`, `docs/PROJECT_STATE.md`, and `docs/dev/branch-log.md`; no backend, package, lockfile, schema, migration, dependency, approval, export, batch operation, permission, real external integration, automatic scheduling, production formula, settlement, or charge-factor changes.
- scope_diff_check: expected UI copy cleanup, app-route result links instead of raw result-query API links, model/test assertion alignment, current docs wording cleanup, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: runtime/app keyword scan removed remaining user-visible service-address, local-comparison, boundary/safety-shell, no-fabrication, and unavailable-state implementation wording from `app` and `components`; code-only API builders and fetch paths remain. Target model tests passed with 95 tests. `bash scripts/check-state.sh --strict` passed with `PROJECT_CONTEXT` at 160/160 lines. `git diff --check` passed. `npm run lint` passed. `npm run typecheck` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend 206 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM136 Business-first IA Cleanup

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `0d2d77b fix: finish UI narrative cleanup audit`
- remote_status: `IM135 final audit was pushed; IM136 is local until final check/commit/push.`
- scope: PM-requested correction to remove center-first product architecture from navigation and visible UI wording; keep import/upload/version/batch capabilities as lower-level business-page utilities and route primary actions back to personnel, schedule, forecast, and actual-log pages.
- allowed_files_check: `app/**`, `components/**`, focused frontend model tests, `scripts/tests/product-structure.test.mjs`, and `docs/dev/branch-log.md`; no backend, package, lockfile, schema, migration, dependency, auth/permissions, approval, export, batch-operation capability, automatic scheduling, settlement, formula, or charge-factor changes.
- scope_diff_check: expected IA/nav cleanup, business-page upload entries with file-type prefill, `/master-data` redirect to `/master-data/agents`, removal of user-visible `导入中心`/`数据质量`/`版本工作台`/`接入批次工作台` wording, focused tests aligned to current product wording, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target tests passed with 124 tests covering product structure, import model, master-data model, personnel schedule production model, demand forecast production model, and actual-log production model; user-visible keyword scan in `app` and `components` leaves only the existing `运营工作台` nav entry plus `业务版本列表` actions; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend 206 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM136 Master Data List Correction Follow-up

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `f0f5912 fix: realign business navigation and import entry points`
- remote_status: `f0f5912 was pushed; this follow-up correction is local until final check/commit/push.`
- scope: PM-requested correction to split master-data object pages away from the rejected generic long detail workspace. `/master-data` stays redirected to `/master-data/agents`; `/master-data/agents` stays a personnel list with create/edit child pages and freeze dialog; `/master-data/sites`, `/master-data/vendors`, `/master-data/projects`, `/master-data/skills`, and `/master-data/bindings` now render direct list pages from master-data rows instead of the old tabbed detail/submit workspace.
- allowed_files_check: `app/master-data/**`, `components/master-data-maintenance-*`, focused frontend tests, local master-data list backend read APIs/tests, and `docs/dev/branch-log.md`; no package/lockfile, schema, migration, auth/permissions, approval, export, batch-operation capability, automatic scheduling, settlement, formula, or charge-factor changes.
- scope_diff_check: expected route cleanup, removal of the old rendered `MasterDataMaintenanceEntityDetail` workspace, list-summary models for reference/binding records, read-only list endpoints for current master-data rows, focused tests, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target frontend tests passed with 20 tests; target backend master-data maintenance API tests passed with 9 tests; `npm run typecheck` passed; `npm run lint` passed; `git diff --check` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM136 Master Data Residual Cleanup

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `964abfa fix: split master data list pages`
- remote_status: `964abfa was pushed; residual cleanup is local until final check/commit/push.`
- scope: PM-requested follow-up to remove residual master-data long-workspace and non-agent submit concepts after the list-page correction. Keep only personnel submit actions in the frontend action layer, rename master-data entity context to source context, remove non-agent maintenance payload builders from the frontend model, update personnel feedback copy, and synchronize current project context.
- allowed_files_check: `app/master-data/[entityKey]/actions.ts`, `app/master-data/**/page.tsx`, `components/master-data-maintenance-*`, focused frontend tests, `docs/current/PROJECT_CONTEXT.md`, and `docs/dev/branch-log.md`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, settlement, formula, or charge-factor changes.
- scope_diff_check: expected residual naming/action cleanup, focused regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target frontend tests first failed on `submitMasterDataReferenceMaintenance`, then passed with 18 tests after cleanup; `npm run typecheck` passed; final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend 207 tests OK. Browser verification on fixed services `127.0.0.1:3000` and `127.0.0.1:8000` confirmed `/master-data/agents` keeps new/edit/freeze personnel actions, `/master-data/sites` is a list page with rows, and neither page renders old long-workspace residual wording.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM136 Center-first Residual Cleanup Follow-up

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `1cf3029 fix: clean master data residual actions`
- remote_status: `1cf3029 was pushed; this follow-up is local until final check/commit/push.`
- scope: PM-requested continuation to remove remaining center-first implementation residue after the master-data and navigation correction. Delete the unused data-ingestion status component, remove it from the current frontend scaffold check/rules, change upload success guidance away from center-first batch wording, and add a product-structure regression scan over app/component visible wording.
- allowed_files_check: `components/data-sync-status.tsx`, `components/import-center-*`, focused frontend tests, `scripts/check.sh`, `docs/quality/FRONTEND_RULES.md`, `docs/current/PROJECT_CONTEXT.md`, and `docs/dev/branch-log.md`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, settlement, formula, or charge-factor changes.
- scope_diff_check: expected deletion of unused `DataSyncStatus`, upload wording correction, current frontend scaffold file-list sync, focused regression test hardening, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target product/import model tests passed with 84 tests after an intentional RED first caught `components/data-sync-status.tsx`; app/component scan for rejected center-first visible wording returned no matches. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend 207 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM136 Visible Residue Cleanup Follow-up

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `6ca2e2b fix: remove center-first residual copy`
- remote_status: `6ca2e2b was pushed; this visible-residue cleanup is local until final check/commit/push.`
- scope: PM-requested continuation after asking whether cleanup is finished. Remove remaining user-visible implementation residue including `CORN`, task-code badges, `local-operator` default values, awkward service wording, and raw English status option labels while preserving backend enum values.
- allowed_files_check: `app/**`, `components/**`, focused frontend tests, `docs/current/PROJECT_CONTEXT.md`, and `docs/dev/branch-log.md`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, settlement, formula, or charge-factor changes.
- scope_diff_check: expected visible copy cleanup, product-structure regression hardening, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: product-structure test now rejects `CORN`, task-code labels, `local-operator`, and spaced service residue in `app`/`components`; target product/model tests passed with 126 tests after assertion sync. Browser smoke over dashboard, personnel list, actual-log production, import batches, demand plans, and schedule production found no rejected visible phrases, no task-code labels, and no spaced service residue. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend 207 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM137 Runtime Residue Fix Follow-up

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `1477212 fix: clean visible implementation residue`
- remote_status: `1477212 was pushed; this runtime residue fix is local until final check/commit/push.`
- scope: PM-requested continuation after checking the current app. Fix `/master-data/skills` 500 against an older local SQLite schema without mutating `.local`, mask task-code/smoke identifiers in visible import batch/file labels and master-data source labels, keep raw IDs for route hrefs and backend writes, and remove the remaining OpenAPI `MVP` description.
- allowed_files_check: `app/data-quality/[batchId]/page.tsx`, `components/import-center-*`, `components/master-data-maintenance-*`, focused frontend/backend tests, `backend/app/main.py`, `backend/app/master_data_persistence.py`, `docs/current/PROJECT_CONTEXT.md`, and `docs/dev/branch-log.md`; no package/lockfile, schema/migration, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, or charge-factor changes.
- scope_diff_check: expected runtime compatibility guard, display-only masking helpers, focused regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: target import/master-data/product-structure tests passed with 100 Node tests; target backend legacy skills-list compatibility test passed; browser smoke over `/master-data/skills`, `/master-data/vendors`, `/master-data/bindings`, and `/data-quality` found no visible `IM083`, `SMOKE`, smoke CSV names, list-read failure, or 500 text. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend 208 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM138 Master Data Project Concept Removal

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `dfdaef4 fix: clean runtime visible residue`
- remote_status: `dfdaef4 was pushed; this concept cleanup is local until final check/commit/push.`
- scope: PM-confirmed correction that the product should not expose `项目` as a master-data concept. Remove `/master-data/projects` from the sidebar and master-data entity model, add `/master-data/organizations` as a read-only organization list using existing organization records, remove the project column from the binding relationship UI, and keep legacy `project_id` backend fields as compatibility only.
- allowed_files_check: `app/master-data/**`, `components/app-sidebar.tsx`, `components/master-data-maintenance-*`, focused frontend tests, read-only organization API/model/repository/tests, `docs/current/PROJECT_CONTEXT.md`, and `docs/dev/branch-log.md`; no package/lockfile, schema/migration, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, or charge-factor changes.
- scope_diff_check: expected master-data navigation/model/page correction, read-only organization list API, binding UI column removal, regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED frontend tests first failed because master-data still listed `项目` and binding display still exposed `projectLabel`; RED backend test first failed because `list_master_data_organizations` did not exist. After implementation, target master-data/product/import tests passed with 101 Node tests, backend master-data maintenance API tests passed with 11 tests, `npm run typecheck` passed, and `npm run lint` passed. Browser smoke over `/master-data/organizations`, `/master-data/bindings`, and `/master-data/projects` confirmed organization navigation exists, project navigation is absent, binding table has no project column, and `/master-data/projects` returns 404. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM139-IM140 Workplace Concept And Site Operator List

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `c156a64 fix: remove project from master data surface`
- remote_status: `c156a64 is local only; this workplace concept follow-up is local until final check/commit/push.`
- scope: PM-confirmed clarification that workplace is a location-only master-data object, while self-owned and supplier teams under a workplace are represented through a separate read-only `职场运营主体` list. Add `/master-data/site-operators`, derive rows from existing employee and binding data, and keep future supplier-contract fields out of scope.
- allowed_files_check: `app/master-data/[entityKey]/page.tsx`, `components/app-sidebar.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, `docs/current/PROJECT_CONTEXT.md`, and `docs/dev/branch-log.md`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, charge-factor, supplier-contract, or minimum-staffing changes.
- scope_diff_check: expected master-data entity model/navigation addition, read-only site-operator page, workplace location wording correction, regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED frontend test first failed because `summarizeMasterDataSiteOperatorManagement` did not exist; after implementation, target master-data/product-structure tests passed with 21 Node tests, `npm run typecheck` passed, and `npm run lint` passed. Browser smoke over `/master-data/sites` and `/master-data/site-operators` confirmed workplace stays location-oriented, site-operator columns render, and the new pages do not expose project, contract, settlement, or minimum-staffing concepts. Final `check.sh` will run after this traceability update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM140 Master Data IA Correction

- branch_name: `codex/im136-business-first-ia-cleanup`
- base_main_commit: `a4c4221`
- stacked_on: `c08d9a0 feat: add workplace operating owner list`
- remote_status: `c08d9a0 is local only; this IA correction is local until final check/commit/push.`
- scope: PM-corrected master-data information architecture. Keep `技能` as an independent master-data entry, remove standalone `职场运营主体` and `绑定关系` entries from sidebar/entity routing, and leave workplace operating-owner content for a future workplace detail design rather than a naked navigation page.
- allowed_files_check: `app/master-data/[entityKey]/page.tsx`, `components/app-sidebar.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, `docs/current/PROJECT_CONTEXT.md`, and `docs/dev/branch-log.md`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, charge-factor, supplier-contract, or minimum-staffing changes.
- scope_diff_check: expected removal of standalone workplace operating-owner and binding relationship navigation/entity routing, retention of the skills entry, focused regression tests, current-state documentation correction, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED frontend tests first failed because master-data entities still included `职场运营主体` and `绑定关系`; after implementation, target master-data/product-structure tests passed with 20 Node tests. Final `check.sh` will run after this traceability update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM141 Workplace Detail Operating Subjects

- branch_name: `codex/im141-workplace-detail`
- base_main_commit: `3060d9c`
- stacked_on: `3060d9c fix: remove relationship routes from master data nav`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed workplace child-detail correction. Add `/master-data/sites/[workplaceId]`, link workplace list rows to the child detail, and render operating subjects inside the selected workplace from existing employee and binding sources. Keep `职场运营主体` and `绑定关系` out of sidebar/entity routing.
- allowed_files_check: `app/master-data/sites/[workplaceId]/page.tsx`, `app/master-data/agents/data.ts`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, `docs/current/PROJECT_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/task-log.md`, `docs/audit-report.md`, and `docs/dev/branch-log.md`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected nested workplace detail route, list detail entry, read-only operating-subject table, regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED model test first failed because `summarizeMasterDataWorkplaceDetail` did not exist; RED product-structure test then failed because `/app/master-data/sites/[workplaceId]/page.tsx` did not exist. After implementation, target master-data model tests passed with 17 tests, product-structure tests passed with 6 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke over `/master-data/sites` and `/master-data/sites/SH-01` confirmed the list has a detail entry, the detail page shows workplace information and operating subjects, and standalone operator/binding links plus contract/settlement/minimum-staffing copy are absent. Final `check.sh` will run after this traceability update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM142 Vendor Detail Service Workplaces

- branch_name: `codex/im142-vendor-detail`
- base_main_commit: `3060d9c`
- stacked_on: `f28d23b feat: add workplace detail operating subjects`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed supplier child-detail correction. Add `/master-data/vendors/[vendorId]`, link supplier list rows to the child detail, render service workplaces inside the selected supplier from existing personnel ownership records, and keep contract, settlement, and minimum-staffing concepts out of scope. Follow-up correction keeps sidebar groups expanded by default and lets workplace/supplier detail routes inherit their parent nav item.
- allowed_files_check: `app/master-data/vendors/[vendorId]/page.tsx`, `components/app-sidebar.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, `docs/current/PROJECT_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/task-log.md`, `docs/audit-report.md`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/registry/TRACE_INDEX.yaml`, `tasks/backlog.yaml`, and `docs/dev/branch-log.md`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected nested supplier detail route, supplier list detail entry, read-only service-workplace table, sidebar default expansion and detail active-state correction, regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED model test first failed because `summarizeMasterDataVendorDetail` did not exist; RED product-structure test then failed because `/app/master-data/vendors/[vendorId]/page.tsx` did not exist; sidebar regression RED later failed because groups were not all expanded and master-data detail routes did not inherit parent items. After implementation, target master-data model tests passed with 19 tests, product-structure tests passed with 8 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke over `/master-data/vendors`, `/master-data/vendors/SUP-A`, and `/master-data/sites/SH-01` confirmed supplier detail entry, supplier information, service workplace linkback, no contract/settlement/minimum-staffing copy, all sidebar groups expanded, and detail pages highlighting `供应商`/`职场` instead of falling back to `运营工作台`. Final `check.sh` will run after this traceability update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM143 Agent Import Dialog

- branch_name: `codex/im143-agent-import-dialog`
- base_main_commit: `3060d9c`
- stacked_on: `8b3d0cc fix: keep sidebar expanded on detail pages`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed import UX correction. Move the customer-service personnel import entry from the standalone upload workspace into an in-page large dialog on `/master-data/agents`; keep the dialog to upload, mapping choice/manual mapping, and immediate result summary only; keep full batch details, failed-row correction, readiness, application, and version trace in existing batch detail pages.
- allowed_files_check: `app/data-quality/actions.ts`, `app/master-data/[entityKey]/page.tsx`, `app/master-data/agents/data.ts`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused frontend tests, `docs/current/**`, `docs/registry/TRACE_INDEX.yaml`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/task-log.md`, `docs/audit-report.md`, `docs/dev/branch-log.md`, and `tasks/backlog.yaml`; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-application capability, automatic scheduling, formula, settlement, or charge-factor changes.
- scope_diff_check: expected agent-list import dialog, template fetch for the dialog, upload action return-target whitelist for `/master-data/agents?import_dialog=1`, regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: RED model test first failed because `summarizeMasterDataAgentImportDialog` did not exist; RED product-structure test then failed because the agent list did not render `AgentImportDialog`. After implementation, target master-data model tests passed with 20 tests, product-structure tests passed with 9 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke over `/master-data/agents` and `/master-data/agents?import_dialog=1&upload=success&batch=BATCH-MD-001` confirmed the `批量导入` entry opens the list dialog, the dialog shows upload/mapping/result steps, template download, batch detail and failed-row correction links, and returns upload results to the same dialog. Final `check.sh` will run after this traceability update.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM144 UI Component Standards

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `7d7d175 feat: add agent import dialog`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed Product Design + shadcn review correction. Move the global shell to shadcn Sidebar primitives, use shadcn Collapsible and SidebarMenuSub for the sidebar group/submenu composition, add Breadcrumb support in SiteHeader/AppShell, render Header as a compact single-row navigation bar with Breadcrumb including the current page, make the shared SiteHeader the only page-identity layer for master-data list/detail/form pages, remove meaningless SiteHeader global search/date/notification placeholders, add a Header right-side page actions slot, add a Sidebar footer user menu with shadcn Avatar and local reference image `/shadcn-avatar.jpg`, theme toggle, and a non-auth logout entry, order the customer-service personnel list as filter card then list toolbar then table, add shadcn Alert/Avatar/Breadcrumb/Collapsible/Dialog components without package/lockfile changes, and rebuild the customer-service personnel import modal as a strict step-by-step Dialog. Keep the scope limited to global UI standards plus the agent import dialog.
- allowed_files_check: `app/dashboard/page.tsx`, master-data list/detail/new/edit pages, `components/app-shell.tsx`, `components/app-sidebar.tsx`, `components/site-header.tsx`, `components/master-data-agent-import-dialog.tsx`, `components/master-data-maintenance-workbench.tsx`, `components/ui/alert.tsx`, `components/ui/avatar.tsx`, `components/ui/breadcrumb.tsx`, `components/ui/collapsible.tsx`, `components/ui/dialog.tsx`, `public/shadcn-avatar.jpg`, focused product-structure tests, and Harness traceability docs; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-application capability, automatic scheduling, formula, settlement, or charge-factor changes.
- scope_diff_check: expected shadcn Sidebar shell migration, Collapsible + SidebarMenuSub sidebar composition, single-row Header Breadcrumb support with current page included, master-data content header de-duplication, Header page actions slot, SiteHeader placeholder removal, Sidebar footer Avatar user menu, local reference avatar asset, agent filter/list-toolbar/table ordering, agent import Dialog extraction, Alert feedback replacement, focused regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: product-structure test passed with 14 tests, `npm run lint` passed, `npm run typecheck` passed, and browser smoke confirmed `/master-data/sites/SH-01` renders Breadcrumb, shadcn Sidebar, CollapsibleTrigger/Content, SidebarMenuSub, active `职场` child item and active `主数据` parent group; `/master-data/agents` Header contains `新建` and `批量导入`, has no global search input/search placeholder, keeps filter card above list toolbar, keeps list toolbar above table, keeps filter actions `查询/重置` at the filter card lower right, and keeps the list toolbar limited to `已选 0 项` plus bulk actions; Sidebar footer shows the local shadcn Avatar image, and its menu opens with theme switching plus `退出登录`; `/master-data/sites/SH-01` has a single visible page H1 `上海职场` and only business section headings in content; `/master-data/agents/A-1001/edit` has a single visible page H1 from SiteHeader and no duplicate `返回客服人员` content header; `/master-data/agents?import_dialog=1` renders the upload step while hidden mapping/result sections stay mounted with file input and mapping textarea, and `upload=failed` renders the result step with Alert feedback. `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM145 Navigation IA Correction

- branch_name: `codex/im144-ui-component-standards`
- base_main_commit: `3060d9c`
- stacked_on: `27169c5 refactor: align shadcn shell standards`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed navigation IA correction. Remove `预测生产` and `排班生产` from Sidebar as standalone first-level-visible items, and let `需求计划` / `排班计划` own the `/production` child routes for active-state purposes. Keep page title/text cleanup, duplicate h1 cleanup, old search API cleanup, master-data import action cleanup, and data-quality route restructuring out of this slice.
- allowed_files_check: `components/app-sidebar.tsx`, focused product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, or charge-factor changes.
- scope_diff_check: expected Sidebar nav item removal/highlight correction, regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because Sidebar still exposed `预测生产`; after implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 14 tests. Browser/HTTP smoke over `/demand-plans/production` confirmed Sidebar shows `需求计划` active and does not expose standalone `预测生产`/`排班生产` items. `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM153 UI Typography Density Baseline

- branch_name: `codex/im153-ui-density-typography`
- base_main_commit: `3060d9c`
- stacked_on: `8c794ab fix: align master data workplace terminology`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed UI typography correction. Remove the global form font override, align Button sm/xs text-action sizing, align shared TableHead typography, align customer-service personnel row action text buttons, and remove 12px body/step/control copy from the customer-service personnel import Dialog. Keep the slice limited to typography and density baseline; do not add business behavior.
- allowed_files_check: `app/globals.css`, `components/ui/button.tsx`, `components/ui/table.tsx`, `components/master-data-agent-import-dialog.tsx`, `components/master-data-maintenance-workbench.tsx`, focused product-structure tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected global CSS reset removal, Button size class correction, TableHead baseline correction, agent import Dialog typography correction, agent row action button density correction, regression tests, current-state documentation sync, and this branch-log entry only; `.local/` and `.qoder/` remain untracked and must not be staged.
- check_result: TDD RED product-structure test first failed because `app/globals.css` still had `button,input,select { font: inherit }`. After implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 23 tests, `npm run lint` passed, `npm run typecheck` passed, and Browser runtime style smoke over `/master-data/agents?import_dialog=1` confirmed visible text buttons are 14px, table headers are 14px/40px, table cells are 14px, dialog body/form controls are 14px, and row action text buttons are 14px/32px. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM154 Workplace CRUD Frontend Loop

- branch_name: `codex/im154-workplace-crud`
- base_main_commit: `a2d7af8`
- stacked_on: `a2d7af8 chore: update UI standards branch handoff`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed master-data workplace CRUD slice. Add the workplace create action to `/master-data/sites` Header actions, add row-level detail/edit/freeze actions, create `/master-data/sites/new`, create `/master-data/sites/[workplaceId]/edit`, and use a freeze confirmation Dialog. Reuse the existing workplace reference maintenance API and Alert feedback. Keep service-team binding, supplier contracts, settlement, minimum staffing, approval, export, batch, permissions, backend route/schema/migration, dependency, automatic scheduling, formula, and charge-factor work out of scope.
- allowed_files_check: `app/master-data/[entityKey]/actions.ts`, `app/master-data/[entityKey]/page.tsx`, `app/master-data/sites/new/page.tsx`, `app/master-data/sites/[workplaceId]/edit/page.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected workplace model/action helpers, sites list Header action, row edit/freeze links, create/edit child pages, freeze Dialog, focused regression tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `buildMasterDataWorkplaceMaintenanceApiPath` was missing; TDD RED product-structure test then failed because `/app/master-data/sites/new/page.tsx` did not exist. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 21 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 24 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/sites` has Header `新建`, row `编辑`/`冻结`, no inline create submit; `/master-data/sites/new` renders职场 ID/职场名称 and `提交新增`; `/master-data/sites/SH-01/edit` renders `提交编辑`; `/master-data/sites?freeze_workplace_id=SH-01` renders `冻结职场` Dialog after hydration. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM155 Vendor CRUD Frontend Loop

- branch_name: `codex/im155-vendor-crud`
- base_main_commit: `efb5f1a`
- stacked_on: `efb5f1a feat: add workplace crud frontend loop`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of master-data maintenance. Add the supplier create action to `/master-data/vendors` Header actions, add row-level detail/edit/freeze actions, create `/master-data/vendors/new`, create `/master-data/vendors/[vendorId]/edit`, and use a freeze confirmation Dialog. Reuse the existing supplier reference maintenance API and Alert feedback. Keep service-workplace binding, supplier contracts, settlement ratio, minimum staffing, approval, export, batch, permissions, backend route/schema/migration, dependency, automatic scheduling, formula, and charge-factor work out of scope.
- allowed_files_check: `app/master-data/[entityKey]/actions.ts`, `app/master-data/[entityKey]/page.tsx`, `app/master-data/vendors/new/page.tsx`, `app/master-data/vendors/[vendorId]/edit/page.tsx`, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend route/schema/migration changes, no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected vendor model/action helpers, vendors list Header action, row edit/freeze links, create/edit child pages, freeze Dialog, focused regression tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `buildMasterDataVendorMaintenanceApiPath` was missing; TDD RED product-structure test then failed because `/app/master-data/vendors/new/page.tsx` did not exist. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 22 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 25 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/vendors` has Header `新建`, row `编辑`/`冻结`, no inline create submit; `/master-data/vendors/new` renders供应商 ID/供应商名称 and `提交新增`; `/master-data/vendors/SUP-A/edit` renders `提交编辑`; `/master-data/vendors?freeze_vendor_id=SUP-A` renders `冻结供应商` Dialog after hydration. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 209 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM156 Skill CRUD Frontend Loop

- branch_name: `codex/im156-skill-crud`
- base_main_commit: `cadc9dc`
- stacked_on: `cadc9dc feat: add vendor crud frontend loop`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of master-data maintenance. Add the skill create action to `/master-data/skills` Header actions, add row-level edit/freeze actions, create `/master-data/skills/new`, create `/master-data/skills/[skillId]/edit`, and use a freeze confirmation Dialog. Reuse the existing skills reference maintenance API and Alert feedback, with `skill_category` submitted through the existing maintenance request. Keep employee-skill binding, scheduling skill references, skill hierarchy, approval, export, batch, permissions, new backend route/schema/migration, dependency, automatic scheduling, formula, and charge-factor work out of scope.
- allowed_files_check: `app/master-data/[entityKey]/actions.ts`, `app/master-data/[entityKey]/page.tsx`, `app/master-data/skills/new/page.tsx`, `app/master-data/skills/[skillId]/edit/page.tsx`, `backend/app/models.py`, `backend/app/master_data_maintenance.py`, backend maintenance tests, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected skill model/action helpers, skills list Header action, row edit/freeze links, create/edit child pages, freeze Dialog, `skill_category` request persistence through existing API, focused regression tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `buildMasterDataSkillMaintenanceApiPath` was missing; TDD RED product-structure test then failed because `/app/master-data/skills/new/page.tsx` did not exist; backend directed unittest first failed because `skill_category` remained `None`. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 23 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 26 tests, `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service backend.tests.test_master_data_maintenance_api -v` passed with 23 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/skills` has Header `新建`, row `编辑`/`冻结`, no inline create submit; `/master-data/skills/new` renders技能组 ID/技能组名称/归属属性 and `提交新增`; `/master-data/skills/L1-CN/edit` renders `提交编辑` with hidden skill ID; `/master-data/skills?freeze_skill_id=L1-CN` renders `冻结技能组` Dialog after hydration. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 210 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM157 Organization CRUD Frontend Loop

- branch_name: `codex/im157-organization-crud`
- base_main_commit: `86c8daf`
- stacked_on: `86c8daf feat: add skill crud frontend loop`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation of master-data maintenance. Add the organization create action to `/master-data/organizations` Header actions, add row-level edit/freeze actions, create `/master-data/organizations/new`, create `/master-data/organizations/[organizationId]/edit`, and use a freeze confirmation Dialog. Add a narrow local organization maintenance API and repository upsert path because organizations are not reference entities. Keep organization charts, employee reassignment, supplier binding, contracts, settlement ratio, minimum staffing, approval, export, batch, permissions, schema/migration, dependency, automatic scheduling, formula, and charge-factor work out of scope.
- allowed_files_check: `app/master-data/[entityKey]/actions.ts`, `app/master-data/[entityKey]/page.tsx`, `app/master-data/organizations/new/page.tsx`, `app/master-data/organizations/[organizationId]/edit/page.tsx`, `backend/app/main.py`, `backend/app/models.py`, `backend/app/master_data_maintenance.py`, `backend/app/master_data_persistence.py`, backend maintenance tests, `components/master-data-maintenance-model.ts`, `components/master-data-maintenance-workbench.tsx`, focused tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no package/lockfile changes, no auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected organization model/action helpers, organizations list Header action, row edit/freeze links, create/edit child pages, freeze Dialog, local organization maintenance API, focused regression tests, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `buildMasterDataOrganizationMaintenanceApiPath` was missing; TDD RED product-structure test then failed because `/app/master-data/organizations/new/page.tsx` did not exist; backend directed unittest first failed because `maintain_organization` and `maintain_master_data_organization` were missing. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 25 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 27 tests, `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service backend.tests.test_master_data_maintenance_api -v` passed with 25 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/organizations` has Header `新建`, row `编辑`/`冻结`, no inline create submit; `/master-data/organizations/new` renders组织 ID/组织名称/组织层级/上级组织 and `提交新增`; `/master-data/organizations/ORG-CC/edit` renders `提交编辑` with hidden organization ID; `/master-data/organizations?freeze_organization_id=ORG-CC` renders `冻结组织` Dialog after hydration. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 212 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM158 Agent List Real Filters

- branch_name: `codex/im158-agent-list-real-filters`
- base_main_commit: `3060d9c`
- stacked_on: `e1c426b feat: add organization crud frontend loop`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation after IM157 push. Tighten the existing `/master-data/agents` list filters so skill group, organization, and workplace options come from current personnel rows and query parameters actually filter rows. Keep the B-end list layout unchanged and do not add navigation, pages, backend route/schema/migration, dependencies, permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor work.
- allowed_files_check: `components/master-data-maintenance-model.ts`, focused model tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, route, page, navigation, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected agent filter option generation, skill/organization/workplace filter matching, focused regression test, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED model test first failed because `skill_group` options were still fixed to online/hotline/ticket categories and organization/workplace options were placeholders. After implementation, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 26 tests, `node --test scripts/tests/product-structure.test.mjs` passed with 27 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/agents?employee_name=张三` returns 1 row and keeps Header `新建/批量导入`, while `/master-data/agents?employee_name=不存在` shows the empty state. Real skill/organization/workplace page-smoke data setup was blocked by the existing local `.local` SQLite schema missing `master_data_skills.skill_category` and `master_data_employees.employee_type`; no schema workaround was applied in this frontend slice. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` result will be recorded after traceability updates.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM159 Legacy Local Master Data Schema Compatibility

- branch_name: `codex/im159-legacy-local-master-data-schema`
- base_main_commit: `3060d9c`
- stacked_on: `d7d9772 feat: tighten agent list filters`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: Fix the local old SQLite master-data schema compatibility issue exposed by IM158 smoke setup. Add SQLite-only schema compatibility for already-confirmed employee, skill, and organization structures before maintenance writes. Keep migration files, production database configuration, new business fields, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement, supplier-contract, minimum-staffing, and charge-factor work out of scope.
- allowed_files_check: `backend/app/master_data_persistence.py`, backend master-data maintenance tests, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no frontend files, package/lockfile changes, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected SQLite-only compatibility helper, repository initialization/init_schema hook, RED/GREEN backend tests for old local schema maintenance, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED directed unittest first failed because the legacy local table lacked `master_data_employees.employee_type`. After implementation, `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service.MasterDataMaintenanceServiceTest.test_legacy_local_schema_allows_employee_skill_and_organization_maintenance -v` passed, and `.venv/bin/python -m unittest backend.tests.test_master_data_maintenance_service backend.tests.test_master_data_maintenance_api -v` passed with 26 tests. API smoke against local `.local` DB confirmed skill create, employee create, and employee skill replace returned HTTP 200; browser smoke confirmed `/master-data/agents?skill_group=SKILL-IM159&organization=ORG-IM158&workplace=SITE-IM158` shows `IM159验证人员`. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 213 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`

### IM168 Master Data Detail Link Audit

- branch_name: `codex/im168-master-data-link-audit`
- base_main_commit: `e69d1c9`
- stacked_on: `e69d1c9 feat: add skill detail links`
- remote_status: `not_pushed; local branch until final check/commit and PM push confirmation.`
- scope: PM-confirmed continuation after IM167. Close the master-data detail-link chain by making existing reference-list detail actions use the established `查看` row action label and adding a regression test. Keep all routes, navigation, backend, schema/migration, import, permission, approval, export, batch, contract, settlement, minimum-staffing, automatic-scheduling, formula, and charge-factor scope out.
- allowed_files_check: `components/master-data-maintenance-workbench.tsx`, `scripts/tests/product-structure.test.mjs`, current Harness files, registry trace index, raw requirements, user stories, task log, audit report, project state, backlog, and this branch-log entry only; no backend, package/lockfile, route, page, navigation, auth/permissions, approval, export, batch-operation capability, automatic scheduling, formula, settlement, supplier-contract, minimum-staffing, or charge-factor changes.
- scope_diff_check: expected one UI label replacement in the existing reference-list detail action, product-structure regression test, current-state documentation sync, and this branch-log entry only; `.local/`, `.qoder/`, and the pre-existing unrelated `docs/design/shadcn-dashboard-01-visual-alignment-report.md` deletion must not be staged.
- check_result: TDD RED product-structure test first failed because `MasterDataReferenceManagementPage` still contained `>详情</Link>`. After implementation, `node --test scripts/tests/product-structure.test.mjs` passed with 32 tests, `node --test scripts/tests/master-data-maintenance-model.test.mjs` passed with 31 tests, `npm run lint` passed, and `npm run typecheck` passed. Browser smoke confirmed `/master-data/skills` row links render `查看/编辑/冻结`, no `详情` label remains, and `/master-data/skills/L1-CN` still renders the existing skill detail page with skill info and owned-personnel section. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state, shadcn gate, lint, typecheck, Next build, and backend 215 tests OK.
- local_commit_sha: to be reported in Done Report after local commit creation
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pending PM decision after local commit`
- blocked_reason: `N/A`
