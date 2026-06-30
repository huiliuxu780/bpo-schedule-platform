import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const projectRoot = join(import.meta.dirname, "../../")

// Test 1: SchedulePlanDraftForm has "use client" directive
test("SchedulePlanDraftForm has 'use client' directive", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(content.includes('"use client"'), "Form must have 'use client' directive")
})

// Test 2: Out-of-scope file does not exist
test("interval-rows-editor.tsx does not exist", () => {
  const outOfScopePath = join(projectRoot, "components/interval-rows-editor.tsx")
  assert.ok(!existsSync(outOfScopePath), "interval-rows-editor.tsx must not exist")
})

// Test 3: All field names exist
test("Form contains all required field names", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  
  assert.ok(content.includes("plan_date"), "Must have plan_date field")
  assert.ok(content.includes("project_name"), "Must have project_name field")
  assert.ok(content.includes("site_name"), "Must have site_name field")
  assert.ok(content.includes("version"), "Must have version field")
  assert.ok(content.includes("plan_id"), "Must have plan_id field")
  assert.ok(content.includes("interval_count"), "Must have interval_count field")
  assert.ok(content.includes("interval_start_"), "Must have interval_start field")
  assert.ok(content.includes("interval_end_"), "Must have interval_end field")
  assert.ok(content.includes("forecast_agents_"), "Must have forecast_agents field")
  assert.ok(content.includes("scheduled_agents_"), "Must have scheduled_agents field")
  assert.ok(content.includes("note_"), "Must have note field")
})

// Test 4: interval_count derived from rows.length
test("interval_count is derived from rows.length", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(content.includes("rows.length"), "interval_count must use rows.length")
})

// Test 5: Add interval button exists
test("Form has '新增时段' button", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(content.includes("新增时段"), "Must have '新增时段' button")
})

// Test 6: Delete button exists
test("Form has '删除' button", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(content.includes("删除"), "Must have '删除' button")
})

// Test 7: Math.max used for gap calculation
test("Form uses Math.max for gap calculation", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(content.includes("Math.max"), "Must use Math.max for gap calculation")
})

// Test 8: rows.length <= 1 protection
test("Form protects last row from deletion", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(content.includes("rows.length <= 1"), "Must protect last row with rows.length <= 1")
})

// Test 9: Summary based on current state
test("Summary is based on current rows state", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(
    content.includes("SchedulePlanDraftSummary") && content.includes("rows.map"),
    "Summary must receive current rows state"
  )
})

// Test 10: No forbidden internal terms in UI files
test("UI files do not contain forbidden internal terms", () => {
  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Qoder", "backend API", "data source"]
  const uiFiles = [
    "components/schedule-plan-draft-form.tsx",
    "components/schedule-plan-draft-summary.tsx"
  ]
  
  for (const file of uiFiles) {
    const content = readFileSync(join(projectRoot, file), "utf-8")
    for (const term of forbiddenTerms) {
      assert.ok(!content.includes(term), `${file} must not contain '${term}'`)
    }
  }
})

// Test 11: No forbidden capability claims
test("UI files do not contain forbidden capability claims", () => {
  const forbiddenClaims = ["自动排班", "自动修复", "审批", "导出", "批量", "结算", "收费"]
  const uiFiles = [
    "components/schedule-plan-draft-form.tsx",
    "components/schedule-plan-draft-summary.tsx"
  ]
  
  for (const file of uiFiles) {
    const content = readFileSync(join(projectRoot, file), "utf-8")
    for (const claim of forbiddenClaims) {
      assert.ok(!content.includes(claim), `${file} must not contain '${claim}'`)
    }
  }
})

// Test 12: SchedulePlanDraftSummary has "use client"
test("SchedulePlanDraftSummary has 'use client' directive", () => {
  const summaryPath = join(projectRoot, "components/schedule-plan-draft-summary.tsx")
  const content = readFileSync(summaryPath, "utf-8")
  assert.ok(content.includes('"use client"'), "Summary must have 'use client' directive")
})

// Test 13: New page does not import external SchedulePlanDraftSummary
test("New page does not import external SchedulePlanDraftSummary", () => {
  const pagePath = join(projectRoot, "app/schedule-plans/new/page.tsx")
  const content = readFileSync(pagePath, "utf-8")
  assert.ok(
    !content.includes('import { SchedulePlanDraftSummary }'),
    "New page must not import SchedulePlanDraftSummary"
  )
})

