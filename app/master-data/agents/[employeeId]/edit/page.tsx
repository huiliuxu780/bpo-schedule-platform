import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataAgentEditPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataAgentManagement,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataMaintenanceEntityDetail,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataEmployees,
} from "@/app/master-data/agents/data"
import { submitMasterDataAgentMaintenance } from "../../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    employeeId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditMasterDataAgentPage({
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
  const summary = summarizeMasterDataMaintenanceEntityDetail(
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
    <AppShell title="编辑客服人员" searchPlaceholder="搜索客服人员">
      <MasterDataAgentEditPage
        summary={summary}
        error={batchResult.error ?? employeeResult.error}
        feedback={feedback}
        employee={employee}
        action={submitMasterDataAgentMaintenance}
      />
    </AppShell>
  )
}
