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

export type ImportComparisonRunDetailSummary = {
  tone: ImportReviewCaseDetailTone
  title: string
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
  apiHref: string
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
    templateId?: string | null
  } = {}
): string {
  const searchParams = new URLSearchParams()

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

export function buildImportComparisonRunCalculateUrl(
  apiBase = getDefaultApiBase()
): string {
  return buildImportApiUrl("/api/v1/comparison-runs/calculate", apiBase)
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

const versionWorkbenchDomains: Array<{
  key: ImportVersionWorkbenchDomainKey
  label: string
  sourceFileLabel: string
  fileTypes: ImportFileType[]
}> = [
  {
    key: "master_data",
    label: "主数据",
    sourceFileLabel: "主数据",
    fileTypes: ["master_data"],
  },
  {
    key: "personnel_schedule",
    label: "人员排班",
    sourceFileLabel: "人员排班",
    fileTypes: ["personnel_schedule"],
  },
  {
    key: "demand_forecast",
    label: "需求预测",
    sourceFileLabel: "需求预测",
    fileTypes: ["demand_forecast"],
  },
  {
    key: "actual_logs",
    label: "登录/状态日志",
    sourceFileLabel: "登录日志 / 状态日志",
    fileTypes: ["login_log", "status_log"],
  },
]

export function summarizeImportVersionWorkbench({
  batches,
  comparisonRuns = [],
  reviewCases = [],
  filters,
}: {
  batches: ImportBatchListRow[]
  comparisonRuns?: ImportComparisonRunRecord[]
  reviewCases?: ImportReviewCaseRecord[]
  filters: ImportVersionWorkbenchFilters
}): ImportVersionWorkbenchSummary {
  const businessDate = normalizeFilterValue(filters.businessDate)
  const domainFilter =
    filters.domain && filters.domain !== "all" ? filters.domain : null
  const statusFilter = normalizeVersionWorkbenchStatusFilter(filters.status)
  const scopedBatches = businessDate
    ? batches.filter((batch) => batch.business_date_from === businessDate)
    : batches
  const rows = versionWorkbenchDomains
    .map((domain) =>
      summarizeImportVersionWorkbenchRow(
        domain,
        scopedBatches,
        comparisonRuns,
        reviewCases
      )
    )
    .filter((row) => (domainFilter ? row.domainKey === domainFilter : true))
    .filter((row) => (statusFilter ? row.tone === statusFilter : true))

  const readyCount = rows.filter((row) => row.tone === "ready").length
  const blockedCount = rows.filter((row) => row.tone === "blocked").length
  const emptyCount = rows.filter((row) => row.tone === "empty").length
  const totalDomains = versionWorkbenchDomains.length
  const tone: ImportVersionWorkbenchTone =
    blockedCount > 0 ? "blocked" : readyCount > 0 ? "ready" : "empty"

  return {
    tone,
    title:
      readyCount > 0
        ? `当前已形成 ${readyCount.toLocaleString("zh-CN")} 个业务域版本`
        : "当前还没有可用业务版本",
    detail: businessDate
      ? `业务日 ${businessDate} · 当前筛出 ${rows.length.toLocaleString("zh-CN")} / ${totalDomains.toLocaleString("zh-CN")} 个业务域`
      : `当前筛出 ${rows.length.toLocaleString("zh-CN")} / ${totalDomains.toLocaleString("zh-CN")} 个业务域`,
    totalDomains,
    readyCount,
    blockedCount,
    emptyCount,
    rows,
  }
}

function summarizeImportVersionWorkbenchRow(
  domain: (typeof versionWorkbenchDomains)[number],
  batches: ImportBatchListRow[],
  comparisonRuns: ImportComparisonRunRecord[],
  reviewCases: ImportReviewCaseRecord[]
): ImportVersionWorkbenchRow {
  const domainBatches = sortImportBatchesByUploadedAt(
    batches.filter((batch) => domain.fileTypes.includes(batch.file_type))
  )
  const latestAppliedBatch =
    domainBatches.find((batch) => batch.application_status === "applied") ?? null
  const latestObservedBatch = domainBatches[0] ?? null
  const currentBatch = latestAppliedBatch ?? latestObservedBatch

  if (!currentBatch) {
    return {
      domainKey: domain.key,
      domainLabel: domain.label,
      sourceFileLabel: domain.sourceFileLabel,
      tone: "empty",
      statusLabel: "暂无版本",
      versionLabel: "暂无",
      sourceBatchLabel: "暂无批次",
      businessDateLabel: "暂无业务日",
      visibleTimeLabel: "暂无时间",
      blockerSummary: `当前${domain.label}还没有导入批次。`,
      nextAction: "先进入导入批次列表创建或定位可用批次。",
      downstreamSummary: "暂无下游影响",
      downstreamDetail: "当前业务域还没有导入批次，无法形成对比运行或复核案例。",
      primaryActionLabel: "查看导入批次",
      primaryActionHref: "/data-quality",
      secondaryActionLabel: null,
      secondaryActionHref: null,
      comparisonCandidate: {
        tone: "empty",
        canSubmit: false,
        title: "暂无本地比对候选",
        detail: `当前${domain.label}还没有导入批次，无法判断本地比对候选。`,
        comparisonTypeLabel: "未确认",
        versionPairLabel: "暂无",
        businessDateLabel: "暂无业务日",
        actionLabel: "不可触发",
        href: null,
        sourceBatchId: null,
        request: null,
      },
    }
  }

  if (latestAppliedBatch && latestAppliedBatch.import_version_id) {
    const batchDetailHref = buildImportBatchProcessingHref(latestAppliedBatch.batch_id, {
      tab: "batch-detail",
    })
    const versionContext = summarizeImportAppliedVersionResultContext({
      batch: latestAppliedBatch,
      readiness: null,
      comparisonRuns,
      reviewCases: [],
    })
    const secondaryAction = buildVersionWorkbenchSecondaryAction({
      batchDetailHref,
      fallbackHref: buildImportBatchProcessingHref(latestAppliedBatch.batch_id, {
        tab: "result-trace",
      }),
      fallbackLabel: "查看结果追踪",
      context: versionContext,
    })
    const downstreamImpact = summarizeVersionWorkbenchDownstreamImpact({
      batch: latestAppliedBatch,
      comparisonRuns,
      reviewCases,
    })
    const comparisonCandidate = summarizeVersionWorkbenchComparisonCandidate({
      batch: latestAppliedBatch,
      allBatches: batches,
    })

    return {
      domainKey: domain.key,
      domainLabel: domain.label,
      sourceFileLabel: formatImportFileType(currentBatch.file_type),
      tone: "ready",
      statusLabel: "已形成当前版本",
      versionLabel: latestAppliedBatch.import_version_id,
      sourceBatchLabel: latestAppliedBatch.batch_id,
      businessDateLabel: latestAppliedBatch.business_date_from,
      visibleTimeLabel: formatVersionWorkbenchVisibleTime(latestAppliedBatch.uploaded_at),
      blockerSummary: `当前按最近已应用批次 ${latestAppliedBatch.batch_id} 作为版本口径。`,
      nextAction: "从当前批次详情继续核对版本记录和结果追踪。",
      downstreamSummary: downstreamImpact.summary,
      downstreamDetail: downstreamImpact.detail,
      primaryActionLabel: "查看批次详情",
      primaryActionHref: batchDetailHref,
      secondaryActionLabel: secondaryAction.label,
      secondaryActionHref: secondaryAction.href,
      comparisonCandidate,
    }
  }

  const blockedBatchDetailHref = buildImportBatchProcessingHref(currentBatch.batch_id, {
    tab: "batch-detail",
  })
  const blockedVersionContext =
    currentBatch.application_status === "applied"
      ? summarizeImportAppliedVersionResultContext({
          batch: currentBatch,
          readiness: null,
          comparisonRuns,
          reviewCases: [],
        })
      : null
  const blockedSecondaryAction = buildVersionWorkbenchSecondaryAction({
    batchDetailHref: blockedBatchDetailHref,
    fallbackHref:
      currentBatch.application_status === "applied"
        ? buildImportBatchProcessingHref(currentBatch.batch_id, {
            tab: "result-trace",
          })
        : null,
    fallbackLabel: "查看结果追踪",
    context: blockedVersionContext,
  })
  const blockedDownstreamImpact = summarizeVersionWorkbenchDownstreamImpact({
    batch: currentBatch,
    comparisonRuns,
    reviewCases,
  })
  const blockedComparisonCandidate = summarizeVersionWorkbenchComparisonCandidate({
    batch: currentBatch,
    allBatches: batches,
  })

  return {
    domainKey: domain.key,
    domainLabel: domain.label,
    sourceFileLabel: formatImportFileType(currentBatch.file_type),
    tone: "blocked",
    statusLabel:
      currentBatch.application_status === "applied" ? "版本信息缺失" : "待应用",
    versionLabel: currentBatch.import_version_id ?? "未形成当前版本",
    sourceBatchLabel: currentBatch.batch_id,
    businessDateLabel: currentBatch.business_date_from,
    visibleTimeLabel: formatVersionWorkbenchVisibleTime(currentBatch.uploaded_at),
    blockerSummary:
      currentBatch.application_status === "applied"
        ? `批次 ${currentBatch.batch_id} 已应用，但当前导入版本仍未返回。`
        : currentBatch.failed_rows > 0
          ? `最新批次仍有 ${currentBatch.failed_rows.toLocaleString("zh-CN")} 行失败，当前不能视为稳定版本。`
          : `最新批次 ${currentBatch.batch_id} 尚未应用，当前没有稳定版本口径。`,
    nextAction:
      currentBatch.application_status === "applied"
        ? "先核对版本记录和应用摘要，再继续下游追踪。"
        : "先进入当前批次处理详情，确认 readiness、失败行和应用状态。",
    downstreamSummary: blockedDownstreamImpact.summary,
    downstreamDetail: blockedDownstreamImpact.detail,
    primaryActionLabel: "查看批次详情",
    primaryActionHref: blockedBatchDetailHref,
    secondaryActionLabel: blockedSecondaryAction.label,
    secondaryActionHref: blockedSecondaryAction.href,
    comparisonCandidate: blockedComparisonCandidate,
  }
}

function normalizeVersionWorkbenchStatusFilter(
  status: ImportVersionWorkbenchFilters["status"]
): ImportVersionWorkbenchTone | null {
  if (!status || status === "all") {
    return null
  }

  return status === "applied" ? "ready" : status
}

function summarizeVersionWorkbenchComparisonCandidate({
  batch,
  allBatches,
}: {
  batch: ImportBatchListRow
  allBatches: ImportBatchListRow[]
}): ImportVersionComparisonCandidate {
  const businessDateLabel = `${batch.business_date_from} ~ ${batch.business_date_to}`
  const currentVersion = batch.import_version_id ?? "版本未返回"

  if (batch.application_status !== "applied") {
    return {
      tone: "blocked",
      canSubmit: false,
      title: "暂无本地比对候选",
      detail: "当前版本尚未应用，不能进入本地比对触发前检查。",
      comparisonTypeLabel: "未确认",
      versionPairLabel: currentVersion,
      businessDateLabel,
      actionLabel: "不可触发",
      href: null,
      sourceBatchId: batch.batch_id,
      request: null,
    }
  }

  if (!batch.import_version_id) {
    return {
      tone: "blocked",
      canSubmit: false,
      title: "暂无本地比对候选",
      detail: "当前批次已应用，但导入版本仍未返回，不能形成比对来源版本组合。",
      comparisonTypeLabel: "未确认",
      versionPairLabel: currentVersion,
      businessDateLabel,
      actionLabel: "不可触发",
      href: null,
      sourceBatchId: batch.batch_id,
      request: null,
    }
  }

  if (batch.file_type === "demand_forecast") {
    const scheduleBatch = findAppliedBatchForComparisonCandidate({
      allBatches,
      fileTypes: ["personnel_schedule"],
      batch,
    })

    if (scheduleBatch?.import_version_id) {
      return buildReadyVersionWorkbenchComparisonCandidate({
        batch,
        comparisonType: "forecast_vs_schedule",
        comparisonTypeLabel: "预测排班",
        forecastVersionId: batch.import_version_id,
        scheduleVersionId: scheduleBatch.import_version_id,
        actualImportVersionId: null,
        versionPairLabel: `${batch.import_version_id} / ${scheduleBatch.import_version_id}`,
      })
    }

    return buildBlockedVersionWorkbenchComparisonCandidate({
      batch,
      detail: "当前预测版本还缺同业务日已应用排班版本，暂不能形成预测排班比对候选。",
    })
  }

  if (batch.file_type === "personnel_schedule") {
    const actualBatch = findAppliedBatchForComparisonCandidate({
      allBatches,
      fileTypes: ["login_log", "status_log"],
      batch,
    })

    if (actualBatch?.import_version_id) {
      return buildReadyVersionWorkbenchComparisonCandidate({
        batch,
        comparisonType: "schedule_vs_actual",
        comparisonTypeLabel: "排班实际",
        forecastVersionId: null,
        scheduleVersionId: batch.import_version_id,
        actualImportVersionId: actualBatch.import_version_id,
        versionPairLabel: `${batch.import_version_id} / ${actualBatch.import_version_id}`,
      })
    }

    const forecastBatch = findAppliedBatchForComparisonCandidate({
      allBatches,
      fileTypes: ["demand_forecast"],
      batch,
    })

    if (forecastBatch?.import_version_id) {
      return buildReadyVersionWorkbenchComparisonCandidate({
        batch,
        comparisonType: "forecast_vs_schedule",
        comparisonTypeLabel: "预测排班",
        forecastVersionId: forecastBatch.import_version_id,
        scheduleVersionId: batch.import_version_id,
        actualImportVersionId: null,
        versionPairLabel: `${forecastBatch.import_version_id} / ${batch.import_version_id}`,
      })
    }

    return buildBlockedVersionWorkbenchComparisonCandidate({
      batch,
      detail:
        "当前排班版本还缺同业务日已应用预测版本或登录/状态日志版本，暂不能形成本地比对候选。",
    })
  }

  if (batch.file_type === "login_log" || batch.file_type === "status_log") {
    const scheduleBatch = findAppliedBatchForComparisonCandidate({
      allBatches,
      fileTypes: ["personnel_schedule"],
      batch,
    })

    if (scheduleBatch?.import_version_id) {
      return buildReadyVersionWorkbenchComparisonCandidate({
        batch,
        comparisonType: "schedule_vs_actual",
        comparisonTypeLabel: "排班实际",
        forecastVersionId: null,
        scheduleVersionId: scheduleBatch.import_version_id,
        actualImportVersionId: batch.import_version_id,
        versionPairLabel: `${scheduleBatch.import_version_id} / ${batch.import_version_id}`,
      })
    }

    return buildBlockedVersionWorkbenchComparisonCandidate({
      batch,
      detail: "当前实际日志版本还缺同业务日已应用排班版本，暂不能形成排班实际比对候选。",
    })
  }

  return {
    tone: "blocked",
    canSubmit: false,
    title: "暂无本地比对候选",
    detail: "主数据当前没有可直接发起的预测排班或排班实际比对口径。",
    comparisonTypeLabel: "不支持",
    versionPairLabel: batch.import_version_id,
    businessDateLabel: `${batch.business_date_from} ~ ${batch.business_date_to}`,
    actionLabel: "不可触发",
    href: null,
    sourceBatchId: batch.batch_id,
    request: null,
  }
}

function findAppliedBatchForComparisonCandidate({
  allBatches,
  fileTypes,
  batch,
}: {
  allBatches: ImportBatchListRow[]
  fileTypes: ImportFileType[]
  batch: ImportBatchListRow
}): ImportBatchListRow | null {
  return (
    sortImportBatchesByUploadedAt(
      allBatches.filter(
        (candidate) =>
          candidate.application_status === "applied" &&
          candidate.import_version_id &&
          fileTypes.includes(candidate.file_type) &&
          candidate.business_date_from <= batch.business_date_to &&
          candidate.business_date_to >= batch.business_date_from
      )
    )[0] ?? null
  )
}

function buildReadyVersionWorkbenchComparisonCandidate({
  batch,
  comparisonType,
  comparisonTypeLabel,
  forecastVersionId,
  scheduleVersionId,
  actualImportVersionId,
  versionPairLabel,
}: {
  batch: ImportBatchListRow
  comparisonType: ImportComparisonRunRecord["comparison_type"]
  comparisonTypeLabel: string
  forecastVersionId: string | null
  scheduleVersionId: string | null
  actualImportVersionId: string | null
  versionPairLabel: string
}): ImportVersionComparisonCandidate {
  return {
    tone: "ready",
    canSubmit: true,
    title: "可发起一次本地比对",
    detail: `当前版本可按 ${comparisonTypeLabel} 和已定位来源版本组合提交一次本地比对；重复提交由后端幂等返回已有运行。`,
    comparisonTypeLabel,
    versionPairLabel,
    businessDateLabel: `${batch.business_date_from} ~ ${batch.business_date_to}`,
    actionLabel: "发起一次本地比对",
    href: buildImportBatchProcessingHref(batch.batch_id, {
      tab: "result-trace",
    }),
    sourceBatchId: batch.batch_id,
    request: {
      comparisonType,
      forecastVersionId,
      scheduleVersionId,
      actualImportVersionId,
      businessDateFrom: batch.business_date_from,
      businessDateTo: batch.business_date_to,
    },
  }
}

function buildBlockedVersionWorkbenchComparisonCandidate({
  batch,
  detail,
}: {
  batch: ImportBatchListRow
  detail: string
}): ImportVersionComparisonCandidate {
  return {
    tone: "blocked",
    canSubmit: false,
    title: "暂无本地比对候选",
    detail,
    comparisonTypeLabel: "未确认",
    versionPairLabel: batch.import_version_id ?? "版本未返回",
    businessDateLabel: `${batch.business_date_from} ~ ${batch.business_date_to}`,
    actionLabel: "不可触发",
    href: null,
    sourceBatchId: batch.batch_id,
    request: null,
  }
}

function summarizeVersionWorkbenchDownstreamImpact({
  batch,
  comparisonRuns,
  reviewCases,
}: {
  batch: ImportBatchListRow
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
}): { summary: string; detail: string } {
  if (batch.application_status !== "applied") {
    return {
      summary: "等待应用后汇总",
      detail: "当前批次尚未应用，不能稳定归集这个版本已经影响的对比运行或复核案例。",
    }
  }

  const versionLabel = batch.import_version_id

  if (!versionLabel) {
    return {
      summary: "版本定位不完整",
      detail: "当前批次已应用，但导入版本仍未返回，暂时不能把下游结果稳定归到这个版本。",
    }
  }

  if (!supportsDirectVersionResultContext(batch.file_type)) {
    return {
      summary: "当前暂无直接下游结果链路",
      detail: "这个业务域当前没有可直接归集到版本行的 comparison run / review case 结果口径。",
    }
  }

  const matchedRuns = findMatchedComparisonRunsForAppliedVersion(
    batch.file_type,
    versionLabel,
    comparisonRuns
  )

  if (matchedRuns.length === 0) {
    return {
      summary: "对比运行 0 个 · 复核案例待定位",
      detail: "当前版本还没有匹配到对比运行，暂不把同业务日复核案例直接归到这个版本。",
    }
  }

  const matchedReviewCases = filterVersionWorkbenchMatchedReviewCases({
    batch,
    matchedRuns,
    reviewCases,
  })
  const openReviewCases = matchedReviewCases.filter(
    (reviewCase) => reviewCase.status !== "closed"
  )

  return {
    summary: `对比运行 ${matchedRuns.length.toLocaleString("zh-CN")} 个 · 复核案例 ${matchedReviewCases.length.toLocaleString("zh-CN")} 个`,
    detail:
      matchedReviewCases.length > 0
        ? `按当前版本已匹配的对比运行和同业务日复核类型汇总；其中未关闭 ${openReviewCases.length.toLocaleString("zh-CN")} 个。`
        : "当前版本已匹配到对比运行，但同业务日还没有归到该结果类型的复核案例。",
  }
}

function filterVersionWorkbenchMatchedReviewCases({
  batch,
  matchedRuns,
  reviewCases,
}: {
  batch: ImportBatchListRow
  matchedRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
}): ImportReviewCaseRecord[] {
  const sourceTypes = new Set(
    matchedRuns
      .map((run) => inferReviewSourceResultTypeFromComparisonType(run.comparison_type))
      .filter(
        (
          sourceType
        ): sourceType is ImportReviewCaseRecord["source_result_type"] => Boolean(sourceType)
      )
  )

  if (sourceTypes.size === 0) {
    return []
  }

  return reviewCases.filter(
    (reviewCase) =>
      reviewCase.business_date === batch.business_date_from &&
      sourceTypes.has(reviewCase.source_result_type)
  )
}

function buildVersionWorkbenchSecondaryAction({
  batchDetailHref,
  fallbackHref,
  fallbackLabel,
  context,
}: {
  batchDetailHref: string
  fallbackHref: string | null
  fallbackLabel: string
  context: ImportAppliedVersionResultContext | null
}): { label: string | null; href: string | null } {
  if (context?.primaryHref && context.primaryHref !== batchDetailHref) {
    return {
      label: context.primaryActionLabel,
      href: context.primaryHref,
    }
  }

  if (context?.secondaryHref && context.secondaryHref !== batchDetailHref) {
    return {
      label: context.secondaryActionLabel,
      href: context.secondaryHref,
    }
  }

  if (fallbackHref && fallbackHref !== batchDetailHref) {
    return {
      label: fallbackLabel,
      href: fallbackHref,
    }
  }

  return {
    label: null,
    href: null,
  }
}

function sortImportBatchesByUploadedAt(rows: ImportBatchListRow[]): ImportBatchListRow[] {
  return [...rows].sort((current, next) => {
    const uploadedRank = next.uploaded_at.localeCompare(current.uploaded_at)

    if (uploadedRank !== 0) {
      return uploadedRank
    }

    return next.batch_id.localeCompare(current.batch_id)
  })
}

function formatVersionWorkbenchVisibleTime(timestamp: string): string {
  const parsed = new Date(timestamp)

  if (Number.isNaN(parsed.getTime())) {
    return timestamp
  }

  return parsed.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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

export function summarizeImportReviewOwnerContext({
  currentCase,
  cases,
  processingStages = {},
  error = null,
  limit = 6,
}: {
  currentCase: ImportReviewCaseRecord | null
  cases: ImportReviewCaseRecord[]
  processingStages?: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
  error?: string | null
  limit?: number
}): ImportReviewOwnerContextSummary {
  if (!currentCase) {
    return {
      tone: "blocked",
      title: "Owner 上下文不可用",
      detail: error ?? "当前案例读取失败，暂不能聚合同 owner 处理上下文。",
      ownerId: null,
      businessDate: null,
      totalCount: 0,
      actionableCount: 0,
      listHref: "/data-quality/review-cases",
      stageHref: "/data-quality/review-cases",
      items: [],
    }
  }

  const listHref = buildImportReviewCasesWorkspaceHref({
    businessDate: currentCase.business_date,
    ownerId: currentCase.owner_id,
    status: "open",
  })

  if (error) {
    return {
      tone: "blocked",
      title: "同 Owner 上下文读取失败",
      detail: error,
      ownerId: currentCase.owner_id,
      businessDate: currentCase.business_date,
      totalCount: 0,
      actionableCount: 0,
      listHref,
      stageHref: listHref,
      items: [],
    }
  }

  const relatedItems = cases
    .filter(
      (reviewCase) =>
        reviewCase.case_id !== currentCase.case_id &&
        reviewCase.owner_id === currentCase.owner_id &&
        reviewCase.business_date === currentCase.business_date
    )
    .map((reviewCase) => {
      const stage = summarizeImportReviewCaseProcessingStage(
        reviewCase,
        processingStages[reviewCase.case_id]
      )

      return {
        caseId: reviewCase.case_id,
        severityLabel: formatReviewCaseSeverity(reviewCase.severity),
        statusLabel: formatReviewCaseStatus(reviewCase.status),
        stageKey: stage.key,
        stageLabel: stage.label,
        evidenceLabel: stage.evidenceLabel,
        nextAction: stage.nextAction,
        createdAt: reviewCase.created_at,
        detailHref: buildImportReviewCaseDetailWorkspaceHref(reviewCase.case_id),
        severityRank: getReviewCaseSeverityRank(reviewCase.severity),
        stageRank: getReviewCaseProcessingStageRank(stage.key),
      }
    })
    .sort(
      (a, b) =>
        a.stageRank - b.stageRank ||
        a.severityRank - b.severityRank ||
        a.createdAt.localeCompare(b.createdAt) ||
        a.caseId.localeCompare(b.caseId)
    )

  const items = relatedItems.slice(0, limit).map((item) => ({
    caseId: item.caseId,
    severityLabel: item.severityLabel,
    statusLabel: item.statusLabel,
    stageKey: item.stageKey,
    stageLabel: item.stageLabel,
    evidenceLabel: item.evidenceLabel,
    nextAction: item.nextAction,
    createdAt: item.createdAt,
    detailHref: item.detailHref,
  }))
  const actionableCount = relatedItems.filter((item) => item.stageKey !== "closed").length
  const firstActionableStage =
    relatedItems.find((item) => item.stageKey !== "closed")?.stageKey ??
    relatedItems[0]?.stageKey ??
    null
  const stageHref = firstActionableStage
    ? buildImportReviewCasesWorkspaceHref({
        businessDate: currentCase.business_date,
        ownerId: currentCase.owner_id,
        processingStage: firstActionableStage,
      })
    : listHref

  if (relatedItems.length === 0) {
    return {
      tone: "empty",
      title: "同 Owner 暂无其他案例",
      detail: `${currentCase.owner_id} 在 ${currentCase.business_date} 没有其他复核案例。`,
      ownerId: currentCase.owner_id,
      businessDate: currentCase.business_date,
      totalCount: 0,
      actionableCount: 0,
      listHref,
      stageHref,
      items: [],
    }
  }

  return {
    tone: actionableCount > 0 ? "warning" : "ready",
    title: `同 Owner 待处理 ${actionableCount.toLocaleString("zh-CN")} 个`,
    detail: `${currentCase.owner_id} 在 ${currentCase.business_date} 还有 ${relatedItems.length.toLocaleString("zh-CN")} 个其他复核案例。`,
    ownerId: currentCase.owner_id,
    businessDate: currentCase.business_date,
    totalCount: relatedItems.length,
    actionableCount,
    listHref,
    stageHref,
    items,
  }
}

export function summarizeImportReviewOwnerNavigation({
  currentCase,
  cases,
  processingStages = {},
  error = null,
}: {
  currentCase: ImportReviewCaseRecord | null
  cases: ImportReviewCaseRecord[]
  processingStages?: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
  error?: string | null
}): ImportReviewOwnerNavigationSummary {
  if (!currentCase) {
    return {
      tone: "blocked",
      title: "同 Owner 待处理导航",
      detail: error ?? "当前案例读取失败，暂不能计算同 owner 待处理导航。",
      ownerId: null,
      businessDate: null,
      listHref: "/data-quality/review-cases",
      positionLabel: "当前案例不可用",
      totalActionableCount: 0,
      current: null,
      previous: null,
      next: null,
      sequence: [],
    }
  }

  const listHref = buildImportReviewCasesWorkspaceHref({
    businessDate: currentCase.business_date,
    ownerId: currentCase.owner_id,
    status: "open",
  })

  if (error) {
    return {
      tone: "blocked",
      title: "同 Owner 待处理导航",
      detail: error,
      ownerId: currentCase.owner_id,
      businessDate: currentCase.business_date,
      listHref,
      positionLabel: "待处理序列不可用",
      totalActionableCount: 0,
      current: null,
      previous: null,
      next: null,
      sequence: [],
    }
  }

  const sameOwnerCases = new Map<string, ImportReviewCaseRecord>()
  for (const reviewCase of [currentCase, ...cases]) {
    if (
      reviewCase.owner_id === currentCase.owner_id &&
      reviewCase.business_date === currentCase.business_date
    ) {
      sameOwnerCases.set(reviewCase.case_id, reviewCase)
    }
  }

  const sequence = [...sameOwnerCases.values()]
    .map((reviewCase) => {
      const stage = summarizeImportReviewCaseProcessingStage(
        reviewCase,
        processingStages[reviewCase.case_id]
      )

      return {
        caseId: reviewCase.case_id,
        stageKey: stage.key,
        stageLabel: stage.label,
        severityLabel: formatReviewCaseSeverity(reviewCase.severity),
        createdAt: reviewCase.created_at,
        href: buildImportReviewCaseDetailWorkspaceHref(reviewCase.case_id),
        severityRank: getReviewCaseSeverityRank(reviewCase.severity),
        stageRank: getReviewCaseProcessingStageRank(stage.key),
      }
    })
    .filter((item) => item.stageKey !== "closed")
    .sort(
      (a, b) =>
        a.stageRank - b.stageRank ||
        a.severityRank - b.severityRank ||
        a.createdAt.localeCompare(b.createdAt) ||
        a.caseId.localeCompare(b.caseId)
    )
    .map((item) => ({
      caseId: item.caseId,
      stageKey: item.stageKey,
      stageLabel: item.stageLabel,
      severityLabel: item.severityLabel,
      createdAt: item.createdAt,
      href: item.href,
    }))

  const currentIndex = sequence.findIndex((item) => item.caseId === currentCase.case_id)
  const current = currentIndex >= 0 ? sequence[currentIndex] : null
  const previous = currentIndex > 0 ? sequence[currentIndex - 1] : null
  const next =
    currentIndex >= 0
      ? sequence[currentIndex + 1] ?? null
      : sequence[0] ?? null
  const positionLabel =
    currentIndex >= 0
      ? `第 ${(currentIndex + 1).toLocaleString("zh-CN")} / ${sequence.length.toLocaleString("zh-CN")} 条`
      : "当前案例不在待处理序列"

  return {
    tone: sequence.length > 0 ? "warning" : "empty",
    title: "同 Owner 待处理导航",
    detail:
      sequence.length > 0
        ? `${currentCase.owner_id} 在 ${currentCase.business_date} 有 ${sequence.length.toLocaleString("zh-CN")} 条待处理案例。`
        : `${currentCase.owner_id} 在 ${currentCase.business_date} 暂无待处理案例。`,
    ownerId: currentCase.owner_id,
    businessDate: currentCase.business_date,
    listHref,
    positionLabel,
    totalActionableCount: sequence.length,
    current,
    previous,
    next,
    sequence,
  }
}

export function summarizeImportReviewOwnerFirstPendingEntries({
  cases,
  processingStages = {},
  limit = 5,
}: {
  cases: ImportReviewCaseRecord[]
  processingStages?: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
  limit?: number
}): ImportReviewOwnerFirstPendingEntry[] {
  const groups = new Map<string, ImportReviewCaseRecord[]>()

  for (const reviewCase of cases) {
    const groupKey = `${reviewCase.owner_id}::${reviewCase.business_date}`
    const existing = groups.get(groupKey) ?? []
    existing.push(reviewCase)
    groups.set(groupKey, existing)
  }

  return [...groups.values()]
    .map((groupCases) => {
      const firstCase = groupCases[0]
      const sequence = groupCases
        .map((reviewCase) => {
          const stage = summarizeImportReviewCaseProcessingStage(
            reviewCase,
            processingStages[reviewCase.case_id]
          )

          return {
            caseId: reviewCase.case_id,
            stageKey: stage.key,
            stageLabel: stage.label,
            severityLabel: formatReviewCaseSeverity(reviewCase.severity),
            createdAt: reviewCase.created_at,
            href: buildImportReviewCaseDetailWorkspaceHref(reviewCase.case_id),
            severityRank: getReviewCaseSeverityRank(reviewCase.severity),
            stageRank: getReviewCaseProcessingStageRank(stage.key),
          }
        })
        .filter((item) => item.stageKey !== "closed")
        .sort(
          (a, b) =>
            a.stageRank - b.stageRank ||
            a.severityRank - b.severityRank ||
            a.createdAt.localeCompare(b.createdAt) ||
            a.caseId.localeCompare(b.caseId)
        )

      const firstPendingCase = sequence[0]
      if (!firstPendingCase || !firstCase) {
        return null
      }

      return {
        ownerId: firstCase.owner_id,
        businessDate: firstCase.business_date,
        totalCount: groupCases.length,
        actionableCount: sequence.length,
        listHref: buildImportReviewCasesWorkspaceHref({
          businessDate: firstCase.business_date,
          ownerId: firstCase.owner_id,
        }),
        firstPendingCase: {
          caseId: firstPendingCase.caseId,
          stageKey: firstPendingCase.stageKey,
          stageLabel: firstPendingCase.stageLabel,
          severityLabel: firstPendingCase.severityLabel,
          createdAt: firstPendingCase.createdAt,
          href: firstPendingCase.href,
        },
      }
    })
    .filter((entry): entry is ImportReviewOwnerFirstPendingEntry => entry !== null)
    .sort(
      (a, b) =>
        b.actionableCount - a.actionableCount ||
        a.ownerId.localeCompare(b.ownerId) ||
        a.businessDate.localeCompare(b.businessDate)
    )
    .slice(0, limit)
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

export function summarizeImportReviewCaseActionDeck({
  detail,
  error,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}): ImportReviewCaseActionDeckSummary {
  const evidenceAction = summarizeImportReviewCaseEvidenceAction({ detail, error })
  const conclusionAction = summarizeImportReviewCaseConclusionAction({ detail, error })
  const closureAction = summarizeImportReviewCaseClosureAction({ detail, error })

  if (error || !detail) {
    const fallbackAction = error ? "等待恢复" : "等待案例"

    return {
      tone: error ? "blocked" : "empty",
      title: "处理动作区",
      statusLabel: fallbackAction,
      primaryAction: fallbackAction,
      summary: error ?? "暂无复核案例详情。",
      nextAction: error
        ? "先恢复复核案例读取，再执行补证据、补结论或关闭。"
        : "先从复核案例工作台选择一个案例。",
      steps: buildReviewCaseActionDeckSteps({
        evidenceAction,
        conclusionAction,
        closureAction,
        primaryKey: "evidence",
      }),
    }
  }

  const isClosed = detail.case.status === "closed" || detail.closure !== null
  const evidenceCount = detail.evidence.length
  const conclusionCount = detail.conclusions.length
  const primaryKey = isClosed
    ? "closure"
    : evidenceCount === 0
      ? "evidence"
      : conclusionCount === 0
        ? "conclusion"
        : "closure"
  const primaryAction =
    primaryKey === "evidence"
      ? evidenceAction.title
      : primaryKey === "conclusion"
        ? conclusionAction.title
        : closureAction.title

  return {
    tone: isClosed ? "ready" : primaryKey === "closure" ? "warning" : "blocked",
    title: "处理动作区",
    statusLabel: isClosed
      ? "已关闭"
      : primaryKey === "evidence"
        ? "等待证据"
        : primaryKey === "conclusion"
          ? "等待结论"
          : "可关闭",
    primaryAction,
    summary: `证据 ${evidenceCount.toLocaleString("zh-CN")} 条 · 结论 ${conclusionCount.toLocaleString("zh-CN")} 条 · ${isClosed ? "已关闭" : "未关闭"}`,
    nextAction: isClosed
      ? "案例已关闭；后续只读追溯处理动作、证据和结论。"
      : primaryKey === "evidence"
        ? "先补充证据，再补充复核结论；关闭入口会在材料齐全后开放。"
        : primaryKey === "conclusion"
          ? "已有证据，继续补充复核结论；关闭入口会在材料齐全后开放。"
          : "证据和结论已齐，复核无误后提交关闭案例。",
    steps: buildReviewCaseActionDeckSteps({
      evidenceAction,
      conclusionAction,
      closureAction,
      primaryKey,
    }),
  }
}

export function summarizeImportReviewCaseActionFeedback({
  evidence,
  conclusion,
  closure,
}: {
  evidence: string | null
  conclusion: string | null
  closure: string | null
}): ImportReviewCaseActionFeedbackSummary | null {
  const action = closure
    ? { key: "closure" as const, value: closure }
    : conclusion
      ? { key: "conclusion" as const, value: conclusion }
      : evidence
        ? { key: "evidence" as const, value: evidence }
        : null

  if (!action) {
    return null
  }

  const isSuccess = action.value === "success"
  const tone = isSuccess ? "ready" : "blocked"

  if (action.key === "evidence") {
    return {
      tone,
      title: isSuccess ? "补证据提交成功" : "补证据提交失败",
      statusLabel: isSuccess ? "已写入" : "写入失败",
      detail: isSuccess
        ? "证据已写入当前复核案例；继续补充结论或复核关闭条件。"
        : "证据未写入；检查本地 API、案例状态和必填字段后重试。",
      actionKey: "evidence",
    }
  }

  if (action.key === "conclusion") {
    return {
      tone,
      title: isSuccess ? "补结论提交成功" : "补结论提交失败",
      statusLabel: isSuccess ? "已写入" : "写入失败",
      detail: isSuccess
        ? "结论已写入当前复核案例；继续复核证据和关闭条件。"
        : "结论未写入；检查本地 API、案例状态和必填字段后重试。",
      actionKey: "conclusion",
    }
  }

  return {
    tone,
    title: isSuccess ? "关闭案例提交成功" : "关闭案例提交失败",
    statusLabel: isSuccess ? "已关闭" : "写入失败",
    detail: isSuccess
      ? "关闭记录已写入；后续只读追溯处理动作、证据和结论。"
    : "关闭记录未写入；确认已有证据和结论后重试。",
    actionKey: "closure",
  }
}

export function summarizeImportReviewCaseActionContinuation({
  feedback,
  navigation,
}: {
  feedback: ImportReviewCaseActionFeedbackSummary | null
  navigation: ImportReviewOwnerNavigationSummary
}): ImportReviewCaseActionContinuationSummary | null {
  if (!feedback) {
    return null
  }

  const pendingCount = navigation.totalActionableCount
  const pendingLabel = pendingCount.toLocaleString("zh-CN")
  const currentCase = feedback.tone === "ready" ? navigation.current : null
  const nextCase = navigation.next

  if (currentCase) {
    return {
      tone: feedback.tone,
      title: "续办导航",
      statusLabel: "当前案例仍待处理",
      detail:
        navigation.ownerId && navigation.businessDate
          ? `${navigation.ownerId} 在 ${navigation.businessDate} 还有 ${pendingLabel} 条待处理案例；当前案例仍处于${currentCase.stageLabel}，建议先继续处理 ${currentCase.caseId}。`
          : `当前案例仍处于${currentCase.stageLabel}，建议先继续处理 ${currentCase.caseId}。`,
      primaryLabel: "继续处理当前案例",
      primaryHref: currentCase.href,
      primaryDetail: `${currentCase.caseId} · ${currentCase.stageLabel} · ${currentCase.severityLabel}`,
      listLabel: "返回同 Owner 列表",
      listHref: navigation.listHref,
    }
  }

  if (!nextCase) {
    return {
      tone: feedback.tone,
      title: "续办导航",
      statusLabel: pendingCount > 0 ? `还有 ${pendingLabel} 条待处理` : "暂无待处理",
      detail:
        navigation.ownerId && navigation.businessDate
          ? `${navigation.ownerId} 在 ${navigation.businessDate} 暂无下一条待处理案例；可回到列表复核筛选结果。`
          : "当前案例上下文不可用；可回到复核列表重新定位。",
      primaryLabel: "返回同 Owner 列表",
      primaryHref: navigation.listHref,
      primaryDetail: "回到当前 owner 的复核筛选列表。",
      listLabel: "返回复核列表",
      listHref: "/data-quality/review-cases",
    }
  }

  if (feedback.tone === "ready" && feedback.actionKey === "closure") {
    return {
      tone: feedback.tone,
      title: "续办导航",
      statusLabel: "当前案例已关闭",
      detail:
        navigation.ownerId && navigation.businessDate
          ? `${navigation.ownerId} 在 ${navigation.businessDate} 还有 ${pendingLabel} 条待处理案例；当前案例已关闭，建议继续处理 ${nextCase.caseId}。`
          : `当前案例已关闭；建议继续处理 ${nextCase.caseId}。`,
      primaryLabel: "关闭后处理下一条",
      primaryHref: nextCase.href,
      primaryDetail: `${nextCase.caseId} · ${nextCase.stageLabel} · ${nextCase.severityLabel}`,
      listLabel: "返回同 Owner 列表",
      listHref: navigation.listHref,
    }
  }

  return {
    tone: feedback.tone,
    title: "续办导航",
    statusLabel: `还有 ${pendingLabel} 条待处理`,
    detail:
      navigation.ownerId && navigation.businessDate
        ? `${navigation.ownerId} 在 ${navigation.businessDate} 还有 ${pendingLabel} 条待处理案例；建议继续处理 ${nextCase.caseId}。`
        : `还有 ${pendingLabel} 条待处理案例；建议继续处理 ${nextCase.caseId}。`,
    primaryLabel: feedback.tone === "ready" ? "继续处理下一条" : "查看下一条待处理",
    primaryHref: nextCase.href,
    primaryDetail: `${nextCase.caseId} · ${nextCase.stageLabel} · ${nextCase.severityLabel}`,
    listLabel: "返回同 Owner 列表",
    listHref: navigation.listHref,
  }
}

export function summarizeImportReviewCaseActionRetry(
  feedback: ImportReviewCaseActionFeedbackSummary | null
): ImportReviewCaseActionRetrySummary | null {
  if (!feedback || feedback.tone !== "blocked") {
    return null
  }

  const actionLabel = formatReviewCaseActionFeedbackKey(feedback.actionKey)

  return {
    tone: "blocked",
    title: "重试定位",
    statusLabel: `已定位到${actionLabel}`,
    detail: `${actionLabel}写入失败，当前已打开${actionLabel}入口；检查必填字段、案例状态和本地 API 后重试。`,
    tabValue: feedback.actionKey,
    actionLabel,
  }
}

function formatReviewCaseActionFeedbackKey(
  actionKey: ImportReviewCaseActionFeedbackSummary["actionKey"]
): string {
  if (actionKey === "closure") {
    return "关闭案例"
  }

  if (actionKey === "conclusion") {
    return "补结论"
  }

  return "补证据"
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

function buildReviewCaseActionDeckSteps({
  evidenceAction,
  conclusionAction,
  closureAction,
  primaryKey,
}: {
  evidenceAction: ImportReviewCaseEvidenceActionSummary
  conclusionAction: ImportReviewCaseConclusionActionSummary
  closureAction: ImportReviewCaseClosureActionSummary
  primaryKey: "evidence" | "conclusion" | "closure"
}): ImportReviewCaseActionDeckSummary["steps"] {
  return [
    {
      key: "evidence",
      title: evidenceAction.title,
      statusLabel: evidenceAction.statusLabel,
      actionLabel: evidenceAction.actionLabel,
      canSubmit: evidenceAction.canSubmit,
      isPrimary: primaryKey === "evidence",
      detail: evidenceAction.detail,
    },
    {
      key: "conclusion",
      title: conclusionAction.title,
      statusLabel: conclusionAction.statusLabel,
      actionLabel: conclusionAction.actionLabel,
      canSubmit: conclusionAction.canSubmit,
      isPrimary: primaryKey === "conclusion",
      detail: conclusionAction.detail,
    },
    {
      key: "closure",
      title: closureAction.title,
      statusLabel: closureAction.statusLabel,
      actionLabel: closureAction.actionLabel,
      canSubmit: closureAction.canSubmit,
      isPrimary: primaryKey === "closure",
      detail: closureAction.detail,
    },
  ]
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

  const batchHref = batchId ? buildImportBatchProcessingHref(batchId) : null

  if (status === "success") {
    return {
      tone: "success",
      title: "CSV 上传成功",
      detail: batchId
        ? `批次 ${batchId} 已提交并可在接入批次中查看。`
        : "CSV 已提交并可在接入批次中查看。",
      batchHref,
      primaryActionLabel: batchHref ? "进入批次处理" : "查看接入批次",
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

export function summarizeImportSingleBatchApplyAction(
  readiness: ImportApplyReadinessResponse | null,
  readinessError?: string | null
): ImportSingleBatchApplyAction {
  if (readinessError || !readiness) {
    return {
      tone: "unknown",
      canSubmit: false,
      statusLabel: "准备度未知",
      actionLabel: "暂不可应用",
      title: "准备度暂不可判断",
      detail: readinessError ?? "未返回准备度结果。",
      nextAction: "先确认本地 API 状态；不要在准备度未知时执行应用写入。",
    }
  }

  if (readiness.application_status === "applied") {
    return {
      tone: "done",
      canSubmit: false,
      statusLabel: "已应用",
      actionLabel: "无需重复应用",
      title: "批次已应用",
      detail: `已写入 ${readiness.applied_record_count} 条记录，不需要重复应用。`,
      nextAction: "继续查看下游版本、对比结果或复核案例。",
    }
  }

  if (readiness.readiness_status !== "ready") {
    const blocker =
      readiness.blockers.find((item) => item.code !== "IMPORT_BATCH_ALREADY_APPLIED")
        ?.message ??
      readiness.row_blockers[0]?.message ??
      "当前批次仍存在应用前阻塞。"

    return {
      tone: "blocked",
      canSubmit: false,
      statusLabel: "不可应用",
      actionLabel: "暂不可应用",
      title: "应用前仍有阻塞",
      detail: blocker,
      nextAction: "先处理失败行、行级缺字段或版本缺口，再重新查看准备度。",
    }
  }

  return {
    tone: "ready",
    canSubmit: true,
    statusLabel: "可应用",
    actionLabel: "应用到业务数据",
    title: "单批次应用已就绪",
    detail: `${readiness.success_rows} 行成功记录将写入 ${readiness.application_target}。`,
    nextAction: "确认版本和应用目标无误后，只对当前批次执行一次应用写入。",
  }
}

export function summarizeImportBatchApplyResultNotice({
  status,
  batchId,
  reason,
}: {
  status?: string
  batchId?: string | null
  reason?: string | null
}): ImportBatchApplyResultNotice | null {
  if (status !== "success" && status !== "failed") {
    return null
  }

  if (status === "success") {
    return {
      tone: "success",
      title: "批次应用成功",
      detail: batchId
        ? `批次 ${batchId} 已写入对应业务数据。`
        : "当前批次已写入对应业务数据。",
      nextAction: "刷新准备度和应用状态后，继续查看下游结果或复核案例。",
    }
  }

  return {
    tone: "failed",
    title: "批次应用失败",
    detail: formatImportApplyFailureReason(reason),
    nextAction: "回到状态检查区查看阻塞项；修正后只对当前批次重试。",
  }
}

export function summarizeImportAppliedResultCard({
  batch,
  readiness,
  comparisonRuns = [],
  reviewCases = [],
  applyStatus,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
  comparisonRuns?: ImportComparisonRunRecord[]
  reviewCases?: ImportReviewCaseRecord[]
  applyStatus?: string
}): ImportAppliedResultCard | null {
  const isApplied =
    batch.application_status === "applied" ||
    readiness?.application_status === "applied"

  if (!isApplied) {
    return null
  }

  const targetLabel = formatImportApplicationTarget(
    readiness?.application_target ?? batch.application_target
  )
  const versionLabel =
    readiness?.import_version_id ?? batch.import_version_id ?? "未生成"
  const appliedRecordCount = Math.max(
    batch.applied_record_count,
    readiness?.applied_record_count ?? 0
  )
  const appliedRecordLabel = `${appliedRecordCount.toLocaleString("zh-CN")} 条`
  const versionContext = summarizeImportAppliedVersionResultContext({
    batch,
    readiness,
    comparisonRuns,
    reviewCases,
  })

  if (batch.file_type === "master_data") {
    return {
      tone: applyStatus === "success" ? "success" : "done",
      statusLabel: applyStatus === "success" ? "刚完成应用" : "已应用",
      title: "业务版本结果已生成",
      detail: `当前批次已写入${targetLabel}，生成版本 ${versionLabel}；建议先核对版本记录，再进入下游结果追踪。`,
      targetLabel,
      versionLabel,
      appliedRecordLabel,
      primaryActionLabel: "查看版本记录",
      primaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "batch-detail",
      }),
      secondaryActionLabel: "查看下游结果追踪",
      secondaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "result-trace",
      }),
    }
  }

  if (versionContext?.tone === "ready") {
    return {
      tone: applyStatus === "success" ? "success" : "done",
      statusLabel: applyStatus === "success" ? "刚完成应用" : "已应用",
      title: "业务版本结果已生成",
      detail: `当前批次已写入${targetLabel}，生成版本 ${versionLabel}；已定位对应版本结果，可直接进入对比运行或复核工作台。`,
      targetLabel,
      versionLabel,
      appliedRecordLabel,
      primaryActionLabel: versionContext.primaryActionLabel,
      primaryHref: versionContext.primaryHref,
      secondaryActionLabel: versionContext.secondaryActionLabel,
      secondaryHref: versionContext.secondaryHref,
    }
  }

  return {
    tone: applyStatus === "success" ? "success" : "done",
    statusLabel: applyStatus === "success" ? "刚完成应用" : "已应用",
    title: "业务版本结果已生成",
    detail: `当前批次已写入${targetLabel}，生成版本 ${versionLabel}，可继续查看下游结果追踪或复核案例。`,
    targetLabel,
    versionLabel,
    appliedRecordLabel,
    primaryActionLabel: "查看下游结果追踪",
    primaryHref: buildImportBatchProcessingHref(batch.batch_id, {
      tab: "result-trace",
    }),
    secondaryActionLabel: "查看复核案例",
    secondaryHref: buildImportReviewCasesWorkspaceHref({
      businessDate: batch.business_date_from,
      status: "open",
    }),
  }
}

export function summarizeImportAppliedVersionResultContext({
  batch,
  readiness,
  comparisonRuns,
  reviewCases,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
  comparisonRuns: ImportComparisonRunRecord[]
  reviewCases: ImportReviewCaseRecord[]
}): ImportAppliedVersionResultContext | null {
  const isApplied =
    batch.application_status === "applied" ||
    readiness?.application_status === "applied"

  if (!isApplied) {
    return null
  }

  const targetLabel = formatImportApplicationTarget(
    readiness?.application_target ?? batch.application_target
  )
  const versionLabel = readiness?.import_version_id ?? batch.import_version_id
  const businessDate = batch.business_date_from
  const evidence = [
    `来源批次 ${batch.batch_id}`,
    `业务日 ${businessDate}`,
    `应用目标 ${targetLabel}`,
    `版本 ${versionLabel ?? "未生成"}`,
  ]

  if (!versionLabel) {
    return {
      tone: "blocked",
      title: "当前版本定位信息不完整",
      detail: "当前批次已应用，但导入版本仍未返回，无法定位对应版本详情或结果上下文。",
      sourceBatchLabel: batch.batch_id,
      versionLabel: "未生成",
      targetLabel,
      downstreamStatusLabel: "版本信息缺失",
      primaryActionLabel: "查看版本记录",
      primaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "batch-detail",
      }),
      secondaryActionLabel: "查看下游结果追踪",
      secondaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "result-trace",
      }),
      evidence,
    }
  }

  const matchedRuns = findMatchedComparisonRunsForAppliedVersion(
    batch.file_type,
    versionLabel,
    comparisonRuns
  )
  const primaryRun = matchedRuns[0] ?? null
  const openReviewCount = reviewCases.filter((reviewCase) => reviewCase.status !== "closed").length

  if (!supportsDirectVersionResultContext(batch.file_type)) {
    return {
      tone: "empty",
      title: "当前版本暂无直接结果页",
      detail: `${targetLabel}版本 ${versionLabel} 当前没有可直接进入的对比运行详情；先核对版本记录，再按业务日查看下游结果空态。`,
      sourceBatchLabel: batch.batch_id,
      versionLabel,
      targetLabel,
      downstreamStatusLabel: "暂无可匹配运行",
      primaryActionLabel: "查看版本记录",
      primaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "batch-detail",
      }),
      secondaryActionLabel: "查看下游结果追踪",
      secondaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "result-trace",
      }),
      evidence,
    }
  }

  if (!primaryRun) {
    return {
      tone: "empty",
      title: "当前版本暂未匹配到对比运行",
      detail: `当前批次版本 ${versionLabel} 还没有匹配到可直接进入的对比运行；先确认是否已触发本地比对，再查看同业务日复核空态。`,
      sourceBatchLabel: batch.batch_id,
      versionLabel,
      targetLabel,
      downstreamStatusLabel: `匹配运行 0 个 · 未关闭复核 ${openReviewCount.toLocaleString("zh-CN")} 个`,
      primaryActionLabel: "查看下游结果追踪",
      primaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "result-trace",
      }),
      secondaryActionLabel: "查看复核案例工作台",
      secondaryHref: buildImportReviewCasesWorkspaceHref({
        businessDate,
        sourceResultType: inferReviewSourceResultTypeFromFileType(batch.file_type),
      }),
      evidence,
    }
  }

  return {
    tone: "ready",
    title: "已定位对应版本结果",
    detail: `当前批次版本 ${versionLabel} 已匹配到下游结果，可直接进入对应对比运行，并继续查看同业务日复核案例。`,
    sourceBatchLabel: batch.batch_id,
    versionLabel,
    targetLabel,
    downstreamStatusLabel: `匹配运行 ${matchedRuns.length.toLocaleString("zh-CN")} 个 · 未关闭复核 ${openReviewCount.toLocaleString("zh-CN")} 个`,
    primaryActionLabel: "查看对应对比运行",
    primaryHref: buildImportComparisonRunDetailWorkspaceHref(primaryRun.run_id),
    secondaryActionLabel: "查看复核案例工作台",
    secondaryHref: buildImportReviewCasesWorkspaceHref({
      businessDate,
      sourceResultType:
        inferReviewSourceResultTypeFromComparisonType(primaryRun.comparison_type),
    }),
    evidence,
  }
}

