"use server"

import { redirect } from "next/navigation"

import { buildImportApiUrl } from "@/components/import-center-model"
import {
  type MasterDataAgentMaintenanceActionKey,
  type MasterDataAgentMaintenanceStatus,
  type MasterDataEmployeeType,
  type MasterDataMaintenanceEntityKey,
  type MasterDataOrganizationMaintenanceActionKey,
  type MasterDataSkillCategory,
  type MasterDataSkillMaintenanceActionKey,
  type MasterDataVendorMaintenanceActionKey,
  type MasterDataWorkplaceMaintenanceActionKey,
  buildMasterDataAgentMaintenanceApiPath,
  buildMasterDataAgentMaintenancePayload,
  buildMasterDataAgentSkillMaintenanceApiPath,
  buildMasterDataAgentSkillMaintenancePayload,
  buildMasterDataOrganizationMaintenanceApiPath,
  buildMasterDataOrganizationMaintenancePayload,
  buildMasterDataSkillMaintenanceApiPath,
  buildMasterDataSkillMaintenancePayload,
  buildMasterDataVendorMaintenanceApiPath,
  buildMasterDataVendorMaintenancePayload,
  buildMasterDataWorkplaceMaintenanceApiPath,
  buildMasterDataWorkplaceMaintenancePayload,
} from "@/components/master-data-maintenance-model"

const AGENT_ACTIONS = new Set<MasterDataAgentMaintenanceActionKey>([
  "create",
  "edit",
  "freeze",
  "effective_period",
])

const WORKPLACE_ACTIONS = new Set<MasterDataWorkplaceMaintenanceActionKey>([
  "create",
  "edit",
  "freeze",
])

const VENDOR_ACTIONS = new Set<MasterDataVendorMaintenanceActionKey>([
  "create",
  "edit",
  "freeze",
])

const SKILL_ACTIONS = new Set<MasterDataSkillMaintenanceActionKey>([
  "create",
  "edit",
  "freeze",
])

const ORGANIZATION_ACTIONS = new Set<MasterDataOrganizationMaintenanceActionKey>([
  "create",
  "edit",
  "freeze",
])

const AGENT_STATUSES = new Set<MasterDataAgentMaintenanceStatus>([
  "active",
  "frozen",
  "inactive",
])

const EMPLOYEE_TYPES = new Set<MasterDataEmployeeType>(["internal", "outsourced"])

