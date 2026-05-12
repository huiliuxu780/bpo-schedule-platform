import type { Anomaly } from "@/app/dashboard/data"

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
