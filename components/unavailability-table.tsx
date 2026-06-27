"use client"

import Link from "next/link"
import { ArrowUpDown, RotateCcw, Search } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"
import * as React from "react"

import {
  filterUnavailabilityRows,
  summarizeUnavailabilityRows,
} from "@/components/data-table-model"
import { MainTableShell } from "@/components/main-table-shell"
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
  unavailabilityStatusLabel,
  type UnavailabilityRow,
  type UnavailabilityStatus,
} from "@/lib/unavailability"

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
            href={`/unavailability/${encodeURIComponent(row.original.unavailability_id)}`}
          >
            影响
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/shift-details?query=${row.original.site_name}`}>班次</Link>
        </Button>
      </div>
    ),
  },
]

export function UnavailabilityTable({
  emptyMessage = "暂无符合条件的不可用记录",
  rows,
}: {
  emptyMessage?: string
  rows: UnavailabilityRow[]
}) {
  "use no memo"

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] =
    React.useState<UnavailabilityStatus | "all">("all")
  const filteredRows = React.useMemo(
    () =>
      filterUnavailabilityRows(rows, {
        query: globalFilter,
        status: statusFilter,
      }),
    [globalFilter, rows, statusFilter]
  )
  const summary = summarizeUnavailabilityRows(filteredRows)
  const hasActiveFilters = globalFilter.trim() !== "" || statusFilter !== "all"

  return (
    <MainTableShell
      title="不可用记录"
      columns={columns}
      data={filteredRows}
      columnLabels={columnLabels}
      emptyMessage={emptyMessage}
      initialSorting={[{ id: "unavailable_date", desc: false }]}
      variant="embedded"
      summary={
        <>
          <Badge variant="outline">筛选后 {summary.total} 条</Badge>
          <span>生效中 {summary.active}</span>
          <span>已处理 {summary.resolved}</span>
          <span>影响时段 {summary.affectedIntervals}</span>
          <span>团队 {summary.teamCount}</span>
          <span>职场 {summary.siteCount}</span>
        </>
      }
      renderToolbar={({
        columnVisibilityControl,
        pageSizeSelect,
        resetPageIndex,
      }) => (
        <>
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border px-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value)
                resetPageIndex()
              }}
              placeholder="搜索人员、团队、职场或原因"
              className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as UnavailabilityStatus | "all")
              resetPageIndex()
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
          {pageSizeSelect}
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasActiveFilters}
            onClick={() => {
              setGlobalFilter("")
              setStatusFilter("all")
              resetPageIndex()
            }}
          >
            <RotateCcw data-icon="inline-start" />
            重置
          </Button>
          {columnVisibilityControl}
        </>
      )}
    />
  )
}
