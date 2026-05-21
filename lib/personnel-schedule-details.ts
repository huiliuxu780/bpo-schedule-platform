import type { SchedulePlanDetail } from "./schedule-plans"

export type PersonnelScheduleInterval = {
  start: string
  end: string
}

export type PersonnelScheduleDetailRow = {
  scheduleDetailId: string
  planId: string
  employeeId: string
  employeeName: string
  businessDate: string
  workplace: string
  supplier: string
  project: string
  shiftType: string
  startTime: string
  endTime: string
  breakWindow: string
  mealWindow: string
  skillGroup: string
  skillLevel: string
  scheduledHours: number
  expandedIntervals: PersonnelScheduleInterval[]
  anomalyCodes: string[]
  anomalyLabels: string[]
}

export type PersonnelScheduleSummary = {
  peopleCount: number
  totalScheduledHours: number
  peopleWithAnomalies: number
  intervalCount: number
}

export type PersonnelScheduleFieldCoverage = {
  requiredFields: string[]
  completeRows: number
  totalRows: number
}

export type PersonnelIntervalTracePerson = {
  employeeId: string
  employeeName: string
  supplier: string
  shiftType: string
  skill: string
  anomalyLabels: string[]
}

export type PersonnelIntervalTrace = {
  planId: string
  intervalStart: string
  intervalEnd: string
  assignedPeople: PersonnelIntervalTracePerson[]
}

export type PersonnelScheduleIntervalLinkageStatus = "一致" | "需核对"

export type PersonnelScheduleIntervalLinkage = {
  planId: string
  intervalStart: string
  intervalEnd: string
  scheduledAgents: number
  linkedPeopleCount: number
  difference: number
  status: PersonnelScheduleIntervalLinkageStatus
  assignedPeople: PersonnelIntervalTracePerson[]
}

export type PersonnelScheduleIntervalLinkageSummary = {
  intervalCount: number
  linkedPeopleCount: number
  intervalsNeedingReview: number
}

export type ScheduleGapPerson = {
  employeeId: string
  employeeName: string
  supplier: string
  shiftType: string
  scheduledWindow: string
  skill: string
  timelineHref: string
}

export type ScheduleGapExplanation = {
  planId: string
  intervalStart: string
  intervalEnd: string
  involvedPeople: ScheduleGapPerson[]
  candidatePeople: ScheduleGapPerson[]
}

const anomalyLabel: Record<string, string> = {
  no_login: "状态不一致",
  late_login: "登录迟到",
  early_logout: "提前离线",
}

