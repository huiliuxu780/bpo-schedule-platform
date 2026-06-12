import { AppShell } from "@/components/app-shell"
import { MasterDataOrganizationCreatePage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
} from "@/components/master-data-maintenance-model"
import { fetchImportBatches } from "@/app/master-data/agents/data"
import { submitMasterDataOrganizationMaintenance } from "../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewMasterDataOrganizationPage({
  searchParams,
}: PageProps) {
  const batchResult = await fetchImportBatches()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "organizations",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)

  return (
    <AppShell
      title="新建组织"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "组织", href: "/master-data/organizations" },
        { label: "新建" },
      ]}
    >
      <MasterDataOrganizationCreatePage
        summary={summary}
        error={batchResult.error}
        feedback={feedback}
        action={submitMasterDataOrganizationMaintenance}
      />
    </AppShell>
  )
}
