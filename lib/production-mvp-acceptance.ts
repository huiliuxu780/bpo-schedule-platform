export type ProductionMvpAcceptanceStatus = "covered" | "partial" | "deferred"

export type ProductionMvpAcceptanceItem = {
  id: string
  lane: string
  title: string
  status: ProductionMvpAcceptanceStatus
  purpose: string
  acceptance: string[]
  evidenceRoutes: string[]
  deferredCapabilities: string[]
}

export type ProductionMvpAcceptanceSummary = {
  total: number
  covered: number
  partial: number
  deferred: number
  evidenceRouteCount: number
  deferredCapabilities: string[]
}

export const productionMvpAcceptanceItems: ProductionMvpAcceptanceItem[] = [
  {
    id: "upload-import",
    lane: "上传/导入",
    title: "导入准备与批次追溯",
    status: "partial",
    purpose: "说明第一阶段要上传哪些表，并查看批次状态、成功/失败行和质量问题追溯键。",
    acceptance: [
      "可查看导入模板字段、主键和校验口径。",
      "可查看导入批次状态、失败行和关联质量问题。",
      "可从批次质量问题进入数据质量详情。",
    ],
    evidenceRoutes: ["/import-templates", "/import-batches", "/field-mapping"],
    deferredCapabilities: ["真实上传", "批量导入", "字段映射保存", "失败行写库"],
  },
  {
    id: "master-data",
    lane: "主数据",
    title: "坐席、职场、供应商与绑定关系",
    status: "partial",
    purpose: "确认坐席、职场、供应商、项目、绑定关系和班次类型如何支撑排班与履约对比。",
    acceptance: [
      "可查看主数据导入合同和关系图谱。",
      "可查看班次类型如何被人员排班引用。",
      "可查看主数据质量问题和分组。",
    ],
    evidenceRoutes: ["/production-mvp/master-data", "/master-data-relations", "/shift-types"],
    deferredCapabilities: ["主数据 CRUD", "冻结解冻", "主数据权限"],
  },
  {
    id: "personnel-schedule",
    lane: "排班",
    title: "人员级明细与 0.5h 时段汇总",
    status: "covered",
    purpose: "明确生产雏形同时保留人员级排班明细和 0.5h 时段汇总口径。",
    acceptance: [
      "可查看人员级排班导入合同。",
      "可查看班次明细和人员时间轴。",
      "可说明人员明细如何展开到 0.5h 时段汇总。",
    ],
    evidenceRoutes: ["/production-mvp/personnel-schedules", "/shift-details", "/person-timeline"],
    deferredCapabilities: ["自动排班", "正式发布审批", "排班批量编辑"],
  },
  {
    id: "demand-forecast",
    lane: "需求预测",
    title: "0.5h 预测需求、技能组与等级",
    status: "covered",
    purpose: "把需求预测从履约对比里独立出来，明确时段、职场、项目、技能组、等级和预测人数。",
    acceptance: [
      "可查看需求预测导入合同。",
      "可查看 0.5h 时段和预测字段口径。",
      "可说明预测如何参与排班缺口对比。",
    ],
    evidenceRoutes: ["/production-mvp/demand-forecast", "/demand-plans"],
    deferredCapabilities: ["预测模型接入", "真实预测导入", "生产级预测调整"],
  },
  {
    id: "actual-status",
    lane: "登录/状态",
    title: "实际登录与状态日志对齐",
    status: "partial",
    purpose: "明确登录日志和状态日志如何支撑人员时间轴、实际在线和非有效产能识别。",
    acceptance: [
      "可查看人员双时间轴中的登录和状态事件。",
      "可查看状态日志质量问题。",
      "可说明实际日志不会在本地写入生产系统。",
    ],
    evidenceRoutes: ["/person-timeline", "/data-quality", "/data-quality/groups/time-validity"],
    deferredCapabilities: ["真实登录系统接入", "状态码生产映射", "状态规则公式"],
  },
  {
    id: "comparison-anomaly",
    lane: "差异对比与异常识别",
    title: "预测、排班、登录、状态差异定位",
    status: "covered",
    purpose: "展示第一阶段如何从对比结果定位异常来源，并进入复核状态解释。",
    acceptance: [
      "可查看履约对比合同和异常来源。",
      "可查看异常复核和状态时间线。",
      "可查看数据质量问题如何影响异常判断。",
    ],
    evidenceRoutes: ["/production-mvp/fulfillment-comparison", "/anomaly-review", "/anomaly-review/sources"],
    deferredCapabilities: ["真实复核提交", "审批流", "导出", "批量处理"],
  },
]

export function summarizeProductionMvpAcceptance(
  items: ProductionMvpAcceptanceItem[]
): ProductionMvpAcceptanceSummary {
  const routes = new Set<string>()
  const deferredCapabilities = new Set<string>()

  for (const item of items) {
    for (const route of item.evidenceRoutes) {
      routes.add(route)
    }

    for (const capability of item.deferredCapabilities) {
      deferredCapabilities.add(capability)
    }
  }

  return {
    total: items.length,
    covered: items.filter((item) => item.status === "covered").length,
    partial: items.filter((item) => item.status === "partial").length,
    deferred: items.filter((item) => item.status === "deferred").length,
    evidenceRouteCount: routes.size,
    deferredCapabilities: Array.from(deferredCapabilities),
  }
}

export function productionMvpAcceptanceStatusLabel(
  status: ProductionMvpAcceptanceStatus
) {
  return {
    covered: "已覆盖",
    partial: "部分覆盖",
    deferred: "暂缓",
  }[status]
}
