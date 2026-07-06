import type {
  RosterDraftViewModel,
  RosterMonthDay,
  RosterWeek,
} from "@/lib/roster-drafts"

export type DownstreamPublishedRosterStatus = "published" | "missing"

export type DownstreamPublishedRosterCellInput = {
  cell_id: string
  employee_id: string
  business_date: string
  team_id: string
  assignment_kind: string
  shift_code?: string | null
  interval_start_at?: string | null
  interval_end_at?: string | null
  manually_adjusted?: boolean
}

export type DownstreamPublishedRosterInput = {
  status: DownstreamPublishedRosterStatus
  versionId: string | null
  cells: DownstreamPublishedRosterCellInput[]
}

export type DownstreamRosterRole = "team_lead" | "frontline"

export type DownstreamRosterRequestAction = {
  key: "leave" | "swap" | "exception_fix"
  label: string
  disabled: true
}

export type DownstreamRosterCellDetail = {
  employeeId: string
  employeeName: string
  teamName: string
  date: string
  shiftCode: string
  intervalLabel: string
  sourceVersionLabel: string
  riskLabel: string
  requestActions: DownstreamRosterRequestAction[]
}

export type DownstreamRosterCell = {
  date: string
  dayOfMonth: number
  weekdayLabel: string
  shiftCode: string
  intervalLabel: string
  isRest: boolean
  isManual: boolean
  detail: DownstreamRosterCellDetail | null
}

export type DownstreamRosterRow = {
  employeeId: string
  employeeName: string
  teamName: string
  cells: DownstreamRosterCell[]
}

export type DownstreamRosterWeekView = {
  weekId: string
  label: string
  days: RosterMonthDay[]
  rows: DownstreamRosterRow[]
}

export type DownstreamRosterCalendarDay = {
  key: string
  date: string | null
  dayOfMonth: number | null
  weekdayLabel: string
  weekId: string | null
  weekLabel: string
  isPlaceholder: boolean
  workCellCount: number
  restCellCount: number
  manualCellCount: number
  shiftCodes: string[]
  summaryLabel: string
  primaryCell: DownstreamRosterCell | null
}

export type DownstreamRosterSummary = {
  staffCount: number
  workCellCount: number
  restCellCount: number
  manualCellCount: number
}

export type DownstreamRosterEmployeeOption = {
  employeeId: string
  employeeName: string
  teamName: string
}

export type DownstreamPublishedRosterView = {
  status: DownstreamPublishedRosterStatus
  emptyState: {
    title: string
    description: string
  }
  versionLabel: string
  monthDays: RosterMonthDay[]
  weeks: RosterWeek[]
  teamLead: {
    role: Extract<DownstreamRosterRole, "team_lead">
    teamId: string
    teamName: string
    monthRows: DownstreamRosterRow[]
    monthCalendarDays: DownstreamRosterCalendarDay[]
    weeks: DownstreamRosterWeekView[]
    summary: DownstreamRosterSummary
  }
  frontline: {
    role: Extract<DownstreamRosterRole, "frontline">
    selectedEmployeeId: string | null
    employeeOptions: DownstreamRosterEmployeeOption[]
    monthRows: DownstreamRosterRow[]
    monthCalendarDays: DownstreamRosterCalendarDay[]
    weeks: DownstreamRosterWeekView[]
    summary: DownstreamRosterSummary
  }
}

const requestActions: DownstreamRosterRequestAction[] = [
  { key: "leave", label: "请假", disabled: true },
  { key: "swap", label: "换班", disabled: true },
  { key: "exception_fix", label: "异常修复", disabled: true },
]

