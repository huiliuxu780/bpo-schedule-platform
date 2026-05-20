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

export type PersonTimelineWeekDay = TimelineCalendarDay & {
  gapHours: number
}

export type PersonTimelineWeekSummary = {
  scheduledDays: number
  loginDays: number
  scheduledHours: number
  loginHours: number
  gapHours: number
  anomalyCount: number
}

export type PersonTimelineWeekView = {
  employee: PersonTimeline
  weekStart: string
  weekEnd: string
  selectedDate: string
  days: PersonTimelineWeekDay[]
  summary: PersonTimelineWeekSummary
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

export type FulfillmentDayMetrics = {
  date: string
  label: string
  weekday: string
  plannedPeople: number
  loginPeople: number
  gapPeople: number
  anomalyPeople: number
}

export type FulfillmentCalendarSummary = {
  plannedPeople: number
  loginPeople: number
  gapPeople: number
  anomalyPeople: number
}

export type FulfillmentGroupWeek = {
  id: string
  teamId: string
  supplier: string
  days: FulfillmentDayMetrics[]
  summary: FulfillmentCalendarSummary
  members: PersonTimeline[]
}

export type FulfillmentTeamWeek = {
  id: string
  workplace: string
  project: string
  days: FulfillmentDayMetrics[]
  summary: FulfillmentCalendarSummary
  groups: FulfillmentGroupWeek[]
}

export type FulfillmentCalendar = {
  weekStart: string
  weekEnd: string
  weekDays: FulfillmentDayMetrics[]
  summary: FulfillmentCalendarSummary
  teams: FulfillmentTeamWeek[]
}

export type FulfillmentMatrixMember = {
  employeeId: string
  employeeName: string
  workplace: string
  supplier: string
  project: string
  tracks: PersonTimeline["tracks"]
  anomalies: TimelineAnomaly[]
  scheduledHours: number
  loginHours: number
  statusHours: number
}

export type FulfillmentGroupMatrix = {
  date: string
  team: FulfillmentTeamWeek
  group: FulfillmentGroupWeek
  summary: FulfillmentCalendarSummary
  members: FulfillmentMatrixMember[]
}

export type FulfillmentGroupMemberWeekMatrixMember = {
  employeeId: string
  employeeName: string
  workplace: string
  supplier: string
  project: string
  days: PersonTimelineWeekDay[]
  summary: PersonTimelineWeekSummary
}

export type FulfillmentGroupMemberWeekMatrix = {
  weekStart: string
  weekEnd: string
  team: FulfillmentTeamWeek
  group: FulfillmentGroupWeek
  summary: {
    memberCount: number
    scheduledDays: number
    loginDays: number
    gapHours: number
    anomalyCount: number
  }
  riskSummary: {
    riskMemberCount: number
    highestGapMember: string
    highestAnomalyMember: string
    highestGapDate: string
  }
  members: FulfillmentGroupMemberWeekMatrixMember[]
}

export const timelineWorkdayStartMinutes = 8 * 60
export const timelineWorkdayEndMinutes = 20 * 60
export const fulfillmentDefaultWeekStart = "2026-05-11"

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
  person("A-1005", "赵岩", "上海职场", "供应商 B", "博西客服", "现场主管", [
    event("SCH-1005-1", "schedule", "2026-05-11", "标准班", "09:00", "18:00", 8),
    event("SCH-1005-2", "schedule", "2026-05-12", "早班", "09:00", "17:00", 8),
  ], [
    event("LOG-1005-1", "login", "2026-05-11", "CORN 登录", "09:00", "18:00", 8),
    event("LOG-1005-2", "login", "2026-05-12", "CORN 登录", "09:10", "17:00", 7),
  ], [
    event("STA-1005-1", "status", "2026-05-11", "在线", "09:00", "18:00", 8, "productive"),
    event("STA-1005-2", "status", "2026-05-12", "在线", "09:10", "17:00", 7, "productive"),
  ], []),
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

export function getPersonTimelineWeekView(
  row: PersonTimeline,
  requestedDate?: string,
  weekStart = fulfillmentDefaultWeekStart
): PersonTimelineWeekView {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index)
    const dailyTracks = filterTracksByDate(row, date)
    const scheduledHours = sumEvents(dailyTracks.schedule)
    const loginHours = sumEvents(dailyTracks.login)
    const statusHours = sumEvents(dailyTracks.status)
    const anomalyCount = row.anomalies.filter((anomaly) => anomaly.date === date).length

    return {
      date,
      label: formatDateLabel(date),
      weekday: formatWeekday(date),
      scheduledHours,
      loginHours,
      statusHours,
      gapHours: Math.max(scheduledHours - loginHours, 0),
      anomalyCount,
    }
  })

  return {
    employee: row,
    weekStart,
    weekEnd: days[days.length - 1]?.date ?? weekStart,
    selectedDate: days.some((day) => day.date === requestedDate) ? requestedDate ?? weekStart : weekStart,
    days,
    summary: days.reduce(
      (summary, day) => ({
        scheduledDays: summary.scheduledDays + Number(day.scheduledHours > 0),
        loginDays: summary.loginDays + Number(day.loginHours > 0),
        scheduledHours: summary.scheduledHours + day.scheduledHours,
        loginHours: summary.loginHours + day.loginHours,
        gapHours: summary.gapHours + day.gapHours,
        anomalyCount: summary.anomalyCount + day.anomalyCount,
      }),
      {
        scheduledDays: 0,
        loginDays: 0,
        scheduledHours: 0,
        loginHours: 0,
        gapHours: 0,
        anomalyCount: 0,
      }
    ),
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

export function getFulfillmentCalendar(
  rows = fallbackPersonTimelines,
  weekStart = fulfillmentDefaultWeekStart
): FulfillmentCalendar {
  const weekDays = buildWeekDays(weekStart)
  const teams = Array.from(groupBy(rows, teamKey).entries())
    .map(([id, members]) => {
      const [workplace = "", project = ""] = id.split("||")
      const groups = Array.from(groupBy(members, groupKey).entries())
        .map(([supplier, groupMembers]) => {
          const groupDays = weekDays.map((day) => buildDayMetrics(day.date, groupMembers))
          return {
            id: `${id}||${supplier}`,
            teamId: id,
            supplier,
            days: groupDays,
            summary: summarizeDayMetrics(groupDays),
            members: groupMembers,
          }
        })
        .sort(compareFulfillmentRisk)

      const days = weekDays.map((day) => buildDayMetrics(day.date, members))
      return {
        id,
        workplace,
        project,
        days,
        summary: summarizeDayMetrics(days),
        groups,
      }
    })
    .sort(compareFulfillmentRisk)

  const summary = summarizeDayMetrics(teams.flatMap((team) => team.days))

  return {
    weekStart,
    weekEnd: weekDays[weekDays.length - 1]?.date ?? weekStart,
    weekDays,
    summary,
    teams,
  }
}

export function getFulfillmentTeam(
  teamId: string | undefined,
  rows = fallbackPersonTimelines,
  weekStart = fulfillmentDefaultWeekStart
) {
  const calendar = getFulfillmentCalendar(rows, weekStart)
  return calendar.teams.find((team) => team.id === decodeScopeId(teamId))
}

export function getFulfillmentGroup(
  teamId: string | undefined,
  groupId: string | undefined,
  rows = fallbackPersonTimelines,
  weekStart = fulfillmentDefaultWeekStart
) {
  const team = getFulfillmentTeam(teamId, rows, weekStart)
  return team?.groups.find((group) => group.id === decodeScopeId(groupId))
}

export function getFulfillmentMatrix(
  teamId: string | undefined,
  groupId: string | undefined,
  date: string | undefined,
  rows = fallbackPersonTimelines,
  weekStart = fulfillmentDefaultWeekStart
): FulfillmentGroupMatrix | undefined {
  const team = getFulfillmentTeam(teamId, rows, weekStart)
  if (!team) {
    return undefined
  }

  const group = team.groups.find((item) => item.id === decodeScopeId(groupId))
  if (!group) {
    return undefined
  }

  const selectedDate = date && group.days.some((day) => day.date === date) ? date : weekStart
  const members = group.members
    .map((member) => {
      const dailyView = getPersonTimelineDailyView(member, selectedDate)
      return {
        employeeId: member.employeeId,
        employeeName: member.employeeName,
        workplace: member.workplace,
        supplier: member.supplier,
        project: member.project,
        tracks: dailyView.tracks,
        anomalies: dailyView.anomalies,
        scheduledHours: dailyView.scheduledHours,
        loginHours: dailyView.loginHours,
        statusHours: dailyView.statusHours,
      }
    })
    .sort((a, b) => {
      const riskA = Number(a.scheduledHours > a.loginHours) + a.anomalies.length
      const riskB = Number(b.scheduledHours > b.loginHours) + b.anomalies.length
      return riskB - riskA || a.employeeId.localeCompare(b.employeeId)
    })

  return {
    date: selectedDate,
    team,
    group,
    summary: buildDayMetrics(selectedDate, group.members),
    members,
  }
}

export function getFulfillmentGroupMemberWeekMatrix(
  teamId: string | undefined,
  groupId: string | undefined,
  rows = fallbackPersonTimelines,
  weekStart = fulfillmentDefaultWeekStart
): FulfillmentGroupMemberWeekMatrix | undefined {
  const team = getFulfillmentTeam(teamId, rows, weekStart)
  if (!team) {
    return undefined
  }

  const group = team.groups.find((item) => item.id === decodeScopeId(groupId))
  if (!group) {
    return undefined
  }

  const members = group.members
    .map((member) => {
      const weekView = getPersonTimelineWeekView(member, weekStart, weekStart)

      return {
        employeeId: member.employeeId,
        employeeName: member.employeeName,
        workplace: member.workplace,
        supplier: member.supplier,
        project: member.project,
        days: weekView.days,
        summary: weekView.summary,
      }
    })
    .sort((a, b) => {
      return (
        b.summary.gapHours - a.summary.gapHours ||
        b.summary.anomalyCount - a.summary.anomalyCount ||
        a.employeeId.localeCompare(b.employeeId)
      )
    })

  return {
    weekStart,
    weekEnd: addDays(weekStart, 6),
    team,
    group,
    summary: members.reduce(
      (summary, member) => ({
        memberCount: summary.memberCount,
        scheduledDays: summary.scheduledDays + member.summary.scheduledDays,
        loginDays: summary.loginDays + member.summary.loginDays,
        gapHours: summary.gapHours + member.summary.gapHours,
        anomalyCount: summary.anomalyCount + member.summary.anomalyCount,
      }),
      {
        memberCount: members.length,
        scheduledDays: 0,
        loginDays: 0,
        gapHours: 0,
        anomalyCount: 0,
      }
    ),
    riskSummary: buildGroupMemberWeekRiskSummary(members),
    members,
  }
}

export function encodeScopeId(value: string) {
  return encodeURIComponent(value)
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

function buildWeekDays(weekStart: string): FulfillmentDayMetrics[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index)
    return {
      date,
      label: formatDateLabel(date),
      weekday: formatWeekday(date),
      plannedPeople: 0,
      loginPeople: 0,
      gapPeople: 0,
      anomalyPeople: 0,
    }
  })
}

