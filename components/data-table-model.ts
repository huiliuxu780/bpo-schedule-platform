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

export type DashboardSyncStatusRow = {
  source: string
  batch: string
  status: string
  syncedAt: string
}

export type DashboardImportKpiBatch = {
  source_name: string
  batch_id: string
  status: "imported" | "needs_attention"
  success_rows: number
  failed_rows: number
  imported_at: string
}

export type DashboardImportRecordSummary = {
  kind: "staff_master" | "status_log" | "login_log"
  source_name: string
  total_rows: number
  latest_batch_id: string
  updated_at: string
  sample_rows: Record<string, string>[]
}

export type DashboardImportKpiPreview = {
  importedSources: number
  importedRows: number
  attentionBatches: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "已接入" | "需关注"
}

export type DashboardImportRecordsPreview = {
  importedSources: number
  importedRows: number
  latestBatch: string
  latestSource: string
  staffRows: number
  statusRows: number
  loginRows: number
  statusLabel: "等待导入" | "已处理"
}

export type FulfillmentImportRecordsPreview = {
  importedRows: number
  statusRows: number
  loginRows: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "缺少状态数据" | "缺少登录数据" | "可核验"
}

export type AgentStatusTraceRecordsPreview = {
  statusRows: number
  statusTypes: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "已接入"
}

export type FulfillmentExceptionRecordsPreview = {
  importedRows: number
  statusRows: number
  loginRows: number
  reviewLeadRows: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "缺少状态数据" | "缺少登录数据" | "可复核"
}

export type ExceptionReviewRecordsPreview = {
  importedRows: number
  statusRows: number
  loginRows: number
  reviewQueueRows: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "缺少状态数据" | "缺少登录数据" | "只读待复核"
}

