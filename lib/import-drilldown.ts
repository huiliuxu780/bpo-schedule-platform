import type {
  FulfillmentComparisonContract,
  MasterDataImportContract,
  PersonnelScheduleImportContract,
  ProductionMvpContracts,
} from "./production-mvp-contracts"

export type ImportContractDrilldownId =
  | "master-data"
  | "personnel-schedules"
  | "fulfillment-comparison"

export type ImportContractDrilldown = {
  id: ImportContractDrilldownId
  title: string
  href: string
  description: string
  grain: string
  entityCount: number
  fieldCount: number
  requiredFieldCount: number
  validationRuleCount: number
  highlights: string[]
  deferredActions: string[]
}

export type ImportContractDrilldownSummary = {
  contractCount: number
  totalFields: number
  requiredFields: number
  validationRules: number
  deferredActions: string[]
}

export function getImportContractDrilldowns(
  contracts: ProductionMvpContracts
): ImportContractDrilldown[] {
  return [
    masterDataDrilldown(contracts.masterData, contracts.deferredCapabilities),
    personnelScheduleDrilldown(
      contracts.personnelSchedule,
      contracts.deferredCapabilities
    ),
    fulfillmentComparisonDrilldown(
      contracts.fulfillmentComparison,
      contracts.deferredCapabilities
    ),
  ]
}

export function getImportContractDrilldown(
  id: ImportContractDrilldownId,
  contracts: ProductionMvpContracts
) {
  return getImportContractDrilldowns(contracts).find((row) => row.id === id)
}

export function summarizeImportContractDrilldowns(
  rows: ImportContractDrilldown[]
): ImportContractDrilldownSummary {
  return {
    contractCount: rows.length,
    totalFields: sum(rows, "fieldCount"),
    requiredFields: sum(rows, "requiredFieldCount"),
    validationRules: sum(rows, "validationRuleCount"),
    deferredActions: [...new Set(rows.flatMap((row) => row.deferredActions))],
  }
}

function masterDataDrilldown(
  contract: MasterDataImportContract,
  deferredActions: string[]
): ImportContractDrilldown {
  return {
    id: "master-data",
    title: "主数据导入合同",
    href: "/production-mvp/master-data",
    description: "坐席、职场、供应商、项目、绑定关系和班次类型的导入字段口径。",
    grain: "主数据对象",
    entityCount: contract.entities.length,
    fieldCount: contract.entities.reduce(
      (total, entity) => total + entity.fields.length,
      0
    ),
    requiredFieldCount: contract.entities.reduce(
      (total, entity) => total + entity.required_fields.length,
      0
    ),
    validationRuleCount: contract.entities.reduce(
      (total, entity) => total + entity.validation_rules.length,
      0
    ),
    highlights: ["对象主键", "必填字段", "外键关系", "质量错误码"],
    deferredActions,
  }
}

function personnelScheduleDrilldown(
  contract: PersonnelScheduleImportContract,
  deferredActions: string[]
): ImportContractDrilldown {
  return {
    id: "personnel-schedules",
    title: "人员级排班合同",
    href: "/production-mvp/personnel-schedules",
    description: "人员级排班明细、班次时间、休息饭点和 0.5h 时段展开结果。",
    grain: "人员排班明细",
    entityCount: 1,
    fieldCount: contract.fields.length,
    requiredFieldCount: contract.required_fields.length,
    validationRuleCount: contract.validation_rules.length,
    highlights: ["人员明细", "班次类型", "0.5h 展开", "人员列表追溯"],
    deferredActions,
  }
}

function fulfillmentComparisonDrilldown(
  contract: FulfillmentComparisonContract,
  deferredActions: string[]
): ImportContractDrilldown {
  const uniqueFields = unique(contract.sources.flatMap((source) => source.fields))
  const uniqueRequiredFields = unique(
    contract.sources.flatMap((source) => source.required_fields)
  )

  return {
    id: "fulfillment-comparison",
    title: "履约对比合同",
    href: "/production-mvp/fulfillment-comparison",
    description: "需求预测、人员排班、登录日志和状态日志按 0.5h 时段对齐。",
    grain: "0.5h 时段汇总 + 人员级追溯",
    entityCount: contract.sources.length,
    fieldCount: uniqueFields.length,
    requiredFieldCount: uniqueRequiredFields.length,
    validationRuleCount:
      contract.anomaly_rules.length + contract.comparison_keys.length,
    highlights: ["四类来源", "时段对齐键", "人员级追溯", "异常规则"],
    deferredActions,
  }
}

function unique(values: string[]) {
  return [...new Set(values)]
}

function sum(rows: ImportContractDrilldown[], key: keyof ImportContractDrilldown) {
  return rows.reduce((total, row) => {
    const value = row[key]

    return typeof value === "number" ? total + value : total
  }, 0)
}
