export type UnavailabilityStatus = "active" | "resolved"

export type UnavailabilityRow = {
  unavailability_id: string
  staff_name: string
  team_name: string
  project_name: string
  site_name: string
  unavailable_date: string
  start_time: string
  end_time: string
  reason: string
  status: UnavailabilityStatus
  affected_intervals: number
  note: string
}

export type UnavailabilityFilters = {
  query?: string
  status?: UnavailabilityStatus
}

type UnavailabilityListResponse = {
  items: UnavailabilityRow[]
}

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

const fallbackUnavailabilityRows: UnavailabilityRow[] = [
  {
    unavailability_id: "unavail-20260511-001",
    staff_name: "张敏",
    team_name: "一线客服 A 组",
    project_name: "博西客服",
    site_name: "上海职场",
    unavailable_date: "2026-05-11",
    start_time: "09:30",
    end_time: "10:30",
    reason: "临时请假",
    status: "active",
    affected_intervals: 2,
    note: "需补 2 个 0.5h 时段",
  },
  {
    unavailability_id: "unavail-20260511-002",
    staff_name: "李想",
    team_name: "一线客服 B 组",
    project_name: "博西客服",
    site_name: "苏州职场",
    unavailable_date: "2026-05-11",
    start_time: "10:00",
    end_time: "11:00",
    reason: "培训占用",
    status: "active",
    affected_intervals: 2,
    note: "影响午前覆盖率",
  },
  {
    unavailability_id: "unavail-20260512-001",
    staff_name: "王宁",
    team_name: "外包夜班组",
    project_name: "博西客服",
    site_name: "上海职场",
    unavailable_date: "2026-05-12",
    start_time: "12:00",
    end_time: "13:00",
    reason: "不可用申请",
    status: "resolved",
    affected_intervals: 2,
    note: "已调整排班",
  },
]

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

export async function getUnavailability(
  filters: UnavailabilityFilters = {}
): Promise<UnavailabilityRow[]> {
  const searchParams = new URLSearchParams()

  if (filters.query?.trim()) {
    searchParams.set("query", filters.query.trim())
  }

  if (filters.status) {
    searchParams.set("status", filters.status)
  }

  const path = `/api/v1/unavailability${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`
  const response = await fetchJson<UnavailabilityListResponse>(path)

  return (
    response?.items ?? filterFallbackUnavailability(fallbackUnavailabilityRows, filters)
  )
}

export type UnavailabilityDataSourceResult = {
  items: UnavailabilityRow[]
  source: "api" | "api_empty" | "fallback"
  failed: boolean
  message: string
}

export async function getUnavailabilityResult(
  filters: UnavailabilityFilters = {}
): Promise<UnavailabilityDataSourceResult> {
  const searchParams = new URLSearchParams()
  const hasFilters = Boolean(filters.query?.trim() || filters.status)

  if (filters.query?.trim()) {
    searchParams.set("query", filters.query.trim())
  }

  if (filters.status) {
    searchParams.set("status", filters.status)
  }

  const path = `/api/v1/unavailability${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ""
  }`

  const response = await fetchJson<UnavailabilityListResponse>(path)

  if (response === null) {
    const fallbackItems = filterFallbackUnavailability(
      fallbackUnavailabilityRows,
      filters
    )
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
      message: hasFilters
        ? "当前筛选没有匹配的不可用记录。"
        : "当前暂无不可用记录。",
    }
  }

  return {
    items: response.items,
    source: "api",
    failed: false,
    message: "数据来自后端 API",
  }
}

export async function getUnavailabilityRecord(
  unavailabilityId: string
): Promise<UnavailabilityRow | null> {
  const rows = await getUnavailability()

  return rows.find((row) => row.unavailability_id === unavailabilityId) ?? null
}

export type UnavailabilityDetailDataSourceResult = {
  item: UnavailabilityRow | null
  source: "api" | "fallback" | "missing"
  failed: boolean
  message: string
}

export async function getUnavailabilityRecordResult(
  unavailabilityId: string
): Promise<UnavailabilityDetailDataSourceResult> {
  const allResult = await getUnavailabilityResult()
  const item = allResult.items.find((row) => row.unavailability_id === unavailabilityId) ?? null

  if (item === null) {
    if (allResult.source === "fallback") {
      return {
        item: null,
        source: allResult.source,
        failed: true,
        message: "API 请求失败，已使用本地示例数据，但未找到该不可用记录。",
      }
    }

    return {
      item: null,
      source: "missing",
      failed: false,
      message: "未找到该不可用记录。",
    }
  }

  return {
    item,
    source: allResult.source === "api_empty" ? "api" : allResult.source,
    failed: allResult.failed,
    message: allResult.message,
  }
}

export async function resolveUnavailability(
  unavailabilityId: string
): Promise<UnavailabilityRow | null> {
  return writeJson<UnavailabilityRow>(
    `/api/v1/unavailability/${encodeURIComponent(unavailabilityId)}/resolve`,
    "POST"
  )
}

export type UnavailabilityActionKey = "resolve"

export type UnavailabilityActionFeedbackKey = "resolve_success" | "resolve_failed"

export type UnavailabilityAction = {
  key: UnavailabilityActionKey
  label: string
}

export type UnavailabilityActionFeedback = {
  tone: "success" | "error"
  title: string
  description: string
}

export function getUnavailabilityAction(
  status: UnavailabilityStatus
): UnavailabilityAction | null {
  if (status === "active") {
    return { key: "resolve", label: "标记已处理" }
  }

  return null
}

export function summarizeUnavailabilityActionFeedback(
  value?: string | null
): UnavailabilityActionFeedback | null {
  if (!value) {
    return null
  }

  const feedbackMap: Record<UnavailabilityActionFeedbackKey, UnavailabilityActionFeedback> = {
    resolve_success: {
      tone: "success",
      title: "已处理不可用",
      description: "不可用记录已标记为已处理，请回到风险或计划详情查看当前处理状态。",
    },
    resolve_failed: {
      tone: "error",
      title: "处理不可用失败",
      description: "当前不可用记录状态暂不允许处理，请刷新后重试。",
    },
  }

  return feedbackMap[value as UnavailabilityActionFeedbackKey] ?? null
}

export function unavailabilityStatusLabel(status: UnavailabilityStatus) {
  const labels: Record<UnavailabilityStatus, string> = {
    active: "生效中",
    resolved: "已处理",
  }

  return labels[status]
}

function filterFallbackUnavailability(
  rows: UnavailabilityRow[],
  filters: UnavailabilityFilters
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
      row.unavailability_id,
      row.staff_name,
      row.team_name,
      row.project_name,
      row.site_name,
      row.unavailable_date,
      row.start_time,
      row.end_time,
      row.reason,
      row.status,
      unavailabilityStatusLabel(row.status),
      row.note,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  })
}
