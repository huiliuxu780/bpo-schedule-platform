"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpDown, RotateCcw, Search } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import {
  filterScheduleRiskRows,
  summarizeScheduleRiskRows,
} from "@/components/data-table-model"
import { MainTableShell } from "@/components/main-table-shell"
import {
  scheduleRiskLevelLabel,
  scheduleRiskStatusLabel,
  type ScheduleRiskLevel,
  type ScheduleRiskRow,
  type ScheduleRiskStatus,
} from "@/lib/schedule-plans"
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

function levelVariant(level: ScheduleRiskLevel) {
  if (level === "high") {
    return "destructive" as const
  }

  if (level === "medium") {
    return "secondary" as const
  }

  return "outline" as const
}

function statusVariant(status: ScheduleRiskStatus) {
  if (status === "open") {
    return "destructive" as const
  }

  if (status === "confirmed") {
    return "secondary" as const
  }

  return "default" as const
}

const levelRank: Record<ScheduleRiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const statusRank: Record<ScheduleRiskStatus, number> = {
  open: 0,
  confirmed: 1,
  resolved: 2,
}

const columnLabels: Record<string, string> = {
  plan_date: "日期",
  interval: "时段",
  project_name: "项目",
  site_name: "职场",
  risk_level: "风险等级",
  risk_status: "处理状态",
  gap_agents: "缺口人数",
  affected_unavailability: "不可用影响",
  reason: "原因",
}

const columns: ColumnDef<ScheduleRiskRow>[] = [
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
    accessorKey: "interval_start",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        时段
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {row.original.interval_start}-{row.original.interval_end}
      </span>
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
    accessorKey: "risk_level",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        风险等级
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    sortingFn: (left, right) =>
      levelRank[left.original.risk_level] - levelRank[right.original.risk_level],
    cell: ({ row }) => (
      <Badge variant={levelVariant(row.original.risk_level)}>
        {scheduleRiskLevelLabel(row.original.risk_level)}
      </Badge>
    ),
  },
  {
    accessorKey: "risk_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        处理状态
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    sortingFn: (left, right) =>
      statusRank[left.original.risk_status] - statusRank[right.original.risk_status],
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.risk_status)}>
        {scheduleRiskStatusLabel(row.original.risk_status)}
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
          缺口人数
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
          不可用影响
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
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.reason}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">操作</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/schedule-risks/${encodeURIComponent(row.original.risk_id)}`}>
            查看
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/schedule-plans/${encodeURIComponent(row.original.plan_id)}`}>
            计划
          </Link>
        </Button>
      </div>
    ),
  },
]

export function ScheduleRiskTable({
  risks,
  filterLabel,
  sourceTotal,
}: {
  risks: ScheduleRiskRow[]
  filterLabel?: string
  sourceTotal?: number
}) {
  "use no memo"

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] =
    React.useState<ScheduleRiskStatus | "all">("all")
  const [levelFilter, setLevelFilter] =
    React.useState<ScheduleRiskLevel | "all">("all")
  const filteredRisks = React.useMemo(
    () =>
      filterScheduleRiskRows(risks, {
        query: globalFilter,
        status: statusFilter,
        level: levelFilter,
      }),
    [globalFilter, levelFilter, risks, statusFilter]
  )
  const summary = summarizeScheduleRiskRows(filteredRisks)
  const hasActiveFilters =
    globalFilter.trim() !== "" || statusFilter !== "all" || levelFilter !== "all"

  const sourceIsEmpty = sourceTotal === 0
  const emptyMessage = sourceIsEmpty
    ? "暂无履约风险数据"
    : "暂无符合条件的履约风险"

  return (
    <MainTableShell
      title="履约风险"
      description={`筛选履约风险列表${
        filterLabel ? ` / 当前筛选：${filterLabel}` : ""
      }`}
      columns={columns}
      data={filteredRisks}
      columnLabels={columnLabels}
      emptyMessage={emptyMessage}
      initialSorting={[{ id: "risk_level", desc: false }]}
      summary={
        <>
          <Badge variant="outline">筛选后 {summary.total} 条</Badge>
          <span>待处理 {summary.open}</span>
          <span>已确认 {summary.confirmed}</span>
          <span>已处理 {summary.resolved}</span>
          <span>高风险 {summary.high}</span>
          <span>缺口 {summary.totalGap}</span>
          <span>不可用影响 {summary.affectedUnavailability}</span>
        </>
      }
      renderToolbar={({ pageSizeSelect, resetPageIndex }) => (
        <>
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border px-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value)
                resetPageIndex()
              }}
              placeholder="搜索风险编号、计划编号、项目、职场或原因"
              className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as ScheduleRiskStatus | "all")
              resetPageIndex()
            }}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue aria-label="处理状态筛选" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="open">待处理</SelectItem>
              <SelectItem value="confirmed">已确认</SelectItem>
              <SelectItem value="resolved">已处理</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={levelFilter}
            onValueChange={(value) => {
              setLevelFilter(value as ScheduleRiskLevel | "all")
              resetPageIndex()
            }}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue aria-label="风险等级筛选" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="high">高风险</SelectItem>
              <SelectItem value="medium">需关注</SelectItem>
              <SelectItem value="low">提醒</SelectItem>
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
              setLevelFilter("all")
              resetPageIndex()
            }}
          >
            <RotateCcw data-icon="inline-start" />
            重置
          </Button>
        </>
      )}
    />
  )
}
