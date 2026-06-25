import type {
  ImportComparisonRunRecord,
  ImportReviewCaseRecord,
  ImportReviewCaseSourceResultRecord,
  ImportReviewCaseSourceTraceVersionRecord,
  ImportReviewCaseSourceTraceVersionRow,
  ImportReviewCaseSourceTraceRecord,
  ImportReviewCaseDetailResponse,
  ImportReviewCaseProcessingStageSnapshot,
  ImportReviewCaseProcessingStageSummary,
  ImportReviewOwnerStageMatrixStageKey,
  ImportReviewOwnerStageMatrixColumn,
  ImportReviewOwnerStageMatrixRow,
  ImportReviewOwnerStageMatrixSummary,
  ImportReviewOwnerContextSummary,
  ImportReviewOwnerNavigationSummary,
  ImportReviewOwnerFirstPendingEntry,
  ImportReviewCaseDetailSummary,
  ImportReviewCaseDetailWorkspaceTab,
  ImportReviewCaseEvidenceChainSummary,
  ImportReviewCaseProcessingTimelineSummary,
  ImportReviewCaseActionDeckSummary,
  ImportReviewCaseActionFeedbackSummary,
  ImportReviewCaseActionContinuationSummary,
  ImportReviewCaseActionRetrySummary,
  ImportReviewCaseAcceptanceBlockSummary,
  ImportReviewCaseAcceptanceStageCoverage,
  ImportReviewCaseClosureActionSummary,
  ImportReviewCaseDetailAcceptanceSummary,
  ImportReviewCaseEvidenceActionSummary,
  ImportReviewCaseConclusionActionSummary,
  ImportReviewEvidenceWritePayload,
  ImportReviewConclusionWritePayload,
  ImportReviewCaseClosureWritePayload,
  ImportReviewCasesWorkspaceFilters,
  ImportReviewCasesWorkspaceGroup,
  ImportReviewCasesOwnerGroup,
  ImportReviewCasesWorkspaceSummary,
} from "./import-center-types"

import {
  buildImportBatchProcessingHref,
  buildImportComparisonRunDetailWorkspaceHref,
  buildImportReviewCaseClosureWriteApiUrl,
  buildImportReviewEvidenceWriteApiUrl,
  buildImportReviewConclusionWriteApiUrl,
  buildImportReviewCasesWorkspaceHref,
  buildImportReviewCaseDetailWorkspaceHref,
} from "./import-center-navigation"

const REVIEW_CASE_DETAIL_WORKSPACE_TABS: ImportReviewCaseDetailWorkspaceTab[] = [
  { key: "overview", label: "总览" },
  { key: "source", label: "来源链路" },
  { key: "evidence", label: "证据结论" },
  { key: "actions", label: "处理动作" },
  { key: "owner", label: "Owner 导航" },
]

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
    nextAction: "证据和结论已齐，进入关闭入口。",
    evidenceLabel,
  }
}

