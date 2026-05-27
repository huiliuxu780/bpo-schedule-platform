export type ActualLogIntervalRecord = {
  intervalId: string
  employeeId: string
  businessDate: string
  workplaceId: string
  projectId: string
  intervalStart: string
  intervalEnd: string
  loginMinutes: number
  statusMinutes: number
  productiveMinutes: number
  statusTypes: string[]
  loginLogIds: string[]
  statusLogIds: string[]
  traceStatus: string
}

export type ActualLogQualityIssueRecord = {
  issueId: string
  issueType: string
  employeeId: string
  businessDate: string
  workplaceId: string
  projectId: string
  intervalStart: string
  intervalEnd: string
  gapMinutes: number
  overlapMinutes: number
  sourceRecordIds: string[]
  message: string
}

export type ScheduleActualAnomalyRecord = {
  anomalyId: string
  anomalyType: string
  employeeId: string
  businessDate: string
  workplaceId: string
  projectId: string
  scheduleDetailId: string | null
  loginLogId: string | null
  statusLogIds: string[]
  intervalStart: string
  intervalEnd: string
  impactMinutes: number
  severity: "high" | "medium" | "low"
  sourceRecordIds: string[]
  message: string
}

export type ActualFulfillmentRecords = {
  intervals: ActualLogIntervalRecord[]
  qualityIssues: ActualLogQualityIssueRecord[]
  anomalies: ScheduleActualAnomalyRecord[]
}

export type ActualFulfillmentSummary = {
  intervalCount: number
  qualityIssueCount: number
  anomalyCount: number
  highSeverityCount: number
  totalImpactMinutes: number
  anomalyTypes: string[]
  primaryMessage: string
}

export type ScheduleActualAnomalyFilter = {
  employeeId?: string
  businessDate?: string
  workplaceId?: string
  projectId?: string
  severity?: ScheduleActualAnomalyRecord["severity"]
}

type ListResponse<T> = {
  items?: T[]
}

type ActualLogIntervalApiRecord = {
  interval_id: string
  employee_id: string
  business_date: string
  workplace_id: string
  project_id: string
  interval_start: string
  interval_end: string
  login_minutes: number
  status_minutes: number
  productive_minutes: number
  status_types: string[]
  login_log_ids: string[]
  status_log_ids: string[]
  trace_status: string
}

type ActualLogQualityIssueApiRecord = {
  issue_id: string
  issue_type: string
  employee_id: string
  business_date: string
  workplace_id: string
  project_id: string
  interval_start: string
  interval_end: string
  gap_minutes: number
  overlap_minutes: number
  source_record_ids: string[]
  message: string
}

type ScheduleActualAnomalyApiRecord = {
  anomaly_id: string
  anomaly_type: string
  employee_id: string
  business_date: string
  workplace_id: string
  project_id: string
  schedule_detail_id?: string | null
  login_log_id?: string | null
  status_log_ids?: string[]
  interval_start: string
  interval_end: string
  impact_minutes: number
  severity: string
  source_record_ids: string[]
  message: string
}

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