export function summarizeImportVersionComparisonTrigger({
  batch,
  readiness,
  comparisonRuns,
}: {
  batch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  comparisonRuns: ImportComparisonRunRecord[]
}): ImportVersionComparisonTrigger | null {
  if (!batch || !readiness) {
    return null
  }

  if (readiness.application_status !== "applied" || batch.application_status !== "applied") {
    return null
  }

  const versionId = readiness.import_version_id ?? batch.import_version_id
  if (!versionId) {
    return null
  }

  const evidence = [
    `来源批次 ${batch.batch_id}`,
    `业务日 ${batch.business_date_from}`,
    `版本 ${versionId}`,
  ]

  if (!supportsDirectVersionResultContext(batch.file_type)) {
    return {
      tone: "blocked",
      canSubmit: false,
      title: "当前版本暂无可复用的本地比对入口",
      detail: `当前 ${formatImportFileType(batch.file_type)} 版本 ${versionId} 没有受控本地比对口径；先核对版本记录和下游结果追踪。`,
      actionLabel: "发起一次本地比对",
      nextAction: "仅在人员排班、需求预测、状态日志且已定位对比版本时才展示写入入口。",
      comparisonTypeLabel: "未支持",
      versionPairLabel: versionId,
      businessDateLabel: batch.business_date_from,
      evidence,
      request: null,
    }
  }

  const primaryRun =
    findMatchedComparisonRunsForAppliedVersion(batch.file_type, versionId, comparisonRuns)[0] ?? null

  if (!primaryRun) {
    return {
      tone: "blocked",
      canSubmit: false,
      title: "当前版本暂无法确认比对口径",
      detail: `当前版本 ${versionId} 还没有可复用的对比运行，暂不展示写入按钮。`,
      actionLabel: "发起一次本地比对",
      nextAction: "先确认该版本是否已有下游结果或补足配对版本，再回到当前页触发本地比对。",
      comparisonTypeLabel: "未定位",
      versionPairLabel: versionId,
      businessDateLabel: batch.business_date_from,
      evidence,
      request: null,
    }
  }

  const request = buildImportVersionComparisonTriggerRequest(primaryRun)
  if (!request) {
    return {
      tone: "blocked",
      canSubmit: false,
      title: "当前版本缺少必要来源版本",
      detail: `已定位到 ${formatComparisonTypeLabel(primaryRun.comparison_type)}，但运行上下文缺少重新计算所需的成对版本信息。`,
      actionLabel: "发起一次本地比对",
      nextAction: "先确认来源版本是否完整，再从当前版本结果页重新触发。",
      comparisonTypeLabel: formatComparisonTypeLabel(primaryRun.comparison_type),
      versionPairLabel: formatComparisonRunVersionPair(primaryRun),
      businessDateLabel: `${primaryRun.business_date_from} ~ ${primaryRun.business_date_to}`,
      evidence: [
        ...evidence,
        `对比口径 ${formatComparisonTypeLabel(primaryRun.comparison_type)}`,
      ],
      request: null,
    }
  }

  return {
    tone: "ready",
    canSubmit: true,
    title: "可在当前版本语境发起本地比对",
    detail: `将按 ${formatComparisonTypeLabel(primaryRun.comparison_type)} 和已定位版本组合重新生成一次本地对比运行。`,
    actionLabel: "发起一次本地比对",
    nextAction: "提交后留在当前结果页查看反馈，再进入新运行详情或回看结果列表。",
    comparisonTypeLabel: formatComparisonTypeLabel(primaryRun.comparison_type),
    versionPairLabel: formatComparisonRunVersionPair(primaryRun),
    businessDateLabel: `${primaryRun.business_date_from} ~ ${primaryRun.business_date_to}`,
    evidence: [
      ...evidence,
      `对比口径 ${formatComparisonTypeLabel(primaryRun.comparison_type)}`,
      `复用运行 ${primaryRun.run_id}`,
    ],
    request,
  }
}

