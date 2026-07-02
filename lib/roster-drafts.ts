export type RosterCopyStrategy = "previous_week_same_weekday"

export type RosterCellStatus =
  | "copied"
  | "needs_confirmation"
  | "exception"
  | "filtered_annotation"

export type PendingRosterReason =
  | "new_employee"
  | "team_changed"
  | "missing_source_pattern"

export type RosterExceptionReason = "invalid_shift_type" | "missing_source_pattern"

export type RosterDraftProject = {
  projectId: string
  projectName: string
  workplaceName: string
}

export type RosterDraftShiftType = {
  shiftCode: string
  label: string
  intervalLabel: string
  stableForCopy: boolean
}

export type RosterDraftEmployee = {
  employeeId: string
  employeeName: string
  teamId: string
  teamName: string
  active: boolean
  hireMonth?: string
  previousTeamId?: string
}

export type SourceRosterAssignment = {
  assignmentId: string
  employeeId: string
  businessDate: string
  assignmentKind: "shift" | "leave" | "rest" | "training" | "meeting" | "support" | "work_from_home" | "annotation"
  shiftCode?: string
  annotationCode?: string
  intervalLabel?: string
  teamId?: string
  stableForCopy: boolean
  note?: string
}

export type RosterForecastInterval = {
  id: string
  businessDate: string
  slotLabel: string
  requiredAgents: number
  reason: string
}

export type RosterActualInterval = {
  id: string
  businessDate: string
  slotLabel: string
  actualAgents: number
  sourceLabel: string
}

export type RosterDraftFixture = {
  project: RosterDraftProject
  targetMonths: string[]
  shiftTypes: RosterDraftShiftType[]
  employees: RosterDraftEmployee[]
  sourceAssignments: SourceRosterAssignment[]
  forecastIntervals: RosterForecastInterval[]
  actualIntervals: RosterActualInterval[]
}

export type RosterMonthDay = {
  date: string
  dayOfMonth: number
  weekdayLabel: string
}

export type RosterDraftAssignment = {
  assignmentId: string
  employeeId: string
  employeeName: string
  teamName: string
  businessDate: string
  shiftCode: string
  shiftLabel: string
  intervalLabel: string
  sourceDate: string
  sourceAssignmentId: string
  status: Extract<RosterCellStatus, "copied">
}

export type RosterMonthCell = {
  date: string
  status: RosterCellStatus
  shiftCode?: string
  sourceDate?: string
  reason?: string
}

export type RosterMonthRow = {
  employeeId: string
  employeeName: string
  teamName: string
  cells: RosterMonthCell[]
}

export type RosterWeek = {
  weekId: string
  label: string
  days: RosterMonthDay[]
}

export type RosterWeekDetail = {
  weekId: string
  employeeId: string
  employeeName: string
  teamName: string
  businessDate: string
  shiftCode?: string
  intervalLabel?: string
  sourceDate?: string
  status: RosterCellStatus
  reason: string
}

export type PendingRosterEmployeeView = {
  employeeId: string
  employeeName: string
  teamName: string
  reason: PendingRosterReason
  reasonLabel: string
}

export type RosterDraftException = {
  employeeId: string
  employeeName: string
  teamName: string
  sourceDate: string
  targetDate: string
  shiftCode?: string
  reason: RosterExceptionReason
  reasonLabel: string
  suggestion: string
}

export type FilteredRosterAnnotation = {
  employeeId: string
  employeeName: string
  teamName: string
  sourceDate: string
  targetDate: string
  annotationCode: string
  annotationKind: SourceRosterAssignment["assignmentKind"]
  reason: string
}

export type RosterStatusLegendItem = {
  status: RosterCellStatus
  label: string
  description: string
}

export type RosterDraftSummary = {
  targetMonth: string
  employeeCount: number
  generatedShiftCount: number
  pendingEmployeeCount: number
  exceptionCount: number
  filteredAnnotationCount: number
  copiedCoverageDays: number
}

