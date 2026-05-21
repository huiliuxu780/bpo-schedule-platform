"use client"

import * as React from "react"
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
  RotateCcw,
  Search,
} from "lucide-react"

import { anomalies, type Anomaly } from "@/app/dashboard/data"
import {
  clampDashboardPageIndex,
  filterDashboardAnomalies,
  getDashboardPaginationRange,
} from "@/components/data-table-model"
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
  },
  {
    accessorKey: "shiftTime",
    header: "班次时间",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.shiftTime}</span>
    ),
  },
]

export function DataTable() {
  "use no memo"

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [severityFilter, setSeverityFilter] =
    React.useState<Anomaly["severity"] | "all">("all")
  const [statusFilter, setStatusFilter] =
    React.useState<Anomaly["status"] | "all">("all")
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "id", desc: false },
  ])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const filteredData = React.useMemo(
    () =>
      filterDashboardAnomalies(anomalies, {
        query: globalFilter,
        severity: severityFilter,
        status: statusFilter,
      }),
    [globalFilter, severityFilter, statusFilter]
  )

  // TanStack Table exposes an imperative table API that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
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

  const filteredRowCount = filteredData.length
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
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>BPO 异常明细</CardTitle>
          <CardDescription>
            支持搜索、排序、列显示和分页查看
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
        <div className="mb-3 flex items-center gap-2">
          <div className="flex max-w-sm flex-1 items-center gap-2 rounded-md border px-2">
            <Search className="size-4 text-muted-foreground" />
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
            <RotateCcw className="size-4" />
            重置
          </Button>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">筛选后 {filteredRowCount} 条</Badge>
          <span>
            严重度：{severityFilter === "all" ? "全部" : severityFilter}
          </span>
          <span>状态：{statusFilter === "all" ? "全部" : statusFilter}</span>
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
                    暂无符合条件的异常记录
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            共 {filteredRowCount} 条，显示 {paginationRange.from}-
            {paginationRange.to}，当前第 {currentPage} / {pageCount} 页
          </div>
          <div className="flex items-center gap-2">
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
