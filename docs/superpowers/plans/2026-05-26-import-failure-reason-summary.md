# Import Failure Reason Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a local read-only failure reason summary on import batch detail pages.

**Architecture:** The frontend model aggregates `ImportBatch.failureRows` by `errorCode` and `fieldName`. The detail page renders the derived summary before the existing failed-row list without adding backend behavior.

**Tech Stack:** Next.js server component, TypeScript model utilities, Node test runner.

---

## File Structure

- Modify `lib/import-batch-history.ts`: add failure reason summary types and aggregation helper.
- Modify `scripts/tests/import-batch-history.test.mjs`: add red-green tests for grouped and empty summaries.
- Modify `app/import-batches/[batchId]/page.tsx`: render the summary card.
- Modify Harness docs and logs for traceability.

## Tasks

### Task 1: State And Trace

- [ ] Add `US500-US502` to `docs/current/STORY_QUEUE.yaml`.
- [ ] Add `F372/Q090` to `docs/current/ACTIVE_TASKS.yaml`.
- [ ] Add requirements, stories, backlog entries, trace index mappings, spec, and plan.
- [ ] Run `bash scripts/check-state.sh --strict`.

### Task 2: Model Red-Green

- [ ] Write failing tests for grouped failure reason summary and empty state.
- [ ] Run `node --test scripts/tests/import-batch-history.test.mjs`; expected failure is missing summary helper.
- [ ] Add summary helper and types in `lib/import-batch-history.ts`.
- [ ] Rerun model tests; expected pass.

### Task 3: Page Integration

- [ ] Add failure reason summary card to `app/import-batches/[batchId]/page.tsx`.
- [ ] Run `npm run typecheck`; expected pass.
- [ ] Start dev server, create a failed status-log batch, and browser-smoke the detail page.

### Task 4: Closeout

- [ ] Update audit, task log, branch log, current queue cleanup, and project state.
- [ ] Run final `bash scripts/check-state.sh --strict`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Commit locally with `F372-Q090 add import failure reason summary`.
