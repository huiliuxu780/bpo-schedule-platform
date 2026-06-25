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

export type ImportVersionWorkbenchDomainKey =
  | "master_data"
  | "personnel_schedule"
  | "demand_forecast"
  | "actual_logs"

export type ImportVersionWorkbenchTone = "ready" | "blocked" | "empty"

export type ImportVersionWorkbenchFilterValue = "all" | "applied"

export type ImportVersionWorkbenchFilters = {
  businessDate?: string | null
  domain?: ImportVersionWorkbenchDomainKey | ImportVersionWorkbenchFilterValue | null
  status?: ImportVersionWorkbenchTone | ImportVersionWorkbenchFilterValue | null
}

export type ImportVersionWorkbenchRow = {
  domainKey: ImportVersionWorkbenchDomainKey
  domainLabel: string
  sourceFileLabel: string
  tone: ImportVersionWorkbenchTone
  statusLabel: string
  versionLabel: string
  sourceBatchLabel: string
  businessDateLabel: string
  visibleTimeLabel: string
  blockerSummary: string
  nextAction: string
  downstreamSummary: string
  downstreamDetail: string
  primaryActionLabel: string
  primaryActionHref: string | null
  secondaryActionLabel: string | null
  secondaryActionHref: string | null
  comparisonCandidate: ImportVersionComparisonCandidate
}

export type ImportVersionComparisonCandidate = {
  tone: ImportVersionWorkbenchTone
  canSubmit: boolean
  title: string
  detail: string
  comparisonTypeLabel: string
  versionPairLabel: string
  businessDateLabel: string
  actionLabel: string
  href: string | null
  sourceBatchId: string | null
  request: ImportVersionComparisonTriggerRequest | null
}

export type ImportVersionWorkbenchSummary = {
  tone: ImportVersionWorkbenchTone
  title: string
  detail: string
  totalDomains: number
  readyCount: number
  blockedCount: number
  emptyCount: number
  rows: ImportVersionWorkbenchRow[]
}

export type ImportBatchDetailSummary = {
  totalRows: number
  successRows: number
  failedRows: number
  warningRows: number
  versionCount: number
  workspaceTabs: ImportBatchDetailWorkspaceTab[]
}

export type ImportBatchDetailWorkspaceTabKey =
  | "overview"
  | "processing"
  | "exception-trace"
  | "versions"
  | "rows"

