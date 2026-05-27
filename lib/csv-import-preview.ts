export type CsvImportType =
  | "master-data"
  | "personnel-schedule"
  | "demand-forecast"
  | "login-log"
  | "status-log"

export type CsvImportTypeOption = {
  id: CsvImportType
  label: string
  title: string
  description: string
  uploadedBy: string
  requiredFields: string[]
  optionalFields: string[]
  pendingValidationFields: string[]
}

export type CsvImportPreviewInput = {
  importType: CsvImportType
  fileName: string
  csvContent: string
}

export type CsvImportPreview = {
  importType: CsvImportType
  typeLabel: string
  fileName: string
  totalRows: number
  detectedFields: string[]
  requiredFields: string[]
  mappedFields: string[]
  missingRequiredFields: string[]
  warningFields: string[]
  pendingValidationFields: string[]
}

export type CsvImportPreviewFormState = {
  status: "idle" | "ready" | "error"
  message: string
  preview?: CsvImportPreview
}

export const csvImportTypeOptions: CsvImportTypeOption[] = [
  {
    id: "master-data",
    label: "主数据",
    title: "主数据 CSV 预览",
    description: "上传坐席、职场、供应商、项目、技能和绑定关系 CSV，先确认字段映射。",
    uploadedBy: "数据管理员",
    requiredFields: [
      "employee_id",
      "workplace_id",
      "supplier_id",
      "project_id",
      "skill_group",
      "effective_from",
    ],
    optionalFields: ["employee_name", "supplier_name", "effective_to", "status"],
    pendingValidationFields: [
      "employee_id",
      "workplace_id",
      "supplier_id",
      "project_id",
      "skill_group",
      "effective_from",
    ],
  },
  {
    id: "personnel-schedule",
    label: "人员级排班",
    title: "人员级排班 CSV 导入",
    description: "上传人员级排班 CSV，确认字段后可提交到本地导入批次。",
    uploadedBy: "排班运营",
    requiredFields: [
      "schedule_detail_id",
      "schedule_version_id",
      "employee_id",
      "business_date",
      "workplace_id",
      "supplier_id",
      "project_id",
      "shift_type_id",
      "start_at",
      "end_at",
      "status",
    ],
    optionalFields: ["source_system", "note"],
    pendingValidationFields: ["employee_id", "shift_type_id", "start_at", "end_at", "status"],
  },
  {
    id: "demand-forecast",
    label: "需求预测",
    title: "需求预测 CSV 导入",
    description: "上传需求预测 CSV，确认字段后可提交到本地导入批次。",
    uploadedBy: "数据管理员",
    requiredFields: [
      "business_date",
      "workplace_id",
      "project_id",
      "interval_start",
      "interval_end",
      "forecast_agents",
    ],
    optionalFields: ["skill_group", "grade", "source_system"],
    pendingValidationFields: ["interval_start", "interval_end", "forecast_agents"],
  },
  {
    id: "login-log",
    label: "登录日志",
    title: "登录日志 CSV 导入",
    description: "上传登录日志 CSV，确认字段后可提交到本地导入批次。",
    uploadedBy: "现场主管",
    requiredFields: [
      "login_log_id",
      "employee_id",
      "business_date",
      "login_at",
      "logout_at",
      "workplace_id",
      "project_id",
      "source_system",
    ],
    optionalFields: ["device_id", "timezone"],
    pendingValidationFields: ["employee_id", "login_at", "logout_at", "source_system"],
  },
  {
    id: "status-log",
    label: "状态日志",
    title: "状态日志 CSV 导入",
    description: "上传状态日志 CSV，确认字段后可提交到本地导入批次。",
    uploadedBy: "现场主管",
    requiredFields: [
      "status_log_id",
      "employee_id",
      "business_date",
      "status_type",
      "start_at",
      "end_at",
      "workplace_id",
      "project_id",
      "source_system",
    ],
    optionalFields: ["timezone", "source_status_code"],
    pendingValidationFields: ["employee_id", "status_type", "start_at", "end_at", "source_system"],
  },
]

export const initialCsvImportPreviewState: CsvImportPreviewFormState = {
  status: "idle",
  message: "选择 CSV 后先预览字段映射，再决定是否提交导入。",
}

export function normalizeCsvImportType(value: string | null | undefined): CsvImportType {
  return csvImportTypeOptions.some((option) => option.id === value)
    ? (value as CsvImportType)
    : "status-log"
}

export function csvImportTypeLabel(importType: CsvImportType) {
  return csvImportTypeOptions.find((option) => option.id === importType)?.label ?? "状态日志"
}

export function csvImportTypeOption(importType: CsvImportType) {
  return (
    csvImportTypeOptions.find((option) => option.id === importType) ??
    csvImportTypeOptions[csvImportTypeOptions.length - 1]
  )
}

export function buildCsvImportPreview(input: CsvImportPreviewInput): CsvImportPreview {
  const option = csvImportTypeOption(input.importType)
  const records = parseCsvRecords(input.csvContent)
  const detectedFields = records[0]?.map((field) => field.trim()).filter(Boolean) ?? []
  const dataRows = records
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim().length > 0))
  const knownFields = new Set([...option.requiredFields, ...option.optionalFields])
  const detectedFieldSet = new Set(detectedFields)
  const mappedFields = detectedFields.filter((field) => knownFields.has(field))
  const missingRequiredFields = option.requiredFields.filter(
    (field) => !detectedFieldSet.has(field)
  )
  const warningFields = detectedFields.filter((field) => !knownFields.has(field))
  const pendingValidationFields = option.pendingValidationFields.filter((field) =>
    detectedFieldSet.has(field)
  )

  return {
    importType: input.importType,
    typeLabel: option.label,
    fileName: input.fileName,
    totalRows: dataRows.length,
    detectedFields,
    requiredFields: option.requiredFields,
    mappedFields,
    missingRequiredFields,
    warningFields,
    pendingValidationFields,
  }
}

function parseCsvRecords(csvContent: string) {
  const records: string[][] = []
  let row: string[] = []
  let cell = ""
  let inQuotes = false

  for (let index = 0; index < csvContent.length; index += 1) {
    const char = csvContent[index]
    const next = csvContent[index + 1]

    if (char === '"' && inQuotes && next === '"') {
      cell += '"'
      index += 1
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      row.push(cell)
      cell = ""
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1
      }
      row.push(cell)
      records.push(row)
      row = []
      cell = ""
    } else {
      cell += char
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    records.push(row)
  }

  return records.filter((record) => record.some((value) => value.trim().length > 0))
}