export function summarizeImportReviewCaseAcceptanceBlock({
  cases,
  filters,
  processingStages = {},
  error,
}: {
  cases: ImportReviewCaseRecord[]
  filters: ImportReviewCasesWorkspaceFilters
  processingStages?: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
  error: string | null
}): ImportReviewCaseAcceptanceBlockSummary {
  if (error) {
    return {
      tone: "blocked",
      title: "复核案例读取受阻",
      statusLabel: "读取受阻",
      detail: error,
      primaryActionLabel: "返回复核列表",
      primaryHref: "/data-quality/review-cases",
      stageCoverage: [],
      nextAction: "先恢复复核案例读取，再判断队列处理路径。",
    }
  }

  const filteredCases = filterImportReviewCases(cases, filters, processingStages)

  if (filteredCases.length === 0) {
    return {
      tone: "empty",
      title: "暂无复核案例",
      statusLabel: "空队列",
      detail: "当前筛选条件下没有需要处理的复核案例。",
      primaryActionLabel: "返回复核列表",
      primaryHref: "/data-quality/review-cases",
      stageCoverage: buildReviewCaseAcceptanceStageCoverage([], processingStages),
      nextAction: "放宽筛选条件或回到复核列表查看全部案例。",
    }
  }

  const stageItems = filteredCases.map((reviewCase) => {
    const stage = summarizeImportReviewCaseProcessingStage(
      reviewCase,
      processingStages[reviewCase.case_id]
    )

    return { reviewCase, stage }
  })
  const actionableItems = stageItems.filter((item) => item.stage.key !== "closed")
  const primaryItem = [...actionableItems].sort(
    (a, b) =>
      getReviewCaseProcessingStageRank(a.stage.key) -
        getReviewCaseProcessingStageRank(b.stage.key) ||
      getReviewCaseSeverityRank(a.reviewCase.severity) -
        getReviewCaseSeverityRank(b.reviewCase.severity) ||
      a.reviewCase.created_at.localeCompare(b.reviewCase.created_at) ||
      a.reviewCase.case_id.localeCompare(b.reviewCase.case_id)
  )[0]

  const openCount = actionableItems.length

  if (!primaryItem) {
    return {
      tone: "ready",
      title: "队列处理路径",
      statusLabel: "当前队列已清空",
      detail: `当前筛选结果有 ${filteredCases.length.toLocaleString("zh-CN")} 个复核案例，暂无待处理案例。`,
      primaryActionLabel: "回看已关闭案例",
      primaryHref: buildImportReviewCaseDetailWorkspaceHref(filteredCases[0].case_id),
      stageCoverage: buildReviewCaseAcceptanceStageCoverage(filteredCases, processingStages),
      nextAction: "可以回看已关闭案例的来源、证据和结论。",
    }
  }

  return {
    tone: isHighRiskReviewSeverity(primaryItem.reviewCase.severity) ? "blocked" : "warning",
    title: "队列处理路径",
    statusLabel: `优先处理${primaryItem.stage.label}`,
    detail: `当前筛选结果有 ${filteredCases.length.toLocaleString("zh-CN")} 个复核案例，${openCount.toLocaleString("zh-CN")} 个仍待处理；优先进入${primaryItem.stage.label}案例。`,
    primaryActionLabel: `处理 ${primaryItem.reviewCase.case_id}`,
    primaryHref: buildImportReviewCaseDetailWorkspaceHref(primaryItem.reviewCase.case_id),
    stageCoverage: buildReviewCaseAcceptanceStageCoverage(filteredCases, processingStages),
    nextAction: primaryItem.stage.nextAction,
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
      detail: error ?? "当前案例读取失败，无法聚合同 owner 处理上下文。",
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
      detail: error ?? "当前案例读取失败，无法计算同 owner 待处理导航。",
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
      workspaceTabs: [...REVIEW_CASE_DETAIL_WORKSPACE_TABS],
      sourceLabel: "来源不可用",
      sourceResultDimensions: ["来源不可用"],
      sourceResultMetrics: ["等待服务恢复"],
      sourceTraceRun: "来源链路不可用",
      sourceTraceHref: "/data-quality/review-cases",
      sourceTraceVersions: ["等待服务恢复"],
      sourceTraceVersionRows: [],
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
      workspaceTabs: [...REVIEW_CASE_DETAIL_WORKSPACE_TABS],
      sourceLabel: "来源未选择",
      sourceResultDimensions: ["等待案例"],
      sourceResultMetrics: ["等待来源结果"],
      sourceTraceRun: "等待来源链路",
      sourceTraceHref: "/data-quality/review-cases",
      sourceTraceVersions: ["等待案例"],
      sourceTraceVersionRows: [],
      ownerLabel: "owner 未选择",
      evidenceLabel: "证据未选择",
      qualityFocus: "等待案例详情",
      evidenceGap: "还没有可展示的复核案例详情。",
      nextAction: "先从复核案例列表选择一个案例。",
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
    workspaceTabs: [...REVIEW_CASE_DETAIL_WORKSPACE_TABS],
    sourceLabel,
    sourceResultDimensions: sourceResultSummary.dimensions,
    sourceResultMetrics: sourceResultSummary.metrics,
    sourceTraceRun: sourceTraceSummary.run,
    sourceTraceHref: sourceTraceSummary.href,
    sourceTraceVersions: sourceTraceSummary.versions,
    sourceTraceVersionRows: sourceTraceSummary.versionRows,
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
    detailHref: buildImportReviewCaseDetailWorkspaceHref(reviewCase.case_id),
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

export function summarizeImportReviewCaseDetailAcceptance({
  detail,
  error,
  navigation,
}: {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
  navigation: ImportReviewOwnerNavigationSummary
}): ImportReviewCaseDetailAcceptanceSummary {
  if (error || !detail) {
    return {
      tone: error ? "blocked" : "empty",
      title: error ? "复核案例读取受阻" : "等待复核案例",
      statusLabel: error ? "读取受阻" : "等待案例",
      detail: error ?? "先从复核案例列表选择一个案例。",
      primaryActionLabel: "返回复核列表",
      primaryHref: "/data-quality/review-cases",
      steps: [],
      nextAction: error
        ? "先恢复复核案例读取，再判断单案例处理路径。"
        : "先从复核案例列表选择一个案例。",
    }
  }

  const isClosed = detail.case.status === "closed" || detail.closure !== null
  const hasSource = detail.source_result !== null && detail.source_result !== undefined
  const evidenceCount = detail.evidence.length
  const conclusionCount = detail.conclusions.length
  const hasEvidence = evidenceCount > 0
  const hasConclusion = conclusionCount > 0
  const continuationStep = buildReviewCaseDetailContinuationStep(navigation)
  const primaryAction = isClosed
    ? {
        label: "回看关闭依据",
        href: buildImportReviewCaseDetailWorkspaceHref(detail.case.case_id),
        status: "已关闭",
        tone: "ready" as const,
        nextAction: "案例已关闭；继续回看来源、证据、结论和关闭记录。",
      }
    : !hasEvidence
      ? {
          label: "补充复核证据",
          href: buildImportReviewCaseDetailWorkspaceHref(detail.case.case_id),
          status: "等待证据",
          tone: "blocked" as const,
          nextAction: "先补充证据，再补充复核结论。",
        }
      : !hasConclusion
        ? {
            label: "补充复核结论",
            href: buildImportReviewCaseDetailWorkspaceHref(detail.case.case_id),
            status: "等待结论",
            tone: "blocked" as const,
            nextAction: "已有证据，继续补充复核结论。",
          }
        : {
            label: "关闭复核案例",
            href: buildImportReviewCaseDetailWorkspaceHref(detail.case.case_id),
            status: "可关闭",
            tone: "warning" as const,
            nextAction: "证据和结论已齐，复核无误后关闭案例。",
          }

  return {
    tone: primaryAction.tone,
    title: "单案例处理路径",
    statusLabel: primaryAction.status,
    detail: `${detail.case.case_id} 当前处于${primaryAction.status}状态。`,
    primaryActionLabel: primaryAction.label,
    primaryHref: primaryAction.href,
    steps: [
      {
        key: "source",
        label: "来源",
        statusLabel: hasSource ? "可追溯" : "来源待确认",
        detail: hasSource
          ? `来源结果 ${detail.case.source_result_type} #${detail.case.source_result_id} 可回看。`
          : "暂未读取到来源结果，先确认来源链路。",
      },
      {
        key: "evidence",
        label: "证据",
        statusLabel: hasEvidence ? `证据 ${evidenceCount.toLocaleString("zh-CN")} 条` : "缺证据",
        detail: hasEvidence ? "已有复核证据，可继续判断结论。" : "先补充可追溯的复核证据。",
      },
      {
        key: "conclusion",
        label: "结论",
        statusLabel: hasConclusion
          ? `结论 ${conclusionCount.toLocaleString("zh-CN")} 条`
          : hasEvidence
            ? "缺结论"
            : "等待证据",
        detail: hasConclusion
          ? "已有复核结论，可继续判断关闭条件。"
          : hasEvidence
            ? "已有证据，继续补充复核结论。"
            : "证据补齐后再补充复核结论。",
      },
      {
        key: "closure",
        label: "关闭",
        statusLabel: isClosed ? "已关闭" : hasEvidence && hasConclusion ? "可关闭" : "不可关闭",
        detail: isClosed
          ? "案例已关闭，可回看关闭依据。"
          : hasEvidence && hasConclusion
            ? "证据和结论已齐，可进入关闭判断。"
            : "关闭前需要先补齐证据和结论。",
      },
      continuationStep,
    ],
    nextAction: primaryAction.nextAction,
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
      nextAction: "先从复核案例列表选择一个案例。",
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
        ? "先复核证据和结论内容，再进入关闭流程。"
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
      nextAction: "先从复核案例列表选择一个案例。",
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
      ? "案例已关闭；可追溯处理动作、证据和结论。"
      : hasEvidence && hasConclusion
        ? "证据和结论已齐，继续复核后关闭案例。"
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
        : "先从复核案例列表选择一个案例。",
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
      ? "案例已关闭；可追溯处理动作、证据和结论。"
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
        : "证据未写入；检查案例状态和必填字段后重试。",
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
        : "结论未写入；检查案例状态和必填字段后重试。",
      actionKey: "conclusion",
    }
  }

  return {
    tone,
    title: isSuccess ? "关闭案例提交成功" : "关闭案例提交失败",
    statusLabel: isSuccess ? "已关闭" : "写入失败",
    detail: isSuccess
      ? "关闭记录已写入；可追溯处理动作、证据和结论。"
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
    detail: `${actionLabel}写入失败，当前已打开${actionLabel}入口；检查必填字段和案例状态后重试。`,
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
      detail: "先从复核案例列表选择一个案例。",
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
      detail: "先从复核案例列表选择一个案例。",
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
      detail: "先从复核案例列表选择一个案例。",
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

function formatReviewCaseStatus(status: string): string {
  if (status === "closed") {
    return "已关闭"
  }

  if (status === "open") {
    return "未关闭"
  }

  return status
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
): {
  run: string
  href: string
  versions: string[]
  versionRows: ImportReviewCaseSourceTraceVersionRow[]
} {
  if (!sourceTrace) {
    return {
      run: "等待来源链路",
      href: "/data-quality/review-cases",
      versions: ["等待计算运行和版本批次"],
      versionRows: [],
    }
  }

  const versionRows = sourceTrace.versions.map(formatReviewCaseSourceTraceVersionRow)

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
    versionRows,
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

function formatReviewCaseSourceTraceVersionRow(
  version: ImportReviewCaseSourceTraceVersionRecord
): ImportReviewCaseSourceTraceVersionRow {
  const roleLabel = formatReviewCaseSourceTraceRole(version.version_role)
  const batchHref = version.batch_id
    ? buildImportBatchProcessingHref(version.batch_id)
    : null
  const businessDateLabel =
    version.business_date_from && version.business_date_to
      ? version.business_date_from === version.business_date_to
        ? `业务日 ${version.business_date_from}`
        : `业务日 ${version.business_date_from} 至 ${version.business_date_to}`
      : "业务日不可用"

  return {
    key: [
      version.version_role,
      version.business_version_id,
      version.import_version_id ?? "no-import-version",
      version.batch_id ?? "no-batch",
    ].join("::"),
    roleLabel,
    businessVersionLabel: `${roleLabel} ${version.business_version_id}`,
    importVersionLabel: version.import_version_id
      ? `导入版本 ${version.import_version_id}`
      : "导入版本不可用",
    importVersionTypeLabel: version.import_version_type
      ? formatReviewCaseSourceTraceImportType(version.import_version_type)
      : "导入类型不可用",
    batchLabel: version.batch_id ? `来源批次 ${version.batch_id}` : "来源批次不可用",
    batchHref,
    batchStatusLabel: batchHref ? "可查看批次" : "批次不可用",
    fileNameLabel: version.file_name ?? "文件名不可用",
    businessDateLabel,
  }
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

function formatReviewCaseSourceTraceImportType(
  fileType: NonNullable<ImportReviewCaseSourceTraceVersionRecord["import_version_type"]>
): string {
  if (fileType === "demand_forecast") {
    return "需求预测"
  }
  if (fileType === "personnel_schedule") {
    return "人员排班"
  }
  if (fileType === "login_log") {
    return "登录日志"
  }
  if (fileType === "status_log") {
    return "状态日志"
  }
  return "主数据"
}

function formatComparisonTypeLabel(
  type: ImportComparisonRunRecord["comparison_type"]
): string {
  if (type === "forecast_vs_schedule") {
    return "预测排班"
  }

  return "排班实际"
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
    return "案例已关闭，当前回看关闭依据和证据完整性。"
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
    return "回看关闭依据和证据完整性。"
  }

  return `owner ${reviewCase.owner_id} 先复核 ${evidenceCount.toLocaleString("zh-CN")} 条证据和 ${conclusionCount.toLocaleString("zh-CN")} 条结论，再进入关闭流程。`
}

function isQualityIssueFocusQuery(query: string): boolean {
  return query.includes(" · ") || query.includes("::")
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

function buildReviewCaseAcceptanceStageCoverage(
  cases: ImportReviewCaseRecord[],
  processingStages: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
): ImportReviewCaseAcceptanceStageCoverage[] {
  return IMPORT_REVIEW_OWNER_STAGE_MATRIX_COLUMNS.map((column) => ({
    key: column.key,
    label: column.label,
    count: cases.filter(
      (reviewCase) =>
        summarizeImportReviewCaseProcessingStage(
          reviewCase,
          processingStages[reviewCase.case_id]
        ).key === column.key
    ).length,
  }))
}

function buildReviewCaseDetailContinuationStep(
  navigation: ImportReviewOwnerNavigationSummary
): ImportReviewCaseDetailAcceptanceSummary["steps"][number] {
  if (navigation.current) {
    return {
      key: "continuation",
      label: "续办",
      statusLabel: "当前案例仍待处理",
      detail: `继续处理 ${navigation.current.caseId}，再进入同 owner 队列。`,
    }
  }

  if (navigation.next) {
    return {
      key: "continuation",
      label: "续办",
      statusLabel: "存在下一条待办",
      detail: `当前案例处理后可继续处理 ${navigation.next.caseId}。`,
    }
  }

  return {
    key: "continuation",
    label: "续办",
    statusLabel: "当前队列已清空",
    detail: "当前 owner 队列暂无下一条待处理案例。",
  }
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
