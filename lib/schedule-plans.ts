export type SchedulePlanStatus = "draft" | "review_ready" | "published"

export type SchedulePlanSummary = {
  id: string
  plan_date: string
  project_name: string
  site_name: string
  version: string
  status: SchedulePlanStatus
  forecast_agents: number
  scheduled_agents: number
  gap_agents: number
  coverage_rate: number
  updated_at: string
}

export type SchedulePlanInterval = {
  interval_start: string
  interval_end: string
  forecast_agents: number
  scheduled_agents: number
  gap_agents: number
  coverage_rate: number
  note: string
}

export type SchedulePlanDetail = {
  summary: SchedulePlanSummary
  intervals: SchedulePlanInterval[]
}

export type ShiftDetailRow = {
  plan_id: string
  plan_date: string
  project_name: string
  site_name: string
  version: string
  status: SchedulePlanStatus
  interval_start: string
  interval_end: string
  forecast_agents: number
  scheduled_agents: number
  gap_agents: number
  coverage_rate: number
  note: string
}

export type DemandPlanRow = {
  demand_id: string
  plan_date: string
  project_name: string
  site_name: string
  interval_start: string
  interval_end: string
  forecast_agents: number
  source: string
  status: "imported" | "mapped"
}

export type ScheduleRiskLevel = "high" | "medium" | "low"

export type ScheduleRiskRow = {
  risk_id: string
  plan_id: string
  plan_date: string
  project_name: string
  site_name: string
  interval_start: string
  interval_end: string
  risk_level: ScheduleRiskLevel
  gap_agents: number
  affected_unavailability: number
  reason: string
  recommendation: string
}

export type SchedulePlanIntervalInput = Pick<
  SchedulePlanInterval,
  | "interval_start"
  | "interval_end"
  | "forecast_agents"
  | "scheduled_agents"
  | "note"
>

export type SchedulePlanDraftPayload = {
  plan_date: string
  project_name: string
  site_name: string
  version: string
  intervals: SchedulePlanIntervalInput[]
}

type SchedulePlanListResponse = {
  items: SchedulePlanSummary[]
}

type ShiftDetailListResponse = {
  items: ShiftDetailRow[]
}

type DemandPlanListResponse = {
  items: DemandPlanRow[]
}

type ScheduleRiskListResponse = {
  items: ScheduleRiskRow[]
}

export type SchedulePlanListFilters = {
  query?: string
  status?: SchedulePlanStatus
}

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

const fallbackPlans: SchedulePlanDetail[] = [
  {
    summary: {
      id: "plan-20260511-shanghai-bosch-v1",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "上海职场",
      version: "v1",
      status: "review_ready",
      forecast_agents: 124,
      scheduled_agents: 121,
      gap_agents: 3,
      coverage_rate: 0.976,
      updated_at: "2026-05-11T09:30:00+08:00",
    },
    intervals: [
      interval("09:00", "09:30", 16, 15, "早高峰轻微缺口"),
      interval("09:30", "10:00", 18, 17, "预测需求上升"),
      interval("10:00", "10:30", 18, 18, "覆盖正常"),
      interval("10:30", "11:00", 17, 16, "需复核临时请假"),
      interval("11:00", "11:30", 16, 16, "覆盖正常"),
      interval("11:30", "12:00", 15, 14, "午前缺口"),
      interval("12:00", "12:30", 12, 12, "覆盖正常"),
      interval("12:30", "13:00", 12, 13, "冗余可调剂"),
    ],
  },
  {
    summary: {
      id: "plan-20260511-suzhou-bosch-v1",
      plan_date: "2026-05-11",
      project_name: "博西客服",
      site_name: "苏州职场",
      version: "v1",
      status: "draft",
      forecast_agents: 104,
      scheduled_agents: 99,
      gap_agents: 5,
      coverage_rate: 0.952,
      updated_at: "2026-05-11T08:45:00+08:00",
    },
    intervals: [
      interval("09:00", "09:30", 14, 13, "草稿待补齐"),
      interval("09:30", "10:00", 14, 14, "覆盖正常"),
      interval("10:00", "10:30", 15, 13, "培训占用导致缺口"),
      interval("10:30", "11:00", 15, 14, "需调剂"),
      interval("11:00", "11:30", 13, 13, "覆盖正常"),
      interval("11:30", "12:00", 13, 12, "午间缺口"),
      interval("12:00", "12:30", 10, 10, "覆盖正常"),
      interval("12:30", "13:00", 10, 10, "覆盖正常"),
    ],
  },
  {
    summary: {
      id: "plan-20260512-shanghai-bosch-v2",
      plan_date: "2026-05-12",
      project_name: "博西客服",
      site_name: "上海职场",
      version: "v2",
      status: "published",
      forecast_agents: 120,
      scheduled_agents: 119,
      gap_agents: 1,
      coverage_rate: 0.992,
      updated_at: "2026-05-11T18:20:00+08:00",
    },
    intervals: [
      interval("09:00", "09:30", 15, 15, "已发布"),
      interval("09:30", "10:00", 17, 17, "已发布"),
      interval("10:00", "10:30", 18, 18, "已发布"),
      interval("10:30", "11:00", 18, 17, "发布后仍有小缺口"),
      interval("11:00", "11:30", 16, 16, "已发布"),
      interval("11:30", "12:00", 14, 14, "已发布"),
      interval("12:00", "12:30", 11, 11, "已发布"),
      interval("12:30", "13:00", 11, 11, "已发布"),
    ],
  },
]

