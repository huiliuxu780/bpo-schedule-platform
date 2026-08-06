import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataAgentDetailPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataAgentDetail,
  summarizeMasterDataMaintenanceFeedback,
} from "@/components/master-data-maintenance-model"
import { submitEmployeeRestrictions } from "@/app/master-data/agents/[employeeId]/actions"
import {
  fetchMasterDataEmployees,
  fetchMasterDataWorkplaceBindings,
  fetchMasterDataWorkplaceServiceTeams,
} from "@/app/master-data/agents/data"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    employeeId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function MasterDataAgentDetailRoute({
  params,
  searchParams,
}: PageProps) {
  const { employeeId } = await params
  const decodedEmployeeId = decodeURIComponent(employeeId)
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const [employeeResult, bindingResult, serviceTeamResult] = await Promise.all([
    fetchMasterDataEmployees(),
    fetchMasterDataWorkplaceBindings(),
    fetchMasterDataWorkplaceServiceTeams(),
  ])
  const detailSummary = summarizeMasterDataAgentDetail({
    employeeId: decodedEmployeeId,
    employees: employeeResult.data ?? [],
    bindings: bindingResult.data ?? [],
    serviceTeams: serviceTeamResult.data ?? [],
  })

  if (!detailSummary.found && !employeeResult.error) {
    notFound()
  }

  return (
    <AppShell
      title={detailSummary.title}
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "客服人员", href: "/master-data/agents" },
        { label: detailSummary.title },
      ]}
    >
      <MasterDataAgentDetailPage
        detailSummary={detailSummary}
        error={employeeResult.error ?? bindingResult.error ?? serviceTeamResult.error}
        feedback={summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)}
        restrictionsAction={submitEmployeeRestrictions}
      />
    </AppShell>
  )
}
