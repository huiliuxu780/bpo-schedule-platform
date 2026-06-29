"use client"

import { ArrowUpDown } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import { MainTableShell } from "@/components/main-table-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type DemandPlanRow } from "@/lib/schedule-plans"

const statusRank: Record<DemandPlanRow["status"], number> = {
  mapped: 0,
  imported: 1,
}

const columnLabels: Record<string, string> = {
  plan_date: "日期",
  interval: "时段",
  project_name: "项目",
  site_name: "职场",
  forecast_agents: "预测人数",
  source: "来源",
  status: "状态",
}

const columns: ColumnDef<DemandPlanRow>[] = [
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
    accessorKey: "forecast_agents",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          预测人数
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
    accessorKey: "source",
    header: "来源",
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
        {row.original.status === "mapped" ? "已映射" : "已导入"}
      </Badge>
    ),
  },
]

export function DemandPlanTable({
  description,
  rows,
}: {
  description?: string
  rows: DemandPlanRow[]
}) {
  return (
    <MainTableShell
      title="预测需求"
      description={description}
      columns={columns}
      data={rows}
      columnLabels={columnLabels}
      emptyMessage="暂无符合条件的预测需求"
      initialSorting={[{ id: "plan_date", desc: false }]}
    />
  )
}
