import Link from "next/link"
import {
  ArrowLeft,
  ClipboardCheck,
  ClipboardList,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  ShieldAlert,
} from "lucide-react"

import {
  type ImportReviewCaseActionContinuationSummary,
  type ImportReviewCaseActionFeedbackSummary,
  type ImportReviewCaseActionRetrySummary,
  type ImportReviewCaseDetailResponse,
  type ImportReviewCaseProcessingStageSnapshot,
  type ImportReviewCaseRecord,
  type ImportReviewOwnerNavigationSummary,
  buildImportReviewCaseDetailApiUrl,
  summarizeImportReviewCaseActionDeck,
  summarizeImportReviewCaseActionContinuation,
  summarizeImportReviewCaseActionFeedback,
  summarizeImportReviewCaseActionRetry,
  summarizeImportReviewCaseDetail,
  summarizeImportReviewCaseEvidenceChain,
  summarizeImportReviewOwnerNavigation,
} from "@/components/import-center-model"
import { ImportCenterReviewCaseClosurePanel } from "@/components/import-center-review-case-closure-panel"
import { ImportCenterReviewCaseConclusionPanel } from "@/components/import-center-review-case-conclusion-panel"
import { ImportCenterReviewCaseEvidencePanel } from "@/components/import-center-review-case-evidence-panel"
import { ImportCenterReviewOwnerContext } from "@/components/import-center-review-owner-context"
import { ImportCenterReviewCaseProcessingTimeline } from "@/components/import-center-review-case-processing-timeline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ImportCenterReviewCaseDetailWorkspaceProps = {
  caseId: string
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
  ownerCases: ImportReviewCaseRecord[]
  ownerProcessingStages: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
  ownerContextError: string | null
  actionFeedback: ImportReviewCaseActionFeedbackParams
}

type ImportReviewCaseActionFeedbackParams = {
  evidence: string | null
  conclusion: string | null
  closure: string | null
}

