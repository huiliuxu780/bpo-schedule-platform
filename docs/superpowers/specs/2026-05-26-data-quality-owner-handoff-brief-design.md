# Data Quality Owner Handoff Brief Design

## Goal

Add a local read-only owner handoff brief to the data quality overview so supervisors can turn the owner review queue into concise wording for responsible owners.

## Scope

- Add one frontend model helper in `lib/data-quality-groups.ts`.
- Add one card to `app/data-quality/page.tsx`.
- Add focused model and page-source tests.
- Update Harness traceability and audit docs.

## Data Flow

The helper derives from `summarizeDataQualityGroupStepOwnerReviewQueue()`. Each queue item becomes one handoff item with owner, representative issue, primary person, related groups, issue/person links, and a short list of handoff points. The summary exposes first item, item count, total people, next-view hint, and deferred actions.

## UI

The `/data-quality` card title is `分组步骤 owner 交接摘要`. It shows handoff count, first owner, impacted people, and issue count, then renders each owner handoff with bullet-like handoff points and links. Empty state explains that no owner queue exists.

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
