"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
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
  getDashboardPaginationRange,
} from "@/components/data-table-model"
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

type MainTableShellToolbarContext = {
  pageSizeSelect: React.ReactNode
  resetPageIndex: () => void
}

type MainTableShellProps<TData> = {
  title: string
  description?: React.ReactNode
  columns: ColumnDef<TData>[]
  data: TData[]
  columnLabels: Record<string, string>
  emptyMessage: string
  initialSorting?: SortingState
  initialPageSize?: number
  pageSizeOptions?: number[]
  renderToolbar?: (context: MainTableShellToolbarContext) => React.ReactNode
  summary?: React.ReactNode
}

export function MainTableShell<TData>({
  title,
  description,
  columns,
  data,
  columnLabels,
  emptyMessage,
  initialSorting = [],
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 20],
  renderToolbar,
  summary,
}: MainTableShellProps<TData>) {
  "use no memo"

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })
  // TanStack Table exposes an imperative table service that React Compiler cannot memoize.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
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
    rowCount: data.length,
  })
  const resetPageIndex = React.useCallback(() => {
    table.setPageIndex(0)
  }, [table])

  React.useEffect(() => {
    const clampedPageIndex = clampDashboardPageIndex({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      rowCount: data.length,
    })

    if (clampedPageIndex !== pagination.pageIndex) {
      setPagination((current) => ({
        ...current,
        pageIndex: clampedPageIndex,
      }))
    }
  }, [data.length, pagination.pageIndex, pagination.pageSize])

  const pageSizeSelect = (
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
        {pageSizeOptions.map((pageSize) => (
          <SelectItem key={pageSize} value={`${pageSize}`}>
            {pageSize} 条/页
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <Card data-slot="main-table-shell">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabels[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {renderToolbar ? (
          <div
            data-slot="main-table-shell-toolbar"
            className="mb-3 flex flex-wrap items-center gap-2"
          >
            {renderToolbar({ pageSizeSelect, resetPageIndex })}
          </div>
        ) : null}
        {summary ? (
          <div
            data-slot="main-table-shell-summary"
            className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
          >
            {summary}
          </div>
        ) : null}
        <div data-slot="main-table-shell-table" className="overflow-x-auto">
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
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div
          data-slot="main-table-shell-pagination"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"
        >
          <div>
            共 {data.length} 条，显示 {paginationRange.from}-{paginationRange.to}
            ，当前第 {pagination.pageIndex + 1} / {pageCount} 页
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
      </CardContent>
    </Card>
  )
}
