# IM275 Qoder Task Packets - Schedule Draft Validation Review

## Overall Context

Project root:

`/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform`

Product capability:

Add a submit-before-save validation and review panel to the schedule-plan draft editor built in IM274. This is one complete operator-facing capability: the operator should understand whether the draft is saveable, which interval rows need correction, which issues are warnings only, and how much total gap remains before saving or submitting the draft later.

Current branch expected:

`codex/im275-schedule-draft-validation-review`

Base branch:

`codex/im274-schedule-plan-draft-editor-workbench`

Important granularity rule:

Do not split this into tiny mechanical tasks. Packet A and Packet B are the intended medium packets. Run them serially. Packet A builds the shared model and panel. Packet B integrates save blocking and browser-acceptance-ready page behavior. Do not start Packet B until Packet A has passed its focused checks.

## Global Stop Conditions

Stop and report without editing if any of these are true:

- Current branch is not `codex/im275-schedule-draft-validation-review`.
- The branch/base relationship is unclear.
- The worktree contains unrelated dirty changes outside IM275 files. `project-progress/**` may exist as untracked local output; do not touch it.
- You need to modify `backend/**`, `package.json`, `package-lock.json`, `docs/current/**`, `docs/registry/**`, `docs/prompts/**`, `project-progress/**`, dashboard files, sidebar files, or any file outside the packet allowed list.
- You need new dependencies or package installation.
- You need database schema, migration, repository, backend API, auth, permission, approval, export, batch operation, automatic scheduling, production formula, settlement rule, or charge-factor changes.
- You cannot preserve the existing create/update server action field contract.

## Global Git Boundary

Qoder must not:

- commit
- push
- modify `docs/current/**`
- modify `docs/registry/**`
- modify `docs/prompts/**`
- modify `project-progress/**`
- install dependencies
- modify package or lock files

Return changes only as a report. Codex will review the actual diff, run browser checks, final verification, commit, and push.

## Existing Files To Understand Before Editing

Read these first:

- `components/schedule-plan-draft-form.tsx`
- `components/schedule-plan-draft-summary.tsx`
- `app/schedule-plans/new/page.tsx`
- `app/schedule-plans/new/actions.ts`
- `app/schedule-plans/[planId]/edit/page.tsx`
- `app/schedule-plans/[planId]/edit/actions.ts`
- `lib/schedule-plans.ts`
- `scripts/tests/schedule-plan-draft-hardening-model.test.mjs`
- `scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs`
- `scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs`

Current facts:

- `SchedulePlanDraftForm` is a client component.
- It owns interval `rows` state.
- It preserves submitted field names consumed by server actions.
- It renders `SchedulePlanDraftSummary` internally.
- New and edit pages keep page-level server action forms.
- Edit page blocks non-draft plans before rendering the editable form.

---

## Packet A - Validation Model And Review Panel

### Branch Requirement

Use the current branch only:

`codex/im275-schedule-draft-validation-review`

Do not create a new branch. Do not switch branches.

### Product Goal

Create a shared validation model and a compact review panel that can be rendered inside `SchedulePlanDraftForm`. The model must classify hard errors versus warnings, compute whether saving should be blocked, and expose enough summary data for operator review.

### Allowed Files

- `lib/schedule-plans.ts`
- `components/schedule-plan-draft-validation-panel.tsx` (new)
- `scripts/tests/schedule-plan-draft-validation-model.test.mjs` (new)
- Existing draft tests under `scripts/tests/` only if needed to keep coverage consistent

### Forbidden Files

- `app/**`
- `backend/**`
- `components/schedule-plan-draft-form.tsx`
- `components/schedule-plan-draft-summary.tsx`
- `docs/current/**`
- `docs/registry/**`
- `docs/prompts/**`
- `project-progress/**`
- `package.json`
- `package-lock.json`
- dashboard/sidebar files

### Required Model Behavior

Add pure model helpers in `lib/schedule-plans.ts`:

