import {
  type ImportFieldMappingTemplate,
  type ImportBatchListRow,
  buildImportApiUrl,
  buildImportFieldMappingTemplatesUrl,
} from "@/components/import-center-model"
import type {
  MasterDataEmployeeListRow,
  MasterDataMaintenanceEntityKey,
  MasterDataOrganizationListRow,
  MasterDataReferenceListRow,
  MasterDataWorkplaceBindingRow,
  MasterDataWorkplaceServiceTeamRow,
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

export async function fetchMasterDataSkills(): Promise<
  ApiResult<MasterDataReferenceListRow[]>
> {
  return fetchMasterDataReferences("skills")
}

export async function fetchMasterDataOrganizations(): Promise<
  ApiResult<MasterDataOrganizationListRow[]>
> {
  try {
    const response = await fetch(buildImportApiUrl("/api/v1/master-data/organizations"), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `组织列表读取失败：${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: MasterDataOrganizationListRow[]
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

export async function fetchMasterDataWorkplaceBindings(): Promise<
  ApiResult<MasterDataWorkplaceBindingRow[]>
> {
  try {
    const response = await fetch(buildImportApiUrl("/api/v1/master-data/bindings"), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `职场服务团队来源读取失败：${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: MasterDataWorkplaceBindingRow[]
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

export async function fetchMasterDataWorkplaceServiceTeams(
  workplaceId?: string
): Promise<ApiResult<MasterDataWorkplaceServiceTeamRow[]>> {
  const searchParams = new URLSearchParams()
  if (workplaceId) {
    searchParams.set("workplace_id", workplaceId)
  }
  const query = searchParams.toString()

  try {
    const response = await fetch(
      buildImportApiUrl(
        `/api/v1/master-data/workplace-service-teams${query ? `?${query}` : ""}`
      ),
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return {
        data: [],
        error: `职场服务团队读取失败：${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: MasterDataWorkplaceServiceTeamRow[]
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
        error: `导入批次读取失败（状态码 ${response.status}）`,
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

export async function fetchImportFieldMappingTemplates(): Promise<
  ApiResult<ImportFieldMappingTemplate[]>
> {
  try {
    const response = await fetch(buildImportFieldMappingTemplatesUrl(), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `字段映射模板读取失败（状态码 ${response.status}）`,
      }
    }

    const payload = (await response.json()) as {
      items?: ImportFieldMappingTemplate[]
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

function mapReferenceEntityKeyToApiType(
  entityKey: MasterDataMaintenanceEntityKey
) {
  if (entityKey === "sites") {
    return "workplaces"
  }

  if (entityKey === "vendors") {
    return "suppliers"
  }

  if (entityKey === "skills") {
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
