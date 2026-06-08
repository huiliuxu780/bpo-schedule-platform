import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataWorkplaceServiceTeamCreatePage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataReferenceManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataReferences,
} from "@/app/master-data/agents/data"
import { submitMasterDataWorkplaceServiceTeamMaintenance } from "../actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    workplaceId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewMasterDataWorkplaceServiceTeamPage({
  params,
  searchParams,
}: PageProps) {
  const { workplaceId } = await params
  const decodedWorkplaceId = decodeURIComponent(workplaceId)
  const [batchResult, workplaceResult] = await Promise.all([
    fetchImportBatches(),
    fetchMasterDataReferences("sites"),
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

  if (!workplace && !workplaceResult.error) {
    notFound()
  }

  return (
    <AppShell
      title="新增服务团队"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "职场", href: "/master-data/sites" },
        {
          label: workplace?.display.referenceNameLabel ?? decodedWorkplaceId,
          href: `/master-data/sites/${encodeURIComponent(decodedWorkplaceId)}`,
        },
        { label: "新增服务团队" },
      ]}
    >
      <MasterDataWorkplaceServiceTeamCreatePage
        summary={summary}
        error={batchResult.error ?? workplaceResult.error}
        feedback={feedback}
        workplaceId={decodedWorkplaceId}
        action={submitMasterDataWorkplaceServiceTeamMaintenance}
      />
    </AppShell>
  )
}
