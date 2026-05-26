export type DataQualitySource =
  | "master_data"
  | "personnel_schedule"
  | "demand_forecast"
  | "login_log"
  | "status_log"

export type DataQualitySeverity = "high" | "medium" | "low"

export type DataQualityStatus = "open" | "acknowledged" | "resolved" | "ignored"

export type DataQualityAffectedObject = {
  type: string
  objectId: string
  label: string
  businessImpact: string
}

export type DataQualityImpactLink = {
  type: DataQualitySource | "schedule_plan" | "person_timeline"
  label: string
  target: string
  description: string
}

export type DataQualityIssue = {
  id: string
  title: string
  code: string
  errorCode: string
  source: DataQualitySource
  sourceTemplateId: string
  sourceTemplateName: string
  entity: string
  fieldName: string
  sourceField: string
  rawValue: string
  originalValue: string
  severity: DataQualitySeverity
  status: DataQualityStatus
  owner: string
  detectedAt: string
  blockedRows: number
  affectedObjects: DataQualityAffectedObject[]
  impactLinks: DataQualityImpactLink[]
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

export type DataQualityImportBatchLike = {
  id: string
  templateName: string
  sourceFile: string
  status: "completed" | "completed_with_errors" | "failed" | "pending_review"
  failedRows: number
  qualityIssueIds: string[]
  affectedObjects: string[]
  failureRows: {
    failedRowNumber: number
    fieldName: string
    errorCode: string
  }[]
  failureImpacts: {
    relatedIssueIds: string[]
    affectedRows: number
    affectedObjects: string[]
  }[]
}

export type DataQualityImportBatchImpactItem = {
  batchId: string
  templateName: string
  sourceFile: string
  status: "completed" | "completed_with_errors" | "failed" | "pending_review"
  failedRows: number
  matchedFields: string[]
  affectedObjects: string[]
  href: string
  reviewHint: string
}

export type DataQualityImportBatchImpactSummary = {
  totalBatchCount: number
  totalFailedRows: number
  matchedFields: string[]
  affectedObjects: string[]
  items: DataQualityImportBatchImpactItem[]
  deferredActions: string[]
}

export type DataQualityExceptionTopItem = {
  issueId: string
  title: string
  severity: DataQualitySeverity
  status: DataQualityStatus
  owner: string
  impactedExceptionCount: number
  impactedPeople: string[]
  blockedRows: number
  affectedObjects: string[]
  href: string
  nextViewHint: string
}

export type DataQualityExceptionTopSummary = {
  totalIssueCount: number
  totalImpactedExceptionCount: number
  totalImpactedPeopleCount: number
  topIssue?: DataQualityExceptionTopItem
  items: DataQualityExceptionTopItem[]
  deferredActions: string[]
}

export type DataQualityExceptionImpactItem = {
  type: string
  objectId: string
  label: string
  businessImpact: string
}

export type DataQualityExceptionImpactSummary = {
  impactedExceptionCount: number
  impactedPeopleCount: number
  impactedPeople: string[]
  affectedObjects: string[]
  primaryException?: DataQualityExceptionImpactItem
  items: DataQualityExceptionImpactItem[]
  nextViewHint: string
  nextViewHref?: string
  deferredActions: string[]
}

export type DataQualityExceptionCauseItem = {
  key: string
  errorCode: string
  source: DataQualitySource
  sourceField: string
  issueCount: number
  impactedExceptionCount: number
  impactedPeople: string[]
  blockedRows: number
  representativeIssueId: string
  representativeIssueTitle: string
  href: string
  nextViewHint: string
  severity: DataQualitySeverity
}

export type DataQualityExceptionCauseSummary = {
  totalCauseCount: number
  totalImpactedExceptionCount: number
  totalImpactedPeopleCount: number
  topCause?: DataQualityExceptionCauseItem
  items: DataQualityExceptionCauseItem[]
  deferredActions: string[]
}

export type DataQualityPersonViewOrderItem = {
  employeeId: string
  causeCount: number
  impactedExceptionCount: number
  blockedRows: number
  representativeCause: string
  representativeIssueId: string
  representativeIssueTitle: string
  href: string
  nextViewHint: string
}

export type DataQualityPersonViewOrderSummary = {
  totalPersonCount: number
  totalImpactedExceptionCount: number
  topPerson?: DataQualityPersonViewOrderItem
  items: DataQualityPersonViewOrderItem[]
  deferredActions: string[]
}

export type DataQualityDayViewOrderItem = {
  businessDate: string
  impactedPeopleCount: number
  impactedPeople: string[]
  impactedExceptionCount: number
  blockedRows: number
  representativeCause: string
  representativeIssueId: string
  representativeIssueTitle: string
  href: string
  nextViewHint: string
}

export type DataQualityDayViewOrderSummary = {
  totalDateCount: number
  totalImpactedExceptionCount: number
  totalImpactedPeopleCount: number
  topDate?: DataQualityDayViewOrderItem
  items: DataQualityDayViewOrderItem[]
  deferredActions: string[]
}

export type DataQualityFieldImpactSummaryItem = {
  key: string
  source: DataQualitySource
  sourceField: string
  affectedDateCount: number
  affectedDates: string[]
  affectedPeopleCount: number
  affectedPeople: string[]
  impactedExceptionCount: number
  blockedRows: number
  representativeCause: string
  representativeIssueId: string
  representativeIssueTitle: string
  href: string
  nextViewHint: string
}

export type DataQualityFieldImpactSummary = {
  totalFieldCount: number
  totalImpactedExceptionCount: number
  totalAffectedDateCount: number
  totalAffectedPeopleCount: number
  topField?: DataQualityFieldImpactSummaryItem
  items: DataQualityFieldImpactSummaryItem[]
  deferredActions: string[]
}

export type DataQualityReviewPriorityRationale = {
  headline: string
  priorityIssueId?: string
  priorityIssueTitle?: string
  priorityCause?: string
  priorityField?: string
  priorityDate?: string
  priorityPerson?: string
  impactedExceptionCount: number
  impactedPeopleCount: number
  href?: string
  nextViewHint: string
  reasons: string[]
  deferredActions: string[]
}

export type DataQualityReviewPathStepType =
  | "issue"
  | "field"
  | "date"
  | "person"
  | "cause"

export type DataQualityReviewPathStep = {
  type: DataQualityReviewPathStepType
  label: string
  title: string
  href?: string
  reason: string
  impactedExceptionCount: number
  impactedPeopleCount: number
}

export type DataQualityReviewPathSequence = {
  headline: string
  stepCount: number
  firstStep?: DataQualityReviewPathStep
  steps: DataQualityReviewPathStep[]
  nextViewHint: string
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

const sourceTemplateBySource: Record<
  DataQualitySource,
  { id: string; name: string }
> = {
  master_data: { id: "TPL-MASTER-DATA", name: "主数据模板" },
  personnel_schedule: {
    id: "TPL-PERSONNEL-SCHEDULE",
    name: "人员级排班模板",
  },
  demand_forecast: { id: "TPL-DEMAND-FORECAST", name: "需求预测模板" },
  login_log: { id: "TPL-LOGIN-LOG", name: "登录日志模板" },
  status_log: { id: "TPL-STATUS-LOG", name: "状态日志模板" },
}

export const fallbackDataQualityIssues: DataQualityIssue[] = [
  issue("DQ-202605-001", "坐席姓名缺失", "missing_required_field", "master_data", "agent", "employee_name", "", "high", "open", "数据管理员", 48, "补齐坐席姓名后重新校验导入批次。"),
  issue("DQ-202605-002", "职场时区非法", "invalid_timezone", "master_data", "workplace", "timezone", "GMT+25", "medium", "acknowledged", "数据管理员", 12, "改为 IANA 时区编码，例如 Asia/Shanghai。"),
  issue("DQ-202605-003", "供应商主键重复", "duplicate_primary_key", "master_data", "supplier", "supplier_id", "SUP-08", "medium", "open", "数据管理员", 37, "合并或更正重复供应商编码后再导入。"),
  issue("DQ-202605-004", "人员绑定缺失", "unknown_foreign_key", "master_data", "agent_binding", "employee_id", "A-9931", "medium", "open", "数据管理员", 19, "补齐员工主数据或修正绑定关系中的员工编码。", {
    affectedObjects: [
      {
        type: "人员排班",
        objectId: "A-9931",
        label: "A-9931 排班人员",
        businessImpact: "员工绑定缺失会导致人员级排班无法展开到职场、项目和供应商维度。",
      },
      {
        type: "0.5h 时段汇总",
        objectId: "2026-05-11",
        label: "2026-05-11 履约汇总",
        businessImpact: "无法确认归属时，排班人数和登录人数对比会出现不可解释差异。",
      },
    ],
    impactLinks: [
      {
        type: "schedule_plan",
        label: "查看主数据关系",
        target: "/master-data-relations#employee-A-9931",
        description: "反查该员工的供应商、职场、项目和技能绑定。",
      },
      {
        type: "person_timeline",
        label: "查看履约日历",
        target: "/person-timeline",
        description: "确认绑定缺失是否影响团队履约对齐。",
      },
    ],
  }),
  issue("DQ-202605-005", "排班开始晚于结束", "invalid_time_range", "personnel_schedule", "personnel_schedule", "start_at", "18:00 > 09:00", "high", "open", "排班运营", 28, "检查跨天班次是否补充 business_date 和 end_at。"),
  issue("DQ-202605-006", "班次类型不存在", "unknown_shift_type_id", "personnel_schedule", "personnel_schedule", "shift_type_id", "SHIFT-X", "medium", "acknowledged", "排班运营", 16, "先在班次类型主数据中维护该编码。"),
  issue("DQ-202605-007", "饭点超出班次", "break_or_meal_outside_shift", "personnel_schedule", "personnel_schedule", "meal_windows", "20:00-20:30", "low", "resolved", "排班运营", 11, "调整饭点窗口到班次开始和结束范围内。"),
  issue("DQ-202605-008", "预测时段断档", "missing_interval", "demand_forecast", "demand_forecast", "interval_start", "12:30", "medium", "open", "排班运营", 21, "补齐连续 0.5h 预测时段后再做排班对比。"),
  issue("DQ-202605-009", "登录员工不在主数据", "missing_master_data", "login_log", "login_log", "employee_id", "A-7788", "low", "ignored", "现场主管", 9, "确认是否为临时账号；若需要计入履约，先补主数据。"),
  issue("DQ-202605-010", "状态时间段重叠", "status_overlap", "status_log", "status_log", "status_start_at", "11:00-11:30", "high", "open", "运营负责人", 20, "拆分或修正重叠状态，避免非有效产能重复计算。", {
    sourceField: "status_log.status_start_at/status_end_at",
    affectedObjects: [
      {
        type: "状态日志",
        objectId: "A-1002",
        label: "A-1002 2026-05-11 状态轨道",
        businessImpact: "状态重叠会导致个人状态轨道无法判断真实在线、忙碌或离线时长。",
      },
      {
        type: "履约异常",
        objectId: "late_login",
        label: "小组成员矩阵异常",
        businessImpact: "团队矩阵中的异常人数可能被重复计入，需要先拆分状态区间。",
      },
    ],
    impactLinks: [
      {
        type: "status_log",
        label: "查看状态轨道",
        target: "/person-timeline/A-1002?date=2026-05-11",
        description: "进入个人履约详情，核对状态轨道与排班、登录轨道是否对齐。",
      },
      {
        type: "person_timeline",
        label: "查看个人履约",
        target: "/person-timeline/A-1002?date=2026-05-11",
        description: "定位状态重叠影响的具体时段。",
      },
    ],
  }),
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

export function summarizeDataQualityImportBatchImpact(
  issue: DataQualityIssue,
  batches: DataQualityImportBatchLike[]
): DataQualityImportBatchImpactSummary {
  const items = batches
    .map((batch) => buildDataQualityImportBatchImpactItem(issue, batch))
    .filter((item) => item !== null)

  return {
    totalBatchCount: items.length,
    totalFailedRows: items.reduce((total, item) => total + item.failedRows, 0),
    matchedFields: uniqueValues(items.flatMap((item) => item.matchedFields)),
    affectedObjects: uniqueValues(items.flatMap((item) => item.affectedObjects)),
    items,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityExceptionTop(
  rows: DataQualityIssue[]
): DataQualityExceptionTopSummary {
  const items = rows
    .map(buildDataQualityExceptionTopItem)
    .filter((item) => item !== null)
    .sort(
      (a, b) =>
        b.impactedExceptionCount - a.impactedExceptionCount ||
        b.impactedPeople.length - a.impactedPeople.length ||
        b.blockedRows - a.blockedRows ||
        dataQualitySeverityRank[b.severity] - dataQualitySeverityRank[a.severity] ||
        a.issueId.localeCompare(b.issueId)
    )

  return {
    totalIssueCount: items.length,
    totalImpactedExceptionCount: items.reduce(
      (total, item) => total + item.impactedExceptionCount,
      0
    ),
    totalImpactedPeopleCount: uniqueValues(
      items.flatMap((item) => item.impactedPeople)
    ).length,
    topIssue: items[0],
    items,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityExceptionImpact(
  issue: DataQualityIssue
): DataQualityExceptionImpactSummary {
  const exceptionItems = buildDataQualityExceptionImpactItems(issue)
  const personTimelineLinks = issue.impactLinks.filter(
    (link) => link.type === "person_timeline"
  )
  const impactedExceptionCount =
    exceptionItems.length > 0 || personTimelineLinks.length > 0
      ? Math.max(1, exceptionItems.length)
      : 0
  const impactedPeople =
    impactedExceptionCount > 0 ? getImpactedPeople(issue) : []
  const affectedObjects = uniqueValues(
    issue.affectedObjects.map((object) => object.label)
  )
  const nextLink = personTimelineLinks[0] ?? issue.impactLinks[0]

  return {
    impactedExceptionCount,
    impactedPeopleCount: impactedPeople.length,
    impactedPeople,
    affectedObjects,
    primaryException: exceptionItems[0],
    items: exceptionItems,
    nextViewHint: nextLink
      ? `先${nextLink.label}，再回到数据质量详情确认字段、原值和影响对象。`
      : "先查看数据质量详情，确认字段、原值和影响对象。",
    nextViewHref: nextLink?.target,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityExceptionCauses(
  rows: DataQualityIssue[]
): DataQualityExceptionCauseSummary {
  const groups = new Map<
    string,
    {
      errorCode: string
      source: DataQualitySource
      sourceField: string
      issues: DataQualityIssue[]
      impactSummaries: DataQualityExceptionImpactSummary[]
    }
  >()

  for (const issue of rows) {
    const impactSummary = summarizeDataQualityExceptionImpact(issue)

    if (impactSummary.impactedExceptionCount === 0) {
      continue
    }

    const key = `${issue.errorCode}|${issue.sourceField}|${issue.source}`
    const existing = groups.get(key)

    if (existing) {
      existing.issues.push(issue)
      existing.impactSummaries.push(impactSummary)
      continue
    }

    groups.set(key, {
      errorCode: issue.errorCode,
      source: issue.source,
      sourceField: issue.sourceField,
      issues: [issue],
      impactSummaries: [impactSummary],
    })
  }

  const items = Array.from(groups.entries())
    .map(([key, group]) => buildDataQualityExceptionCauseItem(key, group))
    .sort(
      (a, b) =>
        b.impactedExceptionCount - a.impactedExceptionCount ||
        b.impactedPeople.length - a.impactedPeople.length ||
        b.blockedRows - a.blockedRows ||
        b.issueCount - a.issueCount ||
        dataQualitySeverityRank[b.severity] - dataQualitySeverityRank[a.severity] ||
        a.errorCode.localeCompare(b.errorCode)
    )

  return {
    totalCauseCount: items.length,
    totalImpactedExceptionCount: items.reduce(
      (total, item) => total + item.impactedExceptionCount,
      0
    ),
    totalImpactedPeopleCount: uniqueValues(
      items.flatMap((item) => item.impactedPeople)
    ).length,
    topCause: items[0],
    items,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityPersonViewOrder(
  rows: DataQualityIssue[]
): DataQualityPersonViewOrderSummary {
  const groups = new Map<
    string,
    {
      employeeId: string
      issues: DataQualityIssue[]
      impactSummaries: DataQualityExceptionImpactSummary[]
    }
  >()

  for (const issue of rows) {
    const impactSummary = summarizeDataQualityExceptionImpact(issue)

    if (impactSummary.impactedExceptionCount === 0) {
      continue
    }

    for (const employeeId of impactSummary.impactedPeople) {
      const existing = groups.get(employeeId)

      if (existing) {
        existing.issues.push(issue)
        existing.impactSummaries.push(impactSummary)
        continue
      }

      groups.set(employeeId, {
        employeeId,
        issues: [issue],
        impactSummaries: [impactSummary],
      })
    }
  }

  const items = Array.from(groups.values())
    .map(buildDataQualityPersonViewOrderItem)
    .sort(
      (a, b) =>
        b.impactedExceptionCount - a.impactedExceptionCount ||
        b.causeCount - a.causeCount ||
        b.blockedRows - a.blockedRows ||
        a.employeeId.localeCompare(b.employeeId)
    )

  return {
    totalPersonCount: items.length,
    totalImpactedExceptionCount: items.reduce(
      (total, item) => total + item.impactedExceptionCount,
      0
    ),
    topPerson: items[0],
    items,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityDayViewOrder(
  rows: DataQualityIssue[]
): DataQualityDayViewOrderSummary {
  const groups = new Map<
    string,
    {
      businessDate: string
      issues: DataQualityIssue[]
      impactSummaries: DataQualityExceptionImpactSummary[]
    }
  >()

  for (const issue of rows) {
    const impactSummary = summarizeDataQualityExceptionImpact(issue)

    if (impactSummary.impactedExceptionCount === 0) {
      continue
    }

    for (const businessDate of getImpactedBusinessDates(issue, impactSummary)) {
      const existing = groups.get(businessDate)

      if (existing) {
        existing.issues.push(issue)
        existing.impactSummaries.push(impactSummary)
        continue
      }

      groups.set(businessDate, {
        businessDate,
        issues: [issue],
        impactSummaries: [impactSummary],
      })
    }
  }

  const items = Array.from(groups.values())
    .map(buildDataQualityDayViewOrderItem)
    .sort(
      (a, b) =>
        b.impactedExceptionCount - a.impactedExceptionCount ||
        b.impactedPeopleCount - a.impactedPeopleCount ||
        b.blockedRows - a.blockedRows ||
        a.businessDate.localeCompare(b.businessDate)
    )

  return {
    totalDateCount: items.length,
    totalImpactedExceptionCount: items.reduce(
      (total, item) => total + item.impactedExceptionCount,
      0
    ),
    totalImpactedPeopleCount: uniqueValues(
      items.flatMap((item) => item.impactedPeople)
    ).length,
    topDate: items[0],
    items,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityFieldImpactSummary(
  rows: DataQualityIssue[]
): DataQualityFieldImpactSummary {
  const groups = new Map<
    string,
    {
      source: DataQualitySource
      sourceField: string
      issues: DataQualityIssue[]
      impactSummaries: DataQualityExceptionImpactSummary[]
    }
  >()

  for (const issue of rows) {
    const impactSummary = summarizeDataQualityExceptionImpact(issue)

    if (impactSummary.impactedExceptionCount === 0) {
      continue
    }

    const key = `${issue.sourceField}|${issue.source}`
    const existing = groups.get(key)

    if (existing) {
      existing.issues.push(issue)
      existing.impactSummaries.push(impactSummary)
      continue
    }

    groups.set(key, {
      source: issue.source,
      sourceField: issue.sourceField,
      issues: [issue],
      impactSummaries: [impactSummary],
    })
  }

  const items = Array.from(groups.entries())
    .map(([key, group]) => buildDataQualityFieldImpactSummaryItem(key, group))
    .sort(
      (a, b) =>
        b.impactedExceptionCount - a.impactedExceptionCount ||
        b.affectedDateCount - a.affectedDateCount ||
        b.affectedPeopleCount - a.affectedPeopleCount ||
        b.blockedRows - a.blockedRows ||
        a.key.localeCompare(b.key)
    )

  return {
    totalFieldCount: items.length,
    totalImpactedExceptionCount: items.reduce(
      (total, item) => total + item.impactedExceptionCount,
      0
    ),
    totalAffectedDateCount: uniqueValues(
      items.flatMap((item) => item.affectedDates)
    ).length,
    totalAffectedPeopleCount: uniqueValues(
      items.flatMap((item) => item.affectedPeople)
    ).length,
    topField: items[0],
    items,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityReviewPriorityRationale(
  rows: DataQualityIssue[]
): DataQualityReviewPriorityRationale {
  const exceptionTop = summarizeDataQualityExceptionTop(rows)
  const causeSummary = summarizeDataQualityExceptionCauses(rows)
  const personSummary = summarizeDataQualityPersonViewOrder(rows)
  const daySummary = summarizeDataQualityDayViewOrder(rows)
  const fieldSummary = summarizeDataQualityFieldImpactSummary(rows)
  const topIssue = exceptionTop.topIssue

  if (!topIssue) {
    return {
      headline: "暂无需要优先复核的数据质量问题",
      impactedExceptionCount: 0,
      impactedPeopleCount: 0,
      nextViewHint: "当前没有匹配到履约异常影响，先继续查看数据质量清单。",
      reasons: [],
      deferredActions: deferredDataQualityActions,
    }
  }

  const reasons = [
    `字段 ${fieldSummary.topField?.sourceField ?? "未识别字段"} 影响 ${fieldSummary.topField?.affectedDateCount ?? 0} 个日期、${fieldSummary.topField?.affectedPeopleCount ?? 0} 名人员和 ${fieldSummary.topField?.impactedExceptionCount ?? 0} 项异常。`,
    `日期 ${daySummary.topDate?.businessDate ?? "未识别日期"} 汇总 ${daySummary.topDate?.impactedExceptionCount ?? 0} 项异常和 ${daySummary.topDate?.impactedPeopleCount ?? 0} 名人员。`,
    `人员 ${personSummary.topPerson?.employeeId ?? "未识别人员"} 关联 ${personSummary.topPerson?.causeCount ?? 0} 类原因和 ${personSummary.topPerson?.impactedExceptionCount ?? 0} 项异常。`,
    `原因 ${causeSummary.topCause?.errorCode ?? topIssue.title} 是当前代表原因，先查看代表问题再回到质量详情核对原值。`,
  ]

  return {
    headline: `先复核 ${topIssue.issueId} / ${topIssue.title}`,
    priorityIssueId: topIssue.issueId,
    priorityIssueTitle: topIssue.title,
    priorityCause: causeSummary.topCause?.errorCode ?? topIssue.title,
    priorityField: fieldSummary.topField?.sourceField,
    priorityDate: daySummary.topDate?.businessDate,
    priorityPerson: personSummary.topPerson?.employeeId,
    impactedExceptionCount: topIssue.impactedExceptionCount,
    impactedPeopleCount: topIssue.impactedPeople.length,
    href: topIssue.href,
    nextViewHint: `先查看问题 ${topIssue.issueId}，再按字段、日期和人员顺序复核影响范围。`,
    reasons,
    deferredActions: deferredDataQualityActions,
  }
}

export function summarizeDataQualityReviewPathSequence(
  rows: DataQualityIssue[]
): DataQualityReviewPathSequence {
  const priorityRationale = summarizeDataQualityReviewPriorityRationale(rows)
  const exceptionTop = summarizeDataQualityExceptionTop(rows)
  const fieldSummary = summarizeDataQualityFieldImpactSummary(rows)
  const daySummary = summarizeDataQualityDayViewOrder(rows)
  const personSummary = summarizeDataQualityPersonViewOrder(rows)
  const causeSummary = summarizeDataQualityExceptionCauses(rows)
  const topIssue = exceptionTop.topIssue

  if (!topIssue) {
    return {
      headline: "暂无可排序的数据质量复核路径",
      stepCount: 0,
      steps: [],
      nextViewHint: "当前没有匹配到履约异常影响，先继续查看数据质量清单。",
      deferredActions: deferredDataQualityActions,
    }
  }

  const steps: DataQualityReviewPathStep[] = [
    {
      type: "issue",
      label: "优先问题",
      title: `${topIssue.issueId} / ${topIssue.title}`,
      href: topIssue.href,
      reason: priorityRationale.headline,
      impactedExceptionCount: topIssue.impactedExceptionCount,
      impactedPeopleCount: topIssue.impactedPeople.length,
    },
  ]

  if (fieldSummary.topField) {
    steps.push({
      type: "field",
      label: "字段影响",
      title: fieldSummary.topField.sourceField,
      href: fieldSummary.topField.href,
      reason: `字段影响 ${fieldSummary.topField.affectedDateCount} 个日期和 ${fieldSummary.topField.affectedPeopleCount} 名人员。`,
      impactedExceptionCount: fieldSummary.topField.impactedExceptionCount,
      impactedPeopleCount: fieldSummary.topField.affectedPeopleCount,
    })
  }

  if (daySummary.topDate) {
    steps.push({
      type: "date",
      label: "履约日期",
      title: `${daySummary.topDate.businessDate} / ${daySummary.topDate.representativeCause}`,
      href: daySummary.topDate.href,
      reason: `该日期汇总 ${daySummary.topDate.impactedExceptionCount} 项异常和 ${daySummary.topDate.impactedPeopleCount} 名人员。`,
      impactedExceptionCount: daySummary.topDate.impactedExceptionCount,
      impactedPeopleCount: daySummary.topDate.impactedPeopleCount,
    })
  }

  if (personSummary.topPerson) {
    steps.push({
      type: "person",
      label: "受影响人员",
      title: `${personSummary.topPerson.employeeId} / ${personSummary.topPerson.representativeCause}`,
      href: personSummary.topPerson.href,
      reason: `该人员关联 ${personSummary.topPerson.causeCount} 类原因和 ${personSummary.topPerson.impactedExceptionCount} 项异常。`,
      impactedExceptionCount: personSummary.topPerson.impactedExceptionCount,
      impactedPeopleCount: 1,
    })
  }

  if (causeSummary.topCause) {
    steps.push({
      type: "cause",
      label: "代表原因",
      title: `${causeSummary.topCause.errorCode} / ${causeSummary.topCause.sourceField}`,
      href: causeSummary.topCause.href,
      reason: `该原因影响 ${causeSummary.topCause.impactedExceptionCount} 项异常和 ${causeSummary.topCause.impactedPeople.length} 名人员。`,
      impactedExceptionCount: causeSummary.topCause.impactedExceptionCount,
      impactedPeopleCount: causeSummary.topCause.impactedPeople.length,
    })
  }

  return {
    headline: `先看 ${topIssue.issueId}，再按字段、日期、人员和原因展开`,
    stepCount: steps.length,
    firstStep: steps[0],
    steps,
    nextViewHint: "按路径步骤逐项查看，最后回到数据质量清单确认是否还有未覆盖问题。",
    deferredActions: deferredDataQualityActions,
  }
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

const dataQualitySeverityRank: Record<DataQualitySeverity, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

function buildDataQualityExceptionTopItem(
  issue: DataQualityIssue
): DataQualityExceptionTopItem | null {
  const exceptionObjects = issue.affectedObjects.filter((object) =>
    object.type.includes("履约") || object.label.includes("异常")
  )
  const personTimelineLinks = issue.impactLinks.filter(
    (link) => link.type === "person_timeline"
  )
  const impactedExceptionCount =
    exceptionObjects.length > 0 || personTimelineLinks.length > 0
      ? Math.max(1, exceptionObjects.filter((object) => object.label.includes("异常")).length)
      : 0

  if (impactedExceptionCount === 0) {
    return null
  }

  const impactedPeople = getImpactedPeople(issue)
  const affectedObjects = uniqueValues(
    issue.affectedObjects.map((object) => object.label)
  )
  const nextLink = personTimelineLinks[0] ?? issue.impactLinks[0]

  return {
    issueId: issue.id,
    title: issue.title,
    severity: issue.severity,
    status: issue.status,
    owner: issue.owner,
    impactedExceptionCount,
    impactedPeople,
    blockedRows: issue.blockedRows,
    affectedObjects,
    href: `/data-quality/${issue.id}`,
    nextViewHint: nextLink
      ? `先${nextLink.label}，再回到数据质量详情确认字段和原值。`
      : "先查看数据质量详情，确认字段、原值和影响对象。",
  }
}

function buildDataQualityExceptionImpactItems(
  issue: DataQualityIssue
): DataQualityExceptionImpactItem[] {
  return issue.affectedObjects
    .filter(
      (object) =>
        object.type.includes("履约") ||
        object.label.includes("异常") ||
        object.label.includes("履约")
    )
    .map((object) => ({
      type: object.type,
      objectId: object.objectId,
      label: object.label,
      businessImpact: object.businessImpact,
    }))
}

function buildDataQualityExceptionCauseItem(
  key: string,
  group: {
    errorCode: string
    source: DataQualitySource
    sourceField: string
    issues: DataQualityIssue[]
    impactSummaries: DataQualityExceptionImpactSummary[]
  }
): DataQualityExceptionCauseItem {
  const representativeIssue = group.issues
    .slice()
    .sort(
      (a, b) =>
        dataQualitySeverityRank[b.severity] - dataQualitySeverityRank[a.severity] ||
        b.blockedRows - a.blockedRows ||
        a.id.localeCompare(b.id)
    )[0]
  const firstNextViewHint =
    group.impactSummaries.find((summary) => summary.nextViewHref)?.nextViewHint ??
    group.impactSummaries[0]?.nextViewHint ??
    "先查看代表问题详情，确认字段、原值和影响对象。"

  return {
    key,
    errorCode: group.errorCode,
    source: group.source,
    sourceField: group.sourceField,
    issueCount: group.issues.length,
    impactedExceptionCount: group.impactSummaries.reduce(
      (total, summary) => total + summary.impactedExceptionCount,
      0
    ),
    impactedPeople: uniqueValues(
      group.impactSummaries.flatMap((summary) => summary.impactedPeople)
    ),
    blockedRows: group.issues.reduce((total, issue) => total + issue.blockedRows, 0),
    representativeIssueId: representativeIssue.id,
    representativeIssueTitle: representativeIssue.title,
    href: `/data-quality/${representativeIssue.id}`,
    nextViewHint: firstNextViewHint,
    severity: representativeIssue.severity,
  }
}

function buildDataQualityPersonViewOrderItem(group: {
  employeeId: string
  issues: DataQualityIssue[]
  impactSummaries: DataQualityExceptionImpactSummary[]
}): DataQualityPersonViewOrderItem {
  const representativeIssue = group.issues
    .slice()
    .sort(
      (a, b) =>
        dataQualitySeverityRank[b.severity] - dataQualitySeverityRank[a.severity] ||
        b.blockedRows - a.blockedRows ||
        a.id.localeCompare(b.id)
    )[0]
  const causeKeys = uniqueValues(
    group.issues.map(
      (issue) => `${issue.errorCode}|${issue.sourceField}|${issue.source}`
    )
  )
  const personImpact =
    group.impactSummaries.find((summary) =>
      summary.nextViewHref?.includes(group.employeeId)
    ) ?? group.impactSummaries[0]
  const href = personImpact?.nextViewHref?.includes(group.employeeId)
    ? personImpact.nextViewHref
    : `/person-timeline/${group.employeeId}`

  return {
    employeeId: group.employeeId,
    causeCount: causeKeys.length,
    impactedExceptionCount: group.impactSummaries.reduce(
      (total, summary) => total + summary.impactedExceptionCount,
      0
    ),
    blockedRows: group.issues.reduce((total, issue) => total + issue.blockedRows, 0),
    representativeCause: representativeIssue.errorCode,
    representativeIssueId: representativeIssue.id,
    representativeIssueTitle: representativeIssue.title,
    href,
    nextViewHint:
      personImpact?.nextViewHint ??
      "先查看个人履约详情，再回到数据质量详情确认字段、原值和影响对象。",
  }
}

function buildDataQualityDayViewOrderItem(group: {
  businessDate: string
  issues: DataQualityIssue[]
  impactSummaries: DataQualityExceptionImpactSummary[]
}): DataQualityDayViewOrderItem {
  const representativeIssue = group.issues
    .slice()
    .sort(
      (a, b) =>
        dataQualitySeverityRank[b.severity] - dataQualitySeverityRank[a.severity] ||
        b.blockedRows - a.blockedRows ||
        a.id.localeCompare(b.id)
    )[0]
  const dateImpact =
    group.impactSummaries.find((summary) =>
      summary.nextViewHref?.includes(`date=${group.businessDate}`)
    ) ?? group.impactSummaries[0]
  const href = dateImpact?.nextViewHref?.includes(`date=${group.businessDate}`)
    ? dateImpact.nextViewHref
    : `/person-timeline?date=${group.businessDate}`
  const impactedPeople = uniqueValues(
    group.impactSummaries.flatMap((summary) => summary.impactedPeople)
  )

  return {
    businessDate: group.businessDate,
    impactedPeopleCount: impactedPeople.length,
    impactedPeople,
    impactedExceptionCount: group.impactSummaries.reduce(
      (total, summary) => total + summary.impactedExceptionCount,
      0
    ),
    blockedRows: group.issues.reduce((total, issue) => total + issue.blockedRows, 0),
    representativeCause: representativeIssue.errorCode,
    representativeIssueId: representativeIssue.id,
    representativeIssueTitle: representativeIssue.title,
    href,
    nextViewHint:
      dateImpact?.nextViewHint ??
      "先查看履约日期对应的个人履约详情，再回到数据质量详情确认字段、原值和影响对象。",
  }
}

function buildDataQualityFieldImpactSummaryItem(
  key: string,
  group: {
    source: DataQualitySource
    sourceField: string
    issues: DataQualityIssue[]
    impactSummaries: DataQualityExceptionImpactSummary[]
  }
): DataQualityFieldImpactSummaryItem {
  const representativeIssue = group.issues
    .slice()
    .sort(
      (a, b) =>
        dataQualitySeverityRank[b.severity] - dataQualitySeverityRank[a.severity] ||
        b.blockedRows - a.blockedRows ||
        a.id.localeCompare(b.id)
    )[0]
  const affectedDates = uniqueValues(
    group.issues.flatMap((issue, index) =>
      getImpactedBusinessDates(issue, group.impactSummaries[index])
    )
  )
  const affectedPeople = uniqueValues(
    group.impactSummaries.flatMap((summary) => summary.impactedPeople)
  )
  const firstNextViewHint =
    group.impactSummaries.find((summary) => summary.nextViewHref)?.nextViewHint ??
    group.impactSummaries[0]?.nextViewHint ??
    "先查看字段代表问题，再回到数据质量详情确认字段、原值和影响对象。"

  return {
    key,
    source: group.source,
    sourceField: group.sourceField,
    affectedDateCount: affectedDates.length,
    affectedDates,
    affectedPeopleCount: affectedPeople.length,
    affectedPeople,
    impactedExceptionCount: group.impactSummaries.reduce(
      (total, summary) => total + summary.impactedExceptionCount,
      0
    ),
    blockedRows: group.issues.reduce((total, issue) => total + issue.blockedRows, 0),
    representativeCause: representativeIssue.errorCode,
    representativeIssueId: representativeIssue.id,
    representativeIssueTitle: representativeIssue.title,
    href: `/data-quality/${representativeIssue.id}`,
    nextViewHint: firstNextViewHint,
  }
}

function getImpactedPeople(issue: DataQualityIssue) {
  return uniqueValues([
    ...issue.affectedObjects
      .map((object) => object.objectId)
      .filter((objectId) => /^A-\d+/.test(objectId)),
    ...issue.impactLinks
      .map((link) => link.target.match(/A-\d+/)?.[0] ?? "")
      .filter((employeeId) => employeeId.length > 0),
  ])
}

function getImpactedBusinessDates(
  issue: DataQualityIssue,
  impactSummary: DataQualityExceptionImpactSummary
) {
  return uniqueValues([
    ...issue.impactLinks.flatMap((link) => extractBusinessDates(link.target)),
    ...(impactSummary.nextViewHref
      ? extractBusinessDates(impactSummary.nextViewHref)
      : []),
    ...issue.affectedObjects.flatMap((object) =>
      extractBusinessDates(
        `${object.objectId} ${object.label} ${object.businessImpact}`
      )
    ),
  ])
}

function extractBusinessDates(value: string) {
  return Array.from(value.matchAll(/\d{4}-\d{2}-\d{2}/g)).map(
    (match) => match[0]
  )
}

function buildDataQualityImportBatchImpactItem(
  issue: DataQualityIssue,
  batch: DataQualityImportBatchLike
): DataQualityImportBatchImpactItem | null {
  const relatedImpacts = batch.failureImpacts.filter((impact) =>
    impact.relatedIssueIds.includes(issue.id)
  )
  const matchedRows = batch.failureRows.filter((row) => {
    return (
      row.fieldName === issue.fieldName ||
      issue.sourceField.split(/[./]/).includes(row.fieldName) ||
      row.errorCode === issue.errorCode
    )
  })
  const isLinkedIssue = batch.qualityIssueIds.includes(issue.id)

  if (!isLinkedIssue && relatedImpacts.length === 0 && matchedRows.length === 0) {
    return null
  }

  const matchedFields = uniqueValues([
    ...matchedRows.map((row) => row.fieldName),
    ...(isLinkedIssue || relatedImpacts.length > 0 ? [issue.fieldName] : []),
  ])
  const affectedObjects = uniqueValues([
    ...batch.affectedObjects,
    ...relatedImpacts.flatMap((impact) => impact.affectedObjects),
  ])
  const failedRows =
    matchedRows.length > 0
      ? matchedRows.length
      : relatedImpacts.reduce((total, impact) => total + impact.affectedRows, 0)

  return {
    batchId: batch.id,
    templateName: batch.templateName,
    sourceFile: batch.sourceFile,
    status: batch.status,
    failedRows,
    matchedFields,
    affectedObjects,
    href: `/import-batches/${batch.id}`,
    reviewHint:
      matchedRows.length > 0
        ? `先查看 ${matchedFields.join("、")} 字段失败行，再回到质量问题确认影响对象。`
        : `先查看 ${issue.fieldName} 字段关联批次，${issue.recommendation}`,
  }
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.length > 0)))
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
  recommendation: string,
  overrides: Partial<
    Pick<
      DataQualityIssue,
      | "sourceTemplateId"
      | "sourceTemplateName"
      | "sourceField"
      | "affectedObjects"
      | "impactLinks"
    >
  > = {}
): DataQualityIssue {
  const template = sourceTemplateBySource[source]
  const sourceField = overrides.sourceField ?? `${entity}.${fieldName}`
  const originalValue = rawValue || "空值"

  return {
    id,
    title,
    code,
    errorCode: code,
    source,
    sourceTemplateId: overrides.sourceTemplateId ?? template.id,
    sourceTemplateName: overrides.sourceTemplateName ?? template.name,
    entity,
    fieldName,
    sourceField,
    rawValue,
    originalValue,
    severity,
    status,
    owner,
    detectedAt: "2026-05-19 10:00",
    blockedRows,
    affectedObjects:
      overrides.affectedObjects ??
      [
        {
          type: dataQualitySourceLabels[source],
          objectId: rawValue || fieldName,
          label: `${dataQualitySourceLabels[source]} ${rawValue || fieldName}`,
          businessImpact: "该字段问题会影响导入后续校验和履约对齐结果。",
        },
      ],
    impactLinks:
      overrides.impactLinks ??
      [
        {
          type: source,
          label: "查看数据质量",
          target: `/data-quality/${id}`,
          description: "从质量问题详情继续查看字段、原值和处理建议。",
        },
      ],
    recommendation,
  }
}
