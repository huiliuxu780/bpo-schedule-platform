// 相对路径导入：保证 scripts/tests 的 node --experimental-strip-types 可直接执行
// （@/ 别名在 node 下无法解析；import-center-model 无依赖，适合模型层复用）。
import {
  type ImportBatchListRow,
  type ImportFieldMappingTemplate,
  formatImportBatchDisplayLabel,
} from "../components/import-center-model.ts"

// 统一导入任务模型：四种变体（需求预测 / 人员排班 / 实际日志 / 主数据）的
// 判别联合与参数化三步向导（upload → mapping → result）摘要。
// forecast 变体完整进入模型层，但当前阶段不在任何页面挂载（旧页仍用旧对话框）。

export type ImportTaskVariant = "forecast" | "schedule" | "actual-log" | "master-data"

export type ImportTaskLogType = "login" | "status"

export type ImportTaskStepKey = "upload" | "mapping" | "result"

export type ImportTaskStep = {
  key: ImportTaskStepKey
  title: string
  detail: string
}

export type ImportTaskMappingMode = {
  key: "template" | "manual"
  label: string
  detail: string
}

export type ImportTaskDialogResult = {
  tone: "success" | "failed"
  title: string
  detail: string
  rowSummary: string
  batchHref: string | null
}

export type ImportTaskDialogSummary = {
  variant: ImportTaskVariant
  logType: ImportTaskLogType | null
  title: string
  description: string
  openHref: string
  closeHref: string
  resultRedirectTo: string
  fileType: string
  uploadHint: string
  batchIdPlaceholder: string
  fileNamePlaceholder: string
  uploaderDefault: string
  defaultFieldMapping: Record<string, string>
  templateDownloadHref: string
  templateDownloadName: string
  steps: ImportTaskStep[]
  mappingModes: ImportTaskMappingMode[]
  activeTemplates: ImportFieldMappingTemplate[]
  result: ImportTaskDialogResult | null
}

type ImportTaskDialogConfig = {
  variant: ImportTaskVariant
  logType: ImportTaskLogType | null
  fileType: string
  dialogTitle: string
  dialogDescription: string
  uploadHint: string
  batchIdPlaceholder: string
  fileNamePlaceholder: string
  uploaderDefault: string
  defaultFieldMapping: Record<string, string>
  templateDownloadName: string
  templateLines: string[]
  stepUploadDetail: string
  templateMappingDetail: string
  resultLabel: string
}

const TEMPLATE_HEADER = (lines: string[]): string =>
  `data:text/csv;charset=utf-8,${encodeURIComponent(lines.join("\n"))}`

const SCHEDULE_STEP_DETAILS = {
  upload: "下载排班模板后上传本次人员排班 CSV。",
  mapping: "选择已有映射模板；表头不一致时使用手动字段映射。",
  result: "只展示本次导入摘要，完整行结果进入批次详情处理。",
}

const LOG_STEP_DETAILS: Record<ImportTaskLogType, typeof SCHEDULE_STEP_DETAILS> = {
  login: {
    upload: "下载登录日志模板后上传登录/登出事件 CSV。",
    mapping: SCHEDULE_STEP_DETAILS.mapping,
    result: SCHEDULE_STEP_DETAILS.result,
  },
  status: {
    upload: "下载状态日志模板后上传状态字典或状态区间 CSV。",
    mapping: SCHEDULE_STEP_DETAILS.mapping,
    result: SCHEDULE_STEP_DETAILS.result,
  },
}

