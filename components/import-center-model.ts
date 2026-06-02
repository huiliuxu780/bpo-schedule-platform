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

export type ImportQualityImpactAggregationTone =
  | "blocked"
  | "warning"
  | "ready"
  | "empty"

export type ImportQualityImpactIssueGroup = {
  key: string
  title: string
  rowCount: number
  failedRows: number
  warningRows: number
  affectedReviewCases: number
  openReviewCases: number
  comparisonResults: number
  impactLabel: string
  reviewCasesHref: string
  reviewCasesActionLabel: string
  reviewCasesFocus: string
  evidence: string[]
  nextAction: string
}

export type ImportQualityImpactAggregation = {
  tone: ImportQualityImpactAggregationTone
  title: string
  detail: string
  downstreamLabel: string
  topIssueLabel: string
  nextAction: string
  groups: ImportQualityImpactIssueGroup[]
}

export type ImportReviewConclusionPreviewTone =
  | "blocked"
  | "warning"
  | "ready"
  | "empty"

export type ImportReviewConclusionPreview = {
  tone: ImportReviewConclusionPreviewTone
  title: string
  suggestedConclusion: string
  evidenceSummary: string
  residualRisk: string
  nextAction: string
  evidence: string[]
}

export type ImportReviewEvidenceGapTone = "blocked" | "warning" | "ready" | "empty"

export type ImportReviewEvidenceGapItem = {
  key: string
  title: string
  ownerId: string
  riskTone: ImportReviewEvidenceGapTone
  evidenceNeed: string
  relatedQualityIssue: string
  relatedComparison: string
  riskLabel: string
  nextAction: string
  evidence: string[]
}

export type ImportReviewEvidenceGapDrilldown = {
  tone: ImportReviewEvidenceGapTone
  title: string
  summary: string
  ownerSummary: string
  nextAction: string
  gaps: ImportReviewEvidenceGapItem[]
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

export type ImportReadinessIssueGroupTone = "blocked" | "ready" | "done" | "unknown"

export type ImportReadinessIssueGroupKey =
  | "failed_rows"
  | "row_required_fields"
  | "version"
  | "application"
  | "batch_blockers"
  | "ready"
  | "unknown"

export type ImportReadinessIssueGroup = {
  key: ImportReadinessIssueGroupKey
  tone: ImportReadinessIssueGroupTone
  title: string
  count: number
  detail: string
  nextAction: string
  evidence: string[]
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

export type ImportForecastScheduleComparisonResultRecord = {
  result_id: number
  run_id: string
  forecast_version_id: string
  schedule_version_id: string
  forecast_interval_id: string | null
  schedule_detail_id: string | null
  business_date: string
  workplace_id: string
  project_id: string
  skill_id: string
  interval_start: string
  interval_end: string
  forecast_agents: number
  scheduled_agents: number
  gap_agents: number
  result_status: string
}

export type ImportScheduleActualComparisonResultRecord = {
  result_id: number
  run_id: string
  schedule_version_id: string
  actual_import_version_id: string
  schedule_detail_id: string | null
  actual_status_interval_row_id: number | null
  business_date: string
  employee_id: string
  interval_start: string
  interval_end: string
  scheduled_minutes: number
  actual_productive_minutes: number
  late_minutes: number
  result_status: string
}

export type ImportComparisonRunDetailResponse = {
  run: ImportComparisonRunRecord
  forecast_schedule_results: ImportForecastScheduleComparisonResultRecord[]
  schedule_actual_results: ImportScheduleActualComparisonResultRecord[]
}

export type ImportComparisonRunDetailSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  metricCards: Array<{ label: string; value: string; detail: string }>
  versionLabel: string
  apiHref: string
  resultRows: Array<{
    id: string
    source: string
    dimension: string
    metric: string
    status: string
  }>
}

export type ImportComparisonRunReviewCaseSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  detail: string
  nextAction: string
  cases: Array<{
    caseId: string
    resultLabel: string
    ownerLabel: string
    severityLabel: string
    statusLabel: string
    href: string
  }>
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

export type ImportReviewEvidenceRecord = {
  evidence_id: string
  case_id: string
  evidence_type: string
  evidence_uri: string
  submitted_by: string
  submitted_at: string
  note: string | null
}

export type ImportReviewConclusionRecord = {
  conclusion_id: string
  case_id: string
  conclusion_type: string
  risk_level: string
  conclusion_text: string
  decided_by: string
  decided_at: string
}

export type ImportReviewClosureRecord = {
  closure_id: string
  case_id: string
  closure_status: string
  closed_by: string
  closed_at: string
  closure_note: string | null
}

export type ImportReviewCaseSourceResultRecord = {
  source_result_type: ImportReviewCaseRecord["source_result_type"]
  result_id: number
  run_id: string
  business_date: string
  interval_start: string
  interval_end: string
  result_status: string
  workplace_id: string | null
  project_id: string | null
  skill_id: string | null
  employee_id: string | null
  forecast_version_id: string | null
  schedule_version_id: string | null
  actual_import_version_id: string | null
  forecast_interval_id: string | null
  schedule_detail_id: string | null
  actual_status_interval_row_id: number | null
  forecast_agents: number | null
  scheduled_agents: number | null
  gap_agents: number | null
  scheduled_minutes: number | null
  actual_productive_minutes: number | null
  late_minutes: number | null
}

export type ImportReviewCaseSourceTraceVersionRecord = {
  version_role: "forecast" | "schedule" | "actual"
  business_version_id: string
  import_version_id: string | null
  import_version_type: ImportFileType | null
  batch_id: string | null
  file_name: string | null
  business_date_from: string | null
  business_date_to: string | null
}

export type ImportReviewCaseSourceTraceRecord = {
  run: ImportComparisonRunRecord
  versions: ImportReviewCaseSourceTraceVersionRecord[]
}

export type ImportReviewCaseDetailResponse = {
  case: ImportReviewCaseRecord
  source_result?: ImportReviewCaseSourceResultRecord | null
  source_trace?: ImportReviewCaseSourceTraceRecord | null
  evidence: ImportReviewEvidenceRecord[]
  conclusions: ImportReviewConclusionRecord[]
  closure: ImportReviewClosureRecord | null
}

export type ImportReviewCaseDetailTone = "blocked" | "warning" | "ready" | "empty"

export type ImportReviewCaseProcessingStageKey =
  | "all"
  | "missing_evidence"
  | "missing_conclusion"
  | "ready_to_close"
  | "closed"
  | "unknown"

export type ImportReviewCaseProcessingStageSnapshot = {
  evidenceCount: number
  conclusionCount: number
  isClosed: boolean
}

export type ImportReviewCaseProcessingStageSummary = {
  key: Exclude<ImportReviewCaseProcessingStageKey, "all">
  label: string
  nextAction: string
  evidenceLabel: string
}

export type ImportReviewOwnerStageMatrixStageKey = Exclude<
  ImportReviewCaseProcessingStageKey,
  "all"
>

export type ImportReviewOwnerStageMatrixColumn = {
  key: ImportReviewOwnerStageMatrixStageKey
  label: string
}

export type ImportReviewOwnerStageMatrixCell = ImportReviewOwnerStageMatrixColumn & {
  count: number
  href: string | null
}

export type ImportReviewOwnerStageMatrixRow = {
  ownerId: string
  totalCount: number
  actionableCount: number
  cells: ImportReviewOwnerStageMatrixCell[]
}

export type ImportReviewOwnerStageMatrixSummary = {
  columns: ImportReviewOwnerStageMatrixColumn[]
  rows: ImportReviewOwnerStageMatrixRow[]
  totalOwners: number
  totalCases: number
  actionableCount: number
}

export type ImportReviewCaseDetailSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  sourceLabel: string
  sourceResultDimensions: string[]
  sourceResultMetrics: string[]
  sourceTraceRun: string
  sourceTraceHref: string
  sourceTraceVersions: string[]
  ownerLabel: string
  evidenceLabel: string
  qualityFocus: string
  evidenceGap: string
  nextAction: string
  detailHref: string
  listHref: string
  evidence: string[]
}

export type ImportReviewCaseEvidenceChainSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  statusLabel: string
  summary: string
  nextAction: string
  items: Array<{
    id: string
    typeLabel: string
    title: string
    detail: string
    timestamp: string
  }>
}

export type ImportReviewCaseProcessingTimelineSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  statusLabel: string
  currentStage: string
  summary: string
  nextAction: string
  items: Array<{
    id: string
    stage: string
    actor: string
    timestamp: string
    title: string
    detail: string
    sourceLabel: string
  }>
}

export type ImportReviewCaseClosureActionSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  canSubmit: boolean
  statusLabel: string
  actionLabel: string
  detail: string
  blockers: string[]
  apiHref: string
}

export type ImportReviewCaseEvidenceActionSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  canSubmit: boolean
  statusLabel: string
  actionLabel: string
  detail: string
  blockers: string[]
  apiHref: string
}

export type ImportReviewCaseConclusionActionSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  canSubmit: boolean
  statusLabel: string
  actionLabel: string
  detail: string
  blockers: string[]
  apiHref: string
}

export type ImportReviewEvidenceWritePayload = Pick<
  ImportReviewEvidenceRecord,
  "evidence_id" | "case_id" | "evidence_type" | "evidence_uri" | "submitted_by" | "note"
>

export type ImportReviewConclusionWritePayload = Pick<
  ImportReviewConclusionRecord,
  | "conclusion_id"
  | "case_id"
  | "conclusion_type"
  | "risk_level"
  | "conclusion_text"
  | "decided_by"
>

export type ImportReviewCaseClosureWritePayload = {
  case: Pick<
    ImportReviewCaseRecord,
    | "case_id"
    | "source_result_type"
    | "source_result_id"
    | "business_date"
    | "owner_id"
    | "severity"
    | "status"
  >
  evidence: Array<
    Pick<
      ImportReviewEvidenceRecord,
      "evidence_id" | "case_id" | "evidence_type" | "evidence_uri" | "submitted_by" | "note"
    >
  >
  conclusions: Array<
    Pick<
      ImportReviewConclusionRecord,
      | "conclusion_id"
      | "case_id"
      | "conclusion_type"
      | "risk_level"
      | "conclusion_text"
      | "decided_by"
    >
  >
  closure: {
    closure_id: string
    case_id: string
    closure_status: "closed"
    closed_by: string
    closure_note: string | null
  }
}

export type ImportReviewCasesWorkspaceFilters = {
  businessDate?: string | null
  ownerId?: string | null
  status?: string | null
  severity?: string | null
  sourceResultType?: ImportReviewCaseRecord["source_result_type"] | "all" | null
  processingStage?: ImportReviewCaseProcessingStageKey | null
  query?: string | null
}

export type ImportReviewCasesWorkspaceTone = "blocked" | "warning" | "ready" | "empty"

export type ImportReviewCasesWorkspaceGroup = {
  key: string
  label: string
  count: number
  openCount: number
}

export type ImportReviewCasesOwnerGroup = ImportReviewCasesWorkspaceGroup & {
  ownerId: string
}

export type ImportReviewCasesWorkspaceSummary = {
  tone: ImportReviewCasesWorkspaceTone
  title: string
  detail: string
  totalCount: number
  openCount: number
  closedCount: number
  highRiskOpenCount: number
  ownerGroups: ImportReviewCasesOwnerGroup[]
  statusGroups: ImportReviewCasesWorkspaceGroup[]
  severityGroups: ImportReviewCasesWorkspaceGroup[]
  sourceGroups: ImportReviewCasesWorkspaceGroup[]
  processingStageGroups: ImportReviewCasesWorkspaceGroup[]
  nextAction: string
}

export type ImportResultTraceTone = "ready" | "empty" | "blocked"

export type ImportResultTrace = {
  tone: ImportResultTraceTone
  title: string
  comparisonSummary: string
  reviewSummary: string
  nextAction: string
}

export type ImportDownstreamResultDrilldownTone = "ready" | "empty" | "blocked"

export type ImportDownstreamResultDrilldown = {
  tone: ImportDownstreamResultDrilldownTone
  title: string
  detail: string
  nextAction: string
  comparisonFocus: string
  reviewFocus: string
  primaryActionLabel: string
  primaryHref: string
  secondaryActionLabel: string
  secondaryHref: string
  evidence: string[]
}

export type ImportPageHierarchyDetailTab =
  | "status-check"
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

export type ImportTemplateMappingPair = {
  sourceField: string
  standardField: string
}

