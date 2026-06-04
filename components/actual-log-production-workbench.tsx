import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  DatabaseZap,
  FileSearch,
  Layers3,
  ShieldAlert,
  Split,
  Table2,
} from "lucide-react"

import {
  summarizeActualLogProcessingDetail,
  type ActualLogProductionTone,
  summarizeActualLogProductionWorkbench,
} from "@/components/actual-log-production-model"
import type {
  ImportBatchListRow,
  ImportBatchPersistenceDetail,
} from "@/components/import-center-model"
import { buildImportUploadWorkspaceHref } from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ActualLogProductionWorkbenchProps = {
  batches: ImportBatchListRow[]
  error: string | null
}

type ActualLogProcessingDetailProps = {
  batches: ImportBatchListRow[]
  batchId: string
  detail: ImportBatchPersistenceDetail | null
  error: string | null
}

export function ActualLogProductionWorkbench({
  batches,
  error,
}: ActualLogProductionWorkbenchProps) {
  const summary = summarizeActualLogProductionWorkbench(batches)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-normal">CORN 状态日志生产</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            按登录日志和状态日志导入批次查看实际日志业务版本、应用状态、业务日范围、时区和跨天处理结果。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {formatToneLabel(summary.tone)}
          </Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              日志来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="日志版本"
          value={summary.totalVersions.toLocaleString("zh-CN")}
          detail={summary.title}
          tone="default"
        />
        <MetricCard
          label="登录日志"
          value={summary.loginVersions.toLocaleString("zh-CN")}
          detail="登录/登出事件来源"
          tone={summary.loginVersions > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="状态日志"
          value={summary.statusVersions.toLocaleString("zh-CN")}
          detail="状态字典与区间来源"
          tone={summary.statusVersions > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="已应用"
          value={summary.appliedVersions.toLocaleString("zh-CN")}
          detail="已应用到实际日志业务数据"
          tone={summary.appliedVersions > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="仍有阻塞"
          value={summary.blockedVersions.toLocaleString("zh-CN")}
          detail="未应用、缺版本或缺处理记录"
          tone={summary.blockedVersions > 0 ? "blocked" : "default"}
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <DatabaseZap className="size-4 text-muted-foreground" />
            版本状态
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="grid gap-1">
            <p className="font-medium text-foreground">{summary.title}</p>
            <p>{summary.detail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={buildImportUploadWorkspaceHref({ fileType: "login_log" })}>
                导入登录日志
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href={buildImportUploadWorkspaceHref({ fileType: "status_log" })}>
                导入状态日志
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Table2 className="size-4 text-muted-foreground" />
            登录/状态日志生产台账
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日志版本</TableHead>
                <TableHead>来源批次</TableHead>
                <TableHead>业务日范围</TableHead>
                <TableHead>应用状态</TableHead>
                <TableHead>时区校验</TableHead>
                <TableHead>跨天处理</TableHead>
                <TableHead>处理状态</TableHead>
                <TableHead>阻塞原因</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.rows.length > 0 ? (
                summary.rows.map((row) => (
                  <TableRow key={row.batchId}>
                    <TableCell className="align-top">
                      <div className="font-mono text-xs">{row.versionLabel}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">{row.fileTypeLabel}</Badge>
                        <span>{row.fileName}</span>
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
                    <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                      {row.timezoneCheckLabel}
                    </TableCell>
                    <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                      {row.crossDayCheckLabel}
                    </TableCell>
                    <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                      {row.processingStatusLabel}
                    </TableCell>
                    <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                      {row.blockerSummary}
                    </TableCell>
                    <TableCell className="align-top">
                      <Button asChild size="sm" variant="outline">
                        <Link href={row.detailHref}>
                          处理解释
                          <ArrowRight data-icon="inline-end" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                    暂无登录日志或状态日志导入批次
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </main>
  )
}

export function ActualLogProcessingDetail({
  batches,
  batchId,
  detail,
  error,
}: ActualLogProcessingDetailProps) {
  const summary = summarizeActualLogProcessingDetail(batches, batchId, detail)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link href={summary.workbenchHref}>返回日志生产</Link>
            </Button>
            <Badge variant={summary.tone === "ready" ? "outline" : "destructive"}>
              {summary.tone === "ready" ? "可解释" : "解释受限"}
            </Badge>
            <Badge variant="secondary">{summary.fileTypeLabel}</Badge>
          </div>
          <h1 className="text-xl font-semibold tracking-normal">登录/状态日志处理解释</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            {summary.detail}
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={summary.sourceBatchHref}>
            查看来源批次
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              明细读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="overview" className="grid gap-4">
        <TabsList className="h-auto w-full justify-start overflow-x-auto md:w-fit">
          {summary.workspaceTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0 grid gap-4">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="登录事件"
              value={summary.loginEventCount.toLocaleString("zh-CN")}
              detail={summary.loginEventLabel}
              tone="default"
            />
            <MetricCard
              label="状态字典"
              value={summary.statusDictionaryCount.toLocaleString("zh-CN")}
              detail={summary.exceptionShell.statusDictionaryLabel}
              tone="default"
            />
            <MetricCard
              label="状态区间"
              value={summary.statusIntervalCount.toLocaleString("zh-CN")}
              detail={summary.statusIntervalLabel}
              tone={summary.statusIntervalCount > 0 ? "ready" : "default"}
            />
            <MetricCard
              label="跨天区间"
              value={summary.crossDayIntervalCount.toLocaleString("zh-CN")}
              detail={summary.crossDaySplitLabel}
              tone={summary.crossDayIntervalCount > 0 ? "ready" : "default"}
            />
            <MetricCard
              label="时区异常"
              value={summary.nonShanghaiTimezoneCount.toLocaleString("zh-CN")}
              detail={summary.timezoneCheckLabel}
              tone={summary.nonShanghaiTimezoneCount > 0 ? "blocked" : "default"}
            />
          </section>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileSearch className="size-4 text-muted-foreground" />
                {summary.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground">
              <div className="grid gap-1">
                <p className="font-mono text-xs text-foreground">
                  {summary.versionLabel}
                </p>
                <p>{summary.fileName} · {summary.batchId}</p>
                <p>
                  {summary.sourceRowLabel} · 已应用记录{" "}
                  {summary.appliedRecordCountLabel}
                </p>
                <p>{summary.businessDayLabel}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock3 className="size-4 text-muted-foreground" />
                时区与业务日
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <InfoPill title="时区校验" detail={summary.timezoneCheckLabel} />
              <InfoPill title="业务日归属" detail={summary.businessDayLabel} />
              <InfoPill title="跨天切分" detail={summary.crossDaySplitLabel} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="size-4 text-muted-foreground" />
                {summary.exceptionShell.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground">
              <p>{summary.exceptionShell.detail}</p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {summary.exceptionShell.items.map((item) => (
                  <div
                    key={item.title}
                    className="flex min-w-0 flex-col gap-2 rounded-md border px-3 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <Badge
                        variant={
                          item.tone === "blocked"
                            ? "destructive"
                            : item.tone === "ready"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {formatExceptionToneLabel(item.tone)}
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground">{item.statusLabel}</p>
                    <p className="text-xs">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rows" className="mt-0">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Split className="size-4 text-muted-foreground" />
                逐行处理解释
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>行号</TableHead>
                    <TableHead>记录</TableHead>
                    <TableHead>员工</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>时区</TableHead>
                    <TableHead>业务日</TableHead>
                    <TableHead>跨天解释</TableHead>
                    <TableHead>处理说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.rows.length > 0 ? (
                    summary.rows.map((row) => (
                      <TableRow key={`${row.rowNumberLabel}-${row.recordLabel}`}>
                        <TableCell className="align-top font-mono text-xs">
                          {row.rowNumberLabel}
                        </TableCell>
                        <TableCell className="align-top">{row.recordLabel}</TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {row.employeeLabel}
                        </TableCell>
                        <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                          {row.timeRangeLabel}
                        </TableCell>
                        <TableCell className="max-w-xs align-top">
                          <Badge
                            variant={
                              row.tone === "ready" ? "outline" : "destructive"
                            }
                          >
                            {row.timezoneLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {row.businessDayLabel}
                        </TableCell>
                        <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                          {row.crossDayLabel}
                        </TableCell>
                        <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                          {row.processingLabel}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-sm text-muted-foreground"
                      >
                        {summary.detailEmptyLabel}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
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
    <Card className={tone === "blocked" ? "border-destructive/40" : undefined}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Layers3 className="size-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function InfoPill({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <div className="text-xs font-medium text-foreground">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
    </div>
  )
}

function formatToneLabel(tone: ActualLogProductionTone) {
  if (tone === "ready") {
    return "日志已就绪"
  }

  if (tone === "blocked") {
    return "仍有阻塞"
  }

  return "暂无来源"
}

function formatExceptionToneLabel(tone: "ready" | "blocked" | "empty") {
  if (tone === "ready") {
    return "已解释"
  }

  if (tone === "blocked") {
    return "需关注"
  }

  return "待补充"
}
