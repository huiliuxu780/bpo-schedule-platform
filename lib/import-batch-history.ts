export type ImportBatchStatus = "completed" | "completed_with_errors" | "failed" | "pending_review"

export type ImportBatchQualityIssue = {
  id: string
}

export type ImportBatchFailureImpact = {
  relatedIssueIds: string[]
  affectedRows: number
  affectedObjects: string[]
  businessImpact: string
}

export type ImportBatchFailureRow = {
  batchId: string
  entity: string
  failedRowNumber: number
  fieldName: string
  errorCode: string
  errorMessage: string
  rawValue: string
}

export type ImportBatch = {
  id: string
  templateId: string
  templateName: string
  sourceFile: string
  owner: string
  uploadedAt: string
  status: ImportBatchStatus
  totalRows: number
  successRows: number
  failedRows: number
  warningRows: number
  affectedObjects: string[]
  errorCodes: string[]
  qualityIssueIds: string[]
  failureRows: ImportBatchFailureRow[]
  failureImpacts: ImportBatchFailureImpact[]
  note: string
}

export type ImportBatchResult = {
  batch_id: string
  entity: string
  file_name: string
  uploaded_by: string
  uploaded_at: string
  status: ImportBatchStatus
  total_rows: number
  success_rows: number
  failed_rows: number
  warning_rows: number
  error_codes: string[]
  failure_rows: {
    batch_id: string
    entity: string
    failed_row_number: number
    field_name: string
    error_code: string
    error_message: string
    raw_value: string
  }[]
}

export type DemandForecastCsvImportPayload = {
  file_name: string
  uploaded_by: string
  csv_content: string
}

export type PersonnelScheduleCsvImportPayload = DemandForecastCsvImportPayload
export type LoginLogCsvImportPayload = DemandForecastCsvImportPayload

export type ImportBatchFailureImpactSummary = {
  totalAffectedRows: number
  items: ImportBatchFailureImpact[]
}

export type ImportBatchSummary = {
  total: number
  completed: number
  failed: number
  pendingReview: number
  totalRows: number
  failedRows: number
  warningRows: number
  failureRate: number
  deferredActions: string[]
}

export const deferredImportBatchActions = [
  "无生产数据库留存",
  "无批量导入",
  "无外部系统接入",
  "无自动修复",
  "无审批或权限",
]

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

