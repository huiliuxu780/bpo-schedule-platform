export type ProductionMvpGovernanceReadinessStepStatus =
  | "ready_to_plan"
  | "requires_gate"

export type ProductionMvpGovernanceReadinessStep = {
  id: string
  title: string
  lane: string
  sequence: number
  status: ProductionMvpGovernanceReadinessStepStatus
  goal: string
  inputObjects: string[]
  outputArtifacts: string[]
  triggerConditions: string[]
  controlFields: string[]
  dependsOnStepIds: string[]
  relatedGapIds: string[]
  acceptanceItemIds: string[]
  evidenceRoutes: string[]
  deferredCapabilities: string[]
  boundary: string
}

export type ProductionMvpGovernanceReadinessSummary = {
  stepCount: number
  readyToPlanCount: number
  requiresGateCount: number
  acceptanceItemCount: number
  deferredCapabilities: string[]
}

export const productionMvpGovernanceReadinessSteps: ProductionMvpGovernanceReadinessStep[] =
  [
    {
      id: "schedule-release-state-readiness",
      title: "排班发布态准备",
      lane: "排班治理",
      sequence: 1,
      status: "ready_to_plan",
      goal: "明确人员级排班和 0.5h 汇总从草稿到生效、冻结、作废的状态边界。",
      inputObjects: ["人员级排班", "0.5h 时段汇总", "排班版本", "发布说明"],
      outputArtifacts: ["发布态字段清单", "版本引用键", "发布前检查清单"],
      triggerConditions: ["排班版本完成校验", "人员明细可追溯到时段汇总", "发布动作不在当前批次执行"],
      controlFields: ["schedule_version_id", "release_status", "effective_from", "effective_to"],
      dependsOnStepIds: [],
      relatedGapIds: ["schedule-publish-approval"],
      acceptanceItemIds: ["personnel-schedule"],
      evidenceRoutes: ["/production-mvp/personnel-schedules", "/shift-details"],
      deferredCapabilities: ["真实发布", "真实审批流", "发布锁定"],
      boundary: "当前只定义发布态准备，不执行发布、不创建审批流、不改变排班生产状态。",
    },
    {
      id: "freeze-unfreeze-readiness",
      title: "冻结解冻边界准备",
      lane: "主数据与排班",
      sequence: 2,
      status: "ready_to_plan",
      goal: "明确主数据、绑定关系和排班版本何时可冻结、何时需解冻，以及哪些字段必须留给后续 Gate。",
      inputObjects: ["坐席主数据", "绑定关系", "排班版本", "职场/供应商状态"],
      outputArtifacts: ["冻结字段清单", "解冻原因口径", "影响范围提示"],
      triggerConditions: ["主数据有效期变更", "绑定关系变更", "已发布排班需要保护"],
      controlFields: ["frozen_status", "freeze_reason", "unfreeze_reason", "affected_records"],
      dependsOnStepIds: ["schedule-release-state-readiness"],
      relatedGapIds: ["schedule-publish-approval", "master-data-maintenance"],
      acceptanceItemIds: ["personnel-schedule", "master-data"],
      evidenceRoutes: ["/master-data-relations", "/production-mvp/data-foundation"],
      deferredCapabilities: ["真实冻结", "真实解冻", "数据库持久化"],
      boundary: "当前不冻结任何真实数据，不写库，不执行解冻审批或批量变更。",
    },
    {
      id: "permission-boundary-readiness",
      title: "权限边界准备",
      lane: "治理控制",
      sequence: 3,
      status: "requires_gate",
      goal: "把运营、主管、供应商、数据管理员和 PM 的查看/操作边界整理为后续权限 Gate 的输入。",
      inputObjects: ["角色清单", "页面入口", "操作清单", "供应商/职场范围"],
      outputArtifacts: ["权限矩阵草案", "硬停操作清单", "角色边界问题"],
      triggerConditions: ["涉及真实操作", "涉及供应商隔离", "涉及审批、导出或批量"],
      controlFields: ["role", "scope", "operation", "requires_approval"],
      dependsOnStepIds: ["freeze-unfreeze-readiness"],
      relatedGapIds: ["permission-audit-boundary"],
      acceptanceItemIds: ["master-data"],
      evidenceRoutes: ["/production-mvp/gaps/permission-audit-boundary"],
      deferredCapabilities: ["权限体系", "供应商隔离", "认证登录"],
      boundary: "权限体系属于硬停条件，当前只整理边界，不实现认证、授权或隔离。",
    },
    {
      id: "audit-evidence-readiness",
      title: "审计留痕准备",
      lane: "治理证据",
      sequence: 4,
      status: "requires_gate",
      goal: "明确发布、冻结、解冻、复核、导出和批量动作未来需要记录哪些审计证据。",
      inputObjects: ["操作人", "操作对象", "操作前后值", "原因", "证据页"],
      outputArtifacts: ["审计字段清单", "证据保留要求", "后续审计 Gate 问题"],
      triggerConditions: ["真实动作需要留痕", "关闭/发布影响业务状态", "审计数据需要持久化"],
      controlFields: ["actor", "action", "before_value", "after_value", "reason"],
      dependsOnStepIds: [
        "schedule-release-state-readiness",
        "freeze-unfreeze-readiness",
        "permission-boundary-readiness",
      ],
      relatedGapIds: ["permission-audit-boundary"],
      acceptanceItemIds: [],
      evidenceRoutes: ["/production-mvp/gaps/permission-audit-boundary"],
      deferredCapabilities: ["操作审计", "数据库持久化", "审计报表"],
      boundary: "当前不生成真实审计记录，不保存操作快照，不提供审计报表。",
    },
    {
      id: "export-batch-boundary-readiness",
      title: "导出与批量边界准备",
      lane: "暂缓能力",
      sequence: 5,
      status: "requires_gate",
      goal: "明确导出、批量发布、批量冻结、批量复核和批量处理为什么必须后续单独 Gate。",
      inputObjects: ["导出字段", "批量操作对象", "权限角色", "审计要求"],
      outputArtifacts: ["导出 Gate 清单", "批量操作风险清单", "暂缓说明"],
      triggerConditions: ["跨记录修改", "跨供应商数据访问", "需要下载或外发数据"],
      controlFields: ["export_scope", "batch_scope", "approval_required", "audit_required"],
      dependsOnStepIds: ["permission-boundary-readiness", "audit-evidence-readiness"],
      relatedGapIds: ["permission-audit-boundary", "review-workflow-export"],
      acceptanceItemIds: [],
      evidenceRoutes: ["/production-mvp/gaps/review-workflow-export"],
      deferredCapabilities: ["真实导出", "批量操作", "结算联动", "收费因子"],
      boundary: "当前不导出、不批量处理、不进入结算规则或收费因子。",
    },
  ]

export function summarizeProductionMvpGovernanceReadiness(
  steps: ProductionMvpGovernanceReadinessStep[]
): ProductionMvpGovernanceReadinessSummary {
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

export function getProductionMvpGovernanceReadinessStep(id: string) {
  return productionMvpGovernanceReadinessSteps.find((step) => step.id === id)
}

export function getProductionMvpGovernanceReadinessStepsForAcceptanceItem(
  itemId: string
) {
  return productionMvpGovernanceReadinessSteps.filter((step) =>
    step.acceptanceItemIds.includes(itemId)
  )
}

export function getProductionMvpGovernanceReadinessStepsForGap(gapId: string) {
  return productionMvpGovernanceReadinessSteps.filter((step) =>
    step.relatedGapIds.includes(gapId)
  )
}

export function getNextGovernanceReadinessStep() {
  return productionMvpGovernanceReadinessSteps
    .slice()
    .sort((left, right) => left.sequence - right.sequence)[0]
}

export function productionMvpGovernanceReadinessStatusLabel(
  status: ProductionMvpGovernanceReadinessStepStatus
) {
  return {
    ready_to_plan: "可进入计划",
    requires_gate: "需独立 Gate",
  }[status]
}
