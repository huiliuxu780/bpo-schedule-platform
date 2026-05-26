# Data Quality Step Owner Load Design

## Goal

Add a local read-only summary that groups quality group review step impact by owner and impacted people.

## Scope

- Build from existing `summarizeDataQualityGroupStepImpactDrilldown()`.
- Show owner, step count, impacted people, representative issue, group titles, issue link, optional person link, next-view hint, and deferred actions.
- Do not add backend contracts, persistence, task assignment, approvals, permissions, exports, batch operations, production status rules, or formulas.

## Data Model

`summarizeDataQualityGroupStepOwnerLoad(issues, groups)` returns:

- `ownerCount`
- `totalStepCount`
- `totalImpactedPeopleCount`
- `topOwner`
- `items`
- `nextViewHint`
- `deferredActions`

Items are sorted by step count, impacted people, and owner name.

## UI

The `/data-quality` page adds a card named `分组步骤 owner/人员负载` after the impact object card. It gives the supervisor a compact owner-pressure view without creating assignments or workflow state.

## Testing

- Add a failing model test in `scripts/tests/data-quality-groups.test.mjs`.
- Add a failing page-source assertion in `scripts/tests/data-quality.test.mjs`.
- Verify with targeted tests, page smoke, strict state check, `git diff --check`, and `bash scripts/check.sh`.
