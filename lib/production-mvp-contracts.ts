export type MasterDataEntityContract = {
  entity: string
  primary_key: string[]
  fields: string[]
  required_fields: string[]
  foreign_keys?: string[]
  validation_rules: string[]
}

export type MasterDataImportContract = {
  version: string
  entities: MasterDataEntityContract[]
  batch_fields: string[]
  failure_row_fields: string[]
  quality_error_codes: string[]
}

export type IntervalExpansionContract = {
  source_entity: string
  target_entity: string
  interval_minutes: number
  group_by: string[]
  target_fields: string[]
  traceability_fields: string[]
}

export type PersonnelScheduleImportContract = {
  version: string
  entity: string
  primary_key: string[]
  fields: string[]
  required_fields: string[]
  generated_fields: string[]
  validation_rules: string[]
  expansion: IntervalExpansionContract
}

export type ComparisonSourceContract = {
  source: string
  fields: string[]
  required_fields: string[]
  grain: string
}

export type AnomalyRuleContract = {
  code: string
  compares: string[]
  condition: string
  review_owner: string
}

export type FulfillmentComparisonContract = {
  version: string
  sources: ComparisonSourceContract[]
  comparison_keys: string[]
  person_level_keys: string[]
  status_dictionary_fields: string[]
  anomaly_rules: AnomalyRuleContract[]
  review_fields: string[]
}

export type ProductionMvpContracts = {
  masterData: MasterDataImportContract
  personnelSchedule: PersonnelScheduleImportContract
  fulfillmentComparison: FulfillmentComparisonContract
  deferredCapabilities: string[]
}

export type ProductionMvpContractSummary = {
  contractCount: number
  sourceCount: number
  anomalyRuleCount: number
  contractTitles: string[]
  deferredCapabilities: string[]
  hasPersonnelScheduleDetail: boolean
  hasHalfHourIntervalAggregation: boolean
}

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

const deferredCapabilities = [
  "无数据库持久化",
  "无真实外部导入",
  "无权限/审批/导出/批量操作",
  "无生产公式、结算规则或 charge factor",
]