export type ImportBatchDetailWorkspaceTab = {
  key: ImportBatchDetailWorkspaceTabKey
  label: string
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

export type ImportSingleBatchApplyActionTone =
  | "ready"
  | "blocked"
  | "done"
  | "unknown"

export type ImportSingleBatchApplyAction = {
  tone: ImportSingleBatchApplyActionTone
  canSubmit: boolean
  statusLabel: string
  actionLabel: string
  title: string
  detail: string
  nextAction: string
}

export type ImportBatchApplyResultNoticeTone = "success" | "failed"

export type ImportBatchApplyResultNotice = {
  tone: ImportBatchApplyResultNoticeTone
  title: string
  detail: string
  nextAction: string
}

export type ImportAppliedResultCardTone = "success" | "done"

export type ImportAppliedResultCard = {
  tone: ImportAppliedResultCardTone
  statusLabel: string
  title: string
  detail: string
  targetLabel: string
  versionLabel: string
  appliedRecordLabel: string
  primaryActionLabel: string
  primaryHref: string
  secondaryActionLabel: string
  secondaryHref: string
}

export type ImportAppliedVersionResultContextTone = "ready" | "blocked" | "empty"

export type ImportAppliedVersionResultContext = {
  tone: ImportAppliedVersionResultContextTone
  title: string
  detail: string
  sourceBatchLabel: string
  versionLabel: string
  targetLabel: string
  downstreamStatusLabel: string
  primaryActionLabel: string
  primaryHref: string
  secondaryActionLabel: string
  secondaryHref: string
  evidence: string[]
}

export type ImportVersionComparisonTriggerTone = "ready" | "blocked"

export type ImportVersionComparisonTriggerRequest = {
  comparisonType: ImportComparisonRunRecord["comparison_type"]
  forecastVersionId: string | null
  scheduleVersionId: string | null
  actualImportVersionId: string | null
  businessDateFrom: string
  businessDateTo: string
}

export type ImportVersionComparisonTrigger = {
  tone: ImportVersionComparisonTriggerTone
  canSubmit: boolean
  title: string
  detail: string
  actionLabel: string
  nextAction: string
  comparisonTypeLabel: string
  versionPairLabel: string
  businessDateLabel: string
  evidence: string[]
  request: ImportVersionComparisonTriggerRequest | null
}

export type ImportVersionComparisonTriggerNoticeTone = "success" | "failed"

export type ImportVersionComparisonTriggerNotice = {
  tone: ImportVersionComparisonTriggerNoticeTone
  title: string
  detail: string
  runLabel: string
  primaryActionLabel: string
  primaryHref: string
  secondaryActionLabel: string
  secondaryHref: string
}

export type ImportLatestComparisonRunCallbackTone = "success" | "blocked"

export type ImportLatestComparisonRunCallback = {
  tone: ImportLatestComparisonRunCallbackTone
  title: string
  detail: string
  runLabel: string
  metricCards: Array<{ label: string; value: string; detail: string }>
  primaryActionLabel: string
  primaryHref: string
  secondaryActionLabel: string
  secondaryHref: string
}

export type ImportVersionWorkbenchComparisonResultReviewTone = "success" | "blocked"

export type ImportVersionWorkbenchComparisonResultReview = {
  tone: ImportVersionWorkbenchComparisonResultReviewTone
  title: string
  detail: string
  runLabel: string
  metricCards: Array<{ label: string; value: string; detail: string }>
  primaryActionLabel: string
  primaryHref: string
  secondaryActionLabel: string
  secondaryHref: string
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

export type ImportComparisonRunDetailWorkspaceTabKey =
  | "overview"
  | "source"
  | "results"
  | "reviews"

export type ImportComparisonRunDetailWorkspaceTab = {
  key: ImportComparisonRunDetailWorkspaceTabKey
  label: string
}

export type ImportComparisonRunDetailSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  workspaceTabs: ImportComparisonRunDetailWorkspaceTab[]
  resultReviewContext: {
    title: string
    detail: string
    scopeLabel: string
    sourceVersionLabel: string
    businessDateLabel: string
    sourceExplanation: string
    sourceBlocker: string | null
    nextAction: string
  }
  metricCards: Array<{ label: string; value: string; detail: string }>
  versionLabel: string
  detailHref: string
  resultRows: Array<{
    id: string
    source: string
    dimension: string
    metric: string
    status: string
  }>
}

export type ImportComparisonRunReturnLinks = {
  tone: ImportVersionWorkbenchTone
  title: string
  detail: string
  sourceBatchLabel: string
  versionWorkbenchLabel: string
  primaryActionLabel: string
  primaryHref: string | null
  secondaryActionLabel: string
  secondaryHref: string | null
  evidence: string[]
}

export type ImportComparisonRunReviewCaseSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  detail: string
  nextAction: string
  totalCount: number
  openCount: number
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

export type ImportReviewOwnerContextItem = {
  caseId: string
  severityLabel: string
  statusLabel: string
  stageKey: ImportReviewOwnerStageMatrixStageKey
  stageLabel: string
  evidenceLabel: string
  nextAction: string
  createdAt: string
  detailHref: string
}

export type ImportReviewOwnerContextSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  detail: string
  ownerId: string | null
  businessDate: string | null
  totalCount: number
  actionableCount: number
  listHref: string
  stageHref: string
  items: ImportReviewOwnerContextItem[]
}

export type ImportReviewOwnerNavigationItem = {
  caseId: string
  stageKey: ImportReviewOwnerStageMatrixStageKey
  stageLabel: string
  severityLabel: string
  createdAt: string
  href: string
}

export type ImportReviewOwnerNavigationSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  detail: string
  ownerId: string | null
  businessDate: string | null
  listHref: string
  positionLabel: string
  totalActionableCount: number
  current: ImportReviewOwnerNavigationItem | null
  previous: ImportReviewOwnerNavigationItem | null
  next: ImportReviewOwnerNavigationItem | null
  sequence: ImportReviewOwnerNavigationItem[]
}

