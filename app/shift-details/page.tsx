import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
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
  return `/shift-details${suffix ? `?${suffix}` : ""}`
}

export default async function ShiftDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const rows = await getShiftDetails({ query, status })
  const totalGap = rows.reduce((sum, row) => sum + row.gap_agents, 0)
  const gapRows = rows.filter((row) => row.gap_agents > 0)
  const maxGap = rows.reduce((max, row) => Math.max(max, row.gap_agents), 0)
  const totalForecast = rows.reduce((sum, row) => sum + row.forecast_agents, 0)
  const totalScheduled = rows.reduce((sum, row) => sum + row.scheduled_agents, 0)
  const coverageRate =
    rows.length === 0 ? 0 : totalForecast === 0 ? 1 : totalScheduled / totalForecast

  return (
    <AppShell title="班次明细">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">班次明细</h1>
            <p className="text-sm text-muted-foreground">
              按 0.5h 时段查看预测、已排、缺口和备注
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/schedule-plans">返回排班计划</Link>
          </Button>
        </div>

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
              <Link href="/shift-details">清空</Link>
            </Button>
          ) : null}
        </section>

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
                {status ? `${schedulePlanStatusLabel(status)} / ${query || "全部"}` : query || "全部计划"}
              </CardDescription>
            </div>
            <Badge variant="outline">明细</Badge>
          </CardHeader>
          <CardContent>
            <ShiftDetailsTable rows={rows} />
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
