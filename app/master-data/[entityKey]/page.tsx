import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import {
  MasterDataAgentManagementPage,
  MasterDataMaintenanceEntityDetail,
} from "@/components/master-data-maintenance-workbench"
import {
  type MasterDataAgentManagementFilters,
  type MasterDataMaintenanceEntityKey,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataMaintenanceEntityDetail,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataEmployees,
} from "@/app/master-data/agents/data"
import {
  submitMasterDataAgentMaintenance,
  submitMasterDataBindingMaintenance,
  submitMasterDataReferenceMaintenance,
} from "./actions"

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
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataMaintenanceEntityDetail(
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
  const selectedFreezeEmployeeId = getSingleSearchParam(
    resolvedSearchParams.freeze_employee_id
  )

  return (
    <AppShell
      title={entity.key === "agents" ? "客服人员" : `${entity.label}详情`}
      searchPlaceholder={
        entity.key === "agents" ? "搜索客服人员" : "搜索主数据对象或来源批次"
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
      ) : (
        <MasterDataMaintenanceEntityDetail
          summary={summary}
          error={batchResult.error}
          feedback={feedback}
          employeeList={employeeResult.data ?? []}
          employeeListError={employeeResult.error}
          referenceSubmitAction={
            isReferenceEntity(entity.key)
              ? submitMasterDataReferenceMaintenance
              : undefined
          }
          bindingSubmitAction={
            entity.key === "bindings"
              ? submitMasterDataBindingMaintenance
              : undefined
          }
        />
      )}
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
): entityKey is "sites" | "vendors" | "projects" | "skills" {
  return ["sites", "vendors", "projects", "skills"].includes(entityKey)
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}