export const fallbackImportBatches: ImportBatch[] = [
  {
    id: "BATCH-20260519-001",
    templateId: "TPL-MASTER-DATA",
    templateName: "主数据模板",
    sourceFile: "master_data_20260519.xlsx",
    owner: "数据管理员",
    uploadedAt: "2026-05-19 09:12",
    status: "completed_with_errors",
    totalRows: 320,
    successRows: 308,
    failedRows: 7,
    warningRows: 5,
    affectedObjects: ["坐席", "职场", "供应商", "绑定关系"],
    errorCodes: ["missing_required_field", "foreign_key_missing"],
    qualityIssueIds: ["DQ-202605-001", "DQ-202605-004"],
    failureRows: [],
    failureImpacts: [
      {
        relatedIssueIds: ["DQ-202605-001"],
        affectedRows: 48,
        affectedObjects: ["坐席"],
        businessImpact: "坐席姓名缺失会阻断人员识别，影响后续登录与排班归属。",
      },
      {
        relatedIssueIds: ["DQ-202605-004"],
        affectedRows: 19,
        affectedObjects: ["人员排班", "0.5h 时段汇总"],
        businessImpact: "绑定关系缺失会导致排班人员无法进入职场、项目、供应商维度的履约对比。",
      },
    ],
    note: "供应商绑定缺失导致部分人员不可用于排班。",
  },
  {
    id: "BATCH-20260519-002",
    templateId: "TPL-PERSONNEL-SCHEDULE",
    templateName: "人员级排班模板",
    sourceFile: "personnel_schedule_20260519.xlsx",
    owner: "排班运营",
    uploadedAt: "2026-05-19 10:05",
    status: "pending_review",
    totalRows: 680,
    successRows: 646,
    failedRows: 12,
    warningRows: 22,
    affectedObjects: ["人员级排班", "0.5h 时段汇总"],
    errorCodes: ["invalid_time_range", "shift_type_missing"],
    qualityIssueIds: ["DQ-202605-002", "DQ-202605-006"],
    failureRows: [],
    failureImpacts: [
      {
        relatedIssueIds: ["DQ-202605-002"],
        affectedRows: 12,
        affectedObjects: ["职场", "0.5h 时段汇总"],
        businessImpact: "职场时区异常会影响排班时间展开和跨职场对齐。",
      },
      {
        relatedIssueIds: ["DQ-202605-006"],
        affectedRows: 16,
        affectedObjects: ["人员级排班"],
        businessImpact: "班次类型不存在会导致人员排班无法解释休息、饭点和计入口径。",
      },
    ],
    note: "部分班次类型未启用，等待排班运营复核。",
  },
  {
    id: "BATCH-20260519-003",
    templateId: "TPL-DEMAND-FORECAST",
    templateName: "需求预测模板",
    sourceFile: "demand_forecast_20260519.xlsx",
    owner: "预测运营",
    uploadedAt: "2026-05-19 10:40",
    status: "completed",
    totalRows: 96,
    successRows: 96,
    failedRows: 0,
    warningRows: 0,
    affectedObjects: ["需求预测", "履约对比"],
    errorCodes: [],
    qualityIssueIds: [],
    failureRows: [],
    failureImpacts: [],
    note: "0.5h 预测时段已完整覆盖。",
  },
  {
    id: "BATCH-20260519-004",
    templateId: "TPL-STATUS-LOG",
    templateName: "状态日志模板",
    sourceFile: "status_log_20260519.xlsx",
    owner: "现场主管",
    uploadedAt: "2026-05-19 11:20",
    status: "failed",
    totalRows: 420,
    successRows: 0,
    failedRows: 420,
    warningRows: 0,
    affectedObjects: ["状态日志", "人员时间轴"],
    errorCodes: ["duplicate_primary_key", "status_overlap"],
    qualityIssueIds: ["DQ-202605-003", "DQ-202605-008"],
    failureRows: [],
    failureImpacts: [
      {
        relatedIssueIds: ["DQ-202605-003"],
        affectedRows: 37,
        affectedObjects: ["供应商", "绑定关系"],
        businessImpact: "供应商主键重复会让员工归属无法稳定关联到同一供应商。",
      },
      {
        relatedIssueIds: ["DQ-202605-008"],
        affectedRows: 21,
        affectedObjects: ["需求预测", "履约对比"],
        businessImpact: "预测时段断档会让排班和预测对比缺少同一 0.5h 基准。",
      },
    ],
    note: "状态时间段重叠，当前只展示失败结果，不做修复提交。",
  },
]

export function mapImportBatchResult(result: ImportBatchResult): ImportBatch {
  const entityView = importEntityView(result.entity)

  return {
    id: result.batch_id,
    templateId: entityView.templateId,
    templateName: entityView.templateName,
    sourceFile: result.file_name,
    owner: result.uploaded_by,
    uploadedAt: formatImportBatchTimestamp(result.uploaded_at),
    status: result.status,
    totalRows: result.total_rows,
    successRows: result.success_rows,
    failedRows: result.failed_rows,
    warningRows: result.warning_rows,
    affectedObjects: entityView.affectedObjects,
    errorCodes: result.error_codes,
    qualityIssueIds: [],
    failureRows: result.failure_rows.map((row) => ({
      batchId: row.batch_id,
      entity: row.entity,
      failedRowNumber: row.failed_row_number,
      fieldName: row.field_name,
      errorCode: row.error_code,
      errorMessage: row.error_message,
      rawValue: row.raw_value,
    })),
    failureImpacts: result.failure_rows.map((row) => ({
      relatedIssueIds: [],
      affectedRows: 1,
      affectedObjects: entityView.affectedObjects,
      businessImpact: `${row.field_name} 字段问题会影响${entityView.businessImpactTarget}。`,
    })),
    note:
      result.failed_rows > 0
        ? "CSV 已解析，失败行需修正后重新导入。"
        : `CSV 已解析，${entityView.successTarget}可进入后续对齐。`,
  }
}