function buildDayMetrics(date: string, rows: PersonTimeline[]): FulfillmentDayMetrics {
  const plannedPeople = rows.filter((row) => sumEvents(filterTracksByDate(row, date).schedule) > 0)
    .length
  const loginPeople = rows.filter((row) => sumEvents(filterTracksByDate(row, date).login) > 0).length
  const gapPeople = rows.filter((row) => {
    const dailyTracks = filterTracksByDate(row, date)
    return sumEvents(dailyTracks.schedule) > sumEvents(dailyTracks.login)
  }).length
  const anomalyPeople = rows.filter((row) =>
    row.anomalies.some((anomaly) => anomaly.date === date)
  ).length

  return {
    date,
    label: formatDateLabel(date),
    weekday: formatWeekday(date),
    plannedPeople,
    loginPeople,
    gapPeople,
    anomalyPeople,
  }
}

function summarizeDayMetrics(days: FulfillmentDayMetrics[]): FulfillmentCalendarSummary {
  return days.reduce(
    (summary, day) => ({
      plannedPeople: summary.plannedPeople + day.plannedPeople,
      loginPeople: summary.loginPeople + day.loginPeople,
      gapPeople: summary.gapPeople + day.gapPeople,
      anomalyPeople: summary.anomalyPeople + day.anomalyPeople,
    }),
    {
      plannedPeople: 0,
      loginPeople: 0,
      gapPeople: 0,
      anomalyPeople: 0,
    }
  )
}

