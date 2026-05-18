"use client"

import * as React from "react"
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

import {
  clampDashboardPageIndex,
  filterSchedulePlanRows,
  getDashboardPaginationRange,
  summarizeSchedulePlanRows,
} from "@/components/data-table-model"
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
  buildPlanDetailHref,
  buildScheduleRisksHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"

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

const columnLabels: Record<string, string> = {
  plan_date: "日期",
  project_name: "项目",
  site_name: "职场",
  status: "状态",
  gap_agents: "缺口",
  coverage_rate: "覆盖率",
  version: "版本",
  forecast_agents: "预测",
  scheduled_agents: "已排",
}

function createColumns({
  query,
  status,
}: {
  query?: string
  status?: SchedulePlanStatus
}): ColumnDef<SchedulePlanSummary>[] {
  return [
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
    enableHiding: false,
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link
            href={buildPlanDetailHref(row.original.id, {
              from: "schedule-plans",
              query,
              status,
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
            })}
          >
            查看
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={buildScheduleRisksHref({
              from: "schedule-plans-list",
              query,
              status,
              planId: row.original.id,
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
            })}
          >
            风险
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={buildShiftDetailsHref({
              from: "schedule-plans-list",
              query,
              status,
              planId: row.original.id,
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
            })}
          >
            班次
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={buildUnavailabilityHref({
              from: "schedule-plans-list",
              query,
              status,
              planId: row.original.id,
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
            })}
          >
            不可用
          </Link>
        </Button>
      </div>
    ),
    },
  ]
}

export function SchedulePlanTable({
  plans,
  filterLabel,
  query,
  status,
}: {
  plans: SchedulePlanSummary[]
  filterLabel?: string
  query?: string
  status?: SchedulePlanStatus
}) {
  "use no memo"

  const columns = React.useMemo(
    () => createColumns({ query, status }),
    [query, status]
  )
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "plan_date", desc: false },
  ])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] =
    React.useState<SchedulePlanStatus | "all">("all")
  const [gapFilter, setGapFilter] =
    React.useState<"all" | "with_gap" | "covered">("all")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const filteredPlans = React.useMemo(
    () =>
      filterSchedulePlanRows(plans, {
        query: globalFilter,
        status: statusFilter,
        gap: gapFilter,
      }),
    [gapFilter, globalFilter, plans, statusFilter]
  )
  const summary = summarizeSchedulePlanRows(filteredPlans)
  // TanStack Table exposes an imperative table API that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredPlans,
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
    rowCount: filteredPlans.length,
  })
  const hasActiveFilters =
    globalFilter.trim() !== "" || statusFilter !== "all" || gapFilter !== "all"

  React.useEffect(() => {
    const clampedPageIndex = clampDashboardPageIndex({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      rowCount: filteredPlans.length,
    })

    if (clampedPageIndex !== pagination.pageIndex) {
      setPagination((current) => ({
        ...current,
        pageIndex: clampedPageIndex,
      }))
    }
  }, [filteredPlans.length, pagination.pageIndex, pagination.pageSize])

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>排班计划</CardTitle>
          <CardDescription>
            筛选计划摘要与缺口风险
            {filterLabel ? ` / 当前筛选：${filterLabel}` : ""}
          </CardDescription>
        </div>
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
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border px-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value)
                table.setPageIndex(0)
              }}
              placeholder="搜索计划、项目、职场或版本"
              className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as SchedulePlanStatus | "all")
              table.setPageIndex(0)
            }}
          >
            <SelectTrigger
              aria-label="计划状态筛选"
              size="sm"
              className="w-28"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="review_ready">待复核</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={gapFilter}
            onValueChange={(value) => {
              setGapFilter(value as "all" | "with_gap" | "covered")
              table.setPageIndex(0)
            }}
          >
            <SelectTrigger
              aria-label="缺口筛选"
              size="sm"
              className="w-28"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部缺口</SelectItem>
              <SelectItem value="with_gap">有缺口</SelectItem>
              <SelectItem value="covered">已覆盖</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
              table.setPageIndex(0)
            }}
          >
            <SelectTrigger
              aria-label={`${pagination.pageSize} 条/页`}
              size="sm"
              className="w-28"
            >
              <SelectValue />
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
              setGapFilter("all")
              table.setPageIndex(0)
            }}
          >
            <RotateCcw className="size-4" />
            重置
          </Button>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">筛选后 {summary.total} 条</Badge>
          <span>草稿 {summary.draft}</span>
          <span>待复核 {summary.reviewReady}</span>
          <span>已发布 {summary.published}</span>
          <span>缺口 {summary.totalGap}</span>
          <span>覆盖率 {formatCoverageRate(summary.coverageRate)}</span>
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
                    暂无符合条件的排班计划
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>
            共 {filteredPlans.length} 条，显示 {paginationRange.from}-
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
      </CardContent>
    </Card>
  )
}