export const IMPORT_TASK_DIALOG_CONFIGS: Record<ImportTaskVariant, ImportTaskDialogConfig> = {
  forecast: {
    variant: "forecast",
    logType: null,
    fileType: "demand_forecast",
    dialogTitle: "需求预测导入",
    dialogDescription: "从需求预测生产台发起导入；行明细、失败修正和应用处理进入批次详情。",
    uploadHint: "先下载模板，按日期、职场、技能和需求区间补齐后上传。",
    batchIdPlaceholder: "FORECAST-20260612-001",
    fileNamePlaceholder: "demand-forecast.csv",
    uploaderDefault: "planner",
    defaultFieldMapping: {
      forecast_date: "forecast_date",
      interval_start: "interval_start",
      interval_end: "interval_end",
      workplace_id: "workplace_id",
      skill_id: "skill_id",
      demand_level: "demand_level",
      required_agents: "required_agents",
    },
    templateDownloadName: "demand-forecast-template.csv",
    templateLines: [
      "forecast_date,interval_start,interval_end,workplace_id,skill_id,demand_level,required_agents",
      "2026-06-08,09:00,09:30,SH-01,L1-CN,L1,12",
    ],
    stepUploadDetail: "下载需求预测模板后上传本次需求 CSV。",
    templateMappingDetail: "使用已维护的需求预测字段映射。",
    resultLabel: "需求预测",
  },
  schedule: {
    variant: "schedule",
    logType: null,
    fileType: "personnel_schedule",
    dialogTitle: "排班导入",
    dialogDescription: "从排班计划台发起导入；行明细、失败修正和应用处理进入批次详情。",
    uploadHint: "先下载模板，按日期、人员、职场、供应商、技能、班次和时间补齐后上传。",
    batchIdPlaceholder: "SCH-20260612-001",
    fileNamePlaceholder: "personnel-schedule.csv",
    uploaderDefault: "planner",
    defaultFieldMapping: {
      schedule_date: "schedule_date",
      employee_id: "employee_id",
      workplace_id: "workplace_id",
      supplier_id: "supplier_id",
      skill_id: "skill_id",
      shift_type_id: "shift_type_id",
      start_time: "start_time",
      end_time: "end_time",
    },
    templateDownloadName: "personnel-schedule-template.csv",
    templateLines: [
      "schedule_date,employee_id,workplace_id,supplier_id,skill_id,shift_type_id,start_time,end_time",
      "2026-06-08,A-1001,SH-01,SUP-A,L1-CN,MORNING,09:00,18:00",
    ],
    stepUploadDetail: SCHEDULE_STEP_DETAILS.upload,
    templateMappingDetail: "使用已维护的排班字段映射。",
    resultLabel: "排班",
  },
  "actual-log": {
    variant: "actual-log",
    logType: "login",
    fileType: "login_log",
    dialogTitle: "登录日志导入",
    dialogDescription: "从实际执行页发起导入；行明细、失败修正和应用处理进入批次详情。",
    uploadHint: "先下载模板，按人员、事件时间、状态区间和时区字段补齐后上传。",
    batchIdPlaceholder: "LOGIN-20260612-001",
    fileNamePlaceholder: "login-log.csv",
    uploaderDefault: "operator",
    defaultFieldMapping: {
      event_id: "event_id",
      employee_id: "employee_id",
      event_type: "event_type",
      event_time: "event_time",
      timezone: "timezone",
    },
    templateDownloadName: "login-log-template.csv",
    templateLines: [
      "event_id,employee_id,event_type,event_time,timezone",
      "LOGIN-001,A-1001,login,2026-06-08T09:00:00,Asia/Shanghai",
    ],
    stepUploadDetail: LOG_STEP_DETAILS.login.upload,
    templateMappingDetail: "使用已维护的实际日志字段映射。",
    resultLabel: "登录日志",
  },
  "master-data": {
    variant: "master-data",
    logType: null,
    fileType: "master_data",
    dialogTitle: "客服人员批量导入",
    dialogDescription: "从基础配置页发起导入；行明细、失败修正和应用处理进入批次详情。",
    uploadHint: "先下载模板，按人员、组织、职场和技能字段补齐后上传。",
    batchIdPlaceholder: "MD-AGENTS-20260605-001",
    fileNamePlaceholder: "customer-service-agents.csv",
    uploaderDefault: "operator",
    defaultFieldMapping: {
      record_type: "record_type",
      employee_id: "employee_id",
      employee_name: "employee_name",
      status: "status",
      employee_type: "employee_type",
      organization_id: "organization_id",
      workplace_id: "workplace_id",
      effective_from: "effective_from",
      effective_to: "effective_to",
    },
    templateDownloadName: "customer-service-agents-template.csv",
    templateLines: [
      "record_type,employee_id,employee_name,status,employee_type,organization_id,workplace_id,effective_from,effective_to,skill_id",
      "employee,A-2001,刘晓晓,active,internal,ORG-RETURN,NJ-01,2026-06-01,2026-12-31,",
      "employee_skill,A-2001,,, ,,,2026-06-01,2026-12-31,SKILL-RETURN-TICKET",
    ],
    stepUploadDetail: "下载人员导入模板后上传本次客服人员 CSV。",
    templateMappingDetail: "使用已维护的主数据字段映射。",
    resultLabel: "主数据",
  },
}

const STATUS_LOG_CONFIG: ImportTaskDialogConfig = {
  ...IMPORT_TASK_DIALOG_CONFIGS["actual-log"],
  logType: "status",
  fileType: "status_log",
  dialogTitle: "状态日志导入",
  batchIdPlaceholder: "STATUS-20260612-001",
  fileNamePlaceholder: "status-log.csv",
  defaultFieldMapping: {
    record_type: "record_type",
    interval_id: "interval_id",
    employee_id: "employee_id",
    external_status_code: "external_status_code",
    start_at: "start_at",
    end_at: "end_at",
    timezone: "timezone",
    normalized_status: "normalized_status",
    category: "category",
    is_productive: "is_productive",
  },
  templateDownloadName: "status-log-template.csv",
  templateLines: [
    "record_type,interval_id,employee_id,external_status_code,start_at,end_at,timezone,normalized_status,category,is_productive",
    "status_interval,ST-001,A-1001,READY,2026-06-08T09:00:00,2026-06-08T09:30:00,Asia/Shanghai,ready,available,true",
  ],
  stepUploadDetail: LOG_STEP_DETAILS.status.upload,
  resultLabel: "状态日志",
}

