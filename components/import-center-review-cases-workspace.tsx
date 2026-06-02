import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CircleSlash,
  ClipboardList,
  Filter,
  RotateCcw,
  UserRound,
} from "lucide-react"

import {
  type ImportReviewCaseRecord,
  type ImportReviewCasesWorkspaceFilters,
  buildImportReviewCaseDetailWorkspaceHref,
  filterImportReviewCases,
  summarizeImportReviewCasesWorkspace,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ImportCenterReviewCasesWorkspaceProps = {
  cases: ImportReviewCaseRecord[]
  filters: ImportReviewCasesWorkspaceFilters
  error: string | null
}

export function ImportCenterReviewCasesWorkspace({
  cases,
  filters,
  error,
}: ImportCenterReviewCasesWorkspaceProps) {
  const filteredCases = filterImportReviewCases(cases, filters)
  const summary = summarizeImportReviewCasesWorkspace({
    cases,
    filters,
    error,
  })

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <ReviewCasesHeader filters={filters} summary={summary} />
      <ReviewCaseSummaryCards summary={summary} />
      <ReviewCaseFilterCard filters={filters} />

      <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <ReviewCaseGroupingPanel summary={summary} />
        <ReviewCaseTable cases={filteredCases} error={error} />
      </section>
    </main>
  )
}

function ReviewCasesHeader({
  filters,
  summary,
}: {
  filters: ImportReviewCasesWorkspaceFilters
  summary: ReturnType<typeof summarizeImportReviewCasesWorkspace>
}) {
  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="grid gap-2">
        <Button asChild size="sm" variant="ghost" className="w-fit px-0">
          <Link href="/data-quality">
            <ArrowLeft data-icon="inline-start" />
            返回数据质量
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold tracking-normal">复核案例工作台</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            {summary.detail}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
          {formatWorkspaceTone(summary.tone)}
        </Badge>
        {filters.businessDate ? (
          <Badge variant="secondary">业务日 {filters.businessDate}</Badge>
        ) : (
          <Badge variant="outline">全部业务日</Badge>
        )}
        {filters.query ? (
          <Badge variant="secondary">焦点 {filters.query}</Badge>
        ) : null}
      </div>
    </section>
  )
}

