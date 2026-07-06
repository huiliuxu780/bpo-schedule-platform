# Branch Log - Compact Current Stub

本文件不再保存完整历史分支流水。历史分支日志在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧分支时使用 Git history。

## Current Branch Entries

### IM295 Roster Persistence Service Loop

- branch_name: `codex/im295-roster-persistence`
- base_main_commit: `stacked on codex/im295-roster-persistence-gate at 698180e`
- stacked_on: `codex/im295-roster-persistence-gate`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Local DB persistence and application service for roster Draft/Published lifecycle after IM294 pure-domain rules.
- qoder_mode: `false; PM approved direct Codex execution and asked to drill only if needed.`
- allowed_files_check: `backend/app/roster_drafts.py`, `backend/app/roster_persistence.py`, `backend/app/roster_service.py`, `backend/migrations/versions/20260704_0011_roster_persistence.py`, `backend/tests/test_roster_persistence.py`, `backend/tests/test_roster_service.py`, `backend/tests/test_database_foundation_closeout.py`, traceability docs, and current state docs only.
- scope_diff_check: expected backend persistence/service, migration, backend tests, and traceability changes only; no API route, frontend UI, dependency, package/lockfile, external integration, Excel import, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, or charge-factor changes.
- focused_check_result: `.venv/bin/python -m unittest backend.tests.test_roster_persistence backend.tests.test_roster_service backend.tests.test_database_foundation_closeout -v` passed with 8 tests.
- check_result: `bash scripts/check-state.sh --strict` passed. `git diff --check` passed. `.venv/bin/python -m unittest discover -s backend/tests -v` passed with 261 tests. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 867 Node tests passing / 1 skipped, shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 261 backend tests, and project Harness check.
- local_commit_sha: `c9837f5`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM294 Roster Domain Publish Rules

- branch_name: `codex/im294-roster-domain-model`
- base_main_commit: `stacked on pushed codex/im293-roster-publish-contract at b0af880`
- stacked_on: `codex/im293-roster-publish-contract`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Implement backend pure-domain roster Draft/Published state machine, publish validation, Arranged coverage derivation, publish diff, and edit-lock rules.
- qoder_mode: `false; PM drilled and approved the product decisions directly.`
- allowed_files_check: `backend/app/roster_drafts.py`, `backend/tests/test_roster_drafts.py`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected backend pure-domain model and tests plus traceability changes only; no DB table/schema/migration/ORM/repository, backend API route, frontend publish action, dependency, package/lockfile, external integration, auth, permission, approval, notification, export, batch, automatic scheduling, forecasting model, standard-capacity model, Excel upload/import, production formula, settlement, or charge-factor changes.
- focused_check_result: red `.venv/bin/python -m unittest backend.tests.test_roster_drafts` failed before implementation on missing `EditLockDecision`; green `.venv/bin/python -m unittest backend.tests.test_roster_drafts` passed with 12 tests; `.venv/bin/python -m unittest discover backend/tests` passed with 255 tests; `git diff --check` passed.
- check_result: `bash scripts/check-state.sh --strict` passed. `git diff --check` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 867 Node tests passing / 1 skipped, shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 255 backend tests, and project Harness check.
- local_commit_sha: `bd1d268`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM293 Roster Publish Persistence Contract

- branch_name: `codex/im293-roster-publish-contract`
- base_main_commit: `stacked on pushed codex/im292-roster-gap-resolution-loop at edebabe`
- stacked_on: `codex/im292-roster-gap-resolution-loop`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Add documentation-only product contract for roster draft/published persistence before any DB/API implementation.
- qoder_mode: `false; PM drilled and approved the product decisions directly.`
- allowed_files_check: `docs/design/roster-draft-publish-persistence-contract.md`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected product contract, state machine, domain-object field draft, acceptance cases, and traceability changes only; no business code, frontend publish actions, backend API route, database table/schema/migration/ORM/repository, dependency, package/lockfile, external integration, auth, permission, approval, notification, export, batch, automatic scheduling, forecasting model, standard-capacity model, Excel upload/import, production formula, settlement, or charge-factor changes.
- focused_check_result: `git diff --cached --check` passed. `bash scripts/check-state.sh --strict` passed. Contract self-review found no TODO/TBD placeholders and no implementation files in scope.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 867 Node tests passing / 1 skipped, shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 249 backend tests, and project Harness check.
- local_commit_sha: `e8888af`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM292 Roster Gap Resolution Loop

