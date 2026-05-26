# Data Quality Review Priority Rationale Design

## Goal

Add a local read-only "复核优先级说明" section to the data quality overview so supervisors can understand why a field, date, person, cause, or problem should be reviewed first.

## Scope

- Add a pure summary function in `lib/data-quality.ts`.
- Render one compact card in `app/data-quality/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness traceability and audit records.

## Data Rules

- Use existing local summaries: `summarizeDataQualityExceptionTop`, `summarizeDataQualityExceptionCauses`, `summarizeDataQualityPersonViewOrder`, `summarizeDataQualityDayViewOrder`, and `summarizeDataQualityFieldImpactSummary`.
- Include only local read-only derived data.
- Build a supervisor-readable headline, representative first-review problem, rationale reasons, next-view hint, and deferred actions.
- Do not write review conclusions, evidence, exception closure, import repair, or production state.

## UI Rules

- Add one card to the existing `/data-quality` overview.
- Use existing `Card`, `Badge`, `Button`, and `Detail` patterns.
- Show headline, top field, top date, top person, top cause, representative issue, rationale reasons, next-view hint, and deferred actions.
- Do not imply repair, submit, approval, export, batch, permission, or production workflow capability.

## Verification

- TDD red for missing `summarizeDataQualityReviewPriorityRationale()`.
- Green data-quality model/source tests.
- Local `/data-quality` HTML smoke for new labels and representative sample values.
- Strict state check, diff whitespace check, and final `bash scripts/check.sh`.
