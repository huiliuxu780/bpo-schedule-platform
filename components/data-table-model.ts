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
  kind: string
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

export type SchedulePlanImportRecordsPreview = {
  importedRows: number
  planCount: number
  sampleRows: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "本机排班预览"
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

export type CornStatusLogRecordsPreview = {
  statusRows: number
  statusTypes: number
  sampleRows: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "本机预览"
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

export type AdherenceMonitoringRecordsPreview = {
  importedRows: number
  statusRows: number
  loginRows: number
  previewRows: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "缺少状态数据" | "缺少登录数据" | "本机预览"
}

export type DataQualityRecordsPreview = {
  importedSources: number
  importedRows: number
  staffRows: number
  statusRows: number
  loginRows: number
  sampleRows: number
  latestBatch: string
  latestSource: string
  statusLabel:
    | "等待导入"
    | "缺少主数据"
    | "缺少状态数据"
    | "缺少登录数据"
    | "本机预览"
}

export type FieldMappingRecordsPreview = {
  importedSources: number
  mappedFields: number
  missingFields: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "缺少字段" | "本机只读"
}

export type OrganizationPeopleRecordsPreview = {
  staffRows: number
  teamCount: number
  siteCount: number
  vendorCount: number
  sampleRows: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "本机只读"
}

export type TodayFulfillmentRecordsPreview = {
  importedRows: number
  staffRows: number
  statusRows: number
  loginRows: number
  readySignals: number
  latestBatch: string
  latestSource: string
  statusLabel:
    | "等待导入"
    | "缺少主数据"
    | "缺少状态数据"
    | "缺少登录数据"
    | "本机履约预览"
}

export type AnomalyAlertRecordsPreview = {
  alertRows: number
  highSeverity: number
  pendingReview: number
  importedRows: number
  statusLabel: "等待导入" | "本机预警预览"
}

export type VendorManagementRecordsPreview = {
  staffRows: number
  vendorCount: number
  sampleRows: number
  largestVendor: string
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "本机供应商预览"
}

export type RuleConfigurationRecordsPreview = {
  importedSources: number
  importedRows: number
  enabledPreviewRules: number
  deferredRules: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "本机规则目录"
}

export type MonthlySettlementRecordsPreview = {
  importedRows: number
  sourceCount: number
  staffRows: number
  fulfillmentRows: number
  scheduleRows: number
  reviewSignals: number
  latestBatch: string
  latestSource: string
  statusLabel:
    | "等待导入"
    | "缺少主数据"
    | "缺少履约数据"
    | "缺少排班数据"
    | "本机复盘预览"
}

export type ReportCenterRecordsPreview = {
  importedRows: number
  sourceCount: number
  reportSections: number
  staffRows: number
  fulfillmentRows: number
  scheduleRows: number
  latestBatch: string
  latestSource: string
  statusLabel:
    | "等待导入"
    | "缺少主数据"
    | "缺少履约数据"
    | "缺少排班数据"
    | "本机报表预览"
}

export type SupplierReviewRecordsPreview = {
  staffRows: number
  vendorCount: number
  largestVendor: string
  fulfillmentRows: number
  scheduleRows: number
  reviewSignals: number
  latestBatch: string
  latestSource: string
  statusLabel:
    | "等待导入"
    | "缺少供应商主数据"
    | "缺少履约数据"
    | "缺少排班数据"
    | "本机供应商复盘"
}

export type SmartSchedulingRecordsPreview = {
  importedRows: number
  sourceCount: number
  staffRows: number
  fulfillmentRows: number
  scheduleRows: number
  planCount: number
  recommendationSignals: number
  latestBatch: string
  latestSource: string
  statusLabel:
    | "等待导入"
    | "缺少主数据"
    | "缺少履约数据"
    | "缺少排班数据"
    | "本机建议预览"
}

export type InterfaceIntegrationRecordsPreview = {
  importedRows: number
  sourceCount: number
  mappedFields: number
  missingFields: number
  statusRows: number
  cornStatusTypes: number
  readinessSignals: number
  latestBatch: string
  latestSource: string
  statusLabel: "等待导入" | "缺少字段" | "缺少状态日志" | "本机接入预览"
}

export type OperationAuditRecordsPreview = {
  importedRows: number
  sourceCount: number
  batchCount: number
  staffRows: number
  workflowRows: number
  auditSignals: number
  latestBatch: string
  latestSource: string
  statusLabel:
    | "等待导入"
    | "缺少主数据"
    | "缺少履约数据"
    | "缺少排班数据"
    | "本机审计预览"
}

export type FieldMappingSpec = {
  kind: "staff_master" | "status_log" | "login_log"
  title: string
  expectedFields: string[]
}

export const fieldMappingSpecs: FieldMappingSpec[] = [
  {
    kind: "staff_master",
    title: "坐席主数据",
    expectedFields: ["staff_id", "name", "team", "site", "vendor", "role", "status"],
  },
  {
    kind: "status_log",
    title: "坐席状态数据",
    expectedFields: ["staff_id", "date", "start_time", "end_time", "status"],
  },
  {
    kind: "login_log",
    title: "登录数据",
    expectedFields: [
      "staff_id",
      "date",
      "planned_login",
      "actual_login",
      "actual_logout",
      "online_minutes",
    ],
  },
]

export const ruleConfigurationPreviewItems = [
  { title: "导入 records 只读展示", status: "enabled" },
  { title: "Dashboard 本机筛选", status: "enabled" },
  { title: "异常预警 seed 预览", status: "enabled" },
  { title: "时段缺口 seed 预览", status: "enabled" },
  { title: "真实接口规则", status: "deferred" },
  { title: "权限边界规则", status: "deferred" },
  { title: "规则编辑发布", status: "deferred" },
  { title: "结算规则", status: "deferred" },
  { title: "收费因子", status: "deferred" },
] as const

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
      if (
        record.kind === "staff_master" ||
        record.kind === "status_log" ||
        record.kind === "login_log"
      ) {
        summary[record.kind] = record.total_rows
      }

      return summary
    },
    { staff_master: 0, status_log: 0, login_log: 0 }
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

export function summarizeSchedulePlanImportRecords(
  records: DashboardImportRecordSummary[]
): SchedulePlanImportRecordsPreview {
  const scheduleRecord = records.find((record) => record.kind === "schedule_plan")

  if (!scheduleRecord) {
    return {
      importedRows: 0,
      planCount: 0,
      sampleRows: 0,
      latestBatch: "暂无排班 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const planCount = new Set(
    scheduleRecord.sample_rows
      .map((row) => row.plan_id?.trim())
      .filter((planId): planId is string => Boolean(planId))
  ).size

  return {
    importedRows: scheduleRecord.total_rows,
    planCount,
    sampleRows: scheduleRecord.sample_rows.length,
    latestBatch: scheduleRecord.latest_batch_id,
    latestSource: scheduleRecord.source_name,
    statusLabel: "本机排班预览",
  }
}

export function summarizeMonthlySettlementRecords(
  records: DashboardImportRecordSummary[]
): MonthlySettlementRecordsPreview {
  if (records.length === 0) {
    return {
      importedRows: 0,
      sourceCount: 0,
      staffRows: 0,
      fulfillmentRows: 0,
      scheduleRows: 0,
      reviewSignals: 0,
      latestBatch: "暂无结算复盘 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const staffRows =
    records.find((record) => record.kind === "staff_master")?.total_rows ?? 0
  const statusRows =
    records.find((record) => record.kind === "status_log")?.total_rows ?? 0
  const loginRows =
    records.find((record) => record.kind === "login_log")?.total_rows ?? 0
  const scheduleRows =
    records.find((record) => record.kind === "schedule_plan")?.total_rows ?? 0
  const fulfillmentRows = statusRows + loginRows
  const reviewSignals = [staffRows, fulfillmentRows, scheduleRows].filter(
    (value) => value > 0
  ).length

  return {
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    sourceCount: records.length,
    staffRows,
    fulfillmentRows,
    scheduleRows,
    reviewSignals,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      staffRows === 0
        ? "缺少主数据"
        : fulfillmentRows === 0
          ? "缺少履约数据"
          : scheduleRows === 0
            ? "缺少排班数据"
            : "本机复盘预览",
  }
}

export function summarizeReportCenterRecords(
  records: DashboardImportRecordSummary[]
): ReportCenterRecordsPreview {
  if (records.length === 0) {
    return {
      importedRows: 0,
      sourceCount: 0,
      reportSections: 0,
      staffRows: 0,
      fulfillmentRows: 0,
      scheduleRows: 0,
      latestBatch: "暂无报表中心 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const staffRows =
    records.find((record) => record.kind === "staff_master")?.total_rows ?? 0
  const statusRows =
    records.find((record) => record.kind === "status_log")?.total_rows ?? 0
  const loginRows =
    records.find((record) => record.kind === "login_log")?.total_rows ?? 0
  const scheduleRows =
    records.find((record) => record.kind === "schedule_plan")?.total_rows ?? 0
  const fulfillmentRows = statusRows + loginRows
  const reportSections = [staffRows, statusRows, loginRows, scheduleRows].filter(
    (value) => value > 0
  ).length

  return {
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    sourceCount: records.length,
    reportSections,
    staffRows,
    fulfillmentRows,
    scheduleRows,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      staffRows === 0
        ? "缺少主数据"
        : fulfillmentRows === 0
          ? "缺少履约数据"
          : scheduleRows === 0
            ? "缺少排班数据"
            : "本机报表预览",
  }
}

export function summarizeSupplierReviewRecords(
  records: DashboardImportRecordSummary[]
): SupplierReviewRecordsPreview {
  const staffRecord = records.find((record) => record.kind === "staff_master")

  if (!staffRecord) {
    return {
      staffRows: 0,
      vendorCount: 0,
      largestVendor: "等待导入",
      fulfillmentRows: 0,
      scheduleRows: 0,
      reviewSignals: 0,
      latestBatch: "暂无供应商复盘 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const vendorCounts = new Map<string, number>()

  for (const row of staffRecord.sample_rows) {
    const vendor = row.vendor?.trim() || "未标注"
    vendorCounts.set(vendor, (vendorCounts.get(vendor) ?? 0) + 1)
  }

  const largestVendor =
    Array.from(vendorCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "未标注"
  const statusRows =
    records.find((record) => record.kind === "status_log")?.total_rows ?? 0
  const loginRows =
    records.find((record) => record.kind === "login_log")?.total_rows ?? 0
  const scheduleRows =
    records.find((record) => record.kind === "schedule_plan")?.total_rows ?? 0
  const fulfillmentRows = statusRows + loginRows
  const reviewSignals = [
    staffRecord.total_rows,
    fulfillmentRows,
    scheduleRows,
  ].filter((value) => value > 0).length

  return {
    staffRows: staffRecord.total_rows,
    vendorCount: vendorCounts.size,
    largestVendor,
    fulfillmentRows,
    scheduleRows,
    reviewSignals,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      vendorCounts.size === 0
        ? "缺少供应商主数据"
        : fulfillmentRows === 0
          ? "缺少履约数据"
          : scheduleRows === 0
            ? "缺少排班数据"
            : "本机供应商复盘",
  }
}

export function summarizeSmartSchedulingRecords(
  records: DashboardImportRecordSummary[]
): SmartSchedulingRecordsPreview {
  if (records.length === 0) {
    return {
      importedRows: 0,
      sourceCount: 0,
      staffRows: 0,
      fulfillmentRows: 0,
      scheduleRows: 0,
      planCount: 0,
      recommendationSignals: 0,
      latestBatch: "暂无智能排班 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const staffRows =
    records.find((record) => record.kind === "staff_master")?.total_rows ?? 0
  const statusRows =
    records.find((record) => record.kind === "status_log")?.total_rows ?? 0
  const loginRows =
    records.find((record) => record.kind === "login_log")?.total_rows ?? 0
  const scheduleRecord = records.find((record) => record.kind === "schedule_plan")
  const scheduleRows = scheduleRecord?.total_rows ?? 0
  const fulfillmentRows = statusRows + loginRows
  const planCount = new Set(
    (scheduleRecord?.sample_rows ?? [])
      .map((row) => row.plan_id?.trim())
      .filter((planId): planId is string => Boolean(planId))
  ).size
  const recommendationSignals = [staffRows, fulfillmentRows, scheduleRows].filter(
    (value) => value > 0
  ).length

  return {
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    sourceCount: records.length,
    staffRows,
    fulfillmentRows,
    scheduleRows,
    planCount,
    recommendationSignals,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      staffRows === 0
        ? "缺少主数据"
        : fulfillmentRows === 0
          ? "缺少履约数据"
          : scheduleRows === 0
            ? "缺少排班数据"
            : "本机建议预览",
  }
}

export function summarizeInterfaceIntegrationRecords(
  records: DashboardImportRecordSummary[]
): InterfaceIntegrationRecordsPreview {
  if (records.length === 0) {
    return {
      importedRows: 0,
      sourceCount: 0,
      mappedFields: 0,
      missingFields: fieldMappingSpecs.reduce(
        (total, spec) => total + spec.expectedFields.length,
        0
      ),
      statusRows: 0,
      cornStatusTypes: 0,
      readinessSignals: 0,
      latestBatch: "暂无接口集成 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const fieldSummary = summarizeFieldMappingRecords(records)
  const statusRecord = records.find((record) => record.kind === "status_log")
  const scheduleRows =
    records.find((record) => record.kind === "schedule_plan")?.total_rows ?? 0
  const statusRows = statusRecord?.total_rows ?? 0
  const cornStatusTypes = new Set(
    (statusRecord?.sample_rows ?? []).map((row) => row.status?.trim() || "未标注")
  ).size
  const readinessSignals = [
    records.length,
    fieldSummary.missingFields === 0 ? 1 : 0,
    statusRows,
    scheduleRows,
  ].filter((value) => value > 0).length

  return {
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    sourceCount: records.length,
    mappedFields: fieldSummary.mappedFields,
    missingFields: fieldSummary.missingFields,
    statusRows,
    cornStatusTypes,
    readinessSignals,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      fieldSummary.missingFields > 0
        ? "缺少字段"
        : statusRows === 0
          ? "缺少状态日志"
          : "本机接入预览",
  }
}

export function summarizeOperationAuditRecords(
  records: DashboardImportRecordSummary[]
): OperationAuditRecordsPreview {
  if (records.length === 0) {
    return {
      importedRows: 0,
      sourceCount: 0,
      batchCount: 0,
      staffRows: 0,
      workflowRows: 0,
      auditSignals: 0,
      latestBatch: "暂无操作审计 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const staffRows =
    records.find((record) => record.kind === "staff_master")?.total_rows ?? 0
  const statusRows =
    records.find((record) => record.kind === "status_log")?.total_rows ?? 0
  const loginRows =
    records.find((record) => record.kind === "login_log")?.total_rows ?? 0
  const scheduleRows =
    records.find((record) => record.kind === "schedule_plan")?.total_rows ?? 0
  const workflowRows = statusRows + loginRows + scheduleRows
  const auditSignals = [staffRows, statusRows, loginRows, scheduleRows].filter(
    (value) => value > 0
  ).length

  return {
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    sourceCount: records.length,
    batchCount: new Set(records.map((record) => record.latest_batch_id)).size,
    staffRows,
    workflowRows,
    auditSignals,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      staffRows === 0
        ? "缺少主数据"
        : statusRows + loginRows === 0
          ? "缺少履约数据"
          : scheduleRows === 0
            ? "缺少排班数据"
            : "本机审计预览",
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

export function summarizeCornStatusLogRecords(
  records: DashboardImportRecordSummary[]
): CornStatusLogRecordsPreview {
  const statusRecord = records.find((record) => record.kind === "status_log")

  if (!statusRecord) {
    return {
      statusRows: 0,
      statusTypes: 0,
      sampleRows: 0,
      latestBatch: "暂无 CORN 状态日志 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const statusTypes = new Set(
    statusRecord.sample_rows.map((row) => row.status?.trim() || "未标注")
  ).size

  return {
    statusRows: statusRecord.total_rows,
    statusTypes,
    sampleRows: statusRecord.sample_rows.length,
    latestBatch: statusRecord.latest_batch_id,
    latestSource: statusRecord.source_name,
    statusLabel: "本机预览",
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

export function summarizeAdherenceMonitoringRecords(
  records: DashboardImportRecordSummary[]
): AdherenceMonitoringRecordsPreview {
  const adherenceRecords = records.filter(
    (record) => record.kind === "status_log" || record.kind === "login_log"
  )

  if (adherenceRecords.length === 0) {
    return {
      importedRows: 0,
      statusRows: 0,
      loginRows: 0,
      previewRows: 0,
      latestBatch: "暂无遵守率 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = adherenceRecords.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const statusRecord = adherenceRecords.find(
    (record) => record.kind === "status_log"
  )
  const loginRecord = adherenceRecords.find(
    (record) => record.kind === "login_log"
  )
  const statusRows = statusRecord?.total_rows ?? 0
  const loginRows = loginRecord?.total_rows ?? 0
  const previewRows =
    statusRows === 0 || loginRows === 0
      ? 0
      : Math.max(statusRecord?.sample_rows.length ?? 0, loginRecord?.sample_rows.length ?? 0)

  return {
    importedRows: statusRows + loginRows,
    statusRows,
    loginRows,
    previewRows,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      statusRows === 0
        ? "缺少状态数据"
        : loginRows === 0
          ? "缺少登录数据"
          : "本机预览",
  }
}

export function summarizeDataQualityRecords(
  records: DashboardImportRecordSummary[]
): DataQualityRecordsPreview {
  if (records.length === 0) {
    return {
      importedSources: 0,
      importedRows: 0,
      staffRows: 0,
      statusRows: 0,
      loginRows: 0,
      sampleRows: 0,
      latestBatch: "暂无数据质量 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const staffRecord = records.find((record) => record.kind === "staff_master")
  const statusRecord = records.find((record) => record.kind === "status_log")
  const loginRecord = records.find((record) => record.kind === "login_log")
  const staffRows = staffRecord?.total_rows ?? 0
  const statusRows = statusRecord?.total_rows ?? 0
  const loginRows = loginRecord?.total_rows ?? 0
  const sampleRows = records.reduce(
    (total, record) => total + record.sample_rows.length,
    0
  )

  return {
    importedSources: records.length,
    importedRows: staffRows + statusRows + loginRows,
    staffRows,
    statusRows,
    loginRows,
    sampleRows,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      staffRows === 0
        ? "缺少主数据"
        : statusRows === 0
          ? "缺少状态数据"
          : loginRows === 0
            ? "缺少登录数据"
            : "本机预览",
  }
}

export function getRecordFieldNames(record: DashboardImportRecordSummary | undefined) {
  const fields = new Set<string>()

  for (const row of record?.sample_rows ?? []) {
    Object.keys(row).forEach((key) => fields.add(key))
  }

  return Array.from(fields).sort()
}

export function summarizeFieldMappingRecords(
  records: DashboardImportRecordSummary[]
): FieldMappingRecordsPreview {
  if (records.length === 0) {
    return {
      importedSources: 0,
      mappedFields: 0,
      missingFields: fieldMappingSpecs.reduce(
        (total, spec) => total + spec.expectedFields.length,
        0
      ),
      latestBatch: "暂无字段映射 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )

  let mappedFields = 0
  let missingFields = 0

  for (const spec of fieldMappingSpecs) {
    const record = records.find((item) => item.kind === spec.kind)
    const fieldNames = new Set(getRecordFieldNames(record))

    for (const field of spec.expectedFields) {
      if (fieldNames.has(field)) {
        mappedFields += 1
      } else {
        missingFields += 1
      }
    }
  }

  return {
    importedSources: records.length,
    mappedFields,
    missingFields,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel: missingFields > 0 ? "缺少字段" : "本机只读",
  }
}

export function summarizeOrganizationPeopleRecords(
  records: DashboardImportRecordSummary[]
): OrganizationPeopleRecordsPreview {
  const staffRecord = records.find((record) => record.kind === "staff_master")

  if (!staffRecord) {
    return {
      staffRows: 0,
      teamCount: 0,
      siteCount: 0,
      vendorCount: 0,
      sampleRows: 0,
      latestBatch: "暂无组织与人员 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const getDistinctCount = (field: string) =>
    new Set(
      staffRecord.sample_rows
        .map((row) => row[field]?.trim())
        .filter((value): value is string => Boolean(value))
    ).size

  return {
    staffRows: staffRecord.total_rows,
    teamCount: getDistinctCount("team"),
    siteCount: getDistinctCount("site"),
    vendorCount: getDistinctCount("vendor"),
    sampleRows: staffRecord.sample_rows.length,
    latestBatch: staffRecord.latest_batch_id,
    latestSource: staffRecord.source_name,
    statusLabel: "本机只读",
  }
}

export function summarizeTodayFulfillmentRecords(
  records: DashboardImportRecordSummary[]
): TodayFulfillmentRecordsPreview {
  if (records.length === 0) {
    return {
      importedRows: 0,
      staffRows: 0,
      statusRows: 0,
      loginRows: 0,
      readySignals: 0,
      latestBatch: "暂无今日履约 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )
  const staffRows =
    records.find((record) => record.kind === "staff_master")?.total_rows ?? 0
  const statusRows =
    records.find((record) => record.kind === "status_log")?.total_rows ?? 0
  const loginRows =
    records.find((record) => record.kind === "login_log")?.total_rows ?? 0
  const readySignals = [staffRows, statusRows, loginRows].filter(
    (value) => value > 0
  ).length

  return {
    importedRows: staffRows + statusRows + loginRows,
    staffRows,
    statusRows,
    loginRows,
    readySignals,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel:
      staffRows === 0
        ? "缺少主数据"
        : statusRows === 0
          ? "缺少状态数据"
          : loginRows === 0
            ? "缺少登录数据"
            : "本机履约预览",
  }
}

export function summarizeAnomalyAlertRecords(
  rows: Anomaly[],
  records: DashboardImportRecordSummary[]
): AnomalyAlertRecordsPreview {
  if (rows.length === 0 && records.length === 0) {
    return {
      alertRows: 0,
      highSeverity: 0,
      pendingReview: 0,
      importedRows: 0,
      statusLabel: "等待导入",
    }
  }

  return {
    alertRows: rows.length,
    highSeverity: rows.filter((row) => row.severity === "高").length,
    pendingReview: rows.filter((row) => row.status === "待复核").length,
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    statusLabel: "本机预警预览",
  }
}

export function summarizeVendorManagementRecords(
  records: DashboardImportRecordSummary[]
): VendorManagementRecordsPreview {
  const staffRecord = records.find((record) => record.kind === "staff_master")

  if (!staffRecord) {
    return {
      staffRows: 0,
      vendorCount: 0,
      sampleRows: 0,
      largestVendor: "等待导入",
      latestBatch: "暂无供应商 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const vendorCounts = new Map<string, number>()

  for (const row of staffRecord.sample_rows) {
    const vendor = row.vendor?.trim() || "未标注"
    vendorCounts.set(vendor, (vendorCounts.get(vendor) ?? 0) + 1)
  }

  const largestVendor =
    Array.from(vendorCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "未标注"

  return {
    staffRows: staffRecord.total_rows,
    vendorCount: vendorCounts.size,
    sampleRows: staffRecord.sample_rows.length,
    largestVendor,
    latestBatch: staffRecord.latest_batch_id,
    latestSource: staffRecord.source_name,
    statusLabel: "本机供应商预览",
  }
}

export function summarizeRuleConfigurationRecords(
  records: DashboardImportRecordSummary[]
): RuleConfigurationRecordsPreview {
  if (records.length === 0) {
    return {
      importedSources: 0,
      importedRows: 0,
      enabledPreviewRules: ruleConfigurationPreviewItems.filter(
        (item) => item.status === "enabled"
      ).length,
      deferredRules: ruleConfigurationPreviewItems.filter(
        (item) => item.status === "deferred"
      ).length,
      latestBatch: "暂无规则配置 records",
      latestSource: "等待导入",
      statusLabel: "等待导入",
    }
  }

  const latest = records.reduce((current, record) =>
    record.updated_at > current.updated_at ? record : current
  )

  return {
    importedSources: records.length,
    importedRows: records.reduce((total, record) => total + record.total_rows, 0),
    enabledPreviewRules: ruleConfigurationPreviewItems.filter(
      (item) => item.status === "enabled"
    ).length,
    deferredRules: ruleConfigurationPreviewItems.filter(
      (item) => item.status === "deferred"
    ).length,
    latestBatch: latest.latest_batch_id,
    latestSource: latest.source_name,
    statusLabel: "本机规则目录",
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
