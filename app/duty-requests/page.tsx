import { AppShell } from "@/components/app-shell"
import { DutyRequestCenterWorkbench } from "@/components/duty-request-center-workbench"
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

export default async function DutyRequestsPage({ searchParams }: PageProps) {
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
      title="班务申请中心"
      breadcrumbItems={[{ label: "班务申请中心" }]}
    >
      <main className="@container/main flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-col overflow-hidden bg-muted/40 p-0">
        <DutyRequestCenterWorkbench
          key={targetMonth}
          model={model}
          targetMonths={targetMonths}
        />
      </main>
    </AppShell>
  )
}
