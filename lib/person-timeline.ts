export type TimelineEventType = "schedule" | "login" | "status"

export type TimelineEvent = {
  id: string
  type: TimelineEventType
  label: string
  start: string
  end: string
  durationHours: number
  status?: string
}

export type TimelineAnomaly = {
  code: string
  title: string
  severity: "high" | "medium" | "low"
}

export type PersonTimeline = {
  employeeId: string
  employeeName: string
  workplace: string
  supplier: string
  project: string
  owner: string
  tracks: {
    schedule: TimelineEvent[]
    login: TimelineEvent[]
    status: TimelineEvent[]
  }
  anomalies: TimelineAnomaly[]
}

export type PersonTimelineFilters = {
  query?: string
  owner?: string | "all"
  hasAnomaly?: boolean | "all"
}

export type PersonTimelineSummary = {
  totalPeople: number
  peopleWithAnomalies: number
  totalEvents: number
  scheduledHours: number
  loginHours: number
  statusHours: number
  deferredActions: string[]
}

export const deferredPersonTimelineActions = [
  "无真实登录系统接入",
  "无状态源回写",
  "无复核提交",
  "无审批、导出或批量处理",
]

export const fallbackPersonTimelines: PersonTimeline[] = [
  person("A-1001", "刘晨", "上海职场", "供应商 A", "博西客服", "现场主管", [
    event("SCH-1001-1", "schedule", "早班", "09:00", "12:00", 3),
    event("SCH-1001-2", "schedule", "午后班", "13:00", "18:00", 5),
  ], [
    event("LOG-1001-1", "login", "CORN 登录", "09:02", "18:00", 7.5),
  ], [
    event("STA-1001-1", "status", "在线", "09:02", "12:00", 2.97, "productive"),
    event("STA-1001-2", "status", "培训", "13:00", "18:00", 5, "non_productive"),
  ], [
    { code: "no_login", title: "午后状态缺登录切片", severity: "medium" },
  ]),
  person("A-1002", "王敏", "上海职场", "供应商 A", "博西客服", "现场主管", [
    event("SCH-1002-1", "schedule", "早班", "09:00", "17:00", 8),
  ], [
    event("LOG-1002-1", "login", "CORN 登录", "09:21", "17:00", 7.5),
  ], [
    event("STA-1002-1", "status", "在线", "09:21", "17:00", 7.5, "productive"),
  ], [
    { code: "late_login", title: "迟到 21 分钟", severity: "high" },
  ]),
  person("A-1003", "张琳", "苏州职场", "供应商 B", "博西客服", "排班运营", [
    event("SCH-1003-1", "schedule", "晚班", "12:00", "20:00", 8),
  ], [
    event("LOG-1003-1", "login", "CORN 登录", "12:00", "19:35", 7.5),
  ], [
    event("STA-1003-1", "status", "在线", "12:00", "19:35", 7.5, "productive"),
  ], [
    { code: "early_logout", title: "早退 25 分钟", severity: "medium" },
  ]),
  person("A-1004", "陈可", "广州职场", "供应商 C", "博西客服", "运营负责人", [
    event("SCH-1004-1", "schedule", "标准班", "10:00", "17:00", 7),
  ], [
    event("LOG-1004-1", "login", "CORN 登录", "10:00", "17:00", 5),
  ], [
    event("STA-1004-1", "status", "在线", "10:00", "15:00", 5, "productive"),
    event("STA-1004-2", "status", "离线", "15:00", "16:00", 0, "unknown"),
    event("STA-1004-3", "status", "在线", "16:00", "17:00", 0, "productive"),
  ], []),
]

export function summarizePersonTimelines(
  rows: PersonTimeline[]
): PersonTimelineSummary {
  return {
    totalPeople: rows.length,
    peopleWithAnomalies: rows.filter((row) => row.anomalies.length > 0).length,
    totalEvents: rows.reduce(
      (total, row) =>
        total + row.tracks.schedule.length + row.tracks.login.length + row.tracks.status.length,
      0
    ),
    scheduledHours: sumTrack(rows, "schedule"),
    loginHours: sumTrack(rows, "login"),
    statusHours: sumTrack(rows, "status"),
    deferredActions: deferredPersonTimelineActions,
  }
}

export function filterPersonTimelines(
  rows: PersonTimeline[],
  { query = "", owner = "all", hasAnomaly = "all" }: PersonTimelineFilters
) {
  const normalizedQuery = query.trim().toLowerCase()

  return rows.filter((row) => {
    if (owner !== "all" && row.owner !== owner) {
      return false
    }

    if (hasAnomaly !== "all" && (row.anomalies.length > 0) !== hasAnomaly) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return [
      row.employeeId,
      row.employeeName,
      row.workplace,
      row.supplier,
      row.project,
      row.owner,
      ...row.anomalies.flatMap((anomaly) => [anomaly.code, anomaly.title]),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

export function getPersonTimeline(employeeId: string) {
  return fallbackPersonTimelines.find((row) => row.employeeId === employeeId)
}

function sumTrack(rows: PersonTimeline[], type: TimelineEventType) {
  return rows.reduce(
    (total, row) =>
      total + row.tracks[type].reduce((eventTotal, item) => eventTotal + item.durationHours, 0),
    0
  )
}

function person(
  employeeId: string,
  employeeName: string,
  workplace: string,
  supplier: string,
  project: string,
  owner: string,
  schedule: TimelineEvent[],
  login: TimelineEvent[],
  status: TimelineEvent[],
  anomalies: TimelineAnomaly[]
): PersonTimeline {
  return {
    employeeId,
    employeeName,
    workplace,
    supplier,
    project,
    owner,
    tracks: { schedule, login, status },
    anomalies,
  }
}

function event(
  id: string,
  type: TimelineEventType,
  label: string,
  start: string,
  end: string,
  durationHours: number,
  status?: string
): TimelineEvent {
  return { id, type, label, start, end, durationHours, status }
}
