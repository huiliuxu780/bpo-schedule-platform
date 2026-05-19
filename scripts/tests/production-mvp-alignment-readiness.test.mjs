import assert from "node:assert/strict"
import test from "node:test"

import {
  getNextAlignmentReadinessStep,
  getProductionMvpAlignmentReadinessStep,
  getProductionMvpAlignmentReadinessStepsForAcceptanceItem,
  productionMvpAlignmentReadinessSteps,
  summarizeProductionMvpAlignmentReadiness,
} from "../../lib/production-mvp-alignment-readiness.ts"

test("production MVP alignment readiness summarizes forecast and actual-log preparation", () => {
  const summary = summarizeProductionMvpAlignmentReadiness(
    productionMvpAlignmentReadinessSteps
  )

  assert.equal(summary.stepCount, 5)
  assert.equal(summary.readyToPlanCount, 3)
  assert.equal(summary.requiresGateCount, 2)
  assert.equal(summary.acceptanceItemCount, 3)
  assert.ok(summary.deferredCapabilities.includes("真实登录系统接入"))
})

test("production MVP alignment readiness keeps ordered baseline dependencies explicit", () => {
  const nextStep = getNextAlignmentReadinessStep()
  const comparisonStep = getProductionMvpAlignmentReadinessStep(
    "comparison-baseline-readiness"
  )

  assert.equal(nextStep.id, "forecast-version-readiness")
  assert.ok(comparisonStep)
  assert.deepEqual(comparisonStep.dependsOnStepIds, [
    "forecast-version-readiness",
    "login-log-readiness",
    "status-log-readiness",
  ])
  assert.equal(comparisonStep.status, "ready_to_plan")
})

test("production MVP alignment readiness links forecast actual and anomaly acceptance items", () => {
  const forecastSteps = getProductionMvpAlignmentReadinessStepsForAcceptanceItem(
    "demand-forecast"
  )
  const actualSteps = getProductionMvpAlignmentReadinessStepsForAcceptanceItem(
    "actual-status"
  )
  const anomalySteps = getProductionMvpAlignmentReadinessStepsForAcceptanceItem(
    "comparison-anomaly"
  )

  assert.deepEqual(
    forecastSteps.map((step) => step.id),
    ["forecast-version-readiness", "comparison-baseline-readiness"]
  )
  assert.deepEqual(
    actualSteps.map((step) => step.id),
    [
      "login-log-readiness",
      "status-log-readiness",
      "status-code-mapping-readiness",
      "comparison-baseline-readiness",
    ]
  )
  assert.deepEqual(
    anomalySteps.map((step) => step.id),
    ["comparison-baseline-readiness"]
  )
})
