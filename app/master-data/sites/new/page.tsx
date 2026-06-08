import { AppShell } from "@/components/app-shell"
import { MasterDataWorkplaceCreatePage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
} from "@/components/master-data-maintenance-model"
import { fetchImportBatches } from "@/app/master-data/agents/data"
import { submitMasterDataWorkplaceMaintenance } from "../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewMasterDataWorkplacePage({
  searchParams,
}: PageProps) {
  const batchResult = await fetchImportBatches()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "sites",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)

  return (
    <AppShell
      title="新建职场"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "职场", href: "/master-data/sites" },
        { label: "新建" },
      ]}
    >
      <MasterDataWorkplaceCreatePage
        summary={summary}
        error={batchResult.error}
        feedback={feedback}
        action={submitMasterDataWorkplaceMaintenance}
      />
    </AppShell>
  )
}
