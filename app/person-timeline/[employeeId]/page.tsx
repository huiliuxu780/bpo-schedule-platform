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
  getPersonTimeline,
  type TimelineEvent,
} from "@/lib/person-timeline"

type PageProps = {
  params: Promise<{
    employeeId: string
  }>
}

export function generateStaticParams() {
  return fallbackPersonTimelines.map((row) => ({
    employeeId: row.employeeId,
  }))
}

export default async function PersonTimelineDetailPage({ params }: PageProps) {
  const { employeeId } = await params
  const row = getPersonTimeline(decodeURIComponent(employeeId))

  if (!row) {
    notFound()
  }

  return (
    <AppShell title="人员时间轴详情" searchPlaceholder="搜索时间轴事件">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">{row.employeeName} 时间轴</h1>
            <p className="text-sm text-muted-foreground">
              {row.employeeId} / {row.workplace} / {row.supplier} / {row.project}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/person-timeline">返回人员时间轴</Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="排班事件" value={`${row.tracks.schedule.length}`} />
          <Metric title="登录事件" value={`${row.tracks.login.length}`} />
          <Metric title="状态事件" value={`${row.tracks.status.length}`} />
          <Metric title="异常" value={`${row.anomalies.length}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <TrackCard title="排班轨道" rows={row.tracks.schedule} />
          <TrackCard title="登录轨道" rows={row.tracks.login} />
          <TrackCard title="状态轨道" rows={row.tracks.status} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>异常标记</CardTitle>
            <CardDescription>
              只展示本地识别结果，不提交复核、不回写状态、不触发审批。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {row.anomalies.length === 0 ? (
              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                当前样例没有异常标记。
              </div>
            ) : (
              row.anomalies.map((anomaly) => (
                <div key={anomaly.code} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium">{anomaly.title}</div>
                    <Badge variant="outline">{anomaly.severity}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {anomaly.code}
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

function TrackCard({ title, rows }: { title: string; rows: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {rows.map((item) => (
          <div key={item.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">{item.label}</div>
              <Badge variant="secondary">{item.durationHours.toFixed(1)}h</Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {item.start}-{item.end}
              {item.status ? ` / ${item.status}` : ""}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
