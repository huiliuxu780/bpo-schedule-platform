import type {
  ImportFileType,
  ImportPageHierarchyDetailTab,
  ImportReviewCaseRecord,
  ImportReviewCasesWorkspaceFilters,
  ImportUploadRequest,
} from "./import-center-types"

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

export function buildImportBatchApplyUrl(
  batchId: string,
  fileType: ImportFileType,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/import-batches/${encodeURIComponent(batchId)}/${getImportBatchApplyApiAction(fileType)}`,
    apiBase
  )
}

function getImportBatchApplyApiAction(fileType: ImportFileType): string {
  if (fileType === "master_data") {
    return "apply-master-data"
  }

  if (fileType === "personnel_schedule") {
    return "apply-personnel-schedule"
  }

  if (fileType === "demand_forecast") {
    return "apply-forecast"
  }

  return "apply-actual-logs"
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

export function buildImportFieldMappingTemplateCreateUrl(
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl("/api/v1/import-field-mapping-templates", apiBase)
}

export function buildImportFieldMappingTemplateNewWorkspaceHref(): string {
  return "/data-quality/field-mapping-templates/new"
}

export function buildImportUploadWorkspaceHref(
  params: {
    fileType?: ImportFileType | null
    templateId?: string | null
  } = {}
): string {
  const searchParams = new URLSearchParams()

  if (params.fileType) {
    searchParams.set("fileType", params.fileType)
  }

  if (params.templateId) {
    searchParams.set("templateId", params.templateId)
  }

  const query = searchParams.toString()

  return `/data-quality/uploads/new${query ? `?${query}` : ""}`
}

export function buildImportUploadWorkspaceResultHref(params: {
  status: "success" | "failed"
  batchId?: string | null
  reason?: string | null
}): string {
  const searchParams = new URLSearchParams({ upload: params.status })

  if (params.reason) {
    searchParams.set("reason", params.reason)
  }

  if (params.batchId) {
    searchParams.set("batch", params.batchId)
  }

  return `/data-quality/uploads/new?${searchParams.toString()}`
}

export function buildImportFieldMappingTemplateWorkspaceHref(
  templateId: string,
  params: {
    batchId?: string | null
  } = {}
): string {
  const searchParams = new URLSearchParams()

  if (params.batchId) {
    searchParams.set("batchId", params.batchId)
  }

  const query = searchParams.toString()

  return `/data-quality/field-mapping-templates/${encodeURIComponent(templateId)}${query ? `?${query}` : ""}`
}

export function buildImportFieldMappingTemplateUploadHref(
  batchId: string,
  templateId: string
): string {
  const searchParams = new URLSearchParams({ templateId })

  return `/data-quality/${encodeURIComponent(batchId)}?${searchParams.toString()}#import-detail-workspace`
}

export function buildImportFieldMappingTemplateDetailUrl(
  templateId: string,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/import-field-mapping-templates/${encodeURIComponent(templateId)}`,
    apiBase
  )
}

export function buildImportFieldMappingTemplateDeactivateUrl(
  templateId: string,
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl(
    `/api/v1/import-field-mapping-templates/${encodeURIComponent(templateId)}/deactivate`,
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
    apply?: string | null
    compare?: string | null
    compareReason?: string | null
    compareRun?: string | null
    tab?: ImportPageHierarchyDetailTab | null
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

  if (params.apply) {
    searchParams.set("apply", params.apply)
  }

  if (params.compare) {
    searchParams.set("compare", params.compare)
  }

  if (params.compareReason) {
    searchParams.set("compareReason", params.compareReason)
  }

  if (params.compareRun) {
    searchParams.set("compareRun", params.compareRun)
  }

  if (params.tab) {
    searchParams.set("tab", params.tab)
  }

  const query = searchParams.toString()

  return `/data-quality/${encodeURIComponent(batchId)}${query ? `?${query}` : ""}`
}

export function buildImportComparisonRunsUrl(businessDate: string): string {
  const searchParams = new URLSearchParams({ businessDate })

  return `/data-quality/versions?${searchParams.toString()}`
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

export function buildImportComparisonRunCalculateUrl(
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl("/api/v1/comparison-runs/calculate", apiBase)
}

export function buildImportReviewCasesUrl(businessDate: string): string {
  const searchParams = new URLSearchParams({ businessDate })

  return `/data-quality/review-cases?${searchParams.toString()}`
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

function getDefaultApiBase(): string {
  return process.env.NEXT_PUBLIC_BPO_API_BASE_URL ?? "http://127.0.0.1:8000"
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