export function buildDownstreamPublishedRosterView({
  model,
  published,
  fixedTeamId,
  selectedEmployeeId,
}: {
  model: RosterDraftViewModel
  published: DownstreamPublishedRosterInput
  fixedTeamId: string
  selectedEmployeeId: string | null
}): DownstreamPublishedRosterView {
  const employees = model.monthRows.map((row) => ({
    employeeId: row.employeeId,
    employeeName: row.employeeName,
    teamName: row.teamName,
  }))
  const teamMembers = model.monthRows.filter((row) => row.cells && row.teamName)
  const fixedTeamRows = teamMembers.filter((row) => teamIdFromTeamName(row.teamName) === fixedTeamId)
  const fixedTeamName = fixedTeamRows[0]?.teamName ?? "本地团队"
  const firstEmployeeId = selectedEmployeeId ?? employees[0]?.employeeId ?? null
  const selectedEmployeeRows = firstEmployeeId
    ? model.monthRows.filter((row) => row.employeeId === firstEmployeeId)
    : []

  if (published.status !== "published") {
    return {
      status: "missing",
      emptyState: {
        title: "暂无正式班表",
        description: "先由排班师发布正式班表后，小组长和一线才能查看。",
      },
      versionLabel: "",
      monthDays: model.monthDays,
      weeks: model.weeks,
      teamLead: {
        role: "team_lead",
        teamId: fixedTeamId,
        teamName: fixedTeamName,
        monthRows: [],
        monthCalendarDays: buildCalendarDays({
          monthDays: model.monthDays,
          weeks: model.weeks,
          rows: [],
          scope: "team",
        }),
        weeks: [],
        summary: emptySummary(),
      },
      frontline: {
        role: "frontline",
        selectedEmployeeId: firstEmployeeId,
        employeeOptions: employees,
        monthRows: [],
        monthCalendarDays: buildCalendarDays({
          monthDays: model.monthDays,
          weeks: model.weeks,
          rows: [],
          scope: "person",
        }),
        weeks: [],
        summary: emptySummary(),
      },
    }
  }

  const versionLabel = published.versionId ? `正式版 ${published.versionId}` : "正式版"
  const cellByEmployeeDate = new Map(
    published.cells.map((cell) => [employeeDateKey(cell.employee_id, cell.business_date), cell])
  )
  const teamRows = fixedTeamRows.map((row) =>
    buildPublishedRosterRow({
      sourceRow: row,
      monthDays: model.monthDays,
      cellByEmployeeDate,
      versionLabel,
    })
  )
  const personalRows = selectedEmployeeRows.map((row) =>
    buildPublishedRosterRow({
      sourceRow: row,
      monthDays: model.monthDays,
      cellByEmployeeDate,
      versionLabel,
    })
  )

  return {
    status: "published",
    emptyState: {
      title: "",
      description: "",
    },
    versionLabel,
    monthDays: model.monthDays,
    weeks: model.weeks,
    teamLead: {
      role: "team_lead",
      teamId: fixedTeamId,
      teamName: fixedTeamName,
      monthRows: teamRows,
      monthCalendarDays: buildCalendarDays({
        monthDays: model.monthDays,
        weeks: model.weeks,
        rows: teamRows,
        scope: "team",
      }),
      weeks: buildWeekViews(model.weeks, teamRows),
      summary: summarizeRows(teamRows),
    },
    frontline: {
      role: "frontline",
      selectedEmployeeId: firstEmployeeId,
      employeeOptions: employees,
      monthRows: personalRows,
      monthCalendarDays: buildCalendarDays({
        monthDays: model.monthDays,
        weeks: model.weeks,
        rows: personalRows,
        scope: "person",
      }),
      weeks: buildWeekViews(model.weeks, personalRows),
      summary: summarizeRows(personalRows),
    },
  }
}

function buildPublishedRosterRow({
  sourceRow,
  monthDays,
  cellByEmployeeDate,
  versionLabel,
}: {
  sourceRow: RosterDraftViewModel["monthRows"][number]
  monthDays: RosterMonthDay[]
  cellByEmployeeDate: Map<string, DownstreamPublishedRosterCellInput>
  versionLabel: string
}): DownstreamRosterRow {
  return {
    employeeId: sourceRow.employeeId,
    employeeName: sourceRow.employeeName,
    teamName: sourceRow.teamName,
    cells: monthDays.map((day) => {
      const publishedCell = cellByEmployeeDate.get(
        employeeDateKey(sourceRow.employeeId, day.date)
      )
      const shiftCode = publishedCell?.shift_code ?? ""
      const intervalLabel = intervalLabelFromCell(publishedCell)
      const isRest = shiftCode === "REST" || shiftCode === "休"

      return {
        date: day.date,
        dayOfMonth: day.dayOfMonth,
        weekdayLabel: day.weekdayLabel,
        shiftCode,
        intervalLabel,
        isRest,
        isManual: Boolean(publishedCell?.manually_adjusted),
        detail: publishedCell
          ? {
              employeeId: sourceRow.employeeId,
              employeeName: sourceRow.employeeName,
              teamName: sourceRow.teamName,
              date: day.date,
              shiftCode: shiftCode || "未排班",
              intervalLabel,
              sourceVersionLabel: versionLabel,
              riskLabel: publishedCell.manually_adjusted ? "发布后人工调整" : "无轻风险",
              requestActions,
            }
          : null,
      }
    }),
  }
}

function buildWeekViews(
  weeks: RosterWeek[],
  rows: DownstreamRosterRow[]
): DownstreamRosterWeekView[] {
  return weeks.map((week) => {
    const dateSet = new Set(week.days.map((day) => day.date))

    return {
      weekId: week.weekId,
      label: week.label,
      days: week.days,
      rows: rows.map((row) => ({
        ...row,
        cells: row.cells.filter((cell) => dateSet.has(cell.date)),
      })),
    }
  })
}

