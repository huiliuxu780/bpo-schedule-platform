import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { MetricCard } from "@/components/metric-card"
import { ReadinessBanner } from "@/components/readiness-banner"
import { SearchInputBar } from "@/components/search-input-bar"
import { StatusFilterPills } from "@/components/status-filter-pills"
import { UnavailabilityTable } from "@/components/unavailability-table"
import { WorkbenchPageHeader } from "@/components/workbench-page-header"
import { Button } from "@/components/ui/button"
import {
  getUnavailabilityResult,
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
  const result = await getUnavailabilityResult({ query, status })
  const rows = result.items
  const hasPageFilters = Boolean(query || status)
  const activeRows = rows.filter((row) => row.status === "active")
  const affectedIntervals = rows.reduce(
    (sum, row) => sum + row.affected_intervals,
    0
  )
  const teamCount = new Set(rows.map((row) => row.team_name)).size
  const siteCount = new Set(rows.map((row) => row.site_name)).size

  return (
    <AppShell
      title="不可用记录"
      breadcrumbItems={[{ label: "不可用记录" }]}
    >
      <main className="@container/main flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-4 md:gap-6 lg:p-6">
        <ReadinessBanner
          message={result.message}
          hasData={rows.length > 0}
          overallSource={result.source}
        />
        <WorkbenchPageHeader
          description="查看人员不可用时段，提前识别排班覆盖风险。"
          actions={
            <Button asChild variant="outline" size="sm">
              <Link href="/schedule-plans">查看排班计划</Link>
            </Button>
          }
        />

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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="不可用记录" value={`${rows.length}`} description="当前筛选结果" />
          <MetricCard title="生效中" value={`${activeRows.length}`} description="需要排班复核" />
          <MetricCard title="影响时段" value={`${affectedIntervals}`} description="按 0.5h 颗粒度" />
          <MetricCard title="涉及团队" value={`${teamCount}`} description={`${siteCount} 个职场`} />
        </section>

        <UnavailabilityTable
          filterLabel={
            status
              ? `${unavailabilityStatusLabel(status)} / ${query || "全部"}`
              : query || "全部记录"
          }
          emptyMessage={
            hasPageFilters
              ? "暂无符合条件的不可用记录"
              : "暂无不可用记录"
          }
          rows={rows}
        />
      </main>
    </AppShell>
  )
}
