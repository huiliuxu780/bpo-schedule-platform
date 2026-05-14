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
  buildShiftDetailsHref,
  buildUnavailabilityDetailHref,
} from "@/lib/review-navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  unavailabilityStatusLabel,
  type UnavailabilityRow,
  type UnavailabilityStatus,
} from "@/lib/unavailability"

const statusRank: Record<UnavailabilityStatus, number> = {
  active: 0,
  resolved: 1,
}

function getColumns(scope: { sourceFrom?: string }): ColumnDef<UnavailabilityRow>[] {
  return [
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
    {
      id: "actions",
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" size="sm">
            <Link
              href={buildUnavailabilityDetailHref(row.original.unavailability_id, {
                from: scope.sourceFrom || "schedule-risks",
                status: row.original.status,
                project: row.original.project_name,
                site: row.original.site_name,
                date: row.original.unavailable_date,
                startTime: row.original.start_time,
                endTime: row.original.end_time,
              })}
            >
              影响
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link
              href={buildShiftDetailsHref({
                from: scope.sourceFrom || "schedule-risks",
                project: row.original.project_name,
                site: row.original.site_name,
                date: row.original.unavailable_date,
                intervalStart: row.original.start_time,
                intervalEnd: row.original.end_time,
              })}
            >
              班次
            </Link>
          </Button>
        </div>
      ),
    },
  ]
}

export function ScheduleRiskUnavailabilityTable({
  rows,
  sourceFrom,
}: {
  rows: UnavailabilityRow[]
  sourceFrom?: string
}) {
  "use no memo"

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "staff_name", desc: false },
  ])
  const columns = React.useMemo(
    () => getColumns({ sourceFrom }),
    [sourceFrom]
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
              className="h-20 text-center text-sm text-muted-foreground"
            >
              当前风险时段暂无重叠的生效中不可用记录
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
