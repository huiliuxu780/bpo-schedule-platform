import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataSkillEditPage } from "@/components/master-data-maintenance-workbench"
import {
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
  summarizeMasterDataReferenceManagement,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchMasterDataReferences,
} from "@/app/master-data/agents/data"
import { submitMasterDataSkillMaintenance } from "../../../[entityKey]/actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    skillId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditMasterDataSkillPage({
  params,
  searchParams,
}: PageProps) {
  const { skillId } = await params
  const decodedSkillId = decodeURIComponent(skillId)
  const [batchResult, skillResult] = await Promise.all([
    fetchImportBatches(),
    fetchMasterDataReferences("skills"),
  ])
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const summary = summarizeMasterDataEntitySourceContext(
    "skills",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const managementSummary = summarizeMasterDataReferenceManagement(
    "skills",
    skillResult.data ?? []
  )
  const skill =
    managementSummary.rows.find((row) => row.reference_id === decodedSkillId) ??
    null

  if (!skill && !skillResult.error) {
    notFound()
  }

  return (
    <AppShell
      title="编辑技能组"
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "技能", href: "/master-data/skills" },
        { label: "编辑" },
      ]}
    >
      <MasterDataSkillEditPage
        summary={summary}
        error={batchResult.error ?? skillResult.error}
        feedback={feedback}
        skill={skill}
        action={submitMasterDataSkillMaintenance}
      />
    </AppShell>
  )
}
