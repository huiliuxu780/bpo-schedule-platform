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
              本地只读视图，并列查看人员排班、实际登录、状态日志和异常标记。
            </p>
          </div>
          <Badge variant="outline">只读演示</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="人员" value={`${summary.totalPeople}`} description="本地样例" />
          <Metric title="有异常" value={`${summary.peopleWithAnomalies}`} description="需要复核" />
          <Metric title="计划工时" value={`${summary.scheduledHours.toFixed(1)}h`} description="排班轨道" />
          <Metric title="登录工时" value={`${summary.loginHours.toFixed(1)}h`} description="登录轨道" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>人员清单</CardTitle>
              <CardDescription>查看员工级排班、登录和状态轨道摘要。</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>职场</TableHead>
                    <TableHead>供应商</TableHead>
                    <TableHead>事件</TableHead>
                    <TableHead>异常</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
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
                        {row.tracks.schedule.length + row.tracks.login.length + row.tracks.status.length}
                      </TableCell>
                      <TableCell>{row.anomalies.length}</TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/person-timeline/${row.employeeId}`}>详情</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>暂不实现动作</CardTitle>
              <CardDescription>
                本批只做查看和定位，不触发真实状态回写或复核流程。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {summary.deferredActions.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
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