export type ImportTemplateFitOption = {
  templateId: string
  templateName: string
  isActive: boolean
  mappedFieldCount: number
  mappedStandardFields: string[]
  missingStandardFields: string[]
  mappingPairs: ImportTemplateMappingPair[]
}

export type ImportTemplateFitDetail = {
  fileType: ImportFileType
  status: ImportTemplateFitStatus
  matchingTemplates: number
  activeMatchingTemplates: number
  inactiveMatchingTemplates: number
  recommendedTemplateId: string | null
  recommendedTemplateName: string | null
  recommendedMappedFieldCount: number
  mappedStandardFields: string[]
  missingStandardFields: string[]
  templateOptions: ImportTemplateFitOption[]
  title: string
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

const recommendedImportStandardFields: Record<ImportFileType, string[]> = {
  master_data: [
    "source_key",
    "employee_id",
    "employee_name",
    "worksite_id",
    "supplier_id",
    "project_id",
  ],
  personnel_schedule: [
    "source_key",
    "employee_id",
    "business_date",
    "shift_type_id",
    "start_time",
    "end_time",
  ],
  demand_forecast: [
    "source_key",
    "business_date",
    "interval_start",
    "worksite_id",
    "project_id",
    "skill_group",
    "demand_agents",
  ],
  login_log: ["source_key", "employee_id", "login_time", "logout_time"],
  status_log: ["source_key", "employee_id", "status_code", "start_time", "end_time"],
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

  return `/data-quality/${encodeURIComponent(batchId)}${query ? `?${query}` : ""}`
}

export function buildImportComparisonRunsUrl(
  businessDate: string,
  apiBase = getDefaultApiBase()
): string {
  const searchParams = new URLSearchParams({ business_date: businessDate })

  return buildImportApiUrl(`/api/v1/comparison-runs?${searchParams.toString()}`, apiBase)
}

export function buildImportComparisonRunDetailApiUrl(
  runId: string,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/comparison-runs/${encodeURIComponent(runId)}`,
    apiBase
  )
}

export function buildImportComparisonRunDetailWorkspaceHref(runId: string): string {
  return `/data-quality/comparison-runs/${encodeURIComponent(runId)}`
}

export function buildImportReviewCasesUrl(
  businessDate: string,
  apiBase = getDefaultApiBase()
): string {
  const searchParams = new URLSearchParams({ business_date: businessDate })

  return buildImportApiUrl(`/api/v1/review-cases?${searchParams.toString()}`, apiBase)
}

export function buildImportReviewCasesApiUrl(
  filters: ImportReviewCasesWorkspaceFilters,
  apiBase = getDefaultApiBase()
): string {
  const searchParams = new URLSearchParams()

  appendReviewCasesFilterParams(searchParams, filters, {
    businessDateKey: "business_date",
    ownerIdKey: "owner_id",
    sourceResultTypeKey: "source_result_type",
  })

  const query = searchParams.toString()

  return buildImportApiUrl(`/api/v1/review-cases${query ? `?${query}` : ""}`, apiBase)
}

export function buildImportReviewCaseDetailApiUrl(
  caseId: string,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/review-cases/${encodeURIComponent(caseId)}`,
    apiBase
  )
}

export function buildImportReviewCaseClosureWriteApiUrl(
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl("/api/v1/review-cases/write-closure", apiBase)
}

export function buildImportReviewEvidenceWriteApiUrl(
  caseId: string,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/review-cases/${encodeURIComponent(caseId)}/evidence`,
    apiBase
  )
}

export function buildImportReviewConclusionWriteApiUrl(
  caseId: string,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/review-cases/${encodeURIComponent(caseId)}/conclusion`,
    apiBase
  )
}

export function buildImportReviewCasesWorkspaceHref(
  filters: ImportReviewCasesWorkspaceFilters
): string {
  const searchParams = new URLSearchParams()

  appendReviewCasesFilterParams(searchParams, filters, {
    businessDateKey: "businessDate",
    ownerIdKey: "ownerId",
    sourceResultTypeKey: "sourceResultType",
  })

  const processingStage = normalizeAllFilterValue(filters.processingStage)

  if (processingStage) {
    searchParams.set("processingStage", processingStage)
  }

  const query = filters.query?.trim()

  if (query) {
    searchParams.set("query", query)
  }

  const serialized = searchParams.toString()

  return `/data-quality/review-cases${serialized ? `?${serialized}` : ""}`
}

export function buildImportReviewCaseDetailWorkspaceHref(caseId: string): string {
  return `/data-quality/review-cases/${encodeURIComponent(caseId)}`
}

export function buildImportQualityIssueReviewCasesHref({
  businessDate,
  sourceResultType,
  issueTitle,
}: {
  businessDate: string | null
  sourceResultType?: ImportReviewCaseRecord["source_result_type"] | "all" | null
  issueTitle: string
}): string {
  return buildImportReviewCasesWorkspaceHref({
    businessDate,
    status: "open",
    sourceResultType: sourceResultType ?? "all",
    query: issueTitle,
  })
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

export function filterImportReviewCases(
  cases: ImportReviewCaseRecord[],
  filters: ImportReviewCasesWorkspaceFilters,
  processingStages: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined> = {}
): ImportReviewCaseRecord[] {
  const businessDate = normalizeFilterValue(filters.businessDate)
  const ownerId = normalizeFilterValue(filters.ownerId)
  const status = normalizeAllFilterValue(filters.status)
  const severity = normalizeAllFilterValue(filters.severity)
  const sourceResultType = normalizeAllFilterValue(filters.sourceResultType)
  const processingStage = normalizeAllFilterValue(filters.processingStage)
  const rawQuery = filters.query?.trim() ?? ""
  const query = rawQuery.toLowerCase()
  const shouldFilterByQuery = query && !isQualityIssueFocusQuery(rawQuery)

  return cases.filter((reviewCase) => {
    if (businessDate && reviewCase.business_date !== businessDate) {
      return false
    }

    if (ownerId && reviewCase.owner_id !== ownerId) {
      return false
    }

    if (status && reviewCase.status !== status) {
      return false
    }

    if (severity && reviewCase.severity !== severity) {
      return false
    }

    if (sourceResultType && reviewCase.source_result_type !== sourceResultType) {
      return false
    }

    if (
      processingStage &&
      summarizeImportReviewCaseProcessingStage(
        reviewCase,
        processingStages[reviewCase.case_id]
      ).key !== processingStage
    ) {
      return false
    }

    if (!shouldFilterByQuery) {
      return true
    }

    const searchableText = [
      reviewCase.case_id,
      reviewCase.owner_id,
      reviewCase.severity,
      reviewCase.status,
      reviewCase.source_result_type,
      String(reviewCase.source_result_id),
      reviewCase.business_date,
    ]
      .join(" ")
      .toLowerCase()

    return searchableText.includes(query)
  })
}

export function summarizeImportReviewCasesWorkspace({
  cases,
  filters,
  error,
  processingStages = {},
}: {
  cases: ImportReviewCaseRecord[]
  filters: ImportReviewCasesWorkspaceFilters
  error: string | null
  processingStages?: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
}): ImportReviewCasesWorkspaceSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "复核案例读取失败",
      detail: error,
      totalCount: 0,
      openCount: 0,
      closedCount: 0,
      highRiskOpenCount: 0,
      ownerGroups: [],
      statusGroups: [],
      severityGroups: [],
      sourceGroups: [],
      processingStageGroups: [],
      nextAction: "先恢复复核案例读取，再判断 owner、证据缺口和处理优先级。",
    }
  }

  const filteredCases = filterImportReviewCases(cases, filters, processingStages)
  const openCases = filteredCases.filter((reviewCase) => reviewCase.status !== "closed")
  const highRiskOpenCases = openCases.filter((reviewCase) =>
    isHighRiskReviewSeverity(reviewCase.severity)
  )
  const topOwner = buildReviewCaseOwnerGroups(filteredCases)[0] ?? null

  if (filteredCases.length === 0) {
    return {
      tone: "empty",
      title: "暂无匹配复核案例",
      detail: "当前筛选条件下没有可展示的复核案例。",
      totalCount: 0,
      openCount: 0,
      closedCount: 0,
      highRiskOpenCount: 0,
      ownerGroups: [],
      statusGroups: [],
      severityGroups: [],
      sourceGroups: [],
      processingStageGroups: [],
      nextAction: "放宽业务日、owner、状态、严重度或来源筛选后再查看。",
    }
  }

  const openCount = openCases.length
  const closedCount = filteredCases.length - openCount

  return {
    tone: highRiskOpenCases.length > 0 ? "blocked" : openCount > 0 ? "warning" : "ready",
    title: `复核案例 ${filteredCases.length.toLocaleString("zh-CN")} 个`,
    detail: buildReviewCasesWorkspaceDetail(filteredCases, filters),
    totalCount: filteredCases.length,
    openCount,
    closedCount,
    highRiskOpenCount: highRiskOpenCases.length,
    ownerGroups: buildReviewCaseOwnerGroups(filteredCases),
    statusGroups: buildReviewCaseGroups(filteredCases, "status", formatReviewCaseStatus),
    severityGroups: buildReviewCaseGroups(filteredCases, "severity", formatReviewCaseSeverity),
    sourceGroups: buildReviewCaseGroups(
      filteredCases,
      "source_result_type",
      formatReviewCaseSourceType
    ),
    processingStageGroups: buildReviewCaseProcessingStageGroups(
      filteredCases,
      processingStages
    ),
    nextAction:
      topOwner && topOwner.openCount > 0
        ? `先处理 ${topOwner.ownerId} 名下 ${topOwner.openCount.toLocaleString("zh-CN")} 个未关闭复核案例，再回看高风险来源和证据缺口。`
        : "当前筛选结果没有未关闭复核案例，可继续回看已关闭案例的来源和证据完整性。",
  }
}

export function summarizeImportReviewCaseProcessingStage(
  reviewCase: ImportReviewCaseRecord,
  stage?: ImportReviewCaseProcessingStageSnapshot
): ImportReviewCaseProcessingStageSummary {
  if (reviewCase.status === "closed" || stage?.isClosed) {
    return {
      key: "closed",
      label: "已关闭",
      nextAction: "回看关闭依据，不在列表页重新打开。",
      evidenceLabel: stage
        ? `证据 ${stage.evidenceCount.toLocaleString("zh-CN")} 条 · 结论 ${stage.conclusionCount.toLocaleString("zh-CN")} 条`
        : "证据不可用 · 结论不可用",
    }
  }

  if (!stage) {
    return {
      key: "unknown",
      label: "阶段未知",
      nextAction: "先打开详情页确认处理材料。",
      evidenceLabel: "证据不可用 · 结论不可用",
    }
  }

  const evidenceLabel = `证据 ${stage.evidenceCount.toLocaleString("zh-CN")} 条 · 结论 ${stage.conclusionCount.toLocaleString("zh-CN")} 条`

  if (stage.evidenceCount === 0) {
    return {
      key: "missing_evidence",
      label: "缺证据",
      nextAction: "先补充证据，再补充复核结论。",
      evidenceLabel,
    }
  }

  if (stage.conclusionCount === 0) {
    return {
      key: "missing_conclusion",
      label: "缺结论",
      nextAction: "先补充复核结论，再判断能否关闭。",
      evidenceLabel,
    }
  }

  return {
    key: "ready_to_close",
    label: "可关闭",
    nextAction: "证据和结论已齐，进入受控关闭入口。",
    evidenceLabel,
  }
}

