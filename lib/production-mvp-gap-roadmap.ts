export type ProductionMvpGapPriority = "P0" | "P1" | "P2"
export type ProductionMvpGapRisk = "high" | "medium" | "low"
export type ProductionMvpGapStatus = "next" | "later" | "blocked_by_gate"

export type ProductionMvpGap = {
  id: string
  title: string
  lane: string
  priority: ProductionMvpGapPriority
  risk: ProductionMvpGapRisk
  status: ProductionMvpGapStatus
  businessPurpose: string
  acceptanceItemIds: string[]
  proposedBatchId: string
  evidenceRoutes: string[]
  deferredCapabilities: string[]
  boundary: string
}

export type ProductionMvpRoadmapBatch = {
  id: string
  title: string
  goal: string
  sequence: number
  gapIds: string[]
  dependsOnBatchIds: string[]
  recommendedReason: string
}

export type ProductionMvpGapSummary = {
  total: number
  priorityCounts: Record<ProductionMvpGapPriority, number>
  riskCounts: Record<ProductionMvpGapRisk, number>
  nextGapIds: string[]
  blockedGapIds: string[]
  highRiskGapIds: string[]
  acceptanceItemCount: number
}

export const productionMvpGaps: ProductionMvpGap[] = [
  {
    id: "upload-import-execution",
    title: "真实上传与导入执行闭环",
    lane: "上传/导入",
    priority: "P0",
    risk: "high",
    status: "next",
    businessPurpose:
      "把当前模板、字段映射和批次追溯从展示能力推进到可执行导入，支撑后续生产雏形数据闭环。",
    acceptanceItemIds: ["upload-import"],
    proposedBatchId: "batch-01-data-foundation",
    evidenceRoutes: ["/import-templates", "/field-mapping", "/import-batches"],
    deferredCapabilities: ["真实上传", "批量导入", "失败行写库"],
    boundary: "本路线图只定义后续批次优先级，不在当前批次实现真实上传或写库。",
  },
  {
    id: "master-data-maintenance",
    title: "主数据维护与冻结解冻",
    lane: "主数据",
    priority: "P0",
    risk: "medium",
    status: "next",
    businessPurpose:
      "让坐席、职场、供应商、项目和绑定关系可被维护，并为排班、预测、履约对比提供稳定口径。",
    acceptanceItemIds: ["master-data"],
    proposedBatchId: "batch-01-data-foundation",
    evidenceRoutes: ["/production-mvp/master-data", "/master-data-relations"],
    deferredCapabilities: ["主数据 CRUD", "冻结解冻", "主数据权限"],
    boundary: "当前只做缺口定义，不新增主数据编辑、冻结解冻或权限边界。",
  },
  {
    id: "field-mapping-persistence",
    title: "字段映射保存与版本追溯",
    lane: "上传/导入",
    priority: "P0",
    risk: "medium",
    status: "next",
    businessPurpose:
      "避免每次导入都重新解释字段映射，让模板、批次和质量问题能追溯到明确版本。",
    acceptanceItemIds: ["upload-import"],
    proposedBatchId: "batch-01-data-foundation",
    evidenceRoutes: ["/field-mapping", "/import-batches"],
    deferredCapabilities: ["字段映射保存", "映射版本管理", "批次映射锁定"],
    boundary: "当前不做持久化配置，也不引入数据库或真实批次锁定。",
  },
  {
    id: "actual-log-integration",
    title: "实际登录与状态日志接入",
    lane: "登录/状态",
    priority: "P1",
    risk: "high",
    status: "blocked_by_gate",
    businessPurpose:
      "把人员时间轴的登录和状态事件从本地样例推进到真实来源，为实际在线、非有效产能和异常识别提供依据。",
    acceptanceItemIds: ["actual-status", "comparison-anomaly"],
    proposedBatchId: "batch-02-actual-alignment",
    evidenceRoutes: ["/person-timeline", "/data-quality/groups/time-validity"],
    deferredCapabilities: ["真实登录系统接入", "状态码生产映射", "状态规则公式"],
    boundary: "真实外部接口、状态码生产映射和公式必须单独 Gate，当前批次不实现。",
  },
  {
    id: "forecast-versioning",
    title: "需求预测版本与调整记录",
    lane: "需求预测",
    priority: "P1",
    risk: "medium",
    status: "later",
    businessPurpose:
      "让 0.5h 预测需求、技能组和等级调整具备版本可追溯能力，避免排班缺口对比没有基准版本。",
    acceptanceItemIds: ["demand-forecast"],
    proposedBatchId: "batch-02-actual-alignment",
    evidenceRoutes: ["/production-mvp/demand-forecast", "/demand-plans"],
    deferredCapabilities: ["预测模型接入", "真实预测导入", "预测版本管理"],
    boundary: "当前不接预测模型，也不做真实预测导入或调整保存。",
  },
  {
    id: "schedule-publish-approval",
    title: "排班发布态与审批边界",
    lane: "排班",
    priority: "P1",
    risk: "high",
    status: "later",
    businessPurpose:
      "区分草稿排班、已发布排班和审批中的排班，避免人员明细与 0.5h 汇总被误认为正式生产发布。",
    acceptanceItemIds: ["personnel-schedule"],
    proposedBatchId: "batch-03-workflow-controls",
    evidenceRoutes: ["/production-mvp/personnel-schedules", "/shift-details"],
    deferredCapabilities: ["正式发布审批", "排班批量编辑", "自动排班"],
    boundary: "审批、批量编辑和自动排班都是后续能力，当前不触发实现。",
  },
  {
    id: "review-workflow-export",
    title: "异常复核提交与导出",
    lane: "差异对比与异常识别",
    priority: "P2",
    risk: "medium",
    status: "later",
    businessPurpose:
      "让异常从识别进入复核、关闭和导出，但只在基础数据和实际日志闭环后再推进。",
    acceptanceItemIds: ["comparison-anomaly"],
    proposedBatchId: "batch-03-workflow-controls",
    evidenceRoutes: ["/anomaly-review", "/anomaly-review/timeline"],
    deferredCapabilities: ["真实复核提交", "审批流", "导出", "批量处理"],
    boundary: "当前不做提交、审批、导出或批量操作。",
  },
  {
    id: "permission-audit-boundary",
    title: "权限与操作审计边界",
    lane: "系统治理",
    priority: "P2",
    risk: "low",
    status: "blocked_by_gate",
    businessPurpose:
      "在生产雏形进入多人协作前，明确数据导入、主数据维护、排班发布和异常复核的权限与审计边界。",
    acceptanceItemIds: ["master-data", "personnel-schedule", "comparison-anomaly"],
    proposedBatchId: "batch-03-workflow-controls",
    evidenceRoutes: ["/production-mvp/progress"],
    deferredCapabilities: ["权限管理", "操作审计", "生产账号体系"],
    boundary: "权限和审计属于硬停条件，必须在后续独立 Gate 里确认。",
  },
]

