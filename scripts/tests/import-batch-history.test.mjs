import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackImportBatches,
  getImportBatchById,
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
  assert.ok(summary.deferredActions.includes("无真实上传"))
})

test("import batch lookup exposes quality issue traceability", () => {
  const batch = getImportBatchById("BATCH-20260519-002")

  assert.ok(batch)
  assert.equal(batch.templateId, "TPL-PERSONNEL-SCHEDULE")
  assert.ok(batch.qualityIssueIds.includes("DQ-202605-002"))
  assert.ok(batch.errorCodes.includes("shift_type_missing"))
})
