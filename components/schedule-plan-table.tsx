"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpDown, RotateCcw, Search } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import {
  filterSchedulePlanRows,
  summarizeSchedulePlanRows,
} from "@/components/data-table-model"
import { MainTableShell } from "@/components/main-table-shell"
import {
  formatCoverageRate,
  schedulePlanStatusLabel,
  type SchedulePlanStatus,
  type SchedulePlanSummary,
} from "@/lib/schedule-plans"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function statusVariant(status: SchedulePlanStatus) {
  if (status === "published") {
    return "default" as const
  }

  if (status === "review_ready") {
    return "secondary" as const
  }

  return "outline" as const
}

const statusRank: Record<SchedulePlanStatus, number> = {
  draft: 0,
  review_ready: 1,
  published: 2,
}

const columnLabels: Record<string, string> = {
  plan_date: "日期",
  project_name: "项目",
  site_name: "职场",
  status: "状态",
  gap_agents: "缺口",
  coverage_rate: "覆盖率",
  version: "版本",
  forecast_agents: "预测",
  scheduled_agents: "已排",
}

const columns: ColumnDef<SchedulePlanSummary>[] = [
  {
    accessorKey: "plan_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        日期
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.plan_date}</span>
    ),
  },
  {
    accessorKey: "project_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        项目
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.project_name}</span>
    ),
  },
  {
    accessorKey: "site_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        职场
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        状态
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    sortingFn: (left, right) =>
      statusRank[left.original.status] - statusRank[right.original.status],
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>
        {schedulePlanStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "gap_agents",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          缺口
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.gap_agents}</div>
    ),
  },
  {
    accessorKey: "coverage_rate",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          覆盖率
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatCoverageRate(row.original.coverage_rate)}
      </div>
    ),
  },
  {
    accessorKey: "version",
    header: "版本",
  },
  {
    accessorKey: "forecast_agents",
    header: () => <div className="text-right">预测</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.forecast_agents}
      </div>
    ),
  },
  {
    accessorKey: "scheduled_agents",
    header: () => <div className="text-right">已排</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.scheduled_agents}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/schedule-plans/${row.original.id}`}>查看</Link>
        </Button>
      </div>
    ),
  },
]

export function SchedulePlanTable({
  plans,
  filterLabel,
  sourceTotal,
}: {
  plans: SchedulePlanSummary[]
  filterLabel?: string
  sourceTotal?: number
}) {
  "use no memo"

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] =
    React.useState<SchedulePlanStatus | "all">("all")
  const [gapFilter, setGapFilter] =
    React.useState<"all" | "with_gap" | "covered">("all")
  const filteredPlans = React.useMemo(
    () =>
      filterSchedulePlanRows(plans, {
        query: globalFilter,
        status: statusFilter,
        gap: gapFilter,
      }),
    [gapFilter, globalFilter, plans, statusFilter]
  )
  const summary = summarizeSchedulePlanRows(filteredPlans)
  const hasActiveFilters =
    globalFilter.trim() !== "" || statusFilter !== "all" || gapFilter !== "all"

  const sourceIsEmpty = sourceTotal === 0
  const emptyMessage = sourceIsEmpty
    ? "暂无排班计划数据"
    : "暂无符合条件的排班计划"

  return (
    <MainTableShell
      title="排班计划"
      description={`筛选计划摘要与缺口风险${
        filterLabel ? ` / 当前筛选：${filterLabel}` : ""
      }`}
      columns={columns}
      data={filteredPlans}
      columnLabels={columnLabels}
      emptyMessage={emptyMessage}
      initialSorting={[{ id: "plan_date", desc: false }]}
      summary={
        <>
          <Badge variant="outline">筛选后 {summary.total} 条</Badge>
          <span>草稿 {summary.draft}</span>
          <span>待复核 {summary.reviewReady}</span>
          <span>已发布 {summary.published}</span>
          <span>缺口 {summary.totalGap}</span>
          <span>覆盖率 {formatCoverageRate(summary.coverageRate)}</span>
        </>
      }
      renderToolbar={({ pageSizeSelect, resetPageIndex }) => (
        <>
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border px-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value)
                resetPageIndex()
              }}
              placeholder="搜索计划、项目、职场或版本"
              className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as SchedulePlanStatus | "all")
              resetPageIndex()
            }}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue aria-label="计划状态筛选" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="review_ready">待复核</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={gapFilter}
            onValueChange={(value) => {
              setGapFilter(value as "all" | "with_gap" | "covered")
              resetPageIndex()
            }}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue aria-label="缺口筛选" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部缺口</SelectItem>
              <SelectItem value="with_gap">有缺口</SelectItem>
              <SelectItem value="covered">已覆盖</SelectItem>
            </SelectContent>
          </Select>
          {pageSizeSelect}
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasActiveFilters}
            onClick={() => {
              setGlobalFilter("")
              setStatusFilter("all")
              setGapFilter("all")
              resetPageIndex()
            }}
          >
            <RotateCcw data-icon="inline-start" />
            重置
          </Button>
        </>
      )}
    />
  )
}