export function summarizeImportReviewOwnerStageMatrix({
  cases,
  processingStages = {},
  baseFilters = {},
}: {
  cases: ImportReviewCaseRecord[]
  processingStages?: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
  baseFilters?: ImportReviewCasesWorkspaceFilters
}): ImportReviewOwnerStageMatrixSummary {
  const scopedCases = filterImportReviewCases(
    cases,
    {
      businessDate: baseFilters.businessDate,
      severity: baseFilters.severity,
      sourceResultType: baseFilters.sourceResultType,
    },
    processingStages
  )
  const rowsByOwner = new Map<string, ImportReviewOwnerStageMatrixRow>()

  for (const reviewCase of scopedCases) {
    const stage = summarizeImportReviewCaseProcessingStage(
      reviewCase,
      processingStages[reviewCase.case_id]
    )
    const row = rowsByOwner.get(reviewCase.owner_id) ?? {
      ownerId: reviewCase.owner_id,
      totalCount: 0,
      actionableCount: 0,
      cells: IMPORT_REVIEW_OWNER_STAGE_MATRIX_COLUMNS.map((column) => ({
        ...column,
        count: 0,
        href: null,
      })),
    }
    const cell = row.cells.find((candidate) => candidate.key === stage.key)

    row.totalCount += 1

    if (stage.key !== "closed") {
      row.actionableCount += 1
    }

    if (cell) {
      cell.count += 1
    }

    rowsByOwner.set(reviewCase.owner_id, row)
  }

  const rows = [...rowsByOwner.values()]
    .map((row) => ({
      ...row,
      cells: row.cells.map((cell) => ({
        ...cell,
        href:
          cell.count > 0
            ? buildImportReviewCasesWorkspaceHref({
                businessDate: baseFilters.businessDate,
                ownerId: row.ownerId,
                severity: baseFilters.severity,
                sourceResultType: baseFilters.sourceResultType,
                processingStage: cell.key,
                query: baseFilters.query,
              })
            : null,
      })),
    }))
    .sort(
      (a, b) =>
        b.actionableCount - a.actionableCount ||
        b.totalCount - a.totalCount ||
        a.ownerId.localeCompare(b.ownerId)
    )

  return {
    columns: IMPORT_REVIEW_OWNER_STAGE_MATRIX_COLUMNS,
    rows,
    totalOwners: rows.length,
    totalCases: rows.reduce((total, row) => total + row.totalCount, 0),
    actionableCount: rows.reduce((total, row) => total + row.actionableCount, 0),
  }
}

export function summarizeImportReviewCaseDetail({
  detail,
  error,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}): ImportReviewCaseDetailSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "复核案例读取失败",
      sourceLabel: "来源不可用",
      sourceResultDimensions: ["来源不可用"],
      sourceResultMetrics: ["等待 API 恢复"],
      sourceTraceRun: "来源链路不可用",
      sourceTraceHref: "/data-quality/review-cases",
      sourceTraceVersions: ["等待 API 恢复"],
      ownerLabel: "owner 不可用",
      evidenceLabel: "证据不可用",
      qualityFocus: "质量问题不可用",
      evidenceGap: error,
      nextAction: "先恢复复核案例读取，再查看来源结果和证据缺口。",
      detailHref: "/data-quality/review-cases",
      listHref: "/data-quality/review-cases",
      evidence: ["读取失败"],
    }
  }

  if (!detail) {
    return {
      tone: "empty",
      title: "等待复核案例",
      sourceLabel: "来源未选择",
      sourceResultDimensions: ["等待案例"],
      sourceResultMetrics: ["等待来源结果"],
      sourceTraceRun: "等待来源链路",
      sourceTraceHref: "/data-quality/review-cases",
      sourceTraceVersions: ["等待案例"],
      ownerLabel: "owner 未选择",
      evidenceLabel: "证据未选择",
      qualityFocus: "等待案例详情",
      evidenceGap: "还没有可展示的复核案例详情。",
      nextAction: "先从复核案例工作台选择一个案例。",
      detailHref: "/data-quality/review-cases",
      listHref: "/data-quality/review-cases",
      evidence: ["等待案例"],
    }
  }

  const reviewCase = detail.case
  const isClosed = reviewCase.status === "closed" || detail.closure !== null
  const evidenceCount = detail.evidence.length
  const conclusionCount = detail.conclusions.length
  const sourceLabel = formatReviewCaseDetailSource(reviewCase)
  const sourceResultSummary = summarizeReviewCaseSourceResult(
    reviewCase,
    detail.source_result ?? null
  )
  const sourceTraceSummary = summarizeReviewCaseSourceTrace(detail.source_trace ?? null)
  const listHref = buildImportReviewCasesWorkspaceHref({
    businessDate: reviewCase.business_date,
    ownerId: reviewCase.owner_id,
    status: reviewCase.status,
    severity: reviewCase.severity,
    sourceResultType: reviewCase.source_result_type,
  })

  return {
    tone: isClosed
      ? "ready"
      : isHighRiskReviewSeverity(reviewCase.severity)
        ? "blocked"
        : "warning",
    title: `${reviewCase.case_id} · ${formatReviewCaseSeverity(reviewCase.severity)} · ${formatReviewCaseStatus(reviewCase.status)}`,
    sourceLabel,
    sourceResultDimensions: sourceResultSummary.dimensions,
    sourceResultMetrics: sourceResultSummary.metrics,
    sourceTraceRun: sourceTraceSummary.run,
    sourceTraceHref: sourceTraceSummary.href,
    sourceTraceVersions: sourceTraceSummary.versions,
    ownerLabel: reviewCase.owner_id,
    evidenceLabel: `证据 ${evidenceCount.toLocaleString("zh-CN")} 条 · 结论 ${conclusionCount.toLocaleString("zh-CN")} 条 · ${isClosed ? "已关闭" : "未关闭"}`,
    qualityFocus: formatReviewCaseQualityFocus(reviewCase),
    evidenceGap: formatReviewCaseDetailEvidenceGap(reviewCase, isClosed),
    nextAction: formatReviewCaseDetailNextAction({
      reviewCase,
      evidenceCount,
      conclusionCount,
      isClosed,
    }),
    detailHref: buildImportReviewCaseDetailApiUrl(reviewCase.case_id),
    listHref,
    evidence: [
      `业务日 ${reviewCase.business_date}`,
      `来源 ${sourceLabel}`,
      detail.evidence[0]
        ? `证据 ${detail.evidence[0].evidence_id} · ${detail.evidence[0].evidence_type} · ${detail.evidence[0].submitted_by}`
        : "证据 0 条",
      detail.conclusions[0]
        ? `结论 ${detail.conclusions[0].conclusion_id} · ${detail.conclusions[0].risk_level} · ${detail.conclusions[0].decided_by}`
        : "结论 0 条",
    ],
  }
}

export function summarizeImportReviewCaseEvidenceChain({
  detail,
  error,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}): ImportReviewCaseEvidenceChainSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "证据链路读取失败",
      statusLabel: "读取失败",
      summary: error,
      nextAction: "先恢复复核案例读取，再查看证据、结论和关闭记录。",
      items: [],
    }
  }

  if (!detail) {
    return {
      tone: "empty",
      title: "证据与结论链路",
      statusLabel: "等待案例",
      summary: "证据 0 条 · 结论 0 条 · 未关闭",
      nextAction: "先从复核案例工作台选择一个案例。",
      items: [],
    }
  }

  const isClosed = detail.case.status === "closed" || detail.closure !== null
  const evidenceCount = detail.evidence.length
  const conclusionCount = detail.conclusions.length
  const items = [
    ...detail.evidence.map((item) => ({
      id: item.evidence_id,
      typeLabel: "证据",
      title: `${item.evidence_type} · ${item.submitted_by}`,
      detail: item.note ?? item.evidence_uri,
      timestamp: item.submitted_at,
    })),
    ...detail.conclusions.map((item) => ({
      id: item.conclusion_id,
      typeLabel: "结论",
      title: `${item.conclusion_type} · ${item.risk_level} · ${item.decided_by}`,
      detail: item.conclusion_text,
      timestamp: item.decided_at,
    })),
    ...(detail.closure
      ? [
          {
            id: detail.closure.closure_id,
            typeLabel: "关闭",
            title: `${detail.closure.closure_status} · ${detail.closure.closed_by}`,
            detail: detail.closure.closure_note ?? "无关闭备注",
            timestamp: detail.closure.closed_at,
          },
        ]
      : []),
  ].sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  return {
    tone: isClosed ? "ready" : evidenceCount > 0 && conclusionCount > 0 ? "warning" : "blocked",
    title: "证据与结论链路",
    statusLabel: isClosed ? formatReviewCaseStatus("closed") : formatReviewCaseStatus(detail.case.status),
    summary: `证据 ${evidenceCount.toLocaleString("zh-CN")} 条 · 结论 ${conclusionCount.toLocaleString("zh-CN")} 条 · ${isClosed ? "已关闭" : "未关闭"}`,
    nextAction: isClosed
      ? "已形成关闭记录，继续回看证据和结论是否完整。"
      : evidenceCount > 0 && conclusionCount > 0
        ? "先复核证据和结论内容，再进入受控关闭流程。"
        : "当前链路材料不足，先补齐证据和结论后再判断能否关闭。",
    items,
  }
}

export function summarizeImportReviewCaseProcessingTimeline({
  detail,
  error,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}): ImportReviewCaseProcessingTimelineSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "处理时间线",
      statusLabel: "读取失败",
      currentStage: "等待读取",
      summary: error,
      nextAction: "先恢复复核案例读取，再查看处理动作、证据、结论和关闭记录。",
      items: [],
    }
  }

  if (!detail) {
    return {
      tone: "empty",
      title: "处理时间线",
      statusLabel: "等待案例",
      currentStage: "等待选择",
      summary: "暂无处理动作",
      nextAction: "先从复核案例工作台选择一个案例。",
      items: [],
    }
  }

  const items = [
    ...detail.evidence.map((item) => ({
      id: item.evidence_id,
      stage: "补充证据",
      actor: item.submitted_by,
      timestamp: item.submitted_at,
      title: item.evidence_type,
      detail: item.note ?? item.evidence_uri,
      sourceLabel: "证据",
    })),
    ...detail.conclusions.map((item) => ({
      id: item.conclusion_id,
      stage: "补充结论",
      actor: item.decided_by,
      timestamp: item.decided_at,
      title: `${item.conclusion_type} · ${item.risk_level}`,
      detail: item.conclusion_text,
      sourceLabel: "结论",
    })),
    ...(detail.closure
      ? [
          {
            id: detail.closure.closure_id,
            stage: "关闭案例",
            actor: detail.closure.closed_by,
            timestamp: detail.closure.closed_at,
            title: detail.closure.closure_status,
            detail: detail.closure.closure_note ?? "无关闭备注",
            sourceLabel: "关闭",
          },
        ]
      : []),
  ].sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  const isClosed = detail.case.status === "closed" || detail.closure !== null
  const hasEvidence = detail.evidence.length > 0
  const hasConclusion = detail.conclusions.length > 0
  const latestTimestamp = items.at(-1)?.timestamp

  if (items.length === 0) {
    return {
      tone: "warning",
      title: "处理时间线",
      statusLabel: "未开始",
      currentStage: "等待证据",
      summary: "暂无处理动作",
      nextAction: "先补充证据，再补充复核结论；关闭入口需要证据和结论齐全。",
      items,
    }
  }

  return {
    tone: isClosed ? "ready" : hasEvidence && hasConclusion ? "warning" : "blocked",
    title: "处理时间线",
    statusLabel: isClosed ? "已关闭" : hasEvidence && hasConclusion ? "待关闭" : "处理中",
    currentStage: isClosed ? "已关闭" : hasEvidence && hasConclusion ? "等待关闭" : "等待结论",
    summary: `${items.length.toLocaleString("zh-CN")} 个处理动作 · 最新动作 ${latestTimestamp ?? "无"}`,
    nextAction: isClosed
      ? "案例已关闭；后续只读追溯处理动作、证据和结论，不再补充写入。"
      : hasEvidence && hasConclusion
        ? "证据和结论已齐，继续复核后进入受控关闭入口。"
        : "已有证据但缺少结论；先补充复核结论，再判断是否关闭。",
    items,
  }
}

export function summarizeImportReviewCaseClosureAction({
  detail,
  error,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}): ImportReviewCaseClosureActionSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "关闭复核案例",
      canSubmit: false,
      statusLabel: "读取失败",
      actionLabel: "不可关闭",
      detail: "复核案例读取失败，不能提交关闭写入。",
      blockers: [error],
      apiHref: buildImportReviewCaseClosureWriteApiUrl(),
    }
  }

  if (!detail) {
    return {
      tone: "empty",
      title: "关闭复核案例",
      canSubmit: false,
      statusLabel: "等待案例",
      actionLabel: "不可关闭",
      detail: "先从复核案例工作台选择一个案例。",
      blockers: ["等待复核案例"],
      apiHref: buildImportReviewCaseClosureWriteApiUrl(),
    }
  }

  const blockers = [
    ...(detail.case.status === "closed" || detail.closure ? ["案例已关闭"] : []),
    ...(detail.evidence.length === 0 ? ["缺少证据"] : []),
    ...(detail.conclusions.length === 0 ? ["缺少复核结论"] : []),
  ]
  const canSubmit = blockers.length === 0

  return {
    tone: canSubmit ? "warning" : detail.closure ? "ready" : "blocked",
    title: "关闭复核案例",
    canSubmit,
    statusLabel: canSubmit ? "可关闭" : detail.closure ? "已关闭" : "不可关闭",
    actionLabel: canSubmit ? "关闭案例" : "不可关闭",
    detail: canSubmit
      ? `已有 ${detail.evidence.length.toLocaleString("zh-CN")} 条证据和 ${detail.conclusions.length.toLocaleString("zh-CN")} 条结论，可提交关闭写入。`
      : blockers.join("；"),
    blockers,
    apiHref: buildImportReviewCaseClosureWriteApiUrl(),
  }
}

