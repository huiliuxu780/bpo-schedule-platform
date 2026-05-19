export type ProductionMvpDataFoundationStepStatus =
  | "ready_to_plan"
  | "requires_gate"

export type ProductionMvpDataFoundationStep = {
  id: string
  title: string
  lane: string
  sequence: number
  status: ProductionMvpDataFoundationStepStatus
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

export type ProductionMvpDataFoundationSummary = {
  stepCount: number
  readyToPlanCount: number
  requiresGateCount: number
  acceptanceItemCount: number
  deferredCapabilities: string[]
}

export const productionMvpDataFoundationSteps: ProductionMvpDataFoundationStep[] =
  [
    {
      id: "import-execution-readiness",
      title: "导入执行准备",
      lane: "上传/导入",
      sequence: 1,
      status: "ready_to_plan",
      goal: "把模板、批次、失败行和质量问题口径整理成真实导入前的 Gate 清单。",
      inputObjects: ["导入模板", "批次文件", "字段映射草案", "数据质量规则"],
      outputArtifacts: ["导入执行 Gate 清单", "失败行修复口径", "批次追溯键"],
      dependsOnStepIds: [],
      relatedGapIds: ["upload-import-execution"],
      acceptanceItemIds: ["upload-import"],
      evidenceRoutes: ["/import-templates", "/import-batches", "/field-mapping"],
      deferredCapabilities: ["真实上传", "导入执行服务", "失败行写库", "数据库持久化"],
      boundary: "当前只整理准备口径，不上传文件、不解析真实 Excel、不写入数据库。",
    },
    {
      id: "field-mapping-readiness",
      title: "字段映射保存准备",
      lane: "上传/导入",
      sequence: 2,
      status: "ready_to_plan",
      goal: "明确源字段、目标字段、转换说明和版本锁定条件，为后续字段映射保存做准备。",
      inputObjects: ["源文件字段", "目标对象字段", "转换说明", "校验状态"],
      outputArtifacts: ["映射版本口径", "字段校验清单", "批次映射引用"],
      dependsOnStepIds: ["import-execution-readiness"],
      relatedGapIds: ["field-mapping-persistence"],
      acceptanceItemIds: ["upload-import"],
      evidenceRoutes: ["/field-mapping", "/import-templates"],
      deferredCapabilities: ["字段映射保存", "映射版本管理", "批次映射锁定"],
      boundary: "当前不保存映射配置，不生成生产转换器，也不锁定真实导入批次。",
    },
    {
      id: "master-data-maintenance-readiness",
      title: "主数据维护准备",
      lane: "主数据",
      sequence: 3,
      status: "ready_to_plan",
      goal: "明确坐席、职场、供应商、项目和班次类型维护前置条件，保证排班与履约对比有稳定主数据。",
      inputObjects: ["坐席主数据", "职场主数据", "供应商主数据", "项目主数据", "班次类型"],
      outputArtifacts: ["主数据维护字段清单", "主键与唯一性口径", "质量问题分组"],
      dependsOnStepIds: ["field-mapping-readiness"],
      relatedGapIds: ["master-data-maintenance"],
      acceptanceItemIds: ["master-data"],
      evidenceRoutes: ["/production-mvp/master-data", "/master-data-relations", "/shift-types"],
      deferredCapabilities: ["主数据 CRUD", "主数据权限", "数据库持久化"],
      boundary: "当前不新增编辑表单、不保存主数据、不定义生产权限。",
    },
    {
      id: "binding-freeze-readiness",
      title: "绑定关系冻结解冻准备",
      lane: "主数据",
      sequence: 4,
      status: "requires_gate",
      goal: "明确坐席、职场、供应商、项目绑定关系在生产雏形中何时可变、何时冻结。",
      inputObjects: ["坐席-项目绑定", "坐席-供应商绑定", "职场-项目绑定", "生效日期"],
      outputArtifacts: ["冻结解冻业务口径", "变更复核点", "审计字段草案"],
      dependsOnStepIds: ["master-data-maintenance-readiness"],
      relatedGapIds: ["master-data-maintenance", "permission-audit-boundary"],
      acceptanceItemIds: ["master-data"],
      evidenceRoutes: ["/master-data-relations", "/production-mvp/gaps/permission-audit-boundary"],
      deferredCapabilities: ["冻结解冻", "操作审计", "权限管理"],
      boundary: "冻结解冻、权限和审计会触发硬停条件，必须后续单独 Gate。",
    },
    {
      id: "data-quality-traceability-readiness",
      title: "数据质量追溯准备",
      lane: "数据质量",
      sequence: 5,
      status: "requires_gate",
      goal: "把导入批次、字段映射、主数据和质量问题串成可追溯链路，作为真实修复队列前置准备。",
      inputObjects: ["导入批次", "映射版本", "主数据主键", "质量问题 ID"],
      outputArtifacts: ["质量问题追溯链路", "修复队列输入口径", "后续 Gate 边界"],
      dependsOnStepIds: [
        "import-execution-readiness",
        "field-mapping-readiness",
        "master-data-maintenance-readiness",
      ],
      relatedGapIds: ["upload-import-execution", "master-data-maintenance"],
      acceptanceItemIds: ["upload-import", "master-data"],
      evidenceRoutes: ["/data-quality", "/data-quality/groups", "/import-batches"],
      deferredCapabilities: ["真实修复提交", "失败行修复队列", "数据库持久化"],
      boundary: "当前只展示追溯准备，不提交修复、不关闭问题、不写入生产状态。",
    },
  ]

export function summarizeProductionMvpDataFoundation(
  steps: ProductionMvpDataFoundationStep[]
): ProductionMvpDataFoundationSummary {
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

export function getProductionMvpDataFoundationStep(id: string) {
  return productionMvpDataFoundationSteps.find((step) => step.id === id)
}

export function getProductionMvpDataFoundationStepsForAcceptanceItem(
  itemId: string
) {
  return productionMvpDataFoundationSteps.filter((step) =>
    step.acceptanceItemIds.includes(itemId)
  )
}

export function getNextDataFoundationStep() {
  return productionMvpDataFoundationSteps
    .slice()
    .sort((left, right) => left.sequence - right.sequence)[0]
}

export function productionMvpDataFoundationStatusLabel(
  status: ProductionMvpDataFoundationStepStatus
) {
  return {
    ready_to_plan: "可进入计划",
    requires_gate: "需独立 Gate",
  }[status]
}
