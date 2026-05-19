import assert from "node:assert/strict"
import test from "node:test"

import { productionMvpAcceptanceItems } from "../../lib/production-mvp-acceptance.ts"
import {
  productionMvpProgressAreas,
  summarizeProductionMvpProgress,
} from "../../lib/production-mvp-progress.ts"

test("production MVP progress summarizes local route coverage", () => {
  const summary = summarizeProductionMvpProgress(
    productionMvpProgressAreas,
    productionMvpAcceptanceItems
  )

  assert.equal(summary.areaCount, 3)
  assert.equal(summary.localRouteCount, 14)
  assert.equal(summary.coveredItemCount, 3)
  assert.equal(summary.partialItemCount, 3)
})

test("production MVP progress keeps production gaps explicit", () => {
  const summary = summarizeProductionMvpProgress(
    productionMvpProgressAreas,
    productionMvpAcceptanceItems
  )

  assert.equal(summary.followUpGapCount, 11)
  assert.ok(summary.deferredCapabilityCount >= 15)
})
