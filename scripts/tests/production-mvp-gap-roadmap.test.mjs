import assert from "node:assert/strict"
import test from "node:test"

import {
  getProductionMvpGap,
  getProductionMvpGapsForAcceptanceItem,
  getRecommendedNextRoadmapBatch,
  productionMvpGaps,
  productionMvpRoadmapBatches,
  summarizeProductionMvpGaps,
} from "../../lib/production-mvp-gap-roadmap.ts"

test("production MVP gap roadmap prioritizes the first production blockers", () => {
  const summary = summarizeProductionMvpGaps(productionMvpGaps)

  assert.equal(summary.total, 8)
  assert.equal(summary.priorityCounts.P0, 3)
  assert.equal(summary.priorityCounts.P1, 3)
  assert.equal(summary.priorityCounts.P2, 2)
  assert.ok(summary.highRiskGapIds.includes("actual-log-integration"))
})

test("production MVP gaps keep acceptance checklist traceability", () => {
  const uploadGaps = getProductionMvpGapsForAcceptanceItem("upload-import")
  const scheduleGap = getProductionMvpGap("schedule-publish-approval")

  assert.deepEqual(
    uploadGaps.map((gap) => gap.id),
    ["upload-import-execution", "field-mapping-persistence"]
  )
  assert.ok(scheduleGap)
  assert.ok(scheduleGap.acceptanceItemIds.includes("personnel-schedule"))
  assert.equal(scheduleGap.status, "later")
})

test("production MVP roadmap recommends the first batch only when dependencies are clear", () => {
  const nextBatch = getRecommendedNextRoadmapBatch()

  assert.equal(nextBatch.id, "batch-01-data-foundation")
  assert.deepEqual(nextBatch.gapIds, [
    "upload-import-execution",
    "master-data-maintenance",
    "field-mapping-persistence",
  ])
  assert.equal(productionMvpRoadmapBatches.length, 3)
  assert.ok(
    productionMvpRoadmapBatches
      .at(-1)
      ?.dependsOnBatchIds.includes("batch-02-actual-alignment")
  )
})
