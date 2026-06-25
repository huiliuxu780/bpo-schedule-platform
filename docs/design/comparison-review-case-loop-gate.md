# IM246 Comparison Run to Review Case Loop Gate

## 1. Goal

Build one coherent operator workflow capability: from a comparison run detail page, the operator can understand which review cases belong to that run, prioritize open/high-risk cases, open the case detail, and return from the review case detail to the source comparison run.

This is a frontend/model enhancement over existing local MVP data contracts. It is not a new persistence or backend slice.

## 2. Product Boundary

Allowed:

- Strengthen the existing comparison-run detail review-case summary.
- Strengthen model output for related review-case count, open count, risk priority, empty state, and read-error state.
- Preserve review-case detail source-run back link.
- Add focused model tests for matching, ordering, empty state, and error state.
- Update only current Harness state and this Gate document for traceability.

Not allowed:

- Creating review cases from result rows.
- Adding backend API, database schema, migration, repository, seed, or persistence logic.
- Adding dependencies, Playwright, package changes, or lockfile changes.
- Adding permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors.
- Writing Gate, PM, Harness, Codex, or internal acceptance language into product UI.

## 3. Current Code Facts

- `/data-quality/comparison-runs/[runId]` already fetches comparison-run detail and review cases for the run business date.
- `summarizeImportComparisonRunReviewCases()` already matches review cases to result rows by `source_result_type` and `source_result_id`.
- `ImportCenterComparisonRunDetailWorkspace` already has a `复核案例` tab with a related-case table.
- Review-case detail already exposes `sourceTraceHref` back to `/data-quality/comparison-runs/{runId}`.

## 4. Acceptance

- The comparison-run review tab shows a clear summary for total related cases, open cases, high-risk/open priority, and next action.
- Related review cases are sorted so open/high-risk cases are easier to act on before closed/low-risk cases.
- Each related case row links to `/data-quality/review-cases/{caseId}`.
- Empty state says the current run has no matched review cases and tells the operator to continue reviewing result details.
- Review-case read failure uses an operator-facing blocked state and does not hide the comparison-run result context.
- Review-case detail continues to show source run context and a link back to the comparison run.
- Product UI contains no internal process words: `Gate`, `PM`, `Harness`, `Codex`.

## 5. Allowed Files

- `components/import-center-comparison-model.ts`
- `components/import-center-comparison-run-detail-workspace.tsx`
- `components/import-center-review-model.ts`
- `components/import-center-navigation.ts`
- `components/import-center-types.ts`
- `scripts/tests/import-center-comparison-*.test.mjs`
- `scripts/tests/import-center-review-case-*.test.mjs`
- `docs/current/**` by the main Worker only
- `docs/registry/**` by the main Worker only
- `docs/design/comparison-review-case-loop-gate.md`

## 6. Verification

Run these before reporting completion:

```bash
node --test scripts/tests/import-center-comparison-*.test.mjs
node --test scripts/tests/import-center-review-case-*.test.mjs
bash scripts/check-state.sh --strict
git diff --check
BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh
```

## 7. Qoder Packet A: Model Contract

Prompt to send:

```text
You are working in /Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform on branch codex/im246-comparison-review-case-loop.

Task: IM246 Packet A - Comparison Run -> Review Case model contract.

Scope:
- Improve or confirm `summarizeImportComparisonRunReviewCases()` in `components/import-center-comparison-model.ts`.
- Add/extend focused tests under `scripts/tests/import-center-comparison-*.test.mjs`.
- Keep this as one operator workflow capability, not many separate IMs.

Required behavior:
- Match review cases to comparison-run result rows by exact `(source_result_type, source_result_id)`.
- Do not match cases from another source type or unrelated result id.
- Sort related cases so open/high-risk cases are prioritized before lower-risk or closed cases.
- Return clear summary values for total related cases, open count, blocked/warning/ready tone, empty state, and review read failure.
- Preserve product-facing Chinese copy and avoid internal terms: Gate, PM, Harness, Codex.

Allowed files:
- components/import-center-comparison-model.ts
- components/import-center-types.ts only if the summary type must be extended
- scripts/tests/import-center-comparison-*.test.mjs

Forbidden files:
- backend/**
- app/**
- package.json
- package-lock.json
- docs/current/**
- docs/registry/**

Verification:
- Run `node --test scripts/tests/import-center-comparison-*.test.mjs`
- Run `git diff --check`

Stop and report if:
- You need backend/API/schema changes.
- You need package or dependency changes.
- The model change would require creating review cases from result rows.
```

