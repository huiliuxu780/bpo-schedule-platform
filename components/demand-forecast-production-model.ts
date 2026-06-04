import type { ImportBatchListRow } from "@/components/import-center-model"

export type DemandForecastProductionTone = "ready" | "blocked" | "empty"

export type DemandForecastProductionWorkspaceTabKey =
  | "overview"
  | "source"
  | "rows"
  | "comparison"

export type DemandForecastProductionWorkspaceTab = {
  key: DemandForecastProductionWorkspaceTabKey
  label: string
}

export type DemandForecastProductionRow = {
  batchId: string
  fileName: string
  versionLabel: string
  sourceBatchLabel: string
  sourceBatchHref: string
  detailHref: string
  businessDateLabel: string
  uploadedAtLabel: string
  applicationLabel: "已应用" | "待应用"
  alignmentLabel:
    | "技能组/等级/时段已对齐"
    | "等待应用后对齐"
    | "缺少版本无法对齐"
  tone: Exclude<DemandForecastProductionTone, "empty">
  appliedRecordCountLabel: string
  blockerSummary: string
  nextActionLabel: string
}

export type DemandForecastProductionDetailSummary = {
  tone: Exclude<DemandForecastProductionTone, "empty">
  title: string
  detail: string
  batchId: string
  fileName: string
  versionLabel: string
  sourceBatchHref: string
  workbenchHref: string
  businessDateLabel: string
  uploadedAtLabel: string
  applicationLabel: DemandForecastProductionRow["applicationLabel"]
  alignmentLabel: DemandForecastProductionRow["alignmentLabel"]
  appliedRecordCountLabel: string
  sourceRowLabel: string
  skillAlignmentLabel: string
  timeBucketLabel: string
  forecastScopeLabel: string
  alignmentResultLabel: string
  blockerSummary: string
  intervalRows: DemandForecastProductionIntervalRow[]
  changeRows: DemandForecastProductionChangeRow[]
  changeBoundaryLabel: string
  comparisonEntry: DemandForecastProductionComparisonEntry
  workspaceTabs: DemandForecastProductionWorkspaceTab[]
}

export type DemandForecastProductionApiDetail = {
  batch: {
    batch_id: string
    file_name: string
    uploaded_at: string
    business_date_from: string
    business_date_to: string
    total_rows: number
    success_rows: number
  }
  version: {
    forecast_version_id: string
    import_version_id: string
    business_date_from: string
    business_date_to: string
    total_intervals: number
    total_required_agents: number
  }
  intervals: DemandForecastProductionApiIntervalRow[]
  changes: DemandForecastProductionApiChangeRow[]
}

export type DemandForecastProductionApiIntervalRow = {
  forecast_interval_id: string
  forecast_version_id: string
  forecast_date: string
  interval_start: string
  interval_end: string
  workplace_id: string
  project_id: string
  skill_id: string
  demand_level: string
  required_agents: number
}

export type DemandForecastProductionApiChangeRow = {
  change_id: number
  forecast_version_id: string
  compared_from_version_id: string | null
  change_reason: string | null
}

export type DemandForecastProductionIntervalRow = {
  id: string
  dateLabel: string
  timeLabel: string
  dimensionLabel: string
  demandLevelLabel: string
  requiredAgentsLabel: string
  alignmentStatusLabel: "对齐完整" | "对齐阻塞"
  blockerLabel: string
}

export type DemandForecastProductionChangeRow = {
  id: string
  comparedFromVersionLabel: string
  changeReasonLabel: string
}

export type DemandForecastProductionComparisonEntry = {
  tone: "ready" | "blocked"
  title: string
  detail: string
  actionLabel: string
  href: string
  blockerLabel: string
}

export type DemandForecastProductionSummary = {
  tone: DemandForecastProductionTone
  title: string
  detail: string
  totalVersions: number
  appliedVersions: number
  alignedVersions: number
  blockedVersions: number
  rows: DemandForecastProductionRow[]
}

const DEMAND_FORECAST_PRODUCTION_WORKSPACE_TABS: DemandForecastProductionWorkspaceTab[] =
  [
    { key: "overview", label: "总览" },
    { key: "source", label: "来源与对齐" },
    { key: "rows", label: "预测明细" },
    { key: "comparison", label: "比对" },
  ]