function ReviewCaseSummaryCards({
  summary,
}: {
  summary: ReturnType<typeof summarizeImportReviewCasesWorkspace>
}) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="复核案例"
        value={summary.totalCount.toLocaleString("zh-CN")}
        detail={summary.title}
        tone="default"
      />
      <MetricCard
        label="未关闭"
        value={summary.openCount.toLocaleString("zh-CN")}
        detail={`已关闭 ${summary.closedCount.toLocaleString("zh-CN")} 个`}
        tone={summary.openCount > 0 ? "blocked" : "done"}
      />
      <MetricCard
        label="高风险未关闭"
        value={summary.highRiskOpenCount.toLocaleString("zh-CN")}
        detail="critical / high"
        tone={summary.highRiskOpenCount > 0 ? "blocked" : "default"}
      />
      <MetricCard
        label="Owner"
        value={summary.ownerGroups.length.toLocaleString("zh-CN")}
        detail={summary.ownerGroups[0]?.ownerId ?? "暂无责任人"}
        tone="default"
      />
    </section>
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
  tone: "default" | "blocked" | "done"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
          <Badge
            variant={
              tone === "blocked" ? "destructive" : tone === "done" ? "secondary" : "outline"
            }
          >
            {tone === "blocked" ? "需处理" : tone === "done" ? "已清理" : "只读"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-normal">{value}</div>
        <p className="mt-1 truncate text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function ReviewCaseFilterCard({
  filters,
}: {
  filters: ImportReviewCasesWorkspaceFilters
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="size-4 text-muted-foreground" />
              筛选复核案例
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              按业务日、owner、状态、严重度和来源定位案例；从质量问题进入时，关键词作为只读焦点保留。
            </p>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/data-quality/review-cases">
              <RotateCcw data-icon="inline-start" />
              重置
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form
          action="/data-quality/review-cases"
          className="grid gap-3 md:grid-cols-[minmax(140px,1fr)_minmax(140px,1fr)_repeat(3,minmax(120px,160px))_auto]"
        >
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">业务日</span>
            <Input
              name="businessDate"
              defaultValue={filters.businessDate ?? ""}
              placeholder="2026-05-11"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Owner</span>
            <Input
              name="ownerId"
              defaultValue={filters.ownerId ?? ""}
              placeholder="OWNER-A"
            />
          </label>
          <FilterSelect
            label="状态"
            name="status"
            value={filters.status ?? "all"}
            options={[
              ["all", "全部"],
              ["open", "未关闭"],
              ["closed", "已关闭"],
            ]}
          />
          <FilterSelect
            label="严重度"
            name="severity"
            value={filters.severity ?? "all"}
            options={[
              ["all", "全部"],
              ["critical", "严重"],
              ["high", "高"],
              ["medium", "中"],
              ["low", "低"],
            ]}
          />
          <FilterSelect
            label="来源"
            name="sourceResultType"
            value={filters.sourceResultType ?? "all"}
            options={[
              ["all", "全部"],
              ["forecast_schedule", "预测排班"],
              ["schedule_actual", "排班实际"],
            ]}
          />
          <label className="grid gap-1.5 text-sm md:col-span-2 xl:col-span-1">
            <span className="font-medium">关键词</span>
            <Input
              name="query"
              defaultValue={filters.query ?? ""}
              placeholder="案例、来源、owner"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" size="sm">
              筛选
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ReviewCaseGroupingPanel({
  summary,
}: {
  summary: ReturnType<typeof summarizeImportReviewCasesWorkspace>
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserRound className="size-4 text-muted-foreground" />
          分组情况
        </CardTitle>
        <p className="text-sm text-muted-foreground">{summary.nextAction}</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <GroupList title="Owner 负载" groups={summary.ownerGroups} />
        <GroupList title="状态拆分" groups={summary.statusGroups} />
        <GroupList title="严重度拆分" groups={summary.severityGroups} />
        <GroupList title="来源拆分" groups={summary.sourceGroups} />
      </CardContent>
    </Card>
  )
}

function GroupList({
  title,
  groups,
}: {
  title: string
  groups: { key: string; label: string; count: number; openCount: number }[]
}) {
  return (
    <section className="grid gap-2">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      {groups.length === 0 ? (
        <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          暂无分组
        </div>
      ) : (
        <div className="grid gap-2">
          {groups.slice(0, 5).map((group) => (
            <div
              key={group.key}
              className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 p-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{group.label}</div>
                <div className="text-xs text-muted-foreground">
                  未关闭 {group.openCount.toLocaleString("zh-CN")} 个
                </div>
              </div>
              <Badge variant="outline">{group.count.toLocaleString("zh-CN")}</Badge>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function ReviewCaseTable({
  cases,
  error,
}: {
  cases: ImportReviewCaseRecord[]
  error: string | null
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="size-4 text-muted-foreground" />
            复核案例列表
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            案例详情以只读 API 为入口；补证据和关闭动作不在本页提供。
          </p>
        </div>
        {error ? <Badge variant="destructive">读取失败</Badge> : null}
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <EmptyState title="复核案例读取失败" detail={error} />
        ) : cases.length === 0 ? (
          <EmptyState title="暂无匹配复核案例" detail="调整筛选条件后重新查看。" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">案例</TableHead>
                  <TableHead>级别</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="min-w-[160px]">来源</TableHead>
                  <TableHead className="min-w-[220px]">证据缺口</TableHead>
                  <TableHead className="min-w-[220px]">下一步</TableHead>
                  <TableHead className="w-20 text-right">详情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((reviewCase) => (
                  <TableRow key={reviewCase.case_id}>
                    <TableCell>
                      <div className="grid gap-1">
                        <span className="font-mono text-xs font-medium">
                          {reviewCase.case_id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {reviewCase.business_date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          isHighRiskSeverity(reviewCase.severity)
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {formatSeverity(reviewCase.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={reviewCase.status === "closed" ? "secondary" : "outline"}
                      >
                        {formatStatus(reviewCase.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {reviewCase.owner_id}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {formatSource(reviewCase)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatEvidenceGap(reviewCase)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatNextAction(reviewCase)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="icon-sm" variant="ghost" aria-label="查看复核详情">
                        <Link href={buildImportReviewCaseDetailWorkspaceHref(reviewCase.case_id)}>
                          <ArrowRight />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FilterSelect({
  label,
  name,
  value,
  options,
}: {
  label: string
  name: string
  value: string
  options: [string, string][]
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  )
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="grid min-h-80 place-items-center p-6 text-center">
      <div className="grid max-w-md gap-2">
        <CircleSlash className="mx-auto size-5 text-muted-foreground" />
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{detail}</div>
      </div>
    </div>
  )
}

function formatWorkspaceTone(
  tone: ReturnType<typeof summarizeImportReviewCasesWorkspace>["tone"]
): string {
  if (tone === "blocked") {
    return "高风险"
  }

  if (tone === "warning") {
    return "需复核"
  }

  if (tone === "ready") {
    return "已清理"
  }

  return "暂无案例"
}

function formatStatus(status: string): string {
  if (status === "closed") {
    return "已关闭"
  }

  if (status === "open") {
    return "未关闭"
  }

  return status
}

function formatSeverity(severity: string): string {
  if (severity === "critical") {
    return "严重"
  }

  if (severity === "high") {
    return "高"
  }

  if (severity === "medium") {
    return "中"
  }

  if (severity === "low") {
    return "低"
  }

  return severity
}

function formatSource(reviewCase: ImportReviewCaseRecord): string {
  const source =
    reviewCase.source_result_type === "forecast_schedule" ? "预测排班" : "排班实际"

  return `${source} #${reviewCase.source_result_id}`
}

function formatEvidenceGap(reviewCase: ImportReviewCaseRecord): string {
  if (reviewCase.status === "closed") {
    return "已关闭案例，仅回看证据。"
  }

  if (reviewCase.source_result_type === "schedule_actual") {
    return "登录/状态明细、排班版本和质量修正记录。"
  }

  return "预测版本、排班版本和质量修正记录。"
}

function formatNextAction(reviewCase: ImportReviewCaseRecord): string {
  if (reviewCase.status === "closed") {
    return "回看关闭依据，不在本页重新打开。"
  }

  return `owner ${reviewCase.owner_id} 先补齐证据，再进入受控关闭流程。`
}

function isHighRiskSeverity(severity: string): boolean {
  return severity === "critical" || severity === "high"
}
