"use client"

import * as React from "react"
import Link from "next/link"
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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  ExternalLink,
  RotateCcw,
  Search,
} from "lucide-react"

import { anomalies as fallbackAnomalies, type Anomaly } from "@/app/dashboard/data"
import {
  buildDashboardAnomalyEntryState,
  clampDashboardPageIndex,
  filterDashboardAnomalies,
  getDashboardPaginationRange,
  sortDashboardAnomaliesForReview,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const columnLabels: Record<string, string> = {
  id: "异常编号",
  type: "异常类型",
  team: "团队",
  headcount: "人数",
  impactedHours: "影响工时",
  severity: "严重度",
  status: "状态",
  project: "项目",
  shiftTime: "班次时间",
}

const severityRank: Record<Anomaly["severity"], number> = {
  高: 0,
  中: 1,
  低: 2,
}

const statusRank: Record<Anomaly["status"], number> = {
  待复核: 0,
  已确认: 1,
  已忽略: 2,
}

const columnWidthClass: Record<string, string> = {
  id: "w-[104px]",
  type: "w-[120px]",
  team: "w-[140px]",
  headcount: "w-[72px]",
  impactedHours: "w-[96px]",
  severity: "w-[88px]",
  status: "w-[96px]",
  project: "w-[120px]",
  shiftTime: "w-[168px]",
  actions: "w-[152px]",
}

function severityVariant(severity: Anomaly["severity"]) {
  if (severity === "高") {
    return "destructive" as const
  }

  if (severity === "中") {
    return "secondary" as const
  }

  return "outline" as const
}

function statusVariant(status: Anomaly["status"]) {
  if (status === "待复核") {
    return "secondary" as const
  }

  if (status === "已忽略") {
    return "outline" as const
  }

  return "default" as const
}

const columns: ColumnDef<Anomaly>[] = [
  {
    accessorKey: "id",
    enableHiding: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        异常编号
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        异常类型
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="min-w-36 font-medium">{row.original.type}</span>
    ),
  },
  {
    accessorKey: "team",
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
    accessorKey: "headcount",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          人数
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.headcount}</div>
    ),
  },
  {
    accessorKey: "impactedHours",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          影响工时
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      </div>
    ),
    sortingFn: (left, right) =>
      Number.parseFloat(left.original.impactedHours) -
      Number.parseFloat(right.original.impactedHours),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.impactedHours}
      </div>
    ),
  },
  {
    accessorKey: "severity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        严重度
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    sortingFn: (left, right) =>
      severityRank[left.original.severity] -
      severityRank[right.original.severity],
    cell: ({ row }) => (
      <Badge variant={severityVariant(row.original.severity)}>
        {row.original.severity}
      </Badge>
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
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "project",
    header: "项目",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.project}</span>
    ),
  },
  {
    accessorKey: "shiftTime",
    header: "班次时间",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.shiftTime}</span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => {
      const entryState = buildDashboardAnomalyEntryState(row.original)

      if (entryState.kind === "link") {
        return (
          <div className="text-right">
            <Button asChild variant="ghost" size="sm">
              <Link href={entryState.href}>
                {entryState.label}
                <ExternalLink data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        )
      }

      return (
        <div className="text-right">
          <Button
            variant="ghost"
            size="sm"
            disabled
            title={entryState.detail}
          >
            {entryState.label}
          </Button>
        </div>
      )
    },
  },
]

type DataTableProps = {
  anomalies?: Anomaly[]
}

type DashboardTableView = "issues" | "high" | "pending" | "drillable"