- branch_name: `codex/im292-roster-gap-resolution-loop`
- base_main_commit: `stacked on local codex/im291-roster-gap-workbench at d072ff5`
- stacked_on: `codex/im291-roster-gap-workbench`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Add frontend local manual gap-resolution loop for edited `/roster-drafts` gap rows.
- qoder_mode: `false; PM confirmed the next roster slice directly.`
- allowed_files_check: `components/roster-draft-workbench.tsx`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected related covered cells for same date/slot, gap-to-cell-detail navigation, no-coverage locate-date empty state, focused tests, browser smoke evidence, and traceability changes only; no new dependency, package/lockfile, backend API route, database, migration, external integration, real publish persistence, real forecasting model, standard-capacity model, automatic recommendation, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, Excel upload/import, or charge-factor changes.
- focused_check_result: red `node scripts/tests/roster-draft-workbench-structure.test.mjs` failed before implementation on missing `type RosterGapRelatedCell`; green `node --experimental-strip-types scripts/tests/roster-draft-generation-model.test.mjs && node scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 19 tests; `npm run lint` passed; shadcn project info confirmed `radix-nova`; hardcoded color and `space-*` scan had no matches; `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build` passed; `npm run typecheck` passed after build refreshed stale `.next/types`; browser smoke passed for related covered cells, no-coverage empty state, and related-cell-to-detail navigation.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 867 Node tests passing / 1 skipped, shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 249 backend tests, and project Harness check.
- local_commit_sha: `04e95f8`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM291 Roster Gap Workbench

- branch_name: `codex/im291-roster-gap-workbench`
- base_main_commit: `stacked on local codex/im290-roster-publish-coverage at b914841`
- stacked_on: `codex/im290-roster-publish-coverage`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Add frontend local Forecast vs Arranged/Actual gap workbench for edited `/roster-drafts` preview.
- qoder_mode: `false; PM asked to continue with a larger slice.`
- allowed_files_check: `lib/roster-drafts.ts`, `lib/roster-draft-fixtures.ts`, `components/roster-draft-workbench.tsx`, roster draft model/structure tests, traceability docs, and current/registry state docs only.
- scope_diff_check: expected local Forecast/Actual fixture rows, Arranged-from-edited-cells gap derivation, drawer gap queue, gap-to-grid location, focused tests, browser smoke evidence, and traceability changes only; no new dependency, package/lockfile, backend API route, database, migration, external integration, real forecasting model, standard-capacity model, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, Excel upload/import, or charge-factor changes.
- focused_check_result: red `node --experimental-strip-types scripts/tests/roster-draft-generation-model.test.mjs && node scripts/tests/roster-draft-workbench-structure.test.mjs` failed before implementation on missing `forecastIntervals`; green run passed with 18 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn review passed for `radix-nova` with no hardcoded color or `space-*` hits; `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build` passed; browser smoke passed for gap queue, Forecast/Arranged/Actual rows, gap-to-week-grid location, and edit-triggered gap recalculation.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed; Node tests 866 pass / 1 skip, Python tests 249 OK, shadcn/ui convention check, lint, typecheck, build, and project Harness check passed.
- local_commit_sha: `fe00e1c`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM290 Roster Release Preview Coverage

- branch_name: `codex/im290-roster-publish-coverage`
- base_main_commit: `stacked on local codex/im289-roster-cell-controlled-editing at 717bc58`
- stacked_on: `codex/im289-roster-cell-controlled-editing`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Add frontend local draft/release-preview state expression and derived shift-count/half-hour coverage for `/roster-drafts`.
- qoder_mode: `false; PM confirmed to start the next roster slice directly.`
- allowed_files_check: `components/roster-draft-workbench.tsx`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected local release-preview state, derived shift counts, derived half-hour coverage, drawer preview panel, focused tests, browser smoke evidence, and traceability changes only; no new dependency, package/lockfile, backend API route, database, migration, external integration, real publish persistence, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, Excel upload/import, or charge-factor changes.
- focused_check_result: red `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` failed before implementation on missing release-preview/derived-coverage structure; green run passed with 11 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn review passed for `radix-nova` with no hardcoded color or `space-*` hits; `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build` passed; browser smoke passed for release-preview toggle, drawer derived panel, edited draft reset, and A10 derived distribution.
- check_result: `git diff --check && bash scripts/check-state.sh --strict && BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed; Node tests 864 pass / 1 skip, Python tests 249 OK, shadcn/ui convention check, lint, typecheck, and build passed.
- local_commit_sha: `af641dc`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM296 Roster Publish Workbench Gate

