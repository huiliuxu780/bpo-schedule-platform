import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import {
  MasterDataAgentManagementPage,
  MasterDataBindingManagementPage,
  MasterDataOrganizationManagementPage,
  MasterDataReferenceManagementPage,
} from "@/components/master-data-maintenance-workbench"
import {
  type MasterDataAgentManagementFilters,
  type MasterDataMaintenanceEntityKey,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataBindingManagement,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataOrganizationManagement,
  summarizeMasterDataReferenceManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchMasterDataBindings,
  fetchImportBatches,
  fetchMasterDataEmployees,
  fetchMasterDataOrganizations,
  fetchMasterDataReferences,
} from "@/app/master-data/agents/data"
import { submitMasterDataAgentMaintenance } from "./actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    entityKey: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function MasterDataEntityDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { entityKey } = await params
  const entity = getMasterDataMaintenanceEntity(decodeURIComponent(entityKey))

  if (!entity) {
    notFound()
  }

  const batchResult = await fetchImportBatches()
  const employeeResult =
    entity.key === "agents"
      ? await fetchMasterDataEmployees()
      : { data: [], error: null }
  const organizationResult =
    entity.key === "organizations"
      ? await fetchMasterDataOrganizations()
      : { data: [], error: null }
  const referenceResult =
    isReferenceEntity(entity.key)
      ? await fetchMasterDataReferences(entity.key)
      : { data: [], error: null }
  const bindingResult =
    entity.key === "bindings"
      ? await fetchMasterDataBindings()
      : { data: [], error: null }
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    entity.key as MasterDataMaintenanceEntityKey,
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const agentManagementSummary =
    entity.key === "agents"
      ? summarizeMasterDataAgentManagement(
          employeeResult.data ?? [],
          resolveAgentManagementFilters(resolvedSearchParams)
        )
      : null
  const referenceManagementSummary = isReferenceEntity(entity.key)
    ? summarizeMasterDataReferenceManagement(entity.key, referenceResult.data ?? [])
    : null
  const organizationManagementSummary =
    entity.key === "organizations"
      ? summarizeMasterDataOrganizationManagement(organizationResult.data ?? [])
      : null
  const bindingManagementSummary =
    entity.key === "bindings"
      ? summarizeMasterDataBindingManagement(bindingResult.data ?? [])
      : null
  const selectedFreezeEmployeeId = getSingleSearchParam(
    resolvedSearchParams.freeze_employee_id
  )

  return (
    <AppShell
      title={entity.key === "agents" ? "客服人员" : entity.label}
      searchPlaceholder={
        entity.key === "agents" ? "搜索客服人员" : `搜索${entity.label}`
      }
    >
      {entity.key === "agents" && agentManagementSummary ? (
        <MasterDataAgentManagementPage
          summary={summary}
          managementSummary={agentManagementSummary}
          error={batchResult.error}
          feedback={feedback}
          employeeListError={employeeResult.error}
          selectedFreezeEmployeeId={selectedFreezeEmployeeId}
          agentSubmitAction={submitMasterDataAgentMaintenance}
        />
      ) : entity.key === "organizations" && organizationManagementSummary ? (
        <MasterDataOrganizationManagementPage
          summary={summary}
          listSummary={organizationManagementSummary}
          error={organizationResult.error ?? batchResult.error}
          feedback={feedback}
        />
      ) : isReferenceEntity(entity.key) && referenceManagementSummary ? (
        <MasterDataReferenceManagementPage
          summary={summary}
          listSummary={referenceManagementSummary}
          error={referenceResult.error ?? batchResult.error}
          feedback={feedback}
        />
      ) : entity.key === "bindings" && bindingManagementSummary ? (
        <MasterDataBindingManagementPage
          summary={summary}
          listSummary={bindingManagementSummary}
          error={bindingResult.error ?? batchResult.error}
          feedback={feedback}
        />
      ) : null}
    </AppShell>
  )
}

function resolveAgentManagementFilters(
  searchParams: Record<string, string | string[] | undefined>
): MasterDataAgentManagementFilters {
  return {
    employee_name: getSingleSearchParam(searchParams.employee_name),
    skill_group: getSingleSearchParam(searchParams.skill_group),
    employee_id: getSingleSearchParam(searchParams.employee_id),
    status: getSingleSearchParam(searchParams.status),
    organization: getSingleSearchParam(searchParams.organization),
    workplace: getSingleSearchParam(searchParams.workplace),
    employee_type: getSingleSearchParam(searchParams.employee_type),
  }
}

function isReferenceEntity(
  entityKey: MasterDataMaintenanceEntityKey
): entityKey is "sites" | "vendors" | "skills" {
  return ["sites", "vendors", "skills"].includes(entityKey)
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}