function buildGroupMemberWeekRiskSummary(members: FulfillmentGroupMemberWeekMatrixMember[]) {
  const riskMembers = members.filter(
    (member) => member.summary.gapHours > 0 || member.summary.anomalyCount > 0
  )
  const highestGapMember = [...members].sort(
    (a, b) => b.summary.gapHours - a.summary.gapHours || a.employeeId.localeCompare(b.employeeId)
  )[0]
  const highestAnomalyMember = [...members].sort(
    (a, b) =>
      b.summary.anomalyCount - a.summary.anomalyCount || a.employeeId.localeCompare(b.employeeId)
  )[0]
  const highestGapDay = members
    .flatMap((member) => member.days)
    .sort((a, b) => b.gapHours - a.gapHours || a.date.localeCompare(b.date))[0]

  return {
    riskMemberCount: riskMembers.length,
    highestGapMember: highestGapMember
      ? `${highestGapMember.employeeId} ${highestGapMember.employeeName}`
      : "",
    highestAnomalyMember: highestAnomalyMember
      ? `${highestAnomalyMember.employeeId} ${highestAnomalyMember.employeeName}`
      : "",
    highestGapDate: highestGapDay?.date ?? "",
  }
}

function compareFulfillmentRisk(
  a: { summary: FulfillmentCalendarSummary },
  b: { summary: FulfillmentCalendarSummary }
) {
  return (
    b.summary.gapPeople - a.summary.gapPeople ||
    b.summary.anomalyPeople - a.summary.anomalyPeople ||
    b.summary.plannedPeople - a.summary.plannedPeople
  )
}

function teamKey(row: PersonTimeline) {
  return `${row.workplace}||${row.project}`
}

function groupKey(row: PersonTimeline) {
  return row.supplier
}

function groupBy<T>(rows: T[], getKey: (row: T) => string) {
  return rows.reduce((groups, row) => {
    const key = getKey(row)
    const group = groups.get(key) ?? []
    group.push(row)
    groups.set(key, group)
    return groups
  }, new Map<string, T[]>())
}

function decodeScopeId(value: string | undefined) {
  if (!value) {
    return ""
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function addDays(date: string, offset: number) {
  const [year = "0", month = "1", day = "1"] = date.split("-")
  const nextDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + offset))
  return nextDate.toISOString().slice(0, 10)
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
