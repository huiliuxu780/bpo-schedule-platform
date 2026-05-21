import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { DemandPlanTable } from "@/components/demand-plan-table"
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
  buildDemandSupplyAlignment,
  getDemandPlans,
  summarizeDemandPlanDimensions,
  type DemandPlanRow,
  type DemandSupplyAlignmentRow,
} from "@/lib/schedule-plans"

type PageProps = {
  searchParams: Promise<{
    query?: string
  }>
}

export default async function DemandPlansPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const rows = await getDemandPlans(query)
  const alignmentRows = buildDemandSupplyAlignment(rows)
  const dimensionSummary = summarizeDemandPlanDimensions(alignmentRows)
  const totalForecast = rows.reduce((sum, row) => sum + row.forecast_agents, 0)
  const peak = rows.reduce<DemandPlanRow | null>(
    (current, row) =>
      !current || row.forecast_agents > current.forecast_agents ? row : current,
    null
  )
  const siteCount = new Set(rows.map((row) => row.site_name)).size
  const shortageRows = alignmentRows.filter((row) => row.shortageAgents > 0)
  const overstaffedRows = alignmentRows.filter((row) => row.overstaffedAgents > 0)
  const mismatchRows = alignmentRows.filter(
    (row) => row.alignmentStatus === "技能不匹配"
  )

  return (
    <AppShell title="需求计划" searchPlaceholder="搜索需求、项目或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">需求计划</h1>
            <p className="text-sm text-muted-foreground">
              按职场、项目、时段、技能组和等级查看预测需求，并对齐排班结果
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/schedule-plans">查看排班计划</Link>
          </Button>
        </div>

        <section className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <form className="flex min-w-64 flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                name="query"
                defaultValue={query}
                placeholder="搜索日期、项目、职场、时段、技能组、等级"
                className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              搜索
            </Button>
          </form>
          {query ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/demand-plans">清空</Link>
            </Button>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard title="需求时段" value={`${rows.length}`} description="0.5h 颗粒度" />
          <MetricCard title="预测人次" value={`${totalForecast}`} description="当前筛选汇总" />
          <MetricCard title="覆盖职场" value={`${siteCount}`} description="本地需求来源" />
          <MetricCard
            title="峰值需求"
            value={peak ? `${peak.forecast_agents}` : "0"}
            description={peak ? `${peak.plan_date} ${peak.interval_start}` : "暂无数据"}
          />
        </section>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>预测维度</CardTitle>
              <CardDescription>
                用职场、项目、0.5h 时段、技能组和等级解释需求结构
              </CardDescription>
            </div>
            <Badge variant="outline">
              {dimensionSummary.requiredDimensions.length} 个维度
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            <MetricCard
              title="职场"
              value={`${dimensionSummary.siteCount}`}
              description="当前筛选覆盖"
            />
            <MetricCard
              title="技能组"
              value={dimensionSummary.skillGroups.join(" / ")}
              description="预测需求结构"
            />
            <MetricCard
              title="等级"
              value={dimensionSummary.skillLevels.join(" / ")}
              description="人员能力要求"
            />
            <MetricCard
              title="对齐版本"
              value={`${new Set(alignmentRows.map((row) => row.forecastVersion)).size}`}
              description="预测版本数量"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>预测排班对齐</CardTitle>
              <CardDescription>
                对比预测人数和已排人数，标出缺口、超排和技能不匹配
              </CardDescription>
            </div>
            <Badge variant="outline">
              缺口 {shortageRows.length} / 超排 {overstaffedRows.length} / 技能不匹配 {mismatchRows.length}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <MetricCard
                title="缺口时段"
                value={`${shortageRows.length}`}
                description={`合计缺口 ${shortageRows.reduce((sum, row) => sum + row.shortageAgents, 0)} 人次`}
              />
              <MetricCard
                title="超排时段"
                value={`${overstaffedRows.length}`}
                description={`合计超排 ${overstaffedRows.reduce((sum, row) => sum + row.overstaffedAgents, 0)} 人次`}
              />
              <MetricCard
                title="技能不匹配"
                value={`${mismatchRows.length}`}
                description="预测技能与已排人员不一致"
              />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {alignmentRows.slice(0, 8).map((row) => (
                <AlignmentCard key={row.demandId} row={row} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>预测需求</CardTitle>
              <CardDescription>{query || "全部需求"}</CardDescription>
            </div>
            <Badge variant="outline">0.5h 预测</Badge>
          </CardHeader>
          <CardContent>
            <DemandPlanTable rows={rows} />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function AlignmentCard({ row }: { row: DemandSupplyAlignmentRow }) {
  const variant =
    row.alignmentStatus === "技能不匹配" || row.alignmentStatus === "缺口"
      ? "destructive"
      : row.alignmentStatus === "超排"
        ? "secondary"
        : "outline"

  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">
            {row.siteName} / {row.projectName}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.planDate} {row.intervalStart}-{row.intervalEnd}
          </div>
        </div>
        <Badge variant={variant}>{row.alignmentStatus}</Badge>
      </div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">预测</p>
          <p className="font-medium tabular-nums">{row.forecastAgents} 人</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">已排</p>
          <p className="font-medium tabular-nums">{row.scheduledAgents} 人</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">技能</p>
          <p className="font-medium">{row.skillGroup} / {row.skillLevel}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>{row.forecastVersion}</span>
        <span>{row.scheduleVersion}</span>
        {row.shortageAgents > 0 ? <span>缺口 {row.shortageAgents}</span> : null}
        {row.overstaffedAgents > 0 ? <span>超排 {row.overstaffedAgents}</span> : null}
      </div>
      {row.mismatchReason ? (
        <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
          {row.mismatchReason}
        </div>
      ) : null}
      <Button asChild variant="outline" size="sm" className="mt-3">
        <Link href={row.personnelDetailHref}>查看排班人员明细</Link>
      </Button>
    </div>
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