export const fallbackPersonnelScheduleDetails: PersonnelScheduleDetailRow[] = [
  row({
    scheduleDetailId: "PSD-1001-20260511",
    planId: "plan-20260511-shanghai-bosch-v1",
    employeeId: "A-1001",
    employeeName: "刘晨",
    businessDate: "2026-05-11",
    workplace: "上海职场",
    supplier: "供应商 A",
    project: "博西客服",
    shiftType: "早班 + 午后班",
    startTime: "09:00",
    endTime: "18:00",
    breakWindow: "12:00-13:00",
    mealWindow: "12:00-13:00",
    skillGroup: "热线",
    skillLevel: "L2",
    scheduledHours: 8,
    anomalyCodes: ["no_login"],
  }),
  row({
    scheduleDetailId: "PSD-1002-20260511",
    planId: "plan-20260511-shanghai-bosch-v1",
    employeeId: "A-1002",
    employeeName: "王敏",
    businessDate: "2026-05-11",
    workplace: "上海职场",
    supplier: "供应商 A",
    project: "博西客服",
    shiftType: "早班",
    startTime: "09:00",
    endTime: "17:00",
    breakWindow: "12:00-13:00",
    mealWindow: "12:00-13:00",
    skillGroup: "热线",
    skillLevel: "L2",
    scheduledHours: 8,
    anomalyCodes: ["late_login"],
  }),
  row({
    scheduleDetailId: "PSD-1005-20260511",
    planId: "plan-20260511-shanghai-bosch-v1",
    employeeId: "A-1005",
    employeeName: "赵一",
    businessDate: "2026-05-11",
    workplace: "上海职场",
    supplier: "供应商 B",
    project: "博西客服",
    shiftType: "支援班",
    startTime: "09:30",
    endTime: "15:30",
    breakWindow: "12:30-13:00",
    mealWindow: "12:30-13:00",
    skillGroup: "热线",
    skillLevel: "L1",
    scheduledHours: 6,
    anomalyCodes: [],
  }),
  row({
    scheduleDetailId: "PSD-1006-20260511",
    planId: "plan-20260511-shanghai-bosch-v1",
    employeeId: "A-1006",
    employeeName: "周航",
    businessDate: "2026-05-11",
    workplace: "上海职场",
    supplier: "供应商 C",
    project: "博西客服",
    shiftType: "午后班",
    startTime: "13:00",
    endTime: "18:00",
    breakWindow: "15:30-16:00",
    mealWindow: "无",
    skillGroup: "工单",
    skillLevel: "L1",
    scheduledHours: 5,
    anomalyCodes: [],
  }),
  row({
    scheduleDetailId: "PSD-1003-20260511",
    planId: "plan-20260511-suzhou-bosch-v1",
    employeeId: "A-1003",
    employeeName: "张琳",
    businessDate: "2026-05-11",
    workplace: "苏州职场",
    supplier: "供应商 B",
    project: "博西客服",
    shiftType: "晚班",
    startTime: "12:00",
    endTime: "20:00",
    breakWindow: "16:00-16:30",
    mealWindow: "17:30-18:00",
    skillGroup: "热线",
    skillLevel: "L2",
    scheduledHours: 8,
    anomalyCodes: ["early_logout"],
  }),
]

export function getPersonnelScheduleDetails(planId: string) {
  return fallbackPersonnelScheduleDetails.filter((item) => item.planId === planId)
}

export function getPersonnelScheduleDetailsForInterval(
  planId: string,
  start: string,
  end: string
) {
  return getPersonnelScheduleDetails(planId).filter((item) =>
    item.expandedIntervals.some(
      (interval) => interval.start === start && interval.end === end
    )
  )
}

export function getPersonnelScheduleFieldCoverage(
  rows: PersonnelScheduleDetailRow[]
): PersonnelScheduleFieldCoverage {
  return {
    requiredFields,
    completeRows: rows.filter(hasRequiredBusinessFields).length,
    totalRows: rows.length,
  }
}

export function buildPersonnelIntervalTrace(
  planId: string,
  start: string,
  end: string
): PersonnelIntervalTrace {
  return {
    planId,
    intervalStart: start,
    intervalEnd: end,
    assignedPeople: getPersonnelScheduleDetailsForInterval(planId, start, end).map(
      (item) => ({
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        supplier: item.supplier,
        shiftType: item.shiftType,
        skill: `${item.skillGroup} / ${item.skillLevel}`,
        anomalyLabels: item.anomalyLabels,
      })
    ),
  }
}

export function buildPersonnelScheduleIntervalLinkage(
  plan: SchedulePlanDetail | null
): PersonnelScheduleIntervalLinkage[] {
  if (!plan) {
    return []
  }

  return plan.intervals.map((item) => {
    const trace = buildPersonnelIntervalTrace(
      plan.summary.id,
      item.interval_start,
      item.interval_end
    )
    const linkedPeopleCount = trace.assignedPeople.length
    const difference = item.scheduled_agents - linkedPeopleCount

    return {
      planId: plan.summary.id,
      intervalStart: item.interval_start,
      intervalEnd: item.interval_end,
      scheduledAgents: item.scheduled_agents,
      linkedPeopleCount,
      difference,
      status: difference === 0 ? "一致" : "需核对",
      assignedPeople: trace.assignedPeople,
    }
  })
}

export function summarizePersonnelScheduleIntervalLinkage(
  rows: PersonnelScheduleIntervalLinkage[]
): PersonnelScheduleIntervalLinkageSummary {
  const linkedEmployeeIds = new Set(
    rows.flatMap((item) => item.assignedPeople.map((person) => person.employeeId))
  )

  return {
    intervalCount: rows.length,
    linkedPeopleCount: linkedEmployeeIds.size,
    intervalsNeedingReview: rows.filter((item) => item.status === "需核对").length,
  }
}

