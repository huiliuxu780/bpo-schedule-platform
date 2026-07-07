import { AppShell } from "@/components/app-shell"
import { RosterChangeGovernanceWorkbench } from "@/components/roster-change-governance-workbench"
import { rosterDraftDemoFixture } from "@/lib/roster-draft-fixtures"
import {
  generateRosterDraftViewModel,
  getRosterDraftTargetMonths,
} from "@/lib/roster-drafts"

type PageProps = {
  searchParams: Promise<{
    month?: string
    revision_id?: string
    cell_id?: string
    issue_id?: string
    visibility?: string
    employee_id?: string
    requester_id?: string
  }>
}

export default async function RosterChangeGovernancePage({
  searchParams,
}: PageProps) {
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
      title="班表变更中心"
      breadcrumbItems={[{ label: "班表变更中心" }]}
    >
      <main className="@container/main flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-col overflow-hidden bg-muted/40 p-0">
        <RosterChangeGovernanceWorkbench
          key={targetMonth}
          model={model}
          targetMonths={targetMonths}
          initialCellId={params.cell_id ?? null}
          initialIssueId={params.issue_id ?? null}
          initialVisibility={params.visibility ?? "scheduler"}
          initialEmployeeId={params.employee_id ?? null}
          initialRequesterId={params.requester_id ?? null}
        />
      </main>
    </AppShell>
  )
}
