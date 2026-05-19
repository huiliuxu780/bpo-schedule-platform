import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackAnomalySources,
  getAnomalySourceById,
  summarizeAnomalySources,
} from "../../lib/anomaly-source-drilldown.ts"

test("anomaly source summary traces every first-stage source", () => {
  const summary = summarizeAnomalySources(fallbackAnomalySources)

  assert.equal(summary.totalSources, 5)
  assert.equal(summary.sourceCaseCounts.forecast_schedule, 2)
  assert.equal(summary.sourceCaseCounts.schedule_login, 3)
  assert.equal(summary.sourceCaseCounts.schedule_status, 1)
  assert.equal(summary.sourceCaseCounts.master_data, 1)
  assert.equal(summary.sourceCaseCounts.data_quality, 1)
  assert.ok(summary.totalTriggerConditions >= 12)
  assert.ok(summary.deferredActions.includes("无真实异常计算"))
})

test("schedule login source exposes input objects and trace keys", () => {
  const row = getAnomalySourceById("schedule_login")

  assert.ok(row)
  assert.equal(row.label, "排班 vs 登录")
  assert.ok(row.inputObjects.includes("登录日志"))
  assert.ok(row.alignmentKeys.includes("employee_id"))
  assert.ok(row.traceKeys.includes("login_session_id"))
  assert.deepEqual(row.exampleCaseIds, [
    "AR-202605-003",
    "AR-202605-004",
    "AR-202605-005",
  ])
})