export const productionMvpRoadmapBatches: ProductionMvpRoadmapBatch[] = [
  {
    id: "batch-01-data-foundation",
    title: "数据导入与主数据闭环",
    goal: "先把上传/导入、字段映射和主数据维护补成生产雏形的数据底座。",
    sequence: 1,
    gapIds: [
      "upload-import-execution",
      "master-data-maintenance",
      "field-mapping-persistence",
    ],
    dependsOnBatchIds: [],
    recommendedReason:
      "没有可追溯的数据进入方式和稳定主数据，后续排班、预测和实际对比都缺少可信输入。",
  },
  {
    id: "batch-02-actual-alignment",
    title: "预测版本与实际日志对齐",
    goal: "在数据底座稳定后，把预测版本和登录/状态日志对齐，形成可解释的缺口对比基础。",
    sequence: 2,
    gapIds: ["actual-log-integration", "forecast-versioning"],
    dependsOnBatchIds: ["batch-01-data-foundation"],
    recommendedReason:
      "实际日志和预测版本直接影响异常识别，必须排在复核、导出和审批之前。",
  },
  {
    id: "batch-03-workflow-controls",
    title: "发布、复核、导出与治理边界",
    goal: "最后补排班发布态、异常复核闭环、权限审计等更接近生产治理的能力。",
    sequence: 3,
    gapIds: [
      "schedule-publish-approval",
      "review-workflow-export",
      "permission-audit-boundary",
    ],
    dependsOnBatchIds: ["batch-02-actual-alignment"],
    recommendedReason:
      "这些能力会触发审批、权限、导出和批量操作硬停条件，必须在数据和对比闭环之后单独 Gate。",
  },
]

export function summarizeProductionMvpGaps(
  gaps: ProductionMvpGap[]
): ProductionMvpGapSummary {
  const acceptanceItemIds = new Set<string>()

  const summary: ProductionMvpGapSummary = {
    total: gaps.length,
    priorityCounts: { P0: 0, P1: 0, P2: 0 },
    riskCounts: { high: 0, medium: 0, low: 0 },
    nextGapIds: [],
    blockedGapIds: [],
    highRiskGapIds: [],
    acceptanceItemCount: 0,
  }

  for (const gap of gaps) {
    summary.priorityCounts[gap.priority] += 1
    summary.riskCounts[gap.risk] += 1

    if (gap.status === "next") {
      summary.nextGapIds.push(gap.id)
    }

    if (gap.status === "blocked_by_gate") {
      summary.blockedGapIds.push(gap.id)
    }

    if (gap.risk === "high") {
      summary.highRiskGapIds.push(gap.id)
    }

    for (const itemId of gap.acceptanceItemIds) {
      acceptanceItemIds.add(itemId)
    }
  }

  summary.acceptanceItemCount = acceptanceItemIds.size

  return summary
}

export function getProductionMvpGap(id: string) {
  return productionMvpGaps.find((gap) => gap.id === id)
}

export function getProductionMvpGapsForAcceptanceItem(itemId: string) {
  return productionMvpGaps.filter((gap) =>
    gap.acceptanceItemIds.includes(itemId)
  )
}

export function getRoadmapBatch(id: string) {
  return productionMvpRoadmapBatches.find((batch) => batch.id === id)
}

export function getRecommendedNextRoadmapBatch() {
  return productionMvpRoadmapBatches
    .slice()
    .sort((left, right) => left.sequence - right.sequence)[0]
}

export function getProductionMvpGapsForRoadmapBatch(batchId: string) {
  const batch = getRoadmapBatch(batchId)

  if (!batch) {
    return []
  }

  return batch.gapIds
    .map((gapId) => getProductionMvpGap(gapId))
    .filter((gap): gap is ProductionMvpGap => Boolean(gap))
}

export function productionMvpGapStatusLabel(status: ProductionMvpGapStatus) {
  return {
    next: "建议下一批",
    later: "后续批次",
    blocked_by_gate: "需独立 Gate",
  }[status]
}
