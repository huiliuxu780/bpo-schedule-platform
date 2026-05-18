import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { summarizeSchedulePlanImportRecords } from "@/components/data-table-model"
import { MvpFlowSummary } from "@/components/mvp-flow-summary"
import { SchedulePlanTable } from "@/components/schedule-plan-table"
import { ScheduleRiskTable } from "@/components/schedule-risk-table"
import { getDemoImportRecords } from "@/lib/demo-imports"
import {
  buildNewSchedulePlanHref,
  buildSchedulePlansHref,
  buildScheduleRisksHref,
} from "@/lib/review-navigation"
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
    draft?: string
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

function statusHref(
  status: SchedulePlanStatus | undefined,
  query: string,
  draft: string,
) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  if (status) {
    searchParams.set("status", status)
  }

  if (draft.trim()) {
    searchParams.set("draft", draft.trim())
  }

  const suffix = searchParams.toString()
  return `/schedule-plans${suffix ? `?${suffix}` : ""}`
}

export default async function SchedulePlansPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const draft = params.draft?.trim() ?? ""
  const plans = await getSchedulePlansWithFilters({ query, status })
  const risks = await getScheduleRisks(query)
  const importRecords = await getDemoImportRecords()
  const scheduleImportSummary = summarizeSchedulePlanImportRecords(importRecords)
  const scheduleImportRecord = importRecords.find(
    (record) => record.kind === "schedule_plan"
  )
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
              查看计划列表，并创建 draft 草稿
            </p>
          </div>
          <Button asChild size="sm">
            <Link href={buildNewSchedulePlanHref({ query, status })}>新建草稿</Link>
          </Button>
        </div>
        {draft === "failed" ? (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">草稿操作失败</CardTitle>
                <CardDescription>
                  draft 创建未完成，请检查输入后重试。
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href={buildSchedulePlansHref({ query, status })}>关闭</Link>
              </Button>
            </CardHeader>
          </Card>
        ) : null}
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
            {draft ? <input name="draft" type="hidden" value={draft} /> : null}
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
                  <Link href={statusHref(option.value, query, draft)}>
                    {option.label}
                  </Link>
                </Button>
              )
            })}
          </div>
          {query || status ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={buildSchedulePlansHref({ draft })}>清空</Link>
            </Button>
          ) : null}
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard title="计划数量" value={`${plans.length}`} description="计划基线" />
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
          query={query}
          status={status}
        />
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>排班时段样本</CardTitle>
              <CardDescription>
                展示计划时段的预测人数、已排人数和覆盖情况。
              </CardDescription>
            </div>
            <Badge variant={scheduleImportSummary.importedRows > 0 ? "default" : "outline"}>
              {scheduleImportSummary.importedRows > 0 ? "可复核" : "待补齐"}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[240px_1fr]">
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between rounded-md border p-2">
                <span className="text-muted-foreground">计划样本</span>
                <span className="font-medium tabular-nums">
                  {scheduleImportSummary.planCount}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-2">
                <span className="text-muted-foreground">时段数量</span>
                <span className="font-medium tabular-nums">
                  {scheduleImportSummary.importedRows}
                </span>
              </div>
              <div className="rounded-md border p-2">
                <div className="text-muted-foreground">覆盖状态</div>
                <div className="mt-1 text-sm font-medium">
                  {scheduleImportSummary.importedRows > 0
                    ? "已有排班时段"
                    : "待补齐排班时段"}
                </div>
              </div>
            </div>
            {scheduleImportRecord ? (
              <div className="grid gap-2">
                {scheduleImportRecord.sample_rows.map((row, index) => (
                  <div
                    key={`${row.plan_id ?? "plan"}-${row.interval_start ?? index}`}
                    className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-[1fr_auto_auto]"
                  >
                    <div>
                      <div className="font-medium">
                        {row.plan_id ?? "未命名计划"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.project_name ?? "未标注项目"} / {row.site_name ?? "未标注职场"}
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {row.interval_start ?? "--"}-{row.interval_end ?? "--"}
                    </Badge>
                    <div className="text-muted-foreground">
                      预测 {row.forecast_agents ?? 0} / 已排 {row.scheduled_agents ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                暂无排班时段。补齐排班数据后可在这里查看计划覆盖情况。
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>排班风险提示</CardTitle>
              <CardDescription>
                缺口与不可用记录的联动提示
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={highRiskCount > 0 ? "default" : "outline"}>
                {highRiskCount} 条高风险
              </Badge>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={buildScheduleRisksHref({
                    from: "schedule-plans-list",
                    query,
                    status,
                  })}
                >
                  查看全部
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScheduleRiskTable
              risks={risks.slice(0, 5)}
              sourceFrom="schedule-plans-list"
              query={query}
              status={status}
            />
          </CardContent>
        </Card>
        <SchedulePlanTable
          plans={plans}
          query={query}
          status={status}
          filterLabel={
            status ? `${schedulePlanStatusLabel(status)} / ${query || "全部"}` : query
          }
        />
      </main>
    </AppShell>
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
