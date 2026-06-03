import Link from "next/link"
import type { ReactNode } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  FileClock,
  Layers3,
  Lock,
  ShieldCheck,
  Table2,
} from "lucide-react"

import type { ImportBatchListRow } from "@/components/import-center-model"
import {
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
            按需求预测导入批次查看预测版本、应用状态、业务日范围和技能组/等级/时段对齐状态。本页只读，不调整预测、不触发自动排班。
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
            当前生产边界
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="grid gap-1">
            <p className="font-medium text-foreground">{summary.title}</p>
            <p>{summary.detail}</p>
            <p>
              当前只读展示来源批次、预测业务版本、应用状态和对齐状态；版本详情可查看，变更追踪安全壳位于单版本详情页。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/data-quality/versions?domain=demand_forecast">
                查看业务版本
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

      <section className="grid gap-3 md:grid-cols-2">
        <BoundaryItem
          icon={<Lock className="size-4 text-muted-foreground" />}
          title="当前不调整预测"
          detail="本轮不改变预测版本、不写变更记录、不触发自动排班，只展示预测是否具备进入排班和比对的只读口径。"
        />
        <BoundaryItem
          icon={<FileClock className="size-4 text-muted-foreground" />}
          title="后续顺序"
          detail="单版本详情已经承接对齐结果和变更追踪安全壳；真实写入、影响校验提交和生产口径变更仍需单独确认。"
        />
      </section>
    </main>
  )
}

export function DemandForecastProductionDetail({
  batches,
  batchId,
  error,
}: {
  batches: ImportBatchListRow[]
  batchId: string
  error: string | null
}) {
  const detail = summarizeDemandForecastProductionDetail(batches, batchId)

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
            查看单个需求预测来源批次对应的业务版本、技能组/等级/时段对齐口径和预测明细边界。本页只读，不调整预测、不写变更记录。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={detail.tone === "blocked" ? "destructive" : "outline"}>
            {detail.tone === "ready" ? "对齐已形成" : "详情仍阻塞"}
          </Badge>
          <Badge variant="secondary">只读详情</Badge>
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
        <MetricCard label="来源版本" value={detail.versionLabel} detail={detail.title} tone="default" />
        <MetricCard label="应用状态" value={detail.applicationLabel} detail={detail.appliedRecordCountLabel} tone={detail.applicationLabel === "已应用" ? "ready" : "blocked"} />
        <MetricCard label="对齐状态" value={detail.alignmentLabel} detail={detail.alignmentResultLabel} tone={detail.tone === "ready" ? "ready" : "blocked"} />
        <MetricCard label="变更追踪" value="暂不写入" detail={detail.changeBoundaryLabel} tone="default" />
      </section>

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
          <DetailItem label="预测明细边界" value={detail.forecastScopeLabel} />
          <DetailItem label="对齐结果" value={detail.alignmentResultLabel} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-muted-foreground" />
            {detail.changeTracking.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <DetailItem label="来源版本前置校验" value={detail.changeTracking.sourceVersionLabel} />
            <DetailItem label="技能组/等级/时段校验" value={detail.changeTracking.alignmentCheckLabel} />
            <DetailItem label="下游影响校验" value={detail.changeTracking.downstreamImpactLabel} />
            <DetailItem label="失败边界" value={detail.changeTracking.failureBoundaryLabel} />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {detail.changeTracking.actionShells.map((action) => (
              <Card key={action.label} className="border-dashed">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{action.label}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <p className="text-sm text-muted-foreground">{action.detail}</p>
                  <Button size="sm" variant="outline" disabled={action.isDisabled}>
                    {action.disabledLabel}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 md:grid-cols-2">
        <BoundaryItem
          icon={<Lock className="size-4 text-muted-foreground" />}
          title="不伪造预测明细"
          detail="当前列表 API 只提供批次级摘要，详情页不构造技能组、等级或 0.5h 明细行。"
        />
        <BoundaryItem
          icon={<FileClock className="size-4 text-muted-foreground" />}
          title={detail.changeBoundaryLabel}
          detail="IM104 只展示变更追踪边界安全壳，不直接接真实预测变更写入。"
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
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{detail}</CardContent>
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
