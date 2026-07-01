import assert from "node:assert/strict"
import test from "node:test"

import {
  buildIm276AcceptanceScenario,
  buildIm277AdjustmentScenarios,
  buildIm278GapQueueScenario,
  calculateCoverageResult,
} from "../../lib/wfm-coverage.ts"

test("IM276 scenario treats three people with 2.2 standard capacity as insufficient", () => {
  const { demand, assignments, employees } = buildIm276AcceptanceScenario()

  const result = calculateCoverageResult(demand, assignments, employees)

  assert.equal(result.scopeLabel, "上海职场 / A 项目 / A 组 / 投诉 / 10:00-10:30")
  assert.equal(result.requiredStandardCapacity, 3)
  assert.equal(result.scheduledStandardCapacity, 2.2)
  assert.equal(result.gapStandardCapacity, 0.8)
  assert.equal(result.coveredEmployeeCount, 3)
  assert.equal(result.resultStatus, "insufficient")
  assert.ok(result.reasons.includes("low_capacity_substitution"))
  assert.deepEqual(
    result.contributors.map((item) => [item.employeeName, item.standardCapacityContribution]),
    [
      ["king", 1],
      ["james", 1],
      ["tay", 0.2],
    ]
  )
})

test("employees without the target skill cover time but contribute zero capacity", () => {
  const { demand } = buildIm276AcceptanceScenario()
  const employees = [
    { employeeId: "a", employeeName: "a", skillCapacities: {} },
    { employeeId: "b", employeeName: "b", skillCapacities: {} },
    { employeeId: "c", employeeName: "c", skillCapacities: {} },
  ]
  const assignments = employees.map((employee) => ({
    assignmentId: `assignment-${employee.employeeId}`,
    employeeId: employee.employeeId,
    shiftTypeName: "大白班",
    startTime: "09:00",
    endTime: "18:00",
    plannedSkillName: "投诉",
  }))

  const result = calculateCoverageResult(demand, assignments, employees)

  assert.equal(result.coveredEmployeeCount, 3)
  assert.equal(result.scheduledStandardCapacity, 0)
  assert.equal(result.gapStandardCapacity, 3)
  assert.equal(result.resultStatus, "insufficient")
  assert.ok(result.reasons.includes("skill_mismatch"))
  assert.ok(result.contributors.every((item) => item.standardCapacityContribution === 0))
})

test("shift time coverage controls whether an employee contributes to the interval", () => {
  const { demand, employees } = buildIm276AcceptanceScenario()
  const assignments = [
    {
      assignmentId: "early-only",
      employeeId: "king",
      shiftTypeName: "早班",
      startTime: "09:00",
      endTime: "10:00",
      plannedSkillName: "投诉",
    },
    {
      assignmentId: "target-window",
      employeeId: "james",
      shiftTypeName: "小白班",
      startTime: "10:00",
      endTime: "12:00",
      plannedSkillName: "投诉",
    },
  ]

  const result = calculateCoverageResult(demand, assignments, employees)

  assert.equal(result.coveredEmployeeCount, 1)
  assert.equal(result.scheduledStandardCapacity, 1)
  assert.equal(result.gapStandardCapacity, 2)
  assert.deepEqual(result.contributors.map((item) => item.employeeName), ["james"])
})

test("IM277 draft adjustments recalculate capacity gap without changing demand", () => {
  const scenarios = buildIm277AdjustmentScenarios()

  assert.equal(scenarios.initial.coverage.scheduledStandardCapacity, 2.2)
  assert.equal(scenarios.initial.coverage.gapStandardCapacity, 0.8)
  assert.equal(scenarios.initial.coverage.coveredEmployeeCount, 3)

  assert.equal(scenarios.tayMovedOut.coverage.scheduledStandardCapacity, 2)
  assert.equal(scenarios.tayMovedOut.coverage.gapStandardCapacity, 1)
  assert.deepEqual(
    scenarios.tayMovedOut.coverage.contributors.map((item) => item.employeeName),
    ["king", "james"]
  )

  assert.equal(scenarios.alexAdded.coverage.coveredEmployeeCount, 4)
  assert.equal(scenarios.alexAdded.coverage.scheduledStandardCapacity, 2.2)
  assert.equal(scenarios.alexAdded.coverage.gapStandardCapacity, 0.8)
  assert.equal(
    scenarios.alexAdded.coverage.contributors.find((item) => item.employeeName === "alex")
      ?.standardCapacityContribution,
    0
  )
  assert.ok(scenarios.alexAdded.coverage.reasons.includes("skill_mismatch"))

  assert.equal(scenarios.lilyAdded.coverage.scheduledStandardCapacity, 3)
  assert.equal(scenarios.lilyAdded.coverage.gapStandardCapacity, 0)
  assert.equal(scenarios.lilyAdded.coverage.resultStatus, "satisfied")
})

test("IM278 gap queue sorts half-hour intervals by standard capacity gap", () => {
  const scenario = buildIm278GapQueueScenario()

  assert.equal(scenario.demands.length, 3)
  assert.deepEqual(
    scenario.queueItems.map((item) => item.intervalLabel),
    ["10:30-11:00", "10:00-10:30", "11:00-11:30"]
  )

  const topGap = scenario.queueItems[0]
  assert.equal(topGap.intervalLabel, "10:30-11:00")
  assert.equal(topGap.coverage.scheduledStandardCapacity, 2)
  assert.equal(topGap.coverage.gapStandardCapacity, 1)
  assert.equal(topGap.statusLabel, "优先补位")
  assert.ok(topGap.coverage.reasons.includes("standard_capacity_gap"))
  assert.ok(topGap.coverage.reasons.includes("skill_mismatch"))

  const baseContract = scenario.queueItems.find(
    (item) => item.intervalLabel === "10:00-10:30"
  )
  assert.equal(baseContract.coverage.coveredEmployeeCount, 3)
  assert.equal(baseContract.coverage.scheduledStandardCapacity, 2.2)
  assert.equal(baseContract.coverage.gapStandardCapacity, 0.8)

  const satisfied = scenario.queueItems.find(
    (item) => item.intervalLabel === "11:00-11:30"
  )
  assert.equal(satisfied.coverage.scheduledStandardCapacity, 3)
  assert.equal(satisfied.coverage.gapStandardCapacity, 0)
  assert.equal(satisfied.coverage.resultStatus, "satisfied")
  assert.equal(satisfied.statusLabel, "已满足")
})