- branch_name: `codex/im296-roster-publish-workbench-gate`
- base_main_commit: `stacked on pushed codex/im295-roster-persistence at 72f2314`
- stacked_on: `codex/im295-roster-persistence`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Documentation/current-queue Gate for one scheduler-facing local API + `/roster-drafts` publish workbench closed loop.
- qoder_mode: `false; PM confirmed IM296 decisions interactively and asked not to split too small.`
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/raw-requirements.md`, `docs/user-stories.md`, `tasks/backlog.yaml`, `docs/task-log.md`, `docs/audit-report.md`, and `docs/dev/branch-log.md` only for this Gate task.
- scope_diff_check: expected Harness/traceability changes only; no `app/**`, `components/**`, `lib/**`, `backend/**`, dependency, package/lockfile, database migration, external integration, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, Excel upload/import, or charge-factor implementation changes.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 868 Node tests (867 pass / 1 skip), shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 261 backend tests, and project Harness check.
- local_commit_sha: `17d1d39`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM289 Roster Cell Controlled Editing

- branch_name: `codex/im289-roster-cell-controlled-editing`
- base_main_commit: `stacked on local codex/im288-roster-fullscreen-workbench at e87be9f`
- stacked_on: `codex/im288-roster-fullscreen-workbench`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Add frontend local controlled editing for generated copied roster draft cells in `/roster-drafts`.
- qoder_mode: `false; PM confirmed the next sequence directly.`
- allowed_files_check: `components/roster-draft-workbench.tsx`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected local draft edit state, drawer edit controls, edited markers/counts, focused tests, browser smoke evidence, and traceability changes only; no new dependency, package/lockfile, backend API route, database, migration, external integration, draft publish, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, Excel upload/import, or charge-factor changes.
- focused_check_result: red `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` failed before implementation on missing controlled-editing structure; green run passed with 10 tests; `npm run typecheck` passed; `npm run lint` passed; shadcn review passed for `radix-nova` with no hardcoded color or `space-*` hits; `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build` passed; browser smoke passed for copied-cell edit, edited marker/count, restore-generated-value, and exception read-only boundary.
- check_result: `git diff --check && bash scripts/check-state.sh --strict && BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed; Node tests 863 pass / 1 skip, Python tests 249 OK, shadcn/ui convention check, lint, typecheck, and build passed.
- local_commit_sha: `8ef345b`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM288 Roster Full-Screen Workbench

- branch_name: `codex/im288-roster-fullscreen-workbench`
- base_main_commit: `stacked on pushed codex/im287-global-nav-rail at 7a442e1`
- stacked_on: `codex/im287-global-nav-rail`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Refine `/roster-drafts` into a full-screen grid-first scheduler workbench using the existing local fixture and TypeScript generator.
- qoder_mode: `false; PM confirmed to continue with A and avoid repeated drill questions.`
- allowed_files_check: `app/roster-drafts/page.tsx`, `components/roster-draft-workbench.tsx`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected roster workbench layout, focused tests, and traceability changes only; no new dependency, package/lockfile, backend API route, database, migration, external integration, editing, save/publish, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, Excel upload/import, or charge-factor changes.
- focused_check_result: `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 9 tests; `npm run typecheck` passed; `npm run lint` passed; `bash scripts/check-state.sh --strict` passed; shadcn review passed for `radix-nova` with no hardcoded color or `space-*` hits; `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build` passed; browser smoke passed for default month canvas, removed old header/aside, right drawer detail/queue, and week tab switch.
- check_result: `git diff --check && bash scripts/check-state.sh --strict && BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed; Node tests 862 pass / 1 skip, Python tests 249 OK, shadcn/ui convention check, lint, typecheck, and build passed.
- local_commit_sha: `f91b9fc`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM287 Global Navigation Rail

- branch_name: `codex/im287-global-nav-rail`
- base_main_commit: `stacked on local codex/im286-roster-workbench-redesign at 9e59eb4`
- stacked_on: `codex/im286-roster-workbench-redesign`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Global shell/navigation infrastructure for compact default rail, fixed click expand/collapse, icon alignment, thin header, and remembered UI preference.
- qoder_mode: `false; PM confirmed the navigation drill decisions interactively.`
- allowed_files_check: `components/app-shell.tsx`, `components/app-sidebar.tsx`, `components/ui/sidebar.tsx`, navigation/dashboard shell tests, traceability docs, and current/registry state docs only.
- scope_diff_check: expected shared navigation shell, test, and traceability changes only; no roster workbench business-content rewrite, new page, dependency, package/lockfile, backend API route, database, migration, external integration, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, or charge-factor changes.
- focused_check_result: `node --test scripts/tests/product-structure-global-shell.test.mjs scripts/tests/dashboard-shadcn-baseline-alignment.test.mjs` passed with 12 tests; `npm run typecheck` passed; `npm run lint` passed; `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build` passed. Browser smoke passed on `http://localhost:3003/dashboard`, `/roster-drafts`, and `/schedule-plans`, including 64px collapsed rail, 240px expanded rail, hidden collapsed group labels, 32px centered icon buttons, and station navigation state retention.
- pm_acceptance_fix: After PM screenshot review, removed the global `快速新建` and `待处理风险` sidebar shortcuts, hid brand copy in collapsed rail, and assigned distinct visible icons for brand, dashboard, schedule plan, and roster draft entries. Focused regression `node --test scripts/tests/product-structure-global-shell.test.mjs scripts/tests/dashboard-shadcn-baseline-alignment.test.mjs` passed with 12 tests; `npm run lint` and `npm run typecheck` passed. Browser smoke on `http://localhost:3003/dashboard` confirmed 64px CSS rail variable, hidden brand copy, no quick-create/pending-risk shortcut hrefs, no visible collapsed labels, and 13 unique visible icons.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 861 Node tests, shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 249 backend tests, and project Harness check.
- local_commit_sha: `8a3533c`, `e25e5d2`, `f04b203`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM279 Scheduler Monthly Roster Requirements Trace

- branch_name: `codex/im279-roster-requirements-trace`
- base_main_commit: `stacked on local codex/im278-team-gap-queue at a5c442b`
- stacked_on: `codex/im278-team-gap-queue`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Documentation and product-modeling task for scheduler monthly roster bottom layer after PM provided the real `202607班表.xlsx`.
- check_result: `git diff --check` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 845 Node assertions, lint, typecheck, Next build, 241 backend tests, and project Harness check.
- local_commit_sha: `3e2ef93`
- push_decision: `not_pushed`

### IM280 Documentation History Cleanup Pass 1

- branch_name: `codex/im280-doc-history-cleanup`
- base_main_commit: `stacked on local codex/im279-roster-requirements-trace at 3e2ef93`
- stacked_on: `codex/im279-roster-requirements-trace`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Removed obsolete no-reference design/plan files and untracked local draft artifacts.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 845 Node assertions, lint, typecheck, Next build, 241 backend tests, and project Harness check.
- local_commit_sha: `96fadff`
- push_decision: `not_pushed`

### IM281 Main Trace Spine Slimming

- branch_name: `codex/im281-trace-spine-slimming`
- base_main_commit: `stacked on local codex/im280-doc-history-cleanup at 96fadff`
- stacked_on: `codex/im280-doc-history-cleanup`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Compress legacy traceability files into compact current stubs: backlog, raw requirements, user stories, audit report, task log, branch log, project state, and trace index.
- qoder_mode: `false; PM explicitly said the main trace files must be slimmed.`
- allowed_files_check: `tasks/backlog.yaml`, `docs/raw-requirements.md`, `docs/user-stories.md`, `docs/audit-report.md`, `docs/task-log.md`, `docs/dev/branch-log.md`, `docs/PROJECT_STATE.md`, and `docs/registry/TRACE_INDEX.yaml` only.
- scope_diff_check: expected documentation/state-hygiene changes only; no app, component, lib, backend, dependency, package/lockfile, database schema/migration, external integration, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, or charge-factor changes.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 845 Node assertions, `npm run lint`, `npm run typecheck`, Next build, 241 backend tests, and project Harness check.
- local_commit_sha: `569d20f`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM286 Roster Workbench Redesign

- branch_name: `codex/im286-roster-workbench-redesign`
- base_main_commit: `stacked on local codex/im285-roster-draft-demo-loop at e677949`
- stacked_on: `codex/im285-roster-draft-demo-loop`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Redesign `/roster-drafts` from a report-style result page into a scheduler workbench using the existing local generator and fixture.
- qoder_mode: `false; PM approved Codex to execute the redesign directly after product drill.`
- allowed_files_check: `app/roster-drafts/page.tsx`, `components/roster-draft-workbench.tsx`, `lib/roster-drafts.ts`, `lib/roster-draft-fixtures.ts`, `scripts/tests/roster-draft-generation-model.test.mjs`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected frontend IA redesign, local model view fields if needed, tests, and traceability changes only; no backend API route, database, migration, dependency, package/lockfile, external integration, Excel upload/import, save/publish workflow, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, or charge-factor changes.
- focused_check_result: `node --test scripts/tests/roster-draft-generation-model.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 12 tests; `npm run typecheck` passed; `npm run lint` passed; `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build` passed. Browser smoke passed on `http://localhost:3003/roster-drafts?month=2026-08`, including workbench toolbar, week grid, month scan grid, cell inspector, queue list, and queue-to-cell location.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 857 Node tests, shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 249 backend tests, and project Harness check.
- local_commit_sha: `b4233f9`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM282 Roster Generation Product Contract

- branch_name: `codex/im282-roster-generation-contract`
- base_main_commit: `stacked on local codex/im281-trace-spine-slimming at 569d20f`
- stacked_on: `codex/im281-trace-spine-slimming`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Documentation and product-contract task for ShiftType work-segment expansion, personnel-level monthly roster draft generation, stable-shift copy rules, pending roster employees, draft-to-published version flow, and Primary/Actual boundary.
- qoder_mode: `false; PM confirmed decisions interactively in this thread.`
- allowed_files_check: `docs/design/scheduler-shift-type-monthly-roster-generation-contract.md`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected documentation/traceability changes only; no app, component, lib, backend, dependency, package/lockfile, database schema/migration, external integration, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, or charge-factor changes.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 845 Node assertions, `npm run lint`, `npm run typecheck`, Next build, 241 backend tests, and project Harness check.
- local_commit_sha: `71d1f23`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `pushed to origin/codex/im282-roster-generation-contract`
- blocked_reason: `N/A`

### IM283 ShiftType Coverage Backend Domain Service

- branch_name: `codex/im283-shift-type-coverage`
- base_main_commit: `stacked on local codex/im282-roster-generation-contract at 71d1f23`
- stacked_on: `codex/im282-roster-generation-contract`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Backend pure domain service for configurable ShiftType work-time parsing and half-hour coverage expansion with non-blocking exception list.
- qoder_mode: `false; PM confirmed the development drill decisions interactively.`
- allowed_files_check: `backend/app/shift_types.py`, `backend/tests/test_shift_types.py`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected backend pure-domain and traceability changes only; no API route, frontend UI, dependency, package/lockfile, database schema/migration, external integration, Excel upload/import, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, or charge-factor changes.
- focused_check_result: `.venv/bin/python -m unittest backend.tests.test_shift_types` passed.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 845 Node assertions, `npm run lint`, `npm run typecheck`, Next build, 243 backend tests, and project Harness check.
- local_commit_sha: `5b88238`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM284 Roster Draft Domain Model

- branch_name: `codex/im284-roster-draft-domain-model`
- base_main_commit: `stacked on local codex/im283-shift-type-coverage at 5b88238`
- stacked_on: `codex/im283-shift-type-coverage`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Backend pure domain model for personnel-level monthly roster drafts: RosterVersion, RosterAssignment, PendingRosterEmployee, same-day multi-record support, shift-only coverage participation, multi-shift overlap validation, reference snapshot validation, and draft-only editability.
- qoder_mode: `false; PM confirmed the development drill decisions interactively.`
- allowed_files_check: `backend/app/roster_drafts.py`, `backend/tests/test_roster_drafts.py`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected backend pure-domain and traceability changes only; no API route, frontend UI, dependency, package/lockfile, database schema/migration, external integration, Excel upload/import, copy generation, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, or charge-factor changes.
- focused_check_result: `.venv/bin/python -m unittest backend.tests.test_roster_drafts` passed with 6 tests.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 845 Node assertions, `npm run lint`, `npm run typecheck`, Next build, 249 backend tests, and project Harness check.
- local_commit_sha: `4ca9306`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM285 Roster Draft Demo Loop

- branch_name: `codex/im285-roster-draft-demo-loop`
- base_main_commit: `stacked on local codex/im284-roster-draft-domain-model at f1d93a1`
- stacked_on: `codex/im284-roster-draft-domain-model`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Visible frontend demo loop for generating personnel-level monthly roster drafts from local configurable fixture data.
- qoder_mode: `false; PM asked Codex to start the larger visible feature slice directly.`
- allowed_files_check: `app/roster-drafts/page.tsx`, `components/roster-draft-workbench.tsx`, `components/app-sidebar.tsx`, `lib/roster-drafts.ts`, `lib/roster-draft-fixtures.ts`, `scripts/tests/roster-draft-generation-model.test.mjs`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, `docs/superpowers/plans/2026-07-01-roster-draft-demo-loop.md`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected frontend-local demo, TypeScript generator, local fixture, test, and traceability changes only; no backend API route, database, migration, dependency, package/lockfile, external integration, Excel upload/import, save/publish workflow, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, or charge-factor changes.
- focused_check_result: `node --test scripts/tests/roster-draft-generation-model.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 10 tests; `npm run typecheck` passed.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 855 Node tests, shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 249 backend tests, and project Harness check. Browser smoke passed on `http://localhost:3003/roster-drafts?month=2026-08`, including month view, week view, pending employees, exception list, and filtered annotations.
- local_commit_sha: `449226c`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`
