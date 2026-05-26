import Link from "next/link"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
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
  dataQualitySeverityLabel,
  dataQualitySourceLabels,
  fallbackDataQualityIssues,
} from "@/lib/data-quality"
import {
  fallbackImportBatches,
  getImportedBatchById,
  getImportBatchQualityIssues,
  importBatchStatusLabel,
  summarizeImportBatchFailureImpacts,
  summarizeImportBatchFailureReasons,
} from "@/lib/import-batch-history"

type PageProps = {
  params: Promise<{ batchId: string }>
}

export function generateStaticParams() {
  return fallbackImportBatches.map((batch) => ({
    batchId: batch.id,
  }))
}

export default async function ImportBatchDetailPage({ params }: PageProps) {
  const { batchId } = await params
  const batch = await getImportedBatchById(batchId)

  if (!batch) {
    notFound()
  }

  const qualityIssues = getImportBatchQualityIssues(batch.id, fallbackDataQualityIssues)
  const fallbackFailureImpactSummary = summarizeImportBatchFailureImpacts(batch.id)
  const failureReasonSummary = summarizeImportBatchFailureReasons(batch)
  const failureImpactItems =
    batch.failureImpacts.length > 0 ? batch.failureImpacts : fallbackFailureImpactSummary.items
  const totalAffectedRows =
    failureImpactItems.length > 0
      ? failureImpactItems.reduce((total, item) => total + item.affectedRows, 0)
      : fallbackFailureImpactSummary.totalAffectedRows

  return (
    <AppShell title={batch.id} searchPlaceholder="搜索批次字段">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/import-batches">导入批次</Link> / {batch.id}
            </div>
            <h1 className="text-lg font-semibold">{batch.templateName}</h1>
            <p className="text-sm text-muted-foreground">
              展示上传结果、质量问题和影响对象。
            </p>
          </div>
          <Badge variant={batch.status === "failed" ? "destructive" : "secondary"}>
            {importBatchStatusLabel(batch.status)}
          </Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="总行数" value={`${batch.totalRows}`} description={batch.sourceFile} />
          <Metric title="成功行" value={`${batch.successRows}`} description="处理结果" />
          <Metric title="失败行" value={`${batch.failedRows}`} description="仅追溯展示" />
          <Metric title="警告行" value={`${batch.warningRows}`} description="需要人工查看" />
        </section>

        {batch.failureRows.length > 0 ? (
          <section className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>失败原因汇总</CardTitle>
                <CardDescription>
                  按字段和错误码聚合失败行，辅助判断修正顺序。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Detail
                    label="原因数"
                    value={`${failureReasonSummary.totalReasonCount}`}
                  />
                  <Detail
                    label="失败行"
                    value={`${failureReasonSummary.totalFailedRows}`}
                  />
                  <Detail
                    label="首要字段"
                    value={failureReasonSummary.topReason?.fieldName ?? "无"}
                  />
                  <Detail
                    label="首要错误码"
                    value={failureReasonSummary.topReason?.errorCode ?? "无"}
                  />
                </div>

                <div className="grid gap-3">
                  {failureReasonSummary.items.map((reason) => (
                    <div key={reason.id} className="rounded-lg border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-xs text-muted-foreground">
                            {reason.fieldName} / {reason.errorCode}
                          </div>
                          <div className="mt-1 text-sm font-medium">
                            {reason.errorMessage}
                          </div>
                        </div>
                        <Badge variant="secondary">失败 {reason.failedRows} 行</Badge>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-[8rem_1fr]">
                        <span>代表行：{reason.representativeRowNumber}</span>
                        <span>
                          代表原值：{reason.representativeRawValue || "空值"}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {reason.affectedObjects.map((object) => (
                          <Badge key={object} variant="outline">
                            {object}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        修正提示：{reason.correctionHint}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>失败行明细</CardTitle>
                <CardDescription>
                  按行号、字段、错误码和原值定位需要修正的数据。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {batch.failureRows.map((row) => (
                  <div
                    key={`${row.failedRowNumber}-${row.fieldName}-${row.errorCode}`}
                    className="grid gap-2 rounded-lg border p-3 text-sm md:grid-cols-[6rem_1fr_1fr_2fr]"
                  >
                    <div>
                      <div className="text-xs text-muted-foreground">行号</div>
                      <div className="font-medium">{row.failedRowNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">字段</div>
                      <div className="font-mono text-xs">{row.fieldName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">错误码</div>
                      <div className="font-mono text-xs">{row.errorCode}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">说明</div>
                      <div className="text-muted-foreground">
                        {row.errorMessage}
                        {row.rawValue ? ` / 原值：${row.rawValue}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>影响对象</CardTitle>
              <CardDescription>该批次可能影响的业务对象。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {batch.affectedObjects.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>错误与质量问题</CardTitle>
              <CardDescription>可从批次直接进入相关数据质量问题。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">错误码</div>
                <div className="mt-1">{batch.errorCodes.length > 0 ? batch.errorCodes.join(", ") : "无"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">数据质量问题</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {qualityIssues.length > 0
                    ? qualityIssues.map((issue) => (
                        <Button
                          key={issue.id}
                          asChild
                          size="sm"
                          variant="outline"
                        >
                          <Link href={`/data-quality/${issue.id}`}>
                            {issue.id} {issue.title}
                          </Link>
                        </Button>
                      ))
                    : "无"}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>相关质量问题</CardTitle>
              <CardDescription>
                展示来源模板、错误码、字段和可下钻的问题详情。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {qualityIssues.length > 0 ? (
                qualityIssues.map((issue) => (
                  <div key={issue.id} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{issue.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {issue.sourceTemplateName} / {issue.errorCode}
                        </div>
                      </div>
                      <Badge variant={issue.severity === "high" ? "destructive" : "secondary"}>
                        {dataQualitySeverityLabel(issue.severity)}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <span>{dataQualitySourceLabels[issue.source]}</span>
                      <span>{issue.sourceField}</span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/data-quality/${issue.id}`}>查看问题</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">当前批次未关联质量问题。</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>失败行业务影响</CardTitle>
              <CardDescription>
                将失败行折算到受影响对象，辅助判断是否影响当天履约。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Detail label="影响行数" value={`${totalAffectedRows}`} />
                <Detail label="影响项" value={`${failureImpactItems.length}`} />
              </div>
              {failureImpactItems.length > 0 ? (
                failureImpactItems.map((item, index) => (
                  <div
                    key={`${item.relatedIssueIds.join("-")}-${index}`}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      {item.affectedObjects.map((object) => (
                        <Badge key={object} variant="secondary">
                          {object}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {item.businessImpact}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      关联问题：{item.relatedIssueIds.join(", ")} / 影响 {item.affectedRows} 行
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">当前批次没有失败行业务影响。</p>
              )}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>批次说明</CardTitle>
            <CardDescription>记录批次来源、错误概况和处理提示。</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {batch.note}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium tabular-nums">{value}</div>
    </div>
  )
}

function Metric({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
