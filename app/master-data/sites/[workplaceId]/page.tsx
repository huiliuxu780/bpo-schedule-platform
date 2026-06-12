import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import {
  MasterDataWorkplaceDetailPage,
  MasterDataWorkplaceServiceTeamPageActions,
} from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataWorkplaceDetail,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataEmployees,
  fetchMasterDataReferences,
  fetchMasterDataWorkplaceBindings,
  fetchMasterDataWorkplaceServiceTeams,
} from "@/app/master-data/agents/data"
import { submitMasterDataWorkplaceServiceTeamMaintenance } from "./service-teams/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    workplaceId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function MasterDataWorkplaceDetailRoute({
  params,
  searchParams,
}: PageProps) {
  const { workplaceId } = await params
  const decodedWorkplaceId = decodeURIComponent(workplaceId)
  const [
    batchResult,
    workplaceResult,
    supplierResult,
    employeeResult,
    bindingResult,
    serviceTeamResult,
  ] =
    await Promise.all([
      fetchImportBatches(),
      fetchMasterDataReferences("sites"),
      fetchMasterDataReferences("vendors"),
      fetchMasterDataEmployees(),
      fetchMasterDataWorkplaceBindings(),
      fetchMasterDataWorkplaceServiceTeams(decodedWorkplaceId),
    ])
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const selectedFreezeServiceTeamId = getSingleSearchParam(
    resolvedSearchParams.freeze_service_team_id
  )
  const detailSummary = summarizeMasterDataWorkplaceDetail({
    workplaceId: decodedWorkplaceId,
    workplaces: workplaceResult.data ?? [],
    suppliers: supplierResult.data ?? [],
    employees: employeeResult.data ?? [],
    bindings: bindingResult.data ?? [],
    serviceTeams: serviceTeamResult.data ?? [],
  })

  if (!detailSummary.found) {
    notFound()
  }

  return (
    <AppShell
      title={detailSummary.title}
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "职场", href: "/master-data/sites" },
        { label: detailSummary.title },
      ]}
      actions={
        <MasterDataWorkplaceServiceTeamPageActions
          detailSummary={detailSummary}
        />
      }
    >
      <MasterDataWorkplaceDetailPage
        detailSummary={detailSummary}
        feedback={feedback}
        selectedFreezeServiceTeamId={selectedFreezeServiceTeamId}
        serviceTeamSubmitAction={submitMasterDataWorkplaceServiceTeamMaintenance}
        error={
          workplaceResult.error ??
          supplierResult.error ??
          employeeResult.error ??
          bindingResult.error ??
          serviceTeamResult.error ??
          batchResult.error
        }
      />
    </AppShell>
  )
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}
