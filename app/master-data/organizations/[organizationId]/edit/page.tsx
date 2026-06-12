import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataOrganizationEditPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataOrganizationManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataOrganizations,
} from "@/app/master-data/agents/data"
import { submitMasterDataOrganizationMaintenance } from "../../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    organizationId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditMasterDataOrganizationPage({
  params,
  searchParams,
}: PageProps) {
  const { organizationId } = await params
  const decodedOrganizationId = decodeURIComponent(organizationId)
  const [batchResult, organizationResult] = await Promise.all([
    fetchImportBatches(),
    fetchMasterDataOrganizations(),
  ])
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "organizations",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const managementSummary = summarizeMasterDataOrganizationManagement(
    organizationResult.data ?? []
  )
  const organization =
    managementSummary.rows.find(
      (row) => row.organization_id === decodedOrganizationId
    ) ?? null

  if (!organization && !organizationResult.error) {
    notFound()
  }

  return (
    <AppShell
      title="编辑组织"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "组织", href: "/master-data/organizations" },
        { label: "编辑" },
      ]}
    >
      <MasterDataOrganizationEditPage
        summary={summary}
        error={batchResult.error ?? organizationResult.error}
        feedback={feedback}
        organization={organization}
        action={submitMasterDataOrganizationMaintenance}
      />
    </AppShell>
  )
}