export type ImportReviewOwnerFirstPendingEntry = {
  ownerId: string
  businessDate: string
  totalCount: number
  actionableCount: number
  listHref: string
  firstPendingCase: ImportReviewOwnerNavigationItem
}

export type ImportReviewCaseDetailSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  workspaceTabs: ImportReviewCaseDetailWorkspaceTab[]
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

export type ImportReviewCaseDetailWorkspaceTabKey =
  | "overview"
  | "source"
  | "evidence"
  | "actions"
  | "owner"

export type ImportReviewCaseDetailWorkspaceTab = {
  key: ImportReviewCaseDetailWorkspaceTabKey
  label: string
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

export type ImportReviewCaseActionDeckSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  statusLabel: string
  primaryAction: string
  summary: string
  nextAction: string
  steps: Array<{
    key: "evidence" | "conclusion" | "closure"
    title: string
    statusLabel: string
    actionLabel: string
    canSubmit: boolean
    isPrimary: boolean
    detail: string
  }>
}

export type ImportReviewCaseActionFeedbackSummary = {
  tone: Exclude<ImportReviewCaseDetailTone, "empty" | "warning">
  title: string
  statusLabel: string
  detail: string
  actionKey: "evidence" | "conclusion" | "closure"
}

export type ImportReviewCaseActionContinuationSummary = {
  tone: Exclude<ImportReviewCaseDetailTone, "empty" | "warning">
  title: string
  statusLabel: string
  detail: string
  primaryLabel: string
  primaryHref: string
  primaryDetail: string
  listLabel: string
  listHref: string
}

export type ImportReviewCaseActionRetrySummary = {
  tone: "blocked"
  title: string
  statusLabel: string
  detail: string
  tabValue: "evidence" | "conclusion" | "closure"
  actionLabel: string
}

export type ImportReviewCaseAcceptanceStageCoverage = {
  key: Exclude<ImportReviewCaseProcessingStageKey, "all">
  label: string
  count: number
}

export type ImportReviewCaseAcceptanceBlockSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  statusLabel: string
  detail: string
  primaryActionLabel: string
  primaryHref: string
  stageCoverage: ImportReviewCaseAcceptanceStageCoverage[]
  nextAction: string
}

export type ImportReviewCaseDetailAcceptanceStepKey =
  | "source"
  | "evidence"
  | "conclusion"
  | "closure"
  | "continuation"

export type ImportReviewCaseDetailAcceptanceStep = {
  key: ImportReviewCaseDetailAcceptanceStepKey
  label: string
  statusLabel: string
  detail: string
}

export type ImportReviewCaseDetailAcceptanceSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
  statusLabel: string
  detail: string
  primaryActionLabel: string
  primaryHref: string
  steps: ImportReviewCaseDetailAcceptanceStep[]
  nextAction: string
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
  workspaceTabs: ImportFieldMappingTemplateWorkspaceTab[]
}

export type ImportFieldMappingTemplateWorkspaceTabKey =
  | "overview"
  | "fit"
  | "templates"

export type ImportFieldMappingTemplateWorkspaceTab = {
  key: ImportFieldMappingTemplateWorkspaceTabKey
  label: string
}

export type ImportFieldMappingTemplateDetailWorkspaceTabKey =
  | "overview"
  | "maintenance"
  | "mapping"

export type ImportFieldMappingTemplateDetailWorkspaceTab = {
  key: ImportFieldMappingTemplateDetailWorkspaceTabKey
  label: string
}

export type ImportFieldMappingTemplateDetailSummary = {
  mappedFieldCount: number
  statusLabel: string
  summaryText: string
  workspaceTabs: ImportFieldMappingTemplateDetailWorkspaceTab[]
}

export type ImportFieldMappingTemplateActionNoticeTone = "success" | "failed"

export type ImportFieldMappingTemplateActionNotice = {
  tone: ImportFieldMappingTemplateActionNoticeTone
  title: string
  detail: string
  nextAction: string
}

export type ImportTemplateUploadPrefill = {
  selectedTemplateId: string
  defaultTemplateId: string
  fileType: ImportFileType | null
  tone: ImportFieldMappingTemplateActionNoticeTone
  title: string
  detail: string
  nextAction: string
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
