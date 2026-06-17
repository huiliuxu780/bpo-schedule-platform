"use client"

import { ArrowUpDown } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import { SimpleTable } from "@/components/simple-table"
import { Button } from "@/components/ui/button"
import { formatCoverageRate, type SchedulePlanInterval } from "@/lib/schedule-plans"

const columns: ColumnDef<SchedulePlanInterval>[] = [
  {
    accessorKey: "interval_start",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        开始
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.interval_start}</span>
    ),
  },
  {
    accessorKey: "interval_end",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        结束
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.interval_end}</span>
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
]

export function SchedulePlanIntervalTable({
  intervals,
}: {
  intervals: SchedulePlanInterval[]
}) {
  return (
    <SimpleTable
      columns={columns}
      data={intervals}
      emptyMessage="当前计划暂无时段明细"
      defaultSorting={[{ id: "interval_start", desc: false }]}
    />
  )
}
