"use client"

import * as React from "react"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  MoreHorizontal,
  Search,
} from "lucide-react"

import { anomalies, type Anomaly } from "@/app/dashboard/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type SortKey = keyof Pick<
  Anomaly,
  "id" | "type" | "team" | "headcount" | "impactedHours" | "severity" | "status"
>

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "id", label: "异常编号" },
  { key: "type", label: "异常类型" },
  { key: "team", label: "团队" },
  { key: "headcount", label: "人数", className: "text-right" },
  { key: "impactedHours", label: "影响工时", className: "text-right" },
  { key: "severity", label: "严重度" },
  { key: "status", label: "状态" },
]

function compareValue(row: Anomaly, key: SortKey) {
  if (key === "impactedHours") {
    return Number.parseFloat(row.impactedHours)
  }

  return row[key]
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

export function DataTable() {
  const [query, setQuery] = React.useState("")
  const [sortKey, setSortKey] = React.useState<SortKey>("id")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  )
  const [page, setPage] = React.useState(1)
  const pageSize = 5

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const rows = normalized
      ? anomalies.filter((item) =>
          [
            item.id,
            item.type,
            item.project,
            item.team,
            item.shiftTime,
            item.severity,
            item.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        )
      : anomalies

    return [...rows].sort((a, b) => {
      const aValue = compareValue(a, sortKey)
      const bValue = compareValue(b, sortKey)

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }

      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }

      return 0
    })
  }, [query, sortDirection, sortKey])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
      return
    }

    setSortKey(key)
    setSortDirection("asc")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>BPO 异常明细</CardTitle>
          <CardDescription>支持搜索、排序、分页与行操作占位</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Columns3 className="size-4" />
          列控制
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex max-w-sm flex-1 items-center gap-2 rounded-md border px-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="搜索异常编号、类型、团队或状态"
              className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    <button
                      className="inline-flex items-center gap-1"
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.label}
                      <ArrowUpDown className="size-3" />
                    </button>
                  </TableHead>
                ))}
                <TableHead>项目</TableHead>
                <TableHead>班次时间</TableHead>
                <TableHead className="w-12 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.id}</TableCell>
                  <TableCell className="min-w-36 font-medium">
                    {row.type}
                  </TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.headcount}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.impactedHours}
                  </TableCell>
                  <TableCell>
                    <Badge variant={severityVariant(row.severity)}>
                      {row.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.project}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.shiftTime}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="行操作">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            共 {filtered.length} 条，当前第 {page} / {pageCount} 页
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="size-4" />
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
            >
              下一页
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
