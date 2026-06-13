import type {
  ImportFileType,
  ImportReadinessStatus,
  ImportBatchListRow,
  ImportBatchRowResult,
  ImportBatchPersistenceDetail,
  ImportApplyReadinessResponse,
  ImportBatchDetailSummary,
  ImportBatchDetailWorkspaceTab,
  ImportBatchDetailReadability,
  ImportQualityExceptionTrace,
  ImportQualityImpactIssueGroup,
  ImportQualityImpactAggregation,
  ImportReviewConclusionPreview,
  ImportReviewEvidenceGapTone,
  ImportReviewEvidenceGapItem,
  ImportReviewEvidenceGapDrilldown,
  ImportBatchHealth,
  ImportRowCorrectionNotice,
  ImportUploadResultGuidance,
  ImportApplyActionGuidance,
  ImportSingleBatchApplyAction,
  ImportBatchApplyResultNotice,
  ImportReadinessIssueGroup,
  ImportApplicationVisibility,
  ImportDownstreamResultNavigation,
  ImportComparisonRunRecord,
  ImportReviewCaseRecord,
  ImportResultTrace,
  ImportDownstreamResultDrilldown,
  ImportPageHierarchyDetailTab,
  ImportPageHierarchy,
  ImportBatchReviewGuide,
  ImportExceptionGuidance,
} from "./import-center-types"

import {
  formatImportApplicationStatus,
  formatImportRowStatus,
} from "./import-center-formatters"

import {
  buildImportBatchProcessingHref,
  buildImportComparisonRunsUrl,
  buildImportComparisonRunDetailWorkspaceHref,
  buildImportReviewCasesUrl,
  buildImportReviewCasesWorkspaceHref,
  buildImportReviewCaseDetailWorkspaceHref,
  buildImportQualityIssueReviewCasesHref,
} from "./import-center-navigation"

