import type {
  ImportBatchListRow,
  ImportBatchPersistenceDetail,
  ImportBatchRowResult,
} from "@/components/import-center-model"

export type ActualLogProductionTone = "ready" | "blocked" | "empty"

export type ActualLogProductionRow = {
  batchId: string
  fileName: string
  fileTypeLabel: "登录日志" | "状态日志"
  versionLabel: string
  sourceBatchLabel: string
  sourceBatchHref: string
  detailHref: string
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

export type ActualLogProcessingDetailRow = {
  rowNumberLabel: string
  recordLabel: string
  employeeLabel: string
  timeRangeLabel: string
  timezoneLabel: string
  businessDayLabel: string
  crossDayLabel: string
  boundaryLabel: string
  tone: "ready" | "blocked"
}

export type ActualLogExceptionBoundaryItem = {
  title: string
  detail: string
  statusLabel: string
  tone: "ready" | "blocked" | "empty"
}

export type ActualLogExceptionShellAction = {
  title: string
  detail: string
  disabledLabel: string
}

export type ActualLogExceptionShell = {
  title: string
  detail: string
  statusDictionaryLabel: string
  unknownStatusLabel: string
  timezoneIssueLabel: string
  crossDayExceptionLabel: string
  frozenEmployeeBoundaryLabel: string
  items: ActualLogExceptionBoundaryItem[]
  actions: ActualLogExceptionShellAction[]
}

export type ActualLogProcessingWorkspaceTabKey =
  | "overview"
  | "timeBoundary"
  | "exceptions"
  | "rows"
  | "boundary"

export type ActualLogProcessingWorkspaceTab = {
  key: ActualLogProcessingWorkspaceTabKey
  label: string
}

export type ActualLogProcessingDetailSummary = {
  tone: Exclude<ActualLogProductionTone, "empty">
  title: string
  detail: string
  workspaceTabs: ActualLogProcessingWorkspaceTab[]
  batchId: string
  fileName: string
  fileTypeLabel: "登录日志" | "状态日志" | "未定位"
  versionLabel: string
  sourceBatchHref: string
  workbenchHref: string
  businessDateLabel: string
  uploadedAtLabel: string
  applicationLabel: "已应用" | "待应用"
  appliedRecordCountLabel: string
  sourceRowLabel: string
  timezoneCheckLabel: string
  businessDayLabel: string
  crossDaySplitLabel: string
  statusIntervalBoundaryLabel: string
  loginEventBoundaryLabel: string
  detailEmptyLabel: string
  blockerSummary: string
  loginEventCount: number
  statusDictionaryCount: number
  statusIntervalCount: number
  crossDayIntervalCount: number
  nonShanghaiTimezoneCount: number
  unknownStatusCount: number
  exceptionShell: ActualLogExceptionShell
  rows: ActualLogProcessingDetailRow[]
}

const ACTUAL_LOG_PROCESSING_WORKSPACE_TABS: ActualLogProcessingWorkspaceTab[] = [
  { key: "overview", label: "总览" },
  { key: "timeBoundary", label: "时区与业务日" },
  { key: "exceptions", label: "字典与异常" },
  { key: "rows", label: "逐行明细" },
  { key: "boundary", label: "处理边界" },
]

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
    detailHref: `/actual-logs/production/${batch.batch_id}`,
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

export function summarizeActualLogProcessingDetail(
  batches: ImportBatchListRow[],
  batchId: string,
  detail: ImportBatchPersistenceDetail | null
): ActualLogProcessingDetailSummary {
  const batch = batches.find(
    (candidate) =>
      candidate.batch_id === batchId &&
      (candidate.file_type === "login_log" || candidate.file_type === "status_log")
  )

  if (!batch) {
    return buildMissingActualLogProcessingDetail(batchId)
  }

  const row = toActualLogProductionRow(batch)
  const parsedRows = detail ? summarizeActualLogDetailRows(batch, detail.rows) : []
  const loginEventCount = parsedRows.filter((item) =>
    item.recordLabel.startsWith("登录事件")
  ).length
  const statusDictionaryCount = parsedRows.filter(
    (item) => item.recordLabel === "状态字典"
  ).length
  const statusIntervalCount = parsedRows.filter((item) =>
    item.recordLabel.startsWith("状态区间")
  ).length
  const crossDayIntervalCount = parsedRows.filter((item) =>
    item.crossDayLabel.startsWith("跨天区间")
  ).length
  const nonShanghaiTimezoneCount = parsedRows.filter((item) =>
    item.timezoneLabel.startsWith("非 Asia/Shanghai")
  ).length
  const unknownStatusCount = detail
    ? countUnknownStatusIntervals(detail.rows)
    : 0
  const hasDetailRows = parsedRows.length > 0
  const isReady = row.tone === "ready" && hasDetailRows

  return {
    tone: isReady ? "ready" : "blocked",
    title: resolveProcessingDetailTitle(batch.file_type, isReady, hasDetailRows),
    detail: resolveProcessingDetailText(batch.file_type, isReady, hasDetailRows),
    workspaceTabs: [...ACTUAL_LOG_PROCESSING_WORKSPACE_TABS],
    batchId: batch.batch_id,
    fileName: batch.file_name,
    fileTypeLabel: row.fileTypeLabel,
    versionLabel: row.versionLabel,
    sourceBatchHref: row.sourceBatchHref,
    workbenchHref: "/actual-logs/production",
    businessDateLabel: row.businessDateLabel,
    uploadedAtLabel: row.uploadedAtLabel,
    applicationLabel: row.applicationLabel,
    appliedRecordCountLabel: row.appliedRecordCountLabel,
    sourceRowLabel: `${batch.success_rows.toLocaleString("zh-CN")} / ${batch.total_rows.toLocaleString("zh-CN")} 条成功导入`,
    timezoneCheckLabel: resolveProcessingTimezoneLabel(
      parsedRows,
      nonShanghaiTimezoneCount
    ),
    businessDayLabel: `业务日覆盖 ${row.businessDateLabel}`,
    crossDaySplitLabel: resolveProcessingCrossDayLabel(
      batch.file_type,
      hasDetailRows,
      crossDayIntervalCount
    ),
    statusIntervalBoundaryLabel: resolveStatusIntervalBoundaryLabel(
      statusIntervalCount,
      statusDictionaryCount
    ),
    loginEventBoundaryLabel: resolveLoginEventBoundaryLabel(loginEventCount),
    detailEmptyLabel: hasDetailRows
      ? "已读取批次明细"
      : "批次明细未读取，不能展示逐行登录事件或状态区间",
    blockerSummary: hasDetailRows ? row.blockerSummary : "缺少逐行处理明细",
    loginEventCount,
    statusDictionaryCount,
    statusIntervalCount,
    crossDayIntervalCount,
    nonShanghaiTimezoneCount,
    unknownStatusCount,
    exceptionShell: buildActualLogExceptionShell({
      hasDetailRows,
      statusDictionaryCount,
      unknownStatusCount,
      nonShanghaiTimezoneCount,
      crossDayIntervalCount,
    }),
    rows: parsedRows,
  }
}

function buildMissingActualLogProcessingDetail(
  batchId: string
): ActualLogProcessingDetailSummary {
  return {
    tone: "blocked",
    title: "日志处理批次未定位",
    detail: "当前来源批次不在登录/状态日志生产台账中，无法展示处理解释。",
    workspaceTabs: [...ACTUAL_LOG_PROCESSING_WORKSPACE_TABS],
    batchId,
    fileName: "未找到来源文件",
    fileTypeLabel: "未定位",
    versionLabel: "未找到实际日志业务版本",
    sourceBatchHref: "/actual-logs/production",
    workbenchHref: "/actual-logs/production",
    businessDateLabel: "未定位",
    uploadedAtLabel: "未定位",
    applicationLabel: "待应用",
    appliedRecordCountLabel: "0",
    sourceRowLabel: "未定位来源行",
    timezoneCheckLabel: "缺少逐行明细，不能伪造时区校验结果",
    businessDayLabel: "未定位业务日",
    crossDaySplitLabel: "缺少状态区间明细，不能伪造跨天切分",
    statusIntervalBoundaryLabel: "未定位状态区间",
    loginEventBoundaryLabel: "未定位登录事件",
    detailEmptyLabel: "批次明细未读取，不能展示逐行登录事件或状态区间",
    blockerSummary: "请返回日志生产工作台选择来源批次",
    loginEventCount: 0,
    statusDictionaryCount: 0,
    statusIntervalCount: 0,
    crossDayIntervalCount: 0,
    nonShanghaiTimezoneCount: 0,
    unknownStatusCount: 0,
    exceptionShell: buildActualLogExceptionShell({
      hasDetailRows: false,
      statusDictionaryCount: 0,
      unknownStatusCount: 0,
      nonShanghaiTimezoneCount: 0,
      crossDayIntervalCount: 0,
    }),
    rows: [],
  }
}

function countUnknownStatusIntervals(rows: ImportBatchRowResult[]): number {
  const successfulFields = rows
    .filter((row) => row.row_status === "success")
    .map(readStandardFields)
    .filter((fields): fields is Record<string, unknown> => Boolean(fields))
  const dictionaryCodes = new Set(
    successfulFields
      .filter((fields) => readText(fields, "record_type") === "status_dictionary")
      .map((fields) => readText(fields, "external_status_code"))
      .filter((code): code is string => Boolean(code))
  )

  if (dictionaryCodes.size === 0) {
    return 0
  }

  return successfulFields
    .filter((fields) => readText(fields, "record_type") !== "status_dictionary")
    .filter((fields) => {
      const code = readText(fields, "external_status_code")
      return code ? !dictionaryCodes.has(code) : false
    }).length
}

function buildActualLogExceptionShell({
  hasDetailRows,
  statusDictionaryCount,
  unknownStatusCount,
  nonShanghaiTimezoneCount,
  crossDayIntervalCount,
}: {
  hasDetailRows: boolean
  statusDictionaryCount: number
  unknownStatusCount: number
  nonShanghaiTimezoneCount: number
  crossDayIntervalCount: number
}): ActualLogExceptionShell {
  const statusDictionaryLabel =
    statusDictionaryCount > 0
      ? `已读取状态字典 ${statusDictionaryCount.toLocaleString("zh-CN")} 行`
      : "未读取状态字典明细"
  const unknownStatusLabel =
    unknownStatusCount > 0
      ? `发现 ${unknownStatusCount.toLocaleString("zh-CN")} 条状态区间未命中字典`
      : hasDetailRows
        ? "未发现未命中字典的状态区间"
        : "缺少明细，不能判断未知状态"
  const timezoneIssueLabel =
    nonShanghaiTimezoneCount > 0
      ? `发现 ${nonShanghaiTimezoneCount.toLocaleString("zh-CN")} 行非 Asia/Shanghai 时区`
      : hasDetailRows
        ? "未发现非 Asia/Shanghai 时区"
        : "缺少明细，不能判断时区异常"
  const crossDayExceptionLabel =
    crossDayIntervalCount > 0
      ? `发现 ${crossDayIntervalCount.toLocaleString("zh-CN")} 条跨天状态区间`
      : hasDetailRows
        ? "未发现跨天状态区间"
        : "缺少明细，不能判断跨天异常"
  const frozenEmployeeBoundaryLabel =
    "员工冻结状态需通过主数据引用校验，本页只展示边界，不提交规则变更"

  return {
    title: "状态字典与异常解释安全壳",
    detail: "当前只解释状态字典、未知状态、时区、跨天和冻结员工引用边界；所有动作均为禁用安全壳，不改变生产状态规则。",
    statusDictionaryLabel,
    unknownStatusLabel,
    timezoneIssueLabel,
    crossDayExceptionLabel,
    frozenEmployeeBoundaryLabel,
    items: [
      {
        title: "状态字典",
        detail: "只读展示已导入字典行；状态口径变更需要单独确认写入任务。",
        statusLabel: statusDictionaryLabel,
        tone: statusDictionaryCount > 0 ? "ready" : "empty",
      },
      {
        title: "未知状态",
        detail: "仅当状态区间 code 未命中本批次字典时标记为待解释，不自动创建字典。",
        statusLabel: unknownStatusLabel,
        tone: unknownStatusCount > 0 ? "blocked" : hasDetailRows ? "ready" : "empty",
      },
      {
        title: "时区错误",
        detail: "只解释非 Asia/Shanghai 明细，当前不做时区换算或生产规则修正。",
        statusLabel: timezoneIssueLabel,
        tone: nonShanghaiTimezoneCount > 0 ? "blocked" : hasDetailRows ? "ready" : "empty",
      },
      {
        title: "跨天异常",
        detail: "跨天状态区间按业务日边界解释，不在本页重算实际工时。",
        statusLabel: crossDayExceptionLabel,
        tone: crossDayIntervalCount > 0 ? "blocked" : hasDetailRows ? "ready" : "empty",
      },
      {
        title: "冻结员工引用",
        detail: "员工在职/冻结状态属于主数据引用校验，本页不提交冻结或恢复动作。",
        statusLabel: frozenEmployeeBoundaryLabel,
        tone: "empty",
      },
    ],
    actions: [
      {
        title: "维护状态字典",
        detail: "需要后续受控写入任务才可提交字典新增、修改或停用。",
        disabledLabel: "暂不变更字典",
      },
      {
        title: "提交异常规则",
        detail: "未知状态、时区错误和跨天异常暂只解释，不固化生产规则。",
        disabledLabel: "暂不提交规则",
      },
      {
        title: "重算实际工时",
        detail: "实际工时和排班 vs 实际比对需要独立计算任务触发。",
        disabledLabel: "暂不重算工时",
      },
    ],
  }
}

function summarizeActualLogDetailRows(
  batch: ImportBatchListRow,
  rows: ImportBatchRowResult[]
): ActualLogProcessingDetailRow[] {
  return rows
    .filter((row) => row.row_status === "success")
    .map((row) => {
      const standardFields = readStandardFields(row)

      if (!standardFields) {
        return {
          rowNumberLabel: `第 ${row.row_number} 行`,
          recordLabel: "明细字段不足",
          employeeLabel: "未读取",
          timeRangeLabel: "未读取",
          timezoneLabel: "缺少 standard_fields",
          businessDayLabel: "未定位",
          crossDayLabel: "缺少逐行起止时间，不能伪造跨天切分",
          boundaryLabel: "当前明细缺少标准字段，只能展示空态解释",
          tone: "blocked",
        }
      }

      if (batch.file_type === "login_log") {
        return summarizeLoginEventRow(row, standardFields)
      }

      return summarizeStatusLogRow(row, standardFields)
    })
}

function summarizeLoginEventRow(
  row: ImportBatchRowResult,
  fields: Record<string, unknown>
): ActualLogProcessingDetailRow {
  const eventType = readText(fields, "event_type") ?? "unknown"
  const eventAt = readText(fields, "event_at")
  const businessDay = formatBusinessDayFromTimestamp(eventAt)
  const timezone = readText(fields, "timezone")

  return {
    rowNumberLabel: `第 ${row.row_number} 行`,
    recordLabel: `登录事件 ${eventType}`,
    employeeLabel: readText(fields, "employee_id") ?? "未读取员工",
    timeRangeLabel: eventAt ?? "未读取事件时间",
    timezoneLabel: formatTimezoneLabel(timezone),
    businessDayLabel: businessDay,
    crossDayLabel: "登录事件不做跨天区间切分",
    boundaryLabel: "仅解释登录/登出事件归属，不计算实际工时",
    tone: timezone === "Asia/Shanghai" ? "ready" : "blocked",
  }
}

function summarizeStatusLogRow(
  row: ImportBatchRowResult,
  fields: Record<string, unknown>
): ActualLogProcessingDetailRow {
  const recordType = readText(fields, "record_type")

  if (recordType === "status_dictionary") {
    return {
      rowNumberLabel: `第 ${row.row_number} 行`,
      recordLabel: "状态字典",
      employeeLabel: "字典行",
      timeRangeLabel: readText(fields, "external_status_code") ?? "未读取状态码",
      timezoneLabel: "字典行不参与时区校验",
      businessDayLabel: "字典行不归属具体业务日",
      crossDayLabel: "字典行不做跨天切分",
      boundaryLabel: `状态 ${readText(fields, "external_status_code") ?? "未读取"} 的生产性口径待 IM107 安全壳解释`,
      tone: "ready",
    }
  }

  const startAt = readText(fields, "start_at")
  const endAt = readText(fields, "end_at")
  const startDay = formatBusinessDayFromTimestamp(startAt)
  const endDay = formatBusinessDayFromTimestamp(endAt)
  const timezone = readText(fields, "timezone")

  return {
    rowNumberLabel: `第 ${row.row_number} 行`,
    recordLabel: `状态区间 ${readText(fields, "external_status_code") ?? "unknown"}`,
    employeeLabel: readText(fields, "employee_id") ?? "未读取员工",
    timeRangeLabel: formatTimeRange(startAt, endAt),
    timezoneLabel: formatTimezoneLabel(timezone),
    businessDayLabel: startDay === endDay ? startDay : `${startDay} 至 ${endDay}`,
    crossDayLabel:
      startDay === endDay
        ? "单业务日状态区间"
        : `跨天区间：按业务日 ${startDay} / ${endDay} 切分解释`,
    boundaryLabel: "状态区间只读展示；实际生产性分钟由后续排班 vs 实际比对解释",
    tone: timezone === "Asia/Shanghai" ? "ready" : "blocked",
  }
}

function readStandardFields(row: ImportBatchRowResult): Record<string, unknown> | null {
  const standardFields = row.raw_data.standard_fields
  return isRecord(standardFields) ? standardFields : null
}

function readText(fields: Record<string, unknown>, key: string): string | null {
  const value = fields[key]

  if (value === null || value === undefined) {
    return null
  }

  const text = String(value).trim()
  return text.length > 0 ? text : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function formatTimezoneLabel(timezone: string | null): string {
  if (!timezone) {
    return "缺少时区字段"
  }

  return timezone === "Asia/Shanghai"
    ? "Asia/Shanghai 已确认"
    : `非 Asia/Shanghai：${timezone}`
}

function formatBusinessDayFromTimestamp(value: string | null): string {
  if (!value || value.length < 10) {
    return "未定位业务日"
  }

  return value.slice(0, 10)
}

function formatTimeRange(startAt: string | null, endAt: string | null): string {
  if (!startAt && !endAt) {
    return "未读取起止时间"
  }

  return `${startAt ?? "未读取开始"} 至 ${endAt ?? "未读取结束"}`
}

function resolveProcessingDetailTitle(
  fileType: ImportBatchListRow["file_type"],
  isReady: boolean,
  hasDetailRows: boolean
): string {
  if (!hasDetailRows) {
    return "日志处理解释缺少明细"
  }

  if (fileType === "status_log") {
    return isReady ? "状态日志处理解释已定位" : "状态日志处理解释仍有阻塞"
  }

  return isReady ? "登录日志处理解释已定位" : "登录日志处理解释仍有阻塞"
}

function resolveProcessingDetailText(
  fileType: ImportBatchListRow["file_type"],
  isReady: boolean,
  hasDetailRows: boolean
): string {
  if (!hasDetailRows) {
    return "当前只读页面没有可用逐行处理明细，不能展示登录事件或状态区间。"
  }

  if (isReady) {
    return fileType === "status_log"
      ? "当前状态日志明细可解释状态字典、状态区间、业务日归属、时区和跨天切分。"
      : "当前登录日志明细可解释登录/登出事件、业务日归属和 Asia/Shanghai 时区校验。"
  }

  return "当前明细存在阻塞或时区异常，只展示可确认的处理口径。"
}

function resolveProcessingTimezoneLabel(
  rows: ActualLogProcessingDetailRow[],
  nonShanghaiTimezoneCount: number
): string {
  if (rows.length === 0) {
    return "缺少逐行明细，不能伪造时区校验结果"
  }

  if (nonShanghaiTimezoneCount > 0) {
    return `发现 ${nonShanghaiTimezoneCount.toLocaleString("zh-CN")} 行非 Asia/Shanghai 时区`
  }

  return `${rows.length.toLocaleString("zh-CN")} 行明细均为 Asia/Shanghai 或字典行`
}

function resolveProcessingCrossDayLabel(
  fileType: ImportBatchListRow["file_type"],
  hasDetailRows: boolean,
  crossDayIntervalCount: number
): string {
  if (!hasDetailRows) {
    return "缺少状态区间明细，不能伪造跨天切分"
  }

  if (fileType === "login_log") {
    return "登录事件不产生跨天状态区间"
  }

  if (crossDayIntervalCount > 0) {
    return `发现 ${crossDayIntervalCount.toLocaleString("zh-CN")} 条跨天状态区间；解释为按业务日边界切分`
  }

  return "未发现跨天状态区间"
}

function resolveStatusIntervalBoundaryLabel(
  statusIntervalCount: number,
  statusDictionaryCount: number
): string {
  if (statusIntervalCount === 0 && statusDictionaryCount === 0) {
    return "暂未发现状态区间或状态字典明细"
  }

  return `状态字典 ${statusDictionaryCount.toLocaleString("zh-CN")} 行 · 状态区间 ${statusIntervalCount.toLocaleString("zh-CN")} 行`
}

function resolveLoginEventBoundaryLabel(loginEventCount: number): string {
  if (loginEventCount === 0) {
    return "暂未发现登录/登出事件明细"
  }

  return `登录/登出事件 ${loginEventCount.toLocaleString("zh-CN")} 行；不在本页计算实际工时`
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
