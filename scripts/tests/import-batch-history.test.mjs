import assert from "node:assert/strict"
import test from "node:test"

import { fallbackDataQualityIssues } from "../../lib/data-quality.ts"
import {
  createLoginLogImportBatch,
  createPersonnelScheduleImportBatch,
  fallbackImportBatches,
  getImportBatchQualityIssues,
  getImportBatchById,
  mapImportBatchResult,
  summarizeImportBatchFailureImpacts,
  summarizeImportBatches,
} from "../../lib/import-batch-history.ts"

test("import batch summary counts local batch outcomes", () => {
  const summary = summarizeImportBatches(fallbackImportBatches)

  assert.equal(summary.total, 4)
  assert.equal(summary.completed, 2)
  assert.equal(summary.failed, 1)
  assert.equal(summary.pendingReview, 1)
  assert.equal(summary.failedRows, 439)
  assert.ok(summary.failureRate > 0.25)
  assert.ok(summary.deferredActions.includes("无生产数据库留存"))
})

test("import batch lookup exposes quality issue traceability", () => {
  const batch = getImportBatchById("BATCH-20260519-002")

  assert.ok(batch)
  assert.equal(batch.templateId, "TPL-PERSONNEL-SCHEDULE")
  assert.ok(batch.qualityIssueIds.includes("DQ-202605-002"))
  assert.ok(batch.errorCodes.includes("shift_type_missing"))
})

test("import batch detail resolves related quality issues and failure impact", () => {
  const issues = getImportBatchQualityIssues(
    "BATCH-20260519-001",
    fallbackDataQualityIssues
  )
  const impacts = summarizeImportBatchFailureImpacts("BATCH-20260519-001")

  assert.equal(issues.length, 2)
  assert.equal(issues[0].sourceTemplateId, "TPL-MASTER-DATA")
  assert.ok(issues.some((issue) => issue.id === "DQ-202605-004"))
  assert.equal(impacts.totalAffectedRows, 67)
  assert.ok(impacts.items.some((item) => item.businessImpact.includes("排班")))
})

test("import batch result maps local csv import failure rows", () => {
  const batch = mapImportBatchResult({
    batch_id: "BATCH-DF-20260525-001",
    entity: "demand_forecast",
    file_name: "demand_forecast_test.csv",
    uploaded_by: "数据管理员",
    uploaded_at: "2026-05-25T16:40:00+08:00",
    status: "completed_with_errors",
    total_rows: 2,
    success_rows: 1,
    failed_rows: 1,
    warning_rows: 0,
    error_codes: ["missing_required_field"],
    failure_rows: [
      {
        batch_id: "BATCH-DF-20260525-001",
        entity: "demand_forecast",
        failed_row_number: 3,
        field_name: "forecast_agents",
        error_code: "missing_required_field",
        error_message: "需求预测导入必填字段为空",
        raw_value: "",
      },
    ],
  })

  assert.equal(batch.id, "BATCH-DF-20260525-001")
  assert.equal(batch.templateId, "TPL-DEMAND-FORECAST")
  assert.equal(batch.templateName, "需求预测模板")
  assert.equal(batch.sourceFile, "demand_forecast_test.csv")
  assert.equal(batch.owner, "数据管理员")
  assert.equal(batch.uploadedAt, "2026-05-25 16:40")
  assert.equal(batch.status, "completed_with_errors")
  assert.deepEqual(batch.errorCodes, ["missing_required_field"])
  assert.equal(batch.failureRows.length, 1)
  assert.equal(batch.failureRows[0].failedRowNumber, 3)
  assert.equal(batch.failureRows[0].fieldName, "forecast_agents")
  assert.equal(batch.failureRows[0].errorMessage, "需求预测导入必填字段为空")
})

test("personnel schedule import result maps template and failure impact", () => {
  const batch = mapImportBatchResult({
    batch_id: "BATCH-PS-20260525-001",
    entity: "personnel_schedule",
    file_name: "personnel_schedule_test.csv",
    uploaded_by: "排班运营",
    uploaded_at: "2026-05-25T17:10:00+08:00",
    status: "completed_with_errors",
    total_rows: 2,
    success_rows: 1,
    failed_rows: 1,
    warning_rows: 0,
    error_codes: ["invalid_time_range"],
    failure_rows: [
      {
        batch_id: "BATCH-PS-20260525-001",
        entity: "personnel_schedule",
        failed_row_number: 3,
        field_name: "end_at",
        error_code: "invalid_time_range",
        error_message: "排班结束时间必须晚于开始时间",
        raw_value: "09:00",
      },
    ],
  })

  assert.equal(batch.templateId, "TPL-PERSONNEL-SCHEDULE")
  assert.equal(batch.templateName, "人员级排班模板")
  assert.deepEqual(batch.affectedObjects, ["人员级排班", "0.5h 时段汇总"])
  assert.equal(batch.failureRows[0].fieldName, "end_at")
  assert.ok(batch.failureImpacts[0].businessImpact.includes("人员级排班"))
  assert.equal(typeof createPersonnelScheduleImportBatch, "function")
})

test("login log import result maps template and failure impact", () => {
  const batch = mapImportBatchResult({
    batch_id: "BATCH-LL-20260525-001",
    entity: "login_log",
    file_name: "login_log_test.csv",
    uploaded_by: "现场主管",
    uploaded_at: "2026-05-25T17:40:00+08:00",
    status: "completed_with_errors",
    total_rows: 2,
    success_rows: 1,
    failed_rows: 1,
    warning_rows: 0,
    error_codes: ["invalid_time_range"],
    failure_rows: [
      {
        batch_id: "BATCH-LL-20260525-001",
        entity: "login_log",
        failed_row_number: 3,
        field_name: "logout_at",
        error_code: "invalid_time_range",
        error_message: "登出时间必须晚于登录时间",
        raw_value: "2026-05-26T09:00:00",
      },
    ],
  })

  assert.equal(batch.templateId, "TPL-LOGIN-LOG")
  assert.equal(batch.templateName, "登录日志模板")
  assert.deepEqual(batch.affectedObjects, ["登录日志", "人员时间轴", "履约对比"])
  assert.equal(batch.failureRows[0].fieldName, "logout_at")
  assert.ok(batch.failureImpacts[0].businessImpact.includes("登录日志"))
  assert.equal(typeof createLoginLogImportBatch, "function")
})

test("import batch summary includes process-memory csv results", () => {
  const csvBatch = mapImportBatchResult({
    batch_id: "BATCH-DF-20260525-002",
    entity: "demand_forecast",
    file_name: "demand_forecast_success.csv",
    uploaded_by: "数据管理员",
    uploaded_at: "2026-05-25T16:45:00+08:00",
    status: "completed",
    total_rows: 2,
    success_rows: 2,
    failed_rows: 0,
    warning_rows: 0,
    error_codes: [],
    failure_rows: [],
  })
  const summary = summarizeImportBatches([csvBatch, ...fallbackImportBatches])

  assert.equal(summary.total, 5)
  assert.equal(summary.completed, 3)
  assert.equal(summary.totalRows, 1518)
  assert.equal(summary.failedRows, 439)
})