export const fallbackProductionMvpContracts: ProductionMvpContracts = {
  masterData: {
    version: "production-mvp-v1",
    entities: [
      masterEntity(
        "agent",
        ["employee_id"],
        [
          "employee_id",
          "external_employee_id",
          "employee_name",
          "supplier_id",
          "workplace_id",
          "project_id",
          "skill_group",
          "skill_level",
          "status",
          "effective_from",
          "effective_to",
        ],
        [
          "employee_id",
          "employee_name",
          "supplier_id",
          "workplace_id",
          "project_id",
          "status",
        ],
        ["supplier_id", "workplace_id", "project_id"],
        [
          "missing_required_field",
          "duplicate_primary_key",
          "unknown_foreign_key",
          "invalid_effective_range",
        ]
      ),
      masterEntity(
        "workplace",
        ["workplace_id"],
        ["workplace_id", "workplace_name", "city", "timezone", "status"],
        ["workplace_id", "workplace_name", "timezone", "status"],
        [],
        ["missing_required_field", "duplicate_primary_key", "invalid_timezone"]
      ),
      masterEntity(
        "supplier",
        ["supplier_id"],
        ["supplier_id", "supplier_name", "status", "effective_from", "effective_to"],
        ["supplier_id", "supplier_name", "status"],
        [],
        ["missing_required_field", "duplicate_primary_key", "invalid_effective_range"]
      ),
      masterEntity(
        "project",
        ["project_id"],
        ["project_id", "project_name", "status", "effective_from", "effective_to"],
        ["project_id", "project_name", "status"],
        [],
        ["missing_required_field", "duplicate_primary_key", "invalid_effective_range"]
      ),
      masterEntity(
        "agent_binding",
        ["binding_id"],
        [
          "binding_id",
          "employee_id",
          "supplier_id",
          "workplace_id",
          "project_id",
          "skill_group",
          "skill_level",
          "effective_from",
          "effective_to",
          "status",
        ],
        [
          "binding_id",
          "employee_id",
          "supplier_id",
          "workplace_id",
          "project_id",
          "effective_from",
          "status",
        ],
        ["employee_id", "supplier_id", "workplace_id", "project_id"],
        [
          "missing_required_field",
          "duplicate_primary_key",
          "unknown_foreign_key",
          "overlapping_effective_range",
          "invalid_effective_range",
        ]
      ),
      masterEntity(
        "shift_type",
        ["shift_type_id"],
        [
          "shift_type_id",
          "shift_type_name",
          "start_time",
          "end_time",
          "break_windows",
          "meal_windows",
          "counts_as_scheduled",
          "status",
        ],
        [
          "shift_type_id",
          "shift_type_name",
          "start_time",
          "end_time",
          "counts_as_scheduled",
          "status",
        ],
        [],
        [
          "missing_required_field",
          "duplicate_primary_key",
          "invalid_time_range",
          "invalid_boolean_value",
        ]
      ),
    ],
    batch_fields: [
      "batch_id",
      "file_name",
      "entity",
      "uploaded_by",
      "uploaded_at",
      "business_date_from",
      "business_date_to",
      "status",
      "total_rows",
      "success_rows",
      "failed_rows",
      "warning_rows",
      "version",
    ],
    failure_row_fields: [
      "batch_id",
      "entity",
      "failed_row_number",
      "field_name",
      "error_code",
      "error_message",
      "raw_value",
    ],
    quality_error_codes: [
      "missing_required_field",
      "duplicate_primary_key",
      "unknown_foreign_key",
      "invalid_effective_range",
      "overlapping_effective_range",
      "invalid_time_range",
      "invalid_timezone",
      "invalid_boolean_value",
    ],
  },
  personnelSchedule: {
    version: "production-mvp-v1",
    entity: "personnel_schedule",
    primary_key: ["schedule_detail_id"],
    fields: [
      "schedule_detail_id",
      "schedule_version_id",
      "employee_id",
      "schedule_date",
      "business_date",
      "workplace_id",
      "supplier_id",
      "project_id",
      "skill_group",
      "skill_level",
      "shift_type_id",
      "start_at",
      "end_at",
      "break_windows",
      "meal_windows",
      "status",
    ],
    required_fields: [
      "schedule_detail_id",
      "schedule_version_id",
      "employee_id",
      "business_date",
      "workplace_id",
      "supplier_id",
      "project_id",
      "shift_type_id",
      "start_at",
      "end_at",
      "status",
    ],
    generated_fields: ["expanded_interval_ids"],
    validation_rules: [
      "missing_required_field",
      "duplicate_primary_key",
      "unknown_employee_id",
      "unknown_shift_type_id",
      "invalid_time_range",
      "cross_day_without_business_date",
      "break_or_meal_outside_shift",
    ],
    expansion: {
      source_entity: "personnel_schedule",
      target_entity: "interval_schedule",
      interval_minutes: 30,
      group_by: [
        "schedule_version_id",
        "business_date",
        "workplace_id",
        "project_id",
        "skill_group",
        "skill_level",
        "interval_start",
        "interval_end",
      ],
      target_fields: [
        "interval_schedule_id",
        "schedule_version_id",
        "business_date",
        "workplace_id",
        "project_id",
        "interval_start",
        "interval_end",
        "scheduled_agents",
        "employee_ids",
        "generated_from",
      ],
      traceability_fields: [
        "schedule_detail_id",
        "expanded_interval_ids",
        "generated_from",
      ],
    },
  },
  fulfillmentComparison: {
    version: "production-mvp-v1",
    sources: [
      sourceContract("demand_forecast", "0.5h interval", [
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
      ]),
      sourceContract("personnel_schedule", "person shift detail and generated 0.5h interval", [
        "schedule_detail_id",
        "schedule_version_id",
        "employee_id",
        "business_date",
        "workplace_id",
        "project_id",
        "interval_start",
        "interval_end",
        "scheduled_agents",
        "employee_ids",
      ]),
      sourceContract("login_log", "employee login session", [
        "login_event_id",
        "employee_id",
        "external_employee_id",
        "login_at",
        "logout_at",
        "workplace_id",
        "project_id",
      ]),
      sourceContract("status_log", "employee status interval", [
        "status_event_id",
        "employee_id",
        "status_type",
        "status_start_at",
        "status_end_at",
        "workplace_id",
        "project_id",
        "counts_as_productive",
      ]),
    ],
    comparison_keys: [
      "business_date",
      "workplace_id",
      "project_id",
      "interval_start",
      "interval_end",
    ],
    person_level_keys: [
      "employee_id",
      "business_date",
      "schedule_detail_id",
      "login_event_id",
      "status_event_id",
    ],
    status_dictionary_fields: [
      "status_type",
      "counts_as_productive",
      "productive_category",
    ],
    anomaly_rules: [
      anomalyRule("forecast_shortage", ["demand_forecast", "interval_schedule"], "forecast_agents > scheduled_agents", "排班运营"),
      anomalyRule("forecast_overstaffed", ["demand_forecast", "interval_schedule"], "scheduled_agents > forecast_agents", "排班运营"),
      anomalyRule("no_login", ["personnel_schedule", "login_log"], "scheduled employee has no login session", "现场主管"),
      anomalyRule("late_login", ["personnel_schedule", "login_log"], "login_at > scheduled start_at", "现场主管"),
      anomalyRule("early_logout", ["personnel_schedule", "login_log"], "logout_at < scheduled end_at", "现场主管"),
      anomalyRule("unscheduled_login", ["login_log", "personnel_schedule"], "login session has no matching personnel schedule", "现场主管"),
      anomalyRule("non_productive_status", ["personnel_schedule", "status_log"], "scheduled interval is covered by non-productive status", "运营负责人"),
    ],
    review_fields: [
      "anomaly_id",
      "anomaly_code",
      "review_result",
      "root_cause",
      "reviewer",
      "reviewed_at",
      "review_note",
    ],
  },
  deferredCapabilities,
}

