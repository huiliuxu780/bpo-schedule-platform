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
  reviewContexts: PersonTimelineDailyReviewContext[]
  scheduledHours: number
  loginHours: number
  statusHours: number
}

export type PersonTimelineDailyReviewContext = {
  key: string
  anomalyCode: string
  title: string
  reviewGroup: FulfillmentMatrixExceptionQueueItem["reviewGroup"]
  currentJudgment: string
  readyCount: number
  missingCount: number
  closureChecklist: FulfillmentMatrixExceptionQueueItem["closureChecklist"]
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

export type FulfillmentTeamWeekRiskPoint = FulfillmentDayMetrics & {
  label: string
  score: number
  riskLevel: FulfillmentTeamDayRiskDigest["riskLevel"]
}

export type FulfillmentTeamWeekRiskDistribution = {
  riskLevel: FulfillmentTeamDayRiskDigest["riskLevel"]
  riskScore: number
  headline: string
  highestRiskDay: {
    date: string
    label: string
    score: number
    reason: string
  }
  primaryReason: string
  nextDrilldown: {
    date: string
    label: string
    groupName: string
    reason: string
  }
  rank: {
    label: string
    reason: string
  }
  points: FulfillmentTeamWeekRiskPoint[]
}

export type FulfillmentSupervisorWeeklyReviewQueueItem = {
  key: string
  groupId: string
  groupName: string
  date: string
  label: string
  priority: FulfillmentTeamDayRiskDigest["riskLevel"]
  score: number
  gapPeople: number
  anomalyPeople: number
  reviewTarget: string
  reason: string
}

export type FulfillmentSupervisorWeeklyReviewQueue = {
  headline: string
  totalItems: number
  highPriorityCount: number
  totalGapPeople: number
  totalAnomalyPeople: number
  topItem?: FulfillmentSupervisorWeeklyReviewQueueItem
  items: FulfillmentSupervisorWeeklyReviewQueueItem[]
}

export type FulfillmentSupervisorWeeklyHandoffSummaryItem = {
  key: string
  groupId: string
  groupName: string
  date: string
  label: string
  employeeId: string
  employeeName: string
  title: string
  recipient: string
  nextTouchpoint: string
  reason: string
}

export type FulfillmentSupervisorWeeklyHandoffRecipient = {
  recipient: string
  itemCount: number
  openQuestionCount: number
  escalationCount: number
  nextTouchpoint: string
  focus: string
}

export type FulfillmentSupervisorWeeklyHandoffSummary = {
  headline: string
  totalItems: number
  openQuestionCount: number
  escalationItems: number
  topRecipient: {
    recipient: string
    itemCount: number
    reason: string
  }
  nextItem?: FulfillmentSupervisorWeeklyHandoffSummaryItem
  recipients: FulfillmentSupervisorWeeklyHandoffRecipient[]
  items: FulfillmentSupervisorWeeklyHandoffSummaryItem[]
}

export type FulfillmentTeamEvidenceGapDistributionGap = {
  key: string
  label: string
  count: number
  affectedPeopleCount: number
  ownerRole: string
  representativePeople: string[]
  nextDrilldown: {
    groupId: string
    groupName: string
    date: string
    label: string
    exceptionKey: string
    reason: string
  }
}

export type FulfillmentTeamEvidenceGapDistribution = {
  headline: string
  totalGapItems: number
  affectedPeopleCount: number
  topGap?: {
    label: string
    count: number
    affectedPeopleCount: number
    ownerRole: string
    reason: string
  }
  gaps: FulfillmentTeamEvidenceGapDistributionGap[]
}

export type FulfillmentTeamClosureReadinessTrendPoint = {
  date: string
  label: string
  readyCount: number
  blockedCount: number
  missingMaterialCount: number
  missingDecisionCount: number
  dataCheckCount: number
  readinessScore: number
  direction: "转好" | "转差" | "持平"
  reason: string
}

export type FulfillmentTeamClosureReadinessTrend = {
  headline: string
  readyDayCount: number
  blockedDayCount: number
  improvingDayCount: number
  decliningDayCount: number
  stableDayCount: number
  topBlocker?: {
    key: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["code"]
    label: FulfillmentExceptionClosureReadinessSummary["blockers"][number]["label"]
    count: number
    reason: string
  }
  nextReviewDay?: {
    date: string
    label: string
    groupId: string
    groupName: string
    blockedCount: number
    reason: string
  }
  points: FulfillmentTeamClosureReadinessTrendPoint[]
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
  weekRiskDistribution: FulfillmentTeamWeekRiskDistribution
  supervisorWeeklyReviewQueue: FulfillmentSupervisorWeeklyReviewQueue
  supervisorWeeklyHandoffSummary: FulfillmentSupervisorWeeklyHandoffSummary
  teamEvidenceGapDistribution: FulfillmentTeamEvidenceGapDistribution
  closureReadinessTrend: FulfillmentTeamClosureReadinessTrend
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
  supplier: string
  anomalyCode: string
  type: TimelineExceptionExplanation["type"]
  title: string
  priority: TimelineExceptionExplanation["priority"]
  reviewGroup: {
    code: "missing_material" | "supervisor_judgment" | "data_check"
    label: "需补材料" | "待主管判断" | "需数据核对"
    reason: string
  }
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
  resolutionDraft: {
    suggestedConclusion: string
    requiredEvidence: string[]
    communicationTarget: string
    ownerRole: string
    nextReviewPoint: string
    riskIfOpen: string
  }
  closureChecklist: {
    currentJudgment: string
    readyCount: number
    missingCount: number
    items: Array<{
      label: string
      status: "已关联" | "需补充" | "待确认"
      ownerRole: string
      judgmentImpact: string
    }>
  }
  reviewOutcomePreview: {
    suggestedOutcome: string
    confidence: "高" | "中" | "低"
    evidenceSummary: string[]
    openRisk: string
    nextReviewPoint: string
    sourceReferences: string[]
    readiness: string
    boundary: string
  }
  handoffSummary: {
    recipient: string
    summary: string
    openQuestions: string[]
    nextTouchpoint: string
  }
  communicationContext: {
    audience: string
    purpose: string
    keyMessages: string[]
    evidenceToReference: string[]
    openQuestions: string[]
    nextConversation: string
  }
  followUpTimeline: Array<{
    stage: "识别" | "已跟进" | "当前卡点" | "下一复核"
    time: string
    owner: string
    summary: string
    status: "已完成" | "进行中" | "待查看"
  }>
  exceptionComparison: {
    rankLabel: string
    priorityReason: string
    comparedWith?: {
      key: string
      employeeId: string
      employeeName: string
      title: string
      priority: TimelineExceptionExplanation["priority"]
      reviewGroup: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["label"]
      agingLevel: FulfillmentMatrixExceptionQueueItem["agingEscalation"]["level"]
      impactHours: number
    }
    mainDifference: string
    focusHint: string
  }
  ownerLoadComparison: {
    currentOwner: {
      ownerRole: string
      itemCount: number
      highPriorityCount: number
      escalationCount: number
      impactHours: number
      focus: string
    }
    busiestOwner: {
      ownerRole: string
      itemCount: number
      reason: string
    }
    comparedOwner?: {
      ownerRole: string
      itemCount: number
      impactHours: number
      reason: string
    }
    loadDifference: string
    focusOrder: string
  }
  nextDayWatchlist: {
    date: string
    label: string
    headline: string
    items: Array<{
      key: string
      employeeId: string
      employeeName: string
      priority: TimelineAnomaly["severity"]
      ownerRole: string
      source: string
      reason: string
      orderLabel: string
    }>
  }
  dataCheckReadiness: {
    sourceRecords: string[]
    checkFields: string[]
    riskNote: string
  }
  dataQualityLinks: Array<{
    issueId: string
    title: string
    source: "login_log" | "status_log"
    sourceLabel: string
    severity: "high" | "medium" | "low"
    status: "open" | "acknowledged" | "resolved" | "ignored"
    owner: string
    href: string
    matchedRecords: string[]
    matchedFields: string[]
    reason: string
    recommendation: string
  }>
  agingEscalation: {
    detectedAt: string
    waitingMinutes: number
    waitingLabel: string
    level: "正常跟进" | "接近超时" | "需要升级"
    reason: string
    escalationTarget: string
    nextReviewWindow: string
    queueHint: string
  }
  dataQualityRepairPrep: {
    needsDataOwner: boolean
    priority: "高" | "中" | "低"
    reason: string
    ownerTeam: string
  }
  repairMaterials: {
    records: string[]
    fields: string[]
    supportingNotes: string[]
  }
  dataQualityImpactScope: {
    impactedObjects: string[]
    impactedComparisons: string[]
    excludedScope: string
  }
  supervisorFollowUp: {
    owner: string
    status: "待补说明" | "待主管复核" | "待数据核对"
    nextCheckAt: string
    currentFocus: string
  }
  followUpGaps: {
    missingNotes: string[]
    missingRecords: string[]
    missingDecisions: string[]
  }
  groupFollowUpRollup: {
    queuePosition: string
    sameGroupOpenCount: number
    highPriorityOpenCount: number
    groupRiskNote: string
  }
}

export type FulfillmentMatrixExceptionQueueSummary = {
  totalCount: number
  highPriorityCount: number
  loginGapCount: number
  statusMismatchCount: number
  missingMaterialCount: number
  supervisorJudgmentCount: number
  dataCheckCount: number
  agingWatchCount: number
  escalationCount: number
  totalImpactHours: number
}

export type FulfillmentMatrixReviewLoadGroup = {
  code: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["code"]
  label: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["label"]
  count: number
  highPriorityCount: number
  readyItemCount: number
  missingItemCount: number
  reason: string
}

export type FulfillmentMatrixReviewLoadSummary = {
  totalOpenCount: number
  highPriorityOpenCount: number
  readyItemCount: number
  missingItemCount: number
  topReviewGroup: {
    code: FulfillmentMatrixReviewLoadGroup["code"]
    label: FulfillmentMatrixReviewLoadGroup["label"]
    count: number
    reason: string
  }
  nextPriority?: {
    key: string
    employeeId: string
    employeeName: string
    title: string
    reason: string
  }
  groups: FulfillmentMatrixReviewLoadGroup[]
}

export type FulfillmentSupervisorDailyWorkloadOwner = {
  ownerRole: string
  itemCount: number
  highPriorityCount: number
  agingWatchCount: number
  escalationCount: number
  impactHours: number
  focus: string
}

export type FulfillmentSupervisorDailyWorkload = {
  totalFocusItems: number
  highPriorityItems: number
  agingWatchItems: number
  escalationItems: number
  totalImpactHours: number
  busiestOwner: {
    ownerRole: string
    itemCount: number
    reason: string
  }
  nextFocus?: {
    key: string
    employeeId: string
    employeeName: string
    title: string
    ownerRole: string
    reason: string
  }
  ownerLoads: FulfillmentSupervisorDailyWorkloadOwner[]
}

export type FulfillmentExceptionSourceSummarySource = {
  track: TimelineEventType
  label: string
  itemCount: number
  highPriorityCount: number
  agingWatchCount: number
  escalationCount: number
  impactHours: number
  focus: string
}

export type FulfillmentExceptionSourceSummary = {
  totalSources: number
  primarySource: {
    track: TimelineEventType
    label: string
    itemCount: number
    reason: string
  }
  nextSource?: {
    track: TimelineEventType
    label: string
    reason: string
  }
  sources: FulfillmentExceptionSourceSummarySource[]
}

export type FulfillmentSupervisorHandoffRecipient = {
  recipient: string
  itemCount: number
  highPriorityCount: number
  agingWatchCount: number
  escalationCount: number
  openQuestionCount: number
  nextTouchpoint: string
  focus: string
}

export type FulfillmentSupervisorHandoffOverview = {
  totalHandoffItems: number
  openQuestionCount: number
  escalationItems: number
  topRecipient: {
    recipient: string
    itemCount: number
    reason: string
  }
  nextHandoff?: {
    key: string
    employeeId: string
    employeeName: string
    title: string
    recipient: string
    reason: string
  }
  recipients: FulfillmentSupervisorHandoffRecipient[]
}

export type FulfillmentTeamDayRiskSignal = {
  label: string
  value: string
  tone: "high" | "medium" | "low"
  reason: string
}

export type FulfillmentTeamDayRiskDigest = {
  riskLevel: "高" | "中" | "低"
  riskScore: number
  headline: string
  primaryRisk: {
    label: string
    reason: string
  }
  nextFocus?: {
    key: string
    employeeId: string
    employeeName: string
    title: string
    reason: string
  }
  signals: FulfillmentTeamDayRiskSignal[]
}

export type FulfillmentTeamDayRiskTrendPoint = {
  date: string
  label: string
  score: number
  riskLevel: FulfillmentTeamDayRiskDigest["riskLevel"]
  gapPeople: number
  anomalyPeople: number
}

export type FulfillmentTeamDayRiskTrend = {
  direction: "上升" | "下降" | "持平"
  headline: string
  currentDay: FulfillmentTeamDayRiskTrendPoint
  comparison: {
    label: string
    scoreDelta: number
    summary: string
  }
  highestRiskDay: {
    date: string
    label: string
    score: number
    reason: string
  }
  nextFocus: {
    date: string
    label: string
    reason: string
  }
  points: FulfillmentTeamDayRiskTrendPoint[]
}

export type FulfillmentGroupRiskCauseSplit = {
  headline: string
  totalImpactHours: number
  causes: Array<{
    key: "login_attendance" | "status_alignment" | "data_check"
    label: string
    itemCount: number
    peopleCount: number
    impactHours: number
    share: number
    representative: string
    focus: string
  }>
}

export type FulfillmentTeamWeekCarryoverOverview = {
  headline: string
  carryoverDays: number
  items: Array<{
    date: string
    label: string
    gapPeople: number
    anomalyPeople: number
    reviewTarget: string
    reason: string
    orderLabel: string
  }>
}

export type FulfillmentExceptionClosureReadinessSummary = {
  headline: string
  readyCount: number
  blockedCount: number
  missingMaterialCount: number
  missingDecisionCount: number
  dataCheckCount: number
  nextCandidate?: {
    key: string
    employeeId: string
    employeeName: string
    title: string
    readiness: string
    reason: string
  }
  blockers: Array<{
    key: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["code"]
    label: "待补材料" | "待主管判断" | "待数据核对"
    count: number
    reason: string
    evidenceItems: Array<{
      key: string
      employeeId: string
      employeeName: string
      title: string
      ownerRole: string
      status: string
      sourceRecords: string[]
      currentEvidence: string
      nextView: string
    }>
  }>
}

export type FulfillmentMatrixExceptionQueueCursor = {
  selected?: FulfillmentMatrixExceptionQueueItem
  selectedIndex: number
  totalCount: number
  previous?: FulfillmentMatrixExceptionQueueItem
  next?: FulfillmentMatrixExceptionQueueItem
}

export type FulfillmentDataQualityExceptionImpact = {
  headline: string
  totalIssueCount: number
  impactedExceptionCount: number
  impactedPeopleCount: number
  totalImpactHours: number
  primaryIssue?: FulfillmentDataQualityExceptionImpactIssue
  issues: FulfillmentDataQualityExceptionImpactIssue[]
}

export type FulfillmentDataQualityExceptionImpactIssue = {
  issueId: string
  title: string
  sourceLabel: string
  severity: FulfillmentMatrixExceptionQueueItem["dataQualityLinks"][number]["severity"]
  status: FulfillmentMatrixExceptionQueueItem["dataQualityLinks"][number]["status"]
  owner: string
  href: string
  impactedExceptionCount: number
  impactedPeople: string[]
  impactHours: number
  reason: string
  recommendation: string
  representativeExceptions: Array<{
    key: string
    employeeId: string
    employeeName: string
    title: string
    priority: TimelineAnomaly["severity"]
    reviewGroup: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["label"]
    impactHours: number
  }>
}

export type FulfillmentExceptionImpactPriority = {
  headline: string
  totalImpactHours: number
  blockedItemCount: number
  topItem?: FulfillmentExceptionImpactPriorityItem
  items: FulfillmentExceptionImpactPriorityItem[]
}

export type FulfillmentExceptionImpactPriorityItem = {
  key: string
  employeeId: string
  employeeName: string
  title: string
  priority: TimelineAnomaly["severity"]
  reviewGroup: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["label"]
  agingLevel: FulfillmentMatrixExceptionQueueItem["agingEscalation"]["level"]
  impactHours: number
  impactedObjects: string[]
  impactedComparisons: string[]
  blockerCount: number
  priorityReason: string
  excludedScope: string
}

export type FulfillmentSupervisorPrioritySummary = {
  headline: string
  totalImpactHours: number
  highPriorityCount: number
  blockedCount: number
  escalationCount: number
  focusReasons: string[]
  topFocus?: FulfillmentSupervisorPrioritySummaryItem
  orderedItems: FulfillmentSupervisorPrioritySummaryItem[]
}

export type FulfillmentSupervisorPrioritySummaryItem = {
  key: string
  employeeId: string
  employeeName: string
  title: string
  priority: TimelineAnomaly["severity"]
  reviewGroup: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["label"]
  agingLevel: FulfillmentMatrixExceptionQueueItem["agingEscalation"]["level"]
  impactHours: number
  blockerCount: number
  focusReason: string
  impactScope: string
  nextView: string
}

export type FulfillmentGroupMatrix = {
  date: string
  team: FulfillmentTeamWeek
  group: FulfillmentGroupWeek
  summary: FulfillmentCalendarSummary
  members: FulfillmentMatrixMember[]
  exceptionQueue: FulfillmentMatrixExceptionQueueItem[]
  exceptionQueueSummary: FulfillmentMatrixExceptionQueueSummary
  reviewLoadSummary: FulfillmentMatrixReviewLoadSummary
  supervisorDailyWorkload: FulfillmentSupervisorDailyWorkload
  exceptionSourceSummary: FulfillmentExceptionSourceSummary
  supervisorHandoffOverview: FulfillmentSupervisorHandoffOverview
  teamDayRiskDigest: FulfillmentTeamDayRiskDigest
  teamDayRiskTrend: FulfillmentTeamDayRiskTrend
  groupRiskCauseSplit: FulfillmentGroupRiskCauseSplit
  teamWeekCarryoverOverview: FulfillmentTeamWeekCarryoverOverview
  exceptionClosureReadinessSummary: FulfillmentExceptionClosureReadinessSummary
  dataQualityExceptionImpact: FulfillmentDataQualityExceptionImpact
  exceptionImpactPriority: FulfillmentExceptionImpactPriority
  supervisorPrioritySummary: FulfillmentSupervisorPrioritySummary
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
  const exceptionExplanations = buildExceptionExplanations(row, date, tracks)

  return {
    date,
    employee: row,
    tracks,
    anomalies: row.anomalies.filter((anomaly) => anomaly.date === date),
    exceptionExplanations,
    reviewContexts: buildPersonTimelineDailyReviewContexts(row, exceptionExplanations),
    scheduledHours: sumEvents(tracks.schedule),
    loginHours: sumEvents(tracks.login),
    statusHours: sumEvents(tracks.status),
  }
}

function buildPersonTimelineDailyReviewContexts(
  row: PersonTimeline,
  explanations: TimelineExceptionExplanation[]
): PersonTimelineDailyReviewContext[] {
  return explanations.map((explanation) => {
    const closureChecklist = buildExceptionClosureChecklist(explanation)

    return {
      key: fulfillmentMatrixExceptionKey(row.employeeId, explanation.anomalyCode),
      anomalyCode: explanation.anomalyCode,
      title: explanation.title,
      reviewGroup: buildExceptionReviewGroup(explanation),
      currentJudgment: closureChecklist.currentJudgment,
      readyCount: closureChecklist.readyCount,
      missingCount: closureChecklist.missingCount,
      closureChecklist,
    }
  })
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
  const teamsWithoutDistribution = Array.from(groupBy(rows, teamKey).entries())
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
  const teams = teamsWithoutDistribution.map((team, index) => ({
    ...team,
    weekRiskDistribution: buildTeamWeekRiskDistribution(team, index + 1, teamsWithoutDistribution.length),
    supervisorWeeklyReviewQueue: buildSupervisorWeeklyReviewQueue(team),
    supervisorWeeklyHandoffSummary: buildSupervisorWeeklyHandoffSummary(team),
    teamEvidenceGapDistribution: buildTeamEvidenceGapDistribution(team),
    closureReadinessTrend: buildTeamClosureReadinessTrend(team),
  }))

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

function buildFulfillmentMatrixMembersForDate(
  members: PersonTimeline[],
  date: string
): FulfillmentMatrixMember[] {
  return members.map((member) => {
    const tracks = filterTracksByDate(member, date)
    const exceptionExplanations = buildExceptionExplanations(member, date, tracks)

    return {
      employeeId: member.employeeId,
      employeeName: member.employeeName,
      workplace: member.workplace,
      supplier: member.supplier,
      project: member.project,
      tracks,
      anomalies: member.anomalies.filter((anomaly) => anomaly.date === date),
      exceptionExplanations,
      scheduledHours: sumEvents(tracks.schedule),
      loginHours: sumEvents(tracks.login),
      statusHours: sumEvents(tracks.status),
    }
  })
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
  const members = buildFulfillmentMatrixMembersForDate(group.members, selectedDate)
    .sort((a, b) => {
      const riskA = Number(a.scheduledHours > a.loginHours) + a.anomalies.length
      const riskB = Number(b.scheduledHours > b.loginHours) + b.anomalies.length
      return riskB - riskA || a.employeeId.localeCompare(b.employeeId)
  })
  const exceptionQueue = buildFulfillmentMatrixExceptionQueue(members, selectedDate, group.members)
  const exceptionQueueSummary = summarizeFulfillmentMatrixExceptionQueue(exceptionQueue)
  const reviewLoadSummary = summarizeFulfillmentMatrixReviewLoad(exceptionQueue)
  const supervisorDailyWorkload = summarizeSupervisorDailyWorkload(exceptionQueue)
  const exceptionSourceSummary = summarizeExceptionSources(exceptionQueue)
  const supervisorHandoffOverview = summarizeSupervisorHandoffOverview(exceptionQueue)

  return {
    date: selectedDate,
    team,
    group,
    summary: buildDayMetrics(selectedDate, group.members),
    members,
    exceptionQueue,
    exceptionQueueSummary,
    reviewLoadSummary,
    supervisorDailyWorkload,
    exceptionSourceSummary,
    supervisorHandoffOverview,
    teamDayRiskDigest: summarizeTeamDayRiskDigest(
      exceptionQueue,
      exceptionQueueSummary,
      exceptionSourceSummary,
      supervisorHandoffOverview
    ),
    teamDayRiskTrend: summarizeTeamDayRiskTrend(group.days, selectedDate),
    groupRiskCauseSplit: summarizeGroupRiskCauseSplit(exceptionQueue),
    dataQualityExceptionImpact: summarizeDataQualityExceptionImpact(exceptionQueue),
    teamWeekCarryoverOverview: summarizeTeamWeekCarryoverOverview(
      group.days,
      selectedDate,
      group.members,
      exceptionQueue
    ),
    exceptionClosureReadinessSummary: summarizeExceptionClosureReadiness(exceptionQueue),
    exceptionImpactPriority: summarizeExceptionImpactPriority(exceptionQueue),
    supervisorPrioritySummary: summarizeSupervisorPrioritySummary(exceptionQueue),
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
  date: string,
  sourceMembers: PersonTimeline[] = []
): FulfillmentMatrixExceptionQueueItem[] {
  const queue = members
    .flatMap((member) =>
      member.exceptionExplanations.map((explanation) => {
        const evidenceCards = getEvidenceCards(member, explanation)
        const evidenceSummary = summarizeExceptionEvidence(explanation, evidenceCards)
        const resolutionDraft = buildExceptionResolutionDraft(member, explanation)
        const closureChecklist = buildExceptionClosureChecklist(explanation)
        const dataQualityLinks = buildExceptionDataQualityLinks(explanation, evidenceCards)
        const agingEscalation = buildExceptionAgingEscalation(explanation, date)

        return {
          key: fulfillmentMatrixExceptionKey(member.employeeId, explanation.anomalyCode),
          employeeId: member.employeeId,
          employeeName: member.employeeName,
          supplier: member.supplier,
          anomalyCode: explanation.anomalyCode,
          type: explanation.type,
          title: explanation.title,
          priority: explanation.priority,
          reviewGroup: buildExceptionReviewGroup(explanation),
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
          evidenceSummary,
          handlingRecords: getExceptionHandlingRecords(explanation),
          handlingOutcome: buildExceptionHandlingOutcome(member, explanation, evidenceCards),
          resolutionDraft,
          closureChecklist,
          reviewOutcomePreview: buildExceptionReviewOutcomePreview(
            resolutionDraft,
            closureChecklist,
            evidenceSummary,
            evidenceCards,
            dataQualityLinks,
            agingEscalation
          ),
          handoffSummary: buildExceptionHandoffSummary(member, explanation),
          communicationContext: buildExceptionCommunicationContext(member, explanation, evidenceCards),
          followUpTimeline: buildExceptionFollowUpTimeline(member, explanation, date),
          dataCheckReadiness: buildExceptionDataCheckReadiness(explanation, evidenceCards),
          dataQualityLinks,
          agingEscalation,
          dataQualityRepairPrep: buildDataQualityRepairPrep(explanation),
          repairMaterials: buildRepairMaterials(explanation, evidenceCards),
          dataQualityImpactScope: buildDataQualityImpactScope(member, explanation),
          supervisorFollowUp: buildSupervisorFollowUp(member, explanation),
          followUpGaps: buildFollowUpGaps(explanation),
          exceptionComparison: {
            rankLabel: "",
            priorityReason: "",
            mainDifference: "",
            focusHint: "",
          },
          ownerLoadComparison: {
            currentOwner: emptyOwnerLoadComparisonOwner("现场主管"),
            busiestOwner: {
              ownerRole: "现场主管",
              itemCount: 0,
              reason: "",
            },
            loadDifference: "",
            focusOrder: "",
          },
          nextDayWatchlist: {
            date: addDays(date, 1),
            label: "",
            headline: "",
            items: [],
          },
          groupFollowUpRollup: {
            queuePosition: "",
            sameGroupOpenCount: 0,
            highPriorityOpenCount: 0,
            groupRiskNote: "",
          },
        }
      })
    )
    .sort(
      (a, b) =>
        escalationLevelRank[b.agingEscalation.level] - escalationLevelRank[a.agingEscalation.level] ||
        priorityRank[b.priority] - priorityRank[a.priority] ||
        b.impactHours - a.impactHours ||
        a.employeeId.localeCompare(b.employeeId)
    )

  return queue.map((item, index) => ({
    ...item,
    exceptionComparison: buildExceptionComparison(queue, index),
    ownerLoadComparison: buildOwnerLoadComparison(queue, item),
    nextDayWatchlist: buildNextDayWatchlist(queue, item, sourceMembers, date),
    groupFollowUpRollup: buildGroupFollowUpRollup(queue, index),
  }))
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

function buildExceptionCommunicationContext(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation,
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"]
) {
  const scheduleCard = evidenceCards.find((card) => card.track === "schedule")
  const loginCard = evidenceCards.find((card) => card.track === "login")
  const statusCard = evidenceCards.find((card) => card.track === "status")
  const audience = `${member.employeeName} / 现场主管`
  const escalationText =
    explanation.priority === "high" ? "已达到需要升级关注" : "需要保持跟进关注"

  if (explanation.type === "登录缺口") {
    return {
      audience,
      purpose: `确认${member.employeeName} ${explanation.start}-${explanation.end} 登录缺口的到岗事实和迟到原因。`,
      keyMessages: [
        `排班 ${scheduleCard?.start ?? explanation.start} 开始，登录 ${
          loginCard?.start ?? explanation.end
        } 开始，存在 ${formatGapMinutes(explanation.start, explanation.end)} 分钟缺口。`,
        `当前影响 ${formatImpactHours(explanation.impactHours)}h，${escalationText}。`,
        "需补到岗说明、迟到或漏登原因和现场主管确认口径。",
      ],
      evidenceToReference: [
        `排班 ${scheduleCard?.eventId ?? "记录"}：${scheduleCard?.label ?? "排班"} ${
          scheduleCard?.start ?? explanation.start
        }-${scheduleCard?.end ?? explanation.end}`,
        `登录 ${loginCard?.eventId ?? "记录"}：${loginCard?.label ?? "登录"} ${
          loginCard?.start ?? explanation.end
        }-${loginCard?.end ?? explanation.end}`,
      ],
      openQuestions: ["是否实际到岗但漏登", "迟到原因是否已说明"],
      nextConversation: "2026-05-11 10:00 前和现场主管确认到岗说明。",
    }
  }

  if (explanation.type === "登录不足") {
    return {
      audience,
      purpose: `确认${member.employeeName} ${explanation.start}-${explanation.end} 登录不足的离岗事实和记录原因。`,
      keyMessages: [
        `登录 ${loginCard?.end ?? explanation.start} 结束，排班 ${
          scheduleCard?.end ?? explanation.end
        } 结束，需要说明离岗差异。`,
        `当前影响 ${formatImpactHours(explanation.impactHours)}h，${escalationText}。`,
        "需补离岗说明、早退或漏登原因和现场主管确认口径。",
      ],
      evidenceToReference: [
        `排班 ${scheduleCard?.eventId ?? "记录"}：${scheduleCard?.label ?? "排班"} ${
          scheduleCard?.start ?? explanation.start
        }-${scheduleCard?.end ?? explanation.end}`,
        `登录 ${loginCard?.eventId ?? "记录"}：${loginCard?.label ?? "登录"} ${
          loginCard?.start ?? explanation.start
        }-${loginCard?.end ?? explanation.start}`,
      ],
      openQuestions: ["是否提前离岗", "系统登出时间是否准确"],
      nextConversation: "2026-05-11 18:30 前和现场主管确认离岗说明。",
    }
  }

  return {
    audience,
    purpose: `确认${member.employeeName} ${explanation.start}-${explanation.end} 状态不一致是否符合当班安排。`,
    keyMessages: [
      `状态轨道显示${statusCard?.label ?? "状态异常"}，覆盖 ${explanation.start}-${explanation.end}。`,
      `当前影响 ${formatImpactHours(explanation.impactHours)}h，${escalationText}。`,
      "需补培训安排说明和当班在线要求确认。",
    ],
    evidenceToReference: [
      `排班 ${scheduleCard?.eventId ?? "记录"}：${scheduleCard?.label ?? "排班"} ${
        scheduleCard?.start ?? explanation.start
      }-${scheduleCard?.end ?? explanation.end}`,
      `状态 ${statusCard?.eventId ?? "记录"}：${statusCard?.label ?? "状态"} ${
        statusCard?.start ?? explanation.start
      }-${statusCard?.end ?? explanation.end}`,
    ],
    openQuestions: ["培训安排是否已登记", "当班在线要求是否允许该状态"],
    nextConversation: "2026-05-11 15:00 前和现场主管确认培训安排。",
  }
}

function buildExceptionFollowUpTimeline(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation,
  date: string
): FulfillmentMatrixExceptionQueueItem["followUpTimeline"] {
  const handlingRecords = getExceptionHandlingRecords(explanation)
  const followUpGaps = buildFollowUpGaps(explanation)
  const supervisorFollowUp = buildSupervisorFollowUp(member, explanation)
  const handlingOutcome = buildExceptionHandlingOutcome(member, explanation, [])
  const detectedAt = buildExceptionAgingEscalation(explanation, date).detectedAt
  const currentGapSummary = buildFollowUpCurrentGapSummary(explanation, followUpGaps)

  return [
    {
      stage: "识别",
      time: detectedAt,
      owner: "系统识别",
      summary: `${explanation.title}，影响 ${formatImpactHours(explanation.impactHours)}h。`,
      status: "已完成",
    },
    ...handlingRecords.map((record) => ({
      stage: "已跟进" as const,
      time: record.recordedAt,
      owner: record.recorder,
      summary: `${record.conclusion}${record.followUp}`,
      status: "已完成" as const,
    })),
    {
      stage: "当前卡点",
      time: handlingRecords.at(-1)?.recordedAt ?? detectedAt,
      owner: supervisorFollowUp.owner,
      summary: `${supervisorFollowUp.status}：${currentGapSummary}`,
      status: "进行中",
    },
    {
      stage: "下一复核",
      time: supervisorFollowUp.nextCheckAt,
      owner: supervisorFollowUp.owner,
      summary: handlingOutcome.nextReviewPoint,
      status: "待查看",
    },
  ]
}

function buildExceptionComparison(
  queue: FulfillmentMatrixExceptionQueueItem[],
  index: number
): FulfillmentMatrixExceptionQueueItem["exceptionComparison"] {
  const current = queue[index]
  const compared = queue[index + 1] ?? queue[index - 1]

  return {
    rankLabel: `第 ${index + 1} / ${queue.length} 项`,
    priorityReason: buildExceptionComparisonPriorityReason(current),
    comparedWith: compared
      ? {
          key: compared.key,
          employeeId: compared.employeeId,
          employeeName: compared.employeeName,
          title: compared.title,
          priority: compared.priority,
          reviewGroup: compared.reviewGroup.label,
          agingLevel: compared.agingEscalation.level,
          impactHours: compared.impactHours,
        }
      : undefined,
    mainDifference: buildExceptionComparisonDifference(current, compared),
    focusHint: buildExceptionComparisonFocusHint(current, compared),
  }
}

function buildExceptionComparisonPriorityReason(item: FulfillmentMatrixExceptionQueueItem) {
  const priorityPart = `${item.employeeName}为${priorityText[item.priority]}`
  const agingPart =
    item.agingEscalation.level === "需要升级"
      ? "且已达到需要升级"
      : item.agingEscalation.level === "接近超时"
        ? "且接近超时"
        : "且仍在正常跟进"

  return `${priorityPart}，${agingPart}。`
}

function buildExceptionComparisonDifference(
  current: FulfillmentMatrixExceptionQueueItem,
  compared: FulfillmentMatrixExceptionQueueItem | undefined
) {
  if (!compared) {
    return "当前队列只有这一项异常，先完成该项复核即可。"
  }

  const priorityDelta = priorityRank[current.priority] - priorityRank[compared.priority]
  const impactDelta = roundHours(Math.abs(current.impactHours - compared.impactHours))
  const priorityTextPart =
    priorityDelta > 0
      ? "当前异常优先级更高"
      : priorityDelta < 0
        ? "对比异常优先级更高"
        : "两项异常优先级相同"
  const impactText =
    current.impactHours >= compared.impactHours
      ? `当前异常影响时长多 ${formatImpactHours(impactDelta)}h`
      : `对比异常影响时长多 ${formatImpactHours(impactDelta)}h`
  const agingText =
    compared.agingEscalation.level === "需要升级"
      ? "且对比异常也已达到升级关注。"
      : "但尚未达到升级关注。"

  return `${priorityTextPart}；${impactText}，${agingText}`
}

function buildExceptionComparisonFocusHint(
  current: FulfillmentMatrixExceptionQueueItem,
  compared: FulfillmentMatrixExceptionQueueItem | undefined
) {
  if (!compared) {
    return `先完成${current.employeeName}当前异常的复核说明。`
  }

  if (current.type === "登录缺口" && compared.type === "状态不一致") {
    return `先补${current.employeeName}到岗说明，再回看${compared.employeeName}培训状态是否符合在线要求。`
  }

  return `先看${current.employeeName}，再对比${compared.employeeName}的${compared.title}。`
}

function buildOwnerLoadComparison(
  queue: FulfillmentMatrixExceptionQueueItem[],
  item: FulfillmentMatrixExceptionQueueItem
): FulfillmentMatrixExceptionQueueItem["ownerLoadComparison"] {
  const ownerLoads = buildSupervisorDailyWorkloadOwnerLoads(queue)
  const currentOwner =
    ownerLoads.find((owner) => owner.ownerRole === item.supervisorFollowUp.owner) ??
    emptySupervisorWorkloadOwner(item.supervisorFollowUp.owner)
  const busiestOwner = ownerLoads[0] ?? currentOwner
  const comparedOwner = ownerLoads.find((owner) => owner.ownerRole !== currentOwner.ownerRole)

  return {
    currentOwner: {
      ownerRole: currentOwner.ownerRole,
      itemCount: currentOwner.itemCount,
      highPriorityCount: currentOwner.highPriorityCount,
      escalationCount: currentOwner.escalationCount,
      impactHours: currentOwner.impactHours,
      focus: currentOwner.focus,
    },
    busiestOwner: {
      ownerRole: busiestOwner.ownerRole,
      itemCount: busiestOwner.itemCount,
      reason: `${busiestOwner.ownerRole}今日有 ${busiestOwner.itemCount} 项待关注，其中 ${busiestOwner.escalationCount} 项建议升级。`,
    },
    comparedOwner: comparedOwner
      ? {
          ownerRole: comparedOwner.ownerRole,
          itemCount: comparedOwner.itemCount,
          impactHours: comparedOwner.impactHours,
          reason: buildOwnerLoadComparedReason(currentOwner, comparedOwner),
        }
      : undefined,
    loadDifference: buildOwnerLoadDifference(currentOwner, busiestOwner, comparedOwner),
    focusOrder: buildOwnerLoadFocusOrder(item, currentOwner, comparedOwner),
  }
}

function emptyOwnerLoadComparisonOwner(
  ownerRole: string
): FulfillmentMatrixExceptionQueueItem["ownerLoadComparison"]["currentOwner"] {
  const owner = emptySupervisorWorkloadOwner(ownerRole)

  return {
    ownerRole: owner.ownerRole,
    itemCount: owner.itemCount,
    highPriorityCount: owner.highPriorityCount,
    escalationCount: owner.escalationCount,
    impactHours: owner.impactHours,
    focus: owner.focus,
  }
}

function buildOwnerLoadComparedReason(
  currentOwner: FulfillmentSupervisorDailyWorkloadOwner,
  comparedOwner: FulfillmentSupervisorDailyWorkloadOwner
) {
  const itemDiff = Math.abs(currentOwner.itemCount - comparedOwner.itemCount)
  const impactDiff = formatLoadImpactDifference(currentOwner.impactHours, comparedOwner.impactHours)
  const itemDirection = currentOwner.itemCount >= comparedOwner.itemCount ? "少" : "多"
  const impactDirection = currentOwner.impactHours >= comparedOwner.impactHours ? "少" : "多"

  return `比${currentOwner.ownerRole}${itemDirection} ${itemDiff} 项，影响${impactDirection} ${impactDiff}。`
}

function buildOwnerLoadDifference(
  currentOwner: FulfillmentSupervisorDailyWorkloadOwner,
  busiestOwner: FulfillmentSupervisorDailyWorkloadOwner,
  comparedOwner?: FulfillmentSupervisorDailyWorkloadOwner
) {
  if (!comparedOwner) {
    return `${currentOwner.ownerRole}是当前唯一待关注角色。`
  }

  const itemDiff = Math.abs(currentOwner.itemCount - comparedOwner.itemCount)
  const impactDiff = formatLoadImpactDifference(currentOwner.impactHours, comparedOwner.impactHours)

  if (currentOwner.ownerRole === busiestOwner.ownerRole) {
    return `${currentOwner.ownerRole}是当前最高负载角色，比${comparedOwner.ownerRole}多 ${itemDiff} 项，影响多 ${impactDiff}。`
  }

  return `${busiestOwner.ownerRole}是当前最高负载角色，${currentOwner.ownerRole}比${busiestOwner.ownerRole}少 ${itemDiff} 项。`
}

function buildOwnerLoadFocusOrder(
  item: FulfillmentMatrixExceptionQueueItem,
  currentOwner: FulfillmentSupervisorDailyWorkloadOwner,
  comparedOwner?: FulfillmentSupervisorDailyWorkloadOwner
) {
  if (item.type === "登录缺口" && comparedOwner?.ownerRole === "数据管理员") {
    return `先由${currentOwner.ownerRole}补${item.employeeName}到岗说明，再让${comparedOwner.ownerRole}核对原始登录记录。`
  }

  if (item.type === "状态不一致") {
    return `先由${currentOwner.ownerRole}确认${item.employeeName}状态安排，再回看相关轨道证据。`
  }

  return `先由${currentOwner.ownerRole}处理${item.employeeName}当前异常，再按队列顺序查看下一项。`
}

function formatLoadImpactDifference(a: number, b: number) {
  return `${Math.abs(roundHours(a - b)).toFixed(2)}h`
}

function buildNextDayWatchlist(
  queue: FulfillmentMatrixExceptionQueueItem[],
  item: FulfillmentMatrixExceptionQueueItem,
  members: PersonTimeline[],
  date: string
): FulfillmentMatrixExceptionQueueItem["nextDayWatchlist"] {
  const nextDate = addDays(date, 1)
  const label = `${formatWeekday(nextDate)} ${formatDateLabel(nextDate)}`
  const prioritizedItems = [
    item,
    ...queue.filter((candidate) => candidate.key !== item.key),
  ].slice(0, 2)

  return {
    date: nextDate,
    label,
    headline: `明天先看${label} 的登录缺口和今日未闭环异常。`,
    items: prioritizedItems.map((candidate, index) => {
      const member = members.find((candidateMember) => candidateMember.employeeId === candidate.employeeId)
      const nextGapHours = member ? getMemberDayLoginGapHours(member, nextDate) : 0

      return {
        key: `${candidate.employeeId}::${nextDate}::${candidate.anomalyCode}`,
        employeeId: candidate.employeeId,
        employeeName: candidate.employeeName,
        priority: candidate.priority,
        ownerRole: candidate.supervisorFollowUp.owner,
        source: `今日异常：${candidate.title}`,
        reason: buildNextDayWatchReason(candidate, nextGapHours),
        orderLabel: `第 ${index + 1} 项`,
      }
    }),
  }
}

function getMemberDayLoginGapHours(member: PersonTimeline, date: string) {
  const scheduledHours = sumEvents(member.tracks.schedule.filter((eventItem) => eventItem.date === date))
  const loginHours = sumEvents(member.tracks.login.filter((eventItem) => eventItem.date === date))

  return roundHours(Math.max(scheduledHours - loginHours, 0))
}

function buildNextDayWatchReason(item: FulfillmentMatrixExceptionQueueItem, nextGapHours: number) {
  if ((item.agingEscalation.level === "需要升级" || item.priority === "high") && nextGapHours > 0) {
    return `今日需要升级且明天仍有 ${nextGapHours.toFixed(1)}h 登录缺口，先确认到岗说明是否补齐。`
  }

  if (item.type === "状态不一致") {
    return "今日状态判断未闭环，明天复核培训安排是否仍影响在线要求。"
  }

  if (nextGapHours > 0) {
    return `明天仍有 ${nextGapHours.toFixed(1)}h 登录缺口，先确认是否连续影响到岗。`
  }

  return `今日${item.title}未闭环，明天先复核${item.supervisorFollowUp.owner}关注项。`
}

function buildFollowUpCurrentGapSummary(
  explanation: TimelineExceptionExplanation,
  followUpGaps: FulfillmentMatrixExceptionQueueItem["followUpGaps"]
) {
  if (explanation.type === "登录缺口") {
    return "需补到岗说明、迟到或漏登原因。"
  }

  if (explanation.type === "登录不足") {
    return "需补离岗说明、早退或漏登原因。"
  }

  return [
    ...followUpGaps.missingNotes,
    ...followUpGaps.missingRecords,
    ...followUpGaps.missingDecisions,
  ].join("、")
}

function buildExceptionResolutionDraft(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation
) {
  if (explanation.type === "登录缺口") {
    return {
      suggestedConclusion: `待确认到岗：${member.employeeName} ${explanation.start}-${explanation.end} 登录缺口，需补到岗说明。`,
      requiredEvidence: ["员工到岗说明", "迟到或漏登原因", "CORN 原始登录日志截图"],
      communicationTarget: `${member.employeeName} / 现场主管`,
      ownerRole: "现场主管",
      nextReviewPoint: "2026-05-11 10:00",
      riskIfOpen: "缺少到岗说明会影响当日履约缺口判断。",
    }
  }

  if (explanation.type === "登录不足") {
    return {
      suggestedConclusion: `待确认离岗：${member.employeeName} ${explanation.start}-${explanation.end} 登录不足，需补离岗说明。`,
      requiredEvidence: ["员工离岗说明", "早退或漏登原因", "CORN 原始登录日志截图"],
      communicationTarget: `${member.employeeName} / 现场主管`,
      ownerRole: "现场主管",
      nextReviewPoint: "2026-05-11 18:30",
      riskIfOpen: "缺少离岗说明会影响当日履约缺口判断。",
    }
  }

  return {
    suggestedConclusion: `待确认状态：${member.employeeName} ${explanation.start}-${explanation.end} 状态为培训，需补培训安排说明。`,
    requiredEvidence: ["培训安排说明", "在线要求确认"],
    communicationTarget: `${member.employeeName} / 现场主管`,
    ownerRole: "现场主管",
    nextReviewPoint: "2026-05-11 15:00",
    riskIfOpen: "缺少培训安排说明会影响状态是否计入当班履约。",
  }
}

function buildExceptionClosureChecklist(explanation: TimelineExceptionExplanation) {
  if (explanation.type === "登录缺口") {
    return {
      currentJudgment: "需补到岗说明后再判断当日登录缺口。",
      readyCount: 2,
      missingCount: 2,
      items: [
        {
          label: "排班记录",
          status: "已关联" as const,
          ownerRole: "排班运营",
          judgmentImpact: `确认 ${explanation.start} 开始排班。`,
        },
        {
          label: "登录记录",
          status: "已关联" as const,
          ownerRole: "数据管理员",
          judgmentImpact: `确认 ${explanation.end} 登录开始。`,
        },
        {
          label: "到岗说明",
          status: "需补充" as const,
          ownerRole: "现场主管",
          judgmentImpact: "确认是否迟到或漏登。",
        },
        {
          label: "主管判断",
          status: "待确认" as const,
          ownerRole: "现场主管",
          judgmentImpact: "形成当日履约缺口判断。",
        },
      ],
    }
  }

  if (explanation.type === "登录不足") {
    return {
      currentJudgment: "需补离岗说明后再判断当日登录不足。",
      readyCount: 2,
      missingCount: 2,
      items: [
        {
          label: "排班记录",
          status: "已关联" as const,
          ownerRole: "排班运营",
          judgmentImpact: `确认排班覆盖到 ${explanation.end}。`,
        },
        {
          label: "登录记录",
          status: "已关联" as const,
          ownerRole: "数据管理员",
          judgmentImpact: `确认登录结束时间为 ${explanation.start}。`,
        },
        {
          label: "离岗说明",
          status: "需补充" as const,
          ownerRole: "现场主管",
          judgmentImpact: "确认是否提前离岗或漏登。",
        },
        {
          label: "主管判断",
          status: "待确认" as const,
          ownerRole: "现场主管",
          judgmentImpact: "形成当日履约时长判断。",
        },
      ],
    }
  }

  return {
    currentJudgment: "需补培训安排说明后再判断状态是否计入履约。",
    readyCount: 3,
    missingCount: 2,
    items: [
      {
        label: "排班记录",
        status: "已关联" as const,
        ownerRole: "排班运营",
        judgmentImpact: `确认 ${explanation.start}-${explanation.end} 排班覆盖。`,
      },
      {
        label: "登录记录",
        status: "已关联" as const,
        ownerRole: "数据管理员",
        judgmentImpact: "确认登录覆盖当日工作时段。",
      },
      {
        label: "状态记录",
        status: "已关联" as const,
        ownerRole: "现场主管",
        judgmentImpact: `确认 ${explanation.start}-${explanation.end} 状态为培训。`,
      },
      {
        label: "培训安排说明",
        status: "需补充" as const,
        ownerRole: "现场主管",
        judgmentImpact: "确认培训是否符合当班在线要求。",
      },
      {
        label: "主管判断",
        status: "待确认" as const,
        ownerRole: "现场主管",
        judgmentImpact: "形成状态是否计入履约的判断。",
      },
    ],
  }
}

function buildExceptionReviewOutcomePreview(
  resolutionDraft: FulfillmentMatrixExceptionQueueItem["resolutionDraft"],
  closureChecklist: FulfillmentMatrixExceptionQueueItem["closureChecklist"],
  evidenceSummary: FulfillmentMatrixExceptionQueueItem["evidenceSummary"],
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"],
  dataQualityLinks: FulfillmentMatrixExceptionQueueItem["dataQualityLinks"],
  agingEscalation: FulfillmentMatrixExceptionQueueItem["agingEscalation"]
): FulfillmentMatrixExceptionQueueItem["reviewOutcomePreview"] {
  const confidence =
    closureChecklist.missingCount === 0
      ? "高"
      : agingEscalation.level === "需要升级" || dataQualityLinks.length > 0
        ? "中"
        : "低"
  const sourceReferences = Array.from(
    new Set([
      ...evidenceCards.map((card) => card.eventId),
      ...dataQualityLinks.map((link) => link.issueId),
    ])
  )

  return {
    suggestedOutcome: resolutionDraft.suggestedConclusion,
    confidence,
    evidenceSummary: [evidenceSummary.schedule, evidenceSummary.login, evidenceSummary.status],
    openRisk: resolutionDraft.riskIfOpen,
    nextReviewPoint: resolutionDraft.nextReviewPoint,
    sourceReferences,
    readiness: `已齐 ${closureChecklist.readyCount} 项 / 待补 ${closureChecklist.missingCount} 项`,
    boundary: "仅作为主管复核前的结论预览，不形成处理记录。",
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

function buildExceptionDataQualityLinks(
  explanation: TimelineExceptionExplanation,
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"]
): FulfillmentMatrixExceptionQueueItem["dataQualityLinks"] {
  const issue =
    explanation.type === "状态不一致"
      ? dataQualityLinkIssues.statusOverlap
      : dataQualityLinkIssues.loginMasterData

  const sourceRecords =
    explanation.type === "状态不一致"
      ? evidenceCards.filter((card) => card.track === "status").map((card) => card.eventId)
      : evidenceCards.filter((card) => card.track === "login").map((card) => card.eventId)
  const matchedFields =
    explanation.type === "状态不一致"
      ? [issue.sourceField, "培训安排说明"]
      : [issue.sourceField, "员工到岗说明"]

  return [
    {
      issueId: issue.id,
      title: issue.title,
      source: issue.source,
      sourceLabel: issue.sourceLabel,
      severity: issue.severity,
      status: issue.status,
      owner: issue.owner,
      href: `/data-quality/${issue.id}`,
      matchedRecords: sourceRecords,
      matchedFields,
      reason:
        explanation.type === "状态不一致"
          ? "状态不一致需要核对状态日志切片是否会影响个人三轨解释。"
          : "登录缺口需要核对登录日志和人员主数据是否能支撑当日履约判断。",
      recommendation: issue.recommendation,
    },
  ]
}

function buildExceptionAgingEscalation(
  explanation: TimelineExceptionExplanation,
  date: string
): FulfillmentMatrixExceptionQueueItem["agingEscalation"] {
  const detectedTime =
    explanation.type === "状态不一致"
      ? addMinutesToClock(explanation.start, 10)
      : addMinutesToClock(explanation.end, 1)
  const waitingMinutes = Math.max(
    0,
    timeToMinutes(fulfillmentMatrixReviewCheckpoint) - timeToMinutes(detectedTime)
  )
  const waitingLabel = formatWaitingMinutes(waitingMinutes)

  if (explanation.type === "状态不一致") {
    const level = waitingMinutes >= 120 ? "需要升级" : waitingMinutes >= 60 ? "接近超时" : "正常跟进"

    return {
      detectedAt: `${date} ${detectedTime}`,
      waitingMinutes,
      waitingLabel,
      level,
      reason: `状态判断已等待 ${waitingLabel}，需在班中复核培训安排说明。`,
      escalationTarget: "现场主管",
      nextReviewWindow: `${date} 15:30 前`,
      queueHint: "关注培训说明是否补齐，避免午后状态判断延后。",
    }
  }

  if (explanation.type === "登录不足") {
    const level = waitingMinutes >= 180 ? "需要升级" : waitingMinutes >= 60 ? "接近超时" : "正常跟进"

    return {
      detectedAt: `${date} ${detectedTime}`,
      waitingMinutes,
      waitingLabel,
      level,
      reason: `登录不足已等待 ${waitingLabel}，仍需确认离岗或断连原因。`,
      escalationTarget: "现场主管",
      nextReviewWindow: `${date} 15:00 前`,
      queueHint: "先核对离岗说明和登出记录，避免履约时长判断悬空。",
    }
  }

  const level = waitingMinutes >= 180 ? "需要升级" : waitingMinutes >= 60 ? "接近超时" : "正常跟进"

  return {
    detectedAt: `${date} ${detectedTime}`,
    waitingMinutes,
    waitingLabel,
    level,
    reason: `登录缺口已等待 ${waitingLabel}，仍缺员工到岗说明。`,
    escalationTarget: "现场主管",
    nextReviewWindow: `${date} 15:00 前`,
    queueHint: "先处理该项，避免当日登录缺口判断悬空。",
  }
}

const dataQualityLinkIssues = {
  loginMasterData: {
    id: "DQ-202605-009",
    title: "登录员工不在主数据",
    source: "login_log" as const,
    sourceLabel: "登录日志",
    sourceField: "login_log.employee_id",
    severity: "low" as const,
    status: "ignored" as const,
    owner: "现场主管",
    recommendation: "确认是否为临时账号；若需要计入履约，先补主数据。",
  },
  statusOverlap: {
    id: "DQ-202605-010",
    title: "状态时间段重叠",
    source: "status_log" as const,
    sourceLabel: "状态日志",
    sourceField: "status_log.status_start_at/status_end_at",
    severity: "high" as const,
    status: "open" as const,
    owner: "运营负责人",
    recommendation: "拆分或修正重叠状态，避免非有效产能重复计算。",
  },
}

function buildDataQualityRepairPrep(explanation: TimelineExceptionExplanation) {
  if (explanation.type === "登录缺口") {
    return {
      needsDataOwner: true,
      priority: "高" as const,
      reason: "登录开始时间晚于排班开始时间，需先确认是否为原始登录日志延迟。",
      ownerTeam: "数据管理员",
    }
  }

  if (explanation.type === "登录不足") {
    return {
      needsDataOwner: true,
      priority: "中" as const,
      reason: "登录结束时间早于排班结束时间，需核对原始登出日志是否准确。",
      ownerTeam: "数据管理员",
    }
  }

  return {
    needsDataOwner: false,
    priority: "中" as const,
    reason: "状态轨道为培训，优先由现场主管确认培训安排是否登记。",
    ownerTeam: "现场主管",
  }
}

function buildRepairMaterials(
  explanation: TimelineExceptionExplanation,
  evidenceCards: FulfillmentMatrixExceptionQueueItem["evidenceCards"]
) {
  const records = evidenceCards.map((card) => card.eventId)

  if (explanation.type === "登录缺口") {
    return {
      records,
      fields: ["排班开始时间", "登录开始时间", "员工到岗说明"],
      supportingNotes: ["员工到岗说明", "CORN 原始登录日志截图", "现场主管确认口径"],
    }
  }

  if (explanation.type === "登录不足") {
    return {
      records,
      fields: ["排班结束时间", "登录结束时间", "员工离岗说明"],
      supportingNotes: ["员工离岗说明", "CORN 原始登出日志截图", "现场主管确认口径"],
    }
  }

  return {
    records,
    fields: ["排班覆盖时段", "登录覆盖时段", "状态类型", "培训安排说明"],
    supportingNotes: ["培训安排说明", "状态来源说明", "现场主管复核结论"],
  }
}

function buildDataQualityImpactScope(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation
) {
  if (explanation.type === "登录缺口") {
    return {
      impactedObjects: [member.employeeName, "早班", `${explanation.date} 小组矩阵`],
      impactedComparisons: ["排班 vs 登录", "当日履约缺口"],
      excludedScope: "不影响班次类型、供应商绑定和需求预测版本。",
    }
  }

  if (explanation.type === "登录不足") {
    return {
      impactedObjects: [member.employeeName, "当日班次", `${explanation.date} 小组矩阵`],
      impactedComparisons: ["排班 vs 登录", "当日履约时长"],
      excludedScope: "不影响班次类型、供应商绑定和需求预测版本。",
    }
  }

  return {
    impactedObjects: [member.employeeName, "状态轨道", `${explanation.date} 小组矩阵`],
    impactedComparisons: ["排班 vs 状态", "当日异常人数"],
    excludedScope: "不影响登录原始时长、班次类型和需求预测版本。",
  }
}

function buildSupervisorFollowUp(
  member: FulfillmentMatrixMember,
  explanation: TimelineExceptionExplanation
) {
  if (explanation.type === "登录缺口") {
    return {
      owner: "现场主管",
      status: "待补说明" as const,
      nextCheckAt: `${explanation.date} 10:00`,
      currentFocus: `确认${member.employeeName}实际到岗时间和迟到原因。`,
    }
  }

  if (explanation.type === "登录不足") {
    return {
      owner: "现场主管",
      status: "待补说明" as const,
      nextCheckAt: `${explanation.date} 18:00`,
      currentFocus: `确认${member.employeeName}实际离岗时间和离岗原因。`,
    }
  }

  return {
    owner: "现场主管",
    status: "待主管复核" as const,
    nextCheckAt: `${explanation.date} 15:00`,
    currentFocus: "确认培训安排是否符合当班在线要求。",
  }
}

function buildFollowUpGaps(explanation: TimelineExceptionExplanation) {
  if (explanation.type === "登录缺口") {
    return {
      missingNotes: ["员工到岗说明", "迟到或漏登原因"],
      missingRecords: ["CORN 原始登录日志截图"],
      missingDecisions: ["现场主管确认口径"],
    }
  }

  if (explanation.type === "登录不足") {
    return {
      missingNotes: ["员工离岗说明", "提前离岗或系统记录原因"],
      missingRecords: ["CORN 原始登出日志截图"],
      missingDecisions: ["现场主管确认口径"],
    }
  }

  return {
    missingNotes: ["培训安排说明", "在线要求确认"],
    missingRecords: ["状态来源说明"],
    missingDecisions: ["主管复核结论"],
  }
}

function buildGroupFollowUpRollup(
  queue: FulfillmentMatrixExceptionQueueItem[],
  index: number
) {
  const sameGroupOpenCount = queue.length
  const highPriorityOpenCount = queue.filter((item) => item.priority === "high").length
  const supplier = queue[index]?.supplier ?? "当前小组"

  return {
    queuePosition: `第 ${index + 1} / ${sameGroupOpenCount} 项`,
    sameGroupOpenCount,
    highPriorityOpenCount,
    groupRiskNote: `${supplier} 当日仍有 ${sameGroupOpenCount} 项待跟进，其中 ${highPriorityOpenCount} 项为高优先。`,
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
    missingMaterialCount: queue.filter((item) => item.reviewGroup.code === "missing_material")
      .length,
    supervisorJudgmentCount: queue.filter(
      (item) => item.reviewGroup.code === "supervisor_judgment"
    ).length,
    dataCheckCount: queue.filter((item) => item.reviewGroup.code === "data_check").length,
    agingWatchCount: queue.filter((item) => item.agingEscalation.level !== "正常跟进").length,
    escalationCount: queue.filter((item) => item.agingEscalation.level === "需要升级").length,
    totalImpactHours: roundHours(queue.reduce((total, item) => total + item.impactHours, 0)),
  }
}

function summarizeFulfillmentMatrixReviewLoad(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentMatrixReviewLoadSummary {
  const groups = reviewLoadGroupOrder.map((group) => {
    const items = queue.filter((item) => item.reviewGroup.code === group.code)
    return {
      code: group.code,
      label: group.label,
      count: items.length,
      highPriorityCount: items.filter((item) => item.priority === "high").length,
      readyItemCount: items.reduce(
        (total, item) => total + item.closureChecklist.readyCount,
        0
      ),
      missingItemCount: items.reduce(
        (total, item) => total + item.closureChecklist.missingCount,
        0
      ),
      reason: items[0]?.reviewGroup.reason ?? group.emptyReason,
    }
  })

  const topGroup = [...groups].sort(
    (a, b) =>
      b.count - a.count ||
      b.highPriorityCount - a.highPriorityCount ||
      b.missingItemCount - a.missingItemCount ||
      reviewLoadGroupRank[a.code] - reviewLoadGroupRank[b.code]
  )[0]
  const nextPriority = queue[0]

  return {
    totalOpenCount: queue.length,
    highPriorityOpenCount: queue.filter((item) => item.priority === "high").length,
    readyItemCount: queue.reduce((total, item) => total + item.closureChecklist.readyCount, 0),
    missingItemCount: queue.reduce(
      (total, item) => total + item.closureChecklist.missingCount,
      0
    ),
    topReviewGroup: {
      code: topGroup.code,
      label: topGroup.label,
      count: topGroup.count,
      reason: topGroup.reason,
    },
    nextPriority: nextPriority
      ? {
          key: nextPriority.key,
          employeeId: nextPriority.employeeId,
          employeeName: nextPriority.employeeName,
          title: nextPriority.title,
          reason: buildReviewLoadNextPriorityReason(nextPriority),
        }
      : undefined,
    groups,
  }
}

function summarizeSupervisorDailyWorkload(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentSupervisorDailyWorkload {
  const ownerLoads = buildSupervisorDailyWorkloadOwnerLoads(queue)
  const busiestOwner = ownerLoads[0] ?? emptySupervisorWorkloadOwner("现场主管")
  const nextFocus = queue[0]

  return {
    totalFocusItems: queue.length,
    highPriorityItems: queue.filter((item) => item.priority === "high").length,
    agingWatchItems: queue.filter((item) => item.agingEscalation.level !== "正常跟进").length,
    escalationItems: queue.filter((item) => item.agingEscalation.level === "需要升级").length,
    totalImpactHours: roundHours(queue.reduce((total, item) => total + item.impactHours, 0)),
    busiestOwner: {
      ownerRole: busiestOwner.ownerRole,
      itemCount: busiestOwner.itemCount,
      reason: `${busiestOwner.ownerRole}今日有 ${busiestOwner.itemCount} 项待关注，其中 ${busiestOwner.escalationCount} 项建议升级。`,
    },
    nextFocus: nextFocus
      ? {
          key: nextFocus.key,
          employeeId: nextFocus.employeeId,
          employeeName: nextFocus.employeeName,
          title: nextFocus.title,
          ownerRole: nextFocus.supervisorFollowUp.owner,
          reason: `${nextFocus.agingEscalation.level} / ${nextFocus.reviewGroup.label} / 等待 ${nextFocus.agingEscalation.waitingLabel}`,
        }
      : undefined,
    ownerLoads,
  }
}

function buildSupervisorDailyWorkloadOwnerLoads(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentSupervisorDailyWorkloadOwner[] {
  const loads = new Map<string, FulfillmentSupervisorDailyWorkloadOwner>()

  for (const item of queue) {
    addSupervisorWorkloadOwner(loads, item.supervisorFollowUp.owner, item)

    if (item.dataQualityRepairPrep.needsDataOwner) {
      addSupervisorWorkloadOwner(loads, item.dataQualityRepairPrep.ownerTeam, item)
    }
  }

  return [...loads.values()].sort(
    (a, b) =>
      b.itemCount - a.itemCount ||
      b.escalationCount - a.escalationCount ||
      b.impactHours - a.impactHours ||
      a.ownerRole.localeCompare(b.ownerRole)
  )
}

function addSupervisorWorkloadOwner(
  loads: Map<string, FulfillmentSupervisorDailyWorkloadOwner>,
  ownerRole: string,
  item: FulfillmentMatrixExceptionQueueItem
) {
  const current = loads.get(ownerRole) ?? emptySupervisorWorkloadOwner(ownerRole)

  current.itemCount += 1
  current.highPriorityCount += item.priority === "high" ? 1 : 0
  current.agingWatchCount += item.agingEscalation.level !== "正常跟进" ? 1 : 0
  current.escalationCount += item.agingEscalation.level === "需要升级" ? 1 : 0
  current.impactHours = roundHours(current.impactHours + item.impactHours)
  loads.set(ownerRole, current)
}

function emptySupervisorWorkloadOwner(ownerRole: string): FulfillmentSupervisorDailyWorkloadOwner {
  return {
    ownerRole,
    itemCount: 0,
    highPriorityCount: 0,
    agingWatchCount: 0,
    escalationCount: 0,
    impactHours: 0,
    focus: ownerRole === "数据管理员" ? "核对原始登录或状态日志。" : "补充到岗、培训安排和主管判断材料。",
  }
}

function summarizeExceptionSources(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentExceptionSourceSummary {
  const sources = exceptionSourceOrder.map((track) => {
    const items = queue.filter((item) => getExceptionPrimarySource(item) === track)
    return {
      track,
      label: exceptionSourceLabel[track],
      itemCount: items.length,
      highPriorityCount: items.filter((item) => item.priority === "high").length,
      agingWatchCount: items.filter((item) => item.agingEscalation.level !== "正常跟进").length,
      escalationCount: items.filter((item) => item.agingEscalation.level === "需要升级").length,
      impactHours: roundHours(items.reduce((total, item) => total + item.impactHours, 0)),
      focus: exceptionSourceFocus[track],
    }
  })
  const primarySource = [...sources].sort(
    (a, b) =>
      b.escalationCount - a.escalationCount ||
      b.highPriorityCount - a.highPriorityCount ||
      b.itemCount - a.itemCount ||
      b.impactHours - a.impactHours ||
      exceptionSourceRank[a.track] - exceptionSourceRank[b.track]
  )[0]
  const nextSource = queue[0] ? getExceptionPrimarySource(queue[0]) : undefined
  const nextSourceSummary = nextSource ? sources.find((source) => source.track === nextSource) : undefined

  return {
    totalSources: sources.filter((source) => source.itemCount > 0).length,
    primarySource: {
      track: primarySource.track,
      label: primarySource.label,
      itemCount: primarySource.itemCount,
      reason: buildExceptionSourceReason(primarySource),
    },
    nextSource: nextSourceSummary
      ? {
          track: nextSourceSummary.track,
          label: nextSourceSummary.label,
          reason: `${queue[0].agingEscalation.level} / ${queue[0].reviewGroup.label} / 影响 ${formatImpactHours(queue[0].impactHours)}h`,
        }
      : undefined,
    sources,
  }
}

function getExceptionPrimarySource(item: FulfillmentMatrixExceptionQueueItem): TimelineEventType {
  if (item.type === "状态不一致") {
    return "status"
  }

  if (item.type === "登录缺口" || item.type === "登录不足") {
    return "login"
  }

  return "schedule"
}

function buildExceptionSourceReason(source: FulfillmentExceptionSourceSummarySource) {
  if (source.track === "login") {
    return `${source.label}有 ${source.itemCount} 项异常，其中 ${source.highPriorityCount} 项高优先，建议先核对原始登录记录。`
  }

  if (source.track === "status") {
    return `${source.label}有 ${source.itemCount} 项异常，影响 ${formatImpactHours(source.impactHours)}h，建议先核对状态说明。`
  }

  return `${source.label}有 ${source.itemCount} 项异常，建议先核对排班覆盖和人员安排。`
}

function summarizeSupervisorHandoffOverview(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentSupervisorHandoffOverview {
  const recipients = buildSupervisorHandoffRecipients(queue)
  const topRecipient = recipients[0] ?? emptySupervisorHandoffRecipient("现场主管")
  const nextHandoff = queue[0]

  return {
    totalHandoffItems: queue.length,
    openQuestionCount: queue.reduce(
      (total, item) => total + item.handoffSummary.openQuestions.length,
      0
    ),
    escalationItems: queue.filter((item) => item.agingEscalation.level === "需要升级").length,
    topRecipient: {
      recipient: topRecipient.recipient,
      itemCount: topRecipient.itemCount,
      reason: `${topRecipient.recipient}有 ${topRecipient.itemCount} 项需要交接，仍有 ${topRecipient.openQuestionCount} 个待核对问题。`,
    },
    nextHandoff: nextHandoff
      ? {
          key: nextHandoff.key,
          employeeId: nextHandoff.employeeId,
          employeeName: nextHandoff.employeeName,
          title: nextHandoff.title,
          recipient: nextHandoff.handoffSummary.recipient,
          reason: `${nextHandoff.agingEscalation.level} / ${nextHandoff.handoffSummary.openQuestions.length} 个待核对问题 / ${nextHandoff.handoffSummary.nextTouchpoint}`,
        }
      : undefined,
    recipients,
  }
}

function summarizeGroupRiskCauseSplit(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentGroupRiskCauseSplit {
  const totalImpactHours = roundHours(queue.reduce((total, item) => total + item.impactHours, 0))
  const grouped = new Map<FulfillmentGroupRiskCauseSplit["causes"][number]["key"], FulfillmentMatrixExceptionQueueItem[]>()

  for (const item of queue) {
    const key = getGroupRiskCauseKey(item)
    grouped.set(key, [...(grouped.get(key) ?? []), item])
  }

  const causes = Array.from(grouped.entries())
    .map(([key, items]) => {
      const sortedItems = [...items].sort(
        (a, b) =>
          priorityRank[b.priority] - priorityRank[a.priority] ||
          b.impactHours - a.impactHours ||
          a.employeeId.localeCompare(b.employeeId)
      )
      const representative = sortedItems[0]
      const impactHours = roundHours(items.reduce((total, item) => total + item.impactHours, 0))

      return {
        key,
        label: groupRiskCauseLabel[key],
        itemCount: items.length,
        peopleCount: new Set(items.map((item) => item.employeeId)).size,
        impactHours,
        share: totalImpactHours > 0 ? Math.round((impactHours / totalImpactHours) * 100) : 0,
        representative: representative
          ? `${representative.employeeId} ${representative.employeeName} / ${representative.title}`
          : "",
        focus: groupRiskCauseFocus[key],
      }
    })
    .sort(
      (a, b) =>
        b.impactHours - a.impactHours ||
        b.itemCount - a.itemCount ||
        groupRiskCauseRank[a.key] - groupRiskCauseRank[b.key]
    )

  const primary = causes[0]
  const secondary = causes[1]

  return {
    headline:
      primary && secondary
        ? `当前小组风险主要来自${primary.label}，其次是${secondary.label}。`
        : primary
          ? `当前小组风险主要来自${primary.label}。`
          : "当前小组暂无风险原因。",
    totalImpactHours,
    causes,
  }
}

function summarizeDataQualityExceptionImpact(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentDataQualityExceptionImpact {
  const grouped = new Map<
    string,
    {
      issue: FulfillmentMatrixExceptionQueueItem["dataQualityLinks"][number]
      items: FulfillmentMatrixExceptionQueueItem[]
    }
  >()

  for (const item of queue) {
    for (const issue of item.dataQualityLinks) {
      const current = grouped.get(issue.issueId)
      grouped.set(issue.issueId, {
        issue,
        items: current ? [...current.items, item] : [item],
      })
    }
  }

  const issues = Array.from(grouped.values())
    .map(({ issue, items }) => {
      const sortedItems = [...items].sort(
        (a, b) =>
          priorityRank[b.priority] - priorityRank[a.priority] ||
          b.impactHours - a.impactHours ||
          a.employeeId.localeCompare(b.employeeId)
      )

      return {
        issueId: issue.issueId,
        title: issue.title,
        sourceLabel: issue.sourceLabel,
        severity: issue.severity,
        status: issue.status,
        owner: issue.owner,
        href: issue.href,
        impactedExceptionCount: items.length,
        impactedPeople: Array.from(new Set(items.map((item) => item.employeeName))).sort(),
        impactHours: roundHours(items.reduce((total, item) => total + item.impactHours, 0)),
        reason: issue.reason,
        recommendation: issue.recommendation,
        representativeExceptions: sortedItems.slice(0, 2).map((item) => ({
          key: item.key,
          employeeId: item.employeeId,
          employeeName: item.employeeName,
          title: item.title,
          priority: item.priority,
          reviewGroup: item.reviewGroup.label,
          impactHours: item.impactHours,
        })),
      }
    })
    .sort(
      (a, b) =>
        dataQualitySeverityRank[b.severity] - dataQualitySeverityRank[a.severity] ||
        b.impactHours - a.impactHours ||
        b.impactedExceptionCount - a.impactedExceptionCount ||
        a.issueId.localeCompare(b.issueId)
    )
  const impactedItems = queue.filter((item) => item.dataQualityLinks.length > 0)
  const primaryIssue = issues[0]

  return {
    headline: primaryIssue
      ? `当前 ${issues.length} 个数据质量问题关联 ${impactedItems.length} 项异常，先看${primaryIssue.title}。`
      : "当前暂无数据质量问题影响异常。",
    totalIssueCount: issues.length,
    impactedExceptionCount: impactedItems.length,
    impactedPeopleCount: new Set(impactedItems.map((item) => item.employeeId)).size,
    totalImpactHours: roundHours(
      impactedItems.reduce((total, item) => total + item.impactHours, 0)
    ),
    primaryIssue,
    issues,
  }
}

function getGroupRiskCauseKey(
  item: FulfillmentMatrixExceptionQueueItem
): FulfillmentGroupRiskCauseSplit["causes"][number]["key"] {
  if (item.type === "状态不一致") {
    return "status_alignment"
  }

  if (item.reviewGroup.code === "data_check") {
    return "data_check"
  }

  return "login_attendance"
}

function summarizeTeamWeekCarryoverOverview(
  days: FulfillmentDayMetrics[],
  selectedDate: string,
  members: PersonTimeline[],
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentTeamWeekCarryoverOverview {
  const currentDay = days.find((day) => day.date === selectedDate)
  const carryoverItems = days
    .filter(
      (day) => day.date > selectedDate && (day.gapPeople > 0 || day.anomalyPeople > 0)
    )
    .map((day, index) => ({
      date: day.date,
      label: `${day.weekday} ${day.label}`,
      gapPeople: day.gapPeople,
      anomalyPeople: day.anomalyPeople,
      reviewTarget: getCarryoverReviewTarget(members, day.date, queue),
      reason: buildCarryoverReason(day),
      orderLabel: `第 ${index + 1} 天`,
    }))

  const first = carryoverItems[0]

  return {
    headline: first
      ? `${currentDay?.weekday ?? "当日"}未闭环后，${first.label.slice(0, 2)}仍有 ${first.gapPeople} 人登录缺口需要延续查看。`
      : `${currentDay?.weekday ?? "当日"}之后暂无延续关注日。`,
    carryoverDays: carryoverItems.length,
    items: carryoverItems,
  }
}

function summarizeExceptionClosureReadiness(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentExceptionClosureReadinessSummary {
  const readyItems = queue.filter((item) => item.closureChecklist.missingCount === 0)
  const blockedItems = queue.filter((item) => item.closureChecklist.missingCount > 0)
  const blockers = reviewLoadGroupOrder
    .map((group) => {
      const items = blockedItems.filter((item) => item.reviewGroup.code === group.code)

      return {
        key: group.code,
        label: closureReadinessLabel[group.code],
        count: items.length,
        reason: buildClosureReadinessBlockerReason(group.code, items),
        evidenceItems: buildClosureReadinessEvidenceItems(items),
      }
    })
    .filter((item) => item.count > 0)
  const nextCandidate = queue[0]

  return {
    headline: buildClosureReadinessHeadline(queue.length, readyItems.length),
    readyCount: readyItems.length,
    blockedCount: blockedItems.length,
    missingMaterialCount: queue.filter((item) => item.reviewGroup.code === "missing_material").length,
    missingDecisionCount: queue.filter((item) => item.reviewGroup.code === "supervisor_judgment").length,
    dataCheckCount: queue.filter((item) => item.reviewGroup.code === "data_check").length,
    nextCandidate: nextCandidate
      ? {
          key: nextCandidate.key,
          employeeId: nextCandidate.employeeId,
          employeeName: nextCandidate.employeeName,
          title: nextCandidate.title,
          readiness: closureReadinessLabel[nextCandidate.reviewGroup.code],
          reason: buildClosureReadinessCandidateReason(nextCandidate),
        }
      : undefined,
    blockers,
  }
}

function summarizeExceptionImpactPriority(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentExceptionImpactPriority {
  const items = queue
    .map((item) => {
      const blockerCount = item.closureChecklist.missingCount

      return {
        key: item.key,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        title: item.title,
        priority: item.priority,
        reviewGroup: item.reviewGroup.label,
        agingLevel: item.agingEscalation.level,
        impactHours: item.impactHours,
        impactedObjects: item.dataQualityImpactScope.impactedObjects,
        impactedComparisons: item.dataQualityImpactScope.impactedComparisons,
        blockerCount,
        priorityReason: `影响 ${item.impactHours.toFixed(2)}h / ${
          item.dataQualityImpactScope.impactedComparisons.length
        } 个影响对比 / 待补 ${blockerCount} 项 / ${item.agingEscalation.level}`,
        excludedScope: item.dataQualityImpactScope.excludedScope,
      }
    })
    .sort(
      (a, b) =>
        b.impactHours - a.impactHours ||
        b.impactedComparisons.length - a.impactedComparisons.length ||
        b.blockerCount - a.blockerCount ||
        priorityRank[b.priority] - priorityRank[a.priority] ||
        escalationLevelRank[b.agingLevel] - escalationLevelRank[a.agingLevel] ||
        a.employeeId.localeCompare(b.employeeId)
    )
  const topItem = items[0]

  return {
    headline: topItem
      ? `优先查看${topItem.employeeName} / ${topItem.title}，影响 ${topItem.impactHours.toFixed(
          2
        )}h，涉及 ${topItem.impactedObjects.length} 个对象。`
      : "当前小组暂无可排序的异常影响范围。",
    totalImpactHours: roundHours(queue.reduce((total, item) => total + item.impactHours, 0)),
    blockedItemCount: queue.filter((item) => item.closureChecklist.missingCount > 0).length,
    topItem,
    items,
  }
}

function summarizeSupervisorPrioritySummary(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentSupervisorPrioritySummary {
  const highPriorityCount = queue.filter((item) => item.priority === "high").length
  const blockedCount = queue.filter((item) => item.closureChecklist.missingCount > 0).length
  const escalationCount = queue.filter((item) => item.agingEscalation.level === "需要升级").length
  const totalImpactHours = roundHours(queue.reduce((total, item) => total + item.impactHours, 0))
  const orderedItems = queue
    .map((item) => buildSupervisorPrioritySummaryItem(item))
    .sort(
      (a, b) =>
        Number(b.priority === "high") - Number(a.priority === "high") ||
        escalationLevelRank[b.agingLevel] - escalationLevelRank[a.agingLevel] ||
        b.blockerCount - a.blockerCount ||
        b.impactHours - a.impactHours ||
        b.impactScope.split(" / ").length - a.impactScope.split(" / ").length ||
        a.employeeId.localeCompare(b.employeeId)
    )
  const topFocus = orderedItems[0]

  return {
    headline: buildSupervisorPriorityHeadline(topFocus),
    totalImpactHours,
    highPriorityCount,
    blockedCount,
    escalationCount,
    focusReasons: [
      `高优异常 ${highPriorityCount} 项`,
      `升级关注 ${escalationCount} 项`,
      `闭环阻塞 ${blockedCount} 项`,
      `总影响 ${totalImpactHours.toFixed(2)}h`,
    ],
    topFocus,
    orderedItems,
  }
}

function buildSupervisorPrioritySummaryItem(
  item: FulfillmentMatrixExceptionQueueItem
): FulfillmentSupervisorPrioritySummaryItem {
  const blockerCount = item.closureChecklist.missingCount

  return {
    key: item.key,
    employeeId: item.employeeId,
    employeeName: item.employeeName,
    title: item.title,
    priority: item.priority,
    reviewGroup: item.reviewGroup.label,
    agingLevel: item.agingEscalation.level,
    impactHours: item.impactHours,
    blockerCount,
    focusReason: `${supervisorPriorityShortLabel[item.priority]} / ${item.agingEscalation.level} / 待补 ${blockerCount} 项 / 影响 ${item.impactHours.toFixed(2)}h`,
    impactScope: item.dataQualityImpactScope.impactedObjects.join(" / "),
    nextView: `先核对${item.handlingGuide.requiredInfo.join("、")}。`,
  }
}

function buildSupervisorPriorityHeadline(topFocus?: FulfillmentSupervisorPrioritySummaryItem) {
  if (!topFocus) {
    return "当前小组暂无需要排序的主管关注项。"
  }

  if (topFocus.priority === "high" && topFocus.agingLevel === "需要升级") {
    return `优先查看${topFocus.employeeName} / ${topFocus.title}：高优异常且需要升级，先补 ${topFocus.blockerCount} 项材料。`
  }

  return `优先查看${topFocus.employeeName} / ${topFocus.title}：${topFocus.focusReason}。`
}

const closureReadinessLabel: Record<
  FulfillmentMatrixExceptionQueueItem["reviewGroup"]["code"],
  FulfillmentExceptionClosureReadinessSummary["blockers"][number]["label"]
> = {
  missing_material: "待补材料",
  supervisor_judgment: "待主管判断",
  data_check: "待数据核对",
}

const supervisorPriorityShortLabel: Record<TimelineAnomaly["severity"], string> = {
  high: "高优",
  medium: "中优",
  low: "低优",
}

function buildClosureReadinessHeadline(totalCount: number, readyCount: number) {
  if (totalCount === 0) {
    return "当前小组暂无待闭环异常。"
  }

  if (readyCount === totalCount) {
    return `当前 ${totalCount} 项异常均已具备闭环前置条件。`
  }

  if (readyCount > 0) {
    return `当前 ${readyCount} / ${totalCount} 项异常具备闭环前置条件，其余仍需补齐材料或判断。`
  }

  return `当前 ${totalCount} 项异常均未达到闭环条件，优先补齐主管判断和到岗说明。`
}

function buildClosureReadinessCandidateReason(item: FulfillmentMatrixExceptionQueueItem) {
  if (item.reviewGroup.code === "missing_material") {
    return `缺少${formatRequiredInfo(item.handlingGuide.requiredInfo)}。`
  }

  if (item.reviewGroup.code === "supervisor_judgment") {
    return `${item.employeeName}仍需确认培训安排是否符合在线要求。`
  }

  return `${item.employeeName}仍需数据管理员核对原始记录。`
}

function buildClosureReadinessBlockerReason(
  code: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["code"],
  items: FulfillmentMatrixExceptionQueueItem[]
) {
  const first = items[0]

  if (!first) {
    return "暂无阻塞项。"
  }

  if (code === "missing_material") {
    return `${first.employeeName}仍需补${formatRequiredInfo(first.handlingGuide.requiredInfo)}。`
  }

  if (code === "supervisor_judgment") {
    return `${first.employeeName}仍需确认培训安排是否符合在线要求。`
  }

  return `${first.employeeName}仍需数据管理员核对原始记录。`
}

function buildClosureReadinessEvidenceItems(items: FulfillmentMatrixExceptionQueueItem[]) {
  return items.flatMap((item) => {
    const sourceRecords = item.evidenceCards.map((card) => card.eventId)
    const currentEvidence = sourceRecords.length
      ? `已有关联证据：${sourceRecords.join(" / ")}`
      : "暂无已关联证据"

    return item.closureChecklist.items
      .filter((checklistItem) => checklistItem.status !== "已关联")
      .map((checklistItem) => ({
        key: `${item.key}::${checklistItem.label}`,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        title: checklistItem.label,
        ownerRole: checklistItem.ownerRole,
        status: checklistItem.status,
        sourceRecords,
        currentEvidence,
        nextView: `查看${item.employeeName}的个人单日三轨详情。`,
      }))
  })
}

function formatRequiredInfo(items: string[]) {
  return items.join("、")
}

function getCarryoverReviewTarget(
  members: PersonTimeline[],
  date: string,
  queue: FulfillmentMatrixExceptionQueueItem[]
) {
  const gapMembers = members.filter((member) => {
    const dailyTracks = filterTracksByDate(member, date)
    return sumEvents(dailyTracks.schedule) > sumEvents(dailyTracks.login)
  })
  const queuedGapMember = queue
    .map((item) => gapMembers.find((member) => member.employeeId === item.employeeId))
    .find(Boolean)
  const target = queuedGapMember ?? gapMembers[0] ?? queue[0]

  return target ? `${target.employeeId} ${target.employeeName}` : "当前小组"
}

function buildCarryoverReason(day: FulfillmentDayMetrics) {
  if (day.gapPeople > 0 && day.anomalyPeople > 0) {
    return `${day.weekday}仍有 ${day.gapPeople} 人登录缺口和 ${day.anomalyPeople} 人异常，需连续回看今日未闭环对象。`
  }

  if (day.gapPeople > 0) {
    return `${day.weekday}仍有 ${day.gapPeople} 人登录缺口，需回看今日到岗问题是否连续。`
  }

  return `${day.weekday}仍有 ${day.anomalyPeople} 人异常，需回看今日状态或数据问题是否延续。`
}

function buildSupervisorHandoffRecipients(
  queue: FulfillmentMatrixExceptionQueueItem[]
): FulfillmentSupervisorHandoffRecipient[] {
  const recipients = new Map<string, FulfillmentSupervisorHandoffRecipient>()

  for (const item of queue) {
    const current =
      recipients.get(item.handoffSummary.recipient) ??
      emptySupervisorHandoffRecipient(item.handoffSummary.recipient)

    current.itemCount += 1
    current.highPriorityCount += item.priority === "high" ? 1 : 0
    current.agingWatchCount += item.agingEscalation.level !== "正常跟进" ? 1 : 0
    current.escalationCount += item.agingEscalation.level === "需要升级" ? 1 : 0
    current.openQuestionCount += item.handoffSummary.openQuestions.length
    if (!current.nextTouchpoint) {
      current.nextTouchpoint = item.handoffSummary.nextTouchpoint
    }
    recipients.set(item.handoffSummary.recipient, current)
  }

  return [...recipients.values()].sort(
    (a, b) =>
      b.itemCount - a.itemCount ||
      b.escalationCount - a.escalationCount ||
      b.openQuestionCount - a.openQuestionCount ||
      a.recipient.localeCompare(b.recipient)
  )
}

function emptySupervisorHandoffRecipient(recipient: string): FulfillmentSupervisorHandoffRecipient {
  return {
    recipient,
    itemCount: 0,
    highPriorityCount: 0,
    agingWatchCount: 0,
    escalationCount: 0,
    openQuestionCount: 0,
    nextTouchpoint: "",
    focus: "集中说明待核对问题和下一触点，避免交接后重复追问。",
  }
}

function summarizeTeamDayRiskDigest(
  queue: FulfillmentMatrixExceptionQueueItem[],
  queueSummary: FulfillmentMatrixExceptionQueueSummary,
  sourceSummary: FulfillmentExceptionSourceSummary,
  handoffOverview: FulfillmentSupervisorHandoffOverview
): FulfillmentTeamDayRiskDigest {
  const riskScore = calculateTeamDayRiskScore(queueSummary)
  const riskLevel = getTeamDayRiskLevel(riskScore)
  const nextFocus = queue[0]
  const activeSources = sourceSummary.sources.filter((source) => source.itemCount > 0)
  const secondarySource = activeSources.find(
    (source) => source.track !== sourceSummary.primarySource.track
  )

  return {
    riskLevel,
    riskScore,
    headline: buildTeamDayRiskHeadline(riskLevel, sourceSummary, secondarySource, nextFocus),
    primaryRisk: buildTeamDayPrimaryRisk(queueSummary),
    nextFocus: nextFocus
      ? {
          key: nextFocus.key,
          employeeId: nextFocus.employeeId,
          employeeName: nextFocus.employeeName,
          title: nextFocus.title,
          reason: `${nextFocus.agingEscalation.level} / ${
            exceptionSourceLabel[getExceptionPrimarySource(nextFocus)]
          } / ${nextFocus.handoffSummary.openQuestions.length} 个待核对问题`,
        }
      : undefined,
    signals: [
      {
        label: "待关注异常",
        value: `${queueSummary.totalCount}项`,
        tone: queueSummary.highPriorityCount > 0 ? "high" : queueSummary.totalCount > 0 ? "medium" : "low",
        reason: `其中 ${queueSummary.highPriorityCount} 项高优先，影响 ${formatImpactHours(
          roundHours(queue.reduce((total, item) => total + item.impactHours, 0))
        )}h。`,
      },
      {
        label: "超时关注",
        value: `${queueSummary.agingWatchCount}项`,
        tone: queueSummary.escalationCount > 0 ? "high" : queueSummary.agingWatchCount > 0 ? "medium" : "low",
        reason: `${queueSummary.escalationCount} 项建议升级。`,
      },
      {
        label: "主要来源",
        value: sourceSummary.primarySource.label,
        tone: sourceSummary.primarySource.itemCount > 0 ? "high" : "low",
        reason: `${sourceSummary.primarySource.label}有 ${sourceSummary.primarySource.itemCount} 项异常。`,
      },
      {
        label: "交接压力",
        value: `${handoffOverview.openQuestionCount}问`,
        tone: handoffOverview.openQuestionCount >= 4 ? "medium" : "low",
        reason: `${handoffOverview.topRecipient.recipient}有 ${handoffOverview.topRecipient.itemCount} 项需要交接。`,
      },
    ],
  }
}

function calculateTeamDayRiskScore(summary: FulfillmentMatrixExceptionQueueSummary) {
  if (summary.totalCount === 0) {
    return 0
  }

  return Math.min(
    100,
    50 +
      summary.highPriorityCount * 10 +
      summary.escalationCount * 16 +
      summary.agingWatchCount * 5
  )
}

function getTeamDayRiskLevel(score: number): FulfillmentTeamDayRiskDigest["riskLevel"] {
  if (score >= 80) {
    return "高"
  }

  if (score >= 50) {
    return "中"
  }

  return "低"
}

function summarizeTeamDayRiskTrend(
  days: FulfillmentDayMetrics[],
  selectedDate: string
): FulfillmentTeamDayRiskTrend {
  const points = days
    .filter((day) => day.plannedPeople > 0 || day.loginPeople > 0 || day.gapPeople > 0 || day.anomalyPeople > 0)
    .map(buildTeamDayRiskTrendPoint)
  const fallbackPoint = buildTeamDayRiskTrendPoint(
    days.find((day) => day.date === selectedDate) ?? days[0]
  )
  const currentDay = points.find((point) => point.date === selectedDate) ?? points[0] ?? fallbackPoint
  const currentIndex = points.findIndex((point) => point.date === currentDay.date)
  const comparisonDay =
    currentIndex > 0 ? points[currentIndex - 1] : points[currentIndex + 1] ?? currentDay
  const comparesNext = currentIndex === 0 && Boolean(points[currentIndex + 1])
  const scoreDelta = currentDay.score - comparisonDay.score
  const highestRiskDay = [...points, currentDay].sort(
    (a, b) =>
      b.score - a.score ||
      b.anomalyPeople - a.anomalyPeople ||
      b.gapPeople - a.gapPeople ||
      a.date.localeCompare(b.date)
  )[0]
  const direction = getTeamDayRiskTrendDirection(scoreDelta, comparesNext)

  return {
    direction,
    headline: buildTeamDayRiskTrendHeadline(direction, currentDay, highestRiskDay),
    currentDay,
    comparison: {
      label: comparesNext ? "较下一有排班日" : "较上一有排班日",
      scoreDelta: Math.abs(scoreDelta),
      summary: buildTeamDayRiskTrendComparisonSummary(currentDay, comparisonDay, scoreDelta),
    },
    highestRiskDay: {
      date: highestRiskDay.date,
      label: highestRiskDay.label,
      score: highestRiskDay.score,
      reason: `缺口 ${highestRiskDay.gapPeople} 人 / 异常 ${highestRiskDay.anomalyPeople} 人`,
    },
    nextFocus: {
      date: currentDay.date,
      label: currentDay.label,
      reason:
        currentDay.anomalyPeople > 0
          ? `先处理${currentDay.label.slice(0, 2)} ${currentDay.anomalyPeople} 项异常，避免高风险日悬空。`
          : `先核对${currentDay.label.slice(0, 2)}缺口，确认是否需要继续下钻。`,
    },
    points,
  }
}

function buildTeamDayRiskTrendPoint(day: FulfillmentDayMetrics): FulfillmentTeamDayRiskTrendPoint {
  const score = Math.min(100, day.gapPeople * 20 + day.anomalyPeople * 30)

  return {
    date: day.date,
    label: `${day.weekday} ${day.label}`,
    score,
    riskLevel: getTeamDayRiskLevel(score),
    gapPeople: day.gapPeople,
    anomalyPeople: day.anomalyPeople,
  }
}

function getTeamDayRiskTrendDirection(scoreDelta: number, comparesNext: boolean): FulfillmentTeamDayRiskTrend["direction"] {
  if (scoreDelta === 0) {
    return "持平"
  }

  if (comparesNext) {
    return scoreDelta > 0 ? "下降" : "上升"
  }

  return scoreDelta > 0 ? "上升" : "下降"
}

function buildTeamDayRiskTrendHeadline(
  direction: FulfillmentTeamDayRiskTrend["direction"],
  currentDay: FulfillmentTeamDayRiskTrendPoint,
  highestRiskDay: FulfillmentTeamDayRiskTrendPoint
) {
  if (currentDay.date === highestRiskDay.date && direction === "下降") {
    return `本周风险从${currentDay.label.slice(0, 2)}高位回落，当前日仍是最高风险日。`
  }

  if (currentDay.date === highestRiskDay.date) {
    return `当前日是本周最高风险日，风险趋势${direction}。`
  }

  return `本周最高风险日在${highestRiskDay.label.slice(0, 2)}，当前日风险趋势${direction}。`
}

function buildTeamDayRiskTrendComparisonSummary(
  currentDay: FulfillmentTeamDayRiskTrendPoint,
  comparisonDay: FulfillmentTeamDayRiskTrendPoint,
  scoreDelta: number
) {
  if (scoreDelta === 0) {
    return `与${comparisonDay.label.slice(0, 2)}持平，缺口和异常需要继续观察。`
  }

  const scoreText = scoreDelta > 0 ? "高" : "低"
  const gapDelta = currentDay.gapPeople - comparisonDay.gapPeople
  const anomalyDelta = currentDay.anomalyPeople - comparisonDay.anomalyPeople

  return `比${comparisonDay.label.slice(0, 2)}${scoreText} ${Math.abs(scoreDelta)} 分，缺口${formatPeopleDelta(
    gapDelta
  )}，异常${formatPeopleDelta(anomalyDelta)}。`
}

function formatPeopleDelta(delta: number) {
  if (delta === 0) {
    return "持平"
  }

  return `${delta > 0 ? "多" : "少"} ${Math.abs(delta)} 人`
}

function buildTeamDayRiskHeadline(
  riskLevel: FulfillmentTeamDayRiskDigest["riskLevel"],
  sourceSummary: FulfillmentExceptionSourceSummary,
  secondarySource: FulfillmentExceptionSourceSummarySource | undefined,
  nextFocus: FulfillmentMatrixExceptionQueueItem | undefined
) {
  if (!nextFocus || sourceSummary.primarySource.itemCount === 0) {
    return "当日风险平稳：暂无需要优先查看的异常。"
  }

  const sourceText = secondarySource
    ? `${sourceSummary.primarySource.label}与${secondarySource.label}同时存在异常`
    : `${sourceSummary.primarySource.label}存在异常`

  return `当日${riskLevel}风险：${sourceText}，先看${nextFocus.employeeName}。`
}

function buildTeamDayPrimaryRisk(summary: FulfillmentMatrixExceptionQueueSummary) {
  if (summary.escalationCount > 0) {
    return {
      label: "建议升级",
      reason: `${summary.escalationCount} 项异常已达到升级关注，${summary.agingWatchCount} 项仍在超时关注。`,
    }
  }

  if (summary.highPriorityCount > 0) {
    return {
      label: "高优先",
      reason: `${summary.highPriorityCount} 项异常为高优先，建议先看影响最大的人员。`,
    }
  }

  return {
    label: summary.totalCount > 0 ? "异常关注" : "风险平稳",
    reason:
      summary.totalCount > 0
        ? `${summary.totalCount} 项异常需要继续查看。`
        : "暂无需要优先查看的异常。",
  }
}

const exceptionSourceOrder: TimelineEventType[] = ["login", "status", "schedule"]

const exceptionSourceRank = {
  login: 0,
  status: 1,
  schedule: 2,
}

const exceptionSourceLabel = {
  schedule: "排班轨道",
  login: "登录轨道",
  status: "状态轨道",
}

const exceptionSourceFocus = {
  schedule: "核对排班覆盖、班次窗口和人员安排。",
  login: "核对登录开始/结束和原始登录记录。",
  status: "核对状态类型、覆盖时段和现场安排说明。",
}

const reviewLoadGroupOrder: Array<{
  code: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["code"]
  label: FulfillmentMatrixExceptionQueueItem["reviewGroup"]["label"]
  emptyReason: string
}> = [
  {
    code: "missing_material",
    label: "需补材料",
    emptyReason: "暂无需补材料事项。",
  },
  {
    code: "supervisor_judgment",
    label: "待主管判断",
    emptyReason: "暂无待主管判断事项。",
  },
  {
    code: "data_check",
    label: "需数据核对",
    emptyReason: "暂无需数据核对事项。",
  },
]

const reviewLoadGroupRank = {
  missing_material: 0,
  supervisor_judgment: 1,
  data_check: 2,
} satisfies Record<FulfillmentMatrixExceptionQueueItem["reviewGroup"]["code"], number>

function buildReviewLoadNextPriorityReason(item: FulfillmentMatrixExceptionQueueItem) {
  if (item.reviewGroup.code === "missing_material") {
    return "先补到岗说明与原始登录记录，避免登录缺口判断悬空。"
  }

  if (item.reviewGroup.code === "data_check") {
    return "先核对原始排班与登录记录，避免数据差异影响履约判断。"
  }

  return "先确认现场安排是否符合当班在线要求，避免状态口径悬空。"
}

function buildExceptionReviewGroup(explanation: TimelineExceptionExplanation) {
  if (explanation.type === "登录缺口") {
    return {
      code: "missing_material" as const,
      label: "需补材料" as const,
      reason: "仍缺员工到岗说明、迟到或漏登原因和原始登录记录。",
    }
  }

  if (explanation.type === "登录不足") {
    return {
      code: "data_check" as const,
      label: "需数据核对" as const,
      reason: "需先核对排班结束、登录结束和原始登出记录。",
    }
  }

  return {
    code: "supervisor_judgment" as const,
    label: "待主管判断" as const,
    reason: "需由现场主管确认培训安排是否符合当班在线要求。",
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

const dataQualitySeverityRank = {
  high: 3,
  medium: 2,
  low: 1,
}

const groupRiskCauseLabel = {
  login_attendance: "登录到岗偏差",
  status_alignment: "状态安排不一致",
  data_check: "数据核对问题",
} satisfies Record<FulfillmentGroupRiskCauseSplit["causes"][number]["key"], string>

const groupRiskCauseFocus = {
  login_attendance: "先核对到岗说明和原始登录开始时间。",
  status_alignment: "先确认培训安排是否应计入在线要求。",
  data_check: "先核对原始记录字段和导入质量问题。",
} satisfies Record<FulfillmentGroupRiskCauseSplit["causes"][number]["key"], string>

const groupRiskCauseRank = {
  status_alignment: 1,
  login_attendance: 2,
  data_check: 3,
} satisfies Record<FulfillmentGroupRiskCauseSplit["causes"][number]["key"], number>

const escalationLevelRank = {
  "需要升级": 3,
  "接近超时": 2,
  "正常跟进": 1,
}

const priorityText = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
}

const fulfillmentMatrixReviewCheckpoint = "14:30"

function earliestTime(values: string[]) {
  return values.filter(Boolean).sort((a, b) => timeToMinutes(a) - timeToMinutes(b))[0] ?? ""
}

function latestTime(values: string[]) {
  return values.filter(Boolean).sort((a, b) => timeToMinutes(b) - timeToMinutes(a))[0] ?? ""
}

function addMinutesToClock(value: string, minutes: number) {
  const totalMinutes = timeToMinutes(value) + minutes
  const hours = Math.floor(totalMinutes / 60)
  const remainder = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
}

function formatWaitingMinutes(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60

  if (hours === 0) {
    return `${minutes}分钟`
  }

  return `${hours}小时${String(minutes).padStart(2, "0")}分钟`
}

function formatGapMinutes(start: string, end: string) {
  return Math.max(timeToMinutes(end) - timeToMinutes(start), 0)
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

function buildTeamWeekRiskDistribution(
  team: Omit<
    FulfillmentTeamWeek,
    | "weekRiskDistribution"
    | "supervisorWeeklyReviewQueue"
    | "supervisorWeeklyHandoffSummary"
    | "teamEvidenceGapDistribution"
    | "closureReadinessTrend"
  >,
  rankIndex: number,
  teamCount: number
): FulfillmentTeamWeekRiskDistribution {
  const points = team.days.map(buildTeamWeekRiskPoint)
  const highestRiskPoint = [...points].sort(
    (a, b) =>
      b.score - a.score ||
      b.anomalyPeople - a.anomalyPeople ||
      b.gapPeople - a.gapPeople ||
      a.date.localeCompare(b.date)
  )[0]
  const highestGroupForDay = [...team.groups].sort((a, b) => {
    const dayA = a.days.find((day) => day.date === highestRiskPoint.date)
    const dayB = b.days.find((day) => day.date === highestRiskPoint.date)
    return (
      (dayB?.gapPeople ?? 0) - (dayA?.gapPeople ?? 0) ||
      (dayB?.anomalyPeople ?? 0) - (dayA?.anomalyPeople ?? 0) ||
      a.supplier.localeCompare(b.supplier)
    )
  })[0]
  const drilldownDay =
    highestGroupForDay?.days.find((day) => day.date === highestRiskPoint.date) ?? highestRiskPoint
  const riskScore = highestRiskPoint.score

  return {
    riskLevel: getTeamDayRiskLevel(riskScore),
    riskScore,
    headline:
      riskScore > 0
        ? `本周风险集中在${highestRiskPoint.label}，建议先下钻${highestGroupForDay?.supplier ?? "当前小组"}。`
        : "本周暂无明显履约风险，可保持常规查看。",
    highestRiskDay: {
      date: highestRiskPoint.date,
      label: highestRiskPoint.label,
      score: highestRiskPoint.score,
      reason: `缺口 ${highestRiskPoint.gapPeople} 人 / 异常 ${highestRiskPoint.anomalyPeople} 人`,
    },
    primaryReason:
      riskScore > 0
        ? `本周累计缺口 ${team.summary.gapPeople} 人，异常 ${team.summary.anomalyPeople} 人，最高风险来自${highestRiskPoint.label}。`
        : "本周缺口和异常均为低位。",
    nextDrilldown: {
      date: highestRiskPoint.date,
      label: highestRiskPoint.label,
      groupName: highestGroupForDay?.supplier ?? "",
      reason:
        highestGroupForDay && riskScore > 0
          ? `先看${highestGroupForDay.supplier}，缺口 ${drilldownDay.gapPeople} 人 / 异常 ${drilldownDay.anomalyPeople} 人。`
          : "可从团队周卡继续查看。",
    },
    rank: {
      label: `第 ${rankIndex} / ${teamCount} 个团队`,
      reason: `按本周缺口和异常排序，${team.workplace} / ${team.project} 当前${
        rankIndex === 1 ? "最高" : `第 ${rankIndex}`
      }。`,
    },
    points,
  }
}

function buildSupervisorWeeklyReviewQueue(
  team: Omit<
    FulfillmentTeamWeek,
    | "weekRiskDistribution"
    | "supervisorWeeklyReviewQueue"
    | "supervisorWeeklyHandoffSummary"
    | "teamEvidenceGapDistribution"
    | "closureReadinessTrend"
  >
): FulfillmentSupervisorWeeklyReviewQueue {
  const items = team.groups
    .flatMap((group) =>
      group.days
        .filter((day) => day.gapPeople > 0 || day.anomalyPeople > 0)
        .map((day) => {
          const score = Math.min(100, day.gapPeople * 30 + day.anomalyPeople * 40)
          const reviewTarget = getSupervisorWeeklyReviewTarget(group.members, day.date)

          return {
            key: `${group.id}::${day.date}`,
            groupId: group.id,
            groupName: group.supplier,
            date: day.date,
            label: `${day.weekday} ${day.label}`,
            priority: getTeamDayRiskLevel(score),
            score,
            gapPeople: day.gapPeople,
            anomalyPeople: day.anomalyPeople,
            reviewTarget,
            reason: `缺口 ${day.gapPeople} 人 / 异常 ${day.anomalyPeople} 人，建议先看 ${reviewTarget}。`,
          }
        })
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.anomalyPeople - a.anomalyPeople ||
        b.gapPeople - a.gapPeople ||
        a.date.localeCompare(b.date) ||
        a.groupName.localeCompare(b.groupName)
    )
  const topItem = items[0]

  return {
    headline: topItem
      ? `本周优先复核${topItem.groupName} 的${topItem.label}，缺口 ${topItem.gapPeople} 人 / 异常 ${topItem.anomalyPeople} 人。`
      : "本周暂无需要优先复核的小组日期。",
    totalItems: items.length,
    highPriorityCount: items.filter((item) => item.priority === "高").length,
    totalGapPeople: items.reduce((total, item) => total + item.gapPeople, 0),
    totalAnomalyPeople: items.reduce((total, item) => total + item.anomalyPeople, 0),
    topItem,
    items,
  }
}

function buildSupervisorWeeklyHandoffSummary(
  team: Omit<
    FulfillmentTeamWeek,
    | "weekRiskDistribution"
    | "supervisorWeeklyReviewQueue"
    | "supervisorWeeklyHandoffSummary"
    | "teamEvidenceGapDistribution"
    | "closureReadinessTrend"
  >
): FulfillmentSupervisorWeeklyHandoffSummary {
  const items = team.groups
    .flatMap((group) =>
      group.days.flatMap((day) => {
        const members = buildFulfillmentMatrixMembersForDate(group.members, day.date)
        const queue = buildFulfillmentMatrixExceptionQueue(members, day.date, group.members)

        return queue.map((item) => ({
          key: `${group.id}::${day.date}::${item.key}`,
          groupId: group.id,
          groupName: group.supplier,
          date: day.date,
          label: `${day.weekday} ${day.label}`,
          employeeId: item.employeeId,
          employeeName: item.employeeName,
          title: item.title,
          recipient: item.handoffSummary.recipient,
          nextTouchpoint: item.handoffSummary.nextTouchpoint,
          reason: `${item.agingEscalation.level} / ${item.handoffSummary.openQuestions.length} 个待核对问题 / ${item.handoffSummary.nextTouchpoint}`,
          openQuestionCount: item.handoffSummary.openQuestions.length,
          escalationCount: item.agingEscalation.level === "需要升级" ? 1 : 0,
        }))
      })
    )
    .sort(
      (a, b) =>
        b.escalationCount - a.escalationCount ||
        b.openQuestionCount - a.openQuestionCount ||
        a.date.localeCompare(b.date) ||
        a.employeeId.localeCompare(b.employeeId)
    )
  const recipients = buildSupervisorWeeklyHandoffRecipients(items)
  const topRecipient = recipients[0]
  const totalItems = items.length
  const openQuestionCount = items.reduce((total, item) => total + item.openQuestionCount, 0)
  const escalationItems = items.reduce((total, item) => total + item.escalationCount, 0)

  return {
    headline:
      totalItems > 0
        ? `本周需要向${topRecipient?.recipient ?? "现场主管"}交接 ${totalItems} 项异常，开放问题 ${openQuestionCount} 个。`
        : "本周暂无需要交接的异常。",
    totalItems,
    openQuestionCount,
    escalationItems,
    topRecipient: {
      recipient: topRecipient?.recipient ?? "现场主管",
      itemCount: topRecipient?.itemCount ?? 0,
      reason: `${topRecipient?.recipient ?? "现场主管"}承接 ${topRecipient?.itemCount ?? 0} 项异常，开放问题 ${
        topRecipient?.openQuestionCount ?? 0
      } 个。`,
    },
    nextItem: items[0] ? stripWeeklyHandoffItemInternalFields(items[0]) : undefined,
    recipients,
    items: items.map(stripWeeklyHandoffItemInternalFields),
  }
}

function buildTeamEvidenceGapDistribution(
  team: Omit<
    FulfillmentTeamWeek,
    | "weekRiskDistribution"
    | "supervisorWeeklyReviewQueue"
    | "supervisorWeeklyHandoffSummary"
    | "teamEvidenceGapDistribution"
    | "closureReadinessTrend"
  >
): FulfillmentTeamEvidenceGapDistribution {
  const gapItems = team.groups.flatMap((group) =>
    group.days.flatMap((day) => {
      const members = buildFulfillmentMatrixMembersForDate(group.members, day.date)
      const queue = buildFulfillmentMatrixExceptionQueue(members, day.date, group.members)

      return queue.flatMap((item) =>
        item.closureChecklist.items
          .filter((checkItem) => checkItem.status !== "已关联")
          .map((checkItem) => ({
            key: checkItem.label,
            label: checkItem.label,
            ownerRole: checkItem.ownerRole,
            employeeId: item.employeeId,
            employeeName: item.employeeName,
            title: item.title,
            exceptionKey: item.key,
            groupId: group.id,
            groupName: group.supplier,
            date: day.date,
            dayLabel: `${day.weekday} ${day.label}`,
          }))
      )
    })
  )
  const gaps = [...groupBy(gapItems, (item) => item.key).entries()]
    .map(([key, items]) => {
      const first = items[0]
      const people = [
        ...new Map(items.map((item) => [item.employeeId, `${item.employeeId} ${item.employeeName}`])).values(),
      ]

      return {
        key,
        label: first?.label ?? key,
        count: items.length,
        affectedPeopleCount: people.length,
        ownerRole: first?.ownerRole ?? "现场主管",
        representativePeople: people,
        nextDrilldown: {
          groupId: first?.groupId ?? "",
          groupName: first?.groupName ?? "",
          date: first?.date ?? "",
          label: first?.dayLabel ?? "",
          exceptionKey: first?.exceptionKey ?? "",
          reason: first
            ? `先看${first.employeeName}的${first.title}，补齐${first.label}。`
            : "当前暂无需要下钻的证据缺口。",
        },
      }
    })
    .sort(
      (a, b) =>
        b.count - a.count ||
        b.affectedPeopleCount - a.affectedPeopleCount ||
        a.label.localeCompare(b.label)
    )
  const topGap = gaps[0]
  const affectedPeopleCount = new Set(gapItems.map((item) => item.employeeId)).size

  return {
    headline: topGap
      ? `本周证据缺口集中在${topGap.label}，共 ${topGap.count} 项，涉及 ${topGap.affectedPeopleCount} 人。`
      : "本周暂无证据缺口。",
    totalGapItems: gapItems.length,
    affectedPeopleCount,
    topGap: topGap
      ? {
          label: topGap.label,
          count: topGap.count,
          affectedPeopleCount: topGap.affectedPeopleCount,
          ownerRole: topGap.ownerRole,
          reason: `${topGap.label}缺 ${topGap.count} 项，先看${topGap.nextDrilldown.groupName} / ${topGap.nextDrilldown.label}。`,
        }
      : undefined,
    gaps,
  }
}

function buildTeamClosureReadinessTrend(
  team: Omit<
    FulfillmentTeamWeek,
    | "weekRiskDistribution"
    | "supervisorWeeklyReviewQueue"
    | "supervisorWeeklyHandoffSummary"
    | "teamEvidenceGapDistribution"
    | "closureReadinessTrend"
  >
): FulfillmentTeamClosureReadinessTrend {
  const daySnapshots = team.days.map((day) => {
    const groupSnapshots = team.groups.map((group) => {
      const members = buildFulfillmentMatrixMembersForDate(group.members, day.date)
      const queue = buildFulfillmentMatrixExceptionQueue(members, day.date, group.members)
      const summary = summarizeExceptionClosureReadiness(queue)

      return {
        group,
        day,
        queue,
        summary,
      }
    })
    const readyCount = groupSnapshots.reduce((total, item) => total + item.summary.readyCount, 0)
    const blockedCount = groupSnapshots.reduce((total, item) => total + item.summary.blockedCount, 0)
    const missingMaterialCount = groupSnapshots.reduce(
      (total, item) => total + item.summary.missingMaterialCount,
      0
    )
    const missingDecisionCount = groupSnapshots.reduce(
      (total, item) => total + item.summary.missingDecisionCount,
      0
    )
    const dataCheckCount = groupSnapshots.reduce((total, item) => total + item.summary.dataCheckCount, 0)
    const readinessScore =
      readyCount + blockedCount === 0 ? 100 : Math.round((readyCount / (readyCount + blockedCount)) * 100)

    return {
      day,
      groupSnapshots,
      readyCount,
      blockedCount,
      missingMaterialCount,
      missingDecisionCount,
      dataCheckCount,
      readinessScore,
    }
  })
  const points: FulfillmentTeamClosureReadinessTrendPoint[] = daySnapshots.map((snapshot, index) => {
    const previous = daySnapshots[index - 1]
    const direction: FulfillmentTeamClosureReadinessTrendPoint["direction"] =
      previous && snapshot.readinessScore > previous.readinessScore
        ? "转好"
        : previous && snapshot.readinessScore < previous.readinessScore
          ? "转差"
          : "持平"

    return {
      date: snapshot.day.date,
      label: `${snapshot.day.weekday} ${snapshot.day.label}`,
      readyCount: snapshot.readyCount,
      blockedCount: snapshot.blockedCount,
      missingMaterialCount: snapshot.missingMaterialCount,
      missingDecisionCount: snapshot.missingDecisionCount,
      dataCheckCount: snapshot.dataCheckCount,
      readinessScore: snapshot.readinessScore,
      direction,
      reason:
        snapshot.blockedCount === 0
          ? "当日暂无待闭环异常。"
          : `待补材料 ${snapshot.missingMaterialCount} 项 / 待主管判断 ${snapshot.missingDecisionCount} 项 / 需数据核对 ${snapshot.dataCheckCount} 项`,
    }
  })
  const blockerItems = daySnapshots.flatMap((snapshot) =>
    snapshot.groupSnapshots.flatMap((groupSnapshot) =>
      groupSnapshot.queue
        .filter((item) => item.closureChecklist.missingCount > 0)
        .map((item) => ({
          key: item.reviewGroup.code,
          label: closureReadinessLabel[item.reviewGroup.code],
          groupId: groupSnapshot.group.id,
          groupName: groupSnapshot.group.supplier,
          dayLabel: `${snapshot.day.weekday} ${snapshot.day.label}`,
        }))
    )
  )
  const blockers: NonNullable<FulfillmentTeamClosureReadinessTrend["topBlocker"]>[] = reviewLoadGroupOrder
    .map((group) => {
      const items = blockerItems.filter((item) => item.key === group.code)
      const first = items[0]
      return {
        key: group.code,
        label: first?.label ?? closureReadinessLabel[group.code],
        count: items.length,
        reason: first
          ? `${first.label}阻塞 ${items.length} 项，先看${first.groupName} / ${first.dayLabel}。`
          : `${closureReadinessLabel[group.code]}阻塞 ${items.length} 项。`,
      }
    })
    .filter((item) => item.count > 0)
    .sort(
      (a, b) =>
        b.count - a.count ||
        reviewLoadGroupRank[a.key] - reviewLoadGroupRank[b.key]
    )
  const nextSnapshot = [...daySnapshots]
    .filter((snapshot) => snapshot.blockedCount > 0)
    .sort((a, b) => b.blockedCount - a.blockedCount || a.day.date.localeCompare(b.day.date))[0]
  const nextGroupSnapshot = nextSnapshot
    ? [...nextSnapshot.groupSnapshots]
        .filter((snapshot) => snapshot.summary.blockedCount > 0)
        .sort(
          (a, b) =>
            b.summary.blockedCount - a.summary.blockedCount ||
            a.group.supplier.localeCompare(b.group.supplier)
        )[0]
    : undefined
  const topBlocker = blockers[0]

  return {
    headline: buildTeamClosureReadinessTrendHeadline(points, topBlocker),
    readyDayCount: points.filter((point) => point.blockedCount === 0).length,
    blockedDayCount: points.filter((point) => point.blockedCount > 0).length,
    improvingDayCount: points.filter((point) => point.direction === "转好").length,
    decliningDayCount: points.filter((point) => point.direction === "转差").length,
    stableDayCount: points.filter((point) => point.direction === "持平").length,
    topBlocker,
    nextReviewDay:
      nextSnapshot && nextGroupSnapshot
        ? {
            date: nextSnapshot.day.date,
            label: `${nextSnapshot.day.weekday} ${nextSnapshot.day.label}`,
            groupId: nextGroupSnapshot.group.id,
            groupName: nextGroupSnapshot.group.supplier,
            blockedCount: nextSnapshot.blockedCount,
            reason: `${nextSnapshot.day.weekday} ${nextSnapshot.day.label} 仍有 ${nextSnapshot.blockedCount} 项未就绪，优先回看${nextGroupSnapshot.group.supplier}。`,
          }
        : undefined,
    points,
  }
}

function buildTeamClosureReadinessTrendHeadline(
  points: FulfillmentTeamClosureReadinessTrendPoint[],
  topBlocker?: FulfillmentTeamClosureReadinessTrend["topBlocker"]
) {
  const firstImprovingDay = points.find((point) => point.direction === "转好")

  if (firstImprovingDay && topBlocker) {
    return `本周闭环准备度${firstImprovingDay.label} 起转好，主要阻塞为${topBlocker.label}。`
  }

  if (topBlocker) {
    return `本周闭环准备度主要阻塞为${topBlocker.label}，需要继续回看证据。`
  }

  return "本周闭环准备度保持稳定，暂无待闭环异常。"
}

function buildSupervisorWeeklyHandoffRecipients(
  items: Array<
    FulfillmentSupervisorWeeklyHandoffSummaryItem & {
      openQuestionCount: number
      escalationCount: number
    }
  >
): FulfillmentSupervisorWeeklyHandoffRecipient[] {
  const recipients = new Map<string, FulfillmentSupervisorWeeklyHandoffRecipient>()

  for (const item of items) {
    const current =
      recipients.get(item.recipient) ??
      {
        recipient: item.recipient,
        itemCount: 0,
        openQuestionCount: 0,
        escalationCount: 0,
        nextTouchpoint: item.nextTouchpoint,
        focus: `本周集中说明${item.nextTouchpoint}，避免跨天重复追问。`,
      }

    current.itemCount += 1
    current.openQuestionCount += item.openQuestionCount
    current.escalationCount += item.escalationCount
    if (!current.nextTouchpoint) {
      current.nextTouchpoint = item.nextTouchpoint
      current.focus = `本周集中说明${item.nextTouchpoint}，避免跨天重复追问。`
    }
    recipients.set(item.recipient, current)
  }

  return [...recipients.values()].sort(
    (a, b) =>
      b.itemCount - a.itemCount ||
      b.escalationCount - a.escalationCount ||
      b.openQuestionCount - a.openQuestionCount ||
      a.recipient.localeCompare(b.recipient)
  )
}

function stripWeeklyHandoffItemInternalFields(
  item: FulfillmentSupervisorWeeklyHandoffSummaryItem & {
    openQuestionCount: number
    escalationCount: number
  }
): FulfillmentSupervisorWeeklyHandoffSummaryItem {
  return {
    key: item.key,
    groupId: item.groupId,
    groupName: item.groupName,
    date: item.date,
    label: item.label,
    employeeId: item.employeeId,
    employeeName: item.employeeName,
    title: item.title,
    recipient: item.recipient,
    nextTouchpoint: item.nextTouchpoint,
    reason: item.reason,
  }
}

function getSupervisorWeeklyReviewTarget(members: PersonTimeline[], date: string) {
  const candidates = members
    .map((member) => {
      const dailyView = getPersonTimelineDailyView(member, date)
      return {
        employeeId: member.employeeId,
        employeeName: member.employeeName,
        gapHours: dailyView.scheduledHours - dailyView.loginHours,
        highestPriority: Math.max(
          0,
          ...dailyView.anomalies.map((anomaly) => priorityRank[anomaly.severity])
        ),
        anomalyCount: dailyView.anomalies.length,
      }
    })
    .filter((member) => member.gapHours > 0 || member.anomalyCount > 0)
    .sort(
      (a, b) =>
        b.highestPriority - a.highestPriority ||
        b.anomalyCount - a.anomalyCount ||
        b.gapHours - a.gapHours ||
        a.employeeId.localeCompare(b.employeeId)
    )
  const target = candidates[0]

  return target ? `${target.employeeId} ${target.employeeName}` : "当前小组"
}

function buildTeamWeekRiskPoint(day: FulfillmentDayMetrics): FulfillmentTeamWeekRiskPoint {
  const score = Math.min(100, day.gapPeople * 30 + day.anomalyPeople * 40)

  return {
    ...day,
    label: `${day.weekday} ${day.label}`,
    score,
    riskLevel: getTeamDayRiskLevel(score),
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
