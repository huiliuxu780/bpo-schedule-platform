import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataWorkplaceDetailPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataWorkplaceDetail,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataEmployees,
  fetchMasterDataReferences,
  fetchMasterDataWorkplaceBindings,
} from "@/app/master-data/agents/data"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    workplaceId: string
  }>
}

export default async function MasterDataWorkplaceDetailRoute({
  params,
}: PageProps) {
  const { workplaceId } = await params
  const decodedWorkplaceId = decodeURIComponent(workplaceId)
  const [batchResult, workplaceResult, employeeResult, bindingResult] =
    await Promise.all([
      fetchImportBatches(),
      fetchMasterDataReferences("sites"),
      fetchMasterDataEmployees(),
      fetchMasterDataWorkplaceBindings(),
    ])
  const summary = summarizeMasterDataEntitySourceContext(
    "sites",
    batchResult.data ?? []
  )
  const detailSummary = summarizeMasterDataWorkplaceDetail({
    workplaceId: decodedWorkplaceId,
    workplaces: workplaceResult.data ?? [],
    employees: employeeResult.data ?? [],
    bindings: bindingResult.data ?? [],
  })

  if (!detailSummary.found) {
    notFound()
  }

  return (
    <AppShell title="职场详情" searchPlaceholder="搜索职场">
      <MasterDataWorkplaceDetailPage
        summary={summary}
        detailSummary={detailSummary}
        error={
          workplaceResult.error ??
          employeeResult.error ??
          bindingResult.error ??
          batchResult.error
        }
      />
    </AppShell>
  )
}