export type DashboardFilterState = {
  date: string
  site: string
  vendor: string
  dataVersion: "imported" | "effective"
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

export function summarizeDashboardImportKpiPreview(
  batches: DashboardImportKpiBatch[]
): DashboardImportKpiPreview {
  if (batches.length === 0) {
    return {
      importedSources: 0,
      importedRows: 0,
      attentionBatches: 0,
      latestBatch: "暂无导入批次",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = batches.reduce((current, batch) =>
    batch.imported_at > current.imported_at ? batch : current
  )
  const importedRows = batches.reduce(
    (total, batch) => total + batch.success_rows,
    0
  )
  const attentionBatches = batches.filter(
    (batch) => batch.status === "needs_attention" || batch.failed_rows > 0
  ).length

  return {
    importedSources: new Set(batches.map((batch) => batch.source_name)).size,
    importedRows,
    attentionBatches,
    latestBatch: latest.batch_id,
    latestSource: latest.source_name,
    statusLabel: attentionBatches > 0 ? "需关注" : "已接入",
  }
}

export function summarizeDashboardImportRecords(
  records: DashboardImportRecordSummary[]
): DashboardImportRecordsPreview {
  if (records.length === 0) {
    return {
      importedSources: 0,
      importedRows: 0,
      latestBatch: "暂无导入 records",
      latestSource: "等待导入",
      staffRows: 0,
      statusRows: 0,
      loginRows: 0,
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const rowsByKind = records.reduce(
    (summary, record) => {
      summary[record.kind] = record.total_rows
      return summary
    },
    { staff_master: 0, status_log: 0, login_log: 0 } as Record<
      DashboardImportRecordSummary["kind"],
      number
    >
  )

  return {
    importedSources: records.length,
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    staffRows: rowsByKind.staff_master,
    statusRows: rowsByKind.status_log,
    loginRows: rowsByKind.login_log,
    statusLabel: "已处理",
  }
}

export function summarizeFulfillmentImportRecords(
  records: DashboardImportRecordSummary[]
): FulfillmentImportRecordsPreview {
  const fulfillmentRecords = records.filter(
    (record) => record.kind === "status_log" || record.kind === "login_log"
  )

  if (fulfillmentRecords.length === 0) {
    return {
      importedRows: 0,
      statusRows: 0,
      loginRows: 0,
      latestBatch: "暂无履约 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = fulfillmentRecords.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const rowsByKind = fulfillmentRecords.reduce(
    (summary, record) => {
      if (record.kind === "status_log") {
        summary.status_log = record.total_rows
      } else if (record.kind === "login_log") {
        summary.login_log = record.total_rows
      }

      return summary
    },
    { status_log: 0, login_log: 0 }
  )
  const statusRows = rowsByKind.status_log
  const loginRows = rowsByKind.login_log

  return {
    importedRows: statusRows + loginRows,
    statusRows,
    loginRows,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      statusRows === 0
        ? "缺少状态数据"
        : loginRows === 0
          ? "缺少登录数据"
          : "可核验",
  }
}

export function summarizeAgentStatusTraceRecords(
  records: DashboardImportRecordSummary[]
): AgentStatusTraceRecordsPreview {
  const statusRecord = records.find((record) => record.kind === "status_log")

  if (!statusRecord) {
    return {
      statusRows: 0,
      statusTypes: 0,
      latestBatch: "暂无状态 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const statusTypes = new Set(
    statusRecord.sample_rows
      .map((row) => row.status?.trim())
      .filter((status): status is string => Boolean(status))
  ).size

  return {
    statusRows: statusRecord.total_rows,
    statusTypes,
    latestBatch: statusRecord.latest_batch_id,
    latestSource: statusRecord.source_name,
    statusLabel: "已接入",
  }
}

export function summarizeFulfillmentExceptionRecords(
  records: DashboardImportRecordSummary[]
): FulfillmentExceptionRecordsPreview {
  const fulfillmentRecords = records.filter(
    (record) => record.kind === "status_log" || record.kind === "login_log"
  )

  if (fulfillmentRecords.length === 0) {
    return {
      importedRows: 0,
      statusRows: 0,
      loginRows: 0,
      reviewLeadRows: 0,
      latestBatch: "暂无异常线索 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = fulfillmentRecords.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const statusRows =
    fulfillmentRecords.find((record) => record.kind === "status_log")
      ?.total_rows ?? 0
  const loginRows =
    fulfillmentRecords.find((record) => record.kind === "login_log")
      ?.total_rows ?? 0
  const reviewLeadRows = Math.min(statusRows, loginRows)

  return {
    importedRows: statusRows + loginRows,
    statusRows,
    loginRows,
    reviewLeadRows,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      statusRows === 0
        ? "缺少状态数据"
        : loginRows === 0
          ? "缺少登录数据"
          : "可复核",
  }
}

export function summarizeExceptionReviewRecords(
  records: DashboardImportRecordSummary[]
): ExceptionReviewRecordsPreview {
  const fulfillmentRecords = records.filter(
    (record) => record.kind === "status_log" || record.kind === "login_log"
  )

  if (fulfillmentRecords.length === 0) {
    return {
      importedRows: 0,
      statusRows: 0,
      loginRows: 0,
      reviewQueueRows: 0,
      latestBatch: "暂无复核队列 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = fulfillmentRecords.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const statusRecord = fulfillmentRecords.find(
    (record) => record.kind === "status_log"
  )
  const loginRecord = fulfillmentRecords.find(
    (record) => record.kind === "login_log"
  )
  const statusRows = statusRecord?.total_rows ?? 0
  const loginRows = loginRecord?.total_rows ?? 0
  const reviewQueueRows =
    statusRows === 0 || loginRows === 0
      ? 0
      : Math.max(statusRecord?.sample_rows.length ?? 0, loginRecord?.sample_rows.length ?? 0)

  return {
    importedRows: statusRows + loginRows,
    statusRows,
    loginRows,
    reviewQueueRows,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      statusRows === 0
        ? "缺少状态数据"
        : loginRows === 0
          ? "缺少登录数据"
          : "只读待复核",
  }
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
