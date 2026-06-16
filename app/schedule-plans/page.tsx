import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { MetricCard } from "@/components/metric-card"
import { SchedulePlanTable } from "@/components/schedule-plan-table"
import {
  formatCoverageRate,
  getSchedulePlansWithFilters,
  schedulePlanStatusLabel,
  type SchedulePlanStatus,
} from "@/lib/schedule-plans"
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
  const totalForecast = plans.reduce((sum, plan) => sum + plan.forecast_agents, 0)
  const totalScheduled = plans.reduce(
    (sum, plan) => sum + plan.scheduled_agents,
    0
  )
  const totalGap = plans.reduce((sum, plan) => sum + plan.gap_agents, 0)
  const coverageRate =
    plans.length === 0 ? 0 : totalForecast === 0 ? 1 : totalScheduled / totalForecast

  return (
    <AppShell
      title="排班计划"
      breadcrumbItems={[{ label: "排班计划" }]}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              查看计划列表，并创建 draft 草稿
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
          <MetricCard title="计划数量" value={`${plans.length}`} description="计划基线" />
          <MetricCard title="预测人次" value={`${totalForecast}`} description="0.5h 时段汇总" />
          <MetricCard title="已排人次" value={`${totalScheduled}`} description="种子数据回传" />
          <MetricCard
            title="整体覆盖率"
            value={formatCoverageRate(coverageRate)}
            description={`缺口 ${totalGap} 人次`}
          />
        </section>
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