export function summarizeImportVersionComparisonTriggerNotice({
  status,
  runId,
  reason,
}: {
  status?: string | null
  runId?: string | null
  reason?: string | null
}): ImportVersionComparisonTriggerNotice | null {
  if (status === "success" && runId) {
    return {
      tone: "success",
      title: "本地比对已生成新运行",
      detail: `当前版本语境已生成新的本地对比运行 ${runId}，可直接进入详情或回看当前结果列表。`,
      runLabel: runId,
      primaryActionLabel: "查看新对比运行",
      primaryHref: buildImportComparisonRunDetailWorkspaceHref(runId),
      secondaryActionLabel: "查看结果列表",
      secondaryHref: "#comparison-runs-list",
    }
  }

  if (status === "failed") {
    return {
      tone: "failed",
      title: "本地比对未提交",
      detail: formatImportVersionComparisonTriggerFailureReason(reason),
      runLabel: runId ?? "未生成运行",
      primaryActionLabel: "查看结果列表",
      primaryHref: "#comparison-runs-list",
      secondaryActionLabel: "留在当前版本语境",
      secondaryHref: "#import-result-trace",
    }
  }

  return null
}

export function summarizeImportLatestComparisonRunCallback({
  status,
  runId,
  comparisonRuns,
}: {
  status?: string | null
  runId?: string | null
  reason?: string | null
  comparisonRuns: ImportComparisonRunRecord[]
}): ImportLatestComparisonRunCallback | null {
  if (status !== "success" || !runId) {
    return null
  }

  const matchedRun = comparisonRuns.find((run) => run.run_id === runId) ?? null

  if (!matchedRun) {
    return {
      tone: "blocked",
      title: "最新运行结果暂未回显",
      detail: `当前页已收到运行 ${runId} 的成功反馈，但结果列表还没有回显这次运行；先刷新当前结果追踪，再进入运行详情复核。`,
      runLabel: runId,
      metricCards: [
        { label: "对比口径", value: "待回显", detail: "结果列表尚未同步" },
        { label: "结果数", value: "待回显", detail: "当前运行结果" },
        { label: "关键差异", value: "待回显", detail: "等待结果列表同步" },
        { label: "业务日", value: "待回显", detail: "等待结果列表同步" },
      ],
      primaryActionLabel: "查看新对比运行",
      primaryHref: buildImportComparisonRunDetailWorkspaceHref(runId),
      secondaryActionLabel: "查看结果列表",
      secondaryHref: "#comparison-runs-list",
    }
  }

  return {
    tone: "success",
    title: "最新一次本地比对结果",
    detail: `当前版本语境刚生成运行 ${runId}，可在当前页先确认结果规模，再进入完整运行详情。`,
    runLabel: runId,
    metricCards: [
      {
        label: "对比口径",
        value: formatComparisonTypeLabel(matchedRun.comparison_type),
        detail: formatComparisonRunStatusLabel(matchedRun.status),
      },
      {
        label: "结果数",
        value: matchedRun.total_results.toLocaleString("zh-CN"),
        detail: "当前运行结果",
      },
      {
        label: formatComparisonRunKeyMetricLabel(matchedRun),
        value: formatComparisonRunKeyMetric(matchedRun),
        detail: formatComparisonRunKeyMetricDetail(matchedRun),
      },
      {
        label: "业务日",
        value: matchedRun.business_date_from,
        detail: `至 ${matchedRun.business_date_to}`,
      },
    ],
    primaryActionLabel: "查看新对比运行",
    primaryHref: buildImportComparisonRunDetailWorkspaceHref(runId),
    secondaryActionLabel: "查看结果列表",
    secondaryHref: "#comparison-runs-list",
  }
}

