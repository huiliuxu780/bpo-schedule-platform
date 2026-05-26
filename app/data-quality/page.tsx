import Link from "next/link"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  dataQualitySeverityLabel,
  dataQualitySourceLabels,
  dataQualityStatusLabel,
  fallbackDataQualityIssues,
  summarizeDataQualityDayViewOrder,
  summarizeDataQualityFieldImpactSummary,
  summarizeDataQualityGapOwnerSourcePressure,
  summarizeDataQualityNextReviewRecommendation,
  summarizeDataQualityReviewImportBatchImpact,
  summarizeDataQualityExceptionCauses,
  summarizeDataQualityPersonViewOrder,
  summarizeDataQualityReviewCoverageGap,
  summarizeDataQualityReviewPathSequence,
  summarizeDataQualityReviewPriorityRationale,
  summarizeDataQualityExceptionTop,
  summarizeDataQualityIssues,
} from "@/lib/data-quality"
import { fallbackImportBatches } from "@/lib/import-batch-history"
import {
  dataQualityGroupRiskLabel,
  fallbackDataQualityGroups,
  getUngroupedDataQualityIssueIds,
  summarizeDataQualityGroupExceptionCoverage,
  summarizeDataQualityReviewGroupLink,
  summarizeDataQualityGroups,
} from "@/lib/data-quality-groups"

