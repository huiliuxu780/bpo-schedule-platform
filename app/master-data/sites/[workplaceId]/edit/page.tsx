import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataWorkplaceEditPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataReferenceManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataReferences,
} from "@/app/master-data/agents/data"
import { submitMasterDataWorkplaceMaintenance } from "../../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    workplaceId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditMasterDataWorkplacePage({
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
  const managementSummary = summarizeMasterDataReferenceManagement(
    "sites",
    workplaceResult.data ?? []
  )
  const workplace =
    managementSummary.rows.find(
      (row) => row.reference_id === decodedWorkplaceId
    ) ?? null

  if (!workplace && !workplaceResult.error) {
    notFound()
  }

  return (
    <AppShell
      title="编辑职场"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "职场", href: "/master-data/sites" },
        { label: "编辑" },
      ]}
    >
      <MasterDataWorkplaceEditPage
        summary={summary}
        error={batchResult.error ?? workplaceResult.error}
        feedback={feedback}
        workplace={workplace}
        action={submitMasterDataWorkplaceMaintenance}
      />
    </AppShell>
  )
}