export function buildScheduleGapExplanation(
  planId: string,
  start: string,
  end: string
): ScheduleGapExplanation {
  const planRows = getPersonnelScheduleDetails(planId)
  const involvedRows = getPersonnelScheduleDetailsForInterval(planId, start, end)
  const involvedIds = new Set(involvedRows.map((item) => item.employeeId))
  const candidateRows = planRows.filter((item) => !involvedIds.has(item.employeeId))

  return {
    planId,
    intervalStart: start,
    intervalEnd: end,
    involvedPeople: involvedRows.map(toGapPerson),
    candidatePeople: candidateRows.map(toGapPerson),
  }
}

export function summarizePersonnelScheduleDetails(
  rows: PersonnelScheduleDetailRow[]
): PersonnelScheduleSummary {
  const intervalKeys = new Set(
    rows.flatMap((item) =>
      item.expandedIntervals.map((interval) => `${interval.start}-${interval.end}`)
    )
  )

  return {
    peopleCount: rows.length,
    totalScheduledHours: rows.reduce((total, item) => total + item.scheduledHours, 0),
    peopleWithAnomalies: rows.filter((item) => item.anomalyCodes.length > 0).length,
    intervalCount: intervalKeys.size,
  }
}

export function buildPersonTimelineHref(row: PersonnelScheduleDetailRow) {
  const team = `${row.workplace}||${row.project}`
  const group = `${row.workplace}||${row.project}||${row.supplier}`
  const query = [
    `date=${encodeURIComponent(row.businessDate)}`,
    `team=${encodeURIComponent(team)}`,
    `group=${encodeURIComponent(group)}`,
    `returnDate=${encodeURIComponent(row.businessDate)}`,
  ].join("&")

  return `/person-timeline/${row.employeeId}?${query}`
}

function toGapPerson(row: PersonnelScheduleDetailRow): ScheduleGapPerson {
  return {
    employeeId: row.employeeId,
    employeeName: row.employeeName,
    supplier: row.supplier,
    shiftType: row.shiftType,
    scheduledWindow: `${row.startTime}-${row.endTime}`,
    skill: `${row.skillGroup} / ${row.skillLevel}`,
    timelineHref: buildPersonTimelineHref(row),
  }
}

function row(
  item: Omit<PersonnelScheduleDetailRow, "expandedIntervals" | "anomalyLabels">
): PersonnelScheduleDetailRow {
  return {
    ...item,
    expandedIntervals: expandHalfHourIntervals(item.startTime, item.endTime),
    anomalyLabels: item.anomalyCodes.map((code) => anomalyLabel[code] ?? code),
  }
}

function hasRequiredBusinessFields(row: PersonnelScheduleDetailRow) {
  return requiredFields.every((field) => {
    const value = row[field as keyof PersonnelScheduleDetailRow]

    if (Array.isArray(value)) {
      return field === "anomalyLabels" || value.length > 0
    }

    return Boolean(value)
  })
}

const requiredFields = [
  "employeeId",
  "employeeName",
  "supplier",
  "workplace",
  "project",
  "skillGroup",
  "skillLevel",
  "shiftType",
  "anomalyLabels",
]

function expandHalfHourIntervals(start: string, end: string) {
  const intervals: PersonnelScheduleInterval[] = []
  let cursor = toMinutes(start)
  const endMinutes = toMinutes(end)

  while (cursor < endMinutes) {
    const next = Math.min(cursor + 30, endMinutes)
    intervals.push({ start: toTime(cursor), end: toTime(next) })
    cursor = next
  }

  return intervals
}

function toMinutes(value: string) {
  const [hour = "0", minute = "0"] = value.split(":")
  return Number(hour) * 60 + Number(minute)
}

function toTime(value: number) {
  const hour = Math.floor(value / 60)
  const minute = value % 60

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}
