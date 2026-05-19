import assert from "node:assert/strict"
import test from "node:test"

import {
  productionMvpAcceptanceItems,
  summarizeProductionMvpAcceptance,
} from "../../lib/production-mvp-acceptance.ts"

test("production MVP acceptance checklist covers first-stage business lanes", () => {
  const lanes = productionMvpAcceptanceItems.map((item) => item.lane)

  assert.deepEqual(lanes, [
    "上传/导入",
    "主数据",
    "排班",
    "需求预测",
    "登录/状态",
    "差异对比与异常识别",
  ])
})

test("production MVP acceptance summary distinguishes covered and partial scope", () => {
  const summary = summarizeProductionMvpAcceptance(productionMvpAcceptanceItems)

  assert.equal(summary.total, 6)
  assert.equal(summary.covered, 3)
  assert.equal(summary.partial, 3)
  assert.equal(summary.deferred, 0)
  assert.ok(summary.evidenceRouteCount >= 12)
})

test("production MVP acceptance keeps deferred production capabilities explicit", () => {
  const summary = summarizeProductionMvpAcceptance(productionMvpAcceptanceItems)

  assert.ok(summary.deferredCapabilities.includes("真实上传"))
  assert.ok(summary.deferredCapabilities.includes("自动排班"))
  assert.ok(summary.deferredCapabilities.includes("审批流"))
  assert.ok(summary.deferredCapabilities.includes("状态规则公式"))
})