const SKILL_CATEGORIES = new Set<MasterDataSkillCategory>([
  "online",
  "hotline",
  "ticket",
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

export async function submitMasterDataWorkplaceMaintenance(
  formData: FormData
): Promise<void> {
  let redirectHref: string

  try {
    const action = parseWorkplaceAction(formData.get("action"))
    const workplaceId = getFormValue(formData, "workplace_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")
    const workplaceName = getFormValue(formData, "reference_name")
    const effectiveFrom = getFormValue(formData, "effective_from")
    const effectiveTo = getFormValue(formData, "effective_to")

    if (!workplaceId || !sourceBatchId) {
      redirectHref = buildMaintenanceRedirect("sites", {
        maintenance_status: "error",
        record_type: "职场",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "职场 ID 和来源批次不能为空",
      })
    } else if (
      action === "create" &&
      (!workplaceName || !effectiveFrom || !effectiveTo)
    ) {
      redirectHref = buildMaintenanceRedirect("sites", {
        maintenance_status: "error",
        record_type: "职场",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "职场名称和生效期不能为空",
      })
    } else {
      const payload = buildMasterDataWorkplaceMaintenancePayload({
        action,
        workplaceId,
        sourceBatchId,
        workplaceName,
        status: parseStatus(formData.get("status")),
        effectiveFrom,
        effectiveTo,
      })
      const response = await fetch(
        buildImportApiUrl(buildMasterDataWorkplaceMaintenanceApiPath(workplaceId)),
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
        redirectHref = buildMaintenanceRedirect("sites", {
          maintenance_status: "error",
          record_type: "职场",
          maintenance_code: error.code,
          maintenance_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          action_status?: string
          reference?: {
            reference_id?: string
            reference_name?: string
            status?: string
          }
        }
        redirectHref = buildMaintenanceRedirect("sites", {
          maintenance_status: "success",
          record_type: "职场",
          action_status: result.action_status ?? "submitted",
          record_id: result.reference?.reference_id ?? workplaceId,
          record_name: result.reference?.reference_name ?? "未返回名称",
          record_status: result.reference?.status ?? "unknown",
        })
      }
    }
  } catch (error) {
    redirectHref = buildMaintenanceRedirect("sites", {
      maintenance_status: "error",
      record_type: "职场",
      maintenance_code: "MASTER_DATA_WORKPLACE_SUBMIT_FAILED",
      maintenance_message: formatMaintenanceError(error),
    })
  }

  redirect(redirectHref)
}

export async function submitMasterDataVendorMaintenance(
  formData: FormData
): Promise<void> {
  let redirectHref: string

  try {
    const action = parseVendorAction(formData.get("action"))
    const vendorId = getFormValue(formData, "vendor_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")
    const vendorName = getFormValue(formData, "reference_name")
    const effectiveFrom = getFormValue(formData, "effective_from")
    const effectiveTo = getFormValue(formData, "effective_to")

    if (!vendorId || !sourceBatchId) {
      redirectHref = buildMaintenanceRedirect("vendors", {
        maintenance_status: "error",
        record_type: "供应商",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "供应商 ID 和来源批次不能为空",
      })
    } else if (
      action === "create" &&
      (!vendorName || !effectiveFrom || !effectiveTo)
    ) {
      redirectHref = buildMaintenanceRedirect("vendors", {
        maintenance_status: "error",
        record_type: "供应商",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "供应商名称和生效期不能为空",
      })
    } else {
      const payload = buildMasterDataVendorMaintenancePayload({
        action,
        vendorId,
        sourceBatchId,
        vendorName,
        status: parseStatus(formData.get("status")),
        effectiveFrom,
        effectiveTo,
      })
      const response = await fetch(
        buildImportApiUrl(buildMasterDataVendorMaintenanceApiPath(vendorId)),
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
        redirectHref = buildMaintenanceRedirect("vendors", {
          maintenance_status: "error",
          record_type: "供应商",
          maintenance_code: error.code,
          maintenance_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          action_status?: string
          reference?: {
            reference_id?: string
            reference_name?: string
            status?: string
          }
        }
        redirectHref = buildMaintenanceRedirect("vendors", {
          maintenance_status: "success",
          record_type: "供应商",
          action_status: result.action_status ?? "submitted",
          record_id: result.reference?.reference_id ?? vendorId,
          record_name: result.reference?.reference_name ?? "未返回名称",
          record_status: result.reference?.status ?? "unknown",
        })
      }
    }
  } catch (error) {
    redirectHref = buildMaintenanceRedirect("vendors", {
      maintenance_status: "error",
      record_type: "供应商",
      maintenance_code: "MASTER_DATA_VENDOR_SUBMIT_FAILED",
      maintenance_message: formatMaintenanceError(error),
    })
  }

  redirect(redirectHref)
}

export async function submitMasterDataSkillMaintenance(
  formData: FormData
): Promise<void> {
  let redirectHref: string

  try {
    const action = parseSkillAction(formData.get("action"))
    const skillId = getFormValue(formData, "skill_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")
    const skillName = getFormValue(formData, "reference_name")
    const effectiveFrom = getFormValue(formData, "effective_from")
    const effectiveTo = getFormValue(formData, "effective_to")

    if (!skillId || !sourceBatchId) {
      redirectHref = buildMaintenanceRedirect("skills", {
        maintenance_status: "error",
        record_type: "技能组",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "技能组 ID 和来源批次不能为空",
      })
    } else if (
      action === "create" &&
      (!skillName || !effectiveFrom || !effectiveTo)
    ) {
      redirectHref = buildMaintenanceRedirect("skills", {
        maintenance_status: "error",
        record_type: "技能组",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "技能组名称和生效期不能为空",
      })
    } else {
      const payload = buildMasterDataSkillMaintenancePayload({
        action,
        skillId,
        sourceBatchId,
        skillName,
        skillCategory: parseSkillCategory(formData.get("skill_category")),
        status: parseStatus(formData.get("status")),
        effectiveFrom,
        effectiveTo,
      })
      const response = await fetch(
        buildImportApiUrl(buildMasterDataSkillMaintenanceApiPath(skillId)),
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
        redirectHref = buildMaintenanceRedirect("skills", {
          maintenance_status: "error",
          record_type: "技能组",
          maintenance_code: error.code,
          maintenance_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          action_status?: string
          reference?: {
            reference_id?: string
            reference_name?: string
            status?: string
          }
        }
        redirectHref = buildMaintenanceRedirect("skills", {
          maintenance_status: "success",
          record_type: "技能组",
          action_status: result.action_status ?? "submitted",
          record_id: result.reference?.reference_id ?? skillId,
          record_name: result.reference?.reference_name ?? "未返回名称",
          record_status: result.reference?.status ?? "unknown",
        })
      }
    }
  } catch (error) {
    redirectHref = buildMaintenanceRedirect("skills", {
      maintenance_status: "error",
      record_type: "技能组",
      maintenance_code: "MASTER_DATA_SKILL_SUBMIT_FAILED",
      maintenance_message: formatMaintenanceError(error),
    })
  }

  redirect(redirectHref)
}

export async function submitMasterDataOrganizationMaintenance(
  formData: FormData
): Promise<void> {
  let redirectHref: string

  try {
    const action = parseOrganizationAction(formData.get("action"))
    const organizationId = getFormValue(formData, "organization_id")
    const sourceBatchId = getFormValue(formData, "source_batch_id")
    const organizationName = getFormValue(formData, "organization_name")
    const organizationLevel = parseOptionalPositiveInteger(
      formData.get("organization_level")
    )
    const parentOrganizationId = getFormValue(formData, "parent_organization_id")
    const effectiveFrom = getFormValue(formData, "effective_from")
    const effectiveTo = getFormValue(formData, "effective_to")

    if (!organizationId || !sourceBatchId) {
      redirectHref = buildMaintenanceRedirect("organizations", {
        maintenance_status: "error",
        record_type: "组织",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "组织 ID 和来源批次不能为空",
      })
    } else if (
      action === "create" &&
      (!organizationName || !organizationLevel || !effectiveFrom || !effectiveTo)
    ) {
      redirectHref = buildMaintenanceRedirect("organizations", {
        maintenance_status: "error",
        record_type: "组织",
        maintenance_code: "MISSING_REQUIRED_FIELD",
        maintenance_message: "组织名称、组织层级和生效期不能为空",
      })
    } else {
      const payload = buildMasterDataOrganizationMaintenancePayload({
        action,
        organizationId,
        sourceBatchId,
        organizationName,
        organizationLevel,
        parentOrganizationId: parentOrganizationId || undefined,
        status: parseStatus(formData.get("status")),
        effectiveFrom,
        effectiveTo,
      })
      const response = await fetch(
        buildImportApiUrl(
          buildMasterDataOrganizationMaintenanceApiPath(organizationId)
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
        redirectHref = buildMaintenanceRedirect("organizations", {
          maintenance_status: "error",
          record_type: "组织",
          maintenance_code: error.code,
          maintenance_message: error.message,
        })
      } else {
        const result = (await response.json()) as {
          action_status?: string
          organization?: {
            organization_id?: string
            organization_name?: string
            status?: string
          }
        }
        redirectHref = buildMaintenanceRedirect("organizations", {
          maintenance_status: "success",
          record_type: "组织",
          action_status: result.action_status ?? "submitted",
          record_id: result.organization?.organization_id ?? organizationId,
          record_name: result.organization?.organization_name ?? "未返回名称",
          record_status: result.organization?.status ?? "unknown",
        })
      }
    }
  } catch (error) {
    redirectHref = buildMaintenanceRedirect("organizations", {
      maintenance_status: "error",
      record_type: "组织",
      maintenance_code: "MASTER_DATA_ORGANIZATION_SUBMIT_FAILED",
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

function parseWorkplaceAction(
  value: FormDataEntryValue | null
): MasterDataWorkplaceMaintenanceActionKey {
  const action = String(value ?? "")
  if (WORKPLACE_ACTIONS.has(action as MasterDataWorkplaceMaintenanceActionKey)) {
    return action as MasterDataWorkplaceMaintenanceActionKey
  }

  throw new Error("未知职场维护动作")
}

function parseVendorAction(
  value: FormDataEntryValue | null
): MasterDataVendorMaintenanceActionKey {
  const action = String(value ?? "")
  if (VENDOR_ACTIONS.has(action as MasterDataVendorMaintenanceActionKey)) {
    return action as MasterDataVendorMaintenanceActionKey
  }

  throw new Error("未知供应商维护动作")
}

function parseSkillAction(
  value: FormDataEntryValue | null
): MasterDataSkillMaintenanceActionKey {
  const action = String(value ?? "")
  if (SKILL_ACTIONS.has(action as MasterDataSkillMaintenanceActionKey)) {
    return action as MasterDataSkillMaintenanceActionKey
  }

  throw new Error("未知技能组维护动作")
}

function parseOrganizationAction(
  value: FormDataEntryValue | null
): MasterDataOrganizationMaintenanceActionKey {
  const action = String(value ?? "")
  if (ORGANIZATION_ACTIONS.has(action as MasterDataOrganizationMaintenanceActionKey)) {
    return action as MasterDataOrganizationMaintenanceActionKey
  }

  throw new Error("未知组织维护动作")
}

function parseOptionalPositiveInteger(
  value: FormDataEntryValue | null
): number | undefined {
  const rawValue = String(value ?? "").trim()
  if (!rawValue) {
    return undefined
  }

  const parsedValue = Number.parseInt(rawValue, 10)
  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error("组织层级必须为正整数")
  }

  return parsedValue
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

function parseSkillCategory(
  value: FormDataEntryValue | null
): MasterDataSkillCategory | undefined {
  const skillCategory = String(value ?? "")
  if (!skillCategory) {
    return undefined
  }

  if (SKILL_CATEGORIES.has(skillCategory as MasterDataSkillCategory)) {
    return skillCategory as MasterDataSkillCategory
  }

  throw new Error("未知技能组归属属性")
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
