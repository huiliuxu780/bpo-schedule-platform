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
  type ImportReviewCaseDetailResponse,
  buildImportReviewCaseDetailApiUrl,
  summarizeImportReviewCaseDetail,
  summarizeImportReviewCaseEvidenceChain,
} from "@/components/import-center-model"
import { ImportCenterReviewCaseClosurePanel } from "@/components/import-center-review-case-closure-panel"
import { ImportCenterReviewCaseConclusionPanel } from "@/components/import-center-review-case-conclusion-panel"
import { ImportCenterReviewCaseEvidencePanel } from "@/components/import-center-review-case-evidence-panel"
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

type ImportCenterReviewCaseDetailWorkspaceProps = {
  caseId: string
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}

export function ImportCenterReviewCaseDetailWorkspace({
  caseId,
  detail,
  error,
}: ImportCenterReviewCaseDetailWorkspaceProps) {
  const summary = summarizeImportReviewCaseDetail({ detail, error })
  const evidenceChain = summarizeImportReviewCaseEvidenceChain({ detail, error })

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

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="来源结果" value={summary.sourceLabel} detail="只读来源线索" />
        <MetricCard label="Owner" value={summary.ownerLabel} detail="当前责任人" />
        <MetricCard label="证据状态" value={summary.evidenceLabel} detail="证据与结论" />
        <MetricCard label="质量焦点" value={summary.qualityFocus} detail="关闭前核对项" />
      </section>

      <section className="grid gap-4">
        <SourceResultContextCard
          dimensions={summary.sourceResultDimensions}
          metrics={summary.sourceResultMetrics}
        />
        <SourceTraceCard
          run={summary.sourceTraceRun}
          href={summary.sourceTraceHref}
          versions={summary.sourceTraceVersions}
        />

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="size-4 text-muted-foreground" />
                证据缺口
              </CardTitle>
              <CardDescription className="mt-1">{summary.evidenceGap}</CardDescription>
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

        <EvidenceChainCard chain={evidenceChain} />
        <ImportCenterReviewCaseEvidencePanel
          caseId={caseId}
          detail={detail}
          error={error}
        />
        <ImportCenterReviewCaseConclusionPanel
          caseId={caseId}
          detail={detail}
          error={error}
        />
        <ImportCenterReviewCaseClosurePanel
          caseId={caseId}
          detail={detail}
          error={error}
        />
        <EvidenceTable detail={detail} />
        <ConclusionTable detail={detail} />
        <ProcessingBoundaryCard caseId={caseId} />
      </section>
    </main>
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
          本页只允许对当前案例执行受控关闭写入，不提供补证据、审批、导出或批量处理。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <div className="rounded-md border bg-muted/30 p-3">
          关闭写入复用现有本地 API；证据补录、结论新增、审批和批量处理仍需要单独受控任务。
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
