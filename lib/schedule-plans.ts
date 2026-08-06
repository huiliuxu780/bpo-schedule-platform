import { type ApiResult, formatApiErrorMessage } from "@/lib/api-result"

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
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_BPO_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000"

async function fetchJson<T>(path: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return {
        data: null,
        error: `请求失败（状态码 ${response.status}）`,
        notFound: response.status === 404,
      }
    }

    return {
      data: (await response.json()) as T,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: `后端服务不可用：${formatApiErrorMessage(error)}`,
    }
  }
}

async function writeJson<T>(
  path: string,
  method: "POST" | "PUT",
  payload: unknown
): Promise<ApiResult<T>> {
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
      return {
        data: null,
        error: `请求失败（状态码 ${response.status}）`,
      }
    }

    return {
      data: (await response.json()) as T,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: `后端服务不可用：${formatApiErrorMessage(error)}`,
    }
  }
}

function listItems<T>(result: ApiResult<{ items?: T[] }>): ApiResult<T[]> {
  if (result.error) {
    return { data: null, error: result.error }
  }

  const items = result.data?.items
  if (!Array.isArray(items)) {
    return { data: null, error: "响应格式异常：缺少 items 列表" }
  }

  return { data: items, error: null }
}

export async function getSchedulePlansWithFilters(
  filters: SchedulePlanListFilters = {}
): Promise<ApiResult<SchedulePlanSummary[]>> {
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
  const response = await fetchJson<SchedulePlanListResponse>(path)

  return listItems(response)
}

export async function getSchedulePlan(
  planId: string
): Promise<ApiResult<SchedulePlanDetail | null>> {
  const response = await fetchJson<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${encodeURIComponent(planId)}`
  )

  if (response.notFound) {
    return { data: null, error: null, notFound: true }
  }

  if (response.error) {
    return { data: null, error: response.error }
  }

  return { data: response.data ?? null, error: null }
}

export async function getShiftDetails(
  filters: SchedulePlanListFilters = {}
): Promise<ApiResult<ShiftDetailRow[]>> {
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

  return listItems(response)
}

export async function getDemandPlans(
  query = ""
): Promise<ApiResult<DemandPlanRow[]>> {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  const path = `/api/v1/demand-plans${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`
  const response = await fetchJson<DemandPlanListResponse>(path)

  return listItems(response)
}

export async function getScheduleRisks(
  query = ""
): Promise<ApiResult<ScheduleRiskRow[]>> {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  const path = `/api/v1/schedule-risks${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`
  const response = await fetchJson<ScheduleRiskListResponse>(path)

  return listItems(response)
}

export async function getScheduleRisk(
  riskId: string
): Promise<ApiResult<ScheduleRiskRow | null>> {
  const risks = await getScheduleRisks()

  if (risks.error) {
    return { data: null, error: risks.error }
  }

  return {
    data: (risks.data ?? []).find((risk) => risk.risk_id === riskId) ?? null,
    error: null,
  }
}

export async function createSchedulePlanDraft(
  payload: SchedulePlanDraftPayload
): Promise<ApiResult<SchedulePlanDetail>> {
  return writeJson<SchedulePlanDetail>(
    "/api/v1/schedule-plans/drafts",
    "POST",
    payload
  )
}

export async function updateSchedulePlanDraft(
  planId: string,
  payload: SchedulePlanDraftPayload
): Promise<ApiResult<SchedulePlanDetail>> {
  return writeJson<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${encodeURIComponent(planId)}/draft`,
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