export const fallbackActualFulfillmentRecords: ActualFulfillmentRecords = {
  intervals: [
    {
      intervalId: "AL-A-1002-2026-05-11-0900-0930",
      employeeId: "A-1002",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      intervalStart: "09:00",
      intervalEnd: "09:30",
      loginMinutes: 9,
      statusMinutes: 9,
      productiveMinutes: 9,
      statusTypes: ["available"],
      loginLogIds: ["LOG-A-1002-20260511"],
      statusLogIds: ["STA-A-1002-20260511-0921"],
      traceStatus: "ready",
    },
    {
      intervalId: "AL-A-1002-2026-05-11-0930-1000",
      employeeId: "A-1002",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      intervalStart: "09:30",
      intervalEnd: "10:00",
      loginMinutes: 30,
      statusMinutes: 30,
      productiveMinutes: 16,
      statusTypes: ["available", "training"],
      loginLogIds: ["LOG-A-1002-20260511"],
      statusLogIds: ["STA-A-1002-20260511-0930", "STA-A-1002-20260511-0946"],
      traceStatus: "ready",
    },
    {
      intervalId: "AL-A-1003-2026-05-11-1300-1330",
      employeeId: "A-1003",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      intervalStart: "13:00",
      intervalEnd: "13:30",
      loginMinutes: 30,
      statusMinutes: 0,
      productiveMinutes: 0,
      statusTypes: [],
      loginLogIds: ["LOG-A-1003-20260511"],
      statusLogIds: [],
      traceStatus: "status_gap",
    },
  ],
  qualityIssues: [
    {
      issueId: "AQ-status_gap-A-1003-2026-05-11-1300",
      issueType: "status_gap",
      employeeId: "A-1003",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      intervalStart: "13:00",
      intervalEnd: "13:30",
      gapMinutes: 30,
      overlapMinutes: 0,
      sourceRecordIds: ["LOG-A-1003-20260511"],
      message: "状态区间少于登录区间",
    },
    {
      issueId: "AQ-status_overlap-A-1005-2026-05-11-1500",
      issueType: "status_overlap",
      employeeId: "A-1005",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      intervalStart: "15:00",
      intervalEnd: "15:30",
      gapMinutes: 0,
      overlapMinutes: 20,
      sourceRecordIds: ["STA-A-1005-20260511-1500", "STA-A-1005-20260511-1510"],
      message: "状态区间存在重叠",
    },
  ],
  anomalies: [
    {
      anomalyId: "SA-late_login-A-1002-2026-05-11-0900",
      anomalyType: "late_login",
      employeeId: "A-1002",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      scheduleDetailId: "SCH-A-1002-20260511",
      loginLogId: "LOG-A-1002-20260511",
      statusLogIds: [],
      intervalStart: "09:00",
      intervalEnd: "09:21",
      impactMinutes: 21,
      severity: "medium",
      sourceRecordIds: ["SCH-A-1002-20260511", "LOG-A-1002-20260511"],
      message: "登录时间晚于排班开始",
    },
    {
      anomalyId: "SA-non_productive_status-A-1002-2026-05-11-0930",
      anomalyType: "non_productive_status",
      employeeId: "A-1002",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      scheduleDetailId: "SCH-A-1002-20260511",
      loginLogId: "LOG-A-1002-20260511",
      statusLogIds: ["STA-A-1002-20260511-0946"],
      intervalStart: "09:30",
      intervalEnd: "10:00",
      impactMinutes: 14,
      severity: "medium",
      sourceRecordIds: [
        "SCH-A-1002-20260511",
        "LOG-A-1002-20260511",
        "STA-A-1002-20260511-0946",
      ],
      message: "排班区间存在非有效产能状态",
    },
    {
      anomalyId: "SA-status_gap-A-1003-2026-05-11-1300",
      anomalyType: "status_gap",
      employeeId: "A-1003",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      scheduleDetailId: "SCH-A-1003-20260511",
      loginLogId: "LOG-A-1003-20260511",
      statusLogIds: [],
      intervalStart: "13:00",
      intervalEnd: "13:30",
      impactMinutes: 30,
      severity: "high",
      sourceRecordIds: ["SCH-A-1003-20260511", "LOG-A-1003-20260511"],
      message: "状态区间少于登录区间",
    },
    {
      anomalyId: "SA-unscheduled_login-A-1005-2026-05-11-1500",
      anomalyType: "unscheduled_login",
      employeeId: "A-1005",
      businessDate: "2026-05-11",
      workplaceId: "上海职场",
      projectId: "博西客服",
      scheduleDetailId: null,
      loginLogId: "LOG-A-1005-20260511",
      statusLogIds: [],
      intervalStart: "15:00",
      intervalEnd: "15:45",
      impactMinutes: 45,
      severity: "high",
      sourceRecordIds: ["LOG-A-1005-20260511"],
      message: "有登录记录但没有匹配排班",
    },
  ],
}

export function summarizeActualFulfillmentRecords(
  records: ActualFulfillmentRecords
): ActualFulfillmentSummary {
  const anomalyTypes = Array.from(
    new Set(records.anomalies.map((item) => item.anomalyType))
  ).sort()
  const primary = records.anomalies[0]

  return {
    intervalCount: records.intervals.length,
    qualityIssueCount: records.qualityIssues.length,
    anomalyCount: records.anomalies.length,
    highSeverityCount: records.anomalies.filter((item) => item.severity === "high").length,
    totalImpactMinutes: records.anomalies.reduce(
      (total, item) => total + item.impactMinutes,
      0
    ),
    anomalyTypes,
    primaryMessage: primary?.message ?? "暂无排班对比异常",
  }
}

export function filterScheduleActualAnomalies(
  rows: ScheduleActualAnomalyRecord[],
  filters: ScheduleActualAnomalyFilter
): ScheduleActualAnomalyRecord[] {
  return rows.filter((row) => {
    if (filters.employeeId && row.employeeId !== filters.employeeId) {
      return false
    }
    if (filters.businessDate && row.businessDate !== filters.businessDate) {
      return false
    }
    if (filters.workplaceId && row.workplaceId !== filters.workplaceId) {
      return false
    }
    if (filters.projectId && row.projectId !== filters.projectId) {
      return false
    }
    if (filters.severity && row.severity !== filters.severity) {
      return false
    }
    return true
  })
}

