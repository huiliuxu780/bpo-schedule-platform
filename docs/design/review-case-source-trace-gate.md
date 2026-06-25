# IM247 Review Case Source Trace Gate

## 1. Goal

Build one coherent operator workflow capability: from a review case detail page, the operator can trace the case back through source result, comparison run, business versions, and original import batches.

This extends the existing review-case source tab and model contract. It is not a new backend, database, API, permission, approval, export, or batch-operation slice.

## 2. Product Boundary

Allowed:

- Strengthen the existing review-case `来源链路` tab.
- Surface original import batch context that already exists on `source_trace.versions`.
- Add model output for source-trace version rows, batch hrefs, batch availability, and next action.
- Keep source result and comparison-run links already present.
- Add focused model tests for forecast-vs-schedule and schedule-vs-actual source traces.
- Update current Harness state and this Gate document for traceability.

Not allowed:

- Adding backend API, database schema, migration, repository, seed, or persistence logic.
- Fetching additional data from new endpoints.
- Creating review cases from result rows.
- Changing write actions for evidence, conclusion, or closure.
- Adding dependencies, Playwright, package changes, or lockfile changes.
- Adding permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors.
- Writing Gate, PM, Harness, Codex, or internal acceptance language into product UI.

## 3. Current Code Facts

- `ImportReviewCaseDetailResponse.source_trace.versions` already includes `version_role`, `business_version_id`, `import_version_id`, `import_version_type`, `batch_id`, `file_name`, and business-date range.
- `summarizeImportReviewCaseDetail()` currently formats `sourceTraceVersions` as plain strings.
- `ImportCenterReviewCaseDetailWorkspace` already has a `来源链路` tab and `SourceTraceCard`.
- `SourceTraceCard` currently shows version strings, but does not expose batch links or per-version batch availability as structured UI.
- `buildImportBatchProcessingHref()` already builds `/data-quality/import-batches/{batchId}` style links.

## 4. Acceptance

- Review-case detail source tab shows a readable source chain: source result -> comparison run -> business versions -> original import batches.
- Each source-trace version row shows role, business version, import version, source file name when available, business-date range, and import batch status.
- Rows with `batch_id` link to the existing import batch detail workspace.
- Rows without `batch_id` show an operator-facing unavailable state, not a broken link.
- Forecast-vs-schedule traces show forecast and schedule version rows.
- Schedule-vs-actual traces show schedule and actual version rows.
- Missing `source_trace` keeps the existing graceful waiting/empty state.
- Product UI contains no internal process words: `Gate`, `PM`, `Harness`, `Codex`.

## 5. Allowed Files

- `components/import-center-review-model.ts`
- `components/import-center-review-case-detail-workspace.tsx`
- `components/import-center-navigation.ts`
- `components/import-center-types.ts`
- `scripts/tests/import-center-review-case-detail*.test.mjs`
- `scripts/tests/import-center-review-case-model.test.mjs`
- `docs/current/**` by the main Worker only
- `docs/registry/**` by the main Worker only
- `docs/design/review-case-source-trace-gate.md`

## 6. Verification

Run these before reporting completion:

```bash
node --test scripts/tests/import-center-review-case-detail*.test.mjs
node --test scripts/tests/import-center-review-case-*.test.mjs
bash scripts/check-state.sh --strict
git diff --check
BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh
```

## 7. Qoder Packet A: Source Trace Model Contract

Prompt to send:

```text
You are working in /Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform on branch codex/im247-review-case-source-trace.

Task: IM247 Packet A - Review Case source trace model contract.

Scope:
- Strengthen `summarizeImportReviewCaseDetail()` and related source-trace helpers in `components/import-center-review-model.ts`.
- Add/extend focused tests under `scripts/tests/import-center-review-case-detail*.test.mjs`.
- Keep this as one operator workflow capability, not many separate IMs.

Required behavior:
- Preserve existing `sourceTraceRun` and `sourceTraceHref` behavior.
- Add structured source-trace version rows that include role label, business version id, import version id, import version type, batch id, file name, business-date range, batch href, and batch availability/status label.
- Build batch hrefs only when `batch_id` exists.
- Keep missing source trace graceful: no broken hrefs, no thrown errors.
- Cover both `forecast_vs_schedule` and `schedule_vs_actual` examples.
- Use product-facing Chinese copy only; do not expose internal terms: Gate, PM, Harness, Codex.

Allowed files:
- components/import-center-review-model.ts
- components/import-center-types.ts
- components/import-center-navigation.ts only if a small URL builder is needed
- scripts/tests/import-center-review-case-detail*.test.mjs

Forbidden files:
- backend/**
- app/**
- package.json
- package-lock.json
- docs/current/**
- docs/registry/**

Verification:
- Run `node --test scripts/tests/import-center-review-case-detail*.test.mjs`
- Run `git diff --check`

Stop and report if:
- You need backend/API/schema changes.
- You need package or dependency changes.
- You need to fetch additional data from a new endpoint.
```

## 8. Qoder Packet B: Detail Page Source Tab Expression

Prompt to send:

```text
You are working in /Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform on branch codex/im247-review-case-source-trace.

Task: IM247 Packet B - Review Case source tab expression.

Scope:
- Update `components/import-center-review-case-detail-workspace.tsx` so the existing `来源链路` tab presents the strengthened model output.
- Do not change route structure or backend fetching.
- Do not create a new page.

Required behavior:
- Show the source chain as operator-facing UI: source result, comparison run, version rows, and original import batches.
- Keep the existing comparison-run link.
- For each version row with `batch_id`, show an action to open the existing import batch detail.
- For each version row without `batch_id`, show a clear unavailable state.
- Keep layout consistent with existing shadcn/ui cards, badges, buttons, and tables.
- Do not introduce visible internal terms: Gate, PM, Harness, Codex.

Allowed files:
- components/import-center-review-case-detail-workspace.tsx
- scripts/tests/import-center-review-case-detail*.test.mjs only if structural copy tests need updates

Forbidden files:
- backend/**
- app/**
- package.json
- package-lock.json
- docs/current/**
- docs/registry/**

Verification:
- Run `node --test scripts/tests/import-center-review-case-detail*.test.mjs`
- Run `git diff --check`

Stop and report if:
- You need route changes under app/**.
- You need backend/API/schema changes.
- You need new dependencies or new UI libraries.
```

## 9. Qoder Packet C: Read-only Review and Verification

Prompt to send:

```text
You are working in /Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform on branch codex/im247-review-case-source-trace.

Task: IM247 Packet C - Read-only review and verification.

Scope:
- Review the combined IM247 diff after Packet A and Packet B.
- Do not write docs/current/** or docs/registry/**.
- Do not edit business code unless you find a clear defect introduced by Packet A/B and the fix stays inside allowed files.

Checklist:
- Verify the implementation still represents one medium-sized product capability: Review Case -> source result -> comparison run -> versions -> import batches.
- Verify product UI does not contain internal terms: Gate, PM, Harness, Codex.
- Verify no forbidden files were changed: backend/**, app/**, package.json, package-lock.json.
- Verify missing source trace and missing batch_id states are graceful.
- Verify links only point to existing route patterns.

Commands:
- `node --test scripts/tests/import-center-review-case-detail*.test.mjs`
- `node --test scripts/tests/import-center-review-case-*.test.mjs`
- `git diff --check`

Return:
- Files changed.
- Tests run and exact pass/fail result.
- Any risk or follow-up that Codex should handle before final full check.
```