export function summarizeDemandForecastProductionWorkbench(
  batches: ImportBatchListRow[]
): DemandForecastProductionSummary {
  const rows = batches
    .filter((batch) => batch.file_type === "demand_forecast")
    .sort((left, right) => right.uploaded_at.localeCompare(left.uploaded_at))
    .map(toDemandForecastProductionRow)
  const appliedVersions = rows.filter((row) => row.applicationLabel === "已应用").length
  const alignedVersions = rows.filter(
    (row) => row.alignmentLabel === "技能组/等级/时段已对齐"
  ).length
  const blockedVersions = rows.filter((row) => row.tone === "blocked").length
  const tone = resolveDemandForecastProductionTone(rows, blockedVersions)

  return {
    tone,
    title: resolveDemandForecastProductionTitle(tone),
    detail: resolveDemandForecastProductionDetail(rows.length, blockedVersions),
    totalVersions: rows.length,
    appliedVersions,
    alignedVersions,
    blockedVersions,
    rows,
  }
}

function toDemandForecastProductionRow(
  batch: ImportBatchListRow
): DemandForecastProductionRow {
  const hasVersion = Boolean(batch.import_version_id)
  const isApplied = batch.application_status === "applied"
  const isAligned = hasVersion && isApplied && batch.applied_record_count > 0
  const tone: Exclude<DemandForecastProductionTone, "empty"> = isAligned
    ? "ready"
    : "blocked"

  return {
    batchId: batch.batch_id,
    fileName: batch.file_name,
    versionLabel: batch.import_version_id ?? "暂无预测业务版本",
    sourceBatchLabel: batch.batch_id,
    sourceBatchHref: `/data-quality/import-batches/${batch.batch_id}`,
    detailHref: `/demand-plans/production/${batch.batch_id}`,
    businessDateLabel: formatBusinessDateRange(
      batch.business_date_from,
      batch.business_date_to
    ),
    uploadedAtLabel: batch.uploaded_at,
    applicationLabel: isApplied ? "已应用" : "待应用",
    alignmentLabel: resolveAlignmentLabel(hasVersion, isApplied, isAligned),
    tone,
    appliedRecordCountLabel: batch.applied_record_count.toLocaleString("zh-CN"),
    blockerSummary: resolveDemandForecastBlocker(batch, hasVersion, isApplied),
    nextActionLabel: "查看版本详情",
  }
}

