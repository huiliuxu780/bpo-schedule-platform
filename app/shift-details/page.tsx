import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { ReviewChecklistRail } from "@/components/review-checklist-rail"
import { ShiftDetailsTable } from "@/components/shift-details-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  buildPlanDetailHref,
  buildReviewBackLink,
  buildReviewScopeLabel,
  buildScheduleRisksHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"
import {
  filterShiftDetailRowsByScope,
  formatCoverageRate,
  getShiftDetails,
  schedulePlanStatusLabel,
  type SchedulePlanStatus,
} from "@/lib/schedule-plans"

const statusOptions: { label: string; value?: SchedulePlanStatus }[] = [
  { label: "全部" },
  { label: "草稿", value: "draft" },
  { label: "待复核", value: "review_ready" },
  { label: "已发布", value: "published" },
]

type PageProps = {
  searchParams: Promise<{
    from?: string
    query?: string
    status?: string
    planId?: string
    date?: string
    project?: string
    site?: string
    intervalStart?: string
    intervalEnd?: string
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
  scope: {
    planId?: string
    date?: string
    project?: string
    site?: string
    intervalStart?: string
    intervalEnd?: string
  }
) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  if (status) {
    searchParams.set("status", status)
  }

  if (scope.planId) searchParams.set("planId", scope.planId)
  if (scope.date) searchParams.set("date", scope.date)
  if (scope.project) searchParams.set("project", scope.project)
  if (scope.site) searchParams.set("site", scope.site)
  if (scope.intervalStart) searchParams.set("intervalStart", scope.intervalStart)
  if (scope.intervalEnd) searchParams.set("intervalEnd", scope.intervalEnd)

  const suffix = searchParams.toString()
  return `/shift-details${suffix ? `?${suffix}` : ""}`
}