const importBatchDetailWorkspaceTabs: ImportBatchDetailWorkspaceTab[] = [
  { key: "overview", label: "总览" },
  { key: "processing", label: "处理摘要" },
  { key: "exception-trace", label: "异常追踪" },
  { key: "versions", label: "版本记录" },
  { key: "rows", label: "行结果" },
]

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
    detail: "当前批次没有失败行；准备度不可判断，先查看批次明细和应用准备度区域。",
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
      detail: "当前批次准备度为可应用。",
      nextAction: "复核应用目标、版本和批次明细。",
    }
  }

  return {
    tone: "unknown",
    statusLabel,
    targetLabel,
    versionLabel,
    appliedRecordLabel,
    title: "等待准备度确认",
    detail: "当前批次尚未应用，准备度需要继续确认；先核对批次明细。",
    nextAction: "准备度未知时只做查看和修正，先确认准备度再应用。",
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
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响对比与复核判断。",
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
          ? "等待应用"
          : "等待应用状态确认",
      detail:
        readiness?.readiness_status === "ready"
          ? "当前批次已通过应用前检查，但还没有形成已应用版本；下游结果需要等待应用完成。"
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
    primaryActionLabel: "查看对比结果",
    primaryHref: `/data-quality/versions?businessDate=${encodeURIComponent(businessDate)}`,
    secondaryActionLabel: "查看复核案例",
    secondaryHref: buildImportReviewCasesWorkspaceHref({ businessDate }),
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
      nextAction: "先刷新结果追踪；读取失败时保留当前批次的下游判断。",
    }
  }

  if (!businessDate || (comparisonRuns.length === 0 && reviewCases.length === 0)) {
    return {
      tone: "empty",
      title: businessDate ? "未找到下游结果" : "等待批次业务日",
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
      nextAction: "先刷新结果追踪，再回到批次应用状态和业务日范围判断。",
      comparisonFocus: comparisonError ? "对比结果读取失败" : formatDrilldownComparisonFocus(primaryComparisonRun),
      reviewFocus: reviewError ? "复核案例读取失败" : formatDrilldownReviewFocus(primaryReviewCase),
      primaryActionLabel: "查看对比结果",
      primaryHref: businessDate
        ? buildImportComparisonRunsUrl(businessDate)
        : "/data-quality/versions",
      secondaryActionLabel: "查看复核案例",
      secondaryHref: businessDate
        ? buildImportReviewCasesUrl(businessDate)
        : "/data-quality/review-cases",
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
      detail: "当前批次尚未形成可用下游结果；失败行或准备度阻塞会影响对比与复核判断。",
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
      primaryActionLabel: "查看对比结果",
      primaryHref: buildImportComparisonRunsUrl(businessDate),
      secondaryActionLabel: "查看复核案例",
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
        ? buildImportReviewCaseDetailWorkspaceHref(primaryReviewCase.case_id)
        : primaryComparisonRun
          ? buildImportComparisonRunDetailWorkspaceHref(primaryComparisonRun.run_id)
          : buildImportComparisonRunsUrl(businessDate),
    secondaryActionLabel: hasOpenReviewCases ? "查看关联对比运行" : "查看复核案例",
    secondaryHref: primaryComparisonRun
      ? buildImportComparisonRunDetailWorkspaceHref(primaryComparisonRun.run_id)
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
    primaryRegion: "导入批次",
    inspectorRegion: selectedBatch ? "状态检查" : "等待选择批次",
    detailTabs: ["状态检查", "失败行修正", "批次明细", "结果追踪", "导入与模板"],
    defaultDetailTab,
    utilityPlacement: "导入与模板作为批次处理辅助入口",
    layoutIntent: "先看处理总览，再进入批次明细。",
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
    workspaceTabs: [...importBatchDetailWorkspaceTabs],
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
      detail: `当前批次共 ${summary.totalRows.toLocaleString("zh-CN")} 行，${summary.failedRows.toLocaleString("zh-CN")} 行失败、${summary.warningRows.toLocaleString("zh-CN")} 行警告；失败行会阻塞应用。`,
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
      issueSummary: "当前批次还没有行结果，无法判断对履约异常的影响。",
      nextAction: "先确认导入解析结果，再继续查看异常影响范围。",
      evidenceLabel,
    }
  }

  if (summary.failedRows > 0) {
    return {
      tone: "blocked",
      title: "履约异常判断被导入数据阻塞",
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
      title: "无法生成结论预览",
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
      suggestedConclusion: "当前业务日还没有复核案例或对比结果，未形成结论预览。",
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
      nextAction: "先处理首要质量问题和未关闭复核案例，确认补证后再进入关闭流程。",
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
      nextAction: "复核质量问题证据后，再进入关闭流程。",
      evidence,
    }
  }

  return {
    tone: "ready",
    title: "可作为关闭前摘要",
    suggestedConclusion: "当前未发现未关闭复核案例或行级质量问题，可作为关闭前摘要。",
    evidenceSummary: formatReviewConclusionEvidenceSummary({
      primaryComparisonRun,
      primaryReviewCase,
      qualityImpact,
      comparisonError,
      reviewError,
    }),
    residualRisk: "仍需在正式关闭写入前确认业务证据和责任人意见。",
    nextAction: "复核证据和责任人意见后再关闭。",
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
      title: "无法判断证据缺口",
      summary: `${reviewError ? "复核案例读取失败" : "对比结果读取失败"}，当前缺口列表只能作为占位。`,
      ownerSummary: "owner 不可用",
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
      summary: "当前业务日没有未关闭复核案例，未形成证据缺口列表。",
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
      nextAction: "检查字段 JSON、行号后重新提交。",
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
        ? `批次 ${batchId} 已提交，可继续查看行结果和应用准备度。`
        : "CSV 已提交，可继续查看行结果和应用准备度。",
      batchHref,
      primaryActionLabel: batchHref ? "进入处理详情" : "查看处理结果",
      nextAction:
        "查看批次行结果、失败行和应用准备度；确认无阻塞后再应用到业务数据。",
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
      title: "准备度不可判断",
      detail: readinessError ?? "未返回准备度结果。",
      nextAction: "先核对批次明细；准备度未知时先不要应用。",
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
    nextAction: "复核版本和目标对象后，再应用到业务数据。",
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
      actionLabel: "不可应用",
      title: "准备度不可判断",
      detail: readinessError ?? "未返回准备度结果。",
      nextAction: "先核对批次明细；准备度未知时先不要应用。",
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
      actionLabel: "不可应用",
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

export function summarizeImportReadinessIssueGroups(
  readiness: ImportApplyReadinessResponse | null,
  readinessError?: string | null
): ImportReadinessIssueGroup[] {
  if (readinessError || !readiness) {
    return [
      {
        key: "unknown",
        tone: "unknown",
        title: "准备度不可判断",
        count: 1,
        detail: readinessError ?? "未返回准备度结果。",
        nextAction: "先核对批次明细；准备度未知时先不要应用。",
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
        nextAction: "继续复核应用目标和下游结果；可在应用入口完成写入。",
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
      nextAction: "先刷新批次列表；批次不可读时先不要继续判断准备度。",
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
      nextAction: "先刷新准备度；准备度未知时先不要应用或进入复核。",
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
      nextAction: "可先手填字段映射 JSON，或新建字段映射模板。",
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
    return `提交返回 ${reason.replace("api_", "")}。`
  }

  return reason
}

function formatImportUploadFailureReason(reason?: string | null): string {
  if (!reason) {
    return "请检查批次号、字段映射或 CSV 文件。"
  }

  if (reason === "missing_required_fields") {
    return "缺少批次号、业务日期或 CSV 文件。"
  }

  const apiStatus = reason.match(/^api_(\d{3})$/)
  if (apiStatus) {
    return `上传返回 ${apiStatus[1]}，可能是批次号重复或请求不满足校验。`
  }

  return decodeURIComponent(reason)
}

function formatImportApplyFailureReason(reason?: string | null): string {
  if (!reason) {
    return "请检查批次准备度或应用目标。"
  }

  if (reason === "missing_required_fields") {
    return "缺少批次号或文件类型。"
  }

  const apiStatus = reason.match(/^api_(\d{3})$/)
  if (apiStatus) {
    return `应用返回 ${apiStatus[1]}。`
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
    return `人员排班已应用 ${recordCount} 条记录，可继续查看预测 vs 排班或排班 vs 实际登录/状态的结果列表。`
  }

  if (batch.file_type === "demand_forecast") {
    return `需求预测已应用 ${recordCount} 条记录，可继续查看预测 vs 排班的结果列表。`
  }

  if (batch.file_type === "login_log" || batch.file_type === "status_log") {
    return `实际日志已应用 ${recordCount} 条记录，可继续查看排班 vs 实际登录/状态的结果列表。`
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
