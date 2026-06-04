import {
  type ImportBatchListRow,
  buildImportApiUrl,
} from "@/components/import-center-model"
import type {
  MasterDataBindingListRow,
  MasterDataEmployeeListRow,
  MasterDataMaintenanceEntityKey,
  MasterDataReferenceListRow,
} from "@/components/master-data-maintenance-model"

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
        error: `人员列表读取失败：${response.status}`,
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

export async function fetchMasterDataReferences(
  entityKey: MasterDataMaintenanceEntityKey
): Promise<ApiResult<MasterDataReferenceListRow[]>> {
  const referenceType = mapReferenceEntityKeyToApiType(entityKey)

  if (!referenceType) {
    return { data: [], error: "未知主数据对象" }
  }

  try {
    const response = await fetch(buildImportApiUrl(`/api/v1/master-data/${referenceType}`), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `${getReferenceEntityLabel(entityKey)}列表读取失败：${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: MasterDataReferenceListRow[]
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

export async function fetchMasterDataBindings(): Promise<
  ApiResult<MasterDataBindingListRow[]>
> {
  try {
    const response = await fetch(buildImportApiUrl("/api/v1/master-data/bindings"), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `绑定关系列表读取失败：${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: MasterDataBindingListRow[]
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
        error: `导入批次 服务返回 ${response.status}`,
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

function mapReferenceEntityKeyToApiType(
  entityKey: MasterDataMaintenanceEntityKey
) {
  if (entityKey === "sites") {
    return "workplaces"
  }

  if (entityKey === "vendors") {
    return "suppliers"
  }

  if (entityKey === "projects" || entityKey === "skills") {
    return entityKey
  }

  return null
}

function getReferenceEntityLabel(entityKey: MasterDataMaintenanceEntityKey) {
  if (entityKey === "sites") {
    return "职场"
  }

  if (entityKey === "vendors") {
    return "供应商"
  }

  if (entityKey === "projects") {
    return "项目"
  }

  if (entityKey === "skills") {
    return "技能"
  }

  return "主数据"
}

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "读取失败"
}
