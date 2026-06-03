import type { ImportBatchListRow } from "@/components/import-center-model"

export type DemandForecastProductionTone = "ready" | "blocked" | "empty"

export type DemandForecastProductionRow = {
  batchId: string
  fileName: string
  versionLabel: string
  sourceBatchLabel: string
  sourceBatchHref: string
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
    nextActionLabel: "版本详情待 IM103",
  }
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
    return "已应用但暂未发现预测明细"
  }

  return "无阻塞；当前只读展示需求预测生产口径"
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
    return "部分预测版本缺少应用、业务版本或预测明细，暂不能进入排班比对口径。"
  }

  return "当前需求预测版本已应用并具备技能组、等级和时段对齐口径，本页仍只读展示。"
}

function formatBusinessDateRange(from: string, to: string) {
  return from === to ? from : `${from} 至 ${to}`
}
