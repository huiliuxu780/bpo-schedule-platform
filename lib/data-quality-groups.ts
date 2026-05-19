export type DataQualityGroupRisk = "high" | "medium" | "low"

export type DataQualityGroup = {
  id: string
  title: string
  description: string
  risk: DataQualityGroupRisk
  owner: string
  sourceTemplates: string[]
  traceKeys: string[]
  issueIds: string[]
  recommendedReview: string
  deferredActions: string[]
}

export type DataQualityGroupSummary = {
  totalGroups: number
  totalIssues: number
  highRiskGroups: number
  sourceTemplateCount: number
  groupedIssueCount: number
  deferredActions: string[]
}

export type DataQualityIssueGroupCoverage = {
  issueId: string
  groups: DataQualityGroup[]
}

export const deferredDataQualityGroupActions = [
  "无真实数据修复",
  "无自动合并",
  "无批量重导",
  "无审批或权限",
  "无生产写库",
]

export const fallbackDataQualityGroups: DataQualityGroup[] = [
  {
    id: "identity-integrity",
    title: "身份与主键完整性",
    description: "聚合必填缺失、重复主键和人员绑定缺失，优先保障坐席、供应商和绑定关系可被排班引用。",
    risk: "high",
    owner: "数据管理员",
    sourceTemplates: ["TPL-MASTER-DATA"],
    traceKeys: ["employee_id", "supplier_id", "agent_binding.employee_id"],
    issueIds: ["DQ-202605-001", "DQ-202605-003", "DQ-202605-004"],
    recommendedReview: "先修正主数据，再复核受影响排班和导入批次。",
    deferredActions: deferredDataQualityGroupActions,
  },
  {
    id: "time-validity",
    title: "时间有效性",
    description: "聚合非法时区、排班时间倒挂和状态重叠，避免 0.5h 展开和人员时间轴产生错误时长。",
    risk: "high",
    owner: "运营负责人",
    sourceTemplates: ["TPL-MASTER-DATA", "TPL-PERSONNEL-SCHEDULE", "TPL-STATUS-LOG"],
    traceKeys: ["timezone", "start_at/end_at", "status_start_at/status_end_at"],
    issueIds: ["DQ-202605-002", "DQ-202605-005", "DQ-202605-010"],
    recommendedReview: "先确认时区和跨天班次，再拆分重叠状态时间段。",
    deferredActions: deferredDataQualityGroupActions,
  },
  {
    id: "schedule-readiness",
    title: "排班准备度",
    description: "聚合班次类型缺失、饭点越界和预测时段断档，确认排班明细可展开到 0.5h 汇总。",
    risk: "medium",
    owner: "排班运营",
    sourceTemplates: ["TPL-PERSONNEL-SCHEDULE", "TPL-DEMAND-FORECAST"],
    traceKeys: ["shift_type_id", "meal_windows", "interval_start"],
    issueIds: ["DQ-202605-006", "DQ-202605-007", "DQ-202605-008"],
    recommendedReview: "先补齐班次类型和预测时段，再检查饭点窗口是否落在班次内。",
    deferredActions: deferredDataQualityGroupActions,
  },
  {
    id: "actual-log-reference",
    title: "实际日志引用",
    description: "聚合登录或状态日志中无法关联主数据的记录，避免实际履约与人员排班无法对齐。",
    risk: "low",
    owner: "现场主管",
    sourceTemplates: ["TPL-LOGIN-LOG", "TPL-STATUS-LOG"],
    traceKeys: ["login_log.employee_id", "status_log.employee_id"],
    issueIds: ["DQ-202605-009"],
    recommendedReview: "确认是否为临时账号；若计入履约，需要先补人员主数据。",
    deferredActions: deferredDataQualityGroupActions,
  },
]

export function summarizeDataQualityGroups(
  groups: DataQualityGroup[]
): DataQualityGroupSummary {
  const templates = new Set<string>()

  for (const group of groups) {
    for (const template of group.sourceTemplates) {
      templates.add(template)
    }
  }

  return {
    totalGroups: groups.length,
    totalIssues: groups.reduce((total, group) => total + group.issueIds.length, 0),
    highRiskGroups: groups.filter((group) => group.risk === "high").length,
    sourceTemplateCount: templates.size,
    groupedIssueCount: getGroupedIssueIds(groups).length,
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function getDataQualityGroup(id: string) {
  return fallbackDataQualityGroups.find((group) => group.id === id)
}

export function getDataQualityGroupsForIssue(issueId: string) {
  return fallbackDataQualityGroups.filter((group) => group.issueIds.includes(issueId))
}

export function getDataQualityIssueGroupCoverage(
  issueIds: string[],
  groups = fallbackDataQualityGroups
): DataQualityIssueGroupCoverage[] {
  return issueIds.map((issueId) => ({
    issueId,
    groups: groups.filter((group) => group.issueIds.includes(issueId)),
  }))
}

export function getUngroupedDataQualityIssueIds(
  issueIds: string[],
  groups = fallbackDataQualityGroups
) {
  const groupedIssueIds = new Set(getGroupedIssueIds(groups))

  return issueIds.filter((issueId) => !groupedIssueIds.has(issueId))
}

export function dataQualityGroupRiskLabel(risk: DataQualityGroupRisk) {
  return {
    high: "高风险",
    medium: "中风险",
    low: "低风险",
  }[risk]
}

function getGroupedIssueIds(groups: DataQualityGroup[]) {
  return Array.from(new Set(groups.flatMap((group) => group.issueIds)))
}
