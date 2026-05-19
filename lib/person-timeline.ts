export type TimelineEventType = "schedule" | "login" | "status"

export type TimelineEvent = {
  id: string
  type: TimelineEventType
  date: string
  label: string
  start: string
  end: string
  durationHours: number
  status?: string
}

export type TimelineAnomaly = {
  code: string
  date: string
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
}

export type TimelineCalendarDay = {
  date: string
  label: string
  weekday: string
  scheduledHours: number
  loginHours: number
  statusHours: number
  anomalyCount: number
}

export type PersonTimelineDailyView = {
  date: string
  employee: PersonTimeline
  tracks: PersonTimeline["tracks"]
  anomalies: TimelineAnomaly[]
  scheduledHours: number
  loginHours: number
  statusHours: number
}

export const timelineWorkdayStartMinutes = 8 * 60
export const timelineWorkdayEndMinutes = 20 * 60

export const fallbackPersonTimelines: PersonTimeline[] = [
  person("A-1001", "刘晨", "上海职场", "供应商 A", "博西客服", "现场主管", [
    event("SCH-1001-1", "schedule", "2026-05-11", "早班", "09:00", "12:00", 3),
    event("SCH-1001-2", "schedule", "2026-05-11", "午后班", "13:00", "18:00", 5),
    event("SCH-1001-3", "schedule", "2026-05-12", "标准班", "09:00", "17:00", 8),
  ], [
    event("LOG-1001-1", "login", "2026-05-11", "CORN 登录", "09:02", "18:00", 7.5),
    event("LOG-1001-2", "login", "2026-05-12", "CORN 登录", "09:00", "17:02", 8),
  ], [
    event("STA-1001-1", "status", "2026-05-11", "在线", "09:02", "12:00", 2.97, "productive"),
    event("STA-1001-2", "status", "2026-05-11", "培训", "13:00", "18:00", 5, "non_productive"),
    event("STA-1001-3", "status", "2026-05-12", "在线", "09:00", "17:02", 8, "productive"),
  ], [
    { code: "no_login", date: "2026-05-11", title: "午后状态缺登录切片", severity: "medium" },
  ]),
  person("A-1002", "王敏", "上海职场", "供应商 A", "博西客服", "现场主管", [
    event("SCH-1002-1", "schedule", "2026-05-11", "早班", "09:00", "17:00", 8),
    event("SCH-1002-2", "schedule", "2026-05-12", "早班", "09:00", "17:00", 8),
  ], [
    event("LOG-1002-1", "login", "2026-05-11", "CORN 登录", "09:21", "17:00", 7.5),
    event("LOG-1002-2", "login", "2026-05-12", "CORN 登录", "09:03", "17:00", 7.95),
  ], [
    event("STA-1002-1", "status", "2026-05-11", "在线", "09:21", "17:00", 7.5, "productive"),
    event("STA-1002-2", "status", "2026-05-12", "在线", "09:03", "17:00", 7.95, "productive"),
  ], [
    { code: "late_login", date: "2026-05-11", title: "迟到 21 分钟", severity: "high" },
  ]),
  person("A-1003", "张琳", "苏州职场", "供应商 B", "博西客服", "排班运营", [
    event("SCH-1003-1", "schedule", "2026-05-11", "晚班", "12:00", "20:00", 8),
  ], [
    event("LOG-1003-1", "login", "2026-05-11", "CORN 登录", "12:00", "19:35", 7.5),
  ], [
    event("STA-1003-1", "status", "2026-05-11", "在线", "12:00", "19:35", 7.5, "productive"),
  ], [
    { code: "early_logout", date: "2026-05-11", title: "早退 25 分钟", severity: "medium" },
  ]),
  person("A-1004", "陈可", "广州职场", "供应商 C", "博西客服", "运营负责人", [
    event("SCH-1004-1", "schedule", "2026-05-11", "标准班", "10:00", "17:00", 7),
  ], [
    event("LOG-1004-1", "login", "2026-05-11", "CORN 登录", "10:00", "17:00", 5),
  ], [
    event("STA-1004-1", "status", "2026-05-11", "在线", "10:00", "15:00", 5, "productive"),
    event("STA-1004-2", "status", "2026-05-11", "离线", "15:00", "16:00", 0, "unknown"),
    event("STA-1004-3", "status", "2026-05-11", "在线", "16:00", "17:00", 0, "productive"),
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

export function getPersonTimelineAvailableDates(
  row: PersonTimeline
): TimelineCalendarDay[] {
  const dates = new Set<string>()
  Object.values(row.tracks).forEach((track) => {
    track.forEach((eventItem) => dates.add(eventItem.date))
  })
  row.anomalies.forEach((anomaly) => dates.add(anomaly.date))

  return Array.from(dates)
    .sort()
    .map((date) => {
      const dailyTracks = filterTracksByDate(row, date)
      return {
        date,
        label: formatDateLabel(date),
        weekday: formatWeekday(date),
        scheduledHours: sumEvents(dailyTracks.schedule),
        loginHours: sumEvents(dailyTracks.login),
        statusHours: sumEvents(dailyTracks.status),
        anomalyCount: row.anomalies.filter((anomaly) => anomaly.date === date).length,
      }
    })
}

export function getPersonTimelineDailyView(
  row: PersonTimeline,
  requestedDate?: string
): PersonTimelineDailyView {
  const availableDates = getPersonTimelineAvailableDates(row)
  const date =
    availableDates.find((item) => item.date === requestedDate)?.date ??
    availableDates[0]?.date ??
    requestedDate ??
    ""
  const tracks = filterTracksByDate(row, date)

  return {
    date,
    employee: row,
    tracks,
    anomalies: row.anomalies.filter((anomaly) => anomaly.date === date),
    scheduledHours: sumEvents(tracks.schedule),
    loginHours: sumEvents(tracks.login),
    statusHours: sumEvents(tracks.status),
  }
}

export function getTimelineEventPosition(
  eventItem: TimelineEvent,
  startMinutes = timelineWorkdayStartMinutes,
  endMinutes = timelineWorkdayEndMinutes
) {
  const timelineLength = endMinutes - startMinutes
  const eventStart = clamp(timeToMinutes(eventItem.start), startMinutes, endMinutes)
  const eventEnd = clamp(timeToMinutes(eventItem.end), startMinutes, endMinutes)
  const widthMinutes = Math.max(eventEnd - eventStart, 5)

  return {
    leftPercent: ((eventStart - startMinutes) / timelineLength) * 100,
    widthPercent: (widthMinutes / timelineLength) * 100,
  }
}

function sumTrack(rows: PersonTimeline[], type: TimelineEventType) {
  return rows.reduce(
    (total, row) =>
      total + row.tracks[type].reduce((eventTotal, item) => eventTotal + item.durationHours, 0),
    0
  )
}

function filterTracksByDate(row: PersonTimeline, date: string) {
  return {
    schedule: row.tracks.schedule.filter((eventItem) => eventItem.date === date),
    login: row.tracks.login.filter((eventItem) => eventItem.date === date),
    status: row.tracks.status.filter((eventItem) => eventItem.date === date),
  }
}

function sumEvents(events: TimelineEvent[]) {
  return events.reduce((total, eventItem) => total + eventItem.durationHours, 0)
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
  date: string,
  label: string,
  start: string,
  end: string,
  durationHours: number,
  status?: string
): TimelineEvent {
  return { id, type, date, label, start, end, durationHours, status }
}

function timeToMinutes(value: string) {
  const [hour = "0", minute = "0"] = value.split(":")
  return Number(hour) * 60 + Number(minute)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${date}T00:00:00`))
}

function formatWeekday(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    weekday: "short",
  }).format(new Date(`${date}T00:00:00`))
}
