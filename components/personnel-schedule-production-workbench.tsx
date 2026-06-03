import Link from "next/link"
import type { ReactNode } from "react"
import { AlertTriangle, ArrowRight, CalendarClock, FileClock, Lock, Table2 } from "lucide-react"

import type { ImportBatchListRow } from "@/components/import-center-model"
import {
  type PersonnelScheduleProductionTone,
  summarizePersonnelScheduleProductionWorkbench,
} from "@/components/personnel-schedule-production-model"
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

type PersonnelScheduleProductionWorkbenchProps = {
  batches: ImportBatchListRow[]
  error: string | null
}

export function PersonnelScheduleProductionWorkbench({
  batches,
  error,
}: PersonnelScheduleProductionWorkbenchProps) {
  const summary = summarizePersonnelScheduleProductionWorkbench(batches)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-normal">排班生产</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            按人员排班导入批次查看生产版本、应用状态、业务日范围和 0.5h 展开状态。本页只读，不发布、不冻结、不触发自动排班。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {formatToneLabel(summary.tone)}
          </Badge>
          <Badge variant="secondary">只读工作台</Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              排班来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="排班版本"
          value={summary.totalVersions.toLocaleString("zh-CN")}
          detail={summary.title}
          tone="default"
        />
        <MetricCard
          label="已应用"
          value={summary.appliedVersions.toLocaleString("zh-CN")}
          detail="已应用到人员排班业务数据"
          tone={summary.appliedVersions > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="0.5h 已展开"
          value={summary.expandedVersions.toLocaleString("zh-CN")}
          detail="可进入后续比对口径"
          tone={summary.expandedVersions > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="仍有阻塞"
          value={summary.blockedVersions.toLocaleString("zh-CN")}
          detail="未应用、缺版本或缺展开记录"
          tone={summary.blockedVersions > 0 ? "blocked" : "default"}
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-4 text-muted-foreground" />
            当前生产边界
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="grid gap-1">
            <p className="font-medium text-foreground">{summary.title}</p>
            <p>{summary.detail}</p>
            <p>
              当前只读展示来源批次、业务版本、应用状态和展开状态；版本详情待 IM100，发布/冻结边界待 IM101。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/data-quality/versions?domain=personnel_schedule">
                查看业务版本
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/schedule-plans">返回排班计划</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Table2 className="size-4 text-muted-foreground" />
            人员排班生产台账
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>业务版本</TableHead>
                <TableHead>来源批次</TableHead>
                <TableHead>业务日范围</TableHead>
                <TableHead>应用状态</TableHead>
                <TableHead>0.5h 展开</TableHead>
                <TableHead>阻塞原因</TableHead>
                <TableHead className="text-right">后续入口</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.rows.length > 0 ? (
                summary.rows.map((row) => (
                  <TableRow key={row.batchId}>
                    <TableCell className="align-top">
                      <div className="font-mono text-xs">{row.versionLabel}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {row.fileName}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Button asChild size="sm" variant="link" className="h-auto px-0 py-0">
                        <Link href={row.sourceBatchHref}>{row.sourceBatchLabel}</Link>
                      </Button>
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {row.businessDateLabel}
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={row.applicationLabel === "已应用" ? "outline" : "destructive"}>
                        {row.applicationLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="grid gap-1">
                        <Badge variant={row.tone === "ready" ? "outline" : "destructive"}>
                          {row.expansionLabel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          展开记录 {row.appliedRecordCountLabel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                      {row.blockerSummary}
                    </TableCell>
                    <TableCell className="align-top text-right text-sm text-muted-foreground">
                      {row.nextActionLabel}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                    暂无人员排班导入批次
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-3 md:grid-cols-2">
        <BoundaryItem
          icon={<Lock className="size-4 text-muted-foreground" />}
          title="当前不发布冻结"
          detail="本轮不改变生产排班状态，只展示版本是否具备进入详情、比对和后续发布冻结边界的条件。"
        />
        <BoundaryItem
          icon={<FileClock className="size-4 text-muted-foreground" />}
          title="后续顺序"
          detail="IM100 补单版本详情和 0.5h 展开结果；IM101 只讨论发布/冻结安全壳，不直接接真实写入。"
        />
      </section>
    </main>
  )
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone: "default" | "ready" | "blocked"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={
            tone === "blocked"
              ? "text-2xl font-semibold tracking-normal text-destructive"
              : "text-2xl font-semibold tracking-normal"
          }
        >
          {value}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function BoundaryItem({
  icon,
  title,
  detail,
}: {
  icon: ReactNode
  title: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function formatToneLabel(tone: PersonnelScheduleProductionTone) {
  if (tone === "ready") {
    return "已形成展开版本"
  }

  if (tone === "blocked") {
    return "仍有阻塞"
  }

  return "等待来源"
}
