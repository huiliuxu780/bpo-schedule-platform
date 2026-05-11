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

type SchedulePlanListResponse = {
  items: SchedulePlanSummary[]
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

export async function getSchedulePlans(): Promise<SchedulePlanSummary[]> {
  const response = await fetchJson<SchedulePlanListResponse>(
    "/api/v1/schedule-plans"
  )

  return response?.items ?? fallbackPlans.map((plan) => plan.summary)
}

export async function getSchedulePlan(
  planId: string
): Promise<SchedulePlanDetail | null> {
  const response = await fetchJson<SchedulePlanDetail>(
    `/api/v1/schedule-plans/${planId}`
  )

  return response ?? fallbackPlans.find((plan) => plan.summary.id === planId) ?? null
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
