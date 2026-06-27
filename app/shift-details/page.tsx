import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { MetricCard } from "@/components/metric-card"
import { ReadinessBanner } from "@/components/readiness-banner"
import { SearchInputBar } from "@/components/search-input-bar"
import { ShiftDetailsTable } from "@/components/shift-details-table"
import { StatusFilterPills } from "@/components/status-filter-pills"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatCoverageRate,
  getShiftDetailsResult,
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
  const result = await getShiftDetailsResult({ query, status })
  const rows = result.items
  const hasPageFilters = Boolean(query || status)
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
        <ReadinessBanner
          message={result.message}
          hasData={rows.length > 0}
          overallSource={result.source}
        />
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

        <SearchInputBar
          defaultQuery={query}
          placeholder="搜索日期、项目、职场、时段、备注"
          hiddenFields={status ? { status } : undefined}
        >
          <StatusFilterPills
            options={statusOptions}
            activeValue={status}
            buildHref={(value) => statusHref(value, query)}
          />
          {query || status ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/shift-details">清空</Link>
            </Button>
          ) : null}
        </SearchInputBar>

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
            <ShiftDetailsTable
              emptyMessage={
                hasPageFilters
                  ? "暂无符合条件的班次明细"
                  : "暂无班次明细数据"
              }
              rows={rows}
            />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}
