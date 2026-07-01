import { AppShell } from "@/components/app-shell"
import { RosterDraftWorkbench } from "@/components/roster-draft-workbench"
import { WorkbenchPageHeader } from "@/components/workbench-page-header"
import { rosterDraftDemoFixture } from "@/lib/roster-draft-fixtures"
import {
  generateRosterDraftViewModel,
  getRosterDraftTargetMonths,
} from "@/lib/roster-drafts"

type PageProps = {
  searchParams: Promise<{
    month?: string
  }>
}

export default async function RosterDraftsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const targetMonths = getRosterDraftTargetMonths(rosterDraftDemoFixture)
  const targetMonth = targetMonths.includes(params.month ?? "")
    ? params.month ?? targetMonths[0]
    : targetMonths[0]
  const model = generateRosterDraftViewModel({
    fixture: rosterDraftDemoFixture,
    targetMonth,
  })

  return (
    <AppShell
      title="月班表草稿"
      breadcrumbItems={[{ label: "月班表草稿" }]}
    >
      <main className="@container/main flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-4 md:gap-6 lg:p-6">
        <WorkbenchPageHeader description="按目标月份生成下月人员级班表草稿，在月度扫盘和周度处理之间定位异常与待确认格子。" />
        <RosterDraftWorkbench
          key={targetMonth}
          model={model}
          targetMonths={targetMonths}
        />
      </main>
    </AppShell>
  )
}
