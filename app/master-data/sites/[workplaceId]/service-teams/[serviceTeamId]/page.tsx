import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataWorkplaceServiceTeamDetailPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataWorkplaceDetail,
  summarizeMasterDataWorkplaceServiceTeamPeople,
} from "@/components/master-data-maintenance-model"
import {
  fetchMasterDataEmployees,
  fetchMasterDataReferences,
  fetchMasterDataWorkplaceBindings,
  fetchMasterDataWorkplaceServiceTeams,
} from "@/app/master-data/agents/data"
import { submitMasterDataWorkplaceServiceTeamMaintenance } from "../actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    workplaceId: string
    serviceTeamId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function MasterDataWorkplaceServiceTeamDetailRoute({
  params,
  searchParams,
}: PageProps) {
  const { workplaceId, serviceTeamId } = await params
  const decodedWorkplaceId = decodeURIComponent(workplaceId)
  const decodedServiceTeamId = decodeURIComponent(serviceTeamId)
  const [
    workplaceResult,
    supplierResult,
    employeeResult,
    bindingResult,
    serviceTeamResult,
  ] = await Promise.all([
    fetchMasterDataReferences("sites"),
    fetchMasterDataReferences("vendors"),
    fetchMasterDataEmployees(),
    fetchMasterDataWorkplaceBindings(),
    fetchMasterDataWorkplaceServiceTeams(decodedWorkplaceId),
  ])
  const detailSummary = summarizeMasterDataWorkplaceDetail({
    workplaceId: decodedWorkplaceId,
    workplaces: workplaceResult.data ?? [],
    suppliers: supplierResult.data ?? [],
    employees: employeeResult.data ?? [],
    bindings: bindingResult.data ?? [],
    serviceTeams: serviceTeamResult.data ?? [],
  })

  if (!detailSummary.found && !workplaceResult.error) {
    notFound()
  }

  const serviceTeam =
    (serviceTeamResult.data ?? []).find(
      (row) =>
        row.workplace_id === decodedWorkplaceId &&
        row.service_team_id === decodedServiceTeamId
    ) ?? null
  const serviceTeamRow =
    detailSummary.operatorRows.find(
      (row) =>
        row.source_type === "service_team" &&
        row.operator_key === decodedServiceTeamId
    ) ?? null
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const selectedFreezeServiceTeamId = getSingleSearchParam(
    resolvedSearchParams.freeze_service_team_id
  )
  const peopleSummary = summarizeMasterDataWorkplaceServiceTeamPeople({
    serviceTeam,
    employees: employeeResult.data ?? [],
    bindings: bindingResult.data ?? [],
  })

  return (
    <AppShell
      title={serviceTeamRow?.display.operatorNameLabel ?? "服务团队详情"}
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "职场", href: "/master-data/sites" },
        {
          label:
            detailSummary.workplace?.display.referenceNameLabel ??
            decodedWorkplaceId,
          href: `/master-data/sites/${encodeURIComponent(decodedWorkplaceId)}`,
        },
        { label: serviceTeamRow?.display.operatorNameLabel ?? "服务团队详情" },
      ]}
    >
      <MasterDataWorkplaceServiceTeamDetailPage
        detailSummary={detailSummary}
        serviceTeam={serviceTeam}
        serviceTeamRow={serviceTeamRow}
        peopleSummary={peopleSummary}
        showFreezeDialog={selectedFreezeServiceTeamId === decodedServiceTeamId}
        serviceTeamSubmitAction={submitMasterDataWorkplaceServiceTeamMaintenance}
        error={
          workplaceResult.error ??
          supplierResult.error ??
          employeeResult.error ??
          bindingResult.error ??
          serviceTeamResult.error
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