- `SchedulePlanDraftValidationIssue`
  - fields: `kind`, `severity`, `message`, optional `field`, optional `rowIndex`
  - `severity`: `"error" | "warning"`
- `SchedulePlanDraftValidationSummary`
  - fields: `issues`, `errorCount`, `warningCount`, `canSubmit`, `totalGap`, `zeroForecastRows`, `zeroScheduledRows`
- `validateSchedulePlanDraft(planFields, rows)`
  - `planFields`: `plan_date`, `project_name`, `site_name`, `version`
  - `rows`: `interval_start`, `interval_end`, `forecast_agents`, `scheduled_agents`, `note`

Validation rules:

Hard errors (`severity: "error"`, block submit):

1. Missing `plan_date`.
2. Missing `project_name`.
3. Missing `site_name`.
4. Missing `version`.
5. No interval rows.
6. Missing interval start or end.
7. Invalid time format for start or end. Accept only `HH:mm`.
8. End time must be later than start time.
9. Overlapping intervals after sorting by start time.

Warnings (`severity: "warning"`, do not block submit):

1. Gap exists for any row where `forecast_agents > scheduled_agents`.
2. `forecast_agents === 0`.
3. `scheduled_agents === 0`.
4. Obvious interval break after sorting by start time. Example: previous end is not equal to next start.

Model constraints:

- Do not auto-fix intervals.
- Do not mutate input rows.
- Do not call backend APIs.
- Do not use Date objects with timezone-sensitive parsing for `HH:mm`; use deterministic string/minute parsing.
- Treat negative or non-finite numeric values as `0` for validation summaries, matching the form's existing safe numeric behavior.
- `canSubmit` is true only when `errorCount === 0`.
- `totalGap` is the sum of `Math.max(forecast_agents - scheduled_agents, 0)`.

### Required Panel Behavior

Create `components/schedule-plan-draft-validation-panel.tsx`.

It should:

- Be a presentational component.
- Accept a `summary: SchedulePlanDraftValidationSummary` prop.
- Render Chinese operator-facing copy.
- Show:
  - whether the draft can be saved
  - error count
  - warning count
  - total gap
  - a short list of issues
- Separate errors from warnings visually through existing shadcn/Card/Badge-like primitives or existing styling patterns.
- Avoid large marketing cards. Keep it dense and operational.

Copy boundaries:

- Use words like `可保存`, `需要修正`, `提醒`, `缺口`.
- Do not use internal terms: `Gate`, `PM`, `Harness`, `Codex`, `Qoder`, `backend API`, `data source`.
- Do not claim: `自动排班`, `自动修复`, `自动补齐`, `审批`, `导出`, `批量`, `结算`, `收费`.

### Test Requirements

Create `scripts/tests/schedule-plan-draft-validation-model.test.mjs`.

Tests must cover:

- Valid draft has `canSubmit: true`, zero errors, expected warning count if a gap exists.
- Missing plan fields create hard errors and `canSubmit: false`.
- Empty interval list creates hard error.
- Missing interval start/end creates hard error.
- Invalid `HH:mm` creates hard error.
- End time earlier than or equal to start creates hard error.
- Overlap creates hard error.
- Break between adjacent intervals creates warning only.
- Gap creates warning and contributes to `totalGap`.
- Zero forecast/scheduled rows are counted and warned.
- Inputs are not mutated.
- Validation panel source renders error/warning/total gap/can-save labels.
- No forbidden internal terms or capability claims in touched UI files.

### Verification Commands

Run:

```bash
node --test scripts/tests/schedule-plan-draft-validation-model.test.mjs scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs
npm run typecheck
npm run lint
git diff --check
```

### Return Format

Return:

- changed files
- model behavior summary
- panel behavior summary
- focused verification results
- known risks
- confirmation that no forbidden files were touched

---

## Packet B - Form Integration And Save Blocking

Run Packet B only after Packet A is complete and focused checks pass.

### Branch Requirement

Use the current branch only:

`codex/im275-schedule-draft-validation-review`

