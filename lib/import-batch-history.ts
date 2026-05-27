import type { DataQualityIssue } from "./data-quality"

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

export type ImportBatchVersionRecord = {
  versionId: string
  entity: string
  batchId: string
  sourceFile: string
  rowCount: number
  businessDateRange: string
  createdAt: string
}

export type ImportBatch = {
  id: string
  templateId: string
  templateName: string
  sourceFile: string
  owner: string
  uploadedAt: string
  businessDateRange: string
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
  localVersions: ImportBatchVersionRecord[]
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
  business_date_start?: string | null
  business_date_end?: string | null
  error_codes: string[]
  version_records?: {
    version_id: string
    entity: string
    batch_id: string
    source_file: string
    row_count: number
    business_date_start?: string | null
    business_date_end?: string | null
    created_at: string
  }[]
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
export type StatusLogCsvImportPayload = DemandForecastCsvImportPayload

export type ImportBatchFailureImpactSummary = {
  totalAffectedRows: number
  items: ImportBatchFailureImpact[]
}

export type ImportBatchFailureReason = {
  id: string
  errorCode: string
  fieldName: string
  failedRows: number
  representativeRowNumber: number
  representativeRawValue: string
  errorMessage: string
  affectedObjects: string[]
  correctionHint: string
}

export type ImportBatchFailureReasonSummary = {
  totalReasonCount: number
  totalFailedRows: number
  topReason: ImportBatchFailureReason | null
  items: ImportBatchFailureReason[]
}

export type ImportBatchQualityImpactItem = {
  issueId: string
  title: string
  severity: DataQualityIssue["severity"]
  status: DataQualityIssue["status"]
  owner: string
  blockedRows: number
  matchedFields: string[]
  affectedObjects: string[]
  recommendation: string
  href: string
}

export type ImportBatchQualityImpactSummary = {
  relatedIssueCount: number
  coveredFieldCount: number
  unmatchedReasonCount: number
  affectedObjects: string[]
  topIssue: DataQualityIssue | null
  items: ImportBatchQualityImpactItem[]
}

export type ImportBatchCorrectionReadinessLevel =
  | "not_required"
  | "needs_field_review"
  | "needs_quality_review"

export type ImportBatchCorrectionReadinessSummary = {
  readinessLevel: ImportBatchCorrectionReadinessLevel
  headline: string
  primaryField: string
  primaryRisk: string
  confirmationObjects: string[]
  reviewSteps: string[]
  deferredActions: string[]
}

export type ImportBatchCorrectionMaterialStatus =
  | "not_required"
  | "field_material_ready"
  | "quality_material_ready"

export type ImportBatchCorrectionMaterialField = {
  id: string
  fieldName: string
  errorCode: string
  failedRows: number
  representativeRowNumber: number
  representativeRawValue: string
  correctionHint: string
  affectedObjects: string[]
}

export type ImportBatchCorrectionMaterialRowSample = {
  failedRowNumber: number
  fieldName: string
  errorCode: string
  rawValue: string
  errorMessage: string
}

export type ImportBatchCorrectionMaterialQualityReference = {
  issueId: string
  title: string
  severity: DataQualityIssue["severity"]
  owner: string
  blockedRows: number
  matchedFields: string[]
  href: string
}

export type ImportBatchCorrectionMaterialSummary = {
  materialStatus: ImportBatchCorrectionMaterialStatus
  summary: string
  fieldMaterials: ImportBatchCorrectionMaterialField[]
  failureRowSamples: ImportBatchCorrectionMaterialRowSample[]
  qualityReferences: ImportBatchCorrectionMaterialQualityReference[]
  conversationPoints: string[]
  deferredActions: string[]
}

export type ImportBatchReviewConclusionStatus =
  | "not_required"
  | "field_review"
  | "quality_review"

export type ImportBatchReviewConclusionConfidence = "none" | "medium" | "high"

export type ImportBatchReviewConclusionSummary = {
  conclusionStatus: ImportBatchReviewConclusionStatus
  suggestedConclusion: string
  confidence: ImportBatchReviewConclusionConfidence
  evidenceSummary: string[]
  riskSummary: string[]
  nextReviewPoint: string
  deferredActions: string[]
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

export const deferredImportBatchCorrectionActions = [
  "无修正提交",
  "无审批或批量",
  "无生产数据写入",
]

export const deferredImportBatchCorrectionMaterialActions = [
  "无修正提交",
  "无补证据写入",
  "无审批或批量",
  "无导出",
]

export const deferredImportBatchReviewConclusionActions = [
  "无复核结论写入",
  "无补证据写入",
  "无关闭异常",
  "无审批或批量",
  "无导出",
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
    businessDateRange: "2026-05-19",
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
    localVersions: [],
    note: "供应商绑定缺失导致部分人员不可用于排班。",
  },
  {
    id: "BATCH-20260519-002",
    templateId: "TPL-PERSONNEL-SCHEDULE",
    templateName: "人员级排班模板",
    sourceFile: "personnel_schedule_20260519.xlsx",
    owner: "排班运营",
    uploadedAt: "2026-05-19 10:05",
    businessDateRange: "2026-05-19",
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
    localVersions: [],
    note: "部分班次类型未启用，等待排班运营复核。",
  },
  {
    id: "BATCH-20260519-003",
    templateId: "TPL-DEMAND-FORECAST",
    templateName: "需求预测模板",
    sourceFile: "demand_forecast_20260519.xlsx",
    owner: "预测运营",
    uploadedAt: "2026-05-19 10:40",
    businessDateRange: "2026-05-19",
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
    localVersions: [],
    note: "0.5h 预测时段已完整覆盖。",
  },
  {
    id: "BATCH-20260519-004",
    templateId: "TPL-STATUS-LOG",
    templateName: "状态日志模板",
    sourceFile: "status_log_20260519.xlsx",
    owner: "现场主管",
    uploadedAt: "2026-05-19 11:20",
    businessDateRange: "2026-05-19",
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
    localVersions: [],
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
    businessDateRange: formatBusinessDateRange(
      result.business_date_start,
      result.business_date_end
    ),
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
    localVersions: (result.version_records ?? []).map((version) => ({
      versionId: version.version_id,
      entity: version.entity,
      batchId: version.batch_id,
      sourceFile: version.source_file,
      rowCount: version.row_count,
      businessDateRange: formatBusinessDateRange(
        version.business_date_start,
        version.business_date_end
      ),
      createdAt: formatImportBatchTimestamp(version.created_at),
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

  if (entity === "status_log") {
    return {
      templateId: "TPL-STATUS-LOG",
      templateName: "状态日志模板",
      affectedObjects: ["状态日志", "人员时间轴", "履约对比"],
      businessImpactTarget: "状态日志、人员时间轴和履约对比",
      successTarget: "状态日志行",
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

function formatBusinessDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) {
    return "未标注"
  }

  if (!end || start === end) {
    return start ?? end ?? "未标注"
  }

  return `${start} 至 ${end}`
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

export async function createStatusLogImportBatch(
  payload: StatusLogCsvImportPayload
): Promise<ImportBatch | null> {
  const result = await writeJson<ImportBatchResult>(
    "/api/v1/import-batches/status-log",
    payload
  )

  return result ? mapImportBatchResult(result) : null
}

export async function getImportedBatchById(id: string): Promise<ImportBatch | null> {
  const result = await fetchJson<ImportBatchResult>(`/api/v1/import-batches/${id}`)

  return result ? mapImportBatchResult(result) : getImportBatchById(id) ?? null
}

export async function getImportBatches(): Promise<ImportBatch[]> {
  const result = await fetchJson<{ items: ImportBatchResult[] }>("/api/v1/import-batches")
  const processRows = result?.items.map(mapImportBatchResult) ?? []

  if (processRows.length === 0) {
    return fallbackImportBatches
  }

  const processIds = new Set(processRows.map((row) => row.id))
  const fallbackRows = fallbackImportBatches.filter((row) => !processIds.has(row.id))

  return [...processRows, ...fallbackRows]
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

export function summarizeImportBatchFailureReasons(
  batch: ImportBatch
): ImportBatchFailureReasonSummary {
  const groupedRows = new Map<
    string,
    {
      errorCode: string
      fieldName: string
      rows: ImportBatchFailureRow[]
    }
  >()

  for (const row of batch.failureRows) {
    const id = `${row.fieldName}:${row.errorCode}`
    const group = groupedRows.get(id)

    if (group) {
      group.rows.push(row)
    } else {
      groupedRows.set(id, {
        errorCode: row.errorCode,
        fieldName: row.fieldName,
        rows: [row],
      })
    }
  }

  const items = Array.from(groupedRows.values())
    .map<ImportBatchFailureReason>((group) => {
      const representativeRow = group.rows[0]

      return {
        id: `${group.fieldName}:${group.errorCode}`,
        errorCode: group.errorCode,
        fieldName: group.fieldName,
        failedRows: group.rows.length,
        representativeRowNumber: representativeRow.failedRowNumber,
        representativeRawValue: representativeRow.rawValue,
        errorMessage: representativeRow.errorMessage,
        affectedObjects: batch.affectedObjects,
        correctionHint: buildFailureReasonCorrectionHint(representativeRow),
      }
    })
    .sort((first, second) => {
      if (second.failedRows !== first.failedRows) {
        return second.failedRows - first.failedRows
      }

      return first.fieldName.localeCompare(second.fieldName)
    })

  return {
    totalReasonCount: items.length,
    totalFailedRows: batch.failureRows.length,
    topReason: items[0] ?? null,
    items,
  }
}

function buildFailureReasonCorrectionHint(row: ImportBatchFailureRow) {
  if (!row.rawValue) {
    return `补充 ${row.fieldName} 字段后重新导入 CSV。`
  }

  return `修正 ${row.fieldName} 字段的 ${row.errorCode} 问题后重新导入 CSV。`
}

export function summarizeImportBatchQualityImpact(
  batch: ImportBatch,
  issueRows: DataQualityIssue[]
): ImportBatchQualityImpactSummary {
  const issuesById = new Map(issueRows.map((issue) => [issue.id, issue]))
  const relatedIssues = batch.qualityIssueIds
    .map((issueId) => issuesById.get(issueId))
    .filter((issue) => issue !== undefined)
  const failureReasonSummary = summarizeImportBatchFailureReasons(batch)
  const failureFields = new Set(
    failureReasonSummary.items.map((reason) => reason.fieldName)
  )
  const coveredFields = new Set<string>()

  const items = relatedIssues
    .map<ImportBatchQualityImpactItem>((issue) => {
      const matchedFields = matchIssueFields(issue, failureFields)

      for (const field of matchedFields) {
        coveredFields.add(field)
      }

      return {
        issueId: issue.id,
        title: issue.title,
        severity: issue.severity,
        status: issue.status,
        owner: issue.owner,
        blockedRows: issue.blockedRows,
        matchedFields,
        affectedObjects: affectedObjectsForIssue(issue),
        recommendation: issue.recommendation,
        href: `/data-quality/${issue.id}`,
      }
    })
    .sort((first, second) => {
      const statusDelta = qualityImpactStatusRank(first.status) - qualityImpactStatusRank(second.status)

      if (statusDelta !== 0) {
        return statusDelta
      }

      const severityDelta =
        qualityImpactSeverityRank(first.severity) - qualityImpactSeverityRank(second.severity)

      if (severityDelta !== 0) {
        return severityDelta
      }

      return second.blockedRows - first.blockedRows
    })

  const affectedObjects = Array.from(
    new Set(items.flatMap((item) => item.affectedObjects))
  )

  return {
    relatedIssueCount: items.length,
    coveredFieldCount: coveredFields.size,
    unmatchedReasonCount: Math.max(
      failureReasonSummary.totalReasonCount - coveredFields.size,
      0
    ),
    affectedObjects,
    topIssue: relatedIssues.find((issue) => issue.id === items[0]?.issueId) ?? null,
    items,
  }
}

export function summarizeImportBatchCorrectionReadiness(
  batch: ImportBatch,
  issueRows: DataQualityIssue[]
): ImportBatchCorrectionReadinessSummary {
  const failureReasonSummary = summarizeImportBatchFailureReasons(batch)

  if (failureReasonSummary.totalFailedRows === 0) {
    return {
      readinessLevel: "not_required",
      headline: "当前批次没有失败行，无需准备修正材料。",
      primaryField: "无",
      primaryRisk: "无",
      confirmationObjects: [],
      reviewSteps: [],
      deferredActions: deferredImportBatchCorrectionActions,
    }
  }

  const qualityImpactSummary = summarizeImportBatchQualityImpact(batch, issueRows)
  const topReason = failureReasonSummary.topReason
  const topIssue = qualityImpactSummary.topIssue
  const primaryField = topReason?.fieldName ?? "无"
  const confirmationObjects = Array.from(
    new Set([
      ...qualityImpactSummary.affectedObjects,
      ...(topReason?.affectedObjects ?? []),
      ...batch.affectedObjects,
    ])
  )

  if (!topIssue) {
    return {
      readinessLevel: "needs_field_review",
      headline: `先核对 ${primaryField} 字段失败原因，再查看失败行明细。`,
      primaryField,
      primaryRisk: "当前失败原因尚未关联数据质量问题，需要先按字段核对原值和错误码。",
      confirmationObjects,
      reviewSteps: [
        `先看 ${primaryField} 字段失败原因。`,
        "再看失败行明细中的代表原值、行号和错误码。",
        confirmationObjects.length > 0
          ? `最后确认对象：${confirmationObjects.join("、")}。`
          : "最后确认当前批次影响对象。",
      ],
      deferredActions: deferredImportBatchCorrectionActions,
    }
  }

  return {
    readinessLevel: "needs_quality_review",
    headline: `先看 ${primaryField} 字段，再查看 ${topIssue.id} 质量问题。`,
    primaryField,
    primaryRisk: `${topIssue.id} ${topIssue.title} 为${dataQualitySeverityText(
      topIssue.severity
    )}风险，仍影响 ${topIssue.blockedRows} 行。`,
    confirmationObjects,
    reviewSteps: [
      `先看 ${primaryField} 字段失败原因。`,
      `再看 ${topIssue.id} ${topIssue.title} 的质量影响。`,
      confirmationObjects.length > 0
        ? `最后确认对象：${confirmationObjects.join("、")}。`
        : "最后确认当前批次影响对象。",
    ],
    deferredActions: deferredImportBatchCorrectionActions,
  }
}

export function summarizeImportBatchCorrectionMaterials(
  batch: ImportBatch,
  issueRows: DataQualityIssue[]
): ImportBatchCorrectionMaterialSummary {
  const failureReasonSummary = summarizeImportBatchFailureReasons(batch)

  if (failureReasonSummary.totalFailedRows === 0) {
    return {
      materialStatus: "not_required",
      summary: "当前批次没有失败行，无需准备修正材料。",
      fieldMaterials: [],
      failureRowSamples: [],
      qualityReferences: [],
      conversationPoints: [],
      deferredActions: deferredImportBatchCorrectionMaterialActions,
    }
  }

  const qualityImpactSummary = summarizeImportBatchQualityImpact(batch, issueRows)
  const correctionReadinessSummary = summarizeImportBatchCorrectionReadiness(
    batch,
    issueRows
  )
  const topField = correctionReadinessSummary.primaryField
  const topIssue = qualityImpactSummary.topIssue
  const materialStatus =
    qualityImpactSummary.relatedIssueCount > 0
      ? "quality_material_ready"
      : "field_material_ready"
  const fieldMaterials = failureReasonSummary.items.map((reason) => ({
    id: reason.id,
    fieldName: reason.fieldName,
    errorCode: reason.errorCode,
    failedRows: reason.failedRows,
    representativeRowNumber: reason.representativeRowNumber,
    representativeRawValue: reason.representativeRawValue,
    correctionHint: reason.correctionHint,
    affectedObjects: reason.affectedObjects,
  }))
  const failureRowSamples = batch.failureRows.slice(0, 5).map((row) => ({
    failedRowNumber: row.failedRowNumber,
    fieldName: row.fieldName,
    errorCode: row.errorCode,
    rawValue: row.rawValue,
    errorMessage: row.errorMessage,
  }))
  const qualityReferences = qualityImpactSummary.items.map((item) => ({
    issueId: item.issueId,
    title: item.title,
    severity: item.severity,
    owner: item.owner,
    blockedRows: item.blockedRows,
    matchedFields: item.matchedFields,
    href: item.href,
  }))
  const confirmationPoint =
    correctionReadinessSummary.confirmationObjects.length > 0
      ? `需确认对象：${correctionReadinessSummary.confirmationObjects.join("、")}。`
      : "需确认当前批次影响对象。"

  return {
    materialStatus,
    summary: topIssue
      ? `材料已按 ${topField} 字段和 ${topIssue.id} 质量问题整理。`
      : `材料已按 ${topField} 字段失败原因整理。`,
    fieldMaterials,
    failureRowSamples,
    qualityReferences,
    conversationPoints: [
      topIssue
        ? `先说明 ${topIssue.id} ${topIssue.title} 的影响。`
        : `先说明 ${topField} 字段失败原因。`,
      `带上 ${failureRowSamples.length} 条失败行样本核对原值和错误码。`,
      confirmationPoint,
    ],
    deferredActions: deferredImportBatchCorrectionMaterialActions,
  }
}

export function summarizeImportBatchReviewConclusion(
  batch: ImportBatch,
  issueRows: DataQualityIssue[]
): ImportBatchReviewConclusionSummary {
  const materialSummary = summarizeImportBatchCorrectionMaterials(batch, issueRows)

  if (materialSummary.materialStatus === "not_required") {
    return {
      conclusionStatus: "not_required",
      suggestedConclusion: "当前批次没有失败行，无需准备复核结论。",
      confidence: "none",
      evidenceSummary: [],
      riskSummary: [],
      nextReviewPoint: "无需进入失败行或质量问题复核。",
      deferredActions: deferredImportBatchReviewConclusionActions,
    }
  }

  const readinessSummary = summarizeImportBatchCorrectionReadiness(batch, issueRows)
  const qualityImpactSummary = summarizeImportBatchQualityImpact(batch, issueRows)
  const topIssue = qualityImpactSummary.topIssue
  const primaryField = readinessSummary.primaryField
  const evidenceSummary = [
    ...materialSummary.fieldMaterials.slice(0, 2).map((item) => {
      return `${item.fieldName} 字段 ${item.errorCode} 失败 ${item.failedRows} 行，代表行 ${item.representativeRowNumber}。`
    }),
    materialSummary.failureRowSamples.length > 0
      ? `已准备 ${materialSummary.failureRowSamples.length} 条失败行样本用于核对原值。`
      : "",
    ...materialSummary.qualityReferences.slice(0, 2).map((reference) => {
      return `${reference.issueId} ${reference.title} 阻塞 ${reference.blockedRows} 行。`
    }),
  ].filter((item) => item.length > 0)

  if (!topIssue) {
    return {
      conclusionStatus: "field_review",
      suggestedConclusion: `建议先按 ${primaryField} 字段做复核，本批暂不形成关闭结论。`,
      confidence: "medium",
      evidenceSummary,
      riskSummary: [
        "当前失败原因尚未关联数据质量问题，需要先核对字段原值、错误码和影响对象。",
      ],
      nextReviewPoint: `先看 ${primaryField} 字段材料，再看失败行样本。`,
      deferredActions: deferredImportBatchReviewConclusionActions,
    }
  }

  return {
    conclusionStatus: "quality_review",
    suggestedConclusion: `建议先按 ${primaryField} 字段和 ${topIssue.id} 质量问题复核，本批暂不形成关闭结论。`,
    confidence: "high",
    evidenceSummary,
    riskSummary: [
      `${topIssue.id} ${topIssue.title} 为${dataQualitySeverityText(
        topIssue.severity
      )}风险，仍影响 ${topIssue.blockedRows} 行。`,
      qualityImpactSummary.unmatchedReasonCount > 0
        ? `仍有 ${qualityImpactSummary.unmatchedReasonCount} 类失败原因未关联质量问题。`
        : "失败原因已覆盖到相关质量问题。",
    ],
    nextReviewPoint: `查看 ${topIssue.id} 质量问题，再回到失败行样本确认原值。`,
    deferredActions: deferredImportBatchReviewConclusionActions,
  }
}

function matchIssueFields(issue: DataQualityIssue, failureFields: Set<string>) {
  return Array.from(failureFields).filter((field) => {
    return issue.fieldName === field || issue.sourceField.split(/[./]/).includes(field)
  })
}

function affectedObjectsForIssue(issue: DataQualityIssue) {
  const objects = issue.affectedObjects.map((object) => object.type)
  const entityLabel = dataQualityEntityLabels[issue.entity]

  return entityLabel
    ? [entityLabel, ...objects.filter((object) => object !== entityLabel && object !== "主数据")]
    : objects
}

const dataQualityEntityLabels: Record<string, string> = {
  agent: "坐席",
  agent_binding: "人员排班",
  personnel_schedule: "人员级排班",
  demand_forecast: "需求预测",
  login_log: "登录日志",
  status_log: "状态日志",
}

function qualityImpactStatusRank(status: DataQualityIssue["status"]) {
  return {
    open: 0,
    acknowledged: 1,
    resolved: 2,
    ignored: 3,
  }[status]
}

function qualityImpactSeverityRank(severity: DataQualityIssue["severity"]) {
  return {
    high: 0,
    medium: 1,
    low: 2,
  }[severity]
}

function dataQualitySeverityText(severity: DataQualityIssue["severity"]) {
  return {
    high: "高",
    medium: "中",
    low: "低",
  }[severity]
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
