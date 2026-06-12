# Frontend Health Recovery Plan

## Purpose

This plan makes the frontend recovery work durable across context compaction. It converts the external audit and PM decisions into a governed IM sequence. The immediate active task is `IM172`; later IMs must be moved into `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml` one at a time before implementation.

## Recovery Entry

After any context reset, read these files first:

1. `AGENTS.md`
2. `docs/current/PROJECT_CONTEXT.md`
3. `docs/current/STORY_QUEUE.yaml`
4. `docs/current/ACTIVE_TASKS.yaml`
5. `docs/current/BLOCKERS.md`
6. `docs/frontend-health-recovery-plan.md`
7. `docs/superpowers/plans/2026-06-12-frontend-health-recovery.md`

If the current queue is empty, do not guess the next task. Use this plan to seed exactly one next `R/US/IM` item, then run `bash scripts/check-state.sh --strict`.

## Product Boundary

The recovery stage fixes frontend maintainability, error/loading behavior, and UI design governance. It must not add unconfirmed business capabilities.

Do not add:

- permissions, approval, export, or batch operations
- automatic scheduling
- settlement rules, supplier contracts, minimum staffing, or charge factors
- production formulas or production status-code changes
- new package or lockfile changes without a separate PM-confirmed Gate
- a revived `质量中心`, `数据质量中心`, or generic `导入中心` Sidebar entry without PM confirmation

## Product Design Gate

Any IM that changes a visible page, navigation, form, table, dialog, action placement, empty state, loading state, or error state must use the Product Design plugin before implementation. The Product Design brief must answer:

- What is the page or flow goal?
- What page type is being changed: list, detail, create, edit, dialog, or error/loading state?
- Which actions are page-level, table-level, row-level, or dangerous?
- Whether the right pattern is child page, Dialog, Alert, Breadcrumb, Tabs, or table toolbar.
- What must be checked in light and dark themes.

No Product Design brief means no UI implementation for that IM.

## Stage Sequence

### Stage 0 - Governance

`IM172` records this plan, places only itself in the current queue, and sets acceptance rules for the recovery stage. It does not modify product code.

### Stage 1 - Low-Risk Engineering P0

`IM173` extracts shared API result and error utilities:

- `lib/api-result.ts`
- `lib/api-error.ts`
- replaces repeated `ApiResult<T>` and `formatApiError`

`IM174` extracts shared import fetch utilities:

- `lib/import-api.ts`
- reduces repeated `fetchImportBatches`
- reduces repeated `fetchImportFieldMappingTemplates`
- keeps page-only fetch functions colocated

`IM175` adds runtime guards for Server Action inputs:

- starts with `app/data-quality/actions.ts`
- guards `file_type`, comparison type, and redirect target values
- does not introduce a broad form-library migration

### Stage 2 - Loading and Error

`IM176` adds global error handling:

- `app/error.tsx`
- shadcn Alert/Button style
- retry and safe return action

`IM177` adds loading states for core business routes:

- `dashboard`
- `master-data`
- `demand-plans`
- `schedule-plans`
- `actual-logs/production`
- `data-quality`

This stage uses pragmatic route-local `loading.tsx` files first. A `(main)` route-group migration is deferred.

### Stage 3 - Mechanical Decomposition

`IM178` splits `components/import-center-model.ts` first pass:

- types
- constants
- formatters
- navigation helpers

`IM179` splits remaining import-center summarizers and builders while preserving exports and behavior.

`IM180` splits `components/master-data-maintenance-workbench.tsx` by entity-owned sections without changing UI behavior.

`IM181` splits `components/master-data-maintenance-model.ts` by responsibility.

### Stage 4 - Product Design Recovery

`IM182` codifies visible action placement:

- Header for page-level actions
- table toolbar for list-level actions
- row actions for row-level navigation
- Dialog for dangerous confirmation
- child pages for create/edit

`IM183` introduces a shared empty state pattern without inventing new business actions.

`IM184` improves confirmed forms with consistent labels, inline errors, submit state, and page feedback.

`IM185` reviews navigation and Breadcrumb rules. It must not chase Sidebar coverage for detail/create/edit pages.

### Stage 5 - Business Work Resumption

After the recovery stage has reduced repeat patterns and stabilized UI states, return to business-version flows:

- forecast version list/detail
- schedule version list/detail
- login/status-log version list/detail
- comparison trigger and result review

## IM Execution Rules

Each IM must:

1. Read `AGENTS.md` and `docs/current/**`.
2. Seed exactly one ready story and one active task.
3. Use Product Design plugin first when UI is affected.
4. Output a Chinese Gate Plan.
5. Work on a task branch.
6. Use TDD or structural tests for the specific change.
7. Run focused checks.
8. Run browser smoke for visible UI changes.
9. Run final `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`.
10. Update traceability logs.
11. Commit locally after green verification.
12. Ask PM before push.

## Acceptance Metrics

The recovery stage should move these indicators in the right direction:

- `ApiResult<T>` repeated definitions decrease from 15 toward 1.
- `formatApiError` repeated definitions decrease from current repeated count toward 1.
- `fetchImportBatches` repeated definitions decrease from 11 toward 1.
- `fetchImportFieldMappingTemplates` repeated definitions decrease from 6 toward 1.
- `app/error.tsx` exists.
- Core business route loading states exist.
- New visible UI work has Product Design brief evidence.
- New components stay focused and avoid growing existing giant files.

## Explicit Non-Goals

The audit report is input, not an executable order. These audit ideas are not part of the recovery stage unless PM separately confirms them:

- adding schedule submit-review or publish actions
- adding a schedule-risk list page as a product feature
- adding data export
- adding batch operations
- adding approval or permission boundaries
- clearing dependencies from `package.json`
- migrating all pages into `(main)` route groups
- changing `cache: "no-store"` broadly
