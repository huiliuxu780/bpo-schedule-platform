# Data Quality Field Impact Summary Design

## Goal

Add a local read-only "字段影响交叉摘要" section to the data quality overview so supervisors can see which source fields affect the most fulfillment dates, people, and exceptions.

## Scope

- Add a pure summary function in `lib/data-quality.ts`.
- Render the summary in `app/data-quality/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness traceability and audit records.

## Data Rules

- Use only existing `fallbackDataQualityIssues`, `source`, `sourceField`, `errorCode`, `affectedObjects`, and `impactLinks`.
- Include only issues with impacted fulfillment exceptions through `summarizeDataQualityExceptionImpact()`.
- Reuse existing impacted people and business date extraction behavior.
- Group by `sourceField` and `source`.
- Sort by impacted exception count, affected date count, affected person count, blocked rows, then field key.

## UI Rules

- Add one card to the existing `/data-quality` overview.
- Use existing `Card`, `Badge`, `Button`, and `Detail` patterns.
- Show source label, source field, representative cause, representative issue, affected date count, affected people count, impacted exceptions, next-view hint, and deferred actions.
- Do not imply repair, submit, approval, export, batch, permission, or production workflow capability.

## Verification

- TDD red for missing `summarizeDataQualityFieldImpactSummary()`.
- Green data-quality model/source tests.
- Local `/data-quality` HTML smoke for new labels and representative sample values.
- Strict state check, diff whitespace check, and final `bash scripts/check.sh`.
