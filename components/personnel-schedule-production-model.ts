import type { ImportBatchListRow } from "@/components/import-center-model"

export type PersonnelScheduleProductionTone = "ready" | "blocked" | "empty"

export type PersonnelScheduleProductionRow = {
  batchId: string
  fileName: string
  versionLabel: string
  sourceBatchLabel: string
  sourceBatchHref: string
  detailHref: string
  businessDateLabel: string
  uploadedAtLabel: string
  applicationLabel: "已应用" | "待应用"
  expansionLabel: "0.5h 已展开" | "等待应用后展开" | "缺少版本无法展开"
  tone: PersonnelScheduleProductionTone
  appliedRecordCountLabel: string
  blockerSummary: string
  nextActionLabel: string
}

export type PersonnelScheduleProductionSummary = {
  tone: PersonnelScheduleProductionTone
  title: string
  detail: string
  totalVersions: number
  appliedVersions: number
  expandedVersions: number
  blockedVersions: number
  rows: PersonnelScheduleProductionRow[]
}

export type PersonnelScheduleProductionDetailSummary = {
  tone: Exclude<PersonnelScheduleProductionTone, "empty">
  title: string
  detail: string
  batchId: string
  fileName: string
  versionLabel: string
  sourceBatchHref: string
  workbenchHref: string
  businessDateLabel: string
  uploadedAtLabel: string
  applicationLabel: PersonnelScheduleProductionRow["applicationLabel"]
  expansionLabel: PersonnelScheduleProductionRow["expansionLabel"]
  appliedRecordCountLabel: string
  sourceRowLabel: string
  shiftReferenceLabel: string
  personScopeLabel: string
  halfHourResultLabel: string
  blockerSummary: string
}

export function summarizePersonnelScheduleProductionWorkbench(
  batches: ImportBatchListRow[]
): PersonnelScheduleProductionSummary {
  const rows = batches
    .filter((batch) => batch.file_type === "personnel_schedule")
    .sort((left, right) => right.uploaded_at.localeCompare(left.uploaded_at))
    .map(toPersonnelScheduleProductionRow)
  const appliedVersions = rows.filter((row) => row.applicationLabel === "已应用").length
  const expandedVersions = rows.filter((row) => row.expansionLabel === "0.5h 已展开").length
  const blockedVersions = rows.filter((row) => row.tone === "blocked").length
  const tone = resolvePersonnelScheduleProductionTone(rows, blockedVersions)

  return {
    tone,
    title: resolvePersonnelScheduleProductionTitle(tone),
    detail: resolvePersonnelScheduleProductionDetail(rows.length, blockedVersions),
    totalVersions: rows.length,
    appliedVersions,
    expandedVersions,
    blockedVersions,
    rows,
  }
}

function toPersonnelScheduleProductionRow(
  batch: ImportBatchListRow
): PersonnelScheduleProductionRow {
  const hasVersion = Boolean(batch.import_version_id)
  const isApplied = batch.application_status === "applied"
  const isExpanded = hasVersion && isApplied && batch.applied_record_count > 0
  const tone: PersonnelScheduleProductionTone = isExpanded ? "ready" : "blocked"

  return {
    batchId: batch.batch_id,
    fileName: batch.file_name,
    versionLabel: batch.import_version_id ?? "暂无排班业务版本",
    sourceBatchLabel: batch.batch_id,
    sourceBatchHref: `/data-quality/import-batches/${batch.batch_id}`,
    detailHref: `/schedule-plans/production/${batch.batch_id}`,
    businessDateLabel: formatBusinessDateRange(
      batch.business_date_from,
      batch.business_date_to
    ),
    uploadedAtLabel: batch.uploaded_at,
    applicationLabel: isApplied ? "已应用" : "待应用",
    expansionLabel: resolveExpansionLabel(hasVersion, isApplied, isExpanded),
    tone,
    appliedRecordCountLabel: batch.applied_record_count.toLocaleString("zh-CN"),
    blockerSummary: resolvePersonnelScheduleBlocker(batch, hasVersion, isApplied),
    nextActionLabel: "查看版本详情",
  }
}

