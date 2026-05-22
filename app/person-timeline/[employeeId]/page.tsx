import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
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
  buildFulfillmentMatrixReturnHref,
  buildPersonFulfillmentDetailHref,
  fallbackPersonTimelines,
  getPersonTimelineAvailableDates,
  getPersonTimelineDailyView,
  getPersonTimeline,
  getPersonTimelineWeekView,
  getTimelineEventPosition,
  type PersonTimeline,
  type PersonTimelineDailyReviewContext,
  type PersonTimelineWeekView,
  type TimelineExceptionExplanation,
  type TimelineEvent,
} from "@/lib/person-timeline"
import {
  buildPersonScheduleSource,
  getPersonnelScheduleDetailForEmployeeDate,
} from "@/lib/personnel-schedule-details"
import { getSchedulePlan } from "@/lib/schedule-plans"

type PageProps = {
  params: Promise<{
    employeeId: string
  }>
  searchParams?: Promise<{
    date?: string
    team?: string
    group?: string
    returnDate?: string
    queue?: string
    exception?: string
  }>
}

export function generateStaticParams() {
  return fallbackPersonTimelines.map((row) => ({
    employeeId: row.employeeId,
  }))
}

export default async function PersonTimelineDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { employeeId } = await params
  const { date, team, group, returnDate, queue, exception } = (await searchParams) ?? {}
  const row = getPersonTimeline(decodeURIComponent(employeeId))

  if (!row) {
    notFound()
  }

  const weekView = getPersonTimelineWeekView(row, date ?? returnDate)
  const matrixDate = returnDate ?? date ?? weekView.selectedDate
  if (!date) {
    return (
      <PersonalWeekCalendar
        row={row}
        weekView={weekView}
        team={team}
        group={group}
        returnDate={returnDate}
        queue={queue}
        exception={exception}
      />
    )
  }

  const days = getPersonTimelineAvailableDates(row)
  const dailyView = getPersonTimelineDailyView(row, date)
  const selectedReviewContext = exception
    ? dailyView.reviewContexts.find((item) => item.key === exception)
    : undefined
  const scheduleDetail = getPersonnelScheduleDetailForEmployeeDate(
    row.employeeId,
    dailyView.date
  )
  const schedulePlan = scheduleDetail
    ? await getSchedulePlan(scheduleDetail.planId)
    : null
  const scheduleSource = buildPersonScheduleSource(scheduleDetail, schedulePlan)
  const returnHref =
    team && group
      ? buildFulfillmentMatrixReturnHref({
          teamId: team,
          groupId: group,
          date: matrixDate,
          queueFilter: queue,
          exceptionKey: exception,
        })
      : "/person-timeline"

  return (
    <AppShell title="个人单日三轨详情" searchPlaceholder="搜索团队、小组、人员或状态异常">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">{row.employeeName} 单日三轨详情</h1>
            <p className="text-sm text-muted-foreground">
              {row.employeeId} / {row.workplace} / {row.supplier} / {row.project} / {dailyView.date}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={returnHref}>
              {team && group && queue ? "返回异常队列" : team && group ? "返回小组矩阵" : "返回履约日历"}
            </Link>
          </Button>
        </div>

        {team && group && queue ? (
          <Card>
            <CardHeader>
              <CardTitle>返回上下文</CardTitle>
              <CardDescription>
                来自小组异常队列，返回后保留当前队列筛选和异常定位。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">队列 {queue}</Badge>
              {exception ? <Badge variant="outline">异常 {exception}</Badge> : null}
              <span>返回日期 {matrixDate}</span>
            </CardContent>
          </Card>
        ) : null}

        {selectedReviewContext ? (
          <PersonReviewContextCard reviewContext={selectedReviewContext} />
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="排班工时" value={`${dailyView.scheduledHours.toFixed(1)}h`} />
          <Metric title="登录工时" value={`${dailyView.loginHours.toFixed(1)}h`} />
          <Metric title="状态工时" value={`${dailyView.statusHours.toFixed(1)}h`} />
          <Metric title="异常" value={`${dailyView.anomalies.length}`} />
        </section>

        {scheduleSource ? (
          <Card>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>排班草稿来源</CardTitle>
                  <CardDescription>
                    从当前人员排班明细反查对应计划、班次窗口和需核对时段。
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{scheduleSource.linkedIntervalCount} 个时段</Badge>
                  <Badge variant="secondary">
                    {scheduleSource.reviewIntervalCount} 个时段需核对
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
              <div className="rounded-md border p-3 text-sm">
                <div className="font-medium">{scheduleSource.planId}</div>
                <div className="mt-2 grid gap-1 text-muted-foreground">
                  <span>班次 {scheduleSource.shiftType}</span>
                  <span>窗口 {scheduleSource.scheduledWindow}</span>
                  <span>技能 {scheduleSource.skill}</span>
                  <span>明细 {scheduleSource.scheduleDetailId}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={scheduleSource.planHref}>查看排班计划</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={scheduleSource.draftHref}>查看排班草稿</Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                {scheduleSource.reviewIntervals.length > 0 ? (
                  scheduleSource.reviewIntervals.map((item) => (
                    <div
                      key={`${item.intervalStart}-${item.intervalEnd}`}
                      className="rounded-md border p-3 text-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">
                          {item.intervalStart}-{item.intervalEnd}
                        </span>
                        <Badge variant="secondary">{item.status}</Badge>
                      </div>
                      <div className="mt-2 grid gap-2 text-muted-foreground sm:grid-cols-3">
                        <span>汇总 {item.scheduledAgents} 人</span>
                        <span>明细 {item.linkedPeopleCount} 人</span>
                        <span>差异 {item.difference} 人</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border p-3 text-sm text-muted-foreground">
                    当前人员排班明细与时段汇总一致。
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>人员日历</CardTitle>
            <CardDescription>切换日期查看当天排班、登录和状态对齐结果。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {days.map((day) => (
              <Button
                key={day.date}
                asChild
                size="sm"
                variant={day.date === dailyView.date ? "default" : "outline"}
              >
                <Link
                  href={buildPersonFulfillmentDetailHref({
                    employeeId: row.employeeId,
                    date: day.date,
                    teamId: team,
                    groupId: group,
                    returnDate: returnDate ?? day.date,
                    queueFilter: queue,
                    exceptionKey: exception,
                  })}
                >
                  {day.label} {day.weekday}
                  {day.anomalyCount > 0 ? ` (${day.anomalyCount})` : ""}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>当天三轨时间轴</CardTitle>
            <CardDescription>
              三条横向轨道对齐展示当天排班、登录和状态切片。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                <TimelineScale />
                <TimelineTrack title="排班轨道" rows={dailyView.tracks.schedule} tone="schedule" />
                <TimelineTrack title="登录轨道" rows={dailyView.tracks.login} tone="login" />
                <TimelineTrack title="状态轨道" rows={dailyView.tracks.status} tone="status" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>异常解释</CardTitle>
            <CardDescription>
              结合排班、登录和状态轨道，说明异常证据和主管现场判断动作。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {dailyView.exceptionExplanations.length === 0 ? (
              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                当天没有异常标记。
              </div>
            ) : (
              dailyView.exceptionExplanations.map((explanation) => (
                <ExceptionExplanationCard key={explanation.id} explanation={explanation} />
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function ExceptionExplanationCard({
  explanation,
}: {
  explanation: TimelineExceptionExplanation
}) {
  return (
    <div className="rounded-lg border border-primary/20 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="grid gap-1">
          <div className="text-sm font-medium">
            {explanation.start}-{explanation.end} / {explanation.type}
          </div>
          <div className="text-xs text-muted-foreground">{explanation.title}</div>
        </div>
        <Badge variant={explanation.priority === "high" ? "destructive" : "outline"}>
          {priorityLabel[explanation.priority]}
        </Badge>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
        <div>
          涉及轨道：{explanation.involvedTracks.map((track) => trackLabel[track]).join(" / ")}
        </div>
        <div>影响时长：{explanation.impactHours.toFixed(1)}h</div>
        <div>证据：{explanation.evidence}</div>
        <div>建议动作：{explanation.supervisorAction}</div>
      </div>
    </div>
  )
}

function PersonReviewContextCard({
  reviewContext,
}: {
  reviewContext: PersonTimelineDailyReviewContext
}) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>异常复核口径</CardTitle>
            <CardDescription>
              与小组异常队列保持一致，用于解释当前个人三轨详情的处理语境。
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{reviewContext.reviewGroup.label}</Badge>
            <Badge variant="outline">
              已齐 {reviewContext.readyCount} 项 / 待补 {reviewContext.missingCount} 项
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="rounded-md border p-3 text-sm">
          <div className="font-medium">{reviewContext.title}</div>
          <div className="mt-2 grid gap-1 text-muted-foreground">
            <div>处理分组：{reviewContext.reviewGroup.reason}</div>
            <div>当前判断：{reviewContext.currentJudgment}</div>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {reviewContext.closureChecklist.items.map((item) => (
            <div key={item.label} className="rounded-md border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{item.label}</span>
                <Badge variant="outline">{item.status}</Badge>
              </div>
              <div className="mt-2 grid gap-1 text-muted-foreground">
                <div>负责角色：{item.ownerRole}</div>
                <div>{item.judgmentImpact}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PersonalWeekCalendar({
  row,
  weekView,
  team,
  group,
  returnDate,
  queue,
  exception,
}: {
  row: PersonTimeline
  weekView: PersonTimelineWeekView
  team?: string
  group?: string
  returnDate?: string
  queue?: string
  exception?: string
}) {
  const returnHref =
    team && group && returnDate
      ? buildFulfillmentMatrixReturnHref({
          teamId: team,
          groupId: group,
          date: returnDate,
          queueFilter: queue,
          exceptionKey: exception,
        })
      : team && group
        ? `/person-timeline?team=${encodeURIComponent(team)}&group=${encodeURIComponent(group)}`
      : "/person-timeline"

  return (
    <AppShell title="个人履约日历" searchPlaceholder="搜索团队、小组、人员或状态异常">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">{row.employeeName} 个人履约日历</h1>
            <p className="text-sm text-muted-foreground">
              {row.employeeId} / {row.workplace} / {row.supplier} / {row.project} / {weekView.weekStart} 至 {weekView.weekEnd}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={returnHref}>
              {team && group && queue ? "返回异常队列" : team && group ? "返回小组矩阵" : "返回履约日历"}
            </Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="计划天数" value={`${weekView.summary.scheduledDays}`} />
          <Metric title="登录天数" value={`${weekView.summary.loginDays}`} />
          <Metric title="缺口工时" value={`${weekView.summary.gapHours.toFixed(1)}h`} />
          <Metric title="异常" value={`${weekView.summary.anomalyCount}`} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>个人周日历</CardTitle>
            <CardDescription>先看一周履约分布，再选择某一天查看排班、登录和状态三轨详情。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {weekView.days.map((day) => {
                const hasRisk = day.gapHours > 0 || day.anomalyCount > 0
                const isRestDay = day.scheduledHours === 0 && day.loginHours === 0

                return (
                  <Link
                    key={day.date}
                    href={buildPersonFulfillmentDetailHref({
                      employeeId: row.employeeId,
                      date: day.date,
                      teamId: team,
                      groupId: group,
                      returnDate: returnDate ?? day.date,
                      queueFilter: queue,
                      exceptionKey: exception,
                    })}
                    className={`rounded-lg border p-3 text-sm transition-colors hover:bg-muted ${
                      hasRisk ? "border-primary/50" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{day.weekday}</div>
                        <div className="text-xs text-muted-foreground">{day.label}</div>
                      </div>
                      <Badge variant={hasRisk ? "destructive" : "outline"}>
                        {isRestDay ? "休" : hasRisk ? "异常" : "正常"}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                      <span>排班 {day.scheduledHours.toFixed(1)}h</span>
                      <span>登录 {day.loginHours.toFixed(1)}h</span>
                      <span>缺口 {day.gapHours.toFixed(1)}h</span>
                      <span>异常 {day.anomalyCount}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}

function TimelineScale() {
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]

  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 border-b pb-2 text-xs text-muted-foreground">
      <div>时间</div>
      <div className="relative h-5">
        {hours.map((hour, index) => (
          <span
            key={hour}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${(index / (hours.length - 1)) * 100}%` }}
          >
            {hour}
          </span>
        ))}
      </div>
    </div>
  )
}

function TimelineTrack({
  title,
  rows,
  tone,
}: {
  title: string
  rows: TimelineEvent[]
  tone: "schedule" | "login" | "status"
}) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 border-b py-4 last:border-b-0">
      <div className="pt-2 text-sm font-medium">{title}</div>
      <div className="relative h-16 rounded-md bg-muted/50">
        {rows.length === 0 ? (
          <div className="flex h-full items-center px-3 text-sm text-muted-foreground">
            当天没有记录
          </div>
        ) : (
          rows.map((item) => {
            const position = getTimelineEventPosition(item)

            return (
              <div
                key={item.id}
                className={`absolute top-3 flex h-10 min-w-16 flex-col justify-center rounded-md border px-2 text-xs shadow-sm ${timelineToneClass[tone]}`}
                style={{
                  left: `${position.leftPercent}%`,
                  width: `${position.widthPercent}%`,
                }}
                title={`${item.label} ${item.start}-${item.end}`}
              >
                <span className="truncate font-medium">{item.label}</span>
                <span className="truncate opacity-80">
                  {item.start}-{item.end}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const timelineToneClass = {
  schedule: "border-sky-300 bg-sky-100 text-sky-950 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100",
  login: "border-emerald-300 bg-emerald-100 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  status: "border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
}

const priorityLabel = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
}

const trackLabel = {
  schedule: "排班",
  login: "登录",
  status: "状态",
}
