# Data Quality Group Step Impact Drilldown Design

## Goal

Add a local read-only summary that explains what each quality group review step affects.

## Scope

- Build from existing fallback data quality issues, quality groups, and `summarizeDataQualityGroupReviewSequence()`.
- Show ordered step impact details: representative issue, impacted people, affected objects, issue detail link, first person fulfillment link, next-view hint, and deferred actions.
- Do not add backend contracts, persistence, uploads, approvals, permissions, exports, batch operations, production status rules, or formulas.

## Data Model

`summarizeDataQualityGroupStepImpactDrilldown(issues, groups)` returns:

- `stepCount`
- `totalImpactedPeopleCount`
- `firstItem`
- `items`
- `nextViewHint`
- `deferredActions`

Each item is keyed by review step and includes group identity, representative issue, impacted people, affected objects, quality issue href, optional person href, and next-view hint.

## UI

The `/data-quality` page adds a card named `分组步骤影响对象` near the group review sequence card. The card gives the supervisor a compact ordered list that moves from group step to representative issue and person drilldown.

## Testing

- Add a failing model test in `scripts/tests/data-quality-groups.test.mjs`.
- Add a failing page-source assertion in `scripts/tests/data-quality.test.mjs`.
- Verify with targeted tests, page smoke, strict state check, `git diff --check`, and `bash scripts/check.sh`.
