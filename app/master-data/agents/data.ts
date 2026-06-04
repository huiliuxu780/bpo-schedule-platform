import {
  type ImportBatchListRow,
  buildImportApiUrl,
} from "@/components/import-center-model"
import type { MasterDataEmployeeListRow } from "@/components/master-data-maintenance-model"

export type ApiResult<T> = {
  data: T | null
  error: string | null
}

export async function fetchMasterDataEmployees(): Promise<
  ApiResult<MasterDataEmployeeListRow[]>
> {
  try {
    const response = await fetch(buildImportApiUrl("/api/v1/master-data/employees"), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `人员列表 API 返回 ${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: MasterDataEmployeeListRow[]
    }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

export async function fetchImportBatches(): Promise<ApiResult<ImportBatchListRow[]>> {
  try {
    const response = await fetch(buildImportApiUrl("/api/v1/import-batches"), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `导入批次 API 返回 ${response.status}`,
      }
    }

    const payload = (await response.json()) as { items?: ImportBatchListRow[] }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "本地 API 暂不可用"
}
