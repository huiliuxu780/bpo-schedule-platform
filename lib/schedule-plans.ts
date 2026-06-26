import type { UnavailabilityRow } from "./unavailability"

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

export type ScheduleRiskStatus = "open" | "confirmed" | "resolved"

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
  risk_status: ScheduleRiskStatus
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

export type DataSourceResult<T> = {
  items: T[]
  source: "api" | "api_empty" | "fallback"
  failed: boolean
  message: string
}

export type DetailDataSourceResult<T> = {
  item: T | null
  source: "api" | "fallback" | "missing"
  failed: boolean
  message: string
}

type FetchJsonResult<T> =
  | {
      ok: true
      data: T
      status: number
    }
  | {
      ok: false
      data: null
      status: number | null
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

function intervalsOverlap(
  intervalStart: string,
  intervalEnd: string,
  unavailableStart: string,
  unavailableEnd: string
) {
  return intervalStart < unavailableEnd && unavailableStart < intervalEnd
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

async function fetchJsonResult<T>(path: string): Promise<FetchJsonResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return { ok: false, data: null, status: response.status }
    }

    return {
      ok: true,
      data: (await response.json()) as T,
      status: response.status,
    }
  } catch {
    return { ok: false, data: null, status: null }
  }
}

async function writeJson<T>(
  path: string,
  method: "POST" | "PUT",
  payload?: unknown
): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    if (payload !== undefined) {
      headers["Content-Type"] = "application/json"
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      cache: "no-store",
      headers,
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
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

export async function getSchedulePlanResult(
  planId: string
): Promise<DetailDataSourceResult<SchedulePlanDetail>> {
  const response = await fetchJsonResult<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${planId}`
  )

  if (response.ok) {
    return {
      item: response.data,
      source: "api",
      failed: false,
      message: "详情数据来自当前本地排班计划。",
    }
  }

  if (response.status === 404) {
    return {
      item: null,
      source: "missing",
      failed: false,
      message: "未找到该排班计划",
    }
  }

  const fallback = fallbackPlans.find((plan) => plan.summary.id === planId) ?? null

  if (fallback) {
    return {
      item: fallback,
      source: "fallback",
      failed: true,
      message: "API 请求失败，已使用本地兜底数据，请确认后端服务状态后再用于验收判断。",
    }
  }

  return {
    item: null,
    source: "missing",
    failed: true,
    message: "排班计划读取失败，且本地兜底数据中没有该计划。",
  }
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

export async function getScheduleRisk(
  riskId: string
): Promise<ScheduleRiskRow | null> {
  const risks = await getScheduleRisks()

  return risks.find((risk) => risk.risk_id === riskId) ?? null
}

export async function getSchedulePlansResult(
  filters: SchedulePlanListFilters = {}
): Promise<DataSourceResult<SchedulePlanSummary>> {
  const searchParams = new URLSearchParams()
  const hasFilters = Boolean(filters.query?.trim() || filters.status)

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

  if (response === null) {
    const fallbackItems = filterFallbackPlans(
      fallbackPlans.map((plan) => plan.summary),
      filters
    )
    return {
      items: fallbackItems,
      source: "fallback",
      failed: true,
      message: "API 请求失败，已使用本地兜底数据，请确认后端服务状态后再用于验收判断。",
    }
  }

  if (response.items.length === 0) {
    return {
      items: [],
      source: "api_empty",
      failed: false,
      message: hasFilters
        ? "当前筛选没有匹配的排班计划。"
        : "当前暂无本地排班计划数据。",
    }
  }

  return {
    items: response.items,
    source: "api",
    failed: false,
    message: "数据来自当前本地排班计划。",
  }
}

export async function getScheduleRisksResult(
  query = ""
): Promise<DataSourceResult<ScheduleRiskRow>> {
  const searchParams = new URLSearchParams()
  const hasQuery = Boolean(query.trim())

  if (hasQuery) {
    searchParams.set("query", query.trim())
  }

  const path = `/api/v1/schedule-risks${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`

  const response = await fetchJson<ScheduleRiskListResponse>(path)

  if (response === null) {
    const fallbackItems = filterFallbackScheduleRisks(fallbackScheduleRisks, query)
    return {
      items: fallbackItems,
      source: "fallback",
      failed: true,
      message: "API 请求失败，已使用本地示例数据",
    }
  }

  if (response.items.length === 0) {
    return {
      items: [],
      source: "api_empty",
      failed: false,
      message: hasQuery
        ? "当前筛选没有匹配的履约风险。"
        : "当前暂无履约风险数据。",
    }
  }

  return {
    items: response.items,
    source: "api",
    failed: false,
    message: "数据来自后端 API",
  }
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

export async function submitSchedulePlanForReview(
  planId: string
): Promise<SchedulePlanDetail | null> {
  return writeJson<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${planId}/submit-review`,
    "POST"
  )
}

export async function publishSchedulePlan(
  planId: string
): Promise<SchedulePlanDetail | null> {
  return writeJson<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${planId}/publish`,
    "POST"
  )
}

export async function confirmScheduleRisk(
  riskId: string
): Promise<ScheduleRiskRow | null> {
  return writeJson<ScheduleRiskRow>(
    `/api/v1/schedule-risks/${encodeURIComponent(riskId)}/confirm`,
    "POST"
  )
}

export async function resolveScheduleRisk(
  riskId: string
): Promise<ScheduleRiskRow | null> {
  return writeJson<ScheduleRiskRow>(
    `/api/v1/schedule-risks/${encodeURIComponent(riskId)}/resolve`,
    "POST"
  )
}

export type SchedulePlanLifecycleActionKey = "submit_review" | "publish"

export type SchedulePlanLifecycleFeedbackKey =
  | "submit_review_success"
  | "submit_review_failed"
  | "publish_success"
  | "publish_failed"

export type SchedulePlanLifecycleAction = {
  key: SchedulePlanLifecycleActionKey
  label: string
  nextStatus: SchedulePlanStatus
}

export type SchedulePlanLifecycleFeedback = {
  tone: "success" | "error"
  title: string
  description: string
}

export type ScheduleRiskActionKey = "confirm" | "resolve"

export type ScheduleRiskActionFeedbackKey =
  | "confirm_success"
  | "confirm_failed"
  | "resolve_success"
  | "resolve_failed"

export type ScheduleRiskAction = {
  key: ScheduleRiskActionKey
  label: string
}

export type ScheduleRiskActionFeedback = {
  tone: "success" | "error"
  title: string
  description: string
}

export type SchedulePlanFulfillmentIssueSummary = {
  riskTotal: number
  riskOpen: number
  riskConfirmed: number
  riskResolved: number
  unavailabilityActive: number
  unavailabilityResolved: number
}

export type ScheduleRiskPreview = {
  risk_id: string
  interval_start: string
  interval_end: string
  risk_level: ScheduleRiskLevel
  risk_status: ScheduleRiskStatus
  gap_agents: number
  reason: string
  recommendation: string
}

export type UnavailabilityPreview = {
  unavailability_id: string
  staff_name: string
  team_name: string
  start_time: string
  end_time: string
  status: "active" | "resolved"
  reason: string
  note: string
}

export type SchedulePlanFulfillmentPreview = {
  riskPreviews: ScheduleRiskPreview[]
  unavailabilityPreviews: UnavailabilityPreview[]
  remainingRisks: number
  remainingUnavailability: number
}

export function getScheduleRiskActions(
  riskStatus: ScheduleRiskStatus
): ScheduleRiskAction[] {
  if (riskStatus === "open") {
    return [
      { key: "confirm", label: "确认风险" },
      { key: "resolve", label: "标记已处理" },
    ]
  }

  if (riskStatus === "confirmed") {
    return [{ key: "resolve", label: "标记已处理" }]
  }

  return []
}

export function summarizeScheduleRiskActionFeedback(
  value?: string | null
): ScheduleRiskActionFeedback | null {
  if (!value) {
    return null
  }

  const feedbackMap: Record<ScheduleRiskActionFeedbackKey, ScheduleRiskActionFeedback> = {
    confirm_success: {
      tone: "success",
      title: "已确认风险",
      description: "风险已记录为已确认，后续可继续标记处理完成。",
    },
    confirm_failed: {
      tone: "error",
      title: "确认风险失败",
      description: "当前风险状态暂不允许确认，请刷新后重试。",
    },
    resolve_success: {
      tone: "success",
      title: "已处理风险",
      description: "风险处理状态已更新，排班缺口不会自动重算。",
    },
    resolve_failed: {
      tone: "error",
      title: "处理风险失败",
      description: "当前风险状态暂不允许标记处理，请刷新后重试。",
    },
  }

  return feedbackMap[value as ScheduleRiskActionFeedbackKey] ?? null
}

export function summarizeSchedulePlanFulfillmentIssues(
  plan: SchedulePlanDetail,
  risks: ScheduleRiskRow[],
  unavailabilityRows: UnavailabilityRow[]
): SchedulePlanFulfillmentIssueSummary {
  const relatedRisks = risks.filter((risk) => risk.plan_id === plan.summary.id)
  const relatedUnavailability = unavailabilityRows.filter(
    (row) =>
      row.project_name === plan.summary.project_name &&
      row.site_name === plan.summary.site_name &&
      row.unavailable_date === plan.summary.plan_date &&
      plan.intervals.some((intervalItem) =>
        intervalsOverlap(
          intervalItem.interval_start,
          intervalItem.interval_end,
          row.start_time,
          row.end_time
        )
      )
  )

  return {
    riskTotal: relatedRisks.length,
    riskOpen: relatedRisks.filter((risk) => risk.risk_status === "open").length,
    riskConfirmed: relatedRisks.filter((risk) => risk.risk_status === "confirmed").length,
    riskResolved: relatedRisks.filter((risk) => risk.risk_status === "resolved").length,
    unavailabilityActive: relatedUnavailability.filter((row) => row.status === "active").length,
    unavailabilityResolved: relatedUnavailability.filter((row) => row.status === "resolved").length,
  }
}

const MAX_PREVIEW_ITEMS = 3

const riskStatusOrder: Record<ScheduleRiskStatus, number> = {
  open: 0,
  confirmed: 1,
  resolved: 2,
}

const riskLevelOrder: Record<ScheduleRiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export function buildSchedulePlanFulfillmentPreview(
  plan: SchedulePlanDetail,
  risks: ScheduleRiskRow[],
  unavailabilityRows: UnavailabilityRow[]
): SchedulePlanFulfillmentPreview {
  const relatedRisks = risks.filter((risk) => risk.plan_id === plan.summary.id)

  const relatedUnavailability = unavailabilityRows.filter(
    (row) =>
      row.project_name === plan.summary.project_name &&
      row.site_name === plan.summary.site_name &&
      row.unavailable_date === plan.summary.plan_date &&
      plan.intervals.some((intervalItem) =>
        intervalsOverlap(
          intervalItem.interval_start,
          intervalItem.interval_end,
          row.start_time,
          row.end_time
        )
      )
  )

  const sortedRisks = [...relatedRisks].sort((a, b) => {
    const statusDiff = riskStatusOrder[a.risk_status] - riskStatusOrder[b.risk_status]
    if (statusDiff !== 0) return statusDiff

    const levelDiff = riskLevelOrder[a.risk_level] - riskLevelOrder[b.risk_level]
    if (levelDiff !== 0) return levelDiff

    return a.interval_start.localeCompare(b.interval_start)
  })

  const sortedUnavailability = [...relatedUnavailability].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "active" ? -1 : 1
    }
    return a.start_time.localeCompare(b.start_time)
  })

  const riskPreviews: ScheduleRiskPreview[] = sortedRisks
    .slice(0, MAX_PREVIEW_ITEMS)
    .map((risk) => ({
      risk_id: risk.risk_id,
      interval_start: risk.interval_start,
      interval_end: risk.interval_end,
      risk_level: risk.risk_level,
      risk_status: risk.risk_status,
      gap_agents: risk.gap_agents,
      reason: risk.reason,
      recommendation: risk.recommendation,
    }))

  const unavailabilityPreviews: UnavailabilityPreview[] = sortedUnavailability
    .slice(0, MAX_PREVIEW_ITEMS)
    .map((row) => ({
      unavailability_id: row.unavailability_id,
      staff_name: row.staff_name,
      team_name: row.team_name,
      start_time: row.start_time,
      end_time: row.end_time,
      status: row.status,
      reason: row.reason,
      note: row.note,
    }))

  return {
    riskPreviews,
    unavailabilityPreviews,
    remainingRisks: Math.max(relatedRisks.length - MAX_PREVIEW_ITEMS, 0),
    remainingUnavailability: Math.max(
      relatedUnavailability.length - MAX_PREVIEW_ITEMS,
      0
    ),
  }
}

export function getSchedulePlanLifecycleAction(
  status: SchedulePlanStatus
): SchedulePlanLifecycleAction | null {
  if (status === "draft") {
    return {
      key: "submit_review",
      label: "提交复核",
      nextStatus: "review_ready",
    }
  }

  if (status === "review_ready") {
    return {
      key: "publish",
      label: "发布计划",
      nextStatus: "published",
    }
  }

  return null
}

export function summarizeSchedulePlanLifecycleFeedback(
  value?: string | null
): SchedulePlanLifecycleFeedback | null {
  if (!value) {
    return null
  }

  const feedbackMap: Record<SchedulePlanLifecycleFeedbackKey, SchedulePlanLifecycleFeedback> = {
    submit_review_success: {
      tone: "success",
      title: "已提交复核",
      description: "排班计划已进入待复核状态。",
    },
    submit_review_failed: {
      tone: "error",
      title: "提交复核失败",
      description: "当前排班计划状态暂不允许提交复核，请刷新后重试。",
    },
    publish_success: {
      tone: "success",
      title: "已发布计划",
      description: "排班计划已发布，可作为履约执行基线。",
    },
    publish_failed: {
      tone: "error",
      title: "发布计划失败",
      description: "当前排班计划状态暂不允许发布，请刷新后重试。",
    },
  }

  return feedbackMap[value as SchedulePlanLifecycleFeedbackKey] ?? null
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

export function scheduleRiskStatusLabel(status: ScheduleRiskStatus) {
  const labels: Record<ScheduleRiskStatus, string> = {
    open: "待处理",
    confirmed: "已确认",
    resolved: "已处理",
  }

  return labels[status]
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
    risk_status: "open",
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
    risk_status: "open",
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
    risk_status: "open",
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
      source: "预测需求",
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
