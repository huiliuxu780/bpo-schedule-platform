"use client"

import * as React from "react"
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
}: {
  plans: SchedulePlanSummary[]
  filterLabel?: string
}) {
  "use no memo"

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "plan_date", desc: false },
  ])
  // TanStack Table exposes an imperative table API that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: plans,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

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
            {plans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
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
