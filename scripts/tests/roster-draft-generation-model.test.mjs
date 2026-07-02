import assert from "node:assert/strict"
import test from "node:test"

import {
  generateRosterDraftViewModel,
  getRosterDraftTargetMonths,
} from "../../lib/roster-drafts.ts"
import { rosterDraftDemoFixture } from "../../lib/roster-draft-fixtures.ts"

test("roster draft generator copies stable shifts from previous-week same-weekday source", () => {
  const result = generateRosterDraftViewModel({
    fixture: rosterDraftDemoFixture,
    targetMonth: "2026-08",
  })

  const aliceFirstMonday = result.assignments.find(
    (assignment) =>
      assignment.employeeId === "EMP-001" && assignment.businessDate === "2026-08-03"
  )

  assert.equal(result.targetMonth, "2026-08")
  assert.equal(result.copyStrategy, "previous_week_same_weekday")
  assert.equal(aliceFirstMonday?.shiftCode, "A5")
  assert.equal(aliceFirstMonday?.status, "copied")
  assert.equal(aliceFirstMonday?.sourceDate, "2026-07-27")
  assert.equal(aliceFirstMonday?.intervalLabel, "09:00-14:30")
})

test("roster draft generator keeps non-shift annotations out of generated cells", () => {
  const result = generateRosterDraftViewModel({
    fixture: rosterDraftDemoFixture,
    targetMonth: "2026-08",
  })

  assert.ok(
    result.filteredAnnotations.some(
      (item) =>
        item.employeeId === "EMP-001" &&
        item.sourceDate === "2026-07-28" &&
        item.annotationCode === "TEAM-MEETING"
    )
  )
  assert.ok(
    result.monthRows
      .find((row) => row.employeeId === "EMP-001")
      ?.cells.every((cell) => cell.shiftCode !== "TEAM-MEETING")
  )
})

test("roster draft generator separates pending employees and invalid shift exceptions", () => {
  const result = generateRosterDraftViewModel({
    fixture: rosterDraftDemoFixture,
    targetMonth: "2026-08",
  })

  assert.ok(
    result.pendingEmployees.some(
      (pending) =>
        pending.employeeId === "EMP-006" &&
        pending.reason === "new_employee" &&
        pending.teamName.includes("G2")
    )
  )
  assert.ok(
    result.pendingEmployees.some(
      (pending) =>
        pending.employeeId === "EMP-004" &&
        pending.reason === "missing_source_pattern"
    )
  )
  assert.ok(
    result.exceptions.some(
      (exception) =>
        exception.employeeId === "EMP-002" &&
        exception.sourceDate === "2026-07-29" &&
        exception.reason === "invalid_shift_type"
    )
  )
})

test("roster draft generator builds month rows and week detail views", () => {
  const result = generateRosterDraftViewModel({
    fixture: rosterDraftDemoFixture,
    targetMonth: "2026-08",
  })

  assert.equal(result.monthDays.length, 31)
  assert.equal(result.monthRows.length, 6)
  assert.ok(result.monthRows.every((row) => row.cells.length === 31))
  assert.ok(result.weeks.length >= 5)
  assert.equal(result.weeks[0].days[0].date, "2026-08-01")
  assert.ok(
    result.weekDetails.some(
      (detail) =>
        detail.weekId === result.weeks[0].weekId &&
        detail.employeeId === "EMP-001" &&
        detail.sourceDate === "2026-07-27"
    )
  )
})

test("roster draft generator exposes coverage summary and available target months", () => {
  const targetMonths = getRosterDraftTargetMonths(rosterDraftDemoFixture)
  const result = generateRosterDraftViewModel({
    fixture: rosterDraftDemoFixture,
    targetMonth: targetMonths[0],
  })

  assert.deepEqual(targetMonths, ["2026-08", "2026-09"])
  assert.equal(result.summary.targetMonth, "2026-08")
  assert.ok(result.summary.generatedShiftCount > 0)
  assert.ok(result.summary.pendingEmployeeCount >= 2)
  assert.ok(result.summary.exceptionCount >= 1)
  assert.ok(result.summary.filteredAnnotationCount >= 1)
  assert.equal(result.statusLegend.length, 4)
  assert.deepEqual(
    result.statusLegend.map((item) => item.status),
    ["copied", "needs_confirmation", "exception", "filtered_annotation"]
  )
})

test("roster draft generator exposes local forecast and actual interval inputs for gap preview", () => {
  const result = generateRosterDraftViewModel({
    fixture: rosterDraftDemoFixture,
    targetMonth: "2026-08",
  })

  assert.ok(result.forecastIntervals.length >= 3)
  assert.ok(result.actualIntervals.length >= 2)
  assert.deepEqual(result.forecastIntervals[0], {
    id: "FC-2026-08-03-09:00",
    businessDate: "2026-08-03",
    slotLabel: "09:00",
    requiredAgents: 4,
    reason: "本地需求样例，来自当前口径，不代表预测模型",
  })
  assert.deepEqual(result.actualIntervals[0], {
    id: "AC-2026-08-03-09:00",
    businessDate: "2026-08-03",
    slotLabel: "09:00",
    actualAgents: 2,
    sourceLabel: "本地实际到岗样例",
  })
})
