import assert from "node:assert/strict"
import test from "node:test"

import {
  fallbackShiftTypes,
  filterShiftTypes,
  getShiftTypeById,
  summarizeShiftTypes,
} from "../../lib/shift-type-catalog.ts"

test("shift type summary exposes active catalog coverage", () => {
  const summary = summarizeShiftTypes(fallbackShiftTypes)

  assert.equal(summary.total, 4)
  assert.equal(summary.active, 3)
  assert.equal(summary.draft, 1)
  assert.equal(summary.withMealBreak, 4)
  assert.equal(summary.totalAssignedPeople, 82)
  assert.ok(summary.totalScheduledHours > 600)
  assert.deepEqual(summary.deferredActions, [
    "无班次规则计算",
    "无自动排班生成",
    "无主数据 CRUD",
    "无冻结解冻",
    "无生产公式",
  ])
})

test("shift type filters keep inactive and project scope local", () => {
  assert.equal(filterShiftTypes(fallbackShiftTypes, { status: "active" }).length, 3)
  assert.equal(filterShiftTypes(fallbackShiftTypes, { project: "Bosch CC" }).length, 4)
})

test("shift type lookup exposes schedule reference fields", () => {
  const row = getShiftTypeById("SHIFT-MORNING-01")

  assert.ok(row)
  assert.equal(row.code, "MORNING_A")
  assert.equal(row.halfHourIntervals, 16)
  assert.ok(row.skillGroups.includes("售前"))
  assert.equal(row.mealWindow, "12:00-13:00")
  assert.equal(row.restWindows.join("、"), "10:30-10:45、15:30-15:45")
  assert.equal(row.countingPolicy, "饭点不计入有效产能，休息不计入登录缺口")
  assert.equal(row.payableHours, 7.5)
})
