export type ProductionMvpAnomalyTriageReadinessStepStatus =
  | "ready_to_plan"
  | "requires_gate"

export type ProductionMvpAnomalyTriageReadinessStep = {
  id: string
  title: string
  lane: string
  sequence: number
  status: ProductionMvpAnomalyTriageReadinessStepStatus
  goal: string
  inputObjects: string[]
  outputArtifacts: string[]
  triggerCriteria: string[]
  reviewFields: string[]
  dependsOnStepIds: string[]
  relatedGapIds: string[]
  acceptanceItemIds: string[]
  evidenceRoutes: string[]
  deferredCapabilities: string[]
  boundary: string
}

export type ProductionMvpAnomalyTriageReadinessSummary = {
  stepCount: number
  readyToPlanCount: number
  requiresGateCount: number
  acceptanceItemCount: number
  deferredCapabilities: string[]
}

export const productionMvpAnomalyTriageReadinessSteps: ProductionMvpAnomalyTriageReadinessStep[] =
  [
    {
      id: "anomaly-taxonomy-readiness",
      title: "异常类型目录准备",
      lane: "异常识别",
      sequence: 1,
      status: "ready_to_plan",
      goal: "把预测缺口、排班缺口、未登录、迟到早退、状态异常和主数据绑定异常整理成第一阶段可验收目录。",
      inputObjects: ["预测需求", "人员排班", "登录日志", "状态日志", "主数据绑定"],
      outputArtifacts: ["异常类型目录", "触发口径草案", "验收项映射"],
      triggerCriteria: ["同一日期/职场/项目/0.5h 时段", "人员排班与实际日志可追溯", "异常类型不含结算公式"],
      reviewFields: ["异常类型", "影响对象", "触发来源", "初始严重度"],
      dependsOnStepIds: [],
      relatedGapIds: ["anomaly-review-workflow"],
      acceptanceItemIds: ["comparison-anomaly"],
      evidenceRoutes: ["/anomaly-review", "/production-mvp/fulfillment-comparison"],
      deferredCapabilities: ["真实异常规则引擎", "生产严重度公式", "结算影响计算"],
      boundary: "当前只定义异常目录，不运行真实规则，不改变生产状态码或公式。",
    },
    {
      id: "source-evidence-readiness",
      title: "异常来源证据准备",
      lane: "来源链路",
      sequence: 2,
      status: "ready_to_plan",
      goal: "明确每类异常需要哪些来源证据，保证预测、排班、登录、状态和主数据能支撑归因。",
      inputObjects: ["预测版本", "排班版本", "登录事件", "状态区间", "质量问题"],
      outputArtifacts: ["来源证据清单", "追溯键", "证据页入口"],
      triggerCriteria: ["来源记录有批次或版本", "追溯键能回到人员或时段", "数据质量问题可被引用"],
      reviewFields: ["证据页", "来源批次", "追溯键", "数据质量问题"],
      dependsOnStepIds: ["anomaly-taxonomy-readiness"],
      relatedGapIds: ["actual-log-integration", "forecast-versioning"],
      acceptanceItemIds: ["comparison-anomaly", "actual-status"],
      evidenceRoutes: ["/anomaly-review/sources", "/data-quality"],
      deferredCapabilities: ["真实来源聚合", "真实接口取证", "数据库持久化"],
      boundary: "当前只展示来源链路，不拉取真实日志，不保存证据快照。",
    },
    {
      id: "triage-attribution-readiness",
      title: "异常分派与归因准备",
      lane: "复核准备",
      sequence: 3,
      status: "ready_to_plan",
      goal: "定义异常进入复核池前需要的人、职场、供应商、项目、原因和责任角色字段。",
      inputObjects: ["异常类型目录", "来源证据", "坐席主数据", "供应商绑定", "职场绑定"],
      outputArtifacts: ["复核字段清单", "归因字段", "责任角色建议"],
      triggerCriteria: ["异常具备责任角色", "异常具备可读归因", "异常能关联证据页"],
      reviewFields: ["归因", "责任角色", "建议动作", "复核优先级"],
      dependsOnStepIds: ["source-evidence-readiness"],
      relatedGapIds: ["master-data-maintenance", "anomaly-review-workflow"],
      acceptanceItemIds: ["comparison-anomaly", "actual-status"],
      evidenceRoutes: ["/anomaly-review", "/master-data-relations"],
      deferredCapabilities: ["自动分派", "真实处理流", "供应商权限隔离"],
      boundary: "当前只定义分派和归因准备字段，不创建真实任务、不分派给真实用户。",
    },
    {
      id: "review-workflow-readiness",
      title: "复核工作流准备",
      lane: "复核闭环",
      sequence: 4,
      status: "requires_gate",
      goal: "明确识别、分派、复核、确认、关闭这些状态如何进入后续工作流 Gate。",
      inputObjects: ["异常记录", "复核字段", "责任角色", "复核状态"],
      outputArtifacts: ["复核工作流 Gate 清单", "状态流边界", "后续审批问题"],
      triggerCriteria: ["复核动作需要权限", "确认/关闭会改变业务状态", "批量处理属于硬停条件"],
      reviewFields: ["复核状态", "复核结论", "责任人", "关闭原因"],
      dependsOnStepIds: [
        "anomaly-taxonomy-readiness",
        "source-evidence-readiness",
        "triage-attribution-readiness",
      ],
      relatedGapIds: ["anomaly-review-workflow", "permission-audit-boundary"],
      acceptanceItemIds: ["comparison-anomaly"],
      evidenceRoutes: ["/anomaly-review/timeline", "/production-mvp/gaps/anomaly-review-workflow"],
      deferredCapabilities: ["真实复核提交", "审批流", "权限边界", "批量处理"],
      boundary: "复核提交、审批、权限和批量处理必须后续独立 Gate，当前不实现。",
    },
    {
      id: "closure-audit-readiness",
      title: "关闭与审计准备",
      lane: "闭环证据",
      sequence: 5,
      status: "requires_gate",
      goal: "定义异常关闭后的复核结果、证据保留、操作审计和导出边界。",
      inputObjects: ["复核结论", "证据页", "关闭原因", "操作记录"],
      outputArtifacts: ["关闭字段清单", "审计证据要求", "暂缓能力清单"],
      triggerCriteria: ["关闭动作需留痕", "导出和审计属于生产能力", "结算影响不在第一阶段"],
      reviewFields: ["关闭原因", "复核备注", "证据引用", "操作人"],
      dependsOnStepIds: ["review-workflow-readiness"],
      relatedGapIds: ["permission-audit-boundary"],
      acceptanceItemIds: ["comparison-anomaly"],
      evidenceRoutes: ["/production-mvp/gaps/permission-audit-boundary"],
      deferredCapabilities: ["操作审计", "导出", "结算联动", "数据库持久化"],
      boundary: "当前不生成审计记录、不导出、不进入结算规则或收费因子。",
    },
  ]

