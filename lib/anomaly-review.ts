export type AnomalyReviewStatus = "pending" | "confirmed" | "normal_marked"

export type AnomalySeverity = "high" | "medium" | "low"

export type AnomalyReviewSource =
  | "forecast_schedule"
  | "schedule_login"
  | "schedule_status"
  | "master_data"
  | "data_quality"

export type AnomalyRootCause =
  | "排班问题"
  | "人员问题"
  | "主数据问题"
  | "导入问题"
  | "预测问题"
  | "状态源问题"

export type AnomalyReviewCase = {
  id: string
  code: string
  title: string
  source: AnomalyReviewSource
  severity: AnomalySeverity
  status: AnomalyReviewStatus
  owner: string
  rootCause: AnomalyRootCause
  businessDate: string
  workplace: string
  project: string
  interval: string
  impactedAgents: number
  impactedHours: number
  reviewResult: string
  recommendation: string
}

export type AnomalyReviewFilters = {
  query?: string
  owner?: string | "all"
  rootCause?: AnomalyRootCause | "all"
  status?: AnomalyReviewStatus | "all"
}

export type AnomalyReviewSummary = {
  total: number
  pending: number
  confirmed: number
  normalMarked: number
  highSeverity: number
  impactedAgents: number
  impactedHours: number
  sourceCounts: Record<AnomalyReviewSource, number>
  deferredActions: string[]
}

export const deferredAnomalyReviewActions = [
  "无复核提交",
  "无审批流",
  "无权限隔离",
  "无导出或批量处理",
  "无真实异常计算",
]

export const fallbackAnomalyReviewCases: AnomalyReviewCase[] = [
  anomalyCase({
    id: "AR-202605-001",
    code: "forecast_shortage",
    title: "预测缺口 4 人",
    source: "forecast_schedule",
    severity: "high",
    status: "pending",
    owner: "排班运营",
    rootCause: "预测问题",
    businessDate: "2026-05-11",
    workplace: "上海职场",
    interval: "12:00-12:30",
    impactedAgents: 4,
    impactedHours: 2,
    reviewResult: "待复核",
    recommendation: "先确认预测版本，再检查相邻时段冗余人员。",
  }),
  anomalyCase({
    id: "AR-202605-002",
    code: "forecast_overstaffed",
    title: "午后超排 3 人",
    source: "forecast_schedule",
    severity: "medium",
    status: "normal_marked",
    owner: "排班运营",
    rootCause: "预测问题",
    businessDate: "2026-05-11",
    workplace: "苏州职场",
    interval: "14:00-14:30",
    impactedAgents: 3,
    impactedHours: 1.5,
    reviewResult: "标记为正常",
    recommendation: "保留为活动波峰冗余，不触发调整动作。",
  }),
  anomalyCase({
    id: "AR-202605-003",
    code: "no_login",
    title: "计划有班但无登录",
    source: "schedule_login",
    severity: "high",
    status: "confirmed",
    owner: "现场主管",
    rootCause: "人员问题",
    businessDate: "2026-05-11",
    workplace: "上海职场",
    interval: "09:00-10:00",
    impactedAgents: 2,
    impactedHours: 2,
    reviewResult: "确认异常",
    recommendation: "现场主管复核员工到岗记录和供应商反馈。",
  }),
  anomalyCase({
    id: "AR-202605-004",
    code: "late_login",
    title: "迟到 20 分钟",
    source: "schedule_login",
    severity: "medium",
    status: "pending",
    owner: "现场主管",
    rootCause: "人员问题",
    businessDate: "2026-05-11",
    workplace: "上海职场",
    interval: "09:00-09:30",
    impactedAgents: 1,
    impactedHours: 0.5,
    reviewResult: "待复核",
    recommendation: "核对计划开始时间与 CORN 登录时间。",
  }),
  anomalyCase({
    id: "AR-202605-005",
    code: "early_logout",
    title: "早退 30 分钟",
    source: "schedule_login",
    severity: "medium",
    status: "pending",
    owner: "现场主管",
    rootCause: "人员问题",
    businessDate: "2026-05-10",
    workplace: "苏州职场",
    interval: "17:30-18:00",
    impactedAgents: 1,
    impactedHours: 0.5,
    reviewResult: "待复核",
    recommendation: "核对登出前状态和排班结束时间。",
  }),
  anomalyCase({
    id: "AR-202605-006",
    code: "non_productive_status",
    title: "排班内非有效产能",
    source: "schedule_status",
    severity: "high",
    status: "confirmed",
    owner: "运营负责人",
    rootCause: "状态源问题",
    businessDate: "2026-05-10",
    workplace: "广州职场",
    interval: "15:00-16:00",
    impactedAgents: 3,
    impactedHours: 3,
    reviewResult: "确认异常",
    recommendation: "复核状态字典和状态日志是否断档。",
  }),
  anomalyCase({
    id: "AR-202605-007",
    code: "missing_master_data",
    title: "人员绑定缺失",
    source: "master_data",
    severity: "low",
    status: "pending",
    owner: "数据管理员",
    rootCause: "主数据问题",
    businessDate: "2026-05-09",
    workplace: "上海职场",
    interval: "10:00-10:30",
    impactedAgents: 1,
    impactedHours: 0.5,
    reviewResult: "待复核",
    recommendation: "先补齐员工、供应商、职场和项目绑定关系。",
  }),
  anomalyCase({
    id: "AR-202605-008",
    code: "invalid_time_range",
    title: "状态时间段重叠",
    source: "data_quality",
    severity: "low",
    status: "normal_marked",
    owner: "数据管理员",
    rootCause: "导入问题",
    businessDate: "2026-05-09",
    workplace: "苏州职场",
    interval: "11:00-11:30",
    impactedAgents: 1,
    impactedHours: 0.5,
    reviewResult: "标记为正常",
    recommendation: "本地样例保留为数据质量展示，不进入真实计算。",
  }),
]

