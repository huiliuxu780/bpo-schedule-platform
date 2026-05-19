export type ImportTemplateKind =
  | "master_data"
  | "personnel_schedule"
  | "demand_forecast"
  | "login_log"
  | "status_log"

export type ImportTemplate = {
  id: string
  kind: ImportTemplateKind
  name: string
  owner: string
  cadence: string
  sampleSheetName: string
  primaryKeys: string[]
  requiredFields: string[]
  optionalFields: string[]
  validationRules: string[]
  downstreamUse: string[]
  deferredActions: string[]
}

export type ImportTemplateSummary = {
  total: number
  totalRequiredFields: number
  totalValidationRules: number
  templateKinds: ImportTemplateKind[]
  deferredActions: string[]
}

export const globalDeferredImportActions = [
  "无真实上传",
  "无批量导入",
  "无失败行写库",
  "无修复提交",
  "无审批或权限",
]

export const fallbackImportTemplates: ImportTemplate[] = [
  template({
    id: "TPL-MASTER-DATA",
    kind: "master_data",
    name: "主数据模板",
    owner: "数据管理员",
    cadence: "按变更导入",
    sampleSheetName: "master_data.xlsx",
    primaryKeys: ["employee_id", "workplace_id", "supplier_id", "project_id"],
    requiredFields: ["employee_id", "employee_name", "workplace_id", "supplier_id", "project_id", "binding_status"],
    optionalFields: ["skill_group", "grade", "effective_from", "effective_to"],
    validationRules: ["主键不可为空", "绑定关系必须引用已存在职场和供应商", "状态只能为 active/inactive"],
    downstreamUse: ["人员级排班", "需求预测对齐", "异常归因"],
  }),
  template({
    id: "TPL-PERSONNEL-SCHEDULE",
    kind: "personnel_schedule",
    name: "人员级排班模板",
    owner: "排班运营",
    cadence: "每日导入",
    sampleSheetName: "personnel_schedule.xlsx",
    primaryKeys: ["business_date", "employee_id", "shift_type_code"],
    requiredFields: ["business_date", "employee_id", "workplace_id", "supplier_id", "project_id", "shift_type_code", "start_time", "end_time"],
    optionalFields: ["meal_break", "rest_break", "remark"],
    validationRules: ["开始时间必须早于结束时间", "班次类型必须已启用", "可展开为 0.5h 时段"],
    downstreamUse: ["时段排班汇总", "人员时间轴", "履约对比"],
  }),
  template({
    id: "TPL-DEMAND-FORECAST",
    kind: "demand_forecast",
    name: "需求预测模板",
    owner: "预测运营",
    cadence: "每日导入",
    sampleSheetName: "demand_forecast.xlsx",
    primaryKeys: ["business_date", "workplace_id", "project_id", "interval_start", "skill_group", "grade"],
    requiredFields: ["business_date", "workplace_id", "project_id", "interval_start", "interval_end", "forecast_people", "skill_group", "grade"],
    optionalFields: ["forecast_version", "source_file"],
    validationRules: ["时段必须为 0.5h", "预测人数不能为负", "技能组和等级不能为空"],
    downstreamUse: ["排班缺口识别", "异常复核", "需求计划展示"],
  }),
  template({
    id: "TPL-LOGIN-LOG",
    kind: "login_log",
    name: "登录日志模板",
    owner: "现场主管",
    cadence: "每日导入",
    sampleSheetName: "login_log.xlsx",
    primaryKeys: ["employee_id", "login_at", "logout_at"],
    requiredFields: ["employee_id", "login_at", "logout_at", "source_system"],
    optionalFields: ["device_id", "ip_address"],
    validationRules: ["登出时间必须晚于登录时间", "员工必须存在于主数据", "日志不可与同员工登录段重叠"],
    downstreamUse: ["人员时间轴", "迟到早退识别", "履约对比"],
  }),
  template({
    id: "TPL-STATUS-LOG",
    kind: "status_log",
    name: "状态日志模板",
    owner: "现场主管",
    cadence: "每日导入",
    sampleSheetName: "status_log.xlsx",
    primaryKeys: ["employee_id", "status_start", "status_end", "status_type"],
    requiredFields: ["employee_id", "status_start", "status_end", "status_type"],
    optionalFields: ["status_source", "remark"],
    validationRules: ["状态时间段不可重叠", "状态类型必须映射到本地字典", "员工必须存在于主数据"],
    downstreamUse: ["人员时间轴", "非有效产能识别", "异常归因"],
  }),
]

export function summarizeImportTemplates(
  rows: ImportTemplate[]
): ImportTemplateSummary {
  return {
    total: rows.length,
    totalRequiredFields: rows.reduce(
      (sum, row) => sum + row.requiredFields.length,
      0
    ),
    totalValidationRules: rows.reduce(
      (sum, row) => sum + row.validationRules.length,
      0
    ),
    templateKinds: rows.map((row) => row.kind),
    deferredActions: globalDeferredImportActions,
  }
}

export function getImportTemplateById(id: string) {
  return fallbackImportTemplates.find((row) => row.id === id)
}

export function importTemplateKindLabel(kind: ImportTemplateKind) {
  const labels: Record<ImportTemplateKind, string> = {
    master_data: "主数据",
    personnel_schedule: "人员排班",
    demand_forecast: "需求预测",
    login_log: "登录日志",
    status_log: "状态日志",
  }

  return labels[kind]
}

function template(
  row: Omit<ImportTemplate, "deferredActions">
): ImportTemplate {
  return {
    ...row,
    deferredActions: globalDeferredImportActions,
  }
}
