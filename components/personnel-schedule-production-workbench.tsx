import Link from "next/link"
import type { ReactNode } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  FileClock,
  ListChecks,
  Lock,
  Table2,
  Users,
} from "lucide-react"

import type { ImportBatchListRow } from "@/components/import-center-model"
import {
  type PersonnelScheduleProductionTone,
  summarizePersonnelScheduleProductionDetail,
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
              当前只读展示来源批次、业务版本、应用状态和展开状态；版本详情已可查看，发布/冻结边界待 IM101。
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
          detail="当前已补单版本详情和 0.5h 展开结果；IM101 只讨论发布/冻结安全壳，不直接接真实写入。"
        />
      </section>
    </main>
  )
}

export function PersonnelScheduleProductionDetail({
  batches,
  batchId,
  error,
}: {
  batches: ImportBatchListRow[]
  batchId: string
  error: string | null
}) {
  const detail = summarizePersonnelScheduleProductionDetail(batches, batchId)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2">
            <Button asChild size="sm" variant="ghost">
              <Link href={detail.workbenchHref}>
                <ArrowLeft data-icon="inline-start" />
                返回排班生产
              </Link>
            </Button>
          </div>
          <h1 className="text-xl font-semibold tracking-normal">
            排班版本详情
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            查看单个人员排班来源批次对应的业务版本、班次引用口径、人员范围说明和 0.5h 展开结果。本页只读，不发布、不冻结、不触发自动排班。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={detail.tone === "blocked" ? "destructive" : "outline"}>
            {detail.tone === "ready" ? "展开已形成" : "详情仍阻塞"}
          </Badge>
          <Badge variant="secondary">只读详情</Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              排班详情读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="来源批次"
          value={detail.batchId}
          detail={detail.fileName}
          tone="default"
        />
        <MetricCard
          label="业务版本"
          value={detail.versionLabel}
          detail={detail.businessDateLabel}
          tone={detail.versionLabel.includes("未找到") ? "blocked" : "default"}
        />
        <MetricCard
          label="应用状态"
          value={detail.applicationLabel}
          detail={detail.sourceRowLabel}
          tone={detail.applicationLabel === "已应用" ? "ready" : "blocked"}
        />
        <MetricCard
          label="0.5h 展开"
          value={detail.appliedRecordCountLabel}
          detail={detail.halfHourResultLabel}
          tone={detail.tone === "ready" ? "ready" : "blocked"}
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-4 text-muted-foreground" />
            {detail.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <p>{detail.detail}</p>
          <div className="grid gap-3 md:grid-cols-3">
            <DetailItem label="业务日范围" value={detail.businessDateLabel} />
            <DetailItem label="上传时间" value={detail.uploadedAtLabel} />
            <DetailItem label="阻塞原因" value={detail.blockerSummary} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={detail.sourceBatchHref}>
                查看来源批次
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/data-quality/versions?domain=personnel_schedule">
                查看业务版本台账
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 lg:grid-cols-3">
        <DetailCard
          icon={<FileClock className="size-4 text-muted-foreground" />}
          title="班次引用"
          value={detail.shiftReferenceLabel}
        />
        <DetailCard
          icon={<Users className="size-4 text-muted-foreground" />}
          title="人员范围"
          value={detail.personScopeLabel}
        />
        <DetailCard
          icon={<Table2 className="size-4 text-muted-foreground" />}
          title="0.5h 展开结果"
          value={detail.halfHourResultLabel}
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="size-4 text-muted-foreground" />
            当前不伪造明细
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          当前列表 API 只提供来源批次、版本和应用记录数。本页只展示这些已确认信息；人员名单、班次明细和逐 0.5h 明细待后续版本 API 暴露后再呈现。
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="size-4 text-muted-foreground" />
            {detail.actionShellTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            {detail.actionShellDetail}
          </p>
          <div className="grid gap-3 lg:grid-cols-3">
            {detail.actionShells.map((action) => (
              <Card key={action.actionKey}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{action.actionLabel}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <DetailItem
                      label="来源版本"
                      value={action.sourceVersionLabel}
                    />
                    <DetailItem
                      label="展开校验"
                      value={action.expansionGateLabel}
                    />
                    <DetailItem
                      label="引用校验"
                      value={action.referenceGateLabel}
                    />
                    <DetailItem
                      label="失败边界"
                      value={action.failureBoundaryLabel}
                    />
                  </div>
                  <Button disabled size="sm" variant="outline">
                    {action.disabledLabel}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function DetailCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode
  title: string
  value: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{value}</p>
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
