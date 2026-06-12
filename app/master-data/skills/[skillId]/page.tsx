import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { MasterDataSkillDetailPage } from "@/components/master-data-maintenance-workbench"
import { summarizeMasterDataSkillDetail } from "@/components/master-data-maintenance-model"
import {
  fetchMasterDataEmployees,
  fetchMasterDataSkills,
} from "@/app/master-data/agents/data"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    skillId: string
  }>
}

export default async function MasterDataSkillDetailRoute({ params }: PageProps) {
  const { skillId } = await params
  const decodedSkillId = decodeURIComponent(skillId)
  const [skillResult, employeeResult] = await Promise.all([
    fetchMasterDataSkills(),
    fetchMasterDataEmployees(),
  ])
  const detailSummary = summarizeMasterDataSkillDetail({
    skillId: decodedSkillId,
    skills: skillResult.data ?? [],
    employees: employeeResult.data ?? [],
  })

  if (!detailSummary.found && !skillResult.error) {
    notFound()
  }

  return (
    <AppShell
      title={detailSummary.title}
      breadcrumbItems={[
        { label: "主数据", href: "/master-data/agents" },
        { label: "技能", href: "/master-data/skills" },
        { label: detailSummary.title },
      ]}
    >
      <MasterDataSkillDetailPage
        detailSummary={detailSummary}
        error={skillResult.error ?? employeeResult.error}
      />
    </AppShell>
  )
}
