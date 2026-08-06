import Link from "next/link"
import { CalendarPlus, Upload } from "lucide-react"

import { uploadImportCsvAction } from "@/app/data-quality/actions"
import {
  fetchImportBatches,
  fetchImportFieldMappingTemplates,
} from "@/app/master-data/agents/data"
import { AppShell } from "@/components/app-shell"
import { BackendErrorAlert } from "@/components/backend-error-alert"
import { ImportTaskDialog } from "@/components/import-task-dialog"
import { ScheduleDeskWorkspace } from "@/components/schedule-desk/schedule-desk-workspace"
import {
  expandDateRange,
  schedulePeriodStatusLabel,
  type ScheduleDeskApiWeek,
} from "@/components/schedule-desk/schedule-matrix-model"
import { ScheduleDeskScopeBar } from "@/components/schedule-desk/scope-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getScheduleMatrix,
  getSchedulePeriods,
  getShiftCodeOptions,
  recalculatePeriodCoverage,
  resolveScheduleDeskApiBase,
} from "@/lib/schedule-desk"
import { summarizeImportTaskDialog } from "@/lib/import-task-model"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{
    month?: string
    week?: string
    date?: string
    draft?: string
    import_dialog?: string
    upload?: string
    reason?: string
    batch?: string
  }>
}

type DraftFeedback = {
  variant: "default" | "destructive"
  title: string
  description: string
}

// 草稿创建落点反馈：/schedule-plans/new 的 server action 成功后带 ?draft=created、
// 失败后带 ?draft=failed 落到本页；仅当参数存在时渲染一次性横幅，无需清参数。
function resolveDraftFeedback(value: string | undefined): DraftFeedback | null {
  if (value === "created") {
    return {
      variant: "default",
      title: "排班草稿已创建",
      description: "草稿管理仍在过渡期：草稿记录已写入后端，后续可在排班计划台统一查看与编辑。",
    }
  }

  if (value === "failed") {
    return {
      variant: "destructive",
      title: "草稿创建失败，请重试",
      description: "后端未能保存本次草稿，请返回新建草稿页重新提交。",
    }
  }

  return null
}

function normalizeMonth(value: string | undefined): string | null {
  return value && /^\d{4}-\d{2}$/.test(value) ? value : null
}

function buildQueryPrefix(month: string, weekId: string | null): string {
  const searchParams = new URLSearchParams()
  searchParams.set("month", month)

  if (weekId) {
    searchParams.set("week", weekId)
  }

  return searchParams.toString()
}

function weekOptionLabel(week: ScheduleDeskApiWeek): string {
  return `${week.label}（${week.date_from.slice(5)} ~ ${week.date_to.slice(5)}）`
}