export function summarizeDemandForecastProductionDetail(
  batches: ImportBatchListRow[],
  batchId: string,
  apiDetail: DemandForecastProductionApiDetail | null = null
): DemandForecastProductionDetailSummary {
  const batch = batches.find(
    (candidate) =>
      candidate.batch_id === batchId && candidate.file_type === "demand_forecast"
  )

  if (!batch) {
    return {
      tone: "blocked",
      title: "预测版本未定位",
      detail: "当前来源批次不在需求预测生产台账中，无法展示版本详情。",
      batchId,
      fileName: "未找到来源文件",
      versionLabel: "未找到对应需求预测批次",
      sourceBatchHref: "/demand-plans/production",
      workbenchHref: "/demand-plans/production",
      businessDateLabel: "未定位",
      uploadedAtLabel: "未定位",
      applicationLabel: "待应用",
      alignmentLabel: "缺少版本无法对齐",
      appliedRecordCountLabel: "0",
      sourceRowLabel: "未定位来源行",
      skillAlignmentLabel: "未定位来源批次，无法确认技能组和等级",
      timeBucketLabel: "未发现 0.5h 预测明细",
      forecastScopeLabel: "未定位来源批次，暂无技能组/等级/时段行",
      alignmentResultLabel: "未发现技能组/等级/时段对齐结果",
      blockerSummary: "请返回预测生产工作台选择来源批次",
      intervalRows: [],
      changeRows: [],
      changeBoundaryLabel: "暂无变更记录",
      comparisonEntry: buildDemandForecastComparisonEntry({
        tone: "blocked",
        versionLabel: null,
        businessDate: null,
        blockerSummary: "请返回预测生产工作台选择来源批次",
      }),
      workspaceTabs: [...DEMAND_FORECAST_PRODUCTION_WORKSPACE_TABS],
    }
  }

  const row = toDemandForecastProductionRow(batch)
  const apiIntervals = apiDetail?.intervals ?? []
  const apiChanges = apiDetail?.changes ?? []
  const intervalRows = apiIntervals.map(toForecastIntervalDisplayRow)
  const changeRows = apiChanges.map(toForecastChangeDisplayRow)
  const hasApiDetail = Boolean(apiDetail)
  const isReady = row.tone === "ready"
  const intervalCount = hasApiDetail
    ? apiIntervals.length
    : batch.applied_record_count
  const totalRequiredAgents = apiDetail?.version.total_required_agents
  const alignmentResultLabel =
    hasApiDetail
      ? `预测合计需求 ${(totalRequiredAgents ?? 0).toLocaleString("zh-CN")} 人次`
      : batch.applied_record_count > 0
        ? `已形成 ${batch.applied_record_count.toLocaleString("zh-CN")} 条技能组/等级/时段预测明细`
        : "未发现技能组/等级/时段对齐结果"
  const versionLabel = apiDetail?.version.forecast_version_id ?? row.versionLabel
  const businessDateLabel = apiDetail
    ? formatBusinessDateRange(
        apiDetail.version.business_date_from,
        apiDetail.version.business_date_to
      )
    : row.businessDateLabel
  const sourceRowLabel = hasApiDetail
    ? `${apiIntervals.length.toLocaleString("zh-CN")} 条预测区间来自版本服务`
    : `${batch.success_rows.toLocaleString("zh-CN")} / ${batch.total_rows.toLocaleString("zh-CN")} 条成功导入`
  const skillAlignmentLabel = hasApiDetail
    ? summarizeForecastDimensions(apiIntervals)
    : `来自 ${batch.success_rows.toLocaleString("zh-CN")} 条成功导入行，技能组和等级明细待版本 服务 暴露`
  const timeBucketLabel = hasApiDetail
    ? `已读取 ${apiIntervals.length.toLocaleString("zh-CN")} 条 0.5h 预测区间`
    : batch.applied_record_count > 0
      ? "0.5h 时段口径已确认"
      : "未发现 0.5h 预测明细"
  const forecastScopeLabel = hasApiDetail
    ? "版本服务 已返回技能组/等级/0.5h 时段明细"
    : "暂无技能组/等级/时段明细"
  const changeBoundaryLabel = hasApiDetail
    ? apiChanges.length > 0
      ? `已读取 ${apiChanges.length.toLocaleString("zh-CN")} 条版本变更记录`
      : "版本服务 未返回变更记录"
    : "暂无变更记录"

  return {
    tone: row.tone,
    title: isReady ? "预测版本详情已定位" : "预测版本详情仍有阻塞",
    detail: isReady
      ? "当前版本已应用并形成技能组、等级和 0.5h 时段对齐口径，可进入排班和比对链路。"
      : "当前版本缺少应用、业务版本或预测明细，详情页展示可确认的来源信息。",
    batchId: batch.batch_id,
    fileName: batch.file_name,
    versionLabel,
    sourceBatchHref: row.sourceBatchHref,
    workbenchHref: "/demand-plans/production",
    businessDateLabel,
    uploadedAtLabel: row.uploadedAtLabel,
    applicationLabel: row.applicationLabel,
    alignmentLabel: row.alignmentLabel,
    appliedRecordCountLabel: intervalCount.toLocaleString("zh-CN"),
    sourceRowLabel,
    skillAlignmentLabel,
    timeBucketLabel,
    forecastScopeLabel,
    alignmentResultLabel,
    blockerSummary: row.blockerSummary,
    intervalRows,
    changeRows,
    changeBoundaryLabel,
    comparisonEntry: buildDemandForecastComparisonEntry({
      tone: row.tone,
      versionLabel,
      businessDate: apiDetail?.version.business_date_from ?? batch.business_date_from,
      blockerSummary: row.blockerSummary,
    }),
    workspaceTabs: [...DEMAND_FORECAST_PRODUCTION_WORKSPACE_TABS],
  }
}

function buildDemandForecastComparisonEntry({
  tone,
  versionLabel,
  businessDate,
  blockerSummary,
}: {
  tone: Exclude<DemandForecastProductionTone, "empty">
  versionLabel: string | null
  businessDate: string | null
  blockerSummary: string
}): DemandForecastProductionComparisonEntry {
  const query = businessDate
    ? `?domain=demand_forecast&status=applied&businessDate=${encodeURIComponent(
        businessDate
      )}`
    : "?domain=demand_forecast"
  const href = `/data-quality/versions${query}`

  if (tone !== "ready" || !versionLabel || !businessDate) {
    return {
      tone: "blocked",
      title: "无法进入比对",
      detail: "未定位预测业务版本或业务日，先回到预测生产工作台选择已应用批次。",
      actionLabel: "查看业务版本工作台",
      href,
      blockerLabel: `阻塞：${blockerSummary}`,
    }
  }

  return {
    tone: "ready",
    title: "进入预测 vs 排班比对入口",
    detail: `已定位预测版本 ${versionLabel}，可到业务版本工作台按同业务日寻找排班版本并发起比对。`,
    actionLabel: "去业务版本工作台",
    href,
    blockerLabel: "无阻塞；从业务版本工作台继续完成成对版本确认",
  }
}

function toForecastIntervalDisplayRow(
  row: DemandForecastProductionApiIntervalRow
): DemandForecastProductionIntervalRow {
  const blockerLabel = resolveForecastIntervalBlocker(row)

  return {
    id: row.forecast_interval_id,
    dateLabel: row.forecast_date,
    timeLabel: `${row.interval_start}-${row.interval_end}`,
    dimensionLabel: [
      formatReferenceValue(row.workplace_id, "职场"),
      formatReferenceValue(row.project_id, "项目"),
      formatReferenceValue(row.skill_id, "技能"),
    ].join(" / "),
    demandLevelLabel: row.demand_level || "未填写等级",
    requiredAgentsLabel: row.required_agents.toLocaleString("zh-CN"),
    alignmentStatusLabel: resolveForecastIntervalAlignmentStatus(blockerLabel),
    blockerLabel,
  }
}

