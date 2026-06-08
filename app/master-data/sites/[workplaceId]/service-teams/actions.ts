"use server"

import { redirect } from "next/navigation"

import { buildImportApiUrl } from "@/components/import-center-model"
import {
  type MasterDataAgentMaintenanceStatus,
  type MasterDataWorkplaceServiceTeamMaintenanceActionKey,
  type MasterDataWorkplaceServiceTeamType,
  buildMasterDataWorkplaceServiceTeamMaintenanceApiPath,
  buildMasterDataWorkplaceServiceTeamMaintenancePayload,
} from "@/components/master-data-maintenance-model"

const SERVICE_TEAM_ACTIONS =
  new Set<MasterDataWorkplaceServiceTeamMaintenanceActionKey>([
    "create",
    "edit",
    "freeze",
  ])
const SERVICE_TEAM_TYPES = new Set<MasterDataWorkplaceServiceTeamType>([
  "internal",
  "supplier",
])
const STATUSES = new Set<MasterDataAgentMaintenanceStatus>([
  "active",
  "frozen",
  "inactive",
])

export async function submitMasterDataWorkplaceServiceTeamMaintenance(
  formData: FormData
): Promise<void> {
  const workplaceId = getFormValue(formData, "workplace_id")
  let redirectHref = workplaceId
    ? `/master-data/sites/${encodeURIComponent(workplaceId)}`
    : "/master-data/sites"

  try {
    const action = parseServiceTeamAction(formData.get("action"))
    const serviceTeamId = getFormValue(formData, "service_team_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")
    const teamType = parseServiceTeamType(formData.get("team_type"))
    const teamName = getFormValue(formData, "team_name")
    const effectiveFrom = getFormValue(formData, "effective_from")
    const effectiveTo = getFormValue(formData, "effective_to")

    if (!workplaceId || !serviceTeamId || !sourceBatchId) {
      redirectHref = buildServiceTeamRedirect(workplaceId, {
        maintenance_status: "error",
        record_type: "服务团队",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "职场 ID、服务团队 ID 和来源批次不能为空",
      })
    } else if (
      action === "create" &&
      (!teamType || !teamName || !effectiveFrom || !effectiveTo)
    ) {
      redirectHref = buildServiceTeamRedirect(workplaceId, {
        maintenance_status: "error",
        record_type: "服务团队",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "团队类型、团队名称和生效期不能为空",
      })
    } else {
      const payload = buildMasterDataWorkplaceServiceTeamMaintenancePayload({
        action,
        serviceTeamId,
        sourceBatchId,
        workplaceId,
        teamType,
        teamName,
        organizationId: getFormValue(formData, "organization_id"),
        supplierId: getFormValue(formData, "supplier_id"),
        status: parseStatus(formData.get("status")),
        effectiveFrom,
        effectiveTo,
      })
      const response = await fetch(
        buildImportApiUrl(
          buildMasterDataWorkplaceServiceTeamMaintenanceApiPath(serviceTeamId)
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      )

      if (!response.ok) {
        const error = await readMaintenanceApiError(response)
        redirectHref = buildServiceTeamRedirect(workplaceId, {
          maintenance_status: "error",
          record_type: "服务团队",
          maintenance_code: error.code,
          maintenance_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          action_status?: string
          service_team?: {
            service_team_id?: string
            team_name?: string
            status?: string
          }
        }
        redirectHref = buildServiceTeamRedirect(workplaceId, {
          maintenance_status: "success",
          record_type: "服务团队",
          action_status: result.action_status ?? "submitted",
          record_id: result.service_team?.service_team_id ?? serviceTeamId,
          record_name: result.service_team?.team_name ?? "未返回名称",
          record_status: result.service_team?.status ?? "unknown",
        })
      }
    }
  } catch (error) {
    redirectHref = buildServiceTeamRedirect(workplaceId, {
      maintenance_status: "error",
      record_type: "服务团队",
      maintenance_code: "MASTER_DATA_SERVICE_TEAM_SUBMIT_FAILED",
      maintenance_message: formatMaintenanceError(error),
    })
  }

  redirect(redirectHref)
}

function parseServiceTeamAction(
  value: FormDataEntryValue | null
): MasterDataWorkplaceServiceTeamMaintenanceActionKey {
  const action = String(value ?? "")
  if (SERVICE_TEAM_ACTIONS.has(action as MasterDataWorkplaceServiceTeamMaintenanceActionKey)) {
    return action as MasterDataWorkplaceServiceTeamMaintenanceActionKey
  }

  throw new Error("未知服务团队维护动作")
}

function parseServiceTeamType(
  value: FormDataEntryValue | null
): MasterDataWorkplaceServiceTeamType | undefined {
  const teamType = String(value ?? "")
  if (!teamType) {
    return undefined
  }
  if (SERVICE_TEAM_TYPES.has(teamType as MasterDataWorkplaceServiceTeamType)) {
    return teamType as MasterDataWorkplaceServiceTeamType
  }

  throw new Error("未知服务团队类型")
}

function parseStatus(
  value: FormDataEntryValue | null
): MasterDataAgentMaintenanceStatus | undefined {
  const status = String(value ?? "")
  if (STATUSES.has(status as MasterDataAgentMaintenanceStatus)) {
    return status as MasterDataAgentMaintenanceStatus
  }

  return undefined
}

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim()
}

async function readMaintenanceApiError(response: Response) {
  try {
    const payload = (await response.json()) as {
      detail?: {
        error?: {
          code?: string
          message?: string
        }
      }
    }
    const error = payload.detail?.error

    return {
      code: error?.code ?? `HTTP_${response.status}`,
      message: error?.message ?? `服务团队维护失败（状态码 ${response.status}）`,
    }
  } catch {
    return {
      code: `HTTP_${response.status}`,
      message: `服务团队维护失败（状态码 ${response.status}）`,
    }
  }
}

function buildServiceTeamRedirect(
  workplaceId: string,
  params: Record<string, string>
) {
  const searchParams = new URLSearchParams(params)
  return `/master-data/sites/${encodeURIComponent(workplaceId)}?${searchParams.toString()}`
}

function formatMaintenanceError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "服务团队维护提交失败"
}