export function summarizeImportVersionWorkbenchComparisonResultReview({
  status,
  runId,
  comparisonRuns,
}: {
  status?: string | null
  runId?: string | null
  comparisonRuns: ImportComparisonRunRecord[]
}): ImportVersionWorkbenchComparisonResultReview | null {
  if (status !== "success" || !runId) {
    return null
  }

  const matchedRun = comparisonRuns.find((run) => run.run_id === runId) ?? null

  if (!matchedRun) {
    return {
      tone: "blocked",
      title: "运行结果暂未回显",
      detail: `版本工作台已收到运行 ${runId} 的成功反馈，但当前结果列表还没有回显这次运行；先保留运行入口，不伪造结果规模或关键差异。`,
      runLabel: runId,
      metricCards: [
        { label: "对比口径", value: "待回显", detail: "结果列表尚未同步" },
        { label: "结果数", value: "待回显", detail: "等待运行回显" },
        { label: "关键差异", value: "待回显", detail: "等待运行回显" },
        { label: "业务日", value: "待回显", detail: "等待运行回显" },
      ],
      primaryActionLabel: "查看对比运行",
      primaryHref: buildImportComparisonRunDetailWorkspaceHref(runId),
      secondaryActionLabel: "回到版本台账",
      secondaryHref: "#version-ledger",
    }
  }

  return {
    tone: "success",
    title: "版本工作台本地比对结果",
    detail: `运行 ${runId} 已在版本工作台回显；先确认结果规模和关键差异，再进入完整对比运行详情。`,
    runLabel: runId,
    metricCards: [
      {
        label: "对比口径",
        value: formatComparisonTypeLabel(matchedRun.comparison_type),
        detail: formatComparisonRunStatusLabel(matchedRun.status),
      },
      {
        label: "结果数",
        value: matchedRun.total_results.toLocaleString("zh-CN"),
        detail: "当前运行结果",
      },
      {
        label: formatComparisonRunKeyMetricLabel(matchedRun),
        value: formatComparisonRunKeyMetric(matchedRun),
        detail: formatComparisonRunKeyMetricDetail(matchedRun),
      },
      {
        label: "业务日",
        value: matchedRun.business_date_from,
        detail: `至 ${matchedRun.business_date_to}`,
      },
    ],
    primaryActionLabel: "查看对比运行",
    primaryHref: buildImportComparisonRunDetailWorkspaceHref(runId),
    secondaryActionLabel: "回到版本台账",
    secondaryHref: "#version-ledger",
  }
}

