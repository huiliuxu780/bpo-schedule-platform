export type DemandForecastContract = {
  version: string
  entity: string
  primaryKey: string[]
  intervalMinutes: number
  fields: string[]
  requiredFields: string[]
  validationRules: string[]
  comparisonKeys: string[]
  deferredActions: string[]
}

export type DemandForecastContractSummary = {
  fieldCount: number
  requiredFieldCount: number
  validationRuleCount: number
  hasSkillDemand: boolean
  deferredActions: string[]
}

export const fallbackDemandForecastContract: DemandForecastContract = {
  version: "production-mvp-v1",
  entity: "demand_forecast",
  primaryKey: ["forecast_id"],
  intervalMinutes: 30,
  fields: [
    "forecast_id",
    "forecast_version_id",
    "business_date",
    "workplace_id",
    "project_id",
    "interval_start",
    "interval_end",
    "forecast_agents",
    "skill_group",
    "skill_level",
    "source_system",
    "uploaded_by",
    "uploaded_at",
    "status",
    "version",
  ],
  requiredFields: [
    "forecast_id",
    "forecast_version_id",
    "business_date",
    "workplace_id",
    "project_id",
    "interval_start",
    "interval_end",
    "forecast_agents",
    "skill_group",
    "skill_level",
  ],
  validationRules: [
    "missing_required_field",
    "duplicate_primary_key",
    "invalid_interval_range",
    "non_half_hour_interval",
    "negative_forecast_agents",
    "unknown_workplace_or_project",
    "missing_skill_dimension",
  ],
  comparisonKeys: [
    "business_date",
    "workplace_id",
    "project_id",
    "skill_group",
    "skill_level",
    "interval_start",
    "interval_end",
  ],
  deferredActions: [
    "无真实预测系统接入",
    "无真实导入写入",
    "无预测算法",
    "无审批、导出或批量处理",
  ],
}

export function summarizeDemandForecastContract(
  contract: DemandForecastContract
): DemandForecastContractSummary {
  return {
    fieldCount: contract.fields.length,
    requiredFieldCount: contract.requiredFields.length,
    validationRuleCount: contract.validationRules.length,
    hasSkillDemand:
      contract.fields.includes("skill_group") &&
      contract.fields.includes("skill_level") &&
      contract.requiredFields.includes("forecast_agents"),
    deferredActions: contract.deferredActions,
  }
}
