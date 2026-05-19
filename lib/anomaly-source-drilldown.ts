export type AnomalyReviewSource =
  | "forecast_schedule"
  | "schedule_login"
  | "schedule_status"
  | "master_data"
  | "data_quality"

export type AnomalySourceDefinition = {
  id: AnomalyReviewSource
  label: string
  owner: string
  inputObjects: string[]
  alignmentKeys: string[]
  triggerConditions: string[]
  traceKeys: string[]
  exampleCaseIds: string[]
  deferredActions: string[]
}

export type AnomalySourceSummary = {
  totalSources: number
  totalExamples: number
  totalTriggerConditions: number
  sourceCaseCounts: Record<AnomalyReviewSource, number>
  deferredActions: string[]
}

export const deferredAnomalySourceActions = [
  "无真实异常计算",
  "无复核提交",
  "无审批流",
  "无权限隔离",
  "无导出或批量处理",
]

export const fallbackAnomalySources: AnomalySourceDefinition[] = [
  source({
    id: "forecast_schedule",
    label: "预测 vs 排班",
    owner: "排班运营",
    inputObjects: ["需求预测", "时段排班汇总", "人员级排班"],
    alignmentKeys: ["business_date", "workplace_id", "project_id", "interval_start", "skill_group", "grade"],
    triggerConditions: ["预测人数大于已排人数", "已排人数大于预测人数且超出缓冲阈值"],
    traceKeys: ["forecast_version", "schedule_plan_id", "shift_type_code"],
    exampleCaseIds: ["AR-202605-001", "AR-202605-002"],
  }),
  source({
    id: "schedule_login",
    label: "排班 vs 登录",
    owner: "现场主管",
    inputObjects: ["人员级排班", "登录日志", "坐席主数据"],
    alignmentKeys: ["business_date", "employee_id", "scheduled_start", "login_at"],
    triggerConditions: ["计划有班但无登录", "登录晚于计划开始", "登出早于计划结束"],
    traceKeys: ["employee_id", "shift_type_code", "login_session_id"],
    exampleCaseIds: ["AR-202605-003", "AR-202605-004", "AR-202605-005"],
  }),
  source({
    id: "schedule_status",
    label: "排班 vs 状态",
    owner: "运营负责人",
    inputObjects: ["人员级排班", "状态日志", "状态字典"],
    alignmentKeys: ["business_date", "employee_id", "status_start", "status_end"],
    triggerConditions: ["排班内出现非有效产能状态", "状态时间段缺失", "状态与登录会话不重合"],
    traceKeys: ["employee_id", "status_type", "status_source"],
    exampleCaseIds: ["AR-202605-006"],
  }),
  source({
    id: "master_data",
    label: "主数据",
    owner: "数据管理员",
    inputObjects: ["坐席主数据", "职场主数据", "供应商主数据", "绑定关系"],
    alignmentKeys: ["employee_id", "workplace_id", "supplier_id", "project_id"],
    triggerConditions: ["人员绑定缺失", "职场或供应商引用缺失", "绑定关系不在有效期"],
    traceKeys: ["employee_id", "binding_id", "effective_from", "effective_to"],
    exampleCaseIds: ["AR-202605-007"],
  }),
  source({
    id: "data_quality",
    label: "数据质量",
    owner: "数据管理员",
    inputObjects: ["导入模板", "失败行", "字段校验结果"],
    alignmentKeys: ["batch_id", "source_file", "row_number", "field_name"],
    triggerConditions: ["必填字段为空", "重复主键", "时间范围非法", "状态时间段重叠"],
    traceKeys: ["batch_id", "error_code", "row_number"],
    exampleCaseIds: ["AR-202605-008"],
  }),
]

export function summarizeAnomalySources(
  rows: AnomalySourceDefinition[]
): AnomalySourceSummary {
  const sourceCaseCounts = rows.reduce<Record<AnomalyReviewSource, number>>(
    (counts, row) => {
      counts[row.id] = row.exampleCaseIds.length
      return counts
    },
    {
      forecast_schedule: 0,
      schedule_login: 0,
      schedule_status: 0,
      master_data: 0,
      data_quality: 0,
    }
  )

  return {
    totalSources: rows.length,
    totalExamples: rows.reduce((sum, row) => sum + row.exampleCaseIds.length, 0),
    totalTriggerConditions: rows.reduce(
      (sum, row) => sum + row.triggerConditions.length,
      0
    ),
    sourceCaseCounts,
    deferredActions: deferredAnomalySourceActions,
  }
}

export function getAnomalySourceById(id: string) {
  return fallbackAnomalySources.find((row) => row.id === id)
}

function source(
  row: Omit<AnomalySourceDefinition, "deferredActions">
): AnomalySourceDefinition {
  return {
    ...row,
    deferredActions: deferredAnomalySourceActions,
  }
}