export type RosterDraftViewModel = {
  targetMonth: string
  copyStrategy: RosterCopyStrategy
  project: RosterDraftProject
  monthDays: RosterMonthDay[]
  monthRows: RosterMonthRow[]
  weeks: RosterWeek[]
  weekDetails: RosterWeekDetail[]
  assignments: RosterDraftAssignment[]
  forecastIntervals: RosterForecastInterval[]
  actualIntervals: RosterActualInterval[]
  pendingEmployees: PendingRosterEmployeeView[]
  exceptions: RosterDraftException[]
  filteredAnnotations: FilteredRosterAnnotation[]
  statusLegend: RosterStatusLegendItem[]
  summary: RosterDraftSummary
}

const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"]

export function getRosterDraftTargetMonths(fixture: RosterDraftFixture): string[] {
  return [...fixture.targetMonths]
}

export function generateRosterDraftViewModel({
  fixture,
  targetMonth,
}: {
  fixture: RosterDraftFixture
  targetMonth: string
}): RosterDraftViewModel {
  const monthDays = buildMonthDays(targetMonth)
  const weeks = buildWeeks(monthDays)
  const activeEmployees = fixture.employees.filter((employee) => employee.active)
  const shiftTypeByCode = new Map(
    fixture.shiftTypes.map((shiftType) => [shiftType.shiftCode, shiftType])
  )
  const sourceAssignments = new Map<string, SourceRosterAssignment[]>()
  const generatedByEmployeeDate = new Map<string, RosterDraftAssignment>()
  const assignments: RosterDraftAssignment[] = []
  const exceptions: RosterDraftException[] = []
  const filteredAnnotations: FilteredRosterAnnotation[] = []

  for (const source of fixture.sourceAssignments) {
    const key = employeeDateKey(source.employeeId, source.businessDate)
    sourceAssignments.set(key, [...(sourceAssignments.get(key) ?? []), source])
  }

  const pendingEmployees = activeEmployees
    .filter((employee) => employeeNeedsPendingRecord(employee, targetMonth, sourceAssignments))
    .map((employee) => buildPendingEmployee(employee, targetMonth))

  for (const day of monthDays) {
    for (const employee of activeEmployees) {
      if (pendingEmployees.some((pending) => pending.employeeId === employee.employeeId)) {
        continue
      }

      const sourceDate = addDays(day.date, -7)
      const source =
        generatedByEmployeeDate.get(employeeDateKey(employee.employeeId, sourceDate)) ??
        firstSourceShift(sourceAssignments.get(employeeDateKey(employee.employeeId, sourceDate)))

      collectFilteredAnnotations({
        employee,
        sourceRows: sourceAssignments.get(employeeDateKey(employee.employeeId, sourceDate)) ?? [],
        sourceDate,
        targetDate: day.date,
        filteredAnnotations,
      })

      if (!source) {
        exceptions.push(
          buildMissingSourceException({
            employee,
            sourceDate,
            targetDate: day.date,
          })
        )
        continue
      }

      const shiftCode = source.shiftCode
      const shiftType = shiftCode ? shiftTypeByCode.get(shiftCode) : undefined
      const sourceStable =
        "stableForCopy" in source ? source.stableForCopy : true
      if (!shiftCode || !shiftType || !shiftType.stableForCopy || !sourceStable) {
        exceptions.push(
          buildInvalidShiftException({
            employee,
            sourceDate,
            targetDate: day.date,
            shiftCode,
          })
        )
        continue
      }

      const assignment: RosterDraftAssignment = {
        assignmentId: `GEN-${employee.employeeId}-${day.date}`,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        teamName: employee.teamName,
        businessDate: day.date,
        shiftCode,
        shiftLabel: shiftType.label,
        intervalLabel: shiftType.intervalLabel,
        sourceDate,
        sourceAssignmentId: source.assignmentId,
        status: "copied",
      }
      assignments.push(assignment)
      generatedByEmployeeDate.set(
        employeeDateKey(employee.employeeId, day.date),
        assignment
      )
    }
  }

  const monthRows = activeEmployees.map((employee) =>
    buildMonthRow({
      employee,
      monthDays,
      assignments,
      exceptions,
      pendingEmployees,
    })
  )

  const weekDetails = weeks.flatMap((week) =>
    activeEmployees.flatMap((employee) =>
      week.days.map((day) =>
        buildWeekDetail({
          weekId: week.weekId,
          employee,
          day,
          assignments,
          exceptions,
          pendingEmployees,
        })
      )
    )
  )

  return {
    targetMonth,
    copyStrategy: "previous_week_same_weekday",
    project: fixture.project,
    monthDays,
    monthRows,
    weeks,
    weekDetails,
    assignments,
    forecastIntervals: fixture.forecastIntervals.filter((item) =>
      item.businessDate.startsWith(targetMonth)
    ),
    actualIntervals: fixture.actualIntervals.filter((item) =>
      item.businessDate.startsWith(targetMonth)
    ),
    pendingEmployees,
    exceptions,
    filteredAnnotations,
    statusLegend: [
      {
        status: "copied",
        label: "复制生成",
        description: "从上一周同星期稳定班种复制",
      },
      {
        status: "needs_confirmation",
        label: "待确认",
        description: "人员月维度待排或缺少可复制模板",
      },
      {
        status: "exception",
        label: "异常",
        description: "源班表存在无效班种或缺少必要引用",
      },
      {
        status: "filtered_annotation",
        label: "非班务标注已过滤",
        description: "会议、备注等记录不复制为班种",
      },
    ],
    summary: {
      targetMonth,
      employeeCount: activeEmployees.length,
      generatedShiftCount: assignments.length,
      pendingEmployeeCount: pendingEmployees.length,
      exceptionCount: exceptions.length,
      filteredAnnotationCount: filteredAnnotations.length,
      copiedCoverageDays: new Set(assignments.map((assignment) => assignment.businessDate)).size,
    },
  }
}

