"use client"

import Link from "next/link"
import { ArrowUpDown } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import { SimpleTable } from "@/components/simple-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  scheduleRiskLevelLabel,
  type ScheduleRiskRow,
} from "@/lib/schedule-plans"

const riskLevelRank: Record<ScheduleRiskRow["risk_level"], number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const columns: ColumnDef<ScheduleRiskRow>[] = [
  {
    accessorKey: "risk_level",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        风险
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    sortingFn: (left, right) =>
      riskLevelRank[left.original.risk_level] -
      riskLevelRank[right.original.risk_level],
    cell: ({ row }) => (
      <Badge
        variant={row.original.risk_level === "high" ? "default" : "outline"}
      >
        {scheduleRiskLevelLabel(row.original.risk_level)}
      </Badge>
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
    accessorKey: "affected_unavailability",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          不可用
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.affected_unavailability}
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "原因",
  },
  {
    accessorKey: "recommendation",
    header: "建议",
  },
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`/schedule-risks/${encodeURIComponent(row.original.risk_id)}`}>
            明细
          </Link>
        </Button>
      </div>
    ),
  },
]

export function UnavailabilityImpactRiskTable({
  rows,
}: {
  rows: ScheduleRiskRow[]
}) {
  return (
    <SimpleTable
      columns={columns}
      data={rows}
      emptyMessage="当前不可用时段暂无关联风险提示"
      defaultSorting={[{ id: "risk_level", desc: false }]}
    />
  )
}
