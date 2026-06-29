"use client"

import Link from "next/link"
import { ArrowUpDown } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import { MainTableShell } from "@/components/main-table-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  formatCoverageRate,
  schedulePlanStatusLabel,
  type SchedulePlanStatus,
  type ShiftDetailRow,
} from "@/lib/schedule-plans"

const statusRank: Record<SchedulePlanStatus, number> = {
  draft: 0,
  review_ready: 1,
  published: 2,
}

const columnLabels: Record<string, string> = {
  plan_date: "日期",
  interval: "时段",
  project_name: "项目",
  site_name: "职场",
  status: "状态",
  forecast_agents: "预测",
  scheduled_agents: "已排",
  gap_agents: "缺口",
  coverage_rate: "覆盖率",
  note: "备注",
}

const columns: ColumnDef<ShiftDetailRow>[] = [
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
    id: "interval",
    accessorFn: (row) => `${row.interval_start}-${row.interval_end}`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        时段
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.interval_start}-{row.original.interval_end}
      </span>
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
      <Badge variant="outline">
        {schedulePlanStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "forecast_agents",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          预测
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.forecast_agents}
      </div>
    ),
  },
  {
    accessorKey: "scheduled_agents",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          已排
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.scheduled_agents}
      </div>
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
    accessorKey: "note",
    header: "备注",
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/schedule-plans/${row.original.plan_id}`}>计划</Link>
        </Button>
      </div>
    ),
  },
]

export function ShiftDetailsTable({
  emptyMessage = "暂无符合条件的班次明细",
  rows,
  description,
}: {
  emptyMessage?: string
  rows: ShiftDetailRow[]
  description?: string
}) {
  return (
    <MainTableShell
      title="班次明细"
      description={description}
      columns={columns}
      data={rows}
      columnLabels={columnLabels}
      emptyMessage={emptyMessage}
      initialSorting={[{ id: "plan_date", desc: false }]}
    />
  )
}