function supportsDirectVersionResultContext(fileType: ImportFileType): boolean {
  return (
    fileType === "personnel_schedule" ||
    fileType === "demand_forecast" ||
    fileType === "login_log" ||
    fileType === "status_log"
  )
}

function inferReviewSourceResultTypeFromFileType(
  fileType: ImportFileType
): ImportReviewCaseRecord["source_result_type"] | undefined {
  if (fileType === "demand_forecast") {
    return "forecast_schedule"
  }

  if (
    fileType === "personnel_schedule" ||
    fileType === "login_log" ||
    fileType === "status_log"
  ) {
    return "schedule_actual"
  }

  return undefined
}

function inferReviewSourceResultTypeFromComparisonType(
  comparisonType: ImportComparisonRunRecord["comparison_type"]
): ImportReviewCaseRecord["source_result_type"] {
  if (comparisonType === "forecast_vs_schedule") {
    return "forecast_schedule"
  }

  return "schedule_actual"
}

function findMatchedComparisonRunsForAppliedVersion(
  fileType: ImportFileType,
  versionId: string,
  comparisonRuns: ImportComparisonRunRecord[]
): ImportComparisonRunRecord[] {
  const matchedRuns = comparisonRuns.filter((run) => {
    if (fileType === "demand_forecast") {
      return run.forecast_version_id === versionId
    }

    if (fileType === "personnel_schedule") {
      return run.schedule_version_id === versionId
    }

    if (fileType === "login_log" || fileType === "status_log") {
      return run.actual_import_version_id === versionId
    }

    return false
  })

  return matchedRuns.sort((current, next) => {
    const comparisonTypeRank =
      comparisonTypePriorityForFileType(fileType, current.comparison_type) -
      comparisonTypePriorityForFileType(fileType, next.comparison_type)

    if (comparisonTypeRank !== 0) {
      return comparisonTypeRank
    }

    const statusRank = comparisonRunCompletionRank(next.status) - comparisonRunCompletionRank(current.status)

    if (statusRank !== 0) {
      return statusRank
    }

    return next.created_at.localeCompare(current.created_at)
  })
}

