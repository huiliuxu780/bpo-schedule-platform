import type {
  ImportBatchListRow,
  ImportFieldMappingTemplate,
} from "@/components/import-center-model"

const taskCodeLabelPattern = /\b(?:F|B|Q|IM|US|DB)\d{3}\b/g

function formatImportBatchDisplayLabel(batchId: string): string {
  return batchId.replace(taskCodeLabelPattern, "业务")
}

export type PersonnelScheduleProductionTone = "ready" | "blocked" | "empty"

export type PersonnelScheduleProductionWorkspaceTabKey =
  | "overview"
  | "source"
  | "rows"
  | "comparison"

export type PersonnelScheduleProductionWorkspaceTab = {
  key: PersonnelScheduleProductionWorkspaceTabKey
  label: string
}

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

export type PersonnelScheduleImportDialogStepKey = "upload" | "mapping" | "result"

export type PersonnelScheduleImportDialogStep = {
  key: PersonnelScheduleImportDialogStepKey
  title: string
  detail: string
}

export type PersonnelScheduleImportDialogMappingMode = {
  key: "template" | "manual"
  label: string
  detail: string
}

export type PersonnelScheduleImportDialogResult = {
  tone: "success" | "failed"
  title: string
  detail: string
  rowSummary: string
  batchHref: string | null
}

export type PersonnelScheduleImportDialogSummary = {
  openHref: string
  closeHref: string
  resultRedirectTo: string
  fileType: "personnel_schedule"
  templateDownloadHref: string
  templateDownloadName: string
  steps: PersonnelScheduleImportDialogStep[]
  mappingModes: PersonnelScheduleImportDialogMappingMode[]
  activeTemplates: ImportFieldMappingTemplate[]
  result: PersonnelScheduleImportDialogResult | null
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
  detailRows: PersonnelScheduleProductionDetailRow[]
  intervalRows: PersonnelScheduleProductionIntervalRow[]
  comparisonEntry: PersonnelScheduleProductionComparisonEntry
  workspaceTabs: PersonnelScheduleProductionWorkspaceTab[]
}

export type PersonnelScheduleProductionApiDetail = {
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
    schedule_version_id: string
    import_version_id: string
    business_date_from: string
    business_date_to: string
    created_at: string
  }
  details: PersonnelScheduleProductionApiDetailRow[]
  intervals: PersonnelScheduleProductionApiIntervalRow[]
}

export type PersonnelScheduleProductionApiDetailRow = {
  schedule_detail_id: string
  schedule_version_id: string
  employee_id: string
  workplace_id: string
  supplier_id: string
  project_id: string
  skill_id: string
  schedule_date: string
  shift_type_id: string
  start_time: string
  end_time: string
}

export type PersonnelScheduleProductionApiIntervalRow = {
  schedule_interval_id: string
  schedule_detail_id: string
  schedule_version_id: string
  employee_id: string
  interval_date: string
  interval_start: string
  interval_end: string
  workplace_id: string
  supplier_id: string
  project_id: string
  skill_id: string
}

export type PersonnelScheduleProductionDetailRow = {
  id: string
  employeeLabel: string
  dateLabel: string
  shiftLabel: string
  timeLabel: string
  referenceLabel: string
  referenceStatusLabel: string
  blockerLabel: string
}

export type PersonnelScheduleProductionIntervalRow = {
  id: string
  employeeLabel: string
  dateLabel: string
  timeLabel: string
  referenceLabel: string
  referenceStatusLabel: string
  blockerLabel: string
}

export type PersonnelScheduleProductionComparisonEntry = {
  tone: "ready" | "blocked"
  title: string
  detail: string
  actionLabel: string
  href: string
  blockerLabel: string
}

const PERSONNEL_SCHEDULE_PRODUCTION_WORKSPACE_TABS: PersonnelScheduleProductionWorkspaceTab[] =
  [
    { key: "overview", label: "总览" },
    { key: "source", label: "来源与版本" },
    { key: "rows", label: "明细" },
    { key: "comparison", label: "比对" },
  ]

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

