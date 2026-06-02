import Link from "next/link"
import { Activity, ArrowLeft, ExternalLink, GitBranch, Table2 } from "lucide-react"

import {
  type ImportComparisonRunDetailResponse,
  summarizeImportComparisonRunDetail,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ImportCenterComparisonRunDetailWorkspaceProps = {
  runId: string
  detail: ImportComparisonRunDetailResponse | null
  error: string | null
}

export function ImportCenterComparisonRunDetailWorkspace({
  runId,
  detail,
  error,
}: ImportCenterComparisonRunDetailWorkspaceProps) {
  const summary = summarizeImportComparisonRunDetail({ detail, error })

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <Button asChild size="sm" variant="ghost" className="w-fit px-0">
            <Link href="/data-quality/review-cases">
              <ArrowLeft data-icon="inline-start" />
              返回复核案例
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-normal">对比运行详情</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {summary.title}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {summary.tone === "blocked" ? "需处理" : "只读"}
          </Badge>
          <Badge variant="secondary">{runId}</Badge>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summary.metricCards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
          />
        ))}
      </section>

      <section className="grid gap-4">
        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="grid gap-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GitBranch className="size-4 text-muted-foreground" />
                  运行来源
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {summary.versionLabel}
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="w-fit">
                <Link href={summary.apiHref}>
                  查看运行 API
                  <ExternalLink data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Table2 className="size-4 text-muted-foreground" />
              结果明细
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              只展示该运行已返回的计算结果，不在本页触发计算或写入。
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {summary.resultRows.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                当前运行还没有可展示的结果。
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">来源</TableHead>
                    <TableHead className="min-w-[280px]">维度</TableHead>
                    <TableHead className="min-w-[240px]">指标</TableHead>
                    <TableHead className="min-w-[96px]">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.resultRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.source}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.dimension}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.metric}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-muted-foreground" />
              处理边界
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>本页只读展示，不触发重新计算、发布、审批、导出或批量处理。</p>
            <p>
              从复核案例进入时，只用于追踪来源运行和结果，不改变任何复核状态。
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="truncate text-sm font-semibold tracking-normal">{value}</div>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}