function buildMonthDays(targetMonth: string): RosterMonthDay[] {
  const [year, month] = targetMonth.split("-").map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = formatDate(new Date(year, month - 1, index + 1))
    const parsed = parseDate(date)

    return {
      date,
      dayOfMonth: index + 1,
      weekdayLabel: weekdayLabels[parsed.getDay()],
    }
  })
}

function buildWeeks(monthDays: RosterMonthDay[]): RosterWeek[] {
  const weeks: RosterWeek[] = []

  for (let index = 0; index < monthDays.length; index += 7) {
    const days = monthDays.slice(index, index + 7)
    weeks.push({
      weekId: `W${weeks.length + 1}`,
      label: `${days[0].dayOfMonth}日-${days[days.length - 1].dayOfMonth}日`,
      days,
    })
  }

  return weeks
}

function employeeNeedsPendingRecord(
  employee: RosterDraftEmployee,
  targetMonth: string,
  sourceAssignments: Map<string, SourceRosterAssignment[]>
): boolean {
  if (employee.hireMonth === targetMonth || employee.previousTeamId) {
    return true
  }

  return ![0, 1, 2, 3, 4, 5, 6].some((offset) => {
    const sourceDate = addDays(`${targetMonth}-01`, -7 + offset)
    return firstSourceShift(sourceAssignments.get(employeeDateKey(employee.employeeId, sourceDate)))
  })
}

function buildPendingEmployee(
  employee: RosterDraftEmployee,
  targetMonth: string
): PendingRosterEmployeeView {
  const reason: PendingRosterReason =
    employee.hireMonth === targetMonth
      ? "new_employee"
      : employee.previousTeamId
        ? "team_changed"
        : "missing_source_pattern"

  const reasonLabel =
    reason === "new_employee"
      ? "新员工，缺少可复制历史班表"
      : reason === "team_changed"
        ? "员工小组变化，需要排班师确认"
        : "缺少上一周同星期稳定班种"

  return {
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    teamName: employee.teamName,
    reason,
    reasonLabel,
  }
}

function firstSourceShift(
  rows: SourceRosterAssignment[] | undefined
): SourceRosterAssignment | undefined {
  return rows?.find((row) => row.assignmentKind === "shift")
}

function collectFilteredAnnotations({
  employee,
  sourceRows,
  sourceDate,
  targetDate,
  filteredAnnotations,
}: {
  employee: RosterDraftEmployee
  sourceRows: SourceRosterAssignment[]
  sourceDate: string
  targetDate: string
  filteredAnnotations: FilteredRosterAnnotation[]
}) {
  for (const row of sourceRows) {
    if (row.assignmentKind === "shift") {
      continue
    }
    filteredAnnotations.push({
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      teamName: employee.teamName,
      sourceDate,
      targetDate,
      annotationCode: row.annotationCode ?? row.assignmentKind,
      annotationKind: row.assignmentKind,
      reason: row.note ?? "非 shift 记录只作为标注保留，不复制为班种",
    })
  }
}

