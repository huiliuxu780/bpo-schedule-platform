import type { Anomaly } from "../app/dashboard/data"
import type {
  SchedulePlanSummary,
  ScheduleRiskRow,
} from "./schedule-plans"
import type { UnavailabilityRow } from "./unavailability"

export type DashboardMetricCard = {
  title: string
  value: string
  change?: string
  insight?: string
  note?: string
}

export type DashboardHeatmapRow = {
  day: string
  slots: number[]
}

export type DashboardHeatmapSlot = string

export type DashboardViewModel = {
  metricCards: DashboardMetricCard[]
  heatmapRows: DashboardHeatmapRow[]
  heatmapSlots: DashboardHeatmapSlot[]
  anomalies: Anomaly[]
}

/**
 * Build dashboard metric cards from schedule plans, risks, and unavailability data.
 */
export function buildDashboardMetricCards(
  plans: SchedulePlanSummary[],
  risks: ScheduleRiskRow[],
  unavailability: UnavailabilityRow[]
): DashboardMetricCard[] {
  const totalPlans = plans.length
  const publishedPlans = plans.filter((p) => p.status === "published").length

  // Calculate coverage rate from all plans
  const totalForecast = plans.reduce((sum, p) => sum + p.forecast_agents, 0)
  const totalScheduled = plans.reduce((sum, p) => sum + p.scheduled_agents, 0)
  const coverageRate = totalForecast > 0 ? totalScheduled / totalForecast : 0
  const coveragePercent = Math.round(coverageRate * 100)

  // Count open risks (status = "open")
  const openRisks = risks.filter((r) => r.risk_status === "open").length

  // Count active unavailability (status = "active")
  const activeUnavailability = unavailability.filter((u) => u.status === "active").length

  return [
    {
      title: "排班计划总数",
      value: `${totalPlans}`,
      insight: `${publishedPlans} 个已发布`,
      note: "包含草稿、待复核和已发布",
    },
    {
      title: "平均覆盖率",
      value: `${coveragePercent}%`,
      insight: coveragePercent >= 90 ? "覆盖率良好" : "覆盖率需要关注",
      note: "基于所有计划的预测和已排人数",
    },
    {
      title: "待处理风险",
      value: `${openRisks}`,
      insight: openRisks > 0 ? "需要优先复核" : "暂无待处理风险",
      note: "状态为待处理的风险项",
    },
    {
      title: "生效不可用",
      value: `${activeUnavailability}`,
      insight: activeUnavailability > 0 ? "影响当前排班" : "暂无生效不可用",
      note: "状态为生效中的不可用记录",
    },
  ]
}

/**
 * Build dashboard heatmap data from schedule plan summaries.
 * Groups plans by date and shows gap trends.
 */
export function buildDashboardHeatmap(
  plans: SchedulePlanSummary[]
): {
  rows: DashboardHeatmapRow[]
  slots: DashboardHeatmapSlot[]
} {
  if (plans.length === 0) {
    return { rows: [], slots: [] }
  }

  // Group plans by date
  const plansByDate = new Map<string, SchedulePlanSummary[]>()
  for (const plan of plans) {
    const existing = plansByDate.get(plan.plan_date) ?? []
    existing.push(plan)
    plansByDate.set(plan.plan_date, existing)
  }

  // Sort dates
  const sortedDates = Array.from(plansByDate.keys()).sort()

  // Build rows: each row is a date, slots are time periods
  // We'll use a simple approach: show gap_agents as negative values
  const rows: DashboardHeatmapRow[] = sortedDates.map((date) => {
    const dayPlans = plansByDate.get(date) ?? []

    // Aggregate gap by project/site for this date
    // Since we don't have interval data, we'll create a single "day" slot
    const totalGap = dayPlans.reduce((sum, p) => sum + p.gap_agents, 0)

    return {
      day: formatDateLabel(date),
      slots: [-totalGap], // Negative value indicates gap
    }
  })

  // Single slot representing "全天"
  const slots: DashboardHeatmapSlot[] = ["全天"]

  return { rows, slots }
}

function formatDateLabel(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${month}-${day}`
  } catch {
    return isoDate
  }
}

/**
 * Build dashboard anomalies from high-risk items, active unavailability, and plans with gaps.
 */
export function buildDashboardAnomalies(
  plans: SchedulePlanSummary[],
  risks: ScheduleRiskRow[],
  unavailability: UnavailabilityRow[]
): Anomaly[] {
  const anomalies: Anomaly[] = []
  let counter = 1

  // Add high-risk open schedule risks
  for (const risk of risks) {
    if (risk.risk_status === "open" && risk.risk_level === "high") {
      anomalies.push({
        id: `ANM-${String(counter++).padStart(3, "0")}`,
        type: "排班风险",
        project: risk.project_name,
        team: risk.site_name,
        shiftTime: `${risk.plan_date} ${risk.interval_start}-${risk.interval_end}`,
        headcount: risk.gap_agents,
        impactedHours: `${risk.gap_agents * 0.5}h`,
        severity: "高",
        status: "待复核",
        downstreamEntry: {
          type: "schedule_risk",
          id: risk.risk_id,
        },
      })
    }
  }

  // Add active unavailability
  for (const unavail of unavailability) {
    if (unavail.status === "active") {
      anomalies.push({
        id: `ANM-${String(counter++).padStart(3, "0")}`,
        type: "不可用记录",
        project: unavail.project_name,
        team: unavail.team_name,
        shiftTime: `${unavail.unavailable_date} ${unavail.start_time}-${unavail.end_time}`,
        headcount: unavail.affected_intervals,
        impactedHours: `${unavail.affected_intervals * 0.5}h`,
        severity: "中",
        status: "待复核",
        downstreamEntry: {
          type: "unavailability",
          id: unavail.unavailability_id,
        },
      })
    }
  }

  // Add plans with significant gaps (gap_agents > 2)
  for (const plan of plans) {
    if (plan.gap_agents > 2) {
      anomalies.push({
        id: `ANM-${String(counter++).padStart(3, "0")}`,
        type: "排班缺口",
        project: plan.project_name,
        team: plan.site_name,
        shiftTime: `${plan.plan_date} ${plan.version}`,
        headcount: plan.gap_agents,
        impactedHours: `${plan.gap_agents * 0.5}h`,
        severity: plan.gap_agents >= 5 ? "高" : "中",
        status: plan.status === "published" ? "已确认" : "待复核",
        downstreamEntry: {
          type: "schedule_plan",
          id: plan.id,
        },
      })
    }
  }

  return anomalies
}

/**
 * Build complete dashboard view model from all data sources.
 */
export function buildDashboardViewModel(
  plans: SchedulePlanSummary[],
  risks: ScheduleRiskRow[],
  unavailability: UnavailabilityRow[]
): DashboardViewModel {
  const heatmap = buildDashboardHeatmap(plans)

  return {
    metricCards: buildDashboardMetricCards(plans, risks, unavailability),
    heatmapRows: heatmap.rows,
    heatmapSlots: heatmap.slots,
    anomalies: buildDashboardAnomalies(plans, risks, unavailability),
  }
}