export function summarizePersonnelScheduleImportDialog({
  batches,
  templates,
  uploadStatus,
  uploadReason,
  uploadBatchId,
}: {
  batches: ImportBatchListRow[]
  templates: ImportFieldMappingTemplate[]
  uploadStatus?: string | null
  uploadReason?: string | null
  uploadBatchId?: string | null
}): PersonnelScheduleImportDialogSummary {
  const activeTemplates = templates
    .filter((template) => template.file_type === "personnel_schedule" && template.is_active)
    .sort((left, right) => left.template_name.localeCompare(right.template_name, "zh-CN"))
  const resultBatch = uploadBatchId
    ? batches.find((batch) => batch.batch_id === uploadBatchId) ?? null
    : null

  return {
    openHref: "/schedule-plans/production?import_dialog=1",
    closeHref: "/schedule-plans/production",
    resultRedirectTo: "/schedule-plans/production?import_dialog=1",
    fileType: "personnel_schedule",
    templateDownloadHref: buildPersonnelScheduleImportTemplateHref(),
    templateDownloadName: "personnel-schedule-template.csv",
    steps: [
      {
        key: "upload",
        title: "上传文件",
        detail: "下载排班模板后上传本次人员排班 CSV。",
      },
      {
        key: "mapping",
        title: "字段映射",
        detail: "选择已有映射模板；表头不一致时使用手动字段映射。",
      },
      {
        key: "result",
        title: "导入结果",
        detail: "只展示本次导入摘要，完整行结果进入批次详情处理。",
      },
    ],
    mappingModes: [
      {
        key: "template",
        label: "选择映射模板",
        detail: activeTemplates.length > 0
          ? "使用已维护的排班字段映射。"
          : "暂无启用模板，可改用手动映射。",
      },
      {
        key: "manual",
        label: "手动映射字段",
        detail: "按 CSV 表头填写字段映射 JSON，仅作用于本次导入。",
      },
    ],
    activeTemplates,
    result: summarizePersonnelScheduleImportDialogResult({
      uploadStatus,
      uploadReason,
      uploadBatchId,
      batch: resultBatch,
    }),
  }
}

function summarizePersonnelScheduleImportDialogResult({
  uploadStatus,
  uploadReason,
  uploadBatchId,
  batch,
}: {
  uploadStatus?: string | null
  uploadReason?: string | null
  uploadBatchId?: string | null
  batch: ImportBatchListRow | null
}): PersonnelScheduleImportDialogResult | null {
  if (uploadStatus !== "success" && uploadStatus !== "failed") {
    return null
  }

  const batchHref = uploadBatchId
    ? `/data-quality/import-batches/${encodeURIComponent(uploadBatchId)}`
    : null

  if (uploadStatus === "success") {
    return {
      tone: "success",
      title: "导入已提交",
      detail: uploadBatchId
        ? `排班导入批次 ${formatImportBatchDisplayLabel(uploadBatchId)} 已创建。`
        : "排班导入已提交。",
      rowSummary: batch
        ? `成功 ${batch.success_rows.toLocaleString("zh-CN")} 行 / 失败 ${batch.failed_rows.toLocaleString("zh-CN")} 行`
        : "批次行结果待批次详情返回",
      batchHref,
    }
  }

  return {
    tone: "failed",
    title: "导入未提交",
    detail: uploadReason ? `失败原因：${uploadReason}` : "请检查必填字段和 CSV 文件后重试。",
    rowSummary: "未形成可处理的排班导入批次",
    batchHref,
  }
}