export default async function ScheduleDeskPage({ searchParams }: PageProps) {
  const params = await searchParams
  const draftFeedback = resolveDraftFeedback(params.draft)
  const periodsResult = await getSchedulePeriods()

  // 导入向导数据：串行读取（后端首次访问会惰性初始化 sqlite schema，串行可避免并发首请建表竞态）。
  // 放在周期读取之后，页面首屏仍只有一个初始化触发点。
  const [batchResult, templateResult] = await Promise.all([
    fetchImportBatches(),
    fetchImportFieldMappingTemplates(),
  ])
  const importDialog = summarizeImportTaskDialog({
    variant: "schedule",
    routePrefix: "/schedule-desk",
    batches: batchResult.data ?? [],
    templates: templateResult.data ?? [],
    uploadStatus: params.upload,
    uploadReason: params.reason,
    uploadBatchId: params.batch,
  })
  const importDialogOpen = params.import_dialog === "1" || Boolean(params.upload)
  const importDialogNode =
    importDialogOpen && !periodsResult.error ? (
      <ImportTaskDialog
        dialog={importDialog}
        templateError={batchResult.error ?? templateResult.error}
        action={uploadImportCsvAction}
      />
    ) : null
  const importActions = (
    <Button asChild size="sm">
      <Link href={importDialog.openHref}>
        <Upload data-icon="inline-start" />
        导入排班
      </Link>
    </Button>
  )

  if (periodsResult.error) {
    return renderShell(<BackendErrorAlert error={periodsResult.error} />, draftFeedback)
  }

  const periods = periodsResult.data ?? []

  if (periods.length === 0) {
    // 空态同样提供导入入口：排班文件导入与周期派生无关，先导入才能生成周期。
    return renderShell(
      <>
        <ScheduleDeskEmptyState />
        {importDialogNode}
      </>,
      draftFeedback,
      importActions
    )
  }

  const monthOptions = Array.from(new Set(periods.map((period) => period.month))).sort(
    (left, right) => right.localeCompare(left)
  )
  const monthParam = normalizeMonth(params.month)
  const selectedMonth =
    monthParam && monthOptions.includes(monthParam) ? monthParam : monthOptions[0]
  const period = periods.find((candidate) => candidate.month === selectedMonth) ?? periods[0]
  const weeks = period.weeks
  const selectedWeek = weeks.find((week) => week.week_id === params.week) ?? null
  const rangeFrom = selectedWeek?.date_from ?? period.date_from
  const rangeTo = selectedWeek?.date_to ?? period.date_to
  const rangeDates = expandDateRange(rangeFrom, rangeTo)
  const selectedDate =
    params.date && rangeDates.includes(params.date)
      ? params.date
      : rangeDates[0] ?? period.date_from

  // 串行读取：后端首次访问会惰性初始化 sqlite schema，并发首请存在建表竞态，
  // 串行可将本页首屏压缩为一次初始化触发点（读路径为服务端 fetch，耗时可接受）。
  const matrixResult = await getScheduleMatrix(period.period_id, selectedWeek?.week_id)
  const coverageResult = await recalculatePeriodCoverage(period.period_id, rangeFrom, rangeTo)
  const shiftCodeOptions = await getShiftCodeOptions()
  const error = matrixResult.error ?? coverageResult.error

  if (error || !matrixResult.data || !coverageResult.data) {
    return renderShell(
      <BackendErrorAlert error={error ?? "响应格式异常：缺少矩阵或覆盖数据"} />,
      draftFeedback
    )
  }

  // 导入向导数据已在页面开头读取，矩阵/覆盖就绪后直接渲染。
  return renderShell(
    <>
      <ScheduleDeskScopeBar
        monthOptions={monthOptions}
        selectedMonth={selectedMonth}
        weekOptions={weeks.map((week) => ({
          value: week.week_id,
          label: weekOptionLabel(week),
        }))}
        selectedWeekId={selectedWeek?.week_id ?? "all"}
        statusLabel={schedulePeriodStatusLabel(period.status)}
      />
      <ScheduleDeskWorkspace
        period={period}
        matrix={matrixResult.data}
        coverage={coverageResult.data}
        selectedDate={selectedDate}
        queryPrefix={buildQueryPrefix(selectedMonth, selectedWeek?.week_id ?? null)}
        shiftCodeOptions={shiftCodeOptions}
        apiBaseUrl={resolveScheduleDeskApiBase()}
      />
      {importDialogNode}
    </>,
    draftFeedback,
    importActions
  )
}

function renderShell(
  children: React.ReactNode,
  draftFeedback: DraftFeedback | null,
  actions?: React.ReactNode
) {
  return (
    <AppShell
      title="排班计划台"
      breadcrumbItems={[{ label: "排班计划台" }]}
      actions={actions}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        {draftFeedback ? <DraftFeedbackBanner feedback={draftFeedback} /> : null}
        {children}
      </main>
    </AppShell>
  )
}

function DraftFeedbackBanner({ feedback }: { feedback: DraftFeedback }) {
  return (
    <Alert variant={feedback.variant}>
      <AlertTitle>{feedback.title}</AlertTitle>
      <AlertDescription>{feedback.description}</AlertDescription>
    </Alert>
  )
}

function ScheduleDeskEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>暂无排班周期</CardTitle>
        <CardDescription>
          排班周期需要从已应用的排班批次派生，当前数据库中还没有任何周期数据
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>在人员排班生产台上传人员排班文件，完成字段映射与行校验；</li>
          <li>将该人员排班批次应用到业务数据；</li>
          <li>从已应用的排班批次生成对应月份的排班周期（草稿矩阵）。</li>
        </ol>
        <p className="text-sm">
          完成以上步骤后，本页将按「月份 + 周」展示员工×日期排班矩阵与半小时覆盖情况。
        </p>
        <div>
          <Button asChild size="sm">
            <Link href="/schedule-plans/production">
              <CalendarPlus />
              前往人员排班生产台
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