function interval(
  interval_start: string,
  interval_end: string,
  forecast_agents: number,
  scheduled_agents: number,
  note: string
): SchedulePlanInterval {
  const gap_agents = Math.max(forecast_agents - scheduled_agents, 0)
  return {
    interval_start,
    interval_end,
    forecast_agents,
    scheduled_agents,
    gap_agents,
    coverage_rate: coverageRate(scheduled_agents, forecast_agents),
    note,
  }
}

function coverageRate(scheduledAgents: number, forecastAgents: number) {
  if (forecastAgents === 0) {
    return 1
  }

  return Number((scheduledAgents / forecastAgents).toFixed(3))
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

async function writeJson<T>(
  path: string,
  method: "POST" | "PUT",
  payload: unknown
): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function getSchedulePlans(): Promise<SchedulePlanSummary[]> {
  return getSchedulePlansWithFilters()
}

export async function getSchedulePlansWithFilters(
  filters: SchedulePlanListFilters = {}
): Promise<SchedulePlanSummary[]> {
  const searchParams = new URLSearchParams()

  if (filters.query?.trim()) {
    searchParams.set("query", filters.query.trim())
  }

  if (filters.status) {
    searchParams.set("status", filters.status)
  }

  const path = `/api/v1/schedule-plans${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`
  const response = await fetchJson<SchedulePlanListResponse>(
    path
  )

  return (
    response?.items ??
    filterFallbackPlans(fallbackPlans.map((plan) => plan.summary), filters)
  )
}

export async function getSchedulePlan(
  planId: string
): Promise<SchedulePlanDetail | null> {
  const response = await fetchJson<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${planId}`
  )

  return response ?? fallbackPlans.find((plan) => plan.summary.id === planId) ?? null
}

export async function getShiftDetails(
  filters: SchedulePlanListFilters = {}
): Promise<ShiftDetailRow[]> {
  const searchParams = new URLSearchParams()

  if (filters.query?.trim()) {
    searchParams.set("query", filters.query.trim())
  }

  if (filters.status) {
    searchParams.set("status", filters.status)
  }

  const path = `/api/v1/shift-details${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`
  const response = await fetchJson<ShiftDetailListResponse>(path)

  return response?.items ?? filterFallbackShiftDetails(flattenFallbackShiftDetails(), filters)
}

export async function getDemandPlans(query = ""): Promise<DemandPlanRow[]> {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  const path = `/api/v1/demand-plans${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`
  const response = await fetchJson<DemandPlanListResponse>(path)

  return response?.items ?? filterFallbackDemandPlans(flattenFallbackDemandPlans(), query)
}

export async function getScheduleRisks(query = ""): Promise<ScheduleRiskRow[]> {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  const path = `/api/v1/schedule-risks${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`
  const response = await fetchJson<ScheduleRiskListResponse>(path)

  return response?.items ?? filterFallbackScheduleRisks(fallbackScheduleRisks, query)
}

export async function createSchedulePlanDraft(
  payload: SchedulePlanDraftPayload
): Promise<SchedulePlanDetail | null> {
  return writeJson<SchedulePlanDetail>(
    "/api/v1/schedule-plans/drafts",
    "POST",
    payload
  )
}

export async function updateSchedulePlanDraft(
  planId: string,
  payload: SchedulePlanDraftPayload
): Promise<SchedulePlanDetail | null> {
  return writeJson<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${planId}/draft`,
    "PUT",
    payload
  )
}

export function formatCoverageRate(value: number) {
  return `${Math.round(value * 1000) / 10}%`
}

export function schedulePlanStatusLabel(status: SchedulePlanStatus) {
  const labels: Record<SchedulePlanStatus, string> = {
    draft: "草稿",
    review_ready: "待复核",
    published: "已发布",
  }

  return labels[status]
}

export function scheduleRiskLevelLabel(level: ScheduleRiskLevel) {
  const labels: Record<ScheduleRiskLevel, string> = {
    high: "高风险",
    medium: "需关注",
    low: "提醒",
  }

  return labels[level]
}

const fallbackScheduleRisks: ScheduleRiskRow[] = [
  {
    risk_id: "risk-plan-20260511-suzhou-bosch-v1-10:00",
    plan_id: "plan-20260511-suzhou-bosch-v1",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "苏州职场",
    interval_start: "10:00",
    interval_end: "10:30",
    risk_level: "high",
    gap_agents: 2,
    affected_unavailability: 1,
    reason: "缺口 2 人，且存在 1 条生效中不可用记录",
    recommendation: "优先复核不可用记录，并从相邻冗余时段调剂",
  },
  {
    risk_id: "risk-plan-20260511-shanghai-bosch-v1-09:30",
    plan_id: "plan-20260511-shanghai-bosch-v1",
    plan_date: "2026-05-11",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "09:30",
    interval_end: "10:00",
    risk_level: "high",
    gap_agents: 1,
    affected_unavailability: 1,
    reason: "缺口 1 人，且存在 1 条生效中不可用记录",
    recommendation: "优先复核不可用记录，并从相邻冗余时段调剂",
  },
  {
    risk_id: "risk-plan-20260512-shanghai-bosch-v2-10:30",
    plan_id: "plan-20260512-shanghai-bosch-v2",
    plan_date: "2026-05-12",
    project_name: "博西客服",
    site_name: "上海职场",
    interval_start: "10:30",
    interval_end: "11:00",
    risk_level: "medium",
    gap_agents: 1,
    affected_unavailability: 0,
    reason: "排班缺口 1 人",
    recommendation: "检查草稿排班覆盖，必要时补班或跨团队调剂",
  },
]

function filterFallbackPlans(
  plans: SchedulePlanSummary[],
  filters: SchedulePlanListFilters
) {
  return plans.filter((plan) => {
    if (filters.status && plan.status !== filters.status) {
      return false
    }

    const normalizedQuery = filters.query?.trim().toLowerCase()
    if (!normalizedQuery) {
      return true
    }

    return [
      plan.id,
      plan.plan_date,
      plan.project_name,
      plan.site_name,
      plan.version,
      plan.status,
      schedulePlanStatusLabel(plan.status),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

function flattenFallbackShiftDetails(): ShiftDetailRow[] {
  return fallbackPlans.flatMap((plan) =>
    plan.intervals.map((intervalItem) => ({
      plan_id: plan.summary.id,
      plan_date: plan.summary.plan_date,
      project_name: plan.summary.project_name,
      site_name: plan.summary.site_name,
      version: plan.summary.version,
      status: plan.summary.status,
      interval_start: intervalItem.interval_start,
      interval_end: intervalItem.interval_end,
      forecast_agents: intervalItem.forecast_agents,
      scheduled_agents: intervalItem.scheduled_agents,
      gap_agents: intervalItem.gap_agents,
      coverage_rate: intervalItem.coverage_rate,
      note: intervalItem.note,
    }))
  )
}

function filterFallbackShiftDetails(
  rows: ShiftDetailRow[],
  filters: SchedulePlanListFilters
) {
  return rows.filter((row) => {
    if (filters.status && row.status !== filters.status) {
      return false
    }

    const normalizedQuery = filters.query?.trim().toLowerCase()
    if (!normalizedQuery) {
      return true
    }

    return [
      row.plan_id,
      row.plan_date,
      row.project_name,
      row.site_name,
      row.version,
      row.status,
      row.interval_start,
      row.interval_end,
      row.note,
      schedulePlanStatusLabel(row.status),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

function flattenFallbackDemandPlans(): DemandPlanRow[] {
  return fallbackPlans.flatMap((plan) =>
    plan.intervals.map((intervalItem) => ({
      demand_id: `demand-${plan.summary.plan_date}-${plan.summary.site_name}-${intervalItem.interval_start}`,
      plan_date: plan.summary.plan_date,
      project_name: plan.summary.project_name,
      site_name: plan.summary.site_name,
      interval_start: intervalItem.interval_start,
      interval_end: intervalItem.interval_end,
      forecast_agents: intervalItem.forecast_agents,
      source: "本地预测需求",
      status: "mapped" as const,
    }))
  )
}

function filterFallbackDemandPlans(rows: DemandPlanRow[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return rows
  }

  return rows.filter((row) =>
    [
      row.demand_id,
      row.plan_date,
      row.project_name,
      row.site_name,
      row.interval_start,
      row.interval_end,
      row.source,
      row.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  )
}

function filterFallbackScheduleRisks(rows: ScheduleRiskRow[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return rows
  }

  return rows.filter((row) =>
    [
      row.risk_id,
      row.plan_id,
      row.plan_date,
      row.project_name,
      row.site_name,
      row.interval_start,
      row.interval_end,
      row.risk_level,
      scheduleRiskLevelLabel(row.risk_level),
      row.reason,
      row.recommendation,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  )
}
