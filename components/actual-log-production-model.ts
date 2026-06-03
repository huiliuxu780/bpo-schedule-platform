import type { ImportBatchListRow } from "@/components/import-center-model"

export type ActualLogProductionTone = "ready" | "blocked" | "empty"

export type ActualLogProductionRow = {
  batchId: string
  fileName: string
  fileTypeLabel: "登录日志" | "状态日志"
  versionLabel: string
  sourceBatchLabel: string
  sourceBatchHref: string
  businessDateLabel: string
  uploadedAtLabel: string
  applicationLabel: "已应用" | "待应用"
  tone: Exclude<ActualLogProductionTone, "empty">
  appliedRecordCountLabel: string
  timezoneBoundaryLabel: string
  crossDayBoundaryLabel: string
  processingBoundaryLabel: string
  blockerSummary: string
}

export type ActualLogProductionSummary = {
  tone: ActualLogProductionTone
  title: string
  detail: string
  totalVersions: number
  loginVersions: number
  statusVersions: number
  appliedVersions: number
  blockedVersions: number
  rows: ActualLogProductionRow[]
}

export function summarizeActualLogProductionWorkbench(
  batches: ImportBatchListRow[]
): ActualLogProductionSummary {
  const rows = batches
    .filter((batch) => batch.file_type === "login_log" || batch.file_type === "status_log")
    .sort(compareActualLogBatches)
    .map(toActualLogProductionRow)
  const loginVersions = rows.filter((row) => row.fileTypeLabel === "登录日志").length
  const statusVersions = rows.filter((row) => row.fileTypeLabel === "状态日志").length
  const appliedVersions = rows.filter((row) => row.applicationLabel === "已应用").length
  const blockedVersions = rows.filter((row) => row.tone === "blocked").length
  const tone = resolveActualLogProductionTone(rows, blockedVersions)

  return {
    tone,
    title: resolveActualLogProductionTitle(tone),
    detail: resolveActualLogProductionDetail(rows.length, blockedVersions),
    totalVersions: rows.length,
    loginVersions,
    statusVersions,
    appliedVersions,
    blockedVersions,
    rows,
  }
}

function toActualLogProductionRow(batch: ImportBatchListRow): ActualLogProductionRow {
  const hasVersion = Boolean(batch.import_version_id)
  const isApplied = batch.application_status === "applied"
  const hasAppliedRecords = batch.applied_record_count > 0
  const tone: Exclude<ActualLogProductionTone, "empty"> =
    hasVersion && isApplied && hasAppliedRecords ? "ready" : "blocked"

  return {
    batchId: batch.batch_id,
    fileName: batch.file_name,
    fileTypeLabel: batch.file_type === "status_log" ? "状态日志" : "登录日志",
    versionLabel: batch.import_version_id ?? "暂无实际日志业务版本",
    sourceBatchLabel: batch.batch_id,
    sourceBatchHref: `/data-quality/import-batches/${batch.batch_id}`,
    businessDateLabel: formatBusinessDateRange(
      batch.business_date_from,
      batch.business_date_to
    ),
    uploadedAtLabel: batch.uploaded_at,
    applicationLabel: isApplied ? "已应用" : "待应用",
    tone,
    appliedRecordCountLabel: batch.applied_record_count.toLocaleString("zh-CN"),
    timezoneBoundaryLabel: resolveTimezoneBoundaryLabel(hasVersion),
    crossDayBoundaryLabel: resolveCrossDayBoundaryLabel(batch, hasVersion),
    processingBoundaryLabel: resolveProcessingBoundaryLabel(batch, hasVersion, isApplied),
    blockerSummary: resolveActualLogBlocker(batch, hasVersion, isApplied),
  }
}

function compareActualLogBatches(left: ImportBatchListRow, right: ImportBatchListRow) {
  const uploadedOrder = right.uploaded_at.localeCompare(left.uploaded_at)

  if (uploadedOrder !== 0) {
    return uploadedOrder
  }

  if (left.file_type === right.file_type) {
    return left.batch_id.localeCompare(right.batch_id)
  }

  return left.file_type === "status_log" ? -1 : 1
}

function resolveTimezoneBoundaryLabel(hasVersion: boolean) {
  return hasVersion
    ? "Asia/Shanghai 时区校验待处理详情页解释"
    : "当前列表 API 未暴露逐行时区，不伪造时区异常"
}

function resolveCrossDayBoundaryLabel(batch: ImportBatchListRow, hasVersion: boolean) {
  if (!hasVersion) {
    return "当前列表 API 未暴露逐行起止时间，不伪造跨天区间"
  }

  if (batch.business_date_from !== batch.business_date_to) {
    return "跨天区间会按业务日切分，明细待 IM106"
  }

  return "单业务日范围；跨天明细待 IM106"
}

function resolveProcessingBoundaryLabel(
  batch: ImportBatchListRow,
  hasVersion: boolean,
  isApplied: boolean
) {
  const noun = batch.file_type === "status_log" ? "状态区间" : "登录事件"

  if (!hasVersion) {
    return `缺少业务版本，不能解释${noun}`
  }

  if (!isApplied) {
    return `等待应用后生成${noun}`
  }

  if (batch.applied_record_count <= 0) {
    return `已应用但暂未发现${noun}`
  }

  return `${noun}已应用 ${batch.applied_record_count.toLocaleString("zh-CN")} 条记录`
}

function resolveActualLogBlocker(
  batch: ImportBatchListRow,
  hasVersion: boolean,
  isApplied: boolean
) {
  if (!hasVersion) {
    return "缺少实际日志业务版本"
  }

  if (!isApplied) {
    return "日志批次尚未应用到实际日志业务数据"
  }

  if (batch.applied_record_count <= 0) {
    return "已应用但暂未发现登录/状态处理记录"
  }

  return "无阻塞；当前只读展示登录/状态日志生产口径"
}

function resolveActualLogProductionTone(
  rows: ActualLogProductionRow[],
  blockedVersions: number
): ActualLogProductionTone {
  if (rows.length === 0) {
    return "empty"
  }

  return blockedVersions > 0 ? "blocked" : "ready"
}

function resolveActualLogProductionTitle(tone: ActualLogProductionTone) {
  if (tone === "ready") {
    return "登录/状态日志生产版本已就绪"
  }

  if (tone === "blocked") {
    return "登录/状态日志生产仍有阻塞"
  }

  return "等待登录/状态日志来源批次"
}

function resolveActualLogProductionDetail(
  totalVersions: number,
  blockedVersions: number
) {
  if (totalVersions === 0) {
    return "当前还没有登录日志或状态日志导入批次，无法建立实际日志生产台账。"
  }

  if (blockedVersions > 0) {
    return "部分日志版本缺少应用、业务版本或处理记录，暂不能进入排班 vs 实际比对口径。"
  }

  return "当前登录/状态日志版本已应用，本页只读展示业务日、时区和跨天处理边界。"
}

function formatBusinessDateRange(from: string, to: string) {
  return from === to ? from : `${from} 至 ${to}`
}
