# Local Dashboard KPI Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dashboard top filters and imported-data KPI preview usable for localhost demo without database or production formulas.

**Architecture:** Keep the work frontend-local. Reuse `getDemoImportBatches()` and derive lightweight preview rows from imported batch summaries; preserve filter state with dashboard query params so the demo remains explainable after refresh.

**Tech Stack:** Next.js App Router, existing shadcn/ui components, Playwright smoke test, Node test assertions, existing FastAPI demo import endpoint.

---

### Task 1: Seed Dashboard Filter And KPI Assertions

**Files:**
- Modify: `tests/e2e/core-path.spec.ts`
- Modify: `scripts/tests/dashboard-table-model.test.mjs`

- [ ] Add a failing browser assertion that dashboard exposes date, site/team, vendor, and data-version controls and preserves selected values in the URL.
- [ ] Add a failing model assertion for a pure helper that maps imported demo batches into a KPI preview summary: imported source count, imported row count, and latest batch label.
- [ ] Run `npm run e2e:smoke` and `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`; expected result is failure before implementation.

### Task 2: Implement Local Dashboard Filter State

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `components/dashboard-client.tsx`
- Modify or create helper in: `lib/demo-imports.ts` or `components/data-table-model.ts`

- [ ] Parse dashboard `searchParams` for local demo filters.
- [ ] Render compact controls for date, site/team, vendor, and data version using existing UI primitives.
- [ ] Update filter interactions to submit or link back to `/dashboard` with query params; do not introduce client persistence or external data.

### Task 3: Implement Imported Batch KPI Preview

**Files:**
- Modify: `components/dashboard-client.tsx`
- Modify: `components/section-cards.tsx` or a focused dashboard KPI component
- Modify: `lib/demo-imports.ts`

- [ ] Derive local KPI preview from `DemoImportBatchSummary[]`: imported sources, imported rows, latest batch, and attention count.
- [ ] Show an explicit local-demo badge/copy so the preview cannot be confused with production KPI formulas.
- [ ] Keep the static business KPI cards intact where needed; this task adds demo preview context, not production calculation.

### Task 4: Verify And Close Out

**Files:**
- Modify: `docs/current/**`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/task-log.md`
- Modify: `docs/audit-report.md`
- Modify: `docs/dev/branch-log.md`
- Modify: `docs/PROJECT_STATE.md`

- [ ] Run `npm run e2e:smoke`, `node --experimental-strip-types --test scripts/tests/dashboard-table-model.test.mjs`, `bash scripts/check-state.sh --strict --diff=working`, `git diff --check`, and `bash scripts/check.sh`.
- [ ] Close current queue and mark `R141/R142`, `US153/US154`, and `F117/Q043` done only after green verification.
- [ ] Commit the verified scope locally and ask PM before pushing.