function resolveDialogConfig(
  variant: ImportTaskVariant,
  logType: ImportTaskLogType
): ImportTaskDialogConfig {
  if (variant === "actual-log") {
    return logType === "status" ? STATUS_LOG_CONFIG : IMPORT_TASK_DIALOG_CONFIGS["actual-log"]
  }

  return IMPORT_TASK_DIALOG_CONFIGS[variant]
}

function appendSearchParam(href: string, key: string, value: string): string {
  const separator = href.includes("?") ? "&" : "?"
  return `${href}${separator}${key}=${encodeURIComponent(value)}`
}

function resolveImportTaskOpenHref(
  variant: ImportTaskVariant,
  routePrefix: string,
  logType: ImportTaskLogType
): string {
  if (variant === "actual-log") {
    return appendSearchParam(appendSearchParam(routePrefix, "import_dialog", "1"), "log_type", logType)
  }

  return appendSearchParam(routePrefix, "import_dialog", "1")
}

function buildImportTaskBatchHref(batchId: string): string {
  return `/data-quality/import-batches/${encodeURIComponent(batchId)}`
}

function summarizeImportTaskDialogResult({
  config,
  uploadStatus,
  uploadReason,
  uploadBatchId,
  batch,
}: {
  config: ImportTaskDialogConfig
  uploadStatus?: string | null
  uploadReason?: string | null
  uploadBatchId?: string | null
  batch: ImportBatchListRow | null
}): ImportTaskDialogResult | null {
  if (uploadStatus !== "success" && uploadStatus !== "failed") {
    return null
  }

  const batchHref = uploadBatchId ? buildImportTaskBatchHref(uploadBatchId) : null

  if (uploadStatus === "success") {
    return {
      tone: "success",
      title: "导入已提交",
      detail: uploadBatchId
        ? `${config.resultLabel}导入批次 ${formatImportBatchDisplayLabel(uploadBatchId)} 已创建。`
        : `${config.resultLabel}导入已提交。`,
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
    rowSummary: `未形成可处理的${config.resultLabel}导入批次`,
    batchHref,
  }
}

export function summarizeImportTaskDialog({
  variant,
  routePrefix,
  batches,
  templates,
  uploadStatus,
  uploadReason,
  uploadBatchId,
  logType = "login",
}: {
  variant: ImportTaskVariant
  routePrefix: string
  batches: ImportBatchListRow[]
  templates: ImportFieldMappingTemplate[]
  uploadStatus?: string | null
  uploadReason?: string | null
  uploadBatchId?: string | null
  logType?: ImportTaskLogType
}): ImportTaskDialogSummary {
  const config = resolveDialogConfig(variant, logType)
  const activeTemplates = templates
    .filter((template) => template.file_type === config.fileType && template.is_active)
    .sort((left, right) => left.template_name.localeCompare(right.template_name, "zh-CN"))
  const resultBatch = uploadBatchId
    ? batches.find((batch) => batch.batch_id === uploadBatchId) ?? null
    : null
  const openHref = resolveImportTaskOpenHref(variant, routePrefix, logType)
  const steps: ImportTaskStep[] = [
    { key: "upload", title: "上传文件", detail: config.stepUploadDetail },
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
  ]
  const mappingModes: ImportTaskMappingMode[] = [
    {
      key: "template",
      label: "选择映射模板",
      detail: activeTemplates.length > 0
        ? config.templateMappingDetail
        : "暂无启用模板，可改用手动映射。",
    },
    {
      key: "manual",
      label: "手动映射字段",
      detail: "按 CSV 表头填写字段映射 JSON，仅作用于本次导入。",
    },
  ]

  return {
    variant,
    logType: config.logType,
    title: config.dialogTitle,
    description: config.dialogDescription,
    openHref,
    closeHref: routePrefix,
    resultRedirectTo: openHref,
    fileType: config.fileType,
    uploadHint: config.uploadHint,
    batchIdPlaceholder: config.batchIdPlaceholder,
    fileNamePlaceholder: config.fileNamePlaceholder,
    uploaderDefault: config.uploaderDefault,
    defaultFieldMapping: config.defaultFieldMapping,
    templateDownloadHref: TEMPLATE_HEADER(config.templateLines),
    templateDownloadName: config.templateDownloadName,
    steps,
    mappingModes,
    activeTemplates,
    result: summarizeImportTaskDialogResult({
      config,
      uploadStatus,
      uploadReason,
      uploadBatchId,
      batch: resultBatch,
    }),
  }
}
