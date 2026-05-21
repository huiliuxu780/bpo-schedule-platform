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

export type TimelineExceptionExplanation = {
  id: string
  anomalyCode: string
  type: "登录缺口" | "状态不一致" | "登录不足"
  title: string
  date: string
  start: string
  end: string
  involvedTracks: TimelineEventType[]
  impactHours: number
  evidence: string
  supervisorAction: string
  priority: TimelineAnomaly["severity"]
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
  exceptionExplanations: TimelineExceptionExplanation[]
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
  riskSummary: {
    highestRiskGroup: string
    highestRiskDate: string
    highestRiskMember: string
    gapPeople: number
    anomalyPeople: number
  }
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
  exceptionExplanations: TimelineExceptionExplanation[]
  scheduledHours: number
  loginHours: number
  statusHours: number
}

export type FulfillmentMatrixExceptionQueueItem = {
  key: string
  employeeId: string
  employeeName: string
  anomalyCode: string
  type: TimelineExceptionExplanation["type"]
  title: string
  priority: TimelineExceptionExplanation["priority"]
  impactHours: number
  start: string
  end: string
  detailDate: string
  involvedTracks: TimelineEventType[]
  focusEventIds: string[]
  sortReason: string
  evidenceCards: Array<{
    track: TimelineEventType
    eventId: string
    label: string
    start: string
    end: string
  }>
  evidence: string
  supervisorAction: string
  handlingGuide: {
    priorityChecks: string[]
    requiredInfo: string[]
    communicationTarget: string
    boundary: string
  }
  evidenceSummary: {
    schedule: string
    login: string
    status: string
    conclusion: string
  }
  handlingRecords: Array<{
    recordedAt: string
    recorder: string
    conclusion: string
    followUp: string
  }>
  handlingOutcome: {
    category: "到岗核对" | "状态核对" | "数据核对"
    reason: string
    ownerRole: string
    nextReviewPoint: string
  }
  handoffSummary: {
    recipient: string
    summary: string
    openQuestions: string[]
    nextTouchpoint: string
  }
  dataCheckReadiness: {
    sourceRecords: string[]
    checkFields: string[]
    riskNote: string
  }
}

export type FulfillmentMatrixExceptionQueueSummary = {
  totalCount: number
  highPriorityCount: number
  loginGapCount: number
  statusMismatchCount: number
  totalImpactHours: number
}

export type FulfillmentMatrixExceptionQueueCursor = {
  selected?: FulfillmentMatrixExceptionQueueItem
  selectedIndex: number
  totalCount: number
  previous?: FulfillmentMatrixExceptionQueueItem
  next?: FulfillmentMatrixExceptionQueueItem
}

