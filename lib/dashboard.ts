import type { Anomaly } from "../app/dashboard/data"
import type {
  SchedulePlanSummary,
  ScheduleRiskRow,
  ShiftDetailRow,
} from "./schedule-plans"
import type { UnavailabilityRow } from "./unavailability"

export type DashboardMetricCard = {
  title: string
  value: string
  change?: string
  insight?: string
  note?: string
  drilldown?: DashboardDrilldownLink
}

export type DashboardDrilldownLink = {
  label: string
  href: string
}

export type DashboardHeatmapRow = {
  day: string
  slots: number[]
}

export type DashboardHeatmapSlot = string

export type DashboardViewModel = {
  metricCards: DashboardMetricCard[]
  heatmapRows: DashboardHeatmapRow[]
  heatmapSlots: DashboardHeatmapSlot[]
  anomalies: Anomaly[]
}

export type DashboardDataSourceKind = "api" | "api_empty" | "fallback" | "mixed"

export type DashboardDataSourceState = {
  plans: "api" | "api_empty" | "fallback"
  risks: "api" | "api_empty" | "fallback"
  unavailability: "api" | "api_empty" | "fallback"
  hasAnyFailure: boolean
  hasAnyFallback: boolean
  hasAnyEmpty: boolean
}

export type DashboardReadinessSummary = {
  overallSource: DashboardDataSourceKind
  message: string
  hasData: boolean
  hasFilteredData: boolean
  isFilteredEmpty: boolean
  isSourceEmpty: boolean
  sourceStates: DashboardDataSourceState
}

export type DashboardOperationalViewModel = DashboardViewModel & {
  readiness: DashboardReadinessSummary
  filters: DashboardOperationalFilters
  hasActiveFilters: boolean
  heatmapDrilldown: DashboardDrilldownLink
}

/**
 * Build dashboard metric cards from schedule plans, risks, and unavailability data.
 */
export function buildDashboardMetricCards(
  plans: SchedulePlanSummary[],
  risks: ScheduleRiskRow[],
  unavailability: UnavailabilityRow[]
): DashboardMetricCard[] {
  const totalPlans = plans.length
  const publishedPlans = plans.filter((p) => p.status === "published").length

  // Calculate coverage rate from all plans
  const totalForecast = plans.reduce((sum, p) => sum + p.forecast_agents, 0)
  const totalScheduled = plans.reduce((sum, p) => sum + p.scheduled_agents, 0)
  const coverageRate = totalForecast > 0 ? totalScheduled / totalForecast : 0
  const coveragePercent = Math.round(coverageRate * 100)

  // Count open risks (status = "open")
  const openRisks = risks.filter((r) => r.risk_status === "open").length

  // Count active unavailability (status = "active")
  const activeUnavailability = unavailability.filter((u) => u.status === "active").length

  return [
    {
      title: "排班计划总数",
      value: `${totalPlans}`,
      insight: `${publishedPlans} 个已发布`,
      note: "包含草稿、待复核和已发布",
    },
    {
      title: "平均覆盖率",
      value: `${coveragePercent}%`,
      insight: coveragePercent >= 90 ? "覆盖率良好" : "覆盖率需要关注",
      note: "基于所有计划的预测和已排人数",
    },
    {
      title: "待处理风险",
      value: `${openRisks}`,
      insight: openRisks > 0 ? "需要优先复核" : "暂无待处理风险",
      note: "状态为待处理的风险项",
    },
    {
      title: "生效不可用",
      value: `${activeUnavailability}`,
      insight: activeUnavailability > 0 ? "影响当前排班" : "暂无生效不可用",
      note: "状态为生效中的不可用记录",
    },
  ]
}

/**
 * Build dashboard heatmap data from schedule plan summaries.
 * Groups plans by date and shows gap trends.
 */
