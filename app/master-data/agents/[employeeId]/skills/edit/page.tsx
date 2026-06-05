import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataAgentSkillsEditPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataAgentManagement,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataEntitySourceContext,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataEmployees,
} from "@/app/master-data/agents/data"
import { submitMasterDataAgentSkillMaintenance } from "../../../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    employeeId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditMasterDataAgentSkillsPage({
  params,
  searchParams,
}: PageProps) {
  const { employeeId } = await params
  const decodedEmployeeId = decodeURIComponent(employeeId)
  const [batchResult, employeeResult] = await Promise.all([
    fetchImportBatches(),
    fetchMasterDataEmployees(),
  ])
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "agents",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const managementSummary = summarizeMasterDataAgentManagement(
    employeeResult.data ?? []
  )
  const employee =
    managementSummary.rows.find((row) => row.employee_id === decodedEmployeeId) ??
    null

  if (!employee && !employeeResult.error) {
    notFound()
  }

  return (
    <AppShell title="维护客服技能组" searchPlaceholder="搜索客服人员">
      <MasterDataAgentSkillsEditPage
        summary={summary}
        error={batchResult.error ?? employeeResult.error}
        feedback={feedback}
        employee={employee}
        action={submitMasterDataAgentSkillMaintenance}
      />
    </AppShell>
  )
}