export function ImportCenterReviewCaseDetailWorkspace({
  caseId,
  detail,
  error,
  ownerCases,
  ownerProcessingStages,
  ownerContextError,
  actionFeedback,
}: ImportCenterReviewCaseDetailWorkspaceProps) {
  const summary = summarizeImportReviewCaseDetail({ detail, error })
  const evidenceChain = summarizeImportReviewCaseEvidenceChain({ detail, error })
  const ownerNavigation = summarizeImportReviewOwnerNavigation({
    currentCase: detail?.case ?? null,
    cases: ownerCases,
    processingStages: ownerProcessingStages,
    error: ownerContextError,
  })

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <Button asChild size="sm" variant="ghost" className="w-fit px-0">
            <Link href={summary.listHref}>
              <ArrowLeft data-icon="inline-start" />
              返回复核案例
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-normal">复核案例详情</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {summary.title}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {formatDetailTone(summary.tone)}
          </Badge>
          <Badge variant="secondary">{caseId}</Badge>
        </div>
      </section>

      <Tabs defaultValue="overview" className="grid gap-4">
        <TabsList className="h-auto w-full justify-start overflow-x-auto md:w-fit">
          {summary.workspaceTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0 grid gap-4">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="来源结果"
              value={summary.sourceLabel}
              detail="只读来源线索"
            />
            <MetricCard label="Owner" value={summary.ownerLabel} detail="当前责任人" />
            <MetricCard
              label="证据状态"
              value={summary.evidenceLabel}
              detail="证据与结论"
            />
            <MetricCard
              label="质量焦点"
              value={summary.qualityFocus}
              detail="关闭前核对项"
            />
          </section>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="size-4 text-muted-foreground" />
                  证据缺口
                </CardTitle>
                <CardDescription className="mt-1">
                  {summary.evidenceGap}
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={summary.detailHref}>
                  查看详情 API
                  <ExternalLink data-icon="inline-end" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                {summary.nextAction}
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.evidence.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="source" className="mt-0 grid gap-4">
          <SourceResultContextCard
            dimensions={summary.sourceResultDimensions}
            metrics={summary.sourceResultMetrics}
          />
          <SourceTraceCard
            run={summary.sourceTraceRun}
            href={summary.sourceTraceHref}
            versions={summary.sourceTraceVersions}
          />
        </TabsContent>

        <TabsContent value="evidence" className="mt-0 grid gap-4">
          <EvidenceChainCard chain={evidenceChain} />
          <EvidenceTable detail={detail} />
          <ConclusionTable detail={detail} />
        </TabsContent>

        <TabsContent value="actions" className="mt-0 grid gap-4">
          <ImportCenterReviewCaseProcessingTimeline detail={detail} error={error} />
          <ReviewCaseActionDeck
            caseId={caseId}
            detail={detail}
            error={error}
            actionFeedback={actionFeedback}
            ownerNavigation={ownerNavigation}
          />
        </TabsContent>

        <TabsContent value="owner" className="mt-0">
          <ImportCenterReviewOwnerContext
            currentCase={detail?.case ?? null}
            cases={ownerCases}
            processingStages={ownerProcessingStages}
            error={ownerContextError}
          />
        </TabsContent>

        <TabsContent value="boundary" className="mt-0">
          <ProcessingBoundaryCard caseId={caseId} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function ReviewCaseActionDeck({
  caseId,
  detail,
  error,
  actionFeedback,
  ownerNavigation,
}: {
  caseId: string
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
  actionFeedback: ImportReviewCaseActionFeedbackParams
  ownerNavigation: ImportReviewOwnerNavigationSummary
}) {
  const deck = summarizeImportReviewCaseActionDeck({ detail, error })
  const feedback = summarizeImportReviewCaseActionFeedback(actionFeedback)
  const retry = summarizeImportReviewCaseActionRetry(feedback)
  const continuation = summarizeImportReviewCaseActionContinuation({
    feedback,
    navigation: ownerNavigation,
  })
  const primaryStep = deck.steps.find((step) => step.isPrimary) ?? deck.steps[0]
  const defaultActionTab = retry?.tabValue ?? primaryStep?.key ?? "evidence"

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardCheck className="size-4 text-muted-foreground" />
              {deck.title}
            </CardTitle>
            <CardDescription className="mt-1">{deck.nextAction}</CardDescription>
          </div>
          <Badge variant={deck.tone === "blocked" ? "destructive" : "outline"}>
            {deck.statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {feedback ? <ReviewCaseActionFeedbackNotice feedback={feedback} /> : null}
        {retry ? <ReviewCaseActionRetryPanel retry={retry} /> : null}
        {continuation ? (
          <ReviewCaseActionContinuationPanel continuation={continuation} />
        ) : null}
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="text-sm text-muted-foreground">当前推荐动作</div>
            <div className="mt-1 text-base font-semibold tracking-normal">
              {deck.primaryAction}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{deck.summary}</div>
          </div>
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="text-sm text-muted-foreground">主入口状态</div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant={primaryStep?.canSubmit ? "outline" : "secondary"}>
                {primaryStep?.statusLabel ?? deck.statusLabel}
              </Badge>
              {primaryStep?.canSubmit ? (
                <span className="text-sm text-muted-foreground">可提交</span>
              ) : (
                <span className="text-sm text-muted-foreground">需先满足阻塞条件</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {deck.steps.map((step) => (
            <div
              key={step.key}
              className="grid gap-2 rounded-md border bg-background p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium">{step.title}</div>
                <Badge variant={step.isPrimary ? "outline" : "secondary"}>
                  {step.isPrimary ? "当前" : step.statusLabel}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">{step.detail}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue={defaultActionTab} className="gap-3">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="evidence">补证据</TabsTrigger>
            <TabsTrigger value="conclusion">补结论</TabsTrigger>
            <TabsTrigger value="closure">关闭案例</TabsTrigger>
          </TabsList>
          <TabsContent value="evidence">
            <ImportCenterReviewCaseEvidencePanel
              caseId={caseId}
              detail={detail}
              error={error}
              embedded
            />
          </TabsContent>
          <TabsContent value="conclusion">
            <ImportCenterReviewCaseConclusionPanel
              caseId={caseId}
              detail={detail}
              error={error}
              embedded
            />
          </TabsContent>
          <TabsContent value="closure">
            <ImportCenterReviewCaseClosurePanel
              caseId={caseId}
              detail={detail}
              error={error}
              embedded
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ReviewCaseActionRetryPanel({
  retry,
}: {
  retry: ImportReviewCaseActionRetrySummary
}) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-medium">{retry.title}</div>
            <Badge variant="destructive">{retry.statusLabel}</Badge>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{retry.detail}</div>
        </div>
        <Badge variant="secondary">{retry.actionLabel}</Badge>
      </div>
    </div>
  )
}

function ReviewCaseActionContinuationPanel({
  continuation,
}: {
  continuation: ImportReviewCaseActionContinuationSummary
}) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-medium">{continuation.title}</div>
            <Badge variant={continuation.tone === "blocked" ? "destructive" : "outline"}>
              {continuation.statusLabel}
            </Badge>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {continuation.detail}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {continuation.primaryDetail}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="default">
            <Link href={continuation.primaryHref}>
              {continuation.primaryLabel}
              <ExternalLink data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={continuation.listHref}>{continuation.listLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ReviewCaseActionFeedbackNotice({
  feedback,
}: {
  feedback: ImportReviewCaseActionFeedbackSummary
}) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-medium">{feedback.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{feedback.detail}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{formatActionFeedbackKey(feedback.actionKey)}</Badge>
          <Badge variant={feedback.tone === "blocked" ? "destructive" : "outline"}>
            {feedback.statusLabel}
          </Badge>
        </div>
      </div>
    </div>
  )
}

function EvidenceChainCard({
  chain,
}: {
  chain: ReturnType<typeof summarizeImportReviewCaseEvidenceChain>
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="size-4 text-muted-foreground" />
              {chain.title}
            </CardTitle>
            <CardDescription className="mt-1">{chain.summary}</CardDescription>
          </div>
          <Badge variant={chain.tone === "blocked" ? "destructive" : "outline"}>
            {chain.statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-0">
        {chain.items.length === 0 ? (
          <EmptyPanel title="暂无链路记录" detail={chain.nextAction} />
        ) : (
          <>
            <div className="px-4 lg:px-6">
              <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                {chain.nextAction}
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[96px]">阶段</TableHead>
                    <TableHead className="min-w-[220px]">记录</TableHead>
                    <TableHead className="min-w-[210px]">时间</TableHead>
                    <TableHead className="min-w-[280px]">说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chain.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="secondary">{item.typeLabel}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="grid gap-1">
                          <div className="font-mono text-xs">{item.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.timestamp}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.detail}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ProcessingBoundaryCard({ caseId }: { caseId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardCheck className="size-4 text-muted-foreground" />
          处理边界
        </CardTitle>
        <CardDescription>
          本页只允许对当前案例执行受控证据补充、结论补充和关闭写入。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <div className="rounded-md border bg-muted/30 p-3">
          三个动作复用现有本地 API；审批、导出、权限和批量处理仍需要单独受控任务。
        </div>
        <div className="rounded-md border bg-muted/30 p-3">
          <div>当前详情来自</div>
          <div className="mt-1 break-all font-mono text-xs">
            {buildImportReviewCaseDetailApiUrl(caseId)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SourceTraceCard({
  run,
  href,
  versions,
}: {
  run: string
  href: string
  versions: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="size-4 text-muted-foreground" />
              来源链路
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              只读反查计算运行、版本和导入批次。
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={href}>
              查看运行详情
              <ExternalLink data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="rounded-md border bg-muted/30 p-3 text-sm">
          {run}
        </div>
        <div className="grid gap-2">
          {versions.map((version) => (
            <div
              key={version}
              className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
            >
              {version}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SourceResultContextCard({
  dimensions,
  metrics,
}: {
  dimensions: string[]
  metrics: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="size-4 text-muted-foreground" />
          来源结果明细
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          只读展示复核案例引用的对比结果上下文。
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2 md:grid-cols-2">
          <SourceResultGroup title="业务维度" items={dimensions} />
          <SourceResultGroup title="差异指标" items={metrics} />
        </div>
      </CardContent>
    </Card>
  )
}

function SourceResultGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="grid gap-2 rounded-md border bg-muted/30 p-3">
      <div className="text-sm font-medium">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
    </div>
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

function EvidenceTable({
  detail,
}: {
  detail: ImportReviewCaseDetailResponse | null
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4 text-muted-foreground" />
          证据记录
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!detail || detail.evidence.length === 0 ? (
          <EmptyPanel title="暂无证据记录" detail="当前案例还没有返回证据记录。" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">证据</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>提交人</TableHead>
                  <TableHead className="min-w-[220px]">说明</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.evidence.map((item) => (
                  <TableRow key={item.evidence_id}>
                    <TableCell className="font-mono text-xs">{item.evidence_id}</TableCell>
                    <TableCell>{item.evidence_type}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.submitted_by}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.note ?? item.evidence_uri}
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

function ConclusionTable({
  detail,
}: {
  detail: ImportReviewCaseDetailResponse | null
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="size-4 text-muted-foreground" />
          结论记录
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!detail || detail.conclusions.length === 0 ? (
          <EmptyPanel title="暂无结论记录" detail="当前案例还没有返回结论记录。" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">结论</TableHead>
                  <TableHead>风险</TableHead>
                  <TableHead>决策人</TableHead>
                  <TableHead className="min-w-[260px]">内容</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.conclusions.map((item) => (
                  <TableRow key={item.conclusion_id}>
                    <TableCell className="font-mono text-xs">
                      {item.conclusion_id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.risk_level}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.decided_by}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.conclusion_text}
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

function EmptyPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="grid min-h-32 place-items-center p-4 text-center">
      <div className="grid gap-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{detail}</div>
      </div>
    </div>
  )
}

function formatDetailTone(
  tone: ReturnType<typeof summarizeImportReviewCaseDetail>["tone"]
): string {
  if (tone === "blocked") {
    return "需处理"
  }

  if (tone === "warning") {
    return "需复核"
  }

  if (tone === "ready") {
    return "已关闭"
  }

  return "暂无详情"
}

function formatActionFeedbackKey(
  actionKey: ImportReviewCaseActionFeedbackSummary["actionKey"]
): string {
  if (actionKey === "closure") {
    return "关闭案例"
  }

  if (actionKey === "conclusion") {
    return "补结论"
  }

  return "补证据"
}
