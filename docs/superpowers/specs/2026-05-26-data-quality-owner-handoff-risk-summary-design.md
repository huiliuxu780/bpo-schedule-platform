# Data Quality Owner Handoff Risk Summary Design

## Goal

Add a local read-only data quality summary that turns each group-step owner handoff item into supervisor-facing risk and blocker wording.

## Scope

- Add a frontend model helper in `lib/data-quality-groups.ts`.
- Add a data quality overview card in `app/data-quality/page.tsx`.
- Add model and page source tests.
- Update Harness traceability and audit files.

## Behavior

The summary is based on `summarizeDataQualityGroupStepOwnerHandoffBrief()`. Each risk item keeps the owner, representative issue, primary person, related groups, issue link, person link, impacted people, and next-view hint. It adds blocker reasons that explain why the handoff may stall, using existing local read-only fields:

- missing or unclear representative person
- multiple impacted people behind one owner
- multiple related groups behind one owner
- unresolved issue handoff context

The page card appears after “分组步骤 owner 交接摘要” and before the owner/person load card. It shows counts, first risk item, risk reasons, issue/person links, next-view hint, and deferred actions.

## Boundaries

This is not a workflow engine. It does not write review results, close exceptions, upload evidence, approve work, export reports, batch edit, connect external systems, or persist data.

## Verification

- `node --test scripts/tests/data-quality-groups.test.mjs`
- `node --test scripts/tests/data-quality.test.mjs`
- local `/data-quality` HTML smoke
- `bash scripts/check-state.sh --strict`
- `git diff --check`
- `bash scripts/check.sh`