export function DataTable({ anomalies }: DataTableProps = {}) {
  "use no memo"

  const sourceAnomalies = anomalies ?? fallbackAnomalies

  const [tableView, setTableView] = React.useState<DashboardTableView>("issues")
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [severityFilter, setSeverityFilter] =
    React.useState<Anomaly["severity"] | "all">("all")
  const [statusFilter, setStatusFilter] =
    React.useState<Anomaly["status"] | "all">("all")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const sortedSourceAnomalies = React.useMemo(
    () => sortDashboardAnomaliesForReview(sourceAnomalies),
    [sourceAnomalies]
  )
  const filteredData = React.useMemo(
    () =>
      filterDashboardAnomalies(sortedSourceAnomalies, {
        query: globalFilter,
        severity: severityFilter,
        status: statusFilter,
      }),
    [sortedSourceAnomalies, globalFilter, severityFilter, statusFilter]
  )

  const summary = React.useMemo(() => {
    const highCount = filteredData.filter((row) => row.severity === "高").length
    const pendingReviewCount = filteredData.filter(
      (row) => row.status === "待复核"
    ).length
    const drillableCount = filteredData.filter(
      (row) => row.downstreamEntry != null
    ).length
    return {
      total: filteredData.length,
      high: highCount,
      pendingReview: pendingReviewCount,
      drillable: drillableCount,
    }
  }, [filteredData])
  const visibleData = React.useMemo(() => {
    if (tableView === "high") {
      return filteredData.filter((row) => row.severity === "高")
    }

    if (tableView === "pending") {
      return filteredData.filter((row) => row.status === "待复核")
    }

    if (tableView === "drillable") {
      return filteredData.filter((row) => row.downstreamEntry != null)
    }

    return filteredData
  }, [filteredData, tableView])

  // TanStack Table exposes an imperative table service that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: visibleData,
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

  const filteredRowCount = visibleData.length
  const pageCount = Math.max(1, table.getPageCount())
  const currentPage = pagination.pageIndex + 1
  const paginationRange = getDashboardPaginationRange({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    rowCount: filteredRowCount,
  })
  const hasActiveFilters =
    globalFilter.trim() !== "" ||
    severityFilter !== "all" ||
    statusFilter !== "all"

  React.useEffect(() => {
    const clampedPageIndex = clampDashboardPageIndex({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      rowCount: filteredRowCount,
    })

    if (clampedPageIndex !== pagination.pageIndex) {
      setPagination((current) => ({
        ...current,
        pageIndex: clampedPageIndex,
      }))
    }
  }, [filteredRowCount, pagination.pageIndex, pagination.pageSize])

  return (
    <Tabs
      value={tableView}
      onValueChange={(value) => {
        setTableView(value as DashboardTableView)
        table.setPageIndex(0)
      }}
      className="w-full flex-col justify-start gap-4"
    >
      <div className="flex flex-col gap-3 px-4 lg:px-6">
        <div className="flex flex-col gap-3 @4xl/main:flex-row @4xl/main:items-center @4xl/main:justify-between">
          <div className="grid gap-1">
            <h2 className="text-base font-semibold">BPO 异常明细</h2>
            <p className="text-sm text-muted-foreground">
              支持搜索、排序、列显示、分页；仅在下游 ID 稳定时开放跳转
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
              <TabsTrigger value="issues">异常明细</TabsTrigger>
              <TabsTrigger value="high">
                高严重度 <Badge variant="secondary">{summary.high}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                待复核 <Badge variant="secondary">{summary.pendingReview}</Badge>
              </TabsTrigger>
              <TabsTrigger value="drillable">
                可下钻 <Badge variant="secondary">{summary.drillable}</Badge>
              </TabsTrigger>
            </TabsList>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3 data-icon="inline-start" />
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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnLabels[column.id] ?? column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-2 @3xl/main:flex-row @3xl/main:items-center">
          <div className="flex max-w-sm flex-1 items-center gap-2 rounded-md border px-2">
            <Search className="text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value)
                table.setPageIndex(0)
              }}
              placeholder="搜索异常编号、类型、团队或状态"
              className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select
            value={severityFilter}
            onValueChange={(value) => {
              setSeverityFilter(value as Anomaly["severity"] | "all")
              table.setPageIndex(0)
            }}
          >
            <SelectTrigger size="sm" className="w-24">
              <SelectValue aria-label="严重度筛选" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部严重度</SelectItem>
              <SelectItem value="高">高</SelectItem>
              <SelectItem value="中">中</SelectItem>
              <SelectItem value="低">低</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as Anomaly["status"] | "all")
              table.setPageIndex(0)
            }}
          >
            <SelectTrigger size="sm" className="w-24">
              <SelectValue aria-label="状态筛选" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="待复核">待复核</SelectItem>
              <SelectItem value="已确认">已确认</SelectItem>
              <SelectItem value="已忽略">已忽略</SelectItem>
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
              setSeverityFilter("all")
              setStatusFilter("all")
              table.setPageIndex(0)
            }}
          >
            <RotateCcw data-icon="inline-start" />
            重置
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">筛选后 {summary.total} 条</Badge>
          <Badge variant="destructive" className="text-xs">
            高严重度 {summary.high}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            待复核 {summary.pendingReview}
          </Badge>
          <Badge variant="default" className="text-xs">
            可下钻 {summary.drillable}
          </Badge>
          <span>
            严重度：{severityFilter === "all" ? "全部" : severityFilter}
          </span>
          <span>状态：{statusFilter === "all" ? "全部" : statusFilter}</span>
        </div>
      </div>
      <TabsContent
        value={tableView}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <Table className="min-w-[1156px] table-fixed">
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={columnWidthClass[header.column.id]}
                    >
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
                    <TableCell
                      key={cell.id}
                      className={columnWidthClass[cell.column.id]}
                    >
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
                    {sourceAnomalies.length === 0 && !hasActiveFilters
                      ? "暂无异常记录"
                      : "暂无符合条件的异常记录"}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-3 px-1 text-sm text-muted-foreground @3xl/main:flex-row @3xl/main:items-center @3xl/main:justify-between">
          <div className="flex-1">
            共 {filteredRowCount} 条，显示 {paginationRange.from}-
            {paginationRange.to}，当前第 {currentPage} / {pageCount} 页
          </div>
          <div className="flex items-center gap-2 @3xl/main:ml-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
            >
              <ChevronsLeft data-icon="inline-start" />
              首页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft data-icon="inline-start" />
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              下一页
              <ChevronRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(pageCount - 1)}
            >
              末页
              <ChevronsRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
