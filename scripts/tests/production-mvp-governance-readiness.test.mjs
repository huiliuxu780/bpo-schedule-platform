import assert from "node:assert/strict"
import test from "node:test"

import {
  getNextGovernanceReadinessStep,
  getProductionMvpGovernanceReadinessStep,
  getProductionMvpGovernanceReadinessStepsForAcceptanceItem,
  getProductionMvpGovernanceReadinessStepsForGap,
  productionMvpGovernanceReadinessSteps,
  summarizeProductionMvpGovernanceReadiness,
} from "../../lib/production-mvp-governance-readiness.ts"

test("production MVP governance readiness summarizes publish freeze and audit boundaries", () => {
  const summary = summarizeProductionMvpGovernanceReadiness(
    productionMvpGovernanceReadinessSteps
  )

  assert.equal(summary.stepCount, 5)
  assert.equal(summary.readyToPlanCount, 2)
  assert.equal(summary.requiresGateCount, 3)
  assert.equal(summary.acceptanceItemCount, 2)
  assert.ok(summary.deferredCapabilities.includes("真实审批流"))
  assert.ok(summary.deferredCapabilities.includes("真实导出"))
})

test("production MVP governance readiness keeps release and audit dependencies explicit", () => {
  const nextStep = getNextGovernanceReadinessStep()
  const auditStep = getProductionMvpGovernanceReadinessStep(
    "audit-evidence-readiness"
  )

  assert.equal(nextStep.id, "schedule-release-state-readiness")
  assert.ok(auditStep)
  assert.deepEqual(auditStep.dependsOnStepIds, [
    "schedule-release-state-readiness",
    "freeze-unfreeze-readiness",
    "permission-boundary-readiness",
  ])
  assert.equal(auditStep.status, "requires_gate")
})

test("production MVP governance readiness links schedule master-data and gap routes", () => {
  const scheduleSteps =
    getProductionMvpGovernanceReadinessStepsForAcceptanceItem(
      "personnel-schedule"
    )
  const masterDataSteps =
    getProductionMvpGovernanceReadinessStepsForAcceptanceItem("master-data")
  const publishGapSteps =
    getProductionMvpGovernanceReadinessStepsForGap(
      "schedule-publish-approval"
    )
  const permissionGapSteps =
    getProductionMvpGovernanceReadinessStepsForGap(
      "permission-audit-boundary"
    )

  assert.deepEqual(
    scheduleSteps.map((step) => step.id),
    ["schedule-release-state-readiness", "freeze-unfreeze-readiness"]
  )
  assert.deepEqual(
    masterDataSteps.map((step) => step.id),
    ["freeze-unfreeze-readiness", "permission-boundary-readiness"]
  )
  assert.deepEqual(
    publishGapSteps.map((step) => step.id),
    ["schedule-release-state-readiness", "freeze-unfreeze-readiness"]
  )
  assert.deepEqual(
    permissionGapSteps.map((step) => step.id),
    [
      "permission-boundary-readiness",
      "audit-evidence-readiness",
      "export-batch-boundary-readiness",
    ]
  )
})
