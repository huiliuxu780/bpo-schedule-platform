# Data Quality Owner Review Queue Design

## Goal

Add a local read-only owner review queue to the data quality overview so supervisors can turn group-step owner/person load into the next owner, issue, and person to inspect.

## Scope

- Add one frontend model helper in `lib/data-quality-groups.ts`.
- Add one card to `app/data-quality/page.tsx`.
- Add focused model and page-source tests.
- Update Harness traceability and audit docs.

## Data Flow

The helper derives from `summarizeDataQualityGroupStepOwnerLoad()`. Each owner load item becomes one queue item with rank, owner, step count, impacted people, primary person, group titles, representative issue, issue link, person link, queue reason, and next-view hint. Sorting follows the existing owner-load order.

## UI

The `/data-quality` card title is `分组步骤 owner 复核队列`. It shows queue count, first owner, impacted people, and total steps, then renders each queue item with issue/person drilldown links and deferred-action badges. Empty state explains that no owner load exists.

## Boundaries

This is local fallback/read-only presentation only. It does not add backend endpoints, database, ORM, migrations, real external integration, auth, permissions, approval, export, batch operations, production status dictionaries, automatic scheduling, settlement, charge factors, or production formulas.

## Verification

- `node --test scripts/tests/data-quality-groups.test.mjs`
- `node --test scripts/tests/data-quality.test.mjs`
- `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`
- `/data-quality` local HTML smoke for the new card and key objects.
- `bash scripts/check-state.sh --strict`
- `git diff --check`
- `bash scripts/check.sh`
