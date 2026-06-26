import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { MetricCard } from "@/components/metric-card"
import { ReadinessBanner } from "@/components/readiness-banner"
import { ScheduleRiskTable } from "@/components/schedule-risk-table"
import { SearchInputBar } from "@/components/search-input-bar"
import { StatusFilterPills } from "@/components/status-filter-pills"
import {
  getScheduleRisksResult,
  type ScheduleRiskLevel,
  type ScheduleRiskStatus,
} from "@/lib/schedule-plans"
import {
  filterScheduleRiskRows,
  summarizeScheduleRiskRows,
} from "@/components/data-table-model"
import { Button } from "@/components/ui/button"

const statusOptions: { label: string; value?: ScheduleRiskStatus }[] = [
  { label: "全部" },
  { label: "待处理", value: "open" },
  { label: "已确认", value: "confirmed" },
  { label: "已处理", value: "resolved" },
]

const levelOptions: { label: string; value?: ScheduleRiskLevel }[] = [
  { label: "全部" },
  { label: "高", value: "high" },
  { label: "中", value: "medium" },
  { label: "低", value: "low" },
]

type PageProps = {
  searchParams: Promise<{
    query?: string
    status?: string
    level?: string
  }>
}

function parseStatus(status?: string): ScheduleRiskStatus | undefined {
  if (status === "open" || status === "confirmed" || status === "resolved") {
    return status
  }

  return undefined
}

function parseLevel(level?: string): ScheduleRiskLevel | undefined {
  if (level === "high" || level === "medium" || level === "low") {
    return level
  }

  return undefined
}

function buildHref(
  status: ScheduleRiskStatus | undefined,
  query: string,
  level: ScheduleRiskLevel | undefined
) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  if (status) {
    searchParams.set("status", status)
  }

  if (level) {
    searchParams.set("level", level)
  }

  const suffix = searchParams.toString()
  return `/schedule-risks${suffix ? `?${suffix}` : ""}`
}

function statusHref(status: ScheduleRiskStatus | undefined, query: string, level: ScheduleRiskLevel | undefined) {
  return buildHref(status, query, level)
}

function levelHref(level: ScheduleRiskLevel | undefined, query: string, status: ScheduleRiskStatus | undefined) {
  return buildHref(status, query, level)
}

export default async function ScheduleRisksPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const level = parseLevel(params.level)

  const result = await getScheduleRisksResult(query)
  const sourceRisks = result.items
  const hasPageFilters = Boolean(query || status || level)

  const filteredRisks = filterScheduleRiskRows(sourceRisks, {
    query,
    status: status ?? "all",
    level: level ?? "all",
  })

  const summary = summarizeScheduleRiskRows(filteredRisks)

  const filterLabel = [
    status ? `${status === "open" ? "待处理" : status === "confirmed" ? "已确认" : "已处理"}` : null,
    level ? `${level === "high" ? "高风险" : level === "medium" ? "需关注" : "提醒"}` : null,
    query || null,
  ]
    .filter(Boolean)
    .join(" / ")

  return (
    <AppShell
      title="履约风险"
      breadcrumbItems={[{ label: "履约风险" }]}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <ReadinessBanner
          message={result.message}
          hasData={sourceRisks.length > 0}
          overallSource={result.source}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              查看履约风险列表，跟踪处理进度与影响范围
            </p>
          </div>
        </div>
        <SearchInputBar
          defaultQuery={query}
          placeholder="搜索风险编号、计划编号、项目、职场、日期、时段、原因、建议"
          hiddenFields={
            status || level
              ? {
                  ...(status ? { status } : {}),
                  ...(level ? { level } : {}),
                }
              : undefined
          }
        >
          <StatusFilterPills
            options={statusOptions}
            activeValue={status}
            buildHref={(value) => statusHref(value, query, level)}
          />
          <StatusFilterPills
            options={levelOptions}
            activeValue={level}
            buildHref={(value) => levelHref(value, query, status)}
          />
          {query || status || level ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/schedule-risks">清空</Link>
            </Button>
          ) : null}
        </SearchInputBar>
        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="风险总数"
            value={`${summary.total}`}
            description="筛选后条目"
          />
          <MetricCard
            title="待处理"
            value={`${summary.open}`}
            description="需要关注的风险"
          />
          <MetricCard
            title="高风险"
            value={`${summary.high}`}
            description="需优先处理"
          />
          <MetricCard
            title="影响不可用"
            value={`${summary.affectedUnavailability}`}
            description="关联不可用记录数"
          />
        </section>
        <ScheduleRiskTable
          risks={filteredRisks}
          sourceTotal={hasPageFilters ? undefined : sourceRisks.length}
          filterLabel={filterLabel || undefined}
        />
      </main>
    </AppShell>
  )
}
