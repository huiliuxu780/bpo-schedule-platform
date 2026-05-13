import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { UnavailabilityTable } from "@/components/unavailability-table"
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
  filterUnavailabilityRowsByScope,
  getUnavailability,
  unavailabilityStatusLabel,
  type UnavailabilityStatus,
} from "@/lib/unavailability"

const statusOptions: { label: string; value?: UnavailabilityStatus }[] = [
  { label: "全部" },
  { label: "生效中", value: "active" },
  { label: "已处理", value: "resolved" },
]

type PageProps = {
  searchParams: Promise<{
    query?: string
    status?: string
    project?: string
    site?: string
    date?: string
    startTime?: string
    endTime?: string
  }>
}

function buildScopeLabel({
  project,
  site,
  date,
  startTime,
  endTime,
}: {
  project?: string
  site?: string
  date?: string
  startTime?: string
  endTime?: string
}) {
  const interval = startTime && endTime ? `${startTime}-${endTime}` : undefined
  return [project, site, date, interval].filter(Boolean).join(" / ")
}

function parseStatus(status?: string): UnavailabilityStatus | undefined {
  if (status === "active" || status === "resolved") {
    return status
  }

  return undefined
}

function statusHref(
  status: UnavailabilityStatus | undefined,
  query: string,
  scope: {
    project?: string
    site?: string
    date?: string
    startTime?: string
    endTime?: string
  }
) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  if (status) {
    searchParams.set("status", status)
  }

  if (scope.project) searchParams.set("project", scope.project)
  if (scope.site) searchParams.set("site", scope.site)
  if (scope.date) searchParams.set("date", scope.date)
  if (scope.startTime) searchParams.set("startTime", scope.startTime)
  if (scope.endTime) searchParams.set("endTime", scope.endTime)

  const suffix = searchParams.toString()
  return `/unavailability${suffix ? `?${suffix}` : ""}`
}

export default async function UnavailabilityPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const project = params.project?.trim() ?? ""
  const site = params.site?.trim() ?? ""
  const date = params.date?.trim() ?? ""
  const startTime = params.startTime?.trim() ?? ""
  const endTime = params.endTime?.trim() ?? ""
  const rows = filterUnavailabilityRowsByScope(
    await getUnavailability({ query, status }),
    {
      query,
      status,
      projectName: project,
      siteName: site,
      unavailableDate: date,
      startTime,
      endTime,
    }
  )
  const scopeLabel = buildScopeLabel({
    project,
    site,
    date,
    startTime,
    endTime,
  })
  const hasScope = Boolean(project || site || date || startTime || endTime)
  const activeRows = rows.filter((row) => row.status === "active")
  const affectedIntervals = rows.reduce(
    (sum, row) => sum + row.affected_intervals,
    0
  )
  const teamCount = new Set(rows.map((row) => row.team_name)).size
  const siteCount = new Set(rows.map((row) => row.site_name)).size
  const riskSearchParams = new URLSearchParams()
  if (query) riskSearchParams.set("query", query)
  if (project) riskSearchParams.set("project", project)
  if (site) riskSearchParams.set("site", site)
  if (date) riskSearchParams.set("date", date)
  if (startTime) riskSearchParams.set("intervalStart", startTime)
  if (endTime) riskSearchParams.set("intervalEnd", endTime)
  const riskHref = `/schedule-risks${
    riskSearchParams.toString() ? `?${riskSearchParams.toString()}` : ""
  }`
  const shiftSearchParams = new URLSearchParams()
  if (query) shiftSearchParams.set("query", query)
  if (project) shiftSearchParams.set("project", project)
  if (site) shiftSearchParams.set("site", site)
  if (date) shiftSearchParams.set("date", date)
  if (startTime) shiftSearchParams.set("intervalStart", startTime)
  if (endTime) shiftSearchParams.set("intervalEnd", endTime)
  const shiftHref = `/shift-details${
    shiftSearchParams.toString() ? `?${shiftSearchParams.toString()}` : ""
  }`

  return (
    <AppShell title="不可用管理" searchPlaceholder="搜索人员、团队或原因">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">不可用管理</h1>
            <p className="text-sm text-muted-foreground">
              查看人员不可用时段，提前识别排班覆盖风险
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/schedule-plans">查看排班计划</Link>
          </Button>
        </div>

        {hasScope ? (
          <section className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 text-sm">
            <Badge variant="outline">上下文 drilldown</Badge>
            {scopeLabel ? <span>{scopeLabel}</span> : null}
            <Button asChild variant="ghost" size="sm">
              <Link href={riskHref}>查看风险</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={shiftHref}>查看班次</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/unavailability">清空范围</Link>
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
                placeholder="搜索人员、团队、项目、职场、原因"
                className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {status ? <input name="status" type="hidden" value={status} /> : null}
            {project ? <input name="project" type="hidden" value={project} /> : null}
            {site ? <input name="site" type="hidden" value={site} /> : null}
            {date ? <input name="date" type="hidden" value={date} /> : null}
            {startTime ? <input name="startTime" type="hidden" value={startTime} /> : null}
            {endTime ? <input name="endTime" type="hidden" value={endTime} /> : null}
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
                      project,
                      site,
                      date,
                      startTime,
                      endTime,
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
              <Link href="/unavailability">清空</Link>
            </Button>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard title="不可用记录" value={`${rows.length}`} description="当前筛选结果" />
          <MetricCard title="生效中" value={`${activeRows.length}`} description="需要排班复核" />
          <MetricCard title="影响时段" value={`${affectedIntervals}`} description="按 0.5h 颗粒度" />
          <MetricCard title="涉及团队" value={`${teamCount}`} description={`${siteCount} 个职场`} />
        </section>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>不可用记录</CardTitle>
              <CardDescription>
                {scopeLabel
                  ? scopeLabel
                  : status
                    ? `${unavailabilityStatusLabel(status)} / ${query || "全部"}`
                    : query || "全部记录"}
              </CardDescription>
            </div>
            <Badge variant="outline">B006 不可用</Badge>
          </CardHeader>
          <CardContent>
            <UnavailabilityTable rows={rows} />
          </CardContent>
        </Card>
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
