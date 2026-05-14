"use client"

import Link from "next/link"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import {
  clampDashboardPageIndex,
  filterScheduleRiskRows,
  getDashboardPaginationRange,
  summarizeScheduleRiskRows,
} from "@/components/data-table-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  type ScheduleRiskLevel,
  scheduleRiskLevelLabel,
  type ScheduleRiskRow,
} from "@/lib/schedule-plans"
import {
  buildPlanDetailHref,
  buildScheduleRiskDetailHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"

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
      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link
            href={buildScheduleRiskDetailHref(row.original.risk_id, {
              from: "schedule-risks",
              planId: row.original.plan_id,
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
              intervalStart: row.original.interval_start,
              intervalEnd: row.original.interval_end,
            })}
          >
            明细
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={buildShiftDetailsHref({
              from: "schedule-risks",
              planId: row.original.plan_id,
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
              intervalStart: row.original.interval_start,
              intervalEnd: row.original.interval_end,
            })}
          >
            班次
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={buildPlanDetailHref(row.original.plan_id, {
              from: "schedule-risks",
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
              intervalStart: row.original.interval_start,
              intervalEnd: row.original.interval_end,
            })}
          >
            计划
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={buildUnavailabilityHref({
              from: "schedule-risks",
              project: row.original.project_name,
              site: row.original.site_name,
              date: row.original.plan_date,
              startTime: row.original.interval_start,
              endTime: row.original.interval_end,
              status: "active",
            })}
          >
            不可用
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
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [levelFilter, setLevelFilter] =
    React.useState<ScheduleRiskLevel | "all">("all")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const filteredRisks = React.useMemo(
    () =>
      filterScheduleRiskRows(risks, {
        query: globalFilter,
        level: levelFilter,
      }),
    [globalFilter, levelFilter, risks]
  )
  const summary = summarizeScheduleRiskRows(filteredRisks)
  // TanStack Table exposes an imperative table API that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredRisks,
    columns,
    state: {
      pagination,
      sorting,
    },
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
    rowCount: filteredRisks.length,
  })
  const hasActiveFilters = globalFilter.trim() !== "" || levelFilter !== "all"

  React.useEffect(() => {
    const clampedPageIndex = clampDashboardPageIndex({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      rowCount: filteredRisks.length,
    })

    if (clampedPageIndex !== pagination.pageIndex) {
      setPagination((current) => ({
        ...current,
        pageIndex: clampedPageIndex,
      }))
    }
  }, [filteredRisks.length, pagination.pageIndex, pagination.pageSize])

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
            placeholder="搜索风险、项目、职场或建议"
            className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Select
          value={levelFilter}
          onValueChange={(value) => {
            setLevelFilter(value as ScheduleRiskLevel | "all")
            table.setPageIndex(0)
          }}
        >
          <SelectTrigger size="sm" className="w-28">
            <SelectValue aria-label="风险等级筛选" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">全部风险</SelectItem>
            <SelectItem value="high">高风险</SelectItem>
            <SelectItem value="medium">需关注</SelectItem>
            <SelectItem value="low">提醒</SelectItem>
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
            setLevelFilter("all")
            table.setPageIndex(0)
          }}
        >
          <RotateCcw className="size-4" />
          重置
        </Button>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">筛选后 {summary.total} 条</Badge>
        <span>高风险 {summary.high}</span>
        <span>需关注 {summary.medium}</span>
        <span>提醒 {summary.low}</span>
        <span>缺口 {summary.totalGap}</span>
        <span>不可用影响 {summary.affectedUnavailability}</span>
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
              colSpan={columns.length}
              className="h-20 text-center text-sm text-muted-foreground"
            >
              当前筛选下暂无排班风险提示
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <div>
          共 {filteredRisks.length} 条，显示 {paginationRange.from}-
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
