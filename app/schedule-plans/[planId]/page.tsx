import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { PersonnelScheduleDetailTable } from "@/components/personnel-schedule-detail-table"
import { SchedulePlanIntervalTable } from "@/components/schedule-plan-interval-table"
import {
  formatCoverageRate,
  getSchedulePlan,
  getScheduleRisks,
  schedulePlanStatusLabel,
} from "@/lib/schedule-plans"
import {
  buildPersonTimelineHref,
  buildPersonnelIntervalTrace,
  buildScheduleGapExplanation,
  getPersonnelScheduleFieldCoverage,
  getPersonnelScheduleDetails,
  summarizePersonnelScheduleDetails,
} from "@/lib/personnel-schedule-details"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getUnavailability } from "@/lib/unavailability"

type PageProps = {
  params: Promise<{
    planId: string
  }>
}

export default async function SchedulePlanDetailPage({ params }: PageProps) {
  const { planId } = await params
  const plan = await getSchedulePlan(planId)

  if (!plan) {
    notFound()
  }

  const [risks, activeUnavailability] = await Promise.all([
    getScheduleRisks(plan.summary.id),
    getUnavailability({ query: plan.summary.site_name, status: "active" }),
  ])
  const gapIntervals = plan.intervals.filter((item) => item.gap_agents > 0)
  const personnelRows = getPersonnelScheduleDetails(plan.summary.id)
  const personnelSummary = summarizePersonnelScheduleDetails(personnelRows)
  const fieldCoverage = getPersonnelScheduleFieldCoverage(personnelRows)
  const intervalTraces = plan.intervals.map((intervalItem) =>
    buildPersonnelIntervalTrace(
      plan.summary.id,
      intervalItem.interval_start,
      intervalItem.interval_end
    )
  )
  const gapExplanations = gapIntervals.map((intervalItem) =>
    buildScheduleGapExplanation(
      plan.summary.id,
      intervalItem.interval_start,
      intervalItem.interval_end
    )
  )
  const relatedRisks = risks.filter(
    (risk) =>
      risk.plan_id === plan.summary.id &&
      risk.plan_date === plan.summary.plan_date
  )
  const primaryRisk = relatedRisks[0] ?? null
  const relatedUnavailability = activeUnavailability.filter(
    (row) =>
      row.project_name === plan.summary.project_name &&
      row.site_name === plan.summary.site_name &&
      row.unavailable_date === plan.summary.plan_date
  )

  return (
    <AppShell title="排班计划详情" searchPlaceholder="搜索计划、项目或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{plan.summary.project_name}</h1>
            <p className="text-sm text-muted-foreground">
              {plan.summary.site_name} / {plan.summary.plan_date} /{" "}
              {plan.summary.version}
            </p>
          </div>
          <div className="flex gap-2">
            {plan.summary.status === "draft" ? (
              <Button asChild size="sm">
                <Link href={`/schedule-plans/${plan.summary.id}/edit`}>
                  编辑草稿
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href="/schedule-plans">返回列表</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <DetailCard title="状态" value={schedulePlanStatusLabel(plan.summary.status)} />
          <DetailCard title="预测人次" value={`${plan.summary.forecast_agents}`} />
          <DetailCard title="已排人次" value={`${plan.summary.scheduled_agents}`} />
          <DetailCard
            title="覆盖率"
            value={formatCoverageRate(plan.summary.coverage_rate)}
            description={`缺口 ${plan.summary.gap_agents} 人次`}
          />
        </section>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>复核链路</CardTitle>
              <CardDescription>
                从排班计划继续检查班次、风险和不可用影响
              </CardDescription>
            </div>
            <Badge variant="outline">计划详情</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 md:grid-cols-4">
              <DetailCard
                title="0.5h 时段"
                value={`${plan.intervals.length}`}
                description="当前计划时段数"
              />
              <DetailCard
                title="缺口时段"
                value={`${gapIntervals.length}`}
                description="需人工复核"
              />
              <DetailCard
                title="关联风险"
                value={`${relatedRisks.length}`}
                description="同计划本地风险提示"
              />
              <DetailCard
                title="生效不可用"
                value={`${relatedUnavailability.length}`}
                description="同日期同职场"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/shift-details?query=${plan.summary.id}`}>查看班次</Link>
              </Button>
              {primaryRisk ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/schedule-risks/${encodeURIComponent(primaryRisk.risk_id)}`}
                  >
                    查看风险
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  查看风险
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/unavailability?query=${encodeURIComponent(plan.summary.site_name)}&status=active`}
                >
                  查看不可用
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>0.5h 时段明细</CardTitle>
              <CardDescription>
                只读展示预测人数、已排人数、缺口与备注，下方可追溯对应人员
              </CardDescription>
            </div>
            <Badge variant="outline">{plan.summary.id}</Badge>
          </CardHeader>
          <CardContent>
            <SchedulePlanIntervalTable intervals={plan.intervals} />
          </CardContent>
        </Card>

        <Card id="personnel-schedule-details">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>人员级排班明细</CardTitle>
              <CardDescription>
                从当前计划追溯到员工、班次、技能和 0.5h 展开结果
              </CardDescription>
            </div>
            <Badge variant="outline">{personnelSummary.peopleCount} 人</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 md:grid-cols-4">
              <DetailCard
                title="人员"
                value={`${personnelSummary.peopleCount}`}
                description="当前计划明细"
              />
              <DetailCard
                title="计划工时"
                value={`${personnelSummary.totalScheduledHours.toFixed(1)}h`}
                description="人员级合计"
              />
              <DetailCard
                title="异常人员"
                value={`${personnelSummary.peopleWithAnomalies}`}
                description="可进入个人时间轴复核"
              />
              <DetailCard
                title="覆盖时段"
                value={`${personnelSummary.intervalCount}`}
                description="0.5h 展开结果"
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">人员明细字段</div>
                  <div className="text-xs text-muted-foreground">
                    员工、供应商、职场、项目、技能、班次和异常标记
                  </div>
                </div>
                <Badge variant="outline">
                  完整 {fieldCoverage.completeRows}/{fieldCoverage.totalRows}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {personnelRows.map((row) => (
                  <div
                    key={row.scheduleDetailId}
                    className="rounded-md border bg-muted/20 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">
                        {row.employeeId} {row.employeeName}
                      </div>
                      <Badge
                        variant={row.anomalyLabels.length > 0 ? "destructive" : "secondary"}
                      >
                        {row.anomalyLabels.length > 0
                          ? row.anomalyLabels.join("、")
                          : "无异常"}
                      </Badge>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                      <span>{row.supplier} / {row.workplace}</span>
                      <span>{row.project}</span>
                      <span>{row.shiftType}</span>
                      <span>{row.skillGroup} / {row.skillLevel}</span>
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-3">
                      <Link href={buildPersonTimelineHref(row)}>查看当天履约</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">缺口涉及人员与班次</div>
                  <div className="text-xs text-muted-foreground">
                    对缺口时段展示已在该时段的人，以及同计划可继续复核的班次
                  </div>
                </div>
                <Badge variant="outline">{gapExplanations.length} 个缺口时段</Badge>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {gapExplanations.map((gap) => (
                  <div
                    key={`${gap.intervalStart}-${gap.intervalEnd}`}
                    className="rounded-md border bg-muted/20 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">
                        {gap.intervalStart}-{gap.intervalEnd}
                      </div>
                      <Badge variant="secondary">
                        涉及 {gap.involvedPeople.length} 人
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <GapPersonList
                        title="当前已排"
                        people={gap.involvedPeople}
                        emptyText="当前样例暂无已排人员"
                      />
                      <GapPersonList
                        title="可复核班次"
                        people={gap.candidatePeople}
                        emptyText="暂无其他可复核班次"
                      />
                    </div>
                  </div>
                ))}
                {gapExplanations.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    当前计划暂无缺口时段
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">0.5h 时段人员追溯</div>
                  <div className="text-xs text-muted-foreground">
                    每个时段显示已排人员、供应商、班次、技能和异常标签
                  </div>
                </div>
                <Badge variant="outline">{intervalTraces.length} 个时段</Badge>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {intervalTraces.map((trace) => (
                  <div
                    key={`${trace.intervalStart}-${trace.intervalEnd}`}
                    className="rounded-md border bg-muted/20 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-muted-foreground">
                        {trace.intervalStart}-{trace.intervalEnd}
                      </div>
                      <Badge variant="secondary">
                        {trace.assignedPeople.length} 人已排
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-col gap-2">
                      {trace.assignedPeople.length > 0 ? (
                        trace.assignedPeople.map((person) => (
                          <div key={person.employeeId} className="text-xs">
                            <div className="font-medium">
                              {person.employeeName} / {person.supplier}
                            </div>
                            <div className="text-muted-foreground">
                              {person.shiftType} / {person.skill}
                            </div>
                            {person.anomalyLabels.length > 0 ? (
                              <Badge variant="destructive" className="mt-1">
                                {person.anomalyLabels.join("、")}
                              </Badge>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground">暂无已排人员</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <PersonnelScheduleDetailTable rows={personnelRows} />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function GapPersonList({
  title,
  people,
  emptyText,
}: {
  title: string
  people: {
    employeeId: string
    employeeName: string
    supplier: string
    shiftType: string
    scheduledWindow: string
    skill: string
    timelineHref: string
  }[]
  emptyText: string
}) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 flex flex-col gap-2">
        {people.length > 0 ? (
          people.map((person) => (
            <div key={person.employeeId} className="rounded-md border bg-background p-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">
                  {person.employeeName} / {person.supplier}
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href={person.timelineHref}>看履约</Link>
                </Button>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {person.shiftType} / {person.scheduledWindow} / {person.skill}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      {description ? (
        <CardContent className="text-xs text-muted-foreground">
          {description}
        </CardContent>
      ) : null}
    </Card>
  )
}