function resolveForecastIntervalBlocker(row: DemandForecastProductionApiIntervalRow) {
  const missingDimensions = [
    row.workplace_id.trim() ? null : "职场",
    row.project_id.trim() ? null : "项目",
    row.skill_id.trim() ? null : "技能",
    row.demand_level.trim() ? null : "需求等级",
    row.interval_start.trim() && row.interval_end.trim() ? null : "时段",
  ].filter((item): item is string => Boolean(item))
  const valueBlockers = row.required_agents > 0 ? [] : ["需求值需大于 0"]

  if (missingDimensions.length === 0 && valueBlockers.length === 0) {
    return "无阻塞；预测区间维度、等级、时段和需求值完整"
  }

  const parts = []

  if (missingDimensions.length > 0) {
    parts.push(`缺少${missingDimensions.join("、")}`)
  }

  parts.push(...valueBlockers)

  return `阻塞：${parts.join("；")}`
}

function resolveForecastIntervalAlignmentStatus(blockerLabel: string) {
  return blockerLabel.startsWith("阻塞") ? "对齐阻塞" : "对齐完整"
}

function toForecastChangeDisplayRow(
  row: DemandForecastProductionApiChangeRow
): DemandForecastProductionChangeRow {
  return {
    id: String(row.change_id),
    comparedFromVersionLabel: row.compared_from_version_id ?? "未关联上一版本",
    changeReasonLabel: row.change_reason ?? "未填写变更原因",
  }
}

function summarizeForecastDimensions(rows: DemandForecastProductionApiIntervalRow[]) {
  if (rows.length === 0) {
    return "版本服务 未返回预测区间"
  }

  const skillIds = uniqueValues(rows.map((row) => row.skill_id))
  const demandLevels = uniqueValues(rows.map((row) => row.demand_level))

  return `${skillIds.length.toLocaleString("zh-CN")} 个技能组已定位：${formatPreviewList(
    skillIds
  )}；${demandLevels.length.toLocaleString("zh-CN")} 个需求等级：${formatPreviewList(
    demandLevels
  )}`
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function formatPreviewList(values: string[]) {
  const preview = values.slice(0, 3).join("、")

  if (values.length <= 3) {
    return preview
  }

  return `${preview} 等`
}

function formatReferenceValue(value: string, label: string) {
  return value.trim() ? `${label} ${value}` : `未填写${label}`
}

function resolveAlignmentLabel(
  hasVersion: boolean,
  isApplied: boolean,
  isAligned: boolean
): DemandForecastProductionRow["alignmentLabel"] {
  if (!hasVersion) {
    return "缺少版本无法对齐"
  }

  if (!isApplied) {
    return "等待应用后对齐"
  }

  return isAligned ? "技能组/等级/时段已对齐" : "等待应用后对齐"
}

function resolveDemandForecastBlocker(
  batch: ImportBatchListRow,
  hasVersion: boolean,
  isApplied: boolean
) {
  if (!hasVersion) {
    return "缺少需求预测业务版本"
  }

  if (!isApplied) {
    return "预测批次尚未应用到业务数据"
  }

  if (batch.applied_record_count <= 0) {
    return "已应用但未发现预测明细"
  }

  return "无阻塞"
}

function resolveDemandForecastProductionTone(
  rows: DemandForecastProductionRow[],
  blockedVersions: number
): DemandForecastProductionTone {
  if (rows.length === 0) {
    return "empty"
  }

  return blockedVersions > 0 ? "blocked" : "ready"
}

function resolveDemandForecastProductionTitle(tone: DemandForecastProductionTone) {
  if (tone === "ready") {
    return "需求预测生产版本已就绪"
  }

  if (tone === "blocked") {
    return "需求预测生产仍有阻塞"
  }

  return "等待需求预测来源批次"
}

function resolveDemandForecastProductionDetail(
  totalVersions: number,
  blockedVersions: number
) {
  if (totalVersions === 0) {
    return "当前还没有需求预测导入批次，无法建立预测生产台账。"
  }

  if (blockedVersions > 0) {
    return "部分预测版本缺少应用、业务版本或预测明细，无法进入排班比对口径。"
  }

  return "当前需求预测版本已应用并具备技能组、等级和时段对齐口径。"
}

function formatBusinessDateRange(from: string, to: string) {
  return from === to ? from : `${from} 至 ${to}`
}
