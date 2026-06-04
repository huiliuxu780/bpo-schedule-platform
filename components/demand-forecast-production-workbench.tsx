import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  FileClock,
  Layers3,
  ShieldCheck,
  Table2,
} from "lucide-react"

import {
  buildImportUploadWorkspaceHref,
  type ImportBatchListRow,
} from "@/components/import-center-model"
import {
  type DemandForecastProductionApiDetail,
  type DemandForecastProductionTone,
  summarizeDemandForecastProductionDetail,
  summarizeDemandForecastProductionWorkbench,
} from "@/components/demand-forecast-production-model"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DemandForecastProductionWorkbenchProps = {
  batches: ImportBatchListRow[]
  error: string | null
}

export function DemandForecastProductionWorkbench({
  batches,
  error,
}: DemandForecastProductionWorkbenchProps) {
  const summary = summarizeDemandForecastProductionWorkbench(batches)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-normal">预测生产</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            按需求预测导入批次查看预测版本、应用状态、业务日范围和技能组/等级/时段对齐状态。
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
              预测来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="预测版本"
          value={summary.totalVersions.toLocaleString("zh-CN")}
          detail={summary.title}
          tone="default"
        />
        <MetricCard
          label="已应用"
          value={summary.appliedVersions.toLocaleString("zh-CN")}
          detail="已应用到需求预测业务数据"
          tone={summary.appliedVersions > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="已对齐"
          value={summary.alignedVersions.toLocaleString("zh-CN")}
          detail="技能组/等级/时段口径可用"
          tone={summary.alignedVersions > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="仍有阻塞"
          value={summary.blockedVersions.toLocaleString("zh-CN")}
          detail="未应用、缺版本或缺预测明细"
          tone={summary.blockedVersions > 0 ? "blocked" : "default"}
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-4 text-muted-foreground" />
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
              <Link href={buildImportUploadWorkspaceHref({ fileType: "demand_forecast" })}>
                导入预测
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/demand-plans">返回需求计划</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Table2 className="size-4 text-muted-foreground" />
            需求预测生产台账
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>预测版本</TableHead>
                <TableHead>来源批次</TableHead>
                <TableHead>业务日范围</TableHead>
                <TableHead>应用状态</TableHead>
                <TableHead>技能/等级/时段对齐</TableHead>
                <TableHead>阻塞原因</TableHead>
                <TableHead className="text-right">操作</TableHead>
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
                          {row.alignmentLabel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          预测明细 {row.appliedRecordCountLabel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                      {row.blockerSummary}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={row.detailHref}>
                          {row.nextActionLabel}
                          <ArrowRight data-icon="inline-end" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                    暂无需求预测导入批次
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

export function DemandForecastProductionDetail({
  batches,
  batchId,
  error,
  apiDetail,
}: {
  batches: ImportBatchListRow[]
  batchId: string
  error: string | null
  apiDetail: DemandForecastProductionApiDetail | null
}) {
  const detail = summarizeDemandForecastProductionDetail(batches, batchId, apiDetail)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2">
            <Button asChild size="sm" variant="ghost">
              <Link href={detail.workbenchHref}>
                <ArrowLeft data-icon="inline-start" />
                返回预测生产
              </Link>
            </Button>
          </div>
          <h1 className="text-xl font-semibold tracking-normal">预测版本详情</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            查看单个需求预测来源批次对应的业务版本、技能组/等级/时段对齐口径和预测明细。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={detail.tone === "blocked" ? "destructive" : "outline"}>
            {detail.tone === "ready" ? "对齐已形成" : "详情仍阻塞"}
          </Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              预测来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="overview" className="grid gap-4">
        <TabsList className="h-auto w-full justify-start overflow-x-auto md:w-fit">
          {detail.workspaceTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0 grid gap-4">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="来源版本"
              value={detail.versionLabel}
              detail={detail.title}
              tone="default"
            />
            <MetricCard
              label="应用状态"
              value={detail.applicationLabel}
              detail={detail.appliedRecordCountLabel}
              tone={detail.applicationLabel === "已应用" ? "ready" : "blocked"}
            />
            <MetricCard
              label="对齐状态"
              value={detail.alignmentLabel}
              detail={detail.alignmentResultLabel}
              tone={detail.tone === "ready" ? "ready" : "blocked"}
            />
            <MetricCard
              label="版本变更"
              value={detail.changeRows.length.toLocaleString("zh-CN")}
              detail={detail.changeBoundaryLabel}
              tone="default"
            />
          </section>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="size-4 text-muted-foreground" />
                {detail.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <DetailItem label="业务日范围" value={detail.businessDateLabel} />
              <DetailItem label="成功导入" value={detail.sourceRowLabel} />
              <DetailItem label="阻塞原因" value={detail.blockerSummary} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="source" className="mt-0 grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="size-4 text-muted-foreground" />
                版本来源
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
              <DetailItem label="来源批次" value={detail.batchId} />
              <DetailItem label="来源文件" value={detail.fileName} />
              <DetailItem label="业务日范围" value={detail.businessDateLabel} />
              <DetailItem label="上传时间" value={detail.uploadedAtLabel} />
              <DetailItem label="成功导入" value={detail.sourceRowLabel} />
              <DetailItem label="阻塞原因" value={detail.blockerSummary} />
              <div className="md:col-span-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={detail.sourceBatchHref}>查看来源批次</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Table2 className="size-4 text-muted-foreground" />
                技能组/等级/时段对齐结果
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground">
              <DetailItem label="技能组与等级" value={detail.skillAlignmentLabel} />
              <DetailItem label="时段粒度" value={detail.timeBucketLabel} />
              <DetailItem label="预测明细" value={detail.forecastScopeLabel} />
              <DetailItem label="对齐结果" value={detail.alignmentResultLabel} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rows" className="mt-0 grid gap-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Table2 className="size-4 text-muted-foreground" />
                0.5h 预测区间
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>业务日</TableHead>
                    <TableHead>时段</TableHead>
                    <TableHead>维度</TableHead>
                    <TableHead>等级</TableHead>
                    <TableHead className="text-right">需求人次</TableHead>
                    <TableHead>对齐状态</TableHead>
                    <TableHead>阻塞说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.intervalRows.length > 0 ? (
                    detail.intervalRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="align-top text-sm">{row.dateLabel}</TableCell>
                        <TableCell className="align-top font-mono text-xs">{row.timeLabel}</TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {row.dimensionLabel}
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge variant="outline">{row.demandLevelLabel}</Badge>
                        </TableCell>
                        <TableCell className="align-top text-right tabular-nums">
                          {row.requiredAgentsLabel}
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge
                            variant={
                              row.alignmentStatusLabel === "对齐完整"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {row.alignmentStatusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-sm align-top text-sm text-muted-foreground">
                          {row.blockerLabel}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-20 text-center text-sm text-muted-foreground">
                        未读取到 0.5h 预测区间
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileClock className="size-4 text-muted-foreground" />
                版本变更记录
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>上一版本</TableHead>
                    <TableHead>变更原因</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.changeRows.length > 0 ? (
                    detail.changeRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="align-top font-mono text-xs">
                          {row.comparedFromVersionLabel}
                        </TableCell>
                        <TableCell className="align-top text-sm text-muted-foreground">
                          {row.changeReasonLabel}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-20 text-center text-sm text-muted-foreground">
                        未读取到版本变更记录
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-0">
          <Card className={detail.comparisonEntry.tone === "blocked" ? "border-destructive/40" : undefined}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-muted-foreground" />
                {detail.comparisonEntry.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground">
              <p>{detail.comparisonEntry.detail}</p>
              <DetailItem label="入口状态" value={detail.comparisonEntry.blockerLabel} />
              <div>
                <Button asChild size="sm" variant="outline">
                  <Link href={detail.comparisonEntry.href}>
                    {detail.comparisonEntry.actionLabel}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

function formatToneLabel(tone: DemandForecastProductionTone) {
  if (tone === "ready") {
    return "预测已就绪"
  }

  if (tone === "blocked") {
    return "仍有阻塞"
  }

  return "暂无来源"
}
