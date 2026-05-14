import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { ReviewChecklistRail } from "@/components/review-checklist-rail"
import { ScheduleRiskTable } from "@/components/schedule-risk-table"
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
  filterScheduleRiskRowsByScope,
  getScheduleRisks,
  type ScheduleRiskRow,
  scheduleRiskLevelLabel,
} from "@/lib/schedule-plans"
import {
  buildPlanDetailHref,
  buildReviewBackLink,
  buildSchedulePlansHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"

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

function summarizeRiskScope(rows: ScheduleRiskRow[]) {
  return rows.reduce(
    (summary, row) => {
      summary.total += 1
      summary.totalGap += row.gap_agents
      summary.affectedUnavailability += row.affected_unavailability

      if (row.risk_level === "high") {
        summary.high += 1
      } else if (row.risk_level === "medium") {
        summary.medium += 1
      } else {
        summary.low += 1
      }

      return summary
    },
    {
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
      totalGap: 0,
      affectedUnavailability: 0,
    }
  )
}

function buildScopeLabel({
  planId,
  date,
  project,
  site,
  intervalStart,
  intervalEnd,
}: {
  planId?: string
  date?: string
  project?: string
  site?: string
  intervalStart?: string
  intervalEnd?: string
}) {
  const interval =
    intervalStart && intervalEnd ? `${intervalStart}-${intervalEnd}` : undefined

  return [project, site, date, interval, planId].filter(Boolean).join(" / ")
}

export default async function ScheduleRisksPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const sourceFrom = params.from?.trim() ?? ""
  const status = params.status?.trim() ?? ""
  const planId = params.planId?.trim() ?? ""
  const date = params.date?.trim() ?? ""
  const project = params.project?.trim() ?? ""
  const site = params.site?.trim() ?? ""
  const intervalStart = params.intervalStart?.trim() ?? ""
  const intervalEnd = params.intervalEnd?.trim() ?? ""

  const risks = await getScheduleRisks(query)
  const scopedRisks = filterScheduleRiskRowsByScope(risks, {
    query,
    planId,
    planDate: date,
    projectName: project,
    siteName: site,
    intervalStart,
    intervalEnd,
  })
  const summary = summarizeRiskScope(scopedRisks)
  const scopeLabel = buildScopeLabel({
    planId,
    date,
    project,
    site,
    intervalStart,
    intervalEnd,
  })
  const hasPrefilter = Boolean(
    query || planId || date || project || site || intervalStart || intervalEnd
  )
  const shiftHref = buildShiftDetailsHref({
    from: sourceFrom || "schedule-risks",
    query,
    status,
    planId,
    date,
    project,
    site,
    intervalStart,
    intervalEnd,
  })
  const unavailabilityHref = buildUnavailabilityHref({
    from: sourceFrom || "schedule-risks",
    query,
    project,
    site,
    date,
    startTime: intervalStart,
    endTime: intervalEnd,
    status:
      project || site || date || intervalStart || intervalEnd ? "active" : undefined,
  })
  const planHref = buildPlanDetailHref(planId, {
    from: sourceFrom || "schedule-risks",
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
      href: buildSchedulePlansHref({ query, status }),
      label: "回到全部风险",
    },
  )
  const backLabel =
    sourceFrom === "schedule-plans-list" ? "返回计划列表" : backLink.label

  return (
    <AppShell title="风险提示" searchPlaceholder="搜索风险、计划或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">风险提示</h1>
            <p className="text-sm text-muted-foreground">
              统一复核缺口、不可用影响和建议动作，不接数据库
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={backLink.href}>{backLink.label}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/unavailability">不可用管理</Link>
            </Button>
          </div>
        </div>

        {hasPrefilter ? (
          <section className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 text-sm">
            <Badge variant="outline">上下文筛选</Badge>
            {scopeLabel ? <span>{scopeLabel}</span> : null}
            {query ? <span className="text-muted-foreground">关键词 {query}</span> : null}
            <Button asChild variant="ghost" size="sm">
              <Link href="/schedule-risks">查看全部</Link>
            </Button>
          </section>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="grid gap-4">
            <section className="grid gap-4 md:grid-cols-4">
              <SummaryCard title="风险条数" value={`${summary.total}`} description="当前工作台范围" />
              <SummaryCard title="高风险" value={`${summary.high}`} description="需优先复核" />
              <SummaryCard title="缺口合计" value={`${summary.totalGap}`} description="本地缺口口径" />
              <SummaryCard
                title="不可用影响"
                value={`${summary.affectedUnavailability}`}
                description="重叠生效记录"
              />
            </section>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>风险工作台</CardTitle>
                  <CardDescription>
                    点击明细可继续查看班次、计划与不可用影响
                  </CardDescription>
                </div>
                <Badge variant={summary.high > 0 ? "default" : "outline"}>
                  {summary.high > 0
                    ? `${summary.high} 条${scheduleRiskLevelLabel("high")}`
                    : "当前无高风险"}
                </Badge>
              </CardHeader>
              <CardContent>
                <ScheduleRiskTable
                  risks={scopedRisks}
                  sourceFrom={sourceFrom}
                  query={query}
                  status={status}
                />
              </CardContent>
            </Card>
          </div>

          <ReviewChecklistRail
            scopeLabel={scopeLabel}
            scopeFallbackLabel="全部风险"
            scopeDescription="宽屏下固定显示，避免只剩主表格区域"
            taskDescription="沿着同一上下文继续检查，不回到宽泛列表"
            currentStep="确认当前范围内的高风险、缺口合计和不可用影响。"
            nextStep="继续查看班次、不可用或计划，沿同一范围完成复核。"
            summaryItems={[
              { label: "高风险", value: summary.high },
              { label: "缺口合计", value: summary.totalGap },
              { label: "不可用影响", value: summary.affectedUnavailability },
            ]}
            actions={[
              { label: "查看班次", href: shiftHref },
              { label: "查看不可用", href: unavailabilityHref },
              { label: "查看计划", href: planHref },
            ]}
            backHref={backLink.href}
            backLabel={backLabel}
          />
        </div>
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
