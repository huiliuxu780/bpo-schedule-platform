# Data Quality Day View Order Design

## Goal

Add a local read-only "履约日期查看顺序" section to the data quality overview so supervisors can see which fulfillment dates are affected by data quality issues and drill into the relevant fulfillment view first.

## Scope

- Add a frontend summary function in `lib/data-quality.ts`.
- Render the summary on `app/data-quality/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness traceability and audit files.

## Data Rules

- Use only existing `fallbackDataQualityIssues`, `affectedObjects`, `impactLinks`, and issue fields.
- Include only issues that already have impacted fulfillment exceptions through `summarizeDataQualityExceptionImpact()`.
- Extract business dates from `impactLinks` query strings and affected-object labels.
- Sort dates by impacted exception count, impacted people count, blocked rows, then date.
- Provide representative issue, representative cause, affected people, and next-view hint.

## UI Rules

- Add one card to the existing `/data-quality` overview.
- Use existing `Card`, `Badge`, `Button`, and `Detail` patterns.
- The card must show affected dates, impacted exceptions, impacted people, representative issue, next view, and deferred actions.
- No repair, submit, approval, export, batch, permission, or production wording.

## Verification

- TDD red for missing `summarizeDataQualityDayViewOrder()`.
- Green data-quality model/source tests.
- Local `/data-quality` HTML smoke for new labels and sample values.
- Strict state check, diff whitespace check, and final `bash scripts/check.sh`.
