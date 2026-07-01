"use client"

import * as React from "react"
import Link from "next/link"

import { MetricCard } from "@/components/metric-card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  RosterCellStatus,
  RosterDraftViewModel,
  RosterWeek,
} from "@/lib/roster-drafts"
import { cn } from "@/lib/utils"

const statusLabels: Record<RosterCellStatus, string> = {
  copied: "复制生成",
  needs_confirmation: "待确认",
  exception: "异常",
  filtered_annotation: "非班务标注已过滤",
}

const statusClasses: Record<RosterCellStatus, string> = {
  copied: "border-primary/20 bg-primary/10 text-primary",
  needs_confirmation: "border-muted-foreground/20 bg-muted text-muted-foreground",
  exception: "border-destructive/30 bg-destructive/10 text-destructive",
  filtered_annotation: "border-accent bg-accent text-accent-foreground",
}

export function RosterDraftWorkbench({
  model,
  targetMonths,
}: {
  model: RosterDraftViewModel
  targetMonths: string[]
}) {
  const [selectedMonth, setSelectedMonth] = React.useState(model.targetMonth)
  const [selectedWeekId, setSelectedWeekId] = React.useState(
    model.weeks[0]?.weekId ?? "W1"
  )
  const selectedWeek =
    model.weeks.find((week) => week.weekId === selectedWeekId) ?? model.weeks[0]
  const selectedWeekDetails = selectedWeek
    ? model.weekDetails.filter((detail) => detail.weekId === selectedWeek.weekId)
    : []

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>生成月班表草稿</CardTitle>
              <CardDescription>
                基于本地配置和上一周同星期稳定班种生成，可查看月视图和周视图。
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-36" aria-label="目标月份">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {targetMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild>
                <Link href={`/roster-drafts?month=${selectedMonth}`}>
                  生成草稿
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="覆盖员工"
          value={`${model.summary.employeeCount}`}
          description={`${model.project.projectName} / ${model.project.workplaceName}`}
        />
        <MetricCard
          title="生成班种"
          value={`${model.summary.generatedShiftCount}`}
          description={`${model.summary.copiedCoverageDays} 天存在复制结果`}
        />
        <MetricCard
          title="待排人员"
          value={`${model.summary.pendingEmployeeCount}`}
          description="新员工、换组或缺少模板"
        />
        <MetricCard
          title="异常与过滤"
          value={`${model.summary.exceptionCount + model.summary.filteredAnnotationCount}`}
          description={`${model.summary.exceptionCount} 条异常 / ${model.summary.filteredAnnotationCount} 条标注过滤`}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>状态说明</CardTitle>
          <CardDescription>
            月视图用标记说明单元格来源，异常和待排均为只读信息。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {model.statusLegend.map((item) => (
            <Badge
              key={item.status}
              variant="outline"
              className={cn(statusClasses[item.status], "border")}
              title={item.description}
            >
              {item.label}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="month" className="flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="month">月视图</TabsTrigger>
          <TabsTrigger value="week">周视图</TabsTrigger>
        </TabsList>
        <TabsContent value="month" className="m-0">
          <MonthRosterTable model={model} />
        </TabsContent>
        <TabsContent value="week" className="m-0">
          <WeekRosterPanel
            weeks={model.weeks}
            selectedWeekId={selectedWeek?.weekId ?? selectedWeekId}
            onSelectedWeekIdChange={setSelectedWeekId}
            details={selectedWeekDetails}
          />
        </TabsContent>
      </Tabs>

      <section className="grid gap-4 xl:grid-cols-3">
        <PendingEmployeeCard model={model} />
        <ExceptionCard model={model} />
        <FilteredAnnotationCard model={model} />
      </section>
    </div>
  )
}

function MonthRosterTable({ model }: { model: RosterDraftViewModel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{model.targetMonth} 月视图</CardTitle>
        <CardDescription>
          人员 x 日期总览，首列固定，横向滚动查看整月 31 天。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-20 min-w-44 bg-card">
                  员工
                </TableHead>
                {model.monthDays.map((day) => (
                  <TableHead
                    key={day.date}
                    className="min-w-20 text-center text-xs"
                  >
                    <div className="font-medium">{day.dayOfMonth}</div>
                    <div className="text-muted-foreground">周{day.weekdayLabel}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {model.monthRows.map((row) => (
                <TableRow key={row.employeeId}>
                  <TableCell className="sticky left-0 z-10 min-w-44 bg-card align-top">
                    <div className="font-medium">{row.employeeName}</div>
                    <div className="text-xs text-muted-foreground">{row.teamName}</div>
                  </TableCell>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.date} className="min-w-20 text-center">
                      <div
                        className={cn(
                          "mx-auto flex min-h-10 w-16 flex-col items-center justify-center rounded-md border px-1 py-1 text-xs",
                          statusClasses[cell.status]
                        )}
                        title={cell.reason ?? statusLabels[cell.status]}
                      >
                        <span className="font-medium">
                          {cell.shiftCode ?? (cell.status === "exception" ? "!" : "待")}
                        </span>
                        <span className="mt-0.5 size-1.5 rounded-full bg-current" />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function WeekRosterPanel({
  weeks,
  selectedWeekId,
  onSelectedWeekIdChange,
  details,
}: {
  weeks: RosterWeek[]
  selectedWeekId: string
  onSelectedWeekIdChange: (weekId: string) => void
  details: RosterDraftViewModel["weekDetails"]
}) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>周视图</CardTitle>
            <CardDescription>
              展开单周明细，查看时间段、来源日期和待确认原因。
            </CardDescription>
          </div>
          <Select value={selectedWeekId} onValueChange={onSelectedWeekIdChange}>
            <SelectTrigger className="w-36" aria-label="周选择">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {weeks.map((week) => (
                <SelectItem key={week.weekId} value={week.weekId}>
                  {week.weekId} / {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>员工</TableHead>
                <TableHead>小组</TableHead>
                <TableHead>班种</TableHead>
                <TableHead>时间段</TableHead>
                <TableHead>来源日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>原因</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail) => (
                <TableRow key={`${detail.employeeId}-${detail.businessDate}`}>
                  <TableCell className="whitespace-nowrap">{detail.businessDate}</TableCell>
                  <TableCell className="whitespace-nowrap">{detail.employeeName}</TableCell>
                  <TableCell className="whitespace-nowrap">{detail.teamName}</TableCell>
                  <TableCell className="font-medium">
                    {detail.shiftCode ?? "待确认"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {detail.intervalLabel ?? "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {detail.sourceDate ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(statusClasses[detail.status], "border")}
                    >
                      {statusLabels[detail.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-56 text-muted-foreground">
                    {detail.reason}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingEmployeeCard({ model }: { model: RosterDraftViewModel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>待排人员</CardTitle>
        <CardDescription>只读，新员工、换组和缺少模板人员。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {model.pendingEmployees.map((pending) => (
          <div key={pending.employeeId} className="rounded-lg border p-3">
            <div className="font-medium">{pending.employeeName}</div>
            <div className="text-xs text-muted-foreground">{pending.teamName}</div>
            <div className="mt-2 text-sm">{pending.reasonLabel}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ExceptionCard({ model }: { model: RosterDraftViewModel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>异常清单</CardTitle>
        <CardDescription>只读，排班师后续人工处理。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {model.exceptions.slice(0, 8).map((item) => (
          <div
            key={`${item.employeeId}-${item.targetDate}-${item.reason}`}
            className="rounded-lg border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{item.employeeName}</span>
              <Badge variant="outline" className={cn(statusClasses.exception, "border")}>
                异常
              </Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {item.targetDate} / 来源 {item.sourceDate}
            </div>
            <div className="mt-2 text-sm">{item.reasonLabel}</div>
            <div className="mt-1 text-xs text-muted-foreground">{item.suggestion}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function FilteredAnnotationCard({ model }: { model: RosterDraftViewModel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>已过滤标注</CardTitle>
        <CardDescription>只读，非班务标注已过滤，不进入班种复制。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {model.filteredAnnotations.map((item) => (
          <div
            key={`${item.employeeId}-${item.sourceDate}-${item.annotationCode}`}
            className="rounded-lg border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{item.employeeName}</span>
              <Badge
                variant="outline"
                className={cn(statusClasses.filtered_annotation, "border")}
              >
                非班务标注已过滤
              </Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {item.sourceDate} 到 {item.targetDate}
            </div>
            <div className="mt-2 text-sm">{item.annotationCode}</div>
            <div className="mt-1 text-xs text-muted-foreground">{item.reason}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