export default async function ShiftDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sourceFrom = params.from?.trim() ?? ""
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const planId = params.planId?.trim() ?? ""
  const date = params.date?.trim() ?? ""
  const project = params.project?.trim() ?? ""
  const site = params.site?.trim() ?? ""
  const intervalStart = params.intervalStart?.trim() ?? ""
  const intervalEnd = params.intervalEnd?.trim() ?? ""
  const rows = filterShiftDetailRowsByScope(await getShiftDetails({ query, status }), {
    query,
    planId,
    planDate: date,
    projectName: project,
    siteName: site,
    intervalStart,
    intervalEnd,
  })
  const scopeLabel = buildReviewScopeLabel({
    planId,
    date,
    project,
    site,
    intervalStart,
    intervalEnd,
  })
  const hasScope = Boolean(
    planId || date || project || site || intervalStart || intervalEnd
  )
  const totalGap = rows.reduce((sum, row) => sum + row.gap_agents, 0)
  const gapRows = rows.filter((row) => row.gap_agents > 0)
  const maxGap = rows.reduce((max, row) => Math.max(max, row.gap_agents), 0)
  const totalForecast = rows.reduce((sum, row) => sum + row.forecast_agents, 0)
  const totalScheduled = rows.reduce((sum, row) => sum + row.scheduled_agents, 0)
  const coverageRate =
    rows.length === 0 ? 0 : totalForecast === 0 ? 1 : totalScheduled / totalForecast
  const riskHref = buildScheduleRisksHref({
    from: sourceFrom || "shift-details",
    query,
    planId,
    date,
    project,
    site,
    intervalStart,
    intervalEnd,
  })
  const unavailabilityHref = buildUnavailabilityHref({
    from: sourceFrom || "shift-details",
    query,
    project,
    site,
    date,
    intervalStart,
    intervalEnd,
    status:
      project || site || date || intervalStart || intervalEnd ? "active" : undefined,
  })
  const planHref = buildPlanDetailHref(planId, {
    from: sourceFrom || "shift-details",
    query,
    status,
    date,
    project,
    site,
    intervalStart,
    intervalEnd,
  })
  const backLink = buildReviewBackLink(
    {
      from: sourceFrom || undefined,
      query,
      status,
      planId,
      date,
      project,
      site,
      intervalStart,
      intervalEnd,
    },
    {
      href: "/shift-details",
      label: "回到全部班次",
    },
  )

  return (
    <AppShell title="班次明细" searchPlaceholder="搜索班次、计划或备注">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">班次明细</h1>
            <p className="text-sm text-muted-foreground">
              按 0.5h 时段查看预测、已排、缺口和备注
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {planId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={planHref}>查看计划详情</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href={backLink.href}>
                {sourceFrom === "schedule-plans" ? "返回计划详情" : backLink.label}
              </Link>
            </Button>
          </div>
        </div>

        {hasScope ? (
          <section className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 text-sm">
            <Badge variant="outline">上下文 drilldown</Badge>
            {scopeLabel ? <span>{scopeLabel}</span> : null}
            <Button asChild variant="ghost" size="sm">
              <Link href={riskHref}>查看风险</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={unavailabilityHref}>查看不可用</Link>
            </Button>
            {planId ? (
              <Button asChild variant="ghost" size="sm">
                <Link href={sourceFrom === "schedule-plans-list" ? backLink.href : planHref}>
                  {sourceFrom === "schedule-plans-list" ? "返回计划列表" : "返回计划详情"}
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="sm">
              <Link href="/shift-details">清空范围</Link>
            </Button>
          </section>
        ) : null}

        <section className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <form className="flex min-w-64 flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                name="query"
                defaultValue={query}
                placeholder="搜索日期、项目、职场、时段、备注"
                className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {status ? <input name="status" type="hidden" value={status} /> : null}
            {planId ? <input name="planId" type="hidden" value={planId} /> : null}
            {date ? <input name="date" type="hidden" value={date} /> : null}
            {project ? <input name="project" type="hidden" value={project} /> : null}
            {site ? <input name="site" type="hidden" value={site} /> : null}
            {intervalStart ? (
              <input name="intervalStart" type="hidden" value={intervalStart} />
            ) : null}
            {intervalEnd ? (
              <input name="intervalEnd" type="hidden" value={intervalEnd} />
            ) : null}
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
                  <Link
                    href={statusHref(option.value, query, {
                      planId,
                      date,
                      project,
                      site,
                      intervalStart,
                      intervalEnd,
                    })}
                  >
                    {option.label}
                  </Link>
                </Button>
              )
            })}
          </div>
          {query || status ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/shift-details">清空</Link>
            </Button>
          ) : null}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="grid gap-4">
            <section className="grid gap-4 md:grid-cols-4">
              <MetricCard title="班次数量" value={`${rows.length}`} description="0.5h 颗粒度" />
              <MetricCard title="缺口班次" value={`${gapRows.length}`} description={`合计缺口 ${totalGap} 人次`} />
              <MetricCard title="最大缺口" value={`${maxGap}`} description="单个时段最大缺口" />
              <MetricCard title="整体覆盖率" value={formatCoverageRate(coverageRate)} description="当前筛选结果" />
            </section>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>班次明细</CardTitle>
                  <CardDescription>
                    {scopeLabel
                      ? scopeLabel
                      : status
                        ? `${schedulePlanStatusLabel(status)} / ${query || "全部"}`
                        : query || "全部计划"}
                  </CardDescription>
                </div>
                <Badge variant="outline">B004 明细</Badge>
              </CardHeader>
              <CardContent>
                <ShiftDetailsTable rows={rows} />
              </CardContent>
            </Card>
          </div>

          <ReviewChecklistRail
            scopeLabel={scopeLabel}
            scopeFallbackLabel="全部班次"
            scopeDescription="宽屏下固定显示，避免页面只剩主表格"
            taskDescription="沿着当前上下文继续检查，不回到宽泛列表"
            currentStep="核对当前时段的班次数量、缺口班次和整体覆盖率。"
            nextStep="继续查看风险与不可用，确认缺口是否来自同一范围因素。"
            summaryItems={[
              { label: "班次数量", value: rows.length },
              { label: "缺口班次", value: gapRows.length },
              { label: "整体覆盖率", value: formatCoverageRate(coverageRate) },
            ]}
            actions={[
              { label: "查看风险", href: riskHref },
              { label: "查看不可用", href: unavailabilityHref },
              ...(planId ? [{ label: "查看计划", href: planHref }] : []),
            ]}
            backHref={backLink.href}
            backLabel={sourceFrom === "schedule-plans" ? "返回计划详情" : backLink.label}
          />
        </div>
      </main>
    </AppShell>
  )
}

function MetricCard({
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
