import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackReviewTimelineSteps,
  getReviewTimelineStep,
  summarizeReviewTimeline,
} from "../../lib/review-status-timeline.ts"

test("review timeline summary keeps the closed-loop order visible", () => {
  const summary = summarizeReviewTimeline(fallbackReviewTimelineSteps)

  assert.equal(summary.totalSteps, 5)
  assert.equal(summary.totalEvidenceItems, 15)
  assert.equal(summary.totalExampleCases, 9)
  assert.deepEqual(
    fallbackReviewTimelineSteps.map((step) => step.id),
    ["identified", "assigned", "reviewing", "confirmed", "closed"]
  )
  assert.ok(summary.deferredActions.includes("无复核提交"))
})

test("review timeline step lookup exposes owner and transition evidence", () => {
  const step = getReviewTimelineStep("reviewing")

  assert.ok(step)
  assert.equal(step.owner, "责任人")
  assert.ok(step.evidence.includes("人员时间轴"))
  assert.ok(step.exampleCaseIds.includes("AR-202605-005"))
})
