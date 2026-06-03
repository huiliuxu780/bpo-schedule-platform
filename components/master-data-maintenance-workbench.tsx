import Link from "next/link"
import type * as React from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Database,
  FileClock,
  GitBranch,
  Link2,
  Lock,
  ShieldCheck,
} from "lucide-react"

import {
  type MasterDataEntityDetailSummary,
  type MasterDataMaintenanceTone,
  summarizeMasterDataMaintenanceWorkbench,
} from "@/components/master-data-maintenance-model"
import type { ImportBatchListRow } from "@/components/import-center-model"
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

type MasterDataMaintenanceWorkbenchProps = {
  batches: ImportBatchListRow[]
  error: string | null
}

export function MasterDataMaintenanceWorkbench({
  batches,
  error,
}: MasterDataMaintenanceWorkbenchProps) {
  const summary = summarizeMasterDataMaintenanceWorkbench(batches)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">主数据维护</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              按坐席、职场、供应商、项目、技能和绑定关系查看当前维护范围、来源版本和阻塞原因。当前阶段只读，不提供新增、修改、冻结、审批、导出或批量动作。
            </p>
          </div>
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
              主数据来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="维护对象"
          value={summary.totalObjects.toLocaleString("zh-CN")}
          detail="坐席、职场、供应商、项目、技能、绑定关系"
          tone="default"
        />
        <MetricCard
          label="只读可查看"
          value={summary.readyObjects.toLocaleString("zh-CN")}
          detail="基于已应用主数据版本"
          tone={summary.readyObjects > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="仍有阻塞"
          value={summary.blockedObjects.toLocaleString("zh-CN")}
          detail={summary.title}
          tone={summary.blockedObjects > 0 ? "blocked" : "default"}
        />
        <MetricCard
          label="来源版本"
          value={summary.sourceVersionLabel}
          detail={`最新批次 ${summary.latestBatchLabel}`}
          tone="default"
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-muted-foreground" />
            当前维护边界
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="grid gap-1">
            <p className="font-medium text-foreground">{summary.title}</p>
            <p>{summary.detail}</p>
            <p>{summary.readonlyBoundary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={summary.versionWorkbenchHref}>
                查看业务版本
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            {summary.sourceBatchHref ? (
              <Button asChild size="sm" variant="ghost">
                <Link href={summary.sourceBatchHref}>查看来源批次</Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="size-4 text-muted-foreground" />
            主数据对象台账
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>对象</TableHead>
                <TableHead>维护范围</TableHead>
                <TableHead>引用影响</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">后续入口</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="align-top">
                    <div className="font-medium">{row.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {row.maintenanceBoundary}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[15rem] align-top text-sm text-muted-foreground">
                    {row.scopeLabel}
                  </TableCell>
                  <TableCell className="max-w-[14rem] align-top text-sm text-muted-foreground">
                    {row.referenceLabel}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="font-mono text-xs">{row.sourceVersionLabel}</div>
                    {row.sourceBatchHref ? (
                      <Button asChild size="sm" variant="link" className="h-auto px-0 py-1">
                        <Link href={row.sourceBatchHref}>{row.sourceBatchLabel}</Link>
                      </Button>
                    ) : (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {row.sourceBatchLabel}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="grid gap-1">
                      <Badge variant={row.tone === "blocked" ? "destructive" : "outline"}>
                        {row.statusLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {row.blockerSummary}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <div className="inline-grid justify-items-end gap-1 text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={row.detailHref}>
                          查看详情
                          <ArrowRight data-icon="inline-end" />
                        </Link>
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {row.nextActionLabel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        维护动作待 IM098
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-3 md:grid-cols-2">
        <BoundaryItem
          icon={<Lock className="size-4 text-muted-foreground" />}
          title="当前不开放写入"
          detail="新增、编辑、冻结、有效期调整和绑定维护都不在 IM096 范围内，避免把 CRUD、权限和审批提前混进来。"
        />
        <BoundaryItem
          icon={<FileClock className="size-4 text-muted-foreground" />}
          title="后续顺序"
          detail="IM097 补实体详情和引用影响；IM098 再讨论受控维护动作、引用校验和必要确认。"
        />
      </section>
    </main>
  )
}

export function MasterDataMaintenanceEntityDetail({
  summary,
  error,
}: {
  summary: MasterDataEntityDetailSummary
  error: string | null
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <Button asChild size="sm" variant="ghost" className="w-fit px-0">
            <Link href="/master-data">
              <ArrowLeft data-icon="inline-start" />
              返回主数据维护
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-normal">
              {summary.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {summary.detail}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {formatToneLabel(summary.tone)}
          </Badge>
          <Badge variant="secondary">只读详情</Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              主数据详情来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="维护对象"
          value={summary.entity.label}
          detail={summary.entity.scopeLabel}
          tone="default"
        />
        <MetricCard
          label="来源版本"
          value={summary.sourceVersionLabel}
          detail={`来源批次 ${summary.sourceBatchLabel}`}
          tone="default"
        />
        <MetricCard
          label="有效期"
          value={summary.effectivePeriodLabel}
          detail="没有明细时保持空态"
          tone="default"
        />
        <MetricCard
          label="冻结状态"
          value={summary.freezeStatusLabel}
          detail="不伪造实体级状态"
          tone={summary.tone === "blocked" ? "blocked" : "default"}
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="size-4 text-muted-foreground" />
            来源与维护边界
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="grid gap-1">
            <p>
              <span className="font-medium text-foreground">维护范围：</span>
              {summary.entity.maintenanceBoundary}
            </p>
            <p>
              <span className="font-medium text-foreground">引用范围：</span>
              {summary.entity.referenceLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.sourceVersionHref ? (
              <Button asChild size="sm" variant="outline">
                <Link href={summary.sourceVersionHref}>
                  查看业务版本
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            ) : null}
            {summary.sourceBatchHref ? (
              <Button asChild size="sm" variant="ghost">
                <Link href={summary.sourceBatchHref}>查看来源批次</Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="size-4 text-muted-foreground" />
            引用影响摘要
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>引用类型</TableHead>
                <TableHead>来源范围</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.referenceImpacts.map((impact) => (
                <TableRow key={impact.key}>
                  <TableCell className="align-top font-medium">
                    {impact.label}
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    {impact.sourceLabel}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant={impact.tone === "blocked" ? "destructive" : "outline"}>
                      {impact.countLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xl align-top text-sm text-muted-foreground">
                    {impact.detail}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
  icon: React.ReactNode
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

function formatToneLabel(tone: MasterDataMaintenanceTone) {
  if (tone === "ready") {
    return "已形成来源版本"
  }

  if (tone === "blocked") {
    return "来源阻塞"
  }

  return "等待来源"
}