export type FulfillmentGroupMatrix = {
  date: string
  team: FulfillmentTeamWeek
  group: FulfillmentGroupWeek
  summary: FulfillmentCalendarSummary
  members: FulfillmentMatrixMember[]
  exceptionQueue: FulfillmentMatrixExceptionQueueItem[]
  exceptionQueueSummary: FulfillmentMatrixExceptionQueueSummary
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

export type FulfillmentGroupMemberWeekWatchItem = {
  key: string
  employeeId: string
  employeeName: string
  date: string
  title: string
  reason: string
  priority: TimelineAnomaly["severity"]
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
  watchlist: FulfillmentGroupMemberWeekWatchItem[]
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
    exceptionExplanations: buildExceptionExplanations(row, date, tracks),
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
        riskSummary: buildTeamWeekRiskSummary(groups),
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
        exceptionExplanations: dailyView.exceptionExplanations,
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
  const exceptionQueue = buildFulfillmentMatrixExceptionQueue(members, selectedDate)

  return {
    date: selectedDate,
    team,
    group,
    summary: buildDayMetrics(selectedDate, group.members),
    members,
    exceptionQueue,
    exceptionQueueSummary: summarizeFulfillmentMatrixExceptionQueue(exceptionQueue),
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
    watchlist: buildGroupMemberWeekWatchlist(members),
    members,
  }
}

export function getFulfillmentMatrixExceptionQueueCursor(
  visibleQueue: FulfillmentMatrixExceptionQueueItem[],
  selectedExceptionKey?: string
): FulfillmentMatrixExceptionQueueCursor {
  if (visibleQueue.length === 0) {
    return {
      selectedIndex: 0,
      totalCount: 0,
    }
  }

  const selectedIndex = Math.max(
    visibleQueue.findIndex((item) => item.key === selectedExceptionKey),
    0
  )

  return {
    selected: visibleQueue[selectedIndex],
    selectedIndex: selectedIndex + 1,
    totalCount: visibleQueue.length,
    previous: visibleQueue[selectedIndex - 1],
    next: visibleQueue[selectedIndex + 1],
  }
}

export function encodeScopeId(value: string) {
  return encodeURIComponent(value)
}

export function buildPersonFulfillmentDetailHref({
  employeeId,
  date,
  teamId,
  groupId,
  returnDate,
  queueFilter,
  exceptionKey,
}: {
  employeeId: string
  date: string
  teamId?: string
  groupId?: string
  returnDate?: string
  queueFilter?: string
  exceptionKey?: string
}) {
  const params = new URLSearchParams({ date })

  if (teamId && groupId) {
    params.set("team", teamId)
    params.set("group", groupId)
  }

  if (returnDate) {
    params.set("returnDate", returnDate)
  }

  if (queueFilter) {
    params.set("queue", queueFilter)
  }

  if (exceptionKey) {
    params.set("exception", exceptionKey)
  }

  return `/person-timeline/${encodeScopeId(employeeId)}?${params.toString()}`
}

export function buildFulfillmentMatrixReturnHref({
  teamId,
  groupId,
  date,
  queueFilter,
  exceptionKey,
}: {
  teamId: string
  groupId: string
  date: string
  queueFilter?: string
  exceptionKey?: string
}) {
  const params = new URLSearchParams({
    team: teamId,
    group: groupId,
    date,
  })

  if (queueFilter) {
    params.set("queue", queueFilter)
  }

  if (exceptionKey) {
    params.set("exception", exceptionKey)
  }

  return `/person-timeline?${params.toString()}`
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

function buildExceptionExplanations(
  row: PersonTimeline,
  date: string,
  tracks: PersonTimeline["tracks"]
): TimelineExceptionExplanation[] {
  return row.anomalies
    .filter((anomaly) => anomaly.date === date)
    .map((anomaly) => {
      if (anomaly.code === "late_login") {
        return buildLateLoginExplanation(row, anomaly, tracks)
      }

      if (anomaly.code === "early_logout") {
        return buildEarlyLogoutExplanation(row, anomaly, tracks)
      }

      return buildStatusMismatchExplanation(row, anomaly, tracks)
    })
}

function buildFulfillmentMatrixExceptionQueue(
  members: FulfillmentMatrixMember[],
  date: string
): FulfillmentMatrixExceptionQueueItem[] {
  return members
    .flatMap((member) =>
      member.exceptionExplanations.map((explanation) => {
        const evidenceCards = getEvidenceCards(member, explanation)

        return {
          key: fulfillmentMatrixExceptionKey(member.employeeId, explanation.anomalyCode),
          employeeId: member.employeeId,
          employeeName: member.employeeName,
          anomalyCode: explanation.anomalyCode,
          type: explanation.type,
          title: explanation.title,
          priority: explanation.priority,
          impactHours: explanation.impactHours,
          start: explanation.start,
          end: explanation.end,
          detailDate: date,
          involvedTracks: explanation.involvedTracks,
          focusEventIds: evidenceCards.map((card) => card.eventId),
          sortReason: buildExceptionSortReason(
            explanation.priority,
            explanation.impactHours,
            member.employeeId
          ),
          evidenceCards,
          evidence: explanation.evidence,
          supervisorAction: explanation.supervisorAction,
          handlingGuide: buildExceptionHandlingGuide(member, explanation, evidenceCards),
          evidenceSummary: summarizeExceptionEvidence(explanation, evidenceCards),
          handlingRecords: getExceptionHandlingRecords(explanation),
          handlingOutcome: buildExceptionHandlingOutcome(member, explanation, evidenceCards),
          handoffSummary: buildExceptionHandoffSummary(member, explanation),
          dataCheckReadiness: buildExceptionDataCheckReadiness(explanation, evidenceCards),
        }
      })
    )
    .sort(
      (a, b) =>
        priorityRank[b.priority] - priorityRank[a.priority] ||
        b.impactHours - a.impactHours ||
        a.employeeId.localeCompare(b.employeeId)
    )
}

function buildExceptionSortReason(
  priority: TimelineExceptionExplanation["priority"],
  impactHours: number,
  employeeId: string
) {
  return `${priorityText[priority]}优先 / 影响 ${formatImpactHours(impactHours)}h / 员工 ${employeeId}`
}

function formatImpactHours(value: number) {
  return Number.isInteger(value) ? `${value}` : `${value}`
}

function getEvidenceCards(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation
) {
  return explanation.involvedTracks.flatMap((trackType) =>
    member.tracks[trackType]
      .filter((eventItem) => isEventInExceptionWindow(eventItem, explanation))
      .map((eventItem) => ({
        track: trackType,
        eventId: eventItem.id,
        label: eventItem.label,
        start: eventItem.start,
        end: eventItem.end,
      }))
  )
}

function buildExceptionHandlingGuide(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation,
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"]
) {
  const scheduleCard = evidenceCards.find((card) => card.track === "schedule")
  const loginCard = evidenceCards.find((card) => card.track === "login")
  const statusCard = evidenceCards.find((card) => card.track === "status")
  const communicationTarget = `${member.employeeName} / 现场主管`
  const boundary = "当前仅记录跟进过程，处理动作由线下流程完成。"

  if (explanation.type === "登录缺口") {
    return {
      priorityChecks: [
        `核对排班开始时间 ${scheduleCard?.start ?? explanation.start}`,
        `核对登录开始时间 ${loginCard?.start ?? explanation.end}`,
        "确认员工实际到岗时间",
      ],
      requiredInfo: ["到岗说明", "迟到或漏登原因", "现场主管确认口径"],
      communicationTarget,
      boundary,
    }
  }

  if (explanation.type === "登录不足") {
    return {
      priorityChecks: [
        `核对登录结束时间 ${loginCard?.end ?? explanation.start}`,
        `核对排班结束时间 ${scheduleCard?.end ?? explanation.end}`,
        "确认员工实际离岗时间",
      ],
      requiredInfo: ["离岗说明", "提前离岗或系统记录原因", "现场主管确认口径"],
      communicationTarget,
      boundary,
    }
  }

  return {
    priorityChecks: [
      `核对状态轨道 ${statusCard?.label ?? "状态异常"}`,
      `核对排班覆盖 ${explanation.start}-${explanation.end}`,
      "确认培训安排是否登记",
    ],
    requiredInfo: ["培训安排说明", "在线要求确认", "主管复核结论"],
    communicationTarget,
    boundary,
  }
}

function buildExceptionHandlingOutcome(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation,
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"]
) {
  const scheduleCard = evidenceCards.find((card) => card.track === "schedule")
  const loginCard = evidenceCards.find((card) => card.track === "login")
  const statusCard = evidenceCards.find((card) => card.track === "status")

  if (explanation.type === "登录缺口") {
    return {
      category: "到岗核对" as const,
      reason: `排班开始 ${scheduleCard?.start ?? explanation.start}，登录开始 ${
        loginCard?.start ?? explanation.end
      }。`,
      ownerRole: "现场主管",
      nextReviewPoint: `确认${member.employeeName}实际到岗时间和迟到原因。`,
    }
  }

  if (explanation.type === "登录不足") {
    return {
      category: "到岗核对" as const,
      reason: `登录结束 ${loginCard?.end ?? explanation.start}，排班结束 ${
        scheduleCard?.end ?? explanation.end
      }。`,
      ownerRole: "现场主管",
      nextReviewPoint: `确认${member.employeeName}实际离岗时间和离岗原因。`,
    }
  }

  return {
    category: "状态核对" as const,
    reason: `状态轨道为${statusCard?.label ?? "异常"}，覆盖 ${explanation.start}-${explanation.end}。`,
    ownerRole: "现场主管",
    nextReviewPoint: "确认培训安排是否符合当班在线要求。",
  }
}

function buildExceptionHandoffSummary(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation
) {
  if (explanation.type === "登录缺口") {
    return {
      recipient: "现场主管",
      summary: `${member.employeeName} ${explanation.start}-${explanation.end} 登录缺口，影响 ${formatImpactHours(
        explanation.impactHours
      )}h。`,
      openQuestions: ["是否实际到岗但漏登", "迟到原因是否已说明"],
      nextTouchpoint: "班前到岗核对记录",
    }
  }

  if (explanation.type === "登录不足") {
    return {
      recipient: "现场主管",
      summary: `${member.employeeName} ${explanation.start}-${explanation.end} 登录不足，影响 ${formatImpactHours(
        explanation.impactHours
      )}h。`,
      openQuestions: ["是否提前离岗", "系统登出时间是否准确"],
      nextTouchpoint: "班后离岗核对记录",
    }
  }

  return {
    recipient: "现场主管",
    summary: `${member.employeeName} ${explanation.start}-${explanation.end} 状态不一致，影响 ${formatImpactHours(
      explanation.impactHours
    )}h。`,
    openQuestions: ["培训安排是否已登记", "当班在线要求是否允许该状态"],
    nextTouchpoint: "状态轨道复核记录",
  }
}

function buildExceptionDataCheckReadiness(
  explanation: TimelineExceptionExplanation,
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"]
) {
  const sourceRecords = evidenceCards.map((card) => card.eventId)

  if (explanation.type === "登录缺口") {
    return {
      sourceRecords,
      checkFields: ["排班开始时间", "登录开始时间", "员工到岗说明"],
      riskNote: "若登录时间来自系统延迟，需由数据管理员核对原始日志。",
    }
  }

  if (explanation.type === "登录不足") {
    return {
      sourceRecords,
      checkFields: ["排班结束时间", "登录结束时间", "员工离岗说明"],
      riskNote: "若登出时间来自系统断连，需由数据管理员核对原始日志。",
    }
  }

  return {
    sourceRecords,
    checkFields: ["排班覆盖时段", "登录覆盖时段", "状态类型", "培训安排说明"],
    riskNote: "若状态记录来自人工标记，需核对状态来源和登记说明。",
  }
}

function summarizeExceptionEvidence(
  explanation: TimelineExceptionExplanation,
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"]
) {
  const scheduleCard = evidenceCards.find((card) => card.track === "schedule")
  const loginCard = evidenceCards.find((card) => card.track === "login")
  const statusCard = evidenceCards.find((card) => card.track === "status")

  return {
    schedule: formatEvidenceSummaryLine("排班", scheduleCard),
    login: formatEvidenceSummaryLine("登录", loginCard),
    status: formatEvidenceSummaryLine("状态", statusCard),
    conclusion: buildExceptionEvidenceConclusion(explanation, statusCard),
  }
}

function formatEvidenceSummaryLine(
  label: "排班" | "登录" | "状态",
  card?: FulfillmentMatrixExceptionQueueItem["evidenceCards"][number]
) {
  if (!card) {
    return `${label}轨道：无命中记录`
  }

  return `${label} ${card.eventId}：${card.label} ${card.start}-${card.end}`
}

function buildExceptionEvidenceConclusion(
  explanation: TimelineExceptionExplanation,
  statusCard?: FulfillmentMatrixExceptionQueueItem["evidenceCards"][number]
) {
  if (explanation.type === "登录缺口") {
    return `${explanation.start}-${explanation.end} 存在登录缺口，需核对到岗或漏登原因。`
  }

  if (explanation.type === "登录不足") {
    return `${explanation.start}-${explanation.end} 存在登录不足，需核对离岗或系统记录原因。`
  }

  return `${explanation.start}-${explanation.end} 状态为${statusCard?.label ?? "异常"}，需确认是否符合当班在线要求。`
}

function getExceptionHandlingRecords(explanation: TimelineExceptionExplanation) {
  if (explanation.type === "登录缺口") {
    return [
      {
        recordedAt: `${explanation.date} 09:35`,
        recorder: "现场主管",
        conclusion: "已联系员工确认到岗时间。",
        followUp: "等待补充迟到或漏登原因。",
      },
    ]
  }

  if (explanation.type === "登录不足") {
    return [
      {
        recordedAt: `${explanation.date} 17:45`,
        recorder: "现场主管",
        conclusion: "已标记需核对离岗原因。",
        followUp: "等待员工补充说明。",
      },
    ]
  }

  return [
    {
      recordedAt: `${explanation.date} 14:10`,
      recorder: "现场主管",
      conclusion: "已核对状态轨道与排班轨道。",
      followUp: "等待确认培训安排是否登记。",
    },
  ]
}

function fulfillmentMatrixExceptionKey(employeeId: string, anomalyCode: string) {
  return `${employeeId}::${anomalyCode}`
}

function isEventInExceptionWindow(
  eventItem: TimelineEvent,
  explanation: TimelineExceptionExplanation
) {
  const eventStart = timeToMinutes(eventItem.start)
  const eventEnd = timeToMinutes(eventItem.end)
  const focusStart = timeToMinutes(explanation.start)
  const focusEnd = timeToMinutes(explanation.end)

  return eventStart <= focusEnd && eventEnd >= focusStart
}

function summarizeFulfillmentMatrixExceptionQueue(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentMatrixExceptionQueueSummary {
  return {
    totalCount: queue.length,
    highPriorityCount: queue.filter((item) => item.priority === "high").length,
    loginGapCount: queue.filter((item) => item.type === "登录缺口").length,
    statusMismatchCount: queue.filter((item) => item.type === "状态不一致").length,
    totalImpactHours: roundHours(queue.reduce((total, item) => total + item.impactHours, 0)),
  }
}

function buildLateLoginExplanation(
  row: PersonTimeline,
  anomaly: TimelineAnomaly,
  tracks: PersonTimeline["tracks"]
): TimelineExceptionExplanation {
  const scheduleStart = earliestTime(tracks.schedule.map((item) => item.start))
  const loginStart = earliestTime(tracks.login.map((item) => item.start))
  const start = scheduleStart || loginStart || "00:00"
  const end = loginStart || start
  const impactHours = roundHours(Math.max(timeToMinutes(end) - timeToMinutes(start), 0) / 60)

  return {
    id: exceptionExplanationId(row, anomaly),
    anomalyCode: anomaly.code,
    type: "登录缺口",
    title: anomaly.title,
    date: anomaly.date,
    start,
    end,
    involvedTracks: ["schedule", "login"],
    impactHours,
    evidence: `该时段有排班要求，但登录从 ${end} 才开始，需确认是否漏登或迟到。`,
    supervisorAction: "先联系员工确认到岗时间；如为漏登，补充登录原因。",
    priority: anomaly.severity,
  }
}

function buildEarlyLogoutExplanation(
  row: PersonTimeline,
  anomaly: TimelineAnomaly,
  tracks: PersonTimeline["tracks"]
): TimelineExceptionExplanation {
  const loginEnd = latestTime(tracks.login.map((item) => item.end))
  const scheduleEnd = latestTime(tracks.schedule.map((item) => item.end))
  const start = loginEnd || scheduleEnd || "00:00"
  const end = scheduleEnd || start
  const impactHours = roundHours(Math.max(timeToMinutes(end) - timeToMinutes(start), 0) / 60)

  return {
    id: exceptionExplanationId(row, anomaly),
    anomalyCode: anomaly.code,
    type: "登录不足",
    title: anomaly.title,
    date: anomaly.date,
    start,
    end,
    involvedTracks: ["schedule", "login"],
    impactHours,
    evidence: `该时段仍有排班要求，但登录在 ${start} 已结束，需确认是否提前离岗。`,
    supervisorAction: "先确认员工离岗原因；如为系统记录异常，补充说明。",
    priority: anomaly.severity,
  }
}

function buildStatusMismatchExplanation(
  row: PersonTimeline,
  anomaly: TimelineAnomaly,
  tracks: PersonTimeline["tracks"]
): TimelineExceptionExplanation {
  const statusIssue =
    tracks.status.find((item) => item.status !== "productive") ?? tracks.status[0] ?? tracks.schedule[0]
  const start = statusIssue?.start ?? tracks.schedule[0]?.start ?? "00:00"
  const end = statusIssue?.end ?? tracks.schedule[0]?.end ?? start
  const statusLabel = statusIssue?.label ?? "状态异常"
  const impactHours = roundHours(statusIssue?.durationHours ?? 0)

  return {
    id: exceptionExplanationId(row, anomaly),
    anomalyCode: anomaly.code,
    type: "状态不一致",
    title: anomaly.title,
    date: anomaly.date,
    start,
    end,
    involvedTracks: ["schedule", "login", "status"],
    impactHours,
    evidence: `该时段有排班和登录记录，但状态轨道为${statusLabel}，需确认是否符合当班在线要求。`,
    supervisorAction: "先确认培训安排是否已登记；若未登记，联系员工恢复在线或补充原因。",
    priority: anomaly.severity,
  }
}

function exceptionExplanationId(row: PersonTimeline, anomaly: TimelineAnomaly) {
  return `EXP-${row.employeeId}-${anomaly.date}-${anomaly.code}`
}

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1,
}

const priorityText = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
}

function earliestTime(values: string[]) {
  return values.filter(Boolean).sort((a, b) => timeToMinutes(a) - timeToMinutes(b))[0] ?? ""
}

function latestTime(values: string[]) {
  return values.filter(Boolean).sort((a, b) => timeToMinutes(b) - timeToMinutes(a))[0] ?? ""
}

function roundHours(value: number) {
  return Math.round(value * 100) / 100
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

function buildGroupMemberWeekWatchlist(
  members: FulfillmentGroupMemberWeekMatrixMember[]
): FulfillmentGroupMemberWeekWatchItem[] {
  return members
    .flatMap((member) =>
      member.days
        .filter((day) => day.gapHours > 0 || day.anomalyCount > 0)
        .map((day) => ({
          key: `${member.employeeId}::${day.date}`,
          employeeId: member.employeeId,
          employeeName: member.employeeName,
          date: day.date,
          title: `${member.employeeName} ${day.weekday}`,
          reason: `缺口 ${roundHours(day.gapHours).toFixed(1)}h / 异常 ${day.anomalyCount}`,
          priority: (day.anomalyCount > 0 && day.gapHours > 0 ? "high" : "medium") as TimelineAnomaly["severity"],
        }))
    )
    .sort(
      (a, b) =>
        priorityRank[b.priority] - priorityRank[a.priority] ||
        b.reason.localeCompare(a.reason) ||
        a.date.localeCompare(b.date)
    )
}

function buildTeamWeekRiskSummary(groups: FulfillmentGroupWeek[]) {
  const highestRiskGroup = groups[0]
  const highestRiskDate = groups
    .flatMap((group) => group.days)
    .sort(
      (a, b) =>
        b.gapPeople - a.gapPeople ||
        b.anomalyPeople - a.anomalyPeople ||
        a.date.localeCompare(b.date)
    )[0]
  const highestRiskMember = (highestRiskGroup?.members ?? [])
    .map((member) => {
      const weekView = getPersonTimelineWeekView(member)
      return {
        employeeId: member.employeeId,
        employeeName: member.employeeName,
        gapHours: weekView.summary.gapHours,
        anomalyCount: weekView.summary.anomalyCount,
      }
    })
    .sort(
      (a, b) =>
        b.gapHours - a.gapHours ||
        b.anomalyCount - a.anomalyCount ||
        a.employeeId.localeCompare(b.employeeId)
    )[0]

  return {
    highestRiskGroup: highestRiskGroup?.supplier ?? "",
    highestRiskDate: highestRiskDate?.date ?? "",
    highestRiskMember: highestRiskMember
      ? `${highestRiskMember.employeeId} ${highestRiskMember.employeeName}`
      : "",
    gapPeople: highestRiskGroup?.summary.gapPeople ?? 0,
    anomalyPeople: highestRiskGroup?.summary.anomalyPeople ?? 0,
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