export default function DataQualityPage() {
  const rows = fallbackDataQualityIssues
  const summary = summarizeDataQualityIssues(rows)
  const exceptionTopSummary = summarizeDataQualityExceptionTop(rows)
  const exceptionCauseSummary = summarizeDataQualityExceptionCauses(rows)
  const personViewOrderSummary = summarizeDataQualityPersonViewOrder(rows)
  const dayViewOrderSummary = summarizeDataQualityDayViewOrder(rows)
  const fieldImpactSummary = summarizeDataQualityFieldImpactSummary(rows)
  const reviewPriorityRationale = summarizeDataQualityReviewPriorityRationale(rows)
  const reviewPathSequence = summarizeDataQualityReviewPathSequence(rows)
  const reviewCoverageGap = summarizeDataQualityReviewCoverageGap(rows)
  const gapOwnerSourcePressure = summarizeDataQualityGapOwnerSourcePressure(rows)
  const nextReviewRecommendation = summarizeDataQualityNextReviewRecommendation(rows)
  const reviewImportBatchImpact = summarizeDataQualityReviewImportBatchImpact(
    rows,
    fallbackImportBatches
  )
  const reviewGroupLink = summarizeDataQualityReviewGroupLink(
    nextReviewRecommendation.representativeIssueId,
    fallbackDataQualityGroups
  )
  const groupExceptionCoverage = summarizeDataQualityGroupExceptionCoverage(
    rows,
    fallbackDataQualityGroups
  )
  const groupSummary = summarizeDataQualityGroups(fallbackDataQualityGroups)
  const ungroupedIssueIds = getUngroupedDataQualityIssueIds(rows.map((row) => row.id))
  const openRows = rows.filter((row) => row.status === "open")

  return (
    <AppShell title="数据质量" searchPlaceholder="搜索错误码、字段或来源">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">数据质量</h1>
            <p className="text-sm text-muted-foreground">
              集中查看导入、主数据、排班、预测、登录和状态日志的数据问题。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/data-quality/groups">查看质量分组</Link>
            </Button>
            <Badge variant="outline">质量监控</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="问题总数" value={`${summary.total}`} description="当前范围" />
          <Metric title="未解决" value={`${summary.open}`} description="需要复核" />
          <Metric title="高严重度" value={`${summary.highSeverity}`} description="阻断风险" />
          <Metric title="阻断行数" value={`${summary.blockedRows}`} description="样例行数" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>来源分布</CardTitle>
              <CardDescription>对应导入规则和异常识别的数据源。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {Object.entries(summary.sourceCounts).map(([source, count]) => (
                <div
                  key={source}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border p-3"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {dataQualitySourceLabels[source as keyof typeof dataQualitySourceLabels]}
                    </div>
                    <div className="text-xs text-muted-foreground">{source}</div>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>分组覆盖</CardTitle>
              <CardDescription>
                质量问题按业务原因分组，便于从字段问题回到主数据、排班和实际日志。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <Detail label="分组" value={`${groupSummary.totalGroups}`} />
                <Detail label="已覆盖" value={`${groupSummary.groupedIssueCount}`} />
                <Detail label="未分组" value={`${ungroupedIssueIds.length}`} />
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/data-quality/groups">查看分组覆盖</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>复核优先级说明</CardTitle>
                <CardDescription>
                  把问题、字段、日期、人员和原因聚成主管可读的首要复核理由。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {reviewPriorityRationale.priorityIssueId ?? "无优先项"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Detail
                label="影响异常"
                value={`${reviewPriorityRationale.impactedExceptionCount}`}
              />
              <Detail
                label="影响人员"
                value={`${reviewPriorityRationale.impactedPeopleCount}`}
              />
              <Detail
                label="首要日期"
                value={reviewPriorityRationale.priorityDate ?? "无"}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {reviewPriorityRationale.headline}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    字段：{reviewPriorityRationale.priorityField ?? "无"} / 人员：
                    {reviewPriorityRationale.priorityPerson ?? "无"} / 原因：
                    {reviewPriorityRationale.priorityCause ?? "无"}
                  </div>
                </div>
                {reviewPriorityRationale.href ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={reviewPriorityRationale.href}>查看优先问题</Link>
                  </Button>
                ) : null}
              </div>

              {reviewPriorityRationale.reasons.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {reviewPriorityRationale.reasons.map((reason) => (
                    <div key={reason} className="text-xs text-muted-foreground">
                      {reason}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  当前没有匹配到需要优先复核的履约异常影响。
                </p>
              )}

              <div className="mt-3 text-xs text-muted-foreground">
                下一查看：{reviewPriorityRationale.nextViewHint}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {reviewPriorityRationale.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>质量分组异常影响覆盖</CardTitle>
                <CardDescription>
                  从质量分组反向查看哪些原因分组正在影响履约异常和人员。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {groupExceptionCoverage.topGroup?.title ?? "无影响分组"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-4">
              <Detail
                label="影响分组"
                value={`${groupExceptionCoverage.totalImpactedGroupCount}`}
              />
              <Detail
                label="影响异常"
                value={`${groupExceptionCoverage.totalImpactedExceptionCount}`}
              />
              <Detail
                label="影响人员"
                value={`${groupExceptionCoverage.totalImpactedPeopleCount}`}
              />
              <Detail
                label="阻断行"
                value={`${groupExceptionCoverage.totalBlockedRows}`}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    首要分组：{groupExceptionCoverage.topGroup?.title ?? "无"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    owner：{groupExceptionCoverage.topGroup?.owner ?? "无"} / 风险：
                    {groupExceptionCoverage.topGroup
                      ? dataQualityGroupRiskLabel(groupExceptionCoverage.topGroup.risk)
                      : "无"}{" "}
                    / 代表问题：
                    {groupExceptionCoverage.topGroup?.representativeIssueId ?? "无"}
                  </div>
                </div>
                {groupExceptionCoverage.topGroup ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={groupExceptionCoverage.topGroup.href}>查看影响分组</Link>
                  </Button>
                ) : null}
              </div>

              {groupExceptionCoverage.items.length > 0 ? (
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {groupExceptionCoverage.items.map((item) => (
                    <div key={item.groupId} className="rounded-lg border p-3">
                      <div className="text-sm font-medium">
                        {item.title} / {dataQualityGroupRiskLabel(item.risk)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        owner：{item.owner} / 代表问题：{item.representativeIssueId} /{" "}
                        {item.representativeIssueTitle}
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                        <Detail label="人员" value={`${item.impactedPeople.length}`} />
                        <Detail label="阻断行" value={`${item.blockedRows}`} />
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        模板：{item.sourceTemplates.join(" / ") || "无"} / 字段：
                        {item.traceKeys.join(" / ") || "无"}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        影响对象：{item.affectedObjects.join(" / ") || "无"}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        下一查看：{item.nextViewHint}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  当前质量分组没有匹配到履约异常影响。
                </p>
              )}

              <div className="mt-3 text-xs text-muted-foreground">
                下一查看：{groupExceptionCoverage.nextViewHint}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {groupExceptionCoverage.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>复核建议质量分组</CardTitle>
                <CardDescription>
                  把建议问题回到质量分组，确认是否已进入原因分组和分组复核建议。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {reviewGroupLink.topGroup?.title ?? "未分组"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Detail
                label="匹配分组"
                value={`${reviewGroupLink.totalMatchedGroupCount}`}
              />
              <Detail
                label="未分组"
                value={`${reviewGroupLink.ungroupedIssueCount}`}
              />
              <Detail
                label="分组问题"
                value={`${reviewGroupLink.groupedIssueCount}`}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    建议问题：{reviewGroupLink.representativeIssueId ?? "无"}
                    {reviewGroupLink.topGroup ? ` / ${reviewGroupLink.topGroup.title}` : ""}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    owner：{reviewGroupLink.topGroup?.owner ?? "无"} / 风险：
                    {reviewGroupLink.topGroup
                      ? dataQualityGroupRiskLabel(reviewGroupLink.topGroup.risk)
                      : "无"}
                  </div>
                </div>
                {reviewGroupLink.topGroup ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={reviewGroupLink.topGroup.href}>查看质量分组</Link>
                  </Button>
                ) : null}
              </div>

              {reviewGroupLink.items.length > 0 ? (
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {reviewGroupLink.items.map((item) => (
                    <div key={item.groupId} className="rounded-lg border p-3">
                      <div className="text-sm font-medium">
                        {item.title} / {dataQualityGroupRiskLabel(item.risk)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        owner：{item.owner} / 分组问题：{item.issueCount}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        模板：{item.sourceTemplates.join(" / ") || "无"} / 字段：
                        {item.traceKeys.join(" / ") || "无"}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        分组建议：{item.recommendedReview}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  当前建议问题尚未匹配到质量分组。
                </p>
              )}

              <div className="mt-3 text-xs text-muted-foreground">
                下一查看：{reviewGroupLink.nextViewHint}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {reviewGroupLink.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>复核建议导入批次影响</CardTitle>
                <CardDescription>
                  串联建议问题与导入批次、失败行和影响对象，便于继续追溯来源。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {reviewImportBatchImpact.representativeIssueId ?? "无关联批次"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Detail
                label="关联批次"
                value={`${reviewImportBatchImpact.totalBatchCount}`}
              />
              <Detail
                label="失败行"
                value={`${reviewImportBatchImpact.totalFailedRows}`}
              />
              <Detail
                label="影响对象"
                value={`${reviewImportBatchImpact.affectedObjects.length}`}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    建议问题：{reviewImportBatchImpact.representativeIssueId ?? "无"}
                    {reviewImportBatchImpact.representativeIssueTitle
                      ? ` / ${reviewImportBatchImpact.representativeIssueTitle}`
                      : ""}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    匹配字段：{reviewImportBatchImpact.matchedFields.join(" / ") || "无"} / 影响对象：
                    {reviewImportBatchImpact.affectedObjects.join(" / ") || "无"}
                  </div>
                </div>
                {reviewImportBatchImpact.firstBatch ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={reviewImportBatchImpact.firstBatch.href}>查看关联批次</Link>
                  </Button>
                ) : null}
              </div>

              {reviewImportBatchImpact.items.length > 0 ? (
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {reviewImportBatchImpact.items.map((item) => (
                    <div key={item.batchId} className="rounded-lg border p-3">
                      <div className="text-sm font-medium">
                        {item.batchId} / {item.templateName}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.sourceFile}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <Detail label="失败行" value={`${item.failedRows}`} />
                        <Detail label="字段" value={`${item.matchedFields.length}`} />
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        查看提示：{item.reviewHint}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  当前建议问题没有匹配到导入批次影响。
                </p>
              )}

              <div className="mt-3 text-xs text-muted-foreground">
                下一查看：{reviewImportBatchImpact.nextViewHint}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {reviewImportBatchImpact.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>缺口下一轮复核建议</CardTitle>
                <CardDescription>
                  把缺口压力转成下一轮只读查看顺序，便于主管安排复核重点。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {nextReviewRecommendation.representativeIssueId ?? "无建议项"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Detail
                label="影响异常"
                value={`${nextReviewRecommendation.impactedExceptionCount}`}
              />
              <Detail
                label="影响人员"
                value={`${nextReviewRecommendation.impactedPeopleCount}`}
              />
              <Detail
                label="建议步骤"
                value={`${nextReviewRecommendation.steps.length}`}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {nextReviewRecommendation.headline}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    首要 owner：{nextReviewRecommendation.topOwner ?? "无"} / 首要来源：
                    {nextReviewRecommendation.topSource
                      ? dataQualitySourceLabels[nextReviewRecommendation.topSource]
                      : "无"}
                  </div>
                </div>
                {nextReviewRecommendation.href ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={nextReviewRecommendation.href}>查看建议问题</Link>
                  </Button>
                ) : null}
              </div>

              {nextReviewRecommendation.steps.length > 0 ? (
                <div className="mt-3 grid gap-3">
                  {nextReviewRecommendation.steps.map((step, index) => (
                    <div key={step.label} className="rounded-lg border p-3">
                      <div className="text-sm font-medium">
                        {index + 1}. {step.label}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  当前没有需要追加的缺口复核建议。
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {nextReviewRecommendation.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>缺口 owner/来源压力</CardTitle>
                <CardDescription>
                  按责任人与数据来源汇总未覆盖缺口，便于安排下一轮复核查看。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {gapOwnerSourcePressure.topOwner ?? "无压力项"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Detail
                label="缺口问题"
                value={`${gapOwnerSourcePressure.gapIssueCount}`}
              />
              <Detail
                label="影响异常"
                value={`${gapOwnerSourcePressure.impactedExceptionCount}`}
              />
              <Detail
                label="影响人员"
                value={`${gapOwnerSourcePressure.impactedPeopleCount}`}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {gapOwnerSourcePressure.headline}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    首要 owner：{gapOwnerSourcePressure.topOwner ?? "无"} / 首要来源：
                    {gapOwnerSourcePressure.topSource
                      ? dataQualitySourceLabels[gapOwnerSourcePressure.topSource]
                      : "无"}
                  </div>
                </div>
                {gapOwnerSourcePressure.topItem ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={gapOwnerSourcePressure.topItem.href}>查看压力问题</Link>
                  </Button>
                ) : null}
              </div>

              {gapOwnerSourcePressure.items.length > 0 ? (
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {gapOwnerSourcePressure.items.map((item) => (
                    <div key={item.key} className="rounded-lg border p-3">
                      <div className="text-sm font-medium">
                        {item.owner} / {dataQualitySourceLabels[item.source]}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        代表问题：{item.representativeIssueId} / {item.representativeIssueTitle}
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <Detail label="缺口" value={`${item.gapIssueCount}`} />
                        <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                        <Detail label="人员" value={`${item.impactedPeople.length}`} />
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        字段：{item.sourceFields.join(" / ") || "无"} / 人员：
                        {item.impactedPeople.join(" / ") || "无"}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        下一查看：{item.nextViewHint}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  当前没有未覆盖缺口的 owner 或来源压力。
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {gapOwnerSourcePressure.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>复核覆盖缺口摘要</CardTitle>
                <CardDescription>
                  对比当前复核路径和影响异常问题，识别还没进入路径的缺口。
                </CardDescription>
              </div>
              <Badge variant="secondary">{reviewCoverageGap.gapIssueCount} 个缺口</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Detail
                label="影响问题"
                value={`${reviewCoverageGap.totalImpactedIssueCount}`}
              />
              <Detail
                label="已覆盖"
                value={`${reviewCoverageGap.coveredIssueCount}`}
              />
              <Detail
                label="未覆盖"
                value={`${reviewCoverageGap.gapIssueCount}`}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {reviewCoverageGap.headline}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    缺口字段：{reviewCoverageGap.gapFields.join(" / ") || "无"} / 缺口人员：
                    {reviewCoverageGap.gapPeople.join(" / ") || "无"}
                  </div>
                </div>
                {reviewCoverageGap.firstGap ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={reviewCoverageGap.firstGap.href}>查看缺口问题</Link>
                  </Button>
                ) : null}
              </div>

              {reviewCoverageGap.items.length > 0 ? (
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {reviewCoverageGap.items.map((item) => (
                    <div key={item.issueId} className="rounded-lg border p-3">
                      <div className="text-sm font-medium">
                        {item.issueId} / {item.title}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.sourceField}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                        <Detail label="人员" value={`${item.impactedPeople.length}`} />
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        缺口原因：{item.reason}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  当前复核路径已覆盖全部影响异常的数据质量问题。
                </p>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              下一查看：{reviewCoverageGap.nextViewHint}
            </div>

            <div className="flex flex-wrap gap-2">
              {reviewCoverageGap.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>复核路径顺序</CardTitle>
                <CardDescription>
                  把优先问题、字段、日期、人员和原因排成连续查看路径。
                </CardDescription>
              </div>
              <Badge variant="secondary">{reviewPathSequence.stepCount} 步</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Detail
                label="路径步骤"
                value={`${reviewPathSequence.stepCount}`}
              />
              <Detail
                label="首要步骤"
                value={reviewPathSequence.firstStep?.label ?? "无"}
              />
              <Detail
                label="首要入口"
                value={reviewPathSequence.firstStep?.title ?? "无"}
              />
            </div>

            {reviewPathSequence.steps.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {reviewPathSequence.steps.map((step, index) => (
                  <div key={`${step.type}-${step.title}`} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">
                          {index + 1}. {step.label}
                        </div>
                        <div className="truncate text-sm font-medium">
                          {step.title}
                        </div>
                      </div>
                      {step.href ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href={step.href}>查看路径步骤</Link>
                        </Button>
                      ) : null}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <Detail label="异常" value={`${step.impactedExceptionCount}`} />
                      <Detail label="人员" value={`${step.impactedPeopleCount}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      路径理由：{step.reason}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前没有匹配到可排序的数据质量复核路径。
              </p>
            )}

            <div className="text-xs text-muted-foreground">
              下一查看：{reviewPathSequence.nextViewHint}
            </div>

            <div className="flex flex-wrap gap-2">
              {reviewPathSequence.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>影响异常 Top</CardTitle>
                <CardDescription>
                  按影响异常、人员和阻断行聚合，帮助主管优先查看高影响数据问题。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {exceptionTopSummary.totalImpactedExceptionCount} 项异常
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="影响问题" value={`${exceptionTopSummary.totalIssueCount}`} />
              <Detail label="影响异常" value={`${exceptionTopSummary.totalImpactedExceptionCount}`} />
              <Detail label="影响人员" value={`${exceptionTopSummary.totalImpactedPeopleCount}`} />
            </div>

            {exceptionTopSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {exceptionTopSummary.items.slice(0, 4).map((item) => (
                  <div key={item.issueId} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.issueId} / {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dataQualitySeverityLabel(item.severity)} / {dataQualityStatusLabel(item.status)} / {item.owner}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看问题</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                      <Detail label="人员" value={`${item.impactedPeople.length}`} />
                      <Detail label="阻断行" value={`${item.blockedRows}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      影响对象：{item.affectedObjects.join(" / ")}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到履约异常影响。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {exceptionTopSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>字段影响交叉摘要</CardTitle>
                <CardDescription>
                  按来源字段聚合影响日期、人员和异常，帮助主管识别扩散最广的字段。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {fieldImpactSummary.totalFieldCount} 个字段
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="字段" value={`${fieldImpactSummary.totalFieldCount}`} />
              <Detail label="影响日期" value={`${fieldImpactSummary.totalAffectedDateCount}`} />
              <Detail label="影响人员" value={`${fieldImpactSummary.totalAffectedPeopleCount}`} />
            </div>

            {fieldImpactSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {fieldImpactSummary.items.slice(0, 4).map((item) => (
                  <div key={item.key} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.sourceField}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dataQualitySourceLabels[item.source]} / {item.representativeCause}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看字段问题</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="日期" value={`${item.affectedDateCount}`} />
                      <Detail label="人员" value={`${item.affectedPeopleCount}`} />
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      代表问题：{item.representativeIssueId} / {item.representativeIssueTitle}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      影响日期：{item.affectedDates.join(" / ") || "无"}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到字段级履约影响。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {fieldImpactSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>履约日期查看顺序</CardTitle>
                <CardDescription>
                  按受影响业务日期聚合异常和人员，帮助主管先进入影响最大的履约日期。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {dayViewOrderSummary.totalDateCount} 天
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="影响日期" value={`${dayViewOrderSummary.totalDateCount}`} />
              <Detail label="影响异常" value={`${dayViewOrderSummary.totalImpactedExceptionCount}`} />
              <Detail label="影响人员" value={`${dayViewOrderSummary.totalImpactedPeopleCount}`} />
            </div>

            {dayViewOrderSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {dayViewOrderSummary.items.slice(0, 4).map((item) => (
                  <div key={item.businessDate} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.businessDate} / {item.representativeCause}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.representativeIssueId} / {item.representativeIssueTitle}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看履约日期</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                      <Detail label="人员" value={`${item.impactedPeopleCount}`} />
                      <Detail label="阻断行" value={`${item.blockedRows}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      影响人员：{item.impactedPeople.join(" / ")}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到需要进入履约日期的影响。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {dayViewOrderSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>人员履约查看顺序</CardTitle>
                <CardDescription>
                  按受影响人员聚合原因和异常，帮助主管先进入个人履约核对。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {personViewOrderSummary.totalPersonCount} 人
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="影响人员" value={`${personViewOrderSummary.totalPersonCount}`} />
              <Detail label="影响异常" value={`${personViewOrderSummary.totalImpactedExceptionCount}`} />
              <Detail label="首要人员" value={personViewOrderSummary.topPerson?.employeeId ?? "无"} />
            </div>

            {personViewOrderSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {personViewOrderSummary.items.slice(0, 4).map((item) => (
                  <div key={item.employeeId} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.employeeId} / {item.representativeCause}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.representativeIssueId} / {item.representativeIssueTitle}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看个人履约</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="原因" value={`${item.causeCount}`} />
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                      <Detail label="阻断行" value={`${item.blockedRows}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到需要进入个人履约的人员。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {personViewOrderSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>异常影响原因汇总</CardTitle>
                <CardDescription>
                  按错误码、字段和来源聚合，先看影响异常最多的数据质量原因。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {exceptionCauseSummary.totalCauseCount} 类原因
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Detail label="原因类型" value={`${exceptionCauseSummary.totalCauseCount}`} />
              <Detail label="影响异常" value={`${exceptionCauseSummary.totalImpactedExceptionCount}`} />
              <Detail label="影响人员" value={`${exceptionCauseSummary.totalImpactedPeopleCount}`} />
            </div>

            {exceptionCauseSummary.items.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {exceptionCauseSummary.items.slice(0, 4).map((item) => (
                  <div key={item.key} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {item.errorCode}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dataQualitySourceLabels[item.source]} / {item.sourceField}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>查看代表问题</Link>
                      </Button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Detail label="异常" value={`${item.impactedExceptionCount}`} />
                      <Detail label="人员" value={`${item.impactedPeople.length}`} />
                      <Detail label="阻断行" value={`${item.blockedRows}`} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      代表问题：{item.representativeIssueId} / {item.representativeIssueTitle}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      下一查看：{item.nextViewHint}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                当前数据质量问题没有匹配到履约异常影响原因。
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {exceptionCauseSummary.deferredActions.map((action) => (
                <Badge key={action} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>未解决问题</CardTitle>
                <CardDescription>优先定位阻断导入和履约对比的数据质量问题。</CardDescription>
              </div>
              <Badge variant="secondary">{openRows.length} 条</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {openRows.map((row) => (
              <div key={row.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{row.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.id} / {row.code}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/data-quality/${row.id}`}>详情</Link>
                  </Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {row.recommendation}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据质量清单</CardTitle>
            <CardDescription>覆盖第一阶段导入合同和异常识别所需的质量问题。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>问题</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>字段</TableHead>
                  <TableHead>严重度</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>阻断行</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex min-w-48 flex-col gap-1">
                        <span className="font-medium">{row.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.id} / {row.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{dataQualitySourceLabels[row.source]}</TableCell>
                    <TableCell>
                      {row.entity}.{row.fieldName}
                    </TableCell>
                    <TableCell>{dataQualitySeverityLabel(row.severity)}</TableCell>
                    <TableCell>{dataQualityStatusLabel(row.status)}</TableCell>
                    <TableCell>{row.blockedRows}</TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/data-quality/${row.id}`}>详情</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}
