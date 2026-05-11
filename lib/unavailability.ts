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
