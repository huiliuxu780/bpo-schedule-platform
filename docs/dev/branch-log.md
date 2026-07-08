# Branch Log - Compact Current Stub

本文件不再保存完整历史分支流水。历史分支日志在 2026-07-01 的 IM281 中被压缩移出默认上下文；需要审计旧分支时使用 Git history。

## Current Branch Entries

### IM306 Duty Change Request Prototype

- branch_name: `codex/im305-roster-change-center`
- target_branch: `codex/im305-roster-change-center`
- base_main_commit: `aee4c407`
- stacked_on: `codex/im305-roster-change-center`
- remote_status: `not_pushed; local product correction until PM push confirmation.`
- scope: Reposition `/roster-change-governance` from post-change confirmation into request-first `班务变更申请` frontend prototype with request states, detail drawer, agree/reject/follow-up actions, monthly roster adjustment handoff, and product baseline spec.
- qoder_mode: `false; PM challenged the naming and product model directly, then approved the request-first prototype direction.`
- allowed_files_check: `app/roster-change-governance/page.tsx`, `components/roster-change-governance-workbench.tsx`, `components/app-sidebar.tsx`, `scripts/tests/roster-change-governance-structure.test.mjs`, `docs/superpowers/specs/2026-07-07-duty-change-request-design.md`, and traceability docs only.
- scope_diff_check: expected frontend prototype and traceability only; no backend persistence, migration, package/lockfile, dependency, approval, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formulas, settlement, or charge-factor work.
- focused_check_result: red `node --test scripts/tests/roster-change-governance-structure.test.mjs` failed on missing `班务变更申请` and `duty-change-request` slots; green focused structure test passed with 3 tests; `npm run typecheck` passed.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 279 backend tests, and project Harness check.
- local_commit_sha: `reported in Done Report after local commit`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM305 Roster Change Center Event Confirmation Implementation

- branch_name: `codex/im305-roster-change-center`
- target_branch: `codex/im305-roster-change-center`
- base_main_commit: `stacked on local IM305 Gate commit e044d9dd; main/origin main at 66193b1d`
- stacked_on: `codex/im304-roster-change-governance-loop`
- remote_status: `not_pushed; local implementation branch until PM push confirmation.`
- scope: Event-first roster change center with local single-event confirmation and internal scheduler note persistence.
- qoder_mode: `false; PM allowed local confirmation persistence directly.`
- allowed_files_check: `backend/app/roster_persistence.py`, `backend/app/roster_service.py`, `backend/app/main.py`, `backend/migrations/versions/20260707_0014_roster_change_confirmations.py`, backend tests, `/roster-change-governance` page/workbench, sidebar, structure tests, and traceability docs only.
- scope_diff_check: expected local database-persistence vertical slice only; no package/lockfile, dependency, approval, auth, permissions, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formulas, settlement, charge-factor work, or bulk confirmation.
- focused_check_result: service red/green passed; API red/green passed; frontend structure red/green passed. `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api -v` passed with 18 tests. `node --test scripts/tests/roster-change-governance-structure.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 27 tests. `npm run typecheck` passed.
- browser_smoke: local backend `127.0.0.1:8002` + frontend `localhost:3003` with `NEXT_PUBLIC_BPO_API_BASE_URL=http://127.0.0.1:8002`; seeded `.local/im305-roster-change-center-smoke.db`; event list showed `1 条待处理`, `EMP-001 / 2026-08-01`, and `请假 REQ-001`; detail drawer opened; confirmation with internal note persisted and changed summary to `0 条待处理` / `已确认 1`; 390px viewport had no horizontal overflow.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 279 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### NAV-SLIM-GATE Navigation Function Slimming Gate

