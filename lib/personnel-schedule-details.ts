import type { SchedulePlanDetail } from "./schedule-plans"

export type PersonnelScheduleInterval = {
  start: string
  end: string
}

export type PersonnelScheduleDetailRow = {
  scheduleDetailId: string
  scheduleVersionId?: string
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
  sourceBatchId?: string
  sourceVersionId?: string
  shiftTypeReferenceStatus?: "ready" | "blocked"
}

export type ImportedPersonnelScheduleRecord = {
  schedule_detail_id: string
  schedule_version_id: string
  employee_id: string
  employee_name: string
  business_date: string
  workplace_id: string
  workplace_name: string
  supplier_id: string
  supplier_name: string
  project_id: string
  project_name: string
  shift_type_id: string
  shift_type_name: string
  shift_type_reference_status: "ready" | "blocked"
  start_at: string
  end_at: string
  skill_group: string
  skill_level: string
  status: string
  source_batch_id: string
  source_version_id: string
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
  timelineHref: string
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

export type PersonnelScheduleIntervalExpansionPerson = {
  employeeId: string
  employeeName: string
  scheduleDetailId: string
  supplier: string
  shiftType: string
  timelineHref: string
}

export type PersonnelScheduleIntervalExpansion = {
  intervalScheduleId: string
  scheduleVersionId: string
  businessDate: string
  workplace: string
  project: string
  skill: string
  intervalStart: string
  intervalEnd: string
  scheduledAgents: number
  employeeIds: string[]
  scheduleDetailIds: string[]
  sourceBatchId: string
  sourceVersionId: string
  traceStatus: "ready" | "review"
  people: PersonnelScheduleIntervalExpansionPerson[]
}

export type PersonScheduleSource = {
  planId: string
  planHref: string
  draftHref: string
  scheduleDetailId: string
  shiftType: string
  scheduledWindow: string
  skill: string
  linkedIntervalCount: number
  reviewIntervalCount: number
  reviewIntervals: Array<{
    intervalStart: string
    intervalEnd: string
    scheduledAgents: number
    linkedPeopleCount: number
    difference: number
    status: PersonnelScheduleIntervalLinkageStatus
  }>
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

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

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

export async function getImportedPersonnelScheduleDetails() {
  const response = await fetchJson<{ items: ImportedPersonnelScheduleRecord[] }>(
    "/api/v1/personnel-schedules/imported-records"
  )
  const importedRows =
    response?.items.map((item) => mapImportedPersonnelScheduleRecord(item)) ?? []

  if (importedRows.length === 0) {
    return fallbackPersonnelScheduleDetails
  }

  return mergeImportedPersonnelScheduleDetails(importedRows)
}

export function mapImportedPersonnelScheduleRecord(
  record: ImportedPersonnelScheduleRecord
): PersonnelScheduleDetailRow {
  return row({
    scheduleDetailId: record.schedule_detail_id,
    scheduleVersionId: record.schedule_version_id,
    planId: `imported-${record.schedule_version_id}`,
    employeeId: record.employee_id,
    employeeName: record.employee_name,
    businessDate: record.business_date,
    workplace: record.workplace_name || record.workplace_id,
    supplier: record.supplier_name || record.supplier_id,
    project: record.project_name || record.project_id,
    shiftType: record.shift_type_name || record.shift_type_id,
    startTime: record.start_at,
    endTime: record.end_at,
    breakWindow: "待引用班次",
    mealWindow: "待引用班次",
    skillGroup: record.skill_group,
    skillLevel: record.skill_level,
    scheduledHours: (toMinutes(record.end_at) - toMinutes(record.start_at)) / 60,
    anomalyCodes: [],
    sourceBatchId: record.source_batch_id,
    sourceVersionId: record.source_version_id,
    shiftTypeReferenceStatus: record.shift_type_reference_status,
  })
}

export function mergeImportedPersonnelScheduleDetails(
  importedRows: PersonnelScheduleDetailRow[],
  fallbackRows = fallbackPersonnelScheduleDetails
) {
  const importedIds = new Set(importedRows.map((row) => row.scheduleDetailId))
  const remainingFallbackRows = fallbackRows.filter(
    (row) => !importedIds.has(row.scheduleDetailId)
  )

  return [...importedRows, ...remainingFallbackRows]
}

export function buildPersonnelScheduleIntervalExpansion(
  rows: PersonnelScheduleDetailRow[]
): PersonnelScheduleIntervalExpansion[] {
  const grouped = new Map<string, PersonnelScheduleIntervalExpansion>()

  rows.forEach((row) => {
    row.expandedIntervals.forEach((interval) => {
      const scheduleVersionId = row.scheduleVersionId ?? row.planId
      const sourceBatchId = row.sourceBatchId ?? "样例记录"
      const sourceVersionId = row.sourceVersionId ?? scheduleVersionId
      const skill = `${row.skillGroup} / ${row.skillLevel}`
      const key = [
        scheduleVersionId,
        row.businessDate,
        row.workplace,
        row.project,
        skill,
        interval.start,
        interval.end,
      ].join("||")
      const existing =
        grouped.get(key) ??
        {
          intervalScheduleId: `IS-${scheduleVersionId}-${row.businessDate}-${interval.start.replace(":", "")}-${interval.end.replace(":", "")}`,
          scheduleVersionId,
          businessDate: row.businessDate,
          workplace: row.workplace,
          project: row.project,
          skill,
          intervalStart: interval.start,
          intervalEnd: interval.end,
          scheduledAgents: 0,
          employeeIds: [],
          scheduleDetailIds: [],
          sourceBatchId,
          sourceVersionId,
          traceStatus: "ready" as const,
          people: [],
        }

      existing.employeeIds.push(row.employeeId)
      existing.scheduleDetailIds.push(row.scheduleDetailId)
      existing.people.push({
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        scheduleDetailId: row.scheduleDetailId,
        supplier: row.supplier,
        shiftType: row.shiftType,
        timelineHref: buildPersonTimelineHref(row),
      })
      existing.scheduledAgents = existing.employeeIds.length
      grouped.set(key, existing)
    })
  })

  return [...grouped.values()].sort((left, right) =>
    [
      left.businessDate.localeCompare(right.businessDate),
      left.intervalStart.localeCompare(right.intervalStart),
      left.intervalEnd.localeCompare(right.intervalEnd),
      left.workplace.localeCompare(right.workplace),
      left.project.localeCompare(right.project),
      left.skill.localeCompare(right.skill),
    ].find((value) => value !== 0) ?? 0
  )
}

export function getPersonnelScheduleDetailForEmployeeDate(
  employeeId: string,
  businessDate: string
) {
  return fallbackPersonnelScheduleDetails.find(
    (item) => item.employeeId === employeeId && item.businessDate === businessDate
  )
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
        timelineHref: buildPersonTimelineHref(item),
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

export function buildPersonScheduleSource(
  row: PersonnelScheduleDetailRow | undefined,
  plan: SchedulePlanDetail | null
): PersonScheduleSource | null {
  if (!row || !plan) {
    return null
  }

  const rowIntervals = new Set(
    row.expandedIntervals.map((interval) => `${interval.start}-${interval.end}`)
  )
  const linkedRows = buildPersonnelScheduleIntervalLinkage(plan).filter((item) =>
    rowIntervals.has(`${item.intervalStart}-${item.intervalEnd}`)
  )
  const reviewIntervals = linkedRows
    .filter((item) => item.status === "需核对")
    .map((item) => ({
      intervalStart: item.intervalStart,
      intervalEnd: item.intervalEnd,
      scheduledAgents: item.scheduledAgents,
      linkedPeopleCount: item.linkedPeopleCount,
      difference: item.difference,
      status: item.status,
    }))

  return {
    planId: row.planId,
    planHref: `/schedule-plans/${row.planId}`,
    draftHref: `/schedule-plans/${row.planId}/edit`,
    scheduleDetailId: row.scheduleDetailId,
    shiftType: row.shiftType,
    scheduledWindow: `${row.startTime}-${row.endTime}`,
    skill: `${row.skillGroup} / ${row.skillLevel}`,
    linkedIntervalCount: linkedRows.length,
    reviewIntervalCount: reviewIntervals.length,
    reviewIntervals,
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

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
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