export function summarizeProductionMvpContracts(
  contracts: ProductionMvpContracts
): ProductionMvpContractSummary {
  const personnel = contracts.personnelSchedule

  return {
    contractCount: 3,
    sourceCount: contracts.fulfillmentComparison.sources.length,
    anomalyRuleCount: contracts.fulfillmentComparison.anomaly_rules.length,
    contractTitles: [
      "主数据导入合同",
      "人员级排班合同",
      "预测/排班/登录/状态对比合同",
    ],
    deferredCapabilities: contracts.deferredCapabilities,
    hasPersonnelScheduleDetail:
      personnel.entity === "personnel_schedule" &&
      personnel.fields.includes("employee_id") &&
      personnel.primary_key.includes("schedule_detail_id"),
    hasHalfHourIntervalAggregation:
      personnel.expansion.interval_minutes === 30 &&
      personnel.expansion.target_entity === "interval_schedule",
  }
}

export async function getProductionMvpContracts(): Promise<ProductionMvpContracts> {
  const [masterData, personnelSchedule, fulfillmentComparison] = await Promise.all([
    fetchJson<MasterDataImportContract>("/api/v1/master-data/import-contract"),
    fetchJson<PersonnelScheduleImportContract>(
      "/api/v1/personnel-schedules/import-contract"
    ),
    fetchJson<FulfillmentComparisonContract>(
      "/api/v1/fulfillment-comparison/contract"
    ),
  ])

  return {
    masterData: masterData ?? fallbackProductionMvpContracts.masterData,
    personnelSchedule:
      personnelSchedule ?? fallbackProductionMvpContracts.personnelSchedule,
    fulfillmentComparison:
      fulfillmentComparison ?? fallbackProductionMvpContracts.fulfillmentComparison,
    deferredCapabilities,
  }
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

function masterEntity(
  entity: string,
  primaryKey: string[],
  fields: string[],
  requiredFields: string[],
  foreignKeys: string[],
  validationRules: string[]
): MasterDataEntityContract {
  return {
    entity,
    primary_key: primaryKey,
    fields,
    required_fields: requiredFields,
    foreign_keys: foreignKeys,
    validation_rules: validationRules,
  }
}

function sourceContract(
  source: string,
  grain: string,
  fields: string[]
): ComparisonSourceContract {
  return {
    source,
    grain,
    fields,
    required_fields: fields.slice(0, Math.min(fields.length, 8)),
  }
}

function anomalyRule(
  code: string,
  compares: string[],
  condition: string,
  reviewOwner: string
): AnomalyRuleContract {
  return {
    code,
    compares,
    condition,
    review_owner: reviewOwner,
  }
}
