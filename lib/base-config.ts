import type { ShiftDefinitionApiRecord } from "@/components/base-config/shift-activity-model"
import type { StatusMappingApiRecord } from "@/components/base-config/status-mapping-model"
import { type ApiResult, formatApiErrorMessage } from "@/lib/api-result"
import { resolveScheduleDeskApiBase } from "@/lib/schedule-desk"

// 基础配置相关读取的唯一 lib 层入口：响应形状在此定义一次，
// app/base-config/page.tsx 与 lib/schedule-desk.ts 的班次码候选共用。

export type ShiftDefinitionListResponse = {
  items: ShiftDefinitionApiRecord[]
}

export type StatusMappingListResponse = {
  items: StatusMappingApiRecord[]
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

// 班次定义列表（含全部历史版本）：渲染「班次与活动」标签。
export async function fetchShiftDefinitions(): Promise<
  ApiResult<ShiftDefinitionApiRecord[]>
> {
  const result = await readJson<ShiftDefinitionListResponse>(
    "/api/v1/shift-definitions"
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

// 状态映射列表：渲染「状态映射」标签的结构化表格。
export async function fetchStatusMappings(): Promise<
  ApiResult<StatusMappingApiRecord[]>
> {
  const result = await readJson<StatusMappingListResponse>(
    "/api/v1/status-mappings"
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
