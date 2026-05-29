export type ImportFileType =
  | "master_data"
  | "personnel_schedule"
  | "demand_forecast"
  | "login_log"
  | "status_log"

export type ImportProcessingStatus = "completed" | "completed_with_errors" | "failed"

export type ImportApplicationStatus = "not_applied" | "applied"

export type ImportReadinessStatus = "ready" | "blocked"

export type ImportBatchListRow = {
  batch_id: string
  file_name: string
  file_type: ImportFileType
  uploaded_by: string
  uploaded_at: string
  business_date_from: string
  business_date_to: string
  processing_status: ImportProcessingStatus
  total_rows: number
  success_rows: number
  failed_rows: number
  warning_rows: number
  version_count: number
  application_status: ImportApplicationStatus
  application_target: string
  import_version_id: string | null
  applied_record_count: number
}

export type ImportReadinessBlocker = {
  code: string
  message: string
}

export type ImportReadinessRowBlocker = {
  row_number: number
  code: string
  field_name: string | null
  message: string
}

export type ImportApplyReadinessResponse = {
  batch_id: string
  file_type: ImportFileType
  readiness_status: ImportReadinessStatus
  blockers: ImportReadinessBlocker[]
  row_blockers: ImportReadinessRowBlocker[]
  total_rows: number
  success_rows: number
  failed_rows: number
  warning_rows: number
  version_count: number
  application_status: ImportApplicationStatus
  application_target: string
  import_version_id: string | null
  applied_record_count: number
}

export type ImportBatchSummary = {
  totalBatches: number
  totalRows: number
  failedRows: number
  warningRows: number
  appliedBatches: number
  notAppliedBatches: number
}

export type ImportBatchHealth = "blocked" | "warning" | "ready_candidate" | "applied"

const fileTypeLabels: Record<ImportFileType, string> = {
  master_data: "主数据",
  personnel_schedule: "人员排班",
  demand_forecast: "需求预测",
  login_log: "登录日志",
  status_log: "状态日志",
}

const processingStatusLabels: Record<ImportProcessingStatus, string> = {
  completed: "已完成",
  completed_with_errors: "有失败行",
  failed: "失败",
}

const applicationStatusLabels: Record<ImportApplicationStatus, string> = {
  not_applied: "未应用",
  applied: "已应用",
}

const readinessStatusLabels: Record<ImportReadinessStatus, string> = {
  ready: "可应用",
  blocked: "未就绪",
}

export function buildImportApiUrl(path: string, apiBase = getDefaultApiBase()): string {
  const normalizedBase = apiBase.replace(/\/+$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${normalizedBase}${normalizedPath}`
}

export function formatImportFileType(fileType: ImportFileType): string {
  return fileTypeLabels[fileType] ?? fileType
}

export function formatImportProcessingStatus(status: ImportProcessingStatus): string {
  return processingStatusLabels[status] ?? status
}

export function formatImportApplicationStatus(status: ImportApplicationStatus): string {
  return applicationStatusLabels[status] ?? status
}

export function formatImportReadinessStatus(status: ImportReadinessStatus): string {
  return readinessStatusLabels[status] ?? status
}

export function summarizeImportBatches(rows: ImportBatchListRow[]): ImportBatchSummary {
  return rows.reduce<ImportBatchSummary>(
    (summary, row) => ({
      totalBatches: summary.totalBatches + 1,
      totalRows: summary.totalRows + row.total_rows,
      failedRows: summary.failedRows + row.failed_rows,
      warningRows: summary.warningRows + row.warning_rows,
      appliedBatches:
        summary.appliedBatches + (row.application_status === "applied" ? 1 : 0),
      notAppliedBatches:
        summary.notAppliedBatches +
        (row.application_status === "not_applied" ? 1 : 0),
    }),
    {
      totalBatches: 0,
      totalRows: 0,
      failedRows: 0,
      warningRows: 0,
      appliedBatches: 0,
      notAppliedBatches: 0,
    }
  )
}

export function getImportBatchHealth(
  row: ImportBatchListRow,
  readiness?: ImportApplyReadinessResponse | null
): ImportBatchHealth {
  if (readiness?.readiness_status === "blocked" || row.failed_rows > 0) {
    return "blocked"
  }

  if (row.application_status === "applied") {
    return "applied"
  }

  if (row.warning_rows > 0) {
    return "warning"
  }

  return "ready_candidate"
}

function getDefaultApiBase(): string {
  return process.env.NEXT_PUBLIC_BPO_API_BASE_URL ?? "http://127.0.0.1:8000"
}