function buildMissingSourceException({
  employee,
  sourceDate,
  targetDate,
}: {
  employee: RosterDraftEmployee
  sourceDate: string
  targetDate: string
}): RosterDraftException {
  return {
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    teamName: employee.teamName,
    sourceDate,
    targetDate,
    reason: "missing_source_pattern",
    reasonLabel: "未找到上一周同星期稳定班种",
    suggestion: "由排班师补录或调整复制来源",
  }
}

function buildInvalidShiftException({
  employee,
  sourceDate,
  targetDate,
  shiftCode,
}: {
  employee: RosterDraftEmployee
  sourceDate: string
  targetDate: string
  shiftCode?: string
}): RosterDraftException {
  return {
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    teamName: employee.teamName,
    sourceDate,
    targetDate,
    shiftCode,
    reason: "invalid_shift_type",
    reasonLabel: "源班表班种不可复制",
    suggestion: "维护班种定义或改为人工确认",
  }
}

function buildMonthRow({
  employee,
  monthDays,
  assignments,
  exceptions,
  pendingEmployees,
}: {
  employee: RosterDraftEmployee
  monthDays: RosterMonthDay[]
  assignments: RosterDraftAssignment[]
  exceptions: RosterDraftException[]
  pendingEmployees: PendingRosterEmployeeView[]
}): RosterMonthRow {
  const employeePending = pendingEmployees.find(
    (pending) => pending.employeeId === employee.employeeId
  )

  return {
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    teamName: employee.teamName,
    cells: monthDays.map((day) => {
      const assignment = assignments.find(
        (item) => item.employeeId === employee.employeeId && item.businessDate === day.date
      )
      if (assignment) {
        return {
          date: day.date,
          status: "copied",
          shiftCode: assignment.shiftCode,
          sourceDate: assignment.sourceDate,
        }
      }

      const exception = exceptions.find(
        (item) => item.employeeId === employee.employeeId && item.targetDate === day.date
      )
      if (exception) {
        return {
          date: day.date,
          status: "exception",
          shiftCode: exception.shiftCode,
          sourceDate: exception.sourceDate,
          reason: exception.reasonLabel,
        }
      }

      return {
        date: day.date,
        status: "needs_confirmation",
        reason: employeePending?.reasonLabel ?? "缺少可复制班种",
      }
    }),
  }
}

function buildWeekDetail({
  weekId,
  employee,
  day,
  assignments,
  exceptions,
  pendingEmployees,
}: {
  weekId: string
  employee: RosterDraftEmployee
  day: RosterMonthDay
  assignments: RosterDraftAssignment[]
  exceptions: RosterDraftException[]
  pendingEmployees: PendingRosterEmployeeView[]
}): RosterWeekDetail {
  const assignment = assignments.find(
    (item) => item.employeeId === employee.employeeId && item.businessDate === day.date
  )
  if (assignment) {
    return {
      weekId,
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      teamName: employee.teamName,
      businessDate: day.date,
      shiftCode: assignment.shiftCode,
      intervalLabel: assignment.intervalLabel,
      sourceDate: assignment.sourceDate,
      status: "copied",
      reason: "从上一周同星期复制生成",
    }
  }

  const exception = exceptions.find(
    (item) => item.employeeId === employee.employeeId && item.targetDate === day.date
  )
  if (exception) {
    return {
      weekId,
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      teamName: employee.teamName,
      businessDate: day.date,
      shiftCode: exception.shiftCode,
      sourceDate: exception.sourceDate,
      status: "exception",
      reason: exception.reasonLabel,
    }
  }

  const pending = pendingEmployees.find((item) => item.employeeId === employee.employeeId)
  return {
    weekId,
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    teamName: employee.teamName,
    businessDate: day.date,
    status: "needs_confirmation",
    reason: pending?.reasonLabel ?? "缺少可复制班种",
  }
}

function employeeDateKey(employeeId: string, businessDate: string) {
  return `${employeeId}:${businessDate}`
}

function addDays(date: string, days: number): string {
  const parsed = parseDate(date)
  parsed.setDate(parsed.getDate() + days)
  return formatDate(parsed)
}

function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(date: Date): string {
  return [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
  ].join("-")
}
