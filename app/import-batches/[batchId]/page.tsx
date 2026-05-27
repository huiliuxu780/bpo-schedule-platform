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
  dataQualityStatusLabel,
  fallbackDataQualityIssues,
} from "@/lib/data-quality"
import {
  fallbackImportBatches,
  getImportedBatchById,
  getImportBatchQualityIssues,
  importBatchStatusLabel,
  summarizeImportBatchFailureImpacts,
  summarizeImportBatchFailureReasons,
  summarizeImportBatchCorrectionMaterials,
  summarizeImportBatchCorrectionReadiness,
  summarizeImportBatchQualityImpact,
  summarizeImportBatchReviewConclusion,
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
  const qualityImpactSummary = summarizeImportBatchQualityImpact(
    batch,
    fallbackDataQualityIssues
  )
  const correctionReadinessSummary = summarizeImportBatchCorrectionReadiness(
    batch,
    fallbackDataQualityIssues
  )
  const correctionMaterialSummary = summarizeImportBatchCorrectionMaterials(
    batch,
    fallbackDataQualityIssues
  )
  const reviewConclusionSummary = summarizeImportBatchReviewConclusion(
    batch,
    fallbackDataQualityIssues
  )
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

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="总行数" value={`${batch.totalRows}`} description={batch.sourceFile} />
          <Metric title="成功行" value={`${batch.successRows}`} description="处理结果" />
          <Metric title="失败行" value={`${batch.failedRows}`} description="仅追溯展示" />
          <Metric title="警告行" value={`${batch.warningRows}`} description="需要人工查看" />
          <Metric title="业务日期" value={batch.businessDateRange} description="成功行范围" />
        </section>

        {batch.localVersions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>导入版本</CardTitle>
              <CardDescription>
                成功行生成的版本记录，用于后续导入结果追溯。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {batch.localVersions.map((version) => (
                <div
                  key={version.versionId}
                  className="grid gap-3 rounded-lg border p-3 text-sm md:grid-cols-[1fr_9rem_10rem_10rem]"
                >
                  <div>
                    <div className="text-xs text-muted-foreground">版本号</div>
                    <div className="font-mono text-xs">{version.versionId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">成功行</div>
                    <div className="font-medium tabular-nums">{version.rowCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">业务日期</div>
                    <div className="text-muted-foreground">{version.businessDateRange}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">生成时间</div>
                    <div className="text-muted-foreground">{version.createdAt}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

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
                <CardTitle>质量影响聚合</CardTitle>
                <CardDescription>
                  将失败原因关联到数据质量问题，辅助判断查看顺序。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Detail
                    label="关联问题"
                    value={`${qualityImpactSummary.relatedIssueCount}`}
                  />
                  <Detail
                    label="覆盖字段"
                    value={`${qualityImpactSummary.coveredFieldCount}`}
                  />
                  <Detail
                    label="未关联原因"
                    value={`${qualityImpactSummary.unmatchedReasonCount}`}
                  />
                  <Detail
                    label="首要问题"
                    value={qualityImpactSummary.topIssue?.id ?? "无"}
                  />
                </div>

                {qualityImpactSummary.affectedObjects.length > 0 ? (
                  <div>
                    <div className="text-xs text-muted-foreground">影响对象</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {qualityImpactSummary.affectedObjects.map((object) => (
                        <Badge key={object} variant="secondary">
                          {object}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                {qualityImpactSummary.items.length > 0 ? (
                  <div className="grid gap-3">
                    {qualityImpactSummary.items.map((item, index) => (
                      <div key={item.issueId} className="rounded-lg border p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xs text-muted-foreground">
                              建议查看 {index + 1} / {qualityImpactSummary.items.length}
                            </div>
                            <div className="mt-1 text-sm font-medium">
                              {item.issueId} {item.title}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={item.severity === "high" ? "destructive" : "secondary"}>
                              {dataQualitySeverityLabel(item.severity)}
                            </Badge>
                            <Badge variant="outline">
                              {dataQualityStatusLabel(item.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                          <span>负责人：{item.owner}</span>
                          <span>阻塞行：{item.blockedRows}</span>
                          <span>匹配字段：{item.matchedFields.join(", ") || "未直接匹配"}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.affectedObjects.map((object) => (
                            <Badge key={object} variant="outline">
                              {object}
                            </Badge>
                          ))}
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {item.recommendation}
                        </p>
                        <div className="mt-3 flex justify-end">
                          <Button asChild size="sm" variant="outline">
                            <Link href={item.href}>查看问题</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    当前批次没有关联数据质量影响，仅展示失败原因和失败行明细。
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>修正准备摘要</CardTitle>
                <CardDescription>
                  汇总失败原因和质量影响，形成复核前的查看顺序。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Detail
                    label="准备等级"
                    value={correctionReadinessLevelLabel(
                      correctionReadinessSummary.readinessLevel
                    )}
                  />
                  <Detail
                    label="首要字段"
                    value={correctionReadinessSummary.primaryField}
                  />
                  <Detail
                    label="确认对象"
                    value={`${correctionReadinessSummary.confirmationObjects.length}`}
                  />
                  <Detail
                    label="暂缓能力"
                    value={`${correctionReadinessSummary.deferredActions.length}`}
                  />
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">风险提示</div>
                  <div className="mt-1 text-sm font-medium">
                    {correctionReadinessSummary.primaryRisk}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {correctionReadinessSummary.headline}
                  </p>
                </div>

                {correctionReadinessSummary.confirmationObjects.length > 0 ? (
                  <div>
                    <div className="text-xs text-muted-foreground">需确认对象</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {correctionReadinessSummary.confirmationObjects.map((object) => (
                        <Badge key={object} variant="secondary">
                          {object}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                {correctionReadinessSummary.reviewSteps.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-xs text-muted-foreground">建议查看顺序</div>
                    {correctionReadinessSummary.reviewSteps.map((step, index) => (
                      <div
                        key={step}
                        className="grid gap-2 rounded-lg border p-3 text-sm sm:grid-cols-[3rem_1fr]"
                      >
                        <span className="font-medium tabular-nums">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    当前批次没有失败行，无需准备修正材料。
                  </p>
                )}

                <div>
                  <div className="text-xs text-muted-foreground">暂缓能力</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {correctionReadinessSummary.deferredActions.map((action) => (
                      <Badge key={action} variant="outline">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>修正材料预览</CardTitle>
                <CardDescription>
                  把字段、失败行和质量问题整理成复核前材料。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Detail
                    label="材料状态"
                    value={correctionMaterialStatusLabel(
                      correctionMaterialSummary.materialStatus
                    )}
                  />
                  <Detail
                    label="字段材料"
                    value={`${correctionMaterialSummary.fieldMaterials.length}`}
                  />
                  <Detail
                    label="失败行样本"
                    value={`${correctionMaterialSummary.failureRowSamples.length}`}
                  />
                  <Detail
                    label="相关质量"
                    value={`${correctionMaterialSummary.qualityReferences.length}`}
                  />
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">材料摘要</div>
                  <p className="mt-1 text-sm font-medium">
                    {correctionMaterialSummary.summary}
                  </p>
                </div>

                {correctionMaterialSummary.fieldMaterials.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-xs text-muted-foreground">字段材料</div>
                    {correctionMaterialSummary.fieldMaterials.map((item) => (
                      <div key={item.id} className="rounded-lg border p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-mono text-xs text-muted-foreground">
                              {item.fieldName} / {item.errorCode}
                            </div>
                            <div className="mt-1 text-sm font-medium">
                              {item.correctionHint}
                            </div>
                          </div>
                          <Badge variant="secondary">失败 {item.failedRows} 行</Badge>
                        </div>
                        <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                          <span>代表行：{item.representativeRowNumber}</span>
                          <span>
                            代表原值：{item.representativeRawValue || "空值"}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.affectedObjects.map((object) => (
                            <Badge key={object} variant="outline">
                              {object}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {correctionMaterialSummary.failureRowSamples.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-xs text-muted-foreground">失败行样本</div>
                    {correctionMaterialSummary.failureRowSamples.map((row) => (
                      <div
                        key={`${row.failedRowNumber}-${row.fieldName}-${row.errorCode}`}
                        className="grid gap-2 rounded-lg border p-3 text-sm md:grid-cols-[5rem_1fr_1fr_2fr]"
                      >
                        <span>行 {row.failedRowNumber}</span>
                        <span className="font-mono text-xs">{row.fieldName}</span>
                        <span className="font-mono text-xs">{row.errorCode}</span>
                        <span className="text-muted-foreground">
                          {row.errorMessage}
                          {row.rawValue ? ` / 原值：${row.rawValue}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {correctionMaterialSummary.qualityReferences.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-xs text-muted-foreground">相关质量问题</div>
                    {correctionMaterialSummary.qualityReferences.map((reference) => (
                      <div
                        key={reference.issueId}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium">
                              {reference.issueId} {reference.title}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              负责人：{reference.owner} / 阻塞 {reference.blockedRows} 行
                            </div>
                          </div>
                          <Badge
                            variant={
                              reference.severity === "high" ? "destructive" : "secondary"
                            }
                          >
                            {dataQualitySeverityLabel(reference.severity)}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {reference.matchedFields.map((field) => (
                            <Badge key={field} variant="outline">
                              {field}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button asChild size="sm" variant="outline">
                            <Link href={reference.href}>查看问题</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {correctionMaterialSummary.conversationPoints.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-xs text-muted-foreground">沟通要点</div>
                    {correctionMaterialSummary.conversationPoints.map((point, index) => (
                      <div
                        key={point}
                        className="grid gap-2 rounded-lg border p-3 text-sm sm:grid-cols-[3rem_1fr]"
                      >
                        <span className="font-medium tabular-nums">{index + 1}</span>
                        <span className="text-muted-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div>
                  <div className="text-xs text-muted-foreground">暂缓能力</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {correctionMaterialSummary.deferredActions.map((action) => (
                      <Badge key={action} variant="outline">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>复核结论预览</CardTitle>
                <CardDescription>
                  将修正材料整理为复核前的建议结论和风险口径。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Detail
                    label="结论状态"
                    value={reviewConclusionStatusLabel(
                      reviewConclusionSummary.conclusionStatus
                    )}
                  />
                  <Detail
                    label="置信度"
                    value={reviewConclusionConfidenceLabel(
                      reviewConclusionSummary.confidence
                    )}
                  />
                  <Detail
                    label="证据摘要"
                    value={`${reviewConclusionSummary.evidenceSummary.length}`}
                  />
                  <Detail
                    label="风险提示"
                    value={`${reviewConclusionSummary.riskSummary.length}`}
                  />
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">建议结论</div>
                  <p className="mt-1 text-sm font-medium">
                    {reviewConclusionSummary.suggestedConclusion}
                  </p>
                </div>

                {reviewConclusionSummary.evidenceSummary.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-xs text-muted-foreground">证据摘要</div>
                    {reviewConclusionSummary.evidenceSummary.map((item, index) => (
                      <div
                        key={item}
                        className="grid gap-2 rounded-lg border p-3 text-sm sm:grid-cols-[3rem_1fr]"
                      >
                        <span className="font-medium tabular-nums">{index + 1}</span>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {reviewConclusionSummary.riskSummary.length > 0 ? (
                  <div className="grid gap-2">
                    <div className="text-xs text-muted-foreground">风险提示</div>
                    {reviewConclusionSummary.riskSummary.map((item, index) => (
                      <div
                        key={item}
                        className="grid gap-2 rounded-lg border p-3 text-sm sm:grid-cols-[3rem_1fr]"
                      >
                        <span className="font-medium tabular-nums">{index + 1}</span>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">下一查看点</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {reviewConclusionSummary.nextReviewPoint}
                  </p>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">暂缓能力</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reviewConclusionSummary.deferredActions.map((action) => (
                      <Badge key={action} variant="outline">
                        {action}
                      </Badge>
                    ))}
                  </div>
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

function correctionReadinessLevelLabel(
  level: "not_required" | "needs_field_review" | "needs_quality_review"
) {
  return {
    not_required: "无需准备",
    needs_field_review: "字段核对",
    needs_quality_review: "质量核对",
  }[level]
}

function correctionMaterialStatusLabel(
  status: "not_required" | "field_material_ready" | "quality_material_ready"
) {
  return {
    not_required: "无需材料",
    field_material_ready: "字段材料",
    quality_material_ready: "质量材料",
  }[status]
}

function reviewConclusionStatusLabel(
  status: "not_required" | "field_review" | "quality_review"
) {
  return {
    not_required: "无需结论",
    field_review: "字段复核",
    quality_review: "质量复核",
  }[status]
}

function reviewConclusionConfidenceLabel(confidence: "none" | "medium" | "high") {
  return {
    none: "无",
    medium: "中",
    high: "高",
  }[confidence]
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
