import Link from "next/link"
import { Search } from "lucide-react"

import { AppShell } from "@/components/app-shell"
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
import {
  getUnavailability,
  unavailabilityStatusLabel,
  type UnavailabilityStatus,
} from "@/lib/unavailability"

const statusOptions: { label: string; value?: UnavailabilityStatus }[] = [
  { label: "全部" },
  { label: "生效中", value: "active" },
  { label: "已处理", value: "resolved" },
]

type PageProps = {
  searchParams: Promise<{
    query?: string
    status?: string
  }>
}

function parseStatus(status?: string): UnavailabilityStatus | undefined {
  if (status === "active" || status === "resolved") {
    return status
  }

  return undefined
}

function statusHref(status: UnavailabilityStatus | undefined, query: string) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set("query", query.trim())
  }

  if (status) {
    searchParams.set("status", status)
  }

  const suffix = searchParams.toString()
  return `/unavailability${suffix ? `?${suffix}` : ""}`
}

export default async function UnavailabilityPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.query?.trim() ?? ""
  const status = parseStatus(params.status)
  const rows = await getUnavailability({ query, status })
  const activeRows = rows.filter((row) => row.status === "active")
  const affectedIntervals = rows.reduce(
    (sum, row) => sum + row.affected_intervals,
    0
  )
  const teamCount = new Set(rows.map((row) => row.team_name)).size
  const siteCount = new Set(rows.map((row) => row.site_name)).size

  return (
    <AppShell title="不可用管理" searchPlaceholder="搜索人员、团队或原因">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">不可用管理</h1>
            <p className="text-sm text-muted-foreground">
              查看人员不可用时段，提前识别排班覆盖风险
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/schedule-plans">查看排班计划</Link>
          </Button>
        </div>

        <section className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <form className="flex min-w-64 flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                name="query"
                defaultValue={query}
                placeholder="搜索人员、团队、项目、职场、原因"
                className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {status ? <input name="status" type="hidden" value={status} /> : null}
            <Button type="submit" variant="outline" size="sm">
              搜索
            </Button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((option) => {
              const active = option.value === status || (!option.value && !status)

              return (
                <Button
                  key={option.label}
                  asChild
                  variant={active ? "default" : "outline"}
                  size="sm"
                >
                  <Link href={statusHref(option.value, query)}>
                    {option.label}
                  </Link>
                </Button>
              )
            })}
          </div>
          {query || status ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/unavailability">清空</Link>
            </Button>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard title="不可用记录" value={`${rows.length}`} description="当前筛选结果" />
          <MetricCard title="生效中" value={`${activeRows.length}`} description="需要排班复核" />
          <MetricCard title="影响时段" value={`${affectedIntervals}`} description="按 0.5h 颗粒度" />
          <MetricCard title="涉及团队" value={`${teamCount}`} description={`${siteCount} 个职场`} />
        </section>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>不可用记录</CardTitle>
              <CardDescription>
                {status ? `${unavailabilityStatusLabel(status)} / ${query || "全部"}` : query || "全部记录"}
              </CardDescription>
            </div>
            <Badge variant="outline">B006 不可用</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日期</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>人员</TableHead>
                  <TableHead>团队</TableHead>
                  <TableHead>项目</TableHead>
                  <TableHead>职场</TableHead>
                  <TableHead>原因</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">影响时段</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead className="w-24 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.unavailability_id}>
                    <TableCell className="whitespace-nowrap">
                      {row.unavailable_date}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.start_time}-{row.end_time}
                    </TableCell>
                    <TableCell className="font-medium">{row.staff_name}</TableCell>
                    <TableCell>{row.team_name}</TableCell>
                    <TableCell>{row.project_name}</TableCell>
                    <TableCell>{row.site_name}</TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "active" ? "default" : "outline"}>
                        {unavailabilityStatusLabel(row.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.affected_intervals}
                    </TableCell>
                    <TableCell>{row.note}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/unavailability/${encodeURIComponent(row.unavailability_id)}`}
                          >
                            影响
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/shift-details?query=${row.site_name}`}>
                            班次
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      暂无符合条件的不可用记录
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