export function filterAnomalyReviewCases(
  rows: AnomalyReviewCase[],
  { query = "", owner = "all", rootCause = "all", status = "all" }: AnomalyReviewFilters
) {
  const normalizedQuery = query.trim().toLowerCase()

  return rows.filter((row) => {
    if (owner !== "all" && row.owner !== owner) {
      return false
    }

    if (rootCause !== "all" && row.rootCause !== rootCause) {
      return false
    }

    if (status !== "all" && row.status !== status) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return [
      row.id,
      row.code,
      row.title,
      row.owner,
      row.rootCause,
      row.workplace,
      row.project,
      row.reviewResult,
      row.recommendation,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

export function summarizeAnomalyReviewCases(
  rows: AnomalyReviewCase[]
): AnomalyReviewSummary {
  return rows.reduce<AnomalyReviewSummary>(
    (summary, row) => {
      summary.total += 1
      summary.impactedAgents += row.impactedAgents
      summary.impactedHours += row.impactedHours
      summary.sourceCounts[row.source] += 1

      if (row.status === "pending") {
        summary.pending += 1
      } else if (row.status === "confirmed") {
        summary.confirmed += 1
      } else if (row.status === "normal_marked") {
        summary.normalMarked += 1
      }

      if (row.severity === "high") {
        summary.highSeverity += 1
      }

      return summary
    },
    {
      total: 0,
      pending: 0,
      confirmed: 0,
      normalMarked: 0,
      highSeverity: 0,
      impactedAgents: 0,
      impactedHours: 0,
      sourceCounts: {
        forecast_schedule: 0,
        schedule_login: 0,
        schedule_status: 0,
        master_data: 0,
        data_quality: 0,
      },
      deferredActions: deferredAnomalyReviewActions,
    }
  )
}

export function anomalyReviewStatusLabel(status: AnomalyReviewStatus) {
  const labels: Record<AnomalyReviewStatus, string> = {
    pending: "待复核",
    confirmed: "已确认异常",
    normal_marked: "已标记正常",
  }

  return labels[status]
}

export function anomalySeverityLabel(severity: AnomalySeverity) {
  const labels: Record<AnomalySeverity, string> = {
    high: "高",
    medium: "中",
    low: "低",
  }

  return labels[severity]
}

function anomalyCase(
  row: Omit<AnomalyReviewCase, "project">
): AnomalyReviewCase {
  return {
    ...row,
    project: "Bosch CC",
  }
}