export function summarizeImportReviewCaseEvidenceAction({
  detail,
  error,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}): ImportReviewCaseEvidenceActionSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "补充复核证据",
      canSubmit: false,
      statusLabel: "读取失败",
      actionLabel: "不可补充",
      detail: "复核案例读取失败，不能提交证据补录。",
      blockers: [error],
      apiHref: buildImportReviewEvidenceWriteApiUrl(""),
    }
  }

  if (!detail) {
    return {
      tone: "empty",
      title: "补充复核证据",
      canSubmit: false,
      statusLabel: "等待案例",
      actionLabel: "不可补充",
      detail: "先从复核案例工作台选择一个案例。",
      blockers: ["等待复核案例"],
      apiHref: buildImportReviewEvidenceWriteApiUrl(""),
    }
  }

  const blockers = [
    ...(detail.case.status === "closed" || detail.closure ? ["案例已关闭"] : []),
  ]
  const canSubmit = blockers.length === 0

  return {
    tone: canSubmit ? "warning" : "ready",
    title: "补充复核证据",
    canSubmit,
    statusLabel: canSubmit ? "可补充" : "已关闭",
    actionLabel: canSubmit ? "提交证据" : "不可补充",
    detail: canSubmit
      ? "当前案例未关闭，可补充一条证据记录。"
      : blockers.join("；"),
    blockers,
    apiHref: buildImportReviewEvidenceWriteApiUrl(detail.case.case_id),
  }
}

export function summarizeImportReviewCaseConclusionAction({
  detail,
  error,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}): ImportReviewCaseConclusionActionSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "补充复核结论",
      canSubmit: false,
      statusLabel: "读取失败",
      actionLabel: "不可补充",
      detail: "复核案例读取失败，不能提交结论补充。",
      blockers: [error],
      apiHref: buildImportReviewConclusionWriteApiUrl(""),
    }
  }

  if (!detail) {
    return {
      tone: "empty",
      title: "补充复核结论",
      canSubmit: false,
      statusLabel: "等待案例",
      actionLabel: "不可补充",
      detail: "先从复核案例工作台选择一个案例。",
      blockers: ["等待复核案例"],
      apiHref: buildImportReviewConclusionWriteApiUrl(""),
    }
  }

  const blockers = [
    ...(detail.case.status === "closed" || detail.closure ? ["案例已关闭"] : []),
  ]
  const canSubmit = blockers.length === 0

  return {
    tone: canSubmit ? "warning" : "ready",
    title: "补充复核结论",
    canSubmit,
    statusLabel: canSubmit ? "可补充" : "已关闭",
    actionLabel: canSubmit ? "提交结论" : "不可补充",
    detail: canSubmit
      ? "当前案例未关闭，可补充一条复核结论。"
      : blockers.join("；"),
    blockers,
    apiHref: buildImportReviewConclusionWriteApiUrl(detail.case.case_id),
  }
}

export function buildImportReviewEvidenceWritePayload({
  detail,
  evidenceType,
  evidenceUri,
  submittedBy,
  note,
}: {
  detail: ImportReviewCaseDetailResponse
  evidenceType: string
  evidenceUri: string
  submittedBy: string
  note: string
}): ImportReviewEvidenceWritePayload {
  const nextNumber = String(detail.evidence.length + 1).padStart(3, "0")

  return {
    evidence_id: `EVD-${detail.case.case_id}-${nextNumber}`,
    case_id: detail.case.case_id,
    evidence_type: evidenceType,
    evidence_uri: evidenceUri,
    submitted_by: submittedBy,
    note: note.trim() ? note.trim() : null,
  }
}

export function buildImportReviewConclusionWritePayload({
  detail,
  conclusionType,
  riskLevel,
  conclusionText,
  decidedBy,
}: {
  detail: ImportReviewCaseDetailResponse
  conclusionType: string
  riskLevel: string
  conclusionText: string
  decidedBy: string
}): ImportReviewConclusionWritePayload {
  const nextNumber = String(detail.conclusions.length + 1).padStart(3, "0")

  return {
    conclusion_id: `CON-${detail.case.case_id}-${nextNumber}`,
    case_id: detail.case.case_id,
    conclusion_type: conclusionType,
    risk_level: riskLevel,
    conclusion_text: conclusionText.trim(),
    decided_by: decidedBy,
  }
}