function buildPersonnelScheduleImportTemplateHref() {
  const rows = [
    "schedule_date,employee_id,workplace_id,supplier_id,skill_id,shift_type_id,start_time,end_time",
    "2026-06-08,A-1001,SH-01,SUP-A,L1-CN,MORNING,09:00,18:00",
  ]

  return `data:text/csv;charset=utf-8,${encodeURIComponent(rows.join("\n"))}`
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
    sourceBatchLabel: formatImportBatchDisplayLabel(batch.batch_id),
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
  batchId: string,
  apiDetail: PersonnelScheduleProductionApiDetail | null = null
): PersonnelScheduleProductionDetailSummary {
  const batch = batches.find(
    (candidate) =>
      candidate.batch_id === batchId && candidate.file_type === "personnel_schedule"
  )

  if (!batch) {
    return {
      tone: "blocked",
      title: "排班版本未定位",
      detail: "当前来源批次不在排班版本列表中，无法展示版本详情。",
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
      personScopeLabel: "未定位来源批次，暂无人员明细",
      halfHourResultLabel: "未发现 0.5h 展开记录",
      blockerSummary: "请返回排班计划选择来源批次",
      detailRows: [],
      intervalRows: [],
      comparisonEntry: buildPersonnelScheduleComparisonEntry({
        tone: "blocked",
        versionLabel: null,
        businessDate: null,
        blockerSummary: "请返回排班计划选择来源批次",
      }),
      workspaceTabs: [...PERSONNEL_SCHEDULE_PRODUCTION_WORKSPACE_TABS],
    }
  }

  const row = toPersonnelScheduleProductionRow(batch)
  const apiDetails = apiDetail?.details ?? []
  const apiIntervals = apiDetail?.intervals ?? []
  const apiDetailRows = apiDetails.map(toDetailDisplayRow)
  const apiIntervalRows = apiIntervals.map(toIntervalDisplayRow)
  const hasApiDetail = Boolean(apiDetail)
  const isReady = row.tone === "ready"
  const detailCount = apiDetail ? apiDetails.length : batch.success_rows
  const intervalCount = apiDetail ? apiIntervals.length : batch.applied_record_count
  const halfHourResultLabel =
    intervalCount > 0
      ? `已形成 ${intervalCount.toLocaleString("zh-CN")} 条 0.5h ${
          hasApiDetail ? "展开区间" : "展开记录"
        }`
      : "未发现 0.5h 展开记录"
  const versionLabel = apiDetail?.version.schedule_version_id ?? row.versionLabel
  const businessDateLabel = apiDetail
    ? formatBusinessDateRange(
        apiDetail.version.business_date_from,
        apiDetail.version.business_date_to
      )
    : row.businessDateLabel
  const sourceRowLabel = hasApiDetail
    ? `${detailCount.toLocaleString("zh-CN")} 条排班明细来自版本明细`
    : `${batch.success_rows.toLocaleString("zh-CN")} / ${batch.total_rows.toLocaleString("zh-CN")} 条成功导入`
  const shiftReferenceLabel = hasApiDetail
    ? summarizeShiftReferences(apiDetails)
    : `来自 ${batch.success_rows.toLocaleString("zh-CN")} 条成功导入行，等待版本明细返回班次引用。`
  const personScopeLabel = hasApiDetail
    ? summarizeEmployees(apiDetails)
    : "暂无人员清单明细"

  return {
    tone: row.tone === "empty" ? "blocked" : row.tone,
    title: isReady ? "排班版本详情已定位" : "排班版本详情仍有阻塞",
    detail: isReady
      ? "当前版本已应用并形成 0.5h 展开记录，可进入比对和复核链路。"
      : "当前版本缺少应用、业务版本或 0.5h 展开记录，详情页展示可确认的来源信息。",
    batchId: batch.batch_id,
    fileName: batch.file_name,
    versionLabel,
    sourceBatchHref: row.sourceBatchHref,
    workbenchHref: "/schedule-plans/production",
    businessDateLabel,
    uploadedAtLabel: row.uploadedAtLabel,
    applicationLabel: row.applicationLabel,
    expansionLabel: row.expansionLabel,
    appliedRecordCountLabel: intervalCount.toLocaleString("zh-CN"),
    sourceRowLabel,
    shiftReferenceLabel,
    personScopeLabel,
    halfHourResultLabel,
    blockerSummary: row.blockerSummary,
    detailRows: apiDetailRows,
    intervalRows: apiIntervalRows,
    comparisonEntry: buildPersonnelScheduleComparisonEntry({
      tone: row.tone === "empty" ? "blocked" : row.tone,
      versionLabel,
      businessDate: apiDetail?.version.business_date_from ?? batch.business_date_from,
      blockerSummary: row.blockerSummary,
    }),
    workspaceTabs: [...PERSONNEL_SCHEDULE_PRODUCTION_WORKSPACE_TABS],
  }
}

function buildPersonnelScheduleComparisonEntry({
  tone,
  versionLabel,
  businessDate,
  blockerSummary,
}: {
  tone: Exclude<PersonnelScheduleProductionTone, "empty">
  versionLabel: string | null
  businessDate: string | null
  blockerSummary: string
}): PersonnelScheduleProductionComparisonEntry {
  const query = businessDate
    ? `?domain=personnel_schedule&status=applied&businessDate=${encodeURIComponent(
        businessDate
      )}`
    : "?domain=personnel_schedule"
  const href = `/data-quality/versions${query}`

  if (tone !== "ready" || !versionLabel || !businessDate) {
    return {
      tone: "blocked",
      title: "无法进入比对",
      detail: "未定位排班业务版本或业务日，先回到排班计划选择已应用批次。",
      actionLabel: "查看业务版本列表",
      href,
      blockerLabel: `阻塞：${blockerSummary}`,
    }
  }

  return {
    tone: "ready",
    title: "进入预测 vs 排班比对入口",
    detail: `已定位排班版本 ${versionLabel}，可到业务版本列表按同业务日寻找预测版本并发起比对。`,
    actionLabel: "去业务版本列表",
    href,
    blockerLabel: "无阻塞；从业务版本列表继续完成成对版本确认",
  }
}

