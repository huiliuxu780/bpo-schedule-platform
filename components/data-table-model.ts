import type { Anomaly } from "@/app/dashboard/data"

export type DashboardAnomalyFilters = {
  query?: string
  severity?: Anomaly["severity"] | "all"
  status?: Anomaly["status"] | "all"
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
