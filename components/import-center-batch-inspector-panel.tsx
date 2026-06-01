import Link from "next/link"
import { CircleSlash } from "lucide-react"

import {
  type ImportApplyReadinessResponse,
  type ImportBatchListRow,
  type ImportDownstreamResultNavigation,
  type ImportReadinessIssueGroup,
  buildImportApiUrl,
  formatImportFileType,
  formatImportProcessingStatus,
  formatImportReadinessStatus,
  summarizeImportApplyActionGuidance,
  summarizeImportApplicationVisibility,
  summarizeImportBatchReviewGuide,
  summarizeImportDownstreamResultNavigation,
  summarizeImportReadinessIssueGroups,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ImportCenterBatchInspectorPanelProps = {
  selectedBatch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  readinessError: string | null
  mode?: "summary" | "detail"
  detailHref?: string | null
}

export function ImportCenterBatchInspectorPanel({
  selectedBatch,
  readiness,
  readinessError,
  mode = "detail",
  detailHref = null,
}: ImportCenterBatchInspectorPanelProps) {
  return (
    <Card id="import-apply-readiness" className="scroll-mt-16">
      <CardHeader>
        <CardTitle className="text-base">状态检查</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          {selectedBatch
            ? `${formatImportFileType(selectedBatch.file_type)} · ${formatImportProcessingStatus(selectedBatch.processing_status)}`
            : "暂无批次"}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!selectedBatch ? (
          <EmptyState title="暂无选中批次" detail="先在左侧工作台选择导入批次。" compact />
        ) : mode === "summary" ? (
          <>
            <BatchReviewGuideCard
              batch={selectedBatch}
              readiness={readiness}
              detailHref={detailHref}
            />
            <ApplicationVisibilityPanel batch={selectedBatch} readiness={readiness} />
            <DetailEntryPanel detailHref={detailHref} readinessError={readinessError} />
          </>
        ) : (
          <>
            <BatchReviewGuideCard batch={selectedBatch} readiness={readiness} />
            <ApplyActionGuidance readiness={readiness} readinessError={readinessError} />
            <ReadinessIssueGroups
              readiness={readiness}
              readinessError={readinessError}
            />
            <ApplicationVisibilityPanel batch={selectedBatch} readiness={readiness} />
            <DownstreamNavigationPanel batch={selectedBatch} readiness={readiness} />
            {readinessError ? (
              <EmptyState title="准备度读取失败" detail={readinessError} compact />
            ) : readiness ? (
              <ReadinessDetail readiness={readiness} />
            ) : (
              <EmptyState title="暂无准备度" detail="未返回 readiness 结果。" compact />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function BatchReviewGuideCard({
  batch,
  readiness,
  detailHref = null,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
  detailHref?: string | null
}) {
  const guide = summarizeImportBatchReviewGuide({ batch, readiness })

  return (
    <section
      className={cn(
        "grid gap-3 rounded-md border border-l-4 p-3 text-sm",
        guide.tone === "blocked"
          ? "border-l-destructive"
          : guide.tone === "ready"
            ? "border-l-primary"
            : guide.tone === "done"
              ? "border-l-primary"
              : "border-l-muted-foreground"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">批次处理导览</div>
          <p className="mt-1 text-muted-foreground">
            {batch.batch_id} · {formatImportFileType(batch.file_type)}
          </p>
        </div>
        <Badge
          variant={
            guide.tone === "blocked"
              ? "destructive"
              : guide.tone === "done"
                ? "secondary"
                : "outline"
          }
        >
          {formatReviewGuideTone(guide.tone)}
        </Badge>
      </div>
      <div>
        <div className="font-medium">{guide.title}</div>
        <p className="mt-1 text-muted-foreground">{guide.detail}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant={guide.tone === "blocked" ? "outline" : "default"}>
          {detailHref ? (
            <Link href={detailHref}>查看和处理</Link>
          ) : (
            <a href="#import-detail-workspace">{guide.primaryActionLabel}</a>
          )}
        </Button>
        {detailHref ? null : (
          <Button asChild size="sm" variant="outline">
            <a href="#import-detail-workspace">查看批次处理</a>
          </Button>
        )}
      </div>
    </section>
  )
}

function DetailEntryPanel({
  detailHref,
  readinessError,
}: {
  detailHref: string | null
  readinessError: string | null
}) {
  return (
    <section className="grid gap-3 rounded-md border bg-muted/30 p-3 text-sm">
      <div>
        <div className="font-medium">具体情况查看和处理</div>
        <p className="mt-1 text-muted-foreground">
          批次明细、失败行修正、结果追踪和导入模板已放到单独批次处理页。
        </p>
      </div>
      {readinessError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-muted-foreground">
          准备度读取失败：{readinessError}
        </div>
      ) : null}
      {detailHref ? (
        <Button asChild size="sm">
          <Link href={detailHref}>进入批次处理页</Link>
        </Button>
      ) : (
        <Button size="sm" disabled>
          等待选择批次
        </Button>
      )}
    </section>
  )
}

function ApplyActionGuidance({
  readiness,
  readinessError,
}: {
  readiness: ImportApplyReadinessResponse | null
  readinessError: string | null
}) {
  const guidance = summarizeImportApplyActionGuidance(readiness, readinessError)

  return (
    <section
      className={cn(
        "grid gap-2 rounded-md border p-3 text-sm",
        guidance.tone === "blocked"
          ? "border-destructive/40 bg-destructive/10"
          : guidance.tone === "ready"
            ? "bg-muted/30"
            : "bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">应用前行动建议</span>
        <Badge
          variant={
            guidance.tone === "blocked"
              ? "destructive"
              : guidance.tone === "ready"
                ? "secondary"
                : "outline"
          }
        >
          {formatGuidanceTone(guidance.tone)}
        </Badge>
      </div>
      <div className="font-medium">{guidance.title}</div>
      <p className="text-muted-foreground">{guidance.detail}</p>
      <p className="text-xs text-muted-foreground">{guidance.nextAction}</p>
    </section>
  )
}

function ApplicationVisibilityPanel({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}) {
  const visibility = summarizeImportApplicationVisibility({ batch, readiness })

  return (
    <section
      className={cn(
        "grid gap-3 rounded-md border p-3 text-sm",
        visibility.tone === "blocked"
          ? "border-destructive/40 bg-destructive/10"
          : visibility.tone === "ready"
            ? "bg-muted/30"
            : visibility.tone === "done"
              ? "bg-muted/40"
              : "bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">应用状态概览</span>
        <Badge
          variant={
            visibility.tone === "blocked"
              ? "destructive"
              : visibility.tone === "done"
                ? "secondary"
                : "outline"
          }
        >
          {visibility.statusLabel}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ApplicationMetric label="应用目标" value={visibility.targetLabel} />
        <ApplicationMetric label="已应用记录" value={visibility.appliedRecordLabel} />
        <ApplicationMetric
          label="导入版本"
          value={visibility.versionLabel}
          className="col-span-2"
        />
      </div>
      <div>
        <div className="font-medium">{visibility.title}</div>
        <p className="mt-1 text-muted-foreground">{visibility.detail}</p>
        <p className="mt-1 text-xs text-muted-foreground">{visibility.nextAction}</p>
      </div>
    </section>
  )
}

function DownstreamNavigationPanel({
  batch,
  readiness,
}: {
  batch: ImportBatchListRow
  readiness: ImportApplyReadinessResponse | null
}) {
  const navigation = summarizeImportDownstreamResultNavigation({ batch, readiness })

  return (
    <section
      className={cn(
        "grid gap-3 rounded-md border p-3 text-sm",
        navigation.tone === "blocked"
          ? "border-destructive/40 bg-destructive/10"
          : navigation.tone === "ready"
            ? "bg-muted/30"
            : navigation.tone === "done"
              ? "bg-muted/40"
              : "bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">下游结果导航</span>
        <Badge
          variant={
            navigation.tone === "blocked"
              ? "destructive"
              : navigation.tone === "done"
                ? "secondary"
                : "outline"
          }
        >
          {formatDownstreamNavigationTone(navigation.tone)}
        </Badge>
      </div>
      <div>
        <div className="font-medium">{navigation.title}</div>
        <p className="mt-1 text-muted-foreground">{navigation.detail}</p>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <ApplicationMetric label="结果线索" value={navigation.comparisonLabel} />
        <ApplicationMetric label="复核线索" value={navigation.reviewLabel} />
        <ApplicationMetric
          label="证据"
          value={navigation.evidenceLabel}
          className="md:col-span-2"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant={navigation.tone === "blocked" ? "outline" : "default"}>
          <Link href={formatDownstreamHref(navigation.primaryHref)}>
            {navigation.primaryActionLabel}
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={formatDownstreamHref(navigation.secondaryHref)}>
            {navigation.secondaryActionLabel}
          </Link>
        </Button>
      </div>
    </section>
  )
}

function ReadinessIssueGroups({
  readiness,
  readinessError,
}: {
  readiness: ImportApplyReadinessResponse | null
  readinessError: string | null
}) {
  const groups = summarizeImportReadinessIssueGroups(readiness, readinessError)

  return (
    <section className="grid gap-3 rounded-md border bg-muted/20 p-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-medium">准备度问题分组</div>
          <p className="mt-1 text-muted-foreground">
            先按问题类型处理阻塞，再回到准备度检查确认是否可复核。
          </p>
        </div>
        <Badge variant={groups.some((group) => group.tone === "blocked") ? "destructive" : "outline"}>
          {groups.length} 组
        </Badge>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {groups.map((group) => (
          <ReadinessIssueGroupCard key={group.key} group={group} />
        ))}
      </div>
    </section>
  )
}

function ReadinessIssueGroupCard({ group }: { group: ImportReadinessIssueGroup }) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-md border bg-background p-3",
        group.tone === "blocked" ? "border-destructive/40" : ""
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">{group.title}</div>
          <p className="mt-1 text-muted-foreground">{group.detail}</p>
        </div>
        <Badge
          variant={
            group.tone === "blocked"
              ? "destructive"
              : group.tone === "ready" || group.tone === "done"
                ? "secondary"
                : "outline"
          }
        >
          {formatIssueGroupTone(group)}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">数量 {group.count.toLocaleString("zh-CN")}</Badge>
        {group.evidence.map((item) => (
          <Badge key={item} variant="outline" className="font-mono">
            {item}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{group.nextAction}</p>
    </div>
  )
}

function ReadinessDetail({ readiness }: { readiness: ImportApplyReadinessResponse }) {
  const blockers = readiness.blockers.filter(
    (blocker) => blocker.code !== "IMPORT_BATCH_ALREADY_APPLIED"
  )

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={readiness.readiness_status === "ready" ? "secondary" : "destructive"}
        >
          {formatImportReadinessStatus(readiness.readiness_status)}
        </Badge>
        <Badge variant="outline">{readiness.application_target}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <Metric label="成功" value={readiness.success_rows} />
        <Metric label="失败" value={readiness.failed_rows} />
        <Metric label="版本" value={readiness.version_count} />
      </div>
      {blockers.length === 0 && readiness.row_blockers.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          没有阻塞项。
        </div>
      ) : null}
      {blockers.length > 0 ? (
        <div className="grid gap-2">
          <div className="text-sm font-medium">批次阻塞</div>
          {blockers.map((blocker) => (
            <div key={blocker.code} className="rounded-md border p-3 text-sm">
              <div className="font-mono text-xs text-muted-foreground">
                {blocker.code}
              </div>
              <div className="mt-1">{blocker.message}</div>
            </div>
          ))}
        </div>
      ) : null}
      {readiness.row_blockers.length > 0 ? (
        <div className="grid gap-2">
          <div className="text-sm font-medium">行级阻塞</div>
          <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
            {readiness.row_blockers.map((blocker) => (
              <div
                key={`${blocker.row_number}-${blocker.code}-${blocker.field_name ?? ""}`}
                className="rounded-md border p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">第 {blocker.row_number} 行</span>
                  {blocker.field_name ? (
                    <Badge variant="outline">{blocker.field_name}</Badge>
                  ) : null}
                </div>
                <div className="mt-1 text-muted-foreground">{blocker.message}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function ApplicationMetric({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("rounded-md border bg-background/60 p-2", className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate font-mono text-xs font-medium">{value}</div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold">{value}</div>
    </div>
  )
}

function EmptyState({
  title,
  detail,
  compact = false,
}: {
  title: string
  detail: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-center",
        compact ? "min-h-36" : "min-h-64"
      )}
    >
      <CircleSlash className="size-5 text-muted-foreground" />
      <div className="text-sm font-medium">{title}</div>
      <div className="max-w-md text-sm text-muted-foreground">{detail}</div>
    </div>
  )
}

function formatReviewGuideTone(
  tone: ReturnType<typeof summarizeImportBatchReviewGuide>["tone"]
): string {
  if (tone === "blocked") {
    return "需处理"
  }

  if (tone === "ready") {
    return "可复核"
  }

  if (tone === "done") {
    return "已完成"
  }

  if (tone === "warning") {
    return "需关注"
  }

  return "待判断"
}

function formatGuidanceTone(
  tone: ReturnType<typeof summarizeImportApplyActionGuidance>["tone"]
): string {
  if (tone === "ready") {
    return "可复核"
  }

  if (tone === "blocked") {
    return "需处理"
  }

  if (tone === "done") {
    return "已完成"
  }

  return "未知"
}

function formatIssueGroupTone(group: ImportReadinessIssueGroup): string {
  if (group.tone === "blocked") {
    return "需处理"
  }

  if (group.tone === "ready") {
    return "可复核"
  }

  if (group.tone === "done") {
    return "已完成"
  }

  return "未知"
}

function formatDownstreamHref(href: string): string {
  if (href.startsWith("/api/")) {
    return buildImportApiUrl(href)
  }

  return href
}

function formatDownstreamNavigationTone(
  tone: ImportDownstreamResultNavigation["tone"]
): string {
  if (tone === "blocked") {
    return "先处理"
  }

  if (tone === "ready") {
    return "待应用"
  }

  if (tone === "done") {
    return "可追踪"
  }

  return "待判断"
}
