"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle2, Clock3, TriangleAlert } from "lucide-react"

import { syncStatus } from "@/app/dashboard/data"
import {
  filterSyncStatusRows,
  summarizeSyncStatusRows,
  type DashboardSyncStatusRow,
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

function statusIcon(status: string) {
  if (status === "已同步") {
    return <CheckCircle2 className="size-4" />
  }

  if (status === "处理中") {
    return <Clock3 className="size-4" />
  }

  return <TriangleAlert className="size-4" />
}

function statusVariant(status: string) {
  if (status === "需关注") {
    return "destructive" as const
  }

  return "outline" as const
}

const statusRank: Record<string, number> = {
  需关注: 0,
  处理中: 1,
  已同步: 2,
}

const columns: ColumnDef<DashboardSyncStatusRow>[] = [
  {
    accessorKey: "source",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        数据源
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-32 font-medium">{row.original.source}</div>
    ),
  },
  {
    accessorKey: "batch",
    header: "最近批次",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.batch}</span>
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
      (statusRank[left.original.status] ?? 99) -
      (statusRank[right.original.status] ?? 99),
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)} className="gap-1">
        {statusIcon(row.original.status)}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "syncedAt",
    header: "更新时间",
  },
]

export function DataSyncStatus() {
  "use no memo"

  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "status", desc: false },
  ])
  const rows = React.useMemo(
    () => filterSyncStatusRows(syncStatus, statusFilter),
    [statusFilter]
  )
  const summary = summarizeSyncStatusRows(syncStatus)

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
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>数据接入状态</CardTitle>
          <CardDescription>核心数据源最近批次与同步状态</CardDescription>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-28">
            <SelectValue aria-label="同步状态筛选" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="已同步">已同步</SelectItem>
            <SelectItem value="处理中">处理中</SelectItem>
            <SelectItem value="需关注">需关注</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">全部 {summary.total}</Badge>
          <span>已同步 {summary.synced}</span>
          <span>处理中 {summary.processing}</span>
          <span>需关注 {summary.attention}</span>
        </div>
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
