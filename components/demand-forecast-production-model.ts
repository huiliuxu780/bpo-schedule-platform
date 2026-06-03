import type { ImportBatchListRow } from "@/components/import-center-model"

export type DemandForecastProductionTone = "ready" | "blocked" | "empty"

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
  changeBoundaryLabel: string
  changeTracking: DemandForecastChangeTrackingSummary
}

export type DemandForecastChangeTrackingActionShell = {
  label: string
  disabledLabel: string
  detail: string
  isDisabled: true
}

export type DemandForecastChangeTrackingSummary = {
  title: string
  sourceVersionLabel: string
  alignmentCheckLabel: string
  downstreamImpactLabel: string
  failureBoundaryLabel: string
  actionShells: DemandForecastChangeTrackingActionShell[]
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
  batchId: string
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
      timeBucketLabel: "暂未发现 0.5h 预测明细",
      forecastScopeLabel: "未定位来源批次，不伪造技能组/等级/时段行",
      alignmentResultLabel: "暂未发现技能组/等级/时段对齐结果",
      blockerSummary: "请返回预测生产工作台选择来源批次",
      changeBoundaryLabel: "变更追踪边界待 IM104",
      changeTracking: buildDemandForecastChangeTrackingSummary({
        versionLabel: null,
        hasLocatedBatch: false,
        isAligned: false,
        blockerSummary: "请返回预测生产工作台选择来源批次",
      }),
    }
  }

  const row = toDemandForecastProductionRow(batch)
  const isReady = row.tone === "ready"
  const alignmentResultLabel =
    batch.applied_record_count > 0
      ? `已形成 ${batch.applied_record_count.toLocaleString("zh-CN")} 条技能组/等级/时段预测明细`
      : "暂未发现技能组/等级/时段对齐结果"

  return {
    tone: row.tone,
    title: isReady ? "预测版本详情已定位" : "预测版本详情仍有阻塞",
    detail: isReady
      ? "当前版本已应用并形成技能组、等级和 0.5h 时段对齐口径，可作为后续排班和比对的只读来源。"
      : "当前版本缺少应用、业务版本或预测明细，详情页只展示可确认的来源口径。",
    batchId: batch.batch_id,
    fileName: batch.file_name,
    versionLabel: row.versionLabel,
    sourceBatchHref: row.sourceBatchHref,
    workbenchHref: "/demand-plans/production",
    businessDateLabel: row.businessDateLabel,
    uploadedAtLabel: row.uploadedAtLabel,
    applicationLabel: row.applicationLabel,
    alignmentLabel: row.alignmentLabel,
    appliedRecordCountLabel: row.appliedRecordCountLabel,
    sourceRowLabel: `${batch.success_rows.toLocaleString("zh-CN")} / ${batch.total_rows.toLocaleString("zh-CN")} 条成功导入`,
    skillAlignmentLabel: `来自 ${batch.success_rows.toLocaleString("zh-CN")} 条成功导入行，技能组和等级明细待版本 API 暴露`,
    timeBucketLabel:
      batch.applied_record_count > 0
        ? "0.5h 时段口径已确认"
        : "暂未发现 0.5h 预测明细",
    forecastScopeLabel: "当前列表 API 未暴露预测明细，不伪造技能组/等级/时段行",
    alignmentResultLabel,
    blockerSummary: row.blockerSummary,
    changeBoundaryLabel: "变更追踪边界待 IM104",
    changeTracking: buildDemandForecastChangeTrackingSummary({
      versionLabel: batch.import_version_id,
      hasLocatedBatch: true,
      isAligned: row.tone === "ready",
      blockerSummary: row.blockerSummary,
    }),
  }
}

function buildDemandForecastChangeTrackingSummary({
  versionLabel,
  hasLocatedBatch,
  isAligned,
  blockerSummary,
}: {
  versionLabel: string | null
  hasLocatedBatch: boolean
  isAligned: boolean
  blockerSummary: string
}): DemandForecastChangeTrackingSummary {
  return {
    title: "变更追踪边界安全壳",
    sourceVersionLabel: resolveChangeTrackingSourceVersionLabel(
      versionLabel,
      hasLocatedBatch
    ),
    alignmentCheckLabel: resolveChangeTrackingAlignmentLabel(
      hasLocatedBatch,
      isAligned
    ),
    downstreamImpactLabel: resolveChangeTrackingImpactLabel(
      hasLocatedBatch,
      isAligned
    ),
    failureBoundaryLabel:
      "写入动作进入前需要单独确认后端、schema、migration 和生产状态边界",
    actionShells: [
      {
        label: "记录预测变更",
        disabledLabel: "暂不写入",
        detail: "仅展示入口位置；不新增变更记录、不提交真实预测调整。",
        isDisabled: true,
      },
      {
        label: "校验下游影响",
        disabledLabel: "暂不提交",
        detail: "仅展示排班、比对、复核影响校验边界；不触发后端计算或批量操作。",
        isDisabled: true,
      },
      {
        label: "更新生产口径",
        disabledLabel: "暂不变更",
        detail: `当前阻塞/边界：${blockerSummary}`,
        isDisabled: true,
      },
    ],
  }
}

function resolveChangeTrackingSourceVersionLabel(
  versionLabel: string | null,
  hasLocatedBatch: boolean
) {
  if (!hasLocatedBatch || !versionLabel) {
    return "来源版本未定位"
  }

  return `来源版本 ${versionLabel} 已定位`
}

function resolveChangeTrackingAlignmentLabel(
  hasLocatedBatch: boolean,
  isAligned: boolean
) {
  if (!hasLocatedBatch) {
    return "阻塞：未定位来源批次，无法校验技能组/等级/0.5h 时段"
  }

  return isAligned
    ? "技能组/等级/0.5h 时段已具备只读对齐口径"
    : "阻塞：暂未发现技能组/等级/0.5h 时段预测明细"
}

function resolveChangeTrackingImpactLabel(
  hasLocatedBatch: boolean,
  isAligned: boolean
) {
  if (!hasLocatedBatch) {
    return "下游影响校验阻塞：未定位预测版本，不能进入变更追踪"
  }

  return isAligned
    ? "下游影响需先回看排班、比对和复核结果，本页不写预测变更"
    : "下游影响校验阻塞：预测明细未形成，不能进入变更追踪"
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
