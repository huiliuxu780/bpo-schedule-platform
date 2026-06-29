# IM274 Qoder Task Packets - Schedule Plan Draft Editor Workbench

## Overall Context

Project root:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform`

Product capability:

Upgrade the schedule plan draft create/edit flow into a complete 0.5h interval editing workbench. This is a user-visible product capability, not a cosmetic refactor. The operator should be able to create or edit a schedule plan draft, inspect interval-level forecast/scheduled/gap values, add or remove interval rows, and see a clear save-before-review summary.

Current branch expected:

`codex/im274-schedule-plan-draft-editor-workbench`

Base branch:

`codex/im273-operational-workbench-shadcn-baseline`

Important rule:

Tasks are serial. Run Packet A first. Run Packet B only after Packet A has completed and its focused checks pass. Do not split these packets into smaller mechanical tasks.

## Global Stop Conditions

Stop and report without editing if any of these are true:

- Current branch is not `codex/im274-schedule-plan-draft-editor-workbench`.
- The branch/base relationship is unclear.
- The worktree contains unrelated dirty changes outside IM274 files.
- You need to modify `backend/**`, `package.json`, `package-lock.json`, `docs/current/**`, `docs/registry/**`, `project-progress/**`, dashboard files, sidebar files, or any file outside the packet allowed list.
- You need new dependencies or package installation.
- You need to change database schema, migrations, repositories, backend API semantics, auth, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors.
- You cannot keep the existing create/update server action field contract.

## Global Git Boundary

Qoder must not:

- commit
- push
- modify `docs/current/**`
- modify `docs/registry/**`
- modify `project-progress/**`
- install dependencies
- modify package or lock files

Return changes only as a report. Codex will review the actual diff, run final checks, commit, and push.

## Existing Files To Understand Before Editing

Read these first:

- `components/schedule-plan-draft-form.tsx`
- `components/schedule-plan-draft-summary.tsx`
- `app/schedule-plans/new/page.tsx`
- `app/schedule-plans/new/actions.ts`
- `app/schedule-plans/[planId]/edit/page.tsx`
- `app/schedule-plans/[planId]/edit/actions.ts`
- `app/schedule-plans/[planId]/page.tsx`
- `lib/schedule-plans.ts`
- `scripts/tests/schedule-plan-draft-hardening-model.test.mjs`
- `scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs`

Current facts:

- Create and edit pages already share `SchedulePlanDraftForm`.
- Summary exists in `SchedulePlanDraftSummary`.
- Actions parse fields by `interval_count` and names like `interval_start_0`, `forecast_agents_0`.
- Numeric parsing already preserves `0` and clamps invalid/negative values to `0`.
- Edit page blocks non-draft plans.
- Existing runtime may not have a draft plan until the create flow runs.

---

## Packet A - Draft Editor Component And Model Hardening

### Branch Requirement

Use the current branch only:

`codex/im274-schedule-plan-draft-editor-workbench`

Do not create a new branch. Do not switch branches.

### Product Goal

Make the shared draft editor component capable of a real schedule-plan drafting workflow: interval rows must be understandable, gap-aware, and structurally ready for adding/removing rows while preserving the existing server-action field contract.

### Allowed Files

- `components/schedule-plan-draft-form.tsx`
- `components/schedule-plan-draft-summary.tsx`
- `lib/schedule-plans.ts`
- `scripts/tests/schedule-plan-draft-hardening-model.test.mjs`
- `scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs`
- A new focused test file under `scripts/tests/`, if needed:
  - recommended: `scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs`

### Forbidden Files

- `backend/**`
- `app/**`
- `docs/current/**`
- `docs/registry/**`
- `docs/prompts/**`
- `project-progress/**`
- `package.json`
- `package-lock.json`
- dashboard/sidebar files

### Required Behavior

1. Keep one shared `SchedulePlanDraftForm` for both create and edit modes.
2. Preserve existing submitted field names:
   - `plan_date`
   - `project_name`
   - `site_name`
   - `version`
   - `interval_count`
   - `interval_start_${index}`
   - `interval_end_${index}`
   - `forecast_agents_${index}`
   - `scheduled_agents_${index}`
   - `note_${index}`
   - `plan_id` for edit mode
3. Interval rows must visibly expose:
   - start time
   - end time
   - forecast agents
   - scheduled agents
   - computed gap (`max(forecast - scheduled, 0)`)
   - note
4. Add row and delete row controls must exist at the component level.
   - They may be client-side controls inside the shared component.
   - At least one interval row must remain.
   - New row default should be predictable and business-safe, for example copying the previous row end time as the next start time where feasible, or using a clearly empty/default row.
5. The summary must clearly report:
   - interval count
   - total forecast
   - total scheduled
   - total non-negative gap
   - coverage rate
6. Avoid claiming automatic scheduling, automatic repair, recommendation, approval, or production readiness.
7. UI copy must be Chinese and operator-facing. Do not expose `Gate`, `PM`, `Harness`, `Codex`, `Qoder`, `backend API`, `data source`, or implementation-source wording.

### Design Constraints

- Use existing shadcn/ui components already present in the repo.
- Do not hand-roll a large custom table if existing Card/Input/Button patterns are enough.
- Keep the editor dense and operational, not a marketing layout.
- The row layout should remain usable on desktop and not collapse labels into unreadable blocks.
- Do not introduce drag-and-drop or complex time-picker behavior in Packet A.

### Test Requirements

Add/update focused tests to prove:

- Shared form still exports `SchedulePlanDraftForm`.
- It keeps all existing field names.
- It renders or encodes add-row and delete-row controls.
- It computes or displays per-row gap.
- It preserves `interval_count`.
- It prevents deleting below one row at the source/structure level.
- Summary computes non-negative total gap and coverage.
- No forbidden internal terminology appears in touched UI files.
- No forbidden capability wording appears: `自动排班`, `自动修复`, `审批`, `导出`, `批量`, `结算`, `收费`.

### Verification Commands

Run:

```bash
node --test scripts/tests/schedule-plan-draft-hardening-model.test.mjs scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs
npm run typecheck
npm run lint
git diff --check
```

If the new test filename differs, include the exact command you ran in the report.

### Return Format

Return:

- changed files
- behavior summary
- field-contract confirmation
- focused verification results
- known risks
- confirmation that no forbidden files were touched
- confirmation that no commit/push was done

---

## Packet B - Page Integration And Browser Acceptance Preparation

### Dependency

Run Packet B only after Packet A is complete and its focused checks pass.

### Branch Requirement

Use the current branch only:

`codex/im274-schedule-plan-draft-editor-workbench`

Do not create a new branch. Do not switch branches.

### Product Goal

Integrate the hardened draft editor into create/edit pages so the full operator flow is coherent:

create draft -> view feedback on detail -> edit draft -> save draft -> non-draft plans remain blocked.

### Allowed Files

- `app/schedule-plans/new/page.tsx`
- `app/schedule-plans/new/actions.ts`
- `app/schedule-plans/[planId]/edit/page.tsx`
- `app/schedule-plans/[planId]/edit/actions.ts`
- `app/schedule-plans/[planId]/page.tsx`
- `components/schedule-plan-draft-form.tsx` only if Packet A left a small integration prop adjustment
- `components/schedule-plan-draft-summary.tsx` only if Packet A left a small integration prop adjustment
- `scripts/tests/schedule-plan-draft-hardening-model.test.mjs`
- `scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs`
- `scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs`

### Forbidden Files

- `backend/**`
- `lib/schedule-plans.ts` unless Packet A explicitly requires a tiny type export follow-up
- `docs/current/**`
- `docs/registry/**`
- `docs/prompts/**`
- `project-progress/**`
- `package.json`
- `package-lock.json`
- dashboard/sidebar files

### Required Behavior

1. `/schedule-plans/new` must render the upgraded editor and summary.
2. `/schedule-plans/[planId]/edit` must render the upgraded editor and summary for draft plans.
3. Non-draft edit pages must continue to render blocker copy and must not render the editable form.
4. Create success must continue redirecting to:
   - `/schedule-plans/{createdId}?draft=create_success`
5. Create failure must continue redirecting to:
   - `/schedule-plans/new?draft=create_failed`
6. Update success must continue redirecting to:
   - `/schedule-plans/{updatedId}?draft=update_success`
7. Update failure must continue redirecting to:
   - `/schedule-plans/{planId}/edit?draft=update_failed`
8. All plan IDs in URLs must remain `encodeURIComponent(...)` protected.
9. Existing server-action parsing must still preserve `0` and clamp invalid/negative values to `0`.
10. The page must not expose internal implementation wording or pseudo capabilities.

### Browser Acceptance Preparation

Do not start new backend/frontend runtimes unless Codex explicitly asks in a later step. For Packet B, prepare the code so Codex can browser-verify:

- `/schedule-plans/new`
- a newly created draft detail page with `?draft=create_success`
- `/schedule-plans/{draftId}/edit`
- the saved draft detail page with `?draft=update_success`
- one non-draft edit page blocker

If you do run any runtime for your own check, report the exact ports and stop any process you started before returning.

### Test Requirements

Focused tests should prove:

- new page imports/uses upgraded editor
- edit page imports/uses upgraded editor only inside draft branch
- non-draft blocker remains present
- create/update redirects preserve expected query params
- `interval_count` and interval field names remain compatible
- add/delete controls are present in the editable branch but not in blocker-only branch
- forbidden internal terms do not appear in touched product files

### Verification Commands

Run:

```bash
node --test scripts/tests/schedule-plan-draft-hardening-model.test.mjs scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs
npm run typecheck
npm run lint
git diff --check
```

Do not claim full project readiness. Codex will run final `bash scripts/check.sh`.

### Return Format

Return:

- changed files
- behavior summary
- create/edit redirect confirmation
- non-draft blocker confirmation
- focused verification results
- runtime processes started, if any
- known risks
- confirmation that no forbidden files were touched
- confirmation that no commit/push was done

---

## Codex Review After Qoder

Codex will:

1. Review actual diff, not just Qoder's report.
2. Run focused tests.
3. Perform browser acceptance with visual checks.
4. Update Harness traceability.
5. Run final `bash scripts/check.sh`.
6. Commit locally if green.
7. Ask PM before push.
