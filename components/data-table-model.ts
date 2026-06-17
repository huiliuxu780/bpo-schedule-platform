import type { Anomaly } from "@/app/dashboard/data"
import type {
  SchedulePlanStatus,
  SchedulePlanSummary,
  ScheduleRiskLevel,
  ScheduleRiskRow,
} from "@/lib/schedule-plans"
import type {
  UnavailabilityRow,
  UnavailabilityStatus,
} from "@/lib/unavailability"

export type DashboardAnomalyFilters = {
  query?: string
  severity?: Anomaly["severity"] | "all"
  status?: Anomaly["status"] | "all"
}

export type DashboardAnomalyEntryState =
  | {
      kind: "blocked"
      label: string
      detail: string
    }
  | {
      kind: "link"
      label: string
      href: string
    }

export type DashboardSyncStatusRow = {
  source: string
  batch: string
  status: string
  syncedAt: string
}

export type DashboardHeatmapRow = {
  day: string
  slots: number[]
}

export type DashboardHeatmapSummary = {
  totalDeficit: number
  severeSlotCount: number
  normalSlotCount: number
  peak: { day: string; slot: string; value: number } | null
}

export type SchedulePlanTableFilters = {
  query?: string
  status?: SchedulePlanStatus | "all"
  gap?: "all" | "with_gap" | "covered"
}

export type ScheduleRiskTableFilters = {
  query?: string
  level?: ScheduleRiskLevel | "all"
}

export type UnavailabilityTableFilters = {
  query?: string
  status?: UnavailabilityStatus | "all"
}

export function dashboardAnomalyMatchesQuery(row: Anomaly, query: string) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return [
    row.id,
    row.type,
    row.project,
    row.team,
    row.shiftTime,
    row.headcount,
    row.impactedHours,
    row.severity,
    row.status,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized)
}

export function filterDashboardAnomalies(
  rows: Anomaly[],
  { query = "", severity = "all", status = "all" }: DashboardAnomalyFilters
) {
  return rows.filter((row) => {
    if (!dashboardAnomalyMatchesQuery(row, query)) {
      return false
    }

    if (severity !== "all" && row.severity !== severity) {
      return false
    }

    if (status !== "all" && row.status !== status) {
      return false
    }

    return true
  })
}

export function buildDashboardAnomalyEntryState(
  row: Anomaly
): DashboardAnomalyEntryState {
  const entry = row.downstreamEntry

  if (!entry) {
    return {
      kind: "blocked",
      label: "等待下游定位",
      detail:
        "当前异常还没有稳定的复核案例、对比运行或来源批次，不能从经营总览直接跳转。",
    }
  }

  const encodedId = encodeURIComponent(entry.id)

  if (entry.type === "review_case") {
    return {
      kind: "link",
      label: "查看复核案例",
      href: `/data-quality/review-cases/${encodedId}`,
    }
  }

  if (entry.type === "comparison_run") {
    return {
      kind: "link",
      label: "查看对比运行",
      href: `/data-quality/comparison-runs/${encodedId}`,
    }
  }

  if (entry.type === "import_batch_result_trace") {
    return {
      kind: "link",
      label: "查看结果追踪",
      href: `/data-quality/${encodedId}?tab=result-trace`,
    }
  }

  if (entry.type === "actual_log_production") {
    return {
      kind: "link",
      label: "查看日志版本",
      href: `/actual-logs/production/${encodedId}`,
    }
  }

  return {
    kind: "link",
    label: "查看排班版本",
    href: `/schedule-plans/production/${encodedId}`,
  }
}

export function clampDashboardPageIndex({
  pageIndex,
  pageSize,
  rowCount,
}: {
  pageIndex: number
  pageSize: number
  rowCount: number
}) {
  const safePageSize = Math.max(1, pageSize)
  const pageCount = Math.max(1, Math.ceil(rowCount / safePageSize))

  return Math.min(Math.max(0, pageIndex), pageCount - 1)
}

export function getDashboardPaginationRange({
  pageIndex,
  pageSize,
  rowCount,
}: {
  pageIndex: number
  pageSize: number
  rowCount: number
}) {
  if (rowCount <= 0) {
    return { from: 0, to: 0 }
  }

  const safePageSize = Math.max(1, pageSize)
  const from = pageIndex * safePageSize + 1
  const to = Math.min(rowCount, (pageIndex + 1) * safePageSize)

  return { from, to }
}

export function filterSyncStatusRows(
  rows: DashboardSyncStatusRow[],
  status: string
) {
  if (!status || status === "all") {
    return rows
  }

  return rows.filter((row) => row.status === status)
}

export function summarizeSyncStatusRows(rows: DashboardSyncStatusRow[]) {
  return rows.reduce(
    (summary, row) => {
      summary.total += 1

      if (row.status === "已同步") {
        summary.synced += 1
      } else if (row.status === "处理中") {
        summary.processing += 1
      } else if (row.status === "需关注") {
        summary.attention += 1
      }

      return summary
    },
    { total: 0, synced: 0, processing: 0, attention: 0 }
  )
}

