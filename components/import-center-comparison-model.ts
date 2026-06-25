import type {
  ImportFileType,
  ImportBatchListRow,
  ImportVersionWorkbenchDomainKey,
  ImportVersionWorkbenchTone,
  ImportComparisonRunRecord,
  ImportForecastScheduleComparisonResultRecord,
  ImportScheduleActualComparisonResultRecord,
  ImportComparisonRunDetailResponse,
  ImportComparisonRunDetailWorkspaceTab,
  ImportComparisonRunDetailSummary,
  ImportComparisonRunReturnLinks,
  ImportComparisonRunReviewCaseSummary,
  ImportReviewCaseRecord,
  ImportReviewCaseDetailTone,
} from "./import-center-types"

import {
  formatImportBatchDisplayLabel,
} from "./import-center-formatters"

import {
  buildImportBatchProcessingHref,
  buildImportComparisonRunDetailWorkspaceHref,
  buildImportReviewCaseDetailWorkspaceHref,
} from "./import-center-navigation"

type ImportComparisonRunSourceVersion = {
  label: string
  versionId: string
  fileTypes: ImportFileType[]
}

const COMPARISON_RUN_DETAIL_WORKSPACE_TABS: ImportComparisonRunDetailWorkspaceTab[] = [
  { key: "overview", label: "总览" },
  { key: "source", label: "来源链路" },
  { key: "results", label: "结果明细" },
  { key: "reviews", label: "复核案例" },
]

function sortImportBatchesByUploadedAt(rows: ImportBatchListRow[]): ImportBatchListRow[] {
  return [...rows].sort((current, next) => {
    const uploadedRank = next.uploaded_at.localeCompare(current.uploaded_at)

    if (uploadedRank !== 0) {
      return uploadedRank
    }

    return next.batch_id.localeCompare(current.batch_id)
  })
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

function formatReviewCaseDetailSource(reviewCase: ImportReviewCaseRecord): string {
  return `${formatReviewCaseSourceType(reviewCase.source_result_type)} #${reviewCase.source_result_id}`
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
    workspaceTabs: [...COMPARISON_RUN_DETAIL_WORKSPACE_TABS],
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
    detailHref: buildImportComparisonRunDetailWorkspaceHref(detail.run.run_id),
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
      nextAction: "继续查看结果明细。",
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
      title: "回跳链路不可用",
      detail: `当前运行读取失败：${error}。`,
      versionWorkbenchLabel: "业务版本列表",
      secondaryHref: "/data-quality/versions",
    })
  }

  if (!detail) {
    return emptyComparisonRunReturnLinks({
      tone: "empty",
      title: "等待运行语境",
      detail: "选择可读取的对比运行后，再判断来源批次和业务版本列表回跳。",
      versionWorkbenchLabel: "业务版本列表",
      secondaryHref: "/data-quality/versions",
    })
  }

  const sourceVersions = collectComparisonRunSourceVersions(detail.run)
  const evidence = sourceVersions.map(
    (sourceVersion) => `来源版本 ${sourceVersion.label} ${sourceVersion.versionId}`
  )
  const versionWorkbenchLabel = `业务版本列表 · ${detail.run.business_date_from}`

  if (batchError) {
    return {
      tone: "blocked",
      title: "来源批次读取失败",
      detail: `当前运行能识别版本语境，但导入批次列表读取失败：${batchError}。`,
      sourceBatchLabel: "未定位",
      versionWorkbenchLabel,
      primaryActionLabel: "来源批次不可回跳",
      primaryHref: null,
      secondaryActionLabel: "查看版本列表",
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
        "当前运行能识别版本语境，但未在导入批次列表中匹配到来源批次。",
      sourceBatchLabel: "未定位",
      versionWorkbenchLabel,
      primaryActionLabel: "来源批次不可回跳",
      primaryHref: null,
      secondaryActionLabel: "查看版本列表",
      secondaryHref: buildImportVersionWorkbenchHref({
        businessDate: detail.run.business_date_from,
      }),
      evidence,
    }
  }

  return {
    tone: "ready",
    title: "已形成回跳闭环",
    detail: `当前运行已匹配 ${matchedBatches.length.toLocaleString("zh-CN")} 个来源批次；可回到 ${formatImportBatchDisplayLabel(primaryBatch.batch_id)} 的结果追踪，或按业务日进入业务版本列表。`,
    sourceBatchLabel: matchedBatches
      .map((batch) => formatImportBatchDisplayLabel(batch.batch_id))
      .join(" · "),
    versionWorkbenchLabel,
    primaryActionLabel: "回到来源批次结果追踪",
    primaryHref: buildImportBatchProcessingHref(primaryBatch.batch_id, {
      tab: "result-trace",
    }),
    secondaryActionLabel: "查看版本列表",
    secondaryHref: buildImportVersionWorkbenchHref({
      businessDate: detail.run.business_date_from,
      domain: mapImportFileTypeToVersionWorkbenchDomain(primaryBatch.file_type),
    }),
    evidence: [
      ...evidence,
      ...matchedBatches.map(
        (batch) => `来源批次 ${formatImportBatchDisplayLabel(batch.batch_id)}`
      ),
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
    sourceBatchLabel: "未定位",
    versionWorkbenchLabel,
    primaryActionLabel: "来源批次不可回跳",
    primaryHref: null,
    secondaryActionLabel: "查看版本列表",
    secondaryHref,
    evidence: [],
  }
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
    workspaceTabs: [...COMPARISON_RUN_DETAIL_WORKSPACE_TABS],
    resultReviewContext: {
      title: tone === "blocked" ? "结果回看不可用" : "等待完整结果回看",
      detail:
        tone === "blocked"
          ? `当前页面无法形成完整结果回看；${businessDateDetail}。`
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
    detailHref: "/data-quality/comparison-runs",
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
