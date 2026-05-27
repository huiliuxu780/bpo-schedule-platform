"use client"

import { useActionState } from "react"

import {
  createDemandForecastImportAction,
  createLoginLogImportAction,
  createPersonnelScheduleImportAction,
  createStatusLogImportAction,
  previewCsvImportAction,
} from "@/app/import-batches/new/actions"
import {
  csvImportTypeOption,
  initialCsvImportPreviewState,
  type CsvImportType,
} from "@/lib/csv-import-preview"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const importActions = {
  "demand-forecast": createDemandForecastImportAction,
  "personnel-schedule": createPersonnelScheduleImportAction,
  "login-log": createLoginLogImportAction,
  "status-log": createStatusLogImportAction,
}

export function ImportCsvPreviewForm({ importType }: { importType: CsvImportType }) {
  const option = csvImportTypeOption(importType)
  const [state, previewAction, isPreviewPending] = useActionState(
    previewCsvImportAction,
    initialCsvImportPreviewState
  )
  const canSubmit =
    importType !== "master-data" &&
    state.status === "ready" &&
    state.preview?.missingRequiredFields.length === 0
  const submitAction = importType === "master-data" ? undefined : importActions[importType]

  return (
    <form action={previewAction} className="grid gap-4">
      <input name="import_type" type="hidden" value={importType} />

      <Card>
        <CardHeader>
          <CardTitle>文件信息</CardTitle>
          <CardDescription>{option.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_16rem]">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">CSV 文件</span>
            <Input name="csv_file" type="file" accept=".csv,text/csv" required />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">提交人</span>
            <Input name="uploaded_by" defaultValue={option.uploadedBy} />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>字段要求</CardTitle>
          <CardDescription>
            表头需使用英文编码，预览后展示字段映射、行数和待校验字段。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          {option.requiredFields.map((field) => (
            <div key={field} className="rounded-md border px-3 py-2 font-mono text-xs">
              {field}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>字段映射预览</CardTitle>
          <CardDescription>{state.message}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {state.preview ? (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                <PreviewMetric title="文件类型" value={state.preview.typeLabel} />
                <PreviewMetric title="数据行数" value={`${state.preview.totalRows}`} />
                <PreviewMetric title="已识别字段" value={`${state.preview.detectedFields.length}`} />
                <PreviewMetric title="缺失必填" value={`${state.preview.missingRequiredFields.length}`} />
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <PreviewList title="已映射字段" items={state.preview.mappedFields} />
                <PreviewList title="待校验字段" items={state.preview.pendingValidationFields} />
                <PreviewList title="缺失必填字段" items={state.preview.missingRequiredFields} />
                <PreviewList title="未识别字段" items={state.preview.warningFields} />
              </div>
            </>
          ) : (
            <div className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
              选择 CSV 文件后点击预览，系统会读取表头和数据行数，不会写入业务数据。
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="submit" variant="outline" disabled={isPreviewPending}>
          {isPreviewPending ? "正在预览" : "预览字段"}
        </Button>
        <Button
          type="submit"
          formAction={submitAction}
          disabled={!canSubmit}
          title={importType === "master-data" ? "主数据导入处理将在后续任务开放" : undefined}
        >
          提交导入
        </Button>
      </div>
    </form>
  )
}

function PreviewMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}

function PreviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span key={item} className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">无</span>
        )}
      </div>
    </div>
  )
}