function importEntityView(entity: string) {
  if (entity === "demand_forecast") {
    return {
      templateId: "TPL-DEMAND-FORECAST",
      templateName: "需求预测模板",
      affectedObjects: ["需求预测", "履约对比"],
      businessImpactTarget: "需求预测导入和履约对比",
      successTarget: "需求预测行",
    }
  }

  if (entity === "personnel_schedule") {
    return {
      templateId: "TPL-PERSONNEL-SCHEDULE",
      templateName: "人员级排班模板",
      affectedObjects: ["人员级排班", "0.5h 时段汇总"],
      businessImpactTarget: "人员级排班和 0.5h 时段汇总",
      successTarget: "人员级排班行",
    }
  }

  if (entity === "login_log") {
    return {
      templateId: "TPL-LOGIN-LOG",
      templateName: "登录日志模板",
      affectedObjects: ["登录日志", "人员时间轴", "履约对比"],
      businessImpactTarget: "登录日志、人员时间轴和履约对比",
      successTarget: "登录日志行",
    }
  }

  return {
    templateId: entity,
    templateName: entity,
    affectedObjects: [],
    businessImpactTarget: "导入结果",
    successTarget: "导入行",
  }
}

function formatImportBatchTimestamp(value: string) {
  return value.replace("T", " ").slice(0, 16)
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

async function writeJson<T>(path: string, payload: unknown): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function createDemandForecastImportBatch(
  payload: DemandForecastCsvImportPayload
): Promise<ImportBatch | null> {
  const result = await writeJson<ImportBatchResult>(
    "/api/v1/import-batches/demand-forecast",
    payload
  )

  return result ? mapImportBatchResult(result) : null
}

export async function createPersonnelScheduleImportBatch(
  payload: PersonnelScheduleCsvImportPayload
): Promise<ImportBatch | null> {
  const result = await writeJson<ImportBatchResult>(
    "/api/v1/import-batches/personnel-schedule",
    payload
  )

  return result ? mapImportBatchResult(result) : null
}

export async function createLoginLogImportBatch(
  payload: LoginLogCsvImportPayload
): Promise<ImportBatch | null> {
  const result = await writeJson<ImportBatchResult>(
    "/api/v1/import-batches/login-log",
    payload
  )

  return result ? mapImportBatchResult(result) : null
}

export async function getImportedBatchById(id: string): Promise<ImportBatch | null> {
  const result = await fetchJson<ImportBatchResult>(`/api/v1/import-batches/${id}`)

  return result ? mapImportBatchResult(result) : getImportBatchById(id) ?? null
}

export async function getImportBatches(): Promise<ImportBatch[]> {
  return fallbackImportBatches
}

export function summarizeImportBatches(
  rows: ImportBatch[]
): ImportBatchSummary {
  const summary = rows.reduce<ImportBatchSummary>(
    (result, row) => {
      result.total += 1
      result.totalRows += row.totalRows
      result.failedRows += row.failedRows
      result.warningRows += row.warningRows

      if (row.status === "failed") {
        result.failed += 1
      } else if (row.status === "pending_review") {
        result.pendingReview += 1
      } else {
        result.completed += 1
      }

      return result
    },
    {
      total: 0,
      completed: 0,
      failed: 0,
      pendingReview: 0,
      totalRows: 0,
      failedRows: 0,
      warningRows: 0,
      failureRate: 0,
      deferredActions: deferredImportBatchActions,
    }
  )

  return {
    ...summary,
    failureRate: summary.totalRows > 0 ? summary.failedRows / summary.totalRows : 0,
  }
}

export function getImportBatchById(id: string) {
  return fallbackImportBatches.find((row) => row.id === id)
}

export function getImportBatchQualityIssues<TIssue extends ImportBatchQualityIssue>(
  batchId: string,
  issueRows: TIssue[]
) {
  const batch = getImportBatchById(batchId)

  if (!batch) {
    return []
  }

  const issuesById = new Map(issueRows.map((issue) => [issue.id, issue]))

  return batch.qualityIssueIds
    .map((issueId) => issuesById.get(issueId))
    .filter((issue) => issue !== undefined)
}

export function summarizeImportBatchFailureImpacts(
  batchId: string
): ImportBatchFailureImpactSummary {
  const batch = getImportBatchById(batchId)
  const items = batch?.failureImpacts ?? []

  return {
    totalAffectedRows: items.reduce((total, item) => total + item.affectedRows, 0),
    items,
  }
}

export function importBatchStatusLabel(status: ImportBatchStatus) {
  const labels: Record<ImportBatchStatus, string> = {
    completed: "已完成",
    completed_with_errors: "完成有错误",
    failed: "失败",
    pending_review: "待复核",
  }

  return labels[status]
}
