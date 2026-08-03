# Version Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first read-only `/data-quality/versions` version ledger page under data quality so import admins can scan the current business-version context without opening batches one by one.

**Architecture:** Keep this slice frontend-only. Reuse the existing import-batch list API and the import-center model layer to derive one ledger row per business domain, then render a dedicated workbench page and sidebar entry. Leave stable deep links and downstream impact counts to the next two queued slices.

**Tech Stack:** Next.js App Router, existing shadcn/ui components, import-center model helpers, Node test runner for model tests.

---

### Task 1: Seed R787 / US707 / IM087-089 In Harness

**Files:**
- Create: `docs/superpowers/plans/2026-06-03-version-workbench-implementation-plan.md`
- Modify: `docs/current/STORY_QUEUE.yaml`
- Modify: `docs/current/ACTIVE_TASKS.yaml`
- Modify: `docs/current/PROJECT_CONTEXT.md`
- Modify: `docs/raw-requirements.md`
- Modify: `docs/user-stories.md`
- Modify: `tasks/backlog.yaml`
- Modify: `docs/registry/TRACE_INDEX.yaml`

- [ ] **Step 1: Add the approved requirement chain**

```yaml
R787 -> US707 -> IM087
R788 -> US708 -> IM088
R789 -> US709 -> IM089
```

- [ ] **Step 2: Put only IM087 into current ready state**

```yaml
stories:
  - id: US707
    status: ready
tasks:
  - id: IM087
    status: ready
```

- [ ] **Step 3: Run state verification**

Run: `bash scripts/check-state.sh --strict`
Expected: `check-state passed in strict mode.`

### Task 2: Add Version Workbench Model Coverage

**Files:**
- Modify: `components/import-center-model.ts`
- Modify: `scripts/tests/import-center-model.test.mjs`

- [ ] **Step 1: Write the failing tests**

```js
test("version workbench summarizes latest current version rows by business domain", () => {
  const summary = summarizeImportVersionWorkbench({
    batches: [
      { ...baseBatch, batch_id: "BATCH-MD-APPLIED", file_type: "master_data", application_status: "applied", import_version_id: "BATCH-MD-APPLIED::v1", uploaded_at: "2026-06-03T09:00:00+08:00" },
      { ...baseBatch, batch_id: "BATCH-SCH-BLOCKED", file_type: "personnel_schedule", application_status: "not_applied", import_version_id: "BATCH-SCH-BLOCKED::v1", uploaded_at: "2026-06-03T10:00:00+08:00" },
    ],
    filters: {},
  });

  assert.equal(summary.rows.find((row) => row.domainKey === "master_data")?.tone, "ready");
  assert.equal(summary.rows.find((row) => row.domainKey === "personnel_schedule")?.tone, "blocked");
  assert.equal(summary.rows.find((row) => row.domainKey === "demand_forecast")?.tone, "empty");
});
```

- [ ] **Step 2: Verify RED**

Run: `node scripts/tests/import-center-model.test.mjs`
Expected: FAIL because `summarizeImportVersionWorkbench` is not exported yet.

- [ ] **Step 3: Implement minimal ledger helpers**

```ts
export function summarizeImportVersionWorkbench(...) {
  // one current row per business domain
  // latest applied batch wins; otherwise latest observed batch becomes blocked/empty context
}
```

- [ ] **Step 4: Verify GREEN**

Run: `node scripts/tests/import-center-model.test.mjs`
Expected: PASS with the new workbench tests included.

### Task 3: Build `/data-quality/versions` And Sidebar Entry

**Files:**
- Create: `app/data-quality/versions/page.tsx`
- Create: `components/import-center-version-workbench.tsx`
- Modify: `components/app-sidebar.tsx`
- Modify: `components/import-center-model.ts`

- [ ] **Step 1: Write the failing page-level test through model expectations**

```js
test("version workbench row builds a batch-detail entry for ready and blocked rows", () => {
  const summary = summarizeImportVersionWorkbench({
    batches: [{ ...baseBatch, batch_id: "BATCH-FC-001", file_type: "demand_forecast", application_status: "applied", import_version_id: "BATCH-FC-001::v1" }],
    filters: {},
  });

  const row = summary.rows.find((item) => item.domainKey === "demand_forecast");
  assert.equal(row?.primaryActionHref, "/data-quality/BATCH-FC-001");
});
```

- [ ] **Step 2: Implement the page and workspace**

```tsx
<AppShell title="业务版本工作台" searchPlaceholder="搜索版本、批次或业务日">
  <ImportCenterVersionWorkbench batches={batches} filters={filters} error={batchError} />
</AppShell>
```

- [ ] **Step 3: Expose the navigation entry**

```ts
{ title: "业务版本", href: "/data-quality/versions", activeMatch: "prefix", tag: "P1" }
```

- [ ] **Step 4: Verify**

Run:

```bash
node scripts/tests/import-center-model.test.mjs
bash scripts/check-state.sh --strict
git diff --check
BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add app/data-quality/versions/page.tsx components/import-center-version-workbench.tsx components/app-sidebar.tsx components/import-center-model.ts scripts/tests/import-center-model.test.mjs docs/current/STORY_QUEUE.yaml docs/current/ACTIVE_TASKS.yaml docs/current/PROJECT_CONTEXT.md docs/raw-requirements.md docs/user-stories.md tasks/backlog.yaml docs/registry/TRACE_INDEX.yaml docs/PROJECT_STATE.md docs/dev/branch-log.md docs/superpowers/plans/2026-06-03-version-workbench-implementation-plan.md
git commit -m "feat: add version workbench ledger"
```

## Self-Review

- The plan keeps IM087 frontend-only and leaves stable deep links and downstream impact counts for IM088 and IM089.
- The plan reuses existing import-batch contracts and does not introduce backend, schema, or dependency scope.
- Current-state seeding is explicit before any product implementation.