export function buildDashboardHeatmap(
  plans: SchedulePlanSummary[],
  shiftDetails: ShiftDetailRow[] = []
): {
  rows: DashboardHeatmapRow[]
  slots: DashboardHeatmapSlot[]
} {
  if (plans.length === 0 && shiftDetails.length === 0) {
    return { rows: [], slots: [] }
  }

  if (shiftDetails.length > 0) {
    const slots = Array.from(
      new Set(shiftDetails.map((row) => row.interval_start))
    ).sort()
    const slotIndex = new Map(slots.map((slot, index) => [slot, index]))
    const rowsByDate = new Map<string, number[]>()

    for (const row of shiftDetails) {
      const values = rowsByDate.get(row.plan_date) ?? Array(slots.length).fill(0)
      const index = slotIndex.get(row.interval_start)

      if (index !== undefined) {
        values[index] += -row.gap_agents
      }

      rowsByDate.set(row.plan_date, values)
    }

    return {
      rows: Array.from(rowsByDate.entries())
        .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
        .map(([date, values]) => ({
          day: formatDateLabel(date),
          slots: values,
        })),
      slots,
    }
  }

  const plansByDate = new Map<string, SchedulePlanSummary[]>()
  for (const plan of plans) {
    const existing = plansByDate.get(plan.plan_date) ?? []
    existing.push(plan)
    plansByDate.set(plan.plan_date, existing)
  }

  const sortedDates = Array.from(plansByDate.keys()).sort()

  const rows: DashboardHeatmapRow[] = sortedDates.map((date) => {
    const dayPlans = plansByDate.get(date) ?? []
    const totalGap = dayPlans.reduce((sum, p) => sum + p.gap_agents, 0)

    return {
      day: formatDateLabel(date),
      slots: [-totalGap],
    }
  })

  const slots: DashboardHeatmapSlot[] = ["全天"]

  return { rows, slots }
}

