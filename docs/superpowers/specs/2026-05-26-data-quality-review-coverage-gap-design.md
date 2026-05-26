# Data Quality Review Coverage Gap Design

## Goal

Add a local read-only "复核覆盖缺口摘要" section to the data quality overview so supervisors can see which impacted data-quality issues are not covered by the current review path.

## Scope

- Add a pure summary function in `lib/data-quality.ts`.
- Render one compact card in `app/data-quality/page.tsx`.
- Extend `scripts/tests/data-quality.test.mjs`.
- Update Harness traceability and audit records.

## Data Rules

- Use existing local summaries: `summarizeDataQualityReviewPathSequence`, `summarizeDataQualityExceptionTop`, and `summarizeDataQualityExceptionImpact`.
- Treat issue IDs linked from review-path steps as covered.
- Treat impacted-exception top items outside the covered issue IDs as coverage gaps.
- Each gap item includes issue ID, title, source field, impacted people, impacted exception count, href, and reason.
- Do not write review conclusions, evidence, exception closure, import repair, or production state.

## UI Rules

- Add one card to the existing `/data-quality` overview.
- Use existing `Card`, `Badge`, `Button`, and `Detail` patterns.
- Show headline, total impacted issues, covered issues, gap count, first gap, gap fields, gap people, next-view hint, and deferred actions.
- Do not imply repair, submit, approval, export, batch, permission, or production workflow capability.

## Verification

- TDD red for missing `summarizeDataQualityReviewCoverageGap()`.
- Green data-quality model/source tests.
- Local `/data-quality` HTML smoke for new labels and representative sample values.
- Strict state check, diff whitespace check, and final `bash scripts/check.sh`.