## 8. Qoder Packet B: Page Expression

Prompt to send:

```text
You are working in /Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform on branch codex/im246-comparison-review-case-loop.

Task: IM246 Packet B - Comparison Run review-case tab expression.

Scope:
- Update `components/import-center-comparison-run-detail-workspace.tsx` so the existing `复核案例` tab presents the model summary more clearly.
- Do not change route structure or backend fetching.
- Do not create new product surfaces.

Required behavior:
- Show the related-case summary, open/high-risk priority, and next action in operator-facing Chinese.
- Keep each related case row linking to `/data-quality/review-cases/{caseId}`.
- Preserve empty state and read-failure state.
- Do not introduce visible internal terms: Gate, PM, Harness, Codex.
- Keep layout consistent with existing shadcn/ui cards, badges, buttons, and tables.

Allowed files:
- components/import-center-comparison-run-detail-workspace.tsx
- scripts/tests/import-center-comparison-*.test.mjs only if structural copy tests need updates

Forbidden files:
- backend/**
- app/**
- package.json
- package-lock.json
- docs/current/**
- docs/registry/**

Verification:
- Run `node --test scripts/tests/import-center-comparison-*.test.mjs`
- Run `git diff --check`

Stop and report if:
- You need route changes under app/**.
- You need backend/API/schema changes.
- You need new dependencies or new UI libraries.
```

## 9. Qoder Packet C: Review And Verification

Prompt to send:

```text
You are working in /Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform on branch codex/im246-comparison-review-case-loop.

Task: IM246 Packet C - Read-only review and verification.

Scope:
- Review the combined IM246 diff after Packet A and Packet B.
- Do not write docs/current/** or docs/registry/**.
- Do not edit business code unless you find a clear defect introduced by Packet A/B and the fix stays inside allowed files.

Checklist:
- Verify the implementation still represents one medium-sized product capability, not multiple unrelated feature slices.
- Verify product UI does not contain internal terms: Gate, PM, Harness, Codex.
- Verify no forbidden files were changed: backend/**, app/**, package.json, package-lock.json.
- Verify comparison-run detail still keeps result context when review-case loading fails.
- Verify review-case detail still links back to source comparison run through existing source trace behavior.

Commands:
- `node --test scripts/tests/import-center-comparison-*.test.mjs`
- `node --test scripts/tests/import-center-review-case-*.test.mjs`
- `git diff --check`

Return:
- Files changed.
- Tests run and exact pass/fail result.
- Any risk or follow-up that Codex should handle before final full check.
```

## 10. Closeout

IM246 completed on branch `codex/im246-comparison-review-case-loop` as one medium-sized product capability.

Completed scope:

- Added explicit `totalCount` and `openCount` to the comparison-run review-case summary contract.
- Changed related review-case ordering to prioritize open cases before closed cases, then higher-risk cases.
- Strengthened the comparison-run `复核案例` tab with a clearer summary, count display, next action, and tone-specific badges.
- Expanded model coverage for matching, empty state, read error, null detail, ordering, all-closed cases, `schedule_actual` matching, and result-id mismatch.

Verification evidence:

- `node --test scripts/tests/import-center-comparison-*.test.mjs`: 20 pass.
- `node --test scripts/tests/import-center-review-case-*.test.mjs`: 38 pass.
- `bash scripts/check-state.sh --strict`: pass.
- `git diff --check`: pass.
- `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`: 447 Node tests with 446 pass and 1 skip, lint pass, typecheck pass, Next build pass, 221 backend unittest pass, Harness check pass.

Deferred:

- Runtime browser acceptance can be done later if PM wants visual proof, but no runtime automation or new dependency is required for this scope.
- Creating review cases from result rows, owner-wide API expansion, version history timelines, permissions, approval, export, batch operations, production formulas, settlement rules, and charge factors remain out of scope.
