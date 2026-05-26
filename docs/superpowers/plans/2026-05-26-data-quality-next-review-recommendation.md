# Data Quality Next Review Recommendation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local read-only next-review recommendation summary to the data quality overview.

**Architecture:** Build a small model helper on top of the existing gap owner/source pressure summary, then render a compact recommendation card in the existing `/data-quality` page.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript model helpers, Node test runner.

---

### Task 1: Red Test

**Files:**
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Add failing import and tests for `summarizeDataQualityNextReviewRecommendation`.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.
- [ ] Confirm failure is the missing export.

### Task 2: Model

**Files:**
- Modify: `lib/data-quality.ts`

- [ ] Add recommendation item and summary types.
- [ ] Implement `summarizeDataQualityNextReviewRecommendation(rows)` using `summarizeDataQualityGapOwnerSourcePressure(rows)`.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs` and confirm pass.

### Task 3: Page

**Files:**
- Modify: `app/data-quality/page.tsx`
- Modify: `scripts/tests/data-quality.test.mjs`

- [ ] Import and compute the recommendation summary.
- [ ] Render “缺口下一轮复核建议” after the owner/source pressure card.
- [ ] Add page source assertions for the function, title, and “查看建议问题”.
- [ ] Run target tests.

### Task 4: Verification And Closeout

**Files:**
- Modify: `docs/current/**`
- Modify: `docs/registry/TRACE_INDEX.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`

- [ ] Smoke `/data-quality` for the new Chinese card text and no-action boundaries.
- [ ] Clear current queue and active tasks.
- [ ] Mark legacy stories/tasks done.
- [ ] Run `node --test scripts/tests/data-quality.test.mjs`.
- [ ] Run `node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs`.
- [ ] Run `bash scripts/check-state.sh --strict`.
- [ ] Run `git diff --check`.
- [ ] Run `bash scripts/check.sh`.
- [ ] Commit with `F389-Q107 add data quality next review recommendation`.