function comparisonTypePriorityForFileType(
  fileType: ImportFileType,
  comparisonType: ImportComparisonRunRecord["comparison_type"]
): number {
  if (fileType === "personnel_schedule") {
    return comparisonType === "schedule_vs_actual" ? 0 : 1
  }

  if (fileType === "login_log" || fileType === "status_log") {
    return comparisonType === "schedule_vs_actual" ? 0 : 1
  }

  if (fileType === "demand_forecast") {
    return comparisonType === "forecast_vs_schedule" ? 0 : 1
  }

  return 2
}

function comparisonRunCompletionRank(
  status: ImportComparisonRunRecord["status"]
): number {
  return status === "completed" ? 1 : 0
}

function buildImportVersionComparisonTriggerRequest(
  run: ImportComparisonRunRecord
): ImportVersionComparisonTriggerRequest | null {
  if (run.comparison_type === "forecast_vs_schedule") {
    if (!run.forecast_version_id || !run.schedule_version_id) {
      return null
    }

    return {
      comparisonType: run.comparison_type,
      forecastVersionId: run.forecast_version_id,
      scheduleVersionId: run.schedule_version_id,
      actualImportVersionId: null,
      businessDateFrom: run.business_date_from,
      businessDateTo: run.business_date_to,
    }
  }

  if (!run.schedule_version_id || !run.actual_import_version_id) {
    return null
  }

  return {
    comparisonType: run.comparison_type,
    forecastVersionId: null,
    scheduleVersionId: run.schedule_version_id,
    actualImportVersionId: run.actual_import_version_id,
    businessDateFrom: run.business_date_from,
    businessDateTo: run.business_date_to,
  }
}

