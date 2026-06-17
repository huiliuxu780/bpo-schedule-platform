"use client"

import { ArrowUpDown } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import { SimpleTable } from "@/components/simple-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  unavailabilityStatusLabel,
  type UnavailabilityRow,
  type UnavailabilityStatus,
} from "@/lib/unavailability"

const statusRank: Record<UnavailabilityStatus, number> = {
  active: 0,
  resolved: 1,
}

const columns: ColumnDef<UnavailabilityRow>[] = [
  {
    accessorKey: "staff_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        人员
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.staff_name}</span>,
  },
  {
    accessorKey: "team_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        团队
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
  },
  {
    id: "time",
    accessorFn: (row) => `${row.start_time}-${row.end_time}`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        时间
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.start_time}-{row.original.end_time}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "原因",
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
      <Badge variant={row.original.status === "active" ? "default" : "outline"}>
        {unavailabilityStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "affected_intervals",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          影响时段
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.affected_intervals}
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "备注",
  },
]

export function ScheduleRiskUnavailabilityTable({
  rows,
}: {
  rows: UnavailabilityRow[]
}) {
  return (
    <SimpleTable
      columns={columns}
      data={rows}
      emptyMessage="当前风险时段暂无重叠的生效中不可用记录"
      defaultSorting={[{ id: "staff_name", desc: false }]}
    />
  )
}
