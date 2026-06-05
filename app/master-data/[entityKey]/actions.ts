"use server"

import { redirect } from "next/navigation"

import { buildImportApiUrl } from "@/components/import-center-model"
import {
  type MasterDataAgentMaintenanceActionKey,
  type MasterDataAgentMaintenanceStatus,
  type MasterDataEmployeeType,
  type MasterDataMaintenanceEntityKey,
  buildMasterDataAgentMaintenanceApiPath,
  buildMasterDataAgentMaintenancePayload,
  buildMasterDataAgentSkillMaintenanceApiPath,
  buildMasterDataAgentSkillMaintenancePayload,
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

const EMPLOYEE_TYPES = new Set<MasterDataEmployeeType>(["internal", "outsourced"])

export async function submitMasterDataAgentMaintenance(
  formData: FormData
): Promise<void> {
  let redirectHref: string

  try {
    const action = parseAction(formData.get("action"))
    const employeeId = getFormValue(formData, "employee_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")

    if (!employeeId || !sourceBatchId) {
        redirectHref = buildMaintenanceRedirect("agents", {
          maintenance_status: "error",
          maintenance_code: "MISSING_REQUIRED_FIELD",
          maintenance_message: "人员 ID 和来源批次不能为空",
        })
    } else {
      const payload = buildMasterDataAgentMaintenancePayload({
        action,
        employeeId,
        sourceBatchId,
        employeeName: getFormValue(formData, "employee_name"),
        status: parseStatus(formData.get("status")),
        employeeType: parseEmployeeType(formData.get("employee_type")),
        organizationId: getFormValue(formData, "organization_id"),
        workplaceId: getFormValue(formData, "workplace_id"),
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
        redirectHref = buildMaintenanceRedirect("agents", {
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
        redirectHref = buildMaintenanceRedirect("agents", {
          maintenance_status: "success",
          action_status: result.action_status ?? "submitted",
          record_id: result.employee?.employee_id ?? employeeId,
          record_name: result.employee?.employee_name ?? "未返回姓名",
          record_status: result.employee?.status ?? "unknown",
        })
      }
    }
  } catch (error) {
    redirectHref = buildMaintenanceRedirect("agents", {
      maintenance_status: "error",
      maintenance_code: "MASTER_DATA_AGENT_SUBMIT_FAILED",
      maintenance_message: formatMaintenanceError(error),
    })
  }

  redirect(redirectHref)
}

export async function submitMasterDataAgentSkillMaintenance(
  formData: FormData
): Promise<void> {
  let redirectHref: string

  try {
    const employeeId = getFormValue(formData, "employee_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")
    const skillIds = parseSkillIds(formData.get("skill_ids"))
    const effectiveFrom = getFormValue(formData, "effective_from")
    const effectiveTo = getFormValue(formData, "effective_to")

    if (
      !employeeId ||
      !sourceBatchId ||
      skillIds.length === 0 ||
      !effectiveFrom ||
      !effectiveTo
    ) {
      redirectHref = buildMaintenanceRedirect("agents", {
        maintenance_status: "error",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "人员 ID、技能 ID 列表、来源批次和生效期不能为空",
      })
    } else {
      const payload = buildMasterDataAgentSkillMaintenancePayload({
        employeeId,
        sourceBatchId,
        skillIds,
        effectiveFrom,
        effectiveTo,
      })
      const response = await fetch(
        buildImportApiUrl(buildMasterDataAgentSkillMaintenanceApiPath(employeeId)),
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
        redirectHref = buildMaintenanceRedirect("agents", {
          maintenance_status: "error",
          maintenance_code: error.code,
          maintenance_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          action_status?: string
          employee_id?: string
          skills?: unknown[]
        }
        redirectHref = buildMaintenanceRedirect("agents", {
          maintenance_status: "success",
          action_status: result.action_status ?? "submitted",
          record_id: result.employee_id ?? employeeId,
          record_name: `${result.skills?.length ?? skillIds.length} 个技能`,
          record_status: "skills_replaced",
        })
      }
    }
  } catch (error) {
    redirectHref = buildMaintenanceRedirect("agents", {
      maintenance_status: "error",
      maintenance_code: "MASTER_DATA_AGENT_SKILL_SUBMIT_FAILED",
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

  throw new Error("未知人员维护动作")
}

function parseEmployeeType(
  value: FormDataEntryValue | null
): MasterDataEmployeeType | undefined {
  const employeeType = String(value ?? "")
  if (!employeeType) {
    return undefined
  }

  if (EMPLOYEE_TYPES.has(employeeType as MasterDataEmployeeType)) {
    return employeeType as MasterDataEmployeeType
  }

  throw new Error("未知人员类型")
}

function parseSkillIds(value: FormDataEntryValue | null): string[] {
  const rawValue = String(value ?? "")
  return Array.from(
    new Set(
      rawValue
        .split(/[\n,，;；]+/)
        .map((skillId) => skillId.trim())
        .filter(Boolean)
    )
  )
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
      message: error?.message ?? `主数据维护读取失败（状态码 ${response.status}）`,
    }
  } catch {
    return {
      code: `HTTP_${response.status}`,
      message: `主数据维护读取失败（状态码 ${response.status}）`,
    }
  }
}

function buildMaintenanceRedirect(
  entityKey: MasterDataMaintenanceEntityKey,
  params: Record<string, string>
) {
  const searchParams = new URLSearchParams(params)
  return `/master-data/${entityKey}?${searchParams.toString()}`
}

function formatMaintenanceError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "主数据维护提交失败"
}
