# Data Quality Handoff Risk Import Impact Design

## Goal

Add a local read-only summary that links owner handoff risk items to the import batches and failure rows behind the representative data quality issue.

## Scope

- Add a frontend model helper in `lib/data-quality-groups.ts`.
- Add a data quality overview card in `app/data-quality/page.tsx`.
- Add model and page source tests.
- Update Harness traceability and audit files.

## Behavior

The summary is based on `summarizeDataQualityGroupStepOwnerHandoffRiskSummary()` and local fallback import batches. For each owner risk item, the helper looks up the representative data quality issue and reuses existing batch impact fields to summarize:

- owner and representative issue
- primary person and related groups
- related import batch count and failed rows
- matched fields and affected objects
- issue, person, and batch links
- next-view hint and deferred actions

The page card appears after “分组步骤 owner 交接风险摘要”. It remains display-only and does not expose upload, repair, approval, export, or batch operation behavior.

## Boundaries

This does not create a real upload flow, parser, persistence model, failure-row database, repair action, approval, export, batch operation, or external integration.

## Verification

- `node --test scripts/tests/data-quality-groups.test.mjs`
- `node --test scripts/tests/data-quality.test.mjs`
- local `/data-quality` HTML smoke
- `bash scripts/check-state.sh --strict`
- `git diff --check`
- `bash scripts/check.sh`
