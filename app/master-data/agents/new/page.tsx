import { AppShell } from "@/components/app-shell"
import { MasterDataAgentCreatePage } from "@/components/master-data-maintenance-workbench"
import {
  resolveMasterDataAgentReturnPath,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataEntitySourceContext,
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
  const summary = summarizeMasterDataEntitySourceContext(
    "agents",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  // 宿主页回跳目标：仅接受白名单值（model 内校验），未知值兜底旧路由。
  const returnPath = resolveMasterDataAgentReturnPath(
    getSingleSearchParam(resolvedSearchParams.return_path)
  )

  return (
    <AppShell
      title="新建客服人员"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "客服人员", href: "/master-data/agents" },
        { label: "新建" },
      ]}
    >
      <MasterDataAgentCreatePage
        summary={summary}
        error={batchResult.error}
        feedback={feedback}
        action={submitMasterDataAgentMaintenance}
        returnPath={returnPath}
      />
    </AppShell>
  )
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}