export function getActualFulfillmentEvidenceReferences(
  records: ActualFulfillmentRecords,
  filters: ScheduleActualAnomalyFilter
): string[] {
  const references: string[] = []
  const pushAll = (items: string[]) => {
    for (const item of items) {
      if (item && !references.includes(item)) {
        references.push(item)
      }
    }
  }
  const matchesScope = (
    row: Pick<
      ActualLogIntervalRecord,
      "employeeId" | "businessDate" | "workplaceId" | "projectId"
    >
  ) =>
    (!filters.employeeId || row.employeeId === filters.employeeId) &&
    (!filters.businessDate || row.businessDate === filters.businessDate) &&
    (!filters.workplaceId || row.workplaceId === filters.workplaceId) &&
    (!filters.projectId || row.projectId === filters.projectId)

  for (const anomaly of filterScheduleActualAnomalies(records.anomalies, filters)) {
    pushAll(anomaly.sourceRecordIds)
  }
  for (const issue of records.qualityIssues.filter(matchesScope)) {
    pushAll([issue.issueId, ...issue.sourceRecordIds])
  }
  for (const interval of records.intervals.filter(matchesScope)) {
    pushAll([...interval.loginLogIds, ...interval.statusLogIds, interval.intervalId])
  }

  return references
}

export async function getActualFulfillmentRecords(): Promise<ActualFulfillmentRecords> {
  const [intervals, qualityIssues, anomalies] = await Promise.all([
    fetchList<ActualLogIntervalApiRecord>("/api/v1/actual-logs/intervals"),
    fetchList<ActualLogQualityIssueApiRecord>("/api/v1/actual-logs/quality-issues"),
    fetchList<ScheduleActualAnomalyApiRecord>("/api/v1/schedule-actual/anomalies"),
  ])

  return {
    intervals:
      intervals?.map(mapActualLogIntervalRecord) ??
      fallbackActualFulfillmentRecords.intervals,
    qualityIssues:
      qualityIssues?.map(mapActualLogQualityIssueRecord) ??
      fallbackActualFulfillmentRecords.qualityIssues,
    anomalies:
      anomalies?.map(mapScheduleActualAnomalyRecord) ??
      fallbackActualFulfillmentRecords.anomalies,
  }
}

async function fetchList<T>(path: string): Promise<T[] | null> {
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

    const payload = (await response.json()) as ListResponse<T>
    return payload.items ?? []
  } catch {
    return null
  }
}

function mapActualLogIntervalRecord(
  record: ActualLogIntervalApiRecord
): ActualLogIntervalRecord {
  return {
    intervalId: record.interval_id,
    employeeId: record.employee_id,
    businessDate: record.business_date,
    workplaceId: record.workplace_id,
    projectId: record.project_id,
    intervalStart: record.interval_start,
    intervalEnd: record.interval_end,
    loginMinutes: record.login_minutes,
    statusMinutes: record.status_minutes,
    productiveMinutes: record.productive_minutes,
    statusTypes: record.status_types,
    loginLogIds: record.login_log_ids,
    statusLogIds: record.status_log_ids,
    traceStatus: record.trace_status,
  }
}

function mapActualLogQualityIssueRecord(
  record: ActualLogQualityIssueApiRecord
): ActualLogQualityIssueRecord {
  return {
    issueId: record.issue_id,
    issueType: record.issue_type,
    employeeId: record.employee_id,
    businessDate: record.business_date,
    workplaceId: record.workplace_id,
    projectId: record.project_id,
    intervalStart: record.interval_start,
    intervalEnd: record.interval_end,
    gapMinutes: record.gap_minutes,
    overlapMinutes: record.overlap_minutes,
    sourceRecordIds: record.source_record_ids,
    message: record.message,
  }
}

function mapScheduleActualAnomalyRecord(
  record: ScheduleActualAnomalyApiRecord
): ScheduleActualAnomalyRecord {
  return {
    anomalyId: record.anomaly_id,
    anomalyType: record.anomaly_type,
    employeeId: record.employee_id,
    businessDate: record.business_date,
    workplaceId: record.workplace_id,
    projectId: record.project_id,
    scheduleDetailId: record.schedule_detail_id ?? null,
    loginLogId: record.login_log_id ?? null,
    statusLogIds: record.status_log_ids ?? [],
    intervalStart: record.interval_start,
    intervalEnd: record.interval_end,
    impactMinutes: record.impact_minutes,
    severity: normalizeSeverity(record.severity),
    sourceRecordIds: record.source_record_ids,
    message: record.message,
  }
}

function normalizeSeverity(value: string): ScheduleActualAnomalyRecord["severity"] {
  if (value === "high" || value === "medium" || value === "low") {
    return value
  }
  return "medium"
}
