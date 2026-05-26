# Data Quality Group Review Sequence Design

## Goal

Add a local read-only summary on the data quality overview that turns quality group exception coverage into a supervisor review sequence.

## Scope

- Build from existing fallback data quality issues and quality groups.
- Reuse `summarizeDataQualityGroupExceptionCoverage()` as the source order.
- Show only review guidance: ordered steps, owner, risk, representative issue, impacted exceptions, impacted people, blocked rows, group link, next-view hint, and deferred actions.
- Do not add persistence, backend contracts, uploads, approvals, permissions, exports, batch operations, production status rules, or formulas.

## Data Model

`summarizeDataQualityGroupReviewSequence(issues, groups)` returns:

- `stepCount`
- `headline`
- `firstStep`
- `steps`
- `nextViewHint`
- `deferredActions`

Each step includes group identity, sequence number, owner, risk, representative issue, impacted exception count, impacted people, blocked rows, href, and next-view hint.

## UI

The `/data-quality` page adds a card named `质量分组复核顺序` near the existing group exception coverage card. The card presents the first review target and a compact ordered list. It uses links only for navigation and keeps no-action badges visible.

## Testing

- Add a failing model test in `scripts/tests/data-quality-groups.test.mjs`.
- Add a failing source assertion in `scripts/tests/data-quality.test.mjs`.
- Verify with targeted tests, page smoke, strict state check, `git diff --check`, and `bash scripts/check.sh`.
