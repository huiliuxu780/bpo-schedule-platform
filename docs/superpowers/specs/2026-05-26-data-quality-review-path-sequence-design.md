# Data Quality Review Path Sequence Design

## Goal

Add a local read-only "复核路径顺序" section to the data quality overview so supervisors can follow a clear viewing path from priority issue to field, date, person, and cause.

## Scope

- Add a pure summary function in `lib/data-quality.ts`.
- Render one compact card in `app/data-quality/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness traceability and audit records.

## Data Rules

- Use existing local summaries: `summarizeDataQualityReviewPriorityRationale`, `summarizeDataQualityExceptionTop`, `summarizeDataQualityFieldImpactSummary`, `summarizeDataQualityDayViewOrder`, `summarizeDataQualityPersonViewOrder`, and `summarizeDataQualityExceptionCauses`.
- Include only local read-only derived data.
- Build ordered steps for priority issue, top field, top date, top person, and top cause.
- Each step includes type, title, href, reason, impacted exception count, and impacted people count.
- Do not write review conclusions, evidence, exception closure, import repair, or production state.

## UI Rules

- Add one card to the existing `/data-quality` overview.
- Use existing `Card`, `Badge`, `Button`, and `Detail` patterns.
- Show path headline, step count, first step, ordered steps, reasons, view links, next-view hint, and deferred actions.
- Do not imply repair, submit, approval, export, batch, permission, or production workflow capability.

## Verification

- TDD red for missing `summarizeDataQualityReviewPathSequence()`.
- Green data-quality model/source tests.
- Local `/data-quality` HTML smoke for new labels and representative sample values.
- Strict state check, diff whitespace check, and final `bash scripts/check.sh`.
