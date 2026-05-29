import { Upload } from "lucide-react"

import { uploadImportCsvAction } from "@/app/data-quality/actions"
import {
  formatFieldMappingTemplateSummary,
  formatImportFileType,
  type ImportFieldMappingTemplate,
  type ImportFileType,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type ImportCenterUploadFormProps = {
  uploadStatus?: string
  uploadReason?: string
  templates?: ImportFieldMappingTemplate[]
  templateError?: string | null
}

const fileTypes: ImportFileType[] = [
  "master_data",
  "personnel_schedule",
  "demand_forecast",
  "login_log",
  "status_log",
]

export function ImportCenterUploadForm({
  uploadStatus,
  uploadReason,
  templates = [],
  templateError,
}: ImportCenterUploadFormProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">CSV 导入</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            提交到现有 /api/v1/import-batches/upload-csv
          </p>
        </div>
        <UploadStatusBadge status={uploadStatus} />
      </CardHeader>
      <CardContent>
        <form action={uploadImportCsvAction} className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Field label="批次号">
              <Input name="batch_id" placeholder="BATCH-CSV-20260529" required />
            </Field>
            <Field label="文件名">
              <Input name="file_name" placeholder="master-data.csv" />
            </Field>
            <Field label="文件类型">
              <select
                name="file_type"
                defaultValue="master_data"
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {fileTypes.map((fileType) => (
                  <option key={fileType} value={fileType}>
                    {formatImportFileType(fileType)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="上传人">
              <Input name="uploaded_by" defaultValue="local-operator" required />
            </Field>
            <Field label="开始日期">
              <Input name="business_date_from" type="date" defaultValue="2026-05-01" required />
            </Field>
            <Field label="结束日期">
              <Input name="business_date_to" type="date" defaultValue="2026-05-31" required />
            </Field>
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
            <Field label="CSV 文件">
              <Input name="csv_file" type="file" accept=".csv,text/csv" required />
            </Field>
            <div className="grid gap-3">
              <Field label="字段映射模板">
                <select
                  name="template_id"
                  defaultValue=""
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">手填字段映射 JSON</option>
                  {templates.map((template) => (
                    <option key={template.template_id} value={template.template_id}>
                      {formatImportFileType(template.file_type)} · {template.template_name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="字段映射 JSON">
                <textarea
                  name="field_mapping"
                  defaultValue={'{"source_key":"source_key"}'}
                  className="min-h-20 w-full rounded-lg border border-input bg-background px-2.5 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </Field>
            </div>
          </div>
          <TemplateSummary templates={templates} templateError={templateError} />
          {uploadStatus === "failed" ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              上传失败：{uploadReason || "请检查 API 状态、批次号或字段映射。"}
            </div>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit">
              <Upload className="size-4" />
              上传 CSV
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function TemplateSummary({
  templates,
  templateError,
}: {
  templates: ImportFieldMappingTemplate[]
  templateError?: string | null
}) {
  if (templateError) {
    return (
      <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
        字段映射模板读取失败，仍可手填 JSON 上传：{templateError}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
        暂无可用模板，当前使用手填字段映射 JSON。
      </div>
    )
  }

  return (
    <div className="grid gap-2 rounded-md border px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">可选字段映射模板</span>
        <Badge variant="outline">{templates.length} 个</Badge>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {templates.map((template) => (
          <div key={template.template_id} className="grid gap-1 rounded-md bg-muted/40 p-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{formatImportFileType(template.file_type)}</Badge>
              <span className="truncate text-sm font-medium">{template.template_name}</span>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {formatFieldMappingTemplateSummary(template)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  )
}

function UploadStatusBadge({ status }: { status?: string }) {
  if (status === "success") {
    return <Badge variant="secondary">上传成功</Badge>
  }

  if (status === "failed") {
    return <Badge variant="destructive">上传失败</Badge>
  }

  return <Badge variant="outline">本地 CSV</Badge>
}
