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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fallbackShiftTypes,
  shiftTypeStatusLabel,
  summarizeShiftTypes,
} from "@/lib/shift-type-catalog"

export default function ShiftTypesPage() {
  const rows = fallbackShiftTypes
  const summary = summarizeShiftTypes(rows)

  return (
    <AppShell title="班次类型" searchPlaceholder="搜索班次、项目或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">班次类型</h1>
            <p className="text-sm text-muted-foreground">
              本地只读视图，用于验收人员级排班如何引用班次代码、休息、饭点和 0.5h 展开口径。
            </p>
          </div>
          <Badge variant="outline">只读演示</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="班次类型" value={`${summary.total}`} description={`${summary.active} 个启用`} />
          <Metric title="排班引用" value={`${summary.totalAssignedPeople}`} description="本地样例人数" />
          <Metric title="计划工时" value={`${summary.totalScheduledHours.toFixed(1)}h`} description="按班次时长估算" />
          <Metric title="含饭点" value={`${summary.withMealBreak}`} description="用于导入校验" />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>班次目录</CardTitle>
            <CardDescription>
              展示班次类型最低字段，不执行规则计算、排班生成或主数据写入。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>班次</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>休息/饭点</TableHead>
                  <TableHead>适用范围</TableHead>
                  <TableHead>引用</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex min-w-44 flex-col gap-1">
                        <span className="font-medium">{row.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.code} / {row.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.startTime}-{row.endTime}
                      <div className="text-xs text-muted-foreground">
                        {row.durationHours}h / {row.halfHourIntervals} 个 0.5h
                      </div>
                    </TableCell>
                    <TableCell>
                      饭点 {row.mealBreakMinutes}m
                      <div className="text-xs text-muted-foreground">
                        休息 {row.restBreakMinutes}m
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.workplace}
                      <div className="text-xs text-muted-foreground">
                        {row.supplier} / {row.skillGroups.join("、")}
                      </div>
                    </TableCell>
                    <TableCell>{row.assignedPeople} 人</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "active" ? "default" : "secondary"}>
                        {shiftTypeStatusLabel(row.status)}
                      </Badge>
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
              本页只确认生产雏形需要的班次类型可视范围。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {summary.deferredActions.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </CardContent>
        </Card>
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