export function summarizeHeatmapRows(
  rows: DashboardHeatmapRow[],
  slots: string[]
): DashboardHeatmapSummary {
  let totalDeficit = 0
  let severeSlotCount = 0
  let normalSlotCount = 0
  let peak: { day: string; slot: string; value: number } | null = null

  for (const row of rows) {
    row.slots.forEach((value, index) => {
      if (value < 0) {
        totalDeficit += Math.abs(value)
      } else {
        normalSlotCount += 1
      }

      if (value <= -6) {
        severeSlotCount += 1
      }

      if (!peak || value < peak.value) {
        peak = {
          day: row.day,
          slot: slots[index] ?? "",
          value,
        }
      }
    })
  }

  return {
    totalDeficit,
    severeSlotCount,
    normalSlotCount,
    peak,
  }
}

export function schedulePlanMatchesQuery(
  row: SchedulePlanSummary,
  query: string
) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return [
    row.id,
    row.plan_date,
    row.project_name,
    row.site_name,
    row.version,
    row.status,
    row.forecast_agents,
    row.scheduled_agents,
    row.gap_agents,
    row.coverage_rate,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized)
}

export function filterSchedulePlanRows(
  rows: SchedulePlanSummary[],
  { query = "", status = "all", gap = "all" }: SchedulePlanTableFilters
) {
  return rows.filter((row) => {
    if (!schedulePlanMatchesQuery(row, query)) {
      return false
    }

    if (status !== "all" && row.status !== status) {
      return false
    }

    if (gap === "with_gap" && row.gap_agents <= 0) {
      return false
    }

    if (gap === "covered" && row.gap_agents > 0) {
      return false
    }

    return true
  })
}

export function summarizeSchedulePlanRows(rows: SchedulePlanSummary[]) {
  const summary = rows.reduce(
    (current, row) => {
      current.total += 1
      current.totalForecast += row.forecast_agents
      current.totalScheduled += row.scheduled_agents
      current.totalGap += row.gap_agents

      if (row.status === "draft") {
        current.draft += 1
      } else if (row.status === "review_ready") {
        current.reviewReady += 1
      } else {
        current.published += 1
      }

      return current
    },
    {
      total: 0,
      draft: 0,
      reviewReady: 0,
      published: 0,
      totalForecast: 0,
      totalScheduled: 0,
      totalGap: 0,
      coverageRate: 0,
    }
  )

  return {
    ...summary,
    coverageRate:
      summary.totalForecast === 0
        ? summary.total === 0
          ? 0
          : 1
        : summary.totalScheduled / summary.totalForecast,
  }
}

export function scheduleRiskMatchesQuery(row: ScheduleRiskRow, query: string) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return [
    row.risk_id,
    row.plan_id,
    row.plan_date,
    row.project_name,
    row.site_name,
    row.interval_start,
    row.interval_end,
    row.risk_level,
    row.gap_agents,
    row.affected_unavailability,
    row.reason,
    row.recommendation,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized)
}

export function filterScheduleRiskRows(
  rows: ScheduleRiskRow[],
  { query = "", level = "all" }: ScheduleRiskTableFilters
) {
  return rows.filter((row) => {
    if (!scheduleRiskMatchesQuery(row, query)) {
      return false
    }

    if (level !== "all" && row.risk_level !== level) {
      return false
    }

    return true
  })
}

export function summarizeScheduleRiskRows(rows: ScheduleRiskRow[]) {
  return rows.reduce(
    (summary, row) => {
      summary.total += 1
      summary.totalGap += row.gap_agents
      summary.affectedUnavailability += row.affected_unavailability

      if (row.risk_level === "high") {
        summary.high += 1
      } else if (row.risk_level === "medium") {
        summary.medium += 1
      } else {
        summary.low += 1
      }

      return summary
    },
    {
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
      totalGap: 0,
      affectedUnavailability: 0,
    }
  )
}

export function unavailabilityMatchesQuery(
  row: UnavailabilityRow,
  query: string
) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return [
    row.unavailability_id,
    row.staff_name,
    row.team_name,
    row.project_name,
    row.site_name,
    row.unavailable_date,
    row.start_time,
    row.end_time,
    row.reason,
    row.status,
    row.affected_intervals,
    row.note,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized)
}

export function filterUnavailabilityRows(
  rows: UnavailabilityRow[],
  { query = "", status = "all" }: UnavailabilityTableFilters
) {
  return rows.filter((row) => {
    if (!unavailabilityMatchesQuery(row, query)) {
      return false
    }

    if (status !== "all" && row.status !== status) {
      return false
    }

    return true
  })
}

export function summarizeUnavailabilityRows(rows: UnavailabilityRow[]) {
  const summary = rows.reduce(
    (summary, row) => {
      summary.total += 1
      summary.affectedIntervals += row.affected_intervals
      summary.teamNames.add(row.team_name)
      summary.siteNames.add(row.site_name)

      if (row.status === "active") {
        summary.active += 1
      } else {
        summary.resolved += 1
      }

      return summary
    },
    {
      total: 0,
      active: 0,
      resolved: 0,
      affectedIntervals: 0,
      teamNames: new Set<string>(),
      siteNames: new Set<string>(),
    }
  )

  return {
    total: summary.total,
    active: summary.active,
    resolved: summary.resolved,
    affectedIntervals: summary.affectedIntervals,
    teamCount: summary.teamNames.size,
    siteCount: summary.siteNames.size,
  }
}
