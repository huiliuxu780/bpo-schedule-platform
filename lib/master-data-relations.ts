export type MasterDataNodeId =
  | "agent"
  | "supplier"
  | "workplace"
  | "project"
  | "agent_binding"
  | "shift_type"

export type MasterDataRelationNode = {
  id: MasterDataNodeId
  title: string
  owner: string
  status: "ready" | "needs_quality_check"
  supports: string[]
}

export type MasterDataRelationEdge = {
  from: MasterDataNodeId
  to: MasterDataNodeId
  label: string
  blocking: boolean
}

export type EmployeeMasterDataBindingStatus =
  | "active"
  | "needs_review"
  | "expiring_soon"
  | "inactive"

export type MasterDataReferenceStatus = "ready" | "needs_review" | "blocked"

export type EmployeeMasterDataBinding = {
  employeeId: string
  employeeName: string
  supplier: string
  workplace: string
  project: string
  skills: string[]
  effectiveFrom: string
  effectiveTo: string
  status: EmployeeMasterDataBindingStatus
  anomalyIds: string[]
  qualityIssueIds: string[]
  businessImpact: string
  sourceBatchId?: string
  sourceVersionId?: string
  referenceStatus?: MasterDataReferenceStatus
}

export type ImportedMasterDataRecord = {
  employee_id: string
  employee_name: string
  supplier_id: string
  supplier_name: string
  workplace_id: string
  workplace_name: string
  project_id: string
  project_name: string
  skill_group: string
  skill_level: string
  effective_from: string
  effective_to: string
  status: string
  source_batch_id: string
  source_version_id: string
  reference_status: MasterDataReferenceStatus
}

export type MasterDataRelations = {
  nodes: MasterDataRelationNode[]
  edges: MasterDataRelationEdge[]
  deferredActions: string[]
}

export type MasterDataRelationSummary = {
  nodeCount: number
  edgeCount: number
  blockingEdgeCount: number
  supportedFlows: string[]
  deferredActions: string[]
}

export type EmployeeMasterDataBindingSummary = {
  total: number
  active: number
  needsReview: number
  expiringSoon: number
  inactive: number
}

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

export const fallbackMasterDataRelations: MasterDataRelations = {
  nodes: [
    node("agent", "坐席", "数据管理员", "needs_quality_check", ["人员级排班", "登录对比", "异常归因"]),
    node("supplier", "供应商", "数据管理员", "ready", ["供应商维度分析", "结算前置口径"]),
    node("workplace", "职场", "数据管理员", "ready", ["需求预测", "排班汇总", "履约对比"]),
    node("project", "项目", "数据管理员", "ready", ["需求预测", "人员排班", "履约对比"]),
    node("agent_binding", "人员绑定关系", "数据管理员", "needs_quality_check", ["人员级排班", "履约对比", "异常归因"]),
    node("shift_type", "班次类型", "排班运营", "ready", ["人员级排班", "0.5h 展开"]),
  ],
  edges: [
    edge("agent_binding", "agent", "绑定员工", true),
    edge("agent_binding", "supplier", "绑定供应商", true),
    edge("agent_binding", "workplace", "绑定职场", true),
    edge("agent_binding", "project", "绑定项目", true),
    edge("agent", "supplier", "当前供应商", false),
    edge("agent", "workplace", "当前职场", false),
    edge("agent", "project", "当前项目", false),
    edge("shift_type", "project", "项目可用班次", false),
  ],
  deferredActions: [
    "无主数据 CRUD",
    "无冻结/解冻",
    "无审批流",
    "无导出或批量处理",
    "无数据库写入",
  ],
}

export const fallbackEmployeeMasterDataBindings: EmployeeMasterDataBinding[] = [
  employeeBinding({
    employeeId: "A-1001",
    employeeName: "张三",
    supplier: "供应商 A",
    workplace: "上海职场",
    project: "博西客服",
    skills: ["热线", "L2"],
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    status: "active",
    anomalyIds: [],
    qualityIssueIds: [],
    businessImpact: "可用于排班、登录和状态三轨履约对齐。",
  }),
  employeeBinding({
    employeeId: "A-1002",
    employeeName: "李四",
    supplier: "供应商 A",
    workplace: "上海职场",
    project: "博西客服",
    skills: ["热线", "L1"],
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    status: "active",
    anomalyIds: ["AR-202605-004"],
    qualityIssueIds: [],
    businessImpact: "有履约异常但主数据关系有效，优先回到排班、登录或状态证据。",
  }),
  employeeBinding({
    employeeId: "A-1003",
    employeeName: "王五",
    supplier: "供应商 B",
    workplace: "上海职场",
    project: "博西客服",
    skills: ["工单", "L1"],
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    status: "active",
    anomalyIds: [],
    qualityIssueIds: [],
    businessImpact: "可用于小组成员矩阵和需求供给对齐。",
  }),
  employeeBinding({
    employeeId: "A-9931",
    employeeName: "待补员工",
    supplier: "未绑定供应商",
    workplace: "上海职场",
    project: "博西客服",
    skills: ["待确认"],
    effectiveFrom: "2026-05-01",
    effectiveTo: "2026-05-31",
    status: "needs_review",
    anomalyIds: ["AR-202605-007"],
    qualityIssueIds: ["DQ-202605-004"],
    businessImpact: "绑定缺失会导致人员排班无法稳定归属到供应商、职场和项目。",
  }),
  employeeBinding({
    employeeId: "A-7788",
    employeeName: "临时账号",
    supplier: "供应商 B",
    workplace: "苏州职场",
    project: "博西客服",
    skills: ["热线", "待复核"],
    effectiveFrom: "2026-05-01",
    effectiveTo: "2026-05-20",
    status: "expiring_soon",
    anomalyIds: [],
    qualityIssueIds: ["DQ-202605-009"],
    businessImpact: "有效期临近结束，登录日志若继续出现需要先确认是否续期。",
  }),
]

