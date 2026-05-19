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
