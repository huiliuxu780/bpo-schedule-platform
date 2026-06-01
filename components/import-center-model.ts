export type ImportFileType =
  | "master_data"
  | "personnel_schedule"
  | "demand_forecast"
  | "login_log"
  | "status_log"

export type ImportProcessingStatus = "completed" | "completed_with_errors" | "failed"

export type ImportApplicationStatus = "not_applied" | "applied"

export type ImportReadinessStatus = "ready" | "blocked"

export type ImportRowStatus = "success" | "failed" | "warning"

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

export type ImportBatchRowResult = {
  row_id: number
  batch_id: string
  row_number: number
  row_status: ImportRowStatus
  source_key: string | null
  error_field: string | null
  error_code: string | null
  error_message: string | null
  raw_data: Record<string, unknown>
}

export type ImportBatchVersion = {
  version_id: string
  batch_id: string
  version_type: ImportFileType
  business_date_from: string
  business_date_to: string
  created_at: string
}

export type ImportBatchPersistenceDetail = {
  batch: Omit<ImportBatchListRow, "version_count" | "application_status" | "application_target" | "import_version_id" | "applied_record_count">
  rows: ImportBatchRowResult[]
  failed_rows: ImportBatchRowResult[]
  versions: ImportBatchVersion[]
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

export type ImportBatchFilterValue = "all"

export type ImportBatchFilters = {
  query?: string | null
  fileType?: ImportFileType | ImportBatchFilterValue | null
  processingStatus?: ImportProcessingStatus | ImportBatchFilterValue | null
  applicationStatus?: ImportApplicationStatus | ImportBatchFilterValue | null
}

export type ImportBatchDetailSummary = {
  totalRows: number
  successRows: number
  failedRows: number
  warningRows: number
  versionCount: number
}

export type ImportBatchHealth = "blocked" | "warning" | "ready_candidate" | "applied"

export type ImportRowCorrectionNoticeTone = "success" | "failed"

export type ImportRowCorrectionNotice = {
  tone: ImportRowCorrectionNoticeTone
  title: string
  detail: string
  nextAction: string
}

export type ImportUploadResultGuidanceTone = "success" | "failed"

export type ImportUploadResultGuidance = {
  tone: ImportUploadResultGuidanceTone
  title: string
  detail: string
  batchHref: string | null
  primaryActionLabel: string
  nextAction: string
}

export type ImportApplyActionGuidanceTone = "ready" | "blocked" | "done" | "unknown"

export type ImportApplyActionGuidance = {
  tone: ImportApplyActionGuidanceTone
  title: string
  detail: string
  nextAction: string
}

export type ImportApplicationVisibilityTone = "blocked" | "ready" | "done" | "unknown"

export type ImportApplicationVisibility = {
  tone: ImportApplicationVisibilityTone
  statusLabel: string
  targetLabel: string
  versionLabel: string
  appliedRecordLabel: string
  title: string
  detail: string
  nextAction: string
}

export type ImportBatchReviewGuideTone = "blocked" | "warning" | "ready" | "done" | "unknown"

export type ImportBatchReviewGuide = {
  tone: ImportBatchReviewGuideTone
  title: string
  detail: string
  primaryActionLabel: string
  primaryAnchor: string
  secondaryAnchor: string
}

export type ImportExceptionGuidanceTone = "blocked" | "warning" | "ready"

export type ImportExceptionGuidanceScope =
  | "batch_api"
  | "readiness_api"
  | "template_api"
  | "empty_batches"
  | "empty_templates"
  | "ready"

export type ImportExceptionGuidance = {
  scope: ImportExceptionGuidanceScope
  tone: ImportExceptionGuidanceTone
  title: string
  detail: string
  nextAction: string
}

export type ImportFieldMappingTemplateSummary = {
  totalTemplates: number
  activeTemplates: number
  inactiveTemplates: number
  coveredFileTypes: number
  totalMappedFields: number
}

export type ImportTemplateFitStatus = "matched" | "missing" | "error"

export type ImportTemplateFitHint = {
  fileType: ImportFileType
  status: ImportTemplateFitStatus
  matchingTemplates: number
  activeMatchingTemplates: number
  recommendedTemplateId: string | null
  recommendedTemplateName: string | null
  mappedFieldCount: number
  detail: string
  nextAction: string
}

export type ImportUploadRequest = {
  batchId: string
  fileName: string
  fileType: ImportFileType
  uploadedBy: string
  businessDateFrom: string
  businessDateTo: string
  fieldMapping: string
  templateId?: string
}

export type ImportFieldMappingTemplate = {
  template_id: string
  template_name: string
  file_type: ImportFileType
  field_mapping: Record<string, string>
  created_by: string
  created_at: string
  is_active: boolean
}

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

const rowStatusLabels: Record<ImportRowStatus, string> = {
  success: "成功",
  failed: "失败",
  warning: "警告",
}

export function buildImportApiUrl(path: string, apiBase = getDefaultApiBase()): string {
  const normalizedBase = apiBase.replace(/\/+$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${normalizedBase}${normalizedPath}`
}

export function buildImportUploadUrl(
  request: ImportUploadRequest,
  apiBase = getDefaultApiBase()
): string {
  const searchParams = new URLSearchParams({
    batch_id: request.batchId,
    file_name: request.fileName,
    file_type: request.fileType,
    uploaded_by: request.uploadedBy,
    business_date_from: request.businessDateFrom,
    business_date_to: request.businessDateTo,
    field_mapping: request.fieldMapping,
  })

  if (request.templateId) {
    searchParams.set("template_id", request.templateId)
  }

  return buildImportApiUrl(
    `/api/v1/import-batches/upload-csv?${searchParams.toString()}`,
    apiBase
  )
}

export function buildImportFieldMappingTemplatesUrl(
  fileType?: ImportFileType,
  apiBase = getDefaultApiBase()
): string {
  if (!fileType) {
    return buildImportApiUrl("/api/v1/import-field-mapping-templates", apiBase)
  }

  const searchParams = new URLSearchParams({ file_type: fileType })

  return buildImportApiUrl(
    `/api/v1/import-field-mapping-templates?${searchParams.toString()}`,
    apiBase
  )
}

export function buildImportBatchDetailUrl(
  batchId: string,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/import-batches/persisted/${encodeURIComponent(batchId)}`,
    apiBase
  )
}

export function buildImportRowCorrectionUrl(
  batchId: string,
  rowNumber: number,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/import-batches/${encodeURIComponent(batchId)}/rows/${rowNumber}/correct`,
    apiBase
  )
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

export function formatImportRowStatus(status: ImportRowStatus): string {
  return rowStatusLabels[status] ?? status
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

export function filterImportBatches(
  rows: ImportBatchListRow[],
  filters: ImportBatchFilters
): ImportBatchListRow[] {
  const query = filters.query?.trim().toLowerCase() ?? ""
  const fileType = filters.fileType && filters.fileType !== "all" ? filters.fileType : null
  const processingStatus =
    filters.processingStatus && filters.processingStatus !== "all"
      ? filters.processingStatus
      : null
  const applicationStatus =
    filters.applicationStatus && filters.applicationStatus !== "all"
      ? filters.applicationStatus
      : null

  return rows.filter((row) => {
    if (fileType && row.file_type !== fileType) {
      return false
    }

    if (processingStatus && row.processing_status !== processingStatus) {
      return false
    }

    if (applicationStatus && row.application_status !== applicationStatus) {
      return false
    }

    if (!query) {
      return true
    }

    const searchableText = [
      row.batch_id,
      row.file_name,
      row.uploaded_by,
      row.application_target,
      row.import_version_id ?? "",
    ]
      .join(" ")
      .toLowerCase()

    return searchableText.includes(query)
  })
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

export function summarizeImportBatchReviewGuide({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}): ImportBatchReviewGuide {
  if (batch.failed_rows > 0 || readiness?.readiness_status === "blocked") {
    return {
      tone: "blocked",
      title: "先处理失败行",
      detail: `当前批次有 ${batch.failed_rows} 行失败、${batch.warning_rows} 行警告，应用前需要先修正失败行并复核警告。`,
      primaryActionLabel: "查看失败行",
      primaryAnchor: "#import-row-correction",
      secondaryAnchor: "#import-batch-detail",
    }
  }

  if (batch.application_status === "applied") {
    return {
      tone: "done",
      title: "批次已应用",
      detail: `当前批次已应用 ${batch.applied_record_count} 条记录，可查看批次明细和版本记录确认结果。`,
      primaryActionLabel: "查看批次明细",
      primaryAnchor: "#import-batch-detail",
      secondaryAnchor: "#import-apply-readiness",
    }
  }

  if (readiness?.readiness_status === "ready") {
    return {
      tone: "ready",
      title: "可进入应用前复核",
      detail: "当前批次没有失败行，准备度为可应用；继续查看应用准备度和版本范围。",
      primaryActionLabel: "查看应用准备度",
      primaryAnchor: "#import-apply-readiness",
      secondaryAnchor: "#import-batch-detail",
    }
  }

  if (batch.warning_rows > 0) {
    return {
      tone: "warning",
      title: "先复核警告行",
      detail: `当前批次没有失败行，但有 ${batch.warning_rows} 行警告；应用前先查看批次明细确认字段口径。`,
      primaryActionLabel: "查看批次明细",
      primaryAnchor: "#import-batch-detail",
      secondaryAnchor: "#import-apply-readiness",
    }
  }

  return {
    tone: "unknown",
    title: "等待准备度结果",
    detail: "当前批次没有失败行；准备度暂不可判断，先查看批次明细和应用准备度区域。",
    primaryActionLabel: "查看批次明细",
    primaryAnchor: "#import-batch-detail",
    secondaryAnchor: "#import-apply-readiness",
  }
}

export function summarizeImportApplicationVisibility({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}): ImportApplicationVisibility {
  const statusLabel = formatImportApplicationStatus(batch.application_status)
  const targetLabel = formatImportApplicationTarget(batch.application_target)
  const versionLabel = batch.import_version_id ?? "未生成"
  const appliedRecordLabel = `${batch.applied_record_count.toLocaleString("zh-CN")} 条`

  if (batch.application_status === "applied") {
    return {
      tone: "done",
      statusLabel,
      targetLabel,
      versionLabel,
      appliedRecordLabel,
      title: "应用结果已生成",
      detail: `当前批次已应用到${targetLabel}，共 ${batch.applied_record_count.toLocaleString("zh-CN")} 条记录；继续查看版本记录或下游对比结果。`,
      nextAction: "查看批次明细中的版本记录，确认业务日期范围和记录数。",
    }
  }

  if (readiness?.readiness_status === "blocked" || batch.failed_rows > 0) {
    return {
      tone: "blocked",
      statusLabel,
      targetLabel,
      versionLabel,
      appliedRecordLabel,
      title: "应用前仍有阻塞",
      detail: "当前批次尚未应用，且准备度存在阻塞；先处理失败行、行级缺字段或版本缺口。",
      nextAction: "先查看失败行修正和应用准备度，不要在阻塞未清前进入写入流程。",
    }
  }

  if (readiness?.readiness_status === "ready") {
    return {
      tone: "ready",
      statusLabel,
      targetLabel,
      versionLabel,
      appliedRecordLabel,
      title: "可进入应用前复核",
      detail: "当前批次准备度为可应用，但本页仍只展示状态，不提供应用写入按钮。",
      nextAction: "复核应用目标、版本和批次明细；真正应用写入需要单独受控任务。",
    }
  }

  return {
    tone: "unknown",
    statusLabel,
    targetLabel,
    versionLabel,
    appliedRecordLabel,
    title: "等待准备度确认",
    detail: "当前批次尚未应用，准备度暂不可判断；先确认本地 API 状态和批次明细。",
    nextAction: "准备度未知时只做查看和修正，不进入应用写入。",
  }
}

export function summarizeImportBatchDetail(
  detail: ImportBatchPersistenceDetail
): ImportBatchDetailSummary {
  const rowSummary = detail.rows.reduce(
    (summary, row) => ({
      totalRows: summary.totalRows + 1,
      successRows: summary.successRows + (row.row_status === "success" ? 1 : 0),
      failedRows: summary.failedRows + (row.row_status === "failed" ? 1 : 0),
      warningRows: summary.warningRows + (row.row_status === "warning" ? 1 : 0),
    }),
    {
      totalRows: 0,
      successRows: 0,
      failedRows: 0,
      warningRows: 0,
    }
  )

  return {
    ...rowSummary,
    versionCount: detail.versions.length,
  }
}

export function getImportRowStandardFieldsPreview(row: ImportBatchRowResult): string {
  const standardFields = row.raw_data.standard_fields
  if (isRecord(standardFields)) {
    return JSON.stringify(standardFields)
  }

  return JSON.stringify(row.raw_data)
}

export function summarizeImportRowCorrectionNotice({
  status,
  reason,
  row,
  remainingFailedRows,
}: {
  status?: string
  reason?: string
  row?: string
  remainingFailedRows: number
}): ImportRowCorrectionNotice | null {
  if (status === "success") {
    return {
      tone: "success",
      title: `第 ${row ?? "-"} 行已修正`,
      detail:
        remainingFailedRows > 0
          ? `当前批次仍有 ${remainingFailedRows} 行待修正。`
          : "当前批次已没有失败行。",
      nextAction:
        remainingFailedRows > 0
          ? "继续处理剩余失败行，完成后再查看批次准备度。"
          : "查看上方批次准备度和批次明细，确认是否仍有阻塞原因。",
    }
  }

  if (status === "failed") {
    return {
      tone: "failed",
      title: "修正失败",
      detail: formatImportRowCorrectionFailureReason(reason),
      nextAction: "检查字段 JSON、行号和本地 API 状态后重新提交。",
    }
  }

  return null
}

export function summarizeImportUploadResultGuidance({
  status,
  batchId,
  reason,
}: {
  status?: string
  batchId?: string | null
  reason?: string | null
}): ImportUploadResultGuidance | null {
  if (status !== "success" && status !== "failed") {
    return null
  }

  const batchHref = batchId
    ? `/data-quality?batch=${encodeURIComponent(batchId)}`
    : null

  if (status === "success") {
    return {
      tone: "success",
      title: "CSV 上传成功",
      detail: batchId
        ? `批次 ${batchId} 已提交并可在接入批次中查看。`
        : "CSV 已提交并可在接入批次中查看。",
      batchHref,
      primaryActionLabel: batchHref ? "查看批次" : "查看接入批次",
      nextAction:
        "查看批次行结果、失败行和应用准备度；确认无阻塞后再进入后续受控应用流程。",
    }
  }

  return {
    tone: "failed",
    title: "CSV 上传失败",
    detail: formatImportUploadFailureReason(reason),
    batchHref,
    primaryActionLabel: batchHref ? "回看批次" : "补齐后重试",
    nextAction: batchHref
      ? "检查批次号、字段映射 JSON、模板选择和 CSV 表头后重新上传；如果批次已存在，先查看原批次结果。"
      : "补齐必填字段、确认选择 CSV 文件后重新上传。",
  }
}

export function summarizeImportApplyActionGuidance(
  readiness: ImportApplyReadinessResponse | null,
  readinessError?: string | null
): ImportApplyActionGuidance {
  if (readinessError || !readiness) {
    return {
      tone: "unknown",
      title: "准备度暂不可判断",
      detail: readinessError ?? "未返回准备度结果。",
      nextAction: "先确认本地 API 状态；不要在准备度未知时执行应用写入。",
    }
  }

  if (readiness.application_status === "applied") {
    return {
      tone: "done",
      title: "批次已应用",
      detail: `已写入 ${readiness.applied_record_count} 条记录，不需要重复应用。`,
      nextAction: "查看下游版本或结果列表，确认是否还需要复核异常。",
    }
  }

  if (readiness.failed_rows > 0) {
    return {
      tone: "blocked",
      title: "先修正失败行",
      detail: `当前批次还有 ${readiness.failed_rows} 行失败，不能进入应用写入。`,
      nextAction: "在失败行修正区逐行补齐标准字段，完成后重新查看准备度。",
    }
  }

  if (readiness.row_blockers.length > 0) {
    const firstBlocker = readiness.row_blockers[0]
    const fieldLabel = firstBlocker.field_name
      ? ` ${firstBlocker.field_name}`
      : ""

    return {
      tone: "blocked",
      title: "先补齐行级必填字段",
      detail: `${readiness.row_blockers.length} 个行级阻塞正在影响应用准备度。`,
      nextAction: `优先处理第 ${firstBlocker.row_number} 行${fieldLabel}；补齐后重新查看准备度。`,
    }
  }

  if (readiness.version_count === 0 || !readiness.import_version_id) {
    return {
      tone: "blocked",
      title: "先生成导入版本",
      detail: "当前批次还没有可追溯导入版本。",
      nextAction: "检查上传解析结果和版本生成记录，确认版本存在后再进入应用前复核。",
    }
  }

  if (readiness.readiness_status === "blocked") {
    const blocker = readiness.blockers.find(
      (item) => item.code !== "IMPORT_BATCH_ALREADY_APPLIED"
    )

    return {
      tone: "blocked",
      title: "先处理批次阻塞",
      detail: blocker?.message ?? "当前批次仍存在阻塞原因。",
      nextAction: "处理阻塞项后重新查看准备度。",
    }
  }

  return {
    tone: "ready",
    title: "可进入应用前复核",
    detail: `${readiness.success_rows} 行成功、${readiness.failed_rows} 行失败，已生成 ${readiness.version_count} 个版本。`,
    nextAction: "复核版本和目标对象后，再由后续受控任务提供应用写入入口。",
  }
}

export function summarizeImportExceptionGuidance({
  batchError,
  readinessError,
  templateError,
  selectedBatchId,
  batchCount,
  templateCount,
}: {
  batchError?: string | null
  readinessError?: string | null
  templateError?: string | null
  selectedBatchId: string | null
  batchCount: number
  templateCount: number
}): ImportExceptionGuidance[] {
  const guidance: ImportExceptionGuidance[] = []

  if (batchError) {
    guidance.push({
      scope: "batch_api",
      tone: "blocked",
      title: "批次读取失败",
      detail: batchError,
      nextAction: "先确认本地 API 和 /api/v1/import-batches；批次不可读时不要继续判断准备度。",
    })
  } else if (batchCount === 0) {
    guidance.push({
      scope: "empty_batches",
      tone: "warning",
      title: "暂无导入批次",
      detail: "当前没有可查看或复核的导入批次。",
      nextAction: "先上传 CSV，生成批次、行结果和导入版本后再继续检查准备度。",
    })
  }

  if (readinessError && selectedBatchId) {
    guidance.push({
      scope: "readiness_api",
      tone: "blocked",
      title: "准备度读取失败",
      detail: `${selectedBatchId}：${readinessError}`,
      nextAction: "先恢复准备度接口；准备度未知时不要执行应用写入或下游复核。",
    })
  }

  if (templateError) {
    guidance.push({
      scope: "template_api",
      tone: "warning",
      title: "模板读取失败",
      detail: templateError,
      nextAction: "上传仍可使用手填字段映射 JSON；稍后再重试模板读取。",
    })
  } else if (templateCount === 0) {
    guidance.push({
      scope: "empty_templates",
      tone: "warning",
      title: "暂无字段映射模板",
      detail: "当前没有启用或停用模板可供选择。",
      nextAction: "本轮先使用手填字段映射 JSON；模板维护留到后续受控任务。",
    })
  }

  if (guidance.length === 0) {
    guidance.push({
      scope: "ready",
      tone: "ready",
      title: "关键异常态已收敛",
      detail: "批次、准备度和字段映射模板均可读取。",
      nextAction: "继续处理失败行、检查应用前行动建议，或上传下一份文件。",
    })
  }

  return guidance
}

export function summarizeImportFieldMappingTemplates(
  templates: ImportFieldMappingTemplate[]
): ImportFieldMappingTemplateSummary {
  const coveredFileTypes = new Set<ImportFileType>()

  return templates.reduce<ImportFieldMappingTemplateSummary>(
    (summary, template) => {
      coveredFileTypes.add(template.file_type)

      return {
        totalTemplates: summary.totalTemplates + 1,
        activeTemplates: summary.activeTemplates + (template.is_active ? 1 : 0),
        inactiveTemplates: summary.inactiveTemplates + (template.is_active ? 0 : 1),
        coveredFileTypes: coveredFileTypes.size,
        totalMappedFields:
          summary.totalMappedFields + Object.keys(template.field_mapping).length,
      }
    },
    {
      totalTemplates: 0,
      activeTemplates: 0,
      inactiveTemplates: 0,
      coveredFileTypes: 0,
      totalMappedFields: 0,
    }
  )
}

export function summarizeImportTemplateFitHint(
  fileType: ImportFileType,
  templates: ImportFieldMappingTemplate[],
  templateError?: string | null
): ImportTemplateFitHint {
  if (templateError) {
    return {
      fileType,
      status: "error",
      matchingTemplates: 0,
      activeMatchingTemplates: 0,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      mappedFieldCount: 0,
      detail: `字段映射模板读取失败：${templateError}`,
      nextAction: "保留手填字段映射 JSON 上传，或稍后重试模板读取。",
    }
  }

  const matchingTemplates = templates.filter((template) => template.file_type === fileType)
  const activeTemplates = matchingTemplates.filter((template) => template.is_active)
  const recommendedTemplate = [...activeTemplates].sort(
    (left, right) =>
      Object.keys(right.field_mapping).length - Object.keys(left.field_mapping).length
  )[0]

  if (!recommendedTemplate) {
    return {
      fileType,
      status: "missing",
      matchingTemplates: matchingTemplates.length,
      activeMatchingTemplates: activeTemplates.length,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      mappedFieldCount: 0,
      detail: `${formatImportFileType(fileType)}没有启用模板。`,
      nextAction: "先使用手填字段映射 JSON 上传；模板维护在单独任务中处理。",
    }
  }

  return {
    fileType,
    status: "matched",
    matchingTemplates: matchingTemplates.length,
    activeMatchingTemplates: activeTemplates.length,
    recommendedTemplateId: recommendedTemplate.template_id,
    recommendedTemplateName: recommendedTemplate.template_name,
    mappedFieldCount: Object.keys(recommendedTemplate.field_mapping).length,
    detail: `已找到 ${activeTemplates.length} 个启用模板，推荐使用“${recommendedTemplate.template_name}”。`,
    nextAction: "选择同类型模板后上传；如 CSV 表头不一致，再改用手填字段映射 JSON。",
  }
}

export function formatFieldMappingTemplateSummary(
  template: ImportFieldMappingTemplate
): string {
  const entries = Object.entries(template.field_mapping)
  const preview = entries.slice(0, 3).map(([sourceField, standardField]) => {
    return `${sourceField} -> ${standardField}`
  })
  const remainingCount = entries.length - preview.length

  if (remainingCount > 0) {
    preview[preview.length - 1] = `${preview[preview.length - 1]} +${remainingCount}`
  }

  return preview.join(", ")
}

function formatImportRowCorrectionFailureReason(reason?: string): string {
  if (!reason) {
    return "未返回具体失败原因。"
  }

  if (reason === "missing_required_fields") {
    return "缺少批次、行号或标准字段内容。"
  }

  if (reason === "invalid_json") {
    return "标准字段不是合法 JSON 对象。"
  }

  if (reason.startsWith("api_")) {
    return `本地 API 返回 ${reason.replace("api_", "")}。`
  }

  return reason
}

function formatImportUploadFailureReason(reason?: string | null): string {
  if (!reason) {
    return "请检查 API 状态、批次号、字段映射或 CSV 文件。"
  }

  if (reason === "missing_required_fields") {
    return "缺少批次号、业务日期或 CSV 文件。"
  }

  const apiStatus = reason.match(/^api_(\d{3})$/)
  if (apiStatus) {
    return `接口返回 ${apiStatus[1]}，可能是批次号重复或请求不满足接口校验。`
  }

  return decodeURIComponent(reason)
}

function formatImportApplicationTarget(target: string): string {
  if (target === "master_data") {
    return "主数据"
  }

  if (target === "personnel_schedule") {
    return "人员排班"
  }

  if (target === "demand_forecast") {
    return "需求预测"
  }

  if (target === "actual_logs") {
    return "实际日志"
  }

  return target
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getDefaultApiBase(): string {
  return process.env.NEXT_PUBLIC_BPO_API_BASE_URL ?? "http://127.0.0.1:8000"
}
