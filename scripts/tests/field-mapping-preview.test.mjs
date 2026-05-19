import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackFieldMappings,
  groupFieldMappingsByTemplate,
  mappingStatusLabel,
  summarizeFieldMappings,
} from "../../lib/field-mapping-preview.ts"

test("field mapping summary identifies missing and warning fields", () => {
  const summary = summarizeFieldMappings(fallbackFieldMappings)

  assert.equal(summary.total, 9)
  assert.equal(summary.missing, 1)
  assert.equal(summary.warning, 2)
  assert.equal(summary.required, 7)
  assert.equal(summary.templates.length, 5)
  assert.ok(summary.deferredActions.includes("无映射保存"))
})

test("field mappings group by import template", () => {
  const groups = groupFieldMappingsByTemplate(fallbackFieldMappings)

  assert.equal(groups["主数据模板"].length, 3)
  assert.equal(groups["需求预测模板"].length, 2)
  assert.equal(mappingStatusLabel("missing"), "缺失")
})
