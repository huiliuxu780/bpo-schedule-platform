import {
  type MasterDataAgentMaintenanceDraft,
  type MasterDataWorkplaceMaintenanceDraft,
  type MasterDataVendorMaintenanceDraft,
  type MasterDataSkillMaintenanceDraft,
  type MasterDataOrganizationMaintenanceDraft,
  type MasterDataWorkplaceServiceTeamMaintenanceDraft,
  type MasterDataAgentSkillMaintenanceDraft,
  type MasterDataAgentSkillMaintenancePayload,
  type MasterDataAgentMaintenancePayload,
  type MasterDataWorkplaceMaintenancePayload,
  type MasterDataVendorMaintenancePayload,
  type MasterDataSkillMaintenancePayload,
  type MasterDataOrganizationMaintenancePayload,
  type MasterDataWorkplaceServiceTeamMaintenancePayload,
  type MasterDataAgentMaintenanceFeedback,
} from "./master-data-maintenance-types"
import {
  getSingleSearchParam,
} from "./master-data-maintenance-formatters"

export function buildMasterDataAgentMaintenanceApiPath(employeeId: string): string {
  return `/api/v1/master-data/employees/${encodeURIComponent(employeeId)}/maintenance`
}

export function buildMasterDataWorkplaceMaintenanceApiPath(
  workplaceId: string
): string {
  return `/api/v1/master-data/workplaces/${encodeURIComponent(workplaceId)}/maintenance`
}

export function buildMasterDataVendorMaintenanceApiPath(vendorId: string): string {
  return `/api/v1/master-data/suppliers/${encodeURIComponent(vendorId)}/maintenance`
}

export function buildMasterDataSkillMaintenanceApiPath(skillId: string): string {
  return `/api/v1/master-data/skills/${encodeURIComponent(skillId)}/maintenance`
}

export function buildMasterDataOrganizationMaintenanceApiPath(
  organizationId: string
): string {
  return `/api/v1/master-data/organizations/${encodeURIComponent(organizationId)}/maintenance`
}

export function buildMasterDataWorkplaceServiceTeamMaintenanceApiPath(
  serviceTeamId: string
): string {
  return `/api/v1/master-data/workplace-service-teams/${encodeURIComponent(serviceTeamId)}/maintenance`
}

export function buildMasterDataAgentSkillMaintenanceApiPath(
  employeeId: string
): string {
  return `/api/v1/master-data/employees/${encodeURIComponent(employeeId)}/skills/maintenance`
}

export function buildMasterDataAgentMaintenancePayload(
  draft: MasterDataAgentMaintenanceDraft
): MasterDataAgentMaintenancePayload {
  return compactMasterDataAgentMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    employee_name: draft.employeeName,
    status: draft.status,
    employee_type: draft.employeeType,
    organization_id: draft.organizationId,
    workplace_id: draft.workplaceId,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataAgentSkillMaintenancePayload(
  draft: MasterDataAgentSkillMaintenanceDraft
): MasterDataAgentSkillMaintenancePayload {
  return {
    action: "replace",
    source_batch_id: draft.sourceBatchId,
    skill_ids: draft.skillIds,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  }
}

export function buildMasterDataWorkplaceMaintenancePayload(
  draft: MasterDataWorkplaceMaintenanceDraft
): MasterDataWorkplaceMaintenancePayload {
  return compactMasterDataWorkplaceMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    reference_name: draft.workplaceName,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataVendorMaintenancePayload(
  draft: MasterDataVendorMaintenanceDraft
): MasterDataVendorMaintenancePayload {
  return compactMasterDataVendorMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    reference_name: draft.vendorName,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataSkillMaintenancePayload(
  draft: MasterDataSkillMaintenanceDraft
): MasterDataSkillMaintenancePayload {
  return compactMasterDataSkillMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    reference_name: draft.skillName,
    skill_category: draft.skillCategory,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataOrganizationMaintenancePayload(
  draft: MasterDataOrganizationMaintenanceDraft
): MasterDataOrganizationMaintenancePayload {
  return compactMasterDataOrganizationMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    organization_name: draft.organizationName,
    organization_level: draft.organizationLevel,
    parent_organization_id: draft.parentOrganizationId,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataWorkplaceServiceTeamMaintenancePayload(
  draft: MasterDataWorkplaceServiceTeamMaintenanceDraft
): MasterDataWorkplaceServiceTeamMaintenancePayload {
  return compactMasterDataWorkplaceServiceTeamMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    workplace_id: draft.workplaceId,
    team_type: draft.teamType,
    team_name: draft.teamName,
    organization_id: draft.organizationId,
    supplier_id: draft.supplierId,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function summarizeMasterDataAgentMaintenanceFeedback(
  searchParams: Record<string, string | string[] | undefined>
): MasterDataAgentMaintenanceFeedback | null {
  return summarizeMasterDataMaintenanceFeedback(searchParams)
}

export function summarizeMasterDataMaintenanceFeedback(
  searchParams: Record<string, string | string[] | undefined>
): MasterDataAgentMaintenanceFeedback | null {
  const status = getSingleSearchParam(searchParams.maintenance_status)

  if (status === "success") {
    const recordId =
      getSingleSearchParam(searchParams.record_id) ||
      getSingleSearchParam(searchParams.employee_id) ||
      "未知对象"
    const recordName =
      getSingleSearchParam(searchParams.record_name) ||
      getSingleSearchParam(searchParams.employee_name) ||
      "未返回名称"
    const recordStatus =
      getSingleSearchParam(searchParams.record_status) ||
      getSingleSearchParam(searchParams.employee_status) ||
      "未知状态"
    const actionStatus = getSingleSearchParam(searchParams.action_status) || "submitted"
    const recordType = getSingleSearchParam(searchParams.record_type) || "人员"

    return {
      tone: "success",
      title: `${recordType}保存成功`,
      detail: `${recordId} ${recordName} 已 ${actionStatus}，当前状态 ${recordStatus}。`,
    }
  }

  if (status === "error") {
    const code =
      getSingleSearchParam(searchParams.maintenance_code) ||
      "MASTER_DATA_MAINTENANCE_SUBMIT_FAILED"
    const message = getSingleSearchParam(searchParams.maintenance_message) || "后端未返回错误说明"
    const recordType = getSingleSearchParam(searchParams.record_type) || "人员"

    return {
      tone: "error",
      title: `${recordType}保存失败`,
      detail: `${code}: ${message}`,
    }
  }

  return null
}

export function compactMasterDataAgentMaintenancePayload(
  payload: MasterDataAgentMaintenancePayload
): MasterDataAgentMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataAgentMaintenancePayload
}

export function compactMasterDataWorkplaceMaintenancePayload(
  payload: MasterDataWorkplaceMaintenancePayload
): MasterDataWorkplaceMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataWorkplaceMaintenancePayload
}

export function compactMasterDataVendorMaintenancePayload(
  payload: MasterDataVendorMaintenancePayload
): MasterDataVendorMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataVendorMaintenancePayload
}

export function compactMasterDataSkillMaintenancePayload(
  payload: MasterDataSkillMaintenancePayload
): MasterDataSkillMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataSkillMaintenancePayload
}

export function compactMasterDataOrganizationMaintenancePayload(
  payload: MasterDataOrganizationMaintenancePayload
): MasterDataOrganizationMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataOrganizationMaintenancePayload
}

export function compactMasterDataWorkplaceServiceTeamMaintenancePayload(
  payload: MasterDataWorkplaceServiceTeamMaintenancePayload
): MasterDataWorkplaceServiceTeamMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataWorkplaceServiceTeamMaintenancePayload
}
