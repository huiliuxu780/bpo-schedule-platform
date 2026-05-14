"use client"

import Link from "next/link"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  RotateCcw,
  Search,
} from "lucide-react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import {
  clampDashboardPageIndex,
  filterUnavailabilityRows,
  getDashboardPaginationRange,
  summarizeUnavailabilityRows,
} from "@/components/data-table-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  buildShiftDetailsHref,
  buildUnavailabilityDetailHref,
} from "@/lib/review-navigation"

const statusRank: Record<UnavailabilityStatus, number> = {
  active: 0,
  resolved: 1,
}

const columnLabels: Record<string, string> = {
  unavailable_date: "日期",
  time: "时间",
  staff_name: "人员",
  team_name: "团队",
  project_name: "项目",
  site_name: "职场",
  reason: "原因",
  status: "状态",
  affected_intervals: "影响时段",
  note: "备注",
}

const columns: ColumnDef<UnavailabilityRow>[] = [
  {
    accessorKey: "unavailable_date",
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
      <span className="whitespace-nowrap">{row.original.unavailable_date}</span>
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
    cell: ({ row }) => (
      <span className="font-medium">{row.original.staff_name}</span>
    ),
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
    accessorKey: "project_name",
    header: "项目",
  },
  {
    accessorKey: "site_name",
    header: "职场",
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
    enableHiding: false,
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link
            href={buildUnavailabilityDetailHref(row.original.unavailability_id, {
              from: "unavailability",
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
              from: "unavailability",
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

export function UnavailabilityTable({ rows }: { rows: UnavailabilityRow[] }) {
  "use no memo"

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "unavailable_date", desc: false },
  ])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] =
    React.useState<UnavailabilityStatus | "all">("all")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const filteredRows = React.useMemo(
    () =>
      filterUnavailabilityRows(rows, {
        query: globalFilter,
        status: statusFilter,
      }),
    [globalFilter, rows, statusFilter]
  )
  const summary = summarizeUnavailabilityRows(filteredRows)
  // TanStack Table exposes an imperative table API that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      columnVisibility,
      pagination,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  const pageCount = Math.max(1, table.getPageCount())
  const paginationRange = getDashboardPaginationRange({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    rowCount: filteredRows.length,
  })
  const hasActiveFilters = globalFilter.trim() !== "" || statusFilter !== "all"

  React.useEffect(() => {
    const clampedPageIndex = clampDashboardPageIndex({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      rowCount: filteredRows.length,
    })

    if (clampedPageIndex !== pagination.pageIndex) {
      setPagination((current) => ({
        ...current,
        pageIndex: clampedPageIndex,
      }))
    }
  }, [filteredRows.length, pagination.pageIndex, pagination.pageSize])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border px-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value)
              table.setPageIndex(0)
            }}
            placeholder="搜索人员、团队、职场或原因"
            className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as UnavailabilityStatus | "all")
            table.setPageIndex(0)
          }}
        >
          <SelectTrigger size="sm" className="w-28">
            <SelectValue aria-label="不可用状态筛选" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">生效中</SelectItem>
            <SelectItem value="resolved">已处理</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={`${pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
            table.setPageIndex(0)
          }}
        >
          <SelectTrigger size="sm" className="w-28">
            <SelectValue aria-label={`${pagination.pageSize} 条/页`} />
          </SelectTrigger>
          <SelectContent align="end">
            {[5, 10, 20].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize} 条/页
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasActiveFilters}
          onClick={() => {
            setGlobalFilter("")
            setStatusFilter("all")
            table.setPageIndex(0)
          }}
        >
          <RotateCcw className="size-4" />
          重置
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="size-4" />
              列控制
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>显示字段</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabels[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">筛选后 {summary.total} 条</Badge>
        <span>生效中 {summary.active}</span>
        <span>已处理 {summary.resolved}</span>
        <span>影响时段 {summary.affectedIntervals}</span>
        <span>团队 {summary.teamCount}</span>
        <span>职场 {summary.siteCount}</span>
      </div>
      <div className="overflow-x-auto">
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  暂无符合条件的不可用记录
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <div>
          共 {filteredRows.length} 条，显示 {paginationRange.from}-
          {paginationRange.to}，当前第 {pagination.pageIndex + 1} / {pageCount} 页
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <ChevronsLeft className="size-4" />
            首页
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="size-4" />
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            下一页
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
          >
            末页
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