function formatComparisonRunVersionPair(run: ImportComparisonRunRecord): string {
  if (run.comparison_type === "forecast_vs_schedule") {
    return `${run.forecast_version_id ?? "-"} / ${run.schedule_version_id ?? "-"}`
  }

  return `${run.schedule_version_id ?? "-"} / ${run.actual_import_version_id ?? "-"}`
}

function formatImportVersionComparisonTriggerFailureReason(
  reason?: string | null
): string {
  if (!reason) {
    return "提交未返回成功结果，请先确认本地 API 与版本上下文。"
  }

  if (reason === "missing_required_fields") {
    return "提交参数不完整，当前版本语境还不足以发起本地比对。"
  }

  if (reason.startsWith("api_")) {
    return `本地比对接口返回 ${reason.replace("api_", "")}，请先核对来源版本和业务日。`
  }

  return `本地比对提交失败：${reason}`
}

function formatComparisonRunKeyMetric(run: ImportComparisonRunRecord): string {
  if (run.comparison_type === "forecast_vs_schedule") {
    return `${run.total_gap_agents?.toLocaleString("zh-CN") ?? 0} 人`
  }

  return `${run.total_late_minutes?.toLocaleString("zh-CN") ?? 0} 分钟`
}

function formatComparisonRunKeyMetricLabel(run: ImportComparisonRunRecord): string {
  if (run.comparison_type === "forecast_vs_schedule") {
    return "缺口"
  }

  return "迟到"
}

function formatComparisonRunKeyMetricDetail(run: ImportComparisonRunRecord): string {
  if (run.comparison_type === "forecast_vs_schedule") {
    return "预测排班差异"
  }

  return "排班实际差异"
}

