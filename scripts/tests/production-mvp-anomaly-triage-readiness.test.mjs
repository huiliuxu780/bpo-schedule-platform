import assert from "node:assert/strict"
import test from "node:test"

import {
  getNextAnomalyTriageReadinessStep,
  getProductionMvpAnomalyTriageReadinessStep,
  getProductionMvpAnomalyTriageReadinessStepsForAcceptanceItem,
  productionMvpAnomalyTriageReadinessSteps,
  summarizeProductionMvpAnomalyTriageReadiness,
} from "../../lib/production-mvp-anomaly-triage-readiness.ts"

test("production MVP anomaly triage readiness summarizes triage and review preparation", () => {
  const summary = summarizeProductionMvpAnomalyTriageReadiness(
    productionMvpAnomalyTriageReadinessSteps
  )

  assert.equal(summary.stepCount, 5)
  assert.equal(summary.readyToPlanCount, 3)
  assert.equal(summary.requiresGateCount, 2)
  assert.equal(summary.acceptanceItemCount, 2)
  assert.ok(summary.deferredCapabilities.includes("真实复核提交"))
})

test("production MVP anomaly triage readiness keeps review dependencies explicit", () => {
  const nextStep = getNextAnomalyTriageReadinessStep()
  const reviewStep = getProductionMvpAnomalyTriageReadinessStep(
    "review-workflow-readiness"
  )

  assert.equal(nextStep.id, "anomaly-taxonomy-readiness")
  assert.ok(reviewStep)
  assert.deepEqual(reviewStep.dependsOnStepIds, [
    "anomaly-taxonomy-readiness",
    "source-evidence-readiness",
    "triage-attribution-readiness",
  ])
  assert.equal(reviewStep.status, "requires_gate")
})

test("production MVP anomaly triage readiness links anomaly acceptance and source evidence", () => {
  const anomalySteps =
    getProductionMvpAnomalyTriageReadinessStepsForAcceptanceItem(
      "comparison-anomaly"
    )
  const actualSteps =
    getProductionMvpAnomalyTriageReadinessStepsForAcceptanceItem(
      "actual-status"
    )

  assert.deepEqual(
    anomalySteps.map((step) => step.id),
    [
      "anomaly-taxonomy-readiness",
      "source-evidence-readiness",
      "triage-attribution-readiness",
      "review-workflow-readiness",
      "closure-audit-readiness",
    ]
  )
  assert.deepEqual(
    actualSteps.map((step) => step.id),
    ["source-evidence-readiness", "triage-attribution-readiness"]
  )
})
