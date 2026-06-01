import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { ImportCenterBatchDetailPanel } from "@/components/import-center-batch-detail-panel"
import { ImportCenterBatchInspectorPanel } from "@/components/import-center-batch-inspector-panel"
import { ImportCenterDetailTabs } from "@/components/import-center-detail-tabs"
import { ImportCenterResultTracePanel } from "@/components/import-center-result-trace-panel"
import { ImportCenterRowCorrectionPanel } from "@/components/import-center-row-correction-panel"
import { ImportCenterTemplateManagementPanel } from "@/components/import-center-template-management-panel"
import { ImportCenterUploadForm } from "@/components/import-center-upload-form"
import {
  type ImportApplyReadinessResponse,
  type ImportBatchListRow,
  type ImportBatchPersistenceDetail,
  type ImportComparisonRunRecord,
  type ImportFieldMappingTemplate,
  type ImportReviewCaseRecord,
  buildImportApiUrl,
  buildImportBatchDetailUrl,
  buildImportComparisonRunsUrl,
  buildImportFieldMappingTemplatesUrl,
  buildImportReviewCasesUrl,
  formatImportApplicationStatus,
  formatImportFileType,
  formatImportReadinessStatus,
  summarizeImportPageHierarchy,
  summarizeImportRowCorrectionNotice,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

type ImportBatchDetailPageProps = {
  params: Promise<{
    batchId: string
  }>
  searchParams?: Promise<{
    upload?: string
    correction?: string
    reason?: string
    row?: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function ImportBatchDetailPage({
  params,
  searchParams,
}: ImportBatchDetailPageProps) {
  const routeParams = await params
  const query = await searchParams
  const batchId = routeParams.batchId
  const batchResult = await fetchImportBatches()
  const batches = batchResult.data ?? []
  const selectedBatch = batches.find((batch) => batch.batch_id === batchId) ?? null
  const businessDate = selectedBatch?.business_date_from ?? null
  const readinessResult = await fetchImportReadiness(batchId)
  const detailResult = await fetchImportBatchDetail(batchId)
  const templateResult = await fetchImportFieldMappingTemplates()
  const comparisonResult = businessDate
    ? await fetchImportComparisonRuns(businessDate)
    : { data: [], error: null }
  const reviewCaseResult = businessDate
    ? await fetchImportReviewCases(businessDate)
    : { data: [], error: null }
  const hierarchy = summarizeImportPageHierarchy({
    selectedBatch,
    readiness: readinessResult.data,
    hasBatchDetail: true,
    hasUploadTools: true,
    hasResultTrace: true,
  })

  return (
    <AppShell title="批次处理" searchPlaceholder="搜索导入批次、文件或上传人">
      <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
        <BatchDetailHeader
          batchId={batchId}
          batch={selectedBatch}
          batchError={batchResult.error}
        />

        <ProcessingOverview
          batch={selectedBatch}
          readiness={readinessResult.data}
          readinessError={readinessResult.error}
          comparisonCount={comparisonResult.data?.length ?? 0}
          reviewCaseCount={reviewCaseResult.data?.length ?? 0}
        />

        <CorrectionFeedbackBanner
          correctionStatus={query?.correction}
          correctionReason={query?.reason}
          correctionRow={query?.row}
          remainingFailedRows={detailResult.data?.failed_rows.length ?? 0}
        />

        <section className="grid gap-4">
          <ImportCenterDetailTabs
            hierarchy={hierarchy}
            statusCheckPanel={
              <ImportCenterBatchInspectorPanel
                selectedBatch={selectedBatch}
                readiness={readinessResult.data}
                readinessError={readinessResult.error}
                mode="detail"
              />
            }
            batchDetailPanel={
              <ImportCenterBatchDetailPanel
                detail={detailResult.data}
                detailError={detailResult.error}
              />
            }
            rowCorrectionPanel={
              <ImportCenterRowCorrectionPanel
                detail={detailResult.data}
                detailError={detailResult.error}
                correctionStatus={query?.correction}
                correctionReason={query?.reason}
                correctionRow={query?.row}
              />
            }
            resultTracePanel={
              <ImportCenterResultTracePanel
                businessDate={businessDate}
                comparisonRuns={comparisonResult.data ?? []}
                comparisonError={comparisonResult.error}
                reviewCases={reviewCaseResult.data ?? []}
                reviewError={reviewCaseResult.error}
              />
            }
            dataToolsPanel={
              <div className="grid gap-4">
                <ImportCenterUploadForm
                  uploadStatus={query?.upload}
                  uploadReason={query?.reason}
                  uploadBatchId={batchId}
                  templates={templateResult.data ?? []}
                  templateError={templateResult.error}
                />
                <ImportCenterTemplateManagementPanel
                  templates={templateResult.data ?? []}
                  templateError={templateResult.error}
                />
              </div>
            }
          />
        </section>
      </main>
    </AppShell>
  )
}

function CorrectionFeedbackBanner({
  correctionStatus,
  correctionReason,
  correctionRow,
  remainingFailedRows,
}: {
  correctionStatus?: string
  correctionReason?: string
  correctionRow?: string
  remainingFailedRows: number
}) {
  const notice = summarizeImportRowCorrectionNotice({
    status: correctionStatus,
    reason: correctionReason,
    row: correctionRow,
    remainingFailedRows,
  })

  if (!notice) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div>
          <CardTitle className="text-base">{notice.title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{notice.detail}</p>
        </div>
        <Badge variant={notice.tone === "success" ? "secondary" : "destructive"}>
          {notice.tone === "success" ? "已修正" : "修正失败"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{notice.nextAction}</p>
      </CardContent>
    </Card>
  )
}

function ProcessingOverview({
  batch,
  readiness,
  readinessError,
  comparisonCount,
  reviewCaseCount,
}: {
  batch: ImportBatchListRow | null
  readiness: ImportApplyReadinessResponse | null
  readinessError: string | null
  comparisonCount: number
  reviewCaseCount: number
}) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <OverviewCard
        label="准备度"
        value={
          readiness
            ? formatImportReadinessStatus(readiness.readiness_status)
            : readinessError
              ? "读取失败"
              : "未返回"
        }
        detail={
          readiness
            ? `阻塞 ${readiness.blockers.length + readiness.row_blockers.length} 项`
            : readinessError ?? "等待准备度结果"
        }
        tone={readiness?.readiness_status === "blocked" || readinessError ? "blocked" : "default"}
      />
      <OverviewCard
        label="失败行"
        value={batch ? `${batch.failed_rows}` : "-"}
        detail={batch ? `警告 ${batch.warning_rows} 行 · 成功 ${batch.success_rows} 行` : "暂无批次"}
        tone={batch && batch.failed_rows > 0 ? "blocked" : "default"}
      />
      <OverviewCard
        label="应用状态"
        value={batch ? formatImportApplicationStatus(batch.application_status) : "-"}
        detail={batch?.import_version_id ?? "未生成导入版本"}
        tone={batch?.application_status === "applied" ? "done" : "default"}
      />
      <OverviewCard
        label="下游结果"
        value={`${comparisonCount}/${reviewCaseCount}`}
        detail="对比结果 / 复核案例"
        tone={comparisonCount > 0 || reviewCaseCount > 0 ? "done" : "default"}
      />
    </section>
  )
}

function OverviewCard({
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
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Badge
          variant={
            tone === "blocked" ? "destructive" : tone === "done" ? "secondary" : "outline"
          }
        >
          {value}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="truncate text-sm text-muted-foreground">{detail}</div>
      </CardContent>
    </Card>
  )
}

function BatchDetailHeader({
  batchId,
  batch,
  batchError,
}: {
  batchId: string
  batch: ImportBatchListRow | null
  batchError: string | null
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <div className="mb-3">
            <Button asChild size="sm" variant="outline">
              <Link href={`/data-quality?batch=${encodeURIComponent(batchId)}`}>
                <ArrowLeft data-icon="inline-start" />
                返回批次列表
              </Link>
            </Button>
          </div>
          <CardTitle className="text-base">批次处理详情</CardTitle>
          <p className="mt-1 font-mono text-sm text-muted-foreground">{batchId}</p>
        </div>
        <Badge variant={batchError || !batch ? "destructive" : "outline"}>
          {batchError ? "读取失败" : batch ? formatImportFileType(batch.file_type) : "未找到"}
        </Badge>
      </CardHeader>
      <CardContent>
        {batch ? (
          <div className="grid gap-3 text-sm md:grid-cols-4">
            <HeaderMetric label="文件" value={batch.file_name} />
            <HeaderMetric
              label="业务日期"
              value={`${batch.business_date_from} 至 ${batch.business_date_to}`}
            />
            <HeaderMetric label="上传人" value={batch.uploaded_by} />
            <HeaderMetric label="导入版本" value={batch.import_version_id ?? "未生成"} />
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            {batchError ?? "当前批次不在批次列表中，仍会尝试读取批次明细接口。"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate font-mono text-xs font-medium">{value}</div>
    </div>
  )
}

async function fetchImportFieldMappingTemplates(): Promise<
  ApiResult<ImportFieldMappingTemplate[]>
> {
  try {
    const response = await fetch(buildImportFieldMappingTemplatesUrl(), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `字段映射模板 API 返回 ${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: ImportFieldMappingTemplate[]
    }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

async function fetchImportBatches(): Promise<ApiResult<ImportBatchListRow[]>> {
  try {
    const response = await fetch(buildImportApiUrl("/api/v1/import-batches"), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `导入批次 API 返回 ${response.status}`,
      }
    }

    const payload = (await response.json()) as { items?: ImportBatchListRow[] }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

async function fetchImportReadiness(
  batchId: string
): Promise<ApiResult<ImportApplyReadinessResponse>> {
  try {
    const response = await fetch(
      buildImportApiUrl(
        `/api/v1/import-batches/${encodeURIComponent(batchId)}/apply-readiness`
      ),
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return {
        data: null,
        error: `准备度 API 返回 ${response.status}`,
      }
    }

    return {
      data: (await response.json()) as ImportApplyReadinessResponse,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: formatApiError(error),
    }
  }
}

async function fetchImportBatchDetail(
  batchId: string
): Promise<ApiResult<ImportBatchPersistenceDetail>> {
  try {
    const response = await fetch(buildImportBatchDetailUrl(batchId), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: null,
        error: `批次明细 API 返回 ${response.status}`,
      }
    }

    return {
      data: (await response.json()) as ImportBatchPersistenceDetail,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: formatApiError(error),
    }
  }
}

async function fetchImportComparisonRuns(
  businessDate: string
): Promise<ApiResult<ImportComparisonRunRecord[]>> {
  try {
    const response = await fetch(buildImportComparisonRunsUrl(businessDate), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `对比结果 API 返回 ${response.status}`,
      }
    }

    const payload = (await response.json()) as { items?: ImportComparisonRunRecord[] }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

async function fetchImportReviewCases(
  businessDate: string
): Promise<ApiResult<ImportReviewCaseRecord[]>> {
  try {
    const response = await fetch(buildImportReviewCasesUrl(businessDate), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `复核案例 API 返回 ${response.status}`,
      }
    }

    const payload = (await response.json()) as { items?: ImportReviewCaseRecord[] }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "本地 API 暂不可用"
}
