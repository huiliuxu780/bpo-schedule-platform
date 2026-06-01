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

export type ImportBatchDetailReadabilityTone = "blocked" | "warning" | "ready" | "empty"

export type ImportBatchDetailReadability = {
  tone: ImportBatchDetailReadabilityTone
  title: string
  detail: string
  nextAction: string
  focusLabel: string
  errorFieldSummary: string
}

export type ImportQualityExceptionTraceTone = "blocked" | "warning" | "ready" | "empty"

export type ImportQualityExceptionTrace = {
  tone: ImportQualityExceptionTraceTone
  title: string
  impactScope: string
  issueSummary: string
  nextAction: string
  evidenceLabel: string
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

export type ImportDownstreamResultNavigationTone =
  | "blocked"
  | "ready"
  | "done"
  | "unknown"

export type ImportDownstreamResultNavigation = {
  tone: ImportDownstreamResultNavigationTone
  title: string
  detail: string
  comparisonLabel: string
  reviewLabel: string
  primaryActionLabel: string
  primaryHref: string
  secondaryActionLabel: string
  secondaryHref: string
  evidenceLabel: string
}

export type ImportComparisonRunStatus = "completed" | "failed"

export type ImportComparisonRunRecord = {
  run_id: string
  comparison_type: "forecast_vs_schedule" | "schedule_vs_actual"
  forecast_version_id: string | null
  schedule_version_id: string | null
  actual_import_version_id: string | null
  business_date_from: string
  business_date_to: string
  status: ImportComparisonRunStatus
  total_results: number
  total_gap_agents: number | null
  total_late_minutes: number | null
  created_at: string
}

export type ImportReviewCaseRecord = {
  case_id: string
  source_result_type: "forecast_schedule" | "schedule_actual"
  source_result_id: number
  business_date: string
  owner_id: string
  severity: string
  status: string
  created_at: string
}

export type ImportResultTraceTone = "ready" | "empty" | "blocked"

export type ImportResultTrace = {
  tone: ImportResultTraceTone
  title: string
  comparisonSummary: string
  reviewSummary: string
  nextAction: string
}

export type ImportPageHierarchyDetailTab =
  | "batch-detail"
  | "row-correction"
  | "result-trace"
  | "data-tools"

export type ImportPageHierarchy = {
  primaryRegion: string
  inspectorRegion: string
  detailTabs: string[]
  defaultDetailTab: ImportPageHierarchyDetailTab
  utilityPlacement: string
  layoutIntent: string
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

export function buildImportBatchProcessingHref(
  batchId: string,
  params: {
    correction?: string | null
    reason?: string | null
    row?: string | null
    upload?: string | null
  } = {}
): string {
  const searchParams = new URLSearchParams()

  if (params.correction) {
    searchParams.set("correction", params.correction)
  }

  if (params.reason) {
    searchParams.set("reason", params.reason)
  }

  if (params.row) {
    searchParams.set("row", params.row)
  }

  if (params.upload) {
    searchParams.set("upload", params.upload)
  }

  const query = searchParams.toString()

  return `/data-quality/import-batches/${encodeURIComponent(batchId)}${
    query ? `?${query}` : ""
  }`
}

export function buildImportComparisonRunsUrl(
  businessDate: string,
  apiBase = getDefaultApiBase()
): string {
  const searchParams = new URLSearchParams({ business_date: businessDate })

  return buildImportApiUrl(`/api/v1/comparison-runs?${searchParams.toString()}`, apiBase)
}

export function buildImportReviewCasesUrl(
  businessDate: string,
  apiBase = getDefaultApiBase()
): string {
  const searchParams = new URLSearchParams({ business_date: businessDate })

  return buildImportApiUrl(`/api/v1/review-cases?${searchParams.toString()}`, apiBase)
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

export function summarizeImportDownstreamResultNavigation({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}): ImportDownstreamResultNavigation {
  const versionLabel = batch.import_version_id ?? "未生成"
  const businessDate = batch.business_date_from

  if (readiness?.readiness_status === "blocked" || batch.failed_rows > 0) {
    return {
      tone: "blocked",
      title: "先修正导入阻塞",
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响后续对比与复核判断。",
      comparisonLabel: "对比结果：等待应用版本",
      reviewLabel: "复核案例：等待质量问题清理",
      primaryActionLabel: "查看失败行",
      primaryHref: "#import-row-correction",
      secondaryActionLabel: "查看应用准备度",
      secondaryHref: "#import-apply-readiness",
      evidenceLabel: `失败 ${batch.failed_rows.toLocaleString("zh-CN")} 行 · 警告 ${batch.warning_rows.toLocaleString("zh-CN")} 行`,
    }
  }

  if (batch.application_status !== "applied") {
    return {
      tone: readiness?.readiness_status === "ready" ? "ready" : "unknown",
      title:
        readiness?.readiness_status === "ready"
          ? "等待受控应用"
          : "等待应用状态确认",
      detail:
        readiness?.readiness_status === "ready"
          ? "当前批次已通过应用前检查，但还没有形成已应用版本；下游结果需要等待受控应用完成。"
          : "当前批次尚未应用且准备度未知；先确认准备度、版本和批次明细，再判断是否能进入下游结果。",
      comparisonLabel: "对比结果：等待应用版本",
      reviewLabel: "复核案例：等待对比结果",
      primaryActionLabel: "查看应用准备度",
      primaryHref: "#import-apply-readiness",
      secondaryActionLabel: "查看批次明细",
      secondaryHref: "#import-batch-detail",
      evidenceLabel: `已应用 0 条 · 版本 ${versionLabel}`,
    }
  }

  return {
    tone: "done",
    title: formatDownstreamNavigationTitle(batch.file_type),
    detail: formatDownstreamNavigationDetail(batch),
    comparisonLabel: formatDownstreamComparisonLabel(batch.file_type, versionLabel),
    reviewLabel: "复核案例：按履约异常结果继续追踪",
    primaryActionLabel: "查看对比结果 API",
    primaryHref: `/api/v1/comparison-runs?business_date=${encodeURIComponent(businessDate)}`,
    secondaryActionLabel: "查看复核案例 API",
    secondaryHref: `/api/v1/review-cases?business_date=${encodeURIComponent(businessDate)}`,
    evidenceLabel: `已应用 ${batch.applied_record_count.toLocaleString("zh-CN")} 条 · 版本 ${versionLabel}`,
  }
}

export function summarizeImportResultTrace({
  businessDate,
  comparisonRuns,
  reviewCases,
  comparisonError,
  reviewError,
}: {
  businessDate: string | null
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
  comparisonError: string | null
  reviewError: string | null
}): ImportResultTrace {
  const hasError = Boolean(comparisonError || reviewError)
  const completedComparisonRuns = comparisonRuns.filter(
    (run) => run.status === "completed"
  ).length
  const failedComparisonRuns = comparisonRuns.filter((run) => run.status === "failed").length
  const openReviewCases = reviewCases.filter((reviewCase) => reviewCase.status !== "closed")
    .length
  const comparisonSummary = comparisonError
    ? "对比结果读取失败"
    : `对比结果 ${comparisonRuns.length.toLocaleString("zh-CN")} 个 · 完成 ${completedComparisonRuns.toLocaleString("zh-CN")} 个 · 失败 ${failedComparisonRuns.toLocaleString("zh-CN")} 个`
  const reviewSummary = reviewError
    ? "复核案例读取失败"
    : `复核案例 ${reviewCases.length.toLocaleString("zh-CN")} 个 · 未关闭 ${openReviewCases.toLocaleString("zh-CN")} 个`

  if (hasError) {
    return {
      tone: "blocked",
      title: "结果追踪读取受阻",
      comparisonSummary,
      reviewSummary,
      nextAction: "先确认本地结果查询 API 状态；读取失败时不要把当前批次判断为无下游结果。",
    }
  }

  if (!businessDate || (comparisonRuns.length === 0 && reviewCases.length === 0)) {
    return {
      tone: "empty",
      title: businessDate ? "暂未找到下游结果" : "等待批次业务日",
      comparisonSummary,
      reviewSummary,
      nextAction: "没有结果时先确认批次是否已应用、对比计算是否已触发，以及复核案例是否已生成。",
    }
  }

  return {
    tone: "ready",
    title: "已找到下游结果",
    comparisonSummary,
    reviewSummary,
    nextAction: "继续查看对比结果和复核案例明细，确认导入数据是否已进入业务闭环。",
  }
}

export function summarizeImportPageHierarchy({
  selectedBatch,
  readiness,
  hasBatchDetail,
  hasUploadTools,
  hasResultTrace = false,
}: {
  selectedBatch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  hasBatchDetail: boolean
  hasUploadTools: boolean
  hasResultTrace?: boolean
}): ImportPageHierarchy {
  const hasBlockingRows =
    Boolean(selectedBatch && selectedBatch.failed_rows > 0) ||
    readiness?.readiness_status === "blocked"
  const defaultDetailTab: ImportPageHierarchyDetailTab = hasBlockingRows
    ? "row-correction"
    : selectedBatch?.application_status === "applied" && hasResultTrace
      ? "result-trace"
    : hasBatchDetail
      ? "batch-detail"
      : hasUploadTools
        ? "data-tools"
        : "batch-detail"

  return {
    primaryRegion: "接入批次工作台",
    inspectorRegion: selectedBatch ? "选中批次状态检查器" : "等待选择批次",
    detailTabs: ["批次明细", "失败行修正", "结果追踪", "导入与模板"],
    defaultDetailTab,
    utilityPlacement: "导入与模板收纳到分层详情",
    layoutIntent: "先定位批次，再处理状态，最后进入详情。",
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

export function summarizeImportBatchDetailReadability(
  detail: ImportBatchPersistenceDetail
): ImportBatchDetailReadability {
  const summary = summarizeImportBatchDetail(detail)
  const errorFieldSummary = summarizeImportDetailErrorFields(detail.rows)

  if (summary.totalRows === 0) {
    return {
      tone: "empty",
      title: "等待行结果",
      detail: "当前批次还没有可展示的行结果。",
      nextAction: "先确认批次是否完成解析，再查看上传结果或重试导入。",
      focusLabel: "行结果",
      errorFieldSummary,
    }
  }

  if (summary.failedRows > 0) {
    return {
      tone: "blocked",
      title: "先处理失败行",
      detail: `当前批次共 ${summary.totalRows.toLocaleString("zh-CN")} 行，${summary.failedRows.toLocaleString("zh-CN")} 行失败、${summary.warningRows.toLocaleString("zh-CN")} 行警告；失败行会阻塞后续应用。`,
      nextAction: "先查看全部行结果中的错误字段和失败原因，再进入失败行修正。",
      focusLabel: "失败行",
      errorFieldSummary,
    }
  }

  if (summary.versionCount === 0) {
    return {
      tone: "warning",
      title: "缺少版本记录",
      detail: `当前批次有 ${summary.totalRows.toLocaleString("zh-CN")} 行结果但还没有版本记录；需要先确认导入版本是否生成。`,
      nextAction: "优先查看版本记录区域和应用准备度，确认是否存在版本缺口。",
      focusLabel: "版本记录",
      errorFieldSummary,
    }
  }

  if (summary.warningRows > 0) {
    return {
      tone: "warning",
      title: "复核警告行",
      detail: `当前批次没有失败行，但仍有 ${summary.warningRows.toLocaleString("zh-CN")} 行警告；应用前建议复核字段预览和错误说明。`,
      nextAction: "先复核警告行，再查看应用准备度是否仍有阻塞。",
      focusLabel: "警告行",
      errorFieldSummary,
    }
  }

  return {
    tone: "ready",
    title: "批次明细可复核",
    detail: `当前批次 ${summary.totalRows.toLocaleString("zh-CN")} 行均未发现失败或警告，并已生成 ${summary.versionCount.toLocaleString("zh-CN")} 条版本记录。`,
    nextAction: "继续查看版本记录和应用状态概览，确认是否进入应用前复核。",
    focusLabel: "版本记录",
    errorFieldSummary,
  }
}

export function summarizeImportQualityExceptionTrace(
  detail: ImportBatchPersistenceDetail
): ImportQualityExceptionTrace {
  const summary = summarizeImportBatchDetail(detail)
  const impactScope = formatQualityExceptionImpactScope(detail.batch.file_type)
  const evidenceLabel = `错误字段：${summarizeImportDetailErrorFields(detail.rows)}`

  if (summary.totalRows === 0) {
    return {
      tone: "empty",
      title: "等待质量结果",
      impactScope,
      issueSummary: "当前批次还没有行结果，暂不能判断对履约异常的影响。",
      nextAction: "先确认导入解析结果，再继续查看异常影响范围。",
      evidenceLabel,
    }
  }

  if (summary.failedRows > 0) {
    return {
      tone: "blocked",
      title: "履约异常判断被数据质量阻塞",
      impactScope,
      issueSummary: formatQualityExceptionFailedIssue(detail.batch.file_type, summary),
      nextAction: "先修正失败行并复核警告行，再查看应用准备度和下游对比结果。",
      evidenceLabel,
    }
  }

  if (summary.versionCount === 0) {
    return {
      tone: "warning",
      title: "版本缺口影响异常引用",
      impactScope,
      issueSummary: `${summary.totalRows.toLocaleString("zh-CN")} 行已解析但还没有版本记录；${formatQualityExceptionVersionSubject(detail.batch.file_type)}无法稳定引用${formatQualityExceptionVersionLabel(detail.batch.file_type)}。`,
      nextAction: formatQualityExceptionVersionAction(detail.batch.file_type),
      evidenceLabel,
    }
  }

  if (summary.warningRows > 0) {
    return {
      tone: "warning",
      title: "警告行需要异常前复核",
      impactScope,
      issueSummary: `当前批次没有失败行，但仍有 ${summary.warningRows.toLocaleString("zh-CN")} 行警告；异常归因前需要确认字段是否可用。`,
      nextAction: "先复核警告行字段，再查看应用准备度和下游对比结果。",
      evidenceLabel,
    }
  }

  return {
    tone: "ready",
    title: "可用于异常归因复核",
    impactScope,
    issueSummary: `${summary.totalRows.toLocaleString("zh-CN")} 行已解析并生成 ${summary.versionCount.toLocaleString("zh-CN")} 条版本记录；当前未发现失败或警告。`,
    nextAction: "继续查看应用状态和下游异常归因结果。",
    evidenceLabel,
  }
}

export function getImportRowStandardFieldsPreview(row: ImportBatchRowResult): string {
  const standardFields = row.raw_data.standard_fields
  if (isRecord(standardFields)) {
    return JSON.stringify(standardFields)
  }

  return JSON.stringify(row.raw_data)
}

export function formatImportRowErrorField(row: ImportBatchRowResult): string {
  return row.error_field?.trim() || "无"
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

function formatDownstreamNavigationTitle(fileType: ImportFileType): string {
  if (fileType === "personnel_schedule") {
    return "可进入排班履约对比"
  }

  if (fileType === "demand_forecast") {
    return "可进入预测排班对比"
  }

  if (fileType === "login_log" || fileType === "status_log") {
    return "可进入实际履约对比"
  }

  return "可进入下游结果复核"
}

function formatDownstreamNavigationDetail(batch: ImportBatchListRow): string {
  const recordCount = batch.applied_record_count.toLocaleString("zh-CN")

  if (batch.file_type === "personnel_schedule") {
    return `人员排班已应用 ${recordCount} 条记录，可继续查看预测 vs 排班或排班 vs 实际登录/状态的本地结果列表。`
  }

  if (batch.file_type === "demand_forecast") {
    return `需求预测已应用 ${recordCount} 条记录，可继续查看预测 vs 排班的本地结果列表。`
  }

  if (batch.file_type === "login_log" || batch.file_type === "status_log") {
    return `实际日志已应用 ${recordCount} 条记录，可继续查看排班 vs 实际登录/状态的本地结果列表。`
  }

  return `主数据已应用 ${recordCount} 条记录，可继续确认版本引用，并在对比结果和复核案例中追踪归因口径。`
}

function formatDownstreamComparisonLabel(
  fileType: ImportFileType,
  versionLabel: string
): string {
  if (fileType === "personnel_schedule") {
    return `对比结果：排班版本 ${versionLabel}`
  }

  if (fileType === "demand_forecast") {
    return `对比结果：预测版本 ${versionLabel}`
  }

  if (fileType === "login_log" || fileType === "status_log") {
    return `对比结果：实际日志版本 ${versionLabel}`
  }

  return `对比结果：主数据版本 ${versionLabel}`
}

function summarizeImportDetailErrorFields(rows: ImportBatchRowResult[]): string {
  const fields = Array.from(
    new Set(
      rows
        .map((row) => row.error_field?.trim())
        .filter((field): field is string => Boolean(field))
    )
  )

  if (fields.length === 0) {
    return "无"
  }

  return fields.slice(0, 3).join("、")
}

function formatQualityExceptionImpactScope(fileType: ImportFileType): string {
  if (fileType === "master_data") {
    return "主数据 -> 团队/供应商/技能归因"
  }

  if (fileType === "personnel_schedule") {
    return "人员排班 -> 排班 vs 登录/状态异常"
  }

  if (fileType === "demand_forecast") {
    return "需求预测 -> 预测 vs 排班缺口异常"
  }

  return "实际日志 -> 排班 vs 登录/状态异常"
}

function formatQualityExceptionFailedIssue(
  fileType: ImportFileType,
  summary: ImportBatchDetailSummary
): string {
  const rowCounts = `${summary.failedRows.toLocaleString("zh-CN")} 行失败、${summary.warningRows.toLocaleString("zh-CN")} 行警告`

  if (fileType === "personnel_schedule") {
    return `${rowCounts}；失败行会影响迟到、缺勤、未按排班登录等异常判断。`
  }

  if (fileType === "demand_forecast") {
    return `${rowCounts}；失败行会影响预测缺口、排班覆盖等异常判断。`
  }

  if (fileType === "master_data") {
    return `${rowCounts}；失败行会影响职场、供应商、项目、技能和人员归因。`
  }

  return `${rowCounts}；失败行会影响迟到、早退、状态不符等异常判断。`
}

function formatQualityExceptionVersionSubject(fileType: ImportFileType): string {
  if (fileType === "demand_forecast") {
    return "缺口异常"
  }

  if (fileType === "personnel_schedule") {
    return "排班异常"
  }

  if (fileType === "master_data") {
    return "异常归因"
  }

  return "实际履约异常"
}

function formatQualityExceptionVersionLabel(fileType: ImportFileType): string {
  if (fileType === "demand_forecast") {
    return "预测版本"
  }

  if (fileType === "personnel_schedule") {
    return "排班版本"
  }

  if (fileType === "master_data") {
    return "主数据版本"
  }

  return "日志版本"
}

function formatQualityExceptionVersionAction(fileType: ImportFileType): string {
  if (fileType === "demand_forecast") {
    return "先确认导入版本生成，再进入预测 vs 排班对比复核。"
  }

  if (fileType === "personnel_schedule") {
    return "先确认排班版本生成，再进入排班 vs 实际对比复核。"
  }

  if (fileType === "master_data") {
    return "先确认主数据版本生成，再查看异常归因是否可复核。"
  }

  return "先确认日志版本生成，再进入排班 vs 实际对比复核。"
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getDefaultApiBase(): string {
  return process.env.NEXT_PUBLIC_BPO_API_BASE_URL ?? "http://127.0.0.1:8000"
}
