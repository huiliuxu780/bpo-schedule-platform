"use server"

import { redirect } from "next/navigation"

import { buildImportApiUrl } from "@/components/import-center-model"
import {
  type MasterDataAgentMaintenanceActionKey,
  type MasterDataAgentMaintenanceStatus,
  buildMasterDataAgentMaintenanceApiPath,
  buildMasterDataAgentMaintenancePayload,
} from "@/components/master-data-maintenance-model"

const AGENT_ACTIONS = new Set<MasterDataAgentMaintenanceActionKey>([
  "create",
  "edit",
  "freeze",
  "effective_period",
])

const AGENT_STATUSES = new Set<MasterDataAgentMaintenanceStatus>([
  "active",
  "frozen",
  "inactive",
])

export async function submitMasterDataAgentMaintenance(
  formData: FormData
): Promise<void> {
  let redirectHref: string

  try {
    const action = parseAction(formData.get("action"))
    const employeeId = getFormValue(formData, "employee_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")

    if (!employeeId || !sourceBatchId) {
      redirectHref = buildMaintenanceRedirect({
        maintenance_status: "error",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "坐席 ID 和来源批次不能为空",
      })
    } else {
      const payload = buildMasterDataAgentMaintenancePayload({
        action,
        employeeId,
        sourceBatchId,
        employeeName: getFormValue(formData, "employee_name"),
        status: parseStatus(formData.get("status")),
        effectiveFrom: getFormValue(formData, "effective_from"),
        effectiveTo: getFormValue(formData, "effective_to"),
      })
      const response = await fetch(
        buildImportApiUrl(buildMasterDataAgentMaintenanceApiPath(employeeId)),
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
        redirectHref = buildMaintenanceRedirect({
          maintenance_status: "error",
          maintenance_code: error.code,
          maintenance_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          action_status?: string
          employee?: {
            employee_id?: string
            employee_name?: string
            status?: string
          }
        }
        redirectHref = buildMaintenanceRedirect({
          maintenance_status: "success",
          action_status: result.action_status ?? "submitted",
          employee_id: result.employee?.employee_id ?? employeeId,
          employee_name: result.employee?.employee_name ?? "未返回姓名",
          employee_status: result.employee?.status ?? "unknown",
        })
      }
    }
  } catch (error) {
    redirectHref = buildMaintenanceRedirect({
      maintenance_status: "error",
      maintenance_code: "MASTER_DATA_AGENT_SUBMIT_FAILED",
      maintenance_message: formatMaintenanceError(error),
    })
  }

  redirect(redirectHref)
}

function parseAction(value: FormDataEntryValue | null): MasterDataAgentMaintenanceActionKey {
  const action = String(value ?? "")
  if (AGENT_ACTIONS.has(action as MasterDataAgentMaintenanceActionKey)) {
    return action as MasterDataAgentMaintenanceActionKey
  }

  throw new Error("未知坐席维护动作")
}

function parseStatus(
  value: FormDataEntryValue | null
): MasterDataAgentMaintenanceStatus | undefined {
  const status = String(value ?? "")
  if (AGENT_STATUSES.has(status as MasterDataAgentMaintenanceStatus)) {
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
      message: error?.message ?? `坐席维护 API 返回 ${response.status}`,
    }
  } catch {
    return {
      code: `HTTP_${response.status}`,
      message: `坐席维护 API 返回 ${response.status}`,
    }
  }
}

function buildMaintenanceRedirect(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params)
  return `/master-data/agents?${searchParams.toString()}`
}

function formatMaintenanceError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "坐席维护提交失败"
}