- branch_name: `codex/im308-duty-change-adjustment-handoff`
- base_main_commit: `stacked on local IM308/IM309 branch`
- stacked_on: `codex/im308-duty-change-adjustment-handoff`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Product Gate for first-level navigation and feature-entry slimming after PM reviewed mature WFM navigation references.
- qoder_mode: `false; product clarification and Gate only.`
- allowed_files_check: `docs/superpowers/specs/2026-07-08-navigation-function-slimming-gate.md`, `docs/current/PROJECT_CONTEXT.md`, `docs/registry/DECISION_INDEX.yaml`, and traceability docs only.
- scope_diff_check: expected documentation and current-truth update only; no dashboard first-screen change, business implementation, package/lockfile, dependency, backend API, migration, database persistence field, auth, permissions, approval, notification, export, batch, external integration, forecasting, standard capacity, Excel, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: contract self-review found no TODO/TBD placeholders or implementation scope drift; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 891 Node tests (890 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 281 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM304 Roster Change Center Redesign Contract

- branch_name: `codex/im304-roster-change-governance-loop`
- base_main_commit: `stacked on codex/im303-downstream-issue-management-loop at 3cdee7ee`
- stacked_on: `codex/im303-downstream-issue-management-loop`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Documentation-only product contract that replaces the IM304 version-first UX direction with an event-first scheduler-facing roster change center.
- qoder_mode: `false; PM challenged the product direction directly and confirmed the A-series design decisions interactively.`
- allowed_files_check: `docs/superpowers/specs/2026-07-07-roster-change-governance-design.md`, `docs/current/PROJECT_CONTEXT.md`, `docs/registry/DECISION_INDEX.yaml`, `docs/task-log.md`, `docs/audit-report.md`, and this branch log only.
- scope_diff_check: expected documentation and current decision-truth changes only; no product code, dependency, package/lockfile, backend API, database implementation, migration, auth, permissions, approval, notification, export, batch, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formula, settlement, or charge-factor changes.
- focused_check_result: spec self-review passed with no placeholders or non-goal conflicts; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 277 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

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

### IM298 Published Roster Gap Workbench Gate

- branch_name: `codex/im298-published-gap-workbench`
- base_main_commit: `stacked on local codex/im297-roster-revision-workbench at d49747cc`
- stacked_on: `codex/im297-roster-revision-workbench`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Gate and current queue for Published Forecast vs Arranged/Actual gap closed loop inside `/roster-drafts`.
- qoder_mode: `false; PM confirmed the corrected A scope directly after challenging the prior thin-slice conclusion.`
- allowed_files_check: current/registry state docs, traceability docs, `components/roster-draft-workbench.tsx`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, `backend/app/main.py`, and `backend/tests/test_roster_publish_api.py` only.
- scope_diff_check: expected current queue, traceability, published gap UI behavior, current-published response contract test, and focused structure test only; no new dependency, package/lockfile, database schema/migration, external integration, Excel upload/import, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, new gap page, full version history page, or charge-factor changes.
- focused_check_result: red `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` failed on missing `publishedGapRows`; red `.venv/bin/python -m unittest backend.tests.test_roster_publish_api` failed on missing current-published `cells`; green focused checks passed with 16 frontend structure tests and 6 backend API tests; `npm run typecheck` passed.
- browser_smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003` with `NEXT_PUBLIC_BPO_API_BASE_URL=http://127.0.0.1:8001`; published snapshot, formal gap panel, gap-to-week locate, revision draft creation, revision republish, and post-republish formal gap refresh passed; no visible `current published` internal copy.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 871 Node tests (870 pass / 1 skip), shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 272 backend tests, and project Harness check.
- local_commit_sha: `e7a0af89`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM300 Published Roster Calendar Month

- branch_name: `codex/im300-published-roster-calendar-month`
- base_main_commit: `stacked on local codex/im299-downstream-published-roster at e7a0af89`
- stacked_on: `codex/im299-downstream-published-roster`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Correct downstream formal roster month scanning by replacing the employee-by-31-days month grid with a 7-column calendar overview that opens the existing week detail grid.
- qoder_mode: `false; PM selected option A after product-design reference review.`
- allowed_files_check: `components/published-roster-viewer.tsx`, `lib/published-roster-view.ts`, `scripts/tests/published-roster-view-model.test.mjs`, `scripts/tests/published-roster-viewer-structure.test.mjs`, `docs/superpowers/plans/2026-07-06-published-roster-calendar-month.md`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected frontend view/view-model/tests and traceability changes only; no package/lockfile, backend API, database, new persistence, auth, permissions, approval, request submission, notification, export, batch, Excel import, forecasting model, standard-capacity model, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: red `node --test scripts/tests/published-roster-view-model.test.mjs` failed on missing `monthCalendarDays`; red `node --test scripts/tests/published-roster-viewer-structure.test.mjs` failed on missing calendar overview structure; green `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 27 tests; `npm run typecheck` passed; `git diff --check` passed. Browser smoke passed on `http://localhost:3003/published-roster?month=2026-08` with local backend `127.0.0.1:8001`.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 882 Node tests (881 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 272 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM303 Downstream Issue Management Loop

- branch_name: `codex/im303-downstream-issue-management-loop`
- base_main_commit: `stacked on codex/im302-downstream-roster-request-loop at 5d83398`
- stacked_on: `codex/im302-downstream-roster-request-loop`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Expand local downstream roster request intents into a demonstrable issue management loop with downstream status readback and scheduler issue workspace.
- qoder_mode: `false; PM confirmed the larger IM303 scope directly after rejecting a tiny tracking slice.`
- allowed_files_check: backend request-intent API/service/persistence/migration/tests, published-roster viewer, roster-draft workbench, focused structure tests, and traceability docs only.
- scope_diff_check: expected local issue-management loop only; no package/lockfile, auth, permissions, approval workflow, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formulas, settlement, or charge-factor work.
- focused_check_result: `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api` passed with 14 tests; `node --test scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 24 tests; `npm run typecheck` passed; `git diff --check` passed.
- runtime_smoke: local backend `127.0.0.1:8001` + frontend `127.0.0.1:3003`; API summary open=1/resolved=1 after resolving `REQ-IM303-SMOKE-1`; `/published-roster?month=2026-08` and `/roster-drafts?month=2026-08` returned 200.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 885 Node tests (884 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 275 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM302 Downstream Roster Request Intent Loop

- branch_name: `codex/im302-downstream-roster-request-loop`
- base_main_commit: `stacked on local IM301 baseline`
- stacked_on: `codex/im301-formal-roster-request-boundaries`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Local DB-backed downstream formal-roster request intent loop from `/published-roster` to `/roster-drafts`.
- qoder_mode: `false; PM explicitly asked Codex to stop tiny slicing and land the DB-backed loop.`
- allowed_files_check: backend roster persistence/service/API/migration/tests, published-roster viewer/model/tests, roster-draft workbench/tests, traceability docs, and the IM302 implementation plan.
- scope_diff_check: expected local DB/API/frontend vertical plus traceability only; no package/lockfile, real external integration, auth, permissions, approval workflow, notification, export, batch, automatic scheduling, forecasting model, standard-capacity model, Excel import, production formulas, settlement, or charge-factor changes.
- focused_check_result: `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 29 tests; `npm run typecheck` passed; `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_publish_api backend.tests.test_database_foundation_closeout` passed with 16 tests; `git diff --check` passed before trace closeout.
- browser_check_result: `127.0.0.1:3003/published-roster?month=2026-08` showed the current formal roster, calendar day, week detail, Alice Chen `A5 09:00-14:30`, and `登记处理意图`; browser automation then timed out, so the same local backend completed API smoke for create revision and resolve.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 884 Node tests (883 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 275 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM301 Formal Roster Request Boundaries

- branch_name: `codex/im301-formal-roster-request-boundaries`
- base_main_commit: `stacked on local codex/im300-published-roster-calendar-month at c3947a29`
- stacked_on: `codex/im300-published-roster-calendar-month`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Convert formal-roster detail leave/swap/exception-fix actions from dead placeholders into local request-boundary shells.
- qoder_mode: `false; PM selected option A and asked Codex to continue.`
- allowed_files_check: `components/published-roster-viewer.tsx`, `lib/published-roster-view.ts`, `scripts/tests/published-roster-view-model.test.mjs`, `scripts/tests/published-roster-viewer-structure.test.mjs`, `docs/superpowers/plans/2026-07-06-formal-roster-request-boundaries.md`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected frontend-local boundary shell, model/view tests, execution plan, and traceability changes only; no backend API route, database, migration, dependency, package/lockfile, external integration, real request submission, approval, auth, permission, notification, export, batch, Excel upload/import, automatic scheduling, forecasting model, standard-capacity model, production formula, settlement, or charge-factor changes.
- focused_check_result: red `node --test scripts/tests/published-roster-view-model.test.mjs` failed before model fields existed; red `node --test scripts/tests/published-roster-viewer-structure.test.mjs` failed before `RequestBoundaryPanel` existed. Green focused run passed 28 frontend tests; `npm run typecheck` passed; `git diff --check` passed. Browser smoke passed on `http://localhost:3003/published-roster?month=2026-08` with local backend `127.0.0.1:8001`.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 883 Node tests (882 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 272 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM297 Roster Revision Workbench

- branch_name: `codex/im297-roster-revision-workbench`
- base_main_commit: `stacked on local codex/im296-roster-publish-workbench at 92117ea`
- stacked_on: `codex/im296-roster-publish-workbench`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Local API + `/roster-drafts` workbench loop for creating a revision draft from current published, keeping current published effective, controlled existing-cell shift/note edits, immediate republish, previous-version source, and revision change summary.
- qoder_mode: `false; PM confirmed the development drill decisions interactively.`
- allowed_files_check: backend roster API/service/domain tests, roster draft workbench, frontend structure test, and traceability/current state docs only.
- scope_diff_check: expected roster revision API/workbench/test/traceability changes only; no scheduled publish UI, future effective-time selection, full version history page, add/delete personnel/date cells, dependency, package/lockfile, migration, external integration, Excel import, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, or charge-factor changes.
- focused_check_result: `.venv/bin/python -m unittest backend.tests.test_roster_service backend.tests.test_roster_revision_api backend.tests.test_roster_publish_api backend.tests.test_roster_drafts backend.tests.test_roster_persistence` passed with 28 tests; `node --test scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 15 tests; `npm run typecheck` passed.
- browser_smoke: local backend `127.0.0.1:8001` + frontend `localhost:3003`; published state showed `创建修订草稿`; after create, workbench showed `修订草稿`, `重新发布修订`, `上一版来源`, and `本次修改摘要` without `版本历史页` or `未来生效`.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 870 Node tests (869 pass / 1 skip), shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 271 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM297 Roster Revision Workbench Gate

- branch_name: `codex/im297-roster-revision-workbench`
- base_main_commit: `stacked on local codex/im296-roster-publish-workbench at 92117ea`
- stacked_on: `codex/im296-roster-publish-workbench`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Documentation/current-queue Gate for one scheduler-facing current-published-to-revision-draft-to-republish workbench loop.
- qoder_mode: `false; PM confirmed IM297 decisions interactively.`
- allowed_files_check: `docs/current/**`, `docs/registry/**`, `docs/raw-requirements.md`, `docs/user-stories.md`, `tasks/backlog.yaml`, `docs/task-log.md`, `docs/audit-report.md`, and `docs/dev/branch-log.md` only for this Gate task.
- scope_diff_check: expected Harness/traceability changes only; no `app/**`, `components/**`, `lib/**`, `backend/**`, dependency, package/lockfile, database migration, external integration, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, Excel upload/import, or charge-factor implementation changes.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 869 Node tests (868 pass / 1 skip), shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 266 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM296 Roster Publish Workbench Implementation

- branch_name: `codex/im296-roster-publish-workbench`
- base_main_commit: `stacked on codex/im296-roster-publish-workbench-gate at b1a8f5f`
- stacked_on: `codex/im296-roster-publish-workbench-gate`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: One scheduler-facing local publish vertical: backend API for publish/current-published/edit-lock plus `/roster-drafts?month=2026-08` publish action, readback snapshot, read-only published state, and focused acceptance coverage.
- qoder_mode: `false; PM asked Codex to continue and avoid splitting below a closed product loop.`
- allowed_files_check: `backend/app/main.py`, `backend/tests/test_roster_publish_api.py`, `components/roster-draft-workbench.tsx`, `scripts/tests/roster-draft-workbench-structure.test.mjs`, and traceability docs only.
- scope_diff_check: expected local API routes, CORS for local browser runtime, publish payload/readback UI, published snapshot panel, read-only cell editing state, focused tests, and Harness closeout only; no dependency, package/lockfile, migration, external integration, automatic scheduling, approval, permission, notification, export, batch, production formula, settlement, standard-capacity model, forecasting model, Excel upload/import, or charge-factor changes.
- focused_check_result: `.venv/bin/python -m unittest backend.tests.test_roster_publish_api backend.tests.test_roster_service` passed 9 tests, including concurrent schema initialization regression. `node --test scripts/tests/roster-draft-workbench-structure.test.mjs scripts/tests/roster-draft-generation-model.test.mjs` passed 20 tests. `npm run typecheck` passed.
- browser_smoke_result: local backend `127.0.0.1:8001` and frontend `localhost:3005`; before publish the `发布当前草稿` button was enabled; after publish the drawer showed `已发布快照`, `当前正式班表`, `班次数`, and `半小时覆盖`, the publish button was disabled, and the detail tab showed read-only copy plus revision-draft hint.
- check_result: `git diff --check` passed. `bash scripts/check-state.sh --strict` passed. Final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 869 Node tests (868 pass / 1 skip), shadcn convention check, `npm run lint`, `npm run typecheck`, Next build, 266 backend tests, and project Harness check.
- local_commit_sha: `pending`
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

### IM299 Downstream Published Roster Viewer

- branch_name: `codex/im299-downstream-published-roster`
- base_main_commit: `stacked on origin/codex/im298-published-gap-workbench at f7fefc3f`
- stacked_on: `codex/im298-published-gap-workbench`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Add downstream read-only formal roster consumption for team lead and frontline roles.
- qoder_mode: `false; PM confirmed Codex should start after product drill and reflection.`
- allowed_files_check: `app/published-roster/page.tsx`, `components/published-roster-viewer.tsx`, `components/app-sidebar.tsx`, `lib/published-roster-view.ts`, `scripts/tests/published-roster-view-model.test.mjs`, `scripts/tests/published-roster-viewer-structure.test.mjs`, `docs/superpowers/plans/2026-07-06-downstream-published-roster.md`, traceability docs, and current/registry state docs only.
- scope_diff_check: expected frontend route/view helper/navigation/tests and traceability changes only; no package/lockfile, backend schema/migration, new persistence, auth, permissions, organization hierarchy, approval, request submission, notification, export, batch, Excel import, forecasting model, standard-capacity model, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: `node --test scripts/tests/published-roster-view-model.test.mjs scripts/tests/published-roster-viewer-structure.test.mjs scripts/tests/roster-draft-workbench-structure.test.mjs` passed with 24 tests; `npm run typecheck` passed; `git diff --check` passed; `bash scripts/check-state.sh --strict` passed. Browser smoke passed on `http://localhost:3003/published-roster?month=2026-08` with local backend `127.0.0.1:8001`.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 879 Node tests (878 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 272 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM304 Formal Roster Change Governance Loop

- branch_name: `codex/im304-roster-change-governance-loop`
- base_main_commit: `stacked on origin/codex/im303-downstream-issue-management-loop at 3cdee7ee`
- stacked_on: `codex/im303-downstream-issue-management-loop`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Independent formal roster change governance workbench, aggregate runtime diff API, source-cell before/after comparison, linked resolved issue explanation, and jump links from downstream resolved issue surfaces.
- qoder_mode: `false; PM confirmed scope interactively and allowed implementation.`
- allowed_files_check: `backend/app/main.py`, `backend/app/roster_persistence.py`, `backend/app/roster_service.py`, backend tests, `/roster-change-governance` page/workbench, sidebar, downstream issue links, structure tests, and traceability docs only.
- scope_diff_check: expected local runtime-derived governance capability only; no package/lockfile, dependency, database migration, new diff table, approval, permission, notification, export, batch, external integration, forecasting model, standard-capacity model, Excel import, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: backend 16 tests passed; frontend structure 27 tests passed; `npm run typecheck`, `git diff --check`, and `bash scripts/check-state.sh --strict` passed. Browser smoke passed on `http://localhost:3003/roster-change-governance?month=2026-08` with local backend `127.0.0.1:8001`.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 277 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM307 Duty Change Request Real Three-State Loop

- branch_name: `codex/im305-roster-change-center`
- base_main_commit: `stacked on existing duty-change request branch`
- stacked_on: `codex/im305-roster-change-center`
- remote_status: `not_pushed; branch is ahead of origin until PM push confirmation.`
- scope: Connect `班务变更申请` to real local `roster_request_intents`, add `in_progress` status and short `result_type` labels, expose follow-up/close APIs, and update `/roster-change-governance` request list/detail/actions to use real data.
- qoder_mode: `false; PM confirmed A path interactively.`
- allowed_files_check: backend roster request persistence/service/API/migration, backend tests, roster-change workbench structure test, current/registry/traceability docs only.
- scope_diff_check: expected local MVP request handling only; no package/lockfile, dependency, real external integration, auth, permissions, approval, notification, export, batch, Excel import, forecasting model, standard-capacity model, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: backend 5 focused tests passed; frontend roster-change structure test passed; `npm run typecheck`, `npm run lint`, `bash scripts/check-state.sh --strict`, and `git diff --check` passed. Browser smoke passed on `http://localhost:3003/roster-change-governance?month=2026-08` with local backend `127.0.0.1:8002`, covering agree -> follow-up, save adjustment -> adjusted with revision anchor, reject -> rejected without revision anchor, current published shift readback, short labels, and no horizontal overflow.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 281 backend tests, and project Harness check.
- local_commit_sha: `pending`

### IM308 Duty Change Adjustment Handoff Gate

- branch_name: `codex/im305-roster-change-center`
- base_main_commit: `stacked on existing duty-change request branch`
- stacked_on: `codex/im305-roster-change-center`
- remote_status: `not_pushed; branch is ahead of origin until PM push confirmation.`
- scope: Product contract and ready Gate for same-page three-column duty-change adjustment handoff.
- qoder_mode: `false; PM confirmed visual A path interactively.`
- allowed_files_check: current/registry/traceability docs, raw requirements, user stories, backlog, and design spec only.
- scope_diff_check: expected design/Gate documentation only; no business implementation, package/lockfile, dependency, backend API, migration, database persistence, real external integration, auth, permissions, approval, notification, export, batch, Excel import, forecasting model, standard-capacity model, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: contract self-review found no TODO/TBD placeholders; `bash scripts/check-state.sh --strict` passed; `git diff --check` passed.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 281 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM308 Duty Change Adjustment Handoff Implementation

- branch_name: `codex/im308-duty-change-adjustment-handoff`
- base_main_commit: `stacked on local codex/im305-roster-change-center`
- stacked_on: `codex/im305-roster-change-center`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Implement same-page three-column duty-change adjustment handoff in `/roster-change-governance`, reusing existing local roster revision/publish/request resolve APIs.
- qoder_mode: `false; implemented directly after PM confirmed start.`
- allowed_files_check: `components/roster-change-governance-workbench.tsx`, focused structure test, current/registry/traceability docs, backlog/R/US docs, and implementation plan only.
- scope_diff_check: expected frontend workbench reshaping and traceability only; no package/lockfile, dependency, backend API, migration, database persistence field, auth, permissions, approval, notification, export, batch, external integration, forecasting, standard capacity, Excel, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: `node --test scripts/tests/roster-change-governance-structure.test.mjs` passed; `npm run lint` passed; `npm run typecheck` passed; `git diff --check` passed.
- browser_smoke: local backend `127.0.0.1:8002` + frontend `localhost:3003`; seeded current published roster plus two open requests; page rendered request queue/current-cell adjustment/handling panel; agree changed metrics to pending 3 / follow-up 1 / processed 2; save changed metrics to pending 3 / follow-up 0 / processed 3 and selected the next pending request; API readback showed `REQ-IM308-SMOKE-1` resolved, `result_type=adjusted`, and non-empty `linked_revision_version_id`.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 888 Node tests (887 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 281 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`

### IM309 Duty Request Center Result Tracking

- branch_name: `codex/im308-duty-change-adjustment-handoff`
- base_main_commit: `stacked on local IM308 branch`
- stacked_on: `codex/im308-duty-change-adjustment-handoff`
- remote_status: `not_pushed; local branch until PM push confirmation.`
- scope: Add standalone downstream `班务申请中心` at `/duty-requests` for frontline and team-lead request result tracking.
- qoder_mode: `false; implemented directly after PM confirmed option A path and asked to develop immediately.`
- allowed_files_check: `app/duty-requests/page.tsx`, `components/duty-request-center-workbench.tsx`, `components/app-sidebar.tsx`, focused structure test, current/traceability docs, backlog/R/US docs only.
- scope_diff_check: expected frontend page/navigation/result-tracking UI and traceability only; no package/lockfile, dependency, backend API, migration, database persistence field, auth, permissions, approval, notification, expedite, withdraw, comments, export, batch, external integration, forecasting, standard capacity, Excel, automatic scheduling, production formulas, settlement, or charge-factor changes.
- focused_check_result: red `node --test scripts/tests/duty-request-center-structure.test.mjs` failed before implementation; green after implementation passed 3 tests. `npm run typecheck` passed. `npm run lint` passed after removing effect-based selected item correction.
- browser_smoke: local backend `127.0.0.1:8002` + frontend `localhost:3003`; seeded current published roster plus `REQ-IM309-SMOKE-1`; `/duty-requests?month=2026-08` rendered role tabs, request list, request detail, result card, handling note, and formal-roster backlink; team-lead tab switch remained stable; console had no error.
- check_result: `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh` passed with strict state check, 891 Node tests (890 pass / 1 skip), shadcn convention check, lint, typecheck, Next build, 281 backend tests, and project Harness check.
- local_commit_sha: `pending`
- integration_status: `not_started`
- integration_method: `N/A`
- integration_commit_sha: `N/A`
- merge_to_main_commit: `N/A`
- push_decision: `not_pushed`
- blocked_reason: `N/A`
