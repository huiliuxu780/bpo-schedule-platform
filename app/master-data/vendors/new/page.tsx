import { AppShell } from "@/components/app-shell"
import { MasterDataVendorCreatePage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
} from "@/components/master-data-maintenance-model"
import { fetchImportBatches } from "@/app/master-data/agents/data"
import { submitMasterDataVendorMaintenance } from "../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewMasterDataVendorPage({
  searchParams,
}: PageProps) {
  const batchResult = await fetchImportBatches()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "vendors",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)

  return (
    <AppShell
      title="新建供应商"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "供应商", href: "/master-data/vendors" },
        { label: "新建" },
      ]}
    >
      <MasterDataVendorCreatePage
        summary={summary}
        error={batchResult.error}
        feedback={feedback}
        action={submitMasterDataVendorMaintenance}
      />
    </AppShell>
  )
}