function toDetailDisplayRow(
  row: PersonnelScheduleProductionApiDetailRow
): PersonnelScheduleProductionDetailRow {
  const blockerLabel = resolveReferenceBlocker([
    ["坐席", row.employee_id],
    ["职场", row.workplace_id],
    ["供应商", row.supplier_id],
    ["项目", row.project_id],
    ["技能", row.skill_id],
    ["班次类型", row.shift_type_id],
  ])

  return {
    id: row.schedule_detail_id,
    employeeLabel: formatReferenceValue(row.employee_id, "坐席"),
    dateLabel: row.schedule_date,
    shiftLabel: formatReferenceValue(row.shift_type_id, "班次类型"),
    timeLabel: `${row.start_time}-${row.end_time}`,
    referenceLabel: formatReferenceLabel(row),
    referenceStatusLabel: resolveReferenceStatusLabel(blockerLabel),
    blockerLabel,
  }
}

function toIntervalDisplayRow(
  row: PersonnelScheduleProductionApiIntervalRow
): PersonnelScheduleProductionIntervalRow {
  const blockerLabel = resolveReferenceBlocker([
    ["坐席", row.employee_id],
    ["职场", row.workplace_id],
    ["供应商", row.supplier_id],
    ["项目", row.project_id],
    ["技能", row.skill_id],
  ])

  return {
    id: row.schedule_interval_id,
    employeeLabel: formatReferenceValue(row.employee_id, "坐席"),
    dateLabel: row.interval_date,
    timeLabel: `${row.interval_start}-${row.interval_end}`,
    referenceLabel: formatReferenceLabel(row),
    referenceStatusLabel: resolveReferenceStatusLabel(blockerLabel),
    blockerLabel,
  }
}

function summarizeShiftReferences(
  rows: PersonnelScheduleProductionApiDetailRow[]
) {
  if (rows.length === 0) {
    return "版本明细未返回班次明细"
  }

  const shiftIds = uniqueValues(rows.map((row) => row.shift_type_id))

  return `${shiftIds.length.toLocaleString("zh-CN")} 个班次引用已定位：${formatPreviewList(
    shiftIds
  )}`
}

function summarizeEmployees(rows: PersonnelScheduleProductionApiDetailRow[]) {
  if (rows.length === 0) {
    return "版本明细未返回人员明细"
  }

  const employeeIds = uniqueValues(rows.map((row) => row.employee_id))

  return `${employeeIds.length.toLocaleString("zh-CN")} 名坐席已定位：${formatPreviewList(
    employeeIds
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

function formatReferenceLabel({
  workplace_id,
  supplier_id,
  project_id,
  skill_id,
}: {
  workplace_id: string
  supplier_id: string
  project_id: string
  skill_id: string
}) {
  return [
    formatReferenceValue(workplace_id, "职场"),
    formatReferenceValue(supplier_id, "供应商"),
    formatReferenceValue(project_id, "项目"),
    formatReferenceValue(skill_id, "技能"),
  ].join(" / ")
}

function formatReferenceValue(value: string, label: string) {
  return value.trim() ? value : `未填写${label}`
}

function resolveReferenceStatusLabel(blockerLabel: string) {
  return blockerLabel.startsWith("阻塞") ? "引用缺失" : "引用完整"
}

function resolveReferenceBlocker(fields: Array<[string, string]>) {
  const missingLabels = fields
    .filter(([, value]) => !value.trim())
    .map(([label]) => label)

  if (missingLabels.length === 0) {
    return "无阻塞；行级引用字段完整"
  }

  return `阻塞：缺少${missingLabels.join("、")}引用`
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
    return "已应用但未发现展开记录"
  }

  return "无阻塞"
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
    return "排班版本已就绪"
  }

  if (tone === "blocked") {
    return "排班版本仍有阻塞"
  }

  return "等待人员排班来源批次"
}

function resolvePersonnelScheduleProductionDetail(
  totalVersions: number,
  blockedVersions: number
) {
  if (totalVersions === 0) {
    return "当前还没有人员排班导入批次，无法建立排班版本列表。"
  }

  if (blockedVersions > 0) {
    return "部分排班版本缺少应用、业务版本或 0.5h 展开记录。"
  }

  return "当前人员排班版本已应用并形成展开记录。"
}

function formatBusinessDateRange(from: string, to: string) {
  return from === to ? from : `${from} 至 ${to}`
}
