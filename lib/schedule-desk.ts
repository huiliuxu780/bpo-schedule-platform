import {
  type ScheduleDeskApiCoverage,
  type ScheduleDeskApiMatrix,
  type ScheduleDeskApiPeriod,
} from "@/components/schedule-desk/schedule-matrix-model"
import { type ApiResult, formatApiErrorMessage } from "@/lib/api-result"
import { fetchShiftDefinitions } from "@/lib/base-config"

// 服务端 API base：请求时求值（不做模块级常量冻结）。
// 优先 BPO_API_BASE_URL（dev/联调覆盖），其次 NEXT_PUBLIC_BPO_API_BASE_URL
//（e2e.sh 唯一导出的变量；括号访问避免构建期内联冻结），最后默认 8000。
// 该 resolver 同时作为客户端写路径 base 的来源：app/schedule-desk/page.tsx
// 在请求时求值后以 prop 注入客户端组件。
export function resolveScheduleDeskApiBase(): string {
  return (
    process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ??
    process.env["NEXT_PUBLIC_BPO_API_BASE_URL"]?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  )
}

type SchedulePeriodListResponse = {
  items: ScheduleDeskApiPeriod[]
}

async function readJson<T>(path: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${resolveScheduleDeskApiBase()}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      return {
        data: null,
        error: `请求失败（状态码 ${response.status}）`,
        notFound: response.status === 404,
      }
    }

    return { data: (await response.json()) as T, error: null }
  } catch (error) {
    return {
      data: null,
      error: `后端服务不可用：${formatApiErrorMessage(error)}`,
    }
  }
}

async function postJson<T>(path: string, payload: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${resolveScheduleDeskApiBase()}${path}`, {
      method: "POST",
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
        notFound: response.status === 404,
      }
    }

    return { data: (await response.json()) as T, error: null }
  } catch (error) {
    return {
      data: null,
      error: `后端服务不可用：${formatApiErrorMessage(error)}`,
    }
  }
}

export async function getSchedulePeriods(
  month?: string
): Promise<ApiResult<ScheduleDeskApiPeriod[]>> {
  const searchParams = new URLSearchParams()

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    searchParams.set("month", month)
  }

  const suffix = searchParams.toString()
  const result = await readJson<SchedulePeriodListResponse>(
    `/api/v1/schedule-periods${suffix ? `?${suffix}` : ""}`
  )

  if (result.error) {
    return { data: null, error: result.error }
  }

  const items = result.data?.items
  if (!Array.isArray(items)) {
    return { data: null, error: "响应格式异常：缺少 items 列表" }
  }

  return { data: items, error: null }
}

export async function getScheduleMatrix(
  periodId: string,
  weekId?: string
): Promise<ApiResult<ScheduleDeskApiMatrix>> {
  const searchParams = new URLSearchParams()

  if (weekId) {
    searchParams.set("week", weekId)
  }

  const suffix = searchParams.toString()
  return readJson<ScheduleDeskApiMatrix>(
    `/api/v1/schedule-periods/${encodeURIComponent(periodId)}/matrix${
      suffix ? `?${suffix}` : ""
    }`
  )
}

export async function recalculatePeriodCoverage(
  periodId: string,
  dateFrom: string,
  dateTo: string
): Promise<ApiResult<ScheduleDeskApiCoverage>> {
  return postJson<ScheduleDeskApiCoverage>(
    `/api/v1/schedule-periods/${encodeURIComponent(periodId)}/coverage/recalculate`,
    { date_from: dateFrom, date_to: dateTo }
  )
}

// 班次码候选（分段编辑抽屉 datalist 用）；失败时返回空列表，不阻断页面。
// 读取复用 lib/base-config 的唯一 fetcher，响应形状不在此重复定义。
export async function getShiftCodeOptions(): Promise<string[]> {
  const result = await fetchShiftDefinitions()

  if (result.error || !result.data) {
    return []
  }

  return Array.from(
    new Set(
      result.data
        .filter((item) => item.status === "active" && item.shift_code)
        .map((item) => item.shift_code)
    )
  ).sort()
}
