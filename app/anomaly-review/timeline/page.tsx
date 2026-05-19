import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  fallbackReviewTimelineSteps,
  summarizeReviewTimeline,
} from "@/lib/review-status-timeline"

export default function ReviewTimelinePage() {
  const rows = fallbackReviewTimelineSteps
  const summary = summarizeReviewTimeline(rows)

  return (
    <AppShell title="复核时间线" searchPlaceholder="搜索状态、责任人或证据">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/anomaly-review">异常复核</Link> / 状态时间线
            </div>
            <h1 className="text-lg font-semibold">异常复核状态时间线</h1>
            <p className="text-sm text-muted-foreground">
              展示异常从识别、分派、复核到关闭的状态流。
            </p>
          </div>
          <Badge variant="outline">状态跟踪</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="状态数" value={`${summary.totalSteps}`} description="闭环状态" />
          <Metric title="证据项" value={`${summary.totalEvidenceItems}`} description="用于复核说明" />
          <Metric title="样例异常" value={`${summary.totalExampleCases}`} description="复核页样例引用" />
          <Metric title="责任角色" value={`${summary.owners.length}`} description="跨运营、现场、数据" />
        </section>

        <section className="grid gap-4">
          {rows.map((row, index) => (
            <Card key={row.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle>
                      {index + 1}. {row.title}
                    </CardTitle>
                    <CardDescription>{row.entryCondition}</CardDescription>
                  </div>
                  <Badge variant="secondary">{row.owner}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
                <div>
                  <div className="text-xs text-muted-foreground">需要证据</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {row.evidence.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">退出条件</div>
                  <div className="mt-2 text-sm">{row.exitCondition}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">样例异常</div>
                  <div className="mt-2 text-sm">{row.exampleCaseIds.join(" / ")}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </AppShell>
  )
}

function Metric({
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
