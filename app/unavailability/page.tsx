import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { MetricCard } from "@/components/metric-card"
import { SearchInputBar } from "@/components/search-input-bar"
import { StatusFilterPills } from "@/components/status-filter-pills"
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
import {
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
  }>
}

function parseStatus(status?: string): UnavailabilityStatus | undefined {
  if (status === "active" || status === "resolved") {
    return status
  }

  return undefined
}

function statusHref(status: UnavailabilityStatus | undefined, query: string) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  if (status) {
    searchParams.set("status", status)
  }

  const suffix = searchParams.toString()
  return `/unavailability${suffix ? `?${suffix}` : ""}`
}

export default async function UnavailabilityPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const rows = await getUnavailability({ query, status })
  const activeRows = rows.filter((row) => row.status === "active")
  const affectedIntervals = rows.reduce(
    (sum, row) => sum + row.affected_intervals,
    0
  )
  const teamCount = new Set(rows.map((row) => row.team_name)).size
  const siteCount = new Set(rows.map((row) => row.site_name)).size

  return (
    <AppShell title="不可用管理">
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

        <SearchInputBar
          defaultQuery={query}
          placeholder="搜索人员、团队、项目、职场、原因"
          hiddenFields={status ? { status } : undefined}
        >
          <StatusFilterPills
            options={statusOptions}
            activeValue={status}
            buildHref={(value) => statusHref(value, query)}
          />
          {query || status ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/unavailability">清空</Link>
            </Button>
          ) : null}
        </SearchInputBar>

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
                {status ? `${unavailabilityStatusLabel(status)} / ${query || "全部"}` : query || "全部记录"}
              </CardDescription>
            </div>
            <Badge variant="outline">不可用</Badge>
          </CardHeader>
          <CardContent>
            <UnavailabilityTable rows={rows} />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}
