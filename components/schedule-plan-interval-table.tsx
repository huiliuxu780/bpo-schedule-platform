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

import { Button } from "@/components/ui/button"
import {
  buildScheduleRisksHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCoverageRate, type SchedulePlanInterval } from "@/lib/schedule-plans"

type IntervalTableRow = SchedulePlanInterval & {
  actions: {
    riskHref: string
    shiftHref: string
    unavailabilityHref: string
  }
}

const columns: ColumnDef<IntervalTableRow>[] = [
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
  {
    id: "actions",
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={row.original.actions.riskHref}>查看风险</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={row.original.actions.shiftHref}>查看班次</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={row.original.actions.unavailabilityHref}>查看不可用</Link>
        </Button>
      </div>
    ),
  },
]

export function SchedulePlanIntervalTable({
  intervals,
  planId,
  planDate,
  projectName,
  siteName,
}: {
  intervals: SchedulePlanInterval[]
  planId: string
  planDate: string
  projectName: string
  siteName: string
}) {
  "use no memo"

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "interval_start", desc: false },
  ])
  const rows = React.useMemo(
    () =>
      intervals.map((interval) => ({
        ...interval,
        actions: {
          riskHref: buildScheduleRisksHref({
            from: "schedule-plans",
            planId,
            date: planDate,
            project: projectName,
            site: siteName,
            intervalStart: interval.interval_start,
            intervalEnd: interval.interval_end,
          }),
          shiftHref: buildShiftDetailsHref({
            from: "schedule-plans",
            planId,
            date: planDate,
            project: projectName,
            site: siteName,
            intervalStart: interval.interval_start,
            intervalEnd: interval.interval_end,
          }),
          unavailabilityHref: buildUnavailabilityHref({
            from: "schedule-plans",
            project: projectName,
            site: siteName,
            date: planDate,
            intervalStart: interval.interval_start,
            intervalEnd: interval.interval_end,
            status: "active",
          }),
        },
      })),
    [intervals, planDate, planId, projectName, siteName]
  )
  // TanStack Table exposes an imperative table API that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
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
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-sm text-muted-foreground"
            >
              当前计划暂无时段明细
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