function formatComparisonRunStatusLabel(
  status: ImportComparisonRunRecord["status"]
): string {
  if (status === "completed") {
    return "已完成"
  }

  if (status === "failed") {
    return "失败"
  }

  return "进行中"
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

export function summarizeImportFieldMappingTemplateActionNotice({
  status,
  action,
  reason,
  templateId,
}: {
  status?: string
  action?: string
  reason?: string
  templateId: string
}): ImportFieldMappingTemplateActionNotice | null {
  if (!status || !action) {
    return null
  }

  const isSuccess = status === "success"
  const isDeactivate = action === "deactivate"
  const isCreate = action === "create"
  const actionLabel = isDeactivate ? "停用" : isCreate ? "创建" : "更新"

  if (isSuccess) {
    return {
      tone: "success",
      title: isDeactivate ? "模板已停用" : isCreate ? "模板已创建" : "模板已更新",
      detail: isDeactivate
        ? `字段映射模板 ${templateId} 已停用，上传时不会再作为启用模板推荐。`
        : isCreate
          ? `字段映射模板 ${templateId} 已创建，可在上传时作为启用模板复用。`
          : `字段映射模板 ${templateId} 已保存最新名称和字段映射。`,
      nextAction: isDeactivate
        ? "返回批次处理页检查同类型模板覆盖，必要时选择其他启用模板。"
        : isCreate
          ? "继续检查当前模板字段覆盖，或返回批次处理页选择该模板上传。"
          : "返回批次处理页重新选择模板，或继续检查当前模板字段覆盖。",
    }
  }

  return {
    tone: "failed",
    title: `模板${actionLabel}失败`,
    detail: `字段映射模板 ${templateId} 未完成${actionLabel}：${reason || "未知错误"}。`,
    nextAction: isDeactivate
      ? "检查模板是否仍存在，再重新提交停用。"
      : "检查模板名称和字段映射 JSON 后重新提交。",
  }
}

export function summarizeImportTemplateUploadPrefill(
  templates: ImportFieldMappingTemplate[],
  selectedTemplateId?: string | null
): ImportTemplateUploadPrefill | null {
  if (!selectedTemplateId) {
    return null
  }

  const template = templates.find(
    (candidate) => candidate.template_id === selectedTemplateId
  )

  if (!template) {
    return {
      selectedTemplateId,
      defaultTemplateId: "",
      tone: "failed",
      title: "模板不可用于上传",
      detail: `字段映射模板 ${selectedTemplateId} 不在当前可选模板列表中。`,
      nextAction: "请返回模板管理确认模板状态，或手填字段映射 JSON 后上传。",
    }
  }

  if (!template.is_active) {
    return {
      selectedTemplateId,
      defaultTemplateId: "",
      tone: "failed",
      title: "模板不可用于上传",
      detail: `字段映射模板 ${selectedTemplateId} 已停用，上传表单不会默认使用它。`,
      nextAction: "请选择其他启用模板，或手填字段映射 JSON 后上传。",
    }
  }

  return {
    selectedTemplateId,
    defaultTemplateId: template.template_id,
    tone: "success",
    title: "已预选字段映射模板",
    detail: `${template.template_name} · ${formatImportFileType(template.file_type)} · ${Object.keys(template.field_mapping).length} 个字段`,
    nextAction:
      "确认 CSV 文件表头匹配该模板后上传；如不匹配，可改选其他模板或手填字段映射 JSON。",
  }
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

function formatImportApplyFailureReason(reason?: string | null): string {
  if (!reason) {
    return "请检查本地 API 状态、批次准备度或应用目标。"
  }

  if (reason === "missing_required_fields") {
    return "缺少批次号或文件类型。"
  }

  const apiStatus = reason.match(/^api_(\d{3})$/)
  if (apiStatus) {
    return `本地应用 API 返回 ${apiStatus[1]}。`
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
    return "登录/状态日志"
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

  const comparisonTypeLabel = formatComparisonTypeLabel(detail.run.comparison_type)
  const versionLabel = formatComparisonRunVersionLabel(detail.run)
  const businessDateLabel = `${detail.run.business_date_from} ~ ${detail.run.business_date_to}`
  const sourceExplanation = summarizeComparisonRunSourceExplanation(detail.run)
  const sourceBlocker = summarizeComparisonRunSourceBlocker(detail.run)

  return {
    tone: detail.run.status === "failed" ? "blocked" : "ready",
    title: `${detail.run.run_id} · ${comparisonTypeLabel} · ${formatComparisonRunStatus(detail.run.status)}`,
    resultReviewContext: {
      title: "完整结果回看主页",
      detail: `当前页面展示 ${detail.run.run_id} 的完整结果明细，来源版本为 ${versionLabel}，业务日 ${detail.run.business_date_from} 至 ${detail.run.business_date_to}。`,
      scopeLabel: `当前版本语境 · ${comparisonTypeLabel}`,
      sourceVersionLabel: versionLabel,
      businessDateLabel,
      sourceExplanation,
      sourceBlocker,
      nextAction: "先核对来源版本和业务日，再按明细行检查异常结果。",
    },
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
    versionLabel,
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

export function summarizeImportComparisonRunReturnLinks({
  detail,
  error,
  batches,
  batchError,
}: {
  detail: ImportComparisonRunDetailResponse | null
  error: string | null
  batches: ImportBatchListRow[]
  batchError: string | null
}): ImportComparisonRunReturnLinks {
  if (error) {
    return emptyComparisonRunReturnLinks({
      tone: "blocked",
      title: "回跳链路暂不可用",
      detail: `当前运行读取失败：${error}。`,
      versionWorkbenchLabel: "业务版本工作台",
      secondaryHref: "/data-quality/versions",
    })
  }

  if (!detail) {
    return emptyComparisonRunReturnLinks({
      tone: "empty",
      title: "等待运行语境",
      detail: "选择可读取的对比运行后，再判断来源批次和版本工作台回跳。",
      versionWorkbenchLabel: "业务版本工作台",
      secondaryHref: "/data-quality/versions",
    })
  }

  const sourceVersions = collectComparisonRunSourceVersions(detail.run)
  const evidence = sourceVersions.map(
    (sourceVersion) => `来源版本 ${sourceVersion.label} ${sourceVersion.versionId}`
  )
  const versionWorkbenchLabel = `业务版本工作台 · ${detail.run.business_date_from}`

  if (batchError) {
    return {
      tone: "blocked",
      title: "来源批次读取失败",
      detail: `当前运行能识别版本语境，但导入批次列表读取失败：${batchError}。`,
      sourceBatchLabel: "暂未定位",
      versionWorkbenchLabel,
      primaryActionLabel: "来源批次暂不可回跳",
      primaryHref: null,
      secondaryActionLabel: "查看版本工作台",
      secondaryHref: buildImportVersionWorkbenchHref({
        businessDate: detail.run.business_date_from,
      }),
      evidence,
    }
  }

  const matchedBatches = sortImportBatchesByUploadedAt(
    batches.filter((batch) =>
      sourceVersions.some((sourceVersion) =>
        isComparisonRunSourceBatchMatch(detail.run, sourceVersion, batch)
      )
    )
  )
  const primaryBatch = matchedBatches[0] ?? null

  if (!primaryBatch) {
    return {
      tone: "blocked",
      title: "来源批次未定位",
      detail:
        "当前运行能识别版本语境，但暂未在导入批次列表中匹配到来源批次；不要伪造批次回跳。",
      sourceBatchLabel: "暂未定位",
      versionWorkbenchLabel,
      primaryActionLabel: "来源批次暂不可回跳",
      primaryHref: null,
      secondaryActionLabel: "查看版本工作台",
      secondaryHref: buildImportVersionWorkbenchHref({
        businessDate: detail.run.business_date_from,
      }),
      evidence,
    }
  }

  return {
    tone: "ready",
    title: "已形成回跳闭环",
    detail: `当前运行已匹配 ${matchedBatches.length.toLocaleString("zh-CN")} 个来源批次；可回到 ${primaryBatch.batch_id} 的结果追踪，或按业务日进入版本工作台。`,
    sourceBatchLabel: matchedBatches.map((batch) => batch.batch_id).join(" · "),
    versionWorkbenchLabel,
    primaryActionLabel: "回到来源批次结果追踪",
    primaryHref: buildImportBatchProcessingHref(primaryBatch.batch_id, {
      tab: "result-trace",
    }),
    secondaryActionLabel: "查看版本工作台",
    secondaryHref: buildImportVersionWorkbenchHref({
      businessDate: detail.run.business_date_from,
      domain: mapImportFileTypeToVersionWorkbenchDomain(primaryBatch.file_type),
    }),
    evidence: [
      ...evidence,
      ...matchedBatches.map((batch) => `来源批次 ${batch.batch_id}`),
    ],
  }
}

function emptyComparisonRunReturnLinks({
  tone,
  title,
  detail,
  versionWorkbenchLabel,
  secondaryHref,
}: {
  tone: ImportVersionWorkbenchTone
  title: string
  detail: string
  versionWorkbenchLabel: string
  secondaryHref: string
}): ImportComparisonRunReturnLinks {
  return {
    tone,
    title,
    detail,
    sourceBatchLabel: "暂未定位",
    versionWorkbenchLabel,
    primaryActionLabel: "来源批次暂不可回跳",
    primaryHref: null,
    secondaryActionLabel: "查看版本工作台",
    secondaryHref,
    evidence: [],
  }
}

type ImportComparisonRunSourceVersion = {
  label: string
  versionId: string
  fileTypes: ImportFileType[]
}

function collectComparisonRunSourceVersions(
  run: ImportComparisonRunRecord
): ImportComparisonRunSourceVersion[] {
  if (run.comparison_type === "forecast_vs_schedule") {
    const sourceVersions: Array<ImportComparisonRunSourceVersion | null> = [
      run.forecast_version_id
        ? {
            label: "预测",
            versionId: run.forecast_version_id,
            fileTypes: ["demand_forecast" as const],
          }
        : null,
      run.schedule_version_id
        ? {
            label: "排班",
            versionId: run.schedule_version_id,
            fileTypes: ["personnel_schedule" as const],
          }
        : null,
    ]

    return sourceVersions.filter(isImportComparisonRunSourceVersion)
  }

  const sourceVersions: Array<ImportComparisonRunSourceVersion | null> = [
    run.schedule_version_id
      ? {
          label: "排班",
          versionId: run.schedule_version_id,
          fileTypes: ["personnel_schedule" as const],
        }
      : null,
    run.actual_import_version_id
      ? {
          label: "实际",
          versionId: run.actual_import_version_id,
          fileTypes: ["login_log" as const, "status_log" as const],
        }
      : null,
  ]

  return sourceVersions.filter(isImportComparisonRunSourceVersion)
}

function isImportComparisonRunSourceVersion(
  sourceVersion: ImportComparisonRunSourceVersion | null
): sourceVersion is ImportComparisonRunSourceVersion {
  return sourceVersion !== null
}

function isComparisonRunSourceBatchMatch(
  run: ImportComparisonRunRecord,
  sourceVersion: ImportComparisonRunSourceVersion,
  batch: ImportBatchListRow
): boolean {
  return (
    batch.application_status === "applied" &&
    batch.import_version_id === sourceVersion.versionId &&
    sourceVersion.fileTypes.includes(batch.file_type) &&
    batch.business_date_from <= run.business_date_to &&
    batch.business_date_to >= run.business_date_from
  )
}

function buildImportVersionWorkbenchHref({
  businessDate,
  domain,
}: {
  businessDate?: string | null
  domain?: ImportVersionWorkbenchDomainKey | null
}): string {
  const searchParams = new URLSearchParams()

  if (businessDate) {
    searchParams.set("businessDate", businessDate)
  }

  if (domain) {
    searchParams.set("domain", domain)
  }

  const query = searchParams.toString()
  return query ? `/data-quality/versions?${query}` : "/data-quality/versions"
}

function mapImportFileTypeToVersionWorkbenchDomain(
  fileType: ImportFileType
): ImportVersionWorkbenchDomainKey {
  if (fileType === "master_data") {
    return "master_data"
  }

  if (fileType === "personnel_schedule") {
    return "personnel_schedule"
  }

  if (fileType === "demand_forecast") {
    return "demand_forecast"
  }

  return "actual_logs"
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
    resultReviewContext: {
      title: tone === "blocked" ? "结果回看暂不可用" : "等待完整结果回看",
      detail:
        tone === "blocked"
          ? `当前页面暂不能形成完整结果回看；${businessDateDetail}。`
          : "选择可读取的对比运行后，这里会展示来源版本、业务日和完整结果回看语境。",
      scopeLabel: "当前版本语境 · 未确认",
      sourceVersionLabel: versionLabel,
      businessDateLabel: businessDate,
      sourceExplanation: "等待可读取的对比运行后再解释来源版本、业务日和结果口径。",
      sourceBlocker: tone === "blocked" ? businessDateDetail : "等待运行结果",
      nextAction:
        tone === "blocked"
          ? "先恢复对比运行读取，再回到本页检查结果明细。"
          : "先从结果追踪或复核来源进入一个对比运行。",
    },
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

function summarizeComparisonRunSourceExplanation(
  run: ImportComparisonRunRecord
): string {
  if (run.comparison_type === "forecast_vs_schedule") {
    return `预测排班口径使用预测版本 ${run.forecast_version_id ?? "未返回"} 和排班版本 ${run.schedule_version_id ?? "未返回"}，按同一业务日区间比较 0.5h 人力缺口。`
  }

  return `排班实际口径使用排班版本 ${run.schedule_version_id ?? "未返回"} 和实际日志版本 ${run.actual_import_version_id ?? "未返回"}，按同一业务日区间比较坐席排班分钟、有效生产分钟和迟到分钟。`
}

function summarizeComparisonRunSourceBlocker(
  run: ImportComparisonRunRecord
): string | null {
  if (run.comparison_type === "forecast_vs_schedule") {
    const missing = [
      run.forecast_version_id ? null : "预测版本",
      run.schedule_version_id ? null : "排班版本",
    ].filter((item): item is string => item !== null)

    return missing.length > 0 ? `来源版本不完整：缺少${missing.join("、")}。` : null
  }

  const missing = [
    run.schedule_version_id ? null : "排班版本",
    run.actual_import_version_id ? null : "实际日志版本",
  ].filter((item): item is string => item !== null)

  return missing.length > 0 ? `来源版本不完整：缺少${missing.join("、")}。` : null
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

function getReviewCaseProcessingStageRank(
  stageKey: ImportReviewOwnerStageMatrixStageKey
): number {
  return IMPORT_REVIEW_OWNER_STAGE_MATRIX_COLUMNS.findIndex(
    (column) => column.key === stageKey
  )
}

function getReviewCaseSeverityRank(severity: string): number {
  switch (severity) {
    case "critical":
      return 0
    case "high":
      return 1
    case "medium":
      return 2
    case "low":
      return 3
    default:
      return 4
  }
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