Do not create a new branch. Do not switch branches.

### Product Goal

Integrate the validation model and review panel into `SchedulePlanDraftForm` so the operator sees validation feedback live while editing and cannot submit a draft with hard validation errors.

### Allowed Files

- `components/schedule-plan-draft-form.tsx`
- `components/schedule-plan-draft-validation-panel.tsx` only if a tiny prop/wording adjustment is needed
- `scripts/tests/schedule-plan-draft-validation-model.test.mjs`
- `scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs`
- `scripts/tests/schedule-plan-draft-hardening-model.test.mjs`
- `scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs`

### Forbidden Files

- `app/**`
- `backend/**`
- `lib/schedule-plans.ts` unless Packet A requires a small type/export correction
- `docs/current/**`
- `docs/registry/**`
- `docs/prompts/**`
- `project-progress/**`
- `package.json`
- `package-lock.json`
- dashboard/sidebar files

### Required Behavior

In `SchedulePlanDraftForm`:

1. Preserve existing submitted field names:
   - `plan_date`
   - `project_name`
   - `site_name`
   - `version`
   - `plan_id`
   - `interval_count`
   - `interval_start_${index}`
   - `interval_end_${index}`
   - `forecast_agents_${index}`
   - `scheduled_agents_${index}`
   - `note_${index}`
2. Convert plan fields from uncontrolled `defaultValue` inputs to controlled state if needed so validation can update live.
3. Keep rows state and add/delete behavior from IM274.
4. Compute validation summary from current plan fields and current rows.
5. Render `SchedulePlanDraftValidationPanel` before the submit/cancel action row.
6. Disable the submit button when `validationSummary.canSubmit === false`.
7. Keep cancel link enabled.
8. Keep the page-level `<form action={createDraftAction}>` / `<form action={updateDraftAction}>` untouched; the shared form component must not own the server action.
9. Do not prevent valid warning-only drafts from saving; warnings should not disable submit.
10. Do not introduce modal dialogs, browser alerts, drag-and-drop, time pickers, or auto-fix behavior.

### Test Requirements

Update focused tests to prove:

- Form imports and calls `validateSchedulePlanDraft`.
- Form renders `SchedulePlanDraftValidationPanel`.
- Submit button is disabled from `!validationSummary.canSubmit` or equivalent.
- Plan fields are included in validation input.
- Rows are included in validation input.
- Existing field names remain present.
- Form still does not own the server-action `<form>`.
- New/edit pages still keep page-level server action forms.
- Warning-only language does not imply blocking.
- No forbidden internal terms or capability claims in touched UI files.

### Browser Acceptance Preparation

Do not start runtimes unless Codex explicitly asks.

After implementation, report exactly how Codex should verify in browser:

- Open `/schedule-plans/new`.
- Clear project or site field and confirm submit disables with hard error.
- Restore required field and confirm submit re-enables if only warnings remain.
- Make first interval end equal to start and confirm hard error.
- Fix interval and confirm hard error disappears.
- Set forecast greater than scheduled and confirm warning/total gap updates but submit remains enabled if no hard errors remain.

### Verification Commands

Run:

```bash
node --test scripts/tests/schedule-plan-draft-validation-model.test.mjs scripts/tests/schedule-plan-draft-editor-workbench-model.test.mjs scripts/tests/schedule-plan-draft-hardening-model.test.mjs scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs
npm run typecheck
npm run lint
git diff --check
```

### Return Format

Return:

- changed files
- behavior summary
- submit-blocking confirmation
- field-contract confirmation
- focused verification results
- browser verification recipe
- known risks
- confirmation that no forbidden files were touched

---

## Codex Review After Qoder Returns

Codex will:

1. Review actual `git diff`.
2. Check no forbidden files were touched.
3. Run focused verification.
4. Run browser acceptance with a real local page.
5. Update Harness traceability.
6. Run `bash scripts/check.sh`.
7. Commit locally.
8. Ask PM before push.
