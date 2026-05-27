import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  buildCsvImportPreview,
  csvImportTypeOptions,
  csvImportTypeLabel,
} from "../../lib/csv-import-preview.ts"

test("csv import preview counts rows and maps demand forecast fields", () => {
  const preview = buildCsvImportPreview({
    importType: "demand-forecast",
    fileName: "forecast.csv",
    csvContent:
      "business_date,workplace_id,project_id,interval_start,interval_end,forecast_agents\n2026-05-11,SH,P1,09:00,09:30,12\n2026-05-11,SH,P1,09:30,10:00,14",
  })

  assert.equal(preview.fileName, "forecast.csv")
  assert.equal(preview.typeLabel, "需求预测")
  assert.equal(preview.totalRows, 2)
  assert.equal(preview.detectedFields.length, 6)
  assert.equal(preview.missingRequiredFields.length, 0)
  assert.equal(preview.mappedFields.length, 6)
  assert.ok(preview.pendingValidationFields.includes("forecast_agents"))
})

test("csv import preview identifies missing master data headers", () => {
  const preview = buildCsvImportPreview({
    importType: "master-data",
    fileName: "master_data.csv",
    csvContent:
      "employee_id,workplace_id,project_id,effective_from\nA-1001,SH,P1,2026-05-01",
  })

  assert.equal(csvImportTypeLabel("master-data"), "主数据")
  assert.ok(csvImportTypeOptions.some((option) => option.id === "master-data"))
  assert.equal(preview.totalRows, 1)
  assert.ok(preview.missingRequiredFields.includes("supplier_id"))
  assert.ok(preview.missingRequiredFields.includes("skill_group"))
  assert.equal(preview.warningFields.length, 0)
})

test("csv import preview keeps empty files in preview state", () => {
  const preview = buildCsvImportPreview({
    importType: "status-log",
    fileName: "empty.csv",
    csvContent: "",
  })

  assert.equal(preview.totalRows, 0)
  assert.deepEqual(preview.detectedFields, [])
  assert.ok(preview.missingRequiredFields.includes("employee_id"))
})

test("new import batch page exposes upload preview before import", () => {
  const pageSource = readFileSync("app/import-batches/new/page.tsx", "utf8")
  const actionSource = readFileSync("app/import-batches/new/actions.ts", "utf8")
  const previewSource = readFileSync("lib/csv-import-preview.ts", "utf8")
  const formSource = readFileSync(
    "app/import-batches/new/import-csv-preview-form.tsx",
    "utf8"
  )

  assert.ok(previewSource.includes("master-data"))
  assert.ok(pageSource.includes("ImportCsvPreviewForm"))
  assert.ok(actionSource.includes("previewCsvImportAction"))
  assert.ok(actionSource.includes("buildCsvImportPreview"))
  assert.ok(formSource.includes("字段映射预览"))
  assert.ok(formSource.includes("待校验字段"))
  assert.ok(formSource.includes("提交导入"))
})