function buildCalendarDays({
  monthDays,
  weeks,
  rows,
  scope,
}: {
  monthDays: RosterMonthDay[]
  weeks: RosterWeek[]
  rows: DownstreamRosterRow[]
  scope: "team" | "person"
}): DownstreamRosterCalendarDay[] {
  const weekByDate = new Map<string, RosterWeek>()
  for (const week of weeks) {
    for (const day of week.days) {
      weekByDate.set(day.date, week)
    }
  }

  const leadingPlaceholderCount = monthDays[0] ? weekdayIndexFromDate(monthDays[0].date) : 0
  const calendarDays: DownstreamRosterCalendarDay[] = Array.from(
    { length: leadingPlaceholderCount },
    (_, index) => emptyCalendarDay(`leading-${index}`, weekdayLabels[index] ?? "")
  )

  for (const day of monthDays) {
    const cells = rows
      .flatMap((row) => row.cells)
      .filter((cell) => cell.date === day.date && cell.shiftCode)
    const workCellCount = cells.filter((cell) => !cell.isRest).length
    const restCellCount = cells.filter((cell) => cell.isRest).length
    const manualCellCount = cells.filter((cell) => cell.isManual).length
    const shiftCodes = Array.from(new Set(cells.map((cell) => cell.shiftCode))).filter(Boolean)
    const week = weekByDate.get(day.date)
    const primaryCell = cells[0] ?? null

    calendarDays.push({
      key: day.date,
      date: day.date,
      dayOfMonth: day.dayOfMonth,
      weekdayLabel: day.weekdayLabel,
      weekId: week?.weekId ?? null,
      weekLabel: week?.label ?? "",
      isPlaceholder: false,
      workCellCount,
      restCellCount,
      manualCellCount,
      shiftCodes,
      summaryLabel: calendarSummaryLabel({
        scope,
        workCellCount,
        restCellCount,
        primaryCell,
      }),
      primaryCell,
    })
  }

  const trailingPlaceholderCount = (7 - (calendarDays.length % 7)) % 7
  for (let index = 0; index < trailingPlaceholderCount; index += 1) {
    calendarDays.push(
      emptyCalendarDay(
        `trailing-${index}`,
        weekdayLabels[(calendarDays.length + index) % 7] ?? ""
      )
    )
  }

  return calendarDays
}

function calendarSummaryLabel({
  scope,
  workCellCount,
  restCellCount,
  primaryCell,
}: {
  scope: "team" | "person"
  workCellCount: number
  restCellCount: number
  primaryCell: DownstreamRosterCell | null
}): string {
  if (scope === "person") {
    if (!primaryCell?.shiftCode) {
      return "未排班"
    }

    return primaryCell.shiftCode
  }

  if (workCellCount === 0 && restCellCount === 0) {
    return "无班次"
  }

  return `${workCellCount}上班 / ${restCellCount}休`
}

function emptyCalendarDay(
  key: string,
  weekdayLabel: string
): DownstreamRosterCalendarDay {
  return {
    key,
    date: null,
    dayOfMonth: null,
    weekdayLabel,
    weekId: null,
    weekLabel: "",
    isPlaceholder: true,
    workCellCount: 0,
    restCellCount: 0,
    manualCellCount: 0,
    shiftCodes: [],
    summaryLabel: "",
    primaryCell: null,
  }
}

function summarizeRows(rows: DownstreamRosterRow[]): DownstreamRosterSummary {
  const cells = rows.flatMap((row) => row.cells).filter((cell) => cell.shiftCode)

  return {
    staffCount: rows.length,
    workCellCount: cells.filter((cell) => !cell.isRest).length,
    restCellCount: cells.filter((cell) => cell.isRest).length,
    manualCellCount: cells.filter((cell) => cell.isManual).length,
  }
}

function emptySummary(): DownstreamRosterSummary {
  return {
    staffCount: 0,
    workCellCount: 0,
    restCellCount: 0,
    manualCellCount: 0,
  }
}

function teamIdFromTeamName(teamName: string): string | null {
  return teamName === "G1 投诉组" ? "G1" : teamName === "G2 在线组" ? "G2" : null
}

function intervalLabelFromCell(
  cell: DownstreamPublishedRosterCellInput | undefined
): string {
  if (!cell) {
    return "未排班"
  }

  if (cell.shift_code === "REST" || cell.shift_code === "休") {
    return "休息"
  }

  const start = timeLabelFromIso(cell.interval_start_at)
  const end = timeLabelFromIso(cell.interval_end_at)
  if (!start || !end) {
    return "时间待确认"
  }

  return `${start}-${end}`
}

function timeLabelFromIso(value?: string | null): string {
  if (!value) {
    return ""
  }

  const match = value.match(/T(\d{2}:\d{2})/)
  return match?.[1] ?? ""
}

function employeeDateKey(employeeId: string, date: string): string {
  return `${employeeId}::${date}`
}

const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"]

function weekdayIndexFromDate(date: string): number {
  return new Date(`${date}T00:00:00+08:00`).getDay()
}
