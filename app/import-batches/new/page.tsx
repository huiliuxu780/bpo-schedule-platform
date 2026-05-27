import Link from "next/link"

import { ImportCsvPreviewForm } from "@/app/import-batches/new/import-csv-preview-form"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import {
  csvImportTypeOptions,
  normalizeCsvImportType,
} from "@/lib/csv-import-preview"

type PageProps = {
  searchParams: Promise<{ result?: string; type?: string }>
}

export default async function NewImportBatchPage({ searchParams }: PageProps) {
  const { result, type } = await searchParams
  const importType = normalizeCsvImportType(type)
  const config = csvImportTypeOptions.find((option) => option.id === importType)!

  return (
    <AppShell title={config.title} searchPlaceholder="搜索批次、模板或错误码">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/import-batches">导入批次</Link> / 新增
            </div>
            <h1 className="text-lg font-semibold">{config.title}</h1>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/import-batches">返回批次</Link>
          </Button>
        </div>

        {result ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {result === "missing-file" ? "请选择 CSV 文件后再提交。" : "导入提交失败，请检查文件内容。"}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {csvImportTypeOptions.map((option) => (
            <Button
              key={option.id}
              asChild
              variant={importType === option.id ? "default" : "outline"}
              size="sm"
            >
              <Link href={`/import-batches/new?type=${option.id}`}>{option.label}</Link>
            </Button>
          ))}
        </div>

        <ImportCsvPreviewForm importType={importType} />
      </main>
    </AppShell>
  )
}