// Test 14: New page does not render external SchedulePlanDraftSummary
test("New page does not render external SchedulePlanDraftSummary", () => {
  const pagePath = join(projectRoot, "app/schedule-plans/new/page.tsx")
  const content = readFileSync(pagePath, "utf-8")
  assert.ok(
    !content.includes('<SchedulePlanDraftSummary'),
    "New page must not render external SchedulePlanDraftSummary"
  )
})

// Test 15: Edit page does not import external SchedulePlanDraftSummary
test("Edit page does not import external SchedulePlanDraftSummary", () => {
  const pagePath = join(projectRoot, "app/schedule-plans/[planId]/edit/page.tsx")
  const content = readFileSync(pagePath, "utf-8")
  assert.ok(
    !content.includes('import { SchedulePlanDraftSummary }'),
    "Edit page must not import SchedulePlanDraftSummary"
  )
})

// Test 16: Edit page does not render external SchedulePlanDraftSummary
test("Edit page does not render external SchedulePlanDraftSummary", () => {
  const pagePath = join(projectRoot, "app/schedule-plans/[planId]/edit/page.tsx")
  const content = readFileSync(pagePath, "utf-8")
  assert.ok(
    !content.includes('<SchedulePlanDraftSummary'),
    "Edit page must not render external SchedulePlanDraftSummary"
  )
})

// Test 17: New page still uses SchedulePlanDraftForm
test("New page still uses SchedulePlanDraftForm", () => {
  const pagePath = join(projectRoot, "app/schedule-plans/new/page.tsx")
  const content = readFileSync(pagePath, "utf-8")
  assert.ok(
    content.includes('<SchedulePlanDraftForm'),
    "New page must use SchedulePlanDraftForm"
  )
})

// Test 18: Edit page still uses SchedulePlanDraftForm
test("Edit page still uses SchedulePlanDraftForm", () => {
  const pagePath = join(projectRoot, "app/schedule-plans/[planId]/edit/page.tsx")
  const content = readFileSync(pagePath, "utf-8")
  assert.ok(
    content.includes('<SchedulePlanDraftForm'),
    "Edit page must use SchedulePlanDraftForm"
  )
})

// Test 19: Summary displays all required metrics
test("Summary displays interval count, totals, and coverage rate", () => {
  const summaryPath = join(projectRoot, "components/schedule-plan-draft-summary.tsx")
  const content = readFileSync(summaryPath, "utf-8")
  
  assert.ok(content.includes("时段数量"), "Must display interval count")
  assert.ok(content.includes("总预测"), "Must display total forecast")
  assert.ok(content.includes("总已排"), "Must display total scheduled")
  assert.ok(content.includes("总缺口"), "Must display total gap")
  assert.ok(content.includes("覆盖率"), "Must display coverage rate")
})

// ── Packet B: Validation integration tests ──

// Test 20: Form imports validateSchedulePlanDraft
test("Form imports validateSchedulePlanDraft", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(
    content.includes("validateSchedulePlanDraft"),
    "Form must import validateSchedulePlanDraft"
  )
})

// Test 21: Form imports SchedulePlanDraftValidationPanel
test("Form imports SchedulePlanDraftValidationPanel", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(
    content.includes("SchedulePlanDraftValidationPanel"),
    "Form must import SchedulePlanDraftValidationPanel"
  )
})

// Test 22: Form renders validation panel
test("Form renders SchedulePlanDraftValidationPanel", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(
    content.includes("<SchedulePlanDraftValidationPanel"),
    "Form must render SchedulePlanDraftValidationPanel"
  )
})

// Test 23: Submit button is disabled when canSubmit is false
test("Form submit button has disabled attribute", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(
    content.includes("disabled={!validationSummary.canSubmit}") ||
    content.includes('disabled={!validationSummary.canSubmit}'),
    "Submit button must be disabled when canSubmit is false"
  )
})

// Test 24: Form maintains planFieldState for validation
test("Form maintains planFieldState for validation", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(
    content.includes("planFieldState"),
    "Form must maintain planFieldState for validation input"
  )
})

// Test 25: Form calls validation with plan fields and rows
test("Form calls validation with planFieldState and rows", () => {
  const formPath = join(projectRoot, "components/schedule-plan-draft-form.tsx")
  const content = readFileSync(formPath, "utf-8")
  assert.ok(
    content.includes("validateSchedulePlanDraft(planFieldState, rows)"),
    "Form must call validation with planFieldState and rows"
  )
})
