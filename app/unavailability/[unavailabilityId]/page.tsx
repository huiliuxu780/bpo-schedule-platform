import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { UnavailabilityImpactRiskTable } from "@/components/unavailability-impact-risk-table"
import { UnavailabilityImpactShiftTable } from "@/components/unavailability-impact-shift-table"
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
  getScheduleRisks,
  getShiftDetails,
} from "@/lib/schedule-plans"
import {
  getUnavailabilityRecord,
  unavailabilityStatusLabel,
} from "@/lib/unavailability"
import {
  buildPlanDetailHref,
  buildReviewScopeLabel,
  buildScheduleRisksHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"

type PageProps = {
  params: Promise<{
    unavailabilityId: string
  }>
}

export default async function UnavailabilityImpactPage({ params }: PageProps) {
  const { unavailabilityId } = await params
  const record = await getUnavailabilityRecord(decodeURIComponent(unavailabilityId))

  if (!record) {
    notFound()
  }

  const [shiftDetails, risks] = await Promise.all([
    getShiftDetails({ query: record.site_name }),
    getScheduleRisks(record.site_name),
  ])
  const impactedShiftDetails = shiftDetails.filter(
    (row) =>
      row.project_name === record.project_name &&
      row.site_name === record.site_name &&
      row.plan_date === record.unavailable_date &&
      row.interval_start < record.end_time &&
      row.interval_end > record.start_time
  )
  const relatedRisks = risks.filter(
    (risk) =>
      risk.project_name === record.project_name &&
      risk.site_name === record.site_name &&
      risk.plan_date === record.unavailable_date &&
      risk.interval_start < record.end_time &&
      risk.interval_end > record.start_time
  )
  const totalGap = impactedShiftDetails.reduce(
    (sum, row) => sum + row.gap_agents,
    0
  )
  const primaryPlanId = impactedShiftDetails[0]?.plan_id
  const scopeLabel = buildReviewScopeLabel({
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    startTime: record.start_time,
    endTime: record.end_time,
  })
  const shiftHref = buildShiftDetailsHref({
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    intervalStart: record.start_time,
    intervalEnd: record.end_time,
  })
  const riskHref = buildScheduleRisksHref({
    project: record.project_name,
    site: record.site_name,
    date: record.unavailable_date,
    intervalStart: record.start_time,
    intervalEnd: record.end_time,
  })
  const planHref = buildPlanDetailHref(primaryPlanId)
  const listHref = buildUnavailabilityHref()

  return (
    <AppShell title="不可用影响定位" searchPlaceholder="搜索不可用、班次或风险">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">不可用影响定位</h1>
            <p className="text-sm text-muted-foreground">
              {record.staff_name} / {record.team_name} / {record.unavailable_date} /{" "}
              {record.start_time}-{record.end_time}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={shiftHref}>查看班次</Link>
            </Button>
            {primaryPlanId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={planHref}>计划详情</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href={listHref}>返回不可用</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="grid gap-4">
            <section className="grid gap-4 md:grid-cols-4">
              <MetricCard
                title="不可用状态"
                value={unavailabilityStatusLabel(record.status)}
                description={record.unavailability_id}
              />
              <MetricCard
                title="影响班次"
                value={`${impactedShiftDetails.length}`}
                description="按 0.5h 时段匹配"
              />
              <MetricCard
                title="关联风险"
                value={`${relatedRisks.length}`}
                description="同项目同职场重叠时段"
              />
              <MetricCard
                title="排班缺口"
                value={`${totalGap}`}
                description="影响班次缺口合计"
              />
            </section>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>不可用记录</CardTitle>
                  <CardDescription>
                    本页只定位影响，不触发审批、批量调班或自动排班
                  </CardDescription>
                </div>
                <Badge variant={record.status === "active" ? "default" : "outline"}>
                  {unavailabilityStatusLabel(record.status)}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <InfoBlock label="人员与团队" value={`${record.staff_name} / ${record.team_name}`} />
                <InfoBlock label="项目与职场" value={`${record.project_name} / ${record.site_name}`} />
                <InfoBlock label="不可用原因" value={record.reason} />
                <InfoBlock label="备注" value={record.note} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>影响班次</CardTitle>
                  <CardDescription>
                    与不可用时间重叠的排班计划 0.5h 时段
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={shiftHref}>查看班次</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <UnavailabilityImpactShiftTable rows={impactedShiftDetails} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>关联风险</CardTitle>
                  <CardDescription>
                    同项目、同职场、同日期且与不可用时间重叠的风险提示
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={riskHref}>查看风险列表</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <UnavailabilityImpactRiskTable rows={relatedRisks} />
              </CardContent>
            </Card>
          </div>

          <aside className="grid gap-4 xl:sticky xl:top-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">当前复核范围</CardTitle>
                <CardDescription>宽屏下固定显示，保持 detail 页复核姿态</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">范围摘要</p>
                  <p className="mt-1">{scopeLabel}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <span className="text-muted-foreground">影响班次</span>
                    <span className="font-medium tabular-nums">{impactedShiftDetails.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <span className="text-muted-foreground">关联风险</span>
                    <span className="font-medium tabular-nums">{relatedRisks.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <span className="text-muted-foreground">排班缺口</span>
                    <span className="font-medium tabular-nums">{totalGap}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">复核任务</CardTitle>
                <CardDescription>继续沿着当前不可用范围检查风险、班次和计划</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={shiftHref}>查看班次</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={riskHref}>查看风险</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={planHref}>查看计划</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={listHref}>回到全部不可用</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </AppShell>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
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
