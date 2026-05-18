export type DataQualitySource =
  | "master_data"
  | "personnel_schedule"
  | "demand_forecast"
  | "login_log"
  | "status_log"

export type DataQualitySeverity = "high" | "medium" | "low"

export type DataQualityStatus = "open" | "acknowledged" | "resolved" | "ignored"

export type DataQualityIssue = {
  id: string
  title: string
  code: string
  source: DataQualitySource
  entity: string
  fieldName: string
  rawValue: string
  severity: DataQualitySeverity
  status: DataQualityStatus
  owner: string
  detectedAt: string
  blockedRows: number
  recommendation: string
}

export type DataQualityFilters = {
  query?: string
  source?: DataQualitySource | "all"
  status?: DataQualityStatus | "all"
  severity?: DataQualitySeverity | "all"
}

export type DataQualitySummary = {
  total: number
  open: number
  acknowledged: number
  resolved: number
  ignored: number
  highSeverity: number
  blockedRows: number
  sourceCounts: Record<DataQualitySource, number>
  deferredActions: string[]
}

export const deferredDataQualityActions = [
  "无真实数据修复",
  "无审批流",
  "无权限隔离",
  "无导出或批量处理",
  "无生产导入写入",
]

export const dataQualitySourceLabels: Record<DataQualitySource, string> = {
  master_data: "主数据",
  personnel_schedule: "人员排班",
  demand_forecast: "需求预测",
  login_log: "登录日志",
  status_log: "状态日志",
}

export const fallbackDataQualityIssues: DataQualityIssue[] = [
  issue("DQ-202605-001", "坐席姓名缺失", "missing_required_field", "master_data", "agent", "employee_name", "", "high", "open", "数据管理员", 48, "补齐坐席姓名后重新校验导入批次。"),
  issue("DQ-202605-002", "职场时区非法", "invalid_timezone", "master_data", "workplace", "timezone", "GMT+25", "medium", "acknowledged", "数据管理员", 12, "改为 IANA 时区编码，例如 Asia/Shanghai。"),
  issue("DQ-202605-003", "供应商主键重复", "duplicate_primary_key", "master_data", "supplier", "supplier_id", "SUP-08", "medium", "open", "数据管理员", 37, "合并或更正重复供应商编码后再导入。"),
  issue("DQ-202605-004", "人员绑定缺失", "unknown_foreign_key", "master_data", "agent_binding", "employee_id", "A-9931", "medium", "open", "数据管理员", 19, "补齐员工主数据或修正绑定关系中的员工编码。"),
  issue("DQ-202605-005", "排班开始晚于结束", "invalid_time_range", "personnel_schedule", "personnel_schedule", "start_at", "18:00 > 09:00", "high", "open", "排班运营", 28, "检查跨天班次是否补充 business_date 和 end_at。"),
  issue("DQ-202605-006", "班次类型不存在", "unknown_shift_type_id", "personnel_schedule", "personnel_schedule", "shift_type_id", "SHIFT-X", "medium", "acknowledged", "排班运营", 16, "先在班次类型主数据中维护该编码。"),
  issue("DQ-202605-007", "饭点超出班次", "break_or_meal_outside_shift", "personnel_schedule", "personnel_schedule", "meal_windows", "20:00-20:30", "low", "resolved", "排班运营", 11, "调整饭点窗口到班次开始和结束范围内。"),
  issue("DQ-202605-008", "预测时段断档", "missing_interval", "demand_forecast", "demand_forecast", "interval_start", "12:30", "medium", "open", "排班运营", 21, "补齐连续 0.5h 预测时段后再做排班对比。"),
  issue("DQ-202605-009", "登录员工不在主数据", "missing_master_data", "login_log", "login_log", "employee_id", "A-7788", "low", "ignored", "现场主管", 9, "确认是否为临时账号；若需要计入履约，先补主数据。"),
  issue("DQ-202605-010", "状态时间段重叠", "status_overlap", "status_log", "status_log", "status_start_at", "11:00-11:30", "high", "open", "运营负责人", 20, "拆分或修正重叠状态，避免非有效产能重复计算。"),
]

export function summarizeDataQualityIssues(
  rows: DataQualityIssue[]
): DataQualitySummary {
  return {
    total: rows.length,
    open: rows.filter((row) => row.status === "open").length,
    acknowledged: rows.filter((row) => row.status === "acknowledged").length,
    resolved: rows.filter((row) => row.status === "resolved").length,
    ignored: rows.filter((row) => row.status === "ignored").length,
    highSeverity: rows.filter((row) => row.severity === "high").length,
    blockedRows: rows.reduce((total, row) => total + row.blockedRows, 0),
    sourceCounts: countBySource(rows),
    deferredActions: deferredDataQualityActions,
  }
}

export function filterDataQualityIssues(
  rows: DataQualityIssue[],
  {
    query = "",
    source = "all",
    status = "all",
    severity = "all",
  }: DataQualityFilters
) {
  const normalizedQuery = query.trim().toLowerCase()

  return rows.filter((row) => {
    if (source !== "all" && row.source !== source) {
      return false
    }

    if (status !== "all" && row.status !== status) {
      return false
    }

    if (severity !== "all" && row.severity !== severity) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return [
      row.id,
      row.title,
      row.code,
      row.entity,
      row.fieldName,
      row.rawValue,
      row.owner,
      row.recommendation,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

export function getDataQualityIssue(id: string) {
  return fallbackDataQualityIssues.find((row) => row.id === id)
}

export function dataQualitySeverityLabel(severity: DataQualitySeverity) {
  return {
    high: "高",
    medium: "中",
    low: "低",
  }[severity]
}

export function dataQualityStatusLabel(status: DataQualityStatus) {
  return {
    open: "未解决",
    acknowledged: "已确认",
    resolved: "已解决",
    ignored: "已忽略",
  }[status]
}

function countBySource(rows: DataQualityIssue[]) {
  const counts: Record<DataQualitySource, number> = {
    master_data: 0,
    personnel_schedule: 0,
    demand_forecast: 0,
    login_log: 0,
    status_log: 0,
  }

  for (const row of rows) {
    counts[row.source] += 1
  }

  return counts
}

function issue(
  id: string,
  title: string,
  code: string,
  source: DataQualitySource,
  entity: string,
  fieldName: string,
  rawValue: string,
  severity: DataQualitySeverity,
  status: DataQualityStatus,
  owner: string,
  blockedRows: number,
  recommendation: string
): DataQualityIssue {
  return {
    id,
    title,
    code,
    source,
    entity,
    fieldName,
    rawValue,
    severity,
    status,
    owner,
    detectedAt: "2026-05-19 10:00",
    blockedRows,
    recommendation,
  }
}
