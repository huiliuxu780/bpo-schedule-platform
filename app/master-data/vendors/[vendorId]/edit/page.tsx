import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataVendorEditPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataReferenceManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataReferences,
} from "@/app/master-data/agents/data"
import { submitMasterDataVendorMaintenance } from "../../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    vendorId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditMasterDataVendorPage({
  params,
  searchParams,
}: PageProps) {
  const { vendorId } = await params
  const decodedVendorId = decodeURIComponent(vendorId)
  const [batchResult, vendorResult] = await Promise.all([
    fetchImportBatches(),
    fetchMasterDataReferences("vendors"),
  ])
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "vendors",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const managementSummary = summarizeMasterDataReferenceManagement(
    "vendors",
    vendorResult.data ?? []
  )
  const vendor =
    managementSummary.rows.find((row) => row.reference_id === decodedVendorId) ??
    null

  if (!vendor && !vendorResult.error) {
    notFound()
  }

  return (
    <AppShell
      title="编辑供应商"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "供应商", href: "/master-data/vendors" },
        { label: "编辑" },
      ]}
    >
      <MasterDataVendorEditPage
        summary={summary}
        error={batchResult.error ?? vendorResult.error}
        feedback={feedback}
        vendor={vendor}
        action={submitMasterDataVendorMaintenance}
      />
    </AppShell>
  )
}
