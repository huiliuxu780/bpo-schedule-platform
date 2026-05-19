import Link from "next/link"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fallbackPersonTimelines,
  getPersonTimelineAvailableDates,
  summarizePersonTimelines,
} from "@/lib/person-timeline"

export default function PersonTimelinePage() {
  const rows = fallbackPersonTimelines
  const summary = summarizePersonTimelines(rows)

  return (
    <AppShell title="人员时间轴" searchPlaceholder="搜索员工、职场或异常">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">人员时间轴</h1>
            <p className="text-sm text-muted-foreground">
              先按人员查看日历，再进入某一天对齐排班、登录和状态轨道。
            </p>
          </div>
          <Badge variant="outline">人员日历</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="人员" value={`${summary.totalPeople}`} description="当前范围" />
          <Metric title="有异常" value={`${summary.peopleWithAnomalies}`} description="需要复核" />
          <Metric title="计划工时" value={`${summary.scheduledHours.toFixed(1)}h`} description="排班轨道" />
          <Metric title="登录工时" value={`${summary.loginHours.toFixed(1)}h`} description="登录轨道" />
        </section>

        <section className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>人员日历</CardTitle>
              <CardDescription>选择员工和日期，进入当天的三轨时间轴。</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>职场</TableHead>
                    <TableHead>供应商</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>事件</TableHead>
                    <TableHead>异常</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => {
                    const days = getPersonTimelineAvailableDates(row)

                    return (
                      <TableRow key={row.employeeId}>
                        <TableCell>
                          <div className="flex min-w-36 flex-col gap-1">
                            <span className="font-medium">{row.employeeName}</span>
                            <span className="text-xs text-muted-foreground">
                              {row.employeeId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{row.workplace}</TableCell>
                        <TableCell>{row.supplier}</TableCell>
                        <TableCell>
                          <div className="flex min-w-40 flex-wrap gap-2">
                            {days.map((day) => (
                              <Button
                                key={day.date}
                                asChild
                                size="sm"
                                variant={day.anomalyCount > 0 ? "default" : "outline"}
                              >
                                <Link href={`/person-timeline/${row.employeeId}?date=${day.date}`}>
                                  {day.label}
                                  {day.anomalyCount > 0 ? ` (${day.anomalyCount})` : ""}
                                </Link>
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {row.tracks.schedule.length + row.tracks.login.length + row.tracks.status.length}
                        </TableCell>
                        <TableCell>{row.anomalies.length}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}
