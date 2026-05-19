export type ProductionMvpAlignmentReadinessStepStatus =
  | "ready_to_plan"
  | "requires_gate"

export type ProductionMvpAlignmentReadinessStep = {
  id: string
  title: string
  lane: string
  sequence: number
  status: ProductionMvpAlignmentReadinessStepStatus
  goal: string
  inputObjects: string[]
  outputArtifacts: string[]
  dependsOnStepIds: string[]
  relatedGapIds: string[]
  acceptanceItemIds: string[]
  evidenceRoutes: string[]
  deferredCapabilities: string[]
  boundary: string
}

export type ProductionMvpAlignmentReadinessSummary = {
  stepCount: number
  readyToPlanCount: number
  requiresGateCount: number
  acceptanceItemCount: number
  deferredCapabilities: string[]
}

export const productionMvpAlignmentReadinessSteps: ProductionMvpAlignmentReadinessStep[] =
  [
    {
      id: "forecast-version-readiness",
      title: "预测版本基准准备",
      lane: "需求预测",
      sequence: 1,
      status: "ready_to_plan",
      goal: "明确 0.5h 预测需求、技能组、等级、版本号和调整记录如何成为对比基准。",
      inputObjects: ["预测需求", "技能组", "等级", "预测版本", "调整记录"],
      outputArtifacts: ["预测版本基准", "调整记录口径", "对比基准引用键"],
      dependsOnStepIds: [],
      relatedGapIds: ["forecast-versioning"],
      acceptanceItemIds: ["demand-forecast"],
      evidenceRoutes: ["/production-mvp/demand-forecast", "/demand-plans"],
      deferredCapabilities: ["真实预测导入", "预测模型接入", "预测版本管理"],
      boundary: "当前只定义版本准备口径，不接预测模型，不保存真实预测版本。",
    },
    {
      id: "login-log-readiness",
      title: "登录日志接入准备",
      lane: "登录/状态",
      sequence: 2,
      status: "ready_to_plan",
      goal: "明确员工、登录、登出、来源系统和日志质量如何支撑实际在线判断。",
      inputObjects: ["员工编号", "登录时间", "登出时间", "来源系统", "日志批次"],
      outputArtifacts: ["登录日志字段清单", "时间有效性规则", "实际在线基准"],
      dependsOnStepIds: ["forecast-version-readiness"],
      relatedGapIds: ["actual-log-integration"],
      acceptanceItemIds: ["actual-status"],
      evidenceRoutes: ["/person-timeline", "/data-quality/groups/time-validity"],
      deferredCapabilities: ["真实登录系统接入", "登录日志接口", "数据库持久化"],
      boundary: "真实登录系统接入属于硬停条件，当前不创建接口、不拉取日志、不写库。",
    },
    {
      id: "status-log-readiness",
      title: "状态日志接入准备",
      lane: "登录/状态",
      sequence: 3,
      status: "requires_gate",
      goal: "明确状态开始、状态结束、状态类型和有效产能口径如何进入人员时间轴。",
      inputObjects: ["员工编号", "状态开始", "状态结束", "状态类型", "状态来源"],
      outputArtifacts: ["状态日志字段清单", "状态时间轴口径", "非有效产能识别前置条件"],
      dependsOnStepIds: ["login-log-readiness"],
      relatedGapIds: ["actual-log-integration"],
      acceptanceItemIds: ["actual-status"],
      evidenceRoutes: ["/person-timeline", "/data-quality/groups/actual-log-reference"],
      deferredCapabilities: ["状态日志接口", "真实状态系统接入", "数据库持久化"],
      boundary: "当前不接真实状态系统，不生成生产状态流，也不计算生产产能公式。",
    },
    {
      id: "status-code-mapping-readiness",
      title: "状态码映射准备",
      lane: "登录/状态",
      sequence: 4,
      status: "requires_gate",
      goal: "明确本地状态类型到生产状态码的映射边界，避免把演示状态误当生产公式。",
      inputObjects: ["本地状态类型", "生产状态码草案", "有效/无效产能标记", "异常原因"],
      outputArtifacts: ["状态码映射 Gate 清单", "生产公式待确认项", "状态口径风险"],
      dependsOnStepIds: ["status-log-readiness"],
      relatedGapIds: ["actual-log-integration", "permission-audit-boundary"],
      acceptanceItemIds: ["actual-status"],
      evidenceRoutes: ["/person-timeline", "/production-mvp/gaps/actual-log-integration"],
      deferredCapabilities: ["状态码生产映射", "状态规则公式", "权限管理"],
      boundary: "状态码映射和公式属于生产口径，必须后续独立 Gate，当前不实现。",
    },
    {
      id: "comparison-baseline-readiness",
      title: "预测、排班、登录、状态对比基准准备",
      lane: "差异对比与异常识别",
      sequence: 5,
      status: "ready_to_plan",
      goal: "把预测版本、人员排班、登录日志和状态日志对齐到同一日期、职场、项目和 0.5h 时段。",
      inputObjects: ["预测版本基准", "人员排班", "登录日志", "状态日志", "0.5h 时段"],
      outputArtifacts: ["对比基准键", "异常识别前置条件", "缺口解释链路"],
      dependsOnStepIds: [
        "forecast-version-readiness",
        "login-log-readiness",
        "status-log-readiness",
      ],
      relatedGapIds: ["actual-log-integration", "forecast-versioning"],
      acceptanceItemIds: ["demand-forecast", "actual-status", "comparison-anomaly"],
      evidenceRoutes: [
        "/production-mvp/fulfillment-comparison",
        "/anomaly-review/sources",
        "/production-mvp/gaps",
      ],
      deferredCapabilities: ["真实异常计算", "真实复核提交", "导出", "批量处理"],
      boundary: "当前只定义对比基准准备，不提交复核、不导出、不批量处理、不计算生产异常。",
    },
  ]

export function summarizeProductionMvpAlignmentReadiness(
  steps: ProductionMvpAlignmentReadinessStep[]
): ProductionMvpAlignmentReadinessSummary {
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

export function getProductionMvpAlignmentReadinessStep(id: string) {
  return productionMvpAlignmentReadinessSteps.find((step) => step.id === id)
}

export function getProductionMvpAlignmentReadinessStepsForAcceptanceItem(
  itemId: string
) {
  return productionMvpAlignmentReadinessSteps.filter((step) =>
    step.acceptanceItemIds.includes(itemId)
  )
}

export function getNextAlignmentReadinessStep() {
  return productionMvpAlignmentReadinessSteps
    .slice()
    .sort((left, right) => left.sequence - right.sequence)[0]
}

export function productionMvpAlignmentReadinessStatusLabel(
  status: ProductionMvpAlignmentReadinessStepStatus
) {
  return {
    ready_to_plan: "可进入计划",
    requires_gate: "需独立 Gate",
  }[status]
}
