"use client"

import Link from "next/link"
import { ArrowUpDown } from "lucide-react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
    header: "时段",
    accessorFn: (row) => `${row.interval_start}-${row.interval_end}`,
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.interval_start}-{row.original.interval_end}
      </span>
    ),
  },
  {
    accessorKey: "project_name",
    header: "项目",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.project_name}</span>
    ),
  },
  {
    accessorKey: "site_name",
    header: "职场",
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
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link
            href={`/schedule-risks/${encodeURIComponent(row.original.risk_id)}`}
          >
            明细
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/shift-details?query=${row.original.site_name}`}>
            班次
          </Link>
        </Button>
      </div>
    ),
  },
]

export function ScheduleRiskTable({ risks }: { risks: ScheduleRiskRow[] }) {
  "use no memo"

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "risk_level", desc: false },
  ])
  // TanStack Table exposes an imperative table API that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: risks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {risks.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-20 text-center text-sm text-muted-foreground"
            >
              当前筛选下暂无排班风险提示
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
