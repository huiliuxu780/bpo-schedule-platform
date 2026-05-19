import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackImportTemplates,
  getImportTemplateById,
  importTemplateKindLabel,
  summarizeImportTemplates,
} from "../../lib/import-template-guide.ts"

test("import template summary covers the first-stage upload tables", () => {
  const summary = summarizeImportTemplates(fallbackImportTemplates)

  assert.equal(summary.total, 5)
  assert.deepEqual(summary.templateKinds, [
    "master_data",
    "personnel_schedule",
    "demand_forecast",
    "login_log",
    "status_log",
  ])
  assert.ok(summary.totalRequiredFields >= 30)
  assert.ok(summary.totalValidationRules >= 15)
  assert.ok(summary.deferredActions.includes("无真实上传"))
})

test("personnel schedule template defines half-hour expansion inputs", () => {
  const row = getImportTemplateById("TPL-PERSONNEL-SCHEDULE")

  assert.ok(row)
  assert.equal(row.name, "人员级排班模板")
  assert.ok(row.requiredFields.includes("shift_type_code"))
  assert.ok(row.validationRules.includes("可展开为 0.5h 时段"))
  assert.ok(row.downstreamUse.includes("时段排班汇总"))
})

test("template labels are business-facing while keys stay stable", () => {
  assert.equal(importTemplateKindLabel("demand_forecast"), "需求预测")
})
