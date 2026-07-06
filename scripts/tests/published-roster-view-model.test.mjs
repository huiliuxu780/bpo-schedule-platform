import assert from "node:assert/strict"
import test from "node:test"

import { rosterDraftDemoFixture } from "../../lib/roster-draft-fixtures.ts"
import { generateRosterDraftViewModel } from "../../lib/roster-drafts.ts"
import { buildDownstreamPublishedRosterView } from "../../lib/published-roster-view.ts"

const model = generateRosterDraftViewModel({
  fixture: rosterDraftDemoFixture,
  targetMonth: "2026-08",
})

const publishedCells = [
  {
    cell_id: "CELL-PUB-001",
    employee_id: "EMP-001",
    business_date: "2026-08-03",
    team_id: "G1",
    assignment_kind: "shift",
    shift_code: "A5",
    interval_start_at: "2026-08-03T09:00:00+08:00",
    interval_end_at: "2026-08-03T14:30:00+08:00",
    manually_adjusted: false,
  },
  {
    cell_id: "CELL-PUB-002",
    employee_id: "EMP-002",
    business_date: "2026-08-03",
    team_id: "G1",
    assignment_kind: "shift",
    shift_code: "REST",
    interval_start_at: null,
    interval_end_at: null,
    manually_adjusted: true,
  },
  {
    cell_id: "CELL-PUB-003",
    employee_id: "EMP-003",
    business_date: "2026-08-03",
    team_id: "G2",
    assignment_kind: "shift",
    shift_code: "N",
    interval_start_at: "2026-08-03T20:00:00+08:00",
    interval_end_at: "2026-08-04T08:00:00+08:00",
    manually_adjusted: false,
  },
]

test("missing formal roster keeps downstream views empty and points to publish first", () => {
  const view = buildDownstreamPublishedRosterView({
    model,
    published: {
      status: "missing",
      versionId: null,
      cells: [],
    },
    fixedTeamId: "G1",
    selectedEmployeeId: "EMP-001",
  })

  assert.equal(view.status, "missing")
  assert.equal(view.emptyState.title, "暂无正式班表")
  assert.match(view.emptyState.description, /先由排班师发布/)
  assert.deepEqual(view.teamLead.monthRows, [])
  assert.deepEqual(view.frontline.monthRows, [])
})

test("team lead sees only the fixed local team from the formal roster", () => {
  const view = buildDownstreamPublishedRosterView({
    model,
    published: {
      status: "published",
      versionId: "VER-PUB-1",
      cells: publishedCells,
    },
    fixedTeamId: "G1",
    selectedEmployeeId: "EMP-001",
  })

  assert.equal(view.status, "published")
  assert.equal(view.teamLead.teamName, "G1 投诉组")
  assert.deepEqual(
    view.teamLead.monthRows.map((row) => row.employeeName),
    ["Alice Chen", "Ben Wang"]
  )
  assert.equal(view.teamLead.monthRows.some((row) => row.employeeName === "Cathy Li"), false)
  assert.equal(view.teamLead.summary.staffCount, 2)
  assert.equal(view.teamLead.summary.workCellCount, 1)
  assert.equal(view.teamLead.summary.restCellCount, 1)
})

test("frontline sees one selected employee and request boundary actions", () => {
  const view = buildDownstreamPublishedRosterView({
    model,
    published: {
      status: "published",
      versionId: "VER-PUB-1",
      cells: publishedCells,
    },
    fixedTeamId: "G1",
    selectedEmployeeId: "EMP-001",
  })

  assert.deepEqual(
    view.frontline.employeeOptions.map((employee) => employee.employeeId),
    ["EMP-001", "EMP-002", "EMP-003", "EMP-004", "EMP-005", "EMP-006"]
  )
  assert.deepEqual(
    view.frontline.monthRows.map((row) => row.employeeName),
    ["Alice Chen"]
  )

  const selected = view.frontline.monthRows[0].cells.find(
    (cell) => cell.date === "2026-08-03"
  )

  assert.equal(selected?.shiftCode, "A5")
  assert.equal(selected?.intervalLabel, "09:00-14:30")
  assert.equal(selected?.detail?.sourceVersionLabel, "正式版 VER-PUB-1")
  assert.deepEqual(
    selected?.detail?.requestActions.map((action) => ({
      key: action.key,
      label: action.label,
      submissionState: action.submissionState,
      ownerLabel: action.ownerLabel,
    })),
    [
      {
        key: "leave",
        label: "请假",
        submissionState: "boundary_only",
        ownerLabel: "小组长初核",
      },
      {
        key: "swap",
        label: "换班",
        submissionState: "boundary_only",
        ownerLabel: "小组长协调",
      },
      {
        key: "exception_fix",
        label: "异常修复",
        submissionState: "boundary_only",
        ownerLabel: "排班师处理",
      },
    ]
  )
})

test("request boundaries explain required information without enabling submission", () => {
  const view = buildDownstreamPublishedRosterView({
    model,
    published: {
      status: "published",
      versionId: "VER-PUB-1",
      cells: publishedCells,
    },
    fixedTeamId: "G1",
    selectedEmployeeId: "EMP-001",
  })

  const selected = view.frontline.monthRows[0].cells.find(
    (cell) => cell.date === "2026-08-03"
  )
  const actions = selected?.detail?.requestActions ?? []

  assert.deepEqual(
    actions.map((action) => [action.key, action.requiredFields]),
    [
      ["leave", ["请假类型", "开始时间", "结束时间", "原因说明"]],
      ["swap", ["目标人员", "目标日期", "目标班次", "双方确认情况"]],
      ["exception_fix", ["异常类型", "实际发生时间", "修复说明", "证明材料"]],
    ]
  )
  assert.equal(actions.every((action) => action.submissionState === "boundary_only"), true)
  assert.equal(actions.every((action) => action.disabled === false), true)
})

test("team lead month calendar summarizes each day and maps the day back to its week", () => {
  const view = buildDownstreamPublishedRosterView({
    model,
    published: {
      status: "published",
      versionId: "VER-PUB-1",
      cells: publishedCells,
    },
    fixedTeamId: "G1",
    selectedEmployeeId: "EMP-001",
  })

  const day = view.teamLead.monthCalendarDays.find(
    (calendarDay) => calendarDay.date === "2026-08-03"
  )

  assert.ok(day)
  assert.equal(day.weekId, "W1")
  assert.equal(day.weekLabel, "1日-7日")
  assert.equal(day.workCellCount, 1)
  assert.equal(day.restCellCount, 1)
  assert.equal(day.manualCellCount, 1)
  assert.deepEqual(day.shiftCodes, ["A5", "REST"])
  assert.equal(day.summaryLabel, "1上班 / 1休")
})

test("frontline month calendar shows only the selected person's formal shift", () => {
  const view = buildDownstreamPublishedRosterView({
    model,
    published: {
      status: "published",
      versionId: "VER-PUB-1",
      cells: publishedCells,
    },
    fixedTeamId: "G1",
    selectedEmployeeId: "EMP-001",
  })

  const day = view.frontline.monthCalendarDays.find(
    (calendarDay) => calendarDay.date === "2026-08-03"
  )

  assert.ok(day)
  assert.equal(day.workCellCount, 1)
  assert.equal(day.restCellCount, 0)
  assert.equal(day.primaryCell?.shiftCode, "A5")
  assert.equal(day.summaryLabel, "A5")
})
