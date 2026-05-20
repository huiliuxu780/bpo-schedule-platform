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
  fallbackPersonTimelines,
  getPersonTimelineAvailableDates,
  getPersonTimelineDailyView,
  getPersonTimeline,
  getTimelineEventPosition,
  type TimelineEvent,
} from "@/lib/person-timeline"

type PageProps = {
  params: Promise<{
    employeeId: string
  }>
  searchParams?: Promise<{
    date?: string
    team?: string
    group?: string
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
  const { date, team, group } = (await searchParams) ?? {}
  const row = getPersonTimeline(decodeURIComponent(employeeId))

  if (!row) {
    notFound()
  }

  const days = getPersonTimelineAvailableDates(row)
  const dailyView = getPersonTimelineDailyView(row, date)
  const returnHref =
    team && group
      ? `/person-timeline?team=${encodeURIComponent(team)}&group=${encodeURIComponent(group)}&date=${dailyView.date}`
      : "/person-timeline"
  const detailQuery =
    team && group ? `&team=${encodeURIComponent(team)}&group=${encodeURIComponent(group)}` : ""

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
            <Link href={returnHref}>{team && group ? "返回小组矩阵" : "返回履约日历"}</Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="排班工时" value={`${dailyView.scheduledHours.toFixed(1)}h`} />
          <Metric title="登录工时" value={`${dailyView.loginHours.toFixed(1)}h`} />
          <Metric title="状态工时" value={`${dailyView.statusHours.toFixed(1)}h`} />
          <Metric title="异常" value={`${dailyView.anomalies.length}`} />
        </section>

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
                <Link href={`/person-timeline/${row.employeeId}?date=${day.date}${detailQuery}`}>
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
            <CardTitle>异常说明</CardTitle>
            <CardDescription>
              展示当天排班、登录和状态对齐后的异常原因。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {dailyView.anomalies.length === 0 ? (
              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                当天没有异常标记。
              </div>
            ) : (
              dailyView.anomalies.map((anomaly) => (
                <div key={anomaly.code} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium">{anomaly.title}</div>
                    <Badge variant="outline">{anomaly.severity}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {severityLabel[anomaly.severity]}
                  </div>
                </div>
              ))
            )}
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

const severityLabel = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
}
