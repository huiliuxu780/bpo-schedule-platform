import { type ApiResult, formatApiErrorMessage } from "@/lib/api-result"

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

export async function getUnavailability(
  filters: UnavailabilityFilters = {}
): Promise<ApiResult<UnavailabilityRow[]>> {
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

  if (response.error) {
    return { data: null, error: response.error }
  }

  const items = response.data?.items
  if (!Array.isArray(items)) {
    return { data: null, error: "响应格式异常：缺少 items 列表" }
  }

  return { data: items, error: null }
}

export async function getUnavailabilityRecord(
  unavailabilityId: string
): Promise<ApiResult<UnavailabilityRow | null>> {
  const rows = await getUnavailability()

  if (rows.error) {
    return { data: null, error: rows.error }
  }

  return {
    data:
      (rows.data ?? []).find(
        (row) => row.unavailability_id === unavailabilityId
      ) ?? null,
    error: null,
  }
}

export function unavailabilityStatusLabel(status: UnavailabilityStatus) {
  const labels: Record<UnavailabilityStatus, string> = {
    active: "生效中",
    resolved: "已处理",
  }

  return labels[status]
}
