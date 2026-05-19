import assert from "node:assert/strict"
import test from "node:test"

import {
  getNextDataFoundationStep,
  getProductionMvpDataFoundationStep,
  getProductionMvpDataFoundationStepsForAcceptanceItem,
  productionMvpDataFoundationSteps,
  summarizeProductionMvpDataFoundation,
} from "../../lib/production-mvp-data-foundation.ts"

test("production MVP data foundation summarizes readiness steps without production execution", () => {
  const summary = summarizeProductionMvpDataFoundation(
    productionMvpDataFoundationSteps
  )

  assert.equal(summary.stepCount, 5)
  assert.equal(summary.readyToPlanCount, 3)
  assert.equal(summary.requiresGateCount, 2)
  assert.equal(summary.acceptanceItemCount, 2)
  assert.ok(summary.deferredCapabilities.includes("数据库持久化"))
})

test("production MVP data foundation keeps ordered next step and dependencies explicit", () => {
  const nextStep = getNextDataFoundationStep()
  const freezeStep = getProductionMvpDataFoundationStep("binding-freeze-readiness")

  assert.equal(nextStep.id, "import-execution-readiness")
  assert.ok(freezeStep)
  assert.deepEqual(freezeStep.dependsOnStepIds, [
    "master-data-maintenance-readiness",
  ])
  assert.equal(freezeStep.status, "requires_gate")
})

test("production MVP data foundation links upload and master-data acceptance items", () => {
  const uploadSteps = getProductionMvpDataFoundationStepsForAcceptanceItem(
    "upload-import"
  )
  const masterDataSteps = getProductionMvpDataFoundationStepsForAcceptanceItem(
    "master-data"
  )

  assert.deepEqual(
    uploadSteps.map((step) => step.id),
    [
      "import-execution-readiness",
      "field-mapping-readiness",
      "data-quality-traceability-readiness",
    ]
  )
  assert.deepEqual(
    masterDataSteps.map((step) => step.id),
    [
      "master-data-maintenance-readiness",
      "binding-freeze-readiness",
      "data-quality-traceability-readiness",
    ]
  )
})