export function summarizePersonnelScheduleProductionDetail(
  batches: ImportBatchListRow[],
  batchId: string
): PersonnelScheduleProductionDetailSummary {
  const batch = batches.find(
    (candidate) =>
      candidate.batch_id === batchId && candidate.file_type === "personnel_schedule"
  )

  if (!batch) {
    return {
      tone: "blocked",
      title: "排班版本未定位",
      detail: "当前来源批次不在人员排班生产台账中，无法展示版本详情。",
      batchId,
      fileName: "未找到来源文件",
      versionLabel: "未找到对应人员排班批次",
      sourceBatchHref: "/schedule-plans/production",
      workbenchHref: "/schedule-plans/production",
      businessDateLabel: "未定位",
      uploadedAtLabel: "未定位",
      applicationLabel: "待应用",
      expansionLabel: "缺少版本无法展开",
      appliedRecordCountLabel: "0",
      sourceRowLabel: "未定位来源行",
      shiftReferenceLabel: "未定位来源批次，无法确认班次引用",
      personScopeLabel: "未定位来源批次，不伪造人员级明细",
      halfHourResultLabel: "暂未发现 0.5h 展开记录",
      blockerSummary: "请返回排班生产工作台选择来源批次",
    }
  }

  const row = toPersonnelScheduleProductionRow(batch)
  const isReady = row.tone === "ready"

  return {
    tone: row.tone === "empty" ? "blocked" : row.tone,
    title: isReady ? "排班版本详情已定位" : "排班版本详情仍有阻塞",
    detail: isReady
      ? "当前版本已应用并形成 0.5h 展开记录，可作为后续比对和复核的只读来源。"
      : "当前版本缺少应用、业务版本或 0.5h 展开记录，详情页只展示可确认的来源口径。",
    batchId: batch.batch_id,
    fileName: batch.file_name,
    versionLabel: row.versionLabel,
    sourceBatchHref: row.sourceBatchHref,
    workbenchHref: "/schedule-plans/production",
    businessDateLabel: row.businessDateLabel,
    uploadedAtLabel: row.uploadedAtLabel,
    applicationLabel: row.applicationLabel,
    expansionLabel: row.expansionLabel,
    appliedRecordCountLabel: row.appliedRecordCountLabel,
    sourceRowLabel: `${batch.success_rows.toLocaleString("zh-CN")} / ${batch.total_rows.toLocaleString("zh-CN")} 条成功导入`,
    shiftReferenceLabel: `来自 ${batch.success_rows.toLocaleString("zh-CN")} 条成功导入行，班次引用明细待版本 API 暴露`,
    personScopeLabel: "当前列表 API 未暴露人员清单，不伪造人员级明细",
    halfHourResultLabel:
      batch.applied_record_count > 0
        ? `已形成 ${batch.applied_record_count.toLocaleString("zh-CN")} 条 0.5h 展开记录`
        : "暂未发现 0.5h 展开记录",
    blockerSummary: row.blockerSummary,
  }
}

function resolveExpansionLabel(
  hasVersion: boolean,
  isApplied: boolean,
  isExpanded: boolean
): PersonnelScheduleProductionRow["expansionLabel"] {
  if (!hasVersion) {
    return "缺少版本无法展开"
  }

  if (!isApplied) {
    return "等待应用后展开"
  }

  return isExpanded ? "0.5h 已展开" : "等待应用后展开"
}

function resolvePersonnelScheduleBlocker(
  batch: ImportBatchListRow,
  hasVersion: boolean,
  isApplied: boolean
) {
  if (!hasVersion) {
    return "缺少人员排班业务版本"
  }

  if (!isApplied) {
    return "排班批次尚未应用到业务数据"
  }

  if (batch.applied_record_count <= 0) {
    return "已应用但暂未发现展开记录"
  }

  return "无阻塞；当前只读展示排班生产口径"
}

function resolvePersonnelScheduleProductionTone(
  rows: PersonnelScheduleProductionRow[],
  blockedVersions: number
): PersonnelScheduleProductionTone {
  if (rows.length === 0) {
    return "empty"
  }

  return blockedVersions > 0 ? "blocked" : "ready"
}

function resolvePersonnelScheduleProductionTitle(
  tone: PersonnelScheduleProductionTone
) {
  if (tone === "ready") {
    return "人员排班生产版本已就绪"
  }

  if (tone === "blocked") {
    return "人员排班生产仍有阻塞"
  }

  return "等待人员排班来源批次"
}

function resolvePersonnelScheduleProductionDetail(
  totalVersions: number,
  blockedVersions: number
) {
  if (totalVersions === 0) {
    return "当前还没有人员排班导入批次，无法建立生产版本台账。"
  }

  if (blockedVersions > 0) {
    return "部分排班版本缺少应用、业务版本或 0.5h 展开记录，暂不能进入发布或冻结口径。"
  }

  return "当前人员排班版本已应用并形成展开记录，本页仍只读展示，不承担发布或冻结语义。"
}

function formatBusinessDateRange(from: string, to: string) {
  return from === to ? from : `${from} 至 ${to}`
}
