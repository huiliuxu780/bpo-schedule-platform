import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { MvpFlowSummary } from "@/components/mvp-flow-summary"
import { SchedulePlanTable } from "@/components/schedule-plan-table"
import { ScheduleRiskTable } from "@/components/schedule-risk-table"
import {
  buildPersonnelScheduleIntervalExpansion,
  getImportedPersonnelScheduleDetails,
  summarizePersonnelScheduleDetails,
} from "@/lib/personnel-schedule-details"
import {
  formatCoverageRate,
  getSchedulePlansWithFilters,
  getScheduleRisks,
  schedulePlanStatusLabel,
  type SchedulePlanStatus,
} from "@/lib/schedule-plans"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const statusOptions: { label: string; value?: SchedulePlanStatus }[] = [
  { label: "全部" },
  { label: "草稿", value: "draft" },
  { label: "待复核", value: "review_ready" },
  { label: "已发布", value: "published" },
]

type PageProps = {
  searchParams: Promise<{
    query?: string
    status?: string
  }>
}

function parseStatus(status?: string): SchedulePlanStatus | undefined {
  if (
    status === "draft" ||
    status === "review_ready" ||
    status === "published"
  ) {
    return status
  }

  return undefined
}

function statusHref(status: SchedulePlanStatus | undefined, query: string) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  if (status) {
    searchParams.set("status", status)
  }

  const suffix = searchParams.toString()
  return `/schedule-plans${suffix ? `?${suffix}` : ""}`
}

export default async function SchedulePlansPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const plans = await getSchedulePlansWithFilters({ query, status })
  const personnelScheduleRows = await getImportedPersonnelScheduleDetails()
  const personnelScheduleSummary = summarizePersonnelScheduleDetails(personnelScheduleRows)
  const personnelScheduleIntervalExpansions =
    buildPersonnelScheduleIntervalExpansion(personnelScheduleRows)
  const importedPersonnelScheduleRows = personnelScheduleRows.filter(
    (row) => row.sourceBatchId
  )
  const risks = await getScheduleRisks(query)
  const totalForecast = plans.reduce((sum, plan) => sum + plan.forecast_agents, 0)
  const totalScheduled = plans.reduce(
    (sum, plan) => sum + plan.scheduled_agents,
    0
  )
  const totalGap = plans.reduce((sum, plan) => sum + plan.gap_agents, 0)
  const coverageRate =
    plans.length === 0 ? 0 : totalForecast === 0 ? 1 : totalScheduled / totalForecast
  const highRiskCount = risks.filter((risk) => risk.risk_level === "high").length

  return (
    <AppShell title="排班计划" searchPlaceholder="搜索计划、项目或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">排班计划</h1>
            <p className="text-sm text-muted-foreground">
              查看计划列表，并创建排班草稿
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/schedule-plans/new">新建草稿</Link>
          </Button>
        </div>
        <section className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <form className="flex min-w-64 flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                name="query"
                defaultValue={query}
                placeholder="搜索计划编号、日期、项目、职场"
                className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {status ? <input name="status" type="hidden" value={status} /> : null}
            <Button type="submit" variant="outline" size="sm">
              搜索
            </Button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((option) => {
              const active = option.value === status || (!option.value && !status)

              return (
                <Button
                  key={option.label}
                  asChild
                  variant={active ? "default" : "outline"}
                  size="sm"
                >
                  <Link href={statusHref(option.value, query)}>
                    {option.label}
                  </Link>
                </Button>
              )
            })}
          </div>
          {query || status ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/schedule-plans">清空</Link>
            </Button>
          ) : null}
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard title="计划数量" value={`${plans.length}`} description="当前计划基线" />
          <SummaryCard title="预测人次" value={`${totalForecast}`} description="0.5h 时段汇总" />
          <SummaryCard title="已排人次" value={`${totalScheduled}`} description="种子数据回传" />
          <SummaryCard
            title="整体覆盖率"
            value={formatCoverageRate(coverageRate)}
            description={`缺口 ${totalGap} 人次`}
          />
        </section>
        <MvpFlowSummary
          planCount={plans.length}
          highRiskCount={highRiskCount}
          totalGap={totalGap}
        />
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>人员排班导入</CardTitle>
              <CardDescription>
                查看人员级排班来源批次、排班版本和班次引用状态。
              </CardDescription>
            </div>
            <Badge variant="outline">
              {importedPersonnelScheduleRows.length} 条导入 / {personnelScheduleSummary.peopleCount} 条记录
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {personnelScheduleRows.slice(0, 4).map((row) => (
              <div key={row.scheduleDetailId} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">
                      {row.employeeId} {row.employeeName}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {row.workplace} / {row.project} / {row.supplier}
                    </div>
                  </div>
                  <Badge variant={row.shiftTypeReferenceStatus === "blocked" ? "destructive" : "secondary"}>
                    班次引用 {row.shiftTypeReferenceStatus === "blocked" ? "阻断" : "可用"}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <MiniDetail label="来源批次" value={row.sourceBatchId ?? "样例记录"} />
                  <MiniDetail label="排班版本" value={row.scheduleVersionId ?? row.planId} />
                  <MiniDetail label="班次引用" value={row.shiftType} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>0.5h 展开</CardTitle>
              <CardDescription>
                按排班版本、日期、技能和 0.5h 时段汇总，并保留履约链接。
              </CardDescription>
            </div>
            <Badge variant="outline">
              {personnelScheduleIntervalExpansions.length} 个时段
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {personnelScheduleIntervalExpansions.slice(0, 6).map((interval) => (
              <div key={interval.intervalScheduleId} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">
                      {interval.businessDate} {interval.intervalStart}-{interval.intervalEnd}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {interval.workplace} / {interval.project} / {interval.skill}
                    </div>
                  </div>
                  <Badge variant={interval.traceStatus === "ready" ? "secondary" : "default"}>
                    {interval.scheduledAgents} 人
                  </Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <MiniDetail label="来源批次" value={interval.sourceBatchId} />
                  <MiniDetail label="排班版本" value={interval.scheduleVersionId} />
                  <MiniDetail label="明细追溯" value={interval.scheduleDetailIds.join("、")} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {interval.people.slice(0, 3).map((person) => (
                    <Button
                      key={`${interval.intervalScheduleId}-${person.employeeId}`}
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link href={person.timelineHref}>
                        履约链接 {person.employeeId}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>排班风险提示</CardTitle>
              <CardDescription>
                缺口与不可用记录联动提示
              </CardDescription>
            </div>
            <Badge variant={highRiskCount > 0 ? "default" : "outline"}>
              {highRiskCount} 条高风险
            </Badge>
          </CardHeader>
          <CardContent>
            <ScheduleRiskTable risks={risks.slice(0, 5)} />
          </CardContent>
        </Card>
        <SchedulePlanTable
          plans={plans}
          filterLabel={
            status ? `${schedulePlanStatusLabel(status)} / ${query || "全部"}` : query
          }
        />
      </main>
    </AppShell>
  )
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