function formatDateLabel(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${month}-${day}`
  } catch {
    return isoDate
  }
}

/**
 * Build dashboard anomalies from high-risk items, active unavailability, and plans with gaps.
 */
export function buildDashboardAnomalies(
  plans: SchedulePlanSummary[],
  risks: ScheduleRiskRow[],
  unavailability: UnavailabilityRow[]
): Anomaly[] {
  const anomalies: Anomaly[] = []
  let counter = 1

  // Add high-risk open schedule risks
  for (const risk of risks) {
    if (risk.risk_status === "open" && risk.risk_level === "high") {
      anomalies.push({
        id: `ANM-${String(counter++).padStart(3, "0")}`,
        type: "排班风险",
        project: risk.project_name,
        team: risk.site_name,
        shiftTime: `${risk.plan_date} ${risk.interval_start}-${risk.interval_end}`,
        headcount: risk.gap_agents,
        impactedHours: `${risk.gap_agents * 0.5}h`,
        severity: "高",
        status: "待复核",
        downstreamEntry: {
          type: "schedule_risk",
          id: risk.risk_id,
        },
      })
    }
  }

  // Add active unavailability
  for (const unavail of unavailability) {
    if (unavail.status === "active") {
      anomalies.push({
        id: `ANM-${String(counter++).padStart(3, "0")}`,
        type: "不可用记录",
        project: unavail.project_name,
        team: unavail.team_name,
        shiftTime: `${unavail.unavailable_date} ${unavail.start_time}-${unavail.end_time}`,
        headcount: unavail.affected_intervals,
        impactedHours: `${unavail.affected_intervals * 0.5}h`,
        severity: "中",
        status: "待复核",
        downstreamEntry: {
          type: "unavailability",
          id: unavail.unavailability_id,
        },
      })
    }
  }

  // Add plans with significant gaps (gap_agents > 2)
  for (const plan of plans) {
    if (plan.gap_agents > 2) {
      anomalies.push({
        id: `ANM-${String(counter++).padStart(3, "0")}`,
        type: "排班缺口",
        project: plan.project_name,
        team: plan.site_name,
        shiftTime: `${plan.plan_date} ${plan.version}`,
        headcount: plan.gap_agents,
        impactedHours: `${plan.gap_agents * 0.5}h`,
        severity: plan.gap_agents >= 5 ? "高" : "中",
        status: plan.status === "published" ? "已确认" : "待复核",
        downstreamEntry: {
          type: "schedule_plan",
          id: plan.id,
        },
      })
    }
  }

  return anomalies
}

/**
 * Build complete dashboard view model from all data sources.
 */
export function buildDashboardViewModel(
  plans: SchedulePlanSummary[],
  risks: ScheduleRiskRow[],
  unavailability: UnavailabilityRow[],
  shiftDetails: ShiftDetailRow[] = []
): DashboardViewModel {
  const heatmap = buildDashboardHeatmap(plans, shiftDetails)

  return {
    metricCards: buildDashboardMetricCards(plans, risks, unavailability),
    heatmapRows: heatmap.rows,
    heatmapSlots: heatmap.slots,
    anomalies: buildDashboardAnomalies(plans, risks, unavailability),
  }
}

export type DataSourceInfo = {
  source: "api" | "api_empty" | "fallback"
  failed: boolean
}

export type DashboardOperationalFilters = {
  site?: string
  project?: string
  planStatus?: string
}

export function parseDashboardFilters(searchParams: Record<string, string | string[] | undefined>): DashboardOperationalFilters {
  const filters: DashboardOperationalFilters = {}

  if (typeof searchParams.site === "string" && searchParams.site.trim()) {
    filters.site = searchParams.site.trim()
  }
  if (typeof searchParams.project === "string" && searchParams.project.trim()) {
    filters.project = searchParams.project.trim()
  }
  if (typeof searchParams.planStatus === "string" && searchParams.planStatus.trim()) {
    filters.planStatus = searchParams.planStatus.trim()
  }

  return filters
}

export function hasActiveFilters(filters: DashboardOperationalFilters): boolean {
  return Boolean(
    filters.site ||
    filters.project ||
    filters.planStatus
  )
}

function dashboardCompatibleQuery(filters: DashboardOperationalFilters) {
  return [filters.project, filters.site].filter(Boolean).join(" ").trim()
}

function appendSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: string | undefined
) {
  if (value?.trim()) {
    searchParams.set(key, value.trim())
  }
}

function buildDashboardHref(
  pathname: string,
  entries: Record<string, string | undefined>
) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(entries)) {
    appendSearchParam(searchParams, key, value)
  }

  const suffix = searchParams.toString()
  return `${pathname}${suffix ? `?${suffix}` : ""}`
}

export function buildDashboardDrilldownLinks(
  filters: DashboardOperationalFilters
) {
  const query = dashboardCompatibleQuery(filters)

  return {
    schedulePlans: buildDashboardHref("/schedule-plans", {
      query,
      status: filters.planStatus,
    }),
    shiftDetails: buildDashboardHref("/shift-details", {
      query,
      status: filters.planStatus,
    }),
    scheduleRisks: buildDashboardHref("/schedule-risks", {
      query,
      status: "open",
    }),
    unavailability: buildDashboardHref("/unavailability", {
      query,
      status: "active",
    }),
  }
}

function attachDashboardMetricDrilldowns(
  cards: DashboardMetricCard[],
  filters: DashboardOperationalFilters
) {
  const links = buildDashboardDrilldownLinks(filters)
  const linkByTitle: Record<string, DashboardDrilldownLink> = {
    排班计划总数: {
      label: "查看计划",
      href: links.schedulePlans,
    },
    平均覆盖率: {
      label: "查看班次",
      href: links.shiftDetails,
    },
    待处理风险: {
      label: "查看风险",
      href: links.scheduleRisks,
    },
    生效不可用: {
      label: "查看不可用",
      href: links.unavailability,
    },
  }

  return cards.map((card) => ({
    ...card,
    drilldown: linkByTitle[card.title],
  }))
}

function filterPlans(plans: SchedulePlanSummary[], filters: DashboardOperationalFilters): SchedulePlanSummary[] {
  return plans.filter((plan) => {
    if (filters.site && !plan.site_name.includes(filters.site)) return false
    if (filters.project && !plan.project_name.includes(filters.project)) return false
    if (filters.planStatus && plan.status !== filters.planStatus) return false
    return true
  })
}

function filterRisks(
  risks: ScheduleRiskRow[],
  filters: DashboardOperationalFilters,
  filteredPlanIds?: Set<string>
): ScheduleRiskRow[] {
  return risks.filter((risk) => {
    if (filters.site && !risk.site_name.includes(filters.site)) return false
    if (filters.project && !risk.project_name.includes(filters.project)) return false
    if (filteredPlanIds && !filteredPlanIds.has(risk.plan_id)) return false
    return true
  })
}

function filterUnavailability(
  unavailability: UnavailabilityRow[],
  filters: DashboardOperationalFilters,
  filteredPlanContexts?: Set<string>
): UnavailabilityRow[] {
  return unavailability.filter((unavail) => {
    if (filters.site && !unavail.site_name.includes(filters.site)) return false
    if (filters.project && !unavail.project_name.includes(filters.project)) return false
    if (
      filteredPlanContexts &&
      !filteredPlanContexts.has(
        planContextKey({
          project_name: unavail.project_name,
          site_name: unavail.site_name,
          plan_date: unavail.unavailable_date,
        })
      )
    ) {
      return false
    }
    return true
  })
}

function filterShiftDetails(
  shiftDetails: ShiftDetailRow[],
  filters: DashboardOperationalFilters,
  filteredPlanIds?: Set<string>
): ShiftDetailRow[] {
  return shiftDetails.filter((row) => {
    if (filters.site && !row.site_name.includes(filters.site)) return false
    if (filters.project && !row.project_name.includes(filters.project)) return false
    if (filters.planStatus && row.status !== filters.planStatus) return false
    if (filteredPlanIds && !filteredPlanIds.has(row.plan_id)) return false
    return true
  })
}

function planContextKey(context: {
  project_name: string
  site_name: string
  plan_date: string
}) {
  return `${context.project_name}::${context.site_name}::${context.plan_date}`
}

export type DashboardOperationalInput = {
  plans: SchedulePlanSummary[]
  risks: ScheduleRiskRow[]
  unavailability: UnavailabilityRow[]
  shiftDetails?: ShiftDetailRow[]
  plansSource: DataSourceInfo
  risksSource: DataSourceInfo
  unavailabilitySource: DataSourceInfo
  filters?: DashboardOperationalFilters
}

export function buildDashboardOperationalViewModel(
  input: DashboardOperationalInput
): DashboardOperationalViewModel {
  const {
    plans,
    risks,
    unavailability,
    shiftDetails = [],
    plansSource,
    risksSource,
    unavailabilitySource,
    filters = {},
  } = input

  // Apply filters to data
  const filteredPlans = filterPlans(plans, filters)
  const filteredPlanIds = filters.planStatus
    ? new Set(filteredPlans.map((plan) => plan.id))
    : undefined
  const filteredPlanContexts = filters.planStatus
    ? new Set(filteredPlans.map((plan) => planContextKey(plan)))
    : undefined
  const filteredRisks = filterRisks(risks, filters, filteredPlanIds)
  const filteredUnavailability = filterUnavailability(
    unavailability,
    filters,
    filteredPlanContexts
  )
  const filteredShiftDetails = filterShiftDetails(
    shiftDetails,
    filters,
    filteredPlanIds
  )

  const baseViewModel = buildDashboardViewModel(
    filteredPlans,
    filteredRisks,
    filteredUnavailability,
    filteredShiftDetails
  )
  const drilldownLinks = buildDashboardDrilldownLinks(filters)

  const hasAnyFailure = plansSource.failed || risksSource.failed || unavailabilitySource.failed
  const hasAnyFallback =
    plansSource.source === "fallback" ||
    risksSource.source === "fallback" ||
    unavailabilitySource.source === "fallback"
  const hasAnyEmpty =
    plansSource.source === "api_empty" ||
    risksSource.source === "api_empty" ||
    unavailabilitySource.source === "api_empty"

  const sourceStates: DashboardDataSourceState = {
    plans: plansSource.source,
    risks: risksSource.source,
    unavailability: unavailabilitySource.source,
    hasAnyFailure,
    hasAnyFallback,
    hasAnyEmpty,
  }

  // Determine overall source
  let overallSource: DashboardDataSourceKind
  if (hasAnyFallback) {
    const hasAnyApi =
      plansSource.source === "api" ||
      risksSource.source === "api" ||
      unavailabilitySource.source === "api"
    overallSource = hasAnyApi ? "mixed" : "fallback"
  } else if (hasAnyEmpty && !hasAnyFallback) {
    const allEmpty =
      plansSource.source === "api_empty" &&
      risksSource.source === "api_empty" &&
      unavailabilitySource.source === "api_empty"
    overallSource = allEmpty ? "api_empty" : "mixed"
  } else {
    overallSource = "api"
  }

  const hasData = plans.length > 0 || risks.length > 0 || unavailability.length > 0
  const hasFilteredData = filteredPlans.length > 0 || filteredRisks.length > 0 || filteredUnavailability.length > 0
  const activeFilters = hasActiveFilters(filters)
  const isSourceEmpty = !hasData
  const isFilteredEmpty = hasData && !hasFilteredData && activeFilters

  let message: string
  if (isFilteredEmpty) {
    message = "当前筛选条件下暂无数据，请调整筛选条件或查看全部数据。"
  } else if (overallSource === "fallback" || (overallSource === "mixed" && hasAnyFallback)) {
    message = "部分经营总览暂时无法更新，已显示示例数据。"
  } else if (overallSource === "api_empty") {
    message = "当前暂无经营数据，请先创建排班计划、风险或不可用记录。"
  } else if (overallSource === "mixed") {
    message = "当前经营数据不完整，请确认排班计划、风险和不可用记录是否齐全。"
  } else {
    message = "经营总览已更新。"
  }

  const readiness: DashboardReadinessSummary = {
    overallSource,
    message,
    hasData,
    hasFilteredData,
    isFilteredEmpty,
    isSourceEmpty,
    sourceStates,
  }

  return {
    ...baseViewModel,
    metricCards: attachDashboardMetricDrilldowns(
      baseViewModel.metricCards,
      filters
    ),
    readiness,
    filters,
    hasActiveFilters: activeFilters,
    heatmapDrilldown: {
      label: "查看班次明细",
      href: drilldownLinks.shiftDetails,
    },
  }
}