export function summarizeMasterDataRelations(
  relations: MasterDataRelations
): MasterDataRelationSummary {
  return {
    nodeCount: relations.nodes.length,
    edgeCount: relations.edges.length,
    blockingEdgeCount: relations.edges.filter((edge) => edge.blocking).length,
    supportedFlows: [
      "需求预测",
      "人员级排班",
      "履约对比",
      "异常归因",
    ].filter((flow) =>
      relations.nodes.some((node) => node.supports.includes(flow))
    ),
    deferredActions: relations.deferredActions,
  }
}

export function getMasterDataRelationNode(id: MasterDataNodeId) {
  return fallbackMasterDataRelations.nodes.find((node) => node.id === id)
}

export function summarizeEmployeeMasterDataBindings(
  rows = fallbackEmployeeMasterDataBindings
): EmployeeMasterDataBindingSummary {
  return {
    total: rows.length,
    active: rows.filter((row) => row.status === "active").length,
    needsReview: rows.filter((row) => row.status === "needs_review").length,
    expiringSoon: rows.filter((row) => row.status === "expiring_soon").length,
    inactive: rows.filter((row) => row.status === "inactive").length,
  }
}

export function mapImportedMasterDataRecord(
  record: ImportedMasterDataRecord
): EmployeeMasterDataBinding {
  return employeeBinding({
    employeeId: record.employee_id,
    employeeName: record.employee_name,
    supplier: record.supplier_name || record.supplier_id,
    workplace: record.workplace_name || record.workplace_id,
    project: record.project_name || record.project_id,
    skills: [record.skill_group, record.skill_level].filter(Boolean),
    effectiveFrom: record.effective_from,
    effectiveTo: record.effective_to || "未设置",
    status: employeeBindingStatusFromImported(record.status),
    anomalyIds: [],
    qualityIssueIds: [],
    businessImpact: "主数据已导入，可用于后续业务引用。",
    sourceBatchId: record.source_batch_id,
    sourceVersionId: record.source_version_id,
    referenceStatus: record.reference_status,
  })
}

export function mergeImportedMasterDataBindings(
  importedRows: EmployeeMasterDataBinding[],
  fallbackRows = fallbackEmployeeMasterDataBindings
) {
  const importedIds = new Set(importedRows.map((row) => row.employeeId))
  const remainingFallbackRows = fallbackRows.filter(
    (row) => !importedIds.has(row.employeeId)
  )

  return [...importedRows, ...remainingFallbackRows]
}

export async function getEmployeeMasterDataBindings() {
  const response = await fetchJson<{ items: ImportedMasterDataRecord[] }>(
    "/api/v1/master-data/imported-records"
  )
  const importedRows =
    response?.items.map((record) => mapImportedMasterDataRecord(record)) ?? []

  if (importedRows.length === 0) {
    return fallbackEmployeeMasterDataBindings
  }

  return mergeImportedMasterDataBindings(importedRows)
}

export function getEmployeeMasterDataBinding(employeeId: string) {
  return fallbackEmployeeMasterDataBindings.find(
    (row) => row.employeeId === employeeId
  )
}

export function getMasterDataBindingTarget(employeeId: string) {
  return `/master-data-relations#employee-${employeeId}`
}

export function employeeMasterDataBindingStatusLabel(
  status: EmployeeMasterDataBindingStatus
) {
  return {
    active: "有效",
    needs_review: "待复核",
    expiring_soon: "即将到期",
    inactive: "已停用",
  }[status]
}

export function masterDataReferenceStatusLabel(status?: MasterDataReferenceStatus) {
  if (!status) {
    return "样例关系"
  }

  return {
    ready: "可引用",
    needs_review: "待复核",
    blocked: "阻断",
  }[status]
}

function employeeBindingStatusFromImported(status: string): EmployeeMasterDataBindingStatus {
  if (status === "inactive") {
    return "inactive"
  }

  if (status === "needs_review") {
    return "needs_review"
  }

  return "active"
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

function node(
  id: MasterDataNodeId,
  title: string,
  owner: string,
  status: MasterDataRelationNode["status"],
  supports: string[]
): MasterDataRelationNode {
  return { id, title, owner, status, supports }
}

function edge(
  from: MasterDataNodeId,
  to: MasterDataNodeId,
  label: string,
  blocking: boolean
): MasterDataRelationEdge {
  return { from, to, label, blocking }
}

function employeeBinding(
  row: EmployeeMasterDataBinding
): EmployeeMasterDataBinding {
  return row
}