export function buildImportReviewCaseClosureWritePayload({
  detail,
  closedBy,
  closureNote,
}: {
  detail: ImportReviewCaseDetailResponse
  closedBy: string
  closureNote: string
}): ImportReviewCaseClosureWritePayload {
  return {
    case: {
      case_id: detail.case.case_id,
      source_result_type: detail.case.source_result_type,
      source_result_id: detail.case.source_result_id,
      business_date: detail.case.business_date,
      owner_id: detail.case.owner_id,
      severity: detail.case.severity,
      status: detail.case.status,
    },
    evidence: detail.evidence.map((item) => ({
      evidence_id: item.evidence_id,
      case_id: item.case_id,
      evidence_type: item.evidence_type,
      evidence_uri: item.evidence_uri,
      submitted_by: item.submitted_by,
      note: item.note,
    })),
    conclusions: detail.conclusions.map((item) => ({
      conclusion_id: item.conclusion_id,
      case_id: item.case_id,
      conclusion_type: item.conclusion_type,
      risk_level: item.risk_level,
      conclusion_text: item.conclusion_text,
      decided_by: item.decided_by,
    })),
    closure: {
      closure_id: `CLO-${detail.case.case_id}`,
      case_id: detail.case.case_id,
      closure_status: "closed",
      closed_by: closedBy,
      closure_note: closureNote.trim() ? closureNote.trim() : null,
    },
  }
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

export function summarizeImportDownstreamResultDrilldown({
  batch,
  readiness,
  businessDate,
  comparisonRuns,
  reviewCases,
  comparisonError,
  reviewError,
}: {
  batch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  businessDate: string | null
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
  comparisonError: string | null
  reviewError: string | null
}): ImportDownstreamResultDrilldown {
  const versionLabel = batch?.import_version_id ?? readiness?.import_version_id ?? "未生成"
  const completedComparisonRuns = comparisonRuns.filter(
    (run) => run.status === "completed"
  )
  const openReviewCases = reviewCases.filter((reviewCase) => reviewCase.status !== "closed")
  const primaryComparisonRun =
    completedComparisonRuns[0] ?? comparisonRuns[0] ?? null
  const primaryReviewCase = openReviewCases[0] ?? reviewCases[0] ?? null

  if (comparisonError || reviewError) {
    return {
      tone: "blocked",
      title: "下游结果读取受阻",
      detail: "当前业务日的对比结果或复核案例读取失败，不能把它判断为无下游结果。",
      nextAction: "先确认结果查询 API，再回到批次应用状态和业务日范围判断。",
      comparisonFocus: comparisonError ? "对比结果读取失败" : formatDrilldownComparisonFocus(primaryComparisonRun),
      reviewFocus: reviewError ? "复核案例读取失败" : formatDrilldownReviewFocus(primaryReviewCase),
      primaryActionLabel: "查看对比结果 API",
      primaryHref: businessDate
        ? buildImportComparisonRunsUrl(businessDate)
        : buildImportApiUrl("/api/v1/comparison-runs"),
      secondaryActionLabel: "查看复核案例 API",
      secondaryHref: businessDate
        ? buildImportReviewCasesUrl(businessDate)
        : buildImportApiUrl("/api/v1/review-cases"),
      evidence: [
        `业务日 ${businessDate ?? "未确认"}`,
        comparisonError ? "对比结果读取失败" : `对比结果 ${comparisonRuns.length.toLocaleString("zh-CN")} 个`,
        reviewError ? "复核案例读取失败" : `复核案例 ${reviewCases.length.toLocaleString("zh-CN")} 个`,
        `版本 ${versionLabel}`,
      ],
    }
  }

  if (!batch || !businessDate) {
    return {
      tone: "empty",
      title: "等待批次业务日",
      detail: "还没有可用于追踪下游结果的批次业务日，无法定位对比结果和复核案例。",
      nextAction: "先返回批次列表选择有效批次，再进入结果追踪。",
      comparisonFocus: "等待批次业务日",
      reviewFocus: "等待批次业务日",
      primaryActionLabel: "返回批次列表",
      primaryHref: "/data-quality",
      secondaryActionLabel: "查看批次明细",
      secondaryHref: "#import-batch-detail",
      evidence: ["业务日 未确认", `版本 ${versionLabel}`],
    }
  }

  if (
    batch.application_status !== "applied" ||
    readiness?.readiness_status === "blocked"
  ) {
    const failedRows = readiness?.failed_rows ?? batch.failed_rows
    return {
      tone: "blocked",
      title: "先处理导入阻塞",
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响后续对比与复核判断。",
      nextAction: "先完成失败行修正和应用准备度检查，再判断下游结果。",
      comparisonFocus: "等待应用版本",
      reviewFocus: failedRows > 0 ? "等待质量问题清理" : "等待对比结果",
      primaryActionLabel: failedRows > 0 ? "处理失败行" : "查看应用准备度",
      primaryHref: failedRows > 0 ? "#import-row-correction" : "#import-apply-readiness",
      secondaryActionLabel: "查看应用准备度",
      secondaryHref: "#import-apply-readiness",
      evidence: [
        `应用状态 ${formatImportApplicationStatus(batch.application_status)}`,
        `失败 ${failedRows.toLocaleString("zh-CN")} 行`,
        `准备度 ${readiness ? formatDrilldownReadinessStatus(readiness.readiness_status) : "未返回"}`,
        `业务日 ${businessDate}`,
      ],
    }
  }

  if (comparisonRuns.length === 0 && reviewCases.length === 0) {
    return {
      tone: "empty",
      title: "等待下游结果生成",
      detail: `当前批次已应用，但业务日 ${businessDate} 还没有查询到对比结果或复核案例。`,
      nextAction: "确认对比计算是否已触发；若尚未触发，不要把当前批次判断为已形成闭环。",
      comparisonFocus: "暂无对比运行",
      reviewFocus: "暂无复核案例",
      primaryActionLabel: "查看对比结果 API",
      primaryHref: buildImportComparisonRunsUrl(businessDate),
      secondaryActionLabel: "查看复核案例 API",
      secondaryHref: buildImportReviewCasesUrl(businessDate),
      evidence: [
        `应用状态 ${formatImportApplicationStatus(batch.application_status)}`,
        `已应用 ${batch.applied_record_count.toLocaleString("zh-CN")} 条`,
        `版本 ${versionLabel}`,
        `业务日 ${businessDate}`,
      ],
    }
  }

  const hasOpenReviewCases = openReviewCases.length > 0
  return {
    tone: "ready",
    title: "下游闭环已有结果",
    detail: `当前批次已应用，并且业务日 ${businessDate} 已有对比结果或复核案例；${hasOpenReviewCases ? "优先处理未关闭复核案例。" : "先确认对比结果是否需要生成复核案例。"}`,
    nextAction: hasOpenReviewCases
      ? "先查看未关闭复核案例，再回看关联对比运行和来源版本。"
      : "先查看已完成对比运行，再判断是否需要进入复核。",
    comparisonFocus: formatDrilldownComparisonFocus(primaryComparisonRun),
    reviewFocus: formatDrilldownReviewFocus(primaryReviewCase),
    primaryActionLabel: hasOpenReviewCases ? "查看未关闭复核案例" : "查看对比运行",
    primaryHref:
      hasOpenReviewCases && primaryReviewCase
        ? buildImportApiUrl(
            `/api/v1/review-cases/${encodeURIComponent(primaryReviewCase.case_id)}`
          )
        : primaryComparisonRun
          ? buildImportApiUrl(
              `/api/v1/comparison-runs/${encodeURIComponent(primaryComparisonRun.run_id)}`
            )
          : buildImportComparisonRunsUrl(businessDate),
    secondaryActionLabel: hasOpenReviewCases ? "查看关联对比运行" : "查看复核案例",
    secondaryHref: primaryComparisonRun
      ? buildImportApiUrl(
          `/api/v1/comparison-runs/${encodeURIComponent(primaryComparisonRun.run_id)}`
        )
      : buildImportReviewCasesUrl(businessDate),
    evidence: [
      `应用状态 ${formatImportApplicationStatus(batch.application_status)}`,
      `对比结果 ${comparisonRuns.length.toLocaleString("zh-CN")} 个`,
      `复核未关闭 ${openReviewCases.length.toLocaleString("zh-CN")} 个`,
      `业务日 ${businessDate}`,
    ],
  }
}

function formatDrilldownComparisonFocus(run: ImportComparisonRunRecord | null): string {
  if (!run) {
    return "暂无对比运行"
  }

  return `${run.run_id} · ${formatComparisonRunType(run.comparison_type)} · ${formatComparisonRunStatus(run.status)} · ${run.total_results.toLocaleString("zh-CN")} 条结果`
}

function formatDrilldownReviewFocus(reviewCase: ImportReviewCaseRecord | null): string {
  if (!reviewCase) {
    return "暂无复核案例"
  }

  return `${reviewCase.case_id} · ${reviewCase.severity} · ${formatReviewCaseStatus(reviewCase.status)} · ${reviewCase.owner_id}`
}

function formatComparisonRunType(
  type: ImportComparisonRunRecord["comparison_type"]
): string {
  if (type === "forecast_vs_schedule") {
    return "预测 vs 排班"
  }

  return "排班 vs 实际"
}

function formatComparisonRunStatus(status: ImportComparisonRunRecord["status"]): string {
  if (status === "completed") {
    return "完成"
  }

  return "失败"
}

function formatReviewCaseStatus(status: string): string {
  if (status === "closed") {
    return "已关闭"
  }

  if (status === "open") {
    return "未关闭"
  }

  return status
}

function formatDrilldownReadinessStatus(status: ImportReadinessStatus): string {
  if (status === "blocked") {
    return "阻塞"
  }

  return "可应用"
}

export function summarizeImportPageHierarchy(params: {
  selectedBatch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  hasBatchDetail: boolean
  hasUploadTools: boolean
  hasResultTrace?: boolean
}): ImportPageHierarchy {
  const { selectedBatch } = params
  const defaultDetailTab: ImportPageHierarchyDetailTab = "status-check"

  return {
    primaryRegion: "接入批次工作台",
    inspectorRegion: selectedBatch ? "状态检查" : "等待选择批次",
    detailTabs: ["状态检查", "失败行修正", "批次明细", "结果追踪", "导入与模板"],
    defaultDetailTab,
    utilityPlacement: "导入与模板收纳到批次处理工作区",
    layoutIntent: "先看处理总览，再进入全宽批次处理工作区。",
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

export function summarizeImportQualityImpactAggregation({
  detail,
  comparisonRuns,
  reviewCases,
  comparisonError,
  reviewError,
  businessDate,
}: {
  detail: ImportBatchPersistenceDetail | null
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
  comparisonError: string | null
  reviewError: string | null
  businessDate?: string | null
}): ImportQualityImpactAggregation {
  const openReviewCases = reviewCases.filter((reviewCase) => reviewCase.status !== "closed")
    .length
  const comparisonResults = comparisonRuns.reduce(
    (total, run) => total + run.total_results,
    0
  )
  const downstreamLabel = formatQualityImpactDownstreamLabel({
    reviewCaseCount: reviewCases.length,
    openReviewCases,
    comparisonResults,
    comparisonError,
    reviewError,
  })

  if (!detail) {
    return {
      tone: "empty",
      title: "等待批次明细",
      detail: "还没有可聚合的行级质量结果。",
      downstreamLabel,
      topIssueLabel: "暂无质量问题",
      nextAction: "先确认批次明细是否读取成功，再查看质量影响聚合。",
      groups: [],
    }
  }

  const issueRows = detail.rows.filter(
    (row) => row.row_status === "failed" || row.row_status === "warning"
  )

  if (issueRows.length === 0) {
    return {
      tone: "ready",
      title: "暂无行级质量问题",
      detail: "当前批次没有失败行或警告行，可直接回看下游对比结果和复核案例。",
      downstreamLabel,
      topIssueLabel: "暂无质量问题",
      nextAction: "继续查看下游结果判断，不需要从质量问题反向处理。",
      groups: [],
    }
  }

  const groups = Array.from(
    issueRows
      .reduce((map, row) => {
        const field = row.error_field?.trim() || "未返回字段"
        const code = row.error_code?.trim() || "未返回原因"
        const key = `${field}::${code}`
        const title = `${field} · ${code}`
        const reviewCasesSourceType = inferQualityIssueReviewCaseSourceType({
          reviewCases,
          comparisonRuns,
        })
        const existing =
          map.get(key) ??
          ({
            key,
            title,
            rowCount: 0,
            failedRows: 0,
            warningRows: 0,
            affectedReviewCases: reviewCases.length,
            openReviewCases,
            comparisonResults,
            impactLabel: "",
            reviewCasesHref: buildImportQualityIssueReviewCasesHref({
              businessDate:
                businessDate ??
                reviewCases[0]?.business_date ??
                detail.batch.business_date_from,
              sourceResultType: reviewCasesSourceType,
              issueTitle: title,
            }),
            reviewCasesActionLabel: "查看相关复核案例",
            reviewCasesFocus: title,
            evidence: [],
            nextAction: `先修正 ${field} 的 ${code}，再回看未关闭复核案例。`,
          } satisfies ImportQualityImpactIssueGroup)

        existing.rowCount += 1
        existing.failedRows += row.row_status === "failed" ? 1 : 0
        existing.warningRows += row.row_status === "warning" ? 1 : 0
        existing.evidence = appendQualityImpactEvidence(existing.evidence, row)
        existing.impactLabel = `${existing.rowCount.toLocaleString("zh-CN")} 行问题 · ${reviewCases.length.toLocaleString("zh-CN")} 个复核案例 · ${comparisonResults.toLocaleString("zh-CN")} 条对比结果`
        map.set(key, existing)
        return map
      }, new Map<string, ImportQualityImpactIssueGroup>())
      .values()
  ).sort(
    (current, next) =>
      next.rowCount - current.rowCount ||
      next.failedRows - current.failedRows ||
      current.title.localeCompare(next.title)
  )
  const hasFailedRows = issueRows.some((row) => row.row_status === "failed")

  return {
    tone: comparisonError || reviewError ? "warning" : hasFailedRows ? "blocked" : "warning",
    title: "质量问题正在影响下游判断",
    detail: `当前批次有 ${issueRows.length.toLocaleString("zh-CN")} 行质量问题，当前业务日已有 ${reviewCases.length.toLocaleString("zh-CN")} 个复核案例、${comparisonResults.toLocaleString("zh-CN")} 条对比结果；先处理影响候选最高的问题组。`,
    downstreamLabel,
    topIssueLabel: groups[0]?.title ?? "暂无质量问题",
    nextAction: "先处理质量问题行数最多的问题组，再回看未关闭复核案例和对比结果。",
    groups,
  }
}

export function summarizeImportReviewConclusionPreview({
  businessDate,
  comparisonRuns,
  reviewCases,
  qualityImpact,
  comparisonError,
  reviewError,
}: {
  businessDate: string | null
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
  qualityImpact: ImportQualityImpactAggregation
  comparisonError: string | null
  reviewError: string | null
}): ImportReviewConclusionPreview {
  const openReviewCases = reviewCases.filter((reviewCase) => reviewCase.status !== "closed")
  const comparisonResults = comparisonRuns.reduce(
    (total, run) => total + run.total_results,
    0
  )
  const primaryReviewCase = openReviewCases[0] ?? reviewCases[0] ?? null
  const primaryComparisonRun =
    comparisonRuns.find((run) => run.status === "completed") ?? comparisonRuns[0] ?? null
  const evidence = [
    `业务日 ${businessDate ?? "未选择"}`,
    reviewError ? "复核读取失败" : `复核案例 ${reviewCases.length.toLocaleString("zh-CN")} 个`,
    reviewError ? `复核案例 ${reviewCases.length.toLocaleString("zh-CN")} 个` : `未关闭 ${openReviewCases.length.toLocaleString("zh-CN")} 个`,
    comparisonError ? "对比读取失败" : `对比结果 ${comparisonResults.toLocaleString("zh-CN")} 条`,
  ]

  if (comparisonError || reviewError) {
    return {
      tone: "blocked",
      title: "暂不能生成结论预览",
      suggestedConclusion: `${reviewError ? "复核案例读取失败" : "对比结果读取失败"}，当前结论预览只能作为占位，不能用于关闭判断。`,
      evidenceSummary: formatReviewConclusionEvidenceSummary({
        primaryComparisonRun,
        primaryReviewCase,
        qualityImpact,
        comparisonError,
        reviewError,
      }),
      residualRisk: "下游结果读取不完整，可能漏掉未关闭异常或证据缺口。",
      nextAction: "先恢复下游结果读取，再生成复核结论预览。",
      evidence,
    }
  }

  if (reviewCases.length === 0 && comparisonRuns.length === 0) {
    return {
      tone: "empty",
      title: "等待复核结果",
      suggestedConclusion: "当前业务日还没有复核案例或对比结果，暂不形成结论预览。",
      evidenceSummary: formatReviewConclusionEvidenceSummary({
        primaryComparisonRun,
        primaryReviewCase,
        qualityImpact,
        comparisonError,
        reviewError,
      }),
      residualRisk: "下游结果尚未生成，无法判断是否存在需要主管处理的异常。",
      nextAction: "先确认对比计算和复核案例是否已生成，再查看结论预览。",
      evidence,
    }
  }

  const qualityIssueRows = qualityImpact.groups.reduce(
    (total, group) => total + group.rowCount,
    0
  )

  if (openReviewCases.length > 0) {
    return {
      tone: "blocked",
      title: "建议暂缓关闭复核",
      suggestedConclusion: `当前有 ${openReviewCases.length.toLocaleString("zh-CN")} 个未关闭复核案例，且首要质量问题为 ${qualityImpact.topIssueLabel}；建议先补齐证据后再关闭。`,
      evidenceSummary: formatReviewConclusionEvidenceSummary({
        primaryComparisonRun,
        primaryReviewCase,
        qualityImpact,
        comparisonError,
        reviewError,
      }),
      residualRisk:
        qualityIssueRows > 0
          ? `仍有 ${openReviewCases.length.toLocaleString("zh-CN")} 个未关闭复核案例和 ${qualityIssueRows.toLocaleString("zh-CN")} 行质量问题；直接关闭会留下证据缺口。`
          : `仍有 ${openReviewCases.length.toLocaleString("zh-CN")} 个未关闭复核案例；直接关闭会留下处理缺口。`,
      nextAction: "先处理首要质量问题和未关闭复核案例，确认补证后再进入受控关闭流程。",
      evidence,
    }
  }

  if (qualityIssueRows > 0) {
    return {
      tone: "warning",
      title: "建议复核后再关闭",
      suggestedConclusion: `复核案例均已关闭，但仍有 ${qualityIssueRows.toLocaleString("zh-CN")} 行质量问题；建议先确认质量问题不影响结论。`,
      evidenceSummary: formatReviewConclusionEvidenceSummary({
        primaryComparisonRun,
        primaryReviewCase,
        qualityImpact,
        comparisonError,
        reviewError,
      }),
      residualRisk: "质量问题仍可能影响异常归因或证据完整性。",
      nextAction: "复核质量问题证据后，再进入受控关闭流程。",
      evidence,
    }
  }

  return {
    tone: "ready",
    title: "可作为关闭前摘要",
    suggestedConclusion: "当前未发现未关闭复核案例或行级质量问题，可作为后续受控关闭前的只读摘要。",
    evidenceSummary: formatReviewConclusionEvidenceSummary({
      primaryComparisonRun,
      primaryReviewCase,
      qualityImpact,
      comparisonError,
      reviewError,
    }),
    residualRisk: "仍需在正式关闭写入前确认业务证据和责任人意见。",
    nextAction: "后续关闭写入、审批或批量处理必须进入单独受控任务。",
    evidence,
  }
}

export function summarizeImportReviewEvidenceGapDrilldown({
  businessDate,
  comparisonRuns,
  reviewCases,
  qualityImpact,
  comparisonError,
  reviewError,
}: {
  businessDate: string | null
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
  qualityImpact: ImportQualityImpactAggregation
  comparisonError: string | null
  reviewError: string | null
}): ImportReviewEvidenceGapDrilldown {
  if (reviewError || comparisonError) {
    return {
      tone: "blocked",
      title: "暂不能判断证据缺口",
      summary: `${reviewError ? "复核案例读取失败" : "对比结果读取失败"}，当前缺口列表只能作为占位。`,
      ownerSummary: "owner 暂不可用",
      nextAction: reviewError
        ? "先恢复复核案例读取，再判断证据缺口。"
        : "先恢复对比结果读取，再判断证据缺口。",
      gaps: [],
    }
  }

  const openReviewCases = reviewCases.filter((reviewCase) => reviewCase.status !== "closed")

  if (openReviewCases.length === 0) {
    return {
      tone: "empty",
      title: "暂无证据缺口",
      summary: "当前业务日没有未关闭复核案例，暂不形成证据缺口列表。",
      ownerSummary: "owner 无",
      nextAction: "继续查看对比结果和复核结论预览。",
      gaps: [],
    }
  }

  const qualityIssueRows = qualityImpact.groups.reduce(
    (total, group) => total + group.rowCount,
    0
  )
  const primaryQualityIssue = qualityImpact.topIssueLabel || "暂无质量问题"
  const primaryComparisonRun =
    comparisonRuns.find((run) => run.status === "completed") ?? comparisonRuns[0] ?? null
  const relatedComparison = primaryComparisonRun
    ? `${primaryComparisonRun.run_id} · ${formatComparisonRunType(primaryComparisonRun.comparison_type)} · ${primaryComparisonRun.total_results.toLocaleString("zh-CN")} 条结果`
    : "暂无对比结果"
  const comparisonResults = primaryComparisonRun?.total_results ?? 0
  const gaps = openReviewCases
    .map((reviewCase) =>
      buildReviewEvidenceGapItem({
        reviewCase,
        businessDate,
        qualityIssueRows,
        primaryQualityIssue,
        relatedComparison,
        comparisonResults,
      })
    )
    .sort(
      (current, next) =>
        reviewEvidenceGapRank(next) - reviewEvidenceGapRank(current) ||
        current.key.localeCompare(next.key)
    )
  const ownerSummary = `owner ${Array.from(
    new Set(gaps.map((gap) => gap.ownerId))
  ).join("、")}`

  return {
    tone: gaps.some((gap) => gap.riskTone === "blocked") ? "blocked" : "warning",
    title: "证据缺口需要先处理",
    summary: `当前 ${openReviewCases.length.toLocaleString("zh-CN")} 个未关闭复核案例需要补齐证据；首要缺口为 ${gaps[0]?.key ?? "暂无"}，关联 ${primaryQualityIssue}。`,
    ownerSummary,
    nextAction: "先按高风险缺口补齐证据，再回看复核结论预览。",
    gaps,
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

export function summarizeImportReadinessIssueGroups(
  readiness: ImportApplyReadinessResponse | null,
  readinessError?: string | null
): ImportReadinessIssueGroup[] {
  if (readinessError || !readiness) {
    return [
      {
        key: "unknown",
        tone: "unknown",
        title: "准备度暂不可判断",
        count: 1,
        detail: readinessError ?? "未返回准备度结果。",
        nextAction: "先确认本地 API 状态；准备度未知时不要执行应用写入。",
        evidence: readinessError ? [readinessError] : ["无 readiness 结果"],
      },
    ]
  }

  if (readiness.application_status === "applied") {
    return [
      {
        key: "application",
        tone: "done",
        title: "批次已应用",
        count: readiness.applied_record_count,
        detail: `当前批次已写入 ${readiness.applied_record_count.toLocaleString("zh-CN")} 条记录。`,
        nextAction: "查看下游结果和复核线索，不需要重复应用。",
        evidence: [
          `目标 ${readiness.application_target}`,
          `版本 ${readiness.import_version_id ?? "未生成"}`,
        ],
      },
    ]
  }

  const groups: ImportReadinessIssueGroup[] = []

  if (readiness.failed_rows > 0) {
    groups.push({
      key: "failed_rows",
      tone: "blocked",
      title: "失败行阻塞",
      count: readiness.failed_rows,
      detail: `当前批次还有 ${readiness.failed_rows.toLocaleString("zh-CN")} 行失败，应用写入前必须先修正。`,
      nextAction: "先进入失败行修正，补齐标准字段并重新检查准备度。",
      evidence: [
        `失败 ${readiness.failed_rows.toLocaleString("zh-CN")} 行`,
        `成功 ${readiness.success_rows.toLocaleString("zh-CN")} 行`,
        `警告 ${readiness.warning_rows.toLocaleString("zh-CN")} 行`,
      ],
    })
  }

  if (readiness.row_blockers.length > 0) {
    const firstBlocker = readiness.row_blockers[0]
    const fieldLabel = firstBlocker.field_name ? ` ${firstBlocker.field_name}` : ""

    groups.push({
      key: "row_required_fields",
      tone: "blocked",
      title: "行级必填字段缺口",
      count: readiness.row_blockers.length,
      detail: `${readiness.row_blockers.length.toLocaleString("zh-CN")} 个行级阻塞正在影响应用准备度。`,
      nextAction: `优先处理第 ${firstBlocker.row_number} 行${fieldLabel}；补齐后重新查看准备度。`,
      evidence: readiness.row_blockers
        .slice(0, 4)
        .map((blocker) =>
          blocker.field_name
            ? `第 ${blocker.row_number} 行 ${blocker.field_name}`
            : `第 ${blocker.row_number} 行`
        ),
    })
  }

  if (readiness.version_count === 0 || !readiness.import_version_id) {
    groups.push({
      key: "version",
      tone: "blocked",
      title: "导入版本缺口",
      count: 1,
      detail: "当前批次还没有可追溯导入版本。",
      nextAction: "检查上传解析结果和版本生成记录，确认版本存在后再进入应用前复核。",
      evidence: [
        `版本 ${readiness.version_count.toLocaleString("zh-CN")}`,
        `导入版本 ${readiness.import_version_id ?? "未生成"}`,
      ],
    })
  }

  const batchBlockers = readiness.blockers.filter(
    (blocker) => blocker.code !== "IMPORT_BATCH_ALREADY_APPLIED"
  )
  if (batchBlockers.length > 0) {
    groups.push({
      key: "batch_blockers",
      tone: "blocked",
      title: "批次级阻塞",
      count: batchBlockers.length,
      detail: `${batchBlockers.length.toLocaleString("zh-CN")} 个批次级阻塞仍需处理。`,
      nextAction: "按阻塞码处理批次问题后重新检查准备度。",
      evidence: batchBlockers.map((blocker) => blocker.code),
    })
  }

  if (groups.length === 0) {
    return [
      {
        key: "ready",
        tone: "ready",
        title: "准备度已通过",
        count: 0,
        detail: "当前批次没有应用前阻塞，已生成可追溯导入版本。",
        nextAction: "继续复核应用目标和下游结果；真正应用写入仍需单独受控入口。",
        evidence: [
          `成功 ${readiness.success_rows.toLocaleString("zh-CN")} 行`,
          `版本 ${readiness.import_version_id ?? "未生成"}`,
        ],
      },
    ]
  }

  return groups
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

export function summarizeImportTemplateFitDetail(
  fileType: ImportFileType,
  templates: ImportFieldMappingTemplate[],
  templateError?: string | null
): ImportTemplateFitDetail {
  const recommendedFields = recommendedImportStandardFields[fileType]

  if (templateError) {
    return {
      fileType,
      status: "error",
      matchingTemplates: 0,
      activeMatchingTemplates: 0,
      inactiveMatchingTemplates: 0,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      recommendedMappedFieldCount: 0,
      mappedStandardFields: [],
      missingStandardFields: recommendedFields,
      templateOptions: [],
      title: "字段映射模板读取失败",
      detail: `字段映射模板读取失败：${templateError}`,
      nextAction: "保留手填字段映射 JSON 上传，或稍后重试模板读取。",
    }
  }

  const matchingTemplates = templates.filter((template) => template.file_type === fileType)
  const templateOptions = matchingTemplates
    .map((template) => buildImportTemplateFitOption(template, recommendedFields))
    .sort(compareImportTemplateFitOptions)
  const activeOptions = templateOptions.filter((template) => template.isActive)
  const recommendedTemplate = activeOptions[0] ?? null

  if (!recommendedTemplate) {
    return {
      fileType,
      status: "missing",
      matchingTemplates: matchingTemplates.length,
      activeMatchingTemplates: 0,
      inactiveMatchingTemplates: templateOptions.length,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      recommendedMappedFieldCount: 0,
      mappedStandardFields: [],
      missingStandardFields: recommendedFields,
      templateOptions,
      title: `暂无启用${formatImportFileType(fileType)}模板`,
      detail: `当前${formatImportFileType(fileType)}没有启用模板；上传前需要手填字段映射 JSON。`,
      nextAction: "先使用手填字段映射 JSON；模板新增或维护留到单独受控任务。",
    }
  }

  return {
    fileType,
    status: "matched",
    matchingTemplates: matchingTemplates.length,
    activeMatchingTemplates: activeOptions.length,
    inactiveMatchingTemplates: templateOptions.length - activeOptions.length,
    recommendedTemplateId: recommendedTemplate.templateId,
    recommendedTemplateName: recommendedTemplate.templateName,
    recommendedMappedFieldCount: recommendedTemplate.mappedFieldCount,
    mappedStandardFields: recommendedTemplate.mappedStandardFields,
    missingStandardFields: recommendedTemplate.missingStandardFields,
    templateOptions,
    title: `推荐使用${recommendedTemplate.templateName}`,
    detail: `当前${formatImportFileType(fileType)}有 ${activeOptions.length} 个启用模板；推荐模板覆盖 ${recommendedTemplate.mappedFieldCount} 个字段，仍缺 ${recommendedTemplate.missingStandardFields.length} 个建议字段。`,
    nextAction: "优先使用推荐模板；如果 CSV 表头不一致，继续用手填字段映射 JSON 兜底。",
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

function buildImportTemplateFitOption(
  template: ImportFieldMappingTemplate,
  recommendedFields: string[]
): ImportTemplateFitOption {
  const mappingPairs = Object.entries(template.field_mapping).map(
    ([sourceField, standardField]) => ({
      sourceField,
      standardField,
    })
  )
  const mappedStandardFields = Array.from(
    new Set(mappingPairs.map((pair) => pair.standardField))
  ).sort()
  const mappedFieldSet = new Set(mappedStandardFields)
  const missingStandardFields = recommendedFields.filter(
    (field) => !mappedFieldSet.has(field)
  )

  return {
    templateId: template.template_id,
    templateName: template.template_name,
    isActive: template.is_active,
    mappedFieldCount: mappingPairs.length,
    mappedStandardFields,
    missingStandardFields,
    mappingPairs,
  }
}

function compareImportTemplateFitOptions(
  left: ImportTemplateFitOption,
  right: ImportTemplateFitOption
): number {
  if (left.isActive !== right.isActive) {
    return left.isActive ? -1 : 1
  }

  if (left.mappedFieldCount !== right.mappedFieldCount) {
    return right.mappedFieldCount - left.mappedFieldCount
  }

  return left.templateId.localeCompare(right.templateId)
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

function formatQualityImpactDownstreamLabel({
  reviewCaseCount,
  openReviewCases,
  comparisonResults,
  comparisonError,
  reviewError,
}: {
  reviewCaseCount: number
  openReviewCases: number
  comparisonResults: number
  comparisonError: string | null
  reviewError: string | null
}): string {
  const reviewLabel = reviewError
    ? "复核案例读取失败"
    : `复核案例 ${reviewCaseCount.toLocaleString("zh-CN")} 个`
  const openLabel = reviewError
    ? "未关闭未知"
    : `未关闭 ${openReviewCases.toLocaleString("zh-CN")} 个`
  const comparisonLabel = comparisonError
    ? "对比结果读取失败"
    : `对比结果 ${comparisonResults.toLocaleString("zh-CN")} 条`

  return `${reviewLabel} · ${openLabel} · ${comparisonLabel}`
}

function formatReviewConclusionEvidenceSummary({
  primaryComparisonRun,
  primaryReviewCase,
  qualityImpact,
  comparisonError,
  reviewError,
}: {
  primaryComparisonRun: ImportComparisonRunRecord | null
  primaryReviewCase: ImportReviewCaseRecord | null
  qualityImpact: ImportQualityImpactAggregation
  comparisonError: string | null
  reviewError: string | null
}): string {
  const reviewLabel = reviewError
    ? "复核案例读取失败"
    : primaryReviewCase
      ? `复核 ${primaryReviewCase.case_id} · ${primaryReviewCase.severity} · ${primaryReviewCase.owner_id}`
      : "复核 暂无案例"
  const comparisonLabel = comparisonError
    ? "对比结果读取失败"
    : primaryComparisonRun
      ? `对比 ${primaryComparisonRun.run_id} · ${formatComparisonRunType(primaryComparisonRun.comparison_type)} · ${primaryComparisonRun.total_results.toLocaleString("zh-CN")} 条结果`
      : "对比结果 0 条"
  const qualityLabel = `质量 ${qualityImpact.topIssueLabel}`

  return `${reviewLabel}；${comparisonLabel}；${qualityLabel}`
}

function buildReviewEvidenceGapItem({
  reviewCase,
  businessDate,
  qualityIssueRows,
  primaryQualityIssue,
  relatedComparison,
  comparisonResults,
}: {
  reviewCase: ImportReviewCaseRecord
  businessDate: string | null
  qualityIssueRows: number
  primaryQualityIssue: string
  relatedComparison: string
  comparisonResults: number
}): ImportReviewEvidenceGapItem {
  const riskTone = formatReviewEvidenceGapTone(reviewCase.severity)
  const riskLabelPrefix =
    riskTone === "blocked" ? "高风险" : riskTone === "warning" ? "中风险" : "低风险"

  return {
    key: reviewCase.case_id,
    title: `${reviewCase.case_id} · ${reviewCase.severity}`,
    ownerId: reviewCase.owner_id,
    riskTone,
    evidenceNeed: formatReviewEvidenceNeed(reviewCase.source_result_type),
    relatedQualityIssue: primaryQualityIssue,
    relatedComparison,
    riskLabel: `${riskLabelPrefix} · 质量问题 ${qualityIssueRows.toLocaleString("zh-CN")} 行 · 对比结果 ${comparisonResults.toLocaleString("zh-CN")} 条`,
    nextAction: `owner ${reviewCase.owner_id} 先补齐 ${reviewCase.case_id} 的关键证据，再进入关闭前复核。`,
    evidence: [
      `业务日 ${businessDate ?? reviewCase.business_date}`,
      `来源 ${reviewCase.source_result_type}#${reviewCase.source_result_id}`,
      `状态 ${reviewCase.status}`,
    ],
  }
}

function formatReviewEvidenceGapTone(severity: string): ImportReviewEvidenceGapTone {
  if (severity === "high" || severity === "critical") {
    return "blocked"
  }

  if (severity === "medium") {
    return "warning"
  }

  return "ready"
}

function reviewEvidenceGapRank(gap: ImportReviewEvidenceGapItem): number {
  if (gap.riskTone === "blocked") {
    return 3
  }

  if (gap.riskTone === "warning") {
    return 2
  }

  return 1
}

function formatReviewEvidenceNeed(sourceResultType: string): string {
  if (sourceResultType === "schedule_actual") {
    return "补充登录/状态明细、排班版本引用和质量修正记录。"
  }

  if (sourceResultType === "forecast_schedule") {
    return "补充预测版本、排班版本引用和质量修正记录。"
  }

  return "补充来源结果、责任人说明和质量修正记录。"
}

function appendReviewCasesFilterParams(
  searchParams: URLSearchParams,
  filters: ImportReviewCasesWorkspaceFilters,
  keys: {
    businessDateKey: string
    ownerIdKey: string
    sourceResultTypeKey: string
  }
): void {
  const businessDate = normalizeFilterValue(filters.businessDate)
  const ownerId = normalizeFilterValue(filters.ownerId)
  const status = normalizeAllFilterValue(filters.status)
  const severity = normalizeAllFilterValue(filters.severity)
  const sourceResultType = normalizeAllFilterValue(filters.sourceResultType)

  if (businessDate) {
    searchParams.set(keys.businessDateKey, businessDate)
  }

  if (ownerId) {
    searchParams.set(keys.ownerIdKey, ownerId)
  }

  if (status) {
    searchParams.set("status", status)
  }

  if (severity) {
    searchParams.set("severity", severity)
  }

  if (sourceResultType) {
    searchParams.set(keys.sourceResultTypeKey, sourceResultType)
  }
}

function normalizeFilterValue(value?: string | null): string | null {
  const normalized = value?.trim()

  return normalized ? normalized : null
}

function normalizeAllFilterValue(value?: string | null): string | null {
  const normalized = normalizeFilterValue(value)

  if (!normalized || normalized === "all") {
    return null
  }

  return normalized
}

function buildReviewCasesWorkspaceDetail(
  cases: ImportReviewCaseRecord[],
  filters: ImportReviewCasesWorkspaceFilters
): string {
  const businessDate = normalizeFilterValue(filters.businessDate)
  const query = normalizeFilterValue(filters.query)
  const openCount = cases.filter((reviewCase) => reviewCase.status !== "closed").length
  const highRiskOpenCount = cases.filter(
    (reviewCase) =>
      reviewCase.status !== "closed" && isHighRiskReviewSeverity(reviewCase.severity)
  ).length

  return [
    businessDate ? `业务日 ${businessDate}` : "全部业务日",
    query && isQualityIssueFocusQuery(query) ? `质量焦点 ${query}` : null,
    `未关闭 ${openCount.toLocaleString("zh-CN")} 个`,
    `高风险未关闭 ${highRiskOpenCount.toLocaleString("zh-CN")} 个`,
  ]
    .filter(Boolean)
    .join(" · ")
}

function formatReviewCaseDetailSource(reviewCase: ImportReviewCaseRecord): string {
  return `${formatReviewCaseSourceType(reviewCase.source_result_type)} #${reviewCase.source_result_id}`
}

function summarizeReviewCaseSourceTrace(
  sourceTrace: ImportReviewCaseSourceTraceRecord | null
): { run: string; href: string; versions: string[] } {
  if (!sourceTrace) {
    return {
      run: "等待来源链路",
      href: "/data-quality/review-cases",
      versions: ["等待计算运行和版本批次"],
    }
  }

  return {
    run: [
      `计算 ${sourceTrace.run.run_id}`,
      formatComparisonTypeLabel(sourceTrace.run.comparison_type),
      sourceTrace.run.status,
      `${sourceTrace.run.total_results.toLocaleString("zh-CN")} 条结果`,
    ].join(" · "),
    href: buildImportComparisonRunDetailWorkspaceHref(sourceTrace.run.run_id),
    versions: sourceTrace.versions.length
      ? sourceTrace.versions.map(formatReviewCaseSourceTraceVersion)
      : ["未返回版本链路"],
  }
}

function formatReviewCaseSourceTraceVersion(
  version: ImportReviewCaseSourceTraceVersionRecord
): string {
  return [
    `${formatReviewCaseSourceTraceRole(version.version_role)} ${version.business_version_id}`,
    version.import_version_id,
    version.batch_id,
  ]
    .filter((item): item is string => Boolean(item))
    .join(" · ")
}

function formatReviewCaseSourceTraceRole(
  versionRole: ImportReviewCaseSourceTraceVersionRecord["version_role"]
): string {
  if (versionRole === "forecast") {
    return "预测版本"
  }
  if (versionRole === "schedule") {
    return "排班版本"
  }
  return "实际版本"
}

function formatComparisonTypeLabel(
  type: ImportComparisonRunRecord["comparison_type"]
): string {
  if (type === "forecast_vs_schedule") {
    return "预测排班"
  }

  return "排班实际"
}

export function summarizeImportComparisonRunDetail({
  detail,
  error,
}: {
  detail: ImportComparisonRunDetailResponse | null
  error: string | null
}): ImportComparisonRunDetailSummary {
  if (error) {
    return emptyComparisonRunDetailSummary({
      tone: "blocked",
      title: "对比运行读取失败",
      businessDate: "不可用",
      businessDateDetail: error,
      versionLabel: "版本不可用",
    })
  }

  if (!detail) {
    return emptyComparisonRunDetailSummary({
      tone: "empty",
      title: "等待对比运行",
      businessDate: "未选择",
      businessDateDetail: "等待运行",
      versionLabel: "等待版本",
    })
  }

  return {
    tone: detail.run.status === "failed" ? "blocked" : "ready",
    title: `${detail.run.run_id} · ${formatComparisonTypeLabel(detail.run.comparison_type)} · ${formatComparisonRunStatus(detail.run.status)}`,
    metricCards: [
      {
        label: "结果数",
        value: detail.run.total_results.toLocaleString("zh-CN"),
        detail: "计算结果",
      },
      {
        label: "缺口",
        value: `${(detail.run.total_gap_agents ?? 0).toLocaleString("zh-CN")} 人`,
        detail: "预测排班差异",
      },
      {
        label: "迟到",
        value: `${(detail.run.total_late_minutes ?? 0).toLocaleString("zh-CN")} 分钟`,
        detail: "排班实际差异",
      },
      {
        label: "业务日",
        value: detail.run.business_date_from,
        detail: `至 ${detail.run.business_date_to}`,
      },
    ],
    versionLabel: formatComparisonRunVersionLabel(detail.run),
    apiHref: buildImportComparisonRunDetailApiUrl(detail.run.run_id),
    resultRows: [
      ...detail.forecast_schedule_results.map(formatForecastScheduleResultRow),
      ...detail.schedule_actual_results.map(formatScheduleActualResultRow),
    ],
  }
}

export function summarizeImportComparisonRunReviewCases({
  detail,
  reviewCases,
  reviewError,
}: {
  detail: ImportComparisonRunDetailResponse | null
  reviewCases: ImportReviewCaseRecord[]
  reviewError: string | null
}): ImportComparisonRunReviewCaseSummary {
  if (reviewError) {
    return {
      tone: "blocked",
      title: "复核案例读取失败",
      detail: reviewError,
      nextAction: "先恢复复核案例读取，再判断当前运行结果是否已进入复核。",
      cases: [],
    }
  }

  if (!detail) {
    return {
      tone: "empty",
      title: "等待运行结果",
      detail: "还没有可匹配复核案例的对比运行结果。",
      nextAction: "先选择一个对比运行。",
      cases: [],
    }
  }

  const resultLabels = new Map<string, string>()
  for (const result of detail.forecast_schedule_results) {
    resultLabels.set(
      buildReviewCaseSourceResultKey("forecast_schedule", result.result_id),
      `预测排班 #${result.result_id}`
    )
  }
  for (const result of detail.schedule_actual_results) {
    resultLabels.set(
      buildReviewCaseSourceResultKey("schedule_actual", result.result_id),
      `排班实际 #${result.result_id}`
    )
  }

  const matchedCases = reviewCases
    .filter((reviewCase) =>
      resultLabels.has(
        buildReviewCaseSourceResultKey(
          reviewCase.source_result_type,
          reviewCase.source_result_id
        )
      )
    )
    .sort(
      (current, next) =>
        reviewCaseSeverityRank(next.severity) - reviewCaseSeverityRank(current.severity) ||
        reviewCaseOpenRank(next.status) - reviewCaseOpenRank(current.status) ||
        current.case_id.localeCompare(next.case_id)
    )

  if (matchedCases.length === 0) {
    return {
      tone: "empty",
      title: "暂无关联复核案例",
      detail: "当前运行结果尚未匹配到复核案例。",
      nextAction: "继续查看结果明细；后续复核写入必须进入单独受控任务。",
      cases: [],
    }
  }

  const openCount = matchedCases.filter((reviewCase) => reviewCase.status !== "closed").length
  const hasHighRiskOpenCase = matchedCases.some(
    (reviewCase) =>
      reviewCase.status !== "closed" && isHighRiskReviewSeverity(reviewCase.severity)
  )

  return {
    tone: hasHighRiskOpenCase ? "blocked" : openCount > 0 ? "warning" : "ready",
    title: `关联复核案例 ${matchedCases.length.toLocaleString("zh-CN")} 个`,
    detail: `当前运行有 ${matchedCases.length.toLocaleString("zh-CN")} 个结果已形成复核案例，其中 ${openCount.toLocaleString("zh-CN")} 个仍未关闭。`,
    nextAction:
      openCount > 0
        ? "先查看未关闭或高风险复核案例，再回看运行结果和证据。"
        : "当前关联案例均已关闭，可继续回看结果明细和关闭证据。",
    cases: matchedCases.map((reviewCase) => ({
      caseId: reviewCase.case_id,
      resultLabel:
        resultLabels.get(
          buildReviewCaseSourceResultKey(
            reviewCase.source_result_type,
            reviewCase.source_result_id
          )
        ) ?? formatReviewCaseDetailSource(reviewCase),
      ownerLabel: reviewCase.owner_id,
      severityLabel: formatReviewCaseSeverity(reviewCase.severity),
      statusLabel: formatReviewCaseStatus(reviewCase.status),
      href: buildImportReviewCaseDetailWorkspaceHref(reviewCase.case_id),
    })),
  }
}

function buildReviewCaseSourceResultKey(
  sourceResultType: ImportReviewCaseRecord["source_result_type"],
  sourceResultId: number
): string {
  return `${sourceResultType}:${sourceResultId}`
}

function reviewCaseOpenRank(status: string): number {
  return status === "closed" ? 0 : 1
}

function reviewCaseSeverityRank(severity: string): number {
  if (severity === "critical") {
    return 4
  }

  if (severity === "high") {
    return 3
  }

  if (severity === "medium") {
    return 2
  }

  if (severity === "low") {
    return 1
  }

  return 0
}

function emptyComparisonRunDetailSummary({
  tone,
  title,
  businessDate,
  businessDateDetail,
  versionLabel,
}: {
  tone: ImportReviewCaseDetailTone
  title: string
  businessDate: string
  businessDateDetail: string
  versionLabel: string
}): ImportComparisonRunDetailSummary {
  return {
    tone,
    title,
    metricCards: [
      { label: "结果数", value: "0", detail: "等待运行" },
      { label: "缺口", value: "0 人", detail: "等待运行" },
      { label: "迟到", value: "0 分钟", detail: "等待运行" },
      { label: "业务日", value: businessDate, detail: businessDateDetail },
    ],
    versionLabel,
    apiHref: buildImportApiUrl("/api/v1/comparison-runs"),
    resultRows: [],
  }
}

function formatComparisonRunVersionLabel(run: ImportComparisonRunRecord): string {
  if (run.comparison_type === "forecast_vs_schedule") {
    return [
      run.forecast_version_id ? `预测 ${run.forecast_version_id}` : null,
      run.schedule_version_id ? `排班 ${run.schedule_version_id}` : null,
    ]
      .filter((item): item is string => item !== null)
      .join(" · ")
  }

  return [
    run.schedule_version_id ? `排班 ${run.schedule_version_id}` : null,
    run.actual_import_version_id ? `实际 ${run.actual_import_version_id}` : null,
  ]
    .filter((item): item is string => item !== null)
    .join(" · ")
}

function formatForecastScheduleResultRow(
  result: ImportForecastScheduleComparisonResultRecord
): ImportComparisonRunDetailSummary["resultRows"][number] {
  return {
    id: `forecast-${result.result_id}`,
    source: "预测排班",
    dimension: [
      result.business_date,
      `${result.interval_start}-${result.interval_end}`,
      result.workplace_id,
      result.project_id,
      result.skill_id,
    ].join(" · "),
    metric: [
      `预测 ${result.forecast_agents.toLocaleString("zh-CN")} 人`,
      `排班 ${result.scheduled_agents.toLocaleString("zh-CN")} 人`,
      `缺口 ${result.gap_agents.toLocaleString("zh-CN")} 人`,
    ].join(" · "),
    status: result.result_status,
  }
}

function formatScheduleActualResultRow(
  result: ImportScheduleActualComparisonResultRecord
): ImportComparisonRunDetailSummary["resultRows"][number] {
  return {
    id: `actual-${result.result_id}`,
    source: "排班实际",
    dimension: [
      result.business_date,
      `${result.interval_start}-${result.interval_end}`,
      result.employee_id,
    ].join(" · "),
    metric: [
      `排班 ${result.scheduled_minutes.toLocaleString("zh-CN")} 分钟`,
      `有效 ${result.actual_productive_minutes.toLocaleString("zh-CN")} 分钟`,
      `迟到 ${result.late_minutes.toLocaleString("zh-CN")} 分钟`,
    ].join(" · "),
    status: result.result_status,
  }
}

function summarizeReviewCaseSourceResult(
  reviewCase: ImportReviewCaseRecord,
  sourceResult: ImportReviewCaseSourceResultRecord | null
): { dimensions: string[]; metrics: string[] } {
  if (!sourceResult) {
    return {
      dimensions: [
        `业务日 ${reviewCase.business_date}`,
        `${formatReviewCaseSourceType(reviewCase.source_result_type)} #${reviewCase.source_result_id}`,
      ],
      metrics: ["等待来源结果明细"],
    }
  }

  if (sourceResult.source_result_type === "schedule_actual") {
    return {
      dimensions: [
        `业务日 ${sourceResult.business_date}`,
        `时段 ${sourceResult.interval_start}-${sourceResult.interval_end}`,
        sourceResult.employee_id ? `坐席 ${sourceResult.employee_id}` : null,
        sourceResult.schedule_version_id
          ? `排班版本 ${sourceResult.schedule_version_id}`
          : null,
        sourceResult.actual_import_version_id
          ? `实际版本 ${sourceResult.actual_import_version_id}`
          : null,
      ].filter((item): item is string => item !== null),
      metrics: [
        formatNullableNumberMetric("排班", sourceResult.scheduled_minutes, "分钟"),
        formatNullableNumberMetric(
          "有效",
          sourceResult.actual_productive_minutes,
          "分钟"
        ),
        formatNullableNumberMetric("迟到", sourceResult.late_minutes, "分钟"),
        `状态 ${sourceResult.result_status}`,
      ].filter((item): item is string => item !== null),
    }
  }

  return {
    dimensions: [
      `业务日 ${sourceResult.business_date}`,
      `时段 ${sourceResult.interval_start}-${sourceResult.interval_end}`,
      sourceResult.workplace_id ? `职场 ${sourceResult.workplace_id}` : null,
      sourceResult.project_id ? `项目 ${sourceResult.project_id}` : null,
      sourceResult.skill_id ? `技能 ${sourceResult.skill_id}` : null,
    ].filter((item): item is string => item !== null),
    metrics: [
      formatNullableNumberMetric("预测", sourceResult.forecast_agents, "人"),
      formatNullableNumberMetric("排班", sourceResult.scheduled_agents, "人"),
      formatNullableNumberMetric("缺口", sourceResult.gap_agents, "人"),
      `状态 ${sourceResult.result_status}`,
    ].filter((item): item is string => item !== null),
  }
}

function formatNullableNumberMetric(
  label: string,
  value: number | null,
  unit: string
): string | null {
  if (value === null) {
    return null
  }

  return `${label} ${value.toLocaleString("zh-CN")} ${unit}`
}

function formatReviewCaseQualityFocus(reviewCase: ImportReviewCaseRecord): string {
  if (reviewCase.source_result_type === "schedule_actual") {
    return "登录/状态明细、排班版本和质量修正记录。"
  }

  return "预测版本、排班版本和质量修正记录。"
}

function formatReviewCaseDetailEvidenceGap(
  reviewCase: ImportReviewCaseRecord,
  isClosed: boolean
): string {
  if (isClosed) {
    return "案例已关闭，当前只回看关闭依据和证据完整性。"
  }

  if (reviewCase.source_result_type === "schedule_actual") {
    return "仍需确认登录/状态明细、排班版本引用和质量修正记录。"
  }

  return "仍需确认预测版本、排班版本引用和质量修正记录。"
}

function formatReviewCaseDetailNextAction({
  reviewCase,
  evidenceCount,
  conclusionCount,
  isClosed,
}: {
  reviewCase: ImportReviewCaseRecord
  evidenceCount: number
  conclusionCount: number
  isClosed: boolean
}): string {
  if (isClosed) {
    return "回看关闭依据，不在本页重新打开或修改结论。"
  }

  return `owner ${reviewCase.owner_id} 先复核 ${evidenceCount.toLocaleString("zh-CN")} 条证据和 ${conclusionCount.toLocaleString("zh-CN")} 条结论，再进入受控关闭流程。`
}

function isQualityIssueFocusQuery(query: string): boolean {
  return query.includes(" · ") || query.includes("::")
}

function inferQualityIssueReviewCaseSourceType({
  reviewCases,
  comparisonRuns,
}: {
  reviewCases: ImportReviewCaseRecord[]
  comparisonRuns: ImportComparisonRunRecord[]
}): ImportReviewCaseRecord["source_result_type"] | "all" {
  const primaryReviewCase =
    reviewCases.find((reviewCase) => reviewCase.status !== "closed") ??
    reviewCases[0] ??
    null

  if (primaryReviewCase) {
    return primaryReviewCase.source_result_type
  }

  const primaryRun =
    comparisonRuns.find((run) => run.status === "completed") ?? comparisonRuns[0] ?? null

  if (primaryRun?.comparison_type === "schedule_vs_actual") {
    return "schedule_actual"
  }

  if (primaryRun?.comparison_type === "forecast_vs_schedule") {
    return "forecast_schedule"
  }

  return "all"
}

function buildReviewCaseOwnerGroups(
  cases: ImportReviewCaseRecord[]
): ImportReviewCasesOwnerGroup[] {
  return buildReviewCaseGroups(cases, "owner_id", (ownerId) => ownerId)
    .map((group) => ({
      ...group,
      ownerId: group.key,
    }))
    .sort((a, b) => b.openCount - a.openCount || b.count - a.count || a.ownerId.localeCompare(b.ownerId))
}

function buildReviewCaseProcessingStageGroups(
  cases: ImportReviewCaseRecord[],
  processingStages: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
): ImportReviewCasesWorkspaceGroup[] {
  const groups = new Map<string, ImportReviewCasesWorkspaceGroup>()

  for (const reviewCase of cases) {
    const stage = summarizeImportReviewCaseProcessingStage(
      reviewCase,
      processingStages[reviewCase.case_id]
    )
    const existing = groups.get(stage.key) ?? {
      key: stage.key,
      label: stage.label,
      count: 0,
      openCount: 0,
    }

    existing.count += 1

    if (reviewCase.status !== "closed") {
      existing.openCount += 1
    }

    groups.set(stage.key, existing)
  }

  return [...groups.values()].sort(
    (a, b) => b.openCount - a.openCount || b.count - a.count || a.label.localeCompare(b.label)
  )
}

const IMPORT_REVIEW_OWNER_STAGE_MATRIX_COLUMNS: ImportReviewOwnerStageMatrixColumn[] = [
  { key: "missing_evidence", label: "缺证据" },
  { key: "missing_conclusion", label: "缺结论" },
  { key: "ready_to_close", label: "可关闭" },
  { key: "closed", label: "已关闭" },
  { key: "unknown", label: "阶段未知" },
]

function buildReviewCaseGroups<K extends keyof ImportReviewCaseRecord>(
  cases: ImportReviewCaseRecord[],
  key: K,
  formatLabel: (value: ImportReviewCaseRecord[K]) => string
): ImportReviewCasesWorkspaceGroup[] {
  const groups = new Map<string, ImportReviewCasesWorkspaceGroup>()

  for (const reviewCase of cases) {
    const rawValue = reviewCase[key]
    const groupKey = String(rawValue)
    const existing = groups.get(groupKey) ?? {
      key: groupKey,
      label: formatLabel(rawValue),
      count: 0,
      openCount: 0,
    }

    existing.count += 1

    if (reviewCase.status !== "closed") {
      existing.openCount += 1
    }

    groups.set(groupKey, existing)
  }

  return [...groups.values()].sort(
    (a, b) => b.openCount - a.openCount || b.count - a.count || a.label.localeCompare(b.label)
  )
}

function formatReviewCaseSeverity(severity: string): string {
  if (severity === "critical") {
    return "严重"
  }

  if (severity === "high") {
    return "高"
  }

  if (severity === "medium") {
    return "中"
  }

  if (severity === "low") {
    return "低"
  }

  return severity
}

function formatReviewCaseSourceType(
  sourceResultType: ImportReviewCaseRecord["source_result_type"]
): string {
  if (sourceResultType === "forecast_schedule") {
    return "预测排班"
  }

  return "排班实际"
}

function isHighRiskReviewSeverity(severity: string): boolean {
  return severity === "high" || severity === "critical"
}

function appendQualityImpactEvidence(
  evidence: string[],
  row: ImportBatchRowResult
): string[] {
  const nextEvidence = [...evidence]
  const rowLabel = `行 ${row.row_number.toLocaleString("zh-CN")} ${formatImportRowStatus(row.row_status)}`

  if (!nextEvidence.includes(rowLabel)) {
    nextEvidence.push(rowLabel)
  }

  if (row.source_key) {
    const sourceLabel = `source_key ${row.source_key}`
    if (!nextEvidence.includes(sourceLabel)) {
      nextEvidence.push(sourceLabel)
    }
  }

  return nextEvidence.slice(0, 4)
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
