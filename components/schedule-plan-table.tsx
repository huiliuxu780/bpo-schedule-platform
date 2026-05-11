"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpDown } from "lucide-react"

import {
  formatCoverageRate,
  schedulePlanStatusLabel,
  type SchedulePlanStatus,
  type SchedulePlanSummary,
} from "@/lib/schedule-plans"
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

type SortKey = keyof Pick<
  SchedulePlanSummary,
  | "id"
  | "plan_date"
  | "project_name"
  | "site_name"
  | "status"
  | "gap_agents"
  | "coverage_rate"
>

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "plan_date", label: "日期" },
  { key: "project_name", label: "项目" },
  { key: "site_name", label: "职场" },
  { key: "status", label: "状态" },
  { key: "gap_agents", label: "缺口", className: "text-right" },
  { key: "coverage_rate", label: "覆盖率", className: "text-right" },
]

function statusVariant(status: SchedulePlanStatus) {
  if (status === "published") {
    return "default" as const
  }

  if (status === "review_ready") {
    return "secondary" as const
  }

  return "outline" as const
}

function compareValue(row: SchedulePlanSummary, key: SortKey) {
  return row[key]
}

export function SchedulePlanTable({
  plans,
  filterLabel,
}: {
  plans: SchedulePlanSummary[]
  filterLabel?: string
}) {
  const [sortKey, setSortKey] = React.useState<SortKey>("plan_date")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  )

  const sortedPlans = React.useMemo(() => {
    return [...plans].sort((a, b) => {
      const aValue = compareValue(a, sortKey)
      const bValue = compareValue(b, sortKey)

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }

      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }

      return 0
    })
  }, [plans, sortDirection, sortKey])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
      return
    }

    setSortKey(key)
    setSortDirection("asc")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>排班计划</CardTitle>
          <CardDescription>
            从 FastAPI 契约读取计划摘要与缺口风险
            {filterLabel ? ` / 当前筛选：${filterLabel}` : ""}
          </CardDescription>
        </div>
        <Badge variant="outline">B003 筛选</Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.label}
                    <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
              ))}
              <TableHead>版本</TableHead>
              <TableHead className="text-right">预测</TableHead>
              <TableHead className="text-right">已排</TableHead>
              <TableHead className="w-24 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="whitespace-nowrap">
                  {plan.plan_date}
                </TableCell>
                <TableCell className="font-medium">
                  {plan.project_name}
                </TableCell>
                <TableCell>{plan.site_name}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(plan.status)}>
                    {schedulePlanStatusLabel(plan.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {plan.gap_agents}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCoverageRate(plan.coverage_rate)}
                </TableCell>
                <TableCell>{plan.version}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {plan.forecast_agents}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {plan.scheduled_agents}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/schedule-plans/${plan.id}`}>查看</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedPlans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  暂无符合条件的排班计划
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
