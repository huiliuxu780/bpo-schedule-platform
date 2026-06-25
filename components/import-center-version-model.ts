import type {
  ImportFileType,
  ImportBatchListRow,
  ImportApplyReadinessResponse,
  ImportVersionWorkbenchDomainKey,
  ImportVersionWorkbenchTone,
  ImportVersionWorkbenchFilters,
  ImportVersionWorkbenchRow,
  ImportVersionComparisonCandidate,
  ImportVersionWorkbenchSummary,
  ImportAppliedResultCard,
  ImportAppliedVersionResultContext,
  ImportVersionComparisonTriggerRequest,
  ImportVersionComparisonTrigger,
  ImportVersionComparisonTriggerNotice,
  ImportLatestComparisonRunCallback,
  ImportVersionWorkbenchComparisonResultReview,
  ImportComparisonRunRecord,
  ImportReviewCaseRecord,
} from "./import-center-types"

import {
  formatImportBatchDisplayLabel,
  formatImportFileType,
} from "./import-center-formatters"

import {
  buildImportBatchProcessingHref,
  buildImportComparisonRunDetailWorkspaceHref,
  buildImportReviewCasesWorkspaceHref,
} from "./import-center-navigation"

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
        title: "暂无比对候选",
        detail: `当前${domain.label}还没有导入批次，无法判断比对候选。`,
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
      sourceBatchLabel: formatImportBatchDisplayLabel(latestAppliedBatch.batch_id),
      businessDateLabel: latestAppliedBatch.business_date_from,
      visibleTimeLabel: formatVersionWorkbenchVisibleTime(latestAppliedBatch.uploaded_at),
      blockerSummary: `当前按最近已应用批次 ${formatImportBatchDisplayLabel(latestAppliedBatch.batch_id)} 作为版本口径。`,
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
      title: "暂无比对候选",
      detail: "当前版本尚未应用，不能进入比对触发前检查。",
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
      title: "暂无比对候选",
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
      detail: "当前预测版本还缺同业务日已应用排班版本，无法形成预测排班比对候选。",
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
        "当前排班版本还缺同业务日已应用预测版本或登录/状态日志版本，无法形成比对候选。",
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
      detail: "当前实际日志版本还缺同业务日已应用排班版本，无法形成排班实际比对候选。",
    })
  }

  return {
    tone: "blocked",
    canSubmit: false,
    title: "暂无比对候选",
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
    title: "可发起比对运行",
    detail: `当前版本可按 ${comparisonTypeLabel} 和已定位来源版本组合提交一次比对；重复提交由后端幂等返回已有运行。`,
    comparisonTypeLabel,
    versionPairLabel,
    businessDateLabel: `${batch.business_date_from} ~ ${batch.business_date_to}`,
    actionLabel: "发起比对运行",
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
    title: "暂无比对候选",
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
      detail: "当前批次尚未应用，等待应用后汇总对比运行和复核案例。",
    }
  }

  const versionLabel = batch.import_version_id

  if (!versionLabel) {
    return {
      summary: "版本定位不完整",
      detail: "当前批次已应用，等待导入版本返回后汇总下游结果。",
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
      detail: "当前版本还没有匹配到对比运行，未把同业务日复核案例直接归到这个版本。",
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
      detail: `当前批次已写入${targetLabel}，生成版本 ${versionLabel}；已定位对应版本结果，可直接进入对比运行或复核案例。`,
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
  const batchLabel = formatImportBatchDisplayLabel(batch.batch_id)
  const evidence = [
    `来源批次 ${batchLabel}`,
    `业务日 ${businessDate}`,
    `应用目标 ${targetLabel}`,
    `版本 ${versionLabel ?? "未生成"}`,
  ]

  if (!versionLabel) {
    return {
      tone: "blocked",
      title: "当前版本定位信息不完整",
      detail: "当前批次已应用，但导入版本仍未返回，无法定位对应版本详情或结果上下文。",
      sourceBatchLabel: batchLabel,
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
      sourceBatchLabel: batchLabel,
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
      title: "当前版本未匹配到对比运行",
      detail: `当前批次版本 ${versionLabel} 还没有匹配到可直接进入的对比运行；先确认是否已触发比对，再查看同业务日复核空态。`,
      sourceBatchLabel: batchLabel,
      versionLabel,
      targetLabel,
      downstreamStatusLabel: `匹配运行 0 个 · 未关闭复核 ${openReviewCount.toLocaleString("zh-CN")} 个`,
      primaryActionLabel: "查看下游结果追踪",
      primaryHref: buildImportBatchProcessingHref(batch.batch_id, {
        tab: "result-trace",
      }),
      secondaryActionLabel: "查看复核案例",
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
    sourceBatchLabel: batchLabel,
    versionLabel,
    targetLabel,
    downstreamStatusLabel: `匹配运行 ${matchedRuns.length.toLocaleString("zh-CN")} 个 · 未关闭复核 ${openReviewCount.toLocaleString("zh-CN")} 个`,
    primaryActionLabel: "查看对应对比运行",
    primaryHref: buildImportComparisonRunDetailWorkspaceHref(primaryRun.run_id),
    secondaryActionLabel: "查看复核案例",
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
  const batchLabel = formatImportBatchDisplayLabel(batch.batch_id)

  const evidence = [
    `来源批次 ${batchLabel}`,
    `业务日 ${batch.business_date_from}`,
    `版本 ${versionId}`,
  ]

  if (!supportsDirectVersionResultContext(batch.file_type)) {
    return {
      tone: "blocked",
      canSubmit: false,
      title: "当前版本暂无可复用的比对入口",
      detail: `当前 ${formatImportFileType(batch.file_type)} 版本 ${versionId} 没有比对口径；先核对版本记录和下游结果追踪。`,
      actionLabel: "发起比对运行",
      nextAction: "仅在人员排班、需求预测、状态日志且已定位对比版本时才展示操作入口。",
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
      title: "当前版本无法确认比对口径",
      detail: `当前版本 ${versionId} 还没有可复用的对比运行，未展示操作按钮。`,
      actionLabel: "发起比对运行",
      nextAction: "先确认该版本是否已有下游结果或补足配对版本，再回到当前页触发比对。",
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
      actionLabel: "发起比对运行",
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
    title: "可在当前版本语境发起比对运行",
    detail: `将按 ${formatComparisonTypeLabel(primaryRun.comparison_type)} 和已定位版本组合重新生成一次对比运行。`,
    actionLabel: "发起比对运行",
    nextAction: "提交后留在当前结果页查看反馈，再进入新运行详情或回看比对运行列表。",
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
      title: "比对运行已生成",
      detail: `当前版本语境已生成新的对比运行 ${runId}，可直接进入详情或回看当前比对运行列表。`,
      runLabel: runId,
      primaryActionLabel: "查看新对比运行",
      primaryHref: buildImportComparisonRunDetailWorkspaceHref(runId),
      secondaryActionLabel: "查看比对运行列表",
      secondaryHref: "#comparison-runs-list",
    }
  }

  if (status === "failed") {
    return {
      tone: "failed",
      title: "比对未提交",
      detail: formatImportVersionComparisonTriggerFailureReason(reason),
      runLabel: runId ?? "未生成运行",
      primaryActionLabel: "查看比对运行列表",
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
      title: "最新运行结果未回显",
      detail: `当前页已收到运行 ${runId} 的成功反馈，但比对运行列表还没有回显这次运行；先刷新当前结果追踪，再进入运行详情复核。`,
      runLabel: runId,
      metricCards: [
        { label: "对比口径", value: "待回显", detail: "比对运行列表尚未同步" },
        { label: "结果数", value: "待回显", detail: "当前运行结果" },
        { label: "关键差异", value: "待回显", detail: "等待比对运行列表同步" },
        { label: "业务日", value: "待回显", detail: "等待比对运行列表同步" },
      ],
      primaryActionLabel: "查看新对比运行",
      primaryHref: buildImportComparisonRunDetailWorkspaceHref(runId),
      secondaryActionLabel: "查看比对运行列表",
      secondaryHref: "#comparison-runs-list",
    }
  }

  return {
    tone: "success",
    title: "最新一次比对运行结果",
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
    secondaryActionLabel: "查看比对运行列表",
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
      title: "运行结果未回显",
      detail: `业务版本列表已收到运行 ${runId} 的成功反馈，但当前比对运行列表还没有回显这次运行。`,
      runLabel: runId,
      metricCards: [
        { label: "对比口径", value: "待回显", detail: "比对运行列表尚未同步" },
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
    title: "业务版本列表比对运行结果",
    detail: `运行 ${runId} 已在业务版本列表回显；先确认结果规模和关键差异，再进入完整对比运行详情。`,
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
    return "提交未返回成功结果，请先确认版本上下文。"
  }

  if (reason === "missing_required_fields") {
    return "提交参数不完整，当前版本语境还不足以发起比对。"
  }

  if (reason.startsWith("api_")) {
    return `比对提交返回 ${reason.replace("api_", "")}，请先核对来源版本和业务日。`
  }

  return `比对提交失败：${reason}`
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

function normalizeFilterValue(value?: string | null): string | null {
  const normalized = value?.trim()

  return normalized ? normalized : null
}

function formatComparisonTypeLabel(
  type: ImportComparisonRunRecord["comparison_type"]
): string {
  if (type === "forecast_vs_schedule") {
    return "预测排班"
  }

  return "排班实际"
}
