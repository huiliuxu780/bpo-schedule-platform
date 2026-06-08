import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataWorkplaceServiceTeamEditPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataReferenceManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataReferences,
  fetchMasterDataWorkplaceServiceTeams,
} from "@/app/master-data/agents/data"
import { submitMasterDataWorkplaceServiceTeamMaintenance } from "../../actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    workplaceId: string
    serviceTeamId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditMasterDataWorkplaceServiceTeamPage({
  params,
  searchParams,
}: PageProps) {
  const { workplaceId, serviceTeamId } = await params
  const decodedWorkplaceId = decodeURIComponent(workplaceId)
  const decodedServiceTeamId = decodeURIComponent(serviceTeamId)
  const [batchResult, workplaceResult, serviceTeamResult] = await Promise.all([
    fetchImportBatches(),
    fetchMasterDataReferences("sites"),
    fetchMasterDataWorkplaceServiceTeams(decodedWorkplaceId),
  ])
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "sites",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const workplaceSummary = summarizeMasterDataReferenceManagement(
    "sites",
    workplaceResult.data ?? []
  )
  const workplace =
    workplaceSummary.rows.find((row) => row.reference_id === decodedWorkplaceId) ??
    null
  const serviceTeam =
    (serviceTeamResult.data ?? []).find(
      (row) => row.service_team_id === decodedServiceTeamId
    ) ?? null

  if ((!workplace && !workplaceResult.error) || (!serviceTeam && !serviceTeamResult.error)) {
    notFound()
  }

  return (
    <AppShell
      title="编辑服务团队"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "职场", href: "/master-data/sites" },
        {
          label: workplace?.display.referenceNameLabel ?? decodedWorkplaceId,
          href: `/master-data/sites/${encodeURIComponent(decodedWorkplaceId)}`,
        },
        { label: "编辑服务团队" },
      ]}
    >
      <MasterDataWorkplaceServiceTeamEditPage
        summary={summary}
        error={
          batchResult.error ?? workplaceResult.error ?? serviceTeamResult.error
        }
        feedback={feedback}
        workplaceId={decodedWorkplaceId}
        serviceTeam={serviceTeam}
        action={submitMasterDataWorkplaceServiceTeamMaintenance}
      />
    </AppShell>
  )
}
