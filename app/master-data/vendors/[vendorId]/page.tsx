import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataVendorDetailPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataVendorDetail,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataReferences,
  fetchMasterDataWorkplaceBindings,
  fetchMasterDataWorkplaceServiceTeams,
} from "@/app/master-data/agents/data"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    vendorId: string
  }>
}

export default async function MasterDataVendorDetailRoute({
  params,
}: PageProps) {
  const { vendorId } = await params
  const decodedVendorId = decodeURIComponent(vendorId)
  const [batchResult, vendorResult, workplaceResult, bindingResult, serviceTeamResult] =
    await Promise.all([
      fetchImportBatches(),
      fetchMasterDataReferences("vendors"),
      fetchMasterDataReferences("sites"),
      fetchMasterDataWorkplaceBindings(),
      fetchMasterDataWorkplaceServiceTeams(),
    ])
  const summary = summarizeMasterDataEntitySourceContext(
    "vendors",
    batchResult.data ?? []
  )
  const detailSummary = summarizeMasterDataVendorDetail({
    vendorId: decodedVendorId,
    vendors: vendorResult.data ?? [],
    workplaces: workplaceResult.data ?? [],
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
        { label: "供应商", href: "/master-data/vendors" },
        { label: detailSummary.title },
      ]}
    >
      <MasterDataVendorDetailPage
        summary={summary}
        detailSummary={detailSummary}
        error={
          vendorResult.error ??
          workplaceResult.error ??
          bindingResult.error ??
          serviceTeamResult.error ??
          batchResult.error
        }
      />
    </AppShell>
  )
}
