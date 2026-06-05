import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import {
  MasterDataAgentPageActions,
  MasterDataAgentManagementPage,
  MasterDataOrganizationManagementPage,
  MasterDataReferenceManagementPage,
} from "@/components/master-data-maintenance-workbench"
import {
  type MasterDataAgentManagementFilters,
  type MasterDataMaintenanceEntityKey,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataOrganizationManagement,
  summarizeMasterDataReferenceManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchImportFieldMappingTemplates,
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
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const employeeResult =
    entity.key === "agents"
      ? await fetchMasterDataEmployees()
      : { data: [], error: null }
  const templateResult =
    entity.key === "agents"
      ? await fetchImportFieldMappingTemplates()
      : { data: [], error: null }
  const organizationResult =
    entity.key === "organizations"
      ? await fetchMasterDataOrganizations()
      : { data: [], error: null }
  const referenceResult =
    isReferenceEntity(entity.key)
      ? await fetchMasterDataReferences(entity.key)
      : { data: [], error: null }
  const summary = summarizeMasterDataEntitySourceContext(
    entity.key as MasterDataMaintenanceEntityKey,
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const agentManagementSummary =
    entity.key === "agents"
      ? summarizeMasterDataAgentManagement(
          employeeResult.data ?? [],
          resolveAgentManagementFilters(resolvedSearchParams),
          {
            batches: batchResult.data ?? [],
            templates: templateResult.data ?? [],
            uploadStatus: getSingleSearchParam(resolvedSearchParams.upload),
            uploadReason: getSingleSearchParam(resolvedSearchParams.reason),
            uploadBatchId: getSingleSearchParam(resolvedSearchParams.batch),
          }
        )
      : null
  const referenceManagementSummary = isReferenceEntity(entity.key)
    ? summarizeMasterDataReferenceManagement(entity.key, referenceResult.data ?? [])
    : null
  const organizationManagementSummary =
    entity.key === "organizations"
      ? summarizeMasterDataOrganizationManagement(organizationResult.data ?? [])
      : null
  const selectedFreezeEmployeeId = getSingleSearchParam(
    resolvedSearchParams.freeze_employee_id
  )

  return (
    <AppShell
      title={entity.key === "agents" ? "客服人员" : entity.label}
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: entity.key === "agents" ? "客服人员" : entity.label },
      ]}
      actions={
        entity.key === "agents" && agentManagementSummary ? (
          <MasterDataAgentPageActions summary={agentManagementSummary} />
        ) : null
      }
    >
      {entity.key === "agents" && agentManagementSummary ? (
        <MasterDataAgentManagementPage
          summary={summary}
          managementSummary={agentManagementSummary}
          error={batchResult.error}
          templateError={templateResult.error}
          feedback={feedback}
          employeeListError={employeeResult.error}
          importDialogOpen={
            getSingleSearchParam(resolvedSearchParams.import_dialog) === "1" ||
            Boolean(getSingleSearchParam(resolvedSearchParams.upload))
          }
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
