import { AppShell } from "@/components/app-shell"
import { MasterDataAgentCreatePage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataMaintenanceEntityDetail,
} from "@/components/master-data-maintenance-model"
import { fetchImportBatches } from "@/app/master-data/agents/data"
import { submitMasterDataAgentMaintenance } from "../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewMasterDataAgentPage({
  searchParams,
}: PageProps) {
  const batchResult = await fetchImportBatches()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataMaintenanceEntityDetail(
    "agents",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)

  return (
    <AppShell title="新建客服人员" searchPlaceholder="搜索客服人员">
      <MasterDataAgentCreatePage
        summary={summary}
        error={batchResult.error}
        feedback={feedback}
        action={submitMasterDataAgentMaintenance}
      />
    </AppShell>
  )
}
