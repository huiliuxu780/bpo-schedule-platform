import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataOrganizationDetailPage } from "@/components/master-data-maintenance-workbench"
import { summarizeMasterDataOrganizationDetail } from "@/components/master-data-maintenance-model"
import {
  fetchMasterDataEmployees,
  fetchMasterDataOrganizations,
} from "@/app/master-data/agents/data"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    organizationId: string
  }>
}

export default async function MasterDataOrganizationDetailRoute({
  params,
}: PageProps) {
  const { organizationId } = await params
  const decodedOrganizationId = decodeURIComponent(organizationId)
  const [organizationResult, employeeResult] = await Promise.all([
    fetchMasterDataOrganizations(),
    fetchMasterDataEmployees(),
  ])
  const detailSummary = summarizeMasterDataOrganizationDetail({
    organizationId: decodedOrganizationId,
    organizations: organizationResult.data ?? [],
    employees: employeeResult.data ?? [],
  })

  if (!detailSummary.found && !organizationResult.error) {
    notFound()
  }

  return (
    <AppShell
      title={detailSummary.title}
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "组织", href: "/master-data/organizations" },
        { label: detailSummary.title },
      ]}
    >
      <MasterDataOrganizationDetailPage
        detailSummary={detailSummary}
        error={organizationResult.error ?? employeeResult.error}
      />
    </AppShell>
  )
}
