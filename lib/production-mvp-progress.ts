export type ProductionMvpProgressArea = {
  id: string
  title: string
  localRoutes: string[]
  coveredItems: string[]
  partialItems: string[]
  followUpGaps: string[]
}

export type ProductionMvpProgressSummary = {
  areaCount: number
  localRouteCount: number
  coveredItemCount: number
  partialItemCount: number
  followUpGapCount: number
  deferredCapabilityCount: number
}

export type ProductionMvpProgressAcceptanceItem = {
  deferredCapabilities: string[]
}

export const productionMvpProgressAreas: ProductionMvpProgressArea[] = [
  {
    id: "data-readiness",
    title: "数据准备",
    localRoutes: [
      "/import-templates",
      "/import-batches",
      "/field-mapping",
      "/data-quality",
      "/data-quality/groups",
    ],
    coveredItems: [],
    partialItems: ["upload-import", "master-data"],
    followUpGaps: ["上传入口", "导入执行服务", "主数据 CRUD", "冻结解冻"],
  },
  {
    id: "schedule-and-forecast",
    title: "排班与预测",
    localRoutes: [
      "/production-mvp/personnel-schedules",
      "/shift-details",
      "/shift-types",
      "/production-mvp/demand-forecast",
      "/person-timeline",
    ],
    coveredItems: ["personnel-schedule", "demand-forecast"],
    partialItems: [],
    followUpGaps: ["自动排班", "正式发布审批", "预测版本管理"],
  },
  {
    id: "actual-and-anomaly",
    title: "实际与异常",
    localRoutes: [
      "/production-mvp/fulfillment-comparison",
      "/anomaly-review",
      "/anomaly-review/sources",
      "/anomaly-review/timeline",
    ],
    coveredItems: ["comparison-anomaly"],
    partialItems: ["actual-status"],
    followUpGaps: ["登录日志接口", "状态日志接口", "复核提交", "导出"],
  },
]

export function summarizeProductionMvpProgress(
  areas: ProductionMvpProgressArea[],
  acceptanceItems: ProductionMvpProgressAcceptanceItem[]
): ProductionMvpProgressSummary {
  const routes = new Set<string>()
  const gaps = new Set<string>()
  const coveredItems = new Set<string>()
  const partialItems = new Set<string>()
  const deferredCapabilities = new Set<string>()

  for (const area of areas) {
    for (const route of area.localRoutes) {
      routes.add(route)
    }

    for (const gap of area.followUpGaps) {
      gaps.add(gap)
    }

    for (const item of area.coveredItems) {
      coveredItems.add(item)
    }

    for (const item of area.partialItems) {
      partialItems.add(item)
    }
  }

  for (const item of acceptanceItems) {
    for (const capability of item.deferredCapabilities) {
      deferredCapabilities.add(capability)
    }
  }

  return {
    areaCount: areas.length,
    localRouteCount: routes.size,
    coveredItemCount: coveredItems.size,
    partialItemCount: partialItems.size,
    followUpGapCount: gaps.size,
    deferredCapabilityCount: deferredCapabilities.size,
  }
}
