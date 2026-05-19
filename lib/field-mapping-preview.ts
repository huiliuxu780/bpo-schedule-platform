export type MappingStatus = "mapped" | "missing" | "warning"

export type FieldMapping = {
  id: string
  templateId: string
  templateName: string
  sourceField: string
  targetObject: string
  targetField: string
  required: boolean
  status: MappingStatus
  transform: string
  validation: string
}

export type FieldMappingSummary = {
  total: number
  mapped: number
  missing: number
  warning: number
  required: number
  templates: string[]
  deferredActions: string[]
}

export const deferredFieldMappingActions = [
  "无映射保存",
  "无真实字段转换",
  "无导入执行",
  "无审批或权限",
]

export const fallbackFieldMappings: FieldMapping[] = [
  mapping("TPL-MASTER-DATA", "主数据模板", "employee_id", "agent", "employeeId", true, "mapped", "trim + uppercase", "主键不可为空"),
  mapping("TPL-MASTER-DATA", "主数据模板", "supplier_id", "supplierBinding", "supplierId", true, "mapped", "trim", "供应商必须存在"),
  mapping("TPL-MASTER-DATA", "主数据模板", "effective_to", "supplierBinding", "effectiveTo", false, "warning", "date parse", "结束日期为空时按长期有效"),
  mapping("TPL-PERSONNEL-SCHEDULE", "人员级排班模板", "shift_type_code", "personnelSchedule", "shiftTypeCode", true, "mapped", "trim", "班次类型必须启用"),
  mapping("TPL-PERSONNEL-SCHEDULE", "人员级排班模板", "meal_break", "personnelSchedule", "mealBreak", false, "warning", "minutes parse", "饭点为空时使用班次默认值"),
  mapping("TPL-DEMAND-FORECAST", "需求预测模板", "forecast_people", "demandForecast", "forecastPeople", true, "mapped", "number parse", "预测人数不能为负"),
  mapping("TPL-DEMAND-FORECAST", "需求预测模板", "grade", "demandForecast", "grade", true, "missing", "none", "等级字段缺失会阻断导入"),
  mapping("TPL-LOGIN-LOG", "登录日志模板", "login_at", "loginLog", "loginAt", true, "mapped", "datetime parse", "登录时间必须合法"),
  mapping("TPL-STATUS-LOG", "状态日志模板", "status_type", "statusLog", "statusType", true, "mapped", "dictionary map", "状态类型必须可映射"),
]

export function summarizeFieldMappings(
  rows: FieldMapping[]
): FieldMappingSummary {
  const templates = Array.from(new Set(rows.map((row) => row.templateName)))

  return rows.reduce<FieldMappingSummary>(
    (summary, row) => {
      summary.total += 1

      if (row.status === "mapped") {
        summary.mapped += 1
      } else if (row.status === "missing") {
        summary.missing += 1
      } else {
        summary.warning += 1
      }

      if (row.required) {
        summary.required += 1
      }

      return summary
    },
    {
      total: 0,
      mapped: 0,
      missing: 0,
      warning: 0,
      required: 0,
      templates,
      deferredActions: deferredFieldMappingActions,
    }
  )
}

export function groupFieldMappingsByTemplate(rows: FieldMapping[]) {
  return rows.reduce<Record<string, FieldMapping[]>>((groups, row) => {
    groups[row.templateName] = [...(groups[row.templateName] ?? []), row]
    return groups
  }, {})
}

export function mappingStatusLabel(status: MappingStatus) {
  const labels: Record<MappingStatus, string> = {
    mapped: "已映射",
    missing: "缺失",
    warning: "需确认",
  }

  return labels[status]
}

function mapping(
  templateId: string,
  templateName: string,
  sourceField: string,
  targetObject: string,
  targetField: string,
  required: boolean,
  status: MappingStatus,
  transform: string,
  validation: string
): FieldMapping {
  return {
    id: `${templateId}-${sourceField}`,
    templateId,
    templateName,
    sourceField,
    targetObject,
    targetField,
    required,
    status,
    transform,
    validation,
  }
}