export function summarizeProductionMvpAnomalyTriageReadiness(
  steps: ProductionMvpAnomalyTriageReadinessStep[]
): ProductionMvpAnomalyTriageReadinessSummary {
  const acceptanceItemIds = new Set<string>()
  const deferredCapabilities = new Set<string>()

  for (const step of steps) {
    for (const itemId of step.acceptanceItemIds) {
      acceptanceItemIds.add(itemId)
    }

    for (const capability of step.deferredCapabilities) {
      deferredCapabilities.add(capability)
    }
  }

  return {
    stepCount: steps.length,
    readyToPlanCount: steps.filter((step) => step.status === "ready_to_plan")
      .length,
    requiresGateCount: steps.filter((step) => step.status === "requires_gate")
      .length,
    acceptanceItemCount: acceptanceItemIds.size,
    deferredCapabilities: Array.from(deferredCapabilities),
  }
}

export function getProductionMvpAnomalyTriageReadinessStep(id: string) {
  return productionMvpAnomalyTriageReadinessSteps.find((step) => step.id === id)
}

export function getProductionMvpAnomalyTriageReadinessStepsForAcceptanceItem(
  itemId: string
) {
  return productionMvpAnomalyTriageReadinessSteps.filter((step) =>
    step.acceptanceItemIds.includes(itemId)
  )
}

export function getNextAnomalyTriageReadinessStep() {
  return productionMvpAnomalyTriageReadinessSteps
    .slice()
    .sort((left, right) => left.sequence - right.sequence)[0]
}

export function productionMvpAnomalyTriageReadinessStatusLabel(
  status: ProductionMvpAnomalyTriageReadinessStepStatus
) {
  return {
    ready_to_plan: "可进入计划",
    requires_gate: "需独立 Gate",
  }[status]
}
